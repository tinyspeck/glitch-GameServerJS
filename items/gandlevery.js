//#include include/food.js, include/takeable.js

var label = "Gandlevery";
var version = "1346783061";
var name_single = "Gandlevery";
var name_plural = "Sprigs of Gandlevery";
var article = "a";
var description = "Plant with furry fern-fronds of fleetfooted goodness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 40;
var input_for = [228];
var parent_classes = ["gandlevery", "herb_base", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "herb_seed_gandlevery",	// defined by crop_base (overridden by gandlevery)
	"energy_required"	: "0",	// defined by herb_base
	"mood_required"	: "5",	// defined by herb_base (overridden by gandlevery)
	"herb_munch_msg"	: "You feel bright eyed and bushy tailed.",	// defined by herb_base (overridden by gandlevery)
	"herb_munch_tooltip"	: "The effects of Gandlevery keep you wide awake.",	// defined by herb_base (overridden by gandlevery)
	"herb_buff"	: "gandlevery",	// defined by herb_base (overridden by gandlevery)
	"herb_delay"	: "0",	// defined by herb_base
	"is_herb"	: "1",	// defined by herb_base
	"seed_failure"	: "0",	// defined by herb_base
	"seed_type"	: "herb_seed_gandlevery"	// defined by herb_base (overridden by gandlevery)
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

// global block from gandlevery
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
	out.push([2, "Munching on this will give you the Gandlevery Boost buff (an energy boost every 15 seconds)."]);

	// automatically generated source information...
	out.push([2, "You can grow this by planting <a href=\"\/items\/772\/\" glitch=\"item|herb_seed_gandlevery\">Gandlevery Seeds<\/a> in a Herb Garden."]);
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
		'position': {"x":-23,"y":-17,"w":45,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHJklEQVR42u2Ya1BTZxrH7Xa2o4ER\nHV3sdleDIqyoELdyqQlwECwoGg4JBgSEkwIGwy2BQEIbJLRSS7uWoLV0WkfP7k5FBnFObQccL9sD\nFrlPQrlUIpcjAbkY4Hzc2U\/PnpedZGRkdlZKgZ3dd+ad5CRzkt88l\/\/zf8+aNf9f\/+VrVrHDhdUE\nqNjS4\/iqg5suT8entSFmViMiZj5NMc6cT6FWFeCzjxLJ2ZovXWZy\/A3omj29m1xVkZwtTeBPlcqM\ntpqL2BxgfhDOQRpWbT3a3jtMznx8cuUBK8PdCLRfSLk6wIyaZkXhrkZ5qWpTQ1QI8NPADQL755N5\nItJWHLXy0buZIOQjsLL9G12uinfN1d7UuURiUn+EXlX19pcYn7kUj2X6E+MlEpqtvihYUSC9dC0f\nbUckUwIFo5pQarTgbXLZIL6I2E7XyjEKvXaWKeYVu066jnpXsnYual9FupNDaoxhkt2JZYOrig8w\nXovznRPZ8qDNGLqeBxi9TtWhi8B7CS+6Tx0GVr14eQUZRe1ypDt+Bd9N1WeLMTJ6jyN1Nco\/Yq2a\nMKY\/VcC2yD3JIdkKSMkt5WGkbWaUvqrcDdhNnStpyTsoGNAdY\/vke6E3dhtxNcefsKd5RZZOwsM5\nAOxWhTPdUrkN+jID2T4lJ77cvHWMt+feL8285H7Q9lUBNqU\/TEzfuIDP3rzEfwFMtsYF1VihlGdA\nzXCjcD2Yk3ZDf0Ek+Y9hncCkkfIt5xRER0YoRUduAdOpADAnehmHZBsXD4sGOPuhTDWjEdHPtGHs\nWOZ+GCtNgEGlPwxqwualiQMj7Y1wNyNA9aBwEzRedjb8UO0keEJFMd1F8UDHuENHagBlTvM3mJP3\nqoZK4pjB7MDFi\/PMZxmG2XfDwHZWBhNnomAk+y0YTBNAf7ov\/KQUQlv074z2aKLIoY3qqyXfj637\n3BnuVjqbG8q2MM15HmxraoDq3qGNLqZTfthgcey\/BLo8k3iiDgZbZQH20nBsUYRq9pNksFVkzMGN\nasNhKEdk\/omTiOHSZOiM3QHNMW4wTn4wT0raEvcQTVG\/he\/jXZlW8Rv482XySC8jUeT6FH7kcF64\nYEQdbBgvEsNkrhB\/6dTOno1hp3VhMJErhGc1FY4iR99x1+RDDqLh6Bboyo8yP3\/fD1I3tj3ZB66J\nN8z700f6GKJHKaRQxBmdGB9O2M63yneyUwWY+eWj93EyYbuQAVN\/SoFRlZBcqOuaE\/fQ7QoRfBez\ng71VfMyAmqQlyYdE0N+rD0LJiU1MoWSdo7660nyN\/bmH6IH0APyJNsI4phKyU5pgZlHWylahNE8p\nvWEs5wAsJKh1+kj+bW0EdOmk0JQqYssUrnBNLWQeyDzgUUki9JRnqeyNY5+9van7CEuqDwwluYP1\nHQ+Y0h8xLtr3Pfs8j0Ed+\/RcsiP8nZwc9GkiufTtIz+Id6WMSj7VrjoCtcEu8KBKxDamC6HxuAe0\npR1gUMSRHj5vDNBiktyw8YIw1dSZ8J\/nWlBTWHMxGErzcZhHpuwdvFtzlG4+6Q3nZZvZv7MSrEnr\nCT1fBoKF8mSQhDQTvtCeekD1yx5iuCJ+WiKjBuW7wKJ8i0HCPHBGhjVFvU50a3Fz6ykRGKKdWCTG\n1h+92elRL5h4vA26iyVgyouEZfF0E5wuDahDmB5iL3RIfw8tnJy0p\/jB38Rb2RaFiEANgdL32PQq\nPdL\/Cgz3vgL3c1zgx0Lp8tp15myyylKSaOzRiql7EZvwutANjpp6+PVafhf9GvR3vAqPTb+CtoxQ\nsJSlr6wjti9rdT7eeJ1naKpdB231r4Hpu18DczF3wWlAx+4imuW+dLv8TXMnIaB6sg4K7GfgX+bc\neuOCYfRKieGzXB40VDlB9XkXqDvtbLAbBvvUQNG+I95KNx7fCQiuKzvE2JuFmXvT3oSB7CBqIcPx\n81N+SYc\/LldDTdB6uHzsN3DxsDPczgqGkvjNZk7zAEHfucKjGpL2U\/Vvb0Kyw3ak+Bo6D210gA8V\nSSlL4nZgFD7GJQNDnUmnBBpux\/pAU2Y41Ia6Qr3EE25L\/wBkli8guE\/SeUC+x4NqyXq4c\/QNeHDC\nizZlBS5YkyO6CHpMEwJLBthwOoy+c9IP6mTe0JqHw\/0kf\/jmyDa4LveegyuK48Gf3+fB\/Qon5l60\nm9GUE+HwjL05IURvup\/RWpaG22XMqtjLTKqFS\/cU668HnIwI7nrIZrjLgX6Le0AVJ0EIjpu3DKeJ\nxluXeC84knbJ61hfeoDZkiE09Me7USjFEx8mkMiATL8vWboDE+q6puxI9puonYD28Bd6ulK5C0PW\n\/t\/d16PwZ7rjtuKWuO0CNNOfFkvw8VRP1pa9f+nPwQ81kfz6uH1Uh1b2H3fgo3Q\/1iLfTVmLjxut\ncg9ysuAg2M4cNS75mWSxa+TsCcPgSXd6LDeEnvwokZzOD1p9j3j\/J9Y\/AT42s6pYTiezAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gandlevery-1334873244.swf",
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

log.info("gandlevery.js LOADED");

// generated ok 2012-09-04 11:24:21 by mygrant
