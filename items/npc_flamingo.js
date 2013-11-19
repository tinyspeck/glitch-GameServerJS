//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Flamingo Flamingo";
var version = "1344982233";
var name_single = "Flamingo Flamingo";
var name_plural = "Flamingo Flamingos";
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
var parent_classes = ["npc_flamingo", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.active_head = "short";	// defined by npc_flamingo
	this.instanceProps.conversation_offset_y = "75";	// defined by npc_flamingo
	this.instanceProps.conversation_offset_x = "-125";	// defined by npc_flamingo
	this.instanceProps.talk_state = "talkTall";	// defined by npc_flamingo
	this.instanceProps.walk_speed = "350";	// defined by npc_flamingo
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	active_head : ["Which head is active (tall or short)"],
	conversation_offset_y : [""],
	conversation_offset_x : [""],
	talk_state : ["The talk animation state"],
	walk_speed : [""],
};

var instancePropsChoices = {
	ai_debug : [""],
	active_head : ["tall","short"],
	conversation_offset_y : [""],
	conversation_offset_x : [""],
	talk_state : [""],
	walk_speed : [""],
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

verbs.test = { // defined by npc_flamingo
	"name"				: "TEST",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var offsets = {};

		if (!this.eric_test){
			offsets.offset_x = -165;
			offsets.offset_y = -10;
			this.eric_test = 1;
		}else{
			offsets.offset_x = 165;
			offsets.offset_y = -10;
			delete this.eric_test;
		}

		var details = [];
		details['dont_take_focus'] = true;
		details['dont_take_camera_focus'] = true;
			
		this.conversation_start(pc, 'This is a test bubble for Eric. Need to try and get the speech bubble pointer to work correctly in the client', {'txt': 'Fine', value:'test'}, offsets, null, null, details);
	}
};

verbs.flip = { // defined by npc_flamingo
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.testFlip(0);
	}
};

verbs.hit = { // defined by npc_flamingo
	"name"				: "hit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.is_flying) return;

		this.eventFired('player_collision', {pc:pc});
	}
};

function doIdle(){ // defined by npc_flamingo
	this.apiSetTimerX('doIdle', 2*1000);

	if (!this.state || this.state.substr(0, 4) != 'idle') return;

	var state = choose_one(['idle1', 'idle2', 'idle3', 'idle4']);
	this.setState(state);
}

function endFlying(){ // defined by npc_flamingo
	var ret = this.eventFired('flying_end');

	if (!ret || ret['done_flying'] != false){
		this.is_flying = false;
		this.setState('flyToHover');
		this.apiSetTimerX('setState', 1*1000, 'hover');
	}
}

function endHovering(){ // defined by npc_flamingo
	this.hovering = false;

	var delay = 1.2*1000;
	this.apiSetTimerX('eventFired', delay, 'hovering_end');
	this.setState('idle0', delay);

	return delay;
}

function eventFired(event_id, args){ // defined by npc_flamingo
	var location = this.getLocation()

	//this.setDir();

	if (location.eventFired){
		return location.eventFired(event_id, this, args);
	}
}

function getChosenPlayerName(){ // defined by npc_flamingo
	return this.player_name;
}

function getLabel(){ // defined by npc_flamingo
	return this.getInstanceProp('active_head') == 'tall' ? 'Tall Flamingo' : 'Short Flamingo';
}

function onConversation(pc, msg){ // defined by npc_flamingo
	this.conversation_end(pc, msg);
}

function onConversationEnding(pc){ // defined by npc_flamingo
	if (!this.is_flying && !this.hovering){
		this.setState('idle0');
		this.setDir();
	}

	this.eventFired('talk_end', {pc:pc});

	if (this.local_chat_queue){
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: this.local_chat_queue});
		delete this.local_chat_queue;
	}
}

function onCreate(){ // defined by npc_flamingo
	this.initInstanceProps();
	this.is_nameable = false;

	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = true;
	this.npc_can_fall = true;

	this.doIdle();

	this.npc_walk_speed = this.getInstanceProp('walk_speed');
	this.npc_climb_speed = 0;
	this.npc_jump_height = 0;
}

