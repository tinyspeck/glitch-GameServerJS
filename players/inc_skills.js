function skills_init(){
	var skills = this.skills;
	if (skills === undefined || skills === null){
		//log.info('*******************************************SKILLS-INIT');

		if (this.stats && this.stats.level > 1){
			log.error(this+' WARNING: Recreating skills container with level = '+this.stats.level);
			log.error(this+' WARNING: Existing skills ref = '+skills);
			if (this.skills){
				log.error(this+' WARNING: skills actually exist = '+this.skills+' vs '+skills);
			}
			else{
				log.error(this+' WARNING: Skills DC is definitely missing = '+this.skills+' vs '+skills);
			}

			log.printStackTrace();
		}

		this.skills = apiNewOwnedDC(this);
		this.skills.label = 'Skills';
		this.skills.skills = {};
	}
	
	if (!this.skills.queue){
		this.skills.queue = {};
	}
	
	if (!this.skills.unlearningQueue){
		this.skills.unlearningQueue = {};
	}

	if (!this.skills.capacity) this.skills.capacity = 20;

	// Check skills you are learning, and remove the ones that don't exist anymore
	for (var i in this.skills.queue){
		var s = config.data_skills[i];
		if (!s) delete this.skills.queue[i];
	}

	for (var i in this.skills.unlearningQueue){
		var s = config.data_skills[i];
		if (!s) delete this.skills.unlearningQueue[i];
	}
}

function skills_delete(){
	log.info(this+' *******************************************SKILLS-DELETE');
	if (this.skills){
		this.skills.apiDelete();
		delete this.skills;
	}
}

function skills_reset(){
	log.info(this+' *******************************************SKILLS-RESET');
	this.skills_init();
	this.skills.skills = {};
	this.skills.queue = {};
	this.skills.unlearningQueue = {};
}

function skills_get_list(){

	this.skills_init();

	var out = [];

	for (var i in this.skills.skills){

		var skill = this.skills.skills[i];

		out.push({
			'id'    : i,
			'when'  : skill,
		});
	}

	return out;
}

function skillsGetLatest(){
	this.skills_init();

	var skill = this.skills.skills.__latestKeyValue;

	return {
		id : skill.key,
		when: skill.value
	};
}

function skills_learn_missing_recipes(){
	this.skills_init();
	
	for (var i in this.skills.skills){

		this.skills_auto_learn_recipes(i, false);
	}
}

function skills_auto_learn_recipes(skill_id, tell_client){

	if (typeof(tell_client) == 'undefined'){
		tell_client = false;
	}

	// valid skill?
	var data = this.skills_get(skill_id);
	if (!data) return;

	var updates = [];

	// loop over recipes
	var book = apiFindItemPrototype('catalog_recipes');
	for (var i in book.recipes){

		var r = book.recipes[i];


		var has_all_skills = true;
		if (in_array_real(skill_id, r.skills)){
			for (var j in r.skills){
				var s = r.skills[j];

				if (!this.skills_has(s) || !this.skills_get_name(s)) has_all_skills = false;
			}
		}
		else{
			has_all_skills = false;
		}

		if (has_all_skills){

			this.making_try_learn_recipe(i);

			var recipe = get_recipe(i);

			for (var o in recipe.outputs){
				updates.push(recipe.outputs[o][0]);
			}
		}
	}

	//
	// inform the client of auto-learned recipes, so it can update cache
	//
	// This is optional, since we also call this function in pc.onLoggedin()
	// to catch any new recipes that we've made recently.
	//

	if (tell_client){
		var msg = this.making_recipe_request({class_tsids: updates});
		msg.type = 'recipe_request';
		this.sendMsgOnline(msg);
	}
}


function skills_has(id){

	this.skills_init();

	return this.skills.skills[id] ? 1 : 0;
}

