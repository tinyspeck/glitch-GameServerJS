function jobs_init(){	
	if (!this.jobs) this.jobs = {};
	if (this.jobs.todo === undefined || this.jobs.todo === null){
		this.jobs.todo = apiNewOwnedDC(this);
		this.jobs.todo.label = 'To Do';
	}

	if (!this.jobs.todo.jobs) this.jobs.todo.jobs = {};

	if (this.jobs.done === undefined || this.jobs.done === null) {
		this.jobs.done = apiNewOwnedDC(this);
		this.jobs.done.label = 'Done';
	}

	if (!this.jobs.done.jobs) this.jobs.done.jobs = {};
}

function jobs_reset(){
	if (this.jobs){
		if (this.jobs.todo) this.jobs.todo.apiDelete();
		if (this.jobs.done) this.jobs.done.apiDelete();
		delete this.jobs;
	}
	this.jobs_init();
}

function jobs_has(job_location, job_id, class_id){
	return this.jobs_get_status(job_location, job_id, class_id) == null ? false : true;
}

function jobs_get_status(job_location, job_id, class_id){
	// Port old format to new format
	if (this.jobs.todo.jobs[job_id] == job_location){
		if (!this.jobs.todo.jobs[job_location]) this.jobs.todo.jobs[job_location] = {};
		this.jobs.todo.jobs[job_location][job_id] = {};
		delete this.jobs.todo.jobs[job_id];
	}
	else if (this.jobs.done.jobs[job_id] == job_location){
		if (!this.jobs.done.jobs[job_location]) this.jobs.done.jobs[job_location] = {};
		this.jobs.done.jobs[job_location][job_id] = {};
		delete this.jobs.done.jobs[job_id];
	}
	
	if (class_id){
		if (this.jobs.todo.jobs[job_location] && this.jobs.todo.jobs[job_location][job_id] && this.jobs.todo.jobs[job_location][job_id][class_id]) return 'todo';
		if (this.jobs.done.jobs[job_location] && this.jobs.done.jobs[job_location][job_id] && this.jobs.done.jobs[job_location][job_id][class_id]) return 'done';
	}
	else{
		if (this.jobs.todo.jobs[job_location] && this.jobs.todo.jobs[job_location][job_id]) return 'todo';
		if (this.jobs.done.jobs[job_location] && this.jobs.done.jobs[job_location][job_id]) return 'done';
	}
	
	return null;
}

function jobs_mark_complete(job_location, job_id, class_id, actual_rewards, performance_rewards){
	var status = this.jobs_get_status(job_location, job_id, class_id);
	if (status != 'todo') return false;
	
	if (class_id){
		if (!this.jobs.done.jobs[job_location]) this.jobs.done.jobs[job_location] = {};
		if (!this.jobs.done.jobs[job_location][job_id]) this.jobs.done.jobs[job_location][job_id] = {};
		
		if (this.jobs.todo.jobs[job_location][job_id][class_id]){
			this.jobs.done.jobs[job_location][job_id][class_id] = this.jobs.todo.jobs[job_location][job_id][class_id];
			delete this.jobs.todo.jobs[job_location][job_id][class_id];
		}
		else if (this.jobs.todo.jobs[job_location][job_id]){
			this.jobs.done.jobs[job_location][job_id][class_id] = this.jobs.todo.jobs[job_location][job_id];
			delete this.jobs.todo.jobs[job_location][job_id];
		}
		if (!num_keys(this.jobs.todo.jobs[job_location][job_id])) delete this.jobs.todo.jobs[job_location][job_id];
		if (!num_keys(this.jobs.todo.jobs[job_location])) delete this.jobs.todo.jobs[job_location];
	
		this.jobs.done.jobs[job_location][job_id][class_id].actual_rewards = actual_rewards;
		this.jobs.done.jobs[job_location][job_id][class_id].performance_rewards = performance_rewards;
	}
	else{
		if (!this.jobs.done.jobs[job_location]) this.jobs.done.jobs[job_location] = {};
		this.jobs.done.jobs[job_location][job_id] = this.jobs.done.jobs[job_location][job_id];
		delete this.jobs.todo.jobs[job_location][job_id];
		if (!num_keys(this.jobs.todo.jobs[job_location])) delete this.jobs.todo.jobs[job_location];
	
		this.jobs.done.jobs[job_location][job_id].actual_rewards = actual_rewards;
		this.jobs.done.jobs[job_location][job_id].performance_rewards = performance_rewards;
	}
	
	log.info(this+' got rewards for job '+job_location+'-'+job_id+' - '+actual_rewards+' - '+performance_rewards);
	
	return true;
}

