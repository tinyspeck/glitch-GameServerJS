//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Sno Cone Vending Machine";
var version = "1344982233";
var name_single = "Sno Cone Vending Machine";
var name_plural = "Sno Cone Vending Machines";
var article = "a";
var description = "An automatic, systematic, hydromatic snowcone vending machine, for the exclusive purchase of snowcones. An acquired taste (in that you have to acquire them before you taste them), some of the more expensive snocones are only suitable for a refined palate - you have to be a certain level to eat them.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_sno_cone_vending_machine", "npc"];
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

verbs.buy_sell = { // defined by npc_sno_cone_vending_machine
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy Sno Cones. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 5,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
};

verbs.talk_to = { // defined by npc_sno_cone_vending_machine
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "See what's up with the bear",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var txt = "Hot enough for ya, "+pc.label+"?";
		var choices = {
			1: {txt: "Yes", value: 'hot-enough-yes'},
			2: {txt: "No", value: 'hot-enough-no'},
		};
		this.conversation_start(pc, txt, choices);

		return true;
	}
};

function attract_onEnter(previous_state){ // defined by npc_sno_cone_vending_machine
	// Setup our message handler
	this.messages_register_handler('attract', 'attract_onMsg');
}

function attract_onMsg(msg){ // defined by npc_sno_cone_vending_machine
	if (msg.from == 'attract_end'){
		this.fsm_pop_stack();
	}
	else if (msg.from == 'conversation_start'){
		this.fsm_pop_stack();
		this.fsm_push_stack('talk');
	}
}

function attract_onRun(){ // defined by npc_sno_cone_vending_machine
	this.setAndBroadcastState('attract');

	this.fsm_event_notify('attract_end', null, getTime()+3000);
}

function idle_onEnter(previous_state){ // defined by npc_sno_cone_vending_machine
	// Setup our message handler
	this.messages_register_handler('idle', 'idle_onMsg');

	if (previous_state == 'walk'){
		this.stopMoving();
	}
}

function idle_onMsg(msg){ // defined by npc_sno_cone_vending_machine
	if (msg.from == 'start_moving'){
		this.fsm_push_stack('walk');
	}
	else if (msg.from == 'conversation_start'){
		this.fsm_push_stack('talk');
	}
	else if (msg.from == 'player_collision'){
		this.fsm_push_stack('attract');
	}
	else{
		//log.info('idle_onMsg: '+msg);
	}
}

function idle_onRun(){ // defined by npc_sno_cone_vending_machine
	this.setAndBroadcastState('idle_stand');

	// Send myself a message in 5 seconds to start moving
	this.fsm_event_notify('start_moving', null, getTime()+5000);
}

function onConversation(pc, msg){ // defined by npc_sno_cone_vending_machine
	//log.info('--------------- onConversation: '+msg);

	if (msg.choice == 'hot-enough-yes'){
		var txt = "How about a Sno Cone, then?";
		var choices = {
			1: {txt: "Yes, please!", value: 'sno-cone-yes'},
			2: {txt: "No, thank you.", value: 'sno-cone-no'},
		}

		return this.conversation_reply(pc, msg, txt, choices);
	}
	else if (msg.choice == 'hot-enough-no'){
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'sno-cone-yes'){
		pc.openStoreInterface(this, "buy_sell");
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'sno-cone-no'){
		return this.conversation_reply(pc, msg, "Oh well, your loss!");
	}
	else {
		return this.conversation_reply(pc, msg, "Not sure what you mean there...");
	}
}

function onCreate(){ // defined by npc_sno_cone_vending_machine
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = 100;
	this.npc_climb_speed = 25;
	this.npc_jump_height = 0;
	this.npc_can_fall = 0;

	this.messages_init();
	this.fsm_init();

	this.fsm_push_stack('idle');
}

function onInterval(){ // defined by npc_sno_cone_vending_machine
	//log.info(this+' ------------- onInterval');
	if (this.is_walking) return;
	if (this.isWaiting) return;
	//log.info(this+' ------------- onInterval ok');

	this.fsm_push_stack('idle');
	this.apiClearInterval('onInterval');
}

function onStuck(){ // defined by npc_sno_cone_vending_machine
	this.turnAround();
	this.fsm_pop_stack();
}

