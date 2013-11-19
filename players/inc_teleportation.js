// http://svn.tinyspeck.com/wiki/SpecTeleportation

function teleportation_init(){
	if (this.teleportation === undefined || this.teleportation === null){
		this.teleportation = apiNewOwnedDC(this);
		this.teleportation.label = 'Teleportation';
		
		this.teleportation.targets = {};
		this.teleportation.map_teleports_today = 0;
		this.teleportation.free_summons_today = 0;
		this.teleportation.paid_summons_today = 0;
		this.teleportation.map_paid_teleports_today = 0;
		this.teleportation.token_balance = 0;
	}
}

function teleportation_reset(){
	if (this.teleportation){

		this.teleportation.targets = {};
		this.teleportation.map_teleports_today = 0;
		this.teleportation.free_summons_today = 0;
		this.teleportation.paid_summons_today = 0;
		this.teleportation.map_paid_teleports_today = 0;
	}

	if (this.buffs_has('teleportation_cooldown')){
		this.buffs_remove('teleportation_cooldown');
	}
}

function teleportation_reset_counters(){
	this.teleportation_init();
	this.teleportation.map_teleports_today = 0;
	this.teleportation.free_summons_today = 0;
	this.teleportation.paid_summons_today = 0;
	this.teleportation.map_paid_teleports_today = 0;
	this.teleportation_notify_client();
}

//////////////////////////////////////////////////////////////////////

function teleportation_set_target(teleport_id){
	if (!teleport_id) teleport_id = 1;

	var ret = this.teleportation_can_set_target(teleport_id);
	if (!ret['ok']) return ret;
	
	var target = this.get_simple_location();
	var pol = this.location.pols_get_status();

	// Rewrite pols to be the door coming in
	if (pol.is_pol && pol.owner == this.tsid && !pol.is_public){
		var outgoing = this.location.geo_links_get_outgoing();
		for (var i in outgoing){
			if (outgoing[i] && outgoing[i].target.tsid != target.tsid){
				target = {
					tsid: outgoing[i].target.tsid,
					x: outgoing[i].x,
					y: outgoing[i].y
				};
			}
		}
	}
	
	this.teleportation.targets[teleport_id] = target;
	
	
	if(this.location.hubid == 95 || (config.is_dev && this.location.hubid == 8)) {
		this.quests_set_flag('teleportation_point_in_xalanga');
	}
	
	return {
		ok: 1,
		target: target
	};
}

function teleportation_get_target(teleport_id){
	if (!teleport_id) teleport_id = 1;

	if (teleport_id > this.teleportation_get_max_targets()) return {};
	if (!this.teleportation.targets[teleport_id]) return {};
	
	return this.teleportation.targets[teleport_id];
}

function teleportation_get_all_targets(){
	var targets = {};

	var count = 0;
	var max = this.teleportation_get_max_targets();
	for (var i in this.teleportation.targets){
		if (i > max) continue;
		var t = this.teleportation.targets[i];
		
		if (t && t.tsid){
			targets[i] = t;

			var target = apiFindObject(targets[i].tsid);
			if (!target){
				//log.info(this+' teleportation_get_all_targets deleting stale target: '+this.teleportation.targets[i]);
				delete targets[i]; // http://bugs.tinyspeck.com/10452
				//delete this.teleportation.targets[i];
				continue;
			}

			try{
				targets[i].label = target.label;
			}catch(e){}
			
			count++;

			if (count >= max) break;
		}
	}

	// Fill in any missing ones
	for (var i=1; i<=max; i++){
		if (!targets[i]) targets[i] = {};
	}

	return targets;
}

