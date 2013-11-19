//#include include/food.js, include/takeable.js

var label = "Camphor";
var version = "1354597656";
var name_single = "Camphor";
var name_plural = "Camphor";
var article = "a";
var description = "A small pile of bitter camphor.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 20;
var input_for = [44,71,75,328];
var parent_classes = ["camphor", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by camphor)
	"energy_factor"	: "0.05"	// defined by food (overridden by camphor)
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

verbs.study = { // defined by camphor
	"name"				: "study",
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
		} else if (pc.metabolics_get_mood() <= 2) {
			return {state: 'disabled', reason: "You are too depressed to do this."};
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

		self_msgs.push("Camphor is bitter, but knowledge is sweet. Slightly sticky, too.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give

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

		self_msgs.push("Camphor is bitter, but knowledge is sweet. Slightly sticky, too.");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'study'};
		var val = pc.stats_add_xp(2, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'study', 'studied', failed, self_msgs, self_effects, they_effects);
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
	"food",
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-27,"y":-16,"w":52,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD\/0lEQVR42u1VTW\/aWBTtDxgp60oj\nZTfbLOYHdD2rrrvKrtKs8hP4CVlXGgnNB5tqFNIAIQTwIw4QwIADGIMB24CBxBj7pe20adqR7rz7\nEhMy00WlmZFQ5SNd2X7w\/M4999zrR48CBAgQIECAAF8FZrOrXRZRc0S315UgYGj9S4jE5J21Ioeq\nVRQXEjkNDkUdftmXaLrqbawFOdXwNq0JhdGYAqlewkl9DocFC44lO7oWBAeGR3L1BUSzPdjPdkHp\neyB3XEjmR7BHNO7HnuGSds8m6YIWSqf1\/0dZz4PNe79db+omDYmyE06eaJAuWRA\/HcHPe2UonU+5\nF\/czKvx2UKNZyQ5R+hEwREmHmNAyfZLsnRv\/BbEN9vIwHnBhv4MYaUWn0ysyMClgaU9rE0gVLWhq\nHtRUF1BN9KNmeFBpXkDqzIJi3eQRJwrup4msypM1x3R5\/8UQKzoZDD3AkmSKvR1Fs3cbnQvASBe6\nkCkOGJkFlJoOlFou9x6SQXKoXKo44h4k5SEcn2rwMtkCWb2EpNiBeK5t+oQo\/fOpNXsDCdIOrZ5P\n6acn\/yDN1NnBDXgfFxSCmd6FzDLeWXkGoTKGetuG1GkfJMWBvbTKyDnwigy4cvnqkP\/WGXiA5Y8e\nN0E3HUDFMRFRdnexw9EypNQP43k+D1ahUFd38Jz7WTowvWdsTFCh1OcEOSG2KSmqMitBtN60fsCy\n3BJsQ0ayuULoueyZCWLF4IFKoYpCeQKRVxJT9pYsqiorU6707ykFBkMKfWNharoTwjNRLSRbUyZL\nER6oWpKHBwmhFVlRc7vRd7\/Fq+t++ETOemFcJ9XFtlBbQL7hQlnxwBi\/hSOmFA7mc8XiDSIpNicV\nF9qgDRx4eSjzZjkgPZ5QRprLzuKGNwzaCC3DCO36HkeSh4L65LOdflvmjxTVPBLVx6PJ60i1aZnj\nyesJpTfR+fxa8LsRiStd2xElc4qli2Xb5q\/7UjhZsEJxosnz+fslieRJhzWLLavqbJOcadvYyXfE\neMMgmenlHyb6EdeRoO9Fw6BbK916Y+LBmbzWxOdE5vy7uND8Plfud\/OSQXOl\/qRQNbu58qAdF1pV\njGyxdzT627dXH9Lw0LqCSmPMGkMF9BQ+M79xbyEBP1jiW+X6ZCshtJ\/65cV1e\/6eNypLILx8MVv8\n4B++OmISpBVia3os22r4xPyYXbx91zdduloSNue2cNbxA5mX0dO+h\/F6X7GbLawYKr3aKNxO2Dx3\nhJeLKVH9iSn2gsXz2xl19SMqyjcQ5Zt4tkmW5Ng9+38Ey4XxoOsYkLBfqtXn1USs6Zuws7jGcfZQ\nqS\/FXYmfr67Fs41nGEj4334AMKnPdm2AAAECBAgQYK3wF9GkUnPd91XMAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/camphor-1334275007.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "study"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"u"	: "study"
};

log.info("camphor.js LOADED");

// generated ok 2012-12-03 21:07:36 by martlume
