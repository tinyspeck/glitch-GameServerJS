var title = "Mental Block";
var desc = "Create a path to the exit by dropping blocks along the way.";
var offer = "Are you ready to reminisce Mental Block?";
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
		"condition":	"completed_quest",
		"value":	"mental_block"
}];
var end_npcs = [];
var locations = {
	"mental_block_rem"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFN6H8V6QB3TSH"
	}
};

var requirements = {
	"r542"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r543"	: {
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
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 350,
	"mood"		: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 50
		}
	}
};

function canOffer(pc){
	if (!pc.imagination_has_upgrade('walk_speed_3')) return false;
	if (!pc.imagination_has_upgrade('jump_2')) return false;
	
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('mental_block');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
			
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
		
	return true;
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
		
	pc.instances_exit('mental_block_rem');
}

function onStarted(pc){
	var location_id = 'mental_block_rem';
	var tsid;
	if (config.is_dev){
		tsid = this.locations[location_id].dev_tsid;
	}
	else{
		tsid = this.locations[location_id].prod_tsid;
	}
			
	var loc = apiFindObject(tsid);
	var marker = loc.find_items('marker_teleport')[0];
	
	if (marker){
		this.questInstanceLocation(pc, location_id, marker.x, marker.y, 5*60, {preserve_links: true});
	}
	else{
		this.questInstanceLocation(pc, location_id, 0, 0, 5*60, {preserve_links: true});
	}
	
	return {ok: 1};
}

//log.info("mental_block_rem.js LOADED");

// generated ok (NO DATE)
