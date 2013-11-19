var title = "Breezy, EZ Cookin'";
var desc = "Get started making delicious, nutritious foods!";
var offer = "So, you have an interest in cooking, huh? <split butt_txt=\"Mmm, hmm!\" \/> Well it may surprise you to know that every Master Chef starts by working with a <a href=\"event:item|knife_and_board\">Knife & Board<\/a>. You ready to learn some cooking skills?";
var completion = "Looks like your skills just got a little tastier! Well done, kid.";


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
		"value":	"ezcooking_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r369"	: {
		"type"		: "flag",
		"name"		: "finish_ezcooking",
		"class_id"	: "knife_and_board",
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
	favor = pc.stats_add_favor_points("pot", round_to_5(15 * multiplier));
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
			"giant"		: "pot",
			"points"	: 15
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('ezcooking_make_level1_recipes');
}

function onStarted(pc){
	pc.teleportToLocationDelayed(config.newxp_locations['ezcooking_1'], 123, -958);
	return {ok: 1};
}

//log.info("ezcooking_1.js LOADED");

// generated ok (NO DATE)
