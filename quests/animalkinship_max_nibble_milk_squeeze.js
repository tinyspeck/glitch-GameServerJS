var title = "Nibble, Milk and Squeeze TO THE MAX";
var desc = "Get the maximum yield from a <a href=\"event:item|npc_piggy\">Piggy<\/a>, a <a href=\"event:item|npc_butterfly\">Butterfly<\/a> and a <a href=\"event:item|npc_chicken\">Chicken<\/a>.";
var offer = "Hey, friend. Feeling fecund? <split butt_txt=\"I am, actually.\" \/>Good. Have you ever noticed how, when you're out there nibbling Piggies, milking Butterflies and squeezing Chickens, sometimes you get better results than other times? <split butt_txt=\"Yes, I have.\" \/> To do this job, you need to go and get the maximum yield from a <a href=\"event:item|npc_piggy\">Piggy<\/a>, a <a href=\"event:item|npc_butterfly\">Butterfly<\/a> and a <a href=\"event:item|npc_chicken\">Chicken<\/a>. <split butt_txt=\"How do I do that?\" \/>Goldurned if I know, kid. They're critters of whimsy. Good luck!";
var completion = "Howdy, kid. I see that you've left no piggy un-nibbled... no butterfly un-milked... no chicken un-squee- <split butt_txt=\"Yup, uh-huh, I get it.\" \/> Can't a rock finish a sentence around here? <split butt_txt=\"Sorry.\" \/> What I was ABOUT to say is: here's your reward. And start practicing your finger exercises for your next job. It's going to be a doozy.";


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
	"r121"	: {
		"type"		: "counter",
		"name"		: "piggy_nibble_max_reward",
		"num"		: 1,
		"class_id"	: "npc_piggy",
		"desc"		: "Nibble a Piggy"
	},
	"r122"	: {
		"type"		: "counter",
		"name"		: "butterfly_milk_max_reward",
		"num"		: 1,
		"class_id"	: "npc_butterfly",
		"desc"		: "Milk a Butterfly"
	},
	"r123"	: {
		"type"		: "counter",
		"name"		: "chicken_squeeze_max_reward",
		"num"		: 1,
		"class_id"	: "npc_chicken",
		"desc"		: "Squeeze a Chicken"
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
	currants = pc.stats_add_currants(round_to_5(650 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
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
	"currants"	: 650,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 100
		}
	}
};

//log.info("animalkinship_max_nibble_milk_squeeze.js LOADED");

// generated ok (NO DATE)
