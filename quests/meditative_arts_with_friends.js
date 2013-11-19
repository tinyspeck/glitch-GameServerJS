var title = "Multiply Your Meditation";
var desc = "Meditate simultaneously with 10 friends using your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a>.";
var offer = "As Cosma once muttered to herself, \"Achieving oneness with the universe sometimes requires eleven-ness.\" <split butt_txt=\"Eleven-ness?\" \/>Yes, the magic number at which meditation achieves its full potential!<split butt_txt=\"I...see.\" \/>It will please Cosma greatly if you can multiply your meditation by gathering 10 fellow Glitchen and meditating together. It's very important that you all meditate at the same time!<split butt_txt=\"Gotcha.\" \/>You'll each need your own <a href=\"event:item|focusing_orb\">Focusing Orb<\/a>, and a nice quiet place to gather and free your minds to ponder the meaning of life, the universe, and everything.";
var completion = "You feel a deep sense of peace and eleven-ness. <split butt_txt=\"Ah...I do.\" \/>You have made Cosma a very happy giant — if a giant could be said to feel an emotion as simplistic and corporeal as 'happy'.  In return for the great contentment you have brought her, she offers you all the following reward.";

var button_accept = "Om";

var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_multiplayer = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["meditativearts_meditate_for_time_period","focusedmeditation_get_mood_or_energy"];
var prerequisites = [{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"meditativearts_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r438"	: {
		"type"		: "flag",
		"name"		: "meditate_10players",
		"class_id"	: "focusing_orb",
		"desc"		: "Meditate with 10 players"
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("cosma", round_to_5(250 * multiplier));
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
	"mood"		: 50,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 250
		}
	}
};

//log.info("meditative_arts_with_friends.js LOADED");

// generated ok (NO DATE)
