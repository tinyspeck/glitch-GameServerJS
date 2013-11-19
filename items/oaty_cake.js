//#include include/food.js, include/takeable.js

var label = "Oaty Cake";
var version = "1342483399";
var name_single = "Oaty Cake";
var name_plural = "Oaty Cakes";
var article = "an";
var description = "A slightly dry, somewhat crumbly oaty cake.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 32;
var input_for = [];
var parent_classes = ["oaty_cake", "food", "takeable"];
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
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-28,"y":-26,"w":53,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHIUlEQVR42u2XfVAT5h3H\/adrbaXQ\nilaqLXNVEbWjPZXaFQUUqHVOrtabdq5Nz7Zu122NIViHMuJbtXMqlVEVUcOLQQiEl4hgIEAkiETe\nhLyQ8BYUeR0viiKIet89v6dNxm7r3Xrhtrtdfnffe557Lpd8+P7ejkmTnOEMZzjDGQ6H7PNJizMj\npviT6J4q\/tF6+fYnt9KdJA9\/5lcXdnsk5u6dFZe5yy1MJnrCd0IBFPu9PeV7XvUvPLYktCphaYky\n6nlzwZ\/nDBVHLxrK\/2rukHLPzGH1EW+UHveFNm7F8LWEoLHKxGDQWR4feF8nDR6tTl4NnTQIxV\/7\nQL598qhM9GScLNxdMiGAtckBkippALTH30LegblIEz+DjAg3qA7ORt6XL6P46ALozgSg5twaXIkP\n5GJQ9ntV0mpo\/roUWVEv4nz4FMhET+HMtqn4RvQKJgSwIWOVwJwVAnNmCCoYSHbkc8j5kzvSd7ji\nvPhpKCJcoYyaCuYkVH9ZhLK45cy9EA5XeHgBlLtfQErYZA6WLHwKJ0SeiA3zQtyOBYgVz\/Z0GLC3\n\/FNhj\/YjjOlFuLhnGspOvgb1US+oD89DdaIfrpxcgqxdU5E6Dlb+xRQGP5m9u7E\/5FnEizw42Bnh\ncxxOGvkqVLFv4bhojr\/DgGN6sdCS\/Q7MynehOvQK6uXBKDo6B5ac9WhRfYBrScuhiV2CnCh3KP7o\nxqBeYKDTIds+HfHiHyNROBknwuchL+ZNpEVMQ5xoJtIPLkYpy8aEAJoUKz3bCzdgpE4I3Vk\/VMpW\nwZAWiL6yLdDnbII+PQiFh15G\/v4Z6NMK0Fm0GRWnVkAasYi7dZrVG52KQ0uRtm8h8g55ccAL0cug\nPukndNxBg0hwt\/K3aFNtRAFLbV1qIHfNkrMGRsVqlJ3+GUqOeUEbMx\/0ub6yj1ArC+KAsr2vQR7p\ngVjRXA45XpRm7ZkAxzsZLTtce1kNdmk+RHH0POgS\/FBy4g0OalIEcV2TLsPlY\/NRHLcCl+OWQZf4\nrYOUVlnY0zi1zeNfAI+Hz58YB28Vb\/Hp1mzmIKWx3hi4uoU7NXL9czukWfFzBrgAdWkhqExegY7i\nTRyQXEoQs7rbNpO7SXVHcHSnLna4BgcGBlyNlUppXdYvUX3OH5qv5+N+7R94R98o2ARj1joQvEUR\nAmvuOgyUf8IBe0s\/tNcgQRJMCatL9Qk\/fidQeq\/SyLIGBwcF9Ds\/rDFMJs+WlhbprVu3QLIU\/h7N\nuWtZiuei9nwgqlOCmXsr0Vm6lTXK+7ievg49lwVoyHyHO9pf\/rEd0JbO7MO+vDlO71zIG4TeG2rV\nYIBct2\/frmWKHhoaCv1esJqaGv\/W1taSmzdvcrCOjg401anReOkzDNf8DkWHfwJD+irukl6+ksPQ\nqTn5Bm8WW012FP76nwBJSZKfctDx0Ln7ZqNKvhV37tyxiwHi7t27pCw7mE6nE9TX11vb2to4FKmz\nsxOmsiTkS56H+sCLMKQEMAe9OJw1\/z1Y80LRUbSRg9enrUJn8fsstR\/AmBHMxs2nHJBco3obD0Xj\nhmDpPYutzPTtLuhtN9rBhoeH8fjxY3R1dw8SmKSiomKwrq7ODkXq6upCe5uFFf5iXI1huzZ2EbRH\n5iCfbRLNkdlozd8AjfRtdr7L69GUuYafVIONynUcUCbx4XVHnWwDJCje2ew8u5OtwZ0uKIgJ4WD3\n7t3D2NgYc3EIjU3NtXq9xWcSOcYgwVKL5uZmDkbq7u6GNlGAjC9ckLnDBdkRLtxJ0oVdLrgY5Ybq\nBF+e1uupb+Pq2eXQxr8Jc\/Ya0NaxOUhupe5\/3Q5IDUJ1SE4mhnsgReSCivQwPHjwgEHeA0vhoN5k\n+sfoASBh1Nbe3l5YLBYOypqDQ\/b09IDeW\/QaGMtkqMiMRFVOJAqO+KKQbY2ig7NgzgjCDdV69F\/Z\ngnb1ZowZxFw2QBsYNYYt1d+woZ0gmob0iFmoy\/8So6OjuMFqXm80Stlv\/\/tuZqA+TNE2WNYo3FFy\nsq+vz67+\/n401VyEat8MXNrjzt00nffHUOVn+BtbfZbcTdClvsfWX6gdkBykVFPdnRK9hGSRG66m\n\/Ab3h\/pYI3bAYDCW8HT+x5tjHCxre+4iOcpmFReNhPJUIZT7vKFgJaDaOx3lMd6wKteybSOALuUX\naLqwkQMSlM01qWg6cvYuRKe5BD3sO00N5kGDoUHg2Jr7DpZpkLqMRJAEbhsLJac2sOaZweqS1eju\nqWhkQ7ur6NtBTfVGrskjXkL9pQPobG8hMOaaKfp70+kAbCiTlGAfPXqEkZER27yCtV4FbdLHvCPT\nxC6Qh7vinNgdBbFrOVhPZxssjU0\/PJ0TAUszi8aDTQ8fPuRzjIJGR6u1DXqD0Wo0GkP\/J\/\/VjYfF\nd0HFT2AGowlGY4NkwtPpAKw\/k9BqvSEhsP9KOp3hDGc44\/84\/g6fWofO3WBhcwAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/oaty_cake-1334346401.swf",
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

log.info("oaty_cake.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
