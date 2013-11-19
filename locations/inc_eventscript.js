
function getNextStep(step){

	for (var i in this.eventscript_steps){
		i = intval(i);
		if (i < this.eventscript_steps.length-1 && step == this.eventscript_steps[i]){
			return this.eventscript_steps[i+1];
			break;
		}
	}

	return null;
}

function isStepAfter(step, delta){
	if (step == delta) return false;

	var found_delta = false;
	for (var i in eventscript_steps){
		i = intval(i);
		if (delta == eventscript_steps[i]){
			found_delta = true;
		}
		if (step == eventscript_steps[i]){
			return found_delta;
			break;
		}
	}

	return false;
}

function isStepBefore(step, delta){
	if (step == delta) return false;

	var found_delta = false;
	for (var i in eventscript_steps){
		i = intval(i);
		if (delta == eventscript_steps[i]){
			found_delta = true;
		}
		if (step == eventscript_steps[i]){
			return (found_delta == false);
			break;
		}
	}

	return false;
}

function eventFired(event_id, target, args){
	var ret = {};
	
	log.info('eventScript - eventFired: '+event_id+' -- '+target+' -- '+args);
	
	if (!this.eventScriptEventFired(event_id, target, args)) return;

	if (!this.eventscript || this.eventscript.current_step == undefined) return;

	if (this.eventscript.waiting_for.event_id == event_id){
		if (!this.eventscript.waiting_for.target || this.eventscript.waiting_for.target == target){
			ret = this.eventScriptStep(this.getNextStep(this.eventscript.current_step), args);
		}
	}

	return ret;
}


function setStepAndWaitEvent(step, event_id, target){
	if (!this.eventscript) this.eventscript = {};
	this.eventscript.current_step = step;
	this.eventscript.waiting_for = {event_id:event_id, target:target};
}

function eventScriptReset(){
	delete this.eventscript;
}

function eventScriptStep(step, args){
	return {};
}

function hitBox(pc, id, in_box){
	if (id.substring(0,11) == 'quest:flag:'){
		return pc.quests_set_flag(id.substr(11));
	}
	else if (id.substring(0,12) == 'quest:count:'){
		return pc.quests_set_flag(id.substr(12));
	}
	else if (id.substring(0,6) == 'quest:'){
		return pc.completeQuest(id.substr(6));
	}

	if (this.eventScriptHitBox(pc, id, in_box)){
		return this.eventFired(id, this, {pc:pc});
	}
}


// Functions to be overwritten
function eventScriptHitBox(pc, id, in_box)				{ return true; }
function eventScriptEventFired(event_id, target, args)	{ return true; }


