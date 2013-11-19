function is_takeable(){
	return true;
}

function takeable_pickup_conditions(pc, drop_stack){
	if (this.isSoulbound() && !this.isSoulboundTo(pc)){
		return {state:'disabled', reason: "You are not allowed to pick this up."};
	}

	if (this.is_bag){
		var contents = this.getAllContents();
		for (var i in contents){
			var it = contents[i];
			if (!it) continue;

			if (it.isSoulbound() && !it.isSoulboundTo(pc)) return {state:'disabled', reason: "You are not allowed to pick this up."};
		}
	}

	if (this.canPickup){
		var can_pickup = this.canPickup(pc, drop_stack);
		if (!can_pickup['ok']){
			if (!can_pickup['error']) return {state:null};
			return {state:'disabled', reason: can_pickup['error']};
		}
	}
		
	if (this.pc_can_pickup && this.pc_can_pickup != pc.tsid){
		return {state:'disabled', reason: "You are not allowed to pick this up."};
	}

	if (this.dropper && this.dropper != pc.tsid){
		if (this.house_lock && pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)){
			return {state:'disabled', reason: "You are not allowed to pick this up."};
		}
		else{
			var dropper = this.container.activePlayers ? this.container.activePlayers[this.dropper] : null;
			if (dropper && this.distanceFromPlayer(dropper) < 100){
				return {state:'disabled', reason: "You are not allowed to pick this up."};
			}
			else{
				delete this.dropper;
				delete this.dropped_on;
			}
		}
	}

	if (!this.is_trophy && pc.isBagFull(this)) return {state:'disabled', reason: "Your inventory is full!"};
	
	return {state:'enabled'};
}

function takeable_pickup(pc, msg){

	var bag = null;
	var auto_sorted = false;

	if (!msg.destination_tsid || msg.destination_tsid == pc.tsid){
		bag = pc;
	}else{
		var items = pc.getAllContents();
		bag = items[msg.destination_tsid];
	}

	if (!bag){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid destination."));
		return false;
	}
	
	if (pc.location.is_newxp){
		if (pc.location.firstInventory && pc.location.firstInventory() && pc.location.firstInventoryShowOverlay){
			return pc.location.firstInventoryShowOverlay(pc, this, msg);
		}
	}

	if (!this.is_trophy && bag.isBagFull(this)){
		pc.announce_sound('PACK_FULL');
		pc.sendActivity('Your bag is full!');
		return false;
	}

	delete this.dropper;
	delete this.dropped_on;
	delete this.house_lock;

	var slot = hasIntVal(msg.destination_slot) ? intval(msg.destination_slot) : null;

	var remainder = bag.addItemStack(this, slot, pc);
	if (remainder > 0){
		if (remainder == msg.count){
			pc.announce_sound('PACK_FULL');
			pc.apiSendMsg(make_fail_rsp(msg, 1, "That slot is full."));
		}else if (auto_sorted){
			remainder = pc.addItemStack(this);
		}
	}
	
	if (this.onPickup) this.onPickup(pc, msg);

	pc.announce_sound('ITEM_PICKUP');
	return true;
}

function takeable_drop_conditions(pc, drop_stack){

	if (pc.location.is_newxp && this.class_tsid == 'egg_plain'){
		return {state:null};
	}

	if (this.canDrop){
		var can_drop = this.canDrop(pc, drop_stack);
		if (!can_drop['ok']){
			if (!can_drop['error']) return {state:null};
			return {state:'disabled', reason: can_drop['error']};
		}
	}

	if (pc.is_dead){ return {state:'disabled', reason: "You're dead!"}; }
	if (this.isQuestItem()) return {state:'disabled', reason: "This item is needed for a quest and can't be dropped."};
	if (this.isSoulbound()) return {state:'disabled', reason: "This item is locked to you and can't be dropped."};

	if (this.is_bag){
		var contents = this.getAllContents();
		for (var i in contents){
			var it = contents[i];
			if (!it) continue;

			if (it.isSoulbound()) return {state:'disabled', reason: "This contains items locked to you and can't be dropped."};
		}
	}

	if (!this.takeable_check_furniture_plats(pc)) return {state:'disabled', reason: "This item can't be placed on furniture."};
		
	return {state:'enabled'};
}

function takeable_check_furniture_plats(pc){
	if (this.hasTag('no_shelf')){
		var pl = pc.location.apiGetClosestPlatformLineBelow(pc.x, pc.y-1);
		//log.info(this+' pl: '+pl);
		if (pl){
			var plats = pc.location.geo_find_plats(pl.x1, pl.y2, pl.x2, pl.y1, false);
			//log.info(this+' plats: '+plats);
			for (var i in plats){
				var plat = plats[i];
				if (!plat) continue;

				//log.info(this+' plat: '+plat);
				if (plat.source) return false;
			}
		}
	}

	return true;
}

