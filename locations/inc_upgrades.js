

//
// this function modifies this location to use the geometry from a different template.
// it needs to do several things:
//
// [x] 1) map source signposts onto dest signposts (die if count doesn't match)
// [x] 2) map existing targets onto dest signposts
// [x] 3) do something with doors (for now, just choke)
// [x] 4) replace all regular geometry
// [x] 5) map/replace items (see this.upgrades_update_items)
// [x] 6) move all players to a platform
//

function upgrades_apply_template(template_tsid, change_type, ignore_items){

	var old_geo = this.cloneGeometry();
	if (!old_geo) return this.upgrades_fatal_error("can't get current geo");


	//
	// get the template
	//

	var template_street = apiFindObject(template_tsid);
	if (!template_street) return this.upgrades_fatal_error("can't find target template");

	var template_geo = template_street.cloneGeometry();
	if (!template_geo) return this.upgrades_fatal_error("can't get target geo");


	//
	// find signposts
	//

	var old_signs = [];
	var new_signs = [];

	for (var i in old_geo.layers.middleground.signposts){
		var sign = old_geo.layers.middleground.signposts[i];
		old_signs.push([i, sign.x, sign.y]);
	}

	for (var i in template_geo.layers.middleground.signposts){
		var sign = template_geo.layers.middleground.signposts[i];
		new_signs.push([i, sign.x, sign.y]);
	}

	if (old_signs.length != new_signs.length){
		return this.upgrades_fatal_error("signpost count does not match");
	}


	//
	// map old to new signposts
	//

	var signpost_map = this.upgrades_map_closest(old_signs, new_signs, true);


	//
	// map old targets onto new signposts
	//

	var links = this.geo_links_get_incoming();
	var old_targets = [];

	for (var i in links){
		old_targets.push([i, links[i].x, links[i].y]);
	}

	if (new_signs.length==0 && old_targets.length>0){
		return this.upgrades_fatal_error("no signposts to map targets too");
	}

	var target_map = this.upgrades_map_closest(old_targets, new_signs, false);


	//
	// doors!
	//

	if (array_keys(old_geo.layers.middleground.doors     ).length) return this.upgrades_fatal_error("doors in existing geo");
	if (array_keys(template_geo.layers.middleground.doors).length) return this.upgrades_fatal_error("doors in template geo");


	//
	// apply signposts to new geo
	//

	var new_geo = template_geo;

	for (var old_id in signpost_map){
		var new_id = signpost_map[old_id];
		new_geo.layers.middleground.signposts[new_id].connects = old_geo.layers.middleground.signposts[old_id].connects;
	}


	//
	// replace!
	//

	this.replaceGeometry(new_geo);


	//
	// move targets as needed
	//

	for (var old_id in target_map){
		var new_sign_id = target_map[old_id];
		var link = links[old_id];
		var link_street = apiFindObject(link.street_tsid);

		log.info('moving virtual target from '+link_street.tsid+'...');

		link_street.geo_links_move_target({
			source_type	: link.source_type,
			source_id	: link.source_id,
			connect_id	: link.connect_id,
			x		: new_geo.layers.middleground.signposts[new_sign_id].x,
			y		: new_geo.layers.middleground.signposts[new_sign_id].y
		});

		this.geo_links_add_source(link.street_tsid);
	}


	//
	// move & notify players
	//

	this.upgrades_move_players(change_type);


	//
	// map/replace items. we do this after moving
	// players, so they don't see items moving before they
	// reload.
	//

	if (!ignore_items) this.upgrades_update_items(template_street);


	return true;
}


//
// something went wrong
//

function upgrades_fatal_error(msg){

	log.error('***********************************************************');
	log.error('***********************************************************');
	log.error('***********************************************************');
	log.error('**** FATAL ERRROR during location upgrade: '+msg);
	log.error('***********************************************************');
	log.error('***********************************************************');
	log.error('***********************************************************');

	return false;
}


//
// this function will return a map of { old_id: new_id } pairs
// when you give it two lists of [id, x, y] tuples.
//

function upgrades_map_closest(old_objs, new_objs_src, unique){

	// clone - don't want to modify the source array
	var new_objs = [];
	for (var i=0; i<new_objs_src.length; i++) new_objs.push(new_objs_src[i]);

	var map = {};

	for (var i=0; i<old_objs.length; i++){

		// do we have any more to match against?
		if (!new_objs.length) break;

		var old_o = old_objs[i];
		var distances = [];

		for (var j=0; j<new_objs.length; j++){
			var new_o = new_objs[j];

			var dx = Math.abs(old_o[1] - new_o[1]);
			var dy = Math.abs(old_o[2] - new_o[2]);
			var d = Math.sqrt(dx * dx + dy * dy);

			distances.push([new_o[0], d, j]);
		}

		distances.sort(function(a, b){ return a[1] - b[1]; });
		var d = distances[0];
		var new_o = new_objs[d[2]];

		if (unique){
			new_objs.splice(d[2], 1);
		}

		map[old_o[0]] = new_o[0];
	}

	return map;
}


