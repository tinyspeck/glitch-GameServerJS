var type = 1;
var title = "Bubbles";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r823"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_bubble",
		"num"		: 500,
		"base_cost"	: 2,
		"desc"		: "Contribute Plain Bubbles - 500 needed!"
	},
	"r824"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tiny_bubble",
		"num"		: 750,
		"base_cost"	: 10,
		"desc"		: "Contribute Tiny Bubbles - 750 needed!"
	},
	"r825"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hard_bubble",
		"num"		: 425,
		"base_cost"	: 15,
		"desc"		: "Contribute Hard Bubbles - 425 needed!"
	},
	"r828"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "bubble_tuner",
		"class_ids"	: {
			"0"	: "bubble_tuner"
		},
		"skill"		: "bubbletuning_1",
		"num"		: 1725,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "finetune",
		"verb_past"	: "finetuned",
		"desc"		: "Contribute work - 1,725 units needed with a Bubble Tuner and Bubble Tuning"
	},
	"r829"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "blue_bubble",
		"num"		: 611,
		"base_cost"	: 5,
		"desc"		: "Contribute Blue Bubbles - 611 needed!"
	},
	"r830"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_bubble",
		"num"		: 571,
		"base_cost"	: 2,
		"desc"		: "Contribute Plain Bubbles - 571 needed!"
	},
	"r831"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tiny_bubble",
		"num"		: 405,
		"base_cost"	: 10,
		"desc"		: "Contribute Tiny Bubbles - 405 needed!"
	},
	"r834"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_3",
		"num"		: 1475,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "contemplate",
		"verb_past"	: "contemplated",
		"desc"		: "Contribute work - 1,475 units needed with a Focusing Orb and Meditative Arts III"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(15000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(25000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(2500 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(2500 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 15000,
	"mood"	: 25000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 2500
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(125, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 2500});
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
			"giant"		: "grendaline",
			"points"	: 100
		}
	}
};

//log.info("job_street_baq_01.js LOADED");

// generated ok (NO DATE)
