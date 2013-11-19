function locationIsDepressing() {
	// Nowhere should be sad, but it is not as bad as you'd think.
	if(!this.container) {
		return false;
	}

	// Races aren't sad
	if (this.container.is_race || this.container.is_game) return false;
	
	// Are we in a pack?
	var root;
	if(this.container.location || this.container.is_bag) {
		root = this.container.findPack().location;
	} else {
		root = this.container;
	}

	if (!root) return false;
	
	// Animal sadness has been manually forced for this location
	if (root.disallow_animals) {
		return true;
	}
	
	if (root.hubid) {
		if (root.hubid == 122) return false;
		
		if (config.hubs[root.hubid] == 'Ilmenskie Caverns' ||
		    config.hubs[root.hubid] == 'Ilmenskie Deeps' ||
		    config.hubs[root.hubid] == 'Jethimadh Tower: Base' ||
		    config.hubs[root.hubid] == 'Seam Streets' ||
		    config.hubs[root.hubid] == 'Choru' ||
		    config.hubs[root.hubid] == 'Baqala' ||
		    config.hubs[root.hubid] == 'Zhambu' ||
		    config.hubs[root.hubid] == 'Xalanga'
		) {
			return true;
		}
	}
	
	if (root.tsid == 'LM4107R9OLUTA' || root.isInHell()){ // Hell is incredibly depressing.
		return true;
	}

	if (root.transit){ // Subway stations suck.
		return true;
	}

	// No animals in towers
	if (root.home_id == 'tower') return true;

	// skillquest is never depressing
	if (root.is_skillquest) return false;
	
	if (root.isInstance){
		if (root.isInstance() && !root.is_newxp) {	// Instances? Also sad.
			return true;
		}
	}
	
	
	return false;
}

function onSadnessCheck(){
	if (this.ignore_sadness) return;
	if (this.class_tsid == 'npc_batterfly') return;
	
	var max = this.getSadnessMax();
	var population = this.container.countItemClass(this.class_tsid);
	
	var chance = 0;
	if (population >= max){
		chance = 0.9;
	}
	else if (population >= (max * 0.9)){
		chance = 0.6;
	}
	else if (population >= (max * 0.8)){
		chance = 0.45;
	}
	else if (population >= (max * 0.7)){
		chance = 0.3;
	}
	if (is_chance(chance)){
		if (population >= (max * 0.9) && is_chance(0.05) && ((this.class_tsid != "npc_chicken") || (this.incubating != 1))){
			log.info("CHICKEN: "+this.class_tsid+" and "+this.incubating);
			this.sendBubble("That’s it! I am OUT of here! Too crowded!!!", 7000);
			this.container.apiSendAnnouncement({
				type: 'itemstack_overlay',
				itemstack_tsid: this.tsid,
				swf_url: overlay_key_to_url('smoke_puff'),
				delta_y: 95,
				delay_ms: 6500,
				follow: true,
				duration: 1500
			});
			this.apiSetTimer('apiDelete', 7000);
		}
		else{
			this.apiSetTimer('onSadnessStart', randInt(1, 23) * 1000);
		}
	}
	else if (population >= max){
		if ((this.class_tsid != "npc_chicken") || (this.incubating != 1)) { // don't steal players' eggs
			// poof!
			this.container.apiSendAnnouncement({
				type: 'itemstack_overlay',
				itemstack_tsid: this.tsid,
				swf_url: overlay_key_to_url('smoke_puff'),
				delta_y: 95,
				follow: true,
				duration: 1500
			});
			this.apiSetTimer('apiDelete', 500);
		}
	} else if((this.class_tsid == 'npc_piggy' ||
			   this.class_tsid == 'chick' ||
			   this.class_tsid == 'piglet' ||
			   this.class_tsid == 'caterpillar') &&
			   this.locationIsDepressing()) {
		this.apiSetTimer('onSadnessStart', 500);		
	}
}

function getSadnessMax(){
	var this_config = config.population_controls[this.class_tsid];
	// No upper limit
	if (!this_config || !this_config.min_max || !this.container) return 9999;
	
	var width = Math.abs(this.container.geo.l)+Math.abs(this.container.geo.r);
	var max = Math.min(Math.max(Math.round(width/1000)*this_config.per_width, this_config.min_max), this_config.max_max);
	
	// Halve animal sadness in public streets
	if(!this.container.pols_is_pol()) {
		max = Math.round(max / 2);
	}
	else{
		var owner = this.container.pols_get_owner();
		if (owner){
			if (owner.imagination_has_upgrade('herdkeeping_animal_sadness_2')){
				max += Math.round(max*0.2);
			}
			else if (owner.imagination_has_upgrade('herdkeeping_animal_sadness_1')){
				max += Math.round(max*0.1);
			}
		}
	}
	
	return max;
}

