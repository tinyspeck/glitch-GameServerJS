//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Greeterbot Sentry G-42";
var version = "1347655948";
var name_single = "Greeterbot Sentry G-42";
var name_plural = "Greeterbot Sentry G-42";
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
var parent_classes = ["npc_widget", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "pace"	// defined by npc_walkable (overridden by npc_widget)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "150";	// defined by npc_walkable (overridden by npc_widget)
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.minimum_moves = "3";	// defined by npc_widget
	this.instanceProps.maximum_moves = "3";	// defined by npc_widget
	this.instanceProps.y_offset = "60";	// defined by npc_widget
	this.instanceProps.hover_height = "75";	// defined by npc_widget
	this.instanceProps.variant = "widgetTin";	// defined by npc_widget
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	minimum_moves : ["Minimum number of jumps before turning around."],
	maximum_moves : ["Maximum number of jumps before turning around."],
	y_offset : ["Offset from the platlines on the y-axis."],
	hover_height : ["The height at which widget coasts above the player during conversations."],
	variant : ["Widget art variant."],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	minimum_moves : [""],
	maximum_moves : [""],
	y_offset : [""],
	hover_height : [""],
	variant : ["widgetGreen","widgetWhite","widgetPink","widgetTin","widgetWood"],
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

verbs.talk_to = { // defined by npc_widget
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!config.is_dev) return {state:null};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.talkPC) {
			this.sendBubble("APOLOGIES. I AM CURRENTLY OCCUPIED IN CONVERSATION.", 1000, pc);
		} else {
			this.talkPC = pc;
			this.stopMoving();

			if(this.x < pc.x) {
				this.talkSide = 'left';
			} else {
				this.talkSide = 'right';
			}

			this.moveUp();

			return true;
		}
	}
};

function buildMoveList(){ // defined by npc_widget
	// Remove any existing move list.
	if (this.moveList) {
		delete this.moveList;
	}

	// decide on how the movement is going to go
	var minMoves = intval(this.getInstanceProp('minimum_moves'));
	var maxMoves = intval(this.getInstanceProp('maximum_moves'));
	var yMove = intval(this.getInstanceProp('yMovement'));

	var distance = 0;
		
	// How many moves in this list?
	var moves = randInt(minMoves, (maxMoves > 0) ? maxMoves : 1);
	this.moveList = Array(moves);

	for(var i = 0; i < moves; ++i) {
		// build the individual moves	
		distance = intval((Math.random() * 0.25 + 0.75) * this.getInstanceProp('pace_distance'));
		if(this.go_dir == 'left') {
			distance *= -1.0;
		}
		// and append to the list.
		this.moveList[i] = {x : this.x + distance * (moves - i), y : this.y}; 
	}
}

function leadToGwen(){ // defined by npc_widget
	this.dir = 'left';
	this.setAndBroadcastState(this.walk_right_state);

	this.apiFindPath(1250, this.y, 0, 'stopPathing');
}

function make_config(){ // defined by npc_widget
	return { variant: this.getInstanceProp('variant') || "widgetPink" };
}

function moveDone(args){ // defined by npc_widget
	if (args.status == 3 || args.status == 4){
		this.apiSetTimer('startMoving', 1500);
		this.setAndBroadcastState(this.idle_state);
	} else if (args.status == 1) {
		var walk_left_state = 'walk';
		if (this.walk_left_state) walk_left_state = this.walk_left_state;
		var walk_right_state = 'walk';
		if (this.walk_right_state) walk_right_state = this.walk_right_state;

		if (args.dir == 'left'){
			this.state = walk_left_state;
			this.dir = 'right';
		}
		if (args.dir == 'right'){
			this.state = walk_right_state;
			this.dir = 'left';
		}
	}
}

function moveDown(){ // defined by npc_widget
	if (!this.talkPC) {
		return;
	}

	if(this.talkSide == 'left') {
		this.apiMoveToXY(this.x, this.talkPC.y - this.y_offset, 300, 'nextConversation');
	} else {
		this.apiMoveToXY(this.x, this.talkPC.y - this.y_offset + 20, 300, 'nextConversation');
	}
}

function moveUp(){ // defined by npc_widget
	if (!this.talkPC) {
		return;
	}

	var hoverHeight = intval(this.getInstanceProp('hover_height'));

	this.apiMoveToXY(this.x, this.talkPC.y - this.y_offset - hoverHeight, 300, 'switchSides');
}

