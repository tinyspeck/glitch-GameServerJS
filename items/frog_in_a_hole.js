//#include include/food.js, include/takeable.js

var label = "Frog-in-a-Hole";
var version = "1348008238";
var name_single = "Frog-in-a-Hole";
var name_plural = "Frogs-in-a-Hole";
var article = "a";
var description = "A perfect egg perfectly fried in a perfect hole in a slice of bread.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 44;
var input_for = [];
var parent_classes = ["frog_in_a_hole", "food", "takeable"];
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
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
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
		'position': {"x":-16,"y":-20,"w":33,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG3ElEQVR42u2XeVCTdxrH022nM93Z\nqdsF3B6jVHtY124Z27FWezA7s39st2up3a6tu06Z0dajaqlF2drDCFUXXCueeJTKeiEa3KBdBAuR\nQyBcEiAJJiQhHIGQhNwHNMf73ed9KTHhsKI7+0cnz8x38ps37+95P7\/v83t+b8LjRSISkYhEJCYV\nMKTFDao2xAd6P+ejf2sO07+1jNX3nZvLhjR\/D9PId\/7uT4WDyo\/5Q+2bkmBKjf\/fAlnSpwwqkxOH\n1CnCIfUmrV\/3OWDYyilA4+\/VG7kxQXAa+e4WJER\/ahIs22JvC8wlXRfnUSYTVAoCfVuCiS1tydBW\nrYKs6F1U576JqpNvoPrUYohpXHvmTdTl\/RkNZ99Co+AvaMpfAsn5JWi9sBQa0XL01X0Aq2wD\/L1f\njIaVwJCayJrxo2CW6hWx1rpVwsH2jcEEHu1mKOkBFccTcOXYIpTnvM6NK08koFX4EqQFL0F+4WXI\nL76Mtm9fQZPg9TDA5n+\/Tfe9AymByi8upXv+ip6qlXCrPwsDpe2gZUEnhHM0rkm0N6+3+rpvTDQ0\nJ+G7r19DafZrEH3zJw5QIlgIfflj8MrmgNEuBtP5Npi2x0M0A\/aGOXCot8NplJHkcJrksHSVo71k\nPQd4\/T9\/I1c\/oIp8Sc\/ZNhq0bIybZvH7OR5FctiNuvq1uHzkj0HAa4WfwNjwDhjJvWBkM8AoF4JR\n\/Q6MfBaYll+Baf7FDUnuA9N0F5iO5YClErBLSC2A1wyHvgE9DbuhLFyG9qJlMMt2AKbd3J4eav94\nGNKwrSwEbiWf3WuhcP2SD1F8+FUOUFFzBF5nF63sKJj6n01aPu12wFpDoFcBczkYhxQBrwVOgwTq\n0vehKl4Gj+7E2EZyXuDzrLXvJYx2jlWtYAlKj70Fcxet3kwyFSMgvh+B6rsnLW\/Vz6Gq2AlX50WC\nrILfpYDXo8OgVQ0vOasRrYRFcRAwZsDbkQJn8xrudGDsBVqeuW6V1tf5CWy1y+FoXBns2MaCpbD3\n1dGkS8MyfYdAy6vwV96HQMXdtyx\/dQzsZU+ipXAzusSZcBOk2yyBfUABuNrh7RHAphHQXvwnMLA\/\nxCTam44C8JzSpOHzTLMp7Dhxd9Kn6Vsa06qNRTS5BIz+DLx1L8Jf9wz8NTMREN0zrvyVU+EXPwXv\n1ccwIKIuL9wAWfEX6GvMgl11Dl79Zfj0xdyi2cX7e\/PhNeaGV3FgH4wSPnjuto8mPkyNu6gkxT84\neJkmXYHfIIJPug7O6j8Q6LyxqpoNl+hp6C\/Fc2Csc+qKdDoNjsLTXQhfvwhurRDe3sLhnBYR7c\/z\nozqZ3LOdQ8vp34Nnr3\/35ic+7QvY8ikRwRkvw9Ml5LrSbyqHXS1Eb1M2deQh0uExMrQeh0MjJLAi\nuv8qzS8n50poT5dRR18dzsvmH\/1MyzEqeQZEadHg9QoWSgK9qdZbej1Zsmm1lNReTqrGEJXKpsrj\n5Oy8QNcaSI0\/iB3Xk2gfO2ppHrllo3uspwnw0PhgrHME59DsQ0XGNJSmRkt4ffkLhIbiBAQMe8aF\nYvcn20Ss2Hct08+\/4Sy7qX9MdL5NlHdQsYETd82USYs5H4Rj3StNixLy9PkvJPYKFsBQtAg+3S4r\njDvCErla13Id7mpdhyFVCnvKc0lt9SvoOFgb1liTEbvgIVUyGCN1r+0M17Hd5auDcBxgalQiz3Lu\nuSk6wQKr7twL6M6bZ7U1rKMSZAVBGf0W+Hs+40BYuJHVs9cYPf+24LjcAwe5RvCZctFZshzivbOC\nYJxSo6wl6Q8Mv+505CIL2HP2eRYSPYL5cEo3wtd3gGv30a5OXl8Ol9B8mHPL1bEPPfTjoyX7WYgz\nYoKq2B4dCpkZ9i7WnZ2fOQLYfeY5dOU+i87Tc2EoWQxLfRI8ml3wqNLgaefDcz0Z7rY1cMtHtBpu\n2Wq4ZKvgkq+Hqy0FLsUWuK5vgVP5D5gaUqAuSID85Iuoz5weBhWqyu3B0mqD7oUGweWMBtSeikPH\niWegOf40NP+aA3XObKiOPYX2b2ZBmf0EFEcfh+LITFw\/PANth2Ihz5oO2cFpkB54BNL9D6N174No\n2fNrNH0Vg7qd0RPCBR2k0l5J+2XchD+5uvLmJY0BPDkxoPLrUMBHg4CyUYDNmVMh2R09IWRNOute\nlPamcMFy582NI7iy8QF\/c0eA9eMA1qTHaKt2RCWOW9abRU\/u3HjtyTjhHQHueygIeO2r6FDHrOL0\nmJyandF3\/ieq49TsWO2J38bLD83ky7JmSFr2T0czqfVALGRZj0J6MJaDGw+wec+DBDaVSktQGdFC\ncUZUYuNknbrdYFd\/K\/q\/AUUiEpGIxE8w\/gu5tYTKToen2AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/frog_in_a_hole-1334190866.swf",
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

log.info("frog_in_a_hole.js LOADED");

// generated ok 2012-09-18 15:43:58 by martlume
