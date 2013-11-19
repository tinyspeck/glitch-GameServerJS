//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Smuggler";
var version = "1344982233";
var name_single = "Smuggler";
var name_plural = "Smugglers";
var article = "a";
var description = "A member of the [REDACTED] movement, whose attempts to overthrow [REDACTED] and bring about [REDACTED] by transferring parcels of [REDACTED] from Point A to Point [REDACTED] are disrupted by deimaginators, who have been monitoring and censoring their [REDACTED] revolutionary literature for many millennia.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_smuggler", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.task = "";	// defined by npc_smuggler
	this.instanceProps.talk_state = "talkWithBox";	// defined by npc_smuggler
	this.instanceProps.head = "1";	// defined by npc_smuggler
	this.instanceProps.variant = "red";	// defined by npc_smuggler
	this.instanceProps.group = "0";	// defined by npc_smuggler
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	task : ["Tis better to give than to receive, but the smuggler needs to do one or the other"],
	talk_state : ["Which anim to use when talking"],
	head : ["Which variant of head do I have?"],
	variant : ["What color am I?"],
	group : ["Which group am I in? (for the purposes of determining who gets which smuggle offers)"],
};

var instancePropsChoices = {
	ai_debug : [""],
	task : [""],
	talk_state : [""],
	head : [""],
	variant : [""],
	group : [""],
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

verbs.talk_to = { // defined by npc_smuggler
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Discuss a matter of grave importance",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.target_pc){
			return {state:null};
		} else if (this.target_pc == pc){
			if (!this.has_conversed) return {state: 'enabled'};
			return {state: 'disabled', reason: "We already talked!" }
		} else {
			return {state: 'disabled', reason: "I'm waiting to talk to someone else right now." }
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.x < this.x){
			var endpoint = this.x-100;
			var face='right';
			this.dir = 'left';
		} else {
			var endpoint = this.x+100;
			var face='left';
			this.dir = 'right';
		}
		pc.moveAvatar(endpoint, pc.y, face);

		if (this.instanceProps.task == 'give'){
			this.apiCancelTimer('giveTimeOut');
			this.apiSetTimer('giveDoConversation',700);
		} else if (this.instanceProps.task == 'receive'){
			this.apiSetTimer('receiveDoConversation',700);
		}

		return true;
	}
};

function broadcastState(){ // defined by npc_smuggler
	if(!this.apiGetLocatableContainerOrSelf()) {
		return;
	}

	if (this.target_pc){
			this.target_pc.apiSendMsg({
			type: 'item_state',
			itemstack_tsid: this.tsid,
			s: this.buildState(this.target_pc),
		});
	}
}

function buildState(pc){ // defined by npc_smuggler
	if (pc == this.target_pc){
		if (this.dir){
			if (this.dir == 'right'){
				return '-' + this.state;
			}
		}

		return this.state;
	} else {
		return 'visible:false';
	}
}

function cleanSeenIntervals(){ // defined by npc_smuggler
	if (!this.seen) return;

	var cur_time = time();
	for (var i in this.seen){
		if (this.seen[i]+(60*60) < cur_time){
			delete this.seen[i];
		}
	}
}

function defaultToGive(){ // defined by npc_smuggler
	if (!this.instanceProps.task){
		this.setTask('give');
	}
}

function giveAppearForPlayer(pc){ // defined by npc_smuggler
	if (!this.target_pc){

		this.target_pc = pc;

		pc.setDoNotDisturb(30);

		this.setAndBroadcastState('arriveWithBox');
		pc.announce_sound('SMUGGLING_NPC_ARRIVES');
		this.sendBubble('psssst! '+pc.label+"! There's something really important we need you to do for us! Come talk to me...", 10000, pc);

		if (!this.seen) this.seen = {};

		this.seen[pc.tsid] = time();

		this.apiSetTimer('giveDoIdle',500);
		this.apiSetTimer('giveTimeOut',30000);

		this.cleanSeenIntervals();
	}
}

function giveDoConversation(){ // defined by npc_smuggler
	this.apiCancelTimer('giveDoIdle');

	this.fsm_switch_state('giving');

	var status = this.target_pc.getQuestStatus('smuggling_basic');

	if (status == 'done' || status == 'fail_repeat'){
		if (is_chance(0.33)){
			this.conversation_run_give_repeat1(this.target_pc, {});
		} else if (is_chance(0.33)){
			this.conversation_run_give_repeat2(this.target_pc, {});
		} else {
			this.conversation_run_give_repeat3(this.target_pc, {});
		} 
	} else {
		this.conversation_run_give_first_time(this.target_pc, {});
	}
}

function giveDoDisappear(){ // defined by npc_smuggler
	this.apiCancelTimer('giveDoIdle');

	this.target_pc.announce_sound('SMUGGLING_NPC_LEAVES');

	if (this.giving_gave_package){
		this.sendBubble('Good luuuuuuuuuuuuuuuck...',1000,this.target_pc);
		this.setAndBroadcastState('exitNoBox');
	} else {
		this.setAndBroadcastState('exitWithBox');
	}

	this.apiSetTimer('giveReset',1000);
}

function giveDoIdle(){ // defined by npc_smuggler
	this.setAndBroadcastState('idleHoldWithBox');
	this.setAndBroadcastState('idleWithBox');

	var wait = randInt(2,7)*1000;

	this.apiSetTimer('giveDoIdle',wait);
}

