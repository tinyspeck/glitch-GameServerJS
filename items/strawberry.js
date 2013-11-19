//#include include/food.js, include/takeable.js

var label = "Strawberry";
var version = "1347906572";
var name_single = "Strawberry";
var name_plural = "Strawberries";
var article = "a";
var description = "A luscious red strawberry.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 4;
var input_for = [2,58,98,240];
var parent_classes = ["strawberry", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by strawberry)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-16,"w":15,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKgklEQVR42s2YC1RVZR7FkXvOuS8Q\n5CUCAqICl4eooGg+wHyMWkBa0ZQppWWWmYbT9JrJprFWM6Xms8lHlI5mZhI+Akm8AqL44goiKqhg\nolE6YlaIgmvP\/g4HBJc49JrFXWsv1r1wv\/M7+7\/\/\/+872Nn9Rq\/IFwOc7Nrra+DzwTF3zbb4tVvA\nAcnBc4TaLWD07KCZA2ZbIH62S0CRv+hkS7UKmWyxDZgdnNTuMtk\/OTCCYFYBeVPifXBSu4EMj\/OM\n6TOpG1pCUsnB5e0CVACGJ3jjtpBqRi2p\/zeYAju7mKJmEu83OSsJDwx2Q+zIzuj\/XNBtIX\/XbieE\n32F7+5Qie3scoYqbSXxWSNmoXB8d9vlJ2NZJwQt3d0bss4EtIH+XBjpkb7+gUAM7Sh3oK+FUkhHH\nRykoNnRAiQZqM9hjLwEPdSGkzh57qEyThL9HuTaB9n7EzxaW4G0VCo\/3SrGM7fLrhvyhDh1SCzUA\nAXKUQNn363EsTo8yYweU2XdAKVXh4Y5L\/fujesAAXIqKwrdhoSgwGrGbkNnUVpOMaWO8EPFHX4is\nNlN1eJxXwi+CO0DnbP1lnLjPoMKdIMhJqlyvR5W\/Py5FRuJCaCi+Cw7GtXHjcC6sJ85O9cDxSUac\nCwzE0U7O2BUqoWSsATtNOnwl6ZA8xAPDZgSqipneE9GT\/BExzrv8F2VuvxOde9WMsoEKjmtwVd27\no+b++3GZbl3u1w+1Dz2E+qQkVEWFI3cinf2TCScD3FAzdCgOKTJ2WCTsZiZ36XTYQcAMata93hj9\nUoiqMS+HIHFuOMbP\/Zn7+X42xB53HXIf1KPY2ODemY4dUUOgMxEyzr\/hiPMsd01cHOoffxxf+3qi\nwNse5yMsuDZ2LE56eOAgS5tPiTI3B9xKTZ7g3wJy0vw+1W2GzKN7B7hogdah\/xk2DD+OH4\/aiRNR\n0teMErpakaDHJXd33Hj6adRPmYLLd92FH\/h3V++9F5XduoEd3wJQ5DCLYNupbdQGs4z4WUFNkIlv\n9cITS\/ra2gS4h9nbrwFeHDIElx+Nx3dDo1GTmIjM+xTsj1dwLtQTdU89hfpp01A\/eTLqHn0UV++5\nBxd69UK5pyeKFKVVB629FXzBn\/OCnZoA73k1lICRmLIk8n\/vOntDpOrS4XqUuLigZsIDqHzRGRU9\nPXCdMN907aq6VUfnbkyfjvqpU9US102YgJ9GjUKVJRjfRUSoDSSqkOfMKiSb8A0jcSTKTwXMfdig\nAn4u6\/BYs1KrgIsj77zj5NrZReQO4t0zZ2eCg2B72BPHJhpwaVgsbjzzDG48+yxuzJiBayz3T8xf\nLV2tmzQJ39Ppk7EKTs9xQJmrK37gTQjArN4SCl5iLKaaUNa\/F9IJtoUSgBsJuMzLfAtg3+o7Ambb\n28\/crZXmLGfZTo6Zo8Fuahnrn3wS9SzrlQfjUR7niLJEAy727o0fRozA4eEKKgh3eqYJlT16oMK3\nqzqsszi4rf0MOE9Hj\/r6NgGmUp8R8BNZwtjB7hj8RIAKKHRHQCu7N4cL79MrqGSpSn18cGXMGNTR\nMTFOrrGURQ87ovJvDqiYZkRNQjy+9vHGV7OM2PecEcd6OuNydLQ6YvZq+TvEgb3XZGxqkM3UJtEo\nhFtH\/dnfAcOm9Wgb4A6dznrAqSOKurujggP4Orv3ysiROBcejgsDB6IsugeyZ5tQONmIyiEW1LHE\npUHeyOon43SvANSwk490dFQrkEeJm92paxjS6dqIaczfp4TLitVjTbgB419raJLHFvS5M2Cmzr58\nTxczzr7CcgX2RM3o0SgMcEQxFzoR5Ymj3TsjJ4J7cYAPrnNgX+cOcp1ZFLOvKiyMzikqnNiHc7Xu\nbRwvX2ru7YxmF7tKanlzJhixLsrc5F7iG+F3BhQL7eDkPzydncd8HWOJjzxhxIW5jnTID9\/HxqJ6\n0CBcT0jAVcKfcHPDcTZFASOxX8tuCzgqs5l7W7i2aKS8uw1qedd6SkjmPGwEHMostgq3WbKLEQtl\ncN\/M9JXw4+DBOBjoir0vmHBwpB4XmS3hlCrm8hoBixgH0Qz5njoUxCjINTWUVcDt7KRDdjcZX\/lL\nN7PXmZ89ZcSWCAX\/JuBrD\/o2wYkcigNEq4Bp7GCrRUauowMuMnO1dOpgsAcyomWc7ROCa8OH4wo\/\nKx7qDhthTob5ocilE3I46w5PN6LqVQfku5hhFa71kNR9\/PJbjrA97ohMo0Ht3I1a9oR7y\/wcVPde\nj\/PG5BGecxpPOK0Cfh6gS8mJ0WM391yrjx62AFfU8vhUy5lWSzdrOeusvbg3v2LG6SkcJ+GByGO3\nbg+gWwkKjrFp8sxmdcdIG6sge5weB4Z44ds\/xLZoDAG3hvqIWqVI+IBawu1VwIUleLW+3e0w6m2b\nnQzYylyced0BJXc74SrnV\/HAzsgn+LchIdgaY8TO0QrKg\/xRzAOB6NB8g4HnvzAU8H2mtp3tYRXK\nOUereGNZjIGAE2NFNIYo7cfUh9QKwr2v6NTjlgoY3+X2z9cb7OycxN2J4ZkmmuRlMwp93HGKW9uh\nZ0yo+osDKkO647i3F4o9OyOLzonRkalpuwaWrs06MYzTtIF8K9xqKkVAspPzk0xYquhSxclaAAaM\n6HT7R4LVkhQjrF9PZXgYkdpTQrmXF2yuLrBONyAzSMY+Zyd1VKTfoi81qK3NwL7QhnFj5m6FW+XA\ncyJn6anZZiyRdUniqVA8BrRa3o8laU76UD12ROqxjYFOp4SbuR05Ehwdke1gVi+8hZ2Zwa7cbGqA\n2Rom49TzJmSzywVUGn9fyOeVfG6DG\/j99VrmGssq4FayrMtdCM09f5WPXP0Bq6cCxnu1\/tS3UpZs\nGeMM2BQgq4vt4d0dm2jCBoeGsgsnNnaV1AapmOWM7Z4mbBLHeIszShKisIsnn41irMwwqnNuFwe7\ncG2tiA3dL5lpRumLZqz2amiK90VjMCYLFWlO82fr28KJO1jOL3zq5dCQjU4S0hP12BdtwSdmCVss\nilqm9SEyskY6ozR2AFINigr+mZqvhoyt599u8JWxoUsDmOjUNXyfyX3aGm\/AWm9ZhVumwb0ny207\noC7R6RLEHa1iaD92Y0745W2cb+sMLPcQPfbGuqkXTOVukckcpplNqjuNWqdprVbKNVo5P9I6VS0p\n9S8NbrGAU+Tyt2lMmwAX02ZxRzk8jaQP0quLiUVXcfHtoS7cN13UC65udIVOZTCvX3A3WKN9troZ\nVEozsBXKzZIupRZpzr3LudfmB6R5smRdyC9+5uaKnD691bv8kGVa6dpwgZXMYcZDBpyeYVYvvnE8\nn95eMGMTSy\/er+Hmn8fMFjxiQoprS8cawYRrC2Wper4sz2yzc42vd\/SSdZ5exgI1tDKWhyoo\/asD\nPg1R1At8QMBVfrJ60RWtaLnm1AoO+TQ+CRZxp0njcBdgDa5JC342WOPrbUVO+ScB36Xmc7HFnjLe\n79KwsLjAUs2FZZojt9Oyxt9zfCznzSxzlKsXyXLKQub7V\/\/v5Q3ZLuJNRap+m4AC9B1qngb7nubq\nIuUmsCrGQhXzK7SIg17od\/vvlbB\/LsvwpiLbBOg\/NFDh6rv8bAEh5v8WbvyM138BU5YNzREBOe8A\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/strawberry-1334213714.swf",
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
	"fruit"
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

log.info("strawberry.js LOADED");

// generated ok 2012-09-17 11:29:32 by martlume
