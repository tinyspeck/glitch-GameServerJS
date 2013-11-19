function canPickup(pc, drop_stack){
	if (this.getContainerType() == 'street' && this.container.pols_is_pol()){
		if (this.container.pols_is_owner(pc)) { 
			return {ok: 1};
		}
		else {
			return {ok: 0};
		}
	}

	return {ok: 1};
}

function canDrop(pc, drop_stack){
	return {ok: 0};
}

function icon_place_conditions(pc, drop_stack){
	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)){
		return {state:null};
	}

	return {state:'enabled'};
}

function icon_place(pc, msg, suppress_activity){
	if (pc.location.pols_is_pol() == false) {

		pc.prompts_add({
			is_modal : true,
			txt		: 'If you place this icon here, it can be picked up by anyone. Proceed?',
			choices		: [
				{ value : 'yes', label : 'Yes' },
				{ value : 'no', label : 'No' },
			],
			escape_value: 'no',
			callback	: 'prompts_itemstack_modal_callback',
			itemstack_tsid: this.tsid
		});

	}
	else {
		return this.takeable_drop(pc, msg);
	}



	return true;
}

function icon_ruminate_conditions(pc, drop_stack){
	if (this.container.is_bag || this.container.pols_is_pol()){
		if (!this.canUse(pc, 'ruminate')) {
			return {state:'disabled', reason: "You've already ruminated on an Icon of "+capitalize(this.get_giant())+" today."};
		}

		if (this.getInstanceProp('actions_remaining') <= 0) { 
			var effects = this.icon_tithe_effects(pc);
			return {state:'disabled', reason:"This Icon requires a tithe of "+effects.cost+" currants to become operational."}; 
		}

		return {state:'enabled'};
	}
	else {
		return {state:null};
	}
}

function icon_ruminate(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];


	var upper = 100;
	var lower = 25;

	var level = pc.stats_get_level();
	if (level > 20) {
		upper += (level-20)*20; 
		lower += (level-20)*5;
	}


	var amount = randInt(lower, upper);

	// Most recent person to tithe gets a double bonus
	if (pc == this.tither) {
		amount = amount * 2;
		this.tither = null;
	}
	else if (pc.skills_has('piety_1')) {
		amount = 1.2 * amount;
	}

	var val = pc.metabolics_add_mood(amount);
	if (val){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: val
		});
	}

	this.use(pc, 'ruminate');

	var pre_msg = this.buildVerbMessage(msg.count, 'ruminate', 'ruminated on', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	pc.location.cultivation_add_img_rewards(pc, 10);

	return failed ? false : true;
}

function icon_revere_conditions(pc, drop_stack){
	if (this.container.is_bag || this.container.pols_is_pol()){
		if (!this.canUse(pc, 'revere')) {
			return {state:'disabled', reason: "You've already revered an Icon of "+capitalize(this.get_giant())+" today."};
		}

		if (this.getInstanceProp('actions_remaining') <= 0) { 
			var effects = this.icon_tithe_effects(pc);
			return {state:'disabled', reason:"This Icon requires a tithe of "+effects.cost+" currants to become operational."}; 
		}

		return {state:'enabled'};
	}
	else {
		return {state:null};
	}
}

function icon_revere(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var upper = 100;
	var lower = 25;

	var level = pc.stats_get_level();
	if (level > 20) {
		upper += (level-20)*20; 
		lower += (level-20)*5;
	}

	var amount = randInt(lower, upper);

	// Most recent person to tithe gets a double bonus
	if (pc == this.tither) {
		amount = amount * 2;
		this.tither = null;
	}
	else if (pc.skills_has('piety_1')) {
		amount = 1.2 * amount;
	}

	var val =  pc.metabolics_add_energy(amount);
	if (val){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "energy",
			"value"	: val
		});
	}

	this.use(pc, 'revere');


	var pre_msg = this.buildVerbMessage(msg.count, 'revere', 'revered', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	pc.location.cultivation_add_img_rewards(pc, 10);

	return failed ? false : true;
}

