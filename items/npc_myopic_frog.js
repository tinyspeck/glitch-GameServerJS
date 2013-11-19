//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Myopic Delivery Frog";
var version = "1344982233";
var name_single = "Myopic Delivery Frog";
var name_plural = "Myopic Delivery Frogs";
var article = "a";
var description = "A wannabe AFLC delivery frog, suffering from a shortness of vision (while possessing the requisite amount of inner clarity).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_myopic_frog", "npc"];
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

verbs.talk_to = { // defined by npc_myopic_frog
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "See what this curious fellow has to say",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.talked) {
			this.conversation_run_introduction(pc, {});
		} else {
			this.askForHelp(pc);
		}

		return true;
	}
};

function askForHelp(pc){ // defined by npc_myopic_frog
	var wrong_things = [
		"a dancing circus bear",
		"the lost city of Atlantis",
		"a towering pillar of bees",
		"a kindly old farrier",
		"seven forbidden scrolls",
		"the concept of time",
		"a gateway to the porridge dimension"
	];
	var choices = [
		{txt: "It’s pink and piggly.", value: 'npc_piggy'},
		{txt: "It’s orange and gourdly.", value: 'pumpkin'},
		{txt: "It’s tall and flowery.", value: 'trant_fruit'},
		{txt: "It’s dense and sparkly.", value: 'rock_sparkly_1'},
		{txt: "It’s red and crabby.", value: 'npc_crab'},
		{txt: "It’s small and sandwichy.", value: 'lemburger'},
		{txt: "I don't know", value: 'none'}
	];
	this.conversation_start(pc, "I’m pretty sure it’s "+choose_one(wrong_things)+". Can you give me a hint?", choices);
	this.apiSetTimer('stopTalking', 2000);
}

function guessedRight(pc, item_class){ // defined by npc_myopic_frog
	var q = pc.getQuestInstance('eyeballery_identify_object');
	log.info("Found quest "+q);

	if (!q) {
		return false;
	}

	return q.guess(item_class);
}

function leave(pc, state){ // defined by npc_myopic_frog
	switch (state) {
		case 0:
			this.dir = 'left';
			this.setAndBroadcastState('moveStart');
			this.apiSetTimerX('leave', 500, pc, 1);
			break;
		case 1:
			this.setAndBroadcastState('move');
			this.apiStartFlyingTo(this.x + 1500, this.y - 100, 300, null);
			this.apiSetTimerX('leave', 2000, pc, 2);
			break;
		case 2:
			pc.quests_set_flag('identify_object');
			break;
	}
}

function onConversation(pc, msg){ // defined by npc_myopic_frog
	var conversation_runner = "conversation_run_"+msg.choice.split('-')[0];
	if (this[conversation_runner]) {
		return this[conversation_runner](pc, msg);
	}

	if (msg.choice == 'none') {
		this.conversation_reply(pc, msg, "No, I’m pretty sure that’s not right. Did you press 'C' to enter the Camera Mode?", [{txt: "I can do this, honest!", value: 'finished'}]);
	} else if (msg.choice == 'finished'){
		this.conversation_end(pc, msg);
		this.stopTalking();
	} else if (msg.choice == 'complete') {
		this.conversation_end(pc, msg);
		this.stopTalking();
		this.leave(pc, 0);
	} else {
		if (this.guessedRight(pc, msg.choice)) {
			var q = pc.getQuestInstance('eyeballery_identify_object');

			this.conversation_reply(pc, msg, "Of course, it's "+q.getRandomItem()+". Thank you. I’m finally ready to enter the delivery service!", [{txt: "You're welcome!", value: 'complete'}]);
		} else {
			this.conversation_reply(pc, msg, "No, I’m pretty sure that’s not right. Would you like to borrow my glasses?", [{txt: "I can do this, honest!", value: 'finished'}]);
		}
	}
}

function onCreate(){ // defined by npc_myopic_frog
	this.initInstanceProps();
	this.setAndBroadcastState('idle');

	this.apiSetHitBox(200, 100);
}

function onPlayerCollision(pc){ // defined by npc_myopic_frog
	if (!this.has_collided) {
		this.has_collided = true;
		
		this.conversation_run_introduction(pc, {});
	}
}

