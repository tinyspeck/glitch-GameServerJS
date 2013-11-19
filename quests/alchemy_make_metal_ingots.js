var title = "Rub Eleven Out";
var desc = "Plain metal is good. Fancy metal is better. Using <a href=\"event:item|alchemical_tongs\">Alchemical Tongs<\/a>, alchemify <a href=\"event:item|plain_metal\">Plain Metal<\/a> into 11 Ingots each of <a href=\"event:item|tin\">Tin<\/a>, <a href=\"event:item|copper\">Copper<\/a>, and <a href=\"event:item|molybdenum\">Molybdenum<\/a>.";
var offer = "Now that you're learning your way around the elements, are you ready to try your hand at some metalspawning? <split butt_txt=\"Born ready, I was.\" \/> Get yourself some <a href=\"event:item|alchemical_tongs\">Alchemical Tongs<\/a>, and a pile of <a href=\"event:item|plain_metal\">Plain Metal<\/a>. Then rub yourself up 11 Ingots each of <a href=\"event:item|tin\">Tin<\/a>, <a href=\"event:item|copper\">Copper<\/a>, and <a href=\"event:item|molybdenum\">Molybdenum<\/a>. Yes?";
var completion = "By my count - and I'm always right about these things - it looks like you've alchemated up 11 ingots each of Tin, Copper and Molybdenum. <split butt_txt=\"Please make with the applause.\" \/> Nothing says applause like cold, hard compensation. Here you go.";


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
	"r235"	: {
		"type"		: "make",
		"recipe_id"	: 174,
		"num"		: 11,
		"desc"		: "Make 11 x Tin"
	},
	"r236"	: {
		"type"		: "make",
		"recipe_id"	: 175,
		"num"		: 11,
		"desc"		: "Make 11 x Copper"
	},
	"r237"	: {
		"type"		: "make",
		"recipe_id"	: 176,
		"num"		: 11,
		"desc"		: "Make 11 x Molybdenum"
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
	currants = pc.stats_add_currants(round_to_5(250 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 275,
	"currants"	: 250,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 30
		}
	}
};

//log.info("alchemy_make_metal_ingots.js LOADED");

// generated ok (NO DATE)
