var title = "Master Tinkerer";
var desc = "Use your handy-dandy <a href=\"event:item|tinkertool\">Tinkertool<\/a> to up and fix 11 different kinds of <b>broken tools<\/b>. (This is the kind of job you can do for your friends. Or even for friendly strangers.)";
var offer = "Feeling dangerous? <split butt_txt=\"No.\" \/> Perfect, because there is nothing dangerous about fixing 11 different kinds of <b>tools<\/b>. Difficult, yes. But the rewards... wow.<split butt_txt=\"I'll be rich?!\" \/> No. Not at all. I was thinking about something else for a second. I guess I said wow without thinking. <split butt_txt=\"Oh.\" \/> Don't worry, though. You'll do okay.";
var completion = "I knew you had it in you to fix 11 different tools! Well, I suspected you did anyways. <split butt_txt=\"I never stopped believing in me.\" \/> While this sort of self-reliance is a virtue unto itself, it never hurts to get a little something for all that elbow grease you had to burn through. And here it is.";


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
var prereq_quests = ["tinkering_repair_more_tools"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r197"	: {
		"type"		: "counter",
		"name"		: "tinkertool_repair",
		"num"		: 11,
		"class_id"	: "tinkertool",
		"desc"		: "Repair 11 tools"
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
	xp = pc.stats_add_xp(round_to_5(800 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(525 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(80 * multiplier));
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
	"xp"		: 800,
	"currants"	: 525,
	"energy"	: 250,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 80
		}
	}
};

function onComplete_custom(pc){
	delete pc.tools_repaired;
}

//log.info("tinkering_repair_even_more_tools.js LOADED");

// generated ok (NO DATE)
