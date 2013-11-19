//#include include/food.js, include/takeable.js

var label = "Kind BreakfURst Burrito (TM)";
var version = "1354649263";
var name_single = "Kind BreakfURst Burrito (TM)";
var name_plural = "Kind BreakfURst Burritos (TM)";
var article = "a";
var description = "Warning: Does not contain meat.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 292;
var input_for = [];
var parent_classes = ["kind_breakfurst_burrito", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
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
		'position': {"x":-16,"y":-19,"w":33,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIOElEQVR42u2X61dTVxrG\/Q\/8Ot+o\n7VojiIKIdexMR0Y73tqZ0ipdU+cGjrWt2mqnVSlCDJcUAgn3i0ACIUgAA1oBBxExAStyMwmggFxD\nIASSQA5FbkmAZ\/beDAgzji7rfJm12Gs96+Ryztm\/87zvu\/d71q1bG2tjbayNtfH\/PWDN94ElVzY3\ndElHhGdp3iRVL1gUaof5unraXKkeNbWpjUYjk8FgUPf391PF6\/V6PpFPX1+fy6uDcYWe82a5zjmY\nDIc+mki4QtEEKhPzw9IVoOmYH8nGwkgOE3kwTI5UYWykHSMjIxgaGgIBBoFDT08Purq69J2dnfHd\n3d0+P8G1Aj6ZhHMOxDMIOvFKLVjyGMDzRM+hoPQB7UOXMcV1YXp6GjMzM5iYmMDo6CgGBgZAIPH4\n8WN9R0eHf29v7\/oXugaLQrdgVWDeQkDI8UUgLxJ1dzkCQxlw2Kphn+yFwz4Dp9MJh8PB3CVO4tGj\nR1x7e\/uzww9bngusCm6VC68ISF2kUaBw9LgkhyGOwErhGC7C\/Pw8FhYWYLfbWehbW1u5lpYW\/\/8E\ntChkr+rWStFUoDBzxlSWJk6DGPbuEMz2BqG9cSfuR7qhZPsGVOcGYNzSgaVhtVopJAgkfxUgrUJ6\n0\/82oaMnBAvmnNUOja7ORQrj6BctHklY50wEjDj1pPk4HlW9DWONF+ym0zBrgnH78z1QBmxEU9Y+\nVEl2Qt98eRnSZrNRQOh0ukUnSS74OMebFquTFoIpA1PajzHz6LPnAq4MJb2WFgSFs\/dFsM+OfjG4\nej\/0Nn6MwuT9yFEcxPW7fuhoOYCh4rMY7EtBv\/YMuEElquV70FoVsgxJq50AcgyQxF\/P2SyYGfhX\nWEhiv3S+kYpdWoacA4mwGxIwdt+XAB7ArPEkDLIzKP+tFzL9fg5l5A6Yiv8EQ9YXmJusxOzgMbRW\neOJ2hseyk+Pj4xQQ6+bm5vxpglLivs565gCFXDDnvhwcCS2Doy6ar7CwTvRcQGaoDzTBrugr8Eb+\nL99AXeBecAYFHNYI2C1iPOHKEZ+7GynnXVEm3kzC\/StM\/2hkkFqtFjS8\/KUKImUOS78Ks30ijDef\nIpPGPXfNmzOmkHNinjpH4Ba4Ksx08jDa+FdcqfHHhUwPXHPbgNbTW2E3h8I5UQLHaDJGSv8C7dEt\nsNX6okP1Eb7xfA1nf\/cGvk\/zQHdjGohxTwHHn4xCUSlAWNZhHI9xRXiWD+7WfIneewGwPTiOJ+0X\nWCX++xLk6A0jlXmRLBuxi3CjV0mVRsGsfgcjnRehqtmKrvu\/JmE+QtLnDCw3D8B09Teo++A9lP\/M\nhalf+ilmB\/6IWrk7Ai97QiLxgLacnGuxLAIS9\/jchBXKH8LBv7YNETe2I6zEG0EKT3yZ6o7orN1Q\nVfhhQhuAH7V\/wzRxZ24o7elyQrY8trWNlcDW\/AlG1HvxpOlDGLojkVbwZ5Tt9oatPgrOcRk6+Edw\na89+tIjeh+nKZqi2bkC5hytyvz2IvH2vQ3V7B74Su+JY1EaESg5DURqHdYODg\/zZ2VmWlFV1SghL\n9iH27k4Iq3YwWPpU9IIvxFuQV\/QuBhuPYvSHd2G95wub5jOm4RpfDKv2YOzeAUxpDjPZhzPRFnQC\ntvuhJKRiVgwOrhAFGXsRLtyMyFB3piDeJqS7vYYLb21AUvY2NhfVCZEXMnLisU4ul\/uOjY2xPVJ8\n\/RBzUVT9C0RVvsmOkRVv4ts8T5yVeeB0mjs+EW7EuUQvXMo7iMqyQxis\/YAsRydZqKlmOwMZ4EzH\n13Byckz37MKM4SNSyUcxYQpBeenvcSP2AKTfuKMy0BVZO19HFMm9M7yNy3BfJbyN2+obCA2PkLFl\nRqWq1tONPK7UD8GFW5lr0cXvI7zUm7lJRUF5xV7gf78NvCIvBn0i3g2fx7nhAknsBOl2FF\/dh56m\nU5huCWCQDqsSBbffQ3rFHxAl283yrIpcU3zIG6aaI7C17keZbAu+jnZdhluSMDZMHxgYuNg8UBdr\na+9jamoKk5OTLNyltUkMiIJRwKD8RfAQpRcDD72+jX0\/J\/fAycRNq25+PnYTeir3E4gPUSZ\/B0Hn\n3XCeJP+5Exuhrd+KFoUPyop2ITPde9V1yQV\/x5XSTMSIxAjk8TxXbXWynFwZcRI03F2DGtxoTEBZ\nQzyklacYCC\/\/LVTUZ+FWQzYEyr3sNxr2T0lSixXHcE2VgvqWW2jtrINpoA1dmnw0lJzEg6KDqL3m\nj4J0D5SlerDF+LLUE2HJu1BSlY2b1YUoVxfgH6p8XC8pQVh4BBfE4z27R8yS5cgKCpV48EDDNm3q\nJN0XdV13MGDsBSko1sNR1T8sR62uHCaTiTWkZrOZLQ20z6MPyXEcu37MaoSxu4YBa1WJZJu7w3rA\ntrY2tu4+fPgQd+7cQVJyCkJ4fHVwcPDzu+3sbLmvRCrTKfILyQ3a2OR0QjoxhaYQw8PDDIz2cVT0\n87NE\/yMt\/1IHzcBIYwrS86GxsRE5OXJ8FxkFfmgod\/FiKP+lumqJJNs3U5LFZcvkuFlxi92UwlGn\nKPRKSNrKU1cpDHn3AHnvYFsn6ZBXwWk0WpSW3YA0S4bwCAGp0nBZWFiYb6BQuP4nvZdkZGSsT5dI\nfNPTM\/WX0jOQdikdSmURVCo16urq0dzczDZ0uuJrNBqSGg\/Q1NTE3GloaGAPVlJaBok0GyJxHHFL\nCMF3kbpwQWS8QCBw+Z++3aVIpS5paRn+qamXZCkpqerklFSWN4lJyUhITEJcfCJRAsSx8QwmRhSL\n6BiRTigUqaOiRXyBUOgrEIhd1t6T18baWBtr4+XGPwHzfJsTm6CVHQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/kind_breakfurst_burrito-1353117484.swf",
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

log.info("kind_breakfurst_burrito.js LOADED");

// generated ok 2012-12-04 11:27:43 by martlume
