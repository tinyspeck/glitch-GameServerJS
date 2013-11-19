//#include include/takeable.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Garden Gnome";
var version = "1347677145";
var name_single = "Garden Gnome";
var name_plural = "Garden Gnomes";
var article = "a";
var description = "Hey, it's that weird old tiny bearded life-companion you've been hoping for! When placed in your yard, house or on your home street, your new little chum will reveal his hidden (or \"creepy\") talents…";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["npc_garden_gnome", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.facing_left = "1";	// defined by npc_garden_gnome
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	facing_left : ["Gnome is facing left"],
};

var instancePropsChoices = {
	ai_debug : [""],
	facing_left : [""],
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

verbs.place = { // defined by npc_garden_gnome
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Place it here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// If we have it, then it is ours
		if (this.owner != pc.tsid){
			this.owner = pc.tsid;
		}

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)){
			return this.takeable_drop_conditions(pc, drop_stack);
		}

		var entrances = pc.houses_get_entrances();
		var near_entrance = false;
		for (var i in entrances){
			if (pc.location.tsid == entrances[i].tsid){
				if (pc.distanceFromPlayerXY(entrances[i].x, entrances[i].y) <= 300){
					near_entrance = true;
				}
			}
		}

		if (near_entrance){
			return this.takeable_drop_conditions(pc, drop_stack);
		}
		else{
			return {state:'disabled', reason: "The Gnome can only be placed in your house, yard or on your home street."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg, true);
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

verbs.flip = { // defined by npc_garden_gnome
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Flip me to face the other direction",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
			return {state:'enabled'};
		}
		else if (this.owner == pc.tsid){
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

		var facing_left = (this.getInstanceProp('facing_left') == 0) ? 1 : 0;

		this.setInstanceProp('facing_left', facing_left);

		this.onResetDirection();

		var pre_msg = this.buildVerbMessage(msg.count, 'flip', 'flipped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give = { // defined by npc_garden_gnome
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.takeable_give(pc, msg)){
			this.owner = msg.object_pc_tsid;
			return true;
		}

		return false;
	}
};

verbs.pickup = { // defined by npc_garden_gnome
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
		}
		else if (this.owner != pc.tsid){
			return {state:null};
		}

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.drop = { // defined by npc_garden_gnome
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null}; 

		// Replaced by "place"
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg, true);
	}
};

verbs.teach = { // defined by npc_garden_gnome
	"name"				: "teach",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Teach me a new phrase",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
			return {state:'enabled'};
		}
		else if (this.owner == pc.tsid){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.phrases.length == 3){
			var txt = "I can't learn any more phrases. Pick one for me to forget!";
			var choices = {};

			for (var i=0; i<this.phrases.length; i++){
				if (this.phrases[i].length > 20){
					choices[i+1] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i].substr(0, 20)+'..."'};
				}
				else{
					choices[i+1] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i]+'"'};
				}
			}

			choices[4] = {value: 'nevermind', txt: 'Nevermind!'};
		}
		else if (this.phrases.length){
			var txt = "Teach me a new phrase or pick one for me to forget!";

			var choices = {
				1: {value: 'teach', txt: 'I have a witty phrase.'}
			};

			for (var i=0; i<this.phrases.length; i++){
				if (this.phrases[i].length > 20){
					choices[i+2] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i].substr(0, 20)+'..."'};
				}
				else{
					choices[i+2] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i]+'"'};
				}
			}

			choices[this.phrases.length+2] = {value: 'nevermind', txt: 'Nevermind!'};
		}
		else{
			var txt = "Want to teach me a new phrase?";

			var choices = {
				1: {value: 'teach', txt: 'OK'},
				2: {value: 'nevermind', txt: 'Nevermind!'}
			};
		}

		this.conversation_start(pc, txt, choices);
		return true;
	}
};

