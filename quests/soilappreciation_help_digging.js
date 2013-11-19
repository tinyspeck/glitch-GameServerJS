var title = "It Takes Two";
var desc = "Get someone to help you while digging a <b>Dirt Pile<\/b>, three times.";
var offer = "Quite apart from being a crucial element in the soilitary arts, digging is a fabulous joint pursuit. Or \"joinsuit\". <split butt_txt=\"What?\" \/> My creativity is wasted on you. Look: Assiduous use of your <a href=\"event:item|shovel\">Shovel<\/a> reaps great rewards. <split butt_txt=\"Huh?\" \/> *Sigh*. Look, say you're digging, you get ONE helpful digger to help dig, you're guaranteed one extra <a href=\"event:item|earth\">Lump of Earth<\/a>, or <a href=\"event:item|loam\">Loam<\/a>, kid. You dig now? <split butt_txt=\"I think so.\" \/> And the more diggers, the better the diggings… But let's keep this simple: find a pal, and with them helping you, go loco on a <b>Dirt Pile<\/b>, three times. Go, kid!";
var completion = "With a little help from a friend, you've dug deeper into dirt than ever before. For willingness to get your hands dirty, a little thank you from Spriggan.";


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
	"r277"	: {
		"type"		: "counter",
		"name"		: "helped_dig",
		"num"		: 3,
		"class_id"	: "dirt_pile",
		"desc"		: "Get help from players to dig three Dirt Piles."
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(40 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 200,
	"energy"	: 40,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 30
		}
	}
};

//log.info("soilappreciation_help_digging.js LOADED");

// generated ok (NO DATE)
