//#include include/food.js, include/takeable.js

var label = "Sweet 'n' Sour Sauce";
var version = "1354586569";
var name_single = "Sweet 'n' Sour Sauce";
var name_plural = "Sweet 'n' Sour Sauces";
var article = "a";
var description = "Is it sweet? Is it sour? It's both! It's sweet 'n' sour sauce!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 63;
var input_for = [23,145];
var parent_classes = ["sweet_n_sour_sauce", "food", "takeable"];
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIYklEQVR42r3YaVBUVxYH8HyeL9FI\nkIbe6GZVWZoGmk2IyxiXsRgdAWUMiCgg+yI0INAwiFtGcQw6CCrGjU0FERDtphsEcddxAcElRBRw\nQRvIVM3H\/5z31E46SDITHnlVp7pkKX6ee885975PPvk\/n\/8Ey0SjwQr\/H4LdVR9iZJVC97EYXeVW\n+OFnmN\/5d5C70yeT+Yyucq+hP4SJBMF7ESD\/dFKAL1YqdPpVvx03uMIFbXOkmLQM9gUpdP1BChAU\nbwg6wv5hd7wNcsOrQDkG\/iLDs2XO6PV3xKOlDri5wBbtBNL6WqJSzsMhBxPstZ\/y+wCH3gNpf+F1\ngBzPljsTahbuL7LHjT\/asLDm2WI0eApwys0cx2XTJxf4lvbNM8JNFLjDho8c8R\/8J2cPxikKBzfM\nMwJS4YwLVPuIUOfBR5UrD2VOptjrbILtTlNqJm2JB\/e4+XVud8PdfSF4vDMID3LnomuTJ\/oyF+GR\ncgE6U+bjdsJcdER64nygFKcDRKhYKcDRFRYoC+ThYDAPB4J5CZOzxPvlnz7e4djbWTgHfc17ca8y\nB7VRfFSE0fKtoQg1xzEmQsxx9H0c+YpHX+ehnL5fvdYcZyP5KA8T6A+utuC+Hz7fLdfdUVnhWX0u\nXnaU4UlFIq5mWOJKuiVaU8RoThBCHS\/E+TgBmmIFuBAnfPc15jPZFpqUGWiMFhJSgMOrzXv3B0zl\nrhe+LvYo6yqww8MDQXjRVsLGrXyZAdiRZolLqWK0bRTjImFbkkTQJopYoCaB\/gOZrmjJUrDAhigB\nTq+zQPFKno6b6XHAI7T37w7oLvoSL1r3YZDiu6okXM+UsMCrm2yNgalStCSLDUAmgxdihWiKEeBc\njJiQljgbJUJ5qAX2rjBTTRg4XOJZcy9Pir7aNAxq\/4EB7W50FS1hgTfzXXA9T2YE7MhxQXuW80eB\njQQ8FytFQ4wEdRECFAfy9BMvjmJPPQN8eioZA5qd6Fd\/jVsqu3cZzLSiJZaMAV5U2o2bwXNxVmiI\ntSKgEGVU1XuWmU6sYF4WuYIBfl8dj\/7zW9FPyFt5Mw1L\/Gt70AgYa4mmeBs0xlmzwCOrzQlo4scN\nsDIazxv\/hv7mQtzZ4WUEvJI9Cx2ZdiywNVlkALYoZ6I1QwZdmuN7oAQXUhzRmGDHLfBBmh2eF8eh\nvzoXz87mfzSDbdFi6NaLoQmnVhNG+20NH9qNcrTleECTaMUCzyfaoYWau1rpRu1GxB3wUawDXu1K\nwNCxfLwoykPXn2W4s9QRNxbNxOUF9midZwO1nxT13mKcUlAzptF22NkU+2dNQ\/mfeIYlZoCtefOh\nyVAQUIzDf+WhaPkUESfA4W8jMNKeheHuHPRVz8WT47Nxl3rcDWrOVzea49JBB+iKZ+DcLivUqPio\nXjcVpb6f4cRiUwOwKd4aLaovcH6jM7UaMUpX8iZ+sjEAjxGwPhHDPUoMXluIp23zcD9fglvpfKpm\nATq+dTIAz6SY4VTIFBxQTDUCMkWiTqUWlO1LWfTCoa9EEwcOl3rqulPsoa+MwHBdDPTXkg3Azq9t\nWOC1PLERsC5i2jhACdRpLmjO9IQ63YObDDJApkiGDqzDcE0Ehs5FG4BdhXZjgVtoUqz9bFygRumK\nC2ly6oU23ALflEdhuCkSrytC0d\/kywIflDq+AxZIfgSmmrPAk6FTUOL9sz0YR4fYdDeqYlfUb5Dg\nn4FmvZwBXx8OwcjNRLw6EYyn+2YaAa8X2v4I3PA5C6xINEGJz0eAVMHqdHe2zRStMNNxBnxVGojR\nJ2l4VRmEXspYb50XustdjYDa7VI0RZrgTOznOJEx\/SNAK2hp\/2ko6tbzOQYWLcPo42QMtYezwMf7\nHdBT7W4MzOCzQKbNnEg1NexBTZINtEpn6oO20GX5oHmTN7fAbqU9XubMhf5qOPTdMfh+pw16qDB+\nCmT6oDbGlN2DNZuFbB80AGmSMOdB9UZH6LJnU5vxQS2dCTkBjpR6qZ5kOeBFxhd4c3Qx3txbh76j\nLizQ0AdzRGinf7PA7RLUbrIwqmJ1goTNoCbViRq1H7Q5vqgO4+g8yAB7tthhIHsRhioWYbB0HrvE\nLDBL+A5Ik6QtwQzauOlsm2H64MkwqmKZ8R5UM8DcOdDRNOEemLUA+vshGNjrMz6QySBVMVskynez\n2ACkaM5wY2exjg4MnAIfbrPHwKb5eKvzx8A3il8EMkVSF2UyBqimQmkrWIj2bUvRQsiqNRwBR0u9\n\/Jk7SV+4L14f9Eb\/btmvApk+WBkzzTiDtMTaTAUu5i9AK8XxEKZIpk\/8DcMPJZ5+DLAnXoancb7o\nUzn9T0Bmkvwc2Kx0YbPYunkhC9wXYObHGfBOnjV6UrzxcLUHHqxyxL3gGbgVYIsry63R5k8TYgnd\n2L4UoGaeOar8puOot8lYYLoc7VuW4GLBYu6AzDPwjVx\/J1eKuwVOdGGywe0kazoHWuMqja7LMVK0\n01y9GDn2RF1PiIZ1\/J8AXdG+dQk76g4Gm9NhlSfiBPhmv4eKubj\/K0eKK3TM71BSz6N7hyaRNj9d\njBpjRWggbGO8Fd3aLNEQLaDDACHpk4F9ALbk+LBLfHq9kLuL+4f3MgN73G73n1Hiu\/ptaKSRdSZK\ngNpIPmooTkcKoMtwxrXNXuy1c7xbXWuuHxqTHHFotYW+OMiU2\/czDLK\/eI5u5HIJBtsOGQMj+HTW\nE+BSpj3alLZjgI2UzdoIC5xNmIkjIYLeSXl59OF5ukse2lkwq\/dythO6jmwwAE\/R8D9J+6063IKN\nqrUWqKSoCGM+BagIF+qPrxGqqrh8afRLT882mVPnVkfV9Wz7wlalra4l1UavTaHbXRLtw3ipvi7G\nUlcbJSk7Ey1RnY4U\/+Z+91+xFwwA82RTSgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/sweet_n_sour_sauce-1334213816.swf",
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

log.info("sweet_n_sour_sauce.js LOADED");

// generated ok 2012-12-03 18:02:49 by martlume
