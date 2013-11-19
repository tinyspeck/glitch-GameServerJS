//#include quest_scripting.js

log.info("loading quest.js");

var is_job = false;
var title = 'Quest title (please override!)';
var desc = 'Quest description (please override!)';
var offer = 'Offer text';
var completion = 'Completion text';
var start = null;
var thanks = null;
var no_progress = null;

var button_accept = 'Ok, I\'ll do it!';
var button_decline = 'Not right now';
var button_turnin = 'Ok';
var button_noturnin = 'Back';
var button_started = 'OK, I AM STARTING NOW';	// not yet used
var button_thanks = 'Thanks!';	// only used for automatic-completion quests

var performance_text = "You were the {job_performance} biggest contributor to this project. Impressive.";
var participation_text = "You contributed {job_participation}% of the work we needed. Good job!";

var auto_complete = 0;
var is_tracked = 1;
var accepted = 0;

var is_emergency = 0;
var is_multiplayer = 0;

var is_repeatable = 0;

var prereq_quests = [];
var end_npcs = [];

function onStart(pc, is_npc, auto_accept){
	this.is_npc_offered = is_npc ? true : false;
	this.ts_start = time();
	this.req_states = {};
	this.req_not_applied = {};
	this.is_complete = false;
	this.is_started = false;
	this.is_failed = false;
	
	if (this.onCreate) this.onCreate(pc);
	
	this.decide_requirements(pc);
	
	this.init_reqs(pc);
	
	if (auto_accept){
		log.info(pc+' Auto-accepting quest '+this.class_id);
		this.onAccept(pc);
	}
	else{
		pc.quests_send_state(this, 'offered');
	}
}

function onAccept(pc){
	this.accepted = true;
	if (this.doProvided) this.doProvided(pc);
//	if (!this.onStarted && !this.is_multiplayer) this.is_started = true;
	if (!this.onStarted) this.is_started = true;

	this.init_reqs(pc);
	
	if (this.onAccepted) this.onAccepted(pc);
	
	pc.quests_send_state(this, 'accepted');
	
	this.checkCompletion(pc);
	
	if(this.is_multiplayer) {
		this.onRestart(pc);
	}
}

function onRestart(pc){
	if (this.onStarted){
		var ret = {};
		if (pc.is_dead && (!this.canStartInHell || !this.canStartInHell())){
			this.is_started = false;
			this.is_failed = true;
			return {
				ok: 0,
				quest: this,
				error: "You are dead!"
			};
		}else{
			ret = this.onStarted(pc);
			if (ret.ok){
				this.is_started = true;
				this.is_failed = false;
	
				this.init_reqs(pc);
				
				if (this.onAccepted) this.onAccepted(pc);

				pc.quests_send_state(this, 'accepted');
			}
		}
		ret.quest = this;
		return ret;
	}
	else if (this.is_multiplayer){
		if (num_keys(pc.location.getActivePlayers()) <= 1){
			return {
				ok: 0,
				quest: this,
				error: "There are no players here to challenge!"
			};
		}
		
		// Decide which one we're doing
		var locations = utils.copy_hash(config.multiplayer_quest_locations[this.class_tsid]);
		if (!locations || !locations.length){
			return {
				ok: 0,
				quest: this,
				error: "Uh-oh. I can't find my thing!"
			};
		}
		
		var loc = choose_one(locations);
		//log.info(this+' setting location to '+loc);
		this.multiplayer_location = loc;
		
		// Send out the invite
		this.is_started = true;
		this.opponents = [];
		pc.quests_multiplayer_invite(this.class_tsid);
		
		if (this.onAccepted) this.onAccepted(pc);
		
		return {
			ok: 1,
			quest: this
		};
	}
	
	return false;
}

function onFail(pc){
	this.init_reqs(pc, true);
	this.is_failed = true;
	this.is_started = false;
	
	if (this.is_multiplayer){
		this.opponents = [];
	}

	if (typeof this.onFailed == 'function'){
		this.onFailed(pc);
	}
}

function makeComplete(pc){
	this.init_reqs(pc);

	var rs = this.requirements;

	for (var i in rs){
		var num = rs[i].num ? rs[i].num : 1;
		this.req_states[i] = num;
	}

	this.is_complete = true;
	this.ts_done = time();
}

function getTitle(pc){
	var title = this.title;
	if (this.is_job){
		if (this.type == 3) return "Build a Group-owned Location";

		// Check for an override
		var street_info = this.owner.jobs_get_street_info(this.instance_id);
		if (street_info && street_info.title_override) title = street_info.title_override;
	}
	return this.expandText(title, pc);
}

function getDesc(pc){
	var desc = this.desc;
	if (this.is_job){
		if (this.type == 3) return "You will be building a location that belongs to one of your groups. Once completed, only group members will be able to access it -- like your own private country club! Careful, though... once claimed, your group will have a limited amount of time to complete the project or lose everything it has contributed.";

		if (this.type == 5 && this.class_tsid == 'job_proto_door'){
			desc = "A new floor is under construction!<br />Complete this project to gain access.";
			return desc;
		}
		else if (this.type == 5 && this.spirit_tsid){
			var offerer = apiFindObject(this.spirit_tsid);
			if (offerer){

				var class_ids = offerer.getEndItems ? offerer.getEndItems() : null;
				if (class_ids && class_ids.length > 0){
					var end_item_class = utils.trim(choose_one(class_ids));
					var end_item = apiFindItemPrototype(end_item_class);
					if (end_item){
						if (end_item_class == 'furniture_tower_chassis'){
							desc = "Create a "+end_item.name_single+" here!";
						}
						else{
							desc = "This <a href=\"event:item|"+end_item_class+"\">"+end_item.name_single+"</a> has been depleted!<br />Complete this project to restore it to its youthful state.";
						}
						return desc;
					}
				}
			}
		}

		// Check for an override
		var street_info = this.owner.jobs_get_street_info(this.instance_id);
		if (street_info && street_info.desc_override) desc = street_info.desc_override;
	}
	return this.expandText(desc, pc);
}

function getOffer(pc){ return this.expandText(this.offer, pc); }
function getCompletion(pc){
	if (this.silent_complete){
		return this.expandText(this.completion, pc);
	}
	return this.expandText(this.completion, pc);
}
function getStart(pc){ return this.expandText(this.start, pc); }
function getThanks(pc){ return this.expandText(this.thanks, pc); }

