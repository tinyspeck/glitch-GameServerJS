var title = "Walk Toward the Light";
var desc = "Use different colored lights to reveal the one, true path.";
var offer = "Pssst. You there. How are your eyes? <split butt_txt=\"Huh?\" \/> What I mean to say is, do your eyes work properly? Can you see all the colors of the rainbow? <split butt_txt=\"Um, sure. I believe so.\" \/> Good. Good! Because, where you’re going, you’re going to need sharp eyes. <split butt_txt=\"If you say so!\" \/> I do. And remember, go toward the light!";
var completion = "Colorific! Unless my eyes are playing tricks on me, I’d say it looks like you deserve a reward.";


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
		"condition":	"over_level",
		"value":	13
}];
var end_npcs = [];
var locations = {
	"puzzle_level_light_perspective"	: {
		"dev_tsid"	: "LRO15SJ7C593JC2",
		"prod_tsid"	: "LIFV3KVHV583MC6"
	}
};

var requirements = {
	"r515"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
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
	currants = pc.stats_add_currants(round_to_5(1500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("cosma", round_to_5(150 * multiplier));
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
	"currants"	: 1500,
	"mood"		: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 150
		}
	}
};

function canOffer(pc){
	if (!pc.imagination_has_upgrade('walk_speed_3')) return false;
	if (!pc.imagination_has_upgrade('jump_2')) return false;
	
	return true;
}

function onComplete_custom(pc){
	//pc.instances_exit('puzzle_level_light_perspective');
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
	
	pc.instances_exit('puzzle_level_light_perspective');
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'puzzle_level_light_perspective', -3445, -159, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("puzzle_level_light_perspective.js LOADED");

// generated ok (NO DATE)
