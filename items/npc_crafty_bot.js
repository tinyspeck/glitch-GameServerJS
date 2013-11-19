//#include include/takeable.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Crafty Bot";
var version = "1353115112";
var name_single = "Crafty Bot";
var name_plural = "Crafty Bots";
var article = "a";
var description = "A robot that can make stuff for you.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_crafty_bot", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "roam",	// defined by npc_walkable (overridden by npc_crafty_bot)
	"max_fuel"	: "3000",	// defined by npc_crafty_bot
	"default_crystal_hit_points"	: "1000"	// defined by npc_crafty_bot
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.max_step_count = "0";	// defined by npc_crafty_bot
	this.instanceProps.time_multiplier = "1";	// defined by npc_crafty_bot
	this.instanceProps.fuel_level = "3000";	// defined by npc_crafty_bot
	this.instanceProps.crystal_installed_count = "3";	// defined by npc_crafty_bot
	this.instanceProps.crystal_slot_count = "9";	// defined by npc_crafty_bot
	this.instanceProps.crystal_hit_points = "1000";	// defined by npc_crafty_bot
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	max_step_count : ["The number of steps per action"],
	time_multiplier : ["The multiplier of time an action will take (based on regular craft time)"],
	fuel_level : ["How much fuel do we have?"],
	crystal_installed_count : ["How many crystals are installed"],
	crystal_slot_count : ["How many crystal slots are available"],
	crystal_hit_points : ["The hit points left for current crystal. When at 0, destroy a crystal."],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	max_step_count : [""],
	time_multiplier : [""],
	fuel_level : [""],
	crystal_installed_count : [""],
	crystal_slot_count : [""],
	crystal_hit_points : [""],
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

verbs.install_crystal = { // defined by npc_crafty_bot
	"name"				: "install a crystal",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Install a crystal to increase the queue size",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'plain_crystal';
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.isPlayerOwner(pc)){
			return {state: null};
		} 

		if (intval(this.getInstanceProp('crystal_installed_count')) >= intval(this.getInstanceProp('crystal_slot_count'))){
			return {state:'disabled', reason:'No more Crystals can be installed.'};
		}

		if (!pc.items_has('plain_crystal', 1)){
			return {state: 'disabled', reason: "You don't have any Crystals."};
		}
		else{
			return {state: 'enabled'};
		}
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'plain_crystal'){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			this.startMoving();
			pc.sendActivity("You don't have any Crystals!");
			return {
				'ok' : 0,
				'txt' : "You don't have any Crystals!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
			}
					
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			stack.apiDelete();

			this.setInstanceProp('crystal_installed_count', intval(this.getInstanceProp('crystal_installed_count'))+1);
		}
		else{
			return false;
		}

		pc.announce_sound('SAVE_AND_CHECKOUT');
		pc.sendActivity('The Crystal has been installed into the Crafty Bot');

		this.clientUpdate();
	}
};

verbs.kick = { // defined by npc_crafty_bot
	"name"				: "kick",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Am I standing there looking like a goof?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		for (var i in this.queue){
			this.queueIndexSetHalted(i, false);
			this.queueIndexSetPause(i, false);
			this.queueIndexSetLock(i, false);
		}

		pc.announce_sound('CRAFTYBOT_KICK');
		this.queueSetActive(0);
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

verbs.drop = { // defined by npc_crafty_bot
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.pickup = { // defined by npc_crafty_bot
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isPlayerOwner(pc)){
			return {state: 'disabled', reason:'This isn\'t your Crafty Bot.'};
		} 

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.refuel = { // defined by npc_crafty_bot
	"name"				: "refuel",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Add more fuel. Current level: $fuel_level\/$max_fuel",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Add fuel",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'fuel_cell';
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.isPlayerOwner(pc)){
			return {state: null};
		} 

		if (intval(this.getInstanceProp('fuel_level')) >= intval(this.getClassProp('max_fuel'))){
			return {state:'disabled', reason:'No more fuel is needed.'};
		}

		if (!pc.items_has('fuel_cell', 1)){
			return {state: 'disabled', reason: "You don't have any fuel cells."};
		}
		else{
			return {state: 'enabled'};
		}
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'fuel_cell'){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			this.startMoving();
			pc.sendActivity("You don't have any fuel cells!");
			return {
				'ok' : 0,
				'txt' : "You don't have any fuel cells!",
			};
		}
	},
	"effects"			: function(pc){

		return {
			fuel_level: this.getInstanceProp('fuel_level'),
			max_fuel: this.getClassProp('max_fuel')
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
			}
					
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			stack.apiDelete();

			log.info('CRAFTYBOT -- '+this+' -- Refuel'); 

			this.setInstanceProp('fuel_level', this.getInstanceProp('fuel_level')+(msg.target_item_class_count * 500));
			if (this.getInstanceProp('fuel_level') > this.getClassProp('max_fuel')) this.setInstanceProp('fuel_level', this.getClassProp('max_fuel'));

			for (var i in this.queue){
				this.queueIndexSetHalted(i, false);
			}
		}
		else{
			return false;
		}

		this.clientUpdate();

		this.craftResume();

		var pre_msg = this.buildVerbMessage(msg.count, 'refuel', 'refueled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.teach = { // defined by npc_crafty_bot
	"name"				: "teach",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Teach the robot a new skill",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// Disabling for now.
		return {state: null};

		if (!this.isPlayerOwner(pc)){
			return {state: null};
		} 

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var question = "What skill would you like to teach me?";

		var player_skills = {};
		var skill;
		var recipes;
		var name;
		for (var i in pc.skills.skills){
			if (this.learned_skills && this.learned_skills[i]) continue;

			recipes = get_recipe_ids_for_skill(i);
			if (recipes.length == 0) continue;

			skill = pc.skills_get(i);
			if (skill){
				if (player_skills[skill.name] && player_skills[skill.name].level < skill.level){
					// Only add the lowest level skill to the set.
					continue;
				}

				name = skill.name;
				if (skill.level > 0){
					name += ' '+skill.level;		
				}

				player_skills[skill.name] = {'name':name, 'level': skill.level, 'skill_id':i};
			}
		}

		var choices = [];
		for (var i in player_skills){
			choices.push({txt: player_skills[i]['name'], value: 'teachskill::'+player_skills[i]['skill_id']});
		}

		if (choices.length == 0){
			this.sendBubble('You don\'t have any new skills to teach me.', 5*1000);
		}else{
			return this.conversation_reply(pc, 'teachskill', question, choices, null, null, null, null, true);
		}
	}
};

verbs.stop_crafting = { // defined by npc_crafty_bot
	"name"				: "Stop Crafting",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Stop the robot from crafting",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// Disabling
		return {state: null};

		if (!this.isPlayerOwner(pc)){
			return {state: null};
		} 

		if (this.isCrafting()) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.craftCancel(false);
	}
};

verbs.craft = { // defined by npc_crafty_bot
	"name"				: "craft",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Start crafting an item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isPlayerOwner(pc)){
			return {state: 'disabled', reason:'This isn\'t your Crafty Bot.'};
		} 

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({type: 'craftybot_start'});
		this.owner = pc;
		this.clientUpdate();
	}
};

function autoRefuel(){ // defined by npc_crafty_bot
	if (this.canAutoRefuel()){

		log.info('CRAFTY [ '+this+'] -- autoRefuel'); 

		this.refuelling = true;
		this.moveToTarget('fuel_cell');

		return {'ok':1};
	}

	return {'ok':0, 'error':'Could not refuel'};
}

function buildShoppingListStep(spec, multiplier, ignore_source_item){ // defined by npc_crafty_bot
	if (!this.shopping_list) this.shopping_list = {};

	//
	// Determine how many items in the ingredientSource we can use
	//
	var source_count = 0;
	if (!ignore_source_item){
		source_count = this.ingredientSourceCountItem(spec['class_tsid']);
	}

	//
	// If we need to craft something, due to not having enough in the ingredientSource (or ignoring it), craft
	//
	if (spec['ingredients'] && (ignore_source_item || source_count < (spec['count'] * multiplier))){

		//
		// How many items from the ingredientSource can we use? We can then craft the rest
		//
		var source_items_used = 0;
		if (!ignore_source_item){
			source_items_used = Math.floor(source_count / spec['count']) * spec['count'];
			if (source_items_used > 0){
				if (!this.shopping_list[spec['class_tsid']]) this.shopping_list[spec['class_tsid']] = 0;
				this.shopping_list[spec['class_tsid']] += source_items_used;
			}
		}

		//
		// Determine how many items we need to craft, and setup their shopping lists.
		//
		for (var i in spec['ingredients']){
			this.buildShoppingListStep(spec['ingredients'][i], multiplier - source_items_used);
		}

		return;
	}

	//
	// Add the items to the shopping list, inless they are elements, as they are fetched seperately
	//
	if (spec['class_tsid'] != 'element_shiny' && 
	    spec['class_tsid'] != 'element_green' && 
	    spec['class_tsid'] != 'element_blue' && 
	    spec['class_tsid'] != 'element_red'){
		if (!this.shopping_list[spec['class_tsid']]) this.shopping_list[spec['class_tsid']] = 0;

		this.shopping_list[spec['class_tsid']] += spec['count'] * multiplier;
	}
}

function canAutoRefuel(){ // defined by npc_crafty_bot
	if (intval(this.getInstanceProp('fuel_level')) < intval(this.getClassProp('max_fuel'))){
		var location = this.getLocation();
		var items = location.find_items_including_bags('fuel_cell');
		if (items && items[0]){
			return true;
		}
	}
	return false;
}

function canCraft(sequenceIndex){ // defined by npc_crafty_bot
	if (sequenceIndex == undefined) return;

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];

	//
	// Verify we have the required ingredients in our holder
	//
	for (var i in step.data.ingredient_class){
		var count = this.queueItemCountHolding(this.active_queue_index, step.data.ingredient_class[i]);
	//	if (this.crafting_holder[step.data.ingredient_class[i]] && this.crafting_holder[step.data.ingredient_class[i]]['count']){
	//		count = this.crafting_holder[step.data.ingredient_class[i]]['count'];
	//	}
		if (count < step.data.ingredient_count[i]){
			log.info('CRAFTY ['+this+'] - canCraft -- Missing: '+step.data.ingredient_class[i]+' x'+step.data.ingredient_count[i]);
			// We are missing some ingredients
			return {ok:0, error:'no_ingredient_found', data:{'class_tsid':step.data.ingredient_class[i]}};
		}
	}

	//
	// Verify we have the required tools in our holder
	//
	if (step.data.tool){
		var has_tool = false;
		var tools = step.data.tool.split('|');
		for (var i in tools){
	//		if (this.crafting_holder[tools[i]]){
			if (this.queueItemCountHolding(this.active_queue_index, tools[i]) > 0){
				has_tool = true;
				break;
			}
		}
		if (!has_tool){
			log.info('CRAFTY ['+this+'] - canCraft -- Missing tool: '+step.data.tool);
			return {ok:0, error:'no_tool_found', data:{'class_tsid':step.data.tool}};
		}
	}

	return {ok:1};
}

function canDrop(pc, drop_stack){ // defined by npc_crafty_bot
	if (pc.houses_get_interior_street() && pc.houses_get_interior_street() == pc.getLocation()){
		return {ok: 1};
	}

	return {ok: 0};
}

function canFetch(class_tsid, args){ // defined by npc_crafty_bot
	var item = this.findItem(class_tsid, args);
	if (item){
		return {'ok': 1};
	}

	return {'ok': 0};
}

