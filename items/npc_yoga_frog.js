//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "AFLC Frog";
var version = "1344982233";
var name_single = "AFLC Frog";
var name_plural = "AFLC Frogs";
var article = "an";
var description = "These frogs deliver parcels for both the Auction Fulfillment and Logistics Corporation and the General Inter-Giant Postal Delivery Service to fund their yoga classes, organic produce addictions and respective degrees in alternative healing. As a rule, they experience a high degree of spiritual oneness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_yoga_frog", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.box = "box";	// defined by npc_yoga_frog
	this.instanceProps.variant = "frogRed";	// defined by npc_yoga_frog
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	box : ["Whether the frog is carrying a box"],
	variant : ["The frog colour"],
};

var instancePropsChoices = {
	ai_debug : [""],
	box : ["box","none"],
	variant : ["frogBlue","frogRed"],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.talk_to = { // defined by npc_yoga_frog
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Get your mail",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if(this.delivered) {
			this.sendBubble("Off to my yoga session, dude. You should drop in sometime — it's good for your, like, chi.", 3000, pc);	
		} else if(pc != this.pc) {
			this.sendBubble("On delivery for "+this.pc.label+"! No time to talk, brah.", 3000, pc);
		} else {
			this.doDelivery();
		}
	}
};

function deliveryFailed(pc,msg){ // defined by npc_yoga_frog
	this.conversation_reply(pc, msg, "Dude, you don't have room in your pack for this stuff. Do you want to make some room, or should I send it to your mailbox?", {1: {txt: "Hold on. I'll make some room.", value: 'make-room'}, 2: {txt:"Just send it to my mailbox.", value:'to-mailbox'}}, null, null, null, null, true);
}

function dialog_onEnter(previous_state){ // defined by npc_yoga_frog
	this.messages_register_handler('dialog', 'dialog_onMsg');
}

function dialog_onMsg(msg){ // defined by npc_yoga_frog
	if(msg.from == 'conversation_cancel') {
		if(this.yogaState > 0) {
			this.doYoga();
		} else {
			this.setAndBroadcastState('idle');
			this.fsm_exit_current_state();
			this.followPC();
		}
	} else if(msg.from == 'conversation_start' || msg.from == 'conversation_reply') {
		// Removed per Danny
	//	this.container.announce_sound_to_all('TALK_FROG');
	}
}

