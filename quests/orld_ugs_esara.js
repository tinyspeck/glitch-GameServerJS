var title = "Chasing Hubba Dubba Hugs";
var desc = "Travel to the following streets within <a href=\"event:location|98\">Besara<\/a>  and get one hug each from three different players.\r\n<a href=\"event:location|98#LA9143HLH4929K7\">Tremit Rub<\/a> \r\n<a href=\"event:location|98#LA9JJL6KCE924IK\">Patomi Bunya<\/a>\r\n<a href=\"event:location|98#LA9117J18492SRS\">Krios Palm<\/a>\r\nBe careful some strange Glitches can hug a little to tightly!";
var offer = "Did you know the world of Ur is built on Hugs?<split butt_txt=\"er....Sure?\" \/> Well it is true, a rock never fibs! It is doubly important to Hug strangers and receive their cosmic hugs! Are you ready to do your Hugglily part? <split butt_txt=\"Its Hug time\" \/> Perfect, Besara hug levels are low, get there on the double and gather allies to give you hugs.<split butt_txt=\"On my way\" \/>";
var completion = "Now don't you feel all warm and fuzzy? <split butt_txt=\"Warm yes, fuzzy?\" \/> Now that the cockles of Ur's heart is now full you can abstain from hugging for a little while.<split butt_txt=\"cockles?\" \/> In return for your gathering of all the huggers we offer you these fine rewards.";


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
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	15
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r472"	: {
		"type"		: "flag",
		"name"		: "hugs_tremit",
		"class_id"	: "emotional_bear",
		"apply_test"	: function (pc, quest) {
			return (pc.location.tsid == 'LA9143HLH4929K7') ? true : false;

		},
		"desc"		: "Get 3 Hugs in Tremit Rub"
	},
	"r473"	: {
		"type"		: "flag",
		"name"		: "hugs_patomi",
		"apply_test"	: function (pc, quest) {
			return (pc.location.tsid == 'LA9JJL6KCE924IK') ? true : false;

		},
		"desc"		: "Get 3 Hugs in Patomi Bunya"
	},
	"r474"	: {
		"type"		: "flag",
		"name"		: "hugs_krios",
		"apply_test"	: function (pc, quest) {
			return (pc.location.tsid == 'LA9117J18492SRS') ? true : false;

		},
		"desc"		: "Get 3 Hugs in Krios Palm"
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
	xp = pc.stats_add_xp(round_to_5(467 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(43 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(17 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 467,
	"currants"	: 100,
	"mood"		: 43,
	"energy"	: 17,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 100
		}
	}
};

//log.info("orld_ugs_esara.js LOADED");

// generated ok (NO DATE)
