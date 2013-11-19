//#include include/food.js, include/takeable.js

var label = "Meat Tetrazzini";
var version = "1342483398";
var name_single = "Meat Tetrazzini";
var name_plural = "Meat Tetrazzinis";
var article = "a";
var description = "Some creamy, meaty tetrazzini.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 192;
var input_for = [];
var parent_classes = ["meat_tetrazzini", "food", "takeable"];
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
	if (pc && pc.skills_has("masterchef_1") && !pc.making_recipe_is_known("37")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> a bit more."]);
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
		'position': {"x":-18,"y":-22,"w":36,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAInElEQVR42u2X+VeTZxbH\/Q\/6J\/gH\ndE7VKrYd65GO63FcaqcWl1aQbZBVZFVEJAKCYwGRVZawyGISiKwJawgkgASSACGsIYkJJCAQNqXT\n0zPfuc97Dkxn2o4dtTPzA\/ece4CXPM\/9PN+7PG+2bduyLduyLfv\/t3yvnXxBwB4ZubjSf9eO\/wmE\nIMCJLwzc4yj2+RD2Eh+8El\/DWlUwlgX+xvowZ6S7fgD2P2ncScdfNRli2IQxzBXffpEiDHQC88I\/\n75L9JnCiwN2uG0EKvHdB88gd38lisd4ag5dNN7FaHYoFvgcG757CDxOFwIyQc\/mTQIwKr4Hv7US+\nB1VB+zCZdFom9d+74x2rt0fG4B777sb9C+\/DluuGV9IoztcaIrBWG4aVpyFwlF1BnyAYNRkX8Z3x\nMUYbbkGfcQHm5D\/Bkn0Zz7Pc0BFxAE2xxzWYEYj\/Ni2QMZXfCAqL+u1LI3kOpoS1Nd5Y4L0X986\/\nj8bIg1jju2O10BMrxV7oJdWkN5w5dbtjDmM24zysaV9BnuMKRdEVDBJc963DUEYfhJp3FIZ7p2GX\n3tpUeVKRBPtw6elfDba+vr59bW0tRSuvgLohanOj72sjsF7khVeFHhzgGqm1nOeGzMs7Uea3mwOs\nC\/2UA7Snn8NMmgspfQkWgs3z3ImNEpGE7cO0IAjDrTxYVKmYepaNqVGVg8Vksf8t2MuXL\/mjo6MQ\ni8Vozo\/G98ZSaOujYO1NwRgFXC\/1ww\/6eqq\/VKw3RmOl3BfPeMe5tKd+\/TtU+H+yCThX5Ill6XXM\nlV+BJPQAB8maiNVwb+wRyNPPQxh7DFoSYWHsCVjcubk5MAYA7\/0r3AE6gaOurg5xcXFISEhAZY4X\navIuoyL5DPJvfAZh8EfoiD6EVUEoXlVHY7XAHQukoDntLCThzpDfPALrQ5d\/KMggy3wwLwrExL3P\nkUFdzkok5\/IH6Ix0hin7IqwlXlAmnkYu7xyUik709vZiYmICKysrTNEdm3BEDaFQCB6PxwHmZcVi\nUpWE7jpfZKbF4UHACe70LEW2zAuYpc3ViX+ENGo\/JNc\/RUPEPgwlnoQt3eWfUmx9cBaW1C\/Rcd0Z\nAp9d4Ps4Icf39yi66ozagI+gunkQ+vjjBHkCE6r7MOlKyItgHCrE6sq8g0s5kRp7enrw4NtodDXG\nY0zXjukpGaaH7mG0JxEVhbGouX8RpX6foC7sM1gyz6Hh9lFUp15Cc3EwlDXx6Kq6ibY8f9Tc\/QqK\nuFOYLwnEbJ43DPfPQBVzBELfD5Hhtw8yQSQWLG2oLzqPiqRDyPXfi1y\/j\/HgysdQN\/mjryUc\/Z1Z\nGO+5jVmjlEv3NqaerFWK8e5QOCx1cFglmDcUY3YklTwZxr4EjOVdxFzuN9D85QQqog5ClHEJIz1J\nsOoe4YWhHPOmKm7tklWK+bIANIXvhzhoL6oCnFDh54QS3ueQi\/xhm2qBsT+RMhOEhpILKEk9AlHO\nCejafDCu8Iem\/Rb6+vqgVqthHKmH\/bnSwQEyBU2qEDzvj0RlgQcaSj2gabsOZW0ABtrC0SfyRdmN\nP6Dg1knIhcF02mt4JrmK1dkOPB\/MgmUoG9ahdFgao9B\/5xgKww6j7M5xlNw+BtHDs2iucCX\/BgYt\nH31NQbAMPoBp4CE0HSnopBk6LPeHqfcqtLLITcCpqSmmILY5HA4N+6WxOgXmvnDUP3ZDTaEL2kSe\naK\/ygrzqMqkbDl1nFMae3aVAX6OFvF3kCn1nNF6M58M+mkug6XjRFI9mqrfh7if0LA\/Tw9kEnwFd\nRzQU1b5Qt0ZCkHUKwuxT6Kpxx2R3CKZUN2FUhUEv98VgqycHqNVqsbS0xADF2+hBEPuDEZfnh0Pf\nEQRz\/w0MtQdTKrwxrgyGtNQFzeWXMNpFV9uCFnPmNsyMPca0LpXUSMag7DoWzU9h7kgAP+wQDKpk\nrNok0DSHQNMSQge8TZ9NxkRvPDqq3DCmCERPnRuqck+Sn8JIRwC0zZ7QNHmAn+YJs2kSq6ur4Jqk\nvr5+u1wux+LiIidpd1sOaosv0Ik9YKa0a5q9YdFlQdseg1aBG4wDBTCredC2hnDp75UEYcEogqEv\nHs\/qfGidNzSk1IpVROkMRWPpRVTnfwlltSdmhpJgG06CSuqH0rSjSOftg4LmYHmWC9XiMTSJY7C4\nYMfy8jJMJhN\/cw7W1taKu7q6YLfbOUjbtAH9yjKYtMnobfCBhIKYNfEEkQi9IgZtQne0V3pAXulJ\ntZdKit1BZ5UHOsXeVJt0S3TGYMlcCnVLBOfSx+ep292hk4eiuuALrmOH5VeRGbcfxRnukFQmwGTQ\nsvkHo9GIsbExNg8PbAIqlcrtpCT0ej3Gx8e5E9D44WBpHmFEW48eaQSXboOKh35qEjnV54gyBjOU\nOqaajKDbSGGzNoUUuobFqXx0PvVFi8ATFRknIHp0hgDDKaWnUZZ5CdYJCZaXXnBQs7OzXFzWrAMD\nA+xW+elrWWtra4pCoeDozWYzB8ic1cIGLPMFux5Ls2qaZzJo5TQypLfRWRe96R210ehrS6SarIRZ\nx8ekOgcG3VO8sPbAZtFu7kPNycViUCQQ5yqVisE5qB9+\/k5uaWnRsBOwhSzdDIydkDURq1G2KXOm\nMAPfCPY6Z59n6202G3d4tj\/L1gYYcwY6MjLCAH\/5zcZgMLwnk8k0bDHbhEn\/Y8D5+XnuQmfw09PT\nsFqtXEBWN7SWu0fZul\/j\/f39P4Gj566vfd1ikLRoE5LBvGtAnU73ZnA\/hqSuTtnYkKXmXQEymI26\nY0OZhDDS8zf7CkBXzg6qSRnbmOYSB\/c2gBtwbKTRbeGgegtiYrz1dxKCdB0eHnYwAIvF8kaALK0M\njL3zkWriX+zUtzFWJ+RiNrOYogz2dYBMNdYQBGYcHBxM+U3Afs7YOCCAGIKVTU5OythP+lvGhuyG\nExyf3fX\/Nagt27It27L\/3P4O8b6ixZ2rBj8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/meat_tetrazzini-1334208946.swf",
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

log.info("meat_tetrazzini.js LOADED");

// generated ok 2012-07-16 17:03:18 by lizg
