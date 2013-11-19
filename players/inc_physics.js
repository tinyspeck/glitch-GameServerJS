/***********************************************************************************************************

	NEW PHYSICS STUFF!
	
	* a hash passed to any of the add*Physics() methods can have any of the values stored
	in config.physics_settables.booleans or config.physics_settables.percentages, plus
	any of the following flags:

	{
		removes_ctpc_effects:boolean, // when added, it should remove all adjustments added by previous CTPTs
		is_cptc:boolean, // was added by a CPTC
		is_buff:boolean, // was added by a buff
		is_img:boolean, // is related to imagination
		is_permanent:boolean, // should last when player changes location
	}
	
	* the hashes passed to any of the add*Physics() methods are stored in this.physics_new under the
	key passed along with the hash

************************************************************************************************************/

function physicsReset(){
	delete this.physics_new;
	this.setDefaultPhysics();

	this.imagination_delete_upgrade('walk_speed_1');
	this.imagination_delete_upgrade('walk_speed_2');
	this.imagination_delete_upgrade('walk_speed_3');
	this.imagination_delete_upgrade('walk_speed_4');
	this.imagination_delete_upgrade('jump_1');
	this.imagination_delete_upgrade('jump_2');
	this.imagination_delete_upgrade('jump_3');
	this.imagination_delete_upgrade('jump_triple_1');
	this.imagination_delete_upgrade('jump_triple_2');
	this.imagination_delete_upgrade('jump_triple_3');
	this.imagination_delete_upgrade('jump_wall');
}

function setDefaultPhysics(){
	if (!this.physics_new) {
		this.physics_new = {};
	}
	
	/* For reference
	
	normal: {
		'vx_max': 335,
		'vy_max': 670,
		'gravity': 1190,
		'vy_jump': -570,
		'vx_accel_add_in_floor': 0.3,
		'vx_accel_add_in_air': 0.22,
		'friction_floor': 4.3,
		'friction_air': -0.22,
		'friction_thresh': 80,
		'vx_off_ladder': 300,
		'pc_scale': 1,
		'item_scale': 1,
		'jetpack': 0,
		'y_cam_offset': 150,
		'can_3_jump': 0,
		'multiplier_3_jump': 1,
		'can_wall_jump': 0
	}
	
	Here's the full list of things we need to change in this round of imagination upgrades:

	Default? "Straight-up jump height: 0 px, gravity: (1.26*1190 = 1500), vy_jump: 0"
	
	NEW DEFAULT!
    vx_max  * 0.4597 (=154)
    vy_jump * 0.7105 (=-405)
    triple jump off

	
	Jump Height I "Straight-up jump height: 50 px,		gravity: (1.26*1190 = 1500),	vy_jump: (0.7*-570 = -400)"
	Jump Height II "Straight-up jump height: 75 px,		gravity: (1.18*1190 = 1400),	vy_jump: (0.79*-570 = -450)"
	Jump Height III "Straight-up jump height: 100 px,	gravity: (1.09*1190 = 1300),	vy_jump: (0.88*-570 = -500"
	Jump Height IV "Straight-up jump height: 125 px,	gravity: (1.05*1190 = 1250),	vy_jump: (0.94*-570 = -535)"
	Jump Height V "Straight-up jump height: 150 px,		gravity: (1*1190 = 1190),		vy_jump: (1*-570 = -570)"
	
	Default? Movement speed 280 px/sec
	
	Walk Speed I Movement speed increased to	(.9*335 = 300) px/sec
	Walk Speed II Movement speed increased to	(.96*335 = 320) px/sec
	Walk Speed III Movement speed increased to	(1.01*335 = 340) px/sec
	Walk Speed IV Movement speed increased to	(1.06*335 = 355) px/sec
	Walk Speed V Movement speed increased to	(1.1*335 = 370) px/sec
	Walk Speed VI Movement speed increased to	(1.13*335 = 380) px/sec
	
	Triple Jump I 0.8 multiplier on the current triple jump height. (~280px straight-up jump) STARTS A QUEST
	Triple Jump II 0.9 multiplier multiplier on the current triple jump height. (~320px straight-up jump)
	Triple Jump III Same as the current triple jump height. (~350px straight-up jump)

	*/
	
	this.physics_new['imagination'] = {
		is_permanent: 1,
		is_img: 1,
		vy_jump: 0.7105, // 0.7105 * -570 =-405
		vx_max: 0.4597, // 0.4597*335 = 154
		//gravity: 1, // 1.26*1190 = 1500
		can_3_jump: 0,
		multiplier_3_jump: 1,
		can_wall_jump: 0
	};
	
	this.stackPhysicsAndSendToClient();
}

function getPhysics(){
	if (!this.physics_new) {
		this.physics_new = {};
	}
	
	if (!this.physics_new['imagination']) {
		this.setDefaultPhysics();
	}
	
	return this.physics_new;
}

// this is called from location.onPlayerEnter
function removeAllTempPhysics(and_send){
	var physics = this.getPhysics();
	var key;

	// iterate over physics and remove any temps
	for (key in physics){
		if (!physics[key].is_permanent && physics[key].location_tsid != this.location.tsid){
			delete physics[key];
		}
	}
	
	if (and_send) this.stackPhysicsAndSendToClient();
}

