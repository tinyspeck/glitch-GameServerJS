//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Juju Bandit";
var version = "1344982233";
var name_single = "Juju Bandit";
var name_plural = "Juju Bandits";
var article = "a";
var description = "The scourge of the Baqala, the Juju Bandits roam the ancestral lands with an insatiable hunger for other people's stuff. Particularly fond of paper, a Juju bandit can be outfoxed, outrun, or outsmarted with teleportation.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_juju_bandit", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_distance"	: "75"	// defined by npc_juju_bandit
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.variant = "red";	// defined by npc_juju_bandit
	this.instanceProps.bandana = "blue";	// defined by npc_juju_bandit
	this.instanceProps.talk_state = "walk_end";	// defined by npc_juju_bandit
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	variant : ["The colour variant of this juju"],
	bandana : ["The bandana colour of the juju"],
	talk_state : ["Item state to play during conversations"],
};

var instancePropsChoices = {
	ai_debug : [""],
	variant : [""],
	bandana : [""],
	talk_state : [""],
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

function alertPlayer(){ // defined by npc_juju_bandit
	if (this.pc) {
		if (this.offering_quest) {
			this.pc.sendActivity("One of the notorious Juju Bandits has appeared, and he… needs your help?");
		} else {
			this.pc.sendActivity("One of the notorious Juju Bandits has appeared, and he's got his eye on your stuff!");
		}
	}
}

function appear(){ // defined by npc_juju_bandit
	if (this.pc) {
		this.apiSetTimer('alertPlayer', 500);

		this.player_start_x = this.pc.x;

		this.apiSetTimer('makeDeclaration', 1500);
	}

	this.is_spawning = true;
	this.visible = true;
	this.setAndBroadcastState('spawn');
	this.container.announce_sound_to_all('JUJU_BANDIT_SPAWN');
}

function deleteItem(){ // defined by npc_juju_bandit
	if(this.itemstack) {
		if(this.itemstack.container != this.container) {
			// Picking up the dropped item.
			var stack = this.pc.removeItemStackClass(this.item_class, 1);
			if(stack) {
				stack.apiDelete();
			}
		} else {
			this.itemstack.apiDelete();
		}
	}
}

function escape(){ // defined by npc_juju_bandit
	this.apiSetTimer('apiDelete', 1500);
	this.setAndBroadcastState('shrink');
	this.container.announce_sound_to_all('JUJU_BANDIT_SHRINK');
}

function getTarget(){ // defined by npc_juju_bandit
	return this.pc;
}

function giveQuest(pc){ // defined by npc_juju_bandit
	if (pc != this.pc || !this.ready_to_steal) {
		return;
	}

	log.info("Juju bandit give quest");
	this.done = true;
	this.apiCancelTimer('targetFollow');
	this.apiCancelTimer('makeDeclaration');
	this.stopMoving();

	this.setAvailableQuests([
		'help_juju_bandits'
	]);


	this.offerQuests(pc);
}

function isNearSignpost(){ // defined by npc_juju_bandit
	if (!this.pc || this.target != 'player') {
		return;
	}

	// Get signposts
	var signposts = this.container.geo_links_get_all_signposts();

	for (var i in signposts) {
		var signpost = signposts[i];

		// Within an arbitrary distance of a signpost
		if (Math.abs(this.pc.x - signpost.signpost_x) < 200 && Math.abs(this.pc.y - signpost.signpost_y) < 200) {
			return true;
		}
	}

	return false;
}

function makeDeclaration(){ // defined by npc_juju_bandit
	this.apiCancelTimer('targetFollow');
	this.stopMoving();

	// are we really close? If so, steal from player. Don't do this if we're just spawning
	if(Math.abs(this.pc.x - this.x) <= 50 && Math.abs(this.pc.y - this.y) <= 50 && !this.is_spawning) {
		if (this.offering_quest) {
			this.giveQuest(this.pc);
		} else {
			this.stealItem(this.pc);
		}
		return;
	}


	if (this.offering_quest) {
		var jibber_jabber = [
			this.pc.label+"! The Juju Bandits need your help.",
			"We need your help, "+this.pc.label+"!",
			"When the fearsome Juju Bandits request your help, "+this.pc.label+", you don’t refuse.",
			"Come with me if you want to live, "+this.pc.label+".",
			"If you don’t help us, you’ll regret it!",
			"Our boss wants to see you, "+this.pc.label+", which means you get seen, or else…",
			"If you know what’s good for you, you’ll follow me to the secret lair of the Juju Bandits!"
		];
	} else {
		var jibber_jabber = [
			this.pc.label+"! I know you have "+this.item_string+" and I'm coming to get it!",
			"Your "+this.item_plural+" or your life, "+this.pc.label+"!",
			"This'll teach you to mess with the Juju Bandits, "+this.pc.label+". We're coming for your "+this.item_plural+"!",
			"I'll get you, "+this.pc.label+", and your little "+this.item_name+" too!",
			"When the Juju Boss asks for "+this.item_string+" then "+this.item_string+" she'll get, "+this.pc.label+"!",
			"You can't stop us from getting your "+this.item_plural+", "+this.pc.label+"!",
			this.pc.label+", I have a riddle for you—what's gelatinous and hecka' mean and about to steal your "+this.item_plural+"? Hint: you're looking at him!",
			this.pc.label+", give us your "+this.item_plural+" and we sort of maybe promise that no one gets hurt too bad!"
		];
	}

	this.sendBubble(choose_one(jibber_jabber));

	this.apiSetTimer('targetFollow', 3000);
	this.apiSetTimer('makeDeclaration', 15000 + Math.random() * 5000);
}

function make_config(){ // defined by npc_juju_bandit
	return {variant: this.getInstanceProp('variant'), bandana: this.getInstanceProp('bandana')};
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_juju_bandit
	if(!oldContainer && newContainer) {
		this.appear();
		if (newContainer.isInstance()) {
			this.npc_walk_speed = 150;
		}
	}
}

function onConversationEnding(pc){ // defined by npc_juju_bandit
	// Did we give out the quest successfully?

	var q = pc.getQuestInstance('help_juju_bandits');

	if (q) {
		var variant = this.getInstanceProp('variant');
		q.setJujuBanditColor(variant);
		this.escape();
	} else {
		this.rageQuit();
	}
}

function onCreate(){ // defined by npc_juju_bandit
	this.initInstanceProps();
	var colours = ['red', 'green', 'yellow'];
	var bandanas = ['blue', 'black', 'red'];

	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = true;
	this.npc_walk_speed = 75;
	this.item_width = 50;
	this.item_height = 50;

	this.apiSetHitBox(50,50);

	this.setInstanceProp('variant', choose_one(colours));
	this.setInstanceProp('bandana', choose_one(bandanas));

	this.target = 'player';
}

function onPathing(args){ // defined by npc_juju_bandit
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		this.stopMoving();
	}
	if (args.status == 1){
		if (args.dir == 'left'){
			this.setAndBroadcastState('walk');
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.setAndBroadcastState('walk');
			this.dir = 'right';
		}
	}
}