function skills_get_all(is_admin){

	this.skills_init();

	var out = {};
	

	//
	// loop over each skill
	//

	var queue = this.skills_get_queue();
	for (var i in config.data_skills){

		var s = config.data_skills[i];
		if (s.is_secret && !is_admin) continue;

		out[i] = {
			'got'		: 0,
			'reqs'		: [],
			'post_reqs'	: [],
		};

		if (this.skills.skills[i]){

			out[i].got = 1;
			
			if (this.skills_can_unlearn(i)) {
				out[i].unlearnable = 1;
				
				var quest = this.quests_get_quest_for_unlearnt_skill(i);
				if (quest) {
					var qInst = this.getQuestInstance(quest);
					
					out[i].unlearn_quest_removal = quest;
					
					if (qInst) {
						out[i].unlearn_quest_fullname = qInst.title;
					} 
					else {
						//log.info(this+" unlearnable skill with quest "+quest+" but no instance");
						out[i].unlearn_quest_fullname = 0;
					}
				}
				else {
					out[i].unlearn_quest_removal = 0;
					out[i].unlearn_quest_fullname = 0;
				}
			}
			else { 
				out[i].unlearnable = 0;
			}
			
			out[i].unlearn_time = this.skills_unlearning_time(s.point_cost);
			//log.info(this+" unlearn skills_get_all learned skill "+i+" point cost "+s.point_cost+" time "+out[i].unlearn_time);
			out[i].partially_learned = 0;
			out[i].when = this.skills.skills[i];
		}
		else if (this.skills_can_unlearn(i)) {
			out[i].unlearnable = 1;
			out[i].unlearn_quest_removal = 0;
			out[i].unlearn_quest_fullname = 0;
			out[i].partially_learned = 1;
			
			var points = s.point_cost;
			
			var queue = this.skills_get_queue();
			if (queue[i] && !queue[i].is_paused) {
				//log.info(this+" unlearning skills_get_all current skill "+i);
				var points = points - this.skills_seconds_to_points(queue[i].end - time(), s.category_id);
			}
			else if (queue[i]) {
				//log.info(this+" unlearning skills_get_all paused skill " +i);
				points = points - queue[i].points_remaining;
			}
			else {
				log.info(this+" unlearning skills_get_all should not get here "+i);
			}
			
			out[i].unlearn_time = this.skills_unlearning_time(points);
			//log.info(this+"Unlearning time: "+out[i].unlearn_time+" for "+i+" points: "+points);
		}


		out[i].level = s.requires_level;
		
		//
		// List the giants, primary first
		//
		
		var giants = [];
		for (var g in s.giants){
			if (s.giants[g].primary == 1){
				giants.push({name: g, primary: s.giants[g].primary});
			}
		}
		for (var g in s.giants){
			if (s.giants[g].primary == 0){
				giants.push({name: g, primary: s.giants[g].primary});
			}
		}
		
		out[i].giants = giants;
		
		//
		// How much time will it take me to learn this skill?
		//
		out[i].total_time = this.skills_points_to_seconds(s.point_cost, s.category_id);
	}


	//
	// calculate requirements
	//

	for (var i in out){

		var s = config.data_skills[i];
		
		//
		// level requirement?
		//
		
		if (out[i].level){
			out[i].reqs.push({
				'type'	: 'level',
				'ok'	: this.stats.level >= out[i].level ? 1 : 0,
				'need'	: out[i].level,
				'got'	: this.stats.level,
			});
		}
		

		//
		// do we have a required skill?
		//

		for (var j in s.req_skills){

			var rs_id = s.req_skills[j];


			//
			// simple binaries and child skills just need to be known
			//

			out[i].reqs.push({
				'type'	: 'skill',
				'ok'	: this.skills_has(rs_id) ? 1 : 0,
				'skill'	: rs_id,
			});
		}


		//
		// do we have a required achievement?
		//

		for (var j in s.req_achievements){

			var rs_id = s.req_achievements[j];


			//
			// simple binaries and child skills just need to be known
			//

			out[i].reqs.push({
				'type'	: 'achievement',
				'ok'	: this.achievements_has(rs_id) ? 1 : 0,
				'achievement'	: rs_id,
			});
		}


		//
		// do we have a required quest?
		//

		for (var j in s.req_quests){

			var rs_id = s.req_quests[j];


			//
			// have we completed the quest?
			//

			out[i].reqs.push({
				'type'	: 'quest',
				'ok'	: this.getQuestStatus(rs_id) == 'done' ? 1 : 0,
				'quest'	: rs_id,
			});
		}


		//
		// do we have a required upgrade?
		//

		for (var j in s.req_upgrades){

			var rs_id = s.req_upgrades[j];


			//
			// do we have the upgrade?
			//

			out[i].reqs.push({
				'type'	: 'upgrade',
				'ok'	: this.imagination_has_upgrade(rs_id) ? 1 : 0,
				'upgrade'	: rs_id,
			});
		}


		//
		// ok - do we meet all the requirements?
		//

		var ok = 1;

		for (var j=0; j<out[i].reqs.length; j++){

			if (!out[i].reqs[j].ok){
				ok = 0;
			}
		}
		
		//
		// If it's in the queue, and active, we can't learn it
		//

		if (queue[i]){
			if (!queue[i].is_paused){
				ok = 0;
			}
			
			out[i].queue = queue[i];
			out[i].queue.time_remaining = this.skills_points_to_seconds(queue[i].points_remaining, s.category_id);
		}
		
		//
		// If we haven't finished the intro, we can't learn anything
		//
		
		if (config.force_intro && !this.has_done_intro) ok = 0;

		out[i].can_learn = ok;
		
		for (var ps in s.post_skills){
			var rs_id = s.post_skills[ps];
			
			out[i].post_reqs.push({
				'type'	: 'skill',
				'ok'	: this.skills_has(rs_id) ? 1 : 0,
				'skill'	: rs_id,
			});
		}
	}
	

	return out;
}

//
// Check whether a specific skill can be unlearned. Returns false if the player has other skills that
// require this one.
//
function skills_can_unlearn(id){

	var can_unlearn = true;
	
	if (this.skills_has(id)){
		var dependent_skills = config.data_skills[id].post_skills;
		if (dependent_skills){ // check skills that require this one
			for (var i in dependent_skills){
				if (this.skills_has(dependent_skills[i]) || this.skills_in_learning_queue(dependent_skills[i])){
					can_unlearn = false;
				}
			}
		}
	}
	else if (this.skills_in_learning_queue(id)){
		can_unlearn = true;
		
		// Check for dependent skills just in case. (Brendan had a case where Soil Appreciation 2 and 3
		// were both in his learning queue, but I think it may be due to adding/removing stuff through the
		// god tool.)
		var dependent_skills = config.data_skills[id].post_skills;
		if (dependent_skills){
			for (var i in dependent_skills){
				if (this.skills_has(dependent_skills[i]) || this.skills_in_learning_queue(dependent_skills[i])) {
					can_unlearn = false;
				}
			}
		}
	}
	else {
		can_unlearn = false;
	}
	
	return can_unlearn;
}

//
// Get a list of skills that can be unlearned
//
function skills_unlearnable_list() {
	this.skills_init();
	
	var out = {};
	
	for (var id in config.data_skills){
		if (this.skills_can_unlearn(id)) {
			out[id] = skills_get_name(id);
		}
	}

	return out;
}

function skills_remove(id){
	apiLogAction('SKILLS_REMOVE', 'pc='+this.tsid, 'skill='+id);

	//log.info(this+" Unlearning: removing skill "+id);
	
	this.skills_init();

	// Special case for removing things that are in the learning queue.
	if (this.skills_in_learning_queue(id)) {
	
		delete this.skills.queue[id];
	}
	else {
	
		//
		// remove simple ref
		//

		delete this.skills.skills[id];


		//
		// remove any recipes that use this skill
		//


		var book = apiFindItemPrototype('catalog_recipes');
		for (var i in book.recipes){

			var r = book.recipes[i];

			if (r.skill == id || in_array_real(id, r.skills)){

				this.making_unlearn_recipe(i);
			}
		}


		//
		// remove quests related to this skill
		//

		this.quests_unlearnt_skill(id);
	}
}

function skills_get(id){
	return config.data_skills[id];
}

function skills_get_count(){
	return this.skills_get_list().length;
}

function skills_get_name(id){
	if (!config.data_skills[id]) return '';

	var n = config.data_skills[id].name;
	if (config.data_skills[id].level) n += ' '+utils.to_roman_numerals(config.data_skills[id].level);
	return n;
}

function skills_linkify(id){
	if (!config.data_skills[id]) return '';

	var n = config.data_skills[id].name;
	if (config.data_skills[id].level) n += ' '+utils.to_roman_numerals(config.data_skills[id].level);
	return '<a href="event:skill|'+id+'">'+n+'</a>';
}

//
// Compute the duration for unlearning the skill. This is the base duration, unaffected by Better Learning skills.
// It is, however, reduced for Unlearning upgrades.
//
function skills_unlearning_time(point_cost) {

	var duration = point_cost / this.config.skill_points_per_second;

	if (duration <= 0) duration = 0;

	duration = Math.round(duration);
	
	if (this.imagination_has_upgrade("unlearning_time_2")){
		duration *= 0.5;
	}
	else if (this.imagination_has_upgrade("unlearning_time_1")){
		duration *= 0.75;
	}
	
	return duration;
}