function clientHandleMessage(pc, msg){ // defined by npc_crafty_bot
	if (pc != this.owner){
		pc.apiSendMsg(make_fail_rsp(msg));
		return;
	}

	log.info('CRAFTY ['+this+'] -- CLIENT MESSAGE: '+msg);

	switch (msg.type){
		case 'craftybot_add':{
			pc.apiSendMsg(make_ok_rsp(msg));

			// Client sends the desired total, not how many to add, so we'll need to add the difference
			var current_count = 0;
			for (var i in this.queue){
				if (this.queue[i].item_class == msg.item_class){
					current_count = this.queue[i].count;
					break;
				}
			}

			var dif = msg.count - current_count;

			if (dif > 0){
				this.queueAdd(msg.item_class, dif);
			}else{
				this.queueRemove(msg.item_class, Math.abs(dif));
			}
			break;
		}
		case 'craftybot_remove':{
			pc.apiSendMsg(make_ok_rsp(msg));
			this.distributeCraftedItems(msg.item_class, msg.count);
			this.queueRemove(msg.item_class, msg.count);
			break;
		}
		case 'craftybot_cost':{
			var sequence = utils.craftytasking_build_sequence(this, utils.craftytasking_get_build_spec(this, msg.item_class, 1), msg.count, {});
			var components = [];
			var component;
			var fuel_cost = -1;
			var crystal_cost = -1;
			for (var i in sequence){
				component = null
				if (sequence[i].type == 'fetch_ingredient' || sequence[i].type == 'fetch_tool'){
					component = {};
					component.type = 'fetch';
					component.item_classes = [sequence[i].data.class_id];
					component.counts = [sequence[i].data.count];
					component.counts_missing = [Math.max(0, sequence[i].data.count-sequence[i].data.source_count)];
					component.status_txt = '';
					component.can_start = true;
					if (component.counts_missing[0] >0){
						component.status = 'missing';
					}else{
						component.status = 'pending';
					}
				}else if (sequence[i].type == 'craft'){
					component = {};
					component.type = 'craft';
					component.item_classes = sequence[i].data.class_id;
					component.counts = sequence[i].data.count;
					component.counts_missing = [0];
					component.tool_class = sequence[i].data.tool;
					component.status_txt = '';
					component.can_start = true;
					component.status = 'pending';
				}else if (sequence[i].type == 'craft_complete'){
					fuel_cost = [sequence[i].data.fuel_cost];
				}
				if (component){
					components.push(component);
				}
			}

			var rsp = make_rsp(msg);
			rsp.item_class = msg.item_class; 
			rsp.fuel_cost = fuel_cost;
			rsp.crystal_cost  = crystal_cost;
			rsp.components = components;
			pc.apiSendMsg(rsp);
			break;
		}
		case 'craftybot_pause':{
			var queue_index = this.queueIndexForClass(msg.item_class);
			if (queue_index >= 0){
				this.queueIndexSetPause(queue_index, msg.is_pause);
				if (!msg.is_pause && this.active_queue_index == queue_index){
					this.craftStep(this.queue[this.active_queue_index].active_sequence_index);
				}
			}
			pc.apiSendMsg(make_ok_rsp(msg));
			break;
		}
		case 'craftybot_lock':{
			var queue_index = this.queueIndexForClass(msg.item_class);
			if (queue_index >= 0){
				this.queueIndexSetLock(queue_index, msg.is_lock);
			}
			pc.apiSendMsg(make_ok_rsp(msg));
			break;
		}
		case 'craftybot_refuel':{
			this.autoRefuel();
			pc.apiSendMsg(make_ok_rsp(msg));
			break;
		}
		default:{
			pc.apiSendMsg(make_fail_rsp(msg));
			break;
		}
	}
}

function clientUpdate(){ // defined by npc_crafty_bot
	if (!this.owner) return;

	var msg = {
		type: 'craftybot_update',
		jobs: [],
		jobs_max: this.queueSizeMax(),
		crystal_count: this.getInstanceProp('crystal_installed_count'),
	 	crystal_max: this.getInstanceProp('crystal_slot_count'),
	 	fuel_count: this.getInstanceProp('fuel_level'),
	 	fuel_max: this.getClassProp('max_fuel'),
		can_refuel: this.canAutoRefuel()
	};

	var job;
	var missing = {};
	var has = {};
	var status_text = '';

	for (var i in this.queue){

		status_text = '';

		has = utils.copy_hash(this.queue[i].ingredients);
		for (var j in this.queue[i].tools){
			has[j] = this.queue[i].tools[j];	
		}

		missing = utils.copy_hash(this.queue[i].missing_ingredients);
		for (var j in this.queue[i].missing_tools){
			missing[j] = this.queue[i].missing_tools[j];
		}
		
		var status = this.queueIndexStatus(i);

		if (status.complete){
			status_text = 'Complete';
		}else if (status.queue_halted){
			status_text = 'Job Halted';
		}else if (status.scan_status == 'active'){
			status_text = 'Crafting '+status.craftable_count+'/'+status.queue_count;
		}else if (status.scan_status == 'scan_pending'){
			status_text = 'Pending';
		}else{
			status_text = 'Waiting';
		}

		job = {};
		job.item_class = this.queue[i].item_class;
		job.done = status.completed_count;
		job.total = status.queue_count;
		job.craftable_count = status.craftable_count;
		job.status = {
			is_complete: (status.complete == true),
			is_active: (!status.complete && status.scan_status == 'active'),
			is_missing: false,
			is_paused: status.queue_paused, 
			is_locked: status.queue_locked, 
			is_halted: status.queue_halted, 
			txt: status_text
		};

		job.components = [];
		var component ;
		var component_status;
		var component_type;
		var component_missing_count;
		var count;
		var item_class;
		var tool_class;
		var sequence_status_text;
		var item_class_tsid;
		for (var j in this.queue[i].craft_sequence){
			sequence_status_text = '';
			switch (this.queue[i].craft_sequence[j].type){
				case 'fetch_ingredient':
				case 'fetch_tool':{
					item_class_tsid = this.queue[i].craft_sequence[j].data.class_id;
					component_type = 'fetch';
					item_class = [this.queue[i].craft_sequence[j].data.class_id];
					tool_class = '';
					count = [this.queue[i].craft_sequence[j].data.count];
					var tmp_count = missing[this.queue[i].craft_sequence[j].data.class_id];
					if (!tmp_count) tmp_count = 0;
					component_missing_count = [tmp_count];
					break;
				};
				case 'craft':{
					item_class_tsid = this.queue[i].craft_sequence[j].data.class_id[0];
					component_type = 'craft';
					item_class = this.queue[i].craft_sequence[j].data.class_id;
					tool_class = this.queue[i].craft_sequence[j].data.tool;
					count = this.queue[i].craft_sequence[j].data.count;
					var tmp_count = missing[this.queue[i].craft_sequence[j].data.class_id[0]];
					if (!tmp_count) tmp_count = 0;
					component_missing_count = [tmp_count];
					break;
				}
				default:{
					continue;
				}
			}

			var can_step = this.queue[i].craft_sequence[j].can_step;
			if (status.complete){
				component_status = 'complete';
				sequence_status_text = '';
				can_step = true;
			}else{
				component_status = 'pending';
				if (this.queue[i].craft_sequence[j].can_step){
					if (this.queue[i].active_sequence_index == j && status.queue_halted){
						sequence_status_text = 'You\'ll need more fuel to continue this job.';
						component_status = 'halted';
					}else	if (component_missing_count > 0){
						component_status = 'missing';
						if (item_class_tsid){
							sequence_status_text = 'You are missing '+utils.get_string_list_from_class_tsid(item_class_tsid, component_missing_count);
						}
					}else if (this.active_queue_index == i){
						sequence_status_text = '';
						if (this.queue[this.active_queue_index].active_sequence_index > j){
							component_status = 'complete';
						}else if (this.queue[i].active_sequence_index == j){
							component_status = 'active';
						}
					}
				}else{
					if (component_missing_count > 0){
						component_status = 'missing';
						if (item_class_tsid){
							sequence_status_text = 'You are missing '+utils.get_string_list_from_class_tsid(item_class_tsid, component_missing_count);
						}
					}
				}
			}

			component = {};
			component.item_classes = item_class;
			component.tool_class = tool_class;
			component.counts = count;
			component.counts_missing = component_missing_count;
			component.type = component_type;
			component.status = component_status;
			component.can_start = can_step;
			component.status_txt = sequence_status_text;

			job.components.push(component);
		}


		msg.jobs.push(job);
	}

	this.owner.apiSendMsg(msg);

	// Returning for testing purposes
	return msg;
}

function collapse(callback, params){ // defined by npc_crafty_bot
	if (!this.isInLocation()) this.apiSetTimerX(callback, 300, params);
	if (this.collapsed) return false;

	this.collapsed = true;
	this.setAndBroadcastState('collapse');

	var location = this.getLocation();	
	location.announce_sound_to_all('CRAFTYBOT_COLLAPSE');

	this.apiSetTimerX(callback, 3.4*1000, params);

	return true;
}

function completedFullCrafting(){ // defined by npc_crafty_bot
	var step = this.queue[this.active_queue_index].craft_sequence[this.queue[this.active_queue_index].active_sequence_index];
	//if (this.crafting_holder[step.data.class_id]){
	if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) > 0){
		return true;
	}

	return false;
}

function craftCancel(continue_iteration){ // defined by npc_crafty_bot
	// Drop what we are holding
	this.craftDropItems();
	this.craftDone(continue_iteration);
}

function craftDone(continue_iteration){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] -- craftDone: '+this.queue[this.active_queue_index].item_class);

	this.is_crafting = false;

	this.apiCancelTimer('craftStep');

	//
	// Show any hidden tools
	//
	this.toggleActiveToolVisibility(null, true);
	this['!crafting_tool'] = null;

	//
	// Stop moving
	//
	this.stopMoving();

	//
	// Update state
	//
	this.broadcastConfig();

	//
	// Update data
	//
	delete this.move_target;

	//
	// Rebuild the sequence
	//
	this.craftSequenceRebuild(this.active_queue_index);

	//
	// Update the client
	//
	this.clientUpdate();

	//
	// Iterate to the next in the queue
	//
	if (!continue_iteration || !this.queueIterate()){
		// Nothing to iterate to, so idle
		this.setState('idle');
	}
}

function craftDropItems(){ // defined by npc_crafty_bot
	if (!this.queue) {
		log.info('CRAFTY ['+this+'] -- craftDropItems: didnt have this.queue');
		return;
	}
	if (!this.queue[this.active_queue_index]){
		log.info('CRAFTY ['+this+'] -- craftDropItems: didnt have this.queue[this.active_queue_index]');
		return;
	}
	if (!this.queue[this.active_queue_index].holder){
		log.info('CRAFTY ['+this+'] -- craftDropItems: didnt have this.queue[this.active_queue_index].holder');
		return;
	}
	if (!this.queue[this.active_queue_index].holder['general']){
		log.info('CRAFTY ['+this+'] -- craftDropItems: didnt have !this.queue[this.active_queue_index].holder[general])');
		return;
	}
		
	log.info('CRAFTY ['+this+'] -- craftDropItems: '+this.queue[this.active_queue_index].holder['general']);

	var container = this.getIngredientSource();

	if (!this.dropped_items) this.dropped_items = {};

	//
	// Drop what we are currently holding
	//
	for (var i in this.queue[this.active_queue_index].holder['general']){
		if (!this.queue[this.active_queue_index].holder['general'][i]['tsid']){
			this.dropped_items[i] = this.queue[this.active_queue_index].holder['general'][i]['count'];

			if (this.isInLocation()){
				if (this.owner && (i == 'element_red' || i == 'element_blue' || i == 'element_green' || i == 'element_shiny')){
					// Instead of dropping, we give iMG to the player
					this.owner.stats_add_xp(this.queue[this.active_queue_index].holder['general'][i]['count'] / 20, false, {'craftybot':'disperse', 'class_id':i});
				}else{
					log.info('CRAFTY ['+this+'] - dropping: '+this.queue[this.active_queue_index].holder['general'][i]['count']+'x '+i);
					container.createItemStack(i, this.queue[this.active_queue_index].holder['general'][i]['count'], this.x, this.y);
				}
			}else{
				log.info('CRAFTY ['+this+'] - dropping into pack: '+this.queue[this.active_queue_index].holder['general'][i]['count']+'x '+i);
				container.createItem(i, this.queue[this.active_queue_index].holder['general'][i]['count'], false);
			}
		}
	}

	this.toggleActiveToolVisibility(null, true);

	this.queue[this.active_queue_index].holder['general'] = {};
}