function expandText(text, pc){
	//text = text.replace(/{class}/, pc.characterClassString());
	text = text.replace(/{pc_label}/g, pc ? pc.getLabel() : 'UNKNOWN');
	
	if (this.is_job){
		var my_position = 0;
		if (pc){
			var sorted = this.getSortedContributors();
			for (var i=0; i<sorted.length; i++){
				if (sorted[i].pc_tsid == pc.tsid){
					my_position = i+1;
					break;
				}
			}
		}
		
		var total_bc = this.getTotalBasecost();
		
		var phase = this.owner.jobs_get_phase_options(this.instance_id, this.class_tsid);
		
		text = text.replace(/{job_phase}/g, numberth_word(phase.in_order));
		text = text.replace(/{job_phase_label}/g, phase.label);
		text = text.replace(/{job_location}/g, this.primary_location ? this.primary_location.label : 'UNKNOWN');
		if (my_position == 1){
			text = text.replace(/{job_performance} /g, '');
		}
		else{
			text = text.replace(/{job_performance}/g, my_position ? numberth(my_position) : 'UNKNOWN');
		}
		text = text.replace(/{job_participation}/g, my_position ? (Math.round(sorted[my_position-1].base_cost / total_bc * 10000) / 100) : 'UNKNOWN');
	}
	return text;
}

function canOffer(pc){
	// this function checks for any complex prereqs
	if (this.is_job){
		var prev = this.owner.jobs_get_previous_phase(this.instance_id);
		if (!prev) return 1;
		
		var current = this.owner.jobs_get_current_phase(this.instance_id);
		if (!current) return 0; // Shouldn't happen?
		
		if (prev.instance.ts_done > time() - current.delay_seconds){
			return 0;
		}
		
		return 1;
	}
	else{
		return 1;
	}
}

// Is this multiplayer quest full?
function isFull(){
	//log.info(this+'isFull: '+this.opponents.length+' < '+this.multiplayer_location.num_players);
	if (this.getOpponentCount() < this.getMaxOpponents()){
		return false;
	}
	
	return true;
}

function getOpponentCount(){
	if (this.is_multiplayer && this.opponents){
		return this.opponents.length;
	}
	else{
		return 0;
	}
}

function getMaxOpponents(){
	if (this.is_multiplayer && this.multiplayer_location){
		return this.multiplayer_location.num_players-1;
	}
	else{
		return 0;
	}
}

// Add an opponent to this quest
function addOpponent(pc){
	this.opponents.push(pc.tsid);
		
	// Do we have enough now?
	if (this.isFull()){
		this.owner.updateActionRequest('was looking for a challenger on the quest <b>'+this.getTitle(pc)+'</b>. '+pc.linkifyLabel()+' accepted.', this.getOpponentCount());
		this.owner.cancelActionRequestBroadcast('quest_accept', this.class_tsid);
		
		var opponent_names = [];
		opponent_names.push(this.owner.label);
		for (var i in this.opponents){
			
			var opp = getPlayer(this.opponents[i]);
			if (opp){
				opponent_names.push(opp.label);
			}
		}
		
		var pretty_opponents = pretty_list(opponent_names, ' and ');
	
		// Remove waiting prompts, add starting prompts!
		this.owner.prompts_remove(this.owner['!invite_uid_'+this.owner.tsid]);
		this.owner.apiSendAnnouncement({
			uid: "race_start_delay",
			type: "vp_overlay",
			duration: 5000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">Starting the race between '+pretty_opponents+' in 5 seconds!</span></p>'
			]
		});
		
		
		for (var i in this.opponents){			
			var opp2 = getPlayer(this.opponents[i]);
			if (opp2){
				opp2.prompts_remove(opp['!invite_uid_'+this.owner.tsid]);
				opp2.removeActionRequestReply(this.owner);
				opp2.apiSendAnnouncement({
					uid: "race_start_delay",
					type: "vp_overlay",
					duration: 5000,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog">Starting the race between '+pretty_opponents+' in 5 seconds!</span></p>'
					]
				});
			}
		}
		
		// Start it up
		this.apiSetTimer('onMultiplayerStart', 5*1000);
	}
	else{
		this.owner.updateActionRequest(null, this.getOpponentCount());
		
		pc['!invite_uid_'+this.owner.tsid] = pc.prompts_add({
			txt		: 'Waiting for other players...',
			timeout		: 60,
			choices		: [
				{ value : 'ok', label : 'OK' }
			],
			quest_id	: this.class_tsid,
			challenger	: this.owner.tsid
		});
	}
}

function removeOpponent(pc){
	if (!in_array(pc.tsid, this.opponents)) return;
		
	array_remove_value(this.opponents, pc.tsid);

	this.owner.updateActionRequest(null, this.getOpponentCount());
		
	pc.prompts_remove(pc['!invite_uid_'+this.owner.tsid]);
}

function onMultiplayerStart(){
	// Create the instance
	var players = this.opponents;
	players.push(this.owner.tsid);
	var instance = this.owner.instances_create(this.class_tsid, this.multiplayer_location.tsid, {}, {is_race: true, race_players: players, race_type: this.multiplayer_location.race_type, quest_desc: this.desc, quest_owner: this.owner.tsid});
	
	for (var i in this.opponents){
		var pc = getPlayer(this.opponents[i]);
		if (pc) pc.instances_add(this.class_tsid, instance);
	}
	
	// Determine starting positions
	var players_per_position = this.multiplayer_location.num_players / this.multiplayer_location.start_points.length;
	//log.info('Players per position: '+players_per_position);
	var positions = this.multiplayer_location.start_points;
	//log.info('Positions: '+positions);
	
	// Send players
	for (var i in players){
		var pc = getPlayer(players[i]);
		
		if (pc){
			var pos_index = randInt(0, this.multiplayer_location.start_points.length-1);
			var position = positions[pos_index];
			if (!positions[pos_index].player_count) positions[pos_index].player_count = 0;
			positions[pos_index].player_count++;
			//log.info(pc+' got '+positions[pos_index]);
			if (positions[pos_index].player_count == players_per_position) array_remove(positions, pos_index);
		
			pc.instances_enter(this.class_tsid, position.x, position.y);
		}
	}

	// Delete a ticket?
	if (this.ticket_tsid){
		var ticket = apiFindObject(this.ticket_tsid);
		if (ticket) ticket.apiConsume(1);
	}
}

function isEmergency(){
	return this.is_emergency;
}

function isMultiplayer(){
	return this.is_multiplayer;
}

function isDone(pc){
	return this.is_complete;
}

function isStarted(pc){
	return this.is_started;
}

function tryComplete(pc){
	// this function attempts to complete the quest
	// and returns whether it was completed

	var reqs = this.requirements;
	for (var i in reqs){
		var req = reqs[i];
		if (req.type == 'item' && req.remove){
			var test = pc.items_destroy_multi([[req.class_id, req.num]]);
			if (!test){
				// not much we can do!
			}
		}
	}

	return 1;
}

function onComplete(pc){
	// this function is run after completion to give
	// any rewards, etc
}

function doComplete(pc){
	// don't override this one

	if (this.tryComplete(pc)){
		// Run this on a timer to avoid race conditions
		this.apiSetTimerX('onComplete', 500, pc);
		
		// no need to send notifications here - the function in player.js
		// that calls here will deal with it based on various rules
		return 1;
	}

	return 0;
}

