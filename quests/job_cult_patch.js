var type = 5;
var title = "Patch";
var desc = "This project is to create a Patch.";
var completion = "Congrats, you made a Patch!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1503"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 20,
		"base_cost"	: 1,
		"desc"		: "Add beans"
	},
	"r1504"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "all_spice",
		"num"		: 20,
		"base_cost"	: 3,
		"desc"		: "Add spice"
	},
	"r1506"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe",
			"1"	: "high_class_hoe"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 6,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "tend",
		"verb_past"	: "tended",
		"desc"		: "Cultivate"
	},
	"r1508"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_vapour",
		"num"		: 30,
		"base_cost"	: 5,
		"desc"		: "Add gasses"
	},
	"r1610"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_bubble",
		"num"		: 30,
		"base_cost"	: 2,
		"desc"		: "Add bubbles"
	},
	"r1510"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can",
			"1"	: "irrigator_9000"
		},
		"skill"		: "",
		"num"		: 25,
		"base_cost"	: 7,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "irrigate",
		"verb_past"	: "irrigated",
		"desc"		: "Irrigate"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(200 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 200
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 0;
var performance_rewards = {};

//log.info("job_cult_patch.js LOADED");

// generated ok (NO DATE)