//
// Start unlearning a skill. This is only possible if we have the skill, and it's not a pre-req for something else we have.
//
function skills_unlearn(id) {
	if (!this.skills.unlearningQueue){
		this.skills.unlearningQueue = {};
	}

	if (!this.imagination_has_upgrade("unlearning_ability")) { this.sendActivity("You don't know how to unlearn"); return api_error("You don't know how to unlearn."); }
	
	var skill = config.data_skills[id];
	if (!skill) { this.sendActivity("bad skill"); return api_error('Invalid skill: '+id); }
	
	if (!this.skills_has(id) && !this.skills_in_learning_queue(id)) { /*log.info("don't have skill");*/ return api_error("You don't have skill "+id+"."); }
	if (!this.skills_can_unlearn(id)) { /*log.info("skill needed for other skills");*/ return api_error("You can't unlearn a skill that is required for your other skills."); }
	
	if (this.skills_get_unlearning_queue_length() > 0){
		var skill_name = this.skills_get_name(id);
		log.info(this+" Can't unlearn "+skill_name+", already unlearning");
		return { busyUnlearning: 1, unlearn: 1, id: id, fullname: skill_name } ;
	}

	//
	// Go through the learning queue and pause anything that is currently in progress.
	//
	var partial_skill = false;
	var queue = this.skills_get_queue();
	if (num_keys(queue)){
		this.apiCancelTimer('skills_complete_training');
		
		for (var i in queue){
			
			if (!queue[i].is_paused){
				// pause it
				this.skills.queue[i].is_paused = 1;
				this.skills.queue[i].paused = time();
				this.skills.queue[i].points_remaining = this.skills_seconds_to_points(this.skills.queue[i].end - time(), config.data_skills[i].category_id);
				
				var out = {
					type: 'skill_train_pause',
					tsid: i,
					name: this.skills_get_name(i),
					desc: config.data_skills[i].description,
					time_remaining: this.skills_points_to_seconds(this.skills.queue[i].points_remaining, config.data_skills[i].category_id),
					total_time: this.skills_points_to_seconds(config.data_skills[i].point_cost, config.data_skills[i].category_id)
				};

				this.sendMsgOnline(out);
				
				if (i != id) {
					this.sendActivity('You paused learning '+out.name+'.', null, true);
				}
				else {
					//log.info(this+" Unlearning current in progress skill "+id);
					partial_skill = true;
					var points = skill.point_cost -this.skills.queue[i].points_remaining;
				}
				
				// perform web callback for additional processing
				var args = {
					player	: this.tsid,
					skill_id: i,
					action	: 'pause'
				};

				utils.http_get('callbacks/skill.php', args);
			}
			else if (i == id) {
				//log.info(this+" Unlearning partial skill "+id);
				partial_skill = true;
				var points = skill.point_cost - this.skills.queue[i].points_remaining;
			}
		}
	}

	
	//
	// Add it to the queue
	//
	if (!this.skills.unlearningQueue[id]) { // if it's already there, then just silently succeed
		
		if (!points && partial_skill){
			if (!this.skills.queue[id]){
				log.info(this+" unlearning problem - partial skill not in skills queue ?? ");
				var points = skill.point_cost;
			}
			else {
				var points = skill.point-cost - this.skills.queue[id].points_remaining;
			}
		}
		else if (!points){
			var points = skill.point_cost;
		}
	
		var duration = this.skills_unlearning_time(points);
		//log.info(this+"Unlearning time: "+duration+" for "+id+" points: "+points);
		
		if (this.skills_has(id)){
			var quest = this.quests_get_quest_for_unlearnt_skill(id);
			if (quest) {
				var quest_removal = quest;
				
				log.info(this+" user gets warning about quest removal for "+skill_name);
			}
			else{
				var quest_removal = 0;
			}
		}
		else {
			var quest_removal = 0;
		}
			
		this.skills.unlearningQueue[id] = {
			start: time(),
			end: time() + duration,
			unlearn_quest_removal: quest_removal
		};
		
		var out = {
			type: 'skill_unlearn_start',
			tsid: id,
			name: this.skills_get_name(id),
			desc: skill.description,
			time_remaining: duration,
			total_time: duration
		};

		this.sendMsgOnline(out);
		this.sendActivity('You started unlearning '+out.name+'.', null, true);
		
		this.sendMsgOnline({
			type: 'familiar_state_change',
			accelerated: false
		});
		
		//this.sendActivity("Will take "+(duration/60)+" minutes");
	}
	
	this.apiSetTimer('skills_complete_unlearning', duration * 1000);
	//log.info(this+" Calling skills_complete_unlearning in "+duration+" seconds");
	
	return {
		ok: 1,
		queue: this.skills.unlearningQueue[id]
	};
}

function skillsGetCount(){
	return this.skills.skills.__length;
}

