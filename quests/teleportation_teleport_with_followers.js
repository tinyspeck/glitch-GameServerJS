var title = "Three's a Cloud";
var desc = "Teleport with three Glitches (or more) in tow.";
var offer = "You know what's hot? <split butt_txt=\"Me?\" \/>*Sigh*. Apart from you. Think about it: that whoosh you get when you suddenly feel the dispersed particles of three or more Glitches rush past your head. You know what that is, kid? Cloud commuting. <split butt_txt=\"Do you mean…\" \/> I mean what I say, peanut. Commuting from one place to the other as a group, in a dispersed cloud of teleported particles: Cloud Commuting! <split butt_txt=\"I'm in! What's the plan?\" \/> That's the spirit. Gather three or more Glitches, get them to follow you and, when you're sure they're all following, whisk them away by teleportation. Where? Doesn't matter. Just as long as you zap there.";
var completion = "BAM! Quick, easy, low in energy and high in efficiency, no? <split butt_txt=\"No. I mean yes.\" \/>  And you all got here in one piece! One piece each, I mean! And you didn't even swap any pieces along the way. <split butt_txt=\"You sound surprised.\" \/> Nooooooooo. Well, first time for everything, I guess. Well, to celebrate your survival… I mean, triumph… here's a little something.";


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
	"r335"	: {
		"type"		: "flag",
		"name"		: "teleportation_self_withfollowers_3",
		"class_id"	: "quest_req_icon_teleport_with_followers",
		"desc"		: "Teleport with 3 or more followers"
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
	xp = pc.stats_add_xp(round_to_5(650 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(65 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 650,
	"currants"	: 350,
	"mood"		: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 65
		}
	}
};

//log.info("teleportation_teleport_with_followers.js LOADED");

// generated ok (NO DATE)
