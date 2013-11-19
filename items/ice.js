//#include include/food.js, include/takeable.js

var label = "Ice";
var version = "1351808633";
var name_single = "Ice";
var name_plural = "Ice";
var article = "an";
var description = "A nugget of purest ice, plucked with a scraper from the Nubbins of the north and ripe in readiness for sno cones, cocktail making, and icing the occasional strained glitch-groin. Basically: frozen water in pleasingly cuboid form.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 6;
var input_for = [64,66,67,68,314,315,316,317,318];
var parent_classes = ["ice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.crunch = { // defined by ice
	"name"				: "crunch",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Break it up. Costs $energy_cost energy per cube",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.metabolics_get_energy() <= 1) {
			return {state: 'disabled', reason: "You are too tired to crunch ice."};
		} else {
			return {state: 'enabled'};
		}
	},
	"effects"			: function(pc){

		return { energy_cost: 3 };
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.achievements_increment('ice', 'cubes_crunched', msg.count);

		if(pc.metabolics_get_energy() <= msg.count) {
			pc.sendActivity("You don't have enough energy to crunch that quantity of ice");
			return;
		}

		if (pc.achievements_has('ice_cruncher')) {
			pc.sendActivity("You have chronic brain freeze from too many crunched cubes. You have nothing more to learn from crunching ice.");
		} else {
			var context = {'class_id':this.class_tsid, 'verb':''};
			var val = pc.stats_add_xp(3 * msg.count, false, context);
			if (val){
				self_effects.push({
					"type"	: "xp_give",
					"which"	: "",
					"value"	: val
				});
			}

			if(is_chance(0.1)) {
				pc.metabolics_set_mood(0);
				pc.achievements_increment("brain", "frozen", 1);
				pc.sendActivity("Ack, brain freeze! You can't feel your brain. Brrr…");
			} else {
				self_msgs.push("The ice is crunched into many smaller tasty pieces as you crunch away. It is oddly pleasing.");
				var val = pc.metabolics_add_mood(6 * msg.count);
				if (val){
					self_effects.push({
						"type"	: "metabolic_inc",
						"which"	: "mood",
						"value"	: val
					});
				}
			}
		}

		var val = pc.metabolics_lose_energy(3 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'crunch', 'crunched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be scraped from an Ice Nubbins, located in the region of <a href=\"\/locations\/hub-137\/\" glitch=\"location|137\">Nottis<\/a>."]);
	return out;
}

var tags = [
	"food",
	"basic_resource",
	"nobag_food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-17,"w":17,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGSElEQVR42t2Ya3baRhiGs4MuoUvo\nErqELKFLyBK6hPzuOa1xGsd3B7ATBydO3bQ5aVyndYxtjJCE0AVJSIgZSfgWO3XnFQwRKheBc\/Kj\nnPMeY0lonvluM\/PdufN\/\/syUg7sZgd7PlOlOnwT\/+5myf29GDL\/9SWh\/80Whfqyefw0ABkJ+rtBw\nQSL2apVIcS1KpI7rDyv08EGFmOxZpStMINOZQHAXE\/hsYD\/IN191rUUeidRbU4jw0vBLguPbTisM\nIdENKPS3HTQKOlWfqERgOlmvkYN1lWzmanR1WSZPlyRSYO\/YwATYO\/e7ug+rwwDTuZKBzYmUAuyZ\nRg\/1Zuid++1rtxWe7zOgTZVI2wb1h+mF4XvPdb9R0KgO+E2NipjAhkoOc0yrMtlfEFt7Dyq0AeBU\n1u1ZTaA3cBssAYtxsD9N32KwNWgc4Dg916m7pVOLgcsIkwcCOUMoDLcamwHihsXQblYhu+8tXwtJ\n+zKk7atiw3c5WFy3AYwLoLAqxh9mteysQJpsJr\/9UacSIeHZVXB6Y3nh6bbhq4PgILjxNmCvzSDo\nfPcJvIUk7AObEYLvQL0g0Ze\/6GQXcQYw5tKPw6wWF2JsGrB3dtA+agRnv9aD3rU+QO5OZFWuRrZ4\nnAEOSgMXWVCnzbRQgAGU3Wp\/wN\/k\/R4gUntWoNdIf2Sn7YWUg3ExS4ajXJsWEFDvG8Gp4bUvmQH+\naZL21Se3DgFE8VyQSQUXuEuHCZkLKW7oS25IIJQYZDP0zgoid0FlJziX3OACAhClnzwCONwfNRnw\nMMNtdwBZ1ccFFNtRgJ9DgHtrBuG4EAAP2CLAeZE4uKC4gcNfBOsk3fqq7uvcWohLPAOLovSkBRwU\nb+MAM\/A1L8IcLk1SJMXAXQBwt8JaScB4po5Stw5m7kQLP1spALhn+gpewi23oXjqY9HWk8L1uDgg\nW8KM+CCAjcMhDtOtKn4Dq0m0knS3TDfZGimhKKMYY7C85GiPiqqVVksnRj0nOtYLnfRlbRxQbYYX\nkwOiBjJAXAAg3MvW1dr8oWZOAggtFGvuyrEWbkiNXulg8fmRA6LETAyIT3czYL\/SqYAEyI6wHizV\np5JR5\/cWjzRv+UhtQ5tKMxoMtY4Dpt84JAHZVootbx7iMAJkcdZnmSPNROw9ZZYdliC491TxLFgP\nKtS8aDAkzCTxx5e+JOAOz2Rsm+BiDgewSTI5ORgHhCXTAiK58soIQJ4k8QydFhDW6JSu4CItIErU\nE5UaccBMEnBafQ5AWLsfkH2Z7dbC2wAO2lXzUgPQSQDZ+3S2u8r0AHmxxllhWkD2+yI2m8kBpwHc\nNX1jrsKWuiQgO8iUp4Cr4vDTnaCMMhHXNIB7lt\/sAfJiPSnguuyoi8WaNrcvjRQAWY2UV8tm9bFg\nqRuyY7I66W5prYFHBKzhgwHZ2fWtSceWFTYJceWkLs4fKLVxcBxw1P1lVmdXS4a5LjXsv0wShcTb\nuq9hh98HiOJYcUJ72O4ZSbAmWJU0YIsHVR3C9zMafkwzkc2SZuFZAKIp0H8m6QJiy0Va7ctkjK1V\nbJGttUqagaA9w\/V2JNPBd8sh5+OeXy4qut8KrgISfnhjUBnhhrNx71QXAbLTPc6\/ODAhFqGc5KR2\nZdx6tVZ4+lppuPi\/qDl0HFyz6V+qro996GGeJdy8RGm0H4wDsoPTIjYMsCLbMBwjsCcB4wJYHHBb\n0Buj4E50JyjIjgSr5aotZU6k1\/\/pKgAQh6es7B5N4sqk8iWtDjioaLUiy+WP1fqw5wtC3cCYDK60\nLNOQLRjKwL4MGjbM5wIeXjrWpYEvqxgWrIL4wuBcx3bL51BxccBBQtisClYZVlurkvrDCmmicTCi\ng+XfgxWROStVYmM3gVnhBXA3S5KTlbIpPBMt7Y3qNjC47AXhILBxgHhPXvGKOfZ+5s4QrRZ0Nsa3\n2dD66DQnd6KGYwc4gkZPcElqaWi\/ARoDALxQdaXf9Za6b9PGoUVIxfEDDogJ9MVbyRBzVS9acdAt\nmy0T6dZNTLygAx614dBovEEnAr1C3l2NGpQxASJudQj\/R\/e41ZgRUlltauhOSGS5pVGzcL6GlbPd\n0IgrXyMCYo154xq\/\/aJ966gzFp0Oe+FBYGWEBsQS4AyhAg988ab6sA9AIkt3NS3Yvx8GkjFhWbWm\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/ice-1334211869.swf",
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
	"food",
	"basic_resource",
	"nobag_food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crunch",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("ice.js LOADED");

// generated ok 2012-11-01 15:23:53 by martlume
