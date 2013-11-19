//#include include/takeable.js

var label = "Groddlene";
var version = "1338860311";
var name_single = "Groddlene";
var name_plural = "Groddlene";
var article = "a";
var description = "A compound made out of red and green.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 2.7;
var input_for = [163,170];
var parent_classes = ["groddlene", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-17,"w":22,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGKElEQVR42u1YWW8TVxTmvaq8jZfY\n44xjIIlje8ZbbI\/jYEqhohQwtIK2VK3Vhz7nF1R+jaqCQUKokEAQa0MBAyqhLO2wiK1QnMRAFkQn\nhFC1ldr5Caf3zPgmE5MglsZUVa50FHt8lfvd72zfmQUL5tf8+p+uQ3xjbnfAm6fWHVgo6axYvX+8\nPZEdTIakQTGYmXNwf0ejhntiDAgQOCo0Ql\/E95SdDDVl6f6JdFwYbxeVB22t0J8UpJowON6e7LnS\nKsC+4CK4FedLeHBZDCmEJQQh6y8znk7KA8koPEonYSApwP2Uj6sJi3jwsVAzMln8LZXiHreLgAAH\nknxu8iJpsUTZHk7F5eFUFPoTfKEmLBJAmdFUHPYSFn9JRuSKC2U9y\/T37oC3A\/ePpRMEoKA8jHoN\ntQGZTubRfdXsPU4nOn5tS0Cv0AQXoi0IXAV\/VwyrbtazPPfxSNyI7N2MBwEzmgI\/Ffapru0lidSr\nS6YrrQG4FPPLNQOI8XcvGcoXQ01FBNTtX5jr8nsL6ueAV8HPxHq0EuRV8Dm9SM3XTq\/XoIFRgRTx\n+3+uiCNTyBAC3RP0ZF47IKxr2CG6WjxZAqqEwHRsluizbl8D91oAjrUlZMxMEoOAYPDZ8XBzpsJi\nJRarjMRpzcoMlpiRVAxuJ3g4Hda6BBZxLDE9lSymLfFsJYsvRv09NcleBCfFeLUOlrHNVboEAqdF\nGksKtsJBMVTCi\/TXqt0RlqTbiYjqsrIYlWXsEuTwctwvTP\/dq+z2NwjYWbRuw889exNtyRx2igP8\nYgQoqb2ZKBat1wqlyX5Nnp2PBoDIsxLtNvQCcysUyMHoWlQzN+IBmaqZsqZmYCDBd9B+jcCwHf4r\ncit63mRYetWZX9nPSuuG3dL6Ube05j5bXHGHzVSLAHQtbV3VdjkWUGiRpomE7L2yYBUv1EnLf2Yh\nO1QPHz\/m4NPfPbBR5mB12Q1vXXNk+r4QM0+WpqEis55ptOTguhkX5GutAWlWVpZdd+ZXDbD51WU2\nv\/yWMzvTPv6kI5\/60QkrbrGwbrgePnnigc\/\/aoCPxjlYcxcBupSVXfVQ2tCudojZDAs2trkKSGx7\nHQh2xrbnPWIypC86lVUDbvjwEQebJjwqO8hG9T7+uB2S5+tg2XWXytgHD+th4xgH60fr4d1+FjJX\nXBA+ZS+9SF+uzCgwa8sLFh097Zec6oGbJjj47A8PrB9BgM5pcsezh8n4eu0QPe0AciFAN6\/qd8N7\ng25YWWJV0Mhu6ITjuYMcSwthTq4wKCOzT23yf6exgm7LDrlh3YjGBoLmuhjJts2cR7Nvs0iL9tkg\neMwOrWfqoO0np8rY0qsuWHLZCeIFJ0S+dwC5xHMB1Nys1T\/8ficeFq62BolmDEyXWYv32yB00qHe\nnsSQygSCi\/XVQfMRZpJ2U6fJ4N7FAO4PHLUTVzrUPQgWWSXMQQth2LuXKTyLMXRlZQxVZX61qH1K\n7ru+YaTGAzbA+IoSBtTDCGDfYZvi3WmaFrTWreaCeydDQFih6ZAN2YKWI3bwfWsH\/B9cNwOGTrPi\n+tIo\/BDxqwIUg786ew+S4n2YX6SbTcQCFnXdWDDFovErY8a5gwHPHiugC5EhBMAS4Esu1XVgZq8d\nYvPv3HblLFssxMyKYzsDLAHKdVkJKCvUk7+uHRbFus2Se7PTmN2UY0t03kAwtBaSMkJnj8mZAwd2\nBNYX8ZOCHoIZWXyj0yiYvjYVrVstEpp5i7kjcMwuryCJsIHUuNyfWuIEj2vxhSBwP7PZIjEFsn+z\nuYAhoGf7QVt8cmI7E\/GVkJXRVIyKAZmKCew4CAyZlaJ8bkYWq1fDfqOA7n77hgvef6AV5LX33ZC5\n7JRfTGqJRWxhU2JAVLSpTTuczsTq2FnRfyggZmRRv9hdTAazVS3KhEW1jBCwibN18OLDu1jCNwzo\nQlk389K4wzA4EWpSqOv1NiuLxu1GDuMQEwezNHFOy1SSEPLLaEJkDsEMiZFJKYVMIWj92ImGqpuO\nn6fDzbOfh7GICYBJ03jQpiYQSYyXGgXx5dBYRQtSIYp1j775mho5p8bO6jI0M5MkGZiCOc+QQm3c\nbHwljTZCAM25zptf82sO1j9SyjeC6HZcDwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/groddlene-1334267235.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("groddlene.js LOADED");

// generated ok 2012-06-04 18:38:31 by kristi
