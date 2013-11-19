var title = "Magnanimous Maker";
var desc = "The <b>Giants<\/b> have needs, and right now they need a <a href=\"event:item|cocktail_shaker\">Cocktail Shaker<\/a> and an <a href=\"event:item|awesome_pot\">Awesome Pot<\/a>. Use your <a href=\"event:item|tinkertool\">Tinkertool<\/a> to craft one of each, then donate each to the <b>Shrines<\/b> of the <b>patron Giants<\/b> of <a href=\"event:skill|cocktailcrafting_1\">Cocktail Crafting<\/a> and <a href=\"event:skill|masterchef_1\">Master Cheffery<\/a>.";
var offer = "Hey, kid. Now that you're a hotshot with the ol'  <a href=\"event:item|tinkertool\">Tinkertool<\/a>, feel like crafting yourself up a shiny chrome-plated <a href=\"event:item|cocktail_shaker\">Cocktail Shaker<\/a>? <split butt_txt=\"Does a Piggy plop in the woods?\" \/> That's the attitude, kid. When you're done, donate it to the <b>patron Giant<\/b> of <a href=\"event:skill|cocktailcrafting_1\">Cocktail Crafting<\/a>. And when you're done with that, do the same thing, but with <a href=\"event:skill|masterchef_1\">Master Cheffery<\/a>.";
var completion = "Well done, kid. Making a Cocktail Shaker and an Awesome Pot is hard. And letting them go is even harder. <split butt_txt=\"Give till it hurts. My motto.\" \/> You're a modern-day hero. Here's the usual remuneration, plus a little something extra. Because I like you.";


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
	"r226"	: {
		"type"		: "make",
		"recipe_id"	: 182,
		"num"		: 1,
		"desc"		: "Craft a Cocktail Shaker"
	},
	"r227"	: {
		"type"		: "make",
		"recipe_id"	: 187,
		"num"		: 1,
		"desc"		: "Craft an Awesome Pot"
	},
	"r231"	: {
		"type"		: "flag",
		"name"		: "cocktail_shaker_donated",
		"class_id"	: "cocktail_shaker",
		"desc"		: "Donate the Cocktail Shaker"
	},
	"r232"	: {
		"type"		: "flag",
		"name"		: "awesome_pot_donated",
		"class_id"	: "awesome_pot",
		"desc"		: "Donate the Awesome Pot"
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
	energy = pc.metabolics_add_energy(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(80 * multiplier));
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
	"energy"	: 250,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 80
		}
	}
};

//log.info("tinkering_craft_medium_tools.js LOADED");

// generated ok (NO DATE)
