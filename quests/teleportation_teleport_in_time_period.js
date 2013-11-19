var title = "Fear of Flying";
var desc = "Teleport five times in 30 minutes.";
var offer = "Hey! What's with the face? Oh… you've heard the rumours and you're worried about the dangers of speed teleportation. That's it, right? <split butt_txt=\"Huh? What? No? What?!?\" \/>Oh, you've <b>not<\/b> heard the rumours? Oh. Um. Well, regardless, Fly, you've nothing to worry about. <split butt_txt=\"I didn't think I…\" \/> Just to prove it, try teleporting <b>five times in 30 minutes<\/b>. Sure, you might experience some side effects of teleportation, but nothing TOO weird…";
var completion = "Look! Here you are! And let me just check. Two arms… yup. Legs… two, yup. Livers… all of them… yup. Nose? Well, as long as you're happy that's the one you came in with… <split butt_txt=\"Hey! What are you…\" \/> Good job, Fly. You deserve a little boost after all that.";


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
	"r328"	: {
		"type"		: "counter",
		"name"		: "teleportation_count",
		"num"		: 5,
		"class_id"	: "quest_req_icon_teleport",
		"desc"		: "Teleport five times"
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
	xp = pc.stats_add_xp(round_to_5(450 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(200 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(45 * multiplier));
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
	"xp"		: 450,
	"currants"	: 200,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 45
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('teleportation_teleport_in_time_period');
}

function onStarted(pc){
	pc.buffs_apply('teleportation_teleport_in_time_period');
	
	return {ok: 1};
}

function sendGrowl(pc){
	// this gets called before the quest counter gets incremented.
	var number = pc.quests_get_counter('teleportation_teleport_in_time_period', 'teleportation_count');
	
	switch (number){
		case 0: pc.sendActivity('Phew. One teleport down. Lucky for you a good tailwind was behind you all the way.'); break;
		case 1: pc.sendActivity('Your luggage is somewhere called "Gdansk". But at least you landed safely, right?'); break;
		case 2: pc.sendActivity('Ooh, rough landing. You might want to think about putting your flaps down a little earlier, Ace.'); break;
		case 3: pc.sendActivity('I don\'t remember giving you clearance to land, Goose. What are you, some kind of Maverick?'); break;
		case 4: pc.sendActivity('You made it! Talk about taking my breath away, kid…'); break;
	}
}

//log.info("teleportation_teleport_in_time_period.js LOADED");

// generated ok (NO DATE)
