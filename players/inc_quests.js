
function quests_init(){

	if (this.quests === undefined || this.quests === null) this.quests = {};
	if (this.quests.todo === undefined || this.quests.todo === null){
		this.quests.todo = apiNewOwnedDC(this);
		this.quests.todo.label = 'To Do';
		this.quests.todo.quests = {};
	}
	if (this.quests.done === undefined || this.quests.done == null){
		this.quests.done = apiNewOwnedDC(this);
		this.quests.done.label = 'Done';
		this.quests.done.quests = {};
	}
	if (this.quests.fail_repeat === undefined || this.quests.fail_repeat === null){
		this.quests.fail_repeat = apiNewOwnedDC(this);
		this.quests.fail_repeat.label = 'Repeatable Failed';
		this.quests.fail_repeat.quests = {};
	}
	if (this.quests.misc === undefined || this.quests.fail_repeat === null){
		this.quests.misc = apiNewOwnedDC(this);
		this.quests.misc.label = 'Misc';
		this.quests.misc.quests = {};
	}
	
	// Test quests for completeness
	for (var i in this.quests.todo.quests){
		try{
			this.quests.todo.quests[i].checkCompletion(this);
		}catch(e){
			log.error("Player "+this+" has missing in-progress quest "+i+".");
		}
	}
}

function quests_delete(){

	if (this.quests){
		delete this.quests.queue;
		
		for (var i in this.quests){
			var dc = this.quests[i];
			if (dc.quests){
				for (var j in dc.quests){
					if (dc.quests[j].deleteMe){
						dc.quests[j].deleteMe();
					}else{
						dc.quests[j].apiDelete();
					}
				}
			}
			dc.apiDelete();

		}
		delete this.quests;
	}

	delete this.last_quest_offer;
}

function quests_reset(){

	//this.quests_delete();

	if (this.quests){
		delete this.quests.queue;
		
		for (var i in this.quests){
			var dc = this.quests[i];
			if (dc.quests){
				for (var j in dc.quests){
					if (dc.quests[j].deleteMe){
						dc.quests[j].deleteMe();
					}else{
						dc.quests[j].apiDelete();
					}
				}
			}
			
			this.quests[i].quests = {};
		}
	}

	delete this.last_quest_offer;

	this.quests_init();
}

function quests_login(){
	this.quests_give_level();
	
	var skills = this.skills_get_list();
	for (var i in skills){
		var skill = skills[i];
		//this.quests_learnt_skill(skill['id']);
		this.quests_learnt_skill_do({skill_id: skill['id']});
	}

	if (this.achievements_has('senior_ok_explorer')) this.quests_offer('explore_the_seams');

	if (this.achievements_has('shimla_mirch_completist')) this.quests_offer('where_the_blue_grew');
	if (this.achievements_has('chakra_phool_completist')) this.quests_offer('where_the_blue_grew');
	if (this.achievements_has('jethimadh_completist')) this.quests_offer('where_the_blue_grew');
	if (this.achievements_has('kalavana_completist')) this.quests_offer('where_the_blue_grew');
}

function quests_changed_item(class_tsid){
	if (!this.quests || !this.quests.todo) return;
	// called when we gain or lose one or more of an item.
	// we need to loop over pending quests and see if we need to update any requirements.

	//log.info('quests_changed_item: ' +class_tsid);
	for (var i in this.quests.todo.quests){
		this.quests.todo.quests[i].changed_item(this, class_tsid);
	}
}

function quests_made_recipe(recipe_id, num){
	if (!this.quests || !this.quests.todo) return;
	//log.info('recipe made: '+num+'x recipe #'+recipe_id);
	for (var i in this.quests.todo.quests){
		this.quests.todo.quests[i].made_recipe(this, recipe_id, num);
	}
}

function quests_inc_counter(counter, num){
	if (!num) num = 1;
	if (!this.quests || !this.quests.todo) return;
	//log.info('incrementing quest counter: '+counter+' (by '+num+')');
	for (var i in this.quests.todo.quests){
		this.quests.todo.quests[i].inc_counter(this, counter, num);
	}
}

function quests_set_counter(counter, num){
	if (!this.quests || !this.quests.todo) return;
	//log.info('incrementing quest counter: '+counter+' (by '+num+')');
	for (var i in this.quests.todo.quests){
		this.quests.todo.quests[i].set_counter(this, counter, num);
	}
}

function quests_get_counter(quest_id, counter){
	if (!this.quests || !this.quests.todo || !this.quests.todo.quests[quest_id]) return 0;
	
	return this.quests.todo.quests[quest_id].get_counter_value(this, counter);
}

function quests_set_flag(flag){
	if (!this.quests || !this.quests.todo) return;
	//log.info('setting flag: '+flag);
	for (var i in this.quests.todo.quests){
		this.quests.todo.quests[i].set_flag(this, flag);
	}
}

function quests_get_flag(quest_id, flag){
	if (!this.quests || !this.quests.todo || !this.quests.todo.quests[quest_id]) return 0;
	
	return this.quests.todo.quests[quest_id].get_flag(flag);
}

