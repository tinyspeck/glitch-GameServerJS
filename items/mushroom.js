//#include include/food.js, include/takeable.js

var label = "Mushroom";
var version = "1347677161";
var name_single = "Mushroom";
var name_plural = "Mushrooms";
var article = "a";
var description = "An unusually sporous mushroom.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 3;
var input_for = [4,9,16,26,37];
var parent_classes = ["mushroom", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-16,"w":17,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHuUlEQVR42u2Y6VeTZxrG\/Q\/4E+bT\n1KlbIOwCIshY64YIguwQsrNvgiyGsMiqkU1BhIgoCArKpihC2LeCgAgoKKlIFWs1pTpjHXWueZ43\nEGToaTF2Ov3Ac8518uQDOb9c93Xf9xvWrFk9q2f1\/HHneZu3paqLp1af+vVlp89f\/u9gjxVe8mft\nPsoX3XzMfSPEqwERXhO9Ive5XgFedPHwrI07OKPgyGaaOaw\/DOxBg0fg9C0v5Wy7D34a9sWHqVD8\nWxmGdxNBeDvqhzfDYrzuF+LHHgGed3LxtJWD6SYvPGxwV9yvdfvfgd6pdrK9V+eqVDZ64LsWb6gI\nBB6Fa\/SeAH4YD8C7ET\/887YIc30C\/NDJw2yrDx43eWPqhgfu17thtNrF9ncF6684oDNQ4aS4W+2M\nyQZ3TCu8MUuc+ZFAMGAPQ\/CWgP1r1B\/vRwPQIrfFuSQrnE3cCnnCVhTFW+JMnCWKE63QUbIfd6+6\nqB6Sz\/xd4NpL7Fg9pQ6qwctOGK11xcR1d8y0+eBpBxfPSfZe0ryR3D1p5+Ba3i5khBohwVcfR\/0N\nNEr0M0C87+L7Fvk+kM8L\/Gw4RZGdZ\/u5\/SCAGKqigC6YaPDAY1KyJwTwWTcPP\/TwcaNgD9JDjJDk\nr88oTsReAigRLoUtz\/gKg5ccJZ8FdyN\/l2dzoS3aivej9+IBDFYdxN0aF4xfc4OS5ImWeYC4mhlh\nqgFbUBRXl3mlQPFifcQKFgGPCA1RKLVEf\/kBhdZwtVm7WQ15e3DrjC1az9qht8yBgblz1ZmBHCOl\nrsvduQQqmq+GSvBl4zB38R7mxWZcY5wUGTKlzouxQN9FB+0AK1JsdK5m7lRdO7kbN0\/vhaJoH7pL\n7fFNhSNuVzqR7BxEWdq2Za6FeGxgXg9xWJCK2eq7ty5iBOx55wwQS9yj91Mx5ugtdZBpB3hsu\/xq\n5teoy9kFjYvFdug6b48OksesyMWSUhDqEr37u6ybd2zj\/CsL4d4s5h7hQ11V54+q5Kg1ukrsP71J\nSlKsWOXp21Ep24GarJ1gXMzfC5rFZgL6S3mL4GxCNI+FILf1CHBdx9zFB9cj2GMTIn10EeDGIuVn\nk8ahzaMuddWJHaDT4ZMBzyVZy8tS\/45Lx77ClRNfo5a4eP3UbjQW7EX24c3L4NQu6kHo+Dfw7L9g\nxLVfC\/6BLyF0Wg9\/140I8dRFkIcu4+JCo5DoKLUq79kEa1xItgHj4vEdqM4ipc7dhQLJFg1Qgh8b\nUTw9poQ0b+Hem8B3WAuO3V8ZiZzWIVZkAoHjOogObkCg+ybSxeoYxIsNkHnIFK3yfZ8+YgqOWNgW\nSa3IBrBGaYoNKjK2o4qUmt7pt17uHBsxpHOFjl8S59aiKHkP2i7y0F\/th5GGEFTmOMPPeQN8nTcS\nJ1mI5OqRL6ePstRtysZ8m0\/fIqeitkgKJJaQx1uREG8DLTWFTA82mp9nBkyOJGQIS4Rs0pV6TM6o\nUyeibRiw+7fCMd4YjpFrIfh+IBGFR\/eSv9HTfCm6ZZpP77HUqry5keaSvJgtZGduBS31eQJ5Mtp8\nyUaIFdIxwkaoly6TLVrmYE89dF0SYKDGH487Y\/CkR4LZvnhMtUZhpluKtFBzTaeXpdrItB7OmRFm\nitwoC+THWqKQQNJyJweox4JUrFacWF\/jYgSHdChpgmihCW7X+mP8ZigmiINKAjbbK8Xc6DG8GErB\npCIS6aEm9MFh8LNWmyzMVJEVYYaT85A5kWZL3KMbIIasrGg+WWU8mj89MlL0mDHSWOyFoboATBGY\nbwngd11H8H1\/Ij5Mn8HreyfwqCMaY\/W+n\/eEnRFkopCFbUZ2hDkprQVZ\/sZLAP+7UeJIkwR7sBgl\nB1viTn0AhusCSfaS8XI4jYF8OZwKzBTh58lcqIaSVa9G0yVvxjK0A03xN5JnBJtgATItyGgJ3EKZ\nqYtRPHUWabMEurOYTq3MdsRYQzBGrwcTOAmm26OZMr8ak+GdMo8oH3MjaeT9Mfzjnkz+82SmLR7m\nr7ybk\/wMJCkBxliATA00XObgxy7SLNIGoaWmDZMWYoLmEg7GCeSDJpLFlkg8JVl8O3UKbyZz8GYi\nm4F8MZSKB63RGL0RirGbYXQkqfob+b8NKhUY2Cb5GoJCphPI9ODlJU7wVT8uhXOo9Mld3TALXZp9\n2ALtZTziZJAG8lF7FOPi+29PY7orDn1XfOcl1qj3inhlgztOwFYlEshkfyNSYhMi4191cUFHA\/SR\nG2WOs\/HWsuo8F9vuy0I1JOnqKUUEHrVFkbETTWalP3qrxIx6KkWLuixc2aNXHJ8tkxJXEsQUxIiU\n2fhXITNII2VGbKZdryiMNdcs\/+uFbpKOcj5G6gMZyMmmQxisDUD3ZdFHEmrUVSG4srJG4evrEMjB\nOAHZm+TJI2neTQpKs3k81JTJZ+YhM9CRlB1ppsyJ2PyLv9DqC9zl7Rf5GCJg98mM7LokXKLOCoFG\nXRW8lW8XCikV6AcSUNWCm0l+i6DpQcaq9BAT+fFg09\/80Jo8F3kbyWRvlYgB6Sj\/WPx58bQf4FKe\nniUjEZWhVju0Jt9V1kS6m7r5sSh4aylX1Xn+T\/Avkrp8V89bxV6q1lIKpVbLBe7gnwJu8cc\/X6f1\nAleilk9gYwVfZ83qWT2rR\/vzH7NsleEKgCNWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mushroom-1334599867.swf",
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
	"food"
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

log.info("mushroom.js LOADED");

// generated ok 2012-09-14 19:46:01 by martlume
