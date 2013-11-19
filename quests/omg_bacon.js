var title = "OMG, Bacon!";
var desc = "Take a picture that contains 3 <a href=\"event:item|npc_piggy\">Piggies<\/a> in 3 delicious forms.";
var offer = "Are you into meat? <split butt_txt=\"Not sure how to take that.\" \/>Take it any way you like. But in the meantime, how about you expand your horizons by snapping a <a href=\"event:item|npc_piggy\">Piggy<\/a>, a <a href=\"event:item|hogtied_piggy\">Hog-Tied Piggy<\/a> and a <a href=\"event:item|piglet\">Piglet<\/a> all in the same photo?<split butt_txt=\"Is this legal?\" \/>Yeah kid - it's all about context.";
var completion = "This may be one of the meatiest pictures you've taken, kid. <split butt_txt=\"One can dream.\" \/>But … where's the bacon? Next time, I guess. Psst - don't spend this all in one place.";


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
var prereq_quests = ["animal_qrazy"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("friendly", round_to_5(200 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 500,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 200
		}
	}
};

//log.info("omg_bacon.js LOADED");

// generated ok (NO DATE)
