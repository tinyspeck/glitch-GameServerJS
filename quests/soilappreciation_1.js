var title = "Talking ‘bout Soil Appreciation";
var desc = "Learn how to tend patches and dig dirt piles.";
var offer = "Kid, can I ask you a question? <split butt_txt=\"Can I stop you?\" \/> Probably not. So I’ll just tell you this: it’s high time you got cozy with a <a href=\"event:item|hoe\">Hoe<\/a>. And a <a href=\"event:item|shovel\">Shovel<\/a>. <split butt_txt=\"Sounds dirty!\" \/> Yes, but in a grounded, urthy kind of way. Ready to appreciate some soil?";
var completion = "You’re on your way now, digster! Here’s a little sumthin’ for your effort.";


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
		"value":	"soil_appreciation_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r370"	: {
		"type"		: "flag",
		"name"		: "finish_soilappreciation",
		"class_id"	: "hoe",
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
	xp = pc.stats_add_xp(round_to_5(150 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(15 * multiplier));
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
	"xp"		: 150,
	"currants"	: 50,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 15
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('soilappreciation_dig_earth');
}

function onStarted(pc){
	pc.teleportToLocationDelayed(config.newxp_locations['soilappreciation_1'], 123, -958);
	return {ok: 1};
}

//log.info("soilappreciation_1.js LOADED");

// generated ok (NO DATE)
