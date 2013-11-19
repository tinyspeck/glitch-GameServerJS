var title = "Focus Pocus";
var desc = "Use a <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to tame your swirly thoughts and <b>Focus<\/b> your meditation to gain either 24 energy points or 24 mood points in one try.";
var offer = "How are you digging that <a href=\"event:item|focusing_orb\">Focusing Orb<\/a>, kid? <split butt_txt=\"It's nifty. \" \/>Really de-swirls the ol' noodle, it does. And you're ready to take the de-swirling to the next level. Try using the Orb again, this time <b>Focusing<\/b> your meditation on either your mood or your energy, and get 24 points in one or the other. <split butt_txt=\"I can do that?\" \/>You can do anything, chum. The only thing stopping you is you. <split butt_txt=\"Whoa.\" \/>Yeah. Ready?";
var completion = "That was some sweet Focused Meditating. You were really in the zone. <split butt_txt=\"I like the zone.\" \/>The zone is good. You know what else is good? This little reward I'm giving you. Just because I can.";


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
	"r160"	: {
		"type"		: "flag",
		"name"		: "meditation_24_mood_energy",
		"class_id"	: "focusing_orb",
		"desc"		: "Focus your meditation to gain 24 mood or energy"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("cosma", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 20
		}
	}
};

//log.info("focusedmeditation_get_mood_or_energy.js LOADED");

// generated ok (NO DATE)
