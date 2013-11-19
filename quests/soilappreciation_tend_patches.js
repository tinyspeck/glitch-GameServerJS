var title = "Dig the earth and tend the soil";
var desc = "Use your trusty <a href=\"event:item|hoe\">Hoe<\/a> to tend 5 weedy <a href=\"event:item|patch\">Patches<\/a>. Watch your toes. Hoes are sharp!";
var offer = "Hoeing offers a lot of benefits. <split butt_txt=\"Do tell.\" \/> Well, on top of being a necessary part of the patch-clearing process, it's also a great workout for that weird little organ you have that moves that squishy stuff around your body. <split butt_txt=\"The heart?\" \/> Is that what you call that thing? And did I mention that sometimes, while hoeing, you can find some pretty keen loot hiding in the weeds? <split butt_txt=\"I'm interested.\" \/> Get yourself a <a href=\"event:item|hoe\">Hoe<\/a> and tend 5 weedy <a href=\"event:item|patch\">Patches<\/a>. I'll check back when you're done.";
var completion = "Hoetastic! Good job on tending those patches. The Giants thank you. And they also asked me to give you a bunch of little bonus-y things.";


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
	"r63"	: {
		"type"		: "counter",
		"name"		: "patches_tended",
		"num"		: 5,
		"class_id"	: "patch",
		"desc"		: "Tend Patches"
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
	xp = pc.stats_add_xp(round_to_5(150 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 100,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 15
		}
	}
};

//log.info("soilappreciation_tend_patches.js LOADED");

// generated ok (NO DATE)
