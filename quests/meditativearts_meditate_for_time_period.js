var title = "Blue Ocean";
var desc = "Meditate for a cumulative total of one minute. You will need a <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> (available from any <b>Street Spirit<\/b> who sells <b>Hardware<\/b>.)";
var offer = "Namaste.<split butt_txt=\"Namaste.\" \/>Ah, meditation. Get yourself a <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> and then Meditate for a cumulative total of one minute. You'll feel much better!";
var completion = "Well done! I bet you feel much better. Keep on meditating! It's the true path ... Namaste!";


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
	"r109"	: {
		"type"		: "counter",
		"name"		: "meditation_time",
		"num"		: 60,
		"class_id"	: "focusing_orb",
		"desc"		: "Meditate for 60 seconds"
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
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("cosma", round_to_5(30 * multiplier));
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
	"currants"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 30
		}
	}
};

//log.info("meditativearts_meditate_for_time_period.js LOADED");

// generated ok (NO DATE)
