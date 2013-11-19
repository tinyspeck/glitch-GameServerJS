//#include events.js
function getAvailableJobs(pc){
	//
	// 'open' jobs are available ones which we have not contributed to
	// 'given' jobs are available ones which we HAVE contributed to
	//
	
	var jobs = {
		open		: {},
		given		: {},
		complete	: {},
		delayed		: {}
	};

	var loc = this.getLocation();
	if (!loc) return {};
	
	var available = loc.jobs_get_available();

	if (this.has_parent('proto') && this.getClassProp('job_class_id') !== '' && this.getClassProp('job_class_id') !== undefined){
		available['proto-'+this.tsid] = loc.jobs_get('proto-'+this.tsid);
	}

	if (this.has_parent('furniture_base') && this.getClassProp('job_class_id') !== '' && this.getClassProp('job_class_id') !== undefined){
		available['proto-'+this.tsid] = loc.jobs_get('proto-'+this.tsid);
	}

	if (this.is_upgradeable && this.getClassProp('job_class_id') !== '' && this.getClassProp('job_class_id') !== undefined){
		available['upgrade-'+this.tsid] = loc.jobs_get('upgrade-'+this.tsid);
	}

	// for special items, they can just return an array of jobIds they own
	if (this.myJobIds){
		var ids = this.myJobIds();
		for (var i=0; i<ids.length; i++){
			available[ids[i]] = loc.jobs_get(ids[i]);
		}
	}
	
	for (var id in available){
		if (!this.canOffer(available[id])) continue;
		if (this.instanceProps && this.instanceProps.job_id != undefined){
			if (this.instanceProps.job_id != id) continue;
		}

		if (available[id]){
			if (available[id].isDone()){
				jobs.complete[id] = available[id];
			}
			else if (!available[id].canOffer()){
				jobs.delayed[id] = available[id];
			}
			else if (pc && pc.jobs_has(loc.tsid, id)){
				jobs.given[id] = available[id];
			}
			else{
				jobs.open[id] = available[id];
			}
		}
		else{
			jobs.open[id] = null;
		}
	}
	
	return jobs;
}

function hasInProgressJob(pc){
	var jobs = this.getAvailableJobs(pc);

	for (var i in jobs.given){
		var job = jobs.given[i];
		if (!job) continue;
		
		var job_info = job.get_status(pc, 'todo');
		if (job_info.perc > 0) return true;
	}

	for (var i in jobs.open){
		var job = jobs.open[i];
		if (!job) continue;
		if (job.isDone()) continue;

		var job_info = job.get_status(pc, 'todo');
		if (job_info.perc > 0) return true;
	}

	return false;
}

function hasJobs(pc){
	var jobs = this.getAvailableJobs(pc);
	if (num_keys(jobs.open) > 0 || num_keys(jobs.given) > 0) return true;
	
	return false;
}

function canOffer(job){
	if (!job) return true;

	if (this.is_streetspirit){
		if (job.type == 1 || job.type == 2 || job.type == 4) return true;
	}
	else if (this.class_id == 'group_hall_lot_marker'){
		if (job.type == 3) return true;
	}
	else if (this.has_parent('proto')){
		if (job.type == 5) return true;
	}
	else if (this.has_parent('furniture_base')){
		if (job.type == 5) return true;
	}

	if (this.myJobIds){
		var ids = this.myJobIds();
		for (var i=0; i<ids.length; i++){
			if (job.instance_id == ids[i]) return true;
		}
	}

	return false;
}

function offerJobs(pc, msg){

	var jobs = this.getAvailableJobs(pc);
	

	//
	// jobs that have been given, but are incomplete, take priority
	//

	if (num_keys(jobs.given)){

		for (var i in jobs.given){
			var qi = jobs.given[i];

			return this.sendJobStatus(pc, qi);
		}
	}
	

	//
	// offer the first job?
	//

	if (num_keys(jobs.open)){

		for (var id in jobs.open){
			var qi = jobs.open[id];
			if (!qi){
				qi = this.startJob(id, pc);
			}

			return this.sendJobStatus(pc, qi);
		}
	}
}

