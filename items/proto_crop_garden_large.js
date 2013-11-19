//#include include/jobs.js, include/cultivation.js

var label = "L. Crop Garden";
var version = "1347907556";
var name_single = "L. Crop Garden";
var name_plural = "L. Crop Gardens";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["proto_crop_garden_large", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "garden_new",	// defined by proto (overridden by proto_crop_garden_large)
	"job_class_id"	: "job_cult_crop_garden_large_4",	// defined by proto (overridden by proto_crop_garden_large)
	"width"	: "450",	// defined by proto (overridden by proto_crop_garden_large)
	"placement_set"	: "all"	// defined by proto (overridden by proto_crop_garden_large)
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

function onRemoved(pc){ // defined by proto_crop_garden_large
	if (pc){
		pc.runDropTable('cult_remove_garden_large', this);
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
	"no_trade",
	"proto"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-206,"y":-64,"w":411,"h":66},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACsklEQVR42u1UTU8TURRlZ1y51rSd\nmc6IhViHFjptocMAUgVsO52W0mmhYMHKVzB8qKRgFCMBauwCo4lfwZi4MhKXLo0L1+7Y8hv8Bdd7\n3xRjgujevJPc3Ddnzrv3vPsm09TEwcHBwcHBwcHB8T9gKHBWqMR9RrlXMUoYOV00Co0gnvJUnySQ\nttTQHGlLOuqjomFFXUx79J72EE9RbujzMUm92e89M9nbrB7sDwn\/NGZpklrs8b61dRnyXV6wwgKk\nQgKYlDUP5GNeFml8TodFGO6UIIfBeNSTLhnyMH4En23kaU36RIeb1ch1SWDrXvY+ExEh2ynC4\/l2\neFWNvD\/RWF4XzYKufCnqChTQXEoTIK66WGF6Hu1WoIgxEHTDQMDtNMcmY4bC1vE2F2tGzYkr9ZwH\nK+LUMNGUHZNhHLlit8wOTTVSmDcrAXi93nmwZLfO\/NFYUZdN3HRIRkw2FQGGoyKe1jmpqTmTcyYo\nQDYqMT7dmGimoWXTwLWFJolPhz2QCHl+TZvtD3nYmg65WvDD05XQj7XyxS20ceqYsWxEnMCC38kA\nXQFdCxXIRByT1Ih4KpZkPDbHK3VM0ARczDxdr8mMi0x3Da+RGdKcT4DqEE9TpINMJy7A6pgfduaC\nn6atZvWYsW97SXNnNni4mGuB5ZFWWMK8kPWxjeNxBa5fVWC0zwvj\/TJMxH9fyzA16IPSZZlxlG1D\nYtOixkPtbpyYm2UyQ0EHGcbva7S3GWaTPqjNtcP2fODrWvlS8MRvrXa36xym09Wy33iyqKW3ZgKp\nB1NqZv2Gmn9+O3xl51aHWV\/WErtLoYGHFdVatFtKm9NtJume3dHq7zZij\/bux7bf3ItuvahGapQp\ndlc6ahsVf722ENglHXGUKT7WUx9eVqOf1yYDg\/z\/yMHBwcHBwcHB8Tf8BOJjZTClVZfWAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_crop_garden_large-1333485602.swf",
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
	"no_trade",
	"proto"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_crop_garden_large.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
