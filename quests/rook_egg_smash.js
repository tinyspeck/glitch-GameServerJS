var title = "Prove Your Rook-Fighting Mettle";
var desc = "Find and smash a rook Egg. I will teleport you in to the Rooks' Woods when you are ready. Beware: they often protect their nests … (You need a <a href=\"event:item|pick\">Pick<\/a>, <a href=\"event:item|fancy_pick\">Fancy Pick<\/a> or a <a href=\"event:item|hatchet\">Hatchet<\/a> to start this quest.)";
var offer = "Let's get serious. Really serious.<split butt_txt=\"Always\" \/>The Rook threatens us all and you are getting to the age where you can help in the fight.<split butt_txt=\"I do feel older\" \/>As a test run, I need you to infiltrate the Rooks' Woods and smash one of their eggs.";
var completion = "Well done, well done! It's only one egg, but every one makes a difference. I will call on you again to continue your training when you seem ready for the next step.<split butt_txt=\"OK\" \/>But for now, let's get you out of here …";


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
	"r240"	: {
		"type"		: "flag",
		"name"		: "rook_egg_smashed",
		"class_id"	: "rook_egg",
		"desc"		: "Smash the Rook Egg"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
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
	"xp"		: 1000,
	"currants"	: 500,
	"mood"		: 200,
	"energy"	: 50
};

function onComplete_custom(pc){
	pc.events_add({callback: 'instances_exit_delayed', id:'humbaba'}, 2.5);
}

function onStarted(pc){
	function is_tool(stack){ return in_array(stack.class_tsid, ['pick', 'fancy_pick', 'hatchet']) && stack.isWorking(); }
	var tool = pc.items_has(is_tool, 1);
	if (!tool){
		return {
			ok: 0,
			error: 'You need a working Pick, Fancy Pick, or Hatchet to smash the Egg.'
		};
	}
	
	if (config.is_dev){
		var tsid = 'LHH101LMK7O11EP';
	}
	else{
		var tsid = 'LLI1AD8LUCH109E';
	}
		
	pc.events_add({ callback: 'instances_create_delayed', tsid: tsid, instance_id: 'humbaba', x: -1319, y: -123, exit_delay: 2*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("rook_egg_smash.js LOADED");

// generated ok (NO DATE)
