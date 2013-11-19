var title = "Last Egg Standing";
var desc = "Do everyone a favor. Harvest the last <a href=\"event:item|egg_plain\">Egg<\/a> from an <a href=\"event:item|trant_egg\">Egg Plant<\/a>. That way nobody else feels awkward taking the last one.";
var offer = "You know what bugs me? <split butt_txt=\"People who talk about how much their house cost?\" \/> Well, yes, but that's not what I'm talking about. I'm talking about how nobody wants to be the bad guy and take the last <a href=\"event:item|egg_plain\">Egg<\/a> from an <a href=\"event:item|trant_egg\">Egg Plant<\/a>. I guess it's better for it to just rot there? <split butt_txt=\"So selfishness is, in fact, good?\" \/> Whoa there. You're going all Objectivist on me, kid. There may be a reward in this little endeavor. Don't take it as an endorsement of your crazy ideas.";
var completion = "I knew I could count on you to clean out the last egg from an <b>Egg Plant<\/b>. <split butt_txt=\"Helping the community rocks.\" \/> I can't tell if you're being serious, or if you're being funny, so I'm just going to give you this bonus and retreat into watchful silence.";


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
	"r211"	: {
		"type"		: "flag",
		"name"		: "gardening_harvest_last_egg_plant",
		"class_id"	: "trant_egg",
		"desc"		: "Harvest the last egg"
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
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 400,
	"currants"	: 200,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "spriggan",
			"points"	: 40
		}
	}
};

//log.info("gardening_harvest_last_egg_plant.js LOADED");

// generated ok (NO DATE)
