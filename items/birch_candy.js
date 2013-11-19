//#include include/food.js, include/takeable.js

var label = "Birch Candy";
var version = "1352162398";
var name_single = "Birch Candy";
var name_plural = "Birch Candies";
var article = "a";
var description = "Candy made of boiled birch syrup so concentrated and so sweet that one too many and you may see god. Or at least the tooth fairy. And they'll be crying.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 13;
var input_for = [];
var parent_classes = ["birch_candy", "zilloween_candy", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
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
		'position': {"x":-12,"y":-14,"w":23,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE6klEQVR42u2X7TNbeRTH\/Qf+BH8C\nHdWiu8Nsl1c741VnZ1+Z2c7sK2RWseqhWbq1KmxQDw1JEAmCRCKoeLoSrqfITUlohbghUZRK2Vov\nz97zm00mQjW0nfUiZ+Y7cye5D597zvme3++GhYUiFKEIRSh8cXAwH761YeG7nWYhJ8rlNDfhb9cC\nbmuTSXE5GY\/byQBq0ayF+ekOsC+Nsf87nNvNRHrBUMsLgzCgqQSaEsO0UQHWeS3vouutz5Mjl2u+\ni\/gqcNsuJsEfDrXpmANBSTqMvqgDubQIDCNiDz0qPgXgEH0fbqtLTrXVJVls9clgrUvyWOuTmhD2\ny2aP67VAQFSbTECyiJDNjY9gckxM4fmYKQ5KiEAItqZKI9ocKwX3ZDXsWBRwuLtAfThiUwEcn9+\/\nNks\/KalzdfoUoLa7BkQ1uTDU9wwk9fkwZZDBrpOm9u2DcOA0wPHhelD68N5B\/XPI8k5O1q\/WAhNj\nksgX2kqLYVhEem6OVhBh5mSSJzBl7IYNx3TQQCh8Ca8wo5hZlFP\/u8X6PIl3qTbAHjTRHdAh+4Nk\nCnsOj13rtO8BWD5vKf31WvYTYJmvImtdck\/QkNy8Y7HM3n6TlN2\/8oODFmeuSwAyHnQulhg11Jb3\nVeGmyhOhPfsmiH6JDs5EZU\/SeDhWvHpWnAq6wjgwV929MgSWP9DhKG1hLEgyooik6TcSrmSc3odx\nCdr8OFDl3gZ98R1gqk+DYl\/6GwEVjHlmJpUg\/\/PHM4Do8JO\/2YTjQ5aP2nvz0rNi0wsvhERAr3ry\nYmGw6A7QgkRY6y+8lKP94dTKMmhHM2Z\/A7KceLDPdTbhGPKeg8bEJXbG2MzN3UY2aEB\/jasfg4mW\ng902CG82Zj8J5mJnYaC3hsC1chOiraUExjUC2HNbYMe9SGauZ28FVpeHQaf+CwZ7q3xemBqTJnwS\nELOHpcZj3eMk38X+sjEaWDZKwTEmhHVdNuk\/NEJnbgwoGx6QrFWVZ3Kbjy5g7UY4fLcKB29fw\/7O\nMtH7fTvQ463kJYwjIt99Z4wt1EcBNfmxlH\/mOnNuQV\/tz+cCjipyfOf1P4oHdd5tX5+JC38AqagQ\nWsRFJOuGkTbYdlnIAmBfNsC6nYalBT30qoQEcGK0wXffBVM3XAAYJwwsr3FA6LuY0tfDgLaSlEVR\ncBfkmdHQnnWTSPofnFdtomyorsiEfk0VmKZ7gdtzkvIjqHlGBw21BWR61FbmQFNDIcibijjgCmBm\nO6kL+7A\/Pz5CmxfL1+TFsn0V9wiUv\/Bth2RZ0P3bLVDmxPgAJQGAzQ8TSRYVzcWepcURFnvv3e4r\nODpYA8eKAWqEWdwCwScZxBfG+6JR3O7Z4JdEdYcgRaV82oM3QWm6yqG3sxTUBd+eMVIgoPTXGGgt\nvcdTqcoj5odF4RsO2uNiTaT3dFxpMXMVpRmglJcQQITb3pxrutKMxIf0KAV8VcdT1jvTFA+iPwoo\nzoiySNJunMoETUn4zGwXMQo1JCHV0HElRTMh4K7bDMdHbMpnb9Uk6VFCcXoUiyBYYnS8PyD3X895\nyxlmkaYaLTvul8QI2NN6bls3oK2GV4sDnLMXqS+66cUMcUB8DohCIXhg1s7b5s1MyDxewAWTmgxq\n63wP79p8ReIgxn7DOfp2i2GtjC4y7LoFfusgKJY99OEfilCEIhRn419RAnvOFBW+OwAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/birch_candy-1334210302.swf",
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

log.info("birch_candy.js LOADED");

// generated ok 2012-11-05 16:39:58 by lizg
