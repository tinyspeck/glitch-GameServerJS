var type = 5;
var title = "Sparkly Rock";
var desc = "This project is to create a Sparkly Rock.";
var completion = "Congrats, you made a Sparkly Rock!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1488"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 2,
		"base_cost"	: 300,
		"desc"		: "Add crystals"
	},
	"r1489"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick",
			"1"	: "pick"
		},
		"skill"		: "mining_1",
		"num"		: 30,
		"base_cost"	: 11,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Plant crystals"
	},
	"r1490"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_rookswort",
		"num"		: 1,
		"base_cost"	: 509,
		"desc"		: "Add shininess"
	},
	"r1491"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "essence_of_rubeweed",
		"num"		: 1,
		"base_cost"	: 383,
		"desc"		: "Add rubeness"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(750 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 750
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

//log.info("job_cult_sparkly_rock.js LOADED");

// generated ok (NO DATE)