function quests_get_status(){

	//
	// this function is called at login to get a player's
	// quest log
	//

	var ret = {};
	
	try {
		for (var i in this.quests.todo.quests){
			var q = this.quests.todo.quests[i];
			if (q.hide_questlog) continue;

			ret[q.class_id] = q.get_status(this, 'todo');
		}
	} catch (e){
		log.error(e);
	}

	return ret;
}

function getQuestStatus(quest_class){

	if (this.quests.todo.quests[quest_class]) return 'todo';

	if (this.quests.done.quests[quest_class]) return 'done';

	if (this.quests.fail_repeat && this.quests.fail_repeat.quests[quest_class]) return 'fail_repeat';

	return 'none';
}

function getQuestInstance(quest_class){

	if (this.quests.todo.quests[quest_class]) return this.quests.todo.quests[quest_class];

	if (this.quests.done.quests[quest_class]) return this.quests.done.quests[quest_class];

	if (this.quests.fail_repeat && this.quests.fail_repeat.quests[quest_class]) return this.quests.fail_repeat.quests[quest_class];

	return null;
}

function forceQuestInstance(quest_class){

	var qi = this.getQuestInstance(quest_class);
	if (!qi) qi = this.startQuest(quest_class);
	return qi;
}

function startQuest(quest_class, is_npc, auto_accept){

	var status = this.getQuestStatus(quest_class);
	if (status == 'done'){
		var qi = this.getQuestInstance(quest_class);
		if (qi.is_repeatable){
			return this.startQuestRepeat(quest_class, is_npc, auto_accept);
		} else {
			return null;
		}
	} else if (status == 'fail_repeat'){
		var qi = this.getQuestInstance(quest_class);
		if (qi.is_repeatable){
			return this.startQuestRepeat(quest_class, is_npc, auto_accept);
		} else {
			return null;
		}
	} else if (status != 'none') {
		return null;
	}

	apiLogAction('QUEST_START', 'pc='+this.tsid, 'quest='+quest_class);

	var quest = apiNewOwnedQuest(quest_class, this);

	if (quest){
		if (quest.omg_is_missing){
			log.error(this+' tried to start a missing quest: '+quest_class);
			quest.apiDelete();
			delete quest;
		}
		else{
			// Only offer multiplayer quests on streets with other players on them!
			if (quest.isMultiplayer() && num_keys(this.location.getActivePlayers()) < 2){
				quest.apiDelete();
				delete quest;
			}
			else{
				quest.onStart(this, is_npc, auto_accept);
				this.quests.todo.quests[quest_class] = quest;
			}
		}
	}

	return quest;
}

function startQuestRepeat(quest_class, is_npc, auto_accept){
	var quest = this.getQuestInstance(quest_class);

	if (!quest){
		log.error('QUEST REPEAT FAILED: Quest not found for '+quest_class);
		return false;
	}

	var status = this.getQuestStatus(quest_class);

	if (status == 'todo'){
		return quest;
	} else if (status == 'done') {
		apiLogAction('QUEST_REPEAT', 'pc='+this.tsid, 'quest='+quest_class);
		delete this.quests.done.quests[quest_class];
		this.quests.todo.quests[quest_class] = quest;
		quest.onStart(this, is_npc, auto_accept);
		return quest;
	} else if (status == 'fail_repeat') {
		apiLogAction('QUEST_REPEAT', 'pc='+this.tsid, 'quest='+quest_class);
		delete this.quests.fail_repeat.quests[quest_class];
		this.quests.todo.quests[quest_class] = quest;
		quest.onStart(this, is_npc, auto_accept);
		return quest;
	}

	log.error('QUEST REPEAT FAILED: status unknown for '+quest_class);
}

function restartQuest(quest_class){
	var status = this.getQuestStatus(quest_class);
	if (status != 'todo' && status != 'fail_repeat') return null;
	
	apiLogAction('QUEST_RESTART', 'pc='+this.tsid, 'quest='+quest_class);

	var quest = this.getQuestInstance(quest_class);

	if (quest){
		if (status == 'fail_repeat') {
			delete this.quests.fail_repeat.quests[quest_class];
			this.quests.todo.quests[quest_class] = quest;
		}

		return quest.onRestart(this);
	}

	return quest;
}

function acceptQuest(quest_class){
	var status = this.getQuestStatus(quest_class);
	if (status != 'todo') return null;
	
	apiLogAction('QUEST_ACCEPT', 'pc='+this.tsid, 'quest='+quest_class);

	var quest = this.getQuestInstance(quest_class);

	if (quest){
		quest.onAccept(this);
	}

	return quest;
}

function quests_send_state(quest, state){
	// Shhhhhh
	if (quest.hide_questlog) return;

	var quest_info = quest.get_status(this, 'todo');

	this.apiSendMsg({
		'type'		: 'quest_'+state,
		'quest_id'	: quest.class_id,
		'title'		: '* '+quest.get_full_title(this),
		'desc'		: '* '+quest.get_full_description(this),
		'info'		: quest_info,
	});

}

