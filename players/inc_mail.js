function mail_init(){
	if (this.mail === undefined || this.mail === null){
		this.mail = apiNewOwnedDC(this);
		this.mail.label = 'Mail';
		
		this.mail.inbox = {};
		
		this.mail_create_bag();
	}
}

function mail_create_bag(){
	// Create a new private storage bag for holding mail items
	var it = apiNewItemStack('bag_private', 1);
	it.label = 'Private Mail Storage';

	this.apiAddHiddenStack(it);

	this.mail.storage_tsid = it.tsid;
}

function mail_get_bag(){
	return this.hiddenItems[this.mail.storage_tsid];
}

function mail_can_send(stack){
	if (stack.is_bag && stack.countContents()) return false;
	return true;
}

function mail_has_items(){
	var bag = this.mail_get_bag();
	
	return bag.countContents() > 0 ? true : false;
}

function mail_has_messages(){
	return this.mail_count_messages() > 0 ? true : false;
}

function mail_get_bag_contents() {
	var contents = [];

	if(!this.mail) {
		return contents;
	}
	
	var bag = this.mail_get_bag();
	if(bag) {
		var visible_contents = bag.getAllContents();
		for(var i in visible_contents) {
			contents.push(visible_contents[i]);
		}
		
		for (var i in bag.hiddenItems) {
			contents.push(bag.hiddenItems[i]);
		}

		return contents;
	}
}

function mail_count_uncollected_auctions() {
	var n_items = 0;
	
	if (!this.mail) {
		return false;
	}
	
	var bag = this.mail_get_bag();
	if(bag) {
		var visible_contents = bag.getAllContents();
		for(var i in visible_contents) {
			var it = visible_contents[i];
			if (it) {
				var deets = it.getDeliveryPacket();
				if (deets && deets.auction_uid) {
					n_items++;
				}
			}
		}
		
		for (var i in bag.hiddenItems) {
			var it = bag.hiddenItems[i];
			if (it) {
				var deets = it.getDeliveryPacket();
				if (deets && deets.auction_uid) {
					n_items++;
				}
			}
		}

		return n_items;
	}
}

function mail_liquidate_all_auctions(do_it) {
	var total = 0;
	if (!this.mail) {
		return false;
	}
	
	var bag = this.mail_get_bag();
	if(bag) {
		var visible_contents = bag.getAllContents();
		for(var i in visible_contents) {
			var it = visible_contents[i];
			if (it) {
				var deets = it.getDeliveryPacket();
				if (deets && deets.auction_uid) {
					total += intval(it.getBaseCost() * it.count * 0.8);
					if (do_it) {
						log.info("Liquidating auction "+it+" for player "+this+" for "+intval(it.getBaseCost()*it.count * 0.8)+" currants.");
						it.apiDelete();
					} else {
						log.info("Auction found for "+it+" for player "+this+" for "+intval(it.getBaseCost()*it.count * 0.8)+" currants.");
						
					}
				}
			}
		}
		
		for (var i in bag.hiddenItems) {
			var it = bag.hiddenItems[i];
			if (it) {
				var deets = it.getDeliveryPacket();
				if (deets && deets.auction_uid) {
					total += intval(it.getBaseCost() * it.count * 0.8);
					if (do_it) {
						log.info("Liquidating auction "+it+" for player "+this+" for "+intval(it.getBaseCost()*it.count * 0.8)+" currants.");
						it.apiDelete();
					} else {
						log.info("Auction found for "+it+" for player "+this+" for "+intval(it.getBaseCost()*it.count * 0.8)+" currants.");
						
					}
				}
			}
		}
		
		if(do_it) {
			log.info("Liquidated auctions worth "+total+" for player "+this);
			this.stats_add_currants(total);
		} else {
			log.info("Found auctions totalling "+total+" for player "+this);
		}
	}
}

function mail_has_unread() {
	if(!this.mail) {
		this.mail_init();
		return false;
	}
	
	for(var i in this.mail.inbox) {
		var sender_pc = getPlayer(this.mail.inbox[i].sender_tsid);
		
		if (this.mail.inbox[i].is_read == false && this.mail.inbox[i].delivery_time < time() && (!sender_pc || !this.buddies_is_ignoring(sender_pc))) {
			return true;
		}
	}
	
	return false;
}

function mail_count_messages(){
	var n_msgs = 0;
	
	if(!this.mail) {
		return 0;
	}
	for(var i in this.mail.inbox) {
		var sender_pc = getPlayer(this.mail.inbox[i].sender_tsid);
		
		if(this.mail.inbox[i].delivery_time < time() && (!sender_pc || !this.buddies_is_ignoring(sender_pc))) {
			n_msgs++;
		}
	}
	
	return n_msgs;
}

function mail_count_unread(){
	var n_msgs = 0;
	
	if(!this.mail) {
		return 0;
	}
	for(var i in this.mail.inbox) {
		if (this.mail.inbox[i].is_read == false && this.mail.inbox[i].delivery_time < time()) {
			n_msgs++;
		}
	}
	
	return n_msgs;
}

function mail_count_replied(){

	if (!this.mail) return 0;

	var num = 0;
	for (var i in this.mail.inbox){
		if (this.mail.inbox[i].replied) num++;
	}

	return num;
}

function mail_can_receive(from){
	if (this.buddies_is_ignored_by(from) || this.buddies_is_ignoring(from)){
		return false;
	}
	
	return true;
}

function mail_reset() {
	if (this.mail){
		
		// Empty bag
		var bag = this.mail_get_bag();
		if (bag){
			var contents = bag.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
		}
		
		// go through messages and remove attachments
		for(var i in this.mail.inbox) {
			this.mail.inbox[i].items = [];
			this.mail.inbox[i].currants = 0;
			
			// Clean spam messages
			if(this.mail.inbox[i].text) {
				if(this.mail.inbox[i].text.search("I am crown prince of Shimla Mirch who has run up against the serious problem of finances.") >= 0 ||
					this.mail.inbox[i].text.search("CHEAP RX AVAILABLE NOW") >= 0 ||
					this.mail.inbox[i].text.search("Now is an excellent time to enter the real estate market! Real estate is doing better than ever") >= 0) {
					delete this.mail.inbox[i];
				}
			}
		}

		delete this.mail.special_items;
		delete this.mail.spam;
	}

	delete this.delivery_type;
	delete this.next_delivery;
	delete this.frogVisiting;
	delete this.delivery_order;
}

