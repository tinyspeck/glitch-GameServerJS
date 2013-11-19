var type = 1;
var title = "Fruit 2 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1321"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bunch_of_grapes",
		"num"		: 1824,
		"base_cost"	: 4,
		"desc"		: "Contribute Bunches of Grapes - 1824 needed!"
	},
	"r1322"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pineapple",
		"num"		: 1662,
		"base_cost"	: 7,
		"desc"		: "Contribute Pineapples - 1662 needed!"
	},
	"r1323"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "orange",
		"num"		: 2002,
		"base_cost"	: 5,
		"desc"		: "Contribute Oranges - 2002 needed!"
	},
	"r1324"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "fruit_changing_machine",
		"class_ids"	: {
			"0"	: "fruit_changing_machine"
		},
		"skill"		: "fruitchanging_1",
		"num"		: 6033,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "go mental",
		"verb_past"	: "went mental",
		"desc"		: "Contribute work - 6,033 units needed with a Fruit Changing Machine and Fruit Changing"
	},
	"r1325"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cloudberry",
		"num"		: 2800,
		"base_cost"	: 2,
		"desc"		: "Contribute Cloudberries - 2800 needed!"
	},
	"r1326"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "whortleberry",
		"num"		: 1502,
		"base_cost"	: 5,
		"desc"		: "Contribute Whortleberries - 1502 needed!"
	},
	"r1327"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mangosteen",
		"num"		: 1362,
		"base_cost"	: 10,
		"desc"		: "Contribute Mangosteens - 1362 needed!"
	},
	"r1328"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "blender",
		"class_ids"	: {
			"0"	: "blender"
		},
		"skill"		: "blending_1",
		"num"		: 3250,
		"base_cost"	: 9,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "blend",
		"verb_past"	: "blended",
		"desc"		: "Contribute work - 3,250 units needed with a Blender and Blending I"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(23750 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(37500 * multiplier));
	pc.stats_add_favor_points("grendaline", Math.round(3500 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "grendaline", points: Math.round(3500 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 23750,
	"mood"	: 37500,
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
			"giant"		: "spriggan",
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

//log.info("job_street_mine_4.js LOADED");

// generated ok (NO DATE)
