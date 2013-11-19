var title = "Shriner's Convention";
var desc = "Get to know your neighborhood <b>Shrines<\/b>. Donate to the shrines of 5 different <b>Giants<\/b>.";
var offer = "The <b>Giants<\/b>, praise their neural clusters, don't ask for much. Nothing, in fact. But it never hurts to suck up to the boss a little, am I right? <split butt_txt=\"Not in my books.\" \/> Well, okay then. Keep those crazy eyes of yours peeled for <b>Shrines<\/b>, and donate to the shrines of 5 different <b>Giants<\/b>. <split butt_txt=\"I will!\" \/> And don't cheap out. The Giants know what lurks within your heart.";
var completion = "You did it! <split butt_txt=\"I did it! What did I do?\" \/> Remember? Your quest to donate to all of those Shrines? <split butt_txt=\"That's right. I did do it!\" \/>You're a little slow, kid, but I like you. And I'm not the only one. Here's something to put in your doodad collection.";


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
	"r185"	: {
		"type"		: "counter",
		"name"		: "donate_giants",
		"num"		: 5,
		"class_id"	: "npc_shrine_uralia_spriggan",
		"desc"		: "Donate to 5 Different Giants"
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
	xp = pc.stats_add_xp(round_to_5(225 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(75 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(20 * multiplier));
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
	"xp"		: 225,
	"currants"	: 150,
	"mood"		: 75,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 20
		}
	}
};

function onComplete_custom(pc){
	delete pc.giants_donated;
}

//log.info("betterlearning_donate_to_shrines.js LOADED");

// generated ok (NO DATE)
