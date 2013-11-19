var title = "Whole Lotta Love";
var desc = "Donate 1000 favor to each Giant in a single game day.";
var offer = "It's not true to think the Giants never talk, you know. <split butt_txt=\"It isn't?\" \/> Sure, they may not speak in voices you can hear - frankly, even one of their voices would explode your head into a billion pieces before they got through a word. But they whisper to each other through vibrating threads of <b>imagination<\/b>. And they know when you've been favoring one of them above others. And they don't like it. <split butt_txt=\"But what can I do?\" \/>How about this: as a show of general loyalty, <b>donate 1000 favor to each and every Giant, in one single day.<\/b> That'll show'em. You in?";
var completion = "Heavy donating, little Giant-Pleaser. Good job. <split butt_txt=\"Did it work?\" \/> Did what work? Oh! Well, the Giants aren't saying bad things about you any more. Not sure they ever were, to be honest. It's very easy to mishear vibrations on threads of <b>imagination<\/b>. They may have been discussing last night's game for all I know.  <split butt_txt=\"WHAT?\" \/> Oh! Um! Hey! You want a reward? Here's a reward!";


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
	"r339"	: {
		"type"		: "counter",
		"name"		: "earned_favor_alph",
		"num"		: 1000,
		"class_id"	: "emblem_alph",
		"desc"		: "Alph"
	},
	"r340"	: {
		"type"		: "counter",
		"name"		: "earned_favor_cosma",
		"num"		: 1000,
		"class_id"	: "emblem_cosma",
		"desc"		: "Cosma"
	},
	"r341"	: {
		"type"		: "counter",
		"name"		: "earned_favor_friendly",
		"num"		: 1000,
		"class_id"	: "emblem_friendly",
		"desc"		: "Friendly"
	},
	"r342"	: {
		"type"		: "counter",
		"name"		: "earned_favor_grendaline",
		"num"		: 1000,
		"class_id"	: "emblem_grendaline",
		"desc"		: "Grendaline"
	},
	"r343"	: {
		"type"		: "counter",
		"name"		: "earned_favor_humbaba",
		"num"		: 1000,
		"class_id"	: "emblem_humbaba",
		"desc"		: "Humbaba"
	},
	"r344"	: {
		"type"		: "counter",
		"name"		: "earned_favor_lem",
		"num"		: 1000,
		"class_id"	: "emblem_lem",
		"desc"		: "Lem"
	},
	"r345"	: {
		"type"		: "counter",
		"name"		: "earned_favor_mab",
		"num"		: 1000,
		"class_id"	: "emblem_mab",
		"desc"		: "Mab"
	},
	"r346"	: {
		"type"		: "counter",
		"name"		: "earned_favor_pot",
		"num"		: 1000,
		"class_id"	: "emblem_pot",
		"desc"		: "Pot"
	},
	"r347"	: {
		"type"		: "counter",
		"name"		: "earned_favor_spriggan",
		"num"		: 1000,
		"class_id"	: "emblem_spriggan",
		"desc"		: "Spriggan"
	},
	"r348"	: {
		"type"		: "counter",
		"name"		: "earned_favor_ti",
		"num"		: 1000,
		"class_id"	: "emblem_ti",
		"desc"		: "Tii"
	},
	"r349"	: {
		"type"		: "counter",
		"name"		: "earned_favor_zille",
		"num"		: 1000,
		"class_id"	: "emblem_zille",
		"desc"		: "Zille"
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
	xp = pc.stats_add_xp(round_to_5(11000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(1000 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(1000 * multiplier));
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
	"xp"		: 11000,
	"mood"		: 1000,
	"energy"	: 1000
};

function onComplete_custom(pc){
	pc.buffs_remove('donate_1000_favor_every_giant_one_day');
}

function onStarted(pc){
	pc.buffs_apply('donate_1000_favor_every_giant_one_day');
	
	return {ok: 1};
}

//log.info("donate_1000_favor_every_giant_one_day.js LOADED");

// generated ok (NO DATE)
