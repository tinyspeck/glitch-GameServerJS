//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Letter Block";
var version = "1344982233";
var name_single = "Letter Block";
var name_plural = "Letter Blocks";
var article = "a";
var description = "A block with a letter on it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_letterblock", "quest_npc", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.npc_name = "";	// defined by quest_npc
	this.instanceProps.variant = "A";	// defined by npc_letterblock
	this.instanceProps.can_receive = "";	// defined by npc_letterblock
	this.instanceProps.can_leave = "";	// defined by npc_letterblock
	this.instanceProps.can_change_letter = "";	// defined by npc_letterblock
	this.instanceProps.can_start = "";	// defined by npc_letterblock
	this.instanceProps.can_talk = "";	// defined by npc_letterblock
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	npc_name : ["Name of this NPC as referenced in the quest."],
	variant : ["Letter to indicate on the letter block"],
	can_receive : ["Can receive an object from the player"],
	can_leave : ["This block will let you leave the area"],
	can_change_letter : ["You can change the letter shown by this block to any of these."],
	can_start : ["Block prompts player to start"],
	can_talk : ["Can talk to Mr. Block"],
};

var instancePropsChoices = {
	ai_debug : [""],
	npc_name : [""],
	variant : ["A","B","E","M","S","T"],
	can_receive : [""],
	can_leave : [""],
	can_change_letter : [""],
	can_start : [""],
	can_talk : [""],
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

verbs.talk_to = { // defined by npc_letterblock
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Talk to Mr. Block",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!this.getInstanceProp('can_talk')) {
			return {state: null};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		this.doQuestCallbackAll('talkedToBlock', {pc: pc});

		return failed ? false : true;
	}
};

verbs.start = { // defined by npc_letterblock
	"name"				: "start",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Begin playing Mr. Block's game",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!this.getInstanceProp('can_start')) {
			return {state: null};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		this.doQuestCallbackAll('blockStart', {pc: pc});

		return failed ? false : true;
	}
};

verbs.leave = { // defined by npc_letterblock
	"name"				: "leave",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Get yourself out of here!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!this.getInstanceProp('can_leave')) {
			return {state: null};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		this.doQuestCallbackAll('blockWantLeave', {pc: pc});

		return failed ? false : true;
	}
};

verbs.give = { // defined by npc_letterblock
	"name"				: "give",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Give Mr. Block an item",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Give {$stack_name} to Mr. Block.",
	"drop_ok_code"			: function(stack, pc){

		var letter = stack.label.substring(0,1).toUpperCase();

		if(letter == this.getInstanceProp('variant')) {
			return true;
		} else {
			return false;
		}
	},
	"conditions"			: function(pc, drop_stack){

		if(this.getInstanceProp('can_receive')) {
			return {state: 'enabled'};
		} else {
			return {state: null};
		}
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			uniques[it.class_tsid] = it.tsid;
		}

		var possibles = [];
		for (var i in uniques){
			var stack = apiFindObject(uniques[i]);
			if (stack) {
				var letter = stack.label.substring(0,1).toUpperCase();

				if(letter == this.getInstanceProp('variant')) {
					possibles.push(i);
				}
			}
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			this.doQuestCallbackAll('noItems', {pc: pc});
			return {
				'ok' : 0,
				'txt' : "You don't have anything the "+this.name_single+" wants!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if(msg.target_itemstack_tsid) {
			var stack = apiFindObject(msg.target_itemstack_tsid);
			if (stack) {
				var letter = stack.label.substring(0,1).toUpperCase();

				if(letter == this.getInstanceProp('variant')) {
					this.doQuestCallbackAll('correctItem', {pc: pc, tsid: msg.target_itemstack_tsid});
				} else {
					this.doQuestCallbackAll('incorrectItem', {pc: pc});
				}
			} else {
				failed = true;
			}	
		} else {
			var prop = apiFindItemPrototype(msg.target_item_class);
			if (prop) {
				var letter = prop.label.substring(0,1).toUpperCase();

				if(letter == this.getInstanceProp('variant')) {
					this.doQuestCallbackAll('correctItem', {pc: pc, item_class: msg.target_item_class});
				} else {
					this.doQuestCallbackAll('incorrectItem', {pc: pc});
				}
			} else {
				failed = true;
			}
		}

		return failed ? false : true;
	}
};

