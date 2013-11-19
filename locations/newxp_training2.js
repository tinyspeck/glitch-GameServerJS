//#include inc_newxp.js

// Training Level Two

var newxp_stage = 'newxp_training2';
var dustbunny_maxspeed = 500;
var dustbunny_normalspeed = 250;

// Special location targets for the location
var location_targets = {
	'initial_player': {x:-2776, y:-2000},
	'initial_dustbunny': {x:-2460, y:-110},
	'initial_blowing': {x:-2133, y:-110},
	'dustbunny_table1a': {x:-1603, y:-110},
	'dustbunny_table1b': {x:-1451, y:-110},
	'dustbunny_table2a': {x:-1092, y:-110},
	'dustbunny_table2b': {x:-856, y:-110},
	'dustbunny_eggs1': {x:-607, y:-110},
	'dustbunny_eggs2': {x:-191, y:-110},
	'dustbunny_building': {x:644, y:-110},
	'food_2': {x:-1475, y:-186},
	'food_3': {x:-1584, y:-185},
	'drink_1': {x:-1096, y:-180},
	'drink_2': {x:-1031, y:-180},
	'drink_3': {x:-967, y:-180},
	'trant_egg': {x:57, y:-416},
};

var special_items = {
	'food_2': {class_tsid:'common_crudites', count:1},
	'food_3': {class_tsid:'flummery', count:1},	
	'drink_1': {class_tsid:'spicy_grog', count:1},	
	'drink_2': {class_tsid:'fruity_juice', count:3},	
	'drink_3': {class_tsid:'spicy_grog', count:3},	
}

// The ordered list of steps to perform in the tutorial
var tutorial_steps = [
	'dustbunny_start',
	'dustbunny_talk1',
	'dustbunny_talk2',
	'dustbunny_talk5',
	'dustbunny_talk6',
	'upgrade1',
	'upgrade2',
	'upgrade3',
	'dustbunny_food1',
	'dustbunny_food2',
	'dustbunny_food3',
	'food_wait_eat',
	'food_eaten',
	'food_pickup1',
	'food_pickup2',
	'pickup_item5',
	'dustbunny_drink1',
	'dustbunny_drink3',
	'dustbunny_drink4',
	'dustbunny_drink5',
	'drink_wait_drink',
	'drink_drank',
	'drink_pickup1',
	'drink_pickup2',
	'dustbunny_egg0',
	'dustbunny_egg1',
	'dustbunny_egg1b',
	'dustbunny_egg1c',
	'dustbunny_egg2',
	'dustbunny_egg3',
	'dustbunny_egg4',
	'dustbunny_egg4b',
	'dustbunny_egg5',
	'dustbunny_egg6',
	'building_hide1',
	'building_hide2',
	'dustbunny_done1',
	'magicrock_talk1',
	'magicrock_talk2',
	'magicrock_talk3',
	'magicrock_talk4',
	'magicrock_talk5',
	'magicrock_talk6',
	'done',
];

function playerEnterCallback(pc){
	
	// Are we coming in midway through the tutorial?
	if (this.current_step){
		// Run their current step
		this.runTutorialStep(this.current_step, {pc:pc, from_reload:true});
	}else{
		log.info('newxp_training2: playerEntered, resetting data.');
		this.reset(pc);

		pc.stopHitAnimation();
		pc.metabolics_set_tank(100);
		pc.metabolics_set_max('energy', 100);
		pc.metabolics_set_energy(99, true, true);
		pc.metabolics_set_mood(99, true, true);

		this.apiSetTimerX('setupTrants', 3*1000);
	}

	if (this.current_img_menu){
		this.showImaginationMenu(pc);
	}
	
	if (!this.firstInventory()){
		pc.changeUIComponent('pack', true);
	}
	
	// Make sure any location events that need to fire are fired
	this.apiSetTimerX('rebroadcastLocationEvent', 2*1000);
	this.apiSetTimerX('setupLocationEvents', 2*1000);
	
	this.overlays_shown = {};
	pc.use_img = true;

	pc.newxpProgressCallback({
		action: 'enter',
		stage: 'training2',
		enter_ts: time()
	});
}

