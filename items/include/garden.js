
// these timings are in hours
var timings = {
	water : 12,
	grow1 : 1/60, // 1 min
	grow2 : 1/60 // 1 min
};

function initGarden(){
	this.is_garden = true;

	if (!this.data) this.data = {};
	
	var width = intval(this.getInstanceProp('width'));
	if (!width) width = 4;
	var height = intval(this.getInstanceProp('height'));
	if (!height) height = 4;

	if (!this.data.plots) this.data.plots = {};
	if (!this.data.width) this.data.width = width;
	if (!this.data.height) this.data.height = height;

	if (!this.events) this.events = {};
}

function resetGarden(){
	delete this.data;
	delete this.events;
	this.apiCancelTimer('stateChange');

	this.initGarden();
	this.broadcastConfig();
}

function adminTendGarden(args){

	var pc = this.checkPlayerGarden(args);

	if (!pc){
		return {
			'ok'	: 0,
			'error'	: "Can't find player",
			'no_garden' : 1
		};
	}


	//
	// check the plot exists!
	//

	var pos = args.plot.split('-');
	var ok = 1;
	if (pos[0] < 1 | pos > this.data.width) ok = 0;
	if (pos[1] < 1 | pos > this.data.height) ok = 0;

	if (!ok){
		return {
			'ok' : 0,
			'error' : "Plot out of bounds"
		};
	}

	if (!this.data.plots[args.plot].grow_modifier) this.data.plots[args.plot].grow_modifier = 1;
	
	
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
			var package_water = 'herbalism_water';
			var package_plant = 'herbalism_plant';
			var package_harvest = 'herbalism_harvest';
			var package_clear = 'herbalism_clear';
			var package_fertilize = 'herbalism_fertilize';
			if (pc.skills_has('herbalism_1') || (args.action != 'water' && args.action != 'plant' && args.action != 'clear')){
				talkback_key = 'herb_';
			}
			break;
		case 'default':
		default:
			var package_water = 'croppery_water';
			var package_plant = 'croppery_plant';
			var package_harvest = 'croppery_harvest';
			var package_clear = 'croppery_clear';
			var package_fertilize = 'croppery_fertilize';
			if (pc.skills_has('croppery_1') || (args.action != 'water' && args.action != 'plant' && args.action != 'clear')){
				talkback_key = 'crop_';
			}
			break;
	}
	
	
	//
	// perform the action?
	//

	var announce = {};

	this.initPlot(args.plot);

	var achievement_key = this.tsid;
	if (args.action == 'water'){
		
		function is_watering_can(it){ return it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);
		if (!watering_can){
			function is_watering_can(it){ return it.class_tsid == 'watering_can' && it.isWorking() ? true : false; }
			watering_can = pc.findFirst(is_watering_can);
		}

		if (watering_can){
			if (talkback_key) talkback_key += 'water';

			var details = pc.getSkillPackageDetails(package_water);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				return {ok: 0};
			}

			var ret = pc.runSkillPackage(package_water, this, {tool_item: watering_can, msg: args.msg, no_timers: true});
			if (ret['ok']){
			
				//log.info('watering...');
				if (!this.data.plots[args.plot].wet){
					//log.info('--we were previously dry');
					// we were previously dry.
					// if we were growing, restart the grow timer 
					if (this.data.plots[args.plot].state == 'seeds'){
						//log.info('--restarting grow1');
						var seed = apiFindItemPrototype(this.data.plots[args.plot].seed);
						this.data.plots[args.plot].start_grow = time();
						this.pushEvent(args.plot, seed.classProps.time_grow1 * config.garden_grow_multiplier * this.data.plots[args.plot].grow_modifier - this.data.plots[args.plot].growth, 'grow1');
					}
					if (this.data.plots[args.plot].state == 'shoots'){
						//log.info('--restarting grow2');
						var seed = apiFindItemPrototype(this.data.plots[args.plot].seed);
						this.data.plots[args.plot].start_grow = time();
						this.pushEvent(args.plot, (floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * this.data.plots[args.plot].grow_modifier) + floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * this.data.plots[args.plot].grow_modifier)) - this.data.plots[args.plot].growth, 'grow2');
					}
				
					pc.achievements_increment('garden_plots_watered', achievement_key);
				}

				announce = {
					'type'		: 'water',
					'energy'	: intval(ret.values['energy_cost']),
					'mood'		: intval(ret.values['mood_bonus']),
					'xp'		: intval(ret.values['xp_bonus']),
					'msg'		: "You watered a plot."
				};

				this.data.plots[args.plot].wet = true;
				this.clearEvents(args.plot, 'dry');
				this.data.plots[args.plot].start_water = time();
				this.pushEvent(args.plot, timings.water, 'dry');
				
				var overlay_item_class = watering_can.class_tsid;
				
				if (pc.imagination_has_upgrade("croppery_herbalism_watering_time")) {
					pc.announce_sound('WATERING_CAN', 1);
				}
				else { 
					pc.announce_sound('WATERING_CAN', 2);
				}
				
				// Talkbacks
				if (ret.details['got_drop']){
					if (talkback_key == 'herb_water'){
						talkback_key += '_drop';
					}
					else{
						if (talkback_key && pc.imagination_has_upgrade('croppery_growing_drop_1')){
							talkback_key += '_drop_small';
						}
						else if (talkback_key && pc.imagination_has_upgrade('croppery_growing_drop_2')){
							talkback_key += '_drop_large';
						}
					}
				}
			}
			else{
				//log.info('watering failed');
				//log.info(ret);
				
				// If you fail to water:
				// take the two energy it normally costs to water, take 3 mood as a penalty. And say "Oops. Somehow you failed at watering that. Try again?"
				if (ret.details && ret.details.energy_cost){
					var energy = pc.metabolics_lose_energy(ret.details.energy_cost);
				}
				else{
					var energy = pc.metabolics_lose_energy(2);
				}
				var mood = pc.metabolics_lose_mood(3);

				if (ret.error_tool_broken){
					this.sendResponse('broken_watering_can', pc, ret.slugs);
					return {'ok':0};
				} else {
					pc.announce_sound('CLICK_FAILURE');
					if (talkback_key) this.sendResponse(talkback_key+'_na_failed', pc, ret.slugs);
					return {'ok':0};
				}
			}
		}else{
			//log.info('no watering can');
			this.sendResponse('broken_watering_can', pc, null);
			return {'ok':0};
		}
	}

	if (args.action == 'hoe' && this.data.plots[args.plot].state == 'dirty'){
		function is_hoe(it){ return it.class_tsid =='high_class_hoe' && it.isWorking() ? true : false; }
		var hoe = pc.findFirst(is_hoe);
		if (!hoe){
			function is_hoe(it){ return it.class_tsid == 'hoe' && it.isWorking() ? true : false; }
			hoe = pc.findFirst(is_hoe);
		}

		if (hoe){
			if (talkback_key) talkback_key += 'clear';
			var tool_wear_multiplier = 1;
			if (pc.imagination_has_upgrade('hoeing_more_img_more_wear') && !pc.aggressive_off){
				var xp_bonus = 3;
				tool_wear_multiplier = 1.5;
				if (pc.skills_has('croppery_3')){
					xp_bonus = 8;
					tool_wear_multiplier = 5;
				}else if (pc.skills_has('croppery_2')){
					xp_bonus = 6;
					tool_wear_multiplier = 4;
				}else if (pc.skills_has('croppery_1')){
					xp_bonus = 4;
					tool_wear_multiplier = 3;
				}
				pc.addSkillPackageOverride(package_clear, {'xp_bonus': xp_bonus});
				
			}
			
			var details = pc.getSkillPackageDetails(package_clear);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				return {ok: 0};
			}

			var ret = pc.runSkillPackage(package_clear, this, {tool_item: hoe, tool_wear_multiplier: tool_wear_multiplier, msg: args.msg, no_timers: true});
			if (ret['ok']){
				this.data.plots[args.plot].state = 'clean';
			
				pc.achievements_increment('garden_plots_hoed', achievement_key);

				announce = {
					'type'		: 'clean',
					'energy'	: intval(ret.values['energy_cost']),
					'mood'		: intval(ret.values['mood_bonus']),
					'xp'		: intval(ret.values['xp_bonus']),
					'msg'		: 'You cleaned a plot.',
				};
				
				var overlay_item_class = hoe.class_tsid;
				
				if (pc.imagination_has_upgrade("croppery_herbalism_clearing_time")){
					pc.announce_sound("HOE", 1);
				}
				else{
					pc.announce_sound('HOE', 2);
				}

				// Talkbacks
				if (ret.details['got_drop']){
					if (talkback_key == 'herb_clear'){
						talkback_key += '_drop';
					}
					else{
						if (talkback_key && pc.imagination_has_upgrade('croppery_growing_drop_1')){
							talkback_key += '_drop_small';
						}
						else if (talkback_key && pc.imagination_has_upgrade('croppery_growing_drop_2')){
							talkback_key += '_drop_large';
						}
					}
				}
			}
			else{
				//log.info('clearing failed');
				
				var msg = "Oops. You mostly just pushed the bracken around a bit. Try again?";
				if (ret.error_tool_broken){
					this.sendResponse('broken_hoe', pc, ret.slugs);
					return {'ok':0};
				}else {
					pc.announce_sound('CLICK_FAILURE');
				}
				
				return {
					'ok' : 0,
					'error' : msg,
				};
			}

			pc.removeSkillPackageOverride(package_clear);

		}else{
			//log.info('no hoe');
			this.sendResponse('broken_hoe', pc, null);
			return {'ok':0};
		}
	}
	else if (args.action == 'hoe'){
		//log.info('not dirty!');
		return {
			'ok' : 0,
			'error' : "Oops. Don't need no hoeing.",
		};
	}

	if (args.action == 'plant' && this.data.plots[args.plot].state == 'clean'){

		// check that we have the specified seed
		if (pc.items_has(args.seed, 1)){
			if (talkback_key) talkback_key += 'plant';

			var details = pc.getSkillPackageDetails(package_plant);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				return {ok: 0};
			}

			var ret = pc.runSkillPackage(package_plant, this, {msg: args.msg, no_timers: true});
			if (ret['ok']){

				var seed = this.useSeed(pc, args.seed);

				this.data.plots[args.plot].state = 'seeds';
				this.data.plots[args.plot].growth = 0;
				this.data.plots[args.plot].seed = args.seed;

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

				this.data.plots[args.plot].grow_modifier = plot_grow_modifier;

				if (this.data.plots[args.plot].wet){
					this.data.plots[args.plot].start_grow = time();
					this.pushEvent(args.plot, floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * plot_grow_modifier), 'grow1');
				}
				if (this.isPublic()) this.data.plots[args.plot].planter = pc.tsid;
			
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

				announce = {
					'type'		: 'plant',
					'seed'		: seed_class.name_plural,
					'energy'	: intval(ret.values['energy_cost']),
					'mood'		: intval(ret.values['mood_bonus']),
					'xp'		: intval(ret.values['xp_bonus']),
					'msg'		: "You planted some "+seed_class.name_plural+"."
				};


				// Talkbacks
				if (talkback_key && ret.details['got_drop']){
					if (talkback_key == 'crop_plant'){
						talkback_key += '_drop_small';
					}
					else{
						talkback_key += '_drop';
					}
				}
			}
			else{
				//log.info('planting failed');
				pc.announce_sound('CLICK_FAILURE');
				return {
					'ok' : 0,
					'error' : "Oops. Somehow you wound up getting most of the seeds on or in your shoes. Try again?",
				};
			}
		}
		else{
			//log.info('no seed!');
			return {
				'ok' : 0,
				'error' : "Oops. You don't have that seed!",
			};
		}
	}
	else if (args.action == 'plant'){
		//log.info('not clean!');
		return {
			'ok' : 0,
			'error' : "Oops. You need to clean that plot first.",
		};
	}

	if (args.action == 'pick' && this.data.plots[args.plot].state == 'crop' && this.data.plots[args.plot].seed){

		var seed = null;
		try {
			seed = apiFindItemPrototype(this.data.plots[args.plot].seed);
		} catch(e){
		}

		if (seed){
			if (talkback_key) talkback_key += 'harvest';

			var details = pc.getSkillPackageDetails(package_harvest);
			if (pc.metabolics_get_energy() <= details.energy_cost){
				pc.announce_sound('CLICK_FAILURE');
				pc.sendActivity("You're too tired to do that.");
				return {ok: 0};
			}

			var ret = pc.runSkillPackage(package_harvest, this, {msg: args.msg, no_timers: true});
			if (ret['ok']){
				log.info('IMG -- ret: '+ret);
				var bonus_items = 0;

				this.data.plots[args.plot].state = 'dirty';
			
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
								
				if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck')) && !ret.details['got_drop']){
					log.info('IMG garden harvest -- '+pc+' -- bonus_chance: '+ret.details['bonus_chance']);
					var harvest_effects = [];
					var proto = apiFindItemPrototype(seed.classProps.produces_class);
					bonus_items = num * (ret.details['bonus_multiplier'] - 1);

					harvest_effects.push({
						"type"	: "item_give",
						"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
						"value"	: bonus_items
					});

					var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, []);

					pc.createItemFromOffsetDelayed(seed.classProps.produces_class, bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
					pc.show_rainbow('rainbow_superharvest', 1000);
					
					if (package_harvest == 'herbalism_harvest') { 
						pc.quests_inc_counter('super_harvest_herb', 1);
					}
				}

				var remaining = pc.createItemFromSource(seed.classProps.produces_class, num, this);
				if (remaining){
					pc.location.createItemStack(seed.classProps.produces_class, remaining, pc.x, pc.y);
				}
			
				if (seed.classProps.produces_class == 'onion'){
					pc.quests_inc_counter('onions_harvested', num + bonus_items);
				}

				if (num > 1){
					var annoucement_msg = 'You picked some '+fruit.name_plural+'.';					
				}else{
					var annoucement_msg = 'You picked '+fruit.article+' '+fruit.name_single+'.';					
				}
				
				announce = {
					'type'		: 'harvest',
					'crop'		: fruit.formatStack(num),
					'energy'	: intval(ret.values['energy_cost']),
					'mood'		: intval(ret.values['mood_bonus']),
					'xp'		: intval(ret.values['xp_bonus']),
					'msg'		: annoucement_msg
				};
		
				pc.quests_inc_counter('garden_harvest_'+seed.classProps.produces_class, num);
				pc.achievements_increment('garden_plots_picked', achievement_key);
				
				if (package_harvest == 'herbalism_harvest') { 
					pc.quests_inc_counter('harvest_herb', 1);

					if (pc.quests_get_counter('herbalism_harvest_shuck_and_plant_herbs', 'seeds_extracted') >= 6 &&
						pc.quests_get_counter('herbalism_harvest_shuck_and_plant_herbs', 'herb_seeds_planted_shucks') >= 6){

						pc.quests_inc_counter('harvest_herb_shucks', 1);
						
					}
				}

				delete this.data.plots[args.plot].growth;
				delete this.data.plots[args.plot].seed;
				delete this.data.plots[args.plot].start_grow;
				delete this.data.plots[args.plot].grow2_start;
				delete this.data.plots[args.plot].grow_time_skipped;
				delete this.data.plots[args.plot].planter;
				delete this.data.plots[args.plot].crop_time;
				this.data.plots[args.plot].fertilized = false;


				// Talkbacks
				if (talkback_key){
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
				}

				this.container.cultivation_add_img_rewards(pc, 5.0);
				this.addWear();

				if (this.container && this.isDepleted() && !this.countEmptyPlots()){
					this.replaceWithDepleted();
				}
			}
			else{
				//log.info('harvesting failed');
				pc.announce_sound('CLICK_FAILURE');
				if (talkback_key) this.sendResponse(talkback_key+'_na_failed', pc, ret.slugs);
				return {'ok':0};
			}
		}
		else{
			//log.info('no seed!');
			return {
				'ok' : 0,
				'error' : "Oops. There is nothing there to pick.",
			};
		}
	}
	else if (args.action == 'pick'){
		//log.info('not crop!');
		return {
			'ok' : 0,
			'error' : "Oops. There is nothing there to pick.",
		};
	}

	if (args.action == 'fertilize' && this.data.plots[args.plot].seed && !this.data.plots[args.plot].fertilized){
		var seed = null;
		try {
			seed = apiFindItemPrototype(this.data.plots[args.plot].seed);
		} catch(e){
		}

		if (seed){
			if (pc.items_has('guano', 1)){
				talkback_key = null;
				var ret = pc.runSkillPackage(package_fertilize, this, {msg: args.msg, no_timers: true});
				if (ret['ok']){

					pc.items_destroy('guano', 1);
				
					if (this.data.plots[args.plot].state == 'seeds'){
						this.removeEvent(args.plot, 'grow1');
						this.stateChanged(args.plot, 'grow1');

						this.data.plots[args.plot].grow_time_skipped = intval(floatval(seed.classProps.time_grow1 * config.garden_grow_multiplier * 60 * 60 * this.data.plots[args.plot].grow_modifier) - (time() - this.data.plots[args.plot].start_grow));
					}
					else if (this.data.plots[args.plot].state == 'shoots'){
						this.removeEvent(args.plot, 'grow2');

						var elapsed = floatval(time() - this.data.plots[args.plot].grow2_start) / (60.0 * 60.0);
						this.pushEvent(args.plot, 0.1 * ((floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * this.data.plots[args.plot].grow_modifier)) - elapsed), 'grow2');
						this.data.plots[args.plot].fertilized = true;

						if (!this.data.plots[args.plot].grow_time_skipped) this.data.plots[args.plot].grow_time_skipped = 0;
						this.data.plots[args.plot].grow_time_skipped += (0.9 * ((floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * this.data.plots[args.plot].grow_modifier)) - elapsed) * 60 * 60);
					}
				
					pc.achievements_increment('garden_plots_fertilized', achievement_key);

					announce = {
						'type'		: 'fertilize',
						'energy'	: intval(ret.values['energy_cost']),
						'mood'		: intval(ret.values['mood_bonus']),
						'xp'		: intval(ret.values['xp_bonus']),
						'msg'		: 'You fertilized a plot.'
					};
			
					var overlay_item_class = 'guano';
				}
				else{
					//log.info('harvesting failed');
					pc.announce_sound('CLICK_FAILURE');
				
					return {
						'ok' : 0,
						'error' : "Oops. Somehow you failed at fertilizing that. Try again?",
					};
				}
			}
			else{
				//log.info('no seed!');
				return {
					'ok' : 0,
					'error' : "Oops. You don't have any guano!",
				};
			}
		}
		else{
			//log.info('no seed!');
			return {
				'ok' : 0,
				'error' : "Oops. There is nothing there to fertilize.",
			};
		}
	}
	else if (args.action == 'fertilize'){
		//log.info('not crop!');
		return {
			'ok' : 0,
			'error' : "Oops. There is nothing there to fertilize.",
		};
	}
	
	
	//
	// Do overlays
	//
	
	if (overlay_item_class){
		var duration = (ret && ret.ok) ? ret.details.duration : 2000;
		var annc = {
			type: 'itemstack_overlay',
			duration: duration,
			locking: true,
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: -20,
			state: state,
			item_class: overlay_item_class,
			plot_id: args.plot_id
		};
	
		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);

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
		
		if (talkback_key){
			this.apiSetTimerX('sendResponse', duration, talkback_key, pc, ret.slugs);
		}
	}else{
		if (talkback_key){
			this.sendResponse(talkback_key, pc, ret.slugs);
		}
	} 


	//
	// return plot data
	//

	this.broadcastConfig();
	return {
		'ok'	: 1,
		'state'	: this.data.plots[args.plot].state,
		'wet'	: this.data.plots[args.plot].wet,
		'seed'	: this.data.plots[args.plot].seed,
		'seeds'	: this.getPlayerSeeds(pc),
		'next_event' : this.getNextEvent(),
		'announce' : announce,
	};
}

