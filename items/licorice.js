//#include include/food.js, include/takeable.js

var label = "Licorice";
var version = "1354589336";
var name_single = "Licorice";
var name_plural = "Licorice";
var article = "a";
var description = "A nub of chewy licorice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 8;
var input_for = [63,80,326];
var parent_classes = ["licorice", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by licorice)
	"energy_factor"	: "0.1"	// defined by food (overridden by licorice)
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

verbs.eat = { // defined by licorice
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "The taste is not for everyone",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("So... very... chewy. You're going to be picking licorice out of your teeth for days. ");
		var val = 3;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 5;
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

		self_msgs.push("So... very... chewy. You're going to be picking licorice out of your teeth for days. ");
		var val = pc.metabolics_lose_energy(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_add_mood(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'eat'};
		var val = pc.stats_add_xp(1, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.flatter = { // defined by licorice
	"name"				: "flatter",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 1) {
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

		self_msgs.push("The licorice seems stalwartly immune to your charms. Or is it?");
		var val = 1;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
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

		self_msgs.push("The licorice seems stalwartly immune to your charms. Or is it?");
		var val = pc.metabolics_lose_energy(1);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'flatter', 'flattered', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function parent_verb_spice_eat(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_food_eat(pc, msg, suppress_activity);
};

function parent_verb_spice_eat_effects(pc){
	return this.parent_verb_food_eat_effects(pc);
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
		'position': {"x":-13,"y":-12,"w":27,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADIElEQVR42u2WW1LiQBSGKX3wQS0v\npYIiIKiAggYveAMJ4CWBwaLKDbAElsBSWAJLyBJmCS4hSzjzn3a6q5NJahxL56lP1VdNhaT7P\/85\n3UkiYcKECRMmTJj4aHS73Vyn07GZdrs9BpO\/gXuH8hkdnit2Idxg4eFRaLLp7e2td3197V1eXnpn\nZ2d+rVajZrMp6PV6NBgMFMPhkF5fXwPXdLAGXV1dxVKv132MlhLVd5zhQ6fj3d3dEUTQ+fk5nZ6e\nUqVSoePjYzFK+DrEKvhe\/f+vAutOlMBBrzd7gQtNLHh4eEh7e3sB8vk8HRwcKEqlEh0dHQmkaAk7\natu2AM4r2DUdNoJBNQSc6MnJCVWrVQHmHb2Le362WJzOPZzURbCLEpkhT+g4TgDXdRUsotFoBJAt\nIbm4uCBuFSlSFwtmiReUNixOUigUFPv7+wrdSYYdlxSLxQCcpKRcLitk4lEG6CYkBq77xmJayK6I\nxWqwWAosYYFMJqNKLIkTHhavC5fiPzKPfB6\/fSUwlUzS3Nwczc\/PUx22izJDtN60sjck3C86eh9a\nlqXgEkpiSinge3kedhjJ+Ol02kq8uO6UxSS3tmhhYUGQ2d1VLlpYLKp8caULly+udOGEo5IVGwQi\nbBaS3tmhxcVFWlpaouXlZeo9PQmBNziTcrncHzv6X0r12V5938GuO2EhWfTa6uoqra2t0fr6uuhJ\nvt6+v6cdiJfA9gC7cFvC\/aqTzWYVnKQk6gjTk8Xo4\/o4ILCAPzc3N2kLpWZsHAGyxFGLxi0Y52rY\nSVx7Q1KTVCplMzBmJfK1NnCcMQupoid0l9g54awmSBcRtbheOi6Rvkm0HvTUAfyReHx8XMFb5Gen\n1RIi2CUW+PzwIAQWsej29nagvHo5dTfDDrJ4jD7GGcSP8XvlU18h\/X4\/x2IaNzeUxyIVZCp3Mb\/6\nkjiCwqAsAin+dwI+xHsYpxjH4pj4qkAvelFvk7BAFoVxhj6doGdHGxsbNvPt33I\/XHekC+NjhsWx\noxDjQ5QHcaPYZv5fwecib5xuqzWFqDGOnpz5FDdhwoQJEya+LX4B9ykgas78ipUAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531614-3327.swf",
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
	"c"	: "flatter"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"c"	: "flatter",
	"v"	: "give"
};

log.info("licorice.js LOADED");

// generated ok 2012-12-03 18:48:56 by martlume
