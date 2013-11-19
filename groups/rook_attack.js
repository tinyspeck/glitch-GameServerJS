function initialize(hubid) {
	log.info("Starting new rook attack on hub "+hubid);
	this.hubid = hubid;
	
	this.setup();
}

function setup() {
	this.locations = {};
	this.locations.epicentre = {};
	this.locations.outlying = {};
	
	// Behavioural constants
	this.angry_time = 180;
	this.max_stun = 1000;
	this.max_stun_failures = 5;
	
	// Text messages
	this.stunned_text = 'The rook has been stunned. Now is your chance to fight back!';
	
	// Variable things
	this.health = this.max_health;
	this.stun = 0;
	this.phase = 'build_up';
	this.stun_failures = 0;
	
	this.running = false;
}

function newLocation() {
	var mote = config.data_maps.hubs[this.hubid].mote_id;

	// and finally, find a new street
	var street = null;
	var loc = null;
	var street_num = 0;
	var done = true;
	
	var attack_candidates = [];
	
	for (var i in config.data_maps.streets[mote][this.hubid]) {
		attack_candidates.push(i);
	}
	do {
		street_num = randInt(0, attack_candidates.length - 1);
		done = true;
		street = attack_candidates[street_num];
		array_remove(attack_candidates, street_num);
		loc = apiFindObject(street);
		if(!loc || !loc.isRookable() || loc.isRooked() || loc.tsid == this.last_location) {
			done = false;
		}
	} while (!done && attack_candidates.length);
	
	if (!loc || !loc.isRookable() || loc.isRooked() || loc.tsid == this.last_location) {
		// Couldn't find a good candidate.
		log.error("Could not find location for Rook attack. Deleting.");
		this.apiDelete();
		return;
	}
	
	log.info("Starting Rook attack in location "+loc);
	this.addLocation(loc, true);
	
	this.last_location = loc.tsid;
}

function setSchedule(min_delay, max_delay) {
	this.min_delay = intval(min_delay);
	this.max_delay = intval(max_delay);
}

function scheduleAttack(min_delay, max_delay) {
	this.setSchedule(min_delay, max_delay);
	
	this.setAttackTimer();
}

function setAttackTimer() {
	var attack_delay;
	if (this.max_delay) {
		var delay_range = intval(this.max_delay) - intval(this.min_delay);
		delay_range *= Math.random();
		attack_delay = delay_range + intval(this.min_delay);
	} else {
		attack_delay = this.min_delay;
	}
	
	attack_delay = intval(attack_delay);

	log.info(this+" setting up next attack. Minimum delay: "+this.min_delay+", maximum: "+this.max_delay+". Resulting delay time "+attack_delay);
	
	this.next_attack = time() + attack_delay * 60;

	this.apiCancelTimer('startAttack');
	this.apiSetTimer('startAttack', attack_delay * 60 * 1000);
}

function startAttack(health) {
	// Figure out our health
	if(health) {
		this.max_health = health;
		this.health = health;
	} else {
		if (!this.max_health) {
			this.max_health = 1000;
		}
		
		this.health = this.max_health;
	}
		
	log.info("Starting Rook attack in hub "+this.hubid+" with health "+this.health);
	this.apiCancelTimer('startAttack');
	
	this.scheduleWingBeat(10*60);

	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].startRookAttack(this);
		this.updateLocation(this.locations.epicentre[i], true);
	}
	for(var i in this.locations.outlying) {
		this.locations.outlying[i].startRookAttack(this);
		this.updateLocation(this.locations.outlying[i], false);
	}
	
	this.running = true;
	this.next_attack = 0;
}

// Location management and status

function addLocation(location, is_epicentre) {
	if(is_epicentre) {
		this.locations.epicentre[location.tsid] = location;
	} else {
		this.locations.outlying[location.tsid] = location;
	}
}

