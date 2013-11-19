var title = "Greedy Street Spirit Story";
var desc = "Visit storyland and read a bedtime story, once told all around Ur, to help a little piglet sleep.";
var offer = "Are you ready to reminisce Greedy Street Spirit Story?";
var completion = "Wasn't that sweet? Now that naptime is over, here's some breakfast.";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["greedy_street_spirit"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"level_quest_greedy_street_spirit_reminisce"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIF79EICMU7312E"
	}
};

var requirements = {
	"r507"	: {
		"type"		: "flag",
		"name"		: "read_act_1",
		"class_id"	: "wall_button",
		"desc"		: "Read Act I"
	},
	"r508"	: {
		"type"		: "flag",
		"name"		: "read_act_2",
		"class_id"	: "wall_button",
		"desc"		: "Read Act II"
	},
	"r509"	: {
		"type"		: "flag",
		"name"		: "read_act_3",
		"class_id"	: "wall_button",
		"desc"		: "Read Act III"
	},
	"r510"	: {
		"type"		: "flag",
		"name"		: "read_act_4",
		"class_id"	: "wall_button",
		"desc"		: "Read Act IV"
	},
	"r511"	: {
		"type"		: "flag",
		"name"		: "read_act_5",
		"class_id"	: "wall_button",
		"desc"		: "Read Act V"
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
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("waffles", 4);
}
var rewards = {
	"items"	: {
		"0"	: {
			"class_tsid"	: "waffles",
			"label"		: "Waffle",
			"count"		: 4
		}
	}
};

function callback_greedy_street_spirit_check(details){
	var pc = this.owner;
	if (!pc) return;
	
	if (!this.isDone() && !this.warned_story){
		pc.announce_vog_fade("You've missed some of the story! It's much more rewarding if you read it all the way through.");
		pc.moveAvatar(pc.x-100, pc.y, 'left');
	
		this.warned_story = true;
	}
}

function canOffer(pc){
	// We don't want to offer this immediately after part 1 finishes
	var part1 = pc.getQuestInstance('greedy_street_spirit');
	if (!part1) return false;
	if (!part1.ts_done) return false;
	if (time() - part1.ts_done < 60*60) return false;
		
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
	
	return true;
}

function onExitLocation(pc){
	var pc = this.owner;
	if (!pc) return;
		
	if (!this.is_complete){
		this.fail_time = time();
		pc.failQuest(this.class_tsid);
	
		pc.instances_exit('level_quest_greedy_street_spirit');
	}
}

function onJustCompleted(pc){
	pc.location.events_broadcast('spawn_qurazies');
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'level_quest_greedy_street_spirit_reminisce', -2635, -55, 5*60, {preserve_links: true});
		
	return {ok: 1};
}

//log.info("greedy_street_spirit_reminisce.js LOADED");

// generated ok (NO DATE)
