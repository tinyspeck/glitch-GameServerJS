var title = "The World Through Ur Eyes";
var desc = "Create three <a href=\"event:item|teleportation_script\">Teleportation Scripts<\/a> for some of your favourite places in the world, and distribute them among strangers.";
var offer = "Close your eyes, little Glitchling. <split butt_txt=\"What, you mean…\" \/>  Have you closed them? They look like they're open. Close your inner eyes. The eyes beyond your Glitchly eyes. Are they closed? How can you still hear me? Look, just forget the eye thing. Just imagine your favourite places in all of Ur. Are you doing that? <split butt_txt=\"I'm trying…\" \/> Now, wouldn't it be nice to share those places with others? <split butt_txt=\"I guess?…\" \/> Yes. Yes it would.  So do it! With your newfound skill, some <a href=\"event:item|paper\">Paper<\/a> and a <a href=\"event:item|quill\">Quill<\/a>, write three <a href=\"event:item|teleportation_script\">Teleportation Scripts<\/a> to your favourite places in Ur, and hand them out to three different people. Share your love of the land, y'hear?";
var completion = "I say \"favourite places in Ur\", and you choose… Woah. Those? Really?!? <split butt_txt=\"What!?…\" \/> Don't get me wrong they're, y'know, lovely. Just. Um. Here! Here's a little reward - use it wisely. Have you thought about travel?";


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
	"r336"	: {
		"type"		: "counter",
		"name"		: "make_teleportation_script",
		"num"		: 3,
		"class_id"	: "teleportation_script",
		"desc"		: "Make three teleportation scripts"
	},
	"r337"	: {
		"type"		: "counter",
		"name"		: "give_teleportation_script",
		"num"		: 3,
		"class_id"	: "teleportation_script",
		"desc"		: "Give out three teleportation scripts"
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
	currants = pc.stats_add_currants(round_to_5(750 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(120 * multiplier));
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
	"currants"	: 750,
	"mood"		: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 120
		}
	}
};

//log.info("teleportation_make_and_hand_out_tp_scripts.js LOADED");

// generated ok (NO DATE)
