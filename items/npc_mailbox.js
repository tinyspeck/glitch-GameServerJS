//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Mailbox";
var version = "1350083456";
var name_single = "Mailbox";
var name_plural = "Mailboxes";
var article = "a";
var description = "Mailbox Zero is nirvana for some, this is one better than that: Mailbox (1) is one mailbox, made to house your very own mail. Epistles, deliveries, snapshots or gifts, whatever you've been sent from another can be found lurking in your mailbox. If you're too busy to access your mailbox, your Butler can do it for you. After all, what else are butlers for?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_mailbox", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.variant = "mailboxLeft";	// defined by npc_mailbox
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	variant : ["Facing direction of the mailbox"],
};

var instancePropsChoices = {
	ai_debug : [""],
	variant : ["mailboxLeft","mailboxRight"],
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

verbs.view_inbox = { // defined by npc_mailbox
	"name"				: "open mailbox",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Check your mail",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.checkMail(pc);

		return true;
	}
};

function broadcastState(){ // defined by npc_mailbox
	if(!this.apiGetLocatableContainerOrSelf()) {
		return;
	}

	for(var i in this.pc_states) {
		var pc = getPlayer(i);

		pc.apiSendMsg({
			type: 'item_state',
			itemstack_tsid: this.tsid,
			s: this.buildState(pc),
		});	
	}
}

function buildState(pc){ // defined by npc_mailbox
	if(!pc || !this.pc_states || !this.pc_states[pc.tsid]) {
		return 'idle';
	}

	return this.pc_states[pc.tsid];
}

function checkMail(pc){ // defined by npc_mailbox
	this.setPCState(pc, 'interact');
	pc.announce_sound('INTERACT_MAILBOX');
	pc.mail_check(this.tsid);
}

function cleanPCs(){ // defined by npc_mailbox
	// Defensive coding, essentially, from server crashes or weirdness.

	for(var i in this.pc_states) {
		var pc = getPlayer(i);
		if(pc) {
			if(!pc.isOnline() || this.container != pc.location) {
				delete this.pc_states[i];
			}
		}
	}
}

function doIdle(pc){ // defined by npc_mailbox
	if(pc.mail_has_unread()) {
		this.setPCState(pc, 'has_mail');
	} else {
		this.setPCState(pc, 'idle');
	}
}

function mailStop(pc){ // defined by npc_mailbox
	this.setPCState(pc, 'all_done');

	pc.announce_sound('MAILBOX_ALL_DONE');

	// add a timer to go back to idle on this pc.
	if(!this.pc_idle_timers) {
		this.pc_idle_timers = {};
	}

	this.pc_idle_timers[pc.tsid] = time() + 2;

	this.scheduleNextIdle();

	// deal with the states of any other mailboxes on this street

	if(this.container) {
		var boxes = this.container.find_items('npc_mailbox');
		for(var i = 0; i < boxes.length; ++i) {
			if(boxes[i] != this) {
				boxes[i].doIdle(pc);
			}
		}
	}
}

function make_config(){ // defined by npc_mailbox
	return { variant: this.getInstanceProp('variant') || 'mailboxLeft' };
}

function onCreate(){ // defined by npc_mailbox
	this.initInstanceProps();
	this.apiSetHitBox(200,200);
}

function onPlayerCollision(pc){ // defined by npc_mailbox
	//pc.quests_offer('send_mail', true);
}

function onPlayerEnter(pc){ // defined by npc_mailbox
	this.doIdle(pc);
}

function onPlayerExit(pc){ // defined by npc_mailbox
	if(this.pc_states && this.pc_states[pc.tsid]) {
		delete this.pc_states[pc.tsid];
	}

	// Prune the PC list. This can probably be removed later for speed, but is going in to clean up previous list maintenance problems.
	this.cleanPCs();
}

function onPrototypeChanged(){ // defined by npc_mailbox
	this.apiSetHitBox(200,200);
	this.apiSetPlayersCollisions(true);
}

function processIdle(){ // defined by npc_mailbox
	for(var i in this.pc_idle_timers) {
		// Cancel expired timers and set the idle state
		if(this.pc_idle_timers[i] <= time()) {
			this.doIdle(getPlayer(i));

			delete this.pc_idle_timers[i];
		}
	}

	this.scheduleNextIdle();
}

function scheduleNextIdle(){ // defined by npc_mailbox
	var next_idle = -1;

	for(var i in this.pc_idle_timers) {
		if (next_idle == -1 || this.pc_idle_timers[i] < next_idle) {
			next_idle = this.pc_idle_timers[i];
		}
	}

	if(next_idle != -1) {
		this.apiCancelTimer('processIdle');
		this.apiSetTimer('processIdle', (next_idle - time()) * 1000);
	}
}

