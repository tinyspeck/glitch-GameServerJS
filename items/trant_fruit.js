//#include include/trants.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Fruit Tree";
var version = "1354586285";
var name_single = "Fruit Tree";
var name_plural = "Fruit Trees";
var article = "a";
var description = "The glorious Fruit Tree. Thick with tasty cherries ripe to be converted into other delicious fruits, these venerable plants may not be chatty, but they're indispensable for fine edibles and quaffables of all sorts.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_fruit", "trant_base"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "0",	// defined by trant_fruit
	"conversation_offset_x"	: "0"	// defined by trant_fruit
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

// global block from trant_fruit
var fruit_class = 'cherry';

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

function conversation_canoffer_surfeit_of_cherries_1(pc){ // defined by conversation auto-builder for "surfeit_of_cherries_1"
	var chain = {
		id: "surfeit_of_cherries",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.conversations_has_completed(null, "piggy_tales_3")) && (pc.conversations_has_completed(null, "brief_thoughts_of_the_fruit_tree_2"))){
			return true;
	}
	return false;
}

function conversation_run_surfeit_of_cherries_1(pc, msg, replay){ // defined by conversation auto-builder for "surfeit_of_cherries_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "surfeit_of_cherries_1";
	var conversation_title = "The Surfeit of Cherries";
	var chain = {
		id: "surfeit_of_cherries",
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
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['surfeit_of_cherries_1-0-2'] = {txt: "'Sup.", value: 'surfeit_of_cherries_1-0-2'};
		this.conversation_start(pc, "Hey.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-0-2"){
		choices['1']['surfeit_of_cherries_1-1-2'] = {txt: "Yeah?", value: 'surfeit_of_cherries_1-1-2'};
		this.conversation_reply(pc, msg, "Lemons?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-1-2"){
		choices['2']['surfeit_of_cherries_1-2-2'] = {txt: "What?", value: 'surfeit_of_cherries_1-2-2'};
		this.conversation_reply(pc, msg, "Pot.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-2-2"){
		choices['3']['surfeit_of_cherries_1-3-2'] = {txt: "Ohhhhhh…kay?", value: 'surfeit_of_cherries_1-3-2'};
		this.conversation_reply(pc, msg, "Liked'em.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-3-2"){
		choices['4']['surfeit_of_cherries_1-4-2'] = {txt: "How much is \"a lot\"?", value: 'surfeit_of_cherries_1-4-2'};
		this.conversation_reply(pc, msg, "A lot.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-4-2"){
		choices['5']['surfeit_of_cherries_1-5-2'] = {txt: "Oh. Well… Thanks?", value: 'surfeit_of_cherries_1-5-2'};
		this.conversation_reply(pc, msg, "A LOT.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-5-2"){
		choices['6']['surfeit_of_cherries_1-6-2'] = {txt: "I will.", value: 'surfeit_of_cherries_1-6-2'};
		this.conversation_reply(pc, msg, "Ask pig.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_1', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_surfeit_of_cherries_3(pc){ // defined by conversation auto-builder for "surfeit_of_cherries_3"
	var chain = {
		id: "surfeit_of_cherries",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "surfeit_of_cherries_2")){
			return true;
	}
	return false;
}

function conversation_run_surfeit_of_cherries_3(pc, msg, replay){ // defined by conversation auto-builder for "surfeit_of_cherries_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "surfeit_of_cherries_3";
	var conversation_title = "The Surfeit of Cherries";
	var chain = {
		id: "surfeit_of_cherries",
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
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['surfeit_of_cherries_3-0-2'] = {txt: "You used to be multi-fruit trees?", value: 'surfeit_of_cherries_3-0-2'};
		this.conversation_start(pc, "“All fruit. Me. Backwhen. Me.”", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-0-2"){
		choices['1']['surfeit_of_cherries_3-1-2'] = {txt: "That must have been hardcore.", value: 'surfeit_of_cherries_3-1-2'};
		this.conversation_reply(pc, msg, "All fruit.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-1-2"){
		choices['2']['surfeit_of_cherries_3-2-2'] = {txt: "That’s what I heard from the pig.", value: 'surfeit_of_cherries_3-2-2'};
		this.conversation_reply(pc, msg, "But Pot.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-2-2"){
		choices['3']['surfeit_of_cherries_3-3-2'] = {txt: "Cherries are ok…", value: 'surfeit_of_cherries_3-3-2'};
		this.conversation_reply(pc, msg, "Cherries.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-3-2"){
		choices['4']['surfeit_of_cherries_3-4-2'] = {txt: "But, you know? It's ok. We have fruitchanging now. ", value: 'surfeit_of_cherries_3-4-2'};
		this.conversation_reply(pc, msg, "Just. Cherries.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-4-2"){
		choices['5']['surfeit_of_cherries_3-5-2'] = {txt: "Nicely done.", value: 'surfeit_of_cherries_3-5-2'};
		this.conversation_reply(pc, msg, "Yes. When Fruit Tree gives you cherries, make lemons.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'surfeit_of_cherries_3', msg.choice);
	}

	if (msg.choice == "surfeit_of_cherries_3-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "surfeit_of_cherries_3-2-2") && (!replay)){
		if (this.isOnGround()){
			var val = pc.createItemFromSource("cherry", 250 * msg.count, this);
		}else{
			var val = pc.createItem("cherry", 250 * msg.count);
		}
		if (val){
			self_effects.push({
				"type"	: "item_give",
				"which"	: "cherry",
				"value"	: val
			});
		}
	}

}

function conversation_canoffer_creator_of_the_universe_1(pc){ // defined by conversation auto-builder for "creator_of_the_universe_1"
	var chain = {
		id: "creator_of_the_universe",
		level: 1,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.conversations_has_completed(null, "surfeit_of_cherries_3")) && (pc.conversations_has_completed(null, "the_first_rock_4"))){
			return true;
	}
	return false;
}

function conversation_run_creator_of_the_universe_1(pc, msg, replay){ // defined by conversation auto-builder for "creator_of_the_universe_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "creator_of_the_universe_1";
	var conversation_title = "The Creator of the Universe";
	var chain = {
		id: "creator_of_the_universe",
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
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['creator_of_the_universe_1-0-2'] = {txt: "What about him? ", value: 'creator_of_the_universe_1-0-2'};
		this.conversation_start(pc, "Pot.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-0-2"){
		choices['1']['creator_of_the_universe_1-1-2'] = {txt: "EVERYTHING? What about the other giants?", value: 'creator_of_the_universe_1-1-2'};
		this.conversation_reply(pc, msg, "Made everything.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-1-2"){
		choices['2']['creator_of_the_universe_1-2-2'] = {txt: "What? They’re ALL Pot?", value: 'creator_of_the_universe_1-2-2'};
		this.conversation_reply(pc, msg, "Pot.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-2-2"){
		choices['3']['creator_of_the_universe_1-3-2'] = {txt: "Why?", value: 'creator_of_the_universe_1-3-2'};
		this.conversation_reply(pc, msg, "No. Pot Made’em.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-3-2"){
		choices['4']['creator_of_the_universe_1-4-2'] = {txt: "That doesn’t sound right.", value: 'creator_of_the_universe_1-4-2'};
		this.conversation_reply(pc, msg, "Just did.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-4-2"){
		choices['5']['creator_of_the_universe_1-5-2'] = {txt: "I had no idea he was so powerful.", value: 'creator_of_the_universe_1-5-2'};
		this.conversation_reply(pc, msg, "'Tis.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-5-2"){
		choices['6']['creator_of_the_universe_1-6-2'] = {txt: "Mhm.", value: 'creator_of_the_universe_1-6-2'};
		this.conversation_reply(pc, msg, "Mmf.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_1', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_brief_thoughts_of_the_fruit_tree_1(pc){ // defined by conversation auto-builder for "brief_thoughts_of_the_fruit_tree_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if ((pc.stats.level >= 5) && (pc.getQuestStatus("donate_to_all_shrines") == 'done')){
			return true;
	}
	return false;
}

function conversation_run_brief_thoughts_of_the_fruit_tree_1(pc, msg, replay){ // defined by conversation auto-builder for "brief_thoughts_of_the_fruit_tree_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "brief_thoughts_of_the_fruit_tree_1";
	var conversation_title = "Brief Thoughts of the Fruit Tree";
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
	choices['10'] = {};
	if (!msg.choice){
		choices['0']['brief_thoughts_of_the_fruit_tree_1-0-2'] = {txt: "‘Sup.", value: 'brief_thoughts_of_the_fruit_tree_1-0-2'};
		this.conversation_start(pc, "Hey.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-0-2"){
		choices['1']['brief_thoughts_of_the_fruit_tree_1-1-2'] = {txt: "What’s that?", value: 'brief_thoughts_of_the_fruit_tree_1-1-2'};
		this.conversation_reply(pc, msg, "True fact:…", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-1-2"){
		choices['2']['brief_thoughts_of_the_fruit_tree_1-2-2'] = {txt: "Only one?", value: 'brief_thoughts_of_the_fruit_tree_1-2-2'};
		this.conversation_reply(pc, msg, "Only one giant.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-2-2"){
		choices['3']['brief_thoughts_of_the_fruit_tree_1-3-2'] = {txt: "So you say.", value: 'brief_thoughts_of_the_fruit_tree_1-3-2'};
		this.conversation_reply(pc, msg, "Only Pot.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-3-2"){
		choices['4']['brief_thoughts_of_the_fruit_tree_1-4-2'] = {txt: "But what about the others?", value: 'brief_thoughts_of_the_fruit_tree_1-4-2'};
		this.conversation_reply(pc, msg, "Do.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-4-2"){
		choices['5']['brief_thoughts_of_the_fruit_tree_1-5-2'] = {txt: "Pot did?", value: 'brief_thoughts_of_the_fruit_tree_1-5-2'};
		this.conversation_reply(pc, msg, "Made them up.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-5-2"){
		choices['6']['brief_thoughts_of_the_fruit_tree_1-6-2'] = {txt: "But why?", value: 'brief_thoughts_of_the_fruit_tree_1-6-2'};
		this.conversation_reply(pc, msg, "Yup.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-6-2"){
		choices['7']['brief_thoughts_of_the_fruit_tree_1-7-2'] = {txt: "So all the shrines…", value: 'brief_thoughts_of_the_fruit_tree_1-7-2'};
		this.conversation_reply(pc, msg, "Makes people feel special. Shrines. Stuff.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-7-2"){
		choices['8']['brief_thoughts_of_the_fruit_tree_1-8-2'] = {txt: "But but but…", value: 'brief_thoughts_of_the_fruit_tree_1-8-2'};
		this.conversation_reply(pc, msg, "Belong to Pot.", choices['8'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-8-2"){
		choices['9']['brief_thoughts_of_the_fruit_tree_1-9-2'] = {txt: "OK.", value: 'brief_thoughts_of_the_fruit_tree_1-9-2'};
		this.conversation_reply(pc, msg, "Just what I heard. Just saying.", choices['9'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_1', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_1-9-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_brief_thoughts_of_the_fruit_tree_2(pc){ // defined by conversation auto-builder for "brief_thoughts_of_the_fruit_tree_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "brief_thoughts_of_the_fruit_tree_1")){
			return true;
	}
	return false;
}

function conversation_run_brief_thoughts_of_the_fruit_tree_2(pc, msg, replay){ // defined by conversation auto-builder for "brief_thoughts_of_the_fruit_tree_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "brief_thoughts_of_the_fruit_tree_2";
	var conversation_title = "Brief Thoughts of the Fruit Tree";
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
		choices['0']['brief_thoughts_of_the_fruit_tree_2-0-2'] = {txt: "What?", value: 'brief_thoughts_of_the_fruit_tree_2-0-2'};
		this.conversation_start(pc, "Heh.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-0-2"){
		choices['1']['brief_thoughts_of_the_fruit_tree_2-1-2'] = {txt: "Remembering what?", value: 'brief_thoughts_of_the_fruit_tree_2-1-2'};
		this.conversation_reply(pc, msg, "Remembering.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-1-2"){
		choices['2']['brief_thoughts_of_the_fruit_tree_2-2-2'] = {txt: "Red?", value: 'brief_thoughts_of_the_fruit_tree_2-2-2'};
		this.conversation_reply(pc, msg, "Potian called Red. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-2-2"){
		choices['3']['brief_thoughts_of_the_fruit_tree_2-3-2'] = {txt: "What things?", value: 'brief_thoughts_of_the_fruit_tree_2-3-2'};
		this.conversation_reply(pc, msg, "Red hid things.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-3-2"){
		choices['4']['brief_thoughts_of_the_fruit_tree_2-4-2'] = {txt: "Precious things?", value: 'brief_thoughts_of_the_fruit_tree_2-4-2'};
		this.conversation_reply(pc, msg, "Secret things.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-4-2"){
		choices['5']['brief_thoughts_of_the_fruit_tree_2-5-2'] = {txt: "And, ah, where might these be?", value: 'brief_thoughts_of_the_fruit_tree_2-5-2'};
		this.conversation_reply(pc, msg, "Precious things.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-5-2"){
		choices['6']['brief_thoughts_of_the_fruit_tree_2-6-2'] = {txt: "Up?", value: 'brief_thoughts_of_the_fruit_tree_2-6-2'};
		this.conversation_reply(pc, msg, "Up. ", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-6-2"){
		choices['7']['brief_thoughts_of_the_fruit_tree_2-7-2'] = {txt: "Up…", value: 'brief_thoughts_of_the_fruit_tree_2-7-2'};
		this.conversation_reply(pc, msg, "Up.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'brief_thoughts_of_the_fruit_tree_2', msg.choice);
	}

	if (msg.choice == "brief_thoughts_of_the_fruit_tree_2-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"surfeit_of_cherries_1",
	"surfeit_of_cherries_3",
	"creator_of_the_universe_1",
	"brief_thoughts_of_the_fruit_tree_1",
	"brief_thoughts_of_the_fruit_tree_2",
];

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("light_green_thumb_1"))) out.push([2, "Petting and watering this is easier with <a href=\"\/skills\/6\/\" glitch=\"skill|light_green_thumb_1\">Light Green Thumb<\/a>."]);
	if (pc && (!pc.skills_has("gardening_1"))) out.push([2, "Harvesting this is easier with <a href=\"\/skills\/9\/\" glitch=\"skill|gardening_1\">Arborology<\/a>."]);
	out.push([2, "You can grow this by planting a <a href=\"\/items\/292\/\" glitch=\"item|bean_fruit\">Fruit Tree Bean<\/a> in a <a href=\"\/items\/94\/\" glitch=\"item|patch\">Patch<\/a>."]);
	out.push([2, "Harvesting this will yield <a href=\"\/items\/138\/\" glitch=\"item|cherry\">Cherries<\/a> which can be converted into other kinds of fruit using the <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_bonus_g3": [
		"PaZOW!",
		"Shazam!",
		"Da-DAH!",
	],
	"harvest_bonus_g4": [
		"Trrrrrrrrrrrrrrrring!",
		"Pow!!!",
		"Kabloozle!",
	],
	"harvest_bonus_g5": [
		"FROOTEH!!!!1!",
		"Superfruits!",
		"ZAP!",
	],
	"harvest_drop_g3": [
		"Huh? Meh.",
		"Wuh? Oh. Peh.",
	],
	"harvest_drop_g4": [
		"Whu? OH!",
		"Woah. Wan?",
	],
	"harvest_drop_g5": [
		"S'prise!",
		"Tadaaah! F'yoo!",
		"W00t!",
	],
	"harvest_g1": [
		"Yup.",
		"Mhm.",
		"Frooo?",
		"Wannit?",
		"F'yoo.",
	],
	"harvest_g2_g3": [
		"Aa'ight?",
		"Takkit.",
		"Here.",
		"Fruit?",
		"Dunnit…",
	],
	"harvest_g4_g5": [
		"Fruity!",
		"Ta-daaaaaaa…",
		"Yaaaaaay!",
		"Frooooot!",
		"C'est la!",
	],
	"pet_drop_lgt2": [
		"Ah!",
		"Huh!",
	],
	"pet_drop_lgt3": [
		"OoOOoooh!",
		"Tataaaaaa!",
		"Voila!",
	],
	"pet_lgt1": [
		"Hm…",
		"Rrrr…",
		"Aw…",
		"Mhm…",
		"Woo!",
	],
	"pet_lgt2": [
		"Hm.",
		"Rrrr.",
		"Aw.",
		"Woo.",
		"Mhm.",
	],
	"pet_lgt3": [
		"Rrrrrowr!",
		"Mmmmmm…",
		"Squeeee!!!1!",
		"Ariiiiiiight.",
		"Hi-hi-hi-hi-hi!",
	],
	"pet_na": [
		"Huh?",
		"Oh.",
		"Whu?",
		"Ah.",
		"Pff.",
	],
	"pet_na_failed": [
		"Nein",
		"Nah",
		"Nyet",
	],
	"revived_1st_time": [
		"Ah. But more? Please? Ow.",
		"Twice more?",
		"Help more?",
		"Someone else? Help?",
	],
	"revived_2nd_time": [
		"Almost.",
		"Once more?",
		"Nearly unrooked.",
	],
	"revived_3rd_time": [
		"Yay, {pc_label}!",
		"Ta, {pc_label}!",
		"{pc_label}! MWAH!",
	],
	"rooked": [
		"ARGH!",
		"ROOKED!",
		"THE ROOK! AAAIIIIIIIII!!!",
		"HELP!",
		"PAIN! IN PAIN! HELP!",
	],
	"water_drop_lgt2": [
		"Rah!",
		"Yip!",
	],
	"water_drop_lgt3": [
		"Too-looooo!",
		"Trant-ta-ta!",
		"Yaaaaaaay!",
	],
	"water_lgt1": [
		"Sluuuurp.",
		"Glug-glug.",
		"Mmm.",
		"Splosh.",
		"Psahhh.",
	],
	"water_lgt2": [
		"Splot-splot-splotsplot.",
		"Slurrrrrrrp.",
		"Glug-glug-glug.",
		"Ahhhhhhhhh.",
		"Splish-splash-slosh.",
	],
	"water_lgt3": [
		"Haithankoo…",
		"Sssssssluuuurp…",
		"*glug-glug-glug-glug-ahhhhhh.*",
		"Woooyeah!…",
		"Ahhhhhh!",
	],
	"water_na": [
		"Hm?",
		"Ahh.",
		"Glug.",
		"Mm?",
		"Shhhlrp.",
	],
	"water_na_failed": [
		"Nup.",
		"Non.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-93,"y":-199,"w":185,"h":190},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKLklEQVR42t1YaWwc5RmOaKUEIeTS\nShUpEJ+xd722d22vjz1nT8\/u7DGzt\/ec9Z4+1js+szk9cRwTOweDaQhJSDIKKQSiwCSNFKCkjNRI\nVS8yjcRZqEZqaWl\/jSqBEL++7rcoFKhUUo5idaSRVjPf9+nZ933e53nf2bDh\/\/0CP79Rv27B8ZU9\n3NVomHyhVFGKV27S6wrcn08+gTzS+kNlrjyA749h9T+xxNZfJAuF3jqTsYXWDjTgyclOZN0BXDyY\nRJbJNGc0NDHxcqf0+fcfvv0hAl76XR14+YbyfwLoRNM9dTcXFqnXD56h3nvip0is3EHhCRnvDsrF\nSElRAzF3AGVqxVMF9rTNgB9WbaHWZPeS77\/1IfmNAfvb2afxahQQ8ccnKci7s7YUDp+\/evpZ5uR0\niMoM22hiokOIl1Xk\/IqDjU52IzdmZ+uPRk1kb29THVx7NbeDf+Psi+TPZpe4Nw6s0h+8+QEO\/gjq\nvhKwo\/LN9e8cXiNhBC6n5vAXZxYYe7QbeWXnbu5yJkXDCC3rm6iYw0Jnlk10bKpXKu01C\/ZYE4sW\nu6ijxxdxg76Zxzzt+K6UDV9r20xdpCa5XMMD+OtnLwtfGSBM6T59oxJLqfA\/nDlDvX3hAtJqk3OL\niwuU0dDMPjOzm74YKVMmtF8c3aXnA8UOLhZvZ4PpLubgkax4qlTizJoWKZRVsAVSJuazXVRKtVXA\neloFfX\/jV+Pl+EoQv6dpQ50v061UuRQCV55gkul+1h7vEiJhp3h9L0MfDXqF4+MRasCvFEac9loV\nJ\/rvU95K6fxulN9RCnBVrtJmewNSLSTGo20Fhp4GSatt\/PKyVFrxKUf3ucTvN22iiWI712mXS8uV\neWlsJIRA50g7UepEkGBcnnY20rNF0g42iAnURP3lNMeFzN3IX5+6xL178Sp50KFjoZDDM1WGZnzA\n1ipi+FbJ6tN9uYLJLdjo2AKGe6Y1SGYXIqUrLilUaKrzExrm16tHmVfPXCQ5AuOE41fAuNspeb1d\ndDHvpK4\/eY6+XtnOHnNFyfP79jIzmIYbtg6KyVkL9+bKYW7bwwQzONzPQir0WVRsenmWu1XpH934\nuxLK0W0BjFbFlij1Slq8TSjssTGHju8B77\/1kTIzNKT0mtS0V90mPLs0z57HQ\/zl1QeFPOHgjbom\n8dBUVJoKyZmXjz+i\/MW2OYBinWBkfgBUHomzI7Yf4aUDmDi+FAFDRrXgHveBxLxejFId3LSv+WMZ\nqhYPlK8v9PUTFwp1C2sePLlDw2TSfeyvrr7AvVSerkmKRSeXrPc1SDtcMh46yHLIxSbSPZJnWMYf\njBPioq0N78Laad1wC29GW0Firg\/kdxn4\/INDXGUlghcDajGZ1\/DmZAdvim\/l4ZmtVhl5aWY7e2rX\nbD3cf1tRXDrmI7cfGaJ\/f\/4c+3DAy\/p7VRyiaODNerlIYG0gWlYwZ\/W9FHSHSgzDM4SbjnhdUmxC\nXu\/OdlD6gAI4ox18JqNi5lYc\/Oyqg0yhGioUCtWVl\/QUOa\/mImUV3mRrqutwtnOLGIZDRbi2bY28\n7VTD691rN8nLATe1jA9wPlQuod5WoMZkIFxAhECil4JroCin\/ZiIE33Ake1hIUVGhwfpcYua9k\/0\nscaEjO72NSozTjvz+fMNhnZ8UNMoQoqYjE2184TFY+Q\/uGvUbfV4r62e4Jcd\/fQL8xRvcvSSyGA1\ndW6dFJzDwMxBO1uztRUUn6adQiDaC1z5bqlyuqgsDBtr78qHAlJqrl8iptR00KUTPn0+rOxnprZx\nK+kE9dD0OKXRNCCAf4Wd6TcrTxTC5GuL+7843SfRAQpyLZgy4JXHVhlvOQ4MhIEbm4jz+ZiSC051\n8\/6yUkpUBrhspg+gPfJalCb3BnlywSTMHBiiI1O9AEm1gFTqY4B6331KNKSi4tU\/Ch0KOtXVaIip\ndkPCgcEG+nsNG6mxJZyrFM3\/WcTf498hod9CH0VdreLO\/RExRnUANN0mZLf38SOOITLrRvjcfjOe\nqWiA36sCYV23CPcmHaYa76Z2WflQRsHiI11irugUIR0MoQY2TCKg1Sajzw6laIdDRgrP8SQRMkoq\ndydwpvqE3B4ruLq2RMb2Y\/VjS97P6iU0cBhe2BDA6MFnqZSGOf\/Y4+Kjxx4UrEkZX96nq0Xq2qmL\nVBZH+ey0niq5HfSc1wmyVhM56UGZREWvDJbUdIqQU0n\/IOuMdPBj83reb32AtZu7JQMqZwZcDYLO\n28IURw1gbC8B0hUNk97hAfndJk7tbOF85QFYkP8CCEUTeu9vVpapYg5lFA4ZP0sH2CsTI+DRcpje\nOahiCzZbDbR04Qp1RHU\/\/dxInByzmYQJr4uZ8blAyueRgj4PbkrJqeBMP41NdNdHQ0YhWtQwkZKK\ny5pUlEWtEHSDDTyauJ+359tBnOoBmZ1Gmih10TkaFVJjRtKZ7+eikxoEyt4nACEnlozN5Ei4n1wJ\neVks3i0u5wrC89vnWXdzI2\/TtPCxISMLhftCyIfAVh9yCO4lw24uE\/GDbNgPIjbbZwgeQa382A5D\nTT5gpK1dXbWoJMMYSyTkQsrTjI9XCK447RVJq4orLxrJcVrL7XnI+W+Vv+GXK+e4kKYbqXorezpX\nEo\/0dHI7tR1cXN\/Gm7Y2ArO2DX\/u8Cnp0p79zHzeh6DONuGV88\/TsHFNh\/1suZpmW4\/qM8PTBGr7\npIJTw0E67sXYKR8uHJ6kpFTULMytOujSbhvt86nx29ZAWBywHfrt2qGaFcUoBZtI9oAnx4rckqGX\nm7f0CJXqHAKrL+zrEmG3AvelHTaR0Gu4T59FYUM1gBMuB1nAXVIQd\/NPZUdISJFraysUManmYe\/4\npTsbCBRGFN7T5nZ8ZypGPZobBZaIQhge7WQdgVYSNhRwLaxu0m4GWrm8lvpExKeMBAg+TbiYIuEC\nwSE1fXJxloJDVr7Ksbeevv71zSqQe9COdAMNzIzLwfbbO0GjRV5rvXIYWksPbCrCJh2ImvRCrPqs\njGNCOkjUuOl3oyCZ6mMJaweP6Js5qBLnhhJf\/zBVrUAS2pNFLwPWwU4W02rrE1aEv1Xh425UgoCG\n\/V5Q8mIgY0WAF7UzDoeDzJjNSmiH0M9j5Xb8GxmgID+hNcG74EKZScwGcoRL9Fd\/Q5CFEMHE\/B4Q\nwTEQwVDR19f37c7Lcx4UTwR9YsppA0mnHYx4MCkf9oGRKsCYScutmyHeox3AU3YTM+Z2ilQ1ghUC\nA6NDlvX1vebWBcFBZwnZ7evvcwhsTMlIAERxFzBrNOsP4EhVXvIuFPh1A8DQKVt\/AJN2CxOqamHI\nZFifAKvSI5B2E4gguvUHEDpJBkMB6bABQj8IdAoZub74V\/ViyL9sFWRyyArMKiW\/rgD69FoxZjOD\nYQsCwlUOGjsVf2ravHlL9dV3vk1cGzdt2rTlzjvvDGg62g\/pOxUvouqem6rmxkuKxvrH77jjjtG7\n7rrLvnHjxq13373hB9X13\/1vDv8n\/sJvsDJYhekAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288917444-3980.swf",
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

log.info("trant_fruit.js LOADED");

// generated ok 2012-12-03 17:58:05 by martlume
