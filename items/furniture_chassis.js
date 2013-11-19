//#include include/furniture.js, include/takeable.js

var label = "Groddle Cottage";
var version = "1345763870";
var name_single = "Groddle Cottage";
var name_plural = "Groddle Cottages";
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
var parent_classes = ["furniture_chassis", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "chair",	// defined by furniture_base
	"can_flip"	: "1",	// defined by furniture_base
	"can_revert_to_base"	: "1"	// defined by furniture_base (overridden by furniture_chassis)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
	this.instanceProps.user_config = "";	// defined by furniture_base
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
	user_config : ["User customizations"],
};

var instancePropsChoices = {
	upgrade_id : [""],
	facing_right : [""],
	user_config : [""],
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

verbs.customize = { // defined by furniture_chassis
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

		if (!pc.has_done_intro) return {state: null};
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

function getDefaultUpgradeConfig(){ // defined by furniture_chassis
	return {
		chimney: 'chimney_stone1',
		door: 'door_wood',
		entrance: 'entrance_wood',
		roof: 'roof_wood',
		siding: 'siding_rocky',
		window: 'window_circle'
	};

	return {
		door: 'door_knockerwood',
		fence: 'fence_bars',
		statue: 'statue_rooks',
		roof: 'roof_wood',
		topdeco: 'topdeco_rook',
		window: 'window_boardwood',
		stairs: 'stairs_woodlight',
		stairsdeco: 'stairsdeco_pighead',
		siding: 'siding_tan',
		platform: 'platform_wood'
	};
}

function getFurnitureBaseGeo(){ // defined by furniture_chassis
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': null,
	         'walls': null
	};
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

function getExtraConfig(ret){ // defined by furniture_base
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

function getUserConfig(){ // defined by furniture_base
	return this.getInstanceProp('user_config');
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
		'position': {"x":-192,"y":-366,"w":386,"h":345},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAO00lEQVR42u2YeVCUd5rHszt71G7V\nlrubmclhVDwju6NOTDQxHigod0CR+z5FzgYEGrkPEQEBae6zgabppruhaZr7vgXlklNEROOumkNJ\ndMxMEuN3n\/c30R3H2q1JJvvHVk1XPUVXV7+\/\/rzP8f0+L6+88pfX\/\/OXra3hutFR2ar\/k8NHR9tX\njY93rvux12sf3JXh42WFhFif7p8MKrv4\/LpyUU7MxZG2iYWro7h2bRyD\/Qo8erSU8wSfm\/7JmTMz\nXGdsqKX097WFrY3hilR0bsdPAiiRFa0M9Ddh+GI7RoY7WORf8MVXX9\/Dd1gB8BuKhytPn37Z\/fTp\nw27gKyXwxJQ+fKGM2trvrOP52k5UCM9MSMXnTH8SOLVatENZK4SkqhA1ijJ0tCvR1CiCXBSLTz5b\nxKf3rzPQ333zKYN9ggdYWLz8xchIc5NEnNmxuDSW8eysI4d2aXl7WiFHEAFJZVLGnwU2P9yrm5Ma\nd7eruQAVFbnIyjpHkYSysmzk5qaib7AJcwvDmJ4bxP0vlrHy8BZm5oa\/4vmaT6bFmEOY4Yj68pNo\nEPmvtEmDV0QC1x0cYKC\/Awpyo5GZzv\/xGbwy0PRBWJD\/UwsLCzjY2aKnuQitLQo0NkqgVldBKi1G\nY00y+gYaWMzMDeEBQdrbGSDMVxfVBW5oFHmjQ85HiyQQqjJfqIRey88A87Ij8aPALCxM9GvK84cc\n7W1hYmICMzMzODo64uDBg3CxNUW+IBEXh1pRVJiKoqLzaGmTY3KqD8OX29HVUwe9Q9sYoDTfHXnn\nrCE4Y4VeJR9NYh7aq4MQEWTs7+NlzTL4g+FC\/KyKbKws4ObmBg8PDzg7O8PAwABGRkbYvHkz8lOC\nUVWShdZmGfr7GtGsTIJCno3hYRXmr11CSko4dLV3QF9nO8wMdyLAXRtn+CborgnB5ZYotCsifuPq\nbKI4ecKCyhv2wwDx4MEqnqfrU0tLS5YxGxsbeHp6MtjoEH+IigRQq8oxPt6LkZEODA62QC4rhLo2\nA+XFsWhulcHiuBasju+Hq+MRGBvsgr2lFjyddFCc5oT8NE9kZyXcvzI9gJKSDATwHH4YYE1Zfune\nvXuxZ88e6OnpwdraGk5OTjA1NYVSFI\/JiX5cuTLAYmysh0GOjnZDKslDfb0Y0REnUS2Kw0BnNi71\nF6Kh5gwEqZ5IiLKHg7UWdu3QwPvvbVm0tjJ6kph4GvmF53Hz4ynlb397508T\/Ha50MzZ2hTbt2+H\npqYm9u3bBwcHBwhSEqBUVqC3twFTU4OYnR1hsNz7IepFZa2IynUaXa15uDxQgoVpJaZGxZger0K7\nOgVSYQhSElxga7Efu3+tgcP7t8L48DZYffQuIoNMZkpz+LWNYm9TWcGJ\/932lpfntGrL0xFw0hFH\nDQ\/j3XffhY+7A7IuJLKp7elWs6xxGjg9PYRKkp0gPxukxliitsQTvapIXGxNwY2rTbi91ImrUzQ8\nl0RQVEaiovAUygsCYPbRBziyXxPBJw8jP9mGXdddw0erhAdZgfv\/bHtf3Z9e88WDO8uPH38GtSIX\nw0MdCOfZIfqUE84lRUAozEJtTTkTaU6s4+ND4WK9H8ILDsiIM4c0z40mNBANFX7ob0nH0tUGXJ9T\n4cZCM4a68ylyUF8dgxDeMWh9uBU890Moz3SiKbdj032xIQLqCl9UZru9WG4urXVl3sqvH9\/F71+\/\nw+NHn+Dzz25haKCDmj8eWRmRyMs7z8Q5JyeFgKNgYaaNCJ4++xFJ3gnI8t3Yj3TIg9Ek5ePajIIA\n67A0r6ZM1mBypALjw2UoEPjD2V4Hejo7wPc5grRYczrDGX11fHTIgl4GrMp1ceprKcb9z2\/j7p0l\nAvyW4jG++eYLPPn2S0grU9HVVsH8l\/Phvt5GREQEwNFWDzbH9iDwhDYrV2aCJYF6YFAdjjb5aSxT\n5rgMzk1WEmwN9WYhluaUuDJahZjTdnB1OAwT\/fewb9dGlsEuRTDqZUmLt+\/M8V4AJJ2K+XhpEjdu\nzLB4+PAeAX5H8ZTiawz3VVK5m54DDg22IjaaB5+TFuD52iM4wA6nvAyhKDqBntpQDDWEo785mbKm\nwDTBXL0io5BgbqKKgNUsq11NGYji2+CkmwEMj7wD26PvwddV+5Gfn1NrS3vNys3b08LngAaHtmkt\n35ilAWjGzPQI7t29ge++e4RPP1nG1flxFOVGMFmZIO3jopcyGBvphuSz\/jgT78cMf2aiBl0NKeis\njUSrPBI3qKzLV9UEJcO12Tosziqp1CoCrsD1+XpMj4lRL6fWOe+F0AAzfKS\/E\/5uBxEVaMAN3IxK\nHBk7PSL47xWsVlY2lhAbtqyul4GDvXypl0VleQr6KWsjw52Yn78MuVyIqDAXVNJEpif7IPN8ILIv\nnIKwKAHdrflYvtZCQ9FEIJVUYg5Qwso7OVKE2XExgdZSZqUYv1iCmbEK9LULmE4eNd6FmCBDlKTb\nQ5BgQcPihzZp4MsiXlVZklGYn\/Ft+Gk\/8tgsFBekkFMICbIZfL4vgryNyBEcUCFwpb4JhLTIH8X5\nsSjKi8FIfwVuLbaTxDRShqpwc7GV9SAHNTNeTZBlmL9SjanLlSTkmVikci+RHKlrzuKkuxGsTHcj\nNcoM5QIXjDRF0gbk9zJgZ+P5dYJUb0SE2sDY6EPw\/N1QJS5AeDgPjlYHUJrugHqSgg55COmXF1ql\nQSjO5qGxLoMy1oC7t3qxMFVNLpJH+ichJ0lmGeOAZ8YqWS9OXirHcG8eWuozSNiLCLQBNdWpCA+x\nR3zoUfSrIrjVDAOq0wzwr\/8wWlSpASW5PFxI8YLvCSNK\/QeIigyEu6s5vJ0OQJzjyjYTpdCbrU5M\nVmojWGkXpqk9FhpxaVAMV+sD0Hp\/LbnGG7Az24Os9CD0tuey7HI96HPiOLasfw17d2tCQAvD1ek6\nTI2pkBjthtwkOwyREnTITjHAn\/1hqKojy1TVUagqDaYps0WAzzHYWuvg2FEd2NPfU156OBNmRqLs\nwe6Q21A6aDA4rVucq2faZ3\/019ix+1X8as+\/4O2dq\/DhnjdhcFATmakBLLvczbyzbSNWv\/k63t7w\nOkICnTA2LCFwNVeFiehAfaf2BsF8rdCXucrfPAuxOGaDqDCItCiaFD8KsvIwJJ\/xRKDPURjr74K7\nixESYjxgY7afSu3IrKlc4IbmujTWa5f6i2j9T8DO93+BvUa\/xKHjbzDIf9v9z9Ddvx4+HobkzXUs\ng9u2rsGmjRrYsXU1QgIsMNBVQiJeTv2qoIVq9AU\/\/ttnUVbIjyvK9ifAOFQUBLENpCw\/EN508Cl\/\nc1ouI2kYouDrYYxtmhrYTj\/ic8KE7l6EW9c70NN6ATGU3e37\/hXGLmth5LwWOw+9ivd1CfjAG+Tv\nRqiuPMcsMDbMAbu2r4PewW0oyOHT8MioRWpZjy7Oyl94BPi7ZyHMD1oRl4ahThqF6nI+LaXBkFfw\nUVEUioRoD5QUJjLb6+\/IpLu2gRs5gUqRzKb09vV2mlQpbI9twx6DX8LMaz30HdZAz+4t6NquxjsH\nXoWrDWU+j8++PztZjfbGTPS0FVDmi2myizAzWor\/WOrAfy61xxDPX30fr\/w9F4UXfI5zfVdZwmc7\nXK04HK118RDmBVA\/hqFJmULloTuclNJhpcwNONm42JNPUyojO5NBKU2GheUWaFu8CSveJgZoe2oL\nTNzX4T2dn8NQ+9\/pO\/G4ea2ZucziLAn3mJTp5PRoCQa7cnCLlODerb7ulwAri06pqkpJOiQxkJaF\nMsBq+pt\/wQei4mCo5XGYnxQzEeZ6iL0np7g8UMDKwpVNWZ0Cc\/tN0LN9C\/Yhb7MyO4VthYXvRurJ\n13DowCaUF55msjJ\/pYY0s5lJE9e\/nALMT0qoOlnMhV4APH3a4hdyUTjErKRhUEoiUUlQ7WRdXU1p\nKKN+vHKpgiaQ207q2YHMW8fLMXVJyKA5K5NXxsLMZSPLnHO4JkxPaDDA414bcMR6NbQPbYC4NJKy\nVk3X1zJIzv6uzdRifKiUPiPvZlopx72P+0yfAxZm+gSVUilV1dG0VAYxyO7mNLay97ZlsOa\/faOH\n2RYHw2kZl8HZ8TImGwvTCgItgEIcB1uvt6Fr8xbsgrfA1F2DZdLAYS2sAzZBS2sNmmqTMDYkJDg5\nuUkWuzFuuZ2+LGKfcVLT3XKBdsfcieeAO3+1TvN8ouuKMC8QpSTS5TS5bQ1pbF2vq45jq\/vsBFnU\nqISikh3K9c3MuIj1IgfJlVghjoejvyYOmL7Oeo8rLQf6DFhPdz1t1jHkKBI6j+s9JUEp6MblrNyc\nxHDncr\/V1ZiCpaXf\/9eL68F\/cHfUNU9JcGbPDQoRTbLsDCZGaHuWxLGLrlPfzNFh8zR912a47aSe\nBqOaAd5cbGMS0aISwNxtE\/aZEGDQFpj7bGIl3m\/yGhsaQ\/0NyEr1Y9ffudnHHglmaKvhMtrdkkFg\nMib4Y1Tui7R9D\/Xlaj0fEi5CeWbeqWdcUJjlC5kokkqbQSKcwmSB6xO2HVOmuFiYrmG9wqyLTH9m\nXEb9mgMdk7dw2HI1jnmupxKvh03AZuw+8nNY+m\/CkcMaCPI1w8eLnSxr3DRzN885y1U6r7dNwCRn\nkJ4Iu6jFOhtTY14ApFjl42HATzvrTs8kidQviawfhnsLnk8aV87+DgF6WtLYQTPjEradcN9rV6fj\nsOkaGDmtxb6PXodN4GaSnNXQIWBdmzU4oq+Bk676bOMZ6i5gD1QLVGbumYXLHLfctqqS0FKXRFoc\nQ4nyU\/4xIIuzcR4ehQLflZqqaLpIzFZ2Lv2zNLWcXo30nGUbCue7XD9yk9dWn0yQmThucRDOPgfg\n5W2DgFBzejB3QgDfHO5ulrQdHYadlS6t\/Y3dF3sLeltV57rVsnjlYGdO7PSkLK5JlZKck+6tn53m\no8O13ffxMiDFP1mY7NHPE\/hnqORJaR3NWen0vJsuKg5LHx+RnBsdyolva8zNa2nIjO9szTVQK1IM\nC7N4xpGhLuY2lqZfBgV4wJseW4MDPRHO912OCPPrDuS5dwf4uQ0F8jyGNTQ0tn6\/PXELyj9+b7U\/\n+6PN6rkO\/uX157z+C83o0UqDj66ZAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/furniture_chassis-1334167961.swf",
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

log.info("furniture_chassis.js LOADED");

// generated ok 2012-08-23 16:17:50 by eric
