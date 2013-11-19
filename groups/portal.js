//#include ../items/include/events.js

function init(){
	this.portals = {};
	this.active = null;
}

function create_portal(location, x, y){
	
	var drop_location = this.bump_drop_location(location, x, y);
	x = drop_location['x'];
	y = drop_location['y'];
	
	return location.createAndReturnItem('portal', 1, x, y, 0, null, null);
}

function bump_drop_location(location, x, y){
	//
	// Don't drop portals on top of signposts (spawn locations)
	// If the case, move the portal +/-100 around the sign post
	//

	var signposts = location.geo_links_get_all_signposts();

	for (var i in signposts) {
		var signpost = signposts[i];

		if (Math.abs(x - signpost.signpost_x) < 100 && Math.abs(y - signpost.signpost_y) < 100){
			x = (x > 0) ? signpost.signpost_x - 100: signpost.signpost_x + 100;
		}
	}
	
	return {'x':x, 'y':y};
}

function delete_portal(details){
	if (this.portals[details.tsid]){	
		this.portals[details.tsid].portal.apiDelete();
	}
	delete this.portals[details.tsid];
}

//
// set_active_portal is called by the newly created portal.
// this is required since the portal and the portal group (this class) could be on different GSs.
//

function set_active_portal(portal, location, x, y){
	var old_location = null;
	var old_coords = null;
	var now = getTime();
	
	var old_active = this.active;
	var old_portal = this.portals[this.active];
	if (this.active && this.portals[this.active] && this.portals[this.active].portal){
		old_location = this.portals[this.active].portal.getLocation();
		old_coords = this.portals[this.active].portal.getCoordinates();
	}
	
	this.active = portal.tsid;
	this.portals[this.active] = {portal: portal, time_created: now};	

	for (var i in this.portals){
		if (!this.portals[i].portal && (now - this.portals[i].time_created) > 5000){
			// Delete dead portals that are over 5 seconds old (incase it's a new portal still getting synced)
			if (this.active == i) this.active = null;
			delete this.portals[i];
			continue;
		}

		if (i != this.active){
			this.portals[i].portal.updatePortalData(location, x, y);
		}

		if (i != this.active && i != old_active){
			var duration = Math.max( (10*1000) - (now - this.portals[i].portal.getCreationTime()), 0);
			this.events_add({callback: 'delete_portal', tsid:i}, duration/1000);
		}
	}
	
	if (old_location) return {location: old_location.tsid, x: old_coords['x'], y: old_coords['y']};
	
	return null;
}
