function locked_doors_isLocked(door){
	if (door.requires_level){
		return 1;
	}
	
	if (door.key_id){
		return 1;
	}
	
	return 0;
}

function locked_doors_getKey(door){
	return door.key_id ? door.key_id : 0;
}

function locked_doors_canEnter(pc, door, door_id){
	
	if (!this.locked_doors_isLocked(door)) return {ok: 1};


	//
	// level lock?
	//
	
	if (door.requires_level && door.requires_level > pc.stats_get_level()){
		var msg = "You must be level "+door.requires_level+" or higher to pass through this door.";
		
		pc.familiar_send_targeted({
			'callback'		: 'familiar_locked_door',
			'target_tsid'		: 'geo:door:'+door_id,
			'requires_level'	: door.requires_level,
			'error_msg'		: msg,
		});
		
		return {
			ok	: 0,
			code	: 1,
			msg	: msg,
		};
	}
	
	
	//
	// Needs a key?
	//
	
	if (door.key_id && !pc.has_key(door.key_id)){
		var msg = "You need the correct key to unlock this door.";
		
		pc.familiar_send_targeted({
			'callback'	: 'familiar_locked_door',
			'target_tsid'	: 'geo:door:'+door_id,
			'requires_key'	: door.key_id,
			'error_msg'	: msg,
		});
		
		return {
			ok	: 0,
			code	: 1,
			msg	: msg,
		};
	}


	//
	// guess so!
	//

	return {ok: 1};
}

function locked_doors_onEnter(pc, door){
	if (!this.locked_doors_isLocked(door)) return;
	
	//
	// Remove the key
	//
		
	if (door.key_id){
		var key = pc.has_key(door.key_id);
		if (!key) return; // wtf?
		
		key.apiConsume(1);
	}
}
