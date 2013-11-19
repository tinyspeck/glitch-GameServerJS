//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "JS Test Item";
var version = "1347906553";
var name_single = "JS Test Item";
var name_plural = "JS Test Items";
var article = "a";
var description = "A generic test item used for testing item code not associated with any existing item";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["js_test_item", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.make_spec = "null";	// defined by js_test_item
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	make_spec : ["The spec used in the creation of the item"],
};

var instancePropsChoices = {
	ai_debug : [""],
	make_spec : [""],
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

verbs.activate = { // defined by js_test_item
	"name"				: "activate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.create = { // defined by js_test_item
	"name"				: "create",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'What would you like to make?',
			cancelable: true,
			input_focus: true,
			input_max_chars: 150,
			itemstack_tsid: this.tsid,
			follow:true
		};

		this.askPlayer(pc, 'make', 'Make', args);
		return this.conversation_end(pc, msg);
	}
};

function onConversation(pc, msg){ // defined by js_test_item
	if (msg.choice == 'make'){
		this.failed = false;
		this.onStep(pc, msg, this.make_spec, 0);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'nevermind'){
		return this.conversation_end(pc, msg);
	}

	return this.conversation_reply(pc, msg, "Not sure what you mean there...");
}

function onEndToolUse(details){ // defined by js_test_item
	details.pc.announce_sound_stop(details.tool_class_tsid.toUpperCase(), 0);
}

function onExecuteRecipe(details){ // defined by js_test_item
	if (this.failed) return false;
	if (!details) return false;
	if (!details.pc || !details.recipe_id || !details.count || !details.tool) return false;
	if (!details.energy_cost) details.energy_cost = 0;

	var tool = details.pc.items_find_working_tool(details.tool);
	if (tool){
		if (!details.pc.making_execute_recipe(details.recipe_id, details.count, details.energy_cost, tool)){
			this.onFail(details.pc);
		}
	}
}

function onFail(pc){ // defined by js_test_item
	this.failed = true;
	pc.sendActivity('Auto-make failed because one of the ingredients could not be created');
}

function onInputBoxResponse(pc, uid, value){ // defined by js_test_item
	if (uid == 'make' && value){

		var values = value.split(' ');
		if (!values[1]) values[1] = 1;

		this.make_spec = utils.craftytasking_get_build_spec(values[0], values[1], true);

		log.info('make_spec: '+this.make_spec);

		if (!this.make_spec['ingredients']) {
			pc.sendActivity('This is not a valid item to auto-make!');
			return false;
		}

		this.onVerify(pc);
	}
}

function onOverlayDismissed(pc, payload){ // defined by js_test_item
	pc.announce_sound_stop(payload.tool_class_tsid.toUpperCase());
}

function onStep(pc, msg, spec, duration){ // defined by js_test_item
	var ingredient_class = '';
	var ingredient_count = 0;

	if (spec['class_tsid'] == 'firefly') return {duration: duration};

	if (spec['elements'] && spec['elements']['ingredients']){
		for (var i in spec['elements']['ingredients']){
			this.events_add({	callback: 'onToolUse', 
							msg: msg,
							pc: pc, 
							tool:'ore_grinder|grand_ol_grinder', 
							energy_cost:0, 
							recipe_id:null, 
							class_id:spec['elements']['ingredients'][i]['class_tsid'], 
							count: spec['elements']['ingredients'][i]['count'], 
							duration: spec['elements']['ingredients'][i]['wait_ms'], 
							tool_verb:'crush', 
							ingredient_class:spec['elements']['ingredients'][i]['class_tsid'], 
							ingredient_count: spec['elements']['ingredients'][i]['count']}, 
						duration/1000);
			duration += spec['elements']['ingredients'][i]['wait_ms'];
		}
	}

	for (var i in spec['ingredients']){
		ingredient_class = spec['ingredients'][i]['class_tsid'];
		ingredient_count = spec['ingredients'][i]['count'];

		var res = this.onStep(pc, msg, spec['ingredients'][i], duration);
		duration = intval(res['duration']);
	}

	if (spec['tool']){
	this.events_add({	callback: 'onToolUse', 
					msg: msg,
					pc: pc, 
					tool:spec['tool'], 
					energy_cost:spec['energy_cost'], 
					recipe_id:spec['recipe_id'], 
					class_id:spec['class_tsid'], 
					count: spec['count'], 
					duration: spec['tool_ms'], 
					tool_verb:spec['tool_verb'], 
					ingredient_class:ingredient_class, 
					ingredient_count:ingredient_count}, 
				duration/1000);
	}

	duration += intval(spec['tool_ms']);

	return {'duration': duration};
}