function removeAllCTPCPhysics(and_send){
	var physics = this.getPhysics();
	var key;

	// iterate over physics and remove any temps
	for (key in physics){
		if (physics[key].is_cptc){
			delete physics[key];
		}
	}
	
	if (and_send) this.stackPhysicsAndSendToClient();
}

function checkForExpiringPhysics(){
	var physics = this.getPhysics();
	var now = getTime();
	
	// we'll use this to know if we should sned a message to the client, if any expired
	var any_expired = false;
	
	// we'll use this to track the soonest any physics will expire, for the timer
	var shortest_ms_until_expire = 0;
	
	var key;
	var phys;
	var ms_since_started;
	var ms_until_expire;

	// iterate over physics
	for (key in physics){
		phys = physics[key];
		
		// do we even care about this?
		if (!phys.duration_ms){
			if (config.is_dev) log.info(this+' phys setting '+key+' has no duration');
		}
		else{
			ms_since_started = now-phys.added_time;
			
			if (ms_since_started >= phys.duration_ms){
				// duration has expired, remove it
				if (config.is_dev) log.info(this+' phys setting '+key+' expiring now');
				any_expired = true;
				
				// now remove it!
				this.removePhysics(key, false);
			}
			else{
				// still time left for this physics
				ms_until_expire = phys.duration_ms - ms_since_started;
				if (config.is_dev) log.info(this+' phys setting '+key+' expiring in '+ms_until_expire);
				
				// if this one has the least amount of time left, remember that time for the timer
				if (!shortest_ms_until_expire || ms_until_expire < shortest_ms_until_expire) {
					shortest_ms_until_expire = ms_until_expire;
				}
			}
		}
	}
	
	// update the pc physics, cause we removed a physics setting
	if (any_expired){
		this.stackPhysicsAndSendToClient();
	}
	
	// if there are any physics that will expire, set the timer to run this func again
	if (shortest_ms_until_expire){
		// lets make sure the timer is at leat 101, because less that seems to cause weirdness. SERGUEI!
		var ms_for_timer = Math.max(101, shortest_ms_until_expire);
	
		if (config.is_dev) log.info(this+' setting a timer for '+ms_for_timer+' a phys setting expiring in '+shortest_ms_until_expire);
		
		if (this.apiTimerExists('checkForExpiringPhysics')) {
			this.apiCancelTimer('checkForExpiringPhysics');
		}
		
		this.apiSetTimer('checkForExpiringPhysics', ms_for_timer);
	}
		
}

// the only time and_send should be false is if you are doing a batch change to physics
// and you want to wait until all changes are made before you broadcast the changes. see checkForExpiringPhysics() 
function removePhysics(key, and_send){
	var physics = this.getPhysics();
	delete physics[key];
	if (and_send) this.stackPhysicsAndSendToClient();
}

// NEVER CALL THIS DIRECTLY. Use one of the helper functions below to effect physcis changes on the pc
function addPhysics(hash, key){
	var physics = this.getPhysics();
	
	if (hash.removes_ctpc_effects){
		this.removeAllCTPCPhysics();
	}
	
	if (!hash.is_img) {
		hash.location_tsid = this.location.tsid;
	}
	hash.added_time = getTime();
	
	physics[key] = hash;
	this.stackPhysicsAndSendToClient();
	
	// if it has a duration, let's get the timer running
	if (hash.duration_ms){
		this.checkForExpiringPhysics();
	}
}

// ensures the hash has the correct flag on it to identify it as an imagination adjustment (there can be only one)
function addImaginationPhysics(hash){
	hash.is_permanent = 1; // permanent!
	hash.is_img = 1;
	delete hash.is_cptc;
	delete hash.is_buff;
	
	if ('vy_jump' in hash && hash.vy_jump !== null) this.physics_new['imagination'].vy_jump = hash.vy_jump;
	if ('vx_max' in hash && hash.vx_max !== null) this.physics_new['imagination'].vx_max = hash.vx_max;
	if ('gravity' in hash && hash.gravity !== null) this.physics_new['imagination'].gravity = hash.gravity;
	if ('can_3_jump' in hash && hash.can_3_jump !== null) this.physics_new['imagination'].can_3_jump = hash.can_3_jump;
	if ('multiplier_3_jump' in hash && hash.multiplier_3_jump !== null) this.physics_new['imagination'].multiplier_3_jump = hash.multiplier_3_jump;
	if ('can_wall_jump' in hash && hash.can_wall_jump !== null) this.physics_new['imagination'].can_wall_jump = hash.can_wall_jump;
	
	this.addPhysics(this.physics_new['imagination'], 'imagination');
}

// ensures the hash has the correct flag on it to identify it as a CTPC adjustment
function addCTPCPhysics(hash, key){
	if (hash.is_permanent != 1) hash.is_permanent = 0; // by default, these should be temporary
	hash.is_cptc = 1;
	delete hash.is_buff;
	delete hash.is_img;
	this.addPhysics(hash, key);
}