function skills_train(id){
	if (!this.skills.unlearningQueue){
		this.skills.unlearningQueue = {};
	}
	
	var skill = config.data_skills[id];
	if (!skill) return api_error('Invalid skill: '+id);
	
	if (this.skills_get_unlearning_queue_length() > 0){
		var skill_name = this.skills_get_name(id);
		log.info(this+" Can't learn "+skill_name+", already unlearning");
		return { busyUnlearning: 1, learn: 1, id: id, fullname: skill_name } ;
	}
	
	apiLogAction('SKILLS_TRAIN', 'pc='+this.tsid, 'skill='+id);

	//
	// Have the pre-reqs?
	//
	
	var skills = this.skills_get_all();

	if (!skills[id].can_learn){
		log.error(this+" doesn't meet requirements: "+id);
		return api_error("Doesn't meet requirements");
	}

	if (config.force_intro && !this.has_done_intro) return api_error('You cannot learn anything yet.');
	
	
	//
	// What's in the queue?
	//
	
	var queue = this.skills_get_queue();
	if (num_keys(queue)){
		this.apiCancelTimer('skills_complete_training');
		
		for (var i in queue){
			//
			// Is this the skill we're trying to learn?
			//
		
			if (i != id && !queue[i].is_paused){
				
				// pause it
				this.skills.queue[i].is_paused = 1;
				this.skills.queue[i].paused = time();
				this.skills.queue[i].points_remaining = this.skills_seconds_to_points(this.skills.queue[i].end - time(), config.data_skills[i].category_id);
				
				var out = {
					type: 'skill_train_pause',
					tsid: i,
					name: this.skills_get_name(i),
					desc: config.data_skills[i].description,
					time_remaining: this.skills_points_to_seconds(this.skills.queue[i].points_remaining, config.data_skills[i].category_id),
					total_time: this.skills_points_to_seconds(config.data_skills[i].point_cost, config.data_skills[i].category_id)
				};

				this.sendMsgOnline(out);
				this.sendActivity('You paused learning '+out.name+'.', null, true);
				
				
				// perform web callback for additional processing
				var args = {
					player	: this.tsid,
					skill_id: i,
					action	: 'pause'
				};

				utils.http_get('callbacks/skill.php', args);

			apiLogAction('SKILLS_PAUSE', 'pc='+this.tsid, 'skill='+i);
			}
		}
	}
		
	
	//
	// Add it to the queue
	//
	
	var resumed = 0;
	if (queue[id]){
		// continue it
		var duration = this.skills_points_to_seconds(Math.min(skill.point_cost, queue[id].points_remaining), skill.category_id);
		resumed = 1;
	}
	else{
		var duration = this.skills_points_to_seconds(skill.point_cost, skill.category_id);
	}
	
	if (resumed == 1 && queue[id].is_accelerated){
		this.skills.queue[id] = {
			start: time(),
			end: time() + duration,
			acceleration_end: time() + duration,
			is_accelerated: true
		};
	}
	else{
		this.skills.queue[id] = {
			start: time(),
			end: time() + duration
		};
	}
	
	this.apiSetTimer('skills_complete_training', duration * 1000);
	
	if (resumed){
		log.info(this+' skills_complete_training resuming '+id+' with duration '+duration+', end is '+(time() + duration));
				
		var out = {
			type: 'skill_train_resume',
			tsid: id,
			name: this.skills_get_name(id),
			desc: skill.description,
			time_remaining: duration,
			total_time: this.skills_points_to_seconds(skill.point_cost, skill.category_id)
		};

		this.sendMsgOnline(out);

		this.sendActivity('You resumed learning '+out.name+'.', null, true);
		
		
		// perform web callback for additional processing
		var args = {
			player	: this.tsid,
			skill_id: id,
			action	: 'resume'
		};

		utils.http_get('callbacks/skill.php', args);
	}
	else{
		log.info('Starting skill training for '+id+' with duration '+duration+', end is '+(time() + duration));
		
		var out = {
			type: 'skill_train_start',
			tsid: id,
			name: this.skills_get_name(id),
			desc: skill.description,
			time_remaining: duration,
			total_time: this.skills_points_to_seconds(skill.point_cost, skill.category_id)
		};

		this.sendMsgOnline(out);
		this.sendActivity('You started learning '+out.name+'.', null, true);
		
		
		// perform web callback for additional processing
		var args = {
			player	: this.tsid,
			skill_id: id,
			action	: 'start'
		};

		utils.http_get('callbacks/skill.php', args);
	}
	
	this.quests_set_flag('learn_skill');
	
	//
	// make sure the client is showing the right anim (during skill switches, etc)
	//
	
	if (this.skills.queue[id].is_accelerated){
		this.sendMsgOnline({
			type: 'familiar_state_change',
			accelerated: true
		});
	} else {
		this.sendMsgOnline({
			type: 'familiar_state_change',
			accelerated: false
		});
	}

	if (this.vog_skill_learning){
		delete this.vog_skill_learning;

		this.apiSetTimerX('announce_vog_fade', 2000, "Skill learning will continue while you do other things. It even goes on when you're not playing the game.//When you're ready, you can close the skill picker and continue playing.", {no_locking: true, duration: 3000, css_class:'nuxp_medium', fade_alpha:0.7, y:'62%'})
	}
	
	return {
		ok: 1,
		queue: this.skills.queue[id],
	};
}

// How much acceleration can we apply?
function skills_get_max_acceleration(){
	var skill = this.skills_get_learning();
	if (skill){
		var queue = skill.queue;
		
		// Already at maximum acceleration?
		if (this.skills_at_max_acceleration()) return 0;
		
		// Are we already accelerated?
		if (queue.is_accelerated){
			var remaining = queue.end - queue.acceleration_end;
		}
		else{
			var remaining = queue.end - time();
		}
		return Math.round(remaining / 2);
	}
	
	return 0;
}

function skills_at_max_acceleration(){
	var skill = this.skills_get_learning();
	if (skill){
		var queue = skill.queue;
		
		// Already at maximum acceleration?
		if (queue.is_accelerated && queue.acceleration_end >= queue.end) return true;
	}
	
	return false;
}

function skills_start_acceleration(acceleration_duration, ignore_max){
	var skill = this.skills_get_learning();
	if (skill){
		var queue = this.skills_get_queue()[skill.id];
		if (!queue) return false;
		
		var max_acceleration = this.skills_get_max_acceleration();
		
		if (ignore_max) {
			var remaining = queue.end - time();
			if (acceleration_duration > remaining) { 
				acceleration_duration = remaining;
			}
		}
		else if (acceleration_duration > max_acceleration) {
			acceleration_duration = max_acceleration;
		}

		// If we're not currently accelerated, set everything up, otherwise skills_reschedule_queue() handles it for us
		var was_accelerated = queue.is_accelerated;

		this.skills_reschedule_queue(acceleration_duration * -1);

		if (!was_accelerated){
			queue.is_accelerated = true;
			queue.acceleration_end = time() + acceleration_duration;
			this.apiSetTimer('skills_stop_acceleration', acceleration_duration * 1000);
		}
		else{		
			
			//
			// Tell the client
			//
			
			this.sendMsgOnline({
				type: 'familiar_state_change',
				accelerated: true
			});
		}
		
		return true;
	}
	
	return false;
}

function skills_stop_acceleration(){
	//
	// Tell the client
	//
	
	this.sendMsgOnline({
		type: 'familiar_state_change',
		accelerated: false
	});
	
	this.apiCancelTimer('skills_stop_acceleration');
	
	var skill = this.skills_get_learning();
	if (skill){
		var queue = this.skills_get_queue();
		if (!queue[skill.id]) return false;
		
		queue[skill.id].is_accelerated = false;
		
		return true;
	}
	
	return false;
}

function skills_is_accelerated(){
	var skill = this.skills_get_learning();
	if (skill){
		
		return skill.queue.is_accelerated ? true : false;
	}
	
	return false;
}

