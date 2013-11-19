var type = 3;
var title = "Finish Up and Party On_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1177"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "juicy_carpaccio",
		"num"		: 28,
		"base_cost"	: 56,
		"desc"		: "Contribute Juicy Carpaccios - 28 needed!"
	},
	"r1178"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "eggy_scramble",
		"num"		: 52,
		"base_cost"	: 32,
		"desc"		: "Contribute Eggy Scrambles - 52 needed!"
	},
	"r1179"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pungent_sunrise",
		"num"		: 17,
		"base_cost"	: 197,
		"desc"		: "Contribute Pungent Sunrises - 17 needed!"
	},
	"r1180"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "mike_tyson_grill",
		"class_ids"	: {
			"0"	: "mike_tyson_grill"
		},
		"skill"		: "grilling_2",
		"num"		: 134,
		"base_cost"	: 13,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "grill",
		"verb_past"	: "grilled",
		"desc"		: "Contribute work - 134 units needed with a Famous Pugilist Grill and Grilling II"
	},
	"r1181"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "knife_and_board",
		"class_ids"	: {
			"0"	: "knife_and_board"
		},
		"skill"		: "masterchef_2",
		"num"		: 112,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 3,
		"verb_name"	: "prepare",
		"verb_past"	: "prepared",
		"desc"		: "Contribute work - 112 units needed with a Knife & Board and Master Chef II"
	},
	"r1182"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_2",
		"num"		: 122,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "shake",
		"verb_past"	: "shook",
		"desc"		: "Contribute work - 122 units needed with a Cocktail Shaker and Cocktail Crafting II"
	},
	"r1183"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "creamy_martini",
		"num"		: 24,
		"base_cost"	: 60,
		"desc"		: "Contribute Creamy Martinis - 24 needed!"
	},
	"r1184"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earthshaker",
		"num"		: 19,
		"base_cost"	: 152,
		"desc"		: "Contribute Earthshakers - 19 needed!"
	},
	"r1185"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "scrumptious_frittata",
		"num"		: 55,
		"base_cost"	: 62,
		"desc"		: "Contribute Scrumptious Frittatas - 55 needed!"
	},
	"r1186"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_2",
		"num"		: 187,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 3,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 187 units needed with a Blender and Blending II"
	},
	"r1187"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "transcendental_radiation_1",
		"num"		: 130,
		"base_cost"	: 9,
		"energy"	: 4,
		"wear"		: 2,
		"verb_name"	: "radiate",
		"verb_past"	: "radiated",
		"desc"		: "Contribute work - 130 units needed with a Focusing Orb and Transcendental Radiation I"
	},
	"r1188"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 165,
		"base_cost"	: 13,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "convert",
		"verb_past"	: "converted",
		"desc"		: "Contribute work - 165 units needed with a Spice Mill and Spice Milling"
	}
};

var claim_reqs = {
	"r1269"	: {
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

//log.info("job_group_ph2_07.js LOADED");

// generated ok (NO DATE)
