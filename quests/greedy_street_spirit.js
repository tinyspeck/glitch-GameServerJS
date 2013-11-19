var title = "The Greedy Street Spirit";
var desc = "Visit storyland and read a bedtime story, once told all around Ur, to help a little piglet sleep.";
var offer = "You know after a nice full meal, you feel all sleepy and slumberful?  <split butt_txt=\"Oh yeeaaah, good times.\" \/> Well, I know of this one piglet that no matter how much he ate, just couldn't feel sleepy. <split butt_txt=\"Sounds awful.\" \/> It was bad, this unsleepiness. But there was one thing which finally helped: a favorite bedtime story told all 'round Ur since the dawn of the Third Era. Would you like to go to storyland and read it?";
var completion = "Wasn't that sweet? Here's a cuddly <a href=\"event:item|emotional_bear\">Emotional Bear<\/a> to remind you of this bedtime story.";


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
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	3
}];
var end_npcs = ["npc_piggy"];
var locations = {
	"level_quest_greedy_street_spirit"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LNVKEU5TKG33K7L"
	}
};

var requirements = {
	"r501"	: {
		"type"		: "flag",
		"name"		: "read_act_1",
		"class_id"	: "wall_button",
		"desc"		: "Read Act I"
	},
	"r502"	: {
		"type"		: "flag",
		"name"		: "read_act_2",
		"class_id"	: "wall_button",
		"desc"		: "Read Act II"
	},
	"r503"	: {
		"type"		: "flag",
		"name"		: "read_act_3",
		"class_id"	: "wall_button",
		"desc"		: "Read Act III"
	},
	"r504"	: {
		"type"		: "flag",
		"name"		: "read_act_4",
		"class_id"	: "wall_button",
		"desc"		: "Read Act IV"
	},
	"r505"	: {
		"type"		: "flag",
		"name"		: "read_act_5",
		"class_id"	: "wall_button",
		"desc"		: "Read Act V"
	},
	"r545"	: {
		"type"		: "flag",
		"name"		: "talk_to_piggy",
		"class_id"	: "npc_piggy",
		"desc"		: "Talk to a piggy"
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
	mood = pc.metabolics_add_mood(round_to_5(150 * multiplier));
	favor = pc.stats_add_favor_points("pot", round_to_5(100 * multiplier));
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
	"mood"	: 150,
	"favor"	: {
		"0"	: {
			"giant"		: "pot",
			"points"	: 100
		}
	},
	"items"	: {
		"0"	: {
			"class_tsid"	: "emotional_bear",
			"label"		: "Emotional Bear",
			"count"		: 1
		}
	}
};

function callback_greedy_street_spirit_check(details){
	var pc = this.owner;
	if (!pc) return;
	
	var done = true;
	
	if ( !pc.quests_get_flag("greedy_street_spirit", "read_act_1")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_2")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_3")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_4")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_5")
	) {
		done = false;
	}
	
	if (!done && !this.warned_story){
		pc.announce_vog_fade("You've missed some of the story! It's much more rewarding if you read it all the way through.");
		pc.moveAvatar(pc.x-100, pc.y, 'left');
	
		this.warned_story = true;
	}
	else if (done && !this.piggy_explained){
		pc.announce_vog_fade("What a wonderful story. Let's return to the Piggy to wrap this up.");
	
		this.piggy_explained = true;
	}
}

function canOffer(pc){
	if (pc.location.isInstance()) return false;
	if (pc.has_done_intro) return true;
	return false;
}

function onComplete_custom(pc){
	delete pc.last_piggy_offer;
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
		
	var done = true;
	
	if ( !pc.quests_get_flag("greedy_street_spirit", "read_act_1")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_2")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_3")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_4")
	||   !pc.quests_get_flag("greedy_street_spirit", "read_act_5")
	) {
		done = false;
	}
	
	if (!done){
		pc.failQuest(this.class_tsid);
	
		pc.instances_exit('level_quest_greedy_street_spirit');
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'level_quest_greedy_street_spirit', -2635, -55, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("greedy_street_spirit.js LOADED");

// generated ok (NO DATE)
