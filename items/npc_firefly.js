//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Firefly";
var version = "1344982233";
var name_single = "Firefly";
var name_plural = "Firefly";
var article = "a";
var description = "The perfect alliance of science and nature, the dowdy brown coat of the firefly when landed belies their beauty when in flight: a heart of gold, a tiny buzzy fizzling flying flame. Thought to have washed up on the banks of the mythological River Tam and taken flight eleventy billion eras ago, and never rested or run out of gas since. The firefly's glowing essence can be used to create crystals.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_firefly", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.box_width = "200";	// defined by npc_firefly
	this.instanceProps.box_height = "50";	// defined by npc_firefly
	this.instanceProps.box_center = "";	// defined by npc_firefly
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	box_width : ["Width (radius) of the fly box"],
	box_height : ["Height (radius) of the fly box"],
	box_center : ["x,y to center the fly box. defaults to initial position."],
};

var instancePropsChoices = {
	ai_debug : [""],
	box_width : [""],
	box_height : [""],
	box_center : [""],
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

function attracting_onEnter(previous_state){ // defined by npc_firefly
	this.setAndBroadcastState('halfPath');
	this.messages_register_handler('attracting', 'attracting_onMsg');
	//this.fsm_event_notify('interval', null, getTime()+(randInt(1,5)*100));
	//log.info(this.target);
	//log.info(this+' started attracting');
	this.apiStartFlyingTo(this.target[0], this.target[1], 15, 'onPathing');
}

function attracting_onMsg(msg){ // defined by npc_firefly
	if (msg.from == 'interval'){
		return this.apiDelete();

		// Find the distance to our destination
		var dx = this.target[0] - this.x;
		var dy = this.target[1] - this.y;
		var distance = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
		//log.info(this+' distance is '+distance);

		// If close, change state again, or go into the jar
		if (distance <= 100) this.setAndBroadcastState('smallPath');
		if (distance <= 5){
			if (this.target_jar.addFirefly()){
				//log.info(this+' went into jar. Dying');
				return this.apiSetTimer('apiDelete', 500);
			}
			else{
				delete this.target_jar;
				this.fsm_pop_stack();
				this.fsm_push_stack('escaping');
				return;
			}
		}

		// Find a point on the line that's 15px away, 50% chance of -10 y
		var move_distance = 15;
		if (is_chance(0.5)) move_distance -= 10;
		var r = Math.min(move_distance / distance, 1);
		var x = Math.round(this.x + (dx * r)) + randInt(-5, 5);
		var y = Math.round(this.y + (dy * r));
		//log.info(this+' moving from '+this.x+','+this.y+' to '+x+','+y);

		// Move there
		this.apiSetXY(x, y);

		this.fsm_event_notify('interval', null, getTime()+400+randInt(-200, 200));
	}
	else if (msg.from == 'pathing' && this.target_jar){
		//log.info(msg);
		var status = msg.payload ? msg.payload.status : 0;
		//log.info(this+' finished attracting: '+status);
		if (status == 0 || status == 2 || status == 3 || status == 4){
			if (this.target_jar.addFirefly()){
				//log.info(this+' went into jar. Dying');
				return this.apiSetTimer('apiDelete', 100);
			}
			else{
				delete this.target_jar;
				this.fsm_pop_stack();
				this.fsm_push_stack('escaping');
				return;
			}
		}
	}
}

function attractTo(jar){ // defined by npc_firefly
	var pc = jar.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return false;
	if (this.current_state != 'wandering') return false;

	this.target = [pc.x+100, pc.y-120];
	//log.info(this+' going towards '+this.target);
	this.target_jar = jar;

	this.fsm_push_stack('attracting');
	return true;
}

function escaping_onEnter(previous_state){ // defined by npc_firefly
	// target is the closest firefly spawner or our starting position
	var is_firefly_spawner = function(it){ return (it.class_tsid == 'spawner' && it.getInstanceProp('spawn_class') == 'npc_firefly') || it.class_tsid == 'firefly_hive'; };
	var spawner = this.findCloseItem(is_firefly_spawner);
	if (spawner){
		var spawn_at = spawner.getInstanceProp('spawn_at');
		if (spawn_at && spawn_at.length > 0){
			var pt = spawn_at.split(',');
			this.target = [intval(pt[0]), intval(pt[1])];
		}
		else{
			this.target = [spawner.x, spawner.y];
		}
	}
	else{
		var rand_x = randInt(this.x-100, this.x+100);
		this.target = [rand_x, this.y-200];
	}

	this.setInstanceProp('box_center', this.target[0]+','+this.target[1]);

	this.setAndBroadcastState('halfPath');
	this.messages_register_handler('escaping', 'escaping_onMsg');
	//this.fsm_event_notify('interval', null, getTime());
	//log.info(this.target);
	//log.info(this+' started escaping to: '+this.target+', from: '+this.x+','+this.y);
	this.apiStartFlyingTo(this.target[0], this.target[1], 5, 'onPathing');
}

function escaping_onMsg(msg){ // defined by npc_firefly
	if (msg.from == 'interval'){
		return this.apiDelete();

		// Find the distance to our destination
		var dx = this.target[0] - this.x;
		var dy = this.target[1] - this.y;
		var distance = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
		//log.info(this+' distance is '+distance);

		// Are we there yet?
		if (distance == 0){
			return this.fsm_pop_stack();
		}

		// Find a point on the line that's 15px away.
		var r = Math.min(15 / distance, 1);
		var x = Math.round(this.x + (dx * r));
		var y = Math.round(this.y + (dy * r));
		//log.info(this+' moving from '+this.x+','+this.y+' to '+x+','+y);

		// Move there
		this.apiSetXY(x, y);

		this.fsm_event_notify('interval', null, getTime()+500);
	}
	else if (msg.from == 'pathing'){
		var status = msg.payload ? msg.payload.status : 0;
		//log.info(this+' finished escaping: '+status);
		if (status == 0 || status == 2 || status == 3 || status == 4){
			this.fsm_pop_stack();
		}
	}
}

function fix(){ // defined by npc_firefly
	if(!this.current_state) {
		this.initialize();
	}
}

function initialize(){ // defined by npc_firefly
	this.default_state = 'wandering';
	this.fsm_init();
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_firefly
	if (!oldContainer){
		this.initialize();
	}
}

function onCreate(){ // defined by npc_firefly
	this.initInstanceProps();
	this.apiSetHitBox(200, -400);

	//this.default_state = 'wandering';
	//this.fsm_init();
}

function onCreateAsCopy(){ // defined by npc_firefly
	this.initialize();
}

function startFlying(box_center){ // defined by npc_firefly
	var box_width = intval(this.getInstanceProp('box_width'));
	var box_height = intval(this.getInstanceProp('box_height'));
	this.apiStartFlyingInTheAreaX(box_center[0], box_center[1], box_width, box_height, 15, false);
}

function wandering_onEnter(previous_state){ // defined by npc_firefly
	this.setAndBroadcastState(choose_one(['fullPath', 'halfPath', 'smallPath']));
	this.messages_register_handler('wandering', 'wandering_onMsg');

	var box_center = this.getInstanceProp('box_center');
	if (box_center && box_center.length > 0){
		box_center = box_center.split(',');
		box_center[0] = intval(box_center[0]);
		box_center[1] = intval(box_center[1]);
	}
	else{
		var is_firefly_spawner = function(it){ return (it.class_tsid == 'spawner' && it.getInstanceProp('spawn_class') == 'npc_firefly') || it.class_tsid == 'firefly_hive'; };
		var spawner = this.findCloseItem(is_firefly_spawner);
		var box_center;
		if (spawner){
			var spawn_at = spawner.getInstanceProp('spawn_at');
			if (spawn_at && spawn_at.length > 0){
				var pt = spawn_at.split(',');
				box_center = [intval(pt[0]), intval(pt[1])];
			}
			else{
				box_center = [spawner.x, spawner.y];
			}
		}
		else{
			box_center = [this.x, this.y];
		}
		
		this.setInstanceProp('box_center', box_center[0]+','+box_center[1]);
	}

	this.startFlying(box_center);

	//this.fsm_event_notify('interval', null, getTime()+5000);
}

function wandering_onExit(next_state){ // defined by npc_firefly
	this.apiStopMoving();
}

function wandering_onMsg(msg){ // defined by npc_firefly
	if (msg.from == 'player_collision'){
		var pc = msg.payload;
		//log.info(this+' collided with: '+pc);

		var status = pc.getQuestStatus('firefly_whistle');
		if (status == 'none' && !pc['!firefly_collision']){
			pc['!firefly_collision'] = true;
			pc.apiSendAnnouncement({
				uid: "firefly_quest1",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: true,
				click_to_advance_show_text: true, // shows the text prompt next to the advance button
				no_spacebar_advance: true,
				text: [
					'<p align="center"><span class="nuxp_vog">What ho! ...</span></p>'
				],
				done_anncs: [
					{
						uid: "firefly_quest2",
						type: "vp_overlay",
						duration: 2500,
						delay_ms: 0,
						locking: true,
						width: 500,
						x: '50%',
						top_y: '15%',
						click_to_advance: false,
						text: [
							'<p align="center"><span class="nuxp_vog">... Fireflies!</span></p>'
						],
						done_payload: {
							quest_name: 'firefly_whistle'
						}
					}
				]
			});
		}
	}
	else if (msg.from == 'player_enter'){
		var num_fireflies = this.container.countItemClass(this.class_tsid);
		if (num_fireflies >= 50 && is_chance(0.50)) this.apiDelete();
	}
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
	out.push([2, "Catching Fireflies requires a <a href=\"\/items\/694\/\" glitch=\"item|firefly_jar\">Firefly Jar<\/a>."]);
	if (pc && (!pc.achievements_has("firefly_whistling"))) out.push([1, "Catching Fireflies requires the <a href=\"\/achievements\/339\/\" glitch=\"external|\/achievements\/339\/\">Firefly Whistling<\/a> badge."]);
	return out;
}

var tags = [
	"firefly",
	"no_trade",
	"natural-resources"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":10,"y":-43,"w":21,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFFUlEQVR42u2Y6YscRRjGZ2Y3iUe8\nz2jM5bo7U13VG12PaIzxStTEaLyRFUVERZGASERBRCEKIgheH\/JBUAJ+8oP\/Wbq6ZzZ9BMrneatn\nJr2zs9kMs4eQgWJ7enamfu\/zPu\/bVVWrXX5dfg1\/OVerY0xgTDo3t6k6eE8+a6wHFCZXm53bdYVz\n2690Lrwa77dWB+9tu8p\/PrWlhG6sARgn48SEmLrWub3Xu8jc4Ky6sTJ4j5+5Pdc5N3ONByYsA6tN\njBtuog\/GyTAxIeLpm10S3ura6nYZndY2Gd33bX2bS6ZucXHzJg\/MgBgYQUXR+hjg+EMS+VYB42Rd\nqM7MHW4h3O4W1A53rrXTj+Yu+ct7C\/ou15m900MDlgH1QKkogx4x7T6lhCtVo2JUg2A9qHC3i\/Td\nqVVTqW3dk9rZaT94zaGmALRHoAUWAQkogpTUi022jJTyPhyi5Q\/yh0UxgGFSgYrDmSzRrSxRQZaE\nOmsbI4PXck+pLDZNwjIQD4rgGCSDFY\/2IBuXot5kWX0lXKkaJuiDYXIBCmbzjro374T35ZGZ6w3e\na6u9WVuHHli3PCgUZZBM+yBkfYUFwfZRppXKCVy4mxOIYgDj5B4meCC34UN5bB7OY\/2IH7i24b7c\nqgfzSN9PWA+qAgYnag5A0pNzm1YAyDaAiGhmFgNNLsp14XTo1QIYQIpYPVrE4YEiMQeLRD\/eG7F5\njJ8JMAMgKBWFmhVIZofFI4XDrC3jR68e\/wkG5pfoOVQk01qBw4RFHOwXiCR4oojM00WkDxc2eEYG\nryN9qEjCpzwsQaEqg6pAMt30JLIk1S1NfvPF1ZPU0neoPERKo0tae3BQjRMTDEBQ92jWaR0\/vxC8\ngslfzZLmy2ncPFbY8FmBTcInGUwVUinxJAuHQkiqWdlDVGQVee+xMLrqdVOrAvEcPCXKCZw+lFrz\nXJYAypr5zKp38zh4HxAfnO\/o9zLbehuqv+FBoapAhgc8pJkTTyJwn2oI0VNxiBd95bKtwLDdwkAK\nvHpILT1Ez9FrUM7D6dcFLAk+Tm3wKfx2Mo3N57nVnyGYE4QlfBqrFz0k7MB0s3hYOCwaURGNnQUj\n\/ZFPqiUqejC9aof3nlJ99ZhaKIHUSToJd1adQPq+KKz5NrP6O6j7Pf6egtJfCWhsPoQ95gFyxPvS\nHOyraIx4kQ2fxVhNc2MRIKlBzygYjaR3dpqGLr23T4pC1IPnrH6Lyglcok9lkfkpt8FvgPod42cA\n\/gDor6ksU86A+ioG++lF9lAWn08zMsauIS2HmaxNLnqsLfYf+h4bMouD\/Q7tovTe4TRuvUT1ODlA\nvynhTqeR\/gupPwM7\/IH3v1LNNNZf5on+CF59k7aQyu6muVcseCQO+HAYIGWW3tcF7PqvBIQKVIMF\ngclPUj0o9gu89mcW6X\/ORcG\/uP47t+Z0FusffarNJ1TcpxmVz2Jhb+z5kIBlT1yqUP5fgBsxxaMV\niZm\/pCLpmOMXLRICLlUkY2kzCZRc3TZzQaNmuY+hUUM136itfr7aqC\/039KNetUfdXncfAffe412\nGMujbjDNfNyteLFwJI2DY0jXC37g2uqjg4sFLL36i4VgmcVCY4XLLRbLBlpubZAFa2PEJb\/fj6z7\nkn\/pTVMVcl03TSvadsoGapzbTmZshA18ZeMunhznxn3EPfHwdI\/h6IMBDh591Dfs4dFqHMGN6\/ht\ndQ81RzvAlBPXem2tX8scAU+Uh55rD7WWr\/8AJO+HSoH0PqkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1296757447-3116.swf",
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
	"firefly",
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_firefly.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
