var title = "Got Milk? ";
var desc = "And after you got <a href=\"event:item|milk_butterfly\">Milk<\/a>, got <a href=\"event:item|meat\">Meat<\/a>? Get a <a href=\"event:item|butterfly_milker\">Butterfly Milker<\/a> and a <a href=\"event:item|meat_collector\">Meat Collector<\/a>, install them in your yard, then set them to milking and harvesting until they're full up.";
var offer = "I've been watching you kid. You're busy and important. You're on the move, and you've got better places to be than hanging around the house waiting to harvest butterflies and piggies. <split butt_txt=\"It's like you're inside my head.\" \/>You need to get yourself a patented, practically dumdum-proof <a href=\"event:item|butterfly_milker\">Butterfly Milker<\/a> and <a href=\"event:item|meat_collector\">Meat Collector<\/a>. <split butt_txt=\"I am fond of gadgets.\" \/>Set them up in your yard, and I'll check back with you when they're full up, mkay?";
var completion = "Looks like that Butterfly Milker is as full as it gets. And if that Meat Collector were any more full, it would be... really, really full. <split butt_txt=\"True.\" \/>Here's an idea you maybe haven't tried: give one of your <a href=\"event:item|milk_butterfly\">Butterfly Milks<\/a> a good shake and see what happens. <split butt_txt=\"What about shaking a meat?\" \/>Nothing happens. It just makes other people uncomfortable.";


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
	"r173"	: {
		"type"		: "flag",
		"name"		: "meat_collector_full",
		"class_id"	: "meat_collector",
		"desc"		: "Fill up a Meat Collector"
	},
	"r174"	: {
		"type"		: "flag",
		"name"		: "butterfly_milker_full",
		"class_id"	: "butterfly_milker",
		"desc"		: "Fill up a Butterfly Milker"
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
	xp = pc.stats_add_xp(round_to_5(600 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(75 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(60 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 600,
	"currants"	: 400,
	"mood"		: 75,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 60
		}
	}
};

//log.info("remoteherdkeeping_fill_up_meat_collector_and_milker.js LOADED");

// generated ok (NO DATE)
