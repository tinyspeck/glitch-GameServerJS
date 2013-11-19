var title = "Bubble Transmogrification";
var desc = "Harvest 28 <a href=\"event:item|plain_bubble\">Plain Bubbles<\/a> and change them into 7 <a href=\"event:item|tiny_bubble\">Tiny Bubbles<\/a> and 7 <a href=\"event:item|blue_bubble\">Blue Bubbles<\/a>. You'll need a <a href=\"event:item|bubble_tuner\">Bubble Tuner<\/a>, natch. You can buy a bubble tuner from a <b>Street Spirit<\/b> who sells <b>Produce<\/b> or <b>Hardware<\/b>.";
var offer = "So you want to get into the Bubble Tuning game, huh, kid? <split butt_txt=\"Oh, yes. Fervently.\" \/>It's a from-the-ground-up operation. So let's start at the beginning. <split butt_txt=\"That's my favorite place to start.\" \/>Harvest 28 <a href=\"event:item|plain_bubble\">Plain Bubbles<\/a> and get yourself a <a href=\"event:item|bubble_tuner\">Bubble Tuner<\/a>. Use it to create 7 <a href=\"event:item|tiny_bubble\">Tiny Bubbles<\/a> and 7 <a href=\"event:item|blue_bubble\">Blue Bubbles<\/a>. It's that easy. Ready?";
var completion = "Let me see those bubbles. Hmmm... nice curvature... good surface tension... decent viscosity. Not bad for a beginner.";


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
	"r50"	: {
		"type"		: "make",
		"recipe_id"	: 106,
		"num"		: 7,
		"desc"		: "Make 7 x Tiny Bubble"
	},
	"r51"	: {
		"type"		: "make",
		"recipe_id"	: 105,
		"num"		: 7,
		"desc"		: "Make 7 x Blue Bubble"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 20
		}
	}
};

//log.info("bubbletuning_transform_bubbles.js LOADED");

// generated ok (NO DATE)
