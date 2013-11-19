var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r146"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 250,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 250 needed!"
	},
	"r147"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_rock",
		"num"		: 500,
		"base_cost"	: 3,
		"desc"		: "Contribute Chunks of Metal Rock - 500 needed!"
	},
	"r148"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 750,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 750 needed!"
	},
	"r149"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "light_green_thumb_2",
		"num"		: 500,
		"base_cost"	: 8,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "split",
		"verb_past"	: "split",
		"desc"		: "Contribute work - 500 units needed with a Hatchet and Light Green Thumb II"
	},
	"r163"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_3",
		"num"		: 400,
		"base_cost"	: 12,
		"energy"	: 4,
		"wear"		: 3,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 400 units needed with a Tinkertool and Tinkering III"
	},
	"r164"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_3",
		"num"		: 600,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "smash",
		"verb_past"	: "smashed",
		"desc"		: "Contribute work - 600 units needed with a Fancy Pick and Mining III"
	},
	"r165"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 600,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 600 needed!"
	},
	"r167"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 200,
		"base_cost"	: 10,
		"desc"		: "Contribute Lumps of Loam - 200 needed!"
	},
	"r168"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_fruit",
		"num"		: 50,
		"base_cost"	: 150,
		"desc"		: "Contribute Fruit Tree Beans - 50 needed!"
	},
	"r169"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 400,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "grade",
		"verb_past"	: "graded",
		"desc"		: "Contribute work - 400 units needed with a Hoe and Light Green Thumb III"
	},
	"r170"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "gardening_3",
		"num"		: 500,
		"base_cost"	: 11,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "plant",
		"verb_past"	: "planted",
		"desc"		: "Contribute work - 500 units needed with a Shovel and Arborology III"
	},
	"r171"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "gardening_5",
		"num"		: 1000,
		"base_cost"	: 12,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 1,000 units needed with a Watering Can and Arborology V"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(8000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(20000 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(10000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(10000 * multiplier));
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 8000,
	"currants"	: 20000,
	"mood"		: 10000,
	"energy"	: 10000
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(300, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(50);
	rewards.items = [];
	rewards.recipes = [];
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
var performance_cutoff = 3;
var performance_rewards = {
	"xp"		: 300,
	"mood"		: 50,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard5_for_new_streets.js LOADED");

// generated ok (NO DATE)
