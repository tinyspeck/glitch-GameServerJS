function applyUpgrade(pc, upgrade_id){
	log.info(pc+' applying upgrade '+upgrade_id+' to '+this);
	var upgrades = this.getUpgrades(pc);
	var upgrade = upgrades[upgrade_id];

	var previous_upgrade = intval(this.getInstanceProp('upgrade_id'));
	if (!this.upgrade_history) this.upgrade_history = [];
	this.upgrade_history.push({
		from: previous_upgrade,
		to: upgrade_id,
		when: time(),
		who: pc.tsid
	});

	// Remove walls/plats for this item
	if (this.getContainerType() == 'street'){
		var old_plats = this.container.geo_find_plats_by_source(this.tsid);
		var to_nudge = [];
		if (old_plats){
			var loc = this.container;
			var plats = old_plats.plats;
			for (var i in plats){
				if (!plats[i].start) continue;
				if (config.is_dev) log.info("Checking for nudge on old plat: "+plats[i]);

				loc.items.apiIterate(function(item){
					if (config.is_dev) log.info("Checking item: "+item);
					if (item.hasTag('furniture') && !item.hasTag('furniture_placed_normally')) return;

					var pl = loc.apiGetClosestPlatformLineBelow(item.x, item.y-1);
					if (!pl) return;

					//log.info(item+': '+pl+' vs '+plats[i]);
					if (item && pl.x1 == plats[i].start.x && pl.y1 == plats[i].start.y && pl.x2 == plats[i].end.x && pl.y2 == plats[i].end.y){
						if (config.is_dev) log.info("To nudge: "+item);
						to_nudge.push(item);
					}
				});
			}
		}
		this.container.geo_remove_plats_by_source(this.tsid, true);
	}

	// Perform upgrade
	this.setInstanceProp('upgrade_id', upgrade_id);
	this.setInstanceProp('user_config', null);

	pc.achievements_increment("upgraded", this.class_id, 1);
	
	// Add walls/plats for the upgrade
	if (this.getContainerType() == 'street'){
		var ret = this.getPlatsAndWalls();
		var best_y = 0;
		for (var i in ret.plats){
			ret.plats[i].start.x+=this.x;
			ret.plats[i].end.x+=this.x;

			ret.plats[i].start.y+=this.y;
			ret.plats[i].end.y+=this.y;

			if (ret.plats[i].start.y < best_y) best_y = ret.plats[i].start.y;
		}

		for (var i in ret.walls){
			ret.walls[i].x+=this.x;
			ret.walls[i].y+=this.y;
		}
		this.container.geo_add_plats(ret.plats, ret.walls, this.tsid);

		// Nudge
		if (to_nudge){
			for (var i in to_nudge){
				var it = to_nudge[i];
				if (!it) continue;


				if (config.is_dev) log.info(it+' looking for best pt below: '+it.x+','+(best_y-1));
				var pt = this.container.apiGetPointOnTheClosestPlatformLineBelow(it.x, best_y-1);
				if (config.is_dev) log.info(it+' new pt: '+pt);
				if (pt) it.apiSetXY(pt.x, pt.y);
			}
		}
	}

	return upgrade;
}

function flipPlats(){
	// Remove walls/plats for this item
	if (this.getContainerType() == 'street'){
		var old_plats = this.container.geo_find_plats_by_source(this.tsid);
		var to_nudge = [];
		if (old_plats){
			var loc = this.container;
			var plats = old_plats.plats;
			for (var i in plats){
				if (!plats[i].start) continue;
				//log.info("Checking for nudge on old plat: "+plats[i]);

				loc.items.apiIterate(function(item){
					if (!item) return;
					//log.info("Checking item: "+item);
					if (item.hasTag('furniture') && !item.hasTag('furniture_placed_normally')) return;

					var pl = loc.apiGetClosestPlatformLineBelow(item.x, item.y-1);
					if (!pl) return;

					//log.info(item+': '+pl+' vs '+plats[i]);
					if (pl && pl.x1 == plats[i].start.x && pl.y1 == plats[i].start.y && pl.x2 == plats[i].end.x && pl.y2 == plats[i].end.y){
						to_nudge.push(item);
					}
				});
			}
		}
		this.container.geo_remove_plats_by_source(this.tsid, true);

		// Add walls/plats for the upgrade
		var ret = this.getPlatsAndWalls();
		var best_y = 0;
		for (var i in ret.plats){
			ret.plats[i].start.x+=this.x;
			ret.plats[i].end.x+=this.x;

			ret.plats[i].start.y+=this.y;
			ret.plats[i].end.y+=this.y;

			if (ret.plats[i].start.y < best_y) best_y = ret.plats[i].start.y;
		}
		
		for (var i in ret.walls){
			ret.walls[i].x+=this.x;
			ret.walls[i].y+=this.y;
		}
		this.container.geo_add_plats(ret.plats, ret.walls, this.tsid);
		
		// Nudge
		if (to_nudge){
			for (var i in to_nudge){
				var it = to_nudge[i];
				if (!it) continue;

				var pt = this.container.apiGetPointOnTheClosestPlatformLineBelow(it.x, best_y-1);
				//log.info(it+' new pt: '+pt);
				if (pt) it.apiSetXY(pt.x, pt.y);
			}
		}
	}
}

