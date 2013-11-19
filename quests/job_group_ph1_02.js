var type = 3;
var title = "Lay the Turf_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1069"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "metal_rock",
		"num"		: 163,
		"base_cost"	: 3,
		"desc"		: "Contribute Chunks of Metal Rock - 163 needed!"
	},
	"r1070"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aa_earth_block",
		"num"		: 24,
		"base_cost"	: 150,
		"desc"		: "Contribute Urth Blocks - 24 needed!"
	},
	"r1071"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 111,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 111 needed!"
	},
	"r1072"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "croppery_2",
		"num"		: 96,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "tend",
		"verb_past"	: "tended",
		"desc"		: "Contribute work - 96 units needed with a Hoe and Croppery II"
	},
	"r1073"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "soil_appreciation_4",
		"num"		: 124,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "soak",
		"verb_past"	: "soaked",
		"desc"		: "Contribute work - 124 units needed with a Watering Can and Soil Appreciation IV"
	},
	"r1074"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "jellisac_hands_1",
		"num"		: 131,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "scoop",
		"verb_past"	: "scooped",
		"desc"		: "Contribute work - 131 units needed with a Scraper and Jellisac Hands"
	},
	"r1075"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 19,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 19 needed!"
	},
	"r1076"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 104,
		"base_cost"	: 10,
		"desc"		: "Contribute Lumps of Loam - 104 needed!"
	},
	"r1077"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 121,
		"base_cost"	: 12,
		"desc"		: "Contribute Blocks of Peat - 121 needed!"
	},
	"r1078"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_4",
		"num"		: 99,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "mine",
		"verb_past"	: "mined",
		"desc"		: "Contribute work - 99 units needed with a Fancy Pick and Mining IV"
	},
	"r1079"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_3",
		"num"		: 160,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "focus energy",
		"verb_past"	: "focused energy",
		"desc"		: "Contribute work - 160 units needed with a Focusing Orb and Meditative Arts III"
	},
	"r1080"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "light_green_thumb_3",
		"num"		: 145,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 145 units needed with a Shovel and Light Green Thumb III"
	}
};

var claim_reqs = {
	"r1262"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10000,
		"base_cost"	: 0,
		"desc"		: "Contribute Currants - 10,000 needed!"
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

//log.info("job_group_ph1_02.js LOADED");

// generated ok (NO DATE)
