var type = 1;
var title = "Build the Base";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r648"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "copper",
		"num"		: 300,
		"base_cost"	: 70,
		"desc"		: "Contribute Copper Ingots - 300 needed!"
	},
	"r649"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 250,
		"base_cost"	: 150,
		"desc"		: "Contribute Urth Blocks - 250 needed!"
	},
	"r659"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 625,
		"base_cost"	: 20,
		"desc"		: "Contribute Guano - 625 needed!"
	},
	"r650"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "blockmaking_1",
		"num"		: 750,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "cut",
		"verb_past"	: "cut",
		"desc"		: "Contribute work - 750 units needed with a Scraper and Blockmaking"
	},
	"r651"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_4",
		"num"		: 825,
		"base_cost"	: 9,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 825 units needed with a Tinkertool and Tinkering IV"
	},
	"r652"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "crystallizer",
		"class_ids"	: {
			"0"	: "crystallizer"
		},
		"skill"		: "crystalography_1",
		"num"		: 925,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "charm",
		"verb_past"	: "charmed",
		"desc"		: "Contribute work - 925 units needed with a Crystalmalizing Chamber and Crystallography I"
	},
	"r654"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "powder_of_mild_fecundity",
		"num"		: 125,
		"base_cost"	: 500,
		"desc"		: "Contribute Powder of Mild Fecundity - 125 needed!"
	},
	"r655"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "note",
		"num"		: 1000,
		"base_cost"	: 4,
		"desc"		: "Contribute Notes - 1000 needed!"
	},
	"r656"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "gardening_3",
		"num"		: 875,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "plant",
		"verb_past"	: "planted",
		"desc"		: "Contribute work - 875 units needed with a Shovel and Arborology III"
	},
	"r657"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 775,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 775 units needed with a Watering Can and Light Green Thumb III"
	},
	"r658"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "focused_meditation_1",
		"num"		: 900,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "consecrate",
		"verb_past"	: "consecrated",
		"desc"		: "Contribute work - 900 units needed with a Focusing Orb and Focused Meditation"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(22500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(22500 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(22500 * multiplier));
	pc.stats_add_favor_points("all", Math.round(450 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(450 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 22500,
	"mood"		: 22500,
	"energy"	: 22500,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 450
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(150, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(60);
	rewards.energy = pc.metabolics_add_energy(30);
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
var performance_cutoff = 11;
var performance_rewards = {
	"xp"		: 150,
	"mood"		: 60,
	"energy"	: 30,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "a special gift",
			"count"		: 1
		}
	}
};

//log.info("job_tower_ph3.js LOADED");

// generated ok (NO DATE)
