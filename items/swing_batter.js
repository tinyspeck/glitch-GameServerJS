//#include include/food.js, include/takeable.js

var label = "Swing Batter";
var version = "1354672041";
var name_single = "Swing Batter";
var name_plural = "Swing Batter";
var article = "a";
var description = "After roughly chopping with a knife, this batter is not mixed, blended or whisked, but swung at the end of the arm. Swing batter, batter batter swing, batter (as they say).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 31;
var input_for = [2,20,24,25,344,350];
var parent_classes = ["swing_batter", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-20,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGLUlEQVR42u2Y2U+TWRjGySRzMzfG\nZGIyVyRmbubCeOEf4J1XJib8A17PjYjbxAiiiGyCpVhraSkFKvtS9i4shZa9lIKUpWUpyFL2ArIo\nap5536N8gWGYgQHxYjjJk3z90u+c3\/e87znnPV9Q0Gk7baftf9TW1tYurq+vXyNF0rWMZD2gZPwM\nP8t9HBvQ5uZm8MbGRih1rHv79i36+\/thNpthMBiQk5MDrVYLnU6HzMxM6PV6cS8vLw8FBQUoLi4W\n\/ysrK0NNTQ2am5vhcDgwOjqKubk5cJ\/cN49xaDAAZ\/iNvV4vKisrkZWVBblcDoVCAaVSCZVKBY1G\nc2DAiooKVFVVwWQywWKxoLa2VgD39PSAX5zH4jEPGsbrk5OTPqPRiOTkZCQlJUEmkx07oNVqRWNj\nI+x2O9xuN7vq47H\/zTUDv1ViYiLi4uKQkJCwC5CVpohFjvopinSxKEmPhCEt\/KsiUKK6gyLlTRS9\nvIlCUoGC9CJUqCTtISr0sTCX6VFnrtwFyG62tbXB5\/Oxm4Y9bnLikgIczujoaMTExOwCZOCc1Eco\nfnUbZWpS6heVqm7BIBSGkldhKFaG7QuYT8pLuYFc+Q0UKsJgzJejvta8C7Cjo0Pk+erqakCaTExL\nP3xsfVRU1B5AhSwOpeRQueaO0DZgffYD2PIi0CgUDmtOON0Lhy3\/IVwVsXCyymPRWfYUnaVP6f4j\nmDPvCziGFHoRBkuxEraGOgmws7MTAwMDYCbhJCfo9PS0gNoJmBgfg9zUx6hMuyvEcO0lUfC3KfF+\nIIuUic3+DGz0ZWC9T4c1tw7venVYfZOOlZ50LPdoEejWYsmVhqWuNCySFpwazHdqMNogR3dVPOpz\nIpBPLmen3EZVoUYC7OrqwuzsrJg8HN4ALx2RkZECUP7sMUo0D1CtJTDtF7gKzV14659jy6PHh8Gs\nIwPOOdSYJc10pMLfroKnLhmNuZEoo0g5my0C0OPxsIsBdlDMLgZMJrgq3T1Up9+VAE0Zf2C2Q4Ut\nr\/6bAU63qTDVqsKY\/SUa86PR7WwRgMwmABsaGvDkUQTKtfdRzYAEZqdc8tQm0QBqfPS+PhHASQGp\ngL08FUNDQxKgy+\/3f36ZQK5l3JMAF52p+DycjU9Dr08UcLL1FRyVMhDTB2YLogs1kzbVFEiAztJo\nYCT7uwBOtCgx5cwV7s3PzycH0ay5\/nVvRHvta9gLH+KjJ+u7AfpdeXi3uozFxUWeLMFBIyMjZzgH\n+QZDTnvtwGj2iQOyZvqMAm5hYQG9vb0D0k5Ci7TB5XJJkDNDDqwPV50Y4FyvAX63WYzN6x8v2hxZ\nCbClpeUyb+A8tVdWVrA0SSu5IwnvPflYG7dha9x0rIDzDhWWu9OxOVJOBuTj0xs55gdqwNUTb3tN\nTU2+PcVCaWmplWwVGzYtkNh0PhcPztpj4W3KwrvlOWwuDOH9eC02vUWHBlzqycS6W49P9IJwp+yS\nn3KPXWM4Vnt7+96qhkqii9su0uzBhy4ZfJZo9NlzsbS0JIV\/pwKzVH0sftHawm4FZrwYaCnEsC0d\nW72pQF8KVtsThba6ZRIcG9BuM0pwFE3XviUXuSjjbWb4TbNwcMD8HBMTEwgEAgKQwVmcxKzt3zvF\nK8L29aAtAyPmJxj+G7EBy23P0NuYLcFRaAMUxf2PBFSan6F92eXttmPaGosukxKDg4O7ADmJae0E\nFbWiGh4bGxNl\/PDwsMghjoAkN+2p5ngB2WbKQJ3FiEFTnATI91vsDRLgromxX6PK+NdWW42fH+5u\nyBM5uRNwZmbm4IAkZ0crrKZizitRRjnMWgHI4e2vU0lwdF6RHfhMolarL1OoZ3lAduwogCyu0rev\nGYYjs9SSAKe1cBsu8tAHp\/j4+N9obeziQTmvjgL4V9hmox5eSwJX0ytUA4b+52NnSEjIL5QXv\/PA\nU1NTxwLIYea8a2209JeXl\/985LPx1atXf6qurr5MnRsY6CiAfX19vIys2Gy2W9T1D8f6VYFBaUZf\no0njYjcPC0g5vUIhlVPOBX\/zTyAEFDw+Ph5KgAYafOsfAF0kWWtra8ilS5d+\/C7fa65cuXKOBr9w\n\/vz5C2fPnr1At1jnTr9knbbTdkLtTzn4wDTeWKNWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/swing_batter-1353118009.swf",
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
	"newfood",
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

log.info("swing_batter.js LOADED");

// generated ok 2012-12-04 17:47:21 by ali
