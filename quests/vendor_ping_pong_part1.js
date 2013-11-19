var title = "Meet the Merchants";
var desc = "Visit the <b>Gardening Vendor<\/b> in <b>Northwest Passage<\/b>. He has some work for you.";
var offer = "Hi!<split butt_txt=\"Um, hi.\" \/> I'm your pet rock. I'll be your guide to this brand new world.<split butt_txt=\"Great!\" \/> If you're ready to get started, let's go.<split butt_txt=\"I'm ready\" \/> OK, great. Here's the first thing you should do: head over to the <b>Gardening Vendor<\/b> in <b>Northwest Passage<\/b>. He has some work for you. Click on your map over there in the top right corner to locate him.";
var completion = "Oh, hello! I've been expecting you. Maybe you can help me out...";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_gardening_vendor"];
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
	xp = pc.stats_add_xp(round_to_5(50 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(50 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 50,
	"currants"	: 50,
	"mood"		: 50,
	"energy"	: 50
};

//log.info("vendor_ping_pong_part1.js LOADED");

// generated ok (NO DATE)
