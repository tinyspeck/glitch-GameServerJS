//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Extremely Rare Items Vendor";
var version = "1347655948";
var name_single = "Extremely Rare Items Vendor";
var name_plural = "Extremely Rare Items Vendors";
var article = "an";
var description = "This vendor... shhhh!... sells items that are extremely rare!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_rare_item_vendor", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "pace"	// defined by npc_walkable (overridden by npc_rare_item_vendor)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "400";	// defined by npc_walkable (overridden by npc_rare_item_vendor)
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

verbs.buy = { // defined by npc_rare_item_vendor
	"name"				: "buy",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy extremely rare items",
	"is_drop_target"		: false,
	"store_id"			: 25,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy");
	}
};

function onCreate(){ // defined by npc_rare_item_vendor
	this.initInstanceProps();
	this.parent_onCreate();
	this.idle_state = 'idle';
}

function onPathing(args){ // defined by npc_walkable
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
		'position': {"x":-34,"y":-90,"w":60,"h":90},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJOklEQVR42sWY2W4b9xXG\/Qa6DWAn\n3iWR4jYcDpfhcDjkDHdS3MVFC6l9tWXJihXbkhXYKZy2aQS0aZYWjeAW7UVb1I\/AvoHyBNUjEL3u\nxel3\/rJUN7ekWgIHQ5EU5sfvbN+f164N+XG4U48e7NaONrppEbtrk0dPtkpvN7vp3vJMorc4bXJ0\nrv0vH4e7Zff+Vml7vZs6m61FaboSEdEohqmN61w9KqJZCtNUQaXZarT\/2eP2zSsD2t+vj7BSn2yV\njta76bPVuSR1GzHqTBmXwYAMx88ZjmGN0AQlIm5qTmr09EE5emWA5WygODWpUr0QEjfmaxNXhmEF\nGYz\/nq3p53CTYVrtxmm6GqaE7qRCwkfTZf3q0hzXHEflTICKKb+IC1AOBq\/l\/wPM11o+SKWsn6Zr\nGs23DWqUQpQ0XCdXBpjQXSeTSUXAVbJBAcjBz0tpv4CcqerULmuUS8gUizhJVyfIjLrIMtyUT8lU\nzii01I4VrwTQirp7WUsWqbpQkYOhq7mgUI1rsMiwhSB1p3QRK9Oxy1iGkost4+xKAPWQvZ+OS1R4\np+IFXB7ArB4rV8kGoJIf9cfpVgGsoSYjgIrR6kycNruWuAJy+LUYDdnPEkjV++rloCin+LxpVGoB\nah6qccwBrFPHtapBvTitz5kCbqll0ELL6Lcr6nBHTkC+9\/bHgKwoq8eAk0kf1ZDqFuYeByvKkUQN\nGkEbZfHZSdRmHl+Kh\/nQFQzLox1Ld4mUMhynmmuS4bi7+cZVpLiUUjD3nCJiaBLdP06K6w45R2+Q\nLt8g1XsHtWi9HTqgIt2KxjQHpWIeAcnpzUMRVtAIo1vxXixkJ\/fYdQHiGr0uoC4iLF2nH\/6+QAcb\nE0i70R++gv7Rjh6ykYWUZUwvZppHABahmN977xJkvXmP\/vHDI3F9H9AK3aB\/\/fNL+uVLjep5lYYP\nGBg\/0wLjl4CcblYxi+cJw3UJ8nrPI0D4+j4gK7szP0a5uFOUwsv9hntocFpgbDvsHyMN9cSNYqK+\nsFlQg17RHIZqI4\/tIwES99+g\/WUbqZ4b\/wUoO25R2nCiUSSkWB9cwZW6PDJT0rZr2eCZqTkpgDSG\nAcidy0ry8yRgeUjnTQ9F8FoQn\/lx6IExSkWdaCIPGkimNlZed0o7HRhwuaFvz2Iz1LFjuWt1jApW\nkRskqtop5BulGJqDAes5rL+MjJHiRLPY4WBs4prUHVBYQkp94jONQkAEVDwdSmo3ZsztTjXSa8KZ\npGMSRQDJsBeAHJNokkLCK1JXyylQyYuZ5xawF5GLe8R7DMew\/JmB4VZnYu6H3VT\/8VKOdhaz1MI4\nSSOlhcS5UpxyxXOXePQkuHFiLnHjWlaB9wtgqwSp\/S5mqyp165p4nSFnKyrqMNwZoP6skblypP\/x\nSoGebZRopWVSA6nuVqO0C9gq9m08bAewi0LyfQC6xRwsJr34ApJQk5ViIAGJupsuh94pqKBslO2B\n1Kumld7WXErA7S3nqQqHEkY6DWyGKYBud9O4uSoaI4PBbWBAcyOZ2gSV07IIVpRTfQHMyjJgNj4E\nTwigk12kltO7CWtfQZ2xUrmEQnNTCaQ7QpuzSVqE5RcDG\/NwCga1kvHBPZ8redEQHBep5QjJo+hs\n2\/FAgEtN44gBuPbWpi1KYSgbqoNePV2iP\/\/uJb356hmg\/fR0vShMQM4894mVNFYgVMuZbqEip\/YC\nbCqP\/W1JFPLeP8b\/DOZkUGdvHyCNnQqsE84bcRx8ipkwff+rZ\/SX71\/R3978hBaaCXqyWqAO3s+a\n7FJ8QkkLoyeD2iwkPCLFOcxInpONySAbiOOhjJflVvz0IQBX2yYt1A2kxEGbixX6\/dcHAo7j4VLp\nErCQUMRO5pnZLmqUjnpEmhlwEldW89svHtOrx63BXczWTNK9PZ8WtccKTmFvqopHAP70aJ2+\/vke\n\/eGbQ9pdrYoUMyA76xZsVxOmlVXc6qRpAYcnrklukE7NoM1OBj4x0ht8\/rXNbVZucSommiODERKQ\n7Zh3GC1aiExdpaliGkA6HWyV4Z4Nod5MOSIAa\/hCFXT97loVz\/20NmOhHNBQ7TztLJX7zzcrg9Xf\nQs04Wmnh3IAbl2EEkhgfXucouSfGsYPRpQaf2mJUziUpl8Q1g5MdDCsDcrTLFs23irS11KSNuTR9\nutuC+nUYDBX\/kwBwcjA3XbfkkVjQ1ovCDIQxWtK6G503gc3hFnBzjTx9\/mKTXh+uw7xGKB7h82+c\nqnkTK1ARChdSJlULGXyBOGXxZaxoWLyes2LDM6pBz92TgHRPWCwz7IZ6MnWaWfrN8T796bsj0SiN\ncp5CioT0B3EG9pMiuUgPKfgbh3TA6wCuTyYobYbxul+AqpI0nMMSgyXRjZm4VziYSjZMLz6ep+++\nfCK6mcfN4402ulwXBrRdNZFCA\/Y\/AEOL0WMZ9LNPt+ivJ5\/Rm18\/p+c7c+R1wWQocm8ogOxeeL6x\ne2mjQ1twNA+WK\/TNF3siHq01UWs5mi1rYu3xEP\/Fqwe01i3T\/sMZ8UV+e\/yEDnZm6dUni\/T6YAnZ\n8PRlWR4ZCmAmJp3y+ODdC8uFjgzS0nSGDvfmoZJCshuORpawf31ixBzudenBUoX++O0Lkf6vPn+E\n2h0jz\/gt8tpvk6aMYXe7KKh4h\/P7TM7yHfN24JtP45zLQ7hbj6JRAuQYHwOcB6srcD5a0grOHDcF\niIS4f+sDGr35Aaz+R6TKDoqGfCQ5buN87CCPw05hxTf4RrHQzdivfR4ddbjm6ZJGK02svbBELruN\nfB4XWRFFpDcb88LeOwHjxNlj9CzonThLvOtc2X0OJTnuUhxuKOCxbdtst4fTKPmk3w3l+rwdGJQb\nwoxIKHZWxYvjJp8zgvCFUMhpJx9g\/JLk9ox92At77pEZcJLhmyALq1LzjfWtsKN3bdiPrOUrXmwK\nrsO45gKgE8M5hKOnLBooo3koEXJTSnWLOSeNf9jzI6UMafgwDZDadMjZs+Q7I9eu4lHJqjer2eBJ\nEmuPz8HpGP+qoFAKrqWBdWb57YgJhqBMyHksjV53h1x3TnVplEy8l1FdHKdXBni5ZXAUzca9R7D4\nPTjoXiPvP437bRSDSnHFRonAhIBJhVzC0qvOu8W4b\/woq9puXvt\/Pby2j47D7rt98x1gKujoJULO\ngX4s\/zdJL8h5eahMegAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/npc_rare_item_vendor-1345076923.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"u"	: "buy",
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_rare_item_vendor.js LOADED");

// generated ok 2012-09-14 13:52:28 by lizg
