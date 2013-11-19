var title = "Ilmenskie Jones and the Sealed Cavern";
var desc = "Use your 'Teleport via Map' ability to investigate the disappearance of famed explorer Ilmenskie Jones, last seen in <a href=\"event:location|106#LHFIV4V8J6J2I7U\">Axis Denyde<\/a>.";
var offer = "Kid, I can only assume you’ve heard of <b>Ilmenskie Jones<\/b>.<split butt_txt=\"Who?\" \/>Seriously? Ilmenskie Jones and the Marauders of the Lost Bean? Ilmenskie Jones and the Sparkly Femur? Ringing any bells?<split butt_txt=\"Not a tinkle.\" \/>OK, wow. Well, he’s only the most famous adventurer in all of Ur. And he’s a senior lecturer in porkthropology at Porcine University. In short, he’s dreamy.<split butt_txt=\"Never heard of him.\" \/>Well he’s heard of you. He left a note in his office when he set off to explore the infamous Sealed Cavern of <a href=\"event:location|106#LHFIV4V8J6J2I7U\">Axis Denyde<\/a>. \"If you don’t hear from me within a week,\" it read, \"please notify whats-their-name. You know, the pedantic one\" He could only have meant you, sure as eggs is eggs.<split butt_txt=\"ARE eggs, surely?\" \/> See?!? Clearly you. So using your newly acquired powers of Teleportation IV, perhaps you could hop right on over to him and help him out? Problem is, it being a sealed cavern, the entrance is blocked off. So you'll need to locate <a href=\"event:location|106#LHFIV4V8J6J2I7U\">Axis Denyde<\/a> in <a href=\"event:location|106\">Pollokoo<\/a> on the map, and then teleport in that way. Would you mind checking in to see what’s taking him so long?";
var completion = "What a guy, huh, kid?<split butt_txt=\"He seemed kind of…\" \/>Amazing? I know. Man, if I could teleport using the map, like him or, well, like you? Imagine the jinks I could get up to… <split butt_txt=\"I can take you with me…\" \/>Sweet thought, kid. Let's do that: whenever the mood takes you - well, a few times a day for free, and more with tokens - just open the map, choose a street to teleport to, and click! We'll be off! Exploring! That's cheered me up. Let me do the same for you (as if meeting Ilmenskie Jones wasn’t already reward enough).";


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
var end_npcs = [];
var locations = {
	"axis_denyde"	: {
		"dev_tsid"	: "LMF186RER8J2SR8",
		"prod_tsid"	: "LHFIV4V8J6J2I7U"
	},
	"intate_treats"	: {
		"dev_tsid"	: "LM411BNOGTUG2",
		"prod_tsid"	: "LHFR6PV2Q2D24KJ"
	}
};

var requirements = {
	"r351"	: {
		"type"		: "flag",
		"name"		: "rescue_pig",
		"class_id"	: "npc_piggy_explorer",
		"desc"		: "Rescue Ilmenskie Jones from certain peril"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 450,
	"mood"	: 250,
	"favor"	: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 40
		}
	}
};

function callback_caveIn(pc, details){
	if (!this.explained_cavein && !this.owner.items_has('hogtied_piggy_explorer')) {
		this.explained_cavein = true;
		
		this.owner.familiar_send_alert_now({
			'txt': "Looks like you can't get in this way, kid. Those rocks aren't going anywhere.<split butt_txt=\"Hm…\" />You're going to need to find another way in.",
			'callback'	: 'familiar_ignore_callback'
		});
	}
}

function onEnterLocation(location){
	if (location == 'axis_denyde' && 
	    !this.owner.items_has('hogtied_piggy_explorer', 1) && 
	    !this.owner.get_location().countItemClass('npc_piggy_explorer') &&
	    !this.isDone()) {
		this.piggy = this.owner.get_location().createItemStack('npc_piggy_explorer', 1, 444, -670);
	}
}

//log.info("teleportation_rescue_pig.js LOADED");

// generated ok (NO DATE)
