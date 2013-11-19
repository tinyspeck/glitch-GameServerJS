//#include inc_admin.js, inc_groups.js, inc_organizations.js, inc_making.js
//#include inc_stores.js, inc_skills.js, inc_stats.js
//#include inc_metabolics.js, inc_items.js
//#include inc_buddies.js, inc_quests.js, inc_buffs.js
//#include inc_tests.js, inc_houses.js, inc_acl_keys.js, inc_achievements.js
//#include inc_familiar.js, inc_demo.js, inc_party.js, inc_instances.js
//#include inc_auctions.js, inc_announcements.js, inc_skill_packages.js
//#include inc_activity.js, inc_prompts.js, inc_trophies.js
//#include inc_trading.js, inc_teleportation.js, inc_jobs.js
//#include inc_daily_history.js, inc_profile.js, inc_rewards.js
//#include inc_avatar.js, inc_mail.js, inc_conversations.js
//#include ../items/include/events.js ../items/include/rook.js
//#include inc_special_locations.js, inc_games.js, inc_eleven_secrets.js
//#include inc_requests.js, inc_counters.js, inc_imagination.js, inc_furniture.js
//#include inc_world_events.js, inc_mountaineering.js, inc_physics.js
//#include inc_butler.js, inc_newxp.js, inc_towers.js, inc_feats.js
//#include inc_visiting.js, inc_emotes.js

log.info("player.js EXECUTED");

var is_player = 1;

function init(){

	//
	// core stuff
	//

	if (!this.date_last_login) this.date_last_login = 0;
	if (!this.is_dead) this.is_dead = 0;


	//
	// various bits
	//

	this.stats_init();
	this.skills_init();
	this.making_init();
	this.buffs_init();
	this.metabolics_init(); // must come after stats & buffs
	this.achievements_init();
	this.quests_init();
	this.familiar_init();
	this.instances_init();
	this.auctions_init();
	this.prompts_init();
	this.trading_init();
	this.jobs_init();
	this.daily_history_init();
	this.rewards_init();
	this.mail_init();
	this.buddies_init();
	this.groups_init();
	this.organizations_init();
	this.conversations_init();
	this.teleportation_init();
	this.counters_init();
	this.imagination_init();
	this.furniture_init();
	
	// Hardcoded values matching the client
	this.h = 112;
	this.w = 59;

	//
	// clean up old things
	//

	if (this.abilities){
		this.abilities.apiDelete();
		delete this.abilities;
	}
	delete this.talents;
	delete this.level;
	delete this.cash;
	delete this.announce;
	delete this.schoolState;
	delete this.toSP;
	delete this.toLoc;
	delete this.dist;
	delete this.character_class;
	delete this.garliced;
	delete this.mooned;
	delete this.bag_size;
	delete this.last_pet;
	//delete this.home;
	
	if (this.starting_instance) this.starting_instance.apiDelete();
	delete this.starting_instance;
	
	if (!this.is_god && this.location_history) delete this.location_history;
}

//
// Called by the GS when the player logs in
//

function onLogin(){
	log.info('----------------- onLogin: '+this.tsid);

	this.init();

	this.familiar_clean_queue();
	this.quests_restart_queue();

	// Clear Zilloween data if necessary
	if (!isZilloween()) {
		this.clearZilloweenData();
	}
	
	//
	// tell reverse contacts that we've come online
	//


	var tsids = this.buddies_get_reverse_tsids();
	var args = {
		tsid: this.tsid,
		label: this.label,
		level: this.stats_get_level(),
		location: {
			tsid: this.location.getProp('tsid'),
			label: this.location.is_hidden() ? 'A secret place' : this.location.getProp('label')
		}
	};
	var online = apiCallMethodForOnlinePlayers('buddies_send_buddy_online', tsids, args);
	
	this.date_last_login = time();
	
	// Do any region-specific log-in stuff
	this.location.region_login(this);
	
	if (!this.last_location) { this.last_location = this.location; }

	this.tp_queue = [];

	this.imagination_convert();
	//this.imagination_convert_currants();
}

//
// This is called when a player is moved to another GS and they have re-connected to it
//

function onRelogin(){
	
	log.info('----------------- onReLogin: '+this.tsid);

	this.init();
}

//
// Called by 'login_end' in main.js (the client has finished logging in and loading the game)
//

function onLoggedin(){

	this.buffs_login();
	this.houses_login();
	
	//
	// learn new recipes created since we learned the skill
	//
	
	this.skills_learn_missing_recipes();
	this.achievements_login();
	this.quests_login();
	this.party_login();
	this.instances_login();
	this.trading_rollback();
	this.rewards_return();
	this.conversations_login();
	
	this.date_last_loggedin = time();
	
	//
	// Resume any overlays
	//
	
	if (this.last_overlay_script){
		delete this.last_overlay_script;
		this.run_overlay_script(this.last_overlay_script);
		this.apiSendMsg({ type: 'annc_flush' }); // HACKS!
	}
	
	this.checkNewGameDay();
	
	this.apiCancelTimer('onPeriodicEnergyLoss');
	this.apiSetTimer('onPeriodicEnergyLoss', 90000);
	
	// Periodically check for play time achievements:
	this.apiSetTimer('onPlayTimeCheck', 120000);
	
	this.is_afk = false;
	
	// move any expired courier items into the mailbox.
	this.mail_login();
	
	// Did someone recognize our death while we were logged out?
	if (this.death_recognized) {
		this.recognizeDeath(this.death_recognized.type, this.death_recognized.recognizer);
		delete this.death_recognized;
	}

	// fix broken quoin upgrades:
	var coin_modifier = 0;
	if (this.buffs_has('crazy_coin_collector')) coin_modifier = 50;
	
	this.stats_set_quoins_max_today(this.imagination_get_quoin_limit() + coin_modifier);
	
	// Mail 2011 Glitchmas Gift between 2011-12-24 @4pm and end of Glitchmas (2012-01-03 @10am)
	/*if (config.is_dev || ((getTime()/1000 > 1324771200) && isGlitchmas())){
		this.mail_send_special_item('glitchmas_cracker', 1, "Good news! The Glitchmas Yeti awoke from hibernation and sent us a box of these. We’re not sure what they are — though from the description on the packaging it seems to be some kind of explosive …<split butt_txt=\"Wot?\" />Yeah, we thought we should do the safe thing and get them out of the office as soon as possible. So we passed them on to you!<split butt_txt=\"Hmm. Thanks.\" />You might want to find a friend to pull it with, though. Who knows? Maybe there’s something inside. We’re too scared to look. Happy Glitchmas! — Tiny Speck");
	}*/

	if (this.skills_get_count() >= 11) this.achievements_grant('first_eleven_skills');

	// Recover feat rewards
	if (this.feats_has_unclaimed_rewards()){
		this.familiar_send_alert({
			'callback'	: 'feats_familiar_turnin_do',
			'feat_id'	: this.feats_has_unclaimed_rewards()
		});
	}
}

//
// Called by the GS when the player disconnects or is timed out
// There is *always* an onLogin before this, but not necessarily an onLoggedIn
//

function onLogout(){
	log.info("ON LOGOUT ",this.label);

	this.buffs_logout();
	this.houses_logout();
	this.party_logout();
	this.instances_logout();
	this.groups_logout();
	this.organizations_logout();
	this.trading_cancel_auto();
	this.quests_pause_queue();
	this.quests_on_logout();


	//
	// tell reverse contacts that we've gone offline
	//

	var tsids = this.buddies_get_reverse_tsids();
	var online = apiCallMethodForOnlinePlayers('buddies_send_buddy_offline', tsids, {tsid: this.tsid, label: this.label});
	
	//
	// tell old location we've gone offline (this is to handle when client reloads mid-move, after player has been removed from old location already
	//

	if (this['!local_move_data'] && this['!local_move_data'].old_loc) {
		this['!local_move_data'].old_loc.apiSendMsg({
			type: 'pc_logout',
			pc: this.make_hash()
		});
	}
	
	//
	// Record time played and test for *real* logout
	//
	if (this.date_last_loggedin && (this.date_last_loggedin > this.date_last_logout || !this.date_last_logout)){
		var time_played = time() - this.date_last_loggedin;
		log.info(this.label + ' was logged in for ' + time_played + ' seconds.');
		var d = new Date();
		var day = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
		
		// Only accurate as of 2011-04-13 1:30pm-ish
		this.achievements_increment('time_played', day, time_played);
		this.counters_increment('time_played', day, time_played);
		if (!this.time_played) this.time_played = 0;
		this.time_played += time_played;
		
		apiLogAction('LOGOUT', 'pc='+this.tsid);
	}
	
	if (this['!current_overlay_script']){
		this.last_overlay_script = this['!current_overlay_script'];
		delete this['!current_overlay_script'];
	}
	
	if (this['!mining']){
		var rock = apiFindObject(this['!mining']);
		if (rock){
			rock.cancelMining(this);
		}
	}
	
	if (this['!clearing']){
		var tree = apiFindObject(this['!clearing']);
		if (tree){
			tree.cancelClearing(this);
		}
	}
	
	if (this['!pulling']) {
		var cracker = apiFindObject(this['!pulling']);
		if (cracker){
			cracker.cancelPulling(this);
		}
	}
	
	// Stop following and remove followers
	this.stopFollowing();
	this.removeFollowers();
	
	// Do any region-specific logout stuff
	this.location.region_logout(this);
	
	this.is_afk = false;
	
	this.date_last_logout = time();
	
	// Cancel all courier items
	this.mail_logout();

	this.lastActiveCallback('logout');

	// cancel all action request replies
	this.cancelActionRequestReplies();

	for (var i in this.tp_queue){
		var item = this.tp_queue[i];
		if (item) this.teleportToLocation(item.tsid, item.x, item.y, item.args);
	}

	if (this.location.isInstance()){
		if (this.location.instance_id.substr(0, 19) == 'underground_puzzle_' || this.location.instance_id.substr(0, 19) == 'ticket_to_paradise_'){
			var exit = this.instances_get_exit(this.location.instance_id);
			this.teleportToLocationDelayed(exit.tsid, exit.x, exit.y);
			this.prompts_add_simple("It looks like you ran into some trouble. You've been moved to a safe place.");
		}
	}
}

// set a flag when we do a street move, so time-critical things like chasing JuJus/Deimaginators don't
// "catch" us while we're waiting for a slow street move to complete

function didStartStreetMove(){
	this.did_start_move = true;
	
	/* Update data for hairball achievement */
	if (this.buffs_has('hairball_dash')) {
		this.buffs_hairball_leave_street();
	}
	return true;
}

function didEndStreetMove(){
	delete this.did_start_move;
	return true;
}

function isMovingStreets(){
	return this.did_start_move ? true : false;
}

// This is called when a player is moving to another GS and they're about to disconnect from the one they're on
function onGSLogout(){
	log.info("ON GS LOGOUT ",this.label);
}

function onClean(){
	// this is called on all dev players when you type '/clean' into
	// the chat box

	this.quests_reset();

	this.init();
}

function init_prop(group, key, value, lo, hi){
	if (!this[group]){
		this[group] = {};
	}
	if (!this[group][key]){
		this[group][key] = this.apiNewProperty(key, value);
	}
	this[group][key].apiSetLimits(lo, hi);
}

function testTimer(){
	log.info("TEST TIMER time="+getTime());
	this.apiSetTimer("testTimer",60000);
}

// If the player is on a ladder, returns the ladder. Else returns null.
function isOnLadder() {
	var geo = this.location.geometry.layers;
	for (var layer in geo) {
		//log.info("Checking for ladders in layer "+layer);
		var lds = geo[layer].ladders;
		for(var lid in lds){
			var ld= lds[lid];
			if (this.x===ld.x){
				if(this.y<ld.y && this.y>(ld.y-ld.h)){
					return ld;
				}
			}
		}
	}
	
	return null;
}

function isFlying(){
//	log.info("dx="+this.dx);
	if (this.dy<0) return false;
	
	var pls = this.location.geometry.platforms;
	for(var plid in pls){
		var pl= pls[plid];
		if (this.y===pl.y){
			if(this.x>pl.x && this.x<pl.x+pl.w){
				return false;
			}
		}
	}
	
	if (this.isOnLadder()) { return false; }
	
	return true;
}

