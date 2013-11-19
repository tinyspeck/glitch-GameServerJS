var is_food = 1;

function food_eat_conditions(pc, drop_stack){
	if (pc.location.is_newxp && this.class_tsid == 'egg_plain'){
		return {state:null};
	}

	if (this.food_gives_bonus(pc) === "none"){
		if (this.getClassProp('is_herb')){
			return {state: null};
		}

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		if (pc.isOverDailyFoodLimit()){
			return {state: 'disabled', reason: "You can't eat anymore food today."};
		}

		if (pc.metabolics_get_percentage('energy') == 100){
			return {state: 'disabled', reason: "You already have full energy."};
		}
		
		return {state: 'enabled'};
	}

	return {state: null};
}

function food_eat_conditions_img(pc, drop_stack, which){
	var bonus_type = this.food_gives_bonus(pc);
	
	if (config.is_dev) log.info("FOOD: bonus type should be "+which+" and is "+bonus_type);

	if (bonus_type == which){
		
		if (this.getClassProp('is_herb')){
			return {state: null};
		}

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		if (pc.isOverDailyFoodLimit()){
			return {state: 'disabled', reason: "You can't eat anymore food today."};
		}

		if (pc.metabolics_get_percentage('energy') == 100){
			return {state: 'disabled', reason: "You already have full energy."};
		}
			
		return {state: 'enabled'};
	}
	
	return {state: null};
}

// For testing: subtracts 1 day from all timestamps.
function food_bonus_subtract_day(pc){
	if (!pc.food_history)  return;
	
	for (var i in pc.food_history.list){
		pc.food_history.list[i] = pc.food_history.list[i] -  game_days_to_ms(1);
	}
}

// Check what type of food variety bonus, if any, a particular food gives.
// Possible return values are "none", "week", "month". (That's a game week and a game month.)
// Creates the food_history list if it doesn't exist
function food_gives_bonus(pc) {
	if (!pc.food_history){
		pc.food_history = apiNewOwnedDC(pc);
		pc.food_history.list = {};
	}
	
	if (!pc.imagination_has_upgrade("food_variety_bonus")){
		return "none";
	}
	
	if (!this.hasTag("foodbonus")){
		return "none";
	}
	
	if (pc.food_history.list[this.class_tsid]){
		var days = game_days_since_ts(pc.food_history.list[this.class_tsid]);
		
		if (days > 30){
			return "month"; // one "rolling game month" = 5 real days
		}
		
		if (days > 1){
			return "day"; // one "rolling game day" = 4 real hours
		}
		
		return "none";
	}
	else {
		return "month";
	}
}

function food_eat(pc, msg, suppress_activity){
	var energy_needed = pc.metabolics.energy.top - pc.metabolics.energy.value;
	var food_needed = Math.ceil(energy_needed / Math.round(this.base_cost * floatval(this.classProps.energy_factor)));

	var item, count;
	if (food_needed >= msg.count){
		item = this;
		count = msg.count;
	}
	else{
		item = this.apiSplit(food_needed);
		count = food_needed;
	}

	var self_msgs = [];
	var self_effects = [];

	// just using base cost for now
	var energy_gain = Math.round(count * this.base_cost * floatval(this.classProps.energy_factor));
	var val = pc.metabolics_add_energy(energy_gain);
	if (val){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "energy",
			"value"	: val
		});

		var energy_gain_single = Math.round(this.base_cost * floatval(this.classProps.energy_factor));
		var bonus_type = this.food_gives_bonus(pc);
		
		var bonus = 0;
		if (bonus_type === "day"){
			bonus = Math.round(energy_gain_single/4) * count;
		}
		else if (bonus_type === "month"){
			bonus = Math.round(energy_gain_single/2) * count;
		}
		
		if (bonus > 0){
			self_msgs.push("Eating a variety of foods helps you think!");
			var bval = pc.stats_add_xp(bonus, true, {'verb':'eat', 'class_id':this.class_tsid});
			if (bval) { // this should always pass
				self_effects.push({
					"type": "xp_give",
					"value": bval
				});
			}
		}
		
		pc.food_history.list[this.class_tsid] = getTime();
		
		if (!pc.food_today) pc.food_today = 0;
		pc.food_today += val;

		if (pc.isOverDailyFoodLimit()){
			var tomorrow = timestamp_to_gametime(time()+ (game_days_to_ms(1)/1000));
			tomorrow[3] = 0;
			tomorrow[4] = 0;
			
			var remaining = gametime_to_timestamp(tomorrow) - time();
			pc.buffs_apply('stuffed', {duration: remaining});
		}
		else if (pc.getDailyFoodPercentage() >= 75){
			pc.prompts_add({
				txt		: "You are getting quite full and won’t be able to eat much more today.",
				icon_buttons	: false,
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}
		else if (pc.getDailyFoodPercentage() >= 50){
			pc.prompts_add({
				txt		: "You are starting to feel kinda full.",
				icon_buttons	: false,
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}
	}

	if (!suppress_activity) pc.sendActivity(buildVerbMessage(count, 'eat', 'ate', 0, self_msgs, self_effects, {}));
	pc.announce_sound('ITEM_EAT');

	if ((this.base_cost * count) > 10) {
		// Do not count small things like single cherries as a "meal".
		// Each eat action counts as a separate meal.
		pc.achievements_increment('meals_eaten', this.class_tsid);
	}

	if (pc.location.eventFired){
		pc.location.eventFired('items_eaten', pc, {class_tsid:this.class_tsid, count:msg.count});
	}
	
	pc.achievements_increment('items_eaten', this.class_tsid, count);

	if (this.onEat) this.onEat(pc, msg);

	item.apiDelete();

	msg.count = count;
	return true;
}

function food_eat_effects(pc){
	if (pc.knowsAboutEnergy()){
	
		var energy_gain = Math.round(this.base_cost * floatval(this.classProps.energy_factor));
		var bonus_type = this.food_gives_bonus(pc);
		
		var bonus = 0;
		if (bonus_type === "day"){
			bonus = Math.round(energy_gain/4);
		}
		else if (bonus_type === "month"){
			bonus = Math.round(energy_gain/2);
		}
		
		return {
			energy: energy_gain,
			img: bonus
		};
	}
}

function food_eat_tooltip(pc){
	if (pc.knowsAboutEnergy()){
		var energy_needed = pc.metabolics.energy.top - pc.metabolics.energy.value;
		var energy_gain = Math.round(this.base_cost * floatval(this.classProps.energy_factor));

		var gain = energy_gain > energy_needed ? energy_needed : energy_gain;

		var bonus_type = this.food_gives_bonus(pc);
		
		var bonus = 0;
		if (bonus_type === "day"){
			bonus = Math.round(0.25 * energy_gain);
		}
		else if (bonus_type === "month"){
			bonus = Math.round(0.5 * energy_gain);
		}
		
		var txt = "Eating gives "+gain+" energy";
		
		if (bonus > 0){
			txt += " and "+bonus+" iMG";
		}
		
		return txt;
	}
	else{
		return "Yum!";
	}
}