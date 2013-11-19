var type = 5;
var title = "Barnacle Pod";
var desc = "This project is to create a Barnacle Pod.";
var completion = "Congrats, you made a Barnacle Pod!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1588"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle",
		"num"		: 12,
		"base_cost"	: 8,
		"desc"		: "Add barnacles"
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

//log.info("job_cult_temp_barnacle_pod.js LOADED");

// generated ok (NO DATE)
