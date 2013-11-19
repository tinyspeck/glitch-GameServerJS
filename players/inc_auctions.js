// yeah!


function auctions_init(){

	if (this.auctions === undefined || this.auctions === null){
		this.auctions = apiNewOwnedDC(this);
		this.auctions.label = 'Auctions';
	}

	if (!this.auctions.active)	this.auctions.active = {};
	if (!this.auctions.done)	this.auctions.done = {};
	if (!this.auctions.cancelled)	this.auctions.cancelled = {};
	if (!this.auctions.expired)	this.auctions.expired = {};
	if (!this.auctions.prompts)	this.auctions.prompts = {};

	this.auctions_check_expired();
}

function auctions_find_container(){
	for (var i in this.hiddenItems){
		var it = this.hiddenItems[i];
		if (it.is_auctioncontainer){
			return it;
		}
	}
	
	// Still here? Make a new one
	var it = apiNewItemStack('bag_private', 1);
	it.label = 'Private Auction Storage';
	it.is_auctioncontainer = true;
	
	this.apiAddHiddenStack(it);
	
	return it;
}

function auctions_delete(destroy_items){
	if (this.auctions){

		for (var i in this.auctions.active){
			this.auctions_cancel(i, destroy_items);
		}

		this.auctions.apiDelete();
		delete this.auctions;
	}
}

function auctions_get_uid_for_item(item_tsid){
	if (this.auctions){
		for (var i in this.auctions.active){
			var details = this.auctions.active[i];		
			if (details.stack.tsid == item_tsid) return i;
		}
	}
	return null;
}

function auctions_reset(destroy_items){
	if (this.auctions){

		for (var i in this.auctions.active){
			this.auctions_cancel(i, destroy_items);
		}

		this.auctions.active = {};
		this.auctions.done = {};
		this.auctions.cancelled = {};
		this.auctions.expired = {};
	}
}

function auctions_start(stack, count, cost, fee_percent, fee_min){

	fee_percent = typeof(fee_percent) != 'undefined' ? fee_percent : 0;
	fee_min  = typeof(fee_min) != 'undefined' ? fee_min : 0;

	this.auctions_init();

	//
	// too many auctions already?
	//
	if (num_keys(this.auctions.active)>=100){
		return {
			ok: 0,
			error: 'max_auctions'
		};
	}

	//
	// do we own this stack?
	//

	var temp = stack.apiGetLocatableContainerOrSelf();
	if (temp.tsid != this.tsid){

		return {
			ok: 0,
			error: 'not_yours'
		};
	}

	//
	// is it bound to us?
	//
	if (stack.isSoulbound()){
		return{
			ok: 0,
			error: 'stack_is_soulbound'
		};
	}

	//
	// check stack isn't hidden
	// (that usually means the stack is already being auctioned, might
	// mean other things in future)
	//

	if (stack.isHidden || stack.container.is_auctioncontainer){
		return {
			ok: 0,
			error: 'hidden_stack'
		};
	}

	//
	// check count is ok
	//

	count = intval(count);
	if (count < 1){
		return {
			ok: 0,
			error: 'bad_count'
		};
	}

	if (count > stack.count){
		return {
			ok: 0,
			error: 'too_many'
		};
	}


	//
	// is the cost ok?
	//

	cost = intval(cost);
	if (cost < 1){
		return {
			ok: 0,
			error: 'bad_cost'
		};
	} else if (cost > 9999999){
		return {
			ok: 0,
			error: 'cost_too_high'
		};
	}

	//
	// work out the fee and check they can pay
	//

	if (fee_percent){
		var fee = intval(cost/100 * fee_percent);
		fee = fee > fee_min ? fee : fee_min;

		if (!this.stats_try_remove_currants(fee, {type: 'auction_fee', class_id: stack.class_tsid})){
			return {
				ok: 0,
				error: "You don't have enough currants for the listing fee."
			};
		}
	}

	//
	// do we need to split the stack off?
	//

	var use = this.removeItemStack(stack.path);

	if (count < stack.count){

		use = stack.apiSplit(count);
		if (!use){
			return {
				ok: 0,
				error: 'cant_split'
			};
		} else {
			stack.apiPutBack();
		}
	}

	//
	// create the auction
	//

	apiLogAction('AUCTION_START', 'pc='+this.tsid, 'stack='+use.tsid, 'count='+count);

	if (use.onAuctionList) use.onAuctionList(this);

	var storage = this.auctions_find_container();

	storage.apiAddHiddenStack(use);

	var key = this.auctions_get_uid();

	this.auctions.active[key] = {
		stack	: use,
		created	: time(),
		expires	: config.is_dev ? time() + (60 * 60 * 24) : time() + (60 * 60 * 72), // only 72h auctions for now
		cost	: cost
	};

	this.auctions_sync(key);


	return {
		ok: 1,
		uid: key
	};
}

