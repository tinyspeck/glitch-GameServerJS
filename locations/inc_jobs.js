function jobs_init(id){
	if (!this.jobs) this.jobs = {};
	if (!this.jobs[id]) this.jobs[id] = {};
}


//
// Functions for getting/setting data that's edited in the Job Instances tool
//

function jobs_set_street_info(args){
	if (!args.id) return;
	
	var id = args.id;
	delete args.id;
	this.jobs_init(id);
	
	this.jobs[id].street_info = args;

	// Check if signposts need changing
	this.jobs_modify_connections();
}

function jobs_get_street_info(id){
	if (!this.jobs || !this.jobs[id]) return;

	return this.jobs[id].street_info;
}

function jobs_delete_street_info(id){
	if (!this.jobs || !this.jobs[id]) return false;

	delete this.jobs[id].street_info;
	
	if (!num_keys(this.jobs[id])) delete this.jobs[id];
	
	return true;
}

function jobs_set_class_ids(args){
	if (!args.id) return;
	if (!args.job_class_ids || !num_keys(args.job_class_ids)) return;
	
	var id = args.id;
	delete args.id;
	this.jobs_init(id);
	
	if (this.jobs[id].class_ids){
		for (var i in args.job_class_ids){
			if (this.jobs[id].class_ids[i] && this.jobs[id].class_ids[i].instance){
				args.job_class_ids[i].instance = this.jobs[id].class_ids[i].instance;
			}
		}
	}
	
	if (this.jobs[id].instance){
		for (var i in args.job_class_ids){
			if (this.jobs[id].instance.class_tsid == i){
				args.job_class_ids[i].instance = this.jobs[id].instance;
			}
		}
	}
	
	this.jobs[id].class_ids = args.job_class_ids;

	if (this.jobs[id].instance) delete this.jobs[id].instance;

	// Check if signposts need changing
	this.jobs_modify_connections();
}

function jobs_get_options(id){
	var job = this.jobs_get(id);
	if (!job) return;
	
	if (job.type == 1 || job.type == 3){
		var upgrade_details = this.upgrades_get_details();
		if (upgrade_details){
			return [upgrade_details.current];
		}
	}
	else if (job.type == 2 || job.type == 4){
		var upgrade_details = this.upgrades_get_details();
		if (upgrade_details){
			return upgrade_details.upgrade;
		}
	}
	else if (job.type == 5){
		var upgrade_details = this.upgrades_get_details();
		if (upgrade_details){
			return [upgrade_details.current];
		}
	}
	else if (job.type == 6){
		if (!this.spirit_tsid) return [];

		var offerer = apiFindObject(this.spirit_tsid);
		if (!offerer) return [];

		if (!offerer.getUpgradeOptions) return [];
		return offerer.getUpgradeOptions();
	}
}

//
// Hash of all phases for an instance id
//

function jobs_get_phases(id){
	this.jobs_init(id);

	var phases = {};
	for (var i in this.jobs[id].class_ids){
		phases[i] = this.jobs[id].class_ids[i];
		phases[i].instance = this.jobs_get_instance(id, i);
		if (!phases[i].label && phases[i].instance) phases[i].label = phases[i].instance.getTitle();
	}
	return phases;
}

//
// How many phases for an instance id?
//

function jobs_count_phases(id){
	this.jobs_init(id);
	
	return num_keys(this.jobs[id].class_ids);
}

//
// Returns the currently-available phase
//

function jobs_get_current_phase(id){
	this.jobs_init(id);
	
	if (!this.jobs[id].class_ids) return null;
	
	var class_ids = this.jobs[id].class_ids;
	var lowest = null;
	var highest = null;
	for (var i in class_ids){
		if (class_ids[i].instance && !class_ids[i].instance.isDone()){
			if (!lowest || class_ids[lowest].in_order > class_ids[i].in_order){
				lowest = i;
			}
		}
		else if (class_ids[i].instance){
			if (!highest || class_ids[highest].in_order < class_ids[i].in_order){
				highest = i;
			}
		}
		else{
			if (!lowest || class_ids[lowest].in_order > class_ids[i].in_order){
				lowest = i;
			}
		}
	}
	
	var current;
	if (lowest && (!highest || class_ids[highest].in_order < class_ids[lowest].in_order)){
		current = class_ids[lowest];
		if (current) current.class_id = lowest;
	}
	else{
		current = class_ids[highest];
		if (current) current.class_id = highest;
	}
	
	return current;
}

//
// Returns the next-available phase
//

