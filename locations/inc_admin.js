
function admin_get_info(args){

	var info = this.get_info();

	info.isOwnable	= this.isOwnable;
	info.ownerId	= this.owner ? this.owner.tsid : null;
	info.ownerName	= this.owner ? this.owner.label : null;
	info.ownerType	= this.owner_type ? this.owner_type : 1;
	info.cost	= this.cost;
	info.door	= this.pols_get_door_info();
	info.entrance	= this.pols_get_entrance();

	var pc = args.pc ? apiFindObject(args.pc) : null;
	if (pc){
		info.have_currants = pc.stats_get_currants();
		info.level = pc.stats_get_level();
		info.owns_house = pc.houses_has_house();
		info.has_papers = pc.achievements_has('you_have_papers');
	}

	if (this.quarter_tsid){
		var quarter = apiFindObject(this.quarter_tsid);
		if (quarter){
			var q_info = quarter.get_info();
			info.exit = q_info.exit;

			if (info.exit && info.exit.tsid){
				var exit = apiFindObject(info.exit.tsid);
				if (exit) info.exit.is_locked = exit.jobs_is_street_locked();
			}
		}
	}

	if (info.isOwnable){
		info.purchased_on = this.purchased_on;
		info.sold_on = this.sold_on;
		info.previous_ownerId = this.previous_owner ? this.previous_owner.tsid : null;
		info.previous_ownerName = this.previous_owner ? this.previous_owner.label : null;
		info.last_entered_on = this.last_entered_on;
	}

	return info;
}

function admin_buy(args){

	var pc = apiFindObject(args.pc);

	return this.pols_buyHouse(pc);
}

function admin_sell(args){

	var pc = apiFindObject(args.pc);

	return this.pols_sellHouse(pc);
}

function admin_refund(args){

	return this.pols_sellHouse(this.owner, 1);
}

function admin_set_ownable(args){

	return this.pols_setOwnable(args.cost);
}

function admin_set_non_ownable(args){

	return this.pols_setNonOwnable();
}

function admin_set_house_position(args){

	return this.set_house_position(args.pos);
}

function admin_delete(args){

	//
	// does it have outgoing links?
	//

	var has_outgoing = false;
	var links = this.geo_links_get_outgoing();

	for (var i=0; i<links.length; i++){
		if (links[i].tsid != this.tsid){
			has_outgoing = true;
		}
	}

	if (has_outgoing){

		return {
			ok	: 0,
			error	: 'has_outgoing',
		};
	}


	//
	// does it have incoming links?
	//

	var has_incoming = false;
	var links = this.geo_links_get_incoming();

	for (var i in links){
		if (links[i].street_tsid != this.tsid){
			has_incoming = true;
			break;
		}
	}

	if (has_incoming){
		return {
			ok	: 0,
			error	: 'has_incoming',
		};
	}


	//
	// does it have players?
	// try and teleport them home
	//

	for (var i in this.players){
		this.players[i].teleportHome();
	}

	for (var i in this.players){
		return {
			ok : 0,
			error : 'contains_players',
		};
	}


	//
	// remove owner if it's owned, then un-POL
	//

	if (this.owner) this.pols_sellHouse(this.owner, 1);

	if (this.isOwnable) this.pols_setNonOwnable();


	//
	// delete it!
	//

	this.web_sync_deleted();
	this.apiDelete();

	return {
		ok: 1,
	};
}

//
// this function is used for getting a decent teleport location for God functions
//

function admin_geo_get_entrypoint(){
	var tele_point = this.geo_get_teleport_point();
	
	if (tele_point.x){
		return { x: tele_point.x,
			 y: tele_point.y, 
		};
	} else {
		var first_door_id = this.geo_find_door_id();

		if (first_door_id){
			var door = this.geo_get_door_info(first_door_id);

			return { x: door.x,
				 y: door.y,
			};
		}
	}
	
	// give up
	return { x: 0,
		 y: 0,
	};
}


//
// this function is used for the /locations/TSID/ webpage
//

