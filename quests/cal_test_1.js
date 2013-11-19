var title = "Cal Test 1";
var desc = "–";
var offer = "I'd like you to collect some apples for me!";
var completion = "Thanks for the apples!";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"has_skill",
		"value":	"soil_appreciation_1"
},{
		"not"		:0,
		"condition":	"has_achievement",
		"value":	"junior_ok_explorer"
},{
		"not"		:0,
		"condition":	"over_level",
		"value":	0
},{
		"not"		:0,
		"condition":	"over_favor",
		"value":	"humbaba|0"
}];
var end_npcs = ["npc_taskmaster"];
var locations = {};
var requirements = {
	"r21"	: {
		"type"		: "item",
		"class_id"	: "apple",
		"num"		: 5,
		"remove"	: 1,
		"desc"		: "Collect 5 Apples"
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
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	var items = pc.runDropTable("myles_test");
	for (var i in items){
		if (items[i].class_id){
			rewards.items.push({class_tsid: items[i].class_id, label: items[i].label, count: items[i].count});
		}else if (items[i].currants){
			if (!rewards.currants) rewards.currants = 0;
			rewards.currants += items[i].currants;
		}else if (items[i].favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push(items[i].favor);
		}
	}
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"currants"	: 100,
	"drop_table"	: {
		"0"	: {
			"class_tsid"	: "myles_test",
			"label"		: "I'm testing!",
			"count"		: 1
		}
	}
};

//log.info("cal_test_1.js LOADED");

// generated ok (NO DATE)
