var type = 5;
var title = "Patch";
var desc = "This project is to create a Patch.";
var completion = "Congrats, you made a Patch!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1607"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 40,
		"base_cost"	: 1,
		"desc"		: "Add beans"
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

//log.info("job_cult_temp_patch.js LOADED");

// generated ok (NO DATE)
