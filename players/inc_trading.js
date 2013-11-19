function trading_init(){
	if (!this.trading){
	//if (this.trading === undefined || this.trading === null){
		this.trading = apiNewOwnedDC(this);
		this.trading.label = 'Trading';
		
		this.trading_create_escrow_bag();
		this.trading.currants = 0;
	}
	
	var escrow = this.trading_get_escrow_bag();
	if (!escrow){
		this.trading_create_escrow_bag();
	}
	else if (escrow.capacity != 6 && escrow.countContents() == 0){
		escrow.apiDelete();
		this.trading_create_escrow_bag();
	}
}

function trading_create_escrow_bag(){
	// Create a new private storage bag for holding items in escrow
	var it = apiNewItemStack('bag_escrow', 1);
	it.label = 'Private Trading Storage';

	this.apiAddHiddenStack(it);

	this.trading.storage_tsid = it.tsid;
}

function trading_reset(){
	this.trading_cancel_auto();

	if (this.trading){
		var escrow = this.trading_get_escrow_bag();
		if (escrow){
			var contents = escrow.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
		}
	}
}

function trading_delete(){
	this.trading_cancel_auto();

	if (this.trading){
		var escrow = this.trading_get_escrow_bag();
		if (escrow){
			var contents = escrow.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
			
			escrow.apiDelete();
			delete this.trading.storage_tsid;
		}
	
		this.trading.apiDelete();
		delete this.trading;
	}
}

function trading_get_escrow_bag(){
	return this.hiddenItems[this.trading.storage_tsid];
}

function trading_has_escrow_items(){
	var escrow = this.trading_get_escrow_bag();
	
	return escrow.countContents() > 0 ? true : false;
}

//
// Attempt to start a trade with player 'target_tsid'
//

function trading_request_start(target_tsid){
	//log.info(this.tsid+' starting trade with '+target_tsid);
	
	this.trading_init();
	
	//
	// Are we currently trading?
	//
	
	if (this['!is_trading']){
		return {
			ok: 0,
			error: 'You are already trading with someone else. Finish that up first.'
		};
	}
	
	//
	// Is there stuff in our escrow bag?
	//
	
	if (this.trading_has_escrow_items()){
		return {
			ok: 0,
			error: 'You have unsettled items from a previous trade. Make some room in your pack for them before attempting another trade.'
		};
	}
	
	//
	// Valid player?
	//
	
	if (target_tsid == this.tsid){
		return {
			ok: 0,
			error: 'No trading with yourself.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!target){
		return {
			ok: 0,
			error: 'Not a valid target player.'
		};
	}
	
	if (this.buddies_is_ignored_by(target) || this.buddies_is_ignoring(target)){
		return {
			ok: 0,
			error: 'You are blocking or blocked by that player.'
		};
	}
	
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	if (target.getProp('location').tsid != this.location.tsid){
		return {
			ok: 0,
			error: "Oh come on, they're not even in the same location as you!"
		};
	}
	
	//
	// Are they currently trading?
	//
	
	if (target['!is_trading']){
		target.sendOnlineActivity(this.label+' wanted to trade with you, but you are busy.');
		return {
			ok: 0,
			error: 'That player is already trading with someone else. Please wait until they are done.'
		};
	}
	
	//
	// Is there stuff in their escrow bag?
	//
	
	if (target.trading_has_escrow_items()){
		target.sendOnlineActivity(this.label+' wanted to trade with you, but you have an unsettled previous trade.');
		return {
			ok: 0,
			error: 'That player is not available for trading right now.'
		};
	}
	
	//
	// PROCEED
	//
	
	target.trading_init();
	this['!is_trading'] = target.tsid;
	target['!is_trading'] = this.tsid;
	
	target.apiSendMsgAsIs({
		type: 'trade_start',
		tsid: this.tsid
	});
	
	
	//
	// Overlays
	//
	
	var anncx = {
		type: 'pc_overlay',
		duration: 0,
		pc_tsid: this.tsid,
		delta_x: 0,
		delta_y: -110,
		bubble: true,
		width: 70,
		height: 70,
		swf_url: this.overlay_key_to_url('trading'),
		uid: this.tsid+'_trading'
	};

	this.location.apiSendAnnouncementX(anncx, this);
	
	anncx['pc_tsid'] = target.tsid;
	anncx['uid'] = target.tsid+'_trading';
	target.location.apiSendAnnouncementX(anncx, target);
	
	return {
		ok: 1
	};
}

//
// Cancel an in-progress trade with 'target_tsid'
//

function trading_cancel(target_tsid){
	//log.info(this.tsid+' canceling trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	
	
	//
	// Roll back the trade on us and the target
	//

	this.trading_rollback();
	if (target['!is_trading'] == this.tsid){
		target.trading_rollback();
	}
	
	
	//
	// Overlays
	//
	
	this.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: this.tsid+'_trading'
	}, this);
	if (apiIsPlayerOnline(target_tsid) && target['!is_trading'] == this.tsid){
		target.location.apiSendMsgAsIsX({
			type: 'overlay_cancel',
			uid: target.tsid+'_trading'
		}, target);
	}


	//
	// Tell the other player
	//
	
	if (apiIsPlayerOnline(target_tsid) && target['!is_trading'] == this.tsid){
		target.apiSendMsgAsIs({
			type: 'trade_cancel',
			tsid: this.tsid
		});
		
		target.prompts_add({
			txt		: this.label+" canceled their trade with you.",
			icon_buttons	: false,
			timeout		: 10,
			choices		: [
				{ value : 'ok', label : 'Oh well' }
			]
		});
	}
	
	delete this['!is_trading'];
	if (target['!is_trading'] == this.tsid){
		delete target['!is_trading'];
	}
	
	return {
		ok: 1
	};
}