function icon_reflect_conditions(pc, drop_stack){
	if (this.container.is_bag || this.container.pols_is_pol()){
		if (!this.canUse(pc, 'reflect')) {
			return {state:'disabled', reason: "You've already reflected on an Icon of "+capitalize(this.get_giant())+" today."};
		}

		if (this.getInstanceProp('actions_remaining') <= 0) { 
			var effects = this.icon_tithe_effects(pc);
			return {state:'disabled', reason:"This Icon requires a tithe of "+effects.cost+" currants to become operational."}; 
		}

		return {state:'enabled'};
	}
	else {
		return {state:null};
	}
}

function icon_reflect(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var upper = 100;
	var lower = 25;

	var level = pc.stats_get_level();
	if (level > 20) {
		upper += (level-20)*20; 
		lower += (level-20)*5;
	}
	var amount = randInt(lower, upper);

	// Most recent person to tithe gets a double bonus
	if (pc == this.tither) {
		amount = amount * 2;
		this.tither = null;
	}
	else if (pc.skills_has('piety_1')) {
		amount = 1.2 * amount;
	}

	var context = {};
	context['icon'] = this.class_id;
	context['from'] = "reflect";
	
	var val = pc.stats_add_xp(amount, false, context);
	if (val){
		self_effects.push({
			"type"	: "xp_give",
			"which"	: "",
			"value"	: val
		});
	}

	this.use(pc, 'reflect');

	var pre_msg = this.buildVerbMessage(msg.count, 'reflect', 'reflected on', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	pc.location.cultivation_add_img_rewards(pc, 10);

	return failed ? false : true;
}

function icon_tithe_conditions(pc, drop_stack){
	if (this.instanceProps.actions_remaining > 10) { 
		return {state:'disabled', reason:'This Icon does not require a tithe.'};
	}

	if (pc.stats_get_level() < 5) { 
		return {state:'disabled', reason:"Only the truly penitent Glitch may tithe. Come back in a few levels."}
	}

	var cost = this.icon_tithe_cost(pc);
	if (!pc.stats_has_currants(cost)) {
		return {state:'disabled', reason:"You need "+cost+" currants to tithe!"}
	}

	return {state:'enabled'};
}

function icon_tithe_cost(pc) { 
	var level = pc.stats_get_level();
	var cost = 121;

	if (level > 20) { 
		cost += (level-20)*33;
	} 
	
	if (pc.imagination_has_upgrade("icon_tithe_4")) {
		cost -= (cost * .2);
	}
	else if (pc.imagination_has_upgrade("icon_tithe_3")) {
		cost -= (cost * .1);
	}
	else if (pc.imagination_has_upgrade("icon_tithe_2")) { 
		cost -= (cost * .05);
	}
	else if (pc.imagination_has_upgrade("icon_tithe_1")) { 
		cost -= (cost * .03);
	}
	
	return Math.round(cost);
}

function icon_tithe_effects(pc){
	var effects = {};

	effects.cost = this.icon_tithe_cost(pc);

	return effects;
}

function icon_tithe(pc, msg, suppress_activity){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var cost = this.icon_tithe_cost(pc);

	var giant = this.get_giant();
	if (pc.stats_try_remove_currants(cost)) {

		var actions = intval(this.getInstanceProp("actions_remaining"));
		
		if (actions <= 10) {
			actions += 5;
			this.setInstanceProp("actions_remaining", actions);
			self_msgs.push("Your generous donation will contribute to the upkeep of the Icon.");
		}

		this.tither = pc;
	}
	else { 
		failed = true;
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'tithe', 'tithed '+cost+' currants to', failed, self_msgs, self_effects, they_effects);
	if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

	pc.location.cultivation_add_img_rewards(pc, 10);
	
	return failed ? false : true;
}

function canBestow(pc, delay_time){
	if (pc.achievements_place_time_ago_enough('bestowment_check', this.get_giant(), delay_time)) {
		return true;
	}
		
	return false;

	// Having different behaviour outside of POLs was proposed, but we decided against it:
	/*else {
		// In public streets:
		var can_bestow = true;
		var num_giants = config.giants.length;
		for (var i = 0; i < num_giants; ++i) {
			if (pc.achievements_place_time_ago_enough('bestowment_check', config.giants[i], delay_time) == false) {
				can_bestow = false;
			}
		}

		return can_bestow;
	} */
}

function canUse(pc, verb){
	if (pc.achievements_get_daily_label_count(this.class_tsid, verb) > 0) return false;

	return true;
}

function doPlayerResponse(pc){
	var testing = (this.getInstanceProp('testing') == 1);

	// Only allow one bestowment check per minute per giant per player, 
	// and one tithe message per minute per giant per player.

	var giant = this.get_giant();

	var delay_time = 60;

	if (testing) { 
		delay_time = 6;
	}

	if (this.getInstanceProp('actions_remaining') <= 0) { 

		if (pc.achievements_place_time_ago_enough('tithe_request', giant, delay_time)) {
			this.sendBubble('A tithe is due. Insert currants to continue.');
			pc.achievements_set_place_time_now('tithe_request', giant);
		}	
	}
	else if (this.canBestow(pc, delay_time)) {

		pc.achievements_set_place_time_now('bestowment_check', giant);

			// Ok, we can do a bestowment.
			
			var chance = 5; // default is 5 out of 100
			
			if (pc.imagination_has_upgrade("icon_bestow_chance_3")) { 
				chance = 6.5;
			}
			else if (pc.imagination_has_upgrade("icon_bestow_chance_2")) { 	
				chance = 6;
			}
			else if (pc.imagination_has_upgrade("icon_bestow_chance_1")) { 
				chance = 5.5;
			}

			// Multiply everything by 10 so .5s work.
			var die_roll = randInt(1, 1000); 
			if (die_roll <= (10*chance) || testing) {
				// passed! we get a bestowment!

				var has_piety = pc.skills_has('piety_1');  // piety gives a bonus

				var types = ['mood', 'energy'];

				types.push('xp');


				// Favor is only a possible reward if the player is not too close 
				// to the maximum favor with this giant.

				var favor_max = pc.stats_get_max_favor(giant);

				if (has_piety) { favor_max = favor_max - 20; }
				else { favor_max = favor_max - 10; }

				if (!pc.stats_has_favor_points(giant, favor_max)) {
					types.push('favor');
				}


				// Pick a random reward 
				var reward_type = randInt(0, types.length - 1);		
				

				if (types[reward_type] == 'xp') {

					var upper = 100;
					var lower = 50;

					var level = pc.stats_get_level();
					if (level > 20) {
						upper += (level-20)*20; 
						lower += (level-20)*5;
					}
					
					var amount = randInt(lower, upper);

					// Most recent person to tithe gets a double bonus
					if (pc == this.tither) {
						amount = amount * 2;
						this.tither = null;
					}
					else if (has_piety) {
						amount = 1.2 * amount;
					}

					this.showBonus(pc);
					
					var context = {};
					context['icon'] = this.class_id;
					context['from'] = "bestowment";
					amount = pc.stats_add_xp(amount, false, context);
					pc.sendActivity('The Icon of '+capitalize(giant)+' has bestowed '+amount+' iMG upon you.');
				}
				else if (types[reward_type] == 'mood') {
					var upper = 100;
					var lower = 50;

					var level = pc.stats_get_level();
					if (level > 20) {
						upper += (level-20)*20; 
						lower += (level-20)*5;
					}
					
					var amount = randInt(lower, upper);

					// Most recent person to tithe gets a double bonus
					if (pc == this.tither) {
						amount = amount * 2;
						this.tither = null;
					}
					else if (has_piety) { 
						amount = 1.2 * amount;
					}
					
					this.showBonus(pc);
					amount = pc.metabolics_add_mood(amount);
					if (amount > 0) {
						pc.sendActivity('The Icon of '+capitalize(giant)+' has bestowed '+amount+' mood upon you.');
					}
					else {
						pc.sendActivity('The Icon of '+capitalize(giant)+' tried to bestow mood upon you, but you didn\'t need any.');
					}
				}
				else if (types[reward_type] == 'energy') {
					var upper = 100;
					var lower = 50;

					var level = pc.stats_get_level();
					if (level > 20) {
						upper += (level-20)*20; 
						lower += (level-20)*5;
					}
					
					var amount = randInt(lower, upper);

					// Most recent person to tithe gets a double bonus
					if (pc == this.tither) {
						amount = amount * 2;
						this.tither = null;
					}
					else if (has_piety) {
						amount = 1.2 * amount;
					}				

					this.showBonus(pc);
					amount = pc.metabolics_add_energy(amount);
					if (amount > 0) {
						pc.sendActivity('The Icon of '+capitalize(giant)+' has bestowed '+amount+' energy upon you.');
					}
					else {
						pc.sendActivity('The Icon of '+capitalize(giant)+' tried to bestow energy upon you, but you didn\'t need any.');
					}
				}
				else if (types[reward_type] == 'favor') {
					// Favor
					var amount = 25;

					var level = pc.stats_get_level();
					if (level > 20) {
						amount += 5 * level;
					}
					
					// Most recent person to tithe gets a double bonus
					if (pc == this.tither) {
						amount = amount * 2;
						this.tither = null;
					}
					else if (has_piety) { 
						amount = amount * 1.2; 
					}

					if (giant == 'tii') {
						amount = pc.stats_add_favor_points('ti', amount);
					}
					else {
						amount = pc.stats_add_favor_points(giant, amount); 
					}

					this.showBonus(pc);
					pc.sendActivity('The Icon of '+capitalize(giant)+' has bestowed '+amount+' favor upon you.');
				}
				else {
					// It's not possible to get here.
					pc.sendActivity('We\'re sorry. An unexpected anomaly has occurred. If your universe hasn\'t spontaneously imploded, please report a bug. ('+reward_type+')');
					//pc.sendActivity('types: '+types + ' '+types[reward_type]);
				}
			}
	}
}

function get_giant(){
	return this.class_tsid.replace('icon_', '');
}

function modal_callback(pc, value, details){
	if (value == 'yes') {
		return this.takeable_drop(pc, null);
	}
}

function onPlayerCollision(pc){
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
log.info('convo: '+conversations[i]);
			if (pc.conversations_offer(this, conversations[i])){
log.info('can offer');
				return pc.conversations_offer_bubble(this);
			}
		}
	}
	
	this.doPlayerResponse(pc);
}

function placeCallback(pc, msg){
	if (!this.takeable_drop(pc)) return false;

	return true;
}

function showBonus(pc){
	pc.announce_sound('ICON_GIANT_LOVE');
	pc.apiSendAnnouncement({
		uid: 'icon_bestow',
		type: "pc_overlay",
		pc_tsid: pc.tsid,
		swf_url: pc.overlay_key_to_url('icon_giant_love'),
		duration: 3250,
		locking: false,
		dismissible: false,
		delta_x: 0,
		delta_y: -30,
		width: 300,
		height: 300
	});
}

function use(pc, verb){
	// Update actions remaining
	if (!this.instanceProps || this.instanceProps.actions_remaining == undefined){
		this.initInstanceProps();
	}

	if (this.getClassProp('actions_capacity') == 0) return false;

	this.instanceProps.actions_remaining = intval(this.instanceProps.actions_remaining) - 1;

	// Update achievements counter
	pc.achievements_increment_daily(this.class_tsid, verb, 1);


	return true;
}