function startJob(job_id, pc){
	var loc = this.getLocation();
	if (!loc) return null;
	
	
	var job = loc.jobs_start(job_id);
	if (job){
		if (!job.spirit_tsid) job.spirit_tsid = this.tsid;
		var current = loc.jobs_get_current_phase(job_id);
		pc.jobs_accept(job_id, job.getPrimaryLocation(), current.class_id);
	}
	
	return job;
}

// Given a job_id, grab it if it's available, and accept it for the pc if they don't already have it
function getAndAccept(pc, job_id){
	var jobs = this.getAvailableJobs(pc);
	if (!jobs.given) return null;

	if (jobs.given[job_id]){
		if (!jobs.given[job_id].spirit_tsid) jobs.given[job_id].spirit_tsid = this.tsid;
		return jobs.given[job_id];
	}
	
	if (jobs.open[job_id]){
		this.startJob(job_id, pc);
		return jobs.open[job_id];
	}
	
	if (jobs.complete[job_id]){
		return jobs.complete[job_id];
	}
	
	return null;
}

function acceptJobItem(pc, job_id, itemstacks, option){
	var job = this.getAndAccept(pc, job_id);
	if (!job) return false;
	
	if (job.isDone()) return false;
	
	var total = 0;
	for (var i=0; i<itemstacks.length; i++){
		total += itemstacks[i].count;
	}
	
	var actual = job.inc_item(pc, itemstacks[0].class_tsid, total, option);
	
	var remaining = actual;
	for (var i=0; i<itemstacks.length; i++){
		var itemstack = itemstacks[i];
		
		var orig = itemstack.count;
		if (remaining >= itemstack.count){
			itemstack.apiDelete();
		}
		else if (remaining && remaining < itemstack.count){
			var taken = itemstack.apiSplit(actual);
			taken.apiDelete();

			pc.items_put_back(itemstack);
		}
		else if (remaining <= 0){
			pc.items_put_back(itemstack);
		}
		
		remaining -= orig;
	}
	
	
	if (actual) this.updatePlayers(job_id);
	return true;
}

function acceptJobCurrants(pc, job_id, currants, option){
	var job = this.getAndAccept(pc, job_id);
	if (!job) return false;
	
	if (job.isDone()) return false;
	
	if (pc.stats_has_currants(currants)){
		var actual = job.inc_currants(pc, currants, option);
		pc.stats_remove_currants(actual, {type: 'job_contribution', job: job_id});
		if (actual) this.updatePlayers(job_id);
		return true;
	}
	
	return false;
}

function startJobWork(pc, job_id, tool_class_id, contribute_count, option){
	var job = this.getAndAccept(pc, job_id);
	if (!job) return false;
	
	if (job.isDone() || !job.isStarted(pc)) return false;
	
	var req = job.find_work(tool_class_id);
	if (!req) return false;
	//log.info(req);

	function is_tool(it, args){ return it.is_tool && it.isWorking() && it.class_tsid == args ? true : false; }
	var tool = pc.findFirst(is_tool, tool_class_id);

	if (!tool){
		return false;
	}
	
	if (req.skill && !pc.skills_has(req.skill)){
		return false;
	}
	
	//log.info(this+' starting work for '+pc);
	
	//
	// Store this where we can look it up, start a timer, tell the player
	//
	
	var counter_limit = contribute_count ? contribute_count : req.status.need_num-req.status.got_num;
	var unit_duration = 1500;
	
	if (!this['!work_in_progress']) this['!work_in_progress'] = {};
	this['!work_in_progress'][pc.tsid] = {
		tool: tool_class_id,
		option: option,
		counter_limit: counter_limit,
		unit_duration: unit_duration,
		counter: 0,
		job_id: job_id,
		class_id: job.class_tsid
	};

	var anncx = {
		type: 'pc_overlay',
		duration: unit_duration * counter_limit,
		pc_tsid: pc.tsid,
		delta_x: 0,
		delta_y: -110,
		bubble: true,
		width: 40,
		height: 40,
		item_class: tool_class_id,
		state: 'tool_animation',
		uid: pc.tsid+'_job_work_all'
	};

	this.container.apiSendAnnouncementX(anncx, pc);
	pc.announce_sound(tool_class_id.toUpperCase(), 999);
	
	this.events_add({pc_tsid: pc.tsid, job_id: job_id, class_id: job.class_tsid, callback: 'acceptJobWork'}, unit_duration / 1000);
	
	return {
		tool_class_id: tool_class_id,
		units: counter_limit,
		unit_duration: unit_duration,
		unit_energy: req.energy
	};
}

