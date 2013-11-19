//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Helga";
var version = "1347655947";
var name_single = "Helga";
var name_plural = "Helgas";
var article = "a";
var description = "Reticent about discussing her past, it is thought that Helga may remember the Age of Friendly (if there was ever such a time), given that she is, and always has been, the source of many fine beverages.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_jabba2", "npc_jabba1", "npc_walkable", "npc"];
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

verbs.make_eye_contact = { // defined by npc_jabba1
	"name"				: "make eye contact",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Are you sure? He looks shifty",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'npc_jabba2') return {state:null};

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered) || num_keys(quests.given) || num_keys(quests.incomplete) || num_keys(quests.completed)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerQuests(pc);
		return true;
	}
};

verbs.buy_sell = { // defined by npc_jabba2
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy drinks and liquor. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 15,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
};

function parent_verb_npc_jabba1_buy_sell(pc, msg, suppress_activity){
	return pc.openStoreInterface(this, "buy_sell");
};

function parent_verb_npc_jabba1_buy_sell_effects(pc){
	// no effects code in this parent
};

function onCreate(){ // defined by npc_jabba1
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = 50;
	this.npc_jump_height = 0;

	this.dir='right';
	this.is_walking = 0;
	this.startMoving();

	this.setAvailableQuests([
		'purple_journey_north'
	]);
}

function onLoad(){ // defined by npc_jabba1
	this.setAvailableQuests([
		'purple_journey_north'
	]);
}

function onPathing(args){ // defined by npc_jabba1
	//log.info(this+' ------- pathing callback: '+args);
	if (args.status == 3 || args.status == 4){
		// At destination
		this.stopMoving();
	}
	else if (args.status == 1){
		// Changed direction to args.dir
		this.is_walking = true;

		if (args.dir != this.dir){
			this.setAndBroadcastState('turn');
		}

		if (args.dir == 'left'){
			this.state = 'walk';
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.state = 'walk';
			this.dir = 'right';
		}
	}
}

function onPrototypeChanged(){ // defined by npc_jabba1
	this.setAvailableQuests([
		'purple_journey_north'
	]);
}

function onWaitStart(pc){ // defined by npc_jabba1
	this.stopMoving();
	this.apiSetTimer('standStill', 4000);
}

function standStill(){ // defined by npc_jabba1
	if (this.is_walking) return;
	this.setAndBroadcastState('idle_stand');
}

function startMoving(){ // defined by npc_jabba1
	if (this.isWaiting) return;
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.dir == 'left'){
		var distance = choose_one([250, 400]);
	}
	else{
		var distance = choose_one([-400, -250]);
	}

	if (distance < 0){
		this.apiFindPath(this.x+distance, this.y, 0, 'onPathing');
	}else if (distance > 0){
		this.apiFindPath(this.x+distance, this.y, 0, 'onPathing');
	}
}

function stopMoving(){ // defined by npc_jabba1
	if (this.is_walking){
		//log.info('------------- stopMoving walking');
		this.apiStopMoving();
		this.state='walk_end';
		this.is_walking = false;
		this.apiSetTimer('stopMoving', 2000);
	}
	else{
		//log.info('------------- stopMoving idle');
		this.state='impatient';
		this.apiSetTimer('startMoving', 4000);
	}

	this.broadcastState();
}

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

function onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function npc_walkable_onWaitStart(pc){ // defined by npc_walkable
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This vendor is located on <a href=\"\/locations\/LM413RQ6LRG9N\/\" glitch=\"location|27#LM413RQ6LRG9N\">West Spice<\/a>"]);
	return out;
}