function initPlot(key){

	if (!this.data.plots[key]){
		this.data.plots[key] = {};
	}

	if (!this.data.plots[key].state){
		this.data.plots[key].state = 'clean';
	}

	if (!this.data.plots[key].growth){
		this.data.plots[key].growth = 0;
	}

	if (this.data.plots[key].wet == undefined){
		this.data.plots[key].wet = false;
	}
}

function getPlayerSeeds(pc){

	var seeds = {};
	var items = pc.apiGetAllItems();
	for (var i in items){
		if (items[i].is_seed){
			//log.info("---found "+items[i].count+" stack of "+items[i].class_tsid);
			seeds[items[i].class_tsid] = intval(seeds[items[i].class_tsid]) + items[i].count;
		}
	}

	var out = {};
	for (var i in seeds){

		var item = apiFindItemPrototype(i);

		out[i] = {
			num: seeds[i],
			name_plural: item.name_plural,
			name_single: item.name_single,
			swf: item.itemDef.asset_swf_v,
		};
	}

	return out;
}

function useSeed(pc, class_tsid){

	if (pc.items_destroy(class_tsid, 1)){

		return apiFindItemPrototype(class_tsid);
	}

	return null;
}

function checkPlayerGarden(args){
	this.initGarden();

	//
	// check how close the player is to the garden
	//

	var ok = 0;
	var pc = null;

	try {
		pc = apiFindObject(args.pc);
	}catch (e){
	}

	if (pc){
		if (this.container.tsid == pc.location.tsid){

			var dx = this.x - pc.x;
			var dy = this.y - pc.y;
			var d = Math.sqrt(dx*dx + dy*dy);

			//log.info('d = '+d);

			if (d < config.verb_radius){
				return pc;
			}
		}else{
			log.error('garden in a different location');
		}
	}else{
		log.info('no pc passed to adminGetGarden()');
	}

	return null;
}

