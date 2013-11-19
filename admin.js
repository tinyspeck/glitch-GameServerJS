log.info("admin.js loaded");

function isPlayerOnline(args){

	return apiIsPlayerOnline(args.tsid);
}

function populateInstance(args){

	var ret = {};

	for (var i in args.items){

		var item = args.items[i];

		log.info('spawning item stack ', item);

		var loc = apiFindObject(args.map[item.loc_tsid]);
		var stack = apiNewItemStack(item.class_id, item.count);

		loc.apiPutItemIntoPosition(stack, item.x, item.y);

		ret[i] = stack;
	}

	return ret;
}

function adminGetGroup(args){

	var group = apiFindObject(args.tsid);

	if (!group || !group.getProp('is_group')){

		return {
			'not_found': 1,
		};
	}
	return group.get_info(args.player_tsid);
}

function adminGetGroupMembers(args){

	var group = apiFindObject(args.tsid);

	if (!group || !group.getProp('is_group')){

		return {
			'not_found': 1,
		};
	}

	return group.get_members();
}

function getStreetLayout(args){

	var out = {};

	for (var i in args.streets){

		try{
			var street = apiFindObject(args.streets[i]);

			out[street.tsid] = street.getStreetLayout();
		}catch(e){
			out[args.streets[i]] = {};
		}
	}

	return out;
}

function getStreetHubPageInfo(args){

	//
	// first, fetch data for each street
	//

	var tsids = [];
	for (var i in args.streets){
		tsids.push(args.streets[i]);
	}

	var out = apiCallMethod('getHubPageInfo', tsids, null);


	//
	// now fill out details for each connection - most connections will be local,
	// so we can just copy details
	//

	var cache = {};

	for (var i in out){
		if (out[i])
		for (var j in out[i].connections){

			// local street?
			if (out[j]){
				out[i].connections[j].name = out[j].name;
				out[i].connections[j].moteid = out[j].moteid;
				out[i].connections[j].hubid = out[j].hubid;
			}else{
				if (!cache[j]){
					cache[j] = {};
					try{
						cache[j] = apiFindObject(j).getInfo();
					}catch(e){}
				}

				out[i].connections[j].name = cache[j].name;
				out[i].connections[j].moteid = cache[j].moteid;
				out[i].connections[j].hubid = cache[j].hubid;
			}
		}
	}

	return out;
}

function broadcastGodMessage(args){
	if (args.as_giant){
		var info = config.giants_info[args.as_giant];
		if (args.as_giant == 'ti') args.as_giant = 'tii';

		var rsp = {
			type:'giant_screen',
			tsid: args.as_giant,
			giant_of: info.giant_of,
			personality: info.personality,
			desc: info.desc,
			followers: info.followers,
			flv_url: overlay_key_to_url('giant_'+args.as_giant+'_flv_overlay'),
			tip_title: 'A Message:',
			tip_body: args.msg,
			sound: 'GONG_GIANTS',
			start_with_tip: true
		};

		apiSendToAll(rsp);
	}
	else{
		apiSendToAll({
			type:	'pc_local_chat',
			pc:	{
				tsid: 'god',
				label: 'GOD'
			},
			after_revision: args.after_revision,
			before_revision: args.before_revision,
			txt: args.msg,
			above_level: args.above_level
		});
	}
}

function broadcastSoftReload(args){
	apiSendToAll({
		type: "force_reload",
		at_next_move: true,
		after_revision: args.after_revision,
		before_revision: args.before_revision,
		msg: args.msg
	});
}

function broadcastHardReload(args){
	apiSendToAll({
		type: "force_reload",
		at_next_move: false,
		after_revision: args.after_revision,
		before_revision: args.before_revision,
		msg: args.msg
	});
}

function getPlayersOnline(args){

	var out = {};

	for (var i in args.players){

		var tsid = args.players[i];
		out[tsid] = {
			is: apiIsPlayerOnline(tsid),
		};

		if (out[tsid].is){
			out[tsid].loc = apiFindObject(tsid).runCustom('this.location.label');
		}
	}

	return out;
}

function getPlayersCustom(args){

	var out = {};

	for (var i in args.players){

		try {
			var tsid = args.players[i];
			var p = apiFindObject(tsid);

			if (p != null && p != undefined) {
				out[tsid] = p.runCustom(args.code);
			}

		} catch(e){
			log.error('Exception during getPlayersCustom', e);
		}
	}

	return out;
}

function getObjectsBatch(args){

	var out= {};

	for (var i in args.tsids){
		var tsid = args.tsids[i];
		var p = apiFindObject(tsid);

		if (p){
			out[tsid] = p[args.method]();
		}
	}

	return out;
}

function getObjectsParallel(args){

	return apiCallMethod(args.method, args.tsids);
}

