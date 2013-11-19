var title = "Dullite, Beryl and Sparkly";
var desc = "Mine from <a href=\"event:item|dullite\">Dullite<\/a>, <a href=\"event:item|beryl\">Beryl<\/a> and <a href=\"event:item|sparkly\">Sparkly<\/a> rocks until you have 17, 13 and 11 ore chunks respectively. You'll have an easier time finding rocks to mine in <a href=\"event:location|50\">Ilmenskie Caverns<\/a>, <a href=\"event:location|78\">Ilmenskie Deeps<\/a>, <a href=\"event:location|64\">Groddle Heights<\/a> and <a href=\"event:location|76\">Alakol<\/a>. You'll need a pick too, so visit any <b>Street Spirit<\/b> who sells <b>Hardware<\/b> or <b>Alchemical Goods<\/b>.";
var offer = "You little miner, you! Go get a pick from a <b>Street Spirit<\/b> who sells <b>Hardware<\/b> or <b>Alchemical Goods<\/b>, and then mine you some ore: get 17 <a href=\"event:item|dullite\">Dullite<\/a>, 13 <a href=\"event:item|beryl\">Beryl<\/a> and 11 <a href=\"event:item|sparkly\">Sparkly<\/a> ore chunks.";
var completion = "Well done! Hope your arms aren't too tired. If you mine enough, you probably want to get the refining skill too (requires element handling). Here's a little something for your trouble.";


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
	"r102"	: {
		"type"		: "item",
		"class_id"	: "dullite",
		"num"		: 17,
		"remove"	: 1,
		"desc"		: "Collect 17 Chunks of Dullite"
	},
	"r103"	: {
		"type"		: "item",
		"class_id"	: "beryl",
		"num"		: 13,
		"remove"	: 1,
		"desc"		: "Collect 13 Chunks of Beryl"
	},
	"r104"	: {
		"type"		: "item",
		"class_id"	: "sparkly",
		"num"		: 11,
		"remove"	: 1,
		"desc"		: "Collect 11 Chunks of Sparkly"
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
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(75 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(15 * multiplier));
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
	"currants"	: 100,
	"energy"	: 75,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 15
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('help_mine', true);
}

//log.info("mining_mine_rocks.js LOADED");

// generated ok (NO DATE)
