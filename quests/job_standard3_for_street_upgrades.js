var type = 2;
var title = "Upgrade {job_location} To Level 3";
var desc = "This street can be upgraded to the next level, which means MORE resources, MORE bling, and MORE fun!";
var completion = "<b>Upgrade this Street to Its Potential in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to upgrade that street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r51"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "soil_appreciation_1",
		"num"		: 500,
		"base_cost"	: 5,
		"energy"	: 3,
		"wear"		: 0,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 500 units needed with a Watering Can and Soil Appreciation I"
	},
	"r34"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 500,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 500 needed!"
	},
	"r35"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "sparkly",
		"num"		: 250,
		"base_cost"	: 8,
		"desc"		: "Contribute Chunks of Sparkly - 250 needed!"
	},
	"r40"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "element_shiny",
		"num"		: 3000,
		"base_cost"	: 1,
		"desc"		: "Contribute Shiny Elements - 3000 needed!"
	},
	"r49"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 250,
		"base_cost"	: 14,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "pulverize",
		"verb_past"	: "pulverized",
		"desc"		: "Contribute work - 250 units needed with a Grinder and Refining II"
	},
	"r42"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "apple",
		"num"		: 350,
		"base_cost"	: 5,
		"desc"		: "Contribute Apples - 350 needed!"
	},
	"r52"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "egg_plain",
		"num"		: 400,
		"base_cost"	: 5,
		"desc"		: "Contribute Eggs - 400 needed!"
	},
	"r55"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "potato",
		"num"		: 275,
		"base_cost"	: 7,
		"desc"		: "Contribute Potatoes - 275 needed!"
	},
	"r54"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "egg_seasoner",
		"class_ids"	: {
			"0"	: "egg_seasoner"
		},
		"skill"		: "animalhusbandry_1",
		"num"		: 225,
		"base_cost"	: 8,
		"energy"	: 5,
		"wear"		: 0,
		"verb_name"	: "upgrade",
		"verb_past"	: "upgraded",
		"desc"		: "Contribute work - 225 units needed with a Egg Seasoner and Animal Husbandry"
	},
	"r53"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "item",
		"class_id"	: "yummy_gruel",
		"num"		: 20,
		"base_cost"	: 134,
		"desc"		: "Contribute Yummy Gruels - 20 needed!"
	},
	"r46"	: {
		"bucket_id"	: "2",
		"group_id"	: "4",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_2",
		"num"		: 500,
		"base_cost"	: 8,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "swirl",
		"verb_past"	: "swirled",
		"desc"		: "Contribute work - 500 units needed with a Awesome Pot and Master Chef II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(4000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(1000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(1000 * multiplier));
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 4000,
	"mood"		: 1000,
	"energy"	: 1000
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(100, false, {type: 'job_complete_performance', job: this.class_tsid});
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
var performance_cutoff = 10;
var performance_rewards = {
	"xp"		: 100,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "Champions' Chest of Random Rewards",
			"count"		: 1
		}
	}
};

//log.info("job_standard3_for_street_upgrades.js LOADED");

// generated ok (NO DATE)
