var title = "Fixit Friend";
var desc = "You've fixed up 3 different tools. You've even fixed up a <a href=\"event:item|tinkertool\">Tinkertool<\/a>. But are you ready to fix 7 different kinds of <b>tools<\/b>? Do you even know 7 different kinds of tools?";
var offer = "You know one of the best ways to make friends and influence people? <split butt_txt=\"Help them move?\" \/> Close! Fix their stuff. <split butt_txt=\"I can do that!\" \/> Then get out there with your <a href=\"event:item|tinkertool\">Tinkertool<\/a> and fix 7 up <b>broken tools<\/b> for fun AND profit.";
var completion = "Those 7 broken tools are well and truly fixed. Just talking to you makes me feel productive, kid. Just for that, I think it's fair to say you've earned yourself a 7-tool-fixin'-sized perk.";


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
var prereq_quests = ["tinkering_repair_tinkertool"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r196"	: {
		"type"		: "counter",
		"name"		: "tinkertool_repair",
		"num"		: 7,
		"class_id"	: "tinkertool",
		"desc"		: "Repair 7 tools"
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
	currants = pc.stats_add_currants(round_to_5(325 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(50 * multiplier));
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
	"xp"		: 500,
	"currants"	: 325,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 50
		}
	}
};

function onComplete_custom(pc){
	delete pc.tools_repaired;
}

//log.info("tinkering_repair_more_tools.js LOADED");

// generated ok (NO DATE)