function giveMsgHandler(msg){ // defined by npc_smuggler
	if (msg.from == 'conversation_cancel'){
		if (this.target_pc){
			this.sendBubble("I hadn't finished talking to you! How rude!",2000,this.target_pc);
		}

		this.apiSetTimer('giveDoDisappear',2000);
		this.has_conversed = true;

		if (this.giving_gave_package){
			this.setAndBroadcastState('idleNoBox');
			this.target_pc.run_overlay_script('smuggling_explain_restrictions');
		} else {
			this.setAndBroadcastState('idleWithBox');
		}		
	}
}

function giveReset(){ // defined by npc_smuggler
	this.target_pc = null;
	delete this.has_conversed;
	delete this.giving_gave_package;

	this.fsm_init();

	this.setInstanceProp('talk_state','talkWithBox');

	this.setAndBroadcastState('visible:false');
}

function giveStartQuest(pc){ // defined by npc_smuggler
	pc.startQuest('smuggling_basic');
	this.setAndBroadcastState('giveBox');
	pc.announce_sound('SMUGGLER_GIVES_OR_TAKES_BOX');
	this.setInstanceProp('talk_state','talkNoBox');
	this.giving_gave_package = true;
	pc.acceptQuest('smuggling_basic');
}

function giveTimeOut(){ // defined by npc_smuggler
	this.apiCancelTimer('giveDoIdle');
	if (this.target_pc) this.sendBubble("Never mind... I guess you're busy.", 5000, this.target_pc);
	this.setAndBroadcastState('exitWithBox');
	if (this.target_pc) this.target_pc.announce_sound('SMUGGLING_NPC_LEAVES');
	this.apiSetTimer('giveReset',1500);
}

function make_config(){ // defined by npc_smuggler
	return { variant: this.getInstanceProp('variant'), head: this.getInstanceProp('head') };
}

function onCreate(){ // defined by npc_smuggler
	this.initInstanceProps();
	this.npc_can_walk = false;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;
	this.npc_walk_speed = 0;
	this.item_width = 55;
	this.item_height = 90;

	this.setInstanceProp('head',choose_one([1, 2]));

	this.apiSetHitBox(55,90);

	this.setAndBroadcastState('visible:false');

	this.apiSetTimer('defaultToGive', 5000);
}

function onPlayerCollision(pc){ // defined by npc_smuggler
	if (this.instanceProps.task == 'give'){

		if (pc.stats.level < 11){
			return false;
		}

		if (!this.seen) this.seen = {};

		if (pc.getQuestStatus('smuggling_basic') == 'todo'){
			return false;
		}

		if (pc.isBagFull()){
			return false;
		}

		if (this.seen[pc.tsid]){
			if (this.seen[pc.tsid]+(60*60) < time()){
				delete this.seen[pc.tsid];
			} else if (!pc.buffs_has('max_luck')) {
				return false;
			}
		}

		this.seen[pc.tsid] = time();

		if (is_chance(0.2) || pc.buffs_has('max_luck')){
			this.giveAppearForPlayer(pc);
		}
	} else if (this.instanceProps.task == 'receive' && pc == this.target_pc && !this.didAppear){
		this.receiveAppearForPlayer(pc);
	}
}

function onPlayerExit(pc){ // defined by npc_smuggler
	if (pc != this.target_pc){
		return;
	} else {
		if (this.instanceProps.task == 'give'){
			this.setAndBroadcastState('exitWithBox');
			this.apiSetTimer('giveReset',1000);
		} else if (this.instanceProps.task == 'receive'){
			this.setAndBroadcastState('exitNoBox');
			this.apiSetTimer('apiDelete',1000);
		}
	}
}

function receiveAppearForPlayer(pc){ // defined by npc_smuggler
	this.setAndBroadcastState('arriveWithBox');

	pc.announce_sound('SMUGGLING_NPC_ARRIVES');

	this.didAppear = 1;

	this.sendBubble('psssst! '+pc.label+"! Have you got something for me?", 10000, pc);

	this.apiSetTimer('receiveDoIdle',500);
}

function receiveDoConversation(pc){ // defined by npc_smuggler
	this.received_package = false;
	this.gave_rewards = false;
	this.fsm_switch_state('receiving');

	var qi = this.target_pc.getQuestInstance('smuggling_basic');

	if (qi.repeats){
		if (is_chance(0.33)){
			this.conversation_run_receive_repeat1(this.target_pc, {});
		} else if (is_chance(0.33)){
			this.conversation_run_receive_repeat2(this.target_pc, {});
		} else {
			this.conversation_run_receive_repeat3(this.target_pc, {});
		} 
	} else {
		this.conversation_run_receive_first_time(this.target_pc, {});
	}
}

function receiveDoDisappear(){ // defined by npc_smuggler
	this.sendBubble('Byeeeeeeeeeeeeeeeeee...',1000,this.target_pc);
	this.setAndBroadcastState('exitWithBox');
	this.target_pc.announce_sound('SMUGGLING_NPC_LEAVES');
	this.apiSetTimer('apiDelete',1000);
}

function receiveDoIdle(){ // defined by npc_smuggler
	this.setAndBroadcastState('idleNoBox');
}

