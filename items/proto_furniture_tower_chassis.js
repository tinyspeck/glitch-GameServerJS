//#include include/jobs.js, include/cultivation.js

var label = "Tower";
var version = "1347907556";
var name_single = "Tower";
var name_plural = "Towers";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 20000;
var input_for = [];
var parent_classes = ["proto_furniture_tower_chassis", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "furniture_tower_chassis",	// defined by proto (overridden by proto_furniture_tower_chassis)
	"job_class_id"	: "job_cult_tower",	// defined by proto (overridden by proto_furniture_tower_chassis)
	"width"	: "356",	// defined by proto (overridden by proto_furniture_tower_chassis)
	"placement_set"	: "all"	// defined by proto (overridden by proto_furniture_tower_chassis)
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

function onContribution(job, pc, base_cost){ // defined by proto_furniture_tower_chassis
	log.info(this+' onContribution: '+job+', '+pc+', '+base_cost);

	var perc = job.get_percentage_complete();
	log.info(this+' percentage complete: '+perc);
	if (perc >= 0.666){
		this.setAndBroadcastState('3');
	}
	else if (perc >= 0.333){
		this.setAndBroadcastState('2');
	}
}

function onCreate(){ // defined by proto_furniture_tower_chassis
	this.parent_onCreate();
	this.setAndBroadcastState('1');
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

function parent_onCreate(){ // defined by proto
	this.setAndBroadcastState('depleted');
	this.setJobData();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"proto",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-151,"y":-112,"w":297,"h":112},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFaElEQVR42u1WWW8TVxRGVVWpi5QC\nhnjf4jjxPuNlvOB1Yjte4ni3Y2cxCdlD4mxuAkRYtBVFAhRaaJHaqnnpa8UDUtXyYvWl8pvfeI0q\nfkDUX3B6rl1bDQKJp5ZKc6RPM3c8c+93zvfdc33mDBdccMEFF1xw8VZHUHm2z6vpr76V5NKMwpRi\nZCdhkwjMSt6hRvCx7K0imLLLGlFaDDGzGKwqHlCKczBKi1rjFmmFVPY\/I5a3KPtyLnkyyUhhxCiE\nUUoEKDPYkORcdBjKI2qI0eIWIXlw2dYqhVS+7rfXK7bWbEKb7I438sbDibC63h3vlKjKdGT46J\/r\nbRbpY5YWvLk6YaOoMmIQAKsXwErK0Cbo0\/HBMsCDKwk9zCV0ENAJIGoWt7YmaJiOaZ90v61N2WA6\nqumNVzOm4\/mk4aQ7XstSRzOYZI9whpZtFGiIueT1zSLVeGNpE1Zpm+B0VAtuLR9MKC+ReKNohkpc\nj548DyFaAvszNpiKals9QlkKf9f1FtoqW2E2YegRupIwNMqjQ73xQpr2YQUhyEjrM2QtWmQiz+cC\nCtNrCZYCgy3n0EXwY9VwMXDq+iE\/MgR7Mw74bNkLh1ssfLrkgturl+DxfhDuVb3wdS3QerznbzzY\nDsCdq\/6TR7uhBsEPN6Pw+FoIfn2YqRN8tRM4\/uKqpzf+9nr46N6GF77cDTTIWgdz9lbIKDrMOmQw\nZhE\/OUWM1QvrXi2\/XvCrTkZoEYRMQticMMONWQZYmxSWMxRcGTfCQtLQvr8+62zjWsUBO5NW2C5Z\n4GqeaqOKValNWWEXn3efEazlKFjJdq6rWRPMj+ugGBxCYk60jgE82DEiVGdt1\/DF+ql+F6HE9ZBR\n+NssZuIxCmBvmoGdsgWSHiW49EKIWiSQcsihEtHgpGpI2OWQdSth3KmAjLuDglcJKZcc8njNeTr3\nBe8AJLEiyUv4jmcAcj5V+0qwlDJ2kptE68Q04MVNmcF3I7ToJ8fg+WCbXMggvMXqBMc+neCFffDC\ns2rB\/Mf3B2HYr1hhq2SFPDsIZcxyG828gptkDTNP4aIlvwrm0Ter+Gw2pIZFNH8FiROQ8VJMCwv4\n+8qYHkpIinSFnBMJI+kyJlBEgmtZIwRRnQhJHAsTMov+jNGiZ3pJn7VbvHcQ73s0\/RPMME+Nulev\nzTBofgalswPZlQUkV8Msb6+64NaiE5bSRgjbpXB\/0wuPaiwiAHfX\/fBwl4Vv9k7j7robbq+cxs05\nB3yC8i\/jPDtlM84lgyDKOmaVvFDxP\/Ijn\/5Xbo4x3EEpXJgQ2ChQ6D8aFlMmmIxo0UsWOEAvEh9l\nsHJpnxItYGlju9xBDS1BsFOiYT2Hc+RNsI1zrOOV+LGGc+zP4HsoJ0ER+2l5VAusWUKq+xwpKBEf\ntnc7q5C9dKyJTGm7rInt5fkofhBnZJBDfxV8KCWrgjGUIecbbBP2Y7bTKONlbBdllD+LcqfdHU+R\ncRETIMijrMUAuR+AIs5TwPFEYBCmQsNtxHBOInNAx2\/KeB+Y8ZTazrvkRzFGpHbr+XWHXqB5uYjv\nErkJLDKeoOhWPM06ZSfYqJ8ygxc+p5Rn48xQP+s3Cr9bGNe3d2gV++I8erAS1RCiL8IW0X1s8vdZ\nA\/+OV8O\/E6HFjaRNgn1VQo7NNoImQSNllzSwlTTzl+RNPKHmI5TwR7+e\/zs2\/ya+30xZpYuvlJkc\nOaNm0SGr7WdJ23HjVif\/ZpwDF1R\/+\/VM1Kn8edyjbMbdymbSq2xejuuay2lTczIy\/IuPFkfjZoGm\n5FXciNuli2NOedWiFvBe03JJQd7718\/yxaCyD6tvsqjOhZ3q80w3MS644IILLrjg4v8XfwE2CX52\nldQeWAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/proto_furniture_tower_chassis-1340994971.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

log.info("proto_furniture_tower_chassis.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
