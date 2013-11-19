
function geo_add_door(details){
	return this.geo_add_item('door', details);
}

function geo_add_signpost(details){
	return this.geo_add_item('signpost', details);
}

function geo_add_item(name, details){

	if (!this.geometry){
		log.info('******************* no geometry while going to create '+name+" in "+this.tsid);
	}

	var m = this.geometry.layers.middleground;
	if (!m[name+'s']){
		m[name+'s'] = {};
	}

	var key = this.geo_get_next_key(m[name+'s'], name);

	m[name+'s'][key] = details;

	return key;
}

function geo_get_next_key(collection, prefix){

	var i = 1;
	while (collection[prefix+'_'+i]){
		i++;
	}
	return prefix+'_'+i;
}

function geo_get_next_index(collection){

	var i = 0;
	while (collection[i]){
		i++;
	}
	return i;
}


//
// add a destination to an existing signpost/door, pointing at an (x,y)
//

function geo_signpost_add_dest_pos(signpost_id, dest, x, y, skip_source){

	var signpost = this.geometry.layers.middleground.signposts[signpost_id];

	if (!signpost.connects) signpost.connects = {};

	var connect_key = geo_get_next_index(signpost.connects);
	var info = dest.geo_get_info();

	signpost.connects[connect_key] = {
		target	: dest,
		mote_id	: info.mote_id,
		hub_id	: info.hub_id,
		x	: x,
		y	: y
	};

	if (!skip_source && !this.isInstance()){
		dest.geo_links_add_source(this.tsid);

		this.jobs_modify_connections();
		dest.jobs_modify_connections();
	}
}

function geo_door_set_dest_pos(door_id, dest, x, y, skip_source){

	var door = this.geometry.layers.middleground.doors[door_id];
	var info = dest.geo_get_info();

	door.connect = {
		target	: dest,
		mote_id	: info.mote_id,
		hub_id	: info.hub_id,
		x	: x,
		y	: y
	};

	if (!skip_source && !this.isInstance()){
		dest.geo_links_add_source(this.tsid);

		this.jobs_modify_connections();
		dest.jobs_modify_connections();
	}
}


function geo_signpost_set_instance_exit(signpost_id){

	if (!this.geometry || !this.geometry.layers || !this.geometry.layers.middleground || !this.geometry.layers.middleground.signposts) { 
		return;
	}
	
	var signpost = this.geometry.layers.middleground.signposts[signpost_id];

	if (!signpost) return;

	signpost.instance_exit = true;
}

//
// utility function to avoid remote access when adding connections (above)
//

function geo_get_info(){
	return {
		mote_id		: this.moteid,
		hub_id		: this.hubid
	};
}


// return the ID of the first signpost we come across
function geo_find_signpost_id(){

	if (!this.geo || !this.geo.signposts) return null;

	for (var i in this.geo.signposts){
		return i;
	}

	return null;
}

// return the ID of the first door we come across
function geo_find_door_id(){

	if (!this.geo || !this.geo.doors) return null;

	for (var i in this.geo.doors){
		return i;
	}

	return null;
}

function geo_get_door_info(door_id){

	return this.geo.doors[door_id];
}

function geo_get_signpost_info(signpost_id){

	return this.geo.signposts[signpost_id];
}

function geo_clear_doors(){

	this.geometry.layers.middleground.doors = {};
}

function geo_clear_signposts(){

	this.geometry.layers.middleground.signposts = {};
}

function geo_count_signposts(){
	if (!this.geo || !this.geo.signposts) return 0;

	return this.geo.signposts.__length;
}

function geo_door_set_deco(door_id, sprite, w, h){

	var door = this.geometry.layers.middleground.doors[door_id];

	door.w = w;
	door.h = h;
	door.deco.w = w;
	door.deco.h = h;
	door.deco.sprite_class = sprite;
}

function geo_lock_signpost(signpost_id){
	var signpost = this.geometry.layers.middleground.signposts[signpost_id];
	if (!signpost) return;

	log.info(this+" setting signpost "+signpost_id+" to hidden");
	signpost.hidden = true;

	this.geo_signpost_updated(signpost_id);
}