var tags = [
	"npc",
	"store",
	"no_trade",
	"npc-vendor",
	"vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-95,"y":-189,"w":191,"h":186},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIkklEQVR42uWYWVOaaRbH+xukar6A\nl3PpxcxFp7szToytMVFxAxVRZN93EBEUcUFEwA1REQF3JVESTcyumXQn6aQzsTJTNZfDR+AjnDnn\nQUwmwSSm25pUzVv1L18WPb\/nf5bnef3mm\/+H6x+Zf5X89Oa5+\/W\/Xxd9dXC3n91PPz78GR69+hs8\n\/PVxdv\/1T8VfDdyDV6\/O3Xp6D+6\/PGBCQNh9es\/9VcC9+OeL4v3XTw72nj9AqLtw78U+3P3l0dcB\n+Oj106Jbz+5no4uTkLizxgDv\/PKQObj3\/KHwfw64ubvqvjbngn6DACbiQSAX77\/cZy7uv3xScqbB\nfXZFcY9O9NEgK9bSrLDsz5C0XYYBYxMsppOw\/\/cn1CiHZwrXYxCmlYKajE7ckAk51ZyTGmPd+he4\n2XUBPOKLYBA3Qpe6FRbWZhHwcfrM4EwSnrCp9pKB7svK\/nTOLOMmPnDu0VbRXHIyHTdrIapXQo+m\njcH5vXbosUrh2oOts3PQoWr5r7TaVfyCbgzJBe5JcQcEuFwYUXUwwMF+M4SXpyAQcsOZAcr4VYZ3\nX1sVzQeFvtelaj0gqJNkVwjOZlDrRY3HNefU8IsKOWiXc899AKTiH8ull0N6eTv17O6zP\/zugAp+\n9TFgl5rvJr3\/HauiiWNTNMO7spLkzQgrhNTMNqwE12Evdf\/3HTV2NZ9DjfE2jfzM+zVJV7dWsmSW\n8cAszYvLZEKFh4IQNI2AT98HO0t7ZzcLBXUXiyl177\/\/689v\/titU+JYaXgrUU5dGhHEQ7Ms5R6T\nGCU6u91ExLssZDWlaCrO113I08u5kbyV0bY3gFZY945qQdteCxvRNeg1qRigU9sGfocKBiySs4G8\nWv6tUINBbYqmjEvXdtBr6Miuzy7BjcXbIGu5CmpBDajeUaDXA+tzm6AT1R83jkMjgGG7HJz69i+G\nJGNIH3xwpfS7opba0qy6jQMkNw7lu6mHcGfzARglfFDwq0BOQthOlZSBz\/gjIG6+8sHIoXT\/lrHj\nULUWXmBNxXlDzeXvof7KBQw+xQBJ5FZHYzkoW6vBY7XAZvQ6pJO3IDYWg6ry88CruXislrpLYJA0\nAjbgF+8uhSbJ8VVd8R2nsaY0c2PpNuyu3oX04i3YTuzCjG8aG2IBtuI77PXWwg7e34Rhlwd6LJ1g\nlMsPq8q\/dZMwE4edyhawFZgIBdOKbtMMzr+2yJs+vrdvx3dKthZuAkES0PXYTbg+fwOuoXZW7sDt\ntXsMMhVNs89Sc9uwMbud3YptFZnFdcWK1uqD3CjiffIQO2iTHvTohaDEspJg+Uj5VzOC+rKP\/14q\nul1CwXeW78CN5C4D2JzdZq7truzh+3uAi4CNmS0Y7\/OxrtZjs9DooS7XofQd9dRY7k+nsxVoxp6q\nBsx15uL1yFZ2I3KduURaj1xDoOvo1BYCp2EtnIIJdwhE3ApcdQNI+FwQt3BB0HA1w63+6wGprvLC\nJ1NMm4NZzoMTG+OkK2SbyK4jYBpTeRPrkBxcmdyElYkNpsXQGiha6sAolcLy+DpsRLZgmd4fW82k\nfKlzp2kIpbAam6o1e6rOd7X3GsKuCCwGVyAZWIElhFgaW4MUgq5ObcKIIQBNVSUw74tDMrjKvkMi\neHydOI0ZBmnjoV5Szzq\/4Aw86eoWuNxDah\/0ywdhvGsKplwzMDewAH5DEGxtJpyLPFzAKqxjulcR\nLO5fgk0sA1rUgi+ZOM1wVndwDm1KPHzgse6zAeOjixwKOtsfAw9C9iuGmIZ1frDLdeCze2EV076J\nzbIUWkeoRZj3JmB+KAHRoTgs+JfeLASXPyttNGYMkoZsbtjzP29x88PJxBLWWnxkORf4KHigewRU\nba0QHYzDYmCVpTzhX4ZIX5Q5TAti8pDmYaYvmggPxj757xFMsYG5WODQ8sFlqbcUTfdGs8vjG8yZ\nMec4eIy9eEjogD6zg4FScEr9uCMM4\/YpBhgbTjJYgp\/unXurnlkIu2YOw8454aDFWXTS40d+u\/wk\nYMybtHq1fiANqnxHGmbyakbAbwpCwDLORHBhBCDXkoFlSI7mymLKOYPuzbPaneyOHGkarDIRdCpa\n0nQeze8guVM7P\/FZgOhOP6Uqv\/oRbIoBpTcnhRfr0MvACW7KGTkOTvcxrL0YlgLBTTqmmfsEP24P\nQ8Q9Bz6Ln50p3UbKhBj6LRLot0rAg\/fd2tzTIm2TJ8KFnbMcWjEFYMGPAMiRBQw8gUFJM5heSieJ\ngpOLY6TOvCYhZMuJ7qfxb2JnI2QUj2u83M6DoEY8WNC2aMHdxCpvYo8TqtaazImA413hDAuONYb3\nOWFggiXofHByeGGYAs6yz4PWiZzQ1eBR6gNm0hiE8P3oIGVkFhcxCWJeDTvS0fmTbY0duW2StkcJ\nrxJEDeWFdxWfwldMwfMu5RyYYAHeB6DPowMxBjtqGkOFmAJ4P42pDHVOsHkZws8JdkQfYAvx6QJg\natdCC6eUwUibKkGGZ0o6zjXj4OdzSk8+ptlaHCWj+eI\/Wjk5SGB5AL\/xSBicRPVJwfPy6UYZiN8Y\nhGHtKLo+zRbhkQ1Cr7gfXO1usDd3g7xOBPWVPxyrDlVb+f2YnFt28k7iN4VK+mQDQLsHuRTGlNAo\nmUDIXPAcAImCk8jhSRwzXo2fdbdXPcIayY0w3YIe6Gx2gLnBdiw9xwiaKh1Iroih5scf2Bmy+sfz\nn\/80aKg1Zy2NnbjiIYggIAUnOApOP6kWhxFwCMcOaVA5jAsagS6+k8FYuXYGYuXZwSFwgqPNBZpq\nHcjKFSAuk4KRawZ9nfEQ793ii+LTPxZIKxQcZaUaDLUmFsTO7z5ePYE7BC72M\/8efY9cIWmr9aC+\nqgV5hRI0HB3Y2xwMSFahyIovSdKiMilHXiY\/981vveiP4ArHZBWqLAUrJHKEIAiAnCEhwAGJfpcc\n0tRohF8K9B9Ls\/UcLgrzwwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1270237626-4979.swf",
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
	"npc-vendor",
	"vendor"
];
itemDef.keys_in_location = {
	"u"	: "buy_sell",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"k"	: "make_eye_contact"
};
itemDef.keys_in_pack = {};

log.info("npc_jabba2.js LOADED");

// generated ok 2012-09-14 13:52:27 by lizg
