//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Lem";
var version = "1351536731";
var name_single = "Shrine to Lem";
var name_plural = "Shrines to Lem";
var article = "a";
var description = "This is a shrine to Lem, the giant of travel and navigation. If you've ever found yourself somewhere you didn't plan to be, chances are it was a Lemish practical joke, for which he is utterly unrepentant.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_lem";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_uralia_lem", "npc_shrine_lem", "npc_shrine_base", "npc"];
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

function conversation_canoffer_from_the_books_of_the_giants_1(pc){ // defined by conversation auto-builder for "from_the_books_of_the_giants_1"
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "rituals_of_the_giants_3")){
		return true;
	}
	return false;
}

function conversation_run_from_the_books_of_the_giants_1(pc, msg, replay){ // defined by conversation auto-builder for "from_the_books_of_the_giants_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "from_the_books_of_the_giants_1";
	var conversation_title = "From the Books of the Giants";
	var chain = {
		id: "from_the_books_of_the_giants",
		level: 1,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['from_the_books_of_the_giants_1-0-2'] = {txt: "Beep?", value: 'from_the_books_of_the_giants_1-0-2'};
		this.conversation_start(pc, "Beep. Beep. Beep.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_1-0-2"){
		choices['1']['from_the_books_of_the_giants_1-1-2'] = {txt: "Created had?", value: 'from_the_books_of_the_giants_1-1-2'};
		this.conversation_reply(pc, msg, "Prepare for Today’s extract from the Book of Lem is taken from Sector 314, Latitude 4.2, Node 6. \"And so it did come to pass that Lemuel, son of Lemuel, did become the very first giant to lay down his world-sized tools and close his brobdingnagian eyelids, and slip from the greyness of the real world, and start to roam mindfullingly through the world the giants created had...\"", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_1-1-2"){
		choices['2']['from_the_books_of_the_giants_1-2-2'] = {txt: "Ohhh...", value: 'from_the_books_of_the_giants_1-2-2'};
		this.conversation_reply(pc, msg, "\"...And roam he did until he knew every corner better than anyone imagining, imagined or imaginable - giant, critter, bureaucrat, spirit or world-liver. And thus did Lem become the Giant of knowledge, of directions, and of advice.\"", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_1-2-2"){
		choices['3']['from_the_books_of_the_giants_1-3-2'] = {txt: "Wow.", value: 'from_the_books_of_the_giants_1-3-2'};
		this.conversation_reply(pc, msg, "Thus endeth the extract. Time to leave. Beep. Beep. Beeeep.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'from_the_books_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "from_the_books_of_the_giants_1-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"from_the_books_of_the_giants_1",
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
		"This?! This is all you're giving me? Shazbot!",
		"Smeg.",
		"Seriously? This? Tanj.",
		"Feckik.",
		"Call this a gorram donation?",
	],
	"donated_item_tier2": [
		"Hab SoSlI' Quch! Just kidding. This is an ok donation.",
		"Well frell me dead, kid: this isn't all bad.",
		"\"Donation: an act of generosity.\" Generosity? Ringing any bells?",
		"Not terrible, but barely worth a diddly-doo, kid.",
		"Not bad. Not the kick in the mivonks I was expecting from you.",
	],
	"donated_item_tier3": [
		"Not frakking bad.",
		"Pretty smegging good, kid.",
		"Well diddle my doo, little'un! This is worth somethin'.",
		"Frunge, little one! This is a pretty good little gift!",
		"Feetal's Gizz, petal, Lem is pleased with this.",
	],
	"donated_item_tier4": [
		"Yippy Ki-yay, Muddyfunster! Lem loves this. He Lemves this!",
		"Holy Zarquon's Singing Fish, child! THIS is what I call a donation!",
		"One of these?! D'Arvit, little one! This is VERY GOOD.",
		"Belgium! This is BRILLIANT. Good donation, smallfry.",
		"Well, – –, kid! This is one – of a – ing donation!",
	],
	"super_donation_20x_xp": [
		"By the power of LEM!",
		"Well floop, young'un. I'd hug you, but instead, take this.",
		"Once in a Gorram century, kid, I just like giving you a little extra.",
		"#@!$%&*!!! Yes! Lem rewards you!",
	],
	"super_donation_5x_xp": [
		"Farathoom! For once, you deserve extra reward, kid!",
		"Grabbaga putz, little wanderer! Let Lem reward you a little!",
		"Holy Poozer, glitchling, you deserve a little boost.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-162,"w":122,"h":162},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALSklEQVR42rWXWUxbZxbHPdNKbRPw\ntX2NN0wgQICwGDBgbDC2MdhsNsYGs4PZIexLEqCsCQRCAiEhNGk2IIUshCZMk5J2pho10jxVGqmd\neZo+VKk0L\/MWzdNI8\/Kfcy9VpT5UIxpzpb+ufe17v9895\/vO+X8CwW842r76iml58cLS\/Px5Sdve\n3tRB1P7iRaLgMI7Wly\/NrXsv1is\/2XxddGcNhiuriD13GeGTCwgaPAdx3xTEvZMQd4xA3DUGUeeH\nEPVMgKFrgR3DkHSNIHx8Hnlzi8je2HxdtrOz0bK353prsOa9vdCW5599697cROhZguinQQem6TwN\nSfc42PZhsM1DYBv6IfX1Iai+l5eUE12T1HVD6GlAQEk9jpbUIbB5EMLhOTAz12H\/ZAttn794\/ZtA\nuTRyEat4+ABxs5dwtPtDBLQMQNgyCFHTANiW0zxEUHUnZN5WBDlrIXP5oCDJHTVQlDRAVuJDUGkz\nZJUdYMtbIa7uAEP3ik6NgDk9C2b6KqKu3UbVzg64sQ4GuPdi1762DtHp8Z\/gBhFQ0YpAVy0YZzVY\nVx2CCESWVw6pyQGZyQlZZiFkGfmQZxRCbqRrnMzFkOV4+Bdg3Q0QUzTFDX189EUEKRyZh3BwHO71\nDRwIsPbhY5Rvb0M+PLsPV9sJYWkjRNlOiFLNEGkMEJ9MgThGC3F0EsRRiRCf0PxS3DXuN\/qPJEEP\nUVImxFkFkFBkRRVtEFJEA3w90C5eR9ve5wcDjK\/tflP7aJu\/0XbzLk4O0KTPtBMYDRSXtg8XnbwP\nEZkAya+I+20fNHn\/HrpXlGLCicZOWC5fQ83Op\/wYNQ8eHQxQ1zO2ddzTAsPoLGoeP+Ef0vTsGUpW\nVknXkdk7iJPFFYguKEF0fvH\/VVpzB4wDZ+H+6GM00nO453FqePoU2s4zND2cBwM09Iya4339kOfT\n5Hc0QTN0DoaGLpRvPeYf7Hu8\/fMgv6bm3V2Urd5Ey\/Pn\/HfXwhX+muf2GsznLiKGnicyFIIlOJW1\n7M2BV7Kua3TrmLMBikIfrchWRFR3Q1ozBHXnNIL7LuDE+FVETq8i4vwNRExcRcTYJUSO7yt89CLC\nHXWILa5D5sQ8jrefhbquBwG2SgRkuRBoLAZjKIBYnw9VjheqLPfBS404xcuktg9\/q6Io8pCuVkhL\nOyGtGoCk9gwkTVSQWybBtE9D1DWHow0jCKg\/s6+6IQRUDyCwsg\/C8h4EFvkQSCCBFg+EBCfSE5zO\nTnClCCuqW36rYp3Y1L8bnEe1raAOcmcTZO52BHm7wVZSIa4eBOsbptIxDKb0FIQl7XTu5D8zHvpM\nkRfmVe+DZVHUMoog0uUTXB7kWSUU5fo+v7S6hKpTy6qcCihIMns1ZAX1fNpZRwMkBC1xNkNUWA9R\nUcO+6GXE9B+GoiYkKJbguIUgpbSyFD2l2bOrtHpC\/dqPI52N5rjK\/tcxFKEwgpAZXTQwyewGaymD\nJLsMrNXLS2JxQ0ypjKCXSG6ZQubAMiov3Ud0Yc0\/1dlus+CwjtzhW0zd4sZu391nqL3yANElbWDT\nbJCmF5DyINXTqqT0SUnh9BK6rgVo2+eRTueSyesYe\/iZr8Qx0+d2zh0epDDeONW\/uITeq6tQU5kQ\nxeipc6TtKyKFFxOWCHmcEWltMzygcWAJjsHzb3744Qemomxu2V004zs0QFmabaO09wzqpxYQEK1D\nYGQqhMeTwBxPJrAkiH5SYHAc1LQgUk8twDK0jDMf3celuRvmywvXpgSHeSjS878zUB89WUT2Kd6I\nwBgDmNhMiKL1YCJJUelgTpBCNRARdHrPIlJ9Z3F7ZxtPnmx+3Ts65EuornAdCtwRaYhKqS\/4r1xX\nCGGCGYyGjEOSFUxiDph4M8R0Fida+TNzQsdHNtJeh6zuOXx4bwdffvlybGJlzpzi9TKHFL3cRrk2\nB6w2H4E0xzg4UQy5FK0dbCo5FbouSc2HNLUIsiQ7pDFGyOKykUw1s\/byOsRqreZQ0xucWfhYkpBN\nkbNAqDHRKq5HDHnEWE8jYkubcNxaBgXBBuscUKcVQUH\/lcdnQ3rSiJxTE5DGmqoPFVCaaP6XON5E\n6TUhoaoV0eSolVS4FVT7lLYqqHIroaQOoTJ7flYU57ZjzQg1UKHW5m8eGlxgjC5KRAtCnJwDYZQO\nwTS4gmpdQtMgYur7+H6toG7CSc61RWqPnBS51HnirJBpchGU5nzjV6iy2CwXJx4wSueTpdrAJmZD\nGJmGiIoOBBW3IH1wCrmXrsM0MQelpw1BrhbaDjSSzW\/mxUGqM7wINpZDaXDTvLUl+Q2wPN405Y0z\nLQ\/fesJYOsbWw0wlYGONBKgDW0CbovJe6EbmEN58BoZzS0gYPA8pGQnOTEh5U9GFIIqy2uCBPCGX\nzi6KYkGfX6NYr7P7JuaXZk+tbqFi5iYUyTaIqM6xxa2QkD+MOzuP0rVNnDx9gczoBopv3IVj9Q6y\n5lcR0vIhpGTTQjLLacHkQq7Jgcro2fUr4JW1h+aLU1O4en8dzVfvI2\/oEu0zMsCWdUFMVkvSNA79\nxRsI652F594WvOtbvFc0LtyEvHWCbFkfjpkqoUihnV+8FcesFa\/9BmcfnEhcef7cvPbnP2Hy9k30\nfPwQtUubkMaZIK7qh6hzlva5MwjqmUPB6l34Hu3AeOUuooapvS3fI0M7ATGZW1WqEyEWMr4ptCXV\nF3P7j9\/5yb0MM\/ahMd\/e377B9Zdf4PTaNlpXtyGJ0iNq6AKEvQtg+hdRfGcLxRtPkLa0Btf6Y+R9\nvAX7jU0wfZfANI5CkWijKFZTesuhtpTTPM5O9wug7cyE+crOY9cXf\/8G3fNjGLm\/g6x6ilwEOZeO\naTAjK7yEZ69Bf\/k28m8\/gGL8I\/q+gsDBJf4sbJuEQmODKt0DNZdqQwmkaQX+s1tLT59OLX+6hcn1\nuxjf2kWS00fWSg+2mzrDuRWwU1fBji9BfX4F0ukVSCaW9zW2BHaSvlMHUSTa+YWiMpRCSp1FHGeu\n8hvgra\/+ylx\/+UfMbP8Bp+89IceiI0ADpNmlkFW0QFZ1CvLabshruqGs7YWyhkRRVvkGIS\/vgLyo\nHsrEPKgJUJ1VyQNKNNapLOesi5NfIIfXH307uvkMWmcd71LYJHLRyflgOTOQQsYgOY8WgAPK1GKE\nGMqgSi6kXuxEsLYISiovKm0hQi31lOJq3kRINJapHM+FXRO5a78AWlpPf926vIbA41qIyACwaQ7I\n9G7IM6jdUREONtfsi1ZqiInOqQ4co3RGF3YjNLMCIemlCM0mQHMVrWI3JNQA2vqX\/WdcmYSsryVk\nEIRkFMRaG2+rgvQuKDK5TXclgikyaksdL6XWwUcwmCIabq5FGAEfI8gwK3UUczW8nUPY+OTem8XF\nVT\/t6iyWdwOiU\/8iTrYTYNa+90shwPSfAGllqily6uw6BHMLgUsvV\/co3eHWRoRQxMJtLQjLbYKa\nyoyttgd6T\/2KIDMz0C9wAqvD\/kF0yndCrjgn5fCAQem0z6XGzwEqTZX\/UZmqKL3kXrQFNO8cCCZI\nDvCEvR3hOU28uBQrKPWiBMu\/30+2fC4w5jYKbDbV2wE6vMECa1Ht73Xma0diM35kTmZApLHSttLJ\nA7IEJEl3fi9JK\/yem4sKWq0qbmEkFUKpsZPdb0eEvQ2hNAWU6SU4orW9FBhyLwsybaP0XK\/A5jjx\n9lHM80roYTpBdmH1+ymW9Q80Wa8+SDK9OpqU\/epocu6rd\/X2a4IM+8w7OuuKON78DzYh58f3dDl3\nApKtDxhj8a2ATOfKkYyilfcMeZcFpsJ2Qa7bKCjwqCk77\/vftdrdMkGuK0GQU6wROL3HBa7KkJ\/l\n8B77hYorVYJc2hxx8nrf+S3D\/Q8P1Do7QZ204QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-04\/1271458869-5141.swf",
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

log.info("npc_shrine_uralia_lem.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
