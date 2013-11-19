var title = "Le Misérable II";
var desc = "Turn on the machine for the maintenance bot.";
var offer = "This part of the Lab was perhaps a bad choice. As you can see, there is No Exit. <split butt_txt=\"Shoot\" \/> I myself have been stuck here for … one million seven hundred and thirty nine thousand eight hundred and fifty one years :( :( :(  <split butt_txt=\"Wow\" \/> But you're shrinkable (lucky!). If you can fit yourself through that crawl space you might be able to get out on the other side.<split butt_txt=\"OK\" \/>";
var completion = "Well, you did it. Bully for you. And … sucks to be me. As usual. <split butt_txt=\":\\\" \/> No sense sticking around — I'm used to it here. You should keep going. <split butt_txt=\"OK\" \/> There's another one of those machines on the other side of the crawl space. It should make you big again. Bye … <split butt_txt=\"Bye\" \/>";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_repeatable = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["le_miserable"];
var prerequisites = [];
var end_npcs = ["npc_maintenance_bot"];
var locations = {
	"Le Miserable"	: {
		"dev_tsid"	: "LRO103GD8S732F7",
		"prod_tsid"	: "LIFMMN6E7A73R0T"
	}
};

var requirements = {
	"r500"	: {
		"type"		: "flag",
		"name"		: "turn_on_machine",
		"class_id"	: "teleporter_button",
		"desc"		: "Turn on the Machine"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
	energy = pc.metabolics_add_energy(round_to_5(100 * multiplier));
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
	"currants"	: 500,
	"mood"		: 250,
	"energy"	: 100
};

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
		
	if (!this.is_complete){
		pc.failQuest('le_miserable');
		
		pc.quests_fail_and_remove(this.class_tsid);
			
		pc.instances_exit('le_miserable');
	}
}

//log.info("le_miserable_part_2.js LOADED");

// generated ok (NO DATE)
