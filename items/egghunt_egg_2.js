//#include include/food.js, include/takeable.js

var label = "Bugsbury Creme Egg";
var version = "1342483399";
var name_single = "Bugsbury Creme Egg";
var name_plural = "Bugsbury Creme Eggs";
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
var parent_classes = ["egghunt_egg_2", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.33"	// defined by food (overridden by egghunt_egg_2)
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

verbs.eat = { // defined by egghunt_egg_2
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
		'position': {"x":-12,"y":-19,"w":24,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ3UlEQVR42u2Yd1MU6RbG\/QZ+BKv2\nz8UVXcO6hjUsJhSHJKKEUclBkoE0OJKzgGREcpAgAxIECSMZASUJAgKiCBJWRgzodXfrue95Zxgx\nll7de+tW2VWn6H67p8+vn+ec0zMsWfJ9+779n2zFWvtUK\/S0hNLDuuJ6I73kFqG+tP2IgbTTxFDa\nbWokvW0mlPaaHeHR52AlfViVKx2vvyKZmuoSjjVd2dJ+4MDSbwoUr6a2NGPvTmGOQF1SpL1fVnFQ\nG9cPH0CTsT7ajhig08QIveZC9FsexV2rYxixNsE9G1OM2pryvxN5iZD90Yt7sz3IfnULRaPViJir\ntw+ZbVz2VWABaquXxqhtD0ves0N2SUMdhdr7Ua6nBakCrv2oAbpNjXHH4giGGNR9WzM8tDPHI3tL\nTDpYYsrBClMuDpgO94HsTj3mZP24O3cbMX+2I\/JFM8Jm6xA0WSUJGru25cvhNm8QRGzbIkvY+Tsy\n9u5GvuY+lOhqovqQLhqMDnLlCK7f4ihXbCLEE9NJ4ZgtTMFcVzWeDTbhxbNhzD8f4UH7z58O4dmT\nQXQ8u42o+RsIf9KAkGkpAsYq4DtULAkYzv086z3XrxcG\/7YJ0b9vRdLuHcjW2AOJlgYq9LRRa6CH\nG8zOgewYjNYVYGKoCdOPOvF4ugdPHvfh6ZMBDvLyxQhezY\/iXy\/v83jO9idejWBofhCNL3uROd+O\niKeNCJ2RInD8GnxHSnH2TqHsTHee4JNw7qtXC303\/opzWzcjVm07UvbsRO5+dRTrCFCpr4MGw4Pc\n2mFpHsYftGJy\/CZmJrswO3Mbc7P9mHo6iLH5IfS\/voe+vx6g++8x1OIBKjCCyxhAGm4j7u9biHrJ\nFJxreAvQs78QDBCu7VnCD8KdWLVqmWjtGhkBhm39DXE7tiNNfRfyBHu5vTXMXqq9W8cM0e\/jqgC8\nhfGpTuQ8bUXM6zYkoBOZ6OUwJRhCGYZRyv5KMIgs9CERXYoabGEW1zOLa+QWD5fA844EHl25cG3L\nxOmG1PchnVauFIvWrYXfxg0IZ4DxDDB97y5ef6UHNHlzNBsf4l1LtTdWmqFUsHj2Bk8a87od8Qwy\nBT0cNJtBERgpR3Cxf91E1KtWbu+5x7UIelQF\/wfl8L5bjLN9BRB15sC1NQMn65JlTjVxqu8CSgiQ\nFHwXsEwB2CKUAw6wkXLfzRGPHt7E9GQn7s8wZWQNvDujGUDsnze5lQRLEcv2CZ6sjXjWxDuY1At8\nKLfXa6AI4p58uN+6BJeWdAaYBIfKuHvmlfFvGsdp1Uq4r1uDBYvjFRZ\/SEEOyMbK5IVzmJrowB\/T\n3aieaeWJSZ3zz5sROd\/CgShon9ao7pRw45XwG72qVM+jU2FvYypOXE+E\/bVY2JZGipWADitV4bZ2\nDXw2rEfoFnmTpKqzJllUg82sBjuoBpnFNIhp1s1UXuIqTkx3IWKyhhc+2UcgVGcUYbJ6vkbngier\neWMQnM9QMa89ag73m9lK9RyrE2B3NRrWReEy89wAuYp2qivgsmY1vH5dDz5m1LYhmY2ZHNbFV3T2\no4q6mM3Amwywz90RIxdCMVYvwcRYG28WqsWeyXZe9EETlby+CGYhgiaqOBjVHNnqffeKHE5hLdXe\nqYYUOEkV6pVEwrLgHExzguUq2vz0k+z06p9xdv06BG7eiPPbtyBxlxqydTRQamcKqZsd2tLC0VOX\nh4HeSgwNSDE61ICx0RYlJClZPlbPAUgh\/\/vyoH2\/0TIFWDG82Eg521sgV04Bd7oxhVl7kdVePI6X\ncfVgkRcCk0x\/GQe0Wr5ccoLV4buNQnVYFeuDtuY8dLQVorujBH3d5Rjoq2KQ1zlk33A9cvvL4XO7\ngCcmZQjCa7DoTbBjWhf3XuZg1LFu7Vnc1gU4x6p4bq3NlQhYXg6F2aVAHE33hXGSp2CJlYqK8D2b\nF71N6rIj0N6Sj472ImQ1ZCOxMRvBDRnwbEyHc1MqXG5k8ISkCCWnmUYgC0HHtE7nORi73rkpDafq\nk7mtpByHKz7PrTXLCcKxDD8Ik71gkOCRvMT8hx+WMhVlp35ehTO\/rIP\/JjYPty3qZj1NNEriGORl\nVDXlwonZYF8Ry5+aElBxkxLOzWlcFbKNulIZrZlyKHaeOpXAuGqsIajmjpdFwZqUY3DmuUHMWj8c\nSfGC0QUxDke7dXCbLZcvF9urqsJVoWIQUzGKqXhxtxoy9+2GRF8LjYVyyILaTG7F8dIo2JXHcAWc\nai7wEXGy9iIHJojFQWsERdctgC2oZl3Iak5hKymnhIt1x8HzzuCACyqeZCou1CK9l2MUHU1WF+pr\no+lqEqvJfGTXpPInpienrqPiJlhKzAYtV3ch6AFojUOxa0gxDsaaQa5aMEyzA3CM1RzZanThDA7H\nyOEOnDsJ5Ty0+PFHwfEVK0AdLWZWByispnczfXmg74bF5sZoqk5DK2uczKpkmOcF86K2koTxhKQs\nJSdoNmzlwfZpjc7RNXQtKcbBmGrc0lRvaggYJhCcmxwu9AS0Ax3w1muPOpoGN1ntvXUTLp40RX60\nB4riPFGa6IuK5EBcL4pFU10WWhouIaY0DiZZ\/jwR1Q8BW+SHcADLRcHX2Oiga8hK+gy3k4EJGRhZ\nahAnwqEoV+iFn4YuwQXYQ+BtK3sLkFutotJBrz96uyQ4m6EwPxQlhREoL45GZVk8aq4lorY6BfXS\ndA7qlx\/G6sYbR9N8uE2kCJthHEIZmXIgGh10HVlpfPEst5ODRbspLdUJdoSWvx2Ds4GGl5XkvW83\nFioqqlSPC5Dp510gYU+fnxcKR1YbdjEiGLI1\/UgXfmNKYJjgwZMZJYp5YrJLuCjomAOx82QjfYbq\njBQjML2wU9ANceKWavoex34va3l4Wn34O+JiSNHG9UiLcEEBm09xqb7Q9LPjN6Ib0hOTJZREDuzK\na4iSUxcqg47ZOp2n6zhU+CmFYk7cTk0\/BsZUewNnLVMLMP\/4z4EFSEdWkzTE493Nkc+6LYgpRTcQ\n+NpyKwiWbOHArHY4NFOEAJQRJoeh83QdXU+f41ay+yihFsfH1PsQJL1pqLsjbA2Qk+mLgHgRdH3e\n3JjqhRKRCpRUiymivSjomNZJfbJQ4PMRqDdw9z77lx5B2m9YK3PZvRUee39H8DFdpCeIEHtRDB0f\nm08n+g9Dw9Pqy36S+phoLws\/Y9qRGHsKyQmuSE0UIT3pDBISPWAV4vhtAT\/H2o9tfha6YZFh9giI\ncEJQ5EmIwk\/AOewETALt\/vdwC9uZg7sEmu5mHd9WNWuZhqe14Jv934YG+mE9dbFAZCb76nrzsk7+\n5Dj5WlALkYk9JfnCJpCyt0SYuo\/Nsv\/av+dIBWaV\/X5vazEBc4jFwYDo\/D+m1vft+\/YPbf8GdcRd\nop1q7TEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/egghunt_egg_2-1302028131.swf",
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

log.info("egghunt_egg_2.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
