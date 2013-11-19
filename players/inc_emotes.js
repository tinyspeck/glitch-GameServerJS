// do not call this directly! shoudl be called only from
// setHiEmoteVariantRandomly() or setHiEmoteVariantFromInfector()
function setHiEmoteVariant(variant, tracker_str) {
	if (this.hi_emote_variant) {
		// we never expect this to happen if this.hi_emote_variant has not been removed by newday
		return;
	}

	// make sure we get a valid variant
	if (config.hi_emote_variants.indexOf(variant) == -1) {
		return;
	}
	
	this.hi_emote_variant = variant;
	
	// make sure we have the daily target dc
	if (!this.hi_emote_daily_targets) {
		this.hi_emote_daily_targets = apiNewOwnedDC(this);
	}
		
	// remember yesterdays
	this.hi_emote_daily_targets.pcs_yesterday = this.hi_emote_daily_targets.pcs || {};
	this.hi_emote_daily_targets.butlers_yesterday = this.hi_emote_daily_targets.butlers || {};
	
	// make em fresh
	this.hi_emote_daily_targets.pcs = {};
	this.hi_emote_daily_targets.butlers = {};
	
	// track it!
	var hi_variants_tracker = apiFindObject(config.hi_variants_tracker);
	var leaderboard = hi_variants_tracker.increment_count(variant, tracker_str);
	if (config.feature_hi_viral) {
		var msg = {
			type: 'hi_emote_leaderboard',
			leaderboard: leaderboard
		};
		
		this.location.apiSendMsg(msg);
	}
		
	this.apiSendMsg({
		type: 'hi_emote_variant_set',
		variant: variant
	});
	
	return variant;
}

function setHiEmoteVariantRandomly() {
	var variant = choose_one(config.hi_emote_variants);
	if (config.feature_hi_viral) {
		// log it
		apiLogAction('HI_SIGN_GOT_RANDOM', 'pc='+this.tsid,'variant='+variant);
	}
	
	return this.setHiEmoteVariant(variant, 'random');
}

function setHiEmoteVariantFromInfector(infector) {
	if (!infector.hi_emote_variant) return;
	
	var variant = infector.hi_emote_variant;
	
	if (config.feature_hi_viral) {
		// log it
		if (infector.is_player) {
			apiLogAction('HI_SIGN_INFECTED_BY_PC', 'pc='+this.tsid,'variant='+variant,'infector='+infector.tsid);
			apiLogAction('HI_SIGN_INFECTED_PC', 'pc='+infector.tsid,'variant='+variant,'infectee='+this.tsid);

			infector.achievements_increment('infected_pc', variant, 1);
			this.achievements_increment('infected_by_pc', variant, 1);
		} else {
			apiLogAction('HI_SIGN_INFECTED_BY_BUTLER', 'pc='+this.tsid,'variant='+variant,'infector='+infector.tsid);

			this.achievements_increment('infected_by_butler', variant, 1);
		}
	}

	return this.setHiEmoteVariant(variant, infector.tsid);
}

