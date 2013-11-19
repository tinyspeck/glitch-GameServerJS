var title = "Go Jump in a Hole";
var desc = "Go find <a href=\"event:location|56#LLI2VDR4JRD1AEG\">The Great Hole to Ix<\/a> and ... jump in!";
var offer = "Go find <a href=\"event:location|56#LLI2VDR4JRD1AEG\">The Great Hole to Ix<\/a> and ... jump in!";
var completion = "Jolly good! Someone told you to jump in a hole, and you did! Now that's ... <split butt_txt=\"Courage?\" \/>No, no ... it's, um ...<split butt_txt=\"Gumption?\" \/>Yeah, not that either. It's more like ... <split butt_txt=\"Blind Obedience?\" \/>Yes. Yes. And it's nothing to be ashamed of. Here's your reward.";


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
	"r111"	: {
		"type"		: "flag",
		"name"		: "find_ix_hole",
		"desc"		: "Find the hole to Ix"
	},
	"r112"	: {
		"type"		: "flag",
		"name"		: "find_groddle_ladder",
		"desc"		: "Jump in"
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
	xp = pc.stats_add_xp(round_to_5(150 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 200,
	"mood"		: 50,
	"energy"	: 20
};

function onAccepted(pc){
	if (pc.location.tsid == 'LM410EP19KL55' || pc.location.tsid == 'LLI2VDR4JRD1AEG'){
		// hole to ix
		this.set_flag(pc, 'find_ix_hole');
	}
}

//log.info("jump_in_hole.js LOADED");

// generated ok (NO DATE)
