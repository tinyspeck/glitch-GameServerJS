//#include include/food.js, include/takeable.js

var label = "Yellow Crumb Flower";
var version = "1346783061";
var name_single = "Yellow Crumb Flower";
var name_plural = "Yellow Crumb Flowers";
var article = "a";
var description = "Like having a tiny garden full of sunshine. How clever!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 66;
var input_for = [234];
var parent_classes = ["yellow_crumb_flower", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_yellow_crumb_flower",	// defined by crop_base (overridden by yellow_crumb_flower)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "0",	// defined by herb_base
	"herb_munch_msg"	: "You feel studious.",	// defined by herb_base (overridden by yellow_crumb_flower)
	"herb_munch_tooltip"	: "The Yellow Crumb Flower can help you focus.",	// defined by herb_base (overridden by yellow_crumb_flower)
	"herb_buff"	: "yellow_crumb_flower",	// defined by herb_base (overridden by yellow_crumb_flower)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0.34",	// defined by herb_base (overridden by yellow_crumb_flower)
	"seed_type"	: "herb_seed_yellow_crumb_flower"	// defined by herb_base (overridden by yellow_crumb_flower)
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

verbs.munch = { // defined by yellow_crumb_flower
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

		if(pc.metabolics_get_energy() < this.getClassProp('energy_required')) {
			return {state:'disabled', reason: "You are too tired to masticate the tough fibres of the herb."};
		}

		if(pc.metabolics_get_mood() < this.getClassProp('mood_required')) {
			return {state:'disabled', reason: "Loss of appetite is a common side-effect of depression."};
		}

		if(pc.buffs_has(this.getClassProp('herb_buff'))) {
			return {state:'disabled', reason: "The effects of eating too much of this herb could be serious!"};
		}

		if (!pc.skills_is_learning()) return {state: 'disabled', reason: 'You must be learning a skill to munch '+this.name_single+'.'};
		if (pc.skills_at_max_acceleration()) return {state: 'disabled', reason: 'You are already learning at the maximum speed.'};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var success = true;
		var failed = 0;
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

			if(delay) {
				pc.buffs_apply_delay(this.getClassProp('herb_buff'), null, delay);
			} else {
				pc.buffs_apply(this.getClassProp('herb_buff'));
			}
			self_msgs.push(this.getClassProp('herb_munch_msg'));
			this.apiDelete();
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'munch on', 'munched on', !success, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return success;
	}
};

function parent_verb_herb_base_munch(pc, msg, suppress_activity){
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
};

function parent_verb_herb_base_munch_effects(pc){
	// no effects code in this parent
};

