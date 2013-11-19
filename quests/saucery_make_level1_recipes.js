var title = "Sauce Trifecta";
var desc = "Make a <a href=\"event:item|mild_sauce\">Mild Sauce<\/a>, a <a href=\"event:item|cheezy_sauce\">Cheezy Sauce<\/a>, and a deliciously enigmatic <a href=\"event:item|sweet_n_sour_sauce\">Sweet 'n Sour Sauce<\/a>. Remember: A <a href=\"event:item|saucepan\">Saucepan<\/a> is a must-have for making sauces.";
var offer = "So, you fancy yourself a saucier, kid? <split butt_txt=\"The sauciest!\" \/>I like your moxie. Whatever moxie is. So here's the deal. <split butt_txt=\"I like deals.\" \/>Who doesn't? You grab yourself a <a href=\"event:item|saucepan\">Saucepan<\/a> and simmer up a <a href=\"event:item|mild_sauce\">Mild Sauce<\/a> and a <a href=\"event:item|cheezy_sauce\">Cheesy Sauce<\/a>. <split butt_txt=\"Mild and cheesy. Sounds easy.\" \/>Easy, huh? Then let's make this interesting. Cook up some <a href=\"event:item|sweet_n_sour_sauce\">Sweet 'n Sour Sauce<\/a>.. It's real exotic, that stuff. Got all that?";
var completion = "These sauces you made ... Not bad. A few lumps, but it'll do. You show promise, kid. I'm keeping my eye on you. Here's a lil' something.";


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
	"r35"	: {
		"type"		: "make",
		"recipe_id"	: 41,
		"num"		: 1,
		"desc"		: "Make a Mild Sauce"
	},
	"r36"	: {
		"type"		: "make",
		"recipe_id"	: 42,
		"num"		: 1,
		"desc"		: "Make a Cheezy Sauce"
	},
	"r37"	: {
		"type"		: "make",
		"recipe_id"	: 50,
		"num"		: 1,
		"desc"		: "Make a Sweet 'n' Sour Sauce"
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
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(30 * multiplier));
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
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 30
		}
	}
};

//log.info("saucery_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
