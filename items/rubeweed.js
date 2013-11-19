//#include include/food.js, include/takeable.js

var label = "Rubeweed";
var version = "1355090662";
var name_single = "Rubeweed";
var name_plural = "Sprigs of Rubeweed";
var article = "a";
var description = "A deceptively dull green shoot filled with lucky sap.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 55;
var input_for = [232];
var parent_classes = ["rubeweed", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_rubeweed",	// defined by crop_base (overridden by rubeweed)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "0",	// defined by herb_base
	"herb_munch_msg"	: "Do you feel lucky? Yes, you do!",	// defined by herb_base (overridden by rubeweed)
	"herb_munch_tooltip"	: "Rubeweed makes you feel lucky.",	// defined by herb_base (overridden by rubeweed)
	"herb_buff"	: "max_luck",	// defined by herb_base (overridden by rubeweed)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0",	// defined by herb_base
	"seed_type"	: "herb_seed_rubeweed"	// defined by herb_base (overridden by rubeweed)
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

// global block from rubeweed
this.article = "some";

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
	out.push([2, "Munching on this will give you the Luck of the Rube buff (improved chance for drops)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/776\/\" glitch=\"item|herb_seed_rubeweed\">Rubeweed Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-30,"y":-29,"w":59,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFkUlEQVR42u1Y\/VNSaRT2x2Z2Z8nZ\nSguJLwER5YoImenQB7pbTauZhqWt4AcqVihqBJpgEJJfYJqFX1fXLTe2oi9XK1tma7J2tro7U83U\ntg1\/wv0Tzr4vrjPVbzstyg+emXe4DFzm4ZzzPM85NyZmNVYj8tFxcHt51IK7bS4janXSkLtYzYhK\ngBbtVsrh2EY\/c+ujD2Bh60a2rkVIG+qIgF7Niz6A+82s\/DIHJ6DrS1RFHbidlWvZmvbNnlIHJ\/oI\nUmyOZRQ0J9gQQErbwzNGYWmZRJWXTx8dElJRA2r4XY5qqbTfGuJJg08UUNfE5UcFOPczOWOQ2kqf\ne6kk1PpYhq6XT7vm0gPWq1LKhz5bcYDtt9OMbddTYfx1Tr6uh0OV2JjQOJlM9\/6uJFYEUG5NXLDI\nygLNqc10Xs0GosTODBZb46BuMJE+4uBA7YAoZJoSrgw4bTfPVj8igup+NhiGuKBp3+jZbVhrLLJu\ngmNjScEVL2dBC5NumZKA9WcpdD6QQ\/fDDDg6mhQ0+ISw9\/hGDybJ8vno1dTA6TkZtF5PAYtfTNln\npZ7c6q+M+4zrAhpbApVvig0UnoijjRNicMzLwBWUgekHIXXxbXbky1vVn2hDjQ41AzzofagA53w6\nnH2UAd7nmeTSd5AQG2vPCwGx1dhMEkHXnUxwzRJw5q7UFnGAyKKCFb18qLsggvphAb2n\/muyyBIP\nnb9lwAErizzUvrm8ul+AMib2LBHnlF8evPAiCyw\/iQIRB4jLeMjOhjInm97XuE6VVxMHufoNdOOk\nKKTt4YfBG0nxR0AsfiLUGpCC+67s\/yeL+76ckVu9ToUPbnS1Pga9X4Ou14SbHoEj8\/Try4+TIg8G\nVzMogD3H4kmcOXzP1Ns8orIvEWqHBNB8SfJ5AIvdPEall08aLgrpBtRn7nklnHuSDV0PlGAik+A7\nUzhbZOs1GbtpXFr+4XyHZIauuyAEXR8\/v3KQy8ZZRYe6\/G63qszJBW03aosh4eeV+CDqnyMuLiz+\nYyEuFTRPS8D+Szr0PMqEjpk0KHUwYV9DPOm4rSTrh4VUVT8nX2NnUxV9fDBPE1THLXnQPC0NIRcB\n\/QAnDKj7fhZZ1MoKfu\/mfL4H4\/J9ePIqviByq78MXxe0rCcbJkVQ7mZBiY0dGn69C8b+3gkdc+lY\njENLv5Gn32BzzSo8LVfE0PNYtjz6hy2qBJHj0Gk2tN5IAc\/TLJh8tweafxTByMtvwHIr9aPp2HlH\n4cHZb59Ji9zkUj8qZpumksmTV6Uhxz0ZTLzZBSOvtsPYy10w\/koN5a5NMP2+AIzjQjBNSiizf3G\/\n6HuYo9L18EF\/XkBGDNxhJ5eNCEOj+Q2cswqYfJMLw39uB\/tMOngf5YRBueeU4P1jGxjHkuHEdAq0\n3SJCXQsKlf+9mrHfkhDZfQM3tQ4xD0uH7UY6NE1J6CovN3T27lY4g4CZL6fAxec70PgkgLabqVDt\nEWChprHkLM9q2MJEDoFGp3YWaLt4pN7HY+jPCQNHR8RgmkqBoSc7wHkvA3qeKhDb+XCwjQVFlk2Y\nPFDh5kbecz8VZLzwHHZwQlVeAdT7kpCkSAGXv3dhCzROCKCRlMCRTi5iODvs0203kAcH5cu3uRWa\nE6hSJwcB4IV1sumSJGS9khZw\/6qAM7Ny0KDMaTsTaQzc7E8Fy7UU6F5QwOCrLHppL4loIIkJ6QcE\n0HQZCTcatfDYfnZ+S2DgaQ7YbqZBMSoxtrdSO89jHE0Gx31EpheZ4PsrG3xvt0U+kxW9XKJhQhxE\nDkF3PVaE5cM5o6RP+gnoX8gOEwQD\/NefKTxELOuQ+mngIaBhVAInLi32IpYl7CCL\/RsbHjDw68o9\nnfLLVAdOssA6LUODAC96FvEPH2Ng4hSaWbTmFJOIWY3V+G\/xD7wlsvN3SsuuAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/rubeweed-1334873235.swf",
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

log.info("rubeweed.js LOADED");

// generated ok 2012-12-09 14:04:22 by ali