function updateAllLocations() {
	for(var i in this.locations.epicentre) {
		this.updateLocation(this.locations.epicentre[i], true);
	}
	for(var i in this.locations.outlying) {
		this.updateLocation(this.locations.outlying[i], false);
	}
}

function updateLocation(location, is_epicentre) {
	var status = {rooked: true, phase: this.phase, epicentre: is_epicentre, stun: this.stun, max_stun: this.max_stun, health: this.health, max_health: this.max_health};
	switch(this.phase) {
		case 'build_up':
			// Nothing to see here, actually.
			break;
		case 'angry':
			status.timer = this.angry_start + this.angry_time - time();
			status.angry_state = this.angry_state;
			status.max_stun = this.max_stun;
			break;
		case 'stunned':
			status.max_health = this.max_health;
			break;
	}

	location.setRookedStatus(status);
}

function scheduleWingBeat(delay) {
	var new_wing_beat = time() + delay;
	if(this.rook_next_wing_beat) {
		// are we sooner than the existing wing beat? If so, reschedule
		if(new_wing_beat < this.rook_next_wing_beat) {
			this.rook_next_wing_beat = new_wing_beat;
			this.apiCancelTimer('doWingBeat');
			this.apiSetTimer('doWingBeat', delay * 1000);

			log.info("Scheduling wingbeat on "+this.tsid+" for "+delay+" seconds.");
		}
	} else {
		this.rook_next_wing_beat = new_wing_beat;
		this.apiSetTimer('doWingBeat', delay * 1000);
		log.info("Scheduling wingbeat on "+this.tsid+" for "+delay+" seconds.");
	}
}

function cancelWingBeat() {
	if(this.rook_next_wing_beat) {
		delete this.rook_next_wing_beat;
		this.apiCancelTimer('doWingBeat');
	}
}

// Rook attack events
function doWingBeat() {
	log.info("Executing scheduled wingbeat");
	
	this.cancelWingBeat();
	this.scheduleWingBeat(10 * 60);
	
	this.rookStateChange('build_up');
	
	// Hack to let butler announce attacks that didn't get tracked when they were added
	if (config.rook_attack_tracker) {
		var tracker = apiFindObject(config.rook_attack_tracker);
		if (!tracker.containsAttack(this.tsid)) {
			tracker.addAttack(this.tsid);
		}
	}
	
	for(var i in this.locations.epicentre) {
		/* Error where rook attack objects divorced from there locations would continue
		 * to schedule wingbeats periodically. Consider this defensive coding.
		 */
		if(!this.locations.epicentre[i].isRooked() || this.locations.epicentre[i].rook_attack != this) {
			log.error("Rook attack attempting to schedule wingbeat on location it does not own.");
//			this.apiDelete();
			return;
		}
		this.locations.epicentre[i].rookWingBeat();
	}
	for(var i in this.locations.outlying) {
		if(!this.locations.outlying[i].isRooked() || this.locations.outlying[i].rook_attack != this) {
			log.error("Rook attack attempting to schedule wingbeat on location it does not own.");
//			this.apiDelete();
			return;
		}
		this.locations.outlying[i].rookWingBeat();
	}
	
	// Reset stun
	this.stun = 0;
	this.phase = 'build_up';
	this.stun_failures = 0;
	
	this.updateAllLocations();
}

function doStun(from_player, assists, damage) {
	if(!this.attacks_pending) {
		this.attacks_pending = {};
	}
	
	this.attacks_pending[from_player.tsid] = {from_player: from_player, assists: assists, damage: damage, attack_time: time(), is_stun: true};
	this.apiSetTimer('processAttacks', 1000);
}

function doAttack(from_player, damage) {
	if(!this.attacks_pending) {
		this.attacks_pending = {};
	}
	
	this.attacks_pending[from_player.tsid] = {from_player: from_player, damage: damage, attack_time: time(), is_stun: false};
	this.apiSetTimer('processAttacks', 1000);
}

