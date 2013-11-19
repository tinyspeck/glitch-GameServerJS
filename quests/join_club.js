var title = "Join the Club";
var desc = "Gain access to the \"exclusive\" clubhouse.";
var offer = "Welcome home {pc_label}.  While you were away, you received an intriguing invitation. It appears you've been invited to join the club. <split butt_txt=\"Club? Which club?\" \/> I must admit, I'm not entirely sure. But, rumor has it that once inside the clubhouse, you gain access to a perfectly picturesque location. Interested?";
var completion = "It looks like you were accepted to the club! Myself, I don't want to belong to any club that will accept people like me as a member. But, as they say … \"Membership has its rewards!\"";


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
var end_npcs = ["bag_butler"];
var locations = {
	"clubhouse"		: {
		"dev_tsid"	: "LM4110LPLH64A",
		"prod_tsid"	: "LIFCSSIJNOA3PTE"
	},
	"clubhouse_part_2"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFD72UKNOA3679"
	}
};

var requirements = {
	"r531"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Access Clubhouse"
	},
	"r532"	: {
		"type"		: "flag",
		"name"		: "instance_exit_via_signpost",
		"desc"		: "Get the Picture"
	},
	"r535"	: {
		"type"		: "flag",
		"name"		: "talk_to_butler",
		"class_id"	: "bag_butler",
		"desc"		: "Tell your Butler about the club."
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
	currants = pc.stats_add_currants(round_to_5(750 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 750,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

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
	var location_id = 'clubhouse';
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
		this.questInstanceLocation(pc, location_id, marker.x, marker.y, 5*60,  {preserve_links: true});
	}
	else {
		this.questInstanceLocation(pc, location_id, 0, 0, 5*60,  {preserve_links: true});
	}
	
	this.is_started = true;
	
	return { ok: 1 };
}

//log.info("join_club.js LOADED");

// generated ok (NO DATE)
