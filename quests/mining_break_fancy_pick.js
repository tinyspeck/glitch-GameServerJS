var title = "Hard Rock Miner";
var desc = "Breaking a regular pick is easy. But to break a <a href=\"event:item|fancy_pick\">Fancy Pick<\/a> through heavy <b>Mining<\/b> means you'll really have to give 'er. Possibly till you quiver.";
var offer = "So, judging by those arms of yours, I guess you don't work out much. <split butt_txt=\"Ouch. Your point?\" \/>Well, I was curious to see if you could break a <a href=\"event:item|fancy_pick\">Fancy Pick<\/a> through excessive <b>Mining<\/b>. My magic 9-ball says \"probably not\". <split butt_txt=\"Lousy 9-ball.\" \/>I know. Why don't you show it a thing or two and break that Fancy Pick of yours going miner forty-niner on some rock's behind. Think of all the ore you'll end up with, and maybe something else for your goodie bag.";
var completion = "By Mab's false teeth! That's one broken pick. This should more than cover the cost of a new one, or maybe something else you've had your great big eyes on.";


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
	"r172"	: {
		"type"		: "counter",
		"name"		: "tool_broke_fancy_pick",
		"num"		: 1,
		"class_id"	: "fancy_pick",
		"desc"		: "Break a fancy pick"
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
	xp = pc.stats_add_xp(round_to_5(800 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(150 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(80 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 800,
	"currants"	: 500,
	"energy"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 80
		}
	}
};

//log.info("mining_break_fancy_pick.js LOADED");

// generated ok (NO DATE)
