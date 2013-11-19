var title = "A Purple Journey North";
var desc = "Acquire a <a href=\"event:item|purple_flower\">Purple Flower<\/a> and venture to the mountains of <a href=\"event:location|101\">Aranna<\/a> to munch it.";
var offer = "Say, you look like the type that has a wistful affection for the past.<split butt_txt=\"No, not really.\" \/>The type that enjoys hearing of the old days, before the Age of Friendly, if there ever was such a time.<split butt_txt=\"I should go...\" \/>They were the days of wonder and whimsy, when imagination flowed through your veins thicker than <a href=\"event:item|hooch\">Hooch<\/a>.<split butt_txt=\"I'm listening.\" \/>I'm told the era lives on in the <a href=\"event:item|purple_flower\">Purple Flower<\/a>, but that only those who journey to the mountains of <a href=\"event:location|101\">Aranna<\/a> can truly enjoy it.<split butt_txt=\"That far, huh?\" \/>Find the flower and go north, young creature, to experience imagination like it used to be.<split butt_txt=\"How's Helga?\" \/>Be gone!";
var completion = "Didn't think you were going to go through with it kid.<split butt_txt=\"YOLO\" \/>Well, was it worth all that trekking?<split butt_txt=\"Do my hands look big to you?\" \/>Nuff' said, kid. Nuff' said.";

var button_accept = "Okay.";

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
	"r415"	: {
		"type"		: "flag",
		"name"		: "acquired_purple_flower",
		"class_id"	: "purple_flower",
		"desc"		: "Acquire a Purple Flower"
	},
	"r416"	: {
		"type"		: "flag",
		"name"		: "purple_journey_munch",
		"class_id"	: "purple_apparition",
		"desc"		: "Munch a Purple Flower in the mountains of Aranna"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 500,
	"mood"	: 250,
	"favor"	: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 60
		}
	}
};

//log.info("purple_journey_north.js LOADED");

// generated ok (NO DATE)
