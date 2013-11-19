//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Bundle of Joy";
var version = "1347655947";
var name_single = "Bundle of Joy";
var name_plural = "Bundles of Joy";
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
var parent_classes = ["npc_bundle_of_joy", "npc_dustbunny", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "edge_to_edge"	// defined by npc_walkable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
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

verbs.talk_to = { // defined by npc_dustbunny
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Address the hairball ... er, Dust Bunny",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.stopMoving();
		this.setAvailableQuests([
			'de_embiggenify_part2'
		]);

		this.offerQuests(pc);

		this.fsm_event_notify('talk_to', pc);

		return true;
	}
};

function idle_onRun(){ // defined by npc_bundle_of_joy
	this.setAndBroadcastState('idle_stand');

	this.fsm_push_stack('walk');
}

function okReallyDieNow(){ // defined by npc_bundle_of_joy
	if (this.owner) this.owner.sendActivity("Your "+this.name_single+" ceased to exist, but left something behind.");
	this.replaceWithPoofIfOnGround('fiber');
}

function onCreate(){ // defined by npc_bundle_of_joy
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_jump_height = 0;
	this.npc_climb_speed = 0;

	this.go_dir = 'left';

	this.messages_init();
	this.fsm_init();

	this.npc_walk_speed = 250;
	this.move_distance = 100;

	this['!interval'] = 0;
	this.exclamations = [
		"I love you, {pc_label}",
		"this is great!!!",
		"wheeeeeeee!",
		"is there anything better than this!???"
	];

	this.apiSetTimer('onExcited', 2000);
	this.apiSetTimer('onDie', 20000);

	this.apiSetTimerX('fsm_push_stack', 1000, 'walk');
}

function onDie(){ // defined by npc_bundle_of_joy
	this.stopMoving();
	this.sendBubble("Oh no! My existen ...", 4000);
	this.apiSetTimer('okReallyDieNow', 3000);
}

function onExcited(){ // defined by npc_bundle_of_joy
	this['!interval']++;
	this.apiSetTimer('onExcited', 2000);
	if (this['!interval'] < 5){
		var choice = choose_one(this.exclamations);
		if (this.owner){
			choice = choice.replace(/{pc_label}/g, '<b>'+this.owner.label+'</b>');
		}
		this.sendBubble(choice, 1000);
	}
}

