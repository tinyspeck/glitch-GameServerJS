var title = "Carry That Weight II";
var desc = "Return the Ancestral Paperweight to the Secret Juju Bandit Hideout";
var offer = "You found the Ancestral Paperweight!<split butt_txt=\"Yay!\" \/>You'll need to return that to the Juju Bandits' Hideout. Ready?";
var completion = "Ah, the Paperweight!<split butt_txt=\"Will you stop stealing my stuff now?\" \/>I’ll reward you for your efforts, but like I said, the moment you leave, your paper is in jeopardy.<split butt_txt=\"What’s with all the paper, anyway?\" \/>It’s something to do, isn’t it? The Rook makes work for idle hands, as my husband used to say. Anyway, Smelly, here’s your reward. Nice doing business with you.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_juju_grandma"];
var locations = {
	"juju_camp"	: {
		"dev_tsid"	: "LMF6I97NI8O2MMD",
		"prod_tsid"	: "LNVDIG7F7DO2CM5"
	}
};

var requirements = {
	"r360"	: {
		"type"		: "flag",
		"name"		: "return_weight",
		"class_id"	: "juju_paperweight",
		"desc"		: "Return the Ancestral Paperweight"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("juju_paperweight", 1);
	pc.createItemFromFamiliar("paper", 250);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 1000,
	"currants"	: 500,
	"mood"		: 250,
	"items"		: {
		"0"	: {
			"class_tsid"	: "juju_paperweight",
			"label"		: "Ancestral Paperweight",
			"count"		: 1
		},
		"1"	: {
			"class_tsid"	: "paper",
			"label"		: "Paper",
			"count"		: 250
		}
	}
};

function onComplete_custom(pc){
	pc.instances_left('juju_camp');
}

function onExitLocation(location){
	if (location == 'juju_camp') {
		log.info(this.owner+" left juju_camp. Failing juju bandit quest.");
		this.owner.failQuest(this.class_tsid);
	}
}

function onStarted(pc){
	this.questInstanceLocation(this.owner, 'juju_camp', -839, -98, 5 * 60);
	
	return {ok: 1};
}

//log.info("help_juju_bandits_2.js LOADED");

// generated ok (NO DATE)
