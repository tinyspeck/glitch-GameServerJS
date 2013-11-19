var title = "Color Unblocking";
var desc = "Unblock your way to the exit, collecting rewards along the way.";
var offer = "You look like a fashionable young glitch. \"On trend\", \"in-the-know\", so to speak. <split butt_txt=\"Yes, yes I am.\" \/> Indeed. But, have you heard of color blocking? It's all the rage. <split butt_txt=\"Oh?\" \/> Oh brother. Yes! But, I'm not actually here to talk to you about fashion. I'm here to tell you that you're about to learn about color blocking, or perhaps I should say \"color unblocking\". If you're as intrigued as you appear puzzled, then I'd say it's time to go!";
var completion = "I see you are well-versed in the art of color unblocking. Well done. Although, in my opinion, a little color suits you. Oh, and here's a little something for you to play with!";

var button_accept = "Let's Go!";

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
var end_npcs = ["npc_crab"];
var locations = {
	"color_unblocking"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFCUIL66CA3SU5"
	}
};

var requirements = {
	"r533"	: {
		"type"		: "flag",
		"name"		: "instance_exit_via_door",
		"desc"		: "Find the Exit"
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("play_cube", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 250,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 50
		}
	},
	"items"		: {
		"0"	: {
			"class_tsid"	: "play_cube",
			"label"		: "Play Cube",
			"count"		: 1
		}
	}
};

function onComplete_custom(pc){
	var cube = pc.findFirst("play_cube");
	
	cube.setSoulbound(pc);
	pc.has_play_cube = true;
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
			
	pc.instances_exit('color_unblocking');
}

function onStarted(pc){
	var location_id = 'color_unblocking';
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

//log.info("puzzle_level_color_blockage.js LOADED");

// generated ok (NO DATE)
