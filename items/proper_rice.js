//#include include/food.js, include/takeable.js

var label = "Proper Rice";
var version = "1354587263";
var name_single = "Proper Rice";
var name_plural = "Proper Rice";
var article = "a";
var description = "A steaming bowl of slightly sticky rice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 26;
var input_for = [3,332];
var parent_classes = ["proper_rice", "food", "takeable"];
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
		'position': {"x":-23,"y":-28,"w":45,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJSUlEQVR42u2Y+VNTWRbH\/Q\/8E6zq\nH6ZGCDI9vcyMllJ2dVep48iqjBu7oKKEtVEDCYthh9CCQFgMi0hYA4QINGhEAUUgDxGQRRp3sUGD\nCm33aPV37nmZSwdHLZzp6qqp8VV96728d989n\/s951wSVqz4cHw4\/ocPYN4eWFAAP0gFod2TXet+\n\/nne+Pz5Qw2Alb8RxItVTA4EYYFZ0MzOTglzc3cxPT2O27cHMTnZD3aPMS2AwYn3XryYBYOdWliY\ndjSZzjt2dekUly7V2v\/aDjFX5s0Ecv\/+iBiczhSc7jHXMD7eI4JZi+Dp2eDgBVEET+PpPs35aznn\nQJNSAA5nCbAgAvJrCk6ie\/wZQZOLL1\/OiePomu7RZxrz07M7wvRkj+4ftzukeNC16r3Ang0bHH+c\nGdVxNwiMIK0D8NQSGJ0JggPSNY21Tju9R4ukZ3Tm7z++1Y+pi+XC\/GirCvcuvTv9z4aaPGf6aqf6\nymJwf+yyGITAaDIexNoRDkT3rGHpzEuBPpM4EL9H8DQ\/3ScNddfDVJuGWVOdEXe7Hf4Nbm6wUTPd\no0VbVjAeTfYuutTb27y4cpqQAnMoAuSO0jVPKYnGWbvM5+C1S4D0mZ7xOu3QZeFCTii+v1qNV\/c6\nf6nTJ5NtK+cG9ZhsU2PK1Lpktdydzk6dGHRkpFOEpgAclAfjTvPF0Vheo\/Sci+blLvPntHjShVPR\nmGjOwas7XcISB58I9czeWgxe1YtA1tsFD8Cd4U7xVFFAcoADkUs8lbwGrbcjEo3njUPdTgbQ58Fe\nA56OtGJ+7FvjEsBxRj13XY\/HzMmhq6wemEsUkCYiOO4eTUITWkNbby28tvhCeHPRO\/SM5uAdb91A\n4pbU24SnY+34YfwcKmO9lwIOVCUZxwwnMNNfi6dDTXhyTY\/nd3oxc7MHM1Y1Q+nlhW\/dpXxbeX0\/\n5I7ycXwhBEqummcnMWE6i7nRNry63YnvjMWokHsgN2ib4jXAZN21qkTc0J9gbV+BBz01eDzQiGfD\nZ0U9vGbARL8eA+fLMNxVtwjJO5fXnLXLPJV8J5gQ2nBrrBN3x7vxaPQ8nk8Y8fLWRcz06dBfnQpt\njBcKQpxw8rAjcoK2Ld3Mr1UnKwYqEzGsS8N4exnG2ksxaTyN0dZiDOrzMKLPwiPWXc9vtGCeNNqK\ne51luN91+l8qx4PuckwPNOH74RY8vFzBpMX0FYt+nDTip+8uiJo16TDalIWLeeHQxXpAE+6GU2Gu\nUAdb4NRSRxQGblm6eQ9WpTgQ4FBt8iLgBHNrrK0EPdoMVEbtXlSLKggCGztmyMbN1jymXEy0WESB\nh+pVGKhOw0CNRb1nEtCeHQ5DygE0HvdGU4Iv9EofNCq9URW9G3nBziLYySBH0cH8YKepN27UA9oE\n82B1EkZbCkXA8XOluMkgh5rUaM04tASySr4HLemBzIUIXFJH4GJuODpywnDhZAiM2cFozzyE5pT9\n0MV5oVq+d8m71qph8xBgYagLisJcCA7Zh7ep3gKYqKE6pHQS4Fh7iSXNbcXoKZHjovpr1MR4LgWN\n3oMGpS8MyQFoZcAc0JglxflvgnCOgbarAtGWcRDfpu1Ha2oAWlL80Zy8D2eTfNEY7yXCqRlkDnMw\nmzmZH+Ls8EbA69oke0GbgKG6VBFwlKWXHLzJIK+WKnClOBpXNFE4dyIYjQl+qIv1eqszBF4X6ymq\nNobkYZHCY4mjFbJdIhRXntTJ+M6\/xyat0jhYnSimmQCpBgnwWqVSdJEALxcdQ3fhUXQVHEFnfqSY\n4rbMw2hTHWZpP4impH1oStwHvbiIXwCp3l5fSGmkuwiWK3VCQagzTr3NvUXA2uOrBrRK83XmIgFS\nF1MtDunSIWjj0VemeCPg6zW43BRXyHYudnFxhJtxWV+3BK1SSrU41JApAt5o1WC0WY2ByuMYYJCm\n8lj0MCffBUhNYnGR1ZmS5IMG1sGGRD8RjqRnXayJ2G4BDHUx18p2Lf97YX+FkjUMq8f6TBFwpKUI\nQlUShIo4i87EwXQmFr2lVJfk6BFcYh1t7SB18LtqtDDMjUl0DkWhzu\/\/U6C\/Il5DtTfc8A3bG4sx\nZFCzRpGjpziKgcnRXx7D3IxhZwX6Wer7yuS4WixjboaJgO2qQ2INvgmwINTV0hTBzmatzN0xcvtH\nK1O97RxT\/exUJwLWCEleEt2yIPvK46WmM\/Hm66wGCfJGcz6Ds9QhpZjUXXSEgUWJgH3MUXK1Kz9i\nsQabUwKWuEnO5bCmyAvZgvoEF6ExxUkwpLmhIcUNuaEbIdu5BmGuNli2k31VSSt7y+SKvtOx5uHG\nLNww5IopJhcvFx1drEFK8WUGS4C9JVHitTErSGySpiQfnJG54bTMEVXxzmg\/6Qljng+qlK44GbIR\nKf6fI2qnrSjFblujfLft+\/+wMp2WrbqikWl6SqKn+sstNUgp7i2LFkF5k3Swb8UduaFoSPZBdfx2\nlBzbjBqlExqZQyVRf0Ve2EYovf8owhzZYTMV6mKjCXNdLQ1x\/r1DqPPv7Okcs8dGke5rp0n1kSj+\no198PUWR9t2njjoI5bHSvnLF2a7CSKFG6QV1+FYURG4RU5Uf8SVKZV8hff\/niN1ji7i9EnOar51R\nfWiNItHLTqU6uFZRIt+mqFRu19Unuwm6ZHeczXCHLtEJhV9\/geOe9u+XauuDijrE2cYxzudPquSA\ndUJG4HpWV2vZhrtOhJHvskWan0Q4usNGiNhuI8TskegyD603lkVtnqqI2Qp9mju6T\/mjQ+2Dyri\/\noUS2CUURG5DgKRHf5ekmh5cNRHVRFL5BleDzqUCuqPZ\/gvR9fxCdYZMKkTtsxBVH7f4YqQfWmouO\nbhJrrC7RFYaMv6NMvhXFxzYhK2g96951iN8rwTF3yzsklmozS7WRFpPoIVGQ1P4frXwrUFbAGmmo\ny2pVrIe9oDpgAbKeNMbzMyj9\/iwqL\/xL1pUb2Ff1zSiI+AJJ\/n+B0vczJHlbHKF3MvbZmbMC7IyU\nXgqe5rvGM\/+wnUNh4OrlbdDkUKa\/neq4h0RI97NDhJsNyBWCOnHgY2Qf\/BhZgZ8izf8TUZQOpaft\nFHUdKcJttZE5oGNOWFbPai1hr53Df\/0vjngPiTTRSyJQQBLlnhyi1Ck9JWJwsl3lZwlKnRXmsnrV\nit\/qoDyTzWT3W3P+4fhw\/B8f\/wTYLK4YvEo9fwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proper_rice-1334191328.swf",
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

log.info("proper_rice.js LOADED");

// generated ok 2012-12-03 18:14:23 by martlume
