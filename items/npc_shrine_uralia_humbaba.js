//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Humbaba";
var version = "1351536731";
var name_single = "Shrine to Humbaba";
var name_plural = "Shrines to Humbaba";
var article = "a";
var description = "This is a shrine to Humbaba, the giant who rules both two-legged and four-legged beasts. Actually, she rules all the beasts with even-numbered quantities of legs. The odd-numbered ones are on their own.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_humbaba";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_uralia_humbaba", "npc_shrine_humbaba", "npc_shrine_base", "npc"];
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

function conversation_canoffer_facts_of_the_giants_1(pc){ // defined by conversation auto-builder for "facts_of_the_giants_1"
	var chain = {
		id: "facts_of_the_giants",
		level: 1,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "perspectives_of_a_patch_4")){
		return true;
	}
	return false;
}

function conversation_run_facts_of_the_giants_1(pc, msg, replay){ // defined by conversation auto-builder for "facts_of_the_giants_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "facts_of_the_giants_1";
	var conversation_title = "Facts of the Giants";
	var chain = {
		id: "facts_of_the_giants",
		level: 1,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['facts_of_the_giants_1-0-2'] = {txt: "Button?", value: 'facts_of_the_giants_1-0-2'};
		this.conversation_start(pc, "Click... click... transmission begins. Press button to continue.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_1-0-2"){
		choices['1']['facts_of_the_giants_1-1-2'] = {txt: "Oh?", value: 'facts_of_the_giants_1-1-2'};
		this.conversation_reply(pc, msg, "...Fzzzzzz ... transmission. Giant facts, no.1623: Humbaba, giant overseer of all that walks or crawls or hops upon the land, is as capable as any giant of walking on two legs. Out of respect for her charges, she walks on four.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_1-1-2"){
		choices['2']['facts_of_the_giants_1-2-2'] = {txt: "Right.", value: 'facts_of_the_giants_1-2-2'};
		this.conversation_reply(pc, msg, "... except sometimes, when she slithers. Just so nobody feels left out.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_1-2-2"){
		choices['3']['facts_of_the_giants_1-3-2'] = {txt: "Anything el...", value: 'facts_of_the_giants_1-3-2'};
		this.conversation_reply(pc, msg, "...And occasionally she hops.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_1-3-2"){
		choices['4']['facts_of_the_giants_1-4-2'] = {txt: "...", value: 'facts_of_the_giants_1-4-2'};
		this.conversation_reply(pc, msg, "... Transmission ends. Click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_facts_of_the_giants_3(pc){ // defined by conversation auto-builder for "facts_of_the_giants_3"
	var chain = {
		id: "facts_of_the_giants",
		level: 3,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "facts_of_the_giants_2")){
		return true;
	}
	return false;
}

function conversation_run_facts_of_the_giants_3(pc, msg, replay){ // defined by conversation auto-builder for "facts_of_the_giants_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "facts_of_the_giants_3";
	var conversation_title = "Facts of the Giants";
	var chain = {
		id: "facts_of_the_giants",
		level: 3,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['facts_of_the_giants_3-0-2'] = {txt: "Need a kick?", value: 'facts_of_the_giants_3-0-2'};
		this.conversation_start(pc, "Click. Clickclick... Transmission beeeeeeeee...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_3-0-2"){
		choices['1']['facts_of_the_giants_3-1-2'] = {txt: "Hm.", value: 'facts_of_the_giants_3-1-2'};
		this.conversation_reply(pc, msg, "... smission begins. Giant fact no.815: Before the time of the great imagining, Humbaba had dominion over only one animal: the great grey grunting, waddling fartybeast of her home swamp. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_3-1-2"){
		choices['2']['facts_of_the_giants_3-2-2'] = {txt: "Huh?", value: 'facts_of_the_giants_3-2-2'};
		this.conversation_reply(pc, msg, "It is for this reason that, in the time of the great imagining, Humbaba carefully mind-crafted every animal to be special and different and unique. Both the species already hatched, and the species waiting in the future-worlds, waiting to hatch.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_3-2-2"){
		choices['3']['facts_of_the_giants_3-3-2'] = {txt: "Wait, what?", value: 'facts_of_the_giants_3-3-2'};
		this.conversation_reply(pc, msg, "Transmission...", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_3-3-2"){
		choices['4']['facts_of_the_giants_3-4-2'] = {txt: "Gah.", value: 'facts_of_the_giants_3-4-2'};
		this.conversation_reply(pc, msg, "... ends. Click. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_3', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_3-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"facts_of_the_giants_1",
	"facts_of_the_giants_3",
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
		"Pah.",
		"Humbaba remembers when her people were more generous.",
		"Thank you?",
		"The point of donation is to please your giant. Yes?",
		"Humbaba has forgotten your name already.",
	],
	"donated_item_tier2": [
		"Humbaba is ok with this.",
		"Thank you.",
		"This is ok.",
		"Know this: you can do better. Humbaba believes in you.",
		"Humbaba recognises you.",
	],
	"donated_item_tier3": [
		"Humbaba likes this.",
		"Thank you!",
		"This is pretty good.",
		"Know this: you have done well. Humbaba approves.",
		"Humbaba remembers you for this.",
	],
	"donated_item_tier4": [
		"Humbaba loves this.",
		"YES! Thank you. Thank you!!!",
		"This is wonderful.",
		"Know this: you have pleased Humbaba. Very, very much.",
		"Humbaba will always remember this kindness.",
	],
	"super_donation_20x_xp": [
		"Your soul is filled with the bubbling laughter of Humbaba.",
		"Humbaba is very pleased with you today.",
		"You should always remember Humbaba kindly.",
	],
	"super_donation_5x_xp": [
		"Sometimes Humbaba smiles on her supplicants.",
		"A little extra nibble for you, little Humbabarian.",
		"You deserve a little extra, little one.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALPklEQVR42rWXW0wbZxbHvdtK2ybg\nsT3GNsZAwj1cDBgwmIttDDZgbIwN5mpj7vc7IUCAQEpCbiQkQJombSAJJIWQhG0oabfVqpH2qdJK\n7e7T9qFKpX3Zt2ifVtqX\/54Zul31oVrRGEt\/zXjsme8353zfOf9PIPgVn\/Yvv2Rad3eNLc+fl7fv\n7c0cRB27u8mCw\/i0vXhhaNvbXat5sP6q9MNV6K6tIP7sFUScuYSg4bMQD8xA3H8G4s5xiHsmIeo+\nDVHfNBi6Ftg5BknPOCKmLqBofgH599ZfVW5v32vd23O8MVjL3l546\/NPvnGuryP8FEEM0qBDs3Sc\nhaR3CmzHGNiWEbCNg5D6BhDU0M9LyomuSby9ELoaEVDegKPlXgS2DEM4Ng9mbhmWBxto\/3T31a8C\n5dLIRaz60UMknLuMo72nEdA6BGHrMETNQ2BbT\/IQQXXdkLnbEGT3QObwQUGS2+qhKG+ErNyHoIoW\nyGo6wVa1QVzXCYbuFXWNgzl5DszsdcTcuIPa7W1wYx0McG93x7K6BtHJqR\/hhhFQ3YZAhweMvQ6s\nw4sgApEVVUGqt0Gmt0OWY4UsuxjybCvkuXSNk6EMsgIX\/wKssxFiiqa4cYCPvoggheMXIByegnPt\nHg4E6Hm0iaqtLcjHzu3DebohrGiCKN8OUboBIrUO4hNpEMdpII5NgTgmGeJo9c\/FXeN+o\/9IkrIg\nSsmBOK8EEoqsqLodQopogK8PmoVltO99ejDARE\/va8\/HW\/yN5lsf4cQQTfocC4HRQAkZ+3CxqfsQ\nUUmQ\/IK43\/ZBU\/fvoXtFaXpEN3XDeOUG6ref8GPUP\/z4YIDavsmN465W6CbOoX7zMf+Q5mfPUL60\nQlpGTv8wTpRVI7akHLHFZf9XGS2dyB06BefND9BEz+Gex6nx6VNoukdpetgPBqjrmzAk+gYhL6bJ\nb2uGeuQsdI09qNrY5B\/s29z6aZBfUsvODipXbqH1+XP+u+PSNf6a684qDGcvIo6eJ9JZwRKc0lT5\n+sArWdszsRFmb4TC6qMV2YbIul5I60eg6p5FyMB5RE9dR9TsCiLfex+R09cROXkZUVP7ipi4iAib\nF\/FlXuRMX8DxjlNQefsQYK5BQJ4DgbllYHQlEGcVQ1nghjLPefBSI05zM+kdY98oKYo8pKMN0opu\nSGuHIPGMQtJMBbn1DJiOWYh65nG0cRwBDaP78o4goG4IgTUDEFb1IbDUh0ACCTS6ICQ4URbBaS0E\nV4Fjpd7FNyrWyc2DOyFFVNtKvJDbmyFzdiDI3Qu2hgpx3TBY3xiVjjEwFV0QlnfQsZs\/Z1x0TpEX\nFtXtg+VR1LJLIdIWE1wR5HnlFOWGAb+0uqTarkVlQTUUJJmlDrKSBj7trK0REoKW2FsgsjZAVNq4\nL3oZMf2HoagJCYolOG4hSCmtLEUv2ODaCTa5wv3aj6PsTYaEmsFXcRShYwQhy3XQwCSDE6yxEpL8\nSrAmNy+J0QkxpTKSXiK1dQY5Q4uouXwfsdb6v6vynQbBYX0Kx24z3oV7OwMfPYPn2kPElreDzTBD\nmllCKoI0i1YlpU9KiqCX0PZcgqbjAjLpWH5mGZOPPvGV2+YGnPb5w4MUJubODC5cRf\/1FaioTIji\nsqhzZOwrMo0XcywZ8oRcZLTP8YC5Q1dhG37v9ffff89UV84vOkvnfIcGKMsw36voH0XDzCUExGoR\nGJUO4fEUMMdTCSwFoh8VGJIAFS2I9K5LMI4sYvTmfVyef99w5dKNGcFhfhSZxd\/qqI+eKCX7lJiL\nwDgdmPgciGKzwESRYjLBRJPC1RARdGbfAtJ9p3BnewuPH69\/1T8x4kuqq3YcCtwRaagyOKvk33Kt\nFcIkAxg1GYcUE5jkAjCJBojpKE428UcmWstHNsriRV7vPE7f3cbnn7+YnF6aN6S53cwhRa+wSa4p\nAKspRiDNMQ5OFEcuRWMBm05Oha5L0oshTS+FLMUCaVwuZAn5SKWa6bmyBrFKoz7U9IbkWDclSfkU\nOSOEaj2t4gbEkUeMdzUhvqIZx02VUBBsiNYGVUYpFPRfeWI+pCdyUdA1DWm8vu5QAaXJhn+IE\/WU\nXj2SatsQS446mAq3gmpfsLkWysIaBFOHUBpcPymGc9vxBoTrqFBritcPDS4wThsjogUhTi2AMEaL\nEBpcUbpvJv6nBsT7+iHn2iK1R06KQuo8CSbI1IUIyrC\/9itUZXyegxMPGKP1ydLNYJPzIYzKQGR1\nJ4IcrQgqa6W2186fc+3PMD4HdfsowtxdZPVbeEhVthshuVUI1jlp3ppT\/AZYlaifcSfoF8duP2aM\nnZNrx\/TlYONzCVALtoQ2RVX9vHiXQwaCk55MbvOTp4jrOk2mogdBFGWVzgV5UiEdHRTFkgG\/RrFB\na\/FNX7h6rmtlA9Vzt6BINUNEdY4ta4OE\/CHrHQXrOcmfi8laZY2fR88XXyB28D2w5HakZNNCc6po\nwRRCri6AMte141fAa6uPDBdnZnD9\/hpart9H0chl2mdkg63sgZisVuzgHBJp4\/5fpdBG3ntvAxED\nc5A0nSZbNoAwfQ0UabTzSzQhzFT9ym9wluHp5KXnzw2rf\/wCZ+7cQt8Hj+C5ug5pgh7i2kGIus\/B\nvnwH9rVNuB8\/g2FlFda1RzCtrCHm9DUytNMQk7lVptsRaiTjm0Zb0qwybv\/xGz+5lzHGMjLp2\/vL\n11h+8RlOrm6hbWULkpgsxIych7j\/Iko+eIDos++j+O4mmMEryLtJ32dvImPhLpiBy2CaJqBINlMU\n6yi9VVAZq2ge52f6BdA8Om24tr3p+OyvX6P3wiTG728jr4EiF0nOpXMWYbO3UPvwCbJvrsP3bBfM\n2BKcG0+RvfwAWYurEJ5agrD9DBRqM5SZLqi4VOvKIc0o8Z\/duvr06czikw2cWfsIUxs7SLH7yFpl\nge2lznB2CezsDbBTV8GeWYR0dgmS6cV9TXLX6Dt1EEWyhV8oSl0FpNRZxAmGWr8B3v7yz8zyiz9g\nbuv3OHn3MTkWLQHqIM2vgKyaal9tF+SeXsjrexHs6UdwPYmirPQNQ17VCXlpA4KTi6AiQFVeDQ8o\nUZtm8uznHJz8Ajm29vE3E+vPoLF7eZfCppCLTi0Gy5mBNDIGqUW0AGwITi9DqK4SylQr9WI7QjSl\nCKbyotRYEW5soBTX8SZCojbOFLjO7+jJXfsF0Nh28qs2mlOBxzUQkQFgM2yQZTkhz6Z2R0U4xFC\/\nL1qpoXo6ptsQRumMtfYiPKcaoZkVCM8nQEMtrWInJNQA2gcX\/WdcmaS8ryRkEIRkFMQaM2+rgrIc\nUORwm+4ahFBkVEYvr2CNjY9gCEU0wuDBMQIOI8hjJuoohjq4u0dw78Hd1wsLK37a1RmNbwfEpv9J\nnGohwLx975dGgJk\/AtLKVFHkVPlehHALgUsvV\/co3RGmJoRSxCLMrThW2AwVlRmzh7qNq2FJkJMT\n6Bc4gclmeTc27VshV5xTCnjAoEza51Lj5wCD9TX\/UuprKb3kXjQlNO9sCCFIDjDa0oGIgmZeXIoV\nlHpRkvGf76QaPxXkFjYJzGblmwHa3CECU6nnt1rDjSPx2T8wJ7IhUptoW2nnAVkCkmTav5NkWL\/j\n5qKCVquSWxgpVgSrLWT3OxBpaUc4TYHgzHIc0ZhfCHSFVwQ55gl6rltgtkW\/eRSL3BJ6mFaQb617\nJ8249q467+W7KfqXR1PyXx5NLXz5dpblhiDbMveW1rQkTjT8jU0q+OF32oIPA1JND5ncstsBOfal\nI9mlS7\/TFV0R6K0dgkJnrqDEpaLsvON\/12pxygSFjiRBQZlaYHcfFzhqQn+SzR32M5XVKAWFtDni\n5Ha\/9WuG+w9d7TlnK+T0PgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271458856-2024.swf",
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

log.info("npc_shrine_uralia_humbaba.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