function adminGetGarden(args){

	var pc = this.checkPlayerGarden(args);

	if (!pc){
		return {};
	}

	return {
		plots	: this.data.plots,
		width	: this.data.width,
		height	: this.data.height,
		has_water : (pc.items_has('watering_can', 1) || pc.items_has('irrigator_9000')) ? true : false,
		has_hoe : (pc.items_has('hoe', 1) || pc.items_has('high_class_hoe')) ? true : false,
		seeds	: this.getPlayerSeeds(pc),
		next_event : this.getNextEvent(),
	};
}

function getNextEvent(){

	var soonest = 0;
	var now = time();

	for (var i in this.events){

		var ts = intval(this.events[i].time) - now;
		if (ts < 0) ts = 0;
		if (soonest == 0 || soonest > ts) soonest = ts;
	}

	return soonest;
}


//
// this is the single timer function. when it fires
// we need to loop through queued events and see which 
// ones to fire. once we're done firing, set the timer
// again if any remain in the queue.
//

function stateChange(){

	var now = time();
	var next = 0;

	var run_now = {};

	for (var i in this.events){

		var ts = intval(this.events[i].time);

		if (ts <= now){
			run_now[i] = {
				plot: this.events[i].plot,
				event: this.events[i].event,
			};
			delete this.events[i];
		}else{
			if (next == 0){
				next = ts;
			}else{
				if (ts < next) next = ts;
			}
		}
	}

	this.apiCancelTimer('stateChange');

	if (next){
		var away = next - now;
		this.apiSetTimer('stateChange', away * 1000);
	}


	//
	// we need to run any 'now' events after we've set the next timer,
	// so that if these event cause any more events, they will be able
	// to correctly set the next timer running.
	//

	for (var i in run_now){
		this.stateChanged(run_now[i].plot, run_now[i].event);
	}
}


