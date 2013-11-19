var title = "Enlarge Yer Slots";
var desc = "With only 16 places to put things, it is easy to run out of space. Go find any <b>Street Spirit<\/b> who sells <b>Hardware<\/b> and buy yourself a <a href=\"event:item|bag_generic\">Generic Bag<\/a> or a <a href=\"event:item|bag_bigger\">Bigger Bag<\/a>.";
var offer = "With only 16 places to put things, it is easy to run out of space. Go find any <b>Street Spirit<\/b> who sells <b>Hardware<\/b> and buy yourself a <a href=\"event:item|bag_generic\">Generic Bag<\/a> or a <a href=\"event:item|bag_bigger\">Bigger Bag<\/a>.";
var completion = "You got the bag: well done! I'm not even going to explain how you get things in it. I think you are smart enough to figure it out.<split butt_txt=\"Yeah! I am!\" \/>On second thought ... drag stuff in to it. (I worry about you, kid.)<split butt_txt=\"Grrrr!\" \/>Whatever ... here's some nice prizes for your trouble.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
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
	"r110"	: {
		"type"		: "counter",
		"name"		: "generic_bag_purchased",
		"num"		: 1,
		"class_id"	: "bag_generic",
		"desc"		: "Purchase a Generic Bag"
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
	xp = pc.stats_add_xp(round_to_5(150 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(20 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 500,
	"mood"		: 20,
	"energy"	: 20
};

//log.info("buy_bag.js LOADED");

// generated ok (NO DATE)
