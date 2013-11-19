var title = "Day of the Undead Butlers";
var desc = "Say \"zombie\" to 31 butlers in one game day.";
var offer = "Some people think the butlers are creepy. Well, I KNOW they're creepy.<split butt_txt=\"I think butlers are cute!\" \/>Well, ok, we can agree to differ on that. But anyway, I want you to make them creepier.<split butt_txt=\"How?\" \/>Go find 31 different butlers and give them a craving for brains. By which I mean, say the word \"zombie\" to each butler. (\"Chat\" to the butler to open an IM window.) <split butt_txt=\"Can do.\" \/> Not so fast, Buffy. <split butt_txt=\"I thought you said zombies, not vampires.\" \/> Whatever. It's all undead to me. Here's the catch: you have to do it all in one single game day.";
var completion = "Woah, the zombie apocalypse happened, and you caused it. Let's drink to braains!";

var button_accept = "Braains!";

var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
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
	"r434"	: {
		"type"		: "counter",
		"name"		: "butlers_zombied",
		"num"		: 31,
		"class_id"	: "bag_butler",
		"desc"		: "Increment counter butlers_zombied to 31"
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
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("wine_of_the_dead", 1);
}
var rewards = {
	"items"	: {
		"0"	: {
			"class_tsid"	: "wine_of_the_dead",
			"label"		: "Wine of the Dead",
			"count"		: 1
		}
	}
};

//log.info("butler_zombies.js LOADED");

// generated ok (NO DATE)
