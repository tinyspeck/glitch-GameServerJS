
function metabolics_init(){

	if (!this.metabolics){
		this.metabolics = {};
	}

	var max = this.metabolics_calc_max(this.stats.level);
	this.init_prop('metabolics', 'energy', max, 0, max);
	this.init_prop('metabolics', 'mood', max, 0, max);

	// This seems unnecessary
	//this.metabolics_recalc_limits(false);

	if (!this.metabolics.tank) this.metabolics.tank = this.metabolics.energy.top;
}



function metabolics_get_login(out){

	out.energy = {
		value	: this.metabolics.energy.value,
		max	: this.metabolics.energy.top
	};

	out.mood = {
		value	: this.metabolics.mood.value,
		max	: this.metabolics.mood.top
	};
}

/* Prevent a player who is low on energy from becoming pooped until
 * they next go above five energy. Used by Wine of the Dead.
 */
function metabolics_dont_get_pooped() {
	this.dontGetPooped = true;
}

function metabolics_add_energy(x, quiet, force){
	
	if (this.is_dead){
		if (!quiet){
			this.sendOnlineActivity("You would have gained energy, but you're dead!");
		}
		return 0;
	}
	else if (this.buffs_has('super_pooped')){
		if (!quiet){
			this.sendOnlineActivity("You would have gained energy, but you're super pooped!");
		}
		return 0;
	}

	var change = this.metabolics.energy.apiInc(x);
	
	this.daily_history_increment('energy_gained', change);

	if (change && !quiet){
		this.apiSendAnnouncement({
			type: "energy_stat",
			delta: change,
		});
	}
	
	if (this.metabolics_get_percentage('energy') > 5) {
		if (this.buffs_has('pooped')){
			this.buffs_remove('pooped');
		}
		
		if (this.dontGetPooped) {
			delete this.dontGetPooped;
		}
	}
	
	return change;
}

function metabolics_add_mood(x, quiet, force){
	
	if (this.is_dead){
		if (!quiet){
			this.sendOnlineActivity("You would have gained some mood, but you're dead!");
		}
		return 0;
	}
	
	var change = this.metabolics.mood.apiInc(x);

	if (change && !quiet){
		this.apiSendAnnouncement({
			type: "mood_stat",
			delta: change,
		});
	}

	return change;
}

function metabolics_try_lose_energy(x){
	if (this.metabolics_get_energy() > x){
		return this.metabolics_lose_energy(x);
	}

	return 0;
}

function metabolics_lose_energy(x, quiet, force){
	
	// No energy loss during newxp
	if (!force){
		if (this.location.is_newxp && (this.location.isInstance('newxp_intro') || this.location.isInstance('newxp_training1'))){
			return 0;
		}
	}
	
	if (this.is_dead){
		if (!quiet){
			this.sendOnlineActivity("You would have lost energy, but you're dead!");
		}
		return 0;
	}
	
	var change = this.metabolics.energy.apiDec(x);

	if (change && !quiet){
		this.apiSendAnnouncement({
			type: "energy_stat",
			delta: change,
		});
	}
	
	
	this.daily_history_increment('energy_consumed', change * -1);
	
	// Check for croaking
	if (this.metabolics_get_energy() == 0 && !this.deaths_today && !this.buffs_has('no_no_powder')){
		// 1. If you get down below the DEATH THRESHOLD (I think that's less than 2% of energy?) on a given day, you die. That will be the only time you die that day.
		log.info(this+' croaking due to low energy');
		this.croak();
	}
	// Check for pooped
	else if (this.metabolics_get_percentage('energy') <= 5 && !this.is_dead && this.deaths_today && !this.dontGetPooped){
		var tomorrow = timestamp_to_gametime(time()+ (game_days_to_ms(1)/1000));
		tomorrow[3] = 0;
		tomorrow[4] = 0;
	
		var remaining = gametime_to_timestamp(tomorrow) - time();
		if (this.daily_history_get(current_day_key(), 'energy_consumed') >= this.metabolics.energy.top * 20 && !this.buffs_has('super_pooped')){
			if (this.buffs_has('pooped')) this.buffs_remove('pooped');
			this.buffs_apply('super_pooped', {duration: remaining});
		}
		else if (!this.buffs_has('pooped') && !this.buffs_has('super_pooped')){
			this.buffs_apply('pooped', {duration: remaining});
		}
	};
	
	if (this.metabolics_get_percentage('energy') <= 10 && !this.buffs_has('walking_dead') && !this.is_dead && time() - this['!last_energy_warning'] > 60){
		if (this.deaths_today){
			this.sendOnlineActivity('You are extremely low on energy! Find something to eat.');
		}
		else{
			this.sendOnlineActivity('You are about to croak! Find something to eat.');
		}
		
		this['!last_energy_warning'] = time();
	}

	return change;
}

function metabolics_try_lose_mood(x){
	if (this.metabolics_get_mood() > x){
		return this.metabolics_lose_mood(x);
	}

	return 0;
}

