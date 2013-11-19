var type = 1;
var title = "{job_location}";
var desc = "This project is for creating a new street, called <b>{job_location}<\/b> linked from the street you are standing on right now. You'll be pushing out the boundaries and expanding the world … and that is a good and noble thing to do.";
var completion = "<b>Create a new street in {job_location}<\/b><br><br>Hey buddy, that was a hard one, but with your help we were able to create that new street! You did {job_participation}% of the work, nice.<split butt_txt=\"View Rewards\" \/>Here's some stuff to thank you. Want to check out your handiwork? This teleport to {job_location} is on me.";

var duration = 0;
var claimable = 0;

var requirements = {
	"r365"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "beryl",
		"num"		: 300,
		"base_cost"	: 6,
		"desc"		: "Contribute Chunks of Beryl - 300 needed!"
	},
	"r366"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "guano",
		"num"		: 300,
		"base_cost"	: 20,
		"desc"		: "Contribute Guano - 300 needed!"
	},
	"r367"	: {
		"bucket_id"	: "1",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "plank",
		"num"		: 750,
		"base_cost"	: 5,
		"desc"		: "Contribute Planks - 750 needed!"
	},
	"r368"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "pick",
		"class_ids"	: {
			"0"	: "pick"
		},
		"skill"		: "mining_2",
		"num"		: 500,
		"base_cost"	: 7,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "crack",
		"verb_past"	: "cracked",
		"desc"		: "Contribute work - 500 units needed with a Pick and Mining II"
	},
	"r369"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hatchet",
		"class_ids"	: {
			"0"	: "hatchet"
		},
		"skill"		: "light_green_thumb_2",
		"num"		: 300,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 2,
		"verb_name"	: "clear",
		"verb_past"	: "cleared",
		"desc"		: "Contribute work - 300 units needed with a Hatchet and Light Green Thumb II"
	},
	"r370"	: {
		"bucket_id"	: "1",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "hoe",
		"class_ids"	: {
			"0"	: "hoe"
		},
		"skill"		: "soil_appreciation_2",
		"num"		: 400,
		"base_cost"	: 9,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "place",
		"verb_past"	: "placed",
		"desc"		: "Contribute work - 400 units needed with a Hoe and Soil Appreciation II"
	},
	"r371"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "bean_plain",
		"num"		: 800,
		"base_cost"	: 1,
		"desc"		: "Contribute Beans - 800 needed!"
	},
	"r373"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "loam",
		"num"		: 100,
		"base_cost"	: 10,
		"desc"		: "Contribute Lumps of Loam - 100 needed!"
	},
	"r374"	: {
		"bucket_id"	: "2",
		"group_id"	: "1",
		"type"		: "item",
		"class_id"	: "earth",
		"num"		: 500,
		"base_cost"	: 3,
		"desc"		: "Contribute Lumps of Earth - 500 needed!"
	},
	"r372"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "focusing_orb",
		"class_ids"	: {
			"0"	: "focusing_orb"
		},
		"skill"		: "meditativearts_1",
		"num"		: 400,
		"base_cost"	: 6,
		"energy"	: 3,
		"wear"		: 1,
		"verb_name"	: "admire",
		"verb_past"	: "admired",
		"desc"		: "Contribute work - 400 units needed with a Focusing Orb and Meditative Arts I"
	},
	"r375"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "shovel",
		"class_ids"	: {
			"0"	: "shovel"
		},
		"skill"		: "soil_appreciation_1",
		"num"		: 400,
		"base_cost"	: 10,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "plant",
		"verb_past"	: "planted",
		"desc"		: "Contribute work - 400 units needed with a Shovel and Soil Appreciation I"
	},
	"r376"	: {
		"bucket_id"	: "2",
		"group_id"	: "2",
		"type"		: "work",
		"class_id"	: "watering_can",
		"class_ids"	: {
			"0"	: "watering_can"
		},
		"skill"		: "light_green_thumb_2",
		"num"		: 300,
		"base_cost"	: 11,
		"energy"	: 5,
		"wear"		: 1,
		"verb_name"	: "sprinkle",
		"verb_past"	: "sprinkled",
		"desc"		: "Contribute work - 300 units needed with a Watering Can and Light Green Thumb II"
	}
};


function onComplete(pc, multiplier){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(Math.round(10000 * multiplier), false, {type: 'job_complete', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(Math.round(10000 * multiplier), {type: 'job_complete', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(Math.round(10000 * multiplier));
	rewards.energy = pc.metabolics_add_energy(Math.round(5000 * multiplier));
	pc.stats_add_favor_points("all", Math.round(100 * multiplier));
	rewards.favor = [];
	rewards.favor.push({giant: "all", points: Math.round(100 * multiplier)});
	rewards.items = [];
	rewards.recipes = [];
	return rewards;
}
var rewards = {
	"xp"		: 10000,
	"currants"	: 10000,
	"mood"		: 10000,
	"energy"	: 5000,
	"favor"		: {
		"0"	: {
			"giant"		: "all",
			"points"	: 100
		}
	}
};

function applyPerformanceRewards(pc){ // generated from rewards
	var rewards = {};
	rewards.xp = pc.stats_add_xp(200, false, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.currants = pc.stats_add_currants(500, {type: 'job_complete_performance', job: this.class_tsid});
	rewards.mood = pc.metabolics_add_mood(50);
	rewards.energy = pc.metabolics_add_energy(25);
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
var performance_cutoff = 3;
var performance_rewards = {
	"xp"		: 200,
	"currants"	: 500,
	"mood"		: 50,
	"energy"	: 25,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "street_creation_trophies",
			"label"		: "A Street Creator Trophy Piece",
			"count"		: 1
		}
	}
};

//log.info("job_standard8_for_new_streets.js LOADED");

// generated ok (NO DATE)
