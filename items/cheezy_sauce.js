//#include include/food.js, include/takeable.js

var label = "Cheezy Sauce";
var version = "1354586778";
var name_single = "Cheezy Sauce";
var name_plural = "Cheezy Sauces";
var article = "a";
var description = "A crock full of pleasingly, teasingly cheezy sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 59;
var input_for = [348];
var parent_classes = ["cheezy_sauce", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	return out;
}

var tags = [
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG\/klEQVR42r3Y61NTZx4HcP8D3u+b\ndnY7Y6e6a7uddtrd7rJtEdcqxiAXAcVAvABSoKgVQYgKDveGS0ISEu6XEBSikHAR8IDFSlVArjYK\nBAhgUCCiQAgRvvvksNp1mliBkz0z50UmyZxPnssvv++zadMaL8i470Dqx4KUw3t5r0g5lLWbvMf\/\n9XPkOzn+2zbZ80I2R0kehI3cK9kcLSRHHewCXMl0pyD2XTduPtML989+BbuN4ErqbgppbEDgAYgP\n0A81iQ5iMesA\/fBn6Z4w8N0xleKKyaS9GDznjL7If6Hr9D\/QHLgNNX6bceXgn\/5PQJEPDbTgLDAL\naiLeBcOxO\/Egxgm9ZxzRcfJvaAv7FDeOf4TGo1vtC5xJcHKYi9+JjQLLvf+IdJc\/sOyCnM4L4c3m\nBMGY5oblLG\/LgodR6GMTeCf8c7SGfIKmwA9R7f8BijlbIHF9l2+3KZ79JTf0aW8qxvqU0P1UAG1L\nFjTXUqGv5WO0KgkDFbHol0ejPf8kWjK5UAs4qEz3QVmKOwpS2MhJYUEWzwqyC25uqGjbbF+64XkX\nD8ZHFPQaJW5XHMC1Qk9cluzDJZErFFmuKBOyUSpgoyRzL4rT96IojQV5BgtK8roqYy\/kyWxDzoXd\nzNZDzJQ7zD2Uauc6QmEcVsA40YSnv8gwTh3BSCMXg3V+0Kg46Lvqi66Kg7ir8EFbqRdaC\/ejOc8D\njVI31JEfoMpkQ8lnIT9uj1Zy2om5Wrg0Wpa32BcJo4aPxUcNWBi\/hse3vlsH0BVXyIheSnaBhLeT\nYmb0nlQ6mgeSYdJcxNKjeiyO1+H5g1xM\/nhszUC1YB+uZrjicuoeFMbtgjDCmbdxoP6ycrk\/FObR\nIixNqLE4psLTrrh1AVUCN1Rl7kMln42yhN0QRjobNg6cKDNYgEsjBTCNV8Gou4rptuD1jaDQnQDd\nUZm2jwZmR+9AaviXG9sw0OVgFZgL05gSxtEKTN8KWBewJssD1aTIK0kdtQBlvH\/jh1NfOjIDHJbB\npLsE40g5pq5zMS5lYSjRCZokJwxU+74l0BMqoSeupHvYAajNhmm0DAv3CzEZ9zXGLv4TQxe\/QP\/J\nT9Gb7PRWwFrRfqiyvHAlw9MOwCERFkdKMN+ciemcHZi5tQv65u3Qyr9A58mP0S12eQugJ9Qib1wV\neNFAacwOpJz46h1mgH1pWGz8AfM1iXh2k\/UKOFrviN6ET3A3+u+4l8t+8xQTYA1p06qE3jRQfHbH\nxjsbGtgehBeVUTDfTIJZl4a5TvZrwIeKz9Ae+yFuHNuClsjPcLvY0+YU10h8US08wBxwRX+ZWu4K\nxnLZ91jR8Qkw5TfAwarPcf\/Sx2gXbCVt1WaouZvRKmP\/Fij2Qm32IVRnHWQYaCnU16Kx3BNPCnaC\nTWBX8Z9x4+xmqA69h+uJX1sF1kk5UIkOMQ9carsAM8WDeSTOJvBe\/uoI1gZ8YHWK68TeqJP5Qy3m\n0EDBGWctY0BT33mYFKdgHj5vE3gndSsauO\/jx1Rn60CJD+pzuKgW+a4CI7ZTzAHvR8NY8T1MPZE2\nga3hW9AU\/Bebu3gVeOTVGmQW2H8WxsYoLNSHWQX2SP9K7+K29J02gfXZpMHNO\/ZqDTIGfNEfToCR\nWGiLwfPSABgffAujNgbmiTTMtB+mgZYy0xr20RvrYL3UFw35AWQNHoI8fhczQExW8F5ookk\/GIUl\nvQDLU7lYnpHhxeMsGmgeTcTTe8dJQCJlRvjNG4GNeYfRmB9IgH4ovsgwcOnhGSzPJsD0OI501fEw\njiWS7iaZBi4NxcLwUwg0ar83ApvyjqCx4DjUEn97ACP+C7yAeV0UZgdOYbo\/BE9IEZ+6F0KaWLI2\nu8PxoMbPNjD\/KJoKg6HO5q4Cz2znMzfFvSesAic7AzDe5o+RFh8MNrhjqN4N7Qrrf3VNBcfQVBSC\nGulhGshQy1\/JojNJz3dvBdSo9qCj3MMGMBDXi0NRKz2C\/FimgC9DU08Y2b0RWBiK+l3gXYWXVeD1\nwkBQJWHk3+SoHYDdIZjvCMHsnWCSSQKhL3HHmNwNEze50LX6YZj6X6D1NUgVBqG5NBx1OQHMAelc\nPCwzmLq\/JcBgzN4OojPJRJknBs85rimTUEXBaJafoAu1lPcNMk47M3PCYNYpeMa+mNeAltA0WuG9\nJmBLaRi9i+WJLhBHMxTcXx59zA\/kdS6OKLAwWLDuVHdDHk7yiAdyY\/cYxNHODJ\/PDJY7PBtRd5pm\ntTBNd64dKCahnWSRwkTXTsYPj35FShye9Er5+vYkg\/7nc5jqEf0ukMr1QK1kPyozvAwlyR555Qnu\n9jlAf+209a7EQXc7PXTwZgqlaU6gehvOa7trItBRdQI\/V4ShVRFMCnKQti4vgFJJD1NKISe0XLI+\n2H8Aj33AVfHBVVEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cheezy_sauce-1334210981.swf",
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
	"sauce"
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

log.info("cheezy_sauce.js LOADED");

// generated ok 2012-12-03 18:06:18 by martlume
