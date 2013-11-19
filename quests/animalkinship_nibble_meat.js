var title = "Get a Rasher";
var desc = "Successfully obtain 13 <a href=\"event:item|meat\">Meat<\/a> from 13 <a href=\"event:item|npc_piggy\">Piggies<\/a>, all in one nibbly game day.";
var offer = "<a href=\"event:item|npc_piggy\">Piggies<\/a> are smarter than dogs you know. <split butt_txt=\"What's a dog?\" \/>Er, never mind that now. Just find yourself 13 different <b>Piggies<\/b>, and nibble them ever so gently to get 13 <a href=\"event:item|meat\">Meat<\/a>. <split butt_txt=\"Ever so gently, I will nibble.\" \/>And don't forget to pet them first. Just because they're animals doesn't mean they don't appreciate the niceties.";
var completion = "Wow. Thirteen piggies nibbled in one day. That is a lot of Meats. <split butt_txt=\"What can I say?\" \/>You can say \"Nice job, self!\" Here's a little something. Go buy yourself some shopping things.";


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
var prereq_quests = ["animalkinship_pet_piggies"];
var prerequisites = [];
var end_npcs = [];
var locations = {};
var requirements = {
	"r178"	: {
		"type"		: "counter",
		"name"		: "meats_collected_from_pigs",
		"num"		: 13,
		"class_id"	: "meat",
		"desc"		: "Collect Meat"
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
	xp = pc.stats_add_xp(round_to_5(175 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(120 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("humbaba", round_to_5(15 * multiplier));
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
	"xp"		: 175,
	"currants"	: 120,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "humbaba",
			"points"	: 15
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('get_a_rasher');
}

function onStarted(pc){
	pc.buffs_apply('get_a_rasher');
	
	return { ok: 1 };
}

//log.info("animalkinship_nibble_meat.js LOADED");

// generated ok (NO DATE)
