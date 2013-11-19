var title = "Legalize It";
var desc = "Obtain and activate the <a href=\"event:item|card_carrying_qualification\">Card Carrying Qualification<\/a>. You can get it at any one of the <b>Bureaucratic Halls<\/b>: <a href=\"event:location|58#LLI32G3NUTD100I\">Gregarious Grange<\/a> in <b>Groddle Meadow<\/b>, <a href=\"event:location|97#LA91JUQT2G82GUL\">Baeli Bray<\/a> in <b>Muufo<\/b>, or <a href=\"event:location|89#LA5I10NJDL52TKD\">Chego Chase<\/a> in <b>Andra<\/b>. Hint: You can avoid the 'red tape' by acquiring it from other players or at an <a href=\"event:external|http:\/\/www.glitch.com\/auctions\/\">Auction<\/a>.";
var offer = "Pssst. As all respectable citizens know, you must have <a href=\"event:item|your_papers\">Your Papers<\/a> in order to use public transportation. <split butt_txt=\"Oh?\" \/> That's right, but before you can 'complete' <b>Your Papers<\/b> you need to get and 'activate' the <a href=\"event:item|card_carrying_qualification\">Card Carrying Qualification<\/a>. <split butt_txt=\"Sounds complicated\" \/> Perhaps. But, you're in luck. I know a guy who knows a guy that can help you with your problem. Interested?";
var completion = "Congratulations! You have taken the first step toward Bureaucratic officialdom. <split butt_txt=\"Woohoo!\" \/> As with all first steps, there is a second, a third … <split butt_txt=\"Of course\" \/> Once you learn <a href=\"event:skill|bureaucraticarts_1\">Bureaucratic Arts I<\/a>, then get and 'complete' <a href=\"event:item|your_papers\">Your Papers<\/a>, you'll be able to use <b>public transportation<\/b>. Hint: You can also get <b>Your Papers<\/b> from other players or at <a href=\"event:external|http:\/\/www.glitch.com\/auctions\/\">Auction<\/a>. Off you go! <split butt_txt=\"Great, thanks!\" \/>";


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
var locations = {};
var requirements = {
	"r252"	: {
		"type"		: "flag",
		"name"		: "acquired_card_carrying_qualification",
		"class_id"	: "card_carrying_qualification",
		"desc"		: "Get Card Carrying Qualification"
	},
	"r253"	: {
		"type"		: "flag",
		"name"		: "ccq_completed",
		"class_id"	: "card_carrying_qualification",
		"desc"		: "Activate Card Carrying Qualification"
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
	favor = pc.stats_add_favor_points("ti", round_to_5(25 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"	: 100,
	"favor"	: {
		"0"	: {
			"giant"		: "ti",
			"points"	: 25
		}
	}
};

function onAccepted(pc){
	if (pc.items_has('card_carrying_qualification', 1)){
		pc.quests_set_flag('acquired_card_carrying_qualification');
	}
	
	if (pc.achievements_has('card_carrying_qualification')){
		pc.quests_set_flag('acquired_card_carrying_qualification');
		pc.quests_set_flag('ccq_completed');
	}
}

function onCreate(pc){
	this.offer_immediately = true;
}

function onStarted(pc){
	if (config.is_dev){
		var template_tsid = 'LHH10R15VQU1MLO';
	}
	else{
		var template_tsid = 'LIF177DTS6T1KFG';
	}
		
	pc.events_add({ callback: 'instances_create_delayed', tsid: template_tsid, instance_id: 'back_alley', x: 715, y: -73, exit_delay: 3*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("card_carrying_qualification.js LOADED");

// generated ok (NO DATE)
