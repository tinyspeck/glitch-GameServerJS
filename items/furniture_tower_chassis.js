//#include include/furniture.js, include/takeable.js

var label = "Tower";
var version = "1346098673";
var name_single = "Tower";
var name_plural = "Towers";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["furniture_tower_chassis", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "chair",	// defined by furniture_base
	"can_flip"	: "1",	// defined by furniture_base
	"can_revert_to_base"	: "1"	// defined by furniture_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
	this.instanceProps.user_config = "";	// defined by furniture_base
	this.instanceProps.extra_floors = "0";	// defined by furniture_tower_chassis
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
	user_config : ["User customizations"],
	extra_floors : ["How many floors between top and ground floors?"],
};

var instancePropsChoices = {
	upgrade_id : [""],
	facing_right : [""],
	user_config : [""],
	extra_floors : [""],
};

var verbs = {};

verbs.pickup = { // defined by furniture_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag to your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		if (this.canPickup){
			var ret = this.canPickup(pc);
			if (!ret.ok){
				if (ret.error) return {state:'disabled', reason: ret.error};
				return {state:'disabled', reason: "You can't pick that up."};
			}
		}
		if (this.isForSale()) return {state:'disabled', reason: "You have to stop selling it first."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var ret = pc.furniture_pickup(msg.itemstack_tsid);
		failed = !ret.ok;
		if (ret.error) self_msgs.push(ret.error);

		var pre_msg = this.buildVerbMessage(msg.count, 'pick up', 'picked up', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.dont_sell = { // defined by furniture_base
	"name"				: "don't sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Stop selling it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (!this.isForSale()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.is_for_sale = false;
		this.triggerUpdateCallback('furniture');
		this.broadcastConfig();
		this.broadcastStoreConfig();

		var pre_msg = "You stopped selling a "+this.name_single+".";
		pc.sendActivity(pre_msg);

		return true;
	}
};

verbs.flip = { // defined by furniture_base
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		var can_flip = intval(this.getClassProp('can_flip'));
		if (!can_flip) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var facing_right = intval(this.getInstanceProp('facing_right'));
		this.setInstanceProp('facing_right', (facing_right+1)%2);
		this.flipPlats();

		this.broadcastConfig();

		return true;
	}
};

verbs.set_sale_price = { // defined by furniture_base
	"name"				: "set sale price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Start selling it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (this.isForSale()) return {state: null};
		if (this.is_bag && this.countContents()) return {state:'disabled', reason: "This item must be emptied before it can be sold."};
		if (this.isSoulbound(pc)) return {state:'disabled', reason: "This item is locked to you and cannot be sold."};
		if (this.income) return {state:'disabled', reason: "You have to collect the currants first."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var label = '<p class="rename_bubble_sdb_pricer_title">Price</p>';

		var args = {
			cancelable: true,
			input_focus: true,
			input_label: label,
			submit_label: "Set price",
			input_value: this.sale_price ? intval(this.sale_price) : 1,
			input_max_chars: 6,
			input_restrict: '0-9',
			no_bubble:false, // this makes the input request use the large UI
			is_currants:true
		};

		this.askPlayer(pc, 'set_sale_price', 'nothing', args);

		return true
	}
};

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		if (this.isForSale()) return {state:'disabled', reason: "Cannot be upgraded while it's for sale"};
		if (intval(this.getInstanceProp('upgrade_id')) == 0){
			if (this.class_tsid != 'furniture_door' && (this.getContainerType() == 'pack' || this.getContainerType() == 'bag')) return {state:'disabled', reason: "Drag this "+this.name_single+" into your house to upgrade it"};
			return {state:'enabled'};
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var upgrades = this.getUpgrades(pc);

		var ret = {
			type: "furniture_upgrade_start",
			itemstack_tsid: this.tsid, // the piece of furniture being upgraded
			upgrades: []
		};

		for (var i in upgrades){
			var up = upgrades[i];
			if (!up.is_visible && !pc.is_god) continue;

			var ob = {
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				is_owned: up.is_owned ? true : false,
				is_new: !!up.is_new,
				config: {
					swf_url: up.swf,
					config: up.config
				}
			}
			
			// this but is for tower chassis. We want the upgrade configs to all have the
			// same number of extra_floors as the current upgrade, for customizing!
			if (this.getInstanceProp('extra_floors')) {
				if (!ob.config.config) ob.config.config = {};
				ob.config.config.extra_floors = this.getInstanceProp('extra_floors');
			}
				
			ret.upgrades.push(ob);
		}

		pc.apiSendMsg(ret);

		return true;
	}
};

