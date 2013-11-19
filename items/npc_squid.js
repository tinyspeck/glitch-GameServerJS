//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Zzybzfrx";
var version = "1347655948";
var name_single = "Zzybzfrx";
var name_plural = "Zzybzfrx";
var article = "a";
var description = "A creature as mysterious as it is legless, Zzybzfrx knows what you have seen, and where you have been, and will never tell a soul.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_squid", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "pace"	// defined by npc_walkable (overridden by npc_squid)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.y_offset = "60";	// defined by npc_squid
	this.instanceProps.variant = "squidYellow";	// defined by npc_squid
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	y_offset : ["How far above the platline to hover, in pixels"],
	variant : ["The art variant to use for Squiddy."],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	y_offset : [""],
	variant : ["squidPurple","squidRed","squidGreen","squidBlue","squidYellow"],
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

verbs.talk_to = { // defined by npc_squid
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Squirt. Squirt",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.stopMoving();
		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part2',
			'tower_quest_part3',
		]);

		//this.offerQuests(pc);
		this.questPC = pc;
		this.bamfOut();
		return true;

		/*
		// Stop and cancel any pending movement
		this.stopMoving();

		// And bamf out!
		this.talkPC = pc;
		this.bamfOut();

		return true;*/
	}
};

function bamfIn(){ // defined by npc_squid
	this.setAndBroadcastState('bamfIn');
	// start or continue the conversation.
	this.doQuests();
}

function bamfMove(){ // defined by npc_squid
	if(!this.questPC) {
		return;
	}

	var toX = this.questPC.x;
	var toY = this.questPC.y - this.y_offset + (Math.random() - 0.5) * 80;

	if(is_chance(0.5)) {
		this.talkSide = 'left';
		this.dir = 'left';
		toX -= 75;
	} else {
		this.talkSide = 'right';
		this.dir = 'right';
		toX += 75;
	}

	this.apiSetXY(toX, toY);
	this.apiSetTimer('bamfIn', 1000);
}

function bamfOut(){ // defined by npc_squid
	this.setAndBroadcastState('bamfOut');
	this.isBamfing = true;
	this.bamfMove();
}

function coolingDownOverlay(){ // defined by npc_squid
	this.questPC.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'cooling_down',
		canvas: {
			color: '#9e67d1',
			steps: [
				{alpha:.5, secs:1.0},
				{alpha:.5, secs:.5},
				{alpha:0, secs:1.0},
			],
			loop: false
		}
	});

	this.questPC.apiSendAnnouncement({
		uid: "cooling_down_tip",
		type: "vp_overlay",
		duration: 2500,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: false,
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">Ahh ...</span></p>',
		]
	});
}

function coolOverlay(){ // defined by npc_squid
	this.questPC.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'its_cool',
		canvas: {
			color: '#4781f1',
			steps: [
				{alpha:.5, secs:.5},
				{alpha:.5, secs:.25},
				{alpha:0, secs:.5},
				{alpha:0, secs:1.25}
			],
			loop: true
		}
	});
}

function createSwoonerfly(details){ // defined by npc_squid
	var position_x = this.questPC.x + intval(details.x);
	var position_y = this.questPC.y + intval(details.y);

	var erins_nightmare = this.questPC.location.createItemStack('npc_swoonerfly', 1, position_x, this.questPC.y-1000);
	erins_nightmare.setProp('y_destination', position_y);
	erins_nightmare.fall();
}

