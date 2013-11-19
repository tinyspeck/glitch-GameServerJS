//#include inc_eventscript.js	
//#include inc_skillquest.js	

var is_skillquest = true;

var eventscript_steps = [
	'eventscript_start',
	'timer_1',
	'flamingo_1_talk1',
	'flamingo_1_talk3',
	'flamingo_1_talk4',
	'flamingo_fly1',
	'eventscript_end',
];	

var location_targets = {
	'initial_player': {x:123, y:-958},
	'initial_flamingo': {x:370, y:-93},
	'initial_flamingo_2': {x:2750, y:-110},
	'chicken': {x:708, y:-101},
	'piggy': {x:1434, y:-104},
	'butterfly': {x:2190, y:-260},
	'butterfly_lotion': {x:1823, y:-190},
};

var special_items = {
}


function playerEnterCallback(pc){
	if (pc.newxp_step && pc.newxp_step.stage == 'skillquest_ak' && pc.newxp_step.step != undefined){
		this.eventScriptStep(pc.newxp_step.step, {pc:pc});
		delete pc.newxp_step;
	}else{
		this.setupTeleporter(pc);
		this.reset(pc); 
	}

	this.apiSetTimerX('broadcastLocationEvent', 1*1000, 'wall_off', false);
	this.apiSetTimerX('rebroadcastLocationEvent', 1*1000);

	pc.newxpProgressCallback({
		action: 'enter',
		stage: 'skillquest_ak',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	if (this.eventscript){
		pc.newxp_step = {stage: 'skillquest_ak', step:this.eventscript.current_step};
	}

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'skillquest_ak',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function eventScriptHitBox(pc, id, in_box){
	return true;
}

function onLeavingHitBox(pc, id){
}

function hideUIOnLoad(ui_component, pc){
	if (ui_component == 'pack') return false;
	if (ui_component == 'energy') return false;
	if (ui_component == 'mood') return false;
	if (ui_component == 'furniture_bag') return false;
	if (ui_component == 'imagination' && (pc && pc.has_done_intro)) return false;
	if (ui_component == 'skill_learning' && (pc && pc.has_done_intro)) return false;
	if (ui_component == 'home_street_visiting' && (pc && pc.has_done_intro)) return false;
	return true;
}

function reset(pc){
	this.eventScriptReset();

	delete this.location_events_broadcast;

	this.deleteFlamingos();
	this.target_pc = pc;
	this.eventScriptStep('eventscript_start', {pc:pc});
	pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);
	
	delete this.spawnedChicken;
	delete this.spawnedPiggy;
	delete this.spawnedButterfly;

	// Remove and re-create any items
	this.removeItems('npc_chicken');
	this.removeItems('npc_piggy');
	this.removeItems('npc_butterfly');
	this.removeItems('butterfly_lotion');
	this.createItemStack('butterfly_lotion', 1, this.location_targets.butterfly_lotion.x, this.location_targets.butterfly_lotion.y);
}

function eventScriptEventFired(event_id, target, args){
	switch (event_id){
		case 'items_added':
			if (args.stack && args.stack.class_tsid == 'butterfly_lotion'){
				this.broadcastLocationEvent('lotion_off', true);
			}
			break;
		case 'verb_milk_success':
			var butterfly = this.getAnimal('npc_butterfly');
			if (butterfly){
				butterfly.apiSetTimerX('deleteWithPoof', 2.5*1000, 20, 100);
			}
			break;
		case 'verb_massage_success':
			this.apiSetTimerX('broadcastLocationEvent', 2.5*1000, 'sign4off', true);
			break;
		case 'verb_squeeze_success':
			if (!this.squeeze_count) this.squeeze_count = 0;
			this.squeeze_count += 1;
			if (this.squeeze_count >= 2){
				var chicken = this.getAnimal('npc_chicken');
				if (chicken){
					chicken.apiSetTimerX('deleteWithPoof', 2.5*1000, 20, 100);
					this.apiSetTimerX('broadcastLocationEvent', 2.5*1000, 's1off', true);
				}				
				delete this.squeeze_count;
			}
			break;
		case 'verb_nibble_success':
			var piggy = this.getAnimal('npc_piggy');
			if (piggy){
				piggy.apiSetTimerX('deleteWithPoof', 2.5*1000, 20, 100);
			}
			break;
		case 'verb_pet_success':
			this.apiSetTimerX('broadcastLocationEvent', 2.5*1000, 's2off', true);
			break;
	}

	return true;
}

function eventScriptStep(step, args){

	var flamingo = this.getFlamingo();

	this.apiCancelTimer('eventScriptStep');
	
	var ret = {};
	var pc = this.target_pc;
	if (!pc){
		return ret;
	}

	switch (step){
		case 'eventscript_start':
			this.setStepAndWaitEvent(step, 'flamingo_talk1');
			break;
		case 'timer_1':
			this.rootPlayer(pc);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('eventScriptStep', 1*1000, this.getNextStep(step), {});
			break;
		case 'flamingo_1_talk1':
			if (!flamingo){
				flamingo = this.createItemStackWithPoof('npc_flamingo', 1, this.location_targets.initial_flamingo.x, this.location_targets.initial_flamingo.y);
			}
			flamingo.setInstanceProp('active_head', 'tall');
			flamingo.dir = 'left';
			flamingo.setAndBroadcastState('idle0');
			flamingo.setInstanceProp('walk_speed', 1000);
			flamingo.apiMoveToXY(this.location_targets.initial_flamingo.x, this.location_targets.initial_flamingo.y, 1000, null);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('eventScriptStep', 1.5*1000, this.getNextStep(step), {});
			break;
		case 'flamingo_1_talk3':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'So … it’s Animal Kinship, eh? Alright then. Let’s practice!', [{txt:'OK', value:'ok'}], 'tall');
			break;
		case 'flamingo_1_talk4':
			if (args.msg) flamingo.conversation_end(pc, args.msg);
			this.setStepAndWaitEvent(step, 'active_head_set', flamingo);
			flamingo.setActiveHead('short');
			break;
		case 'flamingo_fly1':
			this.setStepAndWaitEvent(step, 'flying_end');
			flamingo.startFlying(this.location_targets.initial_flamingo_2.x, this.location_targets.initial_flamingo_2.y);
			this.apiSetTimerX('unrootPlayer', 2*1000, pc);
			break;
		case 'eventscript_end':
			this.setStepAndWaitEvent(step, 'done');
			flamingo.apiDelete();
			break;
	}
	
	return ret;
}

function getFlamingo(){
	var flamingos = this.find_items('npc_flamingo');
	for (var i in flamingos){
		return flamingos[i];
	}

	return null;
}

function deleteFlamingos(){
	var items = this.find_items('npc_flamingo');
	for (var i in items){
		items[i].apiDelete();
	}
}

function getAnimal(animal){
	var animals = this.find_items(animal);
	for (var i in animals){
		return animals[i];
	}

	return null;
}

function spawnChicken(){
	if (this.spawnedChicken) return;
	var chicken = this.createItemStackWithPoof('npc_chicken', 1, this.location_targets.chicken.x, this.location_targets.chicken.y);
	chicken.apiSetTimerX('sendBubble', 2*1000, 'Go ahead, squeeze me!', 5*1000);
	chicken.ignore_sadness = true;
	this.spawnedChicken = true;
}

function spawnPiggy(){
	if (this.spawnedPiggy) return;
	var piggy = this.createItemStackWithPoof('npc_piggy', 1, this.location_targets.piggy.x, this.location_targets.piggy.y);
	piggy.apiSetTimerX('sendBubble', 2*1000, 'Get your nibble on!', 5*1000);
	piggy.ignore_sadness = true;
	piggy.setInstanceProp('dont_die', 1);
	this.spawnedPiggy = true;
}

function spawnButterfly(){
	if (this.spawnedButterfly) return;
	var butterfly = this.createItemStackWithPoof('npc_butterfly', 1, this.location_targets.butterfly.x, this.location_targets.butterfly.y);
	butterfly.apiSetTimerX('sendBubble', 2*1000, 'Mmmm, massage me!', 5*1000);
	butterfly.ignore_sadness = true;
	this.spawnedButterfly = true;
}