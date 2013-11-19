//#include include/mining.js, include/npc_conversation.js, include/cultivation.js

var label = "Dullite Rock";
var version = "1346795313";
var name_single = "Dullite Rock";
var name_plural = "Dullite Rock";
var article = "a";
var description = "A study in shades of grey, gray, and a monochromatic 8-bit scale of debatable spelling, this common rock is mostly found underground, is minable, and may contain precious gems.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = "rock_dullite_1";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rock_dullite_2", "rock_dullite", "mineable_rock"];
var has_instance_props = true;

var classProps = {
	"rock_type"	: "dullite",	// defined by mineable_rock (overridden by rock_dullite_2)
	"pc_action_distance"	: "75",	// defined by mineable_rock
	"conversation_offset_y"	: "0",	// defined by rock_dullite
	"conversation_offset_x"	: "-10"	// defined by rock_dullite
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.chunks_remaining = "50";	// defined by mineable_rock
	this.instanceProps.cultivation_max_wear = "40";	// defined by mineable_rock
	this.instanceProps.cultivation_wear = "";	// defined by mineable_rock
}

var instancePropsDef = {
	chunks_remaining : ["How many chunks remain in this rock"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	chunks_remaining : [""],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by mineable_rock
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

verbs.talk_to = { // defined by mineable_rock
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

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

verbs.regenerate = { // defined by mineable_rock
	"name"				: "regenerate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Regenerate this rock",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_rocky_regeneration_solution' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		function has_potion(it){ return it.class_tsid == 'potion_rocky_regeneration_solution' ? true : false; }
		var potion = pc.findFirst(has_potion);
		if (potion) {
			if (this.getInstanceProp('chunks_remaining') >= 50) return {state:'disabled', reason:'This rock is not worn down enough to need regeneration.'}
			
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_rocky_regeneration_solution' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.mine = { // defined by mineable_rock
	"name"				: "mine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Or, drag pick to rock. Costs $energy_cost energy and takes $seconds seconds",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Mine this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if (this.getClassProp('rock_type') == 'metal_rock'){
			return stack.class_tsid == 'fancy_pick' && stack.isWorking() ? true : false;
		}
		else{
			return stack.is_pick && stack.isWorking() ? true : false;
		}
	},
	"proximity_override"			: 150,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'mining_1';
		if (!pc.skills_has(required_skill)){
			return {state:'disabled', reason:"You need to know "+pc.skills_get_name(required_skill)+" to use this."};
		}

		if (this.getClassProp('rock_type') == 'metal_rock'){
			function is_pick(it){ return it.is_pick && it.isWorking() && it.class_tsid == 'fancy_pick' ? true : false; }
			if (!pc.items_has(is_pick, 1)){
				return {state: 'disabled', reason: "You'll need a Fancy Pick first."};
			}
		}
		else{
			function is_pick(it){ return it.is_pick && it.isWorking() ? true : false; }
			if (!pc.items_has(is_pick, 1)){
				return {state: 'disabled', reason: "You'll need a pick first."};
			}
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		// this assumes we'll use the best pick we have...
		function is_pick(it){ return it.class_tsid =='fancy_pick' && it.isWorking() ? true : false; }
		var pick = pc.findFirst(is_pick);
		if (!pick){
			function is_pick(it){ return it.class_tsid =='pick' && it.isWorking() ? true : false; }
			pick = pc.findFirst(is_pick);
		}

		if (pick.class_tsid == 'fancy_pick'){
			return pc.trySkillPackage('mining_fancypick');
		}else{
			return pc.trySkillPackage('mining');
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = 'mining_1';
		if (!pc.skills_has(required_skill)){
			return false;
		}

		if (this.getClassProp('rock_type') == 'metal_rock' && msg.force_pick){
			pc.sendActivity("This humdrum, everyday pick is far too brittle to mine a metal rock!");
			return true;
		}

		if (msg.target_item_class || msg.target_itemstack_tsid){
			return this.startMining(pc, msg);
		}
		else{
			function is_pick(it){ return it.class_tsid =='fancy_pick' && it.isWorking() ? true : false; }
			var pick = pc.findFirst(is_pick);
			if (!pick || msg.force_pick){
				function is_pick(it){ return it.class_tsid =='pick' && it.isWorking() ? true : false; }
				pick = pc.findFirst(is_pick);
				if (!pick){
					return false;
				}
			}

			return this.startMining(pc, pick.class_tsid);
		}
	}
};

function make_config(){ // defined by mineable_rock
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by mineable_rock
	this.initInstanceProps();
	this.state = 1;

	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);
}

function onLoad(){ // defined by mineable_rock
	if (!this.hitBox){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(400, 400);
	}

	if (this.label != this.name_single) this.label = this.name_single;
}

function onPlayerCollision(pc){ // defined by mineable_rock
	if (!this.isUseable()) return;

	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onPlayerExit(pc){ // defined by mineable_rock
	if(!this.helpers) {
		return;
	}

	if(this.helpers[pc.tsid]) {
		this.removeMiner(pc);
	}

	if(pc['!mining']) {
		delete pc['!mining'];
	}
}

function onPrototypeChanged(){ // defined by mineable_rock
	this.onLoad();
}

function conversation_canoffer_the_first_rock_2(pc){ // defined by conversation auto-builder for "the_first_rock_2"
	var chain = {
		id: "the_first_rock",
		level: 2,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "the_first_rock_1")){
		return true;
	}
	return false;
}

function conversation_run_the_first_rock_2(pc, msg, replay){ // defined by conversation auto-builder for "the_first_rock_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_first_rock_2";
	var conversation_title = "The First Rock";
	var chain = {
		id: "the_first_rock",
		level: 2,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['the_first_rock_2-0-2'] = {txt: "You were told…", value: 'the_first_rock_2-0-2'};
		this.conversation_start(pc, "I was told, once, by a wandering Zillot - which is unusual to begin with, they were mainly quite sedentary. Not sedimentary. That’s me! Ha! That’s very good.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_2', msg.choice);
	}

	if (msg.choice == "the_first_rock_2-0-2"){
		choices['1']['the_first_rock_2-1-2'] = {txt: "*Sigh*", value: 'the_first_rock_2-1-2'};
		this.conversation_reply(pc, msg, "Oh! Ah. I was told by a Zillot - may they rest - that I, Dullite, was the first rock. The original rock. That Zille created us first. We were the models of miniature mountains. The greatest. The first. So if you need any information, I will tell you it for nothing, just because I am chosen. You don’t need to gravel. Get it? Gravel?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_2', msg.choice);
	}

	if (msg.choice == "the_first_rock_2-1-2"){
		choices['2']['the_first_rock_2-2-2'] = {txt: "I’m leaving now.", value: 'the_first_rock_2-2-2'};
		this.conversation_reply(pc, msg, "Ha. Gravel. Instead of grovel. I crack myself up. Oh no wait! YOU crack ME up. With your…", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_2', msg.choice);
	}

	if (msg.choice == "the_first_rock_2-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_dramatic_history_of_dullite_1(pc){ // defined by conversation auto-builder for "the_dramatic_history_of_dullite_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.stats.level >= 5) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
		return true;
	}
	return false;
}

function conversation_run_the_dramatic_history_of_dullite_1(pc, msg, replay){ // defined by conversation auto-builder for "the_dramatic_history_of_dullite_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_dramatic_history_of_dullite_1";
	var conversation_title = "The Dramatic History of Dullite";
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
		choices['0']['the_dramatic_history_of_dullite_1-0-2'] = {txt: "Huh?", value: 'the_dramatic_history_of_dullite_1-0-2'};
		this.conversation_start(pc, "Hey, psst. Who’s winning?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-0-2"){
		choices['1']['the_dramatic_history_of_dullite_1-1-2'] = {txt: "I don’t really…", value: 'the_dramatic_history_of_dullite_1-1-2'};
		this.conversation_reply(pc, msg, "The era. Who’s winning the era?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-1-2"){
		choices['2']['the_dramatic_history_of_dullite_1-2-2'] = {txt: "Again, huh?", value: 'the_dramatic_history_of_dullite_1-2-2'};
		this.conversation_reply(pc, msg, "Huh. I bet with my brother over there?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-2-2"){
		choices['3']['the_dramatic_history_of_dullite_1-3-2'] = {txt: "No? ", value: 'the_dramatic_history_of_dullite_1-3-2'};
		this.conversation_reply(pc, msg, "About which giant will win the era? Ringing any bells? Oy, they don’t tell you anything, do they?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-3-2"){
		choices['4']['the_dramatic_history_of_dullite_1-4-2'] = {txt: "Oh?", value: 'the_dramatic_history_of_dullite_1-4-2'};
		this.conversation_reply(pc, msg, "*Sigh*. Ok, so the core of the matter… Heh. Core? Like in geology? Heh. Anyway. Each Giant had their chance, each existed only one at a time, and had dominion for a whole age - some long, some short, whatever, everything’s short when you’re a rock. But however long, each giant failed to balance the world on their own. Some spectacularly. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-4-2"){
		choices['5']['the_dramatic_history_of_dullite_1-5-2'] = {txt: "So who’s winning?", value: 'the_dramatic_history_of_dullite_1-5-2'};
		this.conversation_reply(pc, msg, "Mm. So now here we are. Twelfth era. Where one giant must prove their right to dominate the world and control the imaginations of the rest. FOR EVER MORE. Or something like that. That’s what I heard, anyway.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-5-2"){
		choices['6']['the_dramatic_history_of_dullite_1-6-2'] = {txt: "Ah yes. Sorry. No idea.", value: 'the_dramatic_history_of_dullite_1-6-2'};
		this.conversation_reply(pc, msg, "That’s what I was asking you.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_1', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_dramatic_history_of_dullite_2(pc){ // defined by conversation auto-builder for "the_dramatic_history_of_dullite_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "the_dramatic_history_of_dullite_1")){
		return true;
	}
	return false;
}

function conversation_run_the_dramatic_history_of_dullite_2(pc, msg, replay){ // defined by conversation auto-builder for "the_dramatic_history_of_dullite_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_dramatic_history_of_dullite_2";
	var conversation_title = "The Dramatic History of Dullite";
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
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['the_dramatic_history_of_dullite_2-0-2'] = {txt: "Mention what?", value: 'the_dramatic_history_of_dullite_2-0-2'};
		this.conversation_start(pc, "Some time in the third era… or maybe it was the ninth. Could have been the fifth, actually, now you mention it.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-0-2"){
		choices['1']['the_dramatic_history_of_dullite_2-1-2'] = {txt: "I didn’t. ", value: 'the_dramatic_history_of_dullite_2-1-2'};
		this.conversation_reply(pc, msg, "The fifth.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-1-2"){
		choices['2']['the_dramatic_history_of_dullite_2-2-2'] = {txt: "It was you.", value: 'the_dramatic_history_of_dullite_2-2-2'};
		this.conversation_reply(pc, msg, "Well, whoever did,  I think they were right.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-2-2"){
		choices['3']['the_dramatic_history_of_dullite_2-3-2'] = {txt: "Wait: WHAT was?", value: 'the_dramatic_history_of_dullite_2-3-2'};
		this.conversation_reply(pc, msg, "I was right. It was then.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-3-2"){
		choices['4']['the_dramatic_history_of_dullite_2-4-2'] = {txt: "You lost me.", value: 'the_dramatic_history_of_dullite_2-4-2'};
		this.conversation_reply(pc, msg, "The Great Citratic War. Yes. Definitely the fifth, if the fifth was the age of Pot. That was a terrible time. The rush of tiny feet, the clanging of the pickaxes and all because of lemons.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-4-2"){
		choices['5']['the_dramatic_history_of_dullite_2-5-2'] = {txt: "Lucky you!", value: 'the_dramatic_history_of_dullite_2-5-2'};
		this.conversation_reply(pc, msg, "Mystery to me too. Some kind of great commotion at the Feast of Pot in Groddle, everyone wanted lemons in order to pacify their giant. And someone spread the rumour that the most effective thing to juice a lemon with was a handy chunk of Dullite.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-5-2"){
		choices['6']['the_dramatic_history_of_dullite_2-6-2'] = {txt: "Did they?", value: 'the_dramatic_history_of_dullite_2-6-2'};
		this.conversation_reply(pc, msg, "Lucky me. The war went on centuries. Hundreds of years of being shoved facefirst into lemons. And did they even axe first?", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-6-2"){
		choices['7']['the_dramatic_history_of_dullite_2-7-2'] = {txt: "*Sigh*.", value: 'the_dramatic_history_of_dullite_2-7-2'};
		this.conversation_reply(pc, msg, "Of course they did, how else do you think they chopped us up! Ha! Get it?! Axe! Like ‘ask’ but I said ‘axe’ instead! Ha! ha ha!", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_dramatic_history_of_dullite_2', msg.choice);
	}

	if (msg.choice == "the_dramatic_history_of_dullite_2-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_first_rock_2",
	"the_dramatic_history_of_dullite_1",
	"the_dramatic_history_of_dullite_2",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Mining this yields <a href=\"\/items\/422\/\" glitch=\"item|dullite\">Chunks of Dullite<\/a>."]);
	out.push([2, "Mining this requires a <a href=\"\/items\/424\/\" glitch=\"item|pick\">Pick<\/a> or a <a href=\"\/items\/425\/\" glitch=\"item|fancy_pick\">Fancy Pick<\/a>."]);
	return out;
}

var tags = [
	"mineable",
	"no_trade",
	"mining"
];

var responses = {
	"gem_drop_amber": [
		"Here - small, garish, and has a dead bug in, yet still oddly pleasing.",
		"What do you mean ONLY amber?! It's still a gem, chum",
	],
	"gem_drop_diamond": [
		"Woah! Best friend this bulky are many carats. Also: many currants.",
		"OH! The glory of super-compressed coal!",
	],
	"gem_drop_moonstone": [
		"Oh my! It is like you've pulled a moon from the sky. So... glowy!",
		"Take! Display it, love it... Or sell it… whatever, I'm easy",
	],
	"gem_drop_ruby": [
		"Ah! A rich, blood-hued, passionate stone. If on the small side.",
		"Better than pearl? Maybe. Worth its weight in currants? Yes.",
	],
	"gem_drop_sapphire": [
		"Want this? A little blingy for my taste, but if you like showing off...",
		"Feel blue? Well, I'm not feeling it at all, so you take it",
	],
	"metal_rock_disappeared": [
		"The spirit of metal be with you, man. ROCK ON.",
		"Goodnight Cleveland!",
		"Fade to Black, man. Fade to black.",
		"Long live METAL!",
		"MELTDOWN!",
	],
	"mine_beryl": [
		"Hey! To the left a little next time.",
		"Ughh, you're so frikkin' picky.",
		"I wasn't cut out for this.",
		"Not in the face! Oh. Wait. No face.",
		"If you need any tips on technique, just axe.",
		"Pick on someone else, will you?",
		"You're on rocky ground, Glitch.",
		"I feel like you're taking me for granite.",
		"Well, at least that's a weight off me mined.",
		"You sure have one big axe to grind.",
	],
	"mine_dullite": [
		"Ooof. I feel lighter already.",
		"Mmm, thanks, I've been itching there all day.",
		"Ow. Ow-hangover. Ow-my-head. Ow.",
		"Not bad. Work on your backswing.",
		"You're really picking this up.",
		"Nothing wrong with a sedimentary lifestyle, chum.",
		"I should have been a wrestler. I'm rock-hard! Hee!",
		"Ah. You've taken a lode of my mind.",
		"You sure have an apatite for this.",
		"Woah. I'm tuff. But you're tuffer.",
	],
	"mine_max_beryl": [
		"I'm way too gneiss to you.",
		"*sigh* You're just going to pick up and leave me anyway.",
		"Stone me, you're persistent.",
		"Well, you just keep on rocking, doncha?",
		"Fine, get your rocks off. Then leave me in peace.",
	],
	"mine_max_dullite": [
		"Igneous is bliss. Ta-da!",
		"May I just say: you're rocking this.",
		"Well THAT's taken a weight off my mind.",
		"Stand back: admire my chiseled good looks.",
		"Hey! Pick like that, I'll be nothin' but gravel soon!",
	],
	"mine_max_metal_rock": [
		"Gotta whole lotta METAL!",
		"That pick goes all the way up to eleven, man.",
		"Nice work! Countdown to pick-axtinction! YEAH!",
		"You’re Zincing BIG! WOO!",
		"How much more metal could this be? None. None more metal.",
	],
	"mine_max_sparkly": [
		"Super chunks of sparkly joy! WHEEE!",
		"Are you trying to pick me up?",
		"Pretty sparkles! Oh yes: I'm no common ore.",
		"When I see you, sparkles fly!",
		"Sure, I'm no gem, but there's more of me to love!",
	],
	"mine_metal_rock": [
		"Slave to the GRIND, kid! ROCK ON!",
		"I’d feel worse if I wasn’t under such heavy sedation.",
		"Sweet! Air pickaxe solo! C'MON!",
		"Yeah. Appetite for destruction, man. I feel ya.",
		"LET THERE BE ROCK!",
		"Those who seek true metal, we salute you!",
		"YEAH, man! You SHOOK me!",
		"All hail the mighty metal power of the axe!",
		"Metal, man! METAL!",
		"Wield that axe like a metal-lover, man!",
	],
	"mine_sparkly": [
		"Here! What's mined is yours!",
		"Pick me! Pick me!",
		"I sparkle! You sparkle! Sparkles!",
		"Oooh, you're cute. You into carbon-dating?",
		"Oh yeah! Who's your magma?!?",
		"Yay! You picked me!",
		"Hey, cutestuff! You make me sliver.",
		"You crack me up, Glitchy!",
		"Yay! Everything should sparkle! Except maybe vampires.",
		"Together, we'll make the world sparkly, Glitchy",
	],
	"rock_disappeared": [
		"Oof, where'd I go?",
		"brb",
		"kbye",
		"A la peanut butter sammiches",
		"Alakazam!",
		"*poof*",
		"I'm all mined out!",
		"Gone to the rock quarry in the sky",
		"Yes. You hit rock bottom",
		"All rocked out for now",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-78,"y":-132,"w":156,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGUUlEQVR42u2Ye0xTdxTH1U236Dbc\nQ3Rxm9mybG7ZsmXLHv8YnNn+2P6Ye+hMliVmf2xZskU3xwQfWEDkJQwUBRXlZQGpIEhLW1poaSml\nL9pCXyBPwYLohCWy7c+zc07vrSw6ZbGgWbzJN71cyr2f+z3ne36\/MG\/evePeMfMDAKIuX5nMGQ4G\n1991cH8BrJr6409XcPQiDI8Eoedcn35iYiLqroDzD4yuCl68DOOXfoPzwxfAH+gBry9w90D6e4dc\ngb4hGBkdh4vjl2Ho\/AiDjlwYheELQdfI2FjMHQMN9A4VG8w2IEDS2KUr7CTBkdBFLnlZRUXMHYFz\neQOgM7RBl78HOlxd4An0ApW7t28AqB8HBs+Dx9cN+zKyJXMK5+vplxCMKIKz2hzg9vjZSQueV8rO\ngNPVCXVyJezLzKmdMziL3b7e7nByECgQpM4uL3Q43eDt7oNOdMyGv7d1uPmzoqoa0rJy9XMC53A4\noixW+6DL3QWODhe7JopgHM5OBh4YHGZQcjOvoBAyc\/Im048enf2gWGz24ulArk4vl9jtCYCvuxd6\n+wc5HOQofcdoMsPe9CxI3Z8D2XkF4T6cFVhyTwQT3aFPdBQatc2g1jRDKwKRi3Tdjg6fOatgQCqz\nze4Ej9fPMrXbJmfBPcdWAqTEqpuNDGi1d0C7xQb18gYWAdILiGPn8NETcLJSBud6+6F\/AK91n+OE\nl5ZXQeQBrQ49J9XXAw3qJgYQ06tUNTKgBp2kn8m90goZFBQWMRgNbvqkmejBcGFPwmw4OEkP73B7\nqUSs1jYLuyZXKMMuthhawYTXjxWVgrvTE1pREIw+R8fGsdw1lOrIAlqtztcITtfSykCiYySCMxhN\nDCOOGxuW3ufv5kFNUFcmfmdpdQbuycgD2jskmiYdVMhqQ+lsNUOb2crnXR4fl5D6jMCmjx5RNDO9\nCExwpP25hyIPSGm12kIANXUN7CbB9eFooXMRmETjx+n2cKIpNHStsLgM9iSnQvzuREjPPgC\/HsyP\niSggJZYSTHJ1+RiOoAzGNijHvmo1tTMIBYe+Q8seifpUj32Ze6gAdiQkgmRvGqRkZEPWgfzNEQUk\nNyi5JoSi3jO1tUNV9VmGskwrJ0FNLy+Fhvr00JHj4RKTsg7mR259ttmcMVQq8eHNuhYWzTXqPfok\nR2\/UgxQgeqFjJ0q4tNR\/tLJkHTgcufVZpzPGUHr1BhNom1vYPX2LkfvvRqEQRUNc0aBiwOTUdIiN\n34VlTsISZ0UWsL5eGUMPUeFyVt+gDpUSxwptDG4GSC6L40gE3CXZG3kHtVptVHgps4dSKe5meGsl\nJFXcIFRV17J7dWflDEegR3BVSUxJ5\/7bg0FJTsssjuioYQfVGn4YPVwcJ7h55R0NnXPPtbaBpknP\nq0lRqTS8RmfmHESo\/dyDVOaf4natj7iD4lJGIARFuxYaLzV1iuvKSzsZCgb9TdXpGixtMpf457id\nIW3fEZExMx+1UKlUf0MPamrWX1sdcPdMs7ER3aqVq64DPHK8BE6Wn+INRCGCUt+RcyLgtl\/i624H\nbCFqMepR1NM4jM30oEZNUxhA3MlYhD785+wzca9V19Txz3JMclJqBuxOSmG47TsTYGvs9iDe+0XU\nStSymYItQD2IehgVjXppzZq1GxQKFc8z6sEGpRpkshqG+Lf0niiRMiD1qzhuCIwAqcyxcTuvfr5x\nUzze\/23U66gnUQ8IFbvpsQj1EOoJ1POoNzZv\/npLSYn0quz0GZBKT7FKyypAibDSU9Vgbr+2BiuU\nmrB7JHop8XdU3rjdEvj2u+\/N0dHRn+C916LeQa0WXFwiVO6WpV0ilHY5lRf1KuqDLVu2ZSckJFbm\nFxwbT8N+olGi1RkhtIkQAFVaKCorDwMeLy6FopKTkJ2bBz\/Gxk199sWmQrzXh6j3US+jnhIqtVRo\nqYUzCcUiAXKp8McrhV55BfUm3XzTl1\/lJu1L90grq7xyhcqnatROqRqbOLk0RiQpGVMvrF79A353\nA+pT1Meoj1DrhHvQ\/Z75r3A3A6WSrxDe+Fmhb95CrUHRtuk9Qeumnb8r9BiV8DnUKuFlqTKPo6IE\nsEUz6b1bjhohPAT8iAD9mJC+aOGhK6ZpuXB9mfC9pULwFgv3uX+u\/tEwX0j+fTfQgtt15t7xvz\/+\nBg31ukhxv7C3AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/rock_dullite_2-1345763316.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
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
	"mineable",
	"no_trade",
	"mining"
];
itemDef.keys_in_location = {
	"n"	: "mine",
	"e"	: "regenerate",
	"o"	: "remove",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("rock_dullite_2.js LOADED");

// generated ok 2012-09-04 14:48:33 by mygrant