function onPlayerCollision(pc){ // defined by npc_juju_bandit
	if(pc == this.pc && this.target == 'player' && !this.done) {
		if (this.offering_quest) {
			this.giveQuest(pc);
		} else {
			this.stealItem(pc);
		}
	}
}

function onPlayerExit(pc){ // defined by npc_juju_bandit
	if(pc == this.pc) {
		this.rageQuit();
	}
}

function pathTo(x, y){ // defined by npc_juju_bandit
	if (x < this.x) {
		this.dir = 'left';
	} else {
		this.dir = 'right';
	}
	this.setAndBroadcastState('walk');
	this.apiFindPath(x, y, 0, 'onPathing');
}

function rageQuit(){ // defined by npc_juju_bandit
	this.sendBubble("You haven't seen the last of the Juju Bandits!");
	this.apiCancelTimer('targetFollow');
	this.stopMoving();

	if (this.pc) {
		this.pc.achievements_increment('juju_bandits', 'escaped');
	}


	this.setAndBroadcastState('idle2');
	this.apiSetTimer('escape', 2500);
}

function setOfferQuest(value){ // defined by npc_juju_bandit
	this.offering_quest = value;
}

function setParams(pc, item_class){ // defined by npc_juju_bandit
	this.pc = pc;
	this.item_class = item_class;

	if(item_class) {
		var proto = apiFindItemPrototype(item_class);
		this.item_name = proto.name_single;
		this.item_plural = proto.name_plural;
		this.item_article = proto.article;

		this.item_string = proto.article+" "+proto.name_single;
	}

	if(this.pc.x < this.x) {
		this.dir = 'left';
	} else {
		this.dir = 'right';
	}

	if(this.container) {
		this.appear();
	}
}

