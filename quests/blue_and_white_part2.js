var title = "A Summer's Day";
var desc = "Blah blah, part 2";
var offer = "Are you ready to reminisce A Summer's Day?";
var completion = "Welcome back, {pc_label}. I hope you enjoyed yourself.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var hide_questlog = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["blue_and_white_part1"];
var prerequisites = [];
var end_npcs = ["street_spirit","street_spirit_firebog","street_spirit_zutto","street_spirit_groddle","street_spirit_ix"];
var locations = {
	"blue_and_white"	: {
		"dev_tsid"	: "LPF101OO2B13DEQ",
		"prod_tsid"	: "LNVIH6NU3M13MJJ"
	},
	"blue_and_white_bonus"	: {
		"dev_tsid"	: "LPF1024Q2B135UG",
		"prod_tsid"	: "LNVIL1E14M13K5I"
	}
};

var requirements = {
	"r364"	: {
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
}
var rewards = {};

function callback_blue_and_white_finish(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
	
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	
	pc.instances_exit(pc.location.instance_id);
}

function callback_blue_and_white_go_bonus(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
	
	if (!pc) return;
	
	this.questInstanceLocation(pc, 'blue_and_white_bonus', 380, -70, 2*60);
}

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('blue_and_white_part1');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
	
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
	
	return true;
}

function onEnterLocation(location){
	if (location == 'blue_and_white_bonus'){
		var pc = this.owner;
		if (!pc) return;
	
		pc.instances_exit('blue_and_white');
		return;
	}
}

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
	
	if (pc.location.instance_id == 'blue_and_white' || pc.location.instance_id == 'blue_and_white_bonus') return;
	
	if (!this.is_complete){
		this.fail_time = time();
	
		pc.failQuest(this.class_tsid);
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'blue_and_white', 3709, -258, 5*60);
	
	return {ok: 1};
}

//log.info("blue_and_white_part2.js LOADED");

// generated ok (NO DATE)
