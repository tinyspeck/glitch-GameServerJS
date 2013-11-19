var title = "An Old Fashioned B&E";
var desc = "Solve the maze using the ladders and buttons. Piece of Cheesecake! Okay, I lied about the cake …";
var offer = "Are you ready to reminisce An Old Fashioned B&E?";
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
var prereq_quests = ["btc_room_3"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"tile_puzzle"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LHF3NS7UR1C3C52"
	}
};

var requirements = {
	"r553"	: {
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
	xp = pc.stats_add_xp(round_to_5(350 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("ti", round_to_5(20 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 350,
	"currants"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 20
		}
	}
};

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('btc_room_3');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
					
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
				
	return true;
}

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

//log.info("btc_room_3_reminisce.js LOADED");

// generated ok (NO DATE)
