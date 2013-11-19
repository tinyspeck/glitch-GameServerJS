function transit_init(){
	if (!this.transit){
		this.transit = apiNewOwnedDC(this);
		this.transit.label = 'Transit';
		this.transit.fares = {};
		this.transit.instances = {};
	}
}

function transit_init_fares(instance_id){
	this.transit_init();
	
	if (!this.transit.fares[instance_id]){
		this.transit.fares[instance_id] = {};
	}
}
	
function transit_init_instances(instance_id){
	this.transit_init();

	if (!this.transit.instances[instance_id]){
		this.transit.instances[instance_id] = [];
	}
}

/////////////////////////////////
//
// Functions that are used within a transit station
//
/////////////////////////////////

function transit_enter_station(pc) {
	/* is the player on the fuelmaking quest? */
	if (pc.getQuestStatus('fuelmaking_refuel_robot') == 'todo') {
		var q = pc.getQuestInstance('fuelmaking_refuel_robot');
		if (q.isStarted()) {
			var bot = this.createAndReturnItem('npc_maintenance_bot', 1, 198, -140, 0, pc.tsid);
			bot.setPC(pc);
		}
	}
}

/////////////////////////////////
//
// Functions that are used when entering public transit, like from a station/dock/etc
//
/////////////////////////////////

//
// Has the player paid the necessary fare?
//

function transit_has_paid_fare(pc, instance_id){
	this.transit_init_fares(instance_id);
	
	return this.transit.fares[instance_id][pc.tsid] ? true : false;
}


//
// Deduct currants from the player and mark them as paid
//

function transit_pay_fare(pc, instance_id){
	this.transit_init_fares(instance_id);
	
	var amount = this.transit_get_fare_cost(instance_id);
	if (!amount) return true;

	if (pc.stats_try_remove_currants(amount, {type: 'transit_fare', station: this.tsid})){
		pc.announce_sound('PAY_50_CURRANTS');
		this.transit.fares[instance_id][pc.tsid] = time();
		return true;
	}
	
	return false;
}

function transit_refund_fare(pc, instance_id){
	this.transit_init_fares(instance_id);
	
	var amount = this.transit_get_fare_cost(instance_id);
	if (!amount) return true;

	if (this.transit_has_paid_fare(pc, instance_id) && pc.stats_add_currants(amount, {type: 'transit_refund', station: this.tsid})){
		delete this.transit.fares[instance_id][pc.tsid];
		return true;
	}
	
	return false;
}

//
// Process the fare, removing the record that they paid (this should happen when they enter the paid area)
//

function transit_process_fare(pc, instance_id){
	if (!this.transit_has_paid_fare(pc, instance_id)) return false;
	
	delete this.transit.fares[instance_id][pc.tsid];
	
	return true;
}


function transit_get_fare_cost(instance_id){
	if (config.transit_instances[instance_id]){
		return config.transit_instances[instance_id].fare;
	}
	else{
		return 0;
	}
}


function transit_next_instance(instance_id, direction){
	if (!direction) direction = 'forwards';
	var direction_id = instance_id + '-' + direction;
	this.transit_init_instances(direction_id);

	var instance = null;
	for (var i in this.transit.instances[direction_id]){
		var tmp = this.transit.instances[direction_id][i];
		if (!tmp){
			array_remove(this.transit.instances[direction_id], i);
			continue;
		}
		
		var player_count = tmp.count_members();
		if (player_count > 0 && player_count < config.transit_instances[instance_id].max_capacity){
			var vehicle = apiFindObject(tmp.get_locations()[0]);
			if (!vehicle || vehicle.getProp('current_stop') != this.station_stop || !vehicle.getProp('is_transit')) continue;
			
			instance = tmp;
			
			break;
		}
	}
	
	return instance;
}

//
// Place the player in a transit instance. Use an existing one if we can, otherwise create a new one
//

