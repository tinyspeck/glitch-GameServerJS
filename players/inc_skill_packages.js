function runDropTable(class_id, source, preface, offsets, props, combine_messages){
	//log.info('runDropTable: '+class_id);
	
	var prot = apiFindItemPrototype('catalog_drop_tables');
	if (prot.drop_tables[class_id]){
		var table = prot.drop_tables[class_id];

		var context = {'class_id': class_id, 'source': (source ? source.tsid : '')}; // For logs

		var chance = /*this.buffs_has('max_luck') ? 0 : */ randInt(0, 100); // Change to allow testing of multiple drops
		for (var drop_chance in table.drops){
			if (chance <= drop_chance){
				
				var items = table.drops[drop_chance];
				
				for (var i in items){
					var msg;

					var it = items[i];
					if (it.class_id && it.count){
						var item_prot = apiFindItemPrototype(it.class_id);
						it.label = item_prot.label;
						if (source){
							if(offsets) {
								this.createItemFromOffset(it.class_id, it.count, offsets, false, source, props);
							} else {
								this.createItemFromSource(it.class_id, it.count, source, false, props);
							}
						}
						else{
							this.createItemFromFamiliar(it.class_id, it.count, props);
						}

						if (combine_messages){
							combine_messages.push(pluralize(it.count, item_prot.name_single, item_prot.name_plural));
						}
						else{
							msg = "You got "+pluralize(it.count, item_prot.name_single, item_prot.name_plural)+"!";
						}
						
						this.quests_inc_counter('drop_table_'+class_id+'_'+it.class_id, it.count);
						
						// Quest-specific hacks
						if (class_id == 'ak_chicken_squeeze' && item_prot.is_musicblock){
							this.quests_inc_counter('chicken_music_block', 1);
						}
						else if (class_id == 'light_green_thumb_pet' && item_prot.is_musicblock){
							this.quests_set_flag('trant_music_block');
						}
						else if ((class_id == 'soil_appreciation_small' || class_id == 'soil_appreciation_large') && item_prot.is_musicblock){
							this.quests_inc_counter('patch_music_block', 1);
						}
						else if (class_id == 'spinning_wheel' && (it.class_id == 'cubimal_package' || it.class_id == 'cubimal_package_2')){
							this.feats_increment('streaking', 5);
						}
					}
					else if (it.currants){
						this.stats_add_currants(it.currants, context);
						if (combine_messages){
							combine_messages.push(pluralize(it.currants, 'currant', 'currants'));
						}
						else{
							msg = "You got "+pluralize(it.currants, 'currant', 'currants')+"!";
						}
						
						this.quests_inc_counter('drop_table_'+class_id+'_currants', it.currants);
					}
					else if (it.favor && it.favor.giant && it.favor.points){
						this.stats_add_favor_points(it.favor.giant, it.favor.points);
						var giantName = capitalize(it.favor.giant);
						if (it.favor.giant == 'all'){
							giantName = 'all the Giants';
						}

						if (combine_messages){
							combine_messages.push(it.favor.points+" favor with "+giantName);
						}
						else{
							msg = "You got "+it.favor.points+" favor with "+giantName+"!";
						}
						
						this.quests_inc_counter('drop_table_'+class_id+'_favor_'+it.favor.giant, it.favor.points);
					}
					else if (it.mood){
						var actual = this.metabolics_add_mood(it.mood);

						if (combine_messages){
							combine_messages.push(actual+" mood");
						}
						else{
							msg = "You got "+actual+" mood!";
						}
					}
					else if (it.energy){

						var actual = this.metabolics_add_energy(it.energy);
						if (combine_messages){
							combine_messages.push(actual+" energy");
						}
						else{
							msg = "You got "+actual+" energy!";
						}
					}
					else if (it.xp){

						var actual = this.stats_add_xp(it.xp, false, context);
						if (combine_messages){
							combine_messages.push(actual+" iMG");
						}
						else{
							msg = "You got "+actual+" iMG!";
						}
					}
					else if (it.drop_table){
						combine_messages = this.runDropTable(it.drop_table, source, preface, offsets, props, combine_messages);
					}
					
					if (msg && !combine_messages){
						if (preface){
							this.sendOnlineActivity(preface + msg);
						}
						else{
							this.sendOnlineActivity(msg);
						}
					}
				}
				
				if (combine_messages){
					return combine_messages;
				}
				else{
					return items;
				}
			}
		}
	}
	
	return false;
}