function nextConversation(){ // defined by npc_widget
	// check and make sure we're still on the right side of the player
	if(this.talkSide == 'left' && this.talkPC.x < this.x) {
		this.talkSide = 'right';
		this.moveUp();
		return;
	} else if(this.talkSide == 'right' && this.talkPC.x > this.x) {
		this.talkSide = 'left';
		this.moveUp();
		return;
	}

	// check and make sure we aren't too far away
	if(Math.abs(this.talkPC.x - this.x) > 200) {
		this.moveUp();
		return;
	}

	// make sure we're facing the right direction
	this.dir = this.talkSide;
	this.setAndBroadcastState('talk');

	var rewards = {};
	switch (this.talkChoice) {
		case 'if-you-say-so':
			var txt = "Don’t worry, it’s not rude. Just come back when you have lived a little longer. Like, when you’ve hit level 12, perhaps?";
			var choices = {1 : {txt : "OK", value : 'ok-too-young'}};
			var on_cancel = 'ok-too-young';
				break;

		case 'ok-too-young':
			var txt = "Thanks for your understanding. Here’s something for your trouble.";
			var choices = {1 : {txt : "OK", value : 'teleport'}};
			var on_cancel = 'teleport';
			this.talkPC.stats_add_currants(50, {'class_id':this.class_tsid, 'talkChoice':this.talkChoice});

			rewards.currants = 50;
			break;
		
		case 'yes-true':
			var txt = "But self-awareness can be fleeting. Do you feel you are falling out of touch with your mind?";
			var choices = {1 : {txt : "Well, now that you mention it …", value : 'out-of-touch'}};
			var on_cancel = 'out-of-touch';
			break;

		case 'out-of-touch':
			var txt = "I can admit you once again to visit my mistress and embark on the pilgrimage to your inner self for a cost of only 100 currants. Operating a vision quest isn't cheap, you understand.";
			var choices = {1 : {txt : "I'll do it!", value : 'go-again'},
						2: {txt: "Too rich for my blood.", value: 'take-currants'}};
			var on_cancel = 'take-currants';
			break;

		case 'go-again':
			if(this.talkPC.stats_has_currants(100, {type: 'tower_quest'})) {
				this.talkPC.quests_remove('tower_quest');
				this.talkPC.quests_remove('tower_quest_part2');
				this.talkPC.quests_remove('tower_quest_part3');
				this.talkPC.quests_remove('tower_quest_part3repeat');
				this.talkPC.repeatingTower = true;
				this.talkPC.stats_remove_currants(100);
				var txt = "Very good. This way; follow me.";
				var choices = {1 : {txt : "Lead on!", value : 'lead-on'}};
				var on_cancel = 'lead-on';
			} else {
				var txt = "It seems you lack the necessary funds.";
				var choices = {1 : {txt : "I'm just a little down on my luck, is all.", value : 'take-currants'}};
				var on_cancel = 'take-currants';
			}
			break;


		case 'take-currants':
			var txt = "Then go forth, and take a little curranty blessing as thanks for your repeat custom.";
			var choices = {1 : {txt : "OK", value : 'teleport'}};
			var on_cancel = 'teleport';
			this.talkPC.stats_add_currants(50);
		
			rewards.currants = 50;
			break;

		case 'quest-ok':
			var txt = "I am not the one to reveal it though. Proceed upstairs. The Ghost of Gwendolyn is waiting to speak to you.";
			var choices = { 1 : {txt : "Ghost?", value : 'ghost'}};
			var on_cancel = 'ghost';
			break;

		case 'ghost':
			var txt = "Yes, Ghost. My mistress will tell you that story herself.";
			var choices = { 1 : {txt : "OK", value : 'see-gwen'}};
			var on_cancel = 'see-gwen';
			break;
		case 'see-gwen':
			var txt = "This way; follow me.";
			var choices = { 1 : {txt : "Lead on!", value : 'lead-on'}};
			var on_cancel = 'lead-on';
			break;
	}

	this.conversation_start(this.talkPC, txt, choices, {offset_x: 5, offset_y: 15}, rewards, on_cancel);
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_widget
	// We have been placed into the world. Start moving!
	if (!oldContainer) {
		this.setAndBroadcastState(this.idle_state);
		if (!config.is_dev && !this.container.isInstance('tower_quest')){
			this.buildMoveList();
			this.startMoving();
		}
	}
}

