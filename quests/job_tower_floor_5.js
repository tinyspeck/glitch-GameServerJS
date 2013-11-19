var type = 5;
var title = "Tower Floor 5";
var desc = "This project is to add the fifth floor to your Tower.";
var completion = "Congrats, your Tower now has 5 floors!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1716"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "wall_segment",
		"num"		: 8,
		"base_cost"	: 2500,
		"desc"		: "Add wall segments"
	},
	"r1722"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 80,
		"base_cost"	: 150,
		"desc"		: "Add Urth blocks"
	},
	"r1728"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "girder",
		"num"		: 16,
		"base_cost"	: 1500,
		"desc"		: "Add girders"
	},
	"r1752"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "snail",
		"num"		: 24,
		"base_cost"	: 10,
		"desc"		: "Use snails"
	},
	"r1734"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 35,
		"base_cost"	: 23,
		"energy"	: 20,
		"wear"		: 2,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Construct the next floor"
	},
	"r1740"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "beam",
		"num"		: 8,
		"base_cost"	: 800,
		"desc"		: "Add beams"
	},
	"r1746"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_post",
		"num"		: 16,
		"base_cost"	: 400,
		"desc"		: "Add metal bars"
	},
	"r1758"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "string",
		"num"		: 159,
		"base_cost"	: 53,
		"desc"		: "String it up"
	},
	"r1809"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 1,
		"base_cost"	: 500,
		"desc"		: "Employ a permit"
	},
	"r1764"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "",
		"num"		: 35,
		"base_cost"	: 23,
		"energy"	: 20,
		"wear"		: 2,
		"verb_name"	: "elevate",
		"verb_past"	: "elevated",
		"desc"		: "Elevate the floor"
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

//log.info("job_tower_floor_5.js LOADED");

// generated ok (NO DATE)
