var title = "Mini Me, Mini You!";
var desc = "Give seven different characters their likeness in cubimal form.";
var offer = "\"There are no grades of vanity, there are only grades of ability in concealing it...\" and nothing makes it harder to conceal vanity than the cheap thrill of possessing a cubimal which looks just like you.<split butt_txt=\"A cubimal that looks like me?!\" \/>Hold your horses, vainy-pants! No-one said anything about a cubimal that looks like you.<split butt_txt=\"Aww. What then?\" \/>Many of the inhabitants of Ur have cubimals that look like them. Also, low self-esteem. It would greatly improve the mood of the world if their vanity were tickled a bit.<split butt_txt=\"I'm a champion tickler!\" \/>That you are! But don't get too touchy-feely. I just need you to find 7 different cubimals and deliver them to the Ur-inhabitant they resemble. Can you do that for me?<split butt_txt=\"Do I get a cubimal that looks like me?\" \/>No. But maybe some other stuff. And the pride that comes from a job well done.<split butt_txt=\"Sigh. Ok, I'll do it!\" \/>";
var completion = "What-ho! By my calculations the collective mood of Ur has been raised precisely 0.324%, thanks to your hard work.<split butt_txt=\"That's not much!\" \/>It's significantly more than zero.<split butt_txt=\"You have an odd way of looking at things.\" \/>Perhaps, but... look, do you want these rewards or not?<split butt_txt=\"Yes please!\" \/>";


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
	"r471"	: {
		"type"		: "counter",
		"name"		: "npcs_given_cubimals",
		"num"		: 7,
		"class_id"	: "npc_cubimal_chick",
		"desc"		: "Give 7 cubimals to the NPCs they depict"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(10000 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
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
	"xp"		: 1000,
	"currants"	: 10000
};

function onComplete_custom(pc){
	pc.counters_reset_group('npcs_given_cubimals');
}

//log.info("mini_me_mini_you.js LOADED");

// generated ok (NO DATE)
