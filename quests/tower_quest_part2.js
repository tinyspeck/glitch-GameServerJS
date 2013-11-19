var title = "Gwendolyn's Task II";
var desc = "Meet your mind";
var offer = "Coooooooooool ….";
var completion = "See? <b>Zzybzfrx<\/b> told you it be cool, and cool it is.\r\n<split butt_txt=\"Who Zzybzfrx?\" \/>\r\nI. <b>Zzybzfrx<\/b>. No one knows where I am really from, or who I am for certain. But know this: you have reached the apex of your brain. \r\n<split butt_txt=\"Guess so, yep.\" \/>\r\nYou’ve been to paradise. And you’ve also been to you. I told you it was cool, right?\r\n<split butt_txt=\"Pretty cool …\" \/>";

var button_accept = "Cool.";

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
var prereq_quests = ["tower_quest"];
var prerequisites = [];
var end_npcs = ["npc_squid"];
var locations = {};
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
}
var rewards = {};

function onAccepted(pc){
	pc.overlay_dismiss('its_cool');	
	pc.instances_cancel_exit_prompt('tower_quest_desert');
	pc.events_add({ callback: 'instances_create_delayed', tsid: 'LCR8MQ9JJI12IIK', instance_id: 'tower_quest_headspace', x: -911, y: -410, exit_delay: 2*60, options: {no_auto_return: true}}, 0.1);
}

//log.info("tower_quest_part2.js LOADED");

// generated ok (NO DATE)
