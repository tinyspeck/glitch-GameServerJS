//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "A Grendelian Stone";
var version = "1344982233";
var name_single = "A Grendelian Stone";
var name_plural = "Some Grendelian Stones";
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
var parent_classes = ["npc_obelisk", "npc"];
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

verbs.activate = { // defined by npc_obelisk
	"name"				: "activate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var txt = 'Brrzzzzpt ... pukka pukka ... uhn ... <split butt_txt="Hmmm. WTF?" />Sorry ... just waking up.<split butt_txt="OK" />I can teleport you back to Groddle for a donation of a mere <b>75 currants</b>.';

		if (pc.stats_has_currants(75)){
			var choices = {
				1: {txt: "Teleport to Upper Valley Heights", value: 'teleport-uvh'},
				2: {txt: "Teleport to Hechey Track", value: 'teleport-hechey'},
				3: {txt: "No thanks!", value: 'teleport-no'},
			};
		}
		else{
			txt += ".. Oh, but you don't have enough!";
		}

		this.conversation_start(pc, txt, choices);

		return true;
	}
};

verbs.admire = { // defined by npc_obelisk
	"name"				: "admire",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		var val = 5;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		var val = 6;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		self_msgs.push("Ah ... what a nice stone. Admiring it puts you in a nicer frame of mind. ");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.metabolics_add_mood(5 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(6 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		self_msgs.push("Ah ... what a nice stone. Admiring it puts you in a nicer frame of mind. ");

		var pre_msg = this.buildVerbMessage(msg.count, 'admire', 'admired', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onConversation(pc, msg){ // defined by npc_obelisk
	//log.info('--------------- onConversation: '+msg);

	if (msg.choice == 'teleport-uvh'){
		pc.stats_remove_currants(75);
		pc.teleportToLocationDelayed('LM410CL52JQA0', 1617, -92);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'teleport-hechey'){
		pc.stats_remove_currants(75);
		pc.teleportToLocationDelayed('LM4104P19669M', 662, -109);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'teleport-no'){
		return this.conversation_end(pc, msg);
	}
	else {
		return this.conversation_reply(pc, msg, "Not sure what you mean there...");
	}
}

function onCreate(){ // defined by npc_obelisk
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);
}

function onLoad(){ // defined by npc_obelisk
	this.apiSetPlayersCollisions(false);
}

function onPrototypeChanged(){ // defined by npc_obelisk
	this.apiSetPlayersCollisions(false);
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
	"npc",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-55,"y":-241,"w":109,"h":242},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFBklEQVR42sWYW1ZaaRCFnUEPwSE4\nhAzBIeQxb8nq9OrVSTSi8QbeEBQQAQ8Cyp3D\/S4HEFDx2i95dQgZQvXeP43LTl4bDmvVOgd44GNX\n7ar6z8zM\/\/AKhGNz9XbHuHv6W8Xw4UnFzf2Dus6Y\/VratFls+wdydXcv1\/cPL9HuD+T28UlMB1xc\n2zScXr9cXPZkcHv3H9Dhw6P5gH8sfP1xlspI72Yo\/eGtNNodBWr0+grSVLi1ncPZr+ubopcq0uh0\nlYrxTFYB9hG8mgq4sed4a9m0SdVoS+fqWjKFohTrDbnoXKpU980HdNotGzYY4kouuj2JZXSVZhrk\nEim\/vB6aC7hi2zH2PcdIbV9aqLm60YF6Xele36h7qtodDt+YCLgtp7GElBpNaUJBguYqVcAOxICK\nVLY7MAkQ6X3D+otn81Jvd5VJGqi9aFpXZmngs0KtIa3BwBxA657jAxXMVeswSUdqaC+vQUeK9qTV\nNQlw0+7U1rb3pHxhSKVlSLXVBmxNasYIlG4maKvbNQvQ8Wx3e1F\/F1JqtqRQb0oFsNlKTbWdMWjd\nDECr1fsb0+uPnEu6WJZkviT5akPBnaMG\/aEz8YdHEUmnZ00xyPLmlgQAmMEUycMMBOXISxcrI0Xx\nWTCW0ExK74EFPVDCybREEDQKg6BMdZGB1CPsZtWfYbU7JRRPil6uIq1Zld5RuosKNJxISa3VMWcf\nXN3e+7HnPkKTTqqa00tliaEfEpag2lkUc7lEVacPyA1mfdcuHu0UKqXlHNtLCsqx9qieDsAxaAqQ\npmww6IFyDKdGYIoEoBJwcSiRlCje929uVYozpaqUYZapA35aWrYQ0AdApjUEFeO5ggTPY6JDyTaW\nBs7gKJSlcdKF6txUAd+9\/32eK5Y\/fI705iSq50SLxtXsrWOiEDBXroxcjd6YKZen26gXFtZmv23t\nyPFpBE1YB1xCqcjRphdLWPWxxSDiuZGbU8XiWxOMYlc1GE5mUIe6As3CGDyHXGIXzFbqaopw5ULD\ntpgB+EgFg\/GUeIMhZRSCBtEXE1AuhB7ItSuq5zmfpz9NFlc3dH8kKgEYI3AWk90DF1pOUvW\/ZL4g\nEQAmUJs0Ub7WnH4v5Kg7goInqD8NzfpIC6m5fALAMDZs9sQwWo52HsdZpf9oyqgjoIIExBg0iIig\nLtmgaZwQ7mmUqa9anCQBgBGQ1\/E9QVmPhVpT1SdbUR7tZrptZmVtfvvALVtO1wvc6+Am08Lh6RSA\nxwBMKjUz0+uFy9ZtbRebtA8\/TgCfMssIzo1aZJqpZjxbUHshYa\/vH4yH799npwS49ew8DvyinO\/f\ndPJswqnC+wRGIHdGpj4QncLyat11zvFZjPvkVA78moyNQkNwm\/ZAwaNgWCnrR\/t5\/Qeg7PPEAb+s\nrH7gqj82hxfThLAMKvizooRlEJZTxx+Z8Pnkk2XFwLKqfvwQClKx1zU4VvTn9FNt7o0nZ7H5ibYX\nAMrOoecljQ7U4hlGGo3xC5TvRE0WLq\/8XtVorTG5M4p1zzH\/8fOi2D3H4goEVXr5uK13PVRPs3g+\nHqtIuAjmMhs2a5OO5nflpjG5qfLl27r2\/s+\/hA4+BMARVv7O4GpUi1gYeM86GyvIP7B\/5FOKr9p2\nDOu+U\/No4cltNgur688fPy8o9RhuBIHYsNn\/qNqOy\/Nod3t1m8NlWVqzzgdiselt02wxXLM8qD9X\n4PQZzjQcXt9EQf4Bayd7tHFPEbsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-02\/1266513498-8576.swf",
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
	"npc",
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "activate",
	"e"	: "admire",
	"u"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_obelisk.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
