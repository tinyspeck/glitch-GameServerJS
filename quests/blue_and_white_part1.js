var title = "A Summer's Day";
var desc = "Blah blah, part 1";
var offer = "Yes. Good. Here it is: there's a certain memory of a summer's day shared by all the Giants. <split butt_txt=\"Yes?\" \/>None of them remember what happened or even why they remember it... yet they do. <split butt_txt=\"Interesting\" \/>It is just an impression, a feeling. Maybe it is important, maybe it is not. <split butt_txt=\"OK\" \/>Would you like to go there now and see what you think?";
var completion = "You see, {pc_label}? I thought you could benefit from that experience. No one knows what it means, so let your imagination go wild.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var hide_questlog = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	5
}];
var end_npcs = ["street_spirit","street_spirit_firebog","street_spirit_zutto","street_spirit_groddle","street_spirit_ix"];
var locations = {
	"blue_and_white"	: {
		"dev_tsid"	: "LPF2SVV22B13J4O",
		"prod_tsid"	: "LNVIABSR3M139C7"
	}
};

var requirements = {
	"r363"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Toggle flag leave"
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	this.onComplete_custom(pc);
}
var rewards = {};

function callback_blue_and_white_finish(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
	
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	pc.instances_exit(pc.location.instance_id);
}

function canOffer(pc){
	if (pc.last_blue_and_white_offer && time() - pc.last_blue_and_white_offer < 4*60*60) return false; // One offer every 4 real-world hours
	
	return true;
}

function onComplete_custom(pc){
	delete pc.last_blue_and_white_offer;
	
	// Spawn qurazies
	var q1 = pc.location.createAndReturnItem('quoin', 1, pc.x-110, pc.y-75, 0, pc.tsid);
	if (q1) q1.setInstanceProp('type', 'qurazy');
	
	var q2 = pc.location.createAndReturnItem('quoin', 1, pc.x-75, pc.y-140, 0, pc.tsid);
	if (q2) q2.setInstanceProp('type', 'qurazy');
	
	var q3 = pc.location.createAndReturnItem('quoin', 1, pc.x, pc.y-180, 0, pc.tsid);
	if (q3) q3.setInstanceProp('type', 'qurazy');
	
	var q4 = pc.location.createAndReturnItem('quoin', 1, pc.x+75, pc.y-140, 0, pc.tsid);
	if (q4) q4.setInstanceProp('type', 'qurazy');
	
	var q5 = pc.location.createAndReturnItem('quoin', 1, pc.x+110, pc.y-75, 0, pc.tsid);
	if (q5) q5.setInstanceProp('type', 'qurazy');
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	delete pc.last_blue_and_white_offer;
	
	if (!this.is_complete){
		pc.quests_fail_and_remove(this.class_tsid);
	
		pc.instances_exit('blue_and_white');
	}
}

function onStarted(pc){
	var location_options = {
		is_puzzle: true
	};
	
	this.questInstanceLocation(pc, 'blue_and_white', 3709, -258, 5*60, null, location_options);
	
	return {ok: 1};
}

//log.info("blue_and_white_part1.js LOADED");

// generated ok (NO DATE)