// Run skill package 'skill_id' on 'source_item'
// args are:
// 'tool_item': optional, plays tool animation, detects broken tool, wears tool
// 'no_fail': optional, true if this action is not allowed to fail, even if the package thinks it should
// 'force_fail': optional, true if this action should fail, even if the package thinks it should not -- BUT, it fails after any costs are taken
// 'overlay_id': id of an overlay to play instead of a tool animation
// 'tool_wear_multiplier': amount of normal tool wear to multiply by
// 'add_duration': amount in ms to add to duration
// 'no_drop': optional, true if we should not run any drops in any circumstances
// 'word_progress': optional, the id of the progress word to use (for word based progress bars)
// 'callback': function to call when skill package completes, useful for when the skill package has a duration.
//  The callback is called with a single argument, which is a hash indicating success and the values from the skill package
// 'no_timers': optional, true if you want to ignore duration and just run the whole skill package serially. The callback, if any, will still be called
// 'no_img_upgrades': optional, true if you want to ignore any imagination upgrades that affect this skill package
function runSkillPackage(class_id, source_item, args){
	log.info(this+' runSkillPackage: '+class_id+', '+args);
	if (!args) args = {};
	
	var details = this.getSkillPackageDetails(class_id, args.no_img_upgrades);
	if (!details) return {ok: 0, error: 'No matching details'};
	
	
	//
	// Does their tool work?
	//
	
	if (args.tool_item && details.tool_wear && args.tool_item.isWorking){
		if (!args.tool_wear_multiplier) args.tool_wear_multiplier = 1;
		if (!args.tool_item.isWorking(details.tool_wear * args.tool_wear_multiplier)) return {ok: 0, error: "Tool doesn't work", error_tool_broken: 1};
	}
	
	
	//
	// Enough energy?
	//

	if (!args.ignore_energy_cost && this.metabolics_get_energy() <= details.energy_cost * source_item.count){
		this.sendOnlineActivity("You're too tired to do that.");
		return {ok: 0, error: 'Not enough energy'};
	}
	
	if (source_item.onInteractionStarting) source_item.onInteractionStarting(this);
	
	//
	// Animation(s), even if we end up failing
	//
	
	var duration = details.duration;
	if (details.duration_max){
		if (this.buffs_has('max_luck')){
			duration = details.duration_max;
		} else {
			duration = randInt(details.duration/1000, details.duration_max/1000)*1000;
		}
	}

	if (args.add_duration) duration += args.add_duration;
	

	this.skill_package = {
		class_id: class_id,
		source_item_tsid: source_item.tsid,
		duration: duration,
		args: args,
		details: details
	};
	
	if (details.duration && apiIsPlayerOnline(this.tsid) && (args.tool_item || args.overlay_id) && !args.no_timers){
		
		if (source_item.isOnGround()){
			// Which direction are we "facing"?
			var pc_action_distance = source_item.getClassProp('pc_action_distance') !== undefined ? intval(source_item.getClassProp('pc_action_distance')) : undefined;
			var max_pc_action_distance;
			if (pc_action_distance === undefined){
				if ((config.is_dev || this.is_god) && args.msg && args.msg.verb){
					if (source_item.verbs && source_item.verbs[args.msg.verb]){
						if (source_item.verbs[args.msg.verb].proximity_override) max_pc_action_distance = source_item.verbs[args.msg.verb].proximity_override;
					}
				}

				pc_action_distance = 100;
			}

			if (max_pc_action_distance === undefined) max_pc_action_distance = pc_action_distance * 2;

			var state = '-tool_animation';
			var delta_x = 0;
			var endpoint = source_item.x;
			var face = 'left';
			if (source_item.x < this.x){
				delta_x = args.source_delta_x !== undefined ? args.source_delta_x : 10;
				endpoint += pc_action_distance;
			}
			else{
				state = 'tool_animation';
				delta_x = args.source_delta_x !== undefined ? (args.source_delta_x * -1) : -10;
				endpoint -= pc_action_distance;
				face = 'right';
			}
			
			
			// Move the player
			var distance = Math.abs(this.x-endpoint);
			if (distance && Math.abs(this.x-source_item.x) < Math.max(pc_action_distance * 0.125, 30) || Math.abs(this.x-source_item.x) > max_pc_action_distance){
				//this.moveAvatar(endpoint, this.y, face);
				distance = 0;
				this.faceAvatar(face);
			}
			else{
				distance = 0;
				this.faceAvatar(face);
			}
			
			if (config.is_dev) log.info(this+' skill package movement action_distance: ', pc_action_distance, ', max_distance: ', max_pc_action_distance, ', distance: '+distance);

			// Start overlays
			var annc = {
				type: 'itemstack_overlay',
				uid: this.tsid+'-'+class_id,
				duration: duration,
				locking: true,
				itemstack_tsid: source_item.tsid,
				delta_x: delta_x,
				delta_y: args.source_delta_y ? args.source_delta_y : 20,
				place_at_bottom: args.place_at_bottom ? true : false,
				word_progress: args.word_progress
			};
			
			if (source_item.hasTag('npc')) annc['follow'] = true;
			
			if (args.overlay_id){
				annc['swf_url'] = this.overlay_key_to_url(args.overlay_id);
			}
			else{
				annc['item_class'] = args.tool_item.class_tsid;
				annc['state'] = state;
			}
		
			if (duration >= 2000){
			
				annc['dismissible'] = true;
				
				annc['dismiss_payload'] = {
					skill_package: class_id
				};
				
				annc['dismiss_payload'].item_tsids = [source_item.tsid];
				if (args.tool_item && args.tool_item.tsid != source_item.tsid) annc['dismiss_payload'].item_tsids.push(args.tool_item.tsid);
			}
			
			if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);
		
			this.apiSendAnnouncement(annc);

			var anncx = {
				type: 'pc_overlay',
				uid: this.tsid+'-'+class_id+'-all',
				duration: duration,
				pc_tsid: this.tsid,
				delta_x: args.pc_delta_x ? args.pc_delta_x : 0,
				delta_y: args.pc_delta_y ? args.pc_delta_y : -110,
				bubble: true,
				width: args.bubble_width ? args.bubble_width : 40,
				height: 40
			};
			
			if (args.overlay_id){
				anncx['swf_url'] = this.overlay_key_to_url(args.overlay_id);
			}
			else{
				anncx['item_class'] = args.tool_item.class_tsid;
				anncx['state'] = state;
			}

			this.location.apiSendAnnouncementX(anncx, this);
		}
		else{
			var annc = {
				type: 'pc_overlay',
				uid: this.tsid+'-'+class_id,
				duration: duration,
				pc_tsid: this.tsid,
				locking: true,
				delta_x: 0,
				delta_y: -115,
				word_progress: args.word_progress
			};
			
			if (args.overlay_id){
				annc['swf_url'] = this.overlay_key_to_url(args.overlay_id);
			}
			else{
				annc['item_class'] = args.tool_item.class_tsid;
				annc['state'] = 'tool_animation';
			}
		
			if (duration >= 2000){
			
				annc['dismissible'] = true;
				annc['dismiss_payload'] = {
					skill_package: class_id
				};
				
				annc['dismiss_payload'].item_tsids = [source_item.tsid];
				if (args.tool_item && args.tool_item.tsid != source_item.tsid) annc['dismiss_payload'].item_tsids.push(args.tool_item.tsid);
			}
			this.apiSendAnnouncement(annc);
		
			var anncx = {
				type: 'pc_overlay',
				uid: this.tsid+'-'+class_id+'-all',
				duration: duration,
				pc_tsid: this.tsid,
				delta_x: 0,
				delta_y: -110,
				bubble: true,
				width: 40,
				height: 40
			};
			
			if (args.overlay_id){
				anncx['swf_url'] = this.overlay_key_to_url(args.overlay_id);
			}
			else{
				anncx['item_class'] = args.tool_item.class_tsid;
				anncx['state'] = 'tool_animation';
			}
		
			this.location.apiSendAnnouncementX(anncx, this);
		}
		
		this['!skill_package_running'] = {
			class_id: class_id,
			source_item: source_item
		};
		
		source_item['!skill_package_running'] = {
			class_id: class_id,
			pc: this
		};
		
		if (args.tool_item){
			args.tool_item['!skill_package_running'] = {
				class_id: class_id,
				pc: this
			};
			
			this.announce_sound(args.tool_item.class_tsid.toUpperCase(), 50);
		}
		
		this.apiSetTimer('finishSkillPackage', duration);
		return {ok: 1};
	}
	else{
		return this.finishSkillPackage();
	}
}