// ensures the hash has the correct flag on it to identify it as a buff adjustment
function addBuffPhysics(hash, key){
	if (hash.is_permanent != 0) hash.is_permanent = 1; // by default, these should be permanent
	hash.is_buff = 1;
	delete hash.is_cptc;
	delete hash.is_img;
	this.addPhysics(hash, key);
}

function getStackedPhysics(){
	if (!this.stacked_physics_cache) {
		this.stacked_physics_cache = this.makeStackedPhysics();
	}
	
	return this.stacked_physics_cache;
}

function makeStackedPhysics(){
	var physics = this.getPhysics();
	var adjustments = {keys:{}};
	
	var i;			// for iterating over the arrays in config.physics_settables
	var key;		// key for the records in physics
	var settable;	// name of the settable from the arrays in config.physics_settables
	var t;			// total values for the percentages as we add them up to average them
	var c;			// tracks the number of records in percentages setting a given settable
	
	// is this location marked to ignore upgrade physics?
	var no_upgrade_physics_adjustments = (this.location && this.location.geometry && this.location.geometry.no_upgrade_physics_adjustments);
	
	//
	// iterate over physics and do stacking
	//
	
	// go through the boolean settables, and if ANY of the records in physics have it set to true, set it to true in adjustments
	for (i=0; i<config.physics_settables.booleans.length; i++){
		settable = config.physics_settables.booleans[i];
		for (key in physics){
			if (physics[key][settable]){
			
				// if the location is marked to ignore upgrade physics...
				if (no_upgrade_physics_adjustments && physics[key].is_img) continue;
				
				adjustments[settable] = true;
				continue;
			}
		}
	}
	
	// go through the percentage settables and get the average of all the values in the physics records and put the avg in adjustments
	for (i=0; i<config.physics_settables.percentages.length; i++){
		settable = config.physics_settables.percentages[i];
		c = 0;
		t = 0;
		
		var base = 1;
		
		// if this location is not marked specially to ignore upgrade physics, use the imagination hash as the base
		if (!no_upgrade_physics_adjustments) {
			base = physics['imagination'][settable] || base;
		}
		
		for (key in physics){
			
			if (config.is_dev || this.is_god){
				// debugging
				if (i == 0) adjustments.keys[key] = physics[key];
			}
			if (utils.has_key(settable, physics[key])){
				// it is imagination, skip it (we use the img hash as the base)
				if (physics[key].is_img) continue;
				
				// bad value?
				if (isNaN(floatval(physics[key][settable]))) continue;
				
				// if it is 100% (1) then it should not factor in to the avg
				if (floatval(physics[key][settable]) == 1) continue;
				
				// if it is 0% (0) then it overrides all others and sets the adjustment to 0%
				if (floatval(physics[key][settable]) == 0){
					t = 0;
					c = 1;
					break; // gets us out of the (key in physics) loop for this settable in a way that will set adjustments[settable] = 0
				}
				
				t+= floatval(physics[key][settable]);
				c++;
			}
		}
		
		adjustments[settable] = (!c) ? base : (t/c)*base;
	}
	
	if (config.is_dev) log.info(this+' made stacked_physics_cache');
	return adjustments;
}

function stackPhysicsAndSendToClient(){
	this.stacked_physics_cache = this.makeStackedPhysics();
	this.sendPhysicsAdjustments();
}

function reducePhysicsAdjustmentsToMinumum(adjustments){
	// we only need to pass around pc_scale right for other avatars
	var ob = {};
	ob.pc_scale = adjustments.pc_scale;
	ob.jetpack = adjustments.jetpack;
	return ob;
}

// ONLY EVER TO BE CALLED FROM stackPhysicsAndSendToClient()
function sendPhysicsAdjustments(){
	// stacked_physics_cache needs to always contain all physics changes for the player
	// after any stacking/merging is done. The client only obeys the latest
	// physics_changes message sent to it. If you send an empty adjustments
	// hash, it will effectively remove all player adjustments in the client.
	// a null value for adjustments is considered incorrect and is ignored
	
	if (!this.stacked_physics_cache) return;

	var evt = {
		type: 'physics_changes',
		adjustments: this.stacked_physics_cache
	};

	this.sendMsgOnline(evt);
	
	if (this.isOnline()) {
		this.location.apiSendMsgX({
			type: 'pc_physics_changes',
			pc_tsid: this.tsid,
			adjustments: this.reducePhysicsAdjustmentsToMinumum(this.stacked_physics_cache)
		}, this);
	}
}



function physics_event_run(param, value, duration){

	var hash = {};
	hash.is_event = true;
	hash[param] = value;
	if (duration) hash.duration_ms = duration;

	//log.info("SETTING HASH", hash);

	this.addCTPCPhysics(hash, 'events_'+param);
}

function physics_event_reset(param){

	if (param == 'all'){

		var physics = this.getPhysics();
		for (var i in physics){
			if (physics[i].is_event){
				delete physics[i];
			}
		}

		this.stackPhysicsAndSendToClient();
	}else{

		this.removePhysics('events_'+param, true);
	}
}