function hop_onEnter(previous_state){ // defined by npc_garden_gnome
	if (previous_state == 'idle0'){
		this.setAndBroadcastState('hopStart');
		this.messages_register_handler('hop', 'hop_onMsg');
		this.fsm_event_notify('in_state', null, getTime()+100);
	}
	else{
		this.fsm_pop_stack();
	}
}

function hop_onExit(next_state){ // defined by npc_garden_gnome
	this.setAndBroadcastState('hopEnd');
}

function hop_onMsg(msg){ // defined by npc_garden_gnome
	if (msg.from == 'in_state'){
		if (this.hop_dir) this.dir = this.hop_dir;
		this.setAndBroadcastState('hopLoop');
		this.fsm_event_notify('exit_state', null, getTime()+800);
	}
	else if (msg.from == 'exit_state'){
		if (this.phrases.length){
			this.fsm_push_stack('talk');
		}
		else{
			this.fsm_pop_stack();
		}
	}
}

function idle0_onEnter(previous_state){ // defined by npc_garden_gnome
	this.setAndBroadcastState('idle0');
	this.messages_register_handler('idle0', 'idle0_onMsg');
}

function idle0_onMsg(msg){ // defined by npc_garden_gnome
	//log.info('idle0_onMsg: '+msg);
	if (msg.from == 'player_collision'){
		var pc = msg.payload;
		//log.info(this+' collided with: '+pc);

		if (!this['!colliders']) this['!colliders'] = {};
		if (time() - this['!colliders'][pc.tsid] <= 60){
			if (is_chance(0.25)){
				this.fsm_push_stack('idleBlink');
			}

			return;
		}
		
		this['!colliders'][pc.tsid] = time();

		// *sigh* intentionally swapped because the asset is backwards
		if (pc.x < this.x){
			this.hop_dir = 'right';
		}
		else{
			this.hop_dir = 'left';
		}

		if ((this.getInstanceProp('facing_left') && this.hop_dir != 'left') ||
		    (!this.getInstanceProp('facing_left') && this.hop_dir != 'right')){
			this.apiSetTimer('onResetDirection', 20*1000);
		}

		this.fsm_push_stack('hop');
	}
}

function idleBlink_onEnter(previous_state){ // defined by npc_garden_gnome
	this.setAndBroadcastState('idleBlink');
	this.messages_register_handler('idleBlink', 'idleBlink_onMsg');
	this.fsm_event_notify('exit_state', null, getTime()+1000);
}

function idleBlink_onMsg(msg){ // defined by npc_garden_gnome
	//log.info('idleBlink_onMsg: '+msg);
	if (msg.from == 'exit_state'){
		this.fsm_pop_stack();
	}
	else if (msg.from == 'player_collision'){
		this.fsm_pop_stack();
		this.fsm_event_notify('player_collision', msg.payload);
	}
}

function look_onEnter(previous_state){ // defined by npc_garden_gnome
	this.setAndBroadcastState('look');
	this.messages_register_handler('look', 'look_onMsg');
	this.fsm_event_notify('exit_state_animate', null, getTime()+1500);
}

function look_onMsg(msg){ // defined by npc_garden_gnome
	//log.info('look_onMsg: '+msg);
	if (msg.from == 'exit_state_animate'){
		this.setAndBroadcastState('lookSettle');
		this.fsm_event_notify('exit_state', null, getTime()+1200);
	}
	else if (msg.from == 'exit_state'){
		this.fsm_pop_stack();
	}
}

function onConversation(pc, msg){ // defined by npc_garden_gnome
	if (this.owner != pc.tsid) return this.conversation_reply(pc, msg, "Cheater...");

	if (msg.choice == 'teach'){
		var args = {
			input_label: 'A witty phrase:',
			cancelable: true,
			input_focus: true,
			input_max_chars: 150,

			itemstack_tsid: this.tsid,
			follow:true
		};

		this.askPlayer(pc, 'teach', 'Teach Me', args);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'nevermind'){
		return this.conversation_end(pc, msg);
	}
	else{
		for (var i=0; i<this.phrases.length; i++){
			if (msg.choice == 'forget-'+i){
				array_remove(this.phrases, i);
				
				return this.conversation_reply(pc, msg, "Ok, forgot that one.");
			}
		}
	}

	return this.conversation_reply(pc, msg, "Not sure what you mean there...");
}