function upgrades_get_details(){


	//
	// get upgrade tree
	//

	if (!this.upgrade_tree) return null;
	var tree = config.street_upgrades[this.upgrade_tree];
	if (!tree) return null;


	//
	// find current upgrade ID
	//

	var our_id = null;

	for (var i in tree){
		if (tree[i].tsid == this.upgrade_template){
			var our_id = i;
		}
	}


	//
	// if we didn't find our template in the tree,
	// assume we're the first street at the correct
	// level we can find.
	//

	for (var i in tree){
		if (!our_id && tree[i].level == this.upgrade_level){
			our_id = i;
		}
	}

	if (!our_id) return null;


	//
	//
	//

	var details = tree[our_id];

	var out = {
		'upgrade'	: {},
		'downgrade'	: {},
		'current'	: {
			'tree'	: this.upgrade_tree,
			'tsid'	: details.tsid,
			'level'	: details.level,
			'type'	: 'current',
			'image'	: this.upgrades_image(details.image),
			'label'	: details.name,
			'desc'	: details.description
		}
	};

	for (var i in details.children){
		var child_id = details.children[i];
		var child = tree[child_id];

		out.upgrade[child_id] = {
			'tree'	: this.upgrade_tree,
			'tsid'	: child.tsid,
			'level'	: child.level,
			'type'	: 'upgrade',
			'image'	: this.upgrades_image(child.image),
			'label'	: child.name,
			'desc'	: child.description
		};
	}

	if (details.parent != "0"){
		var child_id = details.parent;
		var child = tree[child_id];

		out.downgrade[child_id] = {
			'tree'	: this.upgrade_tree,
			'tsid'	: child.tsid,
			'level'	: child.level,
			'type'	: 'downgrade',
			'image'	: this.upgrades_image(child.image),
			'label'	: child.name,
			'desc'	: child.description
		};
	}

	return out;
}

function upgrades_image(src){
	if (src) return 'http://c2.glitch.bz/'+src;
	return 'http://c2.glitch.bz/default_upgrade.png';
}

function upgrades_apply(details){

	//
	// try and apply the template
	//

	if (!this.upgrades_apply_template(details.tsid, details.type)){
		return false;
	}


	//
	// update props
	//

	this.upgrade_tree	= details.tree;
	this.upgrade_level	= details.level;
	this.upgrade_template	= details.tsid;
	this.template		= details.tsid;
}


//
// this function gets passed a template street objref
// and pulls in the items from that template, following
// a set of rules:
//
// [x] 1) map trants/patches between us/template and preserve state
// [x] 2) remove all other items that don't inherit from takeable
// [x] 3) add any items in template that don't inherit from takeable (and copy state)
// [x] 4) move all takeable items to a platform (down prefered, else up)
//

