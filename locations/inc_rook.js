function startSingleRookAttack(health, force) {
	if (!force && !this.isRookable()) {
		return {ok: 0, reason: "Location cannot be rooked."};
	}
	if (this.isRooked()) {
		return {ok: 0, reason: "Location is already rooked."};
	}
	
	var rook_attack = apiNewGroupForHub('rook_attack', this.hubid);
	
	rook_attack.initialize(this.hubid);
	rook_attack.addLocation(this, true);
	rook_attack.startAttack(health ? health : 1000);
	rook_attack.setLastAttack(true);
	
	return {ok: 1};
}

function isRookable() {
	if(this.pols_is_pol() || this.isInstance() || this.instances_instance_me() || this.is_hidden() || this.no_rook || this.is_game || this.is_party_space) {
		return false;
	}
	
	for (var i in this.items) {
		if (this.items[i].hasTag('shrine')) {
			return true;
		}
	}
	
	return false;
}

// Kicks off a rook attack sequence
function startRookAttack(rook_attack){
	if (!this.isRooked()){
		log.info(this+' Rook attack starting');
		
		this.apiSendAnnouncement({
			type: 'play_music',
			mp3_url: config.music_map['ROOK_FLOCK'],
			loop_count: 999
		});

		this.rook_attack = rook_attack;

		this.rookOverlayMessage("ROOK ATTACK!");
		
		// preload SWF overlays
/*		var players = this.getActivePlayers();
		for(var i in players) {
			var annc = {
				type:'location_overlay',
				swf_url:overlay_key_to_url('shrine_power_up'),
				uid: 'shrine_power_up_preload',
				y: players[i].y,
				x: players[i].x,
				dont_keep_in_bounds: true,
				duration: 5000,
			};
			players[i].apiSendAnnouncement(annc);
			
			annc.uid = 'shrine_laser_beam_3_preload';
			annc.swf_url = overlay_key_to_url('shrine_laser_beam_3');
			players[i].apiSendAnnouncement(annc);

			annc.uid = 'shrine_laser_beam_2_preload';
			annc.swf_url = overlay_key_to_url('shrine_laser_beam_3');
			players[i].apiSendAnnouncement(annc);

			annc.uid = 'shrine_laser_beam_1_preload';
			annc.swf_url = overlay_key_to_url('shrine_laser_beam_3');
			players[i].apiSendAnnouncement(annc);
			
			annc.uid = 'rook_feathers_falling_preload';
			annc.swf_url = overlay_key_to_url('rook_feathers_falling'),
			players[i].apiSendAnnouncement(annc);

			annc.uid = 'rook_feathers_falling_preload';
			annc.swf_url = overlay_key_to_url('rook_feathers_falling'),
			players[i].apiSendAnnouncement(annc);
			
			annc.uid = 'focusing_orb_attack_preload';
			annc.swf_url = overlay_key_to_url('focusing_orb_attack'),
			players[i].apiSendAnnouncement(annc);
		}*/
		
		/* Since that has the potential to be performance intensive, I'm taking it out until I can confer with someone
		 * on what the actual utility of doing this is.
		 */
	}
	else{
		log.info(this+' Rook attack is already in progress');
	}
}

function stopRookAttack() {
	if(this.rook_attack) {
		this.rook_attack.stopAttack();
	}
}

function rookOverlayMessage(txt, subtxt, delay, pc, gentle) {
	var target = pc ? pc : this;
	
	var color = gentle ? '#008080' : '#900020';
	
	target.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'rook_msg_overlay',
		canvas: {
			color: color,
			steps: [
				{alpha: 0, secs: delay},
				{alpha: 0.7, secs: 0.5},
				{alpha: 0.7, secs: 3.25},
				{alpha: 0, secs:0.5}
			],
			loop: false
		}
	});
	target.apiSendAnnouncement({
		uid: 'rook_msg_text',
		type: 'vp_overlay',
		duration: 4000,
		delay_ms: delay ? delay * 1000 : 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '25%',
		click_to_advance: false,
		text: [
			'<p align="center"><span class="nuxp_vog">'+txt+'</span></p>'
		]
	});

	if(subtxt) {
		target.apiSendAnnouncement({
			uid: 'rook_msg_subtext',
			type: 'vp_overlay',
			duration: 4000,
			delay_ms: delay ? delay * 1000 : 0,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '55%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_smaller">'+subtxt+'</span>'
			]
		});
	}
}

