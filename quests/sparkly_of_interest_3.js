var title = "A Blissful Trip";
var desc = "Find your way in to <a href=\"event:location|78#LA9154LI9R22R7A\">Ajaya Bliss<\/a>";
var offer = "Think you're up for another trip? There's whispers of another deposit of the shiny stuff in Illmenske, if the bubble trees aren't lying. <split butt_txt=\"They are kind of shifty...\" \/>Head on over to the depths and see if you can find your way in to a place called <a href=\"event:location|78#LA9154LI9R22R7A\">Ajaya Bliss<\/a>.";
var completion = "You did it, kid. Great work. Bet you can't guess what I'm going to ask you to do next. <split butt_txt=\"I bet I can...\" \/>Hush, you. Here's a small something for the walk.";

var button_accept = "My kingdom for a horse!";

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
var prereq_quests = ["sparkly_of_interest_2"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r498"	: {
		"type"		: "flag",
		"name"		: "arrive_at_ajaya_bliss",
		"desc"		: "Arrive at Ajaya Bliss"
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
	xp = pc.stats_add_xp(round_to_5(50 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(20 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 50,
	"currants"	: 50,
	"mood"		: 20,
	"energy"	: 20
};

//log.info("sparkly_of_interest_3.js LOADED");

// generated ok (NO DATE)
