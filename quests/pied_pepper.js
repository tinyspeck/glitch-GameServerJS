var title = "The Pied Pepper";
var desc = "Show tribute to our Zilloweeny ancestor by backing oodles of pie, dropping them off and then paying tribute.";
var offer = "Hey kid, you know that tale of the Pied Piper right?<split butt_txt=\"Sure\" \/>Well I bet you've never heard of the guy who baked all those pies!<split butt_txt=\"I don't think that's the story...\" \/>Kid, you wouldn't be here if that man didn't bake his little heart out every Zilloween! Think of all the mice that got to dance!<split butt_txt=\"Yah... YAH! THE MICE!\" \/>Let's pay a little tribute to him, what do you say?<split butt_txt=\"Sounds like something I could get behind!\" \/>Good! I want you to bake 10 pies, and deliver them to 10 places. Once you are done, sprinkle some pepper on that place that has water for rememberance.<split butt_txt=\"Kindda getting choked up\" \/>It's alright kid, you're doing that pie maker proud. FOR THE DANCING MICE!";
var completion = "It's beautiful kid, just beautiful. The way that pepper floats on the water brings a tear to my eye and a runny nose. Probably because I sniffed it. Makes you feel good don't it?! Zille is very pleased.";

var button_accept = "FOR THE MICE!";

var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var hide_questlog = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	80
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r435"	: {
		"type"		: "make",
		"recipe_id"	: 227,
		"num"		: 10,
		"desc"		: "Make 10 x Pumpkin Pie"
	},
	"r436"	: {
		"type"		: "item",
		"class_id"	: "pepper",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Sprinkle on the water"
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
	mood = pc.metabolics_add_mood(round_to_5(1000 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(500 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"mood"	: 1000,
	"favor"	: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 500
		}
	}
};

//log.info("pied_pepper.js LOADED");

// generated ok (NO DATE)
