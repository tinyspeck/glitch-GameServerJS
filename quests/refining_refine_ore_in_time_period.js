var title = "The Daily Grind";
var desc = "Use your <a href=\"event:item|ore_grinder\">Grinder<\/a> to refine 200 <b>Chunks of Ore<\/b> in 2 minutes. You can do it!";
var offer = "There are some who say it can't be done. <split butt_txt=\"Not me! What are we talking about again?\" \/> I'm talking about using your <a href=\"event:item|ore_grinder\">Grinder<\/a> to refine 200 <b>Chunks of Ore<\/b> in 2 minutes. <split butt_txt=\"Easy peasy.\" \/> We'll see about that. Ready?";
var completion = "Wow. 200 Chunks of Ore in 2 minutes. To be honest, I didn't think it could be done. <split butt_txt=\"I done did it.\" \/> You done did. Here's a little reward. Keep this up, and you'll be going places, my little chelloveck.";


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
	"r183"	: {
		"type"		: "counter",
		"name"		: "ore_crushed",
		"num"		: 200,
		"class_id"	: "ore_grinder",
		"desc"		: "Refine 200 Ore"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(325 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
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
	"xp"		: 500,
	"currants"	: 325,
	"energy"	: 250,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 50
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('the_daily_grind');
}

function onStarted(pc){
	pc.buffs_apply('the_daily_grind');
	
	return { ok: 1 };
}

//log.info("refining_refine_ore_in_time_period.js LOADED");

// generated ok (NO DATE)