function isInAir(){
	if (this.isOnLadder()) { return false; }

	var dest = this.location.apiGetPointOnTheClosestPlatformLineBelow(this.x, this.y);
	if (Math.abs(this.y - dest.y) < 10) return false;
	return true;
}


function sendActivity(msg, from, no_growl, no_activity){
	if (no_growl && no_activity) return;
	
	if (from === undefined) from = this;
	
	// Auto-prepend?
	var auto_prepend = false;
	if (from){
		var new_msg = msg.replace(new RegExp('^'+utils.regexp_escape(from.label)+' '), '');
		if (new_msg != msg){
			msg = new_msg;
			auto_prepend = true;
		}
	}
	
	this.sendMsgOnline({
		type: 'activity',
		txt: msg,
		pc: from ? from.make_hash() : {},
		auto_prepend: auto_prepend,
		no_growl: no_growl ? true : false,
		growl_only: no_activity ? true : false,
	});
	//log.info('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+msg);
}


// This function is not necessary anymore, and should/could be refactored out
function sendOnlineActivity(msg){
	this.sendActivity(msg);
}

function sendLocationActivity(msg, from, exclusions){
	if (from === undefined) from = this;
	
	// Auto-prepend?
	var auto_prepend = false;
	if (from){
		var new_msg = msg.replace(new RegExp('^'+utils.regexp_escape(from.label)+' '), '');
		if (new_msg != msg){
			msg = new_msg;
			auto_prepend = true;
		}
	}
	
	if (!exclusions) {
		exclusions = [];
	}
	exclusions.push(this.tsid);
	
	//this.sendActivity("Sending location activity while excluding "+exclusions);
	
	this.location.apiSendMsgX({
		type: 'activity',
		txt: msg,
		pc: from ? from.make_hash() : {},
		auto_prepend: auto_prepend
	}, exclusions);
}

function teleportToLocationVariableDelay(tsid, x, y, time, args){
	
	if (!apiIsPlayerOnline(this.tsid)){
		return this.teleportToLocation(tsid, x, y, args);
	}

	this['!teleport_delayed'] = {
		'tsid': tsid,
		'x': x,
		'y': y,
		'args': args
	};
	
	this.apiSetTimer('handleDelayedTeleport', time);
}

function teleportToLocationDelayed(tsid, x, y, args){
	
	if (!apiIsPlayerOnline(this.tsid)){
		return this.teleportToLocation(tsid, x, y, args);
	}

	this['!teleport_delayed'] = {
		'tsid': tsid,
		'x': x,
		'y': y,
		'args': args
	};
	
	this.apiSetTimer('handleDelayedTeleport', 500);
}

function handleDelayedTeleport(){
	
	if (this['!teleport_delayed'] && this['!teleport_delayed'].tsid){
		
		var t = this['!teleport_delayed'];
		var ret = this.teleportToLocation(t.tsid, t.x, t.y, t.args);
		if (ret['ok']){
			delete this['!teleport_delayed'];
		}
		else{
			if (!this['!teleport_delayed'].attempts) this['!teleport_delayed'].attempts = 0;
			this['!teleport_delayed'].attempts++;
			
			if (this['!teleport_delayed'].attempts < 10){
				this.apiSetTimer('handleDelayedTeleport', 500);
			}
			else{
				delete this['!teleport_delayed'];
			}
		}
	}
}

function teleportToLocation(tsid, x, y, args){

	if (!args) args = {};

	log.info('Teleporting '+this+' to '+tsid+'.');
	
	if (this.apiPlayerHasLockForCurrentLocation()){
		log.info('Tried to teleport '+this+' but the player had a location lock.');
		return {
			'ok' : 0,
			'error' : "player has location lock"
		};
	}
	
	apiLogAction('TELEPORT', 'pc='+this.tsid, 'location='+tsid, 'x='+x, 'y='+y);

	var target = apiFindObject(tsid);
	if (!target){
		log.error(this+" can't find teleport target: "+tsid);
		return {
			'ok' : 0,
			'error' : "can't find location"
		};
	}
	
	/*if (this.isLoggingIn){
		log.info(this+' is logging in.');
		return {
			'ok' : 0,
			'error' : "Player is logging in."
		};
	}*/

	if (this.isLoggingIn || this['!teleporting'] || this["!local_move_data"]){
		if (!this.tp_queue) this.tp_queue = [];
		if (this.tp_queue.length > 50){
			return {
				'ok' : 0,
				'error': "Already moving, and teleport queue is too large"
			};
		}

		if (this.tp_queue.length && this.tp_queue[this.tp_queue.length-1].tsid != tsid)	this.tp_queue.push({tsid: tsid, x: x, y: y, args: args});
		log.info('Tried to teleport '+this+' but they are already moving.');
		return {
			'ok' : 1,
			'was_online' : 1,
			'is_queued': 1
		};
	}


	//
	// actions we need to take before they can teleport
	//

	this.trading_cancel_auto();
	delete this['!is_firefly_whistlin'];
	
	
	//
	// Get the target x,y
	//

	var geo = target.get_geo_bounds();
	x = (x == 'c') ? Math.round((geo.r - geo.l) / 2) + geo.l : intval(x);
	y = (y == 'c') ? Math.round((geo.b - geo.t) / 2) + geo.t : intval(y);


	//
	// Create an instance?
	//
	
	if (tsid != this.location.tsid && target.instances_instance_me() && !args.ignore_instance_me){
		var instance_id = target.instances_instance_me();
		var max_members = target.instances_get_max_members();
				
		var instance = target.instances_next_instance(instance_id, max_members);
		if (!instance){
			var instance_options = target.instances_get_instance_options();

			var location_options = {};

			instance = this.instances_create(instance_id, target.tsid, instance_options, location_options);

			target.instances_add_instance(instance_id, instance);
		}
		else if (!this.instances_has(instance_id)){
			this.instances_add(instance_id, instance);
		}

		//pc.instances_enter(instance_id, connect.x, connect.y);
		this.instances.previously[instance_id] = this.get_simple_location();
		target = apiFindObject(instance.get_entrance());
	}


	//
	// if they're offline, we just move em
	//

	if (!apiIsPlayerOnline(this.tsid)){
		this.apiMoveOfflinePlayerToAnotherLocation(target,x,y);
		//target.apiMoveIn(this, x, y);

		return {
			'ok' : 1,
			'was_online' : 0
		};
	}


	//
	// if they're online, the client confirms
	//

	// Stop following another player
	this.stopFollowing();

	if (target.getProp('hubid') != this.location.getProp('hubid')){
		this.announce_sound('TELEPORT_AWAY_HUB');
	}else{
		this.announce_sound('TELEPORT_AWAY');
	}
	

	//
	// moving within the same location?
	// (we don't need to send geometry)
	//

	if (tsid == this.location.tsid && !args.force_location_reload){
		this.apiSetXY(x, y);

		var rsp = {
			type: 'teleport_move_start',
			in_location: true,
			pc: this.make_hash_with_location()
		};
		this.apiSendMsg(rsp);

		return {
			'ok' : 1,
			'was_online' : 1
		};
	}


	//
	// changing game servers?
	//
		
	this['!teleporting'] = true;
		
	log.info("teleportToLocation ",target.tsid,"x=",x,"y=",y);
	try{
		var d = this.apiCheckIfNeedToMoveToAnotherGSAndGetMoveData(target.tsid, x, y);
		if (d){
			var target_info = target.get_info();
			log.info("teleportToLocation d=",d);
			this.apiSendMsg({
				type: 'teleport_move_start',
				token: d.token,
				hostport: d.hostAndPort,
				destination: { // the value here is a hash that looks just like the ones sent as connect objects on doors and signposts
					street_tsid: target_info.tsid,
					label: target_info.name,
					swf_file_versioned: target_info.swf_file_versioned,
					img_file_versioned: target_info.img_file_versioned,
					hub_id: target_info.hub_id
				},
				loading_info: target.getLoadingInfo(this)
			});
			this.location.apiMoveOut(this, target);
			return {
				'ok' : 1,
				'was_online' : 1
			};
		}
	}catch(e){
		this['!teleporting'] = false;
		return {
			'ok' : 0,
			'error' : "An exception was thrown trying to teleport "+this+"."
		};
	}


	//
	// teleporting within the same GS
	//

	var rsp = {
		type: 'teleport_move_start',
		location: target.prep_geometry(this),
		loading_info: target.getLoadingInfo(this)
	};

	if (args.change_type){
		rsp.change_type = args.change_type;
	}
	if (args.loading_img){
		rsp.loading_info = {
			loading_img	: args.loading_img,
			is_basic	: true,
		};
	}

	this.apiSendMsg(rsp);

	this["!teleport_move_data"] = {
		old_loc: this.location
	};

	//
	// call the player's java code to make all of the start move arrangements
	// this call will remove player from its current location, execute various onExit callbacks
	// set pc location, x and y to new values, and place the pc into the list of non-active player of the target location
	// if pc logout after this step, then after next loging he will be placed into target location
	this.apiStartLocationMoveX(target, x, y);

	return {
		'ok' : 1,
		'was_online' : 1
	};
}

function teleport_to_player(target){

	var loc = target.get_simple_location();

	this.teleportToLocation(loc.tsid, loc.x, loc.y);
}

//
// called every minute by the GS, starting when it receives login_start from the client and ending on logout
//

function onTimePlaying(){
	// called every 1 minute you spend logged in
	//log.info('player "'+this.label+'" has been playing for 1 minute');
	
	this.checkNewGameDay();
	
	if(!this['!in_house_deco_mode'] && !this.location.isParadiseLocation() && ((!this['!meditating'] || this['!meditating'] != 'transcendental'))) {
		if (!this.location.is_newxp){
			var mood_loss_percentage_multiplier = 1.0;
			if (this.buffs_has('rookswort')){
				mood_loss_percentage_multiplier = 0.5;
			}
			
			var max_mood = Math.min(this.metabolics_get_max_mood(), 2000);

			var mood_loss = Math.max(max_mood * (0.0025 * mood_loss_percentage_multiplier), 1);
			var mood_percentage = this.metabolics_get_percentage('mood');
			
			if (mood_percentage > 80){
				mood_loss = Math.max(max_mood * (0.015 * mood_loss_percentage_multiplier), 4);

				if (this.imagination_has_upgrade('periodic_mood_loss_reduced_3')){
					mood_loss = Math.max(max_mood * (0.0075 * mood_loss_percentage_multiplier), 4);
				}else if (this.imagination_has_upgrade('periodic_mood_loss_reduced_2')){
					mood_loss = Math.max(max_mood * (0.010 * mood_loss_percentage_multiplier), 4);
				}else if (this.imagination_has_upgrade('periodic_mood_loss_reduced_1')){
					mood_loss = Math.max(max_mood * (0.0125 * mood_loss_percentage_multiplier), 4);
				}
			} else if (mood_percentage >= 50){
				mood_loss = Math.max(max_mood * (0.005 * mood_loss_percentage_multiplier), 2);
			}
			
			if (!this.has_done_intro){
				if (this.metabolics_get_percentage('mood') <= 50) mood_loss = 0;
			}

			if (mood_loss) this.metabolics_lose_mood(mood_loss, 1);
		}
	}
	
	this.apiSendMsg({
		'type': 'time_passes'
	});
	
	if (this.metabolics_get_percentage('energy') <= 10 && !this.buffs_has('walking_dead') && !this.is_dead){
		if (this.deaths_today){
			this.sendActivity('You are extremely low on energy! Find something to eat.');
		} else{
			this.sendActivity('You are about to croak! Find something to eat.');
		}
	}

	// Do a callback every 10 minutes
	if (!this['!onTimePlayingCounter']) this['!onTimePlayingCounter'] = 0;
	if (this['!onTimePlayingCounter'] % 10 == 0){
		this.lastActiveCallback('on_playing');
	}

	this['!onTimePlayingCounter']++;
}