function craftGetComment(sequenceIndex){ // defined by npc_crafty_bot
	if (sequenceIndex == null || !this.queue[this.active_queue_index].craft_sequence[sequenceIndex]) return '';

	var previous_step = null;
	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	if (sequenceIndex > 0){
		previous_step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex-1];
	}

	if (previous_step && previous_step.type == 'craft'){
		return '';
	}

	if (step.type == 'fetch_tool' || step.type == 'fetch_ingredient' || step.type== 'fetch_machine' || step.type == 'craft'){
		var location = this.getLocation();

		location.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			duration: 2500,
			width: 40,
			height: 40,
			delta_y: 50,
			item_class: step.data.class_id,
			follow: true,
			allow_bubble: true,
			bubble: true,
			uid: this+'_itemoverlay'
		});
	}

	return '';


	var proto_item 				= null;
	var proto_item_count 		= 0;
	var proto_item_next 			= null;
	var proto_item_next_count 	= 0;
	var proto_item_previous 		= null;
	var proto_item_previous_count = 0;

	var item_name				= '';
	var item_article				= '';
	var item_name_previous		= '';
	var item_article_previous		= '';
	var item_name_next			= '';
	var item_article_next			= '';

	log.info('Getting comment for '+step.data.class_id);

	function getItemName(tmp_step){
		var item_name = '';

		if (tmp_step.type != 'craft' && tmp_step.type != 'use_machine'){
			var class_id = [tmp_step.data.class_id];
		}else{
			var class_id = tmp_step.data.class_id;
		}

		for (var i in class_id) {
			log.info ('apiFindItemPrototype: '+class_id[i]);
			proto_item = apiFindItemPrototype(class_id[i]);
			proto_item_count = tmp_step.data.count;

			if (item_name != ''){
				if (i == class_id.length-1){
					item_name += ' and ';
				}else{
					item_name += ', ';
				}
			}

			if (proto_item_count == 1){
				if (tmp_step.type != 'fetch_tool' && tmp_step.type != 'fetch_machine'){
					item_name += proto_item.article+' ';
				}else{
					item_name += 'the ';
				}
				item_name += proto_item.name_single;
			}else{
				if (tmp_step.type != 'fetch_tool' && tmp_step.type != 'fetch_machine'){
					item_name += 'some ';
				}else{
					item_name += 'the ';
				}
				item_name += proto_item.name_plural;
			}
		}

		return item_name;
	}

	item_name = getItemName(step);
	if (previous_step){
		item_name_previous = getItemName(previous_step);
	}


	if (step.type != 'craft_complete' && item_name == item_name_previous){
		return null;
	}

	var choices = null;

	switch (step.type){
		case 'fetch_tool':{
			if (proto_item_previous){
				// item->tool
				choices = [	'Ok, now I have '+item_name_previous+'. Where did I see the '+item_name+'?',
							'Ok. Now to use the '+item_name+'.'];
			}else{
				// first tool
				choices = [	'Where\'s the '+item_name+'?',
							'I need the '+item_name+'.'];
			}
			break;
		}
		case 'fetch_ingredient':{
			if (proto_item_previous){
				// item->item
				choices = [	'Ok, here\'s '+item_name_previous+'. Now where did I see '+item_name+'?',
							'Got it. Now I need '+item_article+' '+item_name+'.'];
			}else{
				// first item
				choices = [	'Where did I last see '+item_name+'?',
							'Ok, I need '+item_name+'.'];
			}
			break;
		}
		case 'fetch_machine':{
			choices = [	'Fetching machine '+item_name+'.'];
			break;
		}
		case 'using_machine':{
			choices = [	'Using machine to create '+item_name+'.'];
			break;
		}
		case 'craft':{
			break;
		}
		case 'craft_complete':{
			choices = [	'I have finshed crafting you '+item_name+'.'];

			break;
		}
	}

	if (choices){
		return choose_one(choices);
	}
}

function craftItemFromQueue(queue_index, requested){ // defined by npc_crafty_bot
	if (!this.queue) return false;

	if (queue_index == undefined) return false;
	if (queue_index >= this.queue.length) return false;

	var queue_entry = this.queue[queue_index];
	if (!queue_entry) return false;

	if (this.queueIndexIsComplete(queue_index)) return false;

	this.is_crafting = false;


	this.queue[this.active_queue_index].active_sequence_index = 0;

	log.info('CRAFTY ['+this+'] -- craftItemFromQueue: '+queue_entry.item_class+' x'+queue_entry.count);

	//
	// Start crafting the first step
	//
	this.craftStep(0);

	return true;
}

function craftResume(){ // defined by npc_crafty_bot
	if (this.isCrafting()) return;

	this.craftStep(this.queue[this.active_queue_index].active_sequence_index);
}

function craftSequenceRebuild(queue_index){ // defined by npc_crafty_bot
	var sequence_status;
	var queueItem = this.queue[queue_index];
	if (!queueItem.count_crafted) queueItem.count_crafted = 0;

	//if (this.queueIndexStatus(queue_index).scan_status == 'active'){
	if (this.queue[queue_index].active_sequence_index){
		log.info('CRAFTY ['+this+'] -- craftSequenceRebuild: '+queue_index+' -- skipping because it\'s active');
		return;
	}

	log.info('CRAFTY ['+this+'] -- craftSequenceRebuild: '+queue_index+' -- indexStatus: '+this.queueIndexStatus(queue_index).scan_status);

	var holder = {};
	if (queueItem.holder && queueItem.holder.general){
		holder = queueItem.holder.general;	
	}

	if (queueItem.count-queueItem.count_crafted > 0){
		var spec = utils.craftytasking_get_static_build_spec(queueItem.item_class);
		queueItem.craft_sequence = utils.craftytasking_build_sequence(this, spec, queueItem.count-queueItem.count_crafted, holder);
	}
	sequence_status = utils.craftytasking_get_sequence_status(queueItem.craft_sequence);
	queueItem.status = sequence_status;

	queueItem.ingredients = queueItem.craft_sequence[queueItem.craft_sequence.length-1].data.ingredients;
	queueItem.missing_ingredients = queueItem.craft_sequence[queueItem.craft_sequence.length-1].data.missing_ingredients;
	queueItem.tools = queueItem.craft_sequence[queueItem.craft_sequence.length-1].data.tools;
	queueItem.missing_tools = queueItem.craft_sequence[queueItem.craft_sequence.length-1].data.missing_tools;
}

function craftSequenceRebuildAll(){ // defined by npc_crafty_bot
	for (var i in this.queue){
		this.craftSequenceRebuild(i, false);
	}

	this.clientUpdate();
}

function craftStep(sequenceIndex){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] -- craftStep: '+sequenceIndex+' for '+this.active_queue_index);

	if (!this.queue[this.active_queue_index].craft_sequence) return false;

	//
	// Check if this queue_index has been paused
	//
	if (this.queue[this.active_queue_index].paused || this.queue[this.active_queue_index].locked || this.queue[this.active_queue_index].halted){
		return false;
	}

	//
	// Grab the current step and update the active_sequence_index
	//
	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	if (!step) return false;
	this.queue[this.active_queue_index].active_sequence_index = sequenceIndex;

	// Check if we can perform this step
	//
	if (!step.can_step){
		log.info('CRAFTY -- cantStep: '+step);
		this.apiSetTimerX('craftStep', 10, sequenceIndex+1);
		return false;
	}

	this.is_crafting = true;

	//
	// Update the client for the new step
	//
	this.clientUpdate();

	//
	// Fuel check
	//
	if (step.data && step.data.fuel_cost && step.type != 'craft_complete'){
		var fuel_level = this.getInstanceProp('fuel_level');
		if (fuel_level < step.data.fuel_cost){
			if (this.owner){
				this.owner.prompts_add_simple('Your Crafty Bot has run out of fuel. All active jobs have been halted.', 5*1000);
			}
			this.queueIndexSetHalted(this.active_queue_index, true);
			this.clientUpdate();
			this.apiSetTimerX('queueIterate', 10);
			return false;
		}
		fuel_level = fuel_level - step.data.fuel_cost;
		this.setInstanceProp('fuel_level', fuel_level);
	}

	//
	// Set the crafting_tool for display in the client
	//
	if (step.data && step.data.tool || step.data && step.data.machine) {
		var tool = step.data.tool || step.data.machine;
		var tools = tool.split('|');
		this['!crafting_tool'] = tools[0];
		this.broadcastConfig();
	}

	//
	// If we are not about to craft, put back the tool we are holding (is invisible)
	//
	if (step.type != 'craft'){
		this.toggleActiveToolVisibility(null, true);
	}

	switch (step.type){
		case 'fetch_tool':
		case 'fetch_ingredient':{
			
			// If we're not already holding the tool or ingredient, fetch it.
			if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) < step.data.count){
				var ret = this.canFetch(step.data.class_id);
				if (ret['ok'] == 1){
					this['!walk_target'] = 'craft';
					this.setState('fetch');
				}else{
					this.craftStepIterate();
				}
			}else{
				this.craftStepIterate();
			}
			return true;
			break;
		}
		case 'fetch_machine':{

			var ret = this.canFetch(step.data.class_id);
			if (ret['ok'] == 1){
				this['!walk_target'] = 'machine';
				this.setState('fetch');
			}else{
				this.craftStepIterate();
			}
			return true;
			break;
		}
		case 'use_machine':{

			this.setState('use_machine');
			return true;
			break;
		}
		case 'craft':{

			var ret = this.canCraft(sequenceIndex);
			log.info('CRAFTY ['+this+'] -- craftStep: craft: '+ret['ok']);
			if (ret['ok'] == 1){
				this.setState('craft');
			}else{
				this.craftStepIterate();
			}
			return true;
			break;
		}
		case 'craft_complete':{

			this.setState('craft_complete');
			return true;
			break;
		}
	}

	log.error('Craftybot - Invalid Step Type: '+step.type);
	return false;
}

function craftStepIterate(){ // defined by npc_crafty_bot
	this.apiSetTimerX('craftStep', 300, this.queue[this.active_queue_index].active_sequence_index+1);
}

function distributeCraftedItems(class_tsid, count){ // defined by npc_crafty_bot
	//
	// Remove the item from the crafting_holder and distribute to the player.
	//
	for (var i in this.queue){
		if (this.queue[i].item_class == class_tsid){
			//var items_crafted = Math.min(this.queue[i].count_crafted, count);
			var item_count = this.queueItemUnhold(i, class_tsid, count, 'complete');
			if (item_count > 0){
				this.owner.createItemFromSource(class_tsid, item_count, this, false);
				this.queue[i].count_crafted -= item_count;
			}
		}
	}
}

