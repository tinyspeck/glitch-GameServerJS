var title = "The Ultimate Smoothie, part 2";
var desc = "You'll need to find some more ingredients. A little <a href=\"event:item|wavy_gravy\">gravy<\/a>, infused with a <a href=\"event:item|pickle\">home-made pickle<\/a>. This drink is going to blow your socks off.";
var offer = "Something's not quite right - it's going to need a little something something.";
var completion = "Perfect! A Gravy-Pickle infusion is just what's called for.";


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
var prereq_quests = ["ultimate_smoothie_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r379"	: {
		"type"		: "item",
		"class_id"	: "wavy_gravy",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect some Wavy Gravy"
	},
	"r380"	: {
		"type"		: "item",
		"class_id"	: "pickle",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Pickle"
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
	pc.quests_offer('ultimate_smoothie_3', true);
}

//log.info("ultimate_smoothie_2.js LOADED");

// generated ok (NO DATE)
