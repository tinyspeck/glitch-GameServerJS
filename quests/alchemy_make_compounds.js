var title = "Test Tube Basics";
var desc = "Get your hands on a <a href=\"event:item|test_tube\">Test Tube<\/a> to figure out how to make <a href=\"event:item|groddlene\">Groddlene<\/a> and <a href=\"event:item|spriggase\">Spriggase<\/a>. Here are your hints: 6-3-0-0 and 11-7-5-0. There are many more to discover after that, but you'll be on your own. Remember that if you throw in a lot of everything, you have a good chance of finding something ...";
var offer = "Alchemy, eh? A <a href=\"event:item|test_tube\">Test Tube<\/a>? Hmmm ...<split butt_txt=\"Yeah, sounds complex.\" \/>Get ready to do some experimentation: this one is a little different. You'll have to find the right combinations.<split butt_txt=\"I'm up for it.\" \/>There are only four elements, but there are many ratios and combinations. Figure out how to make <a href=\"event:item|groddlene\">Groddlene<\/a> and <a href=\"event:item|spriggase\">Spriggase<\/a> and the rest will follow.";
var completion = "You did it! Good! But there are many more to discover. 4-3-2-1? 17-7-4-2? 12-0-4-3? Don't worry, you'll get them all ...";


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
	"r98"	: {
		"type"		: "make",
		"recipe_id"	: 146,
		"num"		: 1,
		"desc"		: "Make Groddlene"
	},
	"r99"	: {
		"type"		: "make",
		"recipe_id"	: 149,
		"num"		: 1,
		"desc"		: "Make Spriggase"
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
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
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
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 20
		}
	}
};

//log.info("alchemy_make_compounds.js LOADED");

// generated ok (NO DATE)
