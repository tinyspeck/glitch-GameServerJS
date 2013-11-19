//#include include/rook.js, include/animal_sadness.js, include/animal_naming.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Piggy";
var version = "1354512940";
var name_single = "Piggy";
var name_plural = "Piggies";
var article = "a";
var description = "One happy little porcine with a laidback attitude to life and a lot of love to give. Whether wild or domestic, the piggy gives wisdom from one end, useful gardening supplies from the other, and delicious meat from everywhere inbetween.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_piggy", "npc_animal", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_offset_y"	: "-22",	// defined by npc_piggy
	"conversation_offset_x"	: "0"	// defined by npc_piggy
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.mood = "1";	// defined by npc_animal
	this.instanceProps.hunger = "0";	// defined by npc_animal
	this.instanceProps.dont_die = "0";	// defined by npc_animal
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	mood : ["Mood"],
	hunger : ["Hunger"],
	dont_die : ["Don't die (or lose mood\/energy)"],
};

var instancePropsChoices = {
	ai_debug : [""],
	mood : [""],
	hunger : [""],
	dont_die : [""],
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

verbs.rook_attack = { // defined by npc_piggy
	"name"				: "rook_attack",
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

		if (pc.is_god) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.adminRook(pc);
		return true;
	}
};

verbs.unrook = { // defined by npc_piggy
	"name"				: "unrook",
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

		if (pc.is_god && this.isRooked()) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.unRook();
		return true;
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
	"sort_on"			: 51,
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

verbs.revive = { // defined by npc_piggy
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Help this $itemclass escape the effects of The Rook. Costs $energy_cost energy",
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

verbs.apply_balm = { // defined by npc_piggy
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Revive this Piggy with some Rook Balm",
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

verbs.apply_youth = { // defined by npc_piggy
	"name"				: "apply youth potion",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Make this Piggy young again",
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

verbs.capture = { // defined by npc_piggy
	"name"				: "capture",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Hogtie this Piggy. Uses 1 Bait",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked() || (this.container && this.container.race_type == 'piggy_race')){
			return {state: null};
		}

		if (pc.checkItemsInBag('hogtied_piggy', 1)){
			return {state:'disabled', reason:"Your hands are full. You already have a Piggy to deal with!"};
		}

		// No piggy capture cooldowns on streets that make animals sad. Otherwise you end up with a ton of non-removable sad animals.
		if (!pc.achievements_place_time_ago_enough('piggies_captured', pc.location.tsid,60*24*24*7) && !this.container.pols_is_owner(pc) && !this.locationIsDepressing()){
			
			return {state:'disabled', reason:"You can only capture one piggy per location per 42 game-days..."};
		}

		if (pc.buffs_has('piggy_capture_cooldown')){
			return {state:'disabled', reason:"You are too exhausted to capture another Piggy right now."};
		}

		if (!pc.skills_has('herdkeeping_1')){
			return {state:'disabled', reason:"You need to know "+pc.skills_get_name('herdkeeping_1')+" to attempt capture."};
		}

		if (pc.isBagFull()){
			return {state:'disabled', reason:"There's no room in your pack!"};
		}

		if (pc.metabolics_get_energy() <= 20){
			return {state:'disabled', reason:"You don't have enough energy to do that"};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		// Players with Herdkeeping skills can capture wild piggies so you can move them around, 
		// like to your POL and reap the wonderful benefits of domestication.

		// If the player has no inventory space, they should not be able to attempt capturing.
		if (pc.isBagFull()){
			failed = 1;
			self_msgs.push("Piggy won't fit in your bag!!!");
		}
		else if (pc.checkItemsInBag("pig_bait", 1)){
			// Attempting to capture a costs one 'pig bait' item (base cost around 25) and 20 energy.
			pc.items_destroy("pig_bait", 1);
			var val = pc.metabolics_lose_energy(20);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}


			//
			// With Herdkeeping skill, success of capturing a Piggy is 75%
			//
			// Unless the piggy is sad, in which case it's happy to be captured
			//

			var chance = 0.75;
			
			if (is_chance(chance) || this.isSad()){		
				// Capturing a piggy inserts a "hog-tied piggy" into the player's inventory.
				var remainder = pc.createItemFromSource('hogtied_piggy', 1, this, true);

				if (!remainder){
					
					// Success gives 30 mood and 50 XP.
					var val = pc.metabolics_add_mood(30);
					if (val){
						self_effects.push({
							"type"	: "metabolic_inc",
							"which"	: "mood",
							"value"	: val
						});
					}
					if (!this.container.pols_is_owner(pc)){
						var val = pc.stats_add_xp(50, false, {'verb':'capture','class_id':this.class_tsid});
						if (val){
							self_effects.push({
								"type"  : "xp_give",
								"value" : val
							});
						}
					}

					if (!pc.location.pols_is_pol()){
						// Pigs captured in a POL do not count for quest requirement
						pc.quests_inc_counter('pigs_hogtied', 1);
					}

					pc.achievements_increment('piggies_captured', this.class_tsid);
					pc.achievements_set_place_time_now('piggies_captured', pc.location.tsid);

					// Transfer props to hogtied pig
					var piggy = pc.findFirst('hogtied_piggy');
					if(piggy) {
						if(this.user_name) {
							piggy.user_name = this.user_name;
							piggy.pc_namer = this.pc_namer;
							piggy.named_on = this.named_on;
						}

						if(this.petters) {
							piggy.petters = this.petters;
						}
						if(this.nibblers) {
							piggy.nibblers = this.nibblers;
						}
						if(this.package_intervals) {
							piggy.package_intervals = this.package_intervals;
						}
					}

					// When Piggy is captured, player gets the "Hog-tie" buff. 
					// The buff gives 1 XP every 30 seconds and a growl "Be careful, 
					// you can lose the Piggy any minute!"
					pc.buffs_apply('hog_tie');
					if (! this.container.pols_is_owner(pc)){
						pc.buffs_apply('piggy_capture_cooldown');
					}
				
					this.apiDelete();
				}
				else{
					failed = 1;
					self_msgs.push("Piggy won't fit in your bag!!!");
				}

			}
			else{
				// Failure costs 30 mood.
				var val = pc.metabolics_lose_mood(30);
				var slugs = {};
				if (val){
					self_effects.push({
						"type"	: "metabolic_dec",
						"which"	: "mood",
						"value"	: val
					});

					slugs.mood = val;
				}
				failed = 1;

				this.sendResponse('capture_failed', pc, slugs);
			}
		}
		else{
			failed = 1;
			self_msgs.push("The piggy ran away! You'll need something in your inventory with which to lure it.");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'capture', 'captured', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.feed = { // defined by npc_animal
	"name"				: "feed",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Or, drag food to $itemclass",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Feed {$count} {$stack_name} to {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.isFood(stack) ? true : false;
	},
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()){
			return {state: null};
		}

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Piggy is sad!."};
		}

		if(this.locationIsDepressing) {
			if(this.locationIsDepressing()) {
				return {state:'disabled', reason:"This pig is too upset by its surroundings to think about food."};
			}
		}

		return {state:'enabled'};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (this.isFood(it)){
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
			pc.sendActivity("You don't have anything the "+this.name_single+" wants to eat!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything the "+this.name_single+" wants to eat!",
			};
		}
	},
	"effects"			: function(pc){

		return {
			itemclass: this.name_single,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// have we been passed a food item?
		//

		if (msg.target_item_class || msg.target_itemstack_tsid){

			var item_proto = apiFindItemPrototype(msg.target_item_class);

			// We will only feed one stack, so limit to stackmax
			var target_count = Math.min(msg.target_item_class_count, item_proto.stackmax);

			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, target_count);

				if (stack && stack.count < target_count) { 
					var stack_two = pc.removeItemStackClassExact(stack.class_tsid, target_count - stack.count);
				}

			}
			else{
				var stack = pc.removeItemStackClassExact(msg.target_item_class, target_count);
			}
			
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			// is this really food?
			if (!this.isFood(stack)){
				stack.apiPutBack();
				log.error('chose something we can\'t eat...');
				return false;
			}

			var item_title = item_proto.name_plural;
			if (target_count == 1){
				item_title = item_proto.name_single;
			}
			pc.sendActivity('You fed the '+this.name_single+' '+target_count+' '+item_title+'.');

			//
			// Hungry?
			//

			//if (this.instanceProps.hunger == 0 && !stack.is_crop){
			//	pc.sendActivity("This "+this.name_single+" doesn't want to eat that right now.");
			//	return false;
			//}

			// enough food value to count as eating?
			if (stack.base_cost >= 5 && this.instanceProps.hunger != 0){
				this.instanceProps.hunger = 0;
				pc.stats_add_xp(2, false, {'verb':'feed','class_id':this.class_tsid});
			}
			
			this.sendResponse('feed', pc);

			this.apiStopMoving();
			this.setAndBroadcastState('chew');

			this.setMovingTo("random");
			this.apiSetTimer('startMoving', 5 * 1000);

			var class_to_give = '';
			if (stack.is_crop && stack.classProps.produced_by_class){
				var produced_by = stack.classProps.produced_by_class;
				if (!this.crops) this.crops = {};
				if (!this.crops[produced_by]) this.crops[produced_by] = 0;

				this.crops[produced_by] += stack.count;
				if (produced_by == 'seed_pumpkin'|| this.crops[produced_by] >= 3){
					this.crops[produced_by] = 0;
					class_to_give = produced_by;
				}
			}

			// destroy food
			stack.apiDelete();

			if (stack_two) { 
				stack_two.apiDelete();
			}

			pc.achievements_increment('animals_fed', this.class_tsid);

			if (class_to_give){
				if (!this.plopping) this.plopping = []; // this is a queue

				if (!this.plopping.push) { 
					// old style data, put it in new format	
					var new_plops = [];
					for (var id in this.plopping) { 
						new_plops.push({type: id, num: this.plopping[id]});
					}

					delete this.plopping;
					
					this.plopping = new_plops;
				}


				if (class_to_give === "seed_pumpkin") {
					this.plopping.push({type: class_to_give, num: Math.round(target_count*2)});
				}
				else { 
					this.plopping.push({type: class_to_give, num: Math.round(target_count/3)});
				}

				this.doPlop(pc);
			}

			this.broadcastStatus();

			if (!this.times_fed_for_feat) this.times_fed_for_feat = {};
			if (!this.times_fed_for_feat[pc.tsid]) this.times_fed_for_feat[pc.tsid] = 0;
			if (this.times_fed_for_feat[pc.tsid] < 3){
				// pc.feats_increment_for_commit(1);
				pc.feats_increment('animal_love', 1);
				this.times_fed_for_feat[pc.tsid]++;
			}

			pc.announce_sound('FEED_PIGGY');
			return true;
		}

		return false;
	}
};

