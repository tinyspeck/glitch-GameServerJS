var is_trant = 1;

//
// Rows are current health, columns are previous states:
//	last: down	down twice	last: up		up twice
// Tuples are: hours till fall, hours till tendable
//

var health_change_rate = [
	[[2, 0.3],	[5, 0.3],	[0, 0],	 		[0, 0]],	
	[[1.5, 0.3],	[2.5, 0.3],	[0.8, 0.2],		[0, 0]],	
	[[1.5, 0.3],	[2.5, 0.3],	[0.8, 0.2],	 	[0.3, 0.15]],	
	[[1, 0.2],	[2, 0.5],	[0.5, 0.25],	 	[0.2, 0.1]],	
	[[1, 0.2],	[2, 0.5],	[0.5, 0.25],		[0.2, 0.1]],	
	[[0.5, 0.15],	[1, 0.4],	[0.5, 0.25],	 	[0.2, 0.1]],	
	[[0.5, 0.15],	[1, 0.4],	[0.25, 0.125],		[0.15, 0.1]],	
	[[0.5, 0.15],	[0.5, 0.2],	[0.25, 0.125],	 	[0.15, 0.1]],	
	[[0.25, 0.1],	[0, 0],	 	[0.25, 0.125], 		[0.15, 0.1]],	
	[[0, 0],	[0, 0],	 	[0.25, 0.125],		[0.15, 0.1]]
];

//
// tamagotchi actions
//

function performPetting(pc, msg){
	
	if (this.pettings) return false;
	
	var package_id = 'light_green_thumb_pet';
	// For the easter egg hunt:
	if (this.class_tsid == 'trant_egg'){
		package_id = 'lgt_egg_plant_pet';
	}
	var ret = pc.runSkillPackage(package_id, this, {word_progress: config.word_progress_map['pet'], no_fail: !pc.has_done_intro, overlay_id: 'trant_pet', callback: 'onPettingComplete', place_at_bottom: true, source_delta_y: -140, source_delta_x: 0, msg: msg});
	
	return ret['ok'] ? true : false;
}

function onPettingComplete(pc, ret){
	if (ret['ok']){
		this.pettings++;

		var rsp = 'Thanks for petting!';

		var slugs = ret.slugs;
		if (ret.values['energy_cost']){
			rsp += ' '+ret.values['energy_cost']+' energy';
		}

		if (ret.values['mood_bonus']){
			rsp += ' +'+ret.values['mood_bonus']+' mood';
		}

		if (ret.values['xp_bonus']){
			rsp += ' +'+ret.values['xp_bonus']+' iMG';
		}

		pc.sendActivity(rsp);

		this.performTending(pc);

		pc.achievements_increment('trants_petted', this.class_tsid);

		if (ret.details['got_drop']){
			if (!pc.skills_has('light_green_thumb_3')){
				this.sendResponse('pet_drop_lgt2', pc, slugs);
			}
			else{
				this.sendResponse('pet_drop_lgt3', pc, slugs);
			}
		}
		else{
			if (!pc.skills_has('light_green_thumb_1')){
				this.sendResponse('pet_na', pc, slugs);
			}
			else if (!pc.skills_has('light_green_thumb_2')){
				this.sendResponse('pet_lgt1', pc, slugs);
			}
			else if (!pc.skills_has('light_green_thumb_3')){
				this.sendResponse('pet_lgt2', pc, slugs);
			}
			else{
				this.sendResponse('pet_lgt3', pc, slugs);
			}
		}

		pc.announce_sound('PET_TRANT');
		this.broadcastStatus();
		pc.location.cultivation_add_img_rewards(pc, 3.0);

		pc.feats_increment_for_commit(1);
	}
	else{
		var rsp = 'Oops. You failed! You probably need a bit more skill to stop that from happening.';
		if (ret.details['mood_bonus']){
			var mood = pc.metabolics_lose_mood(ret.details['mood_bonus']);
			rsp += ' '+mood+' mood';
		}
		pc.sendActivity(rsp);
		pc.announce_sound('CLICK_FAILURE');

		this.sendResponse('pet_na_failed', pc, ret.slugs);
	}
}

function performWatering(pc, msg){
	
	if (this.waterings) return false;
	
	
	// Find a watering_can
	if (msg.target_itemstack_tsid){
		var watering_can = pc.getAllContents()[msg.target_itemstack_tsid];
	}
	else{
		function is_watering_can(it){ return it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);
		if (!watering_can){
			function is_watering_can(it){ return it.class_tsid == 'watering_can' && it.isWorking() ? true : false; }
			watering_can = pc.findFirst(is_watering_can);
		}
	}

	if (!watering_can){
		pc.sendActivity("That's going to be tough without a watering can :(");
		return false;
	}
	
	var success = pc.runSkillPackage('light_green_thumb_water', this, {word_progress: config.word_progress_map['water'], tool_item: watering_can, no_fail: !pc.has_done_intro, callback: 'onWateringComplete', place_at_bottom: true, source_delta_y: -140, source_delta_x: 0, msg: msg});
	
	if (!success['ok']){
		if (success['error_tool_broken']) { 
			pc.sendActivity("Sadly, your watering can is too worn out.");
		}
	
		pc.announce_sound_stop('WATERING_CAN');
		return false;
	}
	
	return true;
}

