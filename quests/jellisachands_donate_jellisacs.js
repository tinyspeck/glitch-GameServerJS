var title = "A Slatheration of Jellisacs";
var desc = "Gather <a href=\"event:item|jellisac_clump\">Jellisacs<\/a> until you get a 'super harvest', then take them to a <b>Shrine to Grendaline<\/b> and slather the Shrine in Jellisacs.";
var offer = "Fine pair of <b>Jellisac Hands<\/b> you've got there, old chap. <split butt_txt=\"Why, thank you.\" \/> You're welcome. And well-equipped to do me a kindness. Well, not me, per se: <a href=\"event:external|http:\/\/www.glitch.com\/giants\/#grendaline\">Grendaline<\/a>. <split butt_txt=\"Grendaline?!?\" \/> You heard right, kid. Grendaline, all reverence to her watery glory, has a bit of a craving for <a href=\"event:item|jellisac_clump\">Jellisacs<\/a>. Don't ask why: I think she might gargle with them or something. All I know is, it would be peachy if you could gather Jellisacs until you get a <b>'super harvest'<\/b>, then take them to a <b>Shrine to Grendaline<\/b> - any Shrine to Grendaline, and slather the shrine in them. <split butt_txt=\"Wait, slather?\" \/> Yup, slather. Not donate: <b>slather<\/b>. You'll see when you get there.";
var completion = "Grendaline thanks you. <split butt_txt=\"Really?\" \/> Well, she would if she didn't have a throat full of Jellisac. <split butt_txt=\"But… but I slathered them on the shrine…\" \/> Don't ask how the science works, kid, somehow they soak into the shrine and end up in the mind of Grendaline's mouth. Seriously, it's very complicated. You know what's not so complicated? Rewards. You gots some. Enjoy.";


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
	"r312"	: {
		"type"		: "counter",
		"name"		: "super_harvest_jellisac",
		"num"		: 1,
		"class_id"	: "jellisac",
		"desc"		: "Get a Jellisac super harvest"
	},
	"r313"	: {
		"type"		: "counter",
		"name"		: "jellisacs_slathered",
		"num"		: 1,
		"class_id"	: "npc_shrine_grendaline",
		"desc"		: "Slather Jellisacs on a Shrine to Grendaline"
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
	xp = pc.stats_add_xp(round_to_5(350 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("grendaline", round_to_5(50 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 350,
	"currants"	: 200,
	"mood"		: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "grendaline",
			"points"	: 50
		}
	}
};

//log.info("jellisachands_donate_jellisacs.js LOADED");

// generated ok (NO DATE)
