//#include include/food.js, include/takeable.js

var label = "Stinky Cheese";
var version = "1354598438";
var name_single = "Stinky Cheese";
var name_plural = "Stinky Cheese";
var article = "a";
var description = "A lump of cheese that's been left to stand around for a while. It's what the French call 'ripe'. You could age it longer, but glory only knows what the French would call it then.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 21;
var input_for = [339];
var parent_classes = ["cheese_stinky", "food", "takeable"];
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

verbs.age = { // defined by cheese_stinky
	"name"				: "age",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Increase the stink. Costs $energy_cost energy per cheese",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_energy() >= 20){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You are too weak to do that."};
		}
	},
	"effects"			: function(pc){

		return {
			energy_cost: 10,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() < 10 * msg.count) {
			pc.sendActivity("You are way too tired to age that much cheese. Maybe you should eat something first.");
			return false;
		}

		var duration = 3000 + 1000 * intval(msg.count / 4);

		var annc = {
			type: 'pc_overlay',
			uid: 'stinky_cheese_age_'+pc.tsid,
			item_class: this.class_tsid,
			duration: duration,
			bubble: true,
			pc_tsid: pc.tsid,
			delta_y: -120,
		}

		pc.location.apiSendAnnouncementX(annc, pc);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);

		self_msgs.push("If you concentrate really hard on it, the cheese does indeed age.");

		var val = pc.metabolics_lose_energy(10 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		self_effects.push({
			"type"	: "item_give",
			"which"	: "Very Stinky Cheese",
			"value"	: msg.count
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'age', 'aged', failed, self_msgs, self_effects, they_effects);
			
		if (this.isOnGround()){
			pc.createItemFromSourceDelayed("cheese_very_stinky", 1 * msg.count, this, false, duration, pre_msg);
		} else {
			pc.createItemFromOffsetDelayed("cheese_very_stinky", 1 * msg.count, {x: 0, y: 0}, false, duration, pre_msg, pc);
		}
		this.apiDelete();

		return failed ? false : true;
	}
};

verbs.lick = { // defined by cheese_stinky
	"name"				: "lick",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Licking the stink is unwise",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_mood() >= 20){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You need more mood to do that."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_mood() >= 20){
			self_msgs.push("Awesome. Now you have stink-tongue.");

			var val = pc.metabolics_lose_mood(20 * msg.count);
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

		var pre_msg = this.buildVerbMessage(msg.count, 'lick', 'licked', failed, self_msgs, self_effects, they_effects);
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

verbs.sniff = { // defined by cheese_stinky
	"name"				: "sniff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Purely informational",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Yup. That's stinky cheese all right.");

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

		self_msgs.push("Yup. That's stinky cheese all right.");

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.eat = { // defined by cheese_stinky
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.knowsAboutEnergy()){
			var energy_needed = pc.metabolics.energy.top - pc.metabolics.energy.value;
			var energy_gain = Math.round(this.base_cost * floatval(this.classProps.energy_factor));

			var gain = energy_gain > energy_needed ? energy_needed : energy_gain;

			return "Eating gives "+gain+" energy";
		}
		else{
			return "Yum!";
		}
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

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.parent_verb_food_eat(pc, msg)) return false;

		pc.sendActivity("Stinky Cheese? Not bad. Would have been better with some stinky crackers, though.");

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
	out.push([2, "You can make this from <a href=\"\/items\/135\/\" glitch=\"item|cheese\">Cheese<\/a>."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEg0lEQVR42u2Y\/08TZxzH+Q\/8E\/gT\n+HFZsqXJ4iyTLMa4RLfFVJ1Rk7GQuMzKnMOOwSBzdGYSNM7VqCFLpqlpxwRL78agfOtYBcdwSq\/0\nrpYvtjxQWPbjs+fz1Oe4691zdwU7fuFJ3r9w3N2Lz5f353NUVe2cnWN\/UoJ336xwVgQlxbOBlNDo\n2naoZMS7i8A0zQ1+jhYfdmD0+Iqq3J\/f4bnYhaAUPVe9LWCzYqNHGvgMLU19i\/9J3+JqadKP5Jhv\n3\/8GB2AkjalsvA0XZq9bwjFBROXhL\/wVBZMEbw2BSygjzY7BtIJ7lNGWQIUaoNGVGW9FEAk7kJWZ\nLpyf9OPF0Wa8lgzorq1JN3D293YRSuSlwSnDPtfyTBeyggIQAJrr+RAng8dVSaGTFNgAGW9PvBTI\nzFirHx5oB5fubdCBlUKa3Tc\/cXHzkHAjpMIOjjYAsRMAGbn0Jo5++YpOE1ffptfgd8zuJY1TPiQ0\nQzrmQ07gWASHL+0xwDFN\/nCACwjvkGMXAmXBgeny4FgDlL5wTviUCxjreMPQLLpnPrmGU7+d9zv1\nuCBMBF6koJ6mbx+img3X49Wn32\/U1Fgbnur24F\/bX9cB\/h36yL7zCWR6yOexb4q+owkSQe6Dpm4e\nUl8MIOV6IavZjODFSuRjmg1dJK3m93LP3up8uBYrD06QDvvavPNIlCAiIGXQtynAievv4IH212jq\npV8adNfy05cRlJkpYD7sbgBABpn\/q3NTAHaCP45lYbyrznCdC5kLuRMMEJTp+4CG3XQBiH+Fn9w5\nRlJ+UB\/hoSaaOqbcH8ZMQN2OdNZRwMSNg6bPX3j4TUpnPyy9pZp\/cMQUEupotHMvHvLvVn+WHTin\nmjNYC6QQROcweQbcUzpVrKSbNrmfaz1mgKCFvsPcSGoFEZvpfp\/Wl7aL4Ro0BXQ+GLcUOcNP\/93j\neGG0ZcMjmZHnwu4gDxC02PuuLaTcf8bggdN3TqhphQYDLSU6LOtTa12wARGPDJD6qxWtAEHP7x\/A\n+UfWyyl0NutyKxCnWk\/fxih5FwFgyg4QtNSzHy9MtFWku83gVuVevCJHRceAoFy4DmcGvdjJbkht\n48VuCCo4qOUi3I8MLvFvNlpdhUJvuZwCMsh0fz3mjUU2GqFxSlcvM+sxwvXjFSUaxMuRDatB4T01\npV5oJzB0+AQoXS4gUgDD2xF5kVTh5Ch\/eSAvbsqH3MgpZLb3MJaIB2q7HPwOQMBWxNZXqfWMXXZT\nG4KfQ7oNEU\/\/ZA+nGndk965yQOfvv0chtXX59N4pg+0ALABq0wzNUJB78KoiEIlNZS2vdMKE3H4n\noNDhkvAJ\/WBn3gc+qF2\/YLLAOCyNGsAVMqJn098mxVFIlgkbUNo8wmlHHV6QwxRsRRbQluAMSwUZ\ni1a2BJBKtJ67Da2nu6mFMLj1jFBTkW9lak2h2gAP9FnfEYMNaVOqelylT7Gh3A1mUYW6fDZ8ns7U\nNfnei0YQqMdty3+7eFHNxVtQReptK1Et1mrR+FG8mc7UitXblqJKJhQa97mqds7O4Z\/\/AL\/wALz+\n8FCiAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/cheese_stinky-1339640884.swf",
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
	"n"	: "sniff",
	"g"	: "age",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"c"	: "eat_img",
	"v"	: "give",
	"k"	: "lick"
};

log.info("cheese_stinky.js LOADED");

// generated ok 2012-12-03 21:20:38 by martlume
