function furniture_init(){
	if (this.furniture === undefined || this.furniture === null){
		this.furniture = apiNewOwnedDC(this);
		this.furniture.label = 'Furniture';

		this.furniture_create_bag();
	}
	
	var bag = this.furniture_get_bag();
	if (!bag){
		this.furniture_create_bag();
	}

	if (!this.furniture.walls) this.furniture.walls = {};
	if (!this.furniture.floors) this.furniture.floors = {};
	if (!this.furniture.ceilings) this.furniture.ceilings = {};
	if (!this.furniture.chassis) this.furniture.chassis = {};
	//if (!this.furniture.texture_history) this.furniture.texture_history = { walls: [], floors: [], ceilings: [] };
}

function furniture_delete(){
	if (this.furniture){
		var bag = this.furniture_get_bag();
		if (bag){
			var contents = bag.getAllContents();
			for (var n in contents){
				var it = contents[n];
				if (it) it.apiDelete();
			}

			bag.apiDelete();
		}

		this.furniture.apiDelete();
		delete this.furniture;
	}
}

function furniture_reset(){
	this.furniture_delete();
	this.furniture_init();
}

function furniture_create_bag(){
	// Create a new private storage bag for holding overflow items
	var it = apiNewItemStack('bag_furniture', 1);
	it.label = 'Private Furniture Storage';

	this.apiAddHiddenStack(it);

	this.furniture.storage_tsid = it.tsid;
	this.furniture_populate();
	this.furniture_migrate_trophies();
}

function furniture_get_bag(){
	if (!this.furniture) this.furniture_init();
	return this.hiddenItems[this.furniture.storage_tsid];
}

function furniture_add_hidden(furniture){
	var bag = this.furniture_get_bag();

	return bag.addItemStack(furniture);
}

function furniture_get_hidden(){
	var bag = this.furniture_get_bag();
	
	return bag.getAllContents();
}

function furniture_populate(force){
	// https://app.asana.com/0/229838047628/498067056902
	var to_give = {
		'furniture_chair': 1,
		'furniture_table': 1,
		'furniture_shelf': 2,
		'furniture_ceilinglamp': 1,
		'bag_furniture_smallcabinet': 1,
		'furniture_floorlamp': 1,
		'furniture_tabledeco': 1,
		'furniture_roomdeco': 1,
		'bag_furniture_sdb': 2,
		'furniture_walldeco': 1
	};

	for (var tsid in to_give){
		var count = to_give[tsid];
		try {
			if (!force){
				var has = this.furniture_get_count(tsid) + this.countItemClass(tsid);
				var needs = count-has;
				if (needs > 0){
					var s = apiNewItemStack(tsid, needs);
					if (s){
						s.setSoulbound(this);
						this.addItemStack(s);
					}
				}
			}
			else{
				var s = apiNewItemStack(tsid, count);
				if (s){
					s.setSoulbound(this);
					this.addItemStack(s);
				}
			}
		} catch (e){
			log.error(this+' '+e);
		}
	}
}

function furniture_populate_newxp(){
	// http://tools.tinyspeck.com/pastebin/5212
	var to_give = {
		'furniture_chair': 15,
		'furniture_table': 59,
		'furniture_shelf': 94,
		'furniture_ceilinglamp': 578,
		'bag_furniture_smallcabinet': 325,
		'furniture_roomdeco': 137,
		'furniture_walldeco': 141
	};

	for (var tsid in to_give){
		var upgrade_id = to_give[tsid];
		try {
			var s = apiNewItemStack(tsid, 1);
			if (s){
				s.setSoulbound(this);
				s.applyUpgrade(this, upgrade_id);
				this.addItemStack(s);
			}
		} catch (e){
			log.error(this+' '+e);
		}
	}
}

function furniture_count(){
	var bag = this.furniture_get_bag();
	return bag.countContents();
}

// Do they have this furniture item in their furniture bag or POL?
function furniture_has_item(class_tsid){
	var bag = this.furniture_get_bag();
	if (bag.countItemClass(class_tsid)) return true;

	if (!this.home || !this.home.interior) return false;

	if (this.home.interior.item_exists(class_tsid)) return true;

	if (!this.home.exterior) return false;

	if (this.home.exterior.item_exists(class_tsid)) return true;

	return false;
}

