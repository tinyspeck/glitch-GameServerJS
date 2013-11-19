//#include include/food.js, include/takeable.js

var label = "Apple";
var version = "1345744783";
var name_single = "Apple";
var name_plural = "Apples";
var article = "an";
var description = "A boldly red and brazenly juicy apple.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 5;
var input_for = [13,74,90,100];
var parent_classes = ["apple", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by apple)
	"energy_factor"	: "1",	// defined by food
	"apple_size"	: "79",	// defined by apple
	"apple_color"	: "#00ff00"	// defined by apple
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

verbs.lick = { // defined by apple
	"name"				: "lick",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Licking an apple is impossible",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Mmmm, \"Appley\"!");

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

		self_msgs.push("Mmmm, \"Appley\"!");

		var pre_msg = this.buildVerbMessage(msg.count, 'lick', 'licked', failed, self_msgs, self_effects, they_effects);
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

verbs.eat = { // defined by apple
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.isOverDailyFoodLimit()){
			return {state: 'disabled', reason: "You can't eat anymore food today."};
		}

		if (pc.metabolics_get_percentage('energy') == 100){
			return {state: 'disabled', reason: "You already have full energy."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//pc.grantAbility('apple_eater');

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply('well_fed_energy');

			return true;
		}

		return false;
	}
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getFurnitureBaseGeo(){ // defined by apple
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': {"0":{"platform_item_perm":-1,"end":{"x":13,"y":-18},"start":{"x":-13,"y":-19},"platform_pc_perm":-1}},
	         'walls': null
	};
}

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Apple a Day buff (an additional energy boost at the end)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-22,"w":19,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKY0lEQVR42sWYe1TUZRrHR7wgKAhC\nwMAAwwx3mBluAsrocPFCImiQlzC1VARveCm1XS2sVjM1KctaVlo0bb0leE+uI4ZiIE4KKpIu5in3\nUns4tfXfnvPd53l\/v0mgkdzqLL9znjPzu8zv\/bzf5\/I+7ygUv+FRviNt3sHXk83lO1JMiv44lh51\n8e\/r\/p5XjJb8nJBORX8dDLj4sPtD1XlxURSeyQosVvTnUXDQ3Zx\/0MVg696rS2LwbGagqX8BD7kX\n5e1z7+LP3i5\/rTC2\/wEZatF+t65nS92wcK8b5peN7JxbMrL46Z0uhqKCqP4H5GPxIbd5DPhUsStm\nbHUVn7O2u2JFfnBXvwLWhgX41+nUJrZ1mzwss3eORM4mF0zb6IInXnbBM0v8sCtJXXY6UlV0kux4\npHdRRbhX0ZFwj6JDoe5FH5LtDXFZ8X6w7Rj+hVBK\/2q9urguKqDLHKXFObL66EBUGjTYMNETs9e7\nCkC2mas9sT7dH6XB3jgY5o0jiRGoSB+DyowknEyNxoGwx7A\/1A17Qlzxnta5c4d66K9T+2xEgKHG\noO40y1CfRAehISYYF2Srp\/PyyADsTvLFuykqbJmlxFtGDcpCfATk3hBvVET44FikN46Ge+FwuAf+\nEuqOD0JGoizYBbuDnPGOZtgvK0uVevW8WkOAUOw8wTFQY0wILsWG4tNuxud8\/SLdbyBgnog5SoMa\n+m2l3h9ndL44GelDoEocCfckZSUV95KK7wePQEmQE7aqHS3rXBUjHhmuSqcy8QCsHKvGcAzSFB+J\nljHRaIkLx7X0ZPqMwGX63syWFIXGuDBZWQmy2qDGWbJTBHmcII8S5GGC7K3iLu0wrFfZW7ZoHgGy\nWuM6ojpa01mfQIONi8GnaYloSTehZWwsWqeMx43syWhLM6I9JwNXE6PQmjoGlkQDrmWkoSk2TKjZ\naIxGPYHWEWTtGB0+jgqQVCRXd1eRY7GUAP8YOBzbAxzwgs\/gskdwrV9RvdGAxvEElpOOqzOzBNyt\nvLm4mZ2Bz5\/Jxd3l+bg1OQ135j2FG8mj0fFUDq6l0POkMENeyUxDY0o86hMjURcfirqUOJyO0eB4\nlJ+IxUNhHqCM7uFmVnGD7xCs8RrUd+KQel2XnpiIy08+jpasNNxcOAfXp2fiTmEBOlcsxhcrluD+\n+rW4My0DX61djdtTJgngmxmkbk4mroyLgyVrAj5NTUDD2GicT41HrVGPKqMOJwz+KDf49UiWP5Ob\n\/0SA7wYOwxb\/oVjjM8jcR9b6GM6NJfUykvH5q+vxnx++x7+qz+LrIwfQ+\/h3bTW+O3EMXz23EvcK\nF6Nz8QLcIiXbsibiKrm\/iQDZCxfSjTCbYlBNgKfjAnEsWi3FIbn5AaCzANwWMBRrfQZjnY\/C8FD3\nmpN0uJRhgiV3GlqffhLteXPQseBp\/O3tHfimrBTfVVfhe4L7oaYa31dX4tuKo0LJLwoW4M6COWif\nOxOts6bhStZ4NGem4sLEMahPHYWasXqciQ\/GcQLkOOSauI\/i0Joo71EcvqWRANd6DyqyraDOv6I2\nJgjNFHuXp47H1RmZaCe465QAd5cX4M70qbi\/ZhX+uW4NviH7es1q\/H3lcny5LB938+fj9vzZaJ8z\nA22zpsKSnS4AG1JGoZYSroYVjCUF9b4PBXxb64C1qsF4Tjmw4mGAZi4vTdmT0DTJSNk7Djfn5+Iz\nytLbNPCtlCTcX7Uc95fm437uDPxjZSHu5UzFl4sX4m7ePNxIT0H77CfRNjMTLY+b0JSRgobkOFFu\nqskzpyj+KvSqvgF9GPAhcfix3s\/CgI1TknGJysvliUa0zsiCZVQkOnJzcCMhCvfIlXdzstCZOg73\nlxXgdooRnbnTRUZfi9ehbWo6LI+noCk5HhfJtecp\/qr0alSODscJKjXlOp8eMVjWLQbflF28WjnQ\ndld+RueHKprtJ5R5F02xaB5PNW7SOFGQ29KS0Bavx+3sKegYl4COxBj8dfo0tCdGo2PKRLQT2Gc0\nkc8mJKGZ4C6Z4tBgjMI5qoO8onxM7n1QrG1n8Ta1DOg9EDYBT1PF55dxHTwfGyKKdDOVjWZaIa4Q\n5NVROrRScb5hShBqXh8dTdAG3JycimvJiWIiXAcvjdbj4tgYnIsPE3XwLL3zlJ5XE+8+6+Bmf3su\nM1ipHGjbxad0KnqZH2rppbxUNYzRo5GMlzlezhiSVWJQdieb+D7eKJY\/60pygQr0J6N1qIvWkkc0\nYM9Q+\/WT9VisJATIK8k7Wkds9BuC5\/sCJBeYeXGvjg8Ri319LHUtiTrRCIi1mAB47WWlrsjGYC2J\n+gdw9Cyrfy5OeodQ72fWYilBHPE7zmDvQSj0snvFJuCxSGWFUDFGKwKbu5n6uNAfG4bu3QwDsVk7\nmot0j1ux86JR0KKG1OvdzXxE7rXVzXD87ZCLNAMu91TMtwnI3S\/P9BS55CytnZwwdbFBsNUPXpSN\nv\/M1vldPz9X1aLUk14p+MELuB3uVF6t7N8nxt4oSZJG7IsYm4OFQdxPP9ISA9AWVHVRRJ8ID8sAC\nVIZlpepl456RY5YV55pnhWNv8ITLH9ILWrOX65\/VvSuVA7r6bBY+CvfsYkhJSRXOcE9HA7LLGbRW\nhrUan9fIYFX0HCeZ5FaVyNrucB\/2ij2relvVknpcXpZ5KT7oE\/Bg6GNlHCvlAtJbDMTlhxXhwVmd\nSgEsWaWA8hdqMxhPij0gudUK17PVL+0WeztJvSI\/Sb1VSjss8VBk9w1IOy6uU\/xiHqAiwluoeVJW\nlGElYMlOCyhJMQbjSbEHpD1IT+X2dHOtNXN3BNiL0sKxt0KpYPfa\/WzTSi8084t5AFZTAlXimAzL\ndkK24zIU32PVORl4cjzJAzbhpLLCruXu5RU\/a+zZsXuLHmlP8kGgi4mDmTNOApUUFbAy8AOTrvE9\nKxj\/hl3K77C6tbtyDLdT40BL2xDJtd52KCT1Fv0vG6c9wS4VXA4EKA12QIZlAAZm2x8qnbO9H+wm\nnukOxqrxWsv7jpJecMUae\/xeZXXtgEdXz3qU0A6LZt7JJYEHs8LuC3ETbmOQ3UEjxXe2NzQjxDNW\nsHe0zkK1NzXDURIoJYTVrQz3ou8DuKVeis5Hir3eR6nWaR4Pwiqwm0qCXPCWdgTVMYIIZgh2nauo\na5vUznLrxBnqjC3qYUKxzf6OohF4W4bbTm7tDkfKYZmH4pf\/FVISOLxYWi+daM\/gRBV\/uAB4N9CZ\nlHASn3z+Ml3fpXUiECfa\/AzjzTheV3ONcxAu3U7Z+gc\/3m\/0hFvooZjwq\/7+YFeTeyzbaLCXfblm\nUQxph+ONgGF4ja7t4j0tqfUS3WOoNwIcafvoQBMZig0qe0oEjrXBopRwIeZaVyjD5Xkq8n6TP5AY\ncrO\/g4UHXU+DM8CLsr0kzvm6ZBt87fGCagjWsdHizyuElKkDeRmjTkWBpZ6Kb38zuO6QW9RDyjb6\n2ps3qAabX1DZCyN1un4EIlsrQz0vg61Q2n27xHNAU76nomkRWZ6HomqOmyLh\/\/m3oeMSpV3+KuWg\nNisUFd1OsuJVXopf\/WfmfwGH4cUy4vYphQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/apple-1334210190.swf",
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
	"food",
	"fruit"
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
	"c"	: "lick"
};

log.info("apple.js LOADED");

// generated ok 2012-08-23 10:59:43 by martlume
