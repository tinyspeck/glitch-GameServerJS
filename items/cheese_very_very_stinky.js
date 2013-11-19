//#include include/food.js, include/takeable.js

var label = "Very, Very Stinky Cheese";
var version = "1354598589";
var name_single = "Very, Very Stinky Cheese";
var name_plural = "Very, Very Stinky Cheese";
var article = "a";
var description = "This is the very, very stinkiest cheese you've ever seen, or it would be if you could see through the thick veil of tears it's inducing. You can't make this any stinkier. It wouldn't be fair to everyone else.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 33;
var input_for = [346];
var parent_classes = ["cheese_very_very_stinky", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

verbs.prod = { // defined by cheese_very_very_stinky
	"name"				: "prod",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Caution: potential stink-finger",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_mood() >= 50){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You need more mood do that."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_mood() >= 50){
			self_msgs.push("Not a good idea. It's going to take a while for that finger-stink to wear off.");
			var val = pc.metabolics_lose_mood(50 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			}
		}
		else{
			self_msgs.push("You need more mood to do that.");
			failed = true;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'prod', 'prodded', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.sniff = { // defined by cheese_very_very_stinky
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Caution: potential life-altering experience",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_energy() >= 51){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You are too weak to do that."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() >= 51){
			self_msgs.push("At first sniff, this is one of the worst olfactory experiences of your life. On your second sniff, you experience an epiphany, which you forget almost immediately.");

			var val = pc.metabolics_add_mood(50 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}

			var val = pc.metabolics_lose_energy(50 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}

			var xp = pc.stats_add_xp(10, false, {'verb':'sniff','class_id':this.class_tsid});
			if (xp){
				self_effects.push({
					"type"	: "xp_give",
					"value"	: xp
				});
			}

			if (is_chance(0.5)){
				this.apiDelete();
				self_msgs.push("The cheese was destroyed by your intense sniffing.");
			}
		}
		else{
			self_msgs.push("You are too weak to do that.");
			failed = 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

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

verbs.eat = { // defined by cheese_very_very_stinky
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
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
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("In addition to dazzling your friends with your intestinal fortitude, you also reap the very, very stinky cheese's bounteous nutritional benefits.");
		if (this.parent_verb_food_eat_effects){
			sub_effects.push(this.parent_verb_food_eat_effects(pc));
		}

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

		self_msgs.push("In addition to dazzling your friends with your intestinal fortitude, you also reap the very, very stinky cheese's bounteous nutritional benefits.");
		if (this.parent_verb_food_eat){
			var success = this.parent_verb_food_eat(pc, msg);
			failed = success ? 0 : 1;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this from <a href=\"\/items\/46\/\" glitch=\"item|cheese_very_stinky\">Very Stinky Cheese<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-28,"w":34,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHfElEQVR42u1YjVOTdRz3P+hFKrPr\nyNOrruzlvLos85Q76+zKyzot8yUr8iVFmakRDBow1IWwMRGRF5mCwhgbG+AUed\/GYIONIebJywEb\nmFddF\/UXfPp9f\/P38AzwLFO6Op+77208257f5\/l8P5\/P7\/swZ8794\/7xPzhCjqytIVe2KujIauXl\nzDb85tM88K8Du+HOig626wNDrlx4a9UY8pzG9T4TxgNnEerIC\/zrIIPuY9bxy0ZUFe1HyrYXUJEb\nC++lYxwk1VhX8UTIm68ac2rfH3dqV8x2W+PHuk9hyFsKW9Fu9DaHgQmAY4FyCeh4TylC3gKw9gdm\nsbU56HMUosX4bQQYUaNdJfyVboCK3hNIurF7Bgw3NRV0ZlnH\/GG9OWqOTraUAW2rSsa11iwMdeRP\nA01yCLr0o\/eEMdIQ3X3QqWslJoa7S3Ei9T0UajZztvoupsJj2YVO6w5e9H6QmcfXcAzq3a+gumBH\n+CZ8Blx3Zb90V4CRuIPu4xwQ6UgwMewpgrn4ANde94Uj6DLvhcO+Ca3166Vy2D+B1xyHkxkfoUy\/\nHac16yaZ7i6ZoFi6Y6DEFmMqINpIVX5yf0S7BIPNZXFoL92CqqSoiCpPiIJy5xLErl2Io9+u4SXX\nI12bdPy33E25RSEb8uRzvUzV0NS61l6IfocOHuNOmFMejwB3cGM0vlr\/DOI3LeYg1YpVkk7l+iQ2\n\/1JemhIeeiBQtSMQ6jwhuZB0JQdEWddwJk5yqKheewo6zn2B89+\/jNrDz\/EqTV8Jddwb8Ndn4oqj\nAG5bGtfkTI4f85y03hakKTGqtc+2F4PuQrhqNOi+lMO1Ji5SkbcTFZnvoDF\/NZpyl2PApY9wMX2X\nbojAirrapIlwOLl7JoCDnSUgSd0SpDlx7lZqjbtkLW9tbup6mAoUkZpjAJyGj3kLqZ09NQelnBPf\noZCmbBTAxXuqkpw4BP2laLPsRXvt5\/BfOih9Rt8b7y2fOciptVVJcydo4Sb9Mlxu0nNDyLcssRi1\n9mpTBmMiMwK8v0GHH9pyI86pE9Yh0JSLPM2XElBPjYrLhCov402M9hj4Z1S0Xqc1FZQcEQAZMBWB\ns6YtQN2R5zDiypHuSixWrN0JXfIamI7HSueC3cUI+c9IzMkDWxSxq4xfI7FMDBao3kLON8uRp4zB\nKLsGna8ujEM\/kxYNGUGXzjBFe3NHCeB5zYuwpS9EY87rjKlT0xYLNGp5rJCGeu3JMGW\/h4qcjZOO\nZvrqqNvO2+eq3gK\/LX5mvTGjkD6vNGSEDcb28G92vYW2in3wX1DzIGfxo5MzyHVVx5xXo17EQdo1\nizHYcphnlTyg5fusy3SAX1D83WHdzgP6QvFSptF5\/Jp99qRwN+pTca1RJTEur5zEVTzwrWynodaL\ncY12rAiAF44u4WX57gnUHnpWyrT6rCXcPAONafyHUrSwOyfhU2vJQLS11eoXS78jIw258zh4n3U3\nmotj0GXccstMdZ\/7kDG7D599\/OrkBMQG4QgGqQggvYrztvQFMCfPQzU77yndwKIknTlRzdtdmrtb\n2mEoYtqKP+BZeFH7GvpZy28X9PIa6SpCaEq3KHp4\/hGQatWTvKjFVAJgS\/7bqM14OuIcMWrIeBfN\nlUrJ7XLX365Im1PDXl4\/\/lCN0c5T8BkVo3OqEqN0AiC9UnvJMAKMy7COM2pnzJiTH5sEnheDay2Z\n3Jm3WohkQEWJkJW6ecZ5kYoGjwEW1uT2nwcuYtxvhN+ogL9SoZpjUT4YTQtSa7l2GAgyiwDTee5T\nHkEE0Joazc9ZmL5s7NxIeyRrIppojybh6xNj+KjlrN2By25mkt6zM94Ij6grZvw60obrPaYwOKPC\nELHNyScRAiQAE0BiVNKl8hGWl4v5DfgqY6dNOQSyv\/0EyjRrcHjPqyhKjYGzbDMzymdwXdrEw3kq\nwBtXbZgY65TA+Sr3bZ22m4g8FCB4sfdthe+iXrsUNUyHQgLcTIxFMs5wWybfpuQL2k8r2Iy4BzXa\nGDQfX4auik8QqI6F+\/xG+BwHIrbEn\/rt+ON6NwcXqDo4HdyUgWEF7SwMrFXOKLWcRw8DzQEyBoVp\nKIaCLi1oRKOQ5U95J7ZNmxEJqMu+AZ6WXaivVEt6mxjzoL8xe2bmbjd+CQNRu8lE9EqtJS0SSLE4\nMUmmYeMa2KMoRrzFfLcQsVOmfAr1Z1fyIA84jnD2Lpp1uNFn46z5KxQTPaZ9d\/ZYakl48CVi1JQU\nFRBtF1vj1CmaylmwmoPkezEbTJvKDyAzZQOy0t6Ht\/EQnHU6\/DrcKrHGwRm\/vjvPKFyrSQ\/HW1Lm\nT9CuI3QpMXkzS4nNYaeWDRQsOjwlPNTP6WMx2mvBLwMNuFKXFm5phSLQY9kffdef8kirZBRqtUU2\n6hNgHkWMaWp7x+l1CDJddtdnM3A2yQgcnFFh9ZkS7t2\/RqqUjxqILXl4k5l4XrKYCmtzPoIdmfh9\n3IvB1lyRb+EAno2DTCQHSCYiRuWtd5xchctW5aTe7tQM\/1SXNwdfFZlJDrru0POz09K\/q1FT0lwD\n7VC29EXWWWft\/vFfOv4EmrOy0hX1vKgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/cheese_very_very_stinky-1339641207.swf",
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
	"food"
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
	"o"	: "prod",
	"n"	: "sniff"
};

log.info("cheese_very_very_stinky.js LOADED");

// generated ok 2012-12-03 21:23:09 by martlume
