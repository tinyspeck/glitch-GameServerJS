//#include include/food.js, include/takeable.js

var label = "Hairball Flower";
var version = "1346783061";
var name_single = "Hairball Flower";
var name_plural = "Hairball Flowers";
var article = "a";
var description = "A hairy perennial. Even the thought of eating it causes feelings of antsy twitchiness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 66;
var input_for = [229];
var parent_classes = ["hairball_flower", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_hairball_flower",	// defined by crop_base (overridden by hairball_flower)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "0",	// defined by herb_base
	"herb_munch_msg"	: "You feel light on your feet and fancy free.",	// defined by herb_base (overridden by hairball_flower)
	"herb_munch_tooltip"	: "Hairball Flower puts some spring in your step.",	// defined by herb_base (overridden by hairball_flower)
	"herb_buff"	: "hairball_flower",	// defined by herb_base (overridden by hairball_flower)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0",	// defined by herb_base
	"seed_type"	: "herb_seed_hairball_flower"	// defined by herb_base (overridden by hairball_flower)
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

function canMunch(pc){ // defined by hairball_flower
	if (pc.get_location().is_game) {
		return {state: 'disabled', reason: "That would be cheating!"};
	} else {
		return {state: 'enabled'};
	}
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
	out.push([2, "Munching on this will give you the Hairball Rally buff (faster walk speed with some energy loss, for 5 minutes)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/773\/\" glitch=\"item|herb_seed_hairball_flower\">Hairball Flower Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-30,"y":-20,"w":59,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG+UlEQVR42u1XS1Mb2RXmH\/AT+AFZ\nsMoqCy2S1aQmqpkKsQ2OFAPDjAHTvAwIBFdCQm+p9X4giZYQektcPZAMyKLNQ8a8pm3HeCaZTPXG\nU5NN3NvsTu6lyslUqrKKwE7Kp+pUq7ul6q+\/c873HXV0fIyP8T8ehQ2zcqvg4p8fF9k33z1hD5sJ\n1OLT6CmfZD4YkNKbk+6Tg6SYWTdyc5MK5LZMyHbKPvSNsCWcHabRxXEe\/SAeyG8M0Hkj13l+VFBS\npl6elrhcwgxbRTf77v7zE4zPjrJCMWlHtaIP0WuZuF6+XQ5eP8i3b887zw6zeLcS5Cp5p5BPWDjV\nxO9lOvUQqhY8+MlOXMwlTAxJsdXc6Lp4WhSkH09llOW14II86J7tvlaAe9tRnjDB7O\/GmWLKKrxj\ntLWXlLeaKUzY5OulgNCsRfmjZlx6\/qwo7e9ycHqQAeG4KER8iL8UqhwF3F5g9TXZdjnAp2N6vpR1\nCPWST6rk3YAzTkjHzNCsczgZM4o1HOB2qxFmM22DQtICdRyE3TIn5GJW7uVZSWhUwxJhmvnzyx2h\nbeAyieXufMKMyjmWp+e0l3DaLmXXrWBfGUflvEve2AoL\/DaHg64F+WbaAaTEEPaqYS2gAaN2BMzj\nK0holTDO2EX63fOjHH8tJRb\/xCub9QjOxM2iakqh\/Ok9CnSr6BUzEadY2FBBNj5DwN0Dk3YIrJoZ\naO2lKKv4USkA9ZJfaD+4bxvyWtHN7VbCAhdc5Isph0DKzJWzDuVm0iqnEuMx34NtvAwvWg\/guKEE\n1tgHYc99yMStpA2iELBoSU\/GgVakreBenJeVj2shsY79OOCcFVjTOE\/Y4h9hH0pyRoRUX2CLSi2V\nkktkGFYhEZ6C787vwknjc+D8\/bDqvA07ldBVpjmTxBpmcFuA1YrergpxCjIY7Fkrj4pplt9MOWSp\ndYOMysbSXD+anVDItRNTjG5sHsb7e2GeUYBRcxf89j548+o3sL\/VA3vVSajkveC3INhYM4DLNqNs\ni9vkiDvsVvyyv7zeZR6RvknF9Gw6voIqBScuZVl+g9OzVAffZX7tF7C5\/jn8+K0Snh9NweXx7+CH\nb76ANa8c1NODUM37gZaYvhRl\/78GSCWBTl614Bbp+eXXNfmz\/QwUUzYyAPfBonsAXsdDIexdZLmQ\nDpm1vwSf5edwuu+DRmkQ1oN9sB74LQTtn5LfsFe9WMc+oC8TDy+htkgMPa4sfcno0FfcixOMZqcU\nDH3A7GxP5xGfUoZ9SFj1qHHYOy\/YHxrFVMgJyegDsGh+RnRSD07LNKx6FoELLkMlG4Akt0LO1Yx2\nYbA91ndVPiIpFNBPLe94P41ob+6UQ8qjZpKnjhLQmRERb8my\/AkBPXAlLR6z+oq5sFcDEZcODAuM\nFHKr8bUsCU\/3UrJIRN9FrI2vZuzddGGgwnt5UUU+dk7UzA8K9EWo6xDhhr2tBNFDB6QjLKx77RA1\ne\/hqwQv\/rqFt2\/3ogNSwT\/Q5ZqlzkMl0s9W8C108zbIHj9eFvWq0u1b0YNqftKyNrSjEV5dFg2ZY\nUg2roJzzCl7HjPJaFwbqxUQDBSrOuZyp8\/vXO6zwbJOACYvkOgSdKpyKmYAIt4jTLGkDF8\/Xk7ic\n9UJbBuM\/BdU+0uBCOqbjKFNJToeKSRtxhhifiRm5iB9hOsn8dlyiCwQX0qAn5DMRZ9G4pIFi2iNe\nK3MLU71dtL+IxbFu27SUiOjFg0ZCTMdMnGZh6GphJVKCuaCWX\/WqBVJOPuBUsYXVOk5F\/UAF\/sa2\nasogne5Kzn\/10MO9THfIo+Zd1mkUD+t4u2lSNCzdV77af6OsZ6pA+pV7L\/9HKLCNiJX32lVE33SE\nPcQV004OzQ3y4qkkO3t8AmR5lahl3ji4+qZfRtcnNMOAz2qAsD3MlrJurCOiHnW7u4Un51KzFgMV\n8xCrx4zIOu9BxjkX0k1akZkc2aUQ8uo3rh\/45NCsuObxQobzSbYlC\/P2NXS9ap0LFNzowCjc+lQB\nI4pJYPpnYXHMAHG2AAkXhsBK7PrLTjdo9fRX\/MQQI80Nazi\/gRP+2LqQMnEP3Ls1BPfvjsPiuAG+\n7BsDy4IHzCQdSwGwqf34Rsvd8+s+NmJLweGjGth1y\/CHnmGm55NePKKYAAIcdA9toJkwgXbSKk4O\nzqOeX\/3LNq89\/nr5d\/n3p3+TMqEUrMwbpIE7I\/90iruf9XcP9Y6hYcUkUnw2KL9R1spr+8rH2TOx\nkTmF2vohsJqw1H9rtLvjfUZl7UBGQOFStCluRh5fAaNpWwzAvTsPZB3vOxzaiNKpjUA+tHOVpbU9\n0M+w0H97FHV8KDEzohU8eg4Cpg1gBlUwcHuU7\/iQIhdqdNpQEPffGZVoDvSOdHV8jI\/xfxr\/AJUt\nyE+hxIddAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hairball_flower-1334873240.swf",
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

log.info("hairball_flower.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