function teleportation_can_teleport(teleport_id, skip_skill, target){
	if (this['!teleporting']){
		return {
			ok: 0,
			error: "You are already teleporting."
		};
	}

	var loc;
	if (target){
		loc = apiFindObject(target.tsid);
	}

	if (this.is_dead){
		// Players who are dead can only teleport within Naraka.
		if (!loc || loc.hubid != 40){
			return {
				ok: 0,
				error: "You are dead."
			};
		}
	}
	else if (loc && loc.hubid == 40){
		return {
			ok: 0,
			error: "There's only one way to get to Naraka, and that's not it."
		};
	}
	
    if (this.buffs_has('pooped')) {
        return {
            ok: 0,
            error: "You are too Pooped to teleport. Eat something first!"
        };
    }
	
	if (this.buffs_has('dont_get_caught')){
		return {
			ok: 0,
			error: "That fragile Contraband won't survive teleportation."
		};
	}

	if (!skip_skill && !this.skills_has('teleportation_1')){
		return {
			ok: 0,
			error: "You don't know how to teleport."
		};
	}
	
	if (teleport_id){
		target = this.teleportation_get_target(teleport_id);
		if (!target || !target.tsid){
			return {
				ok: 0,
				error: "You don't have a destination."
			};
		}

		var location = this.get_simple_location();
		if (target.tsid == location.tsid){
			return {
				ok: 0,
				error: "You are already in that location."
			};
		}
	}

	if (target){
		loc = apiFindObject(target.tsid);
		if (!loc || loc.getProp('is_deleted')){
			delete this.teleportation_target;
			return {
				ok: 0,
				error: "Your teleportation target no longer exists."
			};
		}
		
		if (this.is_dead){
			// Players who are dead can only teleport within Naraka.
			if (loc.hubid != 40){
				return {
					ok: 0,
					error: "You are dead."
				};
			}
		} else if (loc.hubid == 40) {
			return {
				ok: 0,
				error: "There's only one way to get to Naraka, and that's not it."
			};
		}
    
		if (loc.jobs_is_street_locked() && !in_array_real(loc.tsid, config.teleportation_ok_streets)){
			return {
				ok: 0,
				error: "Your teleportation target is unavailable."
			};
		}

		if (loc.getProp('no_teleportation')){
			return {
				ok: 0,
				error: "Your teleportation target is unavailable."
			};
		}

		if (loc.pols_is_pol()){
			var ret = loc.pols_canEnter(this);

			if (!ret.ok){
				return {
					ok: 0,
					error: "Your teleportation target is unavailable."
				};
			}

			if (!loc.pols_is_owner(this) && this.countFollowers()){
				var followers_have_clearance = 1;

				for (var i in this.followers){
					var follower = apiFindObject(i);

					var fret = loc.pols_canEnter(follower);

					if (!fret.ok){
						followers_have_clearance = 0;
					}

				}

				if (!followers_have_clearance){
					return {
						ok: 0,
						error: "One or more of your followers is not allowed to teleport there."
					};
				}
			}

		}

		if (this.countFollowers){
			for (var i in this.followers){
				var follower = apiFindObject(i);

				if (follower.buffs_has('dont_get_caught')){
					return {
						ok: 0,
						error: "One of your followers is carrying delicate contraband and cannot teleport right now."
					};
				}
			}
		}
	}
	
	if (this.buffs_has('teleportation_cooldown')){
		return {
			ok: 0,
			error: "You teleported too recently."
		};
	}
	
	if (this.isRooked() || this.buffs_has('rooked_recovery')){
		return {
			ok: 0,
			error: "You are still under the effects of a Rook attack."
		};
	}
	
	return {ok: 1};
}

function teleportation_can_set_target(teleport_id){
	if (this.is_dead){
		return {
			ok: 0,
			error: "You are dead."
		};
	}

	if (!this.skills_has('teleportation_1')){
		return {
			ok: 0,
			error: "You don't know how to teleport."
		};
	}
	
	if (this.location.isInstance() || this.location.jobs_is_street_locked() || this.location.getProp('no_teleportation')){
		if (!in_array_real(this.location.tsid, config.teleportation_ok_streets)){
			return {
				ok: 0,
				error: "You can't save this location as a Teleportation Point."
			};
		}
	}
	
	var pol = this.location.pols_get_status();
	if (pol.is_pol && pol.owner != this.tsid && !pol.is_public){
		return {
			ok: 0,
			error: "You can't save this location as a Teleportation Point."
		};
	}

	if (teleport_id && teleport_id > this.teleportation_get_max_targets()){
		return {
			ok: 0,
			error: "Invalid teleport id."
		};
	}
	
	return {ok: 1};
}