function getPropParallel(args){
	return apiCallMethod('getProp', args.tsids, args.prop);
}

function adminExec(args){
        try {
                return {
			ok: 1,
			data: eval(args.code),
		};
        }
        catch (e){
		return {
			ok: 0,
			error: "Exception",
			ex: e,
		};
                log.error('Exception during ADMIN_CALL eval', e, args.code);
        }
}

function adminGetMusic(args){
	return config.music_map;
}

function adminTestHash(){

	var a = {a:1, b: 2};
	a.c = 3;
	a['d'] = 4;

	return a;
}

function adminFindItems(args){
	var out = {};
	if (!args.class_id) return out;
	
	for (var i in config.data_maps.streets){
		for (var j in config.data_maps.streets[i]){
			for (var k in config.data_maps.streets[i][j]){
				try {
					var l = apiFindObject(k);
					var items = l.find_items(args.class_id);
					for (var ii in items){
						out[items[ii].tsid] = items[ii].container.tsid;
					}
				} catch(e) {}
			}
		}
	}
	return out;
}

function adminFindPlayersOnLockedStreets(args){
	var out = {};
	for (var i in config.data_maps.streets){
		for (var j in config.data_maps.streets[i]){
			for (var k in config.data_maps.streets[i][j]){
				try {
					var l = apiFindObject(k);
					if (!l.jobs_is_street_locked()) continue;
					
					var players = l.getAllPlayers();
					for (var p in players){
						out[players[p].tsid] = l.tsid;
					}
				} catch(e) {}
			}
		}
	}
	return out;
}

function getPolUids(){

	var out = [];
	for (var i in config.pol_types){
		var uid = config.pol_types[i].uid;
		if (uid != 'old') out.push(uid);
	}

	return out.join(',');
}

function getQuarterTemplateUids(){
	
	var out = [];
	for (var i in config.quarter_templates){
		out.push(i);
	}

	return out;
}

function createQuarter(args){

	var q = apiNewGroup('quarter');

	q.init(1, 1, args.mote, args.hub, args.name);

	return q.tsid;
}

function getStreetNumActivePlayers(args){

	var out = {};

	for (var i in args.streets){

		try{
			var street = apiFindObject(args.streets[i]);

			out[street.tsid] = street.getNumActivePlayers();
		}catch(e){
			out[args.streets[i]] = {};
		}
	}

	return out;
}

function getPublicHubs(){

	return config.public_hubs;
}

function clearMapCache(args){
	log.info('Clearing map cache: '+args);
	if (!config.data_maps.cache) return;

	if (args && args.hub_id && config.data_maps.cache[args.hub_id]){
		if (args.location_tsid){
			config.data_maps.cache[args.hub_id][args.location_tsid] = {};
		}
		else{
			config.data_maps.cache[args.hub_id] = {};
		}
	}
	else{
		config.data_maps.cache = {};
	}
}

function getPlayerGroupStates(args){

	var ret = apiCallMethod('groups_get_status', args.players, args.group_tsid);

	return ret;
}

function createRookAttack(args) {
	log.info("Creating Rook attack with health "+args.health+" on hub "+args.hubid);	
	if(!args || !args.hubid) {
		return;
	}
	var rook_attack = apiNewGroupForHub('rook_attack', args.hubid);
	rook_attack.initialize(args.hubid);

	rook_attack.newLocation();
	rook_attack.setSchedule(args.min_delay ? args.min_delay : 60, args.max_delay ? args.max_delay : 60);
	rook_attack.startAttack(args.health);
	
	if (config.rook_attack_tracker) {
		apiFindObject(config.rook_attack_tracker).addAttack(rook_attack.tsid);
	}
	
	return {rook_attack: rook_attack.tsid, info: rook_attack.rookAttackGetInfo()};
}

function getGameInstances(args){
	return apiFindObject(config.shared_instance_manager).getPlayerStats();
}

function reloadAllClients(args){
	apiSendToAll({
		type: "force_reload",
		at_next_move: args.at_next_move ? true : false,
		msg: args.msg ? args.msg : ''
	});
}

function getAnimalNames(args){

	var out = {};

	for (var i in args.tsids){

		try {
			var tsid = args.tsids[i];
			var item = apiFindObject(tsid);
			out[tsid] = item.getNameInfo();;
		} catch(e){
		}
	}

	return out;
}

function cleanAnimalNames(args){

	var out = {};

	for (var i in args.animals){

		try {
			var tsid = args.animals[i][0];
			var name = args.animals[i][1];
			var item = apiFindObject(tsid);
			out[i] = item.clearNameIf(name);
		} catch(e){
		}
	}

	return out;
}