function canStun() {
	if (!this.rook_status) {
		return false;
	}
	
	return this.rook_status.rooked && (this.rook_status.phase == 'build_up' || this.rook_status.phase == 'angry');
}

function canAttack() {
	if(!this.rook_status) {
		return false;
	}
	
	return this.rook_status.rooked && this.rook_status.phase == 'stunned' && this.rook_status.health > 0;
}

/* Interrupt persistent player actions. When the rook changes state, existing actions
 * (stun attacks, shrine priming, etc.) may not be relevant.
 */
function rookStateChange(new_state) {
	if (this.stun_orbs) {
		for(var i in this.stun_orbs) {
			this.removeOrb(i);
		}
	}
	log.info("Rook state change to "+new_state);
	if(new_state == 'build_up' || new_state == 'dead') {
		for (var i in this.items) {
			if (this.items[i].hasTag('shrine')) {
				this.items[i].closeRookAttack();
			}
		}
		
		if(new_state == 'dead') {
			this.rookOverlayMessage("THE ROOK IS DEFEATED!", "You have driven back the horror of the Rook, at least for now.", 0, null, true);
			var attackers = this.rook_attack.getAttackers();
			
			var players = this.getActivePlayers();
			for (var pc in players) {
				if (players[pc].buffs_has('rook_armor')) {
					players[pc].achievements_increment('essence_of_rookswort', 'defeated_rook');
				}
				
				if (attackers && attackers[pc]) {
					var xp = players[pc].stats_add_xp(attackers[pc] * 2 + 50, false, {type: 'rook_defeat_help'});
					players[pc].sendActivity("You helped defeat the Rook. You got "+xp+" iMG for your contributions.");
				} else {
					var xp = players[pc].stats_add_xp(50, false, {type: 'rook_defeat_witness'});
					players[pc].sendActivity("You got "+xp+" iMG for witnessing the defeat of the Rook.");
				}
				players[pc].show_rainbow('rainbow_youdidit');
				
			}
		}
	} else if (new_state == 'stunned') {
		for (var i in this.items) {
			if (this.items[i].hasTag('shrine')) {
				this.items[i].openRookAttack();
			}
		}
	}
}

function rookStunAttempt(damage, txt, is_stunned) {
	var msg = {
		type: 'rook_stun',
		successful: (damage > 0),
		txt: txt,
		stunned: is_stunned
	};
	
	if(damage > 0) {
		msg.damage = damage;
	}
	
	if(this.rook_status.stun) {
		this.rook_status.stun += damage;
	}
	
	this.apiSendMsg(msg);
}

function rookDamage(damage, txt, is_dead) {
	var msg = {
		type: 'rook_damage',
		damage: damage,
		txt: txt,
		defeated: is_dead
	};
	
	this.apiSendMsg(msg);
}

// The attack sequence is continuing
function rookWingBeat(){
	if (!this.isRooked()) return;
	
	log.info(this+' Rook wing beat');
	
	this.apiSendAnnouncement({
		type: 'play_music',
		mp3_url: config.music_map['ROOK_ATTACK']
	});
	
	var rsp = {
		type: 'rook_attack'
	};
	
	if(num_keys(this.activePlayers)) {
		this.apiSendMsg(rsp);
	}

	// Rook animals, trants, player, etc. Rook everything and ask questions later
	for (var i in this.activePlayers){
		var pc = this.activePlayers[i];
		pc.rookAttack(false);
	}
    
	for (var i in this.items){
		var it = this.items[i];
		if (it.isRookable()){
			it.rookAttack(false);
		}
	}
}

function rookClear(){
	log.info(this+' Rook attack cleared');
	
	this.apiSendAnnouncement({
		type: 'stop_music',
		mp3_url: config.music_map['ROOK_FLOCK']
	});
	
	this.apiSendAnnouncement({
		type: 'stop_music',
		mp3_url: config.music_map['ROOK_ATTACK']
	});
	
	this.rook_status = {rooked: false};
	delete this.rook_attack;
	this.broadcastRookedState();
}

