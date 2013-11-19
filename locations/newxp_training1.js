//#include inc_newxp.js

// Training Level One
// Geo: http://staging.glitch.com/god/world_street.php?tsid=LIFBLMAVDJ53NP1

var newxp_stage = 'newxp_training1';
var img_pickup_walk_spawn_distance = 300;
var camera_pan_threshold = 300;

var next_location_tsid = 'LIFD0KCDEJ53L7K';
if (config.is_dev){
	next_location_tsid = 'LRO11UFB9EA3IF8';
}

// Special location targets for the location
var location_targets = {
	'initial_player': {x:-1326, y:-1913},
	'initial_flamingo': {x:-983, y:-119},
	'mushroom': {x:724, y:-120},
	'flamingo_doorway': {x:1214, y:-1154},
	'door': {x:1274, y:-1203},
	'sloth': {x:621, y:-660},
	'img_quoin_walk': {y:-156},
	'img_quoin_jump': {x:1345, y:-234},
};

// The ordered list of steps to perform in the tutorial
var tutorial_steps = [
	'intro_greet',
	'intro_greet_pause',
	'intro_talk1',
	'intro_talk2',
	'intro_hover1',
	'intro_flyaway1',
	'intro_flyback1',
	'intro_hover2',
	'slow_talk1',
	'slow_talk2',
	'slow_tmp',
	'slow_create_coin',
	'slow_upgrade_delay',
	'slow_upgrade_overlay',
	'slow_upgrade',
	'slow_upgrade2',
	'slow_flyaway1',
	'slow_flyaway2',
	'jump_talk1',
	'jump_mushroom',
	'jump_hideinstructions1',
	'jump_show_coin',
	'jump_get_coin',
	'jump_upgrade',
	'jump_upgrade2',
	'door_flamingo',
	'door_talk1',
	'door_talk2',
	'door_talk3',
	'door_talk4',
	'door_talk5',
	'door_talk6',
	'door_show1',
	'door_show2',
	'door_show3'
];

function playerEnterCallback(pc){

	// Are we coming in midway through the tutorial?
	if (this.current_step){
		// Run their current step
		this.runTutorialStep(this.current_step, {pc:pc, from_reload:true});
	}else{
		this.reset();
	}

	// Make sure any location events that need to fire are fired
	this.apiSetTimerX('setupLocationEvents', 1*1000);

	this.overlays_shown = {};

	if (this.current_img_menu){
		this.showImaginationMenu(pc);
	}

	pc.use_img = true;
	pc.imagination_reshuffle_hand(true);

	pc.newxpProgressCallback({
		action: 'enter',
		stage: 'training1',
		enter_ts: time()
	});
}

