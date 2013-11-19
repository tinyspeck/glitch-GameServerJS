var title = "Give your neighbors a cup of water.";
var desc = "Surprise a friend by watering their gardens for them!";
var offer = "Your neighbor's plants sure are looking thirsty. Looks like they forgot to water them! A nice generous sprinkle sure would be a nice surprise for your neighbor. Water 5 gardens that belong to any neighbor(s) and give them a bit of H20 lovin'!";
var completion = "Those plants are looking a lot happier! It's good to spread the love and water. I raise my glass of water to you, kid.";


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
	"r372"	: {
		"type"		: "counter",
		"name"		: "water_garden_for_others",
		"num"		: 5,
		"class_id"	: "watering_can",
		"desc"		: "Water 5 gardens that aren't yours"
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
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(300 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(100 * multiplier));
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
	"currants"	: 400,
	"mood"		: 200,
	"energy"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 100
		}
	}
};

//log.info("water_neighbor_garden.js LOADED");

// generated ok (NO DATE)
