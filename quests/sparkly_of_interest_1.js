var title = "Well, I Neva!";
var desc = "Find your way in to <a href=\"event:location|107#LDOU5PQU0FD21PF\">Neva Neva<\/a>.";
var offer = "So, I've heard you're quick with a pick... <split butt_txt=\"It's all in the back swing.\" \/> And fleet on your feet... <split butt_txt=\"Mmhmm...\" \/> One to ask when you have a task <split butt_txt=\"Is the next line going to rhyme to?\" \/> I've got a job for you, if you're up to it, but first we need a little test. Find your way through the locks in to <a href=\"event:location|107#LDOU5PQU0FD21PF\">Neva Neva<\/a> and I'll fill you in there.";
var completion = "Nice work on making it in. A determined individual like you is just what I need.";


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
		"condition":	"has_skill",
		"value":	"mining_2"
},{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"refining_1"
},{
		"not"		:0,
		"condition":	"over_level",
		"value":	15
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r497"	: {
		"type"		: "flag",
		"name"		: "arrive_at_neva_neva",
		"desc"		: "Arrive at Neva Neva"
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
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(20 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 50,
	"currants"	: 50,
	"mood"		: 20,
	"energy"	: 20
};

//log.info("sparkly_of_interest_1.js LOADED");

// generated ok (NO DATE)
