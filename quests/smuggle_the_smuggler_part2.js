var title = "Smuggle the Smuggler II";
var desc = "Figure out a way to release the Smuggler from prison.";
var offer = "That contraband was planted on me by those agents of the Rook, the Deimaginators. All in a ploy to destroy imagination in the name of &#34;freedom&#34;. Puh, I say!<split butt_txt=\"Well then what say we freedom ourselves out of here? That sounded better in my head.\" \/>Good luck finding a way out. I've been looking for a way since I got here.<split butt_txt=\"You can count on me.\" \/>";
var completion = "That's a mighty fine hole you dug yourself there.<split butt_txt=\"I thought so.\" \/>";


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
var prereq_quests = ["smuggle_the_smuggler_part1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r376"	: {
		"type"		: "counter",
		"name"		: "'VERB:'+patch+':'+dig",
		"num"		: 1,
		"class_id"	: "shovel",
		"desc"		: "Dig your way out."
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
}
var rewards = {};

//log.info("smuggle_the_smuggler_part2.js LOADED");

// generated ok (NO DATE)
