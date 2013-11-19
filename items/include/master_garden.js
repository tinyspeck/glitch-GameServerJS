
// The master gardener potions need to be able to interact with gardens all at once instead of plot by plot.
// So, this is a copy of the ridculously long function that does all the garden stuff so 
// we can change how it works without breaking the existing functionality.
// var args = {
//			pc: pc.tsid,
//			garden: garden,
//			action: action,
//			seed: seed_id,
//		};
function potionTendGarden(args){

	var pc = this.checkPlayerGarden(args);

	if (!pc){
		this.clearFlags();
		return {
			'ok'	: 0,
			'error'	: "Can't find player",
			'no_garden' : 1
		};
	}


	// Change this to check all plots
	var plots = this.data.plots;
	for (var i in plots) { 
		if (!plots[i].grow_modifier) { 
			plots[i].grow_modifier = 1;
		}
	}
	this.data.plots = plots;
	//if (!this.data.plots[args.plot].grow_modifier) this.data.plots[args.plot].grow_modifier = 1;
	
	
	//
	// Move the player
	//
	
	if (this.x < pc.x){
		var state = '-tool_animation';
		var delta_x = 0;
		var endpoint = this.x+100;
		var face = 'left';
	}
	else{
		var state = 'tool_animation';
		var delta_x = 0;
		var endpoint = this.x-100;
		var face = 'right';
	}
	
	var distance = Math.abs(pc.x-endpoint);
	//pc.moveAvatar(endpoint, pc.y, face);
	
	var talkback_key = null;
	
	// Which skill package set are we using?
	switch(this.getInstanceProp('garden_type')) {
		case 'herb':
			
			var package_water = "mg_herbalism_water";
			var package_plant = "mg_herbalism_plant";
			var package_harvest = "mg_herbalism_harvest";
			var package_clear = "mg_herbalism_clear";
			var package_fertilize = "mg_herbalism_fertilize";
		
			/*if (pc.skills_has('herbalism_1') || (args.action != 'water' && args.action != 'plant' && args.action != 'clear')){
				talkback_key = 'herb_';
			}*/
			break;
		case 'default':
		default:
			
			var package_water = "mg_croppery_water";
			var package_plant = "mg_croppery_plant";
			var package_harvest = "mg_croppery_harvest";
			var package_clear = "mg_croppery_clear";
			var package_fertilize = "mg_croppery_fertilize";
		
			/*if (pc.skills_has('croppery_1') || (args.action != 'water' && args.action != 'plant' && args.action != 'clear')){
				talkback_key = 'crop_';
			}*/
			break;
	}
	
	
	//
	// perform the action?
	//

	var announce = {};

	plots = this.data.plots;
	for (i in plots) { 
		this.initPlot(i);
	}
	this.data.plots = plots;

	var achievement_key = this.tsid;
	if (args.action == 'water'){
		
		this.water_in_progress = true;
		
		//if (talkback_key) talkback_key += 'water';
	
		var energy = 0;
		var mood = 0;
		var xp = 0;
		
		var count = 0;
		var plot_id = 0;
		plots = this.data.plots;
		for (var p in plots) {
			// According to the spreadsheet, we're supposed to charge for all plots, so took 
			// this out:
			//if (plots[p].wet) { continue; } // skip this plot if it is already wet
		
			var details = pc.getSkillPackageDetails(package_water);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				var result = {ok:0};
				break;
			}

			//log.info(this+" MG Watering plot "+p+" skill package is "+package_water);
			
			pc.addSkillPackageOverride(package_water, {drop_chance: 0.0});
			var ret = pc.runSkillPackage(package_water, this, {tool_item: null, msg: args.msg, no_timers: true});
				
			pc.removeSkillPackageOverride(package_water);

			//log.info(this+" MG result is "+ret);
				
			if (ret['ok']){
			
				//log.info("MG water got drop is "+ret["got_drop"]);
				
			
				energy += intval(ret.values['energy_cost']);
			    mood += intval(ret.values['mood_bonus']);
				xp += intval(ret.values['xp_bonus']);//log.info('watering...');
				
				
				if (!(plots[p]).wet){
					//log.info('--we were previously dry');
					// we were previously dry.
					// if we were growing, restart the grow timer 
					if (this.data.plots[p].state == 'seeds'){
						//log.info('--restarting grow1');
						var seed = apiFindItemPrototype(this.data.plots[p].seed);
						this.data.plots[p].start_grow = time();
						this.pushEvent(p, seed.classProps.time_grow1 * config.garden_grow_multiplier * this.data.plots[p].grow_modifier - this.data.plots[p].growth, 'grow1');
					}
					if (this.data.plots[p].state == 'shoots'){
						//log.info('--restarting grow2');
						var seed = apiFindItemPrototype(this.data.plots[p].seed);
						this.data.plots[p].start_grow = time();
						this.pushEvent(p, (floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * this.data.plots[p].grow_modifier) + floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * this.data.plots[p].grow_modifier)) - this.data.plots[p].growth, 'grow2');
					}
				
					pc.achievements_increment('garden_plots_watered', achievement_key);
				}

				this.data.plots[p].wet = true;
				this.clearEvents(p, 'dry');
				this.data.plots[p].start_water = time();
				this.pushEvent(p, timings.water, 'dry');
				
				var overlay_item_class = "watering_can";
				
				var duration =  2000;
				
				var annc = {
					type: 'itemstack_overlay',
					duration: duration,
					locking: true,
					itemstack_tsid: this.tsid,
					delta_x: delta_x,
					delta_y: -10,
					width: 30, 
					height: 30,
					state: state,
					item_class: overlay_item_class,
					plot_id: plot_id
				};
		
				if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

				//log.info("MG sending pc announcement "+annc);
				pc.apiSendAnnouncement(annc);
				count ++;
				
				if (pc.imagination_has_upgrade("croppery_herbalism_watering_time")) {
					pc.announce_sound('WATERING_CAN', 1);
				}
				else { 
					pc.announce_sound('WATERING_CAN', 2);
				}
			}
			else{
				//log.info(this+" MG failed to water plot "+p);
			
				// If you fail to water:
				// take the two energy it normally costs to water, take 3 mood as a penalty. And say "Oops. // Somehow you failed at watering that. Try again?"
				if (ret.details && ret.details.energy_cost){
					var energy = pc.metabolics_lose_energy(ret.details.energy_cost);
				}
				else{
					var energy = pc.metabolics_lose_energy(2);
				}
				var mood = pc.metabolics_lose_mood(3);

				pc.announce_sound('CLICK_FAILURE');
				//if (talkback_key) this.sendResponse(talkback_key+'_na_failed', pc, ret.slugs);
				this.clearFlags();
				return {'ok':0};
			}
			
			plot_id ++;
		}
		
		//log.info(this+" MG done watering "+energy+" "+mood+" "+xp);
		
		if (count) { 
			announce = {
						'type'		: 'water',
						'energy'	: energy,
						'mood'		: mood,
						'xp'		: xp,
						'msg'		: "You watered a garden."
					};
		}
		else { 
			this.clearFlags();
			return {'ok':0 }
		}
	}

	if (args.action == 'hoe'){

		this.clear_in_progress = true;
	
		var energy = 0;
		var mood = 0;
		var xp = 0;
		
		//if (talkback_key) talkback_key += 'clear';
		
		var count = 0;
		var plot_id = 0;
		plots = this.data.plots;
		for (var p in plots) {
			if (plots[p].state == 'dirty') {
				
				var details = pc.getSkillPackageDetails(package_clear);
				if (pc.metabolics_get_energy() <= details.energy_cost){
					pc.announce_sound('CLICK_FAILURE');
					pc.sendActivity("You're too tired to do that.");
					var result = {ok:0};
					break;
				}

				pc.addSkillPackageOverride(package_clear, {drop_chance: 0.0});
				
				var ret = pc.runSkillPackage(package_clear, this, {msg: args.msg, no_timers: true});
				
				pc.removeSkillPackageOverride(package_clear);
				
				if (ret['ok']){
				
				//	log.info("MG clear got drop is "+ret["got_drop"]);
				
				
					plots[p].state = 'clean';
				
					pc.achievements_increment('garden_plots_hoed', achievement_key);

					energy += intval(ret.values['energy_cost']);
					mood += intval(ret.values['mood_bonus']);
					xp += intval(ret.values['xp_bonus']);
					
					if (pc.imagination_has_upgrade("croppery_herbalism_clearing_time")){
						pc.announce_sound("HOE", 1);
					}
					else{
						pc.announce_sound('HOE', 2);
					}
					count ++;
				}
				else{
					//log.info('clearing failed');
					
					var msg = "Oops. You mostly just pushed the bracken around a bit. Try again?";
					
					pc.announce_sound('CLICK_FAILURE');
					
					this.clearFlags();
					return {
						'ok' : 0,
						'error' : msg,
					};
				}
				
				
				var overlay_item_class = "hoe";
				
				var duration =  2000;
				
				var annc = {
					type: 'itemstack_overlay',
					duration: duration,
					locking: true,
					itemstack_tsid: this.tsid,
					delta_x: delta_x,
					delta_y: -20,
					state: state,
					item_class: overlay_item_class,
					plot_id: plot_id
				};
		
				if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

				//log.info("MG sending pc announcement "+annc);
				pc.apiSendAnnouncement(annc);
			}	
			
			plot_id ++;
		}
		
		if (count) { 
			announce = {
					'type'		: 'clean',
					'energy'	: energy,
					'mood'		: mood,
					'xp'		: xp,
					'msg'		: 'You cleaned a garden.',
				};
		}
		else { 
			this.clearFlags();
			return {'ok':0};
		}
				
		//var overlay_item_class = "potion_garden_clear";
				
	}
	

	if (args.action == 'plant'){

	//	log.info("MG planting for player "+pc+" and in progress is "+this.plant_in_progress);
		this.plant_in_progress = true;
	
		//if (talkback_key) talkback_key += 'plant';
	
		var energy = 0;
		var mood = 0;
		var xp = 0;
		
		var count = 0;
		plots = this.data.plots;
		for (var p in plots) {
	
			// check that we have the specified seed
			if (!pc.items_has(args.seed, 1)){ break; }
			
			// skip plots that aren't clean
			if (plots[p].state != 'clean') { continue; }

			var details = pc.getSkillPackageDetails(package_plant);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				var result = {ok:0};
				break;
			}

			pc.addSkillPackageOverride(package_plant, {drop_chance: 0.0});
			var ret = pc.runSkillPackage(package_plant, this, {msg: args.msg, no_timers: true});
			
			pc.removeSkillPackageOverride(package_plant);

			if (ret['ok']){

				//log.info("MG plant got drop is "+ret["got_drop"]);
				
			
				energy += intval(ret.values['energy_cost']);
			    mood += intval(ret.values['mood_bonus']);
				xp += intval(ret.values['xp_bonus']);
			
				var seed = this.useSeed(pc, args.seed);

				this.data.plots[p].state = 'seeds';
				this.data.plots[p].growth = 0;
				this.data.plots[p].seed = args.seed;

				var plot_grow_modifier = 1;
				if (this.getInstanceProp('garden_type') == 'herb'){
					if (pc.imagination_has_upgrade('herbalism_time_2')){
						plot_grow_modifier -= plot_grow_modifier*0.2;
					}
					else if (pc.imagination_has_upgrade('herbalism_time_1')){
						plot_grow_modifier -= plot_grow_modifier*0.1;
					}
				}else{
					if (pc.imagination_has_upgrade('croppery_time_2')){
						plot_grow_modifier -= plot_grow_modifier*0.2;
					}
					else if (pc.imagination_has_upgrade('croppery_time_1')){
						plot_grow_modifier -= plot_grow_modifier*0.1;
					}
				}

				this.data.plots[p].grow_modifier = plot_grow_modifier;

				if (this.data.plots[p].wet){
					this.data.plots[p].start_grow = time();
					this.pushEvent(p, floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * plot_grow_modifier), 'grow1');
				}
				if (this.isPublic()) this.data.plots[p].planter = pc.tsid;
			
				if (this.getInstanceProp('garden_type') == 'herb'){
					pc.achievements_increment('garden_herb_plots_planted', achievement_key);
					pc.quests_inc_counter('herb_seeds_planted', 1);

					if (pc.quests_get_counter('herbalism_harvest_shuck_and_plant_herbs', 'seeds_extracted') >= 6){
						pc.quests_inc_counter('herb_seeds_planted_shucks', 1);
					}
					
					if (!this.container.pols_is_pol() || !this.container.pols_is_owner(pc)) {
						pc.quests_inc_counter('herb_seeds_planted_for_others', 1);
					}
				}
				else{
					pc.achievements_increment('garden_plots_planted', achievement_key);
				}

				var seed_class = apiFindItemPrototype(args.seed);
				count ++;
			}
			else{
				//log.info('planting failed');
				pc.announce_sound('CLICK_FAILURE');
				this.clearFlags();
				return {
					'ok' : 0,
					'error' : "Oops. Somehow you wound up getting most of the seeds on or in your shoes. Try again?",
				};
			}
		}
		
		if (count) { 
			announce = {
						'type'		: 'plant',
						'seed'		: seed_class.name_plural,
						'energy'	: energy,
						'mood'		: mood,
						'xp'		: xp,
						'msg'		: "You planted a garden."
					};
		}
		else { 
			this.clearFlags();
			return {
					'ok' : 0,
				};
		}
		
				
		//var overlay_item_class = "potion_garden_plant";
	}
	

	if (args.action == 'pick'){

		//if (talkback_key) talkback_key += 'pick';
	
		var energy = 0;
		var mood = 0;
		var xp = 0;
		
		var results = {};
		
		this.harvest_in_progress = true;
		
		var delay = 300;
		var count = 0;
		plots = this.data.plots;
		for (var p in plots) {
		
			if (plots[p].state != 'crop' || !plots[p].seed) { continue; }
		
			var seed = null;
			try {
				seed = apiFindItemPrototype(plots[p].seed);
			} catch(e){
			}

			if (seed){
				//if (talkback_key) talkback_key += 'harvest';

				var details = pc.getSkillPackageDetails(package_harvest);
				if (!details) { 
					log.error("MG harvest package should be "+package_harvest);
				}
				
				if (pc.metabolics_get_energy() <= details.energy_cost){
					pc.announce_sound('CLICK_FAILURE');
					pc.sendActivity("You're too tired to do that.");
					var result = {ok:0};
					break;
				}

				pc.addSkillPackageOverride(package_harvest, {drop_chance: 0.0});
				
				var ret = pc.runSkillPackage(package_harvest, this, {msg: args.msg, no_timers: true});
				
				pc.removeSkillPackageOverride(package_harvest);
				
				if (ret['ok']){
				
					//log.info("MG harvest got drop is "+ret["got_drop"]);
				
				
					//log.info('MG -- ret: '+ret);
					var bonus_items = 0;
					
					energy += intval(ret.values['energy_cost']);
					mood += intval(ret.values['mood_bonus']);
					xp += intval(ret.values['xp_bonus']);

					this.apiSetTimerMulti("plotSetState", delay, p, "dirty");
					delay += 300;
					//plots[p].state = 'dirty';
				
					var fruit = apiFindItemPrototype(seed.classProps.produces_class);
					var num = intval(seed.classProps.produces_count);
					
					// Players without croppery receive half the normal harvest if harvesting crops.
					if(package_harvest == 'croppery_harvest' && !pc.skills_has('croppery_1')) {
						num = Math.round(num / 2);
					}
					// Players without herbalism receive half the normal harvest if harvesting herbs.
					else if (package_harvest == 'herbalism_harvest' && !pc.skills_has('herbalism_1')) { 
						num = Math.round(num/2);
					}
							
					if (!results[seed.classProps.produces_class]) { 
						results[seed.classProps.produces_class] = {};
					}
					
					if (!results[seed.classProps.produces_class].num) { 
						results[seed.classProps.produces_class].num = 0;
					}
							
					if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck')) && !ret.details['got_drop']){
						//log.info('IMG garden harvest -- '+pc+' -- bonus_chance: '+ret.details['bonus_chance']);
						//var harvest_effects = [];
						var proto = apiFindItemPrototype(seed.classProps.produces_class);
						bonus_items = num * (ret.details['bonus_multiplier'] - 1);

						/*harvest_effects.push({
							"type"	: "item_give",
							"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
							"value"	: bonus_items
						});

						var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, []);

						pc.createItemFromOffset(seed.classProps.produces_class, bonus_items, {x: 20 * counter, y:(-75*counter)}, false, pc, null);
						pc.sendActivity(harvest_msg);
						//pc.createItemFromOffsetDelayed(seed.classProps.produces_class, bonus_items, {x: 0, y:(-75*counter)}, false, 4000, harvest_msg, pc);
						pc.show_rainbow('rainbow_superharvest', 1000);
						
						log.info("MG superharvest for plot "+p+" counter is "+counter);
						*/
						if (config.is_dev) { 
							pc.sendActivity("Plot "+p+" Super Harvest! +"+bonus_items+" "+proto.name_single);
						}
						
						results[seed.classProps.produces_class].num += bonus_items;
						results[seed.classProps.produces_class].name_single = proto.name_single;
						results[seed.classProps.produces_class].name_plural = proto.name_plural;
						
						if (package_harvest == 'herbalism_harvest') { 
							pc.quests_inc_counter('super_harvest_herb', 1);
						}
					}

					/*var remaining = pc.createItemFromSource(seed.classProps.produces_class, num, this);
					if (remaining){
						pc.location.createItemStack(seed.classProps.produces_class, remaining, pc.x, pc.y);
					}*/
				
					if (seed.classProps.produces_class == 'onion'){
						pc.quests_inc_counter('onions_harvested', num + bonus_items);
					}
					
					if (config.is_dev) { 
							pc.sendActivity("Plot "+p+" harvest +"+num+" "+fruit.name_single);
						}
					
					results[seed.classProps.produces_class].num += num;
					results[seed.classProps.produces_class].name_single = fruit.name_single;
					results[seed.classProps.produces_class].name_plural = fruit.name_plural;
					
					pc.quests_inc_counter('garden_harvest_'+seed.classProps.produces_class, num);
					pc.achievements_increment('garden_plots_picked', achievement_key);
					
					if (package_harvest == 'herbalism_harvest') { 
						pc.quests_inc_counter('harvest_herb', 1);

						if (pc.quests_get_counter('herbalism_harvest_shuck_and_plant_herbs', 'seeds_extracted') >= 6 &&
							pc.quests_get_counter('herbalism_harvest_shuck_and_plant_herbs', 'herb_seeds_planted_shucks') >= 6){

							pc.quests_inc_counter('harvest_herb_shucks', 1);
							
						}
					}

					// Talkbacks
					/*if (talkback_key){
						if (ret.details['got_drop'] && this.getInstanceProp('garden_type') != 'herb'){
							talkback_key += '_drop';
						}else if (this.getInstanceProp('garden_type') == 'herb'){
							if (pc.imagination_has_upgrade('herbalism_super_harvest_2')){
								talkback_key += '_3x';
							}
							else if (pc.imagination_has_upgrade('herbalism_super_harvest_1')){
								talkback_key += '_2x';
							}
						}else{
							if (pc.imagination_has_upgrade('croppery_super_harvest_2')){
								talkback_key += '_4x';
							}
							else if (pc.imagination_has_upgrade('croppery_super_harvest_1')){
								talkback_key += '_3x';
							}else if (pc.skills_has('croppery_3')){
								talkback_key += '_2x';
							}
						}
					}*/

					this.container.cultivation_add_img_rewards(pc, 5.0);
					this.addWear();
					count ++;
				}
				else{
					//log.info('harvesting failed');
					pc.announce_sound('CLICK_FAILURE');
					//if (talkback_key) this.sendResponse(talkback_key+'_na_failed', pc, ret.slugs);
					this.clearFlags();
					return {'ok': 0 };
				}
			}
			else{
				//log.info('no seed!');
				this.clearFlags();
				return {
					'ok' : 0,
					'error' : "Oops. There is nothing there to pick.",
				};
			}
		}
		
		if (count) { 
			//log.info("MG setting onFinishPick timer for "+pc);
			this.apiSetTimer("onFinishPick", delay, pc, results, energy, mood, xp);
		}
		else { 
			this.clearFlags();
			return {'ok':0};
		}
		
		//var overlay_item_class = "potion_garden_harvest";
	}
	

	if (args.action == 'fertilize') {
	//&& this.data.plots[args.plot].seed && !this.data.plots[args.plot].fertilized){
	
		this.fertilize_in_progress = true;
	
		var energy = 0;
		var mood = 0;
		var xp = 0;
		
		var count = 0;
		plots = this.data.plots;
		for (var p in plots) {
	
			if (!plots[p].seed || plots[p].fertilized) { continue; }
		
			var seed = null;
			try {
				seed = apiFindItemPrototype(plots[p].seed);
			} catch(e){
			}

			if (seed){
				talkback_key = null;
				
				pc.addSkillPackageOverride(package_fertilize, {drop_chance: 0.0});
				
				var ret = pc.runSkillPackage(package_fertilize, this, {msg: args.msg, no_timers: true});
				
				pc.removeSkillPackageOverride(package_fertilize);
				
				if (ret['ok']){
				
					//log.info("MG fertilize got drop is "+ret["got_drop"]);
				
					energy += intval(ret.values['energy_cost']);
					mood += intval(ret.values['mood_bonus']);
					xp += intval(ret.values['xp_bonus']);
					
					if (plots[p].state == 'seeds'){
						this.removeEvent(p, 'grow1');
						//log.info("MG - calling stateChanged on plot "+p+" for grow1");
						this.stateChanged(p, 'grow1');

						plots[p].grow_time_skipped = intval(floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * 60 * 60 * plots[p].grow_modifier) - (time() - plots[p].start_grow));
					}
					else if (plots[p].state == 'shoots'){
						this.removeEvent(p, 'grow2');

						var elapsed = floatval(time() - plots[p].grow2_start) / (60.0 * 60.0);
						this.pushEvent(p, 0.1 * ((floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * plots[p].grow_modifier)) - elapsed), 'grow2');
						plots[p].fertilized = true;

						if (!plots[p].grow_time_skipped) plots[p].grow_time_skipped = 0;
						plots[p].grow_time_skipped += (0.9 * ((floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * plots[p].grow_modifier)) - elapsed) * 60 * 60);
					}
				
					pc.achievements_increment('garden_plots_fertilized', achievement_key);
					count ++;
				}
				else{
					//log.info('fertilizing failed');
					pc.announce_sound('CLICK_FAILURE');
					this.clearFlags();
					return {
						'ok' : 0,
						'error' : "Oops. Somehow you failed at fertilizing that. Try again?",
					};
				}
			}
		}
		
		if (count) {
			announce = {
				'type'		: 'fertilize',
				'energy'	: energy,
				'mood'		: mood,
				'xp'		: xp,
				'msg'		: 'You fertilized a garden.'
			};
		} 
		else { 
			this.clearFlags();
			return {'ok':0};
		}
			
		//var overlay_item_class = "potion_garden_fertilize";
	}
	
	//
	// Do drops
	//
	if (args.action == "water" || args.action == "plant" || args.action == "hoe") {
		if (pc.buffs_has("max_luck")) {
			var chance = 1.0;
			//log.info("MG doing drop with max luck");
		}
		else { 
			if (this.data.plots.__length == 4) { 
				var chance = .18;
			}
			else if (this.data.plots.__length == 8) { 
				var chance = .36;
			}
			else if (this.data.plots.__length >= 15 ) {  
				var chance = .67;
			}
			
			if (pc.buffs_has("rubeweed")) {
				chance *= 1.25;
			}
		}
		
			
		if (config.is_dev) { pc.sendActivity("Drop chance is "+chance); }
		
		//log.info("MG chance is "+chance+" and num plots is "+this.data.plots.__length);
		
		if (this.getInstanceProp('garden_type') == "herb") {	
			if (is_chance(chance)) {
				var got_drop = true;
				announce["drop_chance"] = chance;
				//log.info("MG got drop "+announce);
				
				if (args.action == "water") {
					//var items = pc.runDropTable("herbalism_master_gardener__water", this);
					announce.dropTable = "herbalism_master_gardener__water";
				}
				else {
					//var items = pc.runDropTable('herbalism_mastergardener', this);
					announce.dropTable = "herbalism_mastergardener";
				}
				//log.info("MG got a drop "+items);
			}
		}
		else { 
			if (is_chance(chance)) {
				var got_drop = true;
				announce["drop_chance"] = chance;
				//log.info("MG got drop "+announce);
		
				if (args.action == "water") { 
					//var items = pc.runDropTable("croppery_master_gardener__water", this);
					announce.dropTable = "croppery_master_gardener__water";
				}
				else {
					//var items = pc.runDropTable('croppery_mastergardener', this);
					announce.dropTable = "croppery_mastergardener";
				}
				//log.info("MG got a drop "+items);
			}
		}
		
		//log.info("MG drop is "+got_drop+" and talkback_key is "+talkback_key);
		
		/*if (got_drop && talkback_key) { 
			talkback_key += '_drop_large';
		}
		else { 
			talkback_key = null;
		}*/
	}
	
	//
	// Do overlays
	//
	
	if (overlay_item_class){
		/*var duration =  2000;
		
			var annc = {
				type: 'itemstack_overlay',
				duration: duration,
				locking: true,
				itemstack_tsid: this.tsid,
				delta_x: delta_x,
				delta_y: 0,
				state: state,
				item_class: overlay_item_class,
				//plot_id: p
			};
		
		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);
		*/
		
		var anncx = {
			type: 'pc_overlay',
			duration: duration,
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			state: state,
			item_class: overlay_item_class
		};

		pc.location.apiSendAnnouncementX(anncx, pc);
		
		//log.info(" MG duration is "+duration+" and talkback key is "+talkback_key);
		
		/*if (talkback_key){
			this.apiSetTimerX('sendResponse', duration, talkback_key, pc, ret.slugs);
		}
		}else{
			if (talkback_key){
			this.sendResponse(talkback_key, pc, ret.slugs);
			}
		} */
	}

	//
	// return plot data
	//

	//this.broadcastConfig();
	
	//log.info("MG setting doFinishGardenAction timer for "+pc);
	this.apiSetTimerMulti("doFinishGardenAction", 2000, pc, announce);
	
	if (!result) { 
		var result =  {
			'ok'	: 1,
			'next_event' : this.getNextEvent(),
			'announce' : {},
		};
	}
	
	if (args.action != "pick") { 
		this.clearFlags();
	}
	// harvest is done in onFinishPick
	
	//log.info(" MG cleared all flags "+this.plant_in_progress);
	
	return result;
}

