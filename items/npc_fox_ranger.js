//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Fox Ranger";
var version = "1344982233";
var name_single = "Fox Ranger";
var name_plural = "Fox Rangers";
var article = "a";
var description = "Guardian of the Fox Reserves, it is up to each individual Fox Ranger to ensure that only proper Fox Bait is used to lure foxes, and not, say, cheese, which makes them cough. They are also in charge of making sure people use the right brush, and don't steal the foxes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_fox_ranger", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.facing = "left";	// defined by npc_fox_ranger
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	facing : ["Which direction is the ranger facing?"],
};

var instancePropsChoices = {
	ai_debug : [""],
	facing : [""],
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

verbs.get_tips = { // defined by npc_fox_ranger
	"name"				: "get tips",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Need help?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.achievements_has('fox_brushing_license')) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var txt = "Don’t waste your bait: have a look to see if there are already foxes around before you ignite any bait.<split butt_txt=\"Makes sense\">To ensure success, drag the Brush out of your inventory and then release it when the brush is over a fox.<split butt_txt=\"Right\">Foxes move very fast, but stop to eat bait and occasionally to peek out from breaks in the foliage so keep an eye out.<split butt_txt=\"Yep\">That’s it. Get in there and get yourself some fiber!";
		this.conversation_start(pc, txt);

		return true;
	}
};

verbs.shop = { // defined by npc_fox_ranger
	"name"				: "shop",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Buy things",
	"is_drop_target"		: false,
	"store_id"			: 22,
	"conditions"			: function(pc, drop_stack){

		if (!pc.achievements_has('fox_brushing_license')) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "shop");
	}
};

verbs.talk_to = { // defined by npc_fox_ranger
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "He looks friendly, enough",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('fox_brushing_license')) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.greeted[pc.tsid]){
			if (!pc.fox_preserve_intro){
				var choices = {
					'0': {txt: "Yes, please", value: 'ok'},
					'1': {txt: "No, thanks", value: 'cancel'}
				};
				this.conversation_start(pc, "Ah — would you like to hear my introduction to Fox Brushing Preserves?", choices);
			}
			else{
				var choices = {
					'0': {txt: "Yes, please", value: 'buy-license'},
					'1': {txt: "No, thanks", value: 'no-buy'}
				};
				this.conversation_start(pc, "Ah — you’d like to hear about the licenses?", choices);
			}
		}

		return true;
	}
};

function idle(){ // defined by npc_fox_ranger
	this.setAndBroadcastState(choose_one(['idle0', 'idle1', 'idle2']));
}

function onAchievementClose(pc){ // defined by npc_fox_ranger
	var choices = {
		'0': {txt: 'Thanks!', value: 'give-brush'}
	};
	return this.conversation_start(pc, "Ok, and here's your brush.", choices);
}

