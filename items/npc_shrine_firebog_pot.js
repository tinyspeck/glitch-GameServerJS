//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Pot";
var version = "1351536731";
var name_single = "Shrine to Pot";
var name_plural = "Shrines to Pot";
var article = "a";
var description = "This is a shrine to Pot. Big-hearted and generous, Pot is the giant who dispenses prosperity and good fortune. Which is all well and good if you can keep sloth and indolence at bay. Tricky.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_pot";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_firebog_pot", "npc_shrine_pot", "npc_shrine_base", "npc"];
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

function conversation_canoffer_rituals_of_the_giants_2(pc){ // defined by conversation auto-builder for "rituals_of_the_giants_2"
	var chain = {
		id: "rituals_of_the_giants",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "rituals_of_the_giants_1")){
		return true;
	}
	return false;
}

function conversation_run_rituals_of_the_giants_2(pc, msg, replay){ // defined by conversation auto-builder for "rituals_of_the_giants_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rituals_of_the_giants_2";
	var conversation_title = "Rituals of the Giants";
	var chain = {
		id: "rituals_of_the_giants",
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
		choices['0']['rituals_of_the_giants_2-0-2'] = {txt: "Attending.", value: 'rituals_of_the_giants_2-0-2'};
		this.conversation_start(pc, "Attention, supplicant.  Attention. Attention Supplicant... att...att... bzzzzzz... attention loyal supplicant.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-0-2"){
		choices['1']['rituals_of_the_giants_2-1-2'] = {txt: "Reception’s terrible, dude.", value: 'rituals_of_the_giants_2-1-2'};
		this.conversation_reply(pc, msg, "The following is a ... urrrzzzzzzzzz ... announcement on behalf of Pot... click! Cick! ... of Pot.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-1-2"){
		choices['2']['rituals_of_the_giants_2-2-2'] = {txt: "sacked?", value: 'rituals_of_the_giants_2-2-2'};
		this.conversation_reply(pc, msg, "It has come to the attention of the giants that the stash of... urzzzzzz... hell wine has been ran...rans... ran...", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-2-2"){
		choices['3']['rituals_of_the_giants_2-3-2'] = {txt: "But...", value: 'rituals_of_the_giants_2-3-2'};
		this.conversation_reply(pc, msg, "Ransacked. This is not acceptable. Also, Pot wishes the Potulace to know, it shows very little taste in alcohol. It is bad, BAD wine.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-3-2"){
		choices['4']['rituals_of_the_giants_2-4-2'] = {txt: "*kick*", value: 'rituals_of_the_giants_2-4-2'};
		this.conversation_reply(pc, msg, "And just because the Giants are sleeping, it does not mean they do not know what is going on down here. And if it contin... cont... cont...", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-4-2"){
		choices['5']['rituals_of_the_giants_2-5-2'] = {txt: "Wait! How old IS this...", value: 'rituals_of_the_giants_2-5-2'};
		this.conversation_reply(pc, msg, "... inues, you will all be eradicated by the rook. You and your sheepies, ducks, and sorbetflies.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-5-2"){
		choices['6']['rituals_of_the_giants_2-6-2'] = {txt: "Hrmpf.", value: 'rituals_of_the_giants_2-6-2'};
		this.conversation_reply(pc, msg, "This is the decree of Pot. Message ends. Bzzzzz.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_2-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"rituals_of_the_giants_2",
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
		"Peh. Peh. I do not like this. It is small.",
		"This is not good. Do you have anything better?",
		"Why did you give me this?",
		"Pyew. Almost inedible.",
		"Nyuk.",
	],
	"donated_item_tier2": [
		"Not tasty enough.",
		"This is ok. But not great. I prefer something greater.",
		"Hm. Chewy. Not sure.",
		"I've had better.",
		"Not bad. I've had worse.",
	],
	"donated_item_tier3": [
		"Pretty tasty, as donations go.",
		"I like this. What is this? I like it. More like this, please.",
		"This is pretty ok. Nice aftertaste. Woody.",
		"nom nom nom.",
		"A passable shrine-stomach offering. Tasty.",
	],
	"donated_item_tier4": [
		"NOM. YES.",
		"Pot's Shrine-stomach is making happy noises. Like this: Mmmmm.",
		"You have satiated Pot's shrine-stomach.",
		"This. This is what Pot likes. Nom.",
		"An excellent repast. Really, top notch, little Glitchling.",
	],
	"super_donation_20x_xp": [
		"Yes. This is indeed what you deserve.",
		"You have heard of Pot Luck, yes? Well, TA-DAH!",
		"Pot wants you to be lucky. Potluck for you!",
	],
	"super_donation_5x_xp": [
		"You have fed Pot's shrine-stomach. Now Pot will feed your soul.",
		"Pot gives back.",
		"Yes. Now a little something extra from Pot.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-83,"y":-212,"w":167,"h":213},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALZElEQVR42s2YeVDU5xnH7TFtVO6b\nlT1h2XthudnD5ZIbFlEE5VwPRFBgQeWMa6xBYjQoHsETyYoSp7LRRE0Q3EnaTm1i6z\/tJG0ms22m\n19TOOHbSaTrpzLfP+9uAJFWHpelMd+aZ3+5v3+Pz+z7P+7zP+1uy5Amf3UUr6p9fLXb1lYlcPSVC\np21VhHnJN\/zpLRbY2fjMukv4Lq\/mONKg+mKsRY3RrQoM18diZ7nI\/k0DnmiQ4uwmGU5aZRhYJ0Fd\nRsTC5jjWlDv6o6MZmHrZDOd+AwaqpChNi\/rGAUuSox5WGQWo0AuQn7ACBlX40II6\/vSk+U\/3RrLx\nwatZuE6Q1kwBTOpIV5o8wk5Wn6oUWRIlgf7eAukVkcJ0jWAoVcFz0jijXcUi94sVIkzsUOFItRS1\n6SELc\/Htgynuu6cLcfdkJt4dNuN8owK29TFc56IMQ31RlsGdppbY3715Kvfiyf5PWxsKrz\/4ZHr8\n3p0L45MXXhz\/+OeTnLHv70+fn8hJVg1lpaid6fIIc9HK5KEMfRLnjcFKsWtgrQjjzQocqZGiPCtS\nuCBAx3Zj3P4miftQmxi3e7UY36acA7TkZrjJkJqgcf79wd3Efz742b1Z+6t75v6Hd6\/8av49ZoVZ\nRntZbuZD1r8wyzRalGVCarzGcsYqc43USTC2RYa9ZSJ45Y7yIsXbe+tEuLNHh8stqjnAtYU57tyV\n6ffTk+JcXwe8em7\/pwd7Nj68N3Pho68C6oXFOeb7XNzlmJ3F2SvdhqT4oQub5a7buzRwNMmxt1zs\nHWBGWqK7oTgNM73xBKhEV4WEi7nSVRltOTmJ\/ik6Vdx8QKbce9dPfszgGOh8QNaP9eH652bUF2Sa\nzImJEv8LjYqh6d0avNGuweF62cIBU+O1bQUZBpQXZKNjtRYTlG6e1G4WkLn27YlD7uEXmh+80Lbh\nb+w6H\/KpodQot890azDZpsbhmlj3ggENKTrmxoeV+XpYC+JxqUn5TMDx4\/1\/2GgxYb41r8v5YhYQ\nf\/mlz9MAmYJXaRUfrop2LRgwXacxt5bqq7YWqHC8LoZz8bMAmXtt9UWfzwdkKs4CsnZPBGxS2lkM\nOttJwVqpy6sYtBVEmU9vjMWNDjW5WPVMwPlxyGLw64vk6YCPXdy3Nto7wIH15vSzW+SYIhc8DfBJ\nn\/ON1oTzWxukC2k7ttnjYgZ4oNpLBR0tjQkXKfZud2nw+vb\/XCS3BnOMrmNG+0iXznVmt\/7353YZ\nHjm60j47uUOD853Jnzt2Gx9d6jY9cuwxfOQcTBultm0zx\/VfScRjFINTnWrPIrHKvQNkSjioUHDu\nUGJw3eMcdftUoj8DO7cr8cHGPAHK0yNRbeRhc2YUmlcJsD1XgJ3FYuwi61sdjf6yaPTQdXRnPG4O\nmj66Zs\/Onx+D0yTA1VYCbJAtQsFtKky2KjFQ4QFkCtwZNrgHtiiQpwlBWVIYKlIjUGPwADZl89Ga\nL+QAdxdLOMC+MrpaJNhXIcXLdbGgh8OtwaxuNt45cvHZjVJPHlws4HR33FwMrjNICh19Om6S0x1a\nvERlWGehANWGSGzK8CjYXvAlYIkEPQTGFDxqleNCZzxmDqZi6hU9ztpSPmPjjVjjRg6uEy0ecLzF\nA3i5WYkTzRU+hYkhzgZTOI7WR+Pa8zpM0YQM9pk2bMD0SymYOpAEJ6WUY+slaMyIRG2qwDjWmHaN\nuZhLMw1y7wEv0eKY7tLiMhULPSVR5sKE4NE6YzgG1wpwYbMUkx1K3OrT4kqbEtdsGtywqfHOTg1u\n79biFgX\/dfp9Z18CpvfE4WafBle2y3GmVoImAizXBQjHtspdXKJeTAyyRcIp2MWqGQX2bYgeteas\ncG3Qh+LAGgHGCPBqp5Kb+HKLApOkwo1OLW60qzBFqrxFsftWhwbvENxUP93voWywTYbhSjGasiJx\nsEJkPtEQe382zbxcu5gYJNdO7aayn8qhm6TK5e1KlCcHY99qPs5ao3Flhxxv0v+XqJ67sl0FJynx\nJlOSVHyT4K53ajDF1OtS4noXJXwCPFQhpNJKQO3UcDTLMeviQ\/VeA7ZwCjI1GOD+cuXZkTpjR0VK\nxAddxTycqBXTHi3HpE2BizQRKzonSOlJgmTuZqr8cAep2kuwpDQLh9dI9Z78Fdhbqn2RjXWsSvUP\nlgcXFYP7K4wdjiYFB\/g6TcRikN1flRxi3mQKozgUYpRSBIur0a0ynKeHYO3HySZIzUsES3mOU26S\nlL68TY6RanKvOWIOZHRL0qOpnZ5EfbRGukhAbqujvbKEb3l82AlxdRfxMLRezC2WM5ukOEEp58wm\nBkophRL8OfrOfjtJvUuNsdzD9BfzsX7eucOxLemzOz1xiwMcqDR3vLQhmisW2FbXX\/b42JlFK3C9\nMfThHoqlowQ5vEGMA3RsPEwHn6M1MThW67ker48hRWU4TSt3YI0QtSsj505tpxprIi82q3CnW4s3\nKF4XpWCfRQCnTcUp2Fsq+MqxMzMlLK7OFPawl+LxAC2aLlJnD50rXigXYd8az\/UVWhAnasTYX8ZH\npT7cOb\/\/KSttpRQCbJG82hCL\/hKhl4Ck4OnNci5RsxicBVwRvLxeFOLrUvP8kCDwhyUpBLbcSNjy\norAti4cdq3hoy+OjPZeHvQTfWcBDkSYIekmAWxTqMxQV4GOe2+sphG5TDDJAe5nIe0AHreIJWqFs\nq+svFdnZ4FHBvsiODYQi3AcxoT4oVgVDucIXydF+yFEFYpU2CNlkadG+UAtYm2WQUdtkepgCRRCE\nIb5g47A05tj2pYtpqxusivEOcB+5mKUZT8GqRpdF5IoK8rEzwFRRALKkgUjk+0Ev9odREgB5uC9E\nwcvAD1qGqMClENA1JnQ5tDxfzswxARygJIwAg32cPSXyYgbIClaWZoaqvQS0r0nrYMXCTG8ct0j6\nKEbkYX52EVOAINlE2ih\/mKIDsZKMAT\/J2H\/sgXR8f64P6x8T6uvaX2nsYIuEpRkGeKR6EQqyvZgB\nXmnVsFXsUkb42ZUR\/qSWH8Q0kSDYA\/ssY20YlDTMj+vH+ivC\/Z37uDSm5BRkLh7y1sU9FmX37F48\nQYtkl0UESeASf4IcZZMs1hicIvI5YXu+wE5upd1GgTdsLM14CbirSDYyTmDTpCADbC0SzFXVSdEB\nllRyX5zA\/76K5\/dQRTE235jr44VB0PIDuN8anr8zjRaWURHMUs132BgMkDIDJfgYKjQ0OFIT4\/ZO\nwVLttdcoDTDAEWssbAX8OcC1JsHwljwR1uqFzQZFIHTipYgXeUxHFidcilxdKCqpkGX3WJ+V2jB3\nfY4Ig42eNxS9ZZrx58soT9ZF036uwXBtrHevPvrLddccFMQz\/fEYrJRgB+U5tg9zb6VqlaOHrSps\nz49pNikDkB7rgxy1P7LVAcjRBCKbbHMWJe51sUiSLKcHeE5YkBjaNlCjROcaaZtHQb7rJD34dRsV\nEVR0HKXdxyvAbotm3EGF6nRfPM42KtBZLIAqxi+P\/ceUaC2Rvd9SKBaa5L4\/ziWg8hRSTB+G9VTQ\nrkkLw6ZsKv\/LpChMDkOSaJlljUGpqjZHwV4p414itefxnWM07tu0U9lXizgR6PbSBQO2ZEUKT2+S\n\/4a5+DLF4Kr44F\/T7Q15ccEp7SVi\/KAq4YiYgt0gC0RFeiiqDBGoNUfCmsmDlXYUBmivlmMrnVHU\nfN8\/Ut\/A6pXqQyUpUVe\/HD+BCgz3zVYFTm+M\/VdZSthP6LZpsW9rWWB\/a97vCLJQ9kUa4fNeojgQ\nBfGhsCSHo5SsJJFOe+k89FXKYUnlITLg+5PUVEf27SeMzcb97pL\/5WdFwPeeF4Us+4UweOmHgqCl\nn\/CDlv5OJ\/b7c3O+ALbymN9SkzQy3yX\/J5\/vky3P1IbINmRE2cv1Ec3\/7YD\/BncqyUwZgx14AAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291930358-4297.swf",
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

log.info("npc_shrine_firebog_pot.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