function playerExitCallback(pc){

	this.apiCancelTimer('runTutorialStep');
	this.apiCancelTimer('showJumpCoin');
	delete this.overlays_shown;

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'training1',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function hideUIOnLoad(ui_component){
	
	switch (ui_component){

		case 'furniture_bag':
		case 'swatches_button':
		case 'expand_button':
		case 'energy':
		case 'mood':
		case 'imagination':
		case 'decorate_button':
		case 'cultivate_button':
		case 'pack':
		case 'current_location':
		case 'currants':
		case 'inventory_search':
		case 'skill_learning':
		case 'home_street_visiting':
			return true;
			break;
	}
	
	return false;
}

function hitBox(pc, id, in_box){
	
	if (!this.overlays_shown) this.overlays_shown = {};

	if (id == 'spacebarPlusArrows'){
		this.showInstruction(pc, 'jump_across_instructions_overlay');
		return;
	}
	else if (id == 'upDownForLadders'){
		this.showInstruction(pc, 'climb_instructions_overlay');
		return;
	}
	else if (id == 'interactWithGlowing'){
		this.showInstruction(pc, 'interact_instructions_overlay');
		return;
	}
	else if (id == 'jumpInstructions'){
		this.showInstruction(pc, 'jump_instructions_overlay');
		return;
	}
	else if (id == 'hide_instructions'){
		pc.overlay_dismiss('pack_instructions');

		return;
	}
	else if (id == 'slothPeek'){
		pc.overlay_dismiss('pack_instructions');
		this.slothTalk();
		return;
	}
	else if (id == 'doingGreat'){
		this.slothRemove();
		return;
	}
	else if (id == 'img_pickup_jump'){
		if (this.isStepBefore(this.current_step, 'jump_get_coin')){
			this.runTutorialStep('jump_get_coin', {pc:pc});
		}else{
			this.eventFired(id, this, {pc:pc});
		}
		return;
	}
	else if (id == 'tp'){
		pc.playHitAnimation('hit1', 5*1000);
		pc.teleportToLocation(this.next_location_tsid, 0, 0);
		return;
	}
	else if (id == 'jump_start' && this.isStepBefore(this.current_step, 'slow_flyaway1')){
		pc.moveAvatar(pc.x-100, pc.y, 'left');
		pc.announce_vp_overlay({
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			duration: 3000,
			text: [
				'<p align="center"><span class="nuxp_vog">Go and get that quoin.</span></p>'
			],
		});
	}
	else{
		this.eventFired(id, this, {pc:pc});
		return;
	}
}

function reset(){

	delete this.current_step;
	delete this.coin_shown;
	delete this.tree_hidden;
	delete this.waiting_for;
	delete this.current_img_menu;
	delete this.current_overlay;

	// Reset the flamingo (creating if necessary)
	var flamingo = this.getFlamingo();
	if (!flamingo){
		flamingo = this.createAndReturnItem('npc_flamingo', 1, 0, 0);
	}
	flamingo.apiMoveToXY(this.location_targets.initial_flamingo.x, this.location_targets.initial_flamingo.y, 1500, null);
	flamingo.reset();

	// Reset the player
	if (this.target_pc){
		this.unrootPlayer(this.target_pc);
		this.target_pc.overlay_dismiss('pack_instructions');
		this.target_pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);
	}

	// Clear any dynamic items
	this.deleteImgWalkCoins();
	this.overlays_shown = {};
	var doors = this.find_items('newxp_door');
	for (var i in doors){
		doors[i].apiDelete();
	}

	// Clear the possible timers
	this.apiCancelTimer('countJumps');
	this.apiCancelTimer('endHovering');
	this.apiCancelTimer('runTutorialStep');
	this.apiCancelTimer('showJumpCoin');
}

function setupLocationEvents(){
	this.events_broadcast('player_reconnect');
	if (this.current_step == undefined) return;
	
	for (var i in this.tutorial_steps){
		if (this.tutorial_steps[i] == this.current_step){
			break;
		}
		
		if (this.tutorial_steps[i] == 'slow_upgrade2'){
			this.events_broadcast('hide_wall1');
		}
		if (this.tutorial_steps[i] == 'jump_mushroom'){
			this.events_broadcast('shroom_fade');
		}
	}

	if (this.tree_hidden){
		this.slothRemove();
		this.apiSetTimerX('events_broadcast', 2*1000, 'treeplats_on'); // Need to delay to wait for the tree deco
		this.events_broadcast('plat4');
	}
	this.events_broadcast('stars_on');
}

function deleteImgWalkCoins(){
	var quoins = this.find_items('quoin');
	for (var i in quoins){
		if (quoins[i].getInstanceProp('location_event_id') == 'img_pickup_walk'){
			quoins[i].apiDelete();
		}
	}
}

function eventFired(event_id, target, args){
	var ret = {};
	
	log.info('newxp_training1: '+this.target_pc+': eventFired: '+event_id+' -- args:'+args+' -- current_step: '+this.current_step+' -- waitingfor: '+this.waiting_for);
	
	if (event_id == 'overlay_dismissed' && this.current_overlay){
		delete this.current_overlay;
	}

	if (event_id == 'upgrade_granted' && this.current_img_menu){
		delete this.current_img_menu;
	}

	// Are we starting fresh?
	if (!this.current_step && event_id == 'newxp_start'){
		this.target_pc = args.pc;
		return this.runTutorialStep(this.tutorial_steps[0], args);
	}

	if (event_id == 'img_pickup_jump'){
		if (this.isStepBefore(this.current_step, 'jump_get_coin')){
			this.runTutorialStep('jump_get_coin', args);
			return;
		}
	}

	if (event_id == 'img_pickup_ladder'){
		this.showOverlay(this.target_pc, 'newxp_img3_overlay');
	}

	if (this.current_step == undefined) return;

	if (this.waiting_for && this.waiting_for.event_id == event_id){
		if (!this.waiting_for.target || this.waiting_for.target == target){
			log.info('newxp_training1: '+this.target_pc+': eventFired: '+event_id+' -- calling runTutorialStep: '+this.getNextStep(this.current_step));
			ret = this.runTutorialStep(this.getNextStep(this.current_step), args);
		}
	}

	return ret;
}

