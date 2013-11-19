//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Rube";
var version = "1347754213";
var name_single = "Rube";
var name_plural = "Rubes";
var article = "a";
var description = "Rube is always keen to make a deal. So keen, in fact, that he'll often end up making the wrong one - but as long as a deal is done, Rube is happy. Deal or no deal, he'll return for another try just when you're least expecting him (or, with the right potion, precisely when you ARE expecting him).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_rube", "npc_walkable", "npc"];
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

verbs.talk_to = { // defined by npc_rube
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "The Rube is bad at trading. Try it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.tsid == this.target_pc && this.offer_give && this.offer_receive) return {state:'enabled'};
		if (this.target_pc && this.target_pc != pc.tsid){
			var target_pc = getPlayer(this.target_pc);
			if (target_pc){
				return {state:'disabled', reason: "I'm here for "+target_pc.label+"."};
			}
			else{
				return {state:'disabled', reason: "I'm here for someone else."};
			}
		}

		if (!this.target_pc){
			return {state:'disabled', reason: "I'm here for someone else."};
		}

		if (this.is_done) {
			return {state: 'disabled', reason: "The Rube is done trading for the time being."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.tsid != this.target_pc) return false;

		if (pc.x < this.x){ this.dir = 'left'; }
		if (pc.x > this.x){ this.dir = 'right'; }

		var give = this.offer_give ? apiFindItemPrototype(this.offer_give) : null;
		var receive = this.offer_receive ? apiFindItemPrototype(this.offer_receive) : null;

		if (!give || !receive || !pc.countItemClass(this.offer_receive)){
			this.offer_count = 0;
			this.makeOffer(pc, true);
					
			if (this.offer_give) give = apiFindItemPrototype(this.offer_give);
			if (this.offer_receive) receive = apiFindItemPrototype(this.offer_receive);
					
			if (!give || !receive || !pc.countItemClass(this.offer_receive)){
				this.resetOffer();
				var choices = [	"Sorry, no deals today, my friend. I think I hear the missus calling!",
							"Too rich for my blood, friend. You'll need to stock some cheaper goods.",
							"On second thought, I can't bear to part with any of these wonderful things. Next time, next time…"];
				this.conversation_start(pc, choose_one(choices));
				return true;
			}
		}

		var txt = "I'll give you " + give.article + " " + give.name_single + " for one of your " + receive.name_plural + ". OK?";
		if (this.offer_count > this.max_offers-2) txt += " ("+this.offer_count+"/"+this.max_offers+")";
		var choices = {
			1: {txt: "Sounds great!", value: 'trade-yes'},
			2: {txt: "What else do you have?", value: 'trade-redo'},
			3: {txt: "No thanks.", value: 'trade-no'},
		};
		this.conversation_start(pc, txt, choices, null, null, null, {required_distance: 100, ignore_state: true});
		this.state='offer_trade';


		return true;
	}
};