function setPCState(pc, state){ // defined by npc_mailbox
	if(!this.pc_states) {
		this.pc_states = {};
	}

	if(state == 'has_mail' && this.pc_states[pc.tsid] != 'has_mail') {
		pc.announce_sound('HAS_MAIL', 999);
	} else if (state != 'has_mail' && this.pc_states[pc.tsid] == 'has_mail') {
		pc.announce_sound_stop('HAS_MAIL');
	}

	this.pc_states[pc.tsid] = state;
	this.broadcastState();
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
	"mail",
	"no_trade",
	"regular-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-51,"y":-136,"w":101,"h":136},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFHUlEQVR42u2YWVBTVxjH0UFpXUrB\nFmun1op2GFqKM+2MYx1a2ulDbR\/qQhGjYWktKGFzoRiCeMFKjLKEkJBAIIQQMGELOyGBcFmUAIbd\n2oJb6zigIlPt8P7vuczF6UPbB7UJDzkzv5ck38nvW865k7i4POey2WzulZfKw7UaFZ0vzaVVxQV0\na0sDfbmbDndZCuvmjZ\/rrH1daG40QKMuQk6WCCnJSajQqtFuarnT19MT6DA5i8WyydrXg\/ExG6Ym\nJ8CINjbUoKgwH5W6CtyYmsLMzAzm5uYwPz9PA3C3q6Ber01obDDA0tGGfmsvJsaH8OsvY1AVyfHg\n\/gzuz0zjwYP7mH34EHOPHuHPJ09ouwpKpRKquFiJ4qJC1NXVotNiQk+3BR3mNly\/NkFkr2NibBS3\nb91c4O7vv2F2dtZ+LT8tEFAi0XlkBwRAF3UEDXk5aDpxEtYrvRiw9mFwwApzazNqK3UYGxkmozCK\nmXv37Hd4jsUepQTJfKTxT0G3dzeGd+yAKTgEJmMLOkxt6Gw3g7Z0oIfuRG93F\/ouk3kdH95tN8GE\nGJ6aF3kY\/FNJSEkRQPNDBNQJcait0sNQXYl6Qw2a6g3khNfD2NyINlJNs7nVfi3mcrnbuBzOyOEw\nLhKPxyOZVDIt9TTKNGqUlRSjvLQEFWWl0JeXgdyVqNFfgqGqyr7XTnBwsPuxuDg6lBMCXuT3OBkf\nA7lMRpBCIZWgMD8PSoUMqkI5SooKiLjSMfdiLI9XF3MkClERoTifkYELIhEyL15ENkGcnQWJOAcy\niQRyeZ5jBPl8PnUmNRVcUkl+UhIEfD7IKQdFXkunKPyUng7huXMQCoWOE1QqlTibllYXHRkZGB0d\nHRhHiI2N3bYknsmLggqFgnJZimtRUKPROAWdgk5Bp6BT0CnoFHQK\/rugVCpd2oJisdjxgudSTm7S\nqRRUtVZF1em0VEttNZWdmUkzgqVqFT1wpZeyDfYnOEwwjPOtOPlEHKrLVCCCaKrWQy7ORKE8H9V6\nHfrJ79+hwX6MjQ6NTE9Pb3KEYFf4wWBcOHtmQbC5tgqmpnp0mlrR29nxVHB8dBh3bt\/+g0gGkTBX\nwrL\/y2k5YSXhZYInI8cQwT0AWfZFFBQUQiRVQqatgbTcgKySKqTLtRCqqpCk7YTB3P2YiSMw\/26t\nJrixwi9MbDW7+Ts+Plu\/DD0Q9Dj84H5EhHIQxONjc1QuPk+\/hCMlXYjW9oGjvopASS98hB34UD6B\n2GIz1Gr1LhL\/JsGLlV3LJuz6PHJMpmsIHoT1jCAh4JOd27PDmAqGHUJwvADeR\/OwM7UCP9b0oOLq\nDWSYhqCxXof12i3sLR3ArhwTjEajkMRuIbxN2EB4jU16FWHFswi6shm6s5ttYAU\/JnwRsu+b7u\/C\nuAiJT14Q3BKjwPuCCmSZR2CbvAvj0CSOa434Sn4Fn4la0E3TFk9Pz\/dI7GbCW2zCHmwB3J6ngmvZ\nlqxnN2a+wN\/T3X1\/2CHO\/KFTGQuCDFvji+CTWI4gmQkFlmGcqLyMr6WkzemNsF0dxJ49ez7y8vLy\n\/ocKPnObl7GSzAy+Snid3XwjYXvgpwGS8NNZTwW9o6X4gJc7\/y5PPuaXWDrqG6do9w0\/q40UXFDK\nZLJ4IrfF39+fSXId4RW2Q8tfxGFZxma5it3Yg5Vl7jhfpqoeHh5+bm5u3n5+fsycbSQim319fZn3\n32A\/u+5vp3jlixL7r\/Yzwi+x0qvZWVrLsoZl8UpZ8axCfwHrNUXdN8KwRwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/npc_mailbox-1310504809.swf",
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
	"no_trade",
	"regular-item"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"v"	: "view_inbox"
};
itemDef.keys_in_pack = {};

log.info("npc_mailbox.js LOADED");

// generated ok 2012-10-12 16:10:56 by lizg
