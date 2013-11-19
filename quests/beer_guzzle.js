var title = "The Great Guzzler Challenge ";
var desc = "Drink a dozen <a href=\"event:item|beer\">Beers<\/a>. Shotgunning is optional.";
var offer = "Hey, kid. I know this is going to sound like a weird request, but it's really important that you find and drink 12 <a href=\"event:item|beer\">Beers<\/a>. Or is it 12 Beer? <split butt_txt=\"Hmm. I think it's always beer. Like moose.\" \/>You don't say? Well. Anyway. Are you up for it? <split butt_txt=\"I think so.\" \/>Then hop to it! <split butt_txt=\"Ummm.\" \/>What? Hop... hops... beer. Get it? <split butt_txt=\"Yeah. I get it. It's pretty bad.\" \/>Give me a break, kid. I'm a rock. Are you going to do this thing or what?";
var completion = "Well done, kid. You chugged that like a pro. Here's a little something to make it worth your while. <split butt_txt=\"Thanks. *hiccup*\" \/>Maybe you should go lie down or something. You don't look so good.";


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
	"r82"	: {
		"type"		: "counter",
		"name"		: "beers_drank",
		"num"		: 12,
		"class_id"	: "beer",
		"desc"		: "Drink Beers"
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(600 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 400,
	"currants"	: 600,
	"mood"		: 100
};

//log.info("beer_guzzle.js LOADED");

// generated ok (NO DATE)
