var title = "Eggy McWeggies";
var desc = "Make some eggselent dishes. Use your <a href=\"event:item|frying_pan\">Frying Pan<\/a> to make 7 <a href=\"event:item|mexicali_eggs\">Mexicali Eggs<\/a>, 11 <a href=\"event:item|green_eggs\">Green Eggs<\/a> and 15 <a href=\"event:item|eggy_scramble\">Eggy Scrambles<\/a>. And yes, eggselent is too a real word.";
var offer = "Mmmmm. Eggs. Gotta love em. Right, kid? <split butt_txt=\"Love may be too strong a word, but sure.\" \/> Well, let's put your <b>Cheffery<\/b> skills to work here and see what you can do. Grab your <a href=\"event:item|frying_pan\">Frying Pan<\/a> and go make 7 orders of <a href=\"event:item|mexicali_eggs\">Mexicali Eggs<\/a>, 11 <a href=\"event:item|green_eggs\">Green Eggs<\/a> and 15 <a href=\"event:item|eggy_scramble\">Eggy Scrambles<\/a>.";
var completion = "Saaaay. Those were some sweet smelling Eggy McWeggies you whipped up. <split butt_txt=\"Aw, thanks.\" \/>Especially that last dish of whatchamacallit. You could sell those. <split butt_txt=\"Well, shucks.\" \/>Here's a little reward you can put towards your future edumacation. You show promise, kid.";


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
var prereq_quests = ["cheffery_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r135"	: {
		"type"		: "make",
		"recipe_id"	: 82,
		"num"		: 7,
		"desc"		: "Make 7 x Mexicali Eggs"
	},
	"r136"	: {
		"type"		: "make",
		"recipe_id"	: 89,
		"num"		: 11,
		"desc"		: "Make 11 x Green Eggs"
	},
	"r137"	: {
		"type"		: "make",
		"recipe_id"	: 81,
		"num"		: 15,
		"desc"		: "Make 15 x Eggy Scramble"
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
	xp = pc.stats_add_xp(round_to_5(325 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(125 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 325,
	"currants"	: 200,
	"energy"	: 125,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 30
		}
	}
};

//log.info("cheffery_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
