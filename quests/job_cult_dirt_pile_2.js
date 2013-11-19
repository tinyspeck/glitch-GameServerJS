var type = 5;
var title = "Dirt Pile";
var desc = "This project is to create a Dirt Pile.";
var completion = "Congrats, you made a Dirt Pile!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1643"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "gem_amber",
		"num"		: 1,
		"base_cost"	: 200,
		"desc"		: "Please the earth"
	},
	"r1644"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 10,
		"base_cost"	: 3,
		"desc"		: "Soilify"
	},
	"r1645"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 3,
		"base_cost"	: 10,
		"desc"		: "Add loam"
	},
	"r1646"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 15,
		"base_cost"	: 8,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix the urth"
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

//log.info("job_cult_dirt_pile_2.js LOADED");

// generated ok (NO DATE)
