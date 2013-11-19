var type = 1;
var title = "Crops 1";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r859"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "spinach",
		"num"		: 912,
		"base_cost"	: 3,
		"desc"		: "Contribute Spinach - 912 needed!"
	},
	"r860"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "potato",
		"num"		: 546,
		"base_cost"	: 7,
		"desc"		: "Contribute Potatoes - 546 needed!"
	},
	"r861"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "carrot",
		"num"		: 711,
		"base_cost"	: 6,
		"desc"		: "Contribute Carrots - 711 needed!"
	},
	"r862"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "croppery_2",
		"num"		: 2011,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "hoe",
		"verb_past"	: "hoed",
		"desc"		: "Contribute work - 2,011 units needed with a Hoe and Croppery II"
	},
	"r863"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "rice",
		"num"		: 1031,
		"base_cost"	: 4,
		"desc"		: "Contribute Rice - 1031 needed!"
	},
	"r864"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "corn",
		"num"		: 822,
		"base_cost"	: 6,
		"desc"		: "Contribute Corn - 822 needed!"
	},
	"r865"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cabbage",
		"num"		: 743,
		"base_cost"	: 7,
		"desc"		: "Contribute Cabbages - 743 needed!"
	},
	"r866"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "soil_appreciation_4",
		"num"		: 1625,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "clear",
		"verb_past"	: "cleared",
		"desc"		: "Contribute work - 1,625 units needed with a Hatchet and Soil Appreciation IV"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(18000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(28000 * multiplier));
	pc.stats_add_favor_points("mab", Math.round(2700 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "mab", points: Math.round(2700 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 18000,
	"mood"	: 28000,
	"favor"	: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 2700
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "mab", points: 2700});
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
			"giant"		: "mab",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_5.js LOADED");

// generated ok (NO DATE)