function admin_get_street_info(args){

	//
	// find other locations that are linked from here
	//

	var targets = this.geo_links_get_outgoing();
	var targets_streets = {};
	var targets_houses = {};
	var targets_pols = {};
	var residents = {};

	for (var i in targets){
		if (targets[i].type == 'signpost' && targets[i].hidden) continue;

		var tsid = targets[i].tsid;

		if (tsid != this.tsid){

			var loc = apiFindObject(tsid);
			var info = loc ? loc.get_info() : {};

			if (info.type == 'pol'){
				info.cost = loc.cost;

				var owner = loc.pols_get_owner();
				if (owner){
					residents[info.tsid] = owner.tsid;
					info.owner_tsid = owner.tsid;
				}else{
					info.owner_tsid = null;
				}
			}

			if (info.type == 'street') targets_streets[tsid] = info;
			if (info.type == 'house') targets_houses[tsid] = info;
			if (info.type == 'pol') targets_pols[tsid] = info;
		}
	}


	//
	// load and merge the basic info
	//

	var info = this.get_info();

	info.cons_streets = targets_streets;
	info.cons_houses = targets_houses;
	info.cons_pols = targets_pols;
	info.residents = residents;
	
	
	//
	// loading screen info
	//
	
	var pc = null;
	if (args.player_tsid){
		pc = getPlayer(args.player_tsid);
	}
	info.loading_info = this.getLoadingInfo(pc, args.no_formatting);

	info.is_locked = this.jobs_is_street_locked();

	//
	// map state
	//
	info.no_map = this.geo.no_map ? true : false;
	info.fog_map = this.geo.fog_map ? true : false;

	//
	// Can we TP in here?
	//

	info.can_teleport = true;

	if (info.type == 'pol'){
		if (!this.getProp('is_public')) info.can_teleport = false;
		if (pc){
			var can_enter = this.pols_canEnter(pc);
			if (!can_enter.ok) info.can_teleport = false;
		}
		info.is_home = this.pols_is_home();

		var owner = this.pols_get_owner();
		if (owner){
			info.owner_tsid = owner.tsid;
			info.owner_blocking_you = pc ? pc.buddies_is_ignored_by(owner) : false;
		}else{
			info.owner_tsid = null;
		}
	}
	else{

		var incoming = this.geo_links_get_incoming();

		if (num_keys(incoming)){
			for (var i in incoming){
				if (incoming[i].is_hidden || incoming[i].is_locked) info.can_teleport = false;
			}
		}
		else{
			info.can_teleport = false;
		}
	}

	info.is_public_hub = in_array_real(this.hubid, config.public_hubs);

	return info;
}

//
// called by the loco deco (via a php callback) when saving
// the image for a location.
//

function admin_set_street_image(args){

	var old_url = this.image ? this.image.url : null;

	this.image = {
		url: args.url,
		w: args.width,
		h: args.height,
	};

	return {
		old_url: old_url,
	};
}

//
// called by client (via api call to god.streets.setLoadingImage)
//

function admin_set_street_loading_image(args){

	this.loading_image = {
		url: args.url,
		w: args.width,
		h: args.height,
	};
}

function admin_set_street_special_loading_image(args){

	this.special_loading_image = {
		url: args.url,
		w: args.width,
		h: args.height,
	};
}

function admin_has_filters(args){

	var geo = this.geometry;
	
	if (!geo.layers.foreground || !geo.layers.foreground.filters) return false;
	
	for (var i in geo.layers.foreground.filters){
		if (geo.layers.foreground.filters[i].value) return true;
	}
	
	return false;
}

function admin_set_job_street_info(args){
	return this.jobs_set_street_info(args);
}

function admin_get_job_street_info(args){
	return this.jobs_get_street_info(args.job_id);
}

function admin_jobs_delete_street_info(args){
	return this.jobs_delete_street_info(args.job_id);
}

function admin_jobs_delete(args){
	var job = this.jobs[args.job_id];
	if (!job) return false;
	
	// Loop through the class ids and delete them
	if (job.class_ids){
		for (var i in job.class_ids){
			// Delete the instance, if any
			this.jobs_delete_instance(args.job_id, i);
			
			delete this.jobs[args.job_id].class_ids[i];
		}
		
		this.jobs[args.job_id].class_ids;
	}

	// Delete the street info, which also wipes the root entry
	this.jobs_delete_street_info(args.job_id);
	
	return true;
}

function admin_jobs_jobs_reset(args){
	return this.jobs_get_primary_loc(args.job_id).jobs_reset(args.job_id);
}

function admin_set_street_instance_data(args) {
	if (args.instance_max_members) {
		this.instance_me = args.instance_me;
		this.instance_max_members = args.instance_max_members;
		this.instance_location_type = args.instance_location_type;
	} else {
		if(this.instance_me) {
			delete this.instance_me;
		}
		if(this.instance_max_members) {
			delete this.instance_max_members;
		}
		if (this.instance_location_type){
			delete this.instance_location_type;
		}
	}
}

