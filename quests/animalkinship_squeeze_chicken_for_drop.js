var title = "Chicken Music Block Combo";
var desc = "Squeeze <a href=\"event:item|npc_chicken\">Chicken<\/a> after Chicken until one of them pops out a <b>Music Block<\/b>. It sounds unlikely, to be sure, but it will happen.";
var offer = "Psst. Hey, kid. You like music? <split butt_txt=\"I sure do.\" \/>You like chickens? <split butt_txt=\"Um... yes?\" \/> Don't panic. Nothing weird. Just get out there and squeeze a few <a href=\"event:item|npc_chicken\">Chickens<\/a> until one of them pops out a <b>Music Block<\/b>. <split butt_txt=\"My kind of party.\" \/>You go, kid.";
var completion = "Hey! I see from your brand-new music block that there's a happy chicken out there somewhere.<split butt_txt=\"You see rightly.\" \/> A well-squeezed chicken is its own reward, but here's a little something-something for you anyway.";


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
	"r120"	: {
		"type"		: "counter",
		"name"		: "chicken_music_block",
		"num"		: 1,
		"class_id"	: "npc_chicken",
		"desc"		: "Get a Musical Block"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(75 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 750,
	"currants"	: 500,
	"mood"		: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 75
		}
	}
};

//log.info("animalkinship_squeeze_chicken_for_drop.js LOADED");

// generated ok (NO DATE)
