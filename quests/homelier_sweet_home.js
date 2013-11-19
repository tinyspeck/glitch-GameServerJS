var title = "Homelier Sweet Home";
var desc = "Once you have the penpersonship skill, visit the home streets (or house) of every one of your friends and leave them a house-warming gift and a note to accompany it.";
var offer = "Isn't it nice to receive house-warming gifts? Now that you're a skilled penperson, visit the homes of each of your friends and leave them a gift with a friendly note attached. I guarantee it'll make you feel all warm inside.";
var completion = "Congrats! You've spread warmth to all of your friends and made their homes a little homelier. I bet you feel some of that warmth too.";


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
var prerequisites = [{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"penmanship_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(11 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(111 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 11,
	"mood"	: 111
};

//log.info("homelier_sweet_home.js LOADED");

// generated ok (NO DATE)