function stopTalking(){ // defined by npc_myopic_frog
	this.setAndBroadcastState('idle');
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

function conversation_run_introduction(pc, msg, replay){ // defined by conversation auto-builder for "introduction"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "introduction";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['introduction-0-2'] = {txt: "What’s wrong?", value: 'introduction-0-2'};
		this.conversation_start(pc, "Thank goodness you’re here. I’m trying to qualify for my flight test, but I’m afraid I’ve run into a spot of trouble.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'introduction', msg.choice);
	}

	if (msg.choice == "introduction-0-2"){
		choices['1']['introduction-1-2'] = {txt: "That makes my head hurt.", value: 'introduction-1-2'};
		this.conversation_reply(pc, msg, "I’m on the vision test segment, but I can’t quite make out what’s on the other side of this room. I tried to get out of it, but when I told the agency I was myopic, they just said they don’t discriminate on the basis of race. “I have astigmatism,” I told them, but they replied they couldn’t accept bribes.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'introduction', msg.choice);
	}

	if (msg.choice == "introduction-1-2"){
		choices['2']['introduction-2-2'] = {txt: "I’ll do what I can.", value: 'introduction-2-2'};
		this.conversation_reply(pc, msg, "Can you press \"C\" to go to the Camera Mode and to look over, and then give me a hint as to what it is? I’m nearly certain I’ve got it, but this test is very important and I dread failing again. I’d have to go through another year of yoga instruction, and I have bad joints… and it makes my asthma act up.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'introduction', msg.choice);
	}

	if (msg.choice == "introduction-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "introduction-2-2") && (!replay)){
		this.talked = true;
this.stopTalking();
	}

}

var conversations = [
	"introduction",
];

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
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-92,"w":46,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANaUlEQVR42sWYeVRT59bGo72t7e21\noqAkzJOtrdpaFZDBgGACgYRJg4CMKio1CIhMaokQCHPIREIYwwwJIDPIKA4o4lCVYq16b61DHa61\n3FqrqOu5J362q9\/3x2d7td53rWedZJ2VrN\/Ze7\/vfvYhkV5yAZhG6C+E3iY089q1a9p37tyh3Lp1\ny+bmzZuJN27c2Hz16tU5pNe9CJg3CM0g9DdCWoQoZ8+eXSwUCsNbW1v7+vv7v+\/s7DzW1tZmSdyb\nTvpvrOeRm3X\/\/n3y5cuXjZKTk3MjIiLuRkVFXd65c2d4dHS01vMIT\/tvAU5XqVTvpKWlLU9JSdkT\nHx9\/gcPhPGGz2acTExPpxH2yJrKE5jyP+LRfSuK1AObm5uqIxeItIpFogrhOEen9qbi4+GpfX1\/a\n5OQkkwBZSWg+Id3nkJqI\/vW1RVQikWytqKg4TdTcJaLmBomaK5HJZL09PT1hBMSi53B6hN7TRPCV\npu6rw60zTwzV6gy1KXRaW0tncrncFxZ6aGjogg0bNkjDwsJs\/6yamjY5OT7n+29HqdcuDsaeO94u\nb20slGfzExJDAnyp7nT6Ii83t\/e9GAxzppOTPp1Of5f42fTfAhKbRErozwE8c2b\/uzf+cTji9pUR\nXBrvxXBf5WNR7uf3A9je93y9Pe6u9XS7tYblNu7tzhhl0elquqPjRhsbG\/3fAsbFxUkTEhJ+BbRa\nsECbbm\/\/yToWy3K9j4\/luufyYblaMun0BRr5uLubeXh46DIYjBn\/L+D4eM+ci+d6dp8\/0\/Vof3vp\nI0HOnr\/LJVldmencCj4vWr1rl\/84h+P9jR+bed3FyfGxvbX1pRVLl\/r8FpAoBSmxq38FtFm+nLOa\nSv1uLYuJQPban0L82D+EBXo\/DWCzHq3xcD+yhuV+kHjoLrYXK5\/tzXJ4QYq5048ealh9oLfy230q\n2c2uDnXFk4cP4u5MHE491bKnr6d5\/WTXUOiXaZl+x7wYtB8c7WwvMRgLwwurP\/0oK8tu+e5kxvp8\nIWdfUbl\/ZFXbQsuKNorRCuuPi5zs7f7FoDk\/iI\/dPioQxo9l5AQ+4mUE3NsRtWVfZMSWegL0NgH4\n1NebVfbCNCuLMhcqJCndeVl7rra3NspvX54oOKcSnx\/PD586LPVBS5s7CkpdJwP9aZOr7G1urA9e\n3BW\/a9ng9ijb89E77f+1h2sPfo4NeNnLL6fmfFhKPMAozdH+59CgtVePHa\/vPXpSdqe\/e\/fT5roI\nfDvWxXn8+PEqto+X2pvJeLLWi8l\/IaCLi8scdxenBD+2z0RPc33KWGdd64A8eeqicDOOZDDRXOUE\neSUVGzc6wNnBFo7UJXB1\/Rgsj8Xw8PwYbm6L4MFaBgbdCmvZn8CFvhhM+iokJfne6zu098nRI\/m4\n1JqHY4rdGC1NHXz88D4tLCRI4cNym\/J0p794c9HptvNcnFelerPcT3XL0vl9eTu+buN\/honsEAyk\nM1FXbg9h0QoEBa2EE3U5vNeaI45riCy5EfKKTcATGmFXuhG2xhjDa40Z7FYsBMN5FbhpHmjtj8Cx\nlmR8W8\/DqdK92CfhTj748UefQH8\/tZebyxTbxuadFwLSaHZ6NCdqrruL8wll3HpBdyzzXlfCGhzc\n44mmTBrKqleAm7EcXiw7ePssRLqYjPpeCtRDxmg6YAzVgCFqevRQ1kJBmmQuGO4WBKAD0rLdUNvG\nRl\/RBkwUxmBcFouK1O2YvHUj0N+XfZrlSpv6XUcNw9r6PWcH++0E5KUtPtTm\/HDr75UxVJTG2yM\/\nwxpZ0iWI2L4UNEdbBIUsQF4JGdXdBqjrNSFATVDbow9lqw6KG3VRUKuPNb4WcKNREZfkBEWVK6rz\n3dCXxsYIPxi1iUG4cWYk2IvlfonpsvrK7wJctmzZm6sd7R1XO67scXO1veS3zgobgiyxcYMlwsKX\nIjBkCVjulqDaLoNfsBGyFGSUtxqhosMYynZDKNsMUdKsj0KVHgpq9ODrbw5XZ3sEBKwEL8ceeblU\niJOpKExyhjyaBjE\/KWUV1f4Bg+ZU97sPbALyr0xnB5vYqAAhb2\/4zZ0xgYjirMOWTT4IWOcCb08b\nePl8iE3b9ZEho6BIpQEzegZX0a65mqC02RCCUjIiok3g6bGUqFcrBAWvQNjGFQgOsUJgsBXWr7GE\nO8PhS6qt9birkwP7D7Y97vTbt2vmn\/+ydO\/B4fyTgwO5k91dGaivS4KiKBwCkQ+yhTRkS63AF89H\nptSY2CjGyC81g1hpAWGpKbg5hkjkERsm8iMigkuxbt0KeHvZErKDj5c9fLzt4e9vDU9Pq10MhsWM\n\/6j9Xbig0Dl3rog5elQkGD0q\/ursGcXU+LkinD4tx8iIEL29XNSrt6KsMhDF5QGoqAlEdX3QMymr\n16NE6Y+qmhBU125ERdUWFBZuhUSy+X8kDUehIhRlFeFbXrpPKxTRlI6O1MCjI6LmsePS789PlODG\n9Trc\/Wcj7txW49rVWlz4qgxfjhf\/L2ke5sSYFIcOCjA4kIOebj66u\/g3ic8HhgZzB4YGc0oP9OfS\nXomZUKm4bx0Zyl5yaFjIGzkiGj91UjalgfjmH1XPYC9+Xf4rGBFpjBwRoqszHWpVMmqqk36orkwc\nrq3endek\/nzT\/v2Z1MHBbLvh\/XmG4+Pct16p6+nvF+p27BeFdLSlHh\/Yz8fRETFOnpCBiCxGj0me\nSROt2prdKJBG3paIOCqpdPs2sSBypUCwUTPhTXtF\/pA0vXvM9IPOE2ZRXcfNovefMV80NER6Nk8k\npX6+Mi4+4kDi3hjISlOgVu9FUyP3mRrq90BZkYwk\/m4k7oq8uSt1p2+MIOZZl+CqSG+liud+miT+\n29yXBu05YUxpHzWJJ7rDYEOvQWn3SdNtHWOGixy5Q29z4hISPQIj7tqt2wm\/xHxkyHNRW0+0r2YC\ntomP1EIFmJxMhG7lPArbyUvyis7XihSTZqTkz01Lzdfpyy0mN4hryFb\/EWT\/F2bvd4+ZcVsOm8TU\n9RqIFA26Y7IacndJo8GwUKkbw0pI8wzYGneI5rsFy\/1TQI+tQRC\/ASlyGYrqJMisqsMGYQ+co8sQ\ntDMTYYmCUUJm3Hwdx1SR7iA3d05uhnzeaXm9fqyshbJS1W8k+EOA8n1aJvJa7TRJlXaZsl0vQ1ZH\nPiit0bsnKNOdzJLPPhTNt+kN2+Z5z9UvFFaBfAKkAqt3VGFtcjWC06vBTlHBi9cN5mY+dsZFI4iT\n+ICxadfWeL5uWbpE9wpPNGc4RaB1PUehfUBYPqddXje3\/A8BZipmz8pSzOZkFWpdzivRGRZV6B5X\nqPUfKtv0n9T3Gf5U3mpyPy1\/yQOvjYGPrIMzQY0ohFNMBdz2NME1SQ3nqDKsSShGbAQb6RxncHas\nRBR34dep+XPv7BVoP02XziV6uO5teT3leHEj+e\/qASP1HzxOSG9Im7SMM4vec8mWaTkU1FFilG0G\nV+r7jNF2xAxtI6ao7DDto4cFHFrmtxeOkSWgEWlm7m6EOyFabDVcY4qxlpOKjZyQa0l80+tlzYZT\nDf3G0PxHba\/xfVHFvFR+wazwLMV7nIo2XebLDejFejRJlf5ZTX+t6TaGetAU+w6bfhMvXHXeNiDi\nvmUAD6ujSuAeXwlmQhWYSXWgx9XCYVsxonODmhr6za90jpk97R6zQOthM6gGTaek1fOCtiWRtEOj\nSVqhoaS3XwowQzDPLLNAtzC3mPKztFofJU2GhMUyfqLsfP9hdJbzY7uAzVjK3gXr9TxYBaQ8VxI+\nyw5G3YGl33WNWTxsHdGAmaCy0wjyOgPkK+fZcbmkV\/NSafNm0ps8ySzTNMm8HRky8kROMQUa0OJG\nQxSqLZBcsAKMzevxMSsSC923g\/lZINLKqKgdXExE2hzqARNUEXZMoTJAXqkeMmWUFr50pvYrn5uz\nSkkzU6Xa1mniufl8Kfl6ThEF4ip9yOqMkav8CNv5TthbSIWy6xPCXc8n3LUmYsYobCDASjRg5IF0\nKdl3d66W8SuL3v9dbDbpDa6ANEdcSXYQVxo05Sj0HmYVUiAo04NAaUKYVdNn7lojDWR1pzlktcaD\nmUVkX26GlklkJGnGnwJ2AqQ3T3336UeHLiwMHjg7P7P31IIjTUMWk7XdJk8LGzRDEwXpEgoyCigQ\nKvUhrzdAKVECFS2aWcX8x\/ZR8wPDEx\/yBs9aOJw4QXrzlQO2j5p+0nFsfl3jkNnd2jajH7t6zR73\nHzFHy7ApGvpMiJo0+CldrFvHE5GPZxSQp\/IUFMiI9PcPmmFoyPTH6lbDY+X7jHpLmvS3qFQG77xy\nQC5hElR9s2c179edd+aUxaaxL+Zf7DhsinrC6lc2GWnmD5FmI\/FEc93SROQzyhoDiIr1ICJS39Jp\n1NPcobtIVjNrtkBAeof0Z6+Oo6Ye6iGTL4qJWaSpxQjVRCqz5ZRiXs4s0xQx2SFNRDm5r80YlTWG\nN7NllJ\/TpZQJAnz+a3v1S7S9WOKYuZtfTkktKKf4ZBaQR1JF5DHCRq38BTBDolsrlOl8kFEw73O+\nRPcMX6K94LUBcgveJe8p0P4wgejZmu88oc4HPPEsc+LoeOaMNUcI4SV\/sVHTXuZI+TejdKSZGc9g\nawAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/npc_myopic_frog-1323981432.swf",
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
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_myopic_frog.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
