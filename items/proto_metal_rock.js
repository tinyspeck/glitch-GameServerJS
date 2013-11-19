//#include include/jobs.js, include/cultivation.js

var label = "Metal Rock";
var version = "1347907556";
var name_single = "Metal Rock";
var name_plural = "Metal Rocks";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1200;
var input_for = [];
var parent_classes = ["proto_metal_rock", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "rock_metal_1, rock_metal_2, rock_metal_3",	// defined by proto (overridden by proto_metal_rock)
	"job_class_id"	: "job_cult_metal_rock_2",	// defined by proto (overridden by proto_metal_rock)
	"width"	: "246",	// defined by proto (overridden by proto_metal_rock)
	"placement_set"	: "all"	// defined by proto (overridden by proto_metal_rock)
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

function onRemoved(pc){ // defined by proto_metal_rock
	if (pc){
		pc.runDropTable('cult_remove_metal_rock', this);
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
		'position': {"x":-78,"y":-137,"w":156,"h":137},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIzklEQVR42u1YbVOa6RXeydjOTnc6\nzn5Ip9lM17zMxo0xIiK+JCKoKL6jgoAiCoKAiqAiooKCr1ECKr5Fo8bEbTaaTdbNbnbTzSZrJ6nt\nZrsTP\/VzfoLTX3B6zh1gSGs7aRqnfthn5gyID\/dz3eec6zrXzTvv\/Hwdgmt1eWaqp6d97VCC++mn\n72IdXZYX9s5WcDo7OYcO4M7TB55mkw7MJi30Ott3nU5n7KEB9\/z547j7X97aW5z3g7vPDh3tzSCv\nKtkVCPjCQwHwx2ePdr99cAeurczA9OQwFBRkg1xWBl1Y8kNR2htr87CyNA1+nxdBGUEsFoHJ2AC9\nPR3Yjx22\/xs4i6WRQ6Xt7rLAXHAc7J1mSE\/nQr1GAS3NjdBmaQIizVRgdOvJ919Ll5aWYp8+3eBU\nV4sPtj9PnjwWZzDIpSUlIgSiA5NJBfn5AghOD4JUWgA6bQ3YrEaY9I\/AZ5tr8MOfH8IXn39Cm9hr\na9Puzcy4d00mJeeA5OR2bGtr3V5y8seQnZ0KHE48FBcLobxMDE5HC+SLBWBs0sDSwiQrOwW1gN\/v\nQvB5kJubgS1wAUtvnBKLeQeTSZmsYE0o5MPISAcUFWVDWtp5qFNXQkNDJWZPhZmaiIBjAK\/Ngttl\nYRuRyyVgNteASlUCp06dij2wEtfUlOxJJFmYjUzQ6apgdMQFwalR7LlmuL1xjTE6DHDKPwwaTQW7\nr6AgiwHUaqugubl2SyBIlb51gKWlORxceJvPTwQqtc2qZz22fn0ezMZ6mJ0ehytzfgZufsYHg94e\n6HfboKRYBCJRJmaci987t8vnnxeeOXPy7ffijz88tLldNmRsEjQ2yuHyhJeB6e2xwtJigJHi0cPP\nYX1tAYF1MblpbWkERXUZI5C6Vg6pqVyM5KkDmbl\/evLN3uoyli7ghYVZH2Pr+NgA9PdbwdJaj9nz\nMcD0GYEjqbG2NTFw4cjNEYBQeBG4XG7cgQkzxdrKLGzd\/QS+\/nIDPJ4O6OjQQVenCVaXJ2EmOALt\n7QbospteASeR5EJVVSl7n5GR5nmrAG\/fWt2NZmiYDJfG+pAECnxwASOB1doA8\/NeMBgUUFgoBJVS\n+gpIChJ0Hi95j8d7S3Jz88ailBg5MuSEuZkJmA1eAkeXGeZnR5m23f3sOit5RUU+aiQfamukaBxM\nMHl5GFx9nWz8RQOkkRjqxf89i2SfVhan97pQRihr39zfZHJCDkZTJ8N+SgXf+ECELDqt8hUt9PuG\nmMsJl5aiulqKjOah2CdgL55\/c+dDil9cnLtl0CtRUgwwNuJmDI0G0I1TpBhlpLPdCJYWLSxf9WF2\nW6DZrAVtQw0oFJWY2RJGjCaDhs3pMMikpLMIMHHvjQjz\/Nn3nKnAsGfpSgB17gqsXA1iNgZRmHuZ\nhJDG+SZcoNcroLKiiJWxRlUJSkU56l4OAqzH0VfHgFColJXQqKsFZ7eNvZaVSlCukiEl5Tz1o+2\/\nAvaXnW93Sc+ot27dXI4EMVdRXQp5eRcQpBWnRCVcuJCMWTEwWRke6oMASk+XvRVwLGLQeFPjKKxG\nY6HBTOcz500AdTolm9+ZmWkEcOu1AX71xa216BLuFxXoXCor8xlz1eoyBnDn6R\/gr88eR+LRd1v4\nvyqmhRqNnBFILM7CTKsRXDWKdhUBY2QhRu\/s3H29MtO5gsbUfwJoa9OzGSsSpTGQGrUMgpOjjERE\noK\/ufcpeLa16llkK8omSAiFIywsiZHnJZC4aiHJoalLsKpVF2+Qb\/y04v38kjhYbG3VhuFFGJuD3\n67M4Gdw41vrR1nvBhH1VXi5mAOvrK6G318wMQFZWCmPx\/Nw4ltmLgIgkqgjAaKD\/DHBw0MbWIBNC\n66J0SfcB54rLy8vc9nrsuEsx+rxccLstWEoJ+C8PwpDXyTJCLKQeIpCtrWog+2UyamBzYwW2H9+D\nJ3+8D3ROoZ4lbxgee+Fot5kZOJoyJpMabVgR2+TmZhCzqIScnHQEW7E\/aSYu9b8IG05Pfxf74vqN\nAFgR1JCnBxe1wEC\/g2kb3We369E6NTAy7dcKVGYKcjg0t7sdViSMClldjqNQixJUzIwHBXlK8pho\nisngbv8LODo30KK0s\/p6GbK1BBcqxgZOYE6ZNJDAERmI4b5xD\/guDcB0YJRJzggyOLp3CRBldP36\nAgRwQwSUNkbZGxrqwGe87OHU1HPkD2F19RIqApe1yrFjv5EgpF9jvBsBuLAw3GDQ14B3oDt04BlB\nMA\/Y5KCmv4KTg84ZlK1JHHtko+o1soj3CwOjbHlwDQJDfxNwClrr3tZNMOjrsKwlOKcFDBD1nEJR\nBA6HAQGn0+Hr7wjndCiOEraYlyPNKqV5Sj3Wh71CO452L3MIgsBRJhXVFSjOEghcHtq3tMHJsch7\ns1HLNnx1cQqJ188cTUO9EgFmg0DAg0Cglx0JtFoZ6msGgk65EwL3fjh5v8I44uxumyKGqZRVEVcc\nDt+4l2XEiT0kLS9iD1Epy1mfOrAvo++lbIazR6HT1uLMVrDTXoW0mI08KrPDYYSNjWm4eDGFBbp1\nSEz8KHj06NFkxPNhdPsdoXqLRPzfikRZNrlM+qLZrGMuhMLWZmTjiRhIk4AeIM7LRuGVQL\/LzjIk\nl5UjkYxIgja8r\/2VDE5hLxZK8iKSQiaB1khP57GscblnmQM6ffp3fwtljsD9cj8S04fv0+BGG7RN\nWSJbpG+sYwCtbWg+dWo2mjicc2y2ej1O1MZR7Ec9kx4aY0SYMDhiOoGl\/9P3aE2y\/Xx+Cpby5emQ\nACYlnbnz3nu\/SA713JHXmigIlENDnDxbdOBnazweZ4+yQKWPHJBQhogAxOowOFefnYEO+7+srAzM\nXCokJMRDfPwJOHv2JB5Bj98JZe2DUJLefRPnFRPqVWrcGHLClGUiVLgViAjk+QoL8xhQYnltjYy5\nFtoUbS4h4WN\/fPxHwRMnjmEcH4uLO55zkL+ExHA4iWY0nOPRGcae9OTkZCuuXZ0RkraGWyf0GnMY\nfpV74zL9fB3E9Q9eDc21r1GCJAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_metal_rock-1333485707.swf",
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

log.info("proto_metal_rock.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
