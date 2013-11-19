var type = 1;
var title = "Draft and Focus";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r698"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fruity_juice",
		"num"		: 525,
		"base_cost"	: 24,
		"desc"		: "Contribute Fruity Juices - 525 needed!"
	},
	"r699"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "fortifying_gruel",
		"num"		: 125,
		"base_cost"	: 191,
		"desc"		: "Contribute Fortifying Gruels - 125 needed!"
	},
	"r700"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "barnacle_talc",
		"num"		: 750,
		"base_cost"	: 15,
		"desc"		: "Contribute Barnacle Talc - 750 needed!"
	},
	"r701"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_3",
		"num"		: 850,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "focus energy",
		"verb_past"	: "focused energy",
		"desc"		: "Contribute work - 850 units needed with a Focusing Orb and Meditative Arts III"
	},
	"r702"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "bureaucraticarts_2",
		"num"		: 1177,
		"base_cost"	: 12,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "authorize",
		"verb_past"	: "authorized",
		"desc"		: "Contribute work - 1,177 units needed with a Quill and Bureaucratic Arts II"
	},
	"r703"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "alchemical_tongs",
		"class_ids"	: {
			"0"	: "alchemical_tongs"
		},
		"skill"		: "alchemy_2",
		"num"		: 825,
		"base_cost"	: 13,
		"energy"	: 6,
		"wear"		: 1,
		"verb_name"	: "experiment",
		"verb_past"	: "experimented",
		"desc"		: "Contribute work - 825 units needed with a Alchemical Tongs and Alchemy II"
	},
	"r704"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "note",
		"num"		: 2200,
		"base_cost"	: 4,
		"desc"		: "Contribute Notes - 2200 needed!"
	},
	"r705"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "super_veggie_kebabs",
		"num"		: 450,
		"base_cost"	: 58,
		"desc"		: "Contribute Super Veggie Kebabs - 450 needed!"
	},
	"r706"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "powder_of_mild_fecundity",
		"num"		: 50,
		"base_cost"	: 500,
		"desc"		: "Contribute Powder of Mild Fecundity - 50 needed!"
	},
	"r707"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "crystallizer",
		"class_ids"	: {
			"0"	: "crystallizer"
		},
		"skill"		: "crystalography_1",
		"num"		: 960,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "crystalmalize",
		"verb_past"	: "crystalmalized",
		"desc"		: "Contribute work - 960 units needed with a Crystalmalizing Chamber and Crystallography I"
	},
	"r708"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "test_tube",
		"class_ids"	: {
			"0"	: "test_tube"
		},
		"skill"		: "betterlearning_5",
		"num"		: 1242,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "inspect",
		"verb_past"	: "inspected",
		"desc"		: "Contribute work - 1,242 units needed with a Test Tube and Better Learning V"
	},
	"r709"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_2",
		"num"		: 850,
		"base_cost"	: 14,
		"energy"	: 6,
		"wear"		: 2,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 850 units needed with a Grinder and Refining II"
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

//log.info("job_street_ph1_03.js LOADED");

// generated ok (NO DATE)