function skills_reschedule_queue(time_change){
	//
	// Reschedule any currently training skills in the queue by adding or subtracting time
	//
	
	var queue = this.skills_get_queue();
	if (num_keys(queue)){		
		for (var i in queue){		
			if (!queue[i].is_paused){
				this.apiCancelTimer('skills_complete_training');

				var remaining = Math.max(this.skills.queue[i].end - time() + time_change, 0.1);
				var prior_end = this.skills.queue[i].end;
				this.skills.queue[i].end = time() + remaining;
				if (this.skills.queue[i].is_accelerated){
					this.apiCancelTimer('skills_stop_acceleration');
					var acceleration_duration = Math.max(this.skills.queue[i].acceleration_end - time() - time_change, 0.1);
					this.skills.queue[i].acceleration_end = time() + acceleration_duration;
					this.apiSetTimer('skills_stop_acceleration', acceleration_duration * 1000);
				}
				else{
					this.skills.queue[i].is_accelerated = true;
					
					//
					// Tell the client
					//

					this.sendMsgOnline({
						type: 'familiar_state_change',
						accelerated: true
					});
				}

				this.apiSetTimer('skills_complete_training', remaining * 1000);
				
				var skill = this.skills_get(i);
	
				var out = {
					type: 'skill_train_resume',
					tsid: i,
					name: this.skills_get_name(i),
					desc: skill.description,
					time_remaining: remaining,
					total_time: this.skills_points_to_seconds(skill.point_cost, skill.category_id)
				};

				this.sendMsgOnline(out);
				
				return remaining;
			}
		}
	}
	
	return 0;
}

function skills_points_to_seconds(points, category){
	var s = points / config.skill_points_per_second;
	
	if (s <= 0) return 0;

	//
	// If in new newxp, first skill takes 3s
	//

	if (this.location.is_newxp && this.skills_get_count() === 0) return 3;
	
	//
	// Apply brain capacity modifier
	//

	s *= this.skills_get_learning_time_modifier();
	
	// For upgrades:
	//log.info("IMG pts->secs category is "+category);
	if (this.category_reductions && this.category_reductions[category]) { 
		var reduction = this.category_reductions[category];
		//log.info("IMG Applying skill time reduction "+reduction+" for category "+category);
		s *= reduction;
	}
	
	return Math.round(s);
}

function skills_seconds_to_points(seconds, category){
	var p = seconds * config.skill_points_per_second;
	
	if (p <= 0) return 0;
	
	//
	// Apply brain capacity modifier
	//
		
	p /= this.skills_get_learning_time_modifier();
	
	// For upgrades
	//log.info("IMG secs->pts category is "+category);
	if (this.category_reductions && this.category_reductions[category]) { 
		var reduction = this.category_reductions[category];
		//log.info("IMG Applying skill time reduction "+reduction+" for category "+category);
		p /= reduction;
	}
	
	return p > 0 ? Math.round(p) : 0;
}

function skills_get_category_reduction(category){
	if (!this.category_reductions || !this.category_reductions[category]) return 1;

	return this.category_reductions[category];
}

function skills_cancel_unlearning(id) { 
	//log.info(this+' skills_cancel_unlearning');
	
	if (this.skills.unlearningQueue) {
		if (id) {
		
			if (this.skills.unlearningQueue) {
				var skill = this.skills.unlearningQueue[id];
				
				if (skill)
				{
					log.info(this+" Cancel unlearning of "+id);
					
					var out = {
						type: 'skill_unlearn_cancel',
						tsid: id,
						name: this.skills_get_name(id),
						desc: skill.description,
					};

					this.sendMsgOnline(out);
					this.sendActivity('You are no longer unlearning '+out.name+'.', null, true);
						
					delete this.skills.unlearningQueue;
				}
			}
			
			this.skills.unlearningQueue = {};
		}
		else {
				if (this.skills_get_unlearning_queue_length() > 0) {
					if (this.skills.unlearningQueue) {
					for (var id in this.skills.unlearningQueue) { // should be only 1
						var skill = this.skills.unlearningQueue[id];
						log.info(this+" Cancel unlearning of "+id);
						
						var out = {
							type: 'skill_unlearn_cancel',
							tsid: id,
							name: this.skills_get_name(id),
							desc: skill.description,
						};

						this.sendMsgOnline(out);
						this.sendActivity('You are no longer unlearning '+out.name+'.', null, true);
					}
					delete this.skills.unlearningQueue;
				}
				
				this.skills.unlearningQueue = {};
			}
			else {
				return api_error('Not unlearning!');
			}
		}
	}
	
	return {
		ok: 1,
	};
}

// 
// Finish unlearning a skill
// 
function skills_complete_unlearning() {
	//this.sendActivity("completing unlearning");
	if (!this.skills.unlearningQueue) { 
		this.skills.unlearningQueue = {};
	}
		
	var queue = this.skills.unlearningQueue;
	var next = 0;
	
	for (var id in queue) { 
		var skill = queue[id];
		
		//this.sendActivity("Checking time on "+id);
		if (skill.end <= time()){
			log.info(this+' skills_complete_unlearning '+id+' is complete');
			
			// MUST DO REMOVE NOTIFY before REMOVE to prevent duplicate notifications.
			this.skills_remove_notify(id);
			this.skills_remove(id);
			
			delete this.skills.unlearningQueue[id];
			
		}
		else  {
			next = skill.end - time();
		}
	}
		
	if (next){
		//this.sendActivity("Scheduling another check");
		if (next <= 0) next = 0.1;
		log.info(this+' skills_complete_unlearning exiting with next: '+next);
		this.apiSetTimer('skills_complete_unlearning', next * 1000);
		return;
	}
}

function skills_complete_training(){
		
	//
	// What's done?
	//
	
	var next = 0;
	var queue = this.skills_get_queue();
	for (var id in queue){
		var skill = queue[id];
		
		log.info(this+' skills_complete_training examining '+id+': '+skill.end+'-'+time()+'-'+skill.is_paused);
		
		if (skill.end <= time() && !skill.is_paused){
			log.info(this+' skills_complete_training '+id+' is complete');
			//
			// ding!
			//
			
			this.skills_give(id);
			
			//
			// Remove from queue
			//
			
			delete this.skills.queue[id];
			
			log.info(this+' skills_complete_training '+id+' is learned');
		}
		else if (!skill.is_paused){
			next = skill.end - time();
		}
	}
	
	if (next){
		if (next <= 0) next = 0.1;
		log.info(this+' skills_complete_training exiting with next: '+next);
		this.apiSetTimer('skills_complete_training', next * 1000);
		return;
	}
	
	//
	// Resume
	//
	
	if (0){
		//
		// We don't currently auto-resume paused skills in the queue... but maybe someday!
		//
		
		queue = this.skills_get_queue();
		for (var id in queue){
			var skill = queue[id];
		
			if (skill.is_paused){	
				var duration = this.skills_points_to_seconds(skill.points_remaining, config.data_skills[id].category_id);
			
				this.skills.queue[id] = {
					start: time(),
					end: time() + duration,
				};

				this.apiSetTimer('skills_complete_training', duration * 1000);
				
				var out = {
					type: 'skill_train_resume',
					tsid: id,
					name: this.skills_get_name(id),
					desc: config.data_skills[id].description,
					time_remaining: duration,
					total_time: this.skills_points_to_seconds(config.data_skills[id].point_cost, config.data_skills[id].category_id)
				};

				this.sendMsgOnline(out);
		
				this.sendActivity('You resumed learning '+out.name+'.', null, true);

				// perform web callback for additional processing
				var args = {
					player	: this.tsid,
					skill_id: id,
					action	: 'resume'
				};

				utils.http_get('callbacks/skill.php', args);
			
				log.info(this+' skills_complete_training resuming '+id);
				return;
			}
		}
	}
}