function startMoving(){ // defined by npc_sno_cone_vending_machine
	if (this.go_dir == 'left'){
		var distance = choose_one([-400, -250]);
	}
	else{
		var distance = choose_one([250, 400]);
	}
	//log.info(this+' ------------- startMoving distance: '+distance);

	if (distance < 0 && this.x+distance < this.container.geo.l+100){
		distance = this.container.geo.l-this.x+100;
	}
	else if (distance > 0 && this.x+distance > this.container.geo.r-100){
		distance = this.container.geo.r-this.x-100;
	}

	if (distance == 0 || !this.apiFindPath(this.x+distance, this.y, 0, 'onPathing')){
		this.onStuck();
	}
}

function stopMoving(){ // defined by npc_sno_cone_vending_machine
	this.apiStopMoving();
	this.setAndBroadcastState('walk_end');
	this.turnAround();
}

function talk_onEnter(previous_state){ // defined by npc_sno_cone_vending_machine
	// Setup our message handler
	this.messages_register_handler('talk', 'talk_onMsg');

	if (previous_state == 'walk'){
		this.stopMoving();
	}
}

function talk_onMsg(msg){ // defined by npc_sno_cone_vending_machine
	if (msg.from == 'conversation_end'){
		this.setAndBroadcastState('idle_stand');
		this.fsm_event_notify('player_wait', msg.payload.pc, getTime()+5000);
	}
	else if (msg.from == 'player_wait'){
		if (this.distanceFromPlayer(msg.payload) <= 200){
			this.fsm_event_notify('player_wait', msg.payload, getTime()+5000);
		}
		else{
			this.fsm_pop_stack();
		}
	}
	else{
		//log.info('talk_onMsg: '+msg);
	}
}

function talk_onRun(){ // defined by npc_sno_cone_vending_machine
	this.setAndBroadcastState('talk');
}

function turnAround(){ // defined by npc_sno_cone_vending_machine
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
}

function walk_onEnter(previous_state){ // defined by npc_sno_cone_vending_machine
	// Setup our message handler
	this.messages_register_handler('walk', 'walk_onMsg');
}

function walk_onMsg(msg){ // defined by npc_sno_cone_vending_machine
	if (msg.from == 'pathing'){
		var args = msg.payload;
		if (args.status == 3 || args.status == 4){
			// At destination
			this.fsm_pop_stack();
		}
		else if (args.status == 1){
			// Changed direction to args.dir
			if (args.dir == 'left'){
				this.state = 'walk_left';
			}
			else if (args.dir == 'right'){
				this.state = 'walk_right';
			}
		}
	}
	else if (msg.from == 'conversation_start'){
		this.fsm_pop_stack();
		this.fsm_push_stack('talk');
	}
	else{
		//log.info('walk_onMsg: '+msg);
	}
}

function walk_onRun(){ // defined by npc_sno_cone_vending_machine
	this.startMoving();
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

function onPlayerCollision(pc){ // defined by npc
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This vendor is located in <b>Wintry Place<\/b> (accessed through <a href=\"\/locations\/LLI23D3LDHD1FQA\/\" glitch=\"location|56#LLI23D3LDHD1FQA\">Northwest Passage<\/a>)."]);
	return out;
}