function doDelivery(){ // defined by npc_yoga_frog
	if(this.delivered) {
		return;
	}

	this.apiStopMoving();
	this.apiCancelTimer('followPC');
	this.fsm_switch_state('dialog');

	if(this.waitForSpace) {
		var resp = "While I was waiting I had this, like, epiphany—" + choose_one(this.responses.epiphanies);
		this.conversation_start(this.pc,  resp, {1: {txt: "I… what?", value: 'bye'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
	} else {
		if(this.mailType == 'auction') {
			var rewards = this.pc.mail_build_auction_rewards(0, 10);
			this.auction_items = this.pc.mail_count_auction_items();
			this.last_auction_shown = 10;

			// Only a chance to display ramblings
			var do_ramblings = is_chance(0.33333);
			// The dreaded nested ternary.
			var response_value = (this.last_auction_shown >= this.auction_items) ? (do_ramblings ? 'thx' : 'bye') : 'auction-more-items';

			var conv_start = 'Got your ' + rewards.describe + (rewards.items.length > 1 ? ' auctions, brah.' : ' auction, brah.');
			delete rewards.describe;

			this.conversation_start(this.pc, conv_start, {1: {txt: "Thanks!", value:response_value}}, {offset_x: 0, offset_y:30}, rewards, null, null, true);
		} else if(this.mailType == 'courier') {
			// Only a chance to display ramblings
			var do_ramblings = is_chance(0.33333);

			this.conversation_start(this.pc, "Got your mail, brah.", {1: {txt: "Thanks!", value:do_ramblings ? 'thx' : 'bye'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
		}
	}
}

function doPickup(){ // defined by npc_yoga_frog
	switch(this.pickupState) {
		case 0:
			this.station.doParcel();
			this.setAndBroadcastState('moveEnd');
			this.pickupState++;
			this.apiSetTimer('doPickup', 500);
			break;
		case 1:
			this.setInstanceProp('box', 'box');
			this.setAndBroadcastState('idle');
			this.pickupState++;
			this.apiSetTimer('doPickup', 500);
			break;
		case 2:
			this.setAndBroadcastState('moveStart');
			this.pickupState++;
			this.apiMoveToXY(this.x - 50, this.y - 50, 150, 'doPickup');
			break;
		case 3:
			this.setAndBroadcastState('move');
			this.pickupState++;
			this.apiMoveToXY(this.x - 200, this.y - 450, 400, 'doPickup');
			break;
		case 4:
			this.apiDelete();
			break;
	}
}

function doYoga(){ // defined by npc_yoga_frog
	switch(this.yogaState) {
		case 0:
			this.conversation_start(this.pc, "My yoga is killer. Check this out.", {1: {txt: "OK", value: 'ok-yoga'}}, null, null, null, null, true);
			this.yogaState++;
			break;
		case 1:
			this.fsm_exit_current_state();
			if(this.x < this.pc.x) {
				this.dir = 'left';
				this.apiMoveToXY(this.pc.x - 95, this.pc.y - 50, 200, 'doYoga');
			} else {
				this.dir = 'right';
				this.apiMoveToXY(this.pc.x + 95, this.pc.y - 50, 200, 'doYoga');
			}
			this.yogaState++;
			break;
		case 2:
			switch(this.yogaPose) {
				case 'warrior':
					this.pc.announce_sound('WARRIOR_POSE_FROG');
					break;
				case 'dancer':
					this.pc.announce_sound('DANCER_POSE_FROG');
					break;
				case 'tree':
					this.pc.announce_sound('TREE_POSE_FROG');
					break;
			}

			this.setAndBroadcastState(this.yogaPose + 'PoseIn');
			this.yogaState++;
			this.apiSetTimer('doYoga', 250);
			break;
		case 3:
			this.setAndBroadcastState(this.yogaPose + 'Pose');
			this.yogaState++;
			this.apiSetTimer('doYoga', 2000);
			break;
		case 4:
			this.setAndBroadcastState(this.yogaPose + 'PoseOut');
			this.yogaState++;
			this.apiSetTimer('doYoga', 200);
			break;
		case 5:
			this.leaveState = 0;
			this.leave();
			break;
	}
}

function fall(){ // defined by npc_yoga_frog
	if(!this.pc) {
		this.apiSetTimer('fall',500);
		return;
	}

	this.setAndBroadcastState('move');

	if(this.pc.x > this.x) {
		this.dir = 'left';
		this.apiMoveToXY(this.pc.x - 300, this.pc.y, 400, 'followPC');
	} else {
		this.dir = 'right';
		this.apiMoveToXY(this.pc.x + 300, this.pc.y, 400, 'followPC');
	}
}

function finishDelivery(pc, msg){ // defined by npc_yoga_frog
	this.delivered = true;
	this.pc.schedule_next_delivery();
	this.conversation_end(pc, msg);
	this.setInstanceProp('box', 'none');

	this.yogaState = 0;
	this.yogaPose = choose_one(['tree', 'dancer', 'warrior']);

	this.doYoga();
}

function followPC(){ // defined by npc_yoga_frog
	if(!this.pc || !this.pc.isOnline() || this.pc.location != this.container || this.delivered) {
		return;
	}

	// Face the right direction. Include delay to start moving.
	switch(this.state) {
		case 'move':
		case 'moveStart':
			if(Math.abs(this.pc.x - this.x) < 100) {
				if(this.isClose == 2) {
					this.setAndBroadcastState('moveEnd');
					this.apiSetTimer('followPC', 100);
					return;
				} else {
					this.isClose++;
				} 
			} else {
				this.isClose = 0;
			}

			if(this.pc.x < this.x) {
				if(this.dir == 'left') {
					this.dir = 'right';
					this.setAndBroadcastState('moveEnd');
					this.apiSetTimer('followPC', 100);
					return;
				}
			} else if(this.dir == 'right') {
				this.dir = 'left';
				this.setAndBroadcastState('moveEnd');
				this.apiSetTimer('followPC', 100);
				return;
			}

			this.setAndBroadcastState('move');
			this.isFlying = true;
			if(this.x < this.pc.x) {
				this.apiStartFlyingInTheAreaX(this.pc.x - 100, this.pc.y - 50, 50, 50, 200, false);
			} else {
				this.apiStartFlyingInTheAreaX(this.pc.x + 50, this.pc.y - 50, 50, 50, 200, false);
			}
			this.apiSetTimer('followPC', 500);

			if(!this.movingSound) {
				this.movingSound = true;
				this.pc.announce_sound('MOVE_FROG', 999);
				this.pc.announce_sound_stop('IDLE_FROG');
			} 
			break;
		case 'moveEnd':
			if(Math.abs(this.pc.x - this.x) < 100 && this.isClose == 2) {
				this.setAndBroadcastState('idle');
				this.apiSetTimer('followPC', 500);
				return;
			}

			this.setAndBroadcastState('moveStart');
			this.apiSetTimer('followPC', 100);
			break;
		case 'idle':
		default:
			if (Math.abs(this.pc.x - this.x) > 100) {
				this.setAndBroadcastState('moveStart');
			} else if (this.isFlying) {
				this.isFlying = false;
				this.apiStopMoving();
				if (this.x < this.pc.x) {
					this.apiMoveToXY(this.pc.x - 60, this.pc.y, 200, 'followPC');
					return;
				} else {
					this.apiMoveToXY(this.pc.x + 60, this.pc.y, 200, 'followPC');
					return;
				}
			}
			this.apiSetTimer('followPC', 100);

			if(this.movingSound) {
				this.movingSound = false;
				this.pc.announce_sound('IDLE_FROG', 999);
				this.pc.announce_sound_stop('MOVE_FROG');
			} 
			break;
	}
}

function getPlayerMailItem(){ // defined by npc_yoga_frog
	return this.pc.get_player_message(this.viewed_message);
}

function isDeliveringTo(pc){ // defined by npc_yoga_frog
	if(this.pc == pc && !this.delivered) {
		return true;
	} else {
		return false;
	}
}

function leave(){ // defined by npc_yoga_frog
	switch(this.leaveState) {
		case 0:
			this.pc.clearDoNotDisturb();
			this.delivered = true;
			this.destination = {x: this.x + choose_one([-300, 300]), y: this.y - 75};
			if(this.destination.x > this.x) {
				this.dir = 'left';
			} else {
				this.dir = 'right';
			}
			this.setAndBroadcastState('moveStart');
			this.leaveState++;
			this.apiSetTimer('leave', 150);
			break;
		case 1:
			if(this.pc && this.pc.isOnline() && this.pc.location == this.container) {
				this.pc.announce_sound_stop('IDLE_FROG');
				this.pc.announce_sound('MOVE_FROG', 999);
			}
			this.setAndBroadcastState('move');
			this.apiMoveToXY(this.destination.x, this.destination.y, 200, 'leave');
			this.leaveState++;
			break;
		case 2:
			if(this.dir == 'left') {
				this.destination.x += 300;
			} else {
				this.destination.x -= 300;
			}

			this.destination.y -= 500;
			this.apiMoveToXY(this.destination.x, this.destination.y, 400, 'leave');
			this.leaveState++;
			break;
		case 3:
			if(this.pc && this.pc.isOnline() && this.pc.location == this.container) {
				this.pc.announce_sound_stop('MOVE_FROG');
			}
			this.apiDelete();
			break;
	}
}

function make_config(){ // defined by npc_yoga_frog
	return { box: this.getInstanceProp('box') || 'box', variant: this.getInstanceProp('variant') || 'frogBlue' };
}

function nextPlayerMailItem(pc, msg){ // defined by npc_yoga_frog
	// Get the next item

	log.info("Delivering player mail!");

	var player_msg = this.pc.mail_get_next_player_message();

	// No more messages! Finish up.
	if(typeof player_msg == 'undefined') {

		this.finishDelivery(pc, msg);
		return;
	}

	// Otherwise, we have a message
	var rewards = this.pc.mail_build_message_rewards(player_msg);
	var msg_data = this.pc.mail_get_player_message_data(player_msg);

	// Message data
	var sender_player = getPlayer(msg_data.sender_tsid);
	var sender = sender_player ? sender_player.label : "Tiny Speck";
	var msg_text = msg_data.text;

	if (!this.previous_messages) {
		var dialogue = "OK, so there's like… an express message for you from "+sender+".";
	} else if (this.previous_messages == 1) {
		var dialogue = "Oh, right. There's also a message from "+sender+".";
	} else {
		var dialogue = "And you've got something from "+sender+".";
	}

	if (msg_text && rewards) {
		dialogue += " They said, \""+msg_text+"\" and they sent you all this stuff, too.";
		var resp = "Cool, I love stuff."
	} else if (msg_text) {
		dialogue += " They said, \""+msg_text+"\"";
		var resp = "Cool."
	} else if (rewards) {
		dialogue += " They sent you all this stuff.";
		var resp = "Cool, I love stuff."
	}

	this.viewed_message = player_msg;
	this.conversation_reply(pc, msg, dialogue, {1: {txt: "Cool.", value: 'get-msg'}}, {offset_x: 0, offset_y:30}, rewards, null, null, true);
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_yoga_frog
	if(!oldContainer) { 
		if(this.station && typeof pickupState == 'undefined') {
			this.startPickup();
		} else if(this.pc) {
			this.fall();
		} else if (!this.station) {
			this.apiSetTimer('fall', 500);
		}
	}
}

function onConversation(pc, msg){ // defined by npc_yoga_frog
	if (msg.choice == 'thx') {
		this.sayFunnyThings(pc, msg);
	} else if (msg.choice == 'deliver') {
		this.conversation_reply(pc, msg, "Whatever. Namaste, dude.", {1: {txt: "Uh, thanks?", value: 'bye'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
	} else if (msg.choice == 'bye') {
		// Here's where we do our delivery.
		if(this.mailType == 'auction') {
			if(this.pc.get_auction_mail()) {
				this.deliveryFailed(pc, msg);
			} else {
				this.finishDelivery(pc, msg)
			}
		} else {
			this.nextPlayerMailItem(pc, msg);
		}
	} else if (msg.choice == 'ok-yoga') {
		this.conversation_end(pc, msg);
		this.doYoga();
	} else if (msg.choice == 'make-room') {
		this.conversation_reply(pc, msg, "Just come talk to me when you're ready.", {1: {txt: "WIll do!.", value:'will-do'}}, null, null, null, null, true);
	} else if (msg.choice == 'to-mailbox') {
		this.sendMailToInbox();
		this.conversation_reply(pc, msg, "'Kay, brah, but you shouldn't be so attached to material possessions—it's like major bad karma.", {1: {txt: "I'll keep that in mind.", value:'take-off'}}, null, null, null, null, true);
	} else if (msg.choice == 'take-off') {
		this.finishDelivery(pc, msg)
	} else if (msg.choice == 'will-do') {
		this.waitForSpace = true;
		this.setAndBroadcastState('idle');
		this.conversation_end(pc,msg);
		this.fsm_exit_current_state();
		this.followPC();
	} else if (msg.choice == 'get-msg') {
		if(this.getPlayerMailItem()) {
			// had remaining items. Couldn't deliver.
			this.deliveryFailed(pc,msg);
		} else {
			if(!this.previous_messages) {
				this.previous_messages = 1;
			} else {
				this.previous_messages++;
			}
			this.nextPlayerMailItem(pc,msg);
		}
	} else if (msg.choice == 'auction-more-items') {
		this.showMoreAuctionItems(pc, msg);
	}
}

function onCreate(){ // defined by npc_yoga_frog
	this.initInstanceProps();
	this.isClose = 0;
	this.dir = 'left';
	this.fsm_init();
	this.setAndBroadcastState('moveStart');
}

function onPlayerExit(pc){ // defined by npc_yoga_frog
	// our player left, so we leave!
	if(pc == this.pc && this.leaveState == undefined) {
		this.delivered = true;
		this.pc.schedule_next_delivery();
		this.leaveState = 0;
		this.leave();
	}
}

function sayFunnyThings(pc, msg){ // defined by npc_yoga_frog
	if(typeof pc.delivery_order === 'undefined') {
		pc.delivery_order = 0;
	} else {
		pc.delivery_order++;
		pc.delivery_order %= 7;
	}
	switch(pc.delivery_order) {
		case 0:
			this.conversation_reply(pc, msg, "I'm not really into all this, you know, like capitalism and stuff. Don't you think people should just give things away?", {1: {txt: "Sure. Can I have my mail now?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 1:
			this.conversation_reply(pc, msg, "You know, sometimes I look at these deliveries and I'm just like, \"Why are we so obsessed with material, like, possessions when nature is all around us?\"", {1: {txt: "Can I just have my mail now?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 2:
			this.conversation_reply(pc, msg, "Backpacking through Shimla Mirch changed my whole worldview. You should try it sometime.", {1: {txt: "Can I please just have my mail now?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 3:
			this.conversation_reply(pc, msg, "Dude, your chakras are in need of some like major adjustment. You should drop by for a yoga session sometime.", {1: {txt: "Why can't I just get my mail?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 4:
			this.conversation_reply(pc, msg, "If you think about it, it's like you've already got your mail, because we're like one with everything, right?", {1: {txt: "Can I have my mail for real, please?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 5:
			this.conversation_reply(pc, msg, "So I said to my boss, \"Ever seen an eagle take a shower? Ever seen a, like, bear use soap?\" and he was all like, \"But you smell like feet.\"", {1: {txt: "Can I seriously please just have my mail?", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
		case 6:
			this.conversation_reply(pc, msg, "Sometimes I get the feeling like you don't appreciate my wisdom.", {1: {txt: "I'd appreciate my mail.", value: 'deliver'}}, {offset_x: 0, offset_y:30}, null, null, null, true);
			break;
	}
}

function sendMailToInbox(){ // defined by npc_yoga_frog
	if(this.mailType == 'courier') {
		this.pc.send_unsent_player_mail_to_inbox();
	} else if (this.mailType == 'auction') {
		this.pc.send_unsent_auctions_to_inbox();	
	}

	this.pc.schedule_inbox_growl();
}

function setDelivery(pc_tsid, mailType){ // defined by npc_yoga_frog
	this.pc = getPlayer(pc_tsid);
	if(mailType) {
		this.mailType = mailType;
	} else {
		this.mailType = 'auction';
	}

	this.pc.setDoNotDisturb(60*15);
}

function setStation(station){ // defined by npc_yoga_frog
	this.station = station;
	if(this.container) {
		this.startPickup();
	}
}

function showMoreAuctionItems(pc, msg){ // defined by npc_yoga_frog
	var more_talk = choose_one([
		"Oh, I guess there's this stuff too.",
		"I found this stuff in there too. Is it yours?",
		"Whoa, look at all this stuff.",
		"Did you order all this stuff to, like, fill some void? Because materialism is a dead end, dude.",
		"Before you just keep buying stuff you should think about like all the starving piggies in the world.",
		"Possessions aren't going to set you free, brah."
	]);

	var rewards = this.pc.mail_build_auction_rewards(this.last_auction_shown, this.last_auction_shown+10);
	this.last_auction_shown += 10;

	// Only a chance to display ramblings
	var do_ramblings = is_chance(0.33333);
	// The dreaded nested ternary.
	var response_value = (this.last_auction_shown >= this.auction_items) ? (do_ramblings ? 'thx' : 'bye') : 'auction-more-items';

	this.conversation_reply(pc, msg, more_talk, {1: {txt: "Thanks!", value: response_value}}, {offset_x: 0, offset_y:30}, rewards, null, null, true);
}

function startPickup(){ // defined by npc_yoga_frog
	this.setInstanceProp('box', 'none');
	this.setInstanceProp('variant', 'frogBlue');
	this.dir = 'right';
	this.state = 'move';
	this.pickupState = 0;
	this.apiMoveToXY(this.station.x, this.station.y - 75, 400, 'doPickup');
}

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];

var responses = {
	"epiphanies": [
		"if we're all just vibrations, and light is a kind of vibration, and light comes from the sun, then aren't sunbeams all like our brothers and sisters, or whatever, you know?",
		"what if, like, we are the giants, and we're really imagining ourselves?",
		"maybe all music should be called \"world\" music, because aren't we all like citizens of the world?",
		"if you need butterflies to make butter, shouldn't you need batterflies to make batter?",
		"when you think about it, aren't all trees really wood trees?",
		"why do they call them pants when you're only wearing one? Shouldn't it just be pant?",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-92,"w":41,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKRElEQVR42uWYeVCU9xnHSTtJ2iQT\nZeXagz0ArZEYxCNRm2TRqLXGgtZQo6YSQeQSUeSGZTn2ANzlXBZYWJZr2QVcF1iQS1zxAoJ1rVJN\nJ14zdab+UaXn398+75tobDo9AmSSmTDznfdl3nl\/+\/l9f8\/v+T3P6+b2ffgD8APSC6Qfq1Sqt+j6\nEull0gKSN8mDxGGef+MwDx48CLp+\/br08uXL0pGRkQXPPktPT0\/as2cP0tLSDphMpq0NDQ0fGgyG\nVL1ef5Luxy0Wy7jD4SgZHBwMm3ewmZkZ6aNHj+7dv38fN27cAAFiaGgINpsNBAO1Wo34+HiEh4dj\n3759iIiIsKempjq1Wq3TbDY7Ozo6nM3Nzc6mpiYTAQZ9I+4VFBQEJycnl+l0utaBgYH2W7duWcfH\nx40EmWW1WvfTM51SqURJSUnStxZv09PTL0xMTHhPTU0FX7x4cTOjycnJjQS68tq1a8FRUVH47LPP\nXiW9eOXKleeZ+PzWYDs7O39IsK8SGP\/mzZvc27dvezGAjx8\/XvDw4cOXv9g4z32ndjQD+J1OOd95\nwISEhG8H8ISBZypv4s8Ybfz\/miJSUlL+J6Cs1EOaqfKQzgvYjd0Lg5wfeLlGD3iipIKL1j7RzMgV\nv6cJ2jYqEfVPiuWj18Rl3Zf87WbHWnSeFTstw0KT0fHvk1FW+8jlWm9kqjyRXrBw7vkwY5P\/vdPh\nAvx2jyf0aV5otAvRfV7iso6IwywjBHVRMjN8VYKRa35grn0TEnSdlcA6LEJLnxCGLqFL386PaLBx\nRQ0nfZ0qHRdt0R7oDvWEZbu3a05wYzsXRby\/djGmdntj8leeqD7kAb1FgO4LfjAPiNA5KsbAlBin\nP5Hg9FQA+if9YRsTsIDmQTGaHb6o6xSgrHEhXem+wxdled40nicu7PbBwY0\/wZnQRRGzBnRs59w7\nts4bY7\/0wHDYIigSPaAzC0DukTsMoIiFcVz2Qs8lf\/Rc9MOp8yJ0nJGgrV8A4ykOaq1cVLZ4o6qV\nD327AJWpnrj0gQem93ph+2qaYChHPmvA1s0LZ1q3uMO2jYPmUA5yCr3YH6k\/KYSpRwTLkAC2c6\/C\nekaEk04Jq8\/hOGjs5sJI4VBLrlW1CVBY8QpK6ngolHmidzuHnXDsag9YtiycHWB6kfsC9WEPV2ms\nByoSPJGn9kZRDQ\/lzXxUNHNoyXgwdfPR1Mtll9MyJEb7kJiFNnV70fNFFH++7ISKazjQNPBQUOaB\nLBUHJVGLUBvqDn2IO4wbZwlosxUEVTeGILXAE1lqL3KAi1KjgJZMRBtFTEtNm8biTU4JCVJE8SYi\nxwi4R8Q6x8DVWMi9VgKs9Wbdy9W4I0P5ChLTn0dcyotISHoJiTE\/cs4K8O7dBtGjP52cuXq1Cqbm\nWMjyf4ak1DU4mChEUpY3lDo+dK0i1HfRZugVEDSPgLzY5Wc2Q7WZT3Ae5KSIJuZD7ntAY\/BBuoKD\n1PyFiE95DjHH3HDwiBsOxLnNLic+eNAadP9uq\/P3nzbiia7+Ro\/+PgUMhkRkyt7D8ew3kJjBQ3ax\nD\/K0XGjqfVHeJGLF3MuKeTiSzkV0Ig+HDgcgOmEJomL9WEXG8nGAQmh\/NMc0p3Rz507dgtEzJfZP\nJnW4ddPIgj78YwceP7LhwR\/MOD+mhaO38D\/qylT1v2jsnBbnnJovdVbjnBOgtWhDkEW9ydld\/9GM\nc1gJBvTO7Wb87a\/d+Mffe1n95c92POv0VzUxXgnnWQ3sp\/LR2SGD3ZbnGnNq5YwunNXO7USpyXrX\nZMgJQUPuBjQWbIHNFE+ulbL63XQ9udjOunn3TvNToOkb9bhwvgwdVhn01UnQVR1BVWkMDEXhaFJs\nhTE3RD5vhUJdttRV\/wWgUb4Rprz30Fm+Cz22\/KegXxXjVktzBgvWVBUJoyoU2mProTm6HieOrsOJ\npLXOeYEbvhog7TuzfKbn1EpYizajq4Qc1GyFTv0xkmM\/RGxWJsyWPHR15j6VuS2LXDuKDEUGEqLD\nUaqKgb305+x7nfS+uWgD2tQhrjnDOQYDgwbojK1u4qGhcSnsfcuhz3wXtdkhSMqWQxq2Hyt2ZeL9\n9FYUlCtYMKslh3a5EsWmJrwdpUF45GEcSs1DbVYI+1550XLklXpCUyuAro0\/u3N42LU4qfuC2NR7\nWSytoUSrzPVDneE16Fp8UZqyDpnHP8K+2OMI3HYY66NKEVYwiJ2qsyhprEP\/UCXkRhvCS8awIbEe\n7x1tQnSyDIVZv0ZF1nooNDRe6jKoCvwp6QucnSPuC+hEMg1O+f\/\/vXKtdVFYnvZlZ8cZsbO5W+Kq\nobOUqUbKyUm9PgCbd+9FZvIGFvCnB8uxJaUdIYcNCJXZsC3bjh05XdhVPIZtSQZ8HJ+GyLhE7EnV\nQJ3zGp0qPCgqvUkcGs\/7XnOv0FXWyJkZvCr5ejvZ0MmbqbFwnSXVXq5qcrHGyqPqhEullhjkMFpN\ny7H8F8fw9qEqFlIaX4OwPAfr2Dsx1dgh74FsXxAUsWugzl2D3XFBSC98hcC4KKqmk0XnBU2Nl0vX\n6uls6uF+\/Q0Tl+omjUl2C1LFrZHqygOpxJKwdeDAlQAWUKtagnd2RGJ9pBZbM7ogTajDvuIhhOXa\nsfl4GzaTq7vicrA3uRBZcncqIHjse12jQoo9OvbKRFCe8DKdqFsorzZ7zr7RzydAdf5S9nxligLL\nsBj2835wXFqM2LRQdpnXRhSzyxtKDm5JtWBTcgu25zro2oqjR3ejezCQhWPUN+HPlmV6HcVh4rq5\n9yWKhGCRImkllFVclJl4FNi+bC3IlFanxvywP2snC8ns5i0JVdgUq2UV\/EE2wtPi0Tvx+jNgfmgb\nEKPhlBBFeYFgVmd+vsnErYEiaRUURWKoq7koN\/EpJn3ZUqudakFF\/Tqs2hnDgjJ6e28UFEbp52DU\nBpw8x7QIYophIdWSfKgr+ex4+fMFmBezGixk\/JuUIijwtQKoCLSskSnjfdn6z9gdgI\/SdiBbt+kp\nmO0ZMGpZoa7iQylfSq3DGhTGvTl\/gLmHVuEJZCEDmfAWlOlvQHFCyC69pp5H9Z+AXTorxSjb1VHf\nYhn2g9EmhrLUF0rZMhaMmSQzTh7tbln0PADKooOlsuhVYFR4ZDUqFKvQWBeMwYtBOD25jEp8CRWk\nfDZ9MFLruWyDxMIOURN1bgnOTQfC3BGIFuNqlMpWs5NlJs2MPW+AGvkKOG+8Tq3lYrT3004m9dES\nOsb92V1dRnHJxKiijIcigtTW89iSf3TUDz19YphsQqq8RahrCsCTCc8PYGRwEDOYPD4Y6qw3kJ+8\nHD0ty3Dz06Xo\/yQALVYhWgm2qCgA+bRsjBgnW8y+lIip5aTYu+5agrKsFc+AzSPgly5+KYt9qYlJ\n2nqKu9HTEnZJlRpfe+7BFWG5cSvKGMD+QQks7ULWTeb\/vOOBppyDK+XZUasinozzjX1IomRtMlGK\nqajhyccvBciZzxmFFT732JRU6RXEANW1+N5r7xRICdBeTO1qid5nVkD\/BN1xThJdEcKjAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_yoga_frog-1342639955.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_yoga_frog.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
