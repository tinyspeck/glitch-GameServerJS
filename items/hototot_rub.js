//#include include/food.js, include/takeable.js

var label = "Hototot Rub";
var version = "1354649243";
var name_single = "Hototot Rub";
var name_plural = "Hototot Rub";
var article = "a";
var description = "Oooh. Ow. Hot. Hotot. Hototot.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 77;
var input_for = [34,35,333];
var parent_classes = ["hototot_rub", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.1"	// defined by food (overridden by hototot_rub)
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
		'position': {"x":-10,"y":-22,"w":20,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJFUlEQVR42sWY61OTZxrG+x\/sl7bq\nqNSd3c6sQOQkSBIEFIKoaFFUpKvD6A6Kxak7UhWpFbVWS1EDokUsytkAApGjRKKBQgqKIgREkJMH\n8IQWDzPd2f1y7X0\/mEwIkU20u\/vOXJPkPf6e6z48z5sPPnizaZxmKS9Mn6a8+GeHBJ3XXxLqpbO3\nGVZL\/YzqWin75IP\/51b84Ye6ko8+gjVVf+ogpHX7FASPBl9nNPpLdM0KN11buFzXtkambl8jSzDK\nEC77jAfVv9rjD\/8TQFtkbRDNQW64tsQDNICbYiCr5cqxQcgj7Y7K+wIqp05F0rRpSKVPWwdRL3MU\ng9AHuA6+iUQmD+CsVOL3HwHLZk6zGS5jyhRscXAwKevjj995oPHTpyPawSFhUkAepX6hi903NgIy\nsK3XqadNsR2w4o8zhOXt4XJcX+5lF2ABiUPMMu67JPnTBABrYTf\/zddbBSyfNV3XutJbwBnFD7C8\nIe+ztt+aeJBcLJOdw4aYp9NbAbltmMMZxcls+VBb3K2ZPUtcz4Oe7Dw+zpDvDMgyusDOGfdxJU4G\nZ4yG8eGcPtbCaxktBtwyY4bSLkAW9zN2znwfF5JljrHjltfxfv7ObcW8S1jejwfNBRY9c6ZuAiD3\nockA3yZ2ih3jh7LT1s5hMHNgdtUy342q9pvz+wIaZenG+8gqoPnWEe7jMnCpvHewToM7Z5Qm3YqP\nEurcFv7P3wvmnQB5GxoawqNHjzA6OvpWPXv2DE\/v38PD5noM6a\/gXkUBBrJT0ZeZgu4j8aYBdWwJ\n\/e8AjoyM4PXr1++lly9fjhvU4\/brYkD3Gy+jT3UaBTHrhbQbQiDmY5LVKjbfyDk\/BuQb2gIx1NWJ\n7uJc9JbkYvCqfsLxFy9e4Pnz53j69CkePnwIvjdrYGAA+\/btEzpx4sRvNq9sjICvXr2yCbDrUhX6\nCO6+Og9dFcUYvHFVaPTX52KQDGaEMldLS4sJMCUlZcRmQLo4cnh42Ca4x7096K0sQX9pHh6VncMd\ncvI2qYt039BqOo8Hyylj7qBOpzMBpqWlPbIZkOASuECsAd1p0KFfW43+y6TmRgFzl9x7Un4Oo9WF\nGL6Qj\/aibLQXZuNhb\/e4MDMg39cIWF5ebgIsLCzsswvwbQXSW1eLAXLrHoWzo\/QcDEU56GKlH0VH\n6iHojx7E5Z3R+DkuGi2qLHQ21qOjTouOhvoJIc7KyjIBZmRkVNgTYh23EGuA7Eq3WoXelP3oPfAl\n6jYsxxG5BAelTkj3k+BisDs0i92gXuSKn\/yccYr2qRRuyF4VMAEwPT3dBJiXl1dsF6C1Cu5r1KE2\nJgJNoV7oWC3FcOQCNNP3fTInAXLGV4JSmsaqF7vi5HwnnF0wR0CfpumLgVXL5Ojv6TYBGuFYGo0m\n3WbABw8eDBoBH3d3YpBC2klh7CjMQV\/2Sej3bkPjxlDUL5uL4iBXfEPuqQJcoV3ihuYV83A7XIaq\nYDc65oZMWlBkEGBdiAdB0hysqZrQYli5ubkbbAbsu9mKx20tGLk7gI4qNbrO54g+d70gG60EeZPE\nRdB37ic0xm7EsSAZigJdcJFg28OkQvnkHoP9SA4e9xlzMyss0GqLYWm12lCbATXxMRiilnG3lKAI\npEk1prr8bGhPpaA84SsURa7AeYULLigodAFzKKTOSJ4vgVI+G2n0ncE4F1nH5Y4iBVjF8X\/Hxb8u\ngubAznGA3HttgqM+9Unlt\/HkWA76S\/LQS84NZSbjVsJWfBeyEBn+EgGWvXAOKimvOBdvr\/VBNYX0\nMC2ruDCKFe5IJ9grFNZfVs7DD9IxB3MDXEQ+5i50xaHFvvhmz9cmQLtmEW4xI8MPMNTdheZ1gdAu\nnSuqs4DCmELJn0UP0y5xR8MyT3SukaEnQo6SIA\/s8HYS59753AeGVd44QUWzW+qMWC9HKH2cxfX1\ny8buEx\/si6\/jdgm41NRU+wG5sfJs0vD9XmgpTPkBEhRR0jMcu1hO7mXSZy45yQ\/c7+2MeIJpWj4X\nfRE+6CJwPq4kJ7mIdnvPFq6XUZ4WR4aOazF2z8Ncwdzxf47bgtZVUpxfLkci5dEZfxcBt1fqiJ3z\nGMhRhI6r9Sg5u4sczKHjtTSgrIUSUSRlwR4irPu9+XqJqHZVdASSDh\/Gri+isXfPHvvmYZ5FGJAr\n7UffscbL4TzuIxEPSPd3xi6CYzDubZkLnIWrSXInEUYuCj7\/EP0+5kPFQa8ByfR5lHTS10nAHpTO\nxt8UvtgW7I9tK0OgUqkMdk9zDHjhuz04s0SGs5T4TZ954jq9R+gphIkEwk5cDHYR4edBHCcQbid5\nVAg5BMx5F+PpjO3zHJEf6IpLVERV9D6y2dMRX3o5YRMBbiXAKIWffdPckydPkm6kHUEH5ZCa8kUZ\n5ClmAz0VRPVid9xbv0A4w26oqAlzFd9f7ycGwFXK4WbX2F3ujV\/MdRLOl9P+84vcUZqWipQNa7Ap\nJAhbw8OwY2sMTp06VWCXg\/lRESijrl+\/1EM8jMPCjZdDnvMmtOwgO3ttxdi01xjiLvIzlXpgGp1\/\neak7dKQChavokXztD9SG2OUMhSe2hy5+t1mEAZtKC1EWuwlVsZuplczFDeplv9Bb20l6MCd\/TbAr\nNBTWGgI4T006jQbBFcuh5MKJ9XIWIa8gx+pC3ITzHFZ2k5v1kSBvbA7yQ\/xXsQIwMTFRYReg+Yqj\nadMqyjMP9K+bjwZaQlUc3ANVWADawrwxFOmHNup3DFdKMOwez82lQe7YG+iFtBWBKFG4iTlYm3sW\nNxrqUPbtbiSuC8P2qI0mBwMDAx1sBjQYDMd6enpMgF20nms58T0MhVkY7B5bibSoC3F1rT8Mq2W4\nFuGPvKi1KI2NQuaqQOGWhqq4fddGsXK5XlM9bgVjuVCNi4v71a6\/gmtqauJpbYbMzExeo6GyshKN\njY3o7Owc9xCGNVyqRk\/rDdM+himO\/hyamHXovVJj9T3EcqGanJxcb\/f\/1Twf042UbW1t1\/i9gWGV\nSqUQQ6vVavE+0dra+laIyWScRQ4cOPBbUVHR1Pf+g52BeYbR6\/WJtbW15wjwJoGOkBOjRln+Nop6\n3IPTp08PGkWzxj+SkpL+tWPHjlu25N6\/AaYu+QYwnUEeAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/hototot_rub-1353119600.swf",
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

log.info("hototot_rub.js LOADED");

// generated ok 2012-12-04 11:27:23 by martlume
