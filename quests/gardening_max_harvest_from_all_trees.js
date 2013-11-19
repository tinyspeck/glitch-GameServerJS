var title = "Super Secret Happy Bonus Tree Harvest";
var desc = "Use your arboreal mojo to get the maximum harvest from seven kinds of <b>Trees<\/b> (requires <a href=\"event:external|http:\/\/www.glitch.com\/upgrades\/gathering\/gardening-tree-super-harvest-1\/\">Tree Hugger<\/a> upgrade)";
var offer = "Now that you've hit the zenith of <b>Arborology<\/b> mastery, I've got a little secret for you, chum. <split butt_txt=\"Ooh!\" \/> Every time you Harvest a <b>Tree<\/b>, you've got a shot at a pretty big haul. And if you get a maximum harvest from seven kinds of Trees, you'll get something extra. <split butt_txt=\"Why?\" \/>That's not for me to say. Those trees are touchy about giving away their secrets. In fact, I've probably said too much. Let's forget this conversation ever happened.";
var completion = "Just like I said it would happen. The trees love you. You're knee deep in Spices and Bubbles and whatnot. <split butt_txt=\"Yeah. About that...\" \/>And obviously now you need to use a <a href=\"event:item|spice_mill\">Spice Mill<\/a> and a <a href=\"event:item|bubble_tuner\">Bubble Tuner<\/a> and such to process them all. Get to it. Those Spices aren't going to mill themselves.";


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
	"r161"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_spice",
		"num"		: 1,
		"class_id"	: "trant_spice",
		"desc"		: "Get a Spice Plant harvest bonus"
	},
	"r162"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_gas",
		"num"		: 1,
		"class_id"	: "trant_gas",
		"desc"		: "Get a Gas Plant harvest bonus"
	},
	"r163"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_fruit",
		"num"		: 1,
		"class_id"	: "trant_fruit",
		"desc"		: "Get a Fruit Tree harvest bonus"
	},
	"r164"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_egg",
		"num"		: 1,
		"class_id"	: "trant_egg",
		"desc"		: "Get an Egg Plant harvest bonus"
	},
	"r165"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_bubble",
		"num"		: 1,
		"class_id"	: "trant_bubble",
		"desc"		: "Get a Bubble Tree harvest bonus"
	},
	"r166"	: {
		"type"		: "counter",
		"name"		: "harvest_bonus_trant_bean",
		"num"		: 1,
		"class_id"	: "trant_bean",
		"desc"		: "Get a Bean Tree harvest bonus"
	},
	"r258"	: {
		"type"		: "counter",
		"name"		: "harvest_max_wood_tree",
		"num"		: 1,
		"class_id"	: "wood_tree",
		"desc"		: "Get the maximum harvest from a Wood Tree"
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
	xp = pc.stats_add_xp(round_to_5(900 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(600 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(90 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 900,
	"currants"	: 600,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 90
		}
	}
};

//log.info("gardening_max_harvest_from_all_trees.js LOADED");

// generated ok (NO DATE)
