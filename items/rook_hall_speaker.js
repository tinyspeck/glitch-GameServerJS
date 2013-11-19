//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Audio Info";
var version = "1344982233";
var name_single = "Audio Info";
var name_plural = "Audio Info";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rook_hall_speaker", "quest_npc", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.npc_name = "";	// defined by quest_npc
	this.instanceProps.sound_name = "";	// defined by rook_hall_speaker
	this.instanceProps.duration = "0";	// defined by rook_hall_speaker
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	npc_name : ["Name of this NPC as referenced in the quest."],
	sound_name : ["Name of the sound to play when the button is pressed"],
	duration : ["Duration to play sound\/other stuff"],
};

var instancePropsChoices = {
	ai_debug : [""],
	npc_name : [""],
	sound_name : [""],
	duration : [""],
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

verbs.push = { // defined by rook_hall_speaker
	"name"				: "push",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Push the button to learn about this exhibit",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiSetTimer('pushed', 1000);
		this.setAndBroadcastState('press');

		pc.sendActivity("You pushed the button.");
		return true;
	}
};

function finishPlaying(){ // defined by rook_hall_speaker
	this.setAndBroadcastState('stop');
	this.apiCancelTimer('finishPlaying');
	this.doQuestCallbackAll('buttonFinished', {name:this.getName()});

	this.container.apiSendMsg({type: 'overlay_cancel', uid: 'rook_painting_overlay'});

	if (this.getName() == 'button_5') {
		this.stopShrineAnimation();
	}

	this.playing = false;
}

function injectSubtitles(){ // defined by rook_hall_speaker
	var npc_name = this.getName();

	if(!this.subtitles || !this.subtitles[npc_name]) {
		log.error("Voiceover subtitles not found for npc "+npc_name);
		return;
	}

	for(var i in this.subtitles[npc_name]) {
		var title = this.subtitles[npc_name][i];
		if (title.delay) {
			this.events_add({callback: 'msg_local_chat', txt: title.txt, label: "Loudspeaker"}, title.delay);
		} else {
			this.msg_local_chat({txt: title.txt, label: "Loudspeaker"});
		}
	}
}

function msg_play(details){ // defined by rook_hall_speaker
	this.play();
}

function msg_stop(details){ // defined by rook_hall_speaker
	this.stop();
}

function onPlayerEnter(pc){ // defined by rook_hall_speaker
	if (!this.subtitles) {
		this.subtitles = {
			'button_1': [
				{delay: 1, txt: "Back in the early ages of Ur, when small islands formed spontaneously from the primordial chaos, only to be rendered unrecognizable moments later by the constant ebb and flow of imagination, the ancient Glitchian tribes suffered under constant threats to their very survival."},
				{delay: 18, txt: "There was the instability of the environment, the paucity of piggies—not to mention going to sleep every night without knowing what shapes or substances their meagre huts might be when they awoke—"},
				{delay: 28, txt: "But by far the most dangerous and terrifying of these was the Rook."},
				{delay: 33, txt: "THE ROOK, enemy of imagination, visited its wrath upon whatever the Giants’ minds created."},
				{delay: 39, txt: "It was the very manifestation of fear, doubt and uncertainty."},
				{delay: 44, txt: "It pecked and clawed relentlessly at the periphery of the Giants’ domain, black winter to the Giants’ spring of creativity."},
				{delay: 51, txt: "It was, if I can say so myself, most awful."}
			],
			'button_2': [
				{delay: 1, txt: "Noticing the capability of a particularly strong, focused and concentrated burst of imagination to temporarily stun The Rook, ascetics and yogis of the Meadow Tribes set to work to develop a more reliable method of harnessing this defensive action."},
				{delay: 14, txt: " Employing the recent technological breakthrough of spun-crystal focusing orbs they learned to draw the small imaginations of individual Glitches together and blast the rook into stillness, at least temporarily."},
				{delay: 26, txt: "They gave this discipline the name of ‘Martial Imagination,’ and the image preserved in this display shows an elder Glitch in early times leading imaginators to defend against a stream of Rook attacks."}
			],
			'button_3': [
				{delay: 1 , txt: "While the lustre of this ancient focusing orb has faded with the passing of generations, in ages long past, its flawless surface of spun crystal acted as a nexus for the imaginations of our Glitchian ancestors, and as a potent weapon against the Rook."}
			],
			'button_4': [
				{delay: 0, txt: "Generations struggled to find a way to fight back against the Rook and end its destruction of creativity."},
				{delay: 7, txt: "No progress was made until the extraordinarily Pious Esquibeth of Inari discovered that her will alone could turn a normal shrine into a weapon, harnessing the direct conduit to the minds of the Giants to return fire instead of favor."}
			],
			'button_5': [
				{delay: 2, txt: "The holofilm which follows demonstrates a pious primitive priming the shrine for an attack."},
				{delay: 8, txt: "Discovered half-buried in a rock face at Ekorran Roughs, it would be easy to overlook the coarse stonework of this ancient shrine as simply another natural feature."},
				{delay: 16, txt: "But while the crafts of ancient Glitchian tribespeople may have been rudimentary, they still excelled in their piety and devotion to the Giants."},
				{delay: 24, txt: "This shrine would have played an integral role in the everyday ceremonies of village life."}
			],
			'button_6': [
				{delay: 1, txt: "As ancient legends tell it, these battle plans were recovered from an abandoned nest after a series of courageous attacks repulsed The Rook entirely from the Isle of Uralia."},
				{delay: 11, txt: "Though its true provenance has never been proven to the satisfaction of all skeptics, most now believe it to be a genuine artifact — indeed, the only such artifact ever to fall into Glitchian hands —"},
				{delay: 22, txt: "And the only example of Rookish script ever seen."}
			],
		};
	}
}