function jobs_delete(job_location, job_id){
	delete this.jobs.todo.jobs[job_id];
	if (this.jobs.todo.jobs[job_location]){
		delete this.jobs.todo.jobs[job_location][job_id];
		if (!num_keys(this.jobs.todo.jobs[job_location])) delete this.jobs.todo.jobs[job_location];
	}
	
	delete this.jobs.done.jobs[job_id];
	if (this.jobs.done.jobs[job_location]){
		delete this.jobs.done.jobs[job_location][job_id];
		if (!num_keys(this.jobs.done.jobs[job_location])) delete this.jobs.done.jobs[job_location];
	}
}

//
// We simply store a pointer to the location that owns the job
//

function jobs_accept(job_id, location, class_id){
	if (this.jobs_has(location.tsid, job_id, class_id)) return false;

	if (!this.jobs.todo.jobs[location.tsid]) this.jobs.todo.jobs[location.tsid] = {};
	if (!this.jobs.todo.jobs[location.tsid][job_id]) this.jobs.todo.jobs[location.tsid][job_id] = {};
	this.jobs.todo.jobs[location.tsid][job_id][class_id] = {};
	
	return true;
}

//
// Fetch the location_id from ourselves and then the job data from there
//

function jobs_get(job_location, job_id, class_id){
	if (!job_id) return null;
	
	if (!job_location){
		if (this.jobs.todo.jobs[job_id]) job_location = this.jobs.todo.jobs[job_id];
	}
	if (!job_location){
		if (this.jobs.done.jobs[job_id]) job_location = this.jobs.done.jobs[job_id];
	}
	if (!job_location){
		return null;
	}
	
	// Port old format to new format
	if (this.jobs.todo.jobs[job_id] == job_location){
		if (!this.jobs.todo.jobs[job_location]) this.jobs.todo.jobs[job_location] = {};
		this.jobs.todo.jobs[job_location][job_id] = {};
		delete this.jobs.todo.jobs[job_id];
	}
	else if (this.jobs.done.jobs[job_id] == job_location){
		if (!this.jobs.done.jobs[job_location]) this.jobs.done.jobs[job_location] = {};
		this.jobs.done.jobs[job_location][job_id] = {};
		delete this.jobs.done.jobs[job_id];
	}
	
	if (this.jobs.todo.jobs[job_location] && !this.jobs.todo.jobs[job_location][job_id]){
		for (var i in this.jobs.todo.jobs[job_location]){
			var jobs = apiFindObject(job_location).jobs_get_all();
			for (var j in jobs){
				var job = jobs[j];
				if (!job) continue;
				
				if (job.class_tsid == i){
					var instance_id = job.getInstanceId();
					if (instance_id){
						this.jobs.todo.jobs[job_location][instance_id] = this.jobs.todo.jobs[job_location][job.class_tsid];
						delete this.jobs.todo.jobs[job_location][job.class_tsid];
					}
				}
				
				if (job_id == job.class_tsid) job_id = job.getInstanceId();
			}
		}
	}
	
	if (this.jobs.done.jobs[job_location] && !this.jobs.done.jobs[job_location][job_id]){
		for (var i in this.jobs.done.jobs[job_location]){
			var jobs = apiFindObject(job_location).jobs_get_all();
			for (var j in jobs){
				var job = jobs[j];
				if (!job) continue;
				
				if (job.class_tsid == i){
					var instance_id = job.getInstanceId();
					if (instance_id){
						this.jobs.done.jobs[job_location][instance_id] = this.jobs.done.jobs[job_location][job.class_tsid];
						delete this.jobs.done.jobs[job_location][job.class_tsid];
					}
				}
				
				if (job_id == job.class_tsid) job_id = job.getInstanceId();
			}
		}
	}
	
	// And thus begins the only part that matters
	var job_loc = null;
	if (this.jobs.todo.jobs[job_location] && this.jobs.todo.jobs[job_location][job_id]) job_loc = apiFindObject(job_location);
	if (this.jobs.done.jobs[job_location] && this.jobs.done.jobs[job_location][job_id]) job_loc = apiFindObject(job_location);
	
	if (job_loc){
		return job_loc.jobs_get(job_id, class_id);
	}
	
	return null;
}

function jobs_familiar_turnin(job_location, job_id, class_id, is_winner){

	this.jobs_familiar_turnin_cancel(job_location, job_id, class_id);

	if (this.is_dead) return;
    this.familiar_send_alert({
		'callback'	: 'jobs_familiar_turnin_do',
		'job_location'	: job_location,
		'job_id'	: job_id,
		'class_id'	: class_id,
		'is_winner'	: is_winner,
    });
}

