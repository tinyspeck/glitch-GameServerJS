var type = 5;
var title = "Metal Rock";
var desc = "This project is to create a Metal Rock.";
var completion = "Congrats, you made a Metal Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1603"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_rock",
		"num"		: 40,
		"base_cost"	: 3,
		"desc"		: "Add metal rocks"
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

//log.info("job_cult_temp_metal_rock.js LOADED");

// generated ok (NO DATE)
