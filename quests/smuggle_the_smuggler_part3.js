var title = "Smuggle the Smuggler III";
var desc = "Let's get outta here.";
var offer = "Say... that hole looks almost wide enough to fit one glitchen and a half... <split butt_txt=\"What are you suggesting?\" \/>It'll be a dirty crawl but we'll come out clean on the other side.\r\n<split butt_txt=\"After you.\" \/>";
var completion = "";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["smuggle_the_smuggler_part2"];
var prerequisites = [];
var end_npcs = ["npc_rare_item_vendor"];
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
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
	"xp"		: 500,
	"currants"	: 500,
	"mood"		: 50
};

function onComplete_custom(pc){
	//var loc = pc.embiggen_previous_location;
	//pc.familiar_teleport_offer("You're free! I hope the sea is as blue as it has been in your dreams.", loc.tsid, loc.x, loc.y, true);
	//delete pc.embiggen_previous_location;
	
	pc.instances_exit_familiar('penalty', "You're free! And as a reward, your friend left something for you somewhere. You remember the name of the town don't you? Nevermind, just take it.");
}

//log.info("smuggle_the_smuggler_part3.js LOADED");

// generated ok (NO DATE)
