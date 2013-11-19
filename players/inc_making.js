
function making_init(){

	//
	// recipe container
	//

	if (this.recipes === undefined || this.recipes === null){
		this.recipes = apiNewOwnedDC(this);
		this.recipes.label = 'Recipes';
		this.recipes.recipes = {};
	}
	
	if (!this.making){
		this.making = {}; // the making async block
	}
	
	if (!this.making_queue) {
		this.making_queue = [];
	}
}

function making_reset(){

	if (this.recipes) this.recipes.recipes = {};
	this.making = {};
	this.making_queue = [];
}

function making_delete(){

	if (this.recipes){
		this.recipes.apiDelete();
		delete this.recipes;
	}
	delete this.making;
	delete this.making_queue;
}


function making_can_use(item, verb){
	
	// working item
	if (item.isWorking && !item.isWorking()) return 0;

	// Not making something else
	if (this.making_is_making()) return 0;

	// Not in deco mode
	if (this['!in_house_deco_mode']) return 0;

	var skill = this.making_required_skill(item, verb);
	
	// No skill required
	if (!skill) return 1;
	
	// player has skill
	if (skill && this.skills_has(skill)){
		return 1;
	}

	return 0;
}

function making_required_skill(item, verb){
	
	// Transmogrification tools are useable without skill
	if (item.getClassProp('making_type') == 'transmogrification') return null;
	
	// What skill do we say we need?
	var skill = item.getClassProp('required_skill');
	if (this.skills_get_name(skill)){
		// Skill exists!
		return skill;	
	}
	
	return null;
}

function making_check_allowed(item, verb){

	if (this.making_can_use(item, verb)){
		return {state:'enabled'};
	}
	else{
		if (this.making_is_making()){
			return {state:'disabled', reason:"You are making something else."};
		}

		if (this['!in_house_deco_mode']){
			return {state:'disabled', reason:"No making while decorating."};
		}

		var skill = this.making_required_skill(item, verb);
		if (!this.skills_has(skill)){
			return {state:'disabled', reason:"You need to know "+this.skills_get_name(skill)+" to use this."};
		}
		
		// working item
		if (item.isWorking && !item.isWorking()){
			if (item.getClassProp('making_type') == 'machine'){
				return {state:'disabled', reason:"This "+item.name_single+" does not have enough fuel remaining."};
			}
			else{
				return {state:'disabled', reason:"This "+item.name_single+" has become broken, and must be repaired."};
			}
		}
	}
}

//
// this function sends a message to the client to open the making interface.
// we need to send the slot count, list of known recipes & any other info.
//

function making_open_interface(item, verb){

	var making_info = item.verbs[verb].making;

	// ask the tool itself if it's useable, like to
	// check they have at least one of the needed skills...
	if (item.verbs[verb].conditions){
		var ret = item.verbs[verb].conditions.call(item, this);
		if (ret.state != 'enabled'){
			if (ret.reason){
				this.sendActivity(ret.reason);
			}
			else{
				this.sendActivity("You don't know how to use that!");
			}
			return false;
		}
	}

	var out = {
		type: 'making_start',
		item_class: item.class_id,
		item_tsid: item.tsid,
		verb: verb,
		slots : making_info.slots,
		knowns : {},
		unknowns : {},
		can_discover: making_info.can_discover,
		specify_quantities: making_info.specify_quantities ? true : false,
	};

	if (item.getClassProp('making_type') == 'machine'){
		out.no_modal = true;
		out.fuel_remaining = item.getInstanceProp('fuel_level');
	}

	// get the list of known/unknown recipes for this tool
	var ret = this.making_get_recipes(item, verb);
	
	var task_limit_multiplier = this.get_task_limit_multiplier(item);
	
	if (task_limit_multiplier != 1.0){
		for (var i in ret.knowns){
			ret.knowns[i].task_limit = Math.round(ret.knowns[i].task_limit * task_limit_multiplier);
		}
		for (var i in ret.unknowns){
			ret.unknowns[i].task_limit = Math.round(ret.unknowns[i].task_limit * task_limit_multiplier);
		}
	}
	
	out.knowns = ret.knowns;
	out.unknowns = ret.unknowns;
	
	// adjust energy costs for skills
	var knowns = out.knowns;
	for (var recipe in knowns) {
		var costs = this.computeEnergyAndTimeCost(knowns[recipe], item, 1, verb);
		knowns[recipe].energy_cost = costs.energy_cost;
	}
	
	this.apiSendMsgAsIs(out);
	
	return true;
}

// Compute actual energy required based on skills, so we can send it to the client.
// Was originally in making_make_known.
function computeEnergyAndTimeCost(recipe, item, count, verb) {
	//
	// make skill-based adjustments
	//
	var wait_time = count * intval(recipe.wait_ms);
	var energy_cost = recipe.energy_cost;
	if (item.getClassProp('making_type') == 'cooking'){
	
		//log.info('Running cooking adjustments');
		// time: adjust all recipes to 3secs from 2secs; then, having L2 of a cooking skill reduces time to make by 50% for all recipes with that tool (so, 1.5s): 
		// we will manually adjust some recipes higher or lower later (probably adjusting all recipes granted for L2 or L3 of a cooking skill to 4 secs, so they take slightly longer
		// energy cost: with L2 of a cooking skill, energy cost for all recipes for that tool should be reduced by 20% (and in the one case of an L3 skill, 
		// energy cost for all recipes with that tool reduced by 30%)
		
		var skill = this.making_required_skill(item, verb);
		if (skill){
			//log.info('Cooking skill is: '+skill);
			
			var highest_level = this.skills_get_highest_level(skill);
			//log.info('Highest level is: '+highest_level);
			if (highest_level >= 2){
				wait_time *= 0.5;
				//log.info('Adjusting making time by half');
			}
			
			if (highest_level >= 3){
				energy_cost = Math.round(energy_cost * 0.67);
				//log.info('Adjusting energy cost by 30%');
			}
			else if (highest_level >= 2){
				energy_cost = Math.round(energy_cost * 0.5);
				//log.info('Adjusting energy cost by 20%');
			}
		}
	}
	else if (item.getClassProp('making_type') == 'transmogrification'){
		var wait_time = this.making_get_transmogrification_time(count) * 1000;
		
		if (!this.skills_has(item.getClassProp('required_skill'))){
			// You should be able to use any of the transmogrification tools without a skill:
			// 20% of the time you should fail, taking a flat penalty of 2 energy and 2 mood, regardless of recipe or quantity
			// recipe time should be increased by 50% and energy cost should be increased by 25%

			wait_time *= 2;
			energy_cost = Math.round(energy_cost * 1.25);
		}
	}
	else if (item.getClassProp('making_type') == 'machine'){
		wait_time += 2200; // Extra time for the animations
	}
	
	energy_cost = energy_cost * count;
	
	var ret = {};
	ret['energy_cost'] = energy_cost;
	ret['wait_time'] = wait_time;
	
	return ret;
}

