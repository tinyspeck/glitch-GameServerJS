var type = 1;
var title = "Crops 2";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r867"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "zucchini",
		"num"		: 801,
		"base_cost"	: 5,
		"desc"		: "Contribute Zucchinis - 801 needed!"
	},
	"r868"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "broccoli",
		"num"		: 601,
		"base_cost"	: 5,
		"desc"		: "Contribute Broccoli - 601 needed!"
	},
	"r869"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "onion",
		"num"		: 717,
		"base_cost"	: 4,
		"desc"		: "Contribute Onions - 717 needed!"
	},
	"r870"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "saucepan",
		"class_ids"	: {
			"0"	: "saucepan"
		},
		"skill"		: "saucery_2",
		"num"		: 1999,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "simmer",
		"verb_past"	: "simmered",
		"desc"		: "Contribute work - 1,999 units needed with a Saucepan and Saucery II"
	},
	"r871"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "rice",
		"num"		: 1031,
		"base_cost"	: 4,
		"desc"		: "Contribute Rice - 1031 needed!"
	},
	"r872"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "corn",
		"num"		: 822,
		"base_cost"	: 6,
		"desc"		: "Contribute Corn - 822 needed!"
	},
	"r873"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cabbage",
		"num"		: 743,
		"base_cost"	: 7,
		"desc"		: "Contribute Cabbages - 743 needed!"
	},
	"r874"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_2",
		"num"		: 1445,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Contribute work - 1,445 units needed with a Awesome Pot and Master Chef II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(17500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(27500 * multiplier));
	pc.stats_add_favor_points("humbaba", Math.round(2750 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "humbaba", points: Math.round(2750 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 17500,
	"mood"	: 27500,
	"favor"	: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 2750
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "humbaba", points: 2750});
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
			"giant"		: "humbaba",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_6.js LOADED");

// generated ok (NO DATE)
