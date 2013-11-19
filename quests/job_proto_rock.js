var type = 5;
var title = "Build a Rock";
var desc = "Build a Rock here.";
var completion = "You built a Rock here!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1374"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 30,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 30 needed!"
	},
	"r1375"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_blue",
		"num"		: 500,
		"base_cost"	: 0,
		"desc"		: "Contribute Blue Elements - 500 needed!"
	},
	"r1376"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_green",
		"num"		: 500,
		"base_cost"	: 0,
		"desc"		: "Contribute Green Elements - 500 needed!"
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

//log.info("job_proto_rock.js LOADED");

// generated ok (NO DATE)
