var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r216"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_metal",
		"num"		: 500,
		"base_cost"	: 30,
		"desc"		: "Contribute Plain Metal Ingots - 500 needed!"
	},
	"r217"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 1000,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 1000 needed!"
	},
	"r218"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 1500,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 1500 needed!"
	},
	"r219"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_4",
		"num"		: 500,
		"base_cost"	: 8,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "craft",
		"verb_past"	: "crafted",
		"desc"		: "Contribute work - 500 units needed with a Tinkertool and Tinkering IV"
	},
	"r220"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 600,
		"base_cost"	: 7,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "spread",
		"verb_past"	: "spread",
		"desc"		: "Contribute work - 600 units needed with a Hoe and Soil Appreciation III"
	},
	"r221"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "smelting_1",
		"num"		: 500,
		"base_cost"	: 7,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "form",
		"verb_past"	: "formed",
		"desc"		: "Contribute work - 500 units needed with a Smelter and Smelting"
	},
	"r222"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hearty_groddle_sammich",
		"num"		: 75,
		"base_cost"	: 93,
		"desc"		: "Contribute Hearty Groddle Sammiches - 75 needed!"
	},
	"r223"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cloud_11_smoothie",
		"num"		: 100,
		"base_cost"	: 69,
		"desc"		: "Contribute Cloud 11 Smoothies - 100 needed!"
	},
	"r224"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_fruit",
		"num"		: 50,
		"base_cost"	: 150,
		"desc"		: "Contribute Fruit Tree Beans - 50 needed!"
	},
	"r227"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "ezcooking_2",
		"num"		: 500,
		"base_cost"	: 8,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "chop",
		"verb_past"	: "chopped",
		"desc"		: "Contribute work - 500 units needed with a Knife & Board and EZ Cooking II"
	},
	"r228"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 750,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 2,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 750 units needed with a Blender and Blending II"
	},
	"r229"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 1000,
		"base_cost"	: 5,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "plant",
		"verb_past"	: "planted",
		"desc"		: "Contribute work - 1,000 units needed with a Shovel and Light Green Thumb III"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(10000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(10000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(10000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(200 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(200 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 10000,
	"mood"		: 10000,
	"energy"	: 10000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 200
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(100, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(400);
	rewards.energy = pc.metabolics_add_energy(200);
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
	"xp"		: 100,
	"mood"		: 400,
	"energy"	: 200,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard7_for_new_streets.js LOADED");

// generated ok (NO DATE)
