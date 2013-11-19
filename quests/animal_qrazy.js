var title = "Animal Q-razy";
var desc = "Take a picture that contains exactly  2 <a href=\"event:item|npc_chicken\">Chickens<\/a>, 3 <a href=\"event:item|npc_piggy\">Piggies<\/a> and 2 <a href=\"event:item|npc_butterfly\">Butterflies<\/a>.";
var offer = "Capturing things in motion - that's an art! <split butt_txt=\"I'll say.\" \/> Let's see if you can fine-tune your timing. Capture 2 <a href=\"event:item|npc_chicken\">Chickens<\/a>, 3 <a href=\"event:item|npc_piggy\">Piggies<\/a> and 2 <a href=\"event:item|npc_butterfly\">Butterflies<\/a> in one snap.<split butt_txt=\"Um.. ok? \" \/>Confidence, kid! It's all about confidence. Hint: your zoom might help!";
var completion = "See, that's what I'm talking 'bout<split butt_txt=\"Pretty snappy, huh?\" \/>Oof. Even I wouldn't make that pun. Here's your loot!";


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
var prereq_quests = ["snappy_explorer"];
var prerequisites = [];
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 500,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 200
		}
	}
};

//log.info("animal_qrazy.js LOADED");

// generated ok (NO DATE)