function broadcastRookedState(args){
	var rsp = {
		type:'location_rooked_status',
		status: this.rook_status,
		location_tsid: this.tsid
	};
	
	log.info(rsp);
	this.apiSendMsg(rsp);
}

function isRooked(){
	return (this.rook_status && this.rook_status.rooked) ? true : false;
}

function setRookedStatus(status) {
	this.rook_status = status;
	this.broadcastRookedState();
}

function getRookedStatus(args){
	if (!this.rook_status){
		return {status:{rooked: false}};
	}

	return this.rook_status;
}

function getRookAttack() {
	return this.rook_attack;
}

function addOrb(pc, source_item) {
	if(!this.stun_orbs) {
		this.stun_orbs = {};
	}

	pc['!orb_attack'] = pc.tsid;
	
	if(num_keys(this.stun_orbs) >= 3) {
		pc.sendActivity("Several people here are already trying to stun the Rook. Help them first!");
		return;
	}

	pc['!orb_attack'] = pc.tsid;
	
	this.stun_orbs[pc.tsid] = {itemstack_tsid: source_item.tsid, players: [pc.tsid], start_time: time()};
	this.newOrbAnnouncement(pc.tsid, source_item);
	this.sendGlowMsg(pc.tsid, pc.tsid, true);
	
	// Check if the player is near any other players doing orb attacks
	var position_ok = false;
	var position_step = 100;
	var iterations = 0;
	var position = pc.x;
	
	while (!position_ok && iterations < 10) {
		position_ok = true;
		var players = this.getActivePlayers();
		for (var i in players) {
			if(players[i].tsid != pc.tsid && this.stun_orbs[players[i].tsid] && Math.abs(position - players[i].x) < 80 && Math.abs(pc.y - players[i].y) < 200) {
				log.info("Player blocked. New position.");
				position_ok = false;
				position = pc.x + position_step;
				if(!iterations % 2) {
					position_step *= 2;
				} else {
					position_step *= -1;
				}
				iterations++;
				break;
			}
		}
	}
	if(position_ok) {
		pc.apiSendMsg({
			type: 'move_avatar',
			x: position,
			y: pc.y
		});
	}
}

function updateOrbMessages(pc_tsid) {
	if(!this.stun_orbs || !this.stun_orbs[pc_tsid] || (time() - this.stun_orbs[pc_tsid].start_time > 14)) {
		return;
	}
	
	var n_players = num_keys(this.stun_orbs[pc_tsid].players) - 1;
	var orb_state;
	if (n_players == 0) {
		orb_state = 'orb1';
	} else if (n_players < 3) {
		orb_state = 'orb2';
	} else if (n_players < 6) {
		orb_state = 'orb3';
	} else if (n_players < 9) {
		orb_state = 'orb4';
	} else {
		orb_state = 'orbBreak';
	}
	
	var scale = Math.min(1.0 + (1.0/6.0) * n_players, 2.0);
	
	var msgs = [{
		type:'overlay_state',
		state: orb_state,
		uid: 'orb_attack_'+pc_tsid
	}, {
		type:'overlay_scale',
		uid: 'orb_attack_'+pc_tsid,
		scale: scale,
		time: 1.0
	}];
	
	return msgs;
}

function sendGlowMsgToNewPlayer(orb_pc_tsid, contributor_tsid, new_pc, delay) {
	var pc = getPlayer(contributor_tsid);
	var annc = {
		type:'pc_overlay',
		pc_tsid: contributor_tsid,
		swf_url:overlay_key_to_url('avatar_power_up'),
		uid: 'orb_contribute_'+contributor_tsid,
		at_bottom: true,
		duration: (this.stun_orbs[orb_pc_tsid].start_time - time() + 15) * 1000
	};
	if(delay) {
		annc.delay_ms = delay;
	}
	new_pc.apiSendAnnouncement(annc);
}

function sendGlowMsg(orb_pc_tsid, contributor_tsid, locking, delay) {
	var pc = getPlayer(contributor_tsid);
	var annc = {
		type:'pc_overlay',
		pc_tsid: contributor_tsid,
		swf_url:overlay_key_to_url('avatar_power_up'),
		uid: 'orb_contribute_'+contributor_tsid,
		at_bottom: true,
		duration: (this.stun_orbs[orb_pc_tsid].start_time - time() + 15) * 1000
	};
	if(delay) {
		annc.delay_ms = delay;
	}
	if(locking) {
		this.apiSendAnnouncementX(annc, pc);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);
	} else {
		this.apiSendAnnouncement(annc);
	}
}

