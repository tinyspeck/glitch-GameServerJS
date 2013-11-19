var title = "Meet the Merchants";
var desc = "Deliver 1 pack of tomato seeds, 1 pack of onion seeds, a hoe, and a watering can to the <b>Tool Vendor<\/b> on <b>Ti Street<\/b> in Groddle.<br><br>Don't forget to <b>buy these items from the Gardening Vendor<\/b> before you head off.";
var offer = "I have a friend who sells tools over in <b>Groddle<\/b>, on <b>Ti Street<\/b>. He's been thinking of growing a garden, but he needs some seeds.<split butt_txt=\"Yeah? Tell me more.\" \/> He has a terrible green thumb, so he needs my help. Can you take him 1 pack of <b>tomato seeds<\/b>, 1 pack of <b>onion seeds<\/b>, a <b>hoe<\/b>, and a <b>watering can<\/b>?<split butt_txt=\"Sure, I'll help.\" \/>  You'll have to <b>buy these items from me<\/b> first. The tool vendor will pay you back. You can count on him. He may have a black thumb, but he's chock full of scruples.";
var completion = "Thank you so much! I can't wait to get started on my garden.<split butt_txt=\"Oh. Uh. Good luck?\" \/>  Don't believe anything the Gardening Vendor tells you. He's just jealous that my pumpkin took first prize in the Groddle Forest Harvest Fair.<split butt_txt=\"Wow. Congratulations.\" \/>  Here's your money, plus a little something extra for your trouble.";


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
var prereq_quests = ["vendor_ping_pong_part1"];
var prerequisites = [];
var end_npcs = ["npc_tool_vendor"];
var locations = {};
var requirements = {
	"r72"	: {
		"type"		: "item",
		"class_id"	: "seed_tomato",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Tomato Seed"
	},
	"r73"	: {
		"type"		: "item",
		"class_id"	: "seed_onion",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect an Onion Seed"
	},
	"r74"	: {
		"type"		: "item",
		"class_id"	: "hoe",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Hoe"
	},
	"r75"	: {
		"type"		: "item",
		"class_id"	: "watering_can",
		"num"		: 1,
		"remove"	: 1,
		"desc"		: "Collect a Watering Can"
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
	currants = pc.stats_add_currants(round_to_5(777 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(70 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(70 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	pc.createItemFromFamiliar("hoe", 1);
	pc.createItemFromFamiliar("watering_can", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 150,
	"currants"	: 777,
	"mood"		: 70,
	"energy"	: 70,
	"items"		: {
		"0"	: {
			"class_tsid"	: "hoe",
			"label"		: "Hoe",
			"count"		: 1
		},
		"1"	: {
			"class_tsid"	: "watering_can",
			"label"		: "Watering Can",
			"count"		: 1
		}
	}
};

//log.info("vendor_ping_pong_part2.js LOADED");

// generated ok (NO DATE)