function trading_rollback(){
	//log.info(this.tsid+' rolling back trade');
	//
	// Refund all the in-progress items
	//

	var escrow = this.trading_get_escrow_bag();
	if (escrow){
		var returned = [];
		var overflow = false;
		var contents = escrow.getContents();
		for (var i in contents){
			if (contents[i]){
				var restore = escrow.removeItemStackSlot(i);
				var count = restore.count;
				var remaining = this.addItemStack(restore);
				if (remaining) overflow = true;
				
				if (remaining != count){
					returned.push(pluralize(count-remaining, restore.name_single, restore.name_plural));
				}
			}
		}
		
		if (overflow){
			//log.info('trading_rollback overflow detected');
			this.prompts_add({
				txt		: "Your magic rock is holding items from a previous trade for you. Make room in your pack to hold them.",
				icon_buttons	: false,
				timeout		: 30,
				choices		: [
					{ value : 'ok', label : 'Very well' }
				]
			});
			
			this.trading_reorder_escrow();
		}
		
		if (returned.length){
			this.prompts_add({
				txt		: "Your "+pretty_list(returned, ' and ')+" "+(returned.length == 1 ? 'has' : 'have')+" been returned to you.",
				icon_buttons	: false,
				timeout		: 5,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}
	}


	//
	// Refund currants
	//
	
	if (this.trading.currants){
		this.stats_add_currants(this.trading.currants);
		this.trading.currants = 0;
	}
	
	delete this['!trade_accepted'];
}

//
// Cancel any in-progress trade
//

function trading_cancel_auto(){
	//log.info(this.tsid+' canceling all trades');
	if (this['!is_trading']) this.trading_cancel(this['!is_trading']);
}

//
// Add an item to the trade
//

function trading_add_item(target_tsid, itemstack_tsid, amount){
	//log.info(this.tsid+' adding item '+itemstack_tsid+' to trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	//
	// Get the item, put it in escrow
	//
	
	delete this['!trade_accepted'];
	delete target['!trade_accepted'];
	
	var ret = this.trading_add_item_do(itemstack_tsid, amount);
	if (!ret['ok']){
		return ret;
	}
	
	
	//
	// Tell the other player
	//
	
	if (ret.item_class){
		var rsp = {
			type: 'trade_add_item',
			tsid: this.tsid,
			itemstack_class: ret.item_class,
			amount: ret.count,
			slot: ret.slot,
			label: ret.label,
			config: ret.config
		};
		
		if (ret.tool_state) rsp.tool_state = ret.tool_state;
		target.apiSendMsgAsIs(rsp);
	}
	
	return {
		ok: 1
	};
}

function trading_add_item_do(itemstack_tsid, amount, destination_slot){
	//log.info('trading_add_item_do '+itemstack_tsid+' ('+amount+')');
	var item = this.removeItemStackTsid(itemstack_tsid, amount);
	if (!item){
		return {
			ok: 0,
			error: "That item is not in your possession."
		};
	}
	
	var target = getPlayer(this['!is_trading']);
	if (!item.has_parent('furniture_base') && target.isBagFull(item)){
		target.sendOnlineActivity(this.label+' tried to offer some '+item.label+' for trade, but you cannot hold it.');
		this.items_put_back(item);
		return {
			ok: 0,
			error: "The other player cannot hold that item."
		};
	}
	
	var item_class = item.class_tsid;
	var have_count = this.countItemClass(item_class);
	if (item.has_parent('furniture_base')){
		have_count = this.furniture_get_bag().countItemClass(item_class);
	}
	
	// If this is a stack we split off from somewhere, we need to add it to the count
	if (!item.container) have_count += item.count;
	
	//log.info('trading_add_item_do have_count: '+have_count+', amount: '+amount);
	if (have_count < amount){
		this.items_put_back(item);
		return {
			ok: 0,
			error: "You don't have enough of that item."
		};
	}
	
	
	//
	// Some things are untradeable -- check them here
	//
	
	if (item.is_bag && item.countContents() > 0){
		this.items_put_back(item);
		return {
			ok: 0,
			error: "You may not trade non-empty bags."
		};
	}

	if (item.isSoulbound()){
		this.items_put_back(item);
		return {
			ok: 0,
			error: "That item is locked to you, and can't be traded."
		};
	}
	
	
	var escrow = this.trading_get_escrow_bag();
	
	var slots = {};
	var contents = escrow.getContents();
	for (var i in contents){
		if (contents[i]){
			slots[i] = contents[i].count;
		}
	}
	
	
	var item_count = item.count;
	var remaining = escrow.addItemStack(item, destination_slot);
	if (remaining == item_count){
		var restore = escrow.removeItemStackClass(item.class_tsid, remaining);
		this.items_put_back(item);
		
		this.addItemStack(restore);
		return {
			ok: 0,
			error: "Oops! We couldn't place that item in escrow."
		};
	}
	
	if (item_count < amount){
		var still_need = amount - item_count;
		
		do {
			var stack = this.removeItemStackClass(item_class, still_need);
			if (!stack){
				return {
					ok: 0,
					error: "Oops! We couldn't place that item in escrow."
				};
			}
			still_need -= stack.count;
			
			remaining = escrow.addItemStack(stack);
			if (remaining){
				var restore = escrow.removeItemStackClass(item.class_tsid, remaining);
				this.items_put_back(stack);

				this.addItemStack(restore);
				return {
					ok: 0,
					error: "Oops! We couldn't place that item in escrow."
				};
			}
		} while (still_need > 0);
	}
	
	
	//
	// Send changes
	//
	
	contents = escrow.getContents();
	for (var i in contents){
		if (contents[i]){
			if (slots[i] && contents[i].count != slots[i]){
				var rsp = {
					type: 'trade_change_item',
					tsid: this.tsid,
					itemstack_class: contents[i].class_id,
					amount: contents[i].count,
					slot: i,
					label: contents[i].label
				};
				
				if (contents[i].is_tool) rsp.tool_state = contents[i].get_tool_state();
				target.apiSendMsgAsIs(rsp);
			}
		}
	}
	
	if (item.apiIsDeleted()){
		//log.info('Stack was merged');
		return {
			ok: 1
		};
	}
	
	var rsp = {
		ok: 1,
		item_class: item_class,
		slot: intval(item.slot),
		count: item.count,
		label: item.label
	};
	if (item.is_tool) rsp.tool_state = item.get_tool_state();
	
	// Config?
	if (item.make_config){
		rsp.config = item.make_config();
	}
	
	return rsp;
}

//
// Remove an item from the trade
//

function trading_remove_item(target_tsid, itemstack_tsid, amount){
	//log.info(this.tsid+' removing item '+itemstack_tsid+' from trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	
	//
	// Get the item from escrow
	//
	
	delete this['!trade_accepted'];
	delete target['!trade_accepted'];
	var ret = this.trading_remove_item_do(itemstack_tsid, amount);
	if (!ret['ok']){
		return ret;
	}
	
	
	//
	// Tell the other player
	//
	
	target.apiSendMsgAsIs({
		type: 'trade_remove_item',
		tsid: this.tsid,
		itemstack_class: ret.item_class,
		amount: amount,
		slot: ret.slot,
		label: ret.label
	});
	
	return {
		ok: 1
	};
}

function trading_remove_item_do(itemstack_tsid, amount){
	var escrow = this.trading_get_escrow_bag();
	if (escrow.items[itemstack_tsid]){
		var slot = escrow.items[itemstack_tsid].slot;
		var item = escrow.removeItemStackTsid(itemstack_tsid, amount);
		//log.info('trading_remove_item_do slot is '+slot);
	}
	else{
		return {
			ok: 0,
			error: "That item is not in your escrow storage."
		};
	}
	
	if (item.count != amount){
		this.items_put_back(item);
		return {
			ok: 0,
			error: "You don't have enough of that item in escrow."
		};
	}
	
	var item_class = item.class_tsid;
	var item_label = item.label;
	
	var remaining = this.addItemStack(item);
	if (remaining){
		var restore = this.removeItemStackClass(item.class_tsid, remaining);
		this.items_put_back(item);
		
		escrow.addItemStack(restore);
		return {
			ok: 0,
			error: "Oops! We couldn't place that item in your pack."
		};
	}
	
	
	//
	// Do we need to move everything around?
	//
	
	this.trading_reorder_escrow();
	
	return {
		ok: 1,
		item_class: item_class,
		slot: intval(slot),
		label: item_label
	};
}

//
// Move items around in the escrow bag in order to keep things in sequential slots
//

function trading_reorder_escrow(){
	var escrow = this.trading_get_escrow_bag();
	if (escrow.countContents()){
		var escrow_contents = escrow.getContents();
		for (var slot in escrow_contents){
			if (!escrow_contents[slot]){
				for (var i=intval(slot); i<escrow.capacity; i++){
					if (escrow_contents[i+1]){
						escrow.addItemStack(escrow.removeItemStackSlot(i+1), i);
					}
				}
				
				break;
			}
		}
	}
}

//
// Change the amount of an item to trage
//

function trading_change_item(target_tsid, itemstack_tsid, amount){
	//log.info(this.tsid+' changing item '+itemstack_tsid+' to trade with '+target_tsid+' ('+amount+')');
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	//
	// Adjust counts
	//
	
	delete this['!trade_accepted'];
	delete target['!trade_accepted'];
	
	var escrow = this.trading_get_escrow_bag();
	var contents = escrow.getAllContents();
	var item = contents[itemstack_tsid];
	if (!item){
		return {
			ok: 0,
			error: "That item is not in your escrow storage."
		};
	}
	
	//log.info('trading_change_item '+item.count+' != '+amount);
	if (item.count != amount){
		if (item.count < amount){
			// We need an item from the pack to move
			var pack_item = this.findFirst(item.class_id);
			if (!pack_item){
				return {
					ok: 0,
					error: "You don't have any more of that item."
				};
			}
			//log.info('pack_item: '+pack_item.tsid);
			//log.info('Adding '+(amount-item.count));
			var ret = this.trading_add_item_do(pack_item.tsid, amount-item.count, item.slot);
			amount = ret.count;
		}
		else{
			//log.info('Removing '+(item.count-amount));
			var ret = this.trading_remove_item_do(itemstack_tsid, item.count-amount);
		}
		
		if (!ret['ok']){
			return ret;
		}
	
		//
		// Tell the other player
		//
	
		if (ret.item_class){
			//log.info('trade_change_item ---------------------- slot '+ret.slot+' = '+amount);
			target.apiSendMsgAsIs({
				type: 'trade_change_item',
				tsid: this.tsid,
				itemstack_class: ret.item_class,
				amount: amount,
				slot: ret.slot,
				label: ret.label,
				config: ret.config
			});
		}
	}
	
	return {
		ok: 1
	};
}

//
// Update the currants on the trade
//

function trading_update_currants(target_tsid, amount){
	//log.info(this.tsid+' updating currants to '+amount+' on trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	
	//
	// Put the currants in escrow
	//
	
	delete this['!trade_accepted'];
	delete target['!trade_accepted'];
	var amount_diff = amount - this.trading.currants;
	
	//log.info('Currants diff of '+amount+' - '+this.trading.currants+' is '+amount_diff);
	//log.info('Player currently has: '+this.stats.currants.value);
	if (amount_diff != 0){
		if (amount_diff < 0){
			//log.info('Restoring '+Math.abs(amount_diff));
			this.stats_add_currants(Math.abs(amount_diff));
		}
		else{
			if (!this.stats_try_remove_currants(amount_diff, {type: 'trading', target: target_tsid})){
				return {
					ok: 0,
					error: "You don't have enough currants for that."
				};
			}
		}
	
		this.trading.currants = amount;
	
	
		//
		// Tell the other player
		//
	
		target.apiSendMsgAsIs({
			type: 'trade_currants',
			tsid: this.tsid,
			amount: this.trading.currants
		});
	}
	
	return {
		ok: 1
	};
}

//
// Accept the trade
//

function trading_accept(target_tsid){
	//log.info(this.tsid+' accepting trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	this['!trade_accepted'] = true;
	
	//
	// Tell the other player
	//

	target.apiSendMsgAsIs({
		type: 'trade_accept',
		tsid: this.tsid
	});
	
	
	//
	// If both sides have accepted, then do it
	//
	
	if (target['!trade_accepted']){
		var ret = this.trading_complete(target_tsid);
		if (!ret['ok']){
			return ret;
		}
	}
	
	return {
		ok: 1
	};
}

//
// Unlock the trade
//

function trading_unlock(target_tsid){
	//log.info(this.tsid+' unlocking trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	delete this['!trade_accepted'];
	
	//
	// Tell the other player
	//

	target.apiSendMsgAsIs({
		type: 'trade_unlock',
		tsid: this.tsid
	});
	
	return {
		ok: 1
	};
}

//
// Complete the trade
//

function trading_complete(target_tsid){
	//log.info(this.tsid+' completing trade with '+target_tsid);
	//
	// Sanity check
	//
	
	if (!this['!is_trading'] || this['!is_trading'] != target_tsid){
		return {
			ok: 0,
			error: 'You are not trading with that player.'
		};
	}
	
	var target = getPlayer(target_tsid);
	if (!apiIsPlayerOnline(target_tsid)){
		return {
			ok: 0,
			error: 'That player is not online.'
		};
	}
	
	
	//
	// Have both sides accepted?
	//
	
	if (!this['!trade_accepted']){
		return {
			ok: 0,
			error: 'You have not accepted this trade.'
		};
	}
	
	if (!target['!trade_accepted']){
		return {
			ok: 0,
			error: 'That player has not accepted this trade.'
		};
	}
	
	
	//
	// Perform the transfer
	//
	
	this.trading_transfer(target_tsid);
	target.trading_transfer(this.tsid);

	
	//
	// Overlays
	//
	
	this.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: this.tsid+'_trading'
	}, this);
	target.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: target.tsid+'_trading'
	}, target);
	
	
	//
	// Tell both players that we are done
	//

	this.apiSendMsgAsIs({
		type: 'trade_complete',
		tsid: target_tsid
	});
	
	target.apiSendMsgAsIs({
		type: 'trade_complete',
		tsid: this.tsid
	});
	
	
	//
	// Cleanup and exit
	//
	
	delete this['!is_trading'];
	delete target['!is_trading'];
	delete this['!trade_accepted'];
	delete target['!trade_accepted'];
	
	return {
		ok: 1
	};
}