function onInputBoxResponse(pc, uid, value){ // defined by npc_flamingo
	this.setDir();
	this.setState('idle0');

	if (uid == 'name'){
		this.player_name = value;
	}

	this.eventFired('ask_end', {pc:pc});
}

function onLoad(){ // defined by npc_flamingo
	this.apiSetTimerX('doIdle', 3*1000);
	this.apiSetHitBox(540, 400);
}

function onPathing(args){ // defined by npc_flamingo
	if (args.status == 3 || args.status == 4){
		this.endFlying();
	}

	return true;
}

function onPlayerCollision(pc){ // defined by npc_flamingo
	this.eventFired('player_collision', {pc:pc});
}

function onPropsChanged(){ // defined by npc_flamingo
	this.npc_walk_speed = intval(this.getInstanceProp('walk_speed'));

	//this.setDir();
}

function onPrototypeChanged(){ // defined by npc_flamingo
	this.onLoad();
}

function reset(){ // defined by npc_flamingo
	this.dir = 'right';
	this.hovering = false;
	this.is_flying = false;
	this.current_step = 0;
	this.setInstanceProp('active_head', 'short');
	this.setInstanceProp('walk_speed', 500);
	this.setAndBroadcastState('idle0');
	this.doIdle();
}

function setActiveHead(active_head, goIdle){ // defined by npc_flamingo
	if (active_head != 'tall' && active_head != 'short') return 0;

	if (active_head == this.getInstanceProp('active_head')){
		// In the case of setting to the existing head, we still need to send out the event, since
		// the sequence could be waiting for it to complete.
		this.eventFired('active_head_set', null);
		return 0;
	}

	this.apiCancelTimer('setAndBroadcastState');
	this.apiCancelTimer('setState');
	this.apiCancelTimer('setDir');

	var delay = 0;
	if (!this.is_flying && !this.hovering){
		delay = 1.5*1000;

		this.dir = (active_head == 'tall') ? 'right' : 'left';
		this.setAndBroadcastState('idle1');
		this.setAndBroadcastState('turn');

		this.setInstanceProp('active_head', active_head);

		if (goIdle){
			this.apiSetTimerX('doIdle', delay);
			this.apiSetTimerX('setDir', delay);
		}
	}else{
		delay = 1.3*1000;

		this.dir = (active_head == 'tall') ? 'right' : 'left';
		this.setAndBroadcastState('hover');
		this.setAndBroadcastState('hoverTurn');

		this.setInstanceProp('active_head', active_head);

		this.apiSetTimerX('setState', delay, 'hover');
	//	this.apiSetTimerX('setDir', delay);

	//	this.setInstanceProp('active_head', active_head);
	//	this.setDir();
	}


	this.apiSetTimerX('eventFired', delay, 'active_head_set', null);
	return delay;
}

function setDir(){ // defined by npc_flamingo
	if (this.state == 'talkTall' || this.state == 'talkShort'){
		this.dir = 'left';
	}else{
		this.dir = (this.getInstanceProp('active_head') == 'tall') ? 'left' : 'right';
	}
}

function setState(state, delay){ // defined by npc_flamingo
	this.apiCancelTimer('setAndBroadcastState');
	this.apiCancelTimer('setState');
	this.apiCancelTimer('setDir');
	this.apiCancelTimer('setState');

	if (delay){
		this.apiSetTimerX('setState', delay, state);
	}else{
		this.setAndBroadcastState(state);
		this.setDir();
	}
}

function setStepAndWaitEvent(step, event_id){ // defined by npc_flamingo
	this.current_step = step;
	this.waiting_for = event_id;
}

function startFlying(x, y){ // defined by npc_flamingo
	this.setDir();

	// Start hovering (if we need to) and if so, recall after delay
	var delay = this.startHovering();
	if (delay != 0){
		this.apiSetTimerX('startFlying', delay, x, y);
		return;
	}

	if (this.state == 'hover'){
		this.setState('hoverToFly');
		this.apiSetTimerX('startFlying', 0.4*1000, x, y);
		return;
	}

	this.is_flying = true;
	if (x != undefined && y != undefined){
		this.apiMoveToXY(x, y, intval(this.getInstanceProp('walk_speed')), 'endFlying')
	}
	this.setState('flying');
}

