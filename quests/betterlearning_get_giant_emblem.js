var title = "Automagically Emblematical";
var desc = "Donate to your favorite Giant's <b>Shrine<\/b> until you get an <b>Emblem<\/b>. The first Emblem is awarded at 1000 favor points.";
var offer = "Emblem. It's a weird-looking word, don't you think? <split butt_txt=\"Now that you mention it...\" \/> The more you look at it, the less sense it makes. And it's even weirder when you say it out loud. <split butt_txt=\"Whoa. Yeah.\" \/> Be that as it may, you should get one. An <b>Emblem<\/b>, I mean. <split butt_txt=\"Oh. Okay. What?\" \/> Pick a <b>Shrine<\/b> and donate until you get 1000 favor points. Then you'll earn an Emblem. It'll be awesome. Trust me.";
var completion = "And that's how you earn an <b>Emblem<\/b>. <split butt_txt=\"It sure is.\" \/> Now that you have it, you can trade it in for all kinds of excellent learning-related bonuses. <split butt_txt=\"Like what?\" \/> If I told you everything, what would be the fun of that?";


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
	"r199"	: {
		"type"		: "counter",
		"name"		: "emblems_acquired",
		"num"		: 1,
		"desc"		: "Acquire an Emblem"
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
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(75 * multiplier));
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
	"mood"		: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 75
		}
	}
};

//log.info("betterlearning_get_giant_emblem.js LOADED");

// generated ok (NO DATE)
