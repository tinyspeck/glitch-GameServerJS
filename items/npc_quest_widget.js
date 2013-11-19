//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Greeterbot Sentry G-42";
var version = "1344982233";
var name_single = "Greeterbot Sentry G-42";
var name_plural = "Greeterbot Sentries G-42";
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
var parent_classes = ["npc_quest_widget", "quest_npc", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "Speak with me again once you have reviewed the exhibits."	// defined by npc (overridden by npc_quest_widget)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.npc_name = "";	// defined by quest_npc
	this.instanceProps.variant = "widgetWood";	// defined by npc_quest_widget
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	npc_name : ["Name of this NPC as referenced in the quest."],
	variant : ["variant of widget to display"],
};

var instancePropsChoices = {
	ai_debug : [""],
	npc_name : [""],
	variant : ["widgetGreen","widgetWhite","widgetPink","widgetTin","widgetWood"],
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

function make_config(){ // defined by npc_quest_widget
	return { variant: this.getInstanceProp('variant') || "widgetPink" };
}

function msg_move_to_player(details){ // defined by npc_quest_widget
	if(details.x > this.x) {
		this.dir = 'left';
	} else {
		this.dir = 'right';
	}
	this.apiWalkAndFollowPlayer(details.pc, details.stop_distance, false, 'onFollowing');
}

function msg_move_to_xy(details){ // defined by npc_quest_widget
	if(details.x > this.x) {
		this.dir = 'left';
	} else {
		this.dir = 'right';
	}
	this.apiFindPath(details.x, details.y, 0, 'onPathing');
}

function onCreate(){ // defined by npc_quest_widget
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_walk_speed = 300;
	this.npc_climb_speed = 200;
	this.item_height = 50;
	this.item_width = 50;

	this.y_offset = 60;
}

function onFollowing(args){ // defined by npc_quest_widget
	switch(args.status) {
		case 1:
			if(args.dir == 'left') {
				this.dir == 'right';
			} else {
				this.dir == 'left';
			}
			this.setAndBroadcastState('move');
			break;
		default:
			this.setAndBroadcastState('idle');
			this.moveComplete();
			break;
	}
}

function onPathing(args){ // defined by npc_quest_widget
	switch(args.status) {
		case 1:
			if(args.dir == 'left') {
				this.dir == 'right';
			} else {
				this.dir == 'left';
			}
			this.setAndBroadcastState('move');
			break;
		default:
			this.setAndBroadcastState('idle');
			this.moveComplete();
			break;
	}
}

function onPropsChanged(){ // defined by npc_quest_widget
	this.broadcastConfig();
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

function msg_set_owner(details){ // defined by quest_npc
	this.owner = details.owner;
}

function msg_set_state(details){ // defined by quest_npc
	this.setAndBroadcastState(details.state);
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

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
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

function conversation_run_rook_museum_enter(pc, msg, replay){ // defined by conversation auto-builder for "rook_museum_enter"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rook_museum_enter";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	choices['8'] = {};
	choices['9'] = {};
	choices['10'] = {};
	choices['11'] = {};
	if (!msg.choice){
		choices['0']['rook_museum_enter-0-2'] = {txt: "Yeah, let me at 'em!", value: 'rook_museum_enter-0-2'};
		choices['0']['rook_museum_enter-0-3'] = {txt: "I'm not so sure.", value: 'rook_museum_enter-0-3'};
		this.conversation_start(pc, "Let me ask you this: do you believe yourself ready to fight the Rook?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-0-2"){
		choices['1']['rook_museum_enter-1-2'] = {txt: "With strong language and, if that failed, punches.", value: 'rook_museum_enter-1-2'};
		this.conversation_reply(pc, msg, "And if the Rook were to strike now, what would you do? How would you fight back?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-1-2"){
		choices['2']['rook_museum_enter-2-2'] = {txt: "Then what can I do?", value: 'rook_museum_enter-2-2'};
		this.conversation_reply(pc, msg, "The Rook is an agent of destruction! Anger, fear, aggression; the Rook's allies are they. You cannot stop the Rook merely by force of arms.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-2-2"){
		choices['3']['rook_museum_enter-3-2'] = {txt: "Wow.", value: 'rook_museum_enter-3-2'};
		this.conversation_reply(pc, msg, "Look to the past for your answers. The exhibits here detail the discoveries of Glitches who asked themselves that very same question. Peering deep within themselves, they uncovered hidden powers to wield against the Rook.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-3-2"){
		choices['4']['rook_museum_enter-4-2'] = {txt: "OK, I will.", value: 'rook_museum_enter-4-2'};
		this.conversation_reply(pc, msg, "You can do the same. You too can bear that terrible burden: to stand up in defence of Ur and repel the Rook. Examine the paintings and artifacts of the museum, learn all you can about the weapons of your ancestors, and speak with me again when you are done.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if ((msg.choice == "rook_museum_enter-4-2") && (!replay)){
		this.container.quests_do_callback(pc, "widgetConversation", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "rook_museum_enter-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "rook_museum_enter-0-3"){
		choices['7']['rook_museum_enter-7-2'] = {txt: "But it can be stopped?", value: 'rook_museum_enter-7-2'};
		this.conversation_reply(pc, msg, "You do well to be wary, for to fight against the Rook is no trifling matter! Many believe the Rook to originate from outside the minds of the giants. It is an invading force, a parasite of imagination, fearsome and terrible.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-7-2"){
		choices['8']['rook_museum_enter-8-2'] = {txt: "Can they teach me how to fight the Rook?", value: 'rook_museum_enter-8-2'};
		this.conversation_reply(pc, msg, "No one knows how to stop the Rook for good, but it can be repelled for a time. The ancients discovered methods for this. The relics and chronicles of their battles against the Rook are displayed here.", choices['8'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if (msg.choice == "rook_museum_enter-8-2"){
		choices['9']['rook_museum_enter-9-2'] = {txt: "OK, I'll do that.", value: 'rook_museum_enter-9-2'};
		this.conversation_reply(pc, msg, "Perhaps they can. Study the exhibits, learn all you can about the weapons of your ancestors, and then speak with me when you are done. We may make a mighty guardian of you yet.", choices['9'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_enter', msg.choice);
	}

	if ((msg.choice == "rook_museum_enter-9-2") && (!replay)){
		this.container.quests_do_callback(pc, "widgetConversation", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "rook_museum_enter-9-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_rook_museum_nag(pc, msg, replay){ // defined by conversation auto-builder for "rook_museum_nag"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rook_museum_nag";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['rook_museum_nag-0-2'] = {txt: "Oh, OK.", value: 'rook_museum_nag-0-2'};
		this.conversation_start(pc, "It is imperative that you learn about each exhibit in the museum. Please press the button next to each painting or artifact to learn more about the history of our conflict with the Rook.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rook_museum_nag', msg.choice);
	}

	if (msg.choice == "rook_museum_nag-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "rook_museum_nag-0-2") && (!replay)){
		this.container.quests_do_callback(pc, "widgetConversation", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

}

var conversations = [
	"rook_museum_enter",
	"rook_museum_nag",
];

function parent_msg_move_to_player(details){ // defined by quest_npc
	this.apiWalkAndFollowPlayer(details.pc, details.stop_distance, false, 'onFollowing');
}

function parent_msg_move_to_xy(details){ // defined by quest_npc
	this.apiMoveToXY(details.x, details.y, 200, 'moveComplete');
}

function parent_onFollowing(args){ // defined by quest_npc
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

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-85,"w":72,"h":84},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKgUlEQVR42s2YeVCTdxrHsbXutrZ1\n2tndtjOt03Z6qKN4AIIHAiJClDu8ISckARIIUUTuM4T7DCFcCSSEhCsEgRAgCqgobmVrRW29be26\nrbvu1qPdcW2nf+w++\/zeaqfd2dl2omt5Z37zQvIen99zfp+4uDyi47iVevqgjVoxNRa93GqlnnSZ\nT4fV6vvsmeOS7MtzcvjwPcnfj4zzcuYV4ISN7XlqJv7o9UtpcOW0\/F\/TDp5BrfZ\/af5Y0BS89KCN\n3XB8Unj38Cj39khfZIHVumLRvLKiSbdtaXOlf5mq2E+p0Xg+7zLfjt5a5rKGfEZn0W7fGl9fl4Xz\nK0ko6slhvSCks451viIzaFzKX78aP14wbwCHW9mvD7Wwm3pU1Df1+YzbOUmbS7jcVS\/MD+s1U8+O\nGgUJjk7RjX0tXGivCIeqbMZsRqJvMIPx1q9+UbhpK\/XsUAuLb2\/nXZzqSYCJbgmMdohBX826m7\/b\nzyZmrfajVrj8Mtl8zkotOmQWhowj3FBzNAy3sKG7NhyaixhQsscP0uM3gozvPpLIXr32scfjtMJ3\n4bhB4O4wCIYHEW5fEwvsOi50IWCTIgiqMvyhaLcPpMdtuCuP8VAL2Wtef6yQ9nbqDbuWYxhqZoO5\nOhysGooG7K6NgKZCBqhytqMVfSE3cTPsFXvdlnDdCjjB7\/zmsSXFWDtfMtzK+caiiYZeNRvs+lh6\n9apZoMck0RTsgIq0rVAo3wIZCRshied+WhS1OpiiXP7\/ImKyg\/v2uCF2wmGSwMxQOrzvyIfTB4tg\ndjwbJvvkMNEjg32tsdBUFPJtcYrvt5kSGhBEUWuqKMZbv30kEHpV4IvW6h0vW8sZP3qgQuHyxFCb\nwMdhSvzq4u+r4dYlPdy6rIcvLrTAtblaOHOoEOYm8+DkgWwY65TcU+XvuEesuFu4HuJZayeFkWs8\nHgoMwGXBcFsUY0hLlQ5rqbphHVUx2cmLuHqycgn5fqyF+4LDGJc3O5YLty8b4M7HnXDrigFuIuBf\nPtLAldkKOHukCD46nA\/HbHuhR8ODyoxtkCXZBDKB+5149to4inoIETFiCH3Opos+O2Zgw1gHLgPn\nn+MdvCudKj6LfG\/Tilbs04nODxt3w9UP1AjZDrcu6uCL841w42wDfH66Hj55vxqOj+XAVH8K2I0S\n0BQGQ4HMG1JFXpDIc2sWha18zWlAh4b3PBbdrxAShtv4YGlkg6aI8WVRWkAace9wu9C3SxMD6lI+\nXD5eAzcvttLrrwh3Ay1482IbnJuphKZyPpRkhkNXYyzoyiNBgW7eI\/QECc9tRshy9XoIZUwtmrHK\nzkxiR7AbpUBgKrN3\/jmR57XJqPD99WALmzvaKYVTh8vRrU30+tv5JrRcHVw\/o4abl9rQxWUIyIHS\nrDAw4\/2G6ii6Lu5BC8ZHr7skpNYEOA148qTkqfdse46ecKTT2divFUGDMuLzeKanq7lm++IBTZR0\nVC+EM5MFcHmmGD47WQ3XTlTBhaNKuHK8Ej75Qw3MHciBQ\/1yGMMstxvEYMCyU5sdAFnSTSDluM2J\nqFU+zgPqJE\/tN4ksU13xYNGgexUhsDdu42dC5vK3J8yCxbbWaCkpyv0NLBhs5cPBXilM9yXBhDkB\nDluS4UCXFHo1HOiqj4bO2igwVJLOwqAB85O3QLJg\/UQstcrNaUAFtrChJmb1iJYLupJgqEj3h2S+\nx1VJ8CvPEMD9HTwp6bsdFaHQjC\/urosAi5qJKwq7SRQYK8OgNisAyvZuhUq8l3SUhrxAqMncBtlo\nwSS+x0gMc53rQwC6PGHRREpJf9WV7KRfliXZ+EdBhOvvCOCEKUY62sYDc00YtOEGelXM+4DfLQJO\nrFWOXaQaodQIRxb5PwfbXlGK36y+Ikw22s7d8WDZdZzN9saQN3Q6t6d+DuMCS12IV09dJHTVREBj\nYRAU7fK5Wyj3tmLrMnZUhh8b1\/NpmM7qMPrcW\/\/d6iefVYVCQz5aDDdWl70d6nO3g+r+0uCzjJWh\nX\/aqIi+gxee6VZFzPbgsDcxjFnXkSJ8qMkKnCH7mp7uIIvDFRkXQn\/BBNKSmIIh2VzE2\/4YCBuw3\nCGBfIwtMCEjcSq4jlhzA2EQA2vWagkBoxPsIILEkcXWrcgduIJwOhwFUP\/14fR9ujCyy0faykDN1\nGQFUauqGp\/+3m3HgyZVtKq7LCQB9WQjtyvrcQChN9aNftt8QAyQOSfwRmdVVg\/UOVcxgMwqF8mAa\nRF8WDIbyEHTvdijD+4iLyUb15aH0tX31CImbJJuyNkTRz2hV7gTs3bZcifcrP2lFEXvlaxmSDRm5\nss0TeTLve5nSjZCChTYXO8IBYwyMaDmYyUwalFjwQQwSOG3xTvqFJpRhdRiP+FLIwQTJlm6GgmTv\n6+XpWx0Yp331eUF9pprw83jftwSaWL44xedOusjLU+L2M+KR2vbmEnG068pkvntAEm8tQxy9llGb\nH5gyZRYByi3aNUT\/EcCBRor+u522XCj9WWdVGF0FiFjIQskljloDgvBVU0nsNTuz4za8RZa5KjSx\nT8X8lLidhERpqi+kxnqwxKHvPueUip4yCwInTbEwjoA9CETcTx5Osv5BPBHXE0CS0SXo3gKsf6QX\ny\/geIGSuHYkJXfl9mRk3cJhowSs9eA+xNhkVsCUKKOrNJc5UoQUjraxNWBZo9UyShLhzQMOiIYkF\nSUxiZpKApws0cW8+whErklaXwFn3ozo4ZRJycZa52l5Kau5WUO72BTnfo4IX6fqqc1K\/LdoDZ2Ba\n4psxzoiVyLBEygzGE8ZlFJjQtSRBSDwS2U8AySIx\/J+Ah7uFYoeBf01bHAwluBlibRS3lpjw1e84\nCchDQA7tSpKFxLU2TBhSN0nMEUByNlSE0NMdsUgmxl8m6sG0uA3Ezf2CiJXLHzxvxipVYl29eT+D\ngVbf\/PVDYp77uw8FSJeVpuj72UxBC1qrrfS7eDQiXHvpTrr2EcvtRTACSM5ynruKH7n8+zJyeiKr\nbdae9g+bIQ6MKg40lTKhYE\/gx9kyf+eUt6UhYmV3HfNTMxZwYsFRepILBx3CdWCRNmInaUO4HlUE\nDZ2N7U0esx7kAg+Qct2I3KombfP7+cYk7jjSn\/i1wxQPfU180FYwIU3ifT1Z4OXp3M+8dvmyw9bk\nU4NaAXYDDoxj0TZjspAgJ0lDIElskkwmbiOiIU\/uA3m7\/CBL5gdpCVtSfvhziFYZ5G\/VsM7pSkOg\nHnu2Qu5zA+dovoRycyqLXSZ6hcsmexJOHd0nhw\/2Z+JwlAUfODJhdjQNpgd2wX6UW+OmBBjtTEDB\ni2dzIgx1JIBJI4BaRQTkpQQW\/vDlKE4WkgGtKnPr+rK9\/n6Z8Z6v3p9ZnBvy7Tpq6YiWPWDDODzY\nFQfTFhlgDMGHh\/Lh\/NEiODutwBG0AE44cuDoYCoMtomhuTQSyjICIS1+49cJ3HWpgu2ui\/9bCSNK\n6lFMpAt61aEv2ZrZqSgYPiIZS1xK4k2dFwRaLNwkWTQoKoiiIVmMiXInVew5hh2JmSVx0nXOgFop\nalFtmv+K+tyA5MosP2V5mp9SlRegrM3xVxbt8lbuEXnmJPHdwoXUipfxeqet82+5p7M924SUOwAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/npc_quest_widget-1313014427.swf",
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
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_quest_widget.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
