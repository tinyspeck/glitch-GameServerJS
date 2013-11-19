var title = "Three Eggs, One Basket";
var desc = "Create 1 <a href=\"event:item|piggy_egg\">Piggy Egg<\/a>, 1 <a href=\"event:item|chicken_egg\">Chicken Egg<\/a> and 1 <a href=\"event:item|butterfly_egg\">Butterfly Egg<\/a> using an <a href=\"event:item|egg_seasoner\">Egg Seasoner<\/a>.";
var offer = "Hey, kid. You like eggs, right? <split butt_txt=\"Like them? I love them!\" \/>Whoa. Hey. No need to overcompensate. <split butt_txt=\"Sorry. I got a bit excited.\" \/>Happens to the best of us, kid. Now, you know where eggs come from, I hope? <split butt_txt=\"From Egg Plants. Do I look like I just teleported here yesterday?\" \/>I deserved that. OK, so here's what I need you to do. Harvest three <a href=\"event:item|egg_plain\">Plain Eggs<\/a>. Then use an exciting mix of porcine, poultry and lepidopteral spices to transform three Plain Eggs into 1 <a href=\"event:item|piggy_egg\">Pig Egg<\/a>, 1 <a href=\"event:item|chicken_egg\">Chicken Egg<\/a> and 1 <a href=\"event:item|butterfly_egg\">Butterfly Egg<\/a>. <split butt_txt=\"Porcine... lepidopteral... whuh?\" \/>So you don't know everything, do you, kid? Plain Eggs can be seasoned using spices, gases, bubbles and other stuff. <split butt_txt=\"Could you be more specific?\" \/>I could, but I won't. Go figure it out, kid. It'll be fun!";
var completion = "I knew you could do it, kid. Now did you know that seasoned eggs can be incubated under chickens? <split butt_txt=\"Tell me more!\" \/>Another time, kid. Another time.";


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
	"r67"	: {
		"type"		: "make",
		"recipe_id"	: 74,
		"num"		: 1,
		"desc"		: "Make a Piggy Egg"
	},
	"r68"	: {
		"type"		: "make",
		"recipe_id"	: 72,
		"num"		: 1,
		"desc"		: "Make a Butterfly Egg"
	},
	"r69"	: {
		"type"		: "make",
		"recipe_id"	: 73,
		"num"		: 1,
		"desc"		: "Make a Chicken Egg"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"currants"	: 350,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 50
		}
	}
};

//log.info("animalhusbandry_make_three_eggs.js LOADED");

// generated ok (NO DATE)
