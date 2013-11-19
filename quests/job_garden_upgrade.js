var type = 6;
var title = "Upgrade this Garden to an Herb Garden";
var desc = "Upgrade this garden to an Herb Garden";
var completion = "You upgraded this garden to an Herb Garden";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1377"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 50,
		"base_cost"	: 20,
		"desc"		: "Contribute Guano - 50 needed!"
	},
	"r1378"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "irrigator_9000",
		"class_ids"	: {
			"0"	: "irrigator_9000"
		},
		"skill"		: "gardening_5",
		"num"		: 100,
		"base_cost"	: 1,
		"energy"	: 0,
		"wear"		: 0,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 100 units needed with a Irrigator 9000 and Arborology V"
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

//log.info("job_garden_upgrade.js LOADED");

// generated ok (NO DATE)