function finishSkillPackage(){
	//log.info(this+' finishSkillPackage');
	
	if (!num_keys(this.skill_package)){
		log.error(this+' missing skill package details');
		return {ok: 0, error: 'Missing skill package details'};
	}
	
	
	apiResetThreadCPUClock();
	var class_id = this.skill_package.class_id;
	if (this.skill_package.source_item_tsid){
		var source_item = apiFindObject(this.skill_package.source_item_tsid);
	}
	else{
		var source_item = this.skill_package.source_item;
	}
	var duration = this.skill_package.duration;
	var args = this.skill_package.args;
	var details = this.skill_package.details;
	this.skill_package = {};
	
	delete this['!skill_package_running'];
	source_item.clearSkillPackage();
	if (args.tool_item){
		this.announce_sound_stop(args.tool_item.class_tsid.toUpperCase());
		args.tool_item.clearSkillPackage();
	}
	
	if (source_item.onInteractionEnding) source_item.onInteractionEnding(this);
	
	var actuals = {
		duration: duration
	};
	var slugs = {};
	
	//
	// Huge success?
	//
	
	if (details.success_rate && !args.no_fail && !this.buffs_has('max_luck')){
		if (!is_chance(details.success_rate/100)){
			var ret = {ok: 0, error: 'Success rate failure', values: actuals, details: details, args: args};
			if (args.callback){
				if (source_item[args.callback]){
					source_item[args.callback].call(source_item, this, ret);
				}
				else{
					args.callback(ret);
				}
			}
			apiResetThreadCPUClock("finishSkillPackage_"+class_id+"_failed");
			return ret;
		}
	}
	
	if (details.interval_limit){
		
		var limit = details.interval_limit;
		
		// This shouldn't really go here, but I don't see any other way of overriding this.
		if (class_id === "peat_harvest" && this.imagination_has_upgrade("bog_specialization_dig_peat_bog_twice")) { 
			limit = 2;
		}
		
		if (this.checkSkillPackageOverLimit(class_id, limit, source_item)){
			var ret = {ok: 0, error: 'Player is over interval limit', values: actuals, details: details, args: args};
			if (args.callback){
				if (source_item[args.callback]){
					source_item[args.callback].call(source_item, this, ret);
				}
				else{
					args.callback(ret);
				}
			}
			apiResetThreadCPUClock("finishSkillPackage_"+class_id+"_interval");
			return ret;
		}
		
		this.incrementSkillPackageLimit(class_id, source_item);
	}
	
	//
	// Costs
	//
	
	actuals['energy_cost'] = 0;
	if (!args.ignore_energy_cost && details.energy_cost){
		actuals['energy_cost'] = this.metabolics_lose_energy(details.energy_cost * source_item.getProp('count'));
		slugs.energy = actuals['energy_cost'];
	}
	
	if (args.tool_item && details.tool_wear){
		if (args.tool_item && args.tool_item.use){
			if (!args.tool_wear_multiplier) args.tool_wear_multiplier = 1;
			args.tool_item.use(this, details.tool_wear * args.tool_wear_multiplier);
		}
	}


	//
	// Force fail?
	//

	if (args.force_fail){
		var ret = {ok: 0, error: 'Success rate failure', values: actuals, details: details, args: args};
		if (args.callback){
			if (source_item[args.callback]){
				source_item[args.callback].call(source_item, this, ret);
			}
			else{
				args.callback(ret);
			}
		}
		apiResetThreadCPUClock("finishSkillPackage_"+class_id+"_failed");
		return ret;
	}
	
	
	//
	// Rewards
	//
	
	actuals['mood_bonus'] = 0;
	if (!args.ignore_mood_bonus && details.mood_bonus){
		actuals['mood_bonus'] = this.metabolics_add_mood(details.mood_bonus);
		slugs.mood = actuals['mood_bonus'];
	}
	
	actuals['xp_bonus'] = 0;
	if (!args.ignore_xp_bonus && details.xp_bonus){
		var context = {'skill':class_id};
		
		actuals['xp_bonus'] = this.stats_add_xp(details.xp_bonus, false, context);
		slugs.xp = actuals['xp_bonus'];
	}
		

	if (details.drop_class_id && !args.no_drop){
		
		// Rubeweed improves the drop chance.
		var drop_chance = details.drop_chance * (this.buffs_has('rubeweed') ? 1.25 : 1.0);
		drop_chance = (drop_chance > 100) ? 100 : drop_chance;
				
		if (is_chance(drop_chance / 100) || this.buffs_has('max_luck')){
			details['got_drop'] = this.runDropTable(details.drop_class_id, source_item);
			
			for (var i in details['got_drop']){
				var it = details['got_drop'][i];
				if (it.class_id){
					if (!slugs.items) slugs.items = [];
					
					var item_prot = apiFindItemPrototype(it.class_id);
					slugs.items.push({
						class_tsid	: it.class_id,
						label		: item_prot.label,
						count		: it.count,
						//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
					});
				}
				else if (it.currants){
					if (!slugs.currants) slugs.currants = 0;
					slugs.currants += it.currants;
				}
				else if (it.favor){
					if (!slugs.favor) slugs.favor = [];
					slugs.favor.push({
						giant: it.favor.giant,
						points: it.favor.points
					});
				}
			}
		}
	}
	
	
	var ret = {ok: 1, values: actuals, details: details, args: args, slugs: slugs, class_id: class_id};
	if (args.callback){
		if (!source_item.runCallback(args.callback, this, ret)){
			args.callback(ret);
		}
	}
	apiResetThreadCPUClock("finishSkillPackage_"+class_id);
	return ret;
}

