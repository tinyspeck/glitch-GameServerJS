// http://wiki.tinyspeck.com/wiki/Feats

function feats_init(){
	if (!this.feats){
		this.feats = apiNewOwnedDC(this);
		this.feats.label = 'Feats';
		this.feats.todo = {};
		this.feats.feats = {};
	}

	if (!this.feats.todo) this.feats.todo = {};
	if (!this.feats.in_progress) this.feats.in_progress = {};
}

function feats_get(class_tsid, skip_range){
	// In catalog?
	var cfg = config.feats[class_tsid];
	if (!cfg) return null;

	// Within range?
	if (!skip_range && !config.enable_all_the_feats){
		var today = current_day_key();
		if (today < cfg.game_day) return null;

		var converted = gametime_to_timestamp(cfg.game_day.split('-'));
		var tomorrow = gametime_to_key(timestamp_to_gametime(converted + (24*60*60)));
		if (today >= tomorrow) return null;
	}

	// Find object
	var feat = apiFindObject(cfg.tsid);
	if (feat === undefined || feat === null) return null;

	return feat;
}

function feats_increment(class_tsid, amount){
	// Get feat
	var feat = this.feats_get(class_tsid);
	if (feat === undefined || feat === null) return 0;

	// Are we allowed to contribute?
	if (!this.has_blown_conch) return 0;

	// Increment
	amount = feat.increment(this, amount);
	if (amount){
		this.feats_init();
		
		var cfg = config.feats[class_tsid];
		var converted = gametime_to_timestamp(cfg.game_day.split('-'));

		if (!this.feats_has_contributed(class_tsid)){
			this.achievements_increment('feats', 'contributed', 1);
			if (cfg.epic_id){
				this.achievements_increment('epics_contributed', cfg.epic_id, 1);

				var feat_all_the_epics = 1;
				for (var i in this.feats.todo){
					if (config.feats[i] && config.feats[i].epic_id == cfg.epic_id) feat_all_the_epics++;
				}

				for (var i in this.feats.feats){
					if (config.feats[i] && config.feats[i].epic_id == cfg.epic_id) feat_all_the_epics++;
				}

				if (feat_all_the_epics == this.feats_count_in_epic(cfg.epic_id)){
					this.achievements_increment('epics_completed', cfg.epic_id, 1);
				}
			}

			if (time() - converted <= (30*60)) this.achievements_grant('quick_on_your_feat');

			var vog_text = cfg ? cfg.vog_text : null;
			if (vog_text){
				var status = feat.get_status();
				if (status.value <= status.goal){
					vog_text = vog_text.replace(/\{remaining\}/g, Math.round(status.goal - status.value, 2));

					//vog_text += '<br /><a href="event:external|/feats/'+cfg.url+'">See Feat details</a>';
					this.announce_vog_fade(vog_text, {css_class: 'nuxp_medium'});
				}
			}
		}

/*
		if (!this.achievements_has('down_to_the_wire') && converted + (24*60*60) - time() <= (30*60)){
			var status = feat.get_status();
			var remaining = status.goal - status.value;
			var goal = status.goal;
			if (remaining < 0){
				remaining = status.stretch_goal1 - status.value;
				goal = status.stretch_goal1;
				if (remaining < 0){
					remaining = status.stretch_goal2 - status.value;
					goal = status.stretch_goal2;
				}
			}

			if (remaining > 0 && (1 - (remaining / goal) <= 0.05)) this.achievements_grant('down_to_the_wire');
		}
*/

		if (!this.achievements_has('down_to_the_wire')) {
			this.achievements_grant('down_to_the_wire');
		}

		if (!this.feats.in_progress) this.feats.in_progress = {};
		this.feats.in_progress[class_tsid] = time();
	}

	return amount;
}

function feats_is_complete(class_tsid){
	var feat = this.feats_get(class_tsid, true);
	if (!feat) return false;

	return feat.is_complete();
}

function feats_get_status(class_tsid){
	var feat = this.feats_get(class_tsid, true);
	if (!feat) return {};

	return feat.get_status();
}

function adminFeatsGiveRewards(rewards){
	this.feats_init();

	if (this.feats.todo[rewards.feat_id]) return;
	if (this.feats.feats[rewards.feat_id]) return;

	this.feats.todo[rewards.feat_id] = rewards;
	delete this.feats.in_progress[rewards.feat_id];

	// Achievements
	if (rewards.place && rewards.place <= 26){
		this.achievements_increment('feats', 'top_26', 1);
	}
	else if (rewards.place && rewards.place <= 30){
		this.achievements_grant('the_cigar');
	}

	if (this.is_dead) return; // resurrecting will send these later
    this.familiar_send_alert({
		'callback'	: 'feats_familiar_turnin_do',
		'feat_id'	: rewards.feat_id
	});
}

function feats_has_unclaimed_rewards(){
	if (!this.feats || !this.feats.todo) return false;
	if (num_keys(this.familiar_find_alerts('feats_familiar_turnin_do'))) return false;
	
	for (var i in this.feats.todo){
		return i;
	}

	return false;
}