var upgrades_recreate_classes = ['lot_marker', 'npc_mailbox', 'npc_mail_dispatcher', 'marker_teleport', 'spawner']; // Things we dump and reload from the template
var upgrades_resource_types = ['trants_dark', 'trants', 'peat', 'barnacles', 'jellisacs', 'rocks'];
function upgrades_update_items(template, no_delete){

	//
	// create lists of items to deal with
	//

	var items = {
		trants    : {},
		trants_dark    : {},
		peat    : {},
		barnacles    : {},
		jellisacs    : {},
		gardens : {},
		rocks : {},

		statics   : {},
		takeables : {},
		recreate : {},
		nodelete : {}
	};

	for (var i in this.items){
		var item = this.items[i];
		if (in_array_real(item.class_tsid, upgrades_recreate_classes)){
			items.recreate[i] = item;
		}
		else if (item.has_parent('takeable')){
			items.takeables[i] = item;
		}
		else{
			if (item.has_parent('trant_egg') || item.has_parent('patch_dark') || (item.has_parent('patch_seedling') && item.trant_class == 'trant_egg')){
				items.trants_dark[i] = item;
			}
			else if (item.has_parent('trant_base') || item.has_parent('patch') || item.has_parent('dead_tree') || item.has_parent('wood_tree') || item.has_parent('patch_seedling')){
				items.trants[i] = item;
			}
			else if (item.has_parent('peat_base')){
				items.peat[i] = item;
			}
			else if (item.has_parent('mortar_barnacle')){
				items.barnacles[i] = item;
			}
			else if (item.has_parent('jellisac')){
				items.jellisacs[i] = item;
			}
			else if (item.class_tsid == 'garden_new'){
				items.gardens[i] = item;
			}
			else if (item.has_parent('mineable_rock')){
				items.rocks[i] = item;
			}
			else if (item.has_parent('bag_trophycase_base') || item.has_parent('bag_cabinet_base')){
				items.nodelete[i] = item;
			}
			else{
				items.statics[i] = item;
			}
		}
	}


	//
	// get the items in the template
	//

	if (!template) return this.upgrades_fatal_error("No template to pull items from");
	var template_items = template.upgrades_get_items();
	if (!template_items) return this.upgrades_fatal_error("Unable to get items from template");


	//
	// map resources
	//

	for (var ri in this.upgrades_resource_types){
		var r = this.upgrades_resource_types[ri];

		var current_resources = [];
		var template_resources = [];

		for (var i in items[r]) current_resources.push([i, items[r][i].x, items[r][i].y]);
		for (var i in template_items) if (template_items[i][r]) template_resources.push([i, template_items[i].x, template_items[i].y]);

		var resources_map = this.upgrades_map_closest(current_resources, template_resources, true);


		//
		// remove any current resources that don't have a mapping in the new template
		//

		for (var i in items[r]){
			if (!resources_map[i]){
				items[r][i].apiDelete();
			}
		}


		//
		// move all resources in map into their new locations
		//

		for (var i in resources_map){
			var j = resources_map[i];
			var resource_info = template_items[j];
			items[r][i].apiSetXY(resource_info.x, resource_info.y);


			//
			// any resources in the map can be removed from $template_items, so
			// that it will only contain non-resources and resources that need to be
			// added directly
			//

			delete template_items[j];
		}
	}


	//
	// Delete old-style gardens
	//

	for (var i in this.items){
		var item = this.items[i];
		if (item.class_tsid == 'garden') item.apiDelete();
	}
	
	
	//
	// map gardens
	//

	var current_gardens = [];
	var template_gardens = [];

	for (var i in items.gardens) current_gardens.push([i, items.gardens[i].x, items.gardens[i].y]);
	for (var i in template_items) if (template_items[i].gardens) template_gardens.push([i, template_items[i].x, template_items[i].y]);

	var gardens_map = this.upgrades_map_closest(current_gardens, template_gardens, true);


	//
	// remove any current gardens that don't have a mapping in the new template
	//

	for (var i in items.gardens){
		if (!gardens_map[i]) items.gardens[i].apiDelete();
	}


	//
	// move all gardens in map into their new locations
	//

	for (var i in gardens_map){
		var j = gardens_map[i];
		var gardens_info = template_items[j];
		items.gardens[i].apiSetXY(gardens_info.x, gardens_info.y);
		
		// Set props on it in case they changed size
		if (gardens_info.props) items.gardens[i].setAllInstanceProps(gardens_info.props);

		delete template_items[j];
	}


	//
	// map nodelete
	//

	var current_nodelete = [];
	var template_nodelete = [];

	for (var i in items.nodelete) current_nodelete.push([i, items.nodelete[i].x, items.nodelete[i].y]);
	for (var i in template_items) if (template_items[i].nodelete) template_nodelete.push([i, template_items[i].x, template_items[i].y]);

	var nodelete_map = this.upgrades_map_closest(current_nodelete, template_nodelete, true);


	//
	// remove any current nodelete that don't have a mapping in the new template
	//

	for (var i in items.nodelete){
		if (!nodelete_map[i]){
			items.nodelete[i].apiDelete();
		}
	}


	//
	// move all nodelete in map into their new locations
	//

	for (var i in nodelete_map){
		var j = nodelete_map[i];
		var nodelete_info = template_items[j];
		items.nodelete[i].apiSetXY(nodelete_info.x, nodelete_info.y);
		
		// Set props on it in case they changed size
		if (nodelete_info.props) items.nodelete[i].setAllInstanceProps(nodelete_info.props);

		delete template_items[j];
	}


	//
	// remove all non-takeables (apart from trants)
	//

	if (!no_delete){
		for (var i in items.statics){

			items.statics[i].apiDelete();
		}


		//
		// instatiate new statics from the template
		// only done if we've also deleted the statics, otherwise we end up with two of things!
		//

		for (var i in template_items){
			var info = template_items[i];

			var item = apiNewItemStack(info.class_tsid, info.count);
			this.apiPutItemIntoPosition(item, info.x, info.y);

			if (info.hitBox) item.apiSetHitBox(info.hitBox.w, info.hitBox.h);
			if (info.props) item.setAllInstanceProps(info.props);

			delete template_items[i];
		}
	}


	//
	// deal with dynamics
	//

	for (var i in items.takeables){

		var item = items.takeables[i];
		var p = this.upgrades_fix_location(item.x, item.y);
		item.apiSetXY(p[0], p[1]);
	}

	//
	// deal with specials, which we always wipe and recreate from the template
	//

	for (var i in items.recreate){

		items.recreate[i].apiDelete();
	}

	// Recreate all non-takeables from the template that we haven't yet handled
	for (var i in template_items){
		var info = template_items[i];
		var item = apiNewItemStack(info.class_tsid, info.count);
		this.apiPutItemIntoPosition(item, info.x, info.y);

		if (info.hitBox) item.apiSetHitBox(info.hitBox.w, info.hitBox.h);
		if (info.props) item.setAllInstanceProps(info.props);
	}


	return true;
}


