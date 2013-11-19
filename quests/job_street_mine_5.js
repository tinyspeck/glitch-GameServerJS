var type = 1;
var title = "Crops 1 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1337"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "spinach",
		"num"		: 1924,
		"base_cost"	: 3,
		"desc"		: "Contribute Spinach - 1924 needed!"
	},
	"r1338"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "potato",
		"num"		: 1292,
		"base_cost"	: 7,
		"desc"		: "Contribute Potatoes - 1292 needed!"
	},
	"r1339"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "carrot",
		"num"		: 1688,
		"base_cost"	: 6,
		"desc"		: "Contribute Carrots - 1688 needed!"
	},
	"r1340"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "croppery_2",
		"num"		: 6033,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "hoe",
		"verb_past"	: "hoed",
		"desc"		: "Contribute work - 6,033 units needed with a Hoe and Croppery II"
	},
	"r1341"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "rice",
		"num"		: 2162,
		"base_cost"	: 4,
		"desc"		: "Contribute Rice - 2162 needed!"
	},
	"r1342"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "corn",
		"num"		: 1766,
		"base_cost"	: 6,
		"desc"		: "Contribute Corn - 1766 needed!"
	},
	"r1343"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cabbage",
		"num"		: 1783,
		"base_cost"	: 7,
		"desc"		: "Contribute Cabbages - 1783 needed!"
	},
	"r1344"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "soil_appreciation_3",
		"num"		: 4975,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "clear",
		"verb_past"	: "cleared",
		"desc"		: "Contribute work - 4,975 units needed with a Hatchet and Soil Appreciation III"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(22500 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(35000 * multiplier));
	pc.stats_add_favor_points("mab", Math.round(3375 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "mab", points: Math.round(3375 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 22500,
	"mood"	: 35000,
	"favor"	: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 3375
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "mab", points: 3375});
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

//log.info("job_street_mine_5.js LOADED");

// generated ok (NO DATE)
