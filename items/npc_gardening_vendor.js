//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Gardening Tools Vendor";
var version = "1344982233";
var name_single = "Gardening Tools Vendor";
var name_plural = "Gardening Tools Vendors";
var article = "a";
var description = "A mysterious leftover from another age, the scarecrow has always been a dependable source of gardening tools, keeping, as he does, an infinite number of hoes in his surprisingly capacious bag.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_gardening_vendor", "npc"];
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

verbs.buy_sell = { // defined by npc_gardening_vendor
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy gardening tools. Or sell anything (via \"sell\" tab)",
	"is_drop_target"		: false,
	"store_id"			: 12,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buy_sell");
	}
};

function attract(pc){ // defined by npc_gardening_vendor
	if (this.is_walking) return;
	if (time() - this.last_attract < 5) return;

	this.last_attract = time();

	this.state = 'attract';
	this.broadcastState();
	this.apiSetTimer('stopMoving', 5000);
	this.sendBubble("Hey, "+pc.label+"! If you need gardening tools, I have plenty.", 5000);
}

function onCreate(){ // defined by npc_gardening_vendor
	this.initInstanceProps();
	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = 100;
	this.npc_climb_speed = 25;
	this.npc_jump_height = 0;
	this.npc_can_fall = 0;

	this.state = 'idle_stand';

	this.last_attract = 0;
	this.is_walking = false;
}

function onPathing(args){ // defined by npc_gardening_vendor
	//log.info('pathing callback: '+args);
	if (args.status == 3 || args.status == 4){
		// At destination
		this.stopMoving();

		// Find someone nearby and attract them
		var players = this.container.apiGetActivePlayersInTheRadius(this.x, this.y, 200);
		for (var i in players){
			this.attract(players[i]);
			return;
		}
	}
	else if (args.status == 1){
		// Changed direction to args.dir
		// These are backwards on purpose for the gardening vendor
		if (args.dir == 'left'){
			this.dir = 'right';
			this.state = 'walk';
		}
		else if (args.dir == 'right'){
			this.dir = 'left';
			this.state = 'walk';
		}
	}
}

function onPlayerCollision(pc){ // defined by npc_gardening_vendor
	this.attract(pc);
}

function onPlayerEnter(pc){ // defined by npc_gardening_vendor
	//log.info(pc+' has entered my location');
	return;

	if (num_keys(this.waitingFor)) return;

	var x = pc.x+100;
	if (x < this.container.geo.l + 100){ x = this.container.geo.l + 100; }
	if (x > this.container.geo.r - 100){ x = this.container.geo.r - 100; }
	if (this.apiFindPath(x, pc.y, 0, 'onPathing')){
		this.state = 'walk';
		this.is_walking = true;
	}
}

function onWaitStart(pc){ // defined by npc_gardening_vendor
	this.stopMoving();
}

function startMoving(){ // defined by npc_gardening_vendor
	//log.info('------------- startMoving');
	if (this.is_walking) return;
	//log.info('------------- startMoving ok');

	var distance = randInt(this.container.geo.l, this.container.geo.r);
	//log.info('------------- startMoving distance: '+distance);
	if (distance < 0){
		if (this.apiFindPath(this.container.geo.l-distance, this.y, 0, 'onPathing')){
			this.dir = 'right';
			this.state = 'walk';
			this.is_walking = true;
		}
	}else if (distance > 0){
		if (this.apiFindPath(this.container.geo.r+distance, this.y, 0, 'onPathing')){
			this.dir = 'left';
			this.state = 'walk';
			this.is_walking = true;
		}
	}
}

