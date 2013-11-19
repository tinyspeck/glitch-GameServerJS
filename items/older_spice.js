//#include include/food.js, include/takeable.js

var label = "Old(er) Spice";
var version = "1354587557";
var name_single = "Old(er) Spice";
var name_plural = "Old(er) Spices";
var article = "an";
var description = "A handful of colorful older spice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 20;
var input_for = [288,328,331];
var parent_classes = ["older_spice", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by older_spice)
	"energy_factor"	: "0.05"	// defined by food (overridden by older_spice)
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

verbs.gaze_at = { // defined by older_spice
	"name"				: "gaze at",
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
		if (pc.metabolics_get_energy() <= 5) {
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

		self_msgs.push("This colorful handful of old(er) spice almost reminds you of something. Now if only you could remember what it is.");
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		// effect does nothing in dry run: player/buff_apply

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

		self_msgs.push("This colorful handful of old(er) spice almost reminds you of something. Now if only you could remember what it is.");
		var val = pc.metabolics_lose_energy(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		pc.buffs_apply("buff_remembering");

		var pre_msg = this.buildVerbMessage(msg.count, 'gaze at', 'gazed at', failed, self_msgs, self_effects, they_effects);
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
		'position': {"x":-23,"y":-15,"w":45,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEDklEQVR42u2WDU9TVxjH\/QbIWrm3\nBektZVA21lbAIUTWVScU5tLWDcMIWhwxKBqckG24gVcmbyuw7k3TTt11ia1KaIpkTDOFG41LZrKM\nbTExWQb9CP0Iz+7\/kUvIosmmc2+5T9Kc3HPOPc\/v\/P\/nObfr1hlhhBFGGGGEEf+ryIhSeMkiqcsW\nu+1fB5c0ieH5vPzM92IhJcyielsoiGqw6X8Uqqg5nuNqHI\/OtodITY2T3sZcz1Ms30knypvkpFn0\n\/u1gGkT0Tn+n+nFxjdpf8iKNlHtJebmFfnWU0tnDXXROkMjn6yMpGKcJm4f2VrUtfidsDCzlFuU8\nUbCp3Nycqxusyo3Rbrp5\/ADNbLDQzO4mivQP0gnPq3RH2EiaYjTleY4A3lj3Jp3SlOyoaCFYf1Mo\nUH2+Y09G0SWrpADgRy3RLclNh1xBVmhmuI+tBRjU2t\/3CdsMSPQBtPcZPyuKdwD7vqM2e08slP+S\nYpJC8fCums7FhbIygnK3A\/V0tLKVEyMpgGcLJbo60EkDngZ6N7if0q9sZ\/UwDjioCNjrefl0tqCM\n+78prqZa\/2jmjYoW+dL6PPejXhnpvZV7sp\/u2ElnfC\/R+MgYK6PZTMtWO81vraYhxxaq23eaZiJv\ns42AAIxz50cMgrnfrliPdwDo8Y\/R8Web6LLWh35soN7bm0mYROWiWZQvrLfYuLikYOyIFIoFEk8J\nRxImIaDDYcKC5Mje3VxFPxU9zZZ9MSZTW20XK3bPYqMfgn7ujzQ2c0IkuiUU0NwmN10b6Wa7kfgr\nDTC5rZ7nBjsm2eLkChh+rZvbuaj054RZWOTWJGQ1wLjcVrUnrXeAGvdZRcNwJjn0Ds31hukXi8Tt\ndG0VJ4MKaLHw6MEeLpIvD+yjK5tcrAgUBsxJz2urFpc1xwgufOisZnCoDii0OMf6OdUEyz6wMueO\nhhdvnB9ULzkcCgDtoZgbUifNQhQvwy60WGywvIkBuypeZ4WgFoDuNmyj8yVbWaFUYTl1u0LU3jZA\nir2UQb62FvPmTpb6eB0AoT9ucaThIFx76BcgveOF6PWpsdU7Slsgre1GwUUshT73olBGpBqv1qdO\n2txpJPrZYsviixFqHcoebHmLoXvcoRVFvGwTwC+XljDI4eoOuma7X9l41lVkazUG5MUxY2vXBjr1\nCWsAZe0XPfTeZzY1FVG0RPLvCsi7nGd3z6cmbAvTkYw6HeFP2imrUz7m3K7CFTwvpCa5OoeLtsgA\nOiPaM8ilj6ca6tTZ9qDCHJqKj1TNawMLwPqHjaMKoQDsgtpQE07wcTEJab0Q2RVt7MqFCRWbv3+c\nuA4Cj\/eHgBcRlT+ykQ+kyoy\/roePyYPm4JyvrYPHVu\/PxOo9ZoQRRhhhhBFG\/KfjN23GY+aJbf6M\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/older_spice-1334276093.swf",
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
	"z"	: "gaze_at"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"z"	: "gaze_at",
	"v"	: "give"
};

log.info("older_spice.js LOADED");

// generated ok 2012-12-03 18:19:17 by martlume
