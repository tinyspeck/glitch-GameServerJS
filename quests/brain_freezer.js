var title = "Brain Freezer";
var desc = "You know what's better than a <a href=\"event:item|sno_cone_blue\">Sno Cone<\/a>? Five Sno Cones! Collect one of each color: Blue, Green, Orange, Red and Purple. Get them from your friends, from a <a href=\"event:item|npc_sno_cone_vending_machine\">Sno Cone Vendor<\/a> in Wintry Place (accessible via <a href=\"event:location|56#LLI23D3LDHD1FQA\">Northwest Passage<\/a> in Groddle Forest or <a href=\"event:location|64#LCRHJHOFQNL1PHP\">Newcot Close<\/a> in Groddle Heights) or from the <a href=\"event:external|http:\/\/beta.glitch.com\/auctions\/create\/\">Auctions<\/a>.";
var offer = "Psst. Kid. It's been two million years since I burned through this atmosphere, but I'm still hot. <split butt_txt=\"I bet!\" \/>Get me a <a href=\"event:item|sno_cone_blue\">Sno Cone<\/a>, will you? Better yet, make that five Sno Cones. <split butt_txt=\"Five Sno Cones, coming up.\" \/>Remember, kid, five. That's one each of blue, green, orange, purple and red. <split butt_txt=\"One of each color. Sure thing.\" \/>And just so you know, unless you have friends with Sno Cones, it might be the easiest to visit the <b>Wintry Place<\/b> via <a href=\"event:location|56#LLI23D3LDHD1FQA\">Northwest Passage<\/a> or <a href=\"event:location|64#LCRHJHOFQNL1PHP\">Newcot Close<\/a> to do this. <split butt_txt=\"Visit Wintry Place. Check.\" \/>And if you go to <b>Wintry Place<\/b> you're going to have to find a <b>Sno Cone Vendor<\/b>. Think you can manage all that?";
var completion = "Yoink! I'm taking all those Sno Cones. <split butt_txt=\"Huh?\" \/> Don't worry, kid. You deserve some kudos. <split butt_txt=\"Aww... shucks.\" \/>Unfortunately, I gave away my last kudo yesterday. Take some currants and points instead.";


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
	"r90"	: {
		"type"		: "item",
		"class_id"	: "sno_cone_blue",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Blue Sno Cone"
	},
	"r91"	: {
		"type"		: "item",
		"class_id"	: "sno_cone_green",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Green Sno Cone"
	},
	"r92"	: {
		"type"		: "item",
		"class_id"	: "sno_cone_orange",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect an Orange Sno Cone"
	},
	"r93"	: {
		"type"		: "item",
		"class_id"	: "sno_cone_red",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Red Sno Cone"
	},
	"r94"	: {
		"type"		: "item",
		"class_id"	: "sno_cone_purple",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Purple Sno Cone"
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
	xp = pc.stats_add_xp(round_to_5(700 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(1500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 700,
	"currants"	: 1500,
	"mood"		: 100,
	"energy"	: 100
};

//log.info("brain_freezer.js LOADED");

// generated ok (NO DATE)
