function race_player_enter(pc){

	this.onCreateAsCopyOf();

	if (this.race_finished){
		pc.apiSendAnnouncement({
			uid: "race_ready",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">The race is over!</span></p>'
			]
		});
		
		pc.apiSetTimer('quests_multiplayer_leave_prompt', 1000);
	}
	else if (in_array(pc.tsid, this.race_players)){
		//log.info(this+' race player entered '+pc);
		if (this.race_started){
			pc.apiSetTimer('quests_multiplayer_leave_prompt', 1000);
		}
		else{
			pc.apiSendAnnouncement({
				uid: "race_ready",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: true,
				text: [
					'<p align="center"><span class="nuxp_vog">'+this.quest_desc+'</span><br><span class="nuxp_vog_smaller">(CLICK WHEN READY)</span></p>'
				],
				done_payload: {
					function_name: 'quests_multiplayer_ready'
				}
			});
		}
	}
	else{
		//log.info(this+' race non-player entered '+pc);
		pc.apiSetTimer('quests_multiplayer_leave_prompt', 1000);
	}
}

function race_player_ready(pc){
	if (in_array(pc.tsid, this.race_players)){
		if (!this.players_ready) this.players_ready = [];
		this.players_ready.push(pc.tsid);
		
		if (this.players_ready.length == this.race_players.length){
			this.race_start_countdown();
			this.apiCancelTimer('race_start_timeout');
			
			for (var i in this.race_players){
				var pc = getPlayer(this.race_players[i]);

				if (pc['!timeout_prompt']) pc.prompts_remove(pc['!timeout_prompt']);
			}
		}
		else{
			var waiting = [];
			for (var i in this.race_players){
				if (!in_array(this.race_players[i], this.players_ready)){
					waiting.push(getPlayer(this.race_players[i]).label);
				}
			}
			
			pc.apiSendAnnouncement({
				uid: "race_waiting",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog">WAITING FOR '+pretty_list(waiting, ' and ')+'.</span></p>'
				]
			});
			
			if (this.players_ready.length > 1){
				this.apiCancelTimer('race_start_timeout');
			}
			
			this.apiSetTimer('race_start_timeout', 60*1000);
		}
	}
}

function race_start_timeout(){
	if (!this.race_started){
		for (var i in this.race_players){
			var pc = getPlayer(this.race_players[i]);

			pc['!timeout_prompt'] = pc.prompts_add({
				txt		: 'Do you want to quit waiting?',
				timeout		: 60,
				choices		: [
					{ value : 'ok', label : 'OK' }
				],
				callback	: 'quests_multiplayer_leave'
			});
		}
	}
}

function race_dismiss_overlays(pc){
	if (this.race_type == 'most_quoins' || this.race_type == 'quoins_in_time'){
		for (var i in this.race_players){
			pc.overlay_dismiss('quoins_'+this.race_players[i]);
		}
		
		pc.overlay_dismiss('quoins_remaining');
	}
	else if (this.race_type == 'piggy_race'){
		for (var i in this.race_players){
			pc.overlay_dismiss('piggies_'+this.race_players[i]);
		}
		
		pc.announce_remove_all_indicators();
		pc.overlay_dismiss('pig_bait_tip');
		pc.overlay_dismiss('piggy_tip');
	}

	pc.overlay_dismiss('race_ready');
	pc.overlay_dismiss('race_waiting');
	
	if (pc['!timeout_prompt']) pc.prompts_remove(pc['!timeout_prompt']);
}

function race_player_exit(pc){
	
	//
	// Dismiss overlays
	//

	this.race_dismiss_overlays(pc);


	//
	// End the race if we only have one player left
	//

	if (this.players_ready){
		var ready_index = null;
		for (var i=0; i<this.players_ready.length; i++){
			if (this.players_ready[i] == pc.tsid) ready_index = i;
		}

		if (ready_index !== null) array_remove(this.players_ready, ready_index);
	}

	var players_index = null;
	for (var i=0; i<this.race_players.length; i++){
		if (this.race_players[i] == pc.tsid){
			players_index = i;
		}
		else{
			this.race_dismiss_overlays(getPlayer(this.race_players[i]));
		}
	}

	if (players_index !== null) array_remove(this.race_players, players_index);


	if (this.race_players.length == 1 && !this.race_finished){
		this.race_started = true; 
		var winner = getPlayer(this.race_players[0]);
		this.race_dismiss_overlays(winner);
		this.race_finish(winner);
	}


	//
	// If we failed the race, just drop the quest
	//
	
	if (pc.tsid == this.quest_owner){
		if (!this.winner || this.winner.tsid != pc.tsid){
			pc.failQuest(this.instance_id);
		}
	}
}

function race_start_countdown(){
	// Show overlay!
	
	for (var i in this.race_players){
		var pc = getPlayer(this.race_players[i]);
		
		pc.overlay_dismiss('race_waiting');
		pc.apiSendAnnouncement({
			type: 'vp_overlay',
			duration: 4000,
			swf_url: overlay_key_to_url('321_countdown'),
			locking: true,
			dismissible: false,
			x: '50%',
			top_y: '50%',
			width: 350,
			height: 350,
			uid: 'race_start'
		});
	}
	
	this.apiSetTimer('race_start', 4000);
}

