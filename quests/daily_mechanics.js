var title = "A Day's Work";
var desc = "Do these things in a game day: Collect Imagination from the magic rock in your house; re-deal iMG upgrade cards; hit your daily quoin limit; reflect on an icon (tip: you might visit Home Streets of high level players to find an Icon).";
var offer = "Hey, kid. Ever feel when a day ends that there's something you forgot to do? <split butt_txt=\"All the time.\" \/> No more! I'll teach you a little routine that has been practiced since the dawn of imagination. <split butt_txt=\"I'm ready!\" \/> OK! Do these things in one game day, and the motivational reward will be yours. Go! <split butt_txt=\"What are they?\" \/>Oh - collect imagination from the rock, re-deal upgrade cards, hit your daily quoin limit, and lay your hands on someone else's icon. <split butt_txt=\"Where do I find an icon?\" \/>Visit the home streets of high level glitches.";
var completion = "Productive day, innit? <split butt_txt=\"I bet I forgot something.\" \/> No worries, there's always the next day. <split butt_txt=\"You mentioned motivational rewards?\" \/> Here!";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	4
}];
var end_npcs = [];
var locations = {};
var requirements = {};

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
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
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
	"mood"		: 50,
	"energy"	: 50
};

//log.info("daily_mechanics.js LOADED");

// generated ok (NO DATE)
