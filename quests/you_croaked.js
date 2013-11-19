var title = "You Croaked";
var desc = "Squish 11 bunches of hellish grapes to get yourself out of this hellish purgatory and back to the real world.";
var offer = "Uh oh. You croaked! Bummer! And right when you were going to win the game, too.<split butt_txt=\"Gee, thanks.\" \/>Fortunately, this condition is not permanent. Everyone really likes their <b>Wine of the Dead<\/b>, so they'll resurrect you if you help them make some more.<split butt_txt=\"How do I do that?\" \/>Just find some hellish grapes on the ground in here and give them some good squashing. Keep going until you get out!";
var completion = "You did it, but squishing grapes is tiring work and now you're 'pooped'. You can only croak once a day, but you'll need to get your energy back up to start feeling better. Run out of energy while pooped and you'll end up 'super-pooped', and that's really no fun!";


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
	"r97"	: {
		"type"		: "flag",
		"name"		: "resurrected",
		"desc"		: "Get resurrected"
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
	xp = pc.stats_add_xp(round_to_5(25 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 25,
	"mood"		: 25,
	"energy"	: 25
};

//log.info("you_croaked.js LOADED");

// generated ok (NO DATE)
