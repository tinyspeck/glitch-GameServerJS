var title = "Aranna Scramble";
var desc = "Take a hike through <a href=\"event:location|101\">Aranna<\/a> to care for the animals and trees. Nibble from 7 piggies, milk 11 Butterflies, pet and water 17 trees, squeeze 23 chickens, get at least 1 Super Harvest from them, and incubate 3 seasoned eggs in a game day.";
var offer = "Whoa there, I say whoa there! <split butt_txt=\"I'm not livestock- what can I do for you?\" \/> There is a mountainous and forested region, that could use your loving touch. <split butt_txt=\"Like where?\" \/> Aranna, my friend- Aranna needs you. <split butt_txt=\"How so?\" \/> The trees and animals throughout Aranna need a friendly Glitch like you to give them your full attention. Are you game? Good. You have 1 game day to complete this task. <split butt_txt=\"Ready!\" \/> Go!";
var completion = "You did it- you provided your loving touch to the residents of Aranna and for that, they thank you with this substantial reward. Huzzah!";


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
	"r475"	: {
		"type"		: "counter",
		"name"		: "butterflies_milked",
		"num"		: 11,
		"class_id"	: "npc_butterfly",
		"desc"		: "Milk Butterflies"
	},
	"r476"	: {
		"type"		: "counter",
		"name"		: "meats_collected_from_pigs",
		"num"		: 7,
		"class_id"	: "meat",
		"desc"		: "Collect Meat"
	},
	"r477"	: {
		"type"		: "counter",
		"name"		: "trees_watered",
		"num"		: 17,
		"class_id"	: "watering_can",
		"desc"		: "Water trees"
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
	xp = pc.stats_add_xp(round_to_5(350 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(250 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(150 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(75 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 350,
	"currants"	: 250,
	"mood"		: 150,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 75
		}
	}
};

//log.info("rannacramble.js LOADED");

// generated ok (NO DATE)
