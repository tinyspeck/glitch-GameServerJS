var type = 5;
var title = "Beryl Rock";
var desc = "This project is to create a Beryl Rock.";
var completion = "Congrats, you made a Beryl Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1589"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "beryl",
		"num"		: 40,
		"base_cost"	: 6,
		"desc"		: "Add beryl rock"
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

//log.info("job_cult_temp_beryl_rock.js LOADED");

// generated ok (NO DATE)
