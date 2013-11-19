var title = "Hogtie Some Hoggies ";
var desc = "Capture three wily <a href=\"event:item|npc_piggy\">Piggies<\/a> in the wild (NB: Your garden's not very wild, Sly…). Want a tip? Nothing tempts Piggies like <a href=\"event:item|pig_bait\">Pig Bait<\/a>.";
var offer = "Hey, kid. How do you feel about doing some good old-fashioned hogtying? <split butt_txt=\"Uh... ethically compromised?\" \/>Aw. You're cute. No, don't worry about it. Piggies love being tied up. <split butt_txt=\"Oh. Um.\" \/>So get out there, find three <a href=\"event:item|npc_piggy\">Piggies<\/a>, roaming in the wild - not your own garden, mind, the wildy-wild - and bring'em back bound and gagged, OK? <split butt_txt=\"Gagged?\" \/>Just for effect. You in?";
var completion = "Soooeeey. Nice work, kid. I like what you did with the butterfly knot. You sure you haven't done this before?";


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
	"r66"	: {
		"type"		: "counter",
		"name"		: "pigs_hogtied",
		"num"		: 3,
		"class_id"	: "hogtied_piggy",
		"desc"		: "Hogtie Piggies"
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
	favor = pc.stats_add_favor_points("humbaba", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 20
		}
	}
};

//log.info("herdkeeping_capture_piggies.js LOADED");

// generated ok (NO DATE)