function play(){ // defined by rook_hall_speaker
	var sound_name = this.getInstanceProp('sound_name');
	var duration = this.getInstanceProp('duration');

	this.setAndBroadcastState('play');

	// First stop any other speakers in the location
	var items = this.container.getItems();
	for(var i in items) {
		if(items[i].class_tsid == 'rook_hall_speaker' && items[i].tsid != this.tsid) {
			items[i].stop();
		}
	}

	if(sound_name) {
		this.container.announce_sound_to_all(sound_name, 0, false, true);
	}

	this.playing = true;
	this.apiSetTimer('finishPlaying', duration * 1000);

	// Handle overlay
	switch(this.getName()) {
		case 'button_1':
			var overlay = 'rook_hall_painting_01';
			var x = -1180;
			var y = -190;
			var move = {type: 'move_avatar', x: -1036, y: -141, face: 'left'};
			break;
		case 'button_2':
			var overlay = 'rook_hall_painting_02';
			var x = -469;
			var y = -189;
			var move = {type: 'move_avatar', x: -372, y: -141, face: 'left'};
			break;
		case 'button_3':
			var move = {type: 'move_avatar', x: -16, y: -125, face: 'right'};
			break;
		case 'button_4':
			var overlay = 'rook_hall_painting_03';
			var x = 541;
			var y = -189;
			var move = {type: 'move_avatar', x: 696, y: -136, face: 'left'};
			break;
		case 'button_5':
			this.playShrineAnimation();
			var move = {type: 'move_avatar', x: 1217, y: -94, face: 'left'};
			break;
		case 'button_6':
			var overlay = 'rook_hall_painting_04';
			var x = 1750;
			var y = -187;
			var move = {type: 'move_avatar', x: 1886, y: -133, face: 'left'};
			break;
	}

	this.injectSubtitles(this.getName());

	if(overlay) {
		this.container.apiSendAnnouncement({
			type:'location_overlay',
			swf_url: overlay_key_to_url(overlay),
			uid: 'rook_painting_overlay',
			x: x,
			y: y,
			at_bottom: true,
			dont_keep_in_bounds:true
		});
	}
	if(move) {
		this.container.apiSendMsg(move);
	}

	this.pushed = true;

	// Do button pushing callback stuff
	this.doQuestCallbackAll('buttonPushed', {name:this.getName()});
}

function playShrineAnimation(){ // defined by rook_hall_speaker
	var items = this.container.getItems();
	for (var i in items) {
		var it = items[i];
		if (it.class_tsid == 'rook_hall_shrine_holofilm') {
			it.setAndBroadcastState('stop');
			it.setAndBroadcastState('play');
		}
	}

	this.apiSetTimer('playShrineAnimation', 8000);
}

