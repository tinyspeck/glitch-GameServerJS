var title = "Gwendolyn's Task";
var desc = "Learn of Gwendolyn's fate";
var offer = "Hear me. I am <b>Gwendolyn<\/b>, disciple of <b>Cosma<\/b>, daughter of <b>Egeria<\/b>, drowned as I lived in the waters of <b>Grendaline’s Rising<\/b>. \r\n<split butt_txt=\"Whoa.\" \/>\r\nI have watched the giants battle and build, the worlds consume each other, imaginations turned inside out, and generations disappear beneath the layers.\r\n<split butt_txt=\"Holy.\" \/>\r\nSo long we searched for <b>Cosma<\/b> – lying in the gutter, gazing at the stars, watching the wind, waiting for her instruction …\r\n<split butt_txt=\"…\" \/>\r\n… so long we lay, so long we gazed, we never noticed the coming of the age of <b>Grendaline<\/b>, lapping at our heels, washing over our faces.\r\n<split butt_txt=\"Cripes!\" \/>\r\nLearn from our mistakes, I beg you. You must not lose yourself to the world, but find yourself within it. You must learn a measure of mastery over your own mind.\r\n<split butt_txt=\"I will try.\" \/>\r\nIf you are ready, I will send you on a journey where you can learn to avoid the fate of my people. Are you ready?";
var completion = "";

var button_accept = "Kind of.";

var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
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
	this.onComplete_custom(pc);
}
var rewards = {};

function onAccepted(pc){
	pc.instances_cancel_exit_prompt('tower_quest');
	pc.events_add({ callback: 'instances_create_delayed', tsid: 'LCR8MP0IJI1299U', instance_id: 'tower_quest_desert', x: -2077, y: -105, exit_delay: 2*60, options: {no_auto_return: true}}, 0.1);
		
	return { ok: 1 };
}

function onComplete_custom(pc){
	pc.buffs_remove('its_so_hot2');
}

//log.info("tower_quest.js LOADED");

// generated ok (NO DATE)
