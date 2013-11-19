var type = 1;
var title = "Celebratory Soirée";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r771"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "juicy_carpaccio",
		"num"		: 250,
		"base_cost"	: 56,
		"desc"		: "Contribute Juicy Carpaccios - 250 needed!"
	},
	"r772"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cheese_plate",
		"num"		: 425,
		"base_cost"	: 58,
		"desc"		: "Contribute Cheese Plates - 425 needed!"
	},
	"r773"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "exotic_fruit_salad",
		"num"		: 354,
		"base_cost"	: 33,
		"desc"		: "Contribute Exotic Fruit Salads - 354 needed!"
	},
	"r774"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_2",
		"num"		: 1197,
		"base_cost"	: 13,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "radiate",
		"verb_past"	: "radiated",
		"desc"		: "Contribute work - 1,197 units needed with a Awesome Pot and Master Chef II"
	},
	"r775"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "mike_tyson_grill",
		"class_ids"	: {
			"0"	: "mike_tyson_grill"
		},
		"skill"		: "grilling_2",
		"num"		: 1250,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "grill",
		"verb_past"	: "grilled",
		"desc"		: "Contribute work - 1,250 units needed with a Famous Pugilist Grill and Grilling II"
	},
	"r776"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 987,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 987 units needed with a Blender and Blending II"
	},
	"r777"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "sparkle_powder",
		"num"		: 40,
		"base_cost"	: 450,
		"desc"		: "Contribute Sparkle Powder - 40 needed!"
	},
	"r778"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "laughing_gas",
		"num"		: 527,
		"base_cost"	: 20,
		"desc"		: "Contribute Laughing Gas - 527 needed!"
	},
	"r779"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "applejack",
		"num"		: 470,
		"base_cost"	: 25,
		"desc"		: "Contribute Applejacks - 470 needed!"
	},
	"r780"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "saucepan",
		"class_ids"	: {
			"0"	: "saucepan"
		},
		"skill"		: "saucery_2",
		"num"		: 866,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "simmer",
		"verb_past"	: "simmered",
		"desc"		: "Contribute work - 866 units needed with a Saucepan and Saucery II"
	},
	"r781"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_1",
		"num"		: 1044,
		"base_cost"	: 9,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "shake",
		"verb_past"	: "shook",
		"desc"		: "Contribute work - 1,044 units needed with a Cocktail Shaker and Cocktail Crafting I"
	},
	"r782"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "cheffery_3",
		"num"		: 725,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "chop",
		"verb_past"	: "chopped",
		"desc"		: "Contribute work - 725 units needed with a Knife & Board and Cheffery III"
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

//log.info("job_street_ph3_06.js LOADED");

// generated ok (NO DATE)