function onWateringComplete(pc, ret){
	if (ret['ok']){

		this.waterings++;

		var rsp = 'Thanks for watering!';

		var slugs = ret.slugs;
		if (ret.values['energy_cost']){
			rsp += ' '+ret.values['energy_cost']+' energy';
		}

		if (ret.values['mood_bonus']){
			rsp += ' +'+ret.values['mood_bonus']+' mood';
		}

		if (ret.values['xp_bonus']){
			rsp += ' +'+ret.values['xp_bonus']+' iMG';
		}

		pc.sendActivity(rsp);

		this.performTending(pc);

		pc.achievements_increment('trants_watered', this.class_tsid);
		pc.quests_inc_counter('trees_watered', 1);

		
		if (ret.details['got_drop']){
			if (!pc.skills_has('light_green_thumb_3')){
				this.sendResponse('water_drop_lgt2', pc, slugs);
			}
			else{
				this.sendResponse('water_drop_lgt3', pc, slugs);
			}
		}
		else{
			if (!pc.skills_has('light_green_thumb_1')){
				this.sendResponse('water_na', pc, slugs);
			}
			else if (!pc.skills_has('light_green_thumb_2')){
				this.sendResponse('water_lgt1', pc, slugs);
			}
			else if (!pc.skills_has('light_green_thumb_3')){
				this.sendResponse('water_lgt2', pc, slugs);
			}
			else{
				this.sendResponse('water_lgt3', pc, slugs);
			}
		}

		this.broadcastStatus();
		pc.location.cultivation_add_img_rewards(pc, 3.0);

		pc.feats_increment_for_commit(1);
	}
	else{
		var rsp = 'Oops. You failed! You probably need a bit more skill to stop that from happening.';
		pc.sendActivity(rsp);

		this.sendResponse('water_na_failed', pc, ret.slugs);
		pc.announce_sound_stop('WATERING_CAN');
		pc.announce_sound('CLICK_FAILURE');
	}
}

//
// Gardening allows harvesting of a trant twice in one game day (normally only once)
//

