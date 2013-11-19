//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Uncle Friendly";
var version = "1347655947";
var name_single = "Uncle Friendly";
var name_plural = "Uncle Friendly";
var article = "an";
var description = "An old-school corner store with a small stock of groceries and fresh (-ish) produce. It's a handy little place to shop, if you don't mind that Uncle Friendly isn't friendly (especially if you ask him about his centuries-old tempestuous relationship with Helga), or that everything you buy to eat there looks like the best-before date has been amended with a crayon.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_jabba1", "npc_walkable", "npc"];
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

verbs.buy_sell = { // defined by npc_jabba1
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy groceries. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 13,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
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

function onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
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

function parent_onPathing(args){ // defined by npc_walkable
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

function parent_onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
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

function parent_stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "This vendor is located off of <a href=\"\/locations\/LM4109NI2R640\/\" glitch=\"location|27#LM4109NI2R640\">Guillermo Gamera Way<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"store",
	"vendor",
	"no_trade",
	"npc-vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-133,"y":-190,"w":240,"h":189},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJVklEQVR42u2YCWyUxxXHt4ZCCJQQ\nVYTQFKSmaYTcYEgdfK3X\/uw9v72vb+9d723v+sD3ba8P7LV3fWPs+ACD8fpYfGBjDAQaaBA0RZQe\n0JSkNEElaSERaUAibVRVr\/N9xgYSFCcVR6Uy0l87uzOj+c17b94bm0Z70p60\/4MGQPvO\/zTgJ38c\nfvna+Z41QHuMoMEgsQgguOj21xAzhq3S4\/hKD+rDB31PXflDQP\/Ru4MbHhvg+7\/tjLh8vkvw4a\/2\nfD9dJ4hI0+Od+XZpl7\/IFP2b455Vl3\/fW\/rB73qiHhvgxxd2rLh8vs967kR7jz9P\/XaHOx6CeRiM\nNjsunX2zcea9s22uP51rW\/1YY+3cW7Wru\/22+sp04Y18VRSUa6NgW5oMWsutFWNdzrVBglj02OA8\nHlrI\/kbLur5qa1+XxwS+HDXU52qhp8oMQ37H9X2Nye37m5wbg3XOZ7qc4d99tBekjnhmZ5Vh06DP\n7t3rtX7SXqKHxjwNtBbqwE+CIvVUJl0brndsH\/DarD3Vxh+RB3pkgN1lST\/t8Zjathdr3ylNkdyw\nEyzQSxLArGCBQ4NDulkGxS7C15qvMzblaXieTOmqR+7ik4GOZ1srU40FbvWv08wScBlEkG4UQ36y\nGqpyrdDbkBeY2lMXO97vfy7o8Sx5ZGCng03Ljg03vnx0rDn35MEdF355uOOLQyM+2NtSCLuK02C8\nvRxOTrfD20c64ehEy6lDwQbf9Ei99s2xZvrx0e0bJgdr1pA59CEkZs+S6YD3xQOBOtPMcMP09JD\/\n5uFgIxyf3A6nD3fCz7tqYMLlhjdaKuAXk21wdKwFZkYa4Mi+JnhjtAmOjbd8dGSs6TBaV9\/TnJvo\nyTCuJx7ELfd4PCFdzZlr26rT5R11WYGBjrKbMyONcHDYD9NIk4F6mAn6YaKqAHark2CkMg8m93oB\ngVAi59759FHq9Ga958k0d5emm1geM\/bUfw2XjuNLy9IMmypzbbXlmaYruU41NHhSYR7wNsT+3TUw\nkp0OgSQbjDeXURBje2qRatABfHBgsB791gCTA3WwH8H7PS7YalVApk15Mcsm12URxLI7FkG1stCl\nY6WZ0YCFkBVmWl68D1uIU85dm26Sarea5cEMs+xGWpIUSPnKXBTU3YCT2ysgaLTDCEcL40U5MLXH\nC7s7PDDQVQET\/V4EVg9TyNLjCHpf37bPqosdBzRi7IROknjGpuZfdGh4MnJPauc8t25zjlM1mWFR\n7E4xSS6VZ5qbMYy2eI4MR1azEdwIm4rXZFPjfzEruV84dMKbRRkGqC6wQXdj3lcAJ6oLYZ8sCfYx\nNTBisMFESxn0IcBgXw2a10BZkJxP9icHvH8d7\/W8ouQxNAJeNFfGi+nRihNOEXxsMwVQkKKtJy0j\nFIY\/rRInTFdkWv6c7ZasI8eI0NAlKjyBbpAyR40S5hm1CNsrxenNqXZ5R09rwcWhHmQR5KKvuLjN\nAxN2N4yKjDBkslNuHuytgvH+WgpqKlB3TxweCXrDFTg9DY+MXMnHQp8Xc6Nn1EJsgDQOLc+paZ+1\n1EtLFUKGrzjN8HF+ChFB\/sbHtjyv5DO6NcL464SA0SFn0aMIYeILDVUpr04P1u+YDXL\/PCC5Oalp\nFGeTNcUQzNkKI00l1CUhL88Ushx5kw8M1lHz5wAPBuokhDAuQPBiouU49kMxNyYb7XlDhcfSaVst\n8py7AQtcunlAHGeslvNiqwk+4xBSn5IXWyHnM4p0cmZVQZr2WGOlG\/bsKIEDt108B0j2p3bVwvjO\nairWvnyIuYMdCjbPjgV8JuSdXimP3qvAGZ1yHn2\/is+4qBTQ5TSLBlfOxZpexvKhC3M1x6mYe1iG\nMJmvrBEkbomRsKK5YnakQcal21UCRm6qVTJdkKqByjwLBBHI9Dzk3fHomwe+Ewa++fFDwSbqogRe\nL+UrxIwwESfGLeNGV6IwqpLhdD2XEb6WJuHErdPjkSvNKP9Y1PzXC926Dz1uYsXXppt0fKm\/0mXx\nljr+Xl+eMg84p3lX385zpO4FnI3Dsf468JalQLpNGjF\/a+\/XxGL69zicsOUmJWemwKW\/slA+xDBs\nsUqKGaw6wWelORbo8OdBoMsDIzurILhrG4zuJtNHDQx2V8Bw7+xv5HeUUtCcStjbWQ6t3kwoRTU6\n2SgBk4IZtmASJjBshUHOPluIAAkidMFizkt4TSxgRV2VCeIhSSMAt00BOak6KMw0gafADo1VybCt\n0AD1JUaUiG1QkW+FoqwkyHJrIcUiQ2v4YFLh4DZJr2WYFT9ZEBBHbtbJmFfyU7SfZjtUVnJRtkMR\nk+VU5WQ7NLUFLm1bVa6tpCRVF5dr5CwnBIkRUjz2hAxngFqUCFI8HiR4HAg5sUCI4yEvmQf5TjYS\nEz232KAUxYOIG0tJjuYa5RywawWQniT7FL1+NtIW+ouPdLNWzryAkva\/su2qd7Nsquksu\/KtLDtx\nFX3eQmXt30Vu\/fVsB3Fqq0XRjw4w6tQLL1vUPLAgS5gJHhIOSUoeoIQOWTYR5DrEkGMXQZpJSM0x\nyNiAvAQolBAcH5L1Ikg1SSBFLxAv6DVhePjTCmHcMKookGlVIimo+kjJckcZFjlkmGeFTg9uFEMp\n6O3noiSmRG5KjqXdJXJesl4ILvRGdKPxVFQm3WiuUyf83KHhxBAEbdECgU9bLOTEKPVy9i3yZGgh\nOjUPDOhVPCfy5A7kFhIgFW3ovi2qjzabW0eBoH7KXXKideTaZN3sGHkQB4pDVEJPGwnW+m\/0WsGw\nzaskPHqyWowNocw+JBfQhyS8mFlxo4+KufR\/ECiWSHByozmRACQgZU3UJzcmZSelJoVTsqlI8cCK\nZCG46PayP09SskwEEb3sGz+pwsLClnO50S99WTx2JJ\/Pijoj4kSDnB8LGnECCnQ2oMcDtbFDPQtE\nxp8VxaMVAVjmpJyVGXmAlEHGRBcr\/pZaFLdNxol57oG8oMkY5TBfY\/NZkf0ovfyNBEXWRrc3FmRI\nCj4DVMJ4CvxeYbMSYUCgcVQqAZW0S1JuTI4wcdMLX5ugv20LRa8bFit8PY8VHstL3GJGsD4BO\/Kw\ngB11TsSOeh9B\/xMVerif0Ng7Im7UsIgTlUWWTmzz5lW0h\/jPpBAMC13BZr\/6AyEneoMwIWITj7ll\ni4AZwcDZ0fH3Ezcx6md4YviPBbEbn32gVnvSnrSH3P4DqirDvSDXIsgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_jabba1-1342568015.swf",
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
	"vendor",
	"no_trade",
	"npc-vendor"
];
itemDef.keys_in_location = {
	"u"	: "buy_sell",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"k"	: "make_eye_contact"
};
itemDef.keys_in_pack = {};

log.info("npc_jabba1.js LOADED");

// generated ok 2012-09-14 13:52:27 by lizg
