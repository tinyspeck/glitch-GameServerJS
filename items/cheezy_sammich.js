//#include include/food.js, include/takeable.js

var label = "Cheezy Sammich";
var version = "1348007845";
var name_single = "Cheezy Sammich";
var name_plural = "Cheezy Sammiches";
var article = "a";
var description = "An easy, pleasey, cheezy sammich.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 37;
var input_for = [];
var parent_classes = ["cheezy_sammich", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
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
		'position': {"x":-15,"y":-24,"w":29,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKXElEQVR42u2Y+VeTVxrH+Q8889vM\nqRJ2BC0Ri\/sSa8WKVak4aqVal1Jbl9bTOp224\/QwYhVUQMAVXGgVBWXRqsgSICEkZCEQQjAsIYSw\nQyChYOvMT9+5977kJSlYnbYz84vvOc\/hhPfNfT\/3+zzP994bD4+X18vr2VevIlpgq9gm6ivdLOp6\ntF7UdT9C1Cf7XPT0qU2kKPxG8H8DG9PsEzkUMTq7bDcGK7ajv3Qreh5Foev+Bti6xOhqyoXhVgSa\nry9BY+Z8NFwOhe787Lt1aX6i\/ypYd12ScLjyvUNjNQcwUv0BhmW7JgFaCiJgzl0FU\/YKNN9aibbC\nXTA\/eBctN5fD+N0iEkskptsrYluyl8Yary\/6bcCjPbLI4Q7xGWvJdh334nD0K\/+KMc1+BjhiSIa9\nPR\/91Z\/\/DDAcPZoTGFB9gb6yHbCZ89FrKoD1\/ka0572JtpyVaL0lYgobMxegPmNOZt25oBcrCbt2\n8zRbeXRsn3irQ523F9r8GDLwenQ83IIe1TFYNYkYqf8aI8oP0Fj8KXq0CQyi99EmBtgpjsGAPhk2\nxX4Mlr\/L1GX3HmxAx921HODtN3jAljsb0HhjJXQXQxx1qcGRvwjnqNoutEl36mwSkjbxO+gt\/jO6\nH77NAFvubUXD9x+g5fZaWKWHMaRPxLBiL2ySHdyzBKJHdgh2\/XHYFe9jqHInSb8rYCSs995yB7yx\nBAPGLFi151B7MRR154OhTfXdOTWccu9Oe9UeBzfwdtiqD6OzdBe6CzeikypYQGafu5pPT2vuWvTW\nJsKmOswBFm3CcFM6RlUfuQBy9UnvdZdsJ+VwH7aWHFiKdvGAj0mKDVdeg\/6SkANMCXCok7yF7rVW\nsz\/yB9WHbGC+8GX70VkUzQBp6lh6XADZ4N8uRNujGPQq\/44++WcYeZwER+0RDGu\/hE3zOQaVn6Ff\nfgh9soPokexDV9mHsJa8j8c3w9GaPTHGBOAsaNMCoUryyXQD\/EG9z+IKSNM2IN6GvuLNzwU0XA0j\n6Y9Gf1sBBjvuM1hL\/hrWKKac19FKurft\/ja0lx2Ctepv6FHGoqNo92TAdA6wNm0m1Mm+0Cb8YdqE\nrxHbeCHA8fppu7cZ5kd70C3\/EgO1x2DXHIZdTr4r34vB5kx0PNgyAZgTjvbCPTDdeweN3y0lMGEw\nF+1FT10qmrPfGAcMY4C6CxygJtkPykTPiVoc0x500Noh5jsBWEYASzajp3QHeio+Qp+SwKi\/xJAu\nHsP6BAzVfME9K32PlcRAeTSb1ID6CFOJAjrVtsq+QkflF6i\/TEw7IxT1F0Ogv7oAnap4GLNWsCzo\n0+dMAJ4hgKc9YzlbqTsgoIBPtAfhDOpzo\/pYjBniYa8ZV6dqNyt8m4QD6telwFD0FzKJLazbqQ+y\nji+NQVflp26AzlQ2Xp3HVpX6SyGsIfTfrYRZ\/IkL4OwJQKeCYzX7Y0c1+1iKqbfRNJNuZjZi05\/G\noOJj5mdUHdqRNO2sK0nqKRBNv\/X7dawEzLlvwir\/B\/PMqerVHZBTi0IywIxxwLNBDLAhx4vzRKKG\nhQG5qDNQFs2s4+fqULOlnkj9jK4Ylrw1DMR8ZxWDqb8cxtJL77kBZi1ly1zjNQo41w1QTepNl7HA\nDdBw0x\/mUj8HA6TrJa03pk7JFOpQDyTqGB+SlSNvK5c60iisAUgn0jWWAtRnvIbWkoPofLjpuYBO\nS6GAilPekJ\/yZbVJAQ1ZAQSOAIr9YSz0FnjIT\/tznUqcnhoySxcxZWoVTJ1cTh26+NOXtWQtYymj\nL2RpuzYfmrOzoLu2nJkxnRAPSFeMbO47HOB8d0CiVsWxGSiPm04UFKI5L5CDGwfsrJgT6SGOeyVT\ne34Os5BnqdN0fTGDoa5P64j6Fp2xJi0Y1ckBUKUGo6t0N78s8qvOLwDWngtGVYIXg6PReMeXgVkl\ns3hAU7F\/poe1bMlOaYIA8tN+ZO+2cJI61KPYoKTLaO3QNKhTAiFP9ANVX3spDF2PtnCl4QR08Uyq\n\/M8B68gYsgRvHq7i+HSYivwYWHfVHPbXUhYES3mQw+NJ0x6dTfkG5MkC9nDlCS+okgOhJMqwSPIn\nQdvej9WK7KQPi6pTflAkz0R\/ydbx9ZbbWHT+AmAD6VbVmUA+rc7QZ3kzqL7qeWgXczVolYZygB2V\nyyT25iP40ZIAQ3Yom005GYAOUvGNJyTHPSEl0NJ4L1TGe6MywYd9Lj82ndwTsE7nAadYdVqylkOX\nHorqpAA3KGfornujozwIDt3rxD9D+BpsyA6EId8n1mOk+aiks4q4vXQRxqxpsBs+JLtgYgNXA1Gd\nJhgPLxLeqEr2nPQC2UnSgdcWk5VhIfRX5hPLCENd+lwoEgOY0lNB0VBdFKC10J9sahfix8cRDNAJ\n1\/LAD5J4X5R+\/UeRh61hP3\/DWjEL3apI\/NR1Ef80H8DTprfwg34VhrRL2UCWMrLbuObFqRz3n4cs\naQb7fntJENntLGFg9B1jhtV8amk05vlAHOeJwiN\/Eni0FfsfartHLKRwJp7o1mBItZQ91ClfhUHD\nJ3jam4l\/dSeygZyDDVSTrs4JhiLF87mhPCtAw80AtJe+yiZKlXKOQz\/3yl\/jxemVzeUBS496OvjN\nQmt+lK6f7KKN+YHokoa4zYZ1lnw5RvQRPKRrUBWGa8Nh070zKeyGHRhrjmHZGDNu4YFozbmO3ycP\nY+I4alawz7RpiuNmTOwJTXejMtsKNmFQuhttD4jN3PV1G4AfiHQZVWDEEIVRcxyedN\/AiDkJQ8av\nWPRqt7EScQ2aCb7wc3xYmpWps8nR4U2yIY4iW7VoWEoWMpuxq5ez5+QpApQcddluteevE5ryNsKU\nvxED0j1wKD+CuWA92fm+jqbcMLQVz5wS+EWCQmkyvIiN+aDh22XoK9+Bpw2HWfSI30V95nJUnPRH\nVYovar\/1hfK8F0qPCSSTziSmvKi7rXlvs1OWqSAKg7IYfiAaQyqyeZXOxU\/6tbApF08CoQo4YZz1\npz73Kptkd\/FWfpyByt3kHWuhOjcX0tMzITkVyADL4\/1QdsIX4mNejuK4V4STAI35awWteZEOCth8\newOactaReAvme+S0Jt7BlO2rJKmtC2cF7QpHvUx6cgZqLoSy1FGgUe3HGNEcIBN9H+3fR6ExaxWU\nBKrqzGxUJc1CZWKQG2AFBTzu4yg9Ov3Zh\/mWnHVC4+0NluY7E4DGWxFEhTXk7LoajUQNZwNRtarT\n\/FCdGgL1+TBoLy9GTfoiaC4thPriAqgvzIOK\/F95di55LhSKVCGprZBnApaf8CXKeQufe3Ane7tp\nTXfWZ04F2HA9nLcButJoMxYTQ1+G2ivLfjWglABKEvwzxa6HpBe5CJjocXaExJg9GZCarSJ5Ntli\niX41oPRUsEVyMvBMeaL3b\/sVzHBjtdBwI\/xQY9ZKnVUSxQNWk5e9KKA8dY5OniKUyJJfPSNLnimq\nSAoQ\/v6\/BWqiHKOmE2SHEUI6NiC2mryo7toyUV0GjUUiDY0LNObxoU33mfY\/+02wvSJAaBb7xdKl\n8eVPty+v3\/H6N99B4lbogJDSAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cheezy_sammich-1334340286.swf",
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

log.info("cheezy_sammich.js LOADED");

// generated ok 2012-09-18 15:37:25 by martlume
