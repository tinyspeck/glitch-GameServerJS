var title = "One, Two, Tree, Four, Six, Eight";
var desc = "Harvest each of the eight different kinds of <b>Trees<\/b>, all in one game day.";
var offer = "Hey, kid. Do you know how many different kinds of <b>Trees<\/b> there are in the world? <split butt_txt=\"Sure do.\" \/> And? <split butt_txt=\"Oh. Well. Um.\" \/> Eight. There are eight kinds of Trees. <split butt_txt=\"I knew that.\" \/> Tell you what. Just to help you refresh your memory, I'm going to propose that you harvest each kind at least once within one game day. Pretty easy, right? <split butt_txt=\"Right!\" \/> Well, apart from maybe Wood Trees, they're a rare breed. But then, if you had one in your <b>back yard<\/b>, or knew someone who did… Not so hard, right? <split butt_txt=\"I can think of harder things.\" \/> Funny, that's what the wood tree said. Right. Go, kid! And if you do it, I've got something special for you, right here in my invisible left pocket.";
var completion = "Good work, bub. Now, quick! Tell me the names of all eight Trees that you harvested. In order! <split butt_txt=\"Oh! Um! Uh!\" \/> Just messing with you. Here's a little present, just for being such a sport.";


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
	"r205"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_egg",
		"num"		: 1,
		"class_id"	: "trant_egg",
		"desc"		: "Harvest an Egg Plant"
	},
	"r206"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_bean",
		"num"		: 1,
		"class_id"	: "trant_bean",
		"desc"		: "Harvest a Bean Tree"
	},
	"r207"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_bubble",
		"num"		: 1,
		"class_id"	: "trant_bubble",
		"desc"		: "Harvest a Bubble Tree"
	},
	"r208"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_fruit",
		"num"		: 1,
		"class_id"	: "trant_fruit",
		"desc"		: "Harvest a Fruit Tree"
	},
	"r209"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_gas",
		"num"		: 1,
		"class_id"	: "trant_gas",
		"desc"		: "Harvest a Gas Plant"
	},
	"r210"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_trant_spice",
		"num"		: 1,
		"class_id"	: "trant_spice",
		"desc"		: "Harvest a Spice Plant"
	},
	"r256"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_wood_tree",
		"num"		: 1,
		"class_id"	: "wood_tree",
		"desc"		: "Harvest a Wood Tree"
	},
	"r257"	: {
		"type"		: "counter",
		"name"		: "trant_harvest_paper_tree",
		"num"		: 1,
		"class_id"	: "paper_tree",
		"desc"		: "Harvest a Paper Tree"
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
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(35 * multiplier));
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
	"xp"		: 350,
	"currants"	: 225,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 35
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('gardening_harvest_all_trees_in_time_period');
}

function onStarted(pc){
	pc.buffs_apply('gardening_harvest_all_trees_in_time_period');
	
	return { ok: 1 };
}

//log.info("gardening_harvest_all_trees_in_time_period.js LOADED");

// generated ok (NO DATE)
