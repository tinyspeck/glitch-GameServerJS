var is_mineable = true;
var miner = null;
function buildState(){
	if (!this.isUseable()) return 'visible:false';
	return 'scene:'+Math.ceil(this.instanceProps.chunks_remaining/10);
}

function getVerbLabel(pc, verb) {
	if(verb == 'mine') {
		/* Weird race condition — if you hammer on the button, you can get the verb window again after the progress bar vanishes
		 * but before mining is actually completed. This means that if you're the only miner, you can get "help mine" as the
		 * verb if you just hit the button fast enough. Ugh.
	     */
	     	var miner_count = utils.num_keys(this.miners);


		if(!this.miners || miner_count == 0 || (miner_count == 1 && this.miners[0] == pc.tsid)) {
			return "Mine";
		} else {
	 		return "Help mine";
		}
	}
}

function getHelpString(pc) {
	if(!this.helpers || !this.helpers[pc.tsid]) {
		return "";
	}

	var num_helpers = num_keys(this.helpers[pc.tsid]);
	var count = 0;
	var result = "";

	for(var i in this.helpers[pc.tsid]) {
		count++;
		if(count > 1) {
			if(count == num_helpers) {
				result += ", and ";
			} else {
				result += ", ";
			}
		}
		var helper_player = getPlayer(i);
		
		if(helper_player) {
			result += linkifyPlayer(helper_player);
		}
	}

	return result;	
}

function miningSanityCheck() {
	// Remove any PCs who aren't still in the area or aren't still mining.
	if (!this.miners) this.miners = [];
	for(var i in this.miners) {
		var player = getPlayer(this.miners[i]);
		if(player) {
			if(!player['!mining'] || player['!mining'] != this.tsid || !player.isOnline() || player.location != this.container) {
				log.info("Mining sanity check found miner "+player+" on rock "+this+" who shouldn't be there.");
				
				this.removeMiner(player, true);
			}
		}
	}
}

function addMiner(pc) {
	// Push miner onto the stack
	if(!this.miners) {
		this.miners = [];
	}
	
	// Set up helpers for this player
	if(!this.helpers) {
		this.helpers = {};
	}

	// add this player to all existing helper stacks
	for(var i in this.helpers) {
		if(!this.helpers[i][pc.tsid]) {
			this.helpers[i][pc.tsid] = 1;
		} else {
			this.helpers[i][pc.tsid]++;
		}
	}

	this.helpers[pc.tsid] = {};	
	// Push us onto the stack
	this.miners.push(pc.tsid);	
}

function removeMiner(pc, cancel) {
	if (!this.helpers) this.helpers = {};
	if (!this.miners) this.miners = [];

	// First, if we cancelled, remove us from the lists of helpers
	if(cancel) {
		for(var i in this.helpers) {
			if(this.helpers[i][pc.tsid]) {
				this.helpers[i][pc.tsid]--;
				if(!this.helpers[i][pc.tsid]) {
					delete this.helpers[i][pc.tsid];
				}
			}
		}
	}
	
	// Remove my helpers
	delete this.helpers[pc.tsid];
	
	// Remove me from the stack!
	var index = 0;
	for(var i in this.miners) {
		if(this.miners[i] == pc.tsid) {
			this.miners.splice(i, 1);
			break;
		}
	}
}

function cancelMining(pc){
	pc.announce_sound_stop('PICK');
	pc.announce_sound_stop('FANCY_PICK');

	// Remove us from the mining list
	this.removeMiner(pc, true);
	
	delete pc['!mining'];
	if(pc['!help_mining']) {
		delete pc['!help_mining'];
	}
}

function isUseable(){
	return this.instanceProps.chunks_remaining > 0 ? true : false;
}

function onOverlayDismissed(pc, payload){
	this.cancelMining(pc);
}

function onRespawn(has_upgrade) {

	if (this.classProps.rock_type == 'metal_rock'){
		var chance = 0;
	}
	else if (this.classProps.rock_type == 'dullite'){
		var chance = 0.05;
	}
	else if (this.classProps.rock_type == 'beryl'){
		var chance = 0.10;
	}
	else{
		var chance = 0.20;
	}
	
	if (has_upgrade) {
		chance += .5*chance;
		//log.info("Respawning rock with upgrade, chance is "+chance);
	}

	if (is_chance(chance)){
		this.instanceProps.chunks_remaining = 150;
		this.apiSetTimer('onMegaRoxx', 1000);
	}
	else{
		this.instanceProps.chunks_remaining = 50;
	}
	this.broadcastState();
}

function onMegaRoxx(){
	this.sendBubble("I am huuuuuuuuuge!", 5000);
}

