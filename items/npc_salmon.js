//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Salmon";
var version = "1354513775";
var name_single = "Salmon";
var name_plural = "Salmen";
var article = "a";
var description = "One fresh, wild, slinky, slippery salmon. Some say there is a soul of a glitch contained within each salmon. In which case, souls taste delicious when stuffed in your pocket then grilled up on a nice rustic plank.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_salmon", "npc"];
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

verbs.pocket = { // defined by npc_salmon
	"name"				: "pocket",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put in pocket",
	"is_drop_target"		: false,
	"proximity_override"			: 500,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var random = Math.floor((Math.random()*10)+1); //10% chance of boot drop
		if (random == 1){
			pc.createItemFromOffset('boot', 1, {x: this.x, y: this.y}, false); // give boot
			self_msgs.push("Huh, looked like a fish at first.");
			failed = true;
		}
		else{
			var remainder = pc.createItemFromOffset('salmon', 1, {x: this.x, y: this.y}, false);  //give pocket salmon item

			if (remainder > 0) { 
				failed = true;
			}
			else {
				pc.feats_increment('animal_love', 1);
			}
		} 

		var energy = pc.metabolics_add_energy(-1 * 4);  //remove 4 energy

		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: energy	
		});

		pc.announce_sound('SALMON_CATCH'); //play sound

		var pre_msg = this.buildVerbMessage(msg.count, 'pocket', 'pocketed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.apiDelete(); //delete self

		return failed ? false : true;
	}
};

function flyAround(){ // defined by npc_salmon
	if (!this.container || !this.container.geo){
		// give it a second to allow the NPC to be placed in a containing street
		this.apiSetTimer('flyAround', 1000);
		return;
	}

	this.apiMakeBird();
}

function moveToWait(){ // defined by npc_salmon
	if (!this.is_waiting) return;
	if (!this.wait_pc) return;
	if (this.wait_pc.location.tsid != this.container.tsid) return;

	// move to next to pc
	var x = this.wait_pc.x - 20;
	var y = this.wait_pc.y - 100;
	this.apiStartFlyingInTheArea(x, y, 10, 10);

	// follow the pc while we're still focused on them
	this.apiSetTimer('moveToWait', 500);
}

function onCreate(){ // defined by npc_salmon
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);

	this.flyAround();
}

function onWaitEnd(){ // defined by npc_salmon
	delete this.is_waiting;
	delete this.wait_pc;

	if (this.following){
		if (this.follow_pc){
			if (apiIsPlayerOnline(this.follow_pc.tsid)){
				if (this.follow_pc.location.tsid == this.container.tsid){

					this.apiStartFlyingAndFollow(this.follow_pc, 300);
					return;
				}
			}

			// either the player we're following has gone offline,
			// or has moved to another location. commence random movement
			delete this.follow_pc;
		}
	}

	this.flyAround();
}

