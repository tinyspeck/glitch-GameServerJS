//
// the function to create new POLs
//

function pols_write_create(source_tsid, pos_x, pos_y, door_type, db_sync){

	var pol_cfg = utils.get_pol_config(door_type);

	var owner_type = 1;
	if (door_type.substr(0, 5) == 'group'){
		owner_type = 2;
	}

	//
	// lock street
	//

	if (!apiAdminLockLocations(this.tsid)){

		return {
			ok: 0,
			error: 'location_is_locked'
		};
	}


	//
	// get the template/source
	//

	var source = apiFindObject(source_tsid);

	if (!source.tsid){
		return {
			ok: 0,
			error: "can't find template"
		};
	}


	//
	// create a label for the new POL
	//

	var l = this.geo.l;
	var r = this.geo.r;
	var pos = (pos_x-l) / (r-l);
	var per = Math.round(100 * pos);
	if (per < 1) per = 1;
	if (per > 100) per = 100;

	var label = ""+per+" "+this.label;


	//
	// clone the street
	//

	var new_loc = source.apiCopyLocation(label, this.moteid, this.hubid, false);


	//
	// Auto-lock?
	//

	if (owner_type == 2){
		new_loc.admin_jobs_set_locked();
	}


	//
	// make it into a pol
	//

	var cost = 0;
								// 1) did the creator pass a cost?
	if (!cost) cost = intval(pol_cfg.cost);			// 2) does the pol type have a base cost?
	if (!cost) cost = intval(source.getProp('cost'));	// 3) does the template have a cost?
	if (!cost) cost = 1000;					// 4) fallback

	new_loc.admin_make_house({
		parent_tsid: this.tsid,
		pos: pos,
	});

	new_loc.pols_setNumber(per);
	new_loc.pols_setOwnable(cost, owner_type);
	new_loc.pols_setTemplate(source.tsid);
	new_loc.pols_setImage(source.getProp('image'));
	new_loc.pols_setDoorUid(door_type);
	new_loc.setAllowSync(db_sync);

	new_loc.web_sync();
	new_loc.pols_sync();


	//
	// hook up doors/signposts
	//

	var door_ret = this.pols_write_set_door(new_loc, pos_x, pos_y, door_type);

	var link_in  = door_ret.link_in;
	var link_out = door_ret.link_out;


	// Rewrite any internal doors
	var i_links = new_loc.geo_links_get_all_doors();
	for (var i in i_links){
		if (!i_links[i].tsid || i_links[i].tsid == source.tsid){
			var door_info = source.geo_get_door_info(i_links[i].door_id);
			if (!door_info || !door_info.connect) continue;

			new_loc.geo_door_set_dest_pos(i_links[i].door_id, new_loc, door_info.connect.x, door_info.connect.y, true);
		}
	}


	//
	// unlock
	//

	apiAdminUnlockLocations(this.tsid);


	//
	// return
	//

	return {
		'ok'		: 1,
		'label'		: label,
		'number'	: per,
		'new_tsid'      : new_loc.tsid,
		'pol'		: new_loc,
		'link_in'       : link_in,
		'link_out'      : link_out,
	};
}


//
// this function is called on a parent street that already contains a POL
// and replaces that POL with a new one cloned from it's template location.
//
// this allows us to fully 'reset' a location back to it's template state,
// including changes that have been made in the template since the last clone.
//

