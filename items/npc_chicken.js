//#include include/rook.js, include/animal_sadness.js, include/animal_naming.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Chicken";
var version = "1355090246";
var name_single = "Chicken";
var name_plural = "Chickens";
var article = "a";
var description = "An easily agitated member of the poultry classes. Given to flights of fearful fantasy, high-pitched paranoia and, frankly, short distances, chickens are a reliable source of grain (it's said that they keep it in the hot pockets under their wings).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_chicken", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "edge_to_edge",	// defined by npc_walkable
	"conversation_offset_y"	: "0",	// defined by npc_chicken
	"conversation_offset_x"	: "0"	// defined by npc_chicken
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.is_announcement = "0";	// defined by npc_chicken
	this.instanceProps.life_points = "2000";	// defined by npc_chicken
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	is_announcement : [""],
	life_points : ["How much life is left in this chicken?"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	is_announcement : [""],
	life_points : [""],
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

verbs.unrook = { // defined by npc_chicken
	"name"				: "unrook",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god && this.isRooked()) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.unRook();
		return true;
	}
};

verbs.rook_attack = { // defined by npc_chicken
	"name"				: "rook_attack",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 11,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.adminRook(pc);
		return true;
	}
};

verbs.butter_up = { // defined by npc_chicken
	"name"				: "butter up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Tell this chicken how wonderful it is",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('is_announcement') == 1) return {state:null};
		if (this.isRooked()) return {state:null};
		if (this.incubating) {
			return {state:'disabled', reason:"This chicken is focused on the miracle of life! No butter!"};
		}
		if (this.isSad()){
			return {state:'disabled', reason:"Hold the butter! This chicken is too sad."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.announce_sound("HAPPY_CHICKEN");

		var energy = pc.metabolics_lose_energy(4);
		var mood = pc.metabolics_add_mood(10);
		var img = pc.stats_add_xp(4);

		if (energy) {
			self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: energy
			});
		}

		if (mood) { 
			self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: mood
			});
		}

		if (img) {
			self_effects.push({
			"type"	: "xp_give",
			"which"	: "",
			"value"	: img
			});
		}

		var slugs = {};
		slugs.xp = img;
		slugs.mood = mood;
		slugs.energy = energy;

		this.sendBubble("That's the nicest thing I've ever heard! Thank you!", 2*1000, pc, slugs);

		var pre_msg = this.buildVerbMessage(msg.count, 'butter up', 'buttered up', failed, self_msgs, self_effects, they_effects);
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

verbs.revive = { // defined by npc_chicken
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Help this chicken escape the effects of The Rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			if (this.playerIsHealer(pc)) {
				return {state: 'disabled', reason: "You have already helped revive this "+this.name_single+". Now others need to help!"};
			} else if (!this.canRevive(pc)) {
				return {state: 'disabled', reason: "Enough people are already helping to revive this "+this.name_single+"."};
			} else {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"effects"			: function(pc){

		return this.getReviveEffects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.startRevive(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'revive', 'revived', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.set_free = { // defined by npc_chicken
	"name"				: "set free",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Costs 5 energy, rewards 20 mood",
	"get_tooltip"			: function(pc, verb, effects){

		if(this.user_name) {
			var result = "Release a chicken named "+this.user_name+" into the wilderness. "+verb.tooltip;
		} else {
			var result = "Release this chicken into the wilderness. "+verb.tooltip;
		}

		return result;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!this.container.owner || this.container.owner != pc) {
			return {state:null};
		}

		if(!pc.skills_has('herdkeeping_1')) {
			return {state:'disabled', reason: "You need to know Herdkeeping to set animals free."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.free_pc = pc;
		if(this.user_name) {
			var prompt_text = "Are you sure you want to let your chicken named "+this.user_name+" out into the wilderness?";
		} else {
			var prompt_text = "Are you sure you want to let your chicken out into the wilderness?";
		}

		pc.prompts_add({
			is_modal: true,
			txt		: prompt_text,
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'OK' },
				{ value : 'cancel', label : 'Cancel' }
			],
			callback	: 'prompts_itemstack_location_callback',
			itemstack_tsid: this.tsid
		});

		return true;
	}
};

verbs.talk_to = { // defined by npc_chicken
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this['!is_flying'] || this.incubating || this.isRooked()) return {state: null};

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.apply_balm = { // defined by npc_chicken
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Revive this Chicken with some Rook Balm",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Apply Rook Balm",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_rook_balm' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
			var balm = pc.findFirst(is_balm);
			if (balm) {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
		var balm = pc.findFirst(is_balm);

		if (!balm){
			return false;
		}

		msg.target = this;

		return balm.verbs['pour'].handler.call(balm, pc, msg);
	}
};

verbs.apply_youth = { // defined by npc_chicken
	"name"				: "apply youth potion",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Make this Chicken young again",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_animal_youth' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		function has_potion(it){ return it.class_tsid == 'potion_animal_youth' ? true : false; }
		if (pc.findFirst(has_potion)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_animal_youth' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!is_potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.incubate = { // defined by npc_chicken
	"name"				: "request incubation",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Ask this Chicken to incubate a seasoned egg",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('is_announcement') == 1) return {state:null};
		if (this.isRooked()) return {state:null};
		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Chicken is sad!."};
		}
		// For players with the Animal Husbandry skill, chickens have a verb on 'em, "Request incubation"
		if (pc.skills_has('animalhusbandry_1')){ return {state:'enabled'}; }
		return {state:null};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		// On selecting this verb, if the chicken is not already incubating an egg, then: success!
		if (!this.incubating){
			// In the success case: players are given a list of the eggs in their inventory and can choose one to give to the chicken.
			var uniques = {};
			var items = pc.apiGetAllItems();
			for (var i in items){
				var it = items[i];
				if (this.isEgg(it)){
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
				this.sendBubble("Chickens incubate eggs. You don't have any!", 5*1000);
				this.startMoving();
				return {
					'ok' : 0,
					'txt' : "Chickens incubate eggs. You don't have any!",
				};
			}
		}
		else{
			// If it is already incubating an egg, it fails with a message from the chicken: "Sorry, I've already got a bun in the oven. Come back when I have free space for more eggs."
			this.sendBubble("Sorry, I've already got a bun in the oven. Come back when I have free space for more eggs.", 5*1000);
			this.startMoving();
			return {
				'ok' : 0,
				'txt' : "Sorry, I've already got a bun in the oven. Come back when I have free space for more eggs.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// have we been passed an egg?
		//

		if (msg.target_item_class){
			var stack = pc.takeItemsFromBag(msg.target_item_class, 1).pop();
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			// is this really food?
			if (!this.isEgg(stack)){
				stack.apiPutBack();
				log.error('chose something we can\'t incubate...');
				return false;
			}
			
			// Do we have room?
			if (this.incubating){
				pc.sendActivity("Too slow! Someone else got to me first.");
				this.startMoving();
				return false;
			}
			
			if(!this['!is_flying']) {
				this.apiStopMoving();
				this.state = 'sit';

				this.incubating = 1;
				
				this.apiSetTimer('onIncubationHalfway', 30 * 1000);
				this.apiSetTimer('onIncubationComplete', 60 * 1000);
			}
			else {
				this.pendingIncubation = 1;
				this.incubating = 0;
			}

			log.info('Chicken: Starting incubation for '+pc.tsid+' ('+pc.label+')');
			log.info('Chicken: '+this.user_name+' pendingIncubation is ' + this.pendingIncubation);
			this.player_name = pc.label;
			this.player_tsid = pc.tsid;
			this.egg_class = stack.class_tsid;

			this.ai_debug_display('Starting incubation for '+pc.label+' pendingIncubation is ' + this.pendingIncubation + ' state is '+this.state);

			this.sendResponse('incubation_start', pc);

			// destroy item
			stack.apiConsume(1);

			//return this.incubating;
			return true;
		}

		return false;
	}
};

verbs.name = { // defined by npc_chicken
	"name"				: "name",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Give this Chicken a name",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (!this.user_name && this.canName(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true
		};

		this.askPlayer(pc, 'name', 'Name Me!', args);
		return true;
	}
};

verbs.rename = { // defined by npc_chicken
	"name"				: "rename",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Change this Chicken's name",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.user_name && this.canName(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true
		};

		if (this.user_name) args.input_value = this.user_name;

		this.askPlayer(pc, 'name', 'Rename Me!', args);
		return true;
	}
};

verbs.squeeze = { // defined by npc_chicken
	"name"				: "squeeze",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Obtain grain. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('is_announcement') == 1) return {state:null};
		if (this.isRooked()) return {state:null};
		if (this.incubating) {
			return {state:'disabled', reason:"What kind of weirdo squeezes an incubating chicken?"};
		}
		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Chicken is sad!."};
		}
		var ret = this.canSqueeze(pc);
		if (!ret['ok']){
			return {state:'disabled', reason: "You can only squeeze this "+this.name_single+" "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('ak_chicken_squeeze');
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.stopMoving();

		pc.runSkillPackage('ak_chicken_squeeze', this, {word_progress: config.word_progress_map['squeeze'], overlay_id: 'chicken_squeeze', callback: 'onSqueezeComplete', msg: msg});

		this.ai_debug_display('Squeeze for '+pc.label+' pendingIncubation is ' + this.pendingIncubation  + ' isFlying '+this['!is_flying']);

		return true;
	}
};