function jobs_familiar_turnin_cancel(job_location, job_id, class_id){

	// remove any turnin alert about this job from the queue

	var alerts = this.familiar_find_alerts('jobs_familiar_turnin_do');

	for (var i in alerts){
		if (alerts[i].job_id == job_id && alerts[i].job_location == job_location && (!alerts[i].class_id || alerts[i].class_id == class_id)){

			this.familiar_remove_alert(i);
		}
	}
}

function jobs_familiar_turnin_do(choice, details){
	
	//log.info(this+' jobs_familiar_turnin_do(): '+choice+' - '+details);
	
	var job = this.jobs_get(details.job_location, details.job_id, details.class_id);
	if (!job){
		// must not have contributed to this phase. let's go grab it from the location
		job = apiFindObject(details.job_location).jobs_get(details.job_id, details.class_id);
	}

	if (choice == 'job-complete'){
				
		if (job && job.isDone()){
			var contributions = job.getContributions();
			var my_contribution = contributions[this.tsid];
			if (my_contribution){
				var actual_rewards = job.onComplete(this, my_contribution / job.getTotalBasecost());
		
				if (details.is_winner){
					var performance_rewards = job.applyPerformanceRewards(this);
					apiLogAction('JOB_COMPLETE', 'pc='+this.tsid, 'job_id='+details.job_id, 'phase='+details.class_id, 'xp='+intval(actual_rewards.xp), 'mood='+intval(actual_rewards.mood), 'energy='+intval(actual_rewards.energy), 'currants='+intval(actual_rewards.currants), 'xp_perf='+intval(performance_rewards.xp), 'mood_perf='+intval(performance_rewards.mood), 'energy_perf='+intval(performance_rewards.energy), 'currants_perf='+intval(performance_rewards.currants));
				}
				else{
					var performance_rewards = {};
					apiLogAction('JOB_COMPLETE', 'pc='+this.tsid, 'job_id='+details.job_id, 'phase='+details.class_id, 'xp='+intval(actual_rewards.xp), 'mood='+intval(actual_rewards.mood), 'energy='+intval(actual_rewards.energy), 'currants='+intval(actual_rewards.currants));
				}
			
				this.jobs_mark_complete(details.job_location, details.job_id, details.class_id, actual_rewards, performance_rewards);
			}
		}
		
		return {
			job_id: details.job_id,
			class_id: details.class_id,
			job_location: details.job_location,
			done: true
		};
	}
	else{
		if (!job || !job.isDone()){
			return {
				args: {
					job_id: details.job_id,
					class_id: details.class_id,
					job_location: details.job_location
				},
				txt : "Nevermind!",
				done : true,
			};
		}
		
		var final_phase = job.isFinalPhase();
		
		var winning_option = job.getWinningOption();
		
		var contributions = job.getContributions();
		var my_contribution = contributions[this.tsid];
		
		if (!my_contribution){
			return {
				args: {
					job_id: details.job_id,
					class_id: details.class_id,
					job_location: details.job_location
				},
				txt : "Nevermind!",
				done : true,
			};
		}
		
		
		var rewards = job.getRewards(my_contribution / job.getTotalBasecost());
		
		var completion_text = job.expandText('Yay! The {job_phase} phase — {job_phase_label} — of the project <b>'+job.getTitle()+'<\/b> has been completed!', this);
		
		return {
			txt: completion_text,
			args: {
				job_id: details.job_id,
				class_id: details.class_id,
				job_location: details.job_location,
				job_complete_convo: true,
				rewards: rewards.rewards,
				performance_rewards: details.is_winner ? rewards.performance_rewards : {},
				performance_txt: details.is_winner ? job.getPerformanceText(this) : '',
				participation_txt: my_contribution ? job.getParticipationText(this) : '',
				winning_option: winning_option,
				show_teleport: false,
				is_phase: final_phase ? false : true
			},
			
			choices: {
				1: {
					txt	: 'OK',
					value	: 'job-complete'
				}
			}
		};
	}
}

function jobs_familiar_job_complete(job_location, job_id, multiplier){

	this.jobs_familiar_job_complete_cancel(job_location, job_id);

	if (this.is_dead) return;
    this.familiar_send_alert_delayed({
		'callback'	: 'jobs_familiar_job_complete_do',
		'job_location'	: job_location,
		'job_id'	: job_id,
		'multiplier': multiplier
    }, 2);
}

function jobs_familiar_job_complete_cancel(job_location, job_id){

	// remove any turnin alert about this job from the queue

	var alerts = this.familiar_find_alerts('jobs_familiar_job_complete_do');

	for (var i in alerts){
		if (alerts[i].job_id == job_id && alerts[i].job_location == job_location){

			this.familiar_remove_alert(i);
		}
	}
}

