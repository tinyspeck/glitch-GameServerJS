//#include include/food.js, include/takeable.js

var label = "Berry Bowl";
var version = "1342483399";
var name_single = "Berry Bowl";
var name_plural = "Berry Bowls";
var article = "a";
var description = "A very merry bowl of berries.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 46;
var input_for = [];
var parent_classes = ["berry_bowl", "food", "takeable"];
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
	if (pc && !pc.making_recipe_is_known("98")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> and complete the associated quest."]);
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
		'position': {"x":-18,"y":-26,"w":34,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJFklEQVR42u2XeVDU5xnH\/SPaNJ2O\nrZM203ZajziJEhStGo0XiFdAInLK6bqcgsKyrIJEThHYVZblZgEjhyIKcmjVWBQ2iAHx2hiCnLLA\ncsOysCwgKvPt+3uJRkpsPYLtHz4zz+zOb36\/337e7\/N8n\/fdKVPextt4G2827hj\/bmYjTyuv89Bn\nkmaPBaL\/GzAZdyGnO3pTXr3Lx1I5bwFUMRvRcWAJmtw1AmQuc7X\/p3AVRn\/UavFeBHXMerR6aaHD\nbylGvtJHb+hK9PJXQyFYixq72VqTDuLkUi6ydyxWmpslw9z4MIyNE2Bilq0MMPORyNw00O6\/HPJ9\ni9DorgElAeskoE0emmjbvxj3bGdNjorKZfO0+w3WSfg2afD1r8Zer1KwLLxhZeIKWzNvONvl4upe\nU9x3+RiqZAMMiTeh2VMTDa7z0Mj5hAIqI3XRumuJBEJhAM3ExIAHrg6Grw2nWD6fo7YxRRU\/BRzP\n7yA40oyISAWEIiWCglvh7VMFMUcIZcxmAvIJLelAhA5ke+ajL14Pw+LN6PRfSj+7gwh8UgwUEQcx\nmnEciI7GAx5H8urKLdcwHHZiA6dOIYKXh337K+Ef1ILQwwM4LBxB0KEuePnU4oKDOQVqJT3IlLmZ\nq4ka9hx0BX6KfqE26clF6PBdgs69+vRd\/eIItAi8MHIiFaPxcVCuXZLySoB9+jpSusqkOBzckwM3\nj7vYf6AZgcG9BE4FH992omo1QnaIUMn9DD3ECNU756Blnxa6Aj5FrcOHtMxNpMxyz4XoJPc8PiwA\nUlIonEJ8hCo5xLZG7+L5M18KjnlgxJsHpKdDKRYicHcWdu2+BQ\/PGqKknCjXCs99DdjjfhcOTiVI\nsHKmKjZ5LcHAcROMJG0mI+bv6AxageG4DVAEr0ANax7K\/vw++h1YT0EfZWZgNFIEpc7SF5+Xds4l\nWt4uhXnu3O\/g7nEHrm5lsHcshI3tBTg6f0uuVcKde4\/COblcx067K7CwyoW9gR8Kd6xAR8iaMfcS\n5RhX9xC4BgJ\/cfZvkPv+VOS+Ow1F70+HxNYbKQeLkRRSjkjuJaWbxw3JTrvCADOzrOnPhbN3LOFw\neXcRHHqfmEGOcFETvL+sBIfLgFyCmflpsNiXKRgDS14IK5tz2GZ0DJ\/riXBEzxUtHvrEMLqot1mM\nHvstGDnghYdePJoD5ltx+8MPEKltiQP+lfQ3ImPaER4hpz3uximFte15pZHR8Ykz08zp8vTdbjeV\nDFxUTCdJBXFtB+m1enjulYJtT5SyzMEXWxPhx47FAVYUdlkfA8\/8ILbphSFgjg4Kfv9bPNjjjJEg\nPzzy9QHCwzF6KhPdsaFQn06nzpWvWQZfMzEZWXUI4XdCIOzHwZAu+jtc3i3sYF2CkXG6dAIgm32F\n5eEpJSuTEQV7qVMPhfXhS79GsjIp7BwksLTKI4BJOMOxpmaod\/4IitBVKF4\/C1lT30HMHG1EGx1B\nr6MjkJFB4TqEfuiKDcFobg4F7DfQRdpfNVDux8adICec8s9G4KEeUql60k43KaCpWSb09KLHD3am\n\/q5ut4kBGuB\/sAeH+EPwC1SA5yUjDzIKPgFMRLKHG9nWNqBl70KaDW6aKFw1ExxnCW6Z7sKoMBxI\nToYijo\/+lDggOxsQifA4IR4Vc\/9CFyPbrYl+0TpUkHa45ucGgftp0jalsNlxAduM0whgxE+A11tV\nhvuDr0nsHK7C0voibFhXYM26TGBb6CjZ5XqTmmG7xRlsMYhDor0dGcjadIzIds+DOloXHWQgJztH\ngRnsEIsxdDKVJvLyKCDTgw3LNHFh9q+R\/d47ZFZq4HHaFmooVZQuSnnmT0Uw+CIB\/uEFHApXVN8p\n8YzPgAU3mYD9Exs3x2DVal\/yGYVNn8dS9ZhRYrPjIkzNM4kZIhG\/k4Vax7no4q9Fn2A1PbUw+23Z\ndmOMcN0o1OiFfwBxcXgoCIXSxICOGEa5J1lr9xF1OLMdMu1S4bURPFsxTEwzqOEE6ZdRWNcunXK9\npV\/pKkrBdj8hTK0ysE5XgLXawdDWCYH+lgS6KtbOAmKQXFpe5uEqgQnafBZDEa4DddQ6ejhg+rHX\nYiUtLQP4MNAPPetXjgPL\/9M0mrXsBVQ5OWkPRRg5VAQsw2CSPhLZztDTj4KxZRwi84vAsE0Rl1Sm\nFDb04FjRLXgJCcS2OGzYGIn1G4TYtDkStqyvyZzLw1bDJBgbCHBxjyH6Dq+GnLdwrMRke2vikvMf\n2dbULFM6hBUG61HywQwKlTN9Ki4ufJd+P\/PeVFSYziH3riUHigXoCluDRxlGdCvsJltjkoUxPHxy\nkFVahRK5CjlV3QFTAnKLdUVXq5FZr0JegwrlbWrklt7HV\/m3wY8vRnhSGQTiEvATvoH0ZBjqImxR\nFWqJar4llCnW5Fi1Co1k\/+0JXYN6jVlUsbMzfoWzf5s2Bjh7Ns7o6qPIyQz1IhZ5zgoVmUJIU\/mo\nOBmOezmRkJ4\/geKiApyr6UL6961IlLYgtVaFEw3DY1tgUH7JtaOVPfSipG0IN7oe0CwnWdo+hGtt\ng7jaOohCuRrFLWoUyQdQ1Kyiq7xKsqyFLKx1fJaSa8w9TF5pUuG8bCwZEbLqxzKjToXwsoYJKf6+\nC6k1\/T+ddHgp55YxKjKAObKB8YAdwyhpH8Y3BLywdQgF8iF8LR\/E+aZBnG0cJPerkdWgJhUYwIm6\nAaSRd6S+RP47nOhGE72eXjcwfg4G5JbEJlV0jVPxvwHmvyZgcqViAuDRe71EPdXEwwP\/8q3pYZdu\n3z1WpST0pGydw5MOGHOndWJpa\/ulWffx8wcGdmj0H44UVjQxD2feH0ApgZwswGPVfRBelz2FY2AJ\nnPJ4jfo\/\/7kSltRoRX1bJ30CWUJMMhmAsdK2l4d7ttzR5bIxSOI2Bu6XBHy2936Ek74w3LMRWy4T\nkZ5UniA9WUCgfglAxgRPSht\/t0P5s4Z4mYi49MMMZiYxL89vVL8WYOIP3RSOGSVH7ynynmuGV4m0\nOpUhWW3ecaJmLpmVLwPIGIIpJQMWJ23Le6VyvmgwL0+r7eeQUSQ9RUyU3TDwXEAGjFEt5naLhIBx\nnm5dbzKYiX9S9mOS7+nP5KQq9TbexhuKfwH+Keoswh4cWQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/berry_bowl-1334208124.swf",
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

log.info("berry_bowl.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
