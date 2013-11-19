var title = "A Holiday Thing";
var desc = "All you have to do is type \"yay\" into local chat and you will get a gift.";
var offer = "It's a special time of year. A time that makes me feel a little funny. And when I feel funny, I like to give presents.<split butt_txt=\"OK …\">All you have to do is type \"yay\" into the local chat and I will give you a gift.";
var completion = "Yay. Yay! YAY! YAY!!! You did it. I put a little present into your pack. Unwrap it and see what you think!";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
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
	"r238"	: {
		"type"		: "flag",
		"name"		: "typed_yay_in_chat",
		"desc"		: "Type \"yay\" into local chat"
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
	mood = pc.metabolics_add_mood(round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("glitchmas_present", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"mood"	: 10,
	"items"	: {
		"0"	: {
			"class_tsid"	: "glitchmas_present",
			"label"		: "Glitchmas Present",
			"count"		: 1
		}
	}
};

//log.info("glitchmas2010.js LOADED");

// generated ok (NO DATE)
