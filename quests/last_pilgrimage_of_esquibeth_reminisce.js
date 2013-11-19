var title = "The Last Pilgrimage of Esquibeth";
var desc = "Retrace the heroic actions of Esquibeth on her last pilgrimage.";
var offer = "Would you like to reminisce The Last Pilgrimage of Esquibeth?";
var completion = "What a long, strange trip it's been.";


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
var prereq_quests = ["last_pilgrimage_of_esquibeth"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"waterfall_01"		: {
		"dev_tsid"	: "LM4110LPLH64A",
		"prod_tsid"	: "LIFQUHITQ583FKK"
	},
	"waterfall_02"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFR2OEUQ5832LQ"
	},
	"waterfall_03"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFR7REVQ583H6Q"
	},
	"waterfall_04_wider"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFVOTC3H593H7H"
	}
};

var requirements = {
	"r548"	: {
		"type"		: "flag",
		"name"		: "esquibeth_exit_revealed",
		"desc"		: "Go on the Journey"
	},
	"r549"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Return from the Journey"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("grendaline", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 500,
	"favor"	: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 100
		}
	}
};

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('last_pilgrimage_of_esquibeth');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 4*60*60) return false;
			
	// Also repeatable only once every game day
	if (this.ts_done && time() - this.ts_done < 4*60*60) return false;
	if (this.fail_time && time() - this.fail_time < 4*60*60) return false;
	
	return true;
}

function onAccepted(pc){
	pc.esquibeth_rem = true;
}

function onCompleted(pc){
	delete pc.esquibeth_rem;
}

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
	
	log.info(this+' onExitLocation: '+previous_location+', '+pc.location.instance_id);
	pc.instances_exit(previous_location); // Remove the previous location from their instances
	
	// Stop if we're still in the quest
	if (this.locations[pc.location.instance_id]) return;
	
	// Fail the quest if not complete
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		log.info(this+" not complete, failing with class id "+this.class_tsid);
		pc.failQuest(this.class_tsid);
	}
}

function onStarted(pc){
	var location_id = 'waterfall_01';
	var tsid;
	if (config.is_dev){
		tsid = this.locations[location_id].dev_tsid;
	}
	else{
		tsid = this.locations[location_id].prod_tsid;
	}
	
	var loc = apiFindObject(tsid);
	var marker = loc.find_items('marker_teleport')[0];
	
	if (marker) {
		this.questInstanceLocation(pc, location_id, marker.x, marker.y, 5*60);
	}
	else { 
		this.questInstanceLocation(pc, location_id, 0, 0, 5*60);
	}
	
	return { ok: 1 };
}

//log.info("last_pilgrimage_of_esquibeth_reminisce.js LOADED");

// generated ok (NO DATE)
