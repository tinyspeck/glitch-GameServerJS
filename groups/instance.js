//#include ../items/include/events.js

//
// http://svn.tinyspeck.com/wiki/SpecInstances
//

//
// Create a new instance
//

function init(instance_id, base_tsid, options, location_options){
	this.instance_id = instance_id;
	
	this.members = {};
	this.locations = [];
	this.is_virgin = true;
	this.base_tsid = base_tsid;
	
	if (options){
		for (var i in options){
			this[i] = options[i];
		}
	}
	
	this.clone_location(base_tsid, this.instance_label);
	
	if (location_options){
		for (var i in this.locations){
			apiFindObject(this.locations[i]).setProps(location_options);
		}
	}
}

//
// Clone a location, walking connections if necessary.
//
// Possible options:
//  - ignore_links : Do nothing with outgoing links: Don't clear them, don't restore the targets, don't clone them
//  - preserve_links : Don't clone outgoing links, instead restore the targets
//

function clone_location(tsid, label){

	//
	// Clone the locations we need
	//
	
	var base_location = apiFindObject(tsid);
	if (!base_location) return false;
	
	var base_info = base_location.getInfo();
	
	var instance = base_location.apiCopyLocation(label ? label : base_info.label, base_info.moteid, base_info.hubid, true, this.location_type ? this.location_type : null);
	instance.setProp('instance_of', tsid);
	
	if (instance){
	
		// copy splash screen
		if (base_info.image_file) instance.setProp('img_file_versioned', base_info.image_file);
		if (base_location.getProp('loading_label')) instance.setProp('loading_label', base_location.getProp('loading_label'));
		if (base_location.getProp('special_loading_image')) instance.setProp('special_loading_image', base_location.getProp('special_loading_image'));
		if (base_location.getProp('loading_image')) instance.setProp('loading_image', base_location.getProp('loading_image'));
		if (base_location.getProp('image')) instance.setProp('image', base_location.getProp('image'));

		instance.cloneLocationInfo(base_location);
		instance.events_broadcast('instance_created');

		this.add_location(instance);

		if (this.ignore_links) return;
		if (this.preserve_links){
			
			var targets = base_location.geo_links_get_outgoing();
			for (var i in targets){
				var target = targets[i];
				
				if (target.type == 'door'){
					// Rewrite any internal doors
					if (!target.target || target.target.tsid == base_location.tsid){
						instance.geo_door_set_dest_pos(target.door_id, instance, target.x, target.y, true);
					}
					else{
						instance.geo_door_set_dest_pos(target.door_id, target.target, target.x, target.y, true);
					}
				}
				else if (target.type == 'signpost'){

					instance.geo_signpost_add_dest_pos(target.signpost_id, target.target, target.x, target.y, true);
				}
				else{
					log.error('Oh shit, unsupported target type when cloning location: '+target.type);
				}
			}
		}
		else{
		
			instance.geo_links_clear_sources();
			instance.geo_clear_doors();
			var targets = base_location.geo_links_get_outgoing();
			for (var i in targets){
				var target = targets[i];
				if (target.tsid == base_location.tsid) continue;

				var target_loc = target.target;
				var target_info = target_loc.getInfo();
				var target_instance;
				if (target_loc.tsid != tsid){
					target_instance = target_loc.apiCopyLocation(target_info.label, target_info.moteid, target_info.hubid, true, this.location_type ? this.location_type : null);
					if (target_instance) target_instance.setProp('instance_of', target_loc.tsid);
				}
				else{
					target_instance = instance;
				}
			
				if (target_instance){
				
					target_instance.geo_links_clear_sources();
					target_instance.geo_clear_doors();
				
					// copy splash screen
					if (target_info.image_file) target_instance.setProp('img_file_versioned', target_info.image_file);
					if (target_loc.getProp('loading_label')) target_instance.setProp('loading_label', target_loc.getProp('loading_label'));
					target_instance.cloneLocationInfo(target_loc);
				
					if (target.type == 'door'){
					
						var door = base_location.geo_get_door_info(target.door_id);
						if (door){
							var door_id = instance.geo_add_door({
								x : door.x,
								y : door.y,
								w : door.w,
								h : door.h,
								deco : {
									w : door.deco.w,
									h : door.deco.h,
									sprite_class: door.deco.sprite_class
								},
								connect : {}
							});

							instance.geo_door_set_dest_pos(door_id, target_instance, target.x, target.y, true);
						}
					}
					else if (target.type == 'signpost'){

						instance.geo_signpost_add_dest_pos(target.signpost_id, target_instance, target.x, target.y, true);
					}
					else{
						log.error('Oh shit, unsupported target type when cloning location: '+target.type);
					}
				
			
					if (target_loc.tsid != tsid){
					
						// Other direction
						var target_targets = target_loc.geo_links_get_outgoing();
						for (var j in target_targets){
							var target_target = target_targets[j];

							if (target_target.type == 'door' && target_target.tsid == tsid){

								var door = target_loc.geo_get_door_info(target_target.door_id);
								if (door){
									var door_id = target_instance.geo_add_door({
										x : door.x,
										y : door.y,
										w : door.w,
										h : door.h,
										deco : {
											w : door.deco.w,
											h : door.deco.h,
											sprite_class: door.deco.sprite_class
										},
										connect : {}
									});

									target_instance.geo_door_set_dest_pos(door_id, instance, target_target.x, target_target.y, true);
								}
							}
							else if (target_target.type == 'signpost' && target_target.tsid == tsid){

								target_instance.geo_signpost_add_dest_pos(target_target.signpost_id, instance, target_target.x, target_target.y, true);
							}
						}
					
						this.add_location(target_instance);
					}
				}
			}
		}
	}
}

