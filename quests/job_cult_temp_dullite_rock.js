var type = 5;
var title = "Dullite Rock";
var desc = "This project is to create a Dullite Rock.";
var completion = "Congrats, you made a Dullite Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1597"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "dullite",
		"num"		: 40,
		"base_cost"	: 4,
		"desc"		: "Add dullite"
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

//log.info("job_cult_temp_dullite_rock.js LOADED");

// generated ok (NO DATE)
