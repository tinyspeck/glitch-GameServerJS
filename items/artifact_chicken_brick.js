//#include include/takeable.js

var label = "Chicken-Shaped Brick";
var version = "1348259939";
var name_single = "Chicken-Shaped Brick";
var name_plural = "Chicken-Shaped Bricks";
var article = "a";
var description = "Children of the houses of Friendly got used at a young age to their special skill of squeezing chickens. Partly because they were taught at night, when chickens are notoriously easier to sneak up on, and partly because, once they went to bed, they were put down with a heated brick in the shape of poultry. This is one of those.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_chicken_brick", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-73,"w":57,"h":74},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGvklEQVR42s1Y61aSaRj1DlrzuxoJ\nUTRBzignwfIYKiqhggriqTInshztTEczrShTq8kZ5tf89RK4BC6BS+ASntn7Bf61Vs5U4LfWuz5A\n\/L797efZez8vdXXfOPZnXanPc578vRFz+uOcJ3Olt9VUdxKOP5c6058XvLmtSYcAnCz3tsr6sElW\ng8bciQC4P+vOH8x65G7IJI8vW9W61nNefh9qKz4as2ZqDzDuTr+b7lCg7gDkzUtGWelrlVWc1wZP\nAIuvY+76F+N2ifn0WE0y3amXSW+TjLQ3SLKrpVhTcIfz7vrDRV+OgFIDRtmd98sbsPn4sk0xGHE3\nStSl89euvElP7tO8V15PtcsO1qelgPx1tUt2E255FXWqst8YMBQvWc7V1wTgVtQhXLsJF0RhksWL\n59X5VcwpmxN2WRtqk1vBNon79fmaAHwUtsgfC155MeGQDVjLb\/0GibgaJR22KgafRmzyYNQi12A9\nfWZNqOoAdwDiA9h7ErEClAV9aJCxDp3chx+y5GT3ak+rXIeqB6za6lrO54jtVAaCIEsERHuZ8DRK\nGAAJiEJ5F3fJAsp+GayOtOuqW+a7Qxb\/9d7WIssa9zfLuKdJRtt1MgOboYKfwXrYmwR\/K1hSdLdN\ne6qqIJEamQejZmXQD8csKuLuAtDzcZvqy51YOxLGDCUbFcMDFk11LYc5zDIy3ranXZKZ6VDqfTPd\nLhsARtAE+Ajn+QstNO\/CoEObqprtEODerBuCcEIQTvmy6JMPyOUP+IwMklnaDsGtoBViMPRkV7Mk\n\/PrisLMh8c3rX\/GaNiMO\/xb6\/X8B3I13ZAFS3kIsTJD36Ln9+U55OemU5T6DAsgVhkhYfvYhjBvK\npnB0ErR\/XdmHi50p9G9hW\/mpQ97HXQV+xuT6TwD3Zj1FimEdhkzve47XtBYqmKCGHQ1qpdB\/FAoF\nxV4kSL6mJQ1Yz+VxTt8Zbks\/jliPUI08k2g\/6RZW5y3a5gmux2tuDJuzxwb3acEdInO8SPZ6tzDy\nDpIeFXvpsA2MmRXoqzBp9ibGLwWOolpH2WlFfM\/yT8AB2KfP0b875dh8VWaP1+JaGzSpa64OtKWO\ny17macSuvI5lPpjzqNdfFnzqqckkWSI4TNiqxC8x1DJ9eF4bbFMgWe459CVfM434Paqef+cAfB9J\nBObQKmY1kPCaxwK4HWsv8Al3IYrDJb+6KVnaA4sExfcsC8GjhxSbz2A\/zGeeyRj9cqxs7FC3aocB\nm1bmwCqBEDAXwZL58sR+vBFuEwAwzWB6CajphWXhjQ9Qagpme6pUfip7c9Iut3AT2hF98k55+uYg\nQeGQRdWPAMdFwLfx\/aVuxW5hxq\/PIeNzcIDcTGdT9rgmrfptT1mKHYxYZXPKI\/\/c7EcZreozWo\/y\nRjwMS8X\/YWZjkFUszSCBMOmUy9wil8oAh8Ak0qmw8j0brxIDRpQJ9I9ZlL+9jXsUY\/dGLADlVIAO\n5n2K5b1kiWWWlot\/I0AaOcu4AMCVEnN9t5lvhExFssHe4M2uoBwcHNhrVOdHAGNPslzswb+XLyi2\nOYYR0MMySC5+j4MG+5Dg+m2axHenCKzi6Ha5eXkTNjXfEyQV\/AznZKBZfbZ4sUVtRzlUsOHJIAeL\nBXzOh2GvhSs9+KPGstX+1kTFy1hqzoIsE0VAwARBYCtB2MqUS1lJFH4XRdxREFO+UuzN4iGQKCXm\nrNrsD81igMtyi0n2Krs5skHATBf+jSZM8By7yCaNmWyx3zh9h5wNTJNin02T+ikDw4xP55\/26XNk\nhwwyxioGTNBkiYzxPewCgwJmR1gLGSPIsnKPfvpkE\/fpQ6MYpyr5yx7j3pgAouUpZhJCiJQzmg\/E\n4ZZs\/hBRHPfgUNpr1iS6DL8WugxnpdtUr9bFtnrptWhUSck0xcLNVNilq83m3qb95RQYylAMQbAY\naD2LdSYP3yuWNlROuYHeHXJoa\/f7DbIzRaGw3J3nz4i36bRpa8IeWi9vUcPuxmyv5VztfqaDcnME\nGPU2AuDpfGkvbU4wi2O+puqW9kafIbUWNGZuB405LpSywMRYRL9No8wocZajOwbSIlMEeVudX76Y\nmVBmKuLSZbjXYGzR82g1yYBehmHCPWaNXDCe5fhVZMpQHFVVLg8YdJoDJX+fiaGkPab6oq\/ldGa8\noyGB2EthQi68BDhOOfRKWM9RVQGOOLVproDhTHq5x5BCmmQgkiKHTJa6Mhgwu7nI9FxAf1R3Eo7X\nMUt9aTNlVfEX8TTmkCzZxZ5mf9V\/bfgaOG4P1P4Y5UeCJOpOyhEBO1BzHmZdxKSS\/pls\/QsvxHan\nGBeq0AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick-1348197632.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_chicken_brick.js LOADED");

// generated ok 2012-09-21 13:38:59 by martlume
