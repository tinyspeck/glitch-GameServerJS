//#include include/food.js, include/takeable.js

var label = "Tangy Sauce";
var version = "1354587426";
var name_single = "Tangy Sauce";
var name_plural = "Tangy Sauces";
var article = "a";
var description = "A large jar of gloppy tangy sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 154;
var input_for = [37,230];
var parent_classes = ["tangy_sauce", "food", "takeable"];
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
	if (pc && !(pc.skills_has("saucery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/68\/\" glitch=\"skill|saucery_2\">Saucery II<\/a>."]);
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH3klEQVR42r3YaVNTZxsHcL8BH6Ez\nfVlbZbMqWBYFbHFJEJCwiAiCARFUFBSRsMqSlSXIElkEhEAIe0IMGBAQEARRREBZlEcU4TFUEYiJ\n+T8nqQMy9tEKh56Z\/+RFkpnf3Nc5576ue9Om77zM7PGDmQMoZlQwzA79FXNHrcLc6bM4E3HRfYJr\nRiN+o4sbKLtcsHXTRl5mFFSaUwBzKhEHIoeIOH6KExHnTzlMxOVTaERcP8UNMHPTjps4w2BDgEY7\n\/6vYbreEHfbqFeChfwbc6fgBOx2I\/\/7xJzZsBTdvfqbYvOUFfjZ+jV+2K7HFfB7GNh9gvFeLbft1\n+Yhf92mIqGG6dwmmtu9hYjEHk12zMDWbhunOKWzbPvnvArdaqbDVRgtDm48w3KOG0W4VjKwXYWz1\nHsaWb2Hym\/LfAf7446jBTz+NYr3ALYZjMDTspGwIMj6AH3zMpQVbt\/0HRmazMLF6C+M9SzD5XQsj\nG80qoIn1O5haKbHNchrbLF7A1HwMrpRGnPW8xt2wEv851Bj8UBgOeR4LRZxcFCalQchKQ3ryXfCT\nu4h0gp\/UgbT4FnAjapB6MQN5kdEQREQi+5wXUvytwfHfvTHA+bHWrW\/v5irftqdibqQZvfXZqIo7\njPyw\/cgIsgX\/lA3SAvcgNWA3eASES7cC288SLF8L4rvdyA2xg4ixDwVh9sg4ZWtJKg5vegzmB6rH\n5xVxWBiSYGHiDpS9pZisCsW4KAQjpcEYLApEfz4d9wS+6Mr0Rlu6J5p57mhk0SBNckJtnAMqow+g\n7LI9rp62VWb5mZD3Lvww0Zq31JaMhd4CLE20Y2GsFa9kMWsAHtQDiy\/sRQr9NwU5qzfzwFLTmw1V\nD5GJNiyO38bb\/nK8rLv43cCqGArKGQdwI\/wPCM5Yg+m9g7F+4PT9yo8dTKiH66Aab8HiqALKdv7a\ngLFUiKIOojRiPwrO24B9fKdy\/cCpHqUO+GGoGioCt\/i0EbM3o9YMrIimQnj5AApCbYgymyPGw2h9\nDQSeKaAHPq6CisAtjMgw23B57cAYBwgjD+J6qC3SA3bhyhEjS3KAg2IsEbiFYSmaCwrhd0YJV\/p7\nOPm8A8VzDrzIim8Cq4mIYx1RxqBuAPBROZaGJZjqa0EKpxfZ6a2IiX2ISEY\/LkX04eTpQQhis74B\nPITKOCeURzngehjZwIEyLD2uRePN50hKHgTnUhuE\/AoIBVW4dKoJzl5TcPd5AmFi\/P8HxhPA+MMQ\nxTgSQDuk+psjzs3oh3UDn8vyMdtTh8H2HrQ0jSDpcj8+dtKh7qBjRuCM10JXhJztRnJcI0KDpF+5\nB4kk0CCKddYDuX5m6+9sdEBJcRMapQPoaH6IG+VzmKkLBQaD9MDpq46YSKWgJCwCFPdJhIe1ICq4\nEJcC8uFAvYXzvjmrHpLqRFdUEFtkYdhecoDaV\/cVOiA3W4usQg2EhVPQFrpCey8AqqbjUHf761ew\nN8oONo4z8Pbrh39AB3z92uF1rBXRIfnLwJp4J9QkuUMcT0PhBRKBww354F97D36+BuLrY9BWekJd\nc1S\/gi9TqZhX+OhXVAe0OPAKO\/a+gLH1c\/xsPrEKWJtwGDXJHqi84kou8FaJHGLRCFIEGlwTzELb\n4I0PFUewJPPGnMgDgxG2eFLo\/Y+AtcwjqExwJ4C\/g+mzY5wUYP31dpTcGAEnSwPWVQ0eVzGhyqfh\nXbEbPt4\/iScJ9sj0j\/4CaHewH36eFSvARBfUsY6iKtFD\/5ohgArSgAX5I2BmaJCYrsbJsDk84YXg\nDZuqL21nQRwc3Ca\/AOruwX328mVgXSINdWwvVCd7EnvxHvKAHeUSSCtuY\/iOGPEpanifUcHz1CIi\nT3cjIrxPv5PYu75ZBlJpg38PTKKhnuONGqYXucBhSTmedWQCo4kY7yqCIKMNVxIGVu0kYRd6cTak\nG0HBXZhqi0DkBYke6ESt\/QzoCgn3OGpYx5B3bjc5QEz3M4bkUgy15OHlvRzk5o7qgeKCGn1553tD\n8bCBg34JB\/fr2eitZemBmcxSPfCMV\/YysD7ZDVKeL2rZPn\/1g2QCJeUKsNNnEZ6wUmIdcEDG\/aLE\nORzh8gquAjLdIU05gTrOcfKB+bkPCJwGoXErwNedkX8L\/PwhWQ30QEMqHfVcv08d9XYuKUBNXy4a\nRDICp0FI9Arw0U3udwElLA\/I0vxRzzuBnNNktfyvHlDUj8ogLm4hcBqcjlwP8Ahk6SchSaEjM8iK\nJCAxNOmAotwuJLOfIzBcjTTePaK8jFUPSdFVsb7d+iqQ7Ymb\/EBI006SD1S1JqKlpAoZafdx\/vJL\nRESNQpRXre8HS7Ir9UBdN\/M1oJQAyq8GoSE9kDygfi4ebVKqWhOgG9znGqPQXZaN9jIBivm16BHz\n0CXioKOMjbYSJm4XJ2OImFcK2XwwwzKREXpxBcg5CnlmsP41kxZgAbb3r+ScuKonuxmLXRnLwLUO\nTbIUH8gyAlF0cR94ZA3uy0cfI0197\/uK8e5uzpqB8nQ6KohekB9ko0w9sYvc82qM9hjMDTYp5p+2\nYn6gek1AURwN2efsx1MDrTfuMH2mX8qY6ixVvriVhtk7174JlBNA3RxSzKAhL\/xQXlaYjcGmjb7e\n9MgNnt0pDX7aXKB4JMtRPKhL6estJ6a5Gwy0FYSjOecc5PwgZT2Prqhg+SqEVzy5RZfc1jS9\/Q+6\nJU5+ep8kwQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tangy_sauce-1334213830.swf",
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

log.info("tangy_sauce.js LOADED");

// generated ok 2012-12-03 18:17:06 by martlume