function transit_enter_instance(pc, instance_id, direction){
	if (!direction) direction = 'forwards';
	var direction_id = instance_id + '-' + direction;
	this.transit_init_instances(direction_id);
	
	var instance = this.transit_next_instance(instance_id, direction);
	
	if (!instance){
		var instance_options = {
			no_auto_return: true,
			ignore_links: true
		};
		
		var location_options = {
			is_transit: true,
			current_stop: this.station_stop
		};
		
		var cfg = config.transit_instances[instance_id];
		instance = pc.instances_create(instance_id, cfg.template_tsid, instance_options, location_options);
		
		//apiFindObject(instance.get_locations()[0]).geo_door_set_dest_pos('door_1', this, cfg.stations[this.station_stop].x, cfg.stations[this.station_stop].y);
		this.transit_add_instance(instance_id, instance, direction);
	}
	else if (!pc.instances_has(instance_id)){
		pc.instances_add(instance_id, instance);
	}
	
	var x_pos = config.transit_instances[instance_id].x + randInt(-300, 400);
	return pc.instances_enter(instance_id, x_pos, config.transit_instances[instance_id].y);
}


function transit_add_instance(instance_id, instance, direction){
	var direction_id = instance_id + '-' + direction;
	this.transit_init_instances(direction_id);
	
	for (var i in this.transit.instances){
		if (this.transit.instances[i].tsid == instance.tsid) return false;
	}
	
	instance.setProp('direction', direction);
	this.transit.instances[direction_id].push(instance);
	return true;
}

function transit_remove_instance(instance_id, instance_tsid, direction){
	var direction_id = instance_id + '-' + direction;
	this.transit_init_instances(direction_id);

	for (var i in this.transit.instances[direction_id]){
		var tmp = this.transit.instances[direction_id][i];
		if (tmp && tmp.tsid == instance_tsid){
			array_remove(this.transit.instances[direction_id], i);
			return true;
		}
	}
	
	return false;
}

/////////////////////////////////
//
// Functions that are used once on board the train/boat/etc
//
/////////////////////////////////

function transit_schedule_departure(pc){
	if (this.is_departed){
		if (!this.apiTimerExists('transit_arrive')) this.transit_schedule_arrival();
		return this.transit_on_enter(pc);
	}

	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';

	var current_station = this.transit_get_current_stop(this.instance_id);
	
	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
	}

	var cfg = config.transit_instances[this.instance_id];
	pc.apiSendMsg({
		type: "transit_status",
		tsid: cfg.type,
		line_tsid: this.instance_id+'_'+direction,
		current_tsid: current_station.tsid,
		next_tsid: next_station.tsid,
		is_moving: false,
		time_to_destination: 0
	});

	pc.achievements_increment('transit', cfg.type+'s_entered');
	
	if (this.has_initial_departure || this.instance.count_members() >= cfg.min_capacity){
		this.transit_doors_close();
		this.apiCancelTimer('transit_initial_departure');
		return this.apiSetTimer('transit_depart', 3000);
	}
	
	//if (pc) pc.instances_schedule_exit_prompt(this.instance_id, 2*60);
	if (!this.apiTimerExists('transit_initial_departure')){
		this.apiSetTimer('transit_initial_departure', cfg.initial_departure_timeout*1000);
		this.departure_time = time()+cfg.initial_departure_timeout;
	}
	
	var remaining = this.departure_time - time();
	this.transit_make_announcement('This '+cfg.vehicle+' will be departing when '+pluralize(cfg.min_capacity - this.instance.count_members(), 'more player boards', 'more players board')+', or in '+pluralize(remaining, 'second', 'seconds')+'.', 5000);
}

function transit_initial_departure(){
	this.transit_doors_close();
	return this.apiSetTimer('transit_depart', 3000);
}

function transit_depart(){
	if (this.is_departed) return false;
	
	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';
	
	var current_station = this.transit_get_current_stop(this.instance_id);
	apiFindObject(current_station.tsid).transit_remove_instance(this.instance_id, this.instance.tsid, direction);
	
	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
	}
	
	var cfg = config.transit_instances[this.instance_id];
	this.is_departed = true;
	if (cfg.type == 'subway'){
		
		this.transit_start_subway_windows();
		this.announce_sound_to_all('TRAVELLING_TRAIN', 999, 1);
	}

	this.transit_make_announcement('This '+cfg.vehicle+' is departing.', 2000);
	
	this.apiSendMsg({
		type: "transit_status",
		tsid: cfg.type,
		line_tsid: this.instance_id+'_'+direction,
		current_tsid: current_station.tsid,
		next_tsid: next_station.tsid,
		is_moving: true,
		time_to_destination: 2+cfg.arrival_timeout
	});
	
	//
	// Trains with no players go out of service
	//
	
	if (num_keys(this.players)){
		return this.transit_schedule_arrival();
	}
	else{
		return true;
	}
}