function skills_get_queue(){
	this.skills_init();

	// Remove skills we already know or should know (this shouldn't be necessary, but is!)
	for (var i in this.skills.queue){
		var skill = this.skills.queue[i];

		if (this.skills_has(i)){
			delete this.skills.queue[i];
		}
		else if (skill.end <= time() && !skill.is_paused){
			this.skills_give(i);			
			delete this.skills.queue[i];
		}

		if (this.skills.queue[i] && !skill.is_paused && skill.is_accelerated){
			if (!skill.acceleration_end || skill.acceleration_end < time()){
				this.skills.queue[i].is_accelerated = false;
			}
		}
	}

	return this.skills.queue;
}

function skills_get_queue_length(){
	return num_keys(this.skills_get_queue());
}

function skills_get_unlearning_queue_length() { 
	if (!this.skills.unlearningQueue) { 
		this.skills.unlearningQueue = {};
	}
	return num_keys(this.skills.unlearningQueue);
}

// Is this glitch learning something?
function skills_is_learning(){
	var queue = this.skills_get_queue();
	for (var i in queue){
		if (!queue[i].is_paused){
			return true;
		}
	}
	
	return false;
}

// Is this glitch unlearning something?
function skills_is_unlearning(){
	var length = skills_get_unlearning_queue_length();
	
	if (length > 0) { 
		return true;
	}
	
	return false;
}

// Is this skill currently being learned?
function skills_in_learning_queue(skill) {

	var queue = this.skills_get_queue();
	for (var id in queue) {
		if (id == skill) {
			return true;
		}
	}
	
	return false;
}

var teleportation_skills = ['teleportation_1', 'teleportation_2', 'teleportation_3', 'teleportation_4', 'teleportation_5'];
var meditation_skills = ['meditativearts_1', 'meditativearts_2', 'meditativearts_3'];
var camera_skills = ['snapshotting_1', 'eyeballery_1']; 
function skills_give(id){
	// valid skill?
	var data = this.skills_get(id);
	if (!data) return;

	apiLogAction('SKILLS_GIVE', 'pc='+this.tsid, 'skill='+id);
	
	this.skills.skills[id] = time();
	
	var out = {
		type: 'skill_train_complete',
		tsid: id,
		name: this.skills_get_name(id),
		desc: config.data_skills[id].description,
		learned: config.data_skills[id].learned,
		sound: 'SKILL_ACHIEVED',
		stats: {}
	};
	
	// Some skills affect your max stats, so...
	this.stats_get_login(out.stats);
	this.metabolics_get_login(out.stats);

	if (this.has_done_intro) this.sendMsgOnline(out);
	var activity = 'You finished learning '+out.name+'.';
	if (out.learned) activity += ' ' + out.learned;
	this.sendActivity(activity, null, true);

	// TODO: apply any effects of learning this skill

	//
	// learn recipes?
	// TODO: probably need to change this so that learning a child skill learns parent recipes as needed
	//

	this.skills_auto_learn_recipes(id, true);

	// perform web callback for additional processing
	var args = {
		player	: this.tsid,
		skill_id: id,
		action	: 'complete'
	};

	utils.http_get('callbacks/skill.php', args);


	this.activity_notify({
		type	: 'skill_learned',
		skill	: id
	});
	
	this.daily_history_push('skills_learned', id);
	
	//
	// OMG HAKCSSS
	//
	
	if (in_array_real(id, this.teleportation_skills)){
		this.teleportation_notify_client();
	}
	else if (this.buffs_has('zen') && in_array_real(id, this.meditation_skills)){
		this.buffs_remove('zen ');
	}
	else if (in_array_real(id, this.camera_skills)){
		this.sendCameraAbilities();
	}

	//
	// give out any skill quests
	//

	if (!this.location.is_newxp || this.location.current_step != 'choose_skill'){
		// Hard-code some quests that need to happen before the other skill quests but *only* when we learn the skill
		// outside of newxp (so they can't go in the normal map)
		if (id == 'animalkinship_1'){
			this.quests_offer('animalkinship_1', true);
		}
		else if (id == 'light_green_thumb_1'){
			this.quests_offer('lightgreenthumb_1', true);
		}
		else if (id == 'ezcooking_1'){
			this.quests_offer('ezcooking_1', true);
		}
		else if (id == 'soil_appreciation_1'){
			this.quests_offer('soilappreciation_1', true);
		}
		else{
			this.quests_learnt_skill(id);
		}
	}


	if (this.skills_get_count() == 11){
		this.achievements_grant('first_eleven_skills');
	}
}

// Do all notifications necessary for removing a skill
function skills_remove_notify(id){
	if (!this.skills.unlearningQueue) {
		this.skills.unlearningQueue = {};
	}

	// valid skill?
	var data = this.skills_get(id);
	if (!data) {
		log.info(this+" Unlearning: attempt to notify about invalid skill "+id);
		return;
	}

	if (!this.skills.skills[id] && !this.skills.queue[id]) {
		log.info(this+" Unlearning: attempted to notify but skill already removed "+id);
		return;
	}
	
	log.info(this+" Unlearning: notifying about skill "+id);
	
	this.achievements_increment('skills_unlearned', id);	// track for achievements
	
	var out = {
		type: 'skill_unlearn_complete',
		tsid: id,
		name: this.skills_get_name(id),
		desc: config.data_skills[id].description,
		sound: 'SKILL_ACHIEVED',
		stats: {}
	};
	
	// Some skills affect your max stats, so...
	this.stats_get_login(out.stats);
	this.metabolics_get_login(out.stats);
	this.sendMsgOnline(out);
	
	var activity = 'You unlearned '+out.name+'.';
	if (out.unlearned) activity += ' ' + out.unlearned;
	this.sendActivity(activity, null, true);
	
	
	// perform web callback for additional processing
	var args = {
		player	: this.tsid,
		skill_id: id,
		action	: 'complete'
	};

	utils.http_get('callbacks/skill_unlearn.php', args);

	this.activity_notify({
		type	: 'skill_unlearned',
		skill	: id
	});
	
	this.daily_history_push('skills_unlearned', id);
	
	//
	// OMG HAKCSSS
	//
	
	// Done on timers, because we still have the skill at this point
	if (in_array_real(id, this.teleportation_skills)){
		this.apiSetTimerX('teleportation_notify_client', 500);
	}
	else if (in_array_real(id, this.camera_skills)){
		this.apiSetTimerX('sendCameraAbilities', 500);
	}
}


