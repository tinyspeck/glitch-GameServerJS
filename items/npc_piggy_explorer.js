//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Ilmenskie Jones";
var version = "1347655948";
var name_single = "Ilmenskie Jones";
var name_plural = "Ilmenskies Jones";
var article = "an";
var description = "Professor of porkthropology, obtainer of rare artifacts and the most famous porcine adventurer in all of Ur, Ilmenskie Jones is perhaps the most dreamy pig ever to wear a hat. He only suffers two flaws: fear of noodles (apparently he doesn't like the way they slither), and a tendency to get trapped in caves.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_piggy_explorer", "npc_walkable", "npc"];
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

verbs.pickup = { // defined by npc_piggy_explorer
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Pick up Ilmenskie Jones",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_done) {
			return {state: 'disabled', reason: "I don't think he wants to be picked up right now."};
		}
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var remaining = pc.createItemFromSource('hogtied_piggy_explorer', 1, this, true);

		if (remaining) {
			this.sendBubble("You don't have enough room. You'll need to ditch something, and fast!");	
			pc.sendActivity("You tried to pick up Ilmenskie Jones, but you didn't have enough room.");
		} else {
			pc.sendActivity("You picked up Ilmenskie Jones.");
			this.apiDelete();
		}

		return failed ? false : true;
	}
};

verbs.apply_youth = { // defined by npc_piggy_explorer
	"name"				: "apply youth potion",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Make Ilmenskie Jones young again",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_has('potion_animal_youth', 1) || this.is_done) {
			return {state: null};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.sendBubble("I don’t think anyone wants to revisit the critically panned Adventures of Young Ilmenskie Jones.");

		pc.sendActivity("You tried to apply a youth potion to Ilmenksie Jones.");

		return failed ? false : true;
	}
};

verbs.nibble = { // defined by npc_piggy_explorer
	"name"				: "nibble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Just a little nibbly-wibbly can't hurt",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_done) {
			return {state: null};
		}
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.sendBubble("Don't get fresh with me, kid. This is life or death here.");

		pc.sendActivity("You tried to nibble Ilmenksie Jones.");

		return failed ? false : true;
	}
};

function finishQuest(pc){ // defined by npc_piggy_explorer
	this.is_done = true;
	this.conversation_run_finish_quest(pc, {});
	this.quest_pc = pc;
}

function onConversationEnding(pc){ // defined by npc_piggy_explorer
	if (this.is_done && !this.is_vanishing) {
		pc.quests_set_flag('rescue_pig');
		this.vanish();
	}
}

function onCreate(){ // defined by npc_piggy_explorer
	this.initInstanceProps();
	this.apiSetHitBox(200, 100);
	this.npc_can_climb = false;
}

function onPlayerCollision(pc){ // defined by npc_piggy_explorer
	if (!this.has_collided && !this.is_done) {
		this.conversation_run_collide(pc, {});
	}
}

function onPlayerExit(pc){ // defined by npc_piggy_explorer
	if (this.quest_pc && pc.tsid == this.quest_pc.tsid){
		if (this.is_done) {
			pc.quests_set_flag('rescue_pig');
		}

		this.vanish();
	}
}

function vanish(pc){ // defined by npc_piggy_explorer
	if (this.is_vanishing) {
		return;
	}
	this.is_vanishing = true;

	this.container.apiSendAnnouncement({
		type: 'itemstack_overlay',
		itemstack_tsid: this.tsid,
		swf_url: overlay_key_to_url('smoke_puff'),
		delta_y: 140
	});

	this.apiSetTimer('apiDelete', 250);
}

function onPathing(args){ // defined by npc_walkable
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

function onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
}

