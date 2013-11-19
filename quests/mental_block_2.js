var title = "Mental Block 2";
var desc = "Create a path to the exit by dropping blocks along the way.";
var offer = "You look bedrazzled. <split butt_txt=\"What … ?\" \/> You know, bedrazzled, confuzzled, disorientled. I know, I dazzle you with my infinite knowledge of words. <split butt_txt=\"I don't think they're …\" \/> But of course, you don't think. You've got another mental block. Ready to tackle it?";
var completion = "You sure cleared up that block of a mess. Now fluster down and enjoy your reward.";

var button_accept = "You betcha!";
var button_decline = "Maybe later.";

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
var prereq_quests = ["mental_block"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"mental_block_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFE2JAV2FC3TPI"
	}
};

var requirements = {
	"r554"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r555"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Complete the Journey"
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
	currants = pc.stats_add_currants(round_to_5(2200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 2200,
	"mood"		: 200,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 150
		}
	}
};

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
			
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'mental_block_2', 0, 0, 5*60, {preserve_links: true}, {}, true);
		
	return {ok: 1};
}

//log.info("mental_block_2.js LOADED");

// generated ok (NO DATE)