function completeRequirementFlag(pc, flag_name){

	this.req_flags[flag_name] = 1;
	if (this.auto_complete) pc.completeQuest(this.class_id);
}

function getWaitingText(pc){

	if (!this.progress.length){
		if (this.no_progress && this.no_progress != "null"){
			return this.no_progress;
		}
		else{
			return "If you're trying to complete quest <b>"+this.getTitle(pc)+"</b> you've still got work to do.";
		}
	}

	if (this.waitCount){
		this.waitCount++;
	}else{
		this.waitCount = 1;
	}

	var idx = this.waitCount > this.progress.length ? this.progress.length - 1 : this.waitCount - 1;

	return this.progress[idx];
}

function getGiverWaitingText(){

	if (!this.giver_progress.length) return null;

	if (this.giverWaitCount){
		this.giverWaitCount++;
	}else{
		this.giverWaitCount = 1;
	}

	var idx = this.giverWaitCount > this.giver_progress.length ? this.giver_progress.length - 1 : this.giverWaitCount - 1;

	return this.giver_progress[idx];
}

function deleteMe(){

	// override if you have anything extra to free up
	this.apiDelete();
}

function changed_item(pc, class_tsid){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];

		if (r.type == 'item' && r.class_id == class_tsid){
			this.update_requirement(pc, i);
		}
	}
}

function made_recipe(pc, recipe_id, num){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];

		if (r.type == 'make' && r.recipe_id == recipe_id){
			this.inc_requirement(pc, i, num);
		}
	}
}

function inc_counter(pc, counter, num){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'counter' && r.name == counter){
			this.inc_requirement(pc, i, num);
		}
	}
}

function set_counter(pc, counter, num){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'counter' && r.name == counter){
			this.set_requirement(pc, i, num);
		}
	}
}

function get_counter_value(pc, counter){

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'counter' && r.name == counter){
			return intval(this.req_states[i]);
		}
	}

	return 0;
}

function set_flag(pc, flag){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'flag' && r.name == flag){
			this.set_requirement(pc, i, 1);
		}
	}
}

// Note: this returns true or false even though the flags are actually stored as 1 or 0.
function get_flag(flag){

	if (!this.is_started) return false;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'flag' && r.name == flag){
			return (this.req_states[i] > 0);
		}
	}
}

function decide_requirements(pc) {
	for (var i in this.requirements) {
		var r = this.requirements[i];
		if (r.apply_test) {
			log.info("Apply test exists for requirement "+r);
			if (!r.apply_test(pc, this)) {
				log.info("Apply test failed for requirement "+r);
				this.req_disable(i);
			} else {
				log.info("Apply test succeeded for requirement "+r);
			}
		}
	}
}

function update_requirement(pc, rid, force_announce){

	//log.info('requirement '+rid+' needs updated for player '+pc.label);

	var r = this.requirements[rid];

	// If the requirement is applied conditionally, do not update it unless the test succeeds.
	if(this.req_is_disabled(rid)) {
		return;
	}
	
	var new_state = this.get_req_state(pc, r);

	apiLogAction('QUEST_REQ_UPDATE', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'req='+rid, 'state='+new_state);

	if (new_state != this.req_states[rid] || force_announce){

		//log.info('--- state has changed from '+this.req_states[rid]+' to '+new_state);
		var old_state = this.req_states[rid];
		this.req_states[rid] = new_state;

		this.announceStateChange(pc, rid, new_state, new_state - old_state);
	}else{
		//log.info('--- state remains the same');
	}
}

function inc_requirement(pc, rid, num){

	var r = this.requirements[rid];
	
	// If the requirement is applied conditionally, do not update it unless the test succeeds.
	if(this.req_is_disabled(rid)) {
		return;
	}
	
	var orig = intval(this.req_states[rid]);

	// already made enough?
	if (orig >= r.num) return 0;

	// increment until over cap
	this.req_states[rid] = orig + num;
	if (this.req_states[rid] > r.num) this.req_states[rid] = r.num;
	
	var delta = intval(this.req_states[rid]) - orig;

	apiLogAction('QUEST_REQ_INC', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'req='+rid, 'delta='+delta);

	this.announceStateChange(pc, rid, this.req_states[rid], delta);
	
	return delta;
}

function set_requirement(pc, rid, value){

	if (value === undefined) value = 1;

	var r = this.requirements[rid];

	// If the requirement is applied conditionally, do not update it unless the test succeeds.
	if(this.req_is_disabled(rid)) {
		return;
	}

	// already set?
	if (this.req_states[rid] == value) return;
	var orig = intval(this.req_states[rid]);

	this.req_states[rid] = value;

	var delta = intval(this.req_states[rid]) - orig;

	apiLogAction('QUEST_REQ_SET', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'req='+rid, 'delta='+delta);

	this.announceStateChange(pc, rid, this.req_states[rid], delta);
}

function init_reqs(pc, force_announce){

	var rs = this.requirements;

	if (!this.req_states) this.req_states = {};

	for (var i in rs){
		this.req_states[i] = 0;

		// There are some reqs that we might want to "complete" at quest start time. Check them here
		if (pc){
			this.update_requirement(pc, i, force_announce);

			if (rs[i].type == 'flag' && rs[i].name.substr(0, 9) == 'acquired_'){
				if (pc.items_has(rs[i].name.substr(9), 1)) this.set_requirement(pc, i, 1);
			}
			else if (rs[i].type == 'item'){
				this.inc_requirement(pc, i, pc.countItemClass(rs[i].class_id));
			}
		}
	}
}

function get_req_state(pc, r){

	if (r.type == 'item'){

		var num = pc.countItemClass(r.class_id);

		return num > r.num ? r.num : num;
	}

	return 0;
}

function req_is_disabled(r) {
	if (!this.req_not_applied) {
		return false;
	} else {
		return this.req_not_applied[r];
	}
}

function req_disable(r) {
	if (!this.req_not_applied) {
		this.req_not_applied = {};
	}
	
	this.req_not_applied[r] = 1;
}

function requirementIsCounter(r){
	if (r.type == 'item') return 1;
	if (r.type == 'make') return 1;
	if (r.type == 'counter') return 1;
	if (r.type == 'currants') return 1;
	if (r.type == 'work') return 1;
	return 0;
}

function announceStateChange(pc, rid, state, delta){
	if (!pc) return;

	var r = this.requirements[rid];
	
	this.checkCompletion(pc);
		
	if (this.is_job){
		var rsp = {
			'type'		: 'job_req_state',
			'job_id'	: this.class_tsid,
			'req_id'	: rid,
			'status'	: this.get_requirement_status(rid),
			'contribute_count' : intval(delta),
			'is_work'	: (r.type == 'work' ? true : false),
			'class_id'	: r.type == 'currants' ? 'money_bag' : r.class_id,
			'mission_accomplished' : this.is_complete,
		};
	}
	else{
		var rsp = {
			'type'		: 'quest_req_state',
			'quest_id'	: this.class_tsid,
			'req_id'	: rid,
			'status'	: this.get_requirement_status(rid),
			'mission_accomplished' : this.is_complete,
			'no_delay'	: (r.no_delay && r.no_delay == 1)? true: false,
		};
	}
	
	pc.apiSendMsg(rsp);
}