function teleportation_teleport(teleport_id, skip_skill, target, skip_costs){
	if (!teleport_id && !target) teleport_id = 1;

	var ret = this.teleportation_can_teleport(teleport_id, skip_skill, target);
	if (!ret['ok']) return ret;
	
	if (!skip_costs){
		var energy_cost = this.teleportation_get_energy_cost();
		if (this.metabolics_get_energy() <= energy_cost){
			return {
				ok: 0,
				error: "You don't have enough energy."
			};
		}
		
		this.metabolics_lose_energy(energy_cost);
		this.buffs_apply('teleportation_cooldown', {duration: this.teleportation_get_cooldown_time()});
	}


	//
	// If we are in an instance, leave it from our instance list so we don't try and get put back to where we were when we entered
	//

	if (this.location.isInstance()){
		this.instances_left(this.location.instance_id, false, true);
	}

	if (!target) var target = this.teleportation_get_target(teleport_id);

	var loc = apiFindObject(target.tsid);
	if (loc.pols_is_pol() && !loc.pols_is_owner(this) && !loc.getProp('is_public')){
		target = loc.pols_get_entrance_outside();
	}

	if (loc.pols_is_pol() && loc.getProp('is_home')){
		this.houses_record_leave();
	}
	
	// Check quests
	var target_info = apiFindObject(target.tsid).get_info();
	if (this.location.hubid == 63){
		if (target_info.hub_id == 92){
			this.quests_set_flag('teleport_between_zones');
		}
	}
	if (this.location.hubid != 95){
		if (target_info.hub_id == 95){
			this.quests_set_flag('teleport_to_xalanga');
		}
	}
	if (config.is_dev){
		if (this.location.hubid != 8){
			if (target_info.hub_id == 8){
				this.quests_set_flag('teleport_to_xalanga');
			}
		}
	}

	this.playHitAnimation('hit1', 1000);
	this.teleportToLocationDelayed(target.tsid, target.x, target.y);

	this.apiSetTimer('teleport_complete', 3000);
	this.achievements_increment('teleportation_self', 'plain');
	if (this.countFollowers()){
		this.achievements_increment('teleportation_self_withfollowers', 'plain');

		if (this.countFollowers() >= 5){
			this.achievements_increment('teleportation_self_withfollowers_5', 'plain');
		}

		if (this.countFollowers() >= 11){
			this.achievements_increment('teleportation_self_withfollowers_11', 'plain');
		}
	}
	
	return {ok: 1};
}

