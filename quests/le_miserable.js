var title = "Le Misérable";
var desc = "Visit the Fireflex 3000 Lab once more.";
var offer = "Do you remember the future of one of our pasts? Or was it the past of one of our futures? <split butt_txt=\"I'm not entirely sure.\" \/> Either way, that Fireflex 3000 Lab had more secrets to reveal than you've uncovered so far. You should explore it a little more.<split butt_txt=\"OK\" \/> I can't be sure which part you'll end up in, but it's worth a look. Want to go now?";
var completion = "Oh, little Glitch. What are you doing down here? <split butt_txt=\"Not really sure …\" \/>";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = ["firefly_whistle"];
var prerequisites = [{
		"not"		:0,
		"condition":	"custom_code",
		"value":	function(pc, quest){var firefly_whistle = pc.getQuestInstance('firefly_whistle');
if (firefly_whistle && firefly_whistle.isDone()){
	if (time() - firefly_whistle.ts_done >= 10*24*60*60) return true;
}

return false;}
}];
var end_npcs = ["npc_maintenance_bot"];
var locations = {
	"le_miserable"	: {
		"dev_tsid"	: "LRO103GD8S732F7",
		"prod_tsid"	: "LIFMMN6E7A73R0T"
	}
};

var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
}
var rewards = {};

function canOffer(pc){
	// Also repeatable only once every hour
	if (this.ts_done && time() - this.ts_done < 60*60) return false;
	if (this.fail_time && time() - this.fail_time < 60*60) return false;
	
	return true;
}

function onExitLocation(location){
	var pc = this.owner;
	if (!pc) return;
	
	var part2 = pc.getQuestInstance('le_miserable_part_2');
	
	if (!part2 || !part2.is_complete){
		this.fail_time = time();
		pc.failQuest(this.class_tsid);
	
		pc.quests_fail_and_remove('le_miserable_part_2');
		
		pc.instances_exit('le_miserable');
	}
}

function onStarted(pc){
	pc.quests_fail_and_remove('le_miserable_part_2');
	this.questInstanceLocation(pc, 'le_miserable', -1873, -167, 5*60, {preserve_links: true});
	
	return {ok: 1};
}

//log.info("le_miserable.js LOADED");

// generated ok (NO DATE)
