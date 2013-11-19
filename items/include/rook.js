//#include events.js

// This contains methods and properties for items which can be rooked (trants and animals)
// It is also included by players, for the same purpose

var can_be_rooked = true; // By including this file, you've made this object rookable!

// Is this object currently rooked?
function isRooked(){
	return this.is_rooked ? true : false;
}

// Attempt to rook this object, applying any necessary effects
function rookAttack(force){
	// Each player in a location at the time of an attack loses 20 energy and 20 mood, even if they are not rooked.
	if (this.is_player){
		var energy_modifier = 1;
		if (!this.buffs_has('rook_armor')) energy_modifier = 0.5;
		this.metabolics_lose_energy(20 * energy_modifier);

		if (!this.buffs_has('rook_armor')) this.metabolics_lose_mood(20);
		
		if(!this.buffs_has('rook_wrath') && !force) {
			return;
		}
	}

	// Can't be rooked twice.
	if(this.is_rooked) {
		return;
	}
	
	// Each trant and animal in the location has a 50% chance of being “rooked”.
	var chance = 0.50;
	
	if (is_chance(chance) || force == true){
		this.is_rooked = true;

		if (this.is_player){
			// When an player is rooked:
			// - they get the rooked overlay circling above their head
			// - they get the “Rooked” debuff which lasts 10 seconds. During that time they are frozen, looping the idle0 animation state
			// - when that clears, they get the “Rooked Recovery” debuff, which lasts for 90 seconds:
			// 	- their energy and mood is is capped at 50% of their normal level capacity and is lowered to that point if it is not already at it or below
			// 	- their movement speed is set to half the normal speed
			// 	- they cannot teleport
			
			this.broadcastPCRSChange();
			this.buffs_apply('rooked');
		}
		else{
			// Common effects
			
			if (!this.hasTag('trant')){
				this.fullStop();
				if (this.class_id == 'npc_butterfly'){
					this.setAndBroadcastState('fly-rooked');
				}
				else if (this.class_id == "npc_kitty_chicken") {
					this.setAndBroadcastState("3sad");
				}
				else{
					this.setAndBroadcastState('rooked1');
				}
			}

			// No more rook talkbacks!
//			this.apiSetTimer('onRookedTalkback', 7000);
			
			// Item-specific rook actions
			if (this.onRooked) this.onRooked();
			
			// Set up healers object
			this.rook_healers = {};
			
			this.apiSetPlayersCollisions(true);
		}
	}
}

function unRook(){
	this.is_rooked = false;
	delete this.rook_healers;
	
	if (!this.is_player){
		if (this.onRevived) this.onRevived();
	}
	else{
		this.broadcastPCRSChange();
	}
}

function broadcastPCRSChange(){
	var rsp = {
		type: 'pc_rs_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			rs: this.isRooked()
		}
	};
	
	this.apiSendMsg(rsp);
	this.reverseBuddiesSendMsg(rsp);
}

function startRevive(pc, msg){
	this.cancelRookConversation(pc);
	
	if(!this.canRevive(pc)) {
		return;
	}
	
	// This player has already tried healing this item, or this item is not rooked
	if(!this.is_rooked || (this.rook_healers[pc.tsid] && this.rook_healers[pc.tsid].successful)) {
		return;
	}

	// Already doing something else?
	if (pc.isRunningSkillPackage()) return;
	
	log.info(this+' [ROOK] startRevive: '+pc);
	// Run rook revival skill package:
	var ret = pc.runSkillPackage('rook_revive', this, {word_progress: config.word_progress_map['revive'], overlay_id:'rooked_revive', callback: 'doReviveComplete', bubble_width: 75, msg: msg});

	if(ret['ok']) {
		// Set up rook healer with player info, overlay uids
		this.rook_healers[pc.tsid] = { 
			pc: pc,
			successful: false,
			in_progress: true
		};
	}
}

function doReviveCancel(pc) {
	if(!this.is_rooked || !this.rook_healers[pc.tsid] || !this.rook_healers[pc.tsid].in_progress) {
		log.info(this+' [ROOK] doReviveCancel not an in-progress healer: '+pc);
		// Couldn't find this player or item isn't rooked
		return;
	}
	
	log.info(this+' [ROOK] doReviveCancel: '+pc);
	// Cancel the action
	this.rook_healers[pc.tsid].successful = false;
	this.rook_healers[pc.tsid].in_progress = false;
}

function doReviveComplete(pc, ret, force_full_revive){
	var total_xp = 25;
	var slugs = {xp: 0};
	if (force_full_revive){
		this.rook_healers[pc.tsid] = { 
			pc: pc,
			successful: false,
			in_progress: true
		};
		
		total_xp += 200;
	}

	if(!this.is_rooked || !this.rook_healers[pc.tsid] || !this.rook_healers[pc.tsid].in_progress) {
		log.info(this+' [ROOK] doReviveComplete not an in-progress healer: '+pc);
		// Couldn't find this player, or item isn't rooked
		return;
	}
	
	log.info(this+' [ROOK] doReviveComplete: '+pc);

	// Complete the action
	this.rook_healers[pc.tsid].successful = true;
	this.rook_healers[pc.tsid].in_progress = false;
	
	// Are we now done being rooked?
	var healers = this.countSuccessfulHealers();
	if(healers == 3 || force_full_revive) {
		this.unRook();
	}
	
	if (this.is_rooked){
		slugs.xp = pc.stats_add_xp(total_xp, false, {'verb':'revive','class_id':this.class_id});
		slugs.energy = pc.metabolics_lose_energy(25);
		slugs.mood = pc.metabolics_lose_mood(25);
		
		if(healers == 1) {
			this.sendResponse('revived_1st_time', pc, slugs);
		} else if(healers == 2){
			this.sendResponse('revived_2nd_time', pc, slugs);			
		}
	}
	else{
		// whosoever takes the action which gets the trant all the way down to 0 rookedness gets a bonus of 25xp and 10 favor points with a giant TBD (we’ll make  list per trant)
		total_xp += 25;
		slugs.xp = pc.stats_add_xp(total_xp, false, {'verb':'revive','class_id':this.class_id});
		slugs.energy = pc.metabolics_lose_energy(25);
		slugs.mood = pc.metabolics_lose_mood(25);
		
		pc.stats_add_favor_points('all', 10);
		slugs.favor = [
			{giant: 'all', points: 10}
		];
		this.sendResponse('revived_3rd_time', null, slugs, pc);

		// Show rainbow overlay
		var args = {
			type: 'itemstack_overlay',
			swf_url: this.overlay_key_to_url('rainbow_fullyrevived'),
			duration: 4000,
			itemstack_tsid: this.tsid,
			delta_x: 0,
			delta_y: 0,
			width: 400,
			height: 400,
			follow: true,
			dont_keep_in_bounds:true,
			allow_bubble:true
		};

		this.container.apiSendAnnouncement(args);
		this.container.announce_sound_to_all('RAINBOW_FULLYREVIVED', 0, 0, true);
		
		this.cancelAllRookConversations();
	}	
}

