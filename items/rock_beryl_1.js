//#include include/mining.js, include/npc_conversation.js, include/cultivation.js

var label = "Beryl Rock";
var version = "1346795313";
var name_single = "Beryl Rock";
var name_plural = "Beryl Rock";
var article = "a";
var description = "A mineral dull in colour if not composite, Beryl can generally be found underground, where its eerie green surface calls to miners, refiners and gem collectors alike.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["rock_beryl_1", "rock_beryl", "mineable_rock"];
var has_instance_props = true;

var classProps = {
	"rock_type"	: "beryl",	// defined by mineable_rock (overridden by rock_beryl_1)
	"pc_action_distance"	: "75",	// defined by mineable_rock
	"conversation_offset_y"	: "0",	// defined by rock_beryl
	"conversation_offset_x"	: "-16"	// defined by rock_beryl
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

function conversation_canoffer_the_first_rock_1(pc){ // defined by conversation auto-builder for "the_first_rock_1"
	var chain = {
		id: "the_first_rock",
		level: 1,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.conversations_has_completed(null, "common_complaints_of_beryl_2")) && (pc.conversations_has_completed(null, "the_dramatic_history_of_dullite_2")) && (pc.conversations_has_completed(null, "tales_of_the_sparkly_2"))){
		return true;
	}
	return false;
}