function stealItem(pc){ // defined by npc_juju_bandit
	if(pc != this.pc || this.container != pc.location || !this.ready_to_steal || this.stolen || this.offering_quest) {
		return;
	}

	if(pc.isMovingStreets() || this.isNearSignpost()) {
		this.rageQuit();
		return;
	}

	if(this.target == 'player') {
		var stacks = pc.takeItemsFromBag(this.item_class, 1);

		if(!stacks || num_keys(stacks) == 0) {
			this.switchTargets();
			return;
		}

		this.itemstack = stacks[0];
		this.stolen = true;

		apiLogAction('ITEMSTACK_STEAL', 'pc='+pc.tsid,'loc='+this.container.tsid,'itemstack='+this.itemstack.tsid);

		this.pc.sendActivity("Oh no! The Juju Bandit has stolen one of your "+this.item_plural+".");

		this.container.apiPutItemIntoPosition(this.itemstack, this.x, this.y);
		this.apiCancelTimer('makeDeclaration');
		this.apiCancelTimer('targetFollow');
		this.stopMoving();

		this.apiSetTimer('deleteItem', 1500);
	} else {
		// Else delete target item
		this.stolen = true;

		apiLogAction('ITEMSTACK_STEAL', 'pc='+pc.tsid,'loc='+this.container.tsid,'itemstack='+this.target_item.tsid);
		this.pc.sendActivity("Oh no! The Juju Bandit has stolen one of your "+this.item_plural+".");

		this.target_item.apiDelete();
		this.apiCancelTimer('makeDeclaration');
		this.apiCancelTimer('targetFollow');
		this.stopMoving();	
	}

	this.setAndBroadcastState('swipe');
	this.sendBubble("Got it! The Juju Bandits strike again!");

	this.apiSetTimer('escape', 2500);
}

function stopMoving(){ // defined by npc_juju_bandit
	log.info("Juju bandit stop moving.");
	if(this.state == 'walk') {
		this.setAndBroadcastState('walk_end');
	} else {
		this.setAndBroadcastState('idle1');
	}
	this.apiStopMoving();
}

function switchTargets(){ // defined by npc_juju_bandit
	if(this.target == 'player') {
		// Cannot steal from player for some reason. Look for matching item stacks on the ground.
		this.target = 'item';
		this.target_item = null;
		var items = this.container.getItems();
		var item_distance = -1;

		for (var i in items) {
			if (items[i].class_tsid == this.item_class && (Math.abs(this.x - items[i].x) < item_distance || item_distance == -1)) {	
				this.target_item = items[i];
				item_distance = Math.abs(this.x - items[i].x);
			}
		}

		if(this.target_item) {
			// Found one on the ground. Go get it!
			this.sendBubble("Aha! There's one over there.");

			this.targetFollow();
			return;
		} else {
			this.rageQuit();
		}
	} else {
		if(this.target_item) {
			delete this.target_item;
		}
		this.target = 'player';
		this.sendBubble("Aha! You've got one.");

		this.targetFollow();
	}
}

