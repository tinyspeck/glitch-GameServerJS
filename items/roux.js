//#include include/food.js, include/takeable.js

var label = "Roux";
var version = "1354649347";
var name_single = "Roux";
var name_plural = "Roux";
var article = "a";
var description = "Roo!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 22;
var input_for = [42,47,48,51];
var parent_classes = ["roux", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG50lEQVR42r3YeVATVxwH8IhVFIqg\njdQqN5EAIURRrFYUiygVUIq2WpVigRISCEFAKSAQLhFFCAIJIIeKSgXLXQgGw9aKPREFdWx1Wjud\nnn9U27HH1M74bd7i0uroKGFxZ36zyR7zPvt7+3v7djkcAxZdmYttb5kwiFK5KZjQqYTUQ0MtVDLH\nkHN6KwQizngulErYQqlFoNTuBoeuzO1GT76D+bgAtUo7iioVGIzrLOKjImkGxi2D3QUzqZ7COThd\nbA9dqTPd6KkSAbqLXdGlb7y9YC5a9vLwXp49GnJtUZtqCfUOC5TET0N2+ASkbOUgcSPnKQFL+DSQ\n4AisKc8O9VlWOJL+AqqSuVAlmkMpN8U+qTFyIyciYxtn\/IGtOVxo948NKN\/AwSZfTtC4AAc0SR2n\nK1egs8AePQf46FUJoSl2eSSwMMYEeVHGyAw3wjt6XNwbpoh9g0uNWwZx9njLhZIoXNZU4\/IHKgxq\ni\/BJiwJ9LXL0NoihqQtDa\/VmNKjW46jSH9U5q1GdGwBVxioURy\/D\/vULUBOyYuv44D6u3\/ZVuRTa\nhJdwXVODz4\/uRc3rfFRvFKE+di2OywJxVDocNeG+KN3ggQPrPVAcPB97\/HhI85qFKL4RUrysf2kU\n+7I7zGCgSfRblxLtodYYPLIL17qq0KeU4FAwF1Vrp0Ptb4EDq6eh0OdZ5HubIMdrChSLJyPVcxKS\nPIwQL+RAJuBA7MRBhCMHCl\/+EKvAO+eOfaONckJf7npc6yzHF+0qNIbOfXKgOwFOgMTZCBG8CQi1\n5yDPX1TLTvYG2xRXCl7D2V0+uNZeii\/bSvBJaTSObbAcHdBtAqSuz0DsPAnbHIwQ5mSC2rA13mMH\nXmy7dSbGGUPVCfiiuRBXm\/bjVNLKUQNjXDmQCiYhytUY4XxjbLHmoGDdEt3YcJc6RLd7K6AT2+Fi\npRxXT+7FlYY9aNpqM\/oM6u\/BGMFkSARTEeE8lQbuetn5z7EBh9q9b2qKhoHl0bjybi4uHc9G46ZZ\nhgGFUyAVmuJtV1MamLLcCawBB8rEuHQsA4N16QYDZe5TES0yg9jNjH3g+QPhGDycggu1yWgI0QND\nLXH4zZmo2TIDBzfNgPo1C5QG658eAWaPBMaKTCGbZ44od3P2gf3KUOiKA9G02xXHM+c8NqrkM6FY\nbvwA0ASxHtMhEU2ngclevL9YA364LwjdRUv1z2BvOp4EWbfrBWSsmHxfF8d5chHtwaWBiYvtbrAG\nbMhywE8de4C+k3T012zBV407achHlcHo3L8IV+tlaM0XojGXN3IR1fEz\/wPqM7h9kSViFlqyBOxv\nNMdQBzrlNnRjBEgaZnAESv4z28mabD+jegU3NcU0nJyXG2gy3MXznkX84lmI9ZxFA\/MDFg6MfaDW\nA9sSrUeATHa+bc6ggUN1EXSQ\/X9TdTSeyTQ5lmwvE8+ggfL5Zkh4aTbkL85mF9icZEU3RFBMdgiK\nyRoDJCjS1WTNdD+J8hjuMNBjGnZ4WSFuiRUNzFkzv4sVYMvO4QwSCGn8dk\/lSLEQIIGTbJF95Diy\nn1zIg8C4BebYucxmJINZvm61rHYxAZJuJPcWAyQ4Bkz2EShZE\/iDwO0LLZDkbQfZvXuQNSBTJARI\nuo6g\/t+9TGUz\/wmQKSByXmGI+T3gdCT7OLKfQUrmhHqF1UjmmAJgioQpGFIgzP1J1kwWU5dNooEJ\nL3KRsnIu5Ivn0MC8gAXqMQPvXmyj+hUroUlwHukyZtwjazLukd8ERdBMkO3kYgo3TxsZB5O9rZG6\niq8vEmsaeCjcX8Ea8LTMDZokTzSkOTzRU6RS+hxy\/abe96hL8bZBmp8Lti+1YR\/YE+MC7XZPaGIX\noHHz84+cLCiDzLDH1+Shk4XUl+2Q\/ooA8V52NLAqzD+INaBWyke3bB66pO4GT7dSfeyR4S9EwnJ7\nGsjSlL\/10NcHxTgVxYNGIsD7kS4GA9NWOkIRKELickf9vJDLElD\/0kQDI+3RGemE9nBHg4Hpq3jI\nXDcfO1bw2AX+WJ+M7ghbdITZozXUxnDgaidkv7oQO3342LHEhiWg\/sUJ55uhFc+lX9xbts42GJjh\nx0dOsCc9UO\/2n\/cHay\/ud\/ubqOvqCLS\/aTUM3GgYMHutu75I3PXzQgsclaxTsAbEQJPtPx\/W3rqh\nqcD5CrnBwLwNnvSMWh3ic5X9j0efnhDdOXvit99\/uI6Bw2mjBsrdJyLTl4dDbwd8xPrHoxHkuWO2\nf\/ed6PjuZAE+L5bgg31vPRaYsmgKCgP5qJP43W5LClFwnsZys7PM9tf3y5U\/N5dS3zcqqWuHs259\nViDBubwInMl+C7r0EOgyI7\/ty4+jenfHUNqsyLied14fddb+BTdLk3XaRuXPAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/roux-1353117915.swf",
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

log.info("roux.js LOADED");

// generated ok 2012-12-04 11:29:07 by martlume