function metabolics_lose_mood(x, quiet, force){
	
	// No mood loss during newxp
	if (!force){
		if (this.location.is_newxp && (this.location.isInstance('newxp_intro') || this.location.isInstance('newxp_training1'))){
			return 0;
		}
	}
	
	if (this.is_dead){
		if (!quiet){
			this.sendOnlineActivity("You would have lost some mood, but you're dead!");
		}
		return 0;
	}
	
	var change = this.metabolics.mood.apiDec(x);

	if (change && !quiet){
		this.apiSendAnnouncement({
			type: "mood_stat",
			delta: change,
		});
	}
	
	if (this.location.instance_id != 'tower_quest_desert'){
		if (this.metabolics_get_percentage('mood') <= 20 && !this.buffs_has('walking_dead') && !this.is_dead){
			this.sendOnlineActivity('Your mood is getting very low! Try drinking something tasty.');
		}
		else if (this.metabolics_get_percentage('mood') <= 50 && !this.buffs_has('walking_dead') && !this.is_dead){
			//this.sendOnlineActivity('Your mood is getting low. Watch it: you\'ll start burning energy faster.');
			this.sendOnlineActivity('Your mood is getting low. Drink something, else you\'ll earn less iMG for your actions.');
		}
	}

	if (this.metabolics_get_mood() == 0 && this.is_god){
		this.quests_offer('zero_mood');
	}

	return change;
}

function metabolics_get_energy(){
	return this.metabolics.energy.value;
}

function metabolics_get_mood(){
	return this.metabolics.mood.value;
}

function metabolics_set_energy(x, quiet, force){

	if (this.metabolics.energy.top < x){
		x = this.metabolics.energy.top;
	}
	
	var change = x - this.metabolics_get_energy();
	
	if (change > 0){
		return this.metabolics_add_energy(change, quiet, force);
	}
	else if (change < 0){
		return this.metabolics_lose_energy(Math.abs(change), quiet, force);
	}
	else{
		return 0;
	}
}

function metabolics_set_mood(x, quiet, force){
	if (this.metabolics.mood.top < x){
		x = this.metabolics.mood.top;
	}

	var change = x - this.metabolics_get_mood();
	if (change > 0){
		return this.metabolics_add_mood(change, quiet, force);
	}
	else if (change < 0){
		return this.metabolics_lose_mood(Math.abs(change), quiet, force);
	}
	else{
		return 0;
	}
}

function metabolics_recalc_limits(set_to_max){
	
	//log.info(this+' metabolics_recalc_limits 1: '+set_to_max);
	if (set_to_max === undefined){
		set_to_max = true;
	}
	//log.info(this+' metabolics_recalc_limits 2: '+set_to_max);

	var max = this.metabolics_calc_max(this.stats.level);
	this.metabolics_set_max('energy', max);
	this.metabolics_set_max('mood', max);

	if (set_to_max){
		this.metabolics.energy.apiSet(max);
		this.metabolics.mood.apiSet(max);

		if (this.buffs_has('pooped')){
			this.buffs_remove('pooped');
		}
		
		if (this.dontGetPooped) {
			delete this.dontGetPooped;
		}
	}

	//log.info('metabolic limit at level '+this.stats.level+' is '+max);
}

// This will currently be reset any time metabolics_recalc_limits is called
function metabolics_set_max(metabolic, max){
	if (!this.metabolics[metabolic]) return false;

	if (this.metabolics[metabolic].top != max){
		this.metabolics[metabolic].apiSetLimits(0, max);
	}

	if (this.metabolics[metabolic].value > max){
		this.metabolics[metabolic].apiSet(max);
	}

	return true;
}

function metabolics_get_percentage(stat){
	return this.metabolics[stat].value / this.metabolics[stat].top * 100;
}

function metabolics_calc_max(level, ignore_buffs){
	
	// Some buffs artificially restrict your max amounts
	if (!ignore_buffs){
		if (this.buffs_has('real_bummer')){
			return 30;
		}
		else if (this.buffs_has('bad_mood')){
			return 60;
		}
		else if (this.buffs_has('rooked_recovery')){
			var actual_max = this.metabolics_calc_max(level, true);
			return actual_max / 2;
		}
	}

	// If iMG is on, then our max is our max!
	if (this.metabolics_get_tank()){
		return this.metabolics_get_tank();
	}

	var max = 100;
	var counter = 0;
	var target = 5;
	var step = 10;

	for (var i=1; i<level; i++){

		max += step;

		counter++;
		if (counter == target){
			counter = 0;
			target++;
			step += 10;
		}
	}

	return max;
}

function metabolics_test(){

	for (var i=1; i<30; i++){

		var n = this.metabolics_calc_max(i);

		log.info('max energy',i,n);
	}

}


function metabolics_try_set(stat, val){
	if (this.metabolics[stat].top < val){
		val = this.metabolics[stat].top;
	}
	return val;
}

function metabolics_try_inc(stat, val){
	if (this.is_dead) return 0;
	if (this.buffs_has('super_pooped')) return 0;
	var remain = this.metabolics[stat].top - this.metabolics[stat].value;
	return val > remain ? remain : val;
}

function metabolics_try_dec(stat, val){
	if (this.is_dead) return 0;
	var cur = this.metabolics[stat].value;
	return val > cur ? cur : val;
}

function metabolics_get_max_energy(){
	this.metabolics_init();
	return this.metabolics.energy.top;
}

function metabolics_get_max_mood(){
	this.metabolics_init();
	return this.metabolics.mood.top;
}

function metabolics_get_tank(){
	return this.metabolics.tank;
}

function metabolics_set_tank(tank){
	this.metabolics.tank = tank;
}