//#include include/cultivation.js, include/npc_conversation.js

var label = "Peat Bog";
var version = "1346795288";
var name_single = "Peat Bog";
var name_plural = "Peat Bogs";
var article = "a";
var description = "Filled with a substance thicker than soil and wetter than loam, each bog gradually replenishes itself, but can only be harvested by each peat-parasite once a day (or twice, with a certain upgrade card).";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = "peat_1";
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["peat_3", "peat_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by peat_base
	"conversation_offset_x"	: "-8"	// defined by peat_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.harvests_remaining = "4";	// defined by peat_base
	this.instanceProps.cultivation_max_wear = "100";	// defined by peat_base
	this.instanceProps.cultivation_wear = "";	// defined by peat_base
}

var instancePropsDef = {
	harvests_remaining : ["How many more times can this be harvested?"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	harvests_remaining : [""],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by peat_base
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

verbs.talk_to = { // defined by peat_base
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

verbs.harvest = { // defined by peat_base
	"name"				: "harvest",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Or, drag shovel to peat. Costs $energy_cost energy and takes $seconds seconds",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Harvest this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'shovel' && stack.isWorking() ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.isUseable()){
			return {state: 'disabled', reason: "No more peat here!"};
		}

		var package_class = 'peat_harvest';
			
		var details = pc.getSkillPackageDetails(package_class);
		if (!details) return {state:null};
			
		var limit = details.interval_limit;
		var fail_message = "You can't harvest this peat more than once per game day."
		if (pc.imagination_has_upgrade("bog_specialization_dig_peat_bog_twice")) { 
			
			if (limit > 1) { 
				log.error("The bog harvesting skill package conflicts with the bog-specialization-dig-peat-bog-twice - please tell Mart");
			}

			limit = 2;
			fail_message = "You can't harvest this peat more than twice per game day."
		}

		var fail = pc.checkSkillPackageOverLimit(package_class, limit, this);
		if (fail) return {state: 'disabled', reason: fail_message};

		function is_shovel(it){ return (it.class_tsid == 'shovel' || it.class_tsid == 'ace_of_spades') && it.isWorking() ? true : false; }
		if (!pc.items_has(is_shovel, 1)){
			return {state: 'disabled', reason: "You'll need a working shovel first."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('peat_harvest');
	},
	"handler"			: function(pc, msg, suppress_activity){

		// If we were called via a shovel, confirm that this peat can, in fact, be harvested.
		var package_class = 'peat_harvest';
			
		var details = pc.getSkillPackageDetails(package_class);
		if (!details) return {state:null};

		// We don't make the verb available unless the limit check passes, so we don't need to check here!	
		/*
		var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
		if (fail) {
			return false;
		}*/

		if (msg.target_item_class || msg.target_itemstack_tsid){
			return this.startHarvesting(pc, msg);
		}
		else{
			return this.startHarvesting(pc, {});
		}
	}
};

function buildState(){ // defined by peat_base
	return 'scene:'+(intval(this.instanceProps.harvests_remaining)+1);
}

function isUseable(){ // defined by peat_base
	return this.getInstanceProp('harvests_remaining') == 0 ? false : true;
}

function make_config(){ // defined by peat_base
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by peat_base
	this.initInstanceProps();
	this.state = 1;

	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);
}

function onGrow(){ // defined by peat_base
	if (this.getInstanceProp('harvests_remaining') < 4 && !this.isDepleted()){
		this.setInstanceProp('harvests_remaining', intval(this.getInstanceProp('harvests_remaining')+1));
		this.broadcastState();

		var growmins = randInt(2, 6);
		this.apiSetTimer('onGrow', 1000 * 60 * growmins);
	}
}

function onHarvestComplete(pc, ret){ // defined by peat_base
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var slugs = ret.slugs? ret.slugs : {};

	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
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
			"value"	: ret.values['xp_bonus']
		});
	}

	var to_get = ret.details['bonus_amount'];

	if (pc.imagination_has_upgrade('bogspecialization_more_peat')){
		to_get += Math.round(to_get*0.25);
	}

	var remaining = pc.createItemFromSource('peat', to_get, this);
	if (remaining != to_get){
		var proto = apiFindItemPrototype('peat');
		var got = to_get - remaining;

		self_effects.push({
			"type"	: "item_give",
			"which"	: proto.name_plural,
			"value"	: got
		});
		
		if (!slugs.items) slugs.items = [];
		slugs.items.push({
			class_tsid	: 'peat',
			label		: proto.label,
			count		: got,
			//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
		});
	}

	if (!ret.details['got_drop']){
		this.sendResponse('harvest_peat_ns_bs', pc, slugs);
	}
	else{
		this.sendResponse('harvest_peat_drop', pc, slugs);
	}

	pc.achievements_increment('completed_harvest', 'peat_bog', got);

	var pre_msg = this.buildVerbMessage(this.count, 'harvest', 'harvested', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	this.addWear();
	this.container.cultivation_add_img_rewards(pc, 6.0);
	this.setInstanceProp('harvests_remaining', intval(this.getInstanceProp('harvests_remaining')) - 1);
	if (this.getInstanceProp('harvests_remaining') < 0) this.setInstanceProp('harvests_remaining', 0);
	this.broadcastState();

	if (this.getInstanceProp('harvests_remaining') < 3) this.apiCancelTimer('onGrow');

	delete pc['!harvesting'];
	if (!this.isDepleted()){
		var growmins = randInt(2, 6);
		this.apiSetTimer('onGrow', 1000 * 60 * growmins);
	}
	else if (this.getInstanceProp('harvests_remaining') == 0){
		this.replaceWithDepleted();
	}
}

