//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Spice Plant";
var version = "1354586285";
var name_single = "Spice Plant";
var name_plural = "Spice Plants";
var article = "a";
var description = "The delectable Spice Plant. Seductively dangling with Allspice, the millability of this simple brown seed means that everyone's favorite varietal of spice can be found bounded in one shell if you look hard enough.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_spice", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_spice
	"conversation_offset_x"	: "0"	// defined by trant_spice
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

// global block from trant_spice
var fruit_class = 'all_spice';

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

function conversation_canoffer_one_tree_claims_to_know_the_unknowable_3(pc){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_3"
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 3,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "one_tree_claims_to_know_the_unknowable_2")){
			return true;
	}
	return false;
}

function conversation_run_one_tree_claims_to_know_the_unknowable_3(pc, msg, replay){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "one_tree_claims_to_know_the_unknowable_3";
	var conversation_title = "One Tree Claims To Know the Unknowable";
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 3,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['one_tree_claims_to_know_the_unknowable_3-0-2'] = {txt: "Oh yeah?", value: 'one_tree_claims_to_know_the_unknowable_3-0-2'};
		this.conversation_start(pc, "Spriggan said to me once, he said  ‘Spicy, my old friend…’ – because that’s what he called me…", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_3', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_3-0-2"){
		choices['1']['one_tree_claims_to_know_the_unknowable_3-1-2'] = {txt: "Go on?", value: 'one_tree_claims_to_know_the_unknowable_3-1-2'};
		this.conversation_reply(pc, msg, "What? What have you heard? It’s that Bubbling loon again, isn’t it? Well I’ll tell you something about him.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_3', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_3-1-2"){
		choices['2']['one_tree_claims_to_know_the_unknowable_3-2-2'] = {txt: "Is that true?", value: 'one_tree_claims_to_know_the_unknowable_3-2-2'};
		this.conversation_reply(pc, msg, "Those bubbles weren’t always empty. There was a time in the fifteenth age of Spriggan when the Sprigot males of a certain age, under cover of darkness, drained all the bubble juice from the bubble tree’s bubbles and turned it into a celebratory cocktail for Spriggantide, leaving them as empty and mentally aerated as you find that poor Bubbly fool today.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_3', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_3-2-2"){
		choices['3']['one_tree_claims_to_know_the_unknowable_3-3-2'] = {txt: "That much is true. I think…", value: 'one_tree_claims_to_know_the_unknowable_3-3-2'};
		this.conversation_reply(pc, msg, "So Spriggan told me. And why would he lie? He’s a giant, you know.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_3', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_3-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_one_tree_claims_to_know_the_unknowable_1(pc){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_1"
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 1,
		max_level: 4
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.conversations_has_completed(null, "confessions_of_a_spice_plant_2")) && (pc.conversations_has_completed(null, "the_bubble_conspiracies_2"))){
			return true;
	}
	return false;
}

function conversation_run_one_tree_claims_to_know_the_unknowable_1(pc, msg, replay){ // defined by conversation auto-builder for "one_tree_claims_to_know_the_unknowable_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "one_tree_claims_to_know_the_unknowable_1";
	var conversation_title = "One Tree Claims To Know the Unknowable";
	var chain = {
		id: "one_tree_claims_to_know_the_unknowable",
		level: 1,
		max_level: 4
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['one_tree_claims_to_know_the_unknowable_1-0-2'] = {txt: "Oh?", value: 'one_tree_claims_to_know_the_unknowable_1-0-2'};
		this.conversation_start(pc, "I hate to name-drop, but Spriggan was a good friend of mine, you know.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_1', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_1-0-2"){
		choices['1']['one_tree_claims_to_know_the_unknowable_1-1-2'] = {txt: "Is that so?", value: 'one_tree_claims_to_know_the_unknowable_1-1-2'};
		this.conversation_reply(pc, msg, "Absolutely. And he would come to me, and he would say “Spicy”, he would say, because that’s what he called me, ‘Spicy’ - “Spicy: of all the ages that this world has been through, the greatest always happen to be the Sprigannite ones. The other ages all have things to recommend them, of course, but it is only when I manage to bring a little stability to this shower of chaos” he’d say “…that things manage to move forward.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_1', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_1-1-2"){
		choices['2']['one_tree_claims_to_know_the_unknowable_1-2-2'] = {txt: "No, of course not.", value: 'one_tree_claims_to_know_the_unknowable_1-2-2'};
		this.conversation_reply(pc, msg, "Well, I can’t imagine he’d tell me that anyway. He’s a Giant, you know. Doesn’t have to say ANYTHING if he doesn’t want to. Or speak to anyone. Not that I’m name dropping…", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'one_tree_claims_to_know_the_unknowable_1', msg.choice);
	}

	if (msg.choice == "one_tree_claims_to_know_the_unknowable_1-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_confessions_of_a_spice_plant_1(pc){ // defined by conversation auto-builder for "confessions_of_a_spice_plant_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.stats.level >= 2) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
			return true;
	}
	return false;
}

function conversation_run_confessions_of_a_spice_plant_1(pc, msg, replay){ // defined by conversation auto-builder for "confessions_of_a_spice_plant_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "confessions_of_a_spice_plant_1";
	var conversation_title = "Confessions of a Spice Plant";
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
		choices['0']['confessions_of_a_spice_plant_1-0-2'] = {txt: "A bit?", value: 'confessions_of_a_spice_plant_1-0-2'};
		this.conversation_start(pc, "Now, I wouldn’t be bragging if I told you that I have a direct line to a giant, would it?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-0-2"){
		choices['1']['confessions_of_a_spice_plant_1-1-2'] = {txt: "And that would be?", value: 'confessions_of_a_spice_plant_1-1-2'};
		this.conversation_reply(pc, msg, "Well, I do, baby. I’m sometimes a little ginger in admitting this, but I’ve been standing here for almost as long as this whole world has existed, and you don’t do that without catching the eye of a couple of important people. Or one, specifically. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-1-2"){
		choices['2']['confessions_of_a_spice_plant_1-2-2'] = {txt: "You’re not posh?", value: 'confessions_of_a_spice_plant_1-2-2'};
		this.conversation_reply(pc, msg, "Spriggan, of course. Now, some might think that having the ear of a giant might be scary, but the fact is, it doesn’t make me any more or less than the next tree.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-2-2"){
		choices['3']['confessions_of_a_spice_plant_1-3-2'] = {txt: "But?", value: 'confessions_of_a_spice_plant_1-3-2'};
		this.conversation_reply(pc, msg, "No way. Just a regular, somewhat preferentially-treated old tree. But.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-3-2"){
		choices['4']['confessions_of_a_spice_plant_1-4-2'] = {txt: "Oh?", value: 'confessions_of_a_spice_plant_1-4-2'};
		this.conversation_reply(pc, msg, "Does mean I know a few secrets. Like this: the eleven giants may seem like a united front, but trust me, there are splits and there are secret allegiances of the most surprising kinds…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-4-2"){
		choices['5']['confessions_of_a_spice_plant_1-5-2'] = {txt: "But?", value: 'confessions_of_a_spice_plant_1-5-2'};
		this.conversation_reply(pc, msg, "I couldn’t possibly tell you, that just wouldn’t be sporty of me. Spriggan would never trust me again. But…", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-5-2"){
		choices['6']['confessions_of_a_spice_plant_1-6-2'] = {txt: "I'll try.", value: 'confessions_of_a_spice_plant_1-6-2'};
		this.conversation_reply(pc, msg, "Well, maybe another time. If you’re very, very nice to me.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_1', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_confessions_of_a_spice_plant_2(pc){ // defined by conversation auto-builder for "confessions_of_a_spice_plant_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "confessions_of_a_spice_plant_1")){
			return true;
	}
	return false;
}

function conversation_run_confessions_of_a_spice_plant_2(pc, msg, replay){ // defined by conversation auto-builder for "confessions_of_a_spice_plant_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "confessions_of_a_spice_plant_2";
	var conversation_title = "Confessions of a Spice Plant";
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
		choices['0']['confessions_of_a_spice_plant_2-0-2'] = {txt: "No?", value: 'confessions_of_a_spice_plant_2-0-2'};
		this.conversation_start(pc, "Say, have I told you about the time of the great consternation?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-0-2"){
		choices['1']['confessions_of_a_spice_plant_2-1-2'] = {txt: "Constipation?", value: 'confessions_of_a_spice_plant_2-1-2'};
		this.conversation_reply(pc, msg, "Ohhhh, my little one, come closer. My, what lovely hair you have. Now, what was I saying?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-1-2"){
		choices['2']['confessions_of_a_spice_plant_2-2-2'] = {txt: "And?", value: 'confessions_of_a_spice_plant_2-2-2'};
		this.conversation_reply(pc, msg, "Consternation, my naughty little dumpling. The point when the Giants, in the midst of imagining what the world would contain, could not decide which way up the world should go. Cosma was very lax about the idea of gravity, but Zille? Zille and Grendaline wouldn’t let the matter go. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-2-2"){
		choices['3']['confessions_of_a_spice_plant_2-3-2'] = {txt: "Tii?", value: 'confessions_of_a_spice_plant_2-3-2'};
		this.conversation_reply(pc, msg, "How did it end? Well, silence for several millennia, while everything just hung in midair, not knowing whether to go up, or down… Then Tii.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-3-2"){
		choices['4']['confessions_of_a_spice_plant_2-4-2'] = {txt: "With up being up and down being down?", value: 'confessions_of_a_spice_plant_2-4-2'};
		this.conversation_reply(pc, msg, "Couldn’t stand the disorderliness of it all. Fixed it to be one definite way, and that’s the way it’ll stay, for now.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-4-2"){
		choices['5']['confessions_of_a_spice_plant_2-5-2'] = {txt: "You mean…", value: 'confessions_of_a_spice_plant_2-5-2'};
		this.conversation_reply(pc, msg, "If that’s the way you see at it, sure…", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-5-2"){
		choices['6']['confessions_of_a_spice_plant_2-6-2'] = {txt: "I understand.", value: 'confessions_of_a_spice_plant_2-6-2'};
		this.conversation_reply(pc, msg, "I can’t tell you any more. It was straight from the mouth of Spriggan, and if he found out I’d been telling you? Well…", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-6-2"){
		choices['7']['confessions_of_a_spice_plant_2-7-2'] = {txt: "Not really.", value: 'confessions_of_a_spice_plant_2-7-2'};
		this.conversation_reply(pc, msg, "You do?", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'confessions_of_a_spice_plant_2', msg.choice);
	}

	if (msg.choice == "confessions_of_a_spice_plant_2-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"one_tree_claims_to_know_the_unknowable_3",
	"one_tree_claims_to_know_the_unknowable_1",
	"confessions_of_a_spice_plant_1",
	"confessions_of_a_spice_plant_2",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting a <a href=\"\/items\/300\/\" glitch=\"item|bean_spice\">Spice Plant Bean<\/a> in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a>."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/114\/\" glitch=\"item|all_spice\">Allspice<\/a>, which can be ground into other kinds of spice using the <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"Some hauls are bigger than others, lucky Glitch.",
		"Extra? Ah, how can I say no to you?",
		"A special little extra for my special little friend.",
	],
	"harvest_bonus_g4": [
		"This? Oh, just the allspice your man could smell like…",
		"No such thing as too much spice, don't you think?",
		"Why, you just can't get enough, can you?",
	],
	"harvest_bonus_g5": [
		"Extra-spicy for you, I think, eh?",
		"A little more of the hot stuff, hotstuff?",
		"I've pulled extra out of… well, *somewhere*, for you.",
	],
	"harvest_drop_g3": [
		"Can I interest you in this?",
		"A little something for nothing, sweet sweetness…",
	],
	"harvest_drop_g4": [
		"What's this? A gift? For you? Well, aren't I swell?",
		"Here, sweet sweetness: It matches your eyes…",
	],
	"harvest_drop_g5": [
		"A little something from your spicy sugar-tree.",
		"And I ask nothing in return. Well, not yet…",
		"I like to give you pretty things.",
	],
	"harvest_g1": [
		"Ooooo! Easy there, little grabbyhands…",
		"Careful what you're yanking, little friend.",
		"Well now. It's a little spice you're after, is it?",
		"My… you're a little handsy. Have we been introduced?",
		"Oooh! I say! Goosed by a Glitchling.",
	],
	"harvest_g2_g3": [
		"A little of the good stuff? Well, just for you…",
		"For you? But of course!",
		"Oh yes, you're packing some heat now.",
		"As they say, spice is the life of varie… that sounds wrong.",
		"Ooooh, you're a hungry little thing, aren't you?",
	],
	"harvest_g4_g5": [
		"Ahhh, spicy, spicy, spicy…",
		"My my, you can't get enough of ol' Spicy, can you?",
		"You can harvest me whenever you like, poppet.",
		"Here, my pretty. Spice up your life.",
		"As they say, spice is the spice of… no, that's not right.",
	],
	"pet_drop_lgt2": [
		"Take this, my pretty wee thing.",
		"Now, don't say I never give you anything…",
	],
	"pet_drop_lgt3": [
		"A little something, my sweet.",
		"Take it, no obligation… unless you feel so inclined…",
		"Well, it wouldn't be gentletreely to just take, take take.",
	],
	"pet_lgt1": [
		"Eh? What? How nice…",
		"My, my: such soft hands.",
		"Oh my! This is unexpectedly satisfying…",
		"Well I never...",
		"Nice job, kid, but could be spicer. Know whaddai mean?",
	],
	"pet_lgt2": [
		"I could get used to this.",
		"A little ginger, but improving all the time.",
		"I used to think you were scary. I like you now.",
		"Oh yes. This is the poshest petting I’ve had all day.",
		"I need some love like I’ve never needed love before.",
	],
	"pet_lgt3": [
		"Yeeaaaaah, Baby!",
		"Zig-a-zig-ahhhhhhh…",
		"Hot! HOT! Super-Spicy!!!",
		"Zoinks! Good petting. Do you offer extras?",
		"Ah, my little Glitch. You'll be rewarded for this.",
	],
	"pet_na": [
		"Well, well, little one, what a surprise",
		"I say…",
		"And good day to YOU, little one…",
		"Well now…",
		"And what would a nice little Glitch like you be doing hugging trees?",
	],
	"pet_na_failed": [
		"Stop right now, thank you very much.",
		"I say! Who do you think you are? No.",
		"Not tonight, my little petster wannabe.",
	],
	"revived_1st_time": [
		"Oh, that's … well, only a little better actually. Please. More?",
		"Perhaps if you had a friend? A little extra help they could tender?",
		"Argh, spices, fading. Essence, draining. More help? Yes?",
		"Be kind to old spicy. Revive me more. Twice more?",
	],
	"revived_2nd_time": [
		"Almost there, little precious. Just a gentle reviving touch more…",
		"Once more with the healing touch of revival. Someone? Anyone?",
		"I need just one little nudge more, and I will be fully revived.",
	],
	"revived_3rd_time": [
		"Yes {pc_label}! This is why you have ALWAYS been my favorite.",
		"Derooked by such a winsome little glitch, {pc_label}? You spoil me.",
		"Back to my magnificent spicy self, {pc_label}! And all thanks to you.",
	],
	"rooked": [
		"The rook! THE ROOK, I SAY! Help! For the love of Spriggan!",
		"I've been rooked! ME! Don't they know who I… ARRRGH! Help!",
		"My precious! Thank Spriggan you're here! Save me! SAVE M…",
		"Oh, I hoped you'd come! The rook! I've been rook! QUICK!",
		"ARGH! My precious spices! Turning to dust! Leaves! Quaking! HELP!",
	],
	"water_drop_lgt2": [
		"This? Why, just a little token of our esteem…",
		"A little thing for my sweet little thing",
	],
	"water_drop_lgt3": [
		"Oh, just a little trinket. From Spicy with love.",
		"Goodness, how generous of me.",
		"Too much? Pshaw. You're worth it, my water nymph.",
	],
	"water_lgt1": [
		"Now now, young'un, not too much water…",
		"I'd prefer a fine scotch, but if water is all you have…",
		"Petting? Watering? My my, we ARE attentive.",
		"Such a delicate pour you have, my sweet.",
		"You could pour slurry from a bucket and make it refreshing…",
	],
	"water_lgt2": [
		"My my, what a shapely can you have there.",
		"What vintage is this? It has a nutty finish.",
		"Ahhhhh, just the thing, little one.",
		"Mm, with this watering you are really spoiling us!",
		"You, the sunset, a watering can, who could ask for anything more?",
	],
	"water_lgt3": [
		"I've never felt so refreshed! What magic you weave!",
		"You're always welcome, winsome wandering waterer.",
		"Come back and see me some time.",
		"Ahh, the nectar of the Giants.",
		"A good watering touches places other cans cannot reach.",
	],
	"water_na": [
		"Oh! No, carry on, I like it.",
		"Goodness, sneak up on an old tree, why don't you?",
		"Water? Well, I suppose I might partake…",
		"Well well! That's a pleasant surprise.",
		"Ahhhh, you flatter me with this sprinkling.",
	],
	"water_na_failed": [
		"Thanks, but I'm wet enough already.",
		"I like to think of myself as dry. Like a good martini.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-101,"y":-170,"w":208,"h":173},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJNElEQVR42u2Ye2xT1x3H3bKOli4Q\naArEvo9z7tNxSEIwIw8gCXk7ceJ3bMfxM46dxCQEaBirJqFK1VSkCbY\/pm2tpk6atiF1SJ1WTbBW\nQ1o1QNom0WmqxipBJ23TaOnK6NohRjj7\/Y6vEdrYhFSSPyau9NO1j+895\/P7\/h7nJDbbw+vh9d8v\nz4YNa4MOhxBwOJoSitKTlOW6cUlan3BoQkowHBGbbdVK8jw6S8jmOVFUc6JozxDy+Bgh\/ighx6Oy\nfCalqtfzmv7jgqovFjX9OFpW0XuTtYo0p2lrZw1jV9EwmjKKokcE4YlPRYIT+DdvJjFZbk8Q0jrh\noE2TijIMix8t6Pr38pp2LCUSX5zSH8YJ+ec4pSyjaGxKN1jRMNmsabK9TifLq\/rFLFW\/lVfVgwB3\nuaiZZ1KK+oMJSseiVOyfJGQwvnHjJn81qU6Lmnq\/fI+EBKExLstfmSD0QkZRfzWl6T8Fdd7LqTpD\ny2sGA6i3wrL8xzglLKtqLCZRlgbISfgNf58BULynqcbhQU3+7gRVGDh2eUJR3ptStA+nqXp0TjOe\nndONl0u63pesrZUwTe5J1r9p05MIF5WkwwlK\/4ALgwpsWjdZQceFdQ4wCfcxmbCgJDF4DtQy2SQ8\nl1X1O4BlR3QOh78haIqqDMBYDJ3CcbBpeLYE888bxq1Z3bgEY1+f181DBUKcd8BQ5ogkhcdk+SAs\n+EpCpu+kYKKipQIaB1DKELgoAoZkiS9YgpAWdcOCN1gSxkB5VoDP+GzOegcdCsM7SUwJArCyAgIY\nrMANHMI0AVHmTef7kEaHOZzbZnsMwIZilL4D0t\/AMCEQKjZjOnleoRJTMIaK4uJoMUJZmMgsQgh8\nV7kiOUtBhI9KBFQrj2cs8wkSCwFkDp7fh84DGBqqOIPOgMpZyiE\/mVDoK14It21UEDR46cUYIVch\ngblSGNYiyF5CQA1zR+MKZVQVc4\/FEU6SuSJ+MISdAEWSYAgSEmX+DIa0Ape1VIe8hXGFQ1UAK5Co\n5BREKQXzjBP6p7gkFW0jDkdrQBR\/hxMiDCqXvasiMay4OEKmARBDzz8rfBIOh3mIyZ8gCh+PooIA\ngsqmLcAkwIbAKTSETFoOIdwkpg4olwPDfExSZQmieTEBaWeD3HOHJemXuFDOAqwkOoa1YIUWHUha\ncFNWleI4WkKhPPETVOFQqHJQlFgEQPgYLTuDinPDPIT8i4qwJsBxQKLxnERxsHXBuz\/32e2izeeQ\nUn5BuoIJD2HmYam0C16VYKgm9C5LvXKhVCoVKxoB8f0I5GQUQMcoFpDMx9AwHcpWfgZ\/R4djMuV5\nig5k+F3hDKDyNUi7r\/mrq6sRMOwXpcs4IewM4GnZ4wpgmodH4WFDlZNWXiEcKolhRyi\/JCLMjTEi\n30IALKCKBQAMLXQXYLnAIFcth\/AetcZ9gvi+124\/xKt4FLYt8OwoPHwDH4hxSMpDNQGGIYqSckvB\nl2NW8ldaDoYzrBHmo+L5IJFOwzwfhqnMRgSB+UXxdQjpl2H+VyHvfgK\/neQmy+eCsng7RETuDBrC\n+jEtCLkChbs4bLe3l7c12NBD8CUiS6+FiHQR8wN7VSVUeI9QciOkSNfDivwPmHwJgccxHLScV34X\neL1NfiPgJmcmPq9eT+\/QWLiBXvcrQmh43br12Pwx12ELbUALCEJn1EX+EtKkH8Faf4c5P4AWdMNr\nF04FRTEK7WXNf5xKIMTtQdje4H4NvP0zeoSLAxiLN9KbyVb1k4RbvRlxktsRpfxbgEhX\/EQ46XeT\nS4E28kFwF\/1oss9YmuyDSuzSz0Z2yPReO1a+yyFM7tEvBOppU1AQxkOiGB8RpOeGN9p7\/9cevMrv\ncBhhQQhCSOZAzRMQolMhXX4t26F9e9rjPDc9aF6DiVlih8oijRD2reR6oIWcD7TTK\/52SPoulU17\noAEPOlmyR385slt7+l4LzXnNxfygcezuk5K3qqqmzWa7v1MOVk\/EbjfxnOdzCg35fpnCwt1zI+ZL\npRHn1eIAtJgeqGyAjXaoNwFwCQFz\/QabHYZTzICT5Qb0UzNePbu3nzbNeTQX2syw6p7xmtNFj\/NS\nskPtfqCHwSNdts8UPJpaGqlbKHnr3p711rHikJNl+2Br64CC6oaNfwgOFaDezHAdW\/DX\/3Uh4Pr9\n\/GjdLxZGXW\/Og82N1J3LD5rvprr1N0bNmqplObXme+imBV\/dCVgQgJws3atzw88AzmaGOBw7GNzC\n9vnqGT6HtnfExbL9JhvvUF+NtCkNy3myfuSZ4JZv7geIGQhnwePkd1Dnjh0I1HMVUeGpQQy3yVI9\nxkdjncqxyHa7uexn\/8Njjd9YDG9h8z5UBqBAIVQPDQFLqBZU8jiEPdKh\/ja6W3ku3CoHg265dtnh\njrhsn312rPElDCEqtQ8gF3xlQFQNATGcGcjNcIf6s0C73DbgEja44L0V+cvphaRbOjLefPKZYAOA\nlXMMoYpQIHkIJaqHocWwjnXQktf9b013ua\/jBfe2L8W3vr4f1Nvvd3FIDDMWRsFTzjtoI2wSWk1s\nl5bsgr\/+VhTwq8WWvi9GGs8vWKE9GKzn4eUtB6oUwzs9zBs1C++iB\/sbNz25ooDPp7b7FkMNF1Cx\n\/ZZhc0Yw7I0YcgSF4mDBneS4fyupXjG4OY9t9eFwwwuHwg0f8+odKfe4EhTHLBi2lEyvySs4CTtN\naJdyYXSnaF8xwAPB+j2g3Jug1O1cf3nXQDAM8T7easphRksBaHi3civQSuYjbZ\/yPwn3c5WG9BYA\nOD3rdS5hc0ZADC02aVQsDZaBMRxP9xoACFtgJ4aZXu1x1hjY4JcFrK+5xh5oldLxLvX70HjPju\/R\nz010G+9CS7mJoBkE6yurVgFEuCjAwUGCxTu12+Nd2lJop\/zd\/ubaDpjysQfFhv+ZWgsmgOH21AzW\n7nRUpWMd5GTBY17NDhgfB3bSyx639HbvVsdvepodb8H3vyW6tVveFvnXtdVPHNA2V33BJVYfaCLr\nC9CpndZ8NWCrHwQkdv91YBvBaBNZOxDrpC8mu9Wzg27Hd8hTa2ZgPIAnNLAgWKj68VW57ebTz3tb\npNP92xwn1letHoHxVrB6MBkMz4jLkpOoKDZd7GufA1tjfV9tKY1O4F77lPX90Yf\/QX14\/T9c\/wIC\nmJMLjxQpbwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288917509-7126.swf",
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

log.info("trant_spice.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
