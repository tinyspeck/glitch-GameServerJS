var type = 5;
var title = "Tower Floor 8";
var desc = "This project is to add the eighth floor to your Tower.";
var completion = "Congrats, your Tower now has 8 floors!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1719"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "wall_segment",
		"num"		: 8,
		"base_cost"	: 2500,
		"desc"		: "Add wall segments"
	},
	"r1725"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 140,
		"base_cost"	: 150,
		"desc"		: "Add Urth blocks"
	},
	"r1731"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "girder",
		"num"		: 28,
		"base_cost"	: 1500,
		"desc"		: "Add girders"
	},
	"r1755"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "snail",
		"num"		: 24,
		"base_cost"	: 10,
		"desc"		: "Use snails"
	},
	"r1737"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 50,
		"base_cost"	: 23,
		"energy"	: 20,
		"wear"		: 2,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Construct the next floor"
	},
	"r1743"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "beam",
		"num"		: 14,
		"base_cost"	: 800,
		"desc"		: "Add beams"
	},
	"r1749"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_post",
		"num"		: 28,
		"base_cost"	: 400,
		"desc"		: "Add metal bars"
	},
	"r1761"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "string",
		"num"		: 318,
		"base_cost"	: 53,
		"desc"		: "String it up"
	},
	"r1812"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 1,
		"base_cost"	: 500,
		"desc"		: "Employ a permit"
	},
	"r1767"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "",
		"num"		: 50,
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

//log.info("job_tower_floor_8.js LOADED");

// generated ok (NO DATE)