function doDesert(){ // defined by npc_squid
	switch(this.desertState) {
		case 0:
			this.questPC.buffs_remove('its_so_hot');
			this.conversation_start(this.questPC, "That cactus is CrAzY! Hee hee!", {1: {txt: "Yes.", value: 'yes-crazy'}}, null, null, 'yes-crazy');
			this.desertState++;
			break;
		case 1:
			this.conversation_reply(this.questPC, this.questMSG, "It is damn hot out though …", {1: {txt: "It is.", value: 'so-hot'}}, null, null, 'so-hot');
			this.desertState++;
			break;
		case 2:
			this.questPC.buffs_apply('its_so_hot');
			this.setAndBroadcastState('bamfOut');
			this.apiSetXY(this.questPC.x - 80, this.y);
			this.desertState++;
			this.conversation_end(this.questPC, this.questMSG);
			this.createSwoonerfly({x:85,y:30});
			this.apiSetTimer('doDesert',3000);
			this.desertState++;
			break;
		case 4:
			if(this.x < this.questPC.x - 50) {
				this.questPC.buffs_remove('its_so_hot');
				this.setAndBroadcastState('bamfIn');
				this.questPC.buffs_apply('its_so_hot2');
				this.desertState++;
			} else {
				this.apiSetXY(this.questPC.x - 80, this.y);
			}
					
			this.apiSetTimer('doDesert',500);
			break;
		case 5:
			this.questPC.buffs_remove('its_so_hot2');
			this.conversation_start(this.questPC, "Don’t worry. This is how vision quests always start.", {1: {txt: ":(", value: 'sad-face'}}, null, null, 'sad-face');
			this.desertState++;
			break;
		case 6:
			this.questPC.buffs_apply('its_so_hot2');
			this.setAndBroadcastState('bamfOut');
			this.conversation_end(this.questPC, this.questMSG);
			this.desertState++;
		case 7:
			this.apiSetTimer('doDesert',1000);
			this.desertState++;		
			break;
		case 8:
			this.createSwoonerfly({x:-200,y:-20});
			this.apiSetTimer('doDesert',2000);
			this.desertState++;
			break;
		case 9:
			this.apiSetXY(this.questPC.x - 160, this.y);
			this.createSwoonerfly({x:180,y:10});
			this.apiSetTimer('doDesert',3000);
			this.desertState++;
			break;
		case 10:
			this.setAndBroadcastState('bamfIn');
			this.desertState++;
			this.apiSetTimer('doDesert',500);
			break;
		case 11:	
			this.sendBubble("Follow me...", 1500);
			this.apiSetTimer('doDesert',1000);
			this.desertState++;
			break;
		case 12:
			this.createSwoonerfly({x:-290,y:10});
			this.desertState++;
			this.apiSetTimer('pollPosition', 500);
			break;
		case 13:
			this.apiSetXY(this.questPC.x - 300, this.y);
			this.setAndBroadcastState('bamfOut');
			this.apiSetTimer('doDesert',1000);
			this.desertState++;	
			break;
		case 14:
			this.setAndBroadcastState('bamfIn');
			this.desertState++;
			this.apiSetTimer('doDesert',1000);
			break;
		case 15:	
			this.createSwoonerfly({x:100,y:10});
			this.sendBubble("Follow me...", 4000);
			this.desertState++;
			this.apiMoveToXY(275, this.y - 35, 200, 'doDesert');
			break;
		case 16:
			this.desertState++;	
			this.pollPosition();
			break;
		case 17:
			this.questPC.buffs_remove('its_so_hot2');
			this.conversation_start(this.questPC, "It might be scary for you here.", {1: {txt: "It is.", value: 'way-scary'}}, null, null, 'way-scary');
			this.desertState++;
			break;
		case 18:
			this.conversation_reply(this.questPC, this.questMSG, "It's cool, though.", {1: {txt: "Doesn't seem like it.", value: 'not-cool'}}, null, null, 'not-cool');
			this.desertState++;
			break;
		case 19:
			this.conversation_reply(this.questPC, this.questMSG, "<i>Seriously. It's cool. It's cool. Everything's cool.</i>", {1: {txt: "...", value: 'not-cool'}}, null, null, 'not-cool');
			this.desertState++;
			break;
		case 20:
			this.conversation_end(this.questPC, this.questMSG);
			this.setAndBroadcastState('bamfOut');
			this.desertState++;
			this.coolingDownOverlay();
			this.apiSetTimer('doDesert', 2000);
			break;
		case 21:
			this.apiSetXY(this.questPC.x + 100, this.y);
			this.desertState++;
			this.apiSetTimer('doDesert', 500);
			break;
		case 22:
			this.coolOverlay();
			this.dir = 'right';
			this.setAndBroadcastState('bamfIn');
			this.desertState++;
			this.apiSetTimer('doDesert', 500);
			break;
		case 23:
			this.conversation_start(this.questPC, "I’m telling you, everything will be cool. It will all BE cool, if you just learn to step into your own head and shut all of this out.", {1: {txt: "I'll try.", value: 'try-being-cool'}}, null, null, 'try-being-cool');
			this.desertState++;
			break;
		case 24:
			this.conversation_reply(this.questPC, this.questMSG, "It’s all cool in there. Are you ready to meet your mind?", {1: {txt: "Just get me out of here.", value: 'get-out'}}, null, null, 'get-out');
			this.desertState++;
			break;
		case 25:
			this.conversation_end(this.questPC, this.questMSG);
			this.setAndBroadcastState('bamfOut');
			this.desertState++;
			this.apiSetTimer('doDesert', 500);
			break;
		case 26:
			this.apiSetXY(this.questPC.x - 100, this.y);
			this.desertState++;
			this.apiSetTimer('doDesert', 500);
			break;
		case 27:
			this.dir = 'left';
			this.setAndBroadcastState('bamfIn');
			this.desertState++;
			this.apiSetTimer('doDesert', 500);
			break;
		case 28:
			this.desertState++;
			this.apiSetTimer('doQuests',500);
			break;
	}
}

