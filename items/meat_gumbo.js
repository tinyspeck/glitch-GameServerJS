//#include include/food.js, include/takeable.js

var label = "Meat Gumbo";
var version = "1354595129";
var name_single = "Meat Gumbo";
var name_plural = "Meat Gumbos";
var article = "a";
var description = "A bowl of thick, meaty gumbo.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 225;
var input_for = [];
var parent_classes = ["meat_gumbo", "food", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
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
		'position': {"x":-18,"y":-19,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIA0lEQVR42u2YaVBUVxqG\/ZepSrBZ\nRBBRwqLGGGWRRkTHoECIOAaiIKhBDBoVUDHRIMjSKKAYAi0giwg2EhYVDCoQF5AWd9ESrLiAlIK4\nL4i7P9\/5vjP2lRYncUYqlR+cqrcudW\/3Oc\/99qZPn97Vu3pX7\/p7rZcvX37OevHiRejz588V7yrN\n9wDIegyGN+NNnz17prxx44b6\/Pnznfv370d5eTlKS0uRm5sLlUqFwoz1yPL9FAlzXVGYn4cdO3ag\nrKxMfG737t3Yu3cvjh07hhMnTqClpQXXrl1TE7SK5En7m\/1fYAzV1taGyspKFBQUIDU1Fenp6cjM\nzER2djZycnIEYP7mLFR9O1SowGcw1swc1w2woqICVVVV2LdvHw4cOICamhrU1dXh7NmzaG9vB4GW\nvzMou+7BgwettbW1yMrKQnJyMpRKpQSYGr0C6xbNRuQXtlhq3R9R8n4SIGutiz7mD+2LeUNkmGcl\nwxIHS0R4TcL6kECUrZqF31ZOEaouzhaQR44cAXkGd+\/eZVDVfw0BfgOymrq+vh5pibEoCJ6EvGmm\nCHcZiPgQf6yZOgYrR8oQ+mlfLB3eF4tJy+jveId+2O5jjm0sb3MkOxsjeJguFgyVIZAA51rKEECa\nYyHDL95mWi9TnBSNQ4cOSe5n0CdPnnRyWGnBEZg1qbOoqAjx8fEoW+io5bYQ2w+wbISOAGLA70kK\nG11snGiCTe5mSLAzQILcGKq5Hsid4w6FtQGiSVGjDFAR7IDGRHfsCXJA7DgT\/DLTSuxbOutjLBwh\nw+yhxkgIDhSAbBx2+\/3790E8AVK8kWkb9uzZg9WrVwvArm\/JCnf6CD9Yf0iHyhBvp4ftvsPQlu2J\njhI\/oa3eVsjzd0ONMhb58z0RJzeRAPeE2KD6RwccTfBAZVIMSsJ9kOxlgagxH2K+lT4iJpjhYNRE\nXN2+FOfVxThz5gwaGxvx6NEjCEtyCbh16xYUCoUAjFno3w1wk6cJQu3+gRQHfWSQC2+ppguwlszJ\nqFpijQ3OA1DwnSdKV8xFtq8zEhwGIGmcEX5yMkKikzEiRvZDup8b9qUmIDvwa6z9Uk5e6Idlww0R\nN2EQfle6oGmjOyqj3FBVuk1Y8cqVK2zFVnav+tKlSwJw1eIF2ODnjMNRFMjzhkuApbMtEGL3AWLt\ndfCzXB+Xt61AS0kotniZYa2dvnBxnK0B1tgYIJaU6TpQ6wUZMvkrJxQun4+N33ggeuwQARhGYRJJ\nlvxhlC4llAF8Buti5icDUbv3N1y8eJGTBhJgdHgY1nk6QJ2bjIrlM\/Cr\/0jsmm0pHRI5TgdJcj0B\nuCssABVRC7DJy\/6tgOmuxijxHSy0dboJYkbrY+VnBDSiH1aQlhNc+Oi+4rkURrbG5HIDTCNIRYCv\ncLMA5BrU0dGBVf+0QAoduDMiEL8ucEeOyyCkO+ohbYweNozRh5Lcyy5mwJKFU\/F7RTG2L\/ZG5lTb\nboAKGz3EyHWEIq31hIu1AEcY4GdXXS0rR8sHIHioIWaZ62GGmd5rC967d49bFvamrkbEKB2kuVoi\n38Mc1UE2uJj0BdSh9tjsZqIFyBbcFf4tCud5IIMAU5z6Y9sMMxT6mCLOSYeyWF9KklUE9ybgKrkh\nyr6zxf4Qey0LMqC\/hT58CfBVJrf2oSpvff36dXTcuYUN0x2RIpdh6xQTXEh1E4lwU\/U1SmdSAab7\nUfYfIXq0DvJ8HFE0fwpyvB0pGQaheNrH0kE5XxlBQZbTACaON0VdxAQ0UKmpj5skAH+a6oQTWxKx\na+VspE0egjBrI4QMM5QsWJGbKax3586dUFFqqL+2Pnz4UNysTVqBzLF6yCfI0m+ssGWyiXDxTj8L\n7JpjhTXOFCMEud5eH4kUW2nOJjgQNEoCzPMypucyCbCEYrk9z1PozNqJAjA3aBaKwoOR4uuOlXJL\nLPnEUAAusTFHTVG+4GCjXb169T\/t7+DBg8rTp0+DWpx4eOV4DXYu8tCKQU3CcEYnEAAD7pzz2euS\nk+aBzV+aIt1lgFahjrHrj6RJpkigIq1xcdRYK6yb4ohIp2FYSnAMmLd8EdovN6Gzs5PB0NzcXC51\nEmo1Zjxx0E1BTr4XoO3n6tGwU4WCWeOROcEQWc5GyCQlERwDFvpaifrFOhzp+DpJugC+LQY5i7nM\nbP0xCPWV5bjR0swtTtS+hoYGwUFTj3a7Izcrud3wQ27cDKkRw14j2LqMOJR974ctfuMlF2e4DcRG\nN1OsczD8Q8AYRwtk+P8LZXFhOLotHw8o5nlfbhLcg0+ePCl6MmdvU1OTutuwQPQysmInf+Dy5cvi\njRiOr48fP8bTp08lWI3aGuvRfLRGqIl1pAaXuujiK3W8gtGI3UgJIGodQ2nE1iO4Tin23lyHDx\/2\nVKvVWq5mQO6LnEQco5z+fOXayQfxM76y+DNvE8PcvHkTPF\/y3ixuDsePH5fgeFB49SzgD+dBTpiu\nrn4TkOqmdCBN2Twdo7W1VcQPT8sagD8TW0sDx+cxMFlP9U5DK81oqnPnzomN2GI9DdjVeny9cOHC\nu8O9CcnxyJA9Ccgl7b3gNIt+Q3iSK5oZ8vbt2z0CqEkMdivBNRCc53v9squurpbRpoW8OQO9DyB7\nhOF4KCU3q7hy9NhPUBoiP6dDGhiEa9f\/Asgxx25lq5FHGroV4Z5cdKA1SUlArQz3Z4CcradOnWol\nQCV\/9y\/9LwMfSPEZSnAKFgEq6J4kiq\/Qvxyqd\/Wu3vU3W\/8GO71HwOEvPFUAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/meat_gumbo-1334208912.swf",
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

log.info("meat_gumbo.js LOADED");

// generated ok 2012-12-03 20:25:29 by martlume