function pushed(){ // defined by rook_hall_speaker
	if (this.playing) {
		this.stop();
		this.play();
	} else {
		this.play();
	}
}

function stop(){ // defined by rook_hall_speaker
	var sound_name = this.getInstanceProp('sound_name');
	this.container.announce_sound_stop_to_all(sound_name);
	this.apiCancelTimer('stop');

	// Also remove any pending events
	this.events_remove(function() {return true;});

	this.finishPlaying();
}

function stopShrineAnimation(){ // defined by rook_hall_speaker
	var items = this.container.getItems();
	for (var i in items) {
		var it = items[i];
		if (it.class_tsid == 'rook_hall_shrine_holofilm') {
			it.setAndBroadcastState('stop');
		}
	}

	this.apiCancelTimer('playShrineAnimation');
}

function doQuestCallback(pc, quest_id, callback_id, details){ // defined by quest_npc
	if(!this.container) {
		return;
	}

	this.container.quests_do_callback(pc, quest_id, callback_id, details);
}

function doQuestCallbackAll(callback_id, details){ // defined by quest_npc
	if(!this.container) {
		return;
	} 

	this.container.quests_do_callback_all(callback_id, details);
}

function getName(){ // defined by quest_npc
	return this.getInstanceProp('npc_name');
}

function handleDelayedMessage(msg_type, details, delay){ // defined by quest_npc
	log.info("Quest NPC "+this+" received message "+msg_type);

	var msg = 'msg_'+msg_type;

	if(!this[msg]) {
		log.error("Invalid message type "+msg_type+" invoked on NPC "+this);
		return;
	}

	details.callback = msg;

	this.events_add(details, delay);
}

function handleQuestMessage(msg_type, details){ // defined by quest_npc
	log.info("Quest NPC "+this+" received message "+msg_type);

	var msg = 'msg_'+msg_type;

	if(!this[msg]) {
		log.error("Invalid message type "+msg_type+" invoked on NPC "+this);
		return;
	}

	this[msg](details);
}

function moveComplete(){ // defined by quest_npc
	this.doQuestCallbackAll('onMoveComplete', {npc_name:this.getName()});
}

function msg_complete_quest(details){ // defined by quest_npc
	if(!details.pc || !details.quest) {
		log.error("complete_quest message invoked on "+this+" with incorrect parameters.");
	}

	details.pc.completeQuest(details.quest);
}

function msg_conversation_start(details){ // defined by quest_npc
	var conversation_runner = "conversation_run_"+details.conversation;
	if (this[conversation_runner]){
		this[conversation_runner](details.pc, {});
	}
}

function msg_face_direction(details){ // defined by quest_npc
	this.dir = details.dir;
	this.broadcastState();
}

function msg_give_item(details){ // defined by quest_npc
	if(!details || !details.pc || !details.class_tsid || !details.num) {
		log.error("Invoked give_item msg on item "+this+" with incorrect params."); 
	}

	details.pc.createItemFromSource(details.class_tsid, details.num, this, details.destroy_remainder);
}

function msg_itemstack_bubble(details){ // defined by quest_npc
	log.info("Itemstack bubble invoked with params"+details);

	if(!details || !details.txt) {
		log.error("Item "+this+" received invalid params to itemstack_bubble message");
		return;
	}

	if(details.bubble_time) {
		var time = details.bubble_time * 1000;
	} else {
		var time = null;
	}

	var options = {};

	if(details.delta_x) {
		options.delta_x = details.delta_x;
	}
	if(details.delta_y) {
		options.delta_y = details.delta_y;
	}
	if(details.dont_keep_in_bounds) {
		options.dont_keep_in_bounds = true;
	}

	if(details.pc) {
		details.pc.announce_itemstack_bubble(this, details.txt, time, true, options);
	} else {
		this.container.announce_itemstack_bubble_to_all(this, details.txt, time, true, options);
	}
}

function msg_kill(details){ // defined by quest_npc
	this.apiDelete();
}

function msg_local_chat(details){ // defined by quest_npc
	// Display text in local chat

	var label = details.label;
	var tsid = details.label;

	if(details.pc) {
		details.pc.apiSendMsg({type: 'pc_local_chat', pc: {label: label, tsid: tsid}, txt: details.txt});
	} else {
		this.container.apiSendMsg({type: 'pc_local_chat', pc: {label: label, tsid: tsid}, txt: details.txt});
	}
}

