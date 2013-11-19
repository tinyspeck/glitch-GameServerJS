var title = "Get into a Froth";
var desc = "A-blendering you will go. Use your twin-engine <a href=\"event:item|blender\">Blender<\/a> to whip up a <a href=\"event:item|tooberry_shake\">Too-Berry Shake<\/a>, an <a href=\"event:item|earthshaker\">Earthshaker<\/a> and a <a href=\"event:item|bubble_tea\">Bubble Tea<\/a>.";
var offer = "So, chum, you think you're getting the hang of that there <a href=\"event:item|blender\">Blender<\/a>? <split butt_txt=\"I'm juicing up a storm.\" \/> Juice, schmuice. The real test of a blenderer's mettle is the ability to make fancy drinks. <split butt_txt=\"My mettle is ready to be tested.\" \/> I had a feeling you'd say that. Whip up a <a href=\"event:item|tooberry_shake\">Too-Berry Shake<\/a>, an <a href=\"event:item|earthshaker\">Earthshaker<\/a> and a <a href=\"event:item|bubble_tea\">Bubble Tea<\/a>. Then we'll talk.";
var completion = "Well, well, well. A-blendering you certainly did go. I like the extra froth you put on the <b>Too-Berry Shake<\/b>. <split butt_txt=\"Hand-frothed by yours truly.\" \/> And are those extra bubbles in that <b>Bubble Tea<\/b>? It's these little extra touches that tell me you're gonna go far, kid. <split butt_txt=\"Golly!\" \/> Speaking of little extra touches, here's the usual little something for your trouble.";


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
var prereq_quests = ["blending_make_level1_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r186"	: {
		"type"		: "make",
		"recipe_id"	: 58,
		"num"		: 1,
		"desc"		: "Make a Too-berry Shake"
	},
	"r187"	: {
		"type"		: "make",
		"recipe_id"	: 60,
		"num"		: 1,
		"desc"		: "Make an Earthshaker"
	},
	"r188"	: {
		"type"		: "make",
		"recipe_id"	: 61,
		"num"		: 1,
		"desc"		: "Make a Bubble Tea"
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
	xp = pc.stats_add_xp(round_to_5(175 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(125 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 175,
	"currants"	: 125,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 15
		}
	}
};

//log.info("blending_make_level2_recipes.js LOADED");

// generated ok (NO DATE)