verbs.name = { // defined by npc_piggy
	"name"				: "name",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Give this Piggy a name",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (!this.user_name && this.canName(pc)){
			if (this.isSad()){
				return {state:'disabled',reason:'This piggy is sad, and in no mood to be called names. Even nice ones.'}
			} else {
				 return {state:'enabled'};
			}
		}
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

verbs.rename = { // defined by npc_piggy
	"name"				: "rename",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Change this Piggy's name",
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

verbs.nibble = { // defined by npc_animal
	"name"				: "nibble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Just a little nibbly-wibbly. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()){
			return {state: null};
		}

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Piggy is sad!."};
		}

		if(this.locationIsDepressing) {
			if(this.locationIsDepressing()) {
				return {state:'disabled', reason:"This pig is too upset by its surroundings to want to be nibbled."};
			}
		}

		var ret = this.canNibble(pc);
		if (!ret['ok']){
			if (ret['limit']){
				return {state:'disabled', reason: "You can only nibble this "+this.name_single+" "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
			}
			else{
				return {state:'disabled', reason: "This Piggy doesn't want to be nibbled."};
			}
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('ak_piggy_nibble');
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.onInteractionStarting(pc);

		// Have they pet this animal today?
		if (this.petters && this.petters[pc.tsid] == current_day_key() || pc.skills_has('animalkinship_6')){
			// Does the animal like that?
			if (this.instanceProps.mood == 0 || this.instanceProps.hunger > 2){
				failed = 1;
				self_msgs.push("That " + this.name_single + " doesn't feel like being nibbled right now.");
				this.setAndBroadcastState('too_much_nibble');
				this.sendResponse('nibble_na_fail', pc);
			}
			else{
				var ret = pc.runSkillPackage('ak_piggy_nibble', this, {word_progress: config.word_progress_map['nibble'], no_fail: !pc.has_done_intro, overlay_id: 'pig_nibble', callback: 'onNibbleComplete', msg: msg});
				if (!ret['ok']){
					return false;
				}
				pc.announce_sound('NIBBLE_PIGGY');
				pc.feats_increment('animal_love', 1);

				return true;
			}
		}
		// Have they not pet today?
		else if (this.petters && this.petters[pc.tsid] != current_day_key()){
			failed = 1;
			self_msgs.push("Give that " + this.name_single + " some love first!");
			pc.announce_sound('PIGGY_SCOFFS');
			this.setAndBroadcastState('too_much_nibble');

			this.sendResponse('nibble_without_pet', pc);
		}

		this.setMovingTo("random");
		this.apiSetTimer('startMoving', 5 * 1000);

		var pre_msg = this.buildVerbMessage(msg.count, 'nibble', 'nibbled', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pet = { // defined by npc_animal
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Make it feel better. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()){
			return {state: null};
		}

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Piggy is sad!."};
		}

		if(this.locationIsDepressing) {
			if(this.locationIsDepressing()) {
				return {state:'disabled', reason:"This pig is too upset by its surroundings to want attention."};
			}
		}

		var ret = this.canPet(pc);
		if (!ret['ok']){
			return {state:'disabled', reason: "You can only pet this "+this.name_single+" "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('ak_piggy_pet');
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.onInteractionStarting(pc);

		var ret = pc.runSkillPackage('ak_piggy_pet', this, {word_progress: config.word_progress_map['pet'], no_fail: !pc.has_done_intro, overlay_id: 'pig_pet', callback: 'onPetComplete', msg: msg});
		pc.announce_sound('PET_PIGGY');

		return ret['ok'] ? true : false;
	}
};

verbs.talk_to = { // defined by npc_piggy
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(this.isRooked()) {
			return {state:null};
		}

		if (pc.quests_get_flag("greedy_street_spirit", "read_act_5")) {
			return {state:'enabled'};
		}

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered) || num_keys(quests.completed)) return {state:'enabled'};

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

		if (pc.quests_get_flag("greedy_street_spirit", "read_act_5")) {
			pc.quests_set_flag("talk_to_piggy");
		}

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered) || num_keys(quests.completed)){
			failed = 0;
			this.offerQuests(pc);
		}
		else{
			var convos = pc.conversations_offered_for_class(this.class_tsid);
			for (var i=0; i<convos.length; i++){
				var conversation_runner = "conversation_run_"+convos[i];
				if (this[conversation_runner]){
					failed = 0;
					this[conversation_runner](pc, msg);
					break;
				}
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function boot(){ // defined by npc_piggy
	this.apiStopMoving();
	this.apiCancelTimer('onRooting');
	this.apiCancelTimer('startMoving');
	this.dir = 'left';
	this.setAndBroadcastState('rooked1');
	this.apiKickTheChicken(-65, -250);
}

function die(){ // defined by npc_piggy
	this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('meat', 10, this), this.x, this.y-20);
	this.container.apiPutItemIntoPosition(apiNewItemStackFromSource('plop', 1, this), this.x+80, this.y-20);

	this.apiDelete();
}

function onContainerItemRemoved(item, newContainer){ // defined by npc_piggy
	this.ai_debug_display(item+" was removed");

	// Clear data if the pig stick is removed.
	if (item && item.class_tsid == 'magic_pig_stick' && item.is_placed) {
		this.ai_debug_display("Clearing movement limits");
		this.clearMovementLimits();
	}
}

function onOverlayDismissed(pc, payload){ // defined by npc_piggy
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPlayerCollision(pc){ // defined by npc_piggy
	if (this.isRooked()){
		this.rookedCollision(pc);
	}
	else if (this.container && this.container.game_type == 'hogtie_piggy'){
		if (!this.in_pen) {
			if(pc.games_hogtie_piggy_pickup_pig()) {
				this.apiDelete();
			}
		}
	}
	else{
		var quests = this.getAvailableQuests(pc);
		if (pc.is_god && (num_keys(quests.offered) || num_keys(quests.completed)) && (!pc.last_piggy_offer || time() - pc.last_piggy_offer > 5*60)){
			pc.last_piggy_offer = time();
			return this.sendBubble("Hey! C'mere! I've got something to tell you.", 5000, pc);
		}

		this.parent_onPlayerCollision(pc);
	}
}

function onReleased(pc){ // defined by npc_piggy
	if(this.locationIsDepressing()) {
		this.onSadnessCheck();
	} else {
		this.ai_debug_display("My move limits are "+this.move_limits);
		this.sendResponse('capture_released', pc);
	}
}

function onRevived(){ // defined by npc_piggy
	log.debug(this+" is now a revived piggy!");

	this.startMoving();
	this.broadcastStatus();
}

function onRooked(){ // defined by npc_piggy
	this.apiSetTimer('onRookedInterval', 5000);
	this.broadcastStatus();
}

function onRookedInterval(){ // defined by npc_piggy
	if (!this.isRooked()){
		return;
	}

	if (!this['!rooked_tick']){
		this.setAndBroadcastState('rooked2');
		this['!rooked_tick'] = 1;
		var duration = 1000;
	}
	else if (this['!rooked_tick'] == 1) {
		this.setAndBroadcastState('rooked1');
		this['!rooked_tick'] = 2;
		var duration = 1000;
	}
	else if (this['!rooked_tick'] == 2) {
		this.setAndBroadcastState('rooked2');
		this['!rooked_tick'] = 3;
		var duration = 1000;
	}
	else {
		this.setAndBroadcastState('rooked1');
		this['!rooked_tick'] = 0;
		var duration = 5000;
	}

	this.apiSetTimer('onRookedInterval', duration);
}

function onRooting(){ // defined by npc_piggy
	if (this.isRooked()) return;
	if (this.isSad()) return;
	if (this.moving_to == 'food') return;


	if (this.container.getNumActivePlayers()) {

		// When walking, every 3-10 seconds Piggy should stop and:
		// 70% chance - sniff and change direction
		// 30% chance - look_screen and keep going in the same direction

		this.ai_debug_display("I'm rooting");

		this.apiStopMoving();

		if (is_chance(0.30)){
			this.setAndBroadcastState('look_screen');
			this.apiSetTimer('startMoving', 5 * 1000);
		}
		else{
			this.setAndBroadcastState('sniff');
			this.apiSetTimer('stopSniffing', 3 * 1000);
		}

		//log.info('piggy is rooting!');
		this.wait_rooting = 0;
	}
	else { 
		log.debug(this+" PIGGY setting pathfinding_paused ");
		this.apiStopMoving();
		this.pathfinding_paused = true;
	}
}

function onStatus(pc){ // defined by npc_piggy
	var is_rook_verbs = this.isRooked();
	var is_tend_verbs = !is_rook_verbs;

	var status = {
		is_rook_verbs: is_rook_verbs,
		is_tend_verbs: is_tend_verbs,
		verb_states: {}
	};

	if(this.isSad()) {
		return status;
	}

	if (pc){
	if (this.instanceProps.hunger > 8){
		status.verb_states['feed'] = {
			enabled: !this.isRooked(),
			disabled_reason: '',
			warning: (this.instanceProps.hunger == 10 ? true : false)
		};
	}
	else if (this.instanceProps.mood == 0 || !this.petters || this.petters[pc.tsid] != current_day_key()){
		var can_pet = this.canPet(pc);
		if (can_pet['ok']){
			status.verb_states['pet'] = {
				enabled: !this.isRooked(),
				disabled_reason: '',
				warning: false
			};
		}
	}
	else if (this.instanceProps.hunger <= 2){
		var can_nibble = this.canNibble(pc);
		if (can_nibble['ok']){
			status.verb_states['nibble'] = {
				enabled: !this.isRooked(),
				disabled_reason: '',
				warning: false,
				item_class: "meat"
			};
		}
	}
	}

	return status;
}

function onVerbMenuOpen(pc){ // defined by npc_piggy
	if(this.isRooked()) {
		this.cancelRookConversation(pc);
	}
}

function setMovingTo(what){ // defined by npc_piggy
	this.moving_to = what;

	this.wait_rooting = 0;
}

function startMoving(){ // defined by npc_piggy
	this.parent_startMoving();

	if (		!this.wait_rooting 
		&& 	this.moving_to != 'food' 
		&& 	this.container 
		&& 	this.container.getNumActivePlayers()
	){
		if (this.move_limits) { 
			var low = 2;
			var high = 6;
		}
		else { 
			var low = 3;
			var high = 10;
		}

		this.apiSetTimer('onRooting', randInt(low,high)*1000);
		this.wait_rooting = 1;
	}

	// Check once a minute for achievements
	if (time() - this['!achievement_check'] >= 60){
		// How many piggies are here?
		var piggies = 0;
		for (var i in this.container.items){
			if (this.container.items[i].class_tsid == 'npc_piggy') piggies++;
		}

		if (piggies >= 3){
			pc.achievements_grant('porker_porter');
		}

		if (piggies >= 11){
			pc.achievements_grant('porker_porter_ii');
		}

		this['!achievement_check'] = time();
	}
}

function stopSniffing(){ // defined by npc_piggy
	this.setAndBroadcastState('sniff_end');
	this.turnAround();
	this.startMoving();
}

function canNibble(pc){ // defined by npc_animal
	var package_class = 'ak_piggy_nibble';

	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
		
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
		
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function canPet(pc){ // defined by npc_animal
	var package_class = 'ak_piggy_pet';
		
	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
		
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
		
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function decMood(delta){ // defined by npc_animal
	if (this.instanceProps.dont_die == 1 || !config.trant_growth_enabled || this.container.jobs_is_street_locked() || this.container.is_upgrade_template()) return 0;

	var old_mood = this.instanceProps.mood;
	this.instanceProps.mood -= delta;
	if (this.instanceProps.mood < 0){
		this.instanceProps.mood = 0;
	}

	this.broadcastStatus();

	return old_mood - this.instanceProps.mood;
}

function doPlop(pc){ // defined by npc_animal
	if (!this.plopping || this.plopping.length <= 0) return;

	var class_to_give = this.plopping[0];

	var seed_count = randInt(2, 7);
	seed_count = Math.min(seed_count, class_to_give.num);

	//log.info("PLOP: "+class_to_give+" seed_count is "+seed_count);

	if (class_to_give.num > seed_count){
		this.plopping[0].num -= seed_count;
		this.apiSetTimerX('doPlop', 5*1000, pc);
	}else{
		class_to_give = this.plopping.shift();
		//log.info("PLOP: "+this.plopping);

		if (this.plopping.length > 0) { 
			this.apiSetTimerX('doPlop', 5*1000, pc);
		}
	}

	var s = apiNewItemFromSource('plop', this);
	s.instanceProps.seed_class = class_to_give.type;
	s.instanceProps.seed_count = seed_count;
	//log.info("PLOP: "+s);
	if (this.go_dir == 'right'){
		this.container.apiPutItemIntoPosition(s, this.x-30, this.y);
	}else{
		this.container.apiPutItemIntoPosition(s, this.x+30, this.y);
	}

	if (pc.location === this.container) { 
		pc.sendActivity('The '+this.label+' plopped on the ground!');
	}
}

function incMood(delta){ // defined by npc_animal
	var old_mood = this.instanceProps.mood;
	this.instanceProps.mood += delta;
	if (this.instanceProps.mood > 2){
		this.instanceProps.mood = 2;
	}

	this.broadcastStatus();

	return this.instanceProps.mood - old_mood;
}

function isFood(stack){ // defined by npc_animal
	return stack.is_food; // defined in include/food.js which all food items include
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_animal
	if (!oldContainer) this.broadcastStatus();

	// Check for magic pig sticks on the level
	//log.info("Created pig, checking for pig sticks");
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "magic_pig_stick" && it.is_placed){
			var dist = parseInt(it.getInstanceProp('distance'));

			//log.info("Setting movement limits "+dist+" on piggy "+this);
			this.setMovementLimits(it.x, it.y, dist);
		}
	}

	this.startMoving(); // moved from onCreate so it won't get done until after move_limits is set

	if (!oldContainer && newContainer.race_type == 'piggy_race'){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(5, 5);
		this.not_selectable = true;
	}
}

function onContainerItemAdded(addedItem, oldContainer){ // defined by npc_animal
	if (!this.isRooked() && !this.isSad() && this.instanceProps.hunger > 0 && this.isFood(addedItem)){
		
		if (this.move_limits) {
			var left = this.move_limits.x - this.move_limits.w;
			var right = this.move_limits.x + this.move_limits.w;
		}

		if (!this.move_limits || (addedItem.x >= left && addedItem.x <= right)) {
			this.ai_debug_display("OMG food at "+addedItem.x+" "+addedItem.y);
			
			if (this.apiFindPath(addedItem.x, addedItem.y, 0, 'onFoodPathing')) {
				this.setMovingTo("food");
			}
		}
		else { 
			this.ai_debug_display(":( I can't get to food at "+addedItem.x+" "+addedItem.y);
			//log.info("omg food I can't get to :(");
		}
	}
	else if (addedItem.class_tsid == this.class_tsid){
		this.onSadnessCheck();
	}
}

function onContainerItemStateChanged(item){ // defined by npc_animal
	if (!this.isRooked() && !this.isSad() && this.instanceProps.hunger > 0 && item.is_trant && item.instanceProps.fruitCount){

		if (this.move_limits) { 
			var left = this.move_limits.x - this.move_limits.w;
			var right = this.move_limits.x + this.move_limits.w;
		}

		if (!this.move_limits || (item.x >= left && item.x <= right)) {
			//this.movement = 'food';
			this.apiFindPath(item.x, item.y, 0, 'onFoodPathing');
		}
	}
}

function onCreate(){ // defined by npc_animal
	this.initInstanceProps();
	this.is_animal = 1;

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = randInt(30,55);
	this.npc_climb_speed = 25;
	this.npc_jump_height = 0;
	this.npc_can_fall = 0;

	this.state = 'look_screen';
	this.go_dir = 'left';
	//this.startMoving();

	this.instanceProps.mood = 1;
	this.instanceProps.hunger = 0;

	this.has_been_petted = 0;
	this.is_daily = 1;
	this.petters = {};
	this.nibblers = {};
	this.moving_to = 'random';

	this.apiSetInterval('onTwiceDaily', game_days_to_ms(0.5) / 1000 / 60);

	this.broadcastStatus();

	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);

	if (this.class_tsid == 'npc_piggy'){
		this.setAvailableQuests([
			'greedy_street_spirit'
		]);
	}
}

function onCroaking(){ // defined by npc_animal
	// complain that we're about to die
	if (this.instanceProps.hunger == 10){
		this.sendBubble("I'm about to croak!", 10*1000);
	}
	//log.info(this.name_single+' is about to croak in '+this.container+'!');
}

function onFoodPathing(args){ // defined by npc_animal
	if (args.status == 3 || args.status == 4){
		this.setMovingTo("random");
		this.apiStopMoving();
		if (this.instanceProps.hunger > 0){
			var items = this.container.apiGetNoPlayerScanItemsInTheRadius(this.x, this.y, 100);
			for (var i in items){
				var it = items[i];
				if (it.is_food){
					// destroy food
					var consumed = it.apiConsume(1);
					if (consumed == 1){
						this.setAndBroadcastState('chew');
						this.instanceProps.hunger = 0;
						this.sendBubble("Yum!", 3*1000);
						this.broadcastStatus();
					}
					break;
				}
				else if (it.is_trant && it.instanceProps.fruitCount > 0){
					this.setAndBroadcastState('chew');
					it.removeFruit(1);
					this.instanceProps.hunger = 0;
					this.sendBubble("Yum!", 3*1000);
					this.broadcastStatus();
					break;
				}
			}
		}

		this.movement = 'idle';
		this.apiSetTimer('startMoving', 3 * 1000);
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
	else {
		// pathing stopped for some reason
		this.setMovingTo("random");
	}
}

function onHungry(){ // defined by npc_animal
	// complain that we're hungry
	this.sendBubble("I'm hungry!", 3*1000);
}

function onLoad(){ // defined by npc_animal
	this.apiSetPlayersCollisions(true);
	if (this.class_tsid == 'npc_piggy'){
		this.setAvailableQuests([
			'greedy_street_spirit'
		]);
	}
}

function onNibbleComplete(pc, ret){ // defined by npc_animal
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (ret['ok']){
		var slugs = ret.slugs;
		if (ret.values['energy_cost']){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

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
				"value"	: ret.values['xp_bonus']
			});
		}

		self_msgs.push("Piggy likes that!");

		if (!this.nibblers) this.nibblers = {};
		this.nibblers[pc.tsid] = current_day_key();

		var proto = apiFindItemPrototype('meat');

		// How much meat?
		var got_bonus = false;
		var meat = ret.details['bonus_amount'];
		if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck'))){
			var harvest_effects = [];
			var bonus_items = meat * (ret.details['bonus_multiplier'] - 1);
		
			harvest_effects.push({
				"type"	: "item_give",
				"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
				"value"	: bonus_items
			});

			var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, they_effects);
		
			pc.createItemFromOffsetDelayed('meat', bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
			pc.show_rainbow('rainbow_superharvest', 1000);
		
			pc.quests_inc_counter('piggy_nibble_max_reward', 1);
			got_bonus = true;

		}

		var remainder = pc.createItemFromSource("meat", meat * orig_count, this);
		if (remainder != meat * orig_count){
			var collected = (meat * orig_count) - remainder;
			self_msgs.push("He gives you "+collected+" meat.");

			pc.quests_inc_counter('meats_collected_from_pigs', 1);

			if (!slugs.items) slugs.items = [];
			slugs.items.push({
				class_tsid	: 'meat',
				label		: proto.label,
				count		: collected,
				//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
			});
		}

		if (got_bonus){
			if (!pc.skills_has('animalkinship_4')){
				this.sendResponse('nibble_bonus_ak3', pc, slugs);
			}
			else if (pc.skills_has('animalkinship_4')){
				this.sendResponse('nibble_bonus_ak4', pc, slugs);
			}
			else if (pc.skills_has('animalkinship_5')){
				this.sendResponse('nibble_bonus_ak5', pc, slugs);
			}
			else if (pc.skills_has('animalkinship_6')){
				this.sendResponse('nibble_bonus_ak6', pc, slugs);
			}
			else if (pc.skills_has('animalkinship_7')){
				this.sendResponse('nibble_bonus_ak7', pc, slugs);
			}
		}
		else{
			if (!pc.skills_has('animalkinship_1') && !pc.skills_has('animalkinship_2')){
				this.sendResponse('nibble_ak1', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_4')){
				this.sendResponse('nibble_ak2_ak3', pc, slugs);
			}
			else if (!pc.skills_has('animalkinship_6')){
				this.sendResponse('nibble_ak4_ak5', pc, slugs);
			}
			else{
				this.sendResponse('nibble_ak6_ak7', pc, slugs);
			}
		}

		this.setAndBroadcastState('nibble');
		this.broadcastStatus();

		pc.announce_sound('RECEIVE_MEAT_FROM_PIGGY');
		pc.achievements_increment('animals_nibbled', this.class_tsid);
		pc.location.cultivation_add_img_rewards(pc, 4.0);

		if (this.container.eventFired) this.container.eventFired('verb_nibble_success', this);

		// pc.feats_reset_commit();
	}
	else{
		failed = 1;
		self_msgs.push("That didn't work!");
		pc.announce_sound('CLICK_FAILURE');
		this.setAndBroadcastState('too_much_nibble');
		
		this.sendResponse('nibble_na_fail', pc);

		if (this.container.eventFired) this.container.eventFired('verb_nibble_fail', this);
	}

	var pre_msg = this.buildVerbMessage(this.count, 'nibble', 'nibbled', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	this.onInteractionEnding(pc);
}

function onPathing(args){ // defined by npc_animal
	//log.info("PIGGY: "+this.user_name+" pathing callback: "+args.status);
	if (args.status == 3 || args.status == 4){
		//log.info(this+" PIGGY reached destination");
		this.turnAround();
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

function onPetComplete(pc, ret){ // defined by npc_animal
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (ret['ok']){
		var mood_change = this.incMood(1);

		var slugs = ret.slugs;
		if (ret.values['energy_cost']){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

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
				"value"	: ret.values['xp_bonus']
			});
		}

		if (!this.petters) this.petters = {};
		this.petters[pc.tsid] = current_day_key();

		if (!pc.skills_has('animalkinship_1') && !pc.skills_has('animalkinship_2')){
			this.sendResponse('pet_ak1', pc, slugs);
		}
		else if (!pc.skills_has('animalkinship_4')){
			this.sendResponse('pet_ak2_ak3', pc, slugs);
		}
		else if (!pc.skills_has('animalkinship_6')){
			this.sendResponse('pet_ak4_ak5', pc, slugs);
		}
		else {
			this.sendResponse('pet_ak6_ak7', pc, slugs);
		}

		this.state = 'nibble';
		this.broadcastStatus();

		pc.achievements_increment('animals_petted', this.class_tsid);
		pc.quests_inc_counter('piggies_petted', 1);
		pc.location.cultivation_add_img_rewards(pc, 4.0);

		if (this.container.eventFired) this.container.eventFired('verb_pet_success', this);

		// pc.feats_increment_for_commit(1);
		pc.feats_increment('animal_love', 1);
	}
	else{
		failed = 1;

		this.sendResponse('pet_na_fail', pc);
		pc.announce_sound('CLICK_FAILURE');

		this.state = 'too_much_nibble';

		self_msgs.push("Maybe you would have more luck if you felt some kinship with the Piggy.");

		if (this.container.eventFired) this.container.eventFired('verb_pet_fail', this);
	}

	this.setMovingTo("random");
	this.apiSetTimer('startMoving', 6 * 1000);

	var pre_msg = this.buildVerbMessage(this.count, 'pet', 'petted', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	this.onInteractionEnding(pc);
}

function onPlayerEnter(pc){ // defined by npc_animal
	if ( this.pathfinding_paused) {
		log.debug(this+" PIGGY deleted pathfinding_paused");
		delete this.pathfinding_paused; 
		this.startMoving();
	}
}

function onPlayerExit(pc){ // defined by npc_animal
	/*if (this.container.getNumActivePlayers() == 0){
		log.info("PIGGY: "+this.user_name+" stopping");
		this.apiStopMoving();
		this.setAndBroadcastState("look_screen");
		this.pathfinding_paused = true;
	}*/
}

function onPropsChanged(){ // defined by npc_animal
	if (this.instanceProps.hunger != 10){
		this.apiClearInterval('onCroaking');
	}

	this.broadcastStatus();
}

function onPrototypeChanged(){ // defined by npc_animal
	this.apiSetPlayersCollisions(true);
	if (this.class_tsid == 'npc_piggy'){
		this.setAvailableQuests([
			'greedy_street_spirit'
		]);
	}
}

function onStuck(){ // defined by npc_animal
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function onTwiceDaily(){ // defined by npc_animal
	if (this.isRooked()) return;
	if (this.isSad()) return;

	// some things happen once every 12h, some once every 24h.
	// thanks stewart!

	this.is_daily = this.is_daily ? 0 : 1;

	if (this.is_daily){
		this.ai_debug_display("twice daily - daily version");
		//log.info('PIGGY npc_animal.twicedaily - the daily version');
	}else{
		this.ai_debug_display("twice daily - half daily version");
		//log.info('PIGGY npc_animal.twicedaily - the half-daily version');
	}

	//log.info('start: npc_animal hunger is '+ this.instanceProps.hunger);

	//
	// Wipe petters/nibblers from not-today
	//

	var today = current_day_key();

	for (var tsid in this.petters) {
		if (this.petters[tsid] != today){
			delete this.petters[tsid];
		}
	}

	for (var tsid in this.nibblers) {
		if (this.nibblers[tsid] != today){
			delete this.nibblers[tsid];
		}
	}


	//
	// get various items we care about
	//

	var animals_nearby = 0;
	var animals_mood = 0;
	var food_nearby = 0;
	var trants_nearby = 0;

	if (this.is_daily || this.instanceProps.hunger > 0){
		if (this.move_limits){
			var left = this.move_limits.x - this.move_limits.w;
			var right = this.move_limits.x + this.move_limits.w;

			//log.info("PIGGY: got here, left is "+left+" and right is "+right);
		}

		var check_items = this.container.noPlayerScanItems;

		//log.info("PIGGY: check_items length is "+check_items.length);

		for (var i in check_items){
			var it = check_items[i];
			//log.info("PIGGY checking "+it);

			if (it.is_animal && it.tsid != this.tsid){
				animals_nearby++;
				animals_mood += it.instanceProps.mood;
			}
			else if (it.is_food){
				if (!this.move_limits || (it.x >= left && it.x <= right)) {
					food_nearby++;
					var food = it;
					log.info("PIGGY: found food item "+it);
					if (!this.is_daily) break;
				}
			}
			else if (it.is_trant && it.instanceProps.fruitCount){
				if (!this.move_limits || (it.x >= left && it.x <= right)) {
					trants_nearby++;
					var trant = it;
					//log.info("PIGGY: found trant "+it);
					if (!this.is_daily) break;
				}
			}
		}
	}


	//
	// mood
	//

	if (this.is_daily){
		if (!this.has_been_petted){
			this.decMood(1);
		}
		this.has_been_petted = 0;

		//
		// Look for nearby animals
		//

		if (animals_nearby){
			var avg_mood = (animals_mood / animals_nearby);
			//log.info('average mood of nearby animals is '+avg_mood);

			if (avg_mood >= 1 && this.instanceProps.mood == 0){
				this.instanceProps.mood = 1;
				this.sendBubble("Other animals make me happy!", 3*1000);
			}
		}
	}


	//
	// hunger
	//

	if (this.instanceProps.dont_die == 0 && config.trant_growth_enabled && !this.container.jobs_is_street_locked() && !this.container.is_upgrade_template()){
		if (this.instanceProps.hunger < 2){

			this.instanceProps.hunger++;

		}else if (this.instanceProps.hunger < 10){

			if (this.is_daily) this.instanceProps.hunger++;

		}else{
			// at 10 hunger
			this.apiSetInterval('onCroaking', 1);

			if (is_chance(0.5)) {
				this.ai_debug_display("dying");
				this.container.apiSendAnnouncement({
					type: 'itemstack_overlay',
					itemstack_tsid: this.tsid,
					swf_url: overlay_key_to_url('smoke_puff'),
					delta_y: 95,
					follow: true,
					duration: 1500
				});
				this.apiSetTimer('die', 500);
				return;
			}
		}

		if (this.instanceProps.hunger > 0){

			//
			// Look for nearby food
			//

			if (food_nearby){
				this.ai_debug_display("hunger is "+this.instanceProps.hunger+" pathing to food "+it);

				if (this.apiFindPath(food.x, food.y, 0, 'onFoodPathing')) {
					this.setMovingTo("food");
					//log.info("PIGGY moving to food "+food);
				}
				else { 
					//log.info("PIGGY can't path to food "+food);
				}
			}
			else {
				//
				// Look for nearby trants
				//

				if (trants_nearby){
					this.ai_debug_display("hunger is "+this.instanceProps.hunger+" pathing to trant "+it);

					if (this.apiFindPath(trant.x, trant.y, 0, 'onFoodPathing')) {
						this.setMovingTo("food");
						//log.info("PIGGY moving to trant "+trant);
					}
					else { 
						//log.info("PIGGY can't path to trant "+trant);
					}
				}
				else { 
					this.ai_debug_display("hunger is "+this.instanceProps.hunger+" trying to path to food but no food found");
				}
			}
		}
	}

	// Escape?
	/*
	if (this.is_daily){
		// without Herdkeeping, there is a 2% per game day chance for each animal 
		// to escape from a POL ("escape" means destroy the stack)
		var chance = 0;

		if (this.location && this.location.pols_is_pol()){
			var owner = this.location.pols_get_owner();
			if (owner && !owner.skills_has('herdkeeping_1')){
				chance = 0.02;
			}
		}

		if (is_chance(chance) && config.trant_growth_enabled && !this.container.jobs_is_street_locked() && !this.container.is_upgrade_template()){
			return this.die();
		}
	}*/

	//log.info('end: npc_animal hunger is '+ this.instanceProps.hunger);
	this.npc_walk_speed = this.npc_climb_speed = randInt(30,55) - this.instanceProps.hunger;

	this.broadcastStatus();
}

function onWaitEnd(){ // defined by npc_animal
	if (this.isRooked()) return;
	if (this.isSad()) return;
	this.apiSetTimer('startMoving', 5000);
}

function onWaitStart(){ // defined by npc_animal
	if (this.isRooked()) return;
	if (this.isSad()) return;

	this.apiStopMoving();
	this.setAndBroadcastState('look_screen');
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc_animal
	//log.info("PS Calling apiFindPath on "+this);
	if (Math.abs(this.x - x_pos) < 20) { 
		// Really close, don't try to pathfind because it will fail.
		//log.info("PS setting move limits");
		this.npc_setMovementLimits(x_pos, y_pos, width);
	}
	else if (this.apiFindPath(x_pos, y_pos, 1, 'onPathing')
		|| this.apiFindPath(x_pos - (width - 5), y_pos, 1, 'onPathing') 
		|| this.apiFindPath(x_pos + (width - 5), y_pos, 1, 'onPathing')) {

		//log.info("PS setting move limits "+x_pos+" "+y_pos+" "+width);
		this.npc_setMovementLimits(x_pos, y_pos, width);
	}
	else { 
		//log.info("PS clearing move limits");
		this.clearMovementLimits();

		// I like this, but Justin thinks we better take it out since it looks silly 
		// when 5 pigs say it at the same time. :(
		//this.sendBubble("Aw, I can't reach the Pig Stick, dude.", 3*1000);
	}
}

function turnAround(){ // defined by npc_animal
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

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function npc_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function npc_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function npc_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function npc_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function npc_setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function conversation_canoffer_surfeit_of_cherries_2(pc){ // defined by conversation auto-builder for "surfeit_of_cherries_2"
	var chain = {
		id: "surfeit_of_cherries",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "surfeit_of_cherries_1")){
			return true;
	}
	return false;
}

function conversation_run_surfeit_of_cherries_2(pc, msg, replay){ // defined by conversation auto-builder for "surfeit_of_cherries_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "surfeit_of_cherries_2";
	var conversation_title = "The Surfeit of Cherries";
	var chain = {
		id: "surfeit_of_cherries",
		level: 2,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['surfeit_of_cherries_2-0-2'] = {txt: "I'm not sure I did.", value: 'surfeit_of_cherries_2-0-2'};
		this.conversation_start(pc, "Lemons? And Pot? Dude, don't talk to me about Pot and lemons.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-0-2"){
		choices['1']['surfeit_of_cherries_2-1-2'] = {txt: "Then I am.", value: 'surfeit_of_cherries_2-1-2'};
		this.conversation_reply(pc, msg, "You should.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-1-2"){
		choices['2']['surfeit_of_cherries_2-2-2'] = {txt: "I'm afraid I might.", value: 'surfeit_of_cherries_2-2-2'};
		this.conversation_reply(pc, msg, "There was just this time, right? It was the feast of Pot. Everyone was totally … how old are you? Well, whatever, everyone was having a Very Good Time, you get me?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-2-2"){
		choices['3']['surfeit_of_cherries_2-3-2'] = {txt: "Thing? What thing?", value: 'surfeit_of_cherries_2-3-2'};
		this.conversation_reply(pc, msg, "And this High Potian Priest dude climbed on a table, and started waxing about how he’d got this message, right? About how the thing that would please Pot the most was this dessert he loved as a kid. And he was like: the only thing for it was to gather ALL the lemons in the multiverse and smoosh them all up, and then top them with CLOUDS mixed with HONEY. And, like, if they could only do that, Pot would grant them all this thing, yeah?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-3-2"){
		choices['4']['surfeit_of_cherries_2-4-2'] = {txt: "Woah.", value: 'surfeit_of_cherries_2-4-2'};
		this.conversation_reply(pc, msg, "Well that’s the problem. No one at that party remembered. Damn, dude: that was one hell of a party.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-4-2"){
		choices['5']['surfeit_of_cherries_2-5-2'] = {txt: "Wait, what?", value: 'surfeit_of_cherries_2-5-2'};
		this.conversation_reply(pc, msg, "I know, right? Anyway, it led to the Great Lemon Shortage and the consequential Four-Hundred-Year Angry Citratic War.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-5-2"){
		choices['6']['surfeit_of_cherries_2-6-2'] = {txt: "Laters, Pig.", value: 'surfeit_of_cherries_2-6-2'};
		this.conversation_reply(pc, msg, "I know, bummer, right? Yeah, it was a bummer. Catch ya later. Gots turf to snuffle.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_2', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_2-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_ages_of_the_world_2(pc){ // defined by conversation auto-builder for "ages_of_the_world_2"
	var chain = {
		id: "ages_of_the_world",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "ages_of_the_world_1")){
			return true;
	}
	return false;
}

function conversation_run_ages_of_the_world_2(pc, msg, replay){ // defined by conversation auto-builder for "ages_of_the_world_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "ages_of_the_world_2";
	var conversation_title = "The Ages of the World";
	var chain = {
		id: "ages_of_the_world",
		level: 2,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['ages_of_the_world_2-0-2'] = {txt: "What? Eleventy-what…?", value: 'ages_of_the_world_2-0-2'};
		this.conversation_start(pc, "Dude, I don’t know about you, but I say: of all the eleventy-billion eras, this one is by FAR the rockingest. It’s like, TOTAL Age of Party, you know?”", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_2', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_2-0-2"){
		choices['1']['ages_of_the_world_2-1-2'] = {txt: "Not a real number. ", value: 'ages_of_the_world_2-1-2'};
		this.conversation_reply(pc, msg, "BAJILLION.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_2', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_2-1-2"){
		choices['2']['ages_of_the_world_2-2-2'] = {txt: "Party on. I guess?", value: 'ages_of_the_world_2-2-2'};
		this.conversation_reply(pc, msg, "Oh, you don’t kn… never mind, dude. Ix-nay on the ultiple-may orld-way sation-conversayway. Party on.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_2', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_2-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_piggy_tales_1(pc){ // defined by conversation auto-builder for "piggy_tales_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.stats.level >= 2) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
			return true;
	}
	return false;
}

function conversation_run_piggy_tales_1(pc, msg, replay){ // defined by conversation auto-builder for "piggy_tales_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "piggy_tales_1";
	var conversation_title = "Piggy Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['piggy_tales_1-0-2'] = {txt: "Thirteenth?", value: 'piggy_tales_1-0-2'};
		this.conversation_start(pc, "Man, one time? On Recurse Eve? In the dying days of the thirteenth age of Pot…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_1', msg.choice);
	}

	if (msg.choice == "piggy_tales_1-0-2"){
		choices['1']['piggy_tales_1-1-2'] = {txt: "What happened?", value: 'piggy_tales_1-1-2'};
		this.conversation_reply(pc, msg, "Or nineteeth. Whatever. Whichever of those was the totally righteous one. In the dying days of THAT era, I heard the most dedicated of the Potians wiped out the entire world stock of hooch before the party was halfway done.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_1', msg.choice);
	}

	if (msg.choice == "piggy_tales_1-1-2"){
		choices['2']['piggy_tales_1-2-2'] = {txt: "You mean Wine of the Dead?!?", value: 'piggy_tales_1-2-2'};
		this.conversation_reply(pc, msg, "They had to break into the Giants' Private Cavern, and \"borrow\" their stash of Hell Wine. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_1', msg.choice);
	}

	if (msg.choice == "piggy_tales_1-2-2"){
		choices['3']['piggy_tales_1-3-2'] = {txt: "The grapes, yeah. I hear the wine has some serious kick to it.", value: 'piggy_tales_1-3-2'};
		this.conversation_reply(pc, msg, "Ya, dude. You know? From those crazy hellish grapes?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_1', msg.choice);
	}

	if (msg.choice == "piggy_tales_1-3-2"){
		choices['4']['piggy_tales_1-4-2'] = {txt: "Gotcha.", value: 'piggy_tales_1-4-2'};
		this.conversation_reply(pc, msg, "Ya dude, I wouldn't recommend drinking it. That stuff is some bad, BAD vino.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_1', msg.choice);
	}

	if (msg.choice == "piggy_tales_1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_piggy_tales_2(pc){ // defined by conversation auto-builder for "piggy_tales_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "ages_of_the_world_3")){
			return true;
	}
	return false;
}

function conversation_run_piggy_tales_2(pc, msg, replay){ // defined by conversation auto-builder for "piggy_tales_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "piggy_tales_2";
	var conversation_title = "Piggy Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['piggy_tales_2-0-2'] = {txt: "Then I have never lived.", value: 'piggy_tales_2-0-2'};
		this.conversation_start(pc, "Dude, I tell you, you’ve not lived until you’ve been to a Feast of Grendaline party.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-0-2"){
		choices['1']['piggy_tales_2-1-2'] = {txt: "… waiting… ", value: 'piggy_tales_2-1-2'};
		this.conversation_reply(pc, msg, "No way, REALLY?!? Seriously, you’ve not lived. They are legendary. Legen… wait for it…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-1-2"){
		choices['2']['piggy_tales_2-2-2'] = {txt: "Sorry, what?", value: 'piggy_tales_2-2-2'};
		this.conversation_reply(pc, msg, "…dary.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-2-2"){
		choices['3']['piggy_tales_2-3-2'] = {txt: "Obviously.", value: 'piggy_tales_2-3-2'};
		this.conversation_reply(pc, msg, "Never mind. It’s a joke that Grendalinians loved. Aw, but seriously: The Feasts. Man. The high point of the evening would be – apart from the free-flowing open bar…", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-3-2"){
		choices['4']['piggy_tales_2-4-2'] = {txt: "Sounds like a blast.", value: 'piggy_tales_2-4-2'};
		this.conversation_reply(pc, msg, "Obviously… was the moment the High Priest Dancers would step forward and perform their slow, stately interpretive dance version of Grendaline’s victory over the Rigidity Coalition in the era known as the Time of Considerable Political Tension…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-4-2"){
		choices['5']['piggy_tales_2-5-2'] = {txt: "Sounds like a chilly blast.", value: 'piggy_tales_2-5-2'};
		this.conversation_reply(pc, msg, "…Wearing only a large mask and a carefully placed ornamental button, dude!", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-5-2"){
		choices['6']['piggy_tales_2-6-2'] = {txt: "No kidding.", value: 'piggy_tales_2-6-2'};
		this.conversation_reply(pc, msg, "Aw, you had to be there, man. You had to be there.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_2', msg.choice);
	}

	if (msg.choice == "piggy_tales_2-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_piggy_tales_3(pc){ // defined by conversation auto-builder for "piggy_tales_3"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "piggy_tales_2")){
			return true;
	}
	return false;
}

function conversation_run_piggy_tales_3(pc, msg, replay){ // defined by conversation auto-builder for "piggy_tales_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "piggy_tales_3";
	var conversation_title = "Piggy Tales";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['piggy_tales_3-0-2'] = {txt: "Wha?", value: 'piggy_tales_3-0-2'};
		this.conversation_start(pc, "Anything good planned for Belabor Day this year?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-0-2"){
		choices['1']['piggy_tales_3-1-2'] = {txt: "Um… No?", value: 'piggy_tales_3-1-2'};
		this.conversation_reply(pc, msg, "Belabor Day! Belabor day? Oh come ON dude, you’re not telling me you’re ignoring the partyhardingest day of the year, right?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-1-2"){
		choices['2']['piggy_tales_3-2-2'] = {txt: "No…", value: 'piggy_tales_3-2-2'};
		this.conversation_reply(pc, msg, "Darn right no. Belabor Day, as one of the only holidays that belongs to no Giant, but every giant. And is just the greatest holiday EVER. You know why?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-2-2"){
		choices['3']['piggy_tales_3-3-2'] = {txt: "Cocktails?", value: 'piggy_tales_3-3-2'};
		this.conversation_reply(pc, msg, "Me neither, dude. Because traditionally, come the day after, no one can ever remember what they did ON Belabor day. They just know it involved a barbeque, everyone they know, and the copious blessing of the fruits of Friendly, if you know what I’m saying…", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-3-2"){
		choices['4']['piggy_tales_3-4-2'] = {txt: "Party on, Pig.", value: 'piggy_tales_3-4-2'};
		this.conversation_reply(pc, msg, "By the BUCKET, dude!!! Not to … well, belabor it, but it’s the greatest day in the world.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-4-2"){
		choices['5']['piggy_tales_3-5-2'] = {txt: "Oh, I will.", value: 'piggy_tales_3-5-2'};
		this.conversation_reply(pc, msg, "Party on, Glitch!", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'piggy_tales_3', msg.choice);
	}

	if (msg.choice == "piggy_tales_3-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"surfeit_of_cherries_2",
	"ages_of_the_world_2",
	"piggy_tales_1",
	"piggy_tales_2",
	"piggy_tales_3",
];

function parent_die(){ // defined by npc_animal
	this.apiDelete();
}

function parent_onPlayerCollision(pc){ // defined by npc_animal
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function parent_startMoving(){ // defined by npc_animal
	if (this.isRooked()) return;
	if (this.isSad()) return;

	if (this.pathfinding_paused) return; //delete this.pathfinding_paused;

	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.isWaiting) return;

	if (this.moving_to == 'food') {
		this.ai_debug_display("Moving to food, not doing normal movement");
		return;
	}

	var leftside = this.container.geo.l+200;
	var rightside = this.container.geo.r-200;

	var left = leftside;
	var right = rightside;

	if (this.move_limits) { 
		// Restrict to within the w distance from the position of the move limits.
		// However, if the position is too close to the edge, shift the entire range over 
		// to within the level.

		var shift = 0; // amount to shift by

		left = (this.move_limits.x) - (this.move_limits.w);
		if (left < leftside) { 
			if (this.move_limits.x < leftside) { 
				leftside = this.move_limits.x;
			}

			shift = leftside - left;
			left = leftside;
		}

		right = (this.move_limits.x) + (this.move_limits.w) + shift;
		if (right > rightside) { 
			// shift value should be 0 if we hit this case
			if (this.move_limits.x > rightside) { 
				rightside = this.move_limits.x;
			}

			shift = rightside - right;
			right = rightside;

			left += shift; 
		}
	}

	if (this.go_dir == 'left'){
		this.ai_debug_display("I'm moving left, my x is "+this.x+" and xcoord is "+left);

		if (this.move_limits) { 
			var target_x = randInt(left, this.x - 25);
		}
		else {
			var target_x = left;
		}

		if (!this.apiFindPath(target_x, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}else{ // right
		
		this.ai_debug_display("I'm moving right, my x is "+this.x+" and xcoord is "+right);
		
		if (this.move_limits) { 
			this.ai_debug_display("I'm moving right - move limits x is "+this.move_limits.x+" move limits width is "+this.move_limits.w+" and rightside is "+rightside+" target is "+right);
		}
		else { 
			this.ai_debug_display("No move limits");
		}

		if (this.move_limits) { 
			var target_x = randInt(this.x + 25, right);
		}
		else {
			var target_x = right;
		}

		if (!this.apiFindPath(target_x, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Piggies can be nibbled for <a href=\"\/items\/73\/\" glitch=\"item|meat\">Meat<\/a>."]);
	out.push([2, "Piggies produce <a href=\"\/items\/369\/\" glitch=\"item|plop\">Plop<\/a> when fed Crops."]);
	out.push([2, "Piggies can be grown from <a href=\"\/items\/359\/\" glitch=\"item|piglet\">Piglets<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"animal",
	"no_trade",
	"npc-animal"
];

var responses = {
	"revived_1st_time": [
		"Ah, that's, like, marginally better. Need more though.",
		"Woah. Little perkier. But I need more reviving, dude. More.",
		"Rook. Too strong. Need more reviving. Someone else too, maybe?",
		"Danke, dude. Still far from awesome, though. Try a powder?",
		"Good, but gonna need that, but, like, three times over, man.",
	],
	"revived_2nd_time": [
		"MAN that's better. But not quite there. Just a little more, dude?",
		"Totally shaking off that rook. But still shaky. Little more help?",
		"I am returning to piggy-awesomeness. One more little revive?",
	],
	"revived_3rd_time": [
		"YAY! Like, totally revived from my gnarly rooking, thanks to {pc_label}.",
		"Zoink! {pc_label} saved the day! I am now totally unrookified, man!",
		"You're the GLITCH, {pc_label}! I'm totally revived. Party on!",
	],
	"rooked": [
		"Oooh. Dude, this sucks. Someone help me! Like, seriously!",
		"Gnarly Rook action! Achy hooves, tender loins! Help.",
		"Oh man, this Rook thing is totally bogus.",
		"Bro', my tiny shanks are porked. Do something, dude!",
		"Seriously bummed out, dude. Been rooked. Help.",
	],
	"sad_piggy": [
		"I don't wanna be here.",
		"I'm BORED.",
		"I don't like this. You promised me fun. This isn't fun.",
		"What is this place anyway, it's rubbish, take me somewhere else.",
		"Take me away from here, it's lame. I hate it.",
		"Don't like it here. It's smelly.",
		"This is boring, why did you bring me here? It's lame.",
		"Where ARE we? It's Lame-o. LAME-O.",
	],
	"capture_failed": [
		"No way, dude! I'm not a one-Glitch piggy.",
		"Man, I'm totally not ready to settle down.",
		"I like to think of myself as a free spirit.",
		"Not today, friend. I'm happy chewing on this gnarly patch.",
		"No, dude. I'm dandy just hangin' out here. Mañana.",
	],
	"capture_released": [
		"FREEEEEEEDOM!!!",
		"Pigs like us: totally born to run, dude!",
		"YES! I feel the wind blowing up my snout once more!",
		"Another victory for the pig liberation front!",
		"I am not a captive meat repository! I am a free pig!",
		"Free! Free to be the pig I long to be!",
		"Free to waddle! Waddle like the wind!",
		"I was born to roam, friend.",
		"You chafed my nubbin, pal. But I forgive you.",
		"Free like the waves…",
	],
	"feed": [
		"Nom nom burp nom excuse me dude nom",
		"Pigs are omnivores, right? Cuz I'm eatin' ALLa this.",
		"Ahh. Wait, did you want to go halvsies?",
		"That'll do, dude. That'll do.",
		"I like you the most. Well, second-most (after your food).",
		"*Buuuuurrrp*",
		"*snurfle snurfle snufle snurfle*",
		"Can't. Talk. Eating. Laters.",
		"Piggy picnic!",
		"Sweet snackage, chum.",
		"Super-snafflable scran, man.",
		"Wait, Scooby Snacks do direct delivery? Awsum.",
		"So. Full. Well, maybe a *little* more....",
		"Nom nom nom.",
		"You're my favourite, friend. Loves.",
	],
	"nibble_ak1": [
		"Meat, eh? Well, only because I like you...",
		"Some of my finest nibbly bits I give to you. Nib well.",
		"You wanna piece of ME?!? Oh, ok then.",
		"Take, eat, don't think about it too hard...",
		"Mi cárnico es su cárnico, amigo.",
	],
	"nibble_ak2_ak3": [
		"Hey! Careful where you put those incisors, pal",
		"Take, eat - I'm great with cheese. TMI?",
		"Mama said: Life is like a box of meat. Guess what you're getting?",
		"Hey leave a little! Don't be piggy. That's my job.",
		"Don't eat it all at once, nibblemeister.",
		"Pleased to meat you, dude. Heh.",
		"Meat, huh? Only 'cause you're sweet.",
		"You'll eat well today, friend.",
		"Here's your pocket of protein, chum.",
		"Happy meatyday, dude",
	],
	"nibble_ak4_ak5": [
		"Here you go, dude - chop chop.",
		"Your supertight nibblatory skills impress me.",
		"A little more off the side? Sweet, dude.",
		"If meat were money, you'd be minted. You're just meated.",
		"You want cooking suggestions? I say yes: Cook.",
		"You keep me sweet, you get your meat. Dude that rhymes!",
		"This enough? \"Hample\", you say? Heh!",
		"Take meat, this is my booty, just for you.",
		"Hitting you with the protein re-up, chum! BAM!",
		"You are what you eat, friend. And so am I.",
	],
	"nibble_ak6_ak7": [
		"I've got plenty more where that came from, friend.",
		"Mucho meat for you, matey",
		"Come back soon, bud. You're superawesome.",
		"This meat? The good stuff. Tell your friends.",
		"I crown you Top Nibbleteer. I crown you with meat.",
		"You're hamming it up today, chum.",
		"Nice nibbling, nimble-gnashers.",
		"Meat to please you, my friend.",
		"I have to admire your passion for pig, dude.",
		"Mi carne es su carne, amigo.",
		"The meatier the merrier. Yes, it's a phrase.",
		"Boom! Daily hot meat injection straight to your bag!",
		"You're now mighty, mighty meaty, matey.",
		"Gnarlatious nibbling, dude!",
		"Mondo meat action, El Nibblino",
	],
	"nibble_bonus_ak3": [
		"TA DA!!!",
		"Bam! Bet you weren't expecting THAT!",
		"HOWZAT!",
		"Primo meat action! PRIMO!",
		"Piggybunga, dude!!!",
	],
	"nibble_bonus_ak4": [
		"Today's meat... gnarlacious nibbling dude.",
		"Shaz-HAM! Meat up the wazzoo, friend!",
		"BANZAI!!!",
		"What up with THAT!?! BOOM!!",
		"Sweet meatiness, dude. For you.",
	],
	"nibble_bonus_ak5": [
		"For YOU, buddy.",
		"BOOM goes the dynamite! YEAH!",
		"SWEEEEEET MEATS!",
		"Happy meat. I've got some happy meat…",
		"To fuel all your adventures, dude.",
	],
	"nibble_bonus_ak6": [
		"Party on, Glitch.",
		"Can't live on meat alone, dude. Unless you're on Atkins.",
		"For you, Dude? Always.",
		"Meatybunga, Duderino!",
		"Awesum nibblage, chum. Rad.",
	],
	"nibble_bonus_ak7": [
		"Max OUT on meat: Just for being you, dude.",
		"Keep on truckin', friend. Keep on truckin'.",
		"Meated to the max, dude",
		"Because you're RADICAL.",
		"Sha-sha-shaz-HAM!!!",
	],
	"nibble_na_fail": [
		"Denied, friend, I'm all nibbled out!",
		"Nah. Not happening. Meat out, dude!",
	],
	"nibble_without_pet": [
		"Gnarly nibble' wipeout!  (That means you failed, friend)",
		"Ain't no such thing as a free lunch, dude.",
		"No love, no nibblin'. I ain't no fool.",
		"Don't be rash. No rashers for the rash.",
		"Finagle my porkloin without even a cuddle first? No way!",
	],
	"pet_ak1": [
		"Mmm... I like that!",
		"Respect the pot belly, dude!",
		"You've got piggy-petter promise, sparky.",
		"Niiiiiiiiiiiiiiiiiice",
		"Work on that piggyrub: you and I could be friends.",
	],
	"pet_ak2_ak3": [
		"Wicked good petting action.",
		"Like it. Firm Hand, no tickling. Nice work.",
		"Swanky flankpatting. My flanks thank you.",
		"You've been practicing. I can tell.",
		"Pet early, pet often, pet just like that.",
		"Literally awesome. Literally.",
		"Sweeeeeeet.",
		"Mhm. I'm feelin' you, bud.",
		"*Satisfied grunty noises*",
		"Nice work, friend.",
	],
	"pet_ak4_ak5": [
		"RADICAL, DUDE!",
		"Duuuuude. I'm, like super-relaxed.",
		"You pet like a pro, bro.",
		"I don't think any pig has ever been this relaxed.",
		"So relaxed. You should probably know I fart when I'm relaxed.",
		"Super-sick petting action, pal.",
		"Dude, you literally could not suck less at this.",
		"Sweet, dude. Sweet.",
		"You're some handy dandler, I'll give you that.",
		"A firm hand cures all gnarliness. Yes.",
	],
	"pet_ak6_ak7": [
		"I keeeeeeessss you!!!",
		"Damn, you's a petsy glitch!",
		"Petting soothes the savage piggy. Rowr! Oink.",
		"Superhot stroking, Strokey McPetster!",
		"My flanks are crackling under your electric touch.",
		"Damn, dude! You're AWESOME.",
		"Hot stuff, Petsy McStrokateer!",
		"And they shall call you El Petterino.",
		"YEAH!!!",
		"Now that's what I call petting, pigbuddy",
		"You the petmeister, dude. Or perhaps just The Dude.",
		"My hocks shiver at your sweet dandling-skills, dude",
		"Squeeeee-hee-hee!",
		"Petty on, dude!",
		"Squeeeeee! And other fanpig noises!",
	],
	"pet_na_fail": [
		"meh",
		"eh",
		"Whatever",
		"I've had better",
		"That didn't hit the spot",
		"Meh, I'm just not feelin' it, dude",
		"Woah there, piggle! I'm not in the mood",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-40,"y":-55,"w":81,"h":55},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEhklEQVR42u2X7U9bdRTH+Q\/6JzQm\nvjG+aBbI1IkUWCdRmbPzBdkLxW2KMcMBm3uAArctLdy1pRf6IDBYKw+ylofVFlFmwUvbtQwZXAd0\nJprlGuP7+yccf+fixdu7tlgLyRJ7khOa3733\/D7nnO\/vgbKykpWsZCUr2ZFaeiFI7YaDjc8l3NPo\njCodCULC0wfb85N8Ohw481wBPonMaLfnJiDBmGCFbofNr0cFhJa\/82iEVq27zJrcQRbn1TsLAU1R\nICSGcmJp\/PHMV5ByW0VnHd3wJBxowWcIlXJZmBVbp7BougqWt2vV5vqaZznwA2wDuvSx0jABrAbq\nSfLdcIBVuJBljN0JTQsp0uINnwsSgz2AY9jqn8YGuDDVBnM3LwECej96v8V0ukaLTut0qmcAxAki\nQQZBEBR\/p8NBToI\/Cicth8We6xBzGiHpsahztojA8fiBmF2WQDv3poCbHgWsxPptp+ibE0Ow+810\n0ZBbUyOArc6rIdwG8lULgSQdyf3hsP1QIHcCdw5eA4\/Gh9hcARAkGyA6LoJCYH4O3BGrj5WTkkM5\n5YVL9Js1W9NjOYPKV6LcidAL1x2BW+2nwPf5eQh1tYrAqP9su8A\/gINWKlugtS9vZbQQx6TsEfq\/\ntBd1fLfHAGhjQ17wtjaJcbKdNn+uJ\/Zan3TToVy6K7SF+VzqxG\/RCDAMAxRFwbEXX9hLllRROmmw\nmtj2p\/EoiIBxpoc9KDg5qg4FEvdDhDR\/dgEnh4baSlkC45Dy2kjbfZBemIHfU6t7gDGHqQUfHgR4\nWJCoO9Svcqt6eJsBsrGL\/sv392CDvLe3gmlalfTahfxBfbDh98BRbtxi5f7+jYCxEQfsCxKrmA9g\nc3IE1oYcRwoo91+Xv4WNoJ\/PWDVEi34EybpZjw3+qwoWIgNudkL0XIB\/JOOZ1zNsdbzfzKMGMlff\nODxw94FyPBuccj\/Npm2Mg+OYMCb+nbUD2AGL+DfSfQXuXmnyL9E5rmAP3DSfcVaSCeNOMyQGrGIw\nrHAuUBS5Egjfxxj4DFcoJooecxhFX3UYBeLsqt3IEJk1YpHynirKLQehpGByx0lwQrljIkpA5XcE\nhCdAoVi\/kcITrODLJ2Yi19H2\/JSYGWujONbWnRVW7nLAx7MT3DLdyROHaK8BonQXFH1Nj9tNZ+SL\nQTrIf+ht194nGlm2UZAcdsLa6CBsTQ5nVAABMxYSudguWdrZmJvel0Wxt\/cyk\/6UNtzXBbPUF\/Cj\nxwZzhsscjq9YDGrX+Qbwt34Ciw4T3L\/VCcoDHrWErd8HJEfXkrWjJeG1Z0AXBdhUXq7qeFfHU+9U\nQa9eB7azuv22NFdVUG01r4D5dHXGuGwvbcQqShLB23mUvqHyfPqBkPR5xITnjdcE\/P+jKMjmymOa\ntprjgrm+OtSnr+VcDW9qJPhLb1QwhrpKjtafZF3n3tIqvzWereOYj89B2HwdnB\/qxRvKheMva5qr\nynnLeyd5Epe7dupVf9FaRJirtScKzhRhLr6mEQx1rzOm+mpWGr944iX15eoKqqxkJSvZ\/8z+ArZ3\n+Ws0pdkYAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1284749107-8831.swf",
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
	"z"	: "name",
	"e"	: "feed",
	"n"	: "nibble",
	"y"	: "apply_balm",
	"o"	: "apply_youth",
	"c"	: "capture",
	"u"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "pet",
	"h"	: "rename",
	"v"	: "revive",
	"k"	: "rook_attack",
	"j"	: "talk_to",
	"q"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("npc_piggy.js LOADED");

// generated ok 2012-12-02 21:35:40 by ali
