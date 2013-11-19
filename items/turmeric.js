//#include include/food.js, include/takeable.js

var label = "Turmeric";
var version = "1354597529";
var name_single = "Turmeric";
var name_plural = "Turmerics";
var article = "a";
var description = "Some uncommonly orange turmeric.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 12;
var input_for = [77,324,328];
var parent_classes = ["turmeric", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by turmeric)
	"energy_factor"	: "0.1"	// defined by food (overridden by turmeric)
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.palpitate = { // defined by turmeric
	"name"				: "palpitate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 2) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Feels real turmericky, for sure.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Feels real turmericky, for sure.");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_add_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'palpitate'};
		var val = pc.stats_add_xp(10, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'palpitate', 'palpitated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-13,"w":37,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD0klEQVR42u2WWU8TcRTFTyog4oIa\nH4wvRL8AH4GPYMF9iYj7FuuKcR1cccOyVRSXRh988KVxTdSYqmAiilQR3HFcEFTEkaUFUXO999\/p\nSFHUKG7J3OSfmXbamd+cc8+dAeyyyy677LLLrv++9BVw3V8Eb80sJP5TYG82Iel5FvxPV4EeLQcx\npFE1F+n\/BFzTLrgat8J4uRH0fB3o6WoHPcp00JUZoKrZCFRmIOWvgLXmIzlY2Mv\/4dBQ+nBoGL3O\nBr3YAHq1JZ6erHRQ1QJQaQbo5DjQ9anwlk1G8h+DCxZA40Wh3XEULHRQSy7I2AFqyk2guixR0bKa\nbswC3ZypIKlsAnyX05D0W1ULFfUOhDwxCk62AiiwzW5Q4zbQy01hq5+sBNUsBd1dyFbPZdDprOgk\nkH8sqCQNWvmYHgwS7UUiw7nb9ySQWPpu3wBqK4pXYJHFx+ltDiyra9eCONX0YAnoDtt9azYDTgad\nGgO6MBp03AmjxNkDoME8jOSLG51hulsteWGrG7aA6iNWZ4atvsUqlmWYVk9kJRnynBN0lkEvOuH6\nyRA4Ah0HBivF3h8cEg3E1n48PMxSUn4TsfpNxGrNtHoZqJx78QgDXWXA8ims4CjQ6dQwpKzzTugX\nU78zmtrykdJaAL+lGEN07B\/4Rb9FVntxP2tfBcbcV1Zv\/Wz1Y7b6jovVY0g\/2xyYBjrBCp5myHMM\necqpLFdbVjNQn9XLqwTiMFpw9etj05Ua+Qh8zVLpv659902rd5pWrwc962T17fmgSk51BStZOgF0\nhiEvpX5eDGjcmAlv256+Bvetj28wWTIQpWTdaiQJfXe9J2rRkeFfBY6MHmX1dlaM01vDNldymk8w\n0D1WslpSzYP8GKt4eTyDMmStFk8POVDVc6CFCuBq88RoLW7e98T6WTSvlVYB60os1ouy\/NRQF+1q\n6ReA5n5TJ6sf82OwhKEEQmyvnhce4BU8wCWIzXlxBqttBD0JJG2meI6OSHybE+e75DQBv5XkoCdW\nF9lrlsfQtSkYqaD5e56LuoyehmyHmnevNsNrDnKNj2tGDrSGbLjF8sbt8DXn9vGJ+o3bHFSRAb0k\nFckde\/umt+Q51DiSHoyMntZCpMt59MxOvRiVYj4oIJaShUiSz5ETmIr7QkXxfrnr2jXQJTh1mhrG\nvq4zTs7JLxW69KYo\/GwNj5xJ8HccGGRIGPnmBJokzWKrWP1LM5J7UHtXPEAvTYPbagVTvfuLo08u\nN9Ne3N+QaVA5J2xhVAuZ\/6td0UPPbGW7qTD3TsoPDHu3\/cZsl1122WWXXd3WJ6tPRgHIiJQTAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/turmeric-1334276721.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "palpitate"
};

log.info("turmeric.js LOADED");

// generated ok 2012-12-03 21:05:29 by martlume