function mail_delete(){
	if (this.mail){
		var bag = this.mail_get_bag();
		if (bag){
			var contents = bag.getContents();
			for (var i in contents){
				if (contents[i]) contents[i].apiDelete();
			}
			
			bag.apiDelete();
			delete this.mail.storage_tsid;
		}
	
		this.mail.apiDelete();
		delete this.mail;
	}

	delete this.delivery_type;
	delete this.next_delivery;
	delete this.do_not_disturb;
	delete this.frogVisiting;
	delete this.delivery_order;
}

function reschedule_mail() {
	this.apiCancelTimer('deliver_mail');
	this.apiSetTimer('deliver_mail', 3*60*1000);
	this.next_delivery = time() + 3 * 60;
}

function has_frog_already() {
	// Find out if a frog is here, here for this player and not done delivering.
	var allFrogs = this.location.find_items('npc_yoga_frog');
	var frogVisiting = false;
	for(var i = 0; i < allFrogs.length; ++i) {
		if(allFrogs[i].isDeliveringTo(this) && allFrogs[i].mailType == this.delivery_type) {
			log.error("Frog called for "+this+", but one is already visiting!");
			return true;
		}
	}
	
	return false;
}

function deliver_mail() {
	// If the player is offline, cancel. It will be sent to mailbox on log-in
	if(!this.isOnline()) {
		return;
	}
	
	// If the player is in an instance or in hell, reschedule
	if(this.location.isInstance() || this.location.isInHell() || this.doNotDisturb()) {
		log.error("Player "+this+" had a mail delivery, but is in a undeliverable location!");
		this.reschedule_mail();
		return;
	}
	
	if(this.has_frog_already() || this['!has_frog_prompt'] || !this.mail_has_deliveries(this.delivery_type)) {
		return;
	}
	
	this['!has_frog_prompt'] = true;
	
	this.prompts_add({
		txt: "Special delivery! A package has arrived for you.",
		prompt_callback: 'answer_mail_prompt',
		is_modal: true,
		choices: [{
			value: "ok",
			label: "OK"
		}]});
}

function answer_mail_prompt() {
	if(this['!has_frog_prompt']) {
		delete this['!has_frog_prompt'];
	}
	var offset = choose_one([-500, 500]);
	
	var frog = this.location.createItemStack('npc_yoga_frog', 1, this.x + offset, this.y - 400);
	if(this.delivery_type == 'courier') {
		frog.setInstanceProp('variant', 'frogBlue');
	} else {
		frog.setInstanceProp('variant', 'frogRed');
	}
	
	frog.setDelivery(this.tsid, this.delivery_type);
	this.frogVisiting = true;
}

function mail_has_deliveries(mailType) {
	if(!this.mail) {
		return false;
	}
	
	if(mailType == 'auction') {
		// Go through auction items to see if any are deliverable
		var contents = this.mail_get_bag_contents();
		
		for(var i in contents) {
			var deets = contents[i].getDeliveryPacket();
			if(!deets) {
				continue;
			}
			
			if(deets.delivery_time <= time() + 60 && deets.mailType == 'auction') {
				return true;
			}
		}
	} else if(mailType == 'courier') {
		for(var i in this.mail.inbox) {
			if(this.mail.inbox[i].delivery_time <= time() + 60 && !this.mail.inbox[i].in_mailbox) {
				return true;
			}
		}
	}
	
	return false;
}

function mail_count_auction_items() {
	var item_count = 0;
	
	if (this.mail) {
		var contents = this.mail_get_bag_contents();
		
		for(var i in contents) {
			var stack = contents[i];
			
			var deets = stack.getDeliveryPacket();

			if(deets.mailType == 'auction' && deets.delivery_time <= time() + 60) {
				item_count++;
			}
		}
	}
	
	log.info("Player "+this+" counted "+item_count+" auction items.");
	return item_count;
}

function mail_test_mail(num) {
	for (var i = 1; i <= num; i++) {
		this.mail_add_player_delivery(null, null, 0, "Message "+i, config.mail_delivery_time, true, null);
	}
}

function mail_test_auctions(num) {
	if (!this.mail) {
		return;
	}
	
	var bag = this.mail_get_bag();
	if(!bag) {
		return;
	}
	
	var item_list = ['milk_butterfly', 'butterfly_butter', 'apple', 'orange', 'cherry', 'butterfly_egg', 'all_spice', 'pinch_of_salt', 'crabphones', 'pig_bait', 'plain_metal', 'emblem_grendaline'];
	
	for(var i = 0; i < num; i++) {
		for(var j in item_list) {
			var s = apiNewItemStack(item_list[j], 1);
			var slot = bag.firstEmptySlot();
			bag.addItemStack(s, slot);
			
			this.mail_add_auction_delivery(s.tsid, 30, 0, this.tsid);
		}
	}
}

function mail_build_auction_rewards(start, end) {
	var rewards = {};
	rewards.items = [];
	rewards.describe = '';
	var reward_types = {};

	// Find pending items in the bag
	if (this.mail) {
		var contents = this.mail_get_bag_contents();
		var count = 0;
		
		for(var i in contents) {
			var stack = contents[i];
			
			var deets = stack.getDeliveryPacket();

			if(deets.mailType == 'auction' && deets.delivery_time <= time() + 60) {
				if(count >= start) {
					rewards.items.push(stack.makeRewards());
					if (reward_types[deets.auction_action]){
						reward_types[deets.auction_action]++;
					} else {
						reward_types[deets.auction_action] = 1;
					}
				}
				count++;
				if(count >= end) {
					break;
				}
			}
		}
	}

	var type_count = num_keys(reward_types);
	var c = 1;

	for (var j in reward_types){
		if (c == type_count && type_count > 1){
			rewards.describe += ' and ';
		} else if (c > 1){
			rewards.describe += ', ';
		}
		if (type_count > 1 || reward_types[j] > 1){
			rewards.describe += reward_types[j]+' '+j;
		} else {
			rewards.describe += j;
		}
		c++;
	}

	return rewards;
}

