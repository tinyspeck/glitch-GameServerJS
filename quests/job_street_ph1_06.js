var type = 1;
var title = "Get Fueled and Make a Plan";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r747"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fuel_cell",
		"num"		: 36,
		"base_cost"	: 380,
		"desc"		: "Contribute Fuel Cells - 36 needed!"
	},
	"r748"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "scrumptious_frittata",
		"num"		: 324,
		"base_cost"	: 62,
		"desc"		: "Contribute Scrumptious Frittatas - 324 needed!"
	},
	"r749"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "potato_patty",
		"num"		: 412,
		"base_cost"	: 33,
		"desc"		: "Contribute Potato Patties - 412 needed!"
	},
	"r750"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "bureaucraticarts_2",
		"num"		: 1250,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 3,
		"verb_name"	: "sign",
		"verb_past"	: "signed",
		"desc"		: "Contribute work - 1,250 units needed with a Quill and Bureaucratic Arts II"
	},
	"r751"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "test_tube",
		"class_ids"	: {
			"0"	: "test_tube"
		},
		"skill"		: "intermediateadmixing_1",
		"num"		: 1125,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "experiment",
		"verb_past"	: "experimented",
		"desc"		: "Contribute work - 1,125 units needed with a Test Tube and Intermediate Admixing"
	},
	"r752"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "bubble_tuner",
		"class_ids"	: {
			"0"	: "bubble_tuner"
		},
		"skill"		: "engineering_1",
		"num"		: 1010,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "construct",
		"verb_past"	: "constructed",
		"desc"		: "Contribute work - 1,010 units needed with a Bubble Tuner and Engineering I"
	},
	"r753"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "spinach_salad",
		"num"		: 685,
		"base_cost"	: 18,
		"desc"		: "Contribute Spinach Salads - 685 needed!"
	},
	"r754"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fertilidust_lite",
		"num"		: 90,
		"base_cost"	: 200,
		"desc"		: "Contribute Fertilidust Lite - 90 needed!"
	},
	"r755"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tooberry_shake",
		"num"		: 159,
		"base_cost"	: 76,
		"desc"		: "Contribute Too-Berry Shakes - 159 needed!"
	},
	"r756"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "alchemy_2",
		"num"		: 880,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "examine",
		"verb_past"	: "examined",
		"desc"		: "Contribute work - 880 units needed with a Alchemical Tongs and Alchemy II"
	},
	"r757"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "focused_meditation_1",
		"num"		: 1820,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "meditate",
		"verb_past"	: "meditated",
		"desc"		: "Contribute work - 1,820 units needed with a Focusing Orb and Focused Meditation"
	},
	"r758"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "fuelmaking_1",
		"num"		: 970,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "prepare",
		"verb_past"	: "prepared",
		"desc"		: "Contribute work - 970 units needed with a Beaker and Fuelmaking"
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

//log.info("job_street_ph1_06.js LOADED");

// generated ok (NO DATE)