function is_requirement_complete(r, state){

	if (r.type == 'item'){
		return state >= r.num;
	}

	if (r.type == 'make'){
		return state >= r.num;
	}
	
	if (r.type == 'counter'){
		return state >= r.num;
	}
	
	if (r.type == 'flag'){
		return state;
	}
	
	if (r.type == 'currants'){
		return state >= r.num;
	}
	
	if (r.type == 'work'){
		return state >= r.num;
	}

	return false;
}

function checkCompletion(pc){
	
	if (!this.is_job && (!this.accepted || !this.is_started)) return;

	if (!this.req_states) this.init_reqs(pc, false);

	// called when one or more requirements have been updated
	// and we might need to toggle completion status.

	var test_complete = true;
	
	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];

		// If the requirement is applied conditionally, do not consider it for completion unless the test succeeds.
		if(this.req_is_disabled(i)) {
			continue;
		}

		if (!this.is_requirement_complete(r, this.req_states[i])){
			test_complete = false;
		}
	}

	if (test_complete != this.is_complete){

		this.is_complete = test_complete;

		if (this.onJustCompleted) this.onJustCompleted(pc);

		if (this.is_complete){
			//pc.sendActivity("[QUEST] Completed!");
			
			if (this.is_job){
				this.onJobComplete(pc);
			}

			if (pc && this.familiar_turnin){
				pc.quests_familiar_turnin(this.class_tsid);
			}
		}else{
			//pc.sendActivity("[QUEST] Not completed :(");

			if (pc && this.familiar_turnin){
				pc.quests_familiar_turnin_cancel(this.class_tsid);
			}
		}
	}
	/*else if (this.is_complete && test_complete && !this.ts_done){
		if (this.is_job){
				this.onJobComplete(pc);
		}

		if (pc && this.familiar_turnin){
			pc.quests_familiar_turnin(this.class_tsid);
		}
	}*/

	return test_complete;
}

function get_status(pc, state){

	//
	// return the status of this quest in a player's
	// quest log.
	//

	var ret = {};

	ret.title = this.get_full_title(pc);
	ret.desc = this.get_full_description(pc);

	ret.is_emergency = this.isEmergency();

	ret.reqs = {};
	var total_req_bc = 0;
	var got_req_bc = 0;

	function is_tool(it, args){ return it.is_tool && it.isWorking() && it.class_tsid == args ? true : false; }

	for (var i in this.requirements){
		var r = this.requirements[i];
		
		if (this.is_job){
			if (!ret.reqs[r.bucket_id]) ret.reqs[r.bucket_id] = {};
			if (!ret.reqs[r.bucket_id][r.group_id]) ret.reqs[r.bucket_id][r.group_id] = {};
			
			var req = this.get_requirement_status(i);
			
			if (pc && this.requirements[i].type == 'work'){
				var has_tool = false;
				if (r.class_ids){
					for (var t in r.class_ids){
						var tool = pc.findFirst(is_tool, r.class_ids[t]);
						if (tool){
							has_tool = true;
							break;
						}
					}
				}
				else{
					var tool = pc.findFirst(is_tool, r.class_id);
					if (tool){
						has_tool = true;
					}
				}
			
				if (!has_tool){
					var proto = apiFindItemPrototype(r.class_id);
					req.disabled = true;
					req.disabled_reason = "You don't have a working "+proto.name_single+".";
				}
				else{
					if (r.skill && !pc.skills_has(r.skill)){
						req.disabled = true;
						req.disabled_reason = "You don't know "+pc.skills_get_name(r.skill)+".";
					}
				}
			}
		
			total_req_bc += intval(req.need_num) * intval(req.base_cost);
			got_req_bc += intval(req.got_num) * intval(req.base_cost);
			
			ret.reqs[r.bucket_id][r.group_id][i] = req;
		}
		else{
			
			// If the requirement is applied conditionally, do not send it out on status hashes unless the test succeeds.
			if(this.req_is_disabled(i)) {
				continue;
			}

			ret.reqs[i] = this.get_requirement_status(i);
		}
	}
	
	ret.rewards = this.rewards;

	ret.complete = this.is_complete ? true : false;
	ret.started = this.is_started ? true : false;
	ret.offered_time = this.ts_start;
	ret.failed = this.is_failed ? true : false;
	
	if (this.is_job){
		ret.finished = ret.complete;
		ret.ts_first_contribution = this.ts_first_contribution;
		ret.startable = false;
		ret.accepted = pc ? pc.jobs_has(this.primary_location.tsid, this.class_id) : false;
		
		ret.perc = total_req_bc ? (Math.floor(got_req_bc / total_req_bc * 1000) / 1000) : 0; //total percentage of job completion (to 3 decimal places)
		
		ret.options = (this.type == 2 || this.type == 4 || this.type == 6) ? this.getOptions() : [];
		ret.type = 'regular';
		if (this.type == 3 || this.type == 4) ret.type = 'group_hall';
		if (this.type == 5){
			if (this.class_tsid == 'job_proto_door'){
				ret.type = 'add_floor';
			}
			else{
				ret.type = 'restore';
			}
		}
		
		ret.performance_percent = this.performance_percent;
		ret.performance_cutoff = this.performance_cutoff;
		ret.performance_rewards = this.performance_rewards;
		
		ret.has_contributed = this.hasPlayerContributed(pc);
		ret.instance_id = this.instance_id;
		
		ret.is_available = this.canOffer(pc) ? true : false;
		
		if (!ret.is_available){
			var previous = this.owner.jobs_get_previous_phase(this.instance_id);
			if (previous){
				var current = this.owner.jobs_get_current_phase(this.instance_id);
				ret.total_delay_time = intval(current.delay_seconds);
				ret.time_until_available = intval(current.delay_seconds) - (time() - intval(previous.instance.ts_done));
				ret.delay_text = current.delay_text;
			}
		}
		
		ret.phases = [];
		var phases = this.owner.jobs_get_phases(this.instance_id);
		for (var i in phases){
			ret.phases.push({
				name: phases[i].label ? phases[i].label : ret.title,
				is_complete: phases[i].instance ? phases[i].instance.isDone() : false
			});
		}

		if (this.claimable){
			var previous = this.owner.jobs_get_previous_phase(this.instance_id);
			if (previous){
				if (!this.claimer) this.claimer = previous.instance.claimer;
				if (!this.group) this.group = previous.instance.group;
			}

			if (!this.claimer){
				ret.owner = {};
			}
			else {
				ret.owner = this.claimer.make_hash();
				if (this.group){
					ret.group = this.group.get_basic_info();
					ret.group.is_member = pc ? this.group.is_member(pc) : false;
				}
			}

			ret.claim_reqs = {};
			for (var i in this.claim_reqs){
				ret.claim_reqs[i] = this.get_requirement_status(i);
			}

			ret.custom_name = this.job_user_name ? this.job_user_name : '';
		}
		else{
			var previous = this.owner.jobs_get_previous_phase(this.instance_id);
			if (previous && previous.instance && previous.instance.claimable){
				this.claimable = 1;
				if (!this.claimer) this.claimer = previous.instance.claimer;
				if (!this.group) this.group = previous.instance.group;
			}
		}

		if (this.duration) ret.duration = this.duration;
		if (this.job_timeout) ret.timeout = this.job_timeout;
	}
	else{
		ret.finished = state == 'todo' ? false : true;

		ret.startable = this.onStarted ? true : false;
		ret.accepted = this.accepted ? true : false;
		ret.offer_immediately = this.offer_immediately ? true : false;
	}
	
	if (ret.complete) ret.ts_done = this.ts_done;
	
	if (!this.is_npc_offered){
		ret.offer_conversation = {
			txt		: this.getOffer(pc),
			choices		: {}
		};
	
		if (ret.startable){
			ret.offer_conversation.choices = {
				"1": {
					value: "accept_and_start",
					txt: this.button_accept
				},
				"2": {
					value: "accept",
					txt: this.button_decline
				}
			};
		}
		else{	
			ret.offer_conversation.choices = {
				"1": {
					value: "accept",
					txt: this.button_accept
				}
			};
		}
	}

	return ret;
}