//
// add a plot event to the queue
// 'time_away' is in *hours*
//

function pushEvent(plot, time_away, event){

	//log.info("inserting event for "+time_away+" hours from now");

	if (time_away <= 0){
		this.stateChanged(plot, event);
		return;
	}

	var i = 1;
	while (this.events[str(i)]){
		i++;
	}

	this.events[str(i)] = {
		'time': time() + Math.round(floatval(time_away) * 60 * 60),
		'plot': plot,
		'event': event,
	};
	this.stateChange();
}


//
// remove a pending event from the queue
//

function removeEvent(plot, event){

	for (var i in this.events){

		if (this.events[i].plot == plot && this.events[i].event == event){

			delete this.events[i];
		}
	}

	this.stateChange();
}


//
// this gets called when an event fires
//

function stateChanged(plot, event){

	if (!this.data.plots[plot]) { if (config.is_dev) { log.info("MG Bad plot "+plot); } return; }

	//log.info('handling event!');
	if (!this.data.plots[plot].grow_modifier) this.data.plots[plot].grow_modifier = 1;
	
	if (event == 'dry'){
		//log.info('plot going dry');
		if (this.data.plots[plot].wet){
			//log.info('-- plot was wet');
			// we were growing while wet.
			// stop timers and save how much time has gone by

			if (this.data.plots[plot].state == 'seeds'){
				//log.info('-- we were in grow1 stage. pausing');
				var elapsed = floatval(time() - this.data.plots[plot].start_grow) / (60.0 * 60.0);
				this.data.plots[plot].growth += elapsed;
				this.removeEvent(plot, 'grow1');

				// set start_grow to 0 since we are pausing
				this.data.plots[plot].start_grow = 0;
		
				this.notifyOwner('One of your garden plots has gone dry.');
			}
			if (this.data.plots[plot].state == 'shoots'){
				//log.info('-- we were in grow2 stage. pausing');
				var elapsed = floatval(time() - this.data.plots[plot].start_grow) / (60.0 * 60.0);
				this.data.plots[plot].growth += elapsed;
				this.removeEvent(plot, 'grow2');
				
				// set start_grow to 0 since we are pausing
				this.data.plots[plot].start_grow = 0;
		
				this.notifyOwner('One of your garden plots has gone dry.');
			}
		}
		this.data.plots[plot].wet = false;
	}

	if (event == 'grow1'){
		// Check
		if (!this.data.plots[plot].seed){
			log.error(this+' garden trying to enter grow1 for plot with no seed at key '+plot+': '+this.data.plots[plot]);
			delete this.data.plots[plot].seed;
			this.data.plots[plot].state = 'dirty';
		} else {
			//log.info('grow1 stage ending - going to grow2');
			this.data.plots[plot].state = 'shoots';
			this.data.plots[plot].grow2_start = time();
			var seed = apiFindItemPrototype(this.data.plots[plot].seed);
			this.pushEvent(plot, floatval(seed.classProps.time_grow2 * config.garden_grow_multiplier * this.data.plots[plot].grow_modifier), 'grow2');
			//log.info(">>> SWITCH TO SHOOTS");
		}
	}

	if (event == 'grow2'){
		//log.info('grow2 stage ending - going to crops');
		this.data.plots[plot].state = 'crop';
		this.data.plots[plot].grow_modifier = 1;
		if (this.isPublic()){
			this.data.plots[plot].crop_time = time();
			//this.apiSetTimerX('removePlanterFromPlot', 60*1000, plot);
			this.pushEvent(plot, 0.0167, 'unlock');
		}
		//log.info(">>> SWITCH TO CROP");
		
		this.notifyOwner('One of your garden crops is ready for picking.');
	}

	if (event == 'unlock'){
		delete this.data.plots[plot].planter;
		delete this.data.plots[plot].crop_time;
	}

	this.broadcastConfig();
}

