//#include include/food.js, include/takeable.js

var label = "Raw Bio-Organic Carob-ish Treat";
var version = "1352162398";
var name_single = "Raw Bio-Organic Carob-ish Treat";
var name_plural = "Raw Bio-Organic Carob-ish Treats";
var article = "a";
var description = "A chewy, crunchy, apparently ethically-sourced, gritty 'candy-alternative' with a whiff of winter. Leaves a unique chocolatey aftertang you can't quite put your finger on.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 41;
var input_for = [];
var parent_classes = ["carobish_treats", "zilloween_candy", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
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
		'position': {"x":-10,"y":-13,"w":19,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFN0lEQVR42u2X7U9bVRzHeWOEOUdh\nKy3joe3tA6W0tNAyRiktj+F5LbBCCwzEbSpMYeJgcS424AybMW4xEbf4gNsLp8ZIshhjNBETjYmv\neOXr\/Qn8CT\/v98C5u\/f2loehiSY9yTe5XG7v+Zzv7+Gcm5OTHdmRHdnx3x9xv5DPrxcGPJFkkzky\nEjLPJUJCSq13EgGmpZFA9F+FujFaY1pKBjaXkwGS6+qgl5JNQkadb3cwXe5z00LM+3i+37OGBY0G\nLaZDAY00maPJkLCeCFk2kk2WrVc6naSGS43U0gutdkq9HKLv7o3RDw+m0rQy15IRHu+Gy21uw9yB\nQwio3ZzhWhgL0F+\/L2bUpzc7034TO1VGnd5ipqDjOFUYj5CtKI8sRc949wcnOjffb6fPpt1MK2PO\njIAfXAvRz9+M058\/zij026ML9O0n\/XTrSgN7Du\/Au96fqKREsJTqhAKqLjtGDsM23LZyU3uHdWfi\nt4YqJMBUvIJGQhY622BKA1yc8NGDOx30cLVLIdy7MVdP51pt7Lm7L1VJ7xsPlTBALnfp87sDosJQ\nabN9VVtjYSt74bmIQDNdNqbhRjN1+YoZ4ESzTUp8iD+\/l\/AeLPpKv5UaHYUKQEgT8Gbcn6+uzOvx\nGpb4cGygvpx6a0uoo9rI8ubt4VrKVMXIp\/5AKUXryqin5qRmvrV7jGlgkM+Unw7I4BKBDfWE0LUh\nH3MNjnG92uNiMFrPX+yooHjQzOAgQHHAZlcRK4Jas04BJP8bucgA9Xm3JcDlpH9dazIuhE8eIgDD\nUQAAeP6MR3r2td4qzbDiN\/XWQqosfk5WCNvCPQ7o3Pm\/VZ+39STvMrjH+5s6txBmLkwsdxM9kj8H\neKRFq9vA4ADgt+jIdfKo1E64AOZUwW\/DJf2T8nBisoVYNXMC4dJyg4cPcJncCjv1mjkmF0L7pGqV\nkhxcSvgfa4UFrk222FiB7Kcy1aHcC04uuwagoH92Lkec3DsrwiGMM92VipYBJxdFJw8CB6F6DwIn\nz7ud4ti06nMnmXsdHmMEeXS+zcESnQvQCdGJS12VrNXAYfQ8ubuzPXa2I0y1KvMT+aYGiIj33n2j\njW5dbaeBSDnViJXrEUMrdxAhTet9AJwe8tJXHyXop4cXaHW5j87UlymK4OxpE9NYWJAWgtDz3WUx\n5lD0OTlYm89A91ZibB\/e\/OUyfX23h2bH3axA4Bryj7unufcC8I\/vZ1QbelQBqBYgEfpRmWuDYsvR\ncg6A9+9006P7Q2zLe+\/NIPmtOs2i0AT8crU7sv55TAH46\/oUDTSWS0Di8UcBCJd4+0GeQsNiY25y\nnsiYY2jGcEvdWuR5p7nvLkzVRL643UGAxCohXGO103EXBe3H2cRqF5Gf8nzl91uriiQo9Ds5oFaD\n3tU9HuKhsIk+XAqnnUAWX\/RRqOKEArBFBiAVQKVeAd8onulw31t+TAGrPErl7e9YJQKuhXdCAxgA\ncAHslHhf7aD8GYR\/LFRGr\/cKTNcHbVKoAQgoZwbnULWs1+022quNqXaPgU7btBsrABG23YqGn+ug\njy+6FLmodg1Q1qK8dfQ5iy53f98hcJE70+zSswm41AUid5FfX+o008poBdNi1MryNv3wCbjcNaEg\nJ\/+pPorgZCYQubAAALSoXEUUwjspod5rt6s0d+PQn5ItbsOGGqjBXrhnUagF1+Uuslx7Wufkwy8U\n5AfMumhA0KXqBN1awKLb2O9eihzmacHzmZ1USo5u7evr7LDgdWZdRKY5LGIvOY1HUv+Ic9mRHdnx\nPx5\/AwetZJYCZvwnAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/carobish_treats-1334210567.swf",
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

log.info("carobish_treats.js LOADED");

// generated ok 2012-11-05 16:39:58 by lizg