function admin_jobs_set_locked(args){
	log.info(this+' locking');
	this.jobs_is_locked = true;
	this.jobs_modify_connections();

	apiAdminCall('clearMapCache', {hub_id: this.hubid});
	this.updateMap();
	apiReloadDataForGlobalPathFinding();
}

function admin_jobs_set_unlocked(args){
	log.info(this+' unlocking');
	this.jobs_is_locked = false;
	this.jobs_modify_connections();

	apiAdminCall('clearMapCache', {hub_id: this.hubid});
	this.updateMap();
	apiReloadDataForGlobalPathFinding();
}

function admin_jobs_set_autounlocked(args){
	this.jobs_auto_unlock = args.auto_unlock ? true : false;
}

function admin_set_job_class_ids(args){
	return this.jobs_set_class_ids(args);
}

function admin_set_no_teleportation(args){
	this.no_teleportation = args.no_teleportation ? true : false;
}

function admin_set_disallow_animals(args){
	this.disallow_animals = args.disallow_animals ? true : false;
}

function admin_set_no_rook(args) {
	this.no_rook = args.no_rook ? true : false;
}

function admin_get_items(){
	var out = {
		ok: 1,
		items: {},
	};

	for (var i in this.items){
		out.items[i] = {
			tsid: i,
			class_tsid: this.items[i].class_tsid,
			props: num_keys(this.items[i].instanceProps),
		};
	}

	return out;
}

function admin_get_active_players(){
	return this.getActivePlayers();
}

function admin_get_item_props(args){
	var out = {
		ok: 1,
		props: {},
		items: {},
		extras: {},
	};

	var proto = apiFindItemPrototype(args.class_tsid);
	if (proto){
		out.props = proto.instancePropsDef;

		if (proto.is_trant) out.extras.trant = 1;
		if (proto.is_dead_trant) out.extras.dead_trant = 1;
	}


	for (var i in this.items){
		if (this.items[i].class_tsid == args.class_tsid){

			out.items[i] = {
				_x : this.items[i].x,
				_y : this.items[i].y,
			};

			var props = this.items[i].instanceProps;
			if (props){
				for (var j in props){
					out.items[i][j] = props[j];
				}
			}
		}
	}

	return out;
}

function admin_save_item_props(args){

	var num = 0;

	for (var i in args.items){
		var item = apiFindObject(i);
		var props = args.items[i];
		var changed = false;

		if (item){
			if (item.x != intval(props._x)){ item.x = intval(props._x); changed = true; }
			if (item.y != intval(props._y)){ item.y = intval(props._y); changed = true; }
			delete props._x;
			delete props._y;

			for (var j in props){
				if (props[j] != item.getInstanceProp(j)){
					item.setInstanceProp(j, props[j]);
					changed = true;
				}
			}

			if (changed) num++;
		}
	}

	return {
		ok: 1,
		num_changed: num,
	};
}