function runTutorialStep(step, args){

	delete this.waiting_for;

	var flamingo = this.getFlamingo();
	if (!flamingo && this.isStepBefore(step, 'door_show3')){
		log.info(this+' runTutorialStep('+step+') exiting early because no flamingo');
		return;
	}

	this.apiCancelTimer('runTutorialStep');
	
	if (!args) args = {};
	
	var ret = {};
	var pc = this.target_pc;
	if (!pc){
		log.error('NewXP Training - PC not set during runTutorialStep');
		return ret;
	}

	if (pc.getLocation().tsid != this.tsid){
		log.info(this+' runTutorialStep('+step+') exiting early because player is not here: '+pc.getLocation().tsid+' vs '+this.tsid);
		return ret;
	}

	log.info('newxp_training1: '+this.target_pc+': runTutorialStep - '+step+' -- '+args);
	
	switch (step){
		case 'intro_greet':
			// Swing head to greet player
			this.rootPlayer(pc);
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'active_head_set');
				flamingo.apiSetTimerX('setActiveHead', 1*1000, 'tall');
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'intro_greet_pause':
			// Wait 1 second
			this.apiSetTimerX('runTutorialStep', 0.3*1000, this.getNextStep(step), null);
			break;
		case 'intro_talk1':
			// Introduction 1 (tall head)
			this.setStepAndWaitEvent(step, 'talk_end');
			flamingo.talk(pc, 'Well, well — welcome.<br><br>I’m a “Welcoming Flamingo”.<br>But I am not a patient Flamingo.', [{txt:'Uh …', value:'ok'}], 'tall');
			this.apiSetTimerX('showInstruction', 2*1000, pc, 'button_instructions_overlay');
			this.button_instructions_overlay_shown = getTime()+(2*1000);
			break;
		case 'intro_talk2':
			// Introduction 2 (short head)
			var overlay_timeup = getTime() - this.button_instructions_overlay_shown;
			if (overlay_timeup < 0) overlay_timeup = 0;

			// Show pack instructions for a minimum of 4 seconds
			if (overlay_timeup > 4*1000){
				this.apiCancelTimer('showInstruction');
				pc.overlay_dismiss('pack_instructions');
			}else{
				pc.apiSetTimerX('overlay_dismiss', 4*1000 - overlay_timeup, 'pack_instructions');
			}
			this.setStepAndWaitEvent(step, 'talk_end');
			if (args.msg) flamingo.conversation_end(pc, args.msg);
			flamingo.talk(pc, '… not patient at all, he isn\'t. So, let\'s get a move on. This way!', [{txt:'OK!', value:'ok'}], 'short');
			break;
		case 'intro_hover1':
			// Switch to hover and wait 2 seconds
			this.apiSetTimerX('runTutorialStep', 2*1000, this.getNextStep(step), null);
			if (!args.from_reload){
				flamingo.startHovering();
			}
			break;
		case 'intro_flyaway1':
			// Fly offscreen
			this.unrootPlayer(pc);
			this.setStepAndWaitEvent(step, 'pre_pickup_walk');
			if (!args.from_reload){
				flamingo.startFlying(flamingo.x+900, flamingo.y);
			}
			ret['done_flying'] = false;
			break;
		case 'intro_flyback1':
			// Switch to tall head and fly to 400 pixels of player
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'flying_end');
				flamingo.setActiveHead('tall');
				flamingo.startFlying(pc.x+400, flamingo.y);
				ret['done_flying'] = false;
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'intro_hover2':
			// ... and start hovering
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'flying_end');
				flamingo.startHovering(pc.x+280, flamingo.y);
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			this.rootPlayer(pc);
			break;

		case 'slow_talk1':
			// Talk about being slow
			this.setStepAndWaitEvent(step, 'talk_end');
			flamingo.talk(pc, 'See, this. You walk so slowly.<br>It’s maddening! You’ve got to imagine yourself faster!!', [{txt:'!!!!!!!', value:'ok'}], 'tall');
			break;
		case 'slow_talk2':
			// Talk about being slow again
			this.setStepAndWaitEvent(step, 'talk_end');
			flamingo.talk(pc, 'Sorry about that.<split butt_txt=\"It\'s OK\">But, you should get to walking faster.<br>You’ll need some imagination.', [{txt:'Hmm?', value:'ok'}], 'short');
			this.unrootPlayer(pc);
			break;
		case 'slow_tmp':
			// Fly to the mushroom
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);

			if (!args.from_reload){
				flamingo.setInstanceProp('walk_speed',500);
				flamingo.startFlying(this.location_targets.mushroom.x, this.location_targets.mushroom.y);
			}
			break;
		case 'slow_create_coin':
			// Flamingo flies a bit and we spawn coin
			this.setStepAndWaitEvent(step, 'img_pickup_walk');

			if (!args.from_reload){
				var quoin = this.createItemStackWithPoof('quoin', 1, Math.min(pc.x+img_pickup_walk_spawn_distance, 130), location_targets.img_quoin_walk.y, 'smoke_puff_overlay');
				quoin.setInstanceProp('class_name', '');
				quoin.setInstanceProp('type', 'xp');
				quoin.setInstanceProp('respawn_time', '99999999');
				quoin.setInstanceProp('benefit', '2');
				quoin.setInstanceProp('location_event_id', 'img_pickup_walk');
			}
			break;
		case 'slow_upgrade_delay':
			this.apiSetTimerX('runTutorialStep', 0.6*1000, this.getNextStep(step), null);
			break;
		case 'slow_upgrade_overlay':
			this.setStepAndWaitEvent(step, 'overlay_dismissed');
			this.deleteImgWalkCoins();
			pc.moveCamera(220);

			this.showOverlay(pc, 'newxp_img1_overlay');
			break;
		case 'slow_upgrade':
			// Show upgrade dialog and wait to be granted
			this.setStepAndWaitEvent(step, 'upgrade_granted');
			this.showImaginationMenu(pc);
			break;
		case 'slow_upgrade2':
			this.events_broadcast('hide_wall1');
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'upgrade_confirmed');
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'slow_flyaway1':
			// Fly to the mushroom
			this.apiSetTimerX('runTutorialStep', 2*1000, this.getNextStep(step), null);
			pc.moveCamera(0);
			pc.sendActivity('Good. Now catch up to those flamingos.', null, false, true);
			break;
		case 'slow_flyaway2':
			// Fly to the mushroom
			this.setStepAndWaitEvent(step, 'player_collision', flamingo);
			if (!args.from_reload){
				flamingo.endFlying();
			}
			break;
		case 'jump_talk1':
			this.rootPlayer(pc);
			flamingo.talk(pc, 'Good. Now follow me up here …', [{txt:'Ok', value:'ok'}], 'tall');
			pc.apiSendMsg({type: 'avatar_preload'});
			this.setStepAndWaitEvent(step, 'talk_end');
			break;
		case 'jump_mushroom':
			// Tease jumping...
			this.unrootPlayer(pc);
			this.setStepAndWaitEvent(step, 'player_jumps_3_times');
			this.countJumps(pc, null);

			if (!args.from_reload){
				flamingo.setInstanceProp('walk_speed', 150);
				flamingo.apiSetTimerX('startHovering', 0.5*1000, flamingo.x, flamingo.y-500);
			}
			this.apiSetTimerX('events_broadcast', 3*1000, 'shroom_fade');
			this.apiSetTimerX('showJumpCoin', 15*1000, pc, 10*1000);
			break;
		case 'jump_hideinstructions1':
			this.apiCancelTimer('showJumpCoin');
			pc.overlay_dismiss('pack_instructions');
			this.apiSetTimerX('runTutorialStep', 0.5*1000, this.getNextStep(step), null);
			break;
		case 'jump_show_coin':
			// Wait for the jump iMG upgrade hitbox, panning the camera every 10 seconds and hide jump overlay
			this.setStepAndWaitEvent(step, 'img_pickup_jump');
			this.showJumpCoin(pc);
			this.apiSetTimerX('runTutorialStep', 10*1000, step, null);
			break;
		case 'jump_get_coin':
			// Hide the jump instructions (if they are still visible)
			pc.overlay_dismiss('pack_instructions');

			pc.moveAvatar(1422, -116, 'left');
			this.apiCancelTimer('runTutorialStep');
			this.apiCancelTimer('showJumpCoin');
			this.setStepAndWaitEvent(step, 'overlay_dismissed');
			this.showOverlay(pc, 'newxp_img2_overlay');
			break;
		case 'jump_upgrade':
			this.apiCancelTimer('runTutorialStep');
			// Show jump upgrade dialog
			this.setStepAndWaitEvent(step, 'upgrade_granted');
			this.showImaginationMenu(pc);
			break;
		case 'jump_upgrade2':
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'upgrade_confirmed');
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'door_flamingo':
			// Send flamingo to door
			if (!args.from_reload){
				flamingo.startFlying(location_targets.flamingo_doorway.x, location_targets.flamingo_doorway.y);
				flamingo.apiSetTimerX('endHovering', 8*1000);
				this.slothCreate();
			}
			this.setStepAndWaitEvent(step, 'at_door');
			break;
		case 'door_talk1':
			// User has shown up at the door, so start talking
			pc.overlay_dismiss('pack_instructions');
			this.rootPlayer(pc);
			pc.moveCamera(flamingo.x);
			this.setStepAndWaitEvent(step, 'talk_end');
			flamingo.talk(pc, 'Yeah! You know how to moooove!', [{txt:'Guess so!', value:'ok'}], 'short');
			break;
		case 'door_talk2':
			// more talking
			this.setStepAndWaitEvent(step, 'talk_end');
			if (args.msg) flamingo.conversation_end(pc, args.msg);
			if (pc.quickstart_needs_avatar){
				if (pc.quickstart_needs_player){
					flamingo.talk(pc, 'And so you deserve the honor of a name. What shall we call you?', [{txt:'Hmm …', value:'ok'}], 'tall');
				}
				else{
					flamingo.talk(pc, 'So, '+pc.getLabel()+', is it? Surely you don’t imagine yourself looking so very, very plain. Put together a basic look for yourself to get started.', [{txt:'OK', value:'ok'}], 'tall');
				}
			}
			else if (pc.quickstart_needs_player){
				flamingo.talk(pc, 'And so you deserve the honor of a name. What shall we call you?', [{txt:'Hmm …', value:'ok'}], 'tall');
			}
			else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'door_talk3':
			if (pc.quickstart_needs_avatar || pc.quickstart_needs_player){

				if (pc.quickstart_needs_player){
					this.setStepAndWaitEvent(step, 'ask_end');
					pc.openInputBox('player_name_picker', 'What should we call you?', {check_user_name: true, input_max_chars: 19, cancelable: false, itemstack_tsid: flamingo.tsid, follow: true, input_label: 'What should we call you?'});
				}
				else{
					// Next step is run in avatar_admin_set_default
					pc.apiSendMsg({type: 'open_avatar_picker'});
				}
			}
			else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'door_talk4':
			if (pc.quickstart_needs_avatar){
				this.setStepAndWaitEvent(step, 'talk_end');

				flamingo.talk(pc, 'So, '+pc.getLabel()+', is it? Surely you don’t imagine yourself looking so very, very plain. Put together a basic look for yourself to get started.', [{txt:'OK', value:'ok'}], 'tall');
			}
			else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'door_talk5':
			if (pc.quickstart_needs_avatar){
				// Next step is run in avatar_admin_set_default
				pc.apiSendMsg({type: 'open_avatar_picker'});
			}
			else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'door_talk6':
			if (pc.quickstart_needs_avatar || pc.quickstart_needs_player){
				this.runTutorialStep('door_talk2', null);
			}
			else{
				this.setStepAndWaitEvent(step, 'talk_end');
				flamingo.talk(pc, 'You seem fairly well set up now, '+pc.getLabel()+'. And we must be off to welcome the next new player. Good luck!', [{txt:'Thank you', value:'ok'}], 'tall');
			}
			break;
		case 'door_show1':
			if (pc.quickstart_needs_account){
				pc.changeUIComponent('create_account', true);
			}

			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);
			break;
		case 'door_show2':
			flamingo.deleteWithPoof(10, 170);
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);
			break;
		case 'door_show3':
			this.unrootPlayer(pc);
			pc.moveCamera(0);
			break;
	}
	
	return ret;
}

