var title = "Sleepytime Feast";
var desc = "Make friends and influence people with this late-night snack, featuring a <a href=\"event:item|juicy_carpaccio\">Juicy Carpaccio<\/a>, <a href=\"event:item|common_crudites\">Common Crudites<\/a> and a <a href=\"event:item|cold_taco\">Cold Taco<\/a>.";
var offer = "Snacks kid. They make the world go round. <split butt_txt=\"Snacks?\" \/>Is there an echo? Snacks. Especially those of the late-night variety. Go make a Sleepytime Feast: a <a href=\"event:item|juicy_carpaccio\">Juicy Carpaccio<\/a>, some <a href=\"event:item|common_crudites\">Common Crudites<\/a> and a <a href=\"event:item|cold_taco\">Cold Taco<\/a>. Then you'll see what I'm talking about.";
var completion = "There you have it. A Juicy Carpaccio, Common Crudites and a Cold Taco. A textbook Sleepytime Feast. If I had hands, I would clap. I believe this should more than cover you for your troubles.";


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
var prereq_quests = ["ezcooking_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r157"	: {
		"type"		: "make",
		"recipe_id"	: 7,
		"num"		: 1,
		"desc"		: "Make a Juicy Carpaccio"
	},
	"r158"	: {
		"type"		: "make",
		"recipe_id"	: 15,
		"num"		: 1,
		"desc"		: "Make a Common Crudites"
	},
	"r159"	: {
		"type"		: "make",
		"recipe_id"	: 102,
		"num"		: 1,
		"desc"		: "Make a Cold Taco"
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
	xp = pc.stats_add_xp(round_to_5(275 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(175 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 275,
	"currants"	: 175,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 25
		}
	}
};

//log.info("ezcooking_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
