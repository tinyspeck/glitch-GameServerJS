var title = "Another Day Older and Deeper In Debt";
var desc = "Use your <a href=\"event:item|pick\">Pick<\/a> or <a href=\"event:item|fancy_pick\">Fancy Pick<\/a> to wear 5 <b>Rocks<\/b> down to nary a nub in just one game day.";
var offer = "If you were to be able to <b>Mine<\/b> your way through 5 entire <b>Rocks<\/b> in just one game day, I think we'd have to come up with a cool nickname for you. Any thoughts? <split butt_txt=\"How's about Rock Star?\" \/> How's about we let you stick to digging and I'll stick to naming things? Get pickin'.";
var completion = "Woo! You just whaled through 5 Rocks in one day! I think I'm going to call you Igneous Ike. <split butt_txt=\"Best you could come up with?\" \/> I'M TIRED. Here. I'll give you this little reward, you keep quiet about my little lapse of wit. <split butt_txt=\"A bribe?\" \/> Let's call it a consultant fee.";


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
	"r215"	: {
		"type"		: "counter",
		"name"		: "mining_clear_rock",
		"num"		: 5,
		"class_id"	: "pick",
		"desc"		: "Wear 5 <b>Rocks<\/b> down"
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
	xp = pc.stats_add_xp(round_to_5(600 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(400 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("zille", round_to_5(60 * multiplier));
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
	"xp"		: 600,
	"currants"	: 400,
	"energy"	: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "zille",
			"points"	: 60
		}
	}
};

function onComplete_custom(pc){
	pc.buffs_remove('mining_deplete_rocks_in_time_period');
}

function onStarted(pc){
	pc.buffs_apply('mining_deplete_rocks_in_time_period');
	
	return { ok: 1 };
}

//log.info("mining_deplete_rocks_in_time_period.js LOADED");

// generated ok (NO DATE)
