var title = "A Kindly Act of Randomness";
var desc = "Give at least one item to five players who are still at Level 3, 4 or 5. (Hint: Click on a player and then \"Info\" to find out their level).";
var offer = "Looking for that warm, fuzzy feeling?<split butt_txt=\"Am I?!!\">No, not that one. The other one.<split butt_txt=\"Oh, OK\">It is a good thing to help those less experienced than yourself. Find <b>five players at Level 3, 4 or 5<\/b> and give them a lil' something.<split butt_txt=\"Like what?\">Anything you have on you. Use your imagination, kid — it's a present!";
var completion = "You are randomly kind and kindly random. Keep that generosity in your heart, kid: it suits you.";


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
	"r222"	: {
		"type"		: "counter",
		"name"		: "give_player_level1",
		"num"		: 5,
		"desc"		: "Give to 5 Level 3, 4, or 5 Players"
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
	xp = pc.stats_add_xp(round_to_5(600 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(10 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(10 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 600,
	"mood"		: 10,
	"energy"	: 10,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

function onComplete_custom(pc){
	delete pc.kindly_randomness;
}

//log.info("kindly_randomness.js LOADED");

// generated ok (NO DATE)
