//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "MaintenanceBot M-64";
var version = "1350928811";
var name_single = "MaintenanceBot M-64";
var name_plural = "MaintenanceBots M-64";
var article = "a";
var description = "Once at the bleeding edge of technology, MaintenanceBot M-64 was mainly removed from domestic service after someone pointed out that technology shouldn't make you bleed. Now relegated to the subway, where no one cares if you're a malfunctioning weirdly-rattling pointy-edged potentially-explosive robot. Luckily.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_maintenance_bot", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.talk_state = "move";	// defined by npc_maintenance_bot
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	talk_state : ["Animation state for talking"],
};

var instancePropsChoices = {
	ai_debug : [""],
	talk_state : [""],
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

verbs.talk_to = { // defined by npc_maintenance_bot
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "It looks intelligent enough",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && !this.container.isInstance('le_miserable')) return {state:null};
		if (pc.getQuestStatus('le_miserable_part_2') == 'done') return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.setAvailableQuests([
			'le_miserable_part_2'
		]);

		this.offerQuests(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.dance = { // defined by npc_maintenance_bot
	"name"				: "dance with",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Get down and\/or funky",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.container.isInstance('le_miserable')) return {state:null};
		if (this.revived) {
			return {state: null};
		}
		if (this.danced) {
			return {state: 'disabled', reason: "You can't solve all your problems with dancing. You're going to need to try another approach."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.playerDance(pc, 0);
		this.danced = true;

		var pre_msg = this.buildVerbMessage(msg.count, 'dance with', 'danced with', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.refuel = { // defined by npc_maintenance_bot
	"name"				: "refuel",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Refuel the Maintenance Bot",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'fuel_cell';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.container.isInstance('le_miserable')) return {state:null};
		if (this.revived) {
			return {state: 'disabled', reason: "This robot doesn't need anymore help."};
		}
		if (!pc.items_has('fuel_cell', 1)) {
			return {state: 'disabled', reason: "You'll need a Fuel Cell for this!"};
		}

		return {state: 'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'fuel_cell'){
				uniques[it.class_tsid] = it.tsid;
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
			this.startMoving();
			pc.sendActivity("You don't have any fuel cells!");
			return {
				'ok' : 0,
				'txt' : "You don't have any fuel cells!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
			}
					
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			stack.apiDelete();

			this.setInstanceProp('talk_state', 'talk');
			this.revive();
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'refuel', 'refueled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function leave(state){ // defined by npc_maintenance_bot
	this.dir = 'right';
	this.setAndBroadcastState('move');
	switch(state) {
		case 0:
			this.pc.quests_set_flag('refuel_bot');
			this.apiMoveToXY(46,-349, 300, 'leave', 1);
			break;
		case 1:
			this.apiMoveToXY(-850,-349, 300, 'leave', 2);
			break;
		case 2:
			this.apiDelete();
			break;
	};
}

function make_config(){ // defined by npc_maintenance_bot
	return { variant: this.getInstanceProp('variant') || "widgetTin" };
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_maintenance_bot
	this.setAndBroadcastState('move');
}

function onCreate(){ // defined by npc_maintenance_bot
	this.initInstanceProps();
	this.face_dir = 'right';
	this.apiSetHitBox(200, 100);
}

function onCreateAsCopy(){ // defined by npc_maintenance_bot
	if (this.container && !this.container.isInstance('le_miserable')) return;

	this.apiSetHitBox(600, 600);
}

function onPlayerCollision(pc){ // defined by npc_maintenance_bot
	if (this.container && this.container.isInstance('le_miserable')){
		var part2 = pc.getQuestInstance('le_miserable_part_2');
		if (pc.getQuestStatus('le_miserable') != 'done' || (part2 && part2.isDone() && pc.getQuestStatus('le_miserable_part_2') != 'done')){
			this.verbs.talk_to.handler.call(this, pc, {count: 1});
		}
		return;
	}

	if (pc != this.pc || this.collided) {
		return;
	}

	this.collided = true;
	this.conversation_run_collide(this.pc, {});
}

function onPlayerExit(pc){ // defined by npc_maintenance_bot
	if (pc == this.pc) {
		this.apiDelete();
	}
}

function playerDance(pc, state){ // defined by npc_maintenance_bot
	if (!state) {
		state = 0;
	}

	switch(state) {
		case 0:
			pc.playHitAnimation('hit1', 1000);
			this.apiSetTimerX('playerDance', 500, pc, 1);
			break;
		case 1:
			pc.playHitAnimation('hit2', 1000);
			this.apiSetTimerX('playerDance', 500, pc, 2);
			break;
		case 2: 
			pc.playHitAnimation('hit1', 1000);
			this.apiSetTimerX('playerDance', 500, pc, 3);
			break;
		case 3: 
			pc.playHitAnimation('hit2', 1000);
			this.apiSetTimerX('playerDance', 500, pc, 4);
			break;
		case 4: 
			pc.playHitAnimation('hit1', 1000);
			this.apiSetTimerX('playerDance', 1000, pc, 5);
			break;
		case 5: 
			pc.familiar_send_alert_now({
				'txt': "That was… what was that, anyway? <split butt_txt=\"Sorry, I panicked.\" />Well, it didn't seem to work. I hope you have some other ideas!",
				'callback'	: 'familiar_ignore_callback'
			});		
			break;
	}
}

function revive(){ // defined by npc_maintenance_bot
	this.revived = true;

	if (this.pc.x > this.x) {
		this.dir = 'left';
	}

	this.pc.apiSendAnnouncement({
		type: 'itemstack_overlay',
		itemstack_tsid: this.tsid,
		swf_url: overlay_key_to_url('smoke_puff'),
		delta_y: 140
	});

	this.conversation_run_revive_done(this.pc, {});
}

function setPC(pc){ // defined by npc_maintenance_bot
	this.pc = pc;
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

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
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

function conversation_run_revive_done(pc, msg, replay){ // defined by conversation auto-builder for "revive_done"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "revive_done";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['revive_done-0-2'] = {txt: "Did that hurt?", value: 'revive_done-0-2'};
		this.conversation_start(pc, "Oh!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'revive_done', msg.choice);
	}

	if (msg.choice == "revive_done-0-2"){
		choices['1']['revive_done-1-2'] = {txt: "What happened?", value: 'revive_done-1-2'};
		this.conversation_reply(pc, msg, "No, it feels wonderful. I’ve been stuck like that for ages.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'revive_done', msg.choice);
	}

	if (msg.choice == "revive_done-1-2"){
		choices['2']['revive_done-2-2'] = {txt: "All better now?", value: 'revive_done-2-2'};
		this.conversation_reply(pc, msg, "I was in the middle of a routine subway maintenance—refilling air defresheners with our seasonal scent (Old Wino™), replacing the wads of chewed gum and moistening key surfaces with mysterious fluids—when I tragically ran out of fuel.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'revive_done', msg.choice);
	}

	if (msg.choice == "revive_done-2-2"){
		choices['3']['revive_done-3-2'] = {txt: "Erm… good?", value: 'revive_done-3-2'};
		this.conversation_reply(pc, msg, "Much, and the next time a commuter accidentally puts their hand into something damp and sticky, they’ll have you to thank.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'revive_done', msg.choice);
	}

	if (msg.choice == "revive_done-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "revive_done-3-2") && (!replay)){
		this.leave(0);
	}

}

function conversation_run_collide(pc, msg, replay){ // defined by conversation auto-builder for "collide"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "collide";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['collide-0-2'] = {txt: "What?", value: 'collide-0-2'};
		this.conversation_start(pc, "Fmmrm shrmmrm…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'collide', msg.choice);
	}

	if (msg.choice == "collide-0-2"){
		choices['1']['collide-1-2'] = {txt: "I don’t understand.", value: 'collide-1-2'};
		this.conversation_reply(pc, msg, "FMMRM SHRMMRM!", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'collide', msg.choice);
	}

	if (msg.choice == "collide-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "collide-1-2") && (!replay)){
		this.pc.familiar_send_alert_now({
	'txt': "I think he's saying \"fuel cell!\" Either that or \"formal swing,\" which I believe is a kind of dance.",
	'callback'	: 'familiar_ignore_callback'
});
	}

}

var conversations = [
	"revive_done",
	"collide",
];

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-85,"w":72,"h":84},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFDklEQVR42s2Y61IaWRSFfQMfwb+T\nSk2YZKq8TmwZUQFBBUREJagRIUYgiu0lBhuDihgV1PGGKOA9iooaUjVaKR7BR\/AReIQ9+\/TECwS1\nI0TpKn+J8rH2WeusTUZGCp+xsUHKau3kZaTjEwh4z\/f3d2Buzh3t6UkzyJGRQW0wuAXfvv0LPt8i\n9PZ2MmkFSBSbmZmMLi\/Pw6dPQ+mn4AWkw2E7T0s48kxPT\/Dsdhv09\/dnpSVgX1+36907E9TUVDNp\nB+f1erOs1vdAABsbNVGL5W16qWizWQ9ouhOMxrfQ1KSFigrJWdrAOZ0Opr+\/97t6WlAo5CAWC6G6\nusr16HCh0K7L718Cr3ceXK4xcDiGwGrtA4vFDAaDDl69qqt8NLjT03BlKBSEtbUVCASWYGIiEWB9\nVC6XP\/x5PD4+5p2chKMEcHl5AYiK4+OjiQBBLq86EwgEmQ8K+OXLYeTk5CtcAC4szMDs7FRCQIWi\nCoTC0oeLnt3d7cqjowO8b2loazNAa2sL1NerQaOph9paFTQ0qEnUxACKRCXR\/Pz8hxn1xsZapKPD\nDB8\/2oBhrAjazTr4zRs9NDc3Ql1dLY5VBmq16hpgKRQWFvx6V6+vr2cRqNFRB45z+FbA8nIROX+X\ngBRVcJ40QHW1nNHrX0NPjwUhhmBxcfZse3vt8vL3eDxmrbYefzfMCbC0tOQa4F8gkZQmVyS6ujpg\ncHAAJifHYGlpHuNjGfvdEnPVmJ0HL\/OewIC190bAGqUMpMJCKCspguLiv2MApVJRcmN2u10QDO4A\nceje3mfAAgAymewybIeH7VEL3Y4fYPxGwKoKIbzM\/Q0E\/DwWUCoVX1NQFEmy09FnZrMJD3cD\/rNy\nKCjIAz6fT13Vej+srHjB7Z7kNGKFQhY34iQB\/X5fhLz5+LgTPnx4j\/n2D57D0cwrwADs7n6G4+MQ\nbG6ufVdyCB3NAGkz+AGBOJxAtrXpEbo1tYDr66uuw8ODyxHj+YPYxeh\/wHD4CC6CenNzFe\/iBZia\nmrwxqFMGiBnH\/Aygz+dhiwK5SR4IMFAZD4hvrB0ctFI03UElUpDAcVFQqVRAZ2fHOalnmBRmmqYp\no9FI6XQ6SqPRUJxKBQniBIBgtzNACmk84MaGnxMgTVvwdQtoLjcb8jYbg+e1G8xmI+j1OtaUSmU1\ntwgKhfYjXAFJ1ZqddbPn8DZA8nd3AeIug028XHsnYDi8l0WqFBdAriPGG4gjoJjbqnB6epoZDG6b\n0QRntwESk+C6yap4GyBmPeh0LbizGNkzaLMNuDCSIggYjVMQIyqJguv3+yPxChI4j2fuVkCBgA8v\nXvwBZWWCGBcTk8QDqtVKKqWAXF2cKGZMJlPlLwUkIyYK3jcHTaZ25scR1zApHzHWMk6AWBx8sYBG\nVwJAX8oASQ7+DKBEIo5Rx2DQR64DosJYMoSRlAFimWVdTHrjfQARKkpumIoKCRqpGPLycuDZs9\/h\nEU0SC9je3nZO1CO1TCwWYX\/kk13m\/qsBBmxka2vjEnBra5X9RoG077sA8\/NzIDc3m7nDJFGVSsVL\notB2RVpamsHpHGHHykVBqbQcsrP\/hKdPn0BRUeEPDtXrm3mkLCiVSkosFie3muJNwkxPu9ld2GBo\nRcepgHxxhOAI1cHuyS0tTexuTMBQMcjJyYbnz3lEwWjSAFyenZ0dKhw+PCMKjozYAceEwK+BKNvQ\nUMe2aXK14XljIcmPUFgSue\/i\/h9aWjqpb0EM2AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_maintenance_bot-1342653537.swf",
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
	"no_rube",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"n"	: "dance",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"u"	: "refuel",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_maintenance_bot.js LOADED");

// generated ok 2012-10-22 11:00:11 by mygrant
