var title = "Epicly Perilous Potian Trial of Perilousness";
var desc = "Using a <a href=\"event:item|cauldron\">Cauldron<\/a>, make seven <b>different potions<\/b> in a single game day.";
var offer = "Hm, what have we here? Intermediate Potion-Maker, is it? In days of yore… <split butt_txt=\"Yaaaawn\" \/> Nono, not yawn, kid, YORE. In days of yore, no potion-maker was taken seriously until they undertook the Epic Perilous Potian Trial of Perilousness. <split butt_txt=\"Oooh, that sounds exciting!\" \/> Oh it is. Are you prepared for the Epicly Perilous Potian Trial of Perilousness? Have you girded your loins for epic peril? <split butt_txt=\"Consider me girded.\" \/> Right. Go forth then… and create seven unique potions. <split butt_txt=\"Is that it?\" \/>…In one day. <split butt_txt=\"Well, I'll TRY…\" \/>";
var completion = "You survived!  <split butt_txt=\"Well, yes, it was…\" \/> Tough? I know. Perilous? Yes, it's legendary for that. Epic? You wouldn't be the first to say it. <split butt_txt=\"…Pretty easy?\" \/> Wow. You've come a long way, Potion Maker. I only hope you're not above accepting a little benediction for your quest? I thought not. Here you go…";


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
	"r311"	: {
		"type"		: "counter",
		"name"		: "different_potions_made",
		"num"		: 7,
		"class_id"	: "potion_chris",
		"desc"		: "Make 7 different potions in one game day"
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
	xp = pc.stats_add_xp(round_to_5(1600 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(400 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(160 * multiplier));
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
	"xp"		: 1600,
	"mood"		: 200,
	"energy"	: 400,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 160
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('make_different_potions');
}

function onStarted(pc){
	pc.buffs_apply('make_different_potions');
	
	return {ok:1};
}

//log.info("potionmaking_make_different_potions_in_a_time_period.js LOADED");

// generated ok (NO DATE)