function newOrbMessage(pc_tsid, for_others) {
	if(!this.stun_orbs || !this.stun_orbs[pc_tsid] || (time() - this.stun_orbs[pc_tsid].start_time > 14)) {
		return;
	}
	
	var n_players = num_keys(this.stun_orbs[pc_tsid].players) - 1;
	var orb_state;
	if(n_players <= 0) {
		orb_state = 'orb1';
	} else if (n_players < 3) {
		orb_state = 'orb2';
	} else if (n_players < 6) {
		orb_state = 'orb3';
	} else if (n_players <= 9) {
		orb_state = 'orb4';
	} else {
		orb_state = 'orbBreak';
	}
	
	var annc = {
		type:'pc_overlay',
		pc_tsid:pc_tsid,
		at_top: true,
		swf_url:overlay_key_to_url('focusing_orb_attack'),
		state: orb_state,
		delta_y: -163,
		uid: 'orb_attack_'+pc_tsid,
		dont_keep_in_bounds: true,
		duration: (this.stun_orbs[pc_tsid].start_time - time() + 15) * 1000
	};
	
	if(for_others) {
		annc.mouse = {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.stun_orbs[pc_tsid].itemstack_tsid], id: pc_tsid},
			dismiss_on_click: false,
			txt: "Click to focus your imagination on the orb.",
			txt_delta_y: -30
		};
	} else {
		annc.dismissible = true;
		annc.dismiss_payload = {pc_tsid: pc_tsid, item_tsids: [this.stun_orbs[pc_tsid].itemstack_tsid]};
	}
	
	return annc;
}

function orbCountMessage(pc_tsid, delay) {
	if(!this.stun_orbs || !this.stun_orbs[pc_tsid]) {
		return;
	}

	var n_players = num_keys(this.stun_orbs[pc_tsid].players) - 1;
	
	var annc = {
		uid: 'orb_count_'+pc_tsid+"_"+n_players,
		pc_tsid: pc_tsid,
		at_top: true,
		type: "pc_overlay",
		delta_y: -175,
		duration: (this.stun_orbs[pc_tsid].start_time - time() + 15) * 1000,
		text: [
			'<p align="right"><span class="overlay_counter">'+n_players+'</span></p>'
		]
	};

	var scale = Math.min((1.0 / 6.0) * n_players, 1.0);
	annc.delta_y -= 30 * scale;
	
	if(delay) {
		annc.delay_ms = delay * 1000;
	}

	return annc;
}

function removeOrb(pc_tsid) {
	if(!this.stun_orbs || !this.stun_orbs[pc_tsid]) {
		return;
	}
	
	log.info('Removing orb.');

	var n_players = num_keys(this.stun_orbs[pc_tsid].players) - 1;
	
	for(var i in this.stun_orbs[pc_tsid].players) {
		var msg = {
			type: 'overlay_cancel',
			uid: 'orb_contribute_'+this.stun_orbs[pc_tsid].players[i]
		};
		this.apiSendMsgAsIs(msg);
		
		var attack_pc = getPlayer(this.stun_orbs[pc_tsid].players[i]);
		if(attack_pc) {
			if(attack_pc['!orb_attack']) {
				delete attack_pc['!orb_attack'];
			}
		}
	}
	
	delete this.stun_orbs[pc_tsid];
	
	var msg = {
		type: 'overlay_cancel',
		uid: 'orb_attack_'+pc_tsid
	};
	
	this.apiSendMsgAsIs(msg);

	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'orb_count_'+pc_tsid+'_'+n_players});

}

function orbNumPlayers(pc_tsid) {
	if(!this.stun_orbs[pc_tsid]) {
		return 0;
	} else {
		return num_keys(this.stun_orbs[pc_tsid].players) - 1;
	}
}

function orbCanAddPlayer(orb_pc_tsid, add_pc) {
	if(!this.stun_orbs[orb_pc_tsid] || in_array(add_pc.tsid, this.stun_orbs[orb_pc_tsid].players) || add_pc['!orb_attack']) {
		return false;
	}
	return true;
}

