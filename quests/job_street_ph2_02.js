var type = 1;
var title = "Supply & Prepare";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r353"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 50,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 50 needed!"
	},
	"r354"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 500,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 500 needed!"
	},
	"r355"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 75,
		"base_cost"	: 150,
		"desc"		: "Contribute Urth Blocks - 75 needed!"
	},
	"r356"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "blockmaking_1",
		"num"		: 425,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 3,
		"verb_name"	: "set",
		"verb_past"	: "set",
		"desc"		: "Contribute work - 425 units needed with a Scraper and Blockmaking"
	},
	"r357"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 375,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "stake",
		"verb_past"	: "staked",
		"desc"		: "Contribute work - 375 units needed with a Hatchet and Light Green Thumb III"
	},
	"r358"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_5",
		"num"		: 450,
		"base_cost"	: 11,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 450 units needed with a Tinkertool and Tinkering V"
	},
	"r359"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aaa_earth_block",
		"num"		: 50,
		"base_cost"	: 210,
		"desc"		: "Contribute Grade AAA Earth Block - 50 needed!"
	},
	"r360"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "jellisac_clump",
		"num"		: 225,
		"base_cost"	: 9,
		"desc"		: "Contribute Clumps of Jellisac - 225 needed!"
	},
	"r361"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_metal",
		"num"		: 300,
		"base_cost"	: 30,
		"desc"		: "Contribute Plain Metal Ingots - 300 needed!"
	},
	"r362"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "alchemy_2",
		"num"		: 375,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "forge",
		"verb_past"	: "forged",
		"desc"		: "Contribute work - 375 units needed with a Alchemical Tongs and Alchemy II"
	},
	"r363"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "alchemy_2",
		"num"		: 500,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "pour",
		"verb_past"	: "poured",
		"desc"		: "Contribute work - 500 units needed with a Smelter and Alchemy II"
	},
	"r364"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "soil_appreciation_5",
		"num"		: 750,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "tamp",
		"verb_past"	: "tamped",
		"desc"		: "Contribute work - 750 units needed with a Shovel and Soil Appreciation V"
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

//log.info("job_street_ph2_02.js LOADED");

// generated ok (NO DATE)