function onConversation(pc, msg){ // defined by npc_widget
	if (config.is_dev || this.container.isInstance('tower_quest')){
		if (msg.choice == 'if-you-say-so' ||
				msg.choice == 'yes-true' ||
				msg.choice == 'quest-ok' ||
				msg.choice == 'ghost' ||
				msg.choice == 'out-of-touch' ||
				msg.choice == 'take-currants'){
			this.talkPC = pc;
			this.talkChoice = msg.choice;
			this.conversation_end(pc, msg);
			this.shake();
		}
		else if (msg.choice == 'ok-too-young' ||
				msg.choice == 'see-gwen' ||
				msg.choice == 'go-again'){
			this.talkPC = pc;
			this.talkChoice = msg.choice;
			this.conversation_end(pc, msg);
			this.nextConversation();
		}
		else if (msg.choice == 'teleport'){
			this.talkChoice = null;
			this.conversation_end(pc, msg);

			pc.teleportToLocationDelayed('LTJ10M515812V0C', 102, -534);
		}
		else if (msg.choice == 'lead-on') {
			this.talkPC = pc;
			this.talkChoice = msg.choice;
			this.conversation_end(pc, msg);
			this.leadToGwen();
		} else {
			this.conversation_end(pc, msg);
			this.talkChoice = null;
		}
	}
	else{
	// Alternate dialogue goes here.
	}
}

function onCreate(){ // defined by npc_widget
	this.initInstanceProps();
	this.y_offset = intval(this.getInstanceProp('y_offset'));

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = 300;
	this.npc_jump_height = 0;

	this.walk_left_state = this.walk_right_state = 'move';
	this.idle_state = 'idle';
	this.dir = 'right';
	this.go_dir = 'left';
	this.setAndBroadcastState(this.idle_state);
	this.apiSetHitBox(400, 400);

	// conversation stuff
	this.talkSide= 'left';
	this.talkPC = null;
	this.talkChoice = null;
	this.num_shakes = 0;
}

function onPlayerCollision(pc){ // defined by npc_widget
	if (this.container.isInstance('tower_quest') || config.is_dev){
		if(this.talkPC) {
			if(this.sendPlayerOn) {
				this.sendPlayerOn = false;
				this.conversation_start(this.talkPC, "That’s it. Just up to your right.", {1: {txt: "Thanks.", value:"go-right"}});
			}
			return;
		}

		this.talkPC = pc;

		if(this.x < pc.x) {
			this.talkSide = 'left';
		} else {
			this.talkSide = 'right';
		}

		if (pc.stats_get_level() < 12){
			var txt = "Hail, innocent wanderer. I have something to show you, but sense you are not quite ready.";
			var choices = {1 : {txt : "If you say so", value : 'if-you-say-so'}};
			var on_cancel = 'if-you-say-so';
		}
		else if (pc.getQuestStatus('tower_quest') == 'done'){
			var txt = "By your radiant glow of self-awareness, I see that you have already followed the path of Gwendolyn.";
			var choices = {1 : {txt : "Yes, s’true", value : 'yes-true'}};
			var on_cancel = 'yes-true';
		}
		else{
			var txt = "Well met, adventurer. I am Greeterbot Sentry G-42. I sense you’re ready for what is about to be revealed.";
			var choices = {1 : {txt : "OK", value : 'quest-ok'}};
			var on_cancel = 'quest-ok';
		}

		this.conversation_start(pc, txt, choices, {offset_x: 5, offset_y: 15}, null, on_cancel);

		this.talkPC.instances_cancel_exit_prompt('tower_quest');
		this.talkPC.instances_schedule_exit_prompt('tower_quest', 2*60);
	}
}

function onPropsChanged(){ // defined by npc_widget
	this.broadcastConfig();
		
	this.y_offset = intval(this.getInstanceProp('y_offset'));
}

function shake(){ // defined by npc_widget
	if ((this.num_shakes % 2) == 0) {
		this.apiMoveToXY(this.x, this.y - 30, 300, 'nextConversation');
	} else {	
		this.apiMoveToXY(this.x, this.y + 30, 300, 'nextConversation');
	}

	this.num_shakes++;
}

