//#include include/food.js, include/takeable.js

var label = "Lemburger";
var version = "1354589136";
var name_single = "Lemburger";
var name_plural = "Lemburgers";
var article = "a";
var description = "A single-decker Lemburger with all the fixins.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 187;
var input_for = [];
var parent_classes = ["lemburger", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-25,"w":30,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALjElEQVR42u2YiVNUVxbG\/QdSjDOy\nNM1OowIqElBRoy1hUUHZBEVQEHGJK24EM0ZRQGFUBEXcpUUjoCCgLAIN3UBDN3vLagOyyC6oxEwy\nyaRS8829t6VdIFaSSk3VVPmqTold7937u+f7znn3vkmTPl4fr\/\/ja0S0lj9Y4MXvzXXn9z5Yzu+V\nHuYD4I\/05vJbEubzG65Y8usuzOTXXJ6s9j+DelmzRe1b2RbBy9KA0efF6zFUsAZ9Oe54+mAleor3\nYrDxMurueKNZMA8NVy0hvzAD1WenoeKUgaD8NEf\/TwfqvOek355q79p+Z0mo4vYiwbOSrV2vKr7A\nC0kAhkXr3gDeX4HOtKVoT7GFItkO7Zne6C7ahaeiPejM8Ue9YBFaEuePKm4tFDffmCduFliH0gz\/\nIaiBIg\/9vly3mBeKpNEhkpGu9JV4kvI52pL4GKg7g28rduBF5V68el6P1ooLbwBTHdGZ64fB2n+g\nP98Hfdlu6JMcQHfJV2hJckR78hK0fsNA0XR9DgggzbC87qyZ62+TT+il9kzoHdqf5zlKJ+194ILu\ndCc2cU9JMPobLqH9vjeGmi7iuXQHy+Bg\/moGQgH7yg5iuPoIyao3Bh56qn7vSl+OjlT7cYDDilR0\nlIShNs4UFdHGgg\/CjUrWWQyLfLueCddiMM8LQ6Kt6C0IeD24A5Ou9fZi5eAJc9Ap3I0h6QEVYH\/l\nMTyX7XktOwVcpQLsznTFs9oYDFVHoz11hQqw4sJcyM5bjwFCHK4r+BW4jRYviv2Z6SngQJ4nnhZs\nQtsDn7cAx8tTf3UOOh4Goi9\/HZ41xGGkMhjDsn0YKgvCYOlO9Iu3obdwK3qKtqNXegQ9ZV+\/A0jH\neHRxJgOsjp0KcYQOgeT6j5e2LFD8onSDcvXC9+S5t+wdeZpv2KDxujXqr8xmFdqURO6RHMazxwkY\neZKM59UhGKlQgj4r34MhCcl03SkMNhCvVkSgPWPVrwKWnNBFYRhXPh6wNFD8vMSfAPqyqqTy9Ga5\nKgHTluHJHTu0JfOhSPocHXlb0SUOJsYPwUBVGPoKA8m9Lsyv9P\/DdREYLvJlC6VWGSwPxlBNFDru\nr2Jq9EpCyLMHJwQsjtBFUbgOxjdc8fqYYTGRqdAHQ6XbiDy7MFC8HX2iL9ikA9VRGKwKR39pEPrJ\nb9SbVLqnOWtYEdGJaYvpSHcmxhcoPUhsQgutr3Aju1d1z12ixt2lbIFUhTHAyjM8FIXpjAekLYUa\nncran+uhHJTI+0RyAm3lsWjJ9FEaPUMJQiWnE3XnBzAgml1aQNQCipTlpBgilRahXYBkdqyKaSdg\n91KrkGJT3LZF001bBkgbuZhmjwAKj3G73gHsyXIR9Ga7Mono2+BppvMbGCIvHZgWCV057YVjMLQn\n0omoL0nzJd6cj7b8nRgo9GcLZC2KjsM87KDso8Qm9P7HNxewN009kVh6mgcRyRrLHgnRMa13m7c0\n1lzcna7MihLGnq30fZieki9ZBVIYOgE1Oi2YJsFcNF6zRvUla\/TLDimLiyyUwaUtU7UotqDXXYDC\n0WdkZ0jlRpkwsILD2v9J8NMcjXdSj68N5JiqAIVhXEFz4gIVSNtbWVHcXKgCoYM2Jcxl5m68ZkXe\ns58yk5PNAGSxpugq2KosLApHm\/uY317D0fGUPXQue76OSCsKV8qaHaKNy+6auLpC\/d+lflqD9Zs4\nnY\/8\/sZlgHlhXAvRcT3UkxW9CzOHtRMljCUzdP0lC+KZWay91JwzhSxmKsqjp6Ltvu+H\/cYsYMPG\npAuTE7ji4\/oqWWMd1HHNWQNV\/troil30c\/83zi9bwy33M0CaTlmwtpTeWHaKh+pzZqi\/PAYzk8HU\nxZuj7rwZqkgrkEXzyH3GkJzkoSJuNjpyNyj9S7yrgqP2eA3H\/EbhrivhauPMSUHoqeBSd3CQ66mF\nGj9tiFx0kWOvD6Gr\/i+PDxqlKQFDLXNaw2f9It1NfHCEq3pQZVoig4gMKCZZLj5hgJJIQ5REGaI4\n0gCNCfPRM+a3t4vhfb8RJejCS8lzb4+dRaS9slIDdRu0GWCWnSGyHY2QuJCDB5EzBkO8yD7yCye9\nxL97GOKqty4eOhkg0UsXGXu54yApIA3RW6unURk3g9hjLqvixgSyBySZenTFGvLLlqgg3pScNFZ5\n7e2gmbtAZC1Zy0HFWi6EKw1Q5MHD7cXaiDD5BAeWGWCnC08+KcBBb3SPmwkOeEzFFQdjPLQ1weWF\nejhvx8X5ldos4l045F9iYi+NCbP8eyI9iMPGuUuKonI9B5W+OshbYYQ0O11c+lQdUVPVcGSuBrY5\nGcJzoSYmbbDXBY1ARz3scDbEaeKBJFsj5PN5yFlkhPsLDZE2Xx8p83Rxy14TcY7quO6tyTKQuV+b\nxf0D2sj7emJwWqF3tnKQsFaTyZmxShNVfhwiK4fIykGGvRbOz5iCWLO\/4vT0ydgx8y9wn68BjwWa\ncFugLieAOhkBDkpIGvTvLUv1cMheDzGLdXF9kZ4KMNNWG4928pBNJkl218INNy1ccdVC\/HtBsx3v\nro24pVpIXEogPDRRsFqLAdGoJpmreh0XZ2ng6OwpCLScjNVWk1VwDHCeetAkL\/vJav52OuIxwLHY\ntFQf+zxMEORihPST5nhZYYtX5Q54IVwHxUEeWvbp43GIEQYS5+BF3hIW\/6xain\/VO6niO9ky9Nwi\ne8hQcyi+nonBNE807DZE9UYOpASuzE8L3jZT4Db3b3CfN0UFtmYxgbOZEvpms1C6mX94nRnezuRY\nbFmmj\/2uRmiIno62YyYMjMbTeItxQGPxY4sfflRsVgX9bSTrM3RfJe\/dMBMU+GqheL0mi12fa6rA\nfJdwEOyhi\/xjuu9uGLoeePGHSrYg+6wzgtx44yAvBkxFzZdmRF4dBkknGwfW4IafukLxQ0ckXjVu\nw2jdWhYvK0nWZXxyRFiMkbKF8Fmigc18dRVg2HIlWPgGc0iuu0IUZYz8ozrv7gk7yFmkJ9cX38vJ\nsZFstxLI8TbQ8Q2g5JAlyrfo4cZ2QzbJ9\/LlDOqn9n1KKMVu\/NAZhQHpGpQlWCHz9GxcDDbH2SBz\nRGw2QWiAHmpTrCARzGYec7dRh2Qv2WLt5iFxnzUeP\/DHiGQTpOcsIAzXx8OjOjHj9oQd973kPbk+\nDPLHhv3sodMbTHHWnYtSfw5ue2pgPSmSiltW5ETnxLLTlL0KSeFmLI76GzO\/frXGFLtWGmOdLVcl\nHYWicC+r3XHtkAl8iMeSNxqh5chsfFe7C905XhCfnAZhhAEDzDk0wfm5K2t1aGemF7qz15KHduPJ\ncWu0hVqgbrs+JKQlnHJWJ4BcllGfxVosKDBrT6SPbSZe3Uj+HoN6P8pv2uDn4XQG2VkQiAFxAGTb\ndFF60hRFkTwUnjB6DagXOuHBqUNor9ae4Sl\/kr4K7WnuaDlhhZpt5M2xg\/TDEEukHred0J9j8Wtg\nXp9p4sDqacg65wzZDTsUxtqgPHYWik9NR9Z2Lqp3kTdVhDGKCGBBhL5cGPWBzySd99wtnqR7jJJA\nW6obWu+6oP0eOXznkzOGKIAdyq8Fz8Exv+nYRrL2IcAARy7idpnhLpFRnrAI5WctUBYzE5IzM1Aa\nbcYAczdoof6ACaQhZINw3FBOd1a\/4VOHu0VbmlvXGKAiZQUepzijJdkJzbeXoemWIxpu2qM+0Q73\nwuYgzH8aDvnwsNfDAJGBU3Fhtxmyjluikpx5K+LJpjTuU2J+ywkBkwM56EtxgTRYT14U8Tu+25CN\nplrrHZeY1lRXKO6s\/FXARwJbkh0+6q4vRu21Rai5sgDVl+ej6pLNG8DzVhMClpwyhSiS1yXby\/Uv\n2zjlkz\/0jablnpP+47vOguYkp9E\/C7Ak2lxcHG0eI4qa5vqnfuVqvOVo0XzbMbThpkNMfaKD\/LcA\nys5by6VxVhnSs7ODpGdm8oVRRmofv6p+vN67\/gueBM9K0kDOMwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lemburger-1334209750.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("lemburger.js LOADED");

// generated ok 2012-12-03 18:45:36 by martlume
