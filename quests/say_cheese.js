var title = "Say Cheese";
var desc = "Take your very first self-portrait!";
var offer = "Looks like you're all set to take pictures! <split butt_txt=\"Sure does, smart guy.\" \/> Smart... but am I beautiful? Anyway, you should practice taking pictures. Why not practice on yourself?<split butt_txt=\"Doesn't seem that hard... \" \/>Allright then, let's see how you look on film!";
var completion = "Not too shabby! <split butt_txt=\"I work out.\" \/>Practice does make perfect! Next time, you can point the camera at something else. For now, take this!";


var auto_complete = 0;
var familiar_turnin = 0;
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
	xp = pc.stats_add_xp(round_to_5(100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 100,
	"currants"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

//log.info("say_cheese.js LOADED");

// generated ok (NO DATE)
