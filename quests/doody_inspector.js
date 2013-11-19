var title = "Doody Inspector ";
var desc = "Find and investigate 5 <a href=\"event:item|plop\">Piggy Plops<\/a>. Tip: you can make a Piggy plop by feeding it any <b>Crop<\/b> products (like potatoes, onions, broccoli, cabbage, corn, etc.)";
var offer = "Hey, kid! I've got a job for you. But I'll tell you right now: you're going to get your hands dirty. <split butt_txt=\"I dunno...\" \/>Let me tell you about the gig first. See, something's up with the <a href=\"event:item|npc_piggy\">Piggies<\/a>. <split butt_txt=\"Oh, yeah?\" \/>Yeah. And there's only one way to get to the bottom of it. <split butt_txt=\"Do tell.\" \/>You need to get out there and examine some <a href=\"event:item|plop\">Piggy Plop<\/a>. You may have to feed the Piggies to encourage them to do their doody. <split butt_txt=\"Ew!\" \/> Don't worry. Not only does Piggy Plop smell like fancy perfume, it also has powerful life-enhancing properties. <split butt_txt=\"Really?\" \/>No. But will you do it anyway?";
var completion = "That wasn't so bad now, was it, kid? For being a good sport, here's a bunch of currants and stuff. <split butt_txt=\"Thanks!\" \/>Don't mention it. Now go wash your hands. No offense, but you stink a little.";


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
	"r83"	: {
		"type"		: "counter",
		"name"		: "plops_inspected",
		"num"		: 5,
		"class_id"	: "plop",
		"desc"		: "Plops Examined"
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
	xp = pc.stats_add_xp(round_to_5(1200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(700 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 1200,
	"currants"	: 700,
	"mood"		: 100
};

//log.info("doody_inspector.js LOADED");

// generated ok (NO DATE)
