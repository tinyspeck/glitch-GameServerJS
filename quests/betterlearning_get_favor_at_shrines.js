var title = "Spreading the Love";
var desc = "Get 23 favor points at the <b>Shrines<\/b> of five different <b>Giants<\/b> by donating to them. (Only the stuff donated from this moment onward counts.)";
var offer = "Hey, don't panic, kid, but… <split butt_txt=\"But what?\" \/> Well, I've heard a rumour that you've been favoring some <b>Giants<\/b> over others. <split butt_txt=\"Me? Never!\" \/> Well, I'd advise you to repair your reputation, and fast. You want to know how? <split butt_txt=\"Dying to know.\" \/>  Watch the sarcasm, chummo. Get yourself to the <b>Shrines<\/b> of five different <b>Giants<\/b>, and donate... oof, counting from this moment onward, at least 23 favor points-worth of stuff to all of them? Yeah, that should do it. Git, kid!";
var completion = "Phew. I think everyone feels like you're spreading your favor a little more evenly. <split butt_txt=\"Phew.\" \/> And just for that, here I am, spreading MY love, all over you, very evenly. In the form of remuneration and stuff. This isn't coming out right at all.";


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
	"r280"	: {
		"type"		: "counter",
		"name"		: "favor_unique_shrines",
		"num"		: 5,
		"class_id"	: "npc_shrine_alph",
		"desc"		: "Donate at least 23 favor worth of items to the Shrines of 5 different Giants."
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
	"mood"		: 75
};

function onAccepted(pc){
	pc.betterlearning_favor_init();
}

function onComplete_custom(pc){
	pc.betterlearning_favor_end();
}

//log.info("betterlearning_get_favor_at_shrines.js LOADED");

// generated ok (NO DATE)