function stopMoving(){ // defined by npc_gardening_vendor
	//log.info('------------- stopMoving');
	if (this.is_walking){
		//log.info('------------- stopMoving walking');
		this.apiStopMoving();
		this.state='walk_end';
		this.is_walking = false;
		this.apiSetTimer('stopMoving', 1000);
	}
	else{
		//log.info('------------- stopMoving idle');
		this.state='idle_stand';
	}

	this.broadcastState();
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

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
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

function parent_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function parent_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function getDescExtras(pc){
	var out = [];
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
		'position': {"x":-75,"y":-186,"w":150,"h":186},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHAElEQVR42s2Ye1BTVx7H2f86+w99\n7FS0a9O6CgTMiwi0dWxWB5GHQBLexBIIGFCQyEPYETCrq7NVpwQVRES9LFqhRAgsj1V5XFHkoUKq\nIrJoiF11pR0ldHWpOu58956rwxJWqH8A6W\/mO\/fek5OcT77nd3733GtnN0PRlCW2r8l019VkelhO\nZbjTBua8NtNDq89YFmRn63gJ52GsyfLEZOkz3HE8RayZc6jzO1cE7Ytx0RbF83QnN4st5ZvFIDqR\n4saqeosHC1iZ7o6yTW7mOYWr2+qpKVC5ggGcUgfjl6JoPQ+H1DwGfBkq1WL7OYE7s2258hAz8HRw\nk0X6lyYL6ap0EWfWwIrVi+yZQQwTnTuW+ik6KBWuVmlwr\/1PVuqvy0BbSTQOJy0b758f42L5S7Jw\ndvKxUOVqnOyM6cxWYOjIlBq7cQDDnbtQ\/5Xc6ntFca7UjAOSH82P4dITB4JxH14MFFmD9R9k259d\n289eP76ah+bDMuxVCaBTcie6Sc1qLnZ9KdXAsAOPO778H9xgMdC4G6jdiUf6jPH2rq\/XYX\/Sp9gZ\n7mg13bMKiGtlktGSjRi78pU1YP1OvCjPwlj7S\/CRK39Gb1UCC7gjbMk44H6Vo2B2Ac3HJATgbutW\nVt+3b8d1vZo9nzjlDy7+EcbqRBzP+nyCe1zdnJQcBsBCIJ7dLBzXRLhnA4UY7d2NW83ZsMktDuaj\n2ulW8XDHdrQdC8Vg01bKzlYBUwn1Orin\/Qdwty0XptZcDLVkc+xsGTAfUZLpfv73InzXpsXA6S0Y\nbM6mbzdnK01NWXNzi4vc5TlvCjjNWF+BlXP9jen0rIKZG2WSJz1q838GNlvGrsSAVrujcp0QZ0P5\naA3m429hfFwOWMqqcR0fe6Kc0Fugwu2aLNwoScSPlWnoO56IuzmBmlnZJDxoCaNGu5S4XRuIwdI1\nuCjloTuQh84gHgtYFyGAIUoAvUKAi+ECulDpzLTzUBvCQ91qJ3SFCdEfIkR3hAjtUSKcjXbDDwEC\nXGGu7wYJ0BkpwpO9a4y4oWbyIVmD\/vUS9Me9WZ7+dG2D5E6jzDxUL7X0lnpZvv061EKco2JFqPhC\niJI4kaUugk9dDuAFjazich778jUNMi5qA51wXiFCp4yPXcFcc5tCqLwUITI3xLixsBXxYhaUXA+v\n\/wQj7QqMdsfiqTEeGEgBTJlGDKX9fPHGrVSJqV6qMzVIjf++lkS9uJODh9\/IQGcut5yT86gRr0VW\nU9amENHFsULkhy\/B4XgRC6n3cR7f\/\/WECxJuyYXm42ox6yJxbyD5E5gbpBjQ++OHcxEY+zYRY32b\nMNqh0L1xDjKABvSplf\/qWY97Z0PwU2+s5HV9n63hs1AtPo44KXdiIap8uciSOVk9i3RHCpU3QoQ0\ncXAg93MMGYIw3KxAV8EqDDGwD89HGR91xdJDDfKfn+qhOpnAXC9T4nqC4OGFSMOd03LD6\/r1y0Uc\nMmCVyg3lYTzsjnBEqVKAgzIXJPl8RL\/2USFSJBnbuNw8ei4Kt6sC0VPqQ\/\/jtJyFfH49QfNGgBPD\n1BRqP3IxikOgJ392b9vvlTe3rcSTfD98l7sStame2BfljAsSR+R4f2yMXeEgmc6EB62hkufGOA0x\ng0kr+p9NITpiyoysdJJjJrnQ0PKFG+DNx6VET9xPXo7KSGfUJrnj8Abx\/o1evzWGit+xn+7P3zsT\nrCSpRNKKyUstTOqZKUsja\/lFZFVeZUoKswhwZIOYLSP6BBGOhDlCK3Ue3uDz4R6N90IqN2B6J4lr\nBJZo5or52WCqr8wPI7kSPIr1wGXGQeIkgaxWuqDA3xFtPo7aHP\/5yPF3QLbffM7U93P1zBbz+00h\nQUzOmH\/sjDaOdqwDSXL2WO6PQcoP3YVeKIxzxq6QhchdO5\/VH3wc5m5HQ5L6aW9s0IPWcFgYMFKG\nvmfqGVmJTy4pMVgdiAPRi5EXwYE2YMFLQF8HpK96e+52NQ\/bFcqbBil1vyXUMtQoR1P+Clw\/tRYE\nuvuEL1r2fIaD0R8jm5niLJ95yPCehzTv97Vzu81iVl9DwUq6Oe8zI5XohAtHvQgc3VPuRzXnS2gC\nuEP6AdIZuHRbAJJoKFjFqcng6ypSXEGluRovlfmyK7ap2MueAO4NW\/gScPU82mYb1vLkpXTFJhfo\nIhZYOUQAD8X8Dmmr36eyvN6xtxmgfjPfeDKZ+3+AhdEfaY6qFmvtbB3faHg4sdEJeeELbP+ycnJU\npXM5p1L5KEtcgrzIqe8YNovqVJ6kIoUHSr34Fwn469JE191\/3SJEsWoRgj3slzFt75J2W0L9itF7\njBYzci+Kcz5jSGf2gEoOeXugYORF2l99\/q7NARmt5vzmLYW\/4O3tzLnslwBoNcWvYB0YLXh1JFBv\nzdQA\/wX+OQ84+gOaxgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/npc_gardening_vendor-1308961852.swf",
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

log.info("npc_gardening_vendor.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