//
// Adds 'location' to this instance. Does not modify the location in any way, except to reference this instance container
//

function add_location(loc){
	loc.set_instance_id(this.instance_id, this);
	this.locations.push(loc.tsid);
}

//
// Player 'pc' wants to enter this instance
//

function player_enter(pc){
	if (!this.is_member(pc) && this.can_join(pc)){
		if (!this.members) this.members = {};
		this.members[pc.tsid] = {
			'who'		: pc,
			'joined'	: time()
		};
		
		log.info(pc+' Entering instance '+this.instance_id);
		return true;
	}
	
	log.info(pc+' Entering instance -NO- '+this.instance_id);
	return false;
}

//
// Player entered a location in this instance
//

function player_entered_location(pc, loc){
	if (!this.is_member(pc)){
		log.info(pc+' Snuck in to instance '+this.instance_id);
		//
		// they snuck in
		//
		
		if (!this.player_enter(pc)){
			//
			// not allowed in, kick them
			//
			
			log.info(pc+' Kicked from instance '+this.instance_id);
			this.player_exit(pc);
		}
		else if (this.destruction_scheduled){
			delete this.destruction_scheduled;
			this.events_remove(function(details){ return details.callback == 'destroy_do'; });
		}
	}
	
	this.is_virgin = false;
	
	if(this.shared_instance_manager) {
		this.shared_instance_manager.onSharedInstanceEnter(pc);
	}
}

//
// Player 'pc' has exited this instance
//

function player_exit(pc, randomize, no_auto_return){
	if (this.is_member(pc)){
		
		//
		// Set a timer to kick out this player, thanks to threading issues
		//

		if (this.instance_id.substr(0, 3) == 'NB_' && (pc.location.getProp('is_home') || pc.location.isInstance())) return true;
		
		this.events_add({callback: 'player_exit_notify', tsid: pc.tsid, randomize: randomize, no_auto_return: no_auto_return}, 1);
		
		log.info(pc+' Exited instance '+this.instance_id);
		return true;
	}
	
	log.info(pc+' Exited instance -NO- '+this.instance_id);
	return false;
}

function player_exit_notify(details){
	var pc = getPlayer(details.tsid);

	if (this.is_member(pc)){

		// If we have a shared game instance manager, notify it.
		if (this.shared_instance_manager){
			this.shared_instance_manager.playerLeavingInstance(pc);
		}

		if (this.game){
			this.game.playerLeft(pc);
		}
		else if (pc.games_get_spawn_point()){
			var pt = pc.games_get_spawn_point();
			this.add_spawn_point(pt.x, pt.y);

			pc.games_clear_spawn_point();
		}

		//
		// TODO: don't delete instances that players have temporarily left for another instance
		//

		delete this.members[pc.tsid];
		pc.instances_left(this.instance_id, details.randomize, details.no_auto_return);
		
		//
		// if this instance is empty, destroy it
		// Unless the player still has a pointer to it
		//

		if (this.check_should_destroy(pc)) return true;
		
		log.info(pc+' Exited instance notify '+this.instance_id);
		return true;
	}
	else if (details.force && this.is_location(pc.location.tsid)){
		pc.teleportSomewhere();
	}
	
	log.info(pc+' Entering instance notify -NO- '+this.instance_id);
	return false;
}