function race_start(){
	this.race_started = true;
	
	// Like, what?
	if (this.race_type == 'most_quoins'){
		for (var i in this.race_players){
			var pc = getPlayer(this.race_players[i]);
			pc['!race_quoins_collected'] = 0;
			
			this.race_update_quoins_counter(pc);
		}
		
		this.race_update_quoins_remaining();
	}
	else if (this.race_type == 'quoins_in_time'){
		for (var i in this.race_players){
			var pc = getPlayer(this.race_players[i]);
			pc['!race_quoins_collected'] = 0;
			
			this.race_update_quoins_counter(pc);
		}
	}
	else if (this.race_type == 'piggy_race'){
		for (var i in this.race_players){
			var pc = getPlayer(this.race_players[i]);
			pc['!race_piggies_collected'] = 0;
			
			this.race_update_piggies_counter(pc);
		}
	}
}

function race_update_quoins_counter(pc){
	if (this.race_finished) return;

	var min_overlay_position = 30;
	var max_overlay_position = 100;
	var overlay_step = this.race_players && this.race_players.length > 1 ? Math.round((max_overlay_position - min_overlay_position) / (this.race_players.length-1)) : 0;
	
	var index = 0;
	for (var i in this.race_players){
		if (this.race_players[i] == pc.tsid){
			index = i;
			break;
		}
	}
	
	this.overlay_dismiss('quoins_'+pc.tsid);
	this.apiSendAnnouncement({
		uid: 'quoins_'+pc.tsid,
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: (min_overlay_position+(overlay_step*index))+'%',
		top_y: '10%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p><span class="overlay_counter">'+pc.label+': '+pc['!race_quoins_collected']+'</span></p>'
		]
	});
}

function race_update_piggies_counter(pc){
	if (this.race_finished) return;

	var min_overlay_position = 30;
	var max_overlay_position = 100;
	var overlay_step = this.race_players && this.race_players.length > 1 ? Math.round((max_overlay_position - min_overlay_position) / (this.race_players.length-1)) : 0;
	
	var index = 0;
	for (var i in this.race_players){
		if (this.race_players[i] == pc.tsid){
			index = i;
			break;
		}
	}
	
	this.overlay_dismiss('piggies_'+pc.tsid);
	this.apiSendAnnouncement({
		uid: 'piggies_'+pc.tsid,
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: (min_overlay_position+(overlay_step*index))+'%',
		top_y: '10%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p><span class="overlay_counter">'+pc.label+': '+pc['!race_piggies_collected']+'</span></p>'
		]
	});
}

function race_update_quoins_remaining(){
	if (this.race_finished) return;

	function is_quoin(it){ return it.class_tsid == 'quoin' && it.spawned; }
	var quoins_remaining = this.find_items(is_quoin).length;
	
	this.overlay_dismiss('quoins_remaining');
	this.apiSendAnnouncement({
		uid: 'quoins_remaining',
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '65%',
		top_y: '10%',
		delay_ms: 0,
		click_to_advance: false,
		bubble_familiar: false,
		text: [
			'<p><span class="overlay_counter">Remaining: '+quoins_remaining+'</span></p>'
		]
	});
}

function race_find_quoins_winner(){
	var highest_pc = null;
	var highest_count = 0;
	for (var i in this.race_players){
		var pc = getPlayer(this.race_players[i]);
		//log.info('race_find_quoins_winner '+pc+' '+pc['!race_quoins_collected']+' > '+highest_count);
		if (pc['!race_quoins_collected'] > highest_count){
			highest_pc = pc;
			highest_count = pc['!race_quoins_collected'];
		}
	}
	
	return highest_pc;
}

function race_finish(winner){
	if (!this.race_started) return false;
	
	if (!this.race_finished){
		this.race_finished = true;
		
		this.winner = winner;
		// myles, rewards: 100C + 50xp to winner, 25C + 5xp to loser
		winner.counters_increment('races_won', this.instance_id);
		var xp = 0;
		var currants = 0;
		if (winner.counters_get_label_count('races_won', this.instance_id) <= 10){
			var context = {'verb':'race','instance':this.instance_id};
			currants = winner.stats_add_currants(100, context);
			xp = winner.stats_add_xp(50, false, context);
		}
		
		winner.apiSendAnnouncement({
			uid: "race_results",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '20%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">YOU WON!</span><br><span class="nuxp_vog_smaller">(You got '+currants+' currants and '+xp+' xp.)</span></p>'
			]
		});
		winner.show_rainbow('rainbow_winner');
		winner.events_add({callback: 'playEmotionAnimationDelayed', em: 'happy'}, 2);
		winner.quests_set_flag('multiplayer_quest_win');
		if (winner.location.tsid == this.tsid) winner.apiSetTimer('quests_multiplayer_leave_prompt', 1000);
		
		for (var i in this.race_players){
			if (this.race_players[i] == winner.tsid) continue;
			
			var loser = getPlayer(this.race_players[i]);
			if (loser && loser.location.tsid == this.tsid){
				loser.counters_increment('races_lost', this.instance_id);
				var xp = 0;
				var currants = 0;
				if (loser.counters_get_label_count('races_lost', this.instance_id) <= 10){
					var context = {'verb':'race', 'instance':this.instance_id};
					currants = loser.stats_add_currants(25, context);
					xp = loser.stats_add_xp(5, false, context);
				}
			
				loser.apiSendAnnouncement({
					uid: "race_results",
					type: "vp_overlay",
					duration: 0,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '20%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog">'+winner.label+' IS THE WINNER!</span><br><span class="nuxp_vog_smaller">(You get '+currants+' currants and '+xp+' xp for 2nd place)</span></p>'
					]
				});
				loser.events_add({callback: 'playEmotionAnimationDelayed', em: 'angry'}, 2);
				loser.apiSetTimer('quests_multiplayer_leave_prompt', 1000);
			}
		}
	}
}