function get_percentage_complete(){
	if (!this.is_job) return 0;

	var total_req_bc = 0;
	var got_req_bc = 0;

	for (var i in this.requirements){

		var req = this.get_requirement_status(i);
			
		total_req_bc += intval(req.need_num) * intval(req.base_cost);
		got_req_bc += intval(req.got_num) * intval(req.base_cost);
	}

	return total_req_bc ? (Math.floor(got_req_bc / total_req_bc * 1000) / 1000) : 0;
}

function get_requirement_status(rid){

	var r = this.requirements[rid];
	if (!r && this.claim_reqs) r = this.claim_reqs[rid];

	var is_count = this.requirementIsCounter(r);

	var need_num = 1;
	var got_num = this.req_states ? intval(this.req_states[rid]) : 0;
	if (is_count) need_num = intval(r.num);

	if (got_num > need_num) got_num = need_num;
	var completed = (got_num == need_num) ? true : false;

	var out = {
		'desc'		: r.desc,
		'is_count'	: is_count ? true : false,
		'completed'	: completed,
	};

	if (is_count){
		out.got_num = got_num;
		out.need_num = need_num;
	}
	
	// item_class
	if (r.type == 'item'){
		out.item_class = r.class_id;
	}
	else if (r.type == 'make'){
		var recipe = get_recipe(r.recipe_id);
		if (recipe && recipe.outputs && recipe.outputs[0] && recipe.outputs[0][0]){
			out.item_class = recipe.outputs[0][0];
		}
	}
	else if (r.type == 'counter' && r.class_id){
		out.item_class = r.class_id;
	}
	else if (r.type == 'flag' && r.class_id){
		out.item_class = r.class_id;
	}
	else if (r.type == 'work' && r.class_id){
		out.item_class = r.class_id;
		out.item_classes = r.class_ids;
		out.is_work = true;
		out.energy = r.energy;
		out.verb = {
			name: r.verb_name,
			past_tense: r.verb_past
		};
	}
	else if (r.type == 'currants'){
		out.item_class = 'money_bag';
	}
	
	if (r.base_cost) out.base_cost = r.base_cost;

	return out;
}

function get_req_status_by_name(name){
	for (var rid in this.requirements){
		if (this.requirements[rid].name == name) return this.get_requirement_status(rid);
	}

	return {};
}

function get_full_title(pc){

	var str = this.getTitle(pc);

	return str;
}

function get_full_description(pc){

	return this.getDesc(pc);
}


////////////////////////////////////////////////

// Functions specific to Jobs, not Quests, follow

function onJobStart(location, id){
	this.is_job = true;
	this.is_npc_offered = true;
	this.ts_start = time();
	this.req_states = {};
	this.is_complete = false;
	this.is_started = true;
	this.is_failed = false;
	
	this.primary_location = location;
	this.instance_id = id;

	// House extension? Fix reqs
	if (this.type == 5 && this.class_tsid == 'job_proto_door'){
		this.requirements = {};
		var r_id=0;
		var costs = location.homes_get_expand_costs();
		for (var class_id in costs.floor.items){
			var num = costs.floor.items[class_id];
			var proto = apiFindItemPrototype(class_id);

			this.requirements['r'+r_id] = {
				"bucket_id"	: "1",
				"group_id"	: "1",
				"type"		: "item",
				"class_id"	: class_id,
				"num"		: num,
				"base_cost"	: proto.base_cost,
				"desc"		: "Contribute "+proto.name_plural+" - "+num+" needed!"
			};

			r_id++;
		}

		for (var class_id in costs.floor.work){
			var num = costs.floor.work[class_id];
			var proto = apiFindItemPrototype(class_id);

			this.requirements['r'+r_id] = {
				"bucket_id"	: "1",
				"group_id"	: "1",
				"type"		: "work",
				"class_id"	: class_id,
				"class_ids"	: {0: class_id},
				"skill"		: null,
				"num"		: num,
				"base_cost"	: proto.base_cost,
				"energy"	: 5,
				"wear"		: 3,
				"verb_name"	: "construct",
				"verb_past"	: "constructed",
				"desc"		: "Contribute work - "+num+" units needed with a "+proto.name_single
			};

			r_id++;
		}
	}
	
	this.init_reqs();

	apiAdminCall('clearMapCache', {hub_id: location.hubid});
}

function claimJob(pc, group_tsid){
	if (!this.claimable) return false;
	if (this.claimer) return false;

	if (this.claim_reqs){
		for (var rid in this.claim_reqs){
			var r = this.claim_reqs[rid];
			var req = this.get_requirement_status(rid);

			if (r.type == 'currants'){
				if (!pc.stats_try_remove_currants(req.need_num - req.got_num, {type: 'job_claim', job: this.tsid, group: group_tsid})){
					return false;
				}
			}
			else if (r.type == 'item'){
				if (!pc.items_destroy(r.class_id, req.need_num - req.got_num)){
					return false;
				}
			}
			else{
				log.error(this+' claimJob '+pc+' failure. Unknown claim req type: '+r.type);
				return false;
			}
		}
	}

	if (group_tsid){
		var group = pc.groups_get(group_tsid);
		if (!group || group.hasPol()){
			return false;
		}

		this.group = group;
	}

	this.claimer = pc;

	if (this.duration){
		this.job_timeout = time() + (this.duration * 60);
		this.apiSetTimer('onJobTimeout', this.duration * 60 * 1000);
	}

	return true;
}

