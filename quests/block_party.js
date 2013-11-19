var title = "Block Party";
var desc = "Prove your blockmakery by making three <a href=\"event:item|grade_aa_earth_block\">Urth Blocks<\/a>.";
var offer = "Ah, <b>Blockmaking<\/b>. A good, honest skill, lad. <split butt_txt=\"Lad?\" \/>  Lass? Lad? Whatever. I've never understood the difference with you lot. ANYWAY. It's good honest labor, blockmaking. Hard day's work for a… well, sense of satisfaction of a job done well. A skilled blockmaker is always in demand. So you'd better hone your trade.<split butt_txt=\"I've learnt the skill, isn't that enough?\" \/>Ah, kids these days. No: make me three <a href=\"event:item|grade_aa_earth_block\">Urth Blocks<\/a>, just to prove your skill. Will you do it?";
var completion = "I take back what I said, kid. These are some mighty fine blocks. <split butt_txt=\"Why, thank you.\" \/> It seems you might be a born Blockmaker after all. And for that, I'll take a slice of humble pie, and you can have a little reward.";


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
	"r320"	: {
		"type"		: "make",
		"recipe_id"	: 190,
		"num"		: 3,
		"desc"		: "Make 3 x Urth Block"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(600 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1000,
	"currants"	: 600,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 100
		}
	}
};

//log.info("block_party.js LOADED");

// generated ok (NO DATE)