function doCraft(sequenceIndex){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] - doCraft: '+sequenceIndex);

	if (sequenceIndex == undefined) return;

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	var message = this.craftGetComment(sequenceIndex);

	//
	// Verify we have the required ingredients in our holder
	//
	for (var i in step.data.ingredient_class){
		var count = this.queueItemCountHolding(this.active_queue_index, step.data.ingredient_class[i]);
		
		if (count < step.data.ingredient_count[i]){
			log.info('CRAFTY ['+this+'] - doCraft -- Missing: '+step.data.ingredient_class[i]+' x'+step.data.ingredient_count[i]);
			// We are missing some ingredients
			this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex+1);
			return {ok:0, error:'no_ingredient_found', data:{'class_tsid':step.data.ingredient_class[i]}};
		}
	}

	//
	// Verify we have the required tools in our holder
	//
	if (step.data.tool){
		var has_tool = false;
		var tools = step.data.tool.split('|');
		for (var i in tools){
			if (this.queueItemCountHolding(this.active_queue_index, tools[i]) > 0){
				has_tool = true;
				break;
			}
		}
		if (!has_tool){
			log.info('CRAFTY ['+this+'] - doCraft -- Missing tool: '+step.data.tool);
			this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex+1);
			return {ok:0, error:'no_tool_found', data:{'class_tsid':step.data.tool}};
		}
	}

	//
	// Start crafting, destroying the ingredients
	//
	for (var i in step.data.ingredient_class){
		var count = this.queueItemCountHolding(this.active_queue_index, step.data.ingredient_class[i]);
		if (count >= step.data.ingredient_count[i]){
			this.queueItemUnhold(this.active_queue_index, step.data.ingredient_class[i], step.data.ingredient_count[i]);
		}
	}		

	if (this.isInLocation()){
		this.setAndBroadcastState('craft');
	}

	//
	// Wear the current tool. Returns any unallocated wear, and if so, we need to fail.
	//
	log.info('step.data.tool: '+step.data.tool);
	var wear_left = this.wearTool(step.data.tool_wear, step.data.tool);

	// Remove the tool from our hands
	this.queueItemUnhold(this.active_queue_index, step.data.tool, 1);

	if (wear_left > 0){
		this.sendCraftyMessage('I broke it and I wasn\'t done with it!', 3*1000);
		return;
	}

	//
	// Create the crafted item(s)
	//
	for (var i in step.data.class_id){
		var count = step.data.count[i];
		this.queueItemHold(this.active_queue_index, step.data.class_id[i], count);
	}

	if (message){
		this.sendCraftyMessage(message, step.data.duration);	
	}

	this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex+1);
}

function doCraftComplete(sequenceIndex){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] - doCraftComplete: holding '+this.crafting_holder);

	if (sequenceIndex == undefined) {
		this.craftDone(true);
		return;
	}

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	var message = this.craftGetComment(sequenceIndex);

	delete this.queue[this.active_queue_index].active_sequence_index;
	this.craftSequenceRebuild(this.active_queue_index);

	if (step.data){
		var count = this.queueItemCountHolding(this.active_queue_index, step.data.class_id);
		if (count == 0){
			this.craftDone(true);
			return;
		}

		//
		// Burn the crystals
		//
		this.setInstanceProp('crystal_hit_points', Math.max(intval(this.getInstanceProp('crystal_hit_points')) - count, 0));
		if (this.getInstanceProp('crystal_hit_points') <= 0){
			this.setInstanceProp('crystal_installed_count', Math.max(0, intval(this.getInstanceProp('crystal_installed_count')) - 1));
			this.setInstanceProp('crystal_hit_points', this.getClassProp('default_crystal_hit_points'));
			this.sendBubble('A crystal has burnt out.');
		}

		//
		// Switch holding categories
		//
		this.queueItemUnhold(this.active_queue_index, step.data.class_id, count);
		this.queueItemHold(this.active_queue_index, step.data.class_id, count, 'complete');
		if (!this.queue[this.active_queue_index].count_crafted) this.queue[this.active_queue_index].count_crafted = 0;
		this.queue[this.active_queue_index].count_crafted += count;

		this.craftDone(true);
	}else{
		this.craftDone(true);
	}
}

function doFetch(sequenceIndex){ // defined by npc_crafty_bot
	if (sequenceIndex == undefined) return;

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	var message = this.craftGetComment(sequenceIndex);

	if (message){
		this.sendCraftyMessage(message, 2000);	
	}

	//
	// If in a player's pack, find the item and add it to the inventory
	//
	if (!this.isInLocation()){
		var item = this.findItem(step.data.class_id, null);
		if (!item){
			this.apiSetTimerX('craftStep', 1*1000, sequenceIndex+1);
			return;
		}
		switch (step.type){
			case 'fetch_ingredient':{
				var picked_up = this.pickupStack(item.tsid, step.data.count);
				if (picked_up == 0) return;
				if (picked_up < step.data.count){
					this.apiSetTimerX('craftStep', 300, sequenceIndex);
				}else{
					this.apiSetTimerX('craftStep', 1*1000, sequenceIndex+1);
				}
				break;
			}
			case 'fetch_tool':{
				this.queueItemHold(this.active_queue_index, item.class_tsid, 1, null, item.tsid);
				this.apiSetTimerX('craftStep', 1*1000, sequenceIndex+1);
				break;
			}
		}
		return;
	}

	//
	// We are in a location... are we already holding the item?
	//
	if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) >= step.data.count){
		//
		// Yes, next step
		//
		this.apiSetTimerX('craftStep', 1*1000, sequenceIndex+1);
	}else{
		//
		// No, we need to fetch it
		//
		var args = {};
		if (step.data.tool_wear){
			args['tool_wear'] = step.data.tool_wear;
		}
		
		var ret = this.moveToTarget(step.data.class_id, args);
		if (ret['ok'] != 1){
			// Could not move to the target, so continue
			this.apiSetTimerX('craftStep', 1*1000, sequenceIndex+1);
		}
	}
}

function doFetchMachine(sequenceIndex){ // defined by npc_crafty_bot
	if (sequenceIndex == undefined) return;

	if (!this.isInLocation()){
		this.sendCraftyMessage('I can\'t use machines while I\'m in your pack.', 5000);
		this.craftCancel(true);
		return;
	}

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	var message = this.craftGetComment(sequenceIndex);

	if (message){
		this.sendCraftyMessage(message, 2000);	
	}

	var machine_found = false;
	var location = this.getLocation();

	var machines = location.find_items(step.data.class_id);
	for (var j in machines){
		if (!machines[j].getContentCount || machines[j].getContentCount() > 0){
			// Machine cannot be empty

			machine_found = true;

			if (message){
				this.sendBubble(message, 2000);	
			}

			this.move_target = machines[j].tsid;
			if (machines[j].x + 100 < this.x || machines[j].x - 100 > this.x){
				log.info('CRAFTY -- apiFindPath to '+step.data.class_id+' at '+machines[j].x+'x'+this.y);
				this.apiFindPath(machines[j].x, this.y, 0, 'onPathing');
			}else{
				this.onDonePathing();
			}
		}
	}
}

function doUseMachine(sequenceIndex){ // defined by npc_crafty_bot
	if (sequenceIndex == undefined) return;

	this.setState('idle');

	var step = this.queue[this.active_queue_index].craft_sequence[sequenceIndex];
	var message = this.craftGetComment(sequenceIndex);

	if (message){
		this.sendCraftyMessage(message, 2000);	
	}

	var machine;
	if (this.move_target){
		machine = apiFindObject(this.move_target);
	}

	var duration = step.data.duration;

	switch (step.data.machine){
		case 'meat_collector':{
			if (step.data.class_id == 'meat'){
				var left = machine.takeMeat(step.data.count);

	//			if (!this.crafting_holder[step.data['class_id']]) this.crafting_holder[step.data['class_id']] = {};
	//			if (!this.crafting_holder[step.data['class_id']]['count']) this.crafting_holder[step.data['class_id']]['count'] = 0;

	//			this.crafting_holder[step.data['class_id']]['count'] += step.data.count - left;
				this.queueItemHold(this.active_queue_index, step.data.class_id, (step.data.count - left));
				if (left > 0){
					this.sendCraftyMessage('Not Enough Meat', 10000);	
				}

	//			if (this.crafting_holder[step.data['class_id']]['count'] < step.data.count){
				if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) < step.data.count){
					// We need more, so reverse one step (to the fetch step)
					this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex-1);
					return {ok:1};
				}
			}
			break;
		}
		case 'butterfly_milker':{
			if (step.data.class_id == 'milk_butterfly'){
				var left = machine.takeMilk(step.data.count);

	//			if (!this.crafting_holder[step.data['class_id']]) this.crafting_holder[step.data['class_id']] = {};
	//			if (!this.crafting_holder[step.data['class_id']]['count']) this.crafting_holder[step.data['class_id']]['count'] = 0;

	//			this.crafting_holder[step.data['class_id']]['count'] += step.data.count - left;
				this.queueItemHold(this.active_queue_index, step.data.class_id, (step.data.count - left));

	//			if (this.crafting_holder[step.data['class_id']]['count'] < step.data.count){
				if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) < step.data.count){
					// We need more, so reverse one step (to the fetch step)
					this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex-1);
					return {ok:1};
				}
			}
			break;
		}
		case 'still':{
			if (step.data.class_id == 'hooch'){
				var machine_ret = machine.craftytaskingStart();
				var machine_ret = machine.craftytaskingEnd();
	/*			var left = machine.takeHooch(step.data.count);

	//			if (!this.crafting_holder[step.data['class_id']]) this.crafting_holder[step.data['class_id']] = {};
	//			if (!this.crafting_holder[step.data['class_id']]['count']) this.crafting_holder[step.data['class_id']]['count'] = 0;

	//			this.crafting_holder[step.data['class_id']]['count'] += step.data.count - left;
				this.queueItemHold(this.active_queue_index, step.data.class_id, (step.data.count - left));
				if (left > 0){
					this.sendCraftyMessage('Not Enough Hooch', 10000);	
				}

	//			if (this.crafting_holder[step.data['class_id']]['count'] < step.data.count){
				if (this.queueItemCountHolding(this.active_queue_index, step.data.class_id) < step.data.count){
					// We need more, so reverse one step (to the fetch step)
					this.apiSetTimerX('craftStep', step.data.duration, sequenceIndex-1);
					return {ok:1};
				}*/
			}
			break;
		}
		case 'metalmaker':
		case 'woodworker':
		case 'blockmaker':
		case 'fuelmaker':{
			log.info('CRAFTY: doUseMachine -- fuelmaker');
			machine_ret = machine.craftytaskingStart(this, step.data.recipe_id, step.data.count);

			if (machine_ret.duration){
				duration = machine_ret.duration;
			}
			log.info('CRAFTY: machine returned: '+machine_ret);
			
			break;
		}
	}

	this.apiSetTimerX('craftStep', duration, sequenceIndex+1);
}

function doWander(){ // defined by npc_crafty_bot
	if (this.interacting) return;

	if (this.isInLocation()){
		this.startMoving();
	}
}

function expand(callback, params){ // defined by npc_crafty_bot
	if (!this.isInLocation()) this.apiSetTimerX(callback, 300, params);
	if (!this.collapsed) return false;

	this.collapsed = false;
	this.setAndBroadcastState('expand');

	var location = this.getLocation();	
	location.announce_sound_to_all('CRAFTYBOT_EXPAND');

	if (callback){
		this.apiSetTimerX(callback, 2.6*1000, params);
	}

	return true;
}

function findItem(class_tsid, tool_wear){ // defined by npc_crafty_bot
	function find_item(it, find_args){ 
		if (find_args.in_sdb){
			var container = it.getContainer();
			if (container && container.class_tsid != 'bag_furniture_sdb'){
				return false;
			}
		}
		if (it.class_tsid == find_args.class_tsid){
			if (!it.is_tool) return true;

			if (it.isWorking()){
				if (!find_args.tool_wear || intval(it.getClassProp('display_wear')) == 0 || it.getInstanceProp('points_remaining') >= find_args.tool_wear){
					return true;
				}
			}
		}
		return false;
	}

	var container = null;
	if (this.isInLocation()){
		container = this.getLocation();
	}else{
		container = this.getContainer();
	}

	var targets = [class_tsid];
	if (class_tsid.split){
		targets = class_tsid.split('|');
	}

	for (var i in targets){
		var find_args = {class_tsid: targets[i], tool_wear: tool_wear, in_sdb: true};

		// We want to prioritize items in SDBs over other containers
		var items = container.find_items_including_bags(find_item, find_args);
		if (!items || !items[0]){
			// None in SDBs, look everywhere else
			find_args.in_sdb = false;
			items = container.find_items_including_bags(find_item, find_args);
		}
		if (items && items[0]){
			return items[0];
		}
	}

	return null;
}

function getActiveQueueIndex(){ // defined by npc_crafty_bot
	return this.active_queue_index;
}

