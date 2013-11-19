//#include include/jobs.js

var label = "Proto Rock";
var version = "1320424351";
var name_single = "Proto Rock";
var name_plural = "Proto Rocks";
var article = "a";
var description = "Build a Rock here.";
var is_hidden = false;
var has_info = true;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["proto_rock", "proto"];
var has_instance_props = true;

var classProps = {
	"job_class_id"	: "job_proto_rock",	// defined by proto (overridden by proto_rock)
	"width"	: "100"	// defined by proto (overridden by proto_rock)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.item_class = "rock_beryl_1,rock_beryl_2,rock_beryl_3";	// defined by proto (overridden by proto_rock)
}

var instancePropsDef = {
	item_class : ["class_id of what this turns into, multiples separated by commas"],
};

var verbs = {};

verbs.create = { // defined by proto
	"name"				: "create",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"tooltip"			: "",
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

function afterCreationAnimation(){ // defined by proto
	// make it selectable now! (it is made not selectable in onCreate)
	this.not_selectable = false;
	this.setAndBroadcastState('state_1');
	this.setJobData();
}

function onCreate(){ // defined by proto
	this.initInstanceProps();
	// make it not selectable while we play the animation
	this.not_selectable = true;

	this.setAndBroadcastState('state_0');
	this.apiSetTimer('afterCreationAnimation', 3 * 1000);
}

function onPlayerEnter(pc){ // defined by proto
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

function setJobData(){ // defined by proto
	if (!this.container) return this.apiSetTimer('setJobData', 500);

	log.info(this+' running setJobData');
	if (this.getClassProp('job_class_id') != '' && this.getClassProp('job_class_id') != undefined){
		var id = 'proto-'+this.tsid;

		log.info(this+' setting street data');
		this.container.jobs_set_street_info({id: id, type: 1});

		log.info(this+' setting class ids');
		var job_class_ids = {};

		var class_ids = this.getClassProp('job_class_id').split(',');
		var phase = 1;
		for (var i in class_ids){
			var class_id = class_ids[i];
			job_class_ids[class_id] = {in_order : phase, class_id: class_id, delay_seconds: 60};
			phase++;
		}
		this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});

		if (class_ids[0]) this.updatePlayers(id, class_ids[0]);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"proto"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	asset_swf	: "http:\/\/c2.glitch.bz\/items\/2011-10\/proto_rock-1319818709.swf",
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/proto_rock-1319818709.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_rube",
	"proto"
];
itemDef.keys_in_location = {
	"c"	: "create"
};
itemDef.keys_in_pack = {};

log.info("proto_rock.js LOADED");

// generated ok 2011-11-04 09:32:31 by eric