//
// Takes a skill like 'mining_1', 'mining_2' or whatever, and returns the highest level the player has in that "set"
//

function skills_get_highest_level(skill_id){
	var last_sep = skill_id.lastIndexOf('_');
	if (last_sep == -1) return 0;
	
	var base_id = skill_id.substr(0, last_sep);
	
	var highest_level = 0;
	var i = 1;
	do {
		var success = this.skills_has(base_id+'_'+i);
		if (success) highest_level = i;
		
		i++;
	} while (success);
	
	return highest_level;
}

function skills_get_learning(){
	var queue = this.skills_get_queue();

	for (var i in queue){
		if (!queue[i].is_paused){
			return {
				id	: i,
				queue	: this.skills_format_queued(queue[i]),
				data 	: this.skills_get(i)
			};
		}
	}

	return null;
}

function skills_get_unlearning(){
	var queue = this.skills.unlearningQueue;

	for (var i in queue){
		var start = queue[i].start;
		var end = queue[i].end;
		var remaining = end - time();
		var total = end - start;

		// Error check: if remaining time is negative, then for some reason the 
		// timer didn't trigger. Do the deletion here so we don't show negative numbers in the web app.
		if (remaining < 0) {
			log.info(this+" Unlearning time went negative for skill "+this.skills_get_name(i));
		
			// Use a delay because skills_remove_notify calls stats_get_login, which calls skills_get_unlearning.
			// Which causes an infinite loop if called from here.
			this.apiSetTimerX('skills_remove_notify', 100, i);
			// MUST DO REMOVE NOTIFY before REMOVE to prevent duplicate notifications.
			this.apiSetTimerX('skills_remove', 110, i);
			delete this.skills.unlearningQueue[i];
			
			//log.info(this+" unlearning queue is "+this.skills.unlearningQueue[i]);
		}

		log.info(this+" Unlearning "+this.skills_get_name(i));
		return {
			id	: i,
			ok	: 1,
			queue	: {
				remaining	: remaining,
				unlearn_time: total,
				total_time	: total,
				percent_complete: 100*(total-remaining)/total,
				start		: start, 
				end			: end,
				fullname	: this.skills_get_name(i)
			},
			data 	: this.skills_get(i)
		};
	}

	//log.info(this+" Not unlearning!");
	return 0;
}

function skills_format_queued(queue){

	var remaining = queue.end - time();
	var total = queue.end - queue.start;

	return {
		remaining	: remaining,
		total_time	: total,
		percent_complete: 100*(total-remaining)/total,
		start		: queue.start, 
		end		: queue.end,
		is_accelerated	: queue.is_accelerated ? true : false,
		acceleration_end: queue.is_accelerated ? queue.acceleration_end : 0,
	};
}

//
// Given an achievement id, return any skills (ids) which have the achievement as a prereq
//

function skills_get_by_achievement(achievement_id){
	
	var skills = [];
	for (var skill_id in config.data_skills){
		for (var i in config.data_skills[skill_id].req_achievements){
			if (config.data_skills[skill_id].req_achievements[i] == achievement_id){
				skills.push(skill_id);
			}
		}
	}
	
	return skills;
}


function skills_admin_check_states(args){
	if (!this.skills.unlearningQueue) { 
		this.skills.unlearningQueue = {};
	}

	this.skills_init();

	var out = {
		'ok'		: 1,
		'level'		: this.stats.level,
		'skills'	: {},
		'achievements'	: {},
		'quests'	: {},
		'upgrades'	: {},
	};

	// skills
	var queue = this.skills_get_queue();
	var unlearningQueue = this.skills.unlearningQueue;
	for (var i in args.skills){
		var skill = args.skills[i];
		if (!config.data_skills[skill]) continue;

		out.skills[skill] = {
			'got' : 0,
		};

		if (unlearningQueue[skill]) { 
			out.skills[skill].unlearning = 1;
			out.skills[skill].point_cost = unlearningQueue[skill].points_remaining;
			out.skills[skill].seconds = this.skills_unlearning_time(skill.point_cost);
			out.skills[skill].unlearn_time = out.skills[skill].seconds;
		}
		else if (this.skills.skills[skill]){
			// learnt
			out.skills[skill].got = 1;
			out.skills[skill].when = this.skills.skills[skill];			
			out.skills[skill].unlearn_time = this.skills_unlearning_time(config.data_skills[skill].point_cost);
		}else if (queue[skill]){
			// learning	
			out.skills[skill].learning = 1;
			out.skills[skill].paused = queue[skill].is_paused ? 1 : 0;
			out.skills[skill].point_cost = queue[skill].points_remaining;
			out.skills[skill].seconds = this.skills_points_to_seconds(out.skills[skill].point_cost, config.data_skills[skill].category_id);
			out.skills[skill].unlearn_time = this.skills_unlearning_time(out.skills[skill].point_cost);			
		}else{
			// not started
			out.skills[skill].point_cost = config.data_skills[skill].point_cost;
			out.skills[skill].seconds = this.skills_points_to_seconds(out.skills[skill].point_cost, config.data_skills[skill].category_id);
		}
	}
	
	// achievements
	for (var i in args.achievements){

		var achievement = args.achievements[i];

		out.achievements[achievement] = {
			'got' : this.achievements_has(achievement) ? 1 : 0,
		};
	}

	// quests
	for (var i in args.quests){

		var quest = args.quests[i];

		out.quests[quest] = {
			'got' : this.getQuestStatus(quest) == 'done' ? 1 : 0,
		};
	}

	// upgrades
	for (var i in args.upgrades){

		var upgrade = args.upgrades[i];

		out.upgrades[upgrade] = {
			'got' : this.imagination_has_upgrade(upgrade) ? 1 : 0,
		};
	}

	return out;
}

function skills_get_learning_time_modifier(){
	var count = this.skills_get_count() + this.skills_get_queue_length();
	
	// If no skills, first skill takes 15% of normal time
	if (!count) return 0.15;
	
	// Now run a modifier based on how many skills they know and which Better Learning skill level they have
	var modifier_base = this.get_brain_capacity();
	
	var modifier = 1.0;
	
	for (var i=modifier_base+1; i<=count; i++){
		modifier = modifier * (1 + config.skill_learning_modifier_step);
	}
	
	return modifier;
}

