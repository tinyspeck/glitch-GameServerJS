//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Sloth";
var version = "1354519797";
var name_single = "Sloth";
var name_plural = "Sloths";
var article = "a";
var description = "Slow-moving, metal-loving, laid-back, rod-eating and snail-spitting the Sloth is not, contrary to popular opinion, lovable and lazy. The sloth is merely conserving energy. What for? The sloth will not say. Fear the sloth.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_sloth", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_offset_y"	: "500",	// defined by npc_sloth
	"conversation_offset_x"	: "500"	// defined by npc_sloth
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.head = "redBandana";	// defined by npc_sloth
	this.instanceProps.jacket = "darkJacket";	// defined by npc_sloth
	this.instanceProps.rod = "rod1";	// defined by npc_sloth
	this.instanceProps.dir = "right";	// defined by npc_sloth
	this.instanceProps.hitbox_extension = "0";	// defined by npc_sloth
	this.instanceProps.width = "300";	// defined by npc_sloth
	this.instanceProps.height = "200";	// defined by npc_sloth
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	head : [""],
	jacket : [""],
	rod : [""],
	dir : [""],
	hitbox_extension : ["The amount to extend the hitbox on the bottom (for high trees)"],
	width : ["Width of hitbox"],
	height : ["Height of hitbox"],
};

