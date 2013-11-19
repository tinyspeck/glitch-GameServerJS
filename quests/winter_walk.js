var title = "Winter Walk";
var desc = "";
var offer = "Feel that cool breeze? It's reminiscent of something … <split butt_txt=\"What?\" \/> A cold, snow-covered place — crisp air and the quiet peace of each year's night. <split butt_txt=\"Tell me more!\" \/> I believe there's something special about the icicles … but perhaps you would like to see it for yourself?";
var completion = "Brrr! Did you really have to bring the chill back with you? Oh, I think you dropped this on your way back.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var hide_questlog = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["blue_and_white_part1"];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	7
}];
var end_npcs = ["street_spirit","street_spirit_firebog","street_spirit_zutto","street_spirit_groddle","street_spirit_ix"];
var locations = {
	"level_quest_winter_walk"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFH2AKJ5I735SV"
	},
	"level_quest_winter_haven"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFNNTRK1073PQ6"
	}
};

var requirements = {
	"r512"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Toggle flag leave"
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
	pc.createItemFromFamiliar("ice", 23);
}
var rewards = {
	"items"	: {
		"0"	: {
			"class_tsid"	: "ice",
			"label"		: "Ice",
			"count"		: 23
		}
	}
};

function callback_winter_walk_part1_finish(details){
	var pc = details.pc;
	if (!pc) pc = this.owner;
		
	if (!pc) return;
		
	this.set_flag(pc, 'leave');
		
	pc.instances_exit(pc.location.instance_id);
}

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('blue_and_white_part1');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
	
	return true;
}

function onEnterLocation(location){
	if (location == 'level_quest_winter_haven'){
		var pc = this.owner;
		if (!pc) return;
		
		//pc.instances_exit('level_quest_winter_walk');
		return;
	}
}

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
		
	if (pc.location.instance_id == 'level_quest_winter_walk' || pc.location.instance_id == 'level_quest_winter_haven') return;
		
	if (!this.is_complete){
		pc.quests_fail_and_remove(this.class_tsid);
	
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'level_quest_winter_walk', -2875, -81, 5*60);
		
	return {ok: 1};
}

//log.info("winter_walk.js LOADED");

// generated ok (NO DATE)
