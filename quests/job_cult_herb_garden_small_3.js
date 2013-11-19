var type = 5;
var title = "Small Herb Garden";
var desc = "This project is to create a Small Herb Garden.";
var completion = "Congrats, you made a Small Herb Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1801"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 16,
		"base_cost"	: 5,
		"desc"		: "Add planks"
	},
	"r1802"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet",
			"1"	: "class_axe"
		},
		"skill"		: "",
		"num"		: 15,
		"base_cost"	: 10,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Fence the area"
	},
	"r1803"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 24,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1804"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 6,
		"base_cost"	: 12,
		"desc"		: "Add peat"
	},
	"r1805"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 4,
		"base_cost"	: 10,
		"desc"		: "Add loam"
	},
	"r1806"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 11,
		"energy"	: 9,
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

//log.info("job_cult_herb_garden_small_3.js LOADED");

// generated ok (NO DATE)
