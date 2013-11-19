var title = "Tickle Me Emo  ";
var desc = "Break free from your angsty funk and embrace 33 different players in one game day – you just might feel better!";
var offer = "Hey emo kid! Looks like too much black has got your mood to zero!  <split butt_txt=\"What on Ur are you on about?\" \/> You’re dark! Dark in the heart!  Go hug 33 different players to assuage that inner torment.  But hurry, you only have ‘til breaking dawn!";
var completion = "Didn’t I tell you you’d chirk right up? You know what they say about hugs per day!";


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
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	15
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r411"	: {
		"type"		: "counter",
		"name"		: "players_hugged",
		"num"		: 33,
		"class_id"	: "emotional_bear",
		"desc"		: "Hug 33 Different Players"
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
	xp = pc.stats_add_xp(round_to_5(750 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(1000 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(400 * multiplier));
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
	"xp"		: 750,
	"mood"		: 1000,
	"energy"	: 400
};

function canHug(pc){
	if (!this.hugged) this.hugged = {};
	if (this.hugged[pc.tsid]) return false;
		
	this.hugged[pc.tsid] = time();
	return true;
}

function onComplete_custom(pc){
	pc.buffs_remove('tickle_me_emo');
}

function onStarted(pc){
	this.hugged = {};
	
	pc.buffs_apply('tickle_me_emo');
	
	return {ok: 1};
}

//log.info("zero_mood.js LOADED");

// generated ok (NO DATE)
