var title = "Animal friend";
var desc = "Pet an animal in every hub of the world.";
var offer = "Hey kid! It's time to embark on a great journey. There are a lot of animals in the wild out there. They need some love, love of someone like you. \r\n\r\nVisit every hub in the world and pet at least one animal in each of them.";
var completion = "That was a great journey, wasn't it? You saw a lot, you did good. And those animals you petted, I bet they were happy. The world is a better place now because of you.";


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
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(1300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(500 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(500 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1300,
	"currants"	: 500,
	"mood"		: 500,
	"energy"	: 500
};

//log.info("animal_friend.js LOADED");

// generated ok (NO DATE)