function isReviving(pc){
	if ((this.rook_healers[pc.tsid] && this.rook_healers[pc.tsid].in_progress)){
		log.info('isReviving: true');
	}else{
		log.info('isReviving: false');
	}
	return (this.rook_healers[pc.tsid] && this.rook_healers[pc.tsid].in_progress);
}

function getReviveEffects(pc){
	return {
		energy_cost: 25,
		mood: -25,
		xp: 25,
		seconds: 10,
		itemclass: this.name_single,
	};
}

function countSuccessfulHealers() {
	var healers = 0;
	for(var i in this.rook_healers) {
		if(this.rook_healers[i].successful) {
			healers++;
		}
	}
	
	return healers;
}

function playerIsHealer(pc) {
	if(!this.is_rooked || !this.rook_healers || !this.rook_healers[pc.tsid] || !this.rook_healers[pc.tsid].successful) {
		return false;
	}
	
	return true;
}

function rookedCollision(pc) {
	log.info("Rooked collision between "+pc+" and "+this+".");
	if(!this.is_rooked || !this.rook_healers || (this.rook_healers[pc.tsid] && this.rook_healers[pc.tsid].successful) || !this.canRevive(pc) || this.isReviving(pc) || pc.isRunningSkillPackage()) {
		this.cancelRookConversation(pc);
		return true;
	}
	this.conversation_start(pc, choose_one(this.responses['rooked']), {1: {txt: "I'll help you!",value: "rooked_collision_response"}}, null, null, null, 
		{ignore_state: true, dont_take_focus: true});
		
	// Add this pc to our list of conversants, and schedule the timer to see if they leave.
	if(!this.talk_pcs) {
		this.talk_pcs = {};
	}
	
	this.talk_pcs[pc.tsid] = pc;
	this.apiSetTimer('checkConversations', 5*1000);

	return true;
}

function cancelRookConversation(pc) {
	if(!this.talk_pcs || !this.talk_pcs[pc.tsid]) {
		return;
	}
	
	this.conversation_cancel(pc);
	delete this.talk_pcs[pc.tsid];
}

function cancelAllRookConversations(pc) {
	this.talk_pcs = {};
	this.apiCancelTimer('checkConversations');
}

function checkConversations() {
	if(!this.talk_pcs) {
		return;
	}
	
	for(var i in this.talk_pcs) {
		var pc = this.talk_pcs[i];
		
		if (!this.container.activePlayers[pc.tsid]){
			this.cancelRookConversation(pc);
		}
		else if(Math.abs(pc.x - this.x) > 300 || Math.abs(pc.y - this.y) > 300) {
			this.cancelRookConversation(pc);
		}
	}
	
	if(num_keys(this.talk_pcs)) {
		this.apiSetTimer('checkConversations',5*1000);
	}
}

function conversation_run_rooked_collision_response(pc, msg) {
	this.conversation_end(pc, msg);
	this.startRevive(pc);
}

function onRookedTalkback(){
	if (this.is_rooked && !this.silent_rooking){
		if (is_chance(0.35)){
			this.sendResponse('rooked');
		}

		this.apiSetTimer('onRookedTalkback', 7000);
	}
}

function adminRook(pc) {
	pc.prompts_add({
		txt: "This is an admin command to rook this animal. By proceeding you confirm that you are an admin and know what you're doing. If you do this when you shouldn't, we will send rooks to eat your eyeballs. We know who you are.", 
		title: "ATTENTION!",
		prompt_callback: 'adminRookCallback', 
		is_modal: true,
		escape_value:'no',
		choices: [{value: "ok", label: "WANT ROOK IT."}, {value: "no", label: "I am not Mart."}],
		itemstack: this
	});	
	this.adminRooker = pc;
}

function adminRookCallback(value, details) {
	if(value == 'ok' && details.itemstack) {
		details.itemstack.rookAttack(true);
	} else if(this.adminRooker) {
		delete this.adminRooker;
	}
}

function canRevive(pc) {
	if(!this.rook_healers || !this.isRooked()) {
		return false;
	}
	
	var num_healers = 0;
	for(var i in this.rook_healers) {
		if(this.rook_healers[i].successful || this.rook_healers[i].in_progress) {
			num_healers++;
		}
	}
	
	if(num_healers >= 3) {
		return false;
	}
	
	return true;
}

function getRookedStatus(args){

	if (!this.rook_status){
		return {status:{rooked: false}};
	}

	return this.rook_status;

}