var title = "Sharing the Oneness";
var desc = "Use your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to <b>Radiate Transcendence<\/b> at 5 lucky passersby at the same time. They'll thank you later.";
var offer = "You're down with the meditation, aren't you, kid? <split butt_txt=\"I am one with the oneness.\" \/>Good, good. Now you're ready to bring other people into the oneness. <split butt_txt=\"My oneness?\" \/>Don't be greedy. It's a big oneness. Use your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to radiate your inwardness in an outward direction to 5 different players. <split butt_txt=\"No prob.\" \/> Did I mention that all 5 players have to receive your radiation at the exact same time? <split butt_txt=\"Piece of cake.\" \/> That's the spirit. Moist, chewy transcendental cake.";
var completion = "Nice work, bub. You radiated the bejeebus out of those folks. <split butt_txt=\"Their chakras will never be the same.\" \/> And what did I tell you? Was that a big oneness, or what? <split butt_txt=\"Roomy, but still cozy.\" \/>Like a woolly sweater for your soul. Om, chum.";


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
	"r175"	: {
		"type"		: "flag",
		"name"		: "transcendence_5players",
		"class_id"	: "focusing_orb",
		"desc"		: "Transcend 5 players"
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
	xp = pc.stats_add_xp(round_to_5(550 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(350 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("cosma", round_to_5(55 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 550,
	"currants"	: 350,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 55
		}
	}
};

//log.info("transcendentalradiation_radiate_to_five_people.js LOADED");

// generated ok (NO DATE)