function completeQuest(quest_class, no_alert){

	var status = this.getQuestStatus(quest_class);

	if (status == 'done') return false;

	var qi;
	if (status == 'todo'){
		qi = this.quests.todo.quests[quest_class];
	}else{
		qi = apiNewOwnedQuest(quest_class, this);
	}


	//
	// try and complete it
	//

	if (!qi.doComplete(this)){
		if (status != 'todo'){
			qi.apiDelete();
		}
		return false;
	}
	
	apiLogAction('QUEST_COMPLETE', 'pc='+this.tsid, 'quest='+quest_class);

	//
	// store it
	//

	qi.ts_done = time();

	if (qi.is_repeatable){
		if (!qi.repeats){
			qi.repeats = [];
		}
		qi.repeats.push({'ts_start': qi.ts_start, 'ts_done': qi.ts_done});
	}

	this.quests.done.quests[quest_class] = qi;

	delete this.quests.todo.quests[quest_class];

	//
	// notify client
	//

	if (!qi.hide_questlog){
		this.apiSendMsg({
			'type'		: 'quest_finished',
			'quest_id'	: qi.class_id,
		});
		log.info('sending log completion message for '+qi.getTitle(this));

		if (qi.show_alert && !no_alert){
			this.apiSendMsg({
				'type'		: 'alert',
				'msg'		: qi.getCompletion(this),
				'btn_txt'	: qi.button_thanks,
			});
			log.info('sending alert for '+qi.getTitle(this));
		}

		if (qi.is_tracked){
			this.sendActivity('Quest completed: '+qi.getTitle(this));
		}
	}
	
	this.daily_history_push('quests_completed', quest_class);
	
	if (in_array(quest_class, ['high_jump', 'rook_egg_smash'])){
		this.show_rainbow('rainbow_youdidit');
	}

	return true;
}

function failQuest(quest_class, fail_completed){

	var status = this.getQuestStatus(quest_class);
	
	var qi;
	if (fail_completed){
		if (status != 'done') return false;
		qi = this.quests.done.quests[quest_class];
	}
	else{
		if (status != 'todo') return false;
		qi = this.quests.todo.quests[quest_class];
	}
	
	apiLogAction('QUEST_FAILED', 'pc='+this.tsid, 'quest='+quest_class);

	// Remove any quest locations
	var quest_instance = this.getQuestInstance(quest_class);

	//
	// notify client
	//

	this.sendMsgOnline({
		'type'		: 'quest_failed',
		'quest_id'	: qi.class_id,
	});
	log.info('sending log failed message for '+qi.getTitle(this));
	
	qi.onFail(this);
	
	if (fail_completed){
		this.quests.todo.quests[quest_class] = qi;
		delete this.quests.done.quests[quest_class];
	}
	
	// If it's repeatable, move it to the fail_repeat store

	if (qi.is_repeatable){
		if (!qi.fails){
			qi.fails = [];
		}
		qi.fails.push({'ts_start': qi.ts_start, 'ts_fail': time()});

		this.quests.fail_repeat.quests[quest_class] = qi;
		delete this.quests.todo.quests[quest_class];
	} // If it's not restartable, just remove it
	else if (!qi.onStarted){
		this.quests_remove(quest_class);
	}

	return true;
}

function quests_fail_and_remove(quest_class, fail_completed){
	if (this.failQuest(quest_class, fail_completed)){
		if (this.quests.todo.quests[quest_class]){
			this.quests.todo.quests[quest_class].apiDelete();
			delete this.quests.todo.quests[quest_class];
		}
		else if (this.quests.done.quests[quest_class]){
			this.quests.done.quests[quest_class].apiDelete();
			delete this.quests.done.quests[quest_class];
		}
	}
}

function quests_get_all(){

	var out = {
		'todo' : {},
		'done' : {},
	};

	for (var i in this.quests.todo.quests){
		out.todo[i] = this.quests_get_single(this.quests.todo.quests[i]);
	}

	for (var i in this.quests.done.quests){
		out.done[i] = this.quests_get_single(this.quests.done.quests[i]);
	}

	return out;
}

function quests_on_logout(){
	// Fail all multiplayer quests
	for (var i in this.quests.todo.quests){
		var q = this.quests.todo.quests[i];
		if (q.is_multiplayer && q.isStarted() && !q.isFull()){
			this.updateActionRequest('was looking for a challenger on the quest <b>'+q.getTitle(this)+'</b>.', 0);
			this.cancelActionRequestBroadcast('quest_accept', q.class_tsid);
			this.failQuest(q.class_tsid);
		}
	}
}

function quests_get_single(q){

	var reqs = {};

	for (var i in q.requirements){
		reqs[i] = {
			'desc'		: q.requirements[i].desc,
			'type'		: q.requirements[i].type,
			'is_count'	: q.requirementIsCounter(q.requirements[i]),
			'num'		: q.requirements[i].num,
			'got'		: q.req_states ? q.req_states[i] : 0,
		};
		
		if (q.requirements[i].type != 'make'){
			reqs[i].name = q.requirements[i].name;
		} else {
			reqs[i].recipe_id = q.requirements[i].recipe_id;
		}
	}

	return {
		'tsid'		: q.tsid,
		'is_started'	: q.is_started,
		'reqs'		: reqs,
	};
}

