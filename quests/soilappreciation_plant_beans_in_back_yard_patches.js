var title = "Lord of the Beans";
var desc = "Plant two <b>Seasoned Beans<\/b> in your very own yard of your very own house.";
var offer = "Hey there, chief. I have a job for you if you're not terribly busy. <split butt_txt=\"I can fit it in.\" \/> Good, good. I need you to plant not one but two <b>Seasoned Beans<\/b>. But not in just any old patch. It has to be in your own little patch of paradise. You'll need to buy a house if you don't own one already. Okay?";
var completion = "I spy, with my wee eyes, two Seasoned Beans planted snug in the ground. Bravo. Here's a little something to plant in your pocketses.";


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
	"r216"	: {
		"type"		: "counter",
		"name"		: "pol_beans_planted",
		"num"		: 2,
		"class_id"	: "patch",
		"desc"		: "Plant two <b>Beans<\/b>"
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
	xp = pc.stats_add_xp(round_to_5(350 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(225 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(35 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 350,
	"currants"	: 225,
	"mood"		: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 35
		}
	}
};

//log.info("soilappreciation_plant_beans_in_back_yard_patches.js LOADED");

// generated ok (NO DATE)
