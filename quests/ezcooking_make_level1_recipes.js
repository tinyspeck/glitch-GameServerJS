var title = "Lay-zee Choppin'";
var desc = "Put a <a href=\"event:item|knife_and_board\">Knife & Board<\/a> to work and make <a href=\"event:item|flour\">Flour<\/a>, a <a href=\"event:item|lazy_salad\">Lazy Salad<\/a> and a <a href=\"event:item|cheese_plate\">Cheese Plate<\/a>.";
var offer = "Kid, it appears you have some facility with the Knife & Board now. <split butt_txt=\"Sure do\" \/> Great. There are few things easier to make than <a href=\"event:item|flour\">Flour<\/a>, <a href=\"event:item|lazy_salad\">Lazy Salad<\/a> or a <a href=\"event:item|cheese_plate\">Cheese Plate<\/a>.<split butt_txt=\"I believe it\" \/>  Make one of each and you'll be on your way to fancier things.";
var completion = "Nice chopping, kid. A bit lazy, but those recipes did not call for more. <split butt_txt=\"Thanks\" \/> I set aside a little something for you in case you came through for me here. Enjoy!";


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
var prereq_quests = ["ezcooking_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r22"	: {
		"type"		: "make",
		"recipe_id"	: 138,
		"num"		: 1,
		"desc"		: "Make a Flour"
	},
	"r23"	: {
		"type"		: "make",
		"recipe_id"	: 99,
		"num"		: 1,
		"desc"		: "Make a Lazy Salad"
	},
	"r24"	: {
		"type"		: "make",
		"recipe_id"	: 14,
		"num"		: 1,
		"desc"		: "Make a Cheese Plate"
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
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(98);
	pc.making_try_learn_recipe(101);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
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
			"class_tsid"	: "berry_bowl",
			"label"		: "Berry Bowl"
		},
		"1"	: {
			"class_tsid"	: "lotsa_lox",
			"label"		: "Lotsa Lox"
		}
	}
};

//log.info("ezcooking_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
