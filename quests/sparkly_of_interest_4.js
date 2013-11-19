var title = "Another Simple Sample";
var desc = "Mine and grind 100 sparkly rock.";
var offer = "I need another sample of this shiny stuff so I can compare it with the ones taken from Neva Neva. <split butt_txt=\"I'm now rethinking this whole arms thing...\" \/> Just work through the pain, for science! ...And rewards.";
var completion = "Another fine specimen from the sample master!  <split butt_txt=\"I think I sprained my wrist!\" \/> Just walk it off. Here's a little something to ease the pain. I'm off to study the data.";


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
var prereq_quests = ["sparkly_of_interest_3"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r482"	: {
		"type"		: "flag",
		"name"		: "mine_100_sparkly_in_ajaya_bliss",
		"class_id"	: "sparkly",
		"desc"		: "Mine 100 chunks of sparkly while in Ajaya Bliss"
	},
	"r499"	: {
		"type"		: "flag",
		"name"		: "grind_100_chunks_of_sparkly_in_ajaya_bliss",
		"class_id"	: "ore_grinder",
		"desc"		: "Grind 100 chunks of sparkly while in Ajaya Bliss"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(75 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(75 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
	"currants"	: 150,
	"mood"		: 75,
	"energy"	: 75,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 20
		}
	}
};

//log.info("sparkly_of_interest_4.js LOADED");

// generated ok (NO DATE)