//
// Transfer items/currants from escrow to target_tsid.
// If something goes wrong, oh well!
//

function trading_transfer(target_tsid){
	
	var target = getPlayer(target_tsid);
	
	//
	// Items!
	//

	var traded_something = false;

	var escrow = this.trading_get_escrow_bag();
	if (escrow){
		var contents = escrow.getContents();
		
		var overflow = false;
		for (var i in contents){
			if (contents[i]){
				var item = escrow.removeItemStackSlot(i);

				// Item callback
				if (item.onTrade) item.onTrade(this, target);
				
				var remaining = target.addItemStack(item);
				if (remaining){
					var target_escrow = target.trading_get_escrow_bag();
					target_escrow.addItemStack(item);
					
					overflow = true;
				}

				traded_something = true;
			}
		}
		
		if (overflow){
			target.prompts_add({
				txt		: "Some of the items you received in your trade with "+this.label+" did not fit in your pack. Your magic rock will hold them for you until you make room, and you cannot start another trade until you do so.",
				icon_buttons	: false,
				timeout		: 30,
				choices		: [
					{ value : 'ok', label : 'Very well' }
				]
			});
		}
	}


	//
	// Currants!
	//
	
	if (this.trading.currants){
		target.stats_add_currants(this.trading.currants, {'trade':this.tsid});
		this.trading.currants = 0;
		traded_something = true;
	}

	if (traded_something){
		//
		// Achievements
		//
		
		this.achievements_increment('players_traded', target_tsid);
		target.achievements_increment('players_traded', this.tsid);
	}
}