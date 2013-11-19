//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Deimaginator";
var version = "1344982233";
var name_single = "Deimaginator";
var name_plural = "Deimaginators";
var article = "a";
var description = "Enemies of imagination, these shadowy figures are locked in an eternal struggle to stop the trafficking of mysterious contraband. Beware of their grabby little hands!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_deimaginator", "npc"];
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

function appear(){ // defined by npc_deimaginator
	this.pc.sendActivity("There is a Deimaginator here, and it wants your contraband!");
	this.visible = true;
	this.setAndBroadcastState('appear');
	this.pc.announce_sound('SMUGGLING_NPC_ARRIVES');
}

function broadcastState(){ // defined by npc_deimaginator
	if(!this.apiGetLocatableContainerOrSelf()) {
		return;
	}

	if (this.pc){
			this.pc.apiSendMsg({
			type: 'item_state',
			itemstack_tsid: this.tsid,
			s: this.buildState(this.pc),
		});
	}
}

function buildState(pc){ // defined by npc_deimaginator
	if (pc == this.pc){
		if (this.dir){
			// Fucking backwards fucking assets fuck
			if ((this.dir == 'right' && this.state != 'walk') || (this.dir == 'left' && this.state == 'walk')){
				return '-' + this.state;
			}
		}
		return this.state;
	} else {
		return 'empty';
	}
}

function caughtPlayer(pc){ // defined by npc_deimaginator
	if(pc != this.pc || this.container != pc.location || !this.ready_to_catch) {
		return;
	}

	this.stopMoving();

	this.ready_to_catch = false;

	var stacks = pc.takeItemsFromBag('contraband', 1);

	if(!stacks || num_keys(stacks) == 0) {
		if (pc.buffs_has('dont_get_caught')) pc.buffs_remove('dont_get_caught');

		if (pc.getQuestStatus('smuggling_basic') == 'todo'){
			pc.familiar_send_alert({
				'callback'	 : 'quests_familiar_fail_and_remove',
				'class_tsid' : 'smuggling_basic',
				'txt'		 : "Oh no! You lost your package. Better luck next time..."
			});
		}

		this.apiCancelTimer('targetFollow');
		this.stopMoving();
		this.setAndBroadcastState('idle2');
		this.sendBubble("Huh. You don't have anything I want. Carry on.",5000,pc);
		this.apiSetTimer('goAway',2500);
		return false;
	}

	this.itemstack = stacks[0];

	apiLogAction('SMUGGLE_CAUGHT', 'pc='+pc.tsid,'loc='+this.container.tsid,'itemstack='+this.itemstack.tsid);

	this.pc.sendActivity("Oh no! The Deimaginator caught you.");
	this.pc.announce_sound('DEIMAGINATOR_TAKES_BOX');
	this.container.apiPutItemIntoPosition(this.itemstack, this.x, this.y);

	this.itemstack.apiSetTimer('onDropped',2000);
	this.apiSetTimer('finishCatch', 2000);

	this.setAndBroadcastState('talk');
	this.sendBubble("Well, well! What have we here?",5000,pc);
}

function finishCatch(){ // defined by npc_deimaginator
	var pc = this.pc;

	if (pc.buffs_has('dont_get_caught')) pc.buffs_remove('dont_get_caught');

	pc.apiSendMsg({type: 'clear_location_path'});

	if (pc.getQuestStatus('smuggling_basic') == 'todo'){
		pc.familiar_send_alert({
			'callback'	 : 'quests_familiar_fail_and_remove',
			'class_tsid' : 'smuggling_basic',
			'txt'		 : "Well gosh darn it! They did warn you to stay away from those deimaginators, didn't they, kid? Better luck next time..."
		});
	}


	this.setAndBroadcastState('idle1');
	this.apiSetTimer('goAway',2000);
}

function goAway(){ // defined by npc_deimaginator
	this.apiSetTimer('apiDelete', 1500);
	this.pc.announce_sound('SMUGGLING_NPC_LEAVES');
	this.setAndBroadcastState('disappear');
}

function onCreate(){ // defined by npc_deimaginator
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = true;
	this.npc_can_fall = true;
	this.npc_walk_speed = this.npc_climb_speed = 65;
	this.item_width = 55;
	this.item_height = 80;

	this.apiSetHitBox(25,25);

	this.setAndBroadcastState('empty');
}

