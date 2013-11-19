//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Mail Dispatcher";
var version = "1350083541";
var name_single = "Mail Dispatcher";
var name_plural = "Mail Dispatchers";
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
var parent_classes = ["npc_mail_dispatcher", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.variant = "dispatcherLeft";	// defined by npc_mail_dispatcher
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	variant : ["Facing direction of the dispatcher"],
};

var instancePropsChoices = {
	ai_debug : [""],
	variant : ["dispatcherLeft","dispatcherRight"],
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

verbs.send_mail = { // defined by npc_mail_dispatcher
	"name"				: "send mail",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Send mail to your friends",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.sendMail(pc);

		return true;
	}
};

function addPC(pc){ // defined by npc_mail_dispatcher
	if(!this.pc_list) {
		this.pc_list = {}
	}

	this.pc_list[pc.tsid] = pc;
}

function backToIdle(){ // defined by npc_mail_dispatcher
	this.idling = false;
	this.updateState();
}

function doParcel(){ // defined by npc_mail_dispatcher
	if(this.pc_notifications && this.pc_notifications[0]) {
		var pc = getPlayer(this.pc_notifications[0]);
	}

	switch(this.parcelState) {
		case 0:
			this.parcelAnimation = 'prepare_package';
			this.updateState();
			this.parcelState++;
			this.apiSetTimer('doParcel', 600);
			if(pc) {
				pc.announce_sound('WAITING_FOR_FROG', 999);
			}
			break;
		case 1:
			this.parcelAnimation = 'waiting_for_frog';
			this.updateState();
			this.parcelState++;
			this.apiSetTimer('doParcel', 1000);
			break;
		case 2:
			// Set up frog
			this.parcelState++;
			var frog = this.container.createItemStack('npc_yoga_frog', 1, this.x + 250, this.y - 500);
			frog.setStation(this);
			break;
		case 3:
			this.parcelAnimation = 'package_sent';
			this.updateState();
			this.parcelState++;
			this.apiSetTimer('doParcel', 1000);
			if(pc) {
				pc.announce_sound_stop('WAITING_FOR_FROG');
				pc.announce_sound('PACKAGE_SENT');
			}
			break;
		case 4:
			delete this.parcelAnimation;
			this.updateState();
			if (this.parcels>0) this.parcels--;
			if(this.pc_notifications && this.pc_notifications.length) {
				array_remove(this.pc_notifications, 0);
			}
			if(this.parcels) {
				this.parcelState = 0;
				this.apiSetTimer('doParcel', 1000);
			} 
			break;
	}
}

function mailStop(pc){ // defined by npc_mail_dispatcher
	this.removePC(pc);
	this.updateState();

	// Play a sound!
	if(!this.pc_list || num_keys(this.pc_list) == 0) {
		pc.announce_sound('CANCEL_DISPATCHER');
	}
}

function make_config(){ // defined by npc_mail_dispatcher
	return { variant: this.getInstanceProp('variant') || 'dispatcherLeft' };
}

function onCreate(){ // defined by npc_mail_dispatcher
	this.initInstanceProps();
	this.apiSetHitBox(200,200);
}

function onPlayerCollision(pc){ // defined by npc_mail_dispatcher
	//pc.quests_offer('send_mail', true);
}

function onPlayerExit(pc){ // defined by npc_mail_dispatcher
	if(this.pc_list && this.pc_list[pc.tsid]) {
		delete this.pc_list[pc.tsid];
	}

	this.updateState();
}

function onPrototypeChanged(){ // defined by npc_mail_dispatcher
	this.apiDelete();
}

function removePC(pc){ // defined by npc_mail_dispatcher
	if(!this.pc_list || !this.pc_list[pc.tsid]) {
		return;
	}

	delete this.pc_list[pc.tsid];
}

function sendMail(pc){ // defined by npc_mail_dispatcher
	pc.mail_dispatch_start(this.tsid);

	// Play a sound!
	if(!this.pc_list || num_keys(this.pc_list) == 0) {
		pc.announce_sound('INTERACT_DISPATCHER');
	}

	// Add the pc to our list, and manage our state
	this.addPC(pc);
	this.updateState();
}