function takeable_drop(pc, msg, no_offset){

	if (pc.is_dead) return false;
	if (this.isQuestItem()) return false;

	this.takeable_drop_lock(pc);
	
	var dest_x = pc.x;
	var dest_y = (no_offset) ? pc.y : pc.y-20;
	var merge = true;
	
	if (msg && !isNaN(msg.drop_x) && !isNaN(msg.drop_y)){
		dest_x = intval(msg.drop_x);
		dest_y = intval(msg.drop_y);
	}
	
	if (msg && msg.no_merge === true){
		merge = false;
	}

	if (pc.location.tsid == pc.houses_get_interior_tsid() || pc.location.tsid == pc.houses_get_tower_tsid()){
		var pl = pc.location.apiGetClosestPlatformLineBelow(dest_x, dest_y-1);
		if (config.is_dev) log.info(this+' apiGetClosestPlatformLineBelow('+dest_x+', '+dest_y+'): '+pl);
		if (pl){
			// Platline needs to have x1,y1 in the upper-left
			if (pl.y2 < pl.y1){
				pl = {
					x1: pl.x2,
					y1: pl.y2,
					x2: pl.x1,
					y2: pl.y1
				};
			}
			
			var plats = pc.location.geo_find_plats(pl.x1, pl.y1, pl.x2, pl.y2);
			if (config.is_dev) log.info(this+' geo_find_plats: '+plats);
			for (var i in plats){
				if (plats[i].source){
					this.house_lock = true;
					if (pc.growl_plat_locks) pc.sendActivity(this.name_single+' locked to furniture plat');
				}
			}
		}
	}
	
	if (config.is_dev){
		pc.location.apiPutItemIntoPosition(this, dest_x, dest_y, merge);
	}
	else{
		pc.location.apiPutItemIntoPosition(this, dest_x, dest_y);
	}
	
	if (this.onDrop) this.onDrop(pc, msg);

	pc.announce_sound('ITEM_DROP');
	return true;
}

function takeable_drop_lock(pc){
	this.dropped_on = time();
	this.dropper = pc.tsid;
}

function takeable_give_conditions(pc, drop_stack){
	if (this.isSoulbound()){
		return {state:'disabled', reason: "This item is locked to you and can't be given to another player."};
	}

	if (this.is_bag){
		var contents = this.getAllContents();
		for (var i in contents){
			var it = contents[i];
			if (!it) continue;

			if (it.isSoulbound()) return {state:'disabled', reason: "This contains items locked to you and can't be given to another player."};
		}
	}

	if (this.isQuestItem()) return {state:'disabled', reason: "This item is needed for a quest and can't be given to another player."};
	
	if (this.canGive){
		var can_give = this.canGive(pc, drop_stack);
		if (!can_give['ok']){
			if (!can_give['error']) return {state:null};
			return {state:'disabled', reason: can_give['error']};
		}
	}
	
	return {state:'enabled'};
}

function takeable_give(pc, msg){

	var targetPC = pc.location.activePlayers[msg.object_pc_tsid];
	
	if (this.isQuestItem()) return false;

	if (!targetPC){
		return false;
	}
	
	if (pc.buddies_is_ignored_by(targetPC)){
		pc.sendActivity('You are blocked by that player and cannot give them anything.');
		return false;
	}
	else if (pc.buddies_is_ignoring(targetPC)){
		pc.sendActivity('You are blocking that player and cannot give them anything.');
		return false;
	}
	
	if (!this.has_parent('furniture_base') && targetPC.isBagFull(this)){
		pc.sendActivity('Their bag is full!');
		targetPC.sendActivity(pc.label+' tried to give you '+this.formatStack(this.count)+', but your bag was full!', pc);
		return false;
	}

	pc.sendActivity('You gave '+targetPC.linkifyLabel()+' '+this.formatStack(this.count)+'.');
	targetPC.sendActivity(pc.label+' gave you '+this.formatStack(this.count)+'.', pc);

	targetPC.addItemStack(this);

	pc.achievements_increment('items_given', this.class_tsid, 1); // 'items_given' increments per stack, so we increment +1
	targetPC.announce_sound('ITEM_GIVE');
	targetPC.achievements_increment('items_received', this.class_tsid, 1);
	targetPC.announce_sound('ITEM_GIVEN_TO_YOU');

	if (targetPC.stats_get_level() >= 3 && targetPC.stats_get_level() <= 5 && pc.getQuestStatus('kindly_randomness') == 'todo'){
		if (!pc.kindly_randomness) pc.kindly_randomness = {};
		if (!pc.kindly_randomness[targetPC.tsid]){
			pc.kindly_randomness[targetPC.tsid] = 1;
			pc.quests_inc_counter('give_player_level1', 1);
		}
	}
	
	if (this.onGive) this.onGive(pc, msg);

	return true;
}