function orbAddPlayer(orb_pc_tsid, add_pc) {
	var n_players = num_keys(this.stun_orbs[orb_pc_tsid].players) - 1;

	if(!this.stun_orbs || !this.stun_orbs[orb_pc_tsid] || n_players == 9) {
		return;
	}
	
	add_pc['!orb_attack'] = orb_pc_tsid;
	
	var orb_pc = getPlayer(orb_pc_tsid);
	this.stun_orbs[orb_pc_tsid].players.push(add_pc.tsid);

	// Cancel existing orb text overlay
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: 'orb_count_'+orb_pc_tsid+"_"+n_players});
	n_players++;
	this.updateOrbForAll(orb_pc_tsid);
	
	if(n_players >= 9) {
		this.stun_orbs[orb_pc_tsid].dead_time = time();
		this.doOrbAttack(orb_pc_tsid);
		this.apiSetTimer('killOrbs', 1000);
	} else {
		/* This was pulled due to the difficulty in matching the moving time to a fixed timer.
		 * That led to a lot of cosmetic issues, etc. Dead code left in for possible later use.
		 */
		// Find the next available spot and move the player there
		/*	var side = (n_players % 2) ? -1 : 1;
		var x_pos = side * (((n_players - 1) / 2 * 100) + 50);
		add_pc.apiSendMsg({
		  type:  'move_avatar',
		  x:  orb_pc.x + x_pos,
		  y:  add_pc.y,
		  face: (side == 1) ? 'left' : 'right'
		});*/
		this.sendGlowMsg(orb_pc_tsid, add_pc.tsid, true);
	}
}

function newOrbAnnouncement(pc_tsid) {
	var pc = getPlayer(pc_tsid);
	pc.apiSendAnnouncement(this.newOrbMessage(pc_tsid, false));
	this.apiSendAnnouncementX(this.newOrbMessage(pc_tsid, true), pc);
	this.apiSendAnnouncement(this.orbCountMessage(pc_tsid, 1.5));
}

function onPlayerEnterRooked(pc) {
	pc.announce_music('ROOK_FLOCK', 999);
	this.rookOverlayMessage("ROOK ATTACK!", null, 0, pc);

	// Announce any orb overlays.
	for(var i in this.stun_orbs) {
		pc.apiSendAnnouncement(this.newOrbMessage(i, true));
		// Get updated scale and count info
		var msgs = this.updateOrbMessages(i);

		for (var j in msgs) {
			pc.apiSendMsg(msgs[j]);
		}
		
		for(var j in this.stun_orbs[i].players) {
			this.sendGlowMsgToNewPlayer(i, this.stun_orbs[i].players[j], pc);
		}
	}
	
	if(this.rook_status.phase == 'stunned') {
		log.info("rook is stunned, displaying overlays");
		for (var i in this.items) {
			if (this.items[i].hasTag('shrine')) {
				this.items[i].showPrimeOverlay(pc);
			}
		}
	}
}

function updateOrbForAll(pc_tsid) {
	var msgs = this.updateOrbMessages(pc_tsid);
	
	for (var i in msgs) {
		this.apiSendMsg(msgs[i]);
	}
	this.apiSendAnnouncement(this.orbCountMessage(pc_tsid));
}

function updateOrbForPlayer(source_tsid, target_pc) {
	var msgs = this.updateOrbMessages(source_tsid);
	
	for (var i in msgs) {
		target_pc.apiSendMsg(msgs[i]);
	}
}

function killOrbs() {
	for(var i in this.stun_orbs) {
		if(this.stun_orbs[i].dead_time && (time() - this.stun_orbs[i].dead_time >= 1)) {
			this.removeOrb(i);
		} else if (this.stun_orbs[i].dead_time) {
			this.apiSetTimer('killOrbs', 1000);
		}
	}
}