function countJumps(pc, starting_count){
	if (pc.getLocation() != this) return;

	if (starting_count == undefined){
		starting_count = pc.getJumpCount();
	}
	
	if (pc.getJumpCount() - starting_count >= 3){
		var flamingo = this.getFlamingo();
		if (!flamingo) return;

		this.eventFired('player_jumps_3_times', this, {pc:pc});
	}else{
		this.apiSetTimerX('countJumps', 1*1000, pc, starting_count);
	}
}

function slothCreate(){
	var sloths = this.find_items('npc_sloth');
	for (var i in sloths){
		sloths[i].apiDelete();
	}
	
	var sloth = this.createAndReturnItem('npc_sloth', 1, this.location_targets.sloth.x, this.location_targets.sloth.y, 0, null);
	sloth.new_xp = true;
	sloth.dir = 'left';
	sloth.not_selectable = true;
}

function slothPeek(){
	var sloths = this.find_items('npc_sloth');
	if (!sloths[0]) return;
	
	var sloth = sloths[0];
	if (!sloth.talked){
		sloth.setState('peeking', 0);
	}
}

function slothTalk(){
	var sloths = this.find_items('npc_sloth');
	if (!sloths[0]) return;
	
	var sloth = sloths[0];
	sloth.talked = true;
	
	sloth.setState('newxp_talk');
	sloth.shown_time = getTime();
	this.apiSetTimerX('slothRemove', 7.5*1000);
}

