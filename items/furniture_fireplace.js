//#include include/furniture.js, include/takeable.js

var label = "Fireplace";
var version = "1353113261";
var name_single = "Fireplace";
var name_plural = "Fireplaces";
var article = "a";
var description = "It's a place with fire. Or sometimes without the fire.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["furniture_fireplace", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "bookshelf",	// defined by furniture_base (overridden by furniture_fireplace)
	"can_flip"	: "1",	// defined by furniture_base
	"can_revert_to_base"	: "1"	// defined by furniture_base
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

verbs.flip = { // defined by furniture_base
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
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

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
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
	"sort_on"			: 57,
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

function getFurnitureBaseGeo(){ // defined by furniture_fireplace
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': {"0":{"platform_item_perm":-1,"platform_pc_perm":-1,"start":{"y":-97,"x":-66},"end":{"y":-96,"x":64}},"1":{"platform_item_perm":-1,"platform_pc_perm":0,"start":{"y":-5,"x":-12},"end":{"y":-5,"x":13}}},
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !pc.skills_has("furnituremaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/99\/\" glitch=\"skill|furnituremaking_1\">Furnituremaking I<\/a> to use a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !(pc.skills_has("furnituremaking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/100\/\" glitch=\"skill|furnituremaking_2\">Furnituremaking II<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"furniture"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-97,"y":-105,"w":191,"h":127},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKRklEQVR42u1XWVRb1xXls03aZh6c\nNmmaZLVJ2jSxnaGOGQzEBozBOCAkgWSEJJAYDAgJEJqRBBJCYhISSAgBYrLjJp5xjJ04tuM4gXhI\n0iRt89WP\/qerf\/3o7rlXTyqQtl\/tR9firbXXPfe+987b90z3vIyMrWvr2rq2rv\/5dRfhh4R7CQ8Q\nHiY8RniK8HPCc4TnCb\/8L+J5Qe8vCM8QnhS++SDhPsKPCHcTvscI\/iBFTiba9cy1U7bAV1cH\/vKH\n6wEwfHXVh0\/OmXHzggNfXPZswGfvufH+UhturfT8W1w\/bf3mygnz7Y\/OOm5fPGZI49Ixw62bK66\/\npnR9esH9yXyosWIdSWa072cIbO+\/\/Ftz8xeX+79NEWPYTOjOe318\/XeXnBvWv7zi\/c6zm+9\/fW1g\nw5zpYfq+vOLjG7110YOvrrFv+j46OdNeSpzuEYyXce\/KUvufrrzThcvHDbiwqMO5RAvH8lwrVpZ0\n+OBtYxpXT5hw\/WQ3rp8yp7F6vgc3ztrJWjZcOtbJn7t20sTX77znxc0VN1aX7bh90f0fceOMhXNg\nWJ5vXRCsmHH\/QlD5YWJY8XGkv\/r3kQHF3yYDKjDMjNQTNJglJIJaTPpV8Jgk6LdKEeyr4RgjjPcr\n+f25YAMSo9o0on4lhpwyDAoYcskxNVSH2KAasYCaj2w+SXJkQElQ\/D3mV\/x5bkRxYzpweEKwIvf5\nNha4laKiz7OzXkZW5k5kEpjMxl2\/eQk5Wa\/QunBv904+35P9Kr+ffGY7n+\/evSP9zO7Xk3JKH8Nr\nr\/yaj2wtpYON7FtJvDJPXJ4lPCLEYsZDhJ+wxcJ9madKS\/JQdvANjoMkHyzNR+mBPI7iopz0vc3P\nHCje+F5apnslB3JRVJiNgr2ZwrN7+Np6PSWkPy93FwoLs2aE7N4mVBXO9HFWUkqKcyOaOjHksoMc\nUnExKsoLcIgUVElLIKksxmFZGZSKcihrK1BLo6LmEGRVpaiWltI7ZZCID\/DnqiQlEIuKUSnaDzHN\nRRVFRDwf1VUlfDx0cC+tFZL+QogYSGbf2F+YMyhY8MeC8TIeJTwh1KOXpZID72jqJGjQSKGtl8LQ\nXgeNWoI6dSVURKqeRgaTUQuHrQUOeyus5mZ0Gxuhb6tD2xEl2lpq0a5To7mxBq00r3izACplOUf5\noX2QV5dCrUrqam6So8OgRo+jDcZOLSoOFUWFGvm4YLwNBHc0NVR9pq2XQK9T4kizDC5nO5fb22r5\nqGtVcLnX1Q5\/vxF9bgMRbIHFdIRIN6G7s5He0aPf2wVnD\/toAxq11fydpsZqbv2ULga25qNn2XfM\nxmbyTGVcIPiEwC3tYk6ws0P9mcXUQB9t5LBbm9Nyd1c9WeQwOvRK9Hs6MRF2YTzkxPCgFR53J3qd\nHXwcHrIhOtGLCGFs1AGrqSmtI4UOvZq8o0RLsxxh0uHt60KfqwMWc0tcOGnSBB8WCD7NXGzq1nxu\nsxIxWxNZgLnwCJn\/CJ93G+vR1akm10gw5LcgHHRhbjaAhflhhMZcWKRxfm4IiRk\/FheS8hKt+fo7\nuS6Xs1XQ2QxjVx25VkUWlGE87EZo1IlY1IPgqGNaIPjTFMFUFjOCOx32pi9MRg2cjhb0unVkHTPc\nzjZ0Gupg7taSFTUcTrsOAZ8Z\/bTz8ZALo8NW+H1GWkuih2JzgEIgNunBW0dHMTvdj\/lEADNxHycT\nIVKRcRdZ2IaRISump7yYnRlAKOj8lwRZxjxVJS6WTMdoF8MWii0dJkI9pMjJMTZiw\/iYg8vhoA3l\nB19DceFLArajZP9OjtLiJJh8oGgHiva9yL1w7kwMl1bmCLNYPjOF8+fiXBf7VjjoINi5TJtiZeYF\ngeC29QR\/plJVqOOxXizQTsNjdkxGXFxeSPjTmI17+fqbhzKpVLxGWbmLysTrlKlJMFlUvptKTTYq\nKzKpdu6AWlmG0ydiOHs6jovvJvDxjRP48OpbiMf6kJj2YSraSzFtIGtaKDbrZonLS0KHs5FgjbxM\nNTZqpbjy0QsdAkEiNufH\/OwAl+dmfJR1nUQgDxJRNsQVWZBW5kAmzUeVeA+fy6R5XGbrpcWvQiop\nwInjESwmhsl6cVy5vITzy3GMUPhMhHsoTgdxdHGQYrAXpu6GBHHZzvgILdg\/CRJePH5s7Jtji0Ha\nWQCxSB+mJvuIYIBID1D8eHkgXzg\/DYW8gEiQlcoziUg2DlfnC2SzuMxGiSiL1jLJonncSkcXhtJY\n5Dp9XP+tT09j7ZNT+JQw6Df5WDVZT\/DB9QQpNu6cejvKlTDLbVA4k3TH8aMjlH0iVEtyuRVrZG8Q\n8gXr5XJZIX8D1eKcpJVFuQgMGJOWWhjiI0sKNoYonm\/fPIMP3j+KSxfmYTDU2zdb8AHB1ywoX7i4\nMnfnwvnZDbtlihjBFOm3j49RAVZCXpXPUXu4QLBaTnqNuZltgK0x4i1HpFxHatMzcQ9ltpcy2YmP\nPjyO5dMzHJFx77ubY\/A+oVizUvPc5UsLt69SjKTibT1JppyBuaaVPigWUZyJc6FgBGV7aZ5N53I+\nn8uqyIJEUizK4dC1SKg++igxPLy8TEZ6eZFnGcwS562lEE6\/M4mZ2MBt5kmhUPOj7h4hDpk5n10+\nO\/XH8+emuOk9vXo+soweD9mp1pl5gjDytTUFqJHTgU8xqFTQWVtbyDO3SrKHz5WK5Jy5msWiQVeN\nBYrjOMXc0jrvMEQZ4Qk3Nwj7DvH41fpmgbf8AttnUm6MTiQzOBZx88QIUZ1iGcdqI4OI3FZbs4+X\nFDm5l8n1qkKoawugrduPhvpisiBzeS4n3d4qJi8kSxYLkRQ55g3umUTSM8ODJgjdzKOpdiv108SS\n5cnNbmUvMTfMUFAzJXwDCR8lwl4iVIQOXUUanZvQpa+EoZVaMkoarbqEEoyOxpn+DQkYnXCC1V7m\nKQbmJeFUeyjVsN4lWJFNHmMkWKaOk5VY5jHLMVczq7Fqz+pkdNxBx1YfnSwmuB10Putl1MXIoaop\n2gBtXSm5VkqdjhLdHTVw2poRHrXzI5F5ZijQzZsRb5+ejtZWSjwNdTgqCAlyv8CL\/9oxKz5SUVHo\nYH1fPbVbGo2EejUZ9XAVaNBKaU3Me0KtVoLWFjkMegW1VyrqAeU8vowdh2E0UG+nq+KjpasWdrMK\nNpOaSGh41rfRe6x7YQ0Ca3YZtNR36toUpLMGeuqS9HoV6lSVp8rK8p5O\/TTd7e+3lA4GzO+OjjAT\n2ykO7HTgW6hoWshiFHNUCuJTHupOAhTgg4QAucVNFiRrhi2IRx1kdRumJqwc0RCdEMFuumdGhORI\n2EoesCE4YiH9Nt6esTYsTF4ZDzM4uRxiyUjyeIg1Ep4vy8oKn+RZHIt6v2Utkcej573ZVNTLR\/Zw\niBqEyUnX17FY32ok4lz19LWvejztq15P26rP27bq7mle63Fo15wMds2am8beHu2av79tbcjfvjbo\n71ibjNjXwrSZyaiT6SK4v4Ng0Aqfr4NzcFJb5qfwcrn4\/\/HWtXVtXf\/X1z8ApHyQCUAkFFQAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/furniture_fireplace-1352835834.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
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
	"furniture"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "buy",
	"c"	: "change_style",
	"o"	: "dont_sell",
	"e"	: "edit_sale_price",
	"h"	: "flip",
	"t"	: "set_sale_price",
	"j"	: "upgrade"
};
itemDef.keys_in_pack = {
	"g"	: "give",
	"c"	: "change_style",
	"j"	: "upgrade"
};

log.info("furniture_fireplace.js LOADED");

// generated ok 2012-11-16 16:47:41 by martlume
