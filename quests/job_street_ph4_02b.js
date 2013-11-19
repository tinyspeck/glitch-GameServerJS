var type = 1;
var title = "Backroom Dealings";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r449"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cheese_plate",
		"num"		: 100,
		"base_cost"	: 58,
		"desc"		: "Contribute Cheese Plates - 100 needed!"
	},
	"r450"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cosmapolitan",
		"num"		: 50,
		"base_cost"	: 131,
		"desc"		: "Contribute Cosma-politans - 50 needed!"
	},
	"r451"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "no_no_powder",
		"num"		: 75,
		"base_cost"	: 100,
		"desc"		: "Contribute Flaps of No-No Powder - 75 needed!"
	},
	"r452"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 400,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 400 units needed with a Blender and Blending II"
	},
	"r453"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_1",
		"num"		: 500,
		"base_cost"	: 13,
		"energy"	: 7,
		"wear"		: 2,
		"verb_name"	: "shake",
		"verb_past"	: "shook",
		"desc"		: "Contribute work - 500 units needed with a Cocktail Shaker and Cocktail Crafting I"
	},
	"r454"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "cheffery_2",
		"num"		: 375,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "cut",
		"verb_past"	: "cut",
		"desc"		: "Contribute work - 375 units needed with a Knife & Board and Cheffery II"
	},
	"r455"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "flaming_humbaba",
		"num"		: 50,
		"base_cost"	: 168,
		"desc"		: "Contribute Flaming Humbabas - 50 needed!"
	},
	"r456"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10000,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 10,000 needed!"
	},
	"r457"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_building_permit",
		"num"		: 10,
		"base_cost"	: 500,
		"desc"		: "Contribute General Building Permits - 10 needed!"
	},
	"r458"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "alchemy_2",
		"num"		: 375,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "cook",
		"verb_past"	: "cooked",
		"desc"		: "Contribute work - 375 units needed with a Beaker and Alchemy II"
	},
	"r459"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "bureaucraticarts_2",
		"num"		: 425,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "charm",
		"verb_past"	: "charmed",
		"desc"		: "Contribute work - 425 units needed with a Focusing Orb and Bureaucratic Arts II"
	},
	"r460"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "penmanship_1",
		"num"		: 500,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "forge",
		"verb_past"	: "forged",
		"desc"		: "Contribute work - 500 units needed with a Quill and Penpersonship I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(7500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(7500 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(7500 * multiplier));
	pc.stats_add_favor_points("all", Math.round(150 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(150 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 7500,
	"mood"		: 7500,
	"energy"	: 7500,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 150
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

//log.info("job_street_ph4_02b.js LOADED");

// generated ok (NO DATE)