function setPlatsAndWalls(){
	// Add walls/plats for the upgrade
	var ret = this.getPlatsAndWalls();
	for (var i in ret.plats){
		ret.plats[i].start.x+=this.x;
		ret.plats[i].end.x+=this.x;

		ret.plats[i].start.y+=this.y;
		ret.plats[i].end.y+=this.y;
	}
	
	for (var i in ret.walls){
		ret.walls[i].x+=this.x;
		ret.walls[i].y+=this.y;
	}
	this.container.geo_add_plats(ret.plats, ret.walls, this.tsid);
}

function getLabel(){
	var upgrade = this.getUpgradeDetails();
	if (upgrade && upgrade.name) return upgrade.name;

	return this.label;
}

function getPlatsAndWalls(){
	var upgrade = this.getUpgradeDetails();
	if (upgrade.plats || upgrade.walls){

		var plats = utils.copy_hash(upgrade.plats);
		var walls = utils.copy_hash(upgrade.walls);
		// Apply a translation depending on which direction we face
		if (this.getInstanceProp('facing_right') != 1){
			for (var i in plats){
				plats[i].new_start = plats[i].end;
				plats[i].end = plats[i].start;
				plats[i].start = plats[i].new_start;

				plats[i].start.x *= -1;
				plats[i].end.x *= -1;
			}
		}

		return {
			plats: plats,
			walls: walls
		};
	}

	var plats = {};
	var walls = {};
	if (this.getFurnitureBaseGeo){
		var ret = this.getFurnitureBaseGeo();
		plats = utils.copy_hash(ret.plats);
		walls = utils.copy_hash(ret.walls);
	}
	else{
		plats = this.plats ? utils.copy_hash(this.plats) : {};
		walls = this.walls ? utils.copy_hash(this.walls) : {};
	}

	// Apply a translation depending on which direction we face
	if (this.getInstanceProp('facing_right') != 1){
		for (var i in plats){
			plats[i].new_start = plats[i].end;
			plats[i].end = plats[i].start;
			plats[i].start = plats[i].new_start;

			plats[i].start.x *= -1;
			plats[i].end.x *= -1;
		}
	}

	return {
		plats: plats,
		walls: walls
	};
}

// you can pass in upgrades if you already retrieved them, else it will get them fresh
function getUpgradeDetails(pc, upgrades){
	var upgrade_id = this.getInstanceProp('upgrade_id');
	if (!upgrades) upgrades = this.getUpgrades(pc);
	return upgrades[upgrade_id] ? upgrades[upgrade_id] : {};
}

function getUpgrades(pc, owned_only){

	if (!owned_only) owned_only = false;

	var catalog = apiFindItemPrototype('catalog_furniture');
	if (!catalog || !catalog.furniture){
		log.error("No furniture catalog!?");
		return {};
	}

	if (!catalog.furniture[this.class_tsid]) return {};

	var upgrades = utils.copy_hash(catalog.furniture[this.class_tsid]);

	if (this.getClassProp('can_revert_to_base') == 1){
		var base = {
			name: this.label,
			credits_cost: 0, // 0==free
			imagination_cost: 0,
			subscriber_only: 0,
			is_visible: 1,
			config: null
		};

		if (this.getDefaultUpgradeConfig) base.config = this.getDefaultUpgradeConfig();

		upgrades[0] = base;
	}

	// Build more infos
	for (var i in upgrades){
		var up = upgrades[i];
		if (!up) continue;

		up.is_owned = false;
		if (this.class_tsid == 'furniture_chassis'){
			if (pc && pc.furniture_owns_chassis(i)) up.is_owned = true;
		}
		else{
			if (this.hasUpgrade(i)) up.is_owned = true;
		}

		if (pc && pc.location.is_newxp && !up.is_owned){
			if (up.credits_cost || (up.subscriber_only && !pc.stats_is_sub())) delete upgrades[i];
		}

		if (owned_only && !up.is_owned) delete upgrades[i];
	}

	return upgrades;
}

