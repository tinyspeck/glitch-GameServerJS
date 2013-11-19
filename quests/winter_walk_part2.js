var title = "Winter Walk";
var desc = "part 2";
var offer = "Ready for another Winter Walk?";
var completion = "Hope it was a breath of fresh air.";


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
var prereq_quests = ["winter_walk"];
var prerequisites = [];
var end_npcs = ["street_spirit","street_spirit_firebog","street_spirit_zutto","street_spirit_groddle","street_spirit_ix"];
var locations = {
	"level_quest_winter_walk_part2"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNBTGUQJ739MC"
	},
	"level_quest_winter_haven_part2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNEN3QHC73UO9"
	}
};

var requirements = {
	"r513"	: {
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

function callback_winter_walk_part2_finish(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
		
	if (!pc) return;
		
	this.set_flag(pc, 'leave');
		
	pc.instances_exit(pc.location.instance_id);
}

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('winter_walk');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
		
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
		
	return true;
}

function onEnterLocation(location){
	if (location == 'level_quest_winter_haven_part2'){
		var pc = this.owner;
		if (!pc) return;
		
		//pc.instances_exit('level_quest_winter_walk_part2');
		return;
	}
}

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
		
	if (pc.location.instance_id == 'level_quest_winter_walk_part2' || pc.location.instance_id == 'level_quest_winter_haven_part2') return;
		
	if (!this.is_complete){
		this.fail_time = time();
		
		pc.failQuest(this.class_tsid);
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'level_quest_winter_walk_part2', -2875, -81, 5*60);
		
	return {ok: 1};
}

//log.info("winter_walk_part2.js LOADED");

// generated ok (NO DATE)