function msg_move_to_player(details){ // defined by quest_npc
	this.apiWalkAndFollowPlayer(details.pc, details.stop_distance, false, 'onFollowing');
}

function msg_move_to_xy(details){ // defined by quest_npc
	this.apiMoveToXY(details.x, details.y, 200, 'moveComplete');
}

function msg_offer_quest(details){ // defined by quest_npc
	this.setAvailableQuests([details.quest_id]);
	this.offerQuests(details.pc);
}

function msg_remove_delayed_callbacks(details){ // defined by quest_npc
	this.events_remove(function() {return true;});
}

function msg_set_hit_box(details){ // defined by quest_npc
	this.apiSetHitBox(details.x, details.y);
	this.apiSetPlayersCollisions(true);
}

function msg_set_instance_prop(details){ // defined by quest_npc
	if(!details || !details.prop) {
		log.error("Item "+this+" received set_instance_prop message with invalid details.");
		return;
	}

	this.setInstanceProp(details.prop, details.value);
}

function msg_set_owner(details){ // defined by quest_npc
	this.owner = details.owner;
}

function msg_set_state(details){ // defined by quest_npc
	this.setAndBroadcastState(details.state);
}

function onFollowing(args){ // defined by quest_npc
	switch(args.status) {
		case 1:
			if(args.dir == 'left') {
				this.dir == 'right';
			} else {
				this.dir == 'left';
			}
			break;
		default:
			this.moveComplete();
			break;
	}
}

