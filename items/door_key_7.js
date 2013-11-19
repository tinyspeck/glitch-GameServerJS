//#include include/takeable.js

var label = "Yellow-Teal Square Key";
var version = "1337965213";
var name_single = "Yellow-Teal Square Key";
var name_plural = "Yellow-Teal Square Key";
var article = "a";
var description = "Yellow, teal and square are good qualities in a key with door-opening aspirations.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 50;
var input_for = [];
var parent_classes = ["door_key_7", "door_key_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"key_id"	: "7"	// defined by door_key_base (overridden by door_key_7)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADZUlEQVR42u2WyWsTcRTH+x949tRT\nBE\/ioAhSHPXibrV6EBfUKHhww4MoLrSiaFHrWrfaNJKgFZvRptLa4Jhplol1kk4mSRvTpOkEt2qj\nVhsX0MPX+WWSNLGCaIyCzBe+DG9OH75v3ptXVqZJkyZNmjT936pvZMqNzP3TDOsdYb1RCNFXCL\/4\nBNYXh+muC7VXbmHX4XrUNrTA2OpAx8MIRPkdosNfRsT4a84VejalpIBnjMyI2doFpzQIXuTB2q+B\nsdbDYD6Guvp92HCkBjP2HseC2itYfakZW5vbce6eB+7eJ\/APvgEfSPhLCnjWyMAbeYbnwZ14J07D\ne4kusNCzCjqHo8AT7XZMZjkEZAUwmEDJAYeGQ2m40dDCjBdhtG8xUuElac\/q7gLV3Q3K4wHF82kT\nyJbI078D+HKIT6eVhutdlAFbilREcf9S6P0WUF4vKEHIgZIkDX2Jvw2YgXtMwCqRii7Dh9hyLJQ4\nUKIIqqcnB\/lPAFPptqpwBOxDvAoDA3pQwaBqvz8HqXM6\/wEgSY+0lSSnwH2UV8AYOwkqHAbV26tC\nkiSVduvc7hyg2SZx+bYJA5xDShTlDk\/4zoqNO2bmAc5WAZVvjqT3cbAKnxIrsX+gGVR\/vwqZTdHn\ng04ZlCygFH9VEl+4dlP+AWBlAeCmWOcYYCj0Q8BzJmtJvHHrHuGnLd4UaR\/fYgKY1+Ka89erf8tn\nTchY\/q7GgToDN79qzfTxQ0ImODo2JPq+NjU5AidJY0PichU9JNsPngLxtgN1XH6tvjtdPX7NZHdg\nJAOpJKkPtqpgpLUkveya+QNTfN7cBtVWrrAmvvsdoL+icFE\/Vhe1XmLU1JS25i\/qco4rGrCJYUFs\nsLBcfk1sZB6MAT5JJvHGN0353c1Q\/8GB2RgNzlGA5+KE70h6IMg3R9pKkiNwk1g7+PhwUYA2hwDi\nzq5HXH6t2ludu2Ystm4EBpMI+C6gx7kbLtt2dLZuxu0ba3H06hbo6how9bIZFSYL5lk6sO6eA04F\njFwz7kBC\/l3ARqt7vcHKVze1eej8mrixnS9XE2y6XWlk2BHlHsQv3oNQ7kG55PdgVoxdnGIXYrQQ\nS9Lhoc+0XZRpU5uTPt5wi9516GL62aTUHZ4YLcopOpb8SvvibydoJ78mTZo0adJUlL4BqCn4Kjo5\nhvAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/door_key_7-1334258001.swf",
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

log.info("door_key_7.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
