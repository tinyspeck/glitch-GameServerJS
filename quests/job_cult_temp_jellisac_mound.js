var type = 5;
var title = "Jellisac Mound";
var desc = "This project is to create a Jellisac Mound.";
var completion = "Congrats, you made a Jellisac Mound!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1602"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "jellisac_clump",
		"num"		: 12,
		"base_cost"	: 9,
		"desc"		: "Add jellisacs"
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

//log.info("job_cult_temp_jellisac_mound.js LOADED");

// generated ok (NO DATE)
