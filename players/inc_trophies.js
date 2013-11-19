function trophies_reset(){
	var container = this.trophies_find_container();

	var items = container.apiGetAllItems();
	for (var i in items){
		if (!in_array(items[i].class_tsid, this.collectible_item_classes)){
			items[i].apiDelete();
		}
	}

	//container.apiDelete();
}

function trophies_find_container(){
	for (var i in this.hiddenItems){
		var it = this.hiddenItems[i];
		if (it.is_trophycontainer){
			if (it.class_tsid == 'bag_generic'){
				// This is outdated. Make a new one
				var new_it = apiNewItemStack('bag_private', 1);
				new_it.label = 'Private Trophy Storage';
				new_it.is_trophycontainer = true;

				this.apiAddHiddenStack(new_it);
				
				// Move items
				var contents = it.getContents();
				for (var slot in contents){
					if (contents[slot]){
						var trophy = it.removeItemStackSlot(slot);
						new_it.addItemStack(trophy);
					}
				}
				
				it.apiDelete();
				return new_it;
			}
			return it;
		}
	}
	
	// Still here? Make a new one
	var it = apiNewItemStack('bag_private', 1);
	it.label = 'Private Trophy Storage';
	it.is_trophycontainer = true;
	
	this.apiAddHiddenStack(it);
	
	return it;
}

function trophies_add_hidden(trophy){
	// If we have one already, pretend it worked
	if (this.trophies_has(trophy.class_tsid)){
		trophy.apiDelete();
		this.furniture_migrate_trophies();
		return 0;
	}

	var bag = this.trophies_find_container();

	var ret = bag.addItemStack(trophy);
	this.furniture_migrate_trophies();
	return ret;
}

function trophies_get_hidden(){
	var bag = this.trophies_find_container();
	
	return bag.getAllContents();
}

function trophies_has(class_tsid){

	var trophies = this.trophies_get_hidden();
	for (var i in trophies){
		var t = trophies[i];
		if (!t) continue;

		if (t.class_tsid == class_tsid) return true;
	}

	var houses = this.houses_get_old();
	for (var i in houses){
		var house = houses[i];
		if (!house) continue;

		if (house.countItemClass(class_tsid)) return true;

		var bags = house.getBags();
		for (var j in bags){
			var bag = bags[j];
			if (!bag) continue;

			if (bag.countItemClass(class_tsid)) return true;
		}
	}

	return false;
}

function trophies_clean_and_sync(){

	//
	// Find all the trophies we have, how many there are, and what the earliest date on them is
	//

	var uniques = {};
	var best_dates = {};

	var trophies = this.trophies_get_hidden();
	for (var i in trophies){
		var t = trophies[i];
		if (!t) continue;

		if (!uniques[t.class_tsid]) uniques[t.class_tsid] = 0;
		uniques[t.class_tsid]++;

		var ago = t.getProp('ago') ? t.getProp('ago') : t.ts;
		if (!best_dates[t.class_tsid] || best_dates[t.class_tsid] > ago) best_dates[t.class_tsid] = ago;
	}

	for (var i in this.home){
		var house = this.home[i];
		if (!house) continue;

		var items = house.getItems();
		for (var j in items){
			var it = items[j];
			if (!it) continue;

			if (it.getProp('is_trophy')){
				if (!uniques[it.class_tsid]) uniques[it.class_tsid] = 0;
				uniques[it.class_tsid]++;

				var ago = it.getProp('ago') ? it.getProp('ago') : it.ts;
				if (!best_dates[it.class_tsid] || best_dates[it.class_tsid] > ago) best_dates[it.class_tsid] = ago;
			}
			else if (it.getProp('is_bag')){
				var bag_items = it.getAllContents();
				for (var k in bag_items){
					var bag_it = bag_items[k];
					if (!bag_it) continue;

					if (bag_it.getProp('is_trophy')){
						if (!uniques[bag_it.class_tsid]) uniques[bag_it.class_tsid] = 0;
						uniques[bag_it.class_tsid]++;

						var ago = bag_it.getProp('ago') ? bag_it.getProp('ago') : bag_it.ts;
						if (!best_dates[bag_it.class_tsid] || best_dates[bag_it.class_tsid] > ago) best_dates[bag_it.class_tsid] = ago;
					}
				}
			}
		}
	}


	//
	// Now go through them again, starting with trophy cases, and delete the extras
	//

	for (var class_tsid in uniques){
		if (uniques[class_tsid] == 1) continue;

		var deleted = 0;
		for (var i in this.home){
			var house = this.home[i];
			if (!house) continue;

			var items = house.getItems();
			for (var j in items){
				var it = items[j];
				if (!it) continue;

				if (it.getProp('is_bag')){
					var bag_items = it.getAllContents();
					for (var k in bag_items){
						var bag_it = bag_items[k];
						if (!bag_it) continue;

						if (config.is_dev) log.info(this+' Checking '+bag_it+' against '+class_tsid);
						if (bag_it.class_tsid == class_tsid && bag_it.is_trophy){
							if (deleted === 0){
								bag_it.setProp('ago', best_dates[class_tsid]);
								deleted++;
							}
							else{
								if (config.is_dev) log.info(this+' deleting '+bag_it);
								bag_it.apiDelete();
								deleted++;
							}

							if (deleted == uniques[class_tsid]) break;
						}
					}
				}
				else if (it.class_tsid == class_tsid && it.is_trophy){
					
					if (deleted === 0){
						it.setProp('ago', best_dates[class_tsid]);
						deleted++;
					}
					else{
						if (config.is_dev) log.info(this+' deleting '+it);
						it.apiDelete();
						deleted++;
					}
				}

				if (deleted == uniques[class_tsid]) break;
			}

			if (deleted == uniques[class_tsid]) break;
		}

		for (var i in trophies){
			var t = trophies[i];
			if (!t) continue;

			if (t.class_tsid == class_tsid){
				if (deleted === 0){
					t.setProp('ago', best_dates[class_tsid]);
					deleted++;
				}
				else{
					t.apiDelete();
					deleted++;
				}

				if (deleted == uniques[class_tsid]) break;
			}
		}
	}


	//
	// Now sync with furniture
	//

	this.furniture_migrate_trophies();
}