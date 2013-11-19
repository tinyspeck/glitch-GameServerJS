var title = "Walk Toward the Light";
var desc = "Use different colored lights to reveal the one, true path.";
var offer = "Are you ready to reminisce Walk Toward the Light?";
var completion = "Welcome back, {pc_label}. I hope you enjoyed yourself.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
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
},{
		"not"		:0,
		"condition":	"completed_quest",
		"value":	"puzzle_level_light_perspective"
}];
var end_npcs = [];
var locations = {
	"puzzle_level_light_perspective_rem"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFS98777QB3P4B"
	}
};

var requirements = {
	"r539"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r550"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Return from the Puzzle"
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
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("cosma", round_to_5(50 * multiplier));
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
	"currants"	: 350,
	"mood"		: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 50
		}
	}
};

function canOffer(pc){
	if (!pc.imagination_has_upgrade('walk_speed_3')) return false;
	if (!pc.imagination_has_upgrade('jump_2')) return false;
	
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('puzzle_level_light_perspective');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
			
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
		
	return true;
}

function onComplete_custom(pc){
	//pc.instances_exit('puzzle_level_light_perspective_rem');
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
	
	pc.instances_exit('puzzle_level_light_perspective_rem');
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'puzzle_level_light_perspective_rem', -3445, -159, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("puzzle_level_light_perspective_rem.js LOADED");

// generated ok (NO DATE)
