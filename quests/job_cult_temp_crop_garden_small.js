var type = 5;
var title = "Small Crop Garden";
var desc = "This project is to create a Small Crop Garden.";
var completion = "Congrats, you made a Small Crop Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1594"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 4,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1596"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 2,
		"base_cost"	: 20,
		"desc"		: "Add guano"
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

//log.info("job_cult_temp_crop_garden_small.js LOADED");

// generated ok (NO DATE)