function doEmote(msg){
	if (msg.emote != 'hi') {
		return this.apiSendMsg(make_fail_rsp(msg, 0, 'Unrecognized emote: '+msg.emote));
	}
	
	this.apiSendMsg(make_ok_rsp(msg));
	
	var activity_str;
	var target_activity_str;
	var did_get_sign_randomly = false;
	var did_infect_target_pc = false;
	var did_infect_butler = false;
	
	var base_mood = config.hi_emote_base_mood;
	var bonus_mood = config.hi_emote_bonus_mood;
	
	// get the variant of the day for this person
	var variant = this.hi_emote_variant;
	if (!variant) {
		did_get_sign_randomly = true;
		variant = this.setHiEmoteVariantRandomly();
	}
	
	var variant_name = config.hi_emote_variants_name_map[variant];
	
	// which way is player facing?
	var facing = intval(this.s) / Math.abs(intval(this.s));
	
	var target_variant;
	var radius = 400; // we want things within 400 pixels of player
	var center_x = this.x;
	var center_y = this.y;
	var players;
	var shards;
	var target_pc;
	var potential_target_pc_behind;
	var do_bonus = false;
	var nearby_butler;
	var butler_is_target = false;
	
	// so we know the polayer has said hi at some point
	this.counters_increment("emotes", "hi");
	
	// Find a butler
	var items = this.location.apiGetItemsInTheRadius(center_x, center_y, radius);
	for (var i in items) {
		if (items[i].class_tsid === "bag_butler") {
			nearby_butler = items[i];
			break;
		}
	}
	
	// we prefer butlers over players! find out if we have already said hi today
	if (nearby_butler) {
		// we need this only for the the current game day as I am writing this
		if (!this.hi_emote_daily_targets.butlers) this.hi_emote_daily_targets.butlers = {}; 
		
		if (!this.hi_emote_daily_targets.butlers[nearby_butler.tsid]) {
			// they have not said hi to this butler today!
			butler_is_target = true;
		}
	}
	
	// if not saying hi to butler, then look for players
	if (!butler_is_target) {
		players = this.location.apiGetActivePlayersInTheRadiusX(center_x, center_y, radius);
		for (var i in players){
	
			// Ignore the acting pc
			if (players[i].pc == this) continue;
			
			// not with people blocked or blocking
			if (this.buddies_is_ignored_by(players[i].pc)) continue;
			if (players[i].pc.buddies_is_ignored_by(this)) continue;
				
			// Check to make sure players[i].pc has not been said "hi" to by pc in this game day
			if (this.hi_emote_daily_targets.pcs[players[i].pc.tsid]) continue;
			
			// if players[i].x is behind the player, keep track of it in case we don't find someone in front of the player
			if ((facing == 1 && players[i].x < this.x) || (facing == -1 && players[i].x > this.x)) {
				if (potential_target_pc_behind) continue;
				
				// keep track of this guy
				potential_target_pc_behind = players[i].pc;
				continue;
			}
	
			// if we got here, we have a valid target pc for the hi emote
			target_pc = players[i].pc;
			
			// we only want one!
			break;
		}
	
		target_pc = target_pc || potential_target_pc_behind;
	}
	
	if (target_pc) {
		
		// let's make sure they get a variant
		if (config.feature_hi_viral) {
			target_variant = target_pc.hi_emote_variant;
			if (!target_variant) {
				did_infect_target_pc = true;
				target_variant = target_pc.setHiEmoteVariantFromInfector(this);
			}
		} else {
			target_variant = target_pc.hi_emote_variant || target_pc.setHiEmoteVariantRandomly();
		}
		
		// record it
		this.hi_emote_daily_targets.pcs[target_pc.tsid] = time();
		
		// add to shards
		shards = [{pc_tsid: target_pc.tsid}];
		
		// if the target of the hi emote recently targeted this player with an emote of the same variant, bonus!
		if (target_variant == variant) {
			if (this.tsid in target_pc.hi_emote_daily_targets.pcs) {
				do_bonus = true;
			}
		}

		// Achievements
		this.achievements_increment_daily('said_hi', target_pc.tsid, 1);
		if (this.achievements_get_daily_group_count('said_hi') >= 53){
			this.achievements_grant('social_butterfly');
		}

		this.achievements_increment('hi_variants', variant, 1);
		
		// Give rewards
		if (do_bonus) {
			this.apiSetTimer('doHiEmoteBonusWithOtherPlayer', 2000, target_pc, msg.emote, variant, bonus_mood, base_mood+bonus_mood);
		} else {
			// give mood to target here only if we are not doing bonus
			var mood_granted = target_pc.metabolics_add_mood(base_mood);
			shards[0].mood_granted = mood_granted;
		}
		
	} else if (nearby_butler) {
		if (butler_is_target) {
			
			this.hi_emote_daily_targets.butlers[nearby_butler.tsid] = time();
			shards = [{mood_granted: 0, itemstack_tsid: nearby_butler.tsid}];
			
			target_variant = nearby_butler.hi_emote_variant;
			if (!target_variant) {
				did_infect_butler = true;
				target_variant = nearby_butler.setHiEmoteVariantFromInfector(this);

				this.achievements_increment('infected_butler', target_variant, 1);
			}
		
			// if the target of the hi emote recently targeted this player with an emote of the same variant, bonus!
			if (target_variant == variant) {
				if (this.tsid in nearby_butler.hi_emote_daily_targets.pcs) {
					do_bonus = true;
				}
			}
					
			if (do_bonus) {
				this.apiSetTimer('doHiEmoteBonusWithButler', 2000, nearby_butler, msg.emote, variant, bonus_mood);
			}


			this.achievements_increment('hi_variants_butler', variant, 1);
	
		}
		
		// tells the butler nearby that the player has said hi so that they can say something like "thank you"
		// just so they acknowledge that you gave them something.
		nearby_butler.sayHiToButler(this); // this causes him to do a talk bubble back
	}
		
	// send notifications to clients about what happened
	if (config.feature_hi_viral) {
		
		// for the player saying hi
		if (did_infect_butler && did_get_sign_randomly) {
			activity_str = 'You got the daily hi sign "'+variant_name+'", and passed it on to '+nearby_butler.getLabel(this)+'!';
		} else if (did_infect_target_pc && did_get_sign_randomly) {
			activity_str = 'You got the daily hi sign "'+variant_name+'", and passed it on to '+target_pc.getLabel()+'!';
		} else if (did_infect_butler) {
			activity_str = 'You just passed your hi sign to '+nearby_butler.getLabel(this)+', now they have "'+variant_name+'"!';
		} else if (did_infect_target_pc) {
			activity_str = 'You just passed your hi sign to '+target_pc.getLabel()+', now they have "'+variant_name+'"!';
		} else if (did_get_sign_randomly) {
			activity_str = 'You got the daily hi sign "'+variant_name+'"!';
		}
		
		if (do_bonus && (target_pc || nearby_butler)) {
			if (activity_str) {
				activity_str+= ' Plus, you';
			} else {
				activity_str = 'You';
			}
			
			if (target_pc) {
				activity_str+= ' and '+target_pc.getLabel()+' have the same hi sign "'+variant_name+'". Bonus time!';
			} else {
				activity_str+= ' and '+nearby_butler.getLabel(this)+' have the same hi sign "'+variant_name+'". Bonus time!';
			}
		}
		
		if (activity_str) {
			this.sendActivity(activity_str);
		}
		
		// for the target
		if (target_pc) {
			if (did_infect_target_pc) {
				target_activity_str = this.getLabel()+' just passed their daily hi sign to you — you\'ve got "'+variant_name+'"!'+
										  ' Say "hi" back with the "H" or "5" key and get a bonus!';
			} else if (do_bonus) {
				target_activity_str = 'You and '+this.getLabel()+' have the hi sign "'+variant_name+'". Bonus time!'
			}
			
			if (target_activity_str) {
				target_pc.sendActivity(target_activity_str);
			}
		}
	}
	
	this.location.apiSendAnnouncement({
		type: 'emote',
		accelerate: true,
		emote: msg.emote,
		variant: variant,
		pc_tsid: this.tsid,
		emote_shards:shards,
		delta_y: -134
	});
}

