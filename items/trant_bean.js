//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Bean Tree";
var version = "1354586285";
var name_single = "Bean Tree";
var name_plural = "Bean Trees";
var article = "a";
var description = "The good old Tree of Bean. Laden with 57 varieties of identical-looking legume, these protein-machines provide the raw ingredients for hearty chow and base material for new trees.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_bean", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_bean
	"conversation_offset_x"	: "0"	// defined by trant_bean
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

// global block from trant_bean
var fruit_class = 'bean_plain';

var fruitProdMap = [
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

var fruitCapMap = [
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

function conversation_canoffer_the_rise_and_fall_of_the_bean_1(pc){ // defined by conversation auto-builder for "the_rise_and_fall_of_the_bean_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "perspectives_of_a_patch_4")){
			return true;
	}
	return false;
}

function conversation_run_the_rise_and_fall_of_the_bean_1(pc, msg, replay){ // defined by conversation auto-builder for "the_rise_and_fall_of_the_bean_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_rise_and_fall_of_the_bean_1";
	var conversation_title = "The Rise and Fall of the Bean";
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
		choices['0']['the_rise_and_fall_of_the_bean_1-0-2'] = {txt: "Huh?", value: 'the_rise_and_fall_of_the_bean_1-0-2'};
		this.conversation_start(pc, "And HE said, “I know it’s BEAN TREE, but what is it now?!?”", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-0-2"){
		choices['1']['the_rise_and_fall_of_the_bean_1-1-2'] = {txt: "Sorry, what?", value: 'the_rise_and_fall_of_the_bean_1-1-2'};
		this.conversation_reply(pc, msg, "And I said, “STILL a bean tree, old thing!… Or should I say, OLD BEAN! Like me, the bean tree, you understand?!” A ha ha ha ha ha.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-1-2"){
		choices['2']['the_rise_and_fall_of_the_bean_1-2-2'] = {txt: "No. ", value: 'the_rise_and_fall_of_the_bean_1-2-2'};
		this.conversation_reply(pc, msg, "Wait, weren’t you the glitch I was just talking to?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-2-2"){
		choices['3']['the_rise_and_fall_of_the_bean_1-3-2'] = {txt: "Wait, what?", value: 'the_rise_and_fall_of_the_bean_1-3-2'};
		this.conversation_reply(pc, msg, "Well where did that ungrateful little… never mind. The point was, this world hasn’t been in place for long, and even though the giants have existed far longer than the world they’ve created, they still haven’t got a handle on how the whole thing works.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-3-2"){
		choices['4']['the_rise_and_fall_of_the_bean_1-4-2'] = {txt: "Eh?", value: 'the_rise_and_fall_of_the_bean_1-4-2'};
		this.conversation_reply(pc, msg, "See: while they all know a lot about their individual specialisms, when everything is created all at once, the way is was - and it was, don’t let anyone tell you anything different - they have no idea what anything is. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-4-2"){
		choices['5']['the_rise_and_fall_of_the_bean_1-5-2'] = {txt: "Weird.", value: 'the_rise_and_fall_of_the_bean_1-5-2'};
		this.conversation_reply(pc, msg, "Basically, twiglet: If it’s not an animal, Humbaba won’t acknowledge it, and if it isn’t a rock, Zille couldn’t pick it out of a line-up. ", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-5-2"){
		choices['6']['the_rise_and_fall_of_the_bean_1-6-2'] = {txt: "Interesting…", value: 'the_rise_and_fall_of_the_bean_1-6-2'};
		this.conversation_reply(pc, msg, "They may be mighty, see, but they know very little. Very little indeed. You, in fact, could probably teach them something.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_1', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_rise_and_fall_of_the_bean_2(pc){ // defined by conversation auto-builder for "the_rise_and_fall_of_the_bean_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "the_rise_and_fall_of_the_bean_1")){
			return true;
	}
	return false;
}

function conversation_run_the_rise_and_fall_of_the_bean_2(pc, msg, replay){ // defined by conversation auto-builder for "the_rise_and_fall_of_the_bean_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_rise_and_fall_of_the_bean_2";
	var conversation_title = "The Rise and Fall of the Bean";
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
		choices['0']['the_rise_and_fall_of_the_bean_2-0-2'] = {txt: "Go ahead.", value: 'the_rise_and_fall_of_the_bean_2-0-2'};
		this.conversation_start(pc, "Stay a while, let me tell you something about my roots.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-0-2"){
		choices['1']['the_rise_and_fall_of_the_bean_2-1-2'] = {txt: "Yes.", value: 'the_rise_and_fall_of_the_bean_2-1-2'};
		this.conversation_reply(pc, msg, "Ha ha ha ha. Roots.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-1-2"){
		choices['2']['the_rise_and_fall_of_the_bean_2-2-2'] = {txt: "Ha ha ha. Yes. Now, roots?", value: 'the_rise_and_fall_of_the_bean_2-2-2'};
		this.conversation_reply(pc, msg, "No, do you get it? Roots. It’s a very funny joke. Because I’m a tree.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-2-2"){
		choices['3']['the_rise_and_fall_of_the_bean_2-3-2'] = {txt: "Really?!", value: 'the_rise_and_fall_of_the_bean_2-3-2'};
		this.conversation_reply(pc, msg, "When this world was very young - and it wasn’t that long ago, barely moments before you popped into existence yourself…", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-3-2"){
		choices['4']['the_rise_and_fall_of_the_bean_2-4-2'] = {txt: "Well done?", value: 'the_rise_and_fall_of_the_bean_2-4-2'};
		this.conversation_reply(pc, msg, "Yes, when the world was young, everything came from a bean. The animals, the mountains, the building blocks and the weather, everything started as a bean. But I am the only one who has remained truly beany. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-4-2"){
		choices['5']['the_rise_and_fall_of_the_bean_2-5-2'] = {txt: "I will.", value: 'the_rise_and_fall_of_the_bean_2-5-2'};
		this.conversation_reply(pc, msg, "Planks. A ha ha ha. Point is, sometimes, those special beans might appear. The Cloud Beans, the Bureaucratic Hall Beans, the Cavern Beans, there are still some out there, somewhere. And if you find one? Well, come back if you do.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_rise_and_fall_of_the_bean_2', msg.choice);
	}

	if (msg.choice == "the_rise_and_fall_of_the_bean_2-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_rise_and_fall_of_the_bean_1",
	"the_rise_and_fall_of_the_bean_2",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting a <a href=\"\/items\/101\/\" glitch=\"item|bean_bean\">Bean Tree Bean<\/a> in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a>."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/104\/\" glitch=\"item|bean_plain\">Beans<\/a>."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"Extra beans? I'll \"soy\" you can have extra beans!",
		"Bumper crop! Unbe-leaf-able!",
		"We've bean saving this especially for you, little one.",
	],
	"harvest_bonus_g4": [
		"We have 'conifered' with others and think you deserve this. Ha. Ha ha.",
		"Here, a hill of beans for you to compare things to.",
		"Where beans are concerned, you are a giant a-mung Glitchen.",
	],
	"harvest_bonus_g5": [
		"Other glitches will be 'evergreen' with envy. Ha ha.",
		"Bonus! It'll be a while \"lentil\" you return. Ha. I made funny.",
		"I beleaves you might have a bumper crop. Be-Leaves. Get it?",
	],
	"harvest_drop_g3": [
		"Planks' for everything, little glitch. Here's a surprise gift",
		"A little something. For being so \"rooted\".",
	],
	"harvest_drop_g4": [
		"Don't 'fir'-get our kindness, this 'walnut' happen often. Aha ha. Brilliant.",
		"Yew like surprises, right? Ha. \"Yew\". Like a tree. Ha ha.",
	],
	"harvest_drop_g5": [
		"Harvest AND a gift? 'Barking' mad. Ha. We are good at jokes.",
		"I'm out of puns. Have a present.",
		"\"Yew\" didn't \"ash\", but you \"walnut\" forget this. Ahhh.",
	],
	"harvest_g1": [
		"Is that what you've bean looking for?",
		"Cool. Beans. Cool beans!",
		"Two bean, or not two bean?…",
		"You favored us. Now, we fava you. Ha ha. Like \"fava bean\".",
		"Wassssss-sap! Ha ha ha. Oh just take bean then.",
	],
	"harvest_g2_g3": [
		"Your proficiency in this 'field' astounds. Get it? Field?",
		"Beans, eh? You're barking up the right tree, then…",
		"Don't forget to say \"Trunk You\"! Heh. No, was joke.",
		"Take lots. We're 'rooting' for you. Ha ha. That was joke.",
		"I think I've run out of puns. Not beans tho'. Take.",
	],
	"harvest_g4_g5": [
		"We 'bough' to your superior arborology skills. Ha. We are funny.",
		"Heavy crops hurt my 'lumber' region. Ha ha.",
		"Bean good dealing with you, kid.",
		"A haul beyond beleaf! I've never bean prouder.",
		"You've got your finger on the pulse, kid. Ha ha ha.",
	],
	"pet_drop_lgt2": [
		"We have been 'arboring' a desire to give you a gift. Ha ha.",
		"Ooh, nice. Here's a treet for you. Ha ha. \"Tree\"-t.",
	],
	"pet_drop_lgt3": [
		"And an extra little something, you twig?",
		"On behalf of our charity branch, take this.",
		"Over vigorous treehugging has dislodged gifts. Now leaf.",
	],
	"pet_lgt1": [
		"Ahh. We have been pining for a hug. Ha ha.",
		"Fir the record: this petting is improving.",
		"You've spruced yourself up since I saw you. Ha. Spruce.",
		"Nice hug, bud.",
		"Ahhhhhh, sap's what I'm talkin' about.",
	],
	"pet_lgt2": [
		"The petting is unbeleafable. Ha ha. Tree made joke. Laugh.",
		"Tiny Glitch is very poplar with us. Ha ha.",
		"Your petting's never bean better. Hee!",
		"I wooden have thought you'd be so good. Now laugh.",
		"Tree arbors strong feelings to you. Chuckle now, please.",
	],
	"pet_lgt3": [
		"You are oakay with us, tiny Glitch. Ha ha. Laugh!",
		"Shhh. Working on photosynthesis puns.",
		"You've got to the root of the problem. Foof!",
		"Never leaf me. I'm not joking, you know.",
		"Where have you bean all my life?",
	],
	"pet_na": [
		"I beleaf you've been practicing. Haha look how funny tree is.",
		"Nice petting, bud. Hahaha. \"Bud\" is tree reference. Good.",
		"I, wood, like you to come back often.",
		"Trunk you very much.",
		"You're \"OaKay\". Spelt like the tree, the \"oak\". Get it?",
	],
	"pet_na_failed": [
		"Make like a tree and leaf me alone. Haha. Tree is funny.",
		"Little Glitch is barking up wrong... oh! Ha ha. Tree made joke.",
		"Leaf me alone. Ha! Laugh at joke, glitch.",
	],
	"revived_1st_time": [
		"Trunk you. Marginally better. I still need more though.",
		"Ah in touch with my roots once more. But please. More reviving.",
		"Still the rook blights me. Another dose of reviving? Anyone?",
		"Still sapped by the rookness. One revival more? Well, two?",
	],
	"revived_2nd_time": [
		"I've bean better. Ha ha. No, really, can you make me better, still?",
		"Better. Almost completely. Once more will unrook me.",
		"My roots are tingling. One more reviving dose should do it.",
	],
	"revived_3rd_time": [
		"I am unrooked!!! Trunks be to {pc_label}!",
		"{pc_label} rooted for me (ha!), and now I am unrooked!!",
		"Thanks to {pc_label}, my sap is rising once more.",
	],
	"rooked": [
		"The rook! It's sapping my life! Arrrrrrgh!!!!",
		"There's a shooting pain in my roots! Revive me!",
		"I've bean rooked! Ha ha - no, seriously, I'm dying. HELP.",
		"Bean… rooked… Life… sapping… away… Help… Help…",
		"I be…leaf… the rook… got me. Dying. Help me…",
	],
	"water_drop_lgt2": [
		"Call us sappy, but we think you deserve this. Ha ha.",
		"Tree has never bean so happy. Take this gift as thanks.",
	],
	"water_drop_lgt3": [
		"Here. I have been 'logging' your watering hours. Ha. ha.",
		"The last time Tree felt this good, Tree was just a sapling. Have this!",
		"Tree wooden let you leave without a little gift. Ha ha.",
	],
	"water_lgt1": [
		"Nice watering action, bud.",
		"Your act is like cool glass of water on a.... oh it IS that. Ha. Ha ha.",
		"Little glitch has improved. Glitch \"moss\" have been busy. Ha ha.",
		"You're getting better at this. Ever thought of branching out?",
		"Tree is lichen that.",
	],
	"water_lgt2": [
		"One more of those, and you'll get me trunk.",
		"Dew want to do that again? Ha.",
		"You've bean practicing. Tree made a funny.",
		"Water great job you're doing. Now laugh, please.",
		"Tree's rooting for you. Ha ha.",
	],
	"water_lgt3": [
		"That's got to the root of it. Ha ha.",
		"Yes! You show that watering can 'hose' boss. Ha! Laugh.",
		"Has anyone told you that you're unbeleafable?",
		"Tree has never bean better. That's right. Ha ha.",
		"Glitch gets top barks for that watering. Funny!",
	],
	"water_na": [
		"Water nice thing to do. Ha! Ha ha?",
		"Trunk you very much. Ha ha. We made joke. Laugh.",
		"Thought you'd never pull the twigger. Joke.",
		"Cheers, bud.",
		"How kind you're bean. Ha ha. \"Bean\".",
	],
	"water_na_failed": [
		"Please desist. I am growing a new ring.",
		"Stop! Do I look like seaweed to you?!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-84,"y":-180,"w":157,"h":179},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKkklEQVR42t1YCXAT1xne2ujeQ8dq\nZUm+MJBgB4ghUIKNwYAPTHxgSStf4NgGG0tGtuRLsq617suWgAQY52hzZ0qSNs3QkLRpaCbJTDuk\n0yYlaUpLYdpMOwESJklzAMHb97giO7aBkJCZ7MybtbX\/vve9\/\/i+fx+C\/BAvphIRMhpBOrxf1bYY\nmUXTSOpNBRiq52f7daKmgAZRTmcT24wuCNWjnR4N6vXUClsj1ULVzfEejXADtKg0oEeZwUIEm8om\nSCPykW1iX6QVf8FVw99rrxQ+594o6gnWYrLvGt+PvDWihX4aG\/XRWPVUBvtAOENGaVnURD4\/apIm\nGJqT37OOY2RqifuC9bLlVzZajah8Wt48OJgyhKKRbyEN\/DWCDB+Njvl12BFXDfoLdw16r1snoMfG\nEM6VhRkkJdotXR81U0\/F+yjjIzFE1FWI3AZs93m0qHa3UY6G6qV1Pp3kMVcNfsBZgx3w0OgeH82f\nDR1wI6FFg1qsHXjvlKNaeHSwgnePWyt8OtRM\/GZHt2TlBNst+NyQQRYMGEkLM5SZZ6vDl3k0ov1+\nHepjNKLwQIXoHXMp\/y995YKnrRW8dz169INAC9bGdFy96K5c4RKE8NWia4M6YSUsBr+GnxWkiWc8\nWvwDELIdrauQjIRJ3LbDIj8R6Zb\/ZKczfd7ld00VCM\/bii9nOhX1ru2qQpceKwzosAcDevyPQxuE\np0zFnDc6CpBNxlVIbmgrOhw3SU8EtsgORQzYrVf1IsyhnUbxGlAEL7hrhH8CCX7YWS06ENCLHwk1\nSE+CkBzuKETWQNu9Dpk63iMPBQzyfbuYtLzkeUwmhDdkSpMbGglJgBbeBTx\/0K\/HPu8v57\/VWZRa\nT+chKLR7kKHKYttlu6O9aSdGnarhXYwUn7EIwu3obZF2yevhZvxtWwWvbHA9V2O9i\/9kQE985NUR\nnw6sF7zRsgJZCI3HOhDOiE3RELMpH072YPLVcQfCCejw4aAe\/3C4Fj3dX87rbclHxJefj4URwt\/I\nz\/IaFG9HrcpNIIf506K7hyFVo0OqiK9denKvlfol\/K0YEK2rmr8mQOMnQZKf6yvnXQEYtyCCoJna\nHDYpQj+dZmKfBl0VqhO\/EqoXn2dqRI+bV3Fzv8aZDLUoZlMfidtVVQAgd1qAO+wiRdhM7QsZyPsf\n8FKFXxUIPxMA3O\/V4SxI8L8ZyvmtLlfOwugQuTo6qPxV2Kr0TTXxGPBeuE7sDjVIToMIHHfXCmjo\n0a+t61GWx4eUBxJOZe6MOWihEcGIU\/3MiEPp6+hIog5QwWEaNYA8ZO1V+H9N5aIRZiC7g7Fkxr1G\nqjlko3KmmjioQzUgb9+MNMrOB2hijNnIz\/6KjnIXMEy2eNSlvj3co3gyZlX\/IWFLy56xQKBm+rYr\nLJE+5ROTc9NPC34MwnTCoxF\/bioR\/MzhUGY5BzLmXKKGr4ELaYTLgnrsuWAdcQa8d8xfR9DJmszY\n0ue6+3Os7jbqMV9X2kMhm6pkFyismbkOkGzMqqgKmtP+mmDk+WErQtiY+Rd25asj5oTrxS8F9JLx\nvjL+oW0FyIrpwgHDCMANBvXEaQCQBX9HoPxNWmuW2z2\/wd6VtQTQEZUcsRmreIeTvHXYKHcMt5F\/\n97YrHa7uTP2lMEuh\/vppnHVUiT7qLJoVn24Srw4rCtQRB4HnxkGBHAONRQBwIBNpkr0E\/n\/apxXd\nHaxFZJZ4uuC6Ox34AtiNkDFQOU7n\/PY+Rkle0WENVujX4+97deh56wb+obblF\/lwUnuFRhtkvtFm\n1ZnYJooFxXGO0aAfO2rgwM8yGuILsMnTkRbxcKwTpW5Ie02TcgKqCajmx4E3WCBZn\/WWcp9oXoGo\nJ7ZZZH20SX4s3CBjgeqwllI+C7zNGlbNerNnDefh\/lLOm45KwdlQE\/FpvF1ijLRN3RFduwYjSMoF\nmavDtwe0aJdPh24DIP8JiHec2Sg6aVnL9bVkX+RAv1a4FIDfHwScBynJXMJjtxamHmovQLQgLwnT\nXIS3q1e8eGQb\/vrOHhkbapMcD7ZgRd+4oYW9X1Av3OCnxSfDDeS5kc2Ks5FG6VkA9jxMfgB03KtF\nD7urBfQFgDTaAQD+Dz4brBCw7YWz3m1dnqoDj1KSikP4gEexP9FDsrEu+Tgg5+diTsXs6wYHNTlu\nkhQFGgl2qBL9xFIqOritiPNqT4ngqKMKZS9U56UR0GM\/D9Ho2kgD+TgIL8vU4mzPWu5n7QUpVqC5\nEwg8HkcE93mo2nCP3B53pB\/dwWR8vHM4w7UnlCm5zu8OjGQaiV\/vMsu+HO2SvAJ\/qwAhar0TWdK5\nmrN7cAP\/S9AAXAJIHAfefDZcL3kLAgRkDvIu9bXLTcU0VCS01qAHrRrMbruLuE5wLQh\/xK7siBip\n8Uin9BMQkmeTn7evRG4xr+M+5aoWjMOCuexJ0IiyPp0Y5B6f7ShMuaejGCGnWyPqpOYk3Om\/TzDp\nL8eZ9LnXDI4FdJJwynLjLvVvw33KE\/4usuN+htJMoCLQnpuLkY3WCu4HPh02IdzOGhHbVcz5cuud\nKfaZ1oGdS6g37Wh0SNUftkqI66MX0HAyrdKtzibJMaZhai9YAL0MVXASPh3BxjYpWEgrEKC9Ssga\nV3OOtxekbp7Mr1CpIJ9C1Ri1q4ZHBlUnRqzKlddfvaB1SjDq3rhDfXKUUTdPZVOMILMclfwmrxY\/\nA0iZHWlWzgjQzszLdzqzZkcGpelxp3K9v4t6MTakPpXwqgq\/2QdSp0wdMMr\/E7GkbZ8sh1c2spFf\n7NWg74QbpCxUDXgHMjglQLdnwRa3fd6AtzujM9qvfC3cm3Y4PKCMJ+zy\/LFr1OFJvSGliLsyXg2C\nSSBPQXG32TIlDDOHmqC5euzPyTk4nQcvpI19\/r2MKeNluw53dZfwM2\/o+zcyKFSBHe4B\/d6REZv6\nVe9AZqHbnbvZ7c5bd9kooBUtCtbj+2H+Qe9BgI5qWCTc99pXpLZNntTO5OXb7bnKb\/UUgdkqLnY1\ny3YPW2bf77bN6WtJau19WnwekLxHww0SNtJIXgDprsXY7nXcM5Ckb95hEZPHdXnnL3R5Fq6e0DGD\nlilI455QvYSFA3pwWINd1OCCFP9kFbnpV6wMEQGitiTnIOwX+9dDok599O4CZM73fhQHPinrQZi\/\nSAYJK3n7Gs6MUnfTLqAklUCL30sG6AFhtpRwPwRhNkG+\/H4PMzcSZT4tccRPw\/BeHF4twfaXi1hD\nEf8hw0pezvcGbrCQxAZKJV32DZJTrmox66y6OGwbJKx5nZQ1r5Ec61snaYKnrDcbG1wQ0y+VlXSt\nIl8zryXZ3hIZ2w3uPWAYiuVsW5GC7VwtB0P2SEWecDGwhy0VPI\/h3dAx29UIHAz4HazIIIVLSxeS\nLt0y6vW6ZeShpuXkvzRLZP\/W3UG+31xAndMvV3xcs4T6R1W+7MUlObhRIBCs4HK5t4F30y8B\/U7O\nrWE3goHFMtRSwZ2Lc6Rtc1XElgwKNSzKkkTnKvDELWpsrCKf\/F3FIvL5vEwimKPEzXIpqufz+as5\nHM7t4A4ljkC+w+KBIAUwZCKRKA0smMXj8W4B3lkgFAoXg3FHroooWTqbKE2XiBbBZ8AmG\/wOJU56\n6d1rDvH\/AfUoy5\/XEIpoAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288917461-1722.swf",
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

log.info("trant_bean.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
