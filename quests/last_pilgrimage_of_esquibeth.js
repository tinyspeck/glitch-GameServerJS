var title = "The Last Pilgrimage of Esquibeth";
var desc = "Contemplate the heroic actions of Esquibeth on her last pilgrimage.";
var offer = "Kid, you now know a little something about the Giants. You’ve matured. I think you are ready to contribute to a Feat.<split butt_txt=\"I think I am.\" \/>But first, you need to spend some time contemplating the Ancient Heroes. Otherwise your contribution to the re-creation of their sacred accomplishments will always … ring false. Are you ready?";
var completion = "";


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
var prereq_quests = ["donate_to_all_shrines"];
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
	"r519"	: {
		"type"		: "flag",
		"name"		: "got_conch",
		"class_id"	: "conch",
		"desc"		: "Find the Conch"
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
	this.onComplete_custom(pc);
}
var rewards = {};

function onAccepted(pc){
	delete pc.grendaline_shrines_passed;
}

function onComplete_custom(pc){
	pc.end_esquibeth = true;
}

function onEnterLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	log.info(this+' onEnterLocation: '+location+', '+pc.location.instance_id);
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

//log.info("last_pilgrimage_of_esquibeth.js LOADED");

// generated ok (NO DATE)