function startMining(pc, msg){
	// Sanity checks
	
	this.miningSanityCheck();
	
	if(pc['!mining']) {
		pc.sendActivity("You are already mining something.");
	}

	if (!this.classProps.rock_type){
		pc.sendActivity("Oops. This rock ain't hooked up right.");
		return false;
	}

	// Find a pick
	if (msg.target_itemstack_tsid){
		var pick = pc.getAllContents()[msg.target_itemstack_tsid];
	}
	else{
		if (msg.target_item_class){
			var tool_class = msg.target_item_class;
		}
		else{
			var tool_class = msg;
		}
		

		function is_pick(it){ return it.is_pick && it.isWorking() && it.class_tsid == tool_class ? true : false; }
		var pick = pc.findFirst(is_pick);
	}

	if (!pick){
		pc.sendActivity("You'll need a pick first.");
		return false;
	}

	// Is this working?

	if (!this.isUseable()){
		pc.sendActivity("This is not the rock you are looking for.");
		return false;
	}
	
	
	pc['!mining'] = this.tsid;
	// Are we helping to mine?
	if(num_keys(this.helpers)) {
		pc['!help_mining'] = this.tsid;
	}
	
	var package_name = 'mining';
	if (pick.class_id == 'fancy_pick') package_name = 'mining_fancypick';
	
	var success = pc.runSkillPackage(package_name, this, {word_progress: config.word_progress_map['mine'], tool_item: pick, callback: 'onMiningComplete', msg: msg});
		
	if (!success['ok']){
		pc.announce_sound_stop(pick.class_tsid.toUpperCase());
		delete pc['!mining'];
		
		if (success.error_tool_broken){
			pc.sendActivity("Your pick does not have enough uses left.");
		}
		return false;
	}

	// Add to mining lists
	this.addMiner(pc);
	
	return true;
}

