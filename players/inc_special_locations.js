//--------------------------------
// Baqala Buff Stuff!
//--------------------------------

function baqala_setup() {
	if(!this.baqala_times) {
		this.baqala_times = {};
	}
	
	if(!this.baqala_times.time_spent) {
		this.baqala_times.time_spent = 0;
	}	
}

function start_baqala_buff() {

	// Have we logged in right when our timer runs out.
/*	if(this.get_baqala_buff_time() > 595) {
		log.info(this+' logged in right as Baqala buff wore off.');
		this.check_baqala_boot();
	}*/
	
	// otherwise, give the overwhelming nostalgia buff
	if(!this.buffs_has('ancestral_nostalgia')) {
		this.buffs_apply('ancestral_nostalgia');
	}
	this.sendActivity("The gravity of countless ages weighs heavily on your shoulders. You can't spend too long here!")

	// How much time since we last entered Baqala? 
	if(this.baqala_times && this.baqala_times.time_spent) {
		// Subtract half of time away from our cumulative time here, unless we were logged out
		if(!this.baqala_times.logged_out && this.baqala_times.exit_time) {
			this.baqala_times.time_spent -= (time() - this.baqala_times.exit_time) / 2.0;
		}
		
		// Grace period.
		if(this.baqala_times.time_spent >= 600) {
			this.baqala_times.time_spent = 585;
		}

		if(!this.baqala_times.logged_out) {
			// Adjust the buff time accordingly.
			if(this.baqala_times.time_spent < 0) {
				this.baqala_times.time_spent = 0;
			} else {
				if (this.imagination_has_upgrade("ancestral_lands_time_2")) { 
					this.buffs_alter_time('ancestral_nostalgia', -this.baqala_times.time_spent, 12*60)
				}
				else if (this.imagination_has_upgrade("ancestral_lands_time_1")){ 
					this.buffs_alter_time('ancestral_nostalgia', -this.baqala_times.time_spent, 11*60)
				}
				else { 
					this.buffs_alter_time('ancestral_nostalgia', -this.baqala_times.time_spent)
				}
			}
		}
		
		// Reset exit time.
		delete this.baqala_times.exit_time;
	} else {
		this.reset_baqala_times();
	}

	this.baqala_times.entry_time = time();		

//	if (this.baqala_times.total_time_spent > 60 * 60 && this.getQuestStatus('help_juju_bandits') == 'none' && is_chance(0.1)) {
	if (this.getQuestStatus('help_juju_bandits') == 'none') {
		this.baqala_times.offer_quest = true;
	} else {
		this.baqala_times.offer_quest = false;
	}
}

function reset_baqala_times() {
	if(!this.baqala_times) {
		this.baqala_times = {};
	}
	
	this.baqala_times.time_spent = 0;
	if(this.baqala_times.entry_time) {
		delete this.baqala_times.entry_time;
	}
	if(this.baqala_times.exit_time) {
		delete this.baqala_times.exit_time;
	}
}

function leave_savanna(logout) {
	// if we have the ancestral nostalogia buff, remove it.
	if(this.buffs_has('ancestral_nostalgia') && !logout) {
		this.buffs_remove('ancestral_nostalgia');
	}

	if (this.baqala_times.entry_time) {
		// Push the baqala exit time onto the player.
		this.baqala_times.exit_time = time();
		if(!this.baqala_times.time_spent) {
			this.baqala_times.time_spent = 0;
		}
		this.baqala_times.time_spent += time() - this.baqala_times.entry_time;
	
		if(!this.baqala_times.total_time_spent) {
			this.baqala_times.total_time_spent = 0;
		}
		this.baqala_times.total_time_spent += time() - this.baqala_times.entry_time;
	}
	
	this.baqala_times.logged_out = logout;	
	if (this.baqala_times.potion_used) {
		delete this.baqala_times.potion_used;
	}
}

function get_baqala_buff_time() {
	return this.baqala_times ? (this.baqala_times.time_spent + time() - this.baqala_times.entry_time) : 0;	
}

