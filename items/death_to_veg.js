//#include include/food.js, include/takeable.js

var label = "Death to Veg";
var version = "1354649205";
var name_single = "Death to Veg";
var name_plural = "Death to Veg";
var article = "a";
var description = "For those who wish a violent end to all harmless vegetables, and desire to feast upon their flesh.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 39;
var input_for = [3,39,340,348];
var parent_classes = ["death_to_veg", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
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
		'position': {"x":-15,"y":-35,"w":28,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHPklEQVR42s2YWUxUZxTHfTQx1Rg3\nUHFYZdgFYXZmYWAYQUB22YQZVBYdYVjEYekgIOACikjVICKiVtLWtW41BbUmLn2wbdIlbdI+NCZ9\now99P73n0O96BweYmabVSf65DJmZ73f\/Z7nf+RYtmuf1dCBpaiH9OLrV\/m812iCzL\/LkNXlMD88G\nDW7p5VAy6fkpAzw+nkia6tPD\/V6dU93t0cK+zGBwG+5Si0IkBOTcAnyPengkAe50a0m3ujTwqT2e\nNNGmggtNcjhjlcCgJRb6q2KguzwKukyR0FwYNqdKDf7QUhgicgvwok2umc9BBrsQ9GyNcTcw2iiD\n07Vx0FcZQ\/AliX5QlRaocQtwvEkShU78lzpRvRnaisMhXyuCXN16jdth5uyftpeE0116Ily8pSgM\nmraHQl2OmHKtOj0IdqUEEpRQWQne7oV42CrNwJzCsLDQCcM3blM46HKzwmlIP25VvvVZJuYeOajd\ncNy9EB+QT7lbwa7qwWEdARbpfYUuTr0XgFhQCIf5NyvM7x7wUb+eUmE2YIFOBHla0XWPAetVIuja\n5DO\/4jZAlz7AQSOFkXDZFM1rYFc0n3+Ym9j\/EK4xLwR2Gv3tHgPiYs+2hMPriZ459fuYHX45XMXr\nB1sBfFuVwgu\/X2cM5AGx2KzZYtidGvhPww4d9RiwVelLC\/z54orHmg14l+sIh8yR5B4C2grC3MvB\nq22qN4AR6+BF5maHBV8\/GoWnV47Bg\/PdHgF+wVXy+QYp\/7hzGxB7GB9iLscwTMIF95oLQavV0fW9\nAvz53lk401UPpoJsAjRqNXRFNVWXvVvAV9cHCaROL4dzhhi4vTUWvsmRwte5cnicKYVtOjWFnUGx\nm0HNBrzfq\/UcEDcKzgAxnH1KMTw1htGCL1PC4a\/COIAdMtLRpDiHkI\/32UCfHA+pxmSnVSwExOe+\nW1stBni5QQYjcn\/46aCJ3DukCIFr2o20IIP8Pj2KNGmMoM9gAaHbmAaGDAWFHj9rMQTMCdiQK3Z9\n03rJJisVAl5WBVJvY4DnOOCbumAeUij8DFY2OpnKuYtCQPwNS2qQU8Birln7LVsMbvRAhf3awbcB\ncdFK1WYCRI0pA+BKfCCv4XgxAXbU74bSWiP0T2ZDaU8C\/W8yKRR263wdAM\/UxIE8YDlsXLoYSvxX\nQpP\/8mUuAXK5Yk\/wWgpMDBCdSdJowKaM4CGZjiiCIVOtpJtIMiZA780saLmRBjt6EqEgO4PczQ5d\nTXmIak7fCBErl9DvW8RroD7UG6xiL9c2rbfKvaYmDH4Ehk2aAWLiXxtqJ0fM8XGwTxVNQrC8zDQq\nCiyI+oE0cs9yZQtkW3XQYjERYI3Yy0EVQasJjMkauibDZcAnGTM5hhV8TbORB2TtA2FYC8G\/+1os\nBI5wg09yYf9nW6HqggGSsuLhfG8DPCtSOzh+SuLrAIeqC\/VybcNwy+z96ss8fx4Qr0JAISjmG7qW\nU2aAzolMgsPQonv57fGQmZYCLyaOwTNTIpyIFfGAA3EiBzhz4CqQipa51gtvl3vD\/WKfOQERDCsT\nHcNiYGCHH2aRcwhXdlJL7g0drOEBzwsc\/Ej6xkHMQenapZCl8pl2GRD1MN+PB\/x1oJbgsL+hYwiG\nhXDiUQ503MkA60QKgaGK+9SQWiEHoyEJHl3s4QGx0oVhZnAxq5ZAjsrHteEJB\/bm+BXAZA5aye8F\nERDhKjpToP3zDN4t1J7xZHIt2y6DLWUKchdzD+EY4LDMsfItwZxzqz+ASm5PiLOxS+MnPkUGK2Jm\n+h+nPWoRD\/jHV2O0MINCVYwkQeERLtdauWdxs4TgMO+uD7XxcAxwH1e5231X8JJybaZQs4GaNT\/d\nuQKI4yV7DjPA784200IIiFDMLYRCpddJKee6GnY7gAkBy7lCyN28FsqUPtQHi7iwsh21yejvGuB4\nk7xGCNiq8SPA5wMz4cKmm5iuBmOJkpc+RU35dm+4wykc6rmtmAA7yiL57RZu+XEmwcG+hhvqXQPk\nHnMMEKewNrUjIAorE51iwvesGOYDxKbfXb6JDphwy4+AbKrbuSXAPcAnxxNpRGxRzcwjz+1mguQ1\n0j4vkDNA7AidnIN4LnPnkIYHFMplQHa8US1Z7zBe4mOP6W6C+M1OJiOG8mxO5cro+01ZYujnZuJP\nPlQ5BVywzYzb5Nednb0M10vhJPfDjduCwaz3g1KtL+RL1lHSo4pi1oIlet28Kg5bA9UpgQSIx3DO\nAF0aN+c67PFEYwfkcLZOAsc5qH6BTtdKoNMU+f8AshNVvJ7jNqEjjTISvp8NJtSNDvXsA6TfFgTc\nnx\/6anS\/jBZaCIwd984FcLQyBtpLI2E\/ng\/mhjjIxvW+q61KOFYRzQPmaTcsvJtpLgyv2cvlWVtJ\nBAzsjSVnhJrPkZ6dm3igGi6\/qrhmPJ+aCsLgZqeaDjXztKJplw8xrdnBNZVpQVNzaaGF3REeYvbu\n2jRtNvhFOWP5G6twp+3nNK+SAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/death_to_veg-1353117235.swf",
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

log.info("death_to_veg.js LOADED");

// generated ok 2012-12-04 11:26:45 by martlume
