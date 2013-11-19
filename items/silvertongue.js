//#include include/food.js, include/takeable.js

var label = "Silvertongue";
var version = "1346783061";
var name_single = "Silvertongue";
var name_plural = "Sprigs of Silvertongue";
var article = "a";
var description = "A blue sparkly bloom of joy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 50;
var input_for = [233];
var parent_classes = ["silvertongue", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_silvertongue",	// defined by crop_base (overridden by silvertongue)
	"energy_required"	: "5",	// defined by herb_base (overridden by silvertongue)
	"mood_required"	: "0",	// defined by herb_base
	"herb_munch_msg"	: "You feel more accomplished already.",	// defined by herb_base (overridden by silvertongue)
	"herb_munch_tooltip"	: "The effects of Silvertongue make your achievements more rewarding.",	// defined by herb_base (overridden by silvertongue)
	"herb_buff"	: "silvertongue",	// defined by herb_base (overridden by silvertongue)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0.34",	// defined by herb_base (overridden by silvertongue)
	"seed_type"	: "herb_seed_silvertongue"	// defined by herb_base (overridden by silvertongue)
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

verbs.extract_seeds = { // defined by herb_base
	"name"				: "shuck",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Pull the herb vigorously, destroying it but gaining seeds",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var details = pc.getSkillPackageDetails('herbalism_extract_seeds');
		if(pc.metabolics_get_energy() <= details.energy_cost) {
			return {state: 'disabled', reason: "Shucking requires more effort than you can muster."};
		} else {
			return {state:'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var details = pc.getSkillPackageDetails('herbalism_extract_seeds');
		if(pc.metabolics_get_energy() <= details.energy_cost * this.count) {
			pc.sendActivity("You're too tired for all that scraping!");
			return false;
		} else {
			pc.runSkillPackage('herbalism_extract_seeds', this, {callback:'onExtractSeedsComplete'});
			return true;
		}
	}
};

verbs.munch = { // defined by herb_base
	"name"				: "munch",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getClassProp('herb_munch_tooltip');
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) {
			return {state: 'disabled', reason: "Your pitiful ghost-teeth can't masticate the tough fibres of the herb. Try being less dead."};
		}

		if(pc.metabolics_get_energy() < this.getClassProp('energy_required')) {
			return {state:'disabled', reason: "You are too tired to masticate the tough fibres of the herb."};
		}

		if(pc.metabolics_get_mood() < this.getClassProp('mood_required')) {
			return {state:'disabled', reason: "Loss of appetite is a common side-effect of depression."};
		}

		if(pc.buffs_has(this.getClassProp('herb_buff'))) {
			return {state:'disabled', reason: "The effects of eating too much of this herb could be serious!"};
		}
		return this.canMunch(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var success = true;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		if((pc.metabolics_get_energy() < this.getClassProp('energy_required')) ||
				(pc.metabolics_get_mood() < this.getClassProp('mood_required')) ||
				pc.buffs_has(this.getClassProp('herb_buff'))) {
			success = false;
		} else {
			var delay = intval(this.getClassProp('herb_delay'));

			var args = {};
			if (this.class_tsid == 'purple_flower' && in_array_real(pc.location.tsid, ['LHV2547JP9B2AG0', 'LHV253Q5BLA2TTI', 'LHVGSE15MQA2OGE', 'LHVLG51LV6B22AO', 'LHVM1R8OA7B2IRT', 'LHVMF8SSJ7B2DV2', 'LHV2SR7FENA29JQ', 'LHVMK86NP7B26E6', 'LHV245SVALA2ST5', 'LHV4U509S9B2MRV', 'LHV254FHBLA2F5N', 'LHV1HO45PQA2QJS', 'LHVHMCSV0QA2JET', 'LHVM50PPD7B2EEU', 'LHVII3H61QA2C21', 'LHV1HKHRSKA2CR9', 'LHVPJPLE4TA27LD', 'LHVFUCU92TA26BJ'])){
				args.complete_purple_journey = true;
			}

			if(delay) {
				pc.buffs_apply_delay(this.getClassProp('herb_buff'), args, delay);
			} else {
				pc.buffs_apply(this.getClassProp('herb_buff'), args);
			}
			self_msgs.push(this.getClassProp('herb_munch_msg'));
			this.apiDelete();
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'munch on', 'munched on', !success, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return success;
	}
};

function canMunch(pc){ // defined by silvertongue
	if (pc.buffs_has('gift_of_gab')) return {state:'disabled', reason:'You\'ve already got the Gift of Gab. Why settle for less?'};

	return {state:'enabled'};
}

// global block from silvertongue
this.article = "some";

function onExtractSeedsComplete(pc, ret){ // defined by herb_base
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if(ret['ok']) {
		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: (ret.values['energy_cost'] ? ret.values['energy_cost'] : 0)
		});

		var details = pc.getSkillPackageDetails('herbalism_extract_seeds');

		var failure_rate = floatval(this.getClassProp('seed_failure'));
		var total_seeds = 2 * this.count;
		var seed_num = 0;

		if(failure_rate > 0.000001) {
			// Check how many of the two seeds we get
			for(var i = 0; i < total_seeds; i++) {
				if(is_chance(1.0 - failure_rate)) {
					seed_num++;
				}
			}
		} else {
			seed_num = total_seeds;
		}

		if (is_chance(details['bonus_chance']) || pc.buffs_has('max_luck')){
			seed_num = seed_num * details['bonus_multiplier'];
		}

		log.info("Trying to create "+seed_num+" of "+this.getClassProp('seed_type'));

		if (seed_num){
			var remaining = pc.createItemFromSource(this.getClassProp('seed_type'), seed_num, this);
			if (remaining != seed_num){
				var proto = apiFindItemPrototype(this.getClassProp('seed_type'));
				var got = seed_num - remaining;

				self_effects.push({
					"type"	: "item_give",
					"which"	: ((got > 1) ? proto.name_plural : proto.name_single),
					"value"	: got
				});

				pc.achievements_increment('seeds_got', this.getClassProp('seed_type'), got);
				pc.quests_inc_counter('seeds_extracted', got);
			}
		} else {
			failed = true;
			self_msgs.push("But you failed, destroying it!");
			pc.announce_sound('CLICK_FAILURE');
		}

		this.apiDelete();
	}
	else{
		failed = true;
		self_msgs.push("But you failed!");
		pc.announce_sound('CLICK_FAILURE');
	}

	var pre_msg = this.buildVerbMessage(this.count, 'extract seeds from', 'extracted seeds from', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	return false;
}

function parent_canMunch(pc){ // defined by herb_base
	return {state:'enabled'};
}

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Munching on this will give you the Silverytongued Charmer buff (5% bonus rewards on your next quest or achievement)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/777\/\" glitch=\"item|herb_seed_silvertongue\">Silvertongue Seeds<\/a> in a Herb Garden."]);
	return out;
}

