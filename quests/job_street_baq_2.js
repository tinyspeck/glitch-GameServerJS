var type = 1;
var title = "Gas";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r835"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_vapour",
		"num"		: 500,
		"base_cost"	: 5,
		"desc"		: "Contribute General Vapour - 500 needed!"
	},
	"r836"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "heavy_gas",
		"num"		: 622,
		"base_cost"	: 40,
		"desc"		: "Contribute Heavy Gas - 622 needed!"
	},
	"r837"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "crying_gas",
		"num"		: 701,
		"base_cost"	: 20,
		"desc"		: "Contribute Crying Gas - 701 needed!"
	},
	"r838"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "gassifier",
		"class_ids"	: {
			"0"	: "gassifier"
		},
		"skill"		: "gasmogrification_1",
		"num"		: 1825,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "gassify",
		"verb_past"	: "gassified",
		"desc"		: "Contribute work - 1,825 units needed with a Gassifier and Gasmogrification"
	},
	"r839"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "helium",
		"num"		: 455,
		"base_cost"	: 30,
		"desc"		: "Contribute Helium - 455 needed!"
	},
	"r840"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "laughing_gas",
		"num"		: 800,
		"base_cost"	: 20,
		"desc"		: "Contribute Laughing Gas - 800 needed!"
	},
	"r841"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "white_gas",
		"num"		: 455,
		"base_cost"	: 50,
		"desc"		: "Contribute White Gas - 455 needed!"
	},
	"r842"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_4",
		"num"		: 1475,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "pop",
		"verb_past"	: "popped",
		"desc"		: "Contribute work - 1,475 units needed with a Fancy Pick and Mining IV"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(25000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(40000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(4000 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(4000 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 25000,
	"mood"	: 40000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 4000
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 4000});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 5;
var performance_rewards = {
	"xp"	: 125,
	"favor"	: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_2.js LOADED");

// generated ok (NO DATE)
