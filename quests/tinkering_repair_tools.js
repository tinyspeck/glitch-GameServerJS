var title = "Third Time Really Is the Charm";
var desc = "Use your <a href=\"event:item|tinkertool\">Tinkertool<\/a> to fix <b>three different tools<\/b> up to 100%.";
var offer = "It's a shame to see broken tools just laying there, all useless-like. What they need is a hero. <split butt_txt=\"I could be that hero.\" \/> Well, then, whip that <a href=\"event:item|tinkertool\">Tinkertool<\/a> out of your tights and get to work.";
var completion = "Say, when did you get the new tools? <split butt_txt=\"They're not new. I fixed em!\" \/> I knew that. Your greasy paw prints are all over them. I wanted you to feel good about yourself. <split butt_txt=\"Thanks?\" \/> Look, I'm not good at this sort of thing. So here. Just take this little bonus, and let's leave this awkwardness behind us.";


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
var prereq_quests = ["tinkering_repair_for_time_period"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r194"	: {
		"type"		: "counter",
		"name"		: "tinkertool_repair",
		"num"		: 3,
		"class_id"	: "tinkertool",
		"desc"		: "Repair 3 tools"
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
	xp = pc.stats_add_xp(round_to_5(325 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(150 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 325,
	"currants"	: 200,
	"energy"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 30
		}
	}
};

function onComplete_custom(pc){
	delete pc.tools_repaired;
}

//log.info("tinkering_repair_tools.js LOADED");

// generated ok (NO DATE)
