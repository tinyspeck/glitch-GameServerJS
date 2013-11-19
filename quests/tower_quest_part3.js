var title = "Gwendolyn's Task III";
var desc = "Complete your journey";
var offer = "Damn right. Never say Zzybzfrx doesn’t take you where the cool kids go. One more challenge lies before you. Complete it, and I will have no problem awarding you a Measure of Self-Mastery. You can do it?\r\n<split butt_txt=\"I can do it.\" \/>\r\nThen let’s do it.";
var completion = "This is not the end. You have completed today’s challenge, and must be on your way, but your self-knowledge is only begun. You may not see <b>Zzybzfrx<\/b>, that friendly <b>Figment<\/b>, but he will be there.\r\n<split butt_txt=\"I see.\" \/>\r\nI too am always here, somewhere. Remember me, and heed my warning – do not follow the ways of those who have gone before. You will make your own path. \r\n<split butt_txt=\"I always try to.\" \/>\r\nAs for me, I will return one day, to tell you of my beautiful, lost-so-long, <b>Butterfly-Bone Hair Clip<\/b>. For now, take my warnings, and my blessing. And this: a token of our esteem. \r\n<split butt_txt=\"Thank you, Gwendolyn.\" \/>";

var button_accept = "OK!";

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
var prereq_quests = ["tower_quest_part2"];
var prerequisites = [];
var end_npcs = ["npc_gwendolyn"];
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
	xp = pc.stats_add_xp(round_to_5(1100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("cosma", round_to_5(11 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("random_kindness", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 1100,
	"mood"	: 100,
	"favor"	: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 11
		}
	},
	"items"	: {
		"0"	: {
			"class_tsid"	: "random_kindness",
			"label"		: "Random Kindness",
			"count"		: 1
		}
	}
};

function onAccepted(pc){
	pc.instances_cancel_exit_prompt('tower_quest_headspace');
	pc.events_add({ callback: 'instances_create_delayed', tsid: 'LCR8MRAKJI12UOP', instance_id: 'tower_quest_crystine', x:-1924, y: -143, exit_delay: 2*60, options: {no_auto_return: true}}, 0.1);
		
	return { ok: 1 };
}

//log.info("tower_quest_part3.js LOADED");

// generated ok (NO DATE)
