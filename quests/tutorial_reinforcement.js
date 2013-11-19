var title = "A Little Tutorial Reinforcement";
var desc = "As a wise giant once said, repetition breeds love: go and find a <a href=\"event:item|npc_piggy\">Pig<\/a> to pet (then pet it), a <b>Tree<\/b> to water (then water it) and mark a destination on the  <a href=\"event:location|map\">Map<\/a>, and go to it.";
var offer = "As a wise giant once said, repetition breeds love: go and find a <a href=\"event:item|npc_piggy\">Pig<\/a> to pet (then pet it), a <b>Tree<\/b> to water (then water it) and mark a destination on the  <a href=\"event:location|map\">Map<\/a>, and go to it.";
var completion = "Well done with the Pig-petting, Tree-watering and Path-finding. You have proven that you are a great and noble instruction follower. This will prove a valuable skill.<split butt_txt=\"Hmpf.\" \/> Tut. The world thanks you for your efforts. Here's a lil something something for your trouble.";


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
	"r113"	: {
		"type"		: "counter",
		"name"		: "VERB:npc_piggy:pet",
		"num"		: 1,
		"class_id"	: "npc_piggy",
		"desc"		: "Pet a pig"
	},
	"r115"	: {
		"type"		: "counter",
		"name"		: "trees_watered",
		"num"		: 1,
		"class_id"	: "watering_can",
		"desc"		: "Water a tree"
	},
	"r284"	: {
		"type"		: "counter",
		"name"		: "map_dest_reached",
		"num"		: 1,
		"desc"		: "Reach a map destination"
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
	mood = pc.metabolics_add_mood(round_to_5(30 * multiplier));
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
	"mood"		: 30,
	"energy"	: 20
};

//log.info("tutorial_reinforcement.js LOADED");

// generated ok (NO DATE)
