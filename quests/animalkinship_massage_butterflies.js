var title = "Happy Endings For All!";
var desc = "Catch yourself 7 <a href=\"event:item|npc_butterfly\">Butterflies<\/a> and ease their tired little wings with a bit of healthful massage. You'll need <a href=\"event:item|butterfly_lotion\">Butterfly Lotion<\/a>, sold at Animal Goods Vendors or the auction house.";
var offer = "You know, on some worlds, I could be arrested for my next suggestion. <split butt_txt=\"I'm listening.\" \/> First you'll need some <a href=\"event:item|butterfly_lotion\">Butterfly Lotion<\/a>.<split butt_txt=\"I see.\" \/> And then you'll want to find yourself 7 <a href=\"event:item|npc_butterfly\">Butterflies<\/a>, and give them the Calgon-take-me-away treatment. <split butt_txt=\"Consider it done.\" \/> It's not done until it's done, mon frere.";
var completion = "Those 7 Butterflies will have to look long and hard for another massage the likes of those.  <split butt_txt=\"My fingers are magic.\" \/> Well then, my magic-fingered magoo, I guess you're probably above a little reward. <split butt_txt=\"That is incorrect.\" \/> It always is.";


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
	"r182"	: {
		"type"		: "counter",
		"name"		: "butterflies_massaged",
		"num"		: 7,
		"class_id"	: "npc_butterfly",
		"desc"		: "Massage 7 Butterflies"
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
	xp = pc.stats_add_xp(round_to_5(150 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 150,
	"currants"	: 100,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 15
		}
	}
};

function onComplete_custom(pc){
	delete pc.butterflies_massaged;
}

//log.info("animalkinship_massage_butterflies.js LOADED");

// generated ok (NO DATE)