function auctions_cancel(uid, destroy_items){

	uid = str(uid);

	this.auctions_init();

	//
	// does it exist?
	//

	if (!this.auctions.active[uid]){
		return {
			ok: 0,
			error: 'not_found',
		};
	}


	//
	// got enough space?
	//

	var details = this.auctions.active[uid];

	//
	// cancel it
	//

	delete this.auctions.active[uid];
	var stack = details.stack;

	apiLogAction('AUCTION_CANCEL', 'pc='+this.tsid, 'stack='+stack.tsid, 'count='+stack.count);
	this.auctions_flatten(details, "cancelled");
	details.cancelled = time();
	this.auctions.cancelled[uid] = details;
	this.auctions_sync(uid);

	if (destroy_items){
		stack.apiDelete();
	}
	else{
		// give the items back by mail
		this.mail_add_auction_delivery(stack.tsid, config.auction_delivery_time, uid, this.tsid, 'cancelled');
	}

	return {
		ok: 1,
	};
}

function auctions_expire(uid){

	uid = str(uid);

	//
	// does it exist?
	//

	if (!this.auctions.active[uid]){
		return {
			ok: 0,
			error: 'not_found',
		};
	}


	var details = this.auctions.active[uid];
	
	//
	// cancel it
	//

	delete this.auctions.active[uid];
	var stack = details.stack;

	this.activity_notify({
		type	: 'auction_expire',
		item	: stack.class_tsid,
		qty	: stack.count,
		cost	: details.cost,
	});

	this.auctions_flatten(details, "expired");
	details.expired = time();
	this.auctions.expired[uid] = details;
	this.auctions_sync(uid);

	apiLogAction('AUCTION_EXPIRE', 'pc='+this.tsid, 'stack='+stack.tsid, 'count='+stack.count);

	this.mail_add_auction_delivery(stack.tsid, config.auction_delivery_time, uid, this.tsid, 'expired');

	return {
		ok: 1,
	};
}

function auctions_purchase(uid, buyer, commission, preflight){

	commission = typeof(commission) != 'undefined' ? commission : 0;

	//
	// does this auction exist?
	//

	uid = str(uid);

	var details = this.auctions.active[uid];

	if (!details){
		return {
			ok: 0,
			error: 'not_found',
		};
	}


	//
	// is this our own auction?
	//

	if (buyer.tsid == this.tsid){

		return {
			ok: 0,
			error: 'is_ours',
		};
	}


	//
	// can the buyer afford it?
	//

	if (!buyer.stats_has_currants(details.cost)){

		return {
			ok: 0,
			error: 'no_cash',
		};
	}


	//
	// does the buyer have space to recieve it?
	//

	if (buyer.isBagFull(details.stack) && !details.stack.has_parent('furniture_base')){

		return {
			ok: 0,
			error: 'no_space',
		};
	}

	if (buyer.mail_count_uncollected_auctions() > 50){
		return {
			ok: 0,
			error: 'mailbox_full',
		};
	}


  //
  // Now that we're done checking for exceptions,
  // decide whether or not to go through with the purchase
  // based on whether we've been asked to preflight the
  // purchase or not
  //
  
  if(preflight) {
    return {
      ok: 1
    };
  }

	//
	// put it in the activity stream
	//

	// we delete this reference first, so that there's no way
	// we'll try some other action on the auction while we're
	// running the code below. later on we'll re-anchor the
	// details into the 'done' list.
	delete this.auctions.active[uid];

	var stack = details.stack;
	this.auctions_flatten(details, "bought");

	this.activity_notify({
		type	: 'auction_buy',
		who	: buyer.tsid,
		item	: stack.class_tsid,
		qty	: stack.count,
		cost	: details.cost,
	});


	//
	// log it to the economy sales table
	//

	utils.http_get('callbacks/auctions_purchased.php', {
		seller_tsid	: this.tsid,
		buyer_tsid	: buyer.tsid,
		item_class_tsid	: stack.class_tsid,
		qty		: stack.count,
		total_price	: details.cost,
	});


	//
	// let the player know in-game
	//

	var prompt_txt;
	var prompt_count;
	var prompt_items;
	var full_items;
	var purchase_txt = stack.count+'x '+(stack.count>1 ? stack.name_plural : stack.name_single);


	if (num_keys(this.auctions.prompts)){
		prompt_count = this.auctions.prompts.count+1;
		prompt_items = this.auctions.prompts.items;
		prompt_items.push(purchase_txt);
		full_items = prompt_items;
		var extra = 0;

		if (prompt_count > 10){
			extra = prompt_count-10;
			full_items = prompt_items;
			prompt_items = prompt_items.slice(0, 9);
		}
		prompt_txt = prompt_count+' of your auctions were purchased: ';
		var last = num_keys(prompt_items)-1;
		for(var i in prompt_items){
			prompt_txt += prompt_items[i];
			if (i == last-1 && !extra){
				prompt_txt += ' and ';
			} else if (i != last){
				prompt_txt += ', ';
			}
		}
		if (extra) prompt_txt += ' and '+extra+(extra > 1 ? ' others' : ' other');

		prompt_items = full_items;

		this.prompts_remove(this.auctions.prompts.uid);
	} else {
		prompt_txt = "Someone bought your auction of "+purchase_txt;
		prompt_items = [ stack.count+"x "+stack.name_plural ];
		prompt_count = 1;
	}

	var prompt_uid = this.prompts_add({
		callback	: 'auctions_sold_callback',
		txt		: prompt_txt,
		timeout		: 0,
		choices		: [
			{ label : 'OK', value: 'accept' }
		]
	});

	this.auctions.prompts = {uid: prompt_uid, count: prompt_count, items: prompt_items};

	//
	// resolve
	//

	buyer.mail_add_auction_delivery(stack.tsid, config.auction_delivery_time, uid, this.tsid, 'purchased');

	buyer.stats_remove_currants(details.cost, {type: 'auction_buy', class_id: stack.class_tsid, count: stack.count});

	var percentage = (100-commission)/100;

	var proceeds = Math.round(details.cost * ((100-commission)/100));

	var result = this.stats_add_currants(proceeds, {type:'auction_buy',class_id: stack.class_tsid, count: stack.count});
	
	apiLogAction('AUCTION_PURCHASE', 'pc='+this.tsid, 'buyer='+buyer.tsid, 'stack='+stack.tsid, 'count='+stack.count, 'currants='+proceeds);
	
	// Item callback for a sold auction.
	if (stack.onAuctionSold) {
		stack.onAuctionSold(this, buyer);
	}

	details.sold = time();
	details.buyer = buyer;

	this.auctions.done[uid] = details;

	this.auctions_sync(uid);

	//
	// quests?
	//
	
	this.quests_inc_counter('auctions_sold_'+details.class_tsid, details.count);

	//
	// spendy achievements
	//

	if (details.cost >= 1009){
		buyer.achievements_grant('big_spender');
	}
			
	if (details.cost >= 2003){
		buyer.achievements_grant('el_big_spenderino');
	}
			
	if (details.cost >= 5003){
		buyer.achievements_grant('moneybags_magoo');
	}

	return {
		ok: 1,
	};
}

