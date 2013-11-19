var title = "Machine Shop Pit Stop";
var desc = "Fully Assemble and Disassemble any Machine in 2 minutes. (See the <a href=\"event:item|machine_stand\">Machine Stand<\/a> encyclopedia page for which machine types exist and what parts they require.)";
var offer = "Quick quick quick quick! <split butt_txt=\"What what what whatwhat?!?\" \/> I need to know, kid, if push came to shove, if we were down to the wire, up against the wall, against the clock, two sheets to the wind, between a rock and a hard place, could you fully assemble and disassemble a Machine in <b>under 2 minutes<\/b>?!? <split butt_txt=\"What?!? I don't know! I've never…\" \/> Well could you at least TRY? See the <a href=\"event:item|machine_stand\">Machine Stand<\/a> page for how to get the machine parts, and click on <b>Try it<\/b> in quest log when you're ready!";
var completion = "You passed the test, kid. You passed the mustard. Imagine there was a big pot of mustard just there? Well, you just passed it. <split butt_txt=\"I think it's 'muster'.\" \/> Don't be ridiculous, that's not even a word. <split butt_txt=\"Well, actually, it means…\" \/> Whatever kid. You want your reward, or not?";


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
	"r323"	: {
		"type"		: "flag",
		"name"		: "machine_shop_pit_stop_complete",
		"class_id"	: "blockmaker",
		"desc"		: "Assemble and Disassemble a Machine"
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
	xp = pc.stats_add_xp(round_to_5(500 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(300 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(50 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(50 * multiplier));
	favor = pc.stats_add_favor_points("alph", round_to_5(50 * multiplier));
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
	"xp"		: 500,
	"currants"	: 300,
	"mood"		: 50,
	"energy"	: 50,
	"favor"		: {
		"0"	: {
			"giant"		: "alph",
			"points"	: 50
		}
	}
};

function onAssembled(pc){
	if (!this.machine_data) { log.info(pc+" - MSPS onAssembled - no data"); return false; }
	this.machine_data['assembled'] = true;
	
	log.info(pc+" - MSPS onAssembled");
}

function onAssemblyStart(pc){
	if (!this.machine_data) this.machine_data = {};
	
	log.info(pc+" - MSPS onAssemblyStart (data initialized)");
}

function onComplete_custom(pc){
	pc.buffs_remove('machine_shop_pit_stop_in_time_period');
	delete this.machine_data;
}

function onDisassembled(pc){
	if (!this.machine_data) { log.info(pc+" - MSPS onDisassembled - no data"); return false; }
	if (!this.machine_data['assembled']) { log.info(pc+" - MSPS onDisassembled - not assembled"); return false; }
	
	this.owner.quests_set_flag('machine_shop_pit_stop_complete');
	
	log.info(pc+" - MSPS onDisassembled - quest complete");
}

function onFailed(pc){
	if (this.machine_data) delete this.machine_data;
	
	log.info(pc+" - MSPS failed");
}

function onStarted(pc){
	pc.buffs_apply('machine_shop_pit_stop_in_time_period');
	
	return {ok: 1};
}

//log.info("engineering_assemble_machine.js LOADED");

// generated ok (NO DATE)
