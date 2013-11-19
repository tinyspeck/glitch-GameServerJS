var type = 5;
var title = "Beryl Rock";
var desc = "This project is to create a Beryl Rock.";
var completion = "Congrats, you made a Beryl Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1620"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 1,
		"base_cost"	: 300,
		"desc"		: "Add crystals"
	},
	"r1621"	: {
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
		"base_cost"	: 12,
		"energy"	: 9,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Plant crystals"
	},
	"r1622"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_silvertongue",
		"num"		: 1,
		"base_cost"	: 283,
		"desc"		: "Add value"
	},
	"r1623"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_gandlevery",
		"num"		: 2,
		"base_cost"	: 181,
		"desc"		: "Add fortitude"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 500
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

//log.info("job_cult_beryl_rock_2.js LOADED");

// generated ok (NO DATE)