function furniture_get_count(class_tsid){
	var count = 0;
	var bag = this.furniture_get_bag();
	count += bag.countItemClass(class_tsid);

	if (!this.home || !this.home.interior || !this.home.exterior) return count;

	count += this.home.interior.countItemClass(class_tsid);
	count += this.home.exterior.countItemClass(class_tsid);

	return count;
}

function furniture_migrate_trophies(){
	var bag = this.furniture_get_bag();

	var trophies = this.trophies_get_hidden();
	for (var i in trophies){
		var t = trophies[i];
		if (!t) continue;

		if (!this.furniture_has_item(t.class_tsid)){
			var s = apiNewItemStack(t.class_tsid, 1);
			s.ago = t.getProp('ago') ? t.getProp('ago') : t.ts;
			bag.addItemStack(s);
		}
		else{
			var s = bag.removeItemStackClass(t.class_tsid, 1);
			if (s){
				s.setProp('ago', t.getProp('ago') ? t.getProp('ago') : t.ts);
			}
			else if (this.home && this.home.interior){
				s = this.home.interior.find_items(t.class_tsid);
				if (s[0]) s[0].setProp('ago', t.ts);
			}
		}
	}


	for (var i in this.achievements.achievements){

		var trophy = this.achievement_get_trophy(i);
		if (trophy && trophy.class_tsid){
			if (config.is_dev) log.info(this+" has trophy achievement "+i);
			if (!this.trophies_has(trophy.class_tsid)){
				if (config.is_dev) log.info(this+" is missing trophy "+i);
				this.trophies_add_hidden(apiNewItemStack(trophy.class_tsid, 1));
			}
		}
	}
}



function furniture_get_wall_options(){

	var out = {};

	for (var i in config.homes_wallpaper_configs){

		var conf = config.homes_wallpaper_configs[i];

		if (!this.is_god && !conf.is_visible) continue;

		if (conf.is_default && !this.furniture.walls[i]){

			this.furniture.walls[i] = {
				'free_default'	: true,
				'when'		: time(),
			};
		}

		// Hide paid swatches from newxp players
		if (this.location.is_newxp){
			if (conf.cost_credits || (conf.is_subscriber && !this.stats_is_sub())) continue;
		}

		out[i] = {
			'label'		: conf.name,
			'category'	: conf.category,
			'sort_order'	: conf.sort_order,
			'swatch'	: conf.swatch,
			'is_owned'	: this.furniture.walls[i] ? true : false,
			'date_purchased': this.furniture.walls[i] ? intval(this.furniture.walls[i].when) : 0,
			'cost_credits'	: conf.cost_credits,
			'is_new'	: conf.is_new,
			'is_subscriber'	: conf.is_subscriber,
		};

		if (!conf.is_visible) out[i].admin_only = true;
	}

	return out;
}

function furniture_get_floor_options(){

	var out = {};

	for (var i in config.homes_floor_configs){

		var conf = config.homes_floor_configs[i];

		if (!this.is_god && !conf.is_visible) continue;

		if (conf.is_default && !this.furniture.floors[i]){

			this.furniture.floors[i] = {
				'free_default'	: true,
				'when'		: time(),
			};
		}

		// Hide paid swatches from newxp players
		if (this.location.is_newxp){
			if (conf.cost_credits || (conf.is_subscriber && !this.stats_is_sub())) continue;
		}

		out[i] = {
			'label'		: conf.name,
			'category'	: conf.category,
			'sort_order'	: conf.sort_order,
			'swatch'	: conf.swatch,
			'is_owned'	: this.furniture.floors[i] ? true : false,
			'date_purchased': this.furniture.floors[i] ? intval(this.furniture.floors[i].when) : 0,
			'cost_credits'	: conf.cost_credits,
			'is_new'	: conf.is_new,
			'is_subscriber'	: conf.is_subscriber,
		};

		if (!conf.is_visible) out[i].admin_only = true;
	}

	return out;
}

