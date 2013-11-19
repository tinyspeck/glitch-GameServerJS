var title = "Potion Detector";
var desc = "Create five <b>Potions<\/b> with your <a href=\"event:item|cauldron\">Cauldron<\/a>. Take all the time you need.";
var offer = "What ho, adventurer, where wandrest thou? Odd's Bodkins, art thou in search of a quest? A Potionny Quest perchance, think'ye? <split butt_txt=\"Sorry, what?\" \/> Ah, you got me. I was just trying something more potion-appropriate, y'know? <split butt_txt=\"Forsooth.\" \/> You got it! Speaking of getting it, you got a <a href=\"event:item|cauldron\">Cauldron<\/a> to go with your shiny new Potion-Making skill, right? <split butt_txt=\"Well…\" \/> Well if you haven't - get one. Then bubble yourself five potions. Doesn't matter how long you take, as long as there are five of them. Got it? <split butt_txt=\"Got it. Fare thee well.\" \/>";
var completion = "Good morrow, sorcerer. <split butt_txt=\"What up.\" \/> So you doubled, doubled, toiled and troubled yourself to make five magical potions, did you? <split butt_txt=\"You bet your gadzooks I did.\" \/> I don't think that word means what you think it means. However, a noble attempt. And for that, my little one, here's a magical little reward.";


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
	"r310"	: {
		"type"		: "counter",
		"name"		: "make_potions",
		"num"		: 5,
		"class_id"	: "cauldron",
		"desc"		: "Make 5 potions"
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
	xp = pc.stats_add_xp(round_to_5(1200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(150 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(300 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(120 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1200,
	"mood"		: 150,
	"energy"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 120
		}
	}
};

//log.info("potionmaking_make_potions.js LOADED");

// generated ok (NO DATE)