function teleportation_map_teleport(tsid, use_token){
	if (!tsid){
		return {
			ok: 0,
			error: "Where to, boss?"
		};
	}

	var ret = this.teleportation_can_teleport(null, false, {tsid: tsid});
	if (!ret['ok']) return ret;

	if (use_token){
		if (!this.teleportation_get_token_balance()){
			return {
				ok: 0,
				error: "You need to buy more tokens!"
			};
		}
		else{
			if (!this.teleportation.map_paid_teleports_today) this.teleportation.map_paid_teleports_today = 0;
			if (this.teleportation.map_paid_teleports_today >= 5){
				return {
					ok: 0,
					error: "You can't do that anymore today."
				};
			}
		}
	}
	else{
		if (!this.teleportation.map_teleports_today) this.teleportation.map_teleports_today = 0;
		if (this.teleportation.map_teleports_today >= this.teleportation_get_max_map_teleports()){
			return {
				ok: 0,
				error: "You can't do that anymore today."
			};
		}

		var energy_cost = this.teleportation_get_energy_cost();
		if (this.metabolics_get_energy() <= energy_cost){
			return {
				ok: 0,
				error: "You don't have enough energy."
			};
		}
	}

	var target = apiFindObject(tsid);
	
	var pt = {};
	// Pick a random signpost/door target in the street to send us to
	if (target.pols_is_pol() && !target.getProp('is_public')){
		var entrance = target.pols_get_entrance();
		if (!entrance.tsid){
			return {
				ok: 0,
				error: "Something be wrong with that street."
			};
		}

		pt = {
			x: entrance.x,
			y: entrance.y
		};
	}
	else{
		var targets = target.geo_links_get_incoming();
		var choice = choose_one(array_keys(targets));
		if (!targets[choice]){
			/* Check for teleport markers in the street instead */
			var targets = target.find_items('marker_teleport');
			if (targets.length) {
				choice = choose_one(array_keys(targets));
			}
			
			if (!targets[choice]){
				return {
					ok: 0,
					error: "Something be wrong with that street."
				};
			}
		}

		pt = {
			x: targets[choice].x,
			y: targets[choice].y
		};
	}
	
	if (use_token){

		// Deduct a token
		this.teleportation_spend_token('Map teleport to '+target.label+'.');
		this.teleportation.map_paid_teleports_today++;
	}
	else{
		this.teleportation.map_teleports_today++;
		this.metabolics_lose_energy(energy_cost);

		this.buffs_apply('teleportation_cooldown', {duration: this.teleportation_get_cooldown_time()});
	}
	
	// Check quests
	if (this.location.hubid == 63){
		var target_info = target.get_info();
		if (target_info.hub_id == 92){
			this.quests_set_flag('teleport_between_zones');
		}
	}

	this.playHitAnimation('hit1', 1000);
	this.teleportToLocationDelayed(target.tsid, pt.x, pt.y);

	this.apiSetTimer('teleport_complete', 3000);
	this.achievements_increment('teleportation_self', 'map');
	if (this.countFollowers()){
		this.achievements_increment('teleportation_self_withfollowers', 'map');

		if (this.countFollowers() >= 5){
			this.achievements_increment('teleportation_self_withfollowers_5', 'map');
		}

		if (this.countFollowers() >= 11){
			this.achievements_increment('teleportation_self_withfollowers_11', 'map');
		}
	}
	
	return {ok: 1};
}

function teleportation_random_teleport() {
	// find a new hub
	var hub = choose_one(config.public_hubs);
/*	do {
		hub = choose_one(array_keys(config.data_maps.hubs));
	} while (!in_array(hub, config.public_hubs));*/

	var mote = config.data_maps.hubs[hub].mote_id;

	// and finally, find a new street
	var street = null;
	var loc = null;
	var street_num = 0;
	var done = true;
	
	var teleport_candidates = [];
	
	for (var i in config.data_maps.streets[mote][hub]) {
		teleport_candidates.push(i);
	}
	do {
		street_num = randInt(0, teleport_candidates.length - 1);
		done = true;
		street = teleport_candidates[street_num];
		array_remove(teleport_candidates, street_num);
		loc = apiFindObject(street);
		if(!loc || loc.pols_is_pol() || loc.isInstance() || loc.instances_instance_me() || loc.is_hidden() || loc.jobs_is_street_locked()) {
			done = false;
		}
	} while (!done && teleport_candidates.length);
	
	if (!loc || loc.pols_is_pol() || loc.isInstance() || loc.instances_instance_me() || loc.is_hidden() || loc.jobs_is_street_locked()) {
		// Couldn't find a good candidate.
		log.error("Player "+this+" attempted random teleport within hub "+hub+", but no teleport candidate could be found.");
		return {
			ok: 0,
			error: "Could not find an appropriate teleport candidate in that hub."
		};
	}

	var targets = loc.geo_links_get_incoming();
	var choice = choose_one(array_keys(targets));
	if (!targets[choice]){
		return {
			ok: 0,
			error: "Something be wrong with that street."
		};
	}

	this.teleportToLocationDelayed(street, targets[choice].x, targets[choice].y - 20);

	this.apiSetTimer('teleport_complete', 3000);
}