function geo_unlock_signpost(signpost_id){
	var signpost = this.geometry.layers.middleground.signposts[signpost_id];
	if (!signpost) return;

	log.info(this+" setting signpost "+signpost_id+" to UNhidden");
	delete signpost.hidden;

	this.geo_signpost_updated(signpost_id);
}

function geo_lock_signpost_connection(signpost_id, connect_id){

	var connect = this.geometry.layers.middleground.signposts[signpost_id].connects[connect_id];
	if (!connect) return;
	if (connect.hidden) return;

	log.info(this+" setting connection "+connect_id+" on signpost "+signpost_id+" to hidden");
	connect.hidden = true;

	this.geo_signpost_updated(signpost_id);
}

function geo_unlock_signpost_connection(signpost_id, connect_id){

	var connect = this.geometry.layers.middleground.signposts[signpost_id].connects[connect_id];
	if (!connect) return;
	if (!connect.hidden) return;

	log.info(this+" setting connection "+connect_id+" on signpost "+signpost_id+" to UNhidden");
	connect.hidden = false;

	this.geo_signpost_updated(signpost_id);
}

function geo_signpost_updated(signpost_id){

	var geo = this.prep_geometry(); // We need the same signpost struct we normally send the client
	var sign = geo.layers.middleground.signposts[signpost_id];
	sign.id = signpost_id;
	var rsp = {
		type: 'signpost_change',
		location_tsid: this.tsid,
		signpost: sign
	};

	for (var i in this.activePlayers){
		try{
			this.activePlayers[i].apiSendMsg(rsp);
		}
		catch(e){
			log.error("Cannot send signpost update to "+i);
		}
	}
	
	apiAdminCall('clearMapCache', {hub_id: this.hubid});
	this.updateMap();
	apiReloadDataForGlobalPathFinding();
}

function geo_lock_door_connection(door_id){

	var connect = this.geo.doors[door_id].connect;
	if (!connect) return;
	if (connect.hidden) return;

	log.info(this+" setting connection on door "+door_id+" to hidden");
	connect.hidden = true;

	this.geo_door_updated(door_id);
}

function geo_unlock_door_connection(door_id){

	var connect = this.geo.doors[door_id].connect;
	if (!connect) return;
	if (!connect.hidden) return;

	log.info(this+" setting connection on door "+door_id+" to UNhidden");
	connect.hidden = false;

	this.geo_door_updated(door_id);
}

function geo_door_updated(door_id){

	var geo = this.prep_geometry(); // We need the same door struct we normally send the client
	var door = geo.layers.middleground.doors[door_id];
	door.id = door_id;
	var rsp = {
		type: 'door_change',
		location_tsid: this.tsid,
		door: door
	};

	for (var i in this.activePlayers){
		try{
			this.activePlayers[i].apiSendMsg(rsp);
		}
		catch(e){
			log.error("Cannot send door update to "+i);
		}
	}
	
	apiAdminCall('clearMapCache', {hub_id: this.hubid});
	this.updateMap();
	apiReloadDataForGlobalPathFinding();
}


//
// we use marker_teleport objects to show where you'll land in a location.
// used in POL and quarter templates
//

function geo_get_teleport_point(destroy){

	var point = {
		found: false,
		x: 0,
		y: 0
	};

	this.items.apiIterate('marker_teleport', function(marker){
		if (!point.found){
			point.found = true;
			point.x = marker.x;
			point.y = marker.y;
		}

		if (destroy){
			marker.apiDelete();
		}
	});

	return point;
}

function geo_add_hitbox(id, x, y, width, height){
	for (var i = 1; ; i++){
		if (!this.geometry.layers.middleground.boxes['box_'+i]){
			this.geometry.layers.middleground.boxes['box_'+i] = {id:id, x:x, y:y, w:width, h:height};
			break;
		}
	}
	
	this.apiGeometryUpdated();
}

function geo_delete_hitbox(id){
	for (var i in this.geometry.layers.middleground.boxes){
		var b = this.geometry.layers.middleground.boxes[i];
		if (b.id == id){
			delete this.geometry.layers.middleground.boxes[i];
			this.apiGeometryUpdated();
			return true;
			break;
		}
	}
	
	return false;
}


