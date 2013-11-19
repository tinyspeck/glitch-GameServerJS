var type = 5;
var title = "Large Crop Garden";
var desc = "This project is to create a Large Crop Garden.";
var completion = "Congrats, you made a Large Crop Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1590"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 15,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1592"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 7,
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

//log.info("job_cult_temp_crop_garden_large.js LOADED");

// generated ok (NO DATE)