function jobs_familiar_job_complete_do(choice, details){
	
	var job_location = apiFindObject(details.job_location);
	var job = job_location.jobs_get(details.job_id);
			
	if (!job || !job.isDone()){
		return {
			args: {
				job_id: details.job_id,
				job_location: details.job_location
			},
			txt : "Nevermind!",
			done : true
		};
	}


	//
	// Give them a teleportation script
	//

	if (job.type != 5){
		var s = apiNewItemStackFromFamiliar('teleportation_script_imbued', 1);
		if (s){
			var primary = job.getPrimaryLocation();
			if (primary){
				var loc_info = primary.get_info();

				var targets = primary.geo_links_get_incoming();
				var choice = choose_one(array_keys(targets));
				if (choice){
					var destination = {
						tsid: primary.tsid,
						x: targets[choice].x,
						y: targets[choice].y,
						name: loc_info.name,
						mote_name: loc_info.mote_name
					};

					s.setTarget(destination, true);

					var remaining = this.addItemStack(s);
					
					if (remaining){
						// Anything remaining from the familiar we automatically place in rewards overflow storage
						this.rewards_store(s);
					}
				}
				else{
					s.apiDelete();
				}
			}
			else{
				s.apiDelete();
			}
		}
	}


	//
	// Tell them what they've won!
	//
	
	var completion_text;

	if (job.type == 5){
		var contributions = job.getContributions();
		var my_contribution = contributions[this.tsid];
		
		if (!my_contribution || !job_location.getProp('owner')){
			return {
				args: {
					job_id: details.job_id,
					class_id: details.class_id,
					job_location: details.job_location
				},
				txt : "Nevermind!",
				done : true
			};
		}
		
		var multiplier = 1.0;
		if (details.multiplier) multiplier = details.multiplier;
		log.info(this+' multiplier: '+multiplier);
		var rewards = job.onComplete(this, my_contribution / job.getTotalBasecost() * multiplier);

		var location_name;
		if (job_location.getProp('owner') && job_location.getProp('owner').tsid == this.tsid){
			if (job_location.getProp('is_public')){
				location_name = "on your home street";
			}
			else{
				location_name = "in your yard";
			}
		}
		else{
			if (job_location.getProp('is_public')){
				location_name = "on "+utils.escape(job_location.owner.label)+"'s home street";
			}
			else{
				location_name = "in "+utils.escape(job_location.owner.label)+"'s yard";
			}
			
			if ((my_contribution / job.getTotalBasecost()) > .5) { 
				this.achievements_grant("philanthropic_member_of_the_social_construct");
			}
		}

		var job_txt = '';
		if (job.class_id == 'job_cult_tower'){
			job_txt = job.expandText("The <b>"+job.getTitle()+"<\/b> project "+location_name+" has completed. ", this);
		}
		else{
			job_txt = job.expandText("The <b>"+job.getTitle()+"<\/b> restoration project "+location_name+" has completed. ", this);
		}

		if (rewards && rewards.xp){
			job_txt += job.expandText("Since you contributed, you got "+Math.round(rewards.xp)+" imagination.", this);
		}

		apiLogAction('JOB_COMPLETE', 'pc='+this.tsid, 'job_id='+details.job_id, 'class_id='+job.class_id, 'location='+details.job_location, 'xp='+intval(rewards.xp), 'mood='+intval(rewards.mood), 'energy='+intval(rewards.energy), 'currants='+intval(rewards.currants));

		this.sendActivity(job_txt, null, true);
		completion_text = job_txt;
	}
	else{
		completion_text = job.expandText('Hooray! The project <b>'+job.getTitle()+'<\/b> has been completed!', this);

		completion_text += "<br><br><b>Your Contributions<\/b><br>";
		var phases = job.getAllPhases();
		for (var i in phases){
			var phase_contributions = phases[i].instance.getContributions();
			var my_phase_contribution = phase_contributions[this.tsid];
			
			completion_text += phases[i].in_order+'. '+phases[i].label+": ";
			if (my_phase_contribution){
				completion_text += phases[i].instance.expandText("You contributed {job_participation}% of the work!<br>", this);
			}
			else{
				completion_text += "You did not contribute.<br>";
			}
		}

		completion_text += "<br>You've been given a Teleportation Script to take you to the new street.<br>";
	}
	
	return {
		txt: completion_text,
		args: {
			job_id: details.job_id,
			job_location: details.job_location,
			job_complete_convo: true,
			show_teleport: false,
			teleport_txt: '',
			is_phase: false
		},
		done : true
	};
}