//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Catch-Me-Ghost";
var version = "1347909974";
var name_single = "Catch-Me-Ghost";
var name_plural = "Catch-Me-Ghosts";
var article = "a";
var description = "A ghost! Catch it!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_catch_me_ghost", "npc"];
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

function onCreate(){ // defined by npc_catch_me_ghost
	this.initInstanceProps();
	this.apiSetHitBox(200, 200);
	this.apiSetPlayersCollisions(true);

	this.setAndBroadcastState('rest-top');
}

function onDoneMoving(){ // defined by npc_catch_me_ghost
	this.setAndBroadcastState('rest-top');
}

function onPlayerCollision(pc){ // defined by npc_catch_me_ghost
	var left = this.container.geo.l;
	var right = this.container.geo.r;
	var top = this.container.geo.t;
	var bottom = this.container.geo.b;

	if(this.x>(left+350))
	{
		this.setAndBroadcastState('glide-side');
		if(pc.x>this.x)
		{
			this.dir = 'left';
			this.apiMoveToXY(pc.x-220, this.y, 120, "onDoneMoving");
		}
	}
	if(this.x<(right-350))
	{
		this.setAndBroadcastState('glide-side');
		if(pc.x<this.x)
		{
			this.dir = 'right';
			this.apiMoveToXY(pc.x+220, this.y, 120, "onDoneMoving");
		}
	}
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

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-46,"w":50,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEn0lEQVR42u2W708bdRzH+Q9YZnzk\nA8x8IkLHkiWCvwLqpBgeYCeTrL32aGmvLW051tIWaOG60lHoYKUQoIS5jrm4uMWMZItTI3bRmDgm\nIfhApiZ2Zo1L1KTaRBOffD\/e53vcQRNi6JY1S+wneee+l+t98+r78+N7FRXlKMf\/MPymmjqfsXa9\nV1cNbxx6Mv4YwqlyfpMKNC8\/Ba\/WPCFqX91jBRcU2mFyc3Ub8Nl9jaUF4Q5Ueo2qRn9nLe8z1Qqy\nBpwv5RAsNN0Do3cBuj3HKWBT9X6+pLWF6UO5T7RD98Qs8MEeeo9gswTg9NoKdIY2gU8uSYDP7Rce\nORx1TIRAIMNHhMqy+Bm9Gj8l4DoZAK8IKmwAxH7OgtX3HhjnN2maSwLYZ3sljY6hWwjl3hDBrtwr\nWHs4NeiiAO7bIrywDMwiAab56YcHdDLP1zl0DayTaRBQuN753NNVXWWdu0qdco6OUajEPwRsXxJl\nPfADAY9TAmTOETCNr4JumkDHO+riAbljhysRwqGrXxeBYDfhM4f2xSr8vc9Yw5qXbsHIfQKOT7LA\nXf6O1hqCBX8idI0Knw2AIZwtAGxr1xTXxVtuZboNR4ANrlGZe+KA90bfdWBPrUFn+CZYOTuCpimg\n2KG2xAWI\/i7BjNzJKlCJX7MQvgNgvwjgiK2AaWi1ANCsOZgrCs7J1OfQIQTAdOjihG7ETObpvf6a\nlDbmIqHg4u95v1HVhvUX+0MCjN\/dVABxrJhmgb6LcDsBXdHbEPUd3Vt6XfoXGhGMurTlHBPJ083k\nrtRfJgoghVwi9I94DId47GB0azdAJvLnroAz8WCmmJrLICB1DTVOlKsMhU2Aa\/3y9j0Ty4OdbUnj\nCTG6PKeAWRJZ+j7OO4SSAfEeAUdCLjg3bWncY2obBKyxrhOLYBj+XgKb3nJtWUqn\/pIEh0Uf\/JFA\n14dSZ1qvi270XYK+zrr0oFdN5xzWnAwou4Zry8AyvZpTv0EyZuCLqL2GNNaT4t6WEEpOp\/dbcdje\nkMCw1hJ\/A\/RvSCOEOy8+M7dlMM3YpRRsR93J+yEgG\/0LYtMzqSLnXP1Vu\/Et0J\/8RdmMSW6nFq9G\nEQ7HCAX7ikDgFtDzdDInXc29M\/QLRXZpZ1rlPd2BGZiKn0oVPYi7tfVtWH8WZ7jQxQlCpz2m2fE1\nAUFM6eg9QqFQvdfEY+u+VHPWsZuY5py9b64ADB1F1wZP38glzkTaHvi0EJskhS5i98o1uLNjsSG8\n3xDFNaVLt9bej\/MICF2BFdq12Ay4T2D0AsxPeVMLC1zlQ5+nONOwHjm7jzYMK4hDeWxbzFSe1lv\/\nF6AImwLTjuAIiM7xkc8hNPEBJKc86T136oOk3W9tAlTY\/SbV5JCmQOFgL\/SH3wX\/+xsU0tt1OBOZ\nPA\/zY2zmzPDb7CP\/Qjk7oa1aGNcKyag2tzCmhf9SJDqwznOvp3ibOu3qqMu5Og6C65iqdF\/KC+PH\nWYRFTYXa0xNDRwE16FKDpkUFTQ3PAMc2AW9XA295LVVSuN1i2NPKDrtb44K7NRfgW6Cp\/kC8x9Ys\n8LbmFMcdqawoRznKUY5ylKMc5ShF\/AuMPZSbC8tPTAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/npc_catch_me_ghost-1347767271.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_catch_me_ghost.js LOADED");

// generated ok 2012-09-17 12:26:14 by martlume
