var title = "Give some H2O love";
var desc = "<b>Trees<\/b> like water. Go ahead and spread some liquid love by watering 5 Trees.";
var offer = "Now that you have a  <a href=\"event:item|watering_can\">Watering Can<\/a> and skill with plants, could you please go and water 5 <b>Trees<\/b>? <split butt_txt=\"Sure, I can do that.\" \/> Fantastic, kid. Some of them are quite thirsty!";
var completion = "Job well done! Your thumbs are getting even greener.";


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
var prereq_quests = ["lightgreenthumb_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r59"	: {
		"type"		: "counter",
		"name"		: "trees_watered",
		"num"		: 5,
		"class_id"	: "watering_can",
		"desc"		: "Water trees"
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
	xp = pc.stats_add_xp(round_to_5(175 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 175,
	"currants"	: 50,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 10
		}
	}
};

//log.info("lightgreenthumb_water_trees.js LOADED");

// generated ok (NO DATE)
