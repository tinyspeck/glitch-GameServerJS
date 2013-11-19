var type = 1;
var title = "Spice 1";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r883"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pinch_of_salt",
		"num"		: 2000,
		"base_cost"	: 2,
		"desc"		: "Contribute Pinches of Salt - 2000 needed!"
	},
	"r884"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hot_pepper",
		"num"		: 877,
		"base_cost"	: 4,
		"desc"		: "Contribute Hot Peppers - 877 needed!"
	},
	"r885"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cardamom",
		"num"		: 625,
		"base_cost"	: 12,
		"desc"		: "Contribute Cardamom - 625 needed!"
	},
	"r886"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 1789,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 1,789 units needed with a Spice Mill and Spice Milling"
	},
	"r887"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "curry",
		"num"		: 803,
		"base_cost"	: 5,
		"desc"		: "Contribute Curries - 803 needed!"
	},
	"r888"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "older_spice",
		"num"		: 777,
		"base_cost"	: 20,
		"desc"		: "Contribute Old(er) Spices - 777 needed!"
	},
	"r889"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mustard",
		"num"		: 1333,
		"base_cost"	: 4,
		"desc"		: "Contribute Mustards - 1333 needed!"
	},
	"r890"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "botany_1",
		"num"		: 1881,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "cut",
		"verb_past"	: "cut",
		"desc"		: "Contribute work - 1,881 units needed with a Scraper and Botany"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(20000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(31500 * multiplier));
	pc.stats_add_favor_points("pot", Math.round(3100 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: Math.round(3100 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 20000,
	"mood"	: 31500,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 3100
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: 3100});
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
			"giant"		: "pot",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_8.js LOADED");

// generated ok (NO DATE)
