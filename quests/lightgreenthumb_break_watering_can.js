var title = "Water Water Everywhere";
var desc = "Find the breaking point of a <a href=\"event:item|watering_can\">Watering Can<\/a> (or that of an <a href=\"event:item|irrigator_9000\">Irrigator 9000<\/a>). Water every <b>Tree<\/b> and <b>Crop<\/b> that's willing till you can water no more.";
var offer = "Let's try an experiment, shall we? Let's see if you can break a <a href=\"event:item|watering_can\">Watering Can<\/a> with excessive watering. Betcha can't do it. <split butt_txt=\"Betcha I can.\" \/>Well, we'll see. We'll see.";
var completion = "Broken watering can, huh? I guess you showed me. <split butt_txt=\"I guess I did.\" \/>We didn't actually bet anything on this, but if we had, I bet it would have been to the tune of this.";


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
	"r170"	: {
		"type"		: "counter",
		"name"		: "tool_broke_watering_can",
		"num"		: 1,
		"class_id"	: "watering_can",
		"desc"		: "Break a watering can"
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
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(45 * multiplier));
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
	"currants"	: 300,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 45
		}
	}
};

//log.info("lightgreenthumb_break_watering_can.js LOADED");

// generated ok (NO DATE)
