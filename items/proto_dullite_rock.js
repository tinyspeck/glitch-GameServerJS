//#include include/jobs.js, include/cultivation.js

var label = "Dullite Rock";
var version = "1347907556";
var name_single = "Dullite Rock";
var name_plural = "Dullite Rocks";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 800;
var input_for = [];
var parent_classes = ["proto_dullite_rock", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "rock_dullite_1, rock_dullite_2, rock_dullite_3",	// defined by proto (overridden by proto_dullite_rock)
	"job_class_id"	: "job_cult_dullite_rock_2",	// defined by proto (overridden by proto_dullite_rock)
	"width"	: "210",	// defined by proto (overridden by proto_dullite_rock)
	"placement_set"	: "all"	// defined by proto (overridden by proto_dullite_rock)
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

function onRemoved(pc){ // defined by proto_dullite_rock
	if (pc){
		pc.runDropTable('cult_remove_dullite_rock', this);
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
		'position': {"x":-78,"y":-132,"w":155,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGQ0lEQVR42u2Ya1BUZRjHTfNSo1Lm\nEGllYzNdpqtlNdPkYFNpkzWOlV2mDzpNX5rJtEJRlFBBXXFluRiEiigiIiAXWVhYYLlf9sKyLAvs\nwrqCyIYa0ExWH5+e\/8t7aE0tJlfyA2fmP+fs2bPv+zv\/5\/K+MGnSxDFxjP0gooDLg8Oavj7v+tsO\n7g+iBVd++72l3ztA5\/v6yeVy5w0NDQXcFnAej3fBwKVBunR5kHrPX6BOZxc52jvJ1eWuvC0AXd09\nLS53D\/X1D5D3p4vU09tHfRe8I+rz5iHk\/5ubzu6e1NoGEwEQgpMXL\/08Ctjt9lAPu5qWkRE8\/nDu\n3vWtjk4yVNeTo8NF1hY7tXd2k3fgMp319BDy0XOul8PtpF3R6vEtnE6Xew1gFAHOaLJQa1uHcLKJ\nrzOzcvl+KxUUFpMqWpM3bnBGo\/U5s8UqCqGj0yXUandQs9UmYNvYMXxvbraJ88lTOaRSx45PwVgs\nlgB2Z7jFZidLc4twTRFg4CSAPefOC1Bnl4cSEpNJrUkYViUnB4yDe2aNL5Ct1SFca21jN53d5D57\nThQHHMUzNXUNtEulJtU+DWkSkiKUcW5JVcM9BQzuINdwbjKaqbSsgkr1FVTLQM3WVnEf57wCrQBE\nmE1m\/p2jQ6ihyTzsd0AO7XoAomL1FTUC0GRupsYmE50pLBICIF5AaTtJySmUfjKLurrPispGE0fr\nycw6Tf4HNFoqAWhvd1GRrkwAKNVbrCsVgHp2Ep+Rn8czskT+OV1uscIg\/FgGAcg5SbfCwWFMbrU5\nqL7RJFRb3yRcK9QWj7pYVV1LdXz\/0JFj7GaLyEkA4oyVJiMzm\/aqY8nvrQVwlVW1AkhxDAJcdU0d\nF0zbaLtB6HGNRg2owaFfhACMnPQ\/oLk5Ql9u4NzJG6nO2gaqbzCKa3tbu3CINwcCzLf1KELP5MIQ\ncND+2AP+B0S1Gk0jALn5RWRgNwGH3IKzCjDUYmsTQiWjaHAv8cfDFLFzN4WFb6fo\/XEUE58Y7FdA\nuIMKhmz2dgEHqOqaem4jpzn0jQIEhYNnsOxByMdKzsu4A0kCbnvkHtq9dz\/FxCWu8Ssg3EDl1jEU\ncq+uvpGycwquCSegfD+jaJCncFAJMaSJT\/Tf+mwyWYMRKmXyCkOVEPoaehxyDEVxvRxEAeGFDqUc\nFSsK8k+sLHE\/+G99NhhqglG9VdV1VFZRJdwDIPLvekWhCE1cW6QTgJG7VbRx81b6fkcUh1jtX8Az\nZ4qDMUkJL2eFRSVicrQTbAz+CRAvobQjBXBbRKT\/HSwrKwtQ8g5rqgKorM1KpSobhFM5eVe5hzAn\nHzpCO6JUIv9QKJF7olP92mowka5EL1zB5EpBYEuFHQ3aykjO1ZO+vFJcZ\/ImQVmj1Zp4itqzT+Rg\nWPgOCgndutLvDipLGSbvcLrFrgXtJTdfe014s0\/ni8LAb7JzcgUUQhwSGib03aYtfmszd+p0+i8w\nUXlF5SgAAFG1cKugUMc9sekqQDh1\/ESm2EAclhU84twI4LcbN+ffFBTrLtY9rIUctgZMpOxWEGKL\nzEH8\/WHyyUEIhYRcy2EX8bmouISLZK+oYMCFhoXThpBN\/Tz2U6xHWIFjBZvMmsGaxXqA9eSSJUs\/\n1Gp1ItGRg1B2dq5oOTeq3iNH0wUg8lV5IYABEGHm8P767spVm3n8V1jPsx5iTZfz3\/C4gzWNNZM1\nl7UAgGvXfr7u4MEUdxZDpadnCqWlZVAxg57IzKGGxr\/W4KJivQBXVgu8lPIdXNuyLYK+\/Opre2Bg\n4Coe+3UJ9zjrYTnntH9zUAGcwwqSkC+ylq9bt0ETHr79ZGLSwYtY7LO4lZQbatgd8yiEljeyqWkn\nRgFTUo+xm8cpJjaBvgkJvfL+6o8P81grWMtYz0rnguR8M8cCOFlaPcsHEoMsZD3Beon19keffha\/\nM0rlQKWWlJaPCn+DoDgA986K92L42U9Yq1lwbLl0bZEcD+Pe7wM3XUZxTMcUn1ycI5N4vnT0UdYz\nrBdYr7JeY73JegvnpW8sW7No8eIP5P2XWU+zHpNQCOU8Od69cvwZcr7\/fEyRb3c3a7YceK6cJEhO\nOF\/qQXmeJ4ssSD53n+wIs+U4024WaqwVj3Y0VU74d02V30+e+PfuxHGD409vU7xyQQY5EQAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_dullite_rock-1333485470.swf",
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

log.info("proto_dullite_rock.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