function transit_schedule_arrival(){
	if (!this.is_departed) return false;
	
	var cfg = config.transit_instances[this.instance_id];
	this.apiSetTimer('transit_pre_arrival', (cfg.arrival_timeout - 10) * 1000);
	return this.apiSetTimer('transit_arrive', cfg.arrival_timeout * 1000);
}

function transit_pre_arrival(){
	if (!this.is_departed) return false;
	
	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';

	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
	}
	
	var cfg = config.transit_instances[this.instance_id];
	if (cfg.type == 'subway') this.apiSetTimer('transit_brakes', 7000);
	this.transit_make_announcement('The next stop is <span class="nuxp_bold">'+next_station.name+'</span>, arriving in 10 seconds.', 3000);
}

function transit_brakes(){
	this.announce_sound_stop_to_all('TRAVELLING_TRAIN', 1);
	this.announce_sound_to_all('TRAIN_ARRIVES', 1, 1);
}

function transit_arrive(){
	if (!this.is_departed) return false;
	
	this.is_departed = false;
	
	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';

	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
		var next_next_station = this.transit_get_next_stop(this.instance_id, next_station.station_id);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
		var next_next_station = this.transit_get_previous_stop(this.instance_id, next_station.station_id);
	}
	
	apiFindObject(next_station.tsid).transit_add_instance(this.instance_id, this.instance, direction ? direction : 'forwards');
	this.current_stop = next_station.station_id;

	var cfg = config.transit_instances[this.instance_id];
	this.transit_make_announcement('The '+cfg.vehicle+' has arrived at <span class="nuxp_bold">'+next_station.name+'</span>.', 2000);
	//this.announce_sound_to_all('TRAIN_ARRIVES');
	
	if (cfg.type == 'subway'){
		this.transit_stop_subway_windows();
		//this.announce_sound_stop_to_all('TRAVELLING_TRAIN');
	}

	this.apiSetTimer('transit_doors_close', (cfg.departure_timeout - 3) * 1000);
	this.apiSetTimer('transit_depart', cfg.departure_timeout * 1000);
	
	for (var i in this.activePlayers){
		this.activePlayers[i].prompts_add({
			txt		: 'This stop is '+next_station.name+'. Get off '+cfg.vehicle+'?',
			icon_buttons	: true,
			timeout_value	: 'timeout',
			timeout		: 10,
			choices		: [
				{ value : 'train-disembark', label : 'yes' },
				{ value : 'train-stay', label : 'no' }
			],
			callback	: 'transit_disembark_callback'
		});
	}

	this.apiSendMsg({
		type: "transit_status",
		tsid: cfg.type,
		line_tsid: this.instance_id+'_'+direction,
		current_tsid: next_station.tsid,
		next_tsid: next_next_station.tsid,
		is_moving: false,
		time_to_destination: 0
	});
}

function transit_doors_close(){

	if (!this.has_initial_departure){
		for (var i in this.activePlayers){
			this.activePlayers[i].instances_cancel_exit_prompt(this.instance_id);
		}
		this.has_initial_departure = true;
	}
	
	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';

	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
	}
	
	var cfg = config.transit_instances[this.instance_id];
	this.transit_make_announcement('This '+cfg.vehicle+' will depart for <span class="nuxp_bold">'+next_station.name+'</span> in a few seconds.', 3000);
	if (cfg.type == 'subway') this.announce_sound_to_all('TRAIN_DEPARTS', 1, 1);
}

