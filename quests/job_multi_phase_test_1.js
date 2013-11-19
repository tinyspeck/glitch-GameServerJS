var type = 1;
var title = "Multi-Phase Test Template";
var desc = "Test the multi-phase job";
var completion = "you did it!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r233"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 5,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 5 needed!"
	},
	"r234"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 5,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 5 needed!"
	},
	"r235"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 5,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 5 needed!"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
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
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 0;
var performance_rewards = {
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_multi_phase_test_1.js LOADED");

// generated ok (NO DATE)