var tags = [
	"herb",
	"herbalism_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-21,"w":42,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHsklEQVR42u2YaVNb5xXHbwMOiwEJ\n\/AF40Q\/AB+hMmWk7naQzDok9mCDbgFgkFu072q6ErhYQQoAAIYyQS+yAwTZeknoBTGtjJ2awZYOx\nwcYWIXaKt8hpOtO+6My\/z3Ndp540b5KIlJn2mTlvdO+d+3vOOf\/\/c64Y5v9riyx\/cGFm\/GOUbFlA\nifY8PNEnqOhYqdxycNVl\/UWykQdwHn0G3dBDaKefx7YUoEhxXqk4\/Ria2Brk1ssosy\/CH93YOpBq\n8x\/jFGqv4xYslmm0R9bhGHqEqtC9\/z5kjWiwsKv3LoIHHsIVWALnvoqGpuOoP\/w5lJEE+gY+LzYa\n5wUaR5wlv7HcBkq4L1H4kwFWlYeDoYF1lHNL0F14gn3S4+Bcp9AVnUV71wqcjssJk+48LKZpKM2X\n0OC\/Bln3Kipb78T32BfZV9F7+Ct2bBKClAPKG8cTZv8dNB39AsYrX+HQ1Fk8fRbC1FQMLscJNNWN\noqYiCrX8BJqNk3C5PoW39To6uu\/A1bcOa886fNHHGD3595lNyWCj5EO4W29C6bqJYOQTPH7yAW7c\nMOLSRQfu3tahdn8URs0ZGNk5KA\/chzdwG47gPaiOPOI3tM+\/DJnrBtTqU8WbU2JROG4xXYCTvYKp\ncy4CGMDzL\/vx0SkHLp3dB9Z0BFbjBWi6l0CVbm1dQoP7Nqr7H0B94DM4QwlIq4eDm9aD5bvbK8V7\nB6BqGMTHY6VYXXXgowkxYl2\/RAf3K+hlA7AYpuG0X4bXcw3tHUvo7ruPcPQhAp23IKk+uDlKP3Ts\nb4XRD56yof615K6SFux8qxGHI3txc06FqdN7YNcUQSWRorZiCOqmCVhJlt2uOXjbF9EWWITJcBZV\nov7Uw5XaFopj41\/HgrHHaBpcg1J2DFbzNH5drIBOvhMq6V5oG3ahtESOxuoR0oNDUDYehUR8EDrj\nNJpa5iCuPpQQl0d+\/JHItV8v9PXeT1Rxy0ECFpRP\/DmpPvcU4pZF+Nquw+4lYfsTKkVhAuTF7nfc\naKwZIZATqCjrhbx2HErJcSgbjsHpvAqN\/jw47ios\/uWE8dJfi1KSMWntcHBw5DnUwTU+LL0Pwfas\nwcV9QuxjEFbLDDSKk9jzno+o9RyaydBgUJ2BrO4IiTE0yM6gUjkJ05FVmCYeoaPzDhTuRTTPf51M\nmWHrtacnug5uQNG9xvudMnAfLa4rkHfEeYtxEAHI6kd5IbCWi9A3X4RST8BlJyAxzEJDBokm\/QXY\nWxdBPbMznIC2\/S6dfOKlxvs\/3pwlpRFBlSjCOlpmERt5hqEPn8Pb8wC+0Cra\/Asw6c8RwCPwuOdh\ncc7xm6j1L8FsmISqeRa1zuswac8hECT20nKLtxjvzAt4Rzag63iQpH2dsnOXHm3E+5JEgXg96qpi\n8BOFqohhi+wLMLRcg8v5Kewkq2bLLFTkfDYS5XLBZWj9d1HvWUa9bwUK\/ypckS8QHnkRS9lRx2eU\ngpb3J\/4NGU5SwdAe8xFQrXsBTk+cz6reOY8GUvJvb+pfz8Wp3VBV07lyUweHRpkjEQytIBC6h8qu\ne6gj86GT9J2KW4BsfD0uLh8ofj1+0Et8kfwflGZuUFho7fk5VIph9B1Yh4F4pOuzf8AQXEG96xb0\nsy9SMwxY+nNLnIM7vreJOqIFrDO6A1ruF9Dr\/oBOMoLRs5eOVnr\/SuoAZe50\/kXfF5IAJh2DBTCF\n8iGRV8UM+jPQBVb58Z\/tfoAy20JqACVWhjX35IFCOgZ3zDiHhN\/5KdncI6y0hoX0ngm6GXq\/pS+f\nQAlBr9Omp6o1dyXgCa+nDrDOxhQ3ON5AcCwDnUcz0Xo4F3x2ogWxlqjwG5Vp\/HkxjT8Htn4hvxn7\nQAGMXUIoPYKJ123J4ZydOTiaRCi2kbqBtM7CxBWebfyLuYNC+Ee2wzMsIBD5fFblnpxiOZeXlNoy\niNHm8PeZe\/Kh8QvQ4Mz9j9bwtc0rh8f\/krqZr9rIFNU0M0mVL4MH65nYhr6T6eBieQREAHVbLqS2\nbNSa03hoW38B9EEh5J481Fgyf5oPojIpUyI2MKCQNEO01MGxLLh\/nwtDZx4k1m087CthqFtJ9hw5\n8c2yse9cu2uYSpGcQZMrHSwt74ECXgjGbiGsJGuvC0PG5UHKZs1IrDmstTeTVbjzlEYfI\/g2HBVV\nSjP52zKmqKSKSdJyKr3ZpOfyeEFQOPaVMHwCSO25qDOnQ2zMgtiQiTpLBhqd2dAGhDFyT4mtT1hM\nNhikz6W83L8pZQTvVDDxfUoGai\/D9x0vjN6XwmhsySNg2SiVMnhXzKDelgZ9YDuBz4FjYDuJHD7T\ndEO2SH5iU3qyY4wpDp9k4I0x2K\/OQHNI+I0wJNZc7FWk4+33GVRot0HXnoXOsTR0jKbDHMohPSvk\nN6P2bU9WqJnU\/0U3eJZRhk\/+DI7+N\/BWGYPfiRhUm9Ig53KIMHJRZcjGrtqX2avSv0nUnUVUnsWX\nWGqnpc5KyrmsoIWc1ykFo8ZMfY\/6ILUZ50Amdu5\/CViheRlSOyllJwGxvhmn8PQ6DdISid11TGy\/\nminedMuhLyEwLA2RgmFJKRPlspeA9nAGAcyFNZybYLbSek\/MlFBYYuoJTWsa+cbIQWSSETBbcZUa\nGQHNskjLFDL\/a+ufZSQ9ET+yH+cAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/silvertongue-1334872615.swf",
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
	"herb",
	"herbalism_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"x"	: "extract_seeds",
	"v"	: "give",
	"u"	: "munch"
};

log.info("silvertongue.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
