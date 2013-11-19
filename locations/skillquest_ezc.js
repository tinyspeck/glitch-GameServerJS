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
	'flamingo_fly2',
	'flamingo_2_talk1',
	'eventscript_end',
];	

var location_targets = {
	'initial_player': {x:123, y:-958},
	'initial_flamingo': {x:370, y:-93},
	'initial_flamingo_2': {x:3304, y:-110},
	'food_1_1': {x:996, y:-192},
	'food_1_2': {x:1054, y:-192},
	'food_2_1': {x:1735, y:-193},
	'food_2_2': {x:1802, y:-194},
	'food_3_1': {x:2459, y:-193},
	'food_3_2': {x:2511, y:-194},
	'food_3_3': {x:2570, y:-193},
};

var special_items = {
	'food_1_1': {class_tsid:'cheese', count:1},
	'food_1_2': {class_tsid:'tomato', count:2},
	'food_2_1': {class_tsid:'bun', count:1},
	'food_2_2': {class_tsid:'meat', count:1},
	'food_3_1': {class_tsid:'bun', count:10},
	'food_3_2': {class_tsid:'cheese', count:5},
	'food_3_3': {class_tsid:'meat', count:5},
}


function playerEnterCallback(pc){
	if (pc.newxp_step && pc.newxp_step.stage == 'skillquest_ezc' && pc.newxp_step.step != undefined){
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
		stage: 'skillquest_ezc',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	pc.newxp_step = {stage: 'skillquest_ezc', step:this.eventscript.current_step};

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'skillquest_ezc',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
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

function eventScriptHitBox(pc, id, in_box){
	switch (id){
		case 'trant1':
			if (!this.area_clear || !this.area_clear.area1){
				this.broadcastLocationEvent('top1');
			}
			break;
		case 'trant2':
			if (!this.area_clear || !this.area_clear.area2){
				this.broadcastLocationEvent('top2');
			}
			break;
		case 'trant3':
			if (!this.area_clear || !this.area_clear.area3){
				this.broadcastLocationEvent('top3');
			}
			break;
		case 'knifeandboard':
			if (!this.area_clear || !this.area_clear.area0){
				this.broadcastLocationEvent('knifesign');
			}
			break;
	}

	return true;
}

function onLeavingHitBox(pc, id){
	switch (id){
		case 'trant1':
			this.broadcastLocationEvent('bottom1off');
			break;
		case 'trant2':
			this.broadcastLocationEvent('bottom2off');
			break;
		case 'trant3':
			this.broadcastLocationEvent('bottom3off');
			break;8
		case 'knifeandboard':
			this.broadcastLocationEvent('knifesignoff');
			break;
	}
}

function reset(pc){
	this.eventScriptReset();
	
	delete this.location_events_broadcast;

	this.deleteFlamingos();
	this.target_pc = pc;
	this.eventScriptStep('eventscript_start', {pc:pc});
	pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);

	// Remove and re-create any items
	this.removeItems(this.special_items.food_1_1.class_tsid);
	this.removeItems(this.special_items.food_1_2.class_tsid);
	this.removeItems(this.special_items.food_2_1.class_tsid);
	this.removeItems(this.special_items.food_2_2.class_tsid);
	this.removeItems(this.special_items.food_3_1.class_tsid);
	this.removeItems(this.special_items.food_3_2.class_tsid);
	this.removeItems(this.special_items.food_3_3.class_tsid);
	this.createItemStack(this.special_items.food_1_1.class_tsid, this.special_items.food_1_1.count, this.location_targets.food_1_1.x, this.location_targets.food_1_1.y);
	this.createItemStack(this.special_items.food_1_2.class_tsid, this.special_items.food_1_2.count, this.location_targets.food_1_2.x, this.location_targets.food_1_2.y);
	this.createItemStack(this.special_items.food_2_1.class_tsid, this.special_items.food_2_1.count, this.location_targets.food_2_1.x, this.location_targets.food_2_1.y);
	this.createItemStack(this.special_items.food_2_2.class_tsid, this.special_items.food_2_2.count, this.location_targets.food_2_2.x, this.location_targets.food_2_2.y);
	this.createItemStack(this.special_items.food_3_1.class_tsid, this.special_items.food_3_1.count, this.location_targets.food_3_1.x, this.location_targets.food_3_1.y);
	this.createItemStack(this.special_items.food_3_2.class_tsid, this.special_items.food_3_2.count, this.location_targets.food_3_2.x, this.location_targets.food_3_2.y);
	this.createItemStack(this.special_items.food_3_3.class_tsid, this.special_items.food_3_3.count, this.location_targets.food_3_3.x, this.location_targets.food_3_3.y);
}

function eventScriptEventFired(event_id, target, args){
	if (event_id == 'items_added'){
		if (!this.area_clear) this.area_clear = {};

		if (args.stack && args.stack.class_tsid == 'knife_and_board'){
			this.area_clear.area0 = true;
			this.broadcastLocationEvent('can', true);
		}
		if (args.stack && args.stack.class_tsid == 'lazy_salad'){
			this.broadcastLocationEvent('top1_2off', true);
		}
		if (this.countItemClass(this.special_items.food_1_1.class_tsid) == 1 && 
		 	this.countItemClass(this.special_items.food_1_2.class_tsid) == 0){
				this.area_clear.area1 = true;
				this.broadcastLocationEvent('bottom1off', true);
				this.broadcastLocationEvent('top1_2', true);
		}
		if (this.countItemClass(this.special_items.food_2_1.class_tsid) == 1 && 
		 	this.countItemClass(this.special_items.food_2_2.class_tsid) == 1){
				this.area_clear.area2 = true;
				this.broadcastLocationEvent('bottom2off', true);
		}
		if (this.countItemClass(this.special_items.food_3_1.class_tsid) == 0 && 
		 	this.countItemClass(this.special_items.food_3_2.class_tsid) == 0 && 
		 	this.countItemClass(this.special_items.food_3_3.class_tsid) == 0){
				this.area_clear.area3 = true;
				this.broadcastLocationEvent('bottom3off', true);
		}
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
			this.setStepAndWaitEvent(step, 'flamingo_talk1', flamingo);
			break;
		case 'timer_1':
			this.rootPlayer(pc);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('eventScriptStep', 1*1000, this.getNextStep(step), null);
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
			this.apiSetTimerX('eventScriptStep', 1.5*1000, this.getNextStep(step), null);
			break;
		case 'flamingo_1_talk3':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Time for EZ Cooking is it?', [{txt:'Mmm Hmm!', value:'ok'}], 'tall');
			break;
		case 'flamingo_1_talk4':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Ok then, grab yer Knife & Board. Let’s cook!', [{txt:'Aiight', value:'ok'}], 'short');
			break;
		case 'flamingo_fly1':
			this.setStepAndWaitEvent(step, 'flying_end');
			flamingo.startFlying(this.location_targets.initial_flamingo_2.x, this.location_targets.initial_flamingo_2.y);
			this.apiSetTimerX('unrootPlayer', 2*1000, pc);
			break;
		case 'flamingo_fly2':
			this.setStepAndWaitEvent(step, 'flamingo_talk2');
			flamingo.endFlying();
			flamingo.apiSetTimerX('endHovering', 3*1000);
			break;
		case 'flamingo_2_talk1':
			this.rootPlayer(pc);
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Now I\'m hungry! Let’s jet.', [{txt:'Bye', value:'ok'}], 'tall');
			break;
		case 'eventscript_end':
			this.setStepAndWaitEvent(step, 'done');
			this.unrootPlayer(pc);
			if (flamingo){
				if (args.msg) flamingo.conversation_end(pc, args.msg);
				flamingo.startHovering(flamingo.x, flamingo.y-2000);
				flamingo.apiSetTimerX('apiDelete', 3*1000);
			}
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

