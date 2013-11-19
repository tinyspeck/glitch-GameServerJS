var title = "Meditation Station";
var desc = "Visit the same street at least once every 6 game days and meditate for 60 seconds. Do so on 11 game days.";
var offer = "Ah, the virtues of meditation know no bounds. <split butt_txt=\"Indeed!\">But y’know, meditation without practice is kind of, like, spacing out every now and then. I mean it's nice, but... <split butt_txt=\"Not sure if I follow.\">You know that favorite spot of yours? <split butt_txt=\"Which one?\">Well yeah, of course there’s a few, but pick one and meditate there for the next 11 game days and then we’ll talk <b>real<\/b> enlightenment. <split butt_txt=\"Aye.\">";
var completion = "How ya feeling, chum? <split butt_txt=\"Ohmmmmmmmmmmm\">Well, there you go. The best part is that you can keep finding new places to practice and the rewards are just the same. <split butt_txt=\"Nice!\">Here’s some stuff for you. Not that you need it - you transcendent being, you. <split butt_txt=\"Thanks anyway.\">";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
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
	"r470"	: {
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("cosma", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1000,
	"currants"	: 500,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 100
		}
	}
};

//log.info("meditativearts_meditation_station.js LOADED");

// generated ok (NO DATE)
