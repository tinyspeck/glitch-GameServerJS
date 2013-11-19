//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Alph";
var version = "1351536731";
var name_single = "Shrine to Alph";
var name_plural = "Shrines to Alph";
var article = "a";
var description = "This is a shrine to Alph, the giant of creation. If you've ever wondered \"Why do Piggies make meat?\" or \"Which came first: the chicken or the egg plant?\" chances are Alph has the answer.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_alph";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_uralia_alph", "npc_shrine_alph", "npc_shrine_base", "npc"];
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

function conversation_canoffer_voicemail_of_the_giants_1(pc){ // defined by conversation auto-builder for "voicemail_of_the_giants_1"
	var chain = {
		id: "voicemail_of_the_giants",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "facts_of_the_giants_4")){
		return true;
	}
	return false;
}

function conversation_run_voicemail_of_the_giants_1(pc, msg, replay){ // defined by conversation auto-builder for "voicemail_of_the_giants_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "voicemail_of_the_giants_1";
	var conversation_title = "Voicemail of the Giants";
	var chain = {
		id: "voicemail_of_the_giants",
		level: 1,
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
		choices['0']['voicemail_of_the_giants_1-0-2'] = {txt: "What?", value: 'voicemail_of_the_giants_1-0-2'};
		this.conversation_start(pc, "*Click* ... Welcome to the Shrine of Alph. Please enter your request after the tone.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-0-2"){
		choices['1']['voicemail_of_the_giants_1-1-2'] = {txt: "What request?", value: 'voicemail_of_the_giants_1-1-2'};
		this.conversation_reply(pc, msg, "I’m sorry, we could not recognise your request. Please re... re... Please repeat your request after the tone.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-1-2"){
		choices['2']['voicemail_of_the_giants_1-2-2'] = {txt: "Um...", value: 'voicemail_of_the_giants_1-2-2'};
		this.conversation_reply(pc, msg, "Your request has been accepted, and will be passed along to Alph.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-2-2"){
		choices['3']['voicemail_of_the_giants_1-3-2'] = {txt: "Ok?", value: 'voicemail_of_the_giants_1-3-2'};
		this.conversation_reply(pc, msg, "Please note, due to overwhelming supplication volume, there may be some delay in fulfilling your request.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-3-2"){
		choices['4']['voicemail_of_the_giants_1-4-2'] = {txt: "Oh?", value: 'voicemail_of_the_giants_1-4-2'};
		this.conversation_reply(pc, msg, "In the meantime, please be assured that ever since the first appearance of a rook, Alph has been hard at work imagining the precise combination of elements that would lead to contained rook explodification.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-4-2"){
		choices['5']['voicemail_of_the_giants_1-5-2'] = {txt: "Hello? Oh.", value: 'voicemail_of_the_giants_1-5-2'};
		this.conversation_reply(pc, msg, "And as soon as Alph has imagined the correct combination, his loyal followers will be the first to... Thank you for ... *click*.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'voicemail_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "voicemail_of_the_giants_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"voicemail_of_the_giants_1",
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
		"Alph acknowledges your minor donation.",
		"Alph has received and weighed your donation. It is small.",
		"Your donation has been appraised on behalf of Alph. Little, isn't it?",
		"Fzzzzt. Your very small donation is accepted.",
		"Small donation, eh? Alph has noted this.",
	],
	"donated_item_tier2": [
		"Alph acknowledges your middling donation.",
		"Alph has received and weighed your donation. It is middling.",
		"Your donation has been appraised on behalf of Alph. It is ok.",
		"Bzzzt. Your middling donation is accepted.",
		"A middling donation. Alph remembers.",
	],
	"donated_item_tier3": [
		"Alph acknowledges your really quite good donation.",
		"Alph has received and weighed your donation. It is quite good.",
		"Your donation has been appraised on behalf of Alph. Pretty good.",
		"Fjzjzzjzzt! Your reasonable donation has been gratefully accepted.",
		"A very reasonable donation, Alph would say.",
	],
	"donated_item_tier4": [
		"Alph acknowledges your impressive donation, and likes you for it.",
		"Alph has received and weighed your donation. It is most pleasing.",
		"Chkkkkkzzt. Generous donation gratefully accepted.",
		"Your donation has been appraised on behalf of Alph. It is GREAT.",
		"An impressive and mighty donation. Alph will remember this.",
	],
	"super_donation_20x_xp": [
		"Mighty, mighty Alph, gives you mighty, mighty thanks.",
		"You have been deemed worthy of extra Alphibian reward.",
		"Never say that Alph is not a generous Giant. BOOM!",
	],
	"super_donation_5x_xp": [
		"Mighty Alph sometimes rewards extra. Like today.",
		"Alph thanks you a random extra amount for this.",
		"One day, you will know the mighty rewards of Alph. Today. Why not?",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALQ0lEQVR42rWXWUxbZxbHPdNKbRPs\na\/sab5iQsK8GDBiMjW0MNpuNscGsBrPvO0mAsCYkJAQICZCmSVNISpKG0IRpUtJtZhppniqN1M48\nTR+qVJqXeYvmaaR5+c\/xparUh2pEY67017Wvfe\/3u+d853z\/j8f7DUf7V18xrc+emVuePi1r39ub\nOYg6nj1L5h3G0fb8ualt79lm9YdbL0ve34Duyjrizy4ifHoBwcNnIRqYgah\/GqLOMYh6JiDsPgNh\n3xQYusbvHIW4ZwzhkxdRML+E3DtbLyt2du607u05XxusZW8vrPXpJ9+6trYQdpogBmnQoVk6z0Lc\nOwm2YxRsywjYxkFIfAMIbujnJPGLronreyFwNyKorAFHy+rBbxmGYHQezNwabB\/eQ\/unz17+JlB\/\nGv0Rq3pwHwnnL+No7xkEtQ5B0DoMYfMQ2NaTHERwbTeknjYEO7yQOn2Qk2T2OsjLGiEt8yG4vAXS\n6k6wlW0Q1XaCoXuFXWNgTp4HM3sV0dduoWZnB\/6xDga492zXtrEJ4cnJn+CGEVTVBr7TC8ZRC9ZZ\nj2ACkRZUQmK0Q2p0QKovhjS7ELLsYsgMdM0vUymkeW7uBVhXI0QUTVHjABd9IUEKxi5CMDwJ1+Yd\nHAjQ++AhKre3IRs9vw\/n7YagvAnCXAeE6SYI1TqI4tIgitVAFJMCUXQyRFHqX8p\/zf8b\/UeclAVh\nih6inCKIKbLCqnYIKKJBvj5oltbQvvfpwQATvb2vvB9tczdab9xG3BBNer2NwGighIx9uJjUfYjI\nJIh\/Rf7f9kFT9++he4VpRkQ1dcO8eA11Ox9zY9Td\/+hggNq+iXsn3K3QjZ9H3cNH3EOanzxB2eo6\naQ36\/mHElVYhpqgMMYWl\/1cZLZ0wDJ2G6\/p7aKLn+J\/nV+Pjx9B0n6Lp4TgYoK5v3JToG4SskCa\/\nvRnqkbPQNfag8t5D7sG+h9s\/D\/JratndRcX6DbQ+fcp9dy5c4a65b23AdPYSYul5Ql0xWIJTWipe\nHbiStT3j9445GiEv9lFFtiGitheSuhGoumcRMnABUZNXETm7johz7yJi6ioiJi4jcnJf4eOXEG6v\nR3xpPfRTF3Gi4zRU9X0IslYjKMcJvqEUjK4IoqxCKPM8UOa4Dt5qRGkeJr1j9FslRZGDdLZBUt4N\nSc0QxN5TEDdTQ26dBtMxC2HPPI42jiGo4dS+6kcQVDsEfvUABJV94Jf4wCcQvtkNAcEJswhOayO4\nchwvqV95rWad3Dy4G1JAva2oHjJHM6SuDgR7esFWUyOuHQbrG6XWMQqmvAuCsg46d3OfGTd9psgL\nCmr3wXIoatklEGoLCa4AspwyinLDQECWuqSarhVlXhXkJKmtFtKiBi7trL0RYoIWO1ogLG6AsKRx\nX\/QyIvoPQ1ETEBRLcP5CkFBaWYqewuTeVVjcYQFdjyMdTaaE6sGXsRSh4wQhNThpYJLJBdZcAXFu\nBViLh5PY7IKIUhlBL5HaOgP90AqqL99FTHHdP1W5LhPvsI780ZtM\/dKd3YHbT+C9ch8xZe1gM6yQ\nZBaRCiDJoqqk9ElI4fQS2p4FaDouIpPOZdNrmHjwia\/MPjfgcswfHqQg0TAzuLSM\/qvrUFGbEMZm\n0cqRsa+INE7M8WTIEgzIaJ\/jAA1Dy7APn3v1ww8\/MFUV8yuukjnfoQFKM6x3yvtPoWFmAUExWvAj\n0yE4kQLmRCqBpUD4k\/ghCVBRQaR3LcA8soJT1+\/i8vy7psWFazO8wzzkmYXf6WgdjSsh+5RoAD9W\nByZeD2FMFphIUnQmmChSmBpCgs7sW0K67zRu7Wzj0aOtr\/vHR3xJtVXOQ4E7IglVKrKK\/ivTFkOQ\nZAKjJuOQYgGTnAcm0QQRnUXJFu7MRGm5yEba6pHTO48zH+zg88+fT0ytzpvSPB7mkKKX3yTT5IHV\nFIJPc8wPJ4wll6KxgU0np0LXxemFkKSXQJpigyTWAGlCLlKpZ3oXNyFSadSHmt4QffFDcVIuRc4M\ngdpIVdyAWPKI8e4mxJc344SlAnKCDdHaocoogZz+K0vMhSTOgLyuKUjijbWHCihJNv1LlGik9BqR\nVNOGGHLUCmrccup9CmsNlPnViLN7oTS5f1a0323HmxCmo0atKdw6NDh+rDZaSAUhSs2DIFqLEBpc\nXrJvJqKqupA3Nov8uUVUXL+JnMl5yGh59EueTytPggVSdT6CMxyvAgpVEZ\/j9IsDjNb6pOlWsMm5\nEERmIKKqE8GlrZz0Zy6glayU9\/5DdHz2HL1\/\/iPZ\/BZOfkhVtgchhkoodC6at9aUgAFWJhpnPAnG\nldGbjxhz58TmcWMZ2HgDAWrBFtGmqLKfUydtfKo2t5A+PIOeL79AMu03JJyp6EEwRVmlc0OWlE9n\nJ0WxaCCgUWzQ2nxTF5fPd63fQ9XcDchTrRBSn2NL2yAmf8jWn0J0\/1l07n4Cy\/INqAlOXEtOp46c\nDrkdCdm0UH0lFUw+ZOo8KA3u3YACXtl4YLo0M4OrdzfRcvUuCkYu0z4jG2xFD0RktcTNkwhumYTx\nwhoiBuZQsnYbnttbEDed4cSSJzxmrIY8jXZ+iRYcs1S9DBicbXgqefXpU9PGn77E9K0b6HvvAbzL\nW5AkGCGqGYSw+zztc+fAds\/Beu19mBauI2r8Cjwb93Fs6BIZ2imIyNwq0x0INZPxTaMtaVapf\/\/x\nuwC5l1HGNjLh2\/vbN1h7\/hlObmyjbX0b4ugsRI9cgKB\/AczgEqc4Sj8zuIjEc9dhWbsLZuDyvprG\nIU+2UhRrKb2VUJkraR7nZgYE0HpqynRl56Hzs79\/g96LExi7u4OcBopcBDmXzlkwY6ucki7egmLq\nOmKmr6H85hakZ9bBH16G4PQqBO3TkKutUGa6ofKnWlcGSUZR4OzW8uPHMysf38P05m1M3ttFisNH\n1ioLbC+tDGdXwc5cBTu5jNj5NWgoxeKplX1NLIOdXoWYVhB5so0rFKWuHBJaWUQJppqAAd786q\/M\n2vMvMLf9B5z84BE5Fi0B6iDJLYe0qhXSmi7IvL2Q1fVC4e2Hoo5EUVb6hiGr7ISspAGK5AKoCFCV\nU80BitWWmRzHeadfAYEc3fzo2\/GtJ9A46jmXwqaQi04tBOs3A2lkDFILqADsUKSXIlRXAWVqMa3F\nDoRoSqCg9qLUFCPM3EApruVMhFhtnslzX9g1krsOCKC57eTXbSsb4J\/QQEgGgM2wQ5rlgiybljtq\nwiGmun1RpYYa6ZxuxzFKZ0xxL8L0VQjNLEdYLgGaaqiKXRDTAtA+uBI448ok5XwtJoMgIKMg0lg5\nWxWc5YRc7990VyOEIqMy13NSaOxcBEMoouEmL44T8DGCPG6hFcVUC0\/3CO58+MGrpaX1AO3qzOY3\ng2LS\/yJKtRFgzr73SyPAzJ8AqTJVFDlVbj1C\/IXgT6+\/71G6wy1NCKWIhVtbcTy\/GSpqM1ZvH7Lc\nDas8vZ4fEDiexW57JybtO4G\/OafkcYDBmbTPpYXfD6gwVv9Haayh9JJ70RTRvLMjhCD9gFG2DoTn\nNXPyp1hOqRcmmf\/9dqr5U54hv4lntSpfD9DuCeFZSry\/15quHYnP\/pGJy4ZQbaFtpYMDZAlInOn4\nXpxR\/L1\/LsqpWpX+wkgphkJtI7vfgQhbO8JoCigyy3BEY33O0+Uv8vTWcXquh2e1R71+FAs8YnqY\nlpdbXPt2mnnzHXXOi3dSjC+OpuS+OJqa\/+LNLNs1XrZt7g2tZVWUaPoHm5T341vavPeDUi33GUPp\nzSC9Y\/VIdsnqW7qCRZ6xuIOX7zLwitwqys7bgXetNpeUl+9M4uWVqnkOzwmeszr0Z9k9x36h0mol\nL582R355PG\/8luH+By4iPQBI4VEgAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271458803-7862.swf",
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

log.info("npc_shrine_uralia_alph.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
