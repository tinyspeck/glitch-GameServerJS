function storeGetID(item, verb){
	if (item.instanceProps && item.instanceProps.store_id){
		return intval(item.instanceProps.store_id);
	}
	else if (item.verbs && item.verbs[verb]){
		return intval(item.verbs[verb].store_id);
	}
	
	return null;
}


function storeAdjustPrices(store_info){

	var multiplier = 0.0;
	
	if (this.imagination_has_upgrade("vendors_lower_sell_price_4")){
		multiplier = 0.1;
	}
	else if (this.imagination_has_upgrade("vendors_lower_sell_price_3")){
		multiplier = 0.07;
	}
	else if (this.imagination_has_upgrade("vendors_lower_sell_price_2")){
		multiplier = 0.05;
	}
	else if (this.imagination_has_upgrade("vendors_lower_sell_price_1")){
		multiplier = 0.02;
	}

	if (multiplier > 0.0) {
	
		var items = store_info.items;
	
		for (var i in items){
			items[i].cost = Math.round(items[i].cost - multiplier * items[i].cost);
		}
		
		store_info.items = items;
	}
	
	return store_info;
}


//
// this function sends a message to the client to open the store interface.
// we need to send the list of stuff we're selling.
//

function openStoreInterface(item, verb){

	var store_id = intval(this.storeGetID(item, verb));

	if (!store_id){
		this.sendActivity("store verb is not bound to a store - oops");
		return false;
	}
	
	if (item.onInteractionStarting) item.onInteractionStarting(this);

	var store_info = get_store(store_id);
	
	// Adjust for upgrades:
	if (store_id != 25) store_info = this.storeAdjustPrices(store_info);
	store_info = this.storeAdjustInventory(item, store_info);

	var out = {
		type: 'store_start',
		item_class: item.class_id,
		item_tsid: item.tsid,
		verb: verb,
		store: store_info,
	};
	
	if (item.instanceProps && item.instanceProps.store_id > 0){
		if (item.instanceProps.width && item.instanceProps.height){
			out['location_rect'] = {
				x: item.instanceProps.x,
				y: item.instanceProps.y,
				w: item.instanceProps.width,
				h: item.instanceProps.height
			};
		}
	}

	//log.info(out);

	this.apiSendMsgAsIs(out);
	//this.sendActivity("store_start");
	
	return true;
}


//
// player wants to buy from the store
//

