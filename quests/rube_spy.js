var title = "The Wrizzards and The Rube";
var desc = "Help The Rube by finding and clicking all the Wrizzards hiding in his yard.";
var offer = "Hey {pc_label}! Wanna make a tra … I mean, do you wanna help me out? <split butt_txt=\"Mmmaybe?\" \/> One of my good friends, The Rube, traded a super rare gem for a jar of Wrizzards, and accidentally dropped it in his yard when he got home. <split butt_txt=\"Wrizzards?\" \/> That’s right, Wrizzards. And, now they've gotten into his stash and he can't seem to find any of them! Help a Rube out, will ya?";
var completion = "You got them all?! Thank ya, thank ya! <split butt_txt=\"Welcome!\" \/>Now there’s much more space in The Rube’s yard to put stuff! <split butt_txt=\"Good! I guess?!\" \/> Oh, yeah. More items means more trades, my friend!";


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
	"the_wrizzards_and_the_rube"	: {
		"dev_tsid"	: "LRO12G5T3593V3A",
		"prod_tsid"	: "LIFJM2QDA093KA6"
	}
};

var requirements = {
	"r514"	: {
		"type"		: "counter",
		"name"		: "wrizzards_found",
		"num"		: 10,
		"class_id"	: "npc_rube",
		"no_delay"	: 1,
		"desc"		: "Wrizzards Found"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 500,
	"currants"	: 500,
	"mood"		: 100
};

function onComplete_custom(pc){
	pc.instances_exit('the_wrizzards_and_the_rube');
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
		
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
	}
	
	pc.instances_exit('the_wrizzards_and_the_rube');
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'the_wrizzards_and_the_rube', 0, -132, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("rube_spy.js LOADED");

// generated ok (NO DATE)
