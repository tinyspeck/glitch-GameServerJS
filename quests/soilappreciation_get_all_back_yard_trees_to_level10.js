var title = "Seed to Scythe";
var desc = "Plant 5 <b>Seasoned Beans<\/b> of any kind in your <b>back yard<\/b> or <b>home street<\/b> and raise them to fully grown <b>Trees<\/b>.";
var offer = "There's something really special about raising a tree from a <b>Bean<\/b>. <split butt_txt=\"Yeah!\" \/> And then harvesting them. <split butt_txt=\"Oh.\" \/> Circle of life, kid. You should try it out. Raise five <b>Seasoned Beans<\/b> of any kind in your <b>back yard<\/b> or <b>home street<\/b> to fully-grown <b>Trees<\/b>, and you'll reap the benefits.";
var completion = "Everything's all growed up! Well, food isn't the only thing that grows on trees around here. Here's a little token of appreciation. Take that green thumb of yours out for a night on the town.";


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
	"r218"	: {
		"type"		: "counter",
		"name"		: "pol_trants_fully_grown",
		"num"		: 5,
		"desc"		: "Raise 5 <b>fully-grown<\/b> trees"
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
	xp = pc.stats_add_xp(round_to_5(850 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(550 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(85 * multiplier));
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
	"xp"		: 850,
	"currants"	: 550,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 85
		}
	}
};

function onComplete_custom(pc){
	delete pc.fully_grown_trants;
}

//log.info("soilappreciation_get_all_back_yard_trees_to_level10.js LOADED");

// generated ok (NO DATE)
