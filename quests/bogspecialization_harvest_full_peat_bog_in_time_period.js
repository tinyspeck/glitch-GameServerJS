var title = "Peter out Peat";
var desc = "Grab your <a href=\"event:item|shovel\">Shovel<\/a> and wrangle some friends to help you harvest a full <b>Peat Bog<\/b> until it's empty. In less than 9 seconds.";
var offer = "Greetings, my round-headed friend. I have a job for you. Use your <a href=\"event:item|shovel\">Shovel<\/a> to harvest a full <b>Peat Bog<\/b> until it's empty. In 9 seconds. <split butt_txt=\"Eep.\" \/> Did I mention you can invite some friends to help you? Better now?";
var completion = "Congratulations. You and your confreres harvested this entire bog in less than 9 seconds. <split butt_txt=\"I say Boo. And also Ya.\" \/> Unfortunately, I've only got enough on me to reward just you. <split butt_txt=\"Oh.\" \/> Might I recommend a round of heartfelt high-fives?";


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
var locations = {};
var requirements = {
	"r239"	: {
		"type"		: "flag",
		"name"		: "peat_bog_fully_harvested",
		"class_id"	: "shovel",
		"desc"		: "Fully harvest a Peat Bog"
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
	xp = pc.stats_add_xp(round_to_5(375 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(325 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
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
	"xp"		: 375,
	"currants"	: 325,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 40
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('bogspecialization_harvest_full_peat_bog_in_time_period');
}

function onStarted(pc){
	// To start the quest (by pressing TRY NOW button in quest log), you have to be at least 100 pixels near a peat bog that is 100% full.
	function is_bog(stack){ return stack.is_peat_bog && stack.getInstanceProp('harvests_remaining') == 4; }
	var bog = pc.findCloseStack(is_bog, 100);
	if (!bog){
		return {
			ok: 0,
			error: 'You need to be near a full Peat Bog.'
		};
	}
	
	this.peat_bog = bog.tsid;
	bog.sendBubble('Empty me out! Go!', 5000);
	pc.buffs_apply('bogspecialization_harvest_full_peat_bog_in_time_period');
	return {
		ok: 1
	};
}

function testBog(){
	if (!this.peat_bog) return;
	
	var bog = apiFindObject(this.peat_bog);
	if (!bog.isUseable()){
		this.owner.quests_set_flag('peat_bog_fully_harvested');
	}
}

//log.info("bogspecialization_harvest_full_peat_bog_in_time_period.js LOADED");

// generated ok (NO DATE)
