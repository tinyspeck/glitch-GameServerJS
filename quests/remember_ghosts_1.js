var title = "Remember the Rememberable";
var desc = "Dust off your <a href=\"event:item|faded_heart\">Faded Heart<\/a> and track down the Phantom Glitch's new haunts.";
var offer = "oooooooo...\r\n<split butt_txt=\"Excuse me?\" \/>\r\nooOOOoOOOOOO!!!\r\n<split butt_txt=\"What the..?\" \/>\r\nOK, OK. It's me. Had you fooled, didn't I, kid?\r\n<split butt_txt=\"Fooled? It sounded like you were in pain.\" \/>\r\nThanks for your concern, but I'm trying to help you remember the rememberable. Do you recall that little ghost hunt a while back? You helped our phantom friend find fulfillment in his half-extant state.\r\n<split butt_txt=\"Little? That hunt took forever!\" \/>\r\nWell, if it weren't for you, our aimless apparition would still be shouting whispers at passersby. But your observance has helped his spirit expand. Think of it this way: you gave him the capacity to spread out his haunts, and as you remember him more, his spirit manifests itself more and more until...\r\n<split butt_txt=\"Until what?\" \/>\r\nNot sure. But that Faded Heart he gave you should help jog your memory.";
var completion = "Great job, kid. You found his new haunts.\r\n<split butt_txt=\"What is forgotten is never really lost.\" \/>\r\nWhoever told you that is a genius.\r\n<split butt_txt=\"So what's next?\" \/>\r\nI don't remember. But I do have something to make sure your ghastly good deed doesn't go unrewarded.";

var button_accept = "Where did I put that thing?";

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
var prereq_quests = ["phantom_glitch"];
var prerequisites = [{
		"not"		:0,
		"condition":	"has_achievement",
		"value":	"wanderer"
},{
		"not"		:0,
		"condition":	"over_level",
		"value":	40
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r469"	: {
		"type"		: "counter",
		"name"		: "faded_heart_remembered",
		"num"		: 13,
		"class_id"	: "faded_heart",
		"desc"		: "Find the Phantom Glitch's new haunts."
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
	xp = pc.stats_add_xp(round_to_5(2400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 2400,
	"mood"		: 200,
	"energy"	: 200
};

function canRememberAt(location){
	if (!this.remembered) this.remembered = {};
	if (this.remembered[location]) return false;
		
	this.remembered[location] = time();
	return true;
}

function onCreate(pc){
	this.remembered = {};
}

//log.info("remember_ghosts_1.js LOADED");

// generated ok (NO DATE)
