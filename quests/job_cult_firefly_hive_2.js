var type = 5;
var title = "Firefly Hive";
var desc = "This project is to create a Firefly Hive.";
var completion = "Congrats, you made a Firefly Hive!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1650"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 16,
		"base_cost"	: 5,
		"desc"		: "Provide planks"
	},
	"r1651"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 15,
		"base_cost"	: 7,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Fence the area"
	},
	"r1652"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 1,
		"base_cost"	: 300,
		"desc"		: "Implant a crystal"
	},
	"r1653"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "black_pepper",
		"num"		: 7,
		"base_cost"	: 4,
		"desc"		: "Add an essential spice"
	},
	"r1654"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "camphor",
		"num"		: 4,
		"base_cost"	: 20,
		"desc"		: "Add the second essential spice"
	},
	"r1655"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "turmeric",
		"num"		: 5,
		"base_cost"	: 12,
		"desc"		: "Add the final essential spice"
	},
	"r1656"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 8,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix the earth"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(350 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 350
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

//log.info("job_cult_firefly_hive_2.js LOADED");

// generated ok (NO DATE)
