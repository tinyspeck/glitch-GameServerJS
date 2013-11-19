var title = "Weird n' Wild";
var desc = "Snap pictures of a <a href=\"event:item|npc_fox\">Fox<\/a>, a <a href=\"event:item|npc_sloth\">Sloth<\/a>, and an <a href=\"event:item|npc_yoga_frog\"> AFLC Frog<\/a>.";
var offer = "You're getting pretty handy with this snapshotting exploration stuff. <split butt_txt=\"Why, thank you!\" \/>Wanna explore some of the wilder life in Ur? <split butt_txt=\"Sure.\" \/>Great. This time you will need to take 3 snaps - one of a <a href=\"event:item|npc_fox\">Fox<\/a>, another of a <a href=\"event:item|npc_sloth\">Sloth<\/a>, and finally, one of an <a href=\"event:external|\/items\/7448\/\"> AFLC Frog<\/a>. Cool? Get snappin!";
var completion = "";


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
var prereq_quests = ["omg_bacon"];
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 500,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 200
		}
	}
};

//log.info("wierd_n_wild.js LOADED");

// generated ok (NO DATE)