function onWaitStart(pc, mouseInteraction){ // defined by npc_salmon
	this.apiStopMoving();
	this.is_waiting = 1;
	this.wait_pc = pc;
	this.state = 'fly-top';

	// Only pause for mouse interactions. Fly towards the player for local interaction stuff.
	if (this.distanceFromPlayer(pc) >= 100 && mouseInteraction){
		this.apiStartFlyingInTheArea(this.x, this.y, 10, 10);
	}
	else{
		this.moveToWait();
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

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function parent_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function parent_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Salmen can be found in the region of <a href=\"\/locations\/hub-136\/\" glitch=\"location|136\">Jal<\/a>."]);
	out.push([2, "Pocketing this yields <a href=\"\/items\/219\/\" glitch=\"item|salmon\">Pocket Salmon<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"npc",
	"npc-animal"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-28,"y":-18,"w":53,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFY0lEQVR42u2WeUybZRzHd7hlh5qZ\n6TTRP9T4lxr\/cH8qSrLEZIlZFpPBZkS24MZRbDlKSjdlQFtooRyDcpSzHB2UY1yDUmjp8Z5tccAW\nhDA5HItMt2SZGyEe8evvrccfuhjN5v56v8kvz\/v27fs8n+f7fJ+n3bRJlixZsmTJkiXrUerIkSNb\nq6urPzEajbNqtfrKiRMnkg8ePPgMPdr8UAY4e\/bsdhpk+\/79+7f9y063REdHPya9k5SUtC83Nzcr\nOzv7WkZGBugex44dw9GjR8\/HxcW9furUKanPLQ8Ct0en03mVSuVX1GHfoUOH3rrP1zZLMOnp6Tup\nXklJSUnQaDR1JpNpymazbTAMg7m5OayurmJlZQU8z2NkZAS1tbXrWVlZ7oSEBFVqaupL0vuS2\/8V\ncBcBFtHL+Dgu7seYmBin5I70TJp9Zmbm0wqF4h26JqNyHQ2NDbdsLTaMu8chBkW029tRXl4G+hwO\nRyfa2lpRU1uDc+fOSYBobm5GRUUF6uvrb1AEHGlpaR\/QWM9Tu4cm+jiNteMfHSbAHTRwurQ0ipQU\n1FdVrcTGxr5PWdpnMBhi8vLywtkaDQoLCtBsa8KwawjhGRFzi1ewsPIlrt9awc31Ndy8t4Ybd65j\n6ZuFyLPJmRCGhgcjwPV1dXB0dqKOWovFgqKiojWtVhuiybcQqJpA31apVM\/SCu6+r4NU+lSFAvU0\n08HOzo2kxEQ+S61uKzIZv3N02BHwueEdc2EyxGMyyIHzTiBADjITbnC+CWo98NE9x\/oh8iwCXg\/8\nE7+VKNC93we32w2\/3w+PxxO57unpgd1ux9DQEMgEUGTCBJx9\/PjxF\/+WwZycnIuZFPB2WhJ3by86\nGhow1OUA63KCc7nAjDohEEDQ50HQP4EQ40Uo4P392gfOPQaWJhDmGYh+L3gCDAsMWI80AR+uXL6M\nufk5TE1Nwel0Ynp6Gi7ql1YoEoH8\/HxQVkGAoBNg4U84q9W6rbS09D1a4rsqpRIlOt0v3u7ujYme\nnvVxhwMBmiXT1wdmYADM4AC4kWFwoyNgLl4EOzyMwOBg5J5zjUIYd+ESH0CYwMMEHSRnubExzM7M\nYHFxEUtfL2F2bhZerxccx0UgB6hfMgeK5GQoTp4EbaS7BNgUgQOwubW19d2ysrI12gSIj4\/\/+aPY\n2FVHTU1XZ2OjvcFsXh2vrb3N2O0bLOWH7e4GS8AsOSwVc+EC2IF+cATO9vdDIPiQ2wWRXOedwwh6\nx\/EFG8DV+XksLy9jeWUJVxcXMD0zHYGksaEh19ISE6FXKn+yZGRcTU5MbKJT5IlN0i6lnfVqU1PT\ndElJyfe0Ib6lgIYOHz6skuALCwufKsjLi6\/WaIoZs7lbsFrnuebmdb6tDTzlhuvoAEfQkSKnpZIm\n4Kcao2edNTWwVVbASTEJCwJmCGpq6hJEUcTo6CgslPVslQqfkXPtWu1awGj08BbLAcrfcxH36JR\/\nkgA1tKtctMzV5KA2Kirqzfvtcr60dCdvMh0IlpbaxMrKy0Jd3W2hsRECZUew2SCQEwKBswTmPH8e\njZWV0FKeP6fItBQVoam8HFY6cuoIqtxoRA4dZ7kKxb1WjWbRr9czXHFxhtti2fvAvzYutXp3sKAg\nimDLRLNZDFZUrAYtlh\/EqioEq6shUI0RXHtxMZop9CNmM8gV9BsMd1pOn77VoNFcq83MnO49c8Yf\n0OvrGYPhQ+pv70P7OfxDXjo32fz81wSD4VPeaOwQTCaPaDIxUrEFBUzEFWpFo3EkaDL1UVvO6\/U6\nLj8\/hdHpoun9F9DVtfWR\/EmYtFp3hQoLXxYNhjf+WgSyR\/4bJUuWLFmyZMn6X\/QrRjvVnB\/Jo5YA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/npc_salmon-1351274710.swf",
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
	"npc",
	"npc-animal"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"o"	: "pocket"
};
itemDef.keys_in_pack = {};

log.info("npc_salmon.js LOADED");

// generated ok 2012-12-02 21:49:35 by ali
