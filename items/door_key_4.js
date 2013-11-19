//#include include/takeable.js

var label = "Teal-Red Hexagon Key";
var version = "1337965213";
var name_single = "Teal-Red Hexagon Key";
var name_plural = "Teal-Red Hexagon Key";
var article = "a";
var description = "Hexagonally shaped keys have more fun. Especially the teal and red ones, which seem to glide into keyholes with more eagerness than one would expect from an average key.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_4", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "4"	// defined by door_key_base (overridden by door_key_4)
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
		'position': {"x":-18,"y":-17,"w":36,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEJElEQVR42u2W60\/TZxzF+QOWNFm2\nd4skTpcJurEnURezrcYpKF5QZ5aYsBG3uAzUdWRLmDjXZI6NZYxaNNOqtEDNGFik5U7a+uuNWtvS\nC9ACpe0POqBCkerMdO\/Ofk9LJ8S9kstY8jvJefFN2uaTc57v0yctjRcvXrx48Vo21WpMeWWXf2OK\nv\/9FuKrA\/NHHQp0zyEiV7fi4VIJPSitRflXFXG\/vSf9PwfSucLo9cFfR459EWV0b3rigwNHSUki2\n5eCLM5W4fEOHjjvDktAsBCsKJmvUCpq0DrHOEYi3mPtxtL4VL7R14FWDAW\/pdAhu3gxbxiZcLTiJ\narURveHZ+ND0X6IVgZPKVQV1aiZu9IRRYXFhXVsn1nJgxGYDsdtBnE4Y8\/MxtmMHgllZsLz5NtRX\n6mEPTMEVjLHWPnZ5z2fNTR1MkXt495YJL2m1IFYriMMB4naD9PWB9Peju7AQE7t24fedOzEqFCKQ\nkQHbsU\/h8YZh8YSZZQX8tdWIYrcP6+fDeb0gfj\/I8DBIIIBKqRRTOTmIZmdjnAOlaQY2bID3RvsK\nAjJMslKPJwk3MgIyOgoSiaD+3DnM5OZievfuBCRNciQzc4UBjcbEeaOV0tTI2BhINAoyPQ1XURHu\n79uXgKRJ0rpDHGAfB6h3BuPKbg+z1K5udTS\/d+yzbU8ATSYQlwvE5wMJhUDGx0FiMbwzOYlHeXl4\nuH8\/ZudSnORSDG\/ciD5VO2y+CHyR2QUORh+AnfpjUaa\/IVOq2KcBab3zAEVc9Y8PHsTDAwcQ5wBj\nczWnALt6+nFR2bIs\/uhUiX0hYG8vyMBA8vxxZ49WrKiqSsA94Cq+N5fgBAeYqrjb6mO\/lijEz+Jv\nzteC+uz5WvaspEaRmqlP\/3SNOfTBceHTS0I3eHAwmSIHyRQXI753b6Le2J49\/yxJcAmW5MSZCsyZ\nKTxdKZw3o6j0Z\/GTJfEO4sWuLrxGrxmaIr3\/KCSXJHv4cAKMJneXg6MLMrZ9O4bWrFk0YFWdBtTS\nWjVTVdciTM3UF5SaJOCl6y2sxcviS2c\/nu\/qRrrZnISkSXJ108SoJ+fuwMTZy9wEi7wB7tAMzB5W\n8ayA8iYdqKtVOkZ+85YwNVMrmvRJQJmsUaBo0orVjAtq+xCOdBrwnF6P9bdvJ0BpnYl\/kK1bMbD2\nZTSc\/AptVj\/80Udxd3CmYDFXXKfBBuoOg43pMNmFqTlh4x3xgg836V3pOsdwM+Nm8aPGgKwGNQTc\nQyG0ZQs8617BtexDKKtQQMW44Rm9vyQvGrnGUqDQ9Ijlmp685GwW0Zm6utX8+r9+yT4SE\/om\/mTl\nahOOSGtRnvs+PswvRgkHV6MxuTvsI6vj8arvDYnlzYa46LtL+Pzbi\/HyKypR2mpTo9Yp+EHWIC4p\nlwnSePHixYsXr\/+l\/gaeWFJRpqu0CgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_4-1334257898.swf",
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

log.info("door_key_4.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
