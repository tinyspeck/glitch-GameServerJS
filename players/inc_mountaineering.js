// Overlay display
// If isFaded is true, the overlay will fade in for the 1.5 * the number of seconds specified in 
// this.rungs[rung].freezeTime (see config.party_spaces).
function displayFreeze(rung, isFaded){ 
	//log.info("MT displaying freeze for "+rung);
	
	if (!this.party || !this.party.get_space()) { 
		log.error("MT mountain function called on player who's not in a party space"); 
		return; 
	}
	
	var rungs = this.party.get_space().getProp('rungs');
	var data = rungs[rung];
	
	for (var id in data.ids) { 
		if (isFaded) { 
			//log.info("MT Turning on "+data.ids[id]+" with fade time "+data.freezeTime*1500);
			this.geo_deco_toggle_visibility(data.ids[id], true, data.freezeTime * 1500);
		}
		else {
			//log.info("MT Turning on "+data.ids[id]);
		
			this.geo_deco_toggle_visibility(data.ids[id], true);
		}
	}
}

// Overlay removal
function removeFreeze(rung) {
	
	if (!this.party || !this.party.get_space()) { 
		log.error("MT mountain function called on player who's not in a party space"); 
		return; 
	}
	

	var rungs = this.party.get_space().getProp('rungs');
	var data = rungs[rung];

	for (var id in data.ids) { 
		//log.info("MT Turning off "+data.ids[id]);
		this.geo_deco_toggle_visibility(data.ids[id], false, 1);
	}
}

// Called at end of intro sequence
function displayAllRungs() { 
	var rungs = this.party.get_space().getProp('rungs');
	var current_freeze_rung = this.location.getCurrentFreezeRung();
	
	for (var r in rungs) { 
		if (r >= current_freeze_rung) { 
			this.displayFreeze(r);
		}
		else {
			this.removeFreeze(r);
		}
	}
	
	this.location.recordMountaineer(this.tsid);
}

// Pan the camera to a rung and turn the deco on for that rung if necessary.
// Then schedule a timer to show the next rung.
function showRung(rung) {
	//this.sendActivity("Showing rung "+rung+" current freeze at "+current_freeze_rung);

	if (!this.party || !this.party.get_space()) { 
		log.error("MT mountain function called on player who's not in a party space"); 
		return; 
	}
	
	var rungs = this.party.get_space().getProp('rungs');
	var rung_data = rungs[rung];
	
	var height = rung_data.yPos - /*0.5*/rung_data.height;
	this.sendActivity("MT Intro moving camera to "+height);
	log.info("MT intro moving camera to "+height);
	
	this.apiSendMsg({
		type: 'camera_center',
		pt:{x:0, y:height},
		duration_ms: 1500
	});
	
	//if (rung == current_freeze_rung) {
		//this.sendActivity("Scheduling freeze display");
		this.apiSetTimerX('displayAllRungs', 3000);
	//}
	
	/*if (rung > 1) {
		this.apiSetTimerX("showRung", 1500, rung-1, current_freeze_rung);
	}*/
}

function onColdZone(box) {
	var player_height = Math.round(60);
	var player_width =  Math.round(50);
	log.info("MT coldzone player pos "+this.x+" "+this.y+" dims "+player_height+" "+player_width+" box pos "+box.x+" "+box.y+" dims "+box.w+" "+box.h);
	if (this.x+(player_width/2) >= box.x-(box.w/2) && 
		this.x-(player_width/2) <= box.x+(box.w/2) &&
		this.y - player_height <= box.y &&							// top of player above bottom of box
		this.y >= box.y-box.h){	    // bottom of player below top of box
		this.metabolics_lose_energy(3);
		this.apiSetTimerX('onColdZone', 1000, box);

		log.info("MT player in coldzone");
		log.info("MT "+(this.y-player_height)+" "+box.y);
		log.info("MT "+this.y+" "+(box.y-box.h));
		
		var messages = ['Buurrr! A cold zone.',
						'Urf. A blast of chill fills your little Glitch veins.',
						'It feels colder here then other areas of the mountain.',
						'An icy chill washes over you.',
						'Soooooo Coooooold!'];


		this.apiSendAnnouncement({
			type: 'vp_canvas',
			uid: 'cold_zone',
			canvas: {
				color: '#0000cc',
				steps: [
					{alpha:.5, secs:.5},
					{alpha:.5, secs:.25},
					{alpha:0, secs:.5},
					{alpha:0, secs:3.75}
				],
				loop: false
			}
		});

		this.sendActivity(choose_one(messages));
	}
}

function onEnterVWindZone(id) { 
	this.addCTPCPhysics({	gravity: 4,						
							vx_max: 1.0
						}, this.tsid  					   
						);
					   
	this.onSendWindMessage();
	//log.info("MT entered windzone");
	this.onWindZone(id);
}

function onEnterHWindZone(id) { 
	this.addCTPCPhysics({
						//gravity: 4,
						vx_accel_add_in_air : 2,
						vx_accel_add_in_floor: 2
						//duration_ms : 4000
						}, this.tsid        						
						);
						
	this.onSendWindMessage();
	//log.info("MT entered windzone");
	this.onWindZone(id);
}

function onSendWindMessage() { 
	var messages = ["The wind is so strong here that it's like walking into a wall of air.",
						'You are suddenly blown around like a ragdoll.',
						'Urg. A sudden gust of wind hits you.',
						'A blast of wind cuts straight through to your bones.',
						"Woah! It's windy here."
						];
		
	this.sendActivity(choose_one(messages));
}

function onExitWindZone(id) { 
	this.removePhysics(this.tsid, true);
	
	this.location.removePlayerFromWind(this.tsid, id);
}         

function onWindZone(id, box) {
	//log.info("MT checking windzone");

	// If it's not a mountaineering level, bail out.
	if (!this.location.isMountain || !this.location.isMountain()) {
		return;
	}
	
	// If there's no box, then find the box (this happens the first time through).
	if (!box) {
		box = this.location.find_hitbox_by_id(id);
	}
	
	// If the id was bad, then bail out.
	if (!box) return;
	
	//log.info("MT windzone box is "+box);
	
	var player_height = Math.round(60);
	var player_width =  Math.round(50);
	
	//log.info("MT player height "+player_height+" width "+player_width);
	//log.info("MT player position "+this.x+" "+this.y);
	
	
	if (this.x+(player_width/2) >= box.x-(box.w/2) && 
		this.x-(player_width/2) <= box.x+(box.w/2) &&
		this.y - player_height <= box.y &&	// top of player above bottom of box
		this.y >= box.y-box.h){			    // bottom of player below top of box
		//log.info("MT in windzone");
		this.apiSetTimerX('onWindZone', 500, id, box);
	}
	else { 
		//log.info("MT out of windzone");
		//this.sendActivity("Whew. You're out of the wind. "); 
		this.onExitWindZone(id);
	}
}