function transit_start_subway_windows(){
	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_window'),
		x: -528,
		y: -234,
		width: "275",
		height: "161",
		uid: 'subway_window_left',
		dont_keep_in_bounds: true,
		at_bottom: true
	};

	this.apiSendAnnouncement(rsp);
	
	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_floor'),
		x: -713,
		y: -15,
		width: "642",
		height: "89",
		uid: 'subway_floor_left',
		dont_keep_in_bounds: true,
		at_bottom: true
	};

	this.apiSendAnnouncement(rsp);

	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_window'),
		x: -52,
		y: -234,
		width: "275",
		height: "161",
		uid: 'subway_window_middle',
		dont_keep_in_bounds: true,
		at_bottom: true
	};
	
	this.apiSendAnnouncement(rsp);
	
	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_floor'),
		x: -216,
		y: -15,
		width: "642",
		height: "89",
		uid: 'subway_floor_middle',
		dont_keep_in_bounds: true,
		at_bottom: true
	};

	this.apiSendAnnouncement(rsp);

	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_window'),
		x: 441,
		y: -234,
		width: "275",
		height: "161",
		uid: 'subway_window_right',
		dont_keep_in_bounds: true,
		at_bottom: true
	};
	
	this.apiSendAnnouncement(rsp);
	
	var rsp = {
		type: 'location_overlay',
		swf_url: overlay_key_to_url('subway_floor'),
		x: 369,
		y: -15,
		width: "642",
		height: "89",
		uid: 'subway_floor_right',
		dont_keep_in_bounds: true,
		at_bottom: true
	};

	this.apiSendAnnouncement(rsp);
}

function transit_stop_subway_windows(){
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_window_left'});
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_window_middle'});
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_window_right'});
	
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_floor_left'});
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_floor_middle'});
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'subway_floor_right'});
}

function transit_on_enter(pc){
	var direction = this.instance.getProp('direction');
	if (!direction) direction = 'forwards';

	var current_station = this.transit_get_current_stop(this.instance_id);
	
	if (direction == 'forwards'){
		var next_station = this.transit_get_next_stop(this.instance_id, this.current_stop);
	}
	else{
		var next_station = this.transit_get_previous_stop(this.instance_id, this.current_stop);
	}

	var cfg = config.transit_instances[this.instance_id];
	pc.apiSendMsg({
		type: "transit_status",
		tsid: cfg.type,
		line_tsid: this.instance_id+'_'+direction,
		current_tsid: current_station.tsid,
		next_tsid: next_station.tsid,
		is_moving: true,
		time_to_destination: cfg.arrival_timeout
	});

	this.transit_start_subway_windows();
}

/////////////////////////////////
//
// Common utility functions
//
/////////////////////////////////

function transit_get_next_stop(transit_id, current_stop){
	var cfg = config.transit_instances[transit_id];
	var current_station = cfg.stations[current_stop];
	var next_station = utils.copy_hash(cfg.stations[current_station.next_stop]);
	next_station.station_id = current_station.next_stop;
	
	// TODO: If group hall ferry, rewrite TSIDs and labels
	if (transit_id == 'group_hall_ferry'){
		if (current_stop == 1){
			
		}
		else{
			
		}
	}

	return next_station;
}

function transit_get_current_stop(transit_id){
	var cfg = config.transit_instances[transit_id];
	var current_station = cfg.stations[this.current_stop];
	current_station.station_id = this.current_stop;

	// TODO: If group hall ferry, rewrite TSIDs and labels
	if (transit_id == 'group_hall_ferry'){
		if (current_stop == 1){
			
		}
		else{
			
		}
	}

	return current_station;
}

function transit_get_previous_stop(transit_id, current_stop){
	var cfg = config.transit_instances[transit_id];
	var current_station = cfg.stations[current_stop];
	var previous_station = utils.copy_hash(cfg.stations[current_station.previous_stop]);
	previous_station.station_id = current_station.previous_stop;
	
	// TODO: If group hall ferry, rewrite TSIDs and labels
	if (transit_id == 'group_hall_ferry'){
		if (current_stop == 1){
			
		}
		else{
			
		}
	}

	return previous_station;
}

function transit_make_announcement(txt, duration){
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'transit_announcement'});

	this.apiSendAnnouncement({
		uid: 'transit_announcement',
		type: "vp_overlay",
		duration: duration,
		width: 560,
		x: '50%',
		top_y: '15%',
		delay_ms: 0,
		click_to_advance: false,
		text: [
			'<p align="center"><span class="nuxp_vog">'+txt+'</span></p>'
		]
	});
}

function transit_is_station(){
	for (var i in config.transit_instances){		
		for (var j in config.transit_instances[i].stations){
			var stop = config.transit_instances[i].stations[j];
			if (stop.tsid == this.tsid) return true;
		}
	}

	return false;
}