function doHiEmoteBonusWithButler(target_butler, emote, variant, pc_mood) {
	var emote_bonus_mood_granted = {};
	emote_bonus_mood_granted[this.tsid] = this.metabolics_add_mood(pc_mood);
	var bonus_annc = {
		type: 'emote_bonus',
		emote: emote,
		variant: variant,
		variant_color: config.hi_emote_variants_color_map[variant],
		pc_tsid: this.tsid,
		itemstack_tsid: target_butler.tsid,
		emote_bonus_mood_granted: emote_bonus_mood_granted
	};

	this.apiSendAnnouncement(bonus_annc);

	this.achievements_increment('hi_jackpot_butler', target_butler.tsid, 1);
}

function doHiEmoteBonusWithOtherPlayer(target_pc, emote, variant, pc_mood, target_mood) {
	var emote_bonus_mood_granted = {};
	emote_bonus_mood_granted[this.tsid] = this.metabolics_add_mood(pc_mood);
	emote_bonus_mood_granted[target_pc.tsid] = target_pc.metabolics_add_mood(target_mood);

	var bonus_annc = {
		type: 'emote_bonus',
		emote: emote,
		variant: variant,
		variant_color: config.hi_emote_variants_color_map[variant],
		pc_tsid: this.tsid,
		other_pc_tsid: target_pc.tsid,
		emote_bonus_mood_granted: emote_bonus_mood_granted
	};

	this.apiSendAnnouncement(bonus_annc);
	target_pc.apiSendAnnouncement(bonus_annc);

	this.achievements_increment('hi_jackpot', target_pc.tsid, 1);
	this.achievements_increment_daily('hi_jackpot', target_pc.tsid, 1);
	if (this.achievements_get_daily_group_count('hi_jackpot') >= 17){
		this.achievements_grant('hi_and_mighty');
	}

	target_pc.achievements_increment('hi_jackpot', this.tsid, 1);
	target_pc.achievements_increment_daily('hi_jackpot', this.tsid, 1);
	if (target_pc.achievements_get_daily_group_count('hi_jackpot') >= 17){
		target_pc.achievements_grant('hi_and_mighty');
	}
}

