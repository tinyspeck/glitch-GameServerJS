var type = 1;
var title = "Base Completion";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r660"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 500000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 500,000 needed!"
	},
	"r662"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 100,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 100 needed!"
	},
	"r661"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_4",
		"num"		: 1111,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 3,
		"verb_name"	: "refine",
		"verb_past"	: "refined",
		"desc"		: "Contribute work - 1,111 units needed with a Fancy Pick and Mining IV"
	},
	"r663"	: {
		"bucket_id"	: "1",
		"group_id"	: "4",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 1500,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "fill",
		"verb_past"	: "filled",
		"desc"		: "Contribute work - 1,500 units needed with a Shovel and Soil Appreciation III"
	},
	"r666"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 500000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 500,000 needed!"
	},
	"r669"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "item",
		"class_id"	: "grade_aaa_earth_block",
		"num"		: 100,
		"base_cost"	: 210,
		"desc"		: "Contribute Grade AAA Earth Block - 100 needed!"
	},
	"r668"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "bureaucraticarts_2",
		"num"		: 1111,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "sign",
		"verb_past"	: "signed",
		"desc"		: "Contribute work - 1,111 units needed with a Quill and Bureaucratic Arts II"
	},
	"r670"	: {
		"bucket_id"	: "2",
		"group_id"	: "4",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_2",
		"num"		: 1600,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "celebrate",
		"verb_past"	: "celebrated",
		"desc"		: "Contribute work - 1,600 units needed with a Cocktail Shaker and Cocktail Crafting II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(500000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(22500 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(22500 * multiplier));
	pc.stats_add_favor_points("all", Math.round(450 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(450 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 500000,
	"mood"		: 22500,
	"energy"	: 22500,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 450
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(150, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(60);
	rewards.energy = pc.metabolics_add_energy(30);
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
var performance_cutoff = 11;
var performance_rewards = {
	"xp"		: 150,
	"mood"		: 60,
	"energy"	: 30,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_rewards_a",
			"label"		: "a special gift",
			"count"		: 1
		}
	}
};

//log.info("job_tower_ph4.js LOADED");

// generated ok (NO DATE)