function set_baqala_times(times) {
	if(!this.baqala_times) {
		this.baqala_times = {};
	}
	
	for(i in times) {
		this.baqala_times[i] = times[i];
	}
}

function give_baqala_time(amount) {
	if(!this.buffs_has("ancestral_nostalgia")) {
		return;
	}
	
	if (this.imagination_has_upgrade("ancestral_lands_time_2")) { 
		var result = this.buffs_alter_time('ancestral_nostalgia', amount, 12 * 60);	
	}
	else if (this.imagination_has_upgrade("ancestral_lands_time_1")){ 
		var result = this.buffs_alter_time('ancestral_nostalgia', amount, 11 * 60);
	}
	else { 
		var result = this.buffs_alter_time('ancestral_nostalgia', amount);
	}
		
	// Don't forget to subtract from time spent!
	if(!this.baqala_times.time_spent) {
		this.baqala_times.time_spent = 0;
	}
	
	this.baqala_times.time_spent -= result;
}

function check_baqala_boot() {
	if(!this.baqala_times.time_spent) {
		this.baqala_times.time_spent = 0;
	}

	// If this is removed while we're in the savanna, and we're over the time, we are done for!
	if(this.location.hub_region() == "Savanna" && (this.get_baqala_buff_time() > 595 || !this.buffs_has('ancestral_nostalgia'))) {
		log.info(this+" is being booted from the savanna.");
		if(!this.buffs_has('too_much_nostalgia')) {
			this.buffs_apply('too_much_nostalgia');		
		}

		var ret = this.do_baqala_boot();
		if (ret && !ret.ok){
			log.error('Baqala teleport failed to move '+this+' with error: '+ret.error);
		}
	}
}

function do_baqala_boot() {
	if(this['on_overwhelmed_prompt']) {
		delete this['on_overwhelmed_prompt'];
	}

	if (this.is_god) {
		if(!this.baqala_times.total_time_spent) {
			this.baqala_times.total_time_spent = 0;
		}
		this.baqala_times.total_time_spent += time() - this.baqala_times.entry_time;
	}
		
	// Reset times and do teleport:
	this.reset_baqala_times();
	
	if(this.location.hub_region() != "Savanna" || this.get_baqala_buff_time() < 595) {
		if (this.get_baqala_buff_time() < 595) {
			log.error("Attempted to kick "+this+" out of the Savanna, but their time spent is only "+this.get_baqala_buff_time());
		}
		if (this.location.hub_region() != "Savanna") {
			log.error("Attempted to kick "+this+" out of the Savanna, but they aren't in the Savanna.");
		}
		return;
	}
	
	if(config.is_dev) {
		// Find a target on dev
		var target = apiFindObject('LM4104P19669M');
	} else if(config.is_prod) {
		var target = apiFindObject(choose_one([
			"LHV17T973F42GEP",
			"LHV1OOC40U42TKA",
			"LHV9BF0AUJ42CLQ",
			"LHV5B9093K42J9S",
			"LHV144684H42FI4",
			"LHV14CBAO352I1I",
			"LHV140E5N352BGF",
			"LA51IOM1PC62SPF",
			"LA51IVI7PC62L64",
			"LA51CAQQ55629QM",
			"LA517JJML262LT0",
			"LA517KBQL262H3U",
			"LA517L6UL262RHT",
			"LA51DOIHSK626VM",
			"LA57FADCBN62PR0",
			"LIF14RQ7V872TPR",
			"LIF18V95I972R96",
			"LIF16PJS9972LC8",
			"LIF14OKTU8722CQ",
			"LIF14QE5V872L2E",
			"LIF14PFVU872CSG",
			"LIF14TS9V872U9I",
			"LA9117J18492SRS",
			"LA9118S28492QCL",
			"LA9JJL6KCE924IK",
			"LA912UEGE492F2G"
		]));
	}
	// Pick a random signpost/door target in the street to send us to
	var targets = target.geo_links_get_incoming();
	var choice = choose_one(array_keys(targets));
	if (!targets[choice]){
		log.error("Attempted to kick "+this+" out of the Savanna, but couldn't find an appropriate location in the destination street.");
		return {
			ok: 0,
			error: "Something be wrong with that street."
		};
	}
		
	return this.teleportToLocationDelayed(target.tsid, targets[choice].x, targets[choice].y);
}