function notifyOwner(txt){
	var owner = this.container.pols_get_owner();
	if (owner){
		if (this.last_notification && time() - this.last_notification < (10*60)) return;
		
		owner.prompts_add({
			txt		: txt,
			icon_buttons	: false,
			timeout		: 10,
			choices		: [
				{ value : 'ok', label : 'ok' }
			]
		});
		
		this.last_notification = time();
	}
}

// this clears all events of a given type for a plot
function clearEvents(plot, type){

	for (var i in this.events){
		var ev = this.events[i];
		if (ev.plot == plot && ev.event == type){
			delete this.events[i];
		}
	}

	this.stateChange();
}

// this function is used in demos to initialize plots to certain states
function setPlotData(key, data){

	this.data.plots[key] = data;
}

function setPlotDataByKey(plot, key, data) {
	this.data.plots[plot][key] = data;
}

function gardenGrow() {
	for(var i in this.data.plots) {
		var plot = this.data.plots[i];
		if(!plot.seed) {
			continue;
		}
		plot.state = 'crop';

		this.clearEvents(i, "grow1");
		this.clearEvents(i, "grow2");
	}
	
	this.broadcastState();
	this.broadcastConfig();
}

function dryGarden() {
	for(var i in this.data.plots) {
		var plot = this.data.plots[i];
		if(!plot.wet) {
			continue;
		}
		plot.start_water = time() - timings.water * 60 * 60;
		this.stateChanged(i, "dry");
	}
	
	this.broadcastState();
	this.broadcastConfig();
}