//
// Returns a basic class_id/name list, for the client to use in
// presenting the familiar's learning interface
//

function skills_learnable_list(is_new_style, include_locked){

	var skills = this.skills_get_all();
	var queue = this.skills_get_queue();

	var out = {};

	//
	// loop over each skill
	//

	for (var i in skills){
		if (!skills[i].got && (skills[i].can_learn || include_locked)){
			if (is_new_style){
				out[i] = {
					'name': skills_get_name(i),
					'url': '/skills/'+config.data_skills[i].id+'/',
					'description': config.data_skills[i].description,
					'seconds': skills[i].total_time,
					'learning': queue[i] ? true : false,
					'paused': (queue[i] && queue[i].is_paused) ? true : false,
					'reqs': skills[i].reqs,
					'post_reqs': skills[i].post_reqs,
					'giants': skills[i].giants
				};
				if (include_locked){
					out[i].can_learn = !!skills[i].can_learn;
				}
			} else {
				out[i] = skills_get_name(i);
			}
		}
	}
	return out;
}

// Used for adjusting skill learning times. Was previously located in shrines.js, but is now also called by emblems.
function get_skill_info(skill, giant, points){

	var out = {
		learning		: 0,
		spend_point		: 0,
		speed_up		: 0,
		giant_rel		: 'u',
	};


	//
	// only figure stuff out if we're learning a skill
	//

	if (skill && skill.data && skill.data.giants){

		var seconds_per_point = 5;
		if (skill.data.giants[giant]){
			out.giant_rel = 's';
			var seconds_per_point = 7;
			if (intval(skill.data.giants[giant].primary)){
				out.giant_rel = 'p';
				var seconds_per_point = 10;
			}
		}

		var max_seconds = this.skills_get_max_acceleration();
		var max_points = max_seconds / seconds_per_point;

		out.spend_points = max_points < points ? max_points : points;
		out.speed_up = out.spend_points * seconds_per_point;
	}


	return out;
}

function get_brain_capacity(){
	return this.skills.capacity;
}

function skills_increase_brain_capacity(amount){
	var old_modifier = this.skills_get_learning_time_modifier();
	this.skills.capacity += amount;
	if (this.skills.capacity > config.brain_capacity_limit) this.skills.capacity = config.brain_capacity_limit;

	var new_modifier = this.skills_get_learning_time_modifier();

	if (old_modifier != new_modifier){
		var percent = new_modifier / old_modifier;

		// Check the queue
		for (var i in this.skills.queue){
			if (this.skills.queue[i].is_paused) continue;

			var s = config.data_skills[i];
			this.apiCancelTimer('skills_complete_training');
			var time_change = Math.round((this.skills.queue[i].end - this.skills.queue[i].start) * (1-percent));
			var new_end = Math.max(this.skills.queue[i].end - time_change, time()+1);
			this.skills.queue[i].end = new_end;

			var remaining = new_end - time();

			this.apiSetTimer('skills_complete_training', remaining * 1000);
				
			var skill = this.skills_get(i);

			var out = {
				type: 'skill_train_resume',
				tsid: i,
				name: this.skills_get_name(i),
				desc: skill.description,
				time_remaining: remaining,
				total_time: this.skills_points_to_seconds(skill.point_cost, skill.category_id)
			};

			this.sendMsgOnline(out);
		}
	}
}

function skills_set_brain_capacity(amount){
	this.skills.capacity = amount;
}

function skills_remove_removed(){
	// Check skills you are learning, and remove the ones that don't exist anymore
	for (var i in this.skills.queue){
		var s = config.data_skills[i];
		if (!s) delete this.skills.queue[i];
	}

	for (var i in this.skills.unlearningQueue){
		var s = config.data_skills[i];
		if (!s) delete this.skills.unlearningQueue[i];
	}

	for (var i in this.skills.skills){
		var s = config.data_skills[i];
		if (!s) delete this.skills.skills[i];
	}
}

// Cancels all in-progress skill learning/unlearning. Used when we delete an account
function skills_cancel_learning(){
	this.apiCancelTimer('skills_complete_training');
	this.apiCancelTimer('skills_stop_acceleration');
	for (var i in this.skills.queue){
		delete this.skills.queue[i];
	}

	this.apiCancelTimer('skills_complete_unlearning');
	for (var i in this.skills.unlearningQueue){
		delete this.skills.unlearningQueue[i];
	}
}

////////// Support for upgrades

// Pass in the category id & the percentage to reduce by (actual percentage, so for 2% pass in 2)
function applyCategoryReduction(category_id, percent){
	if (!this.category_reductions) { this.category_reductions = {}; }
	
	// Store a multiplier for the time. So, for 2% reduction, this is .98
	this.category_reductions[category_id] = (100 - percent)/100;
	//log.info("Category reductions "+this.category_reductions);

	// Check the queue
	for (var i in this.skills.queue){
		if (this.skills.queue[i].is_paused) continue;

		var s = config.data_skills[i];
		if (s.category_id == category_id){
			this.apiCancelTimer('skills_complete_training');
			var time_change = Math.round((this.skills.queue[i].end - this.skills.queue[i].start) * (percent / 100));
			var new_end = Math.max(this.skills.queue[i].end - time_change, time()+1);
			this.skills.queue[i].end = new_end;

			var remaining = new_end - time();

			this.apiSetTimer('skills_complete_training', remaining * 1000);
				
			var skill = this.skills_get(i);

			var out = {
				type: 'skill_train_resume',
				tsid: i,
				name: this.skills_get_name(i),
				desc: skill.description,
				time_remaining: remaining,
				total_time: this.skills_points_to_seconds(skill.point_cost, skill.category_id)
			};

			this.sendMsgOnline(out);
		}
	}
}

/////////////////////////

function skills_get_urls(){
	var urls = {};

	for (var i in config.data_skills){
		urls[i] = config.data_skills[i].icons;
	}

	return urls;
}

function skills_get_active_progress(){

	var ret = this.skills_get_learning();

	if (ret && ret.id){
		return {
			tsid		: ret.id,
			is_learning	: true,
			is_unlearning	: false,
			remaining	: ret.queue.remaining,
			total_time	: ret.queue.total_time,
			name		: this.skills_get_name(ret.id),
			icons		: ret.data.icons,
		};
	}

	var ret = this.skills_get_unlearning();

	if (ret && ret.id){
		return {
			tsid		: ret.id,
			is_learning	: false,
			is_unlearning	: true,
			remaining	: ret.queue.remaining,
			total_time	: ret.queue.total_time,
			name		: this.skills_get_name(ret.id),
			icons		: ret.data.icons,
		};
	}

	return {
		is_learning	: false,
		is_unlearning	: false,
	};
}