var instancePropsChoices = {
	ai_debug : [""],
	head : ["none","redBandana","blueBandana"],
	jacket : ["none","darkJacket","lightJacket"],
	rod : ["none","rod1","rod2","rod3","rod4","rod5","rod6","rod7"],
	dir : ["right","left"],
	hitbox_extension : [""],
	width : [""],
	height : [""],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.feed = { // defined by npc_sloth
	"name"				: "feed",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Feed Sloth a Metal Rod to create some Snails",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_id == 'metal_rod');
	},
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		if (this.new_xp) return {state:null};

		if (!pc.items_has('metal_rod', 1)){
			return {state:'disabled', reason: "You don\'t have any metal rods!"};
		}

		if (this.is_metalizing){
			return {state:'disabled', reason:'I\'m busy, you fool!'};
		}

		if (this.state != 'hangIdle1' && this.state != 'hangIdle2' && this.state != 'talk' && this.state != 'drop' && this.state != 'finishedEating' && this.state != 'devil') return {state:'disabled', reason:'I\'m not available right now.'};

		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		if (pc.items_has('metal_rod', 1)){
			return {
				'ok' : 1,
				'choices' : ['metal_rod'],
			};
		}else{
			pc.sendActivity("You don\'t have any Metal Rods!");
			return {
				'ok' : 0,
				'txt' : "You don\'t have any Metal Rods!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.is_hiding) return false;

		if (!pc.skills_has('animalkinship_3')){
			this.talk('Hey, you\'re not metal enough to offer me a rod. You must first learn Animal Kinship 3.', 5*1000);
			return;
		}

		if (msg.target_item_class || msg.target_itemstack_tsid){
			pc.announce_sound('CHOOSE_ROD');
			this.setInstanceProp('rod', 'rod1');
			this.broadcastConfig();

			this.setState('eating');
			this.is_metalizing = true;
			
			var stack;
			if (msg.target_itemstack_tsid){
				stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
				if (!stack){
					stack = apiFindObject(msg.target_itemstack_tsid);
				}
			}
			else{
				stack = pc.removeItemStackClass(msg.target_item_class, 1);
			}

			if (stack){
				stack.apiDelete();

				this.apiCancelTimer('hideSloth');

				if (!this.metalize_count) this.metalize_count = 0;
				this.metalize_count++;

				var max = choose_one([7, 8, 9, 10]);
				var chew_secs = choose_one([2, 3, 4, 5]);
				this.apiSetTimerX('createSnail', chew_secs * 1000, pc, 0, max);

				this.feeder = pc;

				// Achievement check
				var sloths = pc.location.find_items("npc_sloth", null);
				var count = 0;
				for (var s in sloths) { 
					if (sloths[s].feeder === pc) { 
						count ++;
					}
				}
				
				if (count >= 3) { 
					pc.achievements_grant("circle_crunch");
				}
				
				pc.feats_increment('animal_love', 1);
				return true;
			}
		}

		return false;
	}
};

function callSloth(pc){ // defined by npc_sloth
	if (!this.is_hiding) return;

	if ((getTime() - this.last_metalize_time) < 3*60*1000){
		if (!this.last_peek || (getTime() - this.last_peek) > 7*1000){
			this.last_peek = getTime();
			this.setState('peeking');
		}

		var responses = ['Sod off, I\'m full!',
					   'I just ate and don\'t want to move. Maybe later.',
					   'Ugh, I was just down there. Maybe later',];
		this.talk(this.chooseTalk(responses), 5000);
		return;
	}

	if (!pc.items_has('metal_rod', 1)){
		var responses = [
			'I ain\'t comin\' down, brah. You don\'t have any Metal Rods!',
			'I wanna see some Metal Rods before I come hang with you...',
			'I ain\'t coming down... until you show me the Metal! Rods, dude.',
			'Knock when you got a Rod. I\'m only into Metal!'
		];
		this.talk(this.chooseTalk(responses), 5000);
		return;
	}

	this.pc = pc;
	this.apiCancelTimer('setState');
	this.apiSetTimerX('setState', 2*1000, 'idle');

	this.metalize_count = 0;
	this.is_hiding = false;

	this.apiSetTimer('hideSloth', 20*1000);
}

function canMetalize(){ // defined by npc_sloth
	if (this.state != 'hangIdle1' && this.state != 'hangIdle2' && this.state != 'talk' && this.state != 'drop' && this.state != 'finishedEating') return false;
	if (this.isHiding() || this.is_metalizing) return false;

	return true;
}

function chooseTalk(responses){ // defined by npc_sloth
	var response;
	do{
		response = choose_one(responses);
	}while (response == this.last_talk && responses.length > 1)

	this.last_talk = response;

	return response;
}

function createSnail(pc, count, max){ // defined by npc_sloth
	this.apiCancelTimer('setAndBroadcastState');
	pc.announce_sound_stop('SLOTH_EAT');

	if (!this.is_metalizing) return;
	if (this.is_hiding) return;

	this.setAndBroadcastState('spit');
	if (this.playerInRange(pc)){
		pc.announce_sound('SLOTH_SPIT');
	}

	if (max > 10) max = 10;
	if (count < 0) count = 0;

	if (is_chance(0.30)){
		var chew_secs = 2.5;
		var snail_count = 1;
	}else{
		var chew_secs = choose_one([2.5,3,4,5,6]);
		var snail_count = choose_one([1, 2, 3, 4]);
	}

	if (snail_count + count > max){
		snail_count = max - count;
	}


	this.apiSetTimerX('createSnailItem', 1.2*1000, pc, snail_count);
	count += snail_count;

	pc.achievements_increment("sloth", "snails_received", snail_count);

	var rod = count;
	rod = Math.min(rod, 7);
	rod = Math.max(rod,1);
	this.setInstanceProp('rod', 'rod'+rod);
	this.broadcastConfig();

	if (count < max){
		this.apiSetTimerX('setAndBroadcastState', 1.5*1000, 'eat');
		if (this.playerInRange(pc)){
			pc.apiSetTimerX('announce_sound', 1.5*1000, 'SLOTH_EAT', 10);
		}

		this.apiSetTimerX('createSnail', chew_secs * 1000, pc, count, max);
	}else{
		// We are done creating this set of snails
		if (this.metalize_count > 7) { 
			pc.achievements_increment("sloth", "fed_until_full", 1);
		}

		this.apiSetTimer('metalizeComplete', 1.5*1000);
	}
}

function createSnailItem(pc, count, max){ // defined by npc_sloth
	if (this.playerInRange(pc)){
		pc.createItemFromSource('snail', count, this, false, {suppress_discovery:true});
	}else{
		var location = this.getLocation();
		location.createItemStackFromSource('snail', count, this.x, this.y, this);
	}
}

function devilHorns(){ // defined by npc_sloth
	// This is called by nearby metalmakers when music is playing.


	// Same conditions as callSloth:

	if (!this.is_hiding) return;

	if (!this.last_metalize_time || (getTime() - this.last_metalize_time) > 3*60*1000){
		log.info("Sloth doing devil  horns");
		this.setState("devil_horns");
	}
	else { 
		log.info("Sloth metalized too recently to do devil horns");
	}
}

function endDevilHorns(){ // defined by npc_sloth
	// This is called by nearby metalmakers when music stops playing.

	if (this.current_state === "devil_horns") {
		log.info("Sloth doing devil  horns");

		this.talk('Metal forever!', 5*1000);

		var anim_loop_length = 20/30;
		var music_dur = getTime() - this.devil_start;
		var num_loops = music_dur / anim_loop_length;
		
		var remaining = 1.0 - (num_loops - Math.floor(num_loops));
		
		this.apiSetTimerX("setState", (remaining * anim_loop_length) + 1 , "hidden");

		//this.setState("hidden");
	}
}

function getNextState(){ // defined by npc_sloth
	// Based on the current_state and target_state, determine the next current state in the direction to the target_state
	if (!this.current_state || !this.target_state || this.current_state == this.target_state) return undefined;

	if (this.current_state == 'eating'){
		if (this.target_state == 'hidden' || this.target_state == 'peeking' || this.target_state == 'peekSpit' || this.target_state === "devil_horns"){
			return 'idle';
		}
	}
	if (this.current_state == 'idle' || this.current_state == 'newxp_talk' || this.current_state === "devil_horns"){
		if (this.target_state == 'peeking' || this.target_state == 'peekSpit'){
			return 'hidden';
		}
	}
	if (this.current_state == 'hidden'){
		if (this.target_state == 'eating'){
			return 'idle';
		}
		if (this.target_state == 'peekSpit'){
			return 'peeking';
		}
		if (this.target_state === "devil_horns") { 
			return "idle";
		}
	}
	if (this.current_state == 'peeking'){
		if (this.target_state == 'eating' || this.target_state == 'idle' || this.target_state == 'newxp_talk' || this.target_state === "devil_horns"){
			return 'hidden';
		}
	}

	if (this.current_state == 'peekSpit'){
		if (this.target_state == 'eating' || this.target_state == 'idle' || this.target_state == 'newxp_talk' || this.target_state == 'hidden'){
			return 'peeking';
		}
	}


	return this.target_state;
}

function hideSloth(){ // defined by npc_sloth
	if (this.is_metalizing) return;

	this.apiCancelTimer('hideSloth');
	this.setState('hidden');
	if (!this.new_xp){
		this.talk('Yawn... See ya', 5*1000);
	}
	delete this.pc;
}

function isHiding(){ // defined by npc_sloth
	return this.is_hiding;
}

function make_config(){ // defined by npc_sloth
	var bandana = this.getInstanceProp('head') ? this.getInstanceProp('head') : 'redBandana';
	var jacket = this.getInstanceProp('jacket') ? this.getInstanceProp('jacket') : 'darkJacket';
	var rod = this.getInstanceProp('rod') ? this.getInstanceProp('rod') : 'rod7';

	return {
		bandana: bandana,
		jacket: jacket,
		rod:rod
	};
}

function metalizeComplete(){ // defined by npc_sloth
	this.last_metalize_time = getTime();

	this.is_metalizing = false;
	delete this.feeder;
	this.setState('idle');

	if (this.metalize_count > 7){
		// We have metalized our max
		this.hideSloth();
	}else{
		// Set timeout
		this.apiCancelTimer('hideSloth');
		this.apiSetTimer('hideSloth', 20*1000);
	}

	var responses = [
		'That was SO METAL! Thanks for the Rods, brah!',
		'Mmm, nothing beats Metal Rods in the morning! Or evening!',
		'I don\'t care what you say, Metal is forever!',
		'Woah, that was almost too much Rod for me to handle! Metal Mania!'
	];

	this.talk(this.chooseTalk(responses), 5000);
}

function onCreate(){ // defined by npc_sloth
	this.initInstanceProps();
	this.is_hiding = true;
	this.metalize_count = 0;
	this.is_metalizing = false;

	this.setAndBroadcastState('hidden');
	this.current_state = 'hidden';

	this.apiAddHitBox('bottom_extender', 200, -intval(this.getInstanceProp('hitbox_extension')));
}

function onIdleTick(){ // defined by npc_sloth
	if (this.current_state == 'idle' || this.current_state == 'newxp_talk'){

		this.setAndBroadcastState(choose_one(['hangIdle1', 'hangIdle2']));
		this.apiSetTimerX('onIdleTick', choose_one([3,4,5,6])*1000);

	}
}

function onLoad(){ // defined by npc_sloth
	this.onPrototypeChanged();

	this.metalizeComplete();
}

function onPlayerCollision(pc){ // defined by npc_sloth
	if (this.is_hiding){
		if (pc.imagination_has_upgrade('sloth_bonus_snails')){
			if ((!pc['last_bonus_snails'] || ((getTime() - pc['last_bonus_snails'] > 5*60*1000)) && is_chance(0.07)) || pc.buffs_has("max_luck")){
				this.spit_target = pc;
				this.setState('peekSpit');
				pc['last_bonus_snails'] = getTime();

				pc.achievements_increment("sloth", "got_bonus_snails", 1);

				return;
			}
		}

		if (!this.last_peek || (getTime() - this.last_peek) > 20*1000){
			this.last_peek = getTime();
			this.setState('peeking');
		}
	}
}

function onPlayerLeavingCollisionArea(pc){ // defined by npc_sloth

}

function onPropsChanged(){ // defined by npc_sloth
	this.apiRemoveHitBox('bottom_extender');
	this.apiAddHitBox('bottom_extender', this.instanceProps.width, -intval(this.instanceProps.hitbox_extension));
	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));

	this.dir = this.getInstanceProp('dir');

	this.broadcastState();
}

