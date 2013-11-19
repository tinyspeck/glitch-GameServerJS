//#include include/food.js, include/takeable.js

var label = "Tangy Noodles";
var version = "1348008515";
var name_single = "Tangy Noodles";
var name_plural = "Tangy Noodles";
var article = "a";
var description = "A generous serving of zesty, lemony tangy noodles.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 54;
var input_for = [];
var parent_classes = ["tangy_noodles", "food", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-18,"w":38,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIgElEQVR42u2WaWxU9xXFUdVgj2fs\nGdtjMLbBAVKgIWAEgTRdQI1CvhBwI7WiQkhUbZSqLRJK2qqbVFeq0qSpCC1JWmhCDARibLwv4312\nz2KPPfasnt2zz9ize7xgU07vewkpaSElNK36wVe6mnnb\/\/3eveee91atWomVWImVWIlPFRkP98Sc\nN7cm68098X8Hl\/ZsOjUbOIistwjz\/hwsBlZ7bkRXVTHHwo69ByKuI2cSod9I4sEaiUu\/s+Z\/Cpd0\n8A5k\/M8gaH4CXvNPEXKdxKxfgKxfmIz5vidxjD8Oeft29Ddsg7hpG6zaHXCMftkTjxkki\/GfnUn7\nnpVkIj+RxJ17JVFT8WdTfQCVlDWULTH\/rzEbOoZB0TG0DcjRLlZANnQes94cgi5DQ+230NJ8Fv0y\nCQYVUvSKTmNC\/Ryi1mKkPZVIT+1BwsZHzFKIaVMxIpPHamnd6gcF4zNgs3PzGFTrUN89CJ3mBWQC\n30BHQzUa3nkSgx1H4TYeQcC0AT5jFcaGDsNtexVjulcwNPQ6NLpOzLh2YExSBXHzHig7d0M+UAOF\n\/DJ06tfgH6\/CTDyO5eVlPd3rwKeBq8lk55LqMS3aWl+CqOOH6BGdhFb6LFLONZA2r8eE\/Blq83NQ\ntG+B+DofCfcOmIfWw2d+GmHHt+EbzyWd5mCkdw1kShGkil501x+CtGkDNF0VUHXtglWxETrpceh1\n15FMpXHr1i0J07FPAqui1OutDlxu64G057tw6r+Plrc3o\/l8Bf2uh0VWBLuqGJ2XNuLqH8vQUZuP\n0YE8hM2roWzjQN7CQYT+LwRyMNbHwaSmEnbddoyLC6Dt5kHRWgjxtVIMtT6KUfERONWVGGoSkm6f\ngstlwsLCQpIYTtyrpUm5bgIXW7tR3\/hb6HqfwJXX1+Fy3Ztsi6+LOiB6vxx+fT6MUh4B8dBzhYuG\nt7gY7uJgajQHM\/YyzEcPI2zMhYe2AxM5CJvyEDHxaF8B3FoBlM18KJoEtM5WTNuOIGjYD2N\/OWzK\n3XDrqjHt\/AWcQ49J3IqNVXcC1gZCbvT1vATpwA+g6duPsW4hepoOoaG7E6K+19B+dSc63i2AScJH\nyvM47No9GO3l0m8xAuYqdljmA+UImbfAoebANcxACxG17UbYQA\/Uko8RUQH0A9sR87wAeVMhRJcK\n4RneBxfJQ9PxCFTNJRgW7Ydd803YZQ\/rXbpNfBbw5nIaYctxpCOnkY2\/i4TvRQRGSxHSr0FfnRB1\nbwkhby6GY6gY2g4+hjsL6Gb58IxwSWsczE6tRsz+EELGh5B0FWAueojyO0gFfwSDWAhl+3oYlVth\nGVqLlP84XStA6wU+6t\/MR\/M5Pgy95VA2rUfPxXwoel\/G\/Pw84r6\/6AnSc9tKEDAchV1eDnWrEEME\no2opIpAihCdKMNZbgintWvTXl8Oo2gWT+jFqEw8RSyX0fXn01ByqEAcDdXlsShs5VN1cNP6Zi5bz\nXGhEQoxL19G074FdvRkOpRAq0mP3ZQGuni3CtTf4sEoqCbQCUtEvWUBmWDXNa6sZwAPMVtT2Y1ik\nW1B75WWMiPdhynwQktadkF4XwjtcRiBCsot1UHZUoPs9Hq6d5SFoPYjo5DZq8ZOkqTx4RzkE8TQy\n3nWUn0PQ9HnSci4NGZc9P+neS9A0LI0CmBVfIn1+FRFrNfxj+2Doq4BDvhFm1fNYWlpiAe\/UYHJp\nwU9a2ABZ08M0oQVs1v2Jh4GrRTCLS0l7hTR1ZVC0PcoCKtu4MCs5SNgLEBzPh28sD2kXBykXtT18\nBNnAVxCf5BPUAYQmCmCUcRGz0pC052OArKn1HT5aztGgXaJ9TaVwKithGiBPNbyID+MfQxJOzTKu\njkSwnkpdRieXY6RLiN4rJbDJ1qOdWeyvfGja+WS+xxGbep4mdDOBFbKT2VnLQ8j0RQQn8mkauXCP\n5NJrcCumdHmwqbhwqASIGIX0BinC+KCAZCBAwxvFqP39Wrz9SinkjRVwKiox1v8UmHlYXLop+ZjN\n9LtcfH88zWJH\/XJq6yaYqGou5Qbou8vIVLdAUs9n26Rs2wS\/rhRTw0Ko2z\/Yp+vfQ+3dhAkxBw7t\nagxe41DbeHBquFC1c2BVkSb7ebArixEcWwPDQClZGEGeK0Jv3VaMSI7DrPsDe\/+5G8sIZG9U\/YsX\nyqzemslQHDf\/dguLCymMq16lodkBWcMaWOTbMOM4TG3aBb\/pBFsBpmoM3GAdVW9CgL6reaSrHHaf\nuiMXsUnyPkM+Bhvy0HWJi16SSscFeqg2IUZ7SjDSWYLG80VQ9p5ELGpk4Wayi7BEM2fu+TaRWbwS\nUzjJnsiAMjGf9WFE9iuMdH+BWr8B2i566vcL6BXHg6SRgShizVdMIMwwmFVbMGX6Gqs3xpw9xq+T\nxTyMtgsCvHdaQH5XiOHBY0jPDN3WGkKJDIzBOCzTab0rAf49AZlWy20+vTmSgm0mw4ImEu6PFlpI\nqzAbPU8fCT+HSXkIHjJpw4AAXRe55JN5MMp5cOnJqHVrMW0uQmCcD4t6Gxz6o\/DZf4dYqBPLiz52\nrUR2HhPeCAZNbqicQQYuaUksVP7bjwUGUusKsZB2ggyl5+GfCWOaYDOLy1hYvokHCea6zOIS\/Kl5\njPunWbA74WzRbNV9f9EwZVa7grW3IQOpOQQYUFrcm5zDFGWQtpkMpD5IH53DHLtbWqczH6UhmIDY\n7LkTTn9flbtbjPhi1YZQUs8szNzI\/yEEA+hJZOGKZ+GMzcJByUhi8g6QuyUDJ7VMsYBad8QzOZ0+\n9Zl8WTMLmSKppCs+iykCexDAUe80C8ZUzRRJnvnEYfhPQJmW2GdmWbD7AWSqxkBpnEHPeCD+3wH7\n52A0Y41mTkySZ9mm0xLbdEZC8BJL9OOp98\/Uyia9p8YCyapVK7ESK7ESK\/FA8XdY6z33VJ0RRAAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tangy_noodles-1334209313.swf",
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

log.info("tangy_noodles.js LOADED");

// generated ok 2012-09-18 15:48:35 by martlume
