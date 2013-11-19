var title = "Tower Defense";
var desc = "Call down a rook attack on your Tower and defend it with a little help from your friends.";
var offer = "Nice Tower you've got going there. It'd be a shame if something were to... <i>happen<\/i> to it.<split butt_txt=\"Happen? Like what?\" \/>Oh, you know: war, pestilence, <b>Rook Attacks<\/b>... that sort of thing.<split butt_txt=\"Whatever, I think I can handle it\" \/>O RLY? Well then, if you're ready, I think I can arrange it. You're going to need some assistance though. Let me know when you're ready.";
var completion = "Well, you managed to handle that pathetic little Rook Attack. [slow clap].<split butt_txt=\"I detect sarcasm.\" \/>You're an incisive one, aren't you. Well, here's your rewards. Maybe next time it'll be harder.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_multiplayer = 1;
var is_repeatable = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
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
	xp = pc.stats_add_xp(round_to_5(1500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 1500
};

function onStarted(pc){
	if (pc.houses_is_at_home() && pc.location.home_id == 'tower'){
		pc.location.startSingleRookAttack(500, true);
		return {ok: 1};
	}
	
	return {
		ok: 0,
		error: "You can only start this quest in your own tower"
	};
}

//log.info("tower_defense.js LOADED");

// generated ok (NO DATE)
