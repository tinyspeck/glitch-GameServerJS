var title = "Porcine Pleaser";
var desc = "Give 6 <a href=\"event:item|npc_piggy\">Piggies<\/a> the pleasuring of a lifetime. By petting them, of course.";
var offer = "How are your hands feeling today, kid? Strong? Yet gentle? <split butt_txt=\"That about sums it up.\" \/> Good. Our <a href=\"event:item|npc_piggy\">Piggies<\/a> are feeling sad. Neglected. In need of some firm but loving TLC. <split butt_txt=\"What can I do?\" \/>Flex those finger muscles and pet the first 6 Piggies you meet. Ready?";
var completion = "Those are some thoroughly pleasured Piggies, friend. That was some good petting. <split butt_txt=\"I did my best.\" \/> And it shows. As a little token of appreciation, they asked me to give you this.";


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
var prereq_quests = ["animalkinship_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r65"	: {
		"type"		: "counter",
		"name"		: "piggies_petted",
		"num"		: 6,
		"class_id"	: "npc_piggy",
		"desc"		: "Pet Piggies"
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
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(30 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
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
	"currants"	: 50,
	"energy"	: 30,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 10
		}
	}
};

//log.info("animalkinship_pet_piggies.js LOADED");

// generated ok (NO DATE)
