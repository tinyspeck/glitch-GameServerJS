//#include include/takeable.js

var label = "Teal-White Triangle Key";
var version = "1337965213";
var name_single = "Teal-White Triangle Key";
var name_plural = "Teal-White Triangle Key";
var article = "a";
var description = "Some say teal and white keys are nothing but trouble. They've never tried one of the triangular variety.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_9", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "9"	// defined by door_key_base (overridden by door_key_9)
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

function expire(){ // defined by door_key_base
	if (this.isOnGround()){
		this.apiDelete();
	}
	else{
		delete this.pc_can_pickup;
	}
}

// global block from door_key_base
this.is_key = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"key",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-17,"w":39,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD+ElEQVR42u1WS08bZxTNP2DVBSu6\naVWpUlG\/bRde9Adk1U2lKN20VRdV1UR5N1hqlfKIeJQ2KkYEk9DysHAdbGJjsD3GBoPHr\/GMPfg1\nHr\/AD4wHA0m7O50xAolmU6JEsJgjHc13R3dxdM937\/0uXVKhQoUKFSpUGJaDbQ\/H5qhbPbq2Cylw\n4tkK9fCxETe7dYMXTtzztfhlncGBL396hJs9OtwfGNdcGHFBodG2sBaXrowa8L3Nga\/vDeBev17s\nMSxfDKv9yerg+LwX7U43uuM8xqYXcP1nHfonnp2\/1VzpsNPHb+NTkx0fchz6MgJyYh7dI7PoHTPi\nqdlzvlbHtw4jQ\/YNvBthQNJp9BeKqJSryAg5dP02hYl5j3ie1mqV6n1MrYEIAkihgMFKFbv1Bmq1\nGoJsQrbZgnkvp\/3DHr06aWeo\/9LgilErTO616QgKpjt9o6+65AxnOzYSZenu0jreSyRA8nmQchm\/\nNBrYb+5DkiRUKzXM2TwwOEJSKF3RM0IVb4MzFqf0qsBghjLRSbxPh1rWkmIRRK7a6sEBXrx4ieZe\nE\/WdXYi5AsZNbljXNzE4bnwrvHa\/9\/Q1MntYjTOYxuduPz6SG6MlULaXVCrwNJs4ODjEnrSHnZ06\ntre24aNZLKzxcLMF\/fBTs+as\/HF4Ut81OAGFDx7NfKcdehI5jpXzZ1\/daju1zubdjDi5HkOHzwfC\nsiDJJIgogpRKKMoWK\/bW67uoVmvYKpUhZLIwOWjIHS8JDZx5Nt7u1Wnv9OrQonzfbveMUMexcj6V\nPP18TWvf4PGJww3i94NEIiDxOEgq1RJZq+20qNy\/7a0yinJXi9kcQhEOVCSLZPUf01kF6mbtWt3s\nIhSOGpY0IzOL1HGsnE8Sx4zODoPNJ\/XSHD5wOECUCgYCIAxzJFJuFm+hhC1ZWKm4jUJeFifmkE4J\n4GMJ2D1BcMV9sKJ0+SwCpy0r2imLGy3Kc\/VPs5s6jpXzSeLozKLeGpIr5XCBUBTIysqRSJoGCYdB\nolHo0xnk5cYQ5WGdFcSWuMRmCvEYj3CQwTqXAyM2JGU9\/u9xFolepcMsFPrDXCcdYvUncYg9cmT4\nsbHTuOzHt4Eo3rFa0W6zHdFuR7vLhXZZbPvqKq4Egtjkk+DjCcQ4Hmw0Bka2l4mwiISj2Aiw4PIS\nfLHCm12DQ\/o5ykyF4A6n4Qql4QiksESnYNtIwrAcwu8GJx6MzOFa9yi+uNGHb7p+xQ9Dk+h\/YoHe\n7IXZG4M3VkI4Wwebb2A9XoSLTr+5NTg8\/pdGuaBTVp9GGTOusKih0zsavvx362v18Rpl7\/bJeTfk\nTlOeWwPyiFD+KflertSpPulVqFChQoWK18a\/lnIdWhfOk1wAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_9-1334258114.swf",
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
	"key",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("door_key_9.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
