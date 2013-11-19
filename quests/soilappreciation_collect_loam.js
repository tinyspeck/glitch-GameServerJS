var title = "Many Shovels Make Something-Something Loam";
var desc = "Loose 11 <a href=\"event:item|loam\">Lumps of Loam<\/a> from <b>Dirt Piles<\/b> or <b>Patches<\/b> in <b>30 minutes<\/b> (Hint: getting helped by others will help in the loam haul).";
var offer = "You down with polydiggerous parties, kid?  <split butt_txt=\"I don't know, am I?\" \/> You sure should be. \"Many shovels make something-something loam something.\" <split butt_txt=\"It's a classic.\" \/> Whatever, kid: test it out yourself. Collect 11 <a href=\"event:item|loam\">Lumps of Loam<\/a> from <b>Dirt Piles<\/b> or <b>Patches<\/b> in under 30 minutes… <split butt_txt=\"Challenge accepted.\" \/>  …And, just to prove my point, try digging with others - it loosens the loam, don'tchaknow.";
var completion = "See?!? Many shovels make loose loam! Or make loam loose. Or something. Anyway, you loosened your loam and filled your allotted load. Here's a little green for your grubby little thumbs.";


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
	"r278"	: {
		"type"		: "counter",
		"name"		: "dig_loam",
		"num"		: 11,
		"class_id"	: "loam",
		"desc"		: "Collect 11 Loam from Dirt Piles and Patches."
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
	xp = pc.stats_add_xp(round_to_5(350 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(225 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(35 * multiplier));
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
	"xp"		: 350,
	"currants"	: 225,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 35
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('soil_appreciation_loam_in_time_period');
}

function onStarted(pc){
	pc.buffs_apply('soil_appreciation_loam_in_time_period');
	
	return {ok: 1};
}

//log.info("soilappreciation_collect_loam.js LOADED");

// generated ok (NO DATE)
