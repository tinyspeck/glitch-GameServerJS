var title = "Beelzebooze";
var desc = "Enter the Hell Bar in <a href=\"event:location|40#LA5RPAFK9OE28GN\">Panka Surazu<\/a>, Naraka, exchange your Diabolical Drink Ticket for Wine of the Dead and drink to your good hellth… er, \"health.\"";
var offer = "I know it looks gloomy down here, but it ain't so bad; great atmosphere, no cover charge and even a free drink ticket. <split butt_txt=\"Thanks... I think?\" \/>Take this drink ticket to the Hell Bar at the far end of Naraka and exchange it for a bottle of Wine of the Dead. I have a feeling you’ll enjoy its revitalizing qualities.";
var completion = "How do you feel now, kid? Like a great weight has been lifted off your shoulders?<split butt_txt=\"More or less.\" \/>Great! Now go explore Naraka. Have fun. Don't do anything I wouldn't do. Oh, and take these extras for your excellent work.";

var button_accept = "Thanks!";

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
var prerequisites = [];
var end_npcs = [];
var locations = {
	"dhuma_maya"		: {
		"dev_tsid"	: "LM410BL52JAAI",
		"prod_tsid"	: "LA5REO5I9OE2KLS"
	},
	"mada_tamaha"		: {
		"dev_tsid"	: "LA524M0OMOE2OGT",
		"prod_tsid"	: "LA524M0OMOE2OGT"
	},
	"panka_surazu"		: {
		"dev_tsid"	: "LA5RPAFK9OE28GN",
		"prod_tsid"	: "LA5RPAFK9OE28GN"
	},
	"mahatam_audarika"	: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5PV4T79OE2AOA"
	},
	"ratna_vitteha"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5Q57C99OE2GNU"
	},
	"valuka_himsa"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5S44RM9OE2416"
	},
	"hell_bar"		: {
		"dev_tsid"	: "",
		"prod_tsid"	: "LA5FPUNAI7P2NVF"
	}
};

var requirements = {
	"r355"	: {
		"type"		: "flag",
		"name"		: "buy_wotd",
		"class_id"	: "wine_of_the_dead",
		"desc"		: "Buy Wine of the Dead"
	},
	"r356"	: {
		"type"		: "flag",
		"name"		: "drink_wotd",
		"class_id"	: "wine_of_the_dead",
		"desc"		: "Drink Wine of the Dead"
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
	xp = pc.stats_add_xp(round_to_5(250 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(150 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 250,
	"currants"	: 150
};

function canStartInHell(){
	return true;
}

function onAccepted(pc){
	// We don't need the player's recognition details anymore. Remove them.
	pc.removeDeathRecognitionDetails();
	
	var remaining = pc.createItemFromFamiliar('drink_ticket', 1);
	var activityText;
	if (remaining) {
		activityText = "Your pack is full so your drink ticket for Wine of the Dead has been put into storage. Your map has also been updated with the route to the Hell Bar.";
	} else {
		activityText = "You received a drink ticket for Wine of the Dead and your map has been updated with the route to the Hell Bar.";
	}
	
	pc.prompts_add({
		txt		: activityText,
		choices		: [
			{ value : 'ok', label : 'OK' }
		]
	});
	
	// Build a path to Panka Surazu
	var ret = pc.buildPath('LA5RPAFK9OE28GN', pc.location.tsid);
	var rsp = {
		type: 'get_path_to_location',
		path_info: ret.path
	};
	
	pc.apiSendMsg(rsp);
}

//log.info("hell_quest.js LOADED");

// generated ok (NO DATE)
