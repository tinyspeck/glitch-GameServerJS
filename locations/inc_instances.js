
/////////////////////////////////////////////////////
//
// Location-managed instances. Used for things like the bureaucratic hall, etc, where entering a location 
// automatically sends you to an instance, reusing existing instances where possible and spawning new ones
// where needed
//

function instances_init(instance_id){
	if (!this.instances){
		this.instances = apiNewOwnedDC(this);
		this.instances.label = 'Instances';
		this.instances.instances = {};
	}
	
	if (!this.instances.instances[instance_id]){
		this.instances.instances[instance_id] = [];
	}
}

function instances_reset(){
	this.instances.instances = {};
}

// Find the "next" instance to use, if any
function instances_next_instance(instance_id, max_members, max_instances){
	this.instances_init(instance_id);

	var instance = null;
	for (var i in this.instances.instances[instance_id]){
		var tmp = this.instances.instances[instance_id][i];
		if (!tmp){
			array_remove(this.instances.instances[instance_id], i);
			continue;
		}
		
		// Don't re-use instances scheduled for destruction or ones that haven't been used yet
		if (tmp.getProp('destruction_scheduled')) continue;
		if (tmp.getProp('is_virgin')) continue;
		
		var player_count = tmp.count_members();
		if (player_count < max_members){
			instance = tmp;
			break;
		}
	}
	
	if (!instance && max_instances && num_keys(this.instances.instances[instance_id]) >= max_instances){
		instance = this.instances.instances[instance_id][choose_one(array_keys(this.instances.instances[instance_id]))];
	}
	
	return instance;
}

// Add a pointer to a newly-created instance
function instances_add_instance(instance_id, instance){
	this.instances_init(instance_id);
	
	for (var i in this.instances.instances){
		if (this.instances.instances[i].tsid == instance.tsid) return false;
	}
	
	this.instances.instances[instance_id].push(instance);
	return true;
}

// Remove an instance from consideration
function instances_remove_instance(instance_id, instance_tsid){
	this.instances_init(instance_id);

	for (var i in this.instances.instances[instance_id]){
		var tmp = this.instances.instances[instance_id][i];
		if (tmp.tsid == instance_tsid){
			array_remove(this.instances.instances[instance_id], i);
			return true;
		}
	}
	
	return false;
}

// What should we be instanced as?
function instances_instance_me(){
	return this.instance_me;
}

// How many max members per instance?
function instances_get_max_members(){
	return this.instance_max_members ? this.instance_max_members : 1;
}

// How many max instances should we create?
function instances_get_max_instances(){
	return this.instance_max_instances ? this.instance_max_instances : 0;
}

function instances_get_instance_options(){
	var instance_options = {
		no_auto_return: true,
		preserve_links: true
	};

	if (this.instance_location_type) instance_options.location_type = this.instance_location_type;

	return instance_options;
}

// Not called from anywhere! What does it do???
function instances_reinstance_players(){
	if (!this.instance_me && !this.instance_of) return false;

	if (this.instance_me){
		var instance_id = this.instance_me;
	}
	else{
		var instance_id = this.instance_of;
	}

	var instance_options = {
		no_auto_return: true,
		preserve_links: true
	};
	var location_options = {};

	for (var i in this.players){
		var pc = this.players[i];

		var instance = pc.instances_create(instance_id, this.tsid, instance_options, location_options);

		pc.instances_enter(instance_id, pc.x, pc.y);
	}

	return true;
}

function instances_get_instances(){
	this.instances_init();

	var out = {};
	var instances = this.instances.instances;
	for (var i in instances){
		out[i] = [];
		var instance = instances[i];
		for (var j in instance){
			out[i].push(instance[j]);
		}
	}

	return out;
}


/////////////////////////////////////////////////////
//
// Multiplayer game management
//

// Return an array of game starting positions
function instances_list_spawn_points() {
	var spawn_points = [];

	for(var i in this.items) {
		if (this.items[i].class_tsid == 'race_start_position') {
			spawn_points.push({x: this.items[i].x, y: this.items[i].y});
		}
	}
	
	return spawn_points;
}

// Return an array of game ending positions
function instances_list_exit_points() {
	var spawn_points = [];

	for(var i in this.items) {
		if (this.items[i].class_tsid == 'race_end_position') {
			spawn_points.push({x: this.items[i].x, y: this.items[i].y});
		}
	}
	
	return spawn_points;
}