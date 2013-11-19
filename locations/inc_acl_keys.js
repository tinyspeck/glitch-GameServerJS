function acl_keys_init(){
	if (!this.keys){
		this.keys = {};
	}
}

function acl_keys_set(keys){
	this.acl_keys_init();
	this.keys = keys;
}

function acl_keys_add_key(pc){
	this.acl_keys_init();

	if (config.is_dev) log.info(this+' acl_keys_add_key from '+pc);
	this.keys[pc.tsid] = {
		date_granted: time(),
		pc: pc
	};
}

function acl_keys_remove_key(pc){
	this.acl_keys_init();

	if (this.keys[pc.tsid]){
		delete this.keys[pc.tsid];
	}
}

function acl_keys_remove_all_keys(){
	this.acl_keys_init();

	for (var i in this.keys){
		var key = this.keys[i];
		key.pc.acl_keys_remove_receive(this);
		this.pols_kickPlayer(key.pc);
	}

	this.keys = {};
}

function acl_keys_get_keys(){
	return this.keys;
}

function acl_keys_get_player_hashes(){
	this.acl_keys_init();

	var hashes = [ this.owner.make_hash() ];

	for (var i in this.keys){
		hashes.push(this.keys[i].pc.make_hash());
	}

	return hashes;
}

function acl_keys_count_granted(){
	this.acl_keys_init();

	return num_keys(this.keys);
}

function acl_keys_player_has_key(pc){
	if (!this.pols_is_pol()) return false; // Keys only on POLs

	// If this is a public street, proxy to the interior
	if (this.getProp('is_public')){
		var owner = this.pols_get_owner();
		if (owner){
			var interior = owner.houses_get_interior_street();
			if (interior){
				return interior.acl_keys_player_has_key(pc);
			}
		}
	}

	// Check this street
	this.acl_keys_init();

	return this.keys[pc.tsid] ? true : false;
}