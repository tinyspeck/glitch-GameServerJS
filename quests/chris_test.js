var title = "Chris Test Quest";
var desc = "A magical journey of testing.";
var offer = "OH HAI";
var completion = "U R WINNER, HA HA HA!";

var button_accept = "OH HAI";

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
	"r275"	: {
		"type"		: "counter",
		"name"		: "eat_spinach",
		"num"		: 1000,
		"class_id"	: "spinach",
		"desc"		: "Eat 1000 spinach"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"	: 1000
};

function onAccepted(pc){
	this.questInstanceLocation(pc, 'LMF1I2BEHS62BD5', 'magical_test', 0, 0, 5 * 60);
}

function onComplete_custom(pc){
	pc.instances_exit('magical_test');
}

function onEnterLocation(pc, location){
	location.quests_message_npc('piggy', 'set_hit_box', {x: 100, y: 100});
}

function onNpcCollision(pc, npc_name){
	log.info("NPC Collision!");
	if(npc_name == 'piggy') {
		this.sendLocationMessage('piggy', 'move_to_xy', {x: 0, y: -200, v: 100});
	}
}

//log.info("chris_test.js LOADED");

// generated ok (NO DATE)
