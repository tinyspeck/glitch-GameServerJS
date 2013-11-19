var type = 3;
var title = "Veggie Adventure_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1237"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "big_salad",
		"num"		: 45,
		"base_cost"	: 58,
		"desc"		: "Contribute Big Salads - 45 needed!"
	},
	"r1238"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "choice_crudites",
		"num"		: 40,
		"base_cost"	: 42,
		"desc"		: "Contribute Choice Crudites - 40 needed!"
	},
	"r1239"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "greasy_frybread",
		"num"		: 50,
		"base_cost"	: 53,
		"desc"		: "Contribute Greasy Frybreads - 50 needed!"
	},
	"r1240"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "test_tube",
		"class_ids"	: {
			"0"	: "test_tube"
		},
		"skill"		: "ezcooking_2",
		"num"		: 123,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "experiment",
		"verb_past"	: "experimented",
		"desc"		: "Contribute work - 123 units needed with a Test Tube and EZ Cooking II"
	},
	"r1241"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "frying_pan",
		"class_ids"	: {
			"0"	: "frying_pan"
		},
		"skill"		: "cheffery_3",
		"num"		: 132,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "fry",
		"verb_past"	: "fried",
		"desc"		: "Contribute work - 132 units needed with a Frying Pan and Cheffery III"
	},
	"r1242"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_1",
		"num"		: 156,
		"base_cost"	: 14,
		"energy"	: 7,
		"wear"		: 2,
		"verb_name"	: "amalgamate",
		"verb_past"	: "amalgamated",
		"desc"		: "Contribute work - 156 units needed with a Awesome Pot and Master Chef I"
	},
	"r1243"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "lazy_salad",
		"num"		: 43,
		"base_cost"	: 38,
		"desc"		: "Contribute Lazy Salads - 43 needed!"
	},
	"r1244"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "papl_upside_down_pizza",
		"num"		: 39,
		"base_cost"	: 98,
		"desc"		: "Contribute Pineapple Upside-Down Pizzas - 39 needed!"
	},
	"r1245"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "spicy_grog",
		"num"		: 31,
		"base_cost"	: 51,
		"desc"		: "Contribute Spicy Grogs - 31 needed!"
	},
	"r1246"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "egg_seasoner",
		"class_ids"	: {
			"0"	: "egg_seasoner"
		},
		"skill"		: "animalhusbandry_1",
		"num"		: 154,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "sprinkle",
		"verb_past"	: "sprinkled",
		"desc"		: "Contribute work - 154 units needed with a Egg Seasoner and Animal Husbandry"
	},
	"r1247"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "smelting_1",
		"num"		: 165,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "melt",
		"verb_past"	: "melted",
		"desc"		: "Contribute work - 165 units needed with a Smelter and Smelting"
	},
	"r1248"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "crystallizer",
		"class_ids"	: {
			"0"	: "crystallizer"
		},
		"skill"		: "crystalography_1",
		"num"		: 188,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "consecrate",
		"verb_past"	: "consecrated",
		"desc"		: "Contribute work - 188 units needed with a Crystalmalizing Chamber and Crystallography I"
	}
};

var claim_reqs = {
	"r1279"	: {
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

//log.info("job_group_ph5_03.js LOADED");

// generated ok (NO DATE)
