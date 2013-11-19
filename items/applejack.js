//#include include/food.js, include/takeable.js

var label = "Applejack";
var version = "1342483399";
var name_single = "Applejack";
var name_plural = "Applejacks";
var article = "an";
var description = "A bowl of apple-y, oat-y, cinnamon-y applejack. Yummy hot or cold.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 25;
var input_for = [];
var parent_classes = ["applejack", "food", "takeable"];
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
		'position': {"x":-18,"y":-17,"w":36,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGJElEQVR42u2WW2zTVRzHeTYaoolv\nKpqYGOMDiS8+Y2IiiQkSibyYEIiYaGB4IdwSWAAdAyRT0HDdBrt1uLBLt7F1peu2br2ul3Vd7\/\/e\nr+u\/\/bfd1svW7es5B1Y2blnUBx\/6Tb79n\/4v53zO7\/JvN22qqKKKKqqooor+9wKwmXhPIilUh2Jx\neWQ2YeQCITi8fji9Abh8Abj9QXDEHnLeEwzDS+wLReAPRxAIR8GnBIFPpeSxeKKrWCxWk\/m2\/iuo\nUDy+NZLgu+wEYlijx9CEFveG5OiSjqL7wRjEwwr0ycdxf2QCg2NKSBQqSMfVkCm1GFbpMKKexJhW\nj3GdAcpJI9QGEzTGKehM09CbLXB6vPD4A0jwSW86na3jOG7zhiMV5wWjzmJHj0yB9vsPcHdAho7B\n4XWA\/cNyjIz2wjDeAuMEdStMylZMqdpgVokwrRZBr+nHpFaKSd3IU4CG6RmYLFaYrTa4CSyfTAqL\nS0uNz40subAjO78gKPRmNIklaOkdQluftAzYKRmCVNYN1QiBUNyAW1mHWf1FJIyXEFaehXPgO0TU\nZ+AfOQqreB9S01fA688iqjqJqLYWUc0vCKnPgdPegsUwtA7QYrPDanfA6XZTUJRKpS4arLVwjbyQ\nQSsBut09yADb++5DK78Jq+J3eCYukMXPgp\/6DRnbNQgzfxKoamQcjZhs2YG+6tcgu\/QBVA2fwi39\nCWnLFbikhzF08X1omr+Af+wkQuMnCfRlzDnr2TwxXS18uqvgDCI4zDLYbNOwO51wuFzwB4IECQKL\nJvk4VCguorlXgsauAQbY1tuPqdE\/GBSNiHPoB\/gU1ch57yLvE2Ep1IGcp5mZQrV\/vwk28V6IT73O\nxmuturWNmY7vHX2JbcTW9w08Dw7C0rMXM+L9bB1qn6EZTrsJLjdHapPHysqKdxP5IF3Jo76zHyJx\nN\/oHROAmzrMHgooTCMm\/hbVzFyR1H6Hoa2HOOJugvbMd+jvb0H3iFdw7\/ioDuH\/mHUy178Zk82fs\nOwU2d+xmR8mF92Dt3YfOYy9jsPZdiE+\/AVX9J5jpr0KEpH8VMqypBWdTIhgK0SiCAdL0\/iXugF9Z\nw26i9UKjI1ivI6g+D6Poc2hufAhhqgbB0ZMsCnRRagpjaNtZHtMoRXW\/IuNqw8DPb5VBB2rehqbh\nY0w2bWfpNt3dhfhkLathut6C+zZLOwuM\/jq8Pt9DQOI6OoiY6su7oDeXIp0oRXtQSmmwGGjDgvk4\nrPe+hFNchTiZyDZ4BLm4GrlgH0uvW3KARYumkx4pmH\/0KLPk3JtlUNpABtHOck3Tel5dd62TMVcZ\ncPNiaVlYXspj1nyDdR+De2Sa0jnrZaTNF1EMiNg5CmPr\/ooUfAPcQ1WsDNwD++FRnC0\/R+ehC9FO\n5w215JmD4KSHygC0tn2yA3D074dD8uM6OMHdw+DShaU61sUz4UR1NlcAhSzyBhK53nWQec9tFLxN\nj79zN5G1nMO8\/TKDsksOwzN2unyddip1MdDOSoVC0u6Prqk1bvgYvGPV4OTHCeTXcJENOqVHMBfR\norS8gkg2J3CpNa+aMUfAGBLm2MWV5SKWF3woxOTI2m+Szm19DJw2IWG4BmdPFQLDp5Djmh+Dk\/tW\n64imj8Kt1tbq+ScdUtXAr29AJqJ\/GLV8EW5+Do74\/PoXNqWdcIaMlqiA2Fwe+aUSVrU4H0XaJ0HC\nfJUV9ZN+1sIvMj\/ThPmIGksFgc2fI6+5AJ+G0R+HbTYLWzy755m\/Jo8g5eZwit3oFxaQmC8gW1hE\nsbS8DjiftCMbHN2QKUwh4ysD0Syl84uYDsQhs3iY1VwE1tmM8FTkniWFM3jIFOQFCskl5xBOLyCU\nySGYziFMjlES4eRCAalcEUnqhSJ45gLb0LNMn6UbZhEiVrrDDGx4xgu9fxbWeLbLmspv2fC\/GZnV\ns0Xni3dZYmnBTib0kcnpIgFypGNvah6e5DzcZAMuUjPOBKmbRLYM8DzPxNJlOIUjCFOIlz83pRuR\nlPwNMoeTjTT8FISC\/VNAWjoUilrjick3lM6Nitannc\/uoKkgIF7aaRzxRgANwQSrMfKmkE+Fk9X\/\nKVhFFVVUUUUVvVB\/A2qb5EFm2gXXAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/applejack-1334207176.swf",
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

log.info("applejack.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