function processAttacks() {
	var moreAttacks = false;
	
	if(!this.attacks_pending) {
		return;
	}
	
	for(var i in this.attacks_pending) {
		if(this.attacks_pending[i].attack_time <= time()) {
			if(this.attacks_pending[i].is_stun) {
				this.completeStun(i);
			} else {
				this.completeAttack(i);
			}
			delete this.attacks_pending[i];
		} else {
			moreAttacks = true;
		}
	}
	
	if(moreAttacks) {
		this.apiSetTimer('processAttacks', 1000);
	}
}

function completeAttack(from_player_tsid) {
	var from_player = getPlayer(from_player_tsid);
	if (!from_player) {
		log.error("Rook attack from non-existent player "+from_player_tsid);
	}
	
	var damage = this.attacks_pending[from_player_tsid].damage;
	this.health -= damage;
	
	if (!this.attackers) {
		this.attackers = {};
	}
	
	if (this.attackers[from_player_tsid]) {
		this.attackers[from_player_tsid] += damage;
	} else {
		this.attackers[from_player_tsid] = damage;
	}
	
	if(this.health <= 0) {
		damage += this.health;
		this.health = 0;
		this.is_dead = true;
		
		this.apiSetTimer('stopAttack', 15000);
		this.apiCancelTimer('stunRecovery');
		
		this.rookStateChange('dead');
	}

	if(this.health > 0) {
		var attack_text = from_player.label+" attacked the Rook for "+damage+" damage. "+this.health+" health remaining.";
	} else {
		var attack_text = from_player.label+" attacked the Rook for "+damage+" damage, defeating it.";
	}

	this.updateAllLocations();
	
	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].rookDamage(damage, attack_text, this.health <= 0);
	}
	for(var i in this.locations.outlying) {
		this.locations.outlying[i].rookDamage(damage, attack_text, this.health <= 0);
	}
}

function completeStun(from_player_tsid) {
	var from_player = getPlayer(from_player_tsid);
	if (!from_player) {
		log.error("Rook attack from non-existent player "+from_player_tsid);
	}

	var assists = this.attacks_pending[from_player_tsid].assists;
	var damage = this.attacks_pending[from_player_tsid].damage;
	
	var assist_text = (assists > 0) ? "and "+pluralize(assists, "other", "others") : "";
	var attempt_text = (damage > 0) ? "led an attack against the Rook, stunning it for "+damage+" points" : "attempted to stun the Rook, but failed.";
	var stun_text = from_player.label+" "+assist_text+" "+attempt_text;
	
	this.stun += damage;
	
	if(damage > 0) {
		if (this.stun < this.max_stun) {
			stun_text += ". "+ (this.max_stun - this.stun) + " remaining to stun the Rook.";
		} else {
			stun_text += ", stunning it.";
		}
	}

	if(this.stun >= this.max_stun) {
		var old_phase = this.phase;
		damage -= this.stun - this.max_stun;
		
		this.doStunned();
	} else if(this.phase != 'angry'){
		var old_phase = 'build_up';
		this.doAngry();
	}

	this.updateAllLocations();
	
	if(damage == 0) {
		this.stun_failures++;
		if(this.stun_failures >= this.max_stun_failures) {
			this.scheduleWingBeat(1);
		}
	}
	
	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].rookStunAttempt(damage, stun_text, this.stun >= this.max_stun);
	}
	for(var i in this.locations.outlying) {
		this.locations.outlying[i].rookStunAttempt(damage, stun_text, this.stun >= this.max_stun);
	}
}

function nextAngryState() {
	if(this.phase != 'angry') {
		return;
	}
	
	switch(this.angry_state) {
		case 'angry1':
			this.angry_state = 'angry2';
			this.apiSetTimer('nextAngryState', 30 * 1000);
			break;
		case 'angry2':
			this.angry_state = 'angry3';
			this.rookText("ATTACK IMMINENT!", "The Rook is about to attack!");
			break;
	}
	
	this.updateAllLocations();
}

