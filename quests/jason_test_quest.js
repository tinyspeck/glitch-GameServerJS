var title = "TEST: Make me two sammichs! NOW!";
var desc = "The taskmaster has asked you to make him 2 sammiches.";
var offer = "I'm really hungry. I have low blood sugar. Please make me two sammiches before I faint.";
var completion = "Oh thank you so much. I feel better already. Enjoy your reward.";


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
var prereq_quests = ["cal_test_1"];
var prerequisites = [];
var end_npcs = ["npc_taskmaster"];
var locations = {};
var requirements = {
	"r71"	: {
		"type"		: "make",
		"recipe_id"	: 12,
		"num"		: 2,
		"desc"		: "Make 2 x Sammich"
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
	xp = pc.stats_add_xp(round_to_5(50 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("cedar_plank_salmon", 5);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 50,
	"currants"	: 50,
	"mood"		: 50,
	"energy"	: 50,
	"items"		: {
		"0"	: {
			"class_tsid"	: "cedar_plank_salmon",
			"label"		: "Cedar Plank Salmon",
			"count"		: 5
		}
	}
};

function doProvided(pc){ // generated from provided
	pc.createItemFromFamiliar('orange', 6);
	pc.createItemFromFamiliar('bun', 5);
	pc.createItemFromFamiliar('meat', 5);
}

//log.info("jason_test_quest.js LOADED");

// generated ok (NO DATE)
