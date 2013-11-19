//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Cactus";
var version = "1344982233";
var name_single = "Cactus";
var name_plural = "Cacti";
var article = "a";
var description = "Hidden away in a scorching place, the Cactus has seen things he can never unsee. You can try to help, but help is limited. Do not, whatever you do, consider hugging the cactus.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_cactus", "npc"];
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

verbs.talk_to = { // defined by npc_cactus
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Mind the needles...",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};

		if (this.talkPC == pc){
			return {state:'disabled', reason: "You already talked to it."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var choices = {1 : {txt : "What?", value : 'what'}};
		this.conversation_start(pc, "Ack! Pfft! Get it OFF ME it’s BURNY.", choices);

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function createRookedButterfly(details){ // defined by npc_cactus
	var position_x = this.talkPC.x + intval(details.x);

	var erins_nightmare = this.talkPC.location.createItemStack('npc_butterfly', 1, position_x, this.talkPC.y-1000);
	erins_nightmare.ignore_sadness = true;
	erins_nightmare.not_selectable = true;
	erins_nightmare.silent_rooking = true;
	erins_nightmare.rookAttack(true);
}

function doCrazyShit(){ // defined by npc_cactus
	var pc = this.talkPC;

	var squid = pc.location.createItemStack('npc_squid', 1, pc.x - 150, pc.y - 60);
	squid.setInstanceProp('variant', 'squidBlue');

	/*
	this.events_add({callback: 'createRookedButterfly', x: 85}, 0.1);
	this.events_add({callback: 'createRookedButterfly', x: -200}, 2);
	this.events_add({callback: 'createRookedButterfly', x: 300}, 3.5);
	this.events_add({callback: 'createRookedButterfly', x: -320}, 4.5);
	this.events_add({callback: 'createRookedButterfly', x: -110}, 5);
	this.events_add({callback: 'createRookedButterfly', x: 210}, 5.5);
	this.events_add({callback: 'createRookedButterfly', x: -400}, 8);
	this.events_add({callback: 'createRookedButterfly', x: -450}, 8.5);
	this.events_add({callback: 'createRookedButterfly', x: -600}, 9);
	this.events_add({callback: 'createRookedButterfly', x: -490}, 10.5);
	this.events_add({callback: 'createRookedButterfly', x: -715}, 12);
	this.events_add({callback: 'createRookedButterfly', x: -850}, 13);
	this.events_add({callback: 'createRookedButterfly', x: 700}, 13.5);
	this.events_add({callback: 'createRookedButterfly', x: 0}, 14);
	this.events_add({callback: 'createRookedButterfly', x: -1020}, 15);*/
}

function onConversation(pc, msg){ // defined by npc_cactus
	if (msg.choice == 'what'){
		var choices = {1 : {txt : "Um…", value : 'um'}};
		return this.conversation_reply(pc, msg, "TAKE the AIR away. Suck it out. Suck it out & blow it into the North … the northwest. Mybialded. Mebber. … ACK!", choices, null, null, 'um');
	}
	else if (msg.choice == 'um'){
		var choices = {1 : {txt : "Listen, I …", value : 'listen'}};
		return this.conversation_reply(pc, msg, "SUCK IT AWAY AND TAKE IT AWAY. Put it in the bubbles and take it to someone who needs to know what burning is. I know too well already.", choices, null, null, 'listen');
	}
	else if (msg.choice == 'listen'){
		var choices = {1 : {txt : "Oh … kay", value : 'ok'}};
		return this.conversation_reply(pc, msg, "Tii boiled down the sky and poured it into the caves, and the caves spat it out into the air, and the air has come here to punish me. It’s BURNY. Make it STOP.", choices, null, null, 'ok');
	}
	else if (msg.choice == 'ok'){
		pc.buffs_apply('its_so_hot');
		this.talkPC = pc;
		this.apiSetTimer('doCrazyShit', 2000);
		this.stopTalkAnimation();
	}

	this.conversation_end(pc, msg);
}

function onCreate(){ // defined by npc_cactus
	this.initInstanceProps();
	this.apiSetHitBox(400, 400);
	this.setAndBroadcastState('idle');
}

function onInteractionStarting(pc){ // defined by npc_cactus
	if (this.doneTalkAnimation) {
		this.state = 'idle';
	}
}

function onPlayerCollision(pc){ // defined by npc_cactus
	if (!this.container.isInstance() || this.hasTalked ) return;

	this.hasTalked = true;

	pc.instances_cancel_exit_prompt('tower_quest_desert');
	pc.instances_schedule_exit_prompt('tower_quest_desert', 2*60);

	pc.buffs_remove('its_so_hot');

	var choices = {1 : {txt : "What?", value : 'what'}};
	this.conversation_start(pc, "Ack! Pfft! Get it OFF ME it’s BURNY.", choices, {offset_y: 25}, null, 'what');
	this.apiSetTimer('stopTalkAnimation', 2000);
}

function stopTalkAnimation(){ // defined by npc_cactus
	this.setAndBroadcastState('idle');
	this.doneTalkAnimation = true;
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

function parent_onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
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
	"npc",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-68,"y":-119,"w":144,"h":119},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKZElEQVR42u1YCVCU5xn+1agBiWfU\nGAxJNYmFNBEjVEFRgwdyKAu4HLoLywLLwv57oCw3LoeccsOyB7DscruwHKvihVmPjBNTEqeJk6PG\nycQkbafJpNOmrTWNffr+qBObaNpM1HSm+WbeAf75l+\/53u99nvd5l2F+Wv\/3C8yk0UuXZto\/GXfW\naDST\/+fwnfvonNPZK7\/JO3Tp1wn2ccej9GjK9zmcA46HHhhYD4aZttFlmodwITNDJfKcrVGscRt5\nVbnwVrS28ufy+V8fwPHBhdnvfvpbr6ELF2Y\/EIArGWZqpNucNZkC7xR9M393fVWYefBllXnktMrc\nO5RotnQKa\/oPS0OGHNKn6PVJx6+8+\/jB917fOHrpraXWixennf3kotu5j95zBTDpvgB0ODQPmTqE\nQcaWnb\/XtcSivCQcpkEWXQdlMBhi0DuSDNtJ5d+GHKoDtrPs8ts\/e+Ly+Kxj77\/Jc3xwcasDuD\/X\nbjsqWdR\/XDFsOJCM4upd0JTGoEyfBG1nMizWRAwcY2EeYdF\/QgnbCXZULfJ+7IHVn9XKnzJwQhnR\n0p\/8JzVlLr9agKJG0US02Vj0HlVg+PQedB\/ORr02Fm1mAcy9cSkPEqDTgePscGHdTghka7BPK8be\n2l0oaY5H5yEFug4rMOjYjbMX6lBeKoChXYThM8qx+wrqaYaZvnUG80LII9N+nuy3LNQyIvujPC8Y\nQnYtZS4e2ZWRqDYlTWTPMiKfuNo33tej\/0gBWimrI6dUnx09o1p0z4FtcWKeCGEY5w0M4+LnwswP\nmMnMrasM4zd2SRAr3wCxchP21gmQURaBpu5UWI8r0dydAH2PGI7z5Th3UYfGLiKPNf6aXrsj\/J6A\nIjCzueB+DyStC5o11WvLrKkr6dkE4wZOKtlyvRhBUc8hIm4V8qp3Yk8JD\/oDLHoOpyJJtQ6bQz1g\ndxTi7Y+7kJ8dhnaL8Mv+I1LFPQEYyDAzo90XRskk68x5ZTveqm4QfGzUx46LfH6mDpn18EabQ1lc\nok1EjNQHcfL1yNkfBVVhCFoGWFiJvfHy1Qjc4U7s1eC93\/WgpiUVPYfYf9jPpKXdSU+5uP2ZL8Ms\n4LTzO0GWV0ams1mbPt9TvP2fRmsyDr2Sfd02VnhVxXvh7WL15vHCBhEC+csgTlmHXcLVENDPCp2Q\ndDAVWrriGlMcBsYK8M4n3TAP56DvqPKrkdPK3m\/us4qSwZURgXTm\/ubq3IdhnPwZxvXONccwM2I8\nF\/FEYctfk6r8iQBRJB0p6Bog6XCUoL1TdKr\/OFvK5vDgve4JBIS7Y6n7gol4KdAdRXVRkO7ZQuGP\nmnox7EP5qKqMQ+8R5XXqMtY77bl1prN3jmqDqKg+JkPOf3GkrjR0VcijM3beNXt5qevck+N97BLl\nSyQd0bDYU9HSKUNVQRQK5OuP9R6RlW6P9sKzzy+ciGXLH4O75yI8+4sFeIaL526Ep+fjMLXIoetU\n3spg9+37bJzBLAyd87Bfuny9Uazw+0KeH4yqtgR0DklRpAo4nhDgMZde+7Zrso0mLs4p4XUnZ2xC\nSVM0TLZU6CxytNuUGDypTLKNsaXq4u3w8nPDi2sWY0vYc9glXY21W5bC08cVK3wXY+VaN\/j4P42h\nE\/vQOpDJAbxjDRapA\/wSJKvOcZJVUE+CPixD50gqDp8sQWa876WgR6Y\/e4uct9akPInv0gz1Vmt6\nwXaU10ZBZ05ERcUu1NdG\/qWhgbe0byS5jtM8kcIXMcmrIMnwhzTLH\/KczYhX+IHN3oTMkhBouxS4\neKUDNe3s7QAn36q38sxNs8rLIwqVmVu+YHMDSY4S0TOqQKMuFo7X62G0xL8WPGv6po2PMPP+jVV8\nt7kexcU8c0mT8GpTVxJqqgkk6V5Ouv+HQl83YXOLYKy6LRGRSd6IU6yDmjSQY7FpiLI8xKLJnARD\nj4SyXYS3PrwBsH9M+SUZB1EAw8wNdJ66guyaS6HCL1RTHPKmeh8PWRURoNZJ7ZHrRNnoO5iLTlvS\n0J1KcAqX0r5jimh9V8KleoMAeWn+2FcbBmnaesQGe3xaUM67Uk8gxIoNxGBvZO77GqDJJkODPhZN\nbWIQ63H+XSPqzCwoe9cGx1iBRh2UmMJbUZzE98xVJ\/j25e0N+cOeIh5KG3cSQCmayWz0HMqFwST+\ne31ZiPSuRGlu5q\/X6qLOV1MNFtPm2aXbkFsVjjT1RqgyXoKhV4IUYmtkxPNQF4Z9DZAyaB6WU92x\nZLeK8TJdla6XxfAp1fWiBv4r6vygK2zCGkhlfpAr16OQWmQ26WiVQQhjXypqjUnQmcgNjclHKjUb\n7u6A0vjLXXW6qNp2W+rn+i4pGlrEtJEUur4kamlidB6UI50yt0O8EpkVfOzeF0qgZNC2J8DQLaF3\nZbRJMWWunHyiAt0HkyGhwyWR\/CSTfKXmboVi71aU6gSoIMej6xDTHgloo\/\/RrI0622dP8v5OoebE\nck\/UisCqsvAWy6DsY61Zcr3eJKVrUMFgFMPYFkc2a9cEwD3FYUgrDoWhj67IkgRjbzKaulLJMBRR\nTe3lCIJOewoq9ALUmuNuRjyZCxHKGqKwO4v6eUHgnxt1MWcOjLJFWm2E7+3jwt368UNcQavCn1\/S\nN5oSaOyI72gfZD\/SWaT\/7Bveje4hGZ1eRIbBDypiO5dBPZlXrt112OWUZdkEQF1vGgZfVk5kXE9E\nayaQZnI7pkHKVGsc9K0iNJkSUL4\/4lVta8w267hkFjdgfa\/erNEwkxsawhd3H0tZqeR59thOpqsa\na\/nna4xxEESvhCwzABnlnJuRQN\/HEpPlJBk3ALYMKLn6m6jJWl0CGtulRCQ1uu3ZOHy6BKNnStHZ\nq7haqdnelCv1cf3hRmIBs9Rulzg3NfF9WnoTocrdBmnmFqSXhpOciLCfCr60IBQV9XEENIt0jQCe\nVr7TZo4bpEO9QVcIoykeXUSk7mHFtZ4h9nJTbeT+rFivFYFPM9Pv6UzSM8peyK\/ZNQHwhmGNm2Ci\nrkdKYFMIYDaGHGkwWQQG4eon3cvKgueUaYKXJPzyyWBlqMeqeO8nwyyW2Hk7vRYsCZnn5PrNjvFD\n1pSoZ+aEFKZvdpQ2x0KeH4L8mp2obBWijSY7rg4bO1kYyB+SOMPmSFx863P+TozrC2RIuG6yeeb0\nZ7h+fF9GAMO4ZGrPUUUkdZrrWeVR5AmjJ5wPRwajlUWdhUX1\/kg07A8bF\/ouXPCjfBUyPCb3oNnk\nsqZOSO1uBzQVO2CiujRaZRM2v39MdXXolGrbj\/Y9jtYqeqzDLmuo70j5cm+tAHspi3oiQHOHlAYl\n+VfWE\/JDPXbJoz8GNq6YnVxcXObnVUYE6ftS3tjfKvmqtl1CxlRBOqi41mWXXShr4oc95Tmbm22m\n\/UcLf48XZ3+4wndzfWq2pzwzIKemVXS5xZr811ZrwmdVhuhfxUvXKubPd15B73DfzXDj5vQHCXAm\nxfybIFfMW+DM2yHwKkjXBHXEiFdrF7vNVtJzHgXXT5+gmMPcQwn5b9bkm9c2g7kxnj5OsYRi2c1Y\nytwYeriDPHxH2\/7T+ml9e\/0LZ5\/BZzY8UOoAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/npc_cactus-1305162467.swf",
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
	"npc",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_cactus.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