//
// this function allows the player to activate a known recipe a nunber
// of times.
//

function making_make_known(msg, item){

	var recipe_id = msg.recipe;
	var count = msg.count;
	var verb = msg.verb;

	var making_info = item.verbs[verb].making;
	var recipe_info = get_recipe(recipe_id);


	// Check and see if the item is available
	if (item && item.canUse) {
		if (!item.canUse(this)) {
			log.info("make failed - machine already in use");
			this.sendActivity("This item is already in use!");
			return this.apiSendMsg(make_fail_rsp(msg, 0, "machine already in use"));			
		}
	}

	//
	// check that the recipe is known
	//

	if (!this.recipes.recipes[recipe_id] && item.getClassProp('making_type') != 'transmogrification' && !(recipe_id == 288 && isPiDay())){

		log.info("make failed - recipe not known "+recipe_id);
		return this.apiSendMsg(make_fail_rsp(msg, 0, "unknown recipe "+recipe_id));
	}


	//
	// check the recipe works with the item/verb
	//

	var found = 0;
	for (var i=0; i<making_info.recipes.length; i++){
		if (making_info.recipes[i] == recipe_id){
			found = 1;
			break;
		}
	}
	if (!found){
		log.info("make failed - recipe not supported by item");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "recipe not supported by item"));
	}


	// double check that we haven't gone into deco mode or something:
	var verb_state = this.making_check_allowed(item, "use");
	
	if (verb_state.state != "enabled") { 
		return this.apiSendMsg(make_fail_rsp(msg, 0, verb_state.reason));
	}
	
	//
	// check for the ingredients
	//

	if (item.getClassProp('making_type') == 'machine'){
		// If it's a machine, take the ingredients now instead of when we finish.
		if (!this.checkIngredients(recipe_info.inputs, count, true, item)){
			log.info("make failed - no ingredients");
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Not enough ingredients?"));
		}
	}
	else { 
		if (!this.checkIngredients(recipe_info.inputs, count, false, item)){
			log.info("make failed - no ingredients");
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Not enough ingredients?"));
		}
	}


	//
	// check we're not making already
	//

	if (this.making_is_making()){
		log.info("make failed - make in progress");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You are already making something"));
	}


	//
	// check we're not in deco mode
	//

	if (this['!in_house_deco_mode']){
		log.info("make failed - in deco mode");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "No making while decorating!"));
	}

		
	var costs = this.computeEnergyAndTimeCost(recipe_info, item, count, verb);
	var energy_cost = costs.energy_cost;
	var wait_time = costs.wait_time;

	//
	// make sure we have enough energy
	//

	if (energy_cost && energy_cost >= this.metabolics_get_energy()){
		log.info("make failed - not enough energy");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You don't have enough energy."));
	}
	

	//
	// Have enough uses?
	//
	
	var tool_uses = count * recipe_info.tool_wear;
	if (item.getClassProp('making_type') == 'machine'){
		for (var i in recipe_info.inputs){
			if (recipe_info.inputs[i][0] == 'fuel_cell'){
				tool_uses = recipe_info.inputs[i][1] * count;
				break;
			}
		}

		if (item.class_tsid == 'blockmaker'){
			if (this.imagination_has_upgrade('blockmaking_save_fuel_2')){
				tool_uses -= Math.round(tool_uses*0.40);
			}
			else if (this.imagination_has_upgrade('blockmaking_save_fuel_1')){
				tool_uses -= Math.round(tool_uses*0.20);
			}
		}
	}
	
	if (item.isWorking && !item.isWorking(tool_uses)){
		log.info("make failed - not enough tool usage");
		if (item.getClassProp('making_type') == 'machine'){
			return this.apiSendMsg(make_fail_rsp(msg, 0, "That machine doesn't have enough fuel left."));
		}
		else{
			return this.apiSendMsg(make_fail_rsp(msg, 0, "That tool doesn't have enough wear left."));
		}
	}
		

	//
	// activate timer
	//

	if (item.getClassProp('making_type') != 'machine'){
		var making = {
			wait: wait_time,
			known: 1,
			recipe: recipe_id,
			count: count,
			item: item,
			verb: verb,
			energy: energy_cost,
			started: intval(getTime())
		};
		var now = getTime();
		var then = ((now + wait_time));
		//log.info("Making: now is "+now+" and then is "+then);
		var queued = { time: then, making: making, type: "known" };
		if (!this.making_queue) { this.making_queue = []; }
		//log.info("Making adding to making queue "+this.making_queue+" for player "+this);
		this.making_queue.push(queued);
		//log.info("Making: queued non-machine "+making+" "+this.making_queue);
		//this.apiSetTimerX("finishMakingKnown", this.making.wait, null);
	}
	else { 
		var making = {
			wait: wait_time,
			known: 1,
			recipe: recipe_id,
			count: count,
			item: item,
			verb: verb,
			energy: energy_cost,
			started: intval(getTime())
		};
		var now = getTime();
		var then = ((now + wait_time));
		//log.info("Making: now is "+now+" and then is "+then);
		var queued = { time: then, making: making, type: "known" };
		if (!this.making_queue) { this.making_queue = []; }
		//log.info("Making adding to making queue "+this.making_queue+" for player "+this);
		this.making_queue.push(queued);
		//log.info("Making: queued machine "+making+" "+this.making_queue);
		//this.machines_making[item.tsid] = making;
		//this.apiSetTimerX("finishMakingKnown", this.making.wait, item.tsid);
	}
	
	if (item.getClassProp('making_type') == 'machine'){
		item.setAndBroadcastState('loadOpen');
		item.apiSetTimer('onLidClose', 1100);
		
		if (!item.isPlayingMusic || !item.isPlayingMusic(this)) {
			this.announce_sound_delayed('ACTIVE', 999, 0, 2);
		}
		item.setUser(this);
		
		var pc_action_distance = item.getClassProp('pc_action_distance');
		if (pc_action_distance === undefined) pc_action_distance = 150;
		var endpoint, face;
		if (item.x < this.x){
			endpoint = item.x+intval(pc_action_distance);
			face = 'left';
		}
		else{
			endpoint = item.x-intval(pc_action_distance);
			face = 'right';
		}
		
		
		// Move the player
		var distance = Math.abs(this.x-endpoint);
		this.moveAvatar(endpoint, this.y, face);
	}
	else{
		//log.info("Making is "+making);
		this.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: item.class_tsid,
			duration: making.wait,
			state: 'tool_animation',
			pc_tsid: this.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40
		}, this);
		
		this.announce_sound(item.class_tsid.toUpperCase(), 999);
	}
	
	// Schedule the finish making timer
	function makingSort(a, b){
		return  a['time'] - b['time'];
	};
	//log.info("Making queue is "+this.making_queue);
	this.making_queue.sort(makingSort);
	//log.info("Making sorted queue is "+this.making_queue);
	//log.info("Making queue start is "+this.making_queue[0]);
	//log.info("Making: time is "+this.making_queue[0]['time']+" and now is "+now+" and diff is "+(this.making_queue[0]['time']-now));
	
	//log.info("Making "+this +" has timer "+this.apiTimerExists("finishMakingKnown"));
	this.apiCancelTimer("finishMakingKnown");
	this.apiSetTimerX("finishMakingKnown", this.making_queue[0]['time'] - now, this.making_queue[0]['making']);
	if (item.onMakingStart) item.onMakingStart(this, recipe_id, count, wait_time);
	//log.info("Making "+this +" set timer for  "+this.making_queue[0]['time'] - now);
	
	//
	// return
	//

	var rsp = make_rsp(msg);
	rsp.success = true;
	rsp.wait = wait_time;
	rsp.no_modal = item.getClassProp('making_type') == 'machine';

	//log.info("async make started - waiting "+this.making.wait+" ms");
	return this.apiSendMsg(rsp);
}


