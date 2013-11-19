//#include include/food.js, include/takeable.js

var label = "Whortleberry";
var version = "1345744982";
var name_single = "Whortleberry";
var name_plural = "Whortleberries";
var article = "a";
var description = "A single delectable whortleberry.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 5;
var input_for = [43,58,93,98];
var parent_classes = ["whortleberry", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by whortleberry)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-13,"w":14,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEnUlEQVR42u2X60+TZxjG+Q\/4E\/gT\n+GqU7e2RY6WAlEMLlFLaUloo5ViOltLSllOZcQE3NyZGZSerm7INEAIIwlAqGMYAFcbEQ2QSjfHL\nPly736cb4JYs+1AwWXond5707fPhl+u67rtvIyLCFa5whStc\/+8ymeajdMYfOda6aU6jm+A0mlEu\nN3eQe6dgRlNAbbLcDZgtCyi1LqDEEoCp5DaMphnoiyah0Y4gN28Q2cor\/vTMAfmhgRnM89Emy0Kg\nsnoZ9U0r1KvsrGtYga1uCdbyAMHOotg8iUL9CFS515CZ\/TXSFRcCiWlnow4WzjAfXWJZ2KmtX4HT\nvY5Wzyb1r+zkPztca6i2LcFinYe59BaKiseRX\/A9slVXoMgYQErqZzsyWW\/0gcBpKWum0sBOde0y\nwWzA7X0ET\/tTeDuewdPxFO62LTicG6isWYa1YhGlZXOk4k0UaIehyvkWGVlfIu3EeSQkngpIJGci\nQ6+ecc5XVnGP7LzP4HiwDt9v6Ox+wU6n+xnqGjdRXbuG8qqgiqaSaWh1N5Dzp80n0i9AdrwXApHD\nF1r1tFNRRvMd8Lmz1T2AvWULrd5teNtfor3jNVyeV7A7t9Fw8jFs9Q\/ZvTLKorl0BgWFo8ihYcnK\nvkw5vAh5yqcQiZyQSDyhU7FQP+0zlcwz+2z162i0P0Gz6wVl7w3Z\/DvBvqH87bDntQ0bqKr5GWXW\nAGXwFk3zKJvmLKV\/D1DsgkDQrA4doGFqvdj83wD578srl8Hf1xf9G6DdHzJAnWEKvMUW6xLZd5+y\n9ghNzc\/R7HyJFtdrOl+hwb6Nmrotyt8DGpAldl9nmGaA\/7A4CLgTEjiFfjiyUD9Jds3BbFlEWcUq\nKfkLwTyGtfIhLOWrBPyclHvCnvPfmy33UGS6TXvwJq2ZkbeGJFl+FkKRAwKhHSFTsKBwHHrjDHLU\nw5CnDSBTeR15mjHI5P1IOt4HXdEsqmybQfWsP9H03oXBOEsTPAF1\/tBba0Ym62FwIQXkbeJtztPc\nQHLqRcQnnoE0\/jQSZZ8gPukj5KqHSM01UnOZJneRqcffZ\/lTf7e7qFPTziE2riP0gOr8H\/z5BaPI\nyL6KhKSPceRIFXUljh6thUjSCWncKYilPshTz9Fv8R02HFrdONSaoX0\/dcH8\/WUvZTAQMkBV3qBa\nlXud2SkSt+NYTAN1I2Lea2ItELohFLexMwg3wbLHXhZ49TI\/J3v7EZ\/QvaseAYZuWSsUw5GqvGvr\nySnnIYntBidwgRO2MiDWIg8k0k6mFq8cgyNrlTnfIDPrq33D0bILSMs6tC8O4livOj6xhwA\/IDu7\nWEvIVh6Yf\/Y+18JUTU3r34Pjrc24xLInkXoORr39JRK1+kViL8SSLsrdaRqWXjYwPCzHOZAk62Ur\nRam6ug+uH9LYtj04kaPvwF63FIovIiWxnX7eXl4x3lrebn5YhEIXA8tSXmYrJV1xiYB7gkuZwTXT\nfacv4jBKLHZZOO7k+rGYehoS6pg6UtVNQB8iMYmUTfARmHMXjCDXhcLWw\/8LEBfXJefzRD329xaK\nnWNiqaePvxP+5xaucIUrXOF6d\/UHZvqcI7IlcC8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/whortleberry-1334346321.swf",
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
	"fruit"
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

log.info("whortleberry.js LOADED");

// generated ok 2012-08-23 11:03:02 by martlume
