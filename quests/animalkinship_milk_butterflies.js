var title = "Go Moloko Loco, Butterfly Style";
var desc = "Find and gently milk 13 different <a href=\"event:item|npc_butterfly\">Butterflies<\/a> in one little old game day. Don't forget to use <a href=\"event:item|butterfly_lotion\">Butterfly Lotion<\/a>.";
var offer = "So, how are you with <a href=\"event:item|npc_butterfly\">Butterflies<\/a>? <split butt_txt=\"It's like we share the same soul.\" \/> Then you should have no trouble milking 13 of the little nectar nippers, no? <split butt_txt=\"Lemme at em!\" \/> Whoa. Not so fast, bub. This job has to get done in one game day, got it? <split butt_txt=\"Lemme at 'em.\" \/> And don't forget to use <a href=\"event:item|butterfly_lotion\">Butterfly Lotion<\/a>. You don't want those wee udders to chafe. You can get Butterfly Lotion from any <b>Street Spirit<\/b> who sells <b>Animal Goods<\/b>.";
var completion = "Now there's something you don't see every day. Those butterflies is thoroughly milked. <split butt_txt=\"I squoze 'em good.\" \/> I can see that. As promised, here's a little something-something. Get yourself something pretty.";


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
var prereq_quests = ["animalkinship_massage_butterflies"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r179"	: {
		"type"		: "counter",
		"name"		: "butterflies_milked",
		"num"		: 13,
		"class_id"	: "npc_butterfly",
		"desc"		: "Milk Butterflies"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(30 * multiplier));
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
	"xp"		: 300,
	"currants"	: 200,
	"energy"	: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 30
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('go_moloko_loco');
	delete pc.butterflies_milked;
}

function onStarted(pc){
	pc.buffs_apply('go_moloko_loco');
	
	return { ok: 1 };
}

//log.info("animalkinship_milk_butterflies.js LOADED");

// generated ok (NO DATE)
