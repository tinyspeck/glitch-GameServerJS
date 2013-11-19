var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r150"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "egg_plain",
		"num"		: 500,
		"base_cost"	: 5,
		"desc"		: "Contribute Eggs - 500 needed!"
	},
	"r151"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 300,
		"base_cost"	: 12,
		"desc"		: "Contribute Blocks of Peat - 300 needed!"
	},
	"r152"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "sparkle_powder",
		"num"		: 8,
		"base_cost"	: 450,
		"desc"		: "Contribute Sparkle Powder - 8 needed!"
	},
	"r153"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "choice_crudites",
		"num"		: 100,
		"base_cost"	: 42,
		"desc"		: "Contribute Choice Crudites - 100 needed!"
	},
	"r154"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "bogspecialization_1",
		"num"		: 500,
		"base_cost"	: 8,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "pulverize",
		"verb_past"	: "pulverized",
		"desc"		: "Contribute work - 500 units needed with a Blender and Bog Specialization"
	},
	"r155"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "gardening_2",
		"num"		: 650,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "sprinkle",
		"verb_past"	: "sprinkled",
		"desc"		: "Contribute work - 650 units needed with a Watering Can and Arborology II"
	},
	"r156"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hooch",
		"num"		: 1000,
		"base_cost"	: 15,
		"desc"		: "Contribute Hooches - 1000 needed!"
	},
	"r157"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "gem_moonstone",
		"num"		: 10,
		"base_cost"	: 1000,
		"desc"		: "Contribute Luminous Moonstones - 10 needed!"
	},
	"r158"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "molybdenum",
		"num"		: 30,
		"base_cost"	: 100,
		"desc"		: "Contribute Molybdenum Ingots - 30 needed!"
	},
	"r159"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "smelting_1",
		"num"		: 400,
		"base_cost"	: 13,
		"energy"	: 7,
		"wear"		: 1,
		"verb_name"	: "melt",
		"verb_past"	: "melted",
		"desc"		: "Contribute work - 400 units needed with a Smelter and Smelting"
	},
	"r160"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "mining_2",
		"num"		: 550,
		"base_cost"	: 13,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Contribute work - 550 units needed with a Shovel and Mining II"
	},
	"r161"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "meditativearts_1",
		"num"		: 625,
		"base_cost"	: 13,
		"energy"	: 9,
		"wear"		: 1,
		"verb_name"	: "carve",
		"verb_past"	: "carved",
		"desc"		: "Contribute work - 625 units needed with a Scraper and Meditative Arts I"
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
	rewards.mood = pc.metabolics_add_mood(40);
	rewards.energy = pc.metabolics_add_energy(20);
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
	"mood"		: 40,
	"energy"	: 20,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard6_for_new_streets.js LOADED");

// generated ok (NO DATE)
