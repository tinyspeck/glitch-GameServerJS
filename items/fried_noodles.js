//#include include/food.js, include/takeable.js

var label = "Fried Noodles";
var version = "1354595574";
var name_single = "Fried Noodles";
var name_plural = "Fried Noodles";
var article = "a";
var description = "A small slippery hill of fried noodles.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 35;
var input_for = [30];
var parent_classes = ["fried_noodles", "food", "takeable"];
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
	if (pc && pc.skills_has("cheffery_1") && !pc.making_recipe_is_known("87")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> a bit more."]);
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
		'position': {"x":-19,"y":-18,"w":38,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIjUlEQVR42u2X+1OU5xXH\/Q\/8TRRU\nriIgsAqCqMSNaA2KhhqTmplqbUynac0kJm2Md1eQ+21hYXFh2V32AiwrsLvclOuCsIoCAQVRorgq\nQgHlLoJ4+fa8Tw2TpjWJte3kB56ZM+\/My\/u+z+d8z\/ecZ5kzZ3bNrtk1u2bXay2dyIevE63m56es\nsf3FwRWIV5vKVYHIS1mNfLE\/9KfXCbj7TbqNcxuNW4K\/Kd5haj\/3oampcJu+True93+Fy07wEjYW\n7kRW0iYUqfciOzmQA0Rz1Ulho2GrxZQVAHNeEOp1m3FZHwQCxN02heD+rco92iTv\/Y3G9wWXKLIT\nXPj\/NSgAthTBFPpKTSBBbUBF3XmYm6\/AUFYGnexjFKUHQJf6NgoKRCgslqO4WAGDLgQFGUEozlgH\nncgXtbnvolLzDgrT\/aGJWwZVjIuCvsl7UzB9V3cPqhqaie48zmVuQI7kA8iVsUgTf466sjDU5GzG\nWUUgijR70VCdAHNNBkw1BtReakJ5iRhnkv0gj1mJ9HAeFKf3QSU9AG3mIWjFgbh1vRqPp6ZM3F6v\nAzaXQtg78HC4tuECtPli6AokyDOkIS91HW3mg9QQT9RkB+JiHnlR5EElDcL5nE24ZdqN7oZP0Voc\njBLFNmiTViE5bD1qL9TDoNyFIoknytRbUZa1A0WZ7yE\/4z10XGvA8MgIbQlO0bk\/Bcefmp4ePld\/\nCWq9nhTzR4nUG7rEJQTigpwEN2QnrECV0g8FYh4Sj9iiQu6HCsVanKEylqb74KzUh0ruT3B+SDzq\njAbDb1Fn\/BNKNLuQQ\/cyo5ZAFe2I4nRvKOmqjrGDUb4FbS3leDw5OUwMe14Ft2fqyTSM1fVQGs8h\nT7YD1Rp\/yJODodamQJMrhjZtO5QxHsgR8lCQsgIFyV7kpWU4+ZkN1HE+iDrggIJUPkoyNkB42All\nstWoVPGRn+JDCXgjK94Tsoil9Dc75IpW4Xb9PpTK\/CELX0i+XIpy\/VFcro6GJmG5UBJiFfxDvw3r\ny8sg1yQiU3kC2XGLoIh2hcZohLa0CrqcUMgj3Uk1R4JYS2NmDSL\/agdpmCt162ZSbR3dW4sG\/W9Q\nLF1Pz\/Igi+SAPGCUcI3BQ\/RXdoj6ajGkEcvpWR\/EH7JFiYxPqtoj5YQNREet6XtOyKR9UwVWkITO\n430HqOhs1SJLuBxt5bvRafoDKtUbWDlksX4olG6kUvsjI9yZFPRE2ilnBqaI8qAOXYWitDXQp65C\nVoIvgXnBmMZHa8mH6Kjci7oz25EicIXwiBPZw4t1cblyI+RRnog96ITor+2RfMwaYsEiaIS+KMv9\nCP0DA+jvbrJITlpZ0k7OE8x58eKF6UaLFvVnttDLb5NHnKCIdCBAJ\/KJM9Sx7hSuLGNFlDspsoay\nc0VGhDvBukF03IXCFckn3CiWvQw3BnDiUxtKioeG\/CBUKANw9dzvKNElCPvCBkc+mU9VcCCLLELy\n8QWQhlohM3I+enp7uaZp4RRMFcwbZoA9FjPSQ60RdZyP9LhA8kYAZUvyR3tAHuFEitlBFbsCbWff\nR33uO0g47AjJKQ9UZwehyfAu8siP4pOuM6DqWE\/m14i\/2OLQH60Q8vlCUmkpPb+V4BaSj6mjVZvI\niz5ID1uGFAJMC7GipJ1gud3JAYKr7sFPqMzcWOFuZCf5QCL8ACJSQB3vA1XcSkST8ROP2JB6C2lD\nN\/r4Irbh0T8vIAgPaIVe1ABerNzquOWUGJW3dDcu5G2HLmkFU1se6UaN4M6SzYx2p0RI9RMuiP16\nIVLJe7IIZ6qWHfMdB9nZXsMUnGmS\/kePeNwdy\/VSSE9ZM6CQzxbg2D5rAqTM6SNxBx2pNEtRodqI\n5qKdrFyG1JXQJnKN4ErmtyMgL1JmBaThbqjK2sagEw47kPouzPiaOA+qggfznzJ6CZXTGvLwBQRm\nQ2ALSEUr5EkC8HL987jp6h\/kJjpaL2lpELtQxospbNmLMQescXzffKYc14W5NPOKpWuRFupEs86e\nqVmu\/BV0dGrIIpYxpVSxPAKmKpD\/sqg5OL8qoly4I45mnz3ZyRbxh+1JSVfUaH9NXnZCvuL3mJoc\nwcT005Z\/mYPVHRb+9Z4HDL3nXhvNwV1IorbnJBceWUTjYB15y5mOLE8YTvvS0OYh7pADwc0nb9Eg\nF\/uRDRxJLTd2L4X8pk30oiaxxqkvFjPVcoVLqPkcKTE7SELs2P3E4+4Qhb6Fb8wqtvfI5DRuPBwL\n\/rfDuqq9S9jZP4LJp8\/Yw91dZjTVxEIRv54UWErNYk+e8iXjL0bYl4sRThF\/yJ4d\/txVGe3JgIqk\nb1ESfjRWeCjPXE8\/y9aQRWwhOmbD4DjVZFHeMJ8V4Fqznu01\/ewZukce4\/rAmOKVR13XEOae77zX\ncq1vBHeHJzD+5CmePX\/BPtB7txE1xi\/pWNpGQJ6sdGKBM11dybP2L8tvR+fyFtw00bFGMzUr3h0G\nyVrU5W6BJn4lxKHeyJftRJNZS6UcZVC9Q2O4dn8AzXcH0DEw2sIx\/Oh5XNHVNQP57YMxWPr60Df0\nECOjQ3j6\/Pl3BsZgXwduXs1Hc60I9eWJaDWfRntDGtou\/iOuXEjFFXMKu\/83Sm5qcoy9xyU8QYlz\nULUdd1DVfvvnw30f8sKtnhnIntHHLO5TCfrHJ\/FwYgqj5JXH089mYoLFU7b5D2Nw4gn66D2uKlRC\nXLb0MbAZuP5R08+G+\/4yf9ut4CA7CfL+yAQDvEdXbiPL0CPcHnyErsFx3Hw4TomMs+c4gB+Lqz1D\nDKz6moXBXX8wLnijX9Tnb9wLvto7qOc+zkG9CSAHx4HV3riL1vuDwv9ItVetqz3DwaSmnoO5Q3Cv\nC9h4p5+BXezqUXQ8GOf\/z\/5x6ux\/xLsxMLq\/c2DMdJOgfgqQU+3S7T4Twe3n3p39p312za7ZNbte\nf\/0dw0zBn7VCKxEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fried_noodles-1334208489.swf",
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

log.info("fried_noodles.js LOADED");

// generated ok 2012-12-03 20:32:54 by martlume