function canSqueeze(pc){ // defined by npc_chicken
	var package_class = 'ak_chicken_squeeze';
			
	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
			
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
			
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function checkChickenSticks(){ // defined by npc_chicken
	// Check for magic chicken sticks on the level
	//log.info("PS checking for chicken sticks");
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "magic_chicken_stick" && it.is_placed){
			var dist = parseInt(it.getInstanceProp('distance'));

			this.ai_debug_display("Setting movement limits "+dist);
			//log.info("PS setting movement limits on chicken "+this);
			this.setMovementLimits(it.x, it.y, dist);
		}
	}
}

function clearMovementLimits(){ // defined by npc_chicken
	this.ai_debug_display("Clearing movement limits");

	delete this.move_limits;
}

function fly(){ // defined by npc_chicken
	if (this.isRooked()) return;
	if (this.isSad()) return;
	if (this.isWaiting) return;

	// Don't fly if outside the move limits
	/*if (this.move_limits) { 
		this.ai_debug_display("fly: checking move limits");
		if (this.x < (this.move_limits.x - this.move_limits.w)) { this['!is_flying'] = false; return; }
		if (this.x > (this.move_limits.x + this.move_limits.w)) { this['!is_flying'] = false; return; }
	}*/


	this.ai_debug_display('fly: isWaiting '+this.isWaiting+' pendingIncubation '+this.pendingIncubation);

	if (this.getInstanceProp('is_announcement') == 1){

		if (!this.announcement_start) this.announcement_start = this.x;

		if (this.x < this.announcement_start){
			var vx = 50;
		}
		else{
			var vx = -50;
		}

		if (!this.announcement_switch){
			var text = "Hey! Get a preview of the NEW Groddle Forest by following this signpost ...";
			this.announcement_switch = 1;
		}
		else{
			var text = "... this is a preview of a new area in active development. if you run into any strangeness, let us know.";
			this.announcement_switch = 0;
		}

		this.sendBubble(text, 6*1000);
	}
	else{
		var vx = randInt(-100, 100);
		//this.sendBubble('Squawk!', 1*1000);
	}

	this.apiStopMoving();
	this.state = 'flying';
	var vy = -200;
	if (vx < 0){
		this.dir = 'left';
	}
	else{
		this.dir = 'right';
	}

	// Only use a small velocity so chicken is less likely to escape from move limits
	if (this.move_limits) { 
		vx = vx / 2;
		vy = vy / 3;
	}

	this.apiKickTheChicken(vx, vy);
	this['!is_flying'] = true;

	this.apiSetTimer('onInTheAir', 2000);
}

function freeChicken(){ // defined by npc_chicken
	if(this.user_name) {
		this.free_pc.sendActivity("The chicken named "+this.user_name+" has gone to enjoy its life in the wilderness.");
	} else {
		this.free_pc.sendActivity("Your chicken has gone to enjoy its life in the wilderness.");
	}

	this.apiDelete();
}

function giveIncubatedItem(pc){ // defined by npc_chicken
	if (this.egg_class == 'piggy_egg'){
		var item_class = 'piglet';
	}
	else if (this.egg_class == 'butterfly_egg'){
		var item_class = 'caterpillar';
	}
	else if (this.egg_class == 'chicken_egg'){
		var item_class = 'chick';
	}
	else{
		log.error('Chicken '+this+' incubated unknown egg class: '+this.egg_class+' for player '+pc);
		this.resetIncubation();
		this.startMoving();
		return;
	}

	this.state = 'idle_stand';

	var num = 1;
	if (pc.imagination_has_upgrade('animal_husbandry_twin_animals_2')){
		if (is_chance(0.1) || pc.buffs_has('max_luck')) num = 2;
	}
	else if (pc.imagination_has_upgrade('animal_husbandry_twin_animals_1')){
		if (is_chance(0.05) || pc.buffs_has('max_luck')) num = 2;
	}

	log.info('Chicken '+this+' gave player '+pc+' incubated item '+item_class+' ('+num+')');
	pc.createItemFromSource(item_class, num, this);
	if (num > 1) pc.sendActivity("You got a bonus baby animal!");
	pc.feats_increment('animal_love', 1);

	var death = this.removeLifePoints(pc, 10);

	if (death.dying){
		var slugs = { xp: death.xp };
		this.sendResponse('ascend_to_higher_plain', pc, slugs);
	}

	pc.achievements_increment('eggs_incubated', this.egg_class);
			
	this.resetIncubation();
	this.startMoving();
}

