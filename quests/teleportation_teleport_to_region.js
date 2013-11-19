var title = "To Xalanga, And Beyond";
var desc = "Set a teleportation point in <a href=\"event:location|95\">Xalanga<\/a>, then teleport there from any other region. (Hint: Access your Teleport ability through the 'iMG' menu)";
var offer = "So you've chosen to embrace the fine art of Teleportation. <split butt_txt=\"Walking is for chumps.\" \/> Exactly. You've got better things to do with those legs. Just to give you a little teleportational jump start, I'm going to offer you a little something special if you can figure out how to teleport yourself from anywhere in the world to the rich hunting grounds of <a href=\"event:location|95\">Xalanga<\/a>. <split butt_txt=\"Um. Huh?\" \/> I'll even give you a little hint. Go find a nice spot somewhere in <a href=\"event:location|95\">Xalanga<\/a>. When you get there, click on the 'iMG' menu, choose Teleport and create a new landing point. After that, you're on your own.";
var completion = "Surprise! You're back in Xalanga! <split butt_txt=\"That wasn't much of a surprise.\" \/> No, well, fair enough. Still, it's useful to remember that you can come back any time. These desert regions are a hotbed of treasure huntingness, you know. <split butt_txt=\"Oh they are, are they?\" \/> They are! But to save you the trouble for now, here's a little something from my back pocket. Or which would be, if I had one…";


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
	"r331"	: {
		"type"		: "flag",
		"name"		: "teleportation_point_in_xalanga",
		"class_id"	: "quest_req_icon_teleport",
		"desc"		: "Set teleportation point in Xalanga"
	},
	"r332"	: {
		"type"		: "flag",
		"name"		: "teleport_to_xalanga",
		"class_id"	: "quest_req_icon_teleport",
		"desc"		: "Teleport to Xalanga"
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
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(25 * multiplier));
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
	"currants"	: 100,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 25
		}
	}
};

//log.info("teleportation_teleport_to_region.js LOADED");

// generated ok (NO DATE)