function overwhelmed_prompt_callback() {
	if(!this['too_much_nostalgia_prompt']) {
		delete this['too_much_nostalgia_prompt'];
	}
}

function juju_bandit_curse() {
	// Jujus will only appear in savanna hubs
	if(this.location.hub_region() != "Savanna") {
		return;
	}
	
	// Does the PC have anything the jujus want?
	var list = this.items_has_drops('dust_trap', 1);
	
	if(num_keys(list) == 0) {
		return;
	}
	
	// Is the PC currently being pursued by any jujus? If so, abort.
	var jujus = this.location.find_items('npc_juju_bandit');
	for (var i in jujus) {
		if (jujus[i].getTarget() == this) {
			return;
		}
	}

	// Pick and item and turn him loose
	var item_class = choose_one(list);
	if(is_chance(0.5)) {
		var offset = 250;
		
		if(this.x + offset > this.location.geo.r) {
			offset = -250;
		}
	} else {
		var offset = -250;

		if(this.x + offset < this.location.geo.l) {
			offset = 250;
		}
	}

	var point = this.location.apiGetPointOnTheClosestPlatformLineBelow(this.x + offset, this.y - 800);
	if(!point) {
		// Nowhere to go!
		return;
	}
	
	var juju = this.location.createItemStack('npc_juju_bandit', 1, point.x, point.y);
	juju.setParams(this, item_class);	

	if (this.baqala_times.offer_quest && this.getQuestStatus('help_juju_bandits') == 'none') {
		juju.setOfferQuest(true);
	}	
}

function is_in_savanna() {
	return this.location.is_savanna();
}

function last_region() {
	if(this.last_hub_visited && config.hubs[this.last_hub_visited]) {
		return config.regions[config.hubs[this.last_hub_visited]];
	} else {
		return 'None';
	}
}

