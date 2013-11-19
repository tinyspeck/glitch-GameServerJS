//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Phantom Glitch";
var version = "1344982233";
var name_single = "Phantom Glitch";
var name_plural = "Phantom Glitches";
var article = "a";
var description = "A lonely phantom Glitch, half-thought up and forgotten by the Giants.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["phantom_glitch", "quest_npc", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_offset_x"	: "0",	// defined by phantom_glitch
	"conversation_offset_y"	: "60"	// defined by phantom_glitch
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.npc_name = "";	// defined by quest_npc
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	npc_name : ["Name of this NPC as referenced in the quest."],
};

var instancePropsChoices = {
	ai_debug : [""],
	npc_name : [""],
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

function checkFollow(){ // defined by phantom_glitch
	this.apiCancelTimer('checkFollow');

	if((Math.abs(this.x - this.follow_pc.x) < this.stop_distance * 1.25) && (Math.abs(this.y - this.follow_pc.y) < this.stop_distance)
			&& (Math.abs(this.x - this.follow_pc.x) > this.stop_distance * 0.75)) {
		if (this.follow_pc.x < this.x) {
			this.dir = 'left';
		} else {
			this.dir = 'right';
		}

		this.doQuestCallbackAll('onMoveComplete', {npc_name:this.getName()});
	} else {
		var moveX = (this.follow_pc.x < this.x) ? (this.stop_distance) : (-this.stop_distance);

		// Check and make sure this isn't off the side of the location
		if ((this.follow_pc.x + moveX) > this.container.geo.r || (this.follow_pc.x + moveX) < this.container.geo.l) {
			moveX *= -1;
		} 

		if (this.follow_pc.x + moveX < this.x) {
			this.dir = 'left';
		} else {
			this.dir = 'right';
		}

		this.apiSetTimer('checkFollow', 1000);
		this.apiMoveToXY(this.follow_pc.x + moveX, this.follow_pc.y, 300, 'checkFollow');
	}
}

function msg_move_to_player(details){ // defined by phantom_glitch
	var moveX = (details.pc.x < this.x) ? (details.stop_distance) : (-details.stop_distance);

	this.stop_distance = details.stop_distance;
	this.follow_pc = details.pc;

	this.apiSetTimer('checkFollow', 1000);

	// Check and make sure this isn't off the side of the location
	if ((details.pc.x + moveX) > this.container.geo.r || (details.pc.x + moveX) < this.container.geo.l) {
		moveX *= -1;
	} 

	this.apiMoveToXY(details.pc.x + moveX, details.pc.y, 300, 'checkFollow');

	if (details.pc.x + moveX < this.x) {
		this.dir = 'left';
	} else {
		this.dir = 'right';
	}
	this.setAndBroadcastState('walk');
}

function msg_set_owner(details){ // defined by phantom_glitch
	this.owner = details.owner;
	this.only_visible_to = details.owner.tsid;
}

function onPlayerExit(pc){ // defined by phantom_glitch
	if(this.owner && pc == this.owner) {
		this.apiDelete();
	}
}

function doQuestCallback(pc, quest_id, callback_id, details){ // defined by quest_npc
	if(!this.container) {
		return;
	}

	this.container.quests_do_callback(pc, quest_id, callback_id, details);
}

function doQuestCallbackAll(callback_id, details){ // defined by quest_npc
	if(!this.container) {
		return;
	} 

	this.container.quests_do_callback_all(callback_id, details);
}

function getName(){ // defined by quest_npc
	return this.getInstanceProp('npc_name');
}

function handleDelayedMessage(msg_type, details, delay){ // defined by quest_npc
	log.info("Quest NPC "+this+" received message "+msg_type);

	var msg = 'msg_'+msg_type;

	if(!this[msg]) {
		log.error("Invalid message type "+msg_type+" invoked on NPC "+this);
		return;
	}

	details.callback = msg;

	this.events_add(details, delay);
}

function handleQuestMessage(msg_type, details){ // defined by quest_npc
	log.info("Quest NPC "+this+" received message "+msg_type);

	var msg = 'msg_'+msg_type;

	if(!this[msg]) {
		log.error("Invalid message type "+msg_type+" invoked on NPC "+this);
		return;
	}

	this[msg](details);
}

function moveComplete(){ // defined by quest_npc
	this.doQuestCallbackAll('onMoveComplete', {npc_name:this.getName()});
}

function msg_complete_quest(details){ // defined by quest_npc
	if(!details.pc || !details.quest) {
		log.error("complete_quest message invoked on "+this+" with incorrect parameters.");
	}

	details.pc.completeQuest(details.quest);
}

function msg_conversation_start(details){ // defined by quest_npc
	var conversation_runner = "conversation_run_"+details.conversation;
	if (this[conversation_runner]){
		this[conversation_runner](details.pc, {});
	}
}

function msg_face_direction(details){ // defined by quest_npc
	this.dir = details.dir;
	this.broadcastState();
}

function msg_give_item(details){ // defined by quest_npc
	if(!details || !details.pc || !details.class_tsid || !details.num) {
		log.error("Invoked give_item msg on item "+this+" with incorrect params."); 
	}

	details.pc.createItemFromSource(details.class_tsid, details.num, this, details.destroy_remainder);
}

function msg_itemstack_bubble(details){ // defined by quest_npc
	log.info("Itemstack bubble invoked with params"+details);

	if(!details || !details.txt) {
		log.error("Item "+this+" received invalid params to itemstack_bubble message");
		return;
	}

	if(details.bubble_time) {
		var time = details.bubble_time * 1000;
	} else {
		var time = null;
	}

	var options = {};

	if(details.delta_x) {
		options.delta_x = details.delta_x;
	}
	if(details.delta_y) {
		options.delta_y = details.delta_y;
	}
	if(details.dont_keep_in_bounds) {
		options.dont_keep_in_bounds = true;
	}

	if(details.pc) {
		details.pc.announce_itemstack_bubble(this, details.txt, time, true, options);
	} else {
		this.container.announce_itemstack_bubble_to_all(this, details.txt, time, true, options);
	}
}

function msg_kill(details){ // defined by quest_npc
	this.apiDelete();
}

function msg_local_chat(details){ // defined by quest_npc
	// Display text in local chat

	var label = details.label;
	var tsid = details.label;

	if(details.pc) {
		details.pc.apiSendMsg({type: 'pc_local_chat', pc: {label: label, tsid: tsid}, txt: details.txt});
	} else {
		this.container.apiSendMsg({type: 'pc_local_chat', pc: {label: label, tsid: tsid}, txt: details.txt});
	}
}

function msg_move_to_xy(details){ // defined by quest_npc
	this.apiMoveToXY(details.x, details.y, 200, 'moveComplete');
}

function msg_offer_quest(details){ // defined by quest_npc
	this.setAvailableQuests([details.quest_id]);
	this.offerQuests(details.pc);
}

function msg_remove_delayed_callbacks(details){ // defined by quest_npc
	this.events_remove(function() {return true;});
}

function msg_set_hit_box(details){ // defined by quest_npc
	this.apiSetHitBox(details.x, details.y);
	this.apiSetPlayersCollisions(true);
}

function msg_set_instance_prop(details){ // defined by quest_npc
	if(!details || !details.prop) {
		log.error("Item "+this+" received set_instance_prop message with invalid details.");
		return;
	}

	this.setInstanceProp(details.prop, details.value);
}

function msg_set_state(details){ // defined by quest_npc
	this.setAndBroadcastState(details.state);
}

function onFollowing(args){ // defined by quest_npc
	switch(args.status) {
		case 1:
			if(args.dir == 'left') {
				this.dir == 'right';
			} else {
				this.dir == 'left';
			}
			break;
		default:
			this.moveComplete();
			break;
	}
}

function onPlayerCollision(pc){ // defined by quest_npc
	log.info("NPC collision (from NPC)!");
	this.doQuestCallbackAll('npcCollision', {npc_name: this.getName(), pc:pc});
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

function npc_onPlayerCollision(pc){ // defined by npc
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function conversation_run_give_heart(pc, msg, replay){ // defined by conversation auto-builder for "give_heart"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "give_heart";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['give_heart-0-2'] = {txt: "Don't know what?", value: 'give_heart-0-2'};
		this.conversation_start(pc, "You don’t know…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_heart', msg.choice);
	}

	if (msg.choice == "give_heart-0-2"){
		choices['1']['give_heart-1-2'] = {txt: "I could barely hear you!", value: 'give_heart-1-2'};
		this.conversation_reply(pc, msg, "… How long I’ve been crying for passersby to notice me. It’s as if my screams were only whispers.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_heart', msg.choice);
	}

	if (msg.choice == "give_heart-1-2"){
		choices['2']['give_heart-2-2'] = {txt: "Aw, shucks. It was nothing.", value: 'give_heart-2-2'};
		this.conversation_reply(pc, msg, "And yet, you did. I want to thank you from the bottom of my heart.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_heart', msg.choice);
	}

	if (msg.choice == "give_heart-2-2"){
		choices['3']['give_heart-3-2'] = {txt: "…?", value: 'give_heart-3-2'};
		this.conversation_reply(pc, msg, "No, you… you remembered me when no one else would. I can’t thank...", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_heart', msg.choice);
	}

	if (msg.choice == "give_heart-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "give_heart-3-2") && (!replay)){
		this.container.quests_do_callback(pc, "giveHeart", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

}

var conversations = [
	"give_heart",
];

function parent_msg_move_to_player(details){ // defined by quest_npc
	this.apiWalkAndFollowPlayer(details.pc, details.stop_distance, false, 'onFollowing');
}

function parent_msg_set_owner(details){ // defined by quest_npc
	this.owner = details.owner;
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"npc",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-63,"y":-194,"w":125,"h":194},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFs0lEQVR42s2Y2W8bVRTG8w5PPFBA\nRQgQog9ACYXSlJJmaZIm8RJv8Z6xx+vMeJ+ZeLdjJ3EdO4vr5I3lpa889gkVIQQtpS20pc3aJKRp\n05K0WVzquM7icG4k\/gNiz5WuZMkjze9+95zvnDNVVf\/zYtLpl9Cu4soKpbLvhoazzcHB8xjbd07O\n9CVdVVxbarv9sNUXHCeD4cuEL5AlA+F6TgEq9OSbuIeec0Tif+jc9LzZ679mpv1HOANoZr3ncA9z\nT++i59SUbcngYWfIYOS22RugKgb1XyJQoUiWCkaeeGJ9yzqnJ4fBdkTjKzjN5DSUY9XgZgcqAuhN\nDlno3nPjBrp708h6N41M96aGsr\/Q2pwv2EQqh3vYgtJKbhloNmeivdmywnX3DzQ6e+Kr5m5\/HhLi\nuQpAVKSt2GmyFG3h2IYjGnvgjPY+hitf7bI7n6IDwIFMZbtapjd5xeoPPte76YLSQmypSftWl8M1\nqyKoKVB0UWmhJjWkYwL+vweHuGkP90wyfQMrOMN8cPC+B57njvdvILhOs3VbbiG2Ae6BzGC+14Hh\n83wNtiDs0v0l0uFzMqNlRmNzjJu7A7+7ovGrcN2ZAwf0pzMmdzyRI\/yhfJfNVcQcrnWx3jTLU2vv\nN3cqlpokskdot8gVS3xN14LUYJmB5+4SgdB1b2Lg4oEDhjOjpDMa\/wcsZBOnu4tqwnafp9HeR1D1\nHaLlWp7gCdoNIvFyk0y+hNQElafAem65Yn2XDxwwmMpIyGAoj7vZAsTeisJKLbV0Kh4iuJOt7as1\nLW3rJ8+2rZ1qFzxtEEn+blWq968fc7jvOMKxqwcPOJQ9QQSCeXjhpsJCPkJxh5Sq5QtXAHDtePPZ\n3OdNLRvoN4JulSsfohDA7O679lDPb2XJZLovsWhiuvNau3NRrMfnUOydFu4ruFbT3LqOVPyijbfa\n0CHeV1BqMJVPwX0V0yNpeyh23ehhp+Um62ybUr3YKJE9BrAn1bV1a8fqGtZOCzpWUFzy1F0L8Mw0\nX6GaNjHeH8rWYnl6+y+bWO9NpdU2iSwFKVXHFz4+3njm6al2\/nKztPMRApfg5lmI1XHI9ltMYuB8\n2aqJL5U6i2JK72JuK6zklFhvmEO2gqDaVZpFlL3oaqEeT0AZvOns6f01mBqSlLXk0YmkHpqFa1B3\nbyGVkJ0gc0YbQWsdrgkqEP4TxZ43mf66Ip0225\/62B6JfU\/4QjeQUno3c9sAW2WlpjWUcwpq9TW2\nP\/lNReBCI1lxeCQ7pCEoD9Tbr9zxvhlU0lyx3iueeOIXUO2n8HA2VhE49NJIZuwSxNtam1y5I9Lp\n8zKTNS+3kBfCQ9mjaFd8eIqMjBHghQVIkNLRmpNb9QIhgOJLnGn12WjqtXaVtlAvEJVeefXQ1uG3\n39nlKdUvyGj0ZU4AGlmfspbfsVf95enS+0erCw0dop02uWqX7k1gnAAMDma+VRP2PQlu3D1SfWz7\nxJnmErpunct9seJwqJr408M3YNTcE2iw4pFPP9t878OPANBYwt3MfHBs7K3KAkJnDQmyAEB7UC1K\nAgwvCHWGEuZh92yRWL7iCnqTKR9kbBGagT2oHDs8rW4LYrJERON7aEhCClfcYqCCPIMBvSTBTcVG\nifQZlLddgN3FnO58xTMZmXCrQj3RKJZuywym0hmx9DlPg20pLNSuENNP2vzRyn\/6EOtwXaeFWAbI\nVZnRNF8nFK1DH5gzBwKvc8JmApnMIZiBF6HdfybQYncAdKNJIr3AmUoSHR19A2bedczl2QiPjM4i\n2wkMjhi58\/Fy6DwFXcumIxIrRjKj69BJF4hApJ0TcChJ\/Knhn2EWKcFktwPZ\/LBVoVqRGQzHuaEe\n+JxvYHAcJrqS1GC5A+39j2iig1nkO85csZq0TaBhvV4kuUQFop+AH85iNjd3AHVOOoPGTTTRVXFx\noTh0hONGT7wfP6h3\/AtFUvbEnmsUPQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/phantom_glitch-1342568646.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
	has_status	: false,
	not_selectable	: true,
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
	"npc",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("phantom_glitch.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
