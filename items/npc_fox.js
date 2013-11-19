//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Fox";
var version = "1354517880";
var name_single = "Fox";
var name_plural = "Foxes";
var article = "a";
var description = "The sly, cunning, quick brown fox has a tail full of fibers perfect for spinning. Shifting position quickly, you can rely on a fox to be fast-paced, slippery and hard to pin down, they care deeply about some things (getting as much bait as they can, giving up as few tail hairs as possible to society) but interact very little with the real world.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_fox", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "edge_to_edge"	// defined by npc_walkable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.is_tester = "0";	// defined by npc_fox
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	is_tester : ["Tester fox"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	is_tester : [""],
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

verbs.brush = { // defined by npc_fox
	"name"				: "brush",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Brush the Fox with a Brush",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'fox_brush' && stack.isWorking() && this.can_be_brushed && !stack.is_disabled;
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (!pc.achievements_has('fox_brushing_license')){
			failed = 1;
			pc.apiSendMsg({type: 'overlay_cancel', uid: 'fox_brushing'});	
			pc.sendActivity("Uh-oh, brushing without a license? The ranger would like a word with you.");
		}
		else if (pc['!last_fox_brush'] && time()-pc['!last_fox_brush'] < 2){
			failed = 1;
			pc.apiSendMsg({type: 'overlay_cancel', uid: 'fox_brushing'});	
			pc.sendActivity("You're brushing too fast! Slow it down.");
			pc.announce_sound('FOX_BRUSH_MISS');
			//log.info('=--=-=-=-=-=-=-=-=-=- '+time()+' ---- '+pc['!last_fox_brush']);
		}
		else if (this.can_be_brushed || this.getInstanceProp('is_tester') == 1){
			var brush = pc.removeItemStackTsid(msg.target_itemstack_tsid);
			var tool_wear_multiplier = 1;
			if (pc.imagination_has_upgrade('fox_brushing_bonus')) tool_wear_multiplier = 1.5;
			var ret = pc.runSkillPackage('fox_brushing', this, {tool_item: brush, tool_wear_multiplier: tool_wear_multiplier, force_fail: !brush, callback: 'endBrushing', msg: msg});
			if (!ret.ok){
				failed = 1;
				if (brush) pc.apiSendMsg({type: 'overlay_cancel', uid: 'fox_brushing'});	
				if (ret.error_tool_broken) pc.sendActivity("This Fox Brush doesn't have enough uses left. You'll have to repair it or use a different brush.");
				pc.announce_sound('FOX_BRUSH_MISS');
			}
			else{
				pc['!last_fox_brush'] = time();
				pc.announce_sound('FOX_BRUSH_HIT');
			}
		}
		else{
			failed = 1;
			pc.apiSendMsg({type: 'overlay_cancel', uid: 'fox_brushing'});	
			pc.sendActivity("Whoops! You can't reach the fox when it's down there!");
		}

		return failed ? false : true;
	}
};

function doJump(args){ // defined by npc_fox
	log.info(this+' doJump: '+args);
	if (args.status == 3 || args.status == 4){
		this.fullStop();

		var marker = this.findCloseItem('fox_stop_marker');
		if (marker){
			log.info(this+' '+this.x+': jumping at marker: '+marker+' '+marker.x);
			this.apiMoveToXY(marker.x, marker.y, 2000, 'onJumpComplete');
			this.setAndBroadcastState('jump');
		}
		else{
			this.apiSetTimer('doTaunt', 2000+randInt(1, 4)*1000);
			this.apiSetTimer('startMoving', 2000);
		}
	}
	else if (args.status == 1){
		var state = 'walk';
		if (this.can_be_brushed) state = 'run';
		
		if (args.dir == 'left'){
			this.state = state;
			this.dir = 'right';
		}
		else if (args.dir == 'right'){
			this.state = state;
			this.dir = 'left';
		}
		else if (args.dir == 'climb'){
			this.state = 'climb';
		}

		this.broadcastState();
	}
}