function teleportation_accept_summons(value, details){
	var value_split = value.split('-');
	if (value_split.length != 2) return log.error("teleportation_accept_summons bad value: "+value);

	var summoner = getPlayer(value_split[1]);
	if (!summoner) return log.error("teleportation_accept_summons bad player: "+value_split[1]);

	if (value_split[0] == 'timeout' || value_split[0] == 'no'){
		summoner.teleportation_cancel_summons(this);
	}
	else{
		var ret = summoner.teleportation_summon(this);
		if (!ret.ok) this.sendActivity("Oops. Something happened with that teleport.");
	}
}

function teleportation_summon(pc){
	if (this['!summons_uid']){
		this.prompts_remove(this['!summons_uid']);
		delete this['!summons_uid'];
	}

	var summonses = this.teleportation_get_max_summons();

	if (!this.location.isGreetingLocation() || !this.isGreeter() || !pc.isGreeter()){
		var ret = this.teleportation_can_summon(pc);
		if (!ret['ok']) return ret;
	}

	// Greeter summonses are free
	var method;
	if (!this.location.isGreetingLocation()){
		if (summonses[0] > this.teleportation.free_summons_today){
			this.teleportation.free_summons_today++;
			this.metabolics_lose_energy(this.teleportation_get_energy_cost());
			method = 'energy';
		}
		else if (summonses[1] == -1 || summonses[1] > this.teleportation.paid_summons_today){
			this.teleportation.paid_summons_today++;

			// Deduct a token
			this.teleportation_spend_token('Summoning '+pc.label+' to your location.');
			method = 'token';
		}
	}

	this.prompts_add({
		txt		: pc.linkifyLabel()+' is on their way!',
		icon_buttons	: false,
		timeout			: 10,
		choices			: [
			{ value : 'ok', label : 'OK' }
		]
	});


	var target = {
		tsid: this.location.tsid,
		x: this.x+20,
		y: this.y
	};

	if (this.location.pols_is_pol() && this.location.getProp('is_home')){
		pc.houses_record_leave();
	}

	if (!this.location.isInstance()){
		if (this.location.pols_is_pol() && !this.location.pols_is_owner(this) && !this.location.pols_is_owner(pc) && !this.location.getProp('is_public')){
			target = this.location.pols_get_entrance_outside();
		}

		pc.removeFollowers();
		pc.playHitAnimation('hit1', 1000);
		pc.teleportToLocationDelayed(target.tsid, target.x, target.y);
		pc.achievements_increment('teleportation_others', 'summonee');

		if (method == 'energy') this.buffs_apply('teleportation_cooldown', {duration: this.teleportation_get_cooldown_time()});
		this.achievements_increment('teleportation_others', 'summoner');
	}
	else{
		if (this.location.isInstance('party_space')){
			if (pc.party_get() == this.party_get()){
				pc.party_enter_space();
			}
			else{
				this.party_invite_accepted(pc, true);
			}
		}
		else{
			var instance_id = this.location.getProp('instance_id');
			if (instance_id){
				pc.instances_add(instance_id, this.location.getProp('instance'));
				pc.instances_enter(instance_id, target.x, target.y);
			}
			else{
				pc.teleportToLocationDelayed(target.tsid, target.x, target.y);
			}
		}

	}

	return {ok: 1};
}