function startHovering(x, y){ // defined by npc_flamingo
	this.setDir();

	if (!this.hovering){
		this.setState('takeOff');
		this.hovering = true;
		this.apiSetTimerX('setAndBroadcastState', 1.2*1000, 'hover');

		if (x != undefined && y != undefined){
			this.apiSetTimerX('startHovering', 1.3*1000, x, y);
		}

		return 2.5*1000;
	}

	if (x != undefined && y != undefined){
		this.setState('hover');
		this.apiMoveToXY(x, y, intval(this.getInstanceProp('walk_speed')), 'endFlying')
	}

	return 0;
}

function talk(pc, text, choices, active_head, msg){ // defined by npc_flamingo
	if (!pc) return;

	var delay = this.setActiveHead(active_head, false);
	if (delay != 0){
		this.apiSetTimerX('talk', delay, pc, text, choices, active_head);
		return;
	}

	this.apiCancelTimer('setAndBroadcastState');
	this.apiCancelTimer('setState');
	this.apiCancelTimer('setDir');

	var offsets = {};

	if (this.hovering){
		if (this.getInstanceProp('active_head') == 'tall'){
			offsets.offset_x = -140;
			offsets.offset_y = 10;
			this.setInstanceProp('talk_state', 'hoverTalkTall');
		}else{
			offsets.offset_x = -110;
			offsets.offset_y = 75;
			this.setInstanceProp('talk_state', 'hoverTalkShort');
		}
	//	this.setInstanceProp('talk_state', 'hover');
	}else{
		if (this.getInstanceProp('active_head') == 'tall'){
			offsets.offset_x = -120;
			offsets.offset_y = 20;
			this.setInstanceProp('talk_state', 'talkTall');
		}else{
			offsets.offset_x = -110;
			offsets.offset_y = 60;
			this.setInstanceProp('talk_state', 'talkShort');
		}
	}

	this.dir = 'left';

	if (this.getInstanceProp('active_head') == 'tall'){
		text = '<font size=\'14\'>'+text+'</font>';
	}else{
		text = '<font size=\'14\'>'+text+'</font>';
	}

	var details = [];
	details['dont_take_camera_focus'] = true;

	if (msg){	
		this.conversation_reply(pc, msg, text, choices, offsets, null, null, details, true);
	}else{
		this.conversation_start(pc, text, choices, offsets, null, null, details, true);
	}

	// We want to strip out all HTML, and change the split to HTML breaks.
	text = text.replace(new RegExp('<split butt_txt="[^"]+">', 'g'), '--br--');
	text = text.replace(/<br>/g, '<br> ');
	text = utils.strip_html(text);
	text = text.replace(/--br--/g, '<br><br>');

	var split_pos = text.search('<br><br>');
	if (split_pos != -1){
		this.local_chat_queue = text.substr(split_pos+8);
		text = text.substr(0, split_pos);
	}

	pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: text});

	if (!this.hovering && !this.is_flying){
		this.setState('idle0', 5*1000);
	}else{
		this.setState('hover', 3*1000);
	}
}