function prepGarden() {
	for(var i in this.data.plots) {
		var plot = this.data.plots[i];
		plot.start_water = time();
		plot.state = "clean";
		plot.wet = true;
	}
	
	this.broadcastState();	
	this.broadcastConfig();
}

function getPlotStatus(key){
	this.initPlot(key);
	
	var plot = this.data.plots[key];
	
	// Check
	if (in_array(plot.state, ['seeds', 'shoots', 'crop']) && !plot.seed){
		log.error(this+' garden has plot with no seed at key '+key+': '+plot);
		delete plot.seed;
		plot.state = 'dirty';
	}
	
	var label = 'Plot';
	var class_tsid = '';
	var water_time = 0;
	var grow_time = 0;
	var max_grow_time = 0;
	var mature_level = this.isDepleted() ? 5 : 0;
	if (in_array(plot.state, ['seeds', 'shoots', 'crop']) && plot.seed){
		var seed = apiFindItemPrototype(plot.seed);
		label = seed.name_plural;
		class_tsid = plot.seed;
		
		if (in_array(plot.state, ['seeds', 'shoots'])){
			max_grow_time = Math.round((floatval(seed.classProps.time_grow1) + floatval(seed.classProps.time_grow2) * plot.grow_modifier) * config.garden_grow_multiplier * 60 * 60);
		
			var grow_elapsed_time = 0;
			if (plot.growth) grow_elapsed_time += plot.growth * 60 * 60;
			if (plot.start_grow) grow_elapsed_time += (time() - plot.start_grow);
			if (plot.grow_time_skipped) grow_elapsed_time += plot.grow_time_skipped;

			grow_time = Math.min(max_grow_time, intval(max_grow_time - grow_elapsed_time));

			if (grow_time < 0){
				this.stateChanged(key, 'grow2');
			}
		}
		
		if (plot.state == 'seeds'){
			mature_level = 1;
		}
		else if (plot.state == 'shoots'){
			mature_level = 2;
		}
		else if (plot.state == 'crop'){
			mature_level = 3;
			
			try{
				var fruit = apiFindItemPrototype(seed.classProps.produces_class);
				var num = intval(seed.classProps.produces_count);
				label = fruit.name_single;
				class_tsid = seed.classProps.produces_class;
			}
			catch(e) {
				plot.state = 'clean';
				mature_level = 0;
			}
		}
	}
	else if (plot.state == 'dirty'){
		label = 'A Dirty Plot';
	}
	else if (plot.wet){
		label = 'A Wet Plot';
	}
	else if (plot.state == 'clean'){
		label = 'A Clean Plot';
	}
	
	if (plot.wet){
		water_time = Math.max(0, intval((timings.water * 60 * 60) - (time() - (plot.start_water))));
	}
	
	if (plot.state == 'dirty') mature_level = 4;
	
	var plot_status = {
		label: label,
		class_tsid: class_tsid,  //the tsid of the current thing planted in the plot
		water_time: water_time,  //how many seconds left before it's dry (use 0 to set as dry)
		grow_time: grow_time,  //how many seconds left before it's fully grown
		max_grow_time: max_grow_time,  //amount of seconds maximum grow time occurs
		mature_level: mature_level,  //each state that the plot can show. (0 is nothing (only way to be able to plant seeds), 1 is seeds, 2 is sprout, 3 is full grown, 4 is harvested/weeds/dead)
		harvestable: (plot.state == 'crop' ? true : false),  //having this as true will show an animation on that plot to harvest it
		fertilized: plot.fertilized ? true : false
	};

	if (this.isPublic()){
		if (plot.planter && time() - plot.crop_time < 60) plot_status.planter_tsid = plot.planter;
	}
	
	return plot_status;
}

function plotIDToKey(plot_id){
	var col = (plot_id % this.data.width)+1;
	var row = Math.floor((plot_id / this.data.width)+1);
	
	return row+'-'+col;
}

// Is this a public garden? i.e. not in a POL?
function isPublic(){
	if (this.container.is_public) return true;
	return this.container.owner ? false : true;
}

function onDepleted(){
	if (this.countEmptyPlots()){
		this.broadcastConfig();
	}
	else{
		this.replaceWithDepleted();
	}
}

function countEmptyPlots(){
	var count = 0;
	for (var r=1; r<=this.data.height; r++){
		for (var c=1; c<=this.data.width; c++){
			var key = r+'-'+c;
			var plot = this.data.plots[key];

			if (plot.state != 'clean' && plot.state != 'dirty') count++;
		}
	}

	return count;
}

function setNewXPGarden() {
	for(var i in this.data.plots) {
		var plot = this.data.plots[i];
		plot.seed = 'seed_spinach';
		plot.state = 'crop';

		this.clearEvents(i, "grow1");
		this.clearEvents(i, "grow2");
	}
	
	this.broadcastState();
	this.broadcastConfig();
}

function onCreateAsCopy(){
	this.resetGarden();
}