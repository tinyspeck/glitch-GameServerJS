var type = 1;
var title = "asdsa";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "dasda";

var duration = 0;
var claimable = 0;

var requirements = {
	"r176"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "butterfly_lotion",
		"class_ids"	: {
			"0"	: "butterfly_lotion"
		},
		"skill"		: "",
		"num"		: 10,
		"base_cost"	: 4,
		"energy"	: 1,
		"wear"		: 1,
		"verb_name"	: "squeeze",
		"verb_past"	: "squeezed",
		"desc"		: "Lubricate the soil"
	},
	"r179"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 30,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 30 needed!"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(10 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 10
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

//log.info("job_myles_test2.js LOADED");

// generated ok (NO DATE)
