//#include include/food.js, include/takeable.js

var label = "Tomato";
var version = "1354597897";
var name_single = "Tomato";
var name_plural = "Tomatoes";
var article = "a";
var description = "A ripe, heirloom-quality tomato.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 5;
var input_for = [9,16,26,99,329,335];
var parent_classes = ["tomato", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_tomato"	// defined by crop_base (overridden by tomato)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/284\/\" glitch=\"item|seed_tomato\">Tomato Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-23,"w":24,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH+0lEQVR42u2YfVBVdRrHf\/f93Hu5\n3Fcu94JGiCm6S9Rum+22KzWl00xTOKPWoCCx4AskCqQrRHoXjQ01RdDJhcXQoIbEgtR8SdcbmIpC\nIoq9qHWr3WlzthV3t90Z95\/vPs+55wg6Ktho4zT+Zr7D4ZwD58P3+zzP+V2EuL1urx\/hmpAlUh5d\nJOy3JNy0OhE3ZYUWj80Smbck4PR6feXkCi1u2XjT642hScvEDwc4\/eWoK0aVscbfUtjoCRY2RgWz\n1\/mCGWtI1VGVaXVaTFoqkF3ubSnIcQbnptuDBZNsLaUJxtSb40iFNzltmTuYXukNzKjyBRgsr8yL\nhUUeFC90I7DYhecKPSgipa914en1AqkBgZzFHpSmRmLpLyxY6dajwqxDmUnTV2rQVi4SIvmGQlaP\nMw9bM9keqprqwK5ECz7wS9jvk\/C+z4Sdd0goX+DGzPV+ZFRF46kVbjxJcI+X+JFVEY251T7M3+RF\n7nw38lNt+N0YE4oSTch7wBK4IXAH\/FJcR4yprzNGQhcr1oxO0mHSoRgzluc68XyzB4HWaFRkONAc\na8Jr8RIWpzkwo8qPwjkuLLvfgpIJESh8xIK5D0nIfcSM2Y9ZkJNq60tf7cuats4fx7puuMNeQzJB\nhboJ5kScFb3xtrASItEzIhJtyZEyRPYr0djwlB17\/Wbs9JrQ6jZis8uAjT4jigiQnSydGIGVFh3K\nJS1eMGmxwKTBPIMGswyi9udCGL4XHIH1HR9uwcfxETidYMNnY5z4fKwLn5FOkVbmeWXAsvleHBlp\nR\/swK\/bGWrEjWsLbBNnkNOA1hwHF2Q4UNniRRzGXxRioFrUoNmpQQMrTa\/BbgyigR2qGDNflFPYP\nY0zdJ8m1UwT2eaITX\/7Ejb\/8NCw+PvCAExmropH\/og+ddzvRPdqJQyPseJ8g34uxYrvPLLvYSIAb\n7HosmWiT\/5j0YgdK7zTgBaMWReTgs6SZOs35dIv42ZABO2NNleycDDfGhb8S1MlfuvHFfR5sSfOi\nZqYX08vdWDUnCl33u\/AR3dNDf0TXKCcOxEfKLu70W9DqNeMNcrHebsAfbXqUJ0mYM9mMtKUO5D9u\nQwE3i1ePWToNntFrDk6MFtZB4Y5SU3DNcazsHMOdvS8W5x5ORN\/4u3DuXi\/+kezB2bs98rUQuclx\n9ya6ZBc7RjqwjwB3xViw1WdBE0W9kQBrI\/VYG6HHy0odBjhmcm8eRTybALNI6ZJ4aHD3\/KbKHnZv\npE2O8m9Jbpx7Yhz+NeU3+O+U8fjuwXicv8eDbwmQr\/E9ZwjwJLl4jACP3OVE2x0RFLMF2wiw2SvJ\ndfgnAlxHgKsI8A\/mMGAJARYS2GyuQ\/qaadDWDQp4xC+FuGNPj7LjK3YvyYN\/Tg7D\/W\/qeFwYNwzf\n3ROFc+wiXeN7uGk+UgEp5nYFcDsBvkW12OA0XgL4Eg3t3yuARQQ2RydkQIq595odzTOP5x2PkjOj\nHRcB+yYk4T8EeGH8SFy4Nwr\/vk7A192mIQFyzNesw3aflHKEAE8Q4KlEB76g+L6mGP9OcXKsDMbi\nYz7H1\/ie00rEXIOHKeKg3MnhiLdEE6BHkgHXXi3iAYBTndfYR7b79Ckd1CA9d9rwCQGGxobHytlf\njcC3DybIrrEY7puk8DW+51OlSY5eoUmaCbDBLV2xSRapgFohww0KuM+jTzlIr6+jcRE4OcohOxNS\n5h+79Y2ir1U4xT15zIwOj5n9cbb+MUOAbxLgJpdJHjPVETr5bfIiAS42hgELCGrW9QDup9dVJwH2\n0AzkB8uQY8MwXyriYz6nwp2gcaS6p8ar1l8TzUIe1OsJcI1Vh+VUf0v5dUeAC6l75xFcTj\/g+Sc9\nwnZVwD1Evy\/ahEPDI9BFkMfJRa4tjpBhziji40+VumM4ufYIro1+TnXvHSVerr\/aKzTI8+TeAgKc\ny4CKezysB30v7\/aaQm2xFhmSnTxGkAzROyYMxOpVwDjWowrcfurcPxPc7gHuvUnu1TsMl8TL9bdE\nGdJcf7na\/gZ5RidqB52DOzyGyj30y9soqgPDreggyA8Jkl06pqhbAeukmutIsJNzVhlOjbaFtHlA\nc7B7lRRvxWXxzr+s\/jL04teDAr7rEHHbo4zYQw8L0kN5h\/IBARyk4u+g9yzrEOkgqZ1c5nv2Kl3L\ncK1KtG9QtHWR4dqrsva7p46XIgJ8dkC8pK+mCqEb0mahxWWo3OYxYjc1DD+cxwaD8E6FFVTO7VVc\n45rbNsA5huPGUKNVa+9a7s3QiaeHvJvZTM2yxWkM8cbzXXrgLgLg2npPER\/zuR3+sGvvXKw5CY30\n1lDheO6tVjpXHS3Fint5un73MnVi23VvWJscIrnJqe9rdhnxFoG2RknYSrDs1FYF6m36fgtBNXlM\naHSFdy0cqwrHdbdiQLRq5+aze2q0WnF8mhDO7\/V5pIEgGx36Pt7TNV0mPvc6qYG6lMHYtVql5jjW\n1QPgeKyUqnNP2b1kK84Nue6utuokEbfRrg9ucoS376xNCtSrBLUhsh+Mu5WHMddchRLrRThl75dL\nygk7V3ZDP3rW2HSZNZG6UK0CVGMLR\/mKEid36mqlW7khlqnzjlREnz3yCTCX604jgllCpNyUD\/E1\nQtjXWXWZ1VZ9N8d4CRTHyZ1KO5UlBFfCmwECe87AHSv68rSifubNArvaWiGJlOWSLvMlSRugWguQ\na4ElRm2ARkmgRCcyF+pFStGN\/i\/C7XV7\/cDr\/1tJTU0dM9iLAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tomato-1334599233.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("tomato.js LOADED");

// generated ok 2012-12-03 21:11:37 by martlume