function nameJob(pc, name){
	if (!this.claimable) return {ok: 0, error: 'Job is not claimable.'};
	if (!this.claimer) return {ok: 0, error: 'Job is not claimed.'};
	if (this.claimer.tsid != pc.tsid) return {ok: 0, error: 'Job is not yours to name.'};
	if (this.job_user_name) return {ok: 0, error: 'Job is already named.'};

	name = utils.trim(name);
	if (!name) return {ok: 0, error: 'Name cannot be blank.'};

	this.job_user_name = name;

	return {ok: 1};
}

function onJobTimeout(){
	if (!this.claimable) return false;
	if (!this.claimer) return false;
	if (this.isDone()) return false;

	// Tell them!
	this.claimer.prompts_add({
		txt		: 'Oops! The project <b>'+this.getTitle()+'<\/b> has expired!',
		icon_buttons	: false,
		timeout		: 30,
		choices		: [
			{ value : 'ok', label : 'Aw, shucks' },
		]
	});

	// Is this necessary? Isn't resetting enough, because we are destroyed?
	delete this.job_timeout;
	delete this.claimer;
	delete this.group;
	delete this.job_user_name;

	// We just delete ourselves
	this.owner.jobs_reset(this.instance_id);

	return true;
}

function getPrimaryLocation(){
	return this.primary_location;
}

function hasPlayerContributed(pc){
	if (!pc) return false;
	if (!this.contributions) return false;
	
	if (this.contributions[pc.tsid]) return true;
	
	return false;
}

function addPlayerContribution(pc, base_cost, option, type){
	if (base_cost <= 0) return;
	if (!this.contributions) this.contributions = {};
	if (!this.contributions[pc.tsid]) this.contributions[pc.tsid] = 0;
	
	this.contributions[pc.tsid] += base_cost;
	
	// Disabled history because we're not using it and it's too big
	// If we do use it, we should split it into another DC or maybe the database
	if (0){
		if (!this.history) this.history = [];
		this.history.push({
			when: time(),
			who: pc.tsid,
			what: base_cost,
			option: option,
			type: type
		});
	}
	
	if (!this.votes) this.votes = {};
	if (!this.votes[option]) this.votes[option] = 0;
	this.votes[option] += base_cost;

	if (!this.ts_first_contribution){
		this.ts_first_contribution = time();

		// Perform a callback
		var args = {
			street_id	: this.primary_location.tsid,
			job_id		: this.instance_id
		};
		utils.http_get('callbacks/job_update.php', args);
	}

	if (this.type != 5)	pc.achievements_increment('job_contributions', this.instance_id+'-'+this.class_tsid, base_cost);

	if (this.spirit_tsid){
		var spirit = apiFindObject(this.spirit_tsid);
		if (spirit && spirit.onContribution) spirit.onContribution(this, pc, base_cost);
	}
}

function getFirstContribution(){
	return this.ts_first_contribution;
}

function inc_currants(pc, num, option){

	if (!this.is_started) return 0;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'currants' && !this.is_requirement_complete(r, this.req_states[i]) && r.group_id <= this.getCurrentReqGroup(r.bucket_id)){
			var amount = this.inc_requirement(pc, i, num);
			this.addPlayerContribution(pc, amount * r.base_cost, option, 'currants');
			
			apiLogAction('JOB_CURRANTS', 'pc='+pc.tsid, 'job_id='+this.instance_id, 'phase='+this.class_tsid, 'amount='+num);
			return amount;
		}
	}
	
	return 0;
}

function inc_item(pc, class_id, count, option){

	if (!this.is_started) return 0;

	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'item' && r.class_id == class_id && !this.is_requirement_complete(r, this.req_states[i]) && r.group_id <= this.getCurrentReqGroup(r.bucket_id)){
			var amount = this.inc_requirement(pc, i, count);
			this.addPlayerContribution(pc, amount * r.base_cost, option, 'item');
			
			apiLogAction('JOB_ITEM', 'pc='+pc.tsid, 'job_id='+this.instance_id, 'phase='+this.class_tsid, 'item='+class_id, 'amount='+count);
			return amount;
		}
	}
	
	return 0;
}

function inc_work(pc, tool, option){
	if (!this.is_started) return 0;

	var r = this.find_work(tool);
	if (r){
		var amount = 0;
		if (!r.skill || pc.skills_has(r.skill)){
			amount = this.inc_requirement(pc, r.id, 1);
			this.addPlayerContribution(pc, amount * r.base_cost, option, 'work');
		}
		
		apiLogAction('JOB_WORK', 'pc='+pc.tsid, 'job_id='+this.instance_id, 'phase='+this.class_tsid, 'tool='+tool);
		return amount;
	}
	
	return 0;
}

function find_work(tool){
	var rs = this.requirements;
	for (var i in rs){

		var r = rs[i];
		if (r.type == 'work' && (in_array(tool, r.class_ids) || (!r.class_ids && r.class_id == tool)) && !this.is_requirement_complete(r, this.req_states[i]) && r.group_id <= this.getCurrentReqGroup(r.bucket_id)){
			r.status = this.get_requirement_status(i);
			r.id = i;
			return r;
		}
	}
	
	return null;
}

// For a given bucket, how many groups are there?
function getReqGroupCount(bucket_id){
	if (!this.is_job) return null;
	
	var groups = {};
	for (var rid in this.requirements){
		var r = this.requirements[rid];
		if (r.bucket_id != bucket_id) continue;

		groups[r.group_id] = 1;
	}

	return num_keys(groups);
}

// How many buckets are there?
function getReqBucketCount(){
	if (!this.is_job) return null;
	
	var buckets = {};
	for (var rid in this.requirements){
		var r = this.requirements[rid];
		buckets[r.bucket_id] = 1;
	}

	return num_keys(buckets);
}

// For a given bucket and group, how many reqs are there?
function getReqGroupSize(bucket_id, group_id){
	if (!this.is_job) return null;
	
	var count = 0;
	for (var rid in this.requirements){
		var r = this.requirements[rid];
		if (r.bucket_id != bucket_id || r.group_id != group_id) continue;

		count++;
	}

	return count;
}

// For a given bucket, what is the current active/unlocked group id?
function getCurrentReqGroup(bucket_id){
	if (!this.is_job) return null;

	var group_count = this.getReqGroupCount(bucket_id);

	var max_group_id = 1;
	for (var group_id=1; group_id<=group_count; group_id++){
		var group_size = this.getReqGroupSize(bucket_id, group_id);

		var complete_count = 0;
		for (var rid in this.requirements){
			var r = this.requirements[rid];
			if (r.bucket_id != bucket_id || r.group_id != group_id) continue;

			if (this.is_requirement_complete(r, this.req_states[rid])) complete_count++;
		}

		if (complete_count == group_size) max_group_id = group_id+1;
	}

	return max_group_id;
}

