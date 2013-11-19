var title = "Mendel's Apprentice";
var desc = "Plant 5 different types of vegetable seeds in your crop garden. You can buy vegetable seeds from <a href=\"event:item|npc_gardening_vendor\">Gardening Goods Street Spirits<\/a> or <a href=\"event:item|npc_streetspirit_gardening_goods\">Gardening Tools Vendors<\/a>.";
var offer = "They say one is closest to Mab's heart in a garden. <split butt_txt=\"They do?\" \/> Of course! And there's nothing Mab likes more than to see Glitchen planting seeds and encouraging trant seedlings to grow. <split butt_txt=\"Seems like her thing.\" \/> Indeed. She's always hopeful that something new and unexpected might pop up out of the soil. Something about G-know-types and Femo-types. <split butt_txt=\"Sounds scientifical.\" \/> Kind of. Why not see what sprouts by planting five different types of vegetable crops on your Home Street? <split butt_txt=\"Why not?\" \/>You'll want to imagine a crop garden first, then beg, buy, or borrow some vegetable seeds (like broccoli, spinach, or parsnips). <a href=\"event:item|npc_gardening_vendor\">Gardening Tools Vendors<\/a> or <a href=\"event:item|npc_streetspirit_gardening_goods\">Gardening Goods Street Spirits<\/a> are a good place to start.";
var completion = "Look at you grow! That's some mighty fine croppery, there {pc_label}!  Who knows what tranty traits your mutant crop garden might produce?  Ever heard of a triffid?  Well...never mind.  Here are some resources to help you continue your (possibly diabolical) research.";

var button_accept = "Did you say mutant?";

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
var prerequisites = [{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"croppery_1"
},{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"botany_1"
}];
var end_npcs = ["npc_gardening_vendor"];
var locations = {};
var requirements = {
	"r439"	: {
		"type"		: "counter",
		"name"		: "Plant 5 seeds",
		"num"		: 5,
		"class_id"	: "seed_broccoli",
		"desc"		: "Plant 5 vegetable seeds in your crop garden"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(40 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(60 * multiplier));
	favor = pc.stats_add_favor_points("mab", round_to_5(250 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 500,
	"currants"	: 500,
	"mood"		: 40,
	"energy"	: 60,
	"favor"		: {
		"0"	: {
			"giant"		: "mab",
			"points"	: 250
		}
	}
};

//log.info("gardening_plant_5_seed_types.js LOADED");

// generated ok (NO DATE)
