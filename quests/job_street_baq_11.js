var type = 1;
var title = "Compounds 2";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r907"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_green",
		"num"		: 65000,
		"base_cost"	: 0,
		"desc"		: "Contribute Green Elements - 65000 needed!"
	},
	"r908"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "ixite",
		"num"		: 1711,
		"base_cost"	: 4,
		"desc"		: "Contribute Ixite - 1711 needed!"
	},
	"r909"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tiite",
		"num"		: 921,
		"base_cost"	: 1,
		"desc"		: "Contribute Tiite - 921 needed!"
	},
	"r910"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 1623,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 1,623 units needed with a Grinder and Refining II"
	},
	"r911"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_blue",
		"num"		: 55000,
		"base_cost"	: 0,
		"desc"		: "Contribute Blue Elements - 55000 needed!"
	},
	"r912"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "abbasidose",
		"num"		: 819,
		"base_cost"	: 6,
		"desc"		: "Contribute Abbasidose - 819 needed!"
	},
	"r913"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mabon",
		"num"		: 515,
		"base_cost"	: 15,
		"desc"		: "Contribute Mabon - 515 needed!"
	},
	"r914"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "elementhandling_1",
		"num"		: 1331,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "cook",
		"verb_past"	: "cooked",
		"desc"		: "Contribute work - 1,331 units needed with a Awesome Pot and Element Handling"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(24000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(38750 * multiplier));
	pc.stats_add_favor_points("ti", Math.round(3875 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: Math.round(3875 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 24000,
	"mood"	: 38750,
	"favor"	: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 3875
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: 3875});
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

//log.info("job_street_baq_11.js LOADED");

// generated ok (NO DATE)
