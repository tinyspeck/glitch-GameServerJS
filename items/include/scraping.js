// This file contains support for social scraping. Mostly copied from mining.js

function getVerbLabel(pc, verb) {
	if(verb == 'scrape') {
		/* Weird race condition — if you hammer on the button, you can get the verb window again after the progress bar vanishes
		 * but before scraping is actually completed. This means that if you're the only scraper, you can get "help mine" as the
		 * verb if you just hit the button fast enough. Ugh.
	     */
	     	var scraper_count = utils.num_keys(this.scrapers);


		if(!this.scrapers || scraper_count == 0 || (scraper_count == 1 && this.scrapers[0] == pc.tsid)) {
			return "Scrape";
		} else {
	 		return "Help scrape";
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

function scrapingSanityCheck() {
	// Remove any PCs who aren't still in the area or aren't still mining.
	if (!this.scrapers) this.scrapers = [];
	for(var i in this.scrapers) {
		var player = getPlayer(this.scrapers[i]);
		if (player) {
			if(!player['!scraping'] || player['!scraping'] != this.tsid || !player.isOnline() || player.location != this.container) {
				//log.info("ICE Scraping sanity check found scraper "+player+" on "+this+" who shouldn't be there.");
				
				this.removeScraper(player, true);
			}
		}
	}
}

function addScraper(pc) {
	// Push scraper onto the stack
	if(!this.scrapers) {
		this.scrapers = [];
	}
	
	// Set up helpers for this player
	if(!this.helpers) {
		this.helpers = {};
	}
	this.helpers[pc.tsid] = {};	

	// add this player to all existing helper stacks
	for(var i in this.helpers) {
		if (i != pc.tsid) {
			if(!this.helpers[i][pc.tsid]) {
				this.helpers[i][pc.tsid] = 1;
			} else {
				this.helpers[i][pc.tsid]++;
			}
		}
	}
	
	//log.info("ICE helpers first "+pc+" "+this.helpers[pc.tsid]);
	
	// add all current scrapers to this player's helper stack
	for (var i in this.scrapers) {
		if(!this.helpers[pc.tsid][this.scrapers[i]]) {
			this.helpers[pc.tsid][this.scrapers[i]] = 1;
		} else {
			this.helpers[pc.tsid][this.scrapers[i]] ++;
		}
	}
	
	//log.info("ICE helpers second "+pc+" "+this.helpers[pc.tsid]);
	
	this.scrapers.push(pc.tsid);
	
	//log.info("ICE scrapers "+this.scrapers);
}

function removeScraper(pc, cancel) {
	if (!this.scrapers) this.scrapers = [];
	
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
	if (this.helpers && this.helpers[pc.tsid]) {
		delete this.helpers[pc.tsid];
	}
	
	// Remove me from the stack!
	var index = 0;
	for(var i in this.scrapers) {
		if(this.scrapers[i] == pc.tsid) {
			this.scrapers.splice(i, 1);
			break;
		}
	}
	
	//log.info("ICE scrapers "+this.scrapers);
}

// just one ice per person who was scraping at the same time as you
function getBonus(pc){
	return num_keys(this.helpers[pc.tsid]);
}


function onOverlayDismissed(pc, payload){
	this.removeScraper(pc, true);
}