function onConversation(pc, msg){ // defined by npc_fox_ranger
	if (msg.choice == 'cancel'){
		this.sendBubble("OK well then, if you change your mind, any of us rangers can tell you about Fox Brushing Preserves.", 5000, pc);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'ok'){
		pc.fox_preserve_intro = true;
		var txt = "Very well. These preserves were created 1,083 generations ago to prevent the over-brushing of foxes. Only those licensed to brush may enter.<split butt_txt=\"Uh huh\">Foxes may only be brushed with regulation <a href=\"event:item|fox_brush\">Fox Brushes</a> and they will almost certainly never appear unless some <a href=\"event:item|fox_bait\">Bait</a> is provided for them to enjoy.<split butt_txt=\"Of course\">Once the bait is ignited, the fox’s entrance will be swift: be quick with your brush and you’ll be rewarded with plenty of <a href=\"event:item|fiber\">Fiber</a>.<split butt_txt=\"Sounds easy\">Very well. Are you interested in obtaining a license?";
		var choices = {
			'0': {txt: 'Yes, I am!', value: 'buy-license'},
			'1': {txt: 'Nope', value: 'no-buy'}
		};
		return this.conversation_reply(pc, msg, txt, choices);
	}
	else if (msg.choice == 'no-buy'){
		this.sendBubble("OK well then, if you change your mind, just let me know.", 3000, pc);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'buy-license'){
		if (!pc.stats_has_currants(500)){
			return this.conversation_reply(pc, msg, "Sorry, but licenses cost <b>500 currants</b>. Come back when you’ve saved up enough.");
		}
		else{
			var choices = {
				'0': {txt: 'Deal (500c)', value: 'buy-license-confirm'},
				'1': {txt: 'No thanks', value: 'no-buy-license'}
			};
			return this.conversation_reply(pc, msg, "The price is 500 currants — but the license is good for a lifetime. And if you buy one today, I will include a Brush and a five-pack of Bait for free.", choices);
		}
	}
	else if (msg.choice == 'buy-license-confirm'){
		if (!pc.stats_try_remove_currants(500, {type: 'fox_permit'})){
			return this.conversation_reply(pc, msg, "Sorry, but licenses cost <b>500 currants</b>. Come back when you’ve saved up enough.");
		}
		else{
			pc.announce_sound('BUY_FOX_BRUSHING_PERMIT');
			pc.achievements_grant('fox_brushing_license', {itemstack_tsid: this.tsid, callback: 'onAchievementClose'});
			return this.conversation_end(pc, msg);
		}
	}
	else if (msg.choice == 'no-buy-license'){
		this.sendBubble("OK well then, if you change your mind, my offer stands.", 4000, pc);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'give-brush'){
		pc.createItemFromSource('fox_brush', 1, this);

		var choices = {
			'0': {txt: 'Thanks!', value: 'give-bait'}
		};
		return this.conversation_reply(pc, msg, "Ok, and here's your bait.", choices);
	}
	else if (msg.choice == 'give-bait'){
		pc.createItemFromSource('fox_bait', 5, this);

		var txt = "OK! Now you have everything you need and you can enter the preserve. But first, a few tips …<split butt_txt=\"OK\">When you go out into the preserve, have a look if there are any foxes around before you ignite any bait. No sense wasting bait.<split butt_txt=\"Makes sense\">To ensure success, drag the Brush out of your inventory and then release it when the brush is over a fox.<split butt_txt=\"Right\">Foxes move very fast, but stop to eat bait and occasionally to peek out from breaks in the foliage so keep an eye out.<split butt_txt=\"Yep\">That’s it. Get in there and get yourself some fiber!";
		var choices = {
			'0': {txt: 'Yay!', value: 'enter'}
		};
		return this.conversation_reply(pc, msg, txt, choices);
	}
	else if (msg.choice == 'over-capacity'){
		this.sendBubble("Thanks for understanding. You can wait here or try another preserve.", 5000, pc);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'buy'){
		pc.openStoreInterface(this, 'shop');
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'enter'){
		this.conversated[pc.tsid] = 1;
		return this.conversation_end(pc, msg);
	}

	return this.conversation_reply(pc, msg, "Shucks, I'm afraid I don't follow...");
}

function onCreate(){ // defined by npc_fox_ranger
	this.initInstanceProps();
	this.setAndBroadcastState('idle_stand');
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(250, 1000);
	this.apiSetInterval('idle', 1);

	this.conversated = {};
	this.greeted = {};
}

function onLoad(){ // defined by npc_fox_ranger
	this.apiSetHitBox(250, 1000);
	if (!this.instanceProps || !this.instanceProps.facing) this.initInstanceProps();
}

