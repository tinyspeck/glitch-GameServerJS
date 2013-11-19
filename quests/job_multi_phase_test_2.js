var type = 1;
var title = "Multi-Phase Test Template 2";
var desc = "Test multi-phase jobs";
var completion = "you win!";

var duration = 0;
var claimable = 0;

var requirements = {
	"r239"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 5,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 5 needed!"
	},
	"r240"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 10,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 10 needed!"
	},
	"r241"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "soil_appreciation_1",
		"num"		: 10,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "dig",
		"verb_past"	: "dug",
		"desc"		: "Contribute work - 10 units needed with a Shovel and Soil Appreciation I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(100 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(100 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(100 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(100 * multiplier));
	pc.stats_add_favor_points("all", Math.round(5 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(5 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 100,
	"currants"	: 100,
	"mood"		: 100,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 5
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(200, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(200, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(200);
	rewards.energy = pc.metabolics_add_energy(200);
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: 5});
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
var performance_percent = 5;
var performance_cutoff = 0;
var performance_rewards = {
	"xp"		: 200,
	"currants"	: 200,
	"mood"		: 200,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 5
		}
	},
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_multi_phase_test_2.js LOADED");

// generated ok (NO DATE)