function startMoving(){ // defined by npc_bundle_of_joy
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	this.turnAround();
	if (this.go_dir == 'left'){
		var x = this.x - this.move_distance;
		if (x < this.container.geo.l + 50){
			x = this.container.geo.l + 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}else{
		this.move_distance *= 2;
		var x = this.x + this.move_distance;
		if (x > this.container.geo.r - 50){
			x = this.container.geo.r - 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}
}

function walk_onMsg(msg){ // defined by npc_bundle_of_joy
	if (msg.from == 'pathing_complete'){
		// Stop what we're doing
		this.fsm_pop_stack();
		this.move_distance *= 1.5;
	}
	else if (msg.from == 'pathing_update'){
		var args = msg.payload;
		if (args.dir == 'left'){
			this.dir = 'right'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
		else if (args.dir == 'right'){
			this.dir = 'left'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
	}
}

function idle_onEnter(previous_state){ // defined by npc_dustbunny
	// Setup our message handler
	this.messages_register_handler('idle', 'idle_onMsg');

	if (previous_state == 'walk'){
		this.stopMoving();
	}
}

function idle_onMsg(msg){ // defined by npc_dustbunny
	//log.info('idle_onMsg received: '+msg);

	if (msg.from == 'start_moving'){
		this.fsm_push_stack('walk');
	}
	else if (msg.from == 'talk_to'){
		this.fsm_push_stack('talk');
	}
}

function onPathing(args){ // defined by npc_dustbunny
	if (args.status == 3 || args.status == 4){
		//log.info('reached destination!');
		this.fsm_event_notify('pathing_complete', args);
	}
	else if (args.status == 1){
		this.fsm_event_notify('pathing_update', args);
	}
}

function onWaitEnd(){ // defined by npc_dustbunny

}

function stopMoving(){ // defined by npc_dustbunny
	this.apiStopMoving();
	this.setAndBroadcastState('idle_stand');
}

function talk_onEnter(previous_state){ // defined by npc_dustbunny
	// Setup our message handler
	this.messages_register_handler('talk', 'talk_onMsg');

	if (previous_state == 'walk'){
		this.stopMoving();
	}
}

function talk_onMsg(msg){ // defined by npc_dustbunny
	//log.info('talk_onMsg received: '+msg);

	if (msg.from == 'interval'){
		this.fsm_run_current_state();
	}
}

function talk_onRun(){ // defined by npc_dustbunny
	// Still players nearby? If not, exit this state
	if (!num_keys(this.container.apiGetActivePlayersInTheRadius(this.x, this.y, 150))){
		return this.fsm_exit_current_state();
	}

	// Send myself a message in 5 seconds
	var message = {
		'from' :	'interval',
		'to' :		this.current_state,
		'delivery_time':getTime()+5000,
	};
	this.messages_add(message);
}

function walk_onEnter(previous_state){ // defined by npc_dustbunny
	// Setup our message handler
	this.messages_register_handler('walk', 'walk_onMsg');

	if (previous_state == 'idle'){
		this.startMoving();
	}
}

// global block from npc_dustbunny
this.default_state = 'idle';
var no_auto_flip = true;

function npc_walkable_onCreate(){ // defined by npc_walkable
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'left';
	this.startMoving();
}

function npc_walkable_onPathing(args){ // defined by npc_walkable
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		if (this.classProps.walk_type == 'roam' || this.classProps.walk_type == 'pace'){
			this.stopMoving();
			this.turnAround();
			this.apiSetTimer('startMoving', 10000);
		}
		else{
			//log.info('reached destination!');
			//log.info('turning around...');
			this.turnAround();
			if (this.container.getNumActivePlayers()){
				this.startMoving();
			}
			else{
				this.pathfinding_paused = true;
				this.apiSetTimer('startMoving', 20*1000);
			}
		}

		if (this.onDonePathing) { 
			this.onDonePathing();
		}
	}
	if (args.status == 1){

		var walk_left_state = 'walk';
		if (this.walk_left_state) walk_left_state = this.walk_left_state;
		var walk_right_state = 'walk';
		if (this.walk_right_state) walk_right_state = this.walk_right_state;

		if (args.dir == 'left'){
			this.state = walk_left_state;
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.state = walk_right_state;
			this.dir = 'right';
		}
		if (args.dir == 'climb'){
			this.state = 'climb';
		}

		this.broadcastState();
	}
}

function onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function npc_walkable_onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
}

function npc_walkable_startMoving(){ // defined by npc_walkable
	if (this.isRookable() && this.isRooked()) return;
	if (this.isSad && this.isSad()) return;
	if (this.isWaiting) {
		return;
	}
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.pathfinding_paused) delete this.pathfinding_paused;

	if (!this.classProps || !this.classProps.walk_type || this.classProps.walk_type == 'edge_to_edge'){
		if (this.go_dir == 'left' && this.container.geo.l+100 != this.x){
			if (!this.apiFindPath(this.container.geo.l+100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}else if (this.container.geo.r-100 != this.x){
			if (!this.apiFindPath(this.container.geo.r-100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}
		else{
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'roam'){
		if (this.go_dir == 'left'){
			var distance = choose_one([-400, -250]);
		}
		else{
			var distance = choose_one([250, 400]);
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'pace'){
		var distance = intval(this.getInstanceProp('pace_distance'));
		if (this.go_dir == 'left'){
			if (distance){ distance = distance * -1; }
			else{ distance = -200; }
		}
		else{
			if (!distance) distance = 200;
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else{
		log.error('Unknown walk type: '+this.classProps.walk_type);
	}
}

function npc_walkable_stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function turnAround(){ // defined by npc_walkable
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
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

function npc_onPathing(args){ // defined by npc
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

function npc_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function npc_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_idle_onRun(){ // defined by npc_dustbunny
	this.setAndBroadcastState('idle_stand');

	// Send myself a message in 5 seconds
	var message = {
		'from' :	'start_moving',
		'to' :		this.current_state,
		'delivery_time':getTime()+5000,
	};
	this.messages_add(message);
}

function parent_onCreate(){ // defined by npc_dustbunny
	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = 175;
	this.npc_jump_height = 0;
	this.npc_climb_speed = 0;

	this.go_dir = 'left';

	this.messages_init();
	this.fsm_init();

	this.fsm_push_stack('walk');
}

function parent_startMoving(){ // defined by npc_dustbunny
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	this.go_dir = choose_one(['left', 'right']);
	if (this.go_dir == 'left'){
		var x = this.x - 800;
		if (x < this.container.geo.l + 50){
			x = this.container.geo.l + 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}else{
		var x = this.x + 800;
		if (x > this.container.geo.r - 50){
			x = this.container.geo.r - 50;
		}
		if (!this.apiFindPath(x, this.y, 0, 'onPathing')){
			this.fsm_pop_stack();
		}
	}
}

function parent_walk_onMsg(msg){ // defined by npc_dustbunny
	//log.info('walk_onMsg received: '+msg);

	if (msg.from == 'player_collision' || msg.from == 'pathing_complete'){
		// Stop what we're doing
		this.fsm_pop_stack();

		// Send myself a message in 5 seconds to start moving again
		var message = {
			'from' :	'start_moving',
			'to' :		this.current_state,
			'delivery_time':getTime()+5000,
		};
		this.messages_add(message);
	}
	else if (msg.from == 'pathing_update'){
		var args = msg.payload;
		if (args.dir == 'left'){
			this.dir = 'right'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
		else if (args.dir == 'right'){
			this.dir = 'left'; // backwards on purpose
			this.setAndBroadcastState('walk');
		}
	}
	else if (msg.from == 'talk_to'){
		this.fsm_push_stack('talk');
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"npc",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-42,"y":-60,"w":91,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ80lEQVR42u1XaXAb5Rk20IYpwwQI\n0CaOdUSSL1nXaiWtdlda3bJkybpvydZhSbZk+baTOAZDmmAHEjctM1wDtHQ60KG005Yp7UAILWcg\nUyiUDCVNMFNoACexg51YPmKzfTdtmZQpDGWgww+\/M9\/srvab73v2ed73eT9VVKzFWqzFWqzF541L\nYFz6ieevT3RGdXhHlDIWg\/orGXBeSlTvMom+c9GUS\/8F+pL\/J2Mfb1ZK6PUMSOY+aELwgEk27DdL\nEQZYMBi8rDOia8n7SEOgUaL1ORQ8u11w+VeKLuvDqtqDmDDvRK9gNiuFNdJSQiPtimPrEw7UEXco\nXPCO3dNiwDIeMhSxomMpD\/5C1Ka4Ld6kesRvQaJ2TLD+KwNYipCKUkx3IzOKCV20ECRr+1uMub5W\n46\/6W02Pbs82PjScsz22NWN5eihleaU3YfhuKUqN5P14XdZH7gjb0ImEQ64NCoXrvhKAkGuyQoTq\nLMWonlJc31GMkpr2MDnalzT9brToeGhnqfmx7bnG57e3Wfb0p8w39bea3yqGdS8lHMp74g7sj2kv\ncTzlxD15M3pVsFG4IeYQX\/Nlgr00HyQ1nVEqmfUpAlk\/tr0U1\/5ka8b6zkiHvbyr2\/Xm7h7Xy9va\nrE\/2J80\/H842PjOQNp\/sSRhmc0FNuc1PvJUPkPvTPmKgLUC2ZwLEzQm7ouQ1ifEvpYialMKNMZui\nCeT9Xm+r\/tG+lPEXg2nz0YGU+XBXjDpyQ7v97ZsKzpnd3Z7VW\/t9L93S7X4G2Hy5P2n6e1dC\/14+\npFkqhKn3oah2ZgOaP6S96mQwKFznN4oSwYqKy74QKIb+Fq\/k26mgcmPIIiMDFmn7QNp0654+z8H9\n24K\/ndgWPjze6566pcc1u7vLdWq04Di3byhwdu+Qb2FPn3d1Z6fzXUiJt9t85GI2QNLA5CQwGMiF\niF1RG9oVscm4fqP0iwOMuJDKlBfP5EPaHUzuZf14JxTEvRNbQ0fv3l0o3zVWWtw\/kpgZ63V\/cHPR\n+d6uHt\/0vm2RubFe\/9xI3r4MRUN3x41nC2HdHKyxBCny06yXvK21GXsmalM+HHcoR50GRCoUXn\/l\nFwLIJHHWi1kKUTJZiFH5Qlg70RHWPDfS6X\/nxsH83J17d9J3jfdPD6Wts0NttpV9o8XV\/Tt76L07\nsvRw3klDNdOQj1MdEd3rWT9xqs1HnGjzk29nfMQLrS5sMtqk3OUxSEwGlaBRKapkfW5gTnTTFRak\ntjLqrLmu1SWXpN1KVqeP4LQFiUJ7SHukM245mos2nRrbXqAnRnJzAynL\/GhXZOHu\/ePLQ91F+v7v\nj9FjQ610d8JAd4S1xzM+8mh7WLsA9\/PtQc0UgHwr7lQeDtvk97gNkh\/olYJ7cRm3B6m9rvJzATTi\nNZudWmEAXEWWbFY25Px4YyFEJQsh7XBnVPtAT4vpzdFSoLyzJ7iyI99EQ+WWRzoDiwmPibZRCvqO\nW0fp0Z7YIgBZaQtozuZCmg\/60pb5YoxaLkS1H8HvNDB4KmCW3WHTCCe0ct5BtYydI6TsFqWQu1Fa\nc+3mis\/KSxSt+KYD+mrMgbaVYvqe3oQxmguT8UJEdwt43r7BpPm1bZnGmaG0ZaErrqe74obT3XHT\nXDFqoAsRI31zb3yhP20\/nQ9qASTxPrx\/BXL3FBTImZZm1UIxSn2U9OBnglb5IStR9xQp476olnGT\nWAMrQohZlEq42YghbOFnsnhTMLhuvNuD7u5qHh9MWe5ucWH3dMb0fxnKWN8dTJn\/Cpsea2nGFpxU\nA+02iOmIHaVBvvPFCLXUHdfPFCO6RZCUzngJAM0wR62mfXg56cbO5YLkarxZNRm0ItMWdd3jwOAB\nXMrxqiTsVmHV+g083jVXqWWc7GceCpi862s1JUeLzSOw6X3RJsXjYNLPg+\/9GRL\/CBj0Cfh92W+W\n0U5dA+0xSmioyg9zAeLDUlR3HjrNckdI+17SjS8ASGBNtwJFcg5yeAXkpQNWedlnlk4ZlNUngMUJ\nRlq1lLULFW5iY2I2iku4tk9Fp6rbfK1OyVN6wKNgweH2kOZImx+fhKT\/20DSfLS3xXhyMG2he1uN\ndO6f\/kbnYYDfnYX5i2DmNHOFd0fTHvUcmPKF90m3eirlUc8nnKpZYH0BJD5txmr+ZCPrHsCl7Lxa\nVNVFSjkGQsqyyrhXX\/2pAKGiPBhMopAtVMiGDoMkz\/Uk9E+AtJNgHQuQe\/SOvO08AD2X9ZOzDBi4\n0jCWO8LUCgMGgNCMOQNrdMajPgfPsyDvfMyhLCec2IxbL573GiWzFnXNcyas+kUNsuUAgXD8JMKq\nVIs49QopB\/lUgATCDihFHEIvF6jh6wajjfKtbV78Zym3+jVg552RvG0BusYytLJpYHIKCmUBQC4D\nwDKwdh4kXAKWVqD30gx7AGwWFJiGNc4nXapFyNdVl0G0AON5Pcp\/FWR+kpLz34D7GwwIzwQMDmBS\ndgKtqxL\/d4CogK9X8sMmdW23GasbtxL1xWa9eNxrkhwC7zoBHeHkQMo0N5SxLEOvXYY+C7ahWgIJ\nz0OXoONNynMwlgHY2ZQbO5N0YWdSDHtN6CqswRRW2aiqLgNzB\/QKwetGZc1jWmTLCS3Ke0iDcB8k\npJzbMTErDXk4DNXNJSWVtYyzfAxQi\/I9JlXNhEFR\/SBU2SE7KXzagtfvhwPn07DZNMg1A0zNwShn\nvPgcFMds1C6fidrRmVAjsghjyW+RnYLT9Wm\/SXocPu64gxJOghqTVnXtEoCb1cl5b+pQwe91SsFB\nAHkcAL4B+VdimMNFbKdSwm4mZJw7GTU1Mjb5HwAJ2ZbdWjl\/yKgS\/Biq9Ddxp+o1kOoQtKiDkPTP\ngkTHAlZk3mMQz0EenfGZJNNeo\/g0tK2TkPwnXHrxyWZKNOWgGhbtZP0xqNIjRqz6Vb2C9wQA\/DW0\ntvsMCsGEVrYlq5KwtKSUG8YlnL1qYRWmknC2oCIWXy3m2DERy6oQViJy0aZ6Zh4urVIBvHUVuJTV\nSCl4TdEmpL0rZujOuNT94GXbUl4iZ8brBmGjRyzq6tcbibrpJk39G01k\/bt2TX3ZrhUetpK1z1rx\nugMWvPYVM1Z9TK\/gP0WhvB\/BtZ1C+QM6BS+qlXHdBjkfRVHeVf8mBWnYLFWJWAoc4eqUYNYXFckl\nuHD9BvBJhJCwRPD8jQqBoOJyLSK4fl\/eeV13jKqmZLxqvZwv0IjZ14AEGrWUvQdy5X6dkv+wQcG\/\n3aDk\/xBk+qUO5d0JY1gv5zlhvk2r4Lo1CNuslnCy6oZKEnwuDAY8ApvdiIsvFMDFf1krmFMNUsuq\nFHKv3\/g\/naRRODzgVVXfutAG6zmbYHEdLmGbmCv0UJIBfeFezDbjYm4d84EXL6CUshuY1sUwpJZy\nfIyN4cIqwScBrsVarMVafE3iH7my05XMM6xMAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/npc_bundle_of_joy-1331164626.swf",
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
	"npc",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_bundle_of_joy.js LOADED");

// generated ok 2012-09-14 13:52:27 by lizg