function making_get_transmogrification_time(count){
	
	var wait_time = 0;
	var remaining = count;
	
	//* From 1 to 5 fruit - 2 sec per fruit
	if (remaining < 5){
		return wait_time + (remaining * 2);
	}
	else{
		wait_time += 5 * 2;
		remaining -= 5;
	}
	
	//* From 6 to 10 fruit - 1 sec per fruit
	if (remaining < 5){
		return wait_time + (remaining * 1);
	}
	else{
		wait_time += 5 * 1;
		remaining -= 5;
	}
	
	//* 11-20 - 0.5 sec
	if (remaining < 10){
		return wait_time + (remaining * 0.5);
	}
	else{
		wait_time += 10 * 0.5;
		remaining -= 10;
	}
	
	//* 21-50 - 0.2 sec
	if (remaining < 30){
		return wait_time + (remaining * 0.2);
	}
	else{
		wait_time += 30 * 0.2;
		remaining -= 30;
	}
	
	//* 51+ - 0.1 sec
	return wait_time + (remaining * 0.1);
}


//
// this function allows the player to experiment with possible
// recipes.
//

function tryToMake(msg, item){

	var inputs = msg.inputs;
	var verb = msg.verb;
	var making_info = item.verbs[verb].making;

	// double check that we haven't gone into deco mode or something:
	var verb_state = this.making_check_allowed(item, "use");
	
	if (verb_state.state != "enabled") { 
		return this.apiSendMsg(make_fail_rsp(msg, 0, verb_state.reason));
	}
	
	
	//
	// check for the ingredients
	//

	if (item.getClassProp('making_type') == 'machine'){
		// If it's a machine (which it shouldn't be, here) then remove the ingredients up front.
		if (!this.checkIngredients(inputs, 1, true, item)){
			log.info("make failed - no ingredients");
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Not enough ingredients?"));
		}
	}
	else { 
		if (!this.checkIngredients(inputs, 1, false, item)){
			log.info("make failed - no ingredients");
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Not enough ingredients?"));
		}
	}


	//
	// check we're not making already
	//

	if (this.making_is_making()){
		log.info("make failed - make in progress");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You are already making something"));
	}


	//
	// check we're not in deco mode
	//

	if (this['!in_house_deco_mode']){
		log.info("make failed - in deco mode");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "No making while decorating!"));
	}


	//
	// activate timer
	//

	var wait_time = making_info.try_wait * 1000;
	var making = {
		wait: wait_time,
		unknown: 1,
		inputs: inputs,
		item: item,
		verb: verb,
		started: intval(getTime())
	};
	var now = getTime();
	var then = now + wait_time;
	var queued = { time: then, making: making, type: "unknown" };
	if (!this.making_queue) { this.making_queue = []; }
	this.making_queue.push(queued);
	//this.apiCancelTimer("finishMakingUnknown");
	//this.apiSetTimerX("finishMakingUnknown", this.making.wait, null);
		
	
	if (item.getClassProp('making_type') == 'machine'){
		item.setAndBroadcastState('loadOpen');
		item.apiSetTimer('onLidClose', 1100);

		this.announce_sound_delayed('ACTIVE', 999, 0, 2);
		item.setUser(this);

		var pc_action_distance = item.getClassProp('pc_action_distance');
		if (pc_action_distance === undefined) pc_action_distance = 150;
		var endpoint, face;
		if (item.x < this.x){
			endpoint = item.x+intval(pc_action_distance);
			face = 'left';
		}
		else{
			endpoint = item.x-intval(pc_action_distance);
			face = 'right';
		}
		
		
		// Move the player
		var distance = Math.abs(this.x-endpoint);
		this.moveAvatar(endpoint, this.y, face);
	}
	else{
		//log.info("Making is "+making);
		this.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: item.class_tsid,
			duration: making.wait,
			state: 'tool_animation',
			pc_tsid: this.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40
		}, this);
	}

	//this.announce_sound('MAKING_WAITING_COOKING', 999);
	this.announce_sound(item.class_tsid.toUpperCase(), 999);

	
	// Schedule the finish making timer
	function makingSort(a, b){
		return a['time'] - b['time'];
	};
	this.making_queue.sort(makingSort);
	this.apiCancelTimer("finishMakingUnknown");
	
	var when = this.making_queue[0]['time'] - now;
	
	if (when > 0) { 
		this.apiSetTimerX("finishMakingUnknown", when, this.making_queue[0]['making']);
	}
	else { 
		this.finishMakingUnknown(this.making_queue[0]['making']);
	}
	
	
	//
	// return
	//

	var rsp = make_rsp(msg);
	rsp.success = true;
	rsp.wait = making.wait;
	rsp.no_modal = item.getClassProp('making_type') == 'machine';

	//log.info("async make unknown started - waiting "+this.making.wait+" ms");
	return this.apiSendMsg(rsp);
}


//
// this function gets called when a known making action completes
//

