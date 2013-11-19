var title = "Yes, You Have No Bananas";
var desc = "Use a <a href=\"event:item|fruit_changing_machine\">Fruit-Changing Machine<\/a> to convert 45 common <a href=\"event:item|cherry\">Cherries<\/a> into 5 <a href=\"event:item|orange\">Oranges<\/a>, 5 <a href=\"event:item|apple\">Apples<\/a> and 5 <a href=\"event:item|strawberry\">Strawberries<\/a>.";
var offer = "So you want to be a Fruit Changer, kid. <split butt_txt=\"With all my heart.\" \/> You ready to get your hands juicy? <split butt_txt=\"To the elbow.\" \/>To get started, you're going to need a <a href=\"event:item|fruit_changing_machine\">Fruit-Changing Machine<\/a>. <split butt_txt=\"Check.\" \/>And some basic <a href=\"event:item|cherry\">Cherries<\/a>, let's say 45 of 'em. <split butt_txt=\"OK.\" \/> Use those Cherries to make 5 <a href=\"event:item|orange\">Oranges<\/a>, 5 <a href=\"event:item|apple\">Apples<\/a> and 5 <a href=\"event:item|strawberry\">Strawberries<\/a>. Ready?";
var completion = "I see a couple of bruises. The Fruit-Changing Machine demands a light hand, kid. <split butt_txt=\"Sorry.\" \/>But other than that, everything looks ripe. I wouldn't put it on a hat or anything, but it'll do.";


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
	"r47"	: {
		"type"		: "make",
		"recipe_id"	: 111,
		"num"		: 5,
		"desc"		: "Make 5 x Orange"
	},
	"r48"	: {
		"type"		: "make",
		"recipe_id"	: 112,
		"num"		: 5,
		"desc"		: "Make 5 x Apple"
	},
	"r49"	: {
		"type"		: "make",
		"recipe_id"	: 172,
		"num"		: 5,
		"desc"		: "Make 5 x Strawberry"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 20
		}
	}
};

//log.info("fruitchanging_transform_fruit.js LOADED");

// generated ok (NO DATE)