function admin_mining_data(){

	var out = {};

	var things = [];

	// count all the items
	var dead_trant_classes = ['trant_bubble_dead', 'trant_gas_dead', 'trant_spice_dead', 'trant_fruit_dead', 'trant_egg_dead', 'trant_bean_dead'];
	var animal_classes = ['npc_butterfly', 'npc_batterfly', 'npc_piggy', 'npc_chicken'];
	
	for (var i in this.items){
		var item = this.items[i];

		if (item.is_trant){
			things.push('trant');
			things.push('trant:'+item.class_tsid);
		}

		//
		// Paper Trees and Wood Trees are almost trants. Except the bit where they aren't.
		//

		if (item.class_tsid == 'paper_tree' || item.class_tsid == 'wood_tree'){
			things.push('trantish');
			things.push('trantish:'+item.class_tsid);
		}

		//
		// Dead Trants are also almost Trants. Only, y'know, deader.
		//

		if (in_array(item.class_tsid, dead_trant_classes)){
			things.push('trant_dead');
			things.push('trant_dead:'+item.class_tsid);
		}

		if (item.has_parent('patch')){
			things.push('patch');
			things.push('patch:'+item.class_tsid);
		}

		if (in_array(item.class_tsid, animal_classes)){
			things.push('animal');
			things.push('animal:'+item.class_tsid);
		}

		if (item.has_parent('mineable_rock')){
			things.push('rock');
			things.push('rock:'+item.classProps.rock_type);
		}

		if (item.class_tsid == 'quoin'){
			things.push('quoin');
			things.push('quoin:'+item.instanceProps.class_name);
		}

		if (item.has_parent('npc_shrine_base')){
			things.push('shrine');
			things.push('shrine:'+item.get_giant());
		}
		
		if (item.get_store_id()){
			things.push('store');
			things.push('store:'+get_store(item.get_store_id()).name);
		}

		if (item.has_parent('peat_base')){
			things.push('peat');
			things.push('peat:'+item.class_tsid);
		}

		if (item.class_tsid == 'barnacle'){
			things.push('barnacle');
		}

		if (item.class_tsid == 'jellisac'){
			things.push('jellisac');
		}

		if (item.class_tsid == 'spawner'){
			things.push('spawner');
			things.push('spawner:'+item.getSpawnClass());
		}

		if (item.class_tsid == 'dirt_pile'){
			things.push('dirt_pile');
		}

		if (item.class_tsid == 'dust_trap'){
			things.push('dust_trap');
			things.push('dust_trap:'+item.instanceProps.trap_class);
		}

		if (item.class_tsid == 'garden_new'){
			things.push('garden');
			things.push('garden:'+item.getInstanceProp('garden_type'));
		}

		if (item.class_tsid == 'npc_mailbox'){
			things.push('mailbox');
			things.push('mailbox:'+item.instanceProps.variant);
		}

		if (item.class_tsid == 'npc_mail_dispatcher'){
			things.push('dispatcher');
			things.push('dispatcher:'+item.instanceProps.variant);
		}

		if (item.class_tsid == 'race_ticket_dispenser'){
			things.push('race_ticket_dispenser');
		}

		if (item.class_tsid == 'game_teleporter'){
			things.push('game_teleporter');
		}

		if (item.class_tsid == 'blockmaker'){
			things.push('blockmaker');
		}

		if (item.class_tsid == 'fuelmaker'){
			things.push('fuelmaker');
		}
	}

	out['players'] = num_keys(this.players);
	out['players:online'] = num_keys(this.activePlayers);
	out['players:offline'] = out['players'] - out['players:online'];


	// squash the 'things' list
	things = things.sort();
	for (var i=0; i<things.length; i++){
		var thing = things[i];
		if (!out[thing]) out[thing] = 0;
		out[thing]++;
	}

	return out;
}

function admin_get_job_details(args){
	if (args && args.job_id){
		var job_id = args.job_id;
	}
	else{
		var job_id = this.jobs_get_unlock_job_id();
	}
	if (!job_id) return {};
	
	var phases = this.jobs_get_phases(job_id);
	
	var out = {
		upgrade_tree : this.upgrade_tree,
		started: false,
		complete: true,
		current_phase: 1,
		phases : {}
	};
	
	var highest_phase = 1;
	var num_complete = 0;
	for (var i in phases){
		if (phases[i].instance){
			out.phases[phases[i].in_order] = {
				status : phases[i].instance.get_status(),
				total_bc : phases[i].instance.getTotalBasecost(),
				leaderboard : phases[i].instance.getSortedContributors(),
				tsid : phases[i].instance.tsid
			};
			
			if (out.phases[phases[i].in_order]['status']['perc'] != 0){
				out.started = true;
			}
			
			if (!out.phases[phases[i].in_order]['status']['finished']){
				out.complete = false;
			}
			else{
				num_complete++;
			}
			
			if (out.phases[phases[i].in_order]['status']['perc'] != 0 && !out.phases[phases[i].in_order]['status']['finished']){
				out.current_phase = phases[i].in_order;
			}
			else if (out.phases[phases[i].in_order]['status']['perc'] != 0 || (out.phases[phases[i].in_order-1] && out.phases[phases[i].in_order-1]['status']['finished'])){
				if (phases[i].in_order > highest_phase) highest_phase = phases[i].in_order;
			}
		}
		else{
			out.phases[phases[i].in_order] = {};
			out.complete = false;
		}
	}

	if (highest_phase > out.current_phase) out.current_phase = highest_phase;
	
	out.num_phases = num_keys(out.phases);
	if (out.num_phases == num_complete) out.current_phase = out.num_phases;

	// Are we in between jobs?
	if (out.current_phase == 1){
		var phase = out.phases[1].status;
		if (phase && !phase.finished && !phase.ts_first_contribution && phase.type == 'regular'){
			var recent = this.jobs_get_last_job();
			if (recent) out.time_until_offer = (30 * 60) - time() - recent.getProp('ts_done');
		}
	}

	return out;
}