function sendParcel(pc){ // defined by npc_mail_dispatcher
	if (!this.pc_notifications) {
		this.pc_notifications = [];
	}

	this.pc_notifications.push(pc.tsid);

	if(this.parcels) {
		this.parcels++;
		return;
	} else {
		this.parcels = 1;
		this.sendingParcel = true;
		this.parcelState = 0;
		this.doParcel();
	}

	// Play confirmation sound
	pc.announce_sound('CONFIRM_DELIVERY');

	// Complete quest
	pc.quests_inc_counter('mail_packages_sent', 1);
}

function setHitBox(){ // defined by npc_mail_dispatcher
	this.apiSetHitBox(400, 200);
}

function updateState(){ // defined by npc_mail_dispatcher
	if(this.parcelAnimation) {
		this.setAndBroadcastState(this.parcelAnimation);
	} else if(num_keys(this.pc_list)) {
		this.setAndBroadcastState('interact');
	} else if(this.state == 'interact' || this.state == 'cancel') {
		this.setAndBroadcastState('cancel');
	} else {
		this.setAndBroadcastState('idle');
	}
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

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mail",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-67,"y":-144,"w":134,"h":145},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMQklEQVR42r2YeVDTd5\/HUy9AqlY5\n5BYRwq0oUitK64HaglereCFWFEEOQRCQO0AIJCSEhNwhIdzEcIMcAQSBeqAUz8dn2+12OjvP88z+\ntX\/szG53dmbnvZ\/EtPvfs65QfzPvyS+ZzHxf+Xzen+MXBuPdro9YLNYKlUq10iS6X2V6TUxM\/F0x\nMTGrTN8hLWN86IvLZXmIhAJNU1PjtFarmVaplNNisWi6rKx0urAwf\/rWrazpjIy06ZycTK1EJDg+\nNzdh90EBs9OvB+VlZfxUUVYCsagWBAe1Wom21mYMDvRi8p4R01PjMI4MoK9bj4Feg\/bVkyfuHwww\nLyMlLC8rHeXFBaip5oHLrQKfz4dSLkFbowp9nS0w3u3B8GAv2lt0aGpQt+ubmpgfDDDrRvJnJkB2\nSSFEAj74XC54BKnj52K65gzmZBfxSF+B8eFe9HbpoW9vvqfXN+75IHAxmZk26ZmZZwqyb6K6ohTS\nWgGEfB5EPBbGxJfxN8Xn+EUYip+bv8Xj0VYM3+2DoaNlsrVR8wEAYwzLnYv0\/gcL63RZubchqCqH\njADFNXxIuQUwVh7Di1J\/zGa5YYG3F\/da2dB3dUKn1y+Ut3SdYTT\/iy0D+OiPA7zMsl6bqTu3rmwA\nuznNSK0SIYsnxu1aBTJYpchKPgP29Ujkx4Uj62IEbrAKkaAdwNn6u9im\/W6BIXuWwVAuBDBU86v\/\nED7no6zVLleEVzfeUGOFYAYrJPNvJXqE9WXdCEwuhc+ZZHgei4fP6etwza3Hx7J5rJbOw1r6FKvq\nnv5qLXkyaSWfi2YIH9r8IYBuBOiWUAvnzEa4VN2DB2cUTO4oAgVjCBWO41PBKA6LxxGrmcF59X0c\nk08ivPYegqon4M8zIoA3hJ2CHkWsXOQ7NbVvxZICOsSwPnaL56d5XKnB5mQ5got6cCBXgRS2lCRB\nKkeK\/FoNFK0GNHV2Qd3SDo66DSf4fdhKtjjGbUBKXR0EuqpXI\/1F1c9nWXv\/Os9aunS7xQg3uF\/m\n13hcEZgBtxUacDq7GpJaHtRyLhVLOaq5HHS0atDVLoGyjgORSIgr4i7sLW9DhawI00N5WJitxKvH\nVXj9pLL7h\/lKv6VL8XmBvfvlaoVHPB+br8sQWnQHl\/N50CqFMA4q0d0hBqe8GK3NCgz3K6BT8yAT\nC5Ai68GXFVrIdXmYmyrBS4J7cr8Uk8P5nQNdt5YOcGMc39HtMq\/VDJiiQFhRBxLzK6CW1aJJUwNF\nHRtsGn8KmRgalRAN9WIY9K3IpUqO4ragRluCqaECPHtQifmZMswaC4RjfbkuSwboGstzc7lUNeNO\ngF436rGzsAPXbrOhVkgJSgIBNexqXhWkEhFU9Fk3TZHp+xNoG7mP6+o+JEnqUNXEh2ZQjvpBBfK7\n2+\/EGEZ8ly7FcVwPt7jKp5Tmt4AFbYjPLIREVAO1Ug5JnZhEcHRfr1Kg09CBiQkjZmemINMPILKi\nAyGV\/YiQ3cP++gcIVs39p5di7ujSAl7kPHW7xINXWj12FbQiMT0bVaXFNJOraSZXgVtViRqazwq5\nFE2NDTDcaccQLQ0iXQciixvhX9yHYO4ktvG\/w3bJHEKUT08sISCLACueusVVwSNNjW0leiRm3gaf\nUwapkG+eybwqgqTlwbSG1dMK1trShN5uAwSaFkQWaeGbdwcBrAEElg9jK28c28VT52IMWL4kgI7f\nsLyczpf+5HqRA5dEMVzz27GvSI58nhAcsRSlwjoUVouQyxPR+FOiTNWK6qZOSAyDKGrowTFeNyKq\nBhHBG8GeaiM+I+3XzHUeNrw5dLj5he2iAe1jinwdzxT\/6nqBDReCdEisgysVyj7uHUTVdCGadFLY\njePCXhyXjuI0TZNzuoc41zSHk9o5HFE\/xZea5zjS8BIHNS\/whWoBnze8QmTra21U68KmRQPancr3\nc4wpguv5MrheKIdrHAceqUr4lN4Fkz2KgMoJbK+ewg7hA2yvm8Me5QIiG14TxBtENP6AyJafcbDl\nF3xB2t38TwjT\/YjQ+jf4XPfyPkUwaLF8Hzl+fXub89kSuJwrJUjSRbZ5opiMzyzpB7NiDIFUADuE\nswgTP8Qh6QxOqR\/geOMznGz9E671\/CNKJn7BzZF\/xuH2nxHW8CN2aQle+\/JFRMOLHYvDC01cueZY\nxlGXM8VwMUOy4Bpbbp4o\/gWdYObpwSTjB3DGsKP6PkK5RkSz6pHKFiNb0gZ2yzA0Iw8xMf8aHY9+\nxLk7P+HT+h8RrnmDPfXP\/xKuXdi9OMB9l61to9LjnCnFzr9BUqo9r0vhn2+Af04bAqk6g8pHEECR\ndC3uwaZMCfbe4uIoS4LzgiYkqXuQ3j6FJMNzHNL9GWHKP2O3+hU+Uy381y7V\/P6lATxdAOeYQoIs\nMqfaM0kC\/9sd8MtqpPbRj8CyIQSSHz1Lh7CRIN1LeuBV1gufikEE8ccRQrvjDtkL7FS+xk75K+xS\n0j3tjNulTw4uGtA6KjXO4etc\/A55loVNVMl+Oa3wS9cggLwYSAUTRIA7uGOIFI3jgmYSV1se4KLu\nAS40mPQQpzQPESGfR6jkGel7bBc9hq9wJp4hNNgsCnDlkdQ4u+PZcDqVb4Y0+dHTBJjVBN80Ffxp\nPzQ34bJhGmlGfCWbBOfuPHSzr8EzPoPAuICm+y8gMc5T23lCYKRamia1D+DNn8xazzWse3\/Aw3G2\nKyMTb244loWN39wmyDyYKnozedA3UwffVAUVSxdFsZe8SOkkyFDuOC42PYJm9g2Gn\/+E7if\/APX0\nC2R1P8R+6XcIqXmIEMEDbKXHh83ciYJ1VXfXvz9gZOK6FZHX+WujM7Dx6xxSrrlYTIDMmw1gpsrh\nR2PMv7D7bapZlOqyEewkyHPa7yCffAnjwg9ovf8MmR0z+EI8jW3VM9jGm8bWqklsYhvl9qyxRaxe\ney+sX3YoUWL7VRocT9wyQzqRDz2T6sDM0IKZIoevqVhMFV1IqS7ut0AOY7s53VNg9c+BPfAY2YZZ\nfCmdMoMFV94ztybPsiGlXeGg63s3aUboUXvGgQS51eHrcDieSZBZcDqdTx6sBTO9ngBl8KVi+V9I\nimQRpZsauKlwgtnD2EMPVhE144igh6ud1CeD2UZzQfmXD2FTSd+AXYrMn85aYT7v\/3GZNo1VjLVu\nGxghUReWRV77y7qoG3A4dtPsxU0JNfChx1ATINNULNkEmdsBpknUvP0IlJnfiS239fDOv4OwirvY\nyuqBH9nAN1+PkNJuBJX2Y1Nhz\/d28fxddNZq83lvz30nOCvSJyQvxmr7nYztUWyrQ0m\/2kenw\/Fk\nDjyu8OGdRvM42VQsDdjLakOsfABJukl8LRrEAVokTkvvIk4xhIKOKfD6HiGvfRpX6yeQphnB8dpB\nBBOwV0670e6bW2GWs2wt5y7\/+2llMFZafpHp\/z1vUhDD0f3w8t2n2tYcSYEDedH9MhfeVCA+yRJs\nzdbhrGgAOS1jSNcOIU03htN1fUhrNEI8\/BicfoJrG8dV2QCuqkaR0ziMBOUwdlIUPfPu\/JtDbNlX\ndMYG0lrLuSv\/XrqXWUJta\/lVJgMHk3YxNn96afm+Kz+vjUqH26VKbLkmhHc8Dz43tThU3o785jGk\n1Q\/jZE0fvlWPUjSpYStGcJDXj32VXThR248DvF5az\/qwl9MN\/7wOeOa0\/bv9uZJoSzDWWc5d9X\/5\n0WRYa9Ia00JNYpohbTaEM7ZGsVYdSf0Pp1g2vJLE8KE0+5LXAshn2wr1CMpphh\/1x0BKeyAVkT81\nclOvZNJ6ZrpnJivovZIKTAOfzEZ4ZzX9t0uC8Kp9aISzJYLW7+rD3yHpsg8PD99kZWXFZHy88cDK\n3ael9rHlv3pdE2FLfA22XK3FlgTSNTG8EyVvlSwjCygtUpFfVfDJICjqnZvp1YnsYUffWU3dwPoS\np9g6PMq0uNpYMvjO12\/ptrFE05QGL6ug\/dG2Z4tGrahQln\/L\/deVsWXPPv6Ws2CXwF9wvlaz4JQg\nmLeLr\/5+7flS4ydnCprXx5apnRO4qs0pQo33DbHGI4nHtTmZnrF8\/6UTjB3R\/gzPkE8sAVnU9Vtl\nmzziyLBa48tY77aVYesQYtKq9e5BbgG7vYMPRnsF7zXpoJe7d9AWq7UOPox167wYdnauDgFhTmFR\nMU6h+6i32vuueRevvX8Df1tpNhZgG4tWW97\/ptUWm6yyRGjZ+wL9D8qCZZEiC6DaAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/npc_mail_dispatcher-1308021421.swf",
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
	"mail",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"n"	: "send_mail"
};
itemDef.keys_in_pack = {};

log.info("npc_mail_dispatcher.js LOADED");

// generated ok 2012-10-12 16:12:21 by lizg
