var title = "A Reasonable Dinner";
var desc = "Gumbo, Pasta & a Pickle? Why not. Using an <a href=\"event:item|awesome_pot\">Awesome Pot<\/a>, prepare a <a href=\"event:item|meat_gumbo\">Meat Gumbo<\/a> and a nice <a href=\"event:item|tasty_pasta\">Tasty Pasta<\/a> to go with it. Oh, and a <a href=\"event:item|pickle\">Pickle<\/a> on the side. (Note: You may need to use the pot for a bit to learn the recipe for Tasty Pasta.)";
var offer = "I'm getting hungry. You know what makes a nice meal?<split butt_txt=\"What?\" \/> <a href=\"event:item|meat_gumbo\">Meat Gumbo<\/a> and <a href=\"event:item|tasty_pasta\">Tasty Pasta<\/a>! That's my favorite. <split butt_txt=\"Sounds reasonable\" \/> Sure does! And with a <a href=\"event:item|pickle\">Pickle<\/a> on the side, it is a complete meal. Make me one? (Note: You may need to use the pot for a bit to learn the recipe for Tasty Pasta.)";
var completion = "Oh boy! It was great of you to make me this dinner. But you know what? <split butt_txt=\"Uh oh\" \/> No, it's good. I already ate! So, you can keep the dinner ... and let me give you a little something so you know I appreciate it.";


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
	"r40"	: {
		"type"		: "make",
		"recipe_id"	: 35,
		"num"		: 1,
		"desc"		: "Make a Meat Gumbo"
	},
	"r41"	: {
		"type"		: "make",
		"recipe_id"	: 30,
		"num"		: 1,
		"desc"		: "Make a Tasty Pasta"
	},
	"r42"	: {
		"type"		: "make",
		"recipe_id"	: 143,
		"num"		: 1,
		"desc"		: "Make a Pickle"
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
	xp = pc.stats_add_xp(round_to_5(800 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(525 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(80 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 800,
	"currants"	: 525,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 80
		}
	}
};

//log.info("masterchef_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
