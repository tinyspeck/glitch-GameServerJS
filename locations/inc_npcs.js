// Location-based NPCs, including location spawns, etc.

function location_spawns(pc) {
	//
	// Smuggling chasers and receivers
	//
	if (pc.buffs_has('dont_get_caught')){
		if (this.smuggling_is_destination(pc)){
			this.smuggling_spawn_receiver(pc);
		} else {
			if (!this.isInHell() && !this.isInstance()){
				this.smuggling_spawn_deimaginator(pc);
			}
		}
	} else if (pc.stats_get_rube_trades() < 2 && this.can_spawn_rube() && this.getNumActivePlayers() <= 8) {
		var rube_chance = 0.005;
		var do_spawn_rube = false;
		var last_trade = pc.stats_get_last_rube_trade();
		var days_since_last_trade = intval((time() - last_trade) / (60 * 60 * 4));
		
		if (pc.buffs_has('rubeweed')) {
			rube_chance *= 2.0;
		}
		if (days_since_last_trade >= 10) {
			rube_chance *= 2.0;
		}
		
		if (pc.imagination_has_upgrade('rube_chance_to_meet') && rube_chance < 0.01){
			rube_chance = 0.01;
		}
		
		if (time() - last_trade < 60 * 60) {
			do_spawn_rube = false;
		} else {
			do_spawn_rube = is_chance(rube_chance);
		}
		
		if (do_spawn_rube) {
			// Make sure the player has something to trade:
			var contents = pc.getAllContents(function(it) {return it.getBaseCost() && !it.hasTag('no_rube') && it.getBaseCost() < 2500;});
			if (num_keys(contents)) {
				this.spawn_rube(pc);
			}
		}
	}
}

function spawn_npc(x, y, class_tsid, pc) {
	var plat_position = this.apiGetPointOnTheClosestPlatformLineBelow(x, y);
	if (!plat_position) {
		plat_position = this.apiGetPointOnTheClosestPlatformLineAbove(x, y);
	
		if (!plat_position) {
			log.info("Tried to spawn npc "+class_tsid+" in "+this+" for player "+pc+" but couldn't find an appropriate spot. Bailing.");
			return;
		}
	}

	if (pc) {
		// Make sure the player can reach this position:
		if(!pc.apiPlayerCanReach(plat_position.x, plat_position.y)) {
			log.info("Tried to spawn npc "+class_tsid+" in "+this+" for player "+pc+" but the selected position of x:"+plat_position.x+", y: "+plat_position.y+" is unreachable.");
			return;
		}
	}
	
	var npc = this.createItemStack(class_tsid, 1, plat_position.x, plat_position.y);
	if(!npc) {
		log.error("Error failed to create npc "+class_tsid+" in "+this+" at ("+plat_position.x+", "+plat_position.y+").");
		return;
	}
	
	return npc;
}

function spawn_rube(pc) {
	var rube_position = this.geo.l + (Math.random() * (this.geo.r - this.geo.l));

	var rube = this.spawn_npc(rube_position, pc.y, 'npc_rube', pc);
	
	if (rube) {
		apiLogAction('RUBE_SPAWNED', 'pc='+pc.tsid, 'location='+this.tsid);
		log.info("Spawned rube in "+this+" for player "+pc+".");

		rube.setTarget(pc, true);
	
		pc.sendActivity("The Rube is here to trade with you!");
	
		return true;
	} else {
		return false;
	}
}

function can_spawn_rube() {
	var banned_hubs = [77, 96, 122, 132];
	
	return !this.isInstance() &&
			!this.pols_is_pol() &&
			!this.isInHell() &&
			!in_array(this.hubid, banned_hubs);
}

function tryRubeLure(pc){
	try {
		if (this.can_spawn_rube()){
			
			// Try and spawn the rube up to 5 times (in the case of unreachable placing)
			var spawned = false;
			for (var i = 0; i < 5; i++){
				if (this.spawn_rube(pc)){
					if (pc.buffs_has('rube_lure')){
						pc.buffs_remove('rube_lure');
					}
					return true;
				}
				log.info('Failed to spawn the rube in '+this+' for player '+pc+' [try #'+i+'].');
			}
			
			return false;
		}
		return false;
	} catch (e) {
		pc.buffs_remove('rube_lure');
		log.error(this+" tried to spawn rube for "+pc+" using Rube Lure, but an exception was produced.");
		throw e;
	}
}

function spawn_fox(){
	// Only one fox at a time
	var max_foxes = this.getNumActivePlayers() / 3;
	
	var num_foxes = this.countItemClass('npc_fox');
	if (num_foxes >= max_foxes) return;

	// Already have a spawn schedule?
	if (this.apiTimerExists('spawn_fox')) return;

	// Put it on the lower plat at the entrance
	var is_fox_spawner = function(it){ return it.class_tsid == 'spawner' && it.getSpawnClass() == 'npc_fox'; };
	var spawners = this.find_items(is_fox_spawner);
	if (spawners.length){
		var pt = this.apiGetPointOnTheClosestPlatformLineAbove(spawners[0].x, spawners[0].y);
		if (!pt) pt = {x: spawners[0].x, y: spawners[0].y};

		this.spawn_npc(pt.x, pt.y, 'npc_fox');
		this.sendActivity('A fox appears!');

		for (var i in this.players){
			var pc = this.players[i];
			
			if (num_foxes > 2) { 
				pc.achievements_increment("fox", "three_or_more", 1);
			}
			
			if (!pc || pc['!seen_fox_appears']) continue;

			pc.centerCamera({x: pt.x, y: pt.y}, 2500);
			pc['!seen_fox_appears'] = true;
		}
	}
}
