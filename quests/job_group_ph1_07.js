var type = 3;
var title = "Ready, Set, Action!_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1165"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hearty_groddle_sammich",
		"num"		: 33,
		"base_cost"	: 93,
		"desc"		: "Contribute Hearty Groddle Sammiches - 33 needed!"
	},
	"r1166"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "orange_juice",
		"num"		: 73,
		"base_cost"	: 39,
		"desc"		: "Contribute Orange Juices - 73 needed!"
	},
	"r1167"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "yummy_gruel",
		"num"		: 55,
		"base_cost"	: 134,
		"desc"		: "Contribute Yummy Gruels - 55 needed!"
	},
	"r1168"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "bogspecialization_1",
		"num"		: 143,
		"base_cost"	: 15,
		"energy"	: 7,
		"wear"		: 4,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 143 units needed with a Shovel and Bog Specialization"
	},
	"r1169"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_3",
		"num"		: 156,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "meditate",
		"verb_past"	: "meditated",
		"desc"		: "Contribute work - 156 units needed with a Focusing Orb and Meditative Arts III"
	},
	"r1170"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_5",
		"num"		: 131,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "tend",
		"verb_past"	: "tended",
		"desc"		: "Contribute work - 131 units needed with a Hoe and Soil Appreciation V"
	},
	"r1171"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "exotic_fruit_salad",
		"num"		: 87,
		"base_cost"	: 33,
		"desc"		: "Contribute Exotic Fruit Salads - 87 needed!"
	},
	"r1172"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fuel_cell",
		"num"		: 20,
		"base_cost"	: 380,
		"desc"		: "Contribute Fuel Cells - 20 needed!"
	},
	"r1173"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tooberry_shake",
		"num"		: 55,
		"base_cost"	: 76,
		"desc"		: "Contribute Too-Berry Shakes - 55 needed!"
	},
	"r1174"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "engineering_1",
		"num"		: 201,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "assemble",
		"verb_past"	: "assembled",
		"desc"		: "Contribute work - 201 units needed with a Tinkertool and Engineering I"
	},
	"r1175"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_4",
		"num"		: 176,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "mine",
		"verb_past"	: "mined",
		"desc"		: "Contribute work - 176 units needed with a Fancy Pick and Mining IV"
	},
	"r1176"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 165,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 165 units needed with a Grinder and Refining II"
	}
};

var claim_reqs = {
	"r1264"	: {
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

//log.info("job_group_ph1_07.js LOADED");

// generated ok (NO DATE)