function clearFlags() {
	//log.info("MG clearing flags");

	this.plant_in_progress = false;
	this.water_in_progress = false;
	this.clear_in_progress = false;
	this.fertilize_in_progress = false;
	this.harvest_in_progress = false;
}

// Set the state of a plot. Exists so we can do nifty things with timers.
function plotSetState(p, state) {
	//log.info("MG Setting state for "+p);
	
	var plots = this.data.plots;
	plots[p].state = state;
	
	if (state === "dirty") {
		delete plots[p].growth;
		delete plots[p].seed;
		delete plots[p].start_grow;
		delete plots[p].grow2_start;
		delete plots[p].grow_time_skipped;
		delete plots[p].planter;
		delete plots[p].crop_time;
		plots[p].fertilized = false;
	}
	
	this.broadcastConfig();
}


// Helper function for createItemForPlayer
function findItemInSlot(class_tsid, slot, bag){
	var items = bag.getContents();
	
	var it = items[slot];
	
	if (it) { 
		if (it.class_tsid == class_tsid) { 
			return it;
		}
		else if (it.is_bag && !it.isHidden) { 
			return it.findFirst(class_tsid);
		}
		else { 
			log.error("MG Harvest potion something is wrong!");
		}
	}
}

// Helper function
function findSlotForClass(class_tsid, bag) {
	var items = bag.getContents();
	
	for (var i in items) { 
		var it = items[i];
		if (it && it.class_tsid == class_tsid) { 
			return i;
		}
		else if (it && it.is_bag && !it.isHidden) { 
			if (it.findFirst(class_tsid)) { 
				return i;
			}
		}
	}
}
	