function checkNewGameDay(){
	var today = current_day_key();
	if (!this.last_online_gameday || this.last_online_gameday.length < 8) this.last_online_gameday = today;
	
	if (today > this.last_online_gameday){
		// Croaked?
		if (this.is_dead){
			this.apiSetTimer('checkNewGameDay', 1000);
			return this.resurrect();
		}
		else if (this.end_esquibeth || 
				this.location.isInstance('waterfall_01') ||
				this.location.isInstance('waterfall_02') ||
				this.location.isInstance('waterfall_03') || 
				this.location.isInstance('waterfall_04_wider')) {
			this.apiSetTimer('checkNewGameDay', 30*1000);
			return;
		}
		else if (this.location.isInstance('rainbow_run')){
			this.apiSetTimer('checkNewGameDay', 30*1000);
		}

		this.doNewDay();
		this.last_online_gameday = today;
	}
}

function getTimePlayed(){
	return this.counters_get_group_sum('time_played');
}

function doNewDay(){
	//
	// A new day!!! Reset some things
	//
	
	
	// Re-fill energy
	var energy = 0;
	var mood = 0;
	if (this.has_done_intro){
		energy = this.metabolics_set_energy(this.metabolics.energy.top);
		mood = this.metabolics_set_mood(this.metabolics.mood.top);
	}

	apiLogAction('NEW_DAY', 'pc='+this.tsid, 'energy='+energy, 'mood='+mood);

	var maxDonationXP = Math.round(this.stats_calc_level_from_xp(this.stats_get_xp()).xp_for_this * 0.1);
	
	var previous_time_played = this.getTimePlayed();
	var session_time_played = time() - this.date_last_login;
	if (this.isOnline() && (previous_time_played + session_time_played) >= 3600 && this.has_done_intro){
		
		var yesterday_key = this.last_online_gameday;
		
		var rsp = {
			"type"			: "new_day",
			"sound"			: "NEWDAY",
			"energy_gained"		: energy,
			"stats_yesterday"	: {
				energy: intval(this.daily_history_get(yesterday_key, 'energy_consumed')) * -1,
				imagination: intval(this.daily_history_get(yesterday_key, 'imagination'))
			},
			"stats_today"		: {
				energy: energy,
				mood: mood
			}
		};
		
		var hi_variants_tracker = apiFindObject(config.hi_variants_tracker);
		rsp.hi_emote_leaderboard = hi_variants_tracker.get_all_counts();
		hi_variants_tracker.calculate_pcs_daily_evasion_record_achieves(this);
		
		var levels = intval(this.daily_history_get(yesterday_key, 'level_up'));
		if (levels) rsp.new_level = this.stats_get_level();
		
		var quests = this.daily_history_get(yesterday_key, 'quests_completed');
		if (num_keys(quests)){
			rsp.complete_quests = [];
			for (var i in quests){
				var q = this.getQuestInstance(quests[i]);
				if (q){
					rsp.complete_quests.push({name: q.getTitle(this), tsid: q.class_tsid});
				}
			}
		}
		
		var collections = this.daily_history_get(yesterday_key, 'collections');
		if (num_keys(collections)){
			rsp.complete_collections = [];
			for (var i in collections){
				var c = this.achievements_get(collections[i]);
				if (c){
					rsp.complete_collections.push({name: c.name, tsid: this.achievement_get_trophy(collections[i]).class_tsid});
				}
			}
		}
		
		var skills = this.daily_history_get(yesterday_key, 'skills_learned');
		if (num_keys(skills)){
			rsp.new_skills = [];
			for (var i in skills){
				rsp.new_skills.push({name: this.skills_get_name(skills[i]), tsid: skills[i]});
			}
		}
		
		var achievements = this.daily_history_get(yesterday_key, 'achievements');
		if (num_keys(achievements)){
			rsp.new_badges = [];
			for (var i in achievements){
				var a = this.achievements_get(achievements[i]);
				if (a){
					rsp.new_badges.push({
						name: a.name,
						tsid: achievements[i],
						icon_urls: {
							swf: a.url_swf,
							180: a.url_img_180,
							60: a.url_img_60,
							40: a.url_img_40
						}
					});
				}
			}
		}
		
		this.apiSendMsg(rsp);

		this.daily_history_archive(yesterday_key);
		this.daily_history_reset();
	}
	
	// Quoins
	if (this.stats.quoins_today.value >= 100){
		this.achievements_increment('coin_count', 'days_maxed');
	}
	else{
		this.achievements_set('coin_count', 'days_maxed', 0);
	}
	
	this.stats_set_quoins_today(0);
	
	// fix broken quoin upgrades:
	this.stats_set_quoins_max_today(this.imagination_get_quoin_limit());
	
	if (this.buffs_has('crazy_coin_collector')){
		this.buffs_remove('crazy_coin_collector');
	}

	// Reset daily rube trades
	this.stats_set_rube_trades(0);
	this.stats_set_rube_lure_disabled(false);
	
	// Food counter
	this.food_today = 0;
		
	// Meditation counters
	this.stats_set_meditation_today(0);
	this.radiation_today = 0;
	
	// Deaths!
	this.deaths_today = 0;
	
	// Butler quest
	if (this.butlers_zombied_today) { 
		delete this.butlers_zombied_today;
		this.quests_set_counter("butlers_zombied", 0);
	}
	
	// Reset daily favor limits
	for(var i = 0; i < config.giants.length; ++i) {
		var giant = config.giants[i];
		this.init_prop('daily_favor', giant, 0, 0, this.stats_get_max_favor(giant));
		this.daily_favor[giant].apiSet(0);
	}

	// reset daily donation xp limits
	this.init_prop('stats', 'donation_xp_today', 0, 0, maxDonationXP);
	this.stats['donation_xp_today'].apiSet(0);
	
	// Reset count for having seen the prompt for exceeding max donations
	this.seenMaxDonationsPrompt = 0;

	// Reset teleport trackers
	this.teleportation_reset_counters();

	// Mining gem drop overrides
	this.removeSkillPackageOverride('mining');
	this.removeSkillPackageOverride('mining_fancypick');

	if (this.buffs_has('impervious_miner')){
		this.addSkillPackageOverride('mining', {energy_cost: 0});
		this.addSkillPackageOverride('mining_fancypick', {energy_cost: 0});
	}

	delete this.stats.recipe_xp_today;
	
	// Reset daily counters
	this.stats_reset_daily_counter();

	delete this.hi_emote_variant;
}

function deleteMe(){

	//
	// remove reverse friends
	//

	if (this.friends && this.friends.reverse){
		if (this.friends.reverse.pcs){
			for (var i in this.friends.reverse.pcs){
				var pc = this.friends.reverse.pcs[i];
				pc.removeBuddy(this.tsid);
			}
		}
		this.friends.reverse.apiDelete();
		delete this.friends.reverse;
	}


	//
	// remove forward contacts
	//

	if (this.friends){
		for (var i in this.friends){
			if (this.friends[i].pcs){
				for (var j in this.friends[i].pcs){

					this.removeBuddy(this.friends[i].pcs[j].tsid);
				}
			}
		}

		delete this.friends;
	}


	//
	// empty bags
	//
	
	this.trading_reset();
	var items = this.apiGetAllItems();
	for (var i in items){
		items[i].apiDelete();
	}


	this.rewards_reset();
	this.prompts_delete();
	this.auctions_delete();
	this.houses_remove_all();
	this.familiar_delete();
	this.quests_delete();
	this.skills_delete();
	this.stats_delete();
	this.making_delete();
	this.buffs_delete();
	this.achievements_delete_all();
	this.instances_delete_all();
	this.groups_delete_all();
	this.organizations_delete_all();
	this.mail_delete();
	this.conversations_delete();

	this.apiDelete();
}

function findAllCloseStacks(target_class_tsid, max_distance, args) {
	if (!max_distance) max_distance = 10000;

	var is_function = (typeof target_class_tsid == 'function');
	var result = [];

	for (var i in this.location.items){
		var it = this.location.items[i];
		if (!it) continue;

		var ok = 0;
		if (is_function) ok = target_class_tsid(it, args);
		if (!is_function) ok = (it.class_tsid == target_class_tsid) ? true : false;

		if (ok){
			var dx = it.x - this.x;
			var dy = it.y - this.y;
			var d = Math.sqrt(dx*dx+dy*dy);

			if (d < max_distance){
				result.push(it);
			}
		}
	}

	return result;
}

function findCloseStack(target_class_tsid, max_distance, args){

	if (!max_distance) max_distance = 10000;

	var is_function = (typeof target_class_tsid == 'function');
	var best_d = max_distance + 1;
	var best_it = null;

	for (var i in this.location.items){
		var it = this.location.items[i];
		if (!it) continue;

		var ok = 0;
		if (is_function) ok = target_class_tsid(it, args);
		if (!is_function) ok = (it.class_tsid == target_class_tsid) ? true : false;

		if (ok){
			var dx = it.x - this.x;
			var dy = it.y - this.y;
			var d = Math.sqrt(dx*dx+dy*dy);

			if (d < best_d){
				best_it = it;
				best_d = d;
			}
		}
	}

	if (best_d <= max_distance){

		return best_it;
	}

	return null;
}

function onCreate(){
	this.init();
	this.is_dead = 0;

	// used for testing
	if (this.skip_entire_intro){
		delete this.skip_entire_intro;
		this.has_done_intro = 1;
		return;
	}

	// used for partial resets
	if (this.skip_newux){
		this.stats_set_currants(1000);
		this.metabolics_set_mood(80);
		this.metabolics_set_energy(80);
		this.stats_add_xp(100);
		
		this.createItem('hoe', 1);
		this.createItem('watering_can', 1);
		this.createItem('sammich', 3);
		this.createItem('papl_upside_down_pizza', 3);
		this.createItem('common_crudites', 3);
		this.createItem('milk_butterfly', 3);
		this.createItem('bubble_tea', 3);
		this.createItem('cloud_11_smoothie', 3);
		
		delete this.skip_newux;
		this.has_done_intro = 1;
		//this.teleportToLocationDelayed('LLIF6R3R9GE1GQB', -412, -112); // burnabee
		return;
	}
	
	this.stats_set_currants(0); // formerly 100: http://bugs.tinyspeck.com/10801
	this.metabolics_set_mood(55);
	this.metabolics_set_energy(55);

	this.has_done_intro = 0;
	
	// NEVER ACCESS stacked_physics_cache from outside of inc_physics!
	// Consider this a private var, and use
	// getStackedPhysics() to retrieve the value
	this.stacked_physics_cache = null;
	
	this.physics_new = {};
	this.setDefaultPhysics();

	// if they're online, move them to starting instance now, else
	// we'll send them next time they load game.php
	if (this.no_reset_teleport) return;
	if (apiIsPlayerOnline(this.tsid)){
		this.goToNewNewStartingLevel();
	}else{
		this.teleportHome();
	}
}

function croak(){
	log.info(this+' croaked');

	if (this.apiPlayerHasLockForCurrentLocation()) return 0;
	if (this.is_dead || this.buffs_has('walking_dead') || this.location.isInHell()) return 0;
	if (!this.has_done_intro || this.location.class_tsid == 'newbie_island') return 0;
	
	apiLogAction('CROAKED', 'pc='+this.tsid);
	this.apiSendAnnouncement({type: 'stop_all_music'});
	this.announce_sound('CROAK');
	
	if (!this.deaths_today) this.deaths_today = 0;
	this.deaths_today++;
	this.sendOnlineActivity('You croaked!');
	this.metabolics_lose_mood(this.metabolics_get_mood());
	this.metabolics_lose_energy(this.metabolics_get_energy());


	// remove followers, including references.
	this.removeFollowers();
	
	// If you die on transit, you resurrect at the previous station
	if (this.location.is_transit){
		var current_stop = this.location.transit_get_current_stop(this.location.instance_id);
		this.resurrect_location = {
			tsid:	current_stop.tsid,
			x:	current_stop.x,
			y:	current_stop.y
		};
	}
	else{
		this.resurrect_location = {
			tsid:	this.location.tsid,
			x:	this.x,
			y:	this.y
		};
		
		if (this.location == this.home.interior) {
			this.achievements_increment("croaked", "at_home", 1);
		}
	}
	
	this.grapes_squished = 0;
	this.is_dead = 1;
	
	this.achievements_increment('player', 'deaths');


	if (this.map_path) this.previous_map_path = this.map_path;
	
	//this.quests_offer('you_croaked', true);
	
	if (this.buffs_has('no_no_powder_crash')){
		this.buffs_remove('no_no_powder_crash');
	}

	if (this.buffs_has('no_no_powder')){
		this.buffs_remove('no_no_powder');
	}
	
	var marker = this.location.createItemStack('graveside_marker', 1, this.x, this.y-29);
	if (marker){
		marker.setOwner(this);
		this.setGraveMarker(marker);
	}
	
	var pos = randInt(0, config.hell.x.length-1);
	this.teleportToLocationDelayed(config.hell.tsid, config.hell.x[pos], config.hell.y[pos]);
	
	log.info(this+' finished croaking');
	return 1;
}

