var title = "Get Sauced";
var desc = "Go crazy with the sauce. Use a <a href=\"event:item|saucepan\">Saucepan<\/a> to make a <a href=\"event:item|tangy_sauce\">Tangy Sauce<\/a>, a <a href=\"event:item|wicked_bolognese_sauce\">Wicked Bolognese Sauce<\/a> and a <a href=\"event:item|creamy_catsup\">Creamy Catsup<\/a>. Tasty on their own, they're also key ingredients in <a href=\"event:item|meat_tetrazzini\">Meat Tetrazzini<\/a>, <a href=\"event:item|tasty_pasta\">Tasty Pasta<\/a> and <a href=\"event:item|expensive_grilled_cheese\">Expensive Grilled Cheese<\/a>.";
var offer = "There are people, and I won't name names, but people who fail to take sauce seriously. <split butt_txt=\"No!\" \/> I'm afraid so. They assume it's just a sauce, and not a path to something else. <split butt_txt=\"Teach me, sensei.\" \/> I don't care for your tone, but get a <a href=\"event:item|saucepan\">Saucepan<\/a> and use it to make a <a href=\"event:item|tangy_sauce\">Tangy Sauce<\/a>, a <a href=\"event:item|wicked_bolognese_sauce\">Wicked Bolognese Sauce<\/a> and a <a href=\"event:item|creamy_catsup\">Creamy Catsup<\/a>, and we'll see if maybe a little sauce will spill your way.";
var completion = "Now you've done it. You've gone and made a Tangy Sauce, a Wicked Bolognese Sauce and a Creamy Catsup. Now you're ready to make <a href=\"event:item|meat_tetrazzini\">Meat Tetrazzini<\/a>, <a href=\"event:item|tasty_pasta\">Tasty Pasta<\/a> and <a href=\"event:item|expensive_grilled_cheese\">Expensive Grilled Cheese<\/a>. I'd tell you to put this towards chef school, but it looks like you're doing fine on your own.";


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
var prereq_quests = ["saucery_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r191"	: {
		"type"		: "make",
		"recipe_id"	: 145,
		"num"		: 1,
		"desc"		: "Make a Tangy Sauce"
	},
	"r192"	: {
		"type"		: "make",
		"recipe_id"	: 46,
		"num"		: 1,
		"desc"		: "Make a Wicked Bolognese Sauce"
	},
	"r193"	: {
		"type"		: "make",
		"recipe_id"	: 45,
		"num"		: 1,
		"desc"		: "Make a Creamy Catsup"
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 150,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 25
		}
	}
};

//log.info("saucery_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
