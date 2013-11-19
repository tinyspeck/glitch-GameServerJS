//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Mab";
var version = "1351536731";
var name_single = "Shrine to Mab";
var name_plural = "Shrines to Mab";
var article = "a";
var description = "This is a shrine to Mab, the giant who holds sway over the harvest. She honors industriousness, and rightfully so. Sometimes, however, industriousness can turn to greed. This is a problem.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_mab";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_firebog_mab", "npc_shrine_mab", "npc_shrine_base", "npc"];
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

function conversation_canoffer_voicemail_of_the_giants_2(pc){ // defined by conversation auto-builder for "voicemail_of_the_giants_2"
	var chain = {
		id: "voicemail_of_the_giants",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "voicemail_of_the_giants_1")){
		return true;
	}
	return false;
}

function conversation_run_voicemail_of_the_giants_2(pc, msg, replay){ // defined by conversation auto-builder for "voicemail_of_the_giants_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "voicemail_of_the_giants_2";
	var conversation_title = "Voicemail of the Giants";
	var chain = {
		id: "voicemail_of_the_giants",
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
	if (!msg.choice){
		choices['0']['voicemail_of_the_giants_2-0-2'] = {txt: "Hello?", value: 'voicemail_of_the_giants_2-0-2'};
		this.conversation_start(pc, "Buzz... *click*... *click*... Hello?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-0-2"){
		choices['1']['voicemail_of_the_giants_2-1-2'] = {txt: "Hello?", value: 'voicemail_of_the_giants_2-1-2'};
		this.conversation_reply(pc, msg, "Hello?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-1-2"){
		choices['2']['voicemail_of_the_giants_2-2-2'] = {txt: "Huh?", value: 'voicemail_of_the_giants_2-2-2'};
		this.conversation_reply(pc, msg, "Hello? I’m sorry, the line is very bad. Is this thing on? This is Mab’s direct message line. Anything you say may be recorded. I’m not sure we’ve set this thing up correctly. What’s this button? Is it plugged in? What’s a plug? Does it have one?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-2-2"){
		choices['3']['voicemail_of_the_giants_2-3-2'] = {txt: "What what?!", value: 'voicemail_of_the_giants_2-3-2'};
		this.conversation_reply(pc, msg, "... have a message, please leave it after the beep. If you have, however, found the very important artifact that Mab has been seeking for so long, known as Mab “Guffin”, please read the secret word printed on the underside of the object for a direct line to wake Mab and speak directly to her.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-3-2"){
		choices['4']['voicemail_of_the_giants_2-4-2'] = {txt: "Hello?", value: 'voicemail_of_the_giants_2-4-2'};
		this.conversation_reply(pc, msg, "...All other enquiries, please... Hang on, does this thing run out of time? What do I push? Regardless, please leave a tone after the... we mean, a message after th... *click*", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-4-2"){
		choices['5']['voicemail_of_the_giants_2-5-2'] = {txt: "Awesome.", value: 'voicemail_of_the_giants_2-5-2'};
		this.conversation_reply(pc, msg, "*Bzzzzzzzzzzzzz*", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_2', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_2-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"voicemail_of_the_giants_2",
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
		"What? Oh.",
		"Yes. But try harder.",
		"You, we like. But this? Pah.",
		"Donation? This? Really?",
		"Feh.",
	],
	"donated_item_tier2": [
		"Ok. Not bad.",
		"Yes. Could do better.",
		"Right. Well, thanks. Work harder.",
		"Donation. It needs practice, apparently.",
		"This? Hm? You're mainly here to hang out, right?",
	],
	"donated_item_tier3": [
		"Hm! Ok. Ok. Not bad. Not bad at all.",
		"Other people do better, you know. But this is good.",
		"Yes. Please come again.",
		"This is pretty good. You're ok.",
		"It is not often we say this. But: Mab thanks you.",
	],
	"donated_item_tier4": [
		"Mab is happy. Mabby.",
		"Yes. Well done. 5\/5, would favor again.",
		"Yes! This is precisely the level of donation Mab likes.",
		"Excellent! Good! Yes! Ok!",
		"Be still and know that that donation was awesome.",
	],
	"super_donation_20x_xp": [
		"You've been MABBED!",
		"Rewarded! You have been rewarded, tiny Mabbite!",
		"Remember Mab, and Mab will reward you muchly.",
	],
	"super_donation_5x_xp": [
		"Will a little extra reward encourage you?",
		"A little extra something-something. From Mab, to you.",
		"A mite of Mabbish gratitude.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-83,"y":-212,"w":167,"h":213},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALXklEQVR42s2YCVCU5xnH7TFNVO6b\nlT1h2XthudldXFiQGxZRBOVcD0RQTpVT11CDxGhQPIKKIllR4lQ2atQEwZ2k7dQmts70mKTNZLbJ\n9MjUzjh20mk77cy\/z\/ttQNOalCXpTHfmme\/Y932\/3\/d\/nvd5n\/dbsuQpv90FK2r3rBY7e0tEzu4i\noaNtVZhpydf86ykU2Nj4zLqK+E6PnnGkTvWP8SY1xrYqMFwbjZ2lItvXDXiiTorRTTKctMowsE6C\nmvSwhT3jWEP22PePpmP6RRMc+w0YqJCiOCXiawcsSox4WGEUoEwvQG7cChhUoUML6vijk6Y\/3BvJ\nxLsvm3GNIK0ZAqSpw50p8jAbWW2yUmSJl\/j7egqkV4QLUzWCoWQFz0HjjHUWilzPl4kwuUOFI5VS\nVKcGLczFtw8mue6ezsfdkxl4a9iEc\/UKtK2P4joXpBtqC8wGV4paYnvr5qnsCyf7Pm6uy7\/24MOZ\niXt3zk9MnX9+4oOfTHHGzt+ZOTeZlagaMiepHanyMFPBysShdH0C543BcrFzYK0IE40KHKmSotQc\nLlwQoH27MWZ\/g8R1qEWM2z1aTGxTzgNastNdZEiO0zj+8uBu\/N8f\/Pjee3cv\/5IZO2f2J9fs\/Y9+\nfv1nc9f5ZqOtJDvjIeufb04bKzCnITlWYzljlTlHaiQY3yLDvhIRPHJHaYHijX01ItzZq8OlJtU8\n4Nr8LFf2ytT7qQkxTgbIQK6c3f8xO96bPf8+O87dm4PON+uFhVmm+1zcZZkchZkrXYaE2KHzm+XO\n27s0sDfIsa9U7Blgekq8q64wBbM9sQSoRGeZhIu54lXpLVlZ8b5JOlXMnIJzcHP2XMuGPw8\/1\/iA\nnbP\/WT\/Wh+ufnV6bl5Fmio+X+J6vVwzN7NbgtVYNDtfKFg6YHKttyUs3oDQvE+2rtZikdPO0dnOA\n\/26jB9s\/YZBz118YSvVy22yXBlMtahyuinYtGNCQpGNufFieq4c1LxYXG5QLBnxj8pDr7WsnP2Bx\nOHcPf\/yF1xcBMgWv0Cw+XBHpXDBgqk5jai7WV2zNU+F4TRTn4v8GyOJt4njf754EmzPW7qmADUob\ni0FHKylYLXV6FINteRGm0xujcaNdTS5WeeTihQM+dnHv2kjPAAfWm1JHt8gxTS74IsCn\/c7VW+PO\nba2TLqTt+Ga3ixnggUoPFbQ31cddoNi73anBq9v\/c5LcGswyOo8ZbSOdOueZ3frfnt1leGTvTPn0\n5A4NznUk\/s2+2\/joYlfaI\/tew\/uOwZQxatsye1z\/uUQ8TjE43aF2TxKr3DNApoSdCgXHDiUG1z3O\nUbdPxfsysLO74h9szBGgNDUclUYeNmdEoHGVANuzBdhZKMYust7VkegriUQ3Hcd2xuLmYNr7V22Z\nuU\/G4AwJcKWZAOtki1BwmwpTzUoMlLkBmQJ3hg2ugS0K5GiCUJIQgrLkMFQZ3IANmXw05wo5wN2F\nEg6wt4SOFgn6y6R4sSYa9HK4NWjuYuOdJRePbpS68+BiAWe6YuZjcJ1Bkm\/v1XEPOd2uxQtUhnXk\nC1BpCMemdLeCrXmfARZJ0E1gTMGjVjnOd8Ri9mAypl\/SY7Qt6VM23og1ZuTgOtHiASea3ICXGpU4\n0VjmlR8f5KhLC8XR2khc3aPDND2QwX6pDRsw80ISpg8kwEEp5dh6CerTw1GdLDCO16dcZS7m0kyd\n3HPAizQ5Zjq1uETFQndRhCk\/LnCsxhiKwbUCnN8sxVS7Erd6tbjcosTVNg1utKnx5k4Nbu\/W4hYF\n\/zW6vtMfh5m9MbjZq8Hl7XKcqZaggQBLdX7C8a1yJ5eoFxODbJJwCnayakaB\/g2RY9asFc4N+mAc\nWCPAOAFe6VByD77UpMAUqXCjQ4sbrSpMkyqvU+y+3q7BmwQ33Uf3uykbbJNhuFyMBnM4DpaJTCfq\nou\/PpZkXqxcTg+Ta6d1U9lM5dJNUubRdidLEQPSv5mPUGonLO+S4Tv9fpHru8nYVHKTEdaYkqXid\n4K51aDDN1OtU4lonJXwCPFQmpNJKQO3UsDfKMefiQ7UeAzZxCjI1GOD+UuXoSI2xvSwp7N3OQh5O\nVItpjZZjqk2BC\/QgVnROktJTBMnczVT53g5StYdgSWkWDq+Q6t25K7CvWPs8G+tYheqvLA8uKgb3\nlxnb7Q0KDvBVehCLQXZ\/VWKQaVNaCMWhEGOUIlhcjW2V4Ry9BGs\/QTZJal4kWMpznHJTpPSlbXKM\nVJJ7TWHzIGNbEh5N73Qn6qNV0kUCcksdrZVFfMvjzU6Qs6uAh6H1Ym6ynNkkxQlKOWc2MVBKKZTg\nz9I5u3aQehfro7mX6SvkY\/0T+w77toRP73THLA5woNzU\/sKGSK5YYEtdX8njbaeZZuB6Y\/DDvRRL\nRwlyeIMYB2jbeJg2PkeronCs2n08XhtFispwmmbuwBohqleGz+\/aTtVXhV9oVOFOlxavUbwuSsFe\niwCONhWnYE+x4HPbzoykkJiatJCHPRSPB2jSdJI6e2lf8VypCP1r3MeXaEKcqBJjfwkf5fpQx5P9\nT1lpKaUQYJPk5bpo9BUJPQQkBU9vlnOJmsXgHOCKwOW1oiBvp5rngziBLywJQWjLDkdbTgS2mXnY\nsYqHlhw+WrN52EfwHXk8FGgCoJf4uUTBXkMRfl6m+bWeQug2xSADtJWIPAe00yyepBnKlrq+YpGN\nDR4R6I3MaH8oQr0QFeyFQlUglCu8kRjpgyyVP1ZpA5BJlhLpDbWAtVkGGbVNpJfJUwRAGOQNNg5L\nY\/Ztn7mYlrrBiijPAPvJxSzNuAtWNTotImdEgJeNASaL\/GCW+iOe7wO92BdGiR\/kod4QBS4DP2AZ\nIvyXQkDHqODl0PK8OTNF+XGAkhACDPRydBfJCxkgK1hZmhmq9BDQtialnRULsz0x3CTppRiRh\/jY\nREwBgmQP0kb4Ii3SHyvJGPDTjP3HXkjH9+X6sP5Rwd7O\/eXGdjZJWJphgEcqF6EgW4sZ4OVmDZvF\nTmWYj00Z5ktq+UBMDxIEumG\/zFgbBiUN8eH6sf6KUF9HP5fGlJyCzMVDnrq426LsmluLJ2mS7LKI\nIPFf4kuQY+whizUGpwh\/VtiaK7CRW2m1UeC1NpZmPATcVSAbmSCwGVKQATYXCOar6oRIP0syuS9G\n4HtfxfN5qKIYe9KY62OFAdDy\/bhrDc\/XkUITy6gIZKnmW2wMBkiZgRJ8FBUaGhypinJ5pmCx9uor\nlAYY4Ig1Gm15\/HnAtWmC4S05IqzVCxsNCn\/oxEsRK3KbjixGuBTZumCUUyHL7rE+K7UhrtosEQbr\n3V8oeko0E3tKKE\/WRNJ6rsFwdbRnnz76SnVX7RTEs32xGCyXYAflObYOc1+lqpVjh60qbM+NakxT\n+iE12gtZal9kqv2QpfFHJtlmMyXuddFIkCynF3hWmBcf3DJQpUTHGmmLW0G+8yS9+LU2KiKo6DhK\nq49HgF0WzYSdCtWZ3liM1ivQUSiAKsonh\/3HlGgukr3TlC8Wpsm9f5BNQKVJpJg+BOupoF2TEoJN\nmVT+l0iRnxiCBNEyyxqDUlVpioCtXMZ9RGrN4TvGadw3aKWyrRZxItDtpQsGbDKHC09vkv+aufgS\nxeCq2MBf0e0NOTGBSa1FYny3Iu6ImILdIPNHWWowKgxhqDaFw5rBg5VWFAZoq5RjK+1R1Hzv31Nf\n\/8qV6kNFSRFXPhs\/jgoM181mBU5vjP5nSVLID+l22mK\/1rLA\/sYT12FkwexEGub1drzYH3mxwbAk\nhqKYrCiednupPPSWy2FJ5iHc75kpaqoj++ZTxmbjfnvJ\/\/K3wu87e0RBy34qDFz6niBg6Yf8gKUf\n6cQ+nzTmCtBWGvUbapJC5r3k\/+T3DNnyDG2QbEN6hK1UH9b4VQf8F+Yj1sDfVPKuAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291930350-8300.swf",
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

log.info("npc_shrine_firebog_mab.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
