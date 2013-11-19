//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Tool Vendor";
var version = "1347655947";
var name_single = "Tool Vendor";
var name_plural = "Tool Vendors";
var article = "a";
var description = "Ever find yourself deep down in the Caverns, chipping away at a rich seam when your Fancy Pick breaks and you find yourself with no tinkertool to correct the problem? The Tool Vendor - widely suspected to be a bureaucroc gone rogue - will help you out. If it's the kind of thing you might need to fix, or the kind of thing you might need to fix it, it's probably here.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_tool_vendor", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "roam"	// defined by npc_walkable (overridden by npc_tool_vendor)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
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

verbs.buy_sell = { // defined by npc_tool_vendor
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy tools. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 11,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
};

function onCreate(){ // defined by npc_tool_vendor
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);
	this.parent_onCreate();
}

function onLoad(){ // defined by npc_tool_vendor
	this.apiSetPlayersCollisions(false);
}

function onPathing(args){ // defined by npc_tool_vendor
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		this.stopMoving();
		this.apiSetTimer('startMoving', 10000);
	}
	if (args.status == 1){
		if (args.dir == 'left'){
			if (this.dir == 'right'){
				this.setAndBroadcastState('turn_left');
			}
			this.state = 'walk';
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			if (this.dir == 'left'){
				this.setAndBroadcastState('turn_right');
			}
			this.state = 'walk';
			this.dir = 'right';
		}
	}
}

