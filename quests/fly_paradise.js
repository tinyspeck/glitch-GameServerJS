var title = "Up up and away!";
var desc = "Use 3 tickets to goto <a href=\"event:item|paradise_ticket_starlit_night\">Starlit Night<\/a>, <a href=\"event:item|paradise_ticket_cloud_rings\">Cloud Rings<\/a>, and <a href=\"event:item|paradise_ticket_abysmal_thrill\">Abysmal Thrill<\/a> where gravity has been  obsfucated by the Dark Energy of the Rooks.";
var offer = "Gravity getting you down? <split butt_txt=\"Umm, I guess it does..\" \/>  \r\nEver wonder how the Dark Energy of the Rooks effect Ur? <split butt_txt=\"Not yet, but I bet  you're going to tell me? \" \/>   That's the ticket! Rook attacks often leave a dark residue adrift in the twirling mass of the giants imagination repelling the self-attraction of Ur.  But there's some good news. <split butt_txt=\"Good, I needed something uplifting \" \/>  The giants have imagined wonderful lands surrounding this residue where gravity can't get you down!  Get upgrade tickets and travel to  <a href=\"event:item|paradise_ticket_starlit_night\">Starlit Night<\/a>, <a href=\"event:item|paradise_ticket_cloud_rings\">Cloud Rings<\/a>, and <a href=\"event:item|paradise_ticket_abysmal_thrill\">Abysmal Thrill<\/a>.  If you've been there before, then it's always better a second or third or fourth time!";
var completion = "Great work, a ticket to fly can really bring you up when you're feeling down.  Believe it or not you were walking on air! <split butt_txt=\"Umm I guess I never thought I could feel so free? .. I don't know why I said that!  \" \/> Here's something to give your arms a little lift.";


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
		"value":	14
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r410"	: {
		"type"		: "flag",
		"name"		: "VERB:paradise_ticket_abysmal_thrill:activate",
		"class_id"	: "paradise_ticket_abysmal_thrill",
		"desc"		: "Goto abysmal thrill"
	},
	"r412"	: {
		"type"		: "flag",
		"name"		: "VERB:paradise_ticket_cloud_rings:activate",
		"class_id"	: "paradise_ticket_cloud_rings",
		"desc"		: "Goto cloud rings"
	},
	"r414"	: {
		"type"		: "flag",
		"name"		: "VERB:paradise_ticket_starlit_night:activate",
		"class_id"	: "paradise_ticket_starlit_night",
		"desc"		: "Goto starlit night"
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
	xp = pc.stats_add_xp(round_to_5(200 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(100 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(100 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(100 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 200,
	"currants"	: 100,
	"mood"		: 100,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 100
		}
	}
};

//log.info("fly_paradise.js LOADED");

// generated ok (NO DATE)