function setGraveMarker(marker) {
	this.grave_marker = marker;
}
function removeGraveMarker() {
	if (this.grave_marker) {
		delete this.grave_marker;
	}
}

function resurrect(){
	log.info(this+' resurrected');

	if (this.apiPlayerHasLockForCurrentLocation()) return 0;
	if (!this.is_dead && !this.location.isInHell()) return 0;
	
	apiLogAction('RESURRECTED', 'pc='+this.tsid);
	
	//log.info('---------------- resurrect');
	this.is_dead = 0;
	delete this.grapes_squished;
	if (this.grave_marker) {
		this.grave_marker.onDisappear();
	}
	
	this.announce_music_stop('HELL', 2);

	if (this.buffs_has('pooped')){
		this.metabolics_set_energy(this.metabolics.energy.top * 0.05);
	}else{
		this.metabolics_set_energy(this.metabolics.energy.top * 0.10);
	}
	if (this.metabolics_get_mood() > (this.metabolics.mood.top / 2)) this.metabolics_set_mood(this.metabolics.mood.top / 2);
	
	var dest;
	var prev;
	if (this.location.isInstance('hell_one')){
		prev = this.instances_get_exit('hell_one');
		if (prev) dest = apiFindObject(prev.tsid);
	}
	else{
		// wtf?
		dest = this.resurrect_location ? apiFindObject(this.resurrect_location.tsid) : null;
		prev = this.resurrect_location;
	}

	if (!dest || !prev || prev.tsid == this.location.tsid){
		prev = config.default_location;
	}
	else{
		if (dest.pols_is_pol() && !dest.pols_is_owner(this) && !dest.getProp('is_public')){
			prev = dest.pols_get_entrance_outside();
		}
	}
	
	this.quests_set_flag('resurrected');
	var tomorrow = timestamp_to_gametime(time()+ (game_days_to_ms(1)/1000));
	tomorrow[3] = 0;
	tomorrow[4] = 0;
	

	//
	// Don't reapply the Pooped buff when emerging from hell.
	// If the player was Pooped in hell, they will remain pooped.
	// Otherwise they can move normally.
	//
//	var remaining = gametime_to_timestamp(tomorrow) - time();
//	this.buffs_apply('pooped', {duration: remaining});

	// If a player sets a path in hell or has one set by the hell quest, it shouldn't persist after they leave.
	if (this.previous_map_path){
		this.map_path = this.previous_map_path;
		var ret = this.getPathRsp();
		this.apiSendMsg({
			type: 'get_path_to_location',
			path_info: ret.path
		});
	}
	else{
		this.clearPath();
		this.apiSendMsg({type: 'clear_location_path'});
	}
	
	// Clear follows, so we don't transfer other players out of hell without their grapey pennance having been paid
	this.removeFollowers();

	this.teleportToLocationDelayed(prev.tsid, prev.x, prev.y);
	
	delete this.resurrect_location;

	// Recover feat rewards
	if (this.feats_has_unclaimed_rewards()){
		this.familiar_send_alert({
			'callback'	: 'feats_familiar_turnin_do',
			'feat_id'	: this.feats_has_unclaimed_rewards()
		});
	}
	
	log.info(this+' finished resurrecting');
	return 1;
}

// Death recognition stuff for Hell Quest and Wine of the Dead.
function getDeathRecognitionDetails() {
	return this.death_recognized;
}

function removeDeathRecognitionDetails() {
    if (this.death_recognized) {
        delete this.death_recognized;
	}
}

function recognizeDeath(type, recognizer) {
    
    //
	// We need to push data on our death recognition onto
	// the player either if they're offline and can't receive
	// the notification, or if they need the quest (to construct
	// the quest offer text).
	//

	if (!this.death_recognized){
		this.death_recognized = {type: type, recognizer: recognizer};
	}
	
	if (this.isOnline()) {
		if (this.location.isInHellOne() && this.getQuestStatus('hell_hole') == 'none' && this.getQuestStatus('hell_quest') == 'none'){
			this.quests_offer('hell_hole', true);
		}else if (this.location.isInPurgatoryHub() && this.getQuestStatus('hell_quest') == 'none'){
			this.quests_offer('hell_quest', true);
		}else{
			var activityText = "";

			switch (type) {
				case 'mourn':
					activityText += recognizer.label+" has mourned your passing";
					break;
				case 'celebrate':
					activityText += recognizer.label+" has celebrated your life";
					break;
			}

			var remaining = this.createItemFromFamiliar('drink_ticket', 1);
			if (remaining) {
				activityText += ", but since your pack is full, your drink ticket for Wine of the Dead has been put into storage.";
			} else {
				activityText += ", you received a drink ticket for Wine of the Dead.";
			}

			this.prompts_add({
				txt		: activityText,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}

		delete this.death_recognized;
	}
}

function respondToFollow(choice, details) {
	var follower = getPlayer(details.follower_tsid);

	if (follower['!follow_prompt']) follower.prompts_remove(follower['!follow_prompt']);
	
	if(choice == "accept") {
		/* first, make sure we're still in range to be followed */
		var distance = this.distanceFromPlayer(follower);
		if(distance > 1000) {
			follower.sendActivity("You were too far away to follow " + this.label + ".");
			this.sendActivity(follower.label + " is too far away to follow you.");
			
			return;
		}
		
		follower.apiStartFollowing(this.tsid);
		follower.streets_followed = 1;
		
		follower.sendActivity("You started following " + this.label + ".");
		
		if (!this.followers) {
			this.followers = {};
		}
		this.followers[follower.tsid] = follower.label;
		
		follower.followee = this.tsid;
		
		this.updateGlitchTrain(this.location);
		
		// Update all followers:
		var list = this.followers;
		for (var tsid in list) {
			var pc = getPlayer(tsid);
			pc.updateGlitchTrain(pc.location);
		}
	} else {
		follower.sendActivity(this.label +" declined to be followed.");
	}
}

function getInfo(){
	return {
		tsid: this.tsid,
		label: this.label,
		location: this.location,
		location_info: this.location.get_info(),
		level: this.stats_get_level(),
		is_admin	: (this.is_god || this.is_help) ? true : false
	};
}

function get_location(){
	return this.location;
}

function get_simple_location(){
	return {
		tsid:	this.location.tsid,
		x:	this.x,
		y:	this.y
	};
}

function goToNewNewStartingLevel(){
	log.info(this+' goToNewNewStartingLevel');
	delete this.intro_steps;
	delete this.has_done_intro;
	delete this.no_reset_teleport;
	
	var tsid = config.newxp_locations['newxp_intro'];
	var instance_id = 'newxp_intro';
	
	for (var i in this.instances.instances){
		this.instances_left(i);
		
		delete this.instances.instances[i];
		delete this.instances.previously[i];
	}

	// Create the first instance
	var instance = this.instances_create(instance_id, tsid, {no_auto_return: true, location_type: instance_id});

	// Create the second instance and add it to the player
	var instance2 = this.instances_create('newxp_training1', config.newxp_locations['newxp_training1'], {no_auto_return: true, location_type: 'newxp_training1'});

	// Create the third instance and add it to the player
	var instance3 = this.instances_create('newxp_training2', config.newxp_locations['newxp_training2'], {no_auto_return: true, location_type: 'newxp_training2'});

	// Go to the first instance
	this.instances_enter(instance_id, 609, -6100, true);
}

function goToFallingLevel(exit){
	
	var tsid = config.is_dev ? 'LHH12F9DO801RUL' : 'LLI12DVTLA01HT5';
	var instance = this.instances_create('falling', tsid, {instance_label: 'You Feel Woooooozy...', no_auto_return: true});
	if (instance){
		if (exit && exit.tsid){
			var loc = apiFindObject(instance.get_entrance());
			var teleporter = loc.find_items('teleporter').pop();
			if (teleporter){
				teleporter.setInstanceProp('target_tsid', exit.tsid);
				teleporter.setInstanceProp('target_x', exit.x);
				teleporter.setInstanceProp('target_y', exit.y);
			}
		}
		this.instances_enter('falling', 0, -10000);
	}
}

// Find the best greeting/intro location for new players
function getGreetingLocation(){
	
	config.greeting_locations.sort(function(){ return 0.5 - Math.random(); }); // Shuffle the greeting locations
	
	var best = null;
	var lowest_count = 0;
	for (var i=0; i<config.greeting_locations.length; i++){
		var loc = apiFindObject(config.greeting_locations[i].tsid);
		if (loc){
			var player_count = num_keys(loc.getActivePlayers());
			if (!best || (loc.countGreeters() > 0 && player_count < lowest_count)){
				best = config.greeting_locations[i];
				lowest_count = player_count;
			}
		}
	}
	
	if (best){
		var idx = randInt(0, best.x.length-1);
		return {tsid: best.tsid, x: best.x[idx], y: best.y[idx]};
	}
	else{
		log.error(this+' could not find greeting location!!!!');
		return {};
	}
}

// Takes greeters to a greeting location in need of greeters
function greeterGoToGreetingLocation(){
	
	var best = null;
	var highest_ratio = 0;
	for (var i=0; i<config.greeting_locations.length; i++){
		var loc = apiFindObject(config.greeting_locations[i].tsid);
		if (loc){
			var greeter_count = loc.countGreeters();
			if (!greeter_count){
				best = config.greeting_locations[i];
				break;
			}
			
			var player_count = num_keys(loc.getActivePlayers());
			var ratio = (player_count-greeter_count) / greeter_count;
			
			if (!best || ratio > highest_ratio){
				best = config.greeting_locations[i];
				highest_ratio = ratio;
			}
		}
	}
	
	if (best){
		var idx = randInt(0, best.x.length-1);
		var ret = this.teleportToLocation(best.tsid, best.x[idx], best.y[idx]);
		return ret['ok'];
	}
	else{
		log.error(this+' could not find greeting location!!!!');
		return false;
	}
}

var collectible_item_classes = ['gameserver', 'collectors_edition_2010_glitchmas_yeti', 'glitchmas_present', 'greeter_badge', 'bag_greeter_badge', 'trophy_egghunt', 'trophy_street_creator_dirt', 'trophy_street_creator_earth', 'trophy_street_creator_rock', 'trophy_street_creator_wood'];
function resetForTesting(skip){

	log.info(this+' resetForTesting');
	
	//
	// wherein we reset most stuff, but not social connections
	//


	var tokens_to_refund = 0;
	var items_to_restore = [];
	var items = this.apiGetAllItems();
	
	for (var i in items){
		if (!items[i] || items[i].is_bag) continue;
			
		// Collectibles, which should not be deleted!
		if (in_array(items[i].class_tsid, this.collectible_item_classes)){
			items_to_restore.push(items[i].class_tsid);
		}

		if (items[i].class_tsid == 'teleportation_script' && items[i].is_imbued){
			tokens_to_refund++;
		}
		
		items[i].apiDelete();
	}

	//
	// run all the lib delete/reset functions
	//

	this.houses_remove_all();
	this.familiar_reset();
	this.quests_reset();
	this.skills_reset();
	this.stats_delete();
	this.making_reset();
	this.buffs_reset();
	this.achievements_reset();
	this.trophies_reset();
	this.instances_reset();
	this.teleportation_reset();
	this.daily_history_reset();
	//this.jobs_reset(); // Maybe not do this? Since we're not resetting jobs
	this.auctions_reset(true);
	this.rewards_reset();
	this.mail_reset();
	this.conversations_reset();
	this.trading_reset();
	this.prompts_reset();
	this.buddies_reset_cache();
	this.counters_reset();
	this.imagination_reset();

	// reset other stats and stuff
	this.stats_reset_xp();
	this.stats_reset_favor();
	this.stats_reset_street_history();
	this.stats.currants.apiSet(0);
	this.metabolics_recalc_limits();
	this.metabolics_set_energy(100);
	this.metabolics_set_mood(100);
		
	// Food counter
	this.food_today = 0;
	
	// Meditation counters
	this.radiation_today = 0;
	
	// Deaths!
	this.deaths_today = 0;
	
	delete this.kindly_randomness;
	delete this.giants_donated;
	delete this.physics;
	delete this.fully_grown_trants;
	delete this.musicblocks_heard;
	delete this.soaked;
	delete this.house;
	delete this.skill_package;
	delete this.events;
	delete this.location_history;
	delete this.quoins_today;
	delete this.meditation_today;
	delete this.giant_emblems;
	delete this.baqala_times;
	delete this.physics_new;
	delete this.avatar;
	delete this.map_path;
	delete this.butterflies_milked;
	delete this.too_much_nostalgia_prompt;
	delete this.intro_steps;

	if (skip) this.skip_newux = 1;

	this.houses_remove_all();
	this.stats_reset_imagination();
	this.metabolics_set_tank(100);
	this.metabolics_set_max('energy', 100);
	this.metabolics_set_energy(95);
	this.metabolics_set_mood(95);
	this.stats_set_quoin_multiplier(1.0);
	this.stats_set_currants(0);
	this.achievements_reset_daily();
	this.setDefaultPhysics();
	//this.emptyBag();
	//this.furniture_reset(); // This deletes and re-creates your furn bag, which confuses the client. do the next thing instead
	var furn_bag = this.furniture_get_bag();
	if (furn_bag) furn_bag.emptyBag();
	this.physicsReset();
	this.clearPath();

	this.announce_music_stop(this.location.geometry.music_file, 1);

	// Do items *again*, because the code above (namely: pol selling and rewards/familiar resets) can create items in their inventory
	var items = this.apiGetAllItems();
	for (var i in items){
		// Collectibles, which should not be deleted!
		if (in_array(items[i].class_tsid, this.collectible_item_classes)){
			items_to_restore.push(items[i].class_tsid);
		}

		if (items[i].class_tsid == 'teleportation_script' && items[i].is_imbued){
			tokens_to_refund++;
		}
		
		items[i].apiDelete();
	}

	// Restore any unspent tokens
	if (tokens_to_refund){
		this.teleportation_give_tokens(tokens_to_refund, "Imbued Teleportation Script refund");
	}
	
	// Restore items
	for (var i in items_to_restore){
		this.createItemFromFamiliar(items_to_restore[i], 1);
	}

	// Check greeter status
	if (this.greeting){
		this.greeting.beta_user = true;
	}
	else if (this.has_done_intro && this.date_last_login && this.date_last_login >= (time() - (60*60*24*30.5*6))){
		this.greeting = {
			beta_user: true
		};
	}


	//
	// Physician, heal thyself!
	//

	
	delete this.grapes_squished;
	delete this.resurrect_location;

	// fill bags with starting stuff & send to starting instance
	this.onCreate();
}

function distanceFromPlayer(pc){
	if (this.tsid == pc.tsid) return 0;
	if (this.location.tsid != pc.location.tsid) return 9999999;
	return this.distanceFromPlayerXY(pc.x, pc.y);
}

function distanceFromPlayerXY(x, y){
	var x_delta = this.x - x;
	var y_delta = this.y - y;
	return Math.sqrt((x_delta*x_delta)+(y_delta*y_delta));
}

//
// this is called any time after a player does "something"
//

var meditation_ok_types = ['itemstack_mouse_over'];
var meditation_ok_verbs = ['meditate', 'focus_energy', 'focus_mood', 'radiate'];
var please_wait_ok_types = ['party_chat', 'groups_chat', 'local_chat', 'buff_tick', 'conversation_choice', 'buff_start', 'prompt_choice'];
function performPostProcessing(msg){
	// handle any delayed teleport
	if (msg.type != 'login_start' && msg.type != 'relogin_start' && msg.type != 'login_start' && msg.type != 'relogin_start') this.handleDelayedTeleport();


	// If this is a move_xy, but they didn't actually move, then quit here
	// move_xy without an actual move is likely a state change
	if (msg.type == 'move_xy' && !this['!actually_moved']) return;
	

	// Butler hints:
	//log.info("msg is "+msg.type);
	if (msg.type == "global_chat" || (msg.type == "groups_chat_join" && in_array_real(msg.tsid, config.global_chat_groups))) { this.global_chatter = true; }
	
	// Interrupt meditation
	if (this['!meditating']){
		// meditation also stops if the user sends any chat message (global, party or IM), receives an IM from another player (but party/local/global chat are ok) 
		// or performs a verb on a different item
		
		// Upgrades: meditative_arts_less_distraction = not distracted by incoming messages
		//           meditative_arts_less_distraction_2 = not distracted by outgoing messages
		var meditation_ok_copy = meditation_ok_types.slice();
		if (this.imagination_has_upgrade("meditative_arts_less_distraction")) {
			meditation_ok_copy.push("im_recv"); // only one incoming type that distracts
		}
		
		if (this.imagination_has_upgrade("meditative_arts_less_distraction_2")) {
			meditation_ok_copy.push("local_chat", "local_chat_start", "party_chat", "groups_chat", "groups_chat_leave", "groups_chat_join", "global_chat", "im_send");
		}
		
		//log.info(this+" meditation_ok types "+meditation_ok_copy);
		
		var interrupt = true;
		// Ignore buff ticks while in wintry place
		if (this.location.tsid == 'LM413ATO8PR54' || this.location.tsid == 'LLI11ITO8SBS6' || this.location.tsid == 'LM11E7ODKHO1QJE'){
			if (msg.type == 'buff_tick') interrupt = false;
		}
		
		// this is accomplished by explicitly ignoring allowed actions -- anything else interrupts
		if (interrupt && !in_array(msg.type, meditation_ok_copy) && !in_array(msg.verb, this.meditation_ok_verbs)){
			// Find their orb and cancel meditation
			var orbs = this.get_stacks_by_class('focusing_orb');
			for (var i in orbs){
				if (orbs[i].meditating){
					log.info(this+' meditation was interrupted by: '+msg);
					orbs[i].cancelAnyMeditation();
				}
			}
		}
	}
	
	// Interrupt the "Please Wait" buff
	if (this.buffs_has('please_wait')){
		if (!in_array(msg.type, this.please_wait_ok_types)){
			log.info(this+' please_wait was interrupted by: '+msg);
			this.buffs_remove('please_wait');
			if (config.is_dev || (this.location.instance_id && this.location.instance_id.substr(0, 17) == 'bureaucratic_hall')){
				this.prompts_add({
					txt		: 'You can\'t do anything while waiting. Just wait!',
					icon_buttons	: false,
					timeout		: 3,
					timeout_value	: 'ok',
					choices		: [
						{ value : 'ok', label : 'OK' }
					],
					callback	: 'prompts_buff_callback',
					buff_class_tsid	: 'please_wait'
				});
			}
		}
	}
	
	// Things we do when you move
	if (msg.type == 'move_xy' && this['!moved_lat'] >= 150){
		if (this['!dismiss_overlay']){
			this.events_add({overlay: this['!dismiss_overlay'], callback: 'dismiss_overlay_event'}, 1);	
			delete this['!dismiss_overlay'];
		}
		else if (this.run_overlay_onmove){
			this.events_add({overlay: this.run_overlay_onmove, callback: 'run_overlay_event'}, 1);	
			delete this.run_overlay_onmove;
		}
		else if (this.apply_buff){
			this.buffs_apply(this.apply_buff);
			delete this.apply_buff;
		}
	}
}

function dismiss_overlay_event(details){
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: details.overlay});
}

