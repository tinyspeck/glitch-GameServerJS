//#include include/food.js, include/takeable.js

var label = "Super Veggie Kebab";
var version = "1354648447";
var name_single = "Super Veggie Kebab";
var name_plural = "Super Veggie Kebabs";
var article = "a";
var description = "Chunks of assorted vegetables on a fun pointy stick!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 256;
var input_for = [];
var parent_classes = ["super_veggie_kebabs", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !(pc.skills_has("grilling_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/41\/\" glitch=\"skill|grilling_2\">Grilling II<\/a>."]);
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
		'position': {"x":-23,"y":-22,"w":42,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKoklEQVR42u2YiVNUVxbG+Q+oSjJV\nmSwS9xiNLW64gsEoBqNGR+NAYkiMC6AJMTppQJB9R1sQkGZrNtkaaJBFFqURkR2atYEGuiEgKCqN\nENwyqW\/uuRQUKs6YyZQzVeOtOvW6X9e7\/Xtn+c55T0fn1Xq1\/g+WtjPAYrTnvNM9TbBTf6WDrD7J\nTJ7jb6z3PwF3VyWS3O+LxN9vJ+JhfzSGu86hMc9aIxbO0n3pMF01h3Tbii0ldTnfaMrTv0Ru5E6k\nBW2F2HkdStMs0FVhj+HOAAw0uCpeXvi0WqNbt25ZMHNSlRxTtBdb4mkjWIK8Er8N6gpb9NY42Ey3\nV3e+lUgp+8rmDwGNjo4aMSjJ3bt35Xfu3MHt27cxODiI3va8J6Ca87994ntKgAkHrLp0HNnZ2SK1\nWi2g\/YY7z8nGeiMw1hvOwh8IdZkdsgI3C34X1IMHD\/QYmNPw8LCWGYaGhsA8hv7+fvSp2nEj0B29\nwi+gNF8GxV59NMb8Faqsg0jx3oBrKWYcUBJgiahQVwQFBSE\/Px8dHR1oUyRpB5q88GggDo9vXcCI\nJgSDSm\/01tkZvRAYAF0GJmGGe\/fucU9pNBp0dnZyY15Al5kJRn78AsP7NqF3\/TwoV81CxZpZyPI0\nRJj9yvE8DP+Gg0kkEtANttVKkRy4Axf8NyHayxhRHobIifgEymIb3GxyR1+lUPBCXvvll1\/kBNbb\n24u2tjZu7e3tSM2LR2CCB4JCbJD6hT5GN36Ax5sXYXDDfKhWz0bVshm4bGUwDuCzBUGBZyAWi9FS\nI4Xq2g\/P5GhNlgUDNeIp0F0p1LwInNPY2BjPLwpFS0sLWltbOWDABTds+eFDfHJsMbb+TYBtdvpw\n2L+IeW8ubhjOQyt5cOm7KDHX539OVZyTFoqBgQGoSp6Fm7BYn4+QE2OOeImfgnlb77khvX\/\/voxC\nSl5rbGxEc3PzJGBaYfw43I\/jcNtP6uMzx6Xcju6di5rlM1C3Qg9Xl7wN6e6NuCDxQUbyOfT09IAV\n1TiM\/3bUHlqNrivWKE38nHuPzgf5HOVpEBcXh4KCAtm0gA8fPpSxsHKYhoaGJwAHNdlQtUSjozEI\nR93WwfS4gNliDrfdXh97jixC2PtvoGTJO8heqocQT3f+Z5S3VO03e6rR4bAZ7Qaz0LxiJipYaqR6\nrUeEmyHkCZ8j6Kw3oqOjeQHSfzNzegLu0aNHIgorwdTX1z8BqG6VY0Qt4nZb6QHvYBPmycWTgNts\nl\/DPwfNex0V9PUQcOTDpjQnAXgcbqFfPQceq2bi88M9oWP4eEvctQtDJNYg4PV5EKpUKv\/76K08H\nYqirqxsPNTtpxADR1dVFJ\/mPlWVFKMgUIynEGmmh+9Df4M4Bhzv9IU3cw3PwU+ESHnLy4D6HLRDb\nnkBKWCiSkpJQUVHBpeiWuovDEVi1\/gwUfPAmFMv0+Pe6PUt4eCPcjFBTUYjHjx9zQDoSQ21trWjC\ne3LKEXYCitoKtFbEoOuqLdTFx7mVJOxDlngX+mtO4m4r06laO3znsY7nInlut906eJ5xQXFxMW7c\nuMH18ebNm+jvYlJktoV77trit6FcORO1S2egYsm7\/BwBluccR0EGi87IyCTgb7\/9xr3JeORUGHrk\nPdI1AmyK94f6W0P0HDFBm\/lKNFoaojP3OyT4b8G1iB0oTzbDkMoXqqvWSE7YD2dfe3j4OyMzM5MX\nFgEWVVyCffBh\/OC5E+c+m8vzjsAIksBUBrMZ5DuIN1mLhIQE9PX1gRimAtJNUjR12Ekb+pEKQy6L\nhHqTAKNHdmNoi4BLR7PBTFTvXor8yM+R4LwK8tidGKh3HIes8IRUKuW5+vPPP3PA6MwgHn4K\/daf\nBLzaTxxYiIsGeqhiISa7zMIsnf0azguP89wjwX8akPYih1H+OU0A1vu5cC0b+3ghHm5aiAGj+VzX\nypmuxRxZDln4QeTGHebWVBEFZbOCdxaSEQJUNNdgl3A1Tp3\/GnZnTWF6QsALiAqJUkEsmAXpgjeR\nPuc1RP7FlMMVFRWB6e4zgMRTUlIyDsjkBUqlEgqXn9C9bi5aGFTHmtnoYZ+bmAdL9d9B7gGDcS+y\nUIcGuvAN6M6nAt7qrcXoQB5GusUoK7TiUDudlnFIKiShyXycF8zEhVUfIDU+jqcV091nAOk7hTc\/\nv0BBBcIBqYUpIk9BnXEQVbG7ITEeF1xqW1cWv4XsY4a8YGICDqO0tHSyF08FHNLEPyFH33muH+82\nDJCODjvmI8zsMyjKy0DNgDR3OkAKLwFmZGSIdO5qtU5jo0PoKROh97INyiW7kOm3AVEWCxA753UU\nCd5G6vrFTD7c0FKVzm+E2t9UwNKCWBSmn8HVNBsMtnhNQiqvfY9Dbmu498ibviIv3pPpmucBUjUT\nXHl5Obz9\/HboNMtDRKpsa1aplrgatg1pTN0vOKxC7MZZSJr3BhJM1yP4tD\/S0tImh4WpgPVlUlxh\nPbQ6\/QA\/RnkYo\/3yUWjKTnAvNhaxnE03h63vlxyOriGI6QDpSKlDgNHRMVqhUKir05Ftpe3IsUJl\n3F4ku69Bov9eZMqkuH4lBcWFqTRcIi8vb3JYmArYmemHToetrIWZou2kKZpdt3HNlPoaQ+b\/ETTl\nx7iwE2hRXhQPHY1b0wHSkf5DoVDwwrG1tx9vdapsSw0BVsWbIT\/Olqs\/ycbTvXgCkASUAFVZaRjY\ntRYPz7JrPl0B9do5aFj5Hir3r4bEaQ3KpOZoLjyIugIhrhUl82GBTeLTAtI5KlLqHnK5HF5e3hru\nPVoduVZGzRe\/F5WzSYUuoAtpM4J4HqCypR5t+0xwx0SAB0yORtg82Gc4PqySJCWxipeGHYTE62OI\ng7x5L54OkI5UXBMOoU7k4uoGoaPjswOrJDpWUlRUPHkhDarUtAnqacC2wkvoZDI0uOF9rpn3jBeg\nj03TLatmcsDqnzbzipcF7eAp8jQgzZmUInTzTU1NHDA39xKDc8fJk6csnjuoRkqi5RezsvkGtBFt\nSOMPtS8aJCj\/CLCVAZK3SCf7mecIjoDrV7zHx62LFstQn2WJi2y4pTY28XBFn2kfCifdNAHW1NQi\nNi4ep5yctf8UjpZYnKIbERkti4iU4HpZ+STg1Kc3giXdq\/\/aGBqmmdVxu5Hy1Ye4rv8uypj3Cj98\nC4nHvkZ7QxEPX3d3N\/cW3RxFgCJBgJWVVZBEx8DZxRVOzs4aR0fXF3+Si4qKMgqPiNLKZJloZCGY\nCkhF1NdZC3X+91Bls9Yn+hhxdssRt+BPHC7NYB5vYRQ6AuMFxbw+AVhdXYPU1DR4efsQnMbFxcVG\n6O39+98yMM3SFYdFyMRh4TwEZcyjJLAEp8qxhibPGvmBm5HouhrhTDPjmKgnblyBqJBg\/lhJoZwA\nLC29DpksA7SXu4cnXN3ctS5ubhb\/kTcHoaGRgtDQMEnI+VBtVFggWjItoczYj5Lw7UhxX4tgF3ME\nBJ5DWHgEE\/N05LBkz87JRXJyCiKjJPD28eXe8vD00np4esrc3d13eP87HnuRlZ\/gYkGaSVYWvQeh\njp\/gbMA5iM4G4owoAKfPnIX\/aRH8\/M\/Ax9dP4+3jJ\/fx8XPy9PU1emnvYlQ5VgoCVGYc1Hof+i+8\nofqXb7AKD+mSuKuzDgt0Xq1X64+vfwBo4ylKffr4KwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/super_veggie_kebabs-1334190231.swf",
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

log.info("super_veggie_kebabs.js LOADED");

// generated ok 2012-12-04 11:14:07 by martlume
