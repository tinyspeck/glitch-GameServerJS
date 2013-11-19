//#include include/shrines.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Shrine to Grendaline";
var version = "1351536731";
var name_single = "Shrine to Grendaline";
var name_plural = "Shrines to Grendaline";
var article = "a";
var description = "This is a shrine to Grendaline. Quietly loyal and fierce, Grendaline is the giant who governs all things watery, from clouds and fogs to mountain streams and oceans. As a sideline, she is also influential in the sphere of big, fluffy towels.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = "npc_shrine_grendaline";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_shrine_ix_grendaline", "npc_shrine_grendaline", "npc_shrine_base", "npc"];
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

verbs.slather = { // defined by npc_shrine_grendaline
	"name"				: "slather",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Slather the Shrine in Jellisacs",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.getQuestStatus('jellisachands_donate_jellisacs') == 'todo' && pc.quests_get_counter('jellisachands_donate_jellisacs', 'super_harvest_jellisac') > 0) {
			return {state: 'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.showSplatterOverlay(pc);

		pc.quests_inc_counter('jellisacs_slathered', 1);

		pc.removeItemStackClass('jellisac_clump', 4);

		pc.sendActivity("You slathered 4 Jellisacs on the front of the shrine. Grendaline will be so pleased! But eww, gross, your hands are all sticky.");
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

function conversation_canoffer_rituals_of_the_giants_1(pc){ // defined by conversation auto-builder for "rituals_of_the_giants_1"
	var chain = {
		id: "rituals_of_the_giants",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "voicemail_of_the_giants_3")){
		return true;
	}
	return false;
}

function conversation_run_rituals_of_the_giants_1(pc, msg, replay){ // defined by conversation auto-builder for "rituals_of_the_giants_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rituals_of_the_giants_1";
	var conversation_title = "Rituals of the Giants";
	var chain = {
		id: "rituals_of_the_giants",
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
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['rituals_of_the_giants_1-0-2'] = {txt: "123?", value: 'rituals_of_the_giants_1-0-2'};
		this.conversation_start(pc, "... Bzzzzzz... testing... testing...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-0-2"){
		choices['1']['rituals_of_the_giants_1-1-2'] = {txt: "Consider me upstood.", value: 'rituals_of_the_giants_1-1-2'};
		this.conversation_reply(pc, msg, "...All ... *click*... All be upstanding for the Grendalinian Anthem.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-1-2"){
		choices['2']['rituals_of_the_giants_1-2-2'] = {txt: "Wait, whu?", value: 'rituals_of_the_giants_1-2-2'};
		this.conversation_reply(pc, msg, "...Nyaaaaaaaaarrrrrrrrk... guk-guk-guk-guk Grendalina HUH!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-2-2"){
		choices['3']['rituals_of_the_giants_1-3-2'] = {txt: "This is terrible.", value: 'rituals_of_the_giants_1-3-2'};
		this.conversation_reply(pc, msg, "Fnnnnnnnnorrrrr... schmik-schmik-schmik-schmik Grendalina PNANG.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-3-2"){
		choices['4']['rituals_of_the_giants_1-4-2'] = {txt: "Please stop.", value: 'rituals_of_the_giants_1-4-2'};
		this.conversation_reply(pc, msg, "Nork-podge-geesh-wang Grendalina HEY.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-4-2"){
		choices['5']['rituals_of_the_giants_1-5-2'] = {txt: "Wow. That’s a doozy.", value: 'rituals_of_the_giants_1-5-2'};
		this.conversation_reply(pc, msg, "Grendalina, Grendalina, ONK ONK ONK.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-5-2"){
		choices['6']['rituals_of_the_giants_1-6-2'] = {txt: "With pleasure.", value: 'rituals_of_the_giants_1-6-2'};
		this.conversation_reply(pc, msg, "... Grendalinians, stand down. All, stand... *click*... stand down.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rituals_of_the_giants_1', msg.choice);
	}

	if (msg.choice == "rituals_of_the_giants_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"rituals_of_the_giants_1",
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
		"Meh.",
		"This is a donation? No, this is a washout.",
		"This could be so much better.",
		"With this, you have barely dipped your toe in Grendalinian gratitude.",
		"Grendaline is disappointed. Grateful, but disappointed.",
	],
	"donated_item_tier2": [
		"Wishy-washy, as donations go.",
		"Grendalinian gratitude laps against your knees for this.",
		"Mediocre, but Grendaline still smiles upon you.",
		"Grendaline is mildly pleased. This could be so much worse.",
		"Grendaline stands by you. Even though you only gave this.",
	],
	"donated_item_tier3": [
		"Grendaline's heart begins to swell with pride.",
		"This couldn't be much better. Good donation.",
		"Grendalinian gratitudiness washes over you for this.",
		"Grendaline is pleased. You are favored.",
		"This is the kind of thing that Grendaline likes.",
	],
	"donated_item_tier4": [
		"So generous!",
		"This is so much better than other donations. Grazie.",
		"You shall be pummelled with waterfalls of favor.",
		"You are verily swimming in Grendalinian gratitudiness for this.",
		"Donations like this are why Grendaline loves you the most.",
	],
	"super_donation_20x_xp": [
		"WOOOOSH! What was that? Yes. The gratitude of Grendaline.",
		"And thusly are you rewarded for your generosity.",
		"Grendaline loves you, little generous one.",
	],
	"super_donation_5x_xp": [
		"A deluge of gratitude for you.",
		"The tide of Grendaline's gratitude is extra high today.",
		"Wade in the gratitude, generous little one.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-84,"y":-216,"w":169,"h":216},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHkUlEQVR42s2Y2VNTWR7H\/QOminnp\nZ2se5mWmqqmahym7pm1cm5lmCUuTNGtkEUR2BMIeQggEQogsAREwiii2KEF2W+EiEhEkJCRhM0C0\nxQ0awiKCMw\/fueciaRWmayaTzPSt+taF5OZ3Pue3nPM7d9++\/8M1d63OcUpeHLfv13gROINMZNYX\n5vB\/zXCYrJIqbGIUs7MORLawRbxG4IhmLldT5LMRn3CHl835XGMJj2W10SfKRo0tILXiLKVeIoBW\nkI6Z2mLT6JkoSp8ZD03saevycVYsdhgr4JvHS0SYri1XWgtGvDQhSIjTZSaYtcnRUMdEoi+Ai3sB\nJ4isz8VhYXrcTkimzp017fWMruiw06caFTizZqti+brMeGo4PNw8ePIkBrmhGAgMtug+rQfcEDOB\ntwpuKCDEUSfmUdOl2Zgu48NYlQdTTSafaLYsTTYhSqIIgE5yFE8VHnjWwMaL5lCYB3IxdyUMqngW\n7voFMSJwO+qISmTgmP+DQrlWe0\/lF7p\/Z4C9RPlzmUEeZvwZK42eeF3rgZlyX7z8PgLjxccwJghj\nQFRBIcydhJPchyIioUpMwEhUlPVwbRyOY48f10SME4i2uFQLEFEfPRgR+X4HcDTLDToRGw8y\/TB1\n1pm+c0zfe\/tQdW4eygvuntwyL7cDrbGncT0sGB0pibAa7pKbJ4s2au76LgCtbF+0+GyrneMH8lkb\n2w\/XvHwYNXlzTH3xfzIv1btDK3TF\/Xgv2oPhmK3xwni560fJ35uW4DRcwMdYkQDG+mqTzRbX9jMx\nVGt0BK6Hh6IpPGxXxXWf+B2lz\/kaAwmuUGf7YCiL9mAlB3rJEf7HxSRwMkhyYZAK8Vghp2wG2JeR\nJHtEz3ykKBdD2Sm7AG+4\/JZ6UXkM85UszJR9hx8vheHZ1cBdgD2ZScwibSgW4umtRtttc\/cFvLiJ\nskJMVZVgokKya+b9iZ8rDLKvQap5R5qCQ1ALv\/wIYkiYzgBOlIrpXeS87RqF3qxkp8kKCchiTc\/e\n6tA8EmUoSIiJrYnKIiebAd7h8Rx0tFESGqOi0urqu8fnUXq6QKarz4LsUDbtQsbosBikeSAesNaG\nWpRJkX2YeNDmbZKhppwicCR\/5rtvOloV4rxM8\/aWKaNsDqiVSxXjMhHjQWvzRyVI297Tz5cpbA6o\nKZfwp6qkDOB0dQmXrGlEerGANBP8SbmEPyxMVXSnnqR21FOQRPUX0HlXmKM0Kqr4Olk+A0ietTlg\nfzaPpSuTMEtNd2o4yk4cgTTwILK8P\/+3VOB7ALryQmj5GTBeqWHZHPB+Ls9xIDcLraGh0BSL8EN+\nOs6d9qch3ZDC+nJPyUO80RQdgr7kWAzFxmx3NVHRIJ63y3liuKQAF909Uc\/yYnTDzx8tQUHoCg7G\n7RAahO75BiIi8PBUJKigYPTSzQVpKG77BqIzgI0hUQhGxTzss9dlOF+quRbggStsV1zluDL3hvci\nf7f4e6LnFBe9wRx0h7JwL5ENVQ4b04qTWOzhYeVBNugDk8lugNoqKdWbxkFL3AG0xh9Ae+IX6Ez5\nC7p4B9GV+hXuZh3BkMQFMwpfLLSEY70nAYtdMVjp42HtQRbmlWnQiXMouwGOVZfyDbIcqDIPY0p8\nCHPSo3ST6oLlK9543eCDlZuBWG4+geXWMJg7IxnApR\/isdybjNWBDExXJkFXmCOzG+CAII1Lqngk\nNwhqwVeYKz6K51V\/w1KDF366yv5FwCcNp5glhixLdgPsFyQ7jcuLmYEGBSyNXnQIs7QXXyncdwH+\n1BaBldsxeHUjjD7H+GgGcpKYXcRuFWxpOul9lAxEFl5VxkGWNu8Q9VhyDM8qXfCizhPPFd9i\/oIP\nZuUeMJa7m2Yq3JlzhyonlfndRHHefrsCjkpyGU9M0\/lo6VIyDlKP8o9DXeiMYVrqEjdM1XKovbY5\nu79bUcsKKGY\/lRdbDvFzsuOU+RoHKzcCsNgUyIR4pTPSspy08aIdh4QZ9q1gS1eclyEjjeuHHQkB\nXG5k\/wx4iy6SjlMWb7Umxzip87OIB5V2ByTtP\/HgeFmh6UPA15e\/ZQAX3gOudp22AN5KimW9B7Tf\n67Z3+nOO\/5iodDIpxXHGCwUfNZ1Py53NnwKudUdZvu9IiecbpDn4salQRmwQ0Yeb\/75YtqZqWO+M\njbKtx5dNWxPnsaEts2htpITRYj8dbrqKFy567QJc7M8zffgbi8bk+Ptcs\/md6SYfs9XWtf7rVKhi\nQ3UGm9pibE3WYcNQizfactp4Od7qKrCplzODLVC50IiO4EmpM17UeuDlJTZeXfXHWCkLC3252xNR\nyywTeqOtwNvJemwZr2NrSoE3A4mmP3z22W\/+85NcyeE\/vm7+JnmxxaVjrcMN63f8sKFKxNsRIQ1X\nga3xKgb0jaaUBhFi\/GKYRSZlIlaHpT9PZvzc9vOaImw8TMf63UCsdrhq1jtc+eudbrZZuGlI1lq7\nm2y13dVEgDceCbFn+D7QJkmLwRSs3WZj6Zbr8wWli3y+6a8+uHPMwa6VvNnxzf6Xd2I1mxoJ\/qXo\n1Hg7KoamPqBu4sLx3\/\/PX4YvtbjIiCd\/STPXOYNW5dcn1z8Bh9Bdt089AdYAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268361130-1945.swf",
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
	"t"	: "slather",
	"k"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_shrine_ix_grendaline.js LOADED");

// generated ok 2012-10-29 11:52:11 by lizg
