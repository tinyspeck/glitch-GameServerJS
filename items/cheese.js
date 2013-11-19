//#include include/food.js, include/takeable.js

var label = "Cheese";
var version = "1354601494";
var name_single = "Cheese";
var name_plural = "Cheeses";
var article = "a";
var description = "A nice wedge of holey cheese.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 15;
var input_for = [4,6,10,11,14,18,19,21,25,28,29,36,42,82,97,99,100,102];
var parent_classes = ["cheese", "food", "takeable"];
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

verbs.age = { // defined by cheese
	"name"				: "age",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Add some stink. Costs $energy_cost energy and $mood_cost mood per cheese",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var energy = pc.metabolics_get_energy();
		var mood = pc.metabolics_get_mood()

		if (energy >= 10 && mood >= 10){
			return {state:'enabled'};
		}
		else if (energy >= 10 && mood < 10){
			return {state:'disabled', reason: "You need more mood to do that."};
		}
		else if (energy >= 10 && mood >= 10){
			return {state:'disabled', reason: "You need more energy to do that."};
		}
		else{
			return {state:'disabled', reason: "You need more mood and energy to do that."};
		}
	},
	"effects"			: function(pc){

		return {
			energy_cost: 5,
			mood_cost: 5,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() < 5 * msg.count) {
			pc.sendActivity("You are way too tired to age that much cheese. Maybe you should eat something first.");
			return false;
		}

		if (pc.metabolics_get_mood() < 5 * msg.count) {
			pc.sendActivity("You are way too depressed to feel like aging that much cheese. Maybe you should drink a tasty drink instead.");
			return false;
		}

		var duration = 3000 + 1000 * intval(msg.count / 4);

		var annc = {
			type: 'pc_overlay',
			uid: 'cheese_age_'+pc.tsid,
			item_class: this.class_tsid,
			duration: duration,
			bubble: true,
			pc_tsid: pc.tsid,
			delta_y: -120,
		}

		pc.location.apiSendAnnouncementX(annc, pc);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);

		self_msgs.push("You put the cheese in your pocket for a while and it ages nicely. It left a bit of a smell in your pocket though.");
		var val = pc.metabolics_lose_energy(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		self_effects.push({
			"type"	: "item_give",
			"which"	: "Stinky Cheese",
			"value"	: msg.count
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'age', 'aged', failed, self_msgs, self_effects, they_effects);
			
		if (this.isOnGround()){
			pc.createItemFromSourceDelayed("cheese_stinky", 1 * msg.count, this, false, duration, pre_msg);
		} else {
			pc.createItemFromOffsetDelayed("cheese_stinky", 1 * msg.count, {x: 0, y: 0}, false, duration, pre_msg, pc);
		}
		this.apiDelete();

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

verbs.sniff = { // defined by cheese
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Inspect with nose. Gives $mood mood and costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_energy() >= 6){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You are too weak to do that."};
		}
	},
	"effects"			: function(pc){

		return {
			mood: 10,
			energy_cost: 5,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// this could/should be converted back to a simple verb

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("It smells fairly nice. It might smell nicer if you aged it.");
		var val = pc.metabolics_add_mood(10 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}

		var val = pc.metabolics_lose_energy(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		if (is_chance(0.3)){
			this.apiDelete();
			self_msgs.push("The cheese was destroyed by your intense sniffing.");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this from <a href=\"\/items\/55\/\" glitch=\"item|butterfly_butter\">Butterfly Butter<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-28,"w":33,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEYUlEQVR42u2YaU8TURSG+Qf8BH8C\nH42JBmPQ4hYSlwTjQiAGt5hqiJpoIhpFEUoriAFlqUQkQU0qrQYQZITigpRWSpG17aCG7p1S8PP1\nngszzrQz0xko8oWbvAkUCs89y3vONCNj82ye1Mdn0xXM2yopkG+kwuizV2RvOFTUVp45P1Jp8Dv0\nTNhVixZmmzgxU09RyFljmrfrtmwInN9WofWP6LzRiTr0Z+65pJjJeibs1Of951RWELAlb4ssHCuI\naPC7wQgRXzewgL0qC8AglYueZ4rA+ILLBEYfUusCCXCR8ceMErAYjmxk1IACX++g+HRDEiS+oCOt\ndYlrKC\/uMTJyUItuIwGi311AbtNpgcL2yiTI0Ngjb1oiueBuKlWSvl89JRzQeGs+J\/jeYz5DLpD4\nHhxJBjKzavuIzTSalNbXVPspZNVlow93twr0Sb+LQDKuR6Lvw43DqE433Co0VsOoaYAB3c4kOFYj\nTw5KApLG+a53qIID05WyD6in+f4bpAn4r9N91yUBP1fvkb1c3N2M\/I4qozKPwyNKznihntj68nRe\nEvzMN1SOnG0FaLjhkEBBhz5lBpYh9dqUgMHufMov8wf5dfbxwQ7VXkgmC06323KeXJbf4QAJQ0Da\nTix7siKWXBTsLUTY88S71XobTZkvEsHXqwGEqLKXnHlzVuih0w3SnR0xawwASCA\/noNfXhVAKvHr\n9Uv17mSjx5CiHhk2axwsIAsJYRf7J2DKrtZj6FvdfhRdiTZMEGgg8ERWiSbNavx1MYmkp+eqxOxu\nFE6b6Lt9W\/hwrEJUsSgkGK+rvQjZW\/K51373XePMerT5MOp\/sB1R97Yt1xfOBlwqOHxfcaQjP+qo\nf9F7m1sgBkgg+4rINqJkmoy1HCVgiY3k+3QLDdVqiHF7318Rj9pMI\/FM\/9cy7jW8Ty7bT9iiMUkB\nEsieEyg6WS8LONd7TeB\/g4YcUm9q6nO2q4QrGZIpvJyA9UGDMHKABLI7H4WdBtkdEDwP\/BCUjoZa\nottRjO5jMlLBcZCdR1DAVibZPOnUIm3CcFasAUpRBFmF3x7AdXJT0iuTin1lNwRJzWQZOGbptzUr\ngzHvzVYDCQpYL6Ogs1pyuwaYuS5t0n4IoArhHChqyxRYTdicS6mBBK\/02XVJKQdbgVEGQBNtx8k6\nxoeU3G5IzYnACQwbLEdFNGE0+obvkcdMwbzFIGArbFeDzbCgiVFcol+gOG1h4YyScFw0e3IyIxaN\nFkfUq7R5+JBg5BMvC5NWLzDuxAgu0q8wFMXBqdusVYCyzcNCgvGCD\/KXg7G2k9wuCVFboDtXwKxo\nYc6qXdvDU4cmL1WNEsjBqyjVw\/xyrVEcXPznQPoe7Mnchs1Hpk7JyuaqFl9O6Q4ODKfUS2xkXT6X\nIenPLZVKP9RlyF4umDz8lGKZUjZD2p6dIf0i8xxSHhwsQbGZZiZGf+DXW+nGfNpF1jZoKuFuGR0q\nW\/+UrgWWGW3cuKhtns2ThvMXrzUB5FKovywAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cheese-1334340184.swf",
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
	"g"	: "age",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"c"	: "eat_img",
	"v"	: "give",
	"n"	: "sniff"
};

log.info("cheese.js LOADED");

// generated ok 2012-12-03 22:11:34 by martlume