function playerExitCallback(pc){

	this.apiCancelTimer('runTutorialStep');
	delete this.overlays_shown;

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'training2',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function setupLocationEvents(){
	if (this.current_step == undefined) return;
	
	for (var i in this.tutorial_steps){
		if (this.tutorial_steps[i] == this.current_step){
			break;
		}

		switch (this.tutorial_steps[i]){
			case 'dustbunny_drink1': 	this.events_broadcast('wall_to_drinks'); break;
			case 'dustbunny_egg0': 		this.events_broadcast('wall_to_eggplant'); break;
			case 'building_hide1': 		this.events_broadcast('tube_building'); break;
		}
	}

	this.events_broadcast('start');
	this.events_broadcast('start2');
	this.events_broadcast('start3');
	this.events_broadcast('start4');
	this.events_broadcast('start5');
	this.events_broadcast('start6');
}

function hitBox(pc, id, in_box){
	log.info('newxp_training2: '+pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));
	
	if (id.substring(0, 12) == 'house_style_'){
		var house_style = id.substr(12);
		
		var x = -314;
		var y = -600;
		if (house_style == 'firebog_4_high'){
			return pc.teleportToLocation(config.newxp_locations['firebog_4_high'], x, y);
		}
		else if (house_style == 'meadow_ext_default_high'){
			return pc.teleportToLocation(config.newxp_locations['meadow_ext_default_high'], x, y);
		}
		else if (house_style == 'uralia_2_high'){
			return pc.teleportToLocation(config.newxp_locations['uralia_2_high'], x, y);
		}
	}else if (id == 'to_drink' && this.current_step == 'pickup_item5'){
		return this.runTutorialStep(this.getNextStep(this.current_step), {pc:pc, id:id});
	}else if (id == 'leave_food' && this.isStepBefore(this.current_step, 'dustbunny_drink3')){
		if (this.isStepAfter(this.current_step, 'food_eaten')){
			return this.runTutorialStep('dustbunny_drink3', {pc:pc, id:id});
		}else{
			pc.moveAvatar(pc.x-300, pc.y, 'right');
			var dustbunny = this.getDustBunny();
			dustbunny.sendBubble('');
			this.apiCancelTimer('dustbunnyEatNag');
			dustbunny.sendBubble('You need to come on and do<br>what I am telling! For real!');
			if (this.isStepAfter('dustbunny_food3')){
				this.dustbunnyEatNagStart = true;
			}
		}
	}else if (id == 'leave_drink'){
		if (this.isStepAfter(this.current_step, 'drink_wait_drink')){
			if (this.isStepAfter(this.current_step, 'drink_pickup1') && this.isStepBefore(this.current_step, 'dustbunny_egg0')){
				return this.runTutorialStep('dustbunny_egg0', {pc:pc, id:id});			
			}else{
				this.eventFired(id, this, {pc:pc});
			}
		}else{
			pc.moveAvatar(-928, pc.y, 'left');
			var dustbunny = this.getDustBunny();
			dustbunny.sendBubble('Ahut! Uht! Look! Drink one<br>of those drinks!');
		}
	}else{
		this.eventFired(id, this, {pc:pc});
		return;
	}
}

function hideUIOnLoad(ui_component){
	switch (ui_component){

		case 'furniture_bag':
		case 'swatches_button':
		case 'expand_button':
		case 'imagination':
		case 'decorate_button':
		case 'cultivate_button':
		case 'current_location':
		case 'currants':
		case 'inventory_search':
		case 'skill_learning':
		case 'home_street_visiting':
			return true;
			break;
	}
	
	if (ui_component == 'pack' && (!this.current_step || this.isStepBefore(this.current_step, 'food_wait_eat'))) return true;
	if (ui_component == 'energy' && (!this.current_step || this.isStepBefore(this.current_step, 'food_eaten'))) return true;
	if (ui_component == 'mood' && (!this.current_step || this.isStepBefore(this.current_step, 'drink_drank'))) return true;

	return false;
}