function pols_write_replace(pol_tsid){

	//
	// get the pol to replace
	//

	var pol = apiFindObject(pol_tsid);
	if (!pol){
		return {
			ok: 0,
			error: 'pol_not_found',
		};
	}
	
	log.info('-=-=-=-=-=-=-=-=-=-==-=- Replacing POL '+pol+' on '+this);


	//
	// check that we have a door that links to
	// the pol
	//

	var door_id = null;
	for (var i in this.geometry.layers.middleground.doors){
		var door = this.geometry.layers.middleground.doors[i];
		if (door.connect && door.connect.target && door.connect.target.tsid == pol_tsid){
			door_id = i;
		}
	}
	if (!door_id){
		return {
			ok: 0,
			error: 'pol_not_on_street',
		};
	}
	var door = this.geometry.layers.middleground.doors[door_id];


	//
	// find the point on the street that the POL links to
	//

	var exit_link = {};
	var found_exit = false;

	var links = pol.geo_links_get_outgoing();
	for (var i=0; i<links.length; i++){
		if (links[i].tsid == this.tsid){
			exit_link = links[i];
			found_exit = true;
		}
	}

	if (!found_exit){
		return {
			ok: 0,
			error: 'pol_doesnt_link_back',
		};
	}


	//
	// get all of the old settings you'll need
	//

	var settings = pol.pols_get_status();
	var source = apiFindObject(settings.template);

	if (!source){
		// NOTE: this error will trip for old POLs that don't
		// link to their templates (this is good!)
		return {
			ok : 0,
			error : "template_not_found",
		};
	}


	//
	// lock street and pol
	//

	if (!apiAdminLockLocations(this.tsid, pol_tsid)){

		return {
			ok: 0,
			error: 'locations_are_locked'
		};
	}


	//
	// check that the POL is empty - disable the entry door and then
	// move any players out into the parent street.
	//

	delete this.geometry.layers.middleground.doors[door_id].connect;
	this.geo_links_remove_source(pol.tsid);

	pol.geo_links_clear_sources();
	pol.geo_clear_doors();

	pol.remove_players(this.tsid, door.x, door.y);


	//
	// delete the POL - this will magically make sure the POL is delisted
	// from the realty index and that the owner is reset.
	//
	
	apiAdminUnlockLocations(pol.tsid);
	var ret = pol.admin_delete();
	if (!ret.ok) return ret;


	//
	// clone the new POL
	//

	var new_pol = source.apiCopyLocation(settings.label, this.moteid, this.hubid, false);

	new_pol.admin_make_house({
		parent_tsid: settings.map_location,
		pos: settings.map_pos
	});

	//new_pol.pols_setOwnable(settings.cost);
	new_pol.pols_setOwnable(source.getProp('cost'));
	new_pol.pols_setTemplate(source.tsid);
	new_pol.pols_setImage(source.getProp('image'));
	new_pol.pols_setDesc(settings.desc);
	new_pol.pols_set_number_and_name(settings.house_number);
	new_pol.pols_setDoorUid(settings.door_uid);

	new_pol.web_sync();
	new_pol.pols_sync();


	//
	// hook up the door leading from pol to street
	//

	var pol_door_id = new_pol.geo_find_door_id();

	if (!pol_door_id){
		return {
			ok: 0,
			error: 'exit_door_failed'
		};
	}

	new_pol.geo_door_set_dest_pos(pol_door_id, this, exit_link.x, exit_link.y);


	//
	// hook up the door from street to pol
	//

	new_pol.geo_links_clear_sources();


	var exit_door = new_pol.geo_get_door_info(pol_door_id);

	this.geo_door_set_dest_pos(door_id, new_pol, exit_door.x-60, exit_door.y);


	//
	// restyle door
	//

	var door_info = new_pol.pols_get_door_info();
	var door_uid = door_info.uid ? door_info.uid : 'old';
	var door_cfg = utils.get_pol_config(door_uid);

	this.geo_door_set_deco(door_id, door_cfg.asset_name, door_cfg.asset_w, door_cfg.asset_h);


	//
	// unlock
	//

	apiAdminUnlockLocations(this.tsid);


	//
	// done
	//

	return {
		ok: 1,
		new_tsid: new_pol.tsid
	};
}



//
// called on the parent street to create a door leading into the
// given pol, at the given position
//

