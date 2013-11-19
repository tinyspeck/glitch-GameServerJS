var type = 5;
var title = "Tower Floor 9";
var desc = "This project is to add the ninth floor to your Tower.";
var completion = "Congrats, your Tower now has 9 floors!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1720"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "wall_segment",
		"num"		: 8,
		"base_cost"	: 2500,
		"desc"		: "Add wall segments"
	},
	"r1726"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 160,
		"base_cost"	: 150,
		"desc"		: "Add Urth blocks"
	},
	"r1732"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "girder",
		"num"		: 32,
		"base_cost"	: 1500,
		"desc"		: "Add girders"
	},
	"r1756"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "snail",
		"num"		: 24,
		"base_cost"	: 10,
		"desc"		: "Use snails"
	},
	"r1738"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 55,
		"base_cost"	: 23,
		"energy"	: 20,
		"wear"		: 2,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Construct the next floor"
	},
	"r1744"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "beam",
		"num"		: 16,
		"base_cost"	: 800,
		"desc"		: "Add beams"
	},
	"r1750"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_post",
		"num"		: 32,
		"base_cost"	: 400,
		"desc"		: "Add metal bars"
	},
	"r1762"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "string",
		"num"		: 371,
		"base_cost"	: 53,
		"desc"		: "String it up"
	},
	"r1813"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 1,
		"base_cost"	: 500,
		"desc"		: "Employ a permit"
	},
	"r1768"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "",
		"num"		: 55,
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

//log.info("job_tower_floor_9.js LOADED");

// generated ok (NO DATE)