function check_should_destroy(pc){
	if (!num_keys(this.members)){

		log.info(pc+' Exited instance notify LAST MEMBER '+this.instance_id);
		
		if (!this.no_auto_destroy){
			this.destroy();
		}
		
		return true;
	}

	return false;
}

//
// Player entered a location NOT in this instance
//

function player_exited_location(pc, loc){
	log.info(pc+' Exited location '+this.instance_id);
	if (!this.is_member(pc) || this.is_location(loc.tsid)) return; // oh well
	
	//
	// They snuck out!
	//
	
	if(this.shared_instance_manager) {
		// Pull us out of the shared instance manager
		this.shared_instance_manager.playerLeavingInstance(pc);
	}

	if (this.game){
		this.game.playerLeft(pc);
	}

	if (loc.isInHell()) return; // croaking doesn't count
	
	// If we have left for another instance, persist this place
	if (!loc.isInstance() || this.instance_id == 'hell_one') this.player_exit(pc);
}

//
// Player 'pc' has logged in
//

function player_login(pc){
	if (this.game){
		this.game.playerEntered(pc);
	}
}

//
// Player 'pc' has logged out
//

function player_logout(pc){
	if (this.game){
		log.info('[GAMES] '+pc+' logged out of running game: '+this.game);
		this.game.playerLeft(pc);
	}
	
	if (this.game_uid){
		log.info('[GAMES] '+pc+' logged out of game instance: '+this.game_uid);
		pc.games_auto_leave();
	}
}

//
// Is 'pc' a member of this instance?
//

function is_member(pc){
	return this.members && this.members[pc.tsid] ? true : false;
}

//
// Can 'pc' join this instance?
//

function can_join(pc){
	return true;
}

//
// How many players are in this instance?
//

function count_members(){
	return num_keys(this.members);
}

//
// Who's here?

function get_members(){
	return this.members;
}

//
// Destroy this instance
//

function destroy(force){
	log.info(this+' Destroying instance '+this.instance_id);
	
	this.destruction_scheduled = true;
	
	//
	// Kick out remaining members, if forcing
	//
	
	if (force){
		for (var i in this.members){
			this.events_add({callback: 'player_exit_notify', tsid: i, force: force}, 1);
		}
	}
	
	//
	// Give a chance for players to leave
	//
	
	this.events_add({callback: 'destroy_do', force: force}, 2*60);
}

function destroy_do(details){
	log.info(this+' Destroying instance DO '+this.instance_id);
	if (num_keys(this.members)){
		// Check for deleted members
		for (var i in this.members){
			var pc = getPlayer(i);
			if (!pc || !pc.instances_has(this.instance_id)){
				delete this.members[i];
			}
			else if (details && details.force){
				this.events_add({callback: 'player_exit_notify', tsid: i, force: details.force}, 1);
			}
		}
		
		if (num_keys(this.members)){
			log.error("WTF? Cannot delete populated instance (members): "+this);
			this.events_add({callback: 'destroy_do', force: details.force}, 2*60);
			return;
		}
	}
	
	//
	// Destroy all locations
	//
	
	for (var i in this.locations){
		var loc = apiFindObject(this.locations[i]);
		if (num_keys(loc.getAllPlayers())){
			if (details && details.force){
				log.error("WTF? Cannot delete populated instance (locations): "+this);
				//this.events_add({callback: 'destroy_do', force: details.force}, 2*60);
			}
			else{
				//this.events_add({callback: 'destroy_do', force: details.force}, 60*60);
			}

			return;
		}
		//loc.removeAllItems();
		loc.apiDelete();
	}
	
	delete this.members;
	delete this.locations;
	
	//
	// Destroy this object
	//
	
	this.apiDelete();
}

//
// Get the entrance to this instance, which is the tsid of the first location
//

