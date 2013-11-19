//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Party ATM";
var version = "1348262407";
var name_single = "Party ATM";
var name_plural = "Party ATM";
var article = "a";
var description = "The party don't stop 'til I walk in.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["party_atm", "npc"];
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

verbs.extend = { // defined by party_atm
	"name"				: "extend",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Make moar party longer",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var is_taster = this.container.instance.getProp('is_taster');
		var template = this.container.instance.getProp('party_template');
		var prices = config.party_spaces[template].prices;

		if (is_taster){
			var choices = {
				 1: { value : '5', txt : '5m for '+prices[5]+'c' },
				 2: { value : '15', txt : '15m for '+prices[15]+'c' },
				 3: { value : 'no', txt : 'No, thanks' }
			};
		}
		else{
			var choices = {
				 1: { value : '10', txt : '10m for '+prices[10]+'c' },
				 2: { value : '30', txt : '30m for '+prices[30]+'c' },
				 3: { value : 'no', txt : 'No, thanks' }
			};
		}
		this.conversation_start(pc, "Would you like to extend the party timer?", choices);

		return true;
	}
};

function make_config(){ // defined by party_atm
	var time_left = 0;

	if (this.container && this.container.is_party_space){
		time_left = this.container.instance.getProp('expiration') - time();
		if (time_left < 0) time_left = 0;
	}

	return {
		time_left: time_left
	};
}

function onConversation(pc, msg){ // defined by party_atm
	if (msg.choice == 'no'){
		return this.conversation_end(pc, msg);
	}
	else{
		var time_left = 0;

		if (this.container && this.container.is_party_space){
			time_left = this.container.instance.getProp('expiration') - time();
			if (time_left < 0) time_left = 0;

			if (!time_left){
				this.conversation_reply(pc, msg, "Down low, too slow.");
				
				// Just in cases
				this.container.instance.destroy(true);
				return;
			}
		}

		var template = this.container.instance.getProp('party_template');
		var prices = config.party_spaces[template].prices;
		var duration = intval(msg.choice)*60;

		var cost = prices[msg.choice];
		if (pc.party_extend_space_time(duration, cost)){
			this.broadcastConfig();
			return this.conversation_reply(pc, msg, "Party on, Wayne.");
		}
		else{
			return this.conversation_reply(pc, msg, "You don't have enough currants to do that.");
		}
	}
}

