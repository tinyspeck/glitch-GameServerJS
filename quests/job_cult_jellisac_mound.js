var type = 5;
var title = "Jellisac Mound";
var desc = "This project is to create a Jellisac Mound.";
var completion = "Congrats, you made a Jellisac Mound!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1530"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 16,
		"base_cost"	: 5,
		"desc"		: "Add planks"
	},
	"r1533"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet",
			"1"	: "class_axe"
		},
		"skill"		: "",
		"num"		: 20,
		"base_cost"	: 7,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Fence the area"
	},
	"r1535"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 4,
		"base_cost"	: 12,
		"desc"		: "Add peat"
	},
	"r1537"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 24,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1611"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "jellisac_clump",
		"num"		: 3,
		"base_cost"	: 9,
		"desc"		: "Seed jellisacs"
	},
	"r1538"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 30,
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

//log.info("job_cult_jellisac_mound.js LOADED");

// generated ok (NO DATE)
