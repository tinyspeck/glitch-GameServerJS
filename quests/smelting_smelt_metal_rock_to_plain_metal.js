var title = "Helter Smelter";
var desc = "Fire up a <a href=\"event:item|smelter\">Smelter<\/a> and turn 100 Chunks of <a href=\"event:item|metal_rock\">Metal Rock<\/a> into 20 <a href=\"event:item|plain_metal\">Plain Metal Ingots<\/a> without taking a set break.";
var offer = "A <a href=\"event:item|smelter\">Smelter<\/a> is the foundation of heavy metal. Which leads me to your next task. <split butt_txt=\"All ears, I am.\" \/> Get yourself 100 Chunks of <a href=\"event:item|metal_rock\">Metal Rock<\/a>, and fire up a <a href=\"event:item|smelter\">Smelter<\/a>. You have to smelt all 100 rocks in one go or it doesn't count, so don't stop rockin'.";
var completion = "Ah, there's nothing like a solid day's work of good honest Smelting. <split butt_txt=\"I'll say!\" \/> Your sense of well-being is practically its own reward, wouldn't you say? <split butt_txt=\"Uh.\" \/> Just messing with you. Here's an actual reward.";


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
	"r254"	: {
		"type"		: "flag",
		"name"		: "100_metal_smelted",
		"class_id"	: "rock_metal_3",
		"desc"		: "Smelt 100 metal rocks in one go"
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
	xp = pc.stats_add_xp(round_to_5(325 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(225 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(35 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 325,
	"currants"	: 225,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 35
		}
	}
};

//log.info("smelting_smelt_metal_rock_to_plain_metal.js LOADED");

// generated ok (NO DATE)