function get_entrance(){
	var locations = this.get_locations();
	if (num_keys(locations)){
		return locations[0];
	}
}

//
// Is 'tsid' a location in this instance?
//

function is_location(tsid){
	return in_array(tsid, this.get_locations());
}

function get_locations(){
	return this.locations;
}

function set_prompt_uid(uid){
	this.prompt_uid = uid;
}

function get_prompt_uid(){
	return this.prompt_uid;
}

/////////////////////////////////////////////////////////////////
//
// Stuff for shared game instances
//

// Populate spawn points from all race start positions
function populate_spawn_points() {
	log.info('[GAMES] '+this+' populating spawn points');

	var location = apiFindObject(this.locations[0]);
	
	this.spawn_points = location.instances_list_spawn_points();
	this.exit_points = location.instances_list_exit_points();
}

// Add another spawn point to the list
function add_spawn_point(x, y) {
	log.info('[GAMES] '+this+' adding spawn point: '+x+','+y);

	if (this.spawn_points) this.spawn_points.push({x: x, y: y});
}

// Get a spawn point from the list, removing it so it will not be invoked again in the future.
function get_spawn_point() {
	if (this.spawn_points.length === 0){
		return null;
	}
	
	var index = randInt(0, this.spawn_points.length - 1);
	var result = {x: this.spawn_points[index].x, y: this.spawn_points[index].y};
	this.spawn_points.splice(index, 1);
	
	return result;
}

function count_spawn_points(){
	if (!this.spawn_points) return 0;

	return this.spawn_points.length;
}

// Pick a random exit point
function get_exit_point() {
	return choose_one(this.exit_points);
}

// Can this instance start?
function can_start_game() {
	// Do we have a manager and is it not already running?
	if(!this.shared_instance_manager || this.game_running) {
		log.info('[GAMES] '+this+' can_start_game: no instance manager or game is running');
		return false;
	}
	
	// Do we have the minimum number of ready players?
	var min_players = config.shared_instances[this.shared_instance_id].min_players;
	if (config.shared_instances[this.shared_instance_id].min_retry_players) min_players = config.shared_instances[this.shared_instance_id].min_retry_players;
	if (this.shared_instance_manager.countReadyPlayers(this.shared_instance_id, this.instance_uid) < min_players) {
		log.info('[GAMES] '+this+' can_start_game: not enough players: '+this.shared_instance_manager.countReadyPlayers(this.shared_instance_id, this.instance_uid)+' vs '+min_players);
		return false;
	}

	// Do we have any not ready players?
	if (this.shared_instance_manager.countNonReadyPlayers(this.shared_instance_id, this.instance_uid) > 0) {
		log.info('[GAMES] '+this+' can_start_game: nobody is ready: '+this.shared_instance_manager.countNonReadyPlayers(this.shared_instance_id, this.instance_uid));
		return false;
	}
	
	log.info('[GAMES] '+this+' can_start_game: oh, alright');
	return true;
}

// Flag the game as running (but not started)
function init_game() {
	log.info('[GAMES] '+this+' init game');

	this.game_running = true;
	this.game_uid = time();
}

// Yay! Create a game group object and start it
function start_game(id) {
	log.info('[GAMES] '+"Starting instanced game "+id+" in instance "+this);
		
	// Create a new game with the specified id
	this.game = apiNewGroup('global_game');
	this.game.startInstancedGame(this, id);
	
	this.populate_spawn_points();
}

// The game is over. Tell the instance manager and delete the reference to the game group object
function end_game() {
	log.info('[GAMES] '+this+" instance end_game");

	this.populate_spawn_points();
	if(this.shared_instance_manager) {
		this.shared_instance_manager.endGame(this.shared_instance_id, this.instance_uid);
	}
	
	this.game = null;
}

// A player is "out". Did they win?
function player_out(pc, success) {
	log.info('[GAMES] '+this+' player out');

	if(this.shared_instance_manager) {
		this.shared_instance_manager.playerOut(pc, success);
	}
}

// Is a game running?
function has_game_running() {
	return this.game_running;
}

// Reset the game running flag
function clear_game_running() {
	log.info('[GAMES] '+this+' clear game running');

	this.game_running = false;
}

// Get our shared instance manager object
function getInstanceManager(){
	return this.shared_instance_manager;
}
