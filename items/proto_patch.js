//#include include/jobs.js, include/cultivation.js

var label = "Patch";
var version = "1347907556";
var name_single = "Patch";
var name_plural = "Patches";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 400;
var input_for = [];
var parent_classes = ["proto_patch", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "patch,patch_dark",	// defined by proto (overridden by proto_patch)
	"job_class_id"	: "job_cult_patch_2",	// defined by proto (overridden by proto_patch)
	"width"	: "286",	// defined by proto (overridden by proto_patch)
	"placement_set"	: "all"	// defined by proto (overridden by proto_patch)
};

var instancePropsDef = {};

var verbs = {};

verbs.remove = { // defined by proto
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remove from the location",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'wine_of_the_dead' && this.hasInProgressJob(pc);
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.container.pols_is_owner(pc)) return {state: null};

		if ((!drop_stack || drop_stack.class_tsid != 'wine_of_the_dead') && this.hasInProgressJob(pc)) return {state: 'disabled', reason: "Pour some Wine of the Dead to cancel the project first."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.hasInProgressJob(pc)){
			var it = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!it) return false;

			msg.target = this;
			return it.verbs['pour'].handler.call(it, pc, msg);
		}
		else{
			pc.prompts_add({
				title			: 'Please Confirm!',
				txt			: "Are you really sure you want to remove this "+this.name_single+"?",
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_location_callback',
				itemstack_tsid		: this.tsid
			});
		}
	}
};

verbs.build_tower = { // defined by proto
	"name"				: "build tower",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Start a project to build a tower here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.restore.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.restore = { // defined by proto
	"name"				: "restore",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Start a project to restore this item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function getEndItems(){ // defined by proto_patch
	return ['patch'];
}

function onRemoved(pc){ // defined by proto_patch
	if (pc){
		pc.runDropTable('cult_remove_patch', this);
	}
}

function modal_callback(pc, value, details){ // defined by proto
	if (value == 'ok'){
		if (this.hasInProgressJob(pc) && details.target_itemstack_tsid){
			var wine = pc.removeItemStackTsid(details.target_itemstack_tsid, 1);
			if (wine){
				wine.apiConsume(1);
				this.resetJob(pc);
				pc.sendActivity("You poured Wine of the Dead on a "+this.name_single+" and canceled the project.");
			}
			else{
				pc.sendActivity("Where'd your wine go? I can't find it.");
			}
		}
		else{
			this.removeResource(pc);
		}
	}
}

function onCreate(){ // defined by proto
	this.setAndBroadcastState('depleted');
	this.setJobData();
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

function parent_getEndItems(){ // defined by proto
	//this.container.geo_placement_get(this.pl_tsid);
	return this.getClassProp('item_class').split(',');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"proto",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-29,"w":104,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEIUlEQVR42u2VzU9iVxjGSSZ86GSm\nVi+gojA4KB0RQUAvIojABRUZlA\/BD0QQuAhSQHRE8WMmY51p0y4a03TVrrrpfnZdTLfdtYm7Lrrx\nX3D\/9J47NWk6XUzatEmb+yRPcnK5nPM7z\/uec0UiQYIECRIkSJAgQf8FUZToHvH9+6JODSXq6afa\ne4nJs38FoE8kanvQIerok0t1tuHexQXfIDtDq1NOS3\/WZdXk\/fTAF3677hvG\/vDbW7ut6hcjuq7U\npKlrQqsQKf8RMAKlpsRW4yC15rYNfOezDyHg1PNOhk1YD1nxvJbARWMV28lJ1NJeVFJTKG7Ywa7S\n2IqO36Tioz946YGXzKTuMOzWe0IzQx+QeX9LV\/KXS6alpPo+SuaeMve\/CHsMNwRuyWfEVsyJs93H\nONsL4rPDdbRKZLyFWo7BR604Dkoe1NMuHBZ8eLLlwf6OC4VlO+L+UUQZI2KM8ToeGP0pFhj5KuTW\nZ0d1lEWlEJv6uPZ4Vz4JSU3VJfO5xtSX3KQ3+bgdzbwP54fz2M8v4OKoiKfNMgrJaVycVLAen8XO\nuhOtoh8HOQ8+bhVQ3ZhBfduNg8ob2GbBj2Y5jtomw6edjliRemzhqmBBct78o9euzWt77\/o1XZJH\npJXeSlejlGkHutvHVZTMY9ZTdR+texXhEttZd+Cg4MVxeQHPWgx2uVQIRDPv5Rdmky4Uk04csQxO\nSgG8PMrwIKV0ENs5J04aQS7JGRwVGZzuplApbqDBvZtesqK4RiO9aEUsYESEGfl5ec7EauRtMbVc\n5tTIxWO3bHcIHElM2SENm4aoRoQrBbcrsFxp6qwD5TSN+oYLnz7bxfH+NuqbMzjensXzahh7GTdO\nyyGccT4oBPD5Jyd4eljBTi6Bam4R5WyU2+Q0djI0qptTqGacqGSnkI2M48OcHbWSnax1nZg3t4a1\n7yV6O6V+rUIySrh4ONJvKko6RPpN0SFZ0vbcTUW8hisSPSlBc9\/BpUSjtOJAIU4jH6P5HqumnNhn\nF3HeSOD53hrYhB1Psh7scS2QW2FQLy4jsxri\/9fIu7DLTmFtYQy52ASKiUnspCdRZbl50\/RrDrCm\nUbRFCANJjhyitxpPdU\/Upe6UGMhL3e9Lg9ZhZdVj01zWa+NXUZ\/h9WrQfJWcM91sLtl4mPKqgzfp\nKXbFzYOQ3ipyJs\/5MQeyFZ1ArfAGiAASk41vRmzXmZWxr10WdYpUrl8um1Z3SwzvcrLvkHuLnGIC\n3E+JbQT497Y8UtYDjoeXEcbwKhUauyLlSoetyHDwawvmX2LMyPfzrsEvufvwnDga1J\/fjmmj6tQy\nrEiple2hnk7pHOl5cjBIQH\/nSpSQ2MnXgYDzE3aK7aRv\/whPzC08S37jzQE8kIvNt1+bP\/NtvwkS\nJEiQIEGCBP2\/9CuiW7KLnJ0VDQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_patch-1333485706.swf",
	admin_props	: false,
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
	"no_rube",
	"proto",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_patch.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
