//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Juju Grandma";
var version = "1344982233";
var name_single = "Juju Grandma";
var name_plural = "Juju Grandmas";
var article = "a";
var description = "The meanest and most mercenary of the Juju band, Juju Grandma has no compunction about robbing you blind and leaving you for rookfood. (Unless you can be of help. Then you might get to live. Maybe)";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_juju_grandma", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
};

var instancePropsChoices = {
	ai_debug : [""],
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

function doIdle(){ // defined by npc_juju_grandma
	this.setAndBroadcastState('idle');
}

function giveItems(){ // defined by npc_juju_grandma
	var q = this.pc.getQuestInstance('help_juju_bandits');
	if (!q) {
		log.error(this.pc+" is attempting to receive items for Juju Bandit Quest without being on quest.");
	}

	var remainder = this.pc.createItemFromSource('juju_trowel', 1, this, true);
	if (remainder) {
		this.conversation_run_bags_full(this.pc, {});
		return;
	}

	if (!q.giveHint(1)) {
		this.pc.items_destroy('juju_trowel', 1);
		this.conversation_run_bags_full(this.pc, {});
		return;
	}
	q.openHint();
	q.offerCampExit();

	this.given_items = true;
	this.doIdle();
	this.apiSetTimerX('jujuBanditScene', 5000, 0);
}

function jujuBanditScene(state){ // defined by npc_juju_grandma
	switch(state) {
		case 0:
			if (this.bandit_kid) {
				this.apiSetTimerX('jujuBanditScene', 1000, 0);
				return;
			}

			this.bandit_kid = this.container.spawn_npc(-1050, this.y, 'npc_juju_bandit');
			if (this.bandit_kid) {
				this.bandit_kid.dir = 'left';
				this.apiSetTimerX('jujuBanditScene', 1000, 1);
				this.bandit_kid.setInstanceProp('bandana', 'none');
				
				var color = this.pc.getQuestInstance('help_juju_bandits').getJujuBanditColor();
				if (color) {
					this.bandit_kid.setInstanceProp('variant', color);				
				}
			} else {
				log.error(this+" failed to summon Juju Bandit kid somehow.");
			}
			break;
		case 1:
			this.bandit_kid.pathTo(-2304, this.y);
			this.apiSetTimerX('jujuBanditScene', 8500, 2);
			break;
		case 2:
			if (this.pc.x > -2000) {
				this.apiSetTimerX('jujuBanditScene', 1000, 2);
				return;
			}

			if (this.done_first_convo) {
				this.random_convo = randInt(0, 6);
				this.apiSetTimerX('jujuBanditScene', 4000, 3);
			} else {
				this.random_convo = 7;
				this.apiSetTimerX('jujuBanditScene', 4000, 5);
			}
			this.bandit_kid.sendBubble(this.kid_convos[this.random_convo], 4000);
			break;
		case 3:
			this.setAndBroadcastState('talk');
			this.sendBubble(this.grandma_convos[this.random_convo], 6000);
			this.apiSetTimerX('jujuBanditScene', 6000, 4);
			break;
		case 4:
			if (this.random_convo == 0 || 
			    this.random_convo == 1 || 
			    this.random_convo == 4 || 
			    this.random_convo == 5) { 
				this.setAndBroadcastState('angry');
			} else {
				this.setAndBroadcastState('idle');
			}
			this.bandit_kid.setAndBroadcastState('idle2');
			this.apiSetTimerX('jujuBanditScene', 4500, 5);
			break;
		case 5:
			if (!this.talking) {
				this.setAndBroadcastState('idle');
				this.apiSetTimerX('jujuBanditScene', randInt(5000, 10000), 0);
			}
			this.bandit_kid.escape();
			delete this.bandit_kid;
			this.done_first_convo = true;
			break;
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_juju_grandma
	if (!oldContainer) {
		this.doIdle();
	}
}

function onConversationEnding(pc){ // defined by npc_juju_grandma
	this.talking = false;

	if (this.giving_out_quest) {
		this.doIdle();
		this.apiSetTimerX('jujuBanditScene', 5000, 0);
	}
}

function onCreate(){ // defined by npc_juju_grandma
	this.initInstanceProps();
	this.kid_convos = [
		"Grandma, I’ve returned with three whole sheets of paper!",
		"Grandma, I managed to nab this Focusing Orb from an unsuspecting sap.",
		"Grandma, I chased someone around like you said, but they were too fast for me",
		"Grandma, I can’t catch anyone. Why do I have to walk around so slowly?",
		"Grandma, I found this Grilled Cheese Sandwich, and it’s the expensive kind!",
		"Grandma, I brought more paper, but don’t we have enough yet?",
		"Grandma, I nabbed this Walloping Big Diamond.",
		"Grandma, I brought that crafty Glitch who's so good at dodging us!"
	];

	this.grandma_convos = [
		"Three sheets? Your grandfather used to return loaded down with paper, his back bent under the weight of it.",
		"What good are shiny trinkets when you want to write something down? No, paper is the thing, sonny, and lots of it!",
		"Did you remember to threaten them? Why, your grandfather could freeze even the bravest Glitch in their boots with a well-placed threat.",
		"Slow and steady wins the race, as your grandfather always said.",
		"A cheese sandwich? So grandma’s paper soup isn’t good enough for you anymore, you ingrate?",
		"Paper was good enough for your grandfather, and his father before him, so it’s good enough for you. Fewer questions, more paper!",
		"Walloping Big Diamond, you say? Well, maybe we can trade it for some paper.",
		"What? That's not… Can't you kids do anything right?"
	];

	this.apiSetHitBox(200, 200);
	this.apiSetPlayersCollisions(true);
}

function onPlayerCollision(pc){ // defined by npc_juju_grandma
	if (!this.container.isInstance()) {
		return;
	}

	if (this.done_first_convo) {
		this.apiCancelTimer('jujuBanditScene');

		if (this.bandit_kid) {
			this.bandit_kid.escape();
			delete this.bandit_kid;
		}
	}

	this.talking = true;

	if (pc.items_has('juju_paperweight', 1) || this.giving_out_quest) {
		if (!this.giving_out_quest) {
			var items = pc.takeItemsFromBag('juju_paperweight', 1);
			if (items && items.length) {
				for (var i in items) {
					items[i].apiDelete();
				}
			} else {
				log.error("Juju bandit quest attempting to remove ancestral paperweight from "+pc+", but it has failed.");
			}

			var items = pc.takeItemsFromBag('juju_trowel', 1);
			if (items && items.length) {
				for (var i in items) {
					items[i].apiDelete();
				}
			} else {
				log.error("Juju bandit quest attempting to remove trowel from "+pc+", but it has failed.");
			}

			pc.quests_set_flag('return_weight');
		}

		this.giving_out_quest = true;

		this.setAvailableQuests(['help_juju_bandits_2']);
		this.offerQuests(pc);
	} else if (this.collided) {
		if (this.given_items) {
			this.conversation_run_already_started(pc, {});
		} else {
			this.conversation_run_explain_again(pc, {});
		}
	} else {
		this.collided = true;
		this.conversation_run_explain_task(pc, {});
	}
}

function onPlayerEnter(pc){ // defined by npc_juju_grandma
	if (!this.container.isInstance()) {
		return;
	}

	this.pc = pc;

	if (this.pc.items_has('juju_paperweight', 1)) {
		this.done_first_convo = true;
		this.apiSetTimerX('jujuBanditScene', 3000, 0);
	} else {
		this.apiSetTimerX('jujuBanditScene', 500, 0);
	}
}

function onPlayerExit(pc){ // defined by npc_juju_grandma
	this.apiCancelTimer('jujuBanditScene');

	if (this.bandit_kid) {
		this.bandit_kid.escape();
		delete this.bandit_kid;
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

function conversation_run_explain_task(pc, msg, replay){ // defined by conversation auto-builder for "explain_task"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "explain_task";
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
		choices['0']['explain_task-0-2'] = {txt: "So you're the one after my stuff!", value: 'explain_task-0-2'};
		this.conversation_start(pc, "Oh, it's you, er… what's-yer-name. Smelly, was it?", choices['0'], null, null, first_property(choices['0']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-0-2"){
		choices['1']['explain_task-1-2'] = {txt: "Fair enough.", value: 'explain_task-1-2'};
		this.conversation_reply(pc, msg, "It’s a lawless land, this, wild and lawless, and the good Giants help them what help themselves. I won’t apologize for going after your paper.", choices['1'], null, null, first_property(choices['1']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-1-2"){
		choices['2']['explain_task-2-2'] = {txt: "I'm listening…", value: 'explain_task-2-2'};
		this.conversation_reply(pc, msg, "We’ve brought you here to propose a mutually beneficial agreement between you and the Juju Bandits. See, something of ours has gone missing, and we need it back.", choices['2'], null, null, first_property(choices['2']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-2-2"){
		choices['3']['explain_task-3-2'] = {txt: "So you want me to…?", value: 'explain_task-3-2'};
		this.conversation_reply(pc, msg, "I tasked my grandsons with hiding our most precious heirloom, the Ancestral Paperweight. Only now they can’t remember where they buried it. They wrote clues to its location, but I can’t for the life of me figure them out.", choices['3'], null, null, first_property(choices['3']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-3-2"){
		choices['4']['explain_task-4-2'] = {txt: "What do I get out of it?", value: 'explain_task-4-2'};
		this.conversation_reply(pc, msg, "Follow the clues. Find the Paperweight. Simple. You’re going to need a trowel for digging, and a clear head for puzzling out clues. It'll be well-hidden, so you'll need to decipher the clues. There'll be nothing so conspicuous as a pile of fresh dirt to look for.", choices['4'], null, null, first_property(choices['4']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-4-2"){
		choices['5']['explain_task-5-2'] = {txt: "OK.", value: 'explain_task-5-2'};
		this.conversation_reply(pc, msg, "You’ll be richly rewarded, I promise. I’ll tell my boys not to mess with you while you’re out, but really I wouldn’t count on them. Here’s your first clue, and a Juju Trowel for digging in the savanna soil.", choices['5'], null, null, first_property(choices['5']).value, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_task', msg.choice);
	}

	if (msg.choice == "explain_task-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "explain_task-5-2") && (!replay)){
		this.apiSetTimer('giveItems', 250);
	}

}

function conversation_run_bags_full(pc, msg, replay){ // defined by conversation auto-builder for "bags_full"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "bags_full";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['bags_full-0-2'] = {txt: "OK", value: 'bags_full-0-2'};
		this.conversation_start(pc, "That won't do. You'll need to make some more room in your pack—space for a trowel and for this troublesome clue.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'bags_full', msg.choice);
	}

	if (msg.choice == "bags_full-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "bags_full-0-2") && (!replay)){
		this.doIdle();
this.apiSetTimerX('jujuBanditScene', 5000, 0);
	}

}

function conversation_run_explain_again(pc, msg, replay){ // defined by conversation auto-builder for "explain_again"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "explain_again";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['explain_again-0-2'] = {txt: "OK", value: 'explain_again-0-2'};
		this.conversation_start(pc, "Are you ready now? You'll need to search the savanna, puzzle out the clues and find the artifact.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'explain_again', msg.choice);
	}

	if (msg.choice == "explain_again-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "explain_again-0-2") && (!replay)){
		this.giveItems();
	}

}

function conversation_run_already_started(pc, msg, replay){ // defined by conversation auto-builder for "already_started"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "already_started";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	if (!msg.choice){
		choices['0']['already_started-0-2'] = {txt: "OK", value: 'already_started-0-2'};
		this.conversation_start(pc, "Go on. You've got work to do.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'already_started', msg.choice);
	}

	if (msg.choice == "already_started-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "already_started-0-2") && (!replay)){
		this.doIdle();
this.apiSetTimerX('jujuBanditScene', 5000, 0);
	}

}

var conversations = [
	"explain_task",
	"bags_full",
	"explain_again",
	"already_started",
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
	"npc",
	"juju",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-49,"y":-128,"w":97,"h":128},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH3ElEQVR42s2Y60+b5xnG+dYmacop\n4RAOPnCywRjMyWAMBmoDNifbYAPGYGNjG9ucwskQEkwCSSkEXE1V1anpSCtV29RqTMtUqf3Cl3bS\npm7W2k3TtEooWzat2wf\/Cdee+yFOo2n70uCER7r0vK+NeH9c9+G5X5KSnmFtBVWCm8FGx8aUKhwc\nqTxgik6PKrA8UYelidqjkEd5tBaoP1jy1GqSnudiEBp6+MZ0I0jX\/Q1Y8Spx1VkNBomA7TtN2RVY\n9Smx4lMeL4xXOxIO57WIk\/22itjMWBVIBEU7QSx76uAbrMCEpRwzo1XcybjoDwix79eDquitKXVF\nwgBd\/eUH3kH5E3doD44o4B+u4NceqxzdLYUYMSphMVRDWy9FR3UpWhpk6GqrwmB3DYYMknDCAJ0m\n2RFBTDIg31AF3APlXHQ91FsH57AJ68tTuDbvx\/WFABaCLvi6uuDs6cJ8wIXQrBcboRksTk9EEgJo\n7yvjgCQCG+6ScOfGB1uxPOPB9cUAbiwGMe0YRtDaD2eXHiPtOtjq1bAN9CDgHsGycxQrcz6EQt7k\nUwdk4TmIu2bpKIalswQhbyM2r81hyjOKZXM\/5hXNcOYzV8UsN+WtWK\/U4t5rNrzZaMROrQHvNA9g\nXWuMJcRBa6ckPNwlha1bCrOuCAuuGqxN9+Lm6ixaxBI0peRCf0mE3oxCjOXJOOh8qRq3qzuwr+x+\nolvytsSEuLk6x9HXVgiCdDEXqXoX\/BYMtGhQ\/2o2lBdP1PDqFaiTc9Camo+OS0L0ZhZiNLcMy8X1\nWJWosCJRJaZQjG2FEYIb1Et4oZAcLLdU2SJUv5KJqseqeSWLgzYyyDYGSa66BHIOd6IGTQJ6YHUy\nC22MVTKsLPf81Iz7FFgYn0Tl+cuQP6XKCxkcklylsOvSBehjLi4WK7lC4uqEFEjYYSrDHGvOlH9U\nvTaVFFfHnByqnEl2\/hLf6V7BIGsvZvEwdzIHDZfFmCushVeoiJ46nEUrTrb3lPKmfD3QAAKl5mxt\nksNrMaPqQiakL6eh5KVUlJ5LR+nL6RySPqeCGc2VQc8Apwtq4MgrPzp1QLO2KEJQdIrQ+TthkcPV\nL8NQUx0DNKElNQ89DETCICmk2nQhKs5nQH7uxMmO9BMHzVnF5OLpVzALadTeW4p4kyY4uifAqSEL\nf7iCufXh3Tfx8NFD\/OqzTzGp7WEFkwEVq2hjZhF+tvcD3Asunn4F65uEGuYgby00CBCgw1iGcbMM\nrq5WjOh0LLzpaGd51p9dwtzMh0VcgfqLV1iIM9DMHK1jFe3MK8dIThnsuaWnDKgWHhIciVxjAwMo\nH6mSLcxBd7+RhfOkMKjVxEVw1Avb0vJZyAWYZQXiEVYyQNnhqYC1q0UVnWphmDkYIwctHSWIgxqa\nRfw06S+RY6K3h4exniubQ1EPbEnJ4z1QmybgjXq+qI4DMhePDSkiwTNVbE+LONKtEdNoxNXTUgB9\nEzvCWgvQqRahQy3kBWPOKsFmwMtBNAwofnpYsyUYvCJFOysWfU4BDJfECLCzmQqJQu0XKY5dOWXf\nby7UNeZHTMyxfl0xaCfA+OlBLpL4yMVGLKtUDv+akxcJ9bp2dqyZWKXqL4swJK2CR1ILf6cKQXU9\n1gw63H9jB3dMo\/AIKjEpUnz\/dqOUZ8++1iCIUZ4RHEERMO0D7cWg02SkR4o+cRGmbFbYckoZWBGv\nVtpHShS4\/9YufnhvE26Zgp8eK\/JGHHxwG9\/85Y\/49tEjBMpUeKYcrBanJjdW5jwJNTlIjpIo\/0za\nQhjyxRzOnV\/BXXHlszmRaXPShV8++BBf\/f7X+Os3f8bbZhe+cN\/Axx+9i9\/99nN8+89HWBp2ns7I\npZBmC7TK\/AjLuxhNMnFIA8tJfa6Itw6fSAEHG61s7Jr09rU1PPjFR\/j6q9\/g3\/\/6Bx58+hncC4u4\nc3cDn3zyU3zx+RHmAqZoKGI8CO2ZTucdhRytlWXOqqtyopqaXLTJ8jmgPk0MO4OaKazBSkkDIuYx\n\/Pz++\/jJj9\/DH77+En\/7+0MsbL8Ox+BozO504+rWBhx9FnSkCGfp9y5HjOGlfVNiXk2pXXSmio4N\njyGNGcVh0oS9Jbq77I9sv\/vO8TWmycjOsXv9RmwifAOejXV4jIPYVeqPkp7H0qeKouQiQdI9hYyF\njj98MrJ7dKKdg2GLLTpktMK7EWaF5cTH3RP4kW44cS\/12lRxsj5VfEhwJHLyccgO4yEj5wiOIL2v\nb8EVCnEHfR4\/3lIb8YFuJJIwwM40cTgOx8VgOeC+if8Hwbu9nUxgvshujO3w3NmMESCHnF\/A9XIN\nQmVNzw\/QkiXB00eYf39H49vf7fPv33WcuLhz4Nm6eTTq8cXMZcqTGTFFqEk4IIHNFNXgvbZBhKt0\nB\/HvmWthcvF\/pgYDSygcB0wROgjQnFHMh4Ab5U14v3P86GnApBe5KJzx8NrZK+VsUS22lV1PACm8\nSS96sWbbR9XbnV6AIBunbFe+G0aDd+8KzgQk74WPc4ry6+nPGWAk6Swv395eBTl5piH\/X7EMLM6F\nx2\/fhGXpatS6uuB4oYDUC6kv8t7IXB27ud43tLoM151bDHAeHW5n7IWHOg5IsN69Nw49O3fg3t6C\nbS2ENvswzlTY3VtbAvv6Gkxz0zB43WixWaNnLjfL1KpNaUP9lyV1tX966dy5JfbRhf\/+mf8Au\/hx\nlAwci0kAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/npc_juju_grandma-1326145942.swf",
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
	"juju",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_juju_grandma.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
