function drink_get_tooltip(pc, verb, effects){
	if (effects.mood && effects.energy){
		return utils.substitute("Gives $mood mood & $energy energy", effects);
	}

	if (effects.mood){
		return utils.substitute("Gives $mood mood", effects);
	}

	if (effects.energy){
		return utils.substitute("Gives $energy energy", effects);
	}

	return "Gives you nothing useful";
}

function drink_effects(pc){
	var effects = {};

	effects.mood = intval(this.classProps.drink_mood);
	effects.mood_cost = 0 - effects.mood;

	effects.energy = intval(this.classProps.drink_energy);
	effects.energy_cost = 0 - effects.energy;

	if (!pc.location.is_newxp) effects.xp = intval(this.classProps.drink_xp);

	return effects;
}

function drink_drink(pc, msg, suppress_activity){
	if (pc.location.is_newxp && pc.location.newxp_stage == 'newxp_training2' && pc.location.isStepBefore(pc.location.current_step, 'dustbunny_drink3')){
		pc.sendActivity("You can\'t drink this yet.");
		msg.count = 0;
		return false;
	}

	if (pc.metabolics_get_percentage('mood') == 100 && this.classProps.drink_mood > 0){
		pc.sendActivity("You tried to drink "+this.formatStack(msg.count)+", but you're already in a perfectly good mood, so then you didn't do it.");
		msg.count = 0;
		return false;
	}

	var drink_needed = 0;
	if (this.classProps.drink_mood != 0){ 
		var mood_needed = pc.metabolics.mood.top - pc.metabolics.mood.value;
		drink_needed = Math.ceil(mood_needed / this.classProps.drink_mood);
	}

	var item, count;
	if (drink_needed <= 0 || drink_needed >= msg.count){
		item = this;
		count = msg.count;
	}
	else{
		item = this.apiSplit(drink_needed);
		count = drink_needed;
	}

	var self_msgs = [];
	var self_effects = [];
	var val;

	// Mood effect
	if (this.classProps.drink_mood > 0){
		val = pc.metabolics_add_mood(count * this.classProps.drink_mood);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
	}
	else if (this.classProps.drink_mood < 0){
		val = pc.metabolics_lose_mood(count * Math.abs(this.classProps.drink_mood));
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
	}

	// Energy effect
	if (this.classProps.drink_energy > 0){
		val = pc.metabolics_add_energy(count * this.classProps.drink_energy);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "energy",
				"value"	: val
			});
		}
	}
	else if (this.classProps.drink_energy < 0){
		val = pc.metabolics_lose_energy(count * Math.abs(this.classProps.drink_energy));
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
	}

	// XP effect
	if (this.classProps.drink_xp > 0 && !pc.location.is_newxp){
		var context = {'verb':'drink', 'class_id':this.class_tsid};
		val = pc.stats_add_xp(count * this.classProps.drink_xp, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: val
			});
		}
	}

	pc.sendActivity(buildVerbMessage(count, 'drink', 'drank', 0, self_msgs, self_effects, {}));
	pc.announce_sound('ITEM_DRINK');

	pc.achievements_increment('items_drank', this.class_tsid, count);
	if (this.hasTag('alcohol')){
		pc.achievements_increment('items_drank', 'alcohol', count);
	}
	
	if (pc.location.eventFired){
		pc.location.eventFired('items_drank', pc, {class_tsid:this.class_tsid, count:msg.count});
	}

	if (this.onDrink) this.onDrink(pc, msg);

	item.apiDelete();

	msg.count = count;

	return true;
}