function onPlayerCollision(pc){ // defined by quest_npc
	log.info("NPC collision (from NPC)!");
	this.doQuestCallbackAll('npcCollision', {npc_name: this.getName(), pc:pc});
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function parent_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-82,"w":56,"h":83},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHgUlEQVR42u1Ya0yb1xlm3ZYULWGL\n2qg0BBIgtORGwqVcw\/1mB7CNbWxjjO\/YYBvfwDZggwEnQIA5CUmTNm1aqdM2iR+Lqk5TpUr7M2nR\nfk2TlmrTNG3a70n50VWa9ufd+5ydRtV+TTHxNGlHesRnvs\/nPN\/zPu973uOCguccjz7ae\/Tw1jo9\nw801gfezqwLvSTxgJCOepYJ8j4e312nvWoJuA5kE3crEKRlyU2zGRplEgG6uxSi7Nk\/Z1XmadU\/8\nlr9SlVeC7+6sPCOQtOvpI4eOPvFb6WOPiTTlxTQ1rqGd5QhtMwLOcRA05JXgvRspQWDFY6atvib6\ny9tb9OeNOP0x7qJH\/ZeorqKUwlNm2lgKks9uyj\/Bu5tLtMmLh0d6BLHfO4foc1M7PdE20pPRBuo7\n+SppFN20Fpshj0Wff4Lw3HrcR2FNHz12awWpr6O5ooy6296iFPvSbdbmn+Du6hwtR6ZoyW+nYO0Z\n+tzQ+ozcJy4d8SPUwwQTfhvZTer8E9xKhWgh4GDYyabqp8aS49Ry\/Cg1lRVTUWEhvcEKWseGaM5r\nIat+JP8EV+enaX7aIghEvRNkGOmjlvqLdP6NCqo5W0XDfW0UdBop6DKSbngg\/wQNaoVP0XNl\/+vo\nam3cb6y9uN\/ScHl\/oLN1f6DrX6irObedd4JyVDCa\/kNcLvj\/+F8ce+vRS29fn0\/\/O+5m5mzvbiW+\n+18hhYWzqWBoOeR4GnQayGkcJve4SgDXwBRfR6ZMtBxyPrq3EevMq2KLftuvQcKmV9JqbJp2uWlw\nmjX0gNutD+5cp6BnghZCLnEPz\/ltOloK2NN5US4+Y3mKRR3GEUHozo0kXUuG6B53NzajitYXZ2k1\n4RdEs9yKdbfWk0WrEETnPeb0CyWXDrv+hIUmtEq6v5smv2ucOlvqaWslSmnel4f628X1+7czFHCb\nhZJ73FTc2lgknbJLhD0ZdNheCMEbi34RVu+klm6k5yjKjelWOirUO1tVzrtFH73HnfUON6otDTWU\n4p3m7vayuA\/yPW0NZOOtD569Fvc2HCg5ZCUmtowO0jY3CUB7Ux2tLQQowy3XhH5IKGozqsnnNAll\nEeKF8BTpVQOk6G6ld7j1H+PtEC\/JNnnM0x46MIIbCZ\/wXXR6krLc3i9FPEK96srT1NXaIJSb466m\nsqyEHNxJg6zXZqCq8lJBGCqquTdcCLspxE0sksaqVyp56pcOJGtj3AwgY+ElLALloI5Ro6AMJ8WV\nplqKB520ws0pnkGIrYYRoSyehR\/Vii6a89mEknjZsMv0gKd\/7UDCizdemHUI9ZCtrgkt9bY3iiyG\n96DUOCfO3e0UqQa7hJLobJDhBvUgXayuFJkNZTdXIuR3jFHYbfoNT1\/NeDm3znk1ksEbp9n0IIQk\ngO82+TwChZJzXkEKSl7iNstpHiW1slso13j5PCW4HnLDKjy5zQesjVSYdtjD3gnNE56+mVGcW\/Yu\n+bdBEM0nFjFrrwqlQBDZa9EPCw92NNdReekJaq67IJRDorzJTWsn\/x\/3vbYxmuSwYw5Ugimz+nc8\nfb88jn7juQlmop40CKKe4e3hociMlWucRSQGPKdR9ojP8B6UxN+Qd5K0Q72iJCFJrnEHjhDv8lkm\nwp52m1R\/4OlVjJqcwuy3603w4Fp8hva2loQa8NVQX7soyPDj6ZOv0xiXE9zr62gWSjbVnhfkUZLq\nL1YL1UEUhTwVcdNQb9tnPP0Yo55x5Hn5fRMh4Iz7AsYW4eHyAQ9CDdOoUiiHog2lhgc6hSehIMpN\ncGpCPJuO8emPSxQI39tZFlncWnfhBzz3uGxmi3IiaNUpf8KeoTXORCx48\/qCAJTCwlAHZae68pRQ\n7v730+LzmVMnad7vELaY89nFCwb4nDKpU\/6d511kGBlv5UIQo5xDZHYZh780awaECrvrcVL0tIli\nDeUuvFkpsjcZ9QoPQllkbyLoohArjCwHuRh7FuoNdjShxMQYOkYtozAXgicYVxovn81ictRDFGRk\nKvwERTVXeygWcAryqHNXe68I4viMbMZfEJ2x6kg\/1P2U58syAoxhxjkZqecex+RbjnL4fgSSm5yR\nKLwui1Z4EsmCsCIZwtNW8RnqWg0qcQ1lsY9P6hT\/KHz50A95rjWGg9GNCOW6mXxL1qpeTMoH8g\/h\nISNv\/MmoRxCAv6AUvPYVIWQ0rs28w0A5rbLrb8eKjv5UqheW4UUGHz2IfuG4nEyD0JSeeO3huKb\/\ni1nucFzc46UkUZQUNKnwG7rpWXkcUHQ1\/7Xw8KGP+bt3ZHJYpXqnD6qheUlO1iprV\/g7hYezjbXn\nHpvU\/V8iw0PucUEGpKDYV8TKSop\/xc\/\/GH0HA7+0uhhKWaAPH2RbWChD3SFJ+hgr2K4rSkt+xsX6\n56dKXv\/FqZLiXwLHio58yvfgt\/vYMWXW2hlXpaeLCl7AAMlKqaRKLhiWRDelv25JbMtkSDBmZM3r\nl78wHCl4gePbjDK5ULf0pVmGzifLB+CVLzAmQ4rO5Yz8fl5GkSwRNXJxkB2UZJQy6ztkcqHv+15O\nXUsOA0Z\/VapaKX1aJcm\/kmsi\/BOpA6KcURP4yQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/rook_hall_speaker-1312908937.swf",
	admin_props	: true,
	obey_physics	: false,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"u"	: "push"
};
itemDef.keys_in_pack = {};

log.info("rook_hall_speaker.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
