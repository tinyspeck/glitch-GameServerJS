var title = "Sparkly of Interest";
var desc = "Mine and grind 100 sparkly.";
var offer = "You might be wondering why I've summoned you here today. <split butt_txt=\"That sounds omnious.\" \/>Relax, twitchy. It's all legit. <split butt_txt=\"I've got my lawyer on speed dial...\" \/>I've been studying the differences between sparkly deposits in Ur and Neva Neva has one of the highest concentrations. I need a sample of the mineral but I seem to lack the ability to mine, which is where you come in. <split butt_txt=\"Go, Team Appendages!\" \/>Mine and grind me up a batch of sparkly and I'll make it worth your while.";
var completion = "Nice work, that's a fine sample of sparkly, indeed. <split butt_txt=\"It's some of my best work.\" \/> Certainly a good start to my research.";


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
var prereq_quests = ["sparkly_of_interest_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r495"	: {
		"type"		: "flag",
		"name"		: "mine_100_sparkly_while_in_neva_neva",
		"class_id"	: "sparkly",
		"desc"		: "Mine 100 chunks of sparkly while in Neva Neva"
	},
	"r496"	: {
		"type"		: "flag",
		"name"		: "grind_100_chunks_of_sparkly_in_neva_neva",
		"class_id"	: "ore_grinder",
		"desc"		: "Toggle flag grind_100_chunks_of_sparkly_in_neva_neva"
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
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 100,
	"mood"		: 50,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 10
		}
	}
};

//log.info("sparkly_of_interest_2.js LOADED");

// generated ok (NO DATE)
