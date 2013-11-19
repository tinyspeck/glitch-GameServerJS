var title = "Super Soaker";
var desc = "It's hot out there. Grab your trusty watering can and soak 5 different players. They'll thank you later.";
var offer = "Hey, kid. It's hot out there. <split butt_txt=\"Sure is.\" \/>Grab your watering can and soak 5 different players. Trust me, they'll thank you for it.";
var completion = "You soaked 'em good, kid. But soaking isn't its own reward. You deserve a little something extra. Here you go. <split butt_txt=\"Thank you!\" \/>Don't mention it. And remember: you can soak as many people as you wish. That can is bottomless for a reason.";


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
	"r79"	: {
		"type"		: "counter",
		"name"		: "players_soaked",
		"num"		: 5,
		"class_id"	: "watering_can",
		"desc"		: "Players Soaked"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(75 * multiplier));
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
	"xp"		: 1000,
	"currants"	: 500,
	"mood"		: 75
};

function onComplete_custom(pc){
	delete pc.soaked;
}

//log.info("watering_time.js LOADED");

// generated ok (NO DATE)