function jobs_get_next_phase(id){
	var current = this.jobs_get_current_phase(id);
	if (!current) return null;
	
	var class_ids = this.jobs[id].class_ids;
	var next = null;
	for (var i in class_ids){
		if (class_ids[i].instance && !class_ids[i].instance.isDone()){
			if (class_ids[i].in_order == (current.in_order+1)){
				next = i;
				break;
			}
		}
		else if (!class_ids[i].instance){
			if (class_ids[i].in_order == (current.in_order+1)){
				next = i;
				break;
			}
		}
	}
	
	var ret = class_ids[next];
	if (ret) ret.class_id = next;
	
	return ret;
}

//
// Returns the previously-complete phase
//

function jobs_get_previous_phase(id){
	var current = this.jobs_get_current_phase(id);
	if (!current || current.in_order == 1) return null;
	
	var class_ids = this.jobs[id].class_ids;
	var prev = null;
	for (var i in class_ids){
		if (class_ids[i].instance && class_ids[i].instance.isDone()){
			if (class_ids[i].in_order == (current.in_order-1)){
				prev = i;
				break;
			}
		}
	}
	
	var ret = class_ids[prev];
	if (ret) ret.class_id = prev;
	
	return ret;
}

function jobs_get_first_phase(id){
	
	var class_ids = this.jobs[id].class_ids;
	var first = null;
	for (var i in class_ids){
		if (class_ids[i].instance){
			first = i;
		}
	}
	
	var ret = class_ids[first];
	if (ret) ret.class_id = first;
	
	return ret;
}

//
// Given an instance id and a phase class_id, return the options hash for it (delay seconds, delay text)
//

function jobs_get_phase_options(id, class_id){
	this.jobs_init(id);

	if (!this.jobs[id].class_ids) return null;
	return this.jobs[id].class_ids[class_id];
}

//
// Start a job and return it, or if it's already started, return that
//

function jobs_start(id){
	var job = this.jobs_get(id);
	if (job) return job;
	
	var primary = this.jobs_get_primary_loc(id);
	if (primary){
		var instance = primary.jobs_get_instance(id);
		if (!instance){

			//
			// Start a new instance!!!
			//
		
			var street_info = primary.jobs_get_street_info(id);
			var current_phase = primary.jobs_get_current_phase(id);
			log.info("Current phase for "+id+": "+current_phase);
			if (street_info && current_phase){
				instance = apiNewOwnedQuest(current_phase.class_id, primary);

				if (instance){
					//
					// For the job instance, the "primary" is wherever the job street is
					//
					
					var job_street;
					if (street_info.target_street){
						job_street = apiFindObject(street_info.target_street);
					}
					else{
						job_street = primary;
					}
					
					instance.onJobStart(job_street, id);
					primary.jobs_set_instance(id, instance);
					this.jobs_modify_connections();
				}
			}
		}

		return this.jobs_get(id);
	}
	
	return null;
}


//
// Return the job data for this job, if it exists
//

function jobs_get(id, class_id){
	var primary = this.jobs_get_primary_loc(id);
	if (primary){
		var instance = primary.jobs_get_instance(id, class_id);
		
		return instance;
	}
	
	return null;
}


//
// Private function. Sets the job instance (the Quest object) for this location
//

function jobs_set_instance(id, instance, class_id){
	this.jobs_init(id);
	
	var current_phase;
	if (!class_id){
		current_phase = this.jobs_get_current_phase(id); // Assume we always want the current phase
	}
	else{
		current_phase = this.jobs_get_phase_options(id, class_id);
	}
	if (!current_phase) return false;
	
	if (current_phase.instance) return false; // Refuse to overwrite existing instance
	
	if (!instance.instance_id) instance.instance_id = id;
	current_phase.instance = instance;
	
	return true;
}

//
// Private function. Deletes the job instance (the Quest object) for this location. Don't do this.
//

function jobs_delete_instance(id, class_id){
	this.jobs_init(id);
	
	var current_phase;
	if (!class_id){
		current_phase = this.jobs_get_current_phase(id); // Assume we always want the current phase
	}
	else{
		current_phase = this.jobs_get_phase_options(id, class_id);
	}
	if (!current_phase) return false;
	
	if (!current_phase.instance) return false;
	
	current_phase.instance.apiDelete();
	delete current_phase.instance;
	
	return true;
}


//
// Private function. Gets the job instance (the Quest object) for this location
//

function jobs_get_instance(id, class_id){
	this.jobs_init(id);
	
	var current_phase;
	if (!class_id){
		current_phase = this.jobs_get_current_phase(id); // Assume we always want the current phase
	}
	else{
		current_phase = this.jobs_get_phase_options(id, class_id);
	}
	if (!current_phase) return false;
	
	return current_phase.instance;
}


