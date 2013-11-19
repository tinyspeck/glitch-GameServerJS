// http://wiki.tinyspeck.com/wiki/Feats

function doCreate(class_tsid, game_day, goal, goal_multiplier, stretch_goal1, stretch_goal2){
	this.is_complete = false;
	this.counter = 0; // Use apiNewProperty instead?
	this.game_day = game_day;
	this.feat_class_tsid = class_tsid;
	this.goal = intval(goal);
	this.goal_multiplier = intval(goal_multiplier);
	if (!this.goal_multiplier) this.goal_multiplier = 1;
	this.stretch_goal1 = intval(stretch_goal1);
	this.stretch_goal2 = intval(stretch_goal2);
}

function update(game_day, goal, goal_multiplier, stretch_goal1, stretch_goal2){
	this.game_day = game_day;
	this.goal = intval(goal);
	this.goal_multiplier = intval(goal_multiplier);
	if (!this.goal_multiplier) this.goal_multiplier = 1;
	this.stretch_goal1 = intval(stretch_goal1);
	this.stretch_goal2 = intval(stretch_goal2);
}

function increment(pc, amount){
	// If we're done, exit early
	//if (this.is_complete) return 0;

	// Sanity check the amount
	//amount = Math.min(amount, (this.goal * this.goal_multiplier)-this.counter);
	//if (amount <= 0) return 0;

	// Increment
	this.counter += amount;

	// Check completion
	var was_complete = this.is_complete;
	if (this.counter >= this.stretch_goal2 * this.goal_multiplier){
		this.is_complete = true;
	}

	// Schedule callback
	if (!was_complete && this.is_complete){
		this.apiCancelTimer('do_callback');
		this.do_callback();
	}
	else{
		if (!this.callback_queue) this.callback_queue = [];
		this.callback_queue.push({
			tsid: pc.tsid,
			amount: amount,
			ts: time()
		});
		this.apiSetTimer('do_callback', 60*1000);
	}

	// Action log
	apiLogAction('FEAT_INCREMENT', 'pc='+pc.tsid, 'feat='+this.feat_class_tsid, 'game_day='+this.game_day, 'amount='+amount, 'goal='+this.goal, 'goal_multiplier='+this.goal_multiplier, 'is_complete='+this.is_complete);

	// Return how much we did
	return amount;
}

function is_complete(){
	return this.is_complete ? true : false;
}

function get_status(){
	var status = {
		class_tsid: this.feat_class_tsid,
		game_day: this.game_day,
		is_complete: this.is_complete,
		goal: this.goal,
		value: this.counter/this.goal_multiplier,
		stretch_goal1: this.stretch_goal1,
		stretch_goal2: this.stretch_goal2
	};

	return status;
}

function do_callback(){
	var queue = utils.copy_hash(this.callback_queue);
	delete this.callback_queue;

	var args = {
		class_tsid: this.feat_class_tsid,
		game_day: this.game_day,
		is_complete: this.is_complete ? 1 : 0,
		counter: this.counter,
		batch_id: time()
	};

	var idx = 0;
	for (var i in queue){
		var key = 'contribution['+idx+']';
		var l_args = queue[i];
		for (var k in l_args){
			args[key+'['+k+']'] = l_args[k];
		}

		idx++;
	}

	utils.http_post('callbacks/feat_update.php', args, this.tsid);
}

function reset(){
	this.is_complete = false;
	this.counter = 0;
	this.callback_queue = [];
}