function quests_remove(class_tsid){

	// remove done version
	if (this.quests.done.quests[class_tsid]){
		if (this.quests.done.quests[class_tsid].deleteMe){
			this.quests.done.quests[class_tsid].deleteMe();
		}else{
			this.quests.done.quests[class_tsid].apiDelete();
		}
		delete this.quests.done.quests[class_tsid];
	}

	// remove todo version
	if (this.quests.todo.quests[class_tsid]){
		// Remove from the client
		if (!this.quests.todo.quests[class_tsid].hide_questlog) this.apiSendMsg({type: 'quest_remove', tsid: class_tsid});
		
		if (this.quests.todo.quests[class_tsid].deleteMe){
			this.quests.todo.quests[class_tsid].deleteMe();
		}else{
			this.quests.todo.quests[class_tsid].apiDelete();
		}
		delete this.quests.todo.quests[class_tsid];
	}

	// remove offers
	var alerts = this.familiar_find_alerts('quests_familiar_offer');
	for (var i in alerts){
		if (alerts[i].class_tsid == class_tsid){
			this.familiar_remove_alert(i);
		}
	}
}

function quests_offer(class_tsid, force_now, delay){

	if (!class_tsid) return;
	
	// Are quests turned off? if so, lets delay this quest
	if (this.buffs_has('turn_off_quests')){ delay = true; }

	var q_proto = apiFindQuestPrototype(class_tsid);
	if (!force_now) {
		for (var i in q_proto.prereq_quests) {
			var pq = q_proto.prereq_quests[i];
		
			if (this.getQuestStatus(pq) != "done") {
				log.info("Tried to offer quest "+class_tsid+" to "+this+" but they are missing prereq "+pq);
				return;
			}
		}

		if (q_proto.canOffer){
			if (!q_proto.canOffer(this)){
				if (config.is_dev) log.info(this+' call to canOffer() returned false for quest: '+class_tsid);
				return;
			}
		}
	}

	if (q_proto.isEmergency()){
		force_now = true;
	}

	var status = this.getQuestStatus(class_tsid);

	if (status == 'done' || status == 'fail_repeat'){
		var qi = this.getQuestInstance(class_tsid);
		if (!qi.is_repeatable){
			return;
		}
	} else if (status != 'none') return;
	
	// Only one offer every 5 minutes
	var force_delay = false;
	if (delay) force_delay = true;
	if (!delay) delay = (60 * 5);

	// check newxp status and force a delay
	if ((!this.has_done_intro || this.location.is_newxp || this.location.is_skillquest || (this.location.class_tsid == 'newbie_island' && this.getQuestStatus('buy_two_bags') != 'done')) && !force_now){
		force_delay = true;
	}

	if (force_delay || (!force_now && this.last_quest_offer && (time() - this.last_quest_offer < delay))){
		return this.quests_offer_queue(class_tsid, delay, force_delay);
	}

	apiLogAction('QUEST_OFFERED', 'pc='+this.tsid, 'quest='+class_tsid);

	var quest = this.startQuest(class_tsid);
	
	if (quest){
		this.last_quest_offer = time();
	}
	
	return quest;
}

function quests_offer_queue(class_tsid, delay, force_delay){
	if (!this.quests.queue){
		this.quests.queue = [];
	}
	
	if (in_array(class_tsid, this.quests.queue)) return;
	
	apiLogAction('QUEST_QUEUED', 'pc='+this.tsid, 'quest='+class_tsid);
	
	var length = this.quests.queue.push(class_tsid);
	if (length == 1){
		var duration;
		if (force_delay){
			duration = delay * 1000;
		}
		else{
			duration = (delay - (time() - this.last_quest_offer)) * 1000;
		}
		
		this.apiSetTimer('quests_run_queue', duration);
	}
}

function quests_run_queue(){
	if (!this.quests.queue || !this.quests.queue.length) return false;
	
	if (!this.isOnline()) return this.quests_pause_queue();

	if (this.buffs_has('turn_off_quests')) return this.quests_pause_queue();
	
	var class_tsid = this.quests.queue.shift();
	if (!class_tsid) return false;
	
	if (this.quests_offer(class_tsid, true)){
		if (this.quests.queue.length) this.apiSetTimer('quests_run_queue', 60 * 5 * 1000);
		return true;
	}
	else{
		this.quests_offer(class_tsid, false, 5*60);
		return this.quests_run_queue();
	}
}

function quests_pause_queue(){
	if (this.quests.queue && this.quests.queue.length) return this.apiCancelTimer('quests_run_queue');
	
	return false;
}

function quests_restart_queue(){
	if (!this.quests.queue || !this.quests.queue.length) return false;
	
	return this.apiSetTimer('quests_run_queue', ((60 * 5) - (time() - this.last_quest_offer)) * 1000);
}

//
// Gives a player a quest and makes it instantly completed
// Does not give it if the player has it in-progress or has completed it
// Does not give quest rewards
//
function quests_give_finished(class_tsid){
	if (!class_tsid) return;
	this.quests_init();

	var status = this.getQuestStatus(class_tsid);

	if (status != 'none') return;

	var quest = apiNewOwnedQuest(class_tsid, this);
	if (quest){
		if (quest.omg_is_missing){
			log.error(this+' tried to start a missing quest: '+class_tsid);
			quest.apiDelete();
			quest = null;
		}
		else{
			quest.hide_questlog = true;
			quest.onStart(this, false, true);
			quest.makeComplete(this);
			this.quests.done.quests[class_tsid] = quest;

			if (quest.onComplete_custom) quest.onComplete_custom(this);
		}
	}
	return quest;
}

