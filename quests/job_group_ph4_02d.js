var type = 3;
var title = "Clusterfudge_Group";
var desc = "This project is for creating a new group-owned location linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 180;
var claimable = 1;

var requirements = {
	"r1057"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "berry_bowl",
		"num"		: 23,
		"base_cost"	: 46,
		"desc"		: "Contribute Berry Bowls - 23 needed!"
	},
	"r1058"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cloudberry_daiquiri",
		"num"		: 31,
		"base_cost"	: 142,
		"desc"		: "Contribute Cloudberry Daiquiris - 31 needed!"
	},
	"r1059"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "powder_of_startling_fecundity",
		"num"		: 4,
		"base_cost"	: 1500,
		"desc"		: "Contribute Powder of Startling Fecundity - 4 needed!"
	},
	"r1060"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "focused_meditation_1",
		"num"		: 133,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "meditate",
		"verb_past"	: "meditated",
		"desc"		: "Contribute work - 133 units needed with a Focusing Orb and Focused Meditation"
	},
	"r1061"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "alchemy_2",
		"num"		: 143,
		"base_cost"	: 14,
		"energy"	: 7,
		"wear"		: 2,
		"verb_name"	: "convert",
		"verb_past"	: "converted",
		"desc"		: "Contribute work - 143 units needed with a Alchemical Tongs and Alchemy II"
	},
	"r1062"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "tinkertool",
		"class_ids"	: {
			"0"	: "tinkertool"
		},
		"skill"		: "tinkering_3",
		"num"		: 154,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "form",
		"verb_past"	: "formed",
		"desc"		: "Contribute work - 154 units needed with a Tinkertool and Tinkering III"
	},
	"r1063"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "exotic_juice",
		"num"		: 34,
		"base_cost"	: 54,
		"desc"		: "Contribute Exotic Juices - 34 needed!"
	},
	"r1064"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 2500,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 2,500 needed!"
	},
	"r1065"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cheese_plate",
		"num"		: 40,
		"base_cost"	: 58,
		"desc"		: "Contribute Cheese Plates - 40 needed!"
	},
	"r1066"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "intermediateadmixing_1",
		"num"		: 134,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "convert",
		"verb_past"	: "converted",
		"desc"		: "Contribute work - 134 units needed with a Beaker and Intermediate Admixing"
	},
	"r1067"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 154,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 154 units needed with a Spice Mill and Spice Milling"
	},
	"r1068"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "penmanship_1",
		"num"		: 160,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "forge",
		"verb_past"	: "forged",
		"desc"		: "Contribute work - 160 units needed with a Quill and Penpersonship I"
	}
};

var claim_reqs = {
	"r1274"	: {
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

//log.info("job_group_ph4_02d.js LOADED");

// generated ok (NO DATE)
