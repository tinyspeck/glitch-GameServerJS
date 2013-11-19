var title = "A L'il Animal Kinship";
var desc = "Learn how to please, and then harvest from the animals of Ur.";
var offer = "Now that’s what we like to see around here: someone who appreciates the winged of this world. <split butt_txt=\"You don’t say?\" \/> We’ll get into the details later, but there’s a little <a href=\"event:item|butterfly_lotion\">Butterfly Lotion<\/a> in it for ya. You in the mood for some animal lovin’?";
var completion = "Petting? Nibbling? You’re well on your way now, kid. Congrats!";


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
		"condition":	"has_skill",
		"value":	"animalkinship_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r367"	: {
		"type"		: "flag",
		"name"		: "finish_animalkinship",
		"class_id"	: "npc_butterfly",
		"desc"		: "Do it all!"
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
	xp = pc.stats_add_xp(round_to_5(125 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(30 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
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
	"xp"		: 125,
	"currants"	: 50,
	"energy"	: 30,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 10
		}
	}
};

function onComplete_custom(pc){
	pc.quests_offer('animalkinship_pet_piggies');
}

function onStarted(pc){
	pc.teleportToLocationDelayed(config.newxp_locations['animalkinship_1'], 123, -958);
	return {ok: 1};
}

//log.info("animalkinship_1.js LOADED");

// generated ok (NO DATE)