function startMoving(){ // defined by npc_walkable
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

function stopMoving(){ // defined by npc_walkable
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

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
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

function conversation_run_collide(pc, msg, replay){ // defined by conversation auto-builder for "collide"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "collide";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['collide-0-2'] = {txt: "What’s wrong?", value: 'collide-0-2'};
		this.conversation_start(pc, "Thank the Giants you’re here, and not a second too soon!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'collide', msg.choice);
	}

	if (msg.choice == "collide-0-2"){
		choices['1']['collide-1-2'] = {txt: "How do I do that?", value: 'collide-1-2'};
		this.conversation_reply(pc, msg, "I seem to have become trapped somehow. Probably something about an idol and an ancient curse. I’m pretty sure mummies were involved in some capacity. We can work out the details later. Anyway, the cave entrance has collapsed, and I can’t reach the exit. You’ve got to help me escape!", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'collide', msg.choice);
	}

	if (msg.choice == "collide-1-2"){
		choices['2']['collide-2-2'] = {txt: "OK", value: 'collide-2-2'};
		this.conversation_reply(pc, msg, "Just pick me up, and we can get the hell out of here!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'collide', msg.choice);
	}

	if ((msg.choice == "collide-1-2") && (!replay)){
		this.has_collided = true;
	}

	if (msg.choice == "collide-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_finish_quest(pc, msg, replay){ // defined by conversation auto-builder for "finish_quest"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "finish_quest";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['finish_quest-0-2'] = {txt: "Getting stuck in a cave?", value: 'finish_quest-0-2'};
		this.conversation_start(pc, "That was a close one. Thanks for your help; this will rank among one of my greatest adventures.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'finish_quest', msg.choice);
	}

	if (msg.choice == "finish_quest-0-2"){
		choices['1']['finish_quest-1-2'] = {txt: "If you say so.", value: 'finish_quest-1-2'};
		this.conversation_reply(pc, msg, "We can spice it up a little. I’ll throw in something about the cult of an ancient god and a pit full of serpents. Trust me—this stuff is box office dynamite.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'finish_quest', msg.choice);
	}

	if (msg.choice == "finish_quest-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "finish_quest-1-2") && (!replay)){
		pc.quests_set_flag('rescue_pig');
this.vanish();
	}

}

var conversations = [
	"collide",
	"finish_quest",
];

function parent_onCreate(){ // defined by npc_walkable
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'left';
	this.startMoving();
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
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-40,"y":-62,"w":81,"h":61},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHTklEQVR42u2Xe1dTVxrG\/QZ8BFbb\nqY5TFRwuBswVwk2hEEApIEmAyB2C3EmEQ8ItcgtXuRSJCFLAYgpWi4U2XESlTsm0FWetmdWVWV3z\nfz7CM\/s9rmSRgJ0Bqu0f7LWelZOTnHf\/9rufd+99jh07akftqL3bNlwt9xmri5OQFm+qrI8H1bbl\nIbV2a7LQ93cFy0\/yV1WpQuzV6hDUaYRoLpSiozQcPZWRuMXF4qsBJaxdqXjUr3SujF61bk7k+r0z\nOIXsuJ9CdgJp0R+h7EowCLK1SIY2bTgvU3EYBnUxGKiN5r8P6WPw+Kba\/M4AE6QfmglQefE0KpUC\nXlUqARpyxWgqkILLEaExX4Kusgj+O2V05kay461ClaeF+pakBWmVsac4jcLfcVXhj+KUQOiyQvks\nukDvmkrRX6sG\/V6TGcpD91VHoZ\/prfoyO8Hfmhj2ZyTLTyIp\/CTipSdwUfQh0mJOoe6qkPdhbrIA\n2wszWO9vxdrtfhgKkpGlCERNthSVaglu6j9WvTXAK2w6vZXKPBgnOY6w4PeQwb6bSiLx7Ugj1s0G\nfGOqxZOxfkhDgyAVBkMuCUFslATKpBjtZq\/xzQXz6uGc708PpvddUekXTtmZkBL5Fz6LCcyDLsWK\njyMy5ANehZcDYLmejvUeA2wd9dDnZSL4r6chOR+ECxFilKQr8NBQjqYLYb7GWNlujlfz01qaBhJd\n7\/yt+lKAT2WGSEIaNaSrth\/McC69nJ+2kZ5NjcDGpu\/ujesYNVagVpOMMmUcUqKDkSg\/C7ngBKJD\nP0B5hhB3qtUYrsti1wLkXWZKESIzXsoDDqiTtIY4mYRkkst9PCApg6wz58uFGfOrhVkJgdJ1tVrm\nqFQKweXK4BrEfvTdzBiWb3Vj0lSNG2Vq5r146DXRDFCECqWIr+6WIim6rsXAVBhtqdeExlNSdmWR\nwTkoIGVkZweG\/FgQYJVKiC+7dXjKzL450sXr+zuDePnF1L5gHw2aMN2uw1hjKUa4YrSVZ4HLT8NC\na7mlMiNE4hKtEF6AM6rt+Rm7d9ARLp8tHQJmeH+2fMhwv6UQT\/ua3Xo+1L4vSJd+sN4FWcOl9Ymh\n\/10DfxsftHkHWrndh+JUIdpKo3BdI0VjQTgmG9QekD\/M3t4X3N+nb\/HZ35ocdg+O7PSrcOudRr+t\nqVHPQPcnMGcu5+FqMkW8D3VZEvYZhntNeTzcd6Pd+84ewa10chgrzoS1rpQHJv\/\/vDTr82bAnmbO\nO1BPdSLLmBz6bAnbGUJ51ajFfCZvlMTg2XjfgaaXfPxZox7URgcHMFCaw8chm3lz\/Wdz\/fXUb\/SZ\nrN6BajLl0DE4AqrNErMDgAjFnwhQlHIOmoQA3uT79h6zA2X+X0sLMJvN4DgOZ\/\/0Hn+fsrg9Px1P\nPJRNmvaf15bAA66ZG3f5b7pdj5JUAQ9Xk\/k6czTV+ZeCkHHBDzPt1w609LwY6+UhjflZ1DlSwoQ7\nBjCOpwNtbNrHsP1gFv9+uvIacLXDoKUfvYPpNHEoTQ9h03ue7Qjn2HHqDD6JPI3cpCAGLMHSp80H\ngiTfkX+9l6rnI2b8ZJ3i9Y+v7uMF+9\/rCjaZfDYG2p3egdbu3ETBZSFSIk4hL1mEjnIVshME0KaG\noDQtBIa8MDyfGjwQ5N7gY+5rAlwd7oDbkJTFF5Z+7LXU3Ouqx4MuDhuD7ZhorWJLjxgFl4JZVoPR\nXBz9m0K69M\/lL\/FixuJ5ZmRetHw\/MbznA5ujPaABbH0+zvZcLbRpYpbVIF56Tbgb8se5if8bwn7v\nDq83Af6ysRbvuVizqV7rNDrIA57VN44nfa1w3adtiyBp+jWKAOQkBbJikrH3DQ7e6+le3qY4dJ8G\nTAN\/1KyDrbuJ\/1yoL8NnZTmWRdMbjmBP+kyOncGow7UuI9a7m\/lglGHqgDI521nHe5MK5wqr7NGK\nrF1A9H+KQQVAFUoDJa12NPBa6WhwMtlW2hvMzGYqStKv7ireSw5BuYLtFHVCHS51cGjJvcQK6Qym\ndIW7AL2fYyAOBmRd7WzgaAfb90mZRrLTRz\/OTfIjs7Vxdltb\/Z6wpC8MFbx2Aq7f7nMuNtc6l03X\nsdSix5KpDoc+yq+1G+J3VrNrI\/+6pVbymHlkuY1V81AXnn3agy2vUwiBeqwE7GC72FRrW+0zuf17\nkNO7RzMoIiTzrXW4x1Xg2\/42fK4vsdP9b5r0vr2ZKbCUXsXDDgMesxO09wZPXqKpdwOyrWuxWadd\nH2j3gD4UYE5AgI\/uY7mDuyhGi0KOtkS5e1qKxIHcNdk5GOOkHvd3rKUqyqLLInQ6XzJV+\/TnZjg3\n2AsTDXiuodJJ7x+HgiwSnvW7Jgt2GmOl1lZFmL03JdLPBV8oCjTro4R2kyLc1psaI\/F+tiExym7W\npGLeWIUupYI\/oWQFf+RXJA5wNCWEO1hce2WEwHJoLxJMeVjovkdKMNkhfk591HmzIVZqc79Hh570\nLZEGcsf+CC1bcEaVE\/C+z6Gn8qgdtT9A+y8Nh0fhKmLN1wAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/npc_piggy_explorer-1323983031.swf",
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
	"p"	: "pickup",
	"y"	: "apply_youth",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"n"	: "nibble"
};
itemDef.keys_in_pack = {};

log.info("npc_piggy_explorer.js LOADED");

// generated ok 2012-09-14 13:52:28 by lizg
