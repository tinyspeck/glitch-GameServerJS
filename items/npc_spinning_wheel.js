//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Spinning Wheel";
var version = "1344982233";
var name_single = "Spinning Wheel";
var name_plural = "Spinning Wheels";
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
var parent_classes = ["npc_spinning_wheel", "npc"];
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

verbs.spin = { // defined by npc_spinning_wheel
	"name"				: "spin",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Test your luck",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.owner == pc.tsid) return {state:'enabled'};
		else if (this.spun) return {state:null};
		else return {state:'disabled', reason: "This wheel isn't here for you."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.owner != pc.tsid) return false;
		else if (this.spun) return false;
		else{
			this.sendMessage('start_spin');
			this.spun = 1;
			pc.announce_sound('SPINNING_WHEEL');
		}

		return true;
	}
};

function onCreate(){ // defined by npc_spinning_wheel
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);
	this.setAndBroadcastState('appear');

	this.messages_init();
	this.messages_register_handler('global', 'onMsg');

	this.sendMessage('disappear', 5 * 60 * 1000);
	this.sendMessage('spin_me', 1200);
}

function onMsg(msg){ // defined by npc_spinning_wheel
	if (msg.from == 'spin_me'){
		var targetPC = this.container.activePlayers[this.owner];
		if (targetPC){
			this.sendResponse('spin_me', targetPC);
		}
	}
	else if (msg.from == 'start_spin'){
		this.setAndBroadcastState('spin');

		this.sendMessage('end_spin', 2500);
	}
	else if (msg.from == 'end_spin'){
		this.color = choose_one(['green', 'white', 'red']);
		this.setAndBroadcastState(this.color+'_spin');

		this.sendMessage('give_reward', 1500);
	}
	else if (msg.from == 'give_reward'){
		this.setAndBroadcastState(this.color+'_spin_end');
		var targetPC = this.container.activePlayers[this.owner];
		if (targetPC){
			// Run drop table
			var items;
			if (this.container.class_tsid == 'newbie_island'){
				items = [];
				items.push({currants: 100});
				targetPC.stats_add_currants(100, {type: 'spinning_wheel'});
			}
			else{
				items = targetPC.runDropTable('spinning_wheel', this);
			}

			if (items){
				var slugs = {};
				var bc = 0;
				for (var i in items){
					if (items[i].class_id){
						var stack = apiFindItemPrototype(items[i].class_id);
						bc += stack.getBaseCost();
						if (!slugs.items) slugs.items = [];
						slugs.items.push({
							class_tsid	: items[i].class_id,
							label		: stack.label,
							count		: items[i].count,
						});

						if (stack.is_musicblock) targetPC.show_rainbow('rainbow_spindoctor');
					}
					else if (items[i].currants){
						var currants = intval(items[i].currants);
						bc += currants;
						slugs.currants = (slugs.currants ? slugs.currants + currants : currants);

						if (currants >= 500) targetPC.show_rainbow('rainbow_spindoctor');
					}
					else if (items[i].favor){
						bc += items[i].favor.points;
						if (!slugs.favor) slugs.favor = [];
						slugs.favor.push(items[i].favor);
					}
				}

				if (bc <= 10){
					this.sendResponse('prize_tier1', targetPC, slugs);
				}
				else if (bc <= 100){
					this.sendResponse('prize_tier2', targetPC, slugs);
				}
				else if (bc <= 500){
					this.sendResponse('prize_tier3', targetPC, slugs);
				}
				else{
					this.sendResponse('prize_tier4', targetPC, slugs);
				}
			}
		}

		this.sendMessage('disappear', 3000);
	}
	else if (msg.from == 'disappear'){
		this.setAndBroadcastState('disappear');

		this.sendMessage('destroy', 600);
	}
	else if (msg.from == 'destroy'){
		this.apiDelete();
	}
}

function sendMessage(type, delay){ // defined by npc_spinning_wheel
	var delivery_time = getTime();

	if (delay){
		delivery_time += delay;
	}

	var message = {
		'from' :	type,
		'to' :		'global',
		'delivery_time':delivery_time
	};
	this.messages_add(message);
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
	"no_trade"
];

