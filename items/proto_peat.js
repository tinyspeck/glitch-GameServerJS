//#include include/jobs.js, include/cultivation.js

var label = "Peat Bog";
var version = "1347907556";
var name_single = "Peat Bog";
var name_plural = "Peat Bogs";
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
var parent_classes = ["proto_peat", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "peat_1,peat_2,peat_3",	// defined by proto (overridden by proto_peat)
	"job_class_id"	: "job_cult_peat_bog_2",	// defined by proto (overridden by proto_peat)
	"width"	: "248",	// defined by proto (overridden by proto_peat)
	"placement_set"	: "all"	// defined by proto (overridden by proto_peat)
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

function onRemoved(pc){ // defined by proto_peat
	if (pc){
		pc.runDropTable('cult_remove_peat_bog', this);
	}
}

function getEndItems(){ // defined by proto
	//this.container.geo_placement_get(this.pl_tsid);
	return this.getClassProp('item_class').split(',');
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
		'position': {"x":-92,"y":-49,"w":183,"h":52},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD0ElEQVR42u1Vy04jRxSdP0BZJTMk\nGHfjdrcftI2NwTZgtx+Nn9gG\/ADaNnYPQ0BAOxHGyWIGadiwSISUbII0Evts5gPQiG12+QSUL5ht\nMhp05lYTSEjIRJFmkUUf6aiq696qOnVv1e0HDyxYsGDBggULFiz8n+CXHtoYP9R6gQA39MHEBbiP\nhibFT2J+YVjW9YQt6htux6ccJ0Hno9LxaXVI35gzNG1GvvHvbl73B88r8qtX+p1DaZpi2rS6X\/7P\nIpkINS4cBsXhi1RMvIyFeVAf8dAIVuvjWK1JaK5J2PpchmH4sLvthrHjedvb873pD0JX\/a+n3\/R6\ngavenhe93fG3e3ueq37f+9vBvveXgwP5dDAY3+\/1IgeFgl\/e34uUKqrYfm\/KWASC4qNDJiyX89si\nvpHLvOqGGueRS9ih1d1YqQno6n5oNRGdpgfNuoj2qoRWg7UetFdEk1tbE+iskY8mokt83HZBb3lp\njkStRN8SNtaJHdev65r008a694LtrSbEs39N3RdPlVguIb1MR0ZRTPKoLbqo5VBMcWgse1HOS1iu\nSOjoPtRrLlQyDizmRZQzY6iWnFgqOFDJ8VguOmmcR6PqofEx+hbQWBKxvCCgujAGbdWNxqIHdWJz\nzUvriMin3aBA\/Zyc5c+efT9vDE5\/TzsTN+MbMVKT3El2xvE6E+GRp8gVFB6VrBNq1I61lQlkYzSe\nElHJe1BUBRIuYH7Gfs3Zv7NMwrMKh3zSjsWCG7k4h4WUgBLNrS25zQCwPRibmp9sTiSnRzEXsBO5\nS6bLfIz93dlYc9mPeID7C0kYpUaZHEVi6pr5hBsLWRcy8bHbMUYlZEOSWpO0iTJpR2Kav26JhbRE\nB3GgmBYxPyfQGm7UKLop8mVMRzmzZfMz5KeEOLCMmhE8OFLbYZ\/t5ZRnBIzV8gQ58IjIo1AVEemY\nE1HfKNGO9KyAyLjtDlMRBzux6c8Y\/QfGJnmsNIJIRgQUMh7MBTlEaX5UtiEdGbv1e\/aVQvfeeVks\n+kqmwJYeNm5eLrus5XnpIhnmMM5\/jGm2cJCERR0ISp\/eS10LIkyb3Gt3fXaH0Qn+tq9SpGYpS0kS\nVy14TX81Lr02NsPsLpZYKQs4Hxp3SgsbrGseo7XpNA11zS9v7yQOz8+fmBf2mxd\/1LIvn6tmHbux\n3Xl0tHC5GDzpdkPy5o5bbnWmzGiw9Xf7ibPu9sTh8ZF6pq8F2o9bwRKrhccvssbT7xT5vfXv2x80\nmRXcH88Ht5sOBtcC2Ks6Oo0fMvt9c59sqW1d99usf60FCxYsWLBgwcKf8Q7h\/N7eAqdivAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_peat-1333485708.swf",
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

log.info("proto_peat.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
