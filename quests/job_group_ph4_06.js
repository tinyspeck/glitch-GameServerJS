var type = 3;
var title = "Fat of the Land_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1153"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pungent_sunrise",
		"num"		: 13,
		"base_cost"	: 197,
		"desc"		: "Contribute Pungent Sunrises - 13 needed!"
	},
	"r1154"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "spicy_quesadilla",
		"num"		: 37,
		"base_cost"	: 86,
		"desc"		: "Contribute Spicy Quesadillas - 37 needed!"
	},
	"r1155"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mexicali_eggs",
		"num"		: 33,
		"base_cost"	: 78,
		"desc"		: "Contribute Mexicali Eggs - 33 needed!"
	},
	"r1156"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "levitation_1",
		"num"		: 143,
		"base_cost"	: 13,
		"energy"	: 8,
		"wear"		: 2,
		"verb_name"	: "imagine levitation",
		"verb_past"	: "imagined levitation with",
		"desc"		: "Contribute work - 143 units needed with a Focusing Orb and Levitation"
	},
	"r1157"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "soil_appreciation_5",
		"num"		: 135,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 135 units needed with a Watering Can and Soil Appreciation V"
	},
	"r1158"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "croppery_2",
		"num"		: 150,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "tend",
		"verb_past"	: "tended",
		"desc"		: "Contribute work - 150 units needed with a Hoe and Croppery II"
	},
	"r1159"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "corn_off_the_cob",
		"num"		: 39,
		"base_cost"	: 55,
		"desc"		: "Contribute Corn-off-the-Cobs - 39 needed!"
	},
	"r1160"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_aaa_earth_block",
		"num"		: 17,
		"base_cost"	: 210,
		"desc"		: "Contribute Grade AAA Earth Block - 17 needed!"
	},
	"r1161"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "jellisac_clump",
		"num"		: 89,
		"base_cost"	: 9,
		"desc"		: "Contribute Clumps of Jellisac - 89 needed!"
	},
	"r1162"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 165,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 165 units needed with a Spice Mill and Spice Milling"
	},
	"r1163"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "gardening_2",
		"num"		: 145,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 145 units needed with a Shovel and Arborology II"
	},
	"r1164"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "betterlearning_5",
		"num"		: 159,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "study",
		"verb_past"	: "studied",
		"desc"		: "Contribute work - 159 units needed with a Beaker and Better Learning V"
	}
};

var claim_reqs = {
	"r1276"	: {
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

//log.info("job_group_ph4_06.js LOADED");

// generated ok (NO DATE)
