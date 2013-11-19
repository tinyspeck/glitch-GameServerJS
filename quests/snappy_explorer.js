var title = "Snappy Explorer";
var desc = "Take 3 pictures in 3 different parts of Ur: <a href=\"event:location|101\">Aranna<\/a>, <a href=\"event:location|120\">Cauda<\/a>, and <a href=\"event:location|120\">Uralia<\/a>.";
var offer = "You're getting pretty good with this snapshotting thing. <split butt_txt=\"I'm not Ansel Adams, but... \" \/>But maybe you are! It sure would be nice to have some beautiful pictures of Glitch's many landscapes. <split butt_txt=\"You're right!\" \/>Ok, visit and take an inspired photo in <a href=\"event:location|101\">Aranna<\/a>, <a href=\"event:location|120\">Cauda<\/a>, and \r\n<a href=\"event:location|120\">Uralia<\/a>. Let's see what you got!";
var completion = "They're stunning! <split butt_txt=\"Thanks!\" \/>Sometimes talent is only half the battle, kid! Here's a little something for the road.";


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
var prereq_quests = ["questswhere_the_heart_isjs"];
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
	"xp"		: 200,
	"currants"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

//log.info("snappy_explorer.js LOADED");

// generated ok (NO DATE)