function doOuterMind(){ // defined by npc_squid
	switch(this.mindState) {
		case 0:
			this.dir = 'right';
			this.setAndBroadcastState("bamfIn");
			this.mindState++;
			this.apiSetTimer('doOuterMind', 500);
			break;
		case 1:
			this.conversation_start(this.questPC, "Hee hee! Neat! C’mere!", {1: {txt: "OK", value: 'cmere-ok'}}, null, null, 'cmere-ok');
			this.mindState++;
			break;
		case 2:
			this.conversation_end(this.questPC, this.questMSG);
			this.mindState++;
			if(this.finalConvoPending) {
				this.apiSetTimer('doOuterMind',500);
			}
			break;
		case 3:
			this.setAndBroadcastState('bamfOut');
			this.apiSetXY(this.questPC.x - 70, this.y);
			this.mindState++;
			this.apiSetTimer('doOuterMind', 500);
			break;
		case 4:
			this.dir = 'left';
			this.setAndBroadcastState('bamfIn');
			this.mindState++;
			this.apiSetTimer('doOuterMind', 500);
			break;
		case 5:
			this.mindState++;
			this.doQuests();
			break;
	}
}

function doQuests(){ // defined by npc_squid
	if(this.questPC.repeatingTower) {
		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part2',
			'tower_quest_part3repeat',
		]);
	} else {
		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part2',
			'tower_quest_part3',
		]);	
	}

	this.offerQuests(this.questPC);
}

function finalConvo(pc){ // defined by npc_squid
	if(this.mindState == 3) {
		this.doOuterMind();
	} else if (this.mindState) {
		this.finalConvoPending = true;
	}
}

function makeAppear(pc){ // defined by npc_squid
	this.questPC = pc;
	this.mindState = 0;
	this.doOuterMind();
}

function make_config(){ // defined by npc_squid
	return { variant: this.getInstanceProp('variant') || "squidYellow" };
}

function onContainerChanged(){ // defined by npc_squid
	if(this.container.isInstance('tower_quest_desert')) {
		this.setAndBroadcastState("bamfIn");
		this.desertState = 0;
	}
}

