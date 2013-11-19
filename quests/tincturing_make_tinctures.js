var title = "Tincture Tailor";
var desc = "Use a <a href=\"event:item|tincturing_kit\">Tincturing Kit<\/a> and your <a href=\"event:skill|tincturing_1\">Tincturing<\/a> skill to create all seven <b>Tinctures<\/b> in an act of Top Tincturous Tincturery. And ponder the word 'tincture', while you're at it. Tincture. Tincture. Tincture.";
var offer = "Ah, a student of the <a href=\"event:skill|tincturing_1\">Tincturing<\/a> arts, are you? <split butt_txt=\"A graduate, actually…\" \/> Fancy! Well, mastering tincture theory is one thing, putting it into practice is quite another. <split butt_txt=\"It is?…\" \/> Sure it is, kid. You'll need a <a href=\"event:item|tincturing_kit\">Tincturing Kit<\/a>, for one thing. A Tincturing Kit, the ability to function with scorched nasal hairs, a super-glitchean gag reflex and… <split butt_txt=\"Wait, what?!?\" \/> Never mind. Let's start with the Tincturing Kit. Get one, have a go at creating the seven essential essences, and then we'll talk again. <split butt_txt=\"I'm on it.\" \/>";
var completion = "Nice work! How are those nasal hairs? <split butt_txt=\"Fine. I think?\" \/> If you can't hear'em screaming, you've mastered that Tincturing Kit faster than I ever thought possible.<split butt_txt=\"Well, I don't like to brag. But yes. I'm awesome.\" \/> You are. And you should try those tinctures. But meanwhile, for your dedication to the art of the tinct, here's a little bump…";


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
	"r303"	: {
		"type"		: "make",
		"recipe_id"	: 228,
		"num"		: 1,
		"desc"		: "Make an Essence of Gandlevery"
	},
	"r304"	: {
		"type"		: "make",
		"recipe_id"	: 229,
		"num"		: 1,
		"desc"		: "Make an Essence of Hairball"
	},
	"r305"	: {
		"type"		: "make",
		"recipe_id"	: 230,
		"num"		: 1,
		"desc"		: "Make an Essence of Purple"
	},
	"r306"	: {
		"type"		: "make",
		"recipe_id"	: 231,
		"num"		: 1,
		"desc"		: "Make an Essence of Rookswort"
	},
	"r307"	: {
		"type"		: "make",
		"recipe_id"	: 232,
		"num"		: 1,
		"desc"		: "Make an Essence of Rubeweed"
	},
	"r308"	: {
		"type"		: "make",
		"recipe_id"	: 233,
		"num"		: 1,
		"desc"		: "Make an Essence of Silvertongue"
	},
	"r309"	: {
		"type"		: "make",
		"recipe_id"	: 234,
		"num"		: 1,
		"desc"		: "Make an Essence of Yellow Crumb"
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
	xp = pc.stats_add_xp(round_to_5(800 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(525 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(80 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 800,
	"currants"	: 525,
	"mood"		: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 80
		}
	}
};

//log.info("tincturing_make_tinctures.js LOADED");

// generated ok (NO DATE)