function auctions_expired_callback(details, choice){
}
function auctions_sold_callback(details, choice){
	this.auctions.prompts = {};
}


// this function removes the stack ref and replace it with flattened data.
// we do this because the stack can be destroyed after its returned to a player.
function auctions_flatten(details, reason){

	if (!details.stack){

		log.info(time());
		log.info(details);

		throw "trying to flatten a flat auction. was flattened "+details.flat_when+" for reason "+details.flat_reason;
	}

	details.flat_when = time();
	details.flat_reason = reason;
	details.count = details.stack.count;
	details.class_tsid = details.stack.class_tsid;
	delete details.stack;
}

function auctions_get_uid(){

	var uid = time();

	while (
		this.auctions.active[str(uid)] ||
		this.auctions.done[str(uid)] ||
		this.auctions.cancelled[str(uid)]
	){
		uid++;
	}

	return str(uid);
}

function auctions_sync(uid){

	utils.http_get('callbacks/auctions_update.php', {
		'player_tsid'	: this.tsid,
		'auction_uid'	: uid,
	});
}

function auctions_sync_all(){

	utils.http_get('callbacks/auctions_update.php', {
		'player_tsid'	: this.tsid,
	});
}

function auctions_sync_everything(){

	for (var i in this.auctions.active	) this.auctions_sync(i);
	for (var i in this.auctions.done	) this.auctions_sync(i);
	for (var i in this.auctions.cancelled	) this.auctions_sync(i);
	for (var i in this.auctions.expired	) this.auctions_sync(i);
}

