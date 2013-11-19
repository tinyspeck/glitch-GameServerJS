function world_events_init() {
	if (!this.world_events) {
		this.world_events = apiNewOwnedDC(this);
		this.world_events.label = "WorldEvents";
	}
}

function getLoneliness() {
	if (!this.world_events) {
		return;
	}
	
	return this.world_events.loneliness;
}

function startLoneliness(source_item, type, test_only, uid) {
	if (!this.world_events) {
		this.world_events_init();
	}
	
	if (test_only) {
		var text = "Whoop whoop whoop. Testing testing testing. Whoop whoop whoop.";
	} else {
		this.world_events.loneliness = {
			start_time: time(),
			type: type,
			option: randInt(0, 8),
			running: true,
			source: source_item,
			location: source_item.container,
			uid: uid
		};
		if (source_item.lonelinessGetText) {
			var text = source_item.lonelinessGetText(this, this.world_events.loneliness.type, this.world_events.loneliness.option, source_item.container.label, 0).text;
		} else{
			var text = "Whoops. This item ain't hooked up right.";
		}		
		
		apiLogAction('LONELINESS_INVITE', 'pc='+this.tsid, 'target='+source_item.tsid, 'type='+type, 'uid='+uid);
		
		this.apiSetTimer('showLonelinessPrompt', 15000);
	}
	
	var args = {};
	var state_event1 = {callback: 'announce_remote_item_state_change', class_tsid: source_item.class_tsid, state: 'loneliness'};
	var state_event2 = {callback: 'announce_remote_item_state_change', class_tsid: source_item.class_tsid, state: 'loneliness_out'};

	if (source_item.make_config) {
		args.config = source_item.make_config();
		state_event1.config = args.config;
		state_event2.config = args.config;
	}
	
	args.duration = 14500;
	args.state = 'loneliness_in';
	if (source_item.getClassProp('loneliness_size') && intval(source_item.getClassProp('loneliness_size'))) {		
		args.size = intval(source_item.getClassProp('loneliness_size'));

	}
	if (source_item.getClassProp('loneliness_x_offset') && intval(source_item.getClassProp('loneliness_x_offset'))) {		
		args.corner_offset_x = intval(source_item.getClassProp('loneliness_x_offset'));
	}
	if (source_item.getClassProp('loneliness_y_offset') && intval(source_item.getClassProp('loneliness_y_offset'))) {		
		args.corner_offset_y = intval(source_item.getClassProp('loneliness_y_offset'));
	}
		
	this.announce_remote_item_speech(source_item.class_tsid, text, args)
	this.events_add(state_event1, 1);
	this.events_add(state_event2, 13);
	
	var loc = source_item.container;
}

function cancelLoneliness() {
	if (this.world_events.loneliness && this.world_events.loneliness.running) {
		this.world_events.loneliness.running = false;
		
		this.prompts_add({
			txt		: 'Someone else cheered up the Street Spirit in '+this.world_events.loneliness.location.label+'. Looks like you missed your chance!',
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});		
	}	
}

function endLoneliness() {
	if (this.world_events.loneliness) {
		this.world_events.loneliness.running = false;
	}
}

function canDoLoneliness(loneliness_location) {
	if ((!this.world_events || !this.world_events.loneliness || !this.world_events.loneliness.running) && !this.location.isInstance() && !this.is_dead) {
		log.info("Checking player "+this+" for loneliness.");
		if (loneliness_location == this.location) {
			log.info("Player is in the loneliness location already!");
			return false;
		}
		
		log.info("Trying to establish path between "+loneliness_location+" and "+this.location);
		if (!loneliness_location) {
			return false;
		}
		var path = apiFindGlobalPathX(loneliness_location, this.location);
		log.info("Loneliness path has length "+path.length);
		if (path.length >= 3) {
			return true;
		}
	}
	
	return false;
}

function world_events_clear() {
	delete this.world_events.loneliness;
}

function showLonelinessPrompt() {
	if (!this.world_events || !this.world_events.loneliness || !this.world_events.loneliness.running) {
		return;
	}
	this.prompts_add({
		txt		: 'A Street Spirit in '+this.world_events.loneliness.location.label+' needs your help. Would you like to set that as your destination?',
		choices		: [
			{ value : 'yes', label : 'Yes' },
			{ value : 'no', label : 'No' }
		],
		callback	: 'prompts_loneliness_callback',
	});
}

function prompts_loneliness_callback(value, details) {
	if (value == 'yes') {
		var ret = this.buildPath(this.world_events.loneliness.location.tsid, this.location.tsid);

		var rsp = {
			type: 'get_path_to_location',
			path_info: ret.path
		};

		this.apiSendMsg(rsp);	
	}
} 