var generic_bag_classes = ['bag_generic', 'bag_generic_blue', 'bag_generic_gray', 'bag_generic_green', 'bag_generic_pink', 'bag_bigger', 'bag_bigger_blue', 'bag_bigger_gray', 'bag_bigger_green', 'bag_bigger_pink'];
function storeBuy(msg, item){

	var store_id = intval(this.storeGetID(item, msg.verb));
	var store_info = get_store(store_id);
	
	// Adjust for upgrades:
	if (store_id != 25) store_info = this.storeAdjustPrices(store_info);
	store_info = this.storeAdjustInventory(item, store_info);
	
	
	//
	// check the count looks ok
	//

	var count = intval(msg.count);

	if (count<=0){
		log.info("positive counts only");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't buy a negative/zero amount of things!"));
	}
	
	
	//
	// check that the store sells this item
	//

	var store_items = this.getStoreItems(item, store_info, msg.class_tsid, count);
	//log.info(store_items);
	var item_proto = apiFindItemPrototype(msg.class_tsid);

	if (!num_keys(store_items)){
		log.info("store doesn't sell that item");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "This store no longer sells that item."));
	}
	

	//
	// check that we have enough money
	//

	var total_cost = 0;
	var total_count = 0;
	for (var i in store_items){
		total_cost += (store_items[i].cost * store_items[i].count);
		total_count += store_items[i].count;
	}

	if (count > total_count) count = total_count;
	//log.info('total cost: '+total_cost);

	if (msg.price){
		var expected_price = intval(msg.price) * count;
		if (expected_price != total_cost){
			log.info("price mismatch: "+expected_price+" vs "+total_cost);
			return this.apiSendMsg(make_fail_rsp(msg, 0, "Oops, the price appears to have changed underneath you. Please try your purchase again."));
		}
	}
	
	if (!this.stats_has_currants(total_cost)){
		log.info("you don't have enough money");
		this.sendActivity("Sorry, you can't afford that.");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, you can't afford that."));
	}


	//
	// give them the item
	//

	var remainder = this.createItemFromSource(msg.class_tsid, count, item, true);
	if (remainder == count){
		log.info("your bag is full");
		this.sendActivity("You can't buy that -- there's no more room in your inventory!");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't buy that -- there's no more room in your inventory!"));
	}
	
	var got = count-remainder;
	this.achievements_increment('items_bought', msg.class_tsid, got);
	
	var rsp = 'You bought '+item_proto.formatStack(got)+'.';
	if (remainder){
		rsp += ' And '+remainder+" didn't fit in your inventory, so you weren't charged for them.";
		var to_refund = remainder;
		for (var i in store_items){
			if (store_items[i].count <= to_refund){
				total_cost -= (store_items[i].cost * store_items[i].count);
				to_refund -= store_items[i].count;
			}
			else{
				total_cost -= (store_items[i].cost * to_refund);
				to_refund = 0;
			}
			
			if (to_refund <= 0) break;
		}
	}
	this.sendActivity(rsp);
	this.announce_sound('PURCHASE_ITEM');


	//
	// Charge them
	//
	
	this.stats_remove_currants(total_cost, {type: 'store_buy', class_id: msg.class_tsid, store: store_id, count: got});


	//
	// Record the sale if we have limited quantities
	//

	if (item.store_sold && item.store_sold[msg.class_tsid] !== undefined){
		item.store_sold[msg.class_tsid] += got;
		apiLogAction('RARE_SALE', 'pc='+this.tsid, 'class_id='+msg.class_tsid, 'amount='+got);
	}

	if (!item.sales_made) item.sales_made = 0;
	item.sales_made++;
	

	//
	// Quests, etc
	//
	
	if (in_array_real(msg.class_tsid, this.generic_bag_classes)){
		this.quests_inc_counter('generic_bag_purchased', got);
	}

	if (total_cost >= 1009){
		this.achievements_grant('big_spender');
	}
		
	if (total_cost >= 2003){
		this.achievements_grant('el_big_spenderino');
	}
		
	if (total_cost >= 5003){
		this.achievements_grant('moneybags_magoo');
	}

	if (item.onPurchase) item.onPurchase(this, msg);

	return this.apiSendMsg(make_ok_rsp(msg));
}


//
// player wants to sell a stack of items to the store
//