function onLoad(){ // defined by peat_base
	if (!this.hitBox){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(400, 400);
	}
}

function onPlayerCollision(pc){ // defined by peat_base
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function startHarvesting(pc, msg){ // defined by peat_base
	// Find a shovel
	if (msg.target_itemstack_tsid){
		var shovel = pc.getAllContents()[msg.target_itemstack_tsid];
	}
	else{
		if (msg.target_item_class){
			var tool_class = msg.target_item_class;
		}
		else{
			var tool_class = 'shovel';
		}
		

		function is_shovel(it){ return (it.class_tsid == tool_class || it.class_tsid == "ace_of_spades") && it.isWorking() ? true : false; }
		var shovel = pc.findFirst(is_shovel);
	}

	if (!shovel){
		pc.sendActivity("You'll need a working shovel first.");
		return false;
	}

	// Is this working?

	if (!this.isUseable()){
		pc.sendActivity("This is not the peat you are looking for.");
		return false;
	}

	pc['!harvesting'] = this.tsid;

	var success = pc.runSkillPackage('peat_harvest', this, {tool_item: shovel, word_progress: config.word_progress_map['harvest'], callback: 'onHarvestComplete', msg: msg});

	if (!success['ok']){
		if (success['error_tool_broken']) pc.sendActivity("Your Shovel is too worn out. Try repairing it or replacing it.");

		delete pc['!harvesting'];
		return false;
	}

	return true;
}

// global block from peat_base
var is_peat_bog = true;

function conversation_canoffer_the_chronicles_of_peat(pc){ // defined by conversation auto-builder for "the_chronicles_of_peat"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if ((pc.stats.level >= 5) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
		return true;
	}
	return false;
}

