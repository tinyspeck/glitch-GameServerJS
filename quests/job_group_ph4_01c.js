var type = 3;
var title = "Plant and Certify_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1033"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 132,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 132 needed!"
	},
	"r1034"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 121,
		"base_cost"	: 12,
		"desc"		: "Contribute Blocks of Peat - 121 needed!"
	},
	"r1035"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aaa_earth_block",
		"num"		: 14,
		"base_cost"	: 210,
		"desc"		: "Contribute Grade AAA Earth Block - 14 needed!"
	},
	"r1036"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "croppery_1",
		"num"		: 122,
		"base_cost"	: 11,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 122 units needed with a Watering Can and Croppery I"
	},
	"r1037"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "egg_seasoner",
		"class_ids"	: {
			"0"	: "egg_seasoner"
		},
		"skill"		: "animalhusbandry_1",
		"num"		: 132,
		"base_cost"	: 9,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "request incubation",
		"verb_past"	: "requested incubation",
		"desc"		: "Contribute work - 132 units needed with a Egg Seasoner and Animal Husbandry"
	},
	"r1038"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "gardening_3",
		"num"		: 152,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 152 units needed with a Shovel and Arborology III"
	},
	"r1039"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fertilidust",
		"num"		: 16,
		"base_cost"	: 500,
		"desc"		: "Contribute Fertilidust - 16 needed!"
	},
	"r1040"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_bubble",
		"num"		: 22,
		"base_cost"	: 150,
		"desc"		: "Contribute Bubble Tree Beans - 22 needed!"
	},
	"r1041"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 145,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 145 needed!"
	},
	"r1042"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "crystallizer",
		"class_ids"	: {
			"0"	: "crystallizer"
		},
		"skill"		: "crystalography_1",
		"num"		: 165,
		"base_cost"	: 8,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "crystalmalize",
		"verb_past"	: "crystalmalized",
		"desc"		: "Contribute work - 165 units needed with a Crystalmalizing Chamber and Crystallography I"
	},
	"r1043"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "jellisac_hands_1",
		"num"		: 176,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "scoop",
		"verb_past"	: "scooped",
		"desc"		: "Contribute work - 176 units needed with a Scraper and Jellisac Hands"
	},
	"r1044"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_3",
		"num"		: 187,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "focus mood",
		"verb_past"	: "focused mood",
		"desc"		: "Contribute work - 187 units needed with a Focusing Orb and Meditative Arts III"
	}
};

var claim_reqs = {
	"r1273"	: {
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
	rewards.xp = pc.stats_add_xp(Math.round(15000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(15000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(15000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(300 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(300 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 15000,
	"mood"		: 15000,
	"energy"	: 15000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 300
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

//log.info("job_group_ph4_01c.js LOADED");

// generated ok (NO DATE)