function quests_familiar_turnin(class_tsid){
	var quest = this.getQuestInstance(class_tsid);

	this.quests_familiar_turnin_cancel(class_tsid);

	// Only send an alert if the quest actually has text:
	if(quest && quest.getCompletion(this) && quest.getCompletion(this).length) {
        this.familiar_send_alert({
                'callback'      : 'quests_familiar_turnin_do',
                'quest_id'    : class_tsid,
        });
	} else {
		// No completion text. Just complete the quest!
		this.completeQuest(class_tsid);
	}


	if (this.location.isInstance()){
		this.instances_cancel_exit_prompt(this.location.instance_id);
	}
}

function quests_familiar_turnin_cancel(class_tsid){

	// remove any turnin alert about this quest from the queue

	var alerts = this.familiar_find_alerts('quests_familiar_turnin_do');

	for (var i in alerts){
		if (alerts[i].class_tsid == class_tsid){

			this.familiar_remove_alert(i);
		}
	}
}

function rewards_deep_copy(rewards) {
	var new_rewards = {};
	if(rewards.currants) {
		new_rewards.currants = rewards.currants;
	}
	if(rewards.xp) {
		new_rewards.xp = rewards.xp;
	}
	if(rewards.mood) {
		new_rewards.mood = rewards.mood;
	}
	if(rewards.energy) {
		new_rewards.energy = rewards.energy;
	}
	if(rewards.favor) {
		new_rewards.favor = {};
		for(var i in rewards.favor) {
			new_rewards.favor[i] = { giant: rewards.favor[i].giant,
									 points: rewards.favor[i].points };
		}
	}
	if(rewards.items) {
		new_rewards.items = {};
		for(var i in rewards.items) {
			new_rewards.items[i] = { class_tsid : rewards.items[i].class_tsid,
									 label 		: rewards.items[i].label,
									 count		: rewards.items[i].count };
		}
	}
	if(rewards.recipes) {
		new_rewards.recipes = {};
		for(var i in rewards.recipes) {
			new_rewards.recipes[i] = { recipe_id: rewards.recipes[i].recipe_id, 
								   	   label: rewards.recipes[i].label };
		}
	}
	
	return new_rewards;
}

function quests_familiar_turnin_do(choice, details){
	
	log.info('quests_familiar_turnin_do(): '+choice+' - '+details);

	if (choice == 'dismiss'){
		return {
			done: false
		};
	}
	else if (choice == 'quest-complete'){
		this.events_add({quest_id: details.quest_id, callback: 'quests_familiar_turnin_do_complete'}, 0.1);
		
		return {
			args: {
				quest_id: details.quest_id,
				quest_complete_convo: true
			},
			done: true
		};
	}
	else{
		var status = this.getQuestStatus(details.quest_id);
		var quest = this.getQuestInstance(details.quest_id);

		if (status != 'todo' || !quest.is_complete){
			return {
				args: {
					quest_id: details.quest_id
				},
				txt : "Nevermind!",
				done : true,
			};
		}

		// Copy rewards
		var new_rewards = rewards_deep_copy(quest.rewards);
		
		// If we are under the effects of the Silvertongue buff, we need to display updated rewards
		// to reflect the bonuses.
		var reward_multiplier = 0;
		if (this.buffs_has('silvertongue')) reward_multiplier = 1.05;
		if (this.buffs_has('gift_of_gab')) reward_multiplier = 1.2;
		
		if (reward_multiplier > 1) {
			reward_multiplier += this.imagination_get_quest_modifier();
		}
		else {
			reward_multiplier = 1.0 + this.imagination_get_quest_modifier();
		}
		
		if(reward_multiplier != 0) {
			if(new_rewards.currants) {
				new_rewards.currants = round_to_5(new_rewards.currants * reward_multiplier);
			} 
			if(new_rewards.xp) {
				new_rewards.xp = round_to_5(new_rewards.xp * reward_multiplier);
			} 
			if(new_rewards.mood) {
				new_rewards.mood = round_to_5(new_rewards.mood * reward_multiplier);
			} 
			if(new_rewards.energy) {
				new_rewards.energy = round_to_5(new_rewards.energy * reward_multiplier);
			} 
			if(new_rewards.favor) {
				for(var i in new_rewards.favor) {
					new_rewards.favor[i].points = round_to_5(new_rewards.favor[i].points * reward_multiplier);
				}
			} 
		}

		if (new_rewards.xp){
			if (!new_rewards.imagination) new_rewards.imagination = 0;
			new_rewards.imagination += new_rewards.xp;
			delete new_rewards.xp;
		}
		
		// Play the super fun sound, if we haven't already:
		if(!quest.played_quest_complete_sound) {
			this.announce_sound('QUEST_COMPLETE', 0, false, true);
			quest.played_quest_complete_sound = true;
		} 

		
		var completion_txt = quest.getCompletion(this);
		if (!completion_txt){
			return {
				args: {
					quest_id: details.quest_id
				},
				done : true,
			};
		}
		
		return {
			txt: completion_txt,
			args: {
				quest_id: details.quest_id,
				rewards : new_rewards,
				quest_complete_convo: true
			},
			
			choices: {
				1: {
					txt		: 'Ok',
					value	: 'quest-complete'
				}
			},
		};
	}
}

