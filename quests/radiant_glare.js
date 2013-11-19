var title = "Radiant Glare";
var desc = "Hone your skills as you travel toward the radiant glare above.";
var offer = "Young Glitch, you once walked toward the light, proving your eyes are sharp. But, without practice, your skills may become dull.<split butt_txt=\"Makes sense.\" \/> Hone your skills as you move up toward the radiant glare. And, remember, \"Do or do not … there is no try.\"";
var completion = "A wise Glitch once said, \"True mastery of a skill was only the beginning step to understanding it.\"<split butt_txt=\"Mmmkay.\" \/> You are one step closer to mastery.  Understand? Either way, you deserve this reward.";

var button_accept = "Do";
var button_decline = "Do not";

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
var prereq_quests = ["puzzle_level_light_perspective"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"radiant_glare"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFFFRAHB4A3JHJ"
	}
};

var requirements = {
	"r524"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "You made it!"
	},
	"r528"	: {
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
	favor = pc.stats_add_favor_points("alph", round_to_5(150 * multiplier));
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
			"giant"		: "alph",
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
		
	pc.instances_exit('radiant_glare');
}

function onStarted(pc){
	var location_id = 'radiant_glare';
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

//log.info("radiant_glare.js LOADED");

// generated ok (NO DATE)