function onPrototypeChanged(){ // defined by npc_tool_vendor
	this.apiSetPlayersCollisions(false);
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

function startMoving(){ // defined by npc_walkable
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This vendor is located on <a href=\"\/locations\/LLI1D2QFT571VQT\/\" glitch=\"location|50#LLI1D2QFT571VQT\">Level 4 East<\/a> and <a href=\"\/locations\/LIF12PMQ5121D68\/\" glitch=\"location|51#LIF12PMQ5121D68\">Cebarkul<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"store",
	"no_trade",
	"npc-vendor"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-64,"y":-228,"w":121,"h":223},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIa0lEQVR42s2Y61MTaRbGs1s1Y5VO\nFWWNjDtfwNu6KjqIozKuIjLGAQFFGCFcckdQFEVHAUXccL9DI2AEAQOESxIIIQIB5RLDRVAgLSCI\nOtiIOu66tTKz\/8Cz\/balH\/brTnDfqlNJTlelfn0uzzndPN7\/cHRZfDtieipgm1UbJh\/RyFUzRlnh\nL+3hjsR4n\/KMaGR+FlUoY630v2uJ24kn3UWozpaiuewspqui5yZrwlpemiLcPwlc702R+3iTOKY3\nmw9dxA48H1AhTrQdBbHeSD\/lgaQT7ujLEWIi0wOLDjmplzt3lgpixutFC0qxK8ZunsfzBw2oy5fj\nrP9qSPcuw8VQJ7yaagXTW4p5k2LhVafcedEAdQX+7iMNUuiTDsN6txr\/mr2D4Y4SWLuv45\/POnFF\n7sr59GUXYKlV4C2twdOWc\/S7rki7RQE0lYaYrVoxk3dkE0ySTZiqvYi2m3EIcl3KQsUh9eQ+6Eqi\nEbZ7Gfob0zGZ6gdL2CrMd52hbB7JW0WB7n1VYmpYHcIkunyO8apY\/DrXjTeP2zFozMWlsM1cio97\nfoXuBgUXSXL9YUYgxilP2uaAbcoQ6lFzuMRSGcwUhOzA32fa8Y8nJg7w7dMO7nfa8e+gzgvn\/MT3\n7nkX5ke1mMzxZLT5RxQ2BewsDTablAKqt0LAqFIj8GZCj1dWHTKjPZAf64tnI1pYGlPRrlaA7lYi\nko1keboUU40pYDrTMWc6ZrYZXE3GIff79VLKUBho6K8KYXIDtkAb4IDnPUpMsTJDIhflu4qVGh+c\nFzhxaa5IEYChmzBdn4h74esx237Mtmk2q0SGrnKBH90og2LfCty+5MOll6STpHK4LR8xrNSI3Zah\nMM6bSzm5Tq7NVF\/Az23hjE11kQWkesoF1GSzHAV+jnjYW8kBkGYg9UYagkBKv1+B+XE9d40Y8b+i\nGzHbLDG\/MIVLbALXVRZoN1QnQeu1INVwnYSpjudjtFfFgU1ZypEg2YHO+hQOLJxvj9kxHaxdSgi+\nWwq69wYXzZ5sb7zojIix2Xgb0UhVbJPQ\/WpxTEucK7obC\/C4KRlTzWlQ58ogYVN7wseRS3F0wEau\nDqnYg5gpluNlXzmmW6Ix0Szzs1mKrRqh85hWhlGN1GzJ90LZsb1oPrQCb0bruAg9H6lHWqQrB3js\ngD1MVfHvpWjSgAdRLhjL3s\/QOqnKZoAkzYNqEdhRR\/dcP4qM7UswXh3H1SAZc8RIvdXmSlGVJf3o\nI030urcEgwo3PDLIqfsaG3VyZ3moX9s1AWPVydxJHRb5r8WsVf8R7MFtJfc51JqHkiuBnN9YGY\/R\nruuc\/1FFGIbqxAq2VAy2WRTyj5pprcSgz\/d3JprYcGIbxvtrOZA3U0ZknnLHheDNiA12gpz\/FS6y\noy\/q4EqM3r7GAT6pi0DXjRDGJotDdcZhielGiPtjo1zRXRFm1lNHFV2Ju2BpysOz9jz8MlLHrVij\nHYXIOePB1eFl0RY8HVZzE+dZxWmMlwgxUCOmq9MO\/f6N8mG9NxYLYgZqJLSe+lE1mrffQPmuwa3D\n9ixEM+YnjVykiPRcjfdBQ\/Hp99FltXC6SI6hy\/swZZDT5GZt1ijTxvAYsjTcLgtSjGnFipydSzCY\nIeBACGBB5AFMt1PsdpODgVsUWoticPW0D94+MuBewj5M6GV0dfrhGJsBshu1oTbN25EAso1iUEds\nxfRADQc4ffcmdqz+HK3J7xukTXUJhtJ4VJ7z4qI6o7+MMZ2MVmf52qaLyZPa\/XqZhAx8UuwDaqH5\nTuIeZuhOBQc0218JS00iblMRmJ8wQHs1CvdNhXg5Wo\/XD5vwc0si28WShd5KobNNtZBulCrMN4UL\nrcWBqr58L3PLjURYr5\/Eg+LjXA2W\/+0Q8s\/xue\/v5noxN27EkDEPT1j5sdSdXririVd1qc\/abjck\n4+qeWrjQdi2IvlVy1Jy9axluiTdxgkygaFMyqlhR7lQKoCmMwJxVw\/mJ\/fulBb\/NW0B3ZMKmy+sg\nm16S4raSQHO1cO2v\/aoELs3NymgYi0IQeehrzuLD1uEnwWqUJ+yGOnkf7quDmTlThMFmSwM5pEnY\nh3bFnbJg850bQSrTFbe59rrsj4JNxDqdFfG4sLWQetrjfJAD4kNXcXZB4LAQ7mUvsWn0yHY9WBHq\n2FEWrBhSh6kIrDYpBMxIA6bZp7wXD\/U47L4esoMOyD2zHXmnNiNJtu6jFf+0dcHmr0YIJJGZkXoR\nNaGXq3SxbtCd4eORLgmvp9vQ2pAHT1cHCHx2IitRhsaMIzDlerOLhphZtPc2ZB73VIQYRjUiQ48y\ngM5im8Wqz+ImR9JxN+zd9AW2r1sGf\/43SIz0Q3HUzoUhtUjFW6xD9LClOMgwXCtmGFP4EW3kJqY+\n+xTesDtgX3MWAnd\/iW9Xf4bjQk\/ESrygSvhe1Vclohb1XQ3RxYdNcsPjZplkWC00RLt9ieKgLXgy\nokNJshS+ritRlHISF73XYFIvVT1rP6ZYVECymRDh7tD60RVKj4Wo2LUI2PM1gg+sh5eLHfiblyD0\nh79Ak+4J8sBEN8kk5KYWFbK+er8ks+RbXEx1MWcotyElkV37\/R3w4+4VCPVYiUoFnyFb+KK9QPrv\n881pHpWQzS6nWWuZwpK\/Iq\/QFXnZ25CVshtZma4W0uWjOmkM71Od1QE8RxfBZ8785KV0Yo4LIjIc\noS3bhbqiPfCJ+NNvMy1yivcpDz9wuZ2TnKdyOcdDdPJGSNO+QEPpDiSk2qOSOsjc0wUufvQ2iHju\nG4Q8hZPoj5RTOM\/sJPsDWB\/E59dAEmPHnDi33LxXuoT54cxy\/DmE92kj+OFsPctTbJDwzCTlH3zr\nhTznjaE8x\/8LwC0neX6swSmSRxGw3+M\/\/wPQc+OuTCXvswAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/npc_tool_vendor-1308962361.swf",
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
	"store",
	"no_trade",
	"npc-vendor"
];
itemDef.keys_in_location = {
	"u"	: "buy_sell",
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_tool_vendor.js LOADED");

// generated ok 2012-09-14 13:52:27 by lizg
