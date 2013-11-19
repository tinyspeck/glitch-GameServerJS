var title = "De-Embiggenify II";
var desc = "Help Mr. Hairball find his shiny object. It must be somewhere in this room.";
var offer = "Now here's the thing. There's <b>a small shiny object with no intrinsic value<\/b> somewhere in this room. <split butt_txt=\"Ooh, cool!\" \/>I know. I'd get it myself, but I'm kind of lacking in the appendage department, if you know what I mean. Find it and bring it back to me, will you?<split butt_txt=\"OK!\" \/>(And here's a hint: have a look behind the cake!)";
var completion = "Thanks, buddy. I knew I could count on you. And just to show that even a hairball can have the heart of a king, I want you to have a little thank-you gift. <split butt_txt=\"Aw, that's nice.\" \/>This emotional bear will come in handy later in the game. Use it on its own, or upgrade it with some optional accessories and start spreading some cheer.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "Aw, buddy. I won't lie to you. I'm disappointed. Crushed, actually. You have to find that object and bring it back!";
var prereq_quests = ["de_embiggenify"];
var prerequisites = [];
var end_npcs = ["npc_dustbunny"];
var locations = {};
var requirements = {
	"r96"	: {
		"type"		: "item",
		"class_id"	: "small_worthless",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Small shiny object with no intrinsic value"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("emotional_bear", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"		: 200,
	"currants"	: 200,
	"mood"		: 50,
	"items"		: {
		"0"	: {
			"class_tsid"	: "emotional_bear",
			"label"		: "Emotional Bear",
			"count"		: 1
		}
	}
};

function onAccepted(pc){
	// Per Scott, reset the instance timer.
	
	pc.instances_cancel_exit_prompt('eesti');
	pc.instances_schedule_exit_prompt('eesti', 2*60);
}

function onComplete_custom(pc){
	//var loc = pc.embiggen_previous_location;
	//pc.familiar_teleport_offer("Good job! You're done here -- let's get you back to normal size again.", loc.tsid, loc.x, loc.y, true);
	//delete pc.embiggen_previous_location;
	
	pc.instances_exit_familiar('eesti', "Good job! You're done here -- let's get you back to normal size again.");
	
	pc.apiSetTimerX('quests_offer', 60*1000, 'high_jump');
}

//log.info("de_embiggenify_part2.js LOADED");

// generated ok (NO DATE)
