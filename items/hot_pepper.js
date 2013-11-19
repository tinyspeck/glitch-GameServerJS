//#include include/food.js, include/takeable.js

var label = "Hot Pepper";
var version = "1354594148";
var name_single = "Hot Pepper";
var name_plural = "Hot Peppers";
var article = "a";
var description = "A scoop of potentially combustible hot pepper.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 4;
var input_for = [6,46,48,63,305,327];
var parent_classes = ["hot_pepper", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by hot_pepper)
	"energy_factor"	: "0.2"	// defined by food (overridden by hot_pepper)
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

verbs.blow_on = { // defined by hot_pepper
	"name"				: "blow on",
	"ok_states"			: ["in_location","in_pack"],
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
		if (pc.metabolics_get_mood() <= 5) {
			return {state: 'disabled', reason: "You are too depressed to do this."};
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

		self_msgs.push("A cloud of hot pepper rises in the air. Your eyes! Your eyes!");
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: item/destroy
		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("Ouch! That looked painful. But also funny.");
			var val = 2;
			my_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			// effect does nothing in dry run: player/xp_give
		}
		they_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: "2"
		});
		they_effects.push({
			"type"	: "xp_give",
			"which"	: "",
			"value"	: "2"
		});

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

		self_msgs.push("A cloud of hot pepper rises in the air. Your eyes! Your eyes!");
		var val = pc.metabolics_lose_mood(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		this.apiDelete();
		for (var i in pc.location.activePlayers){
			var pcx = pc.location.activePlayers[i];
			if (pcx.tsid == pc.tsid) continue;
			var my_effects = [];
			var my_msgs = [];
			my_msgs.push("Ouch! That looked painful. But also funny.");
			var val = pcx.metabolics_add_mood(2);
			if (val){
				my_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			var context = {'class_id':this.class_tsid, 'verb':'blow on'};
			var val = pcx.stats_add_xp(2, false, context);
			if (val){
				my_effects.push({
					"type"	: "xp_give",
					"which"	: "",
					"value"	: val
				});
			}
			var pre_msg = this.buildVerbEveryoneMessage(pc, msg.count, 'blow on', 'blew on', failed, my_msgs, my_effects);
			pcx.sendActivity(pre_msg, pc);
		}
		they_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: "2"
		});
		they_effects.push({
			"type"	: "xp_give",
			"which"	: "",
			"value"	: "2"
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'blow on', 'blew on', failed, self_msgs, self_effects, they_effects);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADbUlEQVR42u2W204TURSGuSRpO7Nn\nj\/ckXiiIdAql9Ew5GCWS2EfgERov1CsdCR4KAYt4FmMRUJSgg2ilgDCCguCpMTEhHpLqjbd9hOVa\nU4ogoMQAYjJ\/stLpdDL7m\/9fe03z8kyZMmXKlClT\/73uulik2ynEr+3ME7cVWKI0v2DQzfQBN4e+\nCgm6nGK602ELbwu45wEWmQ5JmWGvBJqHw0hQgtsuCc4rAnQ6Rf2fuTnhZaEJn5xO7ePwqZ7DqE+C\nEb8EyYAEdxGwp5zByT1W6HAImY4yIRbdKtAxZ56o+3n8mV+G6UoZCJCOR30cniLcQ3RxwC1BH0J2\nI+QNpwhXykQDtMVuiWy6a29reXq+Tob3+2WYCsoGHNUEAo56OTxGwEGsfoS8g5BdCIlRQ7tDALXY\nCs2KkG4stjRshmuxycCORaDVahwhkwg5hIAP3NmoexHwZrkI1xGyTbFBKxaBnrJvEOhkgEdmQnJ6\ntoobri0FelX9M2L6nT7HEPLJAuTSqA\/vskA7wl0oFaERAY9jNZXYyNFUS4k19HebwC\/rtOjHgxze\n1K50jABzYARKkesLUSe8y6NuQZjTe21wGfvxWKHVgDxrt8HRwizsGcWqJdy28Fy1RcF7qMQwjuNr\nBdhwkMVpIdqhv0ZKDtLG+F3MS6N+tEbUFxGyCWFPI3QUxxFVM\/Zom8OmYVr6VacQmahgygymp3vk\nBjo2HCNy6rdFF30sjL2XWq33CPbrIb7iPDlKD0hR369gGKtgRH1kt2VxV18qFeAEjqBzCHWlXIAx\nHE8dDlEjmLkqrk4FeZxA6bvBQYA5RUts4e8HWcGykwsXTQV4yhgnvpVgI97s+Vzkv0YdRzACTPgZ\n3EInLzmESGtRfsFsSNaSNLJqJV33yRoZ9K6GFSR9ktZst6rr60WEo36gDfO6mmc6y8TMkAvPG67L\n2rcwQga54Y7mltKDblqMq7qPqSMepia9kkb1oobHPtdnNxE6ZrwO8X4peoA2RchEiy1Kzgy6d0+p\nRfkz4ALcWr+\/rGQNWRiuJjyyPl+Xdeys3Rpbet2XOtYwVSll+l0sQ5uvv4Jpgx6mfziQnae9LpYi\nx2icUWttyHycDjAVeyZFC9JDUBmOY\/UWZR\/KmKHYS7NVstFX91xb+Npb75AnYPPPqClTpkyZMvV\/\n6wfxnzm6tKwhfgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hot_pepper-1334277792.swf",
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
	"p"	: "pickup",
	"o"	: "blow_on"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"o"	: "blow_on",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("hot_pepper.js LOADED");

// generated ok 2012-12-03 20:09:08 by martlume
