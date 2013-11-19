var title = "Picto-Pattern";
var desc = "Add and subtract until you reach 11.";
var offer = "Pop Quiz! How many Giants are there? <split butt_txt=\"Eleven!\" \/> Isn't that such a lovely prime number? Sure there are other numbers out there like 5 or 29, but nothing compares to the heavenly ring that 11 makes. <split butt_txt=\"I agree!\" \/> Well, if you are following me, I guess you can count. Want to turn some numbers into 11?";
var completion = "Whew, who knew counting numbers could be so tough. Especially counting to a number that exceeds the number of fingers you have.";

var button_accept = "11 me up!";
var button_decline = "Another time.";

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
var locations = {
	"picto_pattern"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LIFI3TJSFGD3MIS"
	}
};

var requirements = {
	"r556"	: {
		"type"		: "flag",
		"name"		: "solved_puzzle",
		"desc"		: "Solved Puzzle"
	},
	"r557"	: {
		"type"		: "flag",
		"name"		: "leave",
		"desc"		: "Complete the Journey"
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
	currants = pc.stats_add_currants(round_to_5(1100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(110 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(110 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(110 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("cloud_11_smoothie", 11);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 1100,
	"mood"		: 110,
	"energy"	: 110,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 110
		}
	},
	"items"		: {
		"0"	: {
			"class_tsid"	: "cloud_11_smoothie",
			"label"		: "Cloud 11 Smoothie",
			"count"		: 11
		}
	}
};

function onExitLocation(previous_location){
	var pc = this.owner;
	if (!pc) return;
	
	this.set_flag(pc, 'leave');
	
	if (!this.is_complete){
		pc.failQuest(this.class_tsid);
			
		pc.instances_exit(previous_location);
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'picto_pattern', 0, 0, 5*60, {preserve_links: true}, {}, true);
		
	return {ok: 1};
}

//log.info("picto_pattern.js LOADED");

// generated ok (NO DATE)
