
var is_newxp = true;

function getNextStep(step){

	for (var i in this.tutorial_steps){
		i = intval(i);
		if (i < this.tutorial_steps.length-1 && step == this.tutorial_steps[i]){
			return this.tutorial_steps[i+1];
			break;
		}
	}

	return null;
}

function isStepAfter(step, delta){
	if (step == delta) return false;

	var found_delta = false;
	for (var i in tutorial_steps){
		i = intval(i);
		if (delta == tutorial_steps[i]){
			found_delta = true;
		}
		if (step == tutorial_steps[i]){
			return found_delta;
			break;
		}
	}

	return false;
}

function isStepBefore(step, delta){
	if (step == delta) return false;

	var found_delta = false;
	for (var i in tutorial_steps){
		i = intval(i);
		if (delta == tutorial_steps[i]){
			found_delta = true;
		}
		if (step == tutorial_steps[i]){
			return (found_delta == false);
			break;
		}
	}

	return false;
}


function getFlamingo(){
	var flamingos = this.find_items('npc_flamingo');
	for (var i in flamingos){
		return flamingos[i];
	}

	return null;
}

function getDustBunny(){
	var dustbunnies = this.find_items('npc_newxp_dustbunny');
	for (var i in dustbunnies){
		return dustbunnies[i];
	}

	return null;
}

function getMagicRock(){
	var magicrocks = this.find_items('magic_rock');
	for (var i in magicrocks){
		return magicrocks[i];
	}

	return null;
}

function getDoor(){
	var doors = this.find_items('newxp_door');
	for (var i in doors){
		return doors[i];
	}

	return null;
}

function reset(){
}

function setStepAndWaitEvent(step, event_id, target){
	this.current_step = step;
	this.waiting_for = {event_id:event_id, target:target};
}

function upgradeGranted(pc, upgrade_id){
	this.eventFired('upgrade_granted', {pc:pc, upgrade_id:upgrade_id});
}

function upgradeConfirmed(pc, upgrade_id){
	this.eventFired('upgrade_confirmed', {pc:pc, upgrade_id:upgrade_id});
}

function overlayDismissed(pc){
	this.eventFired('overlay_dismissed', {pc:pc});
}

function onOverlayClicked(pc, click_payload){
	this.overlayDismissed(pc);
}

function runTutorialStep(step, args){

	return {};
}

function showInstruction(pc, instruction_id){

	if (!this.overlays_shown) this.overlays_shown = {};
	
	if (!this.overlays_shown[instruction_id]){
		pc.overlay_dismiss('pack_instructions');
		pc.announce_vp_overlay({
			overlay_key: instruction_id,
			over_pack: true,
			at_bottom: true,
			uid: 'pack_instructions',
			scale_to_stage: true,
			fade_out_sec:1
		});

		this.overlays_shown[instruction_id] = 1;
	}
}

function rootPlayer(pc){
	pc.announce_vp_overlay({
		type: "vp_overlay",
		dismissible: false,
		locking: true,
		click_to_advance: false,
		text: ['HI'],
		x: 200,
		y: -4000, // hide it!
		uid: 'newxp_locking_annc'
	});
}

function unrootPlayer(pc){
	pc.apiSendMsg({type: 'overlay_cancel', uid: 'newxp_locking_annc'});
}

/*function checkMovement(pc){
	if (!this.movement_check){
		this.movement_check = pc.x;
	}
	
	if (pc.x != this.movement_check){
		this.pc_last_movement = getTime();
		this.movement_check = pc.x;
		delete this.pc_last_movement_prompted;
	}
	
	if (!this.pc_last_movement_prompted && getTime() - this.pc_last_movement > 60*1000){
		if (this.hint_direction == 'right'){
			pc.prompts_add_simple('Time to move along. Try going right?', 5);
		}else if (this.hint_direction == 'up'){
			pc.prompts_add_simple('Time to move along. Try going up?', 5);
		}
		this.pc_last_movement_prompted = true;
	}

	this.apiSetTimerX('checkMovement', 2*1000, pc);
}*/

function onPlayerReconnect(pc){
	
	if (this.current_img_menu){
		this.showImaginationMenu(pc);
	}
	
	if (this.current_overlay){
		this.showOverlay(pc, this.current_overlay);
	}
	
	this.apiSetTimerX('setupLocationEvents', 1*1000);

	// Are we coming in midway through the tutorial?
	if (this.current_step && this.runTutorialStep){
		// Run their current step
		this.runTutorialStep(this.current_step, {pc:pc, from_reload:true});
	}else if (this.reset){
		this.reset();
	}
}


function showOverlay(pc, overlay_key){
	this.current_overlay = overlay_key;
	pc.announce_vp_overlay({
		overlay_key: overlay_key,
		locking: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			dismiss_on_click: true,
			click_payload: {
				location_callback: 'overlayDismissed'
			}
		},
	});
}

function showImaginationMenu(pc){
	if (!pc) pc = this.target_pc;
	if (!pc) return;

	this.current_img_menu = true;
	pc.imagination_reduce_to_hand();
	pc.apiSendMsg({
		type: 'open_img_menu',
		section: 'upgrades',
		hide_close: true
	});
}

function openImaginationUpgradeMenu(pc){
	return this.showImaginationMenu(pc);
}
