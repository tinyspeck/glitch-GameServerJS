var title = "Can You Dig It?";
var desc = "Use your steadfast <a href=\"event:item|shovel\">Shovel<\/a> to dig 7 <a href=\"event:item|earth\">Lumps of Earth<\/a> from <b>Patches<\/b> or <b>Dirt Piles<\/b>. Dig deep, little one.";
var offer = "You look like the kind of Glitch who calls a spade a spade. <split butt_txt=\"I call it a Shovel.\" \/> Don't quibble. Same difference. BUT I'm sure you know the difference between a Patch and a Dirt Pile? <split butt_txt=\"Yup!\" \/> Great, so … grab your trusty <a href=\"event:item|shovel\">Shovel<\/a> and dig 7 Lumps of Earth from Patches or Dirt Piles. I'll check back when you gone done dugged.";
var completion = "What's that? 7 Lumps of Earth? Already? I suppose a reward is in order. I tell you what: you can keep those lumps. And some extra stuff.";


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
var prereq_quests = ["soilappreciation_1"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r276"	: {
		"type"		: "counter",
		"name"		: "dig_dirt",
		"num"		: 7,
		"class_id"	: "earth",
		"desc"		: "Dig 7 Earth from Dirt Piles or Patches."
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
	"currants"	: 100,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 15
		}
	}
};

//log.info("soilappreciation_dig_earth.js LOADED");

// generated ok (NO DATE)