function admin_items_summary(){

	var out = {
		'ok'	: 1,
		'items'	: this.admin_items_recurse_summary(this.items),
	};

	return out;
}

function admin_items_recurse_summary(items){

	var out = {};

	for (var i in items){
		var item = items[i];
		out[item.class_tsid] = intval(out[item.class_tsid]) + 1;

		if (item.getProp('is_bag')){

			var temp = this.admin_items_recurse_summary(item.getAllContents());

			for (var j in temp){
				out[j] = intval(out[j]) + temp[j];
			}
		}
	}

	return out;
}

function admin_get_named_animals(){

	var out = {};

	for (var i in this.items){
		var item = this.items[i];

		if (item.is_nameable){

			out[item.tsid] = {
				user_name	: item.user_name,
				class_tsid	: item.class_tsid,
				pc_namer	: item.pc_namer,
				named_on	: item.named_on,
				x			: item.x,
				y			: item.y
			};
		}
	}

	return out;
}

// For all animals, has a 50/50 death chance, all trants get a chance to revert to patches, all takeable items get deleted, all items with user names get their names wiped
var animal_classes = ['npc_piggy', 'npc_chicken', 'npc_butterfly'];
function admin_clean_street(){
	if (this.moteid == 10 || this.instances_instance_me() || this.tsid == 'LTJ101M7R9O1HTT'){
		if (!this.isInstance()){
			return {ok: 1};
		}
	}

	if (!this.quarter_tsid){
		var quarters = this.getQuarters();
		for (var i in quarters){
			var q = apiFindObject(i);
			if (q){
				var slots = q.get_slots();
				for (var key in slots){
					var s = slots[key];
					if (s.data && s.data.instance) s.data.instance.admin_clean_street();
				}
			}
		}
	}

	var animals = {};
	
	for (var i in this.items){
		var item = this.items[i];
		if (!item) continue;

		if (item.class_tsid == 'bag_notice_board'){
			item.emptyBag();
		}
		else if (item.has_parent('takeable') || item.has_parent('npc_cubimal_base') || item.class_tsid == 'npc_garden_gnome' || item.class_tsid == 'graveside_marker'){
			item.apiDelete();
		}
		else if (item.class_tsid == 'garden' || item.class_tsid == 'garden_new'){
			item.resetGarden();
		}
		else if (item.class_tsid == 'npc_firefly'){
			item.apiDelete();
		}
		else if (in_array_real(item.class_tsid, this.animal_classes)){
			// if a street has more than 3 piggies,  3 butterflies,  2 chickens … kill the rest
			if (!animals[item.class_tsid]) animals[item.class_tsid] = 0;
			animals[item.class_tsid]++;

			if (item.class_tsid == 'npc_piggy' && animals[item.class_tsid] > 3){
				item.apiDelete();
			}
			else if (item.class_tsid == 'npc_butterfly' && animals[item.class_tsid] > 3){
				item.apiDelete();
			}
			else if (item.class_tsid == 'npc_chicken' && animals[item.class_tsid] > 2){
				item.apiDelete();
			}
		}
		/*
		else if (item.replaceWithPatch){
			if (is_chance(0.25)){
				item.replaceWithPatch();
			}
			else if (item.instanceProps && item.instanceProps.maturity){
				item.instanceProps.maturity = randInt(1,10);
			}
		}
		*/
		else if (item.has_parent('machine_base') && !item.isInCraftingAltar()){
			item.apiDelete();
		}
		else{
			//log.info(this+' ignoring item: '+item);
		}

		if (item.user_name) delete item.user_name;
	}

	return {ok:1};
}

function admin_copy_items(args){
	this.upgrades_update_items(apiFindObject(args.template), false);
}

function admin_make_house(args){

	// already a house?
	if (this.mapLocation){
		return {
			ok: 0,
			error: 'already_a_house',
		};
	}

	// if it's currently a sub-room, stop it from being one
	if (this.mapParent){
		// TODO - modify parent room's child list
		delete this.mapParent;
	}

	// it's a regular street - make it into a house...
	this.mapLocation = args.parent_tsid;
	this.mapPos = args.pos;
	this.mapChildren = {};

	return {
		ok: 1,
	};
}