function onPrototypeChanged(){ // defined by npc_sloth
	if (!this.instanceProps.width) this.setInstanceProp('width', 300);
	if (!this.instanceProps.height) this.setInstanceProp('height', 200);
}

function playerInRange(pc){ // defined by npc_sloth
	if (!pc.isOnline() || pc.get_simple_location().tsid != this.getLocation().tsid){
		return false;
	}

	if (pc.x < this.x+400 && pc.x > this.x-400){
		return true;
	}

	return false;
}

function setState(state, delay){ // defined by npc_sloth
	// Verify a valid state
	if (state != 'peeking' && state != 'peekSpit' && state != 'hidden' && state != 'idle' && state != 'eating' && state != 'newxp_talk' && state != 'devil_horns') return;

	// Cancel the state changing timers, since we are overriding them here
	this.apiCancelTimer('setState');
	this.apiCancelTimer('setAndBroadcastState');
	this.apiCancelTimer('setStateComplete');
	this.apiCancelTimer('onIdleTick');

	// Stop all looping sloth sounds
	if (this.pc){
		this.pc.announce_sound_stop('SLOTH_EAT');
	}

	// If we are already set to this state, just complete, dont change animations
	if (state == this.current_state) {
		if (!delay){
			this.setStateComplete(this.current_state);
		}else{
			this.apiSetTimerX('setStateComplete', delay, this.current_state);
		}
		return;
	}

	// Determine the animation state and delay to set for this state transition
	var animation_state;
	var length_ms = 0;
	var sound;
	var sound_loop_count = 0;
	var sound_fade_in = 0;
	var sound_exclusive = false;
	if (!delay) delay = 0;

	switch(state){
		case 'idle':{
			if (this.current_state == 'hidden'){
				// Display 'metal' message when droping onto the branch
				if (this.target_state === "devil_horns") { 
					var responses = [
						'Alright, Dude! I\'m waaay into metal!',
						'I love metal!'
					];
				}
				else  {
					var responses = [
						'Alright, Dude! I\'m waaay into metal!',
						'Oh yeah! Gimme somma that Metal... Rod!',
						'Is that a Metal Rod in your pocket, brah?',
						'I love Metal! Rods, that is.'
					];
				}

				this.apiSetTimerX('talk', 1.5*1000, this.chooseTalk(responses), 3*1000);
				animation_state = 'drop';
				length_ms = 1*1000;
				sound = 'SLOTH_ARRIVES';
				sound_exclusive = true;
			}else if (this.current_state == 'eating'){
				animation_state = 'finishedEating';
				length_ms = 1*1000;
			}
			break;
		}
		case 'hidden':{
			if (this.current_state == 'peeking'){
				animation_state = 'peekWithdraw';
				length_ms = 1*1000;
			}else if (this.current_state == 'idle' || this.current_state == 'newxp_talk' || this.current_state === "devil_horns"){
				animation_state = 'climbUp';
				length_ms = 5*1000;
			}
			else if (this.current_state == 'devil_horns') { 
				animation_state = 'devilEnd';
				length_ms = 1*1000;
			}
			break;
		}
		case 'eating':{
			if (this.current_state == 'idle' || this.current_state == 'newxp_talk' || this.current_state === "devil_horns"){
				animation_state = 'eat';
				length_ms = 1*1000;
				sound = 'SLOTH_EAT';
				sound_loop_count = 10;
			}
			break;
		}
		case 'peeking':{
			if (this.current_state == 'hidden'){
				animation_state = 'peek';
				length_ms = 1*1000;
			}else if (this.current_state == 'peekSpit'){
				animation_state = 'peekIdle';
				length_ms = 2*1000;
			}
			break;
		}
		case 'peekSpit':{
			if (this.current_state == 'peeking'){
				animation_state = 'peekSpit';
				length_ms = 1*1000;
				sound = 'SLOTH_PEAK_AND_SPIT';
			}
			break;
		}
		case 'newxp_talk':{
			if (this.current_state == 'hidden'){
				this.apiSetTimerX('talk', 1*1000, 'You\’re doing greeeeeeeeeeeat…<br>Keep going!', 3*1000);
				if (this.pc){
					this.pc.apiSetTimerX('sendActivity', 1*1000, 'You\’re doing greeeeeeeeeeeat…<br>Keep going!', null, true);
				}
				animation_state = 'drop';
				length_ms = 1*1000;
				sound = 'SLOTH_ARRIVES';
				sound_exclusive = true;
			}
			break;
		}
		case 'devil_horns': { 
			if (this.current_state == 'idle'){
				animation_state = 'devilStart';
				length_ms = .67 *1000;
			}

			break;
		}
	}

	if ((this.pc || this.spit_target) && sound){
		if (this.spit_target){
			this.spit_target.announce_sound(sound, sound_loop_count, sound_fade_in, sound_exclusive);
		}
		if (this.pc){
			this.pc.announce_sound(sound, sound_loop_count, sound_fade_in, sound_exclusive);
		}
	}

	if (animation_state){
		// We are good to transition, so let's set the animations and complete
		this.current_state = state;
		this.apiSetTimerX('setAndBroadcastState', delay, animation_state);

		this.apiSetTimerX('setStateComplete', delay + length_ms, state);
	}else{
		// We cant transition to this state directly from our current state.
		// We must a target state, and just get our next step in that direction and keep moving
		this.target_state = state;
		var next_state = this.getNextState();
		if (next_state){
			this.setState(next_state, delay);
		}
	}
}

