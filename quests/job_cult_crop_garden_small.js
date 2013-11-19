var type = 5;
var title = "Small Crop Garden";
var desc = "This project is to create a Small Crop Garden.";
var completion = "Congrats, you made a Small Crop Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1540"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 16,
		"base_cost"	: 5,
		"desc"		: "Add planks"
	},
	"r1552"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet",
			"1"	: "class_axe"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 8,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Fence the area"
	},
	"r1558"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 24,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1559"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 6,
		"base_cost"	: 12,
		"desc"		: "Add peat"
	},
	"r1570"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 4,
		"base_cost"	: 20,
		"desc"		: "Add guano"
	},
	"r1582"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 30,
		"base_cost"	: 8,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix ingredients"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(250 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 250
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 0;
var performance_rewards = {};

//log.info("job_cult_crop_garden_small.js LOADED");

// generated ok (NO DATE)