function onPathing(args){ // defined by npc_deimaginator
	//log.info('DEIMAGINATOR: pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		this.apiStopMoving();

	}
	if (args.status == 1){
		// yes means no and no means yes. yes or no?
		if (args.dir == 'left'){
			this.dir = 'right';
		}
		if (args.dir == 'right'){
			this.dir = 'left';
		}
		this.setAndBroadcastState('walk');
	}
}

function onPlayerCollision(pc){ // defined by npc_deimaginator
	if(pc == this.pc) {
		if (pc.isMovingStreets()){
			this.stopMoving();
			this.goAway();
		} else {
			//
			// If the user is near a signpost it's possible they got screwed by lag
			// and their move_start hasn't triggered yet. If that's the case, pretend
			// we didn't get 'em this time, unless the signpost is incredibly near
			// where they started when we entered the room
			//

			if (Math.abs(pc.x - this.pc_started_x) > 200 ||
			    Math.abs(pc.y - this.pc_started_y) > 200) {
				var signposts = pc.location.geo_links_get_all_signposts();

				for (var i in signposts){
					if (Math.abs(signposts[i].signpost_x - pc.x) < 200 &&
					    Math.abs(signposts[i].signpost_y - pc.y) < 200) {
						this.stopMoving();
						this.goAway();
						return;
					}	
				}
			}

			this.caughtPlayer(pc);
		}
	}
}

function onPlayerExit(pc){ // defined by npc_deimaginator
	if (pc == this.pc){
		this.stopMoving();
		this.goAway();
	}
}

function setTarget(pc){ // defined by npc_deimaginator
	this.pc = pc;

	this.pc_started_x = pc.x;
	this.pc_started_y = pc.y;

	var target_has_package = pc.findFirst('contraband');

	// Ulp! they've got the buff/quest but no contraband? Let's clean that up
	if (!target_has_package){
		if (pc.buffs_has('dont_get_caught')) pc.buffs_remove('dont_get_caught');

		if (pc.getQuestStatus('smuggling_basic') == 'todo'){
			pc.familiar_send_alert({
				'callback'	 : 'quests_familiar_fail_and_remove',
				'class_tsid' : 'smuggling_basic',
				'txt'		 : "Oh no! You lost your package. Better luck next time..."
			});
		}
		this.apiDelete();
	}

	this.only_visible_to = pc.tsid;

	if(this.pc.x > this.x) {
		this.dir = 'right';
	} else {
		this.dir = 'left';
	}

	if(this.container) {
		this.apiSetTimer('appear',1000);
	}

	this.apiSetTimer('targetFollow', 3000);
}

function stopMoving(){ // defined by npc_deimaginator
	this.apiStopMoving();
	this.setAndBroadcastState('idle1');
	this.apiCancelTimer('targetFollow');
}

function targetFollow(){ // defined by npc_deimaginator
	this.followingPlayer = true;
	this.ready_to_catch = true;

	if (this.pc.isMovingStreets()){
		this.stopMoving();
		this.apiSetTimer('goAway',500);
	} else {
		var delta = this.pc.x - this.x;

		if (delta > 1500 || delta < -1500){
			this.stopMoving();
			if (is_chance(0.9)){
				this.targetJump();
			} else {
				this.apiSetTimer('goAway',500);
			}
		} else {
			this.apiFindPath(this.pc.x, this.pc.y, 0, 'onPathing');
		}

		this.apiSetTimer('targetFollow', 1000);
	}
}

function targetJump(){ // defined by npc_deimaginator
	this.setAndBroadcastState('disappear');
	this.pc.announce_sound('SMUGGLING_NPC_LEAVES');
	this.apiSetTimer('targetJumpComplete',1000);
}

