var type = 5;
var title = "Small Herb Garden";
var desc = "This project is to create a Small Herb Garden.";
var completion = "Congrats, you made a Small Herb Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1601"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 4,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1606"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 2,
		"base_cost"	: 20,
		"desc"		: "Add guano"
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

//log.info("job_cult_temp_herb_garden_small.js LOADED");

// generated ok (NO DATE)