var watering_can_stores = [6,11,12];
var hatchet_stores = [4,6,11,12];
function storeSell(msg, item){

	var store_id = this.storeGetID(item, msg.verb);
	var store_info = get_store(intval(store_id));

	//
	// check they have the items they are trying to sell
	//

	var have_count = this.countItemClass(msg.sellstack_class);
	var items = this.getAllContents();
	
	var stack;
	if (msg.sellstack_tsid && items[msg.sellstack_tsid]){
		stack = this.removeItemStack(items[msg.sellstack_tsid].path);
	}
	else{
		stack = this.removeItemStackClass(msg.sellstack_class, msg.count);
	}
	
	
	if (!stack){
		log.info("no stack");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "I can't find the thing you wanted to sell."));
	}
	
	if (stack.class_tsid != msg.sellstack_class){
		log.info("class mismatch");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "I found the thing you wanted to sell, but it's not the type of thing I was expecting."));
	}

	//log.info("have: "+have_count);
	//log.info("want to sell: "+msg.count);

	if (msg.count <= 0){
		log.info("can only sell a positive count");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't sell negative/zero amount of things."));
	}

	if (msg.count > have_count){
		log.info("don't have enough to sell");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "Sorry, you don't have as much as you tried to sell."));
	}


	//
	// check the item has a cost
	//
	
	var base_cost = stack.getBaseCost();
	//log.info("PRICE: store sell base cost is "+base_cost);
	var cost = Math.round(base_cost * store_info.buy_multiplier) * msg.count;
	//log.info("PRICE: store sell rounded and multiplied cost is "+cost);
	if (cost <= 0){
		log.info("can't be sold - has no value");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't sell that item."));
	}

	var cost_no_upgrade = cost;
	cost = Math.round(this.storeAdjustBuyPrice(cost));
	//log.info("PRICE: store sell after adjustment "+cost);
	
	// Custom item callback
	if (stack.onSell) {
		stack.onSell(this, msg);
	}

	//
	// remove stack from player
	//

	if (msg.count > stack.count){
		var remainder = msg.count;
		if (stack){
			remainder = msg.count - stack.count;
			stack.apiDelete();
			this.items_removed(stack);
		}
		
		do {
			stack = this.removeItemStackClass(msg.sellstack_class, remainder);
			remainder -= stack.count;
			stack.apiDelete();
			this.items_removed(stack);
		} while (remainder > 0);
	}
	else if (msg.count == stack.count){
		stack.apiDelete();
		this.items_removed(stack);
	}else{
		var needed = stack.apiSplit(msg.count);
		if (needed) needed.apiDelete();
	}

	
	//
	// give player some money
	//

	//log.info("gain cash: "+cost);
	this.announce_sound('PURCHASE_ITEM');
	this.stats_add_currants(cost, {type: 'store_sell', class_id: msg.sellstack_class, store: store_id, count: msg.count});
	
	
	if (!item.buys_made) item.purchases_made = 0;
	item.purchases_made++;
	
	
	//
	// Quests/Achievements
	//
	
	if (msg.sellstack_class == 'frying_pan' && store_id == 7){
		this.quests_set_flag('frying_pan_sold');
	}
	else if (msg.sellstack_class == 'watering_can' && in_array(store_id, this.watering_can_stores)){
		this.quests_set_flag('watering_can_sold');
	}
	else if (msg.sellstack_class == 'hatchet' && in_array(store_id, this.hatchet_stores)){
		this.quests_set_flag('hatchet_sold');
	}
	
	this.achievements_increment('items_sold', msg.sellstack_class, intval(msg.count));


	var item_proto = apiFindItemPrototype(msg.sellstack_class);
	var text = "You sold "+item_proto.formatStack(msg.count)+" for "+cost+" currants."
	
	var amt = (cost - cost_no_upgrade);
	if (amt > 0) {
		var upgrade_name = this.storeGetUpgradeName();
		if (upgrade_name != "") {
			
			if (amt != 1) {
				text += " Your \""+upgrade_name+"\" upgrade got you an extra "+amt+" currants!";
			}
			else { 
				text += " Your \""+upgrade_name+"\" upgrade got you an extra currant!";
			}
		}
	}
	
	this.sendActivity(text);
	return this.apiSendMsg(make_ok_rsp(msg));
}

// Handle Wheeler Dealer imagination upgrades
function storeAdjustBuyPrice(cost){
	if (this.imagination_has_upgrade("vendors_higher_buy_price_4")){
		return (cost + 0.1 * cost);
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_3")){
		return (cost + 0.07 * cost);
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_2")){
		return (cost + 0.05 * cost);
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_1")){
		return (cost + 0.02 * cost);
	}
	
	return cost;
}

// Handle Wheeler Dealer imagination upgrades
function storeGetUpgradeMultiplier(){
	if (this.imagination_has_upgrade("vendors_higher_buy_price_4")){
		return 0.1;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_3")){
		return  0.07;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_2")){
		return 0.05;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_1")){
		return 0.02;
	}
	
	return 0.0;
}


// Handle Wheeler Dealer imagination upgrades
function storeGetUpgradeName(){
	if (this.imagination_has_upgrade("vendors_higher_buy_price_4")){
		var upgrade = config.data_imagination_upgrades["vendors_higher_buy_price_4"];
		return upgrade.name;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_3")){
		var upgrade = config.data_imagination_upgrades["vendors_higher_buy_price_3"];
		return upgrade.name;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_2")){
		var upgrade = config.data_imagination_upgrades["vendors_higher_buy_price_2"];
		return upgrade.name;
	}
	else if (this.imagination_has_upgrade("vendors_higher_buy_price_1")){
		var upgrade = config.data_imagination_upgrades["vendors_higher_buy_price_1"];
		return upgrade.name;
	}
	
	return "";
}