function run_overlay_event(details){
	this.run_overlay_script(details.overlay);
}

function moveAvatar(x, y, face, why){
	var rsp = {
		type:	'move_avatar',
		x:	intval(x),
		y:	intval(y)
	};
	
	if (config.is_dev && why) {
		rsp.why = why;
	}
	
	if (face == 'left' || face == 'right'){
		rsp.face = face;
	}
	
	this.apiSendMsgAsIs(rsp);
}

function faceAvatar(face, force){
	if (face != 'left' && face != 'right') return;

	var rsp = {
		type:	'move_avatar',
		face:	face
	};
	
	if (force) {
		rsp.force = true;
	}

	
	this.apiSendMsgAsIs(rsp);
}

var emotion_types = ['happy', 'surprise', 'angry'];
function playEmotionAnimation(em){
	if (!in_array(em, this.emotion_types)) {
		log.error('unknown emotion: '+em);
		return;
	}
	
	this.apiSendMsgAsIs({
		type:	'play_emotion',
		emotion: em
	});
}

function playEmotionAnimationDelayed(details){
	this.playEmotionAnimation(details.em);
}

// if you pass 0 ms, it will play until you call stopDoAnimation;
// otherwise, the do animation will stop after ms have passed
function playDoAnimation(ms){
	this.apiSendMsgAsIs({
		type:	'play_do',
		duration: intval(ms) || 0
	});
}

function stopDoAnimation(){
	this.apiSendMsgAsIs({
		type:	'play_do',
		stop: 'true'
	});
}

var hit_types = ['hit1', 'hit2'];
function playHitAnimation(hit_type, ms){
	if (!in_array(hit_type, this.hit_types)) {
		log.error('unknown hit_type: '+hit_type);
		return;
	}

	this.apiSendMsgAsIs({
		type:	'play_hit',
		hit: hit_type,
		duration: intval(ms) || 0
	});
}

function stopHitAnimation(){
	this.apiSendMsgAsIs({
		type:	'play_hit',
		stop: 'true'
	});
}

function moveCamera(x, from_edge){
	var rsp = {
		type:	'camera_offset',
		x:	intval(x)
	};
	
	if (from_edge){
		rsp['camera_offset_from_edge'] = true;
	}
	
	this.apiSendMsgAsIs(rsp);
}

function centerCamera(pt, duration){
	this.apiSendMsg({
		type: 'camera_center',
		pt: pt,
		duration_ms: duration
	});
}

function teleportHome(){

	var newxp_exit = choose_one(config.newxp_exits);
	return this.teleportToLocation(newxp_exit.tsid, newxp_exit.x, newxp_exit.y);
}

function teleportSomewhere(){

	var places = [
		['LLIF6R3R9GE1GQB', -37, -40],
		['LLI2V30ECRD1GAU', -2022, -60],
		['LLI32IDPUTD1F2R', -1108, -50],
		['LLI33CQJ3UD1G5J', 456, -185]
	];

	var place = places[Math.floor(Math.random()*places.length)];

	return this.teleportToLocation(place[0], place[1], place[2]);
}


function make_hash(){
	return {
		tsid    : this.tsid,
		label   : this.label,
		is_admin	: (this.is_god || this.is_help) ? true : false,
		is_guide	: this.is_guide ? true : false,
		home_info	: this.houses_get_login_new()
	};
}

function make_hash_online(){
	return {
		tsid	: this.tsid,
		label	: this.label,
		online	: apiIsPlayerOnline(this.tsid),
		is_admin	: (this.is_god || this.is_help) ? true : false,
		is_guide	: this.is_guide ? true : false,
		home_info	: this.houses_get_login_new()
	};
}

function make_hash_with_location(){
	var out = {
		tsid	: this.tsid,
		label	: this.label,
		x	: this.x,
		y	: this.y,
		s	: this.s,
		level	: this.stats_get_level(),
		online	: apiIsPlayerOnline(this.tsid),
		location: {
			tsid	: this.location.tsid,
			label	: this.location.is_hidden() ? 'A secret place' : this.location.label
		},
		rs	: this.isRooked(),
		is_admin	: (this.is_god || this.is_help) ? true : false,
		is_guide	: this.is_guide ? true : false,
		home_info	: this.houses_get_login_new()
	};
	
	out['physics_adjustments'] = this.reducePhysicsAdjustmentsToMinumum(this.getStackedPhysics());

	var props = this.avatar_get_pc_msg_props();
	for (var i in props) out[i] = props[i];
	
	this.games_add_msg_props(out);

	return out;
}