function onPlayerCollision(pc){ // defined by npc_fox_ranger
	if (this.conversated[pc.tsid]) return false;

	if (this.getInstanceProp('facing') == 'right' && pc.x < this.x){
		return;
	}
	else if (this.getInstanceProp('facing') == 'left' && pc.x > this.x){
		return;
	}

	if (!pc.fox_preserve_visit){
		if (this.greeted[pc.tsid]) return false;
		var choices = {
			'0': {txt: "Yes, please", value: 'ok'},
			'1': {txt: "No, thanks", value: 'cancel'}
		};
		this.conversation_start(pc, "Hello "+pc.label+". This is a Fox Brushing Preserve and I am the local Ranger. Would you like me to explain how things work?", choices);
		this.greeted[pc.tsid] = true;
	}
	else if (!pc.fox_preserve_intro){
		if (this.greeted[pc.tsid]) return false;
		var choices = {
			'0': {txt: "Yes, please", value: 'ok'},
			'1': {txt: "No, thanks", value: 'cancel'}
		};
		this.conversation_start(pc, "Welcome back, "+pc.label+". Are you ready to learn about Fox Brushing now?", choices);
		this.greeted[pc.tsid] = true;
	}
	else if (!pc.achievements_has('fox_brushing_license')){
		if (this.greeted[pc.tsid]) return false;
		var choices = {
			'0': {txt: "Yes", value: 'buy-license'},
			'1': {txt: "No", value: 'no-buy'},
			'2': {txt: "Could you explain how it works again?", value: 'ok'}
		};
		this.conversation_start(pc, "Welcome back, "+pc.label+". Are you ready to buy a license?", choices);
		this.greeted[pc.tsid] = true;
	}
	else if (this.overCapacity()){
		var choices = {
			'0': {txt: "OK", value: 'over-capacity'}
		};
		this.conversation_start(pc, "Welcome back, "+pc.label+". I’m sorry but the preserve is currently over capacity. You’ll have to wait for someone to leave before you can enter.", choices);
	}
	else if (!pc.items_has('fox_brush')){
		var choices = {
			'0': {txt: "Good point", value: 'buy'}
		};
		this.conversation_start(pc, "Welcome back, "+pc.label+". I see that you don’t have a brush. That doesn’t seem right.", choices);
		this.greeted[pc.tsid] = true;
	}
	else if (!pc.items_has('fox_bait')){
		this.sendBubble("Welcome back, "+pc.label+". Looks like you’re out of bait. If you need some, I’m your ranger.", 5000, pc);
		this.greeted[pc.tsid] = true;
	}
	else{
		if (this.greeted[pc.tsid]) return false;
		var greetings = [
			"Welcome back, "+pc.label+". Good day for brushing!",
			"Hello there "+pc.label+": may your bait always be stinky and your brush quick.",
			"Ah, "+pc.label+". Be sure to be very, very quiet … there are foxes about!"
		];
		this.sendBubble(choose_one(greetings), 4000, pc);
		this.greeted[pc.tsid] = true;
	}

	pc.fox_preserve_visit = true;
}

function onPlayerExit(pc){ // defined by npc_fox_ranger
	delete this.conversated[pc.tsid];
	delete this.greeted[pc.tsid];
}

function onPlayerLeavingCollisionArea(pc){ // defined by npc_fox_ranger
	var move_em = false;
	var txt = '';
	if (!pc.achievements_has('fox_brushing_license')){
		move_em = true;
		txt = "I’m sorry, but no-one may enter without a license.";
	}
	else if (this.overCapacity()){
		move_em = true;
		txt = "For everyone’s safety, I am not permitted to let you in until someone else leaves.";
	}
	else if (!pc.items_has('fox_brush')){
		move_em = true;
		txt = "There’s really no point going in there without a brush.";
	}

	if (move_em){
		if (this.getInstanceProp('facing') == 'right' && pc.x < this.x){
			log.info(this+' facing right with '+pc.x+' and '+this.x);
			pc.moveAvatar(this.x+100, this.y, 'left');
			if (txt) this.sendBubble(txt, 3000, pc);
		}
		else if (this.getInstanceProp('facing') == 'left' && pc.x > this.x){
			log.info(this+' facing left with '+pc.x+' and '+this.x);
			pc.moveAvatar(this.x-100, this.y, 'right');
			this.sendBubble(txt, 3000, pc);
		}
	}
}

