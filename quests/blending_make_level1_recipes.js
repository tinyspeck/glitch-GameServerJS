var title = "Juice Medley Melee";
var desc = "Use a <a href=\"event:item|blender\">Blender<\/a> to make a <a href=\"event:item|fruity_juice\">Fruity Juice<\/a>, a <a href=\"event:item|lemon_juice\">Lemon Juice<\/a>, and an <a href=\"event:item|orange_juice\">Orange Juice<\/a>. Hold the pulp.";
var offer = "Hey, kid. I feel a touch of the scurvy coming on. Can you hook me up with some juice? <split butt_txt=\"But... you're a rock.\" \/>I don't know if you've noticed this yet, kid, but I'm not quite like other rocks. <split butt_txt=\"Er, yes.\" \/>So scurvy. Capiche? <split butt_txt=\"Capiche.\" \/> So could you get yourself a <a href=\"event:item|blender\">Blender<\/a> and whip me up some <a href=\"event:item|fruity_juice\">Fruity Juice<\/a>. <split butt_txt=\"OK!\" \/>Not so fast. And a <a href=\"event:item|lemon_juice\">Lemon Juice<\/a>. <split butt_txt=\"You bet!\" \/>Hold on. And an <a href=\"event:item|orange_juice\">Orange Juice<\/a>. <split butt_txt=\"And?\" \/>And what? That's it. <split butt_txt=\"I'm on it!\" \/>Wait a second, kid. One last thing. <split butt_txt=\"Name it.\" \/>Hold the pulp.";
var completion = "That juice looks mighty bracing, kid. But I forgot something. <split butt_txt=\"Yeah?\" \/>I can't drink it. <split butt_txt=\"But you said...\" \/>Forget what I said. I'm a rock. I say a lot of things. But here. For being such a good sport, I'm going to give you an extra-big reward. <split butt_txt=\"Wow, thanks!\" \/>One thing, though. <split butt_txt=\"What's that?\" \/>I see pulp.";


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
	"r30"	: {
		"type"		: "make",
		"recipe_id"	: 52,
		"num"		: 1,
		"desc"		: "Make a Fruity Juice"
	},
	"r31"	: {
		"type"		: "make",
		"recipe_id"	: 53,
		"num"		: 1,
		"desc"		: "Make a Lemon Juice"
	},
	"r32"	: {
		"type"		: "make",
		"recipe_id"	: 54,
		"num"		: 1,
		"desc"		: "Make an Orange Juice"
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
	xp = pc.stats_add_xp(round_to_5(125 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(75 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.making_try_learn_recipe(56);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 125,
	"currants"	: 75,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 10
		}
	},
	"recipes"	: {
		"0"	: {
			"class_tsid"	: "cloud_11_smoothie",
			"label"		: "Cloud 11 Smoothie"
		}
	}
};

//log.info("blending_make_level1_recipes.js LOADED");

// generated ok (NO DATE)
