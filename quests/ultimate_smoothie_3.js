var title = "The Ultimate Smoothie, part 3";
var desc = "It needs a little sweetening. Grab these last ingredients, <a href=\"event:item|honey\">honey<\/a> and <a href=\"event:item|camphor\">camphor<\/a>, and we'll be golden.";
var offer = "Tasty! But still not quite there. I think I know what it's missing.";
var completion = "BAM! Mix in the Camphor and it'll be perfect...\r\n<split butt_txt=\"Ok\" \/>\r\nUrgh. This is actually pretty gross. I'll give you some currants if you keep quiet and pretend this never happened.";


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
var prereq_quests = ["ultimate_smoothie_2"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r377"	: {
		"type"		: "item",
		"class_id"	: "honey",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect some Honey"
	},
	"r378"	: {
		"type"		: "item",
		"class_id"	: "camphor",
		"num"		: 16,
		"remove"	: 1,
		"desc"		: "Collect 16 Camphor"
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
	currants = pc.stats_add_currants(round_to_5(10 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 10,
	"currants"	: 10
};

//log.info("ultimate_smoothie_3.js LOADED");

// generated ok (NO DATE)