function finishMakingKnown(inf){
	//log.info("Making finished making known");

	var info;
	if (!inf){
		info = this.making;
		this.making = {};
		log.error(this+" Making - this should never happen");
	}
	else{
		info = inf;
	}
	
	if (!info.item){
		log.error(this+" Making no item: "+info+" "+this.making+" "+this.making_queue);
	}
	
	var recipe_info = get_recipe(info.recipe);

	if (!info || !info.item){
		log.error(this+" Making bad info "+info);
		this.scheduleNextTimer(info);
		return;
	}
	
	//this.announce_sound_stop('MAKING_WAITING_COOKING');
	if (info.item.getClassProp('making_type') == 'machine'){
		if (!this.machinesRunning(info.item)) {
			this.announce_sound_stop('ACTIVE');
		}
	}
	else{
		this.announce_sound_stop(info.item.class_tsid.toUpperCase());
	}

	if (!info.known){
		this.scheduleNextTimer(info);
		if (info.item.onMakingFailed) info.item.onMakingFailed();
		return;
	}

	
	//
	// use the tool
	//
	
	if (info.item.use){
		var tool_uses = info.count * recipe_info.tool_wear;
		if (info.item.getClassProp('making_type') == 'machine'){
			for (var i in recipe_info.inputs){
				if (recipe_info.inputs[i][0] == 'fuel_cell'){
					tool_uses = recipe_info.inputs[i][1] * info.count;
					break;
				}
			}

			if (info.item.class_tsid == 'blockmaker'){
				if (this.imagination_has_upgrade('blockmaking_save_fuel_2')){
					tool_uses -= Math.round(tool_uses*0.40);
				}
				else if (this.imagination_has_upgrade('blockmaking_save_fuel_1')){
					tool_uses -= Math.round(tool_uses*0.20);
				}
			}
		}
		info.item.use(this, tool_uses);
	}
	
	
	if (info.item.getClassProp('making_type') == 'transmogrification' && !this.skills_has(info.item.getClassProp('required_skill'))){
		// You should be able to use any of the transmogrification tools without a skill:
		// 20% of the time you should fail, taking a flat penalty of 2 energy and 2 mood, regardless of recipe or quantity
		// recipe time should be increased by 50% and energy cost should be increased by 25%

		if (is_chance(0.20)){
			var msg = "<span class=\"making_error\">Well, that didn't work.</span><br />I suggest you get some more skillz! ";
			var energy = this.metabolics_lose_energy(2);
			var mood = this.metabolics_lose_mood(2);
			msg += "("+energy+" energy, "+mood+" mood)";
			this.announce_sound('CRAFTING_RESULT_NOTHING');

			if (info.item.onMakingFailed) info.item.onMakingFailed();

			this.scheduleNextTimer(info);
			
			return this.apiSendMsg(make_fail_msg("make_failed", 0, msg));
		}
	}


	//
	// make it!
	//

	var previously_known = this.making_get_known_recipes();
	
	var making_rewards = this.making_execute_recipe(info.recipe, info.count, info.energy, info.item);
	if (!making_rewards){

		if (info.item.getClassProp('making_type') == 'machine'){
			info.item.setAndBroadcastState('assembled');
		}

		if (info.item.onMakingFailed) info.item.onMakingFailed();

		this.scheduleNextTimer(info);
		
		log.info("async make failed - no ingredients: "+this+' for recipe '+recipe_info.name);
		return this.apiSendMsg(make_fail_msg("make_failed", 0, "<span class=\"making_error\">Hrmmm, that didn't work. Seems like you don't have all the necessary ingredients.</span>"));
	}
		
	if (info.item.getClassProp('making_type') == 'machine'){
		//log.info("Making finished, setting machine state for item "+info.item);
		//log.info("Making - state is now "+info.item.state);
		this.announce_sound('READY');
		info.item.callPlayer(this);
		info.item.setContents(this, making_rewards.outputs);
		info.item.broadcastStatus();

		// http://bugs.tinyspeck.com/8964
		this.location.cultivation_add_img_rewards(this, 7.0);
	}
	
	
	if (info.item.class_tsid == 'tinkertool'){
		if (this.imagination_has_upgrade("toolcrafting_bonus_tool")) {
			if (is_chance(.05) || this.buffs_has('max_luck')) { // 5% chance
				// assume we're only making one thing
				var output_class = recipe_info.outputs[0][0];
				var proto = apiFindItemPrototype(output_class);
				var value = proto.getBaseCost();
				
				var catalog = apiFindItemPrototype('catalog');
				var give_candidates = [];
				for(var i in catalog.class_tsids) {
					var candidate_class = catalog.class_tsids[i];
					
					if (	candidate_class === "emotional_bear"
						||  candidate_class === "firefly_jar"
						||  candidate_class === "random_kindness"
						||  candidate_class === "lips"
						||  candidate_class === "moon"
						) {
						continue; // not allowed!
					}
					
					var candidate_proto = apiFindItemPrototype(candidate_class);
					var candidate_value = candidate_proto.getBaseCost();
					if ( candidate_proto.hasTag("tool")
						&& !candidate_proto.hasTag("no_rube") // May apply to new tools that have not been released yet
						&& !candidate_proto.hasTag("potion")  // no potions! (redundant check)
						&& !candidate_proto.hasTag("deleted") // no deleted items 
						&& (candidate_value >= (.5*value)) && (candidate_value <= (2*value))) {
						give_candidates.push(candidate_class);
					}
				}
				
				log.info("IMG "+give_candidates);
				var gift = choose_one(give_candidates);
			}
		}
	}
	
	this.achievements_increment('making_known_recipe', info.recipe, info.count);
	this.achievements_increment('making_known_tool', info.item.class_id, info.count);
	this.achievements_increment('making_tool', info.item.class_id, info.count);
	if(info.item.getClassProp('making_type') == 'cooking') {
		for(var i = 0; i < recipe_info.outputs.length; i++) {
			this.achievements_increment('making_food', recipe_info.outputs[i][0], info.count);
		}
	}

	this.quests_made_recipe(info.recipe, info.count);


	//
	// send done message
	//

	//log.info('async make succeeded');
	var msg = "You made "+recipe_info.name+" (x"+info.count+") ";

	var effects = {
		"energy": (info.energy * -1),
		"xp": making_rewards.xp,
	};
	
	if (effects['energy']) { 
		msg += effects['energy'] + ' energy';
	}
	
	if (effects['xp']){
		if (effects['energy']) { msg += ', '};
		
		msg += '+' + effects['xp'] + ' iMG';
	}
	
	if (msg.length > 0) msg += '.';
	
	if (info.item.getClassProp('making_type') == 'machine'){
		if (info.item.container.pols_get_owner() != this) { 
			msg += " Make sure to pick up your stuff soon, or it might disappear!"
		}
	}
	
	if (making_rewards.msg) msg += (' '+making_rewards.msg);
	
	if (gift) {
		//log.info("IMG "+gift);
		var gift_proto = apiFindItemPrototype(gift);
		msg += " You took the extra parts and made "+gift_proto.article+" "+gift_proto.name_single+".";
		
		this.createItem(gift, 1);
	}
	
	this.sendActivity(msg);


	var knowns = {};
	for (var i in this.recipes.recipes){
		if (!previously_known[i]){
			var recipe = get_recipe(i);
			
			// Only recipes that match our current tool should be sent in knowns
			if (recipe.skill == recipe_info.skill || in_array_real(recipe_info.skill, recipe.skills)){
				knowns[i] = recipe;
			}
			effects['recipe_'+i] = recipe;
		}
	}
	
	if (info.item.getClassProp('making_type') != 'machine') {
		this.apiSendMsg({
			type: 'make_known_complete',
			knowns: knowns,
			effects: effects,
			over_xp_limit: making_rewards.over_xp_limit
		});
	}
	
	//log.info("Making: calling onMakingComplete "+info.item.onMakingComplete);
	if (info.item.onMakingComplete) info.item.onMakingComplete(this, info.recipe, info.count);
	
	this.scheduleNextTimer(info);
}