function onCreate(){ // defined by npc_garden_gnome
	this.initInstanceProps();
	this.apiSetHitBox(400, 150);

	this.owner = null;
	this.phrases = [];

	this.default_state = 'idle0';
	this.fsm_init();

	this.dir = 'left';

	this.onResetDirection();
}

function onInputBoxResponse(pc, uid, value){ // defined by npc_garden_gnome
	if (this.owner != pc.tsid) return false;

	if (value) value = value.substr(0, 150);

	if (uid == 'teach' && value){
		this.phrases.push(value);
		this.sendBubble('BOOM! Now I know how to say: "'+utils.filter_chat(value)+'"', 5000, pc);
	}
}

function onLoad(){ // defined by npc_garden_gnome
	if (this.current_state == 'idle0'){
		this.messages_clear_handlers();
		this.idle0_onEnter(null);
	}
	else if (this.current_state == 'idleBlink'){
		this.messages_clear_handlers();
		this.idleBlink_onEnter(null);
	}
}

function onResetDirection(){ // defined by npc_garden_gnome
	this.hop_dir = (this.getInstanceProp('facing_left')) ? 'left' : 'right';
	this.fsm_push_stack('hop');
}

function talk_onEnter(previous_state){ // defined by npc_garden_gnome
	if (previous_state == 'hop'){
		this.setAndBroadcastState('talk');
		this.messages_register_handler('talk', 'talk_onMsg');
	}
	else{
		this.fsm_pop_stack();
	}
}

function talk_onMsg(msg){ // defined by npc_garden_gnome
	if (msg.from == 'exit_state'){
		this.fsm_push_stack('look');
	}
}

