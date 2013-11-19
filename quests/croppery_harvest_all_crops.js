var title = "Crops a-Planty";
var desc = "Harvest at least one each of the 12 <b>Crops<\/b> in your <b>Garden<\/b> or in a <b>Community Garden<\/b>. Important: You can cultivate a Crop Garden in your yard or home street.";
var offer = "Hay there. <split butt_txt=\"What?\" \/>Hay there. My attempt at rustic humor. <split butt_txt=\"I see.\" \/> I've noticed you have a knack for growing stuff, and stuff. <split butt_txt=\"Soil, seeds and water. Easy-peasy.\" \/>Harvest at least one of each of the 12 <b>Crops<\/b>, and there might be a little something extra in it for you, my grubby little dirt pirate.";
var completion = "Well, lookee who's harvested all 12 Crops. I could just eat you up. <split butt_txt=\"Yay!\" \/>Actually, come to think of it, I could eat you up. <split butt_txt=\"Oh.\" \/>But I mean it figuratively this time. <split butt_txt=\"Hooray!\" \/>Here's a little something compensatory for your troubles. Feel free to spend it all in one place.";


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
	"r142"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_broccoli",
		"num"		: 1,
		"class_id"	: "broccoli",
		"desc"		: "Harvest some Broccoli"
	},
	"r143"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_cabbage",
		"num"		: 1,
		"class_id"	: "cabbage",
		"desc"		: "Harvest some Cabbage"
	},
	"r144"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_carrot",
		"num"		: 1,
		"class_id"	: "carrot",
		"desc"		: "Harvest some Carrots"
	},
	"r145"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_corn",
		"num"		: 1,
		"class_id"	: "corn",
		"desc"		: "Harvest some Corn"
	},
	"r146"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_cucumber",
		"num"		: 1,
		"class_id"	: "cucumber",
		"desc"		: "Harvest some Cucumber"
	},
	"r149"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_onion",
		"num"		: 1,
		"class_id"	: "onion",
		"desc"		: "Harvest some Onion"
	},
	"r150"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_potato",
		"num"		: 1,
		"class_id"	: "potato",
		"desc"		: "Harvest some Potato"
	},
	"r152"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_rice",
		"num"		: 1,
		"class_id"	: "rice",
		"desc"		: "Harvest some Rice"
	},
	"r153"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_spinach",
		"num"		: 1,
		"class_id"	: "spinach",
		"desc"		: "Harvest some Spinach"
	},
	"r154"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_tomato",
		"num"		: 1,
		"class_id"	: "tomato",
		"desc"		: "Harvest some Tomato"
	},
	"r156"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_zucchini",
		"num"		: 1,
		"class_id"	: "zucchini",
		"desc"		: "Harvest some Zucchini"
	},
	"r272"	: {
		"type"		: "counter",
		"name"		: "garden_harvest_parsnip",
		"num"		: 1,
		"class_id"	: "parsnip",
		"desc"		: "Harvest some Parsnips"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(325 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"currants"	: 325,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 50
		}
	}
};

//log.info("croppery_harvest_all_crops.js LOADED");

// generated ok (NO DATE)