var tags = [
	"npc",
	"store",
	"no_trade",
	"npc-vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-82,"y":-189,"w":164,"h":189},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMNElEQVR42rWYCXAUZRbHhyTACiq6\nK1quu6WrKOCBuKigrMiVQJKBREi45VgkuisRkABCjgmBCIHKwZUAskQBgVwQcl9AEhJIwuQg9zX3\n9EzP9JyJweAG\/vu6Q6iAKAmrXfWqu7p7un\/f\/733\/74ekaifG4ABFAOlUgyMj4djH+53qAUG0X5w\nS0vLYNo7in6v7SLgpDZaPlBz1gKVwZyqMbetohc61dbWDlIoFH+g43tjEGOyeupNtkqDxQ7WZDXp\nTJYAucHwzO8C2MQwo1q0ukqlRg0Vo72lNdmbtZwthjXbLlJ08BC9g85V6ThLhZ4z3zBwJhhMZjBG\ns1pnMM\/4XQDZ9huvMwZWrqgpuKWoye9kDJz9Xqg7cCYrdEYT9JwFrOwaWGkyDHX5MOgZGE3WFVKp\ndOBvDqiy2Z5UG41b5PKWzqb6qk6FQkYqWcEaObCsgaAsdwAVCjkqS\/JRX1MBrV4PtqUchvoiAtRc\nZ4zWT\/iS+M0B+QLXWdomyeWtioriHKi1Guj1LDTll6C6mAydrBl6Uq4H8FLGaRSmn4JM1sKnWwiD\n2XZGb25\/7fdJsc32N73ZEt87lQwB1pRcgDQ7AbLmemh0ujvX1FqtAEqlcAeQNdl2sO3tT\/+\/Sjmw\nLIYyDIbwXcqf02g0jzCcZeG9zSAngNKCDJRcSEFNZQnVHYdfqsvuxrHW0UCn8Xb1sHADmjXseJVK\n9amSYVfytiIAmkzPEVzcr728z2Fu22A24\/GHAuTNVKHVXVM0VUKplnUp9abLPLSas71NgNxvAcha\n7AmMqW3UQwHy3aVQq6BolEKlbL5JYOV8eqn4l\/0m6lGQWSv0VuvkhwOkGYCgoDJaoTJYOhlT+wne\nXvji7mXA0BotaGWMaFIxaFGq0UrR0CxDi0INDcs9ENJoti14qGmPn6I0JjtatAYesoMx2fcpOe5Z\nGnVyD5yG4KoVDPIqmpB2qQx5+QXIz89HUlISMrOzIa2sApVJt638Yh1a18tksmEPBUhTGJSsmQAt\ndoL11Vksz\/fMpzryuTq1HuevNSOjrBapRVLkFhajsLAQiYmJOHfuHNLT01FYfAWtaqYXlOCBFHYh\nWM4Wy7BWD4OlbaLGaH+ZYZghfa9BMjutuU1QUKE3xTBc22x6OMO\/SEXghbVypJXWCIBplyuRmV+M\n3NxcJCQkIDk5GampqTh95hwulpRDYzDdVuxuQAqbwWRr0Ztt5TToE6S2T1tb21MPBKytxSCN0ZrD\nWNqhNFhuyvUmk1JvLuZfQg9Ds9aILEptOgHykUmQ6YWlSMnIQsKZZIqziEs6i8Mn4hCXnot6mUoA\n5GeYX0s5XbPSosLPbDY\/\/kCT1lnsSxizvUlnae9UkGJyHYee9NYodMiSNghwKZerkFZSjYySKqQW\nlCAxpwBH45MRfew09n57CkcSUnC1prF7VmFNUOo5qA1mqmGzMNh7IemcnjHZnB+YbiktSDWcfYmx\nreNrmY6LpLXft\/wDtJwV5TItMqX1Qnp5SAHw9nFKcSVOZhXiaHI2RRaOpebhSnWjoJyKABuUOlTL\nNKiV0xSoM7aSqtl0zXjPTBOl01me71fjmNraRvUGzLhaJ4D1APYc94ZOvXJNiLIGmou57lWOghRs\nVOnQQNGi1ScyrGk6Nc\/luwHtOf1eTHBc20gaaScPWCFjBMCe9PYA8bWYW96ArKu1dwGXEiCf0p+Z\ntdlyhNz6BWqc3LsAOWupwWp9s3+rGNb2Ij1IJijYqunu3l4Q2eX1KKqT4ZqcwWXaZ9yG5q\/zgOr7\nABJIKMdxI1mLreCeOkxi6HyfwA75+AyJ\/2rliAvHo+dqGF0zfV+QQVOTkFKZpCIPl1FWg+J6GZRk\n3qy1HXVUZ\/mVDciWdpfB5bpWof7uY9R+jNH4Fh1fuUtZzhzKL0zuCySRSMYEBQXN2Om3euV3X30i\nidu86sCpzZ\/tOR4ZdrKuoUWlM9lQpWS7Yi7UdG4\/J0VUZiXSKlrRwHCghiJbMlMDaCBtlCG3oqn9\ndHGNMq+qVUtW9eO9gErWuvIa2\/60zmwN1ZssVTSVtvChN9q8ftFqDh06dDY2NrZsZ4hELgmQ2FYH\nRFgXBUYb5+84xXwVV2o7dLEBkTl1N72PFN0QHyzCnMOXsDa+HBE5tYi91ISjF+vwTV4VxTUEJpRc\nX\/XdZXbf+XquScvd6A1XpeLgn9GQMzW6OHr+wYKM5QeyWjd9dyHuSqNyiYG++OLj4+8\/R8fExEQc\nOXKkY2fYLvw7ZO+tsRvjrn8QkoJXNyZi7JYz+MfWFEwKScXrm5MwNigFb\/gnYwydnxCcgmlhWZix\nKwuuu7MgjszDlLBsTNyRDa9DRdiYWIHA5CoEp9UgKKUKK4\/m493gRDzvewTPrNyHYYt24xGvr\/eK\nvL8e\/qs1Fx4e\/tc9e\/Z8ErZ7d+PnIfsxxi8O\/qdK8ZLv93fi1XWn4Rqahplfp2HEFye7z3\/xPV6h\n8y+vPYVXvjyNUX7xQoz2S8DoDYkYTQMcvSEBL609gWdXxeCJJeEY4h0KJw8JHGcFwmm2BA7ioA2i\n6ZsevHjw9fUdvGPXLpfVW\/cnjlxzEm470vHmhnh89k0B3tpEL1x3ClNJ1WnbUvDi6hN4jYAmSZLx\nfsAZvEED4s\/x0TOgnmN+\/9TSvRg0OwSO4kABjA8HcYCwF4kDPxO5+A3tU\/dSszj4hBwaPzM0FTNJ\nLY\/dmfjkYD7+vilReBkPPorU4o95sAVROfCOyEZwwlUsP3Ae7jvTsTz6Ah1fwLL95zFl6znh\/qeW\n7iPArXB0DyKoIFIuSAB0EPOg\/QDktwp9+\/BKOYdKRXcUN+qx61wFPpSc7VZufRzGb0nCBP8zWEoQ\nK2MuYFviVbqnEmtiiwTghXty8NHuDLhRObxHA+lWcCsc3Eg9MaXXndRzI0B3UtBNIhaN8xnYn3Xh\ncPTaum7ehMHWQaA6SOLLMIOU\/exwgVAC648VY254FsJoADuTK7DxxBUsJfVcKANjN8bDY1cmplNJ\n8ICDhRTfhpu2jmINnNz9+RS\/19+F612APdt\/u25CYbRjT0Y1Pgg6C5ftqdh4\/IqQymAC9\/3PJQSc\nLkV4ahW8wrMxjup2XmS2MJDuFIfASRwMJ1LO0cWPYgOpSAq6S97tFyB50fDjcfE4sD8K+\/ZG4vDh\ng8JHeI+ajPkHRGfXUMqT8c5msiFqpLe\/4vdxcCa13HekYRrVHq\/y9qRyQUUecLDHNjjNIkAebuoX\ncJqxkRQN6hC5B47rM9zkyZOd5s4Ve65YsQTHj8UiPHwnliz2RrDEH9evXxcgb968BVtHJ\/KqNVSD\nedQEJwXQBVHZQs11N9JJQcH3A5PxOnX4k4ujMHA2wVGDOM7cBMcpq+Hg7IcBbv51IlfJq30GdHFx\nGTrfy+Piet9\/wsDqoVTIEBqyBcuXLURx0aW7Ut75Uxd0lh+EJgonE\/4X2dH0bal3PLLHZvhBjF9\/\nlNIb1A3I24vbZtr7801SIXIPGN1nQG\/v6cPmec36ce2n8+yZZ2LNV\/JTGoI2rGAXzPPs2h22w97V\n1WW7X23aOm5QI12H3GBHYT2D5DK5EEUNOpwsasY7647c7uAgDHAP7BjsuV1PjfPjI3ND+wk4ffow\nj1kzOjzcJu2PDF6lDt3sw22TbG72muP+04J5XtX0cRSQl5cnrq+vn0BsUyi8yspKdyYmxOmKigqu\nGvSapIaGWqa6tvYnWgXJztdodYv35uFPiyMJUHKNIMNELv6Tnllx0OOFz4\/VPuq9K0nk5t\/3VfTs\n2RMfm+vpWvuxt7NK4utZvX39gmKfFV4rPvJ0bZv43rsxERERj5CZO\/GGzn988\/9Z00Jj2NKl89cs\nmO+pXrRwrv7jxV665UsX7oiNjXlhQsDZ6FE0FQ5bGMGn00c0TkLfHN6Of1l94o0\/r\/pGOnRe2FGR\n2P+5PgO6uroO9prjFuw1e7rZfeaEZZL18+es8fFqnT3LRTV+\/JgFv1y7Y4Z6ejqP9fBwdnNxmTJu\n\/IgRwrJphO\/JSL4mn1gU3kE1N7\/n\/uHeBx59emXMxMGLIl4UTZY49ctm3N3dn5zn5R43c8Zk+dyP\n3OK8vcUWZ+dJUSNHjnysDz93oLjz9xrBRfKN8sclUY00vTnfc+\/D\/Q3H\/1Asnvoc2c2Xc+aIAyZP\nnrisj3A\/2whuNdVayePzd+eKXDd\/2J\/f\/g+BUVn8fxJVFAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_sno_cone_vending_machine-1342568384.swf",
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
	"npc",
	"store",
	"no_trade",
	"npc-vendor"
];
itemDef.keys_in_location = {
	"u"	: "buy_sell",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_sno_cone_vending_machine.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
