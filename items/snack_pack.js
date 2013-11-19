//#include include/food.js, include/takeable.js

var label = "Snack Pack";
var version = "1348007868";
var name_single = "Snack Pack";
var name_plural = "Snack Packs";
var article = "a";
var description = "An apple, some cheese, and a couple of pickles. Not quite a meal, but it'll do until dinner.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 66;
var input_for = [];
var parent_classes = ["snack_pack", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && pc.skills_has("ezcooking_1") && !pc.making_recipe_is_known("100")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> a bit more."]);
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
		'position': {"x":-36,"y":-30,"w":70,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIVUlEQVR42u2Ye1CTVxrGM\/1j187O\nrDNu19VKSNAkJKIGBMGqLWo7u9rq2h3bsd0dh9mxnb10Wt1x6l5m2qyIa4soBqkCXlAEEhIgKIgG\n0AgUxOUSAkICESIXsXIxQLh7efacNwbx0rrd2rp\/cGbe+b7vkOT75Xme95yPCASTY3JMjqc\/0Pxb\nEZreUeHKu4Yx21smXapXaJpGaMrUCU35ueLo4mIf5TMC20A3dlUtCmVw6K8MRXfZcmhSvMw6jRAF\nZ8XIOSlCTpYIpgJxmOd9JSU+onNGsSr\/jFjFz58+2JUNm+\/a33FwKDS9PXW4RCEaqV2FkctrYDcu\nxuH4WaYMnTfO5\/lQZaV7w5Du7TyfL16n0woNWRnsWu9N4BfOiaOfKtxY3RuJHORmWQgIkMHy+d6y\nIAzVrEKNwQ\/RES869Fq3gqZ8HzC1cMrgjdQTXsg7IybovFwxQWqShY6nky\/7hnUEUupnGqoOJbju\nkkD0Vywz8\/n+8mCasxikSFB7ISnRixTiMLnZImhThMjU31eVV1qqEPv3zXR8p4x5rByzvskBwjhg\nZ6EEropg3GlYT1DXjMtU3cVyuKrX4IxWjJQkL8QfeBFcRWYtwWmSvXD08Cymps8D0DvCpyf+z8rd\nsb3lbDV6E1xzznSM1b2OwerljjajEL0X\/dBbNh8jNa+hPnsFbFkSXC8KwclUETJZ\/hIOziIAT0V+\nNoPAeR7P5oihZ03EsgrDfonDmuof9u0BrStVsK0Cs\/Ze1u7X6OXVBNhd7IuuIilulgbiymkFms7I\noUt0AxlZxvZEzsCunb+A6pPpiIyYiSMJs8jWDJ0QDbUfoKrsL6jVvYx6TQDqUv2d9an+0fXJAaL\/\nEnCJaswSDF6wvgY0rmOwb0+A\/BVumOagq1BKsPZsX3Scl0N\/yJus5SrlnnKrmXzcCw2WjTgU54\/y\n0rUoOvdrdLZG4u5QJsb6tbCVbGHNxRos2d8Nq\/E3PVFVDthdJEM\/sxH1S6l6L85lx2X3gNfDVR6C\nvrIFBFhydDba8iXQq8Usb3NwoSCY8lZTsZYU7Wn\/HC2Nn+Fy5RbcGdBh2HkCQz2H0X8jAX1fHWV1\nBL3XD+L65U\/RUf5n2E+vQuOpV512\/cLojtOPURX1L20ergrEaHUwwd2qCUFHgditKAe2rsRAZQiD\n9CdAY6yEAM8nLkGr\/Z9w2LYxSCUGumJRcmENRnuPAsNZDOgA7gzqqVqsagauhqvzMEb7UnHLlYK7\ngxn02q\/yN6M43A8ViQtg1wei9eQiU\/vJ4LCJgKEchAMNVQbgdu1iBrKAjh5FeSfzHF4rECFXLUWH\ncQGG2mNwe0CLmx270Wpxq+Xqiqebj\/WdwEhvCnra9mPEeYQge9oP4YplJ1ptkbjWuJd9oUNoTd8E\nyyYZNOFS5O6Vw5ykZBkNgOkLPzwCOGoOIhv5+Z3LS3G3buk4YCuzsbNQAWfpPAJsqfyIvj2H4SCj\nvcdIEX4+4jyE4ZsJuMmAOq\/GMHsTxxXjWbzt0hAwf39vcxQsf1PCkRmElqxFBJf+Lxkydsnca2aD\nNkB5Iy\/Y4QF5uPovzcdguRKW9BBodkhgzZITYN91NYFwda7W7R6HctTuYarFEACp234MDZUqlrlY\n+vtY33E6DvUkoD1lI6pXT0PWR7NwJT0QtrSFyNwlQ5JKYs6IYPu2VeOv4p3UbGC7ROlipuCSRwCH\nq4IomxaWjRMqCVXGViG7STwpwVXhlg10xZHFXCGetaGeOILhkGN9GgYZQZCulr1oS94I26Y5qA4R\nIO930yh7RXHzcDrKl6knNev+OnsqqXduv8JRfnQBtbvDEIS2U8FozwlGWy6z+svFGPr3Syx37kax\n6JQEd+nIfFj3SDDYFk2QHNBWEU435yrya3v1rnuKxdMch+QW33Jp0XXxU1S9MgXmYAEK1\/+ULTML\nUXjAjz771G6ZM3uP7P7jWt4+eWKeWoH8GAXKDs\/HVcMignTLHUCZ4NfmJH\/2mrnI3u0OccPHM9Gb\ntYkAeDPwZaSr1Q3Ms3jLlUZN0HXx7+it28nUPYDB7gQ6ujq\/wPXibcj9o5A+q5gppwmXkK0PwJGC\nsQqRcZ\/cxCF5FexXoOq4ktTkgFxZfmxg2eDQzSzIbAlAS7gYN96fTSpyIG5td5v75jxfXDGewYHW\nOFS+PAX1v5eh4T0ZGt+XwfL6z1D4y+dh+NyXKnu3L1LDJc4Tn3zDg26+2ndd3j6FcyJo5TElAT6u\nrLFytK3+MRxblZQ1zzLSd1VNKg71uJXl8zcKtqJqkQD2le66+Mbz0G0RjueZA2ZGSkKfuN3lx8+e\natyniPZAekB55jxKToRsenMKml59jqkjQU9NOGVtsC2OFGqKWo32zPfYWvkhrp39EKXblDjz7jQY\n\/jADuggpUre74ZJUc5w5UbJv9\/BwNkamZGqaJ4Ly4qBNGUFkM1\/tG3eISJGG5QKYQ6eg+cBv0G3Z\nDusH89C4gu2erwhQu0SAL1f8aFytPPVct6Xb3XDfaOuTRp7ad\/NE2x8G5c1j\/9MLBFIZJEBFoACX\nQp4jIG4p79KitT9Byj98xgG14W5LvzPcQ7YbHobkVXjQj55IbLEKlGz6OUxhL0D7sWgcxtMEOVFy\npO2Q0px+p5SWkqcC94CaMfLQid0+sYrugVq1LJcZtNGTunzJ4lnl2xZfRjhgWrjUfDrqe\/jPzjOM\nankYA3V8HWh1krvzG\/UL0aALxNlohRuMKcjXufEd4vseX5dPXqUJ82hn4KrxffWetT8c3MR85qvl\nqseBapliHJBnjjVEouBZDg7q2TIfBszYJX22cI9um+6O54Ap22dv\/r\/8cYl3vD5izrrJn9kmx+T4\nAcZ\/AEOzBAFcqwiIAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/snack_pack-1334191387.swf",
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

log.info("snack_pack.js LOADED");

// generated ok 2012-09-18 15:37:48 by martlume
