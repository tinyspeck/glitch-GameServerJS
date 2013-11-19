var title = "Down Home Cookin' ";
var desc = "Use your <a href=\"event:item|frying_pan\">Frying Pan<\/a> to whip up a batch of 7 dee-licious <a href=\"event:item|bubble_and_squeak\">Bubble and Squeaks<\/a>, and 11 scrumptious <a href=\"event:item|corny_fritter\">Corny Fritters<\/a>.";
var offer = "There is nothing, I say, nothing, better than down-home cookin'. <split butt_txt=\"Mmmhmmm!\" \/> Let's see what you can do with that old <a href=\"event:item|frying_pan\">Frying Pan<\/a> of yours. Whip up 7 batches of <a href=\"event:item|bubble_and_squeak\">Bubble and Squeak<\/a>, and 11 <a href=\"event:item|corny_fritter\">Corny Fritters<\/a>.";
var completion = "Well, I say. Bubble and Squeak AND Corny Fritters. You've done gone done some delectable home cooking. <split butt_txt=\"The secret ingredient is love.\" \/> I can't tell you how much I hope you mean that in the figurative sense. Here's the traditional bonus reward.";


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
var prereq_quests = ["cheffery_make_level2_recipes"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r189"	: {
		"type"		: "make",
		"recipe_id"	: 92,
		"num"		: 7,
		"desc"		: "Make 7 x Bubble and Squeak"
	},
	"r190"	: {
		"type"		: "make",
		"recipe_id"	: 83,
		"num"		: 11,
		"desc"		: "Make 11 x Corny Fritter"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 225,
	"currants"	: 150,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 20
		}
	}
};

//log.info("cheffery_make_level3_recipes.js LOADED");

// generated ok (NO DATE)
