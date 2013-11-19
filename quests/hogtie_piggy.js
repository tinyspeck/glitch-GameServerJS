var title = "The Great Hog Haul";
var desc = "Hogtie three Piggies and put them in the Pig Pen!";
var offer = "The Piggies got loose from their pen!<split butt_txt=\"Oh noes.\">So, let's use that as an arbitrary excuse to have a race.<split butt_txt=\"Seems appropriate.\">Be the first to hogtie 3 Piggies and return them to their pen to win!";
var completion = "Dem Piggies got hogtied up good! Nice work.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_multiplayer = 1;
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
	"r273"	: {
		"type"		: "flag",
		"name"		: "multiplayer_quest_win",
		"desc"		: "Win the race!"
	},
	"r274"	: {
		"type"		: "flag",
		"name"		: "race_leave",
		"desc"		: "Leave"
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

//log.info("hogtie_piggy.js LOADED");

// generated ok (NO DATE)