//
// check how much the store will pay for this item
//

function storeSellCheck(msg, item){

	var store_id = this.storeGetID(item, msg.verb);
	var store_info = get_store(intval(store_id));
	
	var items = this.getAllContents();
	var stack;
	if (msg.sellstack_tsid && items[msg.sellstack_tsid]){
		stack = this.removeItemStackTsid(msg.sellstack_tsid);
	}
	else{
		stack = this.removeItemStackClass(msg.sellstack_class);
	}
	
	if (!stack){
		log.info("invalid item class to check: "+msg.sellstack_class+' - '+msg.sellstack_tsid);
		return this.apiSendMsg(make_fail_rsp(msg, 0, "Oops, I can't find that item in your inventory."));
	}

	//
	// check the item has a cost
	//

	var base_cost = stack.getBaseCost();
	//log.info("PRICE is (unrounded) "+base_cost * store_info.buy_multiplier);
	var cost = Math.round(base_cost * store_info.buy_multiplier);
	//log.info("PRICE is (rounded) "+cost);
	if (cost <= 0){
		log.info("can't be sold - has no value");
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't sell that kind of thing."));
	}
	
	//
	// check the item isn't banned from vendors
	//

	if (stack.hasTag('no_vendor')){
		return this.apiSendMsg(make_fail_rsp(msg, 0, "You can't sell that kind of thing."));
	}
	
	var rsp = make_ok_rsp(msg);
	rsp.cost = cost;
	rsp.multiplier = this.storeGetUpgradeMultiplier();
	rsp.upgrade_name = this.storeGetUpgradeName();
	rsp.itemstack_tsid = msg.itemstack_tsid;
	rsp.sellstack_class = msg.sellstack_class;
	if (msg.sellstack_tsid) rsp.sellstack_tsid = msg.sellstack_tsid;
	if (stack.has_custom_basecost && !(stack.hasTag("powder") && !intval(stack.getClassProp("maxCharges")))) {
		rsp.single_stack_only = true;
	}
	
	stack.apiPutBack();
	
	return this.apiSendMsg(rsp);
}

// Finds the item in either the store's inventory of player-sold items or its own reserve
// Returns a hash of items from inventory+reserve up to 'count'
function getStoreItems(item, store_info, class_id, count){
	var items = [];
	
	var orig_count = count;
		
	for (var i in store_info.items){
		var it = store_info.items[i];
		if (it.class_tsid == class_id){
			if (it.total_quantity){
				if (it.store_sold + orig_count <= it.total_quantity){
					it.count = orig_count;
				}
				else{
					it.count = it.total_quantity - it.store_sold;
				}
			}
			else{
				it.count = orig_count;
			}

			if (it.count > 0) items.push(it);
			break;
		}
	}
	
	return items;
}

// Finds the closest vendor of a given type and returns the location tsid.
function findClosestVendor(type) {
	var locs = [];
	
	// This is not terribly efficient, but what are you going to do?
	for (var i in config.map_stores) {
		if(config.map_stores[i] == type) {
			locs.push(i);
		}
	}
	
	// Get closest loc and path
	var path = apiFindShortestGlobalPath(this.location.tsid, locs);
	
	if(!path || !path.length) {
		log.error("Player "+this+" cannot find closest vendor. All vendors are unreachable.");
		return null;
	}
	
	return path[path.length - 1].tsid;
}

function storeAdjustInventory(item, store_info){
	for (var i in store_info.items){
		var it = store_info.items[i];
		if (it && it.total_quantity){
			if (!item.store_sold) item.store_sold = {};
			if (!item.store_sold[it.class_tsid]) item.store_sold[it.class_tsid] = 0;

			store_info.items[i].store_sold = item.store_sold[it.class_tsid];
			
			if (store_info.items[i].store_sold > it.total_quantity) store_info.items[i].store_sold = it.total_quantity;
		}
	}

	return store_info;
}
