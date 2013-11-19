//#include include/food.js, include/takeable.js

var label = "Black Pepper";
var version = "1354597497";
var name_single = "Black Pepper";
var name_plural = "Black Peppers";
var article = "a";
var description = "A mound of extra-sneezy black pepper.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 4;
var input_for = [26,51,322];
var parent_classes = ["black_pepper", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by black_pepper)
	"energy_factor"	: "0.2"	// defined by food (overridden by black_pepper)
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

verbs.sniff = { // defined by black_pepper
	"name"				: "sniff",
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

		self_msgs.push("You launch into a sneezing fit. You were expecting something different?");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
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

		self_msgs.push("You launch into a sneezing fit. You were expecting something different?");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'sniff'};
		var val = pc.stats_add_xp(3, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
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
		'position': {"x":-26,"y":-15,"w":49,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD5UlEQVR42u1WW27iSBRlBykTHubl\nJxiDAdtgngnQ0IFELfWkk3S++gNNR5pflsASsgSWwBK8BJaQJXgJd+oUbT5G6o8Z9cy0Wr7SFXa5\n6tapc861SaWSSCKJJJJIIolfIiRJuijLbL4IzHDSUfaFAlN\/GmCKzHaqzN540ritUF3NEK6vXDVa\nBubhfwOn5Nm2obJDXUnT53WH3gUGvR9WaTUyBcBqiZFeYIR5\/xkoSLeeWLv7pXPsNUpkVRgZRUaD\npkw3HNy8q5GtpgW4npWmjiGJOfwQ0bu+8e8ChZRmKU1XniaYahl5cq0C3V1ZFNg5GjoVIe\/YVcU4\ngNXKJxbNkkRTTyGznI5QB379YcAqeXZ\/7akhAHTtIi37JjW1S3JNbFqm26u6kBTZVCUh97WviXuN\nZ0uXBFAwGs\/DQedd\/ejoOfcfAyvlmMuLh9gABR9v2vRx3iTfylPHzPKNL0\/X1Rwt+oYA5WgStcw8\nOXpaAALglpHlLHKQlctTEymMgnpGHFQAzrMDP8imZ0gX65G2WY2177P7tGrvF8NqOHDKx3lPF\/4a\ndypCtklbJlvLCrAovhrVhJQAMnRk6jfLYhxgIC\/GIS\/GsAbse3w+auLQeBYzCqabmvSGhoL8fjUz\n96zMLiUuapmQ52vMGgwe8AaA6VH8fuHQh6lNDc4G7gF83FHo0\/uW8KJfk0RTxJth7rSrn+8dPUuz\nrirmx2NxAiys8o3JyCgxeHQvMFmZQwooPStLMUhktyZFqxFnsVURkvhWTjCAEy8CXTQHwAZ2ljCH\ndzUtByaXWhYbjfiaO+5LyAimkAARyww\/Yj3qgWl0ulZgx3qFhV0rvfuuvANH3tyODFoPjcNNz7gY\ntoqHhsa2AKwX2RGScY9FAOhZ8un0XLIPU+vMNjZztDQ1OGuTTplW4+qZLTTZ1NcieBA1uaz7akU6\nIOE\/YPB1pvZteX471Lbrge6mOGPRzFeOT6vOdjnR1fXI2H1aOq8PC3sOw2KhbzH3cdlQx+28sAG+\nDgAz9SrcCvmjX5VCDiCENF1Lemtp7IBXyd3U3nN7hPAUvjgLX3eXvn7+BKKuUM\/KvsFqYoz\/Bk15\nBxwCIIK\/FnZIgBD3q\/brw9pxX55mm6+fZ9HL82wr5ty07\/EcC+P8OLXn8Tqvlt1367nodqSHnIH7\nMxDOCizk18FqcQciUJMnfflteIzZ+9vx9eHa\/f15em55z7rc8E3C9VCPYAUcAu88HAjPsRHkwWsC\nFonXCRU4M8tAecU6APzjuXeB2i+Pkx\/3pwIAOUtb4Q\/u078+x6Zg5sSmaLrwp\/rLJRj5BjCJJJJI\nIokkkvg14k\/NU7mbMhk3nAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/black_pepper-1334274831.swf",
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
	"n"	: "sniff"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"n"	: "sniff"
};

log.info("black_pepper.js LOADED");

// generated ok 2012-12-03 21:04:57 by martlume