function onPropsChanged(){ // defined by npc_fox_ranger
	this.dir = this.getInstanceProp('facing') == 'left' ? 'right' : 'left'; // ugh
	this.idle();
}

function onPrototypeChanged(){ // defined by npc_fox_ranger
	this.onLoad();
}

function overCapacity(){ // defined by npc_fox_ranger
	var players = this.container.getActivePlayers();
	var facing = this.getInstanceProp('facing');
	if (!facing) facing = 'left';

	var count = 0;
	for (var i in players){
		var pc = players[i];
		if (facing == 'left' && pc.x > this.x){
			count++;
		}
		else if (facing == 'right' && pc.x < this.x){
			count++;
		}
	}

	return count >= 8;
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
	"no_rube",
	"no_trade",
	"bubbles_in_chat",
	"npc-vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-89,"w":52,"h":89},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH7klEQVR42sWYaVOb1xmG+diZTsdJ\nJ+40JDGbxC4hkNACEhJIgBaQ2BcbS6xiX8QmdtkBDAYMGGNMbAPG2G5sJ8aNlxLXruK0qRsnLU2b\ndDLttPwEfsLd8xyCGjvOTD8IeGfuGSG9zHud+1mlgAA\/XF9snLVtPp5b\/+rJ\/OafH83iy49n8fw3\n07h\/zeNdX+mfCTio6y8bc3FffDy7+Y\/fL+Lfz5e5\/vWnJQ74yfoYHlz34PblHvxqsWtr6UxT3L7C\n\/faW+9DnD8\/gr0\/O+cRcfAHuznIfg+vmmvJUePcV8P61Icfj2yMgSILaFYWW4Ei3LvVwuNU5Fzzt\nRVDHh8TtI6DHuwtC+vXqgE\/rV\/pfgDs9YEdVSSpU8cHaAwH86OqgL5Qva3KoHN0NNpTlJh8cILn2\nY4ATgw7UlRkOFpDlI4d5\/z03D+1ueHcBG+zpyM2U7i\/gh0u9W3OjTqzNt+P7ubg008JFeUiAZ05U\n8AIpzlLsL+DiZAP+8\/VdfPZwxgc3wfLt3s1x3LjY7XP17HA1B9zXEN9bG4xbnKjHxoeTeP54gcOR\nkytzzey9aWx9cx9X5tp8gL1NufsLyNyZubvaj7Xz7TQlOOBN5trZ0Wo8e3wef3u2iuXZFh9gZ52V\n52BKonBFKg09tGdg4+7CQ6cHHN5rCx34YKkXK2dbWUG4ceNCFyuQblyebsHd1T68f7ET19k91APH\n+o6j1KqEITkKeQzSrIv17BngymzrymBbAXLSE9hDVWirNqOnMQfnRmtwcaqJuejG1XPtvDEPsPsa\nHZkotMg5nD1fA0uqGMkJoXu3PHy5Meu9xSBOdpagsliHfFMiPfCV0sqF\/POO2mx2ACf6WvJ4u0mO\nD9m7mfz10wvebz69gOcbM2BrFC+EC6frMD9Wi2nWTqZYFZMo75jbLMydLA3aeC8kNVcY9xaQgXlp\nIaCieHRrGLT7ffvZRb5m\/fPZZXz1u3m+MHz+kO+CvmZNByDA+uN77ODNS27vk9uj\/KE03mitIqBn\nD6bwdH0cf\/hoAo9uDrMdsNcHRy7SPOYOVpr2FpAqmEJGD97d9Wis0bJAY+5Vs3hhvP5\/IWaAOoVg\na0\/ghl0WR6fTyHONXNkFYCOPh\/zHABcnGriD7kYbiiwymFIiYU6KCvJz\/zMcOtlq2m4rT0FXjR5j\nvSVscnRwgA9YOF\/eZqj\/XWE98spsExZGHeitz0B2WjSKLRLkZ4qQpYv0by886TLbhloyMdCUgb76\ndAw1ZeJUpxULY1U4N1KNS5N1WJ5uxPmRckwPFmOsy4rJHitGOyxocWiQlyHCUWsC3M5UdNfo4MiV\n+jfMJ1qNK\/Sw3noDhpoJzoJ320w40WJEZaEcDWXJ\/P1W5nCzXQN3rZ7f6yxRcbiKAjkay9Q7\/9Nm\nxbV5F4Zc+a1+AzzlMmkJcKTdDFelFoPNGRh2mdFeqWMOpXBIcijHEMuhyvMTWSjFOGaVou5YEsoL\nEtHDodNxb20I3346i6d3x\/1XzX0N+lYCZE5yuM6aVO4SAdaVJqGeQbRX6dBRrYO7To++BgMGWTp0\nsZCSu8dsCfxAA01meO+M449rJWBNH34DbLAnedy1aTjJQtTDAFrKNWhmuVVZoOA6mh3Pofob07m6\nnGn8EARde1SFqkIFTwcqsntXB7D56DTmhqv8B1hflrROblChkIskAsnWx6EsR4HjOTJ42GckAqFc\no9eUDrWlOyF3sUN1VmnhLN45UG567KbfAO2s6sg1d10ah6MCaLSrkaGJQVaaCCWsfZBrFF4SuUwO\nkgiOCuXymUbeL6mPNpUbUZIl94+DCpnEZtLFb1Mu0YN76vU+yA7WMtpZ3tlzZTycu4Du7wArWWjt\neTJeJLcvdePvnyywUfgu5kZq\/DfypjxViBIKvMXZCjQx1yi01A8JsMiSAGu6BGU2Kc9Jn4ssX6lg\nKMQsPViFx+P8qRrWxDtBy+6UpwJGTaz\/qlglS5hhgjElBtVFSpZXSbw6TbpY6JOjWeNN5H9zwNqd\nAiFgajHkYGWRnM\/hEqsaRq0EJzqKYdKK1v0C9\/DGoDY7Q42YCCEb9BEwJIUjUx3JZmoUCjLjOFyq\nQsAUBr1KyEca9UQnKw5HHuuHRjHSlAIoEiSgQ5KUCWLIxQL\/jLs7y\/22nqZCr0YpWcnURG0TnF4Z\nTjkEZVwQ255D+GtZ7DuQxrwNSWQgNLJQmLXR\/CBqtl0nxkUhUSLmcPJ4EUSRQsRGRKz7faOJCnkt\nyKYLh1Ya7JM0OhCRwYcdkaG\/8OzKkBSxRQ7TQQrNbIo0FyM6PAy6ZDnbfvow1F4Ii0Hh\/+8mBvaV\n0ZQcvJ2XJkRWShgUokCIBYe3f3CfSjjDnf1OJp0I8TECSMUiDjsxWIl2Z45\/N5rGvPggu0W0kqUJ\nhV4ehNTEI1DFvQWx8DBC3vrpD373az6q3Jrlm00u2ioMSFPLmYvC70ngX8Byq3jTniWCWR0Kg4Ll\nnuRtyGMDIQp7Y\/tlQDqMTSfYpPs0Ce\/gVE8pXM4cqBLEm2aDel0SG43I8DCHXwFz08KRnSKARSNg\nuXcEccLD25HBP18JfT3ghV8KagsktkqbGKbkEGQog5GuDEKaPAQWVjSs0m30y+yD60Ote5N\/qmCt\nXnnEIYv+pSfkzZ+8cm0vNUZvFWVEwaTeSQUFc1kW\/SZiQt\/YDg78mS3goC9zUrDNpA7xWlJCNwkw\nPOj17Ygjr7W+7PT\/e\/0XorHjv8IxF+UAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/npc_fox_ranger-1332965331.swf",
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
	"no_trade",
	"bubbles_in_chat",
	"npc-vendor"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "get_tips",
	"v"	: "give_cubimal",
	"h"	: "shop",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_fox_ranger.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