//
// Does this location contain job info (primary or not)?
//

function jobs_has(){
	if (num_keys(this.jobs) > 0) return true;
	
	return false;
}


//
// Get all jobs that apply to this location (upgrades AND unlocks)
//

function jobs_get_all(no_auto_start){
	var jobs = {};
	
	for (var id in this.jobs){
		if (!this.jobs[id].class_ids) continue;
		if (!this.jobs[id].street_info) continue;

		var job = this.jobs_get(id);
		if (!job && !no_auto_start) job = this.jobs_start(id);
		jobs[id] = job;
	}
	
	return jobs;
}


//
// Get only jobs that are available for handing out
// Available is a bit of a misnomer here, since it includes jobs that have been completed.
// What we mean is, street unlocks can only be done on connecting streets, etc
//

function jobs_get_available(){
	var jobs = {};
	
	var all = this.jobs_get_all();
	for (var id in all){
		var job = all[id];
		
		//
		// Test that this job is available for handing out.
		//
		
		// No street info? Not available!
		var street_info = this.jobs_get_street_info(id);
		if (!street_info) continue;
		
		// If we don't have an instance, try and create one
		if (!job) job = this.jobs_start(id);
		if (!job) continue;
		
		// Is it offered?
		if (street_info.is_hidden == 1) continue;
		
		// Unlocks are only available on connecting streets
		if ((job.type == 1 || job.type == 3) && street_info.type != 2) continue;
		
		// Upgrades are only available on the primary
		if ((job.type == 2 || job.type == 4) && street_info.type != 1) continue;

		// Proto jobs don't come from here
		if (job.type == 5) continue;
		
		// Minimum level req
		if (street_info.required_street_level && street_info.required_street_level > this.upgrade_level) continue;
		
		// Long enough since the most recent job?
		if (!job.isDone() && job.type < 3){
			var recent = this.jobs_get_last_job();
			if (recent && recent.getProp('type') < 3 && time() - recent.getProp('ts_done') < (30 * 60)) continue;
		}
		
		// Good, it's available
		jobs[id] = job;
	}
	
	return jobs;
}


//
// Find the primary street for a job... might be ourselves!
//

function jobs_get_primary_loc(id, do_full_check){
	//
	// If we have an instance here, we are the primary
	//
	
	if (!do_full_check){
		var instance = this.jobs_get_instance(id);
		if (instance) return this;
	}
	
	//
	// Go in search
	//
	
	var street_info = this.jobs_get_street_info(id);
	if (street_info){
		//
		// Job street with no connecting streets, then we are primary
		//
		
		if (street_info.type == 1 && !street_info.connecting_streets) return this;
	
		//
		// Job street with more than one connecting street, then we are primary
		//
		
		if (street_info.type == 1 && num_keys(street_info.connecting_streets) > 1) return this;
		
		//
		// Job street with exactly one connecting street, that's the one
		//
		
		if (street_info.type == 1 && num_keys(street_info.connecting_streets) == 1) return apiFindObject(street_info.connecting_streets[0]);
	
		//
		// If we are a connecting street, go to the job street to find the primary
		//
	
		if (street_info.target_street) return apiFindObject(street_info.target_street).jobs_get_primary_loc(id);
	}
	
	return null;
}


//
// Hide/show signposts that point to locked/unlocked streets
//

