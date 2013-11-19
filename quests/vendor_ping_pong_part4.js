var title = "Meet the Merchants";
var desc = "Deliver 6 beers and 1 hooch to <b>Uncle Friendly<\/b>, the food vendor. You can find him in his store on <b>Guillermo Gamera Way<\/b> in <b>Ix<\/b>.<br><br>Tip: you'll need to find the Great Hole to Ix to make your way there.<br><br>Don't forget to <b>buy the booze<\/b> before you set off.";
var offer = "My friend Uncle Friendly, the Food Vendor, gave me a big feast the other night and I want to pay him back. He really likes his drinks, so can you bring him 6 beers and 1 hooch?<split butt_txt=\"I think so.\" \/> Great. He lives on <b>Guillermo Gamera Way<\/b> in <b>Ix<\/b>. Make sure not to drink the hooch, though. It has quite the kick!<split butt_txt=\"Thanks for the tip!\" \/> You can <b>buy these items from me<\/b> before you leave. Uncle Friendly will pay you back. He's pretty reliable... before he gets into the drinks.";
var completion = "Thannnks very mush. I've been runnin low on my drinksss. *hickup* Here iz somes of my speshall stuffs for speshall peeples.<split butt_txt=\"Oh, thanks!\" \/> Off with youse now. Uncle Friendly needz to be alonez for a spell.";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["vendor_ping_pong_part3"];
var prerequisites = [];
var end_npcs = ["npc_jabba1"];
var locations = {};
var requirements = {
	"r76"	: {
		"type"		: "item",
		"class_id"	: "beer",
		"num"		: 6,
		"remove"	: 1,
		"desc"		: "Collect 6 Beers"
	},
	"r77"	: {
		"type"		: "item",
		"class_id"	: "hooch",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Hooch"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(91 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(91 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("hooch", 10);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 500,
	"mood"		: 91,
	"energy"	: 91,
	"items"		: {
		"0"	: {
			"class_tsid"	: "hooch",
			"label"		: "Hooch",
			"count"		: 10
		}
	}
};

//log.info("vendor_ping_pong_part4.js LOADED");

// generated ok (NO DATE)
