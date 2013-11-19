var type = 1;
var title = "Spice 2";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r891"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "garlic",
		"num"		: 1500,
		"base_cost"	: 4,
		"desc"		: "Contribute Garlic - 1500 needed!"
	},
	"r892"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cumin",
		"num"		: 901,
		"base_cost"	: 8,
		"desc"		: "Contribute Cumin - 901 needed!"
	},
	"r893"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "black_pepper",
		"num"		: 1001,
		"base_cost"	: 4,
		"desc"		: "Contribute Black Peppers - 1001 needed!"
	},
	"r894"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "ezcooking_2",
		"num"		: 1789,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "mince",
		"verb_past"	: "minced",
		"desc"		: "Contribute work - 1,789 units needed with a Knife & Board and EZ Cooking II"
	},
	"r895"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "licorice",
		"num"		: 747,
		"base_cost"	: 8,
		"desc"		: "Contribute Licorice - 747 needed!"
	},
	"r896"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "saffron",
		"num"		: 597,
		"base_cost"	: 12,
		"desc"		: "Contribute Saffron - 597 needed!"
	},
	"r897"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "turmeric",
		"num"		: 686,
		"base_cost"	: 12,
		"desc"		: "Contribute Turmerics - 686 needed!"
	},
	"r898"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 1911,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "crunch",
		"verb_past"	: "crunched",
		"desc"		: "Contribute work - 1,911 units needed with a Spice Mill and Spice Milling"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(19900 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(32225 * multiplier));
	pc.stats_add_favor_points("pot", Math.round(3200 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: Math.round(3200 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 19900,
	"mood"	: 32225,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 3200
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: 3200});
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

//log.info("job_street_baq_9.js LOADED");

// generated ok (NO DATE)