function doAngry() {
	this.phase = 'angry';
	this.angry_state = 'angry1';
	this.angry_start = time();

	this.scheduleWingBeat(2 * 60);
	this.apiSetTimer('nextAngryState', 60 * 1000);
}

function doStunned() {
	this.phase = 'stunned';
	this.stun = this.max_stun;
	
	this.cancelWingBeat();
	this.apiCancelTimer('nextAngryState');
	this.rookStateChange('stunned');
	
	this.apiSetTimer('stunRecovery', 2*60*1000);
	
	this.rookText("STUNNED!", "The rook is now vulnerable to shrine attacks!");
}

function cancel() {
	this.stopAttack();
	
	this.apiDelete();
}

function getAttackers() {
	return this.attackers;
}

function stopAttack() {
	this.cancelWingBeat();
	if(!this.is_dead) {
		this.rookStateChange('dead');
	}
	
	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].rookClear();
	}
	
	delete this.attackers;
	
	if (config.rook_attack_tracker) {
		apiFindObject(config.rook_attack_tracker).removeAttack(this.tsid);
	}

	if (this.last_attack) {
		this.apiDelete();
	} else {
		this.setup();
		this.newLocation();
		this.setAttackTimer();
	}
}

function setLastAttack() {
	this.last_attack = true;
}

function rookText(txt, subtxt) {
	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].rookOverlayMessage(txt, subtxt);
	}
	for(var i in this.locations.outlying) {
		this.locations.outlying[i].rookOverlayMessage(txt, subtxt);
	}
}

function stunRecovery() {
	this.phase = 'build_up';
	this.stun = 0;

	this.rookStateChange('build_up');
	
	this.updateAllLocations();
}

// Rook is changing states, so interrupt any player actions that may be state dependent.
function rookStateChange(new_state) {
	for(var i in this.locations.outlying) {
		this.locations.outlying[i].rookStateChange(new_state);
	}
	for(var i in this.locations.epicentre) {
		this.locations.epicentre[i].rookStateChange(new_state);
	}
}

function rookAttackGetInfo() {
	var location = "none";
	for (var i in this.locations.epicentre) {
		location = this.locations.epicentre[i].label;
		break;
	}
	
	var attack_diff = this.next_attack - time();
	var attack_time = "";
	if(attack_diff > 0) {
		var hours = intval(attack_diff / 60 / 60);
		if (hours < 10) {
			hours = "0"+hours;
		}
		var minutes = intval(attack_diff / 60) - hours * 60;
		if (minutes < 10) {
			minutes = "0"+minutes;
		}
		var seconds = intval(attack_diff - hours * 60 * 60 - minutes * 60);
		if (seconds < 10) {
			seconds = "0"+seconds;
		}
		attack_time = hours+":"+minutes+":"+seconds;
	}
	
	return {
		health		: this.health,
		max_health	: this.max_health,
		min_delay	: this.min_delay,
		max_delay	: this.max_delay,
		running		: this.running,
		location	: location,
		next_attack	: attack_time
	};
}

function rookAttackSetInfo(args) {
	if (!args || args.max_health <= 0 || args.min_delay <= 0 || args.max_delay <= 0) {
		return;
	}
	
	this.health = args.health;
	this.max_health = args.max_health;
	this.min_delay = args.min_delay;
	this.max_delay = args.max_delay;
	
	if (this.running) {
		this.updateAllLocations();
		if(args.health <= 0) {
			if (this.running) {
				this.is_dead = true;
		
				this.apiSetTimer('stopAttack', 15000);
				this.apiCancelTimer('stunRecovery');
		
				this.rookStateChange('dead');
				for(var i in this.locations.epicentre) {
					this.locations.epicentre[i].rookDamage(0, "", true);
				}
			} else {
				this.health = 1;
				this.updateAllLocations();
			}
		}
	} else {
		this.setAttackTimer();
	}
}