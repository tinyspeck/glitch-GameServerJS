var title = "Lift Your Light Green Thumb";
var desc = "Learn what it takes to make trees and plants happy and healthy!";
var offer = "Feeling friendly, kid? <split butt_txt=\"I suppose so ...\" \/> Well that’s good. Because it’s time to learn about making nice with trees and plants! You’ll even get your very own <a href=\"event:item|watering_can\">Watering Can<\/a>. You dig??";
var completion = "What’s that? I think you got a little green on your thumb!";


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
var prerequisites = [{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"light_green_thumb_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r368"	: {
		"type"		: "flag",
		"name"		: "finish_lightgreenthumb",
		"class_id"	: "watering_can",
		"desc"		: "Do it all!"
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
	xp = pc.stats_add_xp(round_to_5(125 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(10 * multiplier));
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
	"xp"		: 125,
	"currants"	: 50,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 10
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('lightgreenthumb_water_trees');
}

function onStarted(pc){
	pc.teleportToLocationDelayed(config.newxp_locations['lightgreenthumb_1'], 123, -958);
	return {ok: 1};
}

//log.info("lightgreenthumb_1.js LOADED");

// generated ok (NO DATE)
