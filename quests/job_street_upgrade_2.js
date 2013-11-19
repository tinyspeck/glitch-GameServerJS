var type = 2;
var title = "Upgrade {job_location} To Level 2";
var desc = "This street can be upgraded to the next level, which means MORE resources, MORE bling, and MORE fun!";
var completion = "<b>Upgrade this Street to Its Potential in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to upgrade that street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r190"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "",
		"num"		: 200,
		"base_cost"	: 9,
		"energy"	: 5,
		"wear"		: 3,
		"verb_name"	: "clear",
		"verb_past"	: "cleared",
		"desc"		: "Contribute work - 200 units needed with a Hatchet"
	},
	"r191"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 350,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 350 needed!"
	},
	"r192"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "beryl",
		"num"		: 250,
		"base_cost"	: 6,
		"desc"		: "Contribute Chunks of Beryl - 250 needed!"
	},
	"r194"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "element_green",
		"num"		: 2800,
		"base_cost"	: 0,
		"desc"		: "Contribute Green Elements - 2800 needed!"
	},
	"r193"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "elementhandling_1",
		"num"		: 150,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "amalgamate",
		"verb_past"	: "amalgamated",
		"desc"		: "Contribute work - 150 units needed with a Spice Mill and Element Handling"
	},
	"r195"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earthshaker",
		"num"		: 20,
		"base_cost"	: 152,
		"desc"		: "Contribute Earthshakers - 20 needed!"
	},
	"r196"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 1000,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 1000 needed!"
	},
	"r197"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fertilidust",
		"num"		: 5,
		"base_cost"	: 500,
		"desc"		: "Contribute Fertilidust - 5 needed!"
	},
	"r199"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "soil_appreciation_5",
		"num"		: 200,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "shake",
		"verb_past"	: "shook",
		"desc"		: "Contribute work - 200 units needed with a Cocktail Shaker and Soil Appreciation V"
	},
	"r198"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "item",
		"class_id"	: "piggy_egg",
		"num"		: 4,
		"base_cost"	: 300,
		"desc"		: "Contribute Piggy Eggs - 4 needed!"
	},
	"r200"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "item",
		"class_id"	: "butterfly_egg",
		"num"		: 3,
		"base_cost"	: 400,
		"desc"		: "Contribute Butterfly Eggs - 3 needed!"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(3000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(800 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(800 * multiplier));
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 3000,
	"mood"		: 800,
	"energy"	: 800
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(75, false, {type: 'job_complete_performance', job: this.class_tsid});
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
var performance_cutoff = 10;
var performance_rewards = {
	"xp"		: 75,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "A Special Gift",
			"count"		: 1
		}
	}
};

//log.info("job_street_upgrade_2.js LOADED");

// generated ok (NO DATE)