function doOrbAttack(pc_tsid) {
	var pc = getPlayer(pc_tsid);
	if(!this.stun_orbs || !this.stun_orbs[pc_tsid]) {
		return;
	}

	// If this is the first stun attempt, show the overlay
	if(this.rook_status.phase == 'build_up') {
		this.rookOverlayMessage("FIRST STUN ATTEMPT!", "Completely stun the Rook within 2 minutes or it will attack!", 0);
	}

	var n_players = num_keys(this.stun_orbs[pc_tsid].players) - 1;
	if(n_players >= 1 && n_players <= 8) {
		var annc = {
			type:'location_overlay',
			swf_url:overlay_key_to_url('focusing_orb_laser_beam'),
			uid: 'orb_laser_'+pc_tsid,
			x: pc.x,
			y: pc.y,
			dont_keep_in_bounds:true,
			duration:1000
		};
		var scale = Math.min((1.0 / 6.0) * n_players, 1.0);
		annc.y -= 50 - scale * 100;

		var xp = 0;
		var damage = 0;
		
		if(this.rook_attack) {
			switch(n_players) {
				case 1:
					xp = 10;
					damage = 25;
					break;
				case 2:
					xp = 20;
					damage = 40;
					break;
				case 3:
					xp = 20;
					damage = 60;
					break;
				case 4:
					xp = 30;
					damage = 85;
					break;
				case 5:
					xp = 30;
					damage = 130;
					break;
				default:
					xp = 50;
					damage = 200;
					break;
			}
			
			/* Give the initiator XP for a successful attack */
			var add_xp = pc.stats_add_xp(xp);
			pc.sendActivity("You received "+add_xp+" iMG for your successful attack against the Rook");
			
			this.rook_attack.doStun(pc, n_players, damage);
			
			this.apiSendAnnouncement({
				type:'location_overlay',
				swf_url:overlay_key_to_url('rook_feathers_falling'),
				uid: 'rook_feathers_'+pc_tsid,
				x: pc.x,
				y: pc.y - 220,
				dont_keep_in_bounds:true,
				duration:3000,
				delay_ms:1000
			});
			
			/* Give everyone xp for a successful attack, and move their cameras. */
			if (this.stun_orbs && this.stun_orbs[pc_tsid]){
				for(var i in this.stun_orbs[pc_tsid].players) {
					var attack_pc = getPlayer(this.stun_orbs[pc_tsid].players[i]);
					if(attack_pc) {
						attack_pc.sendActivity("You struck back against the Rook for "+damage+" points of stun. You got 25 iMG.");
						attack_pc.stats_add_xp(25);

						// Move the camera for players in view.
						attack_pc.apiSendMsg({
							type: 'camera_center',
							pc_tsid: pc_tsid,
							duration_ms: 2000
						});

					}
				}
			}
		}

		this.apiSendAnnouncementX(annc, pc);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);
		this.removeOrb(pc_tsid);
		this.apiSendMsg({
			type: 'overlay_scale',
			uid: 'orb_laser_'+pc_tsid,
			scale: 1.0 + scale,
			time: 0.25
		});
	} else {
		/* For failure! */
		for(var i in this.stun_orbs[pc_tsid].players) {
			var xp_pc = getPlayer(this.stun_orbs[pc_tsid].players[i]);
			if(xp_pc) {
				xp_pc.stats_add_xp(5);
				var mood_loss_message = '';
				if (!pc.buffs_has('rook_armor')){
					xp_pc.metabolics_lose_mood(5);
					mood_loss_message = ' but you lose 5 mood';
				}
				if(n_players > 8) {
					xp_pc.sendActivity("The orb was pushed past the breaking point! You gain 5 iMG"+mood_loss_message+".");
				} else {
					xp_pc.sendActivity("You failed to attack the Rook. You need other players to join in. You gain 5 iMG"+mood_loss_message+".");
				}
			}
		}

		// Do not make the rook angry if no one clicks in. It happens way too frequently.
		if(n_players >= 9) {
			this.rook_attack.doStun(pc, n_players, 0);
		} else {
			this.removeOrb(pc_tsid);
		}
	}
	// Everyone who got in on the attack gets the Rook's Wrath debuff
	// Players can no longer be rooked. This caused problems.
/*	for(var i in this.stun_orbs[pc_tsid].players) {
		var attack_pc = getPlayer(this.stun_orbs[pc_tsid].players[i]);
		if(attack_pc) {
			attack_pc.buffs_apply('rook_wrath');
		}
	}*/
}