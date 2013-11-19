//#include include/food.js, include/takeable.js

var label = "Hungry Nachos";
var version = "1354649255";
var name_single = "Hungry Nachos";
var name_plural = "Hungry Nachos";
var article = "a";
var description = "Are you hungry for nachos or are nachos hungry for you? It's nacho decision to make.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 508;
var input_for = [];
var parent_classes = ["hungry_nachos", "food", "takeable"];
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
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-25,"w":38,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIJElEQVR42u2Xe1BTVx7HM7tjd0Y7\no3Z0LGxXRB5TxlKsj9otRbBbtu3SLVqrtrJdLW53dlq7TF07FWpLX9PXYi2lXaVos0x5JLwChCTQ\nBgLISzCJQHgF8iAEAuQF4aGA5rv3nJArATqtbt39hzPzHW\/uPd7zOb\/f9\/c7Fw5naSyNpbE0FgwM\nZ3Jhy\/DxuGfLWQk7L+T\/A2TOCidygWT4MNeAOdMOc3YifUaA6W\/mviXr0P8c0DmcKSOLM\/\/qZkzn\nuTP95+CCzMJUpz+u6Z\/G9f53cVX\/BUbb37HPjSS5nh\/t2wGom9ScAtH1wXT0Ve7HYMNLsLfEw9nD\ngVNzB5z6uzBwIYo+szW\/bndtajaqTKTd0b9dKYau+Dl0ZT0FxaexqDwejpq3HkVWSSRKq31dkKMH\n0HjCD+UHQ9AQHwqDJBZmeRwcne9jynBW5s7CzS\/OpID8Z7eYlwhc3spOtPelJhJ\/XdP+Fh3JPnTx\n\/F334ZugIFQf9UKycBtSSyMx2fVLOPsD0CNaBunhe1G2937IDj+AvuKjrBVmLSK71QLAYqq89Bo+\nKniIgkyqNsFpi7oh8070N6+CWfsZnL074WjhoPHMcvAf8wX3viCozu7DaNvb1JdEU4Yztw6oa3hr\nUcBh1UkUiO5FZe16OA1ecA5ugXNgk8tvrStQWHNkNjJpaK7zQ36sLzK2BUKf7cX49fcwVu2mniQa\nbnwZJBs\/oRqZ9DGtgPQtcq+94rXw3M9D0Vp6BHrhKzR9vJ1baRG0lz8DdflOaCqZfVziYEbNoX7T\npK2Dgf+Cx2aSRU\/e8OOsJ2dMT2Ki1RvWxu2wK6MZG8TJMJRM7bNowSwWpal+Lgq\/2oXGPH\/6YsuF\nYAxXBGKseQNqqwLR9P0KdFdwoEhbjpqENVCdWo1xxTo2daSy9byjuPh6JPUojajpJGw9IejQHoDO\ncBBOxwtwWh5jMhDBPE+fu77AA3BSc1o3F46EnnijsfgISBTrC\/xxVb0KGP8LnPY9rN8mO3ZAsn8j\njS5RTuQDbOqICBjRZOcZ9t0Nl9\/AewWPUBE7kM0P1u3GuPpjujF3L\/UAtLcmCEjqyCQaPQaOTBzX\nnaWASVmhSBdtgalnM4W0yfej+dNwunjTGxtxKenXEMf70CheaVsLrmQLPhaE4dvUzXRO2+cxmO79\nhoW01H0G8XNhEO9bDxXXG52SG54kkIwn4zwAp42ph9wTjNUxtNGSSiOgmsYXcaYomO6YeM1auR6a\njDDITwZBnuBHW0mqeDPSy4Jh0wXTYqmv9wZPGgSlMgjXNKvRx19Hi4GI9MC696PZqPcWr0XZuV10\n7YHaw57pZX6cdh\/maumfPdLDAtf8AV1SDox1HEw0LcO08XHaSmj1zpXuTtrzyLVVwcGU1stlCcZn\nVzt90ZPzELTCPVClPo6aVx9E05droavm4JpxE5SSh9Fc9EfYVQlKd5G6zkL34c6EVFN3AryXttFd\n6cv20tOBvEyRtAO1Jzag5pgflO9scIEwxiaLu0X8OCG\/k1ZxS5I3OkS\/gK0jAFdsMbQY9CV7II7Z\nAT3fH62fbGS9Sd5rqL0DU8ZQ1OXtZTZ1KsSjz7k9567a3LiHkR11Pwr3bUHJs1sh2R2M6nh\/cD\/Y\njsYUpq2cf9ADjkRHnxNAvVR7zJtdmGyGRIeknVce4uqTs5pWr4bin6Fo+joS4jd3oD7TD4ON92DS\nkq9c0IhJYZC8U2POQtZkxbD+IOK\/Ekj916B8lW0VTtMBupilwpudlx4SROHkbz8F68UEaKrW4HL+\nXVC8t4Zq5MJyWJsioK74KwpSHqHFR9pYW10KxhwmOBwjpz0BmYbYVhLt4TdiYuvl4xC\/GMYuLP4w\nkJ4Yk\/r9bLQ7Oj5AgyIWFuZEcM+THb+bVqt7jrFxK2RvrmafV\/0jCoPNH1IoAlcrYnqyRQ\/H2CjV\n2Nho4oIGXfhVmIBMJlVUz3uCLXdd+bPsLomo7wxPsItfMXHpcWbVp2C6czktCkvrXvY5aVHDl59G\nM38ZTT8BbDsXQeGkvL\/BqFewYKwcjuhFjzlR+t+jRd8eg+DsMxSGgEm5v6PQbsChtgiMqe6hFiAA\n5NuPtAvi4QlVgKvCdSdpayL3SBbMyiO0+sdVs0ccU9061ZcLwWbFjJU\/eBZXSUtl1dIyyMR8SHjv\nsrBuDXc\/jyG5LyRpkRiWH6NWcNtiRLEJhhoOBXefBjQLsj+hVfwr9NeugKMtgGZhZuyjReH6DXq7\ntr39hz9aK0pF0QRwrtywhWkHKeBU33YKK0qNgKIgitpgLiBp8AS8V\/Y8tQvNxGw6J8yZNIqk8sfG\ndB5wg\/196FY1637080oqFgokxQIQlQoLwUCzsPaBeFjUu1F8PtYjssQGNvk66CpXUWA3mPDcHnTI\n826AjPbiumblAsAhUz96VM0yXXtL+I8CikT5PgX8LOTzMlkV5+dQ0B5VCjoVSRS2sqwIZbmfUNi8\nLx6Fsvg3uJjnxUIrqv4Fq6V\/QRrHRlooKLkedYzYjb1aXXdbS\/RNfaQW5vK4cwGJCDSJ6HwLuPVd\nQTKE\/34Z3zOfVkMDagpgMQ\/BZOyFQduN3p4u+ntuOzFqtbf2dzKJYh4vQzY\/kkSCnGxIJSULAMk9\noksNtRTAajWjp61lgbRd7TKTqS9co9Gs\/Fn+YisuyAkX5ucmCvhZAkFutn0+8HwV5fExyHhKr+7w\nhPupHvtvR0WpMERUlBfH+FLAyL5YlKvLv2PBSGXetMd+znGhojREKhLGiQrzuUJBro7xL5hrCsZE\n7RBnaSyNpXF7x38AImp1AaeyYrUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/hungry_nachos-1353117453.swf",
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
	"newfood",
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

log.info("hungry_nachos.js LOADED");

// generated ok 2012-12-04 11:27:35 by martlume
