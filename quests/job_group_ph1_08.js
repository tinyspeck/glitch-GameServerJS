var type = 3;
var title = "Deal with the Drudgery_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1189"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hearty_groddle_sammich",
		"num"		: 44,
		"base_cost"	: 93,
		"desc"		: "Contribute Hearty Groddle Sammiches - 44 needed!"
	},
	"r1190"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "carrot_margarita",
		"num"		: 50,
		"base_cost"	: 90,
		"desc"		: "Contribute Carrot Margaritas - 50 needed!"
	},
	"r1191"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "peat",
		"num"		: 175,
		"base_cost"	: 12,
		"desc"		: "Contribute Blocks of Peat - 175 needed!"
	},
	"r1192"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "smelting_1",
		"num"		: 178,
		"base_cost"	: 15,
		"energy"	: 7,
		"wear"		: 4,
		"verb_name"	: "smelt",
		"verb_past"	: "smelted",
		"desc"		: "Contribute work - 178 units needed with a Smelter and Smelting"
	},
	"r1193"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 199,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 199 units needed with a Grinder and Refining II"
	},
	"r1194"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_2",
		"num"		: 165,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "mine",
		"verb_past"	: "mined",
		"desc"		: "Contribute work - 165 units needed with a Fancy Pick and Mining II"
	},
	"r1195"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "chillybusting_chili",
		"num"		: 40,
		"base_cost"	: 142,
		"desc"		: "Contribute Chilly-Busting Chilis - 40 needed!"
	},
	"r1196"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "proper_rice",
		"num"		: 77,
		"base_cost"	: 26,
		"desc"		: "Contribute Proper Rice - 77 needed!"
	},
	"r1197"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "meat_gumbo",
		"num"		: 50,
		"base_cost"	: 93,
		"desc"		: "Contribute Meat Gumbos - 50 needed!"
	},
	"r1198"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "engineering_1",
		"num"		: 147,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "assemble",
		"verb_past"	: "assembled",
		"desc"		: "Contribute work - 147 units needed with a Tinkertool and Engineering I"
	},
	"r1199"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 180,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "tend",
		"verb_past"	: "tended",
		"desc"		: "Contribute work - 180 units needed with a Hoe and Soil Appreciation III"
	},
	"r1200"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "gardening_3",
		"num"		: 137,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 137 units needed with a Shovel and Arborology III"
	}
};

var claim_reqs = {
	"r1265"	: {
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

//log.info("job_group_ph1_08.js LOADED");

// generated ok (NO DATE)
