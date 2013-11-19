//#include include/food.js, include/takeable.js

var label = "Bubble and Squeak";
var version = "1342483399";
var name_single = "Bubble and Squeak";
var name_plural = "Bubble and Squeaks";
var article = "a";
var description = "Meaty, carroty, potato-y mush, fried to perfection.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 60;
var input_for = [];
var parent_classes = ["bubble_and_squeak", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
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
		'position': {"x":-27,"y":-23,"w":53,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGh0lEQVR42u2XCUyTZxzGG3fhXMI0\nzjh1YFS8EFHUyuVExcUrurgtcXNKdJdbNpnRLPOIuE28kUwuwaMqYpABHafcLaBIkVCwl5RCi2Bb\noPABrZVw+Ox9X2zVbCZO55Ys\/SdP3vTr8f3e53+8X3k8RzjCEY5wxP87UBnojIvDgpAwTgjBMAHy\n+SGQrqYKou\/9J1ANGXxPY15AsC7LT6DL9NMaLrhAH\/EGuk86M92KdcXVk3NRdoqvbcrxD67Pn\/Pi\nQVG1wrU+w0fYVrRYq89biPq0Bag8z8fNS77Q5wagIcMX8sT5uJngA1PRUphES0A\/Z8yYBy7ZnbPG\njxQiflQIYnn\/LCxO8jzvn3MW9Qo9Yb3sBuuFkTAmuyNp70zEfufOdGabOxRJ3gzSJlHkHLYBy\/kR\nQLIHcMmFrf1nhkobsnxd\/zFALn5cMHdiCLpP8Jgajjoh58i0x2D0BNiYOoPpttCLXSOpH1xTvWCN\neQk90TxYInhoDR+C2hQfLapWeT43XG\/58mCaqsZ0Hyij3oHk0GjkHZ2OW8ne0KXxYUocj17qzDln\n5tCAwBm1ceOZc9q0xagXDqbekDYXlZFuTFIB2UC6P9rFS7jnbqKu\/MWwFK9Af9VaGPMDIEvk41bK\nYCqbs3zRHfUyBuLHDMKRtTHMCdmHPe2pp2rKDERnyVKUxc1jpUCvlcbw0Vq4CK25i0TPDJdzaLan\n9LQ32gvW4k7BauiyA6AvWI7mnAUMMP2AF5L3zIDmxAiYjvNQe+R1FIW7ozFrAUuvLcW3s\/3ZaqvV\nstj5MImXEfDFqDk1C21tbQKO49b8bcBDmycL6I8KdnihKT0Q5qsfY0AXjX71Hlgla5gLtFFUv\/mR\nlPtCleQHrvg9tgGaYirqug2SdjQVheMqdkActYAAT0dHR4ddBFRIFATgyalXKpWu1dXVgitJ0QgN\ncmM7T\/t5FnLDvJG6bxbyI1bCVLELPYq9sMq2o1\/+FVD9IXpvrMJd4RT0iPzRURyIHslKQLqGpZK+\ntpYvh6ViHVqKPoVG4I62X1+D+qATuKYaCsbU2dnJ1NXVRSU1m83BdrDKykpniUQSolKpuKamJuj1\neqSE+uD4lkmIDZ6IjAMzcfizifhpwyQc+3IKOnMXMVmuB6GvNhRQbcWA2A+Wi6PRUbiQuUahKXy\/\nYhvM1btx+8p6GIreR6toDaoPDEdNtDdKshNQWloKmUwGnU7H4Lq7u9Hb24sOAm0HKy8v5zQaDQOj\nMhgMMDbeJAP5I1Sf8kB7NhnOsS7I2zcGZ7dPhDqBj7spU9GX6YO75IasBDQHAfVOoHY7rNXbYa76\nAYaS71EaPhM5BzyQtd8DFecDoc1cQU6bKbieGYHCwsLH1NDQgJ6eHujJ\/WUKpZBH4KREUCgUDIqB\nGY12Udi60nCYcpehN4YHxPHAxQxFTfjbaI0axl53R76CznhXdBd\/AKsqDJrkALSI1yI71AOngx92\ndNQ30xCyfiJKI7ygiZ2M4ry0x+BqampgNlugVtdxMqVyML3UVgpYUVFB3lAzqJaWFrtaW1sZtESU\niMbIsdAf5dlVHuaCmiMjcGbrVAZQeGwujOKvYT73FrQp7+LgJjcc3jyZ6ZeNk1CwczjS906C9Iw3\nxNkX7GBVVVWsSahrcoVCKpPVPhzipGOC+\/r6OApB64DuorGxkYFRkTHAROtSJBKh8EoSxIKNKDnu\nBknMTEhivRgIBTz2+WQYS7ZCFTYK145NhSbaBYr9TlCFOrGTpCvqVZRF+9vhxGIxyxB1rVZdB7lc\nGf7kMxcIun\/\/vshisbBiJc3CnDOZTEzt7e1obm5mBc12TkDVaZ\/ARObjpd1TsWvdBFabBtEWUm\/u\nJLXTcD1qNqRHx0K6\/02m62c3oCgvk32f1DxrBlZrcgVHpsfCp3s4AFyJwok4ajtNOQV7dF7RZrKB\nlhUk4Gp2HG78\/iOuJWyCIXcdbkR7Iu7bCZBE81F75QtcSw2xg9kagRpBXaONUF9f\/2xHns1VUgKs\n\/WnKbbOKivwwyMz8UydSFaQJUJB1+bFrtNZpudhcszfCcz9yPeLqwMAA2z1Nj010yNbV1bGa+itY\nWtd0czbXaCPQA+HFPLg+cJWsoM7eu3eP3ZiK1qltVFFRcLqh\/v7+Bx2qJONMFfLv\/Bd5xFUCzCBs\nolC2sNeaXKF96kZ4ka7aorn5Dhq0OubaczXCC3A1hEh4545eJJcrRKTjgxz\/fR3hCEc44tnjDy4U\nwoa5PWFuAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bubble_and_squeak-1334210441.swf",
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

log.info("bubble_and_squeak.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