function make_hash_with_avatar(){
	var out = {
		tsid	: this.tsid,
		label	: this.label,
		level	: this.stats_get_level(),
		online	: apiIsPlayerOnline(this.tsid),
		location: {
			tsid	: this.location.tsid,
			label	: this.location.is_hidden() ? 'A secret place' : this.location.label
		},
		is_admin	: (this.is_god || this.is_help) ? true : false,
		is_guide	: this.is_guide ? true : false,
		home_info	: this.houses_get_login_new()
	};
	
	var props = this.avatar_get_pc_msg_props();
	for (var i in props) out[i] = props[i];

	return out;
}

function make_label_hash(){
	return {
		tsid    : this.tsid,
		label   : this.label
	};
}


/***********************************************************************************************************

Camera capabilities

*/


function getCameraAbilities(){
	var range = 0;
	var can_snap = true;
	var disabled_reason = '';
	var skills_eyeballery_msg = '';
	var skills_camera_msg = '';

	if (!this.skills_has('eyeballery_1')){
		range = 400;
		skills_eyeballery_msg = 'With <a href="event:skill|eyeballery_1">Eyeballery</a>, you can move the camera around the whole location.';
	}


	if (!this.imagination_has_upgrade('snapshotting')){
		can_snap = false;
		disabled_reason = 'Get the Snapshottery upgrade first.';
		if (!skills_eyeballery_msg) skills_camera_msg = 'Purchase the Snapshottery upgrade so you can take photos.';
	}

	return {
		range: range, // how many pixels can the camera move from the pc in x/y
		can_snap: can_snap, // can the user take pics
		disabled_reason: disabled_reason, // reason that can_snap is false
		skills_msg: skills_eyeballery_msg+skills_camera_msg // to be displayed when they do not have all the good things they need to use the feature fully
	};
}

function sendCameraAbilities(){
	this.apiSendMsg({
		type: 'camera_abilities_change',
		abilities: this.getCameraAbilities()
	});
}




/***********************************************************************************************************

	NEW PREFERENCES STUFF!

*/

function getPrefs() {
	// new player?
	if (!this.prefs) {
		this.prefs = {};
	}
	
	// make sure they have all the default values
	//---------------------------------------------------------
	
	if (!('int_menu_more_quantity_buttons' in this.prefs)) {
		this.prefs.int_menu_more_quantity_buttons = false;
	}
	
	if (!('int_menu_default_to_one' in this.prefs)) {
		this.prefs.int_menu_default_to_one = false;
	}
	
	if (!('do_oneclick_pickup' in this.prefs)) {
		this.prefs.do_oneclick_pickup = true;
	}
	
	if (!('do_stat_count_animations' in this.prefs)) {
		this.prefs.do_stat_count_animations = true;
	}
	
	if (!('do_power_saving_mode' in this.prefs)) {
		this.prefs.do_power_saving_mode = true;
	}
	
	if (!('up_key_is_enter' in this.prefs)) {
		this.prefs.up_key_is_enter = false;
	}
	
	// correct for old pref names
	//---------------------------------------------------------
		
	if ('no_oneclick_pickup' in this.prefs) {
		this.prefs.do_oneclick_pickup = !this.prefs.no_oneclick_pickup;
		delete this.prefs.no_oneclick_pickup;
	}
	
	// go go go
	return this.prefs;
}

function setPrefs(new_prefs) {
	if (new_prefs) {
		this.prefs = new_prefs;
	}
	
	return this.getPrefs();
}


function openInputBox(uid, title, args){
	// http://tools.tinyspeck.com/pastebin/852
	
	var rsp = {
		type: 'input_request',

		// required
		title: title,
		uid: uid
	};

	for (var i in args){
		rsp[i] = args[i];
	}
	
	this.apiSendMsgAsIs(rsp);
}

function inputBoxResponse(msg){
	// An item asked for this. Tell them.
	if (msg.itemstack_tsid){
		var item = apiFindObject(msg.itemstack_tsid);
		if (item && item.onInputBoxResponse){
			if (item.onInteractionEnding) item.onInteractionEnding(this);

			if (!msg.uid) msg.uid = msg.type;

			return item.onInputBoxResponse(this, msg.uid, msg.body ? msg.body : ((msg.value !== undefined && msg.value !== null) ? msg.value : ''), msg.title ? msg.title : '', msg);
		}
	}
	else if (msg.uid == 'org_create'){
		if (msg.value){
			var value = utils.trim(msg.value.substr(0, 255));
			if (!value) return;

			var org = this.organizations_get();
			if (org){
				org.rename(msg.value);

				this.prompts_add({
					title			: 'Organization Created',
					txt			: "Hurray! Your Organization has been created. Let's go inside to check it out.",
					is_modal		: true,
					icon_buttons	: false,
					choices		: [
						{ value : 'ok', label : 'OK' }
					]
				});
			}
		}
		else{
			this.prompts_add({
				title			: 'Organization Not Created',
				txt			: "You will need to give your Organization a name before other people can enter. Just knock on the door when you're ready to do so.",
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}
	}
	
	// Something else
}

function isOnline(){
	return apiIsPlayerOnline(this.tsid);
}


function reloadGeometry(x, y, type){

	var loading_urls = {
		'street_style'	: ['http://c1.glitch.bz/img/loading/houses_street_style_87558.png' , 500, 211],
		'expand_street'	: ['http://c1.glitch.bz/img/loading/houses_expand_street_87558.png', 500, 211],
		'expand_house'	: ['http://c1.glitch.bz/img/loading/houses_expand_house_87558.png' , 500, 211],
		'add_floor'	: ['http://c1.glitch.bz/img/loading/houses_add_floor_87558.png'    , 500, 211],
	};

	// Start music
	if (this.location.geometry.music_file){
		this.apiSendAnnouncement({type: 'stop_all_music'});
		this.announce_music(this.location.geometry.music_file, 999);
	}

	var more = {
		force_location_reload: true,
		change_type: type,
	};
	if (loading_urls[type]){
		var img = loading_urls[type];
		more.loading_img = { url: img[0], w: img[1], h: img[2] };
	}

	this.teleportToLocationDelayed(this.location.tsid, x, y, more);
	//log.info('done!');
}

function get_meditation_bonus(){
	// We are now adjusting the meditation limit based on upgrades instead of skill level.
	
	if (this.imagination_has_upgrade("meditative_arts_daily_limit_2")) { 
		return 1.5;
	}
	else if (this.imagination_has_upgrade("meditative_arts_daily_limit_1")) { 
		return 1.25;
	}
	else {
		return 1;
	}
}

function onPeriodicEnergyLoss(){
	if (!this.isOnline()) return;

	if (!this['!in_house_deco_mode'] && !this.location.isParadiseLocation() &&  ((!this['!meditating'] || this['!meditating'] != 'transcendental'))){
		var to_lose = 0;
		if (this.has_done_intro){
			// people should lose an amount of energy equal to 0.8% of their total energy capacity (rounded, of course) every 90 secs
			to_lose = Math.round(this.metabolics_get_max_energy() * 0.008);
		}
		else if (!this.has_done_intro && !this.location.isInstance('newxp_intro') && !this.location.isInstance('newxp_training1') && !this.location.isInstance('newxp_training2')){
			if (this.metabolics_get_percentage('energy') > 50) to_lose = Math.round(this.metabolics_get_max_energy() * 0.008);
		}

		if (to_lose){
			//log.info(this+ ' losing energy: '+to_lose);
			this.metabolics_lose_energy(to_lose, 1);
		}
	}
	
	this.apiCancelTimer('onPeriodicEnergyLoss');
	this.apiSetTimer('onPeriodicEnergyLoss', 90000);
}

//  1 minute periodic check
function onPlayTimeCheck() {

	if (!this.isOnline()) return;
	
	var play_time = this.getTimePlayed();
	play_time += time() - this.date_last_loggedin;
	
	// If the player already has the 11 hour achievement, stop checking.
	if (this.achievements_has('major_player')) return;
	
	if (play_time >= 39600) {
		this.achievements_grant('major_player');
	}
	else {
		this.apiSetTimer('onPlayTimeCheck', 60000);
	}
}

function isOverDailyFoodLimit(){
	return this.food_today >= (this.metabolics.energy.top * config.food_energy_limit);
}

function getDailyFoodPercentage(){
	if (!this.food_today) return 0;
	return this.food_today / (this.metabolics.energy.top * config.food_energy_limit) * 100;
}

//
// For making interrupting things (trant convos, frogs etc) less
// interrupty when we need the player to focus on something else

function doNotDisturb() {
	return this.do_not_disturb;
}

function setDoNotDisturb(max_secs){

	var max_time = max_secs*1000;

	if (!max_time){
		max_time = 60000;
	}

	if (this.do_not_disturb){
		return false;
	} else {
		this.do_not_disturb = true;
		this.apiSetTimer('clearDoNotDisturb',max_time);
		return true;
	}
}

function clearDoNotDisturb(){
	this.do_not_disturb = false;
	return true;
}

function buildPath(dst, src){
	
	var dst_array = (typeof dst == 'object' && dst.length);
	
	//
	// Figure out where we're coming from. If not told, then it's our current location.
	// If the start street is *really* something else, use that instead (instances go from their templates, etc)
	//

	var src_street;
	if (!src){
		if (this.location.instance_of){
			src = this.location.instance_of;
		}
		else if (this.location.mapLocation){
			src = this.location.mapLocation;
		}
		else{
			src = this.location.tsid;
		}

		src_street = apiFindObject(src);
	}
	else{
		src_street = apiFindObject(src);

		if (src_street.instance_of){
			src = src_street.instance_of;
			src_street = apiFindObject(src);
		}
		else if (src_street.mapLocation){
			src = src_street.mapLocation;
			src_street = apiFindObject(src);
		}
	}


	//
	// If our source is a house, just exit, since we can't do pathing from there
	//

	if (src_street.pols_is_home()){
		return {ok: 0, error: "Return to the world to continue on your path", non_fatal: 1};
	}


	//
	// Ok, build a path
	//
	
	var dst_street;
	var path;

	//
	// Are we looking for a path to one of many locations?
	//

	if (dst_array){
		var fix_dst = [];
		
		for (var i in dst){
			dst_street = apiFindObject(dst[i]);
			if (!dst_street){
				return {ok: 0, error: "You're already there! (or really, really close)", non_fatal: 1};
			}

			if (dst_street.instance_of){
				dst_street = dst_street.instance_of;
			}
			else if (dst_street.mapLocation){
				dst_street = dst_street.mapLocation;
			}

			// Don't path to the destination we're already on
			if (src == dst_street){
				return {ok: 0, error: "You're already there! (or really, really close)", non_fatal: 1};
			}
			
			fix_dst.push(dst_street);
		}

		if (config.is_dev) log.info(this+' apiFindShortestGlobalPath: '+src+', '+fix_dst);
		path = apiFindShortestGlobalPath(src, fix_dst);

	}
	else{
		dst_street = apiFindObject(dst);
	
		if (dst_street.instance_of){
			dst = dst_street.instance_of;
		}
		else if (dst_street.mapLocation){
			dst = dst_street.mapLocation;
		}
	
		// Don't path to the destination we're already on
		if (src == dst){
			return {ok: 0, error: "You're already there! (or really, really close)", non_fatal: 1};
		}
	
		if (config.is_dev) log.info(this+' apiFindGlobalPathX: '+src+', '+dst);
		path = apiFindGlobalPathX(src, dst);

	}

	if (config.is_dev) log.info(this+' path: '+path);
	if (!path.length){
		return {ok: 0, error: "Path not found"};
	}

	// hack to get around missing source
	if (path[0].tsid != src){
		path.unshift({tsid: src, to: 50});
	}

	var street = apiFindObject(path[path.length-1].tsid);
	if (!street){
		return {ok: 0, error: "Destination not found"};
	}
	
	this.setPath(path);
	
	return {ok: 1, path: this.getPathRsp()};
}

function setPath(path){

	var path_obj = {};
	for (var i=0; i<path.length; i++) path_obj[i] = path[i];

	this.map_path = path_obj;
}

function getPathDestTsid(){
	if (!this.map_path){
		return false;
	} else {
		var rsp = this.getPathRsp();
		return rsp.destination.street_tsid;
	}
}

function getPathRsp(){

	if (!this.map_path) return false;

	var out_rich = [];
	var out_simple = [];
	var last_tsid = '';

	for (var i in this.map_path){

		// old-style path. delete it
		if (!this.map_path[i].tsid){
			delete this.map_path;
			return false;
		}

		// push it
		out_rich.push(this.map_path[i]);
		out_simple.push(this.map_path[i].tsid);

		last_tsid = this.map_path[i].tsid;
	}

	var dest = last_tsid ? apiFindObject(last_tsid) : null;

	if (!dest){
		delete this.map_path;
		return false;
	}

	return {
		path		: out_simple,
		path_new	: out_rich,
		destination	: dest.get_client_info()
	};
}

function clearPath(){

	delete this.map_path;
}

function updateMap(){
	var rsp = {
		type: 'map_get',
		hub_id: this.location.hubid
	};
	rsp.mapData = this.location.get_map(this);
	this.apiSendMsg(rsp);
}

function sneeze(){
	this.announce_sound('SNEEZING_AHCHOO');
	
	// Don't lock everyone during sneezing
	var annc = {
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('overlay_sneezing_powder'),
			duration: 2000,
			pc_tsid: this.tsid,
			delta_x: 0,
			delta_y: -110,
			width: 300,
			height: 300
	};

	this.location.apiSendAnnouncementX(annc, this);
	annc.locking = true;
	this.apiSendAnnouncement(annc);

	this.sendActivity('Achoo!! Argh! Hate that.');
}

function onCreateItemEvent(details){
	this.location.createItem(details.class_tsid, details.count, details.x, details.y, 100);
}

function transit_familiar_pay_fare(choice, details){
	if (choice == 'start'){

		return {
			txt : "The fare is "+details.cost+" currants. Pay it?",
			choices : {
				1: {
					txt: "Yes",
					value: 'pay'
				},
				2: {
					txt: "No",
					value: 'no-pay'
				}
			}
		};
	}

	if (choice == 'pay'){

		var loc = apiFindObject(details.loc_tsid);

		var transit_id = details.target_tsid.substr(13);
		if (loc.transit_pay_fare(this, transit_id)){
			this.announce_sound('PURCHASE_ITEM');
			return {
				txt : "Thanks! You may now board.",
				done : true
			};
		}
		else{
			return {
				txt : "Whoops! Looks like you can't afford that.",
				done : true
			};
		}
	}

	return {done: true};
}

function transit_familiar_doors_closed(choice, details){

	return {
		txt: "The doors are closed",
		done: true
	};
}

function transit_disembark_callback(value, details){
	if (!this.location.is_transit || this.location.is_departed) return false;

	var current_stop = this.location.transit_get_current_stop(this.location.instance_id);
	if (value == 'train-disembark'){
		this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'transit_announcement'});
		this.teleportToLocationDelayed(current_stop.tsid, current_stop.x, current_stop.y);
	}
}

