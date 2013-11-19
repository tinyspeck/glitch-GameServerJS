var type = 5;
var title = "Medium Herb Garden";
var desc = "This project is to create a Medium Herb Garden.";
var completion = "Congrats, you made a Medium Herb Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1600"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 8,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1605"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 4,
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

//log.info("job_cult_temp_herb_garden_medium.js LOADED");

// generated ok (NO DATE)