function canHarvest(pc){
	var package_class = 'gardening_harvest';
	
	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
	
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
	
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function performHarvest(pc, msg){

	//
	// Can we harvest at all?
	//

	if (!this.instanceProps.fruitCount){
		pc.sendActivity("There's nothing to pick, cowboy");
		return false;
	}
	
	var ret = this.canHarvest(pc);
	if (!ret['ok']){
		pc.sendActivity("You've already harvested as much as you can today.");
		return false;
	}
	
	
	//
	// do it
	//
		
	ret = pc.runSkillPackage('gardening_harvest', this, {overlay_id: 'trant_harvest', word_progress: config.word_progress_map['harvest'], callback: 'onHarvestingComplete', place_at_bottom: true, source_delta_y: -140, source_delta_x: 0, msg: msg});
	
	return ret['ok'] ? true : false;
}

function onHarvestingComplete(pc, ret){
	if (ret['ok']){

		var proto = apiFindItemPrototype(this.fruit_class);
		
		// Trant harvest should be 3 without any skill; 6 with Gardening I

		var will_take = ret.details['bonus_amount'];
		var bonus_multiplier = ret.details['bonus_multiplier'];
		var bonus_chance = ret.details['bonus_chance'];

		if ((pc.imagination_has_upgrade('gardening_harvest_bean') && this.fruit_class == 'bean_plain') ||
			(pc.imagination_has_upgrade('gardening_harvest_bubble') && this.fruit_class == 'plain_bubble') ||
			(pc.imagination_has_upgrade('gardening_harvest_egg') && this.fruit_class == 'egg_plain') ||
			(pc.imagination_has_upgrade('gardening_harvest_fruit') && this.fruit_class == 'cherry') ||
			(pc.imagination_has_upgrade('gardening_harvest_gas') && this.fruit_class == 'general_vapour') ||
			(pc.imagination_has_upgrade('gardening_harvest_spice') && this.fruit_class == 'all_spice')){
				
			bonus_multiplier = 4;
			bonus_chance = 0.10;
		}
		

		var got_bonus = false;
		// Only do the bonus chance if we haven't already got a random drop.
		if (bonus_multiplier && ((is_chance(bonus_chance) && !ret.details['got_drop']) || pc.buffs_has('max_luck'))){
			var harvest_effects = [];
			var bonus_items = will_take * (bonus_multiplier - 1);
			
			harvest_effects.push({
				"type"	: "item_give",
				"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
				"value"	: bonus_items
			});

			var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, []);

			pc.createItemFromOffsetDelayed(this.fruit_class, bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
			pc.show_rainbow('rainbow_superharvest', 1000);

			pc.quests_inc_counter('harvest_bonus_'+this.class_tsid, 1);
			got_bonus = true;

			this.addWear(proto.base_cost * bonus_items);
		}

		//
		// Take it from the tree and put as much as we can in the pack
		//

		var got = this.removeFruit(will_take);
		var remaining = pc.createItemFromSource(this.fruit_class, got, this);
		if (remaining != got){
			var rsp = "Harvested!";

			var slugs = ret.slugs;
			if (ret.values['energy_cost']){
				rsp += ' '+ret.values['energy_cost']+' energy';
			}

			if (ret.values['mood_bonus']){
				rsp += ' +'+ret.values['mood_bonus']+' mood';
			}

			if (ret.values['xp_bonus']){
				rsp += ' +'+ret.values['xp_bonus']+' iMG';
			}

			pc.sendActivity(rsp);

			switch (this.fruit_class) {
			case 'bean_plain':
				pc.announce_sound('BEEN_TREE');
				break;
			case 'plain_bubble':
				pc.announce_sound('BUBBLE_TREE');
				break;
			case 'egg_plain':
				pc.announce_sound('EGG_TREE');
				break;
			case 'cherry':
				pc.announce_sound('FRUIT_TREE');
				break;
			case 'general_vapour':
				pc.announce_sound('GAS_TREE');
				break;
			case 'all_spice':
				pc.announce_sound('SPICE_TREE');
				break;
			default:
				pc.announce_sound('HARVEST');
				break;
			}

			pc.achievements_increment('trants_harvested', this.class_tsid);
			pc.achievements_increment('trants_fruit_harvested', this.fruit_class, (got-remaining));

			//
			// increment quest trackers
			//

			if (this.class_tsid == 'trant_fruit'){
				pc.quests_inc_counter('fruit_tree_harvested', 1);
			}
			else if (this.class_tsid == 'trant_bubble'){
				pc.quests_inc_counter('bubble_tree_harvested', 1);
			}
			else if (this.class_tsid == 'trant_spice'){
				pc.quests_inc_counter('spice_tree_harvested', 1);
			}

			pc.quests_inc_counter('trant_harvest_'+this.class_tsid, 1);

			if (this.class_tsid == 'trant_egg' && intval(this.getInstanceProp('fruitCount')) == 0){
				pc.quests_set_flag('gardening_harvest_last_egg_plant');
			}


			//
			// Talkback
			//

			if (!slugs.items) slugs.items = [];
			slugs.items.push({
				class_tsid	: this.fruit_class,
				label		: proto.label,
				count		: (got-remaining)
			});

			if (ret.details['got_drop']){

				if (!pc.skills_has('gardening_4')){
					this.sendResponse('harvest_drop_g3', pc, slugs);
				}
				else if (!pc.skills_has('gardening_5')){
					this.sendResponse('harvest_drop_g4', pc, slugs);
				}
				else{
					this.sendResponse('harvest_drop_g5', pc, slugs);
				}
			}
			else if (got_bonus){
				if (!pc.skills_has('gardening_4')){
					this.sendResponse('harvest_bonus_g3', pc, slugs);
				}
				else if (!pc.skills_has('gardening_5')){
					this.sendResponse('harvest_bonus_g4', pc, slugs);
				}
				else{
					this.sendResponse('harvest_bonus_g5', pc, slugs);
				}
			}
			else{
				if (!pc.skills_has('gardening_2')){
					this.sendResponse('harvest_g1', pc, slugs);
				}
				else if (!pc.skills_has('gardening_4')){
					this.sendResponse('harvest_g2_g3', pc, slugs);
				}
				else{
					this.sendResponse('harvest_g4_g5', pc, slugs);
				}
			}

			this.addWear(proto.base_cost * (got - remaining));
			this.container.cultivation_add_img_rewards(pc, 8.0);
		}
		else{
			pc.sendActivity("You need to make more room in your pack if you want to harvest.");
		}


		//
		// Put back any fruit we couldn't take
		//

		if (remaining){
			this.pushFruit(remaining);
		}

		pc.feats_reset_commit();
	}
	else{
		pc.sendActivity("Oops. You failed! You probably need a bit more skill to stop that from happening.");
	}
}

//
// Remove as much as 'max' fruit from the trant
// Return how much we could get
//

function removeFruit(max){
	var got = max;
	if (this.instanceProps.fruitCount > max){
		this.instanceProps.fruitCount -= max;
	}else{
		got = this.instanceProps.fruitCount;
		this.instanceProps.fruitCount = 0;
	}
	this.broadcastState();
	
	this.container.apiNotifyItemStateChanged(this);
	
	return got;
}

//
// Put 'amount' of fruit back on the trant
//

function pushFruit(amount){
	var old_fruitCount = this.instanceProps.fruitCount;
	this.instanceProps.fruitCount += amount;

	if (this.instanceProps.fruitCount > this.instanceProps.fruitCapacity){
		amount -= (this.instanceProps.fruitCapacity - this.instanceProps.fruitCount);
		this.instanceProps.fruitCount = this.instanceProps.fruitCapacity;
	}

	if (this.instanceProps.fruitCount != old_fruitCount){
		this.broadcastState();
		this.container.apiNotifyItemStateChanged(this);
	}
	
	return amount;
}


//
// the setup
//

function initTrant(){
	this.apiSetHitBox(400, 400);

	this.start_time = time();

	this.instanceProps.health = 7;
	this.instanceProps.maturity = 1;
	this.instanceProps.fruitCount = 0;
	this.instanceProps.fruitCapacity = 0;

	this.maturity_intervals = 0;
	this.fruit_intervals = 0;

	this.maturity_cycle = 100; // gets set later...

	this.pettings = 0;
	this.waterings = 0;
	this.broadcastStatus();
	
	this.last_health_up = 0; // Was the last health positive?
	this.before_last_health_up = 1; // Was the health tick before last positive?
	this.health_fall_intervals = 1;
	this.tendable_intervals = 0;

	// we don't really use this, but this will trigger
	// calling buildState() which we override
	this.state = 1;

	this.recalcCycles(); // Sets this.maturity_cycle to the proper value
	this.updateFruitCap();
	this.fillWithFruit();

	this.startLoop();
}

function fillWithFruit(){
	this.instanceProps.fruitCount = this.instanceProps.fruitCapacity;
	this.broadcastState();
	
	if (this.container){
		this.container.apiNotifyItemStateChanged(this);
	}
}

function startLoop(){

	this.apiSetInterval('onInterval', 1);
}

function stopLoop(){

	this.apiClearInterval('onInterval');
}

function recalcCycles(){

	switch (this.instanceProps.maturity){

		case 1:
			//this.maturity_cycle = 40; // 40m
			this.maturity_cycle = 10; // 10m
			break;
		case 2:
		case 3:
		case 4:
		case 5:
			//this.maturity_cycle = 240; // 4h
			this.maturity_cycle = 20; // 20m
			break;
		case 6:
		case 7:
		case 8:
			//this.maturity_cycle = 1440; // 24h
			this.maturity_cycle = 20; // 20m
			break;
		case 9:
			//this.maturity_cycle = 4320; // 72h
			this.maturity_cycle = 20; // 20m
			break;
		case 10:
			//this.maturity_cycle = 1680; // 28h
			this.maturity_cycle = 20; // 20m
			break;
	}
}


//
// the health tick timer
//

function onInterval(){
	
	//
	// Various sanity checks
	//
	
	if (!this.intervals) this.intervals = 0;
	this.intervals++;
	
	if (this.instanceProps.maturity < 0) this.instanceProps.maturity = 0;
	if (this.instanceProps.maturity > 10) this.instanceProps.maturity = 10;
	
	if (this.instanceProps.health < 0) this.instanceProps.health = 0;
	if (this.instanceProps.health > 10) this.instanceProps.health = 10;
	
	if (!config.trant_growth_enabled || this.isRooked() || this.container.jobs_is_street_locked() || this.container.is_upgrade_template() || this.container.is_newxp){
		//log.info('!!!!!!!!!!! Trant growth is disabled !!!!!!!!!!!!');
		return;
	}
	
	if (!this.health_fall_intervals){
		this.health_fall_intervals = 0;
	}
	
	if (!this.tendable_intervals){
		this.tendable_intervals = 0;
	}

	//log.info('tick started (m='+this.instanceProps.maturity+'/h='+this.instanceProps.health+')');

	var change_rate = this.getChangeRates();
	//log.info('-----------change_rate: '+change_rate[0]+', '+change_rate[1]);
	this.health_fall_intervals++;
	var next_fall = Math.round(change_rate[0] * 60 * config.trant_growth_multiplier);
	//log.info('-----------trant next fall: '+this.health_fall_intervals+'/'+next_fall);
	if (this.health_fall_intervals >= next_fall){
		this.health_fall_intervals = 0;
		this.onHealthFall();
	}
	
	this.tendable_intervals++;
	var next_tend = Math.round(change_rate[1] * 60 * config.trant_growth_multiplier);
	//log.info('-----------trant next tend: '+this.tendable_intervals+'/'+next_tend);
	if (this.tendable_intervals >= next_tend){
		this.tendable_intervals = 0;
		this.onTendable();
	}

	this.maturity_intervals++;
	if (this.maturity_intervals >= this.maturity_cycle){
		this.maturity_intervals = 0;
		this.onMaturityCycle();
		this.recalcCycles();
	}

	//log.info('tick ended (m='+this.instanceProps.maturity+'/h='+this.instanceProps.health+')'+"\n");
	
	if (this.intervals >= 24*60*60){
		// Are we oooooold?
		var old = time()-this.start_time;
		//var month = 4435200/12;
		// after 6 game months, 2% and then an additional 2% for each additional month?
		//if (old >= (month * 6)){
		var day = 60*60*24;
		if (old >= day){ // Switched to to chance per real day on 12/8/2010
			var chance = 0.02;
			//var remaining = old - (month * 6);
			var remaining = old - day;
			//while (remaining >= month){
			while (remaining >= day){
				chance += 0.02;
				//remaining -= month;
				remaining -= day;
			}
		
			if (is_chance(chance)){
				log.info('Trant dying of old age with chance: '+chance);
				//if (config.is_prod) utils.irc_inject('#stats', this.label+' tree died of old age in '+this.container.label+'.');
				this.die();
			}
		}
		
		this.intervals = 0;
	}
}


//
// health
//

function performTending(pc){
	//log.info('--------- trant performTending: '+this.pettings+'-'+this.waterings);
	if (this.pettings && this.waterings){
		var previous_health = this.instanceProps.health;
		this.plusHealth();

		pc.quests_inc_counter('heal_trant', 1);

		if (this.instanceProps.health == 10 && this.instanceProps.health != previous_health){
			pc.quests_set_flag('trant_health_10');
		}
		
		this.health_fall_intervals = this.tendable_intervals = 0;
	}
}

function onHealthFall(){
	//log.info('--------- trant onHealthFall');
	this.minusHealth();
}

function onTendable(){
	//log.info('--------- trant onTendable');
	this.pettings = 0;
	this.waterings = 0;
}

function plusHealth(){
	//log.info('incrementing health');

	if (this.instanceProps.health < 10){
		this.instanceProps.health++;
	}	

	this.onFruitCycle();
	this.broadcastState();
	this.broadcastStatus();
	
	this.before_last_health_up = this.last_health_up;
	this.last_health_up = 1;
}

function minusHealth(){
	if (this.instanceProps.dontDie == 1) return;
	//log.info('decrementing health');

	if (this.instanceProps.health > 0){
		this.instanceProps.health--;
	}
	
	this.updateFruitCap();
	this.broadcastState();
	this.broadcastStatus();
	
	this.before_last_health_up = this.last_health_up;
	this.last_health_up = 0;
	
	if (this.instanceProps.health == 0){
		log.info('Tree dying at health 0');
		//if (config.is_prod) utils.irc_inject('#stats', this.label+' tree died of neglect in '+this.container.label+'.');
		this.die();
	}
}

function die(){
	if (this.is_poisoned) this.container.overlay_dismiss(this.tsid+'_poisoned_all');
	if (this.instanceProps.dontDie == 1) return;

	this.stopLoop();

	// the tree dies
	if (this.start_time){
		log.info("Tree dies after "+(time()-this.start_time)+" seconds");
	}
	else{
		log.info("Tree dies");
	}

	var wear = this.canWear() ? this.getInstanceProp('cultivation_wear') : undefined;
	var proto_class = this.getProp('proto_class');

	var s;
	if (this.class_tsid == 'trant_egg'){
		s = this.replaceWith('trant_egg_dead');
		//this.replaceWith('patch_dark');
	}
	else if (this.class_tsid == 'trant_bean'){
		s = this.replaceWith('trant_bean_dead');
	}
	else if (this.class_tsid == 'trant_bubble'){
		s = this.replaceWith('trant_bubble_dead');
	}
	else if (this.class_tsid == 'trant_fruit'){
		s = this.replaceWith('trant_fruit_dead');
	}
	else if (this.class_tsid == 'trant_gas'){
		s = this.replaceWith('trant_gas_dead');
	}
	else if (this.class_tsid == 'trant_spice'){
		s = this.replaceWith('trant_spice_dead');
	}

	if (wear){
		s.setInstanceProp('cultivation_wear', wear);
		s.setProp('proto_class', proto_class);
	}

	return s;
}


//
// maturity
//

function plusMaturity(){
	this.instanceProps.maturity++;
	if (this.instanceProps.maturity > 10) this.instanceProps.maturity = 10;
	this.updateFruitCap();
	this.broadcastState();
	this.broadcastStatus();
	
	if (this.instanceProps.maturity == 10){
		var owner = this.container.pols_get_owner();
		if (owner){
			if (owner.getQuestStatus('soilappreciation_get_all_back_yard_trees_to_level10') == 'todo'){
				if (!owner.fully_grown_trants) owner.fully_grown_trants = {};
				if (!owner.fully_grown_trants[this.tsid]){
					owner.fully_grown_trants[this.tsid] = time();
					owner.quests_inc_counter('pol_trants_fully_grown', 1);
					
					owner.prompts_add({
						txt		: 'One of your trees is now fully grown!',
						icon_buttons	: false,
						timeout		: 10,
						choices		: [
							{ value : 'ok', label : 'ok' }
						]
					});
				}
			}
		}
	}
}

function minusMaturity(){
	this.instanceProps.maturity--;
	if (this.instanceProps.maturity < 0) this.instanceProps.maturity = 0;
	this.updateFruitCap();
	this.broadcastState();
	this.broadcastStatus();
}

function onMaturityCycle(){
	
	if (this.instanceProps.dontDie == 1 || this.isRooked()) return;
	
	//
	// Die?
	//
	
	var chance = 0;
	if (this.instanceProps.health == 1){
		chance = 0.35;
	}
	else if (this.instanceProps.health == 2){
		chance = 0.2;
	}
	else if (this.instanceProps.health == 3){
		chance = 0.1;
	}
	
	if (chance && is_chance(chance)){
		log.info("onMaturityCycle death: "+chance);
		//if (config.is_prod) utils.irc_inject('#stats', this.label+' tree died of neglect in '+this.container.label+'.');
		this.die();
		return;
	}
	
	
	//
	// Grow?
	//
	
	if (this.instanceProps.health >= 5){
		chance = 0;
		
		if (this.instanceProps.maturity <= 2){
			if (this.instanceProps.health <= 6){
				chance = 0.5;
			}
			else if (this.instanceProps.health <= 9){
				chance = 0.8;
			}
			else if (this.instanceProps.health <= 10){
				chance = 1.0;
			}
		}
		else if (this.instanceProps.maturity <= 5){
			if (this.instanceProps.health <= 6){
				chance = 0.08;
			}
			else if (this.instanceProps.health <= 8){
				chance = 0.15;
			}
			else if (this.instanceProps.health <= 9){
				chance = 0.2;
			}
			else if (this.instanceProps.health <= 10){
				chance = 0.4;
			}
			
		}
		else if (this.instanceProps.maturity <= 7){
			if (this.instanceProps.health <= 6){
				chance = 0.04;
			}
			else if (this.instanceProps.health <= 8){
				chance = 0.1;
			}
			else if (this.instanceProps.health <= 9){
				chance = 0.15;
			}
			else if (this.instanceProps.health <= 10){
				chance = 0.3;
			}
		}
		else if (this.instanceProps.maturity <= 9){
			if (this.instanceProps.health <= 6){
				chance = 0.02;
			}
			else if (this.instanceProps.health <= 8){
				chance = 0.04;
			}
			else if (this.instanceProps.health <= 9){
				chance = 0.08;
			}
			else if (this.instanceProps.health <= 10){
				chance = 0.15;
			}
		}

		if (chance && is_chance(chance)){
			this.plusMaturity();
		}
	}
}


//
// send health/maturity to tree
//

function buildState(){

	if (!this.instanceProps){
		this.apiDelete(); // hack
		return {};
	}

	return {
		m	: this.instanceProps.maturity,
		h	: this.instanceProps.health,
		f_cap	: this.instanceProps.fruitCapacity,
		f_num	: this.instanceProps.fruitCount
	};
}

function getStatus(pc){

	var is_rook_verbs = this.isRooked();
	var is_tend_verbs = !is_rook_verbs;

	var msg = "I have a health of "+this.instanceProps.health+" and a maturity of "+this.instanceProps.maturity+".";

	var likes = [];
	var dislikes = [];

	if (this.pettings ){ dislikes.push('petted' ); }else{ likes.push('petted' ); }
	if (this.waterings){ dislikes.push('watered'); }else{ likes.push('watered'); }

	if (likes.length   ) msg += " I would like to be "+pretty_list(likes, ' and ')+".";
	if (dislikes.length){
		msg += " I don't want to be "+pretty_list(dislikes, ' or ')+"";
	
		if (!likes.length){
			var minutes = this.minutesUntilTendable();
			if (minutes < 60){
				if (minutes == 1){
					msg += " for 1 minute";
				}
				else{
					msg += " for "+minutes+" minutes";
				}
			}
			else if (minutes < 120){
				msg += " for 1 hour";
			}
			else{
				var hours = Math.ceil(minutes / 60);
				msg += " for "+hours+" hours";
			}
		
		}
		
		msg += '.';
	}
	
	var status = {
		is_rook_verbs: is_rook_verbs,
		is_tend_verbs: is_tend_verbs,
		msg: msg,
		verb_states: {},
	};

	if (this.wantsPet(pc) && this.container.class_tsid != 'newxp_training2'){
		status.verb_states['pet'] = {
			enabled: true,
			disabled_reason: '',
			warning: (this.instanceProps.health == 1 ? true : false)
		};
	}
	
	if (this.wantsWater(pc) && this.container.class_tsid != 'newxp_training2'){
		status.verb_states['water'] = {
			enabled: true,
			disabled_reason: '',
			warning: (this.instanceProps.health == 1 ? true : false)
		};
	}
	
	if (this['!rook_vulnerabilty_verb'] == 'hug'){
		status.verb_states['hug'] = {
			enabled: true,
			disabled_reason: "",
			warning: true
		};
	}
	
	if (this['!rook_vulnerabilty_verb'] == 'kiss'){
		status.verb_states['kiss'] = {
			enabled: true,
			disabled_reason: "",
			warning: true
		};
	}
	
	return status;
}


//
// called when health or maturity have changed.
// set up fruit capacity here and kill off any extra fruit.
//

function updateFruitCap(){
	if (!this.fruitCapMap || !this.fruitCapMap[this.instanceProps.maturity-1]) return;

	var value = this.fruitCapMap[this.instanceProps.maturity-1][this.instanceProps.health-1];

	if (value){
		this.instanceProps.fruitCapacity = value;
	}else{
		this.instanceProps.fruitCapacity = 0;
	}

	if (this.instanceProps.fruitCount > this.instanceProps.fruitCapacity){

		this.instanceProps.fruitCount = this.instanceProps.fruitCapacity;
	}
}

function onFruitCycle(){
	this.updateFruitCap();

	var value = 0;
	if (this.fruitProdMap && this.fruitProdMap[this.instanceProps.maturity-1]){
		value = this.fruitProdMap[this.instanceProps.maturity-1][this.instanceProps.health-1];
	}

	if (value){
		this.pushFruit(value);
	}
}

//
// Utility functions
//

function getChangeRates(){
	// Assume the best
	if (this.last_health_up == undefined){
		this.last_health_up = 1;
	}
	
	if (this.before_last_health_up == undefined){
		this.before_last_health_up = 1;
	}
	
	//log.info('-----------trant change_rates: '+this.last_health_up+'/'+this.before_last_health_up);
	if (this.last_health_up && this.before_last_health_up){
		var column = 3;
	}
	else if (this.last_health_up && !this.before_last_health_up){
		var column = 2;
	}
	else if (!this.last_health_up && !this.before_last_health_up){
		var column = 1;
	}
	else{
		var column = 0;
	}
	
	// without the max, we can get -1 if curr health is 0;
	var prev_health = Math.max(0, this.instanceProps.health-1);
	
	//log.info('-----------row/column: '+(prev_health)+'/'+column);
	//log.info('-----------rate: '+this.health_change_rate[prev_health][column]);
	var rates = this.health_change_rate[prev_health][column];
	
	if (this.container.pols_is_pol()){
		// Health change rules should be 4x slower in the first tuple value (so you have longer before they fall in health, 
		// even though they become tendable in the same amount of tine); maturity rules can remain the same.
		
		rates[0] = rates[0] * 4;
	}
	
	return rates;
}

function minutesUntilTendable(){
	var change_rate = this.getChangeRates();
	var next_tend = Math.round(change_rate[1] * 60);
	
	return next_tend - this.tendable_intervals;
}

function wantsWater(pc){
	if (pc){
		// Find a watering_can
		function is_watering_can(it){ return it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);
		if (!watering_can){
			function is_watering_can(it){ return it.class_tsid == 'watering_can' && it.isWorking() ? true : false; }
			watering_can = pc.findFirst(is_watering_can);
		}

		if (!watering_can) return false;
	}
	if (this.isRooked()) return false;
	if (this.waterings) return false;
	if (this.is_poisoned) return false;
	if (this.container.trantVerbAvailable){
		var avail = this.container.trantVerbAvailable(this.class_tsid, 'water');
		if (avail && (avail.state == null || avail.state == 'disabled')) return false;
	}
	return true;
}

function wantsPet(pc){
	if (this.isRooked()) return false;
	if (this.pettings) return false;
	if (this.is_poisoned) return false;
	if (this.container.trantVerbAvailable){
		var avail = this.container.trantVerbAvailable(this.class_tsid, 'pet');
		if (avail && (avail.state == null || avail.state == 'disabled')) return false;
	}
	return true;
}

function onRooked(){
	delete this.rooked_start_health;
	this.removeFruit(this.instanceProps.fruitCount);
	
	// changes states in the following sequence, with a pause of 2 secs between each change:
	// - down 2 health, down 2 maturity, up 1 health, up 1 maturity, down 2 health,  up 1 maturity, up 1 health (at which point it is net down 2 health)
	// - if the trants health was already 3 or 2, this sequnece will need to be modified according and the health will just toggle between 2 and 1
	// - if the trants health was already 1, the trant gets killed
	// - normal health/maturity ticks do not fire when the trant is rooked
	
	if (this.instanceProps.health == 1){
		this.die();
	}
	else{
		if (this.instanceProps.health != 2){
			this.minusHealth();
		}
		
		this.minusHealth();
		
		this.events_add({callback: 'onRookedStep', step: '1'}, 2);
		this.events_add({callback: 'onRookedStep', step: '2'}, 4);
		this.events_add({callback: 'onRookedStep', step: '3'}, 6);
		this.events_add({callback: 'onRookedStep', step: '4'}, 8);
		this.events_add({callback: 'onRookedStep', step: '5'}, 10);
		this.events_add({callback: 'onRookedStep', step: '6'}, 12);
	}
}

function onRookedStep(details){
	switch (details.step){
		case '1':
			this.minusMaturity();
			this.minusMaturity();
			break;
			
		case '2':
			this.plusHealth();
			break;
			
		case '3':
			this.plusMaturity();
			break;
			
		case '4':
			if (this.instanceProps.health != 2){
				this.minusHealth();
			}
			this.minusHealth();
			break;
			
		case '5':
			this.plusMaturity();
			break;
			
		case '6':
			this.plusHealth();
			
			this.apiSetTimer('onRookedComplaint', 2000);
			break;
				
		default:
			log.info('trant onRookedStep() unknown step: '+details.step);
	}
}

function onRookedComplaint(){
	// after that sequence is complete, it toggles every 2 seconds between its current health state and one lower
	if (!this.isRooked()){
		delete this.rooked_start_health;
		return;
	}
	
	if (!this.rooked_start_health) this.rooked_start_health = this.instanceProps.health;
	
	if (this.rooked_start_health == this.instanceProps.health){
		this.minusHealth();
	}
	else{
		this.plusHealth();
	}
	
	this.apiSetTimer('onRookedComplaint', 2000);
}

function replaceWithPatch(){

	if (this.class_tsid == 'trant_egg'){

		this.replaceWith('patch_dark');
	}else{
		this.replaceWith('patch');
	}
}

function onFertilidust(){
	if (this.instanceProps.maturity < 10){
		this.plusMaturity();
	}
	this.instanceProps.health = 9;
	this.plusHealth();
	
	if (this.isRooked()){
		this.reduceRookedness(60);
	}
}

function onPlayerEnter(pc){
	if (this.is_poisoned){
		pc.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			duration: (this.poison_end - time())*1000,
			delta_x: 0,
			delta_y: 20,
			swf_url: overlay_key_to_url('poisoned'),
			uid: this.tsid+'_poisoned_all',
			follow: true
		});
	}
}

