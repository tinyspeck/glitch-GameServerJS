var title = "Where the Heart Is";
var desc = "Take a snapshot of your home interior.";
var offer = "One of the best things about having a home is making it your own. <split butt_txt=\"Yeah, mine is pretty neat.\" \/> It is! And as you expand and decorate your home, it will become even more a reflection of you.<split butt_txt=\"You know, that's true!\" \/>Why not immortalize your current home decor with a lovely snapshot? If you feel like bragging - you can post it publicly!";
var completion = "Wow - really love what you've done with the place! Imagine what it will look like in the future! <split butt_txt=\"Yeah. Maybe some new carpet?\" \/>I'll leave you to your decorating. Maybe this will help?";


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
var prereq_quests = ["say_cheese"];
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
	"currants"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

//log.info("questswhere_the_heart_isjs.js LOADED");

// generated ok (NO DATE)
