var title = "Enlarge Yer Slots";
var desc = "The Street Spirit over on Progress Way is a bag vendor who sells 'em cheap. Go find her and buy two bags.";
var offer = "The Street Spirit over on Progress Way is a bag vendor who sells 'em cheap. Go find her and buy two bags.";
var completion = "You got the bags: well done! I'm not even going to explain how you get things in them. I think you are smart enough to figure it out.<split butt_txt=\"Yeah! I am!\" \/>Now head back to your Home Street and we'll wrap this tutorial up.<split butt_txt=\"Got it\" \/>Oh yeah … here are some nice prizes for your trouble.";


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
	"r365"	: {
		"type"		: "counter",
		"name"		: "generic_bag_purchased",
		"num"		: 2,
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
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 150,
	"currants"	: 500,
	"mood"		: 20,
	"energy"	: 20
};

function onComplete_custom(pc){
	pc.apiSetTimerX('announce_vog_fade', 2000, "You can go back and forth between your home street and world at almost any time", {done_payload: {location_script_name: 'revealImagination'}});
}

function onJustCompleted(pc){
	pc.apiSendMsg({type: 'store_end'});
}

//log.info("buy_two_bags.js LOADED");

// generated ok (NO DATE)
