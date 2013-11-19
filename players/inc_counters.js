//
// Management of counters on a player
// This is like the old achievements code, except it should be used sparingly
// Only for things that you need synchronous access to
//

function counters_init(){
	if (this.counters === undefined || this.counters === null){
		this.counters = apiNewOwnedDC(this);
		this.counters.label = 'Counters';
		this.counters.counters = {};
	}
}

function counters_delete_all(){
	if (this.counters){
		this.counters.apiDelete();
		delete this.counters;
	}
}

function counters_reset(){
	
	this.counters_init();
	this.counters.counters = {};
}

function counters_increment(group, label, count){
	this.counters_init();
	
	if (count === undefined){
		count = 1;
	}
	
	if (!this.counters.counters[group]){
		this.counters.counters[group] = {};
	}
	
	if (!this.counters.counters[group][label]){
		this.counters.counters[group][label] = count;
	}
	else{
		this.counters.counters[group][label] += count;
	}
}

//
// Explicitly set a counter value
// Accomplished by nuking it and then calling counters_increment()
//

function counters_set(group, label, count){
	this.counters_init();
	
	if (count === undefined){
		count = 1;
	}
	
	if (this.counters_get_label_count(group, label) == count) return;
	
	if (this.counters.counters[group]){
		delete this.counters.counters[group][label];
		if (!count) return;
	}
		
	this.counters_increment(group, label, count);
}

//
// Get a counter value
//

function counters_get_label_count(group, label){
	if (!this.counters || !this.counters.counters[group]){ return 0; }
	return intval(this.counters.counters[group][label]);
}

//
// Number of labels in a group
//

function counters_get_group_count(group){
	if (!this.counters || !this.counters.counters[group]){ return 0; }
	return num_keys(this.counters.counters[group]);
}

//
// Sum of all labels in a group
//

function counters_get_group_sum(group){

	try{
		var sum = 0;
		for (var label in this.counters.counters[group]){
			sum += intval(this.counters.counters[group][label]);
		}
		return sum;
	} catch(e){
		return 0;
	}
}

//
// Reset a counter
//

function counters_reset_label_count(group, label){
	if (!this.counters || !this.counters.counters[group]){ return 0; }
	
	delete this.counters.counters[group][label];
	if (!num_keys(this.counters.counters[group])) this.counters_reset_group(group);
}

function counters_reset_group(group){
	delete this.counters.counters[group];
}

//////////////////////////////////////////////////////////////////////

var counter_groups_to_sync = ['time_played'];
function counters_sync_from_achievements(){
	for (var group in this.achievements.counters){
		if (!in_array_real(group, counter_groups_to_sync)) continue;

		for (var label in this.achievements.counters[group]){
			this.counters_set(group, label, this.achievements.counters[group][label]);
		}
	}
}

function counters_fix_locations_visited(){
	var locations = this.counters.counters.locations_visited;
	for (var i in locations){
		//log.info(this+' counters_fix_locations_visited checking location: '+i);
		var found = false;
		for (var group in this.counters.counters){
			if (group.substr(0, 23) == 'streets_visited_in_hub_'){
				for (var label in this.counters.counters[group]){
					if (label == i){
						found = true;
						//log.info(this+' counters_fix_locations_visited found: '+i+', value: '+this.counters.counters[group][label]);
						break;
					}
				}
			}

			if (found) break;
		}

		if (!found){
			log.info(this+' counters_fix_locations_visited not found: '+i);
			var loc = apiFindObject(i);
			if (loc && loc.countsTowardHubAchievement(this)){
				//log.info(this+' counters_fix_locations_visited counts toward achievement: '+i+', hub: '+loc.hubid);

				log.info(this+' counters_fix_locations_visited setting: streets_visited_in_hub_'+loc.hubid+', '+i+', '+locations[i]);
				this.achievements_set('streets_visited_in_hub_'+loc.hubid, i, locations[i]);
				this.counters_set('streets_visited_in_hub_'+loc.hubid, i, locations[i]);

				var count = this.counters_get_label_count('streets_visited_in_hub', 'number_'+loc.hubid);
				var group_count = this.counters_get_group_count('streets_visited_in_hub_'+loc.hubid);
				
				log.info(this+' counters_fix_locations_visited '+i+' group_count: '+group_count+', count: '+count);
				if (group_count > count){
					this.achievements_set('streets_visited_in_hub', 'number_'+loc.hubid, group_count);
					this.counters_set('streets_visited_in_hub', 'number_'+loc.hubid, group_count);
				}
			}
		}
	}
}