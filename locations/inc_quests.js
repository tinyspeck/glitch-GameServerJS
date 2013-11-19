/* This handles all the locational quests stuff: i.e., entrance/exit callbacks, NPC event callbacks and
 * hitboxes.
 * 
 * One issue is that right now it isn't terribly efficient. Every time an event needs to be passed to a PC,
 * we iterate over all quests on that PC to see which ones we might be a quest location for.
 * A proposed improvement is to cache PC quests when they enter. However, then these will need to be
 * updated if a PC in a location starts a new quest or finishes an existing quest. Furthermore,
 * we'd need to be careful about location hash bloat and discarding the cached quest data
 * on PCs logging out or leaving the location. So it's non-trivial, but would be a good
 * way to reorganize this in future.
 */

function quests_enter_location(pc) {
	var tsid = this.isInstance() ? this.instance_of : this.tsid;
	var quest_locs = pc.quests_get_from_location(tsid);


	for (var i in quest_locs.not_in_loc) {
		quest_locs.not_in_loc[i].quest.questEnterOutsideLocation(quest_locs.not_in_loc[i].location);
	}

	for (var i in quest_locs.in_loc) {
		quest_locs.in_loc[i].quest.questEnterQuestLocation(quest_locs.in_loc[i].location);
	}
}

// Invoke a named callback on any active player quests for which we are a location.
function quests_do_callback(pc, callback_id, details) {
	var found = false;
	var tsid = this.isInstance() ? this.instance_of : this.tsid;
	//if (config.is_dev) log.info(this+' quests_do_callback tsid: '+tsid);
	var quest_locs = pc.quests_get_from_location(tsid);
	//if (config.is_dev) log.info(this+' quests_do_callback quest_locs: '+quest_locs);
	
	for (var i in quest_locs.in_loc) {
		if (quest_locs.in_loc[i].quest.questDoCallback(callback_id, details)) {
			found = true;
		}
	}
	
	return found;
}

function quests_do_callback_all(callback_id, details) {
	// Check all PCs in this location. If this is a quest location for any of them, invoke a callback.
	var players = this.getActivePlayers();
	for (var i in players) {
		this.quests_do_callback(players[i], callback_id, details);
	}
}

function quests_message_npc_delayed(npc_name, msg_type, details, delay) {
	for (var i in this.items) {
		var name = this.items[i].getInstanceProp('npc_name');
		if (name && name == npc_name) {
			this.items[i].handleDelayedMessage(msg_type, details, delay);
		}
	}
}

function quests_message_npc(npc_name, msg_type, details) {
	for (var i in this.items) {
		var name = this.items[i].getInstanceProp('npc_name');
		if (name && name == npc_name) {
			this.items[i].handleQuestMessage(msg_type, details);
		}
	}
}

function quests_trigger_hitbox(pc, hitbox_name) {
	return this.quests_do_callback(pc, hitbox_name, {if_exists: true, pc: pc});
}

function quests_get_spawners(quest_name) {
	var spawners = [];
	for (var i in this.items) {
		var stack = this.items[i]
		
		if(stack.class_tsid == 'quest_spawner' && stack.getInstanceProp('quest_name') == quest_name) {
			spawners.push({x: stack.x, y: stack.y});
		}
	}
	
	return spawners;
}