function targetFollow(){ // defined by npc_juju_bandit
	log.info("Juju bandit following target");
	this.ready_to_steal = true;

	if(!this.pc || this.done) {
		return;
	}

	if (this.is_spawning) {
		var player_move = Math.abs(this.pc.x - this.player_start_x);
		if (player_move <= 25) {
			this.apiCancelTimer('targetFollow');
			this.apiSetTimer('targetFollow', 500);
			return;
		} else {
			this.is_spawning = false;
		}
	}

	if (this.target == 'player') {
		// are we really close? If so, steal from player
		if(Math.abs(this.pc.x - this.x) <= 50 && Math.abs(this.pc.y - this.y) <= 50) {
			if (this.offering_quest) {
				this.giveQuest(this.pc);
			} else {
				this.stealItem(this.pc);
			}
			return;
		}

		if(Math.abs(this.pc.x - this.x) < 50) {
			this.apiSetTimer('targetFollow', 500);
		}

		this.followingPlayer = true;
		this.apiFindPath(this.pc.x, this.pc.y, 0, 'onPathing');

	} else {
		if (!this.target_item) {
			this.rageQuit();
			return;
		} else if (this.target_item.container != this.container) {
			this.switchTargets();
			return;
		}

		if(Math.abs(this.target_item.x - this.x) <= 50 && Math.abs(this.target_item.y - this.y) <= 50) {
			this.stealItem(this.pc);
			return;
		}

		this.followingPlayer = true;
		this.apiFindPath(this.target_item.x, this.target_item.y, 0, 'onPathing');
	}

	this.apiSetTimer('targetFollow', 1000);
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

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
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

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
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
	out.push([2, "Juju Bandits can be evaded by acrobatic manuevers, or by leaving the area."]);
	return out;
}