// Schedules the timer for the next thing in the making queue, and also removes the thing we just processed 
// from the queue.
function scheduleNextTimer(info) { 
	if (this.making_queue && this.making_queue.length > 0) { 
		if (info["item"]["tsid"] != this.making_queue[0]["making"]["item"]["tsid"]) { 
			log.error("Making mismatch "+info+" "+this.making_queue[0]["making"]);
		}
		
		for (var i in this.making_queue) { 
			if (this.making_queue[i] && this.making_queue[i]["making"]["item"]["tsid"] === info["item"]["tsid"]) { 
				if (i != 0) { 
					log.info("Making found the tsid at "+i+" in "+this.making_queue);
				}
				
				var start = this.making_queue.slice(0, i);
				var end = this.making_queue.slice(i+1, this.making_queue.length);
				
				this.making_queue = start.concat(end);
			}
		}
		
		// sort (it shouldn't need it, but let's be paranoid here)
		function makingSort(a, b){
			return  a['time'] - b['time'];
		};
	
		this.making_queue.sort(makingSort);
		
		//log.info("Making new queue is "+this.making_queue);
	}
	

	// Schedule next timer if necessary
	if (this.making_queue.length > 0) { 
		var type = this.making_queue[0]['type'];
		
		var when = this.making_queue[0]['time'] - getTime();
		
		if (type === "known") {
			this.apiCancelTimer("finishMakingKnown");
			//log.info("Making setting timer for "+this.making_queue[0]['time'] - getTime());
			
			if (when <= 0) { 
				this.finishMakingKnown(this.making_queue[0]['making']);
			}
			else { 
				this.apiSetTimerX("finishMakingKnown", when, this.making_queue[0]['making']);
			}
		}
		else if (type === "unknown") {
			this.apiCancelTimer("finishMakingUnknown");
			//log.info("Making setting timer for "+this.making_queue[0]['time'] - getTime());
			
			if (when <= 0) { 
				this.finishMakingUnknown(this.making_queue[0]['making']);
			}
			else { 
				this.apiSetTimerX("finishMakingUnknown", when, this.making_queue[0]['making']);
			}
		}
	}
}

//
// check to see if we have the needed ingredients for
// the given recipe. optionally remove them from the
// player's inventory.
//

function checkIngredients(inputs, count, remove, item){

	//
	// construct a list of [class, count] pairs
	//

	var find = [];
	for (var i=0; i<inputs.length; i++){
		var input = inputs[i];
		
		if (input[0] != 'fuel_cell' || item.getClassProp('making_type') != 'machine'){
			find.push([input[0], input[1] * count, input[2]]);
		}
	}

	//log.info("make list:", find);


	//
	// test/remove.
	// this has a race condition for removing items, but pc.items_destroy_multi()
	// is currently broken due to a bug in apiSplit() (actually caused by stacking too high)
	//

	for (var i=0; i<find.length; i++){

		// Consumable?
		if (find[i][2]){
			var has = 0;
			var stacks = this.get_stacks_by_class(find[i][0]);
			for (var s=0; s<stacks.length; s++){
				has += stacks[s].canConsume();
			}
			
			if (has < find[i][1]){
				log.info(this+' -- checkIngredients failed due to a missing '+find[i][0]+' ['+find[i][1]+']');
				return 0;
			}
		}
		else if (!this.checkItemsInBag(find[i][0], find[i][1])){
			log.info(this+' -- checkIngredients failed due to a missing '+find[i][0]+' ['+find[i][1]+']');
			return 0;
		}
	}

	if (remove){
		for (var i=0; i<find.length; i++){

			// Consumable?
			if (find[i][2]){
				var remaining = find[i][1];
				var stacks = this.get_stacks_by_class(find[i][0]);
				for (var s=0; s<stacks.length; s++){
					remaining = stacks[s].consume(remaining);
					if (!remaining) break;
				}
			}
			else{
				this.items_destroy(find[i][0], find[i][1]);
			}
		}
	}

	return 1;
}


//
// this function gets called when an unknown making action completes
//