function onPlayerExit(pc){
	if (this.is_poisoned){
		pc.overlay_dismiss(this.tsid+'_poisoned_all');
	}
}

function applyPoison(){
	this.is_poisoned = true;
	var duration = 3*60;
	this.poison_end = time() + duration;
	this.apiSetTimer('die', duration*1000);
	this.container.apiSendAnnouncement({
		type: 'itemstack_overlay',
		itemstack_tsid: this.tsid,
		duration: duration*1000,
		delta_x: 0,
		delta_y: 20,
		swf_url: overlay_key_to_url('poisoned'),
		uid: this.tsid+'_poisoned_all'
	});
	
	this['!poison_ticks'] = 0;
	this.apiSetTimer('onPoisoned', 3*1000);
}

function onPoisoned(){
	if (!this.is_poisoned){
		if (this.poison_end) delete this.poison_end;
		return;
	}
	
	if (this['!poison_ticks'] % 2 == 0){
		var remaining = this.poison_end - time();
		var phrase = "Help! I've been poisoned and will die in "+remaining+" seconds.";
	}
	else{
		var phrase = "I need <a href=\"event:item|potion_tree_poison_antidote\">antidote</a>!";
	}
	
	this.sendBubble(phrase, 3*1000);
	
	this['!poison_ticks']++;
	this.apiSetTimer('onPoisoned', 30*1000);
}

function onContainerChanged(oldContainer, newContainer){
	if (!oldContainer) this.broadcastStatus();
}