function conversation_run_the_chronicles_of_peat(pc, msg, replay){ // defined by conversation auto-builder for "the_chronicles_of_peat"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_chronicles_of_peat";
	var conversation_title = "The Chronicles of Peat";
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
		choices['0']['the_chronicles_of_peat-0-2'] = {txt: "Um… I didn’t say anything?", value: 'the_chronicles_of_peat-0-2'};
		this.conversation_start(pc, "Ehh? Whatwhat? What’s that you say?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-0-2"){
		choices['1']['the_chronicles_of_peat-1-2'] = {txt: "I hear you.", value: 'the_chronicles_of_peat-1-2'};
		this.conversation_reply(pc, msg, "Quite right too. All the talking that goes on. No thought for those who might just want a bit of peace.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-1-2"){
		choices['2']['the_chronicles_of_peat-2-2'] = {txt: "And?", value: 'the_chronicles_of_peat-2-2'};
		this.conversation_reply(pc, msg, "You know who was the worst? The Zillots. Always bangin’ on about the mighty giant that thought them up as some perfect little people.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-2-2"){
		choices['3']['the_chronicles_of_peat-3-2'] = {txt: "Poobahs?", value: 'the_chronicles_of_peat-3-2'};
		this.conversation_reply(pc, msg, "Hogwash. Even if there WERE giants, and I ain’t sayin’ that there are, and I ain’t sayin’ that there aren’t, the only things they had a mind for were mountains, oceans, and grand poobahs.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-3-2"){
		choices['4']['the_chronicles_of_peat-4-2'] = {txt: "Did you?", value: 'the_chronicles_of_peat-4-2'};
		this.conversation_reply(pc, msg, "Poobahs! Here’s learnin’ for ya: If anyone thought them little’uns into bein’, it was the trees, or the animals, or, peat-a-mercy, I might've even done it!", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-4-2"){
		choices['5']['the_chronicles_of_peat-5-2'] = {txt: "And that's possible?", value: 'the_chronicles_of_peat-5-2'};
		this.conversation_reply(pc, msg, "No. But I might. More likely, though, they went ahead and just imagined themselves.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-5-2"){
		choices['6']['the_chronicles_of_peat-6-2'] = {txt: "Gittinoffit.", value: 'the_chronicles_of_peat-6-2'};
		this.conversation_reply(pc, msg, "Anything's possible. 'Cept carrying on this conversation. I'm bored. Gitoffa my lawn, kid. ", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_chronicles_of_peat', msg.choice);
	}

	if (msg.choice == "the_chronicles_of_peat-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_genesis_of_a_rock_2(pc){ // defined by conversation auto-builder for "genesis_of_a_rock_2"
	var chain = {
		id: "genesis_of_a_rock",
		level: 2,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "genesis_of_a_rock_1")){
		return true;
	}
	return false;
}

function conversation_run_genesis_of_a_rock_2(pc, msg, replay){ // defined by conversation auto-builder for "genesis_of_a_rock_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "genesis_of_a_rock_2";
	var conversation_title = "The Genesis of a Rock";
	var chain = {
		id: "genesis_of_a_rock",
		level: 2,
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
		choices['0']['genesis_of_a_rock_2-0-2'] = {txt: "I guess? If you have any?", value: 'genesis_of_a_rock_2-0-2'};
		this.conversation_start(pc, "What-what? Hehm? You’re lookin’ for some learnin, I reckon?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_2', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_2-0-2"){
		choices['1']['genesis_of_a_rock_2-1-2'] = {txt: "Like?", value: 'genesis_of_a_rock_2-1-2'};
		this.conversation_reply(pc, msg, "If I have any indeed… Me… Peat… Down here for longer than anyone can remember? Tut. Here’s the matter: there are a great number of things round ‘ere that suppose themselves more important than they are, y’hear?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_2', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_2-1-2"){
		choices['2']['genesis_of_a_rock_2-2-2'] = {txt: "Tii? What?…", value: 'genesis_of_a_rock_2-2-2'};
		this.conversation_reply(pc, msg, "There are lumps of rock that’ll tell you how they – they personally – are a piece of grit from under the very fingernails of their beloved Zille. But no. No sirree. Them rocks are made by Tii.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_2', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_2-2-2"){
		choices['3']['genesis_of_a_rock_2-3-2'] = {txt: "That’s… sad?", value: 'genesis_of_a_rock_2-3-2'};
		this.conversation_reply(pc, msg, "Fer alchemy and whatnot. Them rocks don’t like it, but they were only ever brought into being to be broken up again into a zillion tiny pieces.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_2', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_2-3-2"){
		choices['4']['genesis_of_a_rock_2-4-2'] = {txt: "Consider me gottenoffa.", value: 'genesis_of_a_rock_2-4-2'};
		this.conversation_reply(pc, msg, "Life’s sad, Glitch’un, and life’s long: Especially when you’re a frakking bog. Now gettoffa my lawn.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_2', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_genesis_of_a_rock_4(pc){ // defined by conversation auto-builder for "genesis_of_a_rock_4"
	var chain = {
		id: "genesis_of_a_rock",
		level: 4,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "genesis_of_a_rock_3")){
		return true;
	}
	return false;
}

function conversation_run_genesis_of_a_rock_4(pc, msg, replay){ // defined by conversation auto-builder for "genesis_of_a_rock_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "genesis_of_a_rock_4";
	var conversation_title = "The Genesis of a Rock";
	var chain = {
		id: "genesis_of_a_rock",
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
		choices['0']['genesis_of_a_rock_4-0-2'] = {txt: "Not so much when you put it like that…", value: 'genesis_of_a_rock_4-0-2'};
		this.conversation_start(pc, "Back again, are ya? Liked the taste of learnin’ on your little brain-tongue, did ya?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_4', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_4-0-2"){
		choices['1']['genesis_of_a_rock_4-1-2'] = {txt: "I’m ready.", value: 'genesis_of_a_rock_4-1-2'};
		this.conversation_reply(pc, msg, "Well, that’s the only way you’ll git. I’m peat. I’m the oldest one here, and I bow to no one. And I’ll tell you this for nuthin’…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_4', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_4-1-2"){
		choices['2']['genesis_of_a_rock_4-2-2'] = {txt: "Huh?", value: 'genesis_of_a_rock_4-2-2'};
		this.conversation_reply(pc, msg, "Well, them young rocks can carry on believin’ what they want about the fancy mythical roots of their beginnins’, but the fact is, no one thought them into being but themselves.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_4', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_4-2-2"){
		choices['3']['genesis_of_a_rock_4-3-2'] = {txt: "Is it?", value: 'genesis_of_a_rock_4-3-2'};
		this.conversation_reply(pc, msg, "What I say is what I mean. They thought themselves up. We all did. Their “Giants” had no part in the matter. And that’s the truth.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_4', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_4-3-2"){
		choices['4']['genesis_of_a_rock_4-4-2'] = {txt: "Gottenoft already, old grumpface.", value: 'genesis_of_a_rock_4-4-2'};
		this.conversation_reply(pc, msg, "I just said it was, didn’t I? Seriously, kid: getoffa my lawn.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'genesis_of_a_rock_4', msg.choice);
	}

	if (msg.choice == "genesis_of_a_rock_4-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_chronicles_of_peat",
	"genesis_of_a_rock_2",
	"genesis_of_a_rock_4",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("bogspecialization_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/85\/\" glitch=\"skill|bogspecialization_1\">Bog Specialization<\/a>."]);
	out.push([2, "Digging this yields <a href=\"\/items\/629\/\" glitch=\"item|peat\">Blocks of Peat<\/a>."]);
	out.push([2, "This can be dug with <a href=\"\/items\/627\/\" glitch=\"item|shovel\">Shovel<\/a>or <a href=\"\/items\/1202\/\" glitch=\"item|ace_of_spades\">Ace of Spades<\/a>."]);
	return out;
}

var tags = [
	"peat",
	"no_trade"
];

var responses = {
	"harvest_peat_drop": [
		"Eh? What's this? Meh, take it, kid.",
		"Don't want this newfangled thingamajiggy. You have it.",
		"This wadjimacallit some kinda joke? Take it and get outta here!",
	],
	"harvest_peat_ns_bs": [
		"Peat here. Nice doin' business with ya, kid.",
		"You know your shovellin' kid, I'll give ya that.",
		"What's that you say, kid? Dig?",
		"There ya go, kid. Now git offa my lawn.",
		"Peat THAT, kid!",
		"In my day, a person used to ask before stickin' their spade in…",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-89,"y":-60,"w":177,"h":58},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADX0lEQVR42u1VS08TURhlJVEew6Nl\n2mHa6UzbmemDPpiOtZUyDhZoqxYoNqSQaGoENGgajUZNTFgQX4kmhhhWGKMh8R9oIotZsiFhycKF\nP8CFP+F6vyuFgqDRhXFxT3JyH\/Pd757v3N7bpiYKCgoKCgoKCgqKI6BJnQy01anY2HQpIJA5P5sE\n\/hcCq5W4Uc5KzN2bA9ZUMVJLyI4CUFcdRqqPN4ykUD03ErzTr3BVKObajezo\/PxItL5+cvJUMp\/3\nNS+9LCufPlSNxtwzM6aSzWrMpYuxsaG0KPyRMBBwNiO\/OZ9VUSYhEibUXsKhAR\/SQzzCoggHdA+K\nyxyK+50ogec1HKMFejdOa94NTXV+TKjcIjCX8VuDulQbH4\/VspnQqJlSDRC\/+MAslM6FzHJZYw4V\nE2HZFjiyhOx8BG2hEBf0AL+dirqJoBjeOCyxKCT2IFWw\/zVhPTDideAiOKQHeZI\/Exe+4dZKx6Q3\ncAog+kjnJib6xk6GXbAA9WNXIFl9A8VtQ16uE0nOjt8S4vx81w67jxQNhUd9WDA+iZNBFxGcigrW\n9duDUzeXG4SOpKXFhMJt1d06mEjoaUe8rXWXroa+2962O\/aw++MaY+st5AKKDoYUILt+FABCdxwF\nd7\/hcQhOt+nBrYwxPhLYPcKAZ88xCTvh7mnbFdK4sbPrBOK6W5DH0Y5c9lbE4bHzEHJdLaQ9KLou\nWHIySMQE18HJvCGjM7qIdHwJiXv3Hw8nUzF3LepzboHIU1EXiqnsXjIsTOIY0gdB3W3HUFfrHkN+\nG\/K7O\/bNAW3tzT\/NNX7jcVFsx3EksG0o3e8iQsHBF0\/yKDcoLy4slH7c7CtXBsizkPCyYU1xmKVc\n8N1w2vtZD\/daYdFu5c\/4vuQN\/xb0A4LNUg+wdj29HfM5rEbi4\/kaFOxfSYxo25D4zi3ssuXlOpDs\n7kbQDqU9KCqzKBXnUWW8j1wUMyWvPnuUew+XNaKwYr+PvbB3m\/FExMv2PF8tCEuvTQXm5uY0plLJ\nEKvhR7u0UlSWl\/PN9fFPLwJeT4hzzc6mjKtXk2yxEmaLxTBbj7n31Iw+XDGVt6uTl9fWSsL6+hyz\nuTnHPHtdVu49zTK\/fP9erS388sFcWskpR32DB7o0HRfo\/y8FBQUFBQXFP8V3Zy2HzyslKIoAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291693072-2879.swf",
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
	"peat",
	"no_trade"
];
itemDef.keys_in_location = {
	"h"	: "harvest",
	"e"	: "remove",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("peat_3.js LOADED");

// generated ok 2012-09-04 14:48:08 by mygrant
