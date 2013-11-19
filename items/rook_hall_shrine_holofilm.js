//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Rook Hall Shrine Holofilm";
var version = "1344982233";
var name_single = "Rook Hall Shrine Holofilm";
var name_plural = "Rook Hall Shrine Holofilms";
var article = "a";
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
var parent_classes = ["rook_hall_shrine_holofilm", "quest_npc", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.npc_name = "";	// defined by quest_npc
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	npc_name : ["Name of this NPC as referenced in the quest."],
};

var instancePropsChoices = {
	ai_debug : [""],
	npc_name : [""],
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"rookhall",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-1,"y":-156,"w":222,"h":137},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNUlEQVR42u1XWVObRxblB0xMzVNi\nCJbjhKAFDMIgHDaBBGJHiNUsQiAJgSRALEICA5aBeMMYLJY4djwmmTiLGWOXp2oeU3mZh3ka\/wR+\nAj\/hzD2NZJOamXJqCr9M0VW3ur\/uq9unz126lZJy2k7baTttp+3\/r+1vTuXub87sPo+Hf32X7G1M\n\/\/pMhP3P96Z2+dv3AmrvYTT1eXwmtLcxdfB4xY8vQz0IDzZj5EoN\/CLBnjqM9dZj3NmAif5GTLqa\nMC3rM+4WRL0OzI+0YTXcj6+vD2N\/M\/L6eXzadcKshTeENTzbmMK9iAtDHdUY7rQpgCNdNgS6a38D\nMORsVADDg3YFcHbIgau+NmzMebC\/NYef7k3iRTxsPzGA390et39\/J4SnqyGIu0Cw3wiTdwVsUMDF\ngp0K+L3oANZnj2SN3xEZy9z9OTcerQTxIDaMxysB3J7qg9NRaT4xgH\/bntfsx2ewOe\/Bi60oflib\nVGAWRjqw6O\/A7s1RfH9nXB3gh7sTv5G9+zPYi0fw5FYIKxIanjYrHFVFh+8hOSIbjKG\/3A8rQGRn\nTtw2LyCfrk7gm+WAYigpX13zCXOeNxILdiHiaYGvsxq1pXmxkwe4Nq3ZWvDiyY1RcTNBjgmIYVwd\nbsfUQDPiVz1q7U9fBt\/02wtDCtz6rBvLY90Y72tAi9V08F4yWVwY+1ZAMYaYpY+EMbK2s+gT13uF\nyXZsCSDKo2W\/Andzsg8r4z0qmxckFG5POxmvr6O+jtQTBccYfLg0gmfr01IqRsRNNkjZwYvNCL69\nNaYAP4iNKFdfF1cSDAE+Z\/wJ23cE2PXRLuX69dlBMr5xogBXxntdT24EFWNht11t9Nev5sDMXo8O\nyrwfr3ZmFWDOsbRIYVaHoC7jLyql5uZkr0qqztrig\/pio+ZEwL3amXtNlrYXxXVLfsUEwTFZ1iRR\nWKSTYHYl9hh\/o1ITWY54qKXRK8r9vU3liumQ1Mm68nzYrSbUluXt\/k+gfnka1Mw1Gc3bk50uMsLk\nYByRCd4iL6XUMB4JcKyvXo0pLD0EOyPZyp6HiAibLN5NlQUCyIhmSyEmB5rUwQi6o\/C8uadY9\/vZ\nBPZSt0P1B9e6yvBgwaMyj5ssj3erzNwRJgnyxkSP3BCt8LZXKZduSaLwRtmQojzYalFxR71Bh0Wx\n1Vp9GU67WbHIxOLv7JYCNBZkwlFw4aDj0oXflzj7G\/27E9UX8XDRq8CwGJMRssGAZyLcmOhVG5E1\nfjOuuCEZ8QtItxTjrvoSDAg41kpeebRFLzibzUqXayxPTnsFqvM\/xYAt593u\/serqH2xrQij1TnK\nIF1GtxIkT834Wp1xifHKRC0cVVnM+aWxK6qMEDBLEUHT\/cx83kJyXao53tGMY7J\/LdCpXG0r1KI2\nOwPhnmL7O1xbdxhpyENIGPQ1FiuWeGoC4s3BDCYDclXJfepUt0XyxuBGdC\/BETBZp3sJmqWHB+Aj\ng+HwIOZTt8pdeeHwkWHWn0PdxXPoM+sP\/6ur\/7zY9vKaoxDzjgJM2ARghQ69ZQZ0lOcgOtiI74Sp\nn9enFACyGhBAzFYCJRPM1lvyCCAzfOXEBay6i4XpHTkEvcHDNpgvwSGxx7rqdYh7czSoMWSgOf88\nOr\/IRKSv9OW\/gfv7j+Ou1e5iLLWaMNtoxGyDEZMCctSajUGzXjEQdjWqVwiFwLpsRfDLvbopVxwf\nCQTOVwvdSIbJ+JqEwyMBwsPFr7oVeJPuHEyZZ+FrZexlwqpNQ7PxPNpNn+LK5c8wUK7Dw\/m2t+\/F\nf+5Pa55ONR5u9ZdhtfMLrAjIZYcJC82XEK4TdwvQgCUbnjId+ks+R\/flTHSIsZb8T9Bq+hyBVjMW\nh1ow46xHr60QdSYtyrLSYDNeQGt5Hlz1l+Gzl6LHmo+a3E9QpU9HQ64GzXkaOARYV9FncJZkwVWa\nBV+lHn6LAQvtRYe\/PA4elZ7JukuhcL0JU7WFmKgpUDJdZ0JI+tGqfBEjAlYjhitzMWS+CK+43COu\n95RTsuGWfrBMr6S\/RKRYC1eJHKZYJ5vqMCBzrlI93GYDXKIzUHY0HhAb3opsDFvEpjlH+lwEqvLg\nt+YhaMnDSltNSAH0WbQxn0WHEYteTsBeRPpAlUHiUCugstT3cEI492Zs1grgLNUn56ifXKPw2y3i\nSfSUIVn3JuzQnlfNib7sPZyQlXZbLOXCH1NSy7UfHlgMZ1Gh+wjsrTnpsHCsPxKrIQ1VIhxXaj9U\nYk2uHdPhb47WP1Jja0Jfzcu4gmvSm6Uv5ziprzuyadHL3tlpSodizdYcpOjOngnp0z+A4eMz0IsY\nMs6ocVKyM1KVHJ+jXo4mVemqtYyjOdrRpyfsHLOlT9jRpX0AHXXkmz0lS829\/S11qJvEkiKDmAKY\nNJb+Fth\/Aphz7gjQ8T6po0vY0R+zo\/QSm3Hz5Lz27B9EBKD0+o\/fHorrCmDioKd\/8k\/baTtt77n9\nC0fWdMa5i3J5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/rook_hall_shrine_holofilm-1311898896.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
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
	"rookhall",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("rook_hall_shrine_holofilm.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
