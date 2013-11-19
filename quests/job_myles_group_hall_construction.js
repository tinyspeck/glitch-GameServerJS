var type = 3;
var title = "Build A Group Hall";
var desc = "Build a Group Hall of your very own, right here in this place!";
var completion = "Hurray! The Group Hall is yours!";

var duration = 3;
var claimable = 1;

var requirements = {
	"r795"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "your_papers",
		"num"		: 11,
		"base_cost"	: 100,
		"desc"		: "Collect everyone's Papers"
	},
	"r796"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 100,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 100 needed!"
	},
	"r797"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "grade_a_earth_block",
		"num"		: 100,
		"base_cost"	: 95,
		"desc"		: "Contribute Grade A Earth Blocks - 100 needed!"
	},
	"r798"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 200,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 200 needed!"
	},
	"r960"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "construction_tool",
		"class_ids"	: {
			"0"	: "construction_tool"
		},
		"skill"		: "construction_1",
		"num"		: 200,
		"base_cost"	: 3,
		"energy"	: 1,
		"wear"		: 1,
		"verb_name"	: "squash",
		"verb_past"	: "squashed",
		"desc"		: "Contribute work - 200 units needed with a Construction Tool"
	}
};

var claim_reqs = {
	"r959"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10000,
		"base_cost"	: 0,
		"desc"		: "Purchase the lot for 10,000 currants"
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

//log.info("job_myles_group_hall_construction.js LOADED");

// generated ok (NO DATE)
