var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r124"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 400,
		"base_cost"	: 8,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "undig",
		"verb_past"	: "undug",
		"desc"		: "Contribute work - 400 units needed with a Shovel and Soil Appreciation III"
	},
	"r131"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grain",
		"num"		: 1000,
		"base_cost"	: 1,
		"desc"		: "Contribute Grains - 1000 needed!"
	},
	"r122"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 500,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 500 needed!"
	},
	"r123"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 400,
		"base_cost"	: 12,
		"desc"		: "Contribute Blocks of Peat - 400 needed!"
	},
	"r126"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 400,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "mulch",
		"verb_past"	: "mulched",
		"desc"		: "Contribute work - 400 units needed with a Hoe and Soil Appreciation III"
	},
	"r127"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "item",
		"class_id"	: "fertilidust",
		"num"		: 6,
		"base_cost"	: 500,
		"desc"		: "Contribute Fertilidust - 6 needed!"
	},
	"r125"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 500,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 500 needed!"
	},
	"r128"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 750,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 750 needed!"
	},
	"r129"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_metal",
		"num"		: 400,
		"base_cost"	: 30,
		"desc"		: "Contribute Plain Metal Ingots - 400 needed!"
	},
	"r132"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hard_bubble",
		"num"		: 200,
		"base_cost"	: 15,
		"desc"		: "Contribute Hard Bubbles - 200 needed!"
	},
	"r130"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_3",
		"num"		: 400,
		"base_cost"	: 13,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 400 units needed with a Tinkertool and Tinkering III"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(8000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(8000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(8000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(175 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(175 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 8000,
	"mood"		: 8000,
	"energy"	: 8000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 175
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(80, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(30);
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
var performance_cutoff = 8;
var performance_rewards = {
	"xp"		: 80,
	"mood"		: 30,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard3_for_new_streets.js LOADED");

// generated ok (NO DATE)
