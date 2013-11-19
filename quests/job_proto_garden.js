var type = 5;
var title = "Create a Garden";
var desc = "Build a garden!";
var completion = "You built a garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1369"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 50,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 50 needed!"
	},
	"r1370"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 10,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 10 needed!"
	},
	"r1371"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 25,
		"base_cost"	: 20,
		"desc"		: "Contribute Guano - 25 needed!"
	},
	"r1372"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "irrigator_9000",
		"class_ids"	: {
			"0"	: "irrigator_9000"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 100,
		"base_cost"	: 4,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 100 units needed with a Irrigator 9000 and Soil Appreciation III"
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

//log.info("job_proto_garden.js LOADED");

// generated ok (NO DATE)
