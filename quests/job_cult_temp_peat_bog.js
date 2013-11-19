var type = 5;
var title = "Peat Bog";
var desc = "This project is to create a Peat Bog.";
var completion = "Congrats, you made a Peat Bog!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1608"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 12,
		"base_cost"	: 12,
		"desc"		: "Add peat"
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

//log.info("job_cult_temp_peat_bog.js LOADED");

// generated ok (NO DATE)
