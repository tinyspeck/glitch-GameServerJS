var type = 5;
var title = "Firefly Hive";
var desc = "This project is to create a Firefly Hive.";
var completion = "Congrats, you made a Firefly Hive!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1598"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 5,
		"base_cost"	: 10,
		"desc"		: "Add loam"
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

//log.info("job_cult_temp_firefly_hive.js LOADED");

// generated ok (NO DATE)
