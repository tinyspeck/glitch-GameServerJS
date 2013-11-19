var type = 1;
var title = "Plant and Certify";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r328"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 100,
		"base_cost"	: 10,
		"desc"		: "Contribute Lumps of Loam - 100 needed!"
	},
	"r329"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 250,
		"base_cost"	: 20,
		"desc"		: "Contribute Guano - 250 needed!"
	},
	"r330"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "powder_of_mild_fecundity",
		"num"		: 20,
		"base_cost"	: 500,
		"desc"		: "Contribute Powder of Mild Fecundity - 20 needed!"
	},
	"r331"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 375,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "spread",
		"verb_past"	: "spread",
		"desc"		: "Contribute work - 375 units needed with a Shovel and Light Green Thumb III"
	},
	"r332"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_5",
		"num"		: 600,
		"base_cost"	: 9,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "grade",
		"verb_past"	: "graded",
		"desc"		: "Contribute work - 600 units needed with a Hoe and Soil Appreciation V"
	},
	"r333"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "pick",
		"class_ids"	: {
			"0"	: "pick"
		},
		"skill"		: "gardening_5",
		"num"		: 450,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "aerate",
		"verb_past"	: "aerated",
		"desc"		: "Contribute work - 450 units needed with a Pick and Arborology V"
	},
	"r334"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "paper",
		"num"		: 350,
		"base_cost"	: 2,
		"desc"		: "Contribute Sheets of Paper - 350 needed!"
	},
	"r336"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 4,
		"base_cost"	: 500,
		"desc"		: "Contribute General Building Permits - 4 needed!"
	},
	"r337"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 150,
		"base_cost"	: 300,
		"desc"		: "Contribute Plain Crystals - 150 needed!"
	},
	"r338"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 450,
		"base_cost"	: 8,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 450 units needed with a Watering Can and Light Green Thumb III"
	},
	"r339"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "penmanship_1",
		"num"		: 250,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "authorize",
		"verb_past"	: "authorized",
		"desc"		: "Contribute work - 250 units needed with a Quill and Penpersonship I"
	},
	"r340"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "focused_meditation_1",
		"num"		: 500,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "consecrate",
		"verb_past"	: "consecrated",
		"desc"		: "Contribute work - 500 units needed with a Focusing Orb and Focused Meditation"
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
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "a special gift",
			"count"		: 1
		}
	}
};

//log.info("job_street_ph4_01.js LOADED");

// generated ok (NO DATE)
