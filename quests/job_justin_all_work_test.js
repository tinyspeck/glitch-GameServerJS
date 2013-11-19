var type = 1;
var title = "work only";
var desc = "do the work!";
var completion = "you did the work!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r682"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "light_green_thumb_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "activate",
		"verb_past"	: "activated",
		"desc"		: "Contribute work - 5 units needed with a Hoe and Light Green Thumb I"
	},
	"r686"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "pick",
		"class_ids"	: {
			"0"	: "pick"
		},
		"skill"		: "mining_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "mine",
		"verb_past"	: "mined",
		"desc"		: "Contribute work - 5 units needed with a Pick and Mining I"
	},
	"r683"	: {
		"bucket_id"	: "1",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "jellisac_hands_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "add a note",
		"verb_past"	: "added a note to",
		"desc"		: "Contribute work - 5 units needed with a Scraper and Jellisac Hands"
	},
	"r684"	: {
		"bucket_id"	: "1",
		"group_id"	: "4",
		"type"		: "work",
		"class_id"	: "cocktail_shaker",
		"class_ids"	: {
			"0"	: "cocktail_shaker"
		},
		"skill"		: "cocktailcrafting_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Contribute work - 5 units needed with a Cocktail Shaker and Cocktail Crafting I"
	},
	"r687"	: {
		"bucket_id"	: "1",
		"group_id"	: "5",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "admire",
		"verb_past"	: "admired",
		"desc"		: "Contribute work - 5 units needed with a Blender and Blending I"
	},
	"r685"	: {
		"bucket_id"	: "1",
		"group_id"	: "6",
		"type"		: "work",
		"class_id"	: "frying_pan",
		"class_ids"	: {
			"0"	: "frying_pan"
		},
		"skill"		: "cheffery_1",
		"num"		: 5,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "amalgamate",
		"verb_past"	: "amalgamated",
		"desc"		: "Contribute work - 5 units needed with a Frying Pan and Cheffery I"
	},
	"r692"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "animalkinship_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "apply",
		"verb_past"	: "applyed",
		"desc"		: "Contribute work - 5 units needed with a Shovel and Animal Kinship I"
	},
	"r693"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "saucepan",
		"class_ids"	: {
			"0"	: "saucepan"
		},
		"skill"		: "saucery_1",
		"num"		: 5,
		"base_cost"	: 6,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "attract",
		"verb_past"	: "attracted",
		"desc"		: "Contribute work - 5 units needed with a Saucepan and Saucery I"
	},
	"r694"	: {
		"bucket_id"	: "2",
		"group_id"	: "3",
		"type"		: "work",
		"class_id"	: "quill",
		"class_ids"	: {
			"0"	: "quill"
		},
		"skill"		: "penmanship_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "kick",
		"verb_past"	: "kicked",
		"desc"		: "Contribute work - 5 units needed with a Quill and Penpersonship I"
	},
	"r695"	: {
		"bucket_id"	: "2",
		"group_id"	: "4",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "bury",
		"verb_past"	: "buried",
		"desc"		: "Contribute work - 5 units needed with a Grinder and Refining I"
	},
	"r696"	: {
		"bucket_id"	: "2",
		"group_id"	: "5",
		"type"		: "work",
		"class_id"	: "crystallizer",
		"class_ids"	: {
			"0"	: "crystallizer"
		},
		"skill"		: "crystalography_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: null,
		"verb_past"	: null,
		"desc"		: "Contribute work - 5 units needed with a Crystalmalizing Chamber and Crystallography I"
	},
	"r697"	: {
		"bucket_id"	: "2",
		"group_id"	: "6",
		"type"		: "work",
		"class_id"	: "gassifier",
		"class_ids"	: {
			"0"	: "gassifier"
		},
		"skill"		: "gasmogrification_1",
		"num"		: 5,
		"base_cost"	: 5,
		"energy"	: 2,
		"wear"		: 1,
		"verb_name"	: "amalgamate",
		"verb_past"	: "amalgamated",
		"desc"		: "Contribute work - 5 units needed with a Gassifier and Gasmogrification"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(10 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(10 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(10 * multiplier));
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 10,
	"currants"	: 10,
	"mood"		: 10
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(10, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(10, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(10);
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var performance_percent = 5;
var performance_cutoff = 0;
var performance_rewards = {
	"xp"		: 10,
	"currants"	: 10,
	"mood"		: 10
};

//log.info("job_justin_all_work_test.js LOADED");

// generated ok (NO DATE)