function testFlip(count){ // defined by npc_flamingo
	this.doIdle();

	var active_head = this.getInstanceProp('active_head');
	var delay = 0;
	if (active_head == 'tall'){
		delay = this.setActiveHead('short');
	}else{
		delay = this.setActiveHead('tall');
	}

	if (count < 2){
		this.apiSetTimer('testFlip', delay, count+1);
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

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-85,"y":-167,"w":171,"h":172},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFpUlEQVR42u2Ya1MTZxTH\/QZ8BD4C\nn6DNm860jtUURQWmNtwMDQGXAMlGAuRGEAIh3NQACSuXlPGClAEETCUioEIQFCu3FJI10XbGGXam\nnU5fnj7ncZIGQ0xqNfCiO\/NMsrtPdn\/7P+d\/nrM5cuT\/Lf72ulaTGtBfFO3WsymHDm6rRsls1FSA\n36gGf73WF7S1pR0O1QbsqcHujhW+rYHCzVcpwJZ\/Fnizzhc0sAcLGRywS171O+C5pQ5mKooFj7JE\neK5RwLaedSNssJtd2V06oHAH+x1pCDejLoXxohwGj7mk0pTJ4nzGzUi5bZPS\/WZaD35Pi2CpTk++\nkgROi8oROC7WnPs\/yK2PXVch88Tn2gMBfGo2wJgsx\/q+eRomYyXr+GeipAP+2tcjesl1wkRJgTAu\nz0+NNU8h\/UpycCbpt7tRRRLmlcNZmEmJQaPMsgwNNZrk0EFiqeE72+BeaeHhVRIhg5wNPJUKGCvK\nEUYL8+KXlTVNeSrfqNMGrlq1fJOR+eSu7u0RB+yXhXmlnEK+zzhvAXWq4cELubCuVwHfqIeArY17\n1d0hRvfh2L3RmfLxTeNIQ8iHF0nxluUM7zsJttmUN\/c0nN+sBrdKDp6qcvDqlLBl0sBmRzMdvOMK\nBLra\/lVtwk6FN7IMbzVpA+2NdAQ7WyXvPujrfjuDOTkhz4Mo07SbzzN\/\/TYo\/LHeCRttCpgtk8Ek\nmTjNSOGnkgI3cRod9yvkEOyz+xJVEVso2qVEDN5iBHTwy8tNgODvFHFwl0rhjix3rwgahcS39WwE\nnrtYbtcVe5FGyBfWS\/Cqz8ElAug3adxbxouwY2BhS8+C31T5FtJqegvZbg5D4kOjYfYFLDx3TCjI\n\/lIc74akHGg9NUrAQrtv\/lYrRF5dhZY3qrXbBpV1Q6eCVR0LO811gOqvVZeRjkVFIV+21lNI3lIr\nYKOKjt4mD49GibpwoosyFtUlnToKkIbSwAqoEKqDN\/+l0QibdVXwoqoMFpTF8KyyFFZJOfESRUPh\nDvZ20eFvNHB8d7uA6qEIH+Q02hLJ83zeDgtgaYiVZzvEVKFQeg1qWKvVwDxx54apCjYuaWGnpT58\nPqSkl5yjBTuWgxOBw\/xbbawlYbGHL4KhocpFAG6S9v0pAULV5stlsF5dDk\/YCyS3CmFRVQzYmG5p\nlfQTFcU0QHU\/WLlQaOc05cTBDiHSwX6DmtujHjEDfoby7GF5EdwtKQD7txnQdOoYuMj3JQK7rGbo\nwIe4U5Qbt\/VKBNC90dKAgOELYcWfKs6nar1bSn4meYcKhUBmFN\/D1ax037XvTnP4GwTFgWvwmCz3\nv7dVmBtPSBgwobHEYNOJw6WQCXOkZmLIQsph2O5dkMJATiZcyfwG+nPO0po6mJtFjVWrrxA72WIm\noXU30Q0vhk+LS1FoVVlrNcM4UaNPcoaGCpVaYktgkXzHsNqyT9Ja2XL6OOfMzYTu7JM0xyZHesSr\ny9Pij76oo1EwkUOrCg586WlOPyrqOHvC2is5IzjOZUBzxtdC06mj4RWi\/vQXKTgHPx8+uC2anx9K\nXXx895M3Iftu+hqFpLmpJmZOPZq7Tc9tri8cTDvf0aoXP3rkjnnzqTu99NyyZ1oMAMntovGGtstG\nZnTEGTN8szPD9JzFUp325++COKmAmPhKxXnR2uoDUVlZtEN7usyizc2F8PFnK7PJfee9ed0RvuGt\n61cksdQ7MEDX1I\/hIj58q4uJBzg14Uwu4NDNvnCPODzkiLr55Oje3MT9paUbKUkzSGSIB53tewDR\nFJibkcecva3iQGAtOX9t+LzL1CChfSzIkfv9vc1RaqGRVjxTyQnz+OiglmX\/edFBGISKpWhou+5s\nH04KoLOvJeodJRJqP1fTvL1h45ICOHDN6n4fYKwNFfzkRlmYHUpzdDdEwdjtTanxfmuuU4rizfsb\n57gsQRmSVRQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/npc_flamingo-1340405838.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"c"	: "flip",
	"g"	: "give_cubimal",
	"h"	: "hit",
	"t"	: "test"
};
itemDef.keys_in_pack = {};

log.info("npc_flamingo.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
