var type = 5;
var title = "Dirt Pile";
var desc = "This project is to create a Dirt Pile.";
var completion = "Congrats, you made a Dirt Pile!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1595"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 10,
		"base_cost"	: 3,
		"desc"		: "Add earth"
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

//log.info("job_cult_temp_dirt_pile.js LOADED");

// generated ok (NO DATE)
