var title = "Color Unblocking";
var desc = "Unblock your way to the exit, collecting rewards along the way.";
var offer = "Are you ready to reminisce Color Unblocking?";
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
		"value":	"puzzle_level_color_blockage"
}];
var end_npcs = [];
var locations = {
	"color_unblocking_rem"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFVJF94FAB3HOC"
	}
};

var requirements = {
	"r538"	: {
		"type"		: "flag",
		"name"		: "instance_exit_via_door",
		"desc"		: "Find the Exit"
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 50
		}
	}
};

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('puzzle_level_color_blockage');
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
	
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
			
	pc.instances_exit('color_unblocking_rem');
}

function onStarted(pc){
	var location_id = 'color_unblocking_rem';
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

//log.info("puzzle_level_color_blockage_rem.js LOADED");

// generated ok (NO DATE)
