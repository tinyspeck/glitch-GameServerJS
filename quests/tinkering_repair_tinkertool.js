var title = "Tinker with Your Tool(s)";
var desc = "Ever notice that when you use a <a href=\"event:item|tinkertool\">Tinkertool<\/a> to repair itself, you can never quite get it back to 100%? There is a way though … and I need you to repair a Tinkertool all the way back to 100% capacity. Hint: you might want to borrow a second tool from a friend, and use drag-and-drop!";
var offer = "So, you use your <a href=\"event:item|tinkertool\">Tinkertool<\/a> to fix your broken tools, but then what do you use to fix a broken <b>Tinkertool<\/b>? <split butt_txt=\"Um... another Tinkertool?\" \/> You're smarter than you look, friend. <split butt_txt=\"Hey!\" \/> Oops. I meant to say EVEN smarter. Moving right along... ready to start a-tinkering?";
var completion = "So now that you've got two good Tinkertools, what are you going to do with them? <split butt_txt=\"I dunno. Got any suggestions?\" \/> Not my department, kid. My job is to give you this little bonus and then make like a mineral and flake.";


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
var prereq_quests = ["tinkering_repair_tools"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r195"	: {
		"type"		: "counter",
		"name"		: "tinkertool_repaired",
		"num"		: 1,
		"class_id"	: "tinkertool",
		"desc"		: "Repair your Tinkertool with another Tinkertool"
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
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(45 * multiplier));
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
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 45
		}
	}
};

//log.info("tinkering_repair_tinkertool.js LOADED");

// generated ok (NO DATE)
