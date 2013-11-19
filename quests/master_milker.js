var title = "Master Milker ";
var desc = "Milk 7 butterflies. Hint: This task is a lot easier if you have butterfly lotion and the Butterfly Whisperer achievement.";
var offer = "Hey. Kid. I've got a proposition for you, but it's going to be a test of your charm, dexterity and stick-to-it-iveness. You in? <split butt_txt=\"I'm intrigued. Tell me more!\" \/>You know how to milk a <b>butterfly<\/b>, right? <split butt_txt=\"Um, huh?\" \/>Oh, jeez. This is going to be tougher than I thought. <split butt_txt=\"Tell me what I need to do!\" \/>Okay. So first you get yourself some <b>butterfly lotion<\/b>. Got that? <split butt_txt=\"Butterfly lotion?\" \/>Well, yeah. Of course. Butterflies chafe easily. So get yourself some lotion. <split butt_txt=\"No prob!\" \/>Wait! There's more. You're going to have to kinda charm the butterfly before you milk it. <split butt_txt=\"How do you charm a butterfly?\" \/>You'll figure it out. And then after you've milked the butterfly... <split butt_txt=\"Yes?\" \/>Milk 6 more. Have fun!";
var completion = "Well done, kid. Here's a little something for your trouble. <split butt_txt=\"Thanks!\" \/>You know what's even trickier than getting 7 vials of butterfly milk? <split butt_txt=\"No, what?\" \/>Getting 7 sticks of butterfly butter. But that's a job for another day.";


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
	"r84"	: {
		"type"		: "counter",
		"name"		: "butterflies_milked",
		"num"		: 7,
		"class_id"	: "npc_butterfly",
		"desc"		: "Butterflies Milked"
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
	xp = pc.stats_add_xp(round_to_5(1400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(800 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
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
	"xp"		: 1400,
	"currants"	: 800,
	"mood"		: 100
};

function onComplete_custom(pc){
	delete pc.butterflies_milked;
}

//log.info("master_milker.js LOADED");

// generated ok (NO DATE)