function getActiveSequenceIndex(){ // defined by npc_crafty_bot
	if (this.queue && this.queue[this.active_queue_index]){
		return this.queue[this.active_queue_index].active_sequence_index;
	}

	return -1;
}

function getIngredientSource(){ // defined by npc_crafty_bot
	if (this.isInLocation()){
		return this.getLocation();
	}else{
		return this.getContainer();
	}
}

function getStatus(){ // defined by npc_crafty_bot
	var locationLabel = '';
	if (this.isInLocation()){
		var location = this.getLocation();
		locationLabel = location.label;
	}else{
		locationLabel = 'In Pack';
	}


	var ret = {};
	ret['tsid'] = this.tsid;
	ret['location'] = locationLabel;
	ret['fuel'] = this.getInstanceProp('fuel_level');
	ret['fuel_max'] = this.getClassProp('max_fuel');
	ret['crystal'] = this.getInstanceProp('crystal_installed_count');
	ret['crystal_max'] = this.getInstanceProp('crystal_slot_count');
	ret['queue_size'] = this.queueSize();
	ret['queue_max'] = this.queueSizeMax();

	/*ret['queue'] = [];
	for (var i in this.queue){
		ret['queue'].push({class_tsid: this.queue[i].item_class, count: this.queue[i].count, status: this.queue[i].status});
	}*/

	if (this.craft_state == 'craft' || this.craft_state == 'walk' || this.craft_state == 'fetch'){
		ret['steps'] = [];
		var step = null;
	/*	for (var i in this.queue[this.active_queue_index].craft_sequence){
			step = null;
			switch (this.queue[this.active_queue_index].craft_sequence[i].type){
				case 'fetch_tool':
				case 'fetch_ingredient':{
					step = {};
					step['type'] = this.queue[this.active_queue_index].craft_sequence[i].type;
					step['class_id'] = this.queue[this.active_queue_index].craft_sequence[i].data.class_id;
					step['count'] = this.queue[this.active_queue_index].craft_sequence[i].data.count;
					step['can_step'] = this.queue[this.active_queue_index].craft_sequence[i].can_step;
					step['source_count'] = this.queue[this.active_queue_index].craft_sequence[i].data.source_count;
					break;
				}
				case 'craft':{
					step = {};
					step['type'] = this.queue[this.active_queue_index].craft_sequence[i].type;
					step['can_step'] = this.queue[this.active_queue_index].craft_sequence[i].can_step;
					step['source_count'] = this.queue[this.active_queue_index].craft_sequence[i].data.source_count;
					step['class_id'] = '';
					step['count'] = '';
					for (var j in this.queue[this.active_queue_index].craft_sequence[i].data.class_id){
						if (step['class_id'] != '') step['class_id'] += ', ';
						step['class_id'] += this.queue[this.active_queue_index].craft_sequence[i].data.class_id[j];
						if (step['count'] != '') step['count'] += ', ';
						step['count'] += this.queue[this.active_queue_index].craft_sequence[i].data.count[j];
					}
					step['ingredients'] = [];
					for (var j in this.queue[this.active_queue_index].craft_sequence[i].data.ingredient_class){
						step['ingredients'].push({	'class_id': this.queue[this.active_queue_index].craft_sequence[i].data.ingredient_class[j],
											'count': this.queue[this.active_queue_index].craft_sequence[i].data.ingredient_count[j]});
					}
					break;
				}
			}
			if (step){
				if (i < this.active_sequence_index){
					step['status'] = 'completed';
				}else if (i == this.active_sequence_index){
					step['status'] = 'ongoing';
				}else{
					step['status'] = 'pending';
				}
				ret['steps'].push(step);
			}
		}*/

	//	ret['queue'] = this.crafting_queue;
		ret['active_queue_index'] = this.active_queue_index;
		ret['active_sequence_index'] = this.queue[this.active_queue_index].active_sequence_index;

		ret['status'] = 2;
		ret['desc'] = 'crafting';
		ret['tsid'] = this.tsid;
		ret['location'] = locationLabel;
		ret['fuel'] = this.getInstanceProp('fuel_level');
		ret['fuel_max'] = this.getClassProp('max_fuel');

	}else if (this.craft_state == 'refuel'){
		ret['status'] = 3;
		ret['desc'] = 'refuelling';
	}
	else if (this.craft_state == 'idle' || this.craft_state == 'sleep' || this.craft_state == 'craft_complete'){
		ret['status'] = 1;
		ret['desc'] = 'waiting';
	}else{
		ret['status'] = 0;
		ret['desc'] = 'unknown';
	}

	return ret;
}

function ingredientSourceCountItem(class_tsid, args){ // defined by npc_crafty_bot
	var source = this.getIngredientSource();

	var item_count = 0;

	if (!args) args = {};
	if (!args.tool_wear) args.tool_wear = 0;

	var tools = class_tsid.split('|');
	for (var i in tools){
		if (this.isInLocation()){
			if (args.tool_wear){
				item_count += source.count_items_including_bags(count_tools, {class_tsid: class_tsid, tool_wear:args.tool_wear});
			}else{
				item_count += source.count_items_including_bags(class_tsid);
			}
		}else{
			if (args.tool_wear){
				item_count += source.countItemClass(count_tools, {class_tsid: class_tsid, tool_wear:args.tool_wear});
			}else{
				item_count += source.countItemClass(class_tsid);
			}
		}
	}

	return item_count;

	function count_tools(it, args){
		return (it.is_tool && (it.getClassProp('points_capacity') == 0 || intval(it.getInstanceProp('points_remaining')) >= args.tool_wear) && it.class_tsid == args.class_tsid) ? 1 : 0; 
	}
}

function ingredientSourceHasItem(class_tsid, count){ // defined by npc_crafty_bot
	var source = this.getIngredientSource();
	if (!source.countItemClass) return false;

	return (source.countItemClass(class_tsid) >= count);
}

function isCrafting(){ // defined by npc_crafty_bot
	if (this.queue && this.active_queue_index != undefined && 
		this.queue[this.active_queue_index] && 
		!this.queue[this.active_queue_index].paused && 
		!this.queue[this.active_queue_index].locked &&
		!this.queue[this.active_queue_index].halted &&
		this.queue[this.active_queue_index].active_sequence_index != undefined &&
		this.is_crafting) {

		return true;
	}

	return false;
}

function isInLocation(){ // defined by npc_crafty_bot
	return this.getContainerType() == 'street';
}

function isInPack(){ // defined by npc_crafty_bot
	return this.getContainerType() == 'pack';
}

function isPlayerOwner(pc){ // defined by npc_crafty_bot
	if (!pc.crafty_bot || pc.crafty_bot.tsid != this.tsid){
		return false;
	} 

	return true;
}

function make_config(){ // defined by npc_crafty_bot
	var ob = {};

	// this special display will get placed on the itemstack's x/y + delta_x/delta_y 
	// if center_view:false, then the origin of the special display will be its bottom center
	// if center_view:true, then the origin of the special display will be its center
	var back_sd = {
		uid: 'crafting_back_'+this.tsid,
		item_class: null
	}

	var tool_sd = {
		uid: 'crafting_tool_'+this.tsid,
		item_class: null
	}


	//var current_step = (this.craft_sequence && this.craft_sequence[this.active_sequence_index]) ? this.craft_sequence[this.active_sequence_index] : null;
	//var tool = (current_step && current_step.data) ? current_step.data.tool || current_step.data.machine : null;

	// instead of the above, let's rely on a temp value. this escapes the problem with
	// the GS spamming the client with config changes which causes the special display to disappear
	// before the animation state of the bot changes
	var tool = this['!crafting_tool'];

	// do we have a tool to use?
	if (tool) {
		var has_tool_animation = true; // need to see how to test here for if it is a tool or normal item
		
		back_sd.item_class = 'npc_crafty_bot';
		back_sd.state = 'back';
		back_sd.delta_y = -8;
		back_sd.delta_x = 0;
		back_sd.under_itemstack = true;
		back_sd.fade_out_sec = 0;
		back_sd.fade_in_sec = 0;
		back_sd.state_triggers = ['craft'];
		
		//this.craft_sequence[this.active_sequence_index].data.tool

		tool_sd.item_class = tool;
		tool_sd.state = (has_tool_animation) ? 'tool_animation' : 'iconic';
		tool_sd.delta_x = 0;
		tool_sd.delta_y = -25;
		tool_sd.width = 40;
		tool_sd.under_itemstack = true;
		tool_sd.center_view = true;
		tool_sd.fade_out_sec = 0;
		tool_sd.state_triggers = ['craft'];
	}

	// order of array governs z depth of special displays
	ob.special_display = [back_sd, tool_sd];

	return ob;
}

function moveToTarget(class_tsid, args){ // defined by npc_crafty_bot
	if (!class_tsid) return {ok:0, error:'no_ingredient_found', data:{'class_tsid':class_tsid}};

	var tool_wear = null;
	if (args && args.tool_wear){
		tool_wear = args.tool_wear;
	}

	var item = this.findItem(class_tsid, tool_wear);
	if (!item) return {ok:0, error:'no_ingredient_found', data:{'class_tsid':class_tsid}};

	this.move_target = item.tsid;

	//
	// We are not in a location, so we are at the target
	//
	if (!this.isInLocation()){
		log.info('CRAFTY ['+this+'] - moveToTarget -- already at '+class_tsid);

		this.onDonePathing();
		return {ok:1};
	}

	//
	// We need to find the item in the location, and if it's not close we need to walk to it.
	//
	var container = item.getContainer();
	if (container.x + 50 < this.x || container.x - 50 > this.x){
		log.info('CRAFTY ['+this+'] - moveToTarget -- moving to '+class_tsid+' ('+container.x+', '+this.y+')');
		this.apiFindPath(container.x, this.y, 0, 'onPathing');
	}else{
		log.info('CRAFTY ['+this+'] - moveToTarget -- already at '+class_tsid);
		this.onDonePathing();
	}

	return {ok:1};
}

function onContainerItemAdded(addedItem, oldContainer){ // defined by npc_crafty_bot
	//
	// Make sure that this item wasn't dropped by Craftybot
	// If so, ignore it.
	//
	if (this.dropped_items && this.dropped_items[addedItem.class_tsid]){
		delete this.dropped_items[addedItem.class_tsid];
		return;
	}

	log.info('CRAFTY ['+this+'] - onContainerItemAdded: '+addedItem.class_tsid);
	this.apiSetTimerX('craftSequenceRebuildAll', 2*1000);
	this.apiSetTimerX('queueSetActive', 3*1000, 0, false);
}

function onContainerItemRemoved(removedItem, newContainer){ // defined by npc_crafty_bot
	return;

	//
	// Make sure that this item wasn't dropped by Craftybot
	// If so, ignore it.
	//
	if (this.pickedUpItems && this.pickedUpItems[removedItem.class_tsid]){
		delete this.pickedUpItems[removedItem.class_tsid];
		return;
	}

	log.info('CRAFTY ['+this+'] - onContainerItemRemoved: '+removedItem.class_tsid);
	this.apiSetTimerX('craftSequenceRebuildAll', 2*1000);
	this.apiSetTimerX('queueSetActive', 3*1000, 0, false);
}

function onContainerItemStacked(item, count){ // defined by npc_crafty_bot
	this.onContainerItemAdded(item, null);
}

function onContainerItemUnstacked(item, count){ // defined by npc_crafty_bot
	this.onContainerItemRemoved(item, null);
}