function mail_build_message_rewards(msg_id) {
	var rewards = {};
	rewards.items = [];
	
	// Find pending items in the bag
	if (this.mail) {
		var contents = this.mail_get_bag_contents();
			
		for(var i in contents) {
			var stack = contents[i];
			
			var deets = stack.getDeliveryPacket();

			if(deets.mailType == 'courier' && deets.msg_id == msg_id) {
				rewards.items.push(stack.makeRewards());
			}
		}
		
		// Also check out currants
		var currants = this.mail.inbox[msg_id].currants;
		if(currants) {
			rewards.currants = currants;
		}
	}
	
	// Don't return empty rewards. There might not be any!
	if(rewards.items.length != 0 || rewards.currants) {
		return rewards;
	}
}

function mail_get_next_player_message(checkFuture) {
	if (this.mail) {
		var next_message = -1;
		var next_time = -1;

		if(!this.mail.inbox) {
			return;
		}

		for(var i in this.mail.inbox) {
			if((next_time == -1 || this.mail.inbox[i].delivery_time < next_time) && !this.mail.inbox[i].in_mailbox) {
				next_time = this.mail.inbox[i].delivery_time;
				next_message = i;
			}
		}

		// Look 60 seconds into the future!
		if(next_message != -1 && (next_time < time() + 60 || checkFuture)) {
			return next_message;
		}
	}
}

function mail_get_player_message_data(msg_id) {
	if (this.mail) {
		return this.mail.inbox[msg_id];
	}
}

function mail_get_player_reply(reply_to) {
	if (!this.mail || !this.mail.inbox[reply_to]) {
		return;
	}
	
	reply_to = intval(reply_to);
	
	var reply = {message_id: reply_to,
		received: this.mail.inbox[reply_to].delivery_time,
		replied: this.mail.inbox[reply_to].replied,
		text: this.mail.inbox[reply_to].text,
		sender_tsid: this.mail.inbox[reply_to].sender_tsid};
	var current_reply = reply;
	// Walk reply list and add them in
	for(var next_reply = this.mail.inbox[reply_to].in_reply_to; next_reply; next_reply = next_reply.in_reply_to) {
		current_reply.in_reply_to = {message_id: next_reply.message_id,
			received: next_reply.received,
			replied: next_reply.replied,
			text: next_reply.text,
			sender_tsid: next_reply.sender_tsid};
		current_reply = current_reply.in_reply_to;
	}
	this.mail.inbox[reply_to].replied = time();
	
	return reply;
}

function mail_remove_player_message(msg_id) {
	if (this.mail && this.mail.inbox[msg_id]) {
		// delete message data first
		delete this.mail.inbox[msg_id];
		
		// delete any accompanying items
		var contents = this.mail_get_bag_contents();
		
		for (var i in contents) {
			var stack = contents[i];
			var deets = stack.getDeliveryPacket();
			if(deets.msg_id == msg_id) {
				stack.apiDelete();
			}
		}
	}
}

function mail_receive_message_items(msg_id) {
	log.info(this+" receiving mail item from message "+msg_id);
	return this.get_mail_items('courier', msg_id);
}

function mail_read(msg_id, is_read) {
	if(!this.mail || !this.mail.inbox[msg_id]) {
		return;
	}
	
	var was_read = this.mail.inbox[msg_id].is_read;

	this.mail.inbox[msg_id].is_read = is_read;

	if (was_read != is_read) {
		// send callback to www so it can update unread count on mobile
		utils.http_get('callbacks/mail_read.php', {
			'player_tsid' : this.tsid,
			'unread': this.mail_count_unread(),
			'msg_id': msg_id
		});
	}
}

function mail_archive_message(msg_id){

	if (this.mail.inbox[msg_id].items.__count || this.mail.inbox[msg_id].currants) return false;

	utils.http_get('callbacks/mail_archive.php', {
		'player_tsid' : this.tsid,
		'msg_id': msg_id
	});

	if (this.isOnline()) {
		// send message to player. we'll do this within the mailbox once we get client support
		// but for now, just growl it.
		this.sendActivity('Your mail message has been moved to the archives!');
	}
}

function mail_dispatch_start(station_tsid) {
	this.apiSendMsg({'type': 'mail_start', 'station_tsid': station_tsid, 'regular_cost': 20, 'expedited_cost': 100});
}

