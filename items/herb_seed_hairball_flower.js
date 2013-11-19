//#include include/takeable.js

var label = "Hairball Flower Seed";
var version = "1352410014";
var name_single = "Hairball Flower Seed";
var name_plural = "Hairball Flower Seeds";
var article = "a";
var description = "A Hairball Flower Seed, for growing a pretty bunch of <a href=\"\/items\/769\/\" glitch=\"item|hairball_flower\">Hairball Flowers<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 22;
var input_for = [];
var parent_classes = ["herb_seed_hairball_flower", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "hairball_flower",	// defined by seed_base (overridden by herb_seed_hairball_flower)
	"produces_count"	: "1",	// defined by seed_base
	"time_grow1"	: "2.25",	// defined by seed_base (overridden by herb_seed_hairball_flower)
	"time_grow2"	: "2.25"	// defined by seed_base (overridden by herb_seed_hairball_flower)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/769\/\" glitch=\"item|hairball_flower\">Hairball Flowers<\/a>."]);
	return out;
}

var tags = [
	"herb_seed",
	"herbalism_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-9,"w":18,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFBklEQVR42u2XW1NaVxTH8w187lM+\nQl770uGxL53JU2tsMmMVxarEE9PExFs19YZ3BUWuHi6CeJCLiKAIHCKCxBCvqaYXSzqd6WP5CKt7\nbXLwIImh1vaJNbPmyDl7n\/3b\/\/VfG7xxoxzlKEc5ylGO\/yyM465bFqVbYlWtMDaVz7M46+cdmjV+\nSRPgl\/UbvMsQ5r3GMB9xv+BTG0f8buSET0dP+ETwiA0uJnpWzDzjm49KOO1mxbVBnaX\/qtiPv2EM\nY0sZdnIZzNNusKq8YJvxwaLaDwQOXMYQhF0p2I38CK9f\/Aan6d\/JNQPJ9SPYXEpBYGEb\/Jbn4DPF\nwMtGwW0Mw7I+lOU06+ySNtjj0KzeuhLcyd4fkqPkrxm7xgfGcQ4uAroMG5BYP4DXqRwUJhkP24ED\nAhWHNWucwuE1B8gTwIgACJw2CA7cIHmPzxrN7GwcVpes2unLt+zxzhkYJpZAP+YoALTP+mAndJSH\nEnLLvwcrBAJz1RwjUFvgt25ROPyM9z3zEVi18BD17kIqfFywuYPtnyHiTWU5\/Ro7P8FJ3gvntK3d\nPkm\/zeIEpzEA2hEb6EcXCeASAXRS9fBFYrC9rZ9g1RojSoSoOlhGhPERKCHxc9SzC+nYacHcw8Qv\nFJbTB8Gi9IBpykXXwfXIurxuxF4IOqWYy2qmzeC1hWBOYQXtcA7QQCY4tGtFcIngATj166Rc66Rs\nGwRyEzwISZSioCQ3uCQtvXhecv0Q\/LYY9bGNVAQ3LgDOTzjpejqyLq6vHrJMigA1malhDfR3jwNT\n1w4j3Wo6kDME4Dh1VrDIq+dvwK5eBcfcGhCzg1N3DolK+i0xeHVBsTR\/Cl5ThDYXzsP5CzMrYFV6\nqX3QRqS8YCC2IuqBZngBlP3z0PvdKE8BpxUaRgCUVslpdjB9kNjcK\/Kc1xyhu0cVcDFOBImqCR1N\nu5p4DTsdn+NmcLyg3oJIvfPyOoi9CKBiAdqaenMcLUM9ORWH5\/ZH+pR5wJb6J4DQZi0HYV8ipwRR\nxkpeiru3z67mIVGZ0HKyyKOoGm5AUA7H47yceh6qnmlKUO+8vAIcpuwuk6GAWoW2AiGFB\/X3Wiig\nkOhRm85DSmCj3hFDIoi4M\/FvNxvOgYngqHIIp\/K+gxOpR8qrHrTAg\/qOPJyQeS8iZNM3D\/OQqKgY\nsr31B3r\/YUMXjBKf4mIOjR8OSFcW2IAAC1CCamI4Sx5uGYzvvKfonAHZPaYIrvZOc6ago2VfyirI\nTRYf9jwZKgDsetRfMJmpfwouawD24udNgWclAglQBWD5subgSKdCJzOYB+tiGiFgksLuSg3EnTWk\nYZtAWiln3ns24oPWb9sLAMVNJKTYAh57kNpANcDSkmEjIBj6DeHwfB37XgPPHo1Bq6yz4D3qARm4\nVZ\/ByuynEOe+opBPmxszl367SL9uvjnWP8MLEOODs0WAQ72TH93Ex9I6VQ8h9nPQtlcA2\/sJJF13\nYWG6LlNbKS\/t+3r42XQ1NhACoKril2PZ\/w1gW2NjrqREtYj1C3pdVNVl0Wr\/+IeEckQn6X48xIoX\nKMUGlyX6DgEx0X8DjxuyJSt3Wek7HvSxrQ0dRcfRVUqMkJjSO3L+Ssp9+KfZnzfVo6bJiUF1VgAU\nH\/alZm2VPPvBbr2usOg4CTu3OEkyc1\/aViJY837tHXnPtapWqgVqqu5LaiqbbiPAxZRWNVfjmPI\/\nVOUoRznKUY7\/J\/4GNYFpNXhDgtcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_hairball_flower-1308763751.swf",
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
	"herb_seed",
	"herbalism_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("herb_seed_hairball_flower.js LOADED");

// generated ok 2012-11-08 13:26:54 by martlume
