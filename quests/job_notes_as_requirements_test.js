var type = 1;
var title = "Notes as job req test";
var desc = "Can you complete a job that uses notes as a requirement?  There's only one way to find out, hombre!";
var completion = "You have completed a job that uses notes as a requirement!  Well done, soldier!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r671"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "note",
		"num"		: 10,
		"base_cost"	: 4,
		"desc"		: "Hand in a bunch of notes!  What's written on them?  A fine question!"
	},
	"r672"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "emotional_bear",
		"class_ids"	: {
			"0"	: "emotional_bear"
		},
		"skill"		: "",
		"num"		: 15,
		"base_cost"	: 6,
		"energy"	: 5,
		"wear"		: 0,
		"verb_name"	: "hug",
		"verb_past"	: "hugged",
		"desc"		: "When in doubt, hug it out!"
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

//log.info("job_notes_as_requirements_test.js LOADED");

// generated ok (NO DATE)
