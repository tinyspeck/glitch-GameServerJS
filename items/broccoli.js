//#include include/food.js, include/takeable.js

var label = "Broccoli";
var version = "1354598409";
var name_single = "Broccoli";
var name_plural = "Broccoli";
var article = "a";
var description = "One floret of unabashedly healthy broccoli.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 5;
var input_for = [15,26,337,338];
var parent_classes = ["broccoli", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_broccoli"	// defined by crop_base (overridden by broccoli)
};

var instancePropsDef = {};

var verbs = {};

verbs.activate = { // defined by broccoli
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Full vegetable actualization",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.achievements_get_daily_label_count('activate', 'broccoli') <= 100) {

			self_msgs.push("Broccoli activated. It goes and does its thing.");
			var context = {'class_id':this.class_tsid, 'verb':''};
			var val = pc.stats_add_xp(4, false, context);
			if (val){
				self_effects.push({
					"type"	: "xp_give",
					"which"	: "",
					"value"	: val
				});
			}

			pc.achievements_increment_daily('activate', 'broccoli');
		}
		else 
		{
			self_msgs.push("You can't activate any more broccoli today. Your broccoli-activating finger is tired. Go stimulate a different vegetable.");

			failed = 1;
		}

		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/316\/\" glitch=\"item|seed_broccoli\">Broccoli Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-22,"w":28,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFsElEQVR42u2YW1MbZRjH+QZ8BGZ6\n18mRQKWQ2tCWJOREOATlaEY02BJyIhCgtA0gHUBasUKLVWt0ho7jOFoFuWlH98oLveEj5CPkIzy+\n\/2f32XKh4xi2Yy\/YmWf23XfZvL\/9P6d3aWg4O86Os8P6IzBtc3VNnmv033D4QgWH5k\/bTQtM2Z\/h\n\/v8Hl7YlwzNOgoXyDuovt1D8ZjMNbbZRbN5NA6utFMzYq8FpuxYquLTQjHO7a\/5c4ysHu5o+3wSF\nACUg0TkXQyoghsR87y0Pz+O6O+ugQNpO4aKLLVR05l6dclP2MgDGHnQwCJSDigABJIxh1JyARvAC\nBSd15xx8jpbcBEUth+tZdCfhQigjrgQQIGCAxD3MwzCGBabtDBkxxrEFN0NGF5qrlqgJtwambFUo\ng4VFHUDKWFR8a\/0NE1Rcz1CL+t8o5ahH3e+97WEDpAVw9md4+2jJRaMft5vuhQFmcO0Cj9\/Z9Zru\nBZjEIO5jDr+BeISbI7MuVjK+5IGatXDxfFNdgGohhsPCSAK4EotBKUAAAHHIi+NaLTh87yL\/LQzg\neFbuY647r7JfAfavtNLw\/Yv8THfRmawLUP2ohh+HW+AmLHJyMS41s0YSKHUwL2rBtTKH6947Hv03\nVLJE4YGFZlYRVhcgirDEngS6gJiqqMVguM9\/d8JERYZWLyExCAUlaYa22qhPeaCuZOEukbbXZLEo\n3tSAw0LhopN\/HC6FIqyquh80ygnuI27xLJ7B8xhHkOEoQcstfOYXrzeb\/VO2Y1MVqJSxm5kIQ6EW\nULgKmYkx7kVKusJwK4ABxwliQEUMyNhiM4ULjni9gBUTUC0worIYEIBKIHuhilIN1wIIJZFEMsaz\nOLPqAFM1MMJ10C2uL5+q5wociquAQSGMceYYU2MBxzXGklxQHi+hh4UCBFjJBK2dqkdjp6L3UScl\nH11il4pSAoQ5uBVjgea6uaArBTA9Jl2soHmecx1bsoEIFV0a4gQgcB0Wh4pQZXzHy\/MwKAcDoK62\nKtRQ0oBEzIlyyq0VtUXznX5zkLWXVVbWkG0SczjDACfXAISi4npdXWP3YrgWhnqHmLNs64WaFTfc\niXIi7gOUJIa4NchF2WkmgNS83sUWGlxqo9J+jFYOBn2W7V78Gce2BLeAwIUYS5kBOGeyKicAQygA\nKsjlpZktufkmjdzx0tSOn5YPE2XLANHEod7Ah628OIDitzymiqKunskv3cjlo6jHWndOZf18G13\/\npIsmNjppSxs7tm5zmrUloR7UiBsbTyiCM645poy2lbh7wUwGM5tVr52476PRsreqALXMXqBy92iI\nVg\/7rPlWCWQcFQaTLDQAASXgUCtquJi7hdGbERqxrIdWD96m5Z8GqoUvQ7mPfh2llcMELR8krNlN\noxdzl5h9qYokgbhSMpQTouDQDXvBrAqHbCu9t9GpPfzjfQU1UMVZBxyobbwYbLRIRX2zCjgoxCA5\nY3dyooxIK0P9A8RMJUyZz4I0sd65vaWNVzAHg4rrz4cBWbEsFvH5yNssoxCLSjhzaTGUg3vHN9vp\n5vcxEqDbP\/ZRsRIxrwXynjZuHSSSJZh31Fi5ohFnBqBsq6QE9ZTc5dSjdl9qpz13fe9yOffkmpZ9\ncvU4X+mihe+iDFj+uZ9Wf0kQXL7xfKRilYqabE55G5V3mJ+R0mfRdf7p+Q8+veRK7Xq1G3uXGW7r\ntzGaexqiB7+\/S2tHg9qpYxIfT8GsPadgaqIgZy6KuMps1Qqryt3\/uqfT1fXWZveDrOD8t2EqKct9\nda1W3A8kLVETsPKdYSSN9l8a\/+TjlsbUbsdx\/usuevhnCrHI7kcYwNaO+pusic1pm0u1w7p7a2qn\nozL9xRXaeDHMcQmXpx\/7KPP5Fev69WmPyV3vNlRD8iz9EKfJnY5qw+t2INsL3\/hp9mmoimR6Lf\/X\niP5sWXc5O\/7m+AthCASEUIDLowAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/broccoli-1334606073.swf",
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
	"crop",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("broccoli.js LOADED");

// generated ok 2012-12-03 21:20:09 by martlume
