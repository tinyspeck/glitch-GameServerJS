//#include include/food.js, include/takeable.js

var label = "Precious Potato Salad";
var version = "1354649335";
var name_single = "Precious Potato Salad";
var name_plural = "Precious Potato Salads";
var article = "a";
var description = "Potato salad, traditionally an affordable staple at Glitchen birthdays, is now fit for fancy dinners and lavish banquets with the addition of the particularly precious Trump Rub.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 860;
var input_for = [];
var parent_classes = ["precious_potato_salad", "food", "takeable"];
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
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-22,"w":36,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIMUlEQVR42u1Ya0yb1xkmk\/ajq6Zs\n2qSp0qRo0jQpW7VKy35OirSpPzZl6safatM0flRKlFUVU7osIcmK2hLA4U5CIDaMuwMEYm618Q3j\nC75gG2MMxtj4gm3uGBubS9NofXbeQ+xBSLpmJdJ+8EmP+Gy+c97nfd7nvOd8zso6vo6v4+v4+v+5\ntra23tje3n6LIZ\/dVzBo9qNSnxWPrts0tcZvxy2hkuC+\/1XQGBpLcxwZod3d3VM7Ozu5bOJGvbsM\nMvtVyFW9kEgkEIvFEDULIOq4gobOPNgNMrTZfoxq3atoH38dkVkj5p1DmNQ2w6TuwrCpFYqJ6zDM\nlKPW9C0oPBc0NDfFeGFiAE5Sxl6vF4ODg2hpaUFVbT6qlN9H9dCPUFdXB5FIBGFbPmr130OV4QQL\nepIFfRu9jl8hvmTCtr8Pu95mzEhvYFxWBKPmOrrNP0eX5TRG7NnwTqjgdDoRDodBsSjmly1jTjQa\nDcpkMlRWVuKBuBEa2QOMDHVjRFcNrVGAnm4hJ3i\/vQXrAQviCRMnZ5z7K+JBM8e2r4sTJPj1lZxk\n+jNhx9sKg04DvV6PqakprK6ukiVy\/ptqEsqqtLQUxcXFmLYMYTNsw27Mw\/FZMoDHWyF+73MMw2EY\n5GQeJeaAx8vYXpnaIxgYxbxWwIlszTTCOngTlv4CbEyKMgTD5juwMlsQwYeGXGhNEgSDQVJTckhN\nMi5DnMpZUFCAwsJCNDfUZdTYDyLxr90oPt3wYnO2B0lPB5J+ORIBfYbclq8nQ25muAztt9+Drjuf\nk1qw3oVTLsCEohrDlgK06n\/NLUIEx8bG4Ha7kUwm45nFRGzZh6BK14WC8oucYFHZZYhqijMZU8BE\nYOQQWYszBx2aM5h3HCwfYXO6AT6DEDOjHRDXXOYkVeLrHHZpITZ8Kp5sJPYQ20kXdtbcSC1OwD89\nhpmZGRAnriQZdHFxEUW3PkDZwA9Q2nsad6Q\/hbSnnme6vyypub2SLrtVcCur2Sr9GBUjJ3BH9wp0\ng+9jSlXCodH9ES5TOX+WbEGW6BbdQP2t85hUCHjCNMd+2xDIJp8\/WsSK34qVlRW+eKi8cblcjrKS\nYsw5h5GM2bnpaUBqxQm\/vRORsTqsTdx7Yu52TnTb24GQsRp5Ja+gqPcEhOJfoLn1HKpU30TV0Hdg\nlBQgOSflJJPRcbhHu+DTVWQqMj5QeaAapF7a7+TpaMBNKsZJQYxo1FidM3H2lAWRI48R6LtHST8C\npnpudlKViIXGStAg+iU6O9+GzV6CYLgbEZ8B6r47qC99F71Nf+HqxyZbeEJhW9tTq7h9LwHm2bTS\nXBRGlD6vh6dIQXCCa5GZZy6IA9n5lVi212Kw6e9Pyt3PvhvOIL1IEqExHqyp7bcou30anbW\/4+p7\nteU8sZi7BpHpjzNE57VFCOnKeRKEtakHHKmgIkPQsZVYymQUsXVh3t73H4IsQxpIfctvKkJL5bsI\nm24fWhQEUsuvb8iMVSvyoJNd4X2QyBFJ6oeikdegsL6JIdOb3L\/O0fdZRQQ8kTQSQRURdGStra3R\nPomdkPSZQV29l2EavIBrt15FU+NZZvQL6KzJ5eWmBeEaKoRHLeDtgyam1kL+3PJJeNJEjJRPz\/co\nKsMys4M5+DdoPOfRNfAHlIpex4D4Hd4rCVZpCeLri+CN22az5SwvsyYbX+CTpyci\/1BQypoUeNjx\ne3QJz+PuzXc4qG180nyFtw1N5z\/4X1JX3poHJbtXtl9DW92fWbv6DQwDl2DreI+Xcyuk5t4mv6U9\nT0ituVhLEmOK9cNkIoZYLIbx8fFTWX6\/\/6ROp0M8Hsdq1MPZUxa0GIjgzvwneLxuxuc7QT7Rp6kg\nAu5hWJT1\/LmQWYhF1yAWXDIsudWwq1sgExejuTKXJ3L75p\/QXpfD50srSdsgeXivwY9g3m3ClMPM\n+x9r0lhfX6ftz5HZSRQKhcRut2NjYwPbqThiC9NYnlVDO3Qfi769RUKgduFjWfoMbbyMpO6Gu\/PA\nggq6JJjU3eP3EZcSfc0fcaKNZRe5upSUVnwNY0MiuKwqmI16fmigXkxWo\/5nNptBlc0QNBqNZ1Uq\nFWZnZ7m0rPb8YQJt5Eatgh8WvGMPER6twqz8Q64IBbMpr6Ja+BPk3WL9T\/QzXLrJti3VVSx5NIys\nFm6rAm31JWhvKMWDtjoo5FJQrNFRtl\/Pz2Nzc5PHIeXo9ETfGwyG4KHDQm9vr8blcvENmwimkSZK\nPqV9cmBgAJKuf0LcVIOOlrvobK1DjTAPd0XXcK\/hBoSNH0B8vxE9PT383NjX18fHqNVqmEwmBAIB\nOrkcmJdEINWIHMFisRw+1bBJ3kiryFY2J5dKpXiGlB3dpydNg5IhhEIhDlKEQGe8SCTCwY5uSCQS\nB8aRlZaWljA3N8fLmyZGYNV0PPfIxVSsYCuHD0yTIoK0gKj0RJxAJiZQYPofgYI+D0SGyJJ6JMB+\n0AkmTY6VNs6q+PxXAqVSeZLtyw4aSBM+iyCZmAKSMqQUKUeBKSny0NMEvgjT09MH1DuwMJ53tba2\n\/pA9HKUJiMzTBMkzR0Vwv3pWq7XiS7+TCIXCs6zUKxSQSL4MgpOTk\/vJ5b\/wi5NAIDjtcDjGKSit\nuqMkSKVli4GO+5tMxdz\/+bUzOzv7NeaLixR4YWHhSAjSbkEthZFz9vf3f\/crvxufO3fuG1Kp9Cyb\nXEKEvgrBJ8ptsq31Epv6a0f6qwIR9Xg8b7G+5yA1X5Qg8\/QmU62Kee7US\/8JhBE6xRpyLiMoYcE\/\n+wKC1LIq2A6SfebMma8f\/3h0fB1fL+H6N1p863Y9BjBoAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/precious_potato_salad-1353117779.swf",
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

log.info("precious_potato_salad.js LOADED");

// generated ok 2012-12-04 11:28:55 by martlume