function onConversation(pc, msg){ // defined by npc_crafty_bot
	function getAllRecipesForTool(tool){
		var recipe_list = [];
		var recipes = apiFindItemPrototype('catalog_recipes').recipes;
		for (var i in recipes){
			if (recipes[i].tool == tool){
				recipe_list.push({txt: recipes[i].name,  value: 'craft::'+recipes[i].outputs[0][0]});
			}
		}
		return recipe_list;
	}
	/*function getRecipeListForSkillAndTool(skill, tool, recipe_list){
		var recipes = get_recipe_ids_for_skill(skill);
		for (var i in recipes){
			recipe = get_recipe(recipes[i]);
			if (recipe.tool == tool){
				recipe_list.push({txt: recipe.name,  value: 'craft::'+recipe.outputs[0][0]});
			}
		}
	}*/

	var parts = msg.choice.split('::');

	if (parts[0] == 'craftwith'){
		var tool = parts[1];
		var question = "What would you like to make?";

		var choices = [];
	/*	getRecipeListForSkillAndTool(null, tool, choices);
		for (var skill in this.learned_skills){
			getRecipeListForSkillAndTool(skill, tool, choices);
		}*/
		choices = getAllRecipesForTool(tool);

		this.conversation_end(pc, msg);

		if (choices.length == 0){
			return this.conversation_reply(pc, msg, "I don\'t know how to make anything yet. You\'ll need to teach me some skills first.", null, null, null, null, true);
		}else{
			return this.conversation_reply(pc, msg, question, choices, null, null, null, null, true);
		}

	}else if (parts[0] == 'craft'){

		this.conversation_end(pc, msg);

		this.craftytasking_request = {'class_tsid': parts[1]};

		var args = {
			input_label: 'How many?',
			cancelable: true,
			input_focus: true,
			input_max_chars: 3,
			itemstack_tsid: this.tsid,
			input_name: '1',
			follow:true
		};

		this.askPlayer(pc, 'count', 'count', args);
		return;

	} else if (parts[0] == 'teachskill'){

		var ret = this.learnSkill(pc, parts[1]);
	}

	return this.conversation_end(pc, msg);
}

function onCreate(){ // defined by npc_crafty_bot
	this.initInstanceProps();
	this.parent_onCreate();

	this.is_nameable = false;

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = 70;
	this.npc_climb_speed = 0;
	this.npc_jump_height = 0;
	this.npc_can_fall = 0;
	this.npc_can_pass_walls = true;

	this.is_pack = 0;
	this.capacity = 5;

	this.crafting_holder = {};
	this.learned_skills = {};

	this.apiSetTimer('setState', 1*1000, 'idle');
}

function onDonePathing(){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] -- onDonePathing -- walk_target: '+this['!walk_target']+' -- active_sequence_index: '+this.queue[this.active_queue_index].active_sequence_index+' -- craft_state: '+this.craft_state);

	if (this.refuelling){
		delete this.refuelling;

		this.setState('idle');

		if (!this.move_target) return false;
		var stack = apiFindObject(this.move_target);
		if (!stack) return false;

		if (stack.count > 1){
			var picked_up = stack.apiSplit(1);
			if (picked_up.count != 1) return false;
		}else{
			stack.apiDelete();
		}

		var new_fuel = Math.min(intval(this.getInstanceProp('fuel_level'))+500, intval(this.getClassProp('max_fuel')));
		this.setInstanceProp('fuel_level', new_fuel);

		for (var i in this.queue){
			this.queueIndexSetHalted(i, false);
		}

		this.clientUpdate();
		this.queueIterate();

	} else if (this.queue[this.active_queue_index].active_sequence_index != undefined && (this['!walk_target'] == 'craft' || this['!walk_target'] == 'machine')){
		var next_step_delay = 0;
		var step = this.queue[this.active_queue_index].craft_sequence[this.queue[this.active_queue_index].active_sequence_index];

		this.setState('idle');

		if (step){
			switch (step.type){
				case 'fetch_ingredient':{
					//
					// Pickup 'count' items from the move_target
					//
					var pickup_count = this.pickupStack(this.move_target, step.data['count']);
					if (!pickup_count) return false;

					//
					// If we didn't pickup enough, pickup more before advancing the step
					//
					if (pickup_count < step.data['count']){
						this.apiSetTimerX('craftStep', 0, this.queue[this.active_queue_index].active_sequence_index);
						return true;
					}

					next_step_delay = 1500;

					break;
				}
				case 'fetch_tool':{
					var item = apiFindObject(this.move_target);
					this.toggleActiveToolVisibility(this.move_target, false);
					this.queueItemHold(this.active_queue_index, item.class_tsid, 1, null, this.move_target);
					break;
				}
			}
		}

		this.apiSetTimerX('craftStep', next_step_delay, this.queue[this.active_queue_index].active_sequence_index+1);

	}else{
		this.setState('idle');
	}

	return true;
}

function onDrop(pc, msg){ // defined by npc_crafty_bot
	//
	// Set state to idle to rescale back to full size
	//
	this.setState('idle');

	//
	// Iterate the queue from the beginning
	//
	this.queueSetActive(0);
}

function onInputBoxResponse(pc, uid, value){ // defined by npc_crafty_bot
	if (uid == 'count' && value){
		var count = Number(value);
		if (!isNaN(count) && intval(count) > 0){
			var class_tsid = this.craftytasking_request['class_tsid'];
			delete this.craftytasking_request;

	//		var ret = this.craftItem(class_tsid, intval(count));		
			var index = this.queueAdd(class_tsid, intval(count));
			this.queueSetActive(index);
	//		if (!ret.ok){
	//			this.craftDone();
	//		}
		}else{
			this.sendBubble('You must enter a valid number.');
		}
	}
}

function onInteractionEnding(pc){ // defined by npc_crafty_bot
	if (this.interacting) delete this.interacting;

	if (this.isCrafting()){
		this.craftResume();
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc_crafty_bot
	return;
	if (this.isInLocation()){
		//
		// If we are walking in a location, stop
		//
		var location = this.getLocation();
		if (location){
			location.announce_sound_stop_to_all('CRAFTYBOT_WALK', false);
		}	
		this.stopMoving();

		//
		// If we are asleep, wake up!
		//
	/*	this.interacting = true;
		if (this.craft_state == 'sleep'){
			this.setState('idle');
		}*/
	}
}

function onLoad(){ // defined by npc_crafty_bot
	this.npc_can_pass_walls = true
}

function onOverlayDismissed(pc, payload){ // defined by npc_crafty_bot
	pc.announce_sound_stop(payload.tool_class_tsid.toUpperCase());
}

function onPathing(args){ // defined by npc_crafty_bot
	if (args.status == 3 || args.status == 4){
		this.turnAround();

		if (this.onDonePathing) { 
			return this.onDonePathing();
		}
	}
	if (args.status == 1){
		// NOTE: asset is backwards, remember to change directions when the swf changes
		if (args.dir == 'right'){
			this.setState('walk');
			this.dir = 'left';
		}
		if (args.dir == 'left'){
			this.setState('walk');
			this.dir = 'right';
		}
	}

	return false;
}

function onPickup(pc, msg){ // defined by npc_crafty_bot
	this.setState('idle');
	this.craftSequenceRebuildAll();
	this.queueSetActive(0);
}

function onPlayerCollision(pc){ // defined by npc_crafty_bot
	if (!this.isInLocation()) return;
	if (!this.isPlayerOwner(pc)) return;

	if (this.craft_state == 'sleep'){
		if (!this['!last_peek'] || (getTime() - this['!last_peek']) > 10*1000){
			
			pc.announce_sound('CRAFTYBOT_PEEK');

			this.setAndBroadcastState('peek');
			this['!last_peek'] = getTime();

			// Need to set back to sleepMode so the 'peek' will replay
			this.apiSetTimerX('setState', 5*1000, 'sleep');
		}
	}
}

function onPropsChanged(){ // defined by npc_crafty_bot
	var base_speed = 70;

	this.npc_walk_speed = base_speed / this.instanceProps.time_multiplier;
}

function onPrototypeChanged(){ // defined by npc_crafty_bot
	this.onLoad();
}

function pickupStack(tsid, count){ // defined by npc_crafty_bot
	//
	// Find itemstack
	//
	if (!tsid) return 0;
	var stack = apiFindObject(tsid);
	if (!stack) return 0;

	//
	// Check if we are already holding some of what we need
	//
	var required_ingredient_count = count;
	required_ingredient_count -= this.queueItemCountHolding(this.active_queue_index, stack.class_tsid);

	//
	// Pick up as many items as we can (max count)
	//
	var items_count = 0;

	var location = (this.isInPack()) ? this.getContainer() : this.getLocation();

	/*log.info('CRAFTY ['+this+'] -- pickupStack - stackLocation: '+stack.getContainer()+' -- bot location: '+this.getLocation());

	if (stack.getContainer() != this.getLocation())
	{
		log.info('CRAFTY -- pickupStackA - '+stack+' returning 0');
		return 0;
	}

	if (stack.x + 50 < this.x || stack.x - 50 > this.x){
		log.info('CRAFTY -- pickupStackB - '+stack+' returning 0');
		return 0;
	}*/

	if (stack.count > required_ingredient_count){
		var picked_up = stack.apiSplit(required_ingredient_count);
		if (picked_up) items_count = picked_up.count;
	}else{
		items_count = stack.count;
		stack.apiDelete();
	}

	location.apiSendMsg({ type: 'location_event' });

	this.queueItemHold(this.active_queue_index, stack.class_tsid, items_count);

	if (!this.pickedUpItems) this.pickedUpItems = {};
	this.pickedUpItems[stack.class_tsid];

	log.info('CRAFTY ['+this+'] - pickupStack: '+stack.class_tsid+' x'+items_count+' -- from location: '+location);

	return items_count;
}

function queueAdd(class_tsid, count){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+']- QUEUE - queueAdd: '+class_tsid+' x'+count);

	if (!this.queue) this.queue = [];

	//
	// Limit count to fit the max queue size
	//
	var queue_size = this.queueSize(); 
	var max_queue_size = this.queueSizeMax(); 
	count = Math.min(count, max_queue_size - queue_size);
	if (count <= 0){
		return null;
	}

	//
	// If class_tsid is in the queue, increase the count
	//
	for (var i in this.queue){
		if (this.queue[i].item_class == class_tsid){
			this.queue[i].count += count;
			this.queue[i].complete = false;
			this.craftSequenceRebuildAll();
			this.clientUpdate();
			return i;
		}
	}

	//
	// Adding new item to the queue, create the spec (for a single) and add the data
	//
	var spec = utils.craftytasking_get_static_build_spec(class_tsid);

	//
	// Make sure we have a spec and that the spec has incredients (can be crafted)
	//
	if (!spec) return -1;
	if (!spec['ingredients']) return -1;

	//
	// Build the craftsequence for this entry
	//
	var sequence = utils.craftytasking_build_sequence(this, spec, count, {});
	var sequence_status = utils.craftytasking_get_sequence_status(sequence);

	//
	// Add to the queue
	//
	var new_entry = apiNewOwnedDC(this);
	new_entry.item_class = class_tsid;
	new_entry.count = count;
	new_entry.iterator = null;
	new_entry.status = sequence_status, 
	new_entry.craft_sequence = sequence, 
	new_entry.ingredients = sequence[sequence.length-1].data.ingredients, 
	new_entry.missing_ingredients =  sequence[sequence.length-1].data.missing_ingredients, 
	new_entry.tools = sequence[sequence.length-1].data.tools, 
	new_entry.missing_tools = sequence[sequence.length-1].data.missing_tools

	this.queue.push(new_entry);

	/*this.queue.push({
		class_tsid:class_tsid, 
		count:count, 
		iterator:null, 
		status:sequence_status, 
		craft_sequence:sequence, 
		ingredients:sequence[sequence.length-1].data.ingredients, 
		missing_ingredients: sequence[sequence.length-1].data.missing_ingredients, 
		tools:sequence[sequence.length-1].data.tools, 
		missing_tools:sequence[sequence.length-1].data.missing_tools
	});*/

	//
	// Set the queue active to this entry
	//
	this.queueSetActive(this.queue.length-1);

	//
	// Update the client
	//
	this.clientUpdate();

	//
	// Return insertion point
	//
	return this.queue.length-1;
}

function queueCount(){ // defined by npc_crafty_bot
	if (!this.queue) return 0;

	return this.queue.length;
}

