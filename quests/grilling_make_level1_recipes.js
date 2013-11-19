var title = "The Grill of Victory";
var desc = "Fire up a patented, accept-no-substitutes <a href=\"event:item|mike_tyson_grill\">Famous Pugilist Grill<\/a> and make a <a href=\"event:item|simple_bbq\">Simple BBQ<\/a> and 3 <a href=\"event:item|grilled_cheese\">Grilled Cheese<\/a>.";
var offer = "You know, kid, I've never met a person who doesn't like a good Grilled Cheese. <split butt_txt=\"Come to think of it, neither have I.\" \/>So how's about you get yourself a <a href=\"event:item|mike_tyson_grill\">Famous Pugilist Grill<\/a>, fire it up, and grill up a <a href=\"event:item|grilled_cheese\">Grilled Cheese<\/a>. Better yet, make that three. <split butt_txt=\"Three?\" \/>And while you're at it, cook up a <a href=\"event:item|simple_bbq\">Simple BBQ<\/a>. <split butt_txt=\"BBQ, too?\" \/>All good people like BBQ, kid. You in?";
var completion = "Well, kid. If the last great Famous Pugilist himself were here right now, he'd say... <split butt_txt=\"What? What would he say?\" \/> Um \"mumble-mumble, humna-humna-humna\". <split butt_txt=\"And that would mean?…\" \/> Hecked if I know, kid. He lost his last tooth approximately the same time as his last braincell. But I bet he still liked Grilled Cheese.";


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
	"r33"	: {
		"type"		: "make",
		"recipe_id"	: 23,
		"num"		: 1,
		"desc"		: "Make a Simple BBQ"
	},
	"r34"	: {
		"type"		: "make",
		"recipe_id"	: 21,
		"num"		: 3,
		"desc"		: "Make 3 x Grilled Cheese"
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
	xp = pc.stats_add_xp(round_to_5(275 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(175 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(25);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 275,
	"currants"	: 175,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 25
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "papl_upside_down_pizza",
			"label"		: "Pineapple Upside Down Pizza"
		}
	}
};

//log.info("grilling_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