function isEgg(item){ // defined by npc_chicken
	return in_array(item.class_tsid, ['piggy_egg', 'butterfly_egg', 'chicken_egg']) ? true : false;
}

function leave(){ // defined by npc_chicken
	this.apiDelete();
}

function modal_callback(pc, value, details){ // defined by npc_chicken
	if(value == 'ok') {

		var slugs = {};

		var val = pc.metabolics_add_mood(20);
		slugs.mood = val;

		val = pc.metabolics_lose_energy(5);
		slugs.energy = val;

		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			swf_url: overlay_key_to_url('smoke_puff'),
			delay_ms: 2500,
			delta_y: 95,
			follow: true,
			allow_bubble: true,
			duration: 1500
		});
		this.sendResponse('set_free_in_pol', pc, slugs);
		this.apiSetTimer('freeChicken', 3000);
	}
}

function onCancelSkillPackage(pc){ // defined by npc_chicken
	this.isWaiting = false;

	if (this['!is_flying']) { 
		this.fly();
	}
	else { 
		this.startMoving();
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_chicken
	if (!oldContainer) this.broadcastStatus();

	this.checkChickenSticks();
}

function onContainerItemAdded(addedItem, oldContainer){ // defined by npc_chicken
	if (addedItem.class_tsid == this.class_tsid){
		this.onSadnessCheck();
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by npc_chicken
	// Clear data if the chicken stick is removed.
	if (item && item.class_tsid == 'magic_chicken_stick' && item.is_placed) {
		this.ai_debug_display("Clearing movement limits");
		this.clearMovementLimits();
		this.fly();
	}
	else if (item && item.class_tsid == this.class_tsid){
		this.onSadnessCheck();
	}
}

function onCreate(){ // defined by npc_chicken
	this.initInstanceProps();
	this.parent_onCreate();

	this.npc_can_climb = false;
	this.npc_can_jump = true;
	this.npc_can_fall = true;

	this.npc_walk_speed = 45;

	this.resetIncubation();
	this['!is_flying'] = false;
	this.apiSetTimer('onPause', randInt(3000, 11000));

	this.broadcastStatus();
}

function onDonePathing(){ // defined by npc_chicken
	// This function is called when the pathfinding gets as close as it can to the destination point.
	this.endX = this.x;

	//log.info("CHICK "+this+" start "+this.startX+" end "+this.endX);

	if (this.startX) {
		
		// Check for chickens on short platforms.
		/*var bounds = this.container.apiGetPlatBoundsBelow(this.x, this.y);
		if (bounds) {
			log.info(this+" CHICK bounds "+bounds);
			if (Math.abs(bounds.left.x - bounds.right.x) < 300) {
				//log.info("CHICK stuck");
				this.onStuck();
			}
		}*/


		this.startX = null;
		this.endX = null;
	}
}

function onIncubationComplete(){ // defined by npc_chicken
	this.incubation_complete = 1;

	// Where they at?
	var targetPC = this.container.activePlayers[this.player_tsid];
	if (targetPC){
		log.info(this+' incubation player '+targetPC+' found');
		this.sendResponse('incubation_complete', targetPC);
		if (this.distanceFromPlayer(targetPC) <= 100){
			this.giveIncubatedItem(targetPC);
		} else {
			this.apiFindPath(targetPC.x, targetPC.y, 0, 'onIncubationPathing');
			this.state = 'walk';
		}
	}
	else{
		log.info(this+' incubation player '+this.player_tsid+' NOT found');
		this.resetIncubation();
		this.startMoving();
	}
}

function onIncubationHalfway(){ // defined by npc_chicken
	this.sendBubble("I'm almost done with this thing.", 10*1000);
}

function onIncubationPathing(args){ // defined by npc_chicken
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		this.state = 'idle_stand';
		
		// Is our target player nearby?
		var targetPC = this.container.activePlayers[this.player_tsid];
		if (targetPC && this.distanceFromPlayer(targetPC) <= 100){
			this.giveIncubatedItem(targetPC);
		}
		// Are they still here somewhere?
		else if (targetPC){
			this.apiFindPath(targetPC.x, targetPC.y, 0, 'onIncubationPathing');
			this.sendBubble("I have something for "+this.player_name, 10*1000);
		}
		// Guess they're gone
		else{
			this.resetIncubation();
		}

		this.startMoving();
	}

	if (args.status == 1){
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

function onInTheAir(){ // defined by npc_chicken
	this.ai_debug_display('onInTheAir: isWaiting '+this.isWaiting+' pendingIncubation '+this.pendingIncubation);

	if (this['!is_flying']){
		this.state = 'flying_no_feathers';
	}
}

function onLadderLanding(){ // defined by npc_chicken
	//log.info(this.tsid+' landed on a ladder');
	this.state = 'land_on_ladder';
	this['!is_flying'] = true;

	this.ai_debug_display('Landing on ladder, pendingIncubation is ' + this.pendingIncubation);
}

function onLadderTakeoff(){ // defined by npc_chicken
	this.ai_debug_display('ladder takeoff: isWaiting '+this.isWaiting+' pendingIncubation '+this.pendingIncubation);

	this.state = 'flying_back';
	this['!is_flying'] = true;
}

function onLanding(){ // defined by npc_chicken
	this.checkChickenSticks();

	if (this.pendingIncubation == 1) {

		this.apiStopMoving();
		this.state = 'sit';

		this.incubating = 1;
			
		this.apiSetTimer('onIncubationHalfway', 30 * 1000);
		this.apiSetTimer('onIncubationComplete', 60 * 1000);

		this.pendingIncubation = 0;
	}


	this.ai_debug_display('Landing, pendingIncubation is ' + this.pendingIncubation);
}

function onLoad(){ // defined by npc_chicken
	if (this.locationIsDepressing()) {
		this.apiSetTimer('leave', 1000);
	}
}

function onOverlayDismissed(pc, payload){ // defined by npc_chicken
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPathing(args){ // defined by npc_chicken
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
				this.onPause();
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

function onPause(){ // defined by npc_chicken
	this.ai_debug_display('onPause: isWaiting '+this.isWaiting+' pendingIncubation '+this.pendingIncubation + ' isFlying '+this['!is_flying'] );

	if (this.container.getNumActivePlayers()){
		if (!this['!is_flying'] && !this.incubating && this.state != 'idle_stand' && !this.isRooked() && !this.is_sad){
			this.apiStopMoving();
			var choice = choose_one(this.pause_state_choices);
			this.state = choice[1];
			log.info("CHICK: state is "+this.state+" for "+this.class_id);

			if (is_chance(0.5)){
				this.turnAround();
			}
			this.broadcastState();
			
			if (this.move_limits) { 
				var secs =  choice[0];

				if (is_chance(.75)) { 
					this.apiSetTimer('onPause', secs*1000);
				}
				else { 
					this.apiSetTimer('startMoving', secs * 1000);
					this.apiSetTimer('onPause', (secs*1000) + randInt(600, 2000));
				}

				return;
			}
			else { 

				/*var bounds = this.container.apiGetPlatBoundsBelow(this.x, this.y);
				if (bounds) {
					log.info(this+" CHICK bounds "+bounds);
					if (Math.abs(bounds.left.x - bounds.right.x) < 150) {
						if (is_chance(0.80)) {
							this.onPause();
						}
					}
				}
				else {*/
					this.apiSetTimer('startMoving', choice[0] * 1000);
				//}
			}
			
		}
		else if (this.incubating) {
			// Problems with incubating lingering. Log them and correct
			var inc_pc = getPlayer(this.player_tsid);
			if(!inc_pc || !inc_pc.isOnline() || inc_pc.location != this.container) {
				log.info("Chicken "+this+" still incubating for player "+this.player_tsid+" even though they are gone.");
				this.resetIncubation();
			}
		}

		
		this.apiSetTimer('onPause', randInt(6000, 14000));
		
	} else if (!this['!is_flying']) {
		this.apiStopMoving();
		this.pathfinding_paused = true;
	}
}

function onPlatformLanding(){ // defined by npc_chicken
	this['!is_flying'] = false;

	this.onLanding();

	if(this.incubating) {
		this.apiStopMoving();
		this.state = 'sit';
	} else {
		this.state = 'land';

		if (this.getInstanceProp('is_announcement') == 1){
			this.apiSetTimer('fly', 2 * 1000);
		}
		else{
			this.apiSetTimer('startMoving', 1 * 1000);
		}
	}
}

function onPlayerCollision(pc){ // defined by npc_chicken
	apiResetThreadCPUClock();
	if (this.getInstanceProp('is_announcement') == 1) return;
	if (this.isRooked()) {
		this.rookedCollision(pc);
		return;
	}

	// Is this the player we're looking for?
	if (this.incubation_complete && this.player_tsid == pc.tsid){
		this.giveIncubatedItem(pc);
		apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
		return;
	}

	// No scaring when incubating
	if (this.incubating){
		apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
		return;
	}

	if (this.conversations && !this.isRooked()){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}

	// Did we get scared?
	var chance = 0.75;
	if (pc.skills_has('animalkinship_1')){
		chance = 0.25;
	}

	if (this.container.tsid == 'LM41026L4057N'){ chance = 1; }

	if (is_chance(chance)){
		this.fly();
		this.sendBubble('Squawk!', 1*1000);
		pc.achievements_increment('chickens', 'scared');
	}

	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc_chicken
	this.parent_onPlayerEnter(pc);

	if ( this.pathfinding_paused) {
		delete this.pathfinding_paused; 

		this.apiSetTimer('onPause', randInt(6000, 14000));

		if (this['!is_flying']) { 
			this.fly();
		}
		else { 
			this.startMoving();
		}
	}
	else if (!this.apiTimerExists('onPause')) { 
		this.apiSetTimer('onPause', randInt(6000, 14000));
	}
}

function onPlayerExit(pc){ // defined by npc_chicken
	this.parent_onPlayerExit(pc);

	if(this.incubating) {
		if(pc.tsid == this.player_tsid) {
			this.resetIncubation();
		}
	}
}

function onPropsChanged(){ // defined by npc_chicken
	if (intval(this.getInstanceProp('is_announcement')) == 1){
		this.npc_walk_speed = 0;
		this.stopMoving();
		this.fly();
	}
	else{
		this.npc_walk_speed = 45;
		this.startMoving();
	}
}

function onPrototypeChanged(){ // defined by npc_chicken
	if (this.locationIsDepressing()) {
		this.leave();
	}
}

function onRevived(){ // defined by npc_chicken
	this.startMoving();
}

function onRooked(){ // defined by npc_chicken
	// fall to the closest platline
	var pl = this.container.apiGetClosestPlatformLineBelow(this.x, this.y-1);
	if (pl){
		this.apiSetXY(this.x, pl.y1);
	}

	this.apiSetTimer('onRookedInterval', 2000);
}

function onRookedInterval(){ // defined by npc_chicken
	if (!this.isRooked()){
		return;
	}

	if (!this['!rooked_tick']){
		this.setAndBroadcastState('rooked2');
		this['!rooked_tick'] = 1;
		var duration = 2000;
	}
	else{
		this.setAndBroadcastState('rooked1');
		this['!rooked_tick'] = 0;
		var duration = 2000;
	}

	this.apiSetTimer('onRookedInterval', duration);
}

function onSqueezeComplete(pc, ret){ // defined by npc_chicken
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	//log.info("onSqueezeComplete "+this);

	if (ret['ok']){
		var death = this.removeLifePoints(pc,1);
		var slugs = ret.slugs;

		if (death.xp){
			if (!slugs.xp){
				slugs.xp = death.xp;
			} else {
				slugs.xp+=death.xp;
			}
		}

		// boring stuff that happened
		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: ret.values['energy_cost']
		});

		if (ret.values['mood_bonus']){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: ret.values['mood_bonus']
			});
		}

		if (ret.values['xp_bonus']){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: ret.values['xp_bonus']
			});
		}

		if (death.dying){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: 50
			});
		}

		var proto = apiFindItemPrototype('grain');

		// oooo, grain!
		var grain_count = ret.details['bonus_amount'];

		// chance of bonus grain, if we don't get the drop.
		if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck'))){
			var harvest_effects = [];
			var bonus_items = grain_count * (ret.details['bonus_multiplier'] - 1);
		
			harvest_effects.push({
				"type"	: "item_give",
				"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
				"value"	: bonus_items
			});

			var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, they_effects);
		
			pc.createItemFromOffsetDelayed('grain', bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
			pc.show_rainbow('rainbow_superharvest', 1000);

			pc.quests_inc_counter('chicken_squeeze_max_reward', 1);

			if (death.dying){
				this.sendResponse('ascend_to_higher_plain', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_4')){
				this.sendResponse('squeeze_bonus_ak3', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_5')){
				this.sendResponse('squeeze_bonus_ak4', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_6')){
				this.sendResponse('squeeze_bonus_ak5', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_7')){
				this.sendResponse('squeeze_bonus_ak6', pc, slugs);
			}
			else{
				this.sendResponse('squeeze_bonus_ak7', pc, slugs);
			}
		}
		else{
			if (death.dying){
				this.sendResponse('ascend_to_higher_plain', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_2')){
				this.sendResponse('squeeze_ak1', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_4')){
				this.sendResponse('squeeze_ak2_ak3', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_6')){
				this.sendResponse('squeeze_ak4_ak5', pc, slugs);
			}
			else{
				this.sendResponse('squeeze_ak6_ak7', pc, slugs);
			}
		}

		if (this.isOnGround()){
			var val = pc.createItemFromSource("grain", grain_count, this);
		}else{
			var val = pc.createItem("grain", grain_count);
		}

		self_effects.push({
			"type"	: "item_give",
			"which"	: "grain",
			"value"	: grain_count
		});

		if (!slugs.items) slugs.items = [];
		slugs.items.push({
			class_tsid	: 'grain',
			label		: proto.label,
			count		: grain_count,
			//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
		});

		pc.achievements_increment('chicken', 'squoze');
		pc.announce_sound('CHICKEN_SQUEEZED');
		this.broadcastStatus();
		pc.location.cultivation_add_img_rewards(pc, 4.0);
		pc.feats_increment('animal_love', 1);

		if (this.container.eventFired) this.container.eventFired('verb_squeeze_success', this);
	}
	else{
		failed = 1;
		this.isWaiting = 0;
		pc.announce_sound('CLICK_FAILURE');
		if (this.container.eventFired) this.container.eventFired('verb_squeeze_fail', this);
	}

	var pre_msg = this.buildVerbMessage(this.count, 'squeeze', 'squeezed', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	if (this['!is_flying']) {
		this.fly();
	}
	else {
		this.startMoving();
	}
}

function onStatus(pc){ // defined by npc_chicken
	var is_rook_verbs = this.isRooked();
	var is_tend_verbs = !is_rook_verbs;

	var status = {
		is_rook_verbs: is_rook_verbs,
		is_tend_verbs: is_tend_verbs,
		verb_states: {}
	};

	if (pc){
		var ret = this.canSqueeze(pc);
		if (ret['ok'] && !this['!is_flying'] && this.getInstanceProp('is_announcement') != 1 &&
				 !this.isRooked() && !this.incubating && !this.isSad()) {
			status.verb_states['squeeze'] = {
				enabled: !this.isRooked(),
				disabled_reason: '',
				warning: false,
				item_class: "grain"
			};
		}
	}

	return status;
}

function onStuck(){ // defined by npc_chicken
	this.fly();

	this.ai_debug_display('Stuck!');
}

function onVerbMenuOpen(pc){ // defined by npc_chicken
	if(this.isRooked()) {
		this.cancelRookConversation(pc);
	}
}

function onWaitEnd(){ // defined by npc_chicken
	if (this.isRooked()) return;
	if (this.isSad()) return;

	if (!this.incubating && !this['!is_flying']){
		this.startMoving();
	}
}

function onWaitStart(){ // defined by npc_chicken
	if (this.isRooked()) return;
	if (this.isSad()) return;


	if ((!this['!is_flying'] && !this.incubating)){
		this.apiStopMoving();
		this.state = 'verb';
	}
}

function removeLifePoints(pc, points){ // defined by npc_chicken
	this.ai_debug_display('removeLifePoints: isWaiting '+this.isWaiting+' pendingIncubation '+this.pendingIncubation);

	if (!this.instanceProps || !this.instanceProps.life_points) this.initInstanceProps();
	if (typeof this.instanceProps.life_points == 'undefined' || this.instanceProps.life_points == ''){
		this.instanceProps.life_points = 2000;
	}

	// For public streets, only remove life if there is more than one chicken on the street:
	var population = this.container.countItemClass(this.class_tsid);
	if(this.container.pols_is_pol() || population > 1) {
		this.instanceProps.life_points -= points;
	}

	if (this.instanceProps.life_points <= 0){
		var xp_bonus = 50;
		pc.stats_add_xp(xp_bonus, false, {'verb':'removeLifePoints','class_id':this.class_tsid});
		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			swf_url: overlay_key_to_url('smoke_puff'),
			delay_ms: 5500,
			delta_y: 95,
			follow: true,
			duration: 1500
		});
		this.apiSetTimer('leave', 6000);
		return { xp: 50, dying: true };
	} else {
		return { xp: 0, dying: false };
	}
}

function resetIncubation(){ // defined by npc_chicken
	log.info('Resetting incubation');
	this.incubating = 0;
	this.incubation_complete = 0;
	this.player_name = null;
	this.player_tsid = null;
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc_chicken
	//log.info("PS Calling apiFindPath on "+this);

	// Don't do anything if the limits haven't changed.
	if (this.move_limits && this.move_limits.x === x_pos && this.move_limits.y === y_pos && this.move_limits.w === width) 
	{ 
		return; 
	}

	if (Math.abs(this.x - x_pos) < 20) { 
		// Really close, don't try to pathfind because it will fail.
		//log.info("PS setting move limits");
		this.parent_setMovementLimits(x_pos, y_pos, width);

		// If chicken was flying, put them back in flying state
		if (this['!is_flying']) { 
			this.fly();
		}
	}
	else if (this.apiFindPath(x_pos, y_pos, 1, 'onPathing') 
		|| this.apiFindPath(x_pos - (width - 5), y_pos, 1, 'onPathing') 
		|| this.apiFindPath(x_pos + (width - 5), y_pos, 1, 'onPathing')) {
		//log.info("PS setting move limits - pathfinding");
		this.parent_setMovementLimits(x_pos, y_pos, width);

		// If chicken was flying, put them back in flying state
		if (this['!is_flying']) { 
			this.fly();
		}
		else if (this.incubating) {
			this.apiStopMoving();
			this.state = 'sit';
		}
	}
	else { 
		this.ai_debug_display("Can't reach stick");
		//log.info("PS clearing move limits");
		this.clearMovementLimits();
	}
}

function startMoving(){ // defined by npc_chicken
	// Don't move if we're incubating
	if(this.incubating) {
		this.ai_debug_display("Not moving because I'm incubating.");
		return;
	}

	if (this['!is_flying']) {
		this.ai_debug_display('Canceling path find while in flight!');
		return;
	}

	this.startX = this.x;

	if (this.move_limits) {
		this.startMovingLimited();
	}
	else {
		this.ai_debug_display("No move limits");
		this.parent_startMoving();
	}

	// Check once a minute for achievements
	if (time() - this['!achievement_check'] >= 60){
		// How many chickens are here?
		var chickens = 0;
		for (var i in this.container.items){
			if (this.container.items[i].class_tsid == 'npc_chickens') chickens++;
		}

		if (chickens >= 3){
			pc.achievements_grant('chicken_tender');
		}

		if (chickens >= 11){
			pc.achievements_grant('better_chicken_tender');
		}

		this['!achievement_check'] = time();
	}
}

function startMovingLimited(){ // defined by npc_chicken
	// A copy of the walkable NPC startMoving() method, with modifications for move limits.
	// Can be moved up to NPC walkable if necessary later.

	if (this.isRookable() && this.isRooked()) return;
	if (this.isSad && this.isSad()) return;
	if (this.isWaiting) return; 

	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}


	var max_left = this.container.geo.l + 100;
	var max_right = this.container.geo.r - 100;

	if (!this.move_limits) { 
		//log.error("Chicken called startMovingLimited with no move limits");

		var left = max_left;
		var right = max_right;	
	}
	else { 
		var left = this.move_limits.x - this.move_limits.w;
		var right = this.move_limits.x + this.move_limits.w;
	}

	// In the case that the animal stick position is too close to the edge, shift the entire 
	// range over instead of shortening it. Also, make the side the position of the animal stick 
	// with no threshold.

	var shift = 0;

	if (left < max_left) { 
		if (this.move_limits) { 
			if (this.move_limits.x < max_left) { 
				max_left = this.move_limits.x;
			}

			shift = max_left - left;
			left = max_left;
		}
		else { 
			shift = max_left - left;
			left = max_left;
		}
	}

	right += shift;
	if (right > max_right) { 
		// Shift be 0 if we hit this case
		if (this.move_limits.x > max_right) { 
			max_right = this.move_limits.x;
		}

		shift = max_right - right;
		right = max_right;

		left += shift; 
	}


	if (this.pathfinding_paused) delete this.pathfinding_paused;

	if (!this.classProps || !this.classProps.walk_type || this.classProps.walk_type == 'edge_to_edge'){

		this.ai_debug_display("Walking edge to edge "+left+" "+right+" max_right "+max_right+" max_left "+max_left+" shift "+shift);
		
		if (this.go_dir == 'left' && left != this.x){
			
			if (!this.apiFindPath(left, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}else if (right != this.x){
			
			if (!this.apiFindPath(right, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}
		else{
			this.onStuck();
		}
	}
	else{
		log.error('Unknown walk type: '+this.classProps.walk_type);
	}
}

// global block from npc_chicken
// How long and what state to pause in. Chosen randomly.
var pause_state_choices = [
	[4, 'idle1'],
	[4, 'idle1'],
	[4, 'idle1'],
	[4, 'idle2'],
	[4, 'idle3'],
	[4, "pause"],
	[3, "pecking_twice"],
	[2, "pecking_once"],
];

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

function npc_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function npc_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function conversation_canoffer_chickens_cautionary_tales_1(pc){ // defined by conversation auto-builder for "chickens_cautionary_tales_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.stats.level >= 2) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
			return true;
	}
	return false;
}

function conversation_run_chickens_cautionary_tales_1(pc, msg, replay){ // defined by conversation auto-builder for "chickens_cautionary_tales_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "chickens_cautionary_tales_1";
	var conversation_title = "The Chicken's Cautionary Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['chickens_cautionary_tales_1-0-2'] = {txt: "Riiiiiiight.", value: 'chickens_cautionary_tales_1-0-2'};
		this.conversation_start(pc, "Beware the ides of Tii.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_1', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_1-0-2"){
		choices['1']['chickens_cautionary_tales_1-1-2'] = {txt: "Explosionings.", value: 'chickens_cautionary_tales_1-1-2'};
		this.conversation_reply(pc, msg, "You don’t believe me? Fine. Just come the ides of Tii, you’ll see. Anything can happen: poisonings, insanification, spontaneous explosionings…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_1', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_1-1-2"){
		choices['2']['chickens_cautionary_tales_1-2-2'] = {txt: "Sounds like it. When are the ides of Tii?", value: 'chickens_cautionary_tales_1-2-2'};
		this.conversation_reply(pc, msg, "…gravity sucks and sudden baldness. I’ve seen it all. I’ve seen it all. You watch your step on the ides of Tii.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_1', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_1-2-2"){
		choices['3']['chickens_cautionary_tales_1-3-2'] = {txt: "Brilliant. Thanks. Consider me beworn.", value: 'chickens_cautionary_tales_1-3-2'};
		this.conversation_reply(pc, msg, "I look like I know? I couldn’t tell you. They’re dangerous, though. Beware them. Beware. Beware the ides of Tii.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_1', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_1-3-2"){
		choices['4']['chickens_cautionary_tales_1-4-2'] = {txt: "Great.", value: 'chickens_cautionary_tales_1-4-2'};
		this.conversation_reply(pc, msg, "Not a problem.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_1', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_ages_of_the_world_1(pc){ // defined by conversation auto-builder for "ages_of_the_world_1"
	var chain = {
		id: "ages_of_the_world",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.conversations_has_completed(null, "chickens_cautionary_tales_1")) && (pc.conversations_has_completed(null, "the_bubble_conspiracies_1")) && (pc.conversations_has_completed(null, "piggy_tales_1"))){
			return true;
	}
	return false;
}

function conversation_run_ages_of_the_world_1(pc, msg, replay){ // defined by conversation auto-builder for "ages_of_the_world_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "ages_of_the_world_1";
	var conversation_title = "The Ages of the World";
	var chain = {
		id: "ages_of_the_world",
		level: 1,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['ages_of_the_world_1-0-2'] = {txt: "Eleven?", value: 'ages_of_the_world_1-0-2'};
		this.conversation_start(pc, "“The universe as you know it? This world that you walk through? It may have only existed in this manifestation for a while, but it’s been through exactly eleven eras before this, one for each giant. ", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_1', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_1-0-2"){
		choices['1']['ages_of_the_world_1-1-2'] = {txt: "Never?", value: 'ages_of_the_world_1-1-2'};
		this.conversation_reply(pc, msg, "That’s all I know, passed down to me by eleven eras of eleven generations of chickens born under the sign of Alph, and chickens never lie.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_1', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_1-1-2"){
		choices['2']['ages_of_the_world_1-2-2'] = {txt: "I see.", value: 'ages_of_the_world_1-2-2'};
		this.conversation_reply(pc, msg, "Chickens never lie.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_1', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_chickens_cautionary_tales_2(pc){ // defined by conversation auto-builder for "chickens_cautionary_tales_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "ages_of_the_world_3")){
			return true;
	}
	return false;
}

function conversation_run_chickens_cautionary_tales_2(pc, msg, replay){ // defined by conversation auto-builder for "chickens_cautionary_tales_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "chickens_cautionary_tales_2";
	var conversation_title = "The Chicken's Cautionary Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['chickens_cautionary_tales_2-0-2'] = {txt: "Yowch.", value: 'chickens_cautionary_tales_2-0-2'};
		this.conversation_start(pc, "During, I believe, the eleventy-millennia war, whole clusters of chickens were clustered together and used as projectiles in a heated argument between Tii and Zille. The mess. Oh, the mess.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_2', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_2-0-2"){
		choices['1']['chickens_cautionary_tales_2-1-2'] = {txt: "Buk indeed.", value: 'chickens_cautionary_tales_2-1-2'};
		this.conversation_reply(pc, msg, "I know. Like feathery snowballs they were. Buk.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_2', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_2-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_chickens_cautionary_tales_3(pc){ // defined by conversation auto-builder for "chickens_cautionary_tales_3"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "chickens_cautionary_tales_2")){
			return true;
	}
	return false;
}

function conversation_run_chickens_cautionary_tales_3(pc, msg, replay){ // defined by conversation auto-builder for "chickens_cautionary_tales_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "chickens_cautionary_tales_3";
	var conversation_title = "The Chicken's Cautionary Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['chickens_cautionary_tales_3-0-2'] = {txt: "Sorry, up the whatnow?", value: 'chickens_cautionary_tales_3-0-2'};
		this.conversation_start(pc, "In the Golden age of Cosma, there was none of this ‘incubation’ business. No one ever made you sit on things till you got a snout up the wazzoo.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_3', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_3-0-2"){
		choices['1']['chickens_cautionary_tales_3-1-2'] = {txt: "I hear ya.", value: 'chickens_cautionary_tales_3-1-2'};
		this.conversation_reply(pc, msg, "Doy! You heard already! Wazzoo. Wazzoo! Ah, no respect at all. Times have changed, I tell you. Changed.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'chickens_cautionary_tales_3', msg.choice);
	}

	if (msg.choice == "chickens_cautionary_tales_3-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"chickens_cautionary_tales_1",
	"ages_of_the_world_1",
	"chickens_cautionary_tales_2",
	"chickens_cautionary_tales_3",
];

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

function parent_onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function parent_onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function parent_onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
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

function parent_clearMovementLimits(){ // defined by npc
	delete this.move_limits;
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

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function parent_setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Chickens can be squeezed for <a href=\"\/items\/252\/\" glitch=\"item|grain\">Grain<\/a>."]);
	out.push([2, "Chickens can incubate Seasoned Eggs into Animals if you have the <a href=\"\/skills\/30\/\" glitch=\"skill|animalhusbandry_1\">Animal Husbandry<\/a> skill."]);
	out.push([2, "Chickens can be grown from <a href=\"\/items\/279\/\" glitch=\"item|chick\">Chicks<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"animal",
	"no_trade",
	"npc-animal"
];

var responses = {
	"ascend_to_higher_plain": [
		"Next time, I'm coming back as a piggy!",
		"Peace! Merciful, unsqueezable peace. Ah…",
		"Thanks! Released from this squeezy, egg-sitty toil. Finally.",
		"So long a life, so many squeezes, so many eggs.",
		"Is it over? Really? Oh, thank you. You, I like.",
		"I'll miss the squeezes. I suppose.",
		"Goodbye, cruel-ish world.",
		"That was it? Life? Meh. Could've been worse.",
		"I get to go?!? Happy! I'm happy! This is what happy must be like!",
		"I've no more grain to give. My last egg is sat. Now, I rest.",
	],
	"incubation_complete": [
		"Ping!",
		"Done! What were you expecting, 3 1\/2 minutes?",
		"Buk! It bit my butt! You owe me a beer.",
		"Here. Another new life. A miracle. Thank me later.",
		"Ta DA!",
	],
	"incubation_start": [
		"Now the chicken is superior, eh? Wait here ONE MINUTE and I'll give it back.",
		"No squeezing while I sit? Ok deal. But, you can't leave for a whole minute. Stay, if you want your animal.",
		"Well, comfortable it isn't... but ok. Deal is that you have to wait a full minute.",
		"I'm egg-static to be of service. That was sarcasm. But whatever ... if you stick around for a minute I'll get 'er done.",
		"At least you appreciate my warm underfeatheredside.  Love it! Also, stick around for sixty seconds or lose it!",
	],
	"revived_1st_time": [
		"A little better but still it hurts! Please? Anyone else who can help?",
		"Oy oy oy. Still, the pain it comes. More reviving?",
		"A little revived, but if you could spare a little more? Maybe? Anyone?",
		"I ask you: all those eggs we've incubated? You can't help a little more?",
	],
	"revived_2nd_time": [
		"Getting there, but just a little more help for a loyal chicken?",
		"That's it? You're  done? You can't maybe just revive me a little more?",
		"Oh, the pain in my poor beak, it still remains. A little more help?",
	],
	"revived_3rd_time": [
		"Thanks be to {pc_label} for reviving me. It's about time.",
		"You're a good Glitch, {pc_label}. You give them all a good name.",
		"The chickens thank you, {pc_label}. You, we like.",
	],
	"rooked": [
		"I told you! I told you this would happen. I've been rooked. HELP!!!",
		"Don't just stand there! Help why don't you?! I'm ROOKED here!",
		"ROOKED!!! FOR THE LOVE OF THE GIANT DO SOMETHING!",
		"My gizzards are falling out! HELP! Revive me!",
		"My wings! So hot! So crispy! HELP ME!",
	],
	"set_free_in_pol": [
		"What-what? Freedom? FREEDOM!",
		"That's it? No \"Thanks\"? No \"Great work, Chicken\"? Feh!",
		"Eh? Oh. Well, thanks for having me. It's been… interesting.",
	],
	"squeeze_ak1": [
		"Yeeeeeeeeeeeeeks!",
		"Oh my beak and giblets, you scared me!",
		"You made me drop my GRAIN, squeezefiend!",
		"Squeeze. Grain. Grain. Squeeze. It's a chicken's life.",
		"BUK! Take the grain! Take it!",
	],
	"squeeze_ak2_ak3": [
		"Again with the squeezing?!?",
		"So take it - I didn't want that grain anyway.",
		"Squeezed again? Oy. Such imagination you show.",
		"What IS this, the world chicken wrestling featheration?",
		"One day, chickens squeeze YOU.",
		"Another squeeze? Really?!?",
		"HELP! Chickenmuggings!",
		"Fine. Take it. And enjoy, grain-finagler.",
		"Buk-buk-buk. That what you want to hear?",
		"Squeeze squeeze squeeze squeeze squeeze. Buk.",
	],
	"squeeze_ak4_ak5": [
		"Not so hard, you'll tangle my intestinal noodles.",
		"Yes, because chickens don't need personal space too? Pah.",
		"Consider my feathers ruffled. Buk.",
		"Chicken-ruffler! Alarm! Alarm!",
		"Always with the squeezing!",
		"Oh look. It's Chicken Wrestler. Again.",
		"Rummage all you like, I've only got grain.",
		"Grain! Grain if you'll stop!",
		"Buk! Off! Get off! Buk buk.",
		"Do YOU like to be squeezed by random strangers? Hmn?",
	],
	"squeeze_ak6_ak7": [
		"Oooh, CHASE ME!",
		"Chicken-botherer begone! Take the grain already!",
		"Consider me squeezed. Squoozed? Squzz?",
		"Psssst! I don't mind really.",
		"One day: revenge. Until that day: grain.",
		"Buy grain on auction, maybe? No? Just squeezing? OK!",
		"Oh go on then: one more squeeze. Hic!",
	],
	"squeeze_bonus_ak3": [
		"Take it! Take it ALL!",
		"Well done you.",
		"All the grain. Happy?",
		"If give you this, will you hold off on the squeezing?",
		"Take it all! Take it and go!",
	],
	"squeeze_bonus_ak4": [
		"So now you want extra? Buk.",
		"Like you deserve this, squeezy scourge of chicken.",
		"Happy now?",
		"Congrainulations, you superscored.",
		"STOP SQUEEZING ME!",
	],
	"squeeze_bonus_ak5": [
		"THERE! Anything else? Arm? Leg? Gravy? Peh.",
		"Happy chickenannoying day.",
		"My little hot pockets are emptied of grain.",
		"Are we done here?",
		"Grain. Because that's ALL I'm good for. *sigh*.",
	],
	"squeeze_bonus_ak6": [
		"Your reward for all your chickensquooging! Buk.",
		"Oh! So hard a squeeze! Supergrain!",
		"Yes, yes. A squeeze, some grain, same old…",
		"You either really like grain, or get some kick out of this.",
		"Yes, yes: congrainulations, squeezefiend.",
	],
	"squeeze_bonus_ak7": [
		"You deserve this, squeezefiend. Your arms must be tired.",
		"You've emptied my chicken pockets! Happy now?",
		"Truth? I quite like squeezing. Don't stop.",
	],
	"squeeze_na_failed": [
		"Squaaaaaaahahaha! Too fast for you!",
		"Buk! No squeeze! I greased my feathers!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-64,"w":53,"h":67},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFIElEQVR42u2YbUxbVRjH+8WEFQis\nUFraKRE3MGzaLQUzCKMFHI63dt1WMDNYo8nQ+KHRGIwvSY3RRD4sXcw+aCKpMb4gGeukQ0vYdhkw\nJiv2MpAIMryMrYEA4xaQABJ5PM+Vg9UM+gKjfPCfnNzb2\/ae3\/k\/L+e2IlGYNBUbmyTaLronkVgm\nJBIbGexkXByQweDYFnAExDQpkfArYODV6YDXaIC+DruTCHAvOZmfq66GP71eoFrq6fkbNjZWE3YX\nl5eXmbm5OZiYmIAZDwfXz74DJYkiuFH3OQxWGa1hhSNmmdExBBwZGYGer6yge\/IRwLeq37cAP9wP\nHTopf7tMYQkXoJ2GFSHRwXNvmeBUiQbGRjjhurt8N9wuU8KIUWndargY8KNbvb3gSldAX0YCe7dM\nadpqQJM\/wD\/a22lFb6ztPJXykCoEQAsEpo1VctajEUlZe8R8TqqYNapFMUEA2gIEDL1ACJgtK0UM\nuWliyN8XyR\/NiLYF016Enre05A\/QHhJc5u4ITeaeHdbsVDEcz1bCc7m7wHwyGwwZUZpAARcWFgIB\n5MnQB+\/eY2I9unf4iUg4pdsLb1cWQ3tbC3zfUA8Oh8MSCKDH44GxsbE1ybD14CJmZ2e5oIuCuGcu\n2h\/JGjKiAccXn56Gi9\/VQmtrKzQ2NnL\/yTfNysDKtRE4ocnh5OsJdxee5+nnAi\/EgykRJnQv53Gx\nAIcOvnoiHWrOfgA32S7o7+\/HG1ppnm1EdBHj4+PmgAHVyaKYQ6k7rM9qH+ZeMag4zL93Kwvh4\/cq\nYbM0MzMjwAk7DDlfXFy0BF0keXsjQZ8eBa+dzIKP3nwehm4NCHsq3piu\/LeBm\/Aj44DfZ\/igAfFe\n9DykdoOFolNH2vTqaP7DqhdW4Whl1pyuElIAj\/7kW814jrlHc3BF5uDgUsSWvDSx\/Wh6lIUMcozm\n+\/r6Vp27dsUBZYeUUJ6jFFz05xaGEoWVjecIhqD43gqkKqgcxCatTRNzxQeiQKeOEpzqIQ+aeEPM\nRQw7Fg9e9wc3ODgoLAxBEA5bD76mbYiAsiE1awpaeSIT3niphG92OjgiuHrpIrxs2A+0BfV2td43\npDg5y7JCalA4vI6hxSNC4nnI+zHuw8KOQgbCdnV1mdBFnBAnf7E4TQDEKscw+06KzuFncUG+0Nii\n8Ls0B0Pe6taSy+ViEZBO3Oz4Gl6v0AigP5yr+efpmcDRAqC5Rp2kCyBi8blxUwHdbreKOPmvgsHJ\n+ntc0ME0wqjnDs2rVeeoY7Q9rXxv8+GoMNQIiMlPe9l67QUXQKvV6\/Vy8\/PzpgcG5+Okpru724pF\ngNW4Fhy6h4uYnJzkSGi3\/scR5uT9IBFuenqaJ4D20dHRB+\/YeuEmw\/ephG7+3NTUVHigfOV0OlWd\nnZ2AkJiXo8ND4Pn2DHjOf6IXbRc1flnDNH12BtorDoBbnwi9hkT42aDgXaUy66\/HFba75UpVWAHr\ncuM19eVqaKg4CBfypbbLz0itV4tkXEuRDIaMShguU3Jhd9GeJ7W1EqBrxTIBpumw1NpUIDX9ckzB\nd5bKGXepPLx\/FNU9vTPmQp6UdRYkwPViuclZIBV+Af6klzMDxxSWO8Zd4f8nqz4vNqkhX8qT8EJH\niZzpLJFbbujkHEK2FMrszJEES1tBgiosOfiNNt5aq41n8FhHjhjuy0dkDIK6SuU20XbUeW2ciSmU\nQRspGHepTO8uSkzaVoDNJC+njDtjrpCw1ubG6Wu1ErPof22h\/gJuo\/mk0t3C+AAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/npc_chicken-1347492439.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
	has_status	: true,
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
	"animal",
	"no_trade",
	"npc-animal"
];
itemDef.keys_in_location = {
	"y"	: "apply_balm",
	"o"	: "apply_youth",
	"u"	: "butter_up",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"n"	: "incubate",
	"c"	: "name",
	"h"	: "rename",
	"v"	: "revive",
	"k"	: "rook_attack",
	"t"	: "set_free",
	"q"	: "squeeze",
	"j"	: "talk_to",
	"x"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("npc_chicken.js LOADED");

// generated ok 2012-12-09 13:57:26 by ali
