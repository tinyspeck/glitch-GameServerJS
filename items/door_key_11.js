//#include include/takeable.js

var label = "Purple-Red Square Key";
var version = "1337965213";
var name_single = "Purple-Red Square Key";
var name_plural = "Purple-Red Square Key";
var article = "a";
var description = "Purple, red and square, this key is a door's best friend. A friend with benefits. Door-opening benefits.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_11", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "11"	// defined by door_key_base (overridden by door_key_11)
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
		'position': {"x":-18,"y":-15,"w":36,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADPklEQVR42u2W30tTYRjH+w+CrroI\no1tvgsBlWZ42p4yQ7AeU4IUu7YeaNg0JwpwhgUS27BcVusWkiPKkU9JGa0udK7c15xYim9uZupQ5\nc1ZQVBff3nfOPGolZTOI84UPh+dcfXhe3ud91qwRIkSIECFC\/u9ca2A3atinKtZgixhsHlg9IQyO\nf4TB7oO2vQe1tx6grOYaam8\/hKa1Cx0vhuDgZuCZ\/BJx+KZMPe7g5rgKXtawkSbdc3Q7\/Wh57Ieq\nzo3qagsU5Xrk5TfjyKHzKMmSQ5mrgKq0CneqLqK5qQ3m16Po979F70CgP66C9RoWtqEgKrInkb4u\nhKyEyQWc2tQJb2IiPDyGEhIwkJyCAY4IugKIu6Cl9zN2rw\/hsGjqOwWitzhCOCqaxpA4EwGJBBxF\nLIafQEXdevPqCD7t\/ITsxHBULD8mdoyIHd8aQSGhZ1cpRtPSMEIEAzHJ4aQkuJs7V19wTq6IiBUT\nThBeiQswJpVijCfp+xeCBTw5KnZy6wyqtnkwnpGBN+npCPIkfSLR6gvS7hXGOkflypPf4W7qPUwQ\nwYmYJO0kPW4\/T7BJ7zTx0VuHTV3OwIrosAy2HJCXbl8gSC9EYax7CiJ3Kvk9jJJahGSyqCDtZPAH\ngk5fKC5cv3OfWyJYtEjQLi1fVvCKVhcX5MWnrcsesVVStuwRV1+9q\/wj6rWIwS2qUVnXaJLtz0n6\n6SUpiUm+lCjidklKzl4C5URlnYlfz\/5TKZdckvzomKHzb37MWMQnEYx1LipH+Ftj5ip5MmfRmRbW\nlHblLwb1dLST9LjNZEhTscWD2rtly4oF1awBlMZmg4lfUzTss3nBPlcYmRtCPMm5p24aTTtuRqX4\nT50vJQWuVDFc7sCKBPVdVlCePO8z8etZbMrv20yr0Y7+4RBUNSOoyPOg+JAL8j19OCjtQu5ONepT\nZGjM2If7e3PQnlMAg+IMuokY3WbMAwHuTwUbdObcRl2vUt1mYfg1peFx78bZDqofZWlYQ4Tsg\/jN\nfRBkH+Tivg\/OhTU6NhutXsbqDTODE58Yo4NjtG3dzIXbD5iyczeiXzWpOyxexsF9YLzhr4zdN71W\nWPmFCBEiRIiQFeUbJbKg2Kgf7XMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_11-1334258171.swf",
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

log.info("door_key_11.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