function doLeave(reason){ // defined by npc_fox
	if (!reason) reason = 'No more bait remains, so the Fox leaves...';
	this.container.sendActivity(reason);
	this.is_leaving = true;
	//this.apiSetTimer('apiDelete', 4*1000);
	this.startMoving();
}

function doTaunt(){ // defined by npc_fox
	if (this.getInstanceProp('is_tester') == 1) return;

	this.fullStop();
	if (is_chance(0.5)) this.turnAround();
	this.setAndBroadcastState('taunt');

	this['!taunt_count']++;
	if (this['!taunt_count'] < 3){
		this.apiSetTimer('doTaunt', 2000+randInt(1, 4)*1000);
		this.apiSetTimer('startMoving', 2000);
	}
	else{
		var marker = this.findCloseItem('fox_stop_marker');
		if (marker){
			log.info(this+' '+this.x+': jump targeting marker: '+marker+' '+marker.x);
			if (this.apiFindPath(marker.x, this.y, 0, 'doJump')){
				return;
			}
		}

		this.apiSetTimer('doTaunt', 2000+randInt(1, 4)*1000);
		this.apiSetTimer('startMoving', 2000);
	}
}

function endBrushing(pc, ret){ // defined by npc_fox
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var slugs = ret.slugs;
	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
	});

	self_effects.push({
		"type"	: "metabolic_inc",
		"which"	: "imagination",
		"value"	: ret.values['xp_bonus'] ? ret.values['xp_bonus'] : 0
	});

	if (!ret.ok){
		failed = 1;
		if (ret.error_tool_broken) pc.sendActivity("This Fox Brush doesn't have enough uses left. You'll have to repair it or use a different brush.");
		pc.announce_sound('FOX_BRUSH_MISS');
	}
	else{
		// Get the fiber range based on skill and img
		var range = [16, 24];
		if (pc.skills_has('foxbrushing_1')) range = [range[0]+10, range[1]+12];
		if (pc.imagination_has_upgrade('fox_brushing_bonus')) range = [range[0]+8, range[1]+12];

		var to_get = randInt(range[0], range[1]);

		var remaining;
		if (ret.args.msg.drop_x && ret.args.msg.drop_y){
			remaining = pc.createItemFromXY('fiber', to_get, intval(ret.args.msg.drop_x), intval(ret.args.msg.drop_y));
		}
		else{	
			remaining = pc.createItemFromSource('fiber', to_get, this);
		}
		if (remaining != to_get){
			
			var proto = apiFindItemPrototype('fiber');
			var got = to_get - remaining;

			pc.achievements_increment("fox", "fibers_brushed", got);
			pc.achievements_increment("fox_hubs", "brushed_in_"+pc.location.hubid, 1);

			if (this.state === "walk" || this.state === "run") { 
				pc.achievements_increment("fox", "brushed_while_moving", 1);
			}


			self_effects.push({
				"type"	: "item_give",
				"which"	: proto.name_plural,
				"value"	: got
			});
			
			if (!slugs.items) slugs.items = [];
			slugs.items.push({
				class_tsid	: 'fiber',
				label		: proto.label,
				count		: got
			});
		}

		if (ret.args.tool_item){
			ret.args.tool_item.disable();
		}
	}

	var pre_msg = this.buildVerbMessage(this.count, 'brush', 'brushed', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	if (!failed){
		this.brush_count++;
		if (!this.brushers[pc.tsid]) this.brushers[pc.tsid] = [];
		this.brushers[pc.tsid].push(time());

		log.info("FOX: brushers is "+this.brushers);

		// Check for triple brushing the same fox in 10 seconds achievement
		var list = this.brushers[pc.tsid];
		if (list.length >= 3) { 
			log.info("FOX: list is "+list);
			var last = list[list.length-1];
			var idx = list.length - 2;
			while ((last - list[idx]) <= 10) {
				log.info("FOX: times are "+last+" "+list[idx]); 
				if  (list.length - idx >= 3) { 
					log.info("FOX: idx is "+idx);
					pc.achievements_grant("fleet_foxer");
					this.brushers[pc.tsid] = [];
					break;
				}
				idx --;
			}		
		}
		pc.feats_increment('animal_love', 1);
	}

	if (this.getInstanceProp('is_tester') == 1){
		return;
	}

	// If we're leaving, just keep going
	if (this.is_leaving && !failed) return this.sendResponse('brushed', pc, slugs);

	var is_bait = function(it, args){ return it.class_tsid == 'fox_bait' && it.is_placed};
	var bait = this.findCloseItem(is_bait);
	if (num_keys(this.brushers) >= 3 || this.brush_count >= 21 || !bait){

		// TODO: Different response type when we leave
		if (!failed) this.sendResponse('brushed', pc, slugs);

		this.doLeave('The fox leaves...');

		if (bait){
			this.container.apiSetTimer('spawn_fox', 10000);
		}
	}
	else{
		if (!failed){
			this.sendResponse('brushed', pc, slugs);
			this.startMoving();
		}
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_fox
	if (!oldContainer){
		this.fullStop();

		var ranger = newContainer.find_items('npc_fox_ranger');
		if (!ranger.length) this.setInstanceProp('is_tester', 1);
		this.apiSetTimer('startMoving', 1000);
	}
}

function onCreate(){ // defined by npc_fox
	this.initInstanceProps();
	this.idle_state = 'eat';
	this.parent_onCreate();
	this.npc_walk_speed = 225;
	this.npc_can_climb = false;

	this.brush_count = 0;
	this.brushers = {};

	this.can_be_brushed = true;

	if (this.getInstanceProp('is_tester') == 1 || 1){
		this.npc_walk_speed = 500;
		this.startMoving();
	}
	else{
		this['!taunt_count'] = 0;
		this.apiSetTimer('doTaunt', randInt(1, 4)*1000);
	}
}

function onEat(){ // defined by npc_fox
	this.setAndBroadcastState('eatStart');
	this.fullStop();
	this.apiSetTimerX('setAndBroadcastState', 500, 'eat');
	this.apiSetTimerX('setAndBroadcastState', 1000, 'eatEnd');
	this.apiSetTimer('startMoving', 2500);
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc_fox
	// Ignore this and do nothing! The fox must keep mooooving!
}

function onJumpComplete(){ // defined by npc_fox
	this.npc_walk_speed = 500;
	this.setAndBroadcastState('jump');
	this.can_be_brushed = true;

	this.apiSetTimer('startMoving', 1000);
}

function onPathing(args){ // defined by npc_fox
	if (args.status == 3 || args.status == 4){
		if (this.is_leaving) return this.apiSetTimer('apiDelete', 500);

		if (this.can_be_brushed){
			// Bait here?
			var bait = this.findCloseItem('fox_bait');
			if (bait && Math.abs(this.x - bait.x) <= 100 && bait.is_placed){
				//log.info(this+' found bait: '+bait);
				bait.apiDelete();
				this.setAndBroadcastState('eat');
				this.container.announce_sound_to_all('FOX_EAT');

				var is_bait = function(it, args){ return it.class_tsid == 'fox_bait' && it.is_placed};
				if (this.findCloseItem(is_bait)){
					this.setAndBroadcastState('eatStart');
					if (is_chance(0.50)) this.turnAround();
					this.apiSetTimerX('setAndBroadcastState', 500, 'eat');
					this.apiSetTimerX('setAndBroadcastState', 1000, 'eatEnd');
					this.apiSetTimer('startMoving', 2500);
				}
				else{
					this.doLeave('No more bait remains, so the Fox leaves...');
				}
				return;
			}

			// Marker here?
			var marker = this.findCloseItem('fox_stop_marker');
			if (marker && Math.abs(this.x - marker.x) <= 100){
				//log.info(this+' found marker: '+marker);
				if (is_chance(0.50)) this.turnAround();
				this.setAndBroadcastState('pause');
				this.apiSetTimer('startMoving', 1000);
				return;
			}
		}

		// Must be the edge! Quick, turn around!
		this.turnAround();
		if (this.container.getNumActivePlayers()){
			this.startMoving();
		}
		else{
			this.pathfinding_paused = true;
			this.apiSetTimer('startMoving', 20*1000);
		}
	}
	else if (args.status == 1){
		var state = 'walk';
		if (this.can_be_brushed || this.getInstanceProp('is_tester') == 1) state = 'run';
		
		if (args.dir == 'left'){
			this.state = state;
			this.dir = 'right';
		}
		else if (args.dir == 'right'){
			this.state = state;
			this.dir = 'left';
		}
		else if (args.dir == 'climb'){
			this.state = 'climb';
		}

		//this.broadcastState();
	}
}

function startMoving(){ // defined by npc_fox
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.pathfinding_paused) delete this.pathfinding_paused;

	// Are we leaving?
	if (this.is_leaving){
		var spawner = this.findCloseItem('spawner');
		if (spawner){
			var dest_x;
			if (spawner.x < this.x) dest_x = spawner.x - 500;
			if (spawner.x >= this.x) dest_x = spawner.x + 500;
			if (this.apiFindPath(dest_x, this.y, 0, 'onPathing')) return;
		}
	}

	// First, figure out where we're going based on the direction we're facing and the dimensions of the location
	var dest_x = 0;
	if (this.go_dir == 'left' && this.container.geo.l+100 != this.x){
		dest_x = this.container.geo.l+100;
	}else if (this.container.geo.r-100 != this.x){
		dest_x = this.container.geo.r-100;
	}

	if (this.getInstanceProp('is_tester') == 1){
		this.npc_walk_speed = 500;
		this.apiSetTimer('onEat', 2000);
	}

	if (this.can_be_brushed){
		// Now find bait between here and there
		//log.info(this+' looking for bait between: '+this.x+', '+dest_x+', '+this.go_dir);
		var is_bait = function(it, args){ return it.class_tsid == 'fox_bait' && it.is_placed && ((args.dir == 'left' && it.x >= args.dest_x && it.x <= args.our_x-100) || (args.dir == 'right' && it.x <= args.dest_x && it.x >= args.our_x+100)); };
		var bait = this.findCloseItem(is_bait, {dest_x: dest_x, our_x: this.x, dir: this.go_dir});
		if (bait){
			log.info(this+' targeting bait: '+bait+' '+bait.x);
			dest_x = bait.x;
		}
		else{
			var is_any_bait = function(it, args){ return it.class_tsid == 'fox_bait' && it.is_placed; };
			bait = this.findCloseItem(is_any_bait);
			
			if (!bait){
				return this.doLeave('No more bait remains, so the fox leaves...');
			}
		}
			

		// Now find stop markers between here and there
		//log.info(this+' looking for markers between: '+this.x+', '+dest_x+', '+this.go_dir);
		var is_marker = function(it, args){ return it.class_tsid == 'fox_stop_marker' && ((args.dir == 'left' && it.x >= args.dest_x && it.x <= args.our_x-100) || (args.dir == 'right' && it.x <= args.dest_x && it.x >= args.our_x+100)); };
		var marker = this.findCloseItem(is_marker, {dest_x: dest_x, our_x: this.x, dir: this.go_dir});
		if (marker){
			log.info(this+' targeting marker: '+marker+' '+marker.x);
			dest_x = marker.x;
		}

		// Now find rangers, so we don't go past them
		//log.info(this+' looking for rangers between: '+this.x+', '+dest_x+', '+this.go_dir);
		var is_ranger = function(it, args){ return it.class_tsid == 'npc_fox_ranger' && ((args.dir == 'left' && it.x >= args.dest_x && it.x <= args.our_x-20) || (args.dir == 'right' && it.x <= args.dest_x && it.x >= args.our_x+20)); };
		var ranger = this.findCloseItem(is_ranger, {dest_x: dest_x, our_x: this.x, dir: this.go_dir});
		if (ranger){
			log.info(this+' targeting ranger: '+ranger+' '+ranger.x);
			dest_x = ranger.x;
		}
	}

	if (!this.apiFindPath(dest_x, this.y, 0, 'onPathing')){
		this.onStuck();
	}
}

function onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
}

function stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function turnAround(){ // defined by npc_walkable
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
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

function npc_onPathing(args){ // defined by npc
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

function npc_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function npc_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_onCreate(){ // defined by npc_walkable
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'left';
	this.startMoving();
}

function parent_onPathing(args){ // defined by npc_walkable
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		if (this.classProps.walk_type == 'roam' || this.classProps.walk_type == 'pace'){
			this.stopMoving();
			this.turnAround();
			this.apiSetTimer('startMoving', 10000);
		}
		else{
			//log.info('reached destination!');
			//log.info('turning around...');
			this.turnAround();
			if (this.container.getNumActivePlayers()){
				this.startMoving();
			}
			else{
				this.pathfinding_paused = true;
				this.apiSetTimer('startMoving', 20*1000);
			}
		}

		if (this.onDonePathing) { 
			this.onDonePathing();
		}
	}
	if (args.status == 1){

		var walk_left_state = 'walk';
		if (this.walk_left_state) walk_left_state = this.walk_left_state;
		var walk_right_state = 'walk';
		if (this.walk_right_state) walk_right_state = this.walk_right_state;

		if (args.dir == 'left'){
			this.state = walk_left_state;
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.state = walk_right_state;
			this.dir = 'right';
		}
		if (args.dir == 'climb'){
			this.state = 'climb';
		}

		this.broadcastState();
	}
}

function parent_startMoving(){ // defined by npc_walkable
	if (this.isRookable() && this.isRooked()) return;
	if (this.isSad && this.isSad()) return;
	if (this.isWaiting) {
		return;
	}
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.pathfinding_paused) delete this.pathfinding_paused;

	if (!this.classProps || !this.classProps.walk_type || this.classProps.walk_type == 'edge_to_edge'){
		if (this.go_dir == 'left' && this.container.geo.l+100 != this.x){
			if (!this.apiFindPath(this.container.geo.l+100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}else if (this.container.geo.r-100 != this.x){
			if (!this.apiFindPath(this.container.geo.r-100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}
		else{
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'roam'){
		if (this.go_dir == 'left'){
			var distance = choose_one([-400, -250]);
		}
		else{
			var distance = choose_one([250, 400]);
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'pace'){
		var distance = intval(this.getInstanceProp('pace_distance'));
		if (this.go_dir == 'left'){
			if (distance){ distance = distance * -1; }
			else{ distance = -200; }
		}
		else{
			if (!distance) distance = 200;
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else{
		log.error('Unknown walk type: '+this.classProps.walk_type);
	}
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Foxes can be found in Fox Preserves, located in <a href=\"\/locations\/hub-120\/\" glitch=\"location|120\">Cauda<\/a>, <a href=\"\/locations\/hub-123\/\" glitch=\"location|123\">Fenneq<\/a>, <a href=\"\/locations\/hub-121\/\" glitch=\"location|121\">Sura<\/a> and other regions."]);
	out.push([2, "Foxes can be brushed for <a href=\"\/items\/1150\/\" glitch=\"item|fiber\">Fiber<\/a> using a <a href=\"\/items\/1156\/\" glitch=\"item|fox_brush\">Fox Brush<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"npc-animal"
];

var responses = {
	"brushed": [
		"Oof! You got me!",
		"I was quick, you were quicker!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-68,"y":-41,"w":148,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJo0lEQVR42u2YCVDTVx7H\/16dCuQO\nBEgCCQkBAiQCAkIFtSrW8UbwwnIJQS655D7+gqCAcqkcEQiiCJqickQuCTdeaJGCKNSj61Hrbru6\nXbf1\/u0LODvj7s5UtIM7s30zbzL5v+Tl876\/7\/v93guG\/dH+aP9nbWhIrnHpUp0aAEz5nwK73d9O\nvjXaZjt0ufaL8+0Vc5oVJWZyefZMuRz\/BA1\/PNj79+vU7l7vEt253pF4+6qy5erF+u6L7ccau5rL\nFYqvCqTy8r0uJSU49aNAPvi2S\/P+SGfQvZHO03dHOr6\/MdDy8mqfAq6cPQXn26qgta4EThzN6y\/J\nT9meFR\/OxjFs6qTB3R1RMu+OdOJ3Rjpv3xvtfHlzUAnDlxpg8EIdDJyrgQvtx6C7+TAoqgsgPyvh\nu9TE4BwcDyZOChxA+\/Q\/jbR7IOWu3xvtgltDSrjadxq+7jkJFzuOw\/n2KuhuOQI9Z44gwPxfcjOi\nRpMTAmR4pKf2JAHiU+9e70xHCj69fbUNrl1uhP7ek3BOWQlNp6RQd\/zAWD9VlQdHSzOf52VGj6Yk\nBm\/Dg92Ikxbi0W9aokb7m368dnk8rCrl2hvKoLoiRxVS2LcnFrJ3R97LSY\/q3IUH38HjAx1dXV2n\nTV6+62tIG+o7\/esg8lt\/z4nxTVFTAOXSVMhICe9LSwr23xkT4JQU4++Kx\/kPJ2zzNJzUHTx4QRHf\n3yp7fL4yFi4q8qBDvgvkaS5wIG4dpMb6XEyO9l2KSyRqKTH+Vjtit+6JjQ3WnDQ4kFrNGKyO3dKV\nu\/Lb5ngxKLNWQkuhBMpDLWFPwDxI3r5ZmRjuLValFTxaohcfHsCe1PACSroDBQ5ru5NNB5oj9aEx\n0gAad38BleGzIH2DHkQ58\/HANcY01WdxfP70j1JBBqVWvIF9s4vO7zJ7pIwxgIbtPKjcyoYidwYk\nLKMUbbWbyfyotRfk2LRh6Ryf\/mzLGz3JJqCCrAlmQvkWBqQ5Ux+HLCQGuNlixI8KOVIoZg4X2m64\nkje79txO4eMzUQZQKdGFvI2aEOlE3Olug9F+tx+Tu2LTZF4z2Ye8tZzK3Smid\/XiEC785LtiG+43\neVb7unGjH0+H6UGlnw4kLKf87OegUehprf5h1UNiZTVDssrc3GuxQfLWz2nX0pxp54IWEZdMZI5r\nB2wEg7ni9a3R3P6GMBYoQplwwE0TQheRc7wsNN4\/vXAw7FMhm7DKike5YSugP3UwpT9zFFKV2rQZ\n1qrxZeYkirOFjv5yMY0Zt4ZtJlnM2rbKTsfvMyOM8O9KjhTMXtoSbzhQFzoOeNRPGyKcSErPOZ9y\nJl4FUFiGZbaGEct16Jvmau0Rc0ivLblEWCAkv15mQXnoaEIuzvXUi2nDjbrkobxHxb7cp7Ig02f7\nJSZn8dVaTm\/NlS2k3pdaqd0qsddviDWUyQOZf6sO0AWZNwPCFpM7JgwolWBqx\/11t7fECaA7xQRa\n4wzhRLAeNEWw4TRa+ckgXTjiqwOlPmw4GGIDpWmeUH80A5pKI374KsY+4K16LJ1jO1xkd+LiHvHD\nM3G8EXmAbvMhb8aDCvT9TFc6BCwgTRxQ5bm4zTbLkt3MoNiDAXXbdKEehaUjSQAX0kXQlihA+YwJ\nWZv1QRqzDOpLol7X57r\/Uh9nVj+QJVo4nCcyuy61Tbwmta\/pz7a41bPDGM5EcqARee8UWtyxrbpQ\n6sWAkEWkF5726uHvlGpwHJsKb\/olKa7WUJXjX5GfABluXDgq0YEqBFQZxIF8D2RuDxZkb0S5bA0N\n9q6nI7NrPa0J07vcs9OkqTdV+KB3pxDOot67wwS60GKU0VxoeANXhXZvBZpPBZi6hhITOh8j\/zYc\nqoc1KZYODUmiFVeyrVf058517S0LONqQ7wsyfz7kbtCEAh8BFO3wgKKMUDhelAipgV8AvpoB+e4s\n2O2iCVJ3LahFSqu6IkQXGsPZ0IJK3JkozhjcVwE6UIY8V\/AlYywH7llHh6z19PB0VwrpNwGtdAj0\ntQ68mxvm8181pX0OimhjqA3hwKkQfZAHc+CQhPP6gBfnVbrvHDhWmAi5OySw3X0BFO\/eCifyw2Gv\n\/2eQ4syAgx5acHiLNlQjmDFbhKhgmWPvVYrtd9OCE9v0QRHBhZowDtSFsM7VBmtavMs9ZEprbblI\nfjh76GzrkUdnZBH\/kCcsenIkdsGjk9leP9VIIx+01xU9aqsrfp6XLPkpO9H7z\/tTA38+Vrr7RU9j\nGSgOJUN+iCNkuNAhF6lT4smACh\/t8XD6ao8pluZMh5No0b1JfOiK50LzdjY0R7CgJlC3Tu7D4L7T\n5sDDwqgl+QkhbZU78s\/VZOWgS03QkeJdXseKklb1tla2Vckyu0sLcElxXtKq0tyYvadkKbcUh1Ph\nUIY\/7PSyBnwVFaRoU6nSR+GXWkhRBuxdpwnBC0mwCwGq6nBTOMqBISyQ+6t8Pe7HYg9aoJf1TLaQ\nRVRdPWdMOCdKpZIZxftwVkLUFpOESD\/VqXeKrwN1SdAS5s2sbUtenjwY\/2R\/rOvjtE28J7UR\/Odt\n0fpIPW3I3MCEmLV8CF\/NhxxPARz204ND3trIh1pQhLqqkqS70CBpBfmhizWh2sqAVCDkElbqIMt9\nUOnbNJdE8ZlHivN1JMKW+fQ7+6NdZMN9ioxvTmeW9abbfd0WrfeiHnnveNy8Z42Hk28oq\/ddapAl\nDBwMtPw+w4X2PGopFalKAf8FZHC3J\/3q60D6eZMt8ZmdMfW12IAC5nrEJCGGffJecHwqRpwnpLou\nt6T1uVqTH62cRch0FY5PJrXCZtQF6WyqCdIdrvTTfpW9XvNhpBPZWxU2ex6m5eOoIdlsR+hcaEZ9\nMk9Ig\/mm1BdzTajNG2w0Cp3MyZ02AsqtWQaUOwiwgsXCZk4ITMTA1MVcoo0tnxpqY0gbmW1IvSnm\nkvOEehqmb9kBQaau1YxPWE7\/u7cj+eVSMSGdr\/2vw8AUaz7Fzc6Y\/q2tgAbWfOqQ2IAwFz2fLtRV\nsxDpEzeKOGQPgQ7BGJvoPwwiLsHIkkdtmM2njljwqEpTPZIvlfqfFUB1uLAT0GIcTGh\/tTei3LPi\nE7aonllz1LWt+eR5tka0NtRfWPIofzHXJ3gJNTGN3+UsKGRhVHM2YbWZvoazIVN9FvZfPGLMIXMs\neGR3GwFNiRR+NsuAXGbMJAhUY5ZIudl8Sg9a4A+zeJR75hximTHnPU4xH9LEPPIapEyjJZ\/WgcJf\na6pHWKEK31gE2AQHEZcUKTYgJyO4MCFTfeHvpt47nx3JGFnlHyOWukj1yqd+5PvGH+1N+yfIDo5Q\nCnkGtgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_fox-1342638707.swf",
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
	"npc-animal"
];
itemDef.keys_in_location = {
	"u"	: "brush",
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_fox.js LOADED");

// generated ok 2012-12-02 22:58:00 by ali
