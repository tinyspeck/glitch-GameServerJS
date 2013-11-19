var title = "Begin with The Beaker";
var desc = "Make a jar of <a href=\"event:item|fertilidust_lite\">Fertilidust Lite<\/a> powder. For this, you will need 15 <a href=\"event:item|humbabol\">Humbabol<\/a> and 10 <a href=\"event:item|potoxin\">Potoxin<\/a> compounds. And a <a href=\"event:item|beaker\">Beaker<\/a>. Obviously.";
var offer = "Delving into the dark arts of admixing, eh? <split butt_txt=\"Dark? No one said anything about dark?\" \/> Well, dark in the sense of ‘pleasant and above board, if a tiny bit mysterious’. Try making some <a href=\"event:item|fertilidust_lite\">Fertilidust Lite<\/a> powder. Your <a href=\"event:item|beaker\">Beaker<\/a> knows the recipe already: all you need are the ingredients.";
var completion = "And they shall call you 'All-Powerful Font of Fertilidust!' They shall call you 'Beako! Beako!' <split butt_txt=\"They will?\" \/> No. But they should. Still, you should try sprinkling some of your shiny new <b>Fertilidust Lite<\/b> powder near a <b>Tree<\/b>, and watch it fizzle with health, grow up quicker, and start speaking Humbabanese. <split butt_txt=\"Humbabanese? Really?\" \/> No. But the other two things? Totally.";


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
	"r101"	: {
		"type"		: "make",
		"recipe_id"	: 165,
		"num"		: 1,
		"desc"		: "Make a Fertilidust Lite"
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
	favor = pc.stats_add_favor_points("ti", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(167);
	pc.making_try_learn_recipe(164);
	pc.making_try_learn_recipe(171);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 250,
	"currants"	: 150,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 25
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "fairly_hallowed_shrine_powder",
			"label"		: "Fairly Hallowed Shrine Powder"
		},
		"1"	: {
			"class_tsid"	: "powder_of_mild_fecundity",
			"label"		: "Powder of Mild Fecundity"
		},
		"2"	: {
			"class_tsid"	: "sneezing_powder",
			"label"		: "Sneezing Powder"
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('intermediateadmixing_make_more_powders');
}

//log.info("intermediateadmixing_make_powder.js LOADED");

// generated ok (NO DATE)
