var title = "Batterfly Bounty Booster";
var desc = "Help the Rock to discover how much <a href=\"event:item|guano\">guano<\/a> you can get from a <a href=\"event:item|npc_batterfly\">batterfly<\/a>.";
var offer = "Ever wish you could get a bit more outta those <a href=\"event:item|npc_batterfly\">batterflies<\/a>? That <a href=\"event:item|guano\">guano<\/a> is worth its weight in currants! <split butt_txt=\"It is pretty useful.\" \/> Right, let's see how much guano you can get from a batterfly. <split butt_txt=\"Okay.\" \/> Find yourself a <a href=\"event:item|npc_piggy\">piggy<\/a> and give it a pet and nibble for some <a href=\"event:item|meat\">meat<\/a>. Then feed the meat to a batterfly roaming the caves.";
var completion = "Hmm. That wasn't as much guano as I'd hoped for, but it reminded me of an old recipe I saw in a book once.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	17
},{
		"not"		:0,
		"condition":	"has_achievement",
		"value":	"4star_cuisinartist"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r402"	: {
		"type"		: "counter",
		"name"		: "piggies_petted",
		"num"		: 1,
		"desc"		: "Pet Piggy"
	},
	"r403"	: {
		"type"		: "counter",
		"name"		: "meats_collected_from_pigs",
		"num"		: 1,
		"desc"		: "Nibble Piggy"
	},
	"r405"	: {
		"type"		: "counter",
		"name"		: "VERB:npc_batterfly:feed",
		"num"		: 1,
		"desc"		: "Feed a Batterfly Meat"
	},
	"r406"	: {
		"type"		: "counter",
		"name"		: "VERB:guano:pickup",
		"num"		: 1,
		"desc"		: "Collect Guano"
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(50 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(305);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 50,
	"mood"		: 50,
	"energy"	: 50,
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "batterfly_bar",
			"label"		: "Batterfly Bounty Booster Bar"
		}
	}
};

//log.info("batterfly_bounty.js LOADED");

// generated ok (NO DATE)