function startMoving(){ // defined by npc_widget
	if (this.talkPC) {
		return;
	}
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	// Check to see if we have pending moves, and do them.
	if (this.moveList && this.moveList.length > 0) {
		var thisMove = this.moveList.pop();
		this.apiFindPath(thisMove.x, thisMove.y, 0, 'moveDone');

		// The asset is flipped around
		if (this.go_dir == 'left') {
			this.setAndBroadcastState(this.walk_left_state);
			this.dir = 'right';
		} else if (this.go_dir == 'right') {
			this.setAndBroadcastState(this.walk_right_state);
			this.dir = 'left';
		}
	} else {
		// Otherwise, we need to turn around and start again with a new list
		this.turnAround();
		this.buildMoveList();
		this.apiSetTimer('startMoving', 1500);
	}
}

function stopPathing(args){ // defined by npc_widget
	if(args.status == 2 || args.status == 3 || args.status == 4) {
		this.setAndBroadcastState(this.idle_state);
		this.sendPlayerOn = true;
	}
}

function switchSides(){ // defined by npc_widget
	if (!this.talkPC) {
		return;
	}

	var hoverHeight = intval(this.getInstanceProp('hover_height'));

	if (this.talkSide == 'left') {
		this.talkSide = 'right';
		this.go_dir = 'right';
		this.dir = 'left';
		this.setAndBroadcastState(this.idle_state);

		this.apiMoveToXY(this.talkPC.x + 75, this.talkPC.y - this.y_offset - hoverHeight, 300, 'moveDown');
	} else if (this.talkSide == 'right') {
		this.talkSide = 'left';
		this.go_dir = 'left';
		this.dir = 'right';
		this.setAndBroadcastState(this.idle_state);

		this.apiMoveToXY(this.talkPC.x - 75, this.talkPC.y - this.y_offset - hoverHeight, 300, 'moveDown');
	}
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

function parent_startMoving(){ // defined by npc_walkable
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
	"npc",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-85,"w":72,"h":84},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH0klEQVR42s3YC1BTVxoA4Fjrtqs7\nXTs77azu7iyt7LjjVCkC62NFWEBZRARUSgFRRESeMUAIL5cQILA8SjABEiAQEiKPIOEVQgiQ8Awh\nCY9gImCgEB4C1mdlUbc7\/feii1K3Whso5c7cyUzuzblf\/v\/cc\/5zUKgVOAYpeVuHyHlWanKuqSz+\niz+g1tKhTEnZNMGswswUCWGqsPbrEVpR9JoCqtLo+pOMqoJ75R1wu7T5WwTIkuHxv10zwK6EhN8M\nUBhRX+aU\/GuYWnRPdTk3lh8Y+M6aimIXNuUjSVBaegealCULXUPRew70Yn3U7pZHb3GiMRucsn+9\npnBic\/zb45db7YeT6kaUocUyyYXMv68p4HCiQF+TKGAMEWuhO5g1J\/HOTJW6kd9bE7g7bOl7s0yF\n33hG893BuErow7FB5k8blJwjeVYb4Tf+rDiJE+eXmmiBPZLebi1ZDEPEKlCGsUFyngrCk6mSasuE\noww9\/Ls\/C07hnb2h\/yzHrM+jpEN+ig2dnzOg9UQONNpnQJ0tCaoPJwPXgthUfhB\/kINyWr+qOI4T\nZ73qbOUOlSeX2edRCq8Clv+N+KTUFF9QaIzbjvxs3aoBNWf5HwxeqIpTeZU\/ei3Qggglpvi7Rfui\nCBzDiA9WKbWKDdqQ+kMjofWjN7B8UF+sBKUfB7rPXwGpB4J0yQahw2WosUn5HzAG2PsjexgmWDs8\nyvztnxw4HiDcOhXfmnuH2Qu3r\/TAdL4EJqhiGL1cD5rkalDjS0GBYYDYnQKV1onPgPuinjBMcKQ8\nQ9zWnxQHSN+7ldBueie3Z+bf0gl41D4Cc41quM\/rgdvlEphhi2CSXgfajApQE1jQ6JoGHLOnQGD8\nBSenGwZbLhuRvevinhzDIJ+Fk2aA8c4xuHiUpOexeeHaKF68+T6tJ+JR0xh8o5h6LXAktRjkGCpU\n2sQ\/Axrj5ui7gwLI+sssIkpNYxoWGnx2Rv4n3wSnyjMIOrxw7R6pV2+M1tbYxuTCVyL19wLHc2uh\nL4UFUgIVeiJoIDj5z2dAExwgfzova6fvx8sC9qGvfttyAunotkhHt05G+lHc3aIDoS4L1x6yVTsG\nqI23smIIMNOg\/F7gdQoH6OgwSPY4DyJsMjS6pSwBYmTUTwPMlwWcr9ZM38zqhKGYKiRF+dDpR77V\neCrW9GkEyT0G07QuuMHreGWKBzLKgImJBJKnDwJMgQbX7wCHaJ+ijywL+LDouvRBhRqmc5pBk1gO\nfWj6dKdHot7CzHEzrNlmJrYD7rH64euqQXhQo4L7Ncr\/64PqlCKQRlChw48C1UeJKwucCWspnopt\ngZEwPqgCykDuzpxQGGVvmPKu3jiFFZ2bDBaBFtsA2mgRjBIa4cu4ehiO58NgdCVcC+dAbzAbpD50\nEJ+iAM8uCUoX3+KVAk6HNCeNoeth6AIy8Z\/lgMytcGLh+xfAJhhFC+CGbw2ovbigfNVMYp38YqBe\nSeDNYNGF7wJZs+ITNOMOZ\/onGt+6CF2B7P1RwDGPnWy0I0fLXJlWEifGTvGxTH2BdZp+lXmiPnc\/\n\/sM3KipmLrbtWQrscmU+bjmeI2qwo\/Alzow+XYAVlgnQejIHut2LHvWeKdUgn9KOz\/KEYscsnsCW\nxKs6lMQrOxCLe6P5WuvLex8BDiyJ4NPGhXZkEDlkgS7A1pPZMOJfCxo\/HiAFBnSfLgIJcr\/YkQb1\nyHCGAKHMLHYUibI7axd20+unMzy8NRYgcB3yrpp7GdjkkPmjgFxLIpQejAEk8jCGFr4WyDGLhcK9\nUUK6YdQffzjN2PpNA14VLsozpUyZC1O7XOBVKyLUOZChxTl3SuZeKFCcYnM7PsvvFDtSZxHgN4tA\n1r7IhwUmIW9W4CqMFBtkrlc+lrowDzQ7ZNnU25Bs5J+z\/HUB5u8Nh3SjQCAbo0WcQ3HH5G6F21uP\nZ+8W2WeeFhwhqZ9HEHmZmEZYV4aeh27LhNlgkYEuQNbeCKAZYYBi4M8j7\/AxXGxPdIzy17ojpJ6l\nwAIj7LnsLd4bVxW4pFjgUQ0CnwOb7amOyL0DS4F5u7HJSEHxvk7AiaCGnZNBorllAK9Sd6E\/WWyv\n6Vimj8A2XbsUSDcKKcvc4afb1skEWvinSUzjNV2BSD1IIe\/y+v1ie3KfYnyDQ8atReCVA5eg2CJC\nUnw4Srf9xdnQpm1TwSLFy0DFmwPTlkbncdt4\/ldc5WNNugD6LhWBHJsNUr\/U+XbfpO1rAij3K85R\n4Wvmr8VUgDykAMSe6VBiETlTuC9IXyfg\/exr226TFYqFaubHAovNIpDxMDyNYx76HChyzDzd4EAZ\n5tl+AeXIWMk2\/cdDpnGop85vMTSNb3si0irmeIMwmdQKAwFVPwissI6DemcitHnGQ9sZQlrtkRdA\nvg35Hb5VqiHXMukossB3YO0N34NE+Fc6VzoTQU2\/QwrWkrusPpgX34AHPCWy7GwHDbEWrl\/iQj+u\nBLoxLOjyzwOpPw16QmnQH5EF8sA04DlEz7P3h+JeBgAKtQ5Q+Lc4KM56WIndhzGMYIs2REgYDRfO\naBObYDKzGSZoyNhIroPhlEoYIHJAFc2GXlwedPhQgH88EcosokeYe3B+JD3M5lXZXQAUrEPWyL8Y\n8qj+c\/+ZUn+ZO4sgcc4nNJ+gEZAUE\/i2aQQkxYRKK6JruSlxCx6J0HKe91\/L2IYlD1f+1wAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/npc_widget-1304985175.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_widget.js LOADED");

// generated ok 2012-09-14 13:52:28 by lizg
