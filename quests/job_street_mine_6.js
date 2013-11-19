var type = 1;
var title = "Crops 2 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1345"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "zucchini",
		"num"		: 1703,
		"base_cost"	: 5,
		"desc"		: "Contribute Zucchinis - 1703 needed!"
	},
	"r1346"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "broccoli",
		"num"		: 1303,
		"base_cost"	: 5,
		"desc"		: "Contribute Broccoli - 1303 needed!"
	},
	"r1347"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "onion",
		"num"		: 1549,
		"base_cost"	: 4,
		"desc"		: "Contribute Onions - 1549 needed!"
	},
	"r1348"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "saucepan",
		"class_ids"	: {
			"0"	: "saucepan"
		},
		"skill"		: "saucery_1",
		"num"		: 5997,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "simmer",
		"verb_past"	: "simmered",
		"desc"		: "Contribute work - 5,997 units needed with a Saucepan and Saucery I"
	},
	"r1349"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "rice",
		"num"		: 2062,
		"base_cost"	: 4,
		"desc"		: "Contribute Rice - 2062 needed!"
	},
	"r1350"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "corn",
		"num"		: 1766,
		"base_cost"	: 6,
		"desc"		: "Contribute Corn - 1766 needed!"
	},
	"r1351"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cabbage",
		"num"		: 1629,
		"base_cost"	: 7,
		"desc"		: "Contribute Cabbages - 1629 needed!"
	},
	"r1352"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "awesome_pot",
		"class_ids"	: {
			"0"	: "awesome_pot"
		},
		"skill"		: "masterchef_1",
		"num"		: 4335,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "bang on",
		"verb_past"	: "banged on",
		"desc"		: "Contribute work - 4,335 units needed with a Awesome Pot and Master Chef I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(21875 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(34375 * multiplier));
	pc.stats_add_favor_points("humbaba", Math.round(2437 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "humbaba", points: Math.round(2437 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 21875,
	"mood"	: 34375,
	"favor"	: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 2437
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "humbaba", points: 2437});
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
			"giant"		: "humbaba",
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

//log.info("job_street_mine_6.js LOADED");

// generated ok (NO DATE)
