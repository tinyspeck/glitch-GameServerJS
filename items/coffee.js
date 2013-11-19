//#include include/drink.js, include/takeable.js

var label = "Coffee";
var version = "1347677160";
var name_single = "Coffee";
var name_plural = "Coffees";
var article = "a";
var description = "A steaming mug of strong, life-affirming coffee.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 5;
var input_for = [62];
var parent_classes = ["coffee", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "2",	// defined by drink (overridden by coffee)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by coffee
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Caffeine Buzz'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("caffeine_buzz");
		}


		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Caffeine Buzz buff (caffeine pops your mood every 10 seconds)."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a>, <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a> or <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-20,"w":27,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFoklEQVR42u2Ye2hbVRzH+4c6\/Gv\/\nbHM6sHu4ueGkMhmT2a1jU\/ExKEyU+ceo\/iOIf1RQUFCp+o+gwkAQRCYBwbXruhXWtF0f622btmma\nm9w8mvfjJmneTXKTNGnS9PH1d27XsunabV0qg\/XAj5Obe3LO5\/we5\/x+qajYaBttoz1CDcBmZLO1\n+VisIR2NtmZjMS4Xi3P5eILLJxLcdDLJFVMpbi6V5hbSi4J0+jwymXrkclXrC5fN1sX9Ac7ndsNi\ntcHucMLt9sJp1MI2ch2O0S64xnrh5Tn4hQFMGFUIm4dRmp7GbKGA6UxGLEmSAoVCZdnhSGOc0WCC\nTqOGpu0vDF34Gn98+haufnIInfWHZfnh9F5cOPfi8vPSu5\/PPI\/Pzp6G\/boC4YCIZCQiMSuU1ayZ\ncATX\/jyPX949gK\/ePoAv3jyIc9UHZHn\/yH6ceGEvTh18Dm8c3CPL6yS1L+9bHsPG\/\/ReFX7\/6Ah8\nwjBy8ThXnJ1tnSmVuEw2y9mdTgXP85vXBGgymWoCHi+8vRfxwfFDqN63E6\/s3oHDlduX5dWd23Bi\n91ac2rMFr5Gc3L0Fx3ZtRfWeHTi691kc279L3sSXH55F1KiG0WRGZmoKot8Pq90OvcEAzRjPrRnQ\naBqHhyClWBxdzU347ftv8ePn9ThTfRgvbXkSR7ZtwvHtT+Dk04\/j1DOP4QT1R5\/ahI\/fOSmP\/fW7\nb6Dpu4GAR4RgMILXCRgcGhLb29tlfxwZHRU1Wh59g4M1awZ0uT0IhsJIJlOYni5gYXYWcywApnKY\nyWZRSKcxLUnIJZPITiaQiccRC4Xg9YpwOF2wWu0wmS0yoHp0DNc6OpZhCJBTDQ+DG1A1lA9wYQGz\nBFkoFOkEySGdySCZSiEen0Q4EsVEMASfzw83af7fgJoxrXDrGqMaDQGOPDyAY7zuNn\/TaLXoH1Qx\nE9c+dIAanq9TazToHxgUHyhI1gNQr9dXaXmddKOPw5BaXfdQATI4XqeXyB\/R3dsrrPmgXhdArU7U\n6QWJBL2kPZVKVXW\/t0dlhi54fyDIWSx2sdyAWl4PvWAA1z8Ap8stud1ivcfjubebpFQq1QWDIYF+\nCIPRLEu5Acm0GKJjxeP1ynNN0a2SSCQFm8NRt5rWqiQpLZjHrdDpDbRD47oBsoOafZ\/P5+W5isUi\nZmZKch+OxAS93ny7yefm5upidI2Rb8jqX2\/AcYuNtJb7DyCbb25uHpOJBHheqFvSXC0bxOD+L0Dm\ne30UHJFI5I6AbG5R9EOr1ddW0IPIJlsJkMGx53ICtimVuHLlKtra2ijZzt4RMJudkqOdaRB3A+T6\nBzEyon5gwDHKWDo6OtHS0iIDdnZ2rqhBBshYZEC26GqALHC6u3vw98VG6CgCKcrvGZCVB+wwVirb\n0dzcjMuXW2RAZuIE+dpKgFGKiSVAxfz8PKw2+6qAFnJsk3kcXV3dtNBlWuiKvKhS2QFle\/vi55t9\nm3Kxb7rUjMbGRjQ1XZI32NPTg37yP5\/Pt2qQlKgXqMQgHoWc0lMUi8XijAy5GiB7b7c7ZZO5XB7Z\nfCZ6L1BGbCDfYpmymTYxbrGSSW0QSYNMo3TGyVZKUb6YTmfIfNkVAVl\/k0NcLgNuQrayAczPmDPf\nK6DX65NB\/P4AAhNB2fwhqmEiZGZmpvsBjFOiyzbJ6wytd6xRCLKWBgrsByECtdoc6w7I+jhl3yyI\nDAaToDeZ7p4TEmBtoVBoyOXzYi6XRywWk88lBlYOwEnS1ASNdThctHmLaDZbGkwmy9pKUQKtoR0r\naGKBTU7XIS0cQzi8GKlLErylXxayQjAYXoxo2oDHs1if2BxOwWazK6xWV01ZC3iCrZSkqZqkJDVM\nTiYV8XiCIy1x0WiUI2COgLhgMMgFKAvysX8hfH6ONMwRmIKkweUSa7xeb2XFRttoG+0Rav8AdZox\nIDtnJJoAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/coffee-1334211330.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("coffee.js LOADED");

// generated ok 2012-09-14 19:46:00 by martlume
