var title = "Firefly Whistle";
var desc = "Explore the lab and learn what you can about how to charm Fireflies.";
var offer = "In the future of one of our pasts, the last days of the Alphite Age, some radical technologists had developed advanced techniques for the charming of fireflies.<split butt_txt=\"Oh?\" \/>This knowledge would benefit you tremendously. I can offer to send you back to this past future, but you must find your own way back ...<split butt_txt=\"Ominous …\" \/>Well, it can't be THAT bad. And, you want to be enchanting those <b>Fireflies<\/b>, right?";
var completion = "Well, well. Swallowed it right down, eh? That's one way to ensure you always have the whistle with you.<split butt_txt=\"I Guess\" \/>In any case, from now on, any time you open a <a href=\"event:item|firefly_jar\">Firefly Jar<\/a> in the presence of Fireflies, your new whistling instinct will kick in. Enjoy!";


var auto_complete = 0;
var familiar_turnin = 1;
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
var end_npcs = [];
var locations = {};
var requirements = {
	"r241"	: {
		"type"		: "flag",
		"name"		: "firefly_whistle_obtained",
		"class_id"	: "firefly_whistle",
		"desc"		: "Get the Whistle"
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
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("firefly_jar", 1);
}
var rewards = {
	"items"	: {
		"0"	: {
			"class_tsid"	: "firefly_jar",
			"label"		: "Firefly Jar",
			"count"		: 1
		}
	}
};

function onStarted(pc){
	if (config.is_dev){
		var tsid = 'LHH11C4QUBP1DQD';
	}
	else{
		var tsid = 'LM113UBSS8P18ET';
	}
		
	pc.events_add({ callback: 'instances_create_delayed', tsid: tsid, instance_id: 'firefly_whistle', x: -2967, y:-283, exit_delay: 3*60, options: {no_auto_return: true}, location_options: {teleporter_button_activated: false, whistle_taken: false, whistle_enabled: false, forcefield_button_activated: false, teleporter_activated: false}}, 0.1);
	
	return { ok: 1 };
}

//log.info("firefly_whistle.js LOADED");

// generated ok (NO DATE)
