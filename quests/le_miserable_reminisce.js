var title = "Le Misérable";
var desc = "Turn on the machine in the Fireflex 3000 Lab";
var offer = "Want to reminisce Le Misérable?";
var completion = "You've still got it!";


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
var prereq_quests = ["le_miserable_part_2"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"le_miserable"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF42FA3D183STG"
	}
};

var requirements = {
	"r506"	: {
		"type"		: "flag",
		"name"		: "turn_on_machine",
		"class_id"	: "teleporter_button",
		"desc"		: "Turn on the Machine"
	},
	"r546"	: {
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
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
}
var rewards = {};

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('le_miserable_part_2');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
			
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
		
	return true;
}

function onExitLocation(pc){
	var pc = this.owner;
	if (!pc) return;
		
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
				
	pc.instances_exit('le_miserable');
}

function onStarted(pc){
	var location_id = 'le_miserable';
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
		this.questInstanceLocation(pc, location_id, -1873, -167, 5*60, {preserve_links: true});
	}
		
	return {ok: 1};
}

//log.info("le_miserable_reminisce.js LOADED");

// generated ok (NO DATE)