function queueExecute(){ // defined by npc_crafty_bot
	if (!this.queue) return false;

	if (this.active_queue_index == undefined) return false;
	if (this.active_queue_index >= this.queue.length) this.active_queue_index = 0;

	var queue_entry = this.queue[this.active_queue_index];
	if (!queue_entry) return false;

	if (this.refuelling) return false;
	if (queue_entry.paused || queue_entry.locked || queue_entry.halted) return false;

	if (queue_entry.iterator == this.queue_iterator) return false;
	queue_entry.iterator = this.queue_iterator;

	log.info('CRAFTY ['+this+'] -- queueExecute -- setting to '+this.active_queue_index);

	return this.craftItemFromQueue(this.active_queue_index, false);
}

function queueGet(){ // defined by npc_crafty_bot
	if (!this.queue) this.queue = [];

	return this.queue;
}

function queueIndexForClass(class_tsid){ // defined by npc_crafty_bot
	for (var i in this.queue){
		if (this.queue[i].item_class == class_tsid){
			return i;
		}
	}

	return -1;
}

function queueIndexIsComplete(queue_index){ // defined by npc_crafty_bot
	return (this.queue[queue_index].count_crafted >= this.queue[queue_index].count);
}

function queueIndexSetHalted(queue_index, halted){ // defined by npc_crafty_bot
	if (!this.queue || !this.queue[queue_index]) return;

	this.queue[queue_index].halted = halted;
}

function queueIndexSetLock(queue_index, lock){ // defined by npc_crafty_bot
	if (!this.queue || !this.queue[queue_index]) return;

	this.queue[queue_index].locked = lock;
}

function queueIndexSetPause(queue_index, pause){ // defined by npc_crafty_bot
	if (!this.queue || !this.queue[queue_index]) return;

	this.queue[queue_index].paused = pause;
}

function queueIndexStatus(queue_index){ // defined by npc_crafty_bot
	if (!this.queue || !this.queue[queue_index]) return null;

	//
	// Calculate the scanning status for this index (based on the queue iterator
	//
	var scan_status;
	if (this.isCrafting() && this.active_queue_index == queue_index){
		scan_status = 'active';
	}else if (this.queue[queue_index].iterator == this.queue_iterator){
		scan_status = 'scan_done';
	}else{
		scan_status = 'scan_pending';
	}

	var craftable_count = 0;
	if (this.queue[queue_index].craft_sequence[this.queue[queue_index].craft_sequence.length-1]){
		craftable_count = this.queue[queue_index].craft_sequence[this.queue[queue_index].craft_sequence.length-1].data.count;
	}

	return {
		'class_tsid': this.queue[queue_index].item_class,
		'complete': this.queueIndexIsComplete(queue_index),
		'queue_paused': (this.queue[queue_index].paused != undefined && this.queue[queue_index].paused == true),
		'queue_locked': (this.queue[queue_index].locked != undefined && this.queue[queue_index].locked == true),
		'queue_halted': (this.queue[queue_index].halted != undefined && this.queue[queue_index].halted == true),
		'scan_status': scan_status,
		'craftable_count': craftable_count,
		'queue_count': this.queue[queue_index].count,
		'completed_count': this.queue[queue_index].count_crafted,
		'ingredients': this.queue[queue_index].ingredients,
		'missing_ingredients': this.queue[queue_index].missing_ingredients,
		'tools': this.queue[queue_index].tools,
		'missing_tools': this.queue[queue_index].missing_tools,
	};
}

function queueItemCountHolding(queue_index, class_tsid, holder_id){ // defined by npc_crafty_bot
	if (!holder_id) holder_id = 'general';

	if (!this.queue || 
		!this.queue[queue_index] || 
		!this.queue[queue_index].holder || 
		!this.queue[queue_index].holder[holder_id] || 
		!this.queue[queue_index].holder[holder_id][class_tsid] ||
		!this.queue[queue_index].holder[holder_id][class_tsid]['count']) return 0;

	return this.queue[queue_index].holder[holder_id][class_tsid]['count'];
}

function queueItemHold(queue_index, class_tsid, count, holder_id, tsid){ // defined by npc_crafty_bot
	if (!holder_id) holder_id = 'general';

	if (!this.queue || !this.queue[queue_index]) return;
	if (!this.queue[queue_index].holder) this.queue[queue_index].holder = {};
	if (!this.queue[queue_index].holder[holder_id]) this.queue[queue_index].holder[holder_id] = {};
	if (!this.queue[queue_index].holder[holder_id][class_tsid]) this.queue[queue_index].holder[holder_id][class_tsid] = {};
	if (!this.queue[queue_index].holder[holder_id][class_tsid]['count']) this.queue[queue_index].holder[holder_id][class_tsid]['count'] = 0;

	this.queue[queue_index].holder[holder_id][class_tsid]['count'] += count;

	if (tsid){
		if (!this.queue[queue_index].holder[holder_id][class_tsid]['tsid']) this.queue[queue_index].holder[holder_id][class_tsid]['tsid'] = {};
		this.queue[queue_index].holder[holder_id][class_tsid]['tsid'][tsid] = 1;
	}
}

function queueItemUnhold(queue_index, class_tsid, count, holder_id, tsid){ // defined by npc_crafty_bot
	if (!holder_id) holder_id = 'general';

	if (!this.queue || !this.queue[queue_index] || 
		!this.queue[queue_index].holder ||
		!this.queue[queue_index].holder[holder_id] || 
		!this.queue[queue_index].holder[holder_id][class_tsid] || 
		!this.queue[queue_index].holder[holder_id][class_tsid]['count']) return;

	var items_removed = count;
	if (this.queue[queue_index].holder[holder_id][class_tsid]['count'] - count < 0){
		items_removed = this.queue[queue_index].holder[holder_id][class_tsid]['count'];
	}

	this.queue[queue_index].holder[holder_id][class_tsid]['count'] -= items_removed;

	if (tsid != undefined && this.queue[queue_index].holder[holder_id][class_tsid]['tsid']){
		delete this.queue[queue_index].holder[holder_id][class_tsid]['tsid'][tsid];
	}

	if (this.queue[queue_index].holder[holder_id][class_tsid]['count'] <= 0){
		delete this.queue[queue_index].holder[holder_id][class_tsid];
	}

	return items_removed;
}

function queueIterate(){ // defined by npc_crafty_bot
	this.active_queue_index++;
	if (this.active_queue_index >= this.queue.length){
		this.active_queue_index = 0;
	}

	return this.queueExecute();
}

function queueRemove(class_tsid, count){ // defined by npc_crafty_bot
	if (!this.queue) this.queue = [];
	var count_left = 0;

	var items_removed = 0;
	for (var i in this.queue){
		if (this.queue[i].item_class == class_tsid){
			if (this.active_queue_index == i){
				this.craftCancel();
			}
			this.queue[i].count -= count;
			if (this.queue[i].count <= 0){
				if (this.queue.length > 1){
					this.queue.splice(i, 1);
				}else{
					this.queue = [];
				}

				if (this.active_queue_index == i){
					this.active_queue_index = 0;
				}else if (this.active_queue_index > i){
					this.active_queue_index -= 1;
					if (this.active_queue_index < 0){
						delete this.active_queue_index;
					}
				}
			}else{
				count_left = this.queue[i].count;
			}
		}
	}

	this.craftSequenceRebuildAll();
	this.clientUpdate();

	return count_left;
}

function queueSetActive(index, force_switch){ // defined by npc_crafty_bot
	log.info('CRAFTY ['+this+'] -- queueSetActive: '+index+' -- force: '+force_switch+' -- isCrafting: '+this.isCrafting());

	if (this.isCrafting() && force_switch){
		this.craftCancel(false);
	}

	this.queue_iterator = getTime();

	if (!this.isCrafting()){
		this.active_queue_index = index;
		this.queueExecute();
		this.clientUpdate();
	}
}

function queueSize(){ // defined by npc_crafty_bot
	if (!this.queue) this.queue = [];

	var size = 0;
	for (var i in this.queue){
		size += this.queue[i].count;
	}

	return size;
}

function queueSizeMax(){ // defined by npc_crafty_bot
	if (this.getInstanceProp('crystal_installed_count') == 0) return 0;

	var max_size = 5;
	for (var i = 0; i < this.getInstanceProp('crystal_installed_count'); i++){
		max_size = max_size*2;
	}

	return max_size;
}

