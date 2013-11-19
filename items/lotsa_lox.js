//#include include/food.js, include/takeable.js

var label = "Lotsa Lox";
var version = "1342483399";
var name_single = "Lotsa Lox";
var name_plural = "Lotsa Loxes";
var article = "a";
var description = "Goodness! It's a lotta lox!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 34;
var input_for = [];
var parent_classes = ["lotsa_lox", "food", "takeable"];
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
	if (pc && !pc.making_recipe_is_known("101")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> and complete the associated quest."]);
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
		'position': {"x":-35,"y":-31,"w":70,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH0klEQVR42u2XeVNUVxrG+QZ+BGqM\nLC0QtkaURRYXFAXExCU6A6ggIrLJFtkaaBBtUFBRcck0ARcQsRU0o4IhOOqMiUhEXBDw9gK93Kb7\nsgTQVKqeOecgVEzcM5nxD96qp7rr0n3O7zzvchoLi+mYjumYjo87fvm5NfyX59+1UI0JdaUfHdyz\n4QZuzFSrGDSWg77XK2I4Q9t2DBgLIDwpEkZHa0L+JzBmc4HlyNDxhJ+fXZWPj1+QjF8qsDRKVymM\nX0cTEBmMxjyYTifjp\/5K9GUtgf7wehhvfcmNDFdifPyE5ZvWNuaF+uiloS0GaWj4e0GNH0+2HP97\nkg+XutTHZCpuef7sSung4KHSsdGzGB87zzQ0WIHhoePQfb8dqtSFeC5chL56I4yFqzEgC+N46efQ\nZiyFNmsZVbsuO8hncv2Hsf6Wj2J95VzaUsGQHwq9JFgwZwZavhPc6JFtEnNJGPS5IejY7C0fG61V\nqGI9w\/WZy7nRmzIIqj3MNaqB9iyoU\/2gTPLD4K39GLxdCF3mMvSlLQIBQk\/iQnQn+pP3y6GTBBMF\nyfvTFkp6kxcqDNKVEnXGcgWXvAgGchB9ekDC29NZss6SL\/gcJtlf2aI\/rHMKEe7JoE70gZE4IuyN\ngLAnHJqcUHQn+KMz1gs9cR7QZS2HcDUDpo4C9MuCwUs\/Q1\/uKtxY7cx0P9oLt9e5gov1hCbZnzlL\nDSCQ6I33hyF1EYxJfj5vBRRKwhK0O5bAkBvKXOje7C70SQIxULgG2i+XwLR7HVuUSw3A3Q1zoUiw\nhaLYGYYH2Rgz1bA0P+cVGPpHPtojPdEW5o7elAB8T167NrhAuXUeNEm+6E9fzAxgayX4gU\/0Fd4p\nvbx0lVybEQihJBx9KQvRucmdLOgH7Y6lMBNXKaAuJwikfnBpmz2aCudCeScNpsYM9JMDDHccwMDe\n9eBla3FrjTMBnIPH23zRR9LdG+UG5RZ3qOO9MdxTDr1sDfR5K6CM9oBxq4fk3erv8FZJX\/IC8Pmf\nQRXnBW6rB3pj5kGfHYyBorXoJ+5SPSCpopv1VxPo1hy2qXb3GgwpMth31RnL0EZS+jByHh5u8Z5w\nKt4HXJQYqlgPDDSkgK+IgjItAD1bxLhxwJ57csZFrmlwe3OatZecLTWHAwRu7xpwmQHgYuYyUH3u\nSuLoAiZaQ10xXlAmemJEcwxq8owC6naugrCLlABJHS0BPmoO1DGe0JJMqNOXsGc9G5zZwQabd0JX\nvh4PYjxwPdsOHSec8PC0M7pqXaA6L+a668WlvwPrrnMlJ5iDe0ed0J7iyBa6Fy3G+VQR7mR5Q50w\nn4FQ0WLvPvYF+MpYqLZ5smfmoi9gIu7RjuSSF8NIncoKhIEcyJAZyFzs3OgOZbwXfuqToydjEVoK\n7EH35BRiBkchbx21R4PMBgys94zrDNUFsUR9wU3orXdF91lXdBxzwvVCezTn2aGx2Jap44gnc1JJ\nHKXgVMIjGbjoOXga6QpNoh+G927EIHHQTBqKS1qArjwCYpRjpFmK4ctE14pg\/CYfIzyBuxsPRbot\nbh51gFLhxiCpWg7aoVoyC+eKrASLR6ecwh+cchJ6CNTkB57UubBX+iV6GuIqO53mhCe5JUhqN7ri\n6SbSjVm+MLeX4McwN1JXbhguiYBZsgI8aSieNBRHRhDd6GyJI7p+jIFgLmMym0rQeXsTTheKcHan\nNduD6l61E5r3i1BXaIUqyaz2mvy\/OFpcOyDi\/n3cgeX\/ab14CoxaTd8TVxkwV+7LOldL0tRDRkJn\nlAfuk+K\/T9LVTpw0Fa6FOSMI5h3LYM4KhoFA9iX5ozbdmkFSXT7kgtYT83Gx1AGK3TZo2j+b7fH0\nnBithyZcayy2IdBW7WfSZ85g6b1SZttydZ8IVDeP2OPxCzCaagpJv6yp94SpdD27BdhgzV9JrqUQ\n6LOC2BjSbPeDiUAPkA41xvmAJ7VpJh1v2O6PuhSbKcArZaIpt6ge1Tiz\/Sjc6fyJzzTKrBVNu17A\nMcB9tuGTgJNqOTibOTpZsFSPT7nBWL6WucgXrMJQ2SaMHIyBPicY5uK\/wRApBh85hzSFF\/gt88An\n+NDB+xIgVXuV49Sat79ywKm8CdcoYFXOrFf\/XLtWLrK8WmYr\/y1o8wER66bOU04TpyWQpoowcsOs\nYLcAHTd6er3tiYCOdClPbgk6VhggmZt8nPfvAFsP24PWe9O+2VPPWFoLrd5+B78OlOoGST91VXVu\nLrTHV0OVH8TSTO\/TJ5LFuJjriB\/i7GCMcMZA3Hzwm8kAj56L0zusXgK8dsCONcJkSqsknwiNxdaS\n9\/qZdXW\/rc+va\/O3rrZVOuKfFQ4vbcy6NdOKAfJEOtLp1zc5Tv3tm70iIlucKbBijp3MZXBcdTbp\n1A+NN4FSfVs+Gzcq7HFH7oi7XzuycdRX5QZdjDP+FfHplHuXSXNMppQ6RwHpGJnq1D8aE6AixetA\naVO1VX7KCp+OpJ4c0gRVLrh\/koCSEVZLXKt5kVIK2CCzlv8pP\/unarRMJLwKtInUFu3MyTv1OnFX\nsWtiDk4M30+Ek3kzE\/70\/0+ajsyc0bTPVkLSz70OtL7ImrlVv9PqBaD1H6u3D4bdZxPyqjqtkVox\nwBfOyf9r9fahQQf+r0EnAS\/stg63+JiCNhSt01rprP9PSqdjOqZjOt4v\/gObXMYv0lCVQgAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lotsa_lox-1334191128.swf",
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

log.info("lotsa_lox.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
