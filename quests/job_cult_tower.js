var type = 5;
var title = "Tower";
var desc = "This project is to create a Tower.";
var completion = "Congrats, you made a Tower!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1701"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 20,
		"base_cost"	: 150,
		"desc"		: "Urthify the foundation"
	},
	"r1703"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 1,
		"base_cost"	: 500,
		"desc"		: "Employ a permit"
	},
	"r1704"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "snail",
		"num"		: 200,
		"base_cost"	: 10,
		"desc"		: "Add snails"
	},
	"r1814"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 28,
		"energy"	: 25,
		"wear"		: 2,
		"verb_name"	: "break ground",
		"verb_past"	: "broke ground",
		"desc"		: "Break ground"
	},
	"r1700"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "girder",
		"num"		: 4,
		"base_cost"	: 1500,
		"desc"		: "Block out foundation"
	},
	"r1702"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "wall_segment",
		"num"		: 16,
		"base_cost"	: 2500,
		"desc"		: "Put up walls"
	},
	"r1705"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 43,
		"energy"	: 40,
		"wear"		: 2,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Construct the tower"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 0;
var performance_rewards = {};

//log.info("job_cult_tower.js LOADED");

// generated ok (NO DATE)
