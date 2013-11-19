// Introduction/Cloud Level
// Geo: http://staging.glitch.com/god/world_street.php?tsid=LIFBFC7TDJ535UL
// Jump: http://staging.glitch.com/jump.php?t=LIFBFC7TDJ535UL&x=32&y=-4171

var is_newxp = true;

function hitBox(pc, id, in_box){
	log.info('newxp_intro: '+pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));

	if (id == 'arrowKeysToMove' && !this.instructions_dismissed){
		pc.announce_vp_overlay({
			overlay_key: 'move_instructions_overlay',
			over_pack: true,
			at_bottom: true,
			uid: 'pack_instructions',
			scale_to_stage: true,
			fade_out_sec:1
		});

		this.checkMovement(pc);
		this.received_instructions = true;
		return;
	}
}

function playerEnterCallback(pc){
	if (!this.instructions_dismissed && this.received_instructions){
		pc.announce_vp_overlay({
			overlay_key: 'move_instructions_overlay',
			over_pack: true,
			at_bottom: true,
			uid: 'pack_instructions',
			scale_to_stage: true,
			fade_out_sec:1
		});
		this.checkMovement(pc);
	}
	
	pc.use_img = true;
	delete pc.newxp_step;
	
	if (!pc.intro_steps) pc.intro_steps = {};

	pc.newxpProgressCallback({
		action: 'enter',
		stage: 'clouds',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	pc.use_img = true;
	this.apiCancelTimer('checkMovement');

	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'clouds',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function checkMovement(pc){
	if (!this.movement_check){
		this.movement_check = pc.x;
	}
	
	if (pc.x - this.movement_check > 50){
		pc.apiSetTimerX('apiSendMsg', 0.5*1000, {type: 'overlay_cancel', uid: 'pack_instructions'});
		this.instructions_dismissed = true;

	}else{
		this.apiSetTimerX('checkMovement', 0.5*1000, pc);
	}
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
