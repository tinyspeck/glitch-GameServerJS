var type = 5;
var title = "Barnacle Pod";
var desc = "This project is to create a Barnacle Pod.";
var completion = "Congrats, you made a Barnacle Pod!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1614"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 16,
		"base_cost"	: 5,
		"desc"		: "Add planks"
	},
	"r1615"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet",
			"1"	: "class_axe"
		},
		"skill"		: "",
		"num"		: 15,
		"base_cost"	: 9,
		"energy"	: 7,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Fence the area"
	},
	"r1616"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cardamom",
		"num"		: 5,
		"base_cost"	: 12,
		"desc"		: "Spice it up"
	},
	"r1617"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 20,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1618"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle",
		"num"		: 3,
		"base_cost"	: 8,
		"desc"		: "Seed barnacles"
	},
	"r1619"	: {
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
		"base_cost"	: 11,
		"energy"	: 9,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix the earth"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(150 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 150
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

//log.info("job_cult_barnacle_pod_2.js LOADED");

// generated ok (NO DATE)
