var title = "Warm and Smuggly";
var desc = "Deliver the Contraband without getting caught!";
var offer = "Deliver the Contraband without getting caught!";
var completion = "";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r286"	: {
		"type"		: "flag",
		"name"		: "contraband_delivered",
		"class_id"	: "contraband",
		"desc"		: "Deliver the contraband"
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

function doProvided(pc){ // generated from provided
	pc.createItemFromFamiliar('contraband', 1);
}

//log.info("smuggling_basic.js LOADED");

// generated ok (NO DATE)
