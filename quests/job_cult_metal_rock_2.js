var type = 5;
var title = "Metal Rock";
var desc = "This project is to create a Metal Rock.";
var completion = "Congrats, you made a Metal Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1682"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 2,
		"base_cost"	: 300,
		"desc"		: "Add a crystal"
	},
	"r1683"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick",
			"1"	: "pick"
		},
		"skill"		: "mining_1",
		"num"		: 20,
		"base_cost"	: 13,
		"energy"	: 10,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Plant the crystal"
	},
	"r1684"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "krazy_salts",
		"num"		: 3,
		"base_cost"	: 111,
		"desc"		: "Add salts"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(600 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 600
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

//log.info("job_cult_metal_rock_2.js LOADED");

// generated ok (NO DATE)
