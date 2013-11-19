var title = "Word Up";
var desc = "Create as many words as possible in three minutes. All the fun of spelling combined with the thrill of racing the clock!";
var offer = "Hey there, kid. <split butt_txt=\"Oh, hi.\" \/> Feel like playing a little game? <split butt_txt=\"Games are my favorite.\" \/> You're going to love this one. You get to spell. <split butt_txt=\"Ooh, I love spells!\" \/> Er, that's not quite what I meant. How about we just shrink you down and you start playing. You'll be re-embiggened when you're done, OK?";
var completion = "You did good, kid. <split butt_txt=\"I always do.\" \/>For humouring Mr. Block in this latest escapade, I'd like you to have a little extra something. <split butt_txt=\"Those are my favourite somethings.\" \/> Of course, they are! Here you go, kid.";


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
var prereq_quests = ["letter_block_2"];
var prerequisites = [];
var end_npcs = [];
var locations = {
	"kids_room"	: {
		"dev_tsid"	: "LM4101RTPU3KT",
		"prod_tsid"	: "LIF149EVS2A22H1"
	}
};

var requirements = {
	"r289"	: {
		"type"		: "flag",
		"name"		: "spell_words",
		"class_id"	: "quest_req_icon_letterblock",
		"desc"		: "Spell as many words as possible in three minutes"
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
	currants = pc.stats_add_currants(round_to_5(500 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	mood = pc.metabolics_add_mood(round_to_5(250 * multiplier));
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
	"currants"	: 500,
	"mood"		: 250
};

function callback_blockWantLeave(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'want_leave'});
}

function callback_createBlocks(details){
	this.owner.instances_cancel_exit_prompt('kids_room');
	this.owner.instances_schedule_exit_prompt('kids_room', 5*60);
	
	this.spelled_words = [];
	this.blocks = {};
	
	this.time_left = 180;
	
	var block = this.owner.location.createItemStackWithPoof('letter_block', 1, 300, -120);
	block.setInstanceProp('npc_name', 'block_3');
	block.setInstanceProp('can_change_letter', 'A,B,E,M,S,T');
	block.setInstanceProp('variant', 'B');
	this.blocks['block_3'] = 'B';
	
	block = this.owner.location.createItemStackWithPoof('letter_block', 1, 150, -120);
	block.setInstanceProp('npc_name', 'block_2');
	block.setInstanceProp('can_change_letter', 'A,B,E,M,S,T');
	block.setInstanceProp('variant', 'S');
	this.blocks['block_2'] = 'S';
	
	block = this.owner.location.createItemStackWithPoof('letter_block', 1, 0, -120);
	block.setInstanceProp('npc_name', 'block_1');
	block.setInstanceProp('can_change_letter', 'A,B,E,M,S,T');
	block.setInstanceProp('variant', 'M');
	this.blocks['block_1'] = 'M';
	
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_talk', value: null});
	
	details.pc.apiSendMsg({type: 'move_avatar', x: 150, y: -68, face: 'left'});
	this.spelling_words = true;
	this.startPuzzleOverlays();
}

function callback_finishQuest(details){
	this.owner.quests_set_flag('spell_words');
}

function callback_leaveInstance(details){
	details.pc.instances_exit('kids_room');
	this.stopOverlays();
}

function callback_letterChanged(details){
	this.blocks[details.npc_name] = details.letter;
	var word = this.blocks['block_1'] + this.blocks['block_2'] + this.blocks['block_3'];
	if(in_array(word, this.valid_words) && !in_array(word, this.spelled_words)) {
		this.spelled_words.push(word);
		log.info("New word: "+word+"!");
	//	this.updateWordOverlay();
	
		// Get actual word index and update the overlay for that word
		for (var i in this.valid_words) {
			if(this.valid_words[i] == word) {
				this.doSpellingOverlays(i);
			}
		}
	}
}

function callback_talkedToBlock(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'anagram_start'});
}

function callback_teaParty(details){
	if(!this.done_tea_party) {
		this.done_tea_party = true;
		this.sendNPCMessage('hidden_guy', 'itemstack_bubble', {txt: "I have a confession, friend Bear.", bubble_time: 3, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true});
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "The tea party is a time of unburdening, friend. Let your confession be heard.", bubble_time: 5, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 3);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Over the past several years, I feel I have lost my enthusiasm for the tea party.", bubble_time: 6, delta_x: -100, delta_y: -525, dont_keep_in_bounds: true}, 8);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "I also have a confession, friend Thing.", bubble_time: 3, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 14);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "It is unwise to trouble your soul with heavy thoughts.", bubble_time: 5, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 17);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Over the past several years I too have lost my enthusiasm for the tea party.", bubble_time: 6, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 23);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Let us be done with this ridiculous farce.", bubble_time: 3, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 29);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "The tea party is over.", bubble_time: 3, delta_x: 175, delta_y: -470, dont_keep_in_bounds: true}, 32);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Please pass the sugar.", bubble_time: 3, delta_x: -100, delta_y: -550, dont_keep_in_bounds: true}, 37);
	}
}

function destroyBlocks(){
	var blocks = this.owner.get_location().find_items('letter_block');
	
	for (var i in blocks) {
		blocks[i].apiDelete();
	}
}

