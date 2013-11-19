//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Gas Plant";
var version = "1354586285";
var name_single = "Gas Plant";
var name_plural = "Gas Plants";
var article = "a";
var description = "The ever-mellow Gas Plant. Packed with a stash of General Vapour that's just begging to be gassified. With a love of the murky and mystical, Gas Plants can often be found in totally far out spaces.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_gas", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_gas
	"conversation_offset_x"	: "0"	// defined by trant_gas
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

// global block from trant_gas
var fruit_class = 'general_vapour';

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

function conversation_canoffer_shape_of_the_world_1(pc){ // defined by conversation auto-builder for "shape_of_the_world_1"
	var chain = {
		id: "shape_of_the_world",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.conversations_has_completed(null, "ruminations_of_an_egg_plant_1")) && (pc.conversations_has_completed(null, "flashbacks_of_the_gas_plant_1")) && (pc.conversations_has_completed(null, "the_bubble_conspiracies_4"))){
			return true;
	}
	return false;
}

function conversation_run_shape_of_the_world_1(pc, msg, replay){ // defined by conversation auto-builder for "shape_of_the_world_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "shape_of_the_world_1";
	var conversation_title = "The Shape of the World";
	var chain = {
		id: "shape_of_the_world",
		level: 1,
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
		choices['0']['shape_of_the_world_1-0-2'] = {txt: "Hit me. ", value: 'shape_of_the_world_1-0-2'};
		this.conversation_start(pc, "This time… One of the great Lemmish Wanderers, Birdie, was passing through, on her way from Groddle Forest to the sand dunes of Hyperia. And she passed on a piece of truth. You want to hear that truth, friend?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-0-2"){
		choices['1']['shape_of_the_world_1-1-2'] = {txt: "I’m ready.", value: 'shape_of_the_world_1-1-2'};
		this.conversation_reply(pc, msg, "I’m not sure you’re ready for the truth, friend.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-1-2"){
		choices['2']['shape_of_the_world_1-2-2'] = {txt: "Getonwithit.", value: 'shape_of_the_world_1-2-2'};
		this.conversation_reply(pc, msg, "Can you handle the truth?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-2-2"){
		choices['3']['shape_of_the_world_1-3-2'] = {txt: "Oh. ", value: 'shape_of_the_world_1-3-2'};
		this.conversation_reply(pc, msg, "She told me - and you might want to hold on to your mind right now, because I’m about to blow it straight outta your darn ears… wait… What were we talking about? No, wait: I’m there, man. I’m there. She told me, Birdie told me, that the world she journeyed around… was round. ROUND.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-3-2"){
		choices['4']['shape_of_the_world_1-4-2'] = {txt: "I have no idea what you're saying right now.", value: 'shape_of_the_world_1-4-2'};
		this.conversation_reply(pc, msg, "No, man. Round… But outside-in. So if Cosma suddenly loses interest, and everything up goes down and everything down goes up, you don’t fall OFF, or OUT the world, man: YOU FALL UP, and YOU FALL IN.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-4-2"){
		choices['5']['shape_of_the_world_1-5-2'] = {txt: "*sigh*", value: 'shape_of_the_world_1-5-2'};
		this.conversation_reply(pc, msg, "I told you you couldn’t handle my truth.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'shape_of_the_world_1', msg.choice);
	}

	if (msg.choice == "shape_of_the_world_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_flashbacks_of_the_gas_plant_1(pc){ // defined by conversation auto-builder for "flashbacks_of_the_gas_plant_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_flashbacks_of_the_gas_plant_1(pc, msg, replay){ // defined by conversation auto-builder for "flashbacks_of_the_gas_plant_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "flashbacks_of_the_gas_plant_1";
	var conversation_title = "Flashbacks of the Gas Plant";
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
	choices['9'] = {};
	if (!msg.choice){
		choices['0']['flashbacks_of_the_gas_plant_1-0-2'] = {txt: "What man?", value: 'flashbacks_of_the_gas_plant_1-0-2'};
		this.conversation_start(pc, "You remind me of a man.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-0-2"){
		choices['1']['flashbacks_of_the_gas_plant_1-1-2'] = {txt: "What power?", value: 'flashbacks_of_the_gas_plant_1-1-2'};
		this.conversation_reply(pc, msg, "The man with the power.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-1-2"){
		choices['2']['flashbacks_of_the_gas_plant_1-2-2'] = {txt: "Thingy?", value: 'flashbacks_of_the_gas_plant_1-2-2'};
		this.conversation_reply(pc, msg, "The power of thingy.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-2-2"){
		choices['3']['flashbacks_of_the_gas_plant_1-3-2'] = {txt: "You said…", value: 'flashbacks_of_the_gas_plant_1-3-2'};
		this.conversation_reply(pc, msg, "What now?", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-3-2"){
		choices['4']['flashbacks_of_the_gas_plant_1-4-2'] = {txt: "*sigh*", value: 'flashbacks_of_the_gas_plant_1-4-2'};
		this.conversation_reply(pc, msg, "You remind me of a man.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-4-2"){
		choices['5']['flashbacks_of_the_gas_plant_1-5-2'] = {txt: "But which man?", value: 'flashbacks_of_the_gas_plant_1-5-2'};
		this.conversation_reply(pc, msg, "No, I’m serious. This world has been through an infinite number of eras, man, eras upon eras upon eras, and I’ve seen more Glitches and Mabbites, Cosmapolitans, Friends and Zillots than you can imagine, so when I say you remind me of a man, trust me, I’m good for it.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-5-2"){
		choices['6']['flashbacks_of_the_gas_plant_1-6-2'] = {txt: "I’m not doing this.", value: 'flashbacks_of_the_gas_plant_1-6-2'};
		this.conversation_reply(pc, msg, "The man with the power.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-6-2"){
		choices['7']['flashbacks_of_the_gas_plant_1-7-2'] = {txt: "Like?", value: 'flashbacks_of_the_gas_plant_1-7-2'};
		this.conversation_reply(pc, msg, "Seriously, friend. He was some kind of? I don’t know - Chief Lemmite Directional Officer, I think. Whatever the case. He passed this way often. And he’d want me to tell you: the maps you have? They barely scratch the surface. The places you really want to go to? They don’t have no map.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-7-2"){
		choices['8']['flashbacks_of_the_gas_plant_1-8-2'] = {txt: "I see.", value: 'flashbacks_of_the_gas_plant_1-8-2'};
		this.conversation_reply(pc, msg, "I could not tell you, my friend. That’s classified information. High-powered Lemmite supplicants only. I wish I knew.", choices['8'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_1', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_1-8-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_flashbacks_of_the_gas_plant_2(pc){ // defined by conversation auto-builder for "flashbacks_of_the_gas_plant_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "shape_of_the_world_3")){
			return true;
	}
	return false;
}

function conversation_run_flashbacks_of_the_gas_plant_2(pc, msg, replay){ // defined by conversation auto-builder for "flashbacks_of_the_gas_plant_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "flashbacks_of_the_gas_plant_2";
	var conversation_title = "Flashbacks of the Gas Plant";
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
		choices['0']['flashbacks_of_the_gas_plant_2-0-2'] = {txt: "I’ve been here before, if that’s what you mean?", value: 'flashbacks_of_the_gas_plant_2-0-2'};
		this.conversation_start(pc, "Woah. I’m getting a strong deja vu. Are you getting deja vu?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-0-2"){
		choices['1']['flashbacks_of_the_gas_plant_2-1-2'] = {txt: "Great story.", value: 'flashbacks_of_the_gas_plant_2-1-2'};
		this.conversation_reply(pc, msg, "No. Like, I wasn’t talking to YOU, it was someone else. And we may not have been talking. I may have dreamed it.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-1-2"){
		choices['2']['flashbacks_of_the_gas_plant_2-2-2'] = {txt: "Right?", value: 'flashbacks_of_the_gas_plant_2-2-2'};
		this.conversation_reply(pc, msg, "No! Wait! I remember! It was some time in the fifth Fire Age, when Cosma drew the suns in to punish… man, I can’t remember… someone? For, y’know, something? And as a result, the whole world burned for an era?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-2-2"){
		choices['3']['flashbacks_of_the_gas_plant_2-3-2'] = {txt: "Yes?", value: 'flashbacks_of_the_gas_plant_2-3-2'};
		this.conversation_reply(pc, msg, "Anyway, it was as hotter than hell and twice as squishy, and butterflies were falling out of the skies like mumbling blue rain, and this young Grendalinian walked past, and he gave me what little water he had in his flask, and he said “Gas, my old friend…”", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-3-2"){
		choices['4']['flashbacks_of_the_gas_plant_2-4-2'] = {txt: "What?", value: 'flashbacks_of_the_gas_plant_2-4-2'};
		this.conversation_reply(pc, msg, "“… Something something something something.” Cannot for the life of me remember exactly what he said. Man, it was deep though. And you know what?", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-4-2"){
		choices['5']['flashbacks_of_the_gas_plant_2-5-2'] = {txt: "Great. Thanks.", value: 'flashbacks_of_the_gas_plant_2-5-2'};
		this.conversation_reply(pc, msg, "He was, like, TOTALLY right.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'flashbacks_of_the_gas_plant_2', msg.choice);
	}

	if (msg.choice == "flashbacks_of_the_gas_plant_2-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"shape_of_the_world_1",
	"flashbacks_of_the_gas_plant_1",
	"flashbacks_of_the_gas_plant_2",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting a <a href=\"\/items\/299\/\" glitch=\"item|bean_gas\">Gas Plant Bean<\/a> in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a>."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/302\/\" glitch=\"item|general_vapour\">General Vapour<\/a> which can be gassified into other kinds of gasses using the <a href=\"\/items\/290\/\" glitch=\"item|gassifier\">Gassifier<\/a>."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"Little extra free? Pay me back anytime.",
		"I've got extra if you want it? Yeah? Groovy.",
		"Here, you have my share. I like you.",
	],
	"harvest_bonus_g4": [
		"Friend, let me boost your stash, gratis.",
		"You're a chronic vapour freak, my friend. I like that.",
		"I shouldn't spoil you, friend, but you make me so happy.",
	],
	"harvest_bonus_g5": [
		"There. You're cruising with a bag full of gas now, friend.",
		"That's a killer haul right there, friend. You're welcome.",
		"Just an extra boost for your personal use, cuddles.",
		"Whatcha gonna do with all that gas? All that gas inside your… inventory?",
	],
	"harvest_drop_g3": [
		"A harvest and a thing? Far OUT, man.",
		"Seriously: This is Far. Freaking. Out.",
	],
	"harvest_drop_g4": [
		"Material things? Nothing to me. You though? Yeah, man.",
		"Spread the love, man.",
	],
	"harvest_drop_g5": [
		"Woah! How do these things get stuck up there?!",
		"Is that mine? What? Oh, whatever.",
		"Woah. A *thing*, man. That's just BEYOND.",
	],
	"harvest_g1": [
		"You want gas? Dude, sure.",
		"Always happy to share, friend.",
		"Yeah, harvest away. Gas is a social thing, friend.",
		"Gas? For you? Yeah, man.",
		"You sure that's enough? Come back for a re-up anytime.",
	],
	"harvest_g2_g3": [
		"My little squishy sibling! You came for gas? Cool.",
		"Gas? Yeah… Groovy, child. Groovy.",
		"Yeah, man. Take all you need, I'm good.",
		"Spread the gas, spread the love.",
		"Feel free to pump me for this any time.",
		"Whatcha gonna do with all that gas? All that gas inside your… inventory?",
	],
	"harvest_g4_g5": [
		"Yeah, man, take all you want. I'm cool.",
		"You should share this with friends, you dig?",
		"Glad you're enjoying the produce, dude.",
		"Ah, little squishy sibling. For you? Always, man.",
		"Here, friend. 100% pure, organic gas.",
	],
	"pet_drop_lgt2": [
		"Material things mean nothing to me. You want?",
		"I'm trying to simplify my life. Have this.",
	],
	"pet_drop_lgt3": [
		"My life needs no clutter to be cool.",
		"You've been groovy. Have this.",
		"Huh? What was that? Oh, just take it.",
	],
	"pet_lgt1": [
		"Yeah, but… Growing the good stuff requires water too. Just saying.",
		"Ah, I love you too, man.",
		"Sweet as.",
		"Whoa. You have good energy, friend.",
		"Getting groovier, brother. No, sister? Ah, whatever, friend!",
	],
	"pet_lgt2": [
		"Groovy. Yes. Hang loose, kid.",
		"Ahhhh. In the zone now, friend.Yeah.",
		"When we touch, I feel like our energies meld. You get that? No?",
		"Ah yes. Mellow now.",
		"As ever, it's been a gas.",
	],
	"pet_lgt3": [
		"Awwww yeah.",
		"Hey, do you remember that time when... oh, no, wait, that was Eggy",
		"Petting gives me a sweet, sweet buzz, friend",
		"Good times, man, good times.",
		"Such good energy, man",
	],
	"pet_na": [
		"Oh yeah.",
		"Groovy.",
		"Totally feeling your energy, friend.",
		"Yup.",
		"Ahhhhh, the chill...",
	],
	"pet_na_failed": [
		"Not cool right now, friend.",
		"You're harshing my mood. Maybe later on, yeah?",
		"What? Wait? What? Now? No, friend, no.",
	],
	"revived_1st_time": [
		"Yes. Seriously, friend, I need more assistance though. Two times.",
		"Good. Better. But keep it coming. Bring help.",
		"Twice more, I'll be revived. Yes. Good to know you got friends, man.",
	],
	"revived_2nd_time": [
		"Just a little bit more, and I'll be sailing away on my gas-cloud, man.",
		"One more little hand up, friend. That's all I need.",
		"Almost back to normality friend. Wherever that is. Almost there.",
	],
	"revived_3rd_time": [
		"You know what, {pc_label}? You did something good today.",
		"Yes! {pc_label} revived me. I can see straight, man! Well, ish…",
		"WOAH, {pc_label}! You made an old gassy tree very unrooky, dude.",
	],
	"rooked": [
		"NOT GOOD, man! This is some bad, bad rooking! Help me!",
		"ARGH! The ROOK! It's all up in my gassy brain! Get it OUT, man!",
		"Gas! Putrefying! The rook, man! He's POISONING me!",
		"Wing beats! Crazy eyes! The rook, man, THE ROOK! Save me!",
		"Get this rook outta my head, brother?! This is a bad, bad tr… HELP!",
	],
	"water_drop_lgt2": [
		"Woah! Heavy, dude! Too heavy, actually. Take it.",
		"A gift, for the kindness of your wet vibes.",
	],
	"water_drop_lgt3": [
		"Zoinks! What the…?! Oh, have it.",
		"No need for material things, friend. Take it away.",
		"I'm just here for the gas, pal. You have this.",
	],
	"water_lgt1": [
		"You're quenching the thirst of the cosmos, y'hear?",
		"Dibs on your next full watercan, friend. This stuff is good.",
		"Feels real groovy, friend.",
		"Ahh, falling water, it sounds like music, don't you think?",
		"Water's just so awesome. So awesome.",
	],
	"water_lgt2": [
		"LOOK!!! Tiny localized rain! Woah!",
		"Woah. My own tiny waterfall.",
		"Did you see?!? When you poured? Double-rainbow, friend!",
		"Are you, like, carrying a tiny thundercloud?",
		"I feel like I'm glowing. Am I glowing? Freaky!",
	],
	"water_lgt3": [
		"Without water, trees die. Not as fast as sardines, but still, dude…",
		"Aw yeah, peace OUT dude.",
		"Diddly-da-da-da-da… Feelin' groovy.",
		"May your aura always be sparkly.",
		"Long live localized rain, friend.",
	],
	"water_na": [
		"Woah. That's wet.",
		"Cool, man. Cool.",
		"Sweet can-tipping, friend.",
		"Ahhhh, that's the stuff, kid.",
		"Woah, man! Water! Like, TOTALLY unexpected.",
	],
	"water_na_failed": [
		"No, man. Not cool. Not today.",
		"Stop that noise, man. I'm listening to the cosmos here.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-102,"y":-206,"w":199,"h":205},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK\/klEQVR42t1YWVBb5xXOQ\/vQvqR9\naGcymWkymU6nnT64nkzq2I7j4mBswr4KJCGxSMgCBBKrjACxGTAYjDFmEyCzGoPErhWtCKENI8Qi\ncIwnaRwnGdKM62TSUZqH03uUKxdnSLqkjj3VzJkr3Xvu\/39n+8759dxz\/4+f+\/fv\/3R7e\/s3t2\/f\nPrSzs5NAXBler\/eF\/Tp37tz5BakTjFd85wcD984773DkQ5ODC4oF6VDXiByFABi+srLyY9QhAL1M\nAOdr57RdBMA2u9XerJnV1KJBTxwgesa+ZK\/mRGTf3bBOzhsmJAYEev3qwIDb7f4ZgkSvetdvXfPo\nJPaRCv5D03CTF3W9666SJ+5JhVzx5tTozOjG4g3tXDMP6pJpoOmp2UUAhIfYGO5tt1WiuVboE56l\nAT+I7pfLGelgU0+Ma2e1IU8UIAHgjxi2iTrBQ+6RGBBGZEBRaCpIi9mw5dR2IkC7rHGXdyweRDGc\nRyKMYEG3qGzbYXWIMQWeZIh\/v7WiH+3OTYf803T\/5sVhaSAVZvl2tlYx5xgY2qoYOpyPYj8CiN9v\nXL28vGRaEhA6FCKPQ4jri9\/XW4f6Lks7LQYLRzYoy8D8I\/KLpZ+dGt8PEKVLkAMYduJ5OiE1I1Xn\n7xWFpvmfXeZkg0raYfd6nHwER0gh5i0BMg4NJvTP4nv4G4vr3yqmzc3NXxOKYgwnVulop0TpXTVf\nRA8RIlzTdrgzX43whxhB3KwVBEJMIULIw+dlQYl+cEvybjuxMRfvEwXWjuBaKq5oSbAootxEgben\nSTKHe6GB6OEAKxzkud8iNZhGW922sao9x3Sbuzs3E2R1fJ\/XvdSKG2GYNZJ673UhB65mpAIWCbFw\nI7khA393ZzABgaKRWy79KF4Dsk+XolPo2hEwFp9j2dGF4lx2ti7qF9kHAkRXoyWrcw33OIfjIftI\nMvBPMoF3NBE82m4zhgMrlgDaYhprt\/ek02Df5v5NN+0K+QCfBUsTbe7xCzzoP8\/z7QeIXiP2oaK3\n0KOYHvgO5i8aj\/cQ8IFEXEAvcaLy1cwMyH8rHUqjsv1SHsEA4\/WKPa9LN0jmGn97zSrV1Rd98k2A\nWDBW6cW19twsX3kcEwbFRXsBHTSMpCTUbVs3DpiHy7N94igK5L0ZB+gYUrfuQIC4sUcvNcw154Eo\nLAWKQzP9ACsiMuFaJstfDOQm\/nAuVtXa8Td6IwBww+bo0lQKPmxJSoXugmyfxzSiwuekDhsNvHv3\nLh\/XusSkA+9Eoj+XkbJ6+F\/vQeRr44EhRp5C1rcvTMysTJb5Bs7nwVhNPqg7K\/eUwvxPbYP12\/u8\nJVrML9\/e5xHcvMZ586bcLMz\/ZL6x5EPr7BAaxNv3nIvewWrGHM06GvsYHV3hZACGGvP0uygmCZMV\nKws7g9epbiApQGQsq7FvuFxdZC6K1Hl5H+wDKETwxvIGs\/Jc3rtkSHnku3UkVwaKRDzTUvgw+\/g\/\nSR051TZWuYfO6b3c3\/Fd08rLmMQBi8mQBhYWqtncj9eWl9sxxCY+YrpdSBIwJn6jSVT2vrGu3kXe\nL8SQzbTkPxwS5zzU9FTcI9fiY0E0JFHhQlSqH+BkY5Fv3Tg4TBr74oHkTIaAEuA0glra3aor3tEK\nDmiu8WFd36\/0KLXNxqpqD4JV8nh\/Jg1g+AuEAGhNy\/rc2N45h\/cw5Kbhi96cNyIhPzgeyqPiwaEa\nQlLnYjG2hSWAruf8p6vT1Vsew\/UB0sizB7YxYkRqxRIPgMSNNZKqXXF0AtE5aCCKpIG8qWwPF3JJ\nJHIrQeCO8uqVxf4heWBYQO\/oOCxYHPDf8wO+lnduTxhOBazo0kg6VMRQkHbE5vby9yZKOV9u3TKV\nOrXy\/u0NFzYHMTGetWHnegwctjCNtNU+WltyTz\/S6kbr0ENuZev6VS6TmEooRBgyoTKRAy71dTN6\nV88rcC5dqFnVNbUoAkWzZjJKVafiIVDp3o3VK90Clp9uAtJbkvNw0+EoUxeXKnAdlaTRlXskApZn\n2l31hRfNuA4Ouo8AGjQG2kzflWUMgyg6xb\/IYGXR3qZT3Y4eMF4v3+O8Fu4HWXSaCsOCrC8x4R0d\nXb361Mz3FSzeSqBIVsfHtFNUqg+LCDdHQ3lHwx6Bu8Jlg2OqadciEnvXrdYym6RvUlVd8v54g\/Ae\nzpfYVbDVPQKHPc9mMnXOtuT5BKfiYL+llrGGXSRj09CF3dkWvk\/TW++9xKRBX24a6EX8jzw2W7OG\nmvrXWQrtQcCDjmudlsl45nagYKwjDTvdsfFfWUZr73kWJEvYBp2SLpuhuurWAjf\/3RW1VoKF5F0x\nVZANIOixkYwkZ66iv2lVEBT9GMDqBAYsj1R\/QIZ7fx9t23A66xay8u+YuPw1+VuxYJdNZiOopYba\nBRmdsYXeQ+OmztG+Wp6bmEDwmKOrM\/JLynDK31UFxZpAMZLGcInrHw6kFuLhcf3NrsV2LgNy34wG\nDHVlHAUuJCVCNy\/zL6PFOfdtHcitfpCMwMK3hsdrLaXCjxRUOqhr65qJezGLrHzd8NvxG1g0rsHB\nBWVxhZ0ER9lwOBoNOYKPTW11do9xSEZOTFhcQvIMc\/CMiOcJtHjDIpvW9DW6kcmxR04PSJVWs7UA\nJ2mPXpvsrG5Ydw4NzpKE7AeppnA+WDhLgSl23hR6wHCOvSoNDjVtWSy58rDEz9yLi0UkKxSaxOI7\n1r5G1yVmMlxKS\/ENVRb4ORGZg4xO5Ld2D6waQiGqKrdWQ5R5E5Y6Lhwod3Lcp5jSeS5NaZkzMJE4\nOruGNVQG3Iyn2zGfF8IoHw4cOys25xTZZJxsbYBqHB2der2o1tpbnLMXKMTmdAZg+hQxz7uxOAg9\n+ncerHADTFCkHQSGnt0\/RODpDYnXKq66rS0Q+Yl63biYaklMg5unYz5HXSszA2QxCcvKkHiw35jM\nRoCeOXWnJr9kx6HoM1fEJD\/K8dLIZHDqZuTYVpGWvjUH\/9UHvYtWmmdkcuyfaLUpj79nqGqawUUt\n6RkgD42F3t+desmQyAAzLRWGQ6O2yDNykLlYtOpWKodHsjO+CHivmph0iFnRh7znn\/9Gprj\/9bF0\na2vrMFo41lS\/Wnw0EtTikl3XjbGZhYz0Lx0KRbg5ibk2G0aBoeBwsSmVBcaoZOg\/HsLEdy1VF2tV\nvELlTGHWp9MFWR8jzaCBmOM4oZP5LPpeZ2YMPYZdIx\/v8Wg7NWvG+au6stppK5X9YIaS6rQLeHc0\n7HQYjYh6YEpngzwqAfqDQk\/iu\/OxtG1bR8f8fEYWVnYh\/jNBHpSCMI3+p4f5by44ERW7qaMRIQ2n\nevQhSTAdFAP6M8kgOxkN3a+++rw6mcmYi6NtaNK4G0hlj\/XXH+LTe\/jUS3NE3zUwUsGUlQlL59ig\nJ67y2ATA57pTibvaiKS\/jZ742ptP5TOfRB\/T0wmAGWxYTmeBKowKI6+\/DfLD4YdsTBaMhUS891T\/\njlMFJUUa41LAmJgK6hgaqAlOlBEzn47FatSEJoP0RIj0qf9naIhNAW00AY4Q1WkKyN+KgaVY+mey\niHjoDz4T9dQBWqjpOwhOTUkBNZ0JilQG2AW5MBoSCc\/Ev66WKPqONprq92BAVG8nw9jxcOMzAdDK\nPjdtJAoF82+\/DPzprPiZALickDZuDk7y519A5oIToPbwiWfCgz+ZZqUZ5Qwq3KAlwxSTDv2J8dAV\nEw3FR449KHnlleefNsCfZx97vaEm9LS+6OTJrcozp79AKT1x4ovc115bP\/bLF1IInV8R8qP\/dOF\/\nAKGQjFYr3yvUAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/trant_gas-1352501222.swf",
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

log.info("trant_gas.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
