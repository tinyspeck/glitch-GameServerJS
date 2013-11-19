//#include include/food.js, include/takeable.js

var label = "Hash";
var version = "1347677194";
var name_single = "Hash";
var name_plural = "Hashes";
var article = "a";
var description = "A serving of oddly satisfying hash.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 57;
var input_for = [];
var parent_classes = ["hash", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.making_recipe_is_known("5")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> and complete the associated quest."]);
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
		'position': {"x":-21,"y":-18,"w":42,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ+ElEQVR42u2YeXDU5RnHd6b9w2nr\nUP+o07HFAPGCOMZ6ILbaVAWlAgniASgQSbkFQ2uxWojrMQpSMhBCiXJFIASRYEjC5tokm02yu9n7\n3uyRvXKQa5NNCOcG++37vPG37japTGmdTjv8Zp7Znf393t\/7eb\/v83zfJxGJblw3rv+TC205aX8L\n7JJh4NMJ\/1UQDhHMwTlTlsx4+Gmx+dhscWd9hv+c+U2E9W+go3b1TslrUxNKN9yTIkTZ+qTk7xws\na+7Pkmv++nDmsHk2KIJV98L+xf0wHX0G7pLncFa+hH8yaJRlPVh8esM0lGUm8SjNTAqXZk7Ll66a\nMuE7g8tKvR2mzyciYrsFEZMoGt7SRA4VG0Vv\/QJHVtwVBYwFPfN6Uvp\/HHDXosl+5YEHcTX4W4z4\nHseIM5HBfQ+XDCLYT90WB+eTLEXFtqeR+\/IUCCp+vuYe7H\/1Tmx\/aTKP7IWT+ZbnLJoiZt9lWfMm\n5mfN+3nKdQPmLJ6Cs9pluNC2FsOtixC2\/hKdjT+FWyKC9khCHOCQcRPONrwGGvPu\/NtByguxd\/U0\nSLY+CuNns\/J3L56Ukr8uCRT03JZ5E2XXBTege3GCrWgp+g1b4KpbAZ9iCZzSmbCcTkJNbgIcp5fh\nimsrBvVvo+XUfJ6LFI5Tz+Gk+BGc2Dwd+uPp6NduRq9iI+wn0vhCdPnPhDtkL8N2Yg6kOx5D6fY5\nuG4FhUnrd\/8aJR88Amn2YzAeexZUuV\/5s0FVTeEpWQRXcRoCVS\/x530VL4Ig+rXro891N67jxWQ9\n\/mxUdeepF\/i9y84PM6\/tZ8Ec8ddWIr58ri0toC7w2wrnwFWUBnXeb\/gL6eUCdK9qJX\/5sPmdMcUi\nVLfwHEGSggRNv3nKFvDnglUZ6JK\/xu6liv85WMfuZAbmp8loy2hVntMbcOYP98ZVYvOumWiTpkcn\npgjrM7l6NJmFKUvfha2kxbTXLkdXYzqC0sX8N8fJuRyeeWjcgszl7\/utVuv4nhlqXiMLqdeCgiax\nHZ+HL9dPHWMV8rwFbNK5fOKgdCEH9Eqej05CSgpbTpAX7e\/z761liziYsAgSgL5TDvKcZffM1dmw\nWCzhcSE765fIBEVoIOXR\/lVTuZ8JdpHDrKNk6+OsGFKjQARKZi1MHPFs5dGv2YiWLx5CX9MsdMrY\n\/aOPR\/ONdkhYAFfx4NNxIlRvfQFjIM\/WLymOBaTPk28\/xO2CPG0X+ySrIEAqBHqxACaEoEZP47MY\nbP5hnKG7S26D7tBM9KkycanlXV5g7pKX+Dh6P3llLGTNzuVhnU43evIAmDDgKQift74dV5Xtsk3I\nW34Ph\/xwQQIHbNo3KwpCyS5smxCU+MOan8TBkaGTZzbn387vC0LQeBrzScZdfI68pYk4tPxO7FmS\nyA39kzfSijlgJBLJP+\/Ji4LFhv3L1XzwthcmofBPD\/AXknJC\/gn5Ewt5yTKRnTZ38hPnsvVWeKu+\nD0epCKrPJoyeNsx+KIWEcRUfzcC+FXfzebY+Pwk7fvcoivPEUCsbQeolXLlyBb2GD3iBXLBn4bxV\njH71H1lnsgrN++fwgaXvzYirutHqXMxVoO90j5Ql+BF\/Cq62pbKjcQ4GLNPhl98BTcFt+GLLfWOs\nKNa2TKwwybT7XBXo6emBwWAAqZdJgF1NK6OK0ESxL2jMTRljCYKSQi4K3kYF1K2Zj\/OBlTjnzUCf\nbQEaDz7CDZ6MPna8YEXu0ifR3TCLF5SreCYu9FkQaS\/EWfMBiEaG\/eLIsB+CxcS2TbGGO97KY4PU\npLFUQKaCZ+CrfRnO6qUwMoNX5D0R96xX8gq3o466DHRU34ILum\/yNWL5AS63f8R3sl2WCVFYu2En\nVRQN6JSt4RPF5pTh+DJ+iuj2PxX9LfZ+UHI3OioTETiTyCwk6ZoLoQVQDvIdOPZQPJz1Zoy478VV\n\/5MIaRfCVr4Joh7162LBWgxHU2FXHYalJhsm2QHU5bwaLfuidVPxybI7ULT5Qb4IKpJg5QOI2G9F\nxHxTdJI++c0wHnmCH19UZOSNce0Yg+P5xtLCVDCDvUeEAaWIg460TMLVwExEOtjJo38F2vKPIRoa\nGhYPtdcioCuAXtPEE9NkMqH25D58umYGL5BsVvJCy3To98l8gq6GxbjieWK0P3RN46snwFCTiFsJ\n5bFwWoyqNR\/Oqj+jTXcQnYoNXEmuaFUir3Cn5CYEGqei2zQbvfblkO6ZiYrPc8IifzCYfvHiRVy6\ndAkulysKKC87xuGEEABzNzyFoC4XXcoXEelcga+6Mtiq6YibzFKETVQmgu4AK6wdv4J824xoKPcu\nREtdAS72KHG+R41e2yF0WQqYYb+OXvVshHSprOIz4GzOQVPJNjRUHENldXW+yOv1Tuju6QVBDg+F\nEPYUsBzYw1qf7eMCnszdDI\/Hg1ZHAwb9mzDoXYVeayralPfDXfljaI7+CFUfpIw5wymOrZ3GGwvB\nYy97c0dPHkUGbyh4OmjqYDQaIW9oCEskkgRu1F5\/IH9wcAhD3QbedVywv8f6tvVQF65E6d7NOPJW\nKnI3zoVccgI9rVXo95Uj6NagRX8GlvIMaE7MhvLIdCgOJ8NQuRvlb04fA3eInRa0QKH1ovbKX7Es\nak+88E6t4XAKhQKSiopvWi9S0eP1hfva1FGbMRfOh0NxFDabDXa7HS0tLQh5iqKrD5l2wOfzwe\/3\nIxAIoK2tDe3t7TA1nOGKf8oKan\/6HShcdTcOsONL2IF\/7H4C9jq+ULOqGEa9Ck1NBFeZP6abcXr8\naS6PFz0+GTPIwwh1eTA4OIiOjg6emwTYptyMQeMbbJK1MBakfSugEDsXTcY7X8P9JWMGQkE5HOUb\nYfpyHW+vWNdCLRZXTlZfj4rKceCEy+VqTW9xeeALBDEwMIBwOMw\/+\/v70d3djQ5LPleAjiafIhtn\nfRoE\/e44wM7OTihLDqBwy\/PYm3EfdnztANvSH4ZBUcMX5XA4+K7Q7hCgStWMamkNqqqk4mu2\/C6X\nL9ne4jY6nG60M\/VCoRAHpM++vj50t9agQ\/MxRrzbubn7HE0cbrxoddpxYttqFO3ZArfbDafTyXeC\nAEk1hUIJaU0tqqulxsrKun\/tvw\/2FpfY5nDC4XTBzxTqYgr29vbyQ7zLpxg9d0vSuWKkHAEFg0Gu\nJm07KcVym1c8wVGaECDZGClWWydDTU2trLqu7vr\/HqbisdgcO81WW5gFrGxb3J5W+HjeBdEe8PAc\nHQ+Q4AjKYrFCpzdAoVShXt5AeRauldUX1\/07YOOBmm22dJPFkm80mcMGkxl6gwk6gxFanQEarR5q\njQ7Nai1UzRooVWoG1IwmhQqNTUrmaU3h+obGYrlcnikVuuTv8jI4HAkGgyVFbzSKtXoWWr1YTaHW\nilUUKrVYwUKpVKY0NqqTRTeuG9f\/8PV3QWgiPlxjtBAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hash-1334189940.swf",
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

log.info("hash.js LOADED");

// generated ok 2012-09-14 19:46:34 by martlume