function acceptJobWork(details){
	var job_id = details.job_id;
	var class_id = details.class_id;
	var pc = getPlayer(details.pc_tsid);
	
	//log.info(this+' ticking work for '+pc);
	
	var job = this.getLocation().jobs_get(job_id, class_id);
	if (!job){
		//log.info('no job');
		this.cancelJobWork(pc);
		return false;
	}
	//log.info('job: '+job);
	
	if (job.isDone() || !job.isStarted(pc)){
		//log.info('job complete');
		this.cancelJobWork(pc);
		return false;
	}
	
	var in_progress = this['!work_in_progress'][pc.tsid];
	if (!in_progress){
		//log.info('no in progress');
		this.cancelJobWork(pc);
		return false;
	}
	//log.info('in_progress: '+in_progress);
	
	if (in_progress.counter >= in_progress.counter_limit){
		//log.info('over limit');
		this.cancelJobWork(pc);
		return false;
	}
	
	var req = job.find_work(in_progress.tool);
	if (!req){
		log.info('no work');
		this.cancelJobWork(pc);
		return false;
	}
	//log.info('req: '+req);
	
	if (!apiIsPlayerOnline(pc.tsid)){
		//log.info('player went offline');
		this.cancelJobWork(pc);
		return false;
	}
	
	var loc = pc.get_simple_location();
	if (this.container.tsid != loc.tsid){
		//log.info('player left location');
		this.cancelJobWork(pc, "You left the location.");
		return false;
	}
	//log.info(in_progress);

	//
	// Check energy left, tool state, job state and cancel if necessary
	// Otherwise increment work unit, take energy, and record it
	//
	
	if (pc.metabolics_get_energy() <= req.energy){
		//log.info('no energy: '+pc.metabolics_get_energy()+' <= '+req.energy);
		this.cancelJobWork(pc, "You don't have enough energy to continue.");
		return false;
	}

	function is_tool(it, args){ return it.is_tool && it.isWorking() && it.class_tsid == args ? true : false; }
	var tool = pc.findFirst(is_tool, in_progress.tool);
	if (!tool){
		//log.info('no tool');
		this.cancelJobWork(pc, "You don't have the necessary working tool.");
		return false;
	}
		
	var actual = job.inc_work(pc, in_progress.tool, in_progress.option);
	if (actual){
		tool.use(pc, req.wear);
		pc.metabolics_lose_energy(req.energy);

		this.updatePlayers(job_id);

		this['!work_in_progress'][pc.tsid]['counter']++;
		this.events_add({pc_tsid: pc.tsid, job_id: job_id, callback: 'acceptJobWork'}, in_progress.unit_duration / 1000);
		
		return true;
	}
	
	//log.info('no increment');
	this.cancelJobWork(pc, "There's no more work left to do.");
	return false;
}

