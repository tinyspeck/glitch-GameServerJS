var title = "Under the Wire";
var desc = "Identify the <b>Primary Giant<\/b> of a skill you want to learn, and donate until you have at least <b>997 favor<\/b> points at that Giant's Shrine (but not enough to get an Emblem). Then spend them ALL AT ONCE on speeding up your skill-learning. (Tip: The skill will need to have more than 6 hours of learning left to make this possible. And spending an Emblem doesn't count).";
var offer = "The <b>Giants<\/b>, all power to their spectral neurons, are most pleased when you learn their specialist skills, you know. <split butt_txt=\"Oh yeah?\" \/> Oh, totally. All skills are aligned to Giants, and one Giant, the <b>Primary Giant<\/b>, is always more closely aligned than others. <split butt_txt=\"So?\" \/> So it's worth sucking up more to them than others. If I were you, and I'm not, but if I was, I'd donate to get almost as much favor as I could for the giant of a skill I was learning - say… <b>997 favor<\/b> points? <split butt_txt=\"Phewie!…\" \/> And then spend them in <b>one go<\/b> speeding up that learnin'. That's what I'd do. <split butt_txt=\"That's what I'd do too.\" \/> That's what I thought. Do it. See you in 997 favor points, kid.";
var completion = "Phew! thought you were going to over-donate and earn yourself an extra Emblem for a second there, small. <split butt_txt=\"Tsh. I know better than that.\" \/> Course you do, kid. And that's the life lesson here: know your limits, and fall juuuuuust short of 'em. And that way, you get the big rewards! Wait. That sounds wrong. Oh, whatever, kid: Ta da!!!";


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
	"r281"	: {
		"type"		: "flag",
		"name"		: "primary_giant_spend_mad_favor",
		"class_id"	: "npc_shrine_alph",
		"desc"		: "Spend 997 favor points with a skill's Primary Giant."
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
	"mood"		: 50
};

//log.info("betterlearning_spend_favor_with_primary_giant.js LOADED");

// generated ok (NO DATE)
