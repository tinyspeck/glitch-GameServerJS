//#include include/jobs.js, include/cultivation.js

var label = "S. Herb Garden";
var version = "1347907556";
var name_single = "S. Herb Garden";
var name_plural = "S. Herb Gardens";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["proto_herb_garden_small", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "garden_new",	// defined by proto (overridden by proto_herb_garden_small)
	"job_class_id"	: "job_cult_herb_garden_small_4",	// defined by proto (overridden by proto_herb_garden_small)
	"width"	: "254",	// defined by proto (overridden by proto_herb_garden_small)
	"placement_set"	: "all"	// defined by proto (overridden by proto_herb_garden_small)
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

function onRemoved(pc){ // defined by proto_herb_garden_small
	if (pc){
		pc.runDropTable('cult_remove_garden_small', this);
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
		'position': {"x":-104,"y":-55,"w":207,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEEklEQVR42u1VW08bRxiN2ocqgtZC\nCqkBe3dtLw6QcvPdGIzBXGzA2IAN2MZsCMWIS5MACfcEKEEJCoQEelOLRKu2aUuloL5V6sOqqtTH\n\/gUe+9iH\/IDTbwZStWrUpFUfKnWPdDQ733w7c74zn9dnzmjQoEGDBg0aNGj4r2J\/qUb8ai2gzPVZ\nK\/\/tve8mzLpHNxvq\/\/EG3x1mde9cC+zcism4naw6Xkva1fW0Q90b8aofTXjVz6d8nJ9d86kHk14+\n7o95ON8d9ajbQ251Z9irbgw41K1L9j\/x8Hqdup4owd8W9nipLro35j1a7i3HUL2E\/lozBupl9NeZ\nkQkUo89nRrLOgm6PiLhHoHUTUn6ZxxI1JqQpN+W38Fg\/xVg8TvGMX8Jos4y5WCm2M5WY65Bxo93y\n4gK\/ud0W3Z2sPZqNleFywIS4V+SbM\/bVnohiYjtdIqLENrsRLVUGdFMeW2fimChWABPIxm6vhE6n\niIhTQBcV9HbKhq1BG95qEjERFDDaKHz\/XGGPFoLKw6zr+Er7BSh+OoSc6vJI6PGa+NhBm3c4jDSX\nEHOLCNsEHovXSOj1mUicheeyNSY+ZDPw\/E6XgFC1Ac1UxI3YRazEy7io6VYJ2YDhScZXsEDHv\/RM\nUYdzdt3jrR5lK+s+vtpmxUhQ5i6wK0nQoWl2PTRnYzsdxg7i69wpMwk7cZQ7dZr39IqDFUWIOAQu\nfqxFxmLsAmbCFlxpFrlz443GI6\/hbNEfBH2y4FO+XA0czHdbVz5dDq2sZWy\/KH5mvwFRt0D9JHFh\n7MCTnpG4MHaNYZuROxMhRyJO40nv0XrfaW+yZ+Ze22kei2ep1+4kL2KJxE21SCRKQLqm8MfxoNjw\nTMd2xz0HD7NOzHSWYoYa8x416d1MNSZDFqrSgnHiZCu54BPR5TJiNPwGxtsrMBQsxptNtB6ycg6T\n05l6E5SAmXM6YiXXRN5ri8lKLKUqMEWxMRKUqSmEUluElKfgOOl6vfEv+2yxu2RltbcUE61mXCWr\np0MSrodPuBQx\/44W3IpZsNol44FSifdH7Ngfc3LuXbZhc6ASO0o17g9WU5FVeHDJhu3BKmzS8wdT\nfiz3V0BpkBB36hG1nUdH1bmVJnOe7rk\/hI1hZzDbKP4ccxV8PdIgbVMvvDcdNn243lv67UZf2Q9r\nXbI632FSJ5qEn0j0EybyqWh2Pay559tNuBm14E6vFffTpdiIW7HeU\/xboes0n20zI+bQI1SR\/4W9\n4NVzL\/wJSSQSL9NwNhAoy6VRJLKq8txu+TVJytfTM2taI7GkvFzIY\/Pc3Nx89g7RkpOTo29xCM11\nxbqe4UY5kvYWpBRf4fCQr3Az7dHv9tjPf7xB7k7TJ6q2WDdL77yi\/Q9r0KBBgwYNGv4f+BVEZAKq\n0vDi3AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_herb_garden_small-1333485712.swf",
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

log.info("proto_herb_garden_small.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
