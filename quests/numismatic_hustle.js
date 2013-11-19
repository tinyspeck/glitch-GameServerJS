var title = "The Numismatic Hustle ";
var desc = "Go to <b>Rainbow Run<\/b> and collect 30 coins in less than 30 seconds.";
var offer = "Psst.<split butt_txt=\"Huh?\" \/> I said \"Psst.\"<split butt_txt=\"Oh. Hi.\" \/> Do you like being in a good mood?<split butt_txt=\"Of course.\" \/> You like running, jumping and, incidentally, achieving great things?<split butt_txt=\"Well, duh.\" \/> No need for the lip, chum. I'm offering you a rare challenge. See if you can  collect 30 coins in less than 30 seconds in the infamous <b>Rainbow Run<\/b>.<split butt_txt=\"Sounds fun!\" \/> I'll zip you straight there if you accept this job, then I'll zip you back here when your time is up. Ready... steady...";
var completion = "I like the way you move, kid. I don't usually do this, but I'm giving you a little bonus prize. Don't tell anybody.";


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
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r85"	: {
		"type"		: "counter",
		"name"		: "quoins_collected",
		"num"		: 30,
		"desc"		: "Coins Qollected"
	},
	"r89"	: {
		"type"		: "flag",
		"name"		: "left_rainbow_run",
		"desc"		: "Leave Rainbow Run"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 450,
	"currants"	: 500,
	"mood"		: 100
};

function onStarted(pc){
	pc.events_add({ callback: 'instances_create_delayed', tsid: 'LIF9NRCLF273JBA', instance_id: 'rainbow_run', x: -347, y: -184, exit_delay: 0}, 0.1);
	
	return { ok: 1 };
}

//log.info("numismatic_hustle.js LOADED");

// generated ok (NO DATE)
