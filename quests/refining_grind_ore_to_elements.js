var title = "Perfectly Refined";
var desc = "Obtain 50 of each <b>Element<\/b> by grinding down some ore chunks. You'll need a <a href=\"event:item|ore_grinder\">Grinder<\/a> (available from any <b>Street Spirit<\/b> who sells <b>Hardware<\/b> or <b>Alchemical Goods<\/b>) and an <a href=\"event:item|bag_elemental_pouch\">Elemental Pouch<\/a> (but you probably already have one of those).";
var offer = "Congratulations on learning the refining skill. Now let's put it to use: break down enough ore chunks to get 50 of each of the four <b>Elements<\/b>.";
var completion = "Well done! Grind lots of ore so you have the Elements to get ahead with <a href=\"event:skill|alchemy_1\">Alchemy<\/a>.";


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
	"r105"	: {
		"type"		: "counter",
		"name"		: "refined_element_red",
		"num"		: 50,
		"class_id"	: "element_red",
		"desc"		: "Refine 50 Red Elements"
	},
	"r106"	: {
		"type"		: "counter",
		"name"		: "refined_element_green",
		"num"		: 50,
		"class_id"	: "element_green",
		"desc"		: "Refine 50 Green Elements"
	},
	"r107"	: {
		"type"		: "counter",
		"name"		: "refined_element_blue",
		"num"		: 50,
		"class_id"	: "element_blue",
		"desc"		: "Refine 50 Blue Elements"
	},
	"r108"	: {
		"type"		: "counter",
		"name"		: "refined_element_shiny",
		"num"		: 50,
		"class_id"	: "element_shiny",
		"desc"		: "Refine 50 Shiny Elements"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(150 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 300,
	"currants"	: 200,
	"energy"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 30
		}
	}
};

//log.info("refining_grind_ore_to_elements.js LOADED");

// generated ok (NO DATE)