verbs.change_style = { // defined by furniture_base
	"name"				: "change style",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (this.class_tsid == 'furniture_chassis' || this.class_tsid == 'furniture_tower_chassis') return {state: null};
		//if (!pc.has_done_intro) return {state: null};
		if (intval(this.getInstanceProp('upgrade_id')) != 0){
			if (this.isForSale()) return {state:'disabled', reason: "Cannot be upgraded while it's for sale"};
			return {state:'enabled'};
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.upgrade.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.edit_sale_price = { // defined by furniture_base
	"name"				: "edit sale price",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Change the sale price",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		if (!this.canSell(pc)) return {state: null};
		if (!this.isForSale()) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.set_sale_price.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.customize = { // defined by furniture_tower_chassis
	"name"				: "customize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state: null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.upgrade.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.give = { // defined by furniture_base
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.buy = { // defined by furniture_base
	"name"				: "buy",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Buy it",
	"get_tooltip"			: function(pc, verb, effects){

		return verb.tooltip+' for '+utils.number_format(this.sale_price)+'c';
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		var sell_to_owner = false;
		if (this.getContainerType() == 'street' && this.container.pols_is_pol() && this.container.pols_is_owner(pc) && !sell_to_owner) return {state: null};
		if (this.isForSale(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var out = {
			type: 'store_start',
			item_class: this.class_id,
			item_tsid: this.tsid,
			verb: 'buy',
			store: this.getStoreInfo()
		};
			
		pc.apiSendMsgAsIs(out);
	}
};

function getDefaultUpgradeConfig(){ // defined by furniture_tower_chassis
	return {
		floor_top: '1',
		floor_ground: '1',
		extra_floors: '0',
		deco_ground: '1',
		deco_side: '1',
		required_extra_floors_for_deco_side: '1'
	}
}

function getExtraConfig(ret){ // defined by furniture_tower_chassis
	// NOTE! the delta_x and delta_y for scaffolding_sd and sign_sd are only
	// used if there is a not a sign_pt in the swf for the tower chassis

	var scaffolding_sd = {
		uid: 'tower_scaffolding_'+this.tsid,
		type: 'tower_scaffolding',
		h_flipped: intval(this.getInstanceProp('facing_right')) != 1,
		swf_url: overlay_key_to_url('tower_sign_scaffolding_overlay'),
		delta_x: 8,
		delta_y: -120,
		no_display: true
	}

	var sign_sd = {
		uid: 'tower_sign_'+this.tsid,
		type: 'tower_sign',
		h_flipped: scaffolding_sd.h_flipped,
		delta_x: scaffolding_sd.delta_x,
		delta_y: scaffolding_sd.delta_y-30,
		width:250
	}

	if (this.user_name) {
		sign_sd.label = this.user_name.toUpperCase();
		delete scaffolding_sd.no_display;
	}

	// Ideally we'd pass the pc we're building this config for, and not include income in the
	// messaging except if it is the owner. But for now, we only show the info in client to for_pc_tsid
	var owner = (this.getContainerType() == 'street') ? this.container.pols_get_owner() : null;

	var edit_sd = {
		uid: 'tower_edit_'+this.tsid,
		type: 'tower_edit',
		h_flipped: scaffolding_sd.h_flipped,
		swf_url: overlay_key_to_url('click_to_prime'),
		delta_x: 87,
		delta_y: 0,
		for_pc_tsid: (owner) ? owner.tsid : null
	}

	// order of array governs z depth of special displays
	ret.special_display = [scaffolding_sd, sign_sd/*, edit_sd*/];

	return ret;
}

function getFurnitureBaseGeo(){ // defined by furniture_tower_chassis
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': null,
	         'walls': null
	};
}

function getLabel(){ // defined by furniture_tower_chassis
	//if (this.user_name){
	//	return this.user_name;
	//}

	return this.label;
}

function getUserConfig(){ // defined by furniture_tower_chassis
	var ret = this.getInstanceProp('user_config') || this.getDefaultUpgradeConfig();

	ret.deco_ground = ret.deco_ground || '1';
	ret.deco_side = ret.deco_side || '1';
	ret.extra_floors = this.getInstanceProp('extra_floors') || 0;

	return ret;
}

function onJobComplete(job){ // defined by furniture_tower_chassis
	if (!this.container) return false;

	var pc = this.container.pols_get_owner();
	if (!pc || !pc.tsid) return false;

	var tower = apiNewLocation("Test Tower", config.is_prod ? '15' : '28', 'POL_'+pc.tsid, 'tower');
	log.info(this+" created tower "+tower+" for "+pc);
	if (tower){
		tower.tower_create(pc);
		pc.home.tower = tower;
		pc.home.exterior.homes_position_tower(tower);
		tower.tower_rebuild();

		pc.home.tower.tower_set_label(pc.label+"'s Tower");

		pc.home.exterior.upgrades_move_players('tower');

		pc.quests_set_flag('build_tower');
	}

	return true;
}

function setExtraFloors(num){ // defined by furniture_tower_chassis
	// num is the number of floors between the top and ground floors. A new tower will have 0 extra_floors,
	// and a fully expanded tower will have 7 (if we settle on 9 being the max size of a tower)

	if (num === this.getInstanceProp('extra_floors')) return;

	this.setInstanceProp('extra_floors', num);
	this.broadcastConfig();
}

function setUserName(value){ // defined by furniture_tower_chassis
	// There is client code that will need to be matched up with this regex if you change it. Ask Scott!
	value = value ? value.substr(0, 25).replace(/[^a-z0-9\/\&\-\!\?\.\$\(\)\#\@\~\+\'\"\,\_\\ ]/gi,'') : '';

	this.user_name = value;

	this.broadcastConfig();
}

function broadcastStoreConfig(){ // defined by furniture_base
	var store_info = this.getStoreInfo();
	this.container.apiSendMsg({
		type: 'store_changed',
		item_class: this.class_id,
		item_tsid: this.tsid,
		store: store_info
	});
}

function canSell(pc){ // defined by furniture_base
	if (this.class_tsid == 'furniture_chassis') return false;
	if (this.class_tsid == 'furniture_tower_chassis') return false;
	if (this.class_tsid == 'furniture_door') return false;
	return true;
}

function getStoreInfo(){ // defined by furniture_base
	var upgrades = this.getUpgrades(null);
	var its_upgrades;

	for (var i in upgrades){
		var up = upgrades[i];
		if (!up) continue;
		//if (!up.credits_cost) continue; // 0==free, and we don't count that as an upgrade when we tell the user about it

		if (this.hasUpgrade(i)) { 
			if (!its_upgrades) its_upgrades = []; // lazy creation
			its_upgrades.push({
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				subscriber_only: intval(up.subscriber_only),
				is_visible: up.is_visible ? true : false,
				is_new: !!up.is_new,
				config: {
					swf_url: up.swf,
					config: up.config
				},
				thumb_40: up.thumb_40
				//temp: up
			});
		}
	}

	var rsp = {
		name : "Buying "+this.label,
		buy_multiplier : 0.0,
		items: [],
		is_single_furniture: true,
		single_furniture_upgrades: its_upgrades,
		single_stack_tsid: this.tsid
	};

	if (this.is_for_sale && this.sale_price){
		rsp.items = [
			{
				class_tsid: this.class_tsid,
				cost: this.sale_price,
				count: 1
			}
		];
	}

	return rsp;
}

function isForSale(){ // defined by furniture_base
	return this.is_for_sale && this.sale_price;
}

function onInputBoxResponse(pc, uid, value){ // defined by furniture_base
	if (this.getContainerType() == 'street' && this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return false;
	if (!this.canSell(pc)) return false;

	if (value === '') return true;

	value = intval(value.substr(0,6).replace(/[^0-9 ]/gi,''));

	if (uid == 'set_sale_price'){
		if (value && value > 0){
			this.sale_price = value;
			this.is_for_sale = true;
		}
		else{
			this.is_for_sale = false;
		}

		this.triggerUpdateCallback('furniture');
		
		this.broadcastConfig();
		this.broadcastStoreConfig();
	}

	return true;
}

function sellItem(pc, msg){ // defined by furniture_base
	if (!this.isForSale()){
		log.info("not selling");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "That store is no longer selling."));
	}

	//
	// check the count looks ok
	//

	var count = intval(msg.count);

	if (count <= 0){
		log.info("positive counts only");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't buy a negative/zero amount of things!"));
	}

	var store_info = this.getStoreInfo();
	if (!store_info || !store_info.items){
		log.info("no store info");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops, something is wrong with that store."));
	}


	//
	// check that the store sells this item
	//

	var store_items = [];
	for (var i in store_info.items){
		var it = store_info.items[i];
		if (it.class_tsid == msg.class_tsid){
			if (count < it.count){
				it.count = count;
			}
			else{
				count = it.count;
			}
			store_items.push(it);
			break;
		}
	}
	//log.info(store_items);
	var item_proto = apiFindItemPrototype(msg.class_tsid);

	if (!num_keys(store_items)){
		log.info("store doesn't sell that item");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "This store no longer sells that item."));
	}


	//
	// check that we have enough money
	//

	var total_cost = 0;
	for (var i in store_items){
		total_cost += (store_items[i].cost * store_items[i].count);
	}
	//log.info('total cost: '+total_cost);

	if (msg.price){
		var expected_price = intval(msg.price) * count;
		if (expected_price != total_cost){
			log.info("price mismatch: "+expected_price+" vs "+total_cost);
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Oops, the price appears to have changed underneath you. Please try your purchase again."));
		}
	}
	else{
		msg.price = store_items[0].cost;
	}

	if (!pc.stats_has_currants(total_cost)){
		log.info("you don't have enough money");
		pc.sendActivity("Sorry, you can't afford that.");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, you can't afford that."));
	}

	//
	// Charge them
	//

	var owner = this.container.pols_get_owner();
	if (!owner){
		log.info("No owner");
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "I can't sell you that thing, since I can't find the owner of this location."));
	}

	this.is_for_sale = 0;
	this.broadcastStoreConfig();
	pc.announce_sound('PURCHASE_ITEM');

	total_cost = intval(msg.price) * count;
		
	pc.stats_remove_currants(total_cost, {type: 'store_buy', class_id: msg.class_tsid, store:'item_'+this.tsid, count: count});
	owner.prompts_add_simple(pc.linkifyLabel()+' just bought your '+this.getLabel()+' for '+pluralize(total_cost, 'currant', 'currants')+'.');

	// Do something with the money
	var pile = this.container.createAndReturnItem('pile_of_currants', 1, this.x, pc.y, 50, owner.tsid);
	if (pile){
		pile.setInstanceProp('balance', total_cost);
		pile.setInstanceProp('source', pc.linkifyLabel()+' purchasing your '+this.getLabel());
	}

	if (total_cost >= 1009){
		pc.achievements_grant('big_spender');
	}
		
	if (total_cost >= 2003){
		pc.achievements_grant('el_big_spenderino');
	}
		
	if (total_cost >= 5003){
		pc.achievements_grant('moneybags_magoo');
	}

	this.triggerUpdateCallback('furniture');
	this.addCallbackQueue('furniture_sale', {
		'seller_tsid': this.container.pols_get_owner().tsid,
		'buyer_tsid': pc.tsid,
		'item_class_tsid': msg.class_tsid,
		'total_price': total_cost
	});

	delete this.z;
	pc.location.geo_remove_plats_by_source(this.tsid);
	pc.addItemStack(this);

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function parent_getExtraConfig(ret){ // defined by furniture_base
	var tag_sd = {
		type: 'furn_price_tag',
		uid: 'furn_price_tag_'+this.tsid
	}

	if (this.isForSale()) {
		tag_sd.sale_price = this.sale_price;
		tag_sd.h_flipped = intval(this.getInstanceProp('facing_right')) != 1;
	}

	// order of array governs z depth of special displays
	ret.special_display = [tag_sd];

	return ret;
}

function parent_getUserConfig(){ // defined by furniture_base
	return this.getInstanceProp('user_config');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"furniture"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-175,"y":-288,"w":345,"h":284},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMb0lEQVR42u1YWUyc1xVOFzVq+5C3\nROpLpajKQ9PESRoriqvEWRzb8QJmM4vZxh7DMIBZBhhgNpYBA3aMbWwMxuw7GAaG2WAGhn0fVtuY\nJI7j5KGq7DZS1bRSH\/L1uxcnSlwpzvbSKkhH995z\/7n\/95\/znXPP4ZFHfvz78e9\/4G+9v+2JiQt5\n2umK\/JSlpjM7l+rKdo5U5u8cp8j1A7LWdv6L+fTl4p1D53O+sr\/YVfLYDw7yckqk1mKIv+TQx962\nFybMuAvjZmwGxcZwUbzXojtab8lL3LAaFO2DxUkbEzUlMzO1ZcvzLecujZ3X3Z66aGy3mlS37QVJ\ny+6y9OXR8qxLnpqiJ34wcJeUfuXdWgWsuQqMnU6DtywFMxeMWKkrgq+mAItVJviuFGL6gh6zlSYs\nVBmxXF\/MvS3dzEXjJ1Pncj\/x1Zr\/td52ZmP2gt470Xx+2w8CrlYVaGpIDMIFxQF0podhtCgewwVK\nWLIjMZR3DAO50XBzLeYWbSQ8hcfhNCqkTqxthlgM6GPg4GjjaM2Ngct0lPvH6hdLtN\/P1WXhb+1s\nORGCenUQ6tSBEHM7AY0WqzBZpuYYj7GTBExQE6VqjJhVGKd+4qQKU6eTMXEqEW4CHy9RY+qdZMyf\nS8W00JclYvZMGhYq9M7vBbAm\/pC3NSUUramUlMPo1ITBa44jkOPwFsdhkJbyFsVhlCDFOF6aQCFA\njmJfgB3MPyb3Bk0KWlcpLEfACRjhR42Z4zFbY\/b\/TuAMAa9vI0B0aSIkOOHm7owIDBPcCC0nXiQs\n56ErR0tUcBPIBAF9vu+9b1kP1+NlCfKZ4UJBhaOkQKzcE78ZPZtd\/50Aloa+VS4A1sQHoPq4P5rp\nXpueB5u3LCZeYCevRmgd8SIBVFhWzL8AKUBRL9d8Tujkxwgr8mNmzqYwoEyWbwVsqkXz2zveUlNN\nYtDt8si3UaX0R60qQPKwP4cBka+ULxLB4BZuojuH7oMSOiFyLoBJ1x7dAk+9tCJ1QkTQCP1kRdbG\ntwJYrd31WOepSNNEuwbTjVmoSw9BRex+ujgY\/QwQuy5WvlSIy3gUNupc5OIAwTuNW3rhRmEx4V5r\nTtQWWM7Fnk0XLfdcJoW05CCDyK2N+\/bRfCZjj39bWShWBgxY6zHhan4sOtLD0cVU05kWht6sI3Ks\nSwjAVfK07cRhObancsyMQLcmHC3JwahPCJTpRqybuW5NDkEdqSPmQif2vRUqk8PhePRbAfQ2amIa\nzAGoLTiIpuJATLSmYdVVgusOHa67mIj7s7FkycRcdzrW7Dp+SA6uUX\/doZf7123Z2HDqccNpwDV7\nLvUGrPZnYW1AK58Rz647xJ4Ovp4sTHdpP3FUJYR+LajVJtXja86CyBWbKXKoKbXWfjkO3eVRqMw5\ngOaSAMx3k9RXU7BoSceSleA49\/VnwGfRYLYzWerE3nxvutQJmethvutJxSx\/O9uRiIXeNCz1ZWCx\nT4NF6n09ad5vbLXeqqRI30A2bo8YsdSbgo7TobTgIbSdCkFjcRimOpIx3poEZxX5U3tcykijCiNN\nCRhuYODUM\/3UMspbEjHTlYnJzkw4axLhuKyG6wp\/d4XzGjV8VgPme7RYIn1WB\/T\/XLebX\/xmd+6p\ngMcbzH5w1B\/FpscIX3cSbFW8oqqPE+zhLTAUxyVGYB1Jf0UpgQkRYD31cVK8BDzdnYqxVrWUifYk\neBvjMXOVluzZsv7yQBYtzHlfOm66cv59Y9C4PEUPPhTkxey9qMzdi7bTgZjqTsb7wzpMt\/Hq6jiB\nd935eH+kiGKmFON9b9HWetiM9zwFcv\/doTx8MF5KnuVirV9DIUetGqxbM+R83ZYl12K+6crGTWcW\nPhg14baHnvOaPrvhMPZ+LcDWUwFoKPRDtf5t1BUeRM\/FULw7TFIPpErZcGaS+BlSd3MwW87FuOnR\nYdOdK\/Vi3HTn4AYBXHNpKVlYt2fI+QafE+uV\/hSs9CUzaNLk3nWesWZLxzVHFr4WYEuZHzrKg9BS\n5k+AB1CbfwADl6MxUBUF66UouOh+Z60CrrqjsNfQ1c1M1m0J5FoMPI1KujEZK9Z0gsvEgiUF73r0\n2ODLxbhEIKsELfSzXYkMlDTM8vk5io8WXejTfDrdptj5cIBnglFnPoiGYj+0lJKTdbEkNvnCQxYt\nKVJGmuN4YCrJnsyXJMF+JZbpRYtbIwa6yoA74wUS2J3xfNxyZ+OWJ0fq33PrsMyz1myZdHcGJttY\nMJDrK3S9b0D7t4dy8IJ2D1pLA2jFQLTSio0n\/TDUoCCoEyR2Or82SVpozU432TSM2DhcPRdG8ifj\nw7E8Cvk0Sh4yE2wSzC3ONwa15FsGgebwNxnYHMqVIJetqZhsjcM6rboyoJHWfHiBmr8fNYb9DBJ\/\ntL0TgKYSP4y0KsmZdBI\/i1zJkQCX+5m4eai7SQlrTbS01hpffotBtUTLFiXvgvLwS0gI3Y7qogCs\nCn45tbg5REvSquK8ZT7n60vhXgZz5QmpeyjAlhJ\/9FwIRid52PZOEETQDDcreVAqrSgOTJMHCXDC\nTWJvpvsEPvAaGcW5\/E04wvY+h1de3obXd2zDzpefwfZnn0Ts\/mcw2q7ChxOFW+6nFcWHTnckSOos\n8Gxh1YcCFK7tOEP3nvKXXGwu9Zf8El95zZUjXbk8kCGJvcRxrD2B7knHHbryOi0UtfsZBO96ASFv\nbEP0rqcR\/NrT2L3j93h7+5PIi39Vulh8zI37bhY8vja45XpBm4cCbNLyImdgdJ8LQqVuLxqKDjBy\nY\/m1GvmlKwS11J8qx1VasLcyAlOMyLmeFCZ4Bfx2PIWQXc8jfO+LiN\/zB4TufgFBbzyH\/S\/9DkUJ\nr5ISxzHVqcYkfzPZmQgvc+wE16Mc5+mdrwXX1dX1WLViLxqTDqHdfEgGigDbV30EHh7sId9GGHXC\naiNML+N0j6DBe95ifDheKG+HoDeexeGQPYiJ8ofqwPM4Er4fEeEHse+VZ\/BO+pvkcba01PVBvfSC\nSDXCvTP8QDEOdxoPPojrJ5+LKHkqjuxGi\/oQGuP80GYMRM\/5LQ6uMUAEZyT3+II53tUztIKlKoI3\nSjHujBVglbdH2O7nEHjoNUSE7kFa4HZERuxDeNjb8HvzBRQk7WYw6bDuFJXQVpCtOjLl2SIPzvG8\nocaUyK+gay8N+42rVlWwZDVsLvbrputS\/VETewA9qSHoZe3XluQPS\/ERuC8rMd2QhHlWLavWLIw1\nqGGvjEZ7QTC5p5MAN70lOLb3WYQEvo7I8N3QR+xARNhbCDq0E4d2b4dZ\/SY+mijhdcgSi2cIDor0\nIqJ5+ArbgOYETNSlxH8F4ClN6HbWcv8YpeumGI2LvLwbs9iLKFgHqphqVIGwZoexOlbKEt+mi4TL\nEAknq2O7PhrdmWHSgh9PleDmyEloQv6I0syDqCmORAdpUmMORj5TjiZmB\/TH\/sQbJV+WZO7qeDZZ\nSbLrc4vqm\/22l\/PJCvWVB13889B9256a68v9VESqq5a3Bm+KvvIIVETukdLFst+aHcHyXIE+VsfW\n7HD0a8NgYeXckRnMZHySSdmAGywYEgN3QB21D9qEYJSo\/aFTB3O9H8qQN5Ed\/TLmLcwGtPh4XTL6\ndEfYLkSzP4mRQF1m9jblcSf\/CyDlF5Rf9V1O9G2QvFO8eia72AzVKHA2ehe6UkLYGMWwH4na+q+B\naIby2Iuw9+jSHZYAbwyxNRg0QKuOgik3HeWlebh0thi5GWoU5yTCrFVBq3iVteNxcjgbQ5VKONh+\netgl9mYewRD7E7suBrMXVB8\/WHb99Esgf33ZHFEhXrbQkySjdJlVR7cpCL0FoegxHob9pALdujC4\nz7EFvaREk8EfN2k51nOMwkwWEFEYqI7i9XgU1irSganHWh0JS2W4LEImO9Qy0c93paHbEILBizEY\nOMvGikWwpzoWiyw8PhjWfzbbmXH6PqYvIvln9xWPGtX7\/Mc7M++u2sVNEY+bbiOLgDxeUcVMsgVy\n\/uH4Sdwm4RfYZ1xnVG6S+O8PG1h2mXhLmHCLNeHGkF7eQAu8vxdltZIJT4OKVQ17GCf7GvYkQrfE\nfkZ8nND7rNmMcgNusdZcc5pmHnT3l635y9ZyZfeKPeezeUsWk2sq5njIsi2HB+iYGvRSxHqRbcI8\nXzTLKloAFiJ0Pr543mr4y4zF+NGiLf\/jtcGCv89d1d5bduTdXXUW3l1xFtxdtufd9dlM9xashntL\njoJ785bce9OdGX+d7c3983hX7vKP\/539v\/\/7D4sphgZTwMtlAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/furniture_tower_chassis-1346098836.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"furniture"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "buy",
	"c"	: "change_style",
	"t"	: "customize",
	"o"	: "dont_sell",
	"e"	: "edit_sale_price",
	"h"	: "flip",
	"j"	: "set_sale_price",
	"k"	: "upgrade"
};
itemDef.keys_in_pack = {
	"g"	: "give",
	"c"	: "change_style",
	"k"	: "upgrade"
};

log.info("furniture_tower_chassis.js LOADED");

// generated ok 2012-08-27 13:17:53