//
// return a hash of items and item states from a template street
//

function upgrades_get_items(){

	var out = {};

	for (var i in this.items){

		var item = this.items[i];

		if (!item.has_parent('takeable')){

			var is_trants_dark = (item.has_parent('trant_egg') || item.has_parent('patch_dark') || (item.has_parent('patch_seedling') && item.trant_class == 'trant_egg')) ? true : false;
			out[item.tsid] = {
				class_tsid	: item.class_tsid,
				count		: item.count,
				x		: item.x,
				y		: item.y,
				hitBox		: item.hitBox,
				props		: item.instanceProps,
				trants_dark	: is_trants_dark,
				trants		: (!is_trants_dark && (item.has_parent('trant_base') || item.has_parent('patch') || item.has_parent('dead_tree') || item.has_parent('wood_tree') || item.has_parent('patch_seedling'))) ? true : false,
				peat		: (item.has_parent('peat_base')) ? true : false,
				barnacles	: (item.has_parent('mortar_barnacle')) ? true : false,
				jellisacs	: (item.has_parent('jellisac')) ? true : false,
				rocks		: (item.has_parent('mineable_rock')) ? true : false,
				nodelete	: (item.has_parent('bag_trophycase_base') || item.has_parent('bag_cabinet_base') || item.class_tsid == 'garden_new') ? true : false,
				gardens		: (item.class_tsid == 'garden_new') ? true : false
			};
		}
	}

	return out;
}


//
// called when we first create a new upgradeable instance
//

function upgrades_init(args){

	this.upgrade_tree	= args.upgrade_tree;
	this.upgrade_level	= args.upgrade_level;
	this.upgrade_template	= args.upgrade_template;
	this.template		= args.upgrade_template;

	var template = apiFindObject(args.upgrade_template);

	this.upgrades_update_items(template);
}


//
// takes a location and moves it to be within the street and above a platform
//

function upgrades_fix_location(x, y){

	//
	// make sure we're within the X and Y bounds of the street
	//

	var x_margin = 150;
	if (x < this.geometry.l+x_margin) x = this.geometry.l+x_margin;
	if (x > this.geometry.r-x_margin) x = this.geometry.r-x_margin;

	var y_margin = 10;
	if (y < this.geometry.t+y_margin) x = this.geometry.t+y_margin;
	if (y > this.geometry.b-y_margin) x = this.geometry.b-y_margin;


	//
	// make sure we're above a platform
	//

	var plat = this.apiGetClosestPlatformLineBelow(x, y);
	if (!plat) plat = this.apiGetClosestPlatformLineAbove(x, y);
	if (!plat) return [x, y];

	var move_above = 5;
	var frac = (x-plat.x1) / (plat.x2 - plat.x1); // fraction along platform
	var y_pos = plat.y1 + ((plat.y2 - plat.y1) * frac);

	y = y_pos - move_above;

	return [x, y];
}


//
// Is this a street upgrade template?
//

function is_upgrade_template(){
	var upgrades = config.street_upgrades;

	for (var tree_id in upgrades){
		var tree = upgrades[tree_id];
		for (var i in tree){
			if (tree[i].tsid == this.tsid){
				return true;
			}
		}
	}
	
	return false;
}


function upgrades_move_players(change_type){

	for (var i in this.players){

		var pc = this.players[i];
		if (!pc) continue;

		var p = this.upgrades_fix_location(pc.x, pc.y);
		pc.reloadGeometry(p[0], p[1], change_type);
	}
}
