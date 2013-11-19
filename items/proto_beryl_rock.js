//#include include/jobs.js, include/cultivation.js

var label = "Beryl Rock";
var version = "1347907556";
var name_single = "Beryl Rock";
var name_plural = "Beryl Rocks";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["proto_beryl_rock", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "rock_beryl_1, rock_beryl_2, rock_beryl_3",	// defined by proto (overridden by proto_beryl_rock)
	"job_class_id"	: "job_cult_beryl_rock_2",	// defined by proto (overridden by proto_beryl_rock)
	"width"	: "222",	// defined by proto (overridden by proto_beryl_rock)
	"placement_set"	: "all"	// defined by proto (overridden by proto_beryl_rock)
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

function onRemoved(pc){ // defined by proto_beryl_rock
	if (pc){
		pc.runDropTable('cult_remove_beryl_rock', this);
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
		'position': {"x":-82,"y":-127,"w":164,"h":132},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGdUlEQVR42u2Xe1BUZRiHtazMTI2y\nUcdy1BpzzNHyn6xp0plstCY1LznOeK3GMG95RUAFlLsuKCiwIrCCyGW5r6soCyuLIiCCsLBcRG5y\nF0XlUqT0630\/zjJLNqPVJk7jN\/PMWc6ec97n\/N7vfGfp1+\/ZeDb+J+M2MLQJHZueXrmu9tym39vB\n2xq0TXk65SQautpQj7aVfS7XSEk1drVV1HW1olbiSlMZlDka+KUqO+RJkUP7MLlfxtzoutdS0nUL\nxSakNRbBRxshOJwSPq\/PBBu6WoP+LMfoOxuEnGdSCJzU\/nZ9ll5F1x0hVPSgWWB4cBOG+9346pTY\nrvTArpjD2j4RLH1wS1t4vwn63xqR39mIPEotr7MeV3\/tJjBLBbt4H7gnKvDE52H+g4Z5LMQi+o56\nFLY3IPteFbI7anpQFumoxScEB7UnPZ+YnL6zcUpOR00LS+S31aG87aZA12BARmuV4FJrJSIMqZCd\nDYbsXDDczyogy4x+Muvi5faa3Kz2ahSQXFlrEwpb65DXWgvfqwm4cLccaXevC04WpGA\/tZexjj4E\n6zgvz8y2mimX2ipzYwy6z\/4juep5nFAWtTPjXoUQ0d25juBSLTyzo3C+5RpRCi0RXqKD25lAOJ3y\nFw9LqCFFHK+uzuF52RKgTzR\/oun3KmJFSiSVKsnE3rgMx4vBUJQkQ3OrGEnNRYKoG1lwPh0AB5Uc\ne1S+SLldIsS9UyOxT3UU2yNlQWYX1N0p07KY9nYpkm+VQN2QB5dLoXDPDMcp+pzYVEgU4AwRWZ0J\n16TjcFT7wzU5BOeaDQjRJ8OFpFlwm9KjZUu0zLwpUgoVLCYSqsqE7LJSpHcwJwbqxnwSzifRbpTV\nWXDVhGDvqaM4ekWNyLKLcOGWq4\/BIcFPtH1bpMy8ayS38NxNA+JrcxBRmU4SmUJGVZ9HXEWCCVHU\neldNMMnIodBr4E+SLLuPsI3x7hakFM0n11y08uzNQtG+hPpc0VIhVZeL+LocxNV2w\/KpzSVCnltr\nH+8Lv+wEeOoihCwv3ixnxGyCNLe0pxv1Ip2ga+cRW3tFCPE2piYb0YSKZNNbriPsmg7BdMyB9EjY\nxnrD4ZRcpMeyNlJ6ZhekOZbLqXHrAkpToCg7j4iqDIRXXhLzjRMLu34BoddSIS84I\/b7FSRiB7+P\nYw9jd5wP9lB6NjFeQmxzuLvAbIIsx+mFUWEWNOV4WaoQMiWsIl18ZxN3GFZRniR5hCSP9CS46aQr\nfgreS8uNh3kWbZbjloZWXOwl51+sEVtu+4nyizhZ0c2J8gtiv6NGIYQ4OVuT9m444YQfg+ywPsTJ\nPP\/DxNGDwHNNQWkZ5fwMiXDLCOslzGKMgoT5b++cBCFDSwp2UJK8XXvcQch952eNH47tMs9Sww8D\nzzVTGRm93uyTA3rtC6TXXpAkxxzRq0Ur14c4iuQ2hjoLOWaF9zYs99pqnqWGn1Jj24yFeZG2Pn3k\noTlpxIceFqf0EFjFewmhLeH7Yamw705PboNlh7YI1sit\/tXvxYFBes2ssMr0nsKu1FaWsz8fgJ+j\n9uNgbhzkReceEnTPihDHOaeF9KRmhJLrEZyzdel8qvPi3xXrTwwjJgcVpRQbi3rnq0RRZofKSwja\npRwTSXGqxuNY2Hgcv6+3RXv0yBnTW7J\/PeY5fF87\/pPJc6jOu8Rgqe4jxwDCgpg4ftqkmZ6XY0u4\niLEgw1IsZxQ0leHkeLs7+Sj2pinEfu88lWjvKl8rIbfQxRIz1s2PGjJ6+JdU5wNiFMGtfpl4\/lHJ\nvUS8Sgwnpo6dOnHW9rhDaSzCRbcnHMTm6APYGOkGy2AHWKm9e8kbsUn0wU6ao3yeW0Y4LAPtsVS2\nEV\/Zrih\/7\/NpO+nas4hpxNvECCmUwY\/T7heIV4jXiDeJt4gPJ3w8Zdlip7Wx37qv0y9wXFMw1251\n4RKPDVjtbyOkWYaldiXJhRR\/3qR0h+0ZXzhoArHIxbJz+qrZEXStucRsKbmxxGipDk+pQVIHH6vN\nHPcQ4g3pDvlOx3GqxHTi06EjLRbOXL8gfKGzZcFit3W9+Hr3qsyZ676J+Gj5F16cmMXYEYvonBnS\n+eOkG+frvi7VGfio9v7VeE6KfJA0Ryykux0lFRhDTCAmEe\/zQ2XCO8R4KaUxUlIjpfMtJKlB0vX7\nm\/On4QDpogOlqTBYKjZUYpjJ5yHS94Ok41\/8Jyk9G89GX44\/ADHQLkagvbIIAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/proto_beryl_rock-1333485479.swf",
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

log.info("proto_beryl_rock.js LOADED");

// generated ok 2012-09-17 11:45:56 by martlume