function setStateComplete(state){ // defined by npc_sloth
	// Cleanup the target_state if necessary
	if (this.target_state && this.target_state == this.current_state){
		delete this.target_state;
	}

	// Set the hidden state
	if (state == 'hidden'){
		this.is_hiding = true;
	}else if (state == 'idle' || state == 'newxp_talk'){
		this.is_hiding = false;
	}

	if (this.target_state){
		// We are not at the target yet, so get the next state and continue
		var next_state = this.getNextState();
		this.setState(next_state, 0);
		return;
	}

	// We have hit our target, so run any state complete code
	switch (state){
		case 'peeking':{
			this.apiSetTimerX('setAndBroadcastState', 1*1000, 'peekIdle');

			this.last_peek = getTime()+(5*1000);
			this.apiSetTimerX('setState', 5*1000, 'hidden');
			break;
		}
		case 'peekSpit':{
			if (this.spit_target){
				var snail_count = choose_one([1,2,3]);
				this.spit_target.createItemFromSource('snail', snail_count, this, false);
				this.spit_target.achievements_increment("sloth", "snails_received", snail_count);
				delete this.spit_target;
			}
			this.apiSetTimerX('setAndBroadcastState', 1.2*1000, 'peekIdle');
			this.apiSetTimerX('setState', 3*1000, 'hidden');
			break;
		}
		case 'idle':{
			this.onIdleTick();
			break;
		}
		case 'newxp_talk':{
			this.onIdleTick();
			break;
		}
		case 'devil_horns': { 
			this.devil_start = getTime();
			this.setAndBroadcastState('devil');
			break;
		}
	}
}

