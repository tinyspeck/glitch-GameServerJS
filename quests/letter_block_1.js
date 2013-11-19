var title = "Child's Play";
var desc = "Get small and find Mr. Block. He's got a job for you.";
var offer = "Hey, kid. How do you feel about getting small? <split butt_txt=\"How small?\" \/> I won't lie to you. Pretty small. You'll be helping out a buddy of mine. We'll shrink you down to visit him, but don't worry. We'll get you out when you're done.";
var completion = "Lovely, lovely. That will do quite nicely. Now, wasn't that fun? <split butt_txt=\"It was OK.\"> Goodbye now. I must get back to my collection, but accept this as a token of my gratitude.";


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
var prereq_quests = ["de_embiggenify_part2"];
var prerequisites = [];
var end_npcs = ["npc_letterblock"];
var locations = {
	"kids_room"	: {
		"dev_tsid"	: "LM4101RTPU3KT",
		"prod_tsid"	: "LIF149EVS2A22H1"
	}
};

var requirements = {
	"r287"	: {
		"type"		: "flag",
		"name"		: "correct_letter_item",
		"class_id"	: "npc_letterblock",
		"desc"		: "Give Mr. Block an appropriately named item."
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
	"xp"	: 200
};

function callback_blockWantLeave(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {pc: details.pc, conversation: 'want_leave'});
}

function callback_correctItem(details){
	if(details.tsid) {
		var s = details.pc.removeItemStackTsid(details.tsid, 1);
		s.apiDelete();
	} else {
		details.pc.items_destroy(details.item_class, 1);
	}
	
	details.pc.quests_set_flag('correct_letter_item');
	this.sendNPCMessage('mr_block', 'offer_quest', {quest_id: 'letter_block_1', pc: details.pc});
}

function callback_incorrectItem(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'wrong_item', pc: details.pc});
}

function callback_leaveInstance(details){
	details.pc.instances_exit('kids_room');
}

function callback_noItems(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'no_items', pc: details.pc});
}

function callback_talkedToBlock(details){
	this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'letter_match_explain', pc: details.pc});
}

function callback_teaParty(details){
	if(!this.done_tea_party) {
		this.done_tea_party = true;
		this.sendNPCMessage('hidden_guy', 'itemstack_bubble', {txt: "This tea is delicious.", bubble_time: 3, delta_x: -100, delta_y: -500, dont_keep_in_bounds: true});
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Why, thank you. I try to make sure never to steep it for too long.", bubble_time: 5, delta_x: 175, delta_y: -420, dont_keep_in_bounds: true}, 3);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "You are a very gracious host.", bubble_time: 3, delta_x: -100, delta_y: -500, dont_keep_in_bounds: true}, 8);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "Yes, I am hosting a tea party.", bubble_time: 3, delta_x: 175, delta_y: -420, dont_keep_in_bounds: true}, 11);
		this.sendNPCMessageDelayed('hidden_guy', 'itemstack_bubble', {txt: "We are having fun.", bubble_time: 3, delta_x: -100, delta_y: -500, dont_keep_in_bounds: true}, 14);
	}
}

function onAccepted(pc){
	this.block_letter = choose_one(['A', 'B', 'E', 'M', 'S', 'T']);
	this.valid_words = ['TEA','TAB','SET','SEA','SAT','MET','MAT','MAS','ETA','EMS','EAT','BET','BAT','BAM','ATE','ABS','BEE','TEE','BAA'];
}

function onComplete_custom(pc){
	pc.instances_exit('kids_room');
}

function onEnterLocation(location){
	// determine a variant for the block
	this.sendNPCMessage('mr_block', 'set_hit_box', {x: 200, y: 100});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'variant', value: this.block_letter});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_receive', value: '1'});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_leave', value: '1'});
	this.sendNPCMessage('mr_block', 'set_instance_prop', {prop: 'can_talk', value: '1'});
}

function onExitLocation(location){
	this.owner.failQuest(this.class_tsid);
}

function onNpcCollision(pc, npc_name){
	if(npc_name == 'mr_block') {
		if(!this.talked_to_block) {
			this.talked_to_block = 'true';
			this.sendNPCMessage('mr_block', 'conversation_start', {conversation: 'blocks_request', pc: pc});
		}
	}
}

function onStarted(pc){
	this.questInstanceLocation(pc, 'kids_room', -1528, -143, 5*60);
	
	return {ok: 1};
}

//log.info("letter_block_1.js LOADED");

// generated ok (NO DATE)
