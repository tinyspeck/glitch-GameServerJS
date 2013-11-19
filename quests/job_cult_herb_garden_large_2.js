var type = 5;
var title = "Large Herb Garden";
var desc = "This project is to create a Large Herb Garden.";
var completion = "Congrats, you made a Large Herb Garden!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1657"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "board",
		"num"		: 12,
		"base_cost"	: 30,
		"desc"		: "Add boards"
	},
	"r1658"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "",
		"num"		: 25,
		"base_cost"	: 14,
		"energy"	: 12,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Fence the area"
	},
	"r1659"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 75,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1660"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 22,
		"base_cost"	: 12,
		"desc"		: "Add peat"
	},
	"r1661"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 15,
		"base_cost"	: 20,
		"desc"		: "Add guano"
	},
	"r1662"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plop",
		"num"		: 1,
		"base_cost"	: 0,
		"desc"		: "Add plop"
	},
	"r1663"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "soil_appreciation_2",
		"num"		: 30,
		"base_cost"	: 22,
		"energy"	: 18,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix ingredients"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(1000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 1000
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

//log.info("job_cult_herb_garden_large_2.js LOADED");

// generated ok (NO DATE)