function onConversation(pc, msg){ // defined by npc_squid
	this.questMSG = msg;

	if(this.desertState <= 28 && this.container.isInstance('tower_quest_desert')) {
		this.doDesert();
	} else if(this.container.isInstance('tower_quest_headspace') && this.mindState <= 5){
		this.doOuterMind();
	} else {
		this.questConversation(pc, msg);
	}
}

function onCreate(){ // defined by npc_squid
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;
	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'right';
	this.dir = 'left';

	this.walk_left_state = this.walk_right_state = 'move';
	this.idle_state = 'idle';

	this.y_offset = intval(this.getInstanceProp('y_offset'));

	this.talkPC = null;
	this.talkChoice = null;
	this.desertState = 0;
	this.apiSetHitBox(400, 400);
}

function onPathing(args){ // defined by npc_squid
	if (this.parent_onPathing) this.parent_onPathing(args);
	if (args.dir == 'left'){
		this.dir = 'right';
	} else if (args.dir == 'right'){
		this.dir = 'left';
	}
}

function onPlayerCollision(pc){ // defined by npc_squid
	if (!this.container.isInstance() && !config.is_dev) return;

	if(this.container.isInstance('tower_quest_desert')) {
		if(!this.desertState) {
			pc.instances_cancel_exit_prompt('tower_quest_desert');
			pc.instances_schedule_exit_prompt('tower_quest_desert', 2*60);

			this.questPC = pc;
			this.doDesert();
			return true;
		} else if (this.desertState == 29) {
			this.doQuests();
		}
	} else if (this.container.isInstance('tower_quest_headspace') && this.mindState == 6) {
		this.doQuests();
	}
}

function onPlayerEnter(pc){ // defined by npc_squid
	if(this.container.isInstance('tower_quest_headspace')) {
		this.apiSetXY(-543, -950);
		this.setAndBroadcastState('bamfOut');
	}
}

function onPropsChanged(){ // defined by npc_squid
	this.broadcastConfig();

	this.y_offset = intval(this.getInstanceProp('y_offset'));
}

function pollPosition(){ // defined by npc_squid
	if(Math.abs(this.questPC.x - this.x) < 150) {
		this.doDesert();
	} else {
		this.apiSetTimer('pollPosition', 100);
	}
}

