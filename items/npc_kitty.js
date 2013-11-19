//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Kitty";
var version = "1354512940";
var name_single = "Kitty";
var name_plural = "Kitties";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_kitty", "npc_animal", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
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

verbs.feed = { // defined by npc_animal
	"name"				: "feed",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
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

verbs.pet = { // defined by npc_animal
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
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

verbs.nibble = { // defined by npc_animal
	"name"				: "nibble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
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

function die(){ // defined by npc_animal
	this.apiDelete();
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

function onPlayerCollision(pc){ // defined by npc_animal
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
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

function startMoving(){ // defined by npc_animal
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"npc",
	"animal",
	"no_trade"
];

var responses = {
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
		'position': {"x":8,"y":-42,"w":29,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGgklEQVR42u2Y\/U9aVxjH\/Q\/8E\/yx\nS5PFLd2W\/rLZNPtpW+cva5YJVm0739\/RUl8RxIrW92pBUfEFh4CAoALWKpUiFEWo2tp1dhLb1LVd\nOrcs3U9Lnt3n6L3xioBa2i7LbvIN3Jtzzv3c5zzPec55oqL+v8JfcklCvE6WpTD3FfmsA8WKfw1Y\nl4Sb1yXh+HWybJgcvMRoWsmLCWhs15TEec1X4nzW6jyfpUbAyFydhM8jCdbdkBAjl3BtlEDTkcGC\nQ+1rxdvaUgpIDCFlrt7ymsU2n1nc7LWK448C1yPhxspruVsIh7L0FzFg5r5iMMl55P+Uhh+9xw+4\ntjtGAYSF3AOMVvZOiGOOAtfXmMyCk1ZlgLxm26LWweI8NmAdVzA1VHw4wF1Cy3rN1f5Qbeb05WDX\nlhIZu3Ogt\/4cY8He2iyoyuaAhMdAGwIAsRMO5DJUgUFWTDQ1WAo2VTl5dlT4UHLoKqj38KAmPwkk\nhSlQW5AMOmkhgWRHVC3HN3wtlXSaVVeCVJBN1FGRCS0laYxULQUEOBJwC+NCamoLQSbKgObLqeRd\nqKGmvEBAOqrozrq2MkbqpsvQW1MQABpJS5rkl0BWlUUAlY25+wDWcpoREP0EO1h6KliQKFUjH66V\nZzCQcnE2LIyJIgaJbqSozaU+Pj8QkEQYBTihyCeN7eqqAEAaEgfRtvPgtrYy4j6JH2zs4gUCbq\/s\nHD9GFvqGZ7waDO1sOLxH8DcRLLvlNFTiYr0VuMLXcZLQivRyM6MUsAAdWuEbh6PV15BsC5IfOf7+\nxhTSCK04JisncBPyircGh9JKM5r3z5N7rDhvEpGpnVRUvlVATKchdhkcP70m0pZEvWko6wAfRrsL\nwTUqIGk0+G5jx4qHzc34gvrSRGi7Ugg9rRVE6i4B2NRlYftOa2rAdesmLM+7YHJERkDDbCK5NutA\n4aHgLmV+C3+8eA5\/v3rF0sOlBXhg7wyd8ixK2Fhbg3teL\/ziX4eynG9CA3bVJ8bpO7MODIhwj+4v\ns8Bcs7Pw27Nn5P9fLzdh6cbV4Is0ZT1s19bURCAXp3tDA7p1\/FijPIsKktDRi9PX35QJvR3bA9NA\nqMy0NPj4xAnm2ePliaDj9EjbSRtFVxfp93T1ZmhAKqMIlM0pYFflw5w2+DYMHTor+UviO\/j1uy2I\n9+8dOwb8oiJy\/\/vTH4OOk5d5kbRFJSYkhAc0dGYKFFfPEUCHhkdFcfAM0iZMIYCnT50ifoQwaLX4\nM2eYl9KAq\/ZuePLABS83N1kaVQ+Rdu8fPw7pKcnE2qGDhNofYiQjYDgr4hSjD+ELcErRAgiL9yc\/\n\/AC++\/oMAXyx7oP7d8wE6K7bCaqaEqJxaSN5NmkyQWVeDnGVezNt4YOEOnUZxuTpjBUXxgREixPC\ngGmWNVURMNpiqM8+OgHff\/UF8SsEdFtlcG9+Bh4s+eDJozVoF5dCZToXxtVKAvh4ZZJY2e\/Vk3EP\ndIboqUsE21AuY0mUS39532XGYhgm\/vb5yU\/g7OlTEB\/3KYiFQgL368\/zMDPMh0ltMzzb2CBCKM1A\nN\/ldX5oJGPNgh2rqkDPamcYCtA8XkCnfG+EIafqhHWyTFrLE4FT9+dzPRC\/uNZUtF0DTWUyte\/1E\nxsEGsAzXsZKCU8cHl67Ed9DDtQF9US9NDbAkDuQeLTt0SsNDE6ZShNVeTyf3jLtQs4NjTytzmg92\nyN5JewONSTA9mMO25I7mjeXEN71m0aHPJNsnQhHxaxTOik2Zu6VrvxBz8CrAzlkW\/XGk4yLc6M\/e\nF\/Qo1sSPu60uBLexgoHVX09Neq1qAC7gVkVWoCWDZB0S\/RMNsGhpgjWPCZ489MHGqhv8K05YX3bA\nrK56185JmBR15JJFGECnvjSopVZmOmBzfY2J4N2yqFtB2V6whUvba1ejMLvQoPgfp3yiJ2PHsXlg\noQ76uAuiKwi0FidbWICbfj\/8tLICiy4XLMzN+b1ud2xEKlNUoBgwWFSt52E3rG1UCguOW7Di8YBZ\nI4UxVSsj60gngUGt3r0LPrcbPE4nipQ3PB5PdMRKZx4NP3puhO+nnXtamUttNmvBPTMK8\/Yp+sX7\na27OhqKsJvA6nREt6bEhpyTR1JnBR0cdwmIqxAXcoROCy1QPDn0NkX1EDL0N57feSYXUZ6lWsCtc\nIlbk4kKOVla1nH93ZV2svpKi5r4lORE41Dxbp+RsdNS7vrxWUeze8vGCsSw+6r9+\/QMG3+xNjlii\nCwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/npc_kitty-1328837682.swf",
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
	"animal",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "feed",
	"n"	: "nibble",
	"u"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "pet"
};
itemDef.keys_in_pack = {};

log.info("npc_kitty.js LOADED");

// generated ok 2012-12-02 21:35:40 by ali