var responses = {
	"prize_tier1": [
		"Congratu... Oh. Well, it's still a prize.",
		"Come on down! The prize is ... terrible!",
		"Hmn. Well, you're not going home empty handed, right?",
		"Booby prize!!! Heh. I said Booby. Heh heh heh.",
		"Try again... You smell lucky today...",
	],
	"prize_tier2": [
		"A win of mediocre value is still a win!",
		"A prize just above the level of booby prize! Gratz!",
		"Winner winner chicken dinner! Or something of equal value!",
		"Nicely done, you've got a knack for this...",
		"I see even better luck in your future. Try again soon!",
	],
	"prize_tier3": [
		"A triumph! Well, almost. Two thirds, maybe. A Biumph!",
		"Oooh! A whiff of the jackpot! Maybe next time...",
		"Congratu - medium-sized - lations!",
		"Use it wisely, spend it well, winner!",
		"Ah, the luck of the Irish. Are you Irish?",
	],
	"prize_tier4": [
		"Wheeeeeeeee! Who's a super-special Glitch then?!",
		"Oooooh! We have a WINNER, laydeez and gentlegiants!",
		"Oh my! I believe you've hit the jackpot!",
		"BULLSEYE!",
		"Didn't you do WELL?! Spin again! Tell your friends!",
	],
	"spin_me": [
		"Spin me!",
		"Give me a whirl!",
		"Spin me right round, baby. Right round!",
		"Spin, spin, spin the wheel of prizes!",
		"Roll right up! Spin it till you win it!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-104,"y":-273,"w":207,"h":283},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHlElEQVR42t2XeVAUVx7HOyIilyAB\nRAQGAXFFBhAkIBAQFgVCiDGKRVgECUdAzGqCcpgQFGICuKhIgOUSURATOQRFHa7hGI4Zh0NGQYEZ\n7jgoLiqbrdrKbn339RRhJfnXGavSVZ\/qrunpX3361+\/3fu9R1B\/9OJt4QJ0+VxanmwKQp6\/bWZe0\n37hYx4G\/MG9bmcR3Hvcd6P\/afbYv2AV9IQRyHj7nBp6nJTp8HH+4RVFBMpdr3uFyvNVm\/dz45U\/w\nsjcLwpNBEJ75FNMlsXgY6gVxSTyeNadBzDoJ3sduuKmpeVZmcqz9u91anTZiuvgLdG5gYL4xEz1u\ndhD+NQAjx\/zRoqaKdm0NiL45CL6nPX6ZvIpmxjrITLDOzS64JyMQeHwNMxePQ+BpizZzIzytPAWu\nAxMC7+1gU5REcPJSskSwadMm2QnyKUqN+9lO\/GfqqiRDXCdbjGceA2Zu4HlXPp5Wp5NM7sd8RyEg\nvo4nDRmopii2TMdgvbP1Dz3JQRD4OoPvYQ\/enu3sbuYGdpOaCruFyDSaGs6J4v3xU3kS2g205yrk\nKUuZCtJZFCoonGUbMea4Kipsmmpl5UWalZWLxIT6QwG95yM\/rHoj08wAkbqqpIQcRUVc3mqJ8j87\nLeH62jW4t3UL\/v657+E3IjijqhrEjTIG514YusZjFoFgP0R5DmjZ6wqBni4exOux34hg8XjYYZsJ\nG5hOMhdxFW3E\/CVj8JSVJdwl2W3WVkK9ktIumQteGXCbC3i0Hq9Sz9PBcPh7GElNRSf5\/JwVK1Ar\nL4+OWPM2mcq9LIgMGrPXwiNdXdDnCbe3MXNgFX4ud4cw6wzEIyPo0NFBOxEkUwxa3iZZJIUlM8Hp\nA+5VtNyr0IJTJ3djqrsbYrEYvQEB6CCCN4hgg4EuOhOsA2QmOOa6Ze63gvPn\/gSu3lp0WFtjYnAQ\nw5WV6FFQwG0iWCcnh0YNpUSZyEH0PeN5ijVm49z+z+cb8SLTGq06WmhYuRLtzs6YmJjAsIkJ\/WnR\n9NZbaA396IxsBEfPu0BcAcwPLOF5tgvqSMZYC\/ScOAGBo6OkL7cvWwaWsvJZ2Qn+Ro5m6gtbCMrK\n0JebixYvL9zR1EQ\/kwlSvuhSU0STlxNbdoKz9UsF57owdsQag3w+hoaGICgtRZuWFvjLl2My1BjP\njpiifeNK6Qveykna0m\/LZPMNNXDX1Ag9+nrgaWqAZ8RAv4UZeH5+uMNg4AJ5j2ICjxTHP\/5mD7TZ\nYjDBOlfqghznd5K57ua9dMd4tYPsa2ZgOMQG1cqKyCJiRYRSwnUy9l6kWuFhuBmEB82kX8Vthgap\nNQyt0X3d65cI2oyZQfSZFW6soBazd5lQSKr3Xz\/uxePdZBIv3id9wTqG7sctWhQOl21eImh53wy9\njhq4s1pNInaF9ODqwEBUe3vjSZgpZiJW4\/EH2kXS38lF+L9fo0xhqMAALVfUwS5Yvch0ggtaNiui\nmEza19LT0ZCYiFb\/d\/Eyzx2zWeaYPblHNlXcH6EzfstBDxXrDVBFqrSctLEKQ33cNNJGqSUTrKoq\ndHZ2ooyIctOiILQjLxSiPToT6yKbfUl3OsXmZpuQLqEjaXH3165FF1kY9HkzSdZiwOFwUBMSgouk\nQARNl\/Di6lHMZVC7piOsgFqKIf3PnKbQez1OEbMxm5b0Y5EDA9z4cNQVFqJIVRWlVlaYajmE0Y9W\n4ZcaykV8OpqNJhMXqQv2nFNBRTSF\/w4eSsRgFBYhK+nxtF0oVFFBPqnem\/ExmG\/3G31eelAiOBHO\nLHocpyf9SualUmhMkB99cM6T\/c+h8iUdhV4PNuxxQR69oi5Lx8NiOzzYrod7mZsnHiVu6x39ascV\nqcr15a314Hy7AnVfaqE2xh5lR+xRn3MI4\/xrGL37I0SdBehJ3om7KSHICbHHWIkRxmOdkR9mheov\n3VAevu3fnCTnfVITHPzOPpH3zSbcPe0DbrIL6o874OYxO1QceQclUTYojrBGfqglsoMtkBtiiaE0\nDfzccBCl5N7t2G1oS\/FBV4rXqPT2wxYW2T81XUB\/RSr6UlzBP7MbXUSWR2RbEpzQfMobjV+7gv2V\nI9oS38XT02rojCS\/f\/seetI8UR9uh4tbN89Jby8cGDj+cnoazwYGwNmyAe07zDF8LRH38z8FP8YN\nndGeuP99FAR5YRDkhqHHVwusLevAyTiFdhYLl318kK2tTc+Hy1+7XImJidlIfDxowemaGnDIqqVV\nXx9PhEKIh4fR4eEBFlkDdh89itH+fgj7+lDv5IQqsrvjks7yoKuLDIUjOE8qfL+fnz8JaUBQel1+\nK9XV1Q0namunacHhpCSJIJ9k5FfBJmNjiSA\/Ovp3gq2RkbhHJvBK8hwt6EpRB0lMG4I+Hft1CMoR\ndD6xsdnZXFJyrdHXd4oWvBcWtijYsGbN7wSb9+6VCNa4knF54wbKs7ImP6CoEyQWcaSYdMyF2K\/t\nUCXQ7crKT04u5Lvg4IyLOTmVd+LiHl1QURkuUFISlgcGihprakSN1dXC3NBQnru8fKbHsmWnjCjK\nf0HMaiHGKmnP2SsIqwnrCCYEM4LFgoDVwrXZwj36PxoLz\/yxjv8B\/wAPwwU82bQAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-10\/1287955344-6321.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by npc_spinning_wheel
	"id"				: "spin",
	"label"				: "spin",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Test your luck",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.owner == pc.tsid) return {state:'enabled'};
		else if (this.spun) return {state:null};
		else return {state:'disabled', reason: "This wheel isn't here for you."};
	},
};

;
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
	"n"	: "spin"
};
itemDef.keys_in_pack = {};

log.info("npc_spinning_wheel.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
