var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r133"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "ginger",
		"num"		: 500,
		"base_cost"	: 4,
		"desc"		: "Contribute Ginger - 500 needed!"
	},
	"r134"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cheese_very_very_stinky",
		"num"		: 250,
		"base_cost"	: 33,
		"desc"		: "Contribute Very, Very Stinky Cheese - 250 needed!"
	},
	"r135"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "crying_gas",
		"num"		: 400,
		"base_cost"	: 20,
		"desc"		: "Contribute Crying Gas - 400 needed!"
	},
	"r136"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 20000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 20,000 needed!"
	},
	"r140"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle",
		"num"		: 500,
		"base_cost"	: 8,
		"desc"		: "Contribute Mortar Barnacles - 500 needed!"
	},
	"r138"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "",
		"num"		: 300,
		"base_cost"	: 15,
		"energy"	: 10,
		"wear"		: 3,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 300 units needed with a Hatchet"
	},
	"r139"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cloudberry_jam",
		"num"		: 200,
		"base_cost"	: 39,
		"desc"		: "Contribute Cloudberry Jam - 200 needed!"
	},
	"r141"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "paper",
		"num"		: 500,
		"base_cost"	: 2,
		"desc"		: "Contribute Sheets of Paper - 500 needed!"
	},
	"r142"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "banana",
		"num"		: 500,
		"base_cost"	: 10,
		"desc"		: "Contribute Bananas - 500 needed!"
	},
	"r143"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "molybdenum",
		"num"		: 200,
		"base_cost"	: 100,
		"desc"		: "Contribute Molybdenum Ingots - 200 needed!"
	},
	"r144"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "",
		"num"		: 600,
		"base_cost"	: 7,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "stir",
		"verb_past"	: "stired",
		"desc"		: "Contribute work - 600 units needed with a Alchemical Tongs"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(30000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(10000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(10000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(500 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(500 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 30000,
	"mood"		: 10000,
	"energy"	: 10000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 500
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(200, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(100);
	rewards.energy = pc.metabolics_add_energy(50);
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
var performance_cutoff = 10;
var performance_rewards = {
	"xp"		: 200,
	"mood"		: 100,
	"energy"	: 50,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard4_for_new_streets.js LOADED");

// generated ok (NO DATE)