function getContributions(){
	return this.contributions;
}

function getCountContributers(){
	return num_keys(this.contributions);
}

function getSortedContributors(){
	var sorted = [];
	for (var pc_tsid in this.contributions){
		if (!this.contributions[pc_tsid]) continue;
		sorted.push({pc_tsid: pc_tsid, base_cost: this.contributions[pc_tsid]});
	}
	
	function contributorSort(a, b){
		return b['base_cost'] - a['base_cost'];
	};
	sorted.sort(contributorSort);
	
	return sorted;
}

function getTotalBasecost(){
	var total_req_bc = 0;
	for (var i in this.requirements){
		var req = this.get_requirement_status(i);
		
		total_req_bc += intval(req.need_num) * intval(req.base_cost);
	}
	
	return total_req_bc;
}

function getWinners(){
	var count_contributors = num_keys(this.contributions);
	
	//
	// Give the performance rewards first
	//
	
	var sorted = this.getSortedContributors();
	if (this.performance_percent){
		var winners = sorted.slice(0, Math.ceil(this.performance_percent / 100 * count_contributors));
	}
	else{
		var winners = sorted.slice(0, this.performance_cutoff);
	}
	
	return winners;
}


function getTopFive() {
	var sorted = this.getSortedContributors();
	
	var top_five = sorted.slice(0, 5);
	
	return top_five;
}

//
// whoa
//

function onJobComplete(pc){
	log.info(this+" job has been completed by "+pc);
	this.ts_done = time();
	
	var first_phase = this.owner.jobs_get_first_phase(this.instance_id);
	log.info("JOBS: first phase is "+first_phase);
	if (first_phase.instance.type == 5 && first_phase.instance.class_id != 'job_proto_door' && first_phase.instance.class_id != 'job_cult_tower' && first_phase.instance.class_id.substr(0, 16) != 'job_tower_floor_'){
		pc.achievements_increment("cultivation_projects_restored", this.spirit_tsid, 1);
	}
	
	var is_final_phase = this.isFinalPhase();
	if (is_final_phase){
		var previous_phase = this.owner.jobs_get_current_phase(this.instance_id);
		this.owner.jobs_announce_phase(this.instance_id, previous_phase.class_id);
	}
	else{
		var previous_phase = this.owner.jobs_get_previous_phase(this.instance_id);
		this.owner.jobs_announce_phase(this.instance_id, previous_phase.class_id);
	}


	var current_phase = this.owner.jobs_get_current_phase(this.instance_id);
	
	if (current_phase.instance.type != 5 && current_phase.instance.type != 6){
		//
		// Give the performance rewards first
		//
		
		var winners = this.getWinners();
		var simple_winners = [];
		for (var i=0; i<winners.length; i++){
			var winner = getPlayer(winners[i].pc_tsid);
			if (winner){
				simple_winners.push(winner.tsid);
			}
		}

		var top_five = this.getTopFive();
		var simple_top_five = [];
		for (var i=0; i<top_five.length; i++){
			var top = getPlayer(top_five[i].pc_tsid);
			if (top){
				simple_top_five.push(top.tsid);
			}
		}
		
		
		
		//
		// Find all the contributors, hand out rewards, complete the job in their logs
		//
		
		for (var pc_tsid in this.contributions){
			//
			// Everyone gets the participation rewards
			//
			
			var contrib = getPlayer(pc_tsid);
			if (contrib) {
				if (in_array(pc_tsid, simple_winners)){
					log.info(this+" Giving bonus rewards to "+contrib);
					contrib.jobs_familiar_turnin(this.primary_location.tsid, this.instance_id, previous_phase.class_id, true);
				}
				else{
					log.info(this+" Giving regular rewards to "+contrib);
					contrib.jobs_familiar_turnin(this.primary_location.tsid, this.instance_id, previous_phase.class_id, false);
				}
				
				if (in_array(pc_tsid, simple_top_five)) {
					// This gets awarded even if the player is below the percentage for the bonus
					contrib.achievements_increment('job_phase_winner', 'count');
				}
			}
		}
	}
	
	//
	// And now, if this is the final phase, do whatever it is the job does
	//
	
	if (is_final_phase){
		
		//
		// Tell all players that the project is complete
		//
		
		if (current_phase.instance.class_tsid != 'job_proto_door' && current_phase.instance.class_id.substr(0, 16) != 'job_tower_floor_' && current_phase.instance.type != 6){
			var told = [];
			var player_num_phases = [];	// track which players have contributed to all four phases
			var phases = this.owner.jobs_get_phases(this.instance_id);
			for (var i in phases){
				var contributions = phases[i].instance.getContributions();
				for (var pc_tsid in contributions){
				
					var player = getPlayer(pc_tsid);
					if (player) {
						if (player_num_phases[pc_tsid] == undefined) {
							player_num_phases[pc_tsid] = 1;		// if this player isn't tracked yet, start it at one
						}
						else {
							player_num_phases[pc_tsid] = player_num_phases[pc_tsid] + 1;	// increment each player for each phase
							
							if (player_num_phases[pc_tsid] >= 4) {
								player.achievements_increment('job_contribution_phases', 'all');	// set the counter for the Participant badge
							}
						}
					}
				
					if (in_array(pc_tsid, told)) continue;
					
					if (player){
						var multiplier = 1.0;
						if (current_phase.instance.type == 5 && current_phase.instance.class_tsid != 'job_proto_door'){
							if (this.spirit_tsid){
								var spirit = apiFindObject(this.spirit_tsid);
								if (spirit.getMaxWearMultiplier){
									multiplier = spirit.getMaxWearMultiplier();
								}
							}
						}
						player.jobs_familiar_job_complete(this.primary_location.tsid, this.instance_id, multiplier);

						told.push(pc_tsid);
					}
				}
			}
		}
		
		log.info(this+" Scheduling job effects");
		this.apiSetTimerX('doJobEffects', 500, pc);
		//this.doJobEffects();
	}
	else if (current_phase.delay_seconds){
		this.owner.jobs_announce_phase(this.instance_id, current_phase.class_id);
		this.apiSetTimer('onJobPhaseReady', current_phase.delay_seconds*1000);
	}
}