function targetJumpComplete(){ // defined by npc_deimaginator
	var min_dist = 500;
	var max_dist = 1250;

	if(is_chance(0.5)) {
		var offset = randInt(min_dist, max_dist);
			
		if(this.pc.x + offset > this.pc.location.geo.r) {
			offset = 0 - randInt(min_dist, max_dist);
		}
	} else {
		var offset = 0 - randInt(min_dist, max_dist);

		if(this.pc.x + offset < this.pc.location.geo.l) {
			offset = randInt(min_dist, max_dist);
		}
	}

	var point = this.pc.location.apiGetPointOnTheClosestPlatformLineBelow(this.pc.x + offset, this.pc.y - 75);
	if (!point){
		point = this.pc.location.apiGetPointOnTheClosestPlatformLineAbove(this.pc.x + offset, this.pc.y);
	}
	if(!point) {
		// Nowhere to go!
		this.pc.announce_sound('SMUGGLING_NPC_LEAVES');
		this.goAway();
		return;
	}

	this.x = point.x;
	this.y = point.y;

	this.setAndBroadcastState('appear');
	this.pc.announce_sound('SMUGGLING_NPC_ARRIVES');
	this.targetFollow();
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

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

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
	out.push([2, "Deimaginators can be evaded by acrobatic manuevers."]);
	return out;
}

