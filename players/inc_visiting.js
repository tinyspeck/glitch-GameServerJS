function visiting_can_opt_in(){

	if (this.stats.level < 4){
		return {
			ok: 0,
			error: 'low_level',
		};
	}

	if (!this.home || !this.home.exterior){
		return {
			ok: 0,
			error: 'no_home',
		};
	}

	var jobs = this.home.exterior.cultivation_count_all_items();

	if (jobs < 3){
		return {
			ok: 0,
			error: 'no_cultivation',
			jobs: jobs,
		};
	}

	if (!this.has_butler()){
		return {
			ok: 0,
			error: 'no_butler',
		};
	}

	return {
		ok: 1,
	};
}

function visiting_opt_in_done(){
	this.home_allow_visits = true;
	this.sendActivity("You've been opted in - you will recieve random visitors to your street.");
}

function visiting_opt_out_done(){
	delete this.home_allow_visits;
	this.sendActivity("You've been opted out - you will no longer receive random visitors to your street.");
}

function visiting_opt_in(){

	if (this.home_allow_visits){
		return {
			ok: 1,
		};
	}

	var ret = this.visiting_can_opt_in();
	if (!ret.ok) return ret;

	utils.http_post('callbacks/player_random_visits.php', {
		'player' : this.tsid,
		'opt_in' : 1,
	});

	return {
		ok: 1,
		async: 1,
	};
}

function visiting_opt_out(){

	if (!this.home_allow_visits){
		return {
			ok: 1,
		};
	}

	utils.http_post('callbacks/player_random_visits.php', {
		'player' : this.tsid,
	});

	return {
		ok: 1,
		async: 1,
	};
}

function visiting_visit_random(){

	utils.http_post('callbacks/player_random_go.php', {
		'player' : this.tsid,
	});
}

function visiting_visit_random_go(){

	var tsids = [];
	for (var i=0; i < arguments.length; i++){
		tsids.push(arguments[i]);
	}

	if (config.is_dev){
		this.sendActivity("(DEBUG) Targets: "+tsids.join(','));
	}

	var errors = [];

	for (var i=0; i < tsids.length; i++){

		if (tsids[i] == this.tsid){

			errors.push('self');
		}else{
			var ret = this.houses_visit(tsids[i]);
			if (ret.ok){
				this.achievements_increment('visit_random', tsids[i], 1);
				return;
			}
			errors.push(ret.error);
		}
	}

	if (config.is_dev){
		this.sendActivity("(DEBUG) Failed all targets: "+errors.join(', '));
	}

	this.sendActivity("Hmm, something went wrong :(");
}
