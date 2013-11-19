var title = "The Ultimate Smoothie";
var desc = "We'll need to start simple - bring me some <a href=\"event:item|milk_butterfly\">milk<\/a>, <a href=\"event:item|plum\">plums<\/a> and <a href=\"event:item|strawberry\">strawberries<\/a>.";
var offer = "Listen up, I have an idea. We're going to make the best drink you can imagine. You in?";
var completion = "Good job. Let me just whisk these up and...";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
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
	"r381"	: {
		"type"		: "item",
		"class_id"	: "plum",
		"num"		: 3,
		"remove"	: 1,
		"desc"		: "Collect 3 Plums"
	},
	"r382"	: {
		"type"		: "item",
		"class_id"	: "strawberry",
		"num"		: 2,
		"remove"	: 1,
		"desc"		: "Collect 2 Strawberries"
	},
	"r383"	: {
		"type"		: "item",
		"class_id"	: "milk_butterfly",
		"num"		: 6,
		"remove"	: 1,
		"desc"		: "Collect 6 Butterfly Milks"
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
	xp = pc.stats_add_xp(round_to_5(10 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"	: 10
};

function onComplete_custom(pc){
	pc.quests_offer('ultimate_smoothie_2', true);
}

//log.info("ultimate_smoothie_1.js LOADED");

// generated ok (NO DATE)
