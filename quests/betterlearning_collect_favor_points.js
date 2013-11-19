var title = "Favor Curry";
var desc = "Visit your favorite <b>Shrine<\/b> and give until it hurts. Or until you get 100 favor points. Whichever comes first. (Weaselly small print: Shrines where you've already earned 100 favor points don't count.)";
var offer = "You know, friend, in this crazy hardscrabble old world, we need all the help we can get. <split butt_txt=\"And sometimes even more than that.\" \/> True, true. Which is why I'm proposing that you get out there and work on currying extra favor with the <b>Giants<\/b>. <split butt_txt=\"How?\" \/> The best way to do it is to pick your favorite <b>Shrine<\/b>, then donate to it. The better your donation, the more favor points you get. <split butt_txt=\"That seems reasonable.\" \/> And when you earn 100 points at the Shrine of your choice, there'll be a little bonus for you. Sound good?";
var completion = "Well done. You gave and you gave, and it looked like it didn't even hurt. <split butt_txt=\"It hurt a little.\" \/> I've got a little something special for you that should take that pain away. <split butt_txt=\"Thanks!\" \/> Now what are you going to do with all those favor points? <split butt_txt=\"Do?\" \/> Oh, yeah. Didn't you know? You can spend your points to speed up how quickly you learn different skills. Accelerated edumacation. Go get some.";


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
	"r184"	: {
		"type"		: "counter",
		"name"		: "favor_points",
		"num"		: 100,
		"class_id"	: "npc_shrine_uralia_alph",
		"desc"		: "Get 100 favor points"
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
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(45 * multiplier));
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
	"mood"		: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 45
		}
	}
};

//log.info("betterlearning_collect_favor_points.js LOADED");

// generated ok (NO DATE)
