//#include include/food.js, include/takeable.js

var label = "Divine Crepe";
var version = "1354648617";
var name_single = "Divine Crepe";
var name_plural = "Divine Crepes";
var article = "a";
var description = "Life-changingly scrumptious crepes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 279;
var input_for = [];
var parent_classes = ["divine_crepes", "food", "takeable"];
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
	if (pc && pc.skills_has("cheffery_1") && !pc.making_recipe_is_known("2")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> a bit more."]);
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
		'position': {"x":-33,"y":-16,"w":74,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ9UlEQVR42u2YeVCU5x3HGffdXc7d\nRRFx5FBYiYKAHILlBjkEEtEYDEYxcnhraJNYm5jEae60CfzRJFOtDZkcTcw0atF6IAlBIIKKIFRl\nQXj3fK9dDtNEjRnn2+d5V4iJSauNtuk078x3dpnd4f3s93c9v9fF5afr\/\/myhTLbzBvSGsxb8mv6\nt6\/W\/mjA3nk5M6i1ILDGlhuAgbIkGKoWo+eNxTj7fjHb07imcqBlQ9B\/Beytquy0t6pzat6uzkVn\nrA7W7AB07StH10cVONOwGuca18DQtBZ9zetwvmVtw0DbmiiLP5NGNRTscuccfqcq58H3X83H4XeK\n0LxnOTrqymWdaaxEV30F\/taw6mu4lnXo\/3Q92NYNMD6ZAjYxAOzCKFijPBvEcJeoOwK3e\/sCnDxY\nOgY2KkPLZnR\/vApnP1kNw1ECd6Qc7BNJMD4aD\/Oy6WiJmQD2qSKwr62FcV0mhBw\/DCYqa4aiXW5f\nClDXvg02qtP15XJoe46uQW\/zWgw8mwFznBcs8RrY5mrxerA7TkRMAvtKKdjieLArk2F9PA9Soie4\nu5SVtwXw1OHyhu8DHHNv73KwK2bCHEvg5njBljQeXJI33tV7YLsrg64l8bKL5qcKwa9LgK1kNqyz\nPGDyZ7b9cMC60rTvgjNsTkX3e0th2LkQpkgvmGK8YE32hbAwAnxuMPh0H\/SGuaJLr0TPXUoM3MXA\nPkclS4hUwhLCwOCrYG+Lix2Hy6pHwTr3loCd4QZTIIOT3q7oiJ0I02wClzUNQkkKhPtmg0\/WwTiH\nhDFMCet6UijVpehclYldGnfs9mRwSK1AZ5j68\/6pin6T3iX89kDWlXVQwN5VEbARR6h6JiqwL5jA\nRnvJcFJpBnEwDEKKFtZwNfg4D2f+hbiDfW4ZehMn4ViwK7g0LYRUryt8JMPzYUxdn95F84MBTx5Z\nrT27LbWDusJn+oGtKsXAlkLsUjIwPzgP0qaFsJdlQryXAKYSQD0D24IQZ3EQ0fwTZxNHaajn6SBl\n6iCmaK7yUWrJNoNp+8FOcpNdgix6xbCQ4AnjS8vkpKfao1PCsKEAjocWwV6RCfuyOJyO0cA6nYFl\npRPO9JtlkPL85Nwzh6rgyNbJkGKGDkKS5ioX5TpIwM+Z9Iol\/xbckLeL1jiF6bBGksp7pkhuF3ID\nJmHbPzMA3cvnw1G5CI7V82AvmYPWGB9YiIOmrYUQ7gnE4FwVpFgVTKQw+v3VcOToxlyk6cAlkh8U\n5TpCDOCM08Y9csuAdFQZ\/Ykj+SEwrs8E+8tCp4iDB\/P06EgNhaM8WwZ0EMDuWF+Yg0mIE7xJWAlc\nDIEjjrZPVMEW5o7BXAKYdS3MJB24JAI4VwNLpNsXxmkE0n9cdd\/4W8xL4xRFDS0MKZrcMIP0ufxA\nmDMCUOvOoDPcE9YELQnjNDiWzIIhzhemIAbWUCWMoQy6JzFo81Cga5IKQwRucD4BJGGWiIvdpKG3\nxGrRHK1FU5QWjeFeV\/qDGIHcr+7WnQweV8mFM8M0l7iZJJ+mMtivYa5YYr2uWhM0cqjEDB+cIFXb\npGNQ56ZAHWkrTROU6FIpYE\/XYPgebxnQkKrD4eRJqF8bh6NbU9H4WAo+3pKMA+XRqA3TfNUXqJSM\nU24x3MbJigrWf5zBFKQYNk9VXDb4KS71T1PwljCVQwYkoaIVvM9Hhd3T3XGQUaBRMQ6dUR4YJlAj\nhd4yYHuSDh+mB+Dce\/fD1v4QTMc3YuDYenlc0snU\/sEDOLAy8mprsOtIn99NVjf5NdWsv4IbUwDJ\nlSAFZw5RcKQCOVu022ejgAcJ4FE\/FXoJmJTljQv3+uKzRT4y4Hnyd22BHhw57QidlbCe3ART20b5\nBNTb5ASkxzfac5tfX4CDK6OO3xQgce7XFMyk9+JNM7z5bwNyYUQJHpcpoJhB8jFbC0eeDkMFxLUF\n3hghshf4YPfPJuNC72v43LoDgz3PyoDGtg0yID2unbkO8GuV1dA+fDMuPmKc6sYJRVl2YXmeQ1ic\nZucL50hcjDdnm8lwdDIIyV5fiekEMosAztdiMJ9A3k2qOZ84F+2NszX3QerajMG+VzD8UgUunXoT\nFwZ2Qjz3W\/S2bJRPR\/SMeeP8L+u4KciBKYolxqmunDU3RhKKswhkol3MmyXawtQcP4tAxqglGXCe\nFvYcp4uDBO5ArDeOv5gjh5XmneXYZrB5M2XxaxMwUpmBwSNVEHtfBdv+9Pcc8cqGTx0q+9eHXpq4\nNMS21FBRLE63C4sSJDEzROAIoBDJcFKC+wgNM3XRnqvFadKMm55Ic4JdC6mpdg3YF8hEivGFdUOK\n3CvZ5yuAi82yHIdegPTpC+hr23oj5JHSwpvpi3XmsPG8uDzbIRYl28XCWImP9eL4CIYTo1WcmOJ5\nWcx0QrYumiqvAFS0WulaYPnjUtiTPGHbmALTo3nyGOy\/BniJP4QzETrwKeNhe3ElhF\/cDVv9M7B+\nsA58z++c0IfLH\/ynFW0O9+GFxel2cWW+Q3ogwy4WzZWkglkiH+3OCbMJZKxaFFM1Vynk8ceT5BZC\nRQuB7i+2bTkQo50jkE8eLx\/Nzj\/nBOza+QRsM0ivXaiXHaZrg\/XheRCjlPKMP3dwEyxdVZD6dtR8\nl3N\/tmVFS\/ZNJUPS+qVDYnnhoLgixyHdnyK7KM0PFYQ5GgKp4oR4t2GB5GPj89ly8tMKpQsWLQLj\n1rthmclAiFA6z43kxr3POgHpKwW0FM+G8VfkFFQSDke8Sv5ufwiJyJ5iWVLvjo4bGrVpuoYXinMd\nspYSFWXY+RziXIZeEDKCBeqiOH+6KMQ4neyN97xE+1knWaioxtaFhxdjN+mXfyXzuZmMwlOTycis\n+rkMeLI4HRayElhK4+X9hZ7Cqdu9fgr0ZUfjxL4VkM7vZA1tT36zYI4HqO7\/RrMmMgYquKPB6vPv\nBnvsfzPY67HWGe7nxfQggZ87gaf52DjDbeDk3pLhGypyyyLs8lLiTXKe3O6rRrVWBWPdqzLgmXvi\n5JWAOivnJnnfqR2HY+EeML6xHl+O1DVwZ1\/+7s2wPsj1uRMBqj1UTYHqvfuD3JZe\/3l3CJP4YYi7\n8S96j+FavTtbE+wRQRP6ergesq5SkC+5Q2h\/qgK\/n6jDi2ol2GuAbGEc+gMYdBDHGqao0UBmOT1s\nDO3YSj+vviPL\/+jKQEWr8IJ1F7668NFYW6HvaeJfHjyAGuLqBxPVqCWzvJ7odPFcXGytGfsuLjZV\n3nbA67dDCkiTvKt+owxFRfPK0PIYLtprO94mgLUTtOhaUYC\/j4J90TRM\/w91EF+0FN4ZF4+Ubbse\ncFRnPnkEI+Y\/DePSp2mj38WlliAKQl63Ecf2EMCa\/8gDKPog4HrAro82DV8ZOdJBgX4Uj+7owG8\/\nVFYj9f2BhPYVljr005PWn67\/5esftH+z3opaYIgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/divine_crepes-1334346357.swf",
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

log.info("divine_crepes.js LOADED");

// generated ok 2012-12-04 11:16:57 by martlume