function find_hitbox_by_id(id){
	var box = null;
	for (var i in this.geometry.layers.middleground.boxes){
		var b = this.geometry.layers.middleground.boxes[i];
		if (b.id == id){
			box = b;
			break;
		}
	}
	
	return box;
}

function find_hitboxes_by_id_prefix(prefix){
	var boxes = [];
	for (var i in this.geometry.layers.middleground.boxes){
		var b = this.geometry.layers.middleground.boxes[i];
		if (b.id.indexOf(prefix) == 0){
			boxes.push(b);
		}
	}
	
	return boxes;
}

////////////////////////////////////////////////////////////////////////////////

//
// Deco manipulation
//

function geo_deco_remove(name, reload_players){
	var d = this.geo_find_deco_by_name(name);

	if (d){
		delete d;
		if (reload_players) this.upgrades_move_players('upgrade');

		return true;
	}

	return false;
}

function geo_deco_replace(name, data, reload_players){
	var d = this.geo_find_deco_by_name(name);

	if (d){
		if (!data.name) data.name = name;
		d = data;
		if (reload_players) this.upgrades_move_players('upgrade');

		return true;
	}

	return false;
}

function geo_find_deco_by_name(name){
	var layers = this.geometry.layers;

	for (var l in layers){
		if (!layers[l].decos) continue;

		for (var d in layers[l].decos){
			var deco = layers[l].decos[d];
			if (deco.name == name) return deco;
		}
	}

	return null;
}

// IMPORTANT NOTE: This will only work for decos that are marked as animated in locodeco, or those that have been assigned sign_txt. It will fail silently otherwise.
function geo_deco_toggle_visibility(name, is_visible, fade){
	this.apiSendMsg({
		type: 'deco_visibility',
		visible: is_visible,
		deco_name: name, // this is the name property on the deco in the location geo, it can be set via locodeco
		fade_ms: fade ? fade : 400 // by default the fade is 400 ms. If you specify any other number it will be what you specify (0 for immediate, with no fade)
	});
}

function geo_deco_change_txt(name, txt, css_class){
	this.apiSendMsg({
		type: 'deco_sign_txt',
		deco_name: name, // this is the name property on the deco in the location geo, it can be set via locodeco
		txt: txt,
		css_class: css_class ? css_class : '' // totally optional param to change the css_class used by the sign
	});
}


////////////////////////////////////////////////////////////////////////////////

//
// http://wiki.tinyspeck.com/wiki/PlacementPlatforms
//

function geo_placement_get(pl_id){
	var layers = this.geometry.layers;
	if (!layers) return {};

	var middleground = layers.middleground;
	if (!middleground) return {};

	var platform_lines = middleground.platform_lines;
	if (!platform_lines) return {};

	var plat = platform_lines[pl_id];
	if (!plat) return {};

	return {
		is_for_placement: plat.is_for_placement ? true : false,
		invoking_set: plat.placement_invoking_set ? plat.placement_invoking_set : '',
		userdeco_set: plat.placement_userdeco_set ? plat.placement_userdeco_set : ''
	};
}

function geo_placement_set(pl_id){
	var geo = this.geometry;
	var layers = geo.layers;
	if (!layers) geo.layers = {};

	var middleground = layers.middleground;
	if (!middleground) geo.layers.middleground = {};

	var platform_lines = middleground.platform_lines;
	if (!platform_lines) geo.layers.middleground.platform_lines = {};

	var plat = platform_lines[pl_id];
	if (!plat) return {};
}

function geo_placement_delete(pl_id){
	var layers = this.geometry.layers;
	if (!layers) return false;

	var middleground = layers.middleground;
	if (!middleground) return false;

	var platform_lines = middleground.platform_lines;
	if (!platform_lines) return false;

	var plat = platform_lines[pl_id];
	if (!plat) return false;

	delete plat;
	return true;
}

function geo_placement_can_invoke(pl_id, class_tsid){
	var sets = this.geo_placement_get_invoking_sets();
	var placement = this.geo_placement_get(pl_id);
	if (!placement.is_for_placement) return false;

	var can_invoke = sets[placement.invoking_set];
	if (!can_invoke) return false;

	return can_invoke[class_tsid] ? true : false;
}

////

