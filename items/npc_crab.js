//#include include/events.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js

var label = "Crab";
var version = "1354516873";
var name_single = "Crab";
var name_plural = "Crab";
var article = "a";
var description = "Anyone knows music makes crabs happy, but it takes an expert DJ to satiate both the appetite for variety and yen for classic tunes it desires. The tunesmith who can play a full array of Music Blocks, culminating with a cherished favorite, will be richly rewarded.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_crab", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "roam"	// defined by npc_walkable (overridden by npc_crab)
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

verbs.hug = { // defined by npc_crab
	"name"				: "hug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Better to butter it up first",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.hasFlattered(pc) && !this.canHugAgain(pc)) return "Over over-hugging";

		if (this.hasFlattered(pc)) return "This crab is ripe for a hug";

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (this.hasFlattered(pc) && this.canHugAgain(pc)){
			self_msgs.push("Your firm but gentle embrace causes the crab to excrete a tin of its finest essence: Crabato Juice. All the goodness of crab, plus tomatoes!");
			if (this.isOnGround()){
				var val = pc.createItemFromSource("crabato_juice", 1 * msg.count, this);
			}else{
				var val = pc.createItem("crabato_juice", 1 * msg.count);
			}
			if (val){
				self_effects.push({
					"type"	: "item_give",
					"which"	: "crabato_juice",
					"value"	: val
				});
			}

			this.huggers[current_day_key()][pc.tsid]++;
			this.setAndBroadcastState('like_off');

			if (!this.hugged_for_feat) this.hugged_for_feat = {};
			if (!this.hugged_for_feat[pc.tsid]) {
				this.hugged_for_feat[pc.tsid] = true;
				pc.feats_increment('animal_love', 1);
			}
		}
		else if (!this.canHugAgain(pc)){
			failed = 1;
			self_msgs.push("Now you're being pushy. It's making the crab uncomfortable. Perhaps you need a little space to think about what you've done. ");
			var val = pc.metabolics_lose_energy(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			this.setAndBroadcastState('dislike_off');
		}
		else{
			failed = 1;
			self_msgs.push("Hey, hey, hey. Keep your claws to yourself. If you want to get friendly, try saying something friendly, why don't you.");
			var val = pc.metabolics_lose_energy(2);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			this.setAndBroadcastState('dislike_off');
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'hug', 'hugged', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.flatter = { // defined by npc_crab
	"name"				: "flatter",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Make the crab feel good",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("You know how to talk to a crab. The crab can't give you a beckoning, come-hitherish kind of look. But it would if it could.");
		var val = pc.metabolics_add_mood(1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(1 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		this.incFlattering(pc);
		this.setAndBroadcastState('like_off');

		var pre_msg = this.buildVerbMessage(msg.count, 'flatter', 'flattered', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		if (!this.flattered_for_feat) this.flattered_for_feat = {};
		if (!this.flattered_for_feat[pc.tsid]) {
			this.flattered_for_feat[pc.tsid] = true;
			pc.feats_increment('animal_love', 1);
		}

		return failed ? false : true;
	}
};

verbs.pinch = { // defined by npc_crab
	"name"				: "pinch",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Caution: pinching into pincers",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("The crab is hurt. It's not so much the pain of the pinching as the encroachment on the crab's job description. Lesson learned: Never pinch a pincher.");
		var val = pc.metabolics_lose_mood(2 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'pinch', 'pinched', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		this.setAndBroadcastState('dislike_off');

		if (!this.pinched_for_feat) this.pinched_for_feat = {};
		if (!this.pinched_for_feat[pc.tsid]) {
			this.pinched_for_feat[pc.tsid] = true;
			pc.feats_increment('animal_love', 1);
		}

		return failed ? false : true;
	}
};

verbs.insult = { // defined by npc_crab
	"name"				: "insult",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Caution: this <i>is<\/i> a Crab",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Don't you know you can catch more crabs with honey than with vinegar? Crabs hate vinegar.");
		var val = pc.metabolics_lose_mood(2 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'insult', 'insulted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		if (!this.insulted_for_feat) this.insulted_for_feat = {};
		if (!this.insulted_for_feat[pc.tsid]) {
			this.insulted_for_feat[pc.tsid] = true;
			pc.feats_increment('animal_love', 1);
		}

		return failed ? false : true;
	}
};

verbs.engage = { // defined by npc_crab
	"name"				: "engage",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		else return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var txt = "What's the frequency, Kenneth?";
		//var choices = {
		//	1: {txt: "Sounds great!", value: 'trade-yes'},
		//	2: {txt: "What else do you have?", value: 'trade-redo'},
		//	3: {txt: "No thanks.", value: 'trade-no'},
		//};
		this.conversation_start(pc, txt);
		//this.conversation_start(pc, txt, choices);

		return true;
	}
};

function blockListenCallback(details){ // defined by npc_crab
	var pc = details.pc;
	var block_class_id = details.block;

	//
	// Find it in the queue
	//

	var max_blocks = 25;	// number of normal music blocks as of October 2011 
	if (!this.blocks_played) this.blocks_played = {};
	var queue_size = num_keys(this.blocks_played);

	var last_played = this.blocks_played[block_class_id];

	this.blocks_played[block_class_id] = time();
	if (last_played){
		var blocks_played_after = 0;
		for (var i in this.blocks_played){
			if ((i != block_class_id) && (this.blocks_played[i] > last_played)) {
				 blocks_played_after++;
			}
		}

		if (!blocks_played_after){
			var reply = "Damn! I just heard this one! Argh!!!";
			this.setAndBroadcastState('dislike_on');

			this.events_add({state: 'dislike_off', rewards:{}, pc: pc, callback: 'blockPlayCallback', reply: reply}, 3);
			pc.feats_increment('animal_love', 1);
			return;
		}
		else{
			// Make this >= max_blocks, so the achievement doesn't break every time we 
			// add more. And subtract 1 for the 1 we're listening to.
			if (blocks_played_after == (queue_size-1) && queue_size >= (max_blocks-1)){
				var reply = "Wow! I haven't heard this in forever. Love it! Thank you - take this gift!";
				pc.achievements_grant('make_a_crab_happy');

				var rewards = {
					'mood' : 99999,
					'energy' : 99999,
					'xp' : 1000,
					'currants': 2000
				};

				pc.feats_increment('animal_love', 5);
			}
			else{
				var reply = "Huh, yeah. This is not a bad little number. Here's something for you.";
				var rewards = {
					'xp' : 10 * (queue_size-blocks_played_after),
					'currants': 25 * (queue_size-blocks_played_after),
				};
			}

			this.setAndBroadcastState('like_on');

			this.events_add({state: 'like_off', rewards: rewards, pc: pc, callback: 'blockPlayCallback', reply: reply}, 3);
			pc.feats_increment('animal_love', 3);
			return;
		}
	}
	else{
		var reply = "Ooooh. I've never heard this one before. Here's a little something by way of appreciation.";
		var rewards = {
			'xp' : 10 * queue_size + 100,
			'currants': 25 * queue_size + 100,
		};

		this.setAndBroadcastState('like_on');

		this.events_add({state: 'like_off', rewards: rewards, pc: pc, callback: 'blockPlayCallback', reply: reply}, 5);
		pc.feats_increment('animal_love', 5);
		return;
	}

	this.onInteractionEnding(pc);
	this.startMoving();
}

function blockPlayCallback(details){ // defined by npc_crab
	var pc = details.pc;
	var rewards = details.rewards;

	pc.items_destroy('crabphones', 1);
	this.setAndBroadcastState(details.state);

	var mood_loss = 0;
	if (details.state == 'dislike_off'){
		if (pc.buffs_has('crab_state_of_mind')){
			mood_loss = pc.metabolics_lose_mood(20);
		}

		pc.items_destroy(details.block, 1);
	}
	else if (pc.buffs_has('crab_state_of_mind')){
		for (var i in rewards){
			rewards[i] = rewards[i] *  2;
		}
	}

	if (rewards.mood) rewards.mood = pc.metabolics_add_mood(rewards.mood);
	if (rewards.energy) rewards.energy = pc.metabolics_add_energy(rewards.energy);
	if (rewards.xp) rewards.xp = pc.stats_add_xp(rewards.xp, false, {'verb':'blockPlay','class_id':this.class_tsid});
	if (rewards.currants) rewards.currants = pc.stats_add_currants(rewards.currants, {'verb':'blockPlay','class_id':this.class_tsid});

	if (mood_loss){
		rewards.mood = intval(rewards.mood) + mood_loss; // mood_loss is negative
	}

	if (details.reply){
		this.sendBubble(details.reply, 4000, pc, rewards);
	}

	this.onInteractionEnding(pc);
	this.apiSetTimer('startMoving', 3000);
}

function canHugAgain(pc){ // defined by npc_crab
	if (!this.huggers || !this.huggers[current_day_key()]){
		this.huggers = {};
		this.huggers[current_day_key()] = {};
	}
			
	if (!this.huggers[current_day_key()][pc.tsid]){
		this.huggers[current_day_key()][pc.tsid] = 0;
		return 1;
	}

	return 0;
}

function hasFlattered(pc){ // defined by npc_crab
	this.initFlattering(pc);
			
	return this.flatterers[current_day_key()][pc.tsid] == 0 ? 0 : 1;
}

function hasIgnoredToday(pc){ // defined by npc_crab
	var today = current_day_key();
	if (!this.ignored) return false;
	if (!this.ignored[today]) return false;
	if (!this.ignored[today][pc.tsid]) return false;

	return true;
}

function hasPlayedToday(pc){ // defined by npc_crab
	var today = current_day_key();
	if (!this.played) return false;
	if (!this.played[today]) return false;
	if (!this.played[today][pc.tsid]) return false;

	return true;
}

function ignoreToday(pc){ // defined by npc_crab
	var today = current_day_key();
	if (!this.ignored || !this.ignored[today]){
		this.ignored = {};
		this.ignored[today] = {};
	}

	if (!this.ignored[today][pc.tsid]){
		this.ignored[today][pc.tsid] = 0;
	}

	this.ignored[today][pc.tsid]++;
}

function incFlattering(pc){ // defined by npc_crab
	this.initFlattering(pc);
	this.flatterers[current_day_key()][pc.tsid]++;
}

function initFlattering(pc){ // defined by npc_crab
	if (!this.flatterers || !this.flatterers[current_day_key()]){
		this.flatterers = {};
		this.flatterers[current_day_key()] = {};
	}
			
	if (!this.flatterers[current_day_key()][pc.tsid]){ this.flatterers[current_day_key()][pc.tsid] = 0; }
}

function onConversation(pc, msg){ // defined by npc_crab
	if (msg.choice == 'play-music-yes'){
		this.apiCancelTimer('timeoutRequest');

		var choices = {};
		var contents = pc.getAllContents();
		
		var i = 1;
		for (var tsid in contents){
			var it = contents[tsid];
			if (it.is_musicblock){
				choices[i] = {txt: it.label, value: it.tsid};
				i++;
			}
		}

		choices[i] = {txt: "Never mind", value: 'play-music-no'};

		this.conversation_reply(pc, msg,"Which tune do you want to play for me?", choices);
	}
	else if (msg.choice == 'play-music-no'){
		// IF you never mind him
		// THEN he will not bug you again that day.

		this.apiCancelTimer('timeoutRequest');
		this.conversation_end(pc, msg);
		this.ignoreToday(pc);
		this.onInteractionEnding(pc);
		this.startMoving();
	}
	else{
		// Conversation end resumes motion
		this.conversation_end(pc, msg);
		this.apiStopMoving();
		this.apiCancelTimer('startMoving');

		var contents = pc.getAllContents();
		if (contents[msg.choice]){
			var block = contents[msg.choice];
			this.playToday(pc);
			pc.createItemFromSource('crabphones', 1, this, true);


			this.setAndBroadcastState('listen');
			this.events_add({pc: pc, block: block.class_id, callback: 'blockListenCallback'}, 4);
			return;
		}
		else{
			this.conversation_reply(pc, msg, "Not sure what you mean there...");
			this.onInteractionEnding(pc);
			this.startMoving();
		}
	}
}

function onCreate(){ // defined by npc_crab
	this.initInstanceProps();
	this.setHitBox();

	this.parent_onCreate();
	this.npc_can_climb = false;

	this.messages_register_handler('player_collision', 'requestMusic');
}

function onInteractionEnding(pc){ // defined by npc_crab
	delete this['!offering'];

	return this.parent_onInteractionEnding(pc);
}

function onLoad(){ // defined by npc_crab
	delete this['!offering'];
}

function onPlayerCollision(pc){ // defined by npc_crab
	// IF you get within 500px of a crab
	// AND the crab is not conversing with another player
	// AND you have not played any music for that crab (see below) OR never-minded him in the current game day
	// AND you have a music blox on your person
	// AND you have an empty inventory slot
	// THEN the crab will holla out to you ""Hey! Hey! $PlayerName! I want to listen to some tunes! What do you have for me? [Play a tune] [Never mind]"

	if (this['!offering']) return;

	if (this.hasPlayedToday(pc)){
		//log.info('played today '+pc);
		return false;
	}

	if (this.hasIgnoredToday(pc)){
		//log.info('ignored today '+pc);
		return false;
	}

	function has_block(it){ return it.is_musicblock; }	
	if (!pc.countItemClass(has_block)){
		//log.info('no blocks '+pc);
		return false;
	}

	if (!pc.hasEmptySlot()){
		//log.info('no empty slot '+pc);
		return false;
	}

	//log.info('requesting music from '+pc);
	this.stopMoving();

	var txt = "Hey! Hey! "+pc.label+"! I want to listen to some tunes! What do you have for me?";
	var choices = {
				1: {txt: "Play a tune", value: 'play-music-yes'},
				2: {txt: "Never mind", value: 'play-music-no'},
			};
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
	this.conversation_start(pc, txt, choices, null, null, null, {required_distance: 100, dont_take_focus: true});

	this['!offering'] = pc;
	this.apiSetTimer('timeoutRequest', 30000);
}

function onPrototypeChanged(){ // defined by npc_crab
	this.onLoad();
}

function playToday(pc){ // defined by npc_crab
	var today = current_day_key();
	if (!this.played || !this.played[today]){
		this.played = {};
		this.played[today] = {};
	}

	if (!this.played[today][pc.tsid]){
		this.played[today][pc.tsid] = 0;
	}

	this.played[today][pc.tsid]++;
}

function setHitBox(){ // defined by npc_crab
	log.info("Resetting hitbox on crab "+this);

	this.apiSetHitBox(500, 200);
}

function stopMoving(){ // defined by npc_crab
	this.apiStopMoving();
	this.setAndBroadcastState(choose_one(['idle1', 'idle2']));
}

function timeoutRequest(){ // defined by npc_crab
	if (!this['!offering']) return;

	var pc = this['!offering'];
	this.ignoreToday(pc);
	//this.conversation_end(pc, {});
	this.conversation_cancel(pc);

	delete this['!offering'];

	this.startMoving();
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

function parent_stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function parent_onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
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
	"npc",
	"no_trade",
	"npc-animal"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-45,"y":-108,"w":101,"h":107},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMZUlEQVR42s1YaVRT1xr1Z1fbVxwR\nmcIkoxAmUbAaGRxAMAUFAYE44KyNgDhUICCKiAMqTrRIkEmKYEBkUjHOomKCgDgBQUFUUK5PrNj2\ntfudc13AQ4G2r7pW71pn5Sbrnnv22d+39\/edDBr0D7iy3S14308x5cVa6SgN+qddpz2tlHI9bcSH\nXcwRO8GA2WCuKxhwQuZMc8Hh6eairXb64iBTLd6nBJfuYsFh1yQMZs4ah612hljL1WaWaKtx+5wg\n8RwrFJOd7JhkhO8sdBWfElyhrzX\/iKuZqAtoipsVEzuBADTTwSIdDcZj1ChOrwkFc2y4We7WSHA0\nQfQ4faw21pLQ30v8bLglAXb8jw2w2M9OlMa3VMR+rc+ytd9pjOjAVAusMSUAdTUwS1lF3GtCvo+d\nPMnZDHFfG2KDhS4W6wxhE7Y0wE6U7Wkt+dgASwQ8aYqrBWJsDeLp930ORpzd9qYIGaONhdrq8FEd\nhR5wc6z5aTMtsMfeBFE2oyl78q4EPuk3AfscxzAfG+DJuROlP0w3wxZbfWadzjv17nXiyoNMtLFA\nSx3+mmo9AI95WIpiCXM0B9ZxdbBER13IhsF3vIjukob8YwOUeNqJE6eZshFbPlqTXS92ghFWm2hh\nrroqZgwd0bMmTdbdk40hGjsaAVpq8FVTEVP2cuaMV9AX0EkfG2DOLCtB4lRTbCOkLNHTYCO0ebyh\nQmisBQFhb8aQ\/wF4kCQoVW6EtR5L7awRIwTZs6yENOTrzXURoKkq\/9gAcz0sOEQYiCSkrDDQxCwV\nFcFWOyOsMuLAc5QKpgwe3gMw2cWUH2OrT9SjjqkEucvg4aJDU8coKKOLiaJcyfe+FulskXE6mqp4\nHU0yXnt9Ra8q0PGkitf5pJb3urma2x\/IBEdjSYT1aASTvPMYoSwPJwQt0tOAx8iRhMHhPXmf5GLE\noblHmIL7CGUEkZDG2BlglSGHTmSsBg1R+hBcLedScRYjLUjD7sgVqKsoVbTXlrHedb4wQ5iXuhdB\nAmdkHorB6+ZbfVaHvfaGvDBLXSbUTBvOhDFnpeFwJbk3XWkYHL8c2gOwdK6NINvTlhXDWioSsgvK\n3MxhyrD\/fHCfHngyfY\/gfuUlrF3sgcVeDshP3Y0Xd8+J0V6vpKgpZ5J2hmGZtxPmu\/OgqJQy7zPc\n7SDe46XJLlzs4hlDSMK7QFsNswmDDl8MRS9XP798Jg6QnCC+hFDi5hQgTVT7Lwb3GaLvY0PE3\/pP\nJ+AcEcCfiPBv\/fG89qyUhjtonjOW+RBwHjx4z7BD+aksMA+u9Fk2S+Y5iEsDndnqFWalh5Ukan5E\nxe8BtOCkuZl3V5Eus5z21bB+1XvzTIb0HbhJ8HaxRWTQPDyrLpFQpqJDAhgKbq7bBMxxtoWsLIsQ\ne7pPBqkYqR9un2iEjZZ6rGC8VVVI5Ib0FmbKDK58t70xdpGdEKPGHOLkTv8a2m89flZdKspNikGE\n0A9RwQLUlx9Hc0UOm2utt0+Lc3\/YgtQ94agoTcXTqhLpQK3WYVLBDkwZw1awZfqa+Ga4MmUwvteD\nyc5mwp0EHBUIlbq\/hioJ7xDpQFZRX5oobZHl4XFFLs4kRnaXw\/aKbKWa9M2K6px4SA9FIXiqfb9K\nznI35x8ifkiLBLU0bzVVNnIOnw3u3SwkOukoEZoZSvPS0RpwIWpy+HKo6I96uZQZ5vL15joKzyG9\nlU6bjAQHEwRqaQzYaOTOthQdJOxR16AC9VAe+SF7Pbux4KbxbbF5vAECddSp9KV\/ZLgpM8zEtIfb\n+rUWNttxEDWOgwgbTUTacBQ0r2gTMND8Ez62vFyvSQi3Gs2WuGlKwyROfdha95XGt5FE2RgQkagp\nPqD5PYZSXE2ku3h6EBpzUOg7FmUCWxT52iCDb4E0NzOyUX2S9KpMmKWWaKB2fp8jV7raWBvuysoD\nrsleqwy1eNRivFRU+g3vcS9zwV5HPebgNH3Qekp987inFQFpA4mnNY7NskLWN5Zs0tPuaL62ClYZ\nayjCLbT7zMUNFnq8eRy1AdfsvuhOExy5EHDUJf2pLm6SFlJcjZHnZY1NxJaSXcx6gLlbgjgCadFM\nEE8aEHLOICZsRMqoGuZpjepurXqtaWsgpLk\/Z+TIP9cYp7qNF6\/j6mKOsjL3\/bBS5n5wNsSZgPEo\n8BnLAhO7muFE0DSc2+aFMzGzURrBR4rnWNDkp90QBUiBUn9boK0q72qGuwg5ONVSscKA8+ePGHTS\nHgczZrk+h+kC2QUuwUkPhT42LHuUsVQPK9QcXY63d2LxumYL2ipEeHEzCk\/KNyJz4URQ66Igo0k+\nbrTSJWVMGT7qIyVd6xyZaSsPt9L\/gIw\/BknOCrF2hgriiwwpPaIdk7XlO3jakBBg+V5j2VCKvWzQ\ndHodUL+jezy\/GYmXtzaz49m1MJRucSdpMJptq8gpEbQx4A8fToSlKY6fTDsmfSZAU03wf\/VsdIfE\nQKXUdtaQl9M6SQVxxNUcx1ZNwUtZNH6v294LYNuNiG6AdLRc2YCrYn\/snGFO2qp376Bg35U1juIv\nM9fXtWWCFhM3UZ89bR1wMkFxpDt+qt2GN7Wx+DcB8cu9bd0AW6+Hd4N7dCEUD06tQm3hUlQem4\/t\n5Ei7hLyDKtZ9xEhM\/2qo6G+Dixqnyo8Yp0p8jftOraEuBNg2AioOP9+NZcHRz46qaDCySLST0Xx5\nPZovrkOjNAT3S1biepYf5LnzcT3DD5unmGKuxijwlUml+mLw3+\/UI2xURbRCJJGOIzNwMstcR3UM\ny9zLymh03o5hBdJRvaWbRQr0XulKFmD1iUUE3DzIcgS4QYBeSfFCiKUuPFVUMPnzIX\/trIP200q\/\nPS0QdjxIlXTUpyt+UhzFm8YsdD78kYxs\/NxUSEYu3jZm4k19MhvG50S1rwjgjhoKOppl8MnVDagv\nW43ak0vRdGEtqvMXoTzTB+UZPqjKDyaM+qNSsgS1xUGok4bh4eXNzLPKBCnaikWdDUn9VxI8LxK8\nacjA4xs7UH8uAg3nRVBciITiYhQaL0XTF+HRlS14dHUrGTFQnA2CgrBEAb6QReHhuRCWtbozQjb3\nGs4G42l5GCqyAyDLDURN4be4f2YD+66Wip14Xn0Irx6k4m1TDgg4\/OfJCbRVHRT3C\/CXRyeYV3eP\nUlDdDxXFOfO2uRnhfGIgrueFoqokBlWlIjy+GoVLGQJUnVjGWktDWRCe3wgjgDbiPgF3K28hzh\/x\nxoV0AQEVgvKs+biWuxZlyXORGm2PGOcxmPTZYHEPOSX8Xx8V4Jl8D+6VBH+obDwt5L95cATN5XHs\nA2gv5Pz6JF\/09lGOtLPxR7yuz8Cr+0fA3DmMF7cT8bRiK+pOC1lATRfXEsZWknCuQR0Bd6dwGSqP\nL8DNYwK0XP2OfF+KGz8SFnMWojJvKaoLVpLwBuPeqVD5g7LvxIoLUexxoFORy7TejCebXvFhu\/VT\nfYa4vfogyASG5iKlvflaHAlpDBovbmJDfrs4FDdyV7Ihqj+7DlezFqD50jrICJDX1dF4W0uelQbj\n9sklbFgvp3kjfy8fcski1BSvQU3Jetw\/twmtlQl4UXMIL+8eZkP8a0seZU7w6p5Y0irbhZs5Cz8s\neyT2isZLmyh68W+PC0QkPxQkfLzr2f48Wbovh4bg4eV9DM0T+tK6c5G4lhXAAqQMNZYJiRgCISdq\nrSGf1zJ9cTFlNqTJZIi9WVHIjy8i974oiXJRtMh2cNBWxKPj96dFkrbKBOZ5TaKA5jwVEV2z54xL\nlNNcHos7JSGggF7WJjHkwfgeZZeIWyv3yRsvbIq\/UxQkuJYWIDq9f7aiJm8J7hYvJ2z547cHcazF\n3C9ZztoJBXfqoBs5CsxE0ho7HF1vjwuxflLiDKLXdek0beTtsn2crvR6UXWApEkoj4SeoWq\/lu7T\nU\/7aZLt4JLS4mRsY\/+pesuAhCSFl793kAnHrrf19dtbZpOUvipnCO\/u9G6+zNobXWRXFk5ENXkn1\nZH\/LjrPnZc4fy6Od+vtz3z7MFrZc394dymeyvYrqglXiqvzlfBZghndPlXndkMZtqdjFVGR7KrXe\nShDSMHexRyyHqS1cwfkU\/7IS25JW5MxnmXoq28MnFiRHfbZSw\/lIqeJ8hLBHwSQP2m7tZ139l6Zc\ncW1REK\/LFx9d3swf9IkuSsCL24e6rYYKkyWsPkP68HJ0D4MUNc0\/et9wNpx7PdOn+18Ayuqn\/K+6\nKzoULGHtHZsV8dKakyvY+\/8CIbz\/1ZVWMSwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-06\/1276718495-2087.swf",
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
	"no_trade",
	"npc-animal"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"n"	: "engage",
	"t"	: "flatter",
	"g"	: "give_cubimal",
	"h"	: "hug",
	"u"	: "insult",
	"c"	: "pinch"
};
itemDef.keys_in_pack = {};

log.info("npc_crab.js LOADED");

// generated ok 2012-12-02 22:41:13 by ali
