//#include include/food.js, include/takeable.js

var label = "Rainbo Sno Cone";
var version = "1351722056";
var name_single = "Rainbo Sno Cone";
var name_plural = "Rainbo Sno Cones";
var article = "a";
var description = "A rainbo in Sno Cone form, eating this blend of all the other Sno Cones makes your tongue tingle, your sinuses snigger and your spine spontaneously decide to go on a tropical vacation to Shimmyville. Warning: Contains gloriously high levels of iMG.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 2200;
var input_for = [];
var parent_classes = ["sno_cone_rainbow", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "0",	// defined by sno_cone_base
	"eat_xp"	: "1100"	// defined by sno_cone_base (overridden by sno_cone_rainbow)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_rainbow
	"name"				: "bemoan",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Grieve, for you cannot eat it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		//if (pc.achievements_get_daily_group_sum('sno_cones_bemoaned')) return {state:'disabled', reason: "You bemoaned a Sno Cone once already today. Any more isn't very ice"};

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Aiy! Wail!! That is an expensive lesson.");
		// effect does nothing in dry run: player/xp_give
		if (this.parent_verb_sno_cone_base_bemoan_effects){
			sub_effects.push(this.parent_verb_sno_cone_base_bemoan_effects(pc));
		}
		// effect does nothing in dry run: player/custom

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

		self_msgs.push("Aiy! Wail!! That is an expensive lesson.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(550 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.parent_verb_sno_cone_base_bemoan){
			var success = this.parent_verb_sno_cone_base_bemoan(pc, msg);
			failed = success ? 0 : 1;
		}
		pc.achievements_increment_daily('sno_cones_bemoaned', this.class_tsid, msg.count);

		var pre_msg = this.buildVerbMessage(msg.count, 'bemoan', 'bemoaned the loss of', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by sno_cone_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "You saved it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()) return {state:'enabled'};
		return {state:'disabled', reason: "You can't unscramble an egg. And once you drop a sno cone, you're out of luck."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.takeable_pickup(pc, msg);
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

verbs.drop = { // defined by sno_cone_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Think for a sec: drop a sno cone?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_drop){
			if (this.parent_verb_food_drop(pc, msg)){
				this.apiSetTimer('onMelt', 30 * 60 * 1000); // 30 minutes

				return true;
			}
		}

		return false;
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

verbs.eat = { // defined by sno_cone_base
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Gives some iMG",
	"get_tooltip"			: function(pc, verb, effects){

		var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
		if (eaten > 3) return "Careful! Eating this might freeze your brain, which will cost you all your mood!"

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.stats.level >= intval(this.classProps.eat_min_level)){
			var brain_froze = false;

			pc.achievements_increment_daily('sno_cones_eaten', this.class_tsid, msg.count);
			var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
			if (eaten == 3){
				self_msgs.push("This Sno Cone almost gave you a Brain Freeze! I would consider carefully before eating another one today.");
			}
			else if (eaten > 3){
				if (is_chance(0.5)){
					brain_froze = true;
					self_msgs.push("Aiiiiiii! Can't… feel… my brain?!? Brain freeze!");
					pc.achievements_increment("brain", "frozen", 1);

					var val = pc.metabolics_set_mood(0);
					if (val){
						self_effects.push({
							"type"	: "metabolic_dec",
							"which"	: "mood",
							"value"	: val
						});
				}
					}
				else{
					self_msgs.push("Huh! No brain freeze! Lucky!");
				}
			}
			
			if (!brain_froze){
				var context = {'class_id':this.class_tsid, 'verb':'eat'};
				var val = pc.stats_add_xp(intval(this.classProps.eat_xp) * msg.count, false, context);

				if (val){
					self_effects.push({
						"type"	: "xp_give",
						"which"	: "",
						"value"	: val
					});
				}
				else {
					self_msgs.push("You gain 0 iMG due to low mood. Unlucky!");
				} 
			}

			this.apiDelete();
		}
		else{
			self_msgs.push("You must be at least level "+this.classProps.eat_min_level+" to eat this sno cone.");
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_sno_cone_base_bemoan(pc, msg, suppress_activity){
	this.apiDelete();

	return true;
};

function parent_verb_sno_cone_base_bemoan_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_pickup(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
};

function parent_verb_food_pickup_effects(pc){
	return this.parent_verb_takeable_pickup_effects(pc);
};

function parent_verb_food_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_food_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function onMelt(){ // defined by sno_cone_base
	this.apiDelete();
}

function onPickup(pc, msg){ // defined by sno_cone_base
	this.apiCancelTimer('onMelt');
}

function getDescExtras(pc){
	var out = [];
	if (pc && (pc.stats_get_level() < 15)) out.push([1, "You must be at least level 15 to eat this Sno Cone."]);
	return out;
}

var tags = [
	"snocone",
	"no_rube",
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":43,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALFklEQVR42s2YaVSU5\/nG\/dKP\/\/qp\nac9pWtNWm8aoGJNYjS1ogGKtYkyCRiPgilVIMKggGFkEAVkEIUGRERQUEIZF9n3YkV0W2YZV9n0b\nlhlgfn2ctD39GkXzv8955p15v8zvua77et57ZsWK11QzN67vXQoN9Jn1dpYpb\/rIVEHfyxbFvRU\/\ndY3ZmK0cdbYJmQ\/0g5wM1PHRzH3vDbEPUd30FctHAzoWGLjytcMRG6Uz4e3cMXjJkkmvK4w6WjPi\ncF5zHXe2ZT7oO2auOaEOv8vCTd\/q1wbZY2WhNRNys+O5YvP3gug+d4oRV1v67a0YdrcX7+0YuvwN\n455OGlClxB8ykyEh5tVDtpkZrex3tK5WiC8d83Gl3cKE9q+P0G33FZ3nTtDnZM2gmx0DV87Tb2uh\nAZ3ycUMZHACPpMz7uMleKWCLubFMfvoQLae+oN3yKJMB3uL9QZrMDiA\/\/SXt581o\/+YonQJ6wt+D\nEaHo6BUbpv08mHSx43mvqvw9Ql4JXJnxHp2mE0Y8PbYPuYBo+tqEWpM9NJ89QuOZQzSe3E+79Snk\nVsc0G+hztmbgqh095\/\/J4OWz9F86S9v5MwxfseWVAGZb6VeXWOwhabc2eZ\/uoOKALpX7P9asUiPx\n2UiPmsO7qTPdS42JIU0CuPXMlxo1ey+eodf+HHUWYmPfnFpeQIqNdCgyquaJJZQfY7bQgkcH\/0Le\nnq2UGP6wCnZ\/ROY\/PqLoE20BrItMbKBk\/04ajn9Os2gJubkxPULdDqFmr+3Z5QEs6vNaVTTsEdI+\n5UvvlA\/NSXrwxEpAnqDRQRvZgQ9J13uPZN33SNXbRP7O9ynavYXHe7dR8tl2sS896ox3U3HYkMcm\nn9B8xkTYfVoAflX40nBpPZe1CoY8xvMG3cgddKJyxp\/WnE+hwoLpmO0oxCoy1SL\/zCZyT39AgsEG\nUnesQ6a\/gZS\/fUjari0CUke0gQEFRgYUHdzNU7MvaLY4QrPlseqXgkvtOu+Q1nVpPLfPFVnvVZI7\nrUnpusDjqiMC8CuU0VuoMFvHkP9myDaEOjsUibtI+WQ9ydrvkK27AZlQ87mSz+2uPPh3Ko0NNVY\/\nO3uC\/ovmL25xbPM3prEtZ4hpNie2xZzoJtE3hPMMKS1pHzN3X4uCvWuoProGZPuhwRnS9CFlB+PR\n20k1fIc0AZmuq0W2wYfIDLdR8JmuJu0VJnupPmZE+fED114ILqzqsNbDhhNENZghbTIntOYQD2qP\nEi83J6ffiZgHG8mU6JN4dzOL4WtZjFjHYvRGlhK0ofg46hQd2m5sJXXPOhK2CzX1N5GxaytZe0Xq\nP9enXPRiqek+ak8c+PFDRHIfq2La2hxyh64RXGlEUPk+bpd+QkjlAUKrDxJee5yop\/\/kfq0JEfVH\nqYz9EFXoauZC3xaw77Ik3SQGhS1MxW5jJE6HgXg9OiL0qHDcQeGp54n+G+Vf7qHE2PDFDumYDqoT\nOiGu5Ta+ufp4ZP4V9\/RtBD7eR1i1KXcq9hNRe1JcjYTtJ0mrOMB04JsM3nqL0Tur\/w25kVnpnxmJ\n3sZo3A7mM\/\/BaPpeqq7qiUTrU\/DFrhd\/goSVP7CRVMjwKXiCb9EYnrljOMRfxi1jC945f8Ur+y\/4\n5n3MjXxdAor\/TmDpXqbC3mXuzlvMSn7DglBz4bnlMR+gjN\/GYuoOMX7toidsJ9mfaVPltrPjheFK\n0uUOuRmFpCYscaNUic9jFd7F87jKurGL28WV5I0EFO4RgHq4Z27BS6bNd0LhSb+foxDqzQT8UoD+\nhlHJGmYfrGcpboumHxdEeFr8dClz2oE81uDH9R2wqjgFnfoYdUdLAtRLoTARrhXM4pI7g3ueAqfs\naRxSS7CR6uOZqY1n1jacktdzNeMDskLX8PjWL\/ENW8+Q7y\/EEPArRoN+x9S9tcw+3MRi4keMxWoz\nlqDPs1iDHz\/BCECH5sdQHQ6dqeJ4CxNDcJSSm+XzXMmaQlKpwllcbZLGsEts5Wz4W1hF\/hqX1M04\nJW0i0\/P\/8E7+M9fSdUiSrEZ56w1UwatYuP8n5iM2oH60FWWyUDFzp9j5PtMXAQyZGoL8W0pyv1OS\n4z9Htt8swbfHOPdomK9jh7CQDmIePYClNAW31J2cubsWy4g3sYn+AzZRa7matlnYrotT3FaG\/d5g\n7NYPNivub2BOupmFJHH8ZBm82FNDrVbLBCTZUSpSPaZJdp8k4\/o0mb4zfHtvkBP3n2ES3IqxpBnT\noAqxsjkuycI87A3OS9\/kovRt7B9tFAHSwSNjO04ha2kOWMVg0BpmwtczGfk+E9KPTr74hCJqTg0P\naoS1V8eIcRghzXuce\/cmOBLaianfUy7Y12NpX8tB3zoOBck5HtbNyWAzzkb+Ctu41TgmaQkVt2Iv\n\/QCru9qUBf6BAckf6b+zvnYw7D2tl4FbtSRe2hUQ2gx309WEXuzFUdKPk0sTwXZywm26SfedIM5l\nEK+v6jjsISDvtHL0Xgengi9yPvKPXIx+F+twAyyDD2EfFUOO5E\/0Sd6ulfut\/sXLzXegsyBeCvoE\nXCN8XwmuKeO4fdeOr0kNd7\/u4t7ZbuJdhkjxnCDGcQifCy187v+Uw7cbMQvv4lRIEReii3FIGeLb\nuE6uxGZTHbyOrqB39F96lBLqWSqFvVGtcOepgKwTI96zWSK8WvA9XEfAcTlBp9q4Y9FJqFU3kRf7\nibQd4IJnK4eD2zj9sB+r+BGs4\/q4kjqCf5kKj+wueu6slwearfjZSwPOL+EzPAfBDRAk4B7JYWB6\niZ7JJRIjenD9rIJr+yvxNa4n0ExO4OkWvj9Rz12bLo4ECsAoARg3qAF0TB3Gu3CGwOql5RvjFSq1\nrG4Ebgv1boqQ5HShgesaX6RQ2B4k8u1y5Amun5YJ0Aq8v6wi4GQD0svDuFxuwkIcPVax\/dhnTOCS\nNY5rhoDMG18+wCkV47k9cKtW9F+1sLdvkWcTi3SMqkjuEAek6Mv7VWruujYJNcvw\/KKKG6a1SCxa\n8fHoEQd2L7a32vg2sgf7xF5c0ga4njuWvzz\/pcDKCaWYWoStAQLOTwSksn+R9rEF5CNKYkRfSuoR\n86Caqm4FSYl93DCr4bpxtbg+xe7hIO5ebUTYdhHnPMAlw2wj5+C2HKfgRoNlAZyeQ2dU9F+0OF78\nBZxvuZryngXaRlQ0DymJavnB9kdNKsq7FJR0TFPYNkl49DA+D0dwj+\/H50glD6y7SPQf0kwoZu8n\n\/Nbo91HL85fG+CyWwzMQKWy8UQ7XSxd53K3UwDUMzBMh7vtXifOxRkXpv+Hy5JPE1M1QPCzaImmY\n0IB2kfhuJNJ6JMkNq5b1N658gpB+hZrwerWAU+NRvEhuxzyNAq6+b45QYa9vmZrbFUqK2qbJF3A5\nzROkN05oFJeUKYivGUFaNSgLqxrUWrHc9WRILeudWuR+\/RJeJYu4F6p4WDtHXf8cT3pmiK5f0Nz3\nLJynoHWKXAGXKeDSGsYIKJvHM39SFlP6CsD+U\/ndaBJ7r2YJ9yIVV\/Pn8SqaoaZ3VhOK1KY53AS0\nc+4skdWTZDWNkyHgkmuHQxLrXiGYJsFjrBQHPp0isZH1KlwLlBoQx2yF6DWFJhQFwlaXvDkcxD3n\nnEnSGsdDkhvGVq14HRUlRyetfUmT2PiGeQ2IY44C+8wpodb0f0Nxu3Sq49vMSYdzya8J7D91vQqd\nuEYVLcMqslvncMqZwT5LwaWMSfwLxzqK5VM+Oe0KrRU\/VXkUoxNYIRI7OE9pl7Axa2r8cuqEj1\/B\n+E8H9b\/lmrOg45E3Q0PfrE9Vj+L\/BdS\/AOOxOSgmYCd6AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/sno_cone_rainbow-1351107698.swf",
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
	"snocone",
	"no_rube",
	"food"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "bemoan"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "eat",
	"o"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("sno_cone_rainbow.js LOADED");

// generated ok 2012-10-31 15:20:56 by lizg
