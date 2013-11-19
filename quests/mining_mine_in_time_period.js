var title = "Giv'r 'til you Shiver";
var desc = "Pick up your <a href=\"event:item|pick\">Pick<\/a> or <a href=\"event:item|fancy_pick\">Fancy Pick<\/a> and mine <b>15 times<\/b> in just <b>5 minutes<\/b>.";
var offer = "Hey kid, ever think about going John Henry on some poor unsuspecting rock's noodle? <split butt_txt=\"Can't say I have.\" \/> Well, if you <b>Mine<\/b> 15 times in just 5 minutes, I will bestow upon you a suitable reward for your efforts. But only if you're successful. <split butt_txt=\"And if I'm not?\" \/> Merciless mockery will ensue.";
var completion = "That was some zippy Mining. I could barely see those little arms of yours move. <split butt_txt=\"These arms don't like being called little.\" \/> Aw. Use this little reward to buy them something pretty.";


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
	"r214"	: {
		"type"		: "counter",
		"name"		: "mining",
		"num"		: 15,
		"class_id"	: "pick",
		"desc"		: "Mine 15 times in just 5 minutes."
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(20 * multiplier));
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
	"xp"		: 225,
	"currants"	: 150,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 20
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('mining_mine_in_time_period');
}

function onStarted(pc){
	pc.buffs_apply('mining_mine_in_time_period');
	
	return { ok: 1 };
}

//log.info("mining_mine_in_time_period.js LOADED");

// generated ok (NO DATE)
