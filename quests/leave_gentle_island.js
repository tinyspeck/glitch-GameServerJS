var title = "On to the Big Time";
var desc = "Find your way off Gentle Island and into the real world.";
var offer = "Kid, you are about ready to see what the world has to offer: plumb the depths of Ilmenskie Caverns, ascend the heights of Rasana and fly through the trees of Roobrik ... there's a lot to explore!<split butt_txt=\"Sounds like it\" \/>The way off Gentle Island is pretty easy to find. Find it. Take it. Do it!!";
var completion = "You made it kid! Congrats!<split butt_txt=\"Thanks!\" \/>Take it easy, just explore and ask for help when you need it. You'll be fine.<split butt_txt=\"I will\" \/>Oh, and here's a little something to help you out …";


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
	"r366"	: {
		"type"		: "flag",
		"name"		: "leave_gentle_island",
		"class_id"	: "sign_stake",
		"desc"		: "Leave Gentle Island"
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
	xp = pc.stats_add_xp(round_to_5(300 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
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
	"xp"		: 300,
	"currants"	: 500,
	"mood"		: 100,
	"energy"	: 100
};

function onComplete_custom(pc){
	// Do a callback
	pc.apiSetTimer('doNewxpCompleteCallback', 15*60*1000);
	
	if (!pc.isBagFull()){
		pc.announce_vog_fade("Lo, a relic of the Island came along with you!", {delay_ms: 2000, css_class: 'nuxp_big', fade_alpha: 0.7, y: '32%', done_payload: {function_name: 'newxpGiveGreeterTwig'}});
		pc.announce_vp_overlay({
			uid: 'greeter_twig',
			state: 'iconic',
			width: 100,
			item_class: 'greeter_twig',
			delay_ms: 2000,
			x: '50%',
			y: '65%'
		});
	}
}

//log.info("leave_gentle_island.js LOADED");

// generated ok (NO DATE)