function quests_familiar_turnin_do_complete(details){
	this.completeQuest(details.quest_id);
}

function quests_familiar_fail_and_remove(choice, details){
	var status = this.getQuestStatus(details.class_tsid);
	var quest = this.getQuestInstance(details.class_tsid);

	if (status != 'todo' || !quest){
		return {
			txt : "Nevermind!",
			done : true,
		};
	}
	
	this.failQuest(details.class_tsid);

	return {
		'txt': details.txt,
		'args'		: {
			'title'		: quest.getTitle(this)
		},
		'done': true,
	};
}

function quests_instance_via_prompt(value, details) {
	if (!details.quest_id || !details.instance_id) {
		log.error(this+" attempting to enter quest instance via prompt, but using invalid details "+details);
	}
	
	var q = this.getQuestInstance(details.quest_id);
	if (q) {
		q.questInstanceLocation(this, details.instance_id, 
			details.x ? details.x : 0 , details.y ? details.y : 0, details.exit_delay ? details.exit_delay : 5 * 60);
	}
}

function quests_enter_location(tsid, locations_count) {
	if(locations_count >= 302) {
		this.quests_offer('phantom_glitch');
	}
}

function quests_learnt_skill(skill_id){
	
	if (!this.events_has(function(details){ return details.callback == 'quests_learnt_skill_do'; })){
		this.events_add({ callback: 'quests_learnt_skill_do', skill_id: skill_id }, 30);
	}
}

var first_tool_skills = {
	'ezcooking_1': 'knife_and_board', 
	'alchemy_1': 'test_tube', 
	'mining_1': 'pick', 
	'tinkering_1': 'tinkertool', 
	'meditativearts_1': 'focusing_orb'
};
function quests_learnt_skill_do(details){
	var map = config.skills_get_quest_map();
	
	if (map[details.skill_id] && (!this.location.is_newxp || this.location.class_tsid == 'newbie_island') && !this.location.is_skillquest){

		this.quests_offer(map[details.skill_id]);
	}
}

function quests_get_quest_for_unlearnt_skill(skill_id) {
	var map = config.skills_get_quest_map();
	var quest_id = map[skill_id];
	
	var stat = this.getQuestStatus(quest_id);

	//log.info(quest_id+" status "+stat);
	
	// Quests that are in progress or failed get removed until the skill is re-learned
	if (stat == "todo" || stat == "fail_repeat") {
		return quest_id;
	}
	
	return null;
}

// If a skill has been removed, prevent the player from having un-finishable
// quests in their log.
function quests_unlearnt_skill(skill_id){

	var quest = this.quests_get_quest_for_unlearnt_skill(skill_id);
	this.quests_remove(quest);
	
	this.apiSendMsg({type: "quest_remove", tsid: quest});
}

function quests_give_level(){

	if (!this.events_has(function(details){ return details.callback == 'quests_give_level_do'; })){
		this.events_add({ callback: 'quests_give_level_do' }, 30);
	}
}

function quests_level_map(){
	var map = {
		//3 : 'de_embiggenify', // replaced by greedy street spirit
		//3 : 'high_jump',
		4 : 'spread_garlic_love',
		5 : 'numismatic_hustle',
		6 : 'beer_guzzle',
		7 : 'letter_block_2',
		9 : 'brain_freezer',
		10 : 'kindly_randomness',
		11 : 'letter_block_3',
		12 : 'rook_hall_start',
		40 : 'donate_1000_favor_every_giant_one_day'
	};
	
	return map;
}

function quests_give_level_do(details){
	// No quests during newxp
	if ((this.location.is_newxp && this.location.class_tsid != 'newbie_island') || this.location.is_skillquest) return;

	var map = this.quests_level_map();

	//
	// note! we don't currently force these quests,
	// so they'll get offered every time you get some XP
	//

	var xp = this.stats_get_xp();
	var cur = this.stats_calc_level_from_xp(xp);

	for (var i=2; i<=30; i++){
		if(!map[i]) {
			continue;
		}

		var status = this.getQuestStatus(map[i]);

		if (status == 'none'){

			if (i < cur.level){
				this.quests_offer(map[i]);
			}
			if (i == cur.level){

				var span = cur.xp_for_next - cur.xp_for_this;
				var limit = cur.xp_for_this + (0.05 * span);
				
				if (xp >= limit) this.quests_offer(map[i]);
			}
		}
	}

}

function quests_get_complete_count(){
	this.quests_init();

	return num_keys(this.quests.done.quests);
}

function quests_multiplayer_invite(class_tsid){
	var q = this.getQuestInstance(class_tsid);
	if (q){
		this.broadcastActionRequest('quest_accept', class_tsid, 'is looking for a challenger on the quest <b>'+q.getTitle(this)+'</b>.', q.getMaxOpponents());
		
		this['!invite_uid_'+this.tsid] = this.prompts_add({
			txt		: 'Waiting for other players...',
			timeout		: 60,
			choices		: [
				{ value : 'ok', label : 'OK' }
			],
			callback	: 'quests_multiplayer_accept',
			quest_id	: class_tsid,
			challenger	: this.tsid
		});
	
		// Set a timer to fail the request
		this.events_add({callback: 'quests_multiplayer_invite_timeout', class_tsid: class_tsid}, 60);
	}
}