function slothRemove(){
	this.apiCancelTimer('slothRemove');

	var sloths = this.find_items('npc_sloth');
	if (!sloths[0]) return;
	var sloth = sloths[0];

	// Sloth has to be shown for a min of 3.5 seconds. If under, delay
	if (getTime() - sloth.shown_time <= 3.5*1000){
		this.apiSetTimerX('slothRemove', (3.5*1000)-(getTime() - sloth.shown_time));
		return;
	}
	
	sloth.deleteWithPoof(-50, 250);
	this.apiSetTimer('hideTree', 0.5*1000);
}

function hideTree(){
	this.tree_hidden = true;
	this.events_broadcast('treehide');
	this.events_broadcast('plat1');
}

function showJumpCoin(pc, repeat_after){
	if (pc.location != this) return;

	if ((this.location_targets.img_quoin_jump.x - pc.x) > camera_pan_threshold){
		
		if (this.coin_shown){
			// If we've shown the coin once, we need to show an overlay hint
			pc.announce_vp_overlay({
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				duration: 3000,
				text: [
					'<p align="center"><span class="nuxp_vog">Go and get that quoin. You need to jump higher.</span></p>'
				],
			});
		}
		
		this.apiSendMsg({
			type: 'camera_center',
			pt: {x:this.location_targets.img_quoin_jump.x, y:pc.y}, 
			duration_ms: 2000
		});

		this.coin_shown = true;
		
		if (repeat_after){
			this.apiSetTimerX('showJumpCoin', repeat_after, pc, repeat_after);
		}
	}
}

function timFix(pc){

	var quoins = this.find_items('quoin');
	for (var i in quoins){
		if (quoins[i].getInstanceProp('location_event_id') == 'img_pickup_jump'){
			quoins[i].apiDelete();
		}
	}

	var newQuoin = this.createAndReturnItem('quoin', 1, 1341, -240);
	if (!newQuoin) return false;
	
	newQuoin.setInstanceProp('class_name', 'none');
	newQuoin.setInstanceProp('type', 'xp');
	newQuoin.setInstanceProp('benefit', 3);
	newQuoin.setInstanceProp('respawn_time', 999999999);
	newQuoin.setInstanceProp('location_event_id', 'img_pickup_jump');

	this.reset();
	
	if (pc){
		pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);
	}
	return true;
}