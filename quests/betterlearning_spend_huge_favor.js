var title = "This Favor Goes Up to 11. Or 1511";
var desc = "Spend 1511 favor points in one go speeding up skill learning. (Subtle Hinty-Nudge: collecting multiple <b>Emblems<\/b> from one <b>Giant<\/b> will increase your favor capacity…)";
var offer = "You believe there's such thing as too much of a good thing, kid. <split butt_txt=\"No?\" \/> Darn tootin'. And you know what counts as a really good thing? Those glorious little <b>Emblems<\/b> you get from donating to <b>Giants<\/b>. <split butt_txt=\"Really?\" \/> Oh yes. Your favor limit with a <b>Giant<\/b> increases with each subsequent <b>Emblem<\/b>. So multiple Emblems make for bigtime favor capacity, as my grandmother used to say. But she never elaborated. So try something for me, will ya? <split butt_txt=\"Anything.\" \/> Collect as many <b>Emblems<\/b> as it takes to increase your favor capacity to 1600. Then accrue 1511 favor points for whichever <b>Giant<\/b> you please.  <split butt_txt=\"1511?!?\" \/> Yup, 1511. Then spend them all at once on speeding up learning a skill. Which skill? Well, I'll leave that up to you. I'm easy like that.";
var completion = "You know how they say diligence is its own reward? Well, that's only half of it. Because not only did you get ultraspeedy edumacation and the lasting admiration of your giant, but, ta da! A little clutch of thingamyjigs from me to you. You're welcome, kid.";


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
	"r282"	: {
		"type"		: "flag",
		"name"		: "spend_enormous_favor",
		"class_id"	: "npc_shrine_alph",
		"desc"		: "Spend 1511 favor points at once."
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
	xp = pc.stats_add_xp(round_to_5(750 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 750,
	"currants"	: 500,
	"mood"		: 100
};

//log.info("betterlearning_spend_huge_favor.js LOADED");

// generated ok (NO DATE)