// Returns the number of items remaining on the message
function get_message_goodies(msg_id, no_prompts) {
	// First receive currants, and pull them off the message, in case we can't deliver
	if (this.mail) {
		if(this.mail.inbox[msg_id] && this.mail.inbox[msg_id].currants) {
			this.stats_add_currants(this.mail.inbox[msg_id].currants, {'mail':msg_id});
			this.mail.inbox[msg_id].currants = 0;
		}
	} else {
		// Something is broken.
		return;
	}
	
	// REMOVEME: if we have an item on this message, try fixing in case it is broken.
	if(this.mail.inbox[msg_id].items) {
		for (var i in this.mail.inbox[msg_id].items) {
			var stack = apiFindObject(this.mail.inbox[msg_id].items[i]);
			if(stack) {
				log.info("Running mail item recovery on item "+stack);
				if(!stack.apiRecoverAndReturnToContainer()) {
					// If this fails once, it should at least load it from the GS, so the second call should succeed.
					// May be a problem if the item and container are on separate GSs.
					stack.apiRecoverAndReturnToContainer();
				}
			}
		}
	}
	
	// Receive any items from the message
	var unsent = this.mail_receive_message_items(msg_id);
	
	if(unsent && !no_prompts) {
		// prompt that we could not receive items
		this.prompts_add({
			txt		: "You cannot receive your items because your bag is full. You will need to free up space in your bag first.",
			timeout		: 10,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
	
	return unsent;
}

function get_player_message(msg_id) {

	var items_remaining = this.get_message_goodies(msg_id);
	
	// Couldn't deliver items
	if(items_remaining) {
		return items_remaining;
	} else {
		// No longer trash the message. Now mark it as read and expedited, and move it to the mailbox.
		this.send_express_to_inbox(msg_id);
	}
}

function new_inbox_growl() {
	if(!this.mail) {
		return;
	}

	this.sendActivity("You have new messages in your mailbox!");
	
	// And tell any mailboxes in our area to update!
	if(this.location) {
		var boxes = this.location.find_items('npc_mailbox');
		for(var i = 0; i < boxes.length; ++i) {
			boxes[i].doIdle(this);
		}
	}

	// Mark all messages pending in the next five seconds as notified
	for(var i in this.mail.inbox) {
		var mail_item = this.mail.inbox[i];
		if(mail_item.delivery_time < time() + 5 && !mail_item.notification_sent) {
			mail_item.notification_sent = true;
		}
	}
	
	// And reschedule (if necessary)
	this.schedule_inbox_growl();
}

function fix_broken_mail_item(stack) {
	var deets = stack.getDeliveryPacket();
	if(deets.waiting_to_be_sent) {
		// Not broken, just waiting to be sent out. Issue a warning in case this is stuck somehow.
		log.error("mail item "+stack+" is waiting for delivery on another player and may or may not be stuck.");
		return;
	}
	
	this.sendActivity("Oops, there was a problem with one of your deliveries. The item has been placed in your mailbox!");
	log.error("Player "+this+" has broken delivery item "+stack+".");
	this.send_auction_to_inbox(stack);
}

function send_auction_to_inbox(stack) {
	var deets = stack.getDeliveryPacket();
	var broken = false;
	
	if(!this.mail) {
		return;
	}
	
	if(!deets || !deets.mailType) {
		if(!deets) {
			log.error("Error sending auction to inbox: item has no delivery packet. Item: "+stack+", Player: "+this+".");
		} else {
			log.error("Error sending auction to inbox: item is missing critical delivery information. Item: "+stack+", Player: "+this+".");
		}
		deets = {delivery_time: time()};
		stack.addDeliveryPacket(deets);
		
		broken = true;
	}
	
	if(!this.mail.next_msg_id) {
		this.mail.next_msg_id = 0;
	}
	
	// For the sake of some previous production errors, make absolutely sure we don't overwrite existing mail.
	while(this.mail.inbox[this.mail.next_msg_id]) {
		this.mail.next_msg_id++;
	}
	
	// Switch item over to message
	deets.in_mailbox = true;
	deets.mailType = 'courier';
	deets.msg_id = this.mail.next_msg_id;
	
	// And add message for this item
	if(broken) {
		var newMsg = {sender_tsid: null, currants:0, text:"There was a problem delivering this item, but we rescued it for you! This is a known issue, and we are working on it. Sorry for the inconvenience!",
			items: [stack.tsid], in_mailbox:true, is_read:false, notification_sent:false, delivery_time: deets.delivery_time};
	} else {
		var thing_type = 'auction purchase';
		if (deets.auction_action == 'cancelled'){
			thing_type = 'cancelled auction';
		} else if (deets.auction_action == 'expired'){
			thing_type = 'expired auction';
		}
		var newMsg = {sender_tsid: deets.sender_tsid, currants:0, text:"Your "+thing_type+", courtesy of the Auction Fulfillment and Logistics Corporation.",
			items: [stack.tsid], in_mailbox:true, is_read:false, notification_sent:false, delivery_time: deets.delivery_time, is_auction: 1};
	}
	this.mail.inbox[this.mail.next_msg_id] = newMsg;
	
	this.mail.next_msg_id++;
}

function send_unsent_auctions_to_inbox() {
	var num_sent = 0;
	
	if(!this.mail) {
		return;
	}
	
	var contents = this.mail_get_bag_contents();
	
	for(var i in contents) {
		var it = contents[i];
		var deets = it.getDeliveryPacket();
		if(!deets) {
			continue;
		}
		
		if(deets.delivery_time <= time() && deets.mailType == 'auction') {
			this.send_auction_to_inbox(it);
			num_sent++;
		}
	}
	
	if(num_sent) {
		if (deets.auction_action == 'cancelled'){
			this.sendActivity("Your cancelled auctions arrived while you were out. All items have been placed in your mailbox for convenient pickup.");
		} else if (deets.auction_action == 'expired'){
			this.sendActivity("Your expired auctions arrived while you were out. All items have been placed in your mailbox for convenient pickup.");
		} else {
			this.sendActivity("Your purchased auctions arrived while you were out. All items have been placed in your mailbox for convenient pickup.");
		}
	}
	
	return num_sent;
}

function send_unsent_player_mail_to_inbox() {
	var num_sent = 0;
	if(!this.mail) {
		return;
	}

	// Check out all messages, and if they're ready, forward them to the inbox
	for(var i in this.mail.inbox) {
		if(this.mail.inbox[i].delivery_time < time() && !this.mail.inbox[i].in_mailbox) {
			this.mail.inbox[i].in_mailbox = true;
			this.mail.inbox[i].notification_sent = false;
			this.mail.inbox[i].is_expedited = true;
			num_sent++;
		}
	}
	
	return num_sent;
}

function send_express_to_inbox(msg_id) {
	if(!this.mail) {
		return;
	}

	if(this.mail.inbox[msg_id].delivery_time < time() && !this.mail.inbox[msg_id].in_mailbox) {
		this.mail.inbox[msg_id].in_mailbox = true;
		this.mail.inbox[msg_id].notification_sent = true;
		this.mail.inbox[msg_id].is_expedited = true;
		this.mail.inbox[msg_id].is_read = true;
	}
}

function send_unsent_mail_to_inbox() {
	var num_sent = 0;
	if(!this.mail) {
		return;
	}
	
	num_sent += this.send_unsent_player_mail_to_inbox();
	num_sent += this.send_unsent_auctions_to_inbox();
	
	// Cancel and reschedule delivery
	this.mail_cancel_deliveries();
	this.schedule_next_delivery();
	
	// Do a growl if we have sent items
	if(num_sent) {
		this.schedule_inbox_growl();
	}
}

function schedule_inbox_growl() {
	var next_notification = -1;
	
	// Check and see if we have any messages in our inbox that haven't sent out a notification yet.
	if(!this.mail) {
		return;
	}
	
	for(var i in this.mail.inbox) {
		var mail_item = this.mail.inbox[i];
		if((mail_item.delivery_time < next_notification || next_notification == -1) && 
				mail_item.in_mailbox && !mail_item.notification_sent) {
			if (isNaN(mail_item.delivery_time) || !mail_item.delivery_time){
				log.info('MAIL PROBLEM: message '+i+' for player '+this.tsid+' had bad delivery time of '+mail_item.delivery_time+'. fixing...');
				this.mail.inbox[i].delivery_time = time();
			}
			next_notification = mail_item.delivery_time;
		}
	}
	
	if(next_notification != -1) {
		this.apiCancelTimer('new_inbox_growl');
		if(next_notification < time()) {
			this.new_inbox_growl();
		} else {
			this.apiSetTimer('new_inbox_growl', (next_notification - time()) * 1000);
		}
	}
}

function schedule_next_delivery() {
	var next_delivery = -1;
	var next_delivery_type = 'auction';

	// if we already have a frog delivering, don't schedule mail yet
	if(this.has_frog_already() || !this.isOnline()) {
		return;
	}
	
	// Find pending items in the bag
	if (this.mail) {
		var contents = this.mail_get_bag_contents();

		for(var i in contents) {
			var stack = contents[i];
			
			var deets = stack.getDeliveryPacket();

			
			// Don't double count messages: items attached to messages may actually be in the inbox.
			if(deets && deets.delivery_time && (deets.delivery_time < next_delivery || next_delivery == -1) && typeof deets.msg_id == 'undefined' ){
				next_delivery = deets.delivery_time;
				next_delivery_type = deets.mailType;
			} else if(!deets || (deets && deets.msg_id && !this.mail.inbox[deets.msg_id])) {
				// This is a problem, we have a broken item!
				this.fix_broken_mail_item(stack);
			}
		}
		
		// Also check messages in the bag
		var msg = this.mail_get_next_player_message(true);
		if(typeof msg != "undefined") {
			var nextMsgTime = this.mail.inbox[msg].delivery_time;
			if((nextMsgTime < next_delivery || next_delivery == -1) && !this.mail.inbox[msg].in_mailbox) {
				next_delivery = nextMsgTime;
				next_delivery_type = 'courier';
			}
		}

		// If items are pending, schedule a delivery
		if(next_delivery > -1) {
			log.info("Pending items found for "+this+". Scheduling next delivery for "+next_delivery+".");
			if(next_delivery - time() < 30) {
				next_delivery = time() + 30;
			}
			
			// Do we already have a delivery scheduled that hasn't happened yet, but is sooner than this? If so, skip.
			if(this.next_delivery > time() && this.next_delivery < next_delivery) {
				return;
			}
			
			// Otherwise, set up the delivery!
			this.apiCancelTimer('deliver_mail');
			this.apiSetTimer('deliver_mail', (next_delivery - time()) * 1000);
			this.delivery_type = next_delivery_type;
			this.next_delivery = next_delivery;

		}
	}
}

function get_auction_mail() {
	return this.get_mail_items('auction', null);
}

function get_mail_items(mailType, msg_id) {
	var undelivered = 0;
	
	var mailItems = [];
	
	// Find pending items in the bag
	if (this.mail) {
		var bag = this.mail_get_bag();
		if(!bag) {
			return;
		}
		
		var contents = this.mail_get_bag_contents();
			
		for(var i in contents) {
			var stack = contents[i];
			if(!stack) {
				continue;
			}
			
			var deets = stack.getDeliveryPacket();
			
			if(!deets) {
				// No delivery packet. Big problem!
				this.fix_broken_mail_item(stack);
				continue;
			}

			// Look ahead 60 seconds into the future to prevent annoying sequential deliveries
			if(deets.delivery_time <= time() + 60 && deets.mailType == mailType && (deets.msg_id == msg_id || msg_id == null)) {

				// Remove items from hidden bag and give to player
				if(this.canFitEntireStack(stack)) {
					if(!this.apiLockStack(stack.path)) {
						log.error("Failed to acquire lock on mail item "+stack+" for player "+this+" mail.");
					}
					if (stack.onFrogDelivery) stack.onFrogDelivery(this);
					if(stack.getProp('count') == 1) {
						if (stack.has_parent('furniture_base')){
							var label = stack.getLabel();
							if (label != stack.label){
								mailItems.push(stack.article + ' ' + stack.name_single + ' (' + label + ')');
							} else {
								mailItems.push(stack.article + ' ' + stack.name_single);
							}
						} else {
							mailItems.push(stack.article + ' ' + stack.name_single);
						}

					} else {
						mailItems.push(stack.getProp('count') + ' ' + stack.name_plural);
					}
					stack.removeDeliveryPacket();
					
					// If we have a msg_id, remove this item from the msg_id
					if(msg_id != null) {
						for(var i in this.mail.inbox[msg_id].items) {
							if(this.mail.inbox[msg_id].items[i] == stack.tsid) {
								this.mail.inbox[msg_id].items.splice(i, 1);
							}
						}
					}

					// This MUST come last, because if there's a half-complete stack of this
					// item with enough capacity, it might swallow the stack and delete it
					// from the GS.
					if(this.addItemStack(stack)) {
						// Failure for some reason.
						log.error("Adding mail item "+stack+" to "+this+" failed horribly.");
						if(stack) {
							this.fix_broken_mail_item(stack);
						}
					} else {
						log.info("Mail: item "+i+" added onto player "+this.tsid+".");
					}
				} else {
					// couldn't store item.
					undelivered++;
				}
			} 
		}
					
		if(mailItems.length == 1) {
			this.sendActivity("Mail time! You got "+mailItems[0]+'.');
		} else if (mailItems.length > 1) {
			var mailString = '';
			for(var i = 0; i < mailItems.length; ++i) {
				if(i == mailItems.length - 1) {
					mailString += "and "+mailItems[i]+".";
				} else {
					mailString += mailItems[i]+", ";
				}
			}
			
			this.sendActivity("Mail time! You got "+mailString);
		}
	}
	
	return undelivered;
}

function mail_has_spam(spam_id) {
	if(!this.mail || ! this.mail.spam || !this.mail.spam[spam_id]) {
		return false;
	}
	
	return true;
}

function mail_send_player_spam(sender_tsid, spam_text, spam_id) {
	if (!this.mail) {
		this.mail_init();
	}
	
	if(!this.mail.spam) {
		this.mail.spam = {};
	}
	if(this.mail.spam[spam_id]) {
		return;
	} else {
		this.mail.spam[spam_id] = 1;
	}
	
	this.mail_add_player_delivery(null, sender_tsid, 0, spam_text, 10, true);
}

function mail_add_player_delivery_delayed(itemstack_tsid, sender_tsid, currants, text, delay, to_mailbox, in_reply_to, add_delay) {
	if(config.is_dev) {
		delay = 60;
	}
	
	if (!this.mail) {
		this.mail_init();
	}

	var new_mail = {itemstack_tsid: itemstack_tsid, sender_tsid: sender_tsid, currants: currants, text: text, delay: delay, to_mailbox: to_mailbox};
	if (in_reply_to) {
		new_mail.in_reply_to = in_reply_to;
	}
	
	if(!this.mail.delayed_mail_items) {
		this.mail.delayed_mail_items = {};
	}
	
	this.mail.delayed_mail_items[time() + add_delay] = new_mail;
	
	// Delayed scheduling of delayed deliveries? This shit is bananas.
	this.schedule_delayed_player_deliveries();
}

function schedule_delayed_player_deliveries() {
	var next_item = -1;
	
	for(var i in this.mail.delayed_mail_items) {
		if(next_item == -1 || i < next_item) {
			next_item = i;
		}
	}
	
	if(next_item != -1) {
		var delay_time = (next_item - time()) * 1000;
		if(delay_time < 500) {
			delay_time = 500;
		}
		
		this.apiSetTimer('mail_do_delayed_player_deliveries', delay_time);
	}
}

function mail_do_delayed_player_deliveries() {
	for(var i in this.mail.delayed_mail_items) {
		if(i > time()) {
			continue;
		}

		// Try to find the item associated with this delivery. Throw an error and try again
		var new_item = this.mail.delayed_mail_items[i];
		var stack = apiFindObject(new_item.itemstack_tsid);
		if(!stack) {
			log.error("Error posting delayed mail item "+new_item.itemstack_tsid+" to player "+this);
			if(new_item.tries) {
				new_item.tries++;
			} else {
				new_item.tries = 1;
			}
			
			if(new_item.tries >= 3) {
				log.error("Too many attempts to post delayed mail item "+new_item.itemstack_tsid+" to player "+this+". Aborting!");
				delete this.mail.delayed_mail_items[i];
			}
			
			continue;
		}
		
		this.mail_add_player_delivery(new_item.itemstack_tsid, new_item.sender_tsid, new_item.currants, new_item.text, new_item.delay, new_item.to_mailbox);
		delete this.mail.delayed_mail_items[i];
	}
	
	this.schedule_delayed_player_deliveries();
}

function mail_add_player_delivery(itemstack_tsid, sender_tsid, currants, text, delay, to_mailbox, in_reply_to) {
	if (!this.mail) {
		this.mail_init();
	}
	
	log.info("MAIL: Sending Mail -- Delay: "+delay);

/*	if(config.is_dev) {
		delay = 60;
	}*/

	if(!this.mail.next_msg_id) {
		this.mail.next_msg_id = 0;
	}
	// For the sake of some previous production errors, make absolutely sure we don't overwrite existing mail.
	while(this.mail.inbox[this.mail.next_msg_id]) {
		this.mail.next_msg_id++;
	}

	this.mail.inbox[this.mail.next_msg_id] = {'sender_tsid': sender_tsid, 'currants': currants, 'text': text,
	'delivery_time': delay + time(), 'items': [], 'in_mailbox':to_mailbox, 'is_read': false};
	
	if (in_reply_to) {
		this.mail.inbox[this.mail.next_msg_id].in_reply_to = in_reply_to;
	}

	// Now add the delivery item, if there is one
	if(itemstack_tsid) {
		this.mail_add_item(itemstack_tsid, delay, 'courier', this.mail.next_msg_id, sender_tsid);
	} else {
		// otherwise, just schedule the delivery
		this.schedule_next_delivery();
	}
	
	if(to_mailbox) {
		this.schedule_inbox_growl();
	}
	
	// Notify www via callback
	utils.http_get('callbacks/mail.php', {
		'sender_tsid' : sender_tsid,
		'receiver_tsid' : this.tsid,
		'mail_id' : this.mail.next_msg_id,
		'has_attachment' : itemstack_tsid ? 1 : 0		
	});

	this.mail.next_msg_id++;
}

function mail_add_auction_delivery(itemstack_tsid, delay, uid, sender_tsid, subType) {
	apiResetThreadCPUClock();
	this.mail_add_item(itemstack_tsid, delay, 'auction', uid, sender_tsid, subType);
	apiResetThreadCPUClock("mail_add_auction_delivery");
}

function mail_add_item(itemstack_tsid, delay, mailType, id, sender_tsid, subType) {
	if (!this.mail) {
		this.mail_init();
	}

	var bag = this.mail_get_bag();
	if (bag) {
		var obj = apiFindObject(itemstack_tsid);
		switch(obj.getContainerType()) {
			case 'pack':
			case 'bag':
				var owner_container = obj.getContainer();
				var owner = owner_container.findPack();
				break;
			case 'default':
			case 'street':
				log.error("Attempting to add mail item "+itemstack_tsid+" to player "+this+", but the item is somehow not in a player pack.");
				return;
		}

		// If this is on a player, we may need to remove the stack from their pack. Except for auctions where the stack is
		// already locked and a second lock will fail.
		if(owner && owner.is_player) {
			if (mailType == 'auction'){
				var stack = apiFindObject(itemstack_tsid);
			} else {
				var stack = owner.removeItemStackTsid(itemstack_tsid);
				if(!stack) {
					stack = apiFindObject(itemstack_tsid);
				}
			}
		} else  {
			// Otherwise, it is a temp stack and does not need to be locked.
			var stack = apiFindObject(itemstack_tsid);
		}
		
		if (stack) {
			if (stack.onMail && mailType == 'courier') {
				var sender = getPlayer(sender_tsid);
				stack.onMail(this, sender);
			}
			this.mail_add_stack(stack, delay, mailType, id, sender_tsid, subType);
		}
	}
}

function mail_add_stack(stack, delay, mailType, id, sender_tsid, subType) {
	if (!this.mail) {
		this.mail_init();
	}

	var bag = this.mail_get_bag();
	if (bag) {
		log.info("Adding mail stack "+stack+" to player "+this);
				
		var deliveryPacket = {};

		bag.apiAddHiddenStack(stack);

		// add delivery information
		deliveryPacket.delivery_time = time() + delay;
		
		if(mailType == 'courier') {
			if(this.mail.inbox[id]) {
				// store the msg_id, if there is one. This will help if we ever need to track down orphaned items.
				deliveryPacket.msg_id = id;
				deliveryPacket.mailType = 'courier';

				// and add the item to the message
				this.mail.inbox[id].items.push(stack.tsid);
			} else {
				log.error("Adding orphaned mail item "+stack+" to player "+this+" with missing msg id "+id);
				this.fix_broken_mail_item(stack);
				return;
			}
		} else if(mailType == 'auction') {
			deliveryPacket.mailType = 'auction';
			deliveryPacket.auction_uid = id;
			deliveryPacket.auction_action = subType;
			if(sender_tsid) {
				deliveryPacket.sender_tsid = sender_tsid;
			}
		} else {
			log.error("Mail delivery scheduled for "+this.tsid+" with item "+stack.tsid+" of unknown type.");
			deliveryPacket.mailType = 'unknown';
		}

		stack.addDeliveryPacket(deliveryPacket);
		
		
		this.schedule_next_delivery();
		log.info("Mail: item "+stack.tsid+" scheduled for delivery to player "+this.tsid+" at "+deliveryPacket.delivery_time+".");
	}
}

function mail_get_message_cost(itemstack, count, currants, ignore_currants) {
	var cost = 2;
	
	if (itemstack && count) {
		cost += Math.round(Math.max(1, itemstack.getBaseCost()*0.1*count));
	}
	if (currants) {
		cost += Math.round(currants * 0.1);
	}
	
	cost = Math.min(200, cost);
	
	if (currants && !ignore_currants) {
		cost += currants;
	}
	
	return cost;
}

function build_mail_check_msg(from_item, to_msg, fetch_all) {
	var num_msg = 0;
	
	if(!this.mail) {
		this.mail_init();
	}

	log.info("Building mail_check hash for "+this);
	
	var mail_check= {};

	if(to_msg) {
		mail_check = to_msg;
	}

	mail_check.type = 'mail_check';
	mail_check.message_count = this.mail_count_messages();
	mail_check.itemstack_tsid = from_item;
	mail_check.base_cost = this.mail_get_message_cost(null, 0, 0);
	mail_check.messages = [];
	
	var mail_start = this.mail.next_msg_id - 1;
	if (mail_start < 0) {
		return mail_check;
	}
	var n = 0;
	
	var limit = 50;

	if (fetch_all) limit = mail_check.message_count;

	for(var i = mail_start; i >= 0 && n < limit; i--) {
		// Only show messages we've already received!
		if(!this.mail.inbox[i] || this.mail.inbox[i].delivery_time > time()) {
			continue;
		}

		var newMsg = {message_id: i};
		var sender_tsid = this.mail.inbox[i].sender_tsid;
		if(sender_tsid) {
			var sender_pc = getPlayer(this.mail.inbox[i].sender_tsid);
			
			if (sender_pc && this.buddies_is_ignoring(sender_pc) && this.mail.inbox[i].currants == 0 && !this.mail.inbox[i].items.length) {
				this.mail_remove_player_message(i);
				continue;
			}
		} else {
			var sender_pc = null;
		}
		if(this.mail.inbox[i].items.length) {
			// For now, only one item can be attached to a message
			var it = apiFindObject(this.mail.inbox[i].items[0]);
			if(it) {
			
				newMsg.item = {class_tsid: it.class_tsid, count: it.count};

				// For tools, we need to send info on the brokenness and points remaining
				if(it.is_tool) {
					newMsg.item.is_broken = intval(it.getInstanceProp('is_broken'));
					newMsg.item.points_remaining = intval(it.getInstanceProp('points_remaining'));
					newMsg.item.points_capacity = intval(it.getClassProp('points_capacity'));
				}
				
				// Config?
				if (it.make_config){
					newMsg.item.config = it.make_config();
				}
			} else {
				// Something is broken.
				log.error("Error, message "+i+" on player "+this+" contains missing item "+this.mail.inbox[i].items[0]);
			}
		}
		
		newMsg.currants = this.mail.inbox[i].currants;
		
		if (sender_pc) {
			newMsg.sender = {label: sender_pc.label, tsid: sender_pc.tsid, singles_url: sender_pc.avatar_get_singles()};
		}
		
		newMsg.text = this.mail.inbox[i].text;
		newMsg.received = this.mail.inbox[i].delivery_time;
		if (this.mail.inbox[i].replied) {
			newMsg.replied = this.mail.inbox[i].replied;
		} else {
			newMsg.replied = 0;
		}

		newMsg.is_auction = this.mail.inbox[i].is_auction ? 1 : 0;

		if (this.mail.inbox[i].in_reply_to) {
			// Walk the reply list, building messages:
			var dest_reply = newMsg;
			var source_reply = this.mail.inbox[i].in_reply_to;
			// Uncomment here to increase reply depth
//			for (var source_reply = this.mail.inbox[i].in_reply_to; source_reply; source_reply = source_reply.in_reply_to) {
				var sender_label = "";
				var sender_tsid = "";
				
				if (source_reply.sender_tsid) {
					sender_tsid = source_reply.sender_tsid;
					var reply_pc = getPlayer(source_reply.sender_tsid);
					if (reply_pc) {
						var sender_label = reply_pc.label;
					}
				}
				
				dest_reply.in_reply_to = {message_id: source_reply.message_id, received: source_reply.received, text: source_reply.text, sender: {label: sender_label, tsid: sender_tsid}};
				if (source_reply.replied) {
					dest_reply.in_reply_to.replied = source_reply.replied;
				} else {
					dest_reply.in_reply_to.replied = 0;
				}
				
//				dest_reply = dest_reply.in_reply_to;
//			}
		}
		
		if(this.mail.inbox[i].is_expedited) {
			newMsg.is_expedited = this.mail.inbox[i].is_expedited;
		}
		
		newMsg.is_read = this.mail.inbox[i].is_read;
		
		mail_check.messages.unshift(newMsg);
		n++;
	}
	
	return mail_check;
}

function mail_check(from_item) {
	this.apiSendMsg(this.build_mail_check_msg(from_item));
}

function mail_login() {
	this.mail_cancel_deliveries();
	this.apiCancelTimer('new_inbox_growl');
	this.send_unsent_mail_to_inbox();
	this.schedule_next_delivery();
}

function mail_logout() {
	this.mail_cancel_deliveries();
	this.apiCancelTimer('new_inbox_growl');
}

function mail_cancel_deliveries() {
	this.apiCancelTimer('deliver_mail');
	this.next_delivery = -1;
}

function admin_clear_mail() {
	if(!this.mail || !this.is_god) {
		return;
	}
	
	// Get all items.
	this.get_mail_items('auction', null);
	this.get_mail_items('courier', null);
	
	// Get any currants from messages
	for(var i in this.mail.inbox) {
		if(this.mail.inbox[i].currants) {
			this.stats_add_currants(this.mail.inbox[i].currants, {'mail':i});
		}
	}
	
	// Clear messages
	this.mail.inbox = {};
	this.mail.next_msg_id = 0;
	this.mail.delayed_mail_items = {};
}

function admin_mail_spy(pc_tsid) {
	if(!pc_tsid) {
		return;
	}
	
	var pc = getPlayer(pc_tsid);
	if(pc) {
		this.apiSendMsg(pc.build_mail_check_msg(null));
	}
}

function mail_has_item_pending(class_tsid){
	if (!this.mail) return false;

	var items = this.mail_get_bag_contents();
	for (var i in items){
		if (items[i].class_tsid == class_tsid) return true;
	}

	return false;
}


function mail_replace_mail_item(source_tsid, replacement_item){
	if (!this.mail) return false;

	for (var i in this.mail.inbox){
		if (!this.mail.inbox[i].items[0] || this.mail.inbox[i].items[0] != source_tsid) continue;

		var source_stack = apiFindObject(this.mail.inbox[i].items[0]);
		if (source_stack){
			replacement_item.addDeliveryPacket(source_stack.getDeliveryPacket());
			this.mail.inbox[i].items[0] = replacement_item.tsid;
			return true;
		}
	}

	return false;
}

// Special player rewards that we want to mail to everyone, but that we want everyone to get only once.
function mail_send_special_item(class_tsid, number, message, min_level) {
	var n_sending = number ? number : 1;
	
	if(min_level && this.stats_get_level() < min_level) {
		return;
	}
	
	if (!this.mail) {
		this.mail_init();
	}

	if(!this.mail.special_items) {
		this.mail.special_items = {};
	}
	
	if(this.mail.special_items[class_tsid]) {
		return;
	}
	
	var bag = this.mail_get_bag();
	if (!bag) return;
	var slot = bag.firstEmptySlot();
	
	var s = apiNewItemStack(class_tsid, n_sending);
	if(!s) {
		log.error("Couldn't create special item of type "+class_tsid+" for player "+this);
		return;
	} else {
		log.info("Creating special item "+s+" for player "+this);
	}
	if(bag.addItemStack(s, slot)) {
		log.error("Failed to add special item "+s+" to player "+this);
	}
	
	if (!message){
		message = "Here's a special delivery just for you!";
	}else{
		message = message.replace('[name]', this.label);
	}

	this.mail_add_player_delivery(s.tsid, null, 0, message, config.mail_delivery_time_with_attachment, false);

	this.mail.special_items[class_tsid] = true;
}

function mail_reset_special_item(class_tsid) {
	if (!this.mail) {
		this.mail_init();
	}
	
	if(!this.mail.speciaL_items) {
		this.mail.special_items = {};
	}
	
	if(this.mail.special_items[class_tsid]) {
		delete this.mail.special_items[class_tsid];
	}
}