function pols_write_set_door(pol, x, y, door_uid){


	//
	// hook up exit from POL back to this street
	//

	var link_out = 0;
	var exit_link = pol.pols_find_exit();
	var exit_door_id = exit_link.door_id ? exit_link.door_id : exit_link.signpost_id;


	if (!exit_door_id){
		log.error(pol+" No door in POL template - aborting door hookup");
	}

	if (exit_door_id){

		if (exit_link.type == 'door'){
			pol.geo_door_set_dest_pos(exit_door_id, this, x, y);
		}
		else{
			pol.geo_signpost_add_dest_pos(exit_door_id, this, x, y);
		}
		link_out = 1;
	}


	//
	// hook up entry way from this street to POL
	//

	var link_in = 0;

	pol.geo_links_clear_sources();

	if (exit_door_id){

		if (exit_link.type == 'door'){
			var exit_door = pol.geo_get_door_info(exit_door_id);
		}
		else{
			var exit_door = pol.geo_get_signpost_info(exit_door_id);
		}

		var door_cfg = utils.get_pol_config(door_uid);

		var landing = pol.geo_get_teleport_point(false);
		if (!landing.found){
			landing.x = exit_door.x-60;
			landing.y = exit_door.y;
		}

		if (door_cfg.asset_name){
			var entry_door_id = this.geo_add_door({
				x : x,
				y : y,
				w : door_cfg.asset_w,
				h : door_cfg.asset_h,
				deco : {
					w : door_cfg.asset_w,
					h : door_cfg.asset_h,
					sprite_class: door_cfg.asset_name,
				},
				connect : {},
			});

			this.geo_door_set_dest_pos(entry_door_id, pol, landing.x, landing.y);
		}
		else{
			var entry_door_id = this.geo_add_signpost({
				x : x,
				y : y,
				connects : {},
			});

			this.geo_signpost_add_dest_pos(entry_door_id, pol, landing.x, landing.y);
		}

		link_in = 1;
	}


	return {
		ok: 1,
		link_out: link_out,
		link_in: link_in,
	};
}


// this is here because if the quarter is remote it will be trying
// to delete the marker before it has been properly registered on
// its own GS. we know its here for sure, because we created it.

function pols_write_remove_marker(marker_tsid){

	apiFindObject(marker_tsid).apiDelete();

}


//
// this called directly on a POL.
// it should update the geometry and static items, but leave dynamics alone.
// and somehow map cupboards and stuff. in the future, this will be how we reclone pols.
//
//
// Updates its geometry, copies *some* items from the templates, updates images
// Preserves ownership and existing items
//

function pols_write_reclone_simple(){
	if (!apiAdminLockLocations(this.tsid)){

		return {
			ok: 0,
			error: 'location_locked',
		};
	}
	
	if (!this.template){

		return {
			ok: 0,
			error: 'no template!',
		};
	}
	
	var template = apiFindObject(this.template);
	
	// Clone geo
	var doors = utils.copy_hash(this.geometry.layers.middleground.doors);
	var sources = utils.copy_hash(this.geometry.sources);
	
	var geo = template.cloneGeometry();

	// clear any targets
	geo.targets = {};

	this.replaceGeometry(geo);
	
	this.geometry.layers.middleground.doors = doors;
	this.geometry.sources = sources;
	
	// Copy images
	this.image = template.getProp('image');
	this.loading_image = template.getProp('loading_image');

	// Price
	if (this.door_uid){
		var pol_cfg = utils.get_pol_config(this.door_uid);

		var cost = intval(pol_cfg.cost);
		if (!cost) cost = intval(source.getProp('cost'));
		if (!cost) cost = 1000;
		this.pols_setCost(cost);
	}
	
	// Move patches, trants, etc
	this.upgrades_update_items(template, true);
	
	if (!this.owner){
		this.pols_reset(true);
	}
	
	// All done	
	apiAdminUnlockLocations(this.tsid);
	
	// Force players to reload
	this.upgrades_move_players('update');
	
	
	return {
		ok: 1,
	};
}
