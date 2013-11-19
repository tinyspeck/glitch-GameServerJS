var title = "De-Embiggenify";
var desc = "Get small and find a hairball to help out.";
var offer = "Hey, kid. I've got a job for you. But it's going to require some shrinkage. You up for it? <split butt_txt=\"Ummm...\" \/>Don't worry. You'll be re-embiggened later. <split butt_txt=\"In that case, I could maybe handle some shrinkage.\" \/>I knew you had it in you, kid. Go find <b>Mr. Hairball<\/b>. He'll fill you in on the small print.";
var completion = "You found me! You wouldn't believe how many times people mistake me for a common ball of hair. <split butt_txt=\"Not me. You have a lot of presence for a hairball.\" \/>Thanks, buddy.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_dustbunny"];
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

function onStarted(pc){
	if (config.is_dev){
		var tsid = 'LM4110LPLH64A';
	}
	else{
		var tsid = 'LIF10RQLPLBYV7';
	}
	
	pc.events_add({ callback: 'instances_create_delayed', tsid: tsid, instance_id: 'eesti', x: -1832, y: -76, exit_delay: 2*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("de_embiggenify.js LOADED");

// generated ok (NO DATE)