// Custom item creation code so it's prettier (only one icon and 1 number instead of lots)
function createItemForPlayer(pc, class_id, num, x, y){
	//var slot = pc.firstEmptySlot();
	//if (slot == null) slot = pc.canFitWhere(class_id);
	
	var s = apiNewItemStack(class_id, num);
	if (!s) return num;
	
	var size = s.count;
	var remaining = pc.addItemStack(s);
	
	if (remaining){
		if (remaining === size) { 
			s.apiDelete();
		}
	
		//log.info("MG tried to make "+num+" "+class_id+", "+remaining+" to make in location");
		var remaining_two = pc.location.createItem(class_id, remaining, pc.x, pc.y-29, 100, pc);
	}
	
	if (size < num){
		remaining_two += this.createItemHelper(pc, class_id, num-size);
	}
	
	
	var slot = this.findSlotForClass(class_id, pc);
	var item = this.findItemInSlot(class_id, slot, pc);
	
	if (item) {
		//log.info("MG slot is "+slot+" and item is "+item+" and remaining is "+remaining);
	
		pc.apiSendAnnouncement({ 
			type: "floor_to_pack",
			orig_x: x,
			orig_y: y,
			dest_path: item.path,
			dest_slot: slot,
			count: num,
			item_class: class_id
		});
	}
	else { 
		log.error("MG no item found for slot "+slot+" class is "+class_id);
	}
	
	return remaining_two;
}