function sendCraftyMessage(message, delay){ // defined by npc_crafty_bot
	if (this.isInLocation()){
		this.sendBubble(message, delay);
	}else{
		var container = this.getContainer();
		container.prompts_add({
			title			: 'From Crafty-bot',
			txt			: message,
			is_modal		: false,
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function setState(state){ // defined by npc_crafty_bot
	//log.info('CRAFTY ['+this+'] - SetState: '+state+' ['+this.craft_state+']');

	if (this.isInLocation()){
		if (this.interacting && state == 'sleep'){
			// Delay setting sleep
			this.apiSetTimerX('setState', 30*1000, state);
			return;
		}

		var location = this.getLocation();
		if (location){
			location.announce_sound_stop_to_all('CRAFTYBOT_CRAFT_START', true);
			location.announce_sound_stop_to_all('CRAFTYBOT_WALK', false);
		}	

		//
		// We are switching away from crafting, so play the crafting end sound and re-call.
		//
		if (this.craft_state == 'craft' && state != 'craft'){
			if (location){
				location.announce_sound_to_all('CRAFTYBOT_CRAFT_END');
			}

			this.craft_state = state;
			this.apiSetTimerX('setState', 2*1000, state);
			return;
		}

		//
		// Cancel any state changing timers
		// Walking is a passive state and should not cancel timers
		//
		if (state != 'walk'){
			this.apiCancelTimer('setState');
			this.stopMoving();
		}

		var animation_state;
		var sound;
		var needs_collapse = false;
		var needs_expand = false;

		this.craft_state = state;

		switch (state){
			case 'idle':{
				animation_state = 'idle0';
				needs_expand = true;
				break;
			}
			case 'fetch':
			case 'walk':{
				animation_state = 'walk';
				needs_expand = true;
				sound = 'CRAFTYBOT_WALK';
				break;
			}
			case 'craft':{
				animation_state = 'craft';
				sound = 'CRAFTYBOT_CRAFT_START';
				needs_collapse = true;
				break;
			}
			case 'craft_complete':{
				//animation_state = 'idle1';
				//sound = 'CRAFTYBOT_IDLE_1';
				needs_expand = true;
				break;
			}
			case 'sleep':{
				animation_state = 'sleepMode';
				needs_collapse = true;
				break;
			}
		}

		if (needs_collapse){
			if (this.collapse('setState', state)){
				// This function will be re-called from collapse
				return;
			}
		}

		if (needs_expand){
			if (this.expand('setState', state)){
				// This function will be re-called from collapse
				return;
			}
		}

		if (animation_state){
			if (location && sound){
				location.announce_sound_to_all(sound);
			}

			this.setAndBroadcastState(animation_state);
		}
	}else{
		this.craft_state = state;

		switch (state){
			case 'craft_complete':
			case 'sleep':
			case 'fetch':
			case 'walk':
			case 'idle':{
				this.setAndBroadcastState('iconic');
				break;
			}
			case 'craft':{
				this.setAndBroadcastState('iconic_craft');
				break;
			}
		}
	}

	//
	// Call callback regardless of changing state
	//

	this.setStateComplete(state);
}

function setStateComplete(state){ // defined by npc_crafty_bot
	//log.info('CRAFTY ['+this+'] -- setStateComplete: '+state);

	switch (this.craft_state){
		case 'idle':{
			this.apiSetTimerX('setState', 3*60*1000, 'sleep');
			break;
		}
		case 'fetch':{
			if (this['!walk_target'] == 'craft'){
				this.doFetch(this.getActiveSequenceIndex());
			}else if (this['!walk_target'] == 'machine'){
				this.doFetchMachine(this.getActiveSequenceIndex());
			}
			break;
		}
		case 'use_machine':{
			this.doUseMachine(this.getActiveSequenceIndex());
			break;
		}
		case 'craft':{
			this.doCraft(this.getActiveSequenceIndex());
			break;
		}
		case 'craft_complete':{
			this.doCraftComplete(this.getActiveSequenceIndex());
			break;
		}
		case 'walk':
		case 'sleep':{
			// Do nothing
			break;
		}
	}
}

function startMoving(){ // defined by npc_crafty_bot
	if (!this.isInLocation()) return;

	this.parent_startMoving();
}

function toggleActiveToolVisibility(tsid, show){ // defined by npc_crafty_bot
	if (show){
		if (this['!active_tool']){
			var tool = apiFindObject(this['!active_tool']);
			if (tool) tool.setVisible();
			delete this['!active_tool'];
		}
	}else{
		// Show any currently hidden tools
		this.toggleActiveToolVisibility(null, true);

		var tool = apiFindObject(tsid);
		if (tool){
			tool.setInvisible();
			this['!active_tool'] = tool.tsid;
		}
	}
}

function wearTool(wear_amount, tool_class_tsid){ // defined by npc_crafty_bot
	//
	// Will wear the tool in crafting_holder matching tool_class_tsid by wear_amount
	//

	if (!wear_amount) return 0;
	if (!this.queue) return 0;
	if (!this.queue[this.active_queue_index]) return 0;
	if (!this.queue[this.active_queue_index].holder) return 0;
	if (!this.queue[this.active_queue_index].holder.general) return 0;
	if (!this.queue[this.active_queue_index].holder.general[tool_class_tsid]) return 0;
	if (!this.queue[this.active_queue_index].holder.general[tool_class_tsid].tsid) return 0;

	var tool = null;
	var tool_wear = wear_amount;
	for (var i in this.queue[this.active_queue_index].holder.general[tool_class_tsid].tsid){
		tool = apiFindObject(i);
		if (tool){
			var would_break = false;

			if (tool.getClassProp('display_wear') == 1){
				would_break = true;
			}
			else if (is_chance(0.10)){
				would_break = true;
			}

			if (tool.getInstanceProp('points_remaining') > tool_wear){
				tool.setInstanceProp('points_remaining', tool.getInstanceProp('points_remaining') - tool_wear);
				break;
			}else{
				tool.setInstanceProp('points_remaining', 0);
				if (would_break){
				        var location = this.getLocation();
				        location.announce_sound_to_all('TOOL_BREAKS');
					tool_wear -= tool.getInstanceProp('points_remaining');
					tool.setInstanceProp('is_broken', 1);
					this.sendBubble('Oops, I broke it.');
				}
			}
		} 
	}

	return 0;
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

function parent_onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
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

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_bag"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-169,"w":117,"h":169},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKvklEQVR42u1YWVBU2RlOpvKQVE0m\nlYdUUnlIpSqTzGZUJmZGBUEQQVBAcbDZZBloEGho1mYTGrpZWjZZFBBRFNlEdgSafWcAEZu9he5m\naUDZFGVidGYqX845BmuSJ9tUlgdv1Vd9+57tO9+\/3P\/cH\/zg7fX2enu9vf5\/rvF2z3eVA8I\/LNyN\n5yzJEjiKwRjOVEeIj6o\/WrQ8mipeU5UT3BIvylLEiq+iORSzBNO94boTPX6f\/MeIDTW7\/Wag1qug\nKtdBUZl7er2p2HWru9Jja1jK35rqDP3L\/JDk+dJY5gv5vYoXK8raF0ujqS9m+qK2RloCtppJ34L0\nU5tlOTYbg7e9FTKpd\/BQqdvP\/m1SmM37sWos9pcjzf4n+2u9li\/GmEIUoINQr31oyLdFX7U77tR5\nQdbki8nOUIy1h6GjnIfp3ij2\/14jH4OkveiiHfgu2ojy24\/zQmN0lHHJOM+ivhq3DzfnC3\/+ZuTW\nqn+6oSwKmBuKGVINRH07PxSHwXo\/5CSehDjQANVXbNBc7MzQXuqKjltuqMt3xs0sW0iLuGi7xUVL\niQsai5xQlctBkIc+Qnj6aCb\/R1sDIO8SYKYvbPGp+lb5N6t1uwHhO69NTq3u+8nSxKWoh5NZKxvT\nl\/FgPB3TfVFoLHZHUZYrKvLcyaK2aCr6EtICZ0gLv0RrmS\/aCFpuvURrGZ+h4YYTavIcUJrDRU6K\nC4qznIjKXpjpj8PiWBYWR7O\/k3+V0jPcFqcH4IevRfCbjbt7s+KPbl2SmCEz3hKXE44jK84EbvZ7\n4WhviZjoIOQmmOBKoukrXE0yR16yxT+BPqNtSRGmiAhxQ1qyCGIhH+IgPVw+dwwXY8yQGnUEaVHG\n3xVlfXkeGH\/3tQh++3RUNy\/NHu6OhyCJFaL4SgiZxADO1vvB4\/GQlpYGgSCIIZgiWMAQEhLMfrfb\nzri7wd7OBj4+PERHR0MikSDybACE\/H3ETfRgY0XIn4tGduJpXE93zMTGzHuv539C4TtX05zhybVC\ncJAfkiUCXBQfgovtfhgbGUJr1w7s3vkJPtuzGwb6ujA1MYK5mSkcHexwysoShocOwuiwIczMzHDi\nxHEYGhpAT1cHeno6sDiqjyjf\/Qj2MoS3lyvcXB1QkBOMuiIfwesHCHHYqvxACAXWSIwT4HKaFxLD\n9GBvuRsHySLOzk6IjIxkimRlZSE7Oxv5+fkoLi5GSUkJA72\/dOkSa09KSkJERAS4XC44J00QG6iD\n2ODDEEd4IFzARUGWF7pqRa9PUEgUbCgVDsaEmCEqyALxYSbw534GnusRiERCRqChoQFNTU1oa2tD\nR0cHurq60NPTg97eXgZ6T5\/RtpaWFkilUlRWViI9VQKxwBiiQH1E+h2GMPAoMuJs\/tpUIfHSKM30\nd1b7CoVn4enhBvNjRti54\/dEtQhUV1ezBSmJyclJqFQqLC8v4+HDh1hdX4X6wRI2n2zi2bNnePTo\nEWujfWjf\/v5+SMnGMtLP47jFMRga6OD4cTP4+\/HlIlHEAY0IKmfuuFy4cAGhoaHY8+lOWH1xEjdv\n3kR7ezvkcjkeP36Mzc1NPH36FF9\/\/TUj1Dc8gIKam5Ar7+P58+fsGW2jfWhfOmZ2dhaNjY0s2Jwc\nHZCSnIyMjIwpso62RgTl8nvaeVdyEBYWih2ffID4+Hg28fj4OFZXV5k6dNEnT57g0eNHWNtYx53R\nuyhvqsb0rALLKw\/waPMxtra2WB\/al46hY6emppBMiFlaWoKKkJqSohKLxUYaEVQoxrVv5F8lKcIH\nWrv\/iMLCQnR3d2NhYQFra2vY2NhgCy4sqZlyo\/JxDE\/IUNcphWJeie6hXnTd6YV6efGVenQMHbu0\ntMSscejQIaSnp9MgWyQBZ6ERwYHutl0XMtLmeTxP7Nv3OcrKyjA0NPTS14gKdCGFSonatgZUNtdA\nNjXK0NzXBuWCCh2DXahprUNLbzvUS4tsM+vr62wsnaO1tRVenu4kjwoQGxsrJ1GumQ\/ixaMdVZWl\nCj7fGw6nbVFfX4\/h4eFXAUHR1N2Gm3Xl6CZKra6vYXxmEl1DPVAtzGL54TIae1pR3liNAdkdRmyb\nHJ2DBkxoSAAiI87SVKS5Dyom7+y4fi1H4ezkSJzZjqWVsbExZp4HDx5gYXEBN6pKUNNWjzn1HFNo\nenYGw5MyZnZqUuWcCtUttZB2NWNuYQ4rKytsLJ1jZGSEEAxEXGwMcnNzNSfYXhez53pW8AbXyRKu\nLg6vCC4uLrIFJuSTyK8sQvtXnVh+sPzSfGurWFldeeWjlFBDZxOqmmsxo1Qw9ehYOgcNNlsbK0ji\nY0luTFSliL01C5Jr5821L4hN4OOiw15HlCCNPrVazRYYmRjF9YpCQrALS8tLr\/zy+6CEGol6FcTM\n92fuM9PSsXSO0dFR6B\/URXJSAioKJM+rrzrwNCKYm3BYOz3aAH7cfXBy4KCurg4TExMsiukCCpUC\nV8tu4Ha7FCpiSkqGKrbta\/R+Xj2PssYqEiz1RMEZph4dS+egJvY+8wVqCwWkhrRGQrieQEMFTbRz\n4o2QcNYcZkcNUVNTg3v37rFEOzc3h\/n5edyqr0RBdQnujAxBvahm\/rWNefUCekjwlNSVoYUE0+zc\n7MuNye+i+7YYN7NtcS3FHKlCfaREHETSGxGUGCMl6gT27d3FigGaZuhra5vk4PAQC5SS22XoGezD\n6OQYxuUTkBHzt\/V1MHLlDVUYGR9lqs2q5OisS0JCmAECz+ggwNMIvlxtSAQHnieF6nm\/EcFU8Sl8\n\/MFvWfVCCwCFQgGlUslI0vuu\/l4UktdbQVUxbjVUMH8rra9AUU0p+x2S3YXqHxsa7s4hhe8xCDwO\n4LT1MYiEYRBF8uHvumc9KVzX7o0I5qc7YteO92Fvb8eKhPv37zNiVEkKSnZ4VIZa4mfl0ipUEoIV\n0mq09XZgYmqCbYTi\/kgNCi\/Y4DwxJ5+rC0nMWVKsxiAqIhA+TlprKWcPWmtEsIAQzE04gsIMDkyN\nSS1odwrXr19jyXp6ehozMzOM6LaiFNukv09eSdLLlKyeHKQ8kSk2xAXRIUT564HvcRz+PvZwczgI\nSbDuWmLYAc0IlmSZa19LNkVR+gn48pzAsTqBgAA+qQWLWD6kBKjZttPONmikbuc6llIWZtBVn4Ac\nyREWDInhRkiNJEeJkAOICdIh\/qhH7nXXYgP3W2ts4txzxuRwY4rUGCfEiEXgujoSJTmkREokxWgn\nZDIZI\/Ov+e\/7WFlWQloaxpQTeO5HCJ9DDk0GCPHSRjDPCGE8bcQGHXgzgjECQ\/h7HEVeihWq8skR\nsiwJiRIRdLQ\/Iz7JIa9Ae9hYc+Dg4AALc1NS2JrA1toKvj5e8GPvcDu4u5xCYoQZkpl6+kiONEV8\nsC747iYkSAIR7meBaP\/9z4LP\/NlDI4LpQsO94b5GzwRkxxkiahZy2AkwQm52Klqbm1FFynda022D\nnvSyyfnj4sWLSElJYc\/i4+KQfC4SmedsECc4wEBNG0tMG+CmgyDvEwh034sz9rv+dtryI83yoND7\n8\/f8XD915jlppfs4a2V6nd6d6czZlWxxTM\/H2Ng4ycjIKPN14GB7NC+cb9DHc9496evy6STfRWvE\nz+VPAxRnbHcO2J\/4mODDVnvLj47+T76Gtbcf\/JGAp\/VrzvH3f0dhZfKrX7z9Rvjfvv4Onu1MO68d\nKxcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/npc_crafty_bot-1353110309.swf",
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
	"no_bag"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "craft",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"n"	: "install_crystal",
	"k"	: "kick",
	"u"	: "refuel",
	"t"	: "stop_crafting",
	"h"	: "teach"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "craft",
	"n"	: "install_crystal",
	"k"	: "kick",
	"u"	: "refuel"
};

log.info("npc_crafty_bot.js LOADED");

// generated ok 2012-11-16 17:18:32 by tim