function canMunch(pc){ // defined by herb_base
	return {state:'enabled'};
}

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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Munching on this will give you the Crumb of Knowledge buff (double learning speed for 1 minute)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/778\/\" glitch=\"item|herb_seed_yellow_crumb_flower\">Yellow Crumb Flower Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-24,"y":-19,"w":48,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF\/0lEQVR42u2Ya0yTZxiG8ce07dfS\nEx7wVIYaZExOU7Ifm+A25zQalukUQaxCAOVUKGALWAuGk3goKJCBhybTzLjEkc1g1CWrbjqWaeyG\niHiiFkFOTT9QOYij9973YxpnYvZnrf3hm7xJ86U\/rt7Pc9\/P08\/D480ZP0Ct2D3BHlYq0a81OuzJ\ngD1E4XaqOQZKWUfvMjh6wjDW+5nRzdSrNjps6+GwrYOj91PAFh3pPnBsuvIvtgSOvpUYvBdMAJfA\nrdQb6lhuGuyIwaO7fmgyzcBjawQwXOUePQjbssiRzg9Zh201Ru4H4PJZBSxX5gCsOsgtAMd6IvSP\nLIFw9BdirGcpblyci96Wt4G+VeFuATjaFaYcbg\/Go\/a1eNq9HNfO++J2ow8BjND\/t7F2RKInTO9U\nQw1aP9LfOO+DJw8Wc\/FCAVsvemOkJ9P0L5iBStWYbY1pzBZncdjTx91OTEUNBVZT7zRA9vaSyLbG\n+RhuX0BuIB7eDSZlVhDgpYbxHl2tHO1aiqH2MDxu88Ww1Q9POkLR1\/o+cXwAgfyC9qvBKXCpRSJT\ng8lfdenEPPRcD8DQAyWaf54P+60g3GycrRzrDjV0NYfA\/KM3rpz1RssvvmhsmIUHTQG4d2U2CfMV\nGOte9P8HemaZKDI6hafI3itG1YkZyg5zILqbfdHZNA+m73yxt0CKxxZ\/1tYagNHOhcQ0CzioIWso\nbv06F90tHxOwhcRUi8xOUa7gkLx+zZaJ+oxyT6j3iOuvmzyNf56To\/9OCNouv4u1qybAWDmNU9Jy\neT6JnfdgvRqCrusfYKSTjEJbFNCfb3Za322rkCAqlW9KyGewaZsAp07KLC0XRBi0BnNGoaq1XvLB\nnd9mwX7TD+ytuXjStZLrN4c9ARjYZ3bqxpNJlMuvkWJ1Eg8rN06EVitDy0+Tce8q6cWWd2Br9cdD\n6+d42rMCozYdnvYlkptMbioG2yPY4TZv506ZrQWMRVMpQaJOiDVbeMjJlOPM4ek4UsEn7vTnJsrA\n3VDYW6fB0kgV9EXvNR\/i5MUWsJ86f8JEq\/j16nIxErYz2JDJR1bGJNSU8NHZvIDEjB+sv08hrp6D\nmxdmkr4MxP2rM9B3Y5br1q\/1abzw+FwGW\/QibMphEJ\/FIxEyFa0XvGBumI4\/zshw6dvpaDzpjaZz\nky39twMNsH\/i2i2bQJooXKyaQWauFKdIiY9XKHBw10wU75yK8t1TUFrtZdbUSl0LFqcVcjN2Xepb\nQVGpPNAbm8ZHnIrhLgVWZjNI0gvNmjIP58HFZDLKl59tzmWUcbkixOfzFNoDEuPGLAH7ZaKHeF3K\nJHOMio\/odD4SdCLX9FpslqA+USeo33PMQ\/EyoGa\/xJxjEBOgidwWQlTUb9aQTMwRIHmnp8UlgDHp\nPOXWAgGy9vCg3sU3UNBEjYeYTA626GsZiEmebytURWW2gE3eKULSDiFy9ktcswtuyuFbVKWTEKfl\nI7lQhLQST4OuVgayJGBjtkAfp2GeZxpVkT7P2OWJvGqJpcwV5qALQbSKZ6TqxGTwubG2lYAqiXtp\nqendnCti43KF3LpEvmOgkHQU6mqllsIjLlKy+KhMn7BdCH0dg7ozE4hLBcQozwCFZlr6FzOSqrlB\nTRQtFurpj3QaGC0T3Vzo3I3N4hNlGGgqGahKPZFW7MnSyHkRzqUnrUQYTgxhzquWIoWUjeYdHWvq\n3WLkVUmx\/Sspig5JXP\/XsqpBoig9KjdSxegykETGWaxawNJgJnlnUJIoIeDQ7pdCVycJdylY1Wkv\nQ+UPchQellGXcopRc6xP4T0PbfqZwqeTMrskTmpOe4WXHZebSo7JQABR8b0c2fskXM\/Rsr4I9+xQ\nNUkEmdLJ6u80sMJDciWBMufVSKA\/KOXgqHo76mRIJGH7KjiXHTLMueSnJij7Ro7yE3LQEE4p8gTJ\nPkSl8F7v67O0YpGR9pH2gJQoKOPgyKQYL+3rhuOmRBZPkUX+NtJ+yzFIkEE25H\/6zuQ2r83i8xll\nfB7DRQkdY3RtooPfrd7tJemYoDgtY6TKUXd6vDmvPn8DCReluK320o4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/yellow_crumb_flower-1334873237.swf",
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

log.info("yellow_crumb_flower.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
