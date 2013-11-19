var type = 1;
var title = "Engineer and Build";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r710"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 80,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 80 needed!"
	},
	"r711"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_rock",
		"num"		: 1024,
		"base_cost"	: 3,
		"desc"		: "Contribute Chunks of Metal Rock - 1024 needed!"
	},
	"r712"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 935,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 935 needed!"
	},
	"r713"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_4",
		"num"		: 800,
		"base_cost"	: 15,
		"energy"	: 6,
		"wear"		: 3,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 800 units needed with a Tinkertool and Tinkering IV"
	},
	"r714"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "engineering_1",
		"num"		: 950,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "form",
		"verb_past"	: "formed",
		"desc"		: "Contribute work - 950 units needed with a Alchemical Tongs and Engineering I"
	},
	"r715"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 750,
		"base_cost"	: 15,
		"energy"	: 5,
		"wear"		: 4,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 750 units needed with a Grinder and Refining II"
	},
	"r716"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 75,
		"base_cost"	: 150,
		"desc"		: "Contribute Urth Blocks - 75 needed!"
	},
	"r717"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 165,
		"base_cost"	: 300,
		"desc"		: "Contribute Plain Crystals - 165 needed!"
	},
	"r718"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "dullite",
		"num"		: 1100,
		"base_cost"	: 4,
		"desc"		: "Contribute Chunks of Dullite - 1100 needed!"
	},
	"r719"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "gassifier",
		"class_ids"	: {
			"0"	: "gassifier"
		},
		"skill"		: "fuelmaking_1",
		"num"		: 850,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "gassify",
		"verb_past"	: "gassified",
		"desc"		: "Contribute work - 850 units needed with a Gassifier and Fuelmaking"
	},
	"r720"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_3",
		"num"		: 1500,
		"base_cost"	: 11,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "mine",
		"verb_past"	: "mined",
		"desc"		: "Contribute work - 1,500 units needed with a Fancy Pick and Mining III"
	},
	"r721"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "bubble_tuner",
		"class_ids"	: {
			"0"	: "bubble_tuner"
		},
		"skill"		: "bubbletuning_1",
		"num"		: 1250,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "tune",
		"verb_past"	: "tuned",
		"desc"		: "Contribute work - 1,250 units needed with a Bubble Tuner and Bubble Tuning"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(7500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(7500 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(7500 * multiplier));
	pc.stats_add_favor_points("all", Math.round(150 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(150 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 7500,
	"mood"		: 7500,
	"energy"	: 7500,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 150
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(50, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(20);
	rewards.energy = pc.metabolics_add_energy(10);
	rewards.items = [];
	rewards.recipes = [];
	var items = pc.runDropTable("street_creation_rewards_a");
	for (var i in items){
		if (items[i].class_id){
			rewards.items.push({class_tsid: items[i].class_id, label: items[i].label, count: items[i].count});
		}else if (items[i].currants){
			if (!rewards.currants) rewards.currants = 0;
			rewards.currants += items[i].currants;
		}else if (items[i].favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push(items[i].favor);
		}
	}
	var items = pc.runDropTable("street_creation_trophies");
	for (var i in items){
		if (items[i].class_id){
			rewards.items.push({class_tsid: items[i].class_id, label: items[i].label, count: items[i].count});
		}else if (items[i].currants){
			if (!rewards.currants) rewards.currants = 0;
			rewards.currants += items[i].currants;
		}else if (items[i].favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push(items[i].favor);
		}
	}
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 5;
var performance_rewards = {
	"xp"		: 50,
	"mood"		: 20,
	"energy"	: 10,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_street_ph2_04.js LOADED");

// generated ok (NO DATE)