function furniture_get_ceiling_options(){

	var out = {};

	for (var i in config.homes_ceiling_configs){

		var conf = config.homes_ceiling_configs[i];

		if (!this.is_god && !conf.is_visible) continue;

		if (conf.is_default && !this.furniture.ceilings[i]){

			this.furniture.ceilings[i] = {
				'free_default'	: true,
				'when'		: time(),
			};
		}

		// Hide paid swatches from newxp players
		if (this.location.is_newxp){
			if (conf.cost_credits || (conf.is_subscriber && !this.stats_is_sub())) continue;
		}

		out[i] = {
			'label'		: conf.name,
			'category'	: conf.category,
			'sort_order'	: conf.sort_order,
			'swatch'	: conf.swatch,
			'is_owned'	: this.furniture.ceilings[i] ? true : false,
			'date_purchased': this.furniture.ceilings[i] ? intval(this.furniture.ceilings[i].when) : 0,
			'cost_credits'	: conf.cost_credits,
			'is_new'	: conf.is_new,
			'is_subscriber'	: conf.is_subscriber,
		};

		if (!conf.is_visible) out[i].admin_only = true;
	}

	return out;
}

//
// setters
//

function furniture_set_wall(wp_key, wp_type){

	// do we own this wallpaper?
	if (!this.furniture.walls[wp_type]){
		return {
			'ok' : 0,
			'error' : 'wallpaper_not_owned',
		};
	}

	var loc_type = this.location.homes_get_type();

	// we own it - set it!
	apiLogAction('WALL_CHANGE', 'pc='+this.tsid, 'type='+wp_type, 'loc_type='+loc_type);

	if (loc_type == 'interior') return this.home.interior.homes_set_wp(wp_key, wp_type);
	if (loc_type == 'tower') return this.location.tower_set_wp(wp_key, wp_type);
}

function furniture_set_floor(floor_key, floor_type){

	// do we own this flooring?
	if (!this.furniture.floors[floor_type]){
		return {
			'ok' : 0,
			'error' : 'floor_not_owned',
		};
	}

	var loc_type = this.location.homes_get_type();

	// we own it - set it!
	apiLogAction('FLOOR_CHANGE', 'pc='+this.tsid, 'type='+floor_type);

	if (loc_type == 'interior') return this.home.interior.homes_set_floor(floor_key, floor_type);
	if (loc_type == 'tower') return this.location.tower_set_floor(floor_key, floor_type);
}

function furniture_set_ceiling(ceiling_key, ceiling_type){

	// do we own this ceiling?
	if (!this.furniture.ceilings[ceiling_type]){
		return {
			'ok' : 0,
			'error' : 'ceiling_not_owned',
		};
	}

	var loc_type = this.location.homes_get_type();

	// we own it - set it!
	apiLogAction('CEILING_CHANGE', 'pc='+this.tsid, 'type='+ceiling_type);

	if (loc_type == 'interior') return this.home.interior.homes_set_ceiling(ceiling_key, ceiling_type);
	if (loc_type == 'tower') return this.location.tower_set_ceiling(ceiling_key, ceiling_type);
}


//
// previews
//

function furniture_preview_wall(wp_key, wp_type){

	var loc_type = this.location.homes_get_type();

	if (loc_type == 'interior') return this.home.interior.homes_set_wp(wp_key, wp_type, this);
	if (loc_type == 'tower') return this.location.tower_set_wp(wp_key, wp_type, this);
}

function furniture_preview_floor(floor_key, floor_type){

	var loc_type = this.location.homes_get_type();

	if (loc_type == 'interior') return this.home.interior.homes_set_floor(floor_key, floor_type, this);
	if (loc_type == 'tower') return this.location.tower_set_floor(floor_key, floor_type, this);
}