function finishMakingUnknown(inf){

	var info;
	if (!inf){
		info = this.making;
		this.making = {};
		log.error(this+" Making - this should never happen");
	}
	else{
		info = inf;
	}

	if (!info.item){
		log.error(this+" Making no item: "+info+" "+this.making+" "+this.making_queue);
	}
	
	var recipe_info = get_recipe(info.recipe);

	if (!info || !info.item){
		log.error(this+" Making bad info "+info);
		this.scheduleNextTimer(info);
		return;
	}
	
	//this.announce_sound_stop('MAKING_WAITING_COOKING');
	this.announce_sound_stop(info.item.class_tsid.toUpperCase());
	if (!info.unknown) { 
		this.scheduleNextTimer(info);
		return;
	}

	var making_info = info.item.verbs[info.verb].making;
	

	//
	// use the tool
	//
	
	if (info.item.use){
		info.item.use(this);
	}


	//
	// find a recipe that matches..
	//

	//log.info("need to find a recipe that matches inputs", info.inputs);

	var match_id = this.makingFindBestMatch(info.inputs, making_info.recipes, making_info.specify_quantities);

	if (!match_id){
		this.achievements_increment('making_unknown_tool_fail', info.item.class_id);
		
		// 50% of the time you'll get all your ingredients back with a message like "Sorry that wasn't correct"
		// 50% of the time you'll lose all the ingredients but get 75% of the base cost of those ingredients as experience
		
		var msg = '<span class="making_error">That recipe didn\'t make anything!</span>';
		if (is_chance(0.5)){
		 	msg+= '<br />But, you got all your ingredients back at least.';
		} else {
			var xp = 0;
			for (var i=0; i<info.inputs.length; i++){
				var input = info.inputs[i][0];
				
				if (info.inputs[i][2]){
					// TODO: how do we give xp here!?
					var remaining = info.inputs[i][1];
					var stacks = this.get_stacks_by_class(input);
					for (var s=0; s<stacks.length; s++){
						remaining = stacks[s].consume(remaining);
						if (!remaining) break;
					}
				}
				else{
					var proto = apiFindItemPrototype(input);
					xp += (proto.base_cost * info.inputs[i][1]);
					this.items_destroy(input, info.inputs[i][1]);
				}
			}
			
			xp = Math.round(xp * 0.75);
			
			msg+= '<br />And wow, all of your ingredients were destroyed in the process.';
			if (xp){
				msg += '<br />That was a learning experience: +'+xp+' iMG';
			}
			msg += '.';
		}
		
		this.announce_sound('CRAFTING_RESULT_NOTHING');
		log.info('async make failed - no matching recipe');
		this.scheduleNextTimer(info);
		return this.apiSendMsg(make_fail_msg('make_failed', 0, msg));
	}
	

	var recipe_info = get_recipe(match_id);
	
	//
	// make sure we have enough energy
	//

	if (recipe_info.energy_cost && recipe_info.energy_cost >= this.metabolics_get_energy()){
		log.info("make failed - not enough energy");
		this.scheduleNextTimer(info);
		return this.apiSendMsg(make_fail_msg("make_failed", 0, "You don't have enough energy."));
	}


	//
	// make it
	//

	var previously_known = this.making_get_known_recipes();
	var making_rewards = this.making_execute_recipe(match_id, 1, recipe_info.energy_cost, info.item);
	if (!making_rewards){
		
		// What are we missing?
		
		var missing = [];
		for (var i=0; i<recipe_info.inputs.length; i++){
			var input = recipe_info.inputs[i];
			if (!this.checkItemsInBag(input[0], input[1])) missing.push(input[0]);
		}
		
		var rsp = '';
		if (missing.length){
			rsp = "<span class=\"making_error\">You need more "+pretty_list(missing, ' and ')+"!</span>";
		}
		
		this.announce_sound('CRAFTING_RESULT_NOTHING');
		log.info("async make failed - need more "+pretty_list(missing, ' and '));
		this.scheduleNextTimer(info);
		return this.apiSendMsg({
			type: 'make_unknown_missing',
			msg: rsp,
			effects: [],
		});
	}
	
	
	//
	// Destroy any extra ingredients we passed in
	//
		
	var required = {};
	for (var i=0; i<recipe_info.inputs.length; i++){
		var input = recipe_info.inputs[i][0];
		required[input] = recipe_info.inputs[i][1];
	}
	
	var extras = [];
	for (var i=0; i<info.inputs.length; i++){
		var input = info.inputs[i][0];
	
		if (!required[input] || info.inputs[i][1] > required[input]){
			var to_destroy = info.inputs[i][1];
			if (required[input]) to_destroy = info.inputs[i][1] - required[input];
			this.items_destroy(input, to_destroy);
		
			var proto = apiFindItemPrototype(input);
			extras.push(pluralize(to_destroy, proto.name_single, proto.name_plural));
		}
	}
	
	var rsp = '';
	if (extras.length == 1){
		rsp = "Your extra "+extras[0]+" was destroyed in the process.";
	}
	else if (extras.length){
		rsp = "Your extra "+pretty_list(extras, ' and ')+" were destroyed in the process.";
	}


	//
	// mark as known
	//

	this.recipes.recipes[match_id] = time();
	this.achievements_increment('making_unknown_recipe', str(match_id));
	this.achievements_increment('making_unknown_tool', info.item.class_id);
	this.achievements_increment('making_tool', info.item.class_id);

	this.quests_made_recipe(match_id, 1);


	//
	// send done message
	//

	//log.info('async make succeeded');
	var msg = "You discovered how to make recipe "+recipe_info.name+"! ";
	var context = {'verb':'make_unknown', 'recipe_id':match_id};
	var bonus_xp = this.stats_add_xp(50, false, context);
	var effects = {
		"energy": (recipe_info.energy_cost * -1),
		"xp": making_rewards.xp + bonus_xp, // bonus xp reward
	};
	
	msg += effects['energy'] + ' energy';
	if (effects['xp']){
		msg += ', +' + effects['xp'] + 'iMG';
	}

	if (making_rewards.msg) msg += ('. '+making_rewards.msg);
	
	this.sendActivity(msg);

	var knowns = {};

	var new_recipe = utils.copy_hash(get_recipe(match_id));
	new_recipe['learnt'] = 1;
	new_recipe['discoverable'] = 1;
	knowns[match_id] = new_recipe;
	
	for (var i in this.recipes.recipes){
		if (!previously_known[i]){
			var recipe = utils.copy_hash(get_recipe(i));

			recipe['discoverable'] = 1;
			recipe['learnt'] = 1;

			// Only recipes that match our current tool should be sent in knowns
			if (recipe.skill == recipe_info.skill || in_array_real(recipe_info.skill, recipe.skills)){
				knowns[i] = recipe;
			}
			effects['recipe_'+i] = recipe;
		}
	}
	
	// Schedule next timer if necessary
	this.scheduleNextTimer(info);
	
	this.apiSendMsg({
		type: 'make_unknown_complete',
		knowns: knowns,
		destroyed: extras,
		msg: rsp,
		effects: effects,
		learned: match_id,
		over_xp_limit: making_rewards.over_xp_limit
	});
}

function makingFindBestMatch(inputs, available_recipes, exact_quantities){
	var matches = [];
	
	//
	// Loop through the available recipes, see which ones we can discover, and score them
	//
	
	for (var i=0; i<available_recipes.length; i++){
		var recipe_id = available_recipes[i];
		var recipe = get_recipe(recipe_id);
		
		// Only discoverable recipes
		if (recipe.learnt != 0) continue;
		if (this.recipes.recipes[recipe_id]) continue;

		// get the score
		var score = this.makingInputsMatch(recipe.inputs, inputs, exact_quantities);
		if (score != null){

			//
			// do we have the skill?
			//

			var has_all_skills = true;
			for (var j in recipe.skills){
				var s = recipe.skills[j];

				if (!this.skills_has(s) && this.skills_get_name(s)) has_all_skills = false;
			}
			
			if (this.skills_has(recipe.skill) || !this.skills_get_name(recipe.skill) || has_all_skills){

				//log.info("R"+recipe_id+" - match with score "+score);
				matches.push({score: score, recipe_id: recipe_id});
			}else{
				//log.info("R"+recipe_id+" - match but no skill");
			}
		}else{
			//log.info("R"+recipe_id+" - no match");
		}
	}
	
	//
	// Find the best one out of the whole bunch
	//
	
	var best_match = null;
	for (var i in matches){
		var match = matches[i];
		if (!best_match || match.score < best_match.score){
			best_match = match;
		}
	}
	
	if (!best_match) return null;
	return best_match.recipe_id;
}

//
// Check that we have the proper ingredients (a) to match the recipe (b)
// Returns the number of ingredients you were over by, or null if you were way off
//

function makingInputsMatch(a, b, exact_counts){
	// turn both lists into hashes
	var actual = {};
	var given = {};

	for (var i=0; i<a.length; i++) actual[a[i][0]] = exact_counts ? a[i][1] : 1;
	for (var i=0; i<b.length; i++) given[b[i][0]] = exact_counts ? b[i][1] : 1;

	//log.info(actual,given);

	var difference = 0;
	// Make sure we have at least the minimum ingredients
	for (var i in actual){
		if (!given[i]) return null;
		if (actual[i] > given[i]) return null;
		difference += given[i] - actual[i];
		
		delete given[i];
	}

	//log.info(given);

	if (num_keys(given) > 1){
		// Too many extra ingredients
		return null;
	}
	
	// Total up the rest
	for (var i in given){
		difference += given[i];
	}

	// Good enough!
	return difference;
}

