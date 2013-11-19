var title = "Shake and Stir";
var desc = "Use a <a href=\"event:item|cocktail_shaker\">Cocktail Shaker<\/a> to froth up 5 <a href=\"event:item|creamy_martini\">Creamy Martinis<\/a>. Then drink them! Here's a tip: To make a <a href=\"event:item|creamy_martini\">Creamy Martini<\/a>, you're going to have to milk some <b>Butterflies<\/b>.";
var offer = "Kid, have I ever mentioned that you look like the daring, adventure-seeking type? <split butt_txt=\"Gosh, thanks.\" \/>And daring, adventure-seeking types like you need daring, adventurous drinks. <split butt_txt=\"Yes. Sometimes we do.\" \/>That's why I think you're ready for this mixological adventure. <split butt_txt=\"Without even knowing what it is, I feel ready.\" \/>Get yourself a <a href=\"event:item|cocktail_shaker\">Cocktail Shaker<\/a>, then make and drink 5 <a href=\"event:item|creamy_martini\">Creamy Martinis<\/a>. <split butt_txt=\"Creamy?\" \/>The creaminess comes from the <a href=\"event:item|milk_butterfly\">Butterfly Milk<\/a>. Or, specifically, how the butterfly milk reacts to the <a href=\"event:item|onion\">Onions<\/a>. <split butt_txt=\"Onions?\" \/>I can tell you're excited. Ready to get started?";
var completion = "Those looked even tastier than usual. <split butt_txt=\"Yeah, they were better than I expected.\" \/>The secret is shaking AND stirring them. And then shaking them again. <split butt_txt=\"*blarp*\" \/>That would be the onions.";


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
	"r38"	: {
		"type"		: "make",
		"recipe_id"	: 64,
		"num"		: 5,
		"desc"		: "Make 5 x Creamy Martini"
	},
	"r39"	: {
		"type"		: "counter",
		"name"		: "drink_creamy_martini",
		"num"		: 5,
		"desc"		: "Drink all 5 Creamy Martinis"
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(250 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(66);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 400,
	"currants"	: 250,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 40
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "carrot_margarita",
			"label"		: "Carrot Margarita"
		}
	}
};

//log.info("cocktailcrafting_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
