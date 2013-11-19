var type = 5;
var title = "Finish the Garden";
var desc = "Finish the garden.";
var completion = "You finished the garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1373"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mabbish_coffee",
		"num"		: 10,
		"base_cost"	: 54,
		"desc"		: "Contribute Mabbish Coffees - 10 needed!"
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

//log.info("job_proto_garden2.js LOADED");

// generated ok (NO DATE)
