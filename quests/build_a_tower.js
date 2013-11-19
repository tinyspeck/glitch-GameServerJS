var title = "Build a Tower";
var desc = "Clear some space, cultivate a Tower, gather the requirements, and finish the project.";
var offer = "That's some darned fine building you've been doing, lil' Glitch. Your daddy a Mason or something?<split butt_txt=\"What's a Mason?\" \/>I dunno, was hoping you would know. I saw it in a movie once.<split butt_txt=\"What's a movie?\" \/>Sigh... <b>Anyway<\/b>! The next thing you should build is a tower. A tower is a public building on your home street that you can decorate and show off to other players. Sounds awesome, right? Wanna do it?<split butt_txt=\"Of course.\" \/>Alright, good. Go to your home street and Cultivate a Tower to get started.";
var completion = "Bigger, bigger, yeahhhhhhh. That looks so good, and you can make it even taller now! Here's a little something to get you started.";


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
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	18
},{
		"not"		:0,
		"condition":	"custom_code",
		"value":	function(pc, quest){return !pc.getTower();}
}];
var end_npcs = ["magic_rock"];
var locations = {};
var requirements = {
	"r388"	: {
		"type"		: "flag",
		"name"		: "cultivate_tower",
		"class_id"	: "magic_rock",
		"desc"		: "Cultivate a Tower"
	},
	"r389"	: {
		"type"		: "flag",
		"name"		: "build_tower",
		"class_id"	: "furniture_tower_chassis",
		"desc"		: "Finish the Tower Project"
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
	currants = pc.stats_add_currants(round_to_5(2000 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 2000,
	"energy"	: 200
};

function canOffer(pc){
	return false;
}

function onCreate(pc){
	var exterior = pc.houses_get_external_street();
	if (exterior && exterior.cultivation_count_items('proto_furniture_tower_chassis')) pc.quests_set_flag('cultivate_tower');
}

//log.info("build_a_tower.js LOADED");

// generated ok (NO DATE)
