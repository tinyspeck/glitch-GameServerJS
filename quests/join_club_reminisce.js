var title = "Join the Club";
var desc = "Gain access to the \"exclusive\" clubhouse.";
var offer = "Are you ready to reminisce Join the Club?";
var completion = "Welcome back, {pc_label}. I hope you enjoyed yourself.";


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
var prereq_quests = ["join_club"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"clubhouse_part_1_reminisce"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFAFE5F0CC36KJ"
	},
	"clubhouse_part_2_reminisce"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFCTHBK0CC3ILM"
	}
};

var requirements = {
	"r551"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Access Clubhouse"
	},
	"r552"	: {
		"type"		: "flag",
		"name"		: "instance_exit_via_signpost",
		"desc"		: "Get the Picture"
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
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 25
		}
	}
};

function canOffer(pc){
	if (!pc.is_god) return false;
	
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('join_club');
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
	
	log.info(this+' onExitLocation: '+previous_location+', '+pc.location.instance_id);
	pc.instances_exit(previous_location); // Remove the previous location from their instances
	
	// Stop if we're still in the quest
	if (this.locations[pc.location.instance_id]) return;
	
	// Fail the quest if not complete
	if (!pc.quests_get_flag("join_club", "instance_exit_via_signpost")){
		log.info(this+" not complete, failing with class id "+this.class_tsid);
		pc.failQuest(this.class_tsid);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'clubhouse_part_1_reminisce', 0, 0, 5*60, {preserve_links: true}, {}, true);
		
	return {ok: 1};
}

//log.info("join_club_reminisce.js LOADED");

// generated ok (NO DATE)