var tags = [
	"no_trade",
	"npc-other"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-49,"y":-80,"w":94,"h":74},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHBklEQVR42u2Y609b5x3H82ZTVy62\nwVxsY3zBNjYG2+ALvmAMhpJwi50QIFwdwi0hBNOEcMnNGdma7MXCi01q02yz1mUXaVLYm1VpNcXd\nWrGka+ZsWlYlEVg0lISr\/4C9+O73nAWJJa2mTYVGGo\/01XN8jnSeD9\/fc\/kedu36f2uVu5Q87ysK\n2UsBU5WgMFYlq0KBLMt0NV8dr+apUcfXoDE1D4F0I6f+THNkQGSenshyeMYEZt62wf3A2hSu4qmw\nWQcI7IioCINiC4YlNpzIKsao1IHxbCcua3fjmqUxfkbk3Hp3x6RO3ympHYczTNifooM\/RYu9glzU\nk1rS8tGVacThTBN6SCMyJ26U92La24fv6XZjLNsR3HLAvsyi0DlFKX5V2oVrtma8kbcHo0o3jorN\nOCIuQv8zHSMnrxjqcV7jxZDEiglyclheObXlgIcyjJERcvDn7gCizRcQ0lSgOU2Pvam5qEvVoDZF\nzamerv1CLRrT8nBMYsFpmYsAXZEtB2wQ6CKBdAN+4mhFpO4kGoU61BBQlSAHFQIlvHwFvNS\/Rr\/3\npKg40ECGgQPskXuiXylMjZjva5SnBJsVfOPGPZ9Ayw34I3sL3qsegpenQBmplC\/Hfo0F7UorKlPV\ncPNkKCPYkdxyHK\/wcy4ekzvxlcGtr6\/z2r0lF3zZAtRK+GjITgmX8BOMAzIHOjIK8PYzwNJkOQfj\nSM7GYXM53vvdu2jIscBOv110v99ehfAb30ePqBAT2kqYzVf\/bbuZmbnlmZ2d\/e+2oMXFRdna2lr8\nb3++d8XE+2a8OOVbKEtPRFuOEJ0SE1rS83HVfpADdBIIg7MmSTHkP4iP791Bq6calqQsgpRiPNCL\nX751De3pBbhkqEOHsMCzeaxPPv4o+ujB\/dB\/dGt1dTVAUCHqfaxfW13D08+f+vQJ3zCWpCVE67L4\n2CsVwEcTv4kmPpuD110dcBBYMYEUJUpwpqETH8xEcMBSxv22EmRnyW78+mfXcSBNh7dp1ZcmyAMb\n4\/7h1k3fvegn8dnZR9NPnjzxrKyscFpff87RpaUlI0FNEVyEYLG+vobVlRXMPXj4j9O1ZZ8y5\/ZR\nqfdI+JGOPCWaJVrOPQZYnCiFjSBdyTJc7OzHjV9chylRzAEyF1n5fzpxEd0iE65aDqBBlhNjY966\nedN4+4+\/x6d\/\/ys+m4\/h8fzjOBuf6QUHGfUz9yJ0HWOAiwuLWHy8iJnffojX0oRTrtSEwJDYFqqX\nZ6BJIcQJsxGTBjesCVmwJf8LskFjRa26CIWbAFn5A7R5n1G4cMnsQchr4RbK3Zk7Sx\/d+gDRO3ex\nsPAY9+\/ejxHDNCn4goPkWpweREnh5eVlDnBlaRkL8wu4\/f5t9GaYuBPgoDAvZEvKRJM6jYNs10lw\notSIQzoF+gy5aNdqcUiv59RNOq43oDM3FxNOK75TZcclvweTvnL0ZJh8H954F9G7f8Lc3CNy7zPM\nPZyLsCoyFjbdXigxEz1gfwVX4uWnS3jwl4efT9Z20wsL4+ylran6cA1fjQ6pCo05KWgjwA5NBnr0\nYhw356C\/IAvdOjEm61y4TDCX\/aW40lzFXZ8tN2Gy3oUubS56M4voKCyMvf\/Ob2rm52NBGntqw6Qv\nXSjPFsc06zff7840BdgLN4udw++UtaDPpEIgT4LDOhH6CG7QJMPrZiVO2VSYsOfinEvHiV1PVhfj\nh32N8PCkOCqyRLpFhbIvWqj\/057Ym1no6aEzuCFFF6uhSOVOlGHK5MdpjQc+pRBBdwGOFioxYMzG\nMAO0qnDSpiZpcKpYgzESAxyhspclKcACx5Ycc94kJUyviAlQzgUAyoEoelWEhjwxxqqsOFftwPFC\nBU5acjBKgON2DafTJXqcp+dnVS4M0GLZslTDHKQ0g3BxCxehBrPtsL8qhSMxC36FCEfMCoySm8Ei\nBZU6ByPkJNPZKhteNxm4bel8QQ1YgN0SQFbq3TxVfIBFqfxahFRlIGi0pxVgkM7aLrkGXfliXKh1\nYtxjwDCBjtD8G68w403LfoQdbdgn0EW3NrBSdC9LlE\/V0lxkJXcnyLCHEnWQSs5i2HC2Ge0aCUa9\nJoQINEgL5rsFFRiXl8Sahfqtz4ObG4vwrcL8aZZwCDhGoBFyOMJ6f0769JBTiy6FKjImsRm\/to8n\nWtUh5ibrn3\/mF2fHvuj+SwFYKVDyvgx8mwHVUQZCW07wufvhdjqDv22piw6794YFZiVv2+FKRLlB\nFgQGpVZ0q2zxNmVRuFChk9XwFbKD9J0SUrlxnnSRUvWP3W3x9nT99s1FBkIhNH5SRt+\/CgfGFE5O\nx2TWuDtLN9UkzIu2UrDdUFu6IbqPr9k+wIo0dZB9E2+G2FBDal7spfj3Byslzb8AWwgben4u7rSd\nttN22k7baV9f+yd+qOcTX6YwGgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_juju_bandit-1342634516.swf",
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
	"no_trade",
	"npc-other"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_juju_bandit.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