function talk(text, duration){ // defined by npc_sloth
	var location = this.getLocation();

	var rsp = {
		type: "itemstack_bubble",
		msg: text,
		itemstack_tsid: this.tsid,
		duration: duration // in milliseconds!
	};

	var offset_x = 85;
	if (this.dir == 'left'){
		offset_x = -85;
	}

	if (this.is_hiding){
		rsp.offset_x = offset_x;
		rsp.offset_y = 65;
	}else{
		rsp.offset_x = offset_x;
		rsp.offset_y = 85;

		if (this.current_state == 'idle'){
			this.setAndBroadcastState('talk');
			this.setState('idle', duration);
		}
	}
		
	location.apiSendMsg(rsp);
}

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Sloths spit out <a href=\"\/items\/1141\/\" glitch=\"item|snail\">Snails<\/a> when they are fed <a href=\"\/items\/1142\/\" glitch=\"item|metal_rod\">Metal Rods<\/a>."]);
	if (pc && (!pc.skills_has("animalkinship_3"))) out.push([1, "Sloths only trust those with the <a href=\"\/skills\/25\/\" glitch=\"skill|animalkinship_3\">Animal kinship III<\/a> skill to feed them Metal Rods."]);
	out.push([2, "Sloth Trees can be found in <a href=\"\/locations\/hub-89\/\" glitch=\"location|89\">Andra<\/a>, <a href=\"\/locations\/hub-119\/\" glitch=\"location|119\">Folivoria<\/a>, <a href=\"\/locations\/hub-85\/\" glitch=\"location|85\">Kajuu<\/a> and <a href=\"\/locations\/hub-113\/\" glitch=\"location|113\">Tahli<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"npc",
	"npc-animal"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-222,"w":250,"h":201},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIrElEQVR42u1YaVOb1xX2P2D6oR9a\nFwswYCEWSUgIoQXtIAlksUoIhCTEboEIZjPGtkziGNwAsscUO3ESJU6bMc5C0rpNs9i0SZtO2jSe\n6TTth07LP6h+wul9LlxFEFwv5Es7vjNn9PLqve957jnPec4Rhw49XU\/X\/+H67BeL8tfXJsL\/+ONL\npvS\/bskP\/MI3rp+Uf\/3769533jgr\/\/c\/b+fMDDbKpwdcGyejdalGi\/KBDlrcOonLWG7SlObzZ2YG\n7DlTo62p8eFmmh330UvJUfri4yQtzfeGnxjcl5tXx16+MkZ331ugt1Knaf2VU1vj0fr0VL+Len0m\ncpvlWypVQY54Hge4u3Exufn+pfuvrY7TK5fjVKuRUp2hVL4w7bs\/2GWnq8\/3UchvpW6fNT0YcY01\nNxqePIo3Lo+l3v\/ZucRUrDm9PB9NP9NTR7NDDTTZ56RQi4FsOhlplPkZB59\/tGIaH\/LSzbUJ+vG5\nHurrcpCxSkq+Bk0a+yZ6nTQQsFLAqyeztmTzwOkdjDbKIz5zyu\/RkY\/Z+A7AE0Eb+Ru11GhVkE6Z\nLxHPry7FJHr1MRrpbSDfcT0pSyVkrZHxPTMDbhrqtPJ9Hlsl1SgLDw5QXZ7nVZfnk0ZeQNWKo9wR\n0hv11XJHTlMFHJnE86qC7+UoZBJSVxQQPmHdTTq+79Sgm3ratve1OqvIoi2hAwNUFh+WC0fGqmMZ\ngD3tteR1qLgTneKod7\/nhQ10mOmb9Jo5uOZ6NRnURQePoFL6I5Nw1GCRZwD2M6eIhIkVQHaKFSVH\nxrLB1RnL+B4YKy6KtBk5wOzIn4t7vPPjzeG5mFuyPON\/vILJdhhlL4ejsUgdj0S7W8OLZM\/zyf0A\ngn\/gLQCCtzZ96ebKnN97abotcWqoYfMkA8\/Sn45126AQJhb1FO4vTrZ5V2YDYTz7UICRVgN3NBp2\ncEdIE1KcLTPq8oINvaqIKsvydh0K\/APAPr+JgS6nYJMusTjVPnam101nmmx0ORqi9efO0825GfrJ\n9BiNusw07rcxKavlFGF+UxO99WPfBijL9XpsSjKyyuxu1nMnwhEAgpfZAFl0NkTqUVRd3poMLbAv\nzA65U8Emf7nMO2MxUL+xika6mpmPYho97qQJj5viBi3FdBryqyso2FDDZKoa\/jYtTE93c7DkB5J2\nN\/+SAFQARIpFFWfrYItTlRIyoqssYmnbTYvA8Rqy68vIwgAO1BnSF+IR1klGqY+JPosqDQUd1Fpf\nTWYWEJdKRvaKYrJWFFGtsoj0qmJyGMrSLnNFchfIcIt+S0gDiA6AkBkINSe7oigT+hNBawIgUOEA\nCKcQd3GoDs+2di7EmxIfrF+hv391j77+8hP6w7136NNfv0l\/+eJD+uufPub38N3qC2f4e2Ba+dEt\naKeusjCxC+Bw0LYJgCe6rBmyD7FrGKLBNqeyAQI8Tz9LWaTVmIk6DPKEdP3y9jXqaK6jiM9Ja8sJ\n+uTOm\/Tph7dpbeVZigY8NBRpo2dPx+m37N615TnuR1GYm9YU5G64lSWSvQA3EK2RbluGS8IZ68X8\ndIKHAU+NCTzDgXA\/lMVbUcXgr9usYDwtZd3GSvH+Dnp9dZ6uLJyis1PDpFVKSfLD75O6vJDxWEpv\n\/3SNXrycIC3jtOrIYdLnHUl2K8szzeFQm1OT6PTqCFIAgKjikZCdulj6kC5UMtvMJxJoIuNqGhHE\nkNDu2qaFSDPAQ0Pra+XM6XmW2ndpMNRELrOKTNVltHh+ktHHwuhjJL1ayt5bTHaDggaDTl548qOH\nSSfJpbBKQd2V8m2Jg1NwDRGEXAAkeioiKEiPNP\/tq3smWH\/Qu9Fg3eagbacPC5kREUUkb15foEaH\nngJMZmRFuVQhzSODppy8zlrq6WymZwbaKdpuYgeVUUt9Fddci7SAWstkW9+SGyYzyQAjeLYzRAKO\nAN7j0NKff3eHExv28\/UXmRhXkIt9JzoJojjYaeEpRiSnYh20fGGaZaCcTTY4JIuY8hg5LdUU6w9S\nqNXCg9DFsocMIlMOWSFF1IqNfUW787h2S3SFWLedA4RDpBnh\/+yj27wCYQB5drKXC3Z2qxMaimoO\nt5kpMdlDd966wQqjkfHRRiN9AVp6fpZ6Oxs5j6EGTcygIAZ18Ya9oCDHkpe3f1eJhxxjwlmc8VAU\nSgvbjO5wbmqQfvPBOrfP775LL1+9wLuJ2HNyB6Do43COT79HT6P9fooPBKi1oZYa7Zrt+zs6y2VG\nWZjO1tt9F5r57GBDem80wEMIcwfjEuRi81e3uEE2WtzGzDQzvVNgYlTDoVpYMQlhRwqhCujx4gBC\nA7dB5kseOjwwgEkxUSMSAmBTnYrcFjW9eu0Feu\/WDQ7wztuv0mvXl2hupC0TxdGdyAdZsQAE6wyc\np6CJm01LAI1iQNeA8WlpG2DqkQDGe+rCiARmOxFB8BA66WIAh6N+Wro4RzdWL3GwsIuzvRmAaHlC\n6EUUzdVSvh\/vERqK6EEdYACaPRT\/1zXQbs8Z7rKmBQcFp7yOSh4F6F+o3UGnJ0\/Q4jybTFaeY2AX\nMgCns4QehQLyAwSihkpFO0R0kWaABDijqjj1WDNip7dmK7s74KUAKfozbDjEKj3ioYlYN52djjFw\nnl1TDdfElm+ihUjiWlQ4AIKPtVXH0tnT0iMttim5t4U9yAAeVd7FfsVBnqChkChBD1GtwgBODCYA\nmD2IPPICWS3VJWmMUqJQHgYSAwIqH9wVPBTc3QsSNEHK0T4fO3oZkGzkwUs62AvhBCChiQAMQLgW\nEw\/sQeDxHVQgGxxS\/ti8228h\/BggkY79UoVhAsTHAdASAQZRywYthliRVhzarJUmvrN\/BCHdOmXR\nfYgsDGQHweFMCO5+Jg6AT0TNZZbfZ60skf0T9rsFyYSUadUWQApxFaDRrkTLwgFwjUgZVEVpROuJ\nefakCw4hrCA5RvSaysIk\/gZvESFu7PqhvfXperr+B9Z\/AIikdnDeGpgaAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_sloth-1342638235.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"npc",
	"npc-animal"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"c"	: "feed",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_sloth.js LOADED");

// generated ok 2012-12-02 23:29:57 by ali
