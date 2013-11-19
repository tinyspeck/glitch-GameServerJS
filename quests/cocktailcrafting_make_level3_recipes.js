var title = "Barista La Vista";
var desc = "Make 1 of each type of the following cocktail drinks with your cocktail shaker: <a href=\"event:item|apple\">Creamy Martini<\/a>, <a href=\"event:item|apple\">Mabbish Coffee<\/a>, <a href=\"event:item|apple\">Spicy Grog<\/a>, <a href=\"event:item|apple\">Carrot Margarita<\/a>, <a href=\"event:item|apple\">Cloudberry Daiquiri<\/a>, <a href=\"event:item|apple\">Gurly Drink<\/a>, <a href=\"event:item|apple\">Slow Gin Fizz<\/a>, <a href=\"event:item|apple\">Cosma-politan<\/a>, <a href=\"event:item|apple\">Flaming Humbaba<\/a>, <a href=\"event:item|apple\">Pungent Sunrise<\/a>, <a href=\"event:item|apple\">Face Smelter<\/a>";
var offer = "How well can you handle the <a href=\"event:item|apple\">Cocktail Shaker<\/a>? <split butt_txt=\"I've got a firm hand on it.\" \/> Well, prove your mix and shake skills by making each of these drinks: Creamy Martini, Mabbish Coffee, Spicy Grog, Carrot Margarita, Cloudberry Daiquiri, Gurly Drink, Slow Gin Fizz, Cosma-politan, Flaming Humbaba, Pungent Sunrise, Face Smelter.";
var completion = "That's some fine shaking. Friendly is pleased!";


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
var prereq_quests = ["cocktailcrafting_make_level2_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r391"	: {
		"type"		: "make",
		"recipe_id"	: 66,
		"num"		: 1,
		"desc"		: "Make 1 Carrot Margarita"
	},
	"r392"	: {
		"type"		: "make",
		"recipe_id"	: 67,
		"num"		: 1,
		"desc"		: "Make 1 Cloudberry Daiquiri"
	},
	"r393"	: {
		"type"		: "make",
		"recipe_id"	: 63,
		"num"		: 1,
		"desc"		: "Make 1 Spicy Grog"
	},
	"r394"	: {
		"type"		: "make",
		"recipe_id"	: 62,
		"num"		: 1,
		"desc"		: "Make 1 Mabbish Coffee"
	},
	"r395"	: {
		"type"		: "make",
		"recipe_id"	: 68,
		"num"		: 1,
		"desc"		: "Make 1 Cosma-politan"
	},
	"r396"	: {
		"type"		: "make",
		"recipe_id"	: 69,
		"num"		: 1,
		"desc"		: "Make 1 Flaming Humbaba"
	},
	"r397"	: {
		"type"		: "make",
		"recipe_id"	: 298,
		"num"		: 1,
		"desc"		: "Make 1 Face Smelter"
	},
	"r398"	: {
		"type"		: "make",
		"recipe_id"	: 71,
		"num"		: 1,
		"desc"		: "Make 1 Pungent Sunrise"
	},
	"r399"	: {
		"type"		: "make",
		"recipe_id"	: 64,
		"num"		: 1,
		"desc"		: "Make 1 Creamy Martini"
	},
	"r400"	: {
		"type"		: "make",
		"recipe_id"	: 70,
		"num"		: 1,
		"desc"		: "Make 1 Gurly Drink"
	},
	"r401"	: {
		"type"		: "make",
		"recipe_id"	: 65,
		"num"		: 1,
		"desc"		: "Make 1 Slow Gin Fizz"
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
	xp = pc.stats_add_xp(round_to_5(1500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(150 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(300 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(300 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1500,
	"mood"		: 150,
	"energy"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 300
		}
	}
};

//log.info("cocktailcrafting_make_level3_recipes.js LOADED");

// generated ok (NO DATE)
