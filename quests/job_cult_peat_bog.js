var type = 5;
var title = "Peat Bog";
var desc = "This project is to create a Peat Bog.";
var completion = "Congrats, you made a Peat Bog!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1515"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 24,
		"base_cost"	: 3,
		"desc"		: "Add earth"
	},
	"r1516"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 6,
		"base_cost"	: 10,
		"desc"		: "Add loam"
	},
	"r1517"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "gandlevery",
		"num"		: 3,
		"base_cost"	: 40,
		"desc"		: "Peatify"
	},
	"r1518"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hooch",
		"num"		: 9,
		"base_cost"	: 15,
		"desc"		: "Add secret ingredient"
	},
	"r1519"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel",
			"1"	: "ace_of_spades"
		},
		"skill"		: "",
		"num"		: 30,
		"base_cost"	: 9,
		"energy"	: 7,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Mix the ingredients"
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

//log.info("job_cult_peat_bog.js LOADED");

// generated ok (NO DATE)