function geo_placement_get_invoking_sets(){
	var catalog = apiFindItemPrototype('catalog_invoking_sets');
	if (!catalog) return {};
	
	return catalog.sets;
}

function geo_placement_get_userdeco_sets(){
	var catalog = apiFindItemPrototype('catalog_userdeco_sets');
	if (!catalog) return {};
	
	return sets;
}


////////////////////////////////////////////////////////////////////////////////

//
// http://wiki.tinyspeck.com/wiki/FurnitureMessaging
//
// Functions for adding/removing/changing plats and walls in a location. Mostly for decorable houses.
//

function geo_get_platform_lines_ref(){
	var geo = this.geometry;
	var layers = geo.layers;
	if (!layers) geo.layers = {};

	var middleground = layers.middleground;
	if (!middleground) geo.layers.middleground = {};

	var platform_lines = middleground.platform_lines;
	if (!platform_lines) geo.layers.middleground.platform_lines = {};

	return platform_lines;
}

function geo_get_walls_ref(){
	var geo = this.geometry;
	var layers = geo.layers;
	if (!layers) geo.layers = {};

	var middleground = layers.middleground;
	if (!middleground) geo.layers.middleground = {};

	var walls = middleground.walls;
	if (!walls) geo.layers.middleground.walls = {};

	return walls;
}

function geo_remove_plats(plats, walls, no_nudge){
	var loc_plats = this.geo_get_platform_lines_ref();

	var to_nudge = [];
	var pl_ids = [];
	var loc = this;
	for (var i in plats){
		if (!no_nudge){
			loc.items.apiIterate(function(item){
				//log.info("Checking item: "+item);
				if (item.hasTag('furniture') && !item.hasTag('furniture_placed_normally')) return;

				var pl = loc.apiGetClosestPlatformLineBelow(item.x, item.y-1);
				if (!pl) return;
				
				//log.info(item+': '+pl+' vs '+plats[i]);
				if (item && pl.x1 == plats[i].start.x && pl.y1 == plats[i].start.y && pl.x2 == plats[i].end.x && pl.y2 == plats[i].end.y){
					to_nudge.push(item);
				}
			});
		}

		pl_ids.push(i);
		delete loc_plats[i];
	}

	var loc_walls = this.geo_get_walls_ref();
	var wall_ids = [];
	for (var i in walls){
		wall_ids.push(i);
		delete loc_walls[i];
	}
	
	if (pl_ids.length || wall_ids.length) {
		this.apiGeometryUpdated();
	
		if (!no_nudge){
			for (var i in to_nudge){
				var it = to_nudge[i];
				if (!it) continue;
	
				var pt = this.apiGetPointOnTheClosestPlatformLineBelow(it.x, it.y-1);
				//log.info(it+' new pt: '+pt);
				if (pt) it.apiSetXY(pt.x, pt.y);
			}
		}
		return this.apiSendMsgAsIs({type: 'geo_remove', platform_lines: pl_ids, walls: wall_ids});
	}

	
}

function geo_add_plats(plats, walls, source){
	var loc_plats = this.geo_get_platform_lines_ref();

	var plats_to_add;
	for (var i in plats){
		if (!plats_to_add) plats_to_add = {};
		var pl = plats[i];
		pl.source = source;

		var pl_id = source+'_'+i+'_'+time();
		loc_plats[pl_id] = pl;
		plats_to_add[pl_id] = pl;
	}

	var loc_walls = this.geo_get_walls_ref();

	var walls_to_add;
	for (var i in walls){
		if (!walls_to_add) walls_to_add = {};
		var w = walls[i];
		w.source = source;

		var w_id = source+'_'+i+'_'+time();
		loc_walls[w_id] = w;
		walls_to_add[w_id] = w;
	}
	
	if (plats_to_add || walls_to_add) {
		this.apiGeometryUpdated();
		return this.geo_update_players_plats('geo_add', plats_to_add, walls_to_add);
	}
}

function geo_modify_plats(plats, walls){
	var loc_plats = this.geo_get_platform_lines_ref();

	var modified_plats = false;
	for (var i in plats){
		modified_plats = true;

		var pl = plats[i];
		loc_plats[i] = pl;
	}

	var loc_walls = this.geo_get_walls_ref();

	var modified_walls = false;
	for (var i in walls){
		modified_walls = true;
		
		var w = walls[i];
		loc_walls[i] = w;
	}
	
	if (modified_plats || modified_walls) {
		this.apiGeometryUpdated();
		return this.geo_update_players_plats('geo_update', plats, walls);
	}
}

