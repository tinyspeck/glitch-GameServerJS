var title = "Mental Block";
var desc = "Create a path to the exit by dropping blocks along the way.";
var offer = "Everything ok? You seem somewhat puzzled. <split butt_txt=\"Do I?\" \/>  Puzzled, confused, perhaps a little stuck?<split butt_txt=\"I feel fine.\" \/>  Well, it's possible I'm seeing into your future. Ah, yes. That's it. My intuition tells me you'll soon be feeling a mental block of sorts. Are you ready?";
var completion = "Well, was I right? Were you confused, puzzled … confuzzled? Doesn't matter. Whatever you felt, it looks like you're over it now. Great job!";


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
var prereq_quests = ["radiant_glare"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"mental_block"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF3NLRNBBA3HD2"
	}
};

var requirements = {
	"r527"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r530"	: {
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
	currants = pc.stats_add_currants(round_to_5(1500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(150 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 1500,
	"mood"		: 200,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 150
		}
	}
};

function canOffer(pc){
	if (!pc.imagination_has_upgrade('walk_speed_3')) return false;
	if (!pc.imagination_has_upgrade('jump_2')) return false;
	
	return true;
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
		
	pc.instances_exit('mental_block');
}

function onStarted(pc){
	var location_id = 'mental_block';
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

//log.info("mental_block.js LOADED");

// generated ok (NO DATE)
