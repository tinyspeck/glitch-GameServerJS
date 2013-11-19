var title = "The Unbearable Lightness of Bean";
var desc = "Plant at least one <b>Seasoned Bean<\/b> (the kind that can grow there) in three different regions.";
var offer = "Let me plant an idea in that fertile little mind of yours. <split butt_txt=\"Go.\" \/> Nature can handle itself, but it never hurts to give it a hand sometimes, pollination-wise. You in? <split butt_txt=\"I don't know. Yes?\" \/> Good stuff. In the great tradition of itinerant gardeners and giant bees, I want you to go forth, to three different regions, and plant a <b>Seasoned Bean<\/b> in each… Bearing in mind, of course, that you can only plant certain kinds of beans in each region, my friend. <split butt_txt=\"Of course.\" \/> Remember: Different beans for different regions. Toodles!";
var completion = "You've been around the world and you-you-you-you, you have planted trees and I don't know why, but I just feel like giving you a special little something-something. Here you are, little honeybee.";


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
	"r279"	: {
		"type"		: "counter",
		"name"		: "hub_plant_beans",
		"num"		: 3,
		"class_id"	: "bean_bean",
		"desc"		: "Plant a Seasoned Bean in each of three different regions."
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(250 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(40 * multiplier));
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
	"xp"		: 400,
	"currants"	: 250,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 40
		}
	}
};

function onAccepted(pc){
	pc.hub_plant_beans_init();
}

function onComplete_custom(pc){
	pc.hub_plant_beans_end();
}

//log.info("soilappreciation_plant_beans_in_hubs.js LOADED");

// generated ok (NO DATE)