function getBaseConfig(ret){
	var upgrades = this.getUpgrades(null);
	var upgrade = this.getUpgradeDetails(null, upgrades);
	var user_config = this.getUserConfig ? this.getUserConfig() : this.getInstanceProp('user_config');
	var upgrade_ids;
	if (this.class_tsid != 'furniture_chassis'){
		for (var i in upgrades){
			var up = upgrades[i];
			if (!up) continue;
			if (!up.credits_cost) continue; // 0==free, and we don't count that as an upgrade when we tell the user about it
			if (this.hasUpgrade(i)) { 
				if (!upgrade_ids) upgrade_ids = []; // lazy creation
				upgrade_ids.push(i);
			}
		}
	}
	
	ret.furniture = {
		upgrade_id: intval(this.getInstanceProp('upgrade_id')),
		facing_right: (this.getInstanceProp('facing_right') == 1 ? true : false)
	};
	
	if (upgrade_ids) ret.furniture.upgrade_ids = upgrade_ids;
	
	if (upgrade && ret.furniture.upgrade_id) {
		if (upgrade.swf) {
			ret.furniture.swf_url = upgrade.swf;
		}
		
		if (user_config) {
			ret.furniture.config = user_config;
		} else if (upgrade.config) {
			ret.furniture.config = upgrade.config;
		} else {
			// pass no config prop on this; there is an upgrade, but it has no config
		}
	} else {
		if (user_config) {
			ret.furniture.config = user_config;
		} else if (this.getDefaultUpgradeConfig) {
			ret.furniture.config = this.getDefaultUpgradeConfig();
		} else {
			// pass no config prop on this; there is no upgrade, and no defaultUpgradeConfig
		}
	}

	return ret;
}

function make_config(){
	var ret = {};
	ret = this.getBaseConfig(ret);
	// EC: when you pass ret to getExtraConfig, make sure you do the above first, so it has the baseconfig on it
	if (this.getExtraConfig) ret = this.getExtraConfig(ret);
	
	return ret;
}

function onPropsChanged(){
	// myles, I (EC) have disabled this and we shoud spot every place where we need to to do it manually
	// this.broadcastConfig();
}

function hasUpgrade(upgrade_id){
	if (!this.upgrade_history) return false;

	for (var i in this.upgrade_history){
		if (this.upgrade_history[i].to == upgrade_id) return true;
	}

	return false;
}

//////////////////////////////////////////////////////////////

//
// Economy callbacks
//

function runCallbackQueue(){
	if (!this.callback_queue) return;

	if (this.callback_queue['update'] && this.callback_queue['update'].length){
		var queue = this.callback_queue['update'];
		for (var i=0; i<queue.length; i++){
			var args = queue[i];
			utils.http_post('callbacks/sdb_update.php', args, this.tsid);
		}

		this.callback_queue['update'] = [];
	}

	if (this.callback_queue['sale'] && this.callback_queue['sale'].length){
		var queue = this.callback_queue['sale'];
		for (var i=0; i<queue.length; i++){
			var args = queue[i];
			utils.http_post('callbacks/sdb_add_sale.php', args, this.tsid);
		}

		this.callback_queue['sale'] = [];
	}

	if (this.callback_queue['furniture_update'] && this.callback_queue['furniture_update'].length){
		var queue = this.callback_queue['furniture_update'];
		for (var i=0; i<queue.length; i++){
			var args = queue[i];
			utils.http_post('callbacks/furniture_update.php', args, this.tsid);
		}

		this.callback_queue['furniture_update'] = [];
	}

	if (this.callback_queue['furniture_sale'] && this.callback_queue['furniture_sale'].length){
		var queue = this.callback_queue['furniture_sale'];
		for (var i=0; i<queue.length; i++){
			var args = queue[i];
			utils.http_post('callbacks/furniture_add_sale.php', args, this.tsid);
		}

		this.callback_queue['furniture_sale'] = [];
	}
}

function adminTriggerUpdateCallback(args){
	return this.triggerUpdateCallback(args.type);
}

function triggerUpdateCallback(type){
	var container = this.getContainer();
	var location;
	var location_type;
	var owner;

	if (container.location){
		location = container.location;
		owner = container.tsid;
		location_type = 'player';
	}
	else{
		location = container.container;
		owner = location.pols_get_owner ? location.pols_get_owner().tsid : '';
		location_type = location.homes_get_type ? location.homes_get_type() : '';
	}

	if (!type || type == 'sdb'){
		this.addCallbackQueue('update', {
			'sdb_tsid': this.tsid,
			'owner_tsid': owner,
			'location_tsid': location.tsid,
			'location_type': location_type,
			'item_class_tsid': this.class_type,
			'qty': this.isSelling() ? this.countItemClass(this.class_type) : 0,
			'price_per_unit': this.isSelling() ? this.sale_price : 0
		});
	}
	else{
		this.addCallbackQueue('furniture_update', {
			'furniture_tsid': this.tsid,
			'owner_tsid': owner,
			'location_tsid': location.tsid,
			'location_type': location_type,
			'price': this.isForSale() ? this.sale_price : 0,
			'upgrade_id': intval(this.getInstanceProp('upgrade_id')),
		});
	}
}

function addCallbackQueue(type, args){
	// Types are: 'sale' and 'update' (and 'furniture_sale' and 'furniture_update')
	// We only keep one 'update' callback at a time
	// Queues are emptied once per minute
	// See the sdb_add_sale.php and sdb_update.php callbacks for arguments

	if (!this.callback_queue) this.callback_queue = {};
	if (!this.callback_queue[type] || type == 'update' || type == 'furniture_update') this.callback_queue[type] = [];

	this.callback_queue[type].push(args);

	if (!this.apiTimerExists('runCallbackQueue')) this.apiSetTimer('runCallbackQueue', 60*1000);
}