function making_get_known_recipes(){
	var known = {};
	
	for (var i in this.recipes.recipes){
		known[i] = this.recipes.recipes[i];
	}
	
	return known;
}

function making_try_learn_recipe(recipe_id){

	if (!this.recipes.recipes[recipe_id]){

		return this.making_learn_recipe(recipe_id);
	}
}

function making_unlearn_recipe(recipe_id){

	delete this.recipes.recipes[recipe_id];
}

function making_learn_recipe(recipe_id){

	var recipe_info = get_recipe(recipe_id);

	if (!recipe_info.name) return;

	this.recipes.recipes[recipe_id] = time();

	this.sendOnlineActivity("You learned how to make "+recipe_info.name+"!");
}

function making_recipe_is_known(recipe_id){
	return this.recipes.recipes[recipe_id] ? true : false;
}

function making_execute_recipe(recipe_id, count, energy_cost, item){

	var recipe_info = get_recipe(recipe_id);
	if (!recipe_info){
		log.error(this+' making_execute_recipe unknown recipe_id: '+recipe_id);
		return 0;
	}


	//
	// check & take ingredients
	//
	
	if (item.getClassProp('making_type') != 'machine') { // if it's a machine we already took the ingredients
		if (!this.checkIngredients(recipe_info.inputs, count, 1, item)){
			log.error(this+' making_execute_recipe missing ingredients recipe_id: '+recipe_id);
			return 0;
		}
	}

	//
	// give outputs
	//

	var outputs = [];
	for (var i=0; i<recipe_info.outputs.length; i++){

		var output = recipe_info.outputs[i];
		outputs.push({class_id: output[0], count: output[1] * count})
		if (item.getClassProp('making_type') != 'machine'){
			var remainder = this.createItem(output[0], output[1] * count);
			if (remainder){
				this.location.createItem(output[0], remainder, this.x, this.y, 250);
			}
		
			var proto = apiFindItemPrototype(output[0]);
			if (proto && proto.hasTag('bean')){
				this.quests_inc_counter('beans_seasoned', count);
			}
		}
	}

	//
	// effects..
	//
	var context = {'verb':'make_known', 'recipe_id':recipe_id, 'count':count}
	var energy = this.metabolics_lose_energy(energy_cost);

	var xp_reward = recipe_info.xp_reward * count;

	var xp = 0;
	var msg = '';
	var over_xp_limit = 0;
	if (xp_reward){
		var actual = xp_reward;
		if (config.recipe_xp_caps){
			actual = this.stats_add_making_xp_today(recipe_id, xp_reward);
			if (actual < xp_reward){
				msg = "You'll receive no more iMG from making these today. The creation process has ceased to stimulate your frontal cortex.";
				over_xp_limit = 1;
			}
		}
		xp = this.stats_add_xp(actual, false, context);

	}
	//log.info('Making rewards: '+energy+' energy, '+xp+' xp');	

	return {energy: energy, xp: xp, outputs: outputs, msg: msg, over_xp_limit: over_xp_limit};
}

function making_get_xp_ceiling(){
	// http://bugs.tinyspeck.com/6098
	var my_level = this.stats.level;
	if (my_level <= 5){
		return 250;
	}
	else if (my_level <= 10){
		return 500;
	}
	else if (my_level <= 30){
		var ret = this.stats_calc_level_from_xp(this.stats.xp.value);
		return (0.10-(0.0025*(my_level-11))) * (ret.xp_for_next-ret.xp_for_this);
	}
	else if (my_level == 60){
		return 85447.4; // hard-coded value for what you get at level 59: http://bugs.tinyspeck.com/8535
	}
	else{
		var ret = this.stats_calc_level_from_xp(this.stats.xp.value);
		return 0.05 * (ret.xp_for_next-ret.xp_for_this);
	}
}

function making_get_recipes(item, verb){

	var making_info = item.verbs[verb].making;
	var out = {
		knowns: {},
		unknowns: {},
	};

	for (var i=0; i<making_info.recipes.length; i++){

		var id = making_info.recipes[i];

		// Show all known recipes, which is all recipes for the tool if this is a transmogrification tool
		if (this.recipes.recipes[id] || item.getClassProp('making_type') == 'transmogrification' || (id == 288 && isPiDay())){
			var r = get_recipe(id);
			if (!r) continue;
			
			// Copy the recipe so we don't modify the catalog
			var rsp = utils.copy_hash(r);

			rsp.learnt = 1;
			rsp.discoverable = 1;

			if (item.getClassProp('making_type') == 'machine'){
				var fuel = 0;
				var j;
				for (j in rsp.inputs){
					if (rsp.inputs[j][0] == 'fuel_cell'){
						fuel = rsp.inputs[j][1];
						break;
					}
				}

				if (item.class_tsid == 'blockmaker'){
					if (this.imagination_has_upgrade('blockmaking_save_fuel_2')){
						fuel -= Math.round(fuel*0.40);
					}
					else if (this.imagination_has_upgrade('blockmaking_save_fuel_1')){
						fuel -= Math.round(fuel*0.20);
					}
				}

				rsp.inputs[j][1] = fuel;
			}

			out.knowns[id] = rsp;
		}else{
			out.unknowns[id] = 1;
		}
	}
	
	return out;
}

function making_get_effects(item, verb){

	var ret = this.making_get_recipes(item, verb);

	if (item.getClassProp('making_type') == 'machine'){
		return {
			recipes_known: num_keys(ret.knowns),
			fuel_level: item.getInstanceProp('fuel_level'),
			max_fuel: item.getClassProp('max_fuel')
		};
	}
	else{
		return {
			recipes_known: num_keys(ret.knowns),
		};
	}
}