function geo_find_plats_by_source(source){
	var loc_plats = this.geo_get_platform_lines_ref();

	var ret = {
		plats: {},
		walls: {}
	};
	if (!source) return ret;

	for (var i in loc_plats){
		var pl = loc_plats[i];
		if (pl.source == source){
			ret.plats[i] = pl;
		}
	}

	var loc_walls = this.geo_get_walls_ref();
	for (var i in loc_walls){
		var w = loc_walls[i];
		if (w.source == source){
			ret.walls[i] = w;
		}
	}

	return ret;
}

function geo_find_door_by_source(source){
        var geo = this.geometry;
        var layers = geo.layers;
        if (!layers) geo.layers = {};

        var middleground = layers.middleground;
        if (!middleground) geo.layers.middleground = {};

        var doors = middleground.doors;
        if (!doors) geo.layers.middleground.doors = {};

        for (var i in middleground.doors){
                var door = middleground.doors[i];
                if (!door) continue;

                if (door.itemstack_tsid == source.tsid) return door;
        }
}

function geo_find_door_by_target_source(source){
        var geo = this.geometry;
        var layers = geo.layers;
        if (!layers) geo.layers = {};

        var middleground = layers.middleground;
        if (!middleground) geo.layers.middleground = {};

        var doors = middleground.doors;
        if (!doors) geo.layers.middleground.doors = {};

        for (var i in middleground.doors){
                var door = middleground.doors[i];
                if (!door) continue;

                if (door.target_tsid == source.tsid) return door;
        }
}

function geo_find_plats_by_id(tsids){

	var ret = {
		plats: {},
		walls: {}
	};
	
	if (!tsids) return ret;

	var loc_plats = this.geo_get_platform_lines_ref();

	var plat_ids = tsids.split(',');
	var plat_tsid = '';
	for (var i in plat_ids){
		plat_tsid = utils.trim(plat_ids[i]);	
		if (loc_plats[plat_tsid]){
			ret.plats[plat_tsid] = loc_plats[plat_tsid];
		}
	}

	var loc_walls = this.geo_get_walls_ref();
	for (var i in plat_ids){
		plat_tsid = utils.trim(plat_ids[i]);
		if (loc_walls[plat_tsid]){
			ret.walls[plat_tsid] = loc_walls[plat_tsid];
		}
	}
	
	return ret;
}

function geo_remove_plats_by_source(source, no_nudge){
	var ret = this.geo_find_plats_by_source(source);

	return this.geo_remove_plats(ret.plats, ret.walls, no_nudge);
}

function geo_update_players_plats(type, plats, walls){
	return this.apiSendMsgAsIs({type: type, platform_lines: plats, walls: walls});
}

// "Disables" all plats in the box by making them soft for players in both directions
function geo_disable_plats(x1, y1, x2, y2, partials_only){
	this.geo_modify_plat_pc_perms(x1, y1, x2, y2, partials_only, false, 0);
}

// "Enables" all plats in the box by making them hard for players in both directions
function geo_enable_plats(x1, y1, x2, y2, partials_only){
	this.geo_modify_plat_pc_perms(x1, y1, x2, y2, partials_only, false, null);
}

// Sets all plats in the box by setting them to their initial perms
function geo_set_plats_to_initial_perms(x1, y1, x2, y2, partials_only){
	this.geo_modify_plat_pc_perms(x1, y1, x2, y2, partials_only, true, null);
}

// Will set the inital_perms for all of the plats
function geo_set_initial_perms(){
	var plats = this.geo_find_plats(null, null, null, null, true);

	for (var i in plats){
		plats[i].inital_perm = plats[i].platform_pc_perm;
	}

	var walls = this.geo_find_walls(null, null, null, null, true);

	for (var i in walls){
		walls[i].inital_perm = walls[i].platform_pc_perm;
	}
}

