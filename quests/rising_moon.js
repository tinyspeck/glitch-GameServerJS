var title = "Rising Moon ";
var desc = "Moons are for mooning, so get one and use it to moon 5 different players. You'll also need an Emotional Bear to go with your moon (see if you can figure out how they go together), and you can get both from any Street Spirit who sells Hardware.";
var offer = "You look glum, chum. You know what might make you feel better? <split butt_txt=\"Candy?\" \/>Other than that. A good old-fashioned mooning. <split butt_txt=\"Say what?\" \/>You heard me. Get yourself a <b>moon<\/b> and moon some other players. <split butt_txt=\"You lost me. Again.\" \/>Moons can be thin on the ground, so you may have to buy one from a <b>Street Spirit<\/b> who sells <b>Hardware<\/b>. Once you have a moon, and combine it with an Emotional Bear, you can moon with impunity. <split butt_txt=\"Sounds like a hoot!\" \/>It's a certified hoot. And tell you what. Even though mooning is its own reward, if you moon 5 other players, I'll give you a little something special. What do you say?";
var completion = "Didn't I tell you, kid? Good times, right? <split butt_txt=\"Indeed!\" \/> Here's a little something extra, just because I'm a nice rock. <split butt_txt=\"Thanks!\" \/>Remember: You can't moon without a moon. Keep it handy!";


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
	"r81"	: {
		"type"		: "counter",
		"name"		: "players_mooned",
		"num"		: 5,
		"class_id"	: "moon",
		"desc"		: "Players Mooned"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(80 * multiplier));
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
	"xp"		: 500,
	"currants"	: 400,
	"mood"		: 80
};

function onComplete_custom(pc){
	pc.counters_reset_group('players_mooned');
}

//log.info("rising_moon.js LOADED");

// generated ok (NO DATE)
