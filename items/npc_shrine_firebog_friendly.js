//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Friendly";
var version = "1351536731";
var name_single = "Shrine to Friendly";
var name_plural = "Shrines to Friendly";
var article = "a";
var description = "This is a shrine to Friendly, the giant who oversees all things celestial, nocturnal, lunar, stygian and murky. Despite this, he is, as his name implies, considered by many to be the nicest of the giants and the one most likely to loan you twenty currants till payday.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_friendly";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_firebog_friendly", "npc_shrine_friendly", "npc_shrine_base", "npc"];
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

verbs.prime = { // defined by npc_shrine_base
	"name"				: "prime",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Prime the shrine as a weapon against the rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('piety_1')) {
			if (this.container.isRooked()) {
				return {state:'disabled', reason: "You need to know Piety I to prime Shrines during Rook Attacks."};
			}
			else { 
				return {state: null};
			}

			return {state:null};
		}
		if (!this.container.isRooked()) {
			return {state: 'disabled', reason: "You can prime a shrine only in the presence of enemies of imagination."};
		}
		if (!this.container.canAttack()) {
			return {state: 'disabled', reason: "You must stun the Rook using your Focusing Orb before it is vulnerable to shrine attacks."};
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return {energy_cost: 10};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var energy_loss = 10;
		if (pc.buffs_has('rook_armor')) energy_loss = energy_loss / 2;

		if(pc.metabolics_get_energy() <= energy_loss) {
			pc.sendActivity("You don't have enough energy to do that!");
			return;
		}

		this.primeStart(pc);

		var val = pc.metabolics_lose_energy(energy_loss);
		if(val) {
			self_effects.push({
				'type': 'metabolic_dec',
				'which': 'energy',
				'value': val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'prime', 'primed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.talk_to = { // defined by npc_shrine_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_item(this);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_item(this);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.donate_to = { // defined by npc_shrine_base
	"name"				: "donate to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Or, drag item to shrine",
	"get_tooltip"			: function(pc, verb, effects){

		var t = verb.tooltip;

		if (config.is_dev) {
			t += this.getFavorText(pc);
		}

		if (pc.buffs_has('extremely_hallowed')){
			t += ' <b>Triple rewards!</b>';
		}

		if (pc.buffs_has('fairly_hallowed')){
			t += ' <b>Double rewards!</b>';
		}

		return t;
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Donate {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if(this.primed) {
			var emblem_name = 'emblem_'+this.get_giant();
			
			// If we have been primed, allow our own emblems.
			if ((!stack.is_bag && !stack.hasTag('emblem') && !stack.hasTag('machine') && !stack.hasTag('no_donate')) || (stack.class_tsid == emblem_name)){
				return true;
			}
		} else {
			if (!stack.is_bag && !stack.hasTag('emblem') && !stack.hasTag('machine')){ // No bags, no emblems, no machines
				return true;
			}
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if(this.container.isRooked()) {
			if(!this.container.canAttack()) {
				return {state: 'disabled', reason: "Interference from the Rook is blocking donations."};
			} else if (!this.primed) {
				return {state: 'disabled', reason: "This shrine must be primed in order to attack the Rook."};
			} else {
				return {state: 'enabled'};
			}
		} else {
			var giant = this.get_giant();
			if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){ 
				return {state: 'disabled', reason: "Pick up your emblem first."};
			}
			else {
				return {state: 'enabled'};
			}
		}
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if(this.primed) {
				var emblem_name = 'emblem_'+this.get_giant();
			
				// If we have been primed, allow our own emblems.
				if ((!it.is_bag && !it.hasTag('emblem') && !it.hasTag('machine') && !it.hasTag('no_donate')) || (it.class_tsid == emblem_name)){ // No bags, no emblems, no machines
					uniques[it.class_tsid] = it.tsid;
				}
			} else {
				if (!it.is_bag && !it.hasTag('emblem') && !it.hasTag('machine')){ // No bags, no emblems, no machines
					uniques[it.class_tsid] = it.tsid;
				}
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have anything the "+this.name_single+" wants!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything the "+this.name_single+" wants!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if(this.container.isRooked()) {
			if(!this.container.canAttack()) {
				pc.sendActivity("Interference from the Rook prevents your donation.");
				return false;
			} else if (!this.primed) {
				pc.sendActivity("The shrine must be primed before you can attack the Rook.");
				return false;
			} else {
				return this.shrineAttack(pc,msg);
			}
		} else {
			this.conversation_end(pc, msg);
			return this.evalDonate(pc, msg);
		}
	}
};

verbs.get_emblem = { // defined by npc_shrine_base
	"name"				: "get emblem",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Retrieve your emblem",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			var temp = apiNewItemStack('emblem_'+giant, 1);
			if (pc.isBagFull(temp)){
				temp.apiDelete();
				return {state:'disabled', reason: "Your inventory is full!"};
			}

			temp.apiDelete();

			if(this.container.isRooked()) {
				return {state: 'disabled', reason: "The Rook is interfering with Shrine activity."};
			}
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var failed = !this.give_emblem(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'get an emblem from', 'got an emblem from', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.check_favor = { // defined by npc_shrine_base
	"name"				: "check favor",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "View & spend favor points",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			return {state:null};
		}
		else{
			if(this.container.isRooked()) {
				return {state: 'disabled', reason: "The Rook is interfering with Shrine activity."};
			}
			return {state:'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.check_favor(pc);
		return true;
	}
};

function getFavorText(pc){ // defined by npc_shrine_base
	var text = "";

	if (pc) { 
		var giant = this.get_giant();
		var points = pc.stats_get_favor_points(giant);
		var max = pc.stats_get_max_favor(giant);

		log.info("SHRINE: doing getFavorText,  max is "+max+" for giant "+giant);

		text += " Current favor: "+points+"/"+max;
	}


	return text;
}

function onConversation(pc, msg){ // defined by npc_shrine_base
	var conversation_runner = "conversation_run_"+msg.choice.split('-')[0];
	if (this[conversation_runner]) return this[conversation_runner](pc, msg);

	if (msg.choice == "yes"){
		this.doDonate(pc, this.pendingDonations[pc.tsid]);
	}
	else if (msg.choice === "giveEmblem") {
		this.give_emblem(pc);
		this.setAndBroadcastState('close');
	}
	else{
		this.setAndBroadcastState('close');
	}

	if (this.pendingDonations && this.pendingDonations[pc.tsid]) { 
		delete this.pendingDonations[pc.tsid];
	}

	this.conversation_end(pc, msg);
}

function onCreate(){ // defined by npc_shrine_base
	this.initInstanceProps();
	this.dir = 'right';
	this.apiSetHitBox(400, 400);
	this.apiAddHitBox("emblem", 200, 400);
	this.apiSetPlayersCollisions(true);
	this.default_state = 'closed';
	this.setAndBroadcastState('close');
	this.initInstanceProps();
	this.fsm_init();
}

function onLoad(){ // defined by npc_shrine_base
	this.apiSetHitBox(400, 400);
	this.apiSetPlayersCollisions(true);
	this.dir = 'right';

	this.apiRemoveHitBox("emblem");
	this.apiAddHitBox("emblem", 400, 400);
}

function onOverlayClicked(pc, payload){ // defined by npc_shrine_base
	if(this.primed) {
		// Stub for now. Do nothing.
	} else {
		this.primeStart(pc);
		return true;
	}
}

function onPlayerCollision(pc, hitbox){ // defined by npc_shrine_base
	if (config.is_dev) log.info(this+' collided with '+pc);

	if (pc.getQuestStatus('donate_to_all_shrines') == 'none' && !pc.shrine_announced){
		if (!pc.shrines_passed) pc.shrines_passed = {};
		if (!pc.shrines_passed[this.tsid]) pc.shrines_passed[this.tsid] = 0;
		pc.shrines_passed[this.tsid]++;

		if (pc.shrines_passed.__length == 3){
			pc.announce_vog_fade("Lo, a shrine to "+capitalize(this.get_giant())+"//Try donating something.");
			pc.shrine_announced = true;
			return;
		}
	}
	else if (this.get_giant() == 'grendaline' && pc.getQuestStatus('donate_to_all_shrines') == 'done' && pc.getQuestStatus('last_pilgrimage_of_esquibeth') == 'none'){
		
		var donate_to_all_shrines = pc.getQuestInstance('donate_to_all_shrines');
		if (donate_to_all_shrines && donate_to_all_shrines.ts_done && time() - donate_to_all_shrines.ts_done >= 30*60) pc.quests_offer('last_pilgrimage_of_esquibeth');
	}

	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}

	if ( hitbox === "emblem"){
		var giant = this.get_giant();

		if (pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))){
			var temp = apiNewItemStack('emblem_'+giant, 1);
			if (pc.isBagFull(temp)){
				temp.apiDelete();
				this.sendBubble("I have an Emblem for you, but your pack is full. Free up some space to get it!", 3000, pc);
				return;
			}

			temp.apiDelete();

			this.give_emblem(pc);
		}
	}
}

function onPlayerExit(pc){ // defined by npc_shrine_base
	this.npc_onPlayerExit(pc);

	if(this.primed && pc == this.priming_pc) {
		this.primeComplete();
	}
}

function onPrototypeChanged(){ // defined by npc_shrine_base
	this.onLoad();
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

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function npc_onPlayerExit(pc){ // defined by npc
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

function conversation_canoffer_from_the_books_of_the_giants_3(pc){ // defined by conversation auto-builder for "from_the_books_of_the_giants_3"
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "from_the_books_of_the_giants_2")){
		return true;
	}
	return false;
}

function conversation_run_from_the_books_of_the_giants_3(pc, msg, replay){ // defined by conversation auto-builder for "from_the_books_of_the_giants_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "from_the_books_of_the_giants_3";
	var conversation_title = "From the Books of the Giants";
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 3,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['from_the_books_of_the_giants_3-0-2'] = {txt: "Alertity: On.", value: 'from_the_books_of_the_giants_3-0-2'};
		this.conversation_start(pc, "Par-parrrrrrrp. Silence and alertity, Little Child of Friendly, for your daily proverb from the Epic of Friendly.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-0-2"){
		choices['1']['from_the_books_of_the_giants_3-1-2'] = {txt: "What?", value: 'from_the_books_of_the_giants_3-1-2'};
		this.conversation_reply(pc, msg, "\"Proverb 4,8: 15 - When two friends meet together, at night, in the shadow of the rook, the one bearing the greatest booze-concoction shall triumph...\"", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-1-2"){
		choices['2']['from_the_books_of_the_giants_3-2-2'] = {txt: "Huh?", value: 'from_the_books_of_the_giants_3-2-2'};
		this.conversation_reply(pc, msg, "\"...The other will be called “He who smells of very stinky cheese” by all who meet him.\"", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-2-2"){
		choices['3']['from_the_books_of_the_giants_3-3-2'] = {txt: "But...", value: 'from_the_books_of_the_giants_3-3-2'};
		this.conversation_reply(pc, msg, "“Also: never trust Zillots.”", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-3-2"){
		choices['4']['from_the_books_of_the_giants_3-4-2'] = {txt: "But what did she SAY?", value: 'from_the_books_of_the_giants_3-4-2'};
		this.conversation_reply(pc, msg, "Friendly has spoken.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-4-2"){
		choices['5']['from_the_books_of_the_giants_3-5-2'] = {txt: "You’re annoying.", value: 'from_the_books_of_the_giants_3-5-2'};
		this.conversation_reply(pc, msg, "End of proverb. Parrr-parrrrrrrp.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_3-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"from_the_books_of_the_giants_3",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"shrine",
	"firebog",
	"no_trade"
];

var responses = {
	"donated_item_tier1": [
		"C'mon, really?!?",
		"Not so hot.",
		"This verges on negligible.",
		"Friendly thought you were a better Friend than this.",
		"This is weak. Like bad, bad hooch.",
	],
	"donated_item_tier2": [
		"Passable.",
		"Hm. Other glitches are nicer, you know.",
		"See where you're coming from, friend. But bigger is better.",
		"Friends don't let Friends give mediocre donations.",
		"This? It is the warm cheap beer of donations.",
	],
	"donated_item_tier3": [
		"Getting there.",
		"Other glitches could learn a thing from you.",
		"Friendly feels friendly.",
		"For this, Friendly will raise a glass in your honour.",
		"This is an act of glorious altruism.",
	],
	"donated_item_tier4": [
		"YES, Friend. This is more like it.",
		"Now we're talking. Now this is a party.",
		"Friendly will remember you fondly and often for this.",
		"Hot stuff, little Friend.",
		"Friendly will drink to you. Heavily.",
	],
	"super_donation_20x_xp": [
		"Drinks are on Friendly. Metaphorical drinks.",
		"Yes! Party like it is Year 19, little Friend.  Or Year 9999! Whatever!",
		"A toast! A toast to you, firm friend of Friendly.",
	],
	"super_donation_5x_xp": [
		"A little extra in your glass of life.",
		"An extra pour for you.",
		"A little chaser for your generosity.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-83,"y":-212,"w":167,"h":213},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALYUlEQVR42s2YCWyT5xnH2aG1QO47\nJj4Tx7cT547t4FzkThwMIYHcHCEkkOAEyAmmjIaUQgPhaIBASE0gRSMuUKANCVa7TWMtG9IOtVtV\nea12VGMSYmq1Tp303\/N+bkKqURpnnTRLjz7783v8vv\/zvM\/7vN+iRU\/47CpcVrt7pdjZUypydhUL\nHdYVYaZF3\/Knu0hgY+Mz6yzmOz2a40id6ovRZjVGNiswWBuNHRaR7dsGPFEnxfAGGU7Wy9C3RoKa\n9LD5zXGsMWfkx0fTMfmiCY79BvRVSFGSEvGtAxYnRjysMApQphcgL24ZDKrQgXl1\/NlJ01\/uDWXh\n3ZczcY0g6zMESFOHO1PkYTay2mSlyBwv8ff1FEivCBemagQDyQqeg8YZ6SgSuZ4vE2F8mwpHKqWo\nTg2an4tvH0xy3T1dgLsnM\/DWoAnnGhSwro3iOhemG2oLMw2uFLXE9tbNUzkXTvZ+3FJXcO3Bh1Nj\n9+6cH5s4\/\/zYB7+Y4Ix9f2fq3Hh2omogM0ntSJWHmQqXJw6k6xM4b\/SXi519q0UYa1LgSJUUlsxw\n4bwA7VuNMfsbJa5DrWLc7tZibItyFtCck+4iQ3KcxvHZg7vx\/3zw83vfZAWZRltpTsZD1r8gM22k\nMDMNybEa85l6mXOoRoLRTTLsLRXBI3dYChVv7K0R4c4eHS41q2YBVxdku3KWp95PTYhxzgB+9Ovr\nvxo73vunGaB70+ff\/yqgXliUbbrPxV22yVGUtdxlSIgdOL9R7ry9UwN7oxx7LWLPANNT4l11RSmY\n7o4lQCU6yiRczJWsSG\/Nzo73TdKpYmYA37528oOuzZbPZiCttYWfzwVk\/Vgfrn9Oem1+RpopPl7i\ne75BMTC1S4PXtmtwuFY2f8DkWG1rfroBlvwstK3UYpzSzZPazXXxe3cv\/3ZGvaY12V\/8zTV9n9kM\n4BNDqUFum+7UYKJVjcNV0a55AxqSdMyND8vz9KjPj8XFRuU3AjI3vzF+yMVUHD7Y9glTdUZR\/PU3\nXl8HyBS8Qqv4cEWkc96AqTqNqaVEX7E5X4XjNVGci58GyECea133dwbGvl85u\/\/juS5m7Z4I2Ki0\nsRh0bCcFq6VOj2LQmh9hOr0+Gjfa1ORi1Tcq+DT7esDHLu5ZHekZYN9aU+rwJjkmyQVfB\/ikz7mG\n+rhzm+uk82k7utHtYgZ4oNJDBe3NDXEXKPZud2jw6tb\/XCS3+rONzmNG21CHznlml\/6PZ3caHtk7\nUj49uU2Dc+2Jn9t3GR9d7Ex7ZN9jeN\/RnzJCbVunj+u\/kohHKQYn29XuRVIv9wyQKWGnQsGxTYn+\nNY9z1O1T8b4M7OzO+AfrcwWwpIaj0sjDxowINK0QYGuOADuKxNhJ1rMyEr2lkeii68iOWNzsT3v\/\nqi0rb24MTpEAV1oIsE62AAW3qDDRokRfmRuQKXBn0ODq26RAriYIpQkhKEsOQ5XBDdiYxUdLnpAD\n3FUk4QB7SulqlmBfmRQv1kSDHg63+jM72XhnycXD66XuPLhQwKnOmNkYXGOQFNh7dNwkp9u0eIHK\nsPYCASoN4diQ7lZwe\/6XgMUSdBEYU\/BovRzn22MxfTAZky\/pMWxN+pSNN1QfM3RwjWjhgGPNbsBL\nTUqcaCrzKogPctSlheJobSSu7tZhkiZksE+1QQOmXkjC5IEEOCilHFsrQUN6OKqTBcbRhpSrzMVc\nmqmTew54kRbHVIcWl6hY6CqOMBXEBY7UGEPRv1qA8xulmGhT4laPFpdblbhq1eCGVY03d2hwe5cW\ntyj4r9HvO\/viMLUnBjd7NLi8VY4z1RI0EqBF5ycc3Sx3col6ITHIFgmnYAerZhTYty5ypD57mXOd\nPhgHVgkwSoBX2pXcxJeaFZggFW60a3FjuwqTpMrrFLuvt2nwJsFN9tL9LsoGW2QYLBejMTMcB8tE\nphN10fdn0syL1QuJQXLt5C4q+6kcukmqXNqqhCUxEPtW8jFcH4nL2+S4Tv9fpHru8lYVHKTEdaYk\nqXid4K61azDJ1OtQ4loHJXwCPFQmpNJKQO3UsDfJMePiQ7UeAzZzCjI1GOB+i3J4qMbYVpYU9m5H\nEQ8nqsW0R8sxYVXgAk3Eis5xUnqCIJm7mSo\/2kaqdhMsKc3C4RVSvStvGfaWaJ9nYx2rUP2D5cEF\nxeD+MmObvVHBAb5KE7EYZPdXJAaZNqSFUBwKMUIpgsXVyGYZztFDsPZjZOOk5kWCpTzHKTdBSl\/a\nIsdQJbnXFDYLMrIp4dHkDneiPlolXSAgt9XRXlnMNz8+7AQ5Owt5GFgr5hbLmQ1SnKCUc2YDA6WU\nQgn+LH1nvx2k3sWGaO5heov4WDvn3GHfkvDpna6YhQH2lZvaXlgXyRULbKvrLX187MykFbjWGPxw\nD8XSUYIcXCfGATo2HqaDz9GqKByrdl+P10aRojKcppXbt0qI6uXhs6e2Uw1V4ReaVLjTqcVrFK8L\nUrDHLIDDquIU7C4RfOXYmZEUElOTFvKwm+LxAC2aDlJnD50rnrOIsG+V+\/oSLYgTVWLsL+WjXB\/q\nmNv\/VD1tpRQCbJG8XBeN3mKhh4Ck4OmNci5RsxicAVwWuLRWFOTtVPN8ECfwhTkhCNaccFhzI7Al\nk4dtK3hozeVjew4Pewm+PZ+HQk0A9BI\/lyjYayDCz8s0u9dTCN2mGGSAtlKR54B2WsXjtELZVtdb\nIrKxwSMCvZEV7Q9FqBeigr1QpAqEcpk3EiN9kK3yxwptALLIUiK9oRawNksgo7aJ9DD5igAIg7zB\nxmFpzL7lSxfTVtdfEeUZ4D5yMUsz7oJVjQ6zyBkR4GVjgMkiP2RK\/RHP94Fe7AujxA\/yUG+IApeA\nH7AEEf6LIaBrVPBSaHnenJmi\/DhASQgBBno5uorlRQyQFawszQxUeghoW5XSxoqF6e4YbpH0UIzI\nQ3xsIqYAQbKJtBG+SIv0x3IyBvwkY\/+xB9Lxfbk+rH9UsLdzf7mxjS0SlmYY4JHKBSjI9mIGeLlF\nw1axUxnmY1OG+ZJaPhDTRIJAN+zTjLVhUNIQH64f668I9XXs49KYklOQuXjAUxd3mZWdM3vxOC2S\nnWYRJP6LfAlyhE2yUGNwivBnhdvzBDZyK+02CrxmZWnGQ8CdhbKhMQKbIgUZYEuhYLaqToj0MyeT\n+2IEvvdVPJ+HKoqxucZcHysMgJbvx\/3W8HwdKbSwjIpAlmq+x8ZggJQZKMFHUaGhwZGqKJdnCpZo\nr75CaYABDtVHw5rPnwVcnSYY3JQrwmq9sMmg8IdOvBixIrfpyGKEi5GjC0Y5FbLsHuuzXBviqs0W\nob\/B\/Yaiu1QztruU8mRNJO3nGgxWR3v26qPXortqpyCe7o1Ff7kE2yjPsX2YeytVrRw5XK\/C1ryo\npjSlH1KjvZCt9kWW2g\/ZGn9kkW3MpMS9JhoJkqX0AM8K8+ODW\/uqlGhfJW11K8h3nqQHv2alIoKK\njqO0+3gE2GnWjNmpUJ3qicVwgwLtRQKoonxy2X9MiZZi2TvNBWJhmtz7JzkEZEkixfQhWEsF7aqU\nEGzIovK\/VIqCxBAkiJaYVxmUqkpTBGzlMu4l0vZcvmOUxn2DdirbShEnAt1ePG\/A5sxw4ekN8t8z\nF1+iGFwRG\/g7ur0uNyYwyVosxg8r4o6IKdgNMn+UpQajwhCGalM46jN4qKcdhQHaKuXYTGcUNd\/7\nz9TXv3K5+lBxUsSVL8ePowLDdbNFgdPro\/9VmhTyU7qdttC3tSywvzPndxhZMPsiDfN6O17sj\/zY\nYJgTQ1FCVhxPp71UHnrK5TAn8xDu98wENdWRffcJY7Nxv7\/of\/lZ5veD3aKgJb8UBi5+TxCw+EN+\nwOKPdGKfT5ryBLBaov5ATVLIvBf9n3yeIVuaoQ2SrUuPsFn0YU3\/7YD\/BsSr01l9IBrXAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291930326-9795.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
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
	"shrine",
	"firebog",
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "check_favor",
	"e"	: "debug",
	"o"	: "donate_to",
	"g"	: "get_emblem",
	"v"	: "give_cubimal",
	"h"	: "prime",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_shrine_firebog_friendly.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
