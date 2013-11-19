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


function playerEnterCallback(pc){
	if (pc.newxp_step && pc.newxp_step.stage == 'skillquest_lgt' && pc.newxp_step.step != undefined){
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
		stage: 'skillquest_lgt',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	pc.newxp_step = {stage: 'skillquest_lgt', step:this.eventscript.current_step};

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'skillquest_lgt',
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
			if (!this.trant_events || !this.trant_events.watered){
				this.broadcastLocationEvent('bottom1', false);
			}
			break;
		case 'trant2':
			if (!this.trant_events || !this.trant_events.petted){
				this.broadcastLocationEvent('bottom2', false);
			}
			break;
		case 'trant3':
			if (!this.trant_events || !this.trant_events.harvested){
				this.broadcastLocationEvent('bottom3', false);
			}
			break;
		case 'wateringcan':
			if (!this.trant_events || !this.trant_events.wateringcan){
				this.broadcastLocationEvent('wateringcan_on', false);
			}
			break;
	}

	return true;
}

function onLeavingHitBox(pc, id){
	switch (id){
		case 'trant1':
			this.broadcastLocationEvent('bottom1off', false);
			break;
		case 'trant2':
			this.broadcastLocationEvent('bottom2off', false);
			break;
		case 'trant3':
			this.broadcastLocationEvent('bottom3off', false);
			break;
		case 'wateringcan':
			this.broadcastLocationEvent('wateringcan_off', false);
			break;
	}
}

function reset(pc){
	this.eventScriptReset();

	this.deleteFlamingos();
	this.target_pc = pc;
	this.eventScriptStep('eventscript_start', {pc:pc});
	pc.teleportToLocation(this.tsid, 123, -958);
	this.trant_events = {};
}

function eventScriptEventFired(event_id, target, args){
	switch (event_id){
		case 'verb_water': 
			if (target.class_tsid == 'trant_fruit'){
				this.broadcastLocationEvent('bottom1off', true);
				this.trant_events.watered = true;
			}else if (target.class_tsid == 'trant_bubble'){
				if (this.trant_events.bubble_tended_already){
					this.broadcastLocationEvent('bottom3off', true);
				}
				this.trant_events.bubble_tended_already = true;
				this.trant_events.watered = true;
			}
			break;
		case 'verb_pet': 
			if (target.class_tsid == 'trant_bean'){
				this.broadcastLocationEvent('bottom2off', true);
				this.trant_events.petted = true; 
			}else if (target.class_tsid == 'trant_bubble'){
				if (this.trant_events.bubble_tended_already){
					this.broadcastLocationEvent('bottom3off', true);
				}
				this.trant_events.bubble_tended_already = true;
				this.trant_events.petted = true; 
			}
			break;
		case 'verb_harvest': 
			if (target.class_tsid == 'trant_bubble'){
				this.broadcastLocationEvent('bottom3off', true);
				this.trant_events.harvested = true; 
			}
			break;
		case 'items_added':
			if (args.stack && args.stack.class_tsid == 'watering_can'){
				this.broadcastLocationEvent('can', true);
				this.trant_events.wateringcan = true;
			}
			break;
	}
	
	return true;
}

function eventScriptStep(step, args){

	var flamingo = this.getFlamingo();

	this.apiCancelTimer('runStep');
	
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
				flamingo = this.createItemStackWithPoof('npc_flamingo', 1, 370, -93);
			}
			flamingo.setInstanceProp('active_head', 'tall');
			flamingo.dir = 'left';
			flamingo.setAndBroadcastState('idle0');
			flamingo.setInstanceProp('walk_speed', 1000);
			flamingo.apiMoveToXY(370, -93, 1000, null);
			this.setStepAndWaitEvent(step, 'timer');
			this.apiSetTimerX('eventScriptStep', 1.5*1000, this.getNextStep(step), null);
			break;
		case 'flamingo_1_talk3':
			this.setStepAndWaitEvent(step, 'talk_end', flamingo);
			flamingo.talk(pc, 'Light Green Thumb? Let’s practice!', [{txt:'Aiight', value:'ok'}], 'tall');
			break;
		case 'flamingo_1_talk4':
			if (args.msg) flamingo.conversation_end(pc, args.msg);
			this.setStepAndWaitEvent(step, 'active_head_set', flamingo);
			flamingo.setActiveHead('short');
			break;
		case 'flamingo_fly1':
			this.setStepAndWaitEvent(step, 'flying_end');
			flamingo.startFlying(3183, -99);
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

function trantVerbAvailable(trant_class_tsid, verb){
	if (verb == 'talk_to') return {state:null};
	
	switch (trant_class_tsid){
		case 'trant_fruit': 
			if (verb != 'water' && (!this.trant_events || !this.trant_events.watered)) return {state:'disabled', reason:'Water it first.'};
			break;
		case 'trant_bean': 
			if (verb != 'pet' && (!this.trant_events || !this.trant_events.petted)) return {state:'disabled', reason:'Pet it first.'}; 
			break;
	}
	
	return null;
}

