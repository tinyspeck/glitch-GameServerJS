//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Egg Plant";
var version = "1354586285";
var name_single = "Egg Plant";
var name_plural = "Egg Plants";
var article = "an";
var description = "The noble Egg Plant. As is fitting to a fruit as ovoidly perfect as a prolate  moon, Egg Plants (of course) can only be found underground in cool, dark places.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_egg", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_egg
	"conversation_offset_x"	: "0"	// defined by trant_egg
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

// global block from trant_egg
var fruit_class = 'egg_plain';

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

// August 4, 2010, Stewart swapped these two tables to make them
// produce fast, but have small capacity as an experiment

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

function conversation_canoffer_shape_of_the_world_2(pc){ // defined by conversation auto-builder for "shape_of_the_world_2"
	var chain = {
		id: "shape_of_the_world",
		level: 2,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "shape_of_the_world_1")){
			return true;
	}
	return false;
}

function conversation_run_shape_of_the_world_2(pc, msg, replay){ // defined by conversation auto-builder for "shape_of_the_world_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "shape_of_the_world_2";
	var conversation_title = "The Shape of the World";
	var chain = {
		id: "shape_of_the_world",
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
	if (!msg.choice){
		choices['0']['shape_of_the_world_2-0-2'] = {txt: "Apart from the world being round? Or the gas plant told me it was, at least? ", value: 'shape_of_the_world_2-0-2'};
		this.conversation_start(pc, "Eggs, for the record, are not round. They are ovoid. You may be able to trace a line around them, but they are not, in themselves, round. Very few things are.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-0-2"){
		choices['1']['shape_of_the_world_2-1-2'] = {txt: "So the world is ovoid?", value: 'shape_of_the_world_2-1-2'};
		this.conversation_reply(pc, msg, "The Gas Plant has very little idea of how things are, in reality. Reality is not something that bothers Gas Plants very much. The world is no more round than my fragile harvest is round.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-1-2"){
		choices['2']['shape_of_the_world_2-2-2'] = {txt: "I see.", value: 'shape_of_the_world_2-2-2'};
		this.conversation_reply(pc, msg, "No. Eggs are ovoid. Pay attention, my distractable little mentee, and I will instruct you on the reality, as passed down to me by a great Alphibian scientist named Weena, creator of the first glorious subterranean transportation prototype.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-2-2"){
		choices['3']['shape_of_the_world_2-3-2'] = {txt: "Fair enough.", value: 'shape_of_the_world_2-3-2'};
		this.conversation_reply(pc, msg, "You don’t, but I shall continue regardless.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-3-2"){
		choices['4']['shape_of_the_world_2-4-2'] = {txt: "How far down?", value: 'shape_of_the_world_2-4-2'};
		this.conversation_reply(pc, msg, "The world, you should understand, is constructed in layers. Just as hills sit above caves and caves sit upon other caves, so this layer of world sits upon a whole other layer of world, and beneath that one, a whole other world, and beneath that one, a whole other. Each with their own time structure, creatures, societies, and, perhaps, their own giants.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-4-2"){
		choices['5']['shape_of_the_world_2-5-2'] = {txt: "But wha… oh, never mind.", value: 'shape_of_the_world_2-5-2'};
		this.conversation_reply(pc, msg, "All the way, my precious. All the way down.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_2', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_2-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_ruminations_of_an_egg_plant_1(pc){ // defined by conversation auto-builder for "ruminations_of_an_egg_plant_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_ruminations_of_an_egg_plant_1(pc, msg, replay){ // defined by conversation auto-builder for "ruminations_of_an_egg_plant_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "ruminations_of_an_egg_plant_1";
	var conversation_title = "Ruminations of an Egg Plant";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['ruminations_of_an_egg_plant_1-0-2'] = {txt: "Gas? You mean the Gas Plant?", value: 'ruminations_of_an_egg_plant_1-0-2'};
		this.conversation_start(pc, "An historical fact for you: No Egg-plant has but glimpsed sun since the day that wrathfully, Pot imagined all magnificent, heliolatrous Egg Plants unable to grow anywhere but in caves. No one knows what made him so angry, though Egg Plant lore suggests it something to do with Gas. ", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_1', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_1-0-2"){
		choices['1']['ruminations_of_an_egg_plant_1-1-2'] = {txt: "Is that true?", value: 'ruminations_of_an_egg_plant_1-1-2'};
		this.conversation_reply(pc, msg, "We shall not speak of it. Regardless: that is why, my best beloved, every single egg contains a perfect scale model of one of the suns. A round, glorious, golden, perfect sun in every egg.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_1', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_1-1-2"){
		choices['2']['ruminations_of_an_egg_plant_1-2-2'] = {txt: "I see.", value: 'ruminations_of_an_egg_plant_1-2-2'};
		this.conversation_reply(pc, msg, "I say that it is.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_1', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_ruminations_of_an_egg_plant_2(pc){ // defined by conversation auto-builder for "ruminations_of_an_egg_plant_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "shape_of_the_world_3")){
			return true;
	}
	return false;
}

function conversation_run_ruminations_of_an_egg_plant_2(pc, msg, replay){ // defined by conversation auto-builder for "ruminations_of_an_egg_plant_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "ruminations_of_an_egg_plant_2";
	var conversation_title = "Ruminations of an Egg Plant";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['ruminations_of_an_egg_plant_2-0-2'] = {txt: "No?", value: 'ruminations_of_an_egg_plant_2-0-2'};
		this.conversation_start(pc, "You must not mistake our usual reticence to converse to be a mark of unfriendliness, my best beloved.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_2', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_2-0-2"){
		choices['1']['ruminations_of_an_egg_plant_2-1-2'] = {txt: "Okay…", value: 'ruminations_of_an_egg_plant_2-1-2'};
		this.conversation_reply(pc, msg, "On the contrary, it is merely the act of trying to grow enough eggs to supply your demand that keeps egg plants unusually stoic and silent. At least compared to some of those other sun-blessed twiggers out there. We want to make eggs. It is our solemn duty. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_2', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_2-1-2"){
		choices['2']['ruminations_of_an_egg_plant_2-2-2'] = {txt: "How brusque.", value: 'ruminations_of_an_egg_plant_2-2-2'};
		this.conversation_reply(pc, msg, "“O”, as you so rightly say, “Kay”. You are now dismissed.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'ruminations_of_an_egg_plant_2', msg.choice);
	}

	if (msg.choice == "ruminations_of_an_egg_plant_2-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"shape_of_the_world_2",
	"ruminations_of_an_egg_plant_1",
	"ruminations_of_an_egg_plant_2",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting an <a href=\"\/items\/102\/\" glitch=\"item|bean_egg\">Egg Plant Bean<\/a> in a <a href=\"\/items\/376\/\" glitch=\"item|patch_dark\">Dark Patch<\/a>, or a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a> in your yard or home street."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/105\/\" glitch=\"item|egg_plain\">Eggs<\/a>."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"A grandiose haul, my little branch-shaker.",
		"Some trees are not generous. We, however, are MIGHTY.",
		"Little glitch has grafted extra hard. Take extra harvest.",
	],
	"harvest_bonus_g4": [
		"You cannot get \"un oeuf\"! I jest! You can have lots of oeufs!",
		"To reward your sedulous harvesting capabilities",
		"A truly awe-inspiring act of harvestage, little one.",
	],
	"harvest_bonus_g5": [
		"Call this your Newton moment.",
		"Truly this is the zenith of harvestability",
		"A harvest of brobdingnagian magnitude!",
	],
	"harvest_drop_g3": [
		"A token lagniappe for your trouble.",
		"We feel supremely munificent today.",
	],
	"harvest_drop_g4": [
		"You couldn't ask for a more concupiscible gift.",
		"For the mansuetude of your harvesting, a gift.",
	],
	"harvest_drop_g5": [
		"Felicitations on your redoubtable foraging skills.",
		"You have done well. Ergo, a gift!",
		"Your renascent tree-combing skills have dislodged bounty!",
	],
	"harvest_g1": [
		"This. For you.",
		"We grew this. You take.",
		"This harvest good. Have it.",
		"Ooooof. Take harvest. Heavy.",
		"We made this. You can have.",
	],
	"harvest_g2_g3": [
		"You deserve this harvest - No! This 'Bounty'.",
		"Your harvesting improves. Well done. Magnificent.",
		"Egg-Zempleraryaryary harvesting action. Yes, that's a word.",
		"Your reach astounds us. Such poise!",
		"A grandiose harvesting for a little Glitchling.",
	],
	"harvest_g4_g5": [
		"A virtuoso harvester deserves munificent harvest.",
		"You have superseded our expectations. Brava!",
		"Any more praise is superfluous. Take eggs.",
		"You have garnered a mighty, mighty yield, little one.",
		"A great and glorious future awaits you… also: eggs.",
	],
	"pet_drop_lgt2": [
		"Glitch has been magnanimous. Magnamousity now reciprocated.",
		"We reward such multifarious capabilities in such a tiny being.",
	],
	"pet_drop_lgt3": [
		"You afford pleasure; we reward with gifts",
		"A small token of our esteem",
		"Let us garnish you with a trinket.",
	],
	"pet_lgt1": [
		"We feel mighty and bountiful after good petting.",
		"Petting is preferent behaviour. We endorse.",
		"Gratitude for your niceyness.",
		"Such bespoke petting expands egg plant brain. Grazie.",
		"Such magnanimousity astonds us. Nice Glitch.",
	],
	"pet_lgt2": [
		"Yes. This is superlative petting",
		"Superior pettings propel Egg toward glorious harvest",
		"Tiny Glitch has improved exponentially at petting. Kudos.",
		"The magnamosity of little Glitch astounds Egg.",
		"Such beneficence suits little glitch. Mmmm.",
	],
	"pet_lgt3": [
		"Your petting ability greatly surpasses our expectations.",
		"This loyal pettingness will be richly rewarded.",
		"We are ecstatic. Egg-static. Ugh. We sound like stupid Beany.",
		"Eggzemplary, dear heart.",
		"Your altruism will not go uncompensated, Glitchling.",
	],
	"pet_na": [
		"Petting approved.",
		"Think petting good. Builds brain.",
		"Much gooder. Egg Plant grows in body and brain.",
		"Egg plant grows stronger. Cleverer. And eggier.",
		"Yes. Petting makes brain and eggs biggerer.",
	],
	"pet_na_failed": [
		"Away with you, pesky mite.",
		"Pet me not. I am contemplating the cosmos.",
		"None of that thanks. My mind is on higher things.",
	],
	"revived_1st_time": [
		"Blighted yet still! I need two more glitchling revivals! Two more!",
		"Be kind but once more? Or, actually twice? Or get a friend to?",
		"Sorry to be a pain, but I'm still dying. Please. Send help. More help.",
		"Still the pain sears my eggy veins! Revive more, apace!",
	],
	"revived_2nd_time": [
		"Almost… revived. Just one more dose? From someone?",
		"So close to eggy perfection! A single dose of revivalry more?",
		"I feel myself almost revived! Aid me but once more!",
	],
	"revived_3rd_time": [
		"I am indebted to you, {pc_label}. Revived! All is felicitous!",
		"A glorious, propitious happenstance! Saved from the rook by {pc_label}!",
	],
	"rooked": [
		"O! I am blighted by yonder rook! Help me! HELP!",
		"Death! It comes on mighty wings! Only you can help!",
		"Aid me, little one! I fear my life is… Irk! Help!",
		"Rooked! I've been… urrrrrgh… the… pain. In my EGGS!",
		"Eggs, scrambled! Rotting! The rook! Help me! Revive me!",
	],
	"water_drop_lgt2": [
		"For your patience with our occasionally prolix nature.",
		"For your assistance and fealty.",
	],
	"water_drop_lgt3": [
		"Felicitations on your eminent luckitude.",
		"Reaching as we have, a state of comity, I proffer this.",
		"Let us bestow this gift upon you.",
	],
	"water_lgt1": [
		"Excellent we needed that.",
		"Little Glitch is becoming agronomist! Is that a word?",
		"We lack superlatives for this watering. Hm: 'nicewet'?",
		"Ahh, we fear we will be forgotten, down here, in the dark.",
		"This watering exceeds expectation. Excellent.",
	],
	"water_lgt2": [
		"Ah, a little postprandial watering, just the thing.",
		"Many thanks, may propitious things befall you.",
		"Water promotes eggplanty ebullience. Whee! Ahem.",
		"Nothing could make us feel more salubrious.",
		"Ahhh. Now away! I have a dictionary to digest.",
	],
	"water_lgt3": [
		"Ahhh, watering too? A multifarious Glitchling.",
		"Waterfulness ameliorates both growth and wellbeing.",
		"Excuse my colloquialism but: thanks.",
		"Water, not light, is the egg plant's desideratum.",
		"This deluge encourages riparian standards of growth.",
	],
	"water_na": [
		"Ahhhhh. Better.",
		"Water good. We feel gratitude.",
		"Glug. Thanks.",
		"Yes. Liquid helps make harvests. Good.",
		"Good watering. But we still like petting too, comprende?",
	],
	"water_na_failed": [
		"Not now. I am translating obscure Greek drama in my head.",
		"Be off with you, I am composing odes in my noggin.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-94,"y":-186,"w":186,"h":176},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH0ElEQVR42u2YeUwb2R3HkapWAQLm\nCpdnjDE3xJhj06Vq01Rqu922m3Wzm3sBE2xsEg5zs4TDgAM2hzGHD25zBkIJ3iS725x1tGmq3SqK\nu91GPaKt1d2qaqtK82elXt++NwhqbzebbUNStMqTvpJn5r2Zz7z3+\/5+b+zn97Q9bU\/bZ7iNFgfK\nLtQk6i53JHrenchx3zCleq7o0j1rjSncW+ZEt61kx77\/K6BFFSC\/YZTgz29+GVMVSZjRJuOD157F\nH36Qhz++nofVxliPd3+8vyLA3SnZEwX8+cxu\/NLxDO7PfhH3xnNx15KFd4YycK0jBZPqEG5M7Sfg\nwT686cSHPwI+uIZ\/\/mKR+\/vbE3Lve102CmV3GnMFtP+lmmSZRbkj7nxZfNwjAdKbjZcEO+yqAJ1V\nFehyqCMwXBTkpMcUnl6\/O6qS35msdP\/jvTnw+ukMr79eHcH9c81mHqRKYr7Znsktn06Ao0qCWyYZ\nZrWJ8Jzbg+WGcOeWzOalcpF2uojBme\/E+Lz16vTXFCu9X8evJ7V4d16JH4\/n4+5ECa5bjuD8yAsu\nCuhsjcLffrIX9+b28KJh8pfbX+FD5822eNBYfyS4FXWo4Hp1HDd0jHF7n19yPqM7u7YHDmssRruD\n0duXhbFZGWZsMbBbxei1ZaLfKNFeMbKet01SuLpT8MPONFxuScZrjSJcbIrHpCbU9chmW9Uw2mvV\nYnS8KFJsnLN3RbmGB6WggH1tDPR1kTjdIkW7PgO1mgj0d7M8oL42DhTApgxUWJX+Wpsq0LxWEcvR\nEKGzuyXL+1a92OEoYjnvc92mTM4ymQXzuAxN7enQlCVAVS6GqpLolAQVryagsTMFbT1p6LNIfQxz\ns07sNn4jVLBlbr5WHeeeKxKavc\/R2aEPpyA81Ceo3ZSu8x57uzHe1bGf2bdlDv++hsWSivF5SGmN\nWEfhdASy3yqF1ZGF0blsDE9loelMCkpr470hfca6WyVm63FGu2UOP6ti3ItKocNnBq1SBwWiMeit\nC2vPbv4emZShpTsVFU1iHxPcahDr5osZ3adxOD+ABvGl2lTHFUOi52pXuvtXC7metYZE7vqZDO6N\nTsY5fDzGSW7IUTfT\/ucXsuOmLQkYH4jF2cW0daDVHKzYGPSeDsbSFLsJubSUibVxIbdsCdmMQ1e1\nWLGsieNT0MMcvg5InPXeZCbeXyZvX5eK+br1kvanK3n4vTMP1hOhrv5DLLeoErrpUjtrJY5edRgU\nB3ZgaVayDjOXiPrSYKSm+mFQFwTTWCaGyAwujLHQfDsIU1WRnkUlo+VXpITZt6IReTYmZ8PhU6ow\njBSG6P7D4TOVIWa65vems\/GbuS\/hZ2PZuDMs5XWhPgG0ilDX9R5inT0HWWyoXRGOYXPGJmBbdRD2\n5H4BxuYwPsVQ2UwMegpiMHCYBVkFnFUyzuVioWxZLYL3sl88yeybOcFwDyxpYyVBLqsywDFREuKa\nPxkBS5HATd+KZnl63bu\/2ZritHZFobNWBNtYDg9oJS\/X0ZgAA1metua0TUCdXoq2sng0lyRCf1zs\nodVouYThKCCdSSqSdsyrpfSlfY348YYgAy6UiUCW1PWgPq3GNJe+VwqqDZCHyTAiRU1Loq77gEgx\nVyz0UMAbNWJcrYrDgpKF6RBj\/nSOJYB00CcBqirErmZDKv\/gPnsmJsdTMT2aiNEZGZ9qqCZtLKYt\nMTDZd6OmNckn3UwXxsopoOkw6xw9zso\/Wt8fWncp4Fg+82BA8iCzMRqWid1YWMnBUXkQSgt38HHI\nx+NSBuytIRg+JcKiQ4Jmkhfnh0LR0hLLAy6qYuWzxb4x+F+1c2rWQ+IC0wXMxxbxjg6hggLxBjmX\nia4GAtMRgumpdB5wblGGpZZIkPwJe7+YB6abCYc5jAckS6sbOsZy\/zMgddlFEoe36uM9b1TEuV4v\nF7mdJ0UkVkSc8yTrtPanuMxtsZsGsZGl3tg4bMjenMwD2kYy4VjOhYlsKAytsY6NCSBZwPVI9Xfg\nCCvvPchyfDqRi9ztctZFZXiJxcSEbBPOR2SmlsZjMD4jhZmUP4eKhUWfsr6rIYYqr0vgaC6cLGTo\nzkj7WD4DaD6kSXgDiFQIzM2kbubC9ppAdHevQ\/U3JGG+RIjZrhgM0ZrdIOFzoeFlltvS3cxHG304\nrRL2qRxY+uJg6MrAxGIO79j2V5NgGF5PPz1DUgy8IsLsCYYHs+eTHfkBFt47mcfS2ntSMGiSoGvg\n33lw2CT2OR6yJmNkSAKjMQOGM+kY1IthqBfilFqk83vcTVkpVlRrxWjSp6JzIIMHatGR3XQPmcH+\ndF71TWmorU\/bPK4iNb5ElcQVl8c\/mc9SkgvlRO6HbVY3pKwQO58YnHdTqyWCIuLMoiIhTpBYo1Lk\nR0NxLBIFL4ej8Nguxbb4m6SqINyhr4lGY2k0GjRRKM\/fhfzvRTj9tksrPBitq1WvA1LQ1vIo5L8Q\npts2gPrKCF1PfSSaNeEoOxyCwv2hKHgxwrxtAAebo8yDLeuz198UjdriXVAdjfRsB7bPEwnynw+5\nrX0lDNWF4agpikDxgTAUvrQLe\/MEOeR6MNHnniRUkL+\/PxsYGCgNCgraGxAQsD9DEmg8\/E3B\/aPf\nEvz2yHOC3333q8HvZKfstO\/cufMo6fd8cHBwHvmdRvrGkPH+n5k\/Uf8FoQP\/WgoXTEkAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288917491-1537.swf",
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

log.info("trant_egg.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
