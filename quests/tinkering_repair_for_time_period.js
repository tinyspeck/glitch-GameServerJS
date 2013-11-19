var title = "Tinker Well";
var desc = "Use a trusty <a href=\"event:item|tinkertool\">Tinkertool<\/a> to sustain a <b>15-second repair<\/b> on a broken tool. (Hint: You can break a tool yourself through excessive use, or you can get a <b>broken tool<\/b> from a friend.)";
var offer = "Let me drop a little hard-boiled philosophy on you, kid. Sometimes in life, things break. You can cry about it. Or you can cry about it and then fix it. <split butt_txt=\"I feel strangely stirred.\" \/>Of course you do. Now get a <a href=\"event:item|tinkertool\">Tinkertool<\/a>, then find a <b>broken tool<\/b> and <b>Repair<\/b> the daylights out of it.";
var completion = "See? Good as new. Waste not, want not. A currant saved is a currant-- <split butt_txt=\"It sure is.\" \/>Grrr. I don't care for interruptions! But I'm still going to give you your reward. This time.";


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
	"r181"	: {
		"type"		: "flag",
		"name"		: "tinkertool_15s_repair",
		"class_id"	: "tinkertool",
		"desc"		: "Repair for 15 seconds straight"
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
	xp = pc.stats_add_xp(round_to_5(175 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 175,
	"currants"	: 100,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 15
		}
	}
};

//log.info("tinkering_repair_for_time_period.js LOADED");

// generated ok (NO DATE)
