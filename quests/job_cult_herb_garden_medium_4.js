var type = 5;
var title = "Medium Herb Garden";
var desc = "This project is to create a Medium Herb Garden.";
var completion = "Congrats, you made a Medium Herb Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1833"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "board",
		"num"		: 8,
		"base_cost"	: 30,
		"desc"		: "Add boards"
	},
	"r1834"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 11,
		"energy"	: 9,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Fence the area"
	},
	"r1835"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 20,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1836"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 12,
		"base_cost"	: 12,
		"desc"		: "Add peat"
	},
	"r1837"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 14,
		"base_cost"	: 10,
		"desc"		: "Add loam"
	},
	"r1838"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "soil_appreciation_1",
		"num"		: 25,
		"base_cost"	: 17,
		"energy"	: 14,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix ingredients"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(600 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 600
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

//log.info("job_cult_herb_garden_medium_4.js LOADED");

// generated ok (NO DATE)
