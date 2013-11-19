var type = 1;
var title = "Currants";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r915"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 10,000 needed!"
	},
	"r916"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 20000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 20,000 needed!"
	},
	"r917"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 40000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 40,000 needed!"
	},
	"r922"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "bureaucraticarts_2",
		"num"		: 1678,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "forge",
		"verb_past"	: "forged",
		"desc"		: "Contribute work - 1,678 units needed with a Quill and Bureaucratic Arts II"
	},
	"r919"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 22222,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 22,222 needed!"
	},
	"r920"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 33333,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 33,333 needed!"
	},
	"r921"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 44444,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 44,444 needed!"
	},
	"r918"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "focused_meditation_1",
		"num"		: 2233,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "sanctify",
		"verb_past"	: "sanctified",
		"desc"		: "Contribute work - 2,233 units needed with a Focusing Orb and Focused Meditation"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(50000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(100000 * multiplier));
	pc.stats_add_favor_points("pot", Math.round(5000 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: Math.round(5000 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 50000,
	"mood"	: 100000,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 5000
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(250, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: 5000});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 5;
var performance_rewards = {
	"xp"	: 250,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 200
		}
	}
};

//log.info("job_street_baq_12.js LOADED");

// generated ok (NO DATE)
