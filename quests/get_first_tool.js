var title = "Tooling Around";
var desc = "You've got the skills; now get the tools.";
var offer = "You've got the skills; now get the tools.";
var completion = "";


var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"has_achievement",
		"value":	"impossible_achievement"
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r292"	: {
		"type"		: "item",
		"class_id"	: "pick",
		"num"		: 1,
		"remove"	: 0,
		"apply_test"	: function (pc, quest) {
			return quest.skill == 'mining_1';

		},
		"desc"		: "Collect a Pick"
	},
	"r296"	: {
		"type"		: "item",
		"class_id"	: "tinkertool",
		"num"		: 1,
		"remove"	: 0,
		"apply_test"	: function (pc, quest) {
			return quest.skill == 'tinkering_1';

		},
		"desc"		: "Collect a Tinkertool"
	},
	"r297"	: {
		"type"		: "item",
		"class_id"	: "knife_and_board",
		"num"		: 1,
		"remove"	: 0,
		"apply_test"	: function (pc, quest) {
			return quest.skill == 'ezcooking_1';

		},
		"desc"		: "Collect a Knife & Board"
	},
	"r298"	: {
		"type"		: "item",
		"class_id"	: "test_tube",
		"num"		: 1,
		"remove"	: 0,
		"apply_test"	: function (pc, quest) {
			return quest.skill == 'alchemy_1';

		},
		"desc"		: "Collect a Test Tube"
	},
	"r299"	: {
		"type"		: "item",
		"class_id"	: "focusing_orb",
		"num"		: 1,
		"remove"	: 0,
		"apply_test"	: function (pc, quest) {
			return quest.skill == 'meditativearts_1';

		},
		"desc"		: "Collect a Focusing Orb"
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
	xp = pc.stats_add_xp(round_to_5(100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(20 * multiplier));
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
	"xp"	: 100,
	"mood"	: 20
};

function getCompletion(pc){
	return "I see you managed to find a "+this.tool_name+". Now you'll be able to "+this.thing_you_cant_do+" like it's going out of style.<split butt_txt=\"I hope it isn't going out of style.\" />Fashions change, kid! These things can sneak up on you, so just to be safe you should probably use your new skill as much as possible. You should also take this, as a reward for all your hard work.";
}

function getOffer(pc){
	var skill_name = config.data_skills[this.skill].name;
	
	var vendor_name_string = ((this.vendor_name == 'Alchemical Goods') ? 'an' : 'a') + ' '+this.vendor_name+' vendor';
	
	var offer = "I can't help but notice that you've just learned "+skill_name+". Think you're ready to put that to good use?<split butt_txt=\"Sure am!\" />Slow down there, turbo. Sometimes it takes more than just knowing how to do a particular thing; it takes the right tool. For example, you can't just "+this.thing_you_cant_do+" using only your noggin—at least, not without courting some pretty hefty head injuries. You're going to need a "+this.tool_name+".<split butt_txt=\"OK, so how do I get one?\" />I'm glad you asked. The simplest way is to buy one from a vendor. If fostering local industry is more your style, you can also pick one up from Auctions or trade for them with other players. For the moment, we're going to work on encouraging the free flow of capital by sending you to "+vendor_name_string+".<split butt_txt = \"Gotcha.\" />To save you some time, I'll teleport you directly there. As a warning, this involves bending reality into some fairly rude shapes, so there's a very, very small chance it might destroy all of time and space. Ready to go?";
	
	return this.expandText(offer, pc);
}

function onComplete_custom(pc){
	var map = config.skills_get_quest_map();
	if(map[this.skill]) {
		pc.quests_offer(map[this.skill]);
	}
}

function onCreate(pc){
	var tool_skills = ['ezcooking_1', 'alchemy_1', 'mining_1', 'tinkering_1', 'meditativearts_1'];
	
	for(var i in tool_skills) {
		if(pc.skills_has(tool_skills[i])) {
			this.skill = tool_skills[i];
			break;
		}
	}
	
	
	if(!this.skill || !config.data_skills[this.skill]) {
		log.error("Player "+this.owner+" has first tool quest, but does not seem to have an appropriate skill.");
	}
	
	switch(this.skill) {
		case 'ezcooking_1':
			this.tool_name = "<a href=\"/items/250/\" glitch=\"item-id:knife_and_board\" target=\"get_info\">Knife & Board</a>";
			this.vendor_name = "Kitchen Tools";
			this.thing_you_cant_do = "chop food";
			break;
		case 'alchemy_1':
			this.tool_name = "<a href=\"/items/463/\" glitch=\"item-id:test_tube\" target=\"get_info\">Test Tube</a>";
			this.vendor_name = "Alchemical Goods";
			this.thing_you_cant_do = "mix potentially volatile elements";
			break;
		case 'mining_1':
			this.tool_name = "<a href=\"/items/424/\" glitch=\"item-id:pick\" target=\"get_info\">Pick</a>";
			this.vendor_name = "Mining";
			this.thing_you_cant_do = "break rocks";
			break;
		case 'tinkering_1':
			this.tool_name = "<a href=\"/items/563/\" glitch=\"item-id:tinkertool\" target=\"get_info\">Tinkertool</a>";
			this.vendor_name = "Hardware";
			this.thing_you_cant_do = "repair tools";
			break;
		case 'meditativearts_1':
			this.tool_name = "<a href=\"/items/447/\" glitch=\"item-id:focusing_orb\" target=\"get_info\">Focusing Orb</a>";
			this.vendor_name = "Hardware";
			this.thing_you_cant_do = "become one with the numinous Real";
			break;
	}
}

function onStarted(pc){
	var location_tsid = pc.findClosestVendor(this.vendor_name);
	
	if (!location_tsid) {
		return {
			ok: 0,
			error: "You're too far from a vendor to try this right now."
		};
	}
	
	// Find the street spirit in that area
	var location = apiFindObject(location_tsid);
	
	if(!location) {
		return {
			ok: 0,
			error: "You're too far from a vendor to try this right now."
		};
	}
	
	var spirits = location.find_items(function (it) { return it.hasTag('streetspirit'); });
	
	if (!spirits.length) {
		return {
			ok: 0,
			error: "You're too far from a vendor to try this right now."
		};
	}
	
	var x = spirits[0].x - 35;
	var y = spirits[0].y;
	
	var plat_position = location.apiGetPointOnTheClosestPlatformLineBelow(x, y);
	if (!plat_position) {
		var plat_position = location.apiGetPointOnTheClosestPlatformLineAbove(x, y);
	
		if (!plat_position) {
			log.info("Tried to teleport player to street spirit, but couldn't find a good position. Quitting.");
			return {
				ok: 0,
				error: "You're too far from a vendor to try this right now."
			};
		}
	}
	
	
	pc.teleportToLocationDelayed(location_tsid, plat_position.x, plat_position.y);
	
	return {ok: 1};
}

//log.info("get_first_tool.js LOADED");

// generated ok (NO DATE)
