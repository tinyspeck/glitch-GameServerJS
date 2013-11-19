var type = 1;
var title = "Fruit 1 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1313"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "banana",
		"num"		: 1274,
		"base_cost"	: 10,
		"desc"		: "Contribute Bananas - 1274 needed!"
	},
	"r1314"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "lemon",
		"num"		: 1554,
		"base_cost"	: 5,
		"desc"		: "Contribute Lemons - 1554 needed!"
	},
	"r1315"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "strawberry",
		"num"		: 1656,
		"base_cost"	: 4,
		"desc"		: "Contribute Strawberries - 1656 needed!"
	},
	"r1316"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fruit_changing_machine",
		"class_ids"	: {
			"0"	: "fruit_changing_machine"
		},
		"skill"		: "fruitchanging_1",
		"num"		: 3800,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 3,800 units needed with a Fruit Changing Machine and Fruit Changing"
	},
	"r1317"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "apple",
		"num"		: 2222,
		"base_cost"	: 5,
		"desc"		: "Contribute Apples - 2222 needed!"
	},
	"r1318"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mangosteen",
		"num"		: 950,
		"base_cost"	: 10,
		"desc"		: "Contribute Mangosteens - 950 needed!"
	},
	"r1319"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plum",
		"num"		: 1850,
		"base_cost"	: 3,
		"desc"		: "Contribute Plums - 1850 needed!"
	},
	"r1320"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_1",
		"num"		: 3250,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "squash",
		"verb_past"	: "squashed",
		"desc"		: "Contribute work - 3,250 units needed with a Grinder and Refining I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(23025 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(40000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(3500 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(3500 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 23025,
	"mood"	: 40000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 3500
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 3500});
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
	"xp"		: 175,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 150
		}
	},
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_street_mine_3.js LOADED");

// generated ok (NO DATE)