function onToolUse(details){ // defined by js_test_item
	if (this.failed) return false;
	if (!details) return false;
	if (!details.pc || !details.tool_verb || !details.tool) return false;

	if (details.tool != 'self'){
		var tool = null;
		var tools = details.tool.split('|');
		for (var i in tools){
			log.info('Looking for '+tools[i]);
			tool = details.pc.items_find_working_tool(tools[i]);

			if (tool) break;
		}
		if (!tool) {
			log.info('No working tool ');
			this.onFail(details.pc);
			return false;
		}

		log.info(tools[i]+' found');
		if (details.recipe_id != undefined){
			//
			// show the overlays and set timer for the recipe creation
			//

			this.events_add({	callback: 'onEndToolUse', 
							pc: details.pc, 
							tool_class_tsid:tool.class_tsid
						}, 
						details.duration/1000);

			details.pc.apiSendAnnouncement({	type: 'pc_overlay',
										state:'tool_animation',
										uid: tool+'_'+details.pc.tsid,
										item_class: tool.class_tsid,
										duration: details.duration,
										pc_tsid: details.pc.tsid,
										delta_y: -120,
										delta_x: -30,
										locking: true
										});

			details.pc.apiSendAnnouncement({	type: 'pc_overlay',
										uid: details.class_id+'_'+details.pc.tsid,
										item_class: details.class_id,
										duration: details.duration,
										pc_tsid: details.pc.tsid,
										delta_y: -120,
										delta_x: 30,
										locking: true
										});

			details.pc.announce_sound(tool.class_tsid.toUpperCase(), 100, false);

			this.events_add({	callback: 'onExecuteRecipe', 
							pc: details.pc, 
							recipe_id:details.recipe_id, 
							energy_cost: details.energy_cost, 
							count: details.count, 
							tool:tool.class_id
						}, 
						details.duration/1000);

		}else{

			//
			// run the verb on the tool
			//
			log.info('Running '+details.tool_verb+' on '+tool.class_id+' with '+ details.ingredient_count+'x '+details.ingredient_class);
			if (!tool.verbs[details.tool_verb].handler.call(	tool, details.pc, {	target_item_class:details.ingredient_class, 
																target_item_class_count:details.ingredient_count})){
				this.onFail(details.pc);
			}
		}
	}else{

		//
		// grab ingredient and run verb on each stack
		//

		var count = 0;
		while (count < details.ingredient_count){
			var next_stack = details.pc.removeItemStackClass(details.ingredient_class, details.ingredient_count - count);
			if (!next_stack) break;

			count += next_stack.count;
					
			if (!next_stack.verbs[details.tool_verb].handler.call(next_stack, details.pc, {itemstack_tsid:next_stack.tsid, count:next_stack.count})){
				this.onFail(details.pc);
			}
		}
	}
}

function onVerify(pc){ // defined by js_test_item
	var can_create = true;
	var count = 0;

	var txt = 'Would you like to make '+this.make_spec['count']+'x '+this.make_spec['class_tsid']+'?';

	if (this.make_spec['total_energy_cost'] > pc.metabolics_get_energy()) {
		can_create = false;
		txt += '\r\rYou do not have enough energy to make this. You will need '+this.make_spec['total_energy_cost']+'.';
	}

	for (var i in this.make_spec['required_skills']){
		if (!pc.skills_has(this.make_spec['required_skills'][i])){
			can_create = false;
			if (count == 0) {
				txt += '\r\rMissing Required Skills: ';
			}else {
				txt += ', ';
			}
			txt += this.make_spec['required_skills'][i];
			count++;
		}
	}

	count = 0;
	for (var i in this.make_spec['required_tools']){
		var tool = this.make_spec['required_tools'][i].split('|');
		var found = false;
		for(var j in tool){
			if (pc.items_find_working_tool(tool[j]) || tool[j] == 'self'){
				found = true;
				break;
			}
		}
		if (!found){
			can_create = false;
			if (count == 0) {
				txt += '\r\rMissing Required Tools: ';
			}else {
				txt += ', ';
			}
			txt += this.make_spec['required_tools'][i];
			count++;
		}
	}

	if (num_keys(this.make_spec['required_ingredients']) > 0){
		can_create = false;
		txt += '\r\rMissing Required Base Ingredients: ';
		count = 0;
		for (var i in this.make_spec['required_ingredients']){
			if (count != 0) txt += ', ';
			txt += this.make_spec['required_ingredients'][i]+'x '+i;
			count++;
		}
	}

	/*if (this.make_spec['elements'] && this.make_spec['elements']['required_ingredients']){
		if (num_keys(this.make_spec['elements']['required_ingredients']) > 0){
			for (var i in this.make_spec['elements']['required_ingredients']){
				can_create = false;
				if (count == 0) 	txt += '\r\rMissing Required Base Ingredients: ';
				if (count != 0) txt += ', ';
				txt += this.make_spec['elements']['required_ingredients'][i]+'x '+i;
				count++;
			}
		}
	}*/



	if (can_create){
		txt += 'It will use '+this.make_spec['total_energy_cost']+' energy and take '+this.make_spec['wait_ms']/1000+' seconds and reward you with '+this.make_spec['xp_reward']+'xp.';

		var make_list = utils.craftytasking_get_build_spec_list(this.make_spec, 0);
		if (num_keys(make_list) > 0){
			txt += '\r\rI will need to use and make the following:';
			count = 0;
			for (var i in make_list){
				if (count != 0) txt += ', ';
				txt += make_list[i]+'x'+i;
				count++;
			}
		}

		if (this.make_spec['elements'] && this.make_spec['elements']['ingredients']){
			if (num_keys(this.make_spec['elements']['ingredients']) > 0){
				for (var i in this.make_spec['elements']['ingredients']){
					if (count == 0) 	txt += '\r\rI will need to use and make the following:';
					if (count != 0) txt += ', ';
					txt += this.make_spec['elements']['ingredients'][i]['count']+'x '+this.make_spec['elements']['ingredients'][i]['class_tsid'];
					count++;
				}
			}
		}

		var choices = {
			1: {value: 'make', txt: 'Lets do it'},
			2: {value: 'nevermind', txt: 'Nevermind!'}
		};
	}else{
		var choices = {
			1: {value: 'nevermind', txt: 'I can\'t... yet'},
		};
	}

	this.conversation_start(pc, txt, choices);
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

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":0,"y":0,"w":40,"h":40},
		'thumb': null,
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/missing.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "activate",
	"u"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {
	"e"	: "create"
};

log.info("js_test_item.js LOADED");

// generated ok 2012-09-17 11:29:13 by martlume