// Sends a message to the player, catching exceptions and discarding them
// apiIsPlayerOnline is "expensive" and doesn't catch all the error conditions anyway
// So if you want to send a message to a player, and you don't care if they don't get it, use this!
function sendMsgOnline(out){
	try{
		this.apiSendMsg(out);
		return true;
	}
	catch (e){
		return false;
	}
}

function fireflyWhistleSwallowed(details){
	if (details.step == 1){
		this.playHitAnimation('hit2');
		this.events_add({callback: 'fireflyWhistleSwallowed', step: 2}, 0.25);
	}
	else if (details.step == 2){
		this.playHitAnimation('hit1');
		this.events_add({callback: 'fireflyWhistleSwallowed', step: 3}, 0.25);
	}
	else if (details.step == 3){
		this.playHitAnimation('hit2');
		this.events_add({callback: 'fireflyWhistleSwallowed', step: 4}, 0.25);
	}
	else if (details.step == 4){
		this.stopHitAnimation();
		this.playEmotionAnimation('surprise');
		this.announce_pc_overlay({
			duration: 4000,
			delay_ms: 0,
			locking: true,
			width: 100,
			height: 100,
			bubble_talk: true,
			pc_tsid: this.tsid,
			delta_x: 0,
			delta_y: -219,
			text: [
				'<span class="simple_panel">Gah. I\'ve swallowed it!</span>'
			]
		});
		this.events_add({callback: 'fireflyWhistleSwallowed', step: 5}, 2);
	}
	else if (details.step == 5){
		this.achievements_grant('firefly_whistling');
		this.sendActivity('Oops, you swallowed the whistle! I guess that still counts?');
		this.events_add({callback: 'fireflyWhistleSwallowed', step: 6}, 2);
	}
	else if (details.step == 6){
		this.quests_set_flag('firefly_whistle_obtained');
	}
}

function linkifyLabel(){
	return '<a href="event:pc|'+this.tsid+'">'+utils.escape(this.label)+'</a>';
}

function isGreeter(){
	return (this.groups_has(config.greeter_group) && this.items_has('bag_greeter_badge', 1));
}

function isFreeGreeter(){
	if (this.isGreeter()){
		if (this.greeting_muted === undefined) this.greeting_muted = true;
		if (this.is_dead) return false;
		if (this.greeting_muted) return false;
		if (this.games_is_playing()) return false;
		if (this.isGuideOnDuty()) return false;
		if (!this.groups_is_in_chat(config.greeter_group)) return false;
		
		//if (this.location.isGreetingLocation() && this.location.countGreeters() < this.location.getNumActivePlayers() && this.location.countGreeters() == 1) return false;
		//if (this.location.isGreetingLocation() && (!this.is_god || this.tsid == 'PLI16FSFK2I91')) return false;
		if (this.location.isGreetingLocation()) return false;
		if (this.location.isInstance()) return false; // http://bugs.tinyspeck.com/5912

		if (this.isGreeterTrainee()) return false;

		return true;
	}
	
	return false;
}

function isGreeterTrainee(){
	return this.greeting_graduated ? false : true;
}

function setGreeterGraduate(){
	delete this.successful_greets;
	delete this.unsuccessful_greets;
	this.greeting_graduated = true;

	this.prompts_add_simple("You did it! You can now unmute your Greeter Badge and fly solo. Thank you for all you do!");
	this.groups_chat(config.greeter_group, "I just graduated from the greeter training program!");
	if (!config.is_dev) utils.irc_inject('#greeters', this.label+' just graduated from the greeter training program.');
}

function greeter_training_callback(value, details){
	if (this.isGreeterTrainee()) return;
	if (!this.isGreeter()) return;

	var pc = getPlayer(details.trainee);
	if (!pc) return;

	if (value == 'up'){
		if (pc.successful_greets === undefined) pc.successful_greets = 0;
		pc.successful_greets++;

		if (pc.successful_greets >= 3){
			pc.setGreeterGraduate();
		}
	}
	else if (value == 'down'){
		if (pc.successful_greets === undefined) pc.unsuccessful_greets = 0;
		pc.unsuccessful_greets++;
	}
}

// http://wiki.tinyspeck.com/wiki/SpecUICallout
var valid_callout_sections = ['character', 'level', 'xp', 'energy', 'mood', 'currants', 'familiar', 'mini_map', 'buffs', 'chat_friends', 'chat_help', 'chat_local', 'chat_party', 'backpack', 'clock', 'volume_control', 'chat_active'];
function ui_callout(section, duration){
	if (!in_array_real(section, this.valid_callout_sections)) return false;
	
	this.apiSendMsg({
		type: "ui_callout",
		section: section,
		swf_url: overlay_key_to_url('up_arrow'),
		scale: 1, //how much to scale the overlay (if not set will assume "1")
		display_time: intval(duration) //how long to show it in ms (if not set default is 5000 -- if set to 0 it never goes away until a ui_callout_cancel is sent)
	});
	
	return true;
}

function ui_callout_cancel(){
	this.apiSendMsg({
		type: "ui_callout_cancel"
	});
}

function placeInTimeout(args){
	this.is_in_timeout = 1;

	var args = {
		'tsid': this.tsid,
		'key': 'is_in_timeout',
		'value': 1
	};

	utils.http_get('callbacks/player_update.php', args);
	
	//
	// Kick offline
	//
	
	var msg = "Your account has been suspended.";
	var url = "/";

	if (args){
		if (args.msg) msg = args.msg;

		if (args.url) url = args.url;
	}
	
	var rsp = {
		type:"booted",
		msg: msg,
		url: url
	};
	
	this.apiSendMsg(rsp);
}

function removeFromTimeout(args){
	delete this.is_in_timeout;

	var args = {
		'tsid': this.tsid,
		'key': 'is_in_timeout',
		'value': 0
	};

	utils.http_get('callbacks/player_update.php', args);
}

function isInTimeout(){
	return this.is_in_timeout ? true : false;
}

function placeInConeOfSilence(args){
	if (args && args.type == 'help'){
		this.is_in_help_coneofsilence = 1;
	}
	else{
		this.is_in_coneofsilence = 1;
	}
}

function removeFromConeOfSilence(args){
	if (args && args.type == 'help'){
		delete this.is_in_help_coneofsilence;
	}
	else{
		delete this.is_in_coneofsilence;
	}
}

function isInConeOfSilence(type){
	if (type == 'help'){
		return this.is_in_help_coneofsilence ? true : false;
	}
	else{
		return this.is_in_coneofsilence ? true : false;
	}
}

// Multiple splankings for people who do bad things
function naughtySplanking(count,spacing){
	this.naughty_splanking = {};

	this.naughty_splanking.count = count ? count : 3;
	this.naughty_splanking.spacing = (spacing > 3.5) ? spacing : 3.5;
	this.naughty_splanking.delivered = 0;

	return this.doNaughtySplanking();
}


function doNaughtySplanking(){
	if (!this.naughty_splanking){
		apiCancelTimer('doNaughtySplanking');
		return false;
	}

	// we deliver mood drops in an off-by-one manner
	// otherwise they happen before the splank animation is underway
	// and it looks kinda stoopid
	//
	if (this.naughty_splanking.delivered > 0){
		this.metabolics_lose_mood(10);
	}
	if (this.naughty_splanking.delivered == this.naughty_splanking.count){
		delete this.naughty_splanking;
		return true;
	}

	var rsp = {
		type: 'vp_overlay',
		item_class: "plank",
		state: "emote_animation",
		duration: 10000,
		size: "225%",
	};
	this.apiSendAnnouncement(rsp);
	
	this.naughty_splanking.delivered++;

	this.apiSetTimer('doNaughtySplanking',this.naughty_splanking.spacing*1000);
	return true;
}

// Have they learned about energy yet?
function knowsAboutEnergy(){
	return (this.has_done_intro || this.location.is_skillquest || this.location.is_newxp);
}

// Called by lib_players.php when we change the player label
function onLabelChanged(){
	this.buddies_update_reverse_cache();
	delete this.quickstart_needs_player;

	this.apiSendMsg({
		type: 'pc_rename',
		pc: this.make_hash()
	});
}

function onQuickReg(args){

	if (args && args.new_token){
		this.apiSendMsg({type: 'new_api_token', token: args.new_token});
	}
	
	delete this.quickstart_needs_account;
	this.changeUIComponent('create_account', false);

	if (this.location.instance_id == 'NB_Street4'){
		this.location.events_broadcast('disable_wall');
	}

	if (args && args.new_token){
		this.apiSendMsg({type: 'new_api_token', token: args.new_token});
	}
}

