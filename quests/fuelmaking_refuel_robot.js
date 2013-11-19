var title = "We're Off to See the Lizard";
var desc = "Contribute some strictly off-the-record Fuelmaking support to a shady bureaucrat: make a Fuel cell and use it to refuel a Maintenance Bot in any Subway Station.";
var offer = "<i>psst, kid. hey. hey, kid. psst. hey. fuelmaking.<\/i><split butt_txt=\"Why are you talking like that?\" \/>\r\nA friend of mine wants to ask you for a <b>Fuelmaking<\/b> favour. He told me to ask you on ‘the down low,’ only I don’t know what that is. I think that means I’m supposed to be crouching, but I don’t have any legs, so I’m trying a sort of verbal crouch. It’s harder than it sounds.<split butt_txt=\"I believe it.\" \/>I don’t exaggerate, kid. Anyway, this friend—or more of an acquaintance, really, or an acquaintance of an acquaintance—has asked to meet in an undisclosed location, for maximum secrecy. “Come alone,” he said.<split butt_txt=\"Sounds legit.\" \/>See, I don’t understand what that means either. Does it mean you’re in?";
var completion = "Good work, kid!<split butt_txt=\"Thanks.\" \/>And now there’s a bureaucrat out there who owes you a favour. Might come in handy someday, you know. Speaking of handy, the Bureaucracy sent you a little something for helping out.";


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
var locations = {
	"back_alley"	: {
		"dev_tsid"	: "LHH10R15VQU1MLO",
		"prod_tsid"	: "LIF177DTS6T1KFG"
	}
};

var requirements = {
	"r333"	: {
		"type"		: "flag",
		"name"		: "talk_to_bureaucrat",
		"class_id"	: "npc_bureaucrat",
		"desc"		: "Speak to the Shady Bureaucrat"
	},
	"r352"	: {
		"type"		: "flag",
		"name"		: "made_fuel_cell",
		"class_id"	: "fuelmaker",
		"desc"		: "Make a Fuel Cell"
	},
	"r353"	: {
		"type"		: "flag",
		"name"		: "refuel_bot",
		"class_id"	: "fuel_cell",
		"desc"		: "Refuel a Subway Maintenance Bot"
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
	xp = pc.stats_add_xp(round_to_5(1000 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(600 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 1000,
	"currants"	: 600,
	"mood"		: 100,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 100
		}
	}
};

function onExitLocation(location){
	if (!this.get_flag("talk_to_bureaucrat")) { 
		log.info("Lizard quest fail");
		this.owner.failQuest(this.class_tsid);
	}
}

function onStarted(pc){
	if (config.is_dev){
		var template_tsid = 'LHH10R15VQU1MLO';
	}
	else{
		var template_tsid = 'LIF177DTS6T1KFG';
	}
	
	pc.back_alley_business = 'fuelmaking';	
	pc.events_add({ callback: 'instances_create_delayed', tsid: template_tsid, instance_id: 'back_alley', x: 715, y: -73, exit_delay: 3*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("fuelmaking_refuel_robot.js LOADED");

// generated ok (NO DATE)
