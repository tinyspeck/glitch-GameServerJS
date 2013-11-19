var title = "Beam You Up";
var desc = "Click on <b>Teleport<\/b> in the imagination menu to help you create a landing point anywhere in <a href=\"event:location|92\">Tamila<\/a>, and then jump to it from anywhere in <a href=\"event:location|63\">Shimla Mirch<\/a>. It's practically pain-free and almost foolproof.";
var offer = "So you've chosen to embrace the fine art of <b>Teleportation<\/b>. <split butt_txt=\"Walking is for chumps.\" \/> Exactly. You've got better things to do with those legs. Just to give you a little teleportational jump start, I'm going to offer you a little something special if you can figure out how to get yourself from, oh, let's say <a href=\"event:location|63\">Shimla Mirch<\/a>, over to <a href=\"event:location|92\">Tamila<\/a>. <split butt_txt=\"Um. Huh?\" \/> I'll even give you a little hint. Go find a nice spot somewhere in Tamila. When you get there, click on me and create a new landing point. After that, you're on your own.";
var completion = "Nice work. The first Teleportation jump is always the toughest. But look at you! You re-assembled almost perfectly. <split butt_txt=\"Yay!\" \/> Now that you've figured out the basics, keep practicing. You can change your landing point any time you want. And in the meantime, enjoy this little gift.";


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
	"r200"	: {
		"type"		: "flag",
		"name"		: "teleport_between_zones",
		"desc"		: "Teleport to <b>Tamila<\/b> from <b>Shimla Mirch<\/b>"
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
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"currants"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 25
		}
	}
};

//log.info("teleportation_teleport_between_zones.js LOADED");

// generated ok (NO DATE)
