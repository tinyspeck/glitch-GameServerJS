//#include include/food.js, include/takeable.js

var label = "Parsnip";
var version = "1354598432";
var name_single = "Parsnip";
var name_plural = "Parsnips";
var article = "a";
var description = "A pungent parsnip.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 6;
var input_for = [9,55,298,338];
var parent_classes = ["parsnip", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_parsnip"	// defined by crop_base (overridden by parsnip)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/783\/\" glitch=\"item|seed_parsnip\">Parsnip Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
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
		'position': {"x":-25,"y":-24,"w":48,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD8klEQVR42u2WzVNbVRjGWbhwx58Q\nSQLtrs44jk47NC7dsegfwMKNC2fqjNa6Q2s\/wGoJhU5NpUSgpRTyBUGkIHMFJNCxTmqhWMLN5w33\nJrkfJx8XkuDi9bwnTey4qOg0UWfuO\/NM7j25mfOb533ec9PUZJRRRhlllFH\/u3Ktney8tXjc9FfP\nnbvadqzhcJOB9t6xH06AY+G15uc955gwN\/eMWHv\/FcDJ1XYYvvdmdGjujdO4NuBuMfW5rV12t8Vp\nd1k5pklLtGfYyjUc0L163ERbDKg7Syfgyp0jQbvLQq5MWOCL8T9E1+C8o7X+DmraoqlAlm1V4Zon\n0G5zBU6Sr2dfhc9vm5m6R1rgy7uWmi4MWuGTgdb6OQgAL+XVdW+e\/Ax6bgMK2YeQ0+5DVl4RCmT9\n1Aj3eq99\/Ch85miD7ptHmS7caINz11vh02tt1L0j8PFlC1cn1yaas8qKt7gfh4Nypqb9wg5k1QDQ\n74C7\/xGc7bHAmUvPk9lZFzg1PR8sl9IUSn6qDJSKu8xJLT0PRF5iuvzVWxsfXrJwTBfN5M9wZ7vN\nzS8cUE1\/zxX34vDbAanpoKxQ90K0zUGQRR8o0gxzUYx6R5\/97ZmLr9hQH5xvMdWltbLkdxayv1Ag\nlUpjcOWiBEU9ytqrpr6jgB4mLbMIYtz\/sGHHh7Lr6dAyCxRIZC0tlyTYK2xTsDAVDzl1nbZ3AZTU\nt3RY1iGd9IEUm1prCBxJ+48RZYkwuBIdBj3M8qbnHoGefcTgsKWYO3QvLUxAPPQNBfT21x9OWe7Q\nc5vkoCSzrGH+9NxjwOMFHZVFL4OrShanIPrEAQn+NoiJmbfrdozQoHdSR4LoFE4sTmklazzktQe1\nrFXzhnBqiuYu5obY9hCkhLn3D7WZJIzZDg0muk1ZZdWLbSvqkQrYfpJm7QlrZ4EEKciPFaekqaeA\nPsjsToOUmIbdqJsC+iC8de2dQ7uRSkw6qRv9WS3wLpGmbUSer0mWvF1EXuxCKNw0Tx4wGGwjgqFj\nCJpT19iEKpK\/1kotswJC2EmHYZY5hnACPx6Voh7b325ZLHTzVCY5S2TRzwKd136CvfyvLEd4jW0r\n6jG2lqNvAjV9jwZ+uQaDk1k53\/xsEBAKM8Zv2hlcIjwuSInZ9+jr7+V\/nKvI1oApHhoOJiNjtCW+\nysb0QH02QwiA9whUXasGX5bmIBm+RZ3yMLciWw6O3+g7Hdm4+mL\/dGILBH5slG5SEMKjtC0j9ED1\nsgwldobYfUqYYWGv5MpFp\/IGcwzdSkZcXJK\/29mQ823ncV9HbHuwHzeNh0Y5dAWvw1vX2Wd1fWfT\n3stv9nWKkUFTk1FGGWWUUUb9p+p3dBX4UUVY80wAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/parsnip-1334213162.swf",
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
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("parsnip.js LOADED");

// generated ok 2012-12-03 21:20:32 by martlume
