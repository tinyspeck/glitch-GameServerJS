//#include include/food.js, include/takeable.js

var label = "Flummery";
var version = "1354593952";
var name_single = "Flummery";
var name_plural = "Flummerys";
var article = "a";
var description = "Few things in this life are as tasty as a masterfully prepared flummery. \"Just like Mom used to make!\" you might say. If you had a mom, that is.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 229;
var input_for = [];
var parent_classes = ["flummery", "food", "takeable"];
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
	if (pc && pc.skills_has("masterchef_1") && !pc.making_recipe_is_known("93")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> a bit more."]);
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
		'position': {"x":-27,"y":-27,"w":53,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFlklEQVR42u2X2VNTZxjGnf4DXPai\nF170qlf8Cc5UHQtqoS4URWAAvahUcWq11oVoS5U9JGggRAhIndqxFLDuC2lVIKFIDGZFspCELEA4\nSSAB2Z6+3ycw7uO0NZ3p5J155pxMzpz5nfd53vckK1bEK17xile8\/r+FWeOqqXC3Mhy4o5pkGr+j\nigQ7VFHSTEStxJwpG7Am\/CdwfleryGaqgUVXhkF9OezGSgz0l8FpkcD1uAp+x2mMuWSIBq8LMYec\nifapBg0ymLWl6O85CYdZArupkuCqMDwogddejZEhAnTLIHhqEBXatDGFjAg3YOwrgflhKR4\/KofN\nUEGQYrgGCNAqhY8AR51nEBiWIeitRXhEjqlAsyhmgPPTnXZmIbeXALnF1EH3Ywk8Nim310rQzOKQ\nrxYTI3UM9kQMAe+qpoV6buEQ2bpkr5vZa6uGn+wdHpRye0N+OTxWCR6qf1DFFjB4DpGA4ml3CJTl\njgG6aUBYJ9m5wyKGiXKq7z0FneakNnaA0Q7VdKiNbBQTXA3PGcsbGwwGyKwfeFQGs66UZ3URENbe\n4tgMylzkin0qdB1eRyPZKF8GZIPBBsRrk\/EMvgjYry5KebeLGXiPA07+gtnIbUyMXkDYr3gJkOVv\niOx9EVDbVSR+Z3B5ea2pohNm59cHH2I2TC+JqXu0387zDL4K0Ekrx0KL+5kMor+XYjAyohodHRWN\njY2ljI+P\/zPL2Q10Ol223W7Xfnv4Ovbs60e1tIcAf8T8dBcHDPnksBnFrwW0GauWAfu6itB1\/y46\nOy3o01oRCASY7CSlIAjZpMS3AtNoNIkGg0FptVoFt9sNppqaDqSlt+DGlRYE\/T9xQDbFIV8dgdW9\nFpBZzN42S4DNkr1ISW3Aho1yZGUpceRoCwEbEQwGEQqF2FGgo2pqakpEkVq5DNXb25ugVqsLCMxO\nYBxqeHiYy+PxwDLgQ7l4AkFnNeXvJrd4ac08a\/HNyzUoL7uEKnEHikt+h\/qPKm4zA9TcOogLX32A\njeuLOWBy8mms+0SMbdtl0OmsCIfDmJiY4JqenkZgfFzg3SIwZU9PD14FxuT1etGtHkNFqQlDqjQs\nPOnG7OTVlwCvtlUhb+dFHD6qQeGJQRwR+VBS0skt7rtXiNbjHyF\/azqHexZwzdpSpKdXY3JyEpFI\nBNFolDiG8YhcZJ0TCJKeQAeXy\/UcFJPP50N94xOcaZiHvOkJLja1IWStxZjhGMJe6XOABXvKkJn1\nM77cex+HjjhQVDyPA4dcuKbcidZjH+Kb3HRkZNQuW7wE+PHqU5BIriGyCKbXG1RGo3EVt3ZhYUFF\nwwCHwwGtVktf6uF0OjmY3+\/nOtfch\/0HOlGw3wK53A7xqUb8WrERWvn70J9PhLl9HQZupuGLnKPY\ntLkROXm3UfCVCZ+mnEXqpmYc2JmPnMxC7N4tR3a2chkwKUmK1WuKoVDcedoxvcFOEUt51X5bSSog\ntTLvWedsNhu3nJ3TWuAyGu1ov\/QnystvITdPgcP7pZAW7sXZ4xmQH9uGHWnHkbxehu0Z7QSnQPKG\neiStJ6isEuzb14SCgkZkZir5NTsyFahvUKH3gZGD6fWm7LddxgmkbAY7OzsrsO7S7uKZZGuBfWai\nlYD2dg1lToH8\/AbSWeTlypCUXInUzxrx+bYWrF5bQR0Vk62V2LVLge++v4Smc52wWLzw0z2NJrPw\n1mBvAE4hKUkCjT6fMDZtS2vB4xlBXd1tsk6OnJxG5ObWYcvWGmzewmDLkbHjNH67\/ICunwQ98DKY\nwWASkUMJ\/\/arLpEkptza5+fnMTMzwyeOQXt9Y+juNnOp1RaoNRaYTG7Mzc1xvVOw18Au5ZZ+zmMZ\nhInBs4pSxxfB+MqICdgbYHlusVg2u4OHn4HRylgZ\/w8cr3jFK15\/r\/4CGZFK5FCkFY0AAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/flummery-1334346515.swf",
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

log.info("flummery.js LOADED");

// generated ok 2012-12-03 20:05:52 by martlume