function teleportation_cancel_summons(target){
	if (this['!summons_uid']){
		this.prompts_remove(this['!summons_uid']);
		delete this['!summons_uid'];
	}

	if (target){

		if (this.location.isInstance('party_space') && target.party_get() != this.party_get()){
			this.party_invite_declined(target);
		}

		this.prompts_add({
			txt		: target.linkifyLabel()+' did not accept your summons.',
			icon_buttons	: false,
			timeout			: 10,
			choices			: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function teleportation_can_summon(target){
	var ret = this.teleportation_can_teleport();
	if (!ret['ok']) return ret;

	if (this['!summons_uid']){
		return {
			ok: 0,
			error: "You can only summon one player at a time."
		};
	}

	if (target.buffs_has('dont_get_caught')){
		return {
			ok: 0,
			error: "They're carrying some fragile contraband, and it won't survive a summoning"
		};
	}

	if (target.getProp('is_dead')){
		return {
			ok: 0,
			error: "They are dead."
		};
	}

	if (target.get_location().getProp('is_newxp') || target.get_location().getProp('is_skillquest')){
		return {
			ok: 0,
			error: "They cannot be summoned right now."
		};
	}

	if (this.is_dead){
		return {
			ok: 0,
			error: "You are dead."
		};
	}

	if (this.location.isGreetingLocation() && this.isGreeter() && target.isGreeter()){
		return {
			ok: 1,
			free: 0,
			paid: 0
		};
	}


	if (this.location.isInstance() && !this.location.isInstance('party_space')){
		if (target.party_get() != this.party_get()){
			return {
				ok: 0,
				error: "They are in another party."
			};
		}

		if (this.party_is_full()){
			return {
				ok: 0,
				error: "Your party is full."
			};
		}

		return {
			ok: 0,
			error: "You can't summon people here."
		};
	}

	if (this.location.pols_is_pol() && !this.location.pols_is_owner(this)){
		var ret = this.location.pols_canEnter(target);
		if (!ret['ok']){
			return {
				ok: 0,
				error: "You can't summon them here."
			};
		}
	}

	var summonses = this.teleportation_get_max_summons();
	if (summonses[0] <= this.teleportation.free_summons_today && (summonses[1] != -1 && summonses[1] <= this.teleportation.paid_summons_today)){
		return {
			ok: 0,
			error: "You cannot summon anymore today."
		};
	}

	// Check tokens if all out of free ones
	if (summonses[0] <= this.teleportation.free_summons_today && !this.teleportation_get_token_balance()){
		return {
			ok: 0,
			error: "Buy more teleportation tokens!"
		};
	}
	else if (summonses[0] > this.teleportation.free_summons_today && this.metabolics_get_energy() <= this.teleportation_get_energy_cost()){
		return {
			ok: 0,
			error: "You don't have enough energy."
		};
	}

	return {
		ok: 1,
		free: this.teleportation.free_summons_today,
		paid: this.teleportation.paid_summons_today
	};
}

function teleportation_spend_token(reason){
	if (this.teleportation_get_token_balance() > 0){
		this.teleportation.token_balance--;

		// Tell the web app, which will sync back to us eventually
		var args = {
			player	: this.tsid,
			tokens	: 1,
			reason	: reason
		};
		utils.http_get('callbacks/tp_tokens_spend.php', args);

		this.teleportation_notify_client();

		return 1;
	}

	return 0;
}

function teleportation_give_tokens(count, reason){
	this.teleportation.token_balance += count;

	// Tell the web app, which will sync back to us eventually
	var args = {
		player	: this.tsid,
		tokens	: count,
		reason	: reason
	};
	utils.http_get('callbacks/tp_tokens_give.php', args);

	this.teleportation_notify_client();

	return 1;
}

//////////////////////////////////////////////////////////////////////

function teleportation_get_status(){
	this.teleportation_init();

	var can_teleport = this.teleportation_can_teleport();
	var can_set_target = this.teleportation_can_set_target();
	var ret = {
		energy_cost: this.teleportation_get_energy_cost(),
		has_teleportation_skill: this.skills_has('teleportation_1') ? true : false,
		skill_level: this.skills_get_highest_level('teleportation_1'),
		can_teleport: can_teleport['ok'] ? true : false,
		can_set_target: can_set_target['ok'] ? true : false,
		targets: this.teleportation_get_all_targets(),
		map_tokens_used: intval(this.teleportation.map_paid_teleports_today),
		map_tokens_max: 5,
		map_free_used: intval(this.teleportation.map_teleports_today),
		map_free_max: this.teleportation_get_max_map_teleports(),
		tokens_remaining: this.teleportation_get_token_balance()
	};
		
	return ret;
}

function teleportation_notify_client(){
	this.apiSendMsgAsIs({
		type: 'teleportation',
		status: this.teleportation_get_status()
	});
}

//////////////////////////////////////////////////////////////////////

function teleportation_get_max_targets(){
	if (this.skills_has('teleportation_3')){
		return 3;
	}
	else if (this.skills_has('teleportation_2')){
		return 2;
	}
	else if (this.skills_has('teleportation_1')){
		return 1;
	}

	return 0;
}

function teleportation_get_energy_cost(){
	if (this.skills_has('teleportation_5')){
		return Math.round(this.metabolics_get_max_energy() * 0.10);
	}
	else if (this.skills_has('teleportation_4')){
		return Math.round(this.metabolics_get_max_energy() * 0.15);
	}
	else if (this.skills_has('teleportation_3')){
		return Math.round(this.metabolics_get_max_energy() * 0.20);
	}
	else if (this.skills_has('teleportation_2')){
		return Math.round(this.metabolics_get_max_energy() * 0.25);
	}
	else if (this.skills_has('teleportation_1')){
		return Math.round(this.metabolics_get_max_energy() * 0.33);
	}

	return null;
}

function teleportation_get_cooldown_time(){

	// End of the world - reduce all cooldowns by a factor of 60
	
	if (this.skills_has('teleportation_5')){
		return 5;
	}
	else if (this.skills_has('teleportation_4')){
		return 5;
	}
	else if (this.skills_has('teleportation_1')){
		return 5;
	}

	return null; 
}

function teleportation_get_max_map_teleports(){
	
	if (this.skills_has('teleportation_5')){
		return 1000;
	}
	else if (this.skills_has('teleportation_4')){
		return 1000;
	}
	
	return 0; 
}

// How many times per game day can this player use the 'summons' functionality?
// First number is 'free', second number is how many with teleportation tokens
function teleportation_get_max_summons(){
	if (this.skills_has('teleportation_5')){
		return [2, -1];
	}

	return [0, 0];
}

function teleportation_get_token_balance(){
	return intval(this.teleportation.token_balance);
}

//////////////////////////////////////////////////////////////////////

function teleportation_add_history(tsid){
	if (!this.is_god) return;
	
	if (!this.location_history) this.location_history = {};
	this.location_history[tsid] = time();
}

function teleportation_get_history(num){

	if (!this.location_history) this.location_history = {};

	var pairs = [];
	for (var i in this.location_history) pairs.push([i, this.location_history[i] - 1288036000]);
	pairs.sort(function(a,b){return b[1]-a[1];});

	pairs = pairs.slice(0, num?num:5);

	var out = [];
	for (var i=0; i<pairs.length; i++){
		out.push(pairs[i][0]);
	}

	return out;
}

//////////////////////////////////////////////////////////////////////

function teleportation_imbue_script_prompt(value, details){

	if (value == 'yes'){
		var script = this.removeItemStackTsid(details.tsid, 1);
		if (!script || script.class_tsid != 'teleportation_script') return this.sendActivity("That's not a Teleportation Script.");

		if (!this.teleportation_get_token_balance()) return this.sendActivity("Buy more Teleportation Tokens!");

		this.teleportation_spend_token("Imbueing a Teleportation Script to "+script.destination.name+".");

		var imbued_script = apiNewItemStack('teleportation_script_imbued', 1);
		if (!imbued_script) {
			log.error("Could not create teleportation script for player "+this);
			return;
		}
		// Copy properties over
		imbued_script.setTarget(script.destination);
		imbued_script.contents = script.contents;
		imbued_script.title = script.title;
		imbued_script.last_editor = script.last_editor;
		imbued_script.last_edited = time();
		
		script.apiDelete();
		var remaining = this.addItemStack(imbued_script);
		if (remaining) {
			this.sendAcivity("You don't have room for an imbued script, which is honestly pretty weird.");
			imbued_script.apiDelete();
			return;
		}
		
		

		return this.sendActivity("You imbued a Teleportation Script.");
	}
}

function teleport_complete(){
	var quest = this.getQuestInstance('teleportation_teleport_in_time_period');
	if (quest && quest.isStarted(this) && !quest.isDone(this)){
		quest.sendGrowl(this);
	}
	
	if (this.countFollowers() >= 3){
		this.quests_set_flag('teleportation_self_withfollowers_3');
	}
	
	this.quests_inc_counter('teleportation_count', 1);
}