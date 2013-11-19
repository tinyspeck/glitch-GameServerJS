var title = "Like a Good Neighbor";
var desc = "Tend to 11 resources on your neighbors' home streets.";
var offer = "There's something to be said for solitude, but you're not going to get very far very quickly on your own.<split butt_txt=\"I was afraid of that\" \/>Don't worry, I promise it's painless. Though there is some work involved.<split butt_txt=\"This keeps getting better.\" \/>All you gotta do is add some neighbors to that signpost over there, visit their home streets, and tend 11 of their resources.";
var completion = "Well, aren't you a friendly citizen of Ur? A good deed is its own reward, so...<split butt_txt=\"[awkward silence]\" \/>Oh, fine, here's a little something!";


var auto_complete = 0;
var familiar_turnin = 0;
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
var end_npcs = ["magic_rock"];
var locations = {};
var requirements = {
	"r373"	: {
		"type"		: "counter",
		"name"		: "neighbors_resources_tended",
		"num"		: 11,
		"class_id"	: "sign_stake",
		"desc"		: "Tend 11 Resources"
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
	mood = pc.metabolics_add_mood(round_to_5(500 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 150,
	"mood"	: 500
};

//log.info("good_neighbor.js LOADED");

// generated ok (NO DATE)
