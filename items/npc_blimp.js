//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Blimp";
var version = "1344982233";
var name_single = "Blimp";
var name_plural = "Blimps";
var article = "a";
var description = "Or is it zeppelin? I always forget. Anyway, it goes over like a led balloon.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_blimp", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.box_width = "400";	// defined by npc_blimp
	this.instanceProps.box_height = "50";	// defined by npc_blimp
	this.instanceProps.box_center = "";	// defined by npc_blimp
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	box_width : ["Width (radius) of the fly box"],
	box_height : ["Height (radius) of the fly box"],
	box_center : ["x,y to center the fly box. defaults to initial position."],
};

var instancePropsChoices = {
	ai_debug : [""],
	box_width : [""],
	box_height : [""],
	box_center : [""],
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

verbs.teach = { // defined by npc_blimp
	"name"				: "teach",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.phrases.length == 3){
			var txt = "I can't learn anymore phrases. Pick one for me to forget!";
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

function buildState(){ // defined by npc_blimp
	if (this.dir == 'right'){
		return '-' + this.state;
	}

	return this.state;
}

function onCreate(){ // defined by npc_blimp
	this.initInstanceProps();
	this.default_state = 'pathing';
	this.dir = 'left';
	this.fsm_init();

	this.owner = null;
	this.phrases = [];

	this.apiSetHitBox(400, 800);
}

function onInputBoxResponse(pc, uid, value){ // defined by npc_blimp
	if (!pc.is_god) return false;

	if (value) value = value.substr(0, 150);

	if (uid == 'teach' && value){
		this.phrases.push(value);
	}
}

function pathing_onEnter(){ // defined by npc_blimp
	this.messages_register_handler('pathing', 'pathing_onMsg');
	this.fsm_event_notify('interval', null, getTime()+1000);
	this.setAndBroadcastState(1);
}

function pathing_onMsg(msg){ // defined by npc_blimp
	if (msg.from == 'interval'){
		
		if (this.dir == 'left'){
			var x = this.x - 5;
		}
		else{
			var x = this.x + 5;
		}
		var y = this.y + randInt(-5, 5);

		var box_width = intval(this.getInstanceProp('box_width'));
		var box_height = intval(this.getInstanceProp('box_height'));
		var box_center = this.getInstanceProp('box_center');

		if (box_center){
			box_center = box_center.split(',');
			box_center[0] = intval(box_center[0]);
			box_center[1] = intval(box_center[1]);
		}
		else{
			box_center = [this.x, this.y];
			this.setInstanceProp('box_center', this.x+','+this.y);
		}

		if (x < box_center[0] - box_width){
			this.dir = 'right';
			this.broadcastState();
			x = box_center[0] - box_width;
		}
		else if (x > box_center[0] + box_width){
			this.dir = 'left';
			this.broadcastState();
			x = box_center[0] + box_width;
		}

		if (y < box_center[1] - box_height){
			y = box_center[1] - box_height;
		}
		else if (y > box_center[1] + box_height){
			y = box_center[1] + box_height;
		}

		// Move there
		this.apiSetXY(x, y);

		this.fsm_event_notify('interval', null, getTime()+100);
	}
	else if (msg.from == 'conversation'){
		var pc = msg.payload.pc;
		if (!pc.is_god) return this.conversation_reply(pc, msg.payload.msg, "Cheater...");

		if (msg.payload.msg.choice == 'teach'){
			var args = {
				input_label: 'A witty phrase:',
				cancelable: true,
				input_focus: true,
				input_max_chars: 150,

				itemstack_tsid: this.tsid,
				follow:true
			};

			this.askPlayer(pc, 'teach', 'Teach Me', args);
			return this.conversation_end(pc, msg.payload.msg);
		}
		else if (msg.payload.msg.choice == 'nevermind'){
			return this.conversation_end(pc, msg.payload.msg);
		}
		else{
			for (var i=0; i<this.phrases.length; i++){
				if (msg.payload.msg.choice == 'forget-'+i){
					array_remove(this.phrases, i);
				
					return this.conversation_reply(pc, msg.payload.msg, "Ok, forgot that one.");
				}
			}
		}

		return this.conversation_reply(pc, msg.payload.msg, "Not sure what you mean there...");
	}
	else if (msg.from == 'player_collision'){
		var phrase = choose_one(this.phrases);
		if (!phrase) return;

		var pc = msg.payload;
		//log.info(this+' collided with: '+pc);

		if (!this['!colliders']) this['!colliders'] = {};
		if (time() - this['!colliders'][pc.tsid] <= 60) return;
		
		this['!colliders'][pc.tsid] = time();

		// 30ms per character + 1.5 seconds
		var duration = 1500 + (phrase.length * 30);
		this.sendBubble(phrase, duration + 250);
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
	"zeppelin",
	"blimp",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-37,"y":-50,"w":74,"h":51},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIb0lEQVR42u2XaVNbRxaG+Qf+Cf4J\n82Xm22SYqkwcO17EJjZhy0sCBgH2xDYmYCOwzb7vO0KA2EGsAoFB7KuQjG2CbRaxmAHihRovU0ml\npt45p4WEIK5UPmSomhpu1Vv3qm\/3OU+\/fbolOTkdXUfX0fV\/dgE4TnImKd+\/\/1H17sOPhg+sjz8Z\nPpLobn7\/4SfLx3+Jz9qff\/63kvpKeNx\/E0ry+s077eb2jnl5ZRsvljYx92wD8wub9LyNRcsrLK++\nhmXtDVbX32L15Y64r5C4fW3jLTY2d\/DD63eWnX9+VB6EPXPO75qLx0WDu\/SKge+nz8nSfyuYs2Vl\nSzszu4hJ0wKMj5ZgemLB7Nwqnsyv4\/vnG3i2C7mw\/AOWVl6RXguoheVXApzbny9ticnMUX8et7C8\nhbX1VyrT4zmJxE2uDfn7PcQllSItU4Pcgnrk5tfiwqVQ+a+BHVtb39aOG59heOJ7jE49w8TMC0yZ\nFzEzu4xpM8lkETKa10jrMM1u4NGTTcw+3SJti7v58SZmHm2Q1qnPKvVZIVlgemzB8PhTePoG4HpY\nEuJSKpCRW4+isnZUVPegtsGAUnWn8pNwtIzyceP8Tt\/QIxhGHmOIAg1PzGFgZA6G4Tn0DfIzgY8t\nYHRiCePTFkzNrBLsOoG8hImAGJbBjOaX9G4NE9MrGJtcxsj4IgZHn8MwNI\/apn7ciEhHeHQe7iWW\nITmzGjmFzShWtaOsoguqyq5fAo5Pzyt7BkzQ98+gd9CMhyRd7ww69EZ09Zqh75vFw4GnIsHgyHNy\ngSAnCXLKgknjigBlIKtWRRtPgPtwXxtc38Acevofo73LCHVNL+LSKhGbokZqVg2y8huRW9TMsPuX\neHPrjaq9ewKdvVPoejiNVt04mtrH0NI5SYGm0ak3ofvhIxGYE9ghycmRiUUBMTa1TLBW8TO3sWtD\nYy9EX0c4jtWpn0EbxW7pmECxuhM5BJaYXoXkDI1hH5xlbUvSrh9Ha9c4AY2htnkQdc1DaGwdhbad\n2gmyo9so1K6bQmvHpLi3UXsbPXfQs657Gl2UsKtnRtx13J+Sc58WitFMsRq1w6hrHEAD3eubh8XE\n2YDmtjE0tIyIvE3tw5aEhMJj+wB1vZMWeoGaJgMqax9C09BPNTKIGgqmqe9HBS0D1QTKq7pRSUWs\nqesThVxPfRq1Q2im4C1to2glx23S0mdub6SJ1lOcGoqjodi8CThOqVon6q2EnFNTG+etbjSgimL3\nD5mc7XC1zf2SupYBqGv1UNFAdU0PDdIhv7SVakGLgpJWFFEg2lUCskKjRxUHc4QkiCZyhYFYTS3D\nAryBV8IBrpImqq7S0ybQoaS8A4VlbcgvaRGbg2svM68BBaVtqG3s31tiTUOfqqxKJzpzDaTl1CGd\ntjwP4IEcgN9xQA7Ms2cXHCEZor5pQMDaxG38zg5HYxiOJ1lS3imOFJ48m5Bd0CSOmbTsWrGbc4u1\nsAMWqzvMGUSelKFBIimFdhJD8mx4YB51Lijdc5GPADskOaLZBWUQR3Ebv+M+tmXlsRyDY3FMjs05\nOBfnFGchvauq7kWlRm8oLOuQO6Xl1uFBUrk4LBN4B9EMUmkmGY4uFpOLZP0epNVJNS03J+elYxB2\ntWoXqnIXjPuwa9Zl3Q+XU0jOEVwWQXK7iEXi\/rxqnN9J8W0swpXZiI4vQTydR0kOLmbsusjnkiMk\nLzcXOQeybR5ePoZh8WeWDYwnVayy1hwvqw0umL7i7t7PE4bYzLDVI7cpYwvh5OWnsATfiMXtu5mI\niM6hxiLEJpcjhZxMd1hqHphHkJyAExXbQTsFLIPYxJ+5nR1jMFFv5FpOASXO0iA+RYV78YW4djMW\nVwLCcFURgVsRyYhQZiAiKgNhkakI\/fY+ZBfo+9hDFpjueT4YoTfjEB6VRZDZuHMvF1E0s5g4gk0q\no8OzghzlZa8TRc0bR4Cyo5ScXRUqY3eahbLzaenyaMNlVyOZxscnl9IPghI8SCwmuCJExxVA+SCf\nHMzFLQK65B8Gb78gnHOV4\/RZmcq+Sdx8Fcc9ZEE7nvQyIOQuvlNmITImxwr5IA\/RsQVitvcTCDax\nBHGUKD6lFAmpBJ6qQlJaOZJZ6XvitqQ0lXifkFImxsQyXEKxiOUIFx6VicsBt0ErCRfpFfztSw98\nfsJ9Z99B7S4LlEtlQWBI+dc3cTMyTUBygCgKxJAxu5DsACcToCQG+JSEYzYwGsNjOQbHitqFU1AN\n+spDBJyb9zf44qRUAH55ysvyix8KDMmALK\/zCvgH30HYnbRdSKuTMXGFdjcFqA32gLiN39nAeEwM\nuxabTxPPpnKKhd+l6\/CmPAfhTp72hov7xWuf\/Kkl9Ql09pQFWmyQHODy1dsiYCTVptLm5i4o1xID\nHBS3W6F2l5PAbtNk\/RWRkF0MsYIJuCD40P3EKU8Bx5AubhfNv\/orWir1P0aASgHpZ4Vk+VxQ0PLf\ngOJ6DEJvPKDNlClgGSDGQZExWWIX3opMoWMkBgHBDBUqxttiMZyUNifnkvp84+xzPtDZh8xxc7vy\n2\/+38OahulR5+il2bG7aQH0uBNvle0A++7Q3zrqcQRapTJHOsX\/XP02eXJ8EywkcE3ofAD\/Y5uHt\nD3eSi8clggv4w6H99aSvQUNQaJSoH4nHRZx18bPLTXpJSOLqB1d3OaTeXwtnD\/W\/cbt+VslnWjQV\n\/+Wr4eAjih1jEBkdG2clMnx11hvuXlfwmfNJfHXO13KogIOTL+Wqqh5x8PJZ5u4biL9+fhZ\/\/NNn\nkJBrfGewE6c88Oe\/nMQZV7nhUAFHTf84PjSxpiou19kBvzhF59hJd+HmGZcLOxL3y1qpb8A1V69D\nrL2Dl9H49ljIrThnVzoibPrdd+jRdXQdXf\/j138AyAoQ627D+fUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/npc_blimp-1301717692.swf",
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
	"zeppelin",
	"blimp",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "teach"
};
itemDef.keys_in_pack = {};

log.info("npc_blimp.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
