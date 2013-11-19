//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Cosma";
var version = "1351536731";
var name_single = "Shrine to Cosma";
var name_plural = "Shrines to Cosma";
var article = "a";
var description = "This is a shrine to Cosma. As the giant who governs the sky, Cosma is also the giant of levity and meditation. She is, also, the only giant capable of herding butterflies.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_cosma", "npc_shrine_base", "npc"];
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

function getFurnitureBaseGeo(){ // defined by npc_shrine_cosma
	//
	// this code generated by the furniture plat editor - do not overwrite!
	//

	return { 'plats': null,
	         'walls': null
	};
}

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

function conversation_canoffer_from_the_books_of_the_giants_2(pc){ // defined by conversation auto-builder for "from_the_books_of_the_giants_2"
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "from_the_books_of_the_giants_1")){
			return true;
	}
	return false;
}

function conversation_run_from_the_books_of_the_giants_2(pc, msg, replay){ // defined by conversation auto-builder for "from_the_books_of_the_giants_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "from_the_books_of_the_giants_2";
	var conversation_title = "From the Books of the Giants";
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 2,
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
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['from_the_books_of_the_giants_2-0-2'] = {txt: "Namaste.", value: 'from_the_books_of_the_giants_2-0-2'};
		this.conversation_start(pc, "Namaste, Cosmapolitan.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-0-2"){
		choices['1']['from_the_books_of_the_giants_2-1-2'] = {txt: "Um...", value: 'from_the_books_of_the_giants_2-1-2'};
		this.conversation_reply(pc, msg, "Please prepare for the daily salute to Cosma. Raise your arms, and assume the position.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-1-2"){
		choices['2']['from_the_books_of_the_giants_2-2-2'] = {txt: "Om.", value: 'from_the_books_of_the_giants_2-2-2'};
		this.conversation_reply(pc, msg, "Appreciate the silence. ...", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-2-2"){
		choices['3']['from_the_books_of_the_giants_2-3-2'] = {txt: "Um...", value: 'from_the_books_of_the_giants_2-3-2'};
		this.conversation_reply(pc, msg, "Give thanks for the circulartude of the still, quiet airiness around you.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-3-2"){
		choices['4']['from_the_books_of_the_giants_2-4-2'] = {txt: "...", value: 'from_the_books_of_the_giants_2-4-2'};
		this.conversation_reply(pc, msg, "Aaaaaand Shhhhh.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-4-2"){
		choices['5']['from_the_books_of_the_giants_2-5-2'] = {txt: "...", value: 'from_the_books_of_the_giants_2-5-2'};
		this.conversation_reply(pc, msg, "...", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-5-2"){
		choices['6']['from_the_books_of_the_giants_2-6-2'] = {txt: "Ahhhh.", value: 'from_the_books_of_the_giants_2-6-2'};
		this.conversation_reply(pc, msg, "Aaaaaaaand, come back to center. Your salute to Cosma is done for today.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_2-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"from_the_books_of_the_giants_2",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"shrine",
	"no_trade"
];

var responses = {
	"donated_item_tier1": [
		"As the pebble sinks, so this donation reaches Cosma's heart.",
		"Like the sun rising behind a raincloud is this donation to Cosma.",
		"Like a flower with a cough, so sad is this little donation to Cosma.",
		"Like a sock that is wet, is this sad little donation to Cosma.",
		"This donation is to Cosma what no rainbow at all is to a wet day.",
	],
	"donated_item_tier2": [
		"As the fart rises, so this donation reaches Cosma's heart.",
		"Like the sun rising on a boggy swamp is this donation to Cosma.",
		"The wind carries to you Cosma's middling gratitude.",
		"To Cosma this donation is but an imaginary rainbow on a wet day.",
		"Like a hat that is ugly, is this mediocre donation to Cosma.",
	],
	"donated_item_tier3": [
		"As the feather floats, so this donation reaches Cosma.",
		"Like the sun rising on a forest glade is this donation to Cosma.",
		"The wind carries to you Cosma's considerable gratitude.",
		"This donation is to Cosma what a beautiful rainbow is to a wet day.",
		"Like a cloud that is fluffy is this moderate donation to Cosma.",
	],
	"donated_item_tier4": [
		"As the grumpy butterfly soars, so this donation reaches Cosma.",
		"Like the sun rising on a glorious mountain is this donation to Cosma.",
		"The wind carries to you Cosma's enormous gratitude.",
		"A HUGE double rainbow on a dark day is this donation unto Cosma.",
		"Like eleventy-thousand tickling feathers is this donation to Cosma.",
	],
	"super_donation_20x_xp": [
		"The glorious wind of Cosma's gratitude has blown upon you. Hard.",
		"The happy breath of Cosma super-blesses you.",
		"The warm wind of Cosma's gratitude has blown up your underthings.",
	],
	"super_donation_5x_xp": [
		"Cosma bestows upon you a breath of bonusness",
		"Cosma's breath blesses you.",
		"The soft wind of Cosma's gratitude blows upon you.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-76,"y":-143,"w":151,"h":144},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK5klEQVR42t2Y+VPU9xnH80ObaTqZ\nIKBG1ERrmzTTtNKESA5jJIlXjImiAeQwBOQ+BFbu+9oLFpZjl2WBPViOZblZboisGtSqRNK0aRMz\nqZ3pTH91Jv\/Au8\/zwe\/OGknFxPzQ7szD97v7\/e5+X5\/neD\/Ph0ce+X9\/fbM07\/X1tam9kn21NBX9\n9fXpMs\/P2H5SCOnBLqdF22\/SLE\/YWzDpMGC6vxUzA62YHTRibqgNHw+349xoBxbGTHA5zTg\/bsHF\nCSs+mezE4rQNl2a6cHmWbKbrNp27\/n5lXCzkHzcmtz0wFAN9dW3SNTvYBouuGqqSTNSUy6CpzIa2\nOheNynzo1IVoqS2Csb6E3hfA1FgOq74KNoMcPUYF7B0q9JtrMGjV0HkNOg1qjPY0Yqq\/GTODeswP\nG3B+ogPXz\/Xii8vOWzevTVrWBMthu3l9Cn+9NAZVaRbkRWfuC9jeUAZzU8X3Ao501WOspwHj9rsB\nz40ZydPtuHHeAX7mV9entPcFNKpUXlfnevH10jSWzw\/SQ+pQX5WD7LRYVOSnQsHApZmoLT+Luqps\nNCpy0awqELCtEmwzwbZUobtVjt52FRx3QIdtBNrbgKkBnQC8PGvDZxcHBNzfrjihUxbcH9BcX7F3\nsEODjweMuLHQj28+nSabET\/yl8VR2FqU9GAVeakG9vZaGGpL0Cy8WUKAZQRYQYBV6GxRiPuGuxox\nSzk6P9JBOWqiXOwWv8X2z8\/m8OeLQ5joaUbBmRhkJka61uTBAXowQ0o20d2MC2NmLC84sDRvx82r\n4\/jX5\/P49xcLa7ab18ax9LEdi1Q4rpF29BgU0JRluS0rMRKZCZHaNRVJt17u8gT8odbfVoNuvQIm\nbfld5gnGVlOSIQCz4sPXJkkdmuptPXrlQ4Fkux8gh7dEFm95YLkx1hSPdFBeWSiv2BsPCsapYmuu\nvgtOTwUlgZVnJyI9NgyJUcH+P0ikVao8L0257FZ1XgqqyFRUwc3yPGhJbjh0fa3qVc1uUKFLJ4eZ\nFiaB6UialPR9WWKUgEqO\/gBxkcGICX8\/+kd1krpKmX99uey2nsS4vuIs1JQv6uIMWn0Sh8VtxVlx\nyE\/\/CDkpHyI7+RRkSVF3WRpBpZ8+iTNx4SLf+DwtNrTsobQ7CpdLW0GaR3pYQ6LNoKsZh01VfAa1\ndOT3yqJ0VOYlu01emIZmEnotaSgvKCshMvphAd6upa7C4a0tyYKy8Iw7jwQQCTdXogRaR11HOkpw\nNXSPTpGPNtbN6jzx3cyEiIfjQUp2bWNVLuQFaVAUpItc5GN+egxKZQmoyElCRW6SgJVM8l5BRqzI\n3xZKEY4Aw+kJVHhwrbKyltewuX7vkKnOv7Ox4qipvlwAcrKTF5AaE4rTEce+14ozTgvA3NTo5bOn\nI7a1KAr2UrH4\/yTjV2+LYpk9WJWbAkVhOlpri0WFNlBfrq+Q3aNxmjv5yIArYV1jt\/ixBaMpk6GH\n+m1nU5WQFpYdS2OlW1aMmhIYaooEPMsSF5eyLAlJqYctDx3qRN72jP3Jm0S+UJhH7AQ0atHC2dko\nBJnhHHeEnMVZ0sH2ulK00CDBwM2KPCSnvIe9H23EoZTNP644QvJ2eIUWbI\/el\/jk0VcifMpei1iP\nyOwAFCo+wIhFe5uHhzErzXe2Jn4vwOw0uXDHYePzXoNSdB\/uROxNBqQcxNuntuONjzbgQLLfrd2n\n1rsCw9Y9eC4y3MEUPwTFbcTr0eshKw7G5ekeOAlolkb+qR4dJrqaKLQ0dpH3uslb7DU+skkht1L4\nGZA7CktOE2lgfmY00osPI+jUVrwc5ovAUJ\/lBwY8evYp1zsp2+GwK3Btvg9X5\/rQa1S7vcY20UVe\npBBTyIVRlQsbbNeII3\/GHuQjQ7JOZqecQh51m4VRCy5MWhEjC8IL73sj8ITv2gU7tHBH2VtxT6JI\nHk6bH970dOEqQV4Y78SlqW4M0AM5v1YAVubGfso7CZy9xwvhHG2j0Pa1qUWIWQu5k5wfs+LKTC8W\n6beG6L7jsbvwUrD3cljR9qNvpfptWzXfwvJ+5f9e5lbXuxlbLEFxG1yvnPRFfkUoxijXeBc35WjF\nZJ9B\/DB71E6ememn\/cSYBZ8uDGCarjsI0kqT9KitkSZknfiMF8TeNzVW0QSupkXaxG\/yJM6Tt5Y6\nU3Z+GCgXsS\/RD69FrR+5BzAofuPI\/mQ\/vBm\/UeTca5HrRX4sTpnwybgZThrH+8hLPOoP08N5nJ8f\n7sDcYDtd04kFzNI5h63fVI9F8rhk50bMAshEucjf16mLxG\/x5qsyPw1K6jgl1FHejtiBXR\/4cE7e\nO\/IHhvqOcLK+GuEL9hzfmFN6HMOdWgxb63HBacICjejsMatejlHKPQmW39dRC2wjGbHQ3Mc2RtAc\nugEKMcOM9+rFd5pUhQKqiarZ2lxJeVkq5kG2mLgDePGYtyialcLxyEmqIgtfDAzxEXB\/POKNLnMZ\n5gYMcHZT1fa3CHONtuMzlwM3ztkxT5v1SbuOrpMO0q5vjDZGQ7SYYQvt2qi6ebPU115Doa2kcyVs\ntBBDTbHoNmba9SmopyupC3Fn4T4uL0oRxfLScR8EBHt4MiDE22t31IblY7Jt2B+\/mZLVF0dj\/QnA\ngOk+HcZsDW5ANvbmfL9BFAmbw2PK7jOqhexIxp85xJ5k5d6F4Tb3lMOAPFBI59xl3o3cCf93vYW9\nHOZz64Xj67Y9wn9O5G6\/HVa4A8Jyf4sLE+3kFQ1mHHpMkZckuFHy0pXpTtEpzBRSfqjneM\/CbCWP\nNdDE0qIugJF6tFlbgQ7qJu2aUgHdVlfinhs9RzO29NQTSJa9g90hW9iDt4WAB53eEL0vaRMOp2\/B\n+1lPCWszyaDvSIG1regu701QuBcnLAKGe7AEZm2qFPsMHq1qyzKpgpugKafZkTb0vBj2Ii9IdJnG\ninuGXPYeT+iR8Xvw5qmnsSvEV4RZaOMr4b4urlzJ3ojZgOCsX+NI5lbYTKUCbKyrQYSbvTk\/0Co0\nz9NzPBPyCF96Nl4cWYh7WxXCnJQikk4y5EBHzV0DrdhCEJyC9LGwOAIvnfARIf7dPq8vNz37WKAI\nMUHe2hO9Aa9\/uB50jv0JfthHlqs+hElHA0rVIRjvWSkWJ4X5u4AjVBwzdj2maQEOEmV+z593iZan\nct+30qOVwmPy\/FQBWZ2fIqq4z6hEeMweAfeHd9bhmd1POKlEVno0x3pXiM\/nUom\/SpBUOAjJeQZf\nLA4iPPd54UEGHCdAz9zjPBumKuYwcwqsTDZyYXw+atW67xXARpUoCs5BnrjlBalCbvg8LukQnj+w\nDk+\/+HjZL9b9jCcnP085fPSJTT8PDAj2XmJI1sOTaQFQNUXhaMYOXJvrFoCcU56Azs6VEJobyt3n\n0mTDR\/asZ5Vzj+aWxxLTVJ1DrbBYhJgres+R3yz5PffLBGJ5lnm+rxV7BYb5XGTIg0mbcTB5M5qa\n0vGnGZvw5pBJs6qNWuv\/63tPs+mqSC\/rhB5KFR0bcYznwwCyNf0z89Hngh5PY0getdJLDwjxZS9e\nGO3A4rhF2EWnWfwT6NyQURTParbaNf4Ob544B9XFZ74NP3ZQ9iBw0uuxnYe99AT57d6oLWisz8Al\nGo+kcLF0SMXSf+ffG1LeeV6T9JFliY+sh3raAojtaE7Sl4Ev\/v7ID4Fzh5ts61M7Hwsvz08wzjkM\n7oezsSivBuRpfI3BOG95EQzIcDmp0a47YAHfLYb\/qdd\/ADArEoE\/VDmOAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/npc_shrine_cosma-1311200372.swf",
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

log.info("npc_shrine_cosma.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