function receiveMsgHandler(msg){ // defined by npc_smuggler
	if (msg.from == 'conversation_cancel'){
		if (!this.received_package){
			this.sendBubble("You can't very well deliver a package if you can't even converse with me, can you now? Let's try that again.",2000,this.target_pc);
			return;
		} else if (!this.gave_rewards){
			this.sendBubble("But I didn't get to the best part - the rewards! Sigh. Here you go.",5000,this.target_pc);

			this.target_pc.stats_add_xp(100, false);
			this.target_pc.stats_add_currants(200);
			if (this.isOnGround()){
				this.target_pc.createItemFromSource("gem_diamond", 1, this);
			}else{
				this.target_pc.createItem("gem_diamond", 1);
			}
		}

		this.apiSetTimer('receiveDoDisappear',3000);
		this.target_pc.apiSendMsg({type: 'clear_location_path'});
		this.target_pc.completeQuest('smuggling_basic',true);
		this.has_conversed = true;
	}
}

function setTask(task, pc){ // defined by npc_smuggler
	if (task == 'give'){
		this.setInstanceProp('task', 'give');
		this.setInstanceProp('talk_state', 'talkWithBox');
		this.setInstanceProp('variant', 'red');
		this.setInstanceProp('group',randInt(1,5));
		this.messages_register_handler('giving', 'giveMsgHandler');
	} else if (task == 'receive'){
		this.setInstanceProp('task','receive');
		this.setInstanceProp('talk_state', 'talkNoBox');
		this.setInstanceProp('variant', 'green');
		this.target_pc = pc;
		this.messages_register_handler('receiving', 'receiveMsgHandler');
	} else {
		log.error('smuggler '+this.tsid+" given a task type he doesn't understand: "+task);
	}

	this.setAndBroadcastState('empty');
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

function conversation_run_give_first_time(pc, msg, replay){ // defined by conversation auto-builder for "give_first_time"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "give_first_time";
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
	if (!msg.choice){
		choices['0']['give_first_time-0-2'] = {txt: "Smuggling, you say? I might be interested in that.", value: 'give_first_time-0-2'};
		choices['0']['give_first_time-0-3'] = {txt: "No way! Move your own \"stuff\", chum.", value: 'give_first_time-0-3'};
		this.conversation_start(pc, "Hey there. So... we have some, ahem, \"stuff\" which we need to get from A (here) to B (somewhere else)… without attracting attention. If you know what I'm saying. Some might call it smuggling, but we find that word a bit uncouth.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_first_time', msg.choice);
	}

	if (msg.choice == "give_first_time-0-2"){
		choices['1']['give_first_time-1-2'] = {txt: "I'm excited!", value: 'give_first_time-1-2'};
		this.conversation_reply(pc, msg, "You wanna smuggle? For realz? Sweet!", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_first_time', msg.choice);
	}

	if (msg.choice == "give_first_time-0-3"){
		choices['2']['give_first_time-2-2'] = {txt: "I resent that.", value: 'give_first_time-2-2'};
		this.conversation_reply(pc, msg, "That's okay, buddy. Not everyone can be an exciting, dynamic young go-getter. Some folks just lack a sense of adventure.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_first_time', msg.choice);
	}

	if (msg.choice == "give_first_time-1-2"){
		choices['3']['give_first_time-3-3'] = {txt: "Okay...", value: 'give_first_time-3-3'};
		this.conversation_reply(pc, msg, "Okay, so just take this package and deliver it. But be careful - there are deimaginators out there who will try to stop you from delivering. Avoid them at all costs!", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_first_time', msg.choice);
	}

	if ((msg.choice == "give_first_time-1-2") && (!replay)){
		this.giveStartQuest(pc);
	}

	if (msg.choice == "give_first_time-2-2"){
		choices['4']['give_first_time-4-2'] = {txt: "Hmph.", value: 'give_first_time-4-2'};
		this.conversation_reply(pc, msg, "I'm sure you do, Captain Sensible. I'm sure you do.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_first_time', msg.choice);
	}

	if ((msg.choice == "give_first_time-4-2") && (!replay)){
		this.setAndBroadcastState('exitWithBox');
this.apiSetTimer('giveReset',1000);
this.has_conversed = true;
	}

	if (msg.choice == "give_first_time-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "give_first_time-3-3") && (!replay)){
		this.setAndBroadcastState('idleNoBox');
this.apiSetTimer('giveDoDisappear',500);
this.has_conversed = true;
pc.run_overlay_script('smuggling_explain_restrictions');

	}

	if (msg.choice == "give_first_time-3-3"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_receive_first_time(pc, msg, replay){ // defined by conversation auto-builder for "receive_first_time"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "receive_first_time";
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
		choices['0']['receive_first_time-0-2'] = {txt: "Frab-what?", value: 'receive_first_time-0-2'};
		this.conversation_start(pc, "You made it! How perfectly frabjous! ", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
	}

	if (msg.choice == "receive_first_time-0-2"){
		choices['1']['receive_first_time-1-2'] = {txt: "The contraband?", value: 'receive_first_time-1-2'};
		this.conversation_reply(pc, msg, "Frabjous. But never mind that. Do you have the... thing?... With the stuff? Y'know, the…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
	}

	if (msg.choice == "receive_first_time-1-2"){
		choices['2']['receive_first_time-2-2'] = {txt: "I do! Here you go...", value: 'receive_first_time-2-2'};
		this.conversation_reply(pc, msg, "Yes, that.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
	}

	if ((msg.choice == "receive_first_time-2-2") && (!replay)){
		pc.buffs_remove("dont_get_caught");
	}

	if (msg.choice == "receive_first_time-2-2"){
		choices['3']['receive_first_time-3-4'] = {txt: "I got here, didn't I?", value: 'receive_first_time-3-4'};
	}

	if ((msg.choice == "receive_first_time-2-2") && (!replay)){
		var val = pc.items_destroy("contraband", 1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "item_take",
				"which"	: "contraband",
				"value"	: val
			});
		}
	}

	if (msg.choice == "receive_first_time-2-2"){
		this.conversation_reply(pc, msg, "Lovely! Thank you so much. I hope those deimaginators weren't too much trouble.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
	}

	if ((msg.choice == "receive_first_time-2-2") && (!replay)){
		this.setAndBroadcastState('takeBox');
this.setInstanceProp('talk_state', 'talkWithBox');
pc.quests_set_flag('contraband_delivered');
pc.announce_sound('SMUGGLER_GIVES_OR_TAKES_BOX');
this.received_package = true;
	}

	if (msg.choice == "receive_first_time-3-4"){
		choices['4']['receive_first_time-4-4'] = {txt: "Thanks!", value: 'receive_first_time-4-4'};
		this.conversation_reply(pc, msg, "You did. Much to our surprise, and unlike so many who have tried before, you did.  How, I'll never know - but before I go, here's a little something for your trouble. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
	}

	if ((msg.choice == "receive_first_time-3-4") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(100 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.stats_add_currants(200 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "cash_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.isOnGround()){
			var val = pc.createItemFromSource("gem_diamond", 1 * msg.count, this);
		}else{
			var val = pc.createItem("gem_diamond", 1 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "gem_diamond",
				"value"	: val
			});
		}
		this.gave_rewards = true;
	}

	if (msg.choice == "receive_first_time-4-4"){
		this.conversation_reply(pc, msg, "On the contrary, comrade: we thank YOU.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_first_time', msg.choice);
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "receive_first_time-4-4") && (!replay)){
		this.apiSetTimer('receiveDoDisappear',3000);
pc.apiSendMsg({type: 'clear_location_path'});
pc.clearPath();
pc.completeQuest('smuggling_basic',true);
this.has_conversed = true;
	}

}

function conversation_run_give_repeat1(pc, msg, replay){ // defined by conversation auto-builder for "give_repeat1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "give_repeat1";
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
		choices['0']['give_repeat1-0-2'] = {txt: "You bet. I was born for this.", value: 'give_repeat1-0-2'};
		choices['0']['give_repeat1-0-3'] = {txt: "On second thoughts, no.", value: 'give_repeat1-0-3'};
		this.conversation_start(pc, "Well I'll be… Back for another bite of the hot smuggling action, are we? The fire of questionably legal package delivery pumping through your veins, is it?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat1', msg.choice);
	}

	if (msg.choice == "give_repeat1-0-3"){
		choices['1']['give_repeat1-1-2'] = {txt: "Meh. Maybe.", value: 'give_repeat1-1-2'};
		this.conversation_reply(pc, msg, "Your choice, friend. Maybe next time, eh?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat1', msg.choice);
	}

	if ((msg.choice == "give_repeat1-1-2") && (!replay)){
		this.setAndBroadcastState('exitWithBox');
this.apiSetTimer('giveReset',1000);
	}

	if (msg.choice == "give_repeat1-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "give_repeat1-0-2"){
		choices['3']['give_repeat1-3-3'] = {txt: "How could I forget?", value: 'give_repeat1-3-3'};
		this.conversation_reply(pc, msg, "That's the stuff, comrade. You know the drill by now, right? Take the package, get it to the destination, avoid the deimaginators...", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat1', msg.choice);
	}

	if ((msg.choice == "give_repeat1-0-2") && (!replay)){
		this.giveStartQuest(pc);
	}

	if (msg.choice == "give_repeat1-3-3"){
		choices['4']['give_repeat1-4-2'] = {txt: "I was born ready.", value: 'give_repeat1-4-2'};
		this.conversation_reply(pc, msg, "Let's do this thing! Are you ready?", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat1', msg.choice);
	}

	if ((msg.choice == "give_repeat1-4-2") && (!replay)){
		this.setAndBroadcastState('idleNoBox');
this.apiSetTimer('giveDoDisappear',500);
this.has_conversed = true;
pc.run_overlay_script('smuggling_reveal_destination');
	}

	if (msg.choice == "give_repeat1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_give_repeat2(pc, msg, replay){ // defined by conversation auto-builder for "give_repeat2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "give_repeat2";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['give_repeat2-0-2'] = {txt: "I think I may have found my calling.", value: 'give_repeat2-0-2'};
		choices['0']['give_repeat2-0-3'] = {txt: "Meh: I'm kinda over it.", value: 'give_repeat2-0-3'};
		this.conversation_start(pc, "You again? You just can't get enough of this smuggling lark, can you?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat2', msg.choice);
	}

	if (msg.choice == "give_repeat2-0-3"){
		choices['1']['give_repeat2-1-2'] = {txt: "I'm strong-willed.", value: 'give_repeat2-1-2'};
		this.conversation_reply(pc, msg, "They all say that at first... but the urge to get back to the front line, battling to help save freedom of imagination through high-stakes package delivery usually wins out in the end.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat2', msg.choice);
	}

	if ((msg.choice == "give_repeat2-1-2") && (!replay)){
		this.setAndBroadcastState('exitWithBox');
this.apiSetTimer('giveReset',1000);
	}

	if (msg.choice == "give_repeat2-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "give_repeat2-0-2"){
		choices['3']['give_repeat2-3-2'] = {txt: "Deimaginator: bad, destination: good. Got it.", value: 'give_repeat2-3-2'};
		this.conversation_reply(pc, msg, "Then listen very carefully: I will say this only once.  The deimaginators want this one, and they want it bad. Convey it to its intended destination, without delay.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat2', msg.choice);
	}

	if ((msg.choice == "give_repeat2-0-2") && (!replay)){
		this.giveStartQuest(pc);
	}

	if ((msg.choice == "give_repeat2-3-2") && (!replay)){
		this.setAndBroadcastState('idleNoBox');
this.apiSetTimer('giveDoDisappear',500);
this.has_conversed = true;
pc.run_overlay_script('smuggling_reveal_destination');
	}

	if (msg.choice == "give_repeat2-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_give_repeat3(pc, msg, replay){ // defined by conversation auto-builder for "give_repeat3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "give_repeat3";
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
		choices['0']['give_repeat3-0-2'] = {txt: "Yup. Number one smuggloperative. That's me.", value: 'give_repeat3-0-2'};
		choices['0']['give_repeat3-0-3'] = {txt: "Nah, you're thinking of someone else.", value: 'give_repeat3-0-3'};
		this.conversation_start(pc, "More smuggling? Excellent. Our movement needs dedicated smugglologist operatives like yourself. Ready for another run? ", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat3', msg.choice);
	}

	if (msg.choice == "give_repeat3-0-3"){
		choices['1']['give_repeat3-1-2'] = {txt: "You don't impress me, hoodlum. ", value: 'give_repeat3-1-2'};
		this.conversation_reply(pc, msg, "Yeah. Someone cooler. Be on your way, good little citizen… ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat3', msg.choice);
	}

	if ((msg.choice == "give_repeat3-1-2") && (!replay)){
		this.setAndBroadcastState('exitWithBox');
this.apiSetTimer('giveReset',1000);
	}

	if (msg.choice == "give_repeat3-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "give_repeat3-0-2"){
		choices['3']['give_repeat3-3-2'] = {txt: "Don't worry. I'm sharp. Like fox.", value: 'give_repeat3-3-2'};
		this.conversation_reply(pc, msg, "Keep your eyes open, little comrade, the cause is depending on you. And the deimaginators are talking about stepping up their game.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat3', msg.choice);
	}

	if ((msg.choice == "give_repeat3-0-2") && (!replay)){
		this.giveStartQuest(pc);
	}

	if (msg.choice == "give_repeat3-3-2"){
		choices['4']['give_repeat3-4-2'] = {txt: "You can count on it.", value: 'give_repeat3-4-2'};
		this.conversation_reply(pc, msg, "Like a?… Whatever. All the words we just spoke will self-destruct in 5 seconds. Stay sharp, or foxy, whichever you prefer.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'give_repeat3', msg.choice);
	}

	if ((msg.choice == "give_repeat3-4-2") && (!replay)){
		this.setAndBroadcastState('idleNoBox');
this.apiSetTimer('giveDoDisappear',500);
this.has_conversed = true;
pc.run_overlay_script('smuggling_reveal_destination');
	}

	if (msg.choice == "give_repeat3-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_receive_repeat1(pc, msg, replay){ // defined by conversation auto-builder for "receive_repeat1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "receive_repeat1";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['receive_repeat1-0-2'] = {txt: "What the deimaginati-what now?", value: 'receive_repeat1-0-2'};
		this.conversation_start(pc, "You made it! Again! And those people in the movement said you'd never survive what the deimaginators had planned for you.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat1', msg.choice);
	}

	if (msg.choice == "receive_repeat1-0-2"){
		choices['1']['receive_repeat1-1-2'] = {txt: "Hang on… ungh! Right: here you go! One package of \"stuff\".", value: 'receive_repeat1-1-2'};
		this.conversation_reply(pc, msg, "Oh, nothing. Just trust me: if you've made it this far, you've either got luck or some pretty powerful friends. Now, let's get this - *ahem* - business concluded before anyone gets suspicious.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat1', msg.choice);
	}

	if ((msg.choice == "receive_repeat1-1-2") && (!replay)){
		this.setAndBroadcastState('takeBox');
this.setInstanceProp('talk_state', 'talkWithBox');
pc.announce_sound('SMUGGLER_GIVES_OR_TAKES_BOX');
pc.quests_set_flag('contraband_delivered');
this.received_package = true;
	}

	if (msg.choice == "receive_repeat1-1-2"){
		choices['2']['receive_repeat1-2-5'] = {txt: "Look, it's HERE, isn't it?", value: 'receive_repeat1-2-5'};
	}

	if ((msg.choice == "receive_repeat1-1-2") && (!replay)){
		var val = pc.items_destroy("contraband", 1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "item_take",
				"which"	: "contraband",
				"value"	: val
			});
		}
		pc.buffs_remove("dont_get_caught");
	}

	if (msg.choice == "receive_repeat1-1-2"){
		this.conversation_reply(pc, msg, "It's, um, a tad... moist isn't it? Or would you say it's more \"clammy\"? How did you actually transport this, by the way?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat1', msg.choice);
	}

	if (msg.choice == "receive_repeat1-2-5"){
		choices['3']['receive_repeat1-3-5'] = {txt: "Ooh, shiny.", value: 'receive_repeat1-3-5'};
		this.conversation_reply(pc, msg, "It certainly is. And we're grateful: no questions asked. To prove it - a little something-something to say thanks for supporting the cause.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat1', msg.choice);
	}

	if ((msg.choice == "receive_repeat1-2-5") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(100 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.stats_add_currants(200 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "cash_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.isOnGround()){
			var val = pc.createItemFromSource("gem_diamond", 1 * msg.count, this);
		}else{
			var val = pc.createItem("gem_diamond", 1 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "gem_diamond",
				"value"	: val
			});
		}
		this.gave_rewards = true;
	}

	if (msg.choice == "receive_repeat1-3-5"){
		this.conversation_reply(pc, msg, "There's always more where that came from.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat1', msg.choice);
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "receive_repeat1-3-5") && (!replay)){
		this.apiSetTimer('receiveDoDisappear',3000);
pc.apiSendMsg({type: 'clear_location_path'});
pc.clearPath();
pc.completeQuest('smuggling_basic',true);
this.has_conversed = true;
	}

}

function conversation_run_receive_repeat2(pc, msg, replay){ // defined by conversation auto-builder for "receive_repeat2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "receive_repeat2";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['receive_repeat2-0-2'] = {txt: "Is it? I mean, I just followed the map, avoided the deimaginators and brought the package…", value: 'receive_repeat2-0-2'};
		this.conversation_start(pc, "You managed to get here? Inconceivable! ", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat2', msg.choice);
	}

	if (msg.choice == "receive_repeat2-0-2"){
		choices['1']['receive_repeat2-1-2'] = {txt: "I don't think that word means what you think it means. But, here you go.", value: 'receive_repeat2-1-2'};
		this.conversation_reply(pc, msg, "And you managed to bring the package in one piece too?!? INCONCEIVABLE! ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat2', msg.choice);
	}

	if ((msg.choice == "receive_repeat2-1-2") && (!replay)){
		this.setAndBroadcastState('takeBox');
this.setInstanceProp('talk_state', 'talkWithBox');
pc.announce_sound('SMUGGLER_GIVES_OR_TAKES_BOX');
pc.quests_set_flag('contraband_delivered');
this.received_package = true;
	}

	if (msg.choice == "receive_repeat2-1-2"){
		choices['2']['receive_repeat2-2-5'] = {txt: "What?", value: 'receive_repeat2-2-5'};
	}

	if ((msg.choice == "receive_repeat2-1-2") && (!replay)){
		var val = pc.items_destroy("contraband", 1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "item_take",
				"which"	: "contraband",
				"value"	: val
			});
		}
		pc.buffs_remove("dont_get_caught");
	}

	if (msg.choice == "receive_repeat2-1-2"){
		this.conversation_reply(pc, msg, "BOOM! Stay free, comrade. Free in the mind, free for all time!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat2', msg.choice);
	}

	if (msg.choice == "receive_repeat2-2-5"){
		choices['3']['receive_repeat2-3-5'] = {txt: "Now this is my kind of cause!", value: 'receive_repeat2-3-5'};
		this.conversation_reply(pc, msg, "Just testing out a new slogan. Help yourself to some of our communal cause stash, comrade.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat2', msg.choice);
	}

	if ((msg.choice == "receive_repeat2-2-5") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(100 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.stats_add_currants(200 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "cash_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.isOnGround()){
			var val = pc.createItemFromSource("gem_diamond", 1 * msg.count, this);
		}else{
			var val = pc.createItem("gem_diamond", 1 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "gem_diamond",
				"value"	: val
			});
		}
		this.gave_rewards = true;
	}

	if (msg.choice == "receive_repeat2-3-5"){
		this.conversation_reply(pc, msg, "That's right, we rob from the deimaginator rich and give to, well, you. Until next time, friend!", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat2', msg.choice);
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "receive_repeat2-3-5") && (!replay)){
		this.apiSetTimer('receiveDoDisappear',3000);
pc.apiSendMsg({type: 'clear_location_path'});
pc.clearPath();
pc.completeQuest('smuggling_basic',true);
this.has_conversed = true;
	}

}

function conversation_run_receive_repeat3(pc, msg, replay){ // defined by conversation auto-builder for "receive_repeat3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "receive_repeat3";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['receive_repeat3-0-2'] = {txt: "Password?", value: 'receive_repeat3-0-2'};
		this.conversation_start(pc, "What's the password?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat3', msg.choice);
	}

	if (msg.choice == "receive_repeat3-0-2"){
		choices['1']['receive_repeat3-1-2'] = {txt: "Yes! Stuff. Let me tell you, it was pretty hairy getting it he…", value: 'receive_repeat3-1-2'};
		this.conversation_reply(pc, msg, "YEAH! PASSWORD, NOW, or I'll… Ha! Kidding! I'm having fun with you, comrade. You got the stuff?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat3', msg.choice);
	}

	if ((msg.choice == "receive_repeat3-1-2") && (!replay)){
		this.setAndBroadcastState('takeBox');
this.setInstanceProp('talk_state', 'talkWithBox');
pc.announce_sound('SMUGGLER_GIVES_OR_TAKES_BOX');
pc.quests_set_flag('contraband_delivered');
this.received_package = true;
	}

	if (msg.choice == "receive_repeat3-1-2"){
		choices['2']['receive_repeat3-2-5'] = {txt: "I am?", value: 'receive_repeat3-2-5'};
	}

	if ((msg.choice == "receive_repeat3-1-2") && (!replay)){
		var val = pc.items_destroy("contraband", 1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "item_take",
				"which"	: "contraband",
				"value"	: val
			});
		}
		pc.buffs_remove("dont_get_caught");
	}

	if (msg.choice == "receive_repeat3-1-2"){
		this.conversation_reply(pc, msg, "Whatever, kid. This is great. You're a peach.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat3', msg.choice);
	}

	if (msg.choice == "receive_repeat3-2-5"){
		choices['3']['receive_repeat3-3-5'] = {txt: "Sorry, what?…", value: 'receive_repeat3-3-5'};
		this.conversation_reply(pc, msg, "Yeah, you know. Fuzzy? Sweet? Good at smuggling stuff and following maps? You know: peaches! ", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat3', msg.choice);
	}

	if ((msg.choice == "receive_repeat3-2-5") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(100 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.stats_add_currants(200 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "cash_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.isOnGround()){
			var val = pc.createItemFromSource("gem_diamond", 1 * msg.count, this);
		}else{
			var val = pc.createItem("gem_diamond", 1 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "gem_diamond",
				"value"	: val
			});
		}
		this.gave_rewards = true;
	}

	if (msg.choice == "receive_repeat3-3-5"){
		this.conversation_reply(pc, msg, "Whatever, comrade. The movement wanted me to pass on these tokens of our esteem. Stay free in the brain, kid.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'receive_repeat3', msg.choice);
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "receive_repeat3-3-5") && (!replay)){
		this.apiSetTimer('receiveDoDisappear',3000);
pc.apiSendMsg({type: 'clear_location_path'});
pc.clearPath();
pc.completeQuest('smuggling_basic',true);
this.has_conversed = true;
	}

}

var conversations = [
	"give_first_time",
	"receive_first_time",
	"give_repeat1",
	"give_repeat2",
	"give_repeat3",
	"receive_repeat1",
	"receive_repeat2",
	"receive_repeat3",
];

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
	if (pc && (pc.stats_get_level() < 12)) out.push([1, "You need to be at least Level 12 to entice a Smuggler to contact you."]);
	return out;
}

var tags = [
	"smuggler",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-98,"w":70,"h":98},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJPElEQVR42u2Y2W9T6RnG+Q9Qb3pX\noDCEQOIl8W7H+\/EWJ94S705MFicmduIsdtYGhwSIQ8gCAQbClIQ9ZIaYfSkMGUBd2Jp2etVKFapG\naq86lmYKV0VPv+8wg6rRXIW4nUo90qvvbJZ\/592e95x16\/6\/\/Y9tTYxg\/Q8aMKATz\/1g4UTbNiUq\nZfzl757vdBp5\/zGIwZpKddJjTn9faGsN8pxBWMQCdnnM4d0hW3owZM92VptyeQdLesvtSbd5OeWx\noKPKiLGYGwcTntxorGqupVqXrlTwl83iYng0IjRVqBGz60Hv7XKbUW9RTuUFqitQvrHbbw632HUv\nmys12GXTosWmA91PBiwYa3VjZJcT6YgdDrUAZcUfwK4oQdioAPkNe3+tUT6Xp1DapgaClRgM2dDr\ns6LTbUJH9VsjIWY90+23oNNvQkOlCjVGOTS8bVBytsIkKoZFzIFHJQjnLc9219gJiAVtLgNancz3\nGvVSY7kKIYMMTqUANjkf+pLtEBduSpds\/+nGvOVbe5UxS\/On129Fn7+C9RY5B5Ls6PGVs5Yg4BGr\nmvWcRyuGm+RetVoIXUkhRIWb8tdqfvcK4lNn5nN7U60YjNYg7tCThKf59Db3aF41V2jQQDzn10tZ\nKK9OwgK6tUJU60RQiTj5A\/zNl69GL17JInv\/Hj599gL3nzzD3Nl5HPnwKCanDmL\/\/iEM9qUQj9Zj\np78Ku3YGYFPwUV+pxHCzE6EKFXRSfv4An335eub6o8e4\/vARFm\/dws8vnMf07HFkpiYwtG8Y3X1J\n7IpFEKz1weuvhsfrglK4HSNRF3ZHHHCbVWDE3Jc+nTTtzofsvXj95sCNJ8\/+fOr6ddx\/cQ9nb1zG\n5Pw89hyeRnI4jcZEDDubQvCGPKgicDaHFTIhn1gpLGopolU66Eu3w6UszZLczAV08rUtludfv9n\/\n6csvlj68dB5ffPUE1+7Nomf\/XsR7U2hKxDGYjuDFiwl0dfpYQGuFiYXTyUrhJdVMK1kr3LHiLCtd\n8WrFvLBJsbKmgE\/\/8c\/ks1dv0gPjmdcXs+MYzPSjpbsLTR2taIhHcehwDH\/\/6jLGRsMsYLC+BioJ\nFzGXni0aK8lHu0aw7FIJXnZ6jbyYQz9H1zUD\/P3X+PFnf\/nbgeMnT2B8ehK9JKydA73vAJvi9Rge\nrkckEkJzJIx+cq3WoqJyBhdtNYwYrV4m59aIV4gkhqm1ORn7mnpxNBHpGUnGkNk3hMzEOCZnpjE5\nfRATE2PIZEYwNPQzpLraEIs2oM5hZNuQl5Gi3q5CHanm3REbOZYQTdaku1zlG0l7Wlst7g9UpKnM\nkZWVtoTfhtZaNyLBagRdVvjtFrh0Mrb30d5YY1bASfpfT9iKuIfBaKwafpMMzba3YGRd2zyM2siT\nE+1NeS2satCVGpU+qiA0nFRBKCBt3AYZFx0BE\/p2WhF1aRGwyGFW8N\/pcJCRLdNQrxlg3MGkqdYm\nqgzv4Lr\/TeKaiMT5iXr4tBI2tBSwM2gm3tOjzqYixxxIOFvseWvWKY95jgL1kRBTo5rcTSA7qo2I\nkpCGGBnpcwI0kX2XTog2nwHtfiNJBRNibgZ+sxxaUdFy3gBjDt3L7m\/C+61RL1Kv1pJZj8x4qDOX\nwUe8F63WIUEAgxYFATWSKpagSi+GVVUKOb8gvWZQf3yQ4a3c2hMeT7rS4XIlC0Q9lvhm3KKTCwWj\n+Uf3d5rK0OAxwWMtQ3cNeZjactST8FaSwfVbUwu3v78X\/\/rbgxv\/9Hjq5cqdfXiw0INHi914fm0A\nt+ZTyH6YwEQ70dhGB5KhSjK1iNHoYhD3EfhQBUb6GhGu0rNw1OJBC45m2vHJ3F4MJILvH+bP7wxn\n\/\/CLfXh+tRe\/utSGp5c78fntIazcHcX9cx14uNiL5YUkHi504MqxMObGQrh9th9L8yMsRGZ3FFGf\niYVLt7jx8akRLJ3ex147Ot4FRsaHXCJcfbFcO9HI\/vHHh0O4d7oFT68NEi\/24bPzrSzsrxfb8Oh8\nCx5eaMWLm0P45dIA5kZ9OLa\/AQsf7cHB4TgCDgZBuwF7+5twcroHF08OYXaqB\/F6F1RSIQT84sSq\nAU+NenD5SB0LSe3uuS52vTHbiKsnGnD\/TAyPF9px91Qz5jNecr0bhwZsaG+wsIAXZtPwOsth1pHW\noilDKh7CBIEe6AxDSiYcaSkXypJC9argbh4JbMwercXCVBDXjtexXrx9Nsmun8yE3kFfmAxgdqSK\nBbt1JolGrxrT+xJsGGlIT830o5zRQCERQCUTodZnhlEjhUrMg4xfACn3g9VV8uJhv3phOgBqV47t\nRPZoGE9ukvyZqWEhZwbtmOyrYI8zKSJ1YR0yPW4Y1SJolVLMHx1gQzqT6YCjXAuZqARF27ZCR665\nyNjV5NLBqixZPeDSsRr1yb1VODsewNXj9cgSbz24NIA7c1GMd1txeszDgl6cCiAZMUHI50JcyodE\nUAIBj4ND+xOsxeqdcJhU4BdvJ3NhCUxaJaS8AniNMiJ5itX3wlREqZ7qr2RDeGHST0C9uHM2hcVD\nQVwiRteF6SCWSBrEa3UwqoTgFe1AceE2GLUytDd70EBajbu8DHGvgYVRlBTARZo0Iy1GFWnYdTY1\nzHLu+zXrwbiWl+kyJQ4PurI3T3fhzAEvzh304TIJ7ekxuu9HvEYHpqyEDKZ8FBdsRoVeAr2CB7WU\nQ1oJB50BM1EUBg6tiIUKEWg63dBzXpM8t+pC+e72YGGQt7uFsQ+1GdOZpGV5sq8yd4CEe2+7iRRH\nGRwWNSQlRZCRd1+FkAMht4C8wfGQCllYLzY6tSxgzGNATYWSBax3aGCSc7H2A0ONRd1ABlC9uBiK\n0iIoBMUk4beCt+0nEHALSU5ySN7tYKuXNmoqdxSMQlGPUjA6PLSQ4aFSVbr2r6H0w5FLK8yZSQgN\nkiLoRaQIuFvA37YB3IINaaoSjLwUalExeZPTspB0WKCA1KMtbgMZvwy57trylR43k5+vrhYZJ2sh\n4WHEO6AiBSDjbl4RbN683igu4plknBwjLoJGWEiGVA2anBrWgzTMnUHTVNxjTDc7tfn9cMkICIy0\nKKwT70hLuVvCgs0\/Wm+Sc+wEOsd6lYBrWUAtwlbFChlUlwMWWWLdf3MjXlUbJcU5E2klFFDO3ZLj\nF25Y9Tj\/LzDGt72DKnb0AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_smuggler-1342642657.swf",
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
	"smuggler",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_smuggler.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
