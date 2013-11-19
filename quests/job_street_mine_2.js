var type = 1;
var title = "Gas - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1305"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "general_vapour",
		"num"		: 1000,
		"base_cost"	: 5,
		"desc"		: "Contribute General Vapour - 1000 needed!"
	},
	"r1306"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "heavy_gas",
		"num"		: 1244,
		"base_cost"	: 40,
		"desc"		: "Contribute Heavy Gas - 1244 needed!"
	},
	"r1307"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "crying_gas",
		"num"		: 1412,
		"base_cost"	: 20,
		"desc"		: "Contribute Crying Gas - 1412 needed!"
	},
	"r1308"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "gassifier",
		"class_ids"	: {
			"0"	: "gassifier"
		},
		"skill"		: "gasmogrification_1",
		"num"		: 5475,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "gassify",
		"verb_past"	: "gassified",
		"desc"		: "Contribute work - 5,475 units needed with a Gassifier and Gasmogrification"
	},
	"r1309"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "helium",
		"num"		: 910,
		"base_cost"	: 30,
		"desc"		: "Contribute Helium - 910 needed!"
	},
	"r1310"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "laughing_gas",
		"num"		: 1600,
		"base_cost"	: 20,
		"desc"		: "Contribute Laughing Gas - 1600 needed!"
	},
	"r1311"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "white_gas",
		"num"		: 910,
		"base_cost"	: 50,
		"desc"		: "Contribute White Gas - 910 needed!"
	},
	"r1312"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fancy_pick",
		"class_ids"	: {
			"0"	: "fancy_pick"
		},
		"skill"		: "mining_1",
		"num"		: 4425,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "pop",
		"verb_past"	: "popped",
		"desc"		: "Contribute work - 4,425 units needed with a Fancy Pick and Mining I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(31250 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(50000 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(5000 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(5000 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 31250,
	"mood"	: 50000,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 5000
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: 5000});
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
			"giant"		: "zille",
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

//log.info("job_street_mine_2.js LOADED");

// generated ok (NO DATE)