function cancelJobWork(pc, reason){
	var in_progress = this['!work_in_progress'][pc.tsid];
	if (!in_progress) return false;
	
	var location = this.getLocation();
	if (!location) return false;
	var job = location.jobs_get(in_progress.job_id, in_progress.class_id);

	if (job) var req = job.find_work(in_progress.tool);
	
	this.events_remove(function(details){
		if (details.callback == 'acceptJobWork' && details.pc_tsid == pc.tsid) return true;
		return false;
	});
	
	pc.sendMsgOnline({
		type: 'job_stop_work',
		spirit_id: this.tsid,
		job_id: in_progress.job_id
	});
	
	pc.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: pc.tsid+'_job_work_all'
	}, pc);

	if (reason){
		pc.prompts_add({
			txt		: reason,
			icon_buttons	: false,
			timeout		: 5,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
	
	if (req){
		var remaining = req.status.need_num-req.status.got_num;
		var msg = "Thanks! You contributed <b>"+in_progress.counter+" units</b> of the <b>"+(in_progress.counter+remaining)+"</b> we need right now. It took <b>"+(in_progress.counter * 1.5)+" seconds</b> and used <b>"+(in_progress.counter * req.energy)+" energy</b>.";
		this.sendBubble(msg, 5000, pc);
	}
	
	pc.announce_sound_stop(in_progress.tool.toUpperCase());
	
	delete this['!work_in_progress'][pc.tsid];
	
	return true;
}

function updatePlayers(job_id, class_id, force){
	// Tell all players on the affected street(s) about the update
	
	var loc = this.getLocation();
	if (!loc) return false;
	
	var job = loc.jobs_get(job_id, class_id);
	if (!job) return false;
	
	if (!force){
		if (!this['!status_throttle']) this['!status_throttle'] = {};
		if (!this['!status_throttle'][job_id]) this['!status_throttle'][job_id] = {};
		if (this['!status_throttle'][job_id] && time() - this['!status_throttle'][job_id] <= 2) return true;

		this['!status_throttle'][job_id] = time();
	}
	
	//var streets = loc.jobs_get_streets(job_id);
	var streets = [loc.tsid];
	for (var i in streets){
		if (streets[i] == loc.tsid){
			var street = loc;
		}
		else{
			var street = apiFindObject(streets[i]);
		}
		
		if (street){
			
			var players = street.getActivePlayers();
			for (var j in players){
				var pc = players[j];
				
				var status = this.buildJobStatus(pc, job);
				status.is_update = true;
				status.spirit_id = this.tsid;
				
				pc.apiSendMsgAsIs(status);
			}
		}
		
	}
	
	return true;
}

function sendJobStatus(pc, job){

	var status = this.buildJobStatus(pc, job);
	status.spirit_id = this.tsid;
	pc.sendMsgOnline(status);

}

function buildJobStatus(pc, job){

	var job_info = job.get_status(pc, 'todo');

	return {
		'type'		: 'job_status',
		'job_id'	: job_info.instance_id,
		'title'		: '* '+job.get_full_title(pc),
		'desc'		: '* '+job.get_full_description(pc),
		'info'		: job_info
	};
}

function getJobLeaderboard(pc, msg){
	var job = this.getAndAccept(pc, msg.job_id);
	if (!job) return make_fail_rsp(msg, 1, 'Invalid job id');
	
	var me = null;
	
	var total_bc = job.getTotalBasecost();
	var sorted = job.getSortedContributors();
	var leaderboard = {};
	
	for (var i=0; i<sorted.length; i++){
		if (num_keys(leaderboard) < 10){
			var player = getPlayer(sorted[i].pc_tsid);
			leaderboard[i] = {
				'position': i+1,
				'pc': player.make_hash_with_location(),
				'contributions': Math.round(sorted[i].base_cost / total_bc * 10000) / 100
			};
		}
		
		if (sorted[i].pc_tsid == pc.tsid){
			me = {
				'position': i+1,
				'contributions': Math.round(sorted[i].base_cost / total_bc * 10000) / 100
			};
		}
		
		if (leaderboard.length >= 10 && me) break;
	}
	
	leaderboard.me = me;
	
	var rsp = make_ok_rsp(msg);
	rsp.leaderboard = leaderboard;
	return rsp;
}

function resetJob(pc){
	var jobs = this.getAvailableJobs(pc);

	for (var i in jobs.given){
		var job = jobs.given[i];
		if (!job) continue;
		
		var job_info = job.get_status(pc, 'todo');
		if (job_info.perc > 0){
			this.container.jobs_reset(i);
			return true;
		}
	}

	for (var i in jobs.open){
		var job = jobs.open[i];
		if (!job) continue;

		var job_info = job.get_status(pc, 'todo');
		if (job_info.perc > 0){
			this.container.jobs_reset(i);
			return true;
		}
	}

	return false;
}
