var type = 1;
var title = "Spice 1 - pollo";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street: {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r1353"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "pinch_of_salt",
		"num"		: 4600,
		"base_cost"	: 2,
		"desc"		: "Contribute Pinches of Salt - 4600 needed!"
	},
	"r1354"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "hot_pepper",
		"num"		: 974,
		"base_cost"	: 4,
		"desc"		: "Contribute Hot Peppers - 974 needed!"
	},
	"r1355"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "cardamom",
		"num"		: 1375,
		"base_cost"	: 12,
		"desc"		: "Contribute Cardamom - 1375 needed!"
	},
	"r1356"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "spice_mill",
		"class_ids"	: {
			"0"	: "spice_mill"
		},
		"skill"		: "spicemilling_1",
		"num"		: 5367,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "grind",
		"verb_past"	: "grinded",
		"desc"		: "Contribute work - 5,367 units needed with a Spice Mill and Spice Milling"
	},
	"r1357"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "curry",
		"num"		: 1709,
		"base_cost"	: 5,
		"desc"		: "Contribute Curries - 1709 needed!"
	},
	"r1358"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "older_spice",
		"num"		: 1654,
		"base_cost"	: 20,
		"desc"		: "Contribute Old(er) Spices - 1654 needed!"
	},
	"r1359"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "mustard",
		"num"		: 2666,
		"base_cost"	: 4,
		"desc"		: "Contribute Mustards - 2666 needed!"
	},
	"r1360"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "scraper",
		"class_ids"	: {
			"0"	: "scraper"
		},
		"skill"		: "gardening_2",
		"num"		: 5643,
		"base_cost"	: 10,
		"energy"	: 4,
		"wear"		: 1,
		"verb_name"	: "cut",
		"verb_past"	: "cut",
		"desc"		: "Contribute work - 5,643 units needed with a Scraper and Arborology II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(25000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(39375 * multiplier));
	pc.stats_add_favor_points("pot", Math.round(3875 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: Math.round(3875 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"	: 25000,
	"mood"	: 39375,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 3875
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(175, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.favor = [];
	rewards.favor.push({giant: "pot", points: 3875});
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
			"giant"		: "pot",
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

//log.info("job_street_mine_8.js LOADED");

// generated ok (NO DATE)
