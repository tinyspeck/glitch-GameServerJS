//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Bubble Tree";
var version = "1354586285";
var name_single = "Bubble Tree";
var name_plural = "Bubble Trees";
var article = "a";
var description = "The delicate Bubble Tree. Bursting with plain bubbles waiting to be tuned, these somewhat unstable specimens harbor fruit of perfect transparency - and thoughts of bizarre conspiracy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_bubble", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_bubble
	"conversation_offset_x"	: "0",	// defined by trant_bubble
	"pc_action_distance"	: "50"	// defined by trant_bubble
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.health = "7";	// defined by trant_base
	this.instanceProps.maturity = "7";	// defined by trant_base
	this.instanceProps.fruitCount = "0";	// defined by trant_base
	this.instanceProps.fruitCapacity = "0";	// defined by trant_base
	this.instanceProps.dontDie = "0";	// defined by trant_base
	this.instanceProps.cultivation_max_wear = "2000";	// defined by trant_base
	this.instanceProps.cultivation_wear = "";	// defined by trant_base
}

var instancePropsDef = {
	health : ["Trant health"],
	maturity : ["Trant maturity"],
	fruitCount : ["Number of fruit"],
	fruitCapacity : ["Max number of fruit"],
	dontDie : ["Should this trant never lose health\/maturity?"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	health : [""],
	maturity : [""],
	fruitCount : [""],
	fruitCapacity : [""],
	dontDie : [""],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.unrook = { // defined by trant_base
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

verbs.rook_attack = { // defined by trant_base
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

verbs.remove = { // defined by trant_base
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

verbs.trantsform = { // defined by trant_base
	"name"				: "trantsform",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Trantsform this tree with some Trantsformation Fluid",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_trantsformation_fluid' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.container || (!this.container.pols_is_pol() && this.class_tsid == 'trant_egg')) return {state: null};
		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)) return {state:null};
		if (this.is_poisoned) return {state:null};

		function has_potion(it){ return it.class_tsid == 'potion_trantsformation_fluid' ? true : false; }
		var potion = pc.findFirst(has_potion);
		if (potion) {
			if (potion.canPour){
				var ret = potion.canPour(pc);
				if (!ret.ok) return {state:'disabled', reason:ret.error};
			}
			else{
				if (this.getInstanceProp('maturity') < 4) return {state:'disabled', reason:'This tree is too small to be trantsformed'};
				if (this.getInstanceProp('health') < 4) return {state:'disabled', reason:'This tree is too weak to be trantsformed'};
			}
			
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_trantsformation_fluid' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.apply_balm = { // defined by trant_base
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Revive this tree with some Rook Balm",
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

verbs.apply_antidote = { // defined by trant_base
	"name"				: "apply antidote to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Save this poor poisoned tree with some antidote",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Apply an antidote to this poor poisoned tree",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'tree_poison_antidote' || stack.class_tsid == 'potion_tree_poison_antidote' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.is_poisoned) return {state:null};

		// Find a tree poison antidote
		function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' || it.class_tsid == 'potion_tree_poison_antidote' ? true : false; }
		var antidote = pc.findFirst(is_antidote);

		if (!antidote) return {state:'disabled', reason: "You don't have any antidote!"};

		if (!pc.skills_has('botany_1')){
			return {ok: 0, error: "You need to know "+pc.skills_get_name('botany_1')+" to use this."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Find a tree poison antidote
		function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' || it.class_tsid == 'potion_tree_poison_antidote' ? true : false; }
		var antidote = pc.findFirst(is_antidote);

		if (!antidote){
			return false;
		}

		msg.target = this;

		// The counter gets incremented in the powder or potion. This is a duplicate.
		//pc.achievements_increment('tree_antidote', 'antidoted');
		if (antidote.class_tsid == 'tree_poison_antidote') return antidote.doVerb(pc, msg);
		if (antidote.class_tsid == 'potion_tree_poison_antidote') return antidote.verbs['pour'].handler.call(antidote, pc, msg);
	}
};

verbs.poison = { // defined by trant_base
	"name"				: "apply poison to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Apply poison to this tree, killing it",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Poison this tree, killing it.",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'tree_poison' || stack.class_tsid == 'potion_tree_poison';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.is_poisoned) return {state:null};
		if (this.container && this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)) return {state:null};

		if (pc.buffs_has('a_too_guilty_mind')){
			return {state:'disabled', reason: "The guilt is too much to bear. You cannot poison a tree until your mind is free."};
		}

		// Find a tree poison
		function is_poison(it){ return it.class_tsid == 'tree_poison' || it.class_tsid == 'potion_tree_poison' };
		var poison = pc.findFirst(is_poison);

		if (!poison){
			return {state:null}; 
		} 

		if(!pc.skills_has('botany_1')) {
			return {state: 'disabled', reason: "You need to know Botany to do this."};
		}

		var mood_cost = poison.getMoodCost(pc);
		if (pc.metabolics_get_mood() < mood_cost){
			return {state:'disabled', reason: "You are not in a good enough mood to poison a tree."};
		}

		if (this.getInstanceProp('dontDie') == 1){
			return {state:'disabled', reason: "This tree can't be poisoned."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Find a tree poison
		function is_poison(it){ return it.class_tsid == 'potion_tree_poison' || it.class_tsid == 'tree_poison'};
		var poison = pc.findFirst(is_poison);

		if (!poison){
			return false;
		}

		msg.target = this;

		if (poison.class_tsid == 'potion_tree_poison') {
			var ret = poison.verbs['pour'].handler.call(poison, pc, msg);	
		} else {
			var ret = poison.doVerb(pc, msg);
		}

		return true;
	}
};

verbs.talk_to = { // defined by trant_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.trantVerbAvailable){
			var avail = this.container.trantVerbAvailable(this.class_tsid, 'talk_to');
			if (avail) return avail;
		}

		if(this.isRooked()) {
			return {state:null};
		}

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

verbs.revive = { // defined by trant_base
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
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

		this.startRevive(pc, msg);

		var pre_msg = this.buildVerbMessage(msg.count, 'revive', 'revived', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.harvest = { // defined by trant_base
	"name"				: "harvest",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Collect some",
	"get_tooltip"			: function(pc, verb, effects){

		var details = pc.trySkillPackage('gardening_harvest');

		var fruit = apiFindItemPrototype(this.fruit_class);
		var tooltip = verb.tooltip+' '+fruit.name_plural;

		if (pc.knowsAboutEnergy()){
			tooltip += ". Costs "+details.energy_cost+" energy";
		}

		return tooltip;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.trantVerbAvailable){
			var avail = this.container.trantVerbAvailable(this.class_tsid, 'harvest');
			if (avail) return avail;
		}

		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};

		if (this.instanceProps.fruitCount == 0){
			return {state:'disabled', reason: "There's nothing to pick, cowboy!"};
		}
		else{
			var ret = this.canHarvest(pc);
			if (!ret['ok']){
				return {state:'disabled', reason: "You can only harvest from each tree "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
			}
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var ret = pc.trySkillPackage('gardening_harvest');
		ret.fruits = apiFindItemPrototype(this.fruit_class).name_plural;
		return ret;
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.performHarvest(pc, msg);
	}
};

verbs.pet = { // defined by trant_base
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Give love",
	"get_tooltip"			: function(pc, verb, effects){

		var details = pc.trySkillPackage('light_green_thumb_pet');

		var tooltip = verb.tooltip;

		if (pc.knowsAboutEnergy()){
			tooltip += ". Costs "+details.energy_cost+" energy";
		}

		return tooltip;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.class_tsid == 'newxp_training2') return {state:null};
		if (this.container.trantVerbAvailable){
			var avail = this.container.trantVerbAvailable(this.class_tsid, 'pet');
			if (avail) return avail;
		}
		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};
		if (!this.wantsPet()){ return {state:'disabled', reason: "I don't want to be petted!"}; }
		else{ return {state:'enabled'}; }
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('light_green_thumb_pet');
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.performPetting(pc, msg);
	}
};

verbs.water = { // defined by trant_base
	"name"				: "water",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Give water",
	"get_tooltip"			: function(pc, verb, effects){

		var details = pc.trySkillPackage('light_green_thumb_water');

		var tooltip = verb.tooltip;

		if (pc.knowsAboutEnergy()){
			tooltip += ". Costs "+details.energy_cost+" energy";
		}

		return tooltip;
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Water this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_tsid == 'watering_can' || stack.class_tsid == 'irrigator_9000') ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.class_tsid == 'newxp_training2') return {state:null};
		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};

		if (this.container.trantVerbAvailable){
			var avail = this.container.trantVerbAvailable(this.class_tsid, 'water');
			if (avail) return avail;
		}

		// Find a watering_can
		function is_watering_can(it){ return it.class_tsid == 'watering_can' || it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);

		if (!watering_can){
			return {state:'disabled', reason: "You need a working watering can."}; 
		}

		if (!this.wantsWater()){ return {state:'disabled', reason: "I don't want to be watered!"}; }
		else{ return {state:'enabled'}; }
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('light_green_thumb_water');
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.performWatering(pc, msg);
	}
};

// global block from trant_bubble
var fruit_class = 'plain_bubble';

var fruitProdMap = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,48,56,64,72,80],
	[0,0,0,0,50,60,70,80,90,100],
	[0,0,0,0,60,72,84,96,108,120],
	[0,0,0,56,70,84,98,112,126,140],
	[0,0,0,64,80,96,112,128,144,160],
	[0,0,0,72,90,108,126,144,162,180],
	[0,0,0,80,100,120,140,160,180,576]
];

// production and capacity tables swapped by Stewart on Aug 4
// as a little experiement. We'll see!

var fruitCapMap = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,24,28,32,36,40],
	[0,0,0,0,25,30,35,40,45,50],
	[0,0,0,0,30,36,42,48,54,60],
	[0,0,0,28,35,42,49,56,63,70],
	[0,0,0,32,40,48,56,64,72,80],
	[0,0,0,36,45,54,63,72,81,90],
	[0,0,0,40,50,60,70,80,90,288]
];