function getHells(args){
	var out = {};
	var base = apiFindObject(config.hell.tsid);

	out[base.tsid] = {};

	var instances = base.instances_get_instances();
	if (!instances['hell_one']) return {};

	for (var i=0; i<instances['hell_one'].length; i++){
		var instance = instances['hell_one'][i];
		if (instance) out[instance.get_entrance()] = {is_instance: true};
	}

	var other_hells = ['LA5REO5I9OE2KLS', 'LA524M0OMOE2OGT', 'LA5PV4T79OE2AOA', 'LA5RPAFK9OE28GN', 'LA5Q57C99OE2GNU', 'LA5S44RM9OE2416'];
	for (var i in other_hells){
		out[other_hells[i]] = {is_instance: false};
	}

	for (var i in out){
		var loc = apiFindObject(i);
		if (loc){
			var players = loc.getAllPlayers();
			var alive = [];
			for (var p in players){
				var player = players[p];
				if (!player.is_dead && !player.is_god && !player.is_guide){
					try{
						player.resurrect();
					}catch (e){}
					alive.push(p);
				}
			}

			out[i] = {
				is_instance: out[i].is_instance,
				tsid: i,
				online: loc.getNumActivePlayers(),
				all: num_keys(players),
				alive: alive.length,
				grapes: loc.countItemClass('bunch_of_grapes_hell'),
				spawners: loc.countItemClass('spawner')
			};
		}
	}

	return out;
}

function getImaginationOptions(args){
	var upgrade = config.data_imagination_upgrades[args.id];
	if (!upgrade) return {};

	return upgrade.options ? upgrade.options : {};
}

function admin_craftytasking_get_crafting_tree(args){
	var spec = utils.craftytasking_get_build_spec(null, args.class_tsid, args.req_count, false);
	log.info('admin_craftytasking_get_crafting_tree: '+spec);
	return spec;
}

function admin_craftytasking_categories(args){
	return utils.craftytasking_categories();
}

function admin_craftytasking_category_items(args){
	return utils.craftytasking_category_items(null, args.category);
}

function admin_skills_get_quest_map(args){
	return config.skills_get_quest_map();
}

function admin_get_map(args){

	var street = null;

	var hub_basic = config.data_maps.maps[args.hub_id];
	if (hub_basic.objs[0]){
		street = apiFindObject(hub_basic.objs[0].tsid);
	}

	if (!street){
		return {
			ok: 0,
		};
	}

	return street.get_map(null);
}

// this is exactly like the method on players, but without the player context
function adminGetItemDescExtras(args){
	if (!args || !args.class_id) return {};

	var proto = apiFindItemPrototype(args.class_id);
	if (!proto || !proto.getDescExtras) return {};

	return proto.getDescExtras();
}

function adminCreateFeat(args){
	var feat = apiNewGroup('feat');

	if (feat){
		feat.doCreate(args.class_tsid, args.game_day, args.goal, args.goal_multiplier, args.stretch_goal1, args.stretch_goal2);
		return {
			ok: 1,
			tsid: feat.tsid
		};
	}

	return {
		ok: 0
	};
}

function adminUpdateFeat(args){
	var feat = apiFindObject(args.tsid);
	if (feat){
		feat.update(args.game_day, args.goal, args.goal_multiplier, args.stretch_goal1, args.stretch_goal2);
		return {ok: 1};
	}

	return {ok: 0};
}

function adminDeleteFeat(args){
	var feat = apiFindObject(args.tsid);
	if (feat){
		feat.apiDelete();
		return {ok: 1};
	}

	return {ok: 0};
}

function adminRouteToStreets(args){

	//
	// get pc and their location
	//

	var pc = apiFindObject(args.pc_tsid);
	if (!pc) return {
		'ok' : 0,
		'error' : 'player_not_found',
	};


	//
	// we can short-cut the routing if the item exists
	// in this street.
	//

	var loc = pc.get_location();

	var items = loc.routingGetItems();

	if (items[args.item_class_tsid]){

		return {
			'ok' : 1,
			'street' : loc.get_client_info(),
		};
	}


	//
	// now try routing to the provided target streets
	//

	var targets = [];
	for (var i in args.dest_tsids) targets.push(args.dest_tsids[i]);

	var ret = apiFindShortestGlobalPath(loc.tsid, targets);

	if (!ret.length){
		return {
			'ok' : 0,
			'error' : 'no_route',
		};
	}

	var last_hop = ret.pop();
	var street = apiFindObject(last_hop.tsid);

	return {
		'ok' : 1,
		'street' : street.get_client_info(),
	};
}

function adminGetPlayerHouses(args){
	return apiCallMethod('houses_get_external_tsid', args.player_tsids);
}

function getNewXPLocationSwfs(){
	var ret = {};
	for (var i in config.newxp_locations){
		var loc = apiFindObject(config.newxp_locations[i]);
		if (loc) ret[i] = loc.getVersionedSwf();
	}

	return ret;
}