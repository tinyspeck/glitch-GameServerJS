var title = "Smuggle the Smuggler";
var desc = "Go help the wrongfully imprisoned Smuggler.";
var offer = "I've got a job that needs doing. A dangerous job that needs doing.<split butt_txt=\"Danger? Danger is my middle name.\" \/>I thought it was Susan? Anyways, a friend of ours has been wrongfully imprisoned for the transport of contraband and needs to be freed. This will require sneaking into the cell and breaking him out somehow. You up for it?<split butt_txt=\"Sounds kind of dangerous...\" \/>You can do it, Susan!<split butt_txt=\"Okay!\" \/>";
var completion = "They got you too? I'm innocent, I tell you! It was all a set up.<split butt_txt=\"Of course. We're all innocent.\" \/>";


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
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_rare_item_vendor"];
var locations = {};
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

function onStarted(pc){
	function is_tool(stack){ return in_array(stack.class_tsid, ['shovel', 'ace_of_spades']) && stack.isWorking(); }
	var tool = pc.items_has(is_tool, 1);
	if (!tool){
		return {
			ok: 0,
			error: 'You need some sort of tool to help you out. You dig?'
		};
	}
	
	if (config.is_dev){
		var tsid = 'LRO10390SI63T7N';
	}
	else{
		var tsid = 'LUVGFS2RQI63N49';
	}
		
	pc.events_add({ callback: 'instances_create_delayed', tsid: tsid, instance_id: 'penalty', x: -1319, y: -123, exit_delay: 2*60}, 0.1);
	
	return { ok: 1 };
}

//log.info("smuggle_the_smuggler_part1.js LOADED");

// generated ok (NO DATE)