function feats_familiar_turnin_do(choice, details){
	/*
	if (this.tsid != 'PHVRJ840M992GJK'){
		return {
			txt: "Feat rewards are currently disabled while we work on a bug",
			done: true,
		};
	}
	*/


	if (choice == 'feat-complete'){
				
		this.feats_gather_rewards(details.feat_id);
		
		return {
			feat_id: details.feat_id,
			done: true
		};
	}
	else{
		
		var rewards = this.feats.todo[details.feat_id];
		var feat = this.feats_get_status(details.feat_id);
		
		var completion_text = "The ancient Feat \""+rewards.title+"\" has been successfully recreated by modern Glitches. Your participation has earned you the following rewards:";

		var rewards_clean = utils.copy_hash(rewards);
		delete rewards_clean.title;
		delete rewards_clean.feat_id;

		rewards_clean.imagination = rewards_clean.xp;
		delete rewards_clean.xp;

		if (rewards_clean.favor_giant_perf && rewards_clean.favor_giant_perf == rewards_clean.favor_giant){
			rewards_clean.favor_points += rewards_clean.favor_points_perf;
			delete rewards_clean.favor_giant_perf;
			delete rewards_clean.favor_points_perf;
		}

		rewards_clean.favor = [];
		if (rewards_clean.favor_giant && rewards_clean.favor_points){
			rewards_clean.favor.push({giant: rewards_clean.favor_giant, points: rewards_clean.favor_points});
		}
		delete rewards_clean.favor_giant;
		delete rewards_clean.favor_points;

		if (rewards_clean.favor_giant_perf && rewards_clean.favor_points_perf){
			rewards_clean.favor.push({giant: rewards_clean.favor_giant_perf, points: rewards_clean.favor_points_perf});
		}
		delete rewards_clean.favor_giant_perf;
		delete rewards_clean.favor_points_perf;

		for (var i in rewards_clean.items){
			var proto = apiFindItemPrototype(rewards_clean.items[i].class_tsid);
			if (proto){
				if (rewards_clean.items[i].count == 1){
					rewards_clean.items[i].label = proto.name_single;
				}
				else{
					rewards_clean.items[i].label = proto.name_plural;
				}
			}
		}

		for (var i in rewards_clean.recipes){
			var proto = get_recipe(rewards_clean.recipes[i].class_id);
			if (proto){
				rewards_clean.recipes[i].label = proto.name;
			}
		}
		
		return {
			txt: completion_text,
			args: {
				feat_id: details.feat_id,
				job_complete_convo: true,
				rewards: rewards_clean,
				title: "Feat Completed!"
			},
			
			choices: {
				1: {
					txt	: 'OK',
					value	: 'feat-complete'
				}
			}
		};
	}
}

function feats_gather_rewards(feat_id){
	var rewards = this.feats.todo[feat_id];
	if (!rewards) return;

	if (rewards.xp) rewards.xp = this.stats_add_xp(rewards.xp, false, {type: 'feat_complete', feat_id: rewards.feat_id});
	if (rewards.currants) rewards.currants = this.stats_add_currants(rewards.currants, {type: 'feat_complete', feat_id: rewards.feat_id});
	if (rewards.mood) rewards.mood = this.metabolics_add_mood(rewards.mood);
	if (rewards.energy) rewards.energy = this.metabolics_add_energy(rewards.energy);
	if (rewards.favor_giant && rewards.favor_points) this.stats_add_favor_points(rewards.favor_giant, rewards.favor_points);
	if (rewards.favor_giant_perf && rewards.favor_points_perf) this.stats_add_favor_points(rewards.favor_giant_perf, rewards.favor_points_perf);

	for (var i in rewards.items){
		this.createItemFromFamiliar(rewards.items[i].class_tsid, rewards.items[i].count);
	}

	for (var i in rewards.recipes){
		this.making_try_learn_recipe(rewards.recipes[i].class_tsid);
	}

	for (var i in rewards.drop_table){
		this.runDropTable(rewards.drop_table[i].class_tsid);
	}

	this.feats.feats[rewards.feat_id] = rewards;
	delete this.feats.todo[feat_id];

	this.achievements_increment('feats', 'contributed_to');
	apiLogAction('FEAT_REWARDS', 'pc='+this.tsid, 'feat_id='+rewards.feat_id, 'xp='+intval(rewards.xp), 'mood='+intval(rewards.mood), 'energy='+intval(rewards.energy), 'currants='+intval(rewards.currants));
}

function feats_has_contributed(feat_id){
	this.feats_init();
	if (this.feats.todo[feat_id]) return true;
	if (this.feats.feats[feat_id]) return true;
	if (feat_id == 'qurazy_quoin_collecting' && this.feats.in_progress[feat_id] < 1350003600) return false; // hack for accidentally released feat.
	if (this.feats.in_progress[feat_id]) return true;

	return false;
}

function feats_get_current(){
	var today = current_day_key();

	for (var i in config.feats){
		var feat = config.feats[i];

		if (today >= feat.game_day){
			var converted = gametime_to_timestamp(feat.game_day.split('-'));
			var tomorrow = gametime_to_key(timestamp_to_gametime(converted + (24*60*60)));
			if (today < tomorrow) return feat;
		}
	}

	return null;
}

function feats_count_in_epic(epic_id){
	var count = 0;

	for (var i in config.feats){
		if (config.feats[i].epic_id == epic_id) count++;
	}

	return count;
}

function feats_increment_for_commit(amount){
	return;
	this.feats_init();
	// Are we allowed to contribute?
	if (!this.has_blown_conch) return 0;

	if (!this.feats.to_commit) this.feats.to_commit = 0;
	this.feats.to_commit += amount;
}

function feats_reset_commit(){
	return;
	this.feats_init();
	if (this.feats.to_commit) this.sendActivity("Whoops! You lost your contribution to the \"… And Ask Nothing in Return\" Feat!");
	delete this.feats.to_commit;
}

function feats_get_for_commit(){
	return 0;
	this.feats_init();
	if (!this.feats.to_commit) return 0;

	var value = this.feats.to_commit;
	delete this.feats.to_commit;
	return value;
}
