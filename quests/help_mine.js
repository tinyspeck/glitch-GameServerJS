var title = "I Me Mine";
var desc = "Help three people to mine rocks.";
var offer = "Jars. <split butt_txt=\"I’m sorry. What?\" \/>Do you ever have trouble opening stuck jars? <split butt_txt=\"Sometimes, if they’re real stuck.\">Well, you know how sometimes you just can’t get a jar open no matter how long you work at it, but if you pass it to a friend, they get it open right away? <split butt_txt=\"It’s because I already loosened it.\" \/> Kid, mining is like a stuck jar. <split butt_txt=\"Huh?\" \/> Mining, as in with rocks. Sometimes mining is tough on your own, but if you have a friend helping you, it gets way easier… and more fun, like squash. <split butt_txt=\"I don’t think squash comes in jars.\" \/> No, I mean with the rackets and—you know what? Just forget the analogies for a minute. Find someone who’s working on a rock and help them mine by mining at the same time. Do it three times. Can you manage that? I promise you’ll find selflessness deeply fulfilling on a spiritual level.";
var completion = "Nice work, kid. <split butt_txt=\"Thanks!\" \/>Do you feel more helpful? Do you feel like a more fulfilled and productive member of society? <split butt_txt=\"I feel kinda sleepy.\" \/> Well, mining is a lot of work. Why don’t you take a quick break?";


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
	"r270"	: {
		"type"		: "counter",
		"name"		: "help_mine",
		"num"		: 3,
		"class_id"	: "pick",
		"desc"		: "Help players to mine"
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
	xp = pc.stats_add_xp(round_to_5(175 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(125 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 175,
	"currants"	: 125,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 15
		}
	}
};

//log.info("help_mine.js LOADED");

// generated ok (NO DATE)