function admin_auctions_get(args){

	this.auctions_check_expired();

	var data = null;
	var status = 'not_found';

	if (this.auctions.active[args.uid]){

		data = utils.copy_hash(this.auctions.active[args.uid]);
		data.label = data.stack.getLabel ? data.stack.getLabel() : data.stack.label;
		data.count = data.stack.count;
		data.class_tsid = data.stack.class_tsid;
		data.stack_tsid = data.stack.tsid;

		if (data.stack.hasTag('tool') || data.stack.hasTag('potion')){
			data.is_tool = 1;
			if (data.stack.getClassProp('display_wear') == 1){
				data.tool_uses = data.stack.getInstanceProp('points_remaining');
				data.tool_capacity = data.stack.getClassProp('points_capacity');
			}
				data.tool_broken = data.stack.getInstanceProp('is_broken');
		} else if (data.stack.hasTag('powder') && intval(data.stack.getClassProp('maxCharges'))){
			data.is_tool = 1;
			data.tool_uses = data.stack.getInstanceProp('charges');
			data.tool_capacity = data.stack.getClassProp('maxCharges');
		} else if (data.stack.has_parent('furniture_base')) {
			data.is_furniture = 1;
			data.furniture_upgrades = data.stack.getUpgrades(this, true);
			data.furniture_upgrade_id = data.stack.getInstanceProp('upgrade_id');
		}
		delete data.stack;

		status = 'active';
	}

	if (this.auctions.cancelled[args.uid]){

		data = utils.copy_hash(this.auctions.cancelled[args.uid]);
		status = 'cancelled';
	}

	if (this.auctions.done[args.uid]){

		data = utils.copy_hash(this.auctions.done[args.uid]);
		data.buyer_tsid = data.buyer.tsid;
		delete data.buyer;

		status = 'done';
	}

	if (this.auctions.expired[args.uid]){

		data = utils.copy_hash(this.auctions.expired[args.uid]);
		status = 'expired';
	}


	if (status == 'not_found'){

		return {
			ok	: 0,
			error	: 'not_found',
		};

	}else{
		return {
			ok	: 1,
			status	: status,
			data	: data,
		};
	}
}

function admin_auctions_get_all(){
	
	return { ok : 1,
		 active   : this.auctions.active,
		 done     : this.auctions.done,
		 cancelled: this.auctions.cancelled,
		 expired  : this.auctions.expired,
		};
}

function admin_auctions_relist_broken(args){
	//
	// do we own this stack?
	//

	var stack = apiFindObject(args.stack_tsid);

	if (!stack){
		return {
			ok: 0,
			error: 'no_stack',
		};
	}

	if (!stack.isHidden){
		return {
			ok: 0,
			error: 'not_hidden',
		};
	}

	for (var i in this.auctions.active){
		if (this.auctions.active[i].stack.tsid == args.stack_tsid){
			return {
				ok: 0,
				error: 'already_listed',
			};
		}
	}

	var temp = stack.apiGetLocatableContainerOrSelf();
	if (temp.tsid != this.tsid){

		return {
			ok: 0,
			error: 'not_yours',
		};
	}

	//
	// temporarily pop the stack back into existence
	//

	if (this.isBagFull(stack) && !stack.has_parent('furniture_base')){

		return {
			ok: 0,
			error: 'bags_full'
		};
	}

	this.addItemStack(stack);

	this.auctions_start(stack, args.count, args.cost, 0, 0);
}

function admin_auctions_private_bag_items(){
	var cont = this.auctions_find_container();

	return cont.hiddenItems;
}

function admin_auctions_return_expired_item(args){
	this.mail_add_auction_delivery(args.tsid, 0, args.uid, this.tsid, 'expired');
	return 1;
}

function admin_auctions_start(args){

	if (this.isInTimeout()){
		return {
			ok: 0,
			error: 'account_suspended',
		};
	}

	if (!args.cost || args.cost < 1){
		return {
			ok: 0,
			error: 'no_cost',
		};
	}

	var stack = apiFindObject(args.stack_tsid);

	if (!stack){
		return {
			ok: 0,
			error: 'no_stack',
		};
	}

	if (stack.hasTag('no_auction') || stack.hasTag('bag')){
		return {
			ok: 0,
			error: 'not_allowed',
		};
	}

	if (stack.isSoulbound()){
		return {
			ok: 0,
			error: 'not_allowed',
		};
	}

	if (!args.fee_min){
		args.fee_min = 0;
	}

	if (!args.fee_percent){
		args.fee_percent = 0;
	}

	return this.auctions_start(stack, args.count, args.cost, args.fee_percent, args.fee_min);
}

function admin_auctions_purchase(args){

	var buyer = apiFindObject(args.buyer_tsid);

	if (!buyer){
		return {
			ok: 0,
			error: 'no_buyer',
		};
	}

	if (!args.commission){
		args.commission = 0;
	}

	return this.auctions_purchase(args.uid, buyer, args.commission, args.preflight);
}

function admin_auctions_expire(args){
	return this.auctions_expire(args.uid);
}

function admin_auctions_cancel(args){

	return this.auctions_cancel(args.uid);
}

function admin_auctions_clear_from_history(args){
	if (this.auctions.cancelled[args.uid]){
		delete this.auctions.cancelled[args.uid];
	}
	if (this.auctions.expired[args.uid]){
		delete this.auctions.expired[args.uid];
	}
	if (this.auctions.done[args.uid]){
		delete this.auctions.done[args.uid];
	}
}

function auctions_check_expired(){

	for (var i in this.auctions.active){

		if (this.auctions.active[i].expires < time()){
			this.auctions_expire(i);
		}
	}
}
