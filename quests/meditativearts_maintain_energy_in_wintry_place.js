var title = "Cold Comfort";
var desc = "Chillax to the max. Go to <b>Wintry Place<\/b> and use your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to replenish your energy for a full minute - without leaving. (Hint: The secret entrances to Wintry Place are in <a href=\"event:location|56#LLI23D3LDHD1FQA\">Northwest Passage<\/a> and in <a href=\"event:location|64#LCRHJHOFQNL1PHP\">Newcot Close<\/a>.)";
var offer = "You ready to test your spiritual chilly mettle, kid? <split butt_txt=\"My what now? I'm not sure.\" \/> This will be a test of your ability to focus your meditation under mind-numbing duress. <split butt_txt=\"I am less and less convinced.\" \/> Locate the secret entrance to <b>Wintry Place<\/b>. Then use your <a href=\"event:item|focusing_orb\">Focusing Orb<\/a> to replenish your energy for a whole minute. <split butt_txt=\"Easy!\" \/> A full minute… without leaving that frozen wasteland. Leave part way through, and you'll have to start from scratch. <split butt_txt=\"That's inhuman! Unglichen?!?\" \/> Well, it's easier to regain energy with <a href=\"event:skill|focused_meditation_1\">Focused Meditation<\/a>, but if you haven't got that, just meditate the normal way. And don't worry. It'll be a blast. <split butt_txt=\"Yeah?\" \/> No. But you should do it anyway.";
var completion = "You did it! A whole minute of intensive meditation! <split butt_txt=\"So... very... c-c-c-cold.\" \/> Get your chilblains out of here, kid. But before you go, here's the customary little something. Put it toward your frostbite treatment.";


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
var prereq_quests = ["phantom_glitch"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r219"	: {
		"type"		: "counter",
		"name"		: "wintry_place_meditation",
		"num"		: 60,
		"class_id"	: "focusing_orb",
		"desc"		: "Replenish 60 energy by meditating in Wintry Place"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	favor = pc.stats_add_favor_points("cosma", round_to_5(45 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 450,
	"currants"	: 300,
	"favor"		: {
		"0"	: {
			"giant"		: "cosma",
			"points"	: 45
		}
	}
};

//log.info("meditativearts_maintain_energy_in_wintry_place.js LOADED");

// generated ok (NO DATE)
