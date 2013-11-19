var type = 1;
var title = "Compounds 1";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r899"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_red",
		"num"		: 75000,
		"base_cost"	: 0,
		"desc"		: "Contribute Red Elements - 75000 needed!"
	},
	"r900"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grendalinunin",
		"num"		: 692,
		"base_cost"	: 11,
		"desc"		: "Contribute Grendalinunin - 692 needed!"
	},
	"r901"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "lemene",
		"num"		: 1106,
		"base_cost"	: 4,
		"desc"		: "Contribute Lemene - 1106 needed!"
	},
	"r902"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "test_tube",
		"class_ids"	: {
			"0"	: "test_tube"
		},
		"skill"		: "intermediateadmixing_1",
		"num"		: 1515,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "experiment",
		"verb_past"	: "experimented",
		"desc"		: "Contribute work - 1,515 units needed with a Test Tube and Intermediate Admixing"
	},
	"r903"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "rubemycin",
		"num"		: 993,
		"base_cost"	: 4,
		"desc"		: "Contribute Rubemycin - 993 needed!"
	},
	"r904"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "friendly_acid",
		"num"		: 1024,
		"base_cost"	: 5,
		"desc"		: "Contribute Friendly Acid - 1024 needed!"
	},
	"r905"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cosmox",
		"num"		: 889,
		"base_cost"	: 8,
		"desc"		: "Contribute Cosmox - 889 needed!"
	},
	"r906"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "alchemy_2",
		"num"		: 1331,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "convert",
		"verb_past"	: "converted",
		"desc"		: "Contribute work - 1,331 units needed with a Beaker and Alchemy II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(18888 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(31111 * multiplier));
	pc.stats_add_favor_points("ti", Math.round(3111 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: Math.round(3111 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 18888,
	"mood"	: 31111,
	"favor"	: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 3111
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: 3111});
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
			"giant"		: "ti",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_10.js LOADED");

// generated ok (NO DATE)