function jobs_modify_connections(){
	log.info(this+' running jobs_modify_connections');
	//log.printStackTrace();
	
	var jobs = this.jobs_get_all();
	for (var i in jobs){
		var j = jobs[i];
		if (!j || (j.type != 1 && j.type != 3)) continue;
		
		//
		// We only run on the primary street
		//
		
		var street_info = this.jobs_get_street_info(i);
		
		if (street_info && street_info.type == 2){
			//
			// This is a connecting street. Load the primary and run it there
			//
			
			/*var loc = apiFindObject(street_info.target_street);
			if (loc){
				log.info(this+' jobs_modify_connections - switching to: '+loc);
				loc.jobs_modify_connections();
			}*/
		}
		else if (!street_info || street_info.type == 1){
			
			//
			// Lock/unlock this street as appropriate. We do the signposts below
			//
			
			if (!j || !j.isDone() || street_info.is_hidden == 1){
				log.info(this+' jobs_modify_connections - '+i+' : job is not complete or does not exist : '+j);
				this.jobs_is_locked = true;
			}
			else{
				log.info(this+' jobs_modify_connections - '+i+' : job is complete : '+j);
				this.jobs_is_locked = false;
			}
		}
	}
	
	//
	// Actually make changes
	//

	//log.info(this+' jobs_modify_connections - locked status: '+this.jobs_is_locked);
	var links = this.geo_links_get_incoming();
	//log.info(this+' jobs_modify_connections - links: '+links);
	for (var l in links){
		var link = links[l];
		//log.info(this+' jobs_modify_connections - checking link: '+link);

		if (link.source_type == 'signpost'){
			var loc = apiFindObject(link.street_tsid);
			if (this.jobs_is_locked){
				log.info(this+' jobs_modify_connections - street is locked');
				loc.geo_lock_signpost_connection(link.source_id, link.connect_id);
			}else{
				log.info(this+' jobs_modify_connections - street is UNlocked');
				loc.geo_unlock_signpost_connection(link.source_id, link.connect_id);
			}
		}
		else if (link.source_type == 'door'){
			var loc = apiFindObject(link.street_tsid);
			if (this.jobs_is_locked){
				log.info(this+' jobs_modify_connections - street is locked');
				loc.geo_lock_door_connection(link.source_id);
			}else{
				log.info(this+' jobs_modify_connections - street is UNlocked');
				loc.geo_unlock_door_connection(link.source_id);
			}
		}
	}


	//
	// Any quarters here? Make sure they get updated.
	//

	if (!this.quarter_tsid){
		var quarters = this.getQuarters();
		for (var i in quarters){
			var q = apiFindObject(i);
			if (q) q.refresh_all();
		}
	}


	//
	// Unlock any streets we connect to that are flagged as auto-unlock
	//

	var links = this.geo_links_get_outgoing();
	for (var i in links){
		var t = links[i].target;
		if (t && t.jobs_is_auto_unlock()) t.jobs_unlock();
	}
}

function jobs_unlock(){
	if (this.jobs_is_street_locked()){
		delete this.jobs_is_locked;

		this.jobs_modify_connections();

		apiAdminCall('clearMapCache', {hub_id: this.hubid});
		this.updateMap();
		apiReloadDataForGlobalPathFinding();
	}
}

//
// Run jobs_modify_connections on all streets that this street links to
//

function jobs_modify_outgoing_connections(){
	var links = this.geo_links_get_outgoing();
	for (var i in links){
		if (links[i].target) links[i].target.jobs_modify_connections();
	}
}

//
// Get the streets that are affected by this job
//

function jobs_get_streets(id){
	var streets = [];
	
	var street_info = this.jobs_get_street_info(id);
	if (street_info){
		if (street_info.type == 1 && !street_info.connecting_streets) streets.push(this.tsid);
		
		if (street_info.type == 1 && num_keys(street_info.connecting_streets) > 0){
			streets.push(this.tsid);
			for (var i in street_info.connecting_streets){
				streets.push(street_info.connecting_streets[i]);
			}
		}
	
		if (street_info.target_street) return apiFindObject(street_info.target_street).jobs_get_streets(id);
	}
	
	return streets;
}

function jobs_reset(id, just_delete){
	if (!this.jobs[id] || !this.jobs[id].class_ids) return;
	
	for (var i in this.jobs[id].class_ids){
		var instance = this.jobs[id].class_ids[i].instance;
		if (!instance) continue;
		
		// Wipe contributors
		for (var pc_tsid in instance.contributions){
			var pc = getPlayer(pc_tsid);
			if (pc){
				pc.jobs_delete(this.tsid, id);
			}
		}
	
		// TODO: This should perform cleanup, like downgrading streets, etc
	
		instance.apiDelete();
		delete this.jobs[id].class_ids[i].instance;
	}
	
	if (!just_delete){
		delete this.jobs_is_locked;
		
		this.jobs_modify_connections();

		var job = this.jobs_get_instance(id);
		var spirit = this.find_items(function(it){ return it.hasJobs && it.canOffer(job) ? true : false; });
		if (spirit[0]){
			spirit[0].updatePlayers(id, null, true);
		}

		// Perform a callback
		var args = {
			street_id	: this.tsid,
			job_id		: id
		};
		utils.http_get('callbacks/job_update.php', args);
	}
}

//
// Is this street locked?
//

function jobs_is_street_locked(){
	if (this.jobs_is_locked) return true;
	if (this.jobs_is_locked !== undefined && !this.jobs_is_locked) return false;
	
	var job_id = this.jobs_get_unlock_job_id();
	if (job_id){
		this.jobs_is_locked = true;
		return true;
	}
	
	this.jobs_is_locked = false;
	return false;
}

function jobs_get_unlock_job_id(){
	var all = this.jobs_get_all();
	for (var id in all){
		var job = all[id];
		if (job){
			var street_info = this.jobs_get_street_info(id);
			if (street_info){
		
				if (job.type == 1 && street_info.type == 1 && !job.isDone()) return id;
			}
		}
	}
	
	return null;
}

