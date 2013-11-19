var title = "Master the Beaker";
var desc = "Make a jar of <a href=\"event:item|fairly_hallowed_shrine_powder\">Fairly Hallowed Shrine Powder<\/a> and the <a href=\"event:item|powder_of_mild_fecundity\">Powder of Mild Fecundity<\/a>. Make these, and more recipes will be yours.";
var offer = "You’re learning to love the <b>Beaker<\/b>, kid. Now learn to let the beaker love you. Harder. <split butt_txt=\"But how?\" \/> Make yourself a jar of <a href=\"event:item|fairly_hallowed_shrine_powder\">Fairly Hallowed Shrine Powder<\/a> and some <a href=\"event:item|powder_of_mild_fecundity\">Powder of Mild Fecundity<\/a>. You have the recipes already: all you need are the ingredients. <split butt_txt=\"But what will it do?\" \/> All in time, little one. Now beak away, my sorcerer. Beak like you’ve never beaked before.";
var completion = "You’ve beaked, I can tell. You’re radiant and kind of glowy. But don’t worry, that’s a known side effect, it wears off. <split butt_txt=\"Phew.\" \/> Still, try donating to a <b>Shrine<\/b> after sprinkling it with a <b>Shrine Powder<\/b> - the effect will be powerful, if sadly temporary. And be sure to use your <b>Powder of Fecundity<\/b> on a street full of <b>Animals<\/b>. They’ll fecund all over the place for you. <split butt_txt=\"I’m not sure that word means what you think it means.\" \/> Sure I do. Now fecund and leave me be, kid.";


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
var prereq_quests = ["intermediateadmixing_make_powder"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r117"	: {
		"type"		: "make",
		"recipe_id"	: 167,
		"num"		: 1,
		"desc"		: "Make a Fairly Hallowed Shrine Powder"
	},
	"r118"	: {
		"type"		: "make",
		"recipe_id"	: 164,
		"num"		: 1,
		"desc"		: "Make a Powder of Mild Fecundity"
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
	energy = pc.metabolics_add_energy(round_to_5(75 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(162);
	pc.making_try_learn_recipe(163);
	pc.making_try_learn_recipe(166);
	pc.making_try_learn_recipe(168);
	pc.making_try_learn_recipe(169);
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
	"energy"	: 75,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 40
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "fertilidust",
			"label"		: "Fertilidust"
		},
		"1"	: {
			"class_tsid"	: "extremely_hallowed_shrine_powder",
			"label"		: "Extremely Hallowed Shrine Powder"
		},
		"2"	: {
			"class_tsid"	: "powder_of_startling_fecundity",
			"label"		: "Powder of Startling Fecundity"
		},
		"3"	: {
			"class_tsid"	: "no_no_powder",
			"label"		: "No-No Powder"
		},
		"4"	: {
			"class_tsid"	: "sparkle_powder",
			"label"		: "Sparkle Powder"
		}
	}
};

//log.info("intermediateadmixing_make_more_powders.js LOADED");

// generated ok (NO DATE)
