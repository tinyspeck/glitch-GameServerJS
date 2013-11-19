var type = 1;
var title = "Test Job For {job_location}";
var desc = "This is a test job.";
var completion = "NICEEEEEEE!!!!!!";

var duration = 60;
var claimable = 0;

var requirements = {
	"r2"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "currants",
		"num"		: 100,
		"base_cost"	: 1,
		"desc"		: "Contribute Currants - 100 needed!"
	},
	"r212"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plain_metal",
		"num"		: 50,
		"base_cost"	: 30,
		"desc"		: "Contribute Plain Metal Ingots - 50 needed!"
	},
	"r145"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "",
		"num"		: 10,
		"base_cost"	: 5,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "water",
		"verb_past"	: "watered",
		"desc"		: "Water the money 10 times!"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(50 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(1000 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(100 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(100 * multiplier));
	pc.stats_add_favor_points("pot", Math.round(75 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: Math.round(75 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	var items = pc.runDropTable("myles_test");
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
var rewards = {
	"xp"		: 50,
	"currants"	: 1000,
	"mood"		: 100,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 75
		}
	},
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "myles_test",
			"label"		: "hi scott",
			"count"		: 1
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(100, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(50, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(25);
	rewards.energy = pc.metabolics_add_energy(25);
	rewards.items = [];
	rewards.recipes = [];
	pc.createItemFromFamiliar("emblem_lem", 1);
	rewards.items.push({class_tsid: 'emblem_lem', label: 'Emblem of Lem', count: 1});
	return rewards;
}
var performance_percent = 0;
var performance_cutoff = 1;
var performance_rewards = {
	"xp"		: 100,
	"currants"	: 50,
	"mood"		: 25,
	"energy"	: 25,
	"items"		: {
		"0"	: {
			"class_tsid"	: "emblem_lem",
			"label"		: "Emblem of Lem",
			"count"		: 1
		}
	}
};

//log.info("job_myles_test.js LOADED");

// generated ok (NO DATE)