function admin_make_street(args){

	// if it's currently a sub-room, stop it from being one
	if (this.mapParent){
		// TODO - modify parent room's child list
		delete this.mapParent;
	}

	// if it's a house, block if it has children
	if (this.mapLocation && num_keys(this.mapChildren)){
		return {
			ok: 0,
			error: 'has_sub_rooms',
		};
	}

	// if it's a house (w/ no children), un-house it
	if (this.mapLocation){
		delete this.mapLocation;
		delete this.mapPos;
		delete this.mapChildren;
	}

	return {
		ok: 1,
	};
}

function admin_pack_more_moving_boxes(){
	this.pack_moving_boxes();
}

function admin_log_packable_items(){
	var owner = this.owner;
	if (!owner) owner = this.previous_owner;
	if (!owner) return;
	if (owner.houses_is_our_home(this.tsid)) return;

	if (this.containsPackableItems()) log.info(this+' admin_log_packable_items contains '+this.containsPackableItems()+' item(s)');
}

function admin_recover_moving_boxes(){
	var is_moving_box = function(it){
		if (it.class_tsid == 'bag_moving_box'){
			if (it.owner){
				var pc = apiFindObject(it.owner);
				if (pc){
					it.store(pc);
					log.info(it+" bag_moving_box recovered");
				}
			}
			else if (it.container.owner){
				it.store(it.container.owner);
				log.info(it+" bag_moving_box recovered");
			}
			else if (it.container.previous_owner){
				it.store(it.container.previous_owner);
				log.info(it+" bag_moving_box recovered");
			}
			else{
				log.error(it+" bag_moving_box cannot be recovered");
			}
		}
	};
	this.items.apiIterate(is_moving_box);
}

function admin_fix_home_door(){
	if (!this.is_public) return {ok: 0, error: "Not exterior"};
	if (!this.owner) return {ok: 0, error: "No owner"};

	var interior = this.owner.houses_get_interior_street();
	if (!interior) return {ok: 0, error: "No interior"};

	var doors_in = this.geo_links_get_all_doors();
	if (!doors_in[0]) return {ok: 0, error: "No doors in"};

	if (doors_in[0].target) return {ok: 1};

	var marker_inside = interior.geo_get_teleport_point();
	if (!marker_inside || !marker_inside.found) return {ok: 0, error: "No doors in"};

	this.geo_door_set_dest_pos(doors_in[0].door_id, interior, marker_inside.x, marker_inside.y);
	interior.homes_rebuild_rooms();

	return {ok: 1};
}

function admin_fix_social_signpost(){
	if (!this.is_public) return {ok: 1};

	this.updateNeighborSignpost();
}

function admin_delete_if_duplicate_home(){
	if (!this.is_home) return {ok: 1};
	//if (this.is_deleted) return {ok: 1};

	if (!this.owner && !this.previous_owner) return {ok: 0, error: "No owner"};

	var owner = this.owner;
	if (!owner) owner = this.previous_owner;

	if (this.tsid == owner.houses_get_interior_tsid() || this.tsid == owner.houses_get_external_tsid()) return {ok: 1};
	
	var home_backup = owner.getProp('home_backup');
	if (home_backup){
		if ((home_backup.interior && this.tsid == home_backup.interior.tsid) || (home_backup.exterior && this.tsid == home_backup.exterior.tsid)){
			if (this.is_deleted) return {ok: 1};
			owner.houses_remove_property(this.tsid);
			this.evacuatePlayers();
			this.setProp('is_deleted', true);
			return {ok: 1};
		}
	}

	log.info(this+' admin_delete_if_duplicate_home: '+owner);

	this.pack_moving_boxes();
	//this.homes_return_decos();
	this.jobs_delete_all();
	this.geo_links_clear_sources();
	this.geo_clear_doors();
	this.evacuatePlayers();
	this.setProp('is_deleted', true);
	owner.houses_remove_property(this.tsid);

	this.admin_delete();

	return {ok: 1};
}

function admin_get_latest_owner(args){
	var owner = this.owner;
	if (!owner) owner = this.previous_owner;
	return {ok: 1, owner: owner.tsid};
}

