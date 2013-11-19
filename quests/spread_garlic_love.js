var title = "Spread the Garlic Love ";
var desc = "Kiss 5 different players while under the effects of eating <a href=\"event:item|garlic\">Garlic<\/a>. In order to kiss people, you'll need to buy some <a href=\"event:item|lips\">Lips<\/a> from any <b>Street Spirit<\/b> who sells <b>Hardware<\/b>. You'll also need an <a href=\"event:item|emotional_bear\">Emotional Bear<\/a>, but you should already have one of those. <b>Garlic<\/b> can be bought from any <b>Street Spirit<\/b> who sells <b>Groceries<\/b> or <b>Produce<\/b>.";
var offer = "You want to know a funny thing about garlic, kid?<split butt_txt=\"That's kinda out of left field, but sure.\" \/> Everyone always says they hate garlic breath, but secretly they love it.<split butt_txt=\"You're sure about that?\" \/> Absotively. You know what you should do? Go eat some <a href=\"event:item|garlic\">Garlic<\/a> and kiss 5 other players. Test my theory.<split butt_txt=\"Hm.\" \/> Come on. I'm right about this. I feel it in my sediment. And even if I'm wrong, it's still funny, right?<split butt_txt=\"True!\" \/> So go for it. I'll be waiting here and thinking up a nice little reward for you.";
var completion = "Was I right? Did they love those garlicky kisses? <split butt_txt=\"Well...\" \/> Feh. Who cares! Nice working with you, kid.";


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
	"r80"	: {
		"type"		: "counter",
		"name"		: "players_garlic_kissed",
		"num"		: 5,
		"class_id"	: "lips",
		"desc"		: "Players Kissed"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(60 * multiplier));
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
	"xp"		: 300,
	"currants"	: 300,
	"mood"		: 60
};

function onComplete_custom(pc){
	pc.counters_reset_group('players_garlic_kissed');
}

//log.info("spread_garlic_love.js LOADED");

// generated ok (NO DATE)
