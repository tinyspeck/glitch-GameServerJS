//#include include/food.js, include/takeable.js

var label = "Cheese Plate";
var version = "1354601203";
var name_single = "Cheese Plate";
var name_plural = "Cheese Plates";
var article = "a";
var description = "An assortment of fine cheeses.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 58;
var input_for = [];
var parent_classes = ["cheese_plate", "food", "takeable"];
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
		'position': {"x":-34,"y":-28,"w":68,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJA0lEQVR42u2YeVNTaRbG\/QZ+BKu6\nbbeehgAi0CIEWRSRTY3gCtr0WN3jtOWCtJYaFQGVQASFZpOA7IvgACKLGPbNhU0jqIDaKJuIAUFW\nn3nPG28UtWbaaWH8o2\/VqeTewL2\/9znnPO9JZs366\/hCDhStmfNlghVIzCeurmufKHYBKjZyyMmi\nddLJkvXSsTKXXeOVG8zHa7eYv7q1ceYXMJ7rbD6RvwaT19ZjosQF42WuUro+nLOan4+VbcBo5UYM\nlkjQErJIOuOAvanW5s9TrTFWuBbjDGi0zLW96LyDtC9ZrAEsZ4BVm9AcJoIqcK75jAPeS7Dd1Ztk\niWdJYgznOXCgpkwXPIk3x9BlO37e\/a+VaAyYN3OAk0qJnNWbsjtPklkUZQcC7E00R2+8KV5kWuFh\nzhrcjzZFX+JSDqg6p8sBp78ZCiWzJ6+uU\/J6Yw0xXuqKoRJXqHPsGaCYA\/bGGeNZggkeK0z4+874\npWgIWIgb\/vNxLdp+ehUcvLQqczTXCSN5TniVz6LACcOFzhgqcsZggT1L8zIGxcBiDTWvF4zQESni\ngPne8xBx4Fsk+Zkoc0Ntpwe0K9la2Zu0XKNWAoNh6gggHCrGQAv4RLGEX28N1eWACUf+hpgjusg+\nawVljDOKY53ba1I2uH02OLqZKoHqTQA0e5PS9wDp\/QVD1AaJ8JRBEmD1aQZ4XB8lsU6oSXGdEtXJ\nrlNAO8o3fRp0YbjV7CthdoqqJBfcS3b4COD3DMiYQ\/XGCoBLUHVGD\/Uhizlgjve3yDlng5ILa1CZ\nuP4DSIrmoh3twx3SuhvhItQGL\/hjJXAjVTK7PH5d3eXfVuHqeUc0JTu\/6ViLqYBxxhzqXcAauS7S\nvEUMUAeXgy1A9xDiSrgdCiLtKc24U+CBl09OsPBGE1t4ddBCKEOMpSTMf4Qri3PWZStup9XRyunG\nSmYp9QobNCmYlcRZ4nGiJdpizdAaY4rHcWYsluGaTIQKuT5azxvzRTXGWnOF2EJ5UP2Vstemwh8x\n1OmLsb7T6Gzcjbaan3EjyghVgfNREmmDnNBV\/eyZH4Kibbvu6xdByuetPv09LcegfhzIo69dhp77\nvhjqCQWGYzE5EInhJz6YHIzi5+PqKDyq2onyuLW81pTR9nxRhVEOoPIQUtlxay9Gek9i4PdjePHw\nCLrrd6KBKccBI4xQ4T8P1bF2KIp24v+fHbKyfQpgd81WN7TvwFiXL8b7Q9F3+ye8fCTFhDqCgwgx\nxB6gvu+J10MK\/nfP6rej9aojh6jL2oYb6etRymBzwzQppXQ2XtmGjoY9eN52CMNdPuiu+xnVwQtx\nk3kmAdaGGaL85FzkyIz4fbLO2SJov\/5bg1fGOrtVpzjj5e2tGGn5AeO9\/ui+vomB7GeKRWHsWRAG\nWr3w+qVCC\/ry4SF0Vq1Fd60rXrRJmdL+HLg0xoY\/5Hr6RqiKf0Kn6gBPJ6nX0+yFh9d3QpUrQZV8\nAWpCRRywJnQxik98hfTTS1GRKEHYISME7hNBC0erLY13QFfNBqgbtoCUhDpEk0L2UIIb7ZVrU0yq\nPS13QM\/NLXj11A8vWvZg4IEn+lX\/RGOWI2+AgUeaVHapPDkURUf9LjwocUdTxmpUyubxUCm3o+as\nAdKPfcfSaouoo8Y446kH2R7dOu5xtFqyAKoZdeM2TTRs5koSJKWUIAmOYEg1giNouj6hDuOvY31n\n+fW6S07ob5fyVApBClJZ1DF\/bMpYhYaUFag4\/Q2P1FPGyDmlj6Lz9pB7GiDYS4+i\/8Q\/Fs6ZpVRM\nNdDxBzsw2vJ39LD0thVLNEqym5NqfU07OACpJwB3Vkt4qikEVQd\/PwoMyrUNIaS1nlkUWUnTRVs0\nJK9Aud\/XbBuci3SZGW+mhJNm8PtFh9WeXn+Yl54uT2+azAIFEauhUZEBtXlg7J4HRpo9MHz3R37e\nd3MjntVqao1UI1D1g\/2sSWIY2GEOSykmuOaCdWgsdON19X7UxYu5lTSmrUR9kg3KWM2lHp6PzCBL\nXPBdhtCDBhww0FPvrVmn+ovrCDLrrA1bxXo8v+nOoV63aeAoOms2cUA88eJqjnSdZM0SzcFGumU8\n7QRHUc62xJzQFR+FvM6spJJZSWPqSta1Rsg4uggZMlNEe5vyhiBA3190pm53FwMsdAXI9IDlrA6Y\ndyXYaOGoq+mVAKkuKfhnBDsYrrUZgnukXM3NmDyMIBvyt0wBFKykOMQE2YHGSPUzwqUgaw5HEXLQ\nYNdHd47Uk1azU2XiTIKkuBggRkMmm4jvMX8r3qBRscIRg03uGLqznZ+P3HXXwHbs1aqnytGUCm1l\nBJl5ZvkUJclKyny+QmmENfJ+s0GGfDlXjeDke0WK\/7r\/pgWIpQJkyikzlMVaYrRZk3ICGLmrUZPA\nums3YVj19jOK2hR7DkgFn8fqWgMp1kJWyXWQLZ2LgnBb\/hnBUZzx+gNwWjUDLczTZOJ+gkz0XYoU\nXxHU9ZvxoMAWXVWaJmphg+pAoxsD3YqnVS5v0muH7HM2Wjcg2yJvpUj3\/55DZh2ei3CvhWzxplq4\nkIP6deFeBrM\/acx6k3IlQSqO6CPCawESvPXB5jUOOHjbA5OtHnh+azNe3dUo2JC5gg8E71pWRYKE\nA+az7S7FbwliDusgWrqYedyfgJsCKhPvIjXD9rOh08cE8d5LUBRphq5KFwzfcWd++YM2xbkh5rxB\n3p\/7hGkoO9gSSb7G8N8tIp8juLde92cO6vIkP1OuZpy3EUL2fIPIXxch2ccAj4vXalJ+ZSWygq24\nWsLM966aBH7p7AqEHzL80Ig\/1yGoSXVJiobuncdS9h2U58UoDDPVNgdNLgQojFukJo1Pgfv0eVr9\nd+siaJ\/IcVq+OF2ULZ\/zbm0KapLZvlt7BPp2prNlk4khTjMwbil7RW7T\/h05XSZ2E9QkyLjjhmxQ\nXfPBd41idk3Y\/DngAYPph3vf3Aky5uhi7p15YXZ8u+QdzPZ1xXETXnMEGLBHZ+Z\/POLm7m\/hKPgm\nRYbcEteiHTmcdvPfJ5L\/X38jJDXT\/MVyATLBb5nWiBmgdNaXctAuxAaPdi3gTNbcp6gZ77tU\/tl9\n7q\/jfzz+DTC\/\/YRUOWnNAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/cheese_plate-1348017802.swf",
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

log.info("cheese_plate.js LOADED");

// generated ok 2012-12-03 22:06:43 by martlume
