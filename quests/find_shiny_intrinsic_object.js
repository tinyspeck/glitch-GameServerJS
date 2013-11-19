var title = "Seeker of the Shiny";
var desc = "Help find what Mr. Hairball lost. (Hint: Something smells cheesy.)";
var offer = "You know Mr. Hairball? <split butt_txt=\"The dustbunny?\" \/> Well, it seems he's lost something yet again ... more like 3 somethings. <split butt_txt=\"Oh my.\" \/> Search high and low and in every hole to find it.";
var completion = "You found all 3! I'll just take them and give it to Mr. Hairball for ya.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["de_embiggenify_part2"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r375"	: {
		"type"		: "counter",
		"name"		: "VERB:very_stinky_cheese:poke",
		"num"		: 3,
		"class_id"	: "cheese_very_stinky",
		"desc"		: "Poke 3 Very Stinky Cheese"
	},
	"r390"	: {
		"type"		: "item",
		"class_id"	: "small_worthless",
		"num"		: 3,
		"remove"	: 1,
		"desc"		: "Retrieved 3 Small shiny object with no intrinsic value"
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
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
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
	"xp"		: 150,
	"mood"		: 100,
	"energy"	: 200
};

//log.info("find_shiny_intrinsic_object.js LOADED");

// generated ok (NO DATE)
