var type = 1;
var title = "Fruit 2";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r851"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bunch_of_grapes",
		"num"		: 912,
		"base_cost"	: 4,
		"desc"		: "Contribute Bunches of Grapes - 912 needed!"
	},
	"r852"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pineapple",
		"num"		: 831,
		"base_cost"	: 7,
		"desc"		: "Contribute Pineapples - 831 needed!"
	},
	"r853"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "orange",
		"num"		: 1001,
		"base_cost"	: 5,
		"desc"		: "Contribute Oranges - 1001 needed!"
	},
	"r854"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fruit_changing_machine",
		"class_ids"	: {
			"0"	: "fruit_changing_machine"
		},
		"skill"		: "fruitchanging_1",
		"num"		: 2011,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 2,011 units needed with a Fruit Changing Machine and Fruit Changing"
	},
	"r855"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cloudberry",
		"num"		: 1400,
		"base_cost"	: 2,
		"desc"		: "Contribute Cloudberries - 1400 needed!"
	},
	"r856"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "whortleberry",
		"num"		: 751,
		"base_cost"	: 5,
		"desc"		: "Contribute Whortleberries - 751 needed!"
	},
	"r857"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mangosteen",
		"num"		: 681,
		"base_cost"	: 10,
		"desc"		: "Contribute Mangosteens - 681 needed!"
	},
	"r858"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 1625,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 1,625 units needed with a Blender and Blending II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(19000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(30000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(2800 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(2800 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 19000,
	"mood"	: 30000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 2800
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 2800});
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

//log.info("job_street_baq_4.js LOADED");

// generated ok (NO DATE)