function show_rainbow(overlay_key, delay){
	var duration = 4000;
	var args = {
		type: 'pc_overlay',
		swf_url: this.overlay_key_to_url(overlay_key),
		duration: duration,
		pc_tsid: this.tsid,
		delta_x: 0,
		delta_y: 0,
		width: 400,
		height: 400,
		dont_keep_in_bounds:true
	};
	
	if (delay) args.delay_ms = delay;
	
	if (overlay_key == 'rainbow_secretspot') {
		this.apiSendAnnouncement(args);
	}
	else {
		this.location.apiSendAnnouncement(args);
	}
	
	switch (overlay_key){
		case 'rainbow_100coinstoday':
			this.announce_sound('RAINBOW_100COINSTODAY', 0, 0, true);
			break;
		case 'rainbow_goodjob':
			this.announce_sound('RAINBOW_GOODJOB', 0, 0, true);
			break;
		case 'rainbow_maxrelax':
			this.announce_sound('RAINBOW_MAXRELAX', 0, 0, true);
			break;
		case 'rainbow_randomkindness':
			this.announce_sound('RAINBOW_RANDOMKINDNESS', 0, 0, true);
			break;
		case 'rainbow_spindoctor':
			this.announce_sound('RAINBOW_SPINDOCTOR', 0, 0, true);
			break;
		case 'rainbow_superharvest':
			this.announce_sound('RAINBOW_SUPERHARVEST', 0, 0, true);
			break;
		case 'rainbow_winner':
			this.announce_sound('RAINBOW_WINNER', 0, 0, true);
			break;
		case 'rainbow_youdidit':
			this.announce_sound('RAINBOW_YOUDIDIT', 0, 0, true);
			break;
		case 'rainbow_secretspot':
			this.announce_sound('RAINBOW_SECRETSPOT', 0, 0, true);
			break;
	}
}

function stopFollowing() {
	this.apiStopFollowing();

	// Remove followee, and take us off their list of followers
	if(this.followee) {
		var followee = getPlayer(this.followee);
		var list = followee.followers;
		if(followee && list && list[this.tsid]) {
			delete list[this.tsid];
			followee.updateGlitchTrain(followee.location);
			
			// Update rest of followers:
			for (var other in list) {
				var pc = getPlayer(other);
				pc.updateGlitchTrain(pc.location);
			}
		}
	}
	
	this.updateGlitchTrain(this.location);
	
	delete this.followee;
}

function removeFollowers() {
	this.apiRemoveAllFollowers();
	
	// Remove followers from our list of follower references
	for(var follower in this.followers) {
		var follow_pc = getPlayer(follower);
		if(follow_pc && follow_pc.followee) {
			delete follow_pc.followee;
			follow_pc.updateGlitchTrain(follow_pc.location);
		}
	}
	this.followers = {};
	this.updateGlitchTrain(this.location);
}

function countFollowers(){
	return num_keys(this.followers);
}

function getFollowee(){
	return this.followee;
}

/**
	Support for the Glitch Train achievement. Count the length of a conga line following this player. This player is included in the count.
	
	Takes the name of the current location, and updates the counter for that location.
*/
function updateGlitchTrain(location){
	
	// A "conga line" consists of lots of players following one leader. 
	// So, either this player is being followed by 19 other players, or this player is following somebody 
	// who is being followed by 19 players.
	
	var chain_length = this.countFollowers();	// if this number is non-zero, then this player is the leader
	
	var leader = getPlayer(this.followee);		// otherwise, get the leader
	
	if (leader) {
		chain_length += leader.countFollowers(); // includes this player
	}
	
	chain_length ++; // add in the leader
	
	//this.sendActivity('Total chain length: '+chain_length);
	
	var required_length = 20;
	
	if (config.is_dev){
		required_length = 3;	// easier testing
	}
	
	// Increment glitch train if chain is at least 20
	if (chain_length >= required_length) {
		this.achievements_increment('glitch_train', location);
		this.buffs_apply('glitch_train');
	}
	else {
		if (this.buffs_has('glitch_train')){
			this.achievements_reset_group('glitch_train');	// continuous achievement, reset if conditions not met
			this.buffs_remove('glitch_train');
		}
	}
}

function admin_updateHelpCase(args){

	this.sendMsgOnline({
		'type'		: 'update_help_case',
		'case_id'	: args.case_id,
	});
}

//############################################################################

function onPlayerCollision(pc){
	log.info(this+' collided with '+pc+'!!!');
	
	if (this.buffs_has('feeling_called_love') && !pc.buffs_has('feeling_called_love')){
		this.buffs_transfer_love(pc);
	}
	
	this.games_handle_player_collision(pc);
}

function setPlayerCollisions(flag){
	this.p2p_collisions = flag ? 1 : 0;
}

function hasPlayerCollisions(){
	return this.p2p_collisions ? true : false;
}

//############################################################################

function hidePack(){
	this.sendMsgOnline({
		'type': 'ui_visible',
		'pack': false
	});
}

function showPack(){
	this.sendMsgOnline({
		'type': 'ui_visible',
		'pack': true
	});
}

function isGuideOnDuty(){
	return (this.is_guide && this.guide_on_duty) ? true : false;
}

function lastActiveCallback(type){
	var args ={
		'tsid': this.tsid,
		'type': type ? type : ''
	};

	utils.http_get('callbacks/player_active.php', args);
}

function sorryForDeletingYourTPTarget(){
	if (this.already_sorry) return true;
	 
	var bag = this.mail_get_bag();
	if (!bag) return false;
	var slot = bag.firstEmptySlot();
	
	var s = apiNewItemStack('note', 1);
	if (!s){
		log.error("Couldn't create apology note for player "+this);
		return false;
	}
	else{
		log.info("Creating apology note "+s+" for player "+this);
		s.contents = "Hello!\n\n";

		s.contents += "Congratulations! You are one of the few lucky glitches who has been affected by our most recent game play \"adjustment\".\n\n";

		s.contents += "And I mean \"affected\" in the sense of \"mildly inconvenienced\". But \"lucky\" because Tiny Speck want to send you a gift to compensate you for that mild inconvenience. Yay!\n\n";

		s.contents += "We recently made a change to the way teleportation works in certain areas of the world.  Some streets that you could once set a teleportation point to are no longer accepting such points.  These areas are typically streets that are behind key-locked doors, although there are some exceptions to the rule.\n\n";

		s.contents += "You, esteemed glitch, once had a teleportation point set to one of these areas. That point has since been removed - and for both your inalienable glitchiness, and your awesome patience and understanding in this matter, we want to offer you a small token of our appreciation.\n\n";

		s.contents += "And, by \"small\", I mean, specifically, \"7\".\n\n";

		s.contents += "That is, we have added 7 free teleportation tokens to your account, and we apologize for the inconvenience. \n\n";

		s.contents += "But, it's for the greater good! And so are you! Great? Good!\n\n";

		s.contents += "Sincere thanks,\n";
		s.contents += "Tiny Speck";
	}

	if (bag.addItemStack(s, slot)){
		log.error("Failed to add apology note "+s+" to player "+this);
		return false;
	} 
	
	this.teleportation_give_tokens(7, "Sorry for deleting your Teleportation target.");
	this.mail_add_player_delivery(s.tsid, null, 0, "Here's a special delivery just for you!", config.mail_delivery_time_with_attachment, false);
	this.already_sorry = true;

	return true;
}

function getLocationType(){
	return this.location.getType();
}

function getLocationTypeInfo(){
	return this.location.getTypeInfo();
}

function getLocation(){
	return this.location;
}

//
// Handle deleted player accounts.
//
// Keys are rescinded immediately, though, to stop puppet/alt-shenanigans
//
function deletePlayer(){
	
	log.info("Deleting player "+this.tsid);
	
	this.is_deleted = true;

	this.skills_cancel_learning();

	var house = this.houses_get();
	if (house) {
		house.acl_keys_remove_all_keys();
	}

	this.buddies_update_reverse_cache();

	//
	// Kick offline
	//
	
	var msg = "Your account has been deleted.";
	var url = "/";
	
	var rsp = {
		type:"booted",
		msg: msg,
		url: url
	};
	
	this.apiSendMsg(rsp);
}

//
// Undo a player account deletion.
//
function undeletePlayer(){
	log.info("Undeleting player "+this.tsid);

	delete this.is_deleted;
	
	this.buddies_update_reverse_cache();
}

function isDeleted(){
	return this.is_deleted;
}

// Utility for testing.
function clearHellWarning() {
	this.hasBeenWarned = false;
}

// used to deal with simple message reply in main.js
// $msg is the original message, $ret is the result of the method handler
function replyToMsg(msg, ret){

	var rsp = ret.ok ? make_ok_rsp(msg) : make_fail_rsp(msg, 0, ret.error);

	for (var i in ret){
		if (i == 'ok') continue;
		if (rsp[i]) continue;
		rsp[i] = ret[i];
	}

	return this.apiSendMsg(rsp);
}

function cleanUpHouses(){

	//log.info('cleaning up houses - START');

	for (var i in this.houses){
		var obj = apiFindObject(i);
		if (obj){
			if (obj.class_tsid == 'home'){
				if (obj.tsid != this.home.interior.tsid && obj.tsid != this.home.exterior.tsid){

					delete this.houses[i];
					log.info('delete house - not current', i);
				}
			}
		}else{
			delete this.houses[i];
			log.info('delete house - object not found', i);
		}
	}

	//log.info('cleaning up houses - DONE');
}

function buildMachine(machine_id, current_part, step){
	if (!this.items_has('blockmaker_chassis', 1) ||
	    !this.items_has('blockmaker_engine', 1) ||
	    !this.items_has('blockmaker_plates', 1)){
		return;
	}
	
	var new_part_class_tsid;
	log.info('BUILDMACHINE: step: '+step);
	if (machine_id == 'blockmaker'){
		switch (step+1){
			case 1:{ new_part_class_tsid = 'blockmaker_chassis'; break; }
		}
	}
	
	log.info('BUILDMACHINE: new_part_class_tsid: '+new_part_class_tsid);
	if (!new_part_class_tsid) return false;

	var stack = this.removeItemStackClass('blockmaker_chassis', 1);
	if (stack){
		var new_part = current_part.replaceWith(new_part_class_tsid, false, 1);
		if (new_part) new_part.onApplyPart();
	}

}

function overlayDismissed(pc){
	if (this.location.is_newxp){
		this.location.overlayDismissed(pc);
	}
}

function changeUIComponent(ui_component, enable){
	var args = {type: 'ui_visible'};
	args[ui_component] = enable;
	this.apiSendMsgAsIs(args);
}

function canJoinTradeChat(){
	return this.imagination_has_upgrade('trade_channel');
}

function getLabel(){
	return utils.escape(this.label);
}

function getJumpCount(){
	return this.jump_count;
}

function resetQuickstartNeeds(){
	this.quickstart_needs_player = true;
	this.quickstart_needs_avatar = true;
	this.quickstart_needs_account = true;
}

function getCraftybot(){
	if (!this.crafty_bot || !this.crafty_bot.tsid) return null;
	return apiFindObject(this.crafty_bot.tsid);
}


//
// this function returns all of the GS info needed for the HQ home screen
//

function getHQInfo(){

	var ret = {};


	//
	// today's activity.
	// img, energy, achieves, skills, upgrades
	//

	ret.online_today = false;

	var today = current_day_key();
	var activity = this.daily_history_get_day(today);

	if (activity){

		ret.online_today = true;
		ret.activity = {
			'img'		: intval(activity.imagination),
			'xp'		: intval(activity.xp),
			'energy'	: intval(activity.energy_consumed),
			'achievements'	: activity.achievements ? intval(activity.achievements.length) : 0,
			'skills'	: activity.skills_learned ? intval(activity.skills_learned.length) : 0,
			'upgrades'	: activity.upgrades_purchased ? intval(activity.upgrades_purchased.length) : 0
		};
	}


	//
	// counters
	//

	ret.unread_mail = this.mail_count_messages();
	ret.butler_packages = this.has_butler() ? this.getButler().getNumPackagesTotal() : 0;
	ret.currants_to_collect = this.houses_get_currants_to_collect();
	ret.img_to_collect = this.houses_get_img_rewards();
	ret.active_quests = this.countAcceptedQuests();


	//
	// skills
	//

	ret.skills = this.skills_get_active_progress();


	//
	// active vendor?
	//

	var vendors = ['alchemical-goods', 'animal-goods', 'gardening-goods',
			'groceries', 'hardware', 'kitchen-tools', 'produce',
			'toys', 'mining'];

	ret.best_vendor = vendors[randInt(0,vendors.length-1)]; // TODO


	return ret;
}

function createCraftybot(x){
	var crafty_bot = this.location.createAndReturnItem('npc_crafty_bot', 1, x, this.y, 0);
	if (crafty_bot){
		this.crafty_bot = {};
		this.crafty_bot.tsid = crafty_bot.tsid;
		crafty_bot.owner = this;
//		crafty_bot.setState('idle');
		this.sendActivity('All hail the Craftybot.');
	}
}