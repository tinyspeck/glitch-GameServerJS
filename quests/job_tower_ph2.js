var type = 1;
var title = "Design & Form";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r637"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hogtied_piggy",
		"num"		: 300,
		"base_cost"	: 500,
		"desc"		: "Contribute Hog-tied Piggies - 300 needed!"
	},
	"r638"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "brick",
		"num"		: 250,
		"base_cost"	: 280,
		"desc"		: "Contribute Bricks - 250 needed!"
	},
	"r639"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "engineering_1",
		"num"		: 600,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "design",
		"verb_past"	: "designed",
		"desc"		: "Contribute work - 600 units needed with a Knife & Board and Engineering I"
	},
	"r640"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_4",
		"num"		: 750,
		"base_cost"	: 9,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "form",
		"verb_past"	: "formed",
		"desc"		: "Contribute work - 750 units needed with a Tinkertool and Tinkering IV"
	},
	"r641"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "smelter",
		"class_ids"	: {
			"0"	: "smelter"
		},
		"skill"		: "smelting_1",
		"num"		: 825,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "melt",
		"verb_past"	: "melted",
		"desc"		: "Contribute work - 825 units needed with a Smelter and Smelting"
	},
	"r642"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "grade_a_earth_block",
		"num"		: 200,
		"base_cost"	: 95,
		"desc"		: "Contribute Grade A Earth Blocks - 200 needed!"
	},
	"r643"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_wood",
		"num"		: 225,
		"base_cost"	: 200,
		"desc"		: "Contribute Wood Tree Beans - 225 needed!"
	},
	"r644"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_crystal",
		"num"		: 300,
		"base_cost"	: 300,
		"desc"		: "Contribute Plain Crystals - 300 needed!"
	},
	"r645"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "alchemy_2",
		"num"		: 875,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "forge",
		"verb_past"	: "forged",
		"desc"		: "Contribute work - 875 units needed with a Alchemical Tongs and Alchemy II"
	},
	"r646"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "test_tube",
		"class_ids"	: {
			"0"	: "test_tube"
		},
		"skill"		: "remoteherdkeeping_1",
		"num"		: 650,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "entice",
		"verb_past"	: "enticed",
		"desc"		: "Contribute work - 650 units needed with a Test Tube and Remote Herdkeeping"
	},
	"r647"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "animalkinship_6",
		"num"		: 775,
		"base_cost"	: 11,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "nurture",
		"verb_past"	: "nurtured",
		"desc"		: "Contribute work - 775 units needed with a Watering Can and Animal Kinship VI"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(22500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
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
	"xp"		: 22500,
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

//log.info("job_tower_ph2.js LOADED");

// generated ok (NO DATE)
