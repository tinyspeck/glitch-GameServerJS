//#include inc_eventscript.js	
//#include inc_skillquest.js	

var is_skillquest = true;

var eventscript_steps = [
	'eventscript_start',
	'timer_1',
	'flamingo_1_talk1',
	'flamingo_1_talk2',
	'flamingo_1_talk4',
	'flamingo_fly1',
	'flamingo_fly2',
	'flamingo_2_talk1',
	'eventscript_end',
];	

var location_targets = {
	'initial_player': {x:123, y:-958},
	'initial_flamingo': {x:370, y:-93},
	'initial_flamingo_2': {x:2797, y:-110},
};

function playerEnterCallback(pc){
	if (pc.newxp_step && pc.newxp_step.stage == 'skillquest_sa' && pc.newxp_step.step != undefined){
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
		stage: 'skillquest_sa',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	pc.newxp_step = {stage: 'skillquest_sa', step:this.eventscript.current_step};

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'skillquest_sa',
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
	return true;
}

function reset(pc){
	this.eventScriptReset();
	
	delete this.location_events_broadcast;

	this.deleteFlamingos();
	this.target_pc = pc;
	this.eventScriptStep('eventscript_start', {pc:pc});
	pc.teleportToLocation(this.tsid, this.location_targets.initial_player.x, this.location_targets.initial_player.y);
}

function eventScriptEventFired(event_id, target, args){
	if (event_id == 'items_added'){
		if (args.stack && (args.stack.class_tsid == 'shovel' || args.stack.class_tsid == 'hoe')){
			if (this.countItemClass('shovel') == 0 && this.countItemClass('hoe') == 0){
			 	this.apiSetTimerX('broadcastLocationEvent', 1.5*1000, 'light', true);
			}
		}
	}
	
	if (event_id == 'verb_tend' && target.class_tsid == 'patch'){
		this.patch_tended = true;
	}

	if (event_id == 'verb_plant' && target.class_tsid == 'patch'){
	 	this.apiSetTimerX('broadcastLocationEvent', 5*1000, 'sign2_off', true);
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
		case 'flamingo_1_talk2':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Soil Appreciation. It\'s pretty simple stuff.', [{txt:'Elementary?', value:'ok'}], 'tall');
			break;
		case 'flamingo_1_talk4':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Grittier. Let\'s get dirty!', [{txt:'OK', value:'ok'}], 'short');
			break;
		case 'flamingo_fly1':
			this.setStepAndWaitEvent(step, 'flying_end');
			flamingo.startFlying(this.location_targets.initial_flamingo_2.x, this.location_targets.initial_flamingo_2.y);
			this.apiSetTimerX('unrootPlayer', 2*1000, pc);
			break;
		case 'flamingo_fly2':
			this.setStepAndWaitEvent(step, 'done');
			if (flamingo) flamingo.apiDelete();
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

function verbAvailable(class_tsid, verb){
	var ret = null;
	
	if (class_tsid == 'patch'){
		if (verb == 'dig' && !this.patch_tended){
			return {state:'disabled', reason:'You must tend this Patch first'};
		}
	}
	return ret;	
}