function admin_check_deleted_quarter(args){
	if (this.class_tsid != 'quarter') return {ok: 1};
	if (!this.quarter_tsid) return {ok: 1};

	if (this.quarter_tsid == 'RA5ENLT7GMB2R2H' ||
		this.quarter_tsid == 'RA9M20EOK3H2AAO' ||
		this.quarter_tsid == 'RHVMQ7S8TA32UQK' ||
		this.quarter_tsid == 'RIF12A8IEUK1V1B' ||
		this.quarter_tsid == 'RA9K2TTVD5D2S26' ||
		this.quarter_tsid == 'RMF11UCANKD2KNB') return {ok: 1, no_delete: true};

	var quarter = apiFindObject(this.quarter_tsid);
	if (quarter) return {ok: 0, error: "Quarter "+this.quarter_tsid+" still exists!"};

	this.geo_clear_doors();
	this.geo_clear_signposts();
	this.geo_links_clear_sources();
	var ret = this.admin_delete();
	if (!ret['ok']) return ret;

	return {ok: 1, deleted: true};
}

function admin_fix_doors(args){
	if (!this.pols_is_pol()) return;
	if (this.is_public) return;
	if (!this.cfg) return;

	var did_things = false;

	for (var i in this.cfg.doors_up){
		if (this.cfg.doors_up[i]){
			// Where is it supposed to go?
			var x = 0;
			var y = 0;
			for (var j in this.geometry.layers.middleground.doors){
				var d = this.geometry.layers.middleground.doors[j];
				if (!d) continue;

				if (d.itemstack_tsid == this.cfg.doors_up[i].tsid){
					x = d.x;
					y = d.y;
					break;
				}
			}

			var door_item = apiFindObject(this.cfg.doors_up[i].tsid);
			if (!door_item){
				log.info(this+' admin_fix_doors doors_up '+i+' is missing at: '+x);
				var s = this.homes_create_door_item(x, 'up');
				log.info(this+' admin_fix_doors doors_up '+i+' created: '+s);
				if (s){
					this.homes_replace_door({tsid: this.cfg.doors_up[i].tsid}, s);
					log.info(this+' admin_fix_doors doors_up '+i+' replaced');
					did_things = true;
				}
			}
			else if (door_item.container.tsid != this.tsid){
				log.info(this+' admin_fix_doors doors_up '+i+' is in wrong container: '+door_item.container.tsid);
				this.apiPutItemIntoPosition(door_item.container.removeItemStackTsid(door_item.tsid), x, y);
				log.info(this+' admin_fix_doors doors_up '+i+' moved: '+x+', '+y);
				door_item.setInstanceProp('door_direction', 'up');
				door_item.no_job = true;
				did_things = true;
			}
		}
	}

	for (var i in this.cfg.doors_down){
		if (this.cfg.doors_down[i]){
			// Where is it supposed to go?
			var x = 0;
			var y = 0;
			for (var j in this.geometry.layers.middleground.doors){
				var d = this.geometry.layers.middleground.doors[j];
				if (!d) continue;

				if (d.itemstack_tsid == this.cfg.doors_down[i].tsid){
					x = d.x;
					y = d.y;
					break;
				}
			}

			var door_item = apiFindObject(this.cfg.doors_down[i].tsid);
			if (!door_item){
				log.info(this+' admin_fix_doors doors_down '+i+' is missing at: '+x);
				var s = this.homes_create_door_item(x, 'down');
				log.info(this+' admin_fix_doors doors_down '+i+' created: '+s);
				if (s){
					this.homes_replace_door({tsid: this.cfg.doors_down[i].tsid}, s);
					log.info(this+' admin_fix_doors doors_down '+i+' replaced');
					did_things = true;
				}
			}
			else if (door_item.container.tsid != this.tsid){
				log.info(this+' admin_fix_doors doors_down '+i+' is in wrong container: '+door_item.container.tsid);
				this.apiPutItemIntoPosition(door_item, x, y);
				log.info(this+' admin_fix_doors doors_down '+i+' moved: '+x+', '+y);
				door_item.setInstanceProp('door_direction', 'down');
				door_item.no_job = true;
				did_things = true;
			}
		}
	}

	if (did_things) this.homes_rebuild_rooms();
}

function admin_get_newxp_info(args){
	var info = {};
	
	info.is_newxp = this.is_newxp;
	info.newxp_stage = this.newxp_stage;
	if (this.is_newxp){
		info.current_step = this.current_step;
		info.waiting_for = this.waiting_for;
	}
	
	return info;
}