function getSkillPackageDetails(class_id, no_img_upgrades){
	var skill_package = get_skill_package(class_id);
	
	if (!skill_package){
		log.info('Error: attempt to read skills from undefined package '+class_id);
		return null;
	}
	
	if (!skill_package.skills) return null;
	
	
	//
	// Find the one we're qualified for
	//
	
	var details;
	for (var i in skill_package.skills){
		var s = skill_package.skills[i];
		if ((!details || s.rank > details.rank) && (i == 'no_skill' || this.skills_has(i))){
			details = s;
		}
	}
	
	var img_rank = {};
	var duration_multiplier = 0;

	if (!no_img_upgrades) { 
		for (var i in skill_package.img_upgrades){
			var img = skill_package.img_upgrades[i];
			var ranks = str(img.rank).split('.');
			var tmp_cat;
			var tmp_rank;

			if (ranks[1]){
				tmp_cat = intval(ranks[0]);
				tmp_rank = intval(ranks[1]);
			}else{
				tmp_cat = 0;
				tmp_rank = intval(ranks[0]);
			}

			if ((!details || !img_rank[tmp_cat] || img_rank[tmp_cat] < tmp_rank	) && this.imagination_has_upgrade(i)){
				img_rank[tmp_cat] = tmp_rank;

				if (class_id == 'croppery_clear' || class_id == 'herbalism_clear'){
				}
				
				if (img.drop_class_id != undefined) {
					details.drop_class_id = img.drop_class_id;
				}
				
				if (img.drop_chance != undefined) {
					details.drop_chance = img.drop_chance;
				}
				
				if (img.bonus_multiplier != undefined) {
					details.bonus_multiplier = img.bonus_multiplier;
				}
				
				if (img.bonus_chance != undefined) {
					details.bonus_chance = img.bonus_chance;
				}
				
				if (img.bonus_amount != undefined) {
					details.bonus_amount = img.bonus_amount;
				}
				
				if (img.duration_multiplier != undefined && img.duration_multiplier != 0){
					duration_multiplier = img.duration_multiplier;
				}
			}
		}
	}
	
	if (duration_multiplier > 0){
		//log.info("IMG duration was "+details.duration+" and max was "+details.duration_max+" with multiplier "+duration_multiplier);
		details.duration -= (details.duration * duration_multiplier);
		details.duration_max -= (details.duration_max * duration_multiplier);
		//log.info("IMG duration is now "+details.duration+" and max is now "+details.duration_max);
	}else if (duration_multiplier < 0){
		//log.info("IMG duration was "+details.duration+" and max was "+details.duration_max+" with multiplier "+duration_multiplier);
		details.duration += (details.duration * Math.abs(duration_multiplier));
		details.duration_max += (details.duration_max * Math.abs(duration_multiplier));
		//log.info("IMG duration is now "+details.duration+" and max is now "+details.duration_max);
	}

	if (this.skill_package_overrides){
		var overrides = this.skill_package_overrides[class_id];
		for (var i in overrides){
			details[i] = overrides[i];
		}
	}
	
	return details;
}

