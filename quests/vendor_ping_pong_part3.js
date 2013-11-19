var title = "Meet the Merchants";
var desc = "Deliver 3 tubes of butterfly lotion to the <b>Cooking Vendor<\/b> who works in the <b>Thicket<\/b> in Groddle Forest.<br><br>Don't forget to <b>buy the lotion<\/b> before you set off.";
var offer = "You've been such a great help so far. Are you up for another errand?<split butt_txt=\"Like what?\" \/> There's a fellow who sells hard-to-come-by cooking ingredients. He lives in the <b>Thicket<\/b> here in Groddle Forest. He has a thing for <b>butterfly lotion<\/b>. I don't know if he eats it or uses it on himself or what.<split butt_txt=\"That's... odd. So?\" \/> It's not my place to judge, so can you <b>bring him 3 tubes of butterfly lotion<\/b>?<split butt_txt=\"That's very open-minded of you.\" \/> I try. You can <b>buy the lotion from me<\/b>. The <b>Cooking Vendor<\/b> in the <b>Thicket<\/b> will pay you back. He's good for it. Despite his bizarre penchants, he's quite trustworthy.";
var completion = "My lotion! Excellent. My precious butterfly will be so happy. He's been complaining about my calluses.<split butt_txt=\"Er...\" \/> What has the Tool Vendor been telling you? Oh, never mind. Besides, you wouldn't believe what that guy's into.";


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
var prereq_quests = ["vendor_ping_pong_part2"];
var prerequisites = [];
var end_npcs = ["npc_cooking_vendor"];
var locations = {};
var requirements = {
	"r78"	: {
		"type"		: "item",
		"class_id"	: "butterfly_lotion",
		"num"		: 3,
		"remove"	: 1,
		"desc"		: "Collect 3 Butterfly Lotions"
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
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(71 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(71 * multiplier));
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
	"currants"	: 200,
	"mood"		: 71,
	"energy"	: 71
};

//log.info("vendor_ping_pong_part3.js LOADED");

// generated ok (NO DATE)
