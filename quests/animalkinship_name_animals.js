var title = "Doin' the Ol' MacDonald";
var desc = "Form an extra special bond with some of your animal friends. Name one <a href=\"event:item|npc_piggy\">Piggy<\/a> and one <a href=\"event:item|npc_butterfly\">Butterfly<\/a>.";
var offer = "How would you like to really get to know one <a href=\"event:item|npc_piggy\">Piggy<\/a> and one <a href=\"event:item|npc_butterfly\">Butterfly<\/a> in an extra special way? <split butt_txt=\"Uh... I'm in?\" \/> That wasn't a double entendre. <split butt_txt=\"But your subtext...\" \/> Leave my subtext out of this. All I'm trying to do is get you to name a Piggy and a Butterfly, It will be a very rewarding experience. <split butt_txt=\"There you go with that subtext again.\" \/> Just go.";
var completion = "So those are the names, eh? <split butt_txt=\"Is there a problem?\" \/> No, no. It's not like they have to go to elementary school with names like that. You've earned every bit of this.";


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
	"r220"	: {
		"type"		: "counter",
		"name"		: "piggies_named",
		"num"		: 1,
		"class_id"	: "npc_piggy",
		"desc"		: "Name 1 Piggy"
	},
	"r221"	: {
		"type"		: "counter",
		"name"		: "butterflies_named",
		"num"		: 1,
		"class_id"	: "npc_butterfly",
		"desc"		: "Name 1 Butterfly"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 300,
	"currants"	: 200,
	"mood"		: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 30
		}
	}
};

//log.info("animalkinship_name_animals.js LOADED");

// generated ok (NO DATE)