function reset(pc){
	delete this.current_step;
	delete this.first_inventory;
	delete this.location_events_broadcast;
	delete this.egg_harvested;
	delete this.current_img_menu;
	delete this.current_overlay;
	if (this.dustbunnyEatNagStart){
		delete this.dustbunnyEatNagStart;
	}

	var dustbunny = this.getDustBunny();
	if (!dustbunny){
		dustbunny = this.createAndReturnItem('npc_newxp_dustbunny', 1, this.location_targets.initial_dustbunny.x, this.location_targets.initial_dustbunny.y);
	}
	dustbunny.apiMoveToXY(this.location_targets.initial_dustbunny.x, this.location_targets.initial_dustbunny.y, 1500, null);
	dustbunny.setInstanceProp('walk_speed', this.dustbunny_normalspeed);
	dustbunny.not_selectable = true;
	dustbunny.facePlayer(pc);
	
	var magicrock = this.getMagicRock();
	if (magicrock){
		magicrock.setAndBroadcastState('read');
		magicrock.dir = 'left';
		magicrock.setInstanceProp('talk_state', 'readTalk');
	}
	
	// Remove and re-create any items
	this.removeItems(this.special_items.food_2.class_tsid);
	this.removeItems(this.special_items.food_3.class_tsid);
	this.removeItems(this.special_items.drink_1.class_tsid);
	this.removeItems(this.special_items.drink_2.class_tsid);
	this.removeItems(this.special_items.drink_3.class_tsid);
	this.createItemStack(this.special_items.food_2.class_tsid, this.special_items.food_2.count, this.location_targets.food_2.x, this.location_targets.food_2.y);
	this.createItemStack(this.special_items.food_3.class_tsid, this.special_items.food_3.count, this.location_targets.food_3.x, this.location_targets.food_3.y);
	this.createItemStack(this.special_items.drink_1.class_tsid, this.special_items.drink_1.count, this.location_targets.drink_1.x, this.location_targets.drink_1.y);
	this.createItemStack(this.special_items.drink_2.class_tsid, this.special_items.drink_2.count, this.location_targets.drink_2.x, this.location_targets.drink_2.y);
	this.createItemStack(this.special_items.drink_3.class_tsid, this.special_items.drink_3.count, this.location_targets.drink_3.x, this.location_targets.drink_3.y);

	// Reset the player
	this.unrootPlayer(pc);
	pc.moveCamera(0);
	pc.overlay_dismiss('pack_instructions');
	pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);
	pc.changeUIComponent('energy', false);
	pc.changeUIComponent('mood', false);
	pc.changeUIComponent('pack', false);
	pc.metabolics_set_energy(95);
	pc.metabolics_set_mood(95);
	
	// Flip the chair
	var chairs = this.find_items('furniture_chair');
	for (var i in chairs){
		var facing_right = intval(chairs[i].getInstanceProp('facing_right'));
		if (facing_right == '1'){
			chairs[i].setInstanceProp('facing_right', 0);
			chairs[i].flipPlats();
			chairs[i].broadcastConfig();
		}
	}

	// Clear the possible timers
	this.apiCancelTimer('runTutorialStep');
	this.apiCancelTimer('dustbunnyWindy');
	this.apiCancelTimer('dustbunnyLaugh');
	this.apiCancelTimer('dustbunnyEatNag');
}

function eventFired(event_id, target, args){
	var ret = {};
	
	log.info('newxp_training2: '+this.target_pc+': eventFired: '+event_id+' -- '+args+' ['+this.current_step+']');

	// Are we starting fresh?
	if (!this.current_step && event_id == 'newxp_start'){
		this.target_pc = args.pc;
		return this.runTutorialStep(this.tutorial_steps[0], args);
	}

	if (this.current_step == undefined) return;

	if (event_id == 'overlay_dismissed' && this.current_overlay){
		delete this.current_overlay;
	}

	if (event_id == 'upgrade_granted' && this.current_img_menu){
		delete this.current_img_menu;
	}
	
	var dustbunny = this.getDustBunny();
	if (this.target_pc && dustbunny && event_id == 'walking_end' && target == dustbunny){
		dustbunny.facePlayer(this.target_pc);
		dustbunny.setAndBroadcastState('idle0');
	}
	
	// Has the player eaten before we told them to, if so, push them to the post-eat step
	if (event_id == 'items_eaten' && this.isStepBefore(this.current_step, 'food_wait_eat')){
			return this.runTutorialStep('food_eaten', args);
	}

	// Has the player drank before we told them to, if so, push them to the post-drank step
	if (event_id == 'items_drank' && this.isStepBefore(this.current_step, 'drink_wait_drink')){
			return this.runTutorialStep('drink_drank', args);
	}

	// Are we waiting for the player to pick up all of the food?
	if (event_id == 'items_added' && this.isStepAfter(this.current_step, 'food_eaten') && this.isStepBefore(this.current_step, 'dustbunny_drink1')){
		if (this.countItemClass(this.special_items.food_2.class_tsid) == 0 && 
		 	this.countItemClass(this.special_items.food_3.class_tsid) == 0){
			return this.runTutorialStep('dustbunny_drink1', args);
		}
	}

	// Are we waiting for the player to pick up all of the drinks?
	if (event_id == 'items_added' && this.isStepAfter(this.current_step, 'drink_drank') && this.isStepBefore(this.current_step, 'dustbunny_egg0')){
		if (this.countItemClass(this.special_items.drink_1.class_tsid) == 0 && 
		 	this.countItemClass(this.special_items.drink_2.class_tsid) == 0 && 
		 	this.countItemClass(this.special_items.drink_3.class_tsid) == 0){
			return this.runTutorialStep('dustbunny_egg0', args);
		}
	}
	
	if (event_id == 'dustbunny_collision' && this.target_pc && dustbunny){
		if (this.current_step == 'dustbunny_egg4b'){
			if (this.target_pc.items_has('egg_plain', 1)){
				dustbunny.sendBubble('You got an EGG! Please gimme it!!!');
			}else{
				dustbunny.talk(this.target_pc, 'Heyyyyyyy. You were going to<br>get me an EGG. Fair\'s fair!<br>Go get one!', {ok:'ok'});
			}
			this.target_pc.sendActivity('Drag an Egg onto the Dustbunny. Or, click on the Dustbunny to give it an Egg.', null, false, true);
			return;
		}
	}

	// The player has harvested
	if (event_id == 'verb_harvest'){
		if (dustbunny) dustbunny.not_selectable = false;
		this.egg_harvested = true;
	}
	
	if (event_id == 'growl_harvest' && !this.egg_harvested){
		args.pc.sendActivity('Harvest …', null, false, true);
	}
	
	if (event_id == 'overlay_dismissed' && (!this.first_inventory || !this.first_inventory.pickedup)){
		this.firstInventoryOverlayDismissed();
		return;
	}

	// Mark the last slot used
	if (event_id == 'items_added'){
		this.last_stack_added = args.stack.slot;
	}
	
	// If we are wating to pick up food, and they pickup something else, ignore
	if (event_id == 'items_added' && this.current_step == 'dustbunny_food3' && !args.stack.hasTag('food')){
		return;
	}

	// If we are wating to pick up drink, and they pickup something else, ignore
	if (event_id == 'items_added' && this.current_step == 'dustbunny_drink4' && !args.stack.hasTag('drink')){
		return;
	}

	if (event_id == 'talk_end' && this.dustbunnyEatNagStart){
		this.apiSetTimerX('dustbunnyEatNag', 3*1000, dustbunny, false);
		delete this.dustbunnyEatNagStart;
	}

	if (this.waiting_for.event_id == event_id){
		if (!this.waiting_for.target || this.waiting_for.target == target){
			ret = this.runTutorialStep(this.getNextStep(this.current_step), args);
		}
	}

	return ret;
}

