//#include include/food.js, include/takeable.js

var label = "Green";
var version = "1354649229";
var name_single = "Green";
var name_plural = "Green";
var article = "a";
var description = "So fundamental, so intrinsic to the basic laws of culinary science and a healthy spleen that there was only ever one word needed to describe it: Green. So, so green.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 48;
var input_for = [30,333,346];
var parent_classes = ["green", "food", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHHElEQVR42tWY2VNTdxTH\/Q+cPvZF\nJMgSspCVbGSDhB2iKCiiBgxF9h0SxBiCLLJrkVURUSqjtsUOw9StxHZ0HKcPdjpjO9OH9qGPnY79\nD05\/5xfuNQmJyYX6UGa+c5Nw7z2fe87vLL+7b9\/\/+e9rr974\/ZQFwunFVSu8\/DwbXk1nv\/tpIc\/H\n6OcbBb63S4Wc9Gwsy3epSmznDHi7R2MkAMBFPxD4R5fNsDFghHWvHu5fzKC626uFFaeG1XxbOqvR\nGilUZvPWOQPecWpaQo1vjWdRfTtsgi89eqq1Czq406PdoesdKgowWSeDsXNSGKgSg9cugvMnBTtU\nbj7o4w7o0noYoFiE0JtDfj3sN7APEE53e3XUk9NNCuitQMC4d5wBhxwSOz71btVfKabGI8l5IhVa\nj6ZAZQ4Pyky7AOwpTzGiIQwPhmkvGnSkUXnOiMB9SgjNR5KhvjiRwh03xVHAUssn+zkB3nNnrGO4\nMHSBoXw8YmZDuVuRCkHXKQPohzzALZNxrXDN4lj0fDILvjivhSHiUQZuG9DDtQ5+FEASGeo9DPGe\nADEUzE03Z6Nr61p0OMxupgxhkiBYRdZBzGLuIQ4ErJ3NhJJxwwd1+qoJqqbNrPCa\/tksViOLVrjR\nl8ECDpxNgxaSLPZsHoWtKzpk3DUgGmyeLYV\/Xt+NqN+ez8OLR2OsVh84YWGtlerSTQe9x+Il\/fti\n7tLQIt14OGm7YPNbYoa775TvZwAxdLEAfkgIjPcI9OBXfXoKht7zA6Z6OPVhBhDXF4YQvbBXwMBW\n+N1YZkjL2yMghirU8C8bMzDS6YALdSfpEfXs5kBMgNjbdw244tTaogGuT1+AhLiDIM0RQkaNErSV\nclCdlILKJIbX98Y\/LiAOCpEA0Th6zKCVgdGlgtwpI9iWrHBkJQeKFi2QO26EdIMYWs6UwJ9bSxEB\nn43uJcQu7TID+HDuPSCGFL2mOi6FvAkTFM5nQdagjkLmEwD8TL+PGUFWKKKQgYDzreks4BPSMgMB\ne8oFPg4e1Piw5yLgncVsahSNoEFTt5p6C3V4OZuFYjWkgwJSA3MnTfRhEPDxxgAFnCOlJRJgZ63E\nxyFJtG9wMAgFRIMYTgRDwOLrFrBczoBs4uGcCQM9MqDWUT3IS\/xeXLnXRQFnA8oMA+giQ2xzrwrs\nbhUHD5IbhALenG8HqSQVzG5NkMcwtMwaRHAMN8LlXzPTB1CdloJOL6GAYy51EGBHkwxq+tRgqRFC\ncmH8HzEDto8awEMMMkKQZEECqO0yFoKBQzAExM\/oQYQLDTt6vsKjoy3v8pxfIzesUO5SgOBwAiQX\n8ahiBpTXiNibN24nAhqxDutZOJShS0XB0Fv4XdegAH2bMixgIUmQgotqVjlOBQvGKD4\/Pi4qXFGd\n1BgIiE0fj2n8FFCdkbAQKoeEGpbkCyCjSwlp1lQ4dCie\/qapldNz8FyRgVwnEYFtOAO0HXJWksrU\nHYBKMsVHBZR+JqKAZq9\/rVVtlw\/sEI5jeVCWZ6ZHgT4JRFY+BZKVCekRxVcnQrI4gf3eUGGDrVuD\nYOrTfBAQ12FVvcgWFVBSLbIhoKZNFgQY2r6wrSWl8ihEelUaPSKYOIcPhWYdLeiBCgVUnBOxcKaz\nArDbBTgTLkcFlNUIPQiI0nUpIgL+\/mQRRMlJFBLLiSiTDwqykxMLk6nHogEq68QsXGu3kg6uMe3u\nGqdNnsbPTcBqO0kYsL9e3oa3G9eoUQyfQJ3kX2fVUpAeEdLfQuFQRSPBa1DbKQdbu4zCdZXx2dE\/\npj7MdBGUe84P+PerVfh1cybIaHd1GfWetEBAz0lVJcGMuz4sIP4\/sHShWshvOA92lKbEDkhGrSmm\nSKNayQBwYiIXfnwwscMoAkptQpAdE4KRlA7M4nBwqAKyfe32aqGvVUE7yjfTFijPjmcnagxxjB7U\n+AIBmWk6nNGqklwQZiaDvEIEshNCSOTzInqwetIGnc50+s6GGbeYTROGuLYokTsgbhEREG8ezmhf\n4ymasYFaHmqLCIgexIlmpkXJAqJwV8fJgwjH7P4R8OiIFYbmHEFaXmqHtVtOVo9WvRHDywDWkzV3\ntVEBk\/XyIMBAxQT4lAyTTFPvm86EnismaCZtrom0OVyT2F0Ct5io0ongbWhxmJ6MgEOkAyHg5qBx\nBxwpM2+iAuL7vkjv\/DA8aMB5QkDlbpKz8jhV0N+vCyuvVwfui2Sb2amE4Wo\/IEYojAd9MY1a\/5Vu\nbb9NvdIgp1CBWj2vhe7jfG6ANRbe\/uVuNScIPB8NThHhC8nA17tT9TvBGGE2r\/VqaYIwgKWmA1NR\nATtIyi9sGwgHtNSlZrXQHhlipEYK7tMi6CxLhQZbEtQVB6ubFOino2b6WpgBLMn8NPq4VVeUOIU3\n7D0lhAFHWszqrxLTa9pL+WGBwslVLiBeJANJLi\/soPAvi7p04lySZcEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/green-1353117352.swf",
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

log.info("green.js LOADED");

// generated ok 2012-12-04 11:27:09 by martlume
