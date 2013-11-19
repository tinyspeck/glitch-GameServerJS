//#include include/food.js, include/takeable.js

var label = "Basic Omelet";
var version = "1348009778";
var name_single = "Basic Omelet";
var name_plural = "Basic Omelets";
var article = "a";
var description = "A fluffy three-egg omelet.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 46;
var input_for = [];
var parent_classes = ["basic_omelet", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
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
		'position': {"x":-22,"y":-23,"w":43,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG+UlEQVR42u2Ya2xTZRjH+WiU3bv7\nRodO7mMuoIIXSljQIJIZb4kiokYhXghxfPCDH4wxasTgLahElAFxCJJt6HBu3AZj7MbYYB2DjdXW\nbbRrt\/W0o3NAwb\/n\/9anDhWTdkAw4SRPTs95m7y\/\/p\/r2zFjblw3rtFdWn10dn9dXOVAXWyBuzEm\n6roDtFQkW7v2JmKgPg799XEljrKxJmf5LdnXBdxAfexb9qp4BSeQfYdi0bsnCgMHjJU0e9nYj+3l\nkSuvOdzx4vS8U2Up6N4XAKP1HoxHx85UOA8ZoDUkwX9yHjxVU2H\/ORL2n24yXju3fh8TZS4epx0v\nSVdglvJkBUXA0\/sTIKq6DydDa8zFUMN02MsiSq4ZoLkovaC1eBx+qUhWUDQC9tUGYKkiQQnpODAB\n7sqZ6K3Q35VH5F11OEeVwUTl6FqCEIhgBLLtTlKgJ35IC6p4tisPbVumw1E+BafLIrWrCsky4qyO\nt4pSVJFgTBA+nyxNVWryPeOTgIMdT6CtMAsdhXGBWNTNURax9KoA2g\/EV1IdAhKAUIQjEFWVGKSy\nkjzulifRsj4FPTsjg4A0rSbTdEXhXDXxK7kxXUc4ghGUd4JJJtMIqQCPTEDP\/vno+XEatKrxlwC6\nD+dYr1y3aIg2STIQQNShmqKegPMurveap6JnXy56vp8INNyL4cYcuPYkKkBXVQYwuGr0rnY3RRsd\nBw0aYQgmiUAAgvHOZ65JYvBZEqR98zQ4Pk8Ftk7A+ZLJuHBsjgIlpN\/5QvOoAftqDM0jY4oqSQwS\nVtTjGp8lJvl8zrEM+9+8GZ6KbAU4VGAE2uYp6y6NwdnupzC6VqYPAISTmONn1j4aYaT+UUV+JiiV\n5vrgcd2dtYtg\/sAAFE1WgMp2TIWv6k5Yi5Nw0f2aFjac3viXSsCzfHBTbi5lRToG3\/NOeK7zu+Le\nli9vQ8fqWHjWp2F403il4IXCTFg2peE329N6DOZ\/HPYIRZdyczUA1Abcx3dSoOlGqXeElc\/8rtZk\n1N23DHXvRgdcWpqFoeJJGCrLQu8XCdCaHwS8+c3AG1FhF2OqIRMK3ShxxjshJIMJLJ2DxufzjsWw\nbJsBV0HGJe6lkvbSDMJpYcOxGEtSSOmgSdzJmhRmfiYwfwTXNfNs+CzP4fDbkQqKLnWuT4X1CwN+\n3RqhEiPs8uI6FFcgTZ4bUyFCEkQgaXxPdblGKAKqcGg04qK2As2fpKPr00QVc+7NGTjXeC9ObY2F\nY5cBv3vzrWEnBdWRxCCEbC4dgirJe3GxDAt9dSnwu55H5w+zUPehAUNVM5UxBl0Vd6hWpx2ZAZzJ\nfyv0pKiLzqNK3JhKiFrcWIoz1\/lM1eQHyHcJd+70E3DUPIT6jxLh2p0TrHf+Yya0f5ug1PM7X7SG\nHHvMWHYKcaMkA8EkSSQ5Ro730kH6m7JwoX+5gmv8LDkAd\/IBoO8V+O3LcWJjYFAYOrUI8OWHdlYx\nF6Vmn9qZqo10owS+lBPJWikhoqqzJhXDtgUqIcxfZcK8JgGD+lDgLp0CWB+Ht+nhIFxYru3al5jH\nTJSWNTLoJWODB6E\/pxbGG+E4BFA195HH0Py+Aa51aSpjbWti0PGpASc3p6NjS1RwKLjQ\/2poPddZ\nHbeUFV\/6K11FKOkGMikLpBRsnjGomr9vBdoLsxWcb8skoDgLng0ZaF8dAdv2v0Yqxt35089qIblW\n4KQziILiYmlpfBdMFj0JfrPkYrjredgqTGhcq6\/rBdjfaAIOz8PZPfdBK5mo6tyo4Jitv+5J1KQA\nUyUJfAl+vpPJhIng67hfgbUXzVBJYNk2Ed7quwNZymToWAhf3Z36mSMmCNZ\/aCLO9SxuxvAqY0jZ\n2lmWokl5kMSQ84V17+0YaJmryoXn+AJ42p6Et\/0ZNbKbv7lVZSfr2YlNCWjbGK3Msk0\/1R2Yg4Ha\n+Wo6UZk6mF\/ATuHePSYq5P5KVUYqpsrHwTS4W0062HPorV6II2uNMK836gDj9fqVqR9wsuGrnY22\ngnR0bo26ZGwf6U5V4868bgq3S5QEu0F1MjwtOSqmqBanDtsOHWBNEpreiYCvZlbAfXqpoPuo2tF1\n0f849IgN1LMOvlwZVvOXuPMcvR3etly9kT+i3EbjYeaXkplofU9313uRsH0ShzM1uXrMLcFAwwJ0\nV9yHzu8y\/lU1xphPjz+\/6yUN3lWj+9\/lbM+jmrNhkWpB5q8zYCm+A7byObDvugvdO6ag\/Wt9Av7O\nCOt2fRDYHhW0v0Ox2A5bH1NTMAfNkBLgv67BziXawQ9uQeuGyGBwXw5CzLkvBZ6j92Cwda4ajziB\n6IFfckVOYX+\/WIeYWb97V1XS6BYqwc1HGl1GGL9rGfg9tiYMvp53xZQKCVrPtsvZjf+M\/2\/XH5Ib\nMLNJzuBHAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/basic_omelet-1334339809.swf",
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

log.info("basic_omelet.js LOADED");

// generated ok 2012-09-18 16:09:38 by martlume
