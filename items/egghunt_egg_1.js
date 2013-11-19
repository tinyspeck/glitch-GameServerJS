//#include include/food.js, include/takeable.js

var label = "Certified Organic Chocolate Egg";
var version = "1342483399";
var name_single = "Certified Organic Chocolate Egg";
var name_plural = "Certified Organic Chocolate Eggs";
var article = "a";
var description = "An 'oh-so-delicious' and delightfully decorated chocolate egg. Inarguably tasty, this treat is not affiliated with any known holiday or group, religious or otherwise.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["egghunt_egg_1", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.33"	// defined by food (overridden by egghunt_egg_1)
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

verbs.eat = { // defined by egghunt_egg_1
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gives $energy energy. Grants 'Chocolate High' and 'Sugar Crash'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply("chocolate_high");
			return true;
		}

		return false;
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collect 5 different chocolate eggs to get the Egg Hunter Trophy!"]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Chocolate High buff (chocolate pops your mood, energy and imagination)."]);

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/egg-hunter-trophy\/\" glitch=\"external|\/achievements\/trophies\/egg-hunter-trophy\/\">Egg Hunter Trophy<\/a>"]);
	return out;
}

var tags = [
	"egghunt",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-16,"w":22,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALAElEQVR42u2YaVOb1xmG+Qf+Cf4J\n\/tyZznimSduZTlO3zWonMV4TG+\/GgFkFBmGJTewCJJCQhBACIQRoRwhJiFUg9h3EvhiM7BBvSZO7\n5zkyTNqk0zTLl47PzD0vrz4cXe\/9PM99XhEV9Wa9WW\/WL7f2nYFj3t21k+avdwTWb3YFdib3q12j\n49s9dwfT5OKy+3HHiDG84RGEd1yCvQ3nqZ1124lfHWzeO3yyd35O4Qyvhs1fbcP6j0ewf7sHFx7D\ng334EEY3E10X5kN4Ot+HJ4\/c2N\/uwN6mHdur5tDmcrtkNWQ69YuCbZr9xzfb+9yPbAEsDUzA+2jl\nCM79GoyhYBBPEWCiaz+7X55ZwpNgAOF5H\/bm3dhZ4ZBYXzIh1NMWNrvcioIx78mfBbdi9N3aaO3F\njmUQe54B7PcxhK4JTC2vcOcIjmCC+ALjOMAEE13pnj7fHpxF2DWGPccw32OzrQ+rzT4s6d2Yq3Oi\nwe2CeKjDndlvif6f4UL6LsWarQvboy7srjnB+glf7HXhYHIYz\/yzWFtYRS+DGGYwBDaLL7GAZ\/xK\n9\/T5WHgHTzrH8dg5gkfWALba+7Fm7AbbG\/PaDkzXWqHstCN7wIZ0nymU2Nn84xydr3cpQo0ebE7Y\nsLNmZT3k4IBPN3046JvAi545vOpfxOrGFkYYyAyDCuE51vACS+w6xe7pcyr9enA2Amh7DdjiR6jx\nENCGYUUbJD4L0rtbkdLVjLpKldEpqjz2H+Fma+3RC\/UuLDd5sDFhZYAWDrg\/6cdT7xi+9E3jRe88\nXg0s4kVwGZMvw5hmQIvMvWUGRy4SIJWZHA7ubkQA+7qxNeXA+rgFy0ETFgYMmO3VYbzJAKu2hQMm\nuw1Ia9XCmV4VdCb8AGRCQH8s29sWlnnsmGvuwrrFi60uP3a7+sGiA0\/drHgM8PlrB78aDGEntMn7\njiCpvAQ3yuBoWPysRzvZIO24R7Az7sbWSjsbkhYszzVhYaoes+NqTAYVGNY0QNTRwgHv2bRQFMth\nSSpmkKJ\/hUzpMrjpSagnjJ0uXg4qC5WHXKB+OvBO4Vn3LF6SixxyCWMv93lJCYyco2nuYe51MTgH\nG6bpsRlsd3djc7kNqwtGhGb1mJ\/UYmZMhYnhagRb1DCoG5HoakSstQ7CWgaYWIKWu\/mSI7hYuzaa\nnkDgM0HYb0XBgBMLLV4+eTSBu52DeDzrxZNVLxsWDw62\/Xg+PMUhQ+ubfGpJVFZyjuA6GJztm10E\nFhf4g66Pmbl7i9M65p4GUyNKjPbJEZDq4SuuR4KzAXctGlwzVqMluZgB5sFwLet4BNBSF6InSPO2\nILPXDFHAAY+DldnUgy0rg1y28cB9vNURGZhdNw6mA9zN9ekQD2sSgVEEOV7DWb7egWc7BIorHjEO\nK+ZcLZi2N2HcrENQqcdgiR49+XXINNbhdrsKMc1yKB8UwXg7B\/oYoSLqelv1CSKnJ6BJyvC38TIr\n\/C6+6YbDx\/uHBmZ3gyCd2N9w4YmfFdUzif3uKR7cBEVXAqMwpxOn\/dUWbPsrkXhh00sDOKOyY7LG\njNEqE4bKDBgoaoA\/V43cehVumBS40liFyiwJDDfF0F15EIqKaZLfutVWizh7PQ7LnNVnQXGvAxQ3\ntPn6oJNNITsNph14NOLBXtcQ9jtGse8a5WHsOtjkbpEOwdpebsL0fB3NBys8FRZ1nZjVODCltGBM\n1oqgtJm715uvhVdUC6mshpf3coMUohwJmm48RP3nGYi6oq9S3GhR4Lsu0rBQL9KmtPkqg6QyUS9t\ns56k4N21DWHXPszl2V7mQKTWFxsczPjlKgxfLEMfXkTQ7scch7NiXN6GkXodAgYl+vVydNdUoUsk\nh6qgirt3UVsGoSiPyou6SwJEXdJJ3VR3cpHG\/LAXqdQDjQ4OSeWhcq+zyT4E3TIPYPu1+mZn0PJs\njUORYwTW+GQJusfz0O7OYtDsicApTRhx1WCotwwD3cXo6cqHzyVGZ30u6kRSXNZJcU5djEyhmLn3\nAOoLqYi6oC3F542VuN5Sgztm9VGpCdKjt\/CyUO8sNbh5yVcMPu4oxRAB0yD1Bke5U6SG\/YUjMM3O\nNFSbE3C5vBHnvgPX64nAue1ZcFbmQiUsxfm6EnyiLED6g2zunjI60R0VrSrCxfoyXGmq4k1KpY53\n6DikS9vKe2aS3U8NKXl2UUTMj9VjqamTA5O8AwFoH82gjomg1NtTHEy5Poaa1RFYOtwYqTAi0FPK\n4IqOnONw+ixY04qhyCjE2dpCnJbnIjUtE6rzKaj5OD466mNFPs5pirm9MQY5brYqjyAdKmOkofsr\nMDpYhfGhapZfCkyP1mLG18DPVJLL3wvlxjiXgqDWRlG9EkTVUgDS+X6YrA4ESpvQ3yCH350Hr43B\n6XLhLC+ALa0E7fGFKMrKw5nqPLxf8RBpCQIoPrkf4hl4tkIcIlvPa0r4BBEkOUnldlY1YphN25Cj\nCsN95RgZOASVY4K1AvUVydTbDVloiANVLg6iYmEA5XN9KJn2o3DCi6ZWM\/ok9fDnaeB9qIQ7qxpO\nQSVsyWUcjkI5U5iDDypF+FtpJnKvJUP24b3Iy+27UqHiI1kOjiCZk1cNMtBk06aDxXr+9AGWU0PG\nWgy3qDCi0\/EcI3dJ6j4PSmd6ONAhlGTcg\/xRN3KGO9CsaUJ3jgqebAU6M2VwpElhTS49gjPcFCEm\nP5vDvVMoQMnZOMXRMfdOUcap96TZOISkcl+qL8d9TRXftCevjoNSoEZgGzkwheyhKv1O5I10cuUG\nXRyKTiMKfDqZTOUa7lpHRhXsqeX8rG2LkzC4XJ536uuZR3B\/yU4Mfu9N5lRReoggP5SJQT1Jg1NW\nJOWb0lP7xLUMVs1hKVgJmNRfqOOizDwUhTxBUUxR6Kd6jGhnOUeu8ZKKRDBp4tFcfxuNmuvQie4h\nOSWDw\/0xJyn4tijh+69afypIO3WqOAN\/L8\/ifUDN2pReGtm0Rgi7NhNOnRAuvQhd8hKe\/ATtE6tg\nKdFwEBJFEwFR2FMK3O\/QI8mijYAlF8JUnQRjwx0YtDehV8egvuAWamJS8IE4FX8QJxp\/EO4IMj9Z\nQU9BVqc8FKMtXgLz\/WKY6hLQboiHxZgIqykZ9tYUdOSW8V4iqaUKfgLR1B+KAp+SgA5\/kayKl9Mo\nvf8a7Bp01VdRl3qPB3FcXBJ+L7qv+K+v+kT\/gTA5GCfI4H1BbxPUwMb8NBh1t2HSx6K1KY7Dmmsy\nYEsp4xJXy3g0cZmUfLjoTKVBo6OrIrMAzbfEaEwSQCeMhzYlHppLaag9l4z8ywnht7Ljf\/yPJv1n\nCce0l9ON7C2Cn4UESm8VBkE6mmR3uQNGzR2YhELuCilGK8Vn+gouiilKAQp+OhWuygvReC0bDVcz\n+cFPYBTAik8TIT8TF5SfiT3+k35yqi+kCJQp16EW3EJdUhwaYrL4FxFwBFrEwSUZufi0VoKzqkJ+\n5VJK8HFNPk5X50KcxA78ywJoLjLH4u+g5uFFyLPOheWxn9\/62T\/a5aVnjstKTwflpaehEF+E5koK\ntJ9l8EOcHCZFF2fz5D\/UexXZoDR4t1yIczkZEbeu3kP1w\/OQF54B209SWfn+sV\/0vwsMMFpW8lGo\nJvEq7xv6UtL1tFT8WZLG4+FQdE\/6a04KSi4koPpMPGSJl4Ny8dnoyvcTjv2q\/5+ho0d+Os4oOXsv\nfDY+Fm8J7+Gt7Di8\/TCei\/4m\/S4rNpx5OdYoPx0b\/ZN77Oeu1At3T\/wm9cbJf9dvU6+fiHqz3qz\/\ns\/VPhgh3qSvCgwQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/egghunt_egg_1-1302028520.swf",
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
	"egghunt",
	"collectible",
	"no_rube"
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

log.info("egghunt_egg_1.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