function furniture_preview_ceiling(ceiling_key, ceiling_type){

	var loc_type = this.location.homes_get_type();

	if (loc_type == 'interior') return this.home.interior.homes_set_ceiling(ceiling_key, ceiling_type, this);
	if (loc_type == 'tower') return this.location.tower_set_ceiling(ceiling_key, ceiling_type, this);
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
// purchase wallpaper
//

function furniture_buy_wall(wp_type){

	var ret = this.furniture_can_buy_wall(wp_type);
	if (ret.ok){

		this.stats_spend_credits(ret.cost, {
			'callback'	: 'furniture_buy_wall_do',
			'wp_type'	: wp_type,
		});
	}

	return ret;
}

function furniture_can_buy_wall(wp_type){

	// is this a real wallpaper?
	if (!config.homes_wallpaper_configs[wp_type]){
		return {
			'ok' : 0,
			'error' : 'invalid_wp_type'
		};
	}

	// already owned?
	if (this.furniture.walls[wp_type]){
		return {
			'ok' : 0,
			'error' : 'already_owned',
		};
	}

	// too expensive?
	var cost = 0;
	if (!config.home_limits.UPGRADES_ARE_FREE){
		if (config.homes_wallpaper_configs[wp_type].is_subscriber && !this.stats_is_sub()){
			return {
				'ok' : 0,
				'error' : 'not_a_subscriber',
			};
		}

		cost = config.homes_wallpaper_configs[wp_type].cost_credits;
		if (cost && !this.stats_has_credits(cost)){
			return {
				'ok' : 0,
				'error' : 'not_enough_credits',
			};
		}
	}

	return {
		'ok': 1,
		'cost': cost,
	};
}

function furniture_buy_wall_do(args){

	if (!args.ok){
		this.furniture_buy_wall_done(false, args.wp_type, 'not_enough_credits');
		return {};
	}

	var ret = this.furniture_can_buy_wall(args.wp_type);
	if (!ret.ok){
		this.furniture_buy_wall_done(false, args.wp_type, ret.error);
		return {};
	}

	this.furniture.walls[args.wp_type] = {
		'paid_credits'	: args.amount,
		'when'		: time(),
	};

	this.furniture_buy_wall_done(true, args.wp_type);

	return {
		'type'		: 'wallpaper_purchase',
		'wp_type'	: args.wp_type,
	};
}

function furniture_buy_wall_done(success, wp_type, error){

	this.apiSendMsg({
		'type'		: 'houses_wall_purchased',
		'wp_type'	: wp_type,
		'error'		: error,
	});

	if (success) apiLogAction('WALL_PURCHASE', 'pc='+this.tsid, 'type='+wp_type);
	//log.info("FINISHED PURCHASE!!!", success, wp_type, error);
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//

function furniture_buy_floor(floor_type){

	var ret = this.furniture_can_buy_floor(floor_type);
	if (ret.ok){

		this.stats_spend_credits(ret.cost, {
			'callback'	: 'furniture_buy_floor_do',
			'floor_type'	: floor_type,
		});
	}

	return ret;
}

function furniture_can_buy_floor(floor_type){

	// is this a real flooring?
	if (!config.homes_floor_configs[floor_type]){
		return {
			'ok' : 0,
			'error' : 'invalid_floor_type'
		};
	}

	// already owned?
	if (this.furniture.floors[floor_type]){
		return {
			'ok' : 0,
			'error' : 'already_owned',
		};
	}


	// too expensive?
	var cost = 0;
	if (!config.home_limits.UPGRADES_ARE_FREE){
		if (config.homes_floor_configs[floor_type].is_subscriber && !this.stats_is_sub()){
			return {
				'ok' : 0,
				'error' : 'not_a_subscriber',
			};
		}

		cost = config.homes_floor_configs[floor_type].cost_credits;
		if (cost && !this.stats_has_credits(cost)){
			return {
				'ok' : 0,
				'error' : 'not_enough_credits',
			};
		}
	}

	return {
		'ok': 1,
		'cost': cost,
	};
}

function furniture_buy_floor_do(args){

	if (!args.ok){
		this.furniture_buy_floor_done(false, args.floor_type, 'not_enough_credits');
		return {};
	}

	var ret = this.furniture_can_buy_floor(args.floor_type);
	if (!ret.ok){
		this.furniture_buy_floor_done(false, args.floor_type, ret.error);
		return {};
	}

	this.furniture.floors[args.floor_type] = {
		'paid_credits'	: args.amount,
		'when'		: time(),
	};

	this.furniture_buy_floor_done(true, args.floor_type);

	return {
		'type'		: 'floor_purchase',
		'floor_type'	: args.floor_type,
	};
}

function furniture_buy_floor_done(success, floor_type, error){

	this.apiSendMsg({
		'type'		: 'houses_floor_purchased',
		'floor_type'	: floor_type,
		'error'		: error,
	});

	if (success) apiLogAction('FLOOR_PURCHASE', 'pc='+this.tsid, 'type='+floor_type);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//

function furniture_buy_ceiling(ceiling_type){

	var ret = this.furniture_can_buy_ceiling(ceiling_type);
	if (ret.ok){

		this.stats_spend_credits(ret.cost, {
			'callback'	: 'furniture_buy_ceiling_do',
			'ceiling_type'	: ceiling_type,
		});
	}

	return ret;
}

function furniture_can_buy_ceiling(ceiling_type){

	// is this a real ceiling?
	if (!config.homes_ceiling_configs[ceiling_type]){
		return {
			'ok' : 0,
			'error' : 'invalid_ceiling_type'
		};
	}

	// already owned?
	if (this.furniture.ceilings[ceiling_type]){
		return {
			'ok' : 0,
			'error' : 'already_owned',
		};
	}

	// too expensive?
	var cost = 0;
	if (!config.home_limits.UPGRADES_ARE_FREE){
		if (config.homes_ceiling_configs[ceiling_type].is_subscriber && !this.stats_is_sub()){
			return {
				'ok' : 0,
				'error' : 'not_a_subscriber',
			};
		}

		cost = config.homes_ceiling_configs[ceiling_type].cost_credits;
		if (cost && !this.stats_has_credits(cost)){
			return {
				'ok' : 0,
				'error' : 'not_enough_credits',
			};
		}
	}

	return {
		'ok': 1,
		'cost': cost,
	};
}

function furniture_buy_ceiling_do(args){

	if (!args.ok){
		this.furniture_buy_ceiling_done(false, args.ceiling_type, 'not_enough_credits');
		return {};
	}

	var ret = this.furniture_can_buy_ceiling(args.ceiling_type);
	if (!ret.ok){
		this.furniture_buy_ceiling_done(false, args.ceiling_type, ret.error);
		return {};
	}

	this.furniture.ceilings[args.ceiling_type] = {
		'paid_credits'	: args.amount,
		'when'		: time(),
	};

	this.furniture_buy_ceiling_done(true, args.ceiling_type);

	return {
		'type'		: 'ceiling_purchase',
		'ceiling_type'	: args.ceiling_type,
	};
}

function furniture_buy_ceiling_done(success, ceiling_type, error){

	this.apiSendMsg({
		'type'		: 'houses_ceiling_purchased',
		'ceiling_type'	: ceiling_type,
		'error'		: error,
	});

	if (success) apiLogAction('CEILING_PURCHASE', 'pc='+this.tsid, 'type='+ceiling_type);
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//

function furniture_upgrade_purchase(item, upgrade_id, msg_id, user_config, facing_right){
	var upgrades = item.getUpgrades(this);
	var upgrade = upgrades[upgrade_id];

	if (!upgrade) return {ok: 0, error: 'Invalid upgrade'};
	if (item.getInstanceProp('upgrade_id') == upgrade_id) return {ok: 0, error: 'Already upgraded'};
	if (item['!upgrade_in_progress']) return {ok: 0, error: 'Upgrade in progress'};

	if (!config.home_limits.UPGRADES_ARE_FREE && !upgrade.is_owned && upgrade.subscriber_only == 1 && !this.stats_is_sub()) return {ok: 0, error: 'The upgrade is subscriber-locked, and you are not a subscriber'};

	if (!config.home_limits.UPGRADES_ARE_FREE && !upgrade.is_owned && upgrade.imagination_cost && !this.stats_try_remove_imagination(upgrade.imagination_cost, {'furniture_class': item.class_tsid, 'upgrade_id': upgrade_id})) return {ok: 0, error: 'You don\'t have enough imagination.'};
	
	if (upgrade.is_owned) apiLogAction('FURNITURE_CHANGE', 'pc='+this.tsid, 'item='+item.class_tsid, 'upgrade='+upgrade_id, 'config='+utils.JSON_stringify(user_config)+'');
	
	// Can we do this now?
	if (!upgrade.credits_cost || upgrade.is_owned || config.home_limits.UPGRADES_ARE_FREE){
		var ret = this.furniture_upgrade_purchase_do({
			tsid: item.tsid,
			upgrade_id: upgrade_id,
			facing_right: facing_right ? 1 : 0,
			user_config: utils.JSON_stringify(user_config),
			is_owned: upgrade.is_owned ? 1 : 0,
			ok: 1
		});
		
		return {ok: 1, immediate: 1};
	}
	else{
		// Set a callback to the webapp to perform the purchase
		var args = {
			callback: 'furniture_upgrade_purchase_do',
			tsid: item.tsid,
			upgrade_id: upgrade_id,
			facing_right: facing_right ? 1 : 0,
			is_owned: 0,
			msg_id: msg_id,
			user_config: utils.JSON_stringify(user_config)
		};
		log.info(this+' furniture_upgrade_purchase '+args);

		item['!upgrade_in_progress'] = true;
		if (this.stats_spend_credits(upgrade.credits_cost, args)){
			return {ok: 1};
		}
		else{
			return {ok: 0, error: "You don't have enough credits."};
		}
	}
}

function furniture_upgrade_purchase_do(args){
	log.info(this+' furniture_upgrade_purchase_do '+args);
	var item = apiFindObject(args.tsid);
	if (!item) return {};

	if (args.ok){
		var upgrade = item.applyUpgrade(this, intval(args.upgrade_id));
		if (args.user_config) {
			eval("var user_config = "+args.user_config+";");
			item.setInstanceProp('user_config', user_config);
		}
		
		var facing_right = (intval(args.facing_right) == 1) ? 1 : 0;
		if (facing_right != item.getInstanceProp('facing_right')) {
			item.setInstanceProp('facing_right', facing_right);
			item.flipPlats();
		}

		if (args.msg_id){
			this.apiSendMsg({
				msg_id  : args.msg_id,
				type    : 'furniture_upgrade_purchase',
				success : true
			});
		}

		if (item.class_tsid == 'furniture_chassis' && !this.furniture_owns_chassis(args.upgrade_id)){
			this.furniture_add_chassis(args.upgrade_id, args.amount);
		}
		
		item.broadcastConfig();

		if (args.is_owned == 0) apiLogAction('FURNITURE_PURCHASE', 'pc='+this.tsid, 'item='+item.class_tsid, 'upgrade='+args.upgrade_id, 'cost='+(args.amount ? args.amount : 0), 'config='+args.user_config+'');

		delete item['!upgrade_in_progress'];

		return {
			type: 'furniture_upgrade',
			tsid: item.tsid,
			class_tsid: item.class_tsid,
			upgrade_id: args.upgrade_id,
			upgrade_name: upgrade.name
		};
	}
	else{
		delete item['!upgrade_in_progress'];
		log.info(this+' failing upgrade '+args.upgrade_id+' to '+item);
		if (args.msg_id){
			this.apiSendMsg({
				msg_id  : args.msg_id,
				type    : 'furniture_upgrade_purchase',
				success : false,
				error   : {
					code    : 1,
					msg     : "Not enough credits."
				}
			});
		}

		return {};
	}
}


function furniture_admin_get_textures(){

	var out = {
		ok: 1,
		walls: {},
		floors: {},
		ceilings: {},
	};

	for (var i in config.homes_wallpaper_configs){
		if (this.furniture.walls[i]){
			out.walls[i] = this.furniture.walls[i];
			out.walls[i].is_default = config.homes_wallpaper_configs[i].is_default ? true : false;
		}
	}

	for (var i in config.homes_floor_configs){
		if (this.furniture.floors[i]){
			out.floors[i] = this.furniture.floors[i];
			out.floors[i].is_default = config.homes_floor_configs[i].is_default ? true : false;
		}
	}

	for (var i in config.homes_ceiling_configs){
		if (this.furniture.ceilings[i]){
			out.ceilings[i] = this.furniture.ceilings[i];
			out.ceilings[i].is_default = config.homes_ceiling_configs[i].is_default ? true : false;
		}
	}

	return out;
}

function furniture_admin_get_texture_options(){

	var out = {
		ok: 1,
		walls: this.furniture_get_wall_options(),
		floors: this.furniture_get_floor_options(),
		ceilings: this.furniture_get_ceiling_options()
	};

	return out;
}

function furniture_admin_remove_texture(args){
	this.furniture_init();

	if (!this.furniture[args.type]){
		return {
			ok: 0,
			error: "Invalid type"
		};
	}

	if (!this.furniture[args.type][args.id]){
		return {
			ok: 0,
			error: "Not owned"
		};
	}

	// Delete it
	delete this.furniture[args.type][args.id];

	// Tell the client and remove from house
	if (args.type == 'walls'){
		this.home.interior.homes_delete_wallpaper(args.id);
		this.apiSendMsg({
			'type'		: 'houses_wall_removed',
			'wp_type'	: args.id
		});
	}
	else if (args.type == 'floors'){
		this.home.interior.homes_delete_flooring(args.id);
		this.apiSendMsg({
			'type'		: 'houses_floor_removed',
			'floor_type'	: args.id
		});
	}
	else if (args.type == 'ceilings'){
		this.home.interior.homes_delete_ceiling(args.id);
		this.apiSendMsg({
			'type'		: 'houses_ceiling_removed',
			'ceiling_type'	: args.id
		});
	}

	// Record that we removed it, when, and by whom
	/*if (!this.furniture.deleted_textures[args.type]) this.furniture.deleted_textures[args.type] = {};
	if (!this.furniture.deleted_textures[args.type][args.id]) this.furniture.deleted_textures[args.type][args.id] = [];
	this.furniture.deleted_textures[args.type][args.id].push({
		deleted: time(),
		admin_user: args.info.staff_removed
	});*/

	return {
		ok: 1
	};
}

function furniture_admin_add_texture(args){
	if (!this.furniture[args.type]){
		return {
			ok: 0,
			error: "Invalid type"
		};
	}

	if (this.furniture[args.type][args.id]){
		return {
			ok: 0,
			error: "Already owned"
		};
	}
	
	this.furniture[args.type][args.id] = {
		'paid_credits'	: 0,
		'when'		: time(),
		'staff_gift': args.info.staff_gift
	};

	if (args.type == 'walls'){
		this.furniture_buy_wall_done(true, args.id);
	}
	else if (args.type == 'floors'){
		this.furniture_buy_floor_done(true, args.id);
	}
	else if (args.type == 'ceilings'){
		this.furniture_buy_ceiling_done(true, args.id);
	}

	return {
		ok: 1
	};
}


function furniture_owns_chassis(upgrade_id){
	if (upgrade_id == 0) return true;
	return this.furniture.chassis && this.furniture.chassis[upgrade_id] ? true : false;
}

function furniture_add_chassis(upgrade_id, amount){
	this.furniture.chassis[upgrade_id] = {
		'paid_credits'	: amount,
		'when'		: time(),
	};
}

function furniture_pickup(itemstack_tsid){
	if (!this.houses_is_at_home()) return api_error("You are not at home");

	var item = this.location.apiLockStack(itemstack_tsid);
	if (!item) return api_error("That item is not here");

	if (item.class_tsid == 'furniture_chassis' || item.class_tsid == 'furniture_tower_chassis') return api_error("You can't pick that up");

	if ((item.is_bag && item.countContents()) || (item.class_tsid == 'furniture_door' && (item.hasInProgressJob(pc) || !item.has_job))) return api_error("You can't pick that up");

	if (item.canPickup){
		var ret = item.canPickup(this);
		if (!ret.ok){
			if (ret.error) return ret;
			return api_error("You can't pick that up");
		}
	}

	delete item.z;

	this.furniture_get_bag().addItemStack(item);

	// Remove plats contained in the item and let players know
	this.location.geo_remove_plats_by_source(item.tsid);

	if (item.class_tsid == 'furniture_door'){
		item.reset();
		var job_id = 'proto-'+item.tsid;
		var job = this.location.jobs_get(job_id);
		if (job){
			this.location.jobs_reset(job_id, true);
			delete this.location.jobs[job_id];
		}
	}

	return api_ok();
}