function making_recipe_request(msg){
	var rsp = {};
	
	//log.info(msg);
	var all_recipes = apiFindItemPrototype('catalog_recipes').recipes;
	
	// Loop over the items we want to make
	for (var i in msg.class_tsids){
		var class_id = msg.class_tsids[i];
		
		// Loop over all recipes to find what makes 'class_id'
		for (var j in all_recipes){
			var r = get_recipe(j); // get_recipe sets some other stuff up for us, so let's call it
			
			// Loop over the outputs of recipe 'r' (id 'j')
			for (var o=0; o<r.outputs.length; o++){
				// Found a match!
				if (r.outputs[o][0] == class_id){
					// Copy the recipe so we don't modify the catalog
					rsp[class_id] = utils.copy_hash(r);
					rsp[class_id].id = j; // We need recipe id too
					
					// Discoverable?
					if (rsp[class_id].learnt == 0) rsp[class_id].discoverable = 1;
					
					// Get the tool that makes this recipe
					var tool = apiFindItemPrototype(r.tool);

					// Change task_limit based on potential upgrades
					var task_limit_multiplier = this.get_task_limit_multiplier(tool);
					if (task_limit_multiplier != 1.0){
						rsp[class_id].task_limit = Math.round(rsp[class_id].task_limit * task_limit_multiplier);
					}
					
					// Do we know this recipe?
					if (!this.recipes.recipes[j]){
						// We implicitly know all transmogrification recipes
						if (!tool || tool.getClassProp('making_type') != 'transmogrification'){
							rsp[class_id].learnt = 0;
						}
						else if (j == 288 && isPiDay()) {
							// we implicitly know the pi recipe
							rsp[class_id].learnt = 0;
						}
					}
					else if (rsp[class_id].discoverable){
						rsp[class_id].learnt = 1;
					}


					// Explain if we can make this thing, and why we can't if we can't
					if (rsp[class_id].learnt){
						rsp[class_id].disabled = false;
						if (r.skills){
							for (var s in r.skills){
								if (!this.skills_has(r.skills[s])){
									rsp[class_id].disabled = true;
									rsp[class_id].disabled_reason = "You need to learn the "+this.skills_linkify(r.skills[s])+" skill.";
									break;
								}
							}
						}

						if (r.achievements){
							for (var a in r.achievements){
								if (!this.achievements_has(r.achievements[a])){
									rsp[class_id].disabled = true;
									rsp[class_id].disabled_reason = "You need to get the "+this.achievements_linkify(r.achievements[a])+" achievement.";
									break;
								}
							}
						}
					}
				}
			}
			
			// We prefer recipes that make *just* the thing we're looking for
			if (rsp[class_id] && rsp[class_id].learnt && rsp[class_id].outputs.length == 1) break;
		}
		
		// Nothing makes this thing
		if (!rsp[class_id]) rsp[class_id] = {};
	}
	
	//log.info(rsp);
	return rsp;
}

function making_is_making(){
	if (this.making_queue && this.making_queue.length > 0){
		if (!this.making_queue[0]['making'] || !this.making_queue[0]['making'].item) return false;
		
		var machine = this.making_queue[0]['making'].item.getClassProp('making_type') == 'machine';
		if (machine) { 
			return false;
		}
	
		if (this.making_queue[0]['making'] && this.making_queue[0]['making'].wait && this.making_queue[0]['making'].started) { 
			var diff = getTime() - intval(this.making_queue[0]['making'].started);
			log.info(this+" Making is making diff is "+diff);
			log.info(this+" Making first in queue is "+this.making_queue[0]['making']);
			if (diff < 600*1000){
				log.info(this+" Making diff is less than "+600*1000);
				return true;
			}
		}
	}
	return false;
}

function get_task_limit_multiplier(item){

	var task_limit_multiplier = 1.0;
	if (item.hasTag('food_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_food_2')){
			task_limit_multiplier = 2.0;
		}else if (this.imagination_has_upgrade('recipe_task_limit_food_1')){
			task_limit_multiplier = 1.5;
		}
	}

	if (item.hasTag('transmog_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_transmog_2')){
			task_limit_multiplier = 2.0;
		}else if (this.imagination_has_upgrade('recipe_task_limit_transmog_1')){
			task_limit_multiplier = 1.5;
		}
	}
	
	if (item.hasTag('drink_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_drink_2')){
			task_limit_multiplier = 2.0;
		}else if (this.imagination_has_upgrade('recipe_task_limit_drink_1')){
			task_limit_multiplier = 1.5;
		}
	}
	
	if (item.hasTag('machine_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_machines_2')){
			task_limit_multiplier = 2.0;
		}else if (this.imagination_has_upgrade('recipe_task_limit_machines_1')){
			task_limit_multiplier = 1.5;
		}
	}
	
	if (item.hasTag('fiberarts_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_loomer_1')){
			task_limit_multiplier = 2.5;
		}
	}
		
	if (item.hasTag('tincturing_task_limit_upgrade')){
		if (this.imagination_has_upgrade('recipe_task_limit_tincturing_1')){
			task_limit_multiplier = 2.0;
		}
	}

	return task_limit_multiplier;
}

//
// Function to tell us if we should stop the machine noise when a machine finishes running.
// Returns true if any machines other than the parameter are running for this player.
//
function machinesRunning(machine) { 

	var location = machine.container;
	
	if (location){
		var metalmakers = location.find_items("metalmaker");
		var woodworkers = location.find_items("woodworker");
		var fuelmakers = location.find_items("fuelmaker");
		var blockmakers = location.find_items("blockmaker");
		
		//log.info("Making got location "+location+" with "+metalmakers +" "+woodworkers+" "+fuelmakers+" "+blockmakers);
		
		for (var m in metalmakers) { 
			if (machine == metalmakers[m]) { continue; }

			//if (config.is_dev) log.info("Making checking "+metalmakers[m]+" for pc "+this);
			
			if (metalmakers[m].is_running && metalmakers[m].last_user == this.tsid) { 
				// Return false if there's a metal machine running but it's playering metal music
				// because we're trying not to run the machine noise if the metal music is playing
				if (!metalmakers[m].isPlayingMusic(this)) { 
					return true;
				}
			}
		}
		
		for (var w in woodworkers) { 
			if (machine == woodworkers[w]) { continue; }

			//if (config.is_dev) log.info("Making checking "+woodworkers[w]+" for pc "+this);
			
			if (woodworkers[w].is_running && woodworkers[w].last_user == this.tsid) { 
				return true;
			}
		}
		
		for (var f in fuelmakers) { 
			if (machine == fuelmakers[f]) { continue; }

			//if (config.is_dev) log.info("Making checking "+fuelmakers[f]+" for pc "+this);
			
			if (fuelmakers[f].is_running && fuelmakers[f].last_user == this.tsid) { 
				return true;
			}
		}
		
		for (var b in blockmakers) { 
			if (machine == blockmakers[b]) { continue; }

			//if (config.is_dev) log.info("Making checking "+blockmakers[b]+" for pc "+this);
			
			if (blockmakers[b].is_running && blockmakers[b].last_user == this.tsid) { 
				return true;
			}
		}
	}
	
	return false;
}

// Function to compute the amount of time remaining for a machine that is running.
function machineTimeRemaining(tsid) { 
	if (this.making_queue) { 
		for (var m in this.making_queue) { 
			var making = this.making_queue[m];
			
			log.info("Making got "+making);
			
			var machine_tsid = making.making.item.tsid;
			
			if (machine_tsid === tsid) { 
				// found it
				var time_left = Math.round((making['time'] - getTime())/1000);
				
				return time_left;
			}
		}
	}
	
	return -1;
}

function making_debug() { 
	if (this.making_queue) { 
		for (var m in this.making_queue) { 
			var making = this.making_queue[m];
			if (making.making.item) { 
				log.info(this+" Making got item "+making.item);
			}
			else { 
				log.info(this+" Making got making "+making);
			}
		}
	}
}