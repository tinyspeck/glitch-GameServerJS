// Newxp house exterior

var is_newxp = true;

function hitBox(pc, id, in_box){
	log.info('newxp_house_exterior: '+pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));
}

function playerEnterCallback(pc){
	var rock = this.findFirst('magic_rock');
	if (!rock){
		this.apiSetTimerX('createRock', 2*1000, pc);
	}
	else{
		if (rock.is_visible){
			rock.apiSetTimerX('callToNewxpPlayer', 2000, pc);
		}
	}

	pc.newxpProgressCallback({
		action: 'enter',
		stage: 'house_exterior',
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	pc.newxpProgressCallback({
		action: 'exit',
		stage: 'house_picker',
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function hideUIOnLoad(ui_component, pc){
	if (ui_component == 'pack') return false;
	if (ui_component == 'energy') return false;
	if (ui_component == 'mood') return false;
	return true;
}

function createRock(pc){
	log.info(this+' newxp_house_exterior creating rock at: '+(pc.x+240)+', '+-144);
	var rock = this.createItemStack('magic_rock', 1, pc.x+240, -144);
	if (rock){
		rock.not_selectable = true;
		rock.onPlayerEnter(pc);
	}
}