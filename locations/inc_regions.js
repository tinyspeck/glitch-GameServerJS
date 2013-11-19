//#include savanna.js
// Hub-related functionality. Useful for events and callbacks occurring hub-wide.

function region_on_enter(pc) {
	log.info(pc+" entering hub "+this.hubid+", "+config.hubs[this.hubid]+" in region "+this.hub_region());
	
	// Did we just change regions? If so, run any hub exiting callbacks for this hub.
	if(pc.last_region() != this.hub_region()) {
		// Run any functionality for the region we just left
		switch(pc.last_region()) {
			case 'Savanna':
				this.savanna_on_exit(pc, false);
				break;
		}		
	} 
	
	// Run any functionality for the hub we entered
	switch(this.hub_region()) {
		case 'Savanna':
			this.savanna_on_enter(pc, false);
			break;
	}
	
	// Continue to track regions. Update last hub id.
	pc.last_hub_visited = this.hubid;
}

function region_on_reconnect(pc) {
	log.info(pc+" reconnecting to hub "+this.hubid+", "+config.hubs[this.hubid]+" in region "+this.hub_region());
	
	// Run any functionality for the hub we entered
	switch(this.hub_region()) {
		case 'Savanna':
			this.savanna_on_reconnect(pc);
			break;
	}
}

function region_logout(pc) {
	switch(this.hub_region()) {
		case 'Savanna':
			this.savanna_on_exit(pc, true);
			break;
	}		
}

function region_login(pc) {
	switch(this.hub_region()) {
		case 'Savanna':
			this.savanna_on_enter(pc, true);
			break;
	}	
	
}

function hub_region() {
	if(config.hubs[this.hubid]) {
		return config.regions[config.hubs[this.hubid]];
	} else {
		return 'None';
	}
}