var title = "The Spice Must Flow";
var desc = "Get yourself to West\/East Spice to harvest 19 Allspice for the Street Spirits.";
var offer = "Hey, {pc_label}, wanna know how I float up in the air like this?<split butt_txt=\"Yeah, sure\" \/>Allspice... Makes us sooooo higgghhhhh.<split butt_txt=\"OK\" \/>True story. Anyway, can you get me some? I'm feeling kinda low.<split butt_txt=\"I don't see why not\" \/>Great, thanks. The only spice for me comes from East\/West Spice in Ix. I need 19 of them, and don't forget to get some for yourself!";
var completion = "Yesssssss. That's the stuff, thanks! I hope you didn't forget to pick up some for yourself. Here's something you might be able to use it with.";


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
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["street_spirit_groddle"];
var locations = {};
var requirements = {
	"r385"	: {
		"type"		: "flag",
		"name"		: "go_to_eastwest_spice",
		"class_id"	: "trant_spice",
		"desc"		: "Go to East\/West Spice"
	},
	"r386"	: {
		"type"		: "item",
		"class_id"	: "all_spice",
		"num"		: 19,
		"remove"	: 1,
		"desc"		: "Harvest 19 Allspice"
	},
	"r387"	: {
		"type"		: "flag",
		"name"		: "return_to_spirit",
		"class_id"	: "street_spirit_groddle",
		"desc"		: "Return to the Street Spirit"
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
	xp = pc.stats_add_xp(round_to_5(100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(1000 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(150 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("spice_mill", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 100,
	"currants"	: 1000,
	"mood"		: 150,
	"items"		: {
		"0"	: {
			"class_tsid"	: "spice_mill",
			"label"		: "Spice Mill",
			"count"		: 1
		}
	}
};

//log.info("spice_must_flow.js LOADED");

// generated ok (NO DATE)
