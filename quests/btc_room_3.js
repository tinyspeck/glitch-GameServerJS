var title = "An Old Fashioned B&E";
var desc = "Solve the maze using the ladders and buttons. Piece of Cheesecake! Okay, I lied about the cake …";
var offer = "Psst … I figured out how to get in. <split butt_txt=\"In where?\" \/> To the place! Do you want to sneak in, or not?!";
var completion = "Huh. I totally thought that place was a toy factory before. <split butt_txt=\"Why are you still whispering?\" \/> Oh right, thanks! You know, people say I spit when I whisper. But really, I just whisper when I spit.";

var button_accept = "Yeah, I'm a ninja!";
var button_decline = "I am not a ninja.";

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
var prerequisites = [];
var end_npcs = [];
var locations = {
	"tile_puzzle"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHF3NS7UR1C3C52"
	}
};

var requirements = {
	"r547"	: {
		"type"		: "flag",
		"name"		: "instance_exit_via_door",
		"desc"		: "Reach the Exit"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 500,
	"currants"	: 500,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 50
		}
	}
};

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
				
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
		
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'tile_puzzle', 0, 0, 5*60, {preserve_links: true}, {}, true);
	
	return {ok: 1};
}

//log.info("btc_room_3.js LOADED");

// generated ok (NO DATE)
