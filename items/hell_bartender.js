//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Hell's Bartender";
var version = "1344982233";
var name_single = "Hell's Bartender";
var name_plural = "Hell's Bartenders";
var article = "a";
var description = "A mixologist of the underworld, no one knows the true story of Hell's Bartender, but assume he was either really good at pouring bad drinks, or really bad at pouring good drinks in a previous life.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["hell_bartender", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_offset_x"	: "0",	// defined by hell_bartender
	"conversation_offset_y"	: "20"	// defined by hell_bartender
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.talk_state = "talk_left";	// defined by hell_bartender
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	talk_state : ["State currently used for talking"],
};

var instancePropsChoices = {
	ai_debug : [""],
	talk_state : [""],
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

verbs.talk_to = { // defined by hell_bartender
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Chat up the Hell Bartender",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var text;

		var text_options;

		// General text options
		var general_options = [	
			"I hear Naraka is pretty <i>Hellish</i> this time of year, heh heh heh.",
			"Close the door, you're letting all that fresh air in.",
			"Pull up a stool... if you can reach it.",
			"Get out there and enjoy the heat, you tenderfoot!",
			"Did you hear the one about the Demon and the Chicken? Remind me next time you're in if you haven't!",
		]


		switch (pc.getQuestStatus('hell_quest')){
			case 'todo':{
				// Hell Quest is ongoing

				if (pc.items_has('wine_of_the_dead', 1)) {
					// Hell Quest is ongoing and has Wine of the Dead text option
					text_options = general_options.concat([
						"Your wine of the dead is getting cold, roughneck.",
					]);
				}
				if (pc.items_has('drink_ticket', 1)) {
					// Hell Quest is ongoing and has Drink Ticket text option
					text_options = general_options.concat([
						"If ya got a Diabolical Drink Ticket I can get you a drink.",
					]);
				}
				break;
			}
			case 'done':{
				// Hell Quest is complete text options
				text_options = general_options.concat([
					"Good to see you again, rabble rouser.",
					"You look buffer than last time, captain. Musta been that Wine of the Dead!",
					"Last time you were here we were just as busy as now.",
					"You don't look too bad for someone who drank Wine of the Dead.",
					"Down here again? You're forming a dangerous habit, kid.",
					"You here for another bottle of Wine of the Dead? Incorrigible!",
				]);

				if (pc.items_has('drink_ticket', 1)) {
					// Hell Quest is complete and has Drink Ticket text options
					text_options = general_options.concat([
						"You here to exchange that Diabolical Drink Ticket for another Wine of the Dead?",
					]);
				}else{
					// Hell Quest is complete and does not have a Drink Ticket text options
					text_options = general_options.concat([
						"Another Wine of the Dead? You'll need another Diabolical Drink Ticket, buster.",
					]);
				}

				if (pc.items_has('wine_of_the_dead', 1)) {
					// Hell Quest is complete and has Wine of the Dead text options
					text_options = general_options.concat([
						"You still haven't drank that Wine of the Dead. Too stiff for ya? Heh heh heh.",
						"Your Wine of the Dead is getting cold.",
					]);
				}
				break;
			}
		}

		if (!text_options){
			text_options = general_options;
		}

		var text = choose_one(text_options);

		if (text_options.length > 1 && this.last_talk && this.last_talk == text){
			return this.verbs['talk_to'].handler.call(this, pc, {});
		}else{
			this.last_talk = text;
			this.speakTo(pc, 3000);
			this.sendBubble(text, 5000, pc);
		}
	}
};

verbs.buy_wine = { // defined by hell_bartender
	"name"				: "buy wine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Exchange a Diabolical Drink Ticket for Wine of the Dead",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Purchase Wine of the Dead",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'drink_ticket';
	},
	"conditions"			: function(pc, drop_stack){

		if (pc.items_has('drink_ticket', 1)) {
			return {state: 'enabled'};
		} else {
			return {state: 'disabled', reason: "You need a Diabolical Drink Ticket to buy Wine of the Dead."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.items_has('drink_ticket', 1)) {
			if (!pc.quests_get_flag('hell_quest', 'buy_wotd')){
				this.conversation_run_quest_buy_wine(pc, {});
			}else{
				this.grantWine(pc);	
			}
		} else {
			pc.sendActivity("You need to have a Diabolical Drink Ticket to buy Wine of the Dead.");
			failed = true;
		}

		if (failed) {
			pc.sendActivity("You tried to buy wine from Hell's Bartender.");
		} else {
			pc.sendActivity("You bought wine from Hell's Bartender.");
		}

		return failed ? false : true;
	}
};