// Applies "perm" to all plats within the box for pcs
// See http://wiki.tinyspeck.com/wiki/Location_Geometry_XML for perm values
function geo_modify_plat_pc_perms(x1, y1, x2, y2, partials_only, use_inital_perm, perm){
	var plats = this.geo_find_plats(x1, y1, x2, y2, partials_only);

	for (var i in plats){
		if (use_inital_perm){
			plats[i].platform_pc_perm = plats[i].inital_perm;
		}else{
			plats[i].platform_pc_perm = perm;
		}
	}

	var walls = this.geo_find_walls(x1, y1, x2, y2, partials_only);

	for (var i in walls){
		if (use_inital_perm){
			walls[i].pc_perm = walls[i].inital_perm;
		}else{
			walls[i].pc_perm = perm;
		}
	}

	this.geo_modify_plats(plats, walls);
}

// x1,y1 is the top-left
// x2,y2 is the bottom-right
// passing null for any parameter ignores it
// includes any plats that are anywhere inside the box, unless full_only is true
function geo_find_plats(x1, y1, x2, y2, full_only){
	var loc_plats = this.geo_get_platform_lines_ref();

	var ret = {};

	for (var i in loc_plats){
		var pl = loc_plats[i];

		//log.info("Checking: "+i+" ", x1, y1, x2, y2, " against ", pl.start.x, pl.start.y, pl.end.x, pl.end.y);

		if (x1 !== null){
			//log.info("Checking x1");
			if (intval(pl.end.x) < intval(x1)) continue;
			if (full_only && intval(pl.start.x) < intval(x1)) continue;
		}

		if (y1 !== null){
			//log.info("Checking y1");
			if (intval(pl.end.y) < intval(y1)) continue;
			if (full_only && intval(pl.start.y) < intval(y1)) continue;
		}

		if (x2 !== null){
			//log.info("Checking x2");
			if (intval(pl.start.x) > intval(x2)) continue;
			if (full_only && intval(pl.end.x) > intval(x2)) continue;
		}

		if (y2 !== null){
			//log.info("Checking y2");
			if (intval(pl.start.y) > intval(y2)) continue;
			if (full_only && intval(pl.end.y) > intval(y2)) continue;
		}

		//log.info('PASS');

		ret[i] = pl;
	}

	return ret;
}

function geo_find_walls(x1, y1, x2, y2, full_only){
	var loc_walls = this.geo_get_walls_ref();
	log.info(loc_walls);

	var ret = {};

	for (var i in loc_walls){
		var wall = loc_walls[i];
		log.info(wall);

		//log.info("Checking: "+wall.tsid+" ", x1, y1, x2, y2, " against ", wall.x, wall.y, wall.h);

		if (x1 !== null){
			//log.info("Checking x1");
			if (intval(wall.x) < intval(x1)) continue;
		}

		if (y1 !== null){
			//log.info("Checking y1");
			if (intval(wall.y+wall.h) < intval(y1)) continue;
			if (full_only && intval(wall.y) < intval(y1)) continue;
		}

		if (x2 !== null){
			//log.info("Checking x2");
			if (intval(wall.x) > intval(x2)) continue;
		}

		if (y2 !== null){
			//log.info("Checking y2");
			if (intval(wall.y) > intval(y2)) continue;
			if (full_only && intval(wall.y+wall.h) > intval(y2)) continue;
		}

		//log.info('PASS');

		ret[i] = wall;
	}

	return ret;
}

function geo_add_plats_from_item(item){
	if (!item.has_parent('furniture_base')) return false;

	// Add plats contained in the item and let players know
	var p_ret = item.getPlatsAndWalls();
	for (var i in p_ret.plats){
		p_ret.plats[i].start.x+=item.x;
		p_ret.plats[i].end.x+=item.x;

		p_ret.plats[i].start.y+=item.y;
		p_ret.plats[i].end.y+=item.y;
	}

	for (var i in p_ret.walls){
		p_ret.walls[i].x+=item.x;
		p_ret.walls[i].y+=item.y;
	}

	return this.geo_add_plats(p_ret.plats, p_ret.walls, item.tsid);
}

function geo_set_instance_exit_doors(){
	for (var i in this.geometry.layers.middleground.doors){
		this.geometry.layers.middleground.doors[i].instance_exit = true;
	}

	this.apiGeometryUpdated();
}