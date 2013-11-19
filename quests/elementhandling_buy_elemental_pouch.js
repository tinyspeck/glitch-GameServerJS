var title = "Get Elemental!";
var desc = "Buy an <a href=\"event:item|bag_elemental_pouch\">Elemental Pouch<\/a> from a <b>Street Spirit<\/b> who sells <b>Alchemical Goods<\/b>, or <b>Hardware<\/b>.";
var offer = "Element handling, eh? That's a handy skill. But you are going to need a <a href=\"event:item|bag_elemental_pouch\">pouch<\/a> for that. Go and buy one from a <b>Street Spirit<\/b> who sells <b>Alchemical Goods<\/b> or <b>Hardware<\/b>.";
var completion = "Great! Now that you have a pouch, I've filled it up with some <b>elements<\/b>. But ... you can't do anything with them till you get the <a href=\"event:skill|alchemy_1\">Alchemy I<\/a> skill, so get cracking!<split butt_txt=\"Wha? Lame!\" \/>Not only that, but you can't make elements yourself without the <a href=\"event:skill|refining_1\">Refining I<\/a> skill, which you can get after <a href=\"event:skill|mining_1\">Mining I<\/a>.<split butt_txt=\"Oy!\" \/>Yeah, yeah ... there's a lot to do. Boo hoo. Get going!";


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
	"r100"	: {
		"type"		: "item",
		"class_id"	: "bag_elemental_pouch",
		"num"		: 1,
		"remove"	: 0,
		"desc"		: "Collect an Elemental Pouch"
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
	xp = pc.stats_add_xp(round_to_5(125 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(75 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("ti", round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("element_red", 100);
	pc.createItemFromFamiliar("element_green", 100);
	pc.createItemFromFamiliar("element_blue", 100);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 125,
	"currants"	: 75,
	"mood"		: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 10
		}
	},
	"items"		: {
		"0"	: {
			"class_tsid"	: "element_red",
			"label"		: "Red Element",
			"count"		: 100
		},
		"1"	: {
			"class_tsid"	: "element_green",
			"label"		: "Green Element",
			"count"		: 100
		},
		"2"	: {
			"class_tsid"	: "element_blue",
			"label"		: "Blue Element",
			"count"		: 100
		}
	}
};

//log.info("elementhandling_buy_elemental_pouch.js LOADED");

// generated ok (NO DATE)