function runTutorialStep(step, args){
	
	log.info('newxp_training2: '+this.target_pc+': runTutorialStep: '+step+' -- '+args);

	this.apiCancelTimer('runTutorialStep');
	
	if (!args) args = {};

	var dustbunny = this.getDustBunny();
	if (!dustbunny && this.isStepBefore(step, 'dustbunny_done1')) return;

	var magicrock = this.getMagicRock();
	if (!magicrock) return;
	
	var ret = {};
	var pc = this.target_pc;
	if (!pc){
		log.error('NewXP Training - PC not set during runTutorialStep');
		return ret;
	}
	
	switch (step){
		case 'dustbunny_start':
			this.rootPlayer(pc);
			// Wait 800ms before starting
			this.apiSetTimerX('runTutorialStep', 0.8*1000, this.getNextStep(step), {});
			break;
		case 'dustbunny_talk1':
			// Dustbunny talks
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Wow. Okay! Hihi '+pc.getLabel()+'.<br>Let\'s scratch your back, so to speak.', [{txt:'Hm?', value:'ok'}]);
			break;
		case 'dustbunny_talk2':
			this.setStepAndWaitEvent(step, 'walking_end', dustbunny);
			dustbunny.apiFindPath(this.location_targets.initial_dustbunny.x-50, this.location_targets.initial_dustbunny.y, 0, "onPathing");
			break;
		case 'dustbunny_talk5':
			// Dustbunny talks
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'And then you scratch mine! HA!<br> Just follow my lead.', [{txt:'OK', value:'ok'}]);
			break;
		case 'dustbunny_talk6':
			// Unroot player and have the dustbunny run away and wait for the quoin collision
			this.setStepAndWaitEvent(step, 'img_pickup_1');
			dustbunny.setInstanceProp('walk_speed', dustbunny_maxspeed*0.30);
			dustbunny.apiFindPath(this.location_targets.dustbunny_table1a.x, this.location_targets.dustbunny_table1a.y, 0, "onPathing");
			this.unrootPlayer(pc);
			break;
		case 'upgrade1':
			// Slight delay before showing upgrade overlay
			this.apiSetTimerX('runTutorialStep', 0.6*1000, this.getNextStep(step), null);
			break;
		case 'upgrade2':
			// Show upgrade overlay
			this.setStepAndWaitEvent(step, 'upgrade_granted');
			this.showImaginationMenu(pc);
			break;
		case 'upgrade3':
			if (!args.from_reload){
				this.setStepAndWaitEvent(step, 'upgrade_confirmed');
			}else{
				this.runTutorialStep(this.getNextStep(step), null);
			}
			break;
		case 'dustbunny_food1':
			// Wait until the player hits the first food hitbox
			this.setStepAndWaitEvent(step, 'to_food');
			break;
		case 'dustbunny_food2':
			// Dustbunny talks about food
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Some food, for your energy needs.<br>Feel free to pick it up.', {ok:'ok'});
			break;
		case 'dustbunny_food3':
			// Dustbunny moves to far end of the table and waits for a item pickup
			// (or skips to next step if all items are gone)
			if (this.countItemClass(this.special_items.food_2.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.food_3.class_tsid) == 0){
					this.setStepAndWaitEvent(step, 'walking_end', dustbunny);
					dustbunny.apiFindPath(this.location_targets.dustbunny_table1b.x, this.location_targets.dustbunny_table1b.y, 0, "onPathing");
			}else{
				if (args.msg) dustbunny.conversation_end(pc, args.msg);
				this.showInstruction(pc, 'interact_instructions_overlay');
				this.setStepAndWaitEvent(step, 'items_added', pc);
				dustbunny.apiFindPath(this.location_targets.dustbunny_table1b.x, this.location_targets.dustbunny_table1b.y, 0, "onPathing");
			}
			break;
		case 'food_wait_eat':
			// Item picked up so show the pack, callout the slot and start the dustbunny nagging
			// to eat the food. Wait for food to be eaten
			this.animatePackSlots(pc, false);
			if (pc.metabolics_get_energy() >= 100){
				this.runTutorialStep(this.getNextStep(step), null);
			}else{
				this.setStepAndWaitEvent(step, 'items_eaten');
				this.apiSetTimerX('showCallout', 2*1000, pc, 'eat', 0, {slot_id:this.last_stack_added, offset_x:5, offset_y:20});
				this.apiSetTimerX('dustbunnyEatNag', 3*1000, dustbunny, false);
				this.target_pc.overlay_dismiss('pack_instructions');
			}
			break;
		case 'food_eaten':
			// Food was eaten, talk and show metabolics
			this.apiCancelTimer('dustbunnyEatNag');
			delete this.dustbunnyEatNagStart;
			dustbunny.sendBubble('');
			this.hideCallout(pc);
			pc.metabolics_set_energy(80, true, true);
			this.setStepAndWaitEvent(step, 'overlay_dismissed');
			this.broadcastLocationEvent('first_eat_overlay', false);
			break;
		case 'food_pickup1':
			this.rootPlayer(pc);
			this.hideCallout(pc);
			pc.metabolics_set_energy(80, true, true);
			pc.apiSetTimerX('changeUIComponent', 1*1000, 'energy', true);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 4*1000, this.getNextStep(step), null);
			dustbunny.apiFindPath(dustbunny.x+30, dustbunny.y, 0, "onPathing");
			break;
		case 'food_pickup2':
			// If they haven't picked up all of the food yet, remind them to pick it up.
			if (this.countItemClass(this.special_items.food_2.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.food_3.class_tsid) == 0){
					// We have already picked up all of the food.
					this.apiSetTimerX('runTutorialStep', 0.1*1000, 'dustbunny_drink1', {});
			}else{
				this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
				dustbunny.talk(pc, 'You\'ll want the rest of that food later,<br>so pick it up.', {ok:'OK'});
			}			
			break;
		case 'pickup_item5':
			this.unrootPlayer(pc);
			// Wait 10 seconds before moving on
			if (args.msg) dustbunny.conversation_end(pc, args.msg);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 10*1000, this.getNextStep(step), null);
			break;
		case 'dustbunny_drink1':
			this.unrootPlayer(pc);
			// Open the wall to drinks and move the dustbunny to the table
			this.setStepAndWaitEvent(step, 'hitbox');
			dustbunny.apiFindPath(this.location_targets.dustbunny_table2a.x, this.location_targets.dustbunny_table2a.y, 0, "onPathing");
			break;
		case 'dustbunny_drink3':
			// Talk about drinks
			this.broadcastLocationEvent('wall_to_drinks', true);
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Ok! You\'ll need drinks to keep up your mood. Please pick one up.', {ok:'ok'});
			break;
		case 'dustbunny_drink4':
			// Move to far end of the table and wait for a pickup
			if (this.countItemClass(this.special_items.drink_1.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.drink_2.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.drink_3.class_tsid) == 0){
					this.runTutorialStep(this.getNextStep(step), null);
			}else{
				if (args.msg) dustbunny.conversation_end(pc, args.msg);
				this.setStepAndWaitEvent(step, 'items_added', pc);
				dustbunny.apiFindPath(this.location_targets.dustbunny_table2b.x, this.location_targets.dustbunny_table2b.y, 0, "onPathing");
			}
			break;
		case 'dustbunny_drink5':
			this.setStepAndWaitEvent(step, 'overlay_dismissed');
			this.broadcastLocationEvent('first_drink_overlay', false);
			break;
		case 'drink_wait_drink':
			// Talk about drinking and wait until drank
			if (pc.metabolics_get_mood() >= 100){
				this.runTutorialStep(this.getNextStep(step), null);
			}else{
				this.setStepAndWaitEvent(step, 'items_drank');
				this.apiSetTimerX('showCallout', 1*1000, pc, 'drink', 0, {slot_id:this.last_stack_added, offset_x:5, offset_y:20});
				dustbunny.apiSetTimerX('sendBubble', 2*1000, 'Good, now drink it!', 3*1000, pc);
			}
			break;
		case 'drink_drank':
			// User drank so show mood UI and talk about it
			this.rootPlayer(pc);
			this.hideCallout(pc);
			this.apiSetTimerX('showCallout', 2.75*1000, pc, 'mood', 5*1000, {})
			pc.apiSetTimerX('changeUIComponent', 2*1000, 'mood', true);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 5.75*1000, this.getNextStep(step), null);
			break;
		case 'drink_pickup1':
			// If they havent picked everything up, tell them to
			if (this.countItemClass(this.special_items.drink_1.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.drink_2.class_tsid) == 0 && 
			 	this.countItemClass(this.special_items.drink_3.class_tsid) == 0){
					// We have already picked up all of the drinks.
					this.apiSetTimerX('runTutorialStep', 0.1*1000, 'dustbunny_egg0', {});
			}else{
				this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
				dustbunny.talk(pc, 'Snag the rest of those drinks for later. They\'ll come in handy.', {ok:'ok'});
			}			
			break;
		case 'drink_pickup2':
			// Wait 10 seconds before moving on
			this.unrootPlayer(pc);
			if (args.msg) dustbunny.conversation_end(pc, args.msg);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 10*1000, this.getNextStep(step), null);
			break;
		case 'dustbunny_egg0':
			this.unrootPlayer(pc);
			this.setStepAndWaitEvent(step, 'dustbunny_egg');
			dustbunny.apiFindPath(this.location_targets.dustbunny_eggs1.x, this.location_targets.dustbunny_eggs1.y, 0, "onPathing");
			this.broadcastLocationEvent('wall_to_eggplant', true);
			break;
		case 'dustbunny_egg1':
			// Open wall to eggplant, talk about eggs
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'OK, '+pc.getLabel()+'. I have helped<br>you out. Now it\'s time for you to<br>do the same.<split butt_txt=\"OK\">I\'m an aficionado of EGGs, but without<br>any appendages I can\'t get them myself.', {ok:'Uh huh'});
			break;
		case 'dustbunny_egg1b':
			if (args.msg) dustbunny.conversation_end(pc, args.msg);
			pc.centerCamera({x:this.location_targets.trant_egg.x, y:this.location_targets.trant_egg.y}, 1*1000);
			this.apiSetTimerX('runTutorialStep', 3*1000, this.getNextStep(step), null);
			break;
		case 'dustbunny_egg1c':
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Please jump your way to the EGG PLANT<br>up there and bring me an EGG.', {ok:'OK'});
			break;
		case 'dustbunny_egg2':
			// Dustbunny moves to position
			if (args.msg) dustbunny.conversation_end(pc, args.msg);
			pc.apiSetTimerX('sendActivity', 1*1000, 'Go up to the Egg Plant and get an Egg for the Dustbunny.', null, false, true);
			this.setStepAndWaitEvent(step, 'walking_end', dustbunny);
			dustbunny.apiFindPath(this.location_targets.dustbunny_eggs2.x, this.location_targets.dustbunny_eggs2.y, 0, "onPathing");
			break;
		case 'dustbunny_egg3':
			// Comment on eggs
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 4*1000, this.getNextStep(step), null);
			dustbunny.sendBubble('Mmmm. EGGs! Love \'em!', 4*1000, pc);
			break;
		case 'dustbunny_egg4':
			// Move dustbunny to final location
			this.setStepAndWaitEvent(step, 'walking_end', dustbunny);
			dustbunny.apiFindPath(this.location_targets.dustbunny_building.x, this.location_targets.dustbunny_building.y, 0, "onPathing");
			break;
		case 'dustbunny_egg4b':
			// Wait to receive egg
			this.setStepAndWaitEvent(step, 'egg_given', dustbunny);
			break;
		case 'dustbunny_egg5':
			// Egg given, show message and jump around
			dustbunny.sendBubble('');
			this.rootPlayer(pc);
			this.dustbunnyBounce(dustbunny, 2, 0);
			dustbunny.apiSetTimerX('sendBubble', 1*1000, 'Delicious!', 2*1000, pc);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 4*1000, this.getNextStep(step), null);
			break;
		case 'dustbunny_egg6':
			// Dustbunny talks about egg
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Thank you very much, '+pc.getLabel()+'.<br>That was SO GOOD!<br><split butt_txt=\"No problem\">As a token of my thanks,<br>let me remove these walls.', {ok:'OK'});
			break;
		case 'building_hide1':
			// Root the player and show the building (will fade in)
			this.broadcastLocationEvent('tube_building', true);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);
			pc.apiSetTimerX('sendActivity', 3*1000, 'Go and find your magic rock. Should be over on the right …', null, false, true);
			magicrock.setAndBroadcastState('read');
			magicrock.dir = 'left';
			magicrock.setInstanceProp('talk_state', 'readTalk');
			break;
		case 'building_hide2':
			// Unroot the player and tell them about the house and rock
			this.unrootPlayer(pc);
			this.setStepAndWaitEvent(step, 'talk_end', dustbunny);
			dustbunny.talk(pc, 'Good luck, '+pc.getLabel()+' — enjoy your new home!', {ok:'Bye'});
			break;
		case 'dustbunny_done1':
			// Dustbunny runs away and is deleted. Wait for magicrock hitbox hit.
			this.setStepAndWaitEvent(step, 'magicrock_reveal');
			if (dustbunny){
				dustbunny.setInstanceProp('walk_speed', dustbunny_maxspeed*0.50);
				dustbunny.apiFindPath(dustbunny.x-700, dustbunny.y, 0, "onPathing");
				dustbunny.apiSetTimerX('apiDelete', 3*1000);
			}
			break;
		case 'magicrock_talk1':
			// Show the magicrock and have him talk.
			this.setStepAndWaitEvent(step, 'talk_end', magicrock);
			pc.centerCamera({x:magicrock.x, y:magicrock.y}, 0);
			magicrock.apiSetTimerX('setAndBroadcastState', 1*1000, 'readBreak');
			magicrock.apiSetTimerX('conversation_start', 1.5*1000, pc, pc.getLabel()+'! Up here!', {ok:'OK'});
			break;
		case 'magicrock_talk2':
			// Center camera back on player and wait until magicrock_talk hitbox is hit
			this.setStepAndWaitEvent(step, 'magicrock_talk');
			pc.apiSetTimerX('centerCamera', 1*1000, {x:pc.x, y:pc.y}, 1);
			break;
		case 'magicrock_talk3':
			// Magicrock talks about houses
			this.setStepAndWaitEvent(step, 'talk_end', magicrock);
			magicrock.conversation_start(pc, pc.getLabel()+', my new chum.<br>I have a ticket for you.<split butt_txt=\"Good\">You can use it to pick the home street<br>style that fits your vibe the best.<split butt_txt=\"OK\">It\'s pretty easy to change your mind<br>later - just need a little imagination.<split butt_txt=\"Right\">So make your choice and I\'ll meet you<br>at your new place.', {ok:'OK'});
			break;
		case 'magicrock_talk4':
			// Magicrock forgets to give ticket, goes back to reading, then remembers
			if (args.msg) magicrock.conversation_end(pc, args.msg);

			magicrock.setAndBroadcastState('readResume');
			this.setStepAndWaitEvent(step, 'timer');
			magicrock.apiSetTimerX('setAndBroadcastState', 0.7*1000, 'readBreak');
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);
			break;
		case 'magicrock_talk5':
			// Magicrock talks about the ticket
			this.setStepAndWaitEvent(step, 'talk_end', magicrock);
			magicrock.conversation_start(pc, 'Oh right, the ticket.', {ok:'Yes …'}, null, null, null, {'dont_take_camera_focus':true});			
			break;
		case 'magicrock_talk6':
			// Magicrock gives ticket and goes back to reading
			if (args.msg) magicrock.conversation_end(pc, args.msg);
			this.setStepAndWaitEvent(step, 'timer');
			if (!pc.items_has('homestreet_ticket', 1)){
				pc.createItemFromSource('homestreet_ticket', 1, magicrock);
			}
			magicrock.not_selectable = true;
			magicrock.apiSetTimerX('setAndBroadcastState', 1*1000, 'readResume');
			this.apiSetTimerX('runTutorialStep', 1*1000, this.getNextStep(step), null);
			break;
		case 'done':
			this.setStepAndWaitEvent(step, 'done');

			if (!pc.items_has('homestreet_ticket', 1)){
				pc.createItem('homestreet_ticket', 1);
			}
			break;
	}
	
	return ret;
}