function doneSpelling(){
	this.destroyBlocks();
	var num_words = num_keys(this.spelled_words);
	if (num_words <= 2) {
		this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'spelling_fail', pc: this.owner});
	} else if (num_words <= 9) {
		this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'done_spelling_1', pc: this.owner});
	} else if (num_words <= 19) {
		this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'done_spelling_3', pc: this.owner});
	} else {
		this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'done_spelling_5', pc: this.owner});
	}
	this.owner.apiSendMsg({type: 'move_avatar', x: 471, y: -68, face: 'right'});
	
	this.spelling_words = false;
}

function doSpellingOverlays(index){
	if(isNaN(index)) {
		for (var i in this.valid_words) {
			this.doSpellingOverlays(i);
		}
	} else {
		var column = intval(index / 12);
		var x_pos = (53 + column * 6) + '%';
		var y_pos = ((index % 12) * 4 + 25)+'%';
		this.owner.apiSendMsg({type: 'overlay_cancel', uid: 'word_'+index});
	
		if (in_array(this.valid_words[index], this.spelled_words)) {
			this.owner.apiSendAnnouncement({
				uid: 'word_'+index,
				type: "vp_overlay",
				width: 500,
				x: x_pos,
				top_y: y_pos,
				delay_ms: 0,
				click_to_advance: false,
				bubble_familiar: false,
				text: [
					'<p align="right"><span class="overlay_counter_small">'+this.valid_words[index]+'</span></p>'
				]
			});		
		} else {
			this.owner.apiSendAnnouncement({
				uid: 'word_'+index,
				type: "vp_overlay",
				width: 500,
				x: x_pos,
				top_y: y_pos,
				delay_ms: 0,
				click_to_advance: false,
				bubble_familiar: false,
				text: [
					'<p align="right"><span class="overlay_counter_small_disabled">???</span></p>'
				]
			});		
		}
	}
}

function onAccepted(pc){
	this.block_letter = choose_one(['A', 'B', 'E', 'M', 'S', 'T']);
	this.valid_words = ['TEA', 'TAB', 'TAT', 'SET', 'SEA', 'SAT', 'MET', 'MAT', 'MAS', 'ETA', 'EMS', 'EAT', 'BET', 'BAT', 'BAM', 'ATE', 'ABS', 'BEE', 'TEE', 'SEE', 'BAA', 'EBB', 'MAB', 'ATM'];
}

function onComplete_custom(pc){
	pc.instances_exit('kids_room');
}

function onEnterLocation(location){
	// determine a variant for the block
	this.sendNPCMessage('mr_block', 'set_hit_box', {x: 200, y: 100});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'variant', value: this.block_letter});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_leave', value: '1'});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_start', value: null});
	
	if(this.spelling_words) {
		this.startPuzzleOverlays();
	} else {
		this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_talk', value: '1'});
	}
}

function onExitLocation(location){
	this.owner.failQuest(this.class_tsid);
	this.talked_to_block = false;
	this.spelling_words = false;
	this.stopOverlays();
}

function onNpcCollision(pc, npc_name){
	if(npc_name == 'mr_block') {
		if(!this.talked_to_block) {
			this.talked_to_block = 'true';
			this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'anagrams', pc: pc});
		}
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'kids_room', -1528, -143, 5*60);
	this.spelled_words = [];
	
	return {ok: 1};
}

function startPuzzleOverlays(){
	this.owner.apiSendAnnouncement({
		uid: 'letterblock_header_words',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '60%',
		top_y: '15%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p align="right"><span class="overlay_counter">Words</span></p>'
		]
	});	
	this.owner.apiSendAnnouncement({
		uid: 'letterblock_header_time',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '3%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p align="center"><span class="overlay_counter">Time</span></p>'
		]
	});	
	
	
	this.updateTimeOverlay();
	this.doSpellingOverlays();
}

function stopOverlays(){
	this.owner.overlay_dismiss('letterblock_header_time');
	this.owner.overlay_dismiss('letterblock_header_words');
	this.owner.overlay_dismiss('letterblock_timer');
	for (var i in this.valid_words) {
		this.owner.overlay_dismiss('word_'+i);
	}
	this.apiCancelTimer('doTimeOverlay');
}

function updateTimeOverlay(){
	if (!this.spelling_words) {
		return;
	}
	
	var mins = intval(this.time_left / 60);
	var display_min = '0'+mins;
	
	var secs = this.time_left % 60;
	var display_sec = (secs > 9 ? "" : "0" ) + secs;
	
	var display_amt = display_min+":"+display_sec;
	
	this.owner.overlay_dismiss('letterblock_timer');
	this.owner.apiSendAnnouncement({
		uid: 'letterblock_timer',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '12%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p align="center"><span class="overlay_counter">'+display_amt+'</span></p>'
		]
	});		
	
	if(this.time_left) {
		this.time_left--;
		this.apiSetTimer('updateTimeOverlay', 1000);
	} else {
		this.stopOverlays();
		this.doneSpelling();
	}
}

//log.info("letter_block_3.js LOADED");

// generated ok (NO DATE)
