var title = "Relax to the Max";
var desc = "Use a <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to fetter your unfettered thoughts and achieve the elusive state of Max Relax. (Receive 50 mood in one meditation)";
var offer = "So you're coming along in the <b>Meditative Arts<\/b>, kid. But have you achieved Max Relax? <split butt_txt=\"I'm not sure.\" \/>If you're not sure, then you haven't. So grab your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a>, clear your head, let your mind and your nether bits feel free, and try hitting 50 mood in one try.";
var completion = "You did it! Max Relax! <split butt_txt=\"I feel squishy.\" \/>That's the best part. Congratulations, kid. And enjoy this little reward. You deserve it.";


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
	"r171"	: {
		"type"		: "flag",
		"name"		: "meditation_mood_50",
		"class_id"	: "focusing_orb",
		"desc"		: "Receive 50 mood in one meditation"
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
	xp = pc.stats_add_xp(round_to_5(700 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(450 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("cosma", round_to_5(70 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 700,
	"currants"	: 450,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 70
		}
	}
};

//log.info("meditativearts_get_max_relax.js LOADED");

// generated ok (NO DATE)
