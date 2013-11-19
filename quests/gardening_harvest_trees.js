var title = "Bring In The Sheaves";
var desc = "Harvest a ripe <a href=\"event:item|trant_fruit\">Fruit Tree<\/a>, <a href=\"event:item|trant_bubble\">Bubble Tree<\/a>, and <a href=\"event:item|trant_spice\">Spice Plant<\/a>. You won't need special tools to do this, but you may need to make space in your inventory.";
var offer = "Take <b>Trees<\/b>, for instance, kid. <split butt_txt=\"Okay! Where to?\" \/> Oh. Wait a sec... did I start in the middle of my thought again? <split butt_txt=\"Middle-ish.\" \/> Let's start again. How about I keep this simple? <split butt_txt=\"Simple is my favorite.\" \/> Get out there and harvest a ripe <a href=\"event:item|trant_fruit\">Fruit Tree<\/a>, <a href=\"event:item|trant_bubble\">Bubble Tree<\/a> and <a href=\"event:item|trant_spice\">Spice Plant<\/a>. <split butt_txt=\"With just my bare hands?\" \/> That's all you need, kiddo. But you'll also have to make sure you've got space to carry your harvest. Got that?";
var completion = "That's a pretty fine bunch of harvests you've harvested. What are you going to do with all those Cherries and Bubbles and Allspices? <split butt_txt=\"Gosh... I hadn't thought...\" \/> If I were in your foot-mittens, I'd consider getting a <a href=\"event:item|fruit_changing_machine\">Fruit Changing Machine<\/a>, a <a href=\"event:item|bubble_tuner\">Bubble Tuner<\/a> and a <a href=\"event:item|spice_mill\">Spice Mill<\/a>. Here's a little gift to help you out.";


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
	"r60"	: {
		"type"		: "counter",
		"name"		: "fruit_tree_harvested",
		"num"		: 1,
		"class_id"	: "trant_fruit",
		"desc"		: "Fruit Tree Harvested"
	},
	"r61"	: {
		"type"		: "counter",
		"name"		: "bubble_tree_harvested",
		"num"		: 1,
		"class_id"	: "trant_bubble",
		"desc"		: "Bubble Tree Harvested"
	},
	"r62"	: {
		"type"		: "counter",
		"name"		: "spice_tree_harvested",
		"num"		: 1,
		"class_id"	: "trant_spice",
		"desc"		: "Spice Plant Harvested"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(125 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
	"currants"	: 125,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 20
		}
	}
};

//log.info("gardening_harvest_trees.js LOADED");

// generated ok (NO DATE)
