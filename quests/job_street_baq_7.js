var type = 1;
var title = "Harvest";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r875"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "meat",
		"num"		: 901,
		"base_cost"	: 10,
		"desc"		: "Contribute Meats - 901 needed!"
	},
	"r876"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grain",
		"num"		: 1221,
		"base_cost"	: 1,
		"desc"		: "Contribute Grains - 1221 needed!"
	},
	"r877"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cherry",
		"num"		: 1935,
		"base_cost"	: 1,
		"desc"		: "Contribute Cherries - 1935 needed!"
	},
	"r878"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_2",
		"num"		: 1789,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "squish",
		"verb_past"	: "squished",
		"desc"		: "Contribute work - 1,789 units needed with a Cocktail Shaker and Cocktail Crafting II"
	},
	"r879"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "egg_plain",
		"num"		: 1301,
		"base_cost"	: 5,
		"desc"		: "Contribute Eggs - 1301 needed!"
	},
	"r880"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 1444,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 1444 needed!"
	},
	"r881"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "milk_butterfly",
		"num"		: 1228,
		"base_cost"	: 8,
		"desc"		: "Contribute Butterfly Milks - 1228 needed!"
	},
	"r882"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 1445,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "soak",
		"verb_past"	: "soaked",
		"desc"		: "Contribute work - 1,445 units needed with a Watering Can and Light Green Thumb III"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(18888 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(28500 * multiplier));
	pc.stats_add_favor_points("spriggan", Math.round(2811 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "spriggan", points: Math.round(2811 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 18888,
	"mood"	: 28500,
	"favor"	: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 2811
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "spriggan", points: 2811});
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
			"giant"		: "spriggan",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_7.js LOADED");

// generated ok (NO DATE)
