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
var parent_classes = ["npc_shrine_uralia_friendly", "npc_shrine_friendly", "npc_shrine_base", "npc"];
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
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALQklEQVR42rWXWUxbZxbHPdNKbRPs\n6w1vmJAAAcJisAGDMdjGYAPGxthgFgM2O4R9SQIUCCQkZCNhCWmaNAkkZIHQhDaUtDPVqJHmqdJI\n7czT9KFKpXmZt2ieRpqX\/5x7qTrqQzWiNVf669rXvvf73XO+75z\/x+P9iqP9yy+Z1u1tS8uLF+Xt\nOztTe1HH9nYqbz+OtpcvzW072ys1D9Zel350D4Zry0g8cwXRpy8hfOgMRP1TEPWdhqhzFKLucQi7\n3oewdxIMXeN3jkDcPYroiQsomp1D\/ura68rNzdXWnR33bwZr2dmJan3x6TeetTVEnSKIARp0cJrO\n0xD3TEDSMQJJyzAkjQOQBvsRHujjJGVF18QNPRB4GxFWHsDB8gbwW4YgGJkFM3Md9gcP0f7Z9utf\nBcqmkY1Y9eNHSDp3GQd73kdY6yAErUMQNg9C0nqCgwj3d0Hma0O4qx4ydxAKktxZB0V5I2TlQYRX\ntEBW0wlJVRtE\/k4wdK\/w+CiYE+fATC8gbvE2ajc3wY61N8Cd7S37vRUIT0z8CDeEsOo28N31YFx+\nSNwNCCcQWVEVpCYnZCYXZEYHZDnFkOc4IM+la6zMZZAVeLkXkHgaIaJoihr7uegLCVIwegGCoQl4\nVlaxJ8D6x+uo2tiAfOTcLlx9FwQVTRDmuyDMMEOoMUB0LB2iBB1E8WkQxaVCdFTzc7HX2N\/oP+KU\nbAjTjBDllUBMkRVWt0NAEQ0L9kI3dx3tO5\/tDTC5vudN\/ZMN7kbbzTs4NkiT3mgnMBooKXMXLl67\nCxGbAvEviP1tF1S7ew\/dK0w34WhTFyxXFlG3+TE3Rt2jJ3sD1PeOPzzibYVh7Bzq1p9yD2l+\/hzl\nS8uk6zD2DeFYWTXiS8oRX1z2f5XZ0oncwVPw3PgQTfQc9nmsGp89g67rJE0P194ADb1j5uTgAOTF\nNPmdzdAMn4GhsRtVD9e5BwfXN34a5JfUsrWFyuWbaH3xgvvuvnSNu+a9fQ\/mMxeRQM8TGhyQEJzK\nWvlmzytZ3z328JCrEQpHkFZkG2L8PZDWDUPdNY2I\/vM4OrGA2OllxJz9ADGTC4gZv4zYiV1Fj11E\ntLMBiWUNME5ewJGOU1A39CLMVoOwPDf4uWVgDCUQZRdDVeCDKs+z91IjSvcxGR0j36goihykuw3S\nii5Iawchrj8JcTMV5NbTYDqmIeyexcHGUYQFTu6qYRhh\/kHwa\/ohqOoFvzQIPoHwLV4ICE6YTXB6\nO8FV4HBpw\/xvKtapzQNbEUVU20oaIHc1Q+bpQLivB5IaKsT+IUiCI1Q6RsBUHIegvIPOXdxnxkuf\nKfKCIv8uWB5FLacUQn0xwRVBnldOUQ70h6TVpdQen1cVVENBktn9kJUEuLRLnI0QE7TY1QKhIwBh\naeOu6GVE9B+GoiYgKAnBsQtBSmmVUPSUZu+W0uqNCmk\/jnU1mZNqBl4nUIQOE4Qs100Dk8weSCyV\nEOdXQmL1cRJbPBBRKmPoJbStUzAOzqPm8n3EO+r+oc73mHn7dRSO3GIa5la3+u88R\/21R4gvb4ck\n0wZpVgmpCNJsWpWUPikpml5C330Juo4LyKJz+enrGH\/8abDcOdPvcc3uH6QgOXdqYO4q+haWoaYy\nIUzIps6RuauYdE7M4VTIk3KR2T7DAeYOXoVz6Oyb77\/\/nqmunJ33lM4E9w1Qlmlbreg7icDUJYTF\n68GPzYDgSBqYI1oCS4PwR\/EjkqCmBZFx\/BIsw\/M4eeM+Ls9+YL5yaXGKt5+HIqv4WwP10WOlZJ+S\nc8FPMIBJNEIYnw0mlhSXBeYoKUoDIUFn9c4hI3gKtzc38PTp2ld9Y8PBFH+1e1\/gDkgjVcrskv\/I\n9Q4IUsxgNGQc0qxgUgvAJJshorMo1cqdmaN6LrKx9gbk9czi\/bub+OKLl+OTS7PmdJ+P2afoFTbJ\ndQWQ6IrBpznGwgkTyKXo7JBkkFOh6+KMYkgzSiFLs0OakAtZUj60VDPrr6xApNZp9jW9EUbHujgl\nnyJngUBjolUcQAJ5xERvExIrmnHEWgkFwUbonVBnlkJB\/5Un50N6LBcFxychTTT59xVQmmr+pyjZ\nROk1IaW2DfHkqJVUuBVU+5S2WqgKa6CkDqEye39SHOu2E82IMlCh1hWv7RscP0EfJ6QFIdIWQBCn\nRwQNrijdNRP\/U4CTnG2L1B5ZKQqp8yRZIdMUIjzT9SakUJWJeW5WHGCcPijLsEGSmg9BbCZiqjsR\nXtaKqLo+pPZPItzdyrW\/qHraqzibyOa3cGIh1Tk+RORWQWnw0Ly1pYUMsCrZNOVLMs2P3HrKWDrH\nVw6byiFJzCVAPSQltCmq6oP57Bzav9iB59ZdJNGWs+DKDaTQrk\/KmYpuhFOU1QYv5CmFdHZTFEv6\nQxrFgN4enLxw9dzx5YeonrkJhdYGIdU5SVkbxOQPU0cvwvPgMQznlyD393MGNY38oLiOnA65HSnZ\ntEhjFS2YQsg1BVDlerdCCnjt3mPzxakpLNxfQcvCfRQNX6Z9Rg4kld0QkdUSN08gsncG4S0TcF6\/\nDf+Tp3B+sIq4gbOI6jlDtqwfh0w1UKTTzi\/ZikPW6tchg7MPTaYuvXhhvvenP+L07Zvo\/fAx6q+u\nQZpkgqh2AMKuc7TPpX57\/gYCjzdQ9tEDZMzegOPWGprWP0bKxDWIyNyqMlyItJDxTactaXYZu\/\/4\nXYjcywhjHx4P7vz1a1x\/+TlO3NtA2\/IGxHHZiBs+j\/ipJdSsP0fHNs3BtacwLq4isPkJtJfvQHnq\nGtRjC2CaxqBItVEU\/ZTeKqgtVTSP87NCAmg7OWm+trnu\/vxvX6PnwjhG728iL0CRiyHn0jkNZnSJ\nk+DUIrQLDzilzT+g70vgD13lzoL201BobFBleaFmU20ohzSzJHR26+qzZ1PzHz\/E6ZU7mHi4hTRX\nkKxVNiQ91BnOLEEyvQjJxFVITs9DOr0E8eT8rsbZa\/SdOogi1c4tFJWhAlLqLKIkc23IAG99+Rfm\n+ss\/YGbjE5y4+5Qci54ADZDmV0BWTbWv9jjk9T2Q1\/VASTVQSXVRSVFWBYcgr+qEvDQAZWoR1ASo\nzqvhAMUa61Se65ybVUggR1aefDO29hw6VwPnUiRp5KK1xZCwZiCdjIG2iBaAE8qMMkQaKqHSOqgX\nuxChK4WSyotK50CUJUAp9nMmQqyxTBV4z2+ZyF2HBNDSduKrtvl74B\/RQUgGQJLphCzbA3kOtTsq\nwhHmul3RSo000TnDiUOUznhHD6KM1YjMqkBUPgGaa2kVeyCmBtA+MB8648qk5H0lJoMgIKMg0tk4\nWxWe7YbCyG66axBBkVFbGjgpdU4ughEU0WhzPQ4T8CGCPGyljmL2w9c1jNUHd9\/MzS2HaFdnsbwd\nFp\/xZ5HWToB5u94vnQCzfgSklammyKnzGxDBLgQ2vWzdo3RHW5sQSRGLtrXicGEz1FRmbPW9yPYG\nlnhGIz8kcDyr0\/5efPq3ArY4pxVwgOFZtM+lxs8CKk01\/1aZaim95F50JTTvnIggSBbwqL0D0QXN\nnNgUKyj1whTLv97VWj7j5RY28Ww21W8DdPoieNbS+t\/rzYsHEnN+YI7lQKix0rbSxQFKCEic5fpO\nnOn4jp2LClqtKnZhpDmg1NjJ7ncgxt6OKJoCyqxyHNDZXvIMhVd4RtsYPdfHszmP\/vYoFvnE9DA9\nL9\/hfzfdsvKeJu\/Ve2mmVwfT8l8d1Ba+ejvbvsjLsc+8pbcuiZLNf5ekFPzwjr7gozCt9RGTW3Yr\nzOhaOpBTuvSOoegKz+To4BV6cnklXjVl593Qu1a7R8YrdKfwCso0PJfvCM9dE\/mTnL5DP1NZjYpX\nSJsjVj7fW79muP8C3u8717SBEjQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271458834-6500.swf",
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

log.info("npc_shrine_uralia_friendly.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