// Helper function - exists because we need to know whether items were dropped on the ground.
function createItemHelper(pc, class_id, num){
	//log.info("MG createItemHelper got "+num);
	

	var s = apiNewItemStack(class_id, num);
	if (!s) return num;
	
	//log.info("MG createItemHelper made "+s.count);
	
	var size = s.count;
	var remaining = pc.addItemStack(s);
	
	if (remaining){
		if (remaining === size) { 
			s.apiDelete();
		}
	
	//	log.info("MG createItemHelper putting "+remaining+" on ground");
		var remaining_two = pc.location.createItem(class_id, remaining, pc.x, pc.y-29, 100, pc);
	}
	
	if (size < num){
		//log.info("MG createItemHelper made "+size+" and remaining is "+remaining);
		remaining_two += this.createItemHelper(pc, class_id, num-size);
	}
	
	//log.info("MG createItemHelper returning "+remaining_two);
	return remaining_two;
}


// Do the stuff at the end of harvesting, after all the plots have changed state.
function onFinishPick(pc, results, energy, mood, xp) {
	var announcement_msg = "You picked ";
	
	var x = this.x;
	var y = this.y; 
	
	var num_results = results.__length;
	var count = 0;
	for (var i in results) { 
		if (announcement_msg != "You picked ") { 
		
			if (num_results - count > 1) {
				announcement_msg += ", ";
			}
			else {
				announcement_msg += " and ";
				}
		}
		
		// If more than 7 items, then use a second row.
		// (There are only 13 crops, so there will never be more than 2 rows)
		if (!(count % 7)) { 
			y -= 80;
		}
		
		//log.info("MG calling createItem for "+i+" "+x+" "+y);
		var remaining = this.createItemForPlayer(pc, i, results[i].num, x, y);
		
		if (remaining > 0) { 
			var on_ground = true;
		}
		
		if (results[i].num > 1) { 
			announcement_msg += results[i].num+" "+results[i].name_plural;
		}
		else {
			announcement_msg += "a "+results[i].name_single;
		}
		
		count ++;
	}
	
	if (this.container && this.isDepleted() && !this.countEmptyPlots()){
		this.replaceWithDepleted();
	}
	
	announcement_msg += ".";
	

	if (on_ground) { 
		announcement_msg += " Your pack was full, so some of the produce ended up on the ground.";
	}
	
	var announce = {
			'type'		: 'harvest',
			'energy'	: energy,
			'mood'		: mood,
			'xp'		: xp,
			'msg'		: announcement_msg
		};
	
	//log.info("MG harvest calling doFinishGardenAction");
	this.doFinishGardenAction(pc, announce);
	
	this.clearFlags();
}

