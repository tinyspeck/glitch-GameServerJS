//
// this is the base class for quarter steets.
// quarters themselves are not a location, but are managed by a group with class=quarter.
//


//
// this function propogates the quarter ownership, naming and map position data.
// we need to send all of this info to our POLs too
//

function set_quarter_info(args){

	this.quarter_template_uid	= args.template_uid;
	this.quarter_tsid		= args.quarter_tsid;
	this.quarter_style		= args.quarter_style;

	// naming
	this.label = args.street_label;

	// map data
	this.mapLocation = args.exit_tsid;
	this.mapPos = args.exit_pos;
	this.mapChildren = {};

	// send to our child POLs
	var pols = this.quarters_get_pols();
	for (var i in pols){
		var pol = apiFindObject(i);
		pol.pols_quarter_settings(args);
	}
}


//
// clone geometry
//

function clone_quarter_geometry(template){

	var geo = template.cloneGeometry();

	// clear any targets
	geo.targets = {};

	this.replaceGeometry(geo);
	this.template = template.tsid;

	// copy location props (like events)
	this.cloneLocationInfo(template);
}


//
// set any signposts in the location to be quarter signposts
//

function set_quarter_signposts(tsid){

	var geo = this.geometry;
	if (!geo) return;
	if (!geo.layers) return;
	if (!geo.layers.middleground) return;

	var s = geo.layers.middleground.signposts;
	if (s){

		for (var i in s){
			var sign = s[i];

			sign.connects = {};
			sign.quarter = tsid;
		}
	}

	if (this.quarter_style == 'single'){
		var d = geo.layers.middleground.doors;
		if (d){

			for (var i in d){
				var door = d[i];

				door.connect = {};
				door.quarter = tsid;
			}
		}
	}
}


function create_pols_from_markers(){

	var created = 0;

	for (var i in this.items){

		if (this.items[i] && this.items[i].class_tsid == 'lot_marker'){

			var marker = this.items[i];
			var info = marker.get_pol_info();

			if (info.chassis){

				var pol = utils.get_pol_config(info.chassis);

				log.info("creating a pol from "+pol.template_tsid+'/'+pol.uid+' at '+info.x+','+info.y);

				var ret = this.pols_write_create(pol.template_tsid, info.x, info.y, pol.uid, false);
				if (!ret.ok) return ret;

				if (info.num){
					ret.pol.pols_setNumber(info.num);
				}

				marker.apiDelete();

				created++;
			}else{
				log.error('no chassis set on marker');
			}
		}
	}

	return {
		ok: 1,
		created: created,
	};
}


function count_pols(){
	var info = this.quarters_get_pols();

	return num_keys(info);
}