function showCallout(pc, callout_id, duration, args){
	return pc.apiSendMsg(
	{
	    type: "ui_callout",
	    section: callout_id,
	    display_time: duration, 
		slot_id:args.slot_id,
		offset_y: args.offset_y,
		offset_x: args.offset_x
	});
}

function hideCallout(pc){
	return pc.apiSendMsg(
	{
	    type: "ui_callout_cancel"
	});
}

function dustbunnyLaugh(dustbunny, max_count, left, count){
	if (left){
		dustbunny.setInstanceProp('conversation_offset_x', -50)
	}else{
		dustbunny.setInstanceProp('conversation_offset_x', 20)		
	}
	dustbunny.sendBubble('HA', 1*500, this.target_pc, null, null, true);
	if (count < (max_count-1)){
		this.apiSetTimerX('dustbunnyLaugh', 1*500, dustbunny, max_count, !left, count+1);
	}else{
		dustbunny.setInstanceProp('conversation_offset_x', 0)		
	}
}

function dustbunnyEatNag(dustbunny, alt_msg){
	if (alt_msg){
		dustbunny.sendBubble('Eat it. Mmmm!', 3*1000, this.target_pc, null, null, true);
	}else{
		dustbunny.sendBubble('Go on. Eat!', 3*1000, this.target_pc, null, null, true);
	}
	this.apiSetTimerX('dustbunnyEatNag', 6*1000, dustbunny, !alt_msg);
}

