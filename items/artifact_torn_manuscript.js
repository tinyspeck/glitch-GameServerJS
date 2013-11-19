//#include include/takeable.js

var label = "Torn Manuscript";
var version = "1348259961";
var name_single = "Torn Manuscript";
var name_plural = "Torn Manuscripts";
var article = "a";
var description = "This small fragment, dusted with shiny elements is all that remains of a VERY long very bad novel. But since, once upon a time, a tired finger took the pains to carefully hammer it out  on a rudimentary typewriter, it should be kept. However, since the fragment of complex story that can be seen seems to focus on hot, passionate clinches between the giants - it’s probably best we can’t read it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_torn_manuscript", "takeable"];
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
		'position': {"x":-43,"y":-29,"w":86,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGcklEQVR42u2XaVNTVxzG\/QZ+BMeK\nuy2dsVj2nSyQBG4WshMgIRAWQcIqhLCEJSaAUGQrEBF3BKQiqEgp6kjVWlxa7XQ65VVf5yM8Pedo\nooBLqWj7gjNzJsPMuff87vN\/\/s85bNmyOTbH5tgcbxzTp7io6ZOyiavDXPL\/Cmy8Xxw10i6cb7NF\nI9cQhA57DM59k2j\/z8EudUsMw63C5ZbyCOQbw6HW8aBOE0HGBcNWEAyPiz8\/e1Gx9ZODne1IMgw4\n+cuOkghkGcKh1fNRXqaDuzEbOQUq5BRqYDDwUWwKwon6OO9Yryjwk4ANtwkMPQ1xy7VHwhiYUsOH\nhQC1O3NxZ8yO6yMV0CuiYTQlI69Yj3SjGCbNQbiPRmGkQ1j4UaBoibob4gydtTEMzKgPh0ongNGi\ngM1uQl+rBU9uNOPhVAOeXG\/GDxerkSoJhUEvZJAmixwaeRBqDodgwMmb6GuJ37phYB4Xz368Jtpb\nfTgMGbowKLUCZBKwPFLCb48XYPFyLZ7OOvFophG3LlRh7nQFpk6WQpkcyiC1ylhYyNqsfBV0mkhU\n5X2Nbkf8Um99TOAHg7VWRXlLc4KhU0cgVSuEKS8V5lwFqss0mDt3FAsXbZgatGJppglzI+VYmnbg\n9mg1VC\/hfFMtj0Y2edZSpIU+jYeq\/BCQinhpVdYFRqXvaYy31xWFeotMh16AaYSslFk5MuSaRJgk\nQI+uNfnneFceFifs+GW2BfNnK1FsFEDDhcNqTkKGMtoPqUwJh8ksZSU3miWwZofQ5gHxs+e9YKe7\nErcNHuN5bAUhXpP6S6hTwxhYZo4cpmwZ8s1idDUaMTFQTECcL0tZzgAp2MSJfPbrtmlhVMdgkqy7\n\/109Zs9UoCJXgiKTkGQjD1eHy\/Bg1g1rRQbM+akozApFR00MK3mXI3bbG8HIV3jKcoIgE30OsTiU\ngaWbZUjPFLPSVBdyuOIpwZ93O3F\/sg6\/3nTi2dwxXCc+o43x27wLvy+0EjXS4ChR4OfpRsyeKsXM\nkBW3L9UQG1RjjKh8jwDTdWc686HX8pkvacmzjbFwVUaitzHeO+Tivzp9NNy+ZBdp\/cq8YAYmVwtg\nyOKQaeag4iJYWdpr05hKPxKwm2cqsUhiZKq\/iG30gGw4M1SMu2M1TL3HZN29y3X462Evm4vjtcyb\nT260+O0w6DZDL4\/0+5LmJetyIx\/1R0IpJEZPiF6cPor4z7bqUvYuUXpbcTxRTUo6Tfkiu9KT2EvS\nFFGYIuo9\/95FlHLjGfm9N1HLVKSlpp4bchjw4Eo9U\/MpgVk4X0U6ugnLi524df4o+5in5AP6W4xQ\npYStaB5fDNGpTRPCrD+E\/uYECjr\/CpLbu0SPKadNgLwitf8BGrT0JaUWCSlvB9uITgpHN358rRnP\nCfSdURs8jnTWvVSl2VNlmOw57F9P5zzxrE852iy0xD716Cws0aHVIWMKWrO+QgovAP5SU0i1ZDeD\nbKsVoMCq9T+YRQJWIQkjDZK5YkM6F8ft+GnKgT9ut7Ny07+pkr5yUtXourtEcQtpEApGK0O99zqY\nuzEVg65ElOccgly4CykJAfNcQkDUimbxQTaVhq+BpPklTQrGDDnCVkNW5UnQ3ZSJyyR6KGR7jY5s\nZsYoUXDkuAU1RVLo5FFrwOhsblBjuF1ETpdgpEn3QZ64a5nj7Xh7Lr5LSVoOrSKGvNDCFKFwNEYW\nLlRDLgpmpTNp4lb4SyWNRAZJgtVg9bUUTAJnRQRytIFQind7SUntdP\/35uFqyKKSV56kGylSIsCP\nDkRHnYHFyS0SI1aScavBfBeF16fNpkGfKwWd5J5o0QVCLdkDRdIujzR2+7Z1nSY+yOaycHTVJ8Ba\nqlqxETU4BaknmVeclfhesJJyLQbbpaw7jxgPMjClaPdan60XknT3ckNx6BshaTxQKJ0skl0GfEfY\narAupwwDLTyUkM7UE58RuGVOsMOwITcZjrc90CDb730bJIWiXb4azNeZJ90CVOcHg7wD2uS9XtIE\n\/8xnGwm5erY1K1lkUHtkyPdDQ8qpEu9Zv8\/WC6khCvggqypka8BoZHjaxCD3RpjVX\/jAPsxn\/1bJ\nHke8H5J25qBbxP6DYz7j9kEl2kCffQhkd7MIfU0J7IacoTiwvjz7mJAk9b115OZBbx+ZqQdYbEgF\nOz+uz9YLKU\/c6eX4AeAEAZ\/OZ+uFfOe5uTk2x+bYHFv+BvOraE6UdekAAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_torn_manuscript-1348197620.swf",
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

log.info("artifact_torn_manuscript.js LOADED");

// generated ok 2012-09-21 13:39:21 by martlume
