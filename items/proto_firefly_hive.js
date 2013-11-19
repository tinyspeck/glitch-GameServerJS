//#include include/jobs.js, include/cultivation.js

var label = "Firefly Hive";
var version = "1347907556";
var name_single = "Firefly Hive";
var name_plural = "Firefly Hives";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 700;
var input_for = [];
var parent_classes = ["proto_firefly_hive", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "firefly_hive",	// defined by proto (overridden by proto_firefly_hive)
	"job_class_id"	: "job_cult_firefly_hive_2",	// defined by proto (overridden by proto_firefly_hive)
	"width"	: "216",	// defined by proto (overridden by proto_firefly_hive)
	"placement_set"	: "all"	// defined by proto (overridden by proto_firefly_hive)
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

function onRemoved(pc){ // defined by proto_firefly_hive
	if (pc){
		pc.runDropTable('cult_remove_firefly_hive', this);
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
		'position': {"x":-76,"y":-112,"w":160,"h":108},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH7ElEQVR42u2Xe0xb1x3HI23a1iYE\nm7ex8QPs8sYY\/MAPMG+wAWPzsjEP8yY8jAHzfhlwCI+Q0KZJyLYuyZI0S9KqLNOmpYsyqrV0UhQF\nNKmb1najXadt3SNoa7t12h\/f\/a6Jpm1VpVUqaaVxpK\/Ovcfn3vs539\/5\/e71gQP7bb\/tt\/223\/ak\nffh7r+TvD+aS8CfP4c8d3IkRdeUbr3RN3bvdMr\/5UqvicwNm0bGkdhV7c9AsxMZztfjhlSo4tEE7\ndhWr9DOHK1aypFYle6dWwUJDGhuN2gDY5CzYFf5oULFRr2K5PjvnCK5Ww96pV7LRRmCd6YFw6oPQ\nkxmEVk0AWmhs0h6NK4u5xx45XGUq29+hC9gcMvGx1BKP5dYEHLWL0cMAZgXBlRmILn0gXnjKiLfv\n9eEX93q\/CXi+9MjgrGr2pquYj6fdKlw\/UYjnVww4P6nFZFUkmtRsH1w3wU6ZI\/D6y53Yvt\/\/jzfu\nujofCWCVir1WleqP0bp4XFsx4rVXnHj3ZyO4c96Mi0NyTBSEYDgvGIP5wXCRm30FHFwY1WChPemX\nqZEH\/PfWPQVrpZGSoYPcWe1X4NYlG957x+PTj69bcXUiDfOlYZg2hmK2JAyThhD0MnuS9mNRgh+y\now+t7R2cmqWvp8yspSx1qFhYbpfi3gsO\/OGnw6D6hxdXi3CuKwHTxaEYIxedtA\/bdAGoU7LQkU5J\npN89b0xjOfZk37Vmh70135qI40dkGDCEY6JchGen0nHnXAm+fbIA592pWCoPx1Fybo5cnCHQ6aJQ\njFC4B3KC0ZsdhGGLCNWqgO1TTueXP1VAU7Kf49xoBjZvteHFCxXw1sfATQ\/1lkfgyQYxzjSKcdwc\njtNWLs7ZuHia+kUzxwfLuNlPcBtXbXjpW3acGdOhK5e\/8qkC9pSI3vnBZRs+\/J0Xr950YNgWjUrZ\nYTRr2L6EmCwMwXELB09VhuNkBQen7QReI4THGIJRSpah\/BD85r4bH\/x6Bj+53YYeA\/9vXpM2+iOv\ny26Z9DvH8vSfCK5MwxIMV0mwveHEH38+ilvny+E2cKkgB\/rCNkSADIS3JBQLFNprowrcvWbF7bNG\nX9gnijgYyA3G3bU6fEDJtHGzAeXqYFhk7PXnBjSe632pjht9Cv0Fp3zlrFOOr\/Yq8T+BXeuXSb9+\nRHFhyBS502OIwNX5PCq8RfA2JqApjQVXdjD6CNBNGjeEwkP7bb6Ch7doITuvj+Hd14Zx62ulND8e\nNfTqm6yJwctX7TjhVCBdfBAmORf1GUI4Mvhw5oswYo7GYkMKlmwxHw94YzjV\/+aw2rXartycsSbT\nDUSopdXmRR9ES2YIGrRBYDKZKRvNVJAbSS1akma3n7ZK8IBq4vu\/8uCvv53F1veacJbKUTdl8BF6\nFZYmHUZezCEoRH6o1IiQmxSOPGk4LMoILNdLMVQsRq85bhfwyniG4+Jo+srlifS1591Kx3cnstZP\nN6dgoCQOlWoBjKkRyEkMR7EsBDmxbGSIH0dh3CHYFAGoUQXBSMfVVHKYMHdkBGKQwuitFOAv5N77\nb3vw4M1x\/OhZG0bLI2FTBsFE98mm+xQmc2CQ8ZBDcEYZF7O2JCzVJMKVJ0B7VgQGjKJdwFWnCvOO\nRExVxWDCmoTWLCFsah4sKgHMJHt6JPKlXB+kWSmgnoPiVC4cWRIYU3hQCv2gFj2GckqW4kQ\/H6wz\nKxA3FvPx\/W9U4c5FK5Y7ZChL9odFwUU13S89NgwGurZUwSewBKy2yDBURO9wguvI4qMzV4DeKuku\n4NEG+ba3PgVD5fGYroiB1xpH7j2B5pwoWiEXmfEcaKJDfYBlaUIU0qqL5RGw6iJRkMyFPi4MmbEB\nUIkeR0rEV5AZw0JuHAsF8SzYNGE+lat4MCt4vgXp48OgiwmFTSvAMx1KDBZL0JcvRDdBHSHnnNR3\n5gjXTBqhxwe4aItenymToCtPiEYd1zepJ4+PqbIYnGpMxpkmKeZolYu1yXAVUd0rTUCVmu8TA55P\nkCVyPmwEzDzcRK4wi2AcZsaY\/dVcKMFCawpOdCjQb4nH5V4d5qsTdx3L5sOVL\/AdN2fw\/mxP45T9\nR0IstqStT9fI0J4XifbMCIwUiTBE8Wf2Qn8h1TCzGOOmKIyXRPnGGXnLJVi2x+FYVTQWrNE41ZCE\nEZMEY6USXwR6CqPQnivCgCkGDr0Ix+sTsERzZu3x6C56gqAi4C4UoStHQOKjlxwk0JXKuMMBH8lY\nb5t6ba42CY16vs9BN0GNFkcSUCSGCYYRcz5StDvGHDNzpgj8aIUEs2VizFHPjA\/Q+KCBwAxCn5j5\nU+YozNbJ8GS3DksdWrRTFLrItaZ0HomLzmz+Zk+u8OP\/FrRm8fRWReiKTcf3mFNCPJbUkJkKeej9\nJh13y10gfI8BZELgpgdPW8T\/EvNwBqaXfhugnnG+O5fvA58gx5k5DDTj+Cw5zlzfT3Jow9FARlAo\nt5szuJ\/og4F5cXNIYhKfJCAlPFSKTsLqMSQG9daoOZda9LxLbXreRksmb6s2LXyL9s6bYwTMbAfG\nMSeBeghwpmz3nBkfpd8XqmNRkymCURq0lhvJ3pNvQuZznUUKJ4U+hJeTtKzHvmCRCw6N25RhZ5vT\nuceaMrh32rN4W+Tqq8NUIU66sjFWk4JKLW\/lUXxQf\/HfXP\/v8YOkwIeLSCb5PdMcK5guE69R4q3X\nqcP0B\/bbfttv\/yftnyUmJ2cq7Ra8AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_firefly_hive-1333485474.swf",
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

log.info("proto_firefly_hive.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