function onMiningComplete(pc, ret){
	
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];


	// Adjust gem drop for next time!
	//log.info(this+' mining drop chance was: '+ret.details.drop_chance);
	if (ret.details['got_drop']){
		for (var i in ret.details['got_drop']){
			var it = ret.details['got_drop'][i];
			if (it.class_id){
				var item_prot = apiFindItemPrototype(it.class_id);
				if (item_prot && item_prot.hasTag('gem')){
					pc.addSkillPackageOverride(ret.class_id, {drop_chance: ret.details.drop_chance * 0.8});
				}
			}
		}
	}

	var slugs = ret.slugs;
	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
	});

	if (ret.values['mood_bonus']){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: ret.values['mood_bonus']
		});
	}

	if (ret.values['xp_bonus']){
		self_effects.push({
			"type"	: "xp_give",
			"value"	: ret.values['xp_bonus']
		});
	}
	
	
	var to_get = 0;
	if (this.classProps.rock_type == 'metal_rock'){
		to_get = (pc.buffs_has('max_luck') ? 9 : randInt(3, 9));
	}
	else if (this.classProps.rock_type == 'dullite'){
		to_get = (pc.buffs_has('max_luck') ? 9 : randInt(5, 9));
	}
	else if (this.classProps.rock_type == 'beryl'){
		to_get = (pc.buffs_has('max_luck') ? 8 : randInt(4, 8));
	}
	else{
		to_get = (pc.buffs_has('max_luck') ? 7 : randInt(3, 7));
	}
	
	var upgrade_bonus = Math.round(0.15 * to_get);
	//log.info("Mining upgrade bonus "+upgrade_bonus);
	
	if (pc.imagination_has_upgrade("mining_expert_beryl") && this.classProps.rock_type == 'beryl') {
		//log.info("Awarding mining upgrade bonus");
		to_get += upgrade_bonus;
	}
	else if (pc.imagination_has_upgrade("mining_expert_dullite") && this.classProps.rock_type == 'dullite') {
		//log.info("Awarding mining upgrade bonus");
		to_get += upgrade_bonus;
	}
	else if (pc.imagination_has_upgrade("mining_expert_sparkly") && this.classProps.rock_type == 'sparkly') {
		//log.info("Awarding mining upgrade bonus");
		to_get += upgrade_bonus;
	}
	else if (pc.imagination_has_upgrade("mining_expert_metal_rock") && this.classProps.rock_type == 'metal_rock') {
		//log.info(" Awarding mining upgrade bonus");
		to_get += upgrade_bonus;
	}
	
	// If someone helped you, you get more stuff! Count our helpers
	var help_bonus = 0;
	var n_helpers = 0;
	
	if (!this.helpers) this.helpers = {};
	for (var i in this.helpers[pc.tsid]) {
		n_helpers += this.helpers[pc.tsid][i];
	}
	for (var i = 0; i < n_helpers && i < 9; i++) {
		help_bonus += Math.min(i+1, 4);
	}
	
	if(!this.chunks_taken) {
		this.chunks_taken = 0;
	}
	this.chunks_taken += to_get+help_bonus;
	
	var remaining = pc.createItemFromSource(this.classProps.rock_type, to_get, this);
	if (remaining != to_get){
		var proto = apiFindItemPrototype(this.classProps.rock_type);
		var got = to_get - remaining;

		self_effects.push({
			"type"	: "item_give",
			"which"	: proto.name_plural,
			"value"	: got
		});

		pc.achievements_increment('nodes_mined', this.classProps.rock_type);
		pc.achievements_increment('rocks_mined', this.classProps.rock_type, got);
		pc.quests_inc_counter('mining', 1);
		
		if (!slugs.items) slugs.items = [];
		slugs.items.push({
			class_tsid	: this.classProps.rock_type,
			label		: proto.label,
			count		: got
		});
	}
	
	if (help_bonus){
		var bonus_remaining = pc.createItemFromOffset(this.classProps.rock_type, help_bonus, {x: 100, y:0}, false, this);
		if (bonus_remaining != help_bonus){
			var proto = apiFindItemPrototype(this.classProps.rock_type);
			var bonus_name = (help_bonus - bonus_remaining) > 1 ? proto.name_plural : proto.name_single;
			
			var bonus_msg = "You got "+ (help_bonus - bonus_remaining) +" additional "+bonus_name+" with the help you received from "+this.getHelpString(pc)+".";
		}
	}

	var pre_msg = this.buildVerbMessage(this.count, 'mine', 'mined', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);
	if (bonus_msg){
		pc.sendActivity(bonus_msg);
	}

	this.instanceProps.chunks_remaining -= (to_get + remaining + help_bonus);
	this.broadcastState();

	// Do we need to schedule a respawn?

	if (this.instanceProps.chunks_remaining <= 0){
		this.addWear();
		if (this.classProps.rock_type == 'metal_rock'){
			this.container.cultivation_add_img_rewards(pc, 25.0);
		}
		else if (this.classProps.rock_type == 'dullite'){
			this.container.cultivation_add_img_rewards(pc, 15.0);
		}
		else if (this.classProps.rock_type == 'beryl'){
			this.container.cultivation_add_img_rewards(pc, 20.0);
		}
		else{
			this.container.cultivation_add_img_rewards(pc, 30.0);
		}

		if (this.isDepleted()){
			this.replaceWithDepleted();
		}
		else{
			// scale extra time with chunks extracted.
			var extra_time = 0;
			
			this.instanceProps.chunks_remaining = 0;
			if(!this.chunks_taken) {
				this.chunks_taken = 0;
			}
			
			if (this.chunks_taken > 80) {
				extra_time += Math.random() * 16.0;
			}
			
			var val =  pc.imagination_has_upgrade("mining_high_capacity_rock");
			log.info("Setting respawn timer with upgrade value "+val);
			
			this.apiSetTimerX('onRespawn', 1000 * 60 * (8 + extra_time), val);
			this.chunks_taken = 0;
			
			if (this.classProps.rock_type == 'metal_rock'){
				this.sendResponse('metal_rock_disappeared', pc, slugs);
			}
			else{
				this.sendResponse('rock_disappeared', pc, slugs);
			}
		}
		pc.quests_inc_counter('mining_clear_rock', 1);
	}
	else{
		if (this.classProps.rock_type == 'metal_rock'){
			if (!ret.details['got_drop']){
				if (to_get < 9){
					this.sendResponse('mine_metal_rock', pc, slugs);
				}
				else{
					this.sendResponse('mine_max_metal_rock', pc, slugs);
				}
			}
		}
		else if (this.classProps.rock_type == 'dullite'){
			if (!ret.details['got_drop']){
				if (to_get < 9){
					this.sendResponse('mine_dullite', pc, slugs);
				}
				else{
					this.sendResponse('mine_max_dullite', pc, slugs);
				}
			}
		}
		else if (this.classProps.rock_type == 'beryl'){
			if (!ret.details['got_drop']){
				if (to_get < 8){
					this.sendResponse('mine_beryl', pc, slugs);
				}
				else{
					this.sendResponse('mine_max_beryl', pc, slugs);
				}
			}
		}
		else{
			if (!ret.details['got_drop']){
				if (to_get < 7){
					this.sendResponse('mine_sparkly', pc, slugs);
				}
				else{
					this.sendResponse('mine_max_sparkly', pc, slugs);
				}
			}
		}

		if (ret.details['got_drop']){
			var items = ret.details['got_drop'];
			for (var i in items){
				if (items[i].class_id == 'gem_amber'){
					this.sendResponse('gem_drop_amber', pc, slugs);
				}
				else if (items[i].class_id == 'gem_diamond'){
					this.sendResponse('gem_drop_diamond', pc, slugs);
				}
				else if (items[i].class_id == 'gem_moonstone'){
					this.sendResponse('gem_drop_moonstone', pc, slugs);
				}
				else if (items[i].class_id == 'gem_ruby'){
					this.sendResponse('gem_drop_ruby', pc, slugs);
				}
				else if (items[i].class_id == 'gem_sapphire'){
					this.sendResponse('gem_drop_sapphire', pc, slugs);
				}
			}
		}
	}
	
	// Remove us from the mining list.
	this.removeMiner(pc, false);
	delete pc['!mining'];
	
	if(pc['!help_mining']) {
		delete pc['!help_mining'];
		pc.quests_inc_counter('help_mine', 1);
	}
}