var title = "Batterfly Bounty Booster II";
var desc = "Learn a long forgotten recipe that could get you more guano from those reclusive <a href=\"event:item|npc_batterfly\">batterflies<\/a>.";
var offer = "This recipe looks promising. To be safe you probably shouldn't eat any yourself though. Those ingredients could really foul up your mood. <split butt_txt=\"I'll remember that.\" \/>Okay then, grab your <a href=\"event:item|awesome_pot\">Awesome Pot<\/a> and whip up a batch of <a href=\"event:item|batterfly_bar\">Batterfly Bounty Booster Bars <\/a>and try feeding one to a <a href=\"event:item|npc_batterfly\">batterfly<\/a>.";
var completion = "Nicely done! I guess you can believe some of what you read. <split butt_txt=\"Seems so.\" \/>Take note: there was a warning in the margin of the book. NEVER make more than one bar per day. It's too potent. <split butt_txt=\"Understood.\" \/>";


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
var prereq_quests = ["batterfly_bounty"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r407"	: {
		"type"		: "make",
		"recipe_id"	: 305,
		"num"		: 1,
		"desc"		: "Make a Batterfly Bounty Booster Bar"
	},
	"r408"	: {
		"type"		: "counter",
		"name"		: "VERB:npc_batterfly:feed",
		"num"		: 1,
		"desc"		: "Feed a Batterfly a Bar"
	},
	"r409"	: {
		"type"		: "counter",
		"name"		: "VERB:guano:pickup",
		"num"		: 100,
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"mood"		: 100,
	"energy"	: 100
};

//log.info("batterfly_bounty_part2.js LOADED");

// generated ok (NO DATE)
