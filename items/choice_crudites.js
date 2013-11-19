//#include include/food.js, include/takeable.js

var label = "Choice Crudites";
var version = "1354601202";
var name_single = "Choice Crudites";
var name_plural = "Choice Crudites";
var article = "a";
var description = "A platter of the very finest crudites.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 42;
var input_for = [];
var parent_classes = ["choice_crudites", "food", "takeable"];
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
	if (pc && pc.skills_has("ezcooking_1") && !pc.making_recipe_is_known("9")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> a bit more."]);
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
		'position': {"x":-20,"y":-19,"w":40,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ50lEQVR42u2Ye3BU1R3H808f03YG\ntdWqnYpasahtKa2PasQw6FhFbUB8oAOl01q1qM1Ytda2ulUsiogURVFqCQiMjWKDQMJml81uNtn3\n4+77cff9fmZfeUlQvz2\/g7uTmESw1j+c4cz85p57d\/fez\/3+Hud3tqnpxDgxvmADY12zMdbdgmHp\nvCmfQT4LVVnbhxWZsm6oyDo\/XyB66Ii0FSMHJTQfK+yUsDk+HO5WTvkug0FFjmmsPPmcfY\/d6\/8C\nOJL5Jwf6yCTl2Our+Hy4u1wsFpWFQqGcz+dRzEUwXujCaLpzCuB01xik8NlUG5W20bwQeLzlveJu\n1KFKeQGHSx38nAEim80ik8kwwAAHDOvXcwA6kpWCOxs2BXJI1vKp4T6odrYRCAF8MKzYWCnY2ouh\ntfhgaD+HGioJGEpt4fNIJIJoNIp4PI6AxwDLgYeQ9\/6LK1ZXja65ep9qqBu3bGoAjuf3CajJWz8V\nYD64RlmHIRsbCiLrf7oBNV6VoxDZyueZtIh0Os1VpGMqlUIpa0fUtY+rF9S\/gLCLgZR1XEF\/\/99R\ni3VMVZIl1nED5vxPbByMrMNEyHzsbeRFCY6U9\/DzwdireK+qQywWg8\/nQygU4ipyVzO3l0olJBNR\njOaVR5Vi6vn025AMmRBi0AQ7UUlutUOrjpGp3QKVjsF4eyfBVOL\/aAC+PyRFIbwZ5eiGoyrW1AgE\nAnAZdmIo24OY8jqkBlqRN9yGknUFaq77MFpLIpXw84eT2wv5FKrVKkRrJ9KOLdPFZDkZts6bHnCk\nu5OXjhE5xoYTSPlf5opVk5sbkKQoKTuWfwO5bBSC9k14u69BULaIAxZsD6BgWskBh5y\/wVjoCVQz\nGtQySu7WcrnMAcvF1PRuZpaOasvMG1PLDz247r73a1L4PCZEPDs55ER303coYRKJBHyKOxHpuxVh\nxWLE1a0csK4gB\/StRlV8FqV4D3y6rRxwpBLFh5XeRukhZSmJKAToWiGugc1mU04Td5IIwVAiEAxB\nxiM6iG4pT5CJL8Ahi4Pwy5dA7Lm6oeBEF9cBU57tsPS+inwuiUpK3VCKFHSoNjUyvg44lFXB7VMi\nUnhxY6K6XpIc3nDU5YXgMwIBkpFC9TpXSPdD9OqZyzejEHiqcT2TzSEr7oGvq3lGwJR7G6yCDeE4\n+325A37velQqO7mJ3udRqKkg+tixshW5yhYkKi8gXlk\/yWKV5yJNR44caRmpisgH1qIOWU8SUvNw\nVYZUzIiI711+nWIwGvUgm8ujkPEh6d6BmO1lJJyvIu1+HQn3Lvj9fjicLgZoh8m9GWJuzYzmyzwJ\nZ\/wv3KzBR2AOPAS9tw0a1\/0YcN4XaRofH28fHR2FxaxD3PPiJEhSbSS3jYNS\/csn5MiJTyMWOIBw\nNI5kJotcoYg0O8YTSYQjUYiBIDw+EQ6XhwNqbM\/wh\/1P5ry\/s+nw4cORwcFBmM1mWCwWuO0sm3zr\nJoGS20m5ejaXkzs4YCLNAIslZPJFPo\/EEgiEIg1Ao8kMo30XDN7fM2Pq+J6FpW7+dbByew5W8TkI\nzHTOJ9Fr+XXDDL42JSmIiYCCIFAmwe9iieJ9bQooKZoNb+dqHQtQoeiF4H+JuzJcfGZKjB2PkYLT\nAjocDjidTrjdboS8XY3aSBZxbkI4HEY8mZ4RcECrgsW1g7tYZljVcBvFF8WZEH60EXszmSv+V+G4\nAD0eD1\/SRL8TUVGKkGwLBwyyJc7PYm4iIMH1qdVQmzbxh5ByrGzAEV4HneNJKAyPomvgl9irvJkd\nl3N4MrX93hljEGNjYzMDWkxwdmyHfcPjEFYvg\/WGH3IjQOpmvC+tgUewwKPrh1evgSiKfF0ORnXQ\nOh\/jD6LspGytuy1TeRvFmhbV4QCKVRtiKQMSGSMCETUOKtdC3v88e4GVG\/f1Lm1pYnACAdLaOhHQ\nK+uGp205TNddCM3Si2BhR8PCc2Bc9D3orzqLA4pv74Dr9maIW1k9+892OJZdCsevroX\/2UeQOHQA\nrJmFGDsAnfvhhnvrqh4r9oyBB472innWFRNgpVLhcHXA0L49GF16BQK3NcOzYiFsrfPRd8+lMF87\nF8blVyHwzht8Ltw0D9alF6Py1laIdzTzl6CXoZcwrGZr9WZWlswy6B0b0Gf7XcN9pKo3JUG0tG4K\nnC8jgdx8zdE1ORKLtY2MjICM+rmJgEeWXIHiNfMQvOpCOK+fD9fyBfzBwr1LORgpS0fTimbk17ah\n\/PByqG44G4Zb5sN56894KNiXXgL9bYv5WhyM6qG1PQ+58a5JsfZx2AHX3eXGOsxcNZtWBQIcHh7m\nkBR\/BDi+5HIUr56H8GVzYLvoTPTPOQXWBWfBfccCGK47H8bFF3BldYvnwLu8GVhzD9wrroTp5nkQ\n2AtpLjkHXad9FX3XtzS6mVqthnQ2xDJ8Fw703z0lMUz+B7FX\/Yv2Sc2CPxhSlpmLCZBuQJugqIo1\nmq11wPMgMED1nJPhXngud32y9TKEbrwY3p\/\/GPZFP4BpwfdxZOMfkbxjEXTnfQt9Z82C7PSvYf8p\nX4L5D6snAQ4NDfEjJdkh9TZI1RK8q1rJQ0Al3IX9\/TdO7gtJxUAwzO5R4T+kG1FMFlibWLjpcoQI\n8MIz0XfOSfDecgV3ffna+UhceQF8Pzkb5rmnc6CRN19B5vaFMMw5FerZJ0F+xtfR9c0vw\/a3xxqA\n1G3TPobKF3nKbrfDaDSiW7ofu\/c+qHxLtqx92qbVHwyu8olBFFlN5I0luyHdLBcJI\/rUnxjgGRwi\ntPZR7vqjgHM\/Avw2\/yz1GgvyGy+D8fzT0H\/2yVB85xvoPvUrCHTs5l5JJpMczOVy8RJGgFqtDtIe\nGQ5Kpe3H3I\/4fGKblxXaKCu4dUAq4rTPyAQD8G5ch9S7HRywRIDNc+H9CFD13VkQ39qN0KIf8XPN\nuaeg76fnw7Xn3wgGg\/B6vbzg1wGNRhNUKjV6ZHJIpbL24940+XyBVpfHVxaDIdZS5Tgc1TNSIMfO\naQdXPLgX+fUSxH97O8SVS2C\/9XoY72yFqNUg+MoLcK\/5MzzvdPDaSoWbVqE6IFUJVZ8a8kO9kMkV\n5Z6eT9gszTRoX+ByewWn24tQOMK3lHVA2rnVt5jkMmr\/aXdHcUVBTwWcdnmkGsFRb0hgVquAAY0W\nCqUKhxTKslyhlCgUitmf6W8Pl8u7yu50R5jByboTWnejDIbA6oC0rH0ckKDIlWaLFVqdDip1P5RM\ntV5VHwG2f2awjw+Hw91qczg7BbsTVpsdFtbKm5kiJgZgNFlgMJqhN5ig0xsZkAEarZ6rpR7QQN0\/\nQICdyr6+NrnZPOtz\/afLzFxvdThaLYJdwtRRGs0WJYNT6g3M9EalVm9QMjilRqNv12h0ErVW29J0\nYpwYX\/DxXx0wC48wfzJfAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/choice_crudites-1334187893.swf",
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

log.info("choice_crudites.js LOADED");

// generated ok 2012-12-03 22:06:42 by martlume
