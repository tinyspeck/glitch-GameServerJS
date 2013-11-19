
var is_skillquest = true;

function setupTeleporter(pc){
	var newbie_island = {};
	newbie_island.tsid = config.newxp_locations['newbie_island'];
	newbie_island.x = '-2302';
	newbie_island.y = '-77';
	
	var teleporters = this.find_items('teleporter');
	for (var i in teleporters){
		if (!pc.has_done_intro){
			teleporters[i].setInstanceProp('target_tsid', newbie_island.tsid);
			teleporters[i].setInstanceProp('target_x', newbie_island.x);
			teleporters[i].setInstanceProp('target_y', newbie_island.y);
		}else{
			var prev = pc.instances_get_exit(pc.location.instance_id);
			if (prev) {
				teleporters[i].setInstanceProp('target_tsid', prev.tsid);
				teleporters[i].setInstanceProp('target_x', prev.x);
				teleporters[i].setInstanceProp('target_y', prev.y);
			}
		}
	}
}

function onTeleporterCollision(pc, teleporter){
	if (!pc.has_done_intro){
		var newbie_island = {};
		newbie_island.tsid = config.newxp_locations['newbie_island'];
		newbie_island.x = '-2302';
		newbie_island.y = '-77';

		pc.teleportToLocation(newbie_island.tsid, newbie_island.x, newbie_island.y);
	}else{
		var prev = pc.instances_get_exit(pc.location.instance_id);
		if (prev){
			pc.teleportToLocation(prev.tsid, prev.x, prev.y);
		}
	}
}

function broadcastLocationEvent(event, send_on_reload){
	if (!this.location_events_broadcast) this.location_events_broadcast = [];
	if (send_on_reload) this.location_events_broadcast.push(event);
	this.events_broadcast(event);
}

function rebroadcastLocationEvent(){
	if (!this.location_events_broadcast) this.location_events_broadcast = [];
	for (var i in this.location_events_broadcast){
		this.events_broadcast(this.location_events_broadcast[i]);
	}
}