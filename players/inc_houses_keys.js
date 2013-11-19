function houses_keys_init(){
	if (!this.houses_keys){
		this.houses_keys = {};
	}
}

function houses_keys_grant(loc, pc){
	if (this.buddies_is_ignored_by(pc)){
		return {ok: 0, reason: 'owner_blocked_by_pc'};
	} else if (pc.buddies_is_ignored_by(this)){
		return {ok: 0, reason: 'pc_blocked_by_owner'};
	}

	pc.houses_keys_grant_receive(loc);

	loc.pols_keys_add_key(pc.tsid);

	return {ok: true};
}

function houses_keys_grant_receive(loc){
	this.houses_keys_init();

	this.houses_keys[loc.tsid] = {date_granted: time() };
}

function houses_keys_remove(loc, pc){
	pc.houses_keys_remove_receive(loc);

	loc.pols_keys_remove_key(pc.tsid);

	return {ok: true};
}

function houses_keys_remove_receive(loc){
	this.houses_keys_init();

	delete this.houses_keys[loc.tsid];
}