function checkSkillPackageOverLimit(class_id, limit, source_item){
	
	if (this.getSkillPackageLimitUses(class_id, source_item) >= limit){
		return true;
	}
	
	return false;
}

function incrementSkillPackageLimit(class_id, source_item){
	var today = current_day_key();
	source_item.package_intervals[class_id][today][this.tsid]++;
}

function getSkillPackageLimitUses(class_id, source_item){
	//
	// Hold hashes on the item for intervals.
	// Intervals are grouped by class, then by (game) day, then by player.
	//
	
	var today = current_day_key();
	if (!source_item.package_intervals) source_item.package_intervals = {};
	if (!source_item.package_intervals[class_id] || !source_item.package_intervals[class_id][today]) source_item.package_intervals[class_id] = {};
	
	
	//
	// Create a new hash for this player if one does not exist for today
	//
	
	if (!source_item.package_intervals[class_id][today]){
		source_item.package_intervals[class_id][today] = {};
	}
	
	if (!source_item.package_intervals[class_id][today][this.tsid]){
		source_item.package_intervals[class_id][today][this.tsid] = 0;
	}
	
	return source_item.package_intervals[class_id][today][this.tsid];
}

function addSkillPackageOverride(class_id, overrides){
	if (!this.skill_package_overrides){
		this.skill_package_overrides = {};
	}
	
	if (!this.skill_package_overrides[class_id]){
		this.skill_package_overrides[class_id] = {};
	}


	for (var i in overrides){
		this.skill_package_overrides[class_id][i] = overrides[i];
	}
}

