var title = "Loyalty's Rich Reward";
var desc = "Collect eleven Emblems of one Giant and <b>iconize<\/b> them to create a Giant's Icon.";
var offer = "Emblems, eh? Don't you just love them? Aren't they just the greatest? <split butt_txt=\"They're pretty shiny…\" \/> But are they the greatest? No. They are not. In the eyes of the Giants, they are merely the first step. It is time for you to progress. To the next step. Beyond the Emblem. And what's greater than an Emblem? <split butt_txt=\"Two Emblems?\" \/>Yes! More Emblems! Many Emblems! Choose a Giant, accumulate <b>eleven Emblems<\/b> for that Giant, and then… well, do what comes naturally. <split butt_txt=\"Do what comes na…\" \/> And by that I mean \"<b>iconize<\/b> the Emblems\", to make an Icon out of them, not anything weird. Get to it, my little Supplicant!";
var completion = "Oh, it's glorious. <split butt_txt=\"Why, thank you…\" \/> The adoration and munificent blessings of your Giant are enough, of course. But just in case, here's a little something from me, too.";

var button_accept = "Will do!";

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
	"r338"	: {
		"type"		: "counter",
		"name"		: "icons_created",
		"num"		: 1,
		"class_id"	: "icon_friendly",
		"desc"		: "Make an Icon of a Giant of your choice."
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
	xp = pc.stats_add_xp(round_to_5(5000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(400 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(400 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 5000,
	"mood"		: 400,
	"energy"	: 400
};

//log.info("create_giant_icon.js LOADED");

// generated ok (NO DATE)
