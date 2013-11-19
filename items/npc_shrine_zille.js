//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Zille";
var version = "1351536731";
var name_single = "Shrine to Zille";
var name_plural = "Shrines to Zille ";
var article = "a";
var description = "This is a shrine to Zille, the giant whose domain is the mountains. Hills, too. Also hillocks, pingos, drumlins and buttes. It's safe to consider that any bump in the ground is Zille's turf. She takes no responsibility, however, for volcanoes.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_zille", "npc_shrine_base", "npc"];
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

function conversation_canoffer_facts_of_the_giants_2(pc){ // defined by conversation auto-builder for "facts_of_the_giants_2"
	var chain = {
		id: "facts_of_the_giants",
		level: 2,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "facts_of_the_giants_1")){
			return true;
	}
	return false;
}

function conversation_run_facts_of_the_giants_2(pc, msg, replay){ // defined by conversation auto-builder for "facts_of_the_giants_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "facts_of_the_giants_2";
	var conversation_title = "Facts of the Giants";
	var chain = {
		id: "facts_of_the_giants",
		level: 2,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['facts_of_the_giants_2-0-2'] = {txt: "1?", value: 'facts_of_the_giants_2-0-2'};
		this.conversation_start(pc, "Transmission will begin in 3...2... 2... 2... 2...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_2-0-2"){
		choices['1']['facts_of_the_giants_2-1-2'] = {txt: "Two...", value: 'facts_of_the_giants_2-1-2'};
		this.conversation_reply(pc, msg, "2... 2...1. The Committee for the Illumination of the Populace presents Giant Fact no. 4: Zille, giant overseer of all mountains, grew up in a travelling circus, eons before the time of the Great Imagining, and is to this day as well known for her ability to  juggle continents as she was for being two-faced.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_2-1-2"){
		choices['2']['facts_of_the_giants_2-2-2'] = {txt: "What?", value: 'facts_of_the_giants_2-2-2'};
		this.conversation_reply(pc, msg, "Even though having a face on either side of one’s head is not usual, even for giants.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_2-2-2"){
		choices['3']['facts_of_the_giants_2-3-2'] = {txt: "Oh.", value: 'facts_of_the_giants_2-3-2'};
		this.conversation_reply(pc, msg, "Transmission ends. Click.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_2-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_facts_of_the_giants_4(pc){ // defined by conversation auto-builder for "facts_of_the_giants_4"
	var chain = {
		id: "facts_of_the_giants",
		level: 4,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "facts_of_the_giants_3")){
			return true;
	}
	return false;
}

function conversation_run_facts_of_the_giants_4(pc, msg, replay){ // defined by conversation auto-builder for "facts_of_the_giants_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "facts_of_the_giants_4";
	var conversation_title = "Facts of the Giants";
	var chain = {
		id: "facts_of_the_giants",
		level: 4,
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
		choices['0']['facts_of_the_giants_4-0-2'] = {txt: "Here we go.", value: 'facts_of_the_giants_4-0-2'};
		this.conversation_start(pc, "...Click. Transmission...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_4', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_4-0-2"){
		choices['1']['facts_of_the_giants_4-1-2'] = {txt: "Hm?", value: 'facts_of_the_giants_4-1-2'};
		this.conversation_reply(pc, msg, "...Begins. The Committee for the Illumination of the Populace presents Giant Fact no. 42: Zille was the last giant to close her eyes to the universes the giants used to inhabit, and give herself over to the world of the Great Imagining.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_4', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_4-1-2"){
		choices['2']['facts_of_the_giants_4-2-2'] = {txt: "Oh.", value: 'facts_of_the_giants_4-2-2'};
		this.conversation_reply(pc, msg, "This is why, it has been suggested, Zille is the most level-headed of the giants, but the hardest to please. The rumour that she has a heart of stone, however, is not true.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_4', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_4-2-2"){
		choices['3']['facts_of_the_giants_4-3-2'] = {txt: "SPACE MATTER?!", value: 'facts_of_the_giants_4-3-2'};
		this.conversation_reply(pc, msg, "It is made of giant-flesh. And space-matter gravel.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_4', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_4-3-2"){
		choices['4']['facts_of_the_giants_4-4-2'] = {txt: "*Sigh*.", value: 'facts_of_the_giants_4-4-2'};
		this.conversation_reply(pc, msg, "Transmission ends. Click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'facts_of_the_giants_4', msg.choice);
	}

	if (msg.choice == "facts_of_the_giants_4-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"facts_of_the_giants_2",
	"facts_of_the_giants_4",
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
		"Donation is this? What know you of donations?",
		"Rubbish, this donation is.",
		"Small, see? This donation? Small.",
		"Zille wants donations like boulders. You offer gravel.",
		"Tiny is this donation. Stingy you are.",
	],
	"donated_item_tier2": [
		"Many are the things that Zille wants. This is not so much one of them.",
		"Zille wants donations like boulders. You offer pebbles.",
		"Donations yes. This? This, not much of a donation is.",
		"Mediocre, this donation is.",
		"Size matters not. Except in donations. Then it does. More, please.",
	],
	"donated_item_tier3": [
		"Donation is a natural part of life. Especially good ones. Like this.",
		"Donations like boulders, Zille wants. Offer this, you do. Not bad.",
		"Good relations with Zille you have. Well, with gifts like this, you have.",
		"Donate you did; like it, Zille does.",
		"Be like the megarock. Constant, proud, generous. Like this.",
	],
	"donated_item_tier4": [
		"Adventure? Excitement? Zille craves not these things. But THIS? Yes.",
		"Like this you should donate always. Always, youngling.",
		"Zille wants donations like boulders. This. THIS is a boulder-sized gift.",
		"Zille will protect you for this mighty kindness.",
		"Mighty, this donation is.",
	],
	"super_donation_20x_xp": [
		"Feel the force! Of Zille, that is! Feel it!",
		"Reward you, Zille does. Avalanches of rewardlings.",
		"Be as the rock! Mighty! And large! And hard! And rejuvenatey!",
	],
	"super_donation_5x_xp": [
		"Youngling, gather round, a gift for you I have.",
		"Mind what I have given you today, little miner.",
		"Boosts of extra havings for you. Enjoy them you will.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-76,"y":-143,"w":151,"h":144},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK4UlEQVR42t2Y+VPU9xnH80ObaTqZ\nIKBG1ERrm2OaNjQhksMYSeKRGBNFA4TDEBC5EVi573MvFpZddlmWZdllOZd7lxsiqwa1KpE0bdrE\nTGpnOtNfnck\/8O7zfPC7g5GMGM0PLTMP3+\/u93p9n+P9PJ996KH\/97\/vFud8vr0yuUeybxYnY7+9\nOlW+8ju2nxVCerDHbdP2WzVL473NmHCaMNXfgumBFswMmjE71IpPhy04M9qGeZcVHnc7zo7ZcH7c\njs8mOrAw5cCF6U5cnCGb7rxJ+55\/XBoTL\/LPaxPb7hmKgb65MuGZGWyFzVADZWkW1BUyaKpyoK3J\ng05RAIOqCM11xTA3lNLnQlh1FbAbq+Ew1aLbLEdvmxL97WoM2jW0r0aHSYXRbh0m+5swPWjE3LAJ\nZ8fbcPVMD7666L5x\/cqEbU2wHLbrVyfxtwsuKMuyUVt86q6AlsZytOsrfxRwpLMBru5GjPXeDnjG\nZSZPW3DtrBP8zG+uTmrvCmhWKn0uz\/bg28UpLJ0dpIfUo6E6Fznp8agsSIOcgcuyUFdxGvXVOdDJ\n89CkLBSwLRJsE8E2V6OrpRY9FiWct0CHHQTa04jJAYMAvDjjwBfnBwTc3y+5YVAU3h2wvaFyz2Cb\nBp8OmHFtvh\/ffT5FNi1u8teFUTiaFfRgJXlJjV5LHUx1pWgS3iwlwHICrCTAanQ0y8V5w506zFCO\nzo20UY5aKRe7xL3Y\/vXFLP5yfgjj3U0oPBWHrKRoz5o8OEAPZkjJxruacM7VjqV5JxbnenH98hj+\n\/eUc\/vPV\/Jrt+pUxLH7aiwUqHM+IBd0mOTTl2V7LTopGVmK0dk1F0mWs9awE\/KnW36pGl1EOq7bi\nNlsJxqYuzRSA2Scj1yZJbZqabd1GxQOBZLsbIIe3VHbSds9yY1aXjLRRXtkor9gb9wrGqeJoqrkN\nzkgFJYFV5CQhIz4CSTGhgT9JpJXKfB9NhexGTX4qqsmUVMFNtfnQktxw6PpaVKtar0mJTkMt2unF\nJDADSZOCrpclxQiolNgPkRAdirjID2Lvq5PUV8kCGypkN40kxg2Vp6GifFGVZNLbJ3NYvFaSnYCC\njE+Qm\/oxclKOQ5Ycc5ulE1TGiY9wKiFS5Bvvp8eHlz+Qdkfh8mgrSfNID9Uk2gy6mnHYlCWnUEdb\n\/qwozkBVforXaovS0URCryUN5RfKToyOfVCAN+uoq3B460qzoSg65c0jAUTCzZUogdZT15G2Epya\nzjHIC9DKulmTL67NSox6MB6kZNfqqvNQW5gOeWGGyEXeFmTEoUyWiMrcZFTmJQtYySTvFWbGi\/xt\nphThCDCckUCFB9cqK2v5G25v2DNkrQ\/s0FUetjZUCEBOdvIC0uLCcSLqyI9aSeYJAZiXFrt0+kTU\ntmZ54R4qlsCfZfzqaZYvsQer81IhL8pAS12JqNBG6ssNlbI7NE5zKx8ZcDmsa+wW91swmnIZuqnf\nduirhbSw7Nh0VV5ZMWtKYVIXC3iWJS4uRXkyktMO2h441LH87Zn7UjaJfKEwj\/QS0KhNC3eHTggy\nwzlvCTmLs6SDlvoyNNMgwcBN8nykpL6PPZ9sxDupm++vOMLyd\/iEF26P3Zv0+OFXovzKX4taj+ic\nIBTJP8SITXuThweXneY7h54\/C7Bemly447Dxfo9JIboPdyL2JgNSDuLt49vxxicbsD8l4Mau4+s9\nwRHr7j0XGe5AagBCEjbi9dj1kJWE4uJUN9wENEMj\/2S3AeOdegotjV3kvS7yFnuNt2xSyO0Ufgbk\njsKSoycNLMiKRUbJQYQc34qXI\/wRHO63dM+Ah08\/4Xk3dTucvXJcmevD5dk+9JhVXq+xjXeSFynE\nFHJhVOXCBi0aseXv2IO8ZUjWyZzU48inbjM\/asO5CTviZCF44QNfBB\/zX7tghxftKH8r4XEU10bS\n4ocXPZ24TJDnxjpwYbILA\/RAzq9lgOW5sZ\/yTgJn7\/GLcI62Umj7WlUixKyF3EnOuuy4NN2DBbrX\nEJ13NH4nXgr1XYoo3n74rbSAbavmW0T+bwLfz9rqeS9ziy0kYYPnlY\/8UVAZDhflGq\/iJp0tmOgz\niRuzR3vJM9P9tJ5w2fD5\/ACm6LiTIO00SY86dDQhG8R3\/ELsfauumiZwFb2kQ9yTJ3GevLXUmXIK\nIkC5iL1JAXgtZv3IHYAhJzeO7EsJwJsnN4qcey16vciPhUkrPhtrh5vG8T7yEo\/6w\/RwHufnhtsw\nO2ihYwbxAjO0z2HrtzZggTwu2ZmRdgFkpVzk6w2qYnEvXnxVFaRDQR2nlDrK21E7sPNDP87JO0f+\n4HD\/EU7WV6P8wZ7jE3PLjmK4Q4thewPOua2YpxGdPWY31mKUck+C5c\/11AJbSUZsNPexuQiaQzdA\nIWaYsR6juEavLBJQeqpme1MV5WWZmAfZ4hL248UjvqJolgtnRU5SFdn4YHCYn4D70yFfdLaXY3bA\nBHcXVW1\/szDPqAVfeJy4dqYXc7RYn+g10HHSQVr1uWhhNEQvM2yjVRtVNy+W+ixqCm0V7SvgoBcx\nqUtEt2mnVZ+cerqCuhB3Fu7jtcWpolheOuqHoNAVngwK8\/XZFbNh6YhsG\/ad3EzJ6o\/D8YEEYMJU\nnwEuR6MXkI29OddvEkXC5lwxZfdRjv1wonaKNcnyufPDrd4phwF5oJD2ucu8F\/08At\/zFfZyhN+N\nF46u2\/YQ\/zuWt\/1mRNEOCMt7BufGLeQVDaadRkySlyS4UfLSpakO0SnaKaT8UO+ag2TErq+6A5DH\n\/TbqJhZNmdDM1vpS79y4cjRjy0g7hhTZu9gVtoU9eFMIeMiJDbF7kzfhYMYWfJD9hLBWqwzGtlTY\nW4tv8944hXth3CYezD1YeI0eWpKVgOk+I3UPhQBdCc3H2Yv8QqLL6CrvGHLZezyhR5\/cjTePP4md\nYf4izEIbX4n093DlSvZG3AaEZv8Wh7K2wmEtE2CuzkYRbvbm3ECL0DwJwkyTTLOqkPKrCF3NNeig\nCmcgXU0u9d9yyrlcr04y5ECb+raBViwhCE5O+lhUEoWXjvmJEP9+r8\/Xm55+JFiEmCBv7I7dgNc\/\nXg\/ax77EAOwly1O9gwlnI8pUYRjrXi4WN4V5JWA9jVeujkZMkJQMU7E4SZS5ndn0lcKjdeVZIgf5\n3OUerRAeqy1IE5A1BamiivvMCkTG7RZwf3x3HZ7a9ZibSmS5R3Osd4b5fSmV+KsESYWDsNyn8NXC\nICLznhMeZMAxApRyj8NnJxDpVwgGHKEW56bCmuhpEt\/xErOFRi7e5+v6zEpRFJyDPHHXFqYJueH9\nhOR38Nz+dXjyxUfLf7XuFzw5BayUw4cf2\/TL4KBQ30WGZD38KD0ISn0MDmfuwJXZLgHIMCuLgyua\nodhWWxe7b3lXqnLu0dzyWGL0lAatmhIRYq7o3Yd+txjw7K8TieVp5vmxVuwTHOF3niEPJG\/GgZTN\n0Osz8Odph\/DmkFVz3+YwVJNe1gs9lCo6PuoIz4dBZGv6MfPhZ0MeTWdIHrUyyvYL8WUvnhttw8KY\nTdh5d7v4EejMkFkUz2q22jG+hhdPnIOqklPfRx45ILsXOOnvkecP+hgJ8vs9MVuga8jEBRqPVgqw\nVCz9t37ekIph5TE2HlxZlnjLemikJYBYjuYmfx384h8O\/RQ4b7jJtj7x\/CORFQWJ5lmnyftwNruu\nalWgH3YSBuO85ZdgQIbLTYv13AIL+mEx\/E\/9\/Rdj\/hRkWxIISwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/npc_shrine_zille-1311202742.swf",
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

log.info("npc_shrine_zille.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