function checkWaiting(){ // defined by npc_rube
	if (!this.isWaiting) return;

	//
	// remove any keys we can, because user has logged off, or is far away
	// OR IS NOT THE PLAYER WE ARE LOOKING FOR
	//

	for (var i in this.waitingFor){
		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius || pc.tsid != this.target_pc){
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

function die(){ // defined by npc_rube
	if(this.is_dead) {
		return;
	}

	this.apiClearInterval('onInterval');
	this.is_dead = true;
	this.apiCancelTimer('die');

	this.stopMoving();
	this.setAndBroadcastState('fade_out');
	this.apiSetTimer('remove', 6000);
}

function makeOffer(pc, redo){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube makeOffer running: '+pc.tsid);

	if ((this.offer_give && this.offer_receive && pc.countItemClass(this.offer_receive)) && !redo){
		var give = apiFindItemPrototype(this.offer_give);
		var receive = apiFindItemPrototype(this.offer_receive);
		if (give && receive){
			this.sendBubble("Hey, "+pc.label+"! Come talk to me if you'd like to trade.", 20000);
			return;
		}
	}

	this.offer_give = null;
	this.offer_receive = null;
	if (this.offer_count >= this.max_offers){
		return false;
	}

	// determine the minimum basecost based on the players level
	var offer_receive_min_bc = 1;
	var player_level = pc.stats.level;

	if (pc.imagination_has_upgrade('rube_better_items')){
		player_level += 10;
	}

	if (player_level < 10){
		offer_receive_min_bc = 1;
	}else if (player_level < 20){
		offer_receive_min_bc = 10;
	}else if (player_level < 30){
		offer_receive_min_bc = 20;
	}else if (player_level < 40){
		offer_receive_min_bc = 30;
	}else if (player_level < 50){
		offer_receive_min_bc = 50;
	}else{
		offer_receive_min_bc = 100;		
	}

	var catalog = apiFindItemPrototype('catalog');
	var give_candidates = [];
	for(var i in catalog.class_tsids) {
		give_candidates.push(catalog.class_tsids[i]);
	}

	var tries = 0;
	var ignore_base_costs = false;
	var offer_give = null;
	var offer_receive = null;
	var already_traded = false;
	do{
		offer_give = null;
		offer_receive = null;
		already_traded = false;
		tries++;

		if (tries >= 4){
			ignore_base_costs = true;
		}

		// determine the item we want the Rube to give
		do {
			var i = randInt(0, give_candidates.length-1);
			var candidate_tsid = give_candidates[i];
			var candidate = apiFindItemPrototype(candidate_tsid);
			var can_offer = false;
		
			if (candidate.getBaseCost() && !candidate.hasTag('no_rube')) {
				if (typeof candidate.canRubeOffer == 'function'){
					can_offer = candidate.canRubeOffer(pc, this);
				}else if (candidate.getBaseCost() > offer_receive_min_bc && 
				    	(!candidate.hasTag('rube_special') || is_chance(0.20))){
					can_offer = true;
				}
			}

			if (can_offer) {
				offer_give = [candidate_tsid, candidate];
			} else {
				array_remove(give_candidates, i, i);
			}
		} while (give_candidates.length && !offer_give);

		// based on what we are giving, find the appropriate item to take
		var contents = {};
		if (ignore_base_costs){
			contents = pc.getAllContents(function(it) {return it.getBaseCost() && it.getBaseCost() <= offer_give[1].getBaseCost() && !it.hasTag('no_rube') && !it.hasTag('doll') && it.getBaseCost() < 2500;});
		}else{
			if (offer_give[1].hasTag('doll')){
				contents = pc.getAllContents(function(it) {return it.getBaseCost() && it.getBaseCost() >= 1500  && !it.hasTag('no_rube') && !it.hasTag('doll') && it.getBaseCost() < 2500});
			}else{
				contents = pc.getAllContents(function(it) {return it.getBaseCost() && it.getBaseCost() >= (offer_give[1].getBaseCost()/6) && it.getBaseCost() <= (offer_give[1].getBaseCost()/2) && !it.hasTag('no_rube') && !it.hasTag('doll') && it.getBaseCost() < 2500});
			}
		}

		if (num_keys(contents)){
			offer_receive = choose_one_hash(contents);
		}
		if (offer_receive != null && offer_give != null){
			if (this.previous_offers[offer_give[0]+'--'+offer_receive.class_tsid]){
				already_traded = true;
			}
		}
	} while (tries < 7 && ((!offer_give || !offer_receive) || already_traded));

	if (offer_give && offer_receive && !already_traded){
		this.offer_count++;
		this.previous_offers[offer_give[0]+'--'+offer_receive.class_tsid] = 1;
		this.offer_give = offer_give[0];
		this.offer_receive = offer_receive.class_tsid;
		if (!redo){
			this.sendBubble("Hey, "+pc.label+"! Come talk to me if you'd like to trade.", 20000);
		}
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_rube
	this.setAndBroadcastState('spawn_in');

	this.apiSetTimer('startMoving', 3000);
}

function onConversation(pc, msg){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube onConversation running: '+pc.tsid+' - '+msg);

	if (msg.choice == 'trade-yes'){
		var receive = pc.removeItemStackClass(this.offer_receive, 1);
		if (receive){
			receive.apiDelete();

			var remaining = pc.createItemFromSource(this.offer_give, 1, this, true);
			if (remaining == 0){
				pc.achievements_increment('rube_trades', current_day_key());
				pc.stats_add_rube_trade();

				apiLogAction('RUBE_TRADE', 'pc='+pc.tsid, 'rube='+this.tsid, 'gave='+this.offer_give, 'received='+this.offer_receive);

				this.setAndBroadcastState('offer_accept');
				var txt = "Great deal, great deal!";
				this.resetOffer(pc);
			}
			else{
				pc.createItemFromSource(this.offer_receive, 1, this);
				var txt = "Oh dear. You do not have enough room to carry that. Please make some space and come back to talk to me.";
			}
			
		}
		else{
			this.setAndBroadcastState('offer_reject');
			this.resetOffer(pc);
			var txt = "Brigand!";
		}

		return this.conversation_reply(pc, msg, txt, null, null, null, null, {ignore_state: true});
	}
	else if (msg.choice == 'trade-redo'){
		this.makeOffer(pc, true);

		if (this.offer_give && this.offer_receive){
			var give = apiFindItemPrototype(this.offer_give);
			var receive = apiFindItemPrototype(this.offer_receive);

			var txt = "I'll give you " + give.article + " " + give.name_single + " for one of your " + receive.name_plural + ". OK?";
			if (this.offer_count == this.max_offers-1) txt += "\n\nI only have so much patience!";
			if (this.offer_count == this.max_offers) txt += "\n\nLast chance!";
			if (this.offer_count > this.max_offers-2) txt += " ("+this.offer_count+"/"+this.max_offers+")";
			var choices = {
				1: {txt: "Sounds great!", value: 'trade-yes'},
				2: {txt: "What else do you have?", value: 'trade-redo'},
				3: {txt: "No thanks.", value: 'trade-no'},
			};
			return this.conversation_reply(pc, msg, txt, choices, null, null, null, {ignore_state: true});
		}
		else{
			this.setAndBroadcastState('offer_reject');
			this.resetOffer(pc);

			return this.conversation_reply(pc, msg, "I cannot find anything else I wish to part with. Next time, next time...", null, null, null, null, {ignore_state: true});
		}
	}
	else if (msg.choice == 'trade-no'){
		this.setAndBroadcastState('offer_reject');
		this.resetOffer(pc);
		return this.conversation_end(pc, msg);
	}
	else {
		return this.conversation_reply(pc, msg, "Not sure what you mean there...");
	}
}

function onConversationEnding(pc){ // defined by npc_rube
	this.trading = false;
}

function onConversationStarting(pc){ // defined by npc_rube
	this.trading = true;
}

function onCreate(){ // defined by npc_rube
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = 60;
	this.npc_jump_height = 0;

	this.previous_offers = {};

	this.state = 'spawn_in';
	this.broadcastState();

	this.target_pc = null;
	this.offer_count = 0;

	this.apiSetInterval('onInterval', 1);
	this.apiSetTimer('startMoving', 8000);
}

function onInterval(){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube onInterval running');

	// Quit if we're in an interaction or looking for our target
	if (this.isWaiting) return;
	if (this.target_pc){
		var pc = this.container.activePlayers[this.target_pc];
		if (pc){
			// Go to the player
			return this.pathToPlayer(pc);
		}
		else{
			// Player has left. Die!
			return this.die();
		}
	}
	else{
		// No target player? Die!
		return this.die();
	}
}

function onPathing(args){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube onPathing running: '+args);
	if (args.status == 3 || args.status == 4){
		this.stopMoving();

		var pc = this.container.activePlayers[this.target_pc];
		if (pc && this.distanceFromPlayer(pc) <= 300){
			this.makeOffer(pc);
		}
		else if (pc){
			this.pathToPlayer(pc);
		}
		else{
			this.die();
		}
	}
	if (args.status == 1){
		this.is_walking = true;
		if (args.dir == 'left'){
			this.state = 'walk';
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.state = 'walk';
			this.dir = 'right';
		}
		if (args.dir == 'climb'){
			this.state = 'climb';
		}
	}
}

function onPlayerCollision(pc){ // defined by npc_rube
	if (pc.tsid == this.target_pc && !this.is_done){
		this.stopMoving();
		this.makeOffer(pc);
	}
}

function onPlayerExit(pc){ // defined by npc_rube
	if (this.target_pc == pc.tsid){
		this.die();
	}

	pc.announce_sound_stop('RUBE_APPEARS', 5);
}

function onWaitEnd(){ // defined by npc_rube
	this.startMoving();
}

function pathToPlayer(pc){ // defined by npc_rube
	this.stopMoving();
	//log.info(this.tsid+' ---- rube pathToPlayer pathing to: '+this.target_pc);

	var success = false;
	if (pc.x + 100 < this.x){
		success = this.apiFindPath(pc.x+100, pc.y, 0, 'onPathing');
	}
	else if (pc.x - 100 > this.x){
		success = this.apiFindPath(pc.x-100, pc.y, 0, 'onPathing');
	}
	else{
		success = this.apiFindPath(pc.x, pc.y, 0, 'onPathing');
	}

	if (success){
		//log.info(this.tsid+' ---- rube pathToPlayer pathing is successful');
		this.state = 'walk';
	}
}

function remove(){ // defined by npc_rube
	if (this.trade_pc) {
		this.conversation_cancel(this.trade_pc);
	}

	this.apiDelete();
}

function resetOffer(pc){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube resetOffer running');
	this.offer_give = null;
	this.offer_receive = null;

	this.is_done = true;

	if (pc){
		this.apiSetTimer('die', 4300);
		this.trade_pc = pc;
		this.onInteractionEnding(pc);
	}
	else{
		this.die();
	}
}

function setTarget(pc, play_music){ // defined by npc_rube
	this.target_pc = pc.tsid;

	if (pc.buffs_has('rube_lure')) this.was_summoned = true;

	if (play_music){
		pc.announce_sound('RUBE_APPEARS', 0, 0, true);
	}

	if (!pc.rube_visited_count) pc.rube_visited_count = 0;
	pc.rube_visited_count++;

	this.makeOffer(pc);
}

function startMoving(){ // defined by npc_rube
	// Don't start moving again if we have a target player and they're close.
	if (this.target_pc) {
		var pc = getPlayer(this.target_pc);
		if (pc && Math.abs(this.x - pc.x) < 100) {
			return;
		}
	}
	if(this.is_dead) {
		return;
	}

	this.parent_startMoving();
}

function stopMoving(){ // defined by npc_rube
	//log.info(this.tsid+' ---- rube stopMoving running');
	if (this.is_walking){
		this.apiStopMoving();
		this.setAndBroadcastState('walk_end');
		this.is_walking = false;
	}
}

// global block from npc_rube
var max_offers = 5;

function onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
}

function turnAround(){ // defined by npc_walkable
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
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

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
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

function parent_onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
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

function parent_stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function parent_checkWaiting(){ // defined by npc
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
		'position': {"x":-45,"y":-137,"w":90,"h":137},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHiElEQVR42sWY61OU9xXHn93nsldE\nTTKpnWaY6WTS6Uw7xBCQmy7IykUWFuQWwARvLPddYLkLrojAFlScBEUTBRNjJjFRolHHeOmixpJo\nG6Zt8iZ5YWf6ut0\/4dtzfgsUOkzeZHf7zJx5nn14sR++53zPOb+VpJ9xXdknxV\/dK9nuNCi267WS\njZ85LrukWOn\/dT32GuPuNaue2w3yMwLEnSYF12p1oM\/gz+crdBi063HcofdFHe7afqnmZp0++LBV\nw+cHdMtgt+plAcqAHGdLdXBvURBVuO8HX3LerFcw59Fwt1nB3SY95lp0eOiW8MgjYb4tdP9ot4RT\nxTq0pyoLUQX8q29T8AuXHvdbVDz0yPje9xzFRnzjlQUcx1yLhE9qJKHemRIdRrPUGb89SvX4pHej\nSOV9Uo+hnnaSko0SbtVJ+HSPhAuVOq47DGTKAnDSqceoXYXfLjujAvhVx4bA43YDpVbB7XoJ02\/o\n0JYiYzBLxrGdIbAlOG+qjL6tCoaz5JmopfhJ73MBNoeAJBXZqdRS8KR3w7I5OP6QpxeAt5ticJU+\nf7ZPmo0K4A+jcQEGY5Mw5MkCvai7O81GAca1d75cxSUySe82GX8f3IT3K\/mdIXJuLm6TbEvP\/xh\/\nOcCthCHnO4x4tzQEeHVRuSN2I0ZyLORgGYco1aws1+SxfAsrbYsIYFGrPFvUqvcVt0vxS4Dc9xjw\nyj5NAN7zWAXgQKaGnm0GjFE9cvofehSh6oVKKRixyVLkVnxVB2U4GhX0dcTgvtcqADnFCwMv4rrL\njKc91uX645QyHD9zm\/FTPfpzpMi5OKFMit3pUhcKSbnMagMutsSIicF1yCr+6H8Zf\/G9gi8af4nz\nlevEBFmCne+IxY06BefKpVlXQoQUTCsx1qSXGgPpZSac8f4Cc53rRA3+0a3imy4zvh3YhAftsbhZ\nr61y8l0yznek8N\/6X8Tsfh2mSnTBg1sj1A\/Ti9V4gvT988RvRFpZPZ4mf+qKXQW1FAz0uH0dnnRt\nEJAP2mKW0+9Ni1Bf\/O7QCxPf9sXiQatRAD5qM1D9yatqby3YOY9FgK5cIloSlfA6+t+Tm+MCHgOa\nExW4k1R8tldddHEI7N0yBY9IsafdG0XdsYLs3iWoW\/Xqcp\/kJaI\/I8xr2L+mXvOxMaZpzxvOlnEg\nnlMcqjl2LKfzh6GXsND7vDDFWkoy3HCOXozGsAP+OPIr23ynGV82G3CY5u5kkQ4DGbSkHtBjLFde\n5VxeVv83+O+9ttCMbk+Vg+4tETDLvNc4w879dI+Mj9+ScLzAJJx7mbaYCRp5\/lw9hnfIOJ4n42S+\nLLYYjuN5BrxTFIP3yqw4nKFMRKzdPHBrvqv7Qyot3b9sMuGDagU36k24T9NkZdxpsZLi63HPvR6T\nhZqAHclSIrc0fN2hOcUWTUEr\/5p1tlawwherdIuKKoGIAf65W4q97tItMBwHn0d+Cow3GgbjmC5f\nBKTtOuIr16UqdeGDSj25UveTqk0V63HKKWM8RxHKjWTJNVHZCT8sMwdv1Znx9cgm3Oh6Hm+XWXBw\nm7Jm9FK0pigTUduor+y2xE85VJzOVzG9S8Mnu2mzbl2Hrw69gGst65fj47pYjOaqItpSFFvUAC9X\nWDxTDg1jO8iR2xWczFWX28lgprIq+DxC6qFti94TNcBLZebZs4UGHMtW0ZNOx8oCwzIgx3CWsuoz\nnYvRmhxy7hGHJf7tAqtt5RGUtnVnkVvv44U4LIDvl5gCH5VbMEHKcY0d3W7EeHYIxlMRUm4Jrtep\noNtmwKEdJvgd1qA\/3wqOYw4rNXkRgfYqU7CJmn13lRaeyXLOqQUv7DLhnTwVQ5TinjRNAI4QUCmd\nkytb6NjpNKC73IiKNhkji1AjK+BG6T5REIMT9HyY4HvonxjIMIan\/UwXG3G+yID3KM1ch7Q2iXT7\nc4xoetOMknYZeXs0FNSqaKg2CjAGGnOE4IbzLAKqi6DaU1R0JKvoTNborv38FJ+l2jlbaMSFXUZ8\nSK1lJIscmqxw88URSu1B+tI+AujIMWN4J0EVrcdY4To6k1jQl2lEa6qK5i0qLQwq1aWKxqRQ8Lum\npDD0yNN5im2SFgTqg7hYasZgroYhgmtMCNXjULYZRwjM77DQOkVpyzRhKNeKzq0GAdWYSHWaEoqG\nxFAwdEtyGFvRUbshcLrajAqXipxKDT5auY5S\/fWkKejPNBCQGb7tdOe6o5SOF1gIQoMrIQTGMKwY\nPzNcLb1vSlQC+zdLcWEBLHfJNWUeOfBmsxwcLCRVXlNRv5m+kNQgePTZyL0EOphnFTFObu2xaQLG\nm\/ZfSNciWOfWCDVxb6oUR2nhHofaV1Xsi1efNScpvs4M80y\/3YzD2Sb0203CIAy1VG+Lys0MZEZh\nulB6Z3lS7Pmdird+q4pp0fi67ORzS0OOaaKpwCgU7EinGktVF+g0V9Ntj+Lv1vyFDFhHaS77deiL\n6xOUwN7fqyipVp\/lN8jPTtDkIINEb9StvMbtspMB3a+rC2ccUjy\/q3tV9bgp1RXUsHe1RnGLWes6\nlad6aLQFzzmpUVO78SaFllH+kamgMbyHov8AzJPdcqt\/OY8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_rube-1342566433.swf",
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
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_rube.js LOADED");

// generated ok 2012-09-15 17:10:13 by mygrant
