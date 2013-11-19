//#include include/food.js, include/takeable.js

var label = "Purple Flower";
var version = "1346783061";
var name_single = "Purple Flower";
var name_plural = "Purple Flowers";
var article = "a";
var description = "Very, very purple.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 12;
var input_for = [230];
var parent_classes = ["purple_flower", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_purple_flower",	// defined by crop_base (overridden by purple_flower)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "0",	// defined by herb_base
	"herb_munch_msg"	: "Tastes kind of weird, but you don't really feel anything.",	// defined by herb_base (overridden by purple_flower)
	"herb_munch_tooltip"	: "Are you sure it's safe to go around eating strange flowers?",	// defined by herb_base (overridden by purple_flower)
	"herb_buff"	: "purple_flower",	// defined by herb_base (overridden by purple_flower)
	"herb_delay"	: "15",	// defined by herb_base (overridden by purple_flower)
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0.34",	// defined by herb_base (overridden by purple_flower)
	"seed_type"	: "herb_seed_purple_flower"	// defined by herb_base (overridden by purple_flower)
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

function canMunch(pc){ // defined by purple_flower
	if (pc.buffs_has('purpled_out')) {
		return {state: 'disabled', reason: 'No. Not even a little bit.'};
	}
	return {state: 'enabled'};
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

function parent_canMunch(pc){ // defined by herb_base
	return {state:'enabled'};
}

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Munching on this will give you the Purple Junk buff (makes you feel... purple)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/774\/\" glitch=\"item|herb_seed_purple_flower\">Purple Flower Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-28,"y":-16,"w":55,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFe0lEQVR42u2Y609TdxjHiVqo3MpN\noO4Ff0Jf7M2ixi7ZxKkoTul0IHZMLqJsRUQLcikUVJBLBXSKKBVbUAusKI6JqEcQCg5GxQsDGZYJ\nkwponVuc7Sn57vxOQ8y2bG8mLUt8kidpk5P0c77f55Y6Ob2Nt\/HfoicPvGaJUTtnAXWpL6iG7SNU\nYXh9UHGkRpgn0vB65WZBZ9pvCofD3TlAC9ukz6CO1psKtmgMhZG10GeZZUyCSprUOxzwvsIsu5Ey\nicwNFZCs3Y\/m1GHczjWjO+MlyqMoFERqlETN3mxaSErBbmAtsc\/YHxs4bqYuJD5AdLAUV+SD6C8z\n457CjGvJE9izrhg1O7qIorbMtojtBjhYQcuuSo2SoSoLjsU34nTyZZDPDyotuFv2EkcimqHZ3YW+\ng+bXgIz1dgMcqrKG6kt+MQ2fpVGacA4\/qF9gSEXj4XkLuoueoyNvAgPHLbhfYsadPBtg3Rd9BrsB\nPjwHgaGOxp3KKSjlavRXMHC1NB410hjWmFnQoTMWDJ5gIEttkCViLWrlOsVEt1U\/0TNtmnXIAc0U\nSo6ugV7bj9vFNMZbrXh8ncZYsw2UvMCPKhskJR\/BqfRGjHX8DgaOgadnf25Wq3fq5Tlh0Le0okIZ\njskeKyZuWTHKAD6+RmP0m9eQd2snWbDHN624V2xGb\/ar0FkHzCz31peWxSDjSBC+OzkMU\/80jDoa\ng2oaE502NUebGFhG2XEGzFBPsx2uz3qltEsdyit9IC3xQkLGO7he1Yip4WfoO8xAtVjx9LaVhRy\/\nYVPy4VnG6pMWjFyk8aTHSjE5uxarbvkLShr8kaP0RYo0GMr6dei+2opvc79Ha9MFPB+cxpTeCmO7\nFWOXGcjLNiXHGPjhc7Rp9AqEswqo6fHmVXcuRl61H5KLeCisXIaYFD6k6e9Be6EUv45MQ9dyEaMd\nT1mrHzHKDTMqDlRYTHdLzQK7WFx43k97rCkAh876QXLQE2FxXEj3rEBTPoW0fSvRUFnFNA0NY5uV\nrcWfGMifKav2SS\/sA7gzlxt09JK\/SVG\/CEkFPHy2x43N0CgXNNQpYbzPHBHqvWi7dBHGLivbxWQG\n2g2QRFKBp4I0SnSaO2LT3bEhxgVRiYHI3L8EcZnuqCurstUhM3pG6mn7n19LV81ThEQ6Y+tuV0Qk\nLmRtXr\/NBRHxAfi6SIsnnYzFN63a8Su00O5wu\/I9xCFbnQ1LVs+TBW9eIFsh4ig\/2LiAWiUKoNpV\nfZRRx46TN3fBSPO8eelfeWtJPSXs99SHxTn\/47TPU3kJove5m\/7tmTceCTkelPSwF+SnfFFU6499\nR7wRk+H+N2tqdIFC5kVMm3a4SOwGJ4rnCiMkroja68YWe9IhTxxU++HzFLc\/nUjM7JPl1\/gxzcBF\nWKyLYmMsVyyK4Qo3bOMG2bW+RLFOvM07uVShZhHId3UHP6iqjU8dUPlBnOxqWL5uvmnFJxys3MzB\nWrELRZ63exOExXJlshM+YFRTljcHILPcBzFpbkoC8+6HTjyiHEm7gxG18mt8xZt2cA1kxh0444dd\n+TxmlCyUODkqyPIn9XXqGl9P1hdplr0KL8RneYCAfhzHETgErLqLL1HrFptU7XymcxdBXunLri0y\neEXbSSNwZQ4BI9eIWsenyEVC4I5eCkD2SR+2g0XxLiYC5pDCn7HzTPti0wwcWfY5jHLEzlXhHAR\/\nyhE7rNbIBjjdymctrbgayHYmsTUh15PdoUs\/mu84OBKppV6KipZAkHmWWubNHpuJTIdu2eWK5SHz\nZE5zIbZneRjIKUQsncnVERwTmW1zAjBkC0dAFCNg4V8uZO+299cvmBvqzcTq8Pmha7Y668n1O6fU\n+2ssC3YSkHz7P\/H\/Of4APsSz\/oHakKsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/purple_flower-1334873234.swf",
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

log.info("purple_flower.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
