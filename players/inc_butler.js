
function createButler(x_pos) {
	
	if (this.butler_tsid) { 
	
		var old_butler = apiFindObject(this.butler_tsid);
		
		if (!old_butler || (old_butler.location != this.home.exterior)) {
			// check for error cases - if we find one, just delete the butler and start over
			this.removeButler();
		}
		else { 
			this.sendActivity("You already have a Butler.");
			return; // only one butler per person 
		}
	} 
	
	var loc = this.home.exterior;
	
	if (!loc) { return; }
	
	var butler = null;
	if (loc == this.location) { 
		if (Math.abs(x_pos - this.x) < 25) { 
			if ((this.x +50) < this.location.geo.r) {
				x_pos = this.x +50;
			}
			else {
				x_pos = this.x - 50;
			}
		}
		
		butler = this.location.createItemStackWithPoof('bag_butler', 1, x_pos, this.y);
	}
	else {
		this.sendActivity("You must be on your home street to create a butler.");
	}
	
	if (butler) {
		butler.setInstanceProp('owner_tsid', this.tsid);
		this.butler_tsid = butler.tsid;
		butler.randomize();
		
		butler.apiSetTimerX("doIntro", 2000, this); //.doIntro(this);
		
		// Can't update the butler on creation because the location isn't set yet. Do it here instead:
		butler.stateChange("attending", "start");
		this.last_command_time = getTime();
		butler.stepBackFromPlayer(this, this.x);
		
		butler.onUpdate();
	}
}

function removeButler(){
	if (!this.butler_tsid) { return; }
	
	var butler = apiFindObject(this.butler_tsid);
	
	log.info("Deleting butler "+butler);
	
	if (butler) {
		butler.im_close(this);
		butler.apiDelete();
	}
	
	delete this.butler_tsid;
}

function has_butler(){
	return this.butler_tsid ? true : false;
}

function giveButlerBox() { 

	if (this.has_butler()) { 
		return;
	}

	if (!this.has_done_intro || this.return_to_gentle_island || this.getQuestStatus('leave_gentle_island') == 'todo'){
		return;
	}
	
	if (this.stats_get_level() < 3) { 
		return;
	}
	
	if (this.home && this.home.exterior && this.home.exterior.item_exists("butler_box")) { 
		return;
	}
	
	if (this.home && this.home.exterior) { 
		this.home.exterior.createItemStackWithPoof('butler_box', 1, 50, -97);
	}
}

function getButler(){
	if (this.butler_tsid) {
		return apiFindObject(this.butler_tsid);
	}

	return null;
}

// Transmit info to butlers for improved buttling

function notifyButlersAboutTower(){

	var tower_data = {  player: this.tsid, 
						completion_time: time()        // timestamp in seconds
					};
				 
	var tsids = this.buddies_get_reverse_tsids();

	var player = null;
	var butler = null;
	for (var id in tsids) { 
		player = getPlayer(tsids[id]);
		if (player) {
			butler = player.getButler();
			if (butler) {
				butler.notifyAboutTower(tower_data);
			}
		}
	}
}