var tags = [
	"deimaginator",
	"smuggling",
	"npc",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-149,"w":275,"h":159},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJEUlEQVR42s2YWUxb6RXHeWk1GTJh\nSwhkwYBtljgJMSQBwmIwXjC28b4v18bGmM0mDuBAAoZkCJlkgCydNGmzVI3UTtVK9GFGqtqqvLTq\nolap+tCqaiWkSq0qVZVf+v7v+T4CnUz60FR22isdXWRs3d931v+5BQX\/xeUaSjVZwpOKQf9I0uCO\nZnTO0Kba7NvqUBk3Cv4XV\/jiomAfSmTMgdHNQU9sW2cPQj3ohlJvR7fWjE6VEW09Opzr0pCpFW8d\n0DsyA70j\/IrprEGojC70GRx71qkexNlOzfZbhUvffNLkiV16DZBD2nY8uevFVkU\/ejVGXFAoN98a\n4NwHjwXHUIKDDNhD0Jr93PqtAdj9Mdh9EXiEGLzCMAwWFzp6d0L9VuBi6ZtFS6t3t5dv3kNmZQ0f\n3HmIW3cfYXl1A8nZJW6xyTQGrAI6NTb0Dth5Xrb3DkDeqWnKO+DwxeWkfywNZ3Rqz6zCBHSOIfTo\nPWjvs+5Zh9rKAVkuMsjz3f1CXuESabEpPj2xFZycfwXQHk5AafTB6DFi\/mYrHn58HtfvnYc31gOF\nzr5XMO3KgfzmYTRRnR1Lj8Ibn+Fe09rCsAZUiM+0c7D7z89g4+lpPPimHLcencS1O42w+s\/AEeqD\n0aWjMKvQ0qIqyhvg0loj5lc7EJ\/WIpKQY2zmJC5l6vHoW834yreb8fzT81h9IMPNL8v4PTFfA\/dQ\nJWavSXHxqhRDk2IYHdX56YnrT05tXLnZiNRiPdYfn8LMcj2W1xvBPvv4+20UVjn34I2PTmB6SYzh\nRC2ur7QiEK5CakFCB5EiMSeFQzictXqLRTmF+\/DxaSF9vYHD7drU1TrySh3S1yV48I1mrHxJhodf\n7cb9DTN+9bM0sn9ew19+l0ZsTAx\/7ChGp8UYmhAhMHIMtkD5s5zBvf9ho2hp7QTmVhqw+tFJfl+8\n3UjeqCNIKTf28NBYFRJTjfjtT8bx1z8scrgnD\/rgI7jxGQniqVpEJkUQ4se5F3OYdycyDGZ5XYZ7\nX5fj+t2TFLI6CrEEU1ekHJR5hj2Yeco1VAGztxwmTzmcoQoE48fgFCpes5wBjqbE2fnVBkr0BviH\nqxAer+YJn1rYgZtIS+GhQmAPZZAMdniqBvFLtfz\/n7XIZDWE0SoKcQ4BhbiIkr4e0UQNNMaDsHgq\neDhZyJh5I0e4sTAn56W4vCKl79diPF2N5BURHaCKKv4IefMwjM5ybgbHoa3cNec56Qt2+thULffg\nrtcYJPPW2IyYwi2m9lOLVKaaPHx0L4wW77+gds3kqYI9pMsqrd7cVTLl2gar2M+GK32tnlqMGAu3\nKeQL1RTSakST9PBgBUzu16GcggL+eIjyM0Yiw4UenTW3Qnb9qURx62H99vv3pGA2e72Kh5CBDU9R\nkYwdy1p9hzHo2oEyU5E4hHq4Qt04194FtVYPrc5I4RVoqoTRq7dlO\/oGcz+brd5KkSNQofi8JRbX\nMu6IAu5wBWLTAYzPL2BoagFdSh3kLedxvq0DjbLTUBudsPiGMegeovnsxNkulSnvCiexuG5KzS7A\nLoxjZDZDcKsEuUxzOAb52TZIG05B1tRCQHYIk3OwBUdh9sVI6djQ0qER8g44M7esePzkOaLj0yRa\n\/QglrhDsGLp61Dh3oRtqk4eHddBDQnZ4Co7wJKlvgStu+QWlKK9wBpe\/SW1yb31n81N895MfwBlJ\nEkQKlkAcTfKz8I5Mw0oeG7AF4Iml4I4mYfGPkBIPkj7UvsgrnN4WFKgiszqbH0urd\/C3v\/8Daw++\nBh\/JMaPNh\/YuJcHEqHKjMHmHybPzHNAemoDeGeJrQF7kl8MRK9Lbg1kVJbyi3wJXZIpyahiffG8L\nv\/\/jn6hhr0Crt6BbNUBTIw53JMHzzkY5yuDM5EGmsPlS1a1N5n5putGumJw7QxNCRGBeBMYuUxjj\n1Frs+Okvfo2f\/\/I3MFld1Kij5M1p+EdnKOwX9wDZ5ndBqd9dS3Mb5nvPZU1MejE9OHm5gTwT5Xlm\n8UdonMkRHk3hhz\/6MS1OM9Sw7XSAIIdiITa6I+i3+Dkc8yADVOi02ZwCkrp5NktThCmZYFxB\/SwC\nNyW\/3n4GgTgJUlpHg\/ExzGb6SKTWkVePUkE4ec\/TUDVrXlY0s7aeflr2L2D9qTx3KpvEgmJsRkLz\nWQJPpBkGSnYnQWmtJSRGKyncEyQYurlunLoqJiFxHBqDGTZPmDdoo1Pgv2GLfVOrgkZeC5bWT2Zj\n6drcFYtyoFikMRQ36R22ZwMOP4UvilblAarWQyRQm7n6SS3WYXxWArNbhPBQDP5gBAazA9pBB69q\n1mY6+gzoN5+mAzVgaU22fe2eLLd7s8UzrDD7RijpBQpVgPc6vd1OuXiWyy8G2KlsQWtHD\/r0Vj7e\nWDUzT7KG3t6rp7\/P0IHY6tCA+RuNNOMbMjn1pskT2za4KPmtQWgtAWjMPv5KRGVUU76pKffMUFIx\nmD1RgolRS0pSmEP8O\/L2XvpcxteG6SUpF8WLt2V0b8yu3D+1OTknUUyk65qm5us2KSLZiVnJm+\/V\ng56YwF4aMbgdSD+H3H3LxXLN8LIo7KFxms8jVMk+dGvMVCTNGE7W8F1l8jKDlIAVIFspGGhqoZ5D\nM7t2R0bfrX5zJd7apTV1qgbRR0Bs5jKwXWOA57o13GtsvDkIkOWf1uxFl0YPlaEcVl8lCeHjJIhr\nSAjXvlxP6zgoy+W5G\/V8vZhIS0ggV2XeCK6koKDo2LEjGVnTWdQ1nkQDyalTza00Y9Uv2vv0W229\nuq0z7T2beqewzfKOGQNU6h2Qt3WiS1W9oTaWPTPYD2\/Z\/ZVbLqFia2iiejtKXh2dJhGcYiK4hky0\nPXKp9s0mjriqTDhaXozKgwdQQcbuB4sLUbR\/H8uTV5KclM0Ls3dHAzLB2q02olbagPLy8vy97ao+\nWpoVVZbiyKEiHC59D6VFhdnid7\/4mvgsKSkoOn6kfFMirkWdVMyNHaR4\/z4UFn4hf4ClBwqTpQfe\nzezYvmTJ57zGvXy8zHT8cEmWHaKi7AA\/zKGS\/Sh+b99m8Tvv5FcH\/idXnah8e9fLLAUYXFlR4VbB\n\/8tVVlyYJSAeUrpnmbf\/naff9PonUxJ5lpRIXY4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_deimaginator-1342641346.swf",
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
	"deimaginator",
	"smuggling",
	"npc",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_deimaginator.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
