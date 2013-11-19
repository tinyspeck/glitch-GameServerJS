var title = "Patch Working";
var desc = "Tend as many <a href=\"event:item|patch\">Patches<\/a> as you can until you get a super-fun secret happy bonus prize.";
var offer = "So, kid. By now you're on to the fact that, sometimes, when you tend a <a href=\"event:item|patch\">Patch<\/a>, you find little surprises. <split butt_txt=\"Surprises are my favorite.\" \/>Now that you've upped your ante in the <b>Soil Appreciation<\/b> arts, you'll find these little surprises have upped their ante, too. Keep tending, and see what pops up.";
var completion = "A <b>Music Block<\/b>! Score! I told you that tending all those patches would pay off. Here's another payoff, just to show you that perseverance isn't its only own reward.";


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
	"r176"	: {
		"type"		: "counter",
		"name"		: "patch_music_block",
		"num"		: 1,
		"class_id"	: "musicblock_d_blue_01",
		"desc"		: "Get a Music Block"
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(250 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 400,
	"currants"	: 250,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 40
		}
	}
};

//log.info("soilappreciation_tend_patch_get_drop.js LOADED");

// generated ok (NO DATE)
