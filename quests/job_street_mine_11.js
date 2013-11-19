var type = 1;
var title = "Compounds 2 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1297"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_green",
		"num"		: 130000,
		"base_cost"	: 0,
		"desc"		: "Contribute Green Elements - 130000 needed!"
	},
	"r1298"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "ixite",
		"num"		: 3422,
		"base_cost"	: 4,
		"desc"		: "Contribute Ixite - 3422 needed!"
	},
	"r1299"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "tiite",
		"num"		: 1842,
		"base_cost"	: 1,
		"desc"		: "Contribute Tiite - 1842 needed!"
	},
	"r1300"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "ore_grinder",
		"class_ids"	: {
			"0"	: "ore_grinder"
		},
		"skill"		: "refining_1",
		"num"		: 4869,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 4,869 units needed with a Grinder and Refining I"
	},
	"r1301"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "element_blue",
		"num"		: 110000,
		"base_cost"	: 0,
		"desc"		: "Contribute Blue Elements - 110000 needed!"
	},
	"r1302"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "abbasidose",
		"num"		: 1618,
		"base_cost"	: 6,
		"desc"		: "Contribute Abbasidose - 1618 needed!"
	},
	"r1303"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mabon",
		"num"		: 1030,
		"base_cost"	: 15,
		"desc"		: "Contribute Mabon - 1030 needed!"
	},
	"r1304"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "beaker",
		"class_ids"	: {
			"0"	: "beaker"
		},
		"skill"		: "intermediateadmixing_1",
		"num"		: 3993,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "cook",
		"verb_past"	: "cooked",
		"desc"		: "Contribute work - 3,993 units needed with a Beaker and Intermediate Admixing"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(30000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(48437 * multiplier));
	pc.stats_add_favor_points("ti", Math.round(4844 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: Math.round(4844 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 30000,
	"mood"	: 48437,
	"favor"	: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 4844
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "ti", points: 4844});
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
			"giant"		: "ti",
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

//log.info("job_street_mine_11.js LOADED");

// generated ok (NO DATE)
