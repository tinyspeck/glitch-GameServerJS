var type = 2;
var title = "Upgrade {job_location} To Level 1";
var desc = "This street can be upgraded to the next level, which means MORE resources, MORE bling, and MORE fun!";
var completion = "<b>Upgrade this Street to Its Potential in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to upgrade that street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r48"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "",
		"num"		: 120,
		"base_cost"	: 11,
		"energy"	: 8,
		"wear"		: 1,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 120 units needed with a Hoe"
	},
	"r14"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 250,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 250 needed!"
	},
	"r15"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "dullite",
		"num"		: 300,
		"base_cost"	: 4,
		"desc"		: "Contribute Chunks of Dullite - 300 needed!"
	},
	"r18"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "element_red",
		"num"		: 2500,
		"base_cost"	: 0,
		"desc"		: "Contribute Red Elements - 2500 needed!"
	},
	"r21"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "light_green_thumb_2",
		"num"		: 200,
		"base_cost"	: 9,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Contribute work - 200 units needed with a Watering Can and Light Green Thumb II"
	},
	"r16"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "laughing_gas",
		"num"		: 70,
		"base_cost"	: 20,
		"desc"		: "Contribute Laughing Gas - 70 needed!"
	},
	"r17"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "simple_bbq",
		"num"		: 60,
		"base_cost"	: 86,
		"desc"		: "Contribute Simple BBQs - 60 needed!"
	},
	"r19"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "butterfly_egg",
		"num"		: 3,
		"base_cost"	: 400,
		"desc"		: "Contribute Butterfly Eggs - 3 needed!"
	},
	"r20"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_fruit",
		"num"		: 5,
		"base_cost"	: 150,
		"desc"		: "Contribute Fruit Tree Beans - 5 needed!"
	},
	"r22"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 300,
		"base_cost"	: 13,
		"energy"	: 7,
		"wear"		: 1,
		"verb_name"	: "process",
		"verb_past"	: "processed",
		"desc"		: "Contribute work - 300 units needed with a Blender and Blending II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(4000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(2000 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(2000 * multiplier));
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 4000,
	"currants"	: 2000,
	"mood"		: 2000
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(50, false, {type: 'job_complete_performance', job: this.class_tsid});
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
	"xp"		: 50,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "Champions' Chest of Random Rewards",
			"count"		: 1
		}
	}
};

//log.info("job_standard1_for_street_upgrades.js LOADED");

// generated ok (NO DATE)