function onSadnessStart(){
	if (this.getContainerType() != 'street') return;

	if(this.class_tsid == 'npc_chicken' && this['!is_flying']) {
		log.info("CHICKEN: not getting sad because flying");
		// Don't get sad in mid-air. That's weird.
		return;
	}
	
	if(this.class_tsid == 'npc_chicken' && this.incubating == 1) {
		log.info("CHICKEN: not getting sad because incubating");
		// Finish incubating first.
		return;
	}
	
	this.is_sad = true;
	this.apiSetTimer('onSadnessEnd', 3 * 60 * 1000);
	
	if (this.fullStop) this.fullStop();
	
	if (this.class_tsid == 'npc_butterfly'){
		// fall to the closest platline
		var pl = this.container.apiGetClosestPlatformLineBelow(this.x, this.y-1);
		if (pl){
			this.apiSetXY(this.x, pl.y1);
		}
	}
	
	// Start immediately in a depressing location
	if(this.locationIsDepressing()) {
		this.onSadnessInterval();
	} else {	
		this.apiSetTimer('onSadnessInterval', randInt(1, 23) * 1000);
	}
}

function onSadnessInterval(){
	if (!this.isSad() || this.getContainerType() != 'street') return;
	
	if(this.class_tsid == 'npc_piggy' && this.locationIsDepressing()) {
		this.sendBubble(choose_one(this.responses['sad_piggy']), 7000);
	} else if (this.class_tsid == 'piglet' ||
			   this.class_tsid == 'chick' ||
			   this.class_tsid == 'caterpillar'){
		this.sendBubble(choose_one(this.responses['sad_baby_animals']), 7000);
	} else {
		this.sendBubble(this.getSadnessResponse(), 7000);
	}
	
	if (this.class_tsid == 'npc_piggy'){
		if (is_chance(0.2)){
			this.setAndBroadcastState('rooked2');
		}
		else{
			this.setAndBroadcastState('too_much_nibble');
		}
	}
	else if (this.class_tsid == 'npc_chicken'){
		if (is_chance(0.2)){
			this.setAndBroadcastState('rooked2');
		}
		else{
			this.setAndBroadcastState('sit');
		}
	}
	else if (this.class_tsid == 'npc_butterfly'){
		this.setAndBroadcastState('fly-rooked');
	} else if (this.class_tsid == 'chick') {
		
	} else if (this.class_tsid == 'caterpillar') {
		
	} else if (this.class_tsid == 'piglet') {
		
	}
	
	this.apiSetTimer('onSadnessInterval', 30 * 1000);
}

function onSadnessEnd(){
	delete this.is_sad;
	
	if (this.onRevived) this.onRevived();
	
	if (this.getContainerType() == 'street'){
		var max = this.getSadnessMax();
		var population = this.container.countItemClass(this.class_tsid);
		
		if (!this['!sadness_ticks']) this['!sadness_ticks'] = 0;
		this['!sadness_ticks']++;
	
		if (population >= max){
			this.apiSetTimer("onSadnessCheck", 5 * 60 * 1000);
		}
		else{
			if (this['!sadness_ticks'] < 4){
				this.apiSetTimer("onSadnessCheck", 5 * 60 * 1000);
			}
			else{
				delete this['!sadness_ticks'];
			}
		}
	}
}

function isSad(){
	return (this.is_sad ? true : false) || 
		((this.class_tsid == 'npc_piggy' ||
		  this.class_tsid == 'chick' ||
 		  this.class_tsid == 'piglet' ||
		  this.class_tsid == 'caterpillar') && this.locationIsDepressing());
}

function getSadnessResponse(){
	var responses = [
		"This sucks! Sooooo ... crowded. Making me feel sad.",
		"Damn, I am really bummed on account of how crowded it is.",
		"I am feeling claustrophobic and just … sad.",
		"Too crowded for me. Cripes!",
		"It is uncomfortable because of the crowding.",
		"Crap! So crowded. I feel sad.",
		"This crowding suuuuuuuucks.",
		"I hate how crowded it is in here.",
		"This is much too crowded for me.",
		"Ugh! Can't believe how crowded it is. Makes me so sad!"
	];
	
	return choose_one(responses);
}