function startMoving(){ // defined by npc_squid
	if(this.isBamfing) {
		return;
	}

	//this.parent_startMoving();
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

function parent_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"npc",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-67,"w":54,"h":65},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGT0lEQVR42r2Z2U9TWRjA\/Q\/8E3yb\neZkMD2YiiA5F2SybgKgggsgiimVHNrWA7LKWtrSltOyrUqDstS2gaJQ4GGcyiWMmxGQmM8lk0pdZ\nn775vlN62kJFm16nyS\/33nMP9\/zu9517zrmXQ4e8+AGoD3\/zujTI8vT6gZg3c48c+r9\/P9ma\/L57\ne9tmfXIDhGDFkmUVRIyi9vZdtXRzKx+EkjNvXAfjcjpMziUF+Sz45tdG68+\/N8OrHydgc0sCL79v\nhq03U\/D8dQM8f1UIz14WcJ68kMCqNRNevCpirG0VwLDlBmPBeg0WVjNgZiENJg3JdqZ9FPwXVH4v\nvy3BC6f5jHE5FSamk9zwWfBv0AStWK6yBlYxCub1ArA8Lgbr41JYe1IG65vlbEvHVE7nTWt5rO6y\nORsWTRlukuMPktwQRJAuTA2Z1wtRogSFymH9aSVsPL0Nj5\/dYVs6pnISpXqmNQk+BNdRMgvF0rng\n6NRFdyYFElw258Cj9XywbBS5RW99s8I9inie6q1ac\/FvrrEbm19J5YxMXnBjdDJRGEGKhmntJmvc\nvFHI02zZKGGYmZg9vSsWlHuUg3KZKJXO+p5x+TLMLV2GofHzbgwKIUh3vvQoC1YwiqvYuMkqQfLt\nrBXw\/VXLTRS7AUsmelpJ7iqTImYX7QxPoNRYopNRAQQpAtTYoikLRbORHCaybM5F6Vy2peNFUw6K\nZWPdTDbGMamFFBxWnJDgwMg5jiCCjigYl6\/A\/HIGEyARzgpJZeH5DDAuXUWxNJS5DDPzKWCYv+TG\n0Hgi6IcTOLrRON8FZxdTeCRmF1OZwNxSOsO4SEJXGDMLqUyMyRgvwbQHBkfPgW4owcmgAIKeImGg\nMmMKNupgV2IumfHQE7PJ0I9p1Q7EcwQR3BeJ90nM2nnASbIzY2cKobT29sdxNEIIeivhhgFnC8ZF\nhm4wHjS6sy74LKiWeivBmb6I86072oE4UPXFcjS6aN8F3ysx7Vli4iFxAcY90Ks\/Cz29MRylRgBB\nryQe2Blz4zyMTdlR62JBoYnmCCLorcToXibtjCCUVrk6miOIIJeYeo\/EpLvEyGSikwk7w7tQWrt7\nojgypQCCB0pM7JdgjBPnGEMuUFq7lJEcmfKM74LeSgyNORl0ZTQB5Koo6JSLOYIIksC9ulCoKEuG\nbnnWByWIgV3kPdHQ2BzOxryBkQRMayR0dJ\/htMsEECSJqLAvIPCrzxh7JRgjTvp3kUhOsPrrVhPI\nZJk4i8RDl0IMbV0RHEEEHZEoKQli0XCV6B+Jh\/5hJ3oXqqpOQZz4SwgO+BzKK0S4OIjDtJ6B1s5w\njs+vnCR4kIR+yEEcE+AMOulzoR3T2tIRzhFE8OBUusv3e5R33kAHRvA+ijn4JBH8kMTeCLpG8X5H\nGLS022lqDfVd8Lc\/OjtcJT4mjX0DxFmOlui309QWyrl7T0SS+a7tHS0LOeyV4A\/varYdEhp9rEcJ\n7R4JB72MWFwgOGm8H8opqQiE+uYQ3A+RNrSEBhEFpf76vMJjsR+ZXu2RnV8amIRaF8M6taNxnEPZ\nmOZJgtA40LnT0BLCKa0MhJLyQKi8+zWD9vOK\/T8u7fRF6y9QGebwJYgk6ppPMxwC1Icq7p7cJ9Hc\nFsZuRt23HxVS13SaI60TQUFpgI2kCEmxvzW3+PjB3xX\/BFUsorf9I7PN4ksRCtga20JteUXHtnH1\n0WEXiYHq+mDAMptaG21wCMgwondqRaDSxnAU6kjcRkMP0RsN9xpP7SHYu2+EeUX+0tKKQGvFnZNQ\njhTeCtimMjqHElLVbiRKK0+ApOhYByvbFWjtCofi8uM7JOKgSykGZS8tq6IYNQ2itOp60U5NQzAQ\nuG8T7AurUhtlIJF6TDVFL7vs6GFazzEBpLbhFNDNYNR2SEaB0FhHs4dCHcVwXKumXpRfg1kgBJKL\nTCOJZhweWH8pDGBzKAk6GqdOT31IrhLHyjG1clUk66skQfuE6zWr60QdPgvKFGK9QhO5TVGowQh5\n6sgOEUq5o6y7RyylpxyxFpQE7LR2huHSCpdXqjA\/LlgvkiIGnwQpjRixNEodbT3VIflbVYHbVNe1\nvEsZkYarFxuNazTmtcsioFMRoXcVrK0N9vvkX\/\/Lqk5Y98rxDMjsEWOSlYG2NnyQ5HKxV\/+i+A8+\nR4xzm8WZRAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/npc_squid-1304650922.swf",
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
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_squid.js LOADED");

// generated ok 2012-09-14 13:52:28 by lizg
