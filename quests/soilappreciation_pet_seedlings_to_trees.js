var title = "Seedlings BFF";
var desc = "Crack your knuckles and administer a gentle but authoritative petting to 7 different <b>Seedlings<\/b>.";
var offer = "All good-hearted people love <b>Trees<\/b>. Am I right, kid? <split butt_txt=\"Is this a setup?\" \/> Yes. I need you to visit seven different <b>Seedlings<\/b> and administer the finest petting your fingers can muster. <split butt_txt=\"I'll pet 'em good.\" \/> Settle down. It's not a hazing. Take good care of them, and there will be a bit of booty for your treasure bag.";
var completion = "Those are 7 fine, upstanding Seedlings you've helped along on their journey to Treehood. Here's a little green for your grubby little thumbs.";


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
	"r217"	: {
		"type"		: "counter",
		"name"		: "seedlings_petted",
		"num"		: 7,
		"desc"		: "Pet seven different seedlings"
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
	xp = pc.stats_add_xp(round_to_5(325 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(30 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 325,
	"currants"	: 200,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 30
		}
	}
};

//log.info("soilappreciation_pet_seedlings_to_trees.js LOADED");

// generated ok (NO DATE)
