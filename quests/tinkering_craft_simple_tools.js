var title = "Gettin' Crafty";
var desc = "Use your trusty <a href=\"event:item|tinkertool\">Tinkertool<\/a>, to craft up a <a href=\"event:item|frying_pan\">Frying Pan<\/a>, a <a href=\"event:item|hatchet\">Hatchet<\/a>, and a <a href=\"event:item|watering_can\">Watering Can<\/a>. Then sell them to the <b>right vendors<\/b> to replenish their stock.";
var offer = "There's a tool shortage throughout the lands. We need you to use your <a href=\"event:item|tinkertool\">Tinkertool<\/a> to tinker up a <a href=\"event:item|frying_pan\">Frying Pan<\/a>, a <a href=\"event:item|hatchet\">Hatchet<\/a>, and a <a href=\"event:item|watering_can\">Watering Can<\/a>, and then sell them to the <b>right vendors<\/b> to replenish their stock. <split butt_txt=\"Who are they?\" \/> Now, if I gave you all the answers, this wouldn't be much of a quest, would it?";
var completion = "Frying Pan, check. Hatchet, check. Watering Can, check. You're a credit to the noble field of Tinkering. <split butt_txt=\"Credit? I prefer cash.\" \/> Not quite what I meant, my friend, but on that note, here's the usual something-something for your efforts.";


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
	"r223"	: {
		"type"		: "make",
		"recipe_id"	: 181,
		"num"		: 1,
		"desc"		: "Craft a Frying Pan"
	},
	"r224"	: {
		"type"		: "make",
		"recipe_id"	: 178,
		"num"		: 1,
		"desc"		: "Craft a Hatchet"
	},
	"r225"	: {
		"type"		: "make",
		"recipe_id"	: 180,
		"num"		: 1,
		"desc"		: "Craft a Watering Can"
	},
	"r228"	: {
		"type"		: "flag",
		"name"		: "frying_pan_sold",
		"class_id"	: "frying_pan",
		"desc"		: "Sell the Frying Pan"
	},
	"r229"	: {
		"type"		: "flag",
		"name"		: "hatchet_sold",
		"class_id"	: "hatchet",
		"desc"		: "Sell the Hatchet"
	},
	"r230"	: {
		"type"		: "flag",
		"name"		: "watering_can_sold",
		"class_id"	: "watering_can",
		"desc"		: "Sell the Watering Can"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(325 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"currants"	: 325,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 50
		}
	}
};

//log.info("tinkering_craft_simple_tools.js LOADED");

// generated ok (NO DATE)
