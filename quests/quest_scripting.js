/* Anything on quests dealing with quest locations. */

function questEnterQuestLocation(location) {
	//if (config.is_dev) log.info(this+" questEnterQuestLocation "+location);
	if(this.onEnterLocation) {
		this.onEnterLocation(location);
	}
	this.last_quest_location = location;
}

function questEnterOutsideLocation(location) {
	if (config.is_dev) log.info(this+" questEnterOutsideLocation "+location);
	if(this.last_quest_location == location) {
		if (config.is_dev) log.info(this+" questEnterOutsideLocation previously "+this.last_quest_location);
		if(this.onExitLocation) {
			this.onExitLocation(this.last_quest_location);
		}
		delete this.last_quest_location;
	}
}

function questGetLastQuestLocation() {
	return this.last_quest_location;
}

function questInstanceLocation(pc, name, x, y, exit_delay, options, location_options, use_teleport_markers) {
	for (var i in this.locations) {
		if (i == name) {
			var tsid = config.is_dev ? this.locations[i].dev_tsid : this.locations[i].prod_tsid;

			if (use_teleport_markers){
				var loc = apiFindObject(tsid);
				var marker = loc.find_items('marker_teleport')[0];
			
				if (marker){
					x = marker.x;
					y = marker.y;
				}
			}
			
			log.info(this+" questInstanceLocation creating instance "+name+" from "+tsid+" for "+pc);
			pc.events_add({ callback: 'instances_create_delayed', tsid: tsid, instance_id: name, x: x, y: y, exit_delay: exit_delay, options: options, location_options: location_options}, 0.1);
			return;
		}
	}
	
	log.error("Attempt by quest "+this+" to instance unknown location "+name+" for pc "+pc);
}

function questDoCallback(callback_id, details) {
	var fName = "callback_"+callback_id;
	if (!this[fName] || typeof this[fName] != 'function') {
		if (details && details.if_exists) {
			log.error("ERROR: attempt to call invalid callback "+fName+" on quest "+this);
		}
		return;
	}
//	var fn_string = "this."+fName+"(pc, details);";
//	log.info("Invoking callback with: "+fn_string);
//	eval(fn_string);
	
	this[fName](details);
	
	return true;
}

function callback_npcCollision(details) {
	if(this.owner != details.pc) {
		return;
	}
	if(this.onNpcCollision) {
		this.onNpcCollision(details.pc, details.npc_name);
	}
}

function sendNPCMessage(npc_name, msg_type, details) {
	log.info("Invoking NPC message "+msg_type+" on "+npc_name+" for quest owned by "+this.owner);
	if(this.owner) {
		this.owner.location.quests_message_npc(npc_name, msg_type, details);
	}
}

function sendNPCMessageDelayed(npc_name, msg_type, details, delay) {
	log.info("Invoking NPC message "+msg_type+" on "+npc_name+" for quest owned by "+this.owner);
	if(this.owner) {
		this.owner.location.quests_message_npc_delayed(npc_name, msg_type, details, delay);
	}
}