var title = "Eggs 'n' Basics";
var desc = "Use a <a href=\"event:item|frying_pan\">Frying Pan<\/a> to make <a href=\"event:item|fried_egg\">Fried Eggs<\/a>, a <a href=\"event:item|basic_omelet\">Basic Omelet<\/a> and a <a href=\"event:item|bun\">Bun<\/a>. It barely gets easier.";
var offer = "Seems like a <a href=\"event:item|frying_pan\">Frying Pan<\/a> is suddenly quite the thing for you to own now. <split butt_txt=\"What makes you say that?\" \/> Because you now know Cheffery! <split butt_txt=\"What should I make?\" \/> Start off easy: <a href=\"event:item|fried_egg\">Fried Eggs<\/a>, then move up to a <a href=\"event:item|basic_omelet\">Basic Omelet<\/a> and round it off with a <a href=\"event:item|bun\">Bun<\/a>.";
var completion = "Nice work, kid. You sure made those eggs 'n' basics. <split butt_txt=\"Thanks.\" \/>Cooking is usually its own reward, but in your case, I'm giving you a little something extra.";


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
	"r27"	: {
		"type"		: "make",
		"recipe_id"	: 17,
		"num"		: 1,
		"desc"		: "Make a Fried Eggs"
	},
	"r28"	: {
		"type"		: "make",
		"recipe_id"	: 18,
		"num"		: 1,
		"desc"		: "Make a Basic Omelet"
	},
	"r29"	: {
		"type"		: "make",
		"recipe_id"	: 139,
		"num"		: 1,
		"desc"		: "Make a Bun"
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
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(19);
	pc.making_try_learn_recipe(20);
	pc.making_try_learn_recipe(5);
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
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 15
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "best_bean_dip",
			"label"		: "Best Bean Dip"
		},
		"1"	: {
			"class_tsid"	: "gammas_pancakes",
			"label"		: "Gamma's Pancakes"
		},
		"2"	: {
			"class_tsid"	: "hash",
			"label"		: "Hash"
		}
	}
};

//log.info("cheffery_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