function make_config(){ // defined by trant_base
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by trant_base
	this.initInstanceProps();
	this.initTrant();
}

function onLoad(){ // defined by trant_base
	if (!this.hitBox) this.apiSetHitBox(400, 400);
	if (this.container.pols_is_pol() && this.container.getProp('is_home') && !this.canWear()){
		this.initWear();
		this.proto_class = 'proto_patch';
	}
}

function onOverlayDismissed(pc, payload){ // defined by trant_base
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPlayerCollision(pc){ // defined by trant_base
	if(this.isRooked()) {
		this.rookedCollision(pc);
	} else if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onPrototypeChanged(){ // defined by trant_base
	this.onLoad();
}

function onStatus(pc){ // defined by trant_base
	return this.getStatus(pc);
}

function onVerbMenuOpen(pc){ // defined by trant_base
	if(this.isRooked()) {
		this.cancelRookConversation(pc);
	}
}

function conversation_canoffer_one_tree_claims_to_know_the_unknowable_2(pc){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_2"
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 2,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "one_tree_claims_to_know_the_unknowable_1")){
			return true;
	}
	return false;
}

function conversation_run_one_tree_claims_to_know_the_unknowable_2(pc, msg, replay){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "one_tree_claims_to_know_the_unknowable_2";
	var conversation_title = "One Tree Claims To Know the Unknowable";
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
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
		choices['0']['one_tree_claims_to_know_the_unknowable_2-0-2'] = {txt: "Sure.", value: 'one_tree_claims_to_know_the_unknowable_2-0-2'};
		this.conversation_start(pc, "Psst. PSSSSSSSSSSST! Over here. For your ears only, ‘k?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_2', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_2-0-2"){
		choices['1']['one_tree_claims_to_know_the_unknowable_2-1-2'] = {txt: "Something like that.", value: 'one_tree_claims_to_know_the_unknowable_2-1-2'};
		this.conversation_reply(pc, msg, "Did that Spice Tree tell you all that business about how he was a great friend of Spriggan’s? And how Spriggan always considered the Sprigganite ages the greatest?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_2', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_2-1-2"){
		choices['2']['one_tree_claims_to_know_the_unknowable_2-2-2'] = {txt: "He wasn’t a friend of Spriggan’s?", value: 'one_tree_claims_to_know_the_unknowable_2-2-2'};
		this.conversation_reply(pc, msg, "Lies. It’s all lies. Don’t listen to a word.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_2', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_2-2-2"){
		choices['3']['one_tree_claims_to_know_the_unknowable_2-3-2'] = {txt: "Huh? ", value: 'one_tree_claims_to_know_the_unknowable_2-3-2'};
		this.conversation_reply(pc, msg, "No! One little tree? Spriggan could sneeze a thousand-thousand of him down before breakfast. But it’s more than that, it’s that there haven’t even BEEN multiple ages.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_2', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_2-3-2"){
		choices['4']['one_tree_claims_to_know_the_unknowable_2-4-2'] = {txt: "Is it, though? IS IT?", value: 'one_tree_claims_to_know_the_unknowable_2-4-2'};
		this.conversation_reply(pc, msg, "No. That’s what they WANT you to think. Don’t trust them, comrade. Trust no one. Never chew copper. Check both ways before you dig. That’s all I’m saying. That’s all I’m saying.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_2', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_one_tree_claims_to_know_the_unknowable_4(pc){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_4"
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 4,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "one_tree_claims_to_know_the_unknowable_3")){
			return true;
	}
	return false;
}

function conversation_run_one_tree_claims_to_know_the_unknowable_4(pc, msg, replay){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "one_tree_claims_to_know_the_unknowable_4";
	var conversation_title = "One Tree Claims To Know the Unknowable";
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
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
		choices['0']['one_tree_claims_to_know_the_unknowable_4-0-2'] = {txt: "Huh?", value: 'one_tree_claims_to_know_the_unknowable_4-0-2'};
		this.conversation_start(pc, "They all lie.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_4', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_4-0-2"){
		choices['1']['one_tree_claims_to_know_the_unknowable_4-1-2'] = {txt: "…em?", value: 'one_tree_claims_to_know_the_unknowable_4-1-2'};
		this.conversation_reply(pc, msg, "All of them. With the exception of a few trees, two kinds of a rock and a critter, there’s not a truthful one among th…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_4', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_4-1-2"){
		choices['2']['one_tree_claims_to_know_the_unknowable_4-2-2'] = {txt: "What?", value: 'one_tree_claims_to_know_the_unknowable_4-2-2'};
		this.conversation_reply(pc, msg, "SHHHHH. Did you hear that? That clicking noise? The giants. Everywhere. Listening. Well, them, or ghostly versions of their most determined disciples, clinging on to the artifacts they’ve left scattered around, like ghosts in a machine, rattling and buzzing and click, click, click, click…", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_4', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_4-2-2"){
		choices['3']['one_tree_claims_to_know_the_unknowable_4-3-2'] = {txt: "Um. Ok.", value: 'one_tree_claims_to_know_the_unknowable_4-3-2'};
		this.conversation_reply(pc, msg, "Nothing. You’re not ready for my truth. Get away. Get away. And if that Spicy Son of Spriggan apparatchik tries to feed you any more of the party line, you just tell him from me tha… Shhhhh", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_4', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_4-3-2"){
		choices['4']['one_tree_claims_to_know_the_unknowable_4-4-2'] = {txt: "Over and out.", value: 'one_tree_claims_to_know_the_unknowable_4-4-2'};
		this.conversation_reply(pc, msg, "Click click. Click click click. Get away. Get away, they’re following you, I tell you - get away, get away. Click. Click click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_4', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_4-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_shape_of_the_world_3(pc){ // defined by conversation auto-builder for "shape_of_the_world_3"
	var chain = {
		id: "shape_of_the_world",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "shape_of_the_world_2")){
			return true;
	}
	return false;
}

function conversation_run_shape_of_the_world_3(pc, msg, replay){ // defined by conversation auto-builder for "shape_of_the_world_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "shape_of_the_world_3";
	var conversation_title = "The Shape of the World";
	var chain = {
		id: "shape_of_the_world",
		level: 3,
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
		choices['0']['shape_of_the_world_3-0-2'] = {txt: "You haven’t told me anything.", value: 'shape_of_the_world_3-0-2'};
		this.conversation_start(pc, "HEY! Don’t look. Just listen. Don’t let anyone know you’re listening. Just pretend you happen to be standing there, and if anyone asks you, I haven’t told you anything.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_3', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_3-0-2"){
		choices['1']['shape_of_the_world_3-1-2'] = {txt: "No, you ACTUALLY haven’t told me anything.", value: 'shape_of_the_world_3-1-2'};
		this.conversation_reply(pc, msg, "That's it.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_3', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_3-1-2"){
		choices['2']['shape_of_the_world_3-2-2'] = {txt: "How did you know?", value: 'shape_of_the_world_3-2-2'};
		this.conversation_reply(pc, msg, "Ah. Shhh. Yes. Did you hear that? There was a clicking and a… Never mind. Just know this. Whatever anyone tells you about this place - about it being round, or flat, or layered or flipped or upside down or outside in…", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_3', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_3-2-2"){
		choices['3']['shape_of_the_world_3-3-2'] = {txt: "Wait, what?", value: 'shape_of_the_world_3-3-2'};
		this.conversation_reply(pc, msg, "I know how it works. I know a hawk from a handsaw, but shhhh, this is important: it’s all wrong. There’s nothing in this world that’s concrete. It’s all a bubble inside a bubble. A thought inside a thought. It’s not real. Nothing’s real. The only thing that’s real is… shhh!…The rook!", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_3', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_3-3-2"){
		choices['4']['shape_of_the_world_3-4-2'] = {txt: "You're weird.", value: 'shape_of_the_world_3-4-2'};
		this.conversation_reply(pc, msg, "SHHHHH! Wingbeats. I heard wingbeats. Get away from me. Get away. You never spoke to me. I never told you anything. Pop. Pop pop. The giant ate the moon. The moon’s an avocado. You’ve never been here. You’re not here now. POP.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_3', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_3-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_ages_of_the_world_3(pc){ // defined by conversation auto-builder for "ages_of_the_world_3"
	var chain = {
		id: "ages_of_the_world",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "ages_of_the_world_2")){
			return true;
	}
	return false;
}

function conversation_run_ages_of_the_world_3(pc, msg, replay){ // defined by conversation auto-builder for "ages_of_the_world_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "ages_of_the_world_3";
	var conversation_title = "The Ages of the World";
	var chain = {
		id: "ages_of_the_world",
		level: 3,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['ages_of_the_world_3-0-2'] = {txt: "What is?", value: 'ages_of_the_world_3-0-2'};
		this.conversation_start(pc, "It’s all made up.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_3', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_3-0-2"){
		choices['1']['ages_of_the_world_3-1-2'] = {txt: "But WHAT is?", value: 'ages_of_the_world_3-1-2'};
		this.conversation_reply(pc, msg, "All of it. Someone whispered a lie to the chickens, and they passed  it feather to feather, and piggies will believe anything told while... well, you know. But this is the ONE truth: It’s all made up.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_3', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_3-1-2"){
		choices['2']['ages_of_the_world_3-2-2'] = {txt: "Pop pop.", value: 'ages_of_the_world_3-2-2'};
		this.conversation_reply(pc, msg, "All of it. Eleven dreams at once, all crashed into each other, and here you are. If you can say there are any ages, there is only this, and yet none of it’s real. None of it will last. None of it. Pop. Pop pop.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ages_of_the_world_3', msg.choice);
	}

	if (msg.choice == "ages_of_the_world_3-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_bubble_conspiracies_1(pc){ // defined by conversation auto-builder for "the_bubble_conspiracies_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.stats.level >= 2) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
			return true;
	}
	return false;
}

function conversation_run_the_bubble_conspiracies_1(pc, msg, replay){ // defined by conversation auto-builder for "the_bubble_conspiracies_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_bubble_conspiracies_1";
	var conversation_title = "The Bubble Conspiracies";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['the_bubble_conspiracies_1-0-2'] = {txt: "Say what?", value: 'the_bubble_conspiracies_1-0-2'};
		this.conversation_start(pc, "Pop! Pop pop pop!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_1', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_1-0-2"){
		choices['1']['the_bubble_conspiracies_1-1-2'] = {txt: "Um. I… Whu?", value: 'the_bubble_conspiracies_1-1-2'};
		this.conversation_reply(pc, msg, "Shhhhhh. Testing for hidden wires. Can you hear whining? Feedback? Pop! Pop pop! Shhh…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_1', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_1-1-2"){
		choices['2']['the_bubble_conspiracies_1-2-2'] = {txt: "Message received.", value: 'the_bubble_conspiracies_1-2-2'};
		this.conversation_reply(pc, msg, "Come back later. Another time. Be on the safe side. In the meantime: trust no one. NO ONE.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_1', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_bubble_conspiracies_2(pc){ // defined by conversation auto-builder for "the_bubble_conspiracies_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "ages_of_the_world_3")){
			return true;
	}
	return false;
}

function conversation_run_the_bubble_conspiracies_2(pc, msg, replay){ // defined by conversation auto-builder for "the_bubble_conspiracies_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_bubble_conspiracies_2";
	var conversation_title = "The Bubble Conspiracies";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['the_bubble_conspiracies_2-0-2'] = {txt: "What?", value: 'the_bubble_conspiracies_2-0-2'};
		this.conversation_start(pc, "Don’t believe everything they tell you.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_2', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_2-0-2"){
		choices['1']['the_bubble_conspiracies_2-1-2'] = {txt: "Not really, but ok.", value: 'the_bubble_conspiracies_2-1-2'};
		this.conversation_reply(pc, msg, "Just don’t believe everything you hear. That’s all. I’m not calling anyone a liar. I’m just saying, maybe some of your sources might not have all the information, if you know what I’m saying…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_2', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_2-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_bubble_conspiracies_3(pc){ // defined by conversation auto-builder for "the_bubble_conspiracies_3"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "one_tree_claims_to_know_the_unknowable_4")){
			return true;
	}
	return false;
}

function conversation_run_the_bubble_conspiracies_3(pc, msg, replay){ // defined by conversation auto-builder for "the_bubble_conspiracies_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_bubble_conspiracies_3";
	var conversation_title = "The Bubble Conspiracies";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['the_bubble_conspiracies_3-0-2'] = {txt: "No?", value: 'the_bubble_conspiracies_3-0-2'};
		this.conversation_start(pc, "You know about the great divide, of course?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_3', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_3-0-2"){
		choices['1']['the_bubble_conspiracies_3-1-2'] = {txt: "Other?", value: 'the_bubble_conspiracies_3-1-2'};
		this.conversation_reply(pc, msg, "At one time - not everyone knows about this, so keep it under your hat -  after the great confluence, the great collusion and the formation of the great council, there was the great debate, the great filibuster and, eventually, the Great Divide: Pot, Spriggan, Mab and Humbaba on one side… and on the other… on… the… ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_3', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_3-1-2"){
		choices['2']['the_bubble_conspiracies_3-2-2'] = {txt: "I couldn't if I tried.", value: 'the_bubble_conspiracies_3-2-2'};
		this.conversation_reply(pc, msg, "Shh! I think someone’s listening. POP. Pop pop. Shhh. Tell no one.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_3', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_3-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_bubble_conspiracies_4(pc){ // defined by conversation auto-builder for "the_bubble_conspiracies_4"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "the_bubble_conspiracies_3")){
			return true;
	}
	return false;
}

function conversation_run_the_bubble_conspiracies_4(pc, msg, replay){ // defined by conversation auto-builder for "the_bubble_conspiracies_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_bubble_conspiracies_4";
	var conversation_title = "The Bubble Conspiracies";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['the_bubble_conspiracies_4-0-2'] = {txt: "I don't think so…", value: 'the_bubble_conspiracies_4-0-2'};
		this.conversation_start(pc, "Sometimes, when my bubbles burst while I’m growing them, I hear old voices. You hear that?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_4', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_4-0-2"){
		choices['1']['the_bubble_conspiracies_4-1-2'] = {txt: "… to overthrow…?", value: 'the_bubble_conspiracies_4-1-2'};
		this.conversation_reply(pc, msg, "The other day, I swear I heard two voices - not Glitches like you, but echoes, older voices, from before maybe Grendalinians from the sound of them – discussing their search to find some sort of artifact they needed, in a plot to overthrow … to… overthrow…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_4', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_4-1-2"){
		choices['2']['the_bubble_conspiracies_4-2-2'] = {txt: "That's not too far from the truth…", value: 'the_bubble_conspiracies_4-2-2'};
		this.conversation_reply(pc, msg, "SHHH! Did you hear that? Someone’s listening. Walk away! We never had this conversation! I told you nothing!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_4', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_4-2-2"){
		choices['3']['the_bubble_conspiracies_4-3-2'] = {txt: "Um… Ok.", value: 'the_bubble_conspiracies_4-3-2'};
		this.conversation_reply(pc, msg, "Shhh… Pop! Bees! Bees everywhere! Bees in hats! Military hats! Pop POP!", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_bubble_conspiracies_4', msg.choice);
	}

	if (msg.choice == "the_bubble_conspiracies_4-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"one_tree_claims_to_know_the_unknowable_2",
	"one_tree_claims_to_know_the_unknowable_4",
	"shape_of_the_world_3",
	"ages_of_the_world_3",
	"the_bubble_conspiracies_1",
	"the_bubble_conspiracies_2",
	"the_bubble_conspiracies_3",
	"the_bubble_conspiracies_4",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting a <a href=\"\/items\/260\/\" glitch=\"item|bean_bubble\">Bubble Tree Bean<\/a> in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a>."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/209\/\" glitch=\"item|plain_bubble\">Plain Bubbles<\/a>, which can be converted into other kinds of bubbles using the <a href=\"\/items\/263\/\" glitch=\"item|bubble_tuner\">Bubble Tuner<\/a> ."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"Quick! Take more! They're onto me!",
		"If I promise you extra, do you promise to keep schtum?",
		"…the most generous of all the Giants was…",
	],
	"harvest_bonus_g4": [
		"...fizzled until all the rooks… wait! Who are you?…",
		"Pop! Pop! The end is nigh! Just take it all! Pop!",
		"Here! Extra bubbs! Just don't tell them THE SECRET.",
	],
	"harvest_bonus_g5": [
		"Partners in the Cause yeah? Take extra.",
		"Psst, comrade. Extra supplies. Don't let me down.",
		"…and because of that, these are extra special. Shhhhh…",
	],
	"harvest_drop_g3": [
		"Wait, what was that?! Oh have it, it's been compromised.",
		"That's not mine! That was planted on me! Take it away!",
	],
	"harvest_drop_g4": [
		"…with ALL the ink in the land. They never…",
		"Who planted this on me? You? No? Take it away!",
	],
	"harvest_drop_g5": [
		"They can't bribe me. You take this.",
		"Comrade, take this. For the struggle.",
		"Take this for the cause. Whatever \"this\" is.",
	],
	"harvest_g1": [
		"Hey! Pssst. You like bubbles? Here.",
		"What? Bubbles? Mine? Why? Well, ok…",
		"…Fine. Take them. Don't let it get back to The Man…",
		"Here! But shh… Don't tell anyone they're from me.",
		"Bubbles! Now move along before anyone sees you.",
	],
	"harvest_g2_g3": [
		"…know the power you hold in your hands…",
		"Bubbles. Precious bubbles. Just for you. Pop-pop!",
		"…which is why harvesting is crucial to… Oh! Shh.",
		"Wait, my tin hat didn't fall in with that haul, right?",
		"…Again? You're up to something, I sense it.",
	],
	"harvest_g4_g5": [
		"…and I promised never to tell anyone. Oh! Who are you?",
		"Ha? Snuck up, eh? You're learning, little'un.",
		"If you see my hat anywhere, bring it? Handcrafted? Tin?",
		"Anyone but you, I'd tell them to bubble off.",
		"…a sour smell, like scorched batterfly wing, and…",
	],
	"pet_drop_lgt2": [
		"Quick! Take this! Hide it from sight!",
		"Oh! I can't be caught with this. Take it!",
	],
	"pet_drop_lgt3": [
		"You take this. Too hot for me.",
		"If they hear I gave you this? It's curtains for me. Shh.",
		"On behalf of the Tin-Hat Coalition.",
	],
	"pet_lgt1": [
		"Who told you where I was? Did they? Oh, well. Thanks, I...",
		"...fizzing so loud the mountain popped! Pop!",
		"…and if you think loud enough, they might hear…",
		"Quick! Get the tin! My hole has a hat! No! Hat has hole!",
		"Shhhh, if you see him, don't tell him I'm here.",
	],
	"pet_lgt2": [
		"Wait! Shh. Did you hear that? Never mind. Pretend you didn't.",
		"...a nice BLT: a batterfly, lettuce and tomato sandwich, and...",
		"... big difference between mostly dead and all dead. And...",
		"...shh! Can't talk now! Tin foil hat compromised! More later!…",
		"...went pop! Pop pop pop!  Until it was all dark, and then...",
	],
	"pet_lgt3": [
		"...then the ropes all snapped! Chaos, and...",
		"…all the way up to his knees. Wait. Who are you?",
		"…hat full of traditional English trifle. It was…",
		"… \"POP!\" it went! And I said \"POP!\" but then....",
		"…smoke pouring from the aubergines and then…",
	],
	"pet_na": [
		"Wazzat? Whoyou?",
		"Huh?!",
		"Wait! Where am I? Huh?!",
		"Shhh, all my twigs are pinging!",
		"...ohhhhhh, bubbles they said.",
	],
	"pet_na_failed": [
		"No, gerroff...",
		"Don't touch! Are you radioactive? Badgers!",
		"The radio signal is telling me not to accept your advances.",
	],
	"revived_1st_time": [
		"What? Where am I? Get away! THE ROO… oh, it's you. Need more.",
		"Still… the fizzing… more reviving. From someone TRUSTWORTHY.",
		"Explosions in brain. Rook got in. Get it out with more reviving. OUT!",
	],
	"revived_2nd_time": [
		"The flapping is fading. Explosions are dying. Just a little more help?",
		"Noise. In brain. Fading. Once more? If I can trust you?",
		"Shhh. Yes. I hear that? Almost? One more revival? Then. Then…",
	],
	"revived_3rd_time": [
		"Yes. Good comrade {pc_label} - enemy of the rook. I recognise you.",
		"{pc_label}! My thanks. Perhaps you are not one of them after all.",
		"You have come good, {pc_label}. The rook has not won. This time.",
	],
	"rooked": [
		"The rook! Pop! Pop POP! Fizzling! In my brainbubbles! Make it stop!",
		"ROOKED! The rook! The rook! Shut down operations! SAVE ME!",
		"Just like I said! Like I said! End times! Rook is come! THE ROOK!",
		"Fizzing! Fizzing in my bubbles! Explodifying! Save me! I can help!",
		"First comes the rook! Then the rest! Argh! The pain! Help! Pop POP!",
	],
	"water_drop_lgt2": [
		"Where do these things COME from? Take it! Quick!",
		"If anyone asks, you just found this.",
	],
	"water_drop_lgt3": [
		"You ain't seen me, right?",
		"No idea who planted this thing. But I don't want it.",
		"Shh. Take this. Say nothing. Go.",
	],
	"water_lgt1": [
		"Say, I don't remember ordering drinks, who sent you?",
		"…Did one of Grendaline's send you? Why I oughta…",
		"…to the top of my tallest bubble, I swear it, until…",
		"You ever get the feeling you're bein' tapped, kid?",
		"…even the slightest sniff of a… wait! Who are you?!",
	],
	"water_lgt2": [
		"Wait? Where's that wet stuff coming from? You? Ok.",
		"…and when it's all ready…shhh, someone's tapping us!…",
		"You promise me this is just water, right?",
		"…it's the batterflies behind it all, I swear…",
		"…literally heaps of the stuff round the back…",
	],
	"water_lgt3": [
		"…pop, pop, pop! And then they ran away! That way!…",
		"How do I know this is plain water? Oh, it's you.",
		"Now, you? You I trust, but THEM? Noooooooo…",
		"Fine, water, but if anyone asks, you were never here.",
		"Say, kid?… You're alright.",
	],
	"water_na": [
		"…what's that? Wet? Huh?",
		"Huh? Something for nothing, eh?",
		"I don't trust watering cans. But you're ok.",
		"…all in it together. SHHH! Someone's listening…",
		"…in the caves. But it only LOOKED like an accident…",
	],
	"water_na_failed": [
		"No water today! I am trying out a new wiretapping system.",
		"No, thank YOU, I mean, is that water? How do I know?",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-62,"y":-204,"w":121,"h":202},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFqklEQVR42s2Y+09TZxjHWdQliyHd\nD8uyLdvI5s8bMSaaqbETcWZeQOgqIJfDzVLKpWOKrW1pKb3Q+6Gl91JOS68c6AUoyobu6Db2g1ns\nn9A\/of4H37UkcxPXLZtFz5M8aXLe9z3nk+\/zvs\/zvK2peUmzbnTVl38l9DHO4o\/D3Bo2WfLn\/nrT\n2jVY0ueIqeipgiJ+sejMNZGsAaR\/usG1ZNuhTZ5mppNfQ0qdgDnVyLBKRdPKpYKebsSd6OW8InIW\nsvBJFasAA1ttzebM1eKY9xQjoU4X5dGjda8cwh7nEcH0AJPcGq130T1iamNUtbkjfwYSyHWSUu9J\nSmD4lFPpHZFNocpAN3LKvv2bhFNVwCA9yDhjHQhmBxhL6CrISDvCGzfEu\/twW8AJGcYKCwtdeYOP\nX\/HD1ggfthhPbEkM5r00kakqYGRNpLJHOmGLtpLm0HV4kr0wLV7ZTSnRqJHcDMoRWRZhTMeveEC0\nIaJojVxlNIt8mEOtqHqYbaFu0pHszZDU9aLR3UT88Tx3T0lKcz402Oyg276sCKhwXcx46C5G6b4A\nyxKvUHXA7x8NE9F0N9Ow0\/DcIQjHbxPrPjGctl44+Rcq5kBDsKXekx4tKjxXoAs2Vfeku8\/3cQP+\nb5FODsM5ffYFlZJWHmP2tsDibK14gst7NbpGFMqgVVdv88wZ8d2pDqTjE0gNnyjuHc89khfcfgFS\njacrKjOf1jDh0nqNu7FYdcDux91cIngJ4YQQpLsvv3ec8OjgD43A23Ne\/Hfrn3z2BffuubOIp\/ux\n03n0H5X+\/wmZGslb\/AM4LldRe8cyG0qsSL\/CtKe1ooKiGB\/leXbP4P4ALtHd3Pl4Hwalbc\/tQQwd\nrc8mphDWt4BY51fMb9JQL7OUHMcF1c3qh7hs6fUpbig1CZV3HAbH5WcbHYJjnLhJlLfP9UDv\/DP9\n7LX7yx2EK3wNpJ+fqdkv2zaNFEOxccyYeJm\/AubWRjGvHYF0unL6uHtfk0k4RhDvVKBm4cn+1OtA\n03kqUgqT1twD3ey4SiJp3C1tkZiWIV2DUOnaqUprM7mZvH9RiGkDb\/\/ascdPfuAup22w2OegUA5j\nQtKU1xmU4nhCn7c7hZCp2gs+n++Feuyj+ZzVrALewCikCh6T2hmoCz3oYhzrV6rfgYdXe4hQYhgm\n6yC0+iHY5ozQGy2IJRIw21xQq20vfPThLw\/JSHIMq1k91MY2Jrw6IKay3fDf4+3PgXEG+prdUXXR\nZBUhncvCT8WgVBsxKdNBqbU1Pzd3YaAuTjvyzK+PQa\/bkcjcQmKtB7MuHrW\/7X6pdKXWc4WVbA5l\ndwWWIP6uH25fMPNgZ6fO6zXUe4JDZNKnQSAkQDAmxPIGAU\/kWqnZaCFeSSO7vb3NiSRXxYmVlfy8\nzwCv3wuZUlNc3djKxFaMcHtvlvbdBNSGNtxRteZ19ibVviTpf+243T7C6nAjQC3BRJJY33oAOruB\npYi9BMwryqa\/eb33FIfbzy3DlT0cT8LsCEClscJgtheNFjtRwwabc3oL3mAIZSUnbsnRL7xJCQRV\nvnu8jMXoVXGcXt1VUaHWY9Yyx677cdlIp4dx+xdgd3ogV85AImGRgrttvXWOcfkCu3AC4RgGRkbq\n2KXgvLtIRaKwkA4IRWL2KWh1uFB2byC4q2BH9w12\/ds15\/KgHGLznAPXewYhEk2IWRZiD1WGnNGb\n0Nnbh74hUTOrAOl0mmub90BjsGJmdgY6nYFdCi6EI2Kt0QalxgDltBZSmYpiFWC55Dk8fhht85i4\nPYU78mmSVYCpVKrOs0CBdHohnyolaukU+6qJxe6CzkRCND6JW5KpIpvY3ih5rUytfzopU6NXIEZH\n7\/DT2trad0rP33qtZG+XjMPhHDl06NDxAwcONH\/40ScLH9cd2X73vQ\/UBw8ebDh8+PDnpWnvl\/zN\n\/\/ru3wGCkRdPk57BdgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288917479-6190.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
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
	"trant",
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"h"	: "harvest",
	"v"	: "revive",
	"t"	: "water",
	"y"	: "apply_antidote",
	"c"	: "apply_balm",
	"e"	: "pet",
	"o"	: "poison",
	"g"	: "remove",
	"k"	: "rook_attack",
	"j"	: "talk_to",
	"n"	: "trantsform",
	"u"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("trant_bubble.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
