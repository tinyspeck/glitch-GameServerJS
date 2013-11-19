//#include include/food.js, include/takeable.js

var label = "Fried Rice";
var version = "1354586336";
var name_single = "Fried Rice";
var name_plural = "Fried Rice";
var article = "a";
var description = "A bowl of fried rice with lots of nummy bits.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 114;
var input_for = [];
var parent_classes = ["fried_rice", "food", "takeable"];
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
	if (pc && pc.skills_has("cheffery_1") && !pc.making_recipe_is_known("3")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> a bit more."]);
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
		'position': {"x":-20,"y":-19,"w":40,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIYUlEQVR42u2X+VeTVxrH\/Q888+Oc\nDiAoa0R0xM5oaa2eusxYi63a2rpQLLsICopWp1AVtA7KKsimEUQFBAMBEdkiAhlZA6gYloCRPUKC\nCTvod97nchKaQWfqTDunM4fnnOfkfd\/k3vu532e5b+bNm7M5m7M5+9+0hH2\/Nbrk+o7NrwLmsvvv\nVl\/yMAwgj3X5zXx6Jgp+j9+SvA23fZfws72sAph78mz+a+qQ03XRuVVGLQJ71cADV5RG2kL7XeJR\nW1HdpU9x5ItFuLXfCtnePOZCb6v2Xww0x4vnIPTmqbSLFZ3eIuiv\/FQy2bUVkx2fYFS2AdmBi9vT\nji\/DkV2muOhphujdJkhzt9ABTruV4GcFq80NWS2OPyCihchT3CwQu2cR0o9ZQC1dg0n5Rkz07kFz\nAQ9R7gZI9rWE0H8ZRMF2SD20BNF7TBH+pYnO00\/tEKnUaof\/CAqAEed8fsRhuHy2EOVJXohw4OkW\niXNahHbhn9BUyNN5epAJIpwMUMyB1SdsQsGZP+JB5EcoPGuHcEfDGd9rgNqiJAwoVRCc+TM\/3sPA\n\/m3hvMfGx9tLqupw4eh6FEdtg0L0HQrPrUWqn6XOS0M\/RGX0BqQfXwq+tynyf7BD0kFTJHgY6jzj\nmDX7jHEzQKKPBfMLzgaI3GeF2LPu3JzrkO5pruJyk\/9TwFZzLqmTtiL1TjHyboagNGY7C1fuKVvd\nYo1Xt6Hnjhf7pHt5prMupPQp+H4FTuxZgKt+S9CRsZNthH5XHbMB6trPMNz6MeqEdrgRtBI5368C\nf6\/pdE4HbZIQw5vgHMYnJiAsLkeS8C4yw\/dAVRGG1tTdKLm4Hf0PwhlIso8prngZM1hSMW6\/GdoK\nAtk9ASr\/Foy67JMsLcJczNAQuwmPr9jrFJXmr8eUwoEVFRVXdtBCROw01hXSswoBiGUW3Nj4BLKK\ny5CYmYfE1GtMMdpxSdh6qOv5aMlwZUCkEKknEx5EkNsyBnLjzGYG2HnbmwE28rfqVe1dv2UQh61h\nKdB8m1O13BoPhVaouGEOCX8tEg9YInKnCTK5dpTnvxa90nszkNyFDd3lFouQeYQL0eGluBXwLtvt\nFY8FKPJ\/FyL\/PyDrIA\/5x5bjhq85U6ot5QtUxW\/hNvARKwhSlZ5TYaRxquq3FR5u+liy\/Ix2NWA5\neM1vMRtHY+hZuCPnnJKJTqYQntuKqakpwrIhQEG3oh+pf3VlE11yNGWD3Lea4OSu2QtlHLJmOea7\nwxjBe430CiLlLzy0lW5Geej7emNueVqi8IeNqIjeiDOORrPGUWSSuOKJ8TBGrIshCq5+B6VSSYAC\nAkRtQz2yfJazieK\/sWStIcKNy7F9VnoLUQjEMY5ourUfGSdWMrXIe\/N90XfPk+XURPta9JWt0Rt3\ncfdC1Cc7o\/aqA2vg513NkXbAXC8F7gW\/j1PfcBXuYY4sbm7Zk1pCAwN8dP8W+2GSkxmueS1l+Zfr\nZzNLhXiHRcgJWMHykCqTlKY8pUrtFOzAaMt2lvya5vXI9Ddj89GYqK8X6AqLFCMBKG30onPIEpmx\nK1CV\/Htkn1iCmpzzM4Dy6jx2OkR+ZYLcgFVskqKg99gC5NQG6LvI3ca6sBAkgVFVk4oEKzhhgaqb\nFqjLsuTCZYgLXKtJ91vONkFjqJppHIU0w9tqVvpQdZO35vJQcyd6GvDVq1ciquAr0SdReWEjW6jh\n8hbWYq57L2VQSZ5cjwv7HM1ZPigOXceUoDeV8rMfIOdbG5QGr2FjCDbKxQCCAFvknLRlUDQfNXmC\nknAvD533Q9jzi18b653RlD41KVaQly5GDbdJhbyB+CTzVMOjAXRVU1HMdkqh0OZWddoH6Kr9Cpr6\nDdBIDrMThXKIKvgfQyQ+u5oB0uL3Qj5E\/vl1iHI1ZG1qoOw02xSlDuUrXcdx30XuMtYdnaR2eZIZ\nRPFckSZ+ydQbHp8MmFcgk81\/MTKqogeNhdF4mLgdlbGbcfv0MiY3Jf1LpQcaMiynWw+3gfJzq2eF\nh0FyUAQf4mTE+mO483SFkoo0joBj3GaesZcJv+mi1N4XJ7hhbHgQE1MvVY3KUfZKN0\/c3OGtHhmb\npn4mhrIiHAOV9hiTrcVUvxNGmuxw\/4oZqi5uYDl03XPhawGpkO4GrtQ7h7XHH4Gc97JlJw8p3Zy8\nleUwqUrRou8V1ZcZw+jkFGQDmgC906SsSS5SDU9DTg4p0FkahuoUHrrE1iwvrh1fgO4cd\/QU+bO8\nex0g5VGc80IGpnVShxoyFQgBkZOaP+6DOaGfo7tJzNZWj02gSaEWzTqLKdT3m55J5KohkhdaaxKn\noSDsY65tLOVODu6gf5KKx5c+eS2gtk1pQbQvCVrXqkWKPs1wRH99Kgsn2QR3cnSoNGhUvJgJ7Rsg\nRU8UashVw9CMTepAB2RlqBIEQlESyBbPPGqN6\/sW6VoRnUCU7NGOC5hyBEfKaQuPvCxuJyrTjuGZ\nRKibVzk0gnp5L2rlCoKTvBHuxyZu6Qx93DsIKQfaOThC1YTJlzOqkg32SPGwKAHVwlBIciLRWnIZ\n0qI4rsGGoD4vgqnzojED8soUXfi0NsblWLdSjZq2bhQ\/bkcNwfW9EMmUmP+TX1obulT2Dd3KdlKz\npV+DjsFh9KpHoRwZh4YDHp2YwtTLV\/hXRr+hDQ6OTqBXMwpZvxolUjmKHrWhtKkD9V1KlVTxwvvf\nfvWXdPY70O4ItG1giIX+KeftyiF23zqgYRtofq5hij\/5J17XOcAUu9f4FFVP+9ql\/Wr7n+2P06Me\nlQO3CJ8gCOptAB\/2qFDe3MmUE7d2iWiuX+w\/MeUJ7Vz6XB3a9Fwt4ZyDU1NrmAVGeVzZ3icpeiQL\nrXrWb\/9WOTZnczZn\/yf2d2ztwQ1p8oIwAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fried_rice-1334208619.swf",
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

log.info("fried_rice.js LOADED");

// generated ok 2012-12-03 17:58:56 by martlume
