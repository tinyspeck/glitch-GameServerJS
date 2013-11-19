//#include include/food.js, include/takeable.js

var label = "Hi-Sucrose Corn Syrup Square";
var version = "1352162398";
var name_single = "Hi-Sucrose Corn Syrup Square";
var name_plural = "Hi-Sucrose Corn Syrup Squares";
var article = "a";
var description = "Densely-packed brick of pure brain-melting sweetness, proving that sometimes the sum of many food items is either something that is only fit for use as building material in a fairy unicorn happy-palace, or a candy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 31;
var input_for = [];
var parent_classes = ["corn_syrup_squares", "zilloween_candy", "food", "takeable"];
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

verbs.eat = { // defined by zilloween_candy
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		/*if (isZilloween()) {
			if (effects) {
				return "Gives "+effects.energy+" energy. Grants 'Sugar Rush'";
			}
			else return "Gives some energy. Grants 'Sugar Rush'";
		}
		else {
			if (effects) {
				return "Gives "+effects.energy+" energy.";
			} 
			else return "Gives some energy.";
		}*/

		return this.getTooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.specialConditions(pc, "eat", drop_stack);
	},
	"effects"			: function(pc){

		return this.parent_verb_food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		var num_candies_eaten = pc.achievements_get_daily_label_count('candy_eaten', 'zilloween');
		var num_can_eat = 11 - num_candies_eaten;

		// Don't let the player eat more than the number that gives them toothache.
		if (msg.count > num_can_eat) {
			msg.count = num_can_eat;
			var item = this.apiSplit(num_can_eat);
		}
		else {
			var item = this;
		}

		if (item.parent_verb_food_eat(pc, msg)){

			var zilloween = isZilloween();

			var num = msg.count; 
			pc.achievements_increment_daily('candy_eaten', 'zilloween', num);

			if (zilloween) {
				pc.achievements_increment('candy_eaten', 'zilloween', num);

				pc.zilloweenBoostCheck(this.class_tsid);
			}

			if ((num_candies_eaten + num) >= 11) {
				var mood_loss = Math.abs(pc.metabolics_lose_mood(10));
				pc.sendActivity("OW! TOOTHACHE! Stupid candy. Stupid, delicious, scrumptious, addictive candy. No more candy today. You lose "+mood_loss+" mood.");
				
				num -= 1; // subtract one - the final candy doesn't give sugar rush
			}
			
			if (num > 0) {
				

				if (!pc.buffs_has('sugar_rush')) {
					pc.buffs_apply('sugar_rush');
					var buff = pc.buffs_get_instance('sugar_rush');
				}
				else {	
					// Player already has the buff.
					var buff = pc.buffs_get_instance('sugar_rush');
					
					// Add one so the numbers work out correctly here
					num = num + 1;
				}

				if (num > 1) {
					var proto = pc.buffs_get('sugar_rush');
		 
					var dur = proto.duration;
					pc.buffs_extend_time('sugar_rush', (num-1) * dur);
				}
			}	
		}
		else {
			failed = 1;
		}

		return failed ? false : true;
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
	"sort_on"			: 55,
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getTooltip(pc){ // defined by zilloween_candy
	if (isZilloween()) {
		return this.food_eat_tooltip(pc)+". Grants 'Sugar Rush'.";
	}
	else {
		return this.food_eat_tooltip(pc);
	}
}

function onGive(pc, msg){ // defined by zilloween_candy
	if (msg.object_pc_tsid) { 
		var giftee = msg.object_pc_tsid;
	}

	if (isZilloween() && giftee) {

		pc.achievements_increment('zilloween_candy_given', giftee);
		
		log.info("CANDY "+giftee);

		var player = getPlayer(giftee);

		if (player) {
			player.zilloweenTreater(pc, this.class_tsid);
		}
	}
}

function specialConditions(pc, verb_name, drop_stack){ // defined by zilloween_candy
	if (pc.achievements_get_daily_label_count('candy_eaten', 'zilloween') < 11) {
		if (verb_name === "eat") {
			return this.food_eat_conditions(pc, drop_stack);
		}
		else if (verb_name === "eat_img") { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
		else {
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	}
	else {
		if (verb_name == "eat") { 
			return {state:"disabled", reason:"No more candy today. You don\'t want toothache again."};
		}
		else { 
			return {state:null};
		}
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "This item is seasonal. Some of its ingredients can only be grown during the appropriate holidays."]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Sugar Rush buff (faster movement, mood bonus)."]);

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"zilloween",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-20,"w":29,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFHElEQVR42u2X\/VIbVRiHcwe9BC6B\nS+ASuASCdaqjjnSsUMexxtaOtE6nVAZQ\/BjU6jiAQKcV5SukClhLa9MKAdoCgYQvKSQkfAnFHvc5\nybue3Sxfteo\/OTPvbHaTPefZ3+9937Px+fIjP\/IjPxxje6mxJBWrDa3GPwxIpGM1xavxuqLNuZqC\n\/wUKgPX5hsDjlavJP9MdyvpsRzpeZ8f4rbeVBR9Wifoj\/yqQ2gwWqM3eIrUeDDxZ64maQH8sNSrr\nuo7HK9c02Mp0jYoPvacB0zMfqa2l5uhO+vs25nhmUFj08NapqsRUXRIIM1h0c\/EbHWtzn9mwq7Mf\nOxQkuCbfJ6fr1fzouYanUynRUqDWekoshUJqvSeMIjupDrX56FvHgqIY1prXUQ3FtGrWuYBz5Hxp\n4pJafHhRR3KqOkzepmN1VfGhysDknTOFOUCpeG0ZOYQtEjupdtsuAZwbq1KJaLUN4lZsO3lFK8l3\nLK5\/aynsVpPfsMbWcrM+n753VkX6K9TIwBtqeeKDKHltK2Xd3GA9QdJtBzc\/We1yQK7Of51jG2qQ\nY6gmKgEArDwkSi\/cv6BBuG7O6Z6PmImcD2cA13oLgWACkd\/ME7MSUWPy13f0Il55hVKcz4++r0wn\niFT8E62o2B69W2k9WK09L9\/xAEN9Faqr+Tl1\/cox6\/PJwkxFavva7cl4wu1Eq1ZQ7EKd2cg5rRRH\nE1DuAZBFHtx8y1MViam776pw6DU1duNNDYu1xJ3gcQ3X2VSqBrtetew+UeCzCqBNKhElNn7\/ygJr\nVamZL9RW4jttMYtzXRTaLzYWvnRUuelCfLhSDXYfVzd+eNkGkxj66XUNCbzOx5\/Li3xqo6dMmisQ\nqKlhshMmY5+qxfF6q3rb7GqVxEYtrHEnPw8mRZWMXVajllICgTLAAeIGNGO4rzw5cfvkESsHg1VM\nJouaQW6ItdHwGfVgMJM7xML9i5binzuqk9zDMpQAgjwCaC8Qdwy0v6SPfddeVF1NpZaCmR0h03Cz\nC6HK\/NgFtZFtBRQPoNIKJGgJkvTkHecHgbh3\/YS63V3muIatPBT5Z0ezP2DlYG8xgO5902wvUt0o\nKrZSLObkqHYYpdyB5T9efUGr7gIMBqQCgZIdwWzAQGGf2VKAlMl7Wo5qVfYCQB0q9CCwLsBMFZvN\nEzhTKbEOQOAejV9y2MVkuwGSS6IKCu0Hh\/VOQKtI6IFUn9mYAZT8IkRBgoIxWwOTebUNaRccsdB8\nCK+UEJsFMFMk68EGbF2erPXsaaIs9qMsFvMwALOriCW\/dLxiLwwstntBC4i7zYgTzvCHfZa9oeXJ\nansvxVb2VgF07MPZliIVD6RUnizIkWuEqOSGwXa5Bhi\/o73kApYqX+y308VsOVSo7oUH2C34Pf0N\nO5iYHCO81MJeszgAY2Hu436Uz2kv2eho9Id8cyNnC+T1CetMq0VR2cjdbzBi8V6BOpKLqGXut6TB\nbsoB19107O+\/Brwwem302En+ufuk3leNXnjQcFTpflDuERmoCEyFT4e9XqXIN4AI+Y6HEWXcG75p\ncW\/r8947RRaqs9Ff1dlYWnKoV\/7h\/ooSNmxRlcXMVoPF9EdgZL\/FLmBQCWiui505YE3+pG4j\/2Tw\nNoGqpkXACujsyHkNIO3EsU3tGv6wBdcQbDn67P4j8+IY6atoMyEpnLGbpxy7iBdg1sK2Q1v4tENb\n318eivSXh7330IxCAO2Z8P\/F4I1XQv9\/yI\/8yI\/8yBl\/Af3k5D\/Y4YCoAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/corn_syrup_squares-1319484643.swf",
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
	"no_rube",
	"zilloween",
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("corn_syrup_squares.js LOADED");

// generated ok 2012-11-05 16:39:58 by lizg