function chitChat(pc){ // defined by hell_bartender
	this.verbs['talk_to'].handler.call(this, pc, {});
	this.apiSetTimerX('chitChat', 30*1000, pc);
}

function grantWine(pc){ // defined by hell_bartender
	var failed = 0;
	var orig_count = this.count;

	if (pc.items_has('drink_ticket', 1)) {
		var ticket = pc.removeItemStackClass('drink_ticket', 1);
		if (ticket) {
			ticket.apiDelete();

			var remaining = pc.createItemFromSource('wine_of_the_dead', 1, this, true, {suppress_discovery: true});
			if (remaining) {
				pc.createItem('drink_ticket', 1, false);
				this.speakTo(pc);
				this.sendBubble("It seems you can't fit anything else in your pack. Greed is good! Heh heh.", 5000, pc);
				failed = true;
			} else {
				var q = pc.getQuestInstance('hell_quest');
				if (q && !q.get_flag('buy_wotd')) {
					pc.quests_set_flag('buy_wotd');
					this.speakTo(pc, 3000);
					this.sendBubble("Not this time! Enjoy your Wine of the Dead, little demon. You may find it opens some strange doors for you. Heh heh heh.", 5000, pc);
					
				}else{
					this.wineResponse(pc);
				}
			}
		}
	} else {
		pc.sendActivity("You need to have a Diabolical Drink Ticket to buy Wine of the Dead.");
		failed = true;
	}

	if (failed) {
		pc.sendActivity("You tried to buy wine from Hell's Bartender.");
	} else {
		pc.sendActivity("You bought wine from Hell's Bartender.");
	}

	return failed ? false : true;
}

function onConversationEnding(pc){ // defined by hell_bartender
	this.setAndBroadcastState('idle_1');
}

function onConversationReply(pc){ // defined by hell_bartender
	// reset animation
	this.setAndBroadcastState('idle_1');
	this.speakTo(pc);
}

function onCreate(){ // defined by hell_bartender
	this.initInstanceProps();
	this.apiSetHitBox(300, -200);
	this.apiSetPlayersCollisions(true);
}

function onPlayerCollision(pc){ // defined by hell_bartender
	/* We offer help dialogues if the player either has never done the hell quest, or if they're on the quest but
	 * have got rid of their ticket.
	 */

	if (this.talked || !this.container.isInstance()) {
		return;
	}


	this.apiCancelTimer('chitChat');
	this.talked = true;

	var status = pc.getQuestStatus('hell_quest');
	var has_wine = pc.items_has('wine_of_the_dead', 1);

	if (status == 'none') {
		if(pc.items_has('drink_ticket', 1)) {
			this.conversation_run_no_quest_yes_ticket(pc, {});
		} else {
			this.conversation_run_no_quest_no_ticket(pc, {});
		}
	} else if (status == 'todo' && !pc.quests_get_flag('hell_quest', 'buy_wotd')) {
		var has_ticket = pc.items_has('drink_ticket', 1);

		if (has_ticket) {
			this.verbs['buy_wine'].handler.call(this, pc, {});
		} else {
			this.conversation_run_yes_quest_no_ticket(pc, {});
		}
	}
}

function onPlayerEnter(pc){ // defined by hell_bartender
	this.setAndBroadcastState('idle1');
	this.apiSetTimer('switchIdle', randInt(4000, 10000));
	this.apiSetTimerX('chitChat', 30*1000, pc);
}

function onPlayerExit(pc){ // defined by hell_bartender
	this.talked = false;
	this.apiCancelTimer('chitChat');
}

function onPlayerLeavingCollisionArea(pc){ // defined by hell_bartender
	this.apiSetTimerX('chitChat', 30*1000, pc);
}

function speakTo(pc, duration){ // defined by hell_bartender
	if (pc.x < this.x) {
		this.setAndBroadcastState('talk_left');
		this.setInstanceProp('talk_state', 'talk_left');
	} else {
		this.setAndBroadcastState('talk_right');
		this.setInstanceProp('talk_state', 'talk_right');
	}

	if (duration) {
		this.apiSetTimer('stopTalking', duration);
	}
}

function stopTalking(){ // defined by hell_bartender
	if (this.state == 'talk_right') {
		this.setAndBroadcastState('talk_right_out');
		this.apiSetTimer('stopTalking', 800);
	} else {
		this.setAndBroadcastState('idle1');
	}
}

function switchIdle(){ // defined by hell_bartender
	if (this.state == 'idle1') {
		this.setAndBroadcastState('idle2');
		this.apiSetTimer('switchIdle', 3000);
	} else if (this.state == 'idle2') {
		this.setAndBroadcastState('idle1');
		this.apiSetTimer('switchIdle', randInt(4000, 10000));
	} else {
		this.apiSetTimer('switchIdle', randInt(4000, 10000));
	}
}

