var type = 3;
var title = "Sam's Breakfast_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1249"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "green_eggs",
		"num"		: 40,
		"base_cost"	: 12,
		"desc"		: "Contribute Green Eggs - 40 needed!"
	},
	"r1250"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "flummery",
		"num"		: 23,
		"base_cost"	: 99,
		"desc"		: "Contribute Flummerys - 23 needed!"
	},
	"r1251"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "savory_smoothie",
		"num"		: 21,
		"base_cost"	: 96,
		"desc"		: "Contribute Savory Smoothies - 21 needed!"
	},
	"r1252"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fruit_changing_machine",
		"class_ids"	: {
			"0"	: "fruit_changing_machine"
		},
		"skill"		: "fruitchanging_1",
		"num"		: 174,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "convert",
		"verb_past"	: "converted",
		"desc"		: "Contribute work - 174 units needed with a Fruit Changing Machine and Fruit Changing"
	},
	"r1253"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "frying_pan",
		"class_ids"	: {
			"0"	: "frying_pan"
		},
		"skill"		: "cheffery_3",
		"num"		: 187,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "sizzle",
		"verb_past"	: "sizzled",
		"desc"		: "Contribute work - 187 units needed with a Frying Pan and Cheffery III"
	},
	"r1254"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "ezcooking_1",
		"num"		: 165,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "mince",
		"verb_past"	: "minced",
		"desc"		: "Contribute work - 165 units needed with a Hatchet and EZ Cooking I"
	},
	"r1255"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fruity_juice",
		"num"		: 61,
		"base_cost"	: 24,
		"desc"		: "Contribute Fruity Juices - 61 needed!"
	},
	"r1256"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bubble_and_squeak",
		"num"		: 41,
		"base_cost"	: 60,
		"desc"		: "Contribute Bubble and Squeaks - 41 needed!"
	},
	"r1257"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "creamy_catsup",
		"num"		: 45,
		"base_cost"	: 64,
		"desc"		: "Contribute Creamy Catsups - 45 needed!"
	},
	"r1258"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "bean_seasoner",
		"class_ids"	: {
			"0"	: "bean_seasoner"
		},
		"skill"		: "botany_1",
		"num"		: 176,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "season",
		"verb_past"	: "seasoned",
		"desc"		: "Contribute work - 176 units needed with a Bean Seasoner and Botany"
	},
	"r1259"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 165,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 165 units needed with a Spice Mill and Spice Milling"
	},
	"r1260"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_1",
		"num"		: 187,
		"base_cost"	: 12,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 187 units needed with a Awesome Pot and Master Chef I"
	}
};

var claim_reqs = {
	"r1280"	: {
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

//log.info("job_group_ph5_04.js LOADED");

// generated ok (NO DATE)
