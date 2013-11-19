var title = "Four Letter Words";
var desc = "Get small and help Mr. Block spell some four-letter words. Not the naughty kind.";
var offer = "Hey, kid. You seem pretty bright. I've got a friend who, frankly, is kind of a blockhead. Want to lend him some brain power? <split butt_txt=\"Sure!\" \/> We're going to have to shrink you down to meet him. We'll re-embiggen you when you're done, OK?";
var completion = "He's going to be staring at those blocks for days. <split butt_txt=\"Yeah. Probably.\" \/> It was big of you to help him, even if he's a bit of a square.<split butt_txt=\"Don't mention it.\" \/>All right, I'll let this reward do the talking.";


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
	"kids_room"	: {
		"dev_tsid"	: "LM4101RTPU3KT",
		"prod_tsid"	: "LIF149EVS2A22H1"
	}
};

var requirements = {
	"r288"	: {
		"type"		: "counter",
		"name"		: "riddles_solved",
		"num"		: 3,
		"class_id"	: "quest_req_icon_letterblock",
		"desc"		: "Solve Mr. Block's riddles"
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
	mood = pc.metabolics_add_mood(round_to_5(200 * multiplier));
	favor = pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
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
	"mood"		: 200,
	"favor"		: {
		"0"	: {
			"giant"		: "lem",
			"points"	: 50
		}
	}
};

function callback_blockWantLeave(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'want_leave'});
}

function callback_createBlocks(details){
	this.blocks = {};
	
	var block = this.owner.location.createItemStackWithPoof('letter_block', 1, 300, -120);
	block.setInstanceProp('npc_name', 'block_4');
	block.setInstanceProp('letters', 'T,E,B');
	block.setInstanceProp('variant', 'E');
	this.blocks['block_4'] = 'E';
	
	block = this.owner.location.createItemStackWithPoof('letter_block', 1, 150, -120);
	block.setInstanceProp('npc_name', 'block_3');
	block.setInstanceProp('letters', 'A,M,S');
	block.setInstanceProp('variant', 'M');
	this.blocks['block_3'] = 'M';
	
	block = this.owner.location.createItemStackWithPoof('letter_block', 1, 0, -120);
	block.setInstanceProp('npc_name', 'block_2');
	block.setInstanceProp('letters', 'E,A,S');
	block.setInstanceProp('variant', 'S');
	this.blocks['block_2'] = 'S';
	
	block = this.owner.location.createItemStackWithPoof('letter_block', 1, -150, -120);
	block.setInstanceProp('npc_name', 'block_1');
	block.setInstanceProp('letters', 'M,T,B');
	block.setInstanceProp('variant', 'B');
	this.blocks['block_1'] = 'B';
	
	details.pc.apiSendMsg({type: 'move_avatar', x: 75, y: -68, face: 'left'});
}

function callback_leaveInstance(details){
	details.pc.instances_exit('kids_room');
}

function callback_letterChanged(details){
	this.blocks[details.npc_name] = details.letter;
	var word = this.blocks['block_1'] + this.blocks['block_2'] + this.blocks['block_3'] + this.blocks['block_4'];
	if(this.current_riddle == 1 && word == 'MAST') {
		this.callback_solveRiddle();
		this.sendNPCMessage('mr_block', 'conversation_start', {pc: this.owner, conversation: 'four_letter_word_2'});
		this.owner.apiSendMsg({type: 'move_avatar', x: 471, y: -68, face: 'right'});
	} else if(this.current_riddle == 2 && word == 'TAME') {
		this.callback_solveRiddle();
		this.sendNPCMessage('mr_block', 'conversation_start', {pc: this.owner, conversation: 'four_letter_word_3'});
		this.owner.apiSendMsg({type: 'move_avatar', x: 471, y: -68, face: 'right'});
	} else if(this.current_riddle == 3 && word == 'BEAT') {
		this.sendNPCMessage('mr_block', 'conversation_start', {pc: this.owner, conversation: 'spelled_word'});
		this.owner.apiSendMsg({type: 'move_avatar', x: 471, y: -68, face: 'right'});
	}
}

function callback_solveRiddle(details){
	this.owner.quests_inc_counter('riddles_solved', 1);
	this.current_riddle++;
}

function callback_talkedToBlock(details){
	switch (this.current_riddle) {
		case 1:
			this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'riddle_explain'});
			break;
		case 2:
			this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'riddle_explain_2'});
			break;
		case 3:
			this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'riddle_explain_3'});
			break;
	}
}

function callback_teaParty(details){
	if(!this.done_tea_party) {
		this.done_tea_party = true;
		this.sendNPCMessage('hidden_guy', 'itemstack_bubble', {txt: "The tea party is lovely today.", bubble_time: 5, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true});
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Yes. What is your favourite kind of tea?", bubble_time: 3, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 3);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "I'm glad you asked. My favourite kind of tea is every kind of tea.", bubble_time: 5, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 6);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "What a coincidence as that is also my favourite.", bubble_time: 5, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 11);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "It is good to have a tea party.", bubble_time: 3, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 16);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Yes, we should always have a tea party.", bubble_time: 3, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 19);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "The tea party will never stop.", bubble_time: 3, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 22);
	}
}

function onAccepted(pc){
	this.block_letter = choose_one(['A', 'B', 'E', 'M', 'S', 'T']);
	this.talked_to_block = false;
}

function onComplete_custom(pc){
	pc.instances_exit('kids_room');
}

function onEnterLocation(location){
	// determine a variant for the block
	this.sendNPCMessage('mr_block', 'set_hit_box', {x: 200, y: 100});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'variant', value: this.block_letter});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_talk', value: '1'});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_leave', value: '1'});
	
	this.current_riddle = 1;
}

function onExitLocation(location){
	this.owner.failQuest(this.class_tsid);
	this.talked_to_block = false;
}

function onNpcCollision(pc, npc_name){
	if(npc_name == 'mr_block') {
		if(!this.talked_to_block) {
			this.talked_to_block = 'true';
			this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'four_letter_word', pc: pc});
		}
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'kids_room', -1528, -143, 5*60);
	
	return {ok: 1};
}

//log.info("letter_block_2.js LOADED");

// generated ok (NO DATE)