function quests_multiplayer_invite_timeout(details){
	var q = this.getQuestInstance(details.class_tsid);
	if (q){
		if (!q.isFull()){
			
			// Remove prompts
			this.prompts_remove(this['!invite_uid_'+this.tsid]);
			for (var i in q.opponents){
				var opp = getPlayer(i);
				if (opp) opp.prompts_remove(opp['!invite_uid_'+this.tsid]);
			}
			
			
			this.updateActionRequest('was looking for a challenger on the quest <b>'+q.getTitle(this)+'</b>.', 0);
			this.cancelActionRequestBroadcast('quest_accept', q.class_tsid);
			this.failQuest(q.class_tsid);
			
			this.prompts_add({
				txt		: 'Not enough players accepted your challenge. Try again later?',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' },
				]
			});
		}
	}
}

function quests_multiplayer_accept(value, details){
	if (value == 'yes'){
		var challenger = getPlayer(details.challenger);
		if (!challenger || challenger.tsid == this.tsid) return;
		
		var q = challenger.getQuestInstance(details.quest_id);
		if (!q) return;
		
		if (q.isFull() || !q.isStarted()){
			this.prompts_add({
				txt		: 'Sorry, you were not quite fast enough to join '+challenger.label+' on the '+q.getTitle(this)+' quest.',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' },
				]
			});
		}
		else{			
			q.addOpponent(this);
		}
	}
}

function quests_multiplayer_ready(){
	if (this.location.is_race){
		this.location.race_player_ready(this);
	}
}

function quests_multiplayer_leave_prompt(delay){
	var details = {
		txt		: 'Ready to leave?',
		callback	: 'quests_multiplayer_leave',
		timeout		: 0,
		choices		: [
			{ value : 'ok', label : 'OK' },
		]
	};

	if (delay){
		this.prompts_add_delayed(details, delay);
	}
	else{
		this.prompts_add(details);
	}
}

function quests_multiplayer_leave(value, details){
	if (this.location.is_race && value == 'ok'){
		this.overlay_dismiss('race_waiting');
		this.overlay_dismiss('race_results');
		this.instances_exit(this.location.instance_id);
	}
	else if (this.location.is_race){
		this.quests_multiplayer_leave_prompt(30);
	}
}

function quests_get_from_location(location_tsid) {
	var loc_quests = {};
	loc_quests.in_loc = [];
	loc_quests.not_in_loc = [];
	
	for(var i in this.quests.todo.quests) {
		var quest = this.quests.todo.quests[i];
		if(!quest.is_started || quest.is_failed) {
			continue;
		}
		
		for(var j in quest.locations) {
			if((config.is_dev && quest.locations[j].dev_tsid == location_tsid) ||
			   (config.is_prod && quest.locations[j].prod_tsid == location_tsid)) {
				loc_quests.in_loc.push({quest: quest, location: j});
			} else {
				loc_quests.not_in_loc.push({quest: quest, location: j});				
			}
		}
	}
	
	return loc_quests;
}

function quests_tower_part2_accepted(){
	this.overlay_dismiss('its_cool');	
	this.events_add({ callback: 'instances_create_delayed', tsid: 'LCR8MQ9JJI12IIK', instance_id: 'tower_quest_headspace', x: -911, y: -410, exit_delay: 2*60, options: {no_auto_return: true}}, 0.1);
}

function rainbow_run_ready() {
	log.info("Sending 321 overlay...");
	// Ready to go, do 321 overlay.
	this.apiSendAnnouncement({
		type: 'vp_overlay',
		duration: 3500,
		swf_url: overlay_key_to_url('321_countdown'),
		locking: true,
		dismissible: false,
		x: '50%',
		top_y: '50%',
		width: 350,
		height: 350,
		uid: 'rainbow_run_start'
	});
	
	this.apiSetTimer('rainbow_run_start', 4000);
}

function rainbow_run_start() {
	this['!race_quoins_collected'] = 0;
	this['!doing_rainbow_run'] = true;
	this['!rainbow_run_left'] = 30;
//	this.buffs_apply('rainbow_run');	

	this.rainbow_run_overlay();
	this.announce_music('FUTURE_SWING_30');
	
	this.apiSetTimer('rainbow_run_over', 30*1000);
	this.apiSetTimer('rainbow_run_count', 1000);
}

function rainbow_run_overlay() {
	if(!this['!doing_rainbow_run']) {
		return;
	}

    var count = (this['!rainbow_run_left'] > 9 ? "" : "0" ) + this['!rainbow_run_left'];
	this.overlay_dismiss('rainbow_counter');
	this.apiSendAnnouncement({
		uid: 'rainbow_counter',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '65%',
		top_y: '25%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p align="right"><span class="overlay_counter">Coins<br />'+this['!race_quoins_collected']+'/30<br /><br />Time<br />0:'+count+'</span></p>'
		]
	});
}

