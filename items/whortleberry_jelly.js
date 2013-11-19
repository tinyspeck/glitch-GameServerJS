//#include include/food.js, include/takeable.js

var label = "Whortleberry Jelly";
var version = "1345744987";
var name_single = "Whortleberry Jelly";
var name_plural = "Whortleberry Jellies";
var article = "a";
var description = "One jar of homemade whortleberry jelly, made from the pulverized remains of a thousand quivering whortleberries.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 75;
var input_for = [];
var parent_classes = ["whortleberry_jelly", "food", "takeable"];
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
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("43")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-33,"w":20,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIdklEQVR42r3YaVNTWRoHcL+BH2E+\nQrfV1Yor4wICskYQCYsgsskWBEFBCVvIQkiAkA2yQyALEPYAAS8IorLL5rBoBLEFerFmpqvHrprp\n\/5ykW0trehbhOqfqvMitvPjVOef\/3OfcAwc+cSws\/PyF0TKq1RkHqQbTMMVR9FPXed3OzMoBCLTj\nsHYtODv7VyixaZEqa1ykVJ3Pqb6h59Tog9fsmYUfvzjwOUdtvU1cb+iDikxObReSS1uQUmZDscwB\nY9skOnrnoW+dQ7FmAhzDLEz2Z6DGXqPv\/jbkXRtQdG1ifPrH2YUV0A9dXoNnR88T3BWaEHNLi0R2\nEzjSHujNo7DYHqO2YQxFihHckY9C1zaPwWEn7PdeQGFbA9+yhvqeTXTf20K1shd5POXBzwJsGtxB\nTcsqugdW0dm7iKaWh+Aoh5Ah6AVL2AeRbgwdPfNkm+cha57BLfk4yrQTEGso1GnJf4rUCGUpEZKm\noH8FRW1Oz9qODUzO\/oTJ6b+g3fESJboZFNQ9Rqn6ESztc2jtmEaFahjpgh5kCTrBk3aiVtmOihoz\nEu\/qEXFTjbxiOT7L+XOt4MOZv2Fu\/i2GHnyHYv0TFGqmUd+yCPvACjp7FlBadx8Zwn7kiOyo0w1A\nqelBldxGjoMRzDw9skvUKOLI3ny2kDxb2XVOzeyA17zsBta3PcUg5XQDxfpHyKoaQpaoH1rjMDQG\nhxvIKrciusCIG6UGcHlCFBWkNtMPe4aDC0\/\/oZ2e20W3YxAD1CD6hhyYeTiGseHHcPSPkK21gauw\nQqq2wNxkhVknhlLKJah8iMoTISyJR\/5tFoISSl3nUJxVbvCkFanqfTXLN69C0f4c1t41tHTOQWN0\noKHJAqFMC6VaAZVGgUaDElpVNcr4YrDyOQhJrQIjvRYlIhNJcDu4khZE5KiosESak2w2L1IpaQ5o\nSDAG773Eo8nv3TWOa5hBnvwBbknvo613GXrTA9Sq+qHQDZIa2YbYOyYExogQn1yN+MRKnDmThaNH\nr4lpxU1PvxXXSL\/Bjdw1tLW\/BKe8B\/l3+hEeo8aF0Ar4MfgICOXjVkEzCostkMj7wRN3IShGjKMn\nWDhyJA2HD6eSeR1ff30dx45lkGdxQfSkdxmeto4\/IzP7BczWHRKIb2Ft3ULctQnEXB1D1BUKEVED\nCGY0wsdPilOn7uDoMdcqseDhkYkjHuluoOv38eO5+ONpNk6cKCDPEt4cOsT8w76BC0vQZue9glK1\ngx77d+ju3QWHt\/IvwHBmN0LDbWCEWhDEMCIgSAs\/\/zo32uu8GGfPCXDOi4szZ0vg6XmX4DPw5ZdM\n7f6Bi784029sQde4i87ub2Hr3EZS6tyegee8Ssk5ZJMVvUmAEc59AwcG38IF1Oh3yfnbRYttG\/FJ\ns3sCennzyCzD2bNFvwGZoA1Yr9mBpXUHivrNPQO9z\/Nw3ocDL69i+oFK1TaazduQKjb2DDzvw4eP\nbzm8vUvoB8qU26Qob6NG9mLPQB9fAfwu8ODrW0o\/sFa+DZ3hNcSS\/QH9A\/jw8yt7FxKKFqBcNg29\nwQm19hsIq5372GIBAgIJ0p9DH3Bq+u\/OkQE7Xq468HJtGNPjQ+huMaHd1ICWRi3M+noY1XIYlBJo\nZCLUSSogF3MhqSiBmFcIYVk+EuNL3EBfvwoEBVcgIKCc1MEseoCLi79QXW0UNlcGsLl6D+sLXZgd\nrcckJcdDhwSjdjGoLiEcNh7s1jJ0mYpha7wLq+42mlU30aDIwo30QjcwILASwSFCBAVxCZBFH9Bo\nGMfGn\/qwsTKI9fnOTwbGXSlzA4OCRWBcrERICP8d0EYb8MXTHpiaBlFdPYKcnBZkZcpgb\/3fgJHM\n8vfAi6EiBAe\/AzLZtAG7Ws1QabdIqdlBXMIkLkfacS1eQBpTPtRSDuqqi6CRFv5HYAijCpfCxQgM\n5NILdKXY2mzHvZGfIKh84Qa6Env6HNk68vo6511B3rECHD+Ri9CQFAIr+F0g42I1wi9XfXAGaQLy\nBUswG3tRLniFgsJVRMWOwNdfRsqIHFz+MrKyx9zl5MxZHun5EpByLfUjYHCwwA28GFqNCGY1+c2j\nE0juQ\/pVtFssKCxZR27+EkIv2+DlI0JMrA15tx+TXrDh117Qk036vBQwghI+Ar6rg2GXasCMrPkg\nJMz9N61LS2C7gOvzLeBy7YiObYS3rxinThciMMQARpiVFGUdWT0OTp4qIB3zVURcSvo3QAmioiVg\nMARu4KFDEZ60ACXSDaw\/sWJkwITSYiV8LpS6gS6oC3ghQO0GHj6S5AYW3c76XWD45VrEXJEilFwT\nPDxS6QNy+DtYe2LByqwFT6ea3XXwvl2KJnUVrsQU48TJXDJvEmAK0pIyP0qxWpL9Hng5ohaxsTKE\nhQnpA5IzeEWt+wGLEy1YmTFheaLxPbDkbjmiI\/NJerPhcTTVvYKuFLtC0qDMcwNdr7p3QGakFHFX\n5bh0qfI3IA13EtelyQXMubWO3vZezIwaP+lN8iEwMkqG+HgFwsN\/BdJ2q3MB01hOpGauIOPGExQW\n3oesuh01IivEFc0QchvAL9OAQ85nSaEU7IJqsNKrEBkp+aibiYqW41qCEhERIpL2ZPo+Ig04\/vrm\neqYTyWkrSLi+uOd2KzpGjsTEOlIHuQR41UkbcHr2Z3a5YGvfwKvxdYiLk+HkSRYp6LHsA3QOivp+\n1mxYgko+u2dgUrKG9IIl5HKfNEv7F66pKRycergxu7U4hwnHxCcDz\/tUIjSsnNzoWNRXXyXS\/wnY\nNRxTPxy02zfF9eqnbzjl0yQk4\/8VeCGgFoFBpJMJYb\/x989lH\/h\/DIfj2UGTZSFT3zBF1aseUOKq\nISe7qBe3823IzjEjPcOAtPQ6Z3KyhIqLF1JMJiczLCxvT6v2T5+xxNWc5xj9AAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/whortleberry_jelly-1334214763.swf",
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
	"food"
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

log.info("whortleberry_jelly.js LOADED");

// generated ok 2012-08-23 11:03:07 by martlume