// global block from party_atm
var no_auto_flip = true;

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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"party",
	"atm",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-138,"w":125,"h":138},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ2ElEQVR42sWY+W\/T9xnHUbeuQGEk\nkPu+nfiIHSdx4oM4dhwnPmLnPkoOch\/OSQiBpCMEaEeJaFAohdAWSgcrR0sBca3T9GVVd6CxMSam\n0m4T07TfkbY\/4Nnz\/thh0aQhqjibpUf+5uuv\/Xl938\/zvD\/PN2vWvODr668etH1x986TL7\/4nH5z\n7y49evhr+tPjB\/T4j\/fpDw9+Rffv\/Zx++eVP6e7PbtLntz+jG9cv0ZXL5+jCj0\/T6feP0+KJo08u\nfnxmZs1qvT799Ky01aqkynojNbZaqK3HTj1DbhqeqKLRyRoaGPNQl89JrV2lVNdsJk+tnkpdWioq\nUVG+IYNyC9NpenpUWjXAq1d+JJltKqrdVkQtDNHlc5Fvh5eGd1XTyK4aGhyvFMAAr28ppooaPdmc\nWjIUy0lbkCZifLxv9QCvXT0nGcxycnh1VNlgFBDbOkoELFRr7rBRAytb3WgiV1UBlThyyGRRCOWW\nAAd97asHeP3aeQmLGXlRi13N6cslhyefnJU6cjIQwO3uXLKWawilUGCSPQNbiokJ3+oBfvP4\/sit\nmxeln9y5JN26dVG6efOCdP36eenatXPS1StnpVOLR+jkiTk6dfLI0\/PnT0rvLR6R5udnpdnZSQlg\nQ0Nd0gfvLcyv+X+9Ll88O3P7xifU27t95H+++N7evPmJNo10wFcgvTFUKOLQiF6a7S94Fh+dmHny\n6OE9mvBVPZntz5fmxozSkZ0m6a1RvbR\/QHfmUE\/uplUDnOrIeTBQL6epLi0xHDEo7evPp9e7c4nB\n6fWeXDo65aBTcwPUXaemPZ1amu7iz7ZraLI9h6b5Or726ViryrsqgBNtagLgUJOCWt3p1FObRf11\nCuqvV1Avjvm9r07O5\/zRVyungQaFOPY1KKmzMpPavTLqqs6kutKk4JfAWHP2g8FGBe1oziZvcQKV\nG+LIYYyj0sIYqiiKJw+H1yqjWreeykq0VF6aK95VGWFk1UWSa2u8uN6uj+G\/Y4K\/m4y3qKTxlmxW\nQ0G1tmQq08eKBUt00VRTkkQecwINDjTRnr29IvYe9NHx9\/dSZ0cd5cg2kjsAKCALVwFwZ5ta2tmq\npp6aTAFozY\/GQkLBSkuiABzd0UEH3hqhgxxTM320\/9CwOKdJ3yAUBGS5IZYqixOCbzUoegB2VWUI\nwHqHktp5rx1otQvAKmsiDY+20wGGAuTUvj7a\/YMecU7NgLgBS16UUNBligu+WU+2a0SD9HFDOE1x\n1NtcSrcvv0ttjW56c6qbakvTqbO1gno6PCJaGm1UW6Enj11LBcpQoaC9MDYAGC+tQpOouBMzaPg1\nJTU5UmmovZzeObyH7nzyLu3f00+n3p6ksQ4rTQ1W0NSQlyb6XbRnuJYWDk\/SsblJ6m\/UcnmguxX8\nG9lP9\/fq1EEF7KvNpB0tKhrdpqLx1mzaP2igwzP9dPX8UTp9bJbOLb5Js7vaxIz4569\/Tw9\/9wsx\nJ\/71L4\/E3zcuHxOeOd2tFV7KHhpcSF+DnOCF3dUyGmEVETP9enrnh0N0eG83LRwcoIkuMx3a56Mz\ni4fozImDdPztafrw5Bt06ewcfbw4Tbs7dbS7A3A6YdxTndqnze7klUOOtajMSDF8cLBRLuD667KE\nEXfXZHHjZFGzK522e2TCxGE7iA4254ayFDbmZK7RZKriZvKaE0QnI9A4huywlVvOUFOmmW2Gd4os\nTrFSpBiQgKiyJAkAa36UMHAcc5eSm40bcADxe2CsOL\/8nGsrjD5aCoqCSC\/qcIQB0dEArLf71ann\ngGHjGJYDEE8AFjtHZbHfJxGvOVMFIM4LJY1BsBxWrA27CNKKFKPIe9mwoSCAGstTycn2AQCoCGVE\nOi0JvOPEsFpxAhLg25xp5OB3p9hVggS4ozV7pqdGxsNCFgF0N08n2FGEQXOKoSRSBgiYOPZmwOMd\nEEvqeYoSBCB81MvX4j1ogMNNCuGBPBcK0HZP+rN0+rewOC74CDLlRIpGqOadBeENwFVbk8QNoAaX\n\/vaDJtCKARlsZslaoCAAMXphATdHpSWZj+NJlRZCmozNXHspIoWurUix\/wYAhKgSN8UK2\/zNhJ0l\nKIMCmgSDp4\/BBtkTW93+VKFbXUWJlJu1hRSpIRybWJUkthVWihXTKcJJrwoXYCgHqF7KW14Ff0d0\ntyFIgLCZIfZBGDVsxmP2NwUA9ZxaVVooaWSbRXgY0KiJouz0UB61tvD8F8vDRJJIN64vKYgRe3O5\nsJ74lQNiFoTFYJoBJIYGjzl+mcfFkTZzM6k5vVpW0mGMF2AAFCm3p4qGwTSDa\/JZVUtedMCwg6Dg\nQIP8M9gLAjsK0u1lQMyConthKbAXVsPONVfB3arN3EI5HFCT5z8qYxiobCuIpVIedlECuN7Gv9FT\nl7Kyh6kWV8YsDBo7iejmJqVQ0BmYkMXIb04QRV9d4jdrnBf2w58hMGoB0G1OFAq7i\/yPDVC1xZFm\nXgnfSw3ewmmYNNRDJ2MnqWELwcJQC3BoGKfo6ESy8LQNlfzGnShSCbWVDFjI9ZqvCBNKlvM1W3Mi\nyKKNLuN1vvNtwfCFVzm2JCcnJw42Kr9CHcJioKK3OD6gnh8CKSzSRopUm7m+0BRLytoZBPAluhjR\n7fnKcFEKUBXg2WmbanmdMI4NHN99EbhXOFAXkRxJHJktVXmXAIiHJmxzqD0o6DTGCwAsZM6NFA9T\nqDuvxf8gBUjsuygH3EAxw+NmsKssPXhlJm1s4zWSOaI5QgLr\/9cX7mAjRwRHIuA4cjSqLF9Tedo\/\n0cmwGtgEFoGCUALDgj2wIHyx0pIkPgPYUqfDXgAlwuC\/FscmTcQiryEPiAFRvs\/x8vPUCwncTQqH\ngiNv7dq15kZP\/iIapQeAJn\/9wWhxjGJH0WNBGwMLdbFTGOKEQeO8JT9K1CN2HTwV4iZx3pAdforX\nUHKkLlPxe8+rPdRC+DIFNRz60I0bK1oq5GLs8nvgv9OEdxS9WNQQ9+wzuz7m2eNmKSvofy7mm2DF\n\/bYUSzpl2MnAOonLFHzpeWl+OXDRUpozONTr1q0r8Nqz5\/DoWRboQCxg5cVsBTHi3RNIq39x\/8wn\nlMZ\/Ibhz8SxdzGrju7gRfN+ojrj3H3Av3NHrAnJH4QeioqLkSqUyr86e9o1N518IaURzYKLGHouO\nRsOUBRrHYfSrCRDUqYnBuObIoI4QwGgcjSz0b\/z7m5+X1hexnPWBH4kyapO3lpmVpzk+KiuW\/92q\nT\/mgpDDljCk34WKFNetOhU19odKuuVBikP3WZVX9o8ahvVbvyj3ntmluFBtVH5ryMwaUKSHVKbHr\nXRkJr5bIEjdYgvoIurCw8Mr8\/HyITCZDt4cGPCw8kKKoZREZOB8WcIb1gfL5Vqb8L1zu7IZcehwB\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/party_atm-1318367557.swf",
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
	"no_rube",
	"party",
	"atm",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"x"	: "extend",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("party_atm.js LOADED");

// generated ok 2012-09-21 14:20:07 by mygrant