// Display messages. Normally done by the potion, but in the case of harvests which are delayed, 
// we need to do it separately.
function doFinishGardenAction(pc, announce) {
	//log.info("MG garden finishing action for pc "+pc+" with announce "+announce);

	if (announce){
		var energy = intval(announce.energy);
		var mood = intval(announce.mood);
		var xp = intval(announce.xp);
				
		if (announce.msg){
			var growl = announce.msg;
					
			if (energy || mood || xp){
				growl += ' (';
				if (energy){
					growl += energy+' energy';
							
					if (mood || xp) growl += ', ';
				}
							
				if (mood){
					growl += '+'+mood+' mood';
								
					if (xp) growl += ', ';
				}
							
				if (xp) growl += '+'+xp+' iMG';
							
				growl += ')';
			}

			pc.sendActivity(growl);
			
			if (announce.drop_chance) { 
				//log.info("MG running drop table "+announce.dropTable);
				pc.runDropTable(announce.dropTable, this);
			}
			else { 
				//log.info("MG no drop chance ");
			}
		}
	}
}

// Approx same conditions as the client uses to determine if watering is allowed
function doesPlotNeedWater(plot) {
	var config_threshold = config.garden_water_threshold;
	var water_time = this.timings.water*60*60;
	//log.info("MG "+water_time+" "+config_threshold);
	var threshold_water_time = water_time - config_threshold;
	var plot_water_time = this.getPlotStatus(plot).water_time;

	//log.info("MG "+plot_water_time+" "+threshold_water_time);
	
	if ( plot_water_time < threshold_water_time ) return true;

	return false;
}