function talk_onRun(){ // defined by npc_garden_gnome
	var phrase = choose_one(this.phrases);

	// 30ms per character + 1.5 seconds
	var duration = 1500 + (phrase.length * 30);
	this.sendBubble(utils.filter_chat(phrase), duration + 250);

	// switch to look, then remove talk bubble 250ms later
	this.fsm_event_notify('exit_state', null, getTime()+duration);
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

function onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a>, a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"gnome",
	"takeable",
	"no_rube",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-41,"y":-129,"w":83,"h":129},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGKklEQVR42s2XaVCTRxyHrbWtOo7U\neqAc4QpBIBwCImIQDxARExCPABVMBZVDRRQvECJIEDlEcUChaKCIVTwgDgUEKZqCIAqiqKAkRsWr\n9Ug\/tJ9\/3X0JXzvtjDl25plNMjvJs\/9js++YMZ9x7HWfYrTNy7RtjKEOiZ+lOGmBGQxSrojP9j0c\nYI1dPHPDFCxfw22TLLNCgpep4Qmej3INPiHgIMvfCnHzTAxP8PQ6riov0AaH\/CwNT7AqwjXxVKg9\nqOCBxRaGJVjqZ21UIXRWnxDYIne5NVIXGZhgSbBdbflaLo7zbZFDOjiFCEZ7zDQMwaM\/zPU9KnRC\n\/roRsoI42O3DgsjNWP+Cn+7mGCluH1E9vJmBdtlO3LiyA79UxaKmOBJpUZ76Fxzsyk9UPZLh8e0y\nDHVm4eXTVrxRNELVcxTNF1Nx5lROsF4Fe1qPiPP2+aO7IRkP2w7gbEkszpfuQGudBC2y46iuLBXr\nVVAlzwuWX0nEk45MDMjT0V6biLPHwqDsLkC3\/BwuX6jQ34XhVW+Bi\/JGnrq\/TQzF7Rz035Cg99p+\nDDUWYLApG33tZ9DccAk1NaVGOpdT3r8oVnRK1M978kjtZaP5bCyRzMaz7hwobh3GwK8Z+O1qGrra\nr6GmujxRp3IvFPcTq6V56Gk6APmlZDRXbcNAeyZJcxZDX8tBkuLDuFoZxwjqvA6VT3vVdZer0NGY\ng\/oqCcoyt6AsfT3K09fhfEEUieIR9F1PwTVZCdpaZMgvLKjVmdxf6lcur188Ql\/PTQw+7ILyaQ86\n5A1ou16Hu11NuNVSjMqT+yBvvYze7jbcuH4VO1IPITByt6\/OJN8MP1Y9V\/bhpeoBXjx7wMwjr\/sw\nNHgHKkUvFE\/uMIJVlWUI2ZKKlTGp6mWRO6Xufmu13zBvhx\/7vh0ewIfflfj4xzN8eq9iZhrZUdnH\n\/bdQIS1DeEIKhLvysSHtFFZvk8BnVYxujp32Tvm9d68Hof7wHH9+fMHwighSUeWTuygsPgl+9B4E\nivYgPPkownYVICQ+E34RifAKitqgdcHIlGLUNjYx0Xr\/TjESwZePMNDfifiUw1i+IRlBG\/fR1BLJ\n3eBvTmNkSZrhHRQp1aqcu7u1UVhCKqJSS1BTPyL5bKgXz5X3kFtUzMjRdEbsOQ7h1gwE8UOwWPA9\ngmMPkghuh\/fKKO0eO6siN\/mu5gegoake7bfkIE2DgYedaGm6ghXCaAQIN2Nt5Gbwg1chcNF8zOXa\nwsPVGQHh8aQGo9Vab5QYSaW4qFoGWoM0vYOPushxIoNgmS\/cHdiMEM\/dcQSeD3gBoeAFb6SR0039\nbZJUSLfnV+NU1QVcrL2MwpJSrAgNw0J\/Plau3wqBaAdCNu4kTZGBNduzmeZYtj4JPiHRuhGMy61W\npf90E7E5ZxFGOpQ2QFD0fqxLykVMlhRkAwy0kZjujctgGoTWpl+oqNB7jr2F1uSi0ks3JOSfBxXc\nV9bEiMTnnsPW\/AtIOlGH+LyfGbGIPccYqGDo1ixmA\/5rN0m1Hj3h3iIX0r33RqO0JaeKkRqFfka7\nl8rRLg\/fXQjBphQsj0rW7YVBlP6jWCQuU42mdGPm6ZE5oxyi9FKI0kog3HYQS\/hCODg46O\/a7zrb\nWuztswieXgvgOd8HHvMWwIfHw1wnDpw4VrC3Zun\/wcnbzUFKhZztqJA5uLYWzBHjweXAwYZlGM\/G\nPHf7RC+X2XBkW4DLHhGk77m2lmBbmvnqy+trBzbLcY6dlYAcHR1UiqbViUj5ejph6XxXRtTMeFoE\nWWtJMCMYE6YQJhK+0IqU5gdM3R1tDhExUGg6ST0yNefpbMfICZZ4YYGbA6zNZ8rI+uWExbQiCG4E\newI9D6cTJn0uuQmaL6TRcORYmNbTlFI4lqZgs0z+trcxH6bRC1zowYjSiNqYzRwi67fQSxBhtUaW\nR5hD4NDNEuj\/89jPKjh+3LilpjOmVphM\/+7cjKnfVn41dmyCI5v1dB6pPVp\/VNCRbQmWyYz\/Ijj5\nc0Vx3GiKCWyCE8GTsJDgP3nSxARz42kyC1PjfoZZM7omT5qw\/V9SPFVTNloZXxK+IXxLmEVgEaw1\n4jQydprZRhN1E00qx2s2+r\/GP1tdslHGYrfWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291434261-7929.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: true,
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
	"npc",
	"gnome",
	"takeable",
	"no_rube",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "debug",
	"c"	: "flip",
	"v"	: "give_cubimal",
	"t"	: "teach"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "place"
};

log.info("npc_garden_gnome.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
