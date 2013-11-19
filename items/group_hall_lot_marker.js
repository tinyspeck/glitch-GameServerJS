//#include include/jobs.js

var label = "Group Location Marker";
var version = "1349220032";
var name_single = "Group Location Marker";
var name_plural = "Group Location Markers";
var article = "a";
var description = "If you're up for it, you can build a Group Location here!";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["group_hall_lot_marker"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.job_id = "";	// defined by group_hall_lot_marker
}

var instancePropsDef = {
	job_id : ["Which job to offer?"],
};

var instancePropsChoices = {
	job_id : [""],
};

var verbs = {};

verbs.talk_to = { // defined by group_hall_lot_marker
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Build a new Group Hall",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function onPlayerEnter(pc){ // defined by group_hall_lot_marker
	var jobs = this.getAvailableJobs(pc);
		
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-311,"y":-115,"w":621,"h":115},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAABoUlEQVR42mNgGAWjYBSMglEwCkbB\nKBgFowALmNEauz8\/wW7+QNi9ZE6x\/MrpmfsX9aXaY1UwvS7wf3+5z\/+pNf7\/J1T4\/a9Mtv8f66tr\nTy8Hbl7bpD+5Nmh+ebqbPorEqpnl\/BsXFsdXpTr8L4ix\/N9d4vW\/Itnuf22a4\/8ABy0DoBJGIGZC\nwswkYGR9jFCMAUBuQBFY0RujP68t0h4UrCCXz6gN1G\/Kcfk\/pdrvf3ex1\/\/WPPf\/HYUe\/0NctJyB\nylmBmA2K2ZEwBx6MrA6mlxWKWaZUBRl1F\/snTmvPFDy\/v18Aw8WTGyLq2ytC4Wlt4Yw8\/4lN0QXV\nqfaNKUHG9xuzXJtK4mybnM2U1KAWcgIxFxRzAzEPPtzWlGTZ15XuAcJpMe6SUP0wx7NNa4sr6s91\nO7AlSlcJa6hOrPSLb8lz98cW3P6O6vuRopIFGgqcSA7jBWJQlAhAsSAaFoDK80HVckP1w0KRGZiE\nDKckWPYfTDIJJjmxetkqrydBOSMWTBQ4mmwoT1ZucjRV0R4tcEfBKBgFo2AUjIJRMApGwUACAOoq\nc7awXicRAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/group_hall_lot_marker-1310752825.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("group_hall_lot_marker.js LOADED");

// generated ok 2012-10-02 16:20:32 by jupro