//
// Is this street available?
// For unlocked streets, always true. For locked streets, is it reachable by other unlocked streets and on-offer by a street spirit?
//

function jobs_is_street_available(){
	if (this.pols_is_pol()) return true;
	if (!this.jobs_is_street_locked()) return true;

	log.info(this+' jobs_is_street_available');
	//if (this.jobs_is_street_available) return true;
	
	// Walk incoming connections, find any that are unlocked
	var links = this.geo_links_get_incoming();
	for (var l in links){
		var link = links[l];
		if (link.source_type == 'signpost' || link.source_type == 'door'){
			var loc = apiFindObject(link.street_tsid);
			if (loc && !loc.jobs_is_street_locked()){
				// Found an unlocked street that links here, now look for a street spirit that's offering a job here

				var job_id = this.jobs_get_unlock_job_id(); // our job_id
				if (job_id){
					var streets = this.jobs_get_streets(job_id); // streets that are affected by this job, including us and any connecting streets
					for (var i in streets){
						if (streets[i] == loc.tsid){ // job is on the street that connects here
							// Get all available jobs on the street
							var available = loc.jobs_get_available();
							for (var a in available){
								if (available[a]){
									// First available job is the one on-offer in that street
									if (!available[a].isDone()){
										if (a == job_id){ // If the available job is us, then we win!
											//this.jobs_is_street_available = true;
											//apiAdminCall('clearMapCache', {hub_id: this.hubid});
											return true;
										}
										break;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	return false;
}

//
// Return the most recent completed job for this street
//

function jobs_get_last_job(){
	var recent = null;
	var all = this.jobs_get_all();
	for (var id in all){
		var job = all[id];
		if (job){
			if (job.isDone()){
				if (!recent){
					recent = job;
				}
				else if (recent.getProp('ts_done') < job.getProp('ts_done')){
					recent = job;
				}
			}
		}
	}
	
	return recent;
}

function jobs_announce_phase(instance_id, class_id){
	var job = this.jobs_get_instance(instance_id, class_id);
	if (!job) return false;

	var spirit = this.find_items(function(it){ return it.hasJobs && it.canOffer(job) ? true : false; });
	if (spirit[0]){
		spirit[0].updatePlayers(instance_id, class_id, true);
	}
}


//
// Debug function for testing (and fixing!) various things about the instances for the jobs on this location
//

function jobs_check_instances(){
	for (var id in this.jobs){
		var primary_loc = this.jobs_get_primary_loc(id, true);

		if (this.jobs[id].instance){
			log.info(this+' jobs_check_instances has instance for '+id+' that is not a phase');
		}

		for (var class_id in this.jobs[id].class_ids){

			var phase = this.jobs[id].class_ids[class_id];
			if (primary_loc.tsid == this.tsid){
				// TODO
			}
			else{
				if (phase.instance){
					// Uh-oh. We are not the primary loc, but we have an instance

					// Does the primary loc have one too?
					if (primary_loc.jobs_get_instance(id, class_id)){
						// Shit
						log.info(this+' jobs_check_instances has instance for '+id+'/'+class_id+', but so does '+primary_loc);

						if (phase.instance.isDone()){
							// Double shit
							log.info(this+' jobs_check_instances instance for '+id+'/'+class_id+' is complete');
						}
						else{
							// Whew! We can just nuke it
							log.info(this+' jobs_check_instances instance for '+id+'/'+class_id+' is not complete');

							primary_loc.jobs_delete_instance(id, pclass_id);
						}
					}
					else{
						// Ok, easy, we'll just move it
						log.info(this+' jobs_check_instances has instance for '+id+'/'+class_id+', but '+primary_loc+' does not');

						primary_loc.jobs_set_instance(id, phase.instance, class_id);
						delete phase.instance;
					}
				}
			}
		}
	}
}

function jobs_is_auto_unlock(){
	return this.jobs_auto_unlock ? true : false;
}

// NEVER do this on a public street
function jobs_delete_all(){
	for (var id in this.jobs){
		this.jobs_reset(id, true);
		delete this.jobs[id];
	}
}

function jobs_find_spirit(tsid){
	var spirit = apiFindObject(tsid);
	if (!spirit || !spirit.hasJobs){
		spirit = this.find_items(function(it, args){ return it.hasJobs && it.previous_spirit_id == args ? true : false; }, tsid);
		if (spirit[0] && spirit[0].hasJobs){
			return spirit[0];
		}
		else{
			return null;
		}
	}

	return spirit;
}