function maybe_set_evasion_record(msg){
	var secs = msg.seconds;
	var ret;
	var location = this.location;
	if (location.instance_of) location = apiFindObject(location.instance_of);
	
	if (!location) {
		log.error('no location?', e);
		return {status: 'fail', msg: 'no location?'};
	}
	
	msg.version = msg.version || 0;
	
	if (msg.version < 10) {
		return {status: 'fail', msg: 'ignoring because version is less than 10. msg.version:'+msg.version};
	}
	
	var today_key = current_day_key();
	
	var alltime_record = location.hi_sign_evasion_record;
	
	var daily_record = location.hi_sign_daily_evasion_record;
	if (daily_record && daily_record.day_key != today_key) {
		// not from today! delete it
		daily_record = null;
		delete location.hi_sign_daily_evasion_record
	}
	
	if (alltime_record) {
		alltime_record.version = alltime_record.version || 0;
		if (alltime_record.version < msg.version) {
			// let's store it for history, we have a newer version of the algo in play
			if (!location.hi_sign_evasion_record_history) location.hi_sign_evasion_record_history = {};
			location.hi_sign_evasion_record_history['version_'+alltime_record.version] = alltime_record;
			
			// it is no longer current
			delete location.hi_sign_evasion_record;
			alltime_record = null;
		} else if (alltime_record.version > msg.version) {
			//forget it, we don't care about this older version anymore
			return {status: 'fail', msg: 'alltime_record.version:'+alltime_record.version+' > msg.version:'+msg.version};
		}
	}
	
	// ACITON LOGGING NOTES
	// recordloc is the location the record is against, which might be a template if this.location is an instance
	// recordsecs is the previous record's secs, and is therefore only included in HI_EVASION_BROKE_RECORD
	
	var all_timed_changed = false;
	
	
	// ALLTIME records ---------------------------------------------------------------------------
	
	if (!alltime_record) {
		
		all_timed_changed = true;
		ret = {status: 'set_alltime', msg: secs+' seconds set the <b>ALL TIME</b> hi sign evasion record for this location!'};
		
		apiLogAction('HI_EVASION_SET_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid);
		
	} else if (secs > alltime_record.secs) {
		
		all_timed_changed = true;
		ret = {status: 'broke_alltime', msg: secs+' seconds broke the previous <b>ALL TIME</b> hi sign evasion record of '+alltime_record.secs+' seconds for this location, set by '+utils.escape(alltime_record.pc_label)+'!'};
		
		apiLogAction('HI_EVASION_BROKE_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid,'recordsecs='+alltime_record.secs);
		
	} else if (secs == alltime_record.secs) {
		
		all_timed_changed = true;
		ret = {status: 'tied_alltime', msg: secs+' seconds tied the previous <b>ALL TIME</b> hi sign evasion record for this location, set by '+utils.escape(alltime_record.pc_label)+'!'};
		
		apiLogAction('HI_EVASION_TIED_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid);
		
	}
	
	// DAILY records ---------------------------------------------------------------------------
	
	if (!all_timed_changed || true) {
		if (!daily_record) {
			
			ret = {status: 'set_daily', msg: secs+' seconds set today\'s hi sign evasion record for this location!'};
			
			apiLogAction('HI_EVASION_SET_DAILY_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid);
		
		} else if (secs > daily_record.secs) {
			
			ret = {status: 'broke_daily', msg: secs+' seconds broke today\'s hi sign evasion record of '+daily_record.secs+' seconds for this location, set by '+utils.escape(daily_record.pc_label)+'!'};
			
			apiLogAction('HI_EVASION_BROKE_DAILY_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid,'recordsecs='+daily_record.secs);
			
		} else if (secs == daily_record.secs) {
			
			ret = {status: 'tied_daily', msg: secs+' seconds tied today\'s hi sign evasion record for this location, set by '+utils.escape(daily_record.pc_label)+'!'};
			
			apiLogAction('HI_EVASION_TIED_DAILY_RECORD', 'pc='+this.tsid,'secs='+secs,'version='+msg.version,'loc='+this.location.tsid,'recordloc='+location.tsid);
			
		}
	}
	
	
	// -----------------------------------------------------------------------------------------
	
	// only if we tied, set, or broke a record!
	if (ret) {
		this.make_and_store_evasion_record(msg, location, today_key, all_timed_changed);
	}
	
	return ret || {status: 'fail', msg: 'no record set or anything'};
}

function make_and_store_evasion_record(msg, location, today_key, alltime){
	var secs = msg.seconds;
	var ob = {
		pc_tsid: this.tsid,
		pc_label: this.label,
		secs: secs,
		when: time(),
		version: msg.version,
		day_key: today_key
	};
	
	// track it!
	var hi_variants_tracker = apiFindObject(config.hi_variants_tracker);
	hi_variants_tracker.remember_pcs_daily_evasion_record(this, location.tsid);
	
	location.hi_sign_daily_evasion_record = ob;
	
	if (alltime) {
		location.hi_sign_evasion_record = utils.copy_hash(ob);
		
		if (config.feature_report_hi_records) {
			//this.achievements_increment('alltime_evasion_record_made', 'set', 1);
		}
	
		var args = {
			pc_tsid: this.tsid,
			location_tsid: location.tsid,
			secs: secs,
			when: time(),
			data: msg.log_data ? utils.JSON_stringify(msg.log_data) : '',
			version: msg.version
		};
		
		log.info('store_evasion_record_args '+args);
		
		utils.http_post('callbacks/store_evasion_record.php', args, this.tsid);
	}
}

function doHiEmoteMissileHit(msg){
	this.apiSendMsg(make_ok_rsp(msg));
	
	if (!config.feature_hi_records) return;
	
	var client_seconds = msg.seconds;
	var from_tsid = msg.from_tsid;
	var loc_tsid = msg.location_tsid;
	var loc_template_tsid = msg.location_template_tsid;
	var min_record_seconds = 10;
	var min_feedback_seconds = 5;
	var record_status;
	
	if (!from_tsid) {
		if (this.is_god) this.sendActivity('ADMIN: NO FROM TSID?');
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no from_tsid');
		return;
	}
	
	var from_ob = apiFindObject(from_tsid); // could be a butler or another pc
	
	if (!from_ob) {
		if (this.is_god) this.sendActivity('ADMIN: NO from_ob?');
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no from_ob');
		return;
	}
	
	var targets = from_ob.getProp('hi_emote_daily_targets');
	
	if (!targets) {
		if (this.is_god) this.sendActivity('ADMIN: NO from_ob.hi_emote_daily_targets?');
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no from_ob.hi_emote_daily_targets');
		return;
	}
	
	if (!targets.pcs) {
		if (this.is_god) this.sendActivity('ADMIN: NO from_ob.hi_emote_daily_targets.pcs?');
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no from_ob.hi_emote_daily_targets.pcs');
		return;
	}
	
	var time_targeted = targets.pcs[this.tsid];
	
	if (!time_targeted && targets.pcs_yesterday) {
		time_targeted = targets.pcs_yesterday[this.tsid];
	}
	
	if (!time_targeted) {
		if (from_ob.tsid == this.tsid) {
			// this was created in DEV client by doing /missile so just fake this up
			time_targeted = time()-client_seconds;
		} else {
			// we have no record of a missile being sent from from_tsid to this player!
			if (this.is_god) this.sendActivity('ADMIN: no time_targeted?');
			apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no time_targeted');
			return;
		}
	}
	
	if (loc_tsid && loc_tsid != this.location.tsid) {
		// cheating?
		if (this.is_god) this.sendActivity('ADMIN: loc_tsid:'+loc_tsid+' does not match this.location.tsid'+this.location.tsid);
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=loc_tsid:'+loc_tsid+' does not match this.location.tsid'+this.location.tsid);
		return;
	}
	
	var time_since_targeted = time()-time_targeted;
	var diff = time_since_targeted-client_seconds;
	if (diff > 5) {
		// diff is how much time has passed since this player was targeted, minus how much time the client reported the player evaded
		// we allow 5 seconds for lag: longer than that we think there is cheating
		if (this.is_god) this.sendActivity('ADMIN: diff:'+diff+' seems bogus');
		apiLogAction('HI_EVASION_SEEMS_BOGUS', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid,'reason=no time_targeted');
		return;
	}
	
	// achievements --------------------------------------------------------------
	
	if (client_seconds >= 11) {
		this.achievements_grant('hi_flyer');
	}
		
	if (client_seconds >= 61) {
		this.achievements_grant('hi_speed_chase');
	}
		
	if (client_seconds >= 151) {
		this.achievements_grant('hi_as_a_kite');
	}
		
	if (client_seconds >= 311) {
		this.achievements_grant('hi_velocity');
	}
	
	// end achievements --------------------------------------------------------------
	
	apiLogAction('HI_EVASION', 'pc='+this.tsid,'secs='+client_seconds,'loc='+this.location.tsid);
		
	if (loc_tsid && client_seconds >= min_record_seconds) {
		record_status = this.maybe_set_evasion_record(msg);
	}
	
	if (this.is_god) {
		this.sendActivity('ADMIN: '+client_seconds+ ' '+(record_status || 'no record_status'));
	}
	
	if (config.feature_report_hi_records && record_status && record_status.status != 'fail') {
		this.location.sendActivity(this.getLabel()+"'s "+record_status.msg);
	} else if (client_seconds >= min_feedback_seconds) {
		this.sendActivity('You evaded that hi sign for '+client_seconds+' seconds!');
	}
}


function resetTheShitOutOfHiOverlays() {
	this.hi_emote_variant='';
	this.hi_emote_daily_targets.pcs = {};
	this.hi_emote_daily_targets.butlers = {};
	if (this.getButler()) {
		this.getButler().clearHi();
		this.getButler().hi_emote_variant='';
		this.getButler().hi_emote_daily_targets.pcs = {};
	}
	this.apiSendMsg({
		type: 'hi_emote_variant_set',
		variant: ''
	
	});
	this.sendActivity('reset the shit out of it!');
}