function dustbunnyWindy(dustbunny, target_x){
	var x = dustbunny.x;
	dustbunny.setInstanceProp('walk_speed', 15);
	dustbunny.apiFindPath(target_x-40, dustbunny.y, 0, "onPathing");
	dustbunny.apiSetTimerX('apiMoveToXY', 2.0*1000, target_x, dustbunny.y, 1500, null);
	this.apiSetTimerX('dustbunnyWindy', 3.4*1000, dustbunny, target_x);
}

function dustbunnyBounce(dustbunny, max_count, count){
	var y = dustbunny.y;
	dustbunny.apiMoveToXY(dustbunny.x, y-10, 1500, 'donePathing');
	dustbunny.apiSetTimerX('apiMoveToXY', 0.3*1000, dustbunny.x, y, 1500, 'donePathing');
	if (count < (max_count-1)){
		this.apiSetTimerX('dustbunnyBounce', 1*1000, dustbunny, max_count, count+1);
	}
}

function pickedUpFirstCoin(){
	var quoins = this.find_items('quoin');
	for (var i in quoins){
		if (quoins[i].x < -680 && quoins[i].spawned == 0){
			return false;
		}
	}
	return true;
}

function setupTrants(){
	var trants = this.find_items('trant_egg');
	for (var i in trants){
		trants[i].waterings = 100;
		trants[i].pettings = 100;
		trants[i].setInstanceProp('fruitCount', 1);
	}
}