function removeSkillPackageOverride(class_id){
	if (!this.skill_package_overrides) return;
	delete this.skill_package_overrides[class_id];
}

function getSkillPackageOverride(class_id){
	if (!this.skill_package_overrides) this.skill_package_overrides = {};
	return this.skill_package_overrides[class_id];
}

// Just returns a flat hash of the constant costs and rewards
function trySkillPackage(class_id, no_img_upgrades){
	var details = this.getSkillPackageDetails(class_id, no_img_upgrades);
	if (!details) return {};

	//log.info(details);
	
	var ret = {};
	ret.energy_cost = details.energy_cost;
	ret.mood = details.mood_bonus;
	ret.xp = details.xp_bonus * this.stats_get_xp_mood_bonus();
	ret.seconds = Math.round(details.duration / 1000);
	ret.wear = details.tool_wear;
	
	return ret;
}

function isRunningSkillPackage(){
	return num_keys(this.skill_package) ? true : false;
}

function cancelSkillPackage(){
	if (!this.isRunningSkillPackage()) return;
	
	this.apiCancelTimer('finishSkillPackage');

	var source_item;
	if (this.skill_package.source_item_tsid){
		source_item = apiFindObject(this.skill_package.source_item_tsid);
	}
	else{
		source_item = this.skill_package.source_item;
	}

	if (source_item && source_item.onCancelSkillPackage) {
		source_item.onCancelSkillPackage(this);
	}
	
	this.skill_package = {};

	delete this['!skill_package_running'];
	delete source_item['!skill_package_running'];
}
