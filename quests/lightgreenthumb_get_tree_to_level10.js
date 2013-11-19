var title = "Be A Tree-Pleaser";
var desc = "Find seven trees, and visibly increase the level of their healthfulness by petting or watering. You'll need a <a href=\"event:item|watering_can\">Watering Can<\/a> to do this. And your firmest <b>Petting<\/b> hand.";
var offer = "Funky-coloured thumb you've got there, kid. What shade is that? Lime? Teal? <split butt_txt=\"I prefer 'Chartreuse'?\"> Course you do, Pickle. Say: you should put that digit to good use. How about you display your improved greenfingerliness by radically improving the health of some trees? <split butt_txt=\"How radically?\">Well, you must have noticed that sometimes when you pet or water, the trees look lusher, more harvestable, and generally, y'know, *foliagier*?<split butt_txt=\"Not a word.\"> Not the point. But the healthier they are, the faster they'll reach full maturity, and the more fruit they'll produce. <split butt_txt=\"Top tip.\"> As you go about your greenthumbing business, make seven trees visibly healthier. No rush. Take your time - but do do it: all the nice trees love a greenthumb.";
var completion = "Hey, hot-thumbs. Did'ya know there's a shade called Hooker's Green? <split butt_txt=\"#49796B, right?\"> Oh, um… <split butt_txt=\"Named after botanical artist William Hooker (1779-1832)?\"> Yeah, alright kid, so you swallowed a 'pedia. Point is: you're quite the tree pleaser. The world's foliage is some per cent healthier, and all because of you. Here's a little something for your efforts.";


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
	"r300"	: {
		"type"		: "counter",
		"name"		: "heal_trant",
		"num"		: 7,
		"desc"		: "Improve the health of 7 trees"
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 150,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 25
		}
	}
};

//log.info("lightgreenthumb_get_tree_to_level10.js LOADED");

// generated ok (NO DATE)
