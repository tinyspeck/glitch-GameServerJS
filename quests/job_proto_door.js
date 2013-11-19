var type = 5;
var title = "Build a New Floor";
var desc = "Build a new floor in your home!";
var completion = "You built a new floor in your home!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1487"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 100,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 100 needed!"
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

//log.info("job_proto_door.js LOADED");

// generated ok (NO DATE)
