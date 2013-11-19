var title = "Dead Head";
var desc = "Take a picture of yourself … dead, and in Hell (also known as <a href=\"event:location|40\">Naraka<\/a>).";
var offer = "I hear <a href=\"event:location|40\">Naraka<\/a> is actually quite lovely this time of year.<split butt_txt=\"Warm, I bet,\" \/>Yes - and I'm sure you'll love it. You'll have to die first, but you can always come back! <split butt_txt=\"Sounds interesting.\" \/>While you're there, take a picture to remember it by!";
var completion = "Devilishly good, my friend.<split butt_txt=\"Grateful to be here, actually.\" \/>. Told ya so! Sometimes the unknown is more inviting than you'd expect. Here's something for your travels.";


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
var prereq_quests = ["wierd_n_wild"];
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(1000 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(300 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 300,
	"currants"	: 1000,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 300
		}
	}
};

//log.info("dead_head.js LOADED");

// generated ok (NO DATE)