function firstInventory(){
	return (this.first_inventory == undefined);
}

function firstInventoryShowOverlay(pc, stack, msg){
	this.first_inventory = {};
	this.first_inventory.stack = stack;
	this.first_inventory.pc = pc;
	this.first_inventory.msg = msg;
	
	pc.overlay_dismiss('pack_instructions');
	this.first_inventory.pc.changeUIComponent('pack', true);
	this.animatePackSlots(pc, true);
	this.broadcastLocationEvent('first_inv_overlay', false);
	return true;
}

function firstInventoryOverlayDismissed(){
	if (!this.first_inventory) return false;

	if (!this.first_inventory.stack.apiIsDeleted()){
		this.first_inventory.stack.takeable_pickup(this.first_inventory.pc, this.first_inventory.msg);
	}
	this.first_inventory.pickedup = true;
	return true;
}

function animatePackSlots(pc, enable){
	var args = {type: 'animate_pack_slots'};
	args['is_showing'] = enable;
	pc.apiSendMsgAsIs(args);
}

function broadcastLocationEvent(event, send_on_reload){
	if (!this.location_events_broadcast) this.location_events_broadcast = [];
	if (send_on_reload) this.location_events_broadcast.push(event);
	this.events_broadcast(event);
}

function rebroadcastLocationEvent(){
	if (!this.location_events_broadcast) this.location_events_broadcast = [];
	for (var i in this.location_events_broadcast){
		this.events_broadcast(this.location_events_broadcast[i]);
	}
}

function canGiveEgg(){
	return this.waiting_for.event_id == 'egg_given';
}