function changeLetter(letter){ // defined by npc_letterblock
	if(this.getInstanceProp('variant') == letter) {
		return;
	}

	this.changing_letter = true;
	this.next_letter = letter;
	this.setAndBroadcastState('spin_out');
	this.apiSetTimer('doSpin', 400);
}

function make_config(){ // defined by npc_letterblock
	var variant = this.getInstanceProp('variant');
	return {variant: variant ? variant : 'A'};
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

function msg_move_to_player(details){ // defined by quest_npc
	this.apiWalkAndFollowPlayer(details.pc, details.stop_distance, false, 'onFollowing');
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

function msg_set_owner(details){ // defined by quest_npc
	this.owner = details.owner;
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function conversation_run_blocks_request(pc, msg, replay){ // defined by conversation auto-builder for "blocks_request"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "blocks_request";
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
	choices['12'] = {};
	choices['13'] = {};
	if (!msg.choice){
		choices['0']['blocks_request-0-2'] = {txt: "Me?", value: 'blocks_request-0-2'};
		this.conversation_start(pc, "Hello! Hello! Young person!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if (msg.choice == "blocks_request-0-2"){
		choices['1']['blocks_request-1-2'] = {txt: "Is it a fun game?", value: 'blocks_request-1-2'};
		this.conversation_reply(pc, msg, "Yes, you. You have the look of a promising young abecedarian about you. Perhaps you would like to play a game?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'A')){
		choices['2']['blocks_request-2-2'] = {txt: "Hm... let me check.", value: 'blocks_request-2-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter A for my collection of vocalic objects. Would you have anything of that nature about your person? Can you give me an apple? An airplane? Perhaps a captive aardvark?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'B')){
		choices['3']['blocks_request-3-2'] = {txt: "Maybe I can!", value: 'blocks_request-3-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter B for my collection of consonantal objects. Would you have anything of that nature about your person? Can you give me a banana? A balloon? Perhaps a small bazooka?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'E')){
		choices['4']['blocks_request-4-2'] = {txt: "I'm not sure!", value: 'blocks_request-4-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter E for my collection of vocalic objects. Would you have anything of that nature about your person? Can you give me an egg? An earwig? Even a stately equestrian?", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'M')){
		choices['5']['blocks_request-5-2'] = {txt: "It's possible…", value: 'blocks_request-5-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter M for my collection of consonantal objects. Would you have anything of that nature about your person? Can you give me a mangosteen? A mole? Possibly a pail of molten magma?", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'S')){
		choices['6']['blocks_request-6-2'] = {txt: "Let me check my pack…", value: 'blocks_request-6-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter S for my collection of consonantal objects. Would you have anything of that nature about your person? Can you give me a strawberry? A shrug? Maybe a slithering serpent?", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if ((msg.choice == "blocks_request-1-2") && (this.getInstanceProp('variant') == 'T')){
		choices['7']['blocks_request-7-2'] = {txt: "I might have something like that…", value: 'blocks_request-7-2'};
		this.conversation_reply(pc, msg, "Why, all my games are fun games! I need you to find me something that starts with the letter T for my collection of consonantal objects. Would you have anything of that nature about your person? Can you give me a tomato? a tomahawk? Just some miscellaneous tchotchke?", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'blocks_request', msg.choice);
	}

	if (msg.choice == "blocks_request-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "blocks_request-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "blocks_request-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "blocks_request-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "blocks_request-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "blocks_request-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_want_leave(pc, msg, replay){ // defined by conversation auto-builder for "want_leave"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "want_leave";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['want_leave-0-2'] = {txt: "Leave", value: 'want_leave-0-2'};
		choices['0']['want_leave-0-3'] = {txt: "Stay", value: 'want_leave-0-3'};
		this.conversation_start(pc, "Oh, are you not having fun here? Would you prefer to leave?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'want_leave', msg.choice);
	}

	if (msg.choice == "want_leave-0-2"){
		choices['1']['want_leave-1-2'] = {txt: "Thanks.", value: 'want_leave-1-2'};
		this.conversation_reply(pc, msg, "Well, if you decide to come back later, tell your Magic Rock and it will help you find your way.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'want_leave', msg.choice);
	}

	if ((msg.choice == "want_leave-1-2") && (!replay)){
		this.container.quests_do_callback(pc, "leaveInstance", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "want_leave-0-3"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "want_leave-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_four_letter_word(pc, msg, replay){ // defined by conversation auto-builder for "four_letter_word"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "four_letter_word";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['four_letter_word-0-2'] = {txt: "I bet I can solve them!", value: 'four_letter_word-0-2'};
		this.conversation_start(pc, "Hello! Hello, young person! I'm in desperate need of some help. I've been trying to solve these three riddles for hours, but I'm absolutely dreadful with riddles.", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word', msg.choice);
	}

	if (msg.choice == "four_letter_word-0-2"){
		choices['1']['four_letter_word-1-2'] = {txt: "Uh, what?", value: 'four_letter_word-1-2'};
		this.conversation_reply(pc, msg, "You charming soul! Here is the first: <b>Through waves that roll and winds that whip, this stands tall from a mighty ship.<\/b>", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word', msg.choice);
	}

	if (msg.choice == "four_letter_word-1-2"){
		choices['2']['four_letter_word-2-2'] = {txt: "No, I can do it! Just say it again, please.", value: 'four_letter_word-2-2'};
		this.conversation_reply(pc, msg, "Oh dear, oh dear. I knew it was too difficult.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word', msg.choice);
	}

	if (msg.choice == "four_letter_word-2-2"){
		choices['3']['four_letter_word-3-2'] = {txt: "OK. I'm thinking now…", value: 'four_letter_word-3-2'};
		this.conversation_reply(pc, msg, "<b>Through waves that roll and winds that whip, this stands tall from a mighty ship..<\/b>", choices['3'], null, null, first_property(choices['3']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word', msg.choice);
	}

	if (msg.choice == "four_letter_word-3-2"){
		choices['4']['four_letter_word-4-2'] = {txt: "OK!", value: 'four_letter_word-4-2'};
		this.conversation_reply(pc, msg, "When you have the answer, spin these letter blocks to spell it out.", choices['4'], null, null, first_property(choices['4']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word', msg.choice);
	}

	if ((msg.choice == "four_letter_word-4-2") && (!replay)){
		this.container.quests_do_callback(pc, "createBlocks", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "four_letter_word-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_spelled_word(pc, msg, replay){ // defined by conversation auto-builder for "spelled_word"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "spelled_word";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['spelled_word-0-2'] = {txt: "Nope. It was kind of easy.", value: 'spelled_word-0-2'};
		this.conversation_start(pc, "Goodness. My flabber is well and truly ghasted. Are you sure you haven't heard this riddle before?", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelled_word', msg.choice);
	}

	if (msg.choice == "spelled_word-0-2"){
		choices['1']['spelled_word-1-2'] = {txt: "Well, thank you.", value: 'spelled_word-1-2'};
		this.conversation_reply(pc, msg, "Easy? Well, if you say so. I still bow to your staggering intellect.", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelled_word', msg.choice);
	}

	if (msg.choice == "spelled_word-1-2"){
		choices['2']['spelled_word-2-2'] = {txt: "OK", value: 'spelled_word-2-2'};
		this.conversation_reply(pc, msg, "Now if you don't mind, I'd like to be alone now to ponder these riddles.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelled_word', msg.choice);
	}

	if (msg.choice == "spelled_word-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "spelled_word-2-2") && (!replay)){
		this.container.quests_do_callback(pc, "solveRiddle", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

}

function conversation_run_anagrams(pc, msg, replay){ // defined by conversation auto-builder for "anagrams"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "anagrams";
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
	if (!msg.choice){
		choices['0']['anagrams-0-2'] = {txt: "Well, OK!", value: 'anagrams-0-2'};
		this.conversation_start(pc, "Hello! Hello! My friend, I am so glad to see you again. I have a game of utmost import, and you simply must assist me!", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-0-2"){
		choices['1']['anagrams-1-2'] = {txt: "Sounds simple enough.", value: 'anagrams-1-2'};
		this.conversation_reply(pc, msg, "The game is simple, but at the same time oh so difficult! From a pool of six different letters—A, B, E, M, S and T—you must make as many three letter words as you can within the space of three minutes.", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-1-2"){
		choices['2']['anagrams-2-2'] = {txt: "I'm certain I can do it.", value: 'anagrams-2-2'};
		this.conversation_reply(pc, msg, "Is it? Many have tried, only to face the embarrassment of crushing defeat.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-2-2"){
		choices['3']['anagrams-3-2'] = {txt: "Yeah, no pressure or anything.", value: 'anagrams-3-2'};
		this.conversation_reply(pc, msg, "Then I wish you luck, my young friend. I'm exceptionally excited about this one. All my hopes and dreams are riding on your shoulders.", choices['3'], null, null, first_property(choices['3']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-3-2"){
		choices['4']['anagrams-4-2'] = {txt: "Yes, I'm ready.", value: 'anagrams-4-2'};
		choices['4']['anagrams-4-3'] = {txt: "No, I'm not ready.", value: 'anagrams-4-3'};
		this.conversation_reply(pc, msg, "Remember, you will only have three minutes to spell as many three letter words using only A, B, E, M, S and T. Are you ready to start now?", choices['4'], null, null, first_property(choices['4']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "anagrams-4-2") && (!replay)){
		this.container.quests_do_callback(pc, "createBlocks", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "anagrams-4-3"){
		choices['6']['anagrams-6-2'] = {txt: "OK", value: 'anagrams-6-2'};
		this.conversation_reply(pc, msg, "Very well. Come talk to me when you feel you are ready.", choices['6'], null, null, first_property(choices['6']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagrams', msg.choice);
	}

	if (msg.choice == "anagrams-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_done_spelling_1(pc, msg, replay){ // defined by conversation auto-builder for "done_spelling_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "done_spelling_1";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['done_spelling_1-0-2'] = {txt: "Was that not good?", value: 'done_spelling_1-0-2'};
		this.conversation_start(pc, "Oh.", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_1', msg.choice);
	}

	if (msg.choice == "done_spelling_1-0-2"){
		choices['1']['done_spelling_1-1-2'] = {txt: "Well, I did what I could.", value: 'done_spelling_1-1-2'};
		this.conversation_reply(pc, msg, "No. That was… well, it was fine. You tried admirably against impossible odds.", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_1', msg.choice);
	}

	if (msg.choice == "done_spelling_1-1-2"){
		choices['2']['done_spelling_1-2-2'] = {txt: "Gladly.", value: 'done_spelling_1-2-2'};
		this.conversation_reply(pc, msg, "… Which is all that can be asked of anyone! As a reward, please accept 200 iMG and 20 favor with Friendly, the Giant of writing.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_1', msg.choice);
	}

	if (msg.choice == "done_spelling_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "done_spelling_1-2-2") && (!replay)){
		this.container.quests_do_callback(pc, "finishQuest", {pc: pc, name: this.getInstanceProp('npc_name')});
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(200 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		pc.stats_add_favor_points("friendly", 20);
	}

}

function conversation_run_done_spelling_3(pc, msg, replay){ // defined by conversation auto-builder for "done_spelling_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "done_spelling_3";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['done_spelling_3-0-2'] = {txt: "Thanks.", value: 'done_spelling_3-0-2'};
		this.conversation_start(pc, "Excellent work!", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_3', msg.choice);
	}

	if (msg.choice == "done_spelling_3-0-2"){
		choices['1']['done_spelling_3-1-2'] = {txt: "Gladly!", value: 'done_spelling_3-1-2'};
		this.conversation_reply(pc, msg, "Yes, quite splendid indeed. As a reward, please accept 400 iMG and 40 favor with Friendly, the Giant of writing.", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_3', msg.choice);
	}

	if (msg.choice == "done_spelling_3-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "done_spelling_3-1-2") && (!replay)){
		this.container.quests_do_callback(pc, "finishQuest", {pc: pc, name: this.getInstanceProp('npc_name')});
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(400 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		pc.stats_add_favor_points("friendly", 40);
	}

}

function conversation_run_done_spelling_5(pc, msg, replay){ // defined by conversation auto-builder for "done_spelling_5"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "done_spelling_5";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['done_spelling_5-0-2'] = {txt: "Was that good?", value: 'done_spelling_5-0-2'};
		this.conversation_start(pc, "Oh my.", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_5', msg.choice);
	}

	if (msg.choice == "done_spelling_5-0-2"){
		choices['1']['done_spelling_5-1-2'] = {txt: "Aw, shucks.", value: 'done_spelling_5-1-2'};
		this.conversation_reply(pc, msg, "Good? My young friend, that was simply magnificent. Breathtaking!", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_5', msg.choice);
	}

	if (msg.choice == "done_spelling_5-1-2"){
		choices['2']['done_spelling_5-2-2'] = {txt: "Gladly!", value: 'done_spelling_5-2-2'};
		this.conversation_reply(pc, msg, "For your outstanding accomplishments in the field of spelling, please accept 800 iMG and 80 favor with Friendly, the Giant of writing.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'done_spelling_5', msg.choice);
	}

	if ((msg.choice == "done_spelling_5-2-2") && (!replay)){
		this.container.quests_do_callback(pc, "finishQuest", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "done_spelling_5-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "done_spelling_5-2-2") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(800 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		pc.stats_add_favor_points("friendly", 80);
	}

}

function conversation_run_anagram_start(pc, msg, replay){ // defined by conversation auto-builder for "anagram_start"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "anagram_start";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['anagram_start-0-2'] = {txt: "Yes", value: 'anagram_start-0-2'};
		choices['0']['anagram_start-0-3'] = {txt: "No", value: 'anagram_start-0-3'};
		this.conversation_start(pc, "Ah, are you ready to begin?", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagram_start', msg.choice);
	}

	if (msg.choice == "anagram_start-0-2"){
		choices['1']['anagram_start-1-2'] = {txt: "OK!", value: 'anagram_start-1-2'};
		this.conversation_reply(pc, msg, "Then you have three minutes to spell as many words as you can with the letters A, B, E, M, S and T. Begin!", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagram_start', msg.choice);
	}

	if (msg.choice == "anagram_start-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "anagram_start-1-2") && (!replay)){
		this.container.quests_do_callback(pc, "createBlocks", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "anagram_start-0-3"){
		choices['3']['anagram_start-3-2'] = {txt: "Thanks!", value: 'anagram_start-3-2'};
		this.conversation_reply(pc, msg, "Hrmph. Take your time, then. It's better that you be prepared, after all.", choices['3'], null, null, first_property(choices['3']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagram_start', msg.choice);
	}

	if (msg.choice == "anagram_start-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_no_items(pc, msg, replay){ // defined by conversation auto-builder for "no_items"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "no_items";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['no_items-0-2'] = {txt: "Sorry.", value: 'no_items-0-2'};
		this.conversation_start(pc, "Oh dear, you don't seem to have any items beginning with the correct letter, not one.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_items', msg.choice);
	}

	if (msg.choice == "no_items-0-2"){
		choices['1']['no_items-1-2'] = {txt: "Sounds like a plan.", value: 'no_items-1-2'};
		this.conversation_reply(pc, msg, "No, it's fine. In fact, the game will be more fun this way! You're going to need to be re-embiggened to go find an item beginning with the correct letter.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_items', msg.choice);
	}

	if (msg.choice == "no_items-1-2"){
		choices['2']['no_items-2-2'] = {txt: "Will do.", value: 'no_items-2-2'};
		this.conversation_reply(pc, msg, "You can talk to your Magic Rock whenever you please to return here. Please keep an eye out for an appropriately named item.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_items', msg.choice);
	}

	if (msg.choice == "no_items-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "no_items-2-2") && (!replay)){
		this.container.quests_do_callback(pc, "leaveInstance", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

}

function conversation_run_letter_match_explain(pc, msg, replay){ // defined by conversation auto-builder for "letter_match_explain"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "letter_match_explain";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['letter_match_explain-0-2'] = {txt: "OK", value: 'letter_match_explain-0-2'};
		this.conversation_start(pc, "You see, I'm trying to start a collection of items that start with my particular letter of choice. If you could bring me one, I would be most grateful. Plus, I believe the entire exercise will be terrific fun!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'letter_match_explain', msg.choice);
	}

	if (msg.choice == "letter_match_explain-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_riddle_explain(pc, msg, replay){ // defined by conversation auto-builder for "riddle_explain"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "riddle_explain";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['riddle_explain-0-2'] = {txt: "Hm…", value: 'riddle_explain-0-2'};
		this.conversation_start(pc, "Yes: <b>Through waves that roll and winds that whip, this stands tall from a mighty ship.<\/b> What could it possibly mean? Isn't this exciting?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'riddle_explain', msg.choice);
	}

	if (msg.choice == "riddle_explain-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_anagram_explain(pc, msg, replay){ // defined by conversation auto-builder for "anagram_explain"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "anagram_explain";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['anagram_explain-0-2'] = {txt: "Gotcha.", value: 'anagram_explain-0-2'};
		this.conversation_start(pc, "Yes, you'll need to make as many three-letter words as you possibly can using only the letters A, B, E, M, S and T. It's trickier than it sounds!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'anagram_explain', msg.choice);
	}

	if (msg.choice == "anagram_explain-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_four_letter_word_2(pc, msg, replay){ // defined by conversation auto-builder for "four_letter_word_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "four_letter_word_2";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['four_letter_word_2-0-2'] = {txt: "Sure, let me at it!", value: 'four_letter_word_2-0-2'};
		this.conversation_start(pc, "Of course, of course. But can you solve this troubling conundrum?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word_2', msg.choice);
	}

	if (msg.choice == "four_letter_word_2-0-2"){
		choices['1']['four_letter_word_2-1-2'] = {txt: "Hm…", value: 'four_letter_word_2-1-2'};
		this.conversation_reply(pc, msg, "Ah, youthful enthusiasm. Very well: <b>Of animals I reminisce, some are wild and some are this.<\/b>", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word_2', msg.choice);
	}

	if (msg.choice == "four_letter_word_2-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_four_letter_word_3(pc, msg, replay){ // defined by conversation auto-builder for "four_letter_word_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "four_letter_word_3";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['four_letter_word_3-0-2'] = {txt: "Oh, it can't be that tough.", value: 'four_letter_word_3-0-2'};
		this.conversation_start(pc, "Inconceivable! But there's still another. This one is of such fiendish difficulty I can scarcely bear to contemplate it.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word_3', msg.choice);
	}

	if (msg.choice == "four_letter_word_3-0-2"){
		choices['1']['four_letter_word_3-1-2'] = {txt: "I see…", value: 'four_letter_word_3-1-2'};
		this.conversation_reply(pc, msg, "You are truly courageous. Here it is: <b>Up and down through every song, this tells you when to dance along.<\/b>", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'four_letter_word_3', msg.choice);
	}

	if (msg.choice == "four_letter_word_3-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_riddle_explain_2(pc, msg, replay){ // defined by conversation auto-builder for "riddle_explain_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "riddle_explain_2";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['riddle_explain_2-0-2'] = {txt: "Hm…", value: 'riddle_explain_2-0-2'};
		this.conversation_start(pc, "Yes: <b>Of animals I reminisce, some are wild and some are this.<\/b> I confess it has me stumped!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'riddle_explain_2', msg.choice);
	}

	if (msg.choice == "riddle_explain_2-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_riddle_explain_3(pc, msg, replay){ // defined by conversation auto-builder for "riddle_explain_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "riddle_explain_3";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['riddle_explain_3-0-2'] = {txt: "Every puzzle has an answer…", value: 'riddle_explain_3-0-2'};
		this.conversation_start(pc, "<b>Up and down through every song, this tells you when to dance along.<\/b> Perhaps there is just no solution.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'riddle_explain_3', msg.choice);
	}

	if (msg.choice == "riddle_explain_3-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_spelling_fail(pc, msg, replay){ // defined by conversation auto-builder for "spelling_fail"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "spelling_fail";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['spelling_fail-0-2'] = {txt: "That wasn't very good, was it?", value: 'spelling_fail-0-2'};
		this.conversation_start(pc, "Hm…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelling_fail', msg.choice);
	}

	if (msg.choice == "spelling_fail-0-2"){
		choices['1']['spelling_fail-1-2'] = {txt: "I can do better! I got distracted.", value: 'spelling_fail-1-2'};
		this.conversation_reply(pc, msg, "Well, you are very young. Perhaps you don't know many words yet?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelling_fail', msg.choice);
	}

	if (msg.choice == "spelling_fail-1-2"){
		choices['2']['spelling_fail-2-2'] = {txt: "Yes, I'm ready.", value: 'spelling_fail-2-2'};
		choices['2']['spelling_fail-2-3'] = {txt: "No, I'd like to think about this.", value: 'spelling_fail-2-3'};
		this.conversation_reply(pc, msg, "Distracted you say? Of course. Would you like to try again, then?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelling_fail', msg.choice);
	}

	if ((msg.choice == "spelling_fail-2-2") && (!replay)){
		this.container.quests_do_callback(pc, "createBlocks", {pc: pc, name: this.getInstanceProp('npc_name')});
	}

	if (msg.choice == "spelling_fail-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "spelling_fail-2-3"){
		choices['4']['spelling_fail-4-2'] = {txt: "OK", value: 'spelling_fail-4-2'};
		this.conversation_reply(pc, msg, "Very well, please talk to me when you are ready to try again.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'spelling_fail', msg.choice);
	}

	if (msg.choice == "spelling_fail-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "spelling_fail-4-2") && (!replay)){
		this.setInstanceProp('can_talk', '1');
	}

}

var conversations = [
	"blocks_request",
	"want_leave",
	"four_letter_word",
	"spelled_word",
	"anagrams",
	"done_spelling_1",
	"done_spelling_3",
	"done_spelling_5",
	"anagram_start",
	"no_items",
	"letter_match_explain",
	"riddle_explain",
	"anagram_explain",
	"four_letter_word_2",
	"four_letter_word_3",
	"riddle_explain_2",
	"riddle_explain_3",
	"spelling_fail",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"letterblock",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-81,"y":-137,"w":162,"h":156},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD9UlEQVR42u2X61MTVxjGnekf0P9K\npCMCSTYB5I41UAKIQrnInaZBwHSi4tBgAg0YAqm5mQuShGIKGCiKComKiUkcxpYy6AC1GNPp07OH\nTiCl\/Zb00z4zz8zuzJnZ3z7v+549e+IEJ06cOHHi9L9pmWE+9QiFaYvV59rXhzqcG9Zrexu2bxCe\n6KUO6XoQ1EqPOfz9FWzOKLHW3whXXu6+NiNjK+lwdzIzG0zZ2TETj4ejNhNb+PwEW4ltAkGCXfm5\nmGIYqLIyoK8uRvIBs7L2LZUFuD9wEfPK+kPfvIQ5RS2160olnLIKTLeLE2yrLYKBvAhJDm51G2av\nNyYf0JCdDedQI7YfK7GzpsKuT00dDYzi44YD0Tcu7KzrEXt1G3+EtHGz9\/svNZi7\/AVGT5\/Gmv0q\ndEWi5AOacxi41M3Y86vx27NhCrfjUyFs6AELb84RwueQ49cnanwMjlHw\/XVN3Itf1UDLy0TApYDy\ns\/TkA06dL8DMWCt2CeDu35Dvn4\/A0yCmgKzvkTULmi5ECSBe6xK8LKulCQbdCnx76lTyAY0CPk2Q\nTeeoZ2pK44CsrZIS+FxXj61bktZQQP+UPLWAbHpsydiHxojNIiYBkPXsSDtN998S9JEeHC9gkg9o\nLcyhgL+\/+I4+nO3BiLWXAlmKchMAHY3leDGriK9l7e2upoArll7YG8+nZoppgr7DBB\/111Egj6YN\n01+WHUIKeJiflNIh2mMHiqS+3H8JjvpzBLAP9iZxanuQLVn0uQZ384T4oa4K4ZUJbC6MxQG9HRJM\nd1UjvHCDTvOfkXGs3mw+6EEy6fry\/NQlyKbHls6vaqUwbkkppivKYCsuSCiz6awID219+PDyYP2S\n7AIFfGbrTy0g3ZhJivfEhceG4592KxqwRTZ2muBAE8bOZGB18mto85nUAbJfkaChFyaGTyDL4Blq\nwU8jzVhUN8EjrYrD2Yvz4JXXI+hV4UNgDAG9FM7WciwqWzDCz0wdYGBCRss5VXYWzspS0ntGxEI6\nWsb5jtrDEpMXMPJ58EovI\/LgFvyaDtzOOgPvcDtsnZLkA5qEAgroqipJ3FJaxfAa2vDeNwxrvuhY\nmY2FQtiHLsCv7aQ9ODchhaOlYi\/pgO6LpJzjnfSw8LPnGvx3pXhi7ILf1YO3T4fowSC6PoqIW441\nU\/eBzd3wTcvwekGBh\/I6CmhvFmPw5ElR0gEfyGreuRoqEDAM4pXxBnXINICIXYmNGRV+uT+MraVx\nvHt6B9tk29l+pMXbFXL\/WIfNH9WY+jyfAg6mpfWl5DTtlJSk2YpyjeZcwSo5G4b+w\/vx8pLz39Fr\nS54wdis9XT\/JMJ9w\/yacOHHixIlTXH8BC6EZ10wj2GQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/npc_letterblock-1326240086.swf",
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
	"letterblock",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give",
	"v"	: "give_cubimal",
	"c"	: "leave",
	"t"	: "start",
	"k"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_letterblock.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
