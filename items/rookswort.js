//#include include/food.js, include/takeable.js

var label = "Rookswort";
var version = "1346783061";
var name_single = "Rookswort";
var name_plural = "Sprigs of Rookswort";
var article = "a";
var description = "An exotic bud with a pleasantly lasting aftertaste of danger and chaos.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 75;
var input_for = [231];
var parent_classes = ["rookswort", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_rookswort",	// defined by crop_base (overridden by rookswort)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "2",	// defined by herb_base (overridden by rookswort)
	"herb_munch_msg"	: "The whole world seems that much brighter.",	// defined by herb_base (overridden by rookswort)
	"herb_munch_tooltip"	: "The effects of Rookswort keep you in high spirits.",	// defined by herb_base (overridden by rookswort)
	"herb_buff"	: "rookswort",	// defined by herb_base (overridden by rookswort)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0",	// defined by herb_base
	"seed_type"	: "herb_seed_rookswort"	// defined by herb_base (overridden by rookswort)
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

// global block from rookswort
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
	out.push([2, "Munching on this will give you the Steady as a Rook buff (slow down your \"natural mood loss\" by half)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/775\/\" glitch=\"item|herb_seed_rookswort\">Rookswort Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-25,"y":-22,"w":50,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHoklEQVR42u1Y21MTeRbmQWejCEm4\nJQiSgIDKZcJNkHBpCCqOCuEWMiDYIAgCSidRCfdGUEAQWy6jBgaiOI43oJmlmJ1ZHXofpmprq7Yq\nu7VbtY+p2od97T\/hbJ+4YQwTGGBYl4f9VXVVJ9351fc753zf+U48PP6\/dtGaTpaodi24MQHcs4wA\n69uTUvGuBfmCkNkXNXL7ffMRpqs7ku\/sjOBmn2ewbxaytbsCoKUsiOuOFQNVJeOLikQK5\/eTM6nE\n0vJpq8WS+L+L7p++Sib\/sXgKJk3B0JophlkigH2a5k86n6+snFfNPsuwdnREki0tSvKjA\/xxOo5b\nYqLgX3\/Qw30qGDJi9xBr35mcOmGtbzho++iRHNRJxb3VPvYvO0LgR6sa6rQH+PRoj58xenQikWxs\nPGj76NGrO+1JthR6keeSfgPFaSJQH\/NQuGX62HGitS0cPiq4i5meZHW2iOi74Ev2V0qIa+e8rEVq\n0boAza2HXQBiuvv7jxJ4\/TqGChstL+dqX73JYp49z6S+mtc4QHwIxpTvTZeeEP2MAFfrA1QTE\/EK\nBEhRIS4Au3qO2QsKvNiWljBmcDB6c0KPYvtNjpz8bbacWMoOcPzozmAs19AQzOp0EqqhIZDpuXUU\nbt8+tgqu6axIoU\/eq9IleojXHsxkClXpdB7i0fFEqrEp2AXgCBNH3xmMobq6wonCwgObj+LL9ADV\nCyKAf5ktgy8y\/Ww1uRIePz8nZBw+v3v3U7KnN8rqfB+B6VJFxFqAjsMNxNDD9+O01qfpXGNTEP\/h\ns+bmQ9r6epm2sTGYxkNsKa2\/a4+ihzJ8oCtVDOVqb+hNlvAT8ZLVqA2PxHGb3auhMZideaIGvV7i\n9jcGk5Ldct39fUHDL45EwWSbEm6We0N67B6XzZkH8ZsG+N3vP+OQIAUF3tTaZ+NfHKcuXvSntgzw\nr68J+z\/fFcHf5rJhblgFpZp97Ie1ZTAqNgWQXTpFjTDxcOGCD782jQvfnNTevKm0bjm9uPqq\/NgH\nxkP8xI2DUFfo79IdkJFNTQetv7TH16+ySCFCYJk6AdanabZ33DlyZSWPeLtyVvulIYq9pQvitwwO\nO0N5xn5tsSAZhnxvRp+xD0rUn7g4EstUMl1VtX5a3r49KRbSyj4YSwQh0oDsRYmhBfaPjiXwDx8n\nsW2JYvvXmTJ4fMKP2xLAjhKJ9nT8XtXtcokCxdeQJ2ZRQlxEdzzBXljo6Va3MEIz1lSepiOgvNxH\nqDsvt5GuVn6inUnz5xc0cti0j0RQvRU\/OeOKzH1U\/WlXIOhMBodiebfM\/\/4zZnwiAZqvBYGgmXxh\nodeGXtCSKBWPJvuSo8k+NN5vKZLYJao0++m137\/jzlM0HcmuTenyd2e4vr6jUF3tj2y1rRfhHVsY\nzVUnIpzyXqKUNUV6qubms21Xrwau1h8W\/Ou5bN5oDIGKCl8B3AFmW6zczprN8CPms2TMS0IGWCuv\nsmTQd1kJZWUSwpnu79+dxbYHJOkHQkrXNaPTz9JVL15l0XhhFrA\/7xhQ7CAPjvvYJlJ8oTVOvAoE\nXfLUdCrU1cmhstJ\/XdkZG4tXCWXBX6mTWy9f9iMeT6ZQE4+S7WZz6M6WATZ1BCPUGP3DD2cVqG8d\n7WFQWyu3r+eUsT57+47ai3Xe1rWghchz6HZ+FSjsBLduHaFwEMK0tLeFoXSwOAgxowmCvgXDRk7k\nydM0rr5ezq1n4yhDiHVbwPDkA4Mx3DVKwQ7fU9n0ZVKHXReiAabrSvvSt7kwMBCN6bWvt8ebeQ1j\nuq7Y8ACC4DPbAviG1dAGQwj9PhVR2s\/LpA4gd4diYdqaCotLp+B9ut8LMabdeY\/pn188yQh1B2tT\n61zoN5c1gYqaGv\/tTXnonGtrA2iz+bDg1w5pkRhGo5LAxr+wmAPPXxBC7ckchPnPpRVam3X6SZpN\nIAEIBBDYLrW5k5w\/W8LE89og7mGKL99U6Ls9gDgnmFuULuFvNijg3kicA1xnV6RD91CQ9WU+tjk2\nh330OBl6eo4IkQ3kS0ok9Hp7\/+W1hv12KAbofB8wJHnBTNY27Nb8Uraqvz+ad2oeksRoUkC3kLbB\nIRWYjIegtFRiv9IQZO8fiAHhMHC5VuYAtpFQ366RKCzth+GPs2qHlWurlLqdoze1xh8msa2todDW\nEcEZjEquqFgMNbVyGB1PAqyv4XufwiNLCgjzLhSXiLkP\/\/LYyC29vhPBW9pCYG4wDMyVUj4xbJud\nB2Xgxs1we1t7OJBVAchewGhhFFFiMN3NzcEujgVrEQnjLorY368XiNnaU562cdNheymx3+2Qv6WV\nkrKXqqgMgBKdBPSfSx3E6O6OgN6+KGjviHBE7qcxIIG9dElOo6y4Mws4WBnyvB11jcO+MKoyO9JB\n9HqpHSVldCwOWs1KaLgSCJcuyYSIhqKtsgkR5IpKxDacOXAs3cghdZRKSBxTHW4px5PaEYACGcjr\nN0JhakYNnZ3v2Ys1iHLSYg5HYLSz\/jZy2miA0W9iHRrzDhDlatHOGYacHBGZe2a\/PfeMJ+RrvSAv\n31twzL7Q0RnJ9w9EM5apFAatvJP1v7TOx+\/97\/jF46l7COcVr\/ZQYOSw5rbqAbfN3N20\/g3AgEi\/\ncK4EggAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/rookswort-1334873239.swf",
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

log.info("rookswort.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