function wineResponse(pc){ // defined by hell_bartender
	var text = choose_one([
		"One Wine of the Dead, coming right up.",
		"Here's your Wine of the Dead. Please enjoy irresponsibly.",
		"Oh ho, is it Unhappy Hour already?",
		"Be careful. This stuff can give you a wicked hangover. Heh heh heh.",
		"Didn't your mother ever tell you not to accept drinks from strange devils?",
		"One for you, and one for me."
	]);

	this.speakTo(pc, 3000);
	this.sendBubble(text, 5000, pc);
}

// global block from hell_bartender
this.article = 'the';

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

function conversation_run_quest_buy_wine(pc, msg, replay){ // defined by conversation auto-builder for "quest_buy_wine"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "quest_buy_wine";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['quest_buy_wine-0-2'] = {txt: "Hey, I'm tougher than I look!", value: 'quest_buy_wine-0-2'};
		this.conversation_start(pc, "Oh ho, what have we here? Aren't you a bit too young and tender to be frequenting a bar in the back end of Naraka?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'quest_buy_wine', msg.choice);
	}

	if (msg.choice == "quest_buy_wine-0-2"){
		choices['1']['quest_buy_wine-1-2'] = {txt: "So, I won't have to \"unleash the beast\" after all?", value: 'quest_buy_wine-1-2'};
		this.conversation_reply(pc, msg, "Oh ho, so you say. Well, short stuff, last time I checked you didn't have to win at arm wrestling to get a drink in my bar. How can I help you?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'quest_buy_wine', msg.choice);
	}

	if (msg.choice == "quest_buy_wine-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "quest_buy_wine-1-2") && (!replay)){
		this.grantWine(pc);
	}

}

function conversation_run_no_quest_yes_ticket(pc, msg, replay){ // defined by conversation auto-builder for "no_quest_yes_ticket"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "no_quest_yes_ticket";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['no_quest_yes_ticket-0-2'] = {txt: "Before my time?", value: 'no_quest_yes_ticket-0-2'};
		this.conversation_start(pc, "Well, well, well… what do we have here? It seems you've arrived a bit before your time.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_yes_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_yes_ticket-0-2"){
		choices['1']['no_quest_yes_ticket-1-2'] = {txt: "But I have a ticket!", value: 'no_quest_yes_ticket-1-2'};
		this.conversation_reply(pc, msg, "Yes, Wine of the Dead is reserved for the honoured dead, whose passage has been duly recognized.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_yes_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_yes_ticket-1-2"){
		choices['2']['no_quest_yes_ticket-2-2'] = {txt: "Hell yeah, I'll do it!", value: 'no_quest_yes_ticket-2-2'};
		this.conversation_reply(pc, msg, "A ticket is not always enough. No, first you must prove that your life—or your death—had value and meaning. Go find someone to Mourn your passing or Celebrate your life at your gravestone. Only then can you partake.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_yes_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_yes_ticket-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_no_quest_no_ticket(pc, msg, replay){ // defined by conversation auto-builder for "no_quest_no_ticket"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "no_quest_no_ticket";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['no_quest_no_ticket-0-2'] = {txt: "Before my time?", value: 'no_quest_no_ticket-0-2'};
		this.conversation_start(pc, "Well, well, well… what do we have here? It seems you've arrived a bit before your time.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_no_ticket-0-2"){
		choices['1']['no_quest_no_ticket-1-2'] = {txt: "I see. How does one get recognized?", value: 'no_quest_no_ticket-1-2'};
		this.conversation_reply(pc, msg, "Yes, Wine of the Dead is reserved for the honoured dead, whose passage has been duly recognized.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_no_ticket-1-2"){
		choices['2']['no_quest_no_ticket-2-2'] = {txt: "Well I'll be damned. Thanks!", value: 'no_quest_no_ticket-2-2'};
		this.conversation_reply(pc, msg, "You must contact someone in the land of the living, and get them to Mourn your passing or Celebrate your life at your gravestone. Only then can you sample these… refreshments, ha ha ha.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'no_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "no_quest_no_ticket-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_yes_quest_no_ticket(pc, msg, replay){ // defined by conversation auto-builder for "yes_quest_no_ticket"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "yes_quest_no_ticket";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['yes_quest_no_ticket-0-2'] = {txt: "Pardon?", value: 'yes_quest_no_ticket-0-2'};
		this.conversation_start(pc, "Oh ho, missing something, are we?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'yes_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "yes_quest_no_ticket-0-2"){
		choices['1']['yes_quest_no_ticket-1-2'] = {txt: "Oh hell, I most certainly would!", value: 'yes_quest_no_ticket-1-2'};
		this.conversation_reply(pc, msg, "You were expecting to obtain some Wine of the Dead, weren't you? You most certainly will need a ticket!", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'yes_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "yes_quest_no_ticket-1-2"){
		choices['2']['yes_quest_no_ticket-2-2'] = {txt: "Damn straight!", value: 'yes_quest_no_ticket-2-2'};
		this.conversation_reply(pc, msg, "Yes, your ticket. Ask a friend among the living to Mourn your death or Celebrate your life at your gravestone. This is what you must do.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'yes_quest_no_ticket', msg.choice);
	}

	if (msg.choice == "yes_quest_no_ticket-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"quest_buy_wine",
	"no_quest_yes_ticket",
	"no_quest_no_ticket",
	"yes_quest_no_ticket",
];

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function parent_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-116,"y":-182,"w":232,"h":183},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJj0lEQVR42u2YCVDTVx7HO6OdttPt\nahm1alFuEZAr3OEIRwRDgEBCAgk5gCRAoEA4DDcR5RIQqHhAtQR0VayttFN160VcRcWrWGtFHSvj\nNdvR0azt6Mx2Zve77\/1d3GVsd7u71WFn\/M\/8JpP\/9T7v+\/u+33vv\/8orL4+Xx\/\/JsWtjcccnPcvN\nW9bmc6Yc3MHttR3rVmnQacxAYSYf7bUZqikF2FwuN7dWKWFak4dVpVLUl0rNUwqwTJdoXluXOb6x\nQUvUS0d1QTJksWwbeu1Sm8zG3CA0DjZJjC26UM7BZvGMz9fIPV8oYOeKzI5iNd+0vUuPL35XgwaD\nDEpRWOE6qXtHAdsKH7eKYZD6IF\/ogWql7\/hAo3Swv\/09y9bO\/MFd3UWC5w64rl5tU5UnUnWtVD9V\nsColwFIcbIW8yPkoS\/NFkdgLWfFuTHzalYOBdXrsMVXg003LLR93lxS+ECV3k8Z623LRVq1CTug8\nKJe8hi4DB2VKP1TIWNDGuSGT54LNdVLs6i7Boe21+Ly3HF9srcILATw8sALr67XIl7AR7zANqS7T\nIfWbhZQIRya9FFCx1BmlqT4oz+KhtVKBdavUzG8W137Gcwfc+n4BqtRcxC9+A6olryLBcRpillhB\nFbMY6lhXRj1ltDPEHAfkk5Sn871QmRMDRZw3ZNxFo2Kf5wi5pyRKVc+3QYrbEzgawQ5vQRrtCh7b\nATGBdogLtgc\/wAYJQbZI57lCGuEE1TIX5jeBnG\/ODR98fgNFsnhc5fE6uJ7vYHl6CMQRi5DEtkES\nx5Eo5IV8aSBykv2gFfogzGsB0sIXISuKqBloC4HvQsR6W2NnSew4LUu\/OlyfJqAj3f01RLtZIUvk\nC31GKA7s0OHbk9V49G0L\/nzvEB5db8e+rVrkyAJRoQ5DObknO84DBURJXbQLA1qa4ImRFqnlV4Wk\nqc3zfwux9tOhFnhhtT4GpRoODgzocH2kBmd+X4Yf\/3QOj2\/04MYZI7Z1ybG+Mh7dNQKIokh6QxyQ\nSwCzuYvRqmQje6kL6rIiR\/tbVeaPerL+N09u0PpxmnjWkIUuRNSSWajUhKHTEAstSeWGxmSc2luE\nDfVC3P16FW6eNeLc\/lI0lyxDIVGxpSgGa8vjCKQr0sIcoSRWoErG+yxASrQbclMCsbEuZfS\/hqQP\nrtQEj+aw3iAlwg6RfnZoLIxBmyERhowwGDIJbHUCavOisLlZjA8IcE1OBOpyo1CYxsYqcp6qXZ0V\njiC3+cgkns0IdwLXYz48nOYwkOkJ3jA1KTr+Y7ht7RmCziqhpTzNH+nuryLZeTqyk7yxsliMFUUp\nkCaEYO6s38DNYTa8F8+bFMG+TiCLC3IPm6gUALaHNSK9rJkU81nWYDnOht38mQygMs4TDYU8rDEk\nGn8x3IfNcs\/GojhLrW4pCsUsppzQglyuDMWWznw00cbjgxBAGqbhbDeLCRvSKIXe2KjF7k0G1Ool\nkMex4GT9NkSkBCX62yDG8104vDsTfq7zGUA64OoLeFiVvwxra5L\/vZKfdGd7NhfHW9orRajQRuC9\n1ABI\/WehQRWIITKLUGV0Eg6M2VEoV0dAELkEaQQiOcYTetKBXCkb7TVpOLCtFqvJ7BEX5ARJkB2i\nCRhNrZf9LDhSYDJ4KKAmiYVq8i5Ts4K8Lxz9rcp\/vbCgpm0rE2Il6ZVezkYB8VJ\/q5aZV+uXyyDn\nsRDr9lvUqv0hjHSGj8s8OC60gjvxVJSvLeQxbjCoIhhAuqhY6mOHME87BLjbY6mvDTgsGwaMBoVM\nJfdTEYwkW7U5XKx4L9rys4OGqteoj0VjsQCbV2vR15aN3lYdmivkKNLwoREGkLrmimS2NXhL3oYs\n0pGoMRML5s7AHKs3EbRoDuOxnAQfDO9uYAD5y6IgEQuRkS5HdKD9UzgacaFOSAx3hoznjhJVCFaX\nxCM72RddRonpp4txs8JkzItGZVYktCI\/ZBKgcD9HZCb5MWanPZ0IeawHhg7tgTAhmvEeBdSTkc51\neB1poXaMgrVFCrS21KOvdyMGtpkQ4rVgEqC381wmqJLp8V5MuzRrmYksMisFPbvvWVslGq8hMhem\nBUHB96BGHiUPF\/4zGA1qbNrA8B\/2w9n2yeBweed1CBdNI4OKg6YiEXqasiFmzUZ7qRJ7PvsI+\/cN\nPgNIvWg7b6bZaaFVB1WyVBXKANJrekWo6ZmaRyU2ZHIYCHqT7dyZTC\/If\/MEnE7sx6RkArC7qwX2\npKEw13nIinFHX3cTOkhqNaJwpAXbonNlKQO3fcumSYA0vbTUTLRBvDmuIXN4ASnwzOAR+o5OXohu\n0HEoIO3BBCAvyJF5WBjpYkMVzRB4M6am1zatb8HYpQv48twZtLU04PyXZ3D58kVcG7+G3dvex6aO\ncmxsMzCxc3M92purJgHSwULVm2ifG2BnppnJSX6SnXwZe\/IC94OWfAZwQil6kyTa7enWkhfsaKbn\nMpICcGxoL3744Qfcu3cPt27dwp07d3D\/\/n1cujgC0\/pq9H3YjqGDn2LXtg1k4RCJfHk41Ek+WJ7B\nQTFJI\/VYkOdC2M6fKXj8+HHh2bNnB0+ePEk6eQo7TF3ITeM+C8hsjGpkTxWkFV7O9xjVJLKMFdrw\nwcYivqWKmFiRGIJjx47hyJEjGBoawunTp5n45soYtva24eK31zF28xYujt\/A2I2buHr1CvS5StSV\nSNGwPBW61BDG3zqJPyqzYy2N1Xk4NXKC6SztNO3s\/s93\/gxgnXq8Xp+Ack04U5fogCkjniz7uy9L\n0iPw9ehpWCwWRrELFy7g0MGD6Ovrxd49u3D4+DBOf\/UVBsm5gydP4KsrV3D77l3oC3SM35QiDlpr\nMtBCylZOSvA\/Bgw\/EGNjY3j06BET3\/3xDppKRc\/uuxXiyMHmChXWVMnJAoCPMg2XicrsGPJSGVqr\n1easTLlRKZM8DX\/WYmN1pcG4e9+eht379285fuHCZ1dv3x4aPn\/+9PGL3xy+dPXqyVRJgpGkkwlX\n+7nGPBXPXJYnInO6BNkpoVAmheLcuXN48OAB7pIOPXz4EEfNB0w9PT2TCzaX7Bd0Ch4nR8EzVxVI\nLCtKZaP5mfFoLFN2yJIiBNxfsJ\/4Dnjzxo\/wuf8X1P74VxwB8JML04gQN88SnUglFYSM67WCUeJD\nBpBa5\/Lly0x2qKokW6Yp8eWCgI1+\/\/33OHHiBI4ePYorxB4jIyMYGBiYGp9YduzYYRweHsbt27dh\nNpst\/f395mvXrk2tD1TUc729vZz29nbBKy+Pl8cUOv4GL24QyyFYI74AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/hell_bartender-1330026007.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "buy_wine",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("hell_bartender.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