function rainbow_run_count() {
	this['!rainbow_run_left']--;	
	
	if(this['!rainbow_run_left'] > 0) {
		this.rainbow_run_overlay();
		this.apiSetTimer('rainbow_run_count', 1000);		
	}
}

function rainbow_run_over() {
	delete this['!doing_rainbow_run'];
	
	if(this['!race_quoins_collected'] >= 30) {	
		this.apiSetTimer('rainbow_run_victory', 2500)
		this.show_rainbow('rainbow_youdidit');
		this.playEmotionAnimation('happy');
	} else {
		var resultText = '<p align="center"><span class="nuxp_vog">Failure!</span><br><span class="nuxp_vog_smaller">How embarrassing.</span></p>'	
		this.apiSendAnnouncement({
			uid: "rainbow_run_over",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: true,
			text: [resultText],
			done_payload: {
				function_name: 'rainbow_run_exit'
			}
		});	
	}

	this.overlay_dismiss('rainbow_counter');

}

function rainbow_run_victory() {
	var resultText = '<p align="center"><span class="nuxp_vog">Success!</span><br><span class="nuxp_vog_smaller">You got them coins but good.</span></p>'
	
	this.apiSendAnnouncement({
		uid: "rainbow_run_over",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: true,
		text: [resultText],
		done_payload: {
			function_name: 'rainbow_run_exit'
		}
	});	
}

function rainbow_run_exit(details) {
	this.announce_music_stop('FUTURE_SWING_30');
	this.instances_exit('rainbow_run');	
}

function hub_plant_beans_init() {
	this.hub_plant_beans = {};
}

function hub_plant_beans_add(hubid) {
	if(!this.hub_plant_beans) {
		return;
	}
	if(!this.hub_plant_beans[hubid]) {
		this.hub_plant_beans[hubid] = 0;
		
		this.quests_inc_counter('hub_plant_beans', 1);
	} 
	this.hub_plant_beans[hubid]++;	
}

function hub_plant_beans_end() {
	if(this.hub_plant_beans) {
		delete this.hub_plant_beans;
	}
}

function betterlearning_favor_init() {
	this.betterlearning_favor = {};
}

function betterlearning_favor_add(giant, amt) {
	if(!this.betterlearning_favor) {
		return;
	}
	
	if(!this.betterlearning_favor[giant]) {
		this.betterlearning_favor[giant] = 0;
	}
	
	if(this.betterlearning_favor[giant] < 23 && (this.betterlearning_favor[giant] + amt) >= 23) {
		this.quests_inc_counter('favor_unique_shrines', 1);
	}
	
	this.betterlearning_favor[giant] += amt;
}

function betterlearning_favor_end() {
	if(this.betterlearning_favor) {
		delete this.betterlearning_favor;
	}
}

// If a player gets a hideously broken quest somehow on their DC, this will kill it.
function quests_emergency_delete(status, quest) {
	if(this.quests[status]) {
		if (this.quests[status].quests[quest]) {
			this.quests[status].quests[quest].apiDelete();
		}
		delete this.quests[status].quests[quest];
		return {ok: 1};
	} else {
		return {ok: 0};
	}
}

function clean_race_quests() {
	var race_quests = ['amazing_race', 'canyon_run', 'crystal_climb', 'grab_em_good', 'hogtie_piggy', 'lava_leap', 'space_race', 'star_sprint', 'time_warp'];
	
	for (var i in race_quests) {
		this.quests_emergency_delete('todo', race_quests[i]);
	}
}

// To fix people who get the rook_hall quest stuck. 
function fix_rook_hall() { 
	if (this.quests.fail_repeat){
		for (var i in this.quests.fail_repeat.quests){
			if (this.quests.fail_repeat.quests[i].class_id == 'rook_hall'){
				this.quests.done.quests['rook_hall'] = this.quests.fail_repeat.quests[i];
				delete this.quests.fail_repeat.quests[i];
				return;
			}
		}
	}
}

function fix_letterblock_quests() {
	if (this.getQuestStatus('letter_block_2') != "done") {
		var stat = this.getQuestStatus('letter_block_3')
		if (stat != "none" && stat != "done") {
			if (this.location.isInstance('kids_room')) {
				this.instances_exit('kids_room');				
			}
			this.quests_remove('letter_block_3');
			log.info("Found broken letter block quest on player "+this+". Fixing.");
			return {ok: 1, fixed: 1};
		}
	}
	
	return {ok: 1, fixed: 0};
}

function fix_prereq_quests(){
	if (this.getQuestStatus('intermediateadmixing_make_powder') == 'done' && this.getQuestStatus('intermediateadmixing_make_more_powders') == 'none'){
		this.quests_offer('intermediateadmixing_make_more_powders');
	}

	if (this.getQuestStatus('mining_mine_rocks') == 'done' && this.getQuestStatus('help_mine') == 'none'){
		this.quests_offer('help_mine');
	}
}

function esquibethEnd() { 
	delete this.end_esquibeth;
}

function conchReset() {
	delete this.has_blown_conch;
}

function countAcceptedQuests(){
	this.quests_init();

	var count = 0;
	for (var i in this.quests.todo.quests){
		if (this.quests.todo.quests[i].accepted) count++;
	}

	return count;
}