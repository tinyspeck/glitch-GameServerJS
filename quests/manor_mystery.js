var title = "Manor Mystery";
var desc = "Something is not quite right at the Manor on <a href=\"event:location|75#LHV36AG0LO2208L\">Hauki Seeks<\/a>.";
var offer = "Have you heard of Hauki Seeks Manor? That place has always been kind of creepy, but lately it seems some really strange things have been occurring. I won't blame you if you don't want to check it out, but that person you're trying to impress might think you're pretty brave if you do.";
var completion = "Hey! you found my note! I lost it somewhere in this Manor and have been scaring people from coming in here in case someone picked it up before I could.";

var button_accept = "I'm brave!";

var auto_complete = 0;
var familiar_turnin = 0;
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
var end_npcs = ["npc_juju_black"];
var locations = {};
var requirements = {
	"r468"	: {
		"type"		: "flag",
		"name"		: "quest_manor_mystery_done",
		"class_id"	: "note",
		"desc"		: "Brave the Manor"
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
	xp = pc.stats_add_xp(round_to_5(10 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"	: 10
};

function doProvided(pc){ // generated from provided
	pc.createItemFromFamiliar('note_manor_mystery', 1);
}

function onAccepted(pc){
	pc.mmquest_flag1=true;
	pc.mmquest_flag2=false;
	pc.mmquest_flag3=false;
	pc.mmquest_flag4=false;
	pc.mmquest_flag5=false;
	pc.mmquest_flag6=false;
	pc.mmquest_flag7=false;
}

function onComplete_custom(pc){
	delete pc.mmquest_flag1;
	delete pc.mmquest_flag2;
	delete pc.mmquest_flag3;
	delete pc.mmquest_flag4;
	delete pc.mmquest_flag5;
	delete pc.mmquest_flag6;
	delete pc.mmquest_flag7;
	delete pc.quest_manor_mystery_done;
}

//log.info("manor_mystery.js LOADED");

// generated ok (NO DATE)