function conversation_run_the_first_rock_1(pc, msg, replay){ // defined by conversation auto-builder for "the_first_rock_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_first_rock_1";
	var conversation_title = "The First Rock";
	var chain = {
		id: "the_first_rock",
		level: 1,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['the_first_rock_1-0-2'] = {txt: "Wow.", value: 'the_first_rock_1-0-2'};
		this.conversation_start(pc, "The Zillots, may they rest, believed that Beryl was the first rock.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_1', msg.choice);
	}

	if (msg.choice == "the_first_rock_1-0-2"){
		choices['1']['the_first_rock_1-1-2'] = {txt: "What happened to Petronella and Patufet?", value: 'the_first_rock_1-1-2'};
		this.conversation_reply(pc, msg, "Yes, I am special. They believed we were the dried tears of their giant, who wept so hard when she heard the story of Petronella and Patufet that the mountains became an avalanche of rolling green tears, tumbling over each other, and forming great holes and caverns in the ground below.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_1', msg.choice);
	}

	if (msg.choice == "the_first_rock_1-1-2"){
		choices['2']['the_first_rock_1-2-2'] = {txt: "Wow.", value: 'the_first_rock_1-2-2'};
		this.conversation_reply(pc, msg, "A terrible thing. Something to do with trolls. Or gas. Or dragons. Can’t remember. Doesn't matter. Point is, this glorious green facade you clack away at with that pointypointy stick of yours? Tears of the giant, my impermanent one. Tears of the giant.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_1', msg.choice);
	}

	if (msg.choice == "the_first_rock_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_first_rock_4(pc){ // defined by conversation auto-builder for "the_first_rock_4"
	var chain = {
		id: "the_first_rock",
		level: 4,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "the_first_rock_3")){
		return true;
	}
	return false;
}

function conversation_run_the_first_rock_4(pc, msg, replay){ // defined by conversation auto-builder for "the_first_rock_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_first_rock_4";
	var conversation_title = "The First Rock";
	var chain = {
		id: "the_first_rock",
		level: 4,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['the_first_rock_4-0-2'] = {txt: "It’s not wrong. Some Dullite may have mentioned something like that, as well.", value: 'the_first_rock_4-0-2'};
		this.conversation_start(pc, "Did I hear right? I heard that one of those Sparklers told you that they were First Rock. Is that right?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_4', msg.choice);
	}

	if (msg.choice == "the_first_rock_4-0-2"){
		choices['1']['the_first_rock_4-1-2'] = {txt: "And what would that be?", value: 'the_first_rock_4-1-2'};
		this.conversation_reply(pc, msg, "Shocking. Here am I, tears of a giant made permanent, and this is how they honour me. Well I’ll tell you one thing for nothing…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_4', msg.choice);
	}

	if (msg.choice == "the_first_rock_4-1-2"){
		choices['2']['the_first_rock_4-2-2'] = {txt: "I was not expecting that.", value: 'the_first_rock_4-2-2'};
		this.conversation_reply(pc, msg, "Grilled batterfly tastes like rubber tyres soaked in pickled whortleberry juice.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_4', msg.choice);
	}

	if (msg.choice == "the_first_rock_4-2-2"){
		choices['3']['the_first_rock_4-3-2'] = {txt: "Can I go now?", value: 'the_first_rock_4-3-2'};
		this.conversation_reply(pc, msg, "Not my problem. I’m the oldest and most venerable rock, and I do as I please. Take THAT, lesser rocks.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_4', msg.choice);
	}

	if (msg.choice == "the_first_rock_4-3-2"){
		choices['4']['the_first_rock_4-4-2'] = {txt: "That’s me told.", value: 'the_first_rock_4-4-2'};
		this.conversation_reply(pc, msg, "Trust me, in the timescale I work on, you haven’t even arrived yet.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_first_rock_4', msg.choice);
	}

	if (msg.choice == "the_first_rock_4-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_creator_of_the_universe_2(pc){ // defined by conversation auto-builder for "creator_of_the_universe_2"
	var chain = {
		id: "creator_of_the_universe",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "creator_of_the_universe_1")){
		return true;
	}
	return false;
}

function conversation_run_creator_of_the_universe_2(pc, msg, replay){ // defined by conversation auto-builder for "creator_of_the_universe_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "creator_of_the_universe_2";
	var conversation_title = "The Creator of the Universe";
	var chain = {
		id: "creator_of_the_universe",
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
	if (!msg.choice){
		choices['0']['creator_of_the_universe_2-0-2'] = {txt: "When?", value: 'creator_of_the_universe_2-0-2'};
		this.conversation_start(pc, "Everything was better then.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_2', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_2-0-2"){
		choices['1']['creator_of_the_universe_2-1-2'] = {txt: "And that was…", value: 'creator_of_the_universe_2-1-2'};
		this.conversation_reply(pc, msg, "In the beginning. When the one true giant mind-carved the world out of nothing.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_2', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_2-1-2"){
		choices['2']['creator_of_the_universe_2-2-2'] = {txt: "Bit harsh. I just heard it was Pot.", value: 'creator_of_the_universe_2-2-2'};
		this.conversation_reply(pc, msg, "Zille! What are you, some kind of idiot?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_2', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_2-2-2"){
		choices['3']['creator_of_the_universe_2-3-2'] = {txt: "So… none of the other giants exist?", value: 'creator_of_the_universe_2-3-2'};
		this.conversation_reply(pc, msg, "POT? POT?!? Mighty Zille could sneeze out gravel more powerful than the very idea of Pot, if so she chose.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_2', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_2-3-2"){
		choices['4']['creator_of_the_universe_2-4-2'] = {txt: "I see.", value: 'creator_of_the_universe_2-4-2'};
		this.conversation_reply(pc, msg, "Maybe they do. But only when Zille imagines they do.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_2', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_common_complaints_of_beryl_1(pc){ // defined by conversation auto-builder for "common_complaints_of_beryl_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.stats.level >= 5) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
		return true;
	}
	return false;
}

function conversation_run_common_complaints_of_beryl_1(pc, msg, replay){ // defined by conversation auto-builder for "common_complaints_of_beryl_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "common_complaints_of_beryl_1";
	var conversation_title = "Common Complaints of Beryl";
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
		choices['0']['common_complaints_of_beryl_1-0-2'] = {txt: "What?", value: 'common_complaints_of_beryl_1-0-2'};
		this.conversation_start(pc, "Spriggan thought it was funny, you know.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-0-2"){
		choices['1']['common_complaints_of_beryl_1-1-2'] = {txt: "Whose?", value: 'common_complaints_of_beryl_1-1-2'};
		this.conversation_reply(pc, msg, "To get back at almighty Zille, creator of all, Spriggan offered to help out tending the rocks one day. You know, to get on her good side.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-1-2"){
		choices['2']['common_complaints_of_beryl_1-2-2'] = {txt: "Too late.", value: 'common_complaints_of_beryl_1-2-2'};
		this.conversation_reply(pc, msg, "ZILLE, may she look kindly upon my greenly obedience. Zille? The one true giant? Giant before all giants, sculptor of creation, she who cannot be shaken? Zille, all obsequious obeisance to her name. Anyway, to make a long story short…", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-2-2"){
		choices['3']['common_complaints_of_beryl_1-3-2'] = {txt: "Rocks have roots?", value: 'common_complaints_of_beryl_1-3-2'};
		this.conversation_reply(pc, msg, "…Spriggan, so proud of the way his piffling tree things worked, decided everything, everything should have roots. And PING! Everyone gets roots. And suddenly PAF. Beryl gets to grow back.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-3-2"){
		choices['4']['common_complaints_of_beryl_1-4-2'] = {txt: "There’s more?", value: 'common_complaints_of_beryl_1-4-2'};
		this.conversation_reply(pc, msg, "I know. Ridiculous. That Spriggan. Don’t tell anyone I said this, but – *shhhh* – he’s not as funny as he thinks he is. And what is more…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-4-2"){
		choices['5']['common_complaints_of_beryl_1-5-2'] = {txt: "Poor Beryl.", value: 'common_complaints_of_beryl_1-5-2'};
		this.conversation_reply(pc, msg, "Regeneration is a right pain in the elements.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-5-2"){
		choices['6']['common_complaints_of_beryl_1-6-2'] = {txt: "Noooooo.", value: 'common_complaints_of_beryl_1-6-2'};
		this.conversation_reply(pc, msg, "You mocking me, Glitch?", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_1', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_common_complaints_of_beryl_2(pc){ // defined by conversation auto-builder for "common_complaints_of_beryl_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "common_complaints_of_beryl_1")){
		return true;
	}
	return false;
}

function conversation_run_common_complaints_of_beryl_2(pc, msg, replay){ // defined by conversation auto-builder for "common_complaints_of_beryl_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "common_complaints_of_beryl_2";
	var conversation_title = "Common Complaints of Beryl";
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
		choices['0']['common_complaints_of_beryl_2-0-2'] = {txt: "What was bad? What? Wait, Zille invented Chickens?!?", value: 'common_complaints_of_beryl_2-0-2'};
		this.conversation_start(pc, "If you think this is bad, you should have seen the place when Zille first invented chickens.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-0-2"){
		choices['1']['common_complaints_of_beryl_2-1-2'] = {txt: "Don’t like chickens?", value: 'common_complaints_of_beryl_2-1-2'};
		this.conversation_reply(pc, msg, "Zille invented EVERYTHING, may her almighty Zilleness show mercy to my very muttering of her name. She had a mind to create something, she said, more huggable than a rock, so she created these little beaked terrors. Bane of our lives, they were.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-1-2"){
		choices['2']['common_complaints_of_beryl_2-2-2'] = {txt: "Hm…", value: 'common_complaints_of_beryl_2-2-2'};
		this.conversation_reply(pc, msg, "Didn’t like the fact that Zille couldn’t see the point in wings. Or legs. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-2-2"){
		choices['3']['common_complaints_of_beryl_2-3-2'] = {txt: "But they HAVE wings. And legs.", value: 'common_complaints_of_beryl_2-3-2'};
		this.conversation_reply(pc, msg, "So they just sat there, squawking and complaining, and pecking at the heels of anyone who was unfortunate enough to pass close by.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-3-2"){
		choices['4']['common_complaints_of_beryl_2-4-2'] = {txt: "That’s…", value: 'common_complaints_of_beryl_2-4-2'};
		this.conversation_reply(pc, msg, "Only because Zille, may she smile kindly upon her gravel-brained servant, invented Humbaba and Cosma to do her bidding and get the little blighters moving.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-4-2"){
		choices['5']['common_complaints_of_beryl_2-5-2'] = {txt: "… I was going to say odd. But ok.", value: 'common_complaints_of_beryl_2-5-2'};
		this.conversation_reply(pc, msg, "Amazing, yes, all praise to her omnipotent and glorious Zilleness.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'common_complaints_of_beryl_2', msg.choice);
	}

	if (msg.choice == "common_complaints_of_beryl_2-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_first_rock_1",
	"the_first_rock_4",
	"creator_of_the_universe_2",
	"common_complaints_of_beryl_1",
	"common_complaints_of_beryl_2",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Mining this yields <a href=\"\/items\/421\/\" glitch=\"item|beryl\">Chunks of Beryl<\/a>."]);
	out.push([2, "Mining this requires a <a href=\"\/items\/424\/\" glitch=\"item|pick\">Pick<\/a> or a <a href=\"\/items\/425\/\" glitch=\"item|fancy_pick\">Fancy Pick<\/a>."]);
	return out;
}

var tags = [
	"mineable",
	"no_trade",
	"natural-resources",
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
		'position': {"x":-78,"y":-123,"w":156,"h":123},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGuklEQVR42u2YCXRMVxjHKdXSonaN\no0d77Kq0eqyndidaJEgQBAlCS3W0hEi1QzgaYomE7DuaZCKbyWSbiYkkkiJktySySIIkyGQioWr5\n97vXmzGWqtaEc9rcc35n3uS9N\/f3\/t\/9bjJp0qRxNI7\/wMiCWpT5oEaZ+0CtLEa9bw7U4jLcFueh\n1vi1ihUCbTNR45sNNUgG+biJXDrOEt6zV2VtqWpBmEPn1yWXoZHLFsR08Sk8gZ9Sw2GTJPF95YLZ\nVL4M1HAREkUaqpGKG0gh2KukPBs2ySFarGQevV9peulQcZm\/QlZT9JigdWLQ2SbiWS1eiSAlJGIS\nyQ+uI+nBNRy7fw2J96s4SoGEW+VYlxTMWZ8k4ZKrFQdCG1wuGapBifevqbjEvUoo7lZAfvcq4om4\nP65oUdI5m5QQrDkWSATBmkGyS6Ru0xpUUH63olguyMTcuYzoO+WQEVG\/l0H6BJtOR0GkPISvFf5Y\nEOuJ+TEeMJXtFzeYXOy9y8ZMigkxgcjbpYi4fQnht0oQxinWoQQb049gRUIAjCKd8FWE40Mi9zac\nIEmFM6lwQeZwfTFC6osgqStEMOPmxUfQ+w0nI2Al98HiOG9MP+LMBadJnRtuywmvL1GFMqm6Iq1I\n5M1iRNWVILruEie0thAH1Rc4K1OCsEzuh+UKP17m+THumCtzUzaYIEsqiKR+rS3gAgHq8wioOQeX\nqkxsK0vjeNzIgY\/qLHyJOQpvzI12g1W8LyXpy2Wt4n3qO64zaq1\/ORS2ZWIHSMy\/5jwJnIN3dR68\nqnPheSMXDldPYW3RUWwuOw53kmSicxN8MDVyL2ZHucAizgtL4n24qGnIblu9CwbVFhg\/FDtLUnlc\nwO16NlwJl+tZ2H8tC3ZlqRAVxOPHIiXHNN6Drz0zmSsWkaAlwdajZazXZb2nJ68vz4ivo86tLUKg\n6oIglQlnKm9wTT48K7OwvjiRpyjKj4N1gRyWiQEwp3VnTtuLmcwNxkecMI062pikZ0W7jNGboKKu\nfJFEXQD\/alpblN4+EnOqysDeqjNwrDwDRX05\/KtysPJ8DBdkOFxNx8r0UMyjNTgv2v1hg9AxNQlP\n1STKZZHeBEPUhWJWyp00qbMgtvVSCnZVpPM0maB9aSoWZh7WCtqWJEF0NgazSWqGdB+XM5Xu53si\nS5Q2bv11s+uNHDErJ5t4U+lxns76C3KIS5KxveIUdlVnYZcqG0vzIrWCGoxl+\/n+N4fWoUnUw+MZ\nUmcubB7rPUgvgtQAYsfK04+lY3\/lJBaflMC+Mh37bl\/grMiP5mVelR\/Lm4Vdyzdn6uTpUudHv02I\nKYTRESf9bNpbLqeJN15K4hOyyU1PHuCvU+SusC1Nxp7aXIgr0rAgQ8LFluRE8GuYrK7UM1DpRXBt\nsVKsSe+bczLMPBHABQxj92EVSdhQ9\/5cmsKx1rlm3plgTA7f85TYxMMOGCfZzo\/1smmvLUzYoxFk\n6bDJGZPinLEkI4z\/fB3textKjpGgEt9fVPAHMD1xAMMObsKowK1aOSY8\/OBmjDhkx4\/HS7YPfWnB\nNYUJxRpBlorxcV9MVrhgYowT5qYdfKoxdB\/EUObEJcdK7DEpdCeXZe8Zo4O2wTB8t+il5ES5MhPN\n\/sbWHZuUyY2OcOCYnwh8pqBFdhi\/1iw9EOPDHLRSTzLU3XYHTcO+CjT\/J15vEGxt9BTlRaex1Gaf\nOsTLxiadEO3I5cZE7qTGCNF2rC5GRz140uz65XnSp8SG+G3EIC8b9P1lOfsa8DHRkWj6InJvE+2J\nfp+YTTFik7EUNOtuepofF2OCY6W7tCmZUwez1DRJj4vawx+EnWcbuG6KvZ2+g8FWSxjYWahbm4z8\ngeb6gGgrzN3seXJNhbjfF55q2GcrzCxMUv1uMrEvj7ryxtCUl6FJ6Uk0y2BakhdP3kTpjU99bNHd\nfimX67x21m8tBvZg\/3noSXQh2hHvCPM\/d7xJtCLe04i2H9DTsN8WK\/9eO1Yc77Pz2+w+zqsrB1B5\nBlGZxkp381R15YxSvDE8eCs\/399zPQb62mIENUdX8cLaTqtnprQc2X8Vfe4oogfRjegkJNjqRddi\nc+HitsLaMCB6EZ8T7K+QyS26tZ\/dycLQsbvd4px+HtZcgtHfcx0+3LsK3e0scw3WzJF2WTbVu92U\n4bZtxg5eSfeNI4YTg4WydiU6COv9b8v7rNFMuPFdIdGOwod+JEzyhTDpeGICMVEHltAQoj\/RVxDq\nJpSzo\/B5rKRv\/Rux5wm3ENJl0m2EiToIKRsI5Wov0E4431qQaSncrzehxtE4\/vfjT2wxWgPD4lga\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/rock_beryl_1-1345761414.swf",
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
	"natural-resources",
	"mining"
];
itemDef.keys_in_location = {
	"n"	: "mine",
	"e"	: "regenerate",
	"o"	: "remove",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("rock_beryl_1.js LOADED");

// generated ok 2012-09-04 14:48:33 by mygrant
