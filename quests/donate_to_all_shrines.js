var title = "Respect for the Beginnings";
var desc = "Donate a little something to a shrine for each of the Eleven Giants. You can donate anything, but the more valuable the item(s) you donate, the more favor you earn.";
var offer = "I see you've discovered shrine donation … <split butt_txt=\"Indeed.\" \/> That's good, because donation is an important thing: you'll need to do a lot of it to get ahead.<split butt_txt=\"I'm willing.\" \/>Find a shrine to each of the Eleven Giants and donate something — you'll learn a lot along the way.";
var completion = "Very good indeed. Your favor with the Giants will come in handy as you learn more skills. <split butt_txt=\"Super.\" \/>So, don't forget to keep donating. And, if I was you, I'd start inquiring into some of Shrine Powders<split butt_txt=\"Shrine Powders?\" \/>Yeah, Shrine Powders … ask around. For now, I have a little something for you.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r483"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_alph",
		"num"		: 1,
		"class_id"	: "npc_shrine_alph",
		"desc"		: "Donate to a shrine to Alph"
	},
	"r484"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_cosma",
		"num"		: 1,
		"class_id"	: "npc_shrine_cosma",
		"desc"		: "Donate to a shrine to Cosma"
	},
	"r485"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_friendly",
		"num"		: 1,
		"class_id"	: "npc_shrine_friendly",
		"desc"		: "Donate to a shrine to Friendly"
	},
	"r486"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_grendaline",
		"num"		: 1,
		"class_id"	: "npc_shrine_grendaline",
		"desc"		: "Donate to a shrine to Grendaline"
	},
	"r487"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_humbaba",
		"num"		: 1,
		"class_id"	: "npc_shrine_humbaba",
		"desc"		: "Donate to a shrine to Humbaba"
	},
	"r488"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_lem",
		"num"		: 1,
		"class_id"	: "npc_shrine_lem",
		"desc"		: "Donate to a shrine to Lem"
	},
	"r489"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_mab",
		"num"		: 1,
		"class_id"	: "npc_shrine_mab",
		"desc"		: "Donate to a shrine to Mab"
	},
	"r490"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_pot",
		"num"		: 1,
		"class_id"	: "npc_shrine_pot",
		"desc"		: "Donate to a shrine to Pot"
	},
	"r491"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_spriggan",
		"num"		: 1,
		"class_id"	: "npc_shrine_spriggan",
		"desc"		: "Donate to a shrine to Spriggan"
	},
	"r492"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_ti",
		"num"		: 1,
		"class_id"	: "npc_shrine_ti",
		"desc"		: "Donate to a shrine to Tii"
	},
	"r493"	: {
		"type"		: "counter",
		"name"		: "shrine_donated_zille",
		"num"		: 1,
		"class_id"	: "npc_shrine_zille",
		"desc"		: "Donate to a shrine to Zille"
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
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"currants"	: 300,
	"mood"		: 100,
	"energy"	: 100
};

function onAccepted(pc){
	delete pc.shrines_passed;
	delete pc.shrine_announced;
	if (pc.last_giant_donated){
		pc.giant_tip_index = 1;
		pc.quests_inc_counter('shrine_donated_'+pc.last_giant_donated);
		delete pc.last_giant_donated;
	}
}

//log.info("donate_to_all_shrines.js LOADED");

// generated ok (NO DATE)
