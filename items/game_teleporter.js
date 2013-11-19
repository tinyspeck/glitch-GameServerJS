//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Crown Game Teleporter";
var version = "1346175528";
var name_single = "Crown Game Teleporter";
var name_plural = "Crown Game Teleporter";
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
var parent_classes = ["game_teleporter", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.shared_game_manager = "";	// defined by game_teleporter
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	shared_game_manager : ["Shared game manager to use for starting games "],
};

var instancePropsChoices = {
	ai_debug : [""],
	shared_game_manager : [""],
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

verbs.activate = { // defined by game_teleporter
	"name"				: "activate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Play a sporrrrrrrrrrrrrrts",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.announce_sound('ACTIVATE_GAME_TELEPORTER');

		var choices = {
			1: {txt: 'Sounds fun!', value: 'yes'},
			2: {txt: 'Maybe another time', value: 'no'}
		};
		this.conversation_start(pc, "Do you want to play <b>Game of Crowns</b> for <b>50c</b>?", choices);

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onConversation(pc, msg){ // defined by game_teleporter
	if (msg.choice == 'yes'){
		if (pc.stats_try_remove_currants(50, {type: 'game_teleporter'})){
			this.container.apiSendAnnouncement({
				uid: "game_teleporter_overlay",
				type: "pc_overlay",
				duration: 2000,
				locking: false,
				pc_tsid: pc.tsid,
				delta_x: 0,
				delta_y: 20,
				width: 300,
				dont_keep_in_bounds:true,
				swf_url: overlay_key_to_url('game_teleporter_overlay')
			});

			pc.playHitAnimation('hit1', 3000);
			pc.announce_sound('PAY_FIFTY_CURRANTS');

			if (!this.shared_game_manager) this.shared_game_manager = apiFindObject(config.shared_instance_manager);
			this.shared_game_manager.apiSetTimerX('playerJoinInstance', 1000, pc, 'it_game');
			pc.sendActivity("You are transported to a mystical land of fun and adventure!");

			this.conversation_end(pc, msg);
		}
		else{
			this.conversation_reply(pc, msg, "Oh dear, you don't have enough currants to play!");
		}
	}
	else{
		this.conversation_end(pc, msg);
	}
}

function onCreate(){ // defined by game_teleporter
	this.initInstanceProps();
	this.dir = 'right';
}

function onLoad(){ // defined by game_teleporter
	this.dir = 'right';
}

function onPropsChanged(){ // defined by game_teleporter
	if(this.getInstanceProp('shared_game_manager')) {
		this.shared_game_manager = apiFindObject(this.getInstanceProp('shared_game_manager'));
	}
}

function onPrototypeChanged(){ // defined by game_teleporter
	this.dir = 'right';
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
	return out;
}

var tags = [
	"crown",
	"game",
	"teleporter",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-48,"w":36,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGxUlEQVR42s3Y+VNTVxQHcP8AMYBL\nBZIgBMIaoSouuOACuC+gLEHFWsSoKJsKbpgiaFFQEHDDJZAAFlpErRQttXFtraJIHUXrAggqThfb\n2lH707fvXPtiAggE0PbNnOENwwyfOcu9990ePd7hs6fCVrlPa5deXGkr6PF\/erYUC72yT9po935r\nB80VR2gqHWsLrzl6\/aeolGIzQUqxOCrt6IDa7FO24HH5V5304\/1mMznfwjpRI45KKhCVppUOAMH2\nnJbg0HfS5jBdvPNs8qhEjUibXCjGjuM24DPWFqxFVDpq8685WXcJk6gWelEkacRKAm3SiEGRUmyN\nnWU22F0h0QU3DMj7waHjwH8j95JUZTRsdbYleAwFZSr1yADsqrBDzhk7A1jzoEyqvu8YtOiGC9JK\nbWA0cN7qPlVbvxiArJNcP12U6jJzkHvff9a+VWR7vacfh6udceyeDDuO2bIEGA0MjjLTLkn6oNVM\nEJaAB87ZM3DupY6XtaDKCeWNbiiscsaWw9a6ChkNDIgwT5+7sjfisq2M7qnW4vNbLiird8PRuzJs\n4yqj3z6dAs5SmEYRsKvIktuuqGj6EEfuyJD5laQFrNPAyfN7esmjzWEskkpIqJIaV1bGg+cdsOGA\niFuKbJFcYIjKKLbDN2eGsp9GA70DeggCIsx0wLaQNIkF15y4AXHghsVO11uE2sy9x++2wvocITbl\ni7G10AaFZTJUX\/HCiwcz3sT96aXPG2KMW7z9FKYGQB65\/xxNshSZ5RJknLA1aHb9iEqzQFLBa2BW\nkbQlio\/aIPxZF436K95Ko4BTQwUtgBRv66PmkaqxRckpd1ReHN067IE\/Xj2KxR8PE1B\/dQrqL\/tE\nGdeH84wD8uU7f2EEntya9BbUDLys\/wivnqzHi6Y0NN0Mxc2z43C5fAwaLvsYV+KpCwRVwdyghMS2\nDswssofqmDNr9Loffd4K4rP1smEp\/n6ajN\/r1uDxDTluXxgPVYY7xgw3Q1n+MOOBk+YKtP4KM8xe\nagZ5jHkL4OG8gXhY6ds26uEilq2\/HiXh5ztLWCmvn\/aCOssdyz8WIzTAEmEhQpw7OlJr9CRPDDbR\n0iT7LTbFrHAzhCv7GQBzsrkJ3uuGi8c98UvNbFY6ytKrx\/F42ZSM542b8Ou9SNy9NA1nSz1RnDMY\nSfFShM8VsiAg\/e7S2ZH4rdJb0CkgZS9whTnLYlCkuQ74SZ4In6ZIGJCi+lwYAz2tCUNj9RzUXfFh\nqKzNLgzCo3gYZfDM18Oxr8Shcws1WwuDTFiJCRgcZVjiDQeESEy2MQASjmD6WdKPnDQZjms8UF7m\ngdR8267tJPSM9evJgHOWvUbyQGWuCOv2CRG11soASI1PQB60IVqiQ504PgRZuQ5sTaTsd3mr0wcu\niO9jAFyzx4ot2H5cX4aE94U6W8aADVUzdaWtODqMoTIOSiFfIUXIcleExsgQvc2+BY4Owp0Gzlxk\nioBmGSRg9HYLBpwUIsCchb1RlD8NJUWDsOuQI2K2WWHlTksEKlwQMGEIlJ4uyPGUssj2dMCqec7d\nB5y+0BQUzYErtlpwme2LkJg+CEvoh4gt\/VlW2Z7L\/VPKlnzUIOwZYY\/S8S6omjEIdyMCcW+FHNXp\nsUhR23cPcFY4LTGtAylL9K5UGfbU2t02mDbKA9s9JPhygitu+g1hQbgHaxVoVGXhYm5k9wB9g3tx\n6+DrU838uDfAtvZgecRAhLnZYaObNa77D9MBf1L464D3Vam6v6cPsk4Due0OE+W9QMMSGtenQ8AJ\n4z0Q6WSFnaPfZI\/i9nxvlsWGvamoViV0D5D6jwZlFhf8Qt0e0HvEYCx3tIJ6grsB8Kb\/UNaHtcpI\naHMV3QekU03zHmwPuMjeoiWQixq5FytzYd7kNz2YL17QpRL7BPViizUPjN\/VNnDS5NfAjFGuLYC3\nF\/jixhaF4RSrhV6dBlL26ODKA0NizbnlxLJNoCLBCYEyCSIcLHGVW1543K3g0aiJm4cc9Ug9nLiK\nLp26BKQppiEhIO3J7QEpgsIGws\/dEWtlYpz0laE8ZDS0Cb7IUrl3D04fSCUmIJ0J6fjVESDFqgwJ\n4jIdsCzJji3iKcV638NqYXqXcK0B+WNXR4B0IKAvun1ae6zLESFymwVb3Lms1Xa655o\/4\/xMZk6Z\nL3g2frYJA\/LRESAdx1ZlWrKLIQLSFhi5vb+yy1lr5dPTbayfyTNjgbT90dFq82fWtRtV4nS6U3xn\nF5b0Ec8d+6uMAW7SiEoT80Qz39tVb8BiM4H\/YtPStoC06dPN6zvNVnsPh1TyQHbjqhapaCfo9t7S\ne\/4BIyxpOEkm+jQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/game_teleporter-1346175528.swf",
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
	"crown",
	"game",
	"teleporter",
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "activate",
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("game_teleporter.js LOADED");

// generated ok 2012-08-28 10:38:48
