//
// this file contains functions that load data needed for displaying profiles
// on the website. things are componentized so we only load the data we need
// on each page.
//


//
// for each house, we make one remote call, which in turn makes one
// remote call to its parent street.
//

function profile_get_houses(){
	if (!this.home_profile) this.profile_update_house_info();

	if (this.home_profile){
		return this.home_profile;
	} else {
		return {};
	}
}

function profile_get_home_street(){
	if (!this.home_profile) this.profile_update_house_info();

	if (this.home_profile && this.home_profile.exterior){
		return this.home_profile.exterior;
	} else {
		return {};
	}
}

function profile_update_house_info(){
	if (!this.home_profile) this.home_profile = {};

	if (!this.home) return;

	var out = {};

	var found_house = false;

	for (var i in this.home){
		var house = this.home[i];
		if (house && !house.getProp('is_deleted')){
			out[i] = house.pols_get_profile_info();
		}
	}

	this.home_profile = out;
}

//
// one remote call per group
//

function profile_get_groups(is_self){

	var out = [];

	if (!this.groups) return out;

	for (var i in this.groups.groups){

		var info = this.groups.groups[i].get_basic_info();

		if (info.mode == 'public' || info.mode == 'public_apply' || is_self){

			out.push(info);
		}
	}

	return out;
}


//
// no remote calls, no IO
//

function profile_get_metabolics(){

	var out = {};

	out.energy = {
		'value' : this.metabolics.energy.value,
		'max'   : this.metabolics.energy.top,
	};

	out.mood = {
		'value' : this.metabolics.mood.value,
		'max'   : this.metabolics.mood.top,
	};

	return out;
}


//
// no remote calls, loads all items in pack
//

function profile_get_inventory(){

	var out = [];

	var items = this.apiGetAllItems();
	for (var i in items){
		var item = items[i];

		out.push({
			'tsid'		: item.tsid,
			'class_tsid'	: item.class_tsid,
			'stack_size'	: item.count,
		});
	}

	return out;
}