function doJobEffects(pc){
	log.info(this+" Running job effects");

	// Perform a callback
	var args = {
		street_id	: this.primary_location.tsid,
		job_id		: this.instance_id
	};
	utils.http_get('callbacks/job_update.php', args);


	var first_phase = this.owner.jobs_get_first_phase(this.instance_id);
	if (first_phase.instance.type == 1){
		// New Street!
		
		//
		// Unlock previously locked signposts
		//
		
		this.primary_location.jobs_modify_connections();

		return;
	}
	else if (first_phase.instance.type == 2){
		// Street upgrade!
		
		//
		// Figure out which option won
		//
		
		var winning_option = this.getWinningOption();
		
		//
		// Perform the upgrade
		//
		
		var options = this.primary_location.jobs_get_options(this.instance_id);
		if (options){
			for (var i in options){
				if (options[i].tsid == winning_option.tsid) return this.primary_location.upgrades_apply(options[i]);
			}
		}

		return;
	}
	else if (first_phase.instance.type == 3){
		// Group Hall build!

		if (this.group.hasPol()){
			// Suckers!

			this.primary_location.jobs_reset(this.instance_id);
		}
		else{

			// Hide the offering item
			if (this.spirit_tsid){
				apiFindObject(this.spirit_tsid).setAndBroadcastState('visible:false');
			}

			// TODO: Create the POL on the fly from the template?

			// Set the location's label to ref the group name
			if (this.group.mode == 'private'){
				this.primary_location.label = 'A Private Group';
			}
			else{
				this.primary_location.label = this.group.label;
			}

			// Set the group as the owner of the street and open the signpost
			this.primary_location.pols_setOwner(this.group);
			this.primary_location.jobs_modify_connections();

			// Flag the group as owning a location
			this.group.addPol(this.primary_location);
		}

		return;
	}
	else if (first_phase.instance.type == 4){
		// Group Hall expansion!

		return;
	}
	else if (first_phase.instance.type == 5){
		// Proto item graduation!
		if (this.spirit_tsid){
			var offerer = apiFindObject(this.spirit_tsid);
			if (offerer){
				var proto_class = offerer.class_tsid;
				var multiplier = offerer.getMaxWearMultiplier ? offerer.getMaxWearMultiplier() : 1.0;
				var class_ids = offerer.getEndItems ? offerer.getEndItems() : null;
				if (class_ids && class_ids.length > 0){
					var s = offerer.container.createItemStackWithPoof(utils.trim(choose_one(class_ids)), 1, offerer.x, offerer.y);
					if (!s){
						log.error(this+' could not replace item');
					}
					else{
						log.info("JOBS: replace depleted item "+offerer);
					
						// Hide ourselves and delete on a timer to give clients a chance to finish messaging with us
						offerer.setAndBroadcastState('visible:false');
						offerer.apiSetTimer('apiDelete', 60*1000);

						if (s.initWear){
							s.setProp('proto_class', proto_class);
							s.initWear();
							if (!offerer.wotd) { 
								s.setMaxWearMultiplier(multiplier+0.05);
								
								if (offerer.restorer && offerer.restorer === pc) { 
									var times = 1 + intval((multiplier - 1.0) / .05);
									var max = pc.achievements_get("cultivation", "times_restored");
									log.info("CULT: times is "+times+" and max is "+max+" for "+s.class_tsid);
									if (!max || times > max) { 
										pc.achievements_set("cultivation", "times_restored", times);
									}
								}
								
								s.restorer = pc;		
							}
							else { 
								s.setMaxWearMultiplier(multiplier);
							}
							
							s.broadcastConfig();
						}
						else if (proto_class == 'proto_furniture_tower_chassis'){
							s.setProp('proto_class', proto_class);
						}

						if (s.onJobComplete) s.onJobComplete(this);
						if (s.applyUpgrade) s.apiSetTimer('setJobData', 30*60*1000);
					}
				}
				else{
					if (offerer.onJobComplete) offerer.onJobComplete(this);
					if (offerer.applyUpgrade) offerer.apiSetTimer('setJobData', 30*60*1000);
					if (!offerer.no_post_project_delete) offerer.apiDelete();
					
				}
			}
			else{
				log.error(this+' no offerer: '+this.spirit_tsid);
			}
		}
		else{
			log.error(this+' no spirit_tsid');
		}

		return;
	}
	else if (first_phase.instance.type == 6){
		// Item upgrade!
		if (this.spirit_tsid){
			var offerer = apiFindObject(this.spirit_tsid);
			if (offerer){
				//
				// Figure out which option won
				//
				
				var winning_option = this.getWinningOption();
				
				//
				// Perform the upgrade
				//
				
				var options = this.primary_location.jobs_get_options(this.instance_id);
				if (options){
					for (var i in options){
						if (options[i].tsid == winning_option.tsid) return offerer.applyUpgrade(options[i]);
					}
				}
			}
			else{
				log.error(this+' no offerer: '+this.spirit_tsid);
			}
		}
		else{
			log.error(this+' no spirit_tsid');
		}

		return;
	}
	else {
		log.error(this+" has UNKNOWN type");
	}
}

function getPerformanceText(pc){
	return this.expandText(this.performance_text, pc);
}

function getParticipationText(pc){
	return this.expandText(this.participation_text, pc);
}

function getOptions(){
	var votes = this.votes || {};
	var options = this.primary_location.jobs_get_options(this.instance_id);
	var ret_options = [];
	
	if (options){

		var total_votes = 0;
		for (var i=0; i<num_keys(votes); i++){
			total_votes += intval(votes[i]);
		}

		var index = 0;
		for (var i in options){
			ret_options.push({
				tsid: options[i].tsid,
				name: options[i].label,
				desc: options[i].desc,
				image: options[i].image,
				perc: total_votes ? (Math.round(intval(votes[index]) / total_votes * 1000) / 1000) : 0
			});
			
			index++;
		}
	}
	
	return ret_options;
}

function getWinningOption(){
	var options = this.getOptions();
	
	if (options.length == 0) return null;
	if (options.length == 1) return options[0];
	
	var winning_key = null;
	var winning_count = -1;
		
	for (var i in options){
		// OMG WHAT ABOUT TIES?
		if (options[i].perc > winning_count){
			winning_count = options[i].perc;
			winning_key = i;
		}
	}
	
	return options[winning_key];
}

function getRewards(multiplier){
	if (this.is_job){
		var rewards = {};
		if (this.rewards.xp) rewards.xp = Math.round(this.rewards.xp * multiplier);
		if (this.rewards.currants) rewards.currants = Math.round(this.rewards.currants * multiplier);
		if (this.rewards.mood) rewards.mood = Math.round(this.rewards.mood * multiplier);
		if (this.rewards.energy) rewards.energy = Math.round(this.rewards.energy * multiplier);
		
		for (var i in this.rewards.favor){
			if (!rewards.favor) rewards.favor = [];
			rewards.favor.push({giant: this.rewards.favor[i].giant, points: Math.round(this.rewards.favor[i].points * multiplier)});
		}
		
		return {
			rewards: rewards,
			performance_rewards: this.performance_rewards
		};
	}
	else{
		return this.rewards;
	}
}

function getInstanceId(){
	return this.instance_id;
}

function onJobPhaseReady(){
	this.owner.jobs_announce_phase(this.instance_id);
}

function isFinalPhase(){
	var options = this.owner.jobs_get_phase_options(this.instance_id, this.class_tsid);
	return (options.in_order == this.owner.jobs_count_phases(this.instance_id)) ? true : false;
}

function getAllPhases(){
	return this.owner.jobs_get_phases(this.instance_id);
}