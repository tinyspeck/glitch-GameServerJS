//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Meal Vendor";
var version = "1347655947";
var name_single = "Meal Vendor";
var name_plural = "Meal Vendor";
var article = "a";
var description = "A friend indeed to a miner in need, Monsieur de Nomdenoms is a purveyor of high-end food for those in the deeps who need energy fast - and are willing to pay handsomely for it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_cooking_vendor", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "roam"	// defined by npc_walkable (overridden by npc_cooking_vendor)
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

verbs.buy_sell = { // defined by npc_cooking_vendor
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy ready-made meals. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 16,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
};

function idle(){ // defined by npc_cooking_vendor
	this.setAndBroadcastState('idle_stand');
}

function onCreate(){ // defined by npc_cooking_vendor
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);
	this.parent_onCreate();
}

function onLoad(){ // defined by npc_cooking_vendor
	this.apiSetPlayersCollisions(false);
}

function onPathing(args){ // defined by npc_cooking_vendor
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		this.stopMoving();
		this.apiSetTimer('startMoving', 10000);
	}
	if (args.status == 1){
		if (args.dir == 'left'){
			this.go_dir = 'left';
			this.state = 'walk_left';
		}
		if (args.dir == 'right'){
			this.go_dir = 'right';
			this.state = 'walk_right';
		}
	}
}

function onPrototypeChanged(){ // defined by npc_cooking_vendor
	this.apiSetPlayersCollisions(false);
}

function stopMoving(){ // defined by npc_cooking_vendor
	this.apiStopMoving();
	if (this.go_dir == 'left'){
		this.setAndBroadcastState('walk_left_end');
	}
	else {
		this.setAndBroadcastState('walk_right_end');
	}

	this.apiSetTimer('idle', 1000);
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

function parent_stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "This vendor is located on <a href=\"\/locations\/LLI101QQRA211SM\/\" glitch=\"location|50#LLI101QQRA211SM\">Level 2 East<\/a>."]);
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
		'position': {"x":-89,"y":-211,"w":179,"h":212},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJA0lEQVR42s3XC1BTVx4G8DvT6Wq7\nLgmv8JCBYlsUMAYI74eBgCDhESC8K4QICMojhVFQRIPWolvB6IqCIAZUQCgQHiIIaMSKAoKItgor\nAYsj7naVdHZ3tjvtznx7byjMuLXuTje4e2a+ySGQmx\/\/c+455xKEBpuyZwvt24EC+Wz7NnF3HMGh\n0hNB0Ij\/ZYPyEO3vI4XSqynvTl+MIdAcQaAlisAVEYH+VAI3yXyxhZi+kkBIv25MFOLRSc4bw5V5\nEazrxV6KiUYhelK00L\/zQ7REEpCTyOZwAm2bluNFRxJuZbxDIdG2bSV68lggKyu7KiL4\/YmE2dLh\nvAlxLZ9QtUXPV61rmyGedIvRIzZDfQiBC3wC50PeQluWBeSbfo3GMALtce+o\/4lLHxHojicwkGuM\nB0W2isFUQnInnWBpDHfKm5BX+hHoJL+IGlaqanXBBKp4BGqCCJwLJHCW7FeTORtAQgPnf98k0sfQ\niQB0b2WokReT6ejYbo3+zN9gKI3A7XRiejidEP9ymA9Be3Z5+2hjgglqI7Xw7cA+3NrDVFenjj8P\nqfIncIbEn\/adTyWZMxvnsRS+PvTH4Scr37mJnKsJBPqSiNFbqYRsOI0Q\/le4yuBl0\/LMD0D2URm0\nDO1ZH6Ax9l2cJ7+4TrCMrAgD3Zmm6MowRb3QAJ3ppmhONkJVtA4akozRtM0MTSkmqAlfoSKvIb0U\nQ3A0djOQc466KBbSFK+DLnK+Xd1thaHDDmjLsYIs2RxHo41RFG6oDtWXhujgaDANZwRaKlnA27Iy\nH4Kv8TuVwlUHL0NrIgP9eyzRt4+Fzry1ahSVpqzV6tRuMUVVoukisDhUf5oCUddYsmWkLdlANfgJ\nE9cLmGjJMMeFpJW4uHUlWtLMFOei6bLLmaaS6uBfSciqSijM74JWcIoEBiqqel35tgri\/7EdFhjK\nqOGea4l6M8De3mbduTmlesuam536t4trcSiDRU2BsRLvpQdOuRqZzXyaPj3p9yGe+Fvg2dYAfBPr\nMvo8gSN\/4WlCrVlvvepzl\/LtpycrOEsL7D2WJx6P9cC9UBsoM8Mwk8rDDMcYs7zVmA23wwuuCV6k\nBeI510T+3HOlcM5He\/Fg0Ja7Tnaj0EG1ZDhqSEdcDFQTH0fgSzcjjGxcjYfBTEytN1YjqSgDLfA4\njo2v4+3VeSpyVE24G0r6belmRQJD4Xi5N5YM2FdxQDHobICh4hzcdTXEfRL5kMwjdyP8PsYGE6WJ\nGG\/LxYPWHEx25KlfpzrzoTydgpsOepyiMCOz4SNuSwOcaipjXXNgqPqdSKCnOcZ3iTDqQiJdjfBl\n5Dp8VSfGA3kOhmsyMNaYjaG6DNwlX2e6JRjL8FINs+eHunsPU6U8xdb8efBGfpJi7Fg+BiPdoBA4\nksclAYadDTHqaYqnrQX46\/1aYKZLnb8My\/CoPBmPjidgZBNbvoCjWusOS8Wjcg\/Nnv\/uHdnF6bDV\nU\/Vs9kOvx3voc2DghqMBBshq3vttHP7x7A7wpGcR+IOyT\/WFI+OVO0V7jpVk4pSbUGO4hlXatHYR\nT9Vmq49Ldvq4zGbgij0D5HDjeoIT\/jx5C4N9fehtqlwEpm1J\/Nl5Vpv2vvBZXaBEY8Dadbqqz1l6\naLbRA4XsWEByzVXXSpMx0X0SZYU7cVtejG9GavC3CTnutEsxM1inmB5o\/skh4EiEIeerUh\/NAc9b\n0s1qmXrSepaeoslGT9FCpsNOT6LsyaUp23aPPu6Q4PvJFnyvbMeLsTp8RwK\/e1iPH8j3yOM051XA\n8Qpf2RvZ7qba97Cm2vPx\/NbJxeFVZ34+vhJxKEKb9rQm4M0dGBaq+BLwjwPA7JWf3Z+pO3nJYQ2r\nCBq1+CrrsmVUFV8Czl6Tv+6zV\/fZvAQUlBgKY0pNpb7Fb7M0Artur68YcjJQXLHTVV32s8DtgzH4\nQ3uxOpOnczFau0\/4nwI3n7NgBR2hc1ovWwuv3WArNHTjLDc7u2YFp8FSS1zB1FWkW+tDTCabZYhz\nOdEQhTq8diG+e9R5cX6Kzq7hbChcznlyz4Uzc9d1dE6p4V3GxdaEI\/C1RWyAI0oPZqHm+G6c3Cd6\nbQXHy9wV\/wpcsrnoZmMivdNxDEK+8yLwdGHK6GwTz+xJo7\/4YbWvZOSEp6TvsLukc6+zpHWvo+Tz\nHazpful6yf0KrmSgwVvWUe0kXhIcm9xj3WxMVbdbi1BSkITuhuO43lKKyr0hmK7zHx0+4YULuWxI\nN1tid8h76oh9jJHmZYTcQFPU7LDDvQpvDJd4omu\/o+YfolxtTCUkEMfyPoLss3Sc+FSMse5ytH8S\nhpbMVejcw8LNYlc8rveHsnYjHlb5qnP3FBe9B5zRmM1Ebbo1ivkGiGPSNTvMbJ8ImrsfT+XOXgUR\n3wF\/Gq7GUFMh6gvCcCpuDWTR2jjop4UzMTqoTdBV96s26aIpWR9HArSw000Pez21sXu9DnLd6ZoH\nugZHSpx4YXDhhSA2igc\/D2s4udgj1n01cr0MUPUjsDZeF+XhdHW\/PlEPdUJdlIXSUMClq3EUMtNR\nW\/PAipJDfGeeAK7BEfCNS0FAUiY2ClPAFURBtGG+gkUBNFRG0BeBVCXPxuqgPIyO\/d405HnoYh8J\nFTstAZBqnPAYRUhqNomMgm98KvhbtyMoJRvZsa6ojNRWwyhMhYCOQySwkkRTP5\/kz1cw110be71o\nyHLWRjyTztc40IkXzuclZsCNHwXngDB4RSWAG70ZYv5aBFrqYKOFDmLZ+jgeRMPRQBpKQubBVH+X\nhw52etCR76mFFDsSuJYu0TjQwS9EHChKgygji+PgH8Tx4LpJeZECVQ6XIedaGqgETAZ8LRnIXa+N\nkmAaikkYBfzMXwsfO+qpcdmuNAiZJNCaLtQozpY8JzqyraY9fLjShfccLegsT5aRfL0VQ+bHXCkN\nWGei8npfl5\/ioI9CX5p6HlLVo+YfBdzG1lalOejIPglkLM2TnsMafZm3rZHC3frl5w+uOd0siFwf\nfdcaS3ysjOQCOxP5Dhc9zkLS7XUVB4IZowt\/v9+XwSLedPNew5BtsDZSeK1mqEIdzV8C5DjrCo\/G\nGP7ik8s\/AcJeQR8TCOsuAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/npc_cooking_vendor-1308956450.swf",
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
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_cooking_vendor.js LOADED");

// generated ok 2012-09-14 13:52:27 by lizg
