var title = "Umbrian Black and White ";
var desc = "Get monochromatic in  <a href=\"event:location|66#LDOSHD9J6NT2HUJ\">Umbra<\/a> by making one vial White Gas, one piece of Licorice, and one mounds Black Pepper.";
var offer = "Is it Black? Or is it White? Does it matter? Why not both?! Make one vial of White Gas, one piece of Licorice, and one mound Black Pepper.";
var completion = "Awesome! You are color blind! (In a good way!)";

var button_accept = "Phffff. Thanks. I guess.";

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
		"value":	"gasmogrification_1"
},{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"spicemilling_1"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r478"	: {
		"type"		: "make",
		"recipe_id"	: 121,
		"num"		: 1,
		"desc"		: "black_pepper_made"
	},
	"r479"	: {
		"type"		: "make",
		"recipe_id"	: 136,
		"num"		: 1,
		"desc"		: "white_gas_made"
	},
	"r480"	: {
		"type"		: "make",
		"recipe_id"	: 125,
		"num"		: 1,
		"desc"		: "licorice_made"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 200
};

//log.info("umbra_black_white.js LOADED");

// generated ok (NO DATE)