function rebuild_quarter_street(args){

	this.quarter_style = args.quarter_style;


	//
	// get the template street
	//

	var template = apiFindObject(args.template_tsid);

	if (!template){
		log.error("couldn't load street for quarter template uid: "+args.template_uid+", "+args.template_tsid);
		return {
			ok: 0,
			error: 'bad_uid_template',
		};
	}


	//
	// lock
	//

	if (!apiAdminLockLocations(this.tsid)){

		return {
			ok: 0,
			error: 'location_locked',
		};
	}


	//
	// save the old locations of doors
	//

	var old_pols = this.quarters_get_pols();


	//
	// apply the new geometry.
	// this will destroy all existing POL doors.
	// all doors & signposts in the template street will be converted to either
	// quarter signposts or exits (not sure how we'll decide that yet).
	//

	this.clone_quarter_geometry(template);

	this.set_quarter_signposts(args.quarter_tsid);


	//
	// remove/add/move items.
	// we do this first so we can match up lot markers to existing pols.
	//

	this.upgrades_update_items(template, true);


	//
	// get the list of POL markers - we may be able to map them onto
	// lot markers in the new street. we need to produce one map per
	// chassis type, then merge them all into a single super-map.
	//

	var new_pols = this.quarters_get_template_pols();

	var old_pols_map = this.pols_to_posmaps(old_pols);
	var new_pols_map = this.pols_to_posmaps(new_pols);

	var pols_map = {};

	for (var i in old_pols_map){
		if (new_pols_map[i]){

			var sub_map = this.upgrades_map_closest(old_pols_map[i], new_pols_map[i], true);

			for (var j in sub_map){
				pols_map[j] = sub_map[j];
			}
		}
	}


	//
	// we end up with 3 TSID lists - POLs in the template that will need creating (pols_add), POLs
	// that exist in both that need moving (pols_map) and POLs that only exist in the instance and
	// need to be removed (pols_remove).
	//

	var pols_add = {};
	var pols_remove = {};

	for (var i in old_pols){
		if (!pols_map[i]){
			pols_remove[i] = 1;
		}
	}
	for (var i in new_pols){
		var found = false;
		for (j in pols_map){
			if (pols_map[j] == i) found = true;
		}
		if (!found) pols_add[i] = 1;
	}

	//log.info(old_pols);
	//log.info(new_pols);
	//log.info(pols_map);
	//log.info(pols_add);
	//log.info(pols_remove);

	var plan_add = num_keys(pols_add);
	var plan_del = num_keys(pols_remove);
	var plan_mov = num_keys(pols_map);

	log.info("Planning to add "+plan_add+" new pols, reuse "+plan_mov+" and delete "+plan_del);


	//
	// place doors to existing POLs which can be mapped to lot markers,
	// removing those lot markers
	//

	var moved = 0;

	for (var pol_tsid in pols_map){

		var marker_tsid = pols_map[pol_tsid];
		var pol = apiFindObject(pol_tsid);
		var marker = apiFindObject(marker_tsid);

		log.info("creating door for existing pol "+pol_tsid+" from marker "+marker_tsid);

		var new_info = new_pols[marker_tsid];
		var old_info = old_pols[pol_tsid];

		this.pols_write_set_door(pol, new_info.x, new_info.y, old_info.chassis);

		if (new_info.num){
			log.info('setting number of existing pol to '+new_info.num);
			pol.pols_setNumber(new_info.num);
		}else{
			log.info('no number to set for existing pol', new_info);
		}

		this.pols_write_remove_marker(marker_tsid);
		
		// Reset cost
		var pol_cfg = utils.get_pol_config(pol.getProp('door_uid'));
		var source = apiFindObject(pol.getProp('template'));
			
		var cost = intval(pol_cfg.cost);
		if (!cost) cost = intval(source.getProp('cost'));
		if (!cost) cost = pol.getProp('cost');
		if (!cost) cost = 1000;
			
		log.info('setting cost of pol to '+cost);
		pol.pols_setCost(cost);

		moved++;
	}


	//
	// remove POLs that we've been unable to map
	//

	var deleted = 0;

	for (var i in pols_remove){

		deleted++;
		var pol = apiFindObject(i);
		var info = pol.pols_get_status();

		if (info.owner){
			log.error('*************** Not deleteing an owned POL, '+i);
			this.pols_write_set_door(pol, 0, 0, null);
		}else{
			this.pols_delete(pol);
		}
	}


	//
	// remove geo lock so that creating new pols will work
	//

	apiAdminUnlockLocations(this.tsid);


	//
	// create POLs for remaining lot markers
	//

	var ret = this.create_pols_from_markers();
	var created = ret.ok ? ret.created : 0;


	//
	// force players to reload
	//

	this.upgrades_move_players('update');


	//
	// update quarter info, names & map data for slot street
	// and pols
	//

	// this.propagate_settings(x, y);


	//
	// all done
	//

	log.info("We created "+created+" pols, reused "+moved+" and removed "+deleted);

	return {
		ok		: 1,
		teleport_point	: this.geo_get_teleport_point(true),
		pol_count	: this.count_pols(),
		created		: created,
		kept		: moved,
		deleted		: deleted,
	};
}


function pols_to_posmaps(pols){

	var out = {};

	for (var i in pols){
		var p = pols[i];
		var chassis = p.chassis;
		if (chassis){
			if (!out[chassis]) out[chassis] = [];
			out[chassis].push([i, p.x, p.y]);
		}else{
			log.error("lot marker "+i+" has no chassis set - skipping");
		}
	}

	return out;
}