/* Stuff for the Purple Journey */
function begin_purple_journey(stage) {
	var vogText = null;
	var vogClass = "nuxp_vog_smaller";
	var vogUID = null;
	
	var xpos = 0;
	var ypos = 0;
	
	switch (stage) {
		case 0:
			this.sendActivity("Nothing seems to be happening. Maybe you got a bad batch of Essence of Purple?");
			this.apiSetTimerX('begin_purple_journey', 15 * 1000, 1);
			break;
		case 1:
			this.sendActivity("Maybe you just need to take more.");
			this.apiSetTimerX('begin_purple_journey', 15 * 1000, 2);
			break;
		case 2:
			this.sendActivity("Oh, you're starting to feel relaxed and kind of tingly. Actually, it's fairly pleasant.");
			this.metabolics_add_mood(5);
			this.apiSetTimerX('begin_purple_journey', 7.5 * 1000, 3);
			break;
		case 3:
			this.sendActivity("You realize you've been grinding your teeth a little. Hurry up, please; it's time.");
			this.metabolics_add_mood(10);
			this.apiSetTimerX('begin_purple_journey', 5 * 1000, 4);
			break;
		case 4:
			this.sendActivity("Your jaw hurts now. Your jaw hurts your hurts your your hurry up please it's its");
			this.apiSetTimerX('begin_purple_journey', 2 * 1000, 5);
			break;
		case 5:
			vogText = "HURRY UP PLEASE ITS TIME.";
			vogUID = "purple_1";
			xpos = 20;
			ypos = 10;
			this.metabolics_lose_mood(5);
			this.apiSetTimerX('begin_purple_journey', 1000, 6);
			break;
		case 6:
			vogText = "HURRY UP PLEASE ITS HURRY UP PLEASE ITS HURRY UP PLEASE ITS TIME";
			vogUID = "purple_2";
			xpos = 50;
			ypos = 25;
			this.metabolics_lose_mood(10);
			this.apiSetTimerX('begin_purple_journey', 1000, 7);
			break;
		case 7:
			vogUID = "purple_3";
			vogText = "HURRY UP PLEASE ITS TIME OH NO OH NO OH NO OH NO OH NO NO NO NO NO NO";
			xpos = 25;
			ypos = 60;
			this.apiSetTimerX('begin_purple_journey', 500, 8);
		case 8:
			vogUID = "purple_4";
			vogText = "NO NO NO HURRY UP NO NO ITS NO NO HURRY UP PLEASE";
			xpos = 70;
			ypos = 80;
			this.apiSetTimerX('begin_purple_journey', 250, 9);
			break;
		case 9:
			vogUID = "purple_5";
			vogText = "HURRY HURRY HURRY HUR HURRY";
			xpos = 15;
			ypos = 80;
			this.apiSetTimerX('begin_purple_journey', 100, 10);
			break;
		case 10:
			vogUID = "purple_6";
			vogText = "ITS TIME ITS HURRY UP ITS OH NO";
			xpos = 70;
			ypos = 10;
			this.apiSetTimerX('begin_purple_journey', 1000, 11);
			break;
		case 11:
			vogUID = "purple_7";
			vogClass = "nuxp_vog";
			vogText = "HURRY UP PLEASE ITS TIME";
			xpos = 50;
			ypos = 50;
			this.events_add({ callback: 'instances_create_delayed', tsid: config.is_dev ? 'LMF33RVTAUG2IU6' : 'LNVV4OTMAUG2PQV', 
				instance_id: 'purple_journey', x: 0, y: -61}, 2.0);	
			this.apiSetTimerX('begin_purple_journey', 1500, 12);
			break;
		case 12:
			if (this.taken_purple) {
				delete this.taken_purple;
			}
			return;
	}
	
	if (vogUID) {
		this.playEmotionAnimation('surprise');

		if (stage == 10) {
			var steps = [
				{alpha:.5, secs:.5},
				{alpha:.5, secs:.75},
				{alpha:0, secs:.5},
				{alpha:0, secs:1.75}
			];	
		} else {
			var steps = [
				{alpha:.5, secs:.5},
				{alpha:.5, secs:.25},
				{alpha:0, secs:.5},
				{alpha:0, secs:1.75}
			];				
		}

		this.apiSendAnnouncement({
			type: 'vp_canvas',
			uid: 'purple_haze',
			canvas: {
				color: '#a020f0',
				steps: steps,
				loop: false
			}
		});

		this.apiSendAnnouncement({
			uid: vogUID,
			type: "vp_overlay",
			duration: 2500,
			locking: false,
			x: xpos+'%',
			top_y: ypos+'%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="'+vogClass+'">'+vogText+'</span></p>',
			]
		});	
	}
}

/***************** Mountaineering ***********************/
function mountaineering_start(expedition_id, duration, difficulty){
	if (!this.party) return {ok: 0, error: "You are not in a party."};
	if (this.party_has_space()) return {ok: 0, error: "There's already a space!"};

	this.party.create_mountain(expedition_id, duration, difficulty, this);

	return {ok: 1};
}

function displayFreeze(y_pos, height, rung){ 
	var width = Math.abs(this.location.geometry.l);
	
	var y = y_pos;
	var x = 0;
		
	this.sendActivity("displaying freeze at "+x+" "+y+" width "+width*2+" height "+height);
	
	this.location.apiSendAnnouncement({
		type: 'location_overlay',
		swf_url: overlay_key_to_url('mountain_freezetile'),
		x: x,
		y: y_pos,
		width: 500, //width*2,
		height: height,
		uid: 'freeze_tile_'+rung
	});
}

function removeFreeze(rung) {
	this.location.apiSendMsg({type: 'overlay_cancel', uid: 'freeze